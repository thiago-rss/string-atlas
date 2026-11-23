/**
 * Pure Web Audio API 24-TET Electric Guitar, Studio Tone/FX Rack, Modal Drone,
 * Procedural Etude & Vamp/Sayr Synth Engine v6.0
 */
import { qToFreq } from '../core/theory24.js';

function makeDriveCurve(amount, asymmetric = false) {
  const samples = 2048;
  const curve = new Float32Array(samples);
  if (amount <= 0.01) {
    for (let i = 0; i < samples; i += 1) {
      curve[i] = (i * 2) / samples - 1;
    }
    return curve;
  }
  const k = amount;
  for (let i = 0; i < samples; i += 1) {
    const x = (i * 2) / samples - 1;
    if (asymmetric) {
      // Thick fuzz with slight even-harmonic asymmetry
      const shifted = x + 0.14;
      curve[i] = Math.tanh(shifted * k) - Math.tanh(0.14 * k) * 0.4;
    } else {
      curve[i] = Math.tanh(x * k);
    }
  }
  return curve;
}

class SynthEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.guitarBus = null;
    this.driveShaper = null;
    this.drivePreGain = null;
    this.drivePostGain = null;
    this.cabFilter = null;
    this.tremoloGain = null;
    this.tremoloLfo = null;
    this.tremoloDepthGain = null;
    this.delayNode = null;
    this.delayFeedback = null;
    this.delayWet = null;

    this.droneNodes = null;
    this.scaleTimerIds = [];

    // Phase 6 Studio Tone & FX State
    this.fxConfig = {
      tonePreset: 'clean', // 'clean' | 'swell' | 'crunch' | 'fuzz'
      delayMix: 0.22,
      delayTime: 0.28,
      tremoloDepth: 0.0,
      tremoloRate: 4.2,
      masterVolume: 0.72
    };

    // Lookahead Procedural Etude Sequencer state
    this.etudeTimerId = null;
    this.etudePlaying = false;
    this.etudeNextTime = 0;
    this.etudeStepIdx = 0;
    this.etudeUiTimeouts = [];

    // Lookahead Modal Vamp & Sayr Sequencer state
    this.vampTimerId = null;
    this.vampPlaying = false;
    this.vampNextBeatTime = 0;
    this.vampStepIdx = 0;
    this.vampBarInStep = 0;
    this.vampBeatInBar = 0;
    this.vampUiTimeouts = [];
  }

  ensureContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.fxConfig.masterVolume;

      // Guitar voice processing chain: guitarBus -> drivePre -> shaper -> drivePost -> cab -> tremolo -> master + delay
      this.guitarBus = this.ctx.createGain();
      this.drivePreGain = this.ctx.createGain();
      this.driveShaper = this.ctx.createWaveShaper();
      this.driveShaper.oversample = '2x';
      this.drivePostGain = this.ctx.createGain();

      this.cabFilter = this.ctx.createBiquadFilter();
      this.cabFilter.type = 'lowpass';
      this.cabFilter.Q.value = 0.85;

      // Optical-style Tremolo stage
      this.tremoloGain = this.ctx.createGain();
      this.tremoloGain.gain.value = 1.0;

      this.tremoloLfo = this.ctx.createOscillator();
      this.tremoloLfo.type = 'sine';
      this.tremoloLfo.frequency.value = this.fxConfig.tremoloRate;

      this.tremoloDepthGain = this.ctx.createGain();
      this.tremoloDepthGain.gain.value = 0.0;
      this.tremoloLfo.connect(this.tremoloDepthGain);
      this.tremoloDepthGain.connect(this.tremoloGain.gain);
      this.tremoloLfo.start();

      // Parallel Ambient Delay Bus
      this.delayNode = this.ctx.createDelay(1.2);
      this.delayNode.delayTime.value = this.fxConfig.delayTime;

      this.delayFeedback = this.ctx.createGain();
      this.delayFeedback.gain.value = 0.28;

      const delayFilter = this.ctx.createBiquadFilter();
      delayFilter.type = 'lowpass';
      delayFilter.frequency.value = 2500;

      this.delayWet = this.ctx.createGain();
      this.delayWet.gain.value = this.fxConfig.delayMix;

      this.guitarBus
        .connect(this.drivePreGain)
        .connect(this.driveShaper)
        .connect(this.drivePostGain)
        .connect(this.cabFilter)
        .connect(this.tremoloGain);

      this.tremoloGain.connect(this.masterGain);
      this.tremoloGain.connect(this.delayNode);

      this.delayNode.connect(delayFilter);
      delayFilter.connect(this.delayFeedback);
      this.delayFeedback.connect(this.delayNode);
      delayFilter.connect(this.delayWet);
      this.delayWet.connect(this.masterGain);

      this.masterGain.connect(this.ctx.destination);
      this.applyToneFxToNodes();
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  /**
   * Smoothly updates Studio Tone Preset & FX Rack parameters live
   */
  updateToneFx(patch = {}) {
    Object.assign(this.fxConfig, patch);
    if (this.ctx) {
      this.applyToneFxToNodes();
    }
  }

  applyToneFxToNodes() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const cfg = this.fxConfig;

    let pre = 1.0;
    let post = 1.0;
    let cabHz = 6800;
    let curveAmt = 0;
    let asym = false;
    let fb = 0.26;

    if (cfg.tonePreset === 'swell') {
      pre = 1.0;
      post = 1.05;
      cabHz = 4400;
      fb = 0.44;
    } else if (cfg.tonePreset === 'crunch') {
      pre = 2.4;
      post = 0.72;
      cabHz = 3400;
      curveAmt = 3.2;
      fb = 0.24;
    } else if (cfg.tonePreset === 'fuzz') {
      pre = 4.5;
      post = 0.56;
      cabHz = 2250;
      curveAmt = 8.5;
      asym = true;
      fb = 0.22;
    }

    this.drivePreGain.gain.setTargetAtTime(pre, now, 0.03);
    this.driveShaper.curve = makeDriveCurve(curveAmt, asym);
    this.drivePostGain.gain.setTargetAtTime(post, now, 0.03);
    this.cabFilter.frequency.setTargetAtTime(cabHz, now, 0.04);

    this.delayNode.delayTime.setTargetAtTime(Math.max(0.08, Math.min(0.85, cfg.delayTime)), now, 0.06);
    this.delayWet.gain.setTargetAtTime(Math.max(0, Math.min(0.7, cfg.delayMix)), now, 0.03);
    this.delayFeedback.gain.setTargetAtTime(fb, now, 0.04);

    const depth = Math.max(0, Math.min(0.85, cfg.tremoloDepth));
    this.tremoloGain.gain.setTargetAtTime(1.0 - depth * 0.48, now, 0.03);
    this.tremoloDepthGain.gain.setTargetAtTime(depth * 0.48, now, 0.03);
    this.tremoloLfo.frequency.setTargetAtTime(Math.max(1.0, Math.min(10.0, cfg.tremoloRate)), now, 0.04);

    this.masterGain.gain.setTargetAtTime(Math.max(0.1, Math.min(1.0, cfg.masterVolume)), now, 0.03);
  }

  pluckFreq(freq, { duration = 1.6, velocity = 0.34, harmonicBell = false, when = null, bendFromRatio = null } = {}) {
    const ctx = this.ensureContext();
    const now = when !== null ? when : ctx.currentTime;
    const isSwell = !harmonicBell && this.fxConfig.tonePreset === 'swell';
    const effDuration = isSwell ? Math.max(duration, 2.2) : duration;

    const voiceGain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.Q.value = harmonicBell ? 3.2 : 1.4;

    const startCutoff = harmonicBell ? Math.min(freq * 6, 9000) : Math.min(freq * 7.5, 5800);
    const endCutoff = harmonicBell ? Math.min(freq * 2.5, 3600) : Math.max(freq * 1.4, 420);

    filter.frequency.setValueAtTime(isSwell ? endCutoff : startCutoff, now);
    if (isSwell) {
      filter.frequency.exponentialRampToValueAtTime(startCutoff * 0.72, now + 0.32);
      filter.frequency.exponentialRampToValueAtTime(endCutoff, now + effDuration * 0.85);
    } else {
      filter.frequency.exponentialRampToValueAtTime(endCutoff, now + effDuration * 0.65);
    }

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();

    if (harmonicBell) {
      osc1.type = 'sine';
      osc2.type = 'triangle';
      osc1.frequency.setValueAtTime(freq, now);
      osc2.frequency.setValueAtTime(freq * 2, now);
    } else {
      osc1.type = 'triangle';
      osc2.type = 'sawtooth';
      if (bendFromRatio) {
        osc1.frequency.setValueAtTime(freq * bendFromRatio, now);
        osc1.frequency.exponentialRampToValueAtTime(freq, now + 0.085);
        osc2.frequency.setValueAtTime(freq * bendFromRatio * 1.0018, now);
        osc2.frequency.exponentialRampToValueAtTime(freq * 1.0018, now + 0.085);
      } else {
        osc1.frequency.setValueAtTime(freq, now);
        osc2.frequency.setValueAtTime(freq * 1.0018, now);
      }
    }

    const mix2 = ctx.createGain();
    mix2.gain.value = harmonicBell ? 0.14 : (this.fxConfig.tonePreset === 'fuzz' ? 0.38 : 0.22);

    osc1.connect(filter);
    osc2.connect(mix2);
    mix2.connect(filter);
    filter.connect(voiceGain);
    voiceGain.connect(this.guitarBus);

    const attack = isSwell ? 0.24 : 0.009;
    voiceGain.gain.setValueAtTime(0.0001, now);
    voiceGain.gain.linearRampToValueAtTime(velocity, now + attack);
    voiceGain.gain.exponentialRampToValueAtTime(0.0008, now + effDuration);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + effDuration + 0.05);
    osc2.stop(now + effDuration + 0.05);
  }

  pluckQ(q, opts = {}) {
    this.pluckFreq(qToFreq(q), opts);
  }

  /** Auditions an Ear Trainer prompt spec cleanly (interval, scale, or chord) */
  playEarPrompt(spec) {
    if (!spec) return;
    const ctx = this.ensureContext();
    const now = ctx.currentTime + 0.03;

    if (spec.type === 'interval') {
      this.pluckQ(spec.baseQ, { duration: 1.5, velocity: 0.34, when: now });
      this.pluckQ(spec.targetQ, { duration: 1.8, velocity: 0.36, when: now + 0.65 });
      return;
    }

    if (spec.type === 'chord') {
      this.playModalPad({
        rootQ: spec.rootQ,
        intervalsQ: spec.intervalsQ,
        duration: 2.3,
        when: now,
        style: 'strum'
      });
      return;
    }

    if (spec.type === 'scale') {
      const baseQ = 96 + (spec.rootQ % 24);
      const seq = [...spec.intervalsQ, 24].map((iv) => baseQ + iv);
      seq.forEach((q, idx) => {
        this.pluckQ(q, { duration: 0.9, velocity: 0.34, when: now + idx * 0.28 });
      });
    }
  }

  triggerEtudeEvent(ev, { when = null, stepDur = 0.35 } = {}) {
    const isHarmonic = ev.kind === 'harmonic';
    const isBend = ev.articulation === 'B↑¼';
    const vel = ev.accent ? 0.42 : 0.31;
    const dur = isHarmonic ? Math.max(1.6, stepDur * 3.2) : Math.max(0.45, stepDur * 1.65);

    this.pluckFreq(ev.freq, {
      duration: dur,
      velocity: vel,
      harmonicBell: isHarmonic,
      when,
      bendFromRatio: isBend ? 0.97153 : null
    });
  }

  triggerGuideClick(time, accented) {
    const ctx = this.ensureContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(accented ? 1320 : 880, time);
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.linearRampToValueAtTime(accented ? 0.14 : 0.06, time + 0.002);
    gain.gain.exponentialRampToValueAtTime(0.0008, time + 0.032);
    osc.connect(gain).connect(ctx.destination);
    osc.start(time);
    osc.stop(time + 0.04);
  }

  startEtudeSequencer(getConfig, { onStep, onLoopBump, onComplete } = {}) {
    this.stopEtudeSequencer();
    const ctx = this.ensureContext();
    this.etudePlaying = true;
    this.etudeStepIdx = 0;
    this.etudeNextTime = ctx.currentTime + 0.05;

    this.etudeTimerId = setInterval(() => {
      if (!this.etudePlaying) return;
      const cfg = getConfig();
      const events = cfg.events || [];
      if (!events.length) {
        this.stopEtudeSequencer();
        if (onComplete) onComplete();
        return;
      }

      const scheduleAhead = 0.12;
      while (this.etudeNextTime < ctx.currentTime + scheduleAhead && this.etudePlaying) {
        if (this.etudeStepIdx >= events.length) {
          if (cfg.loop) {
            this.etudeStepIdx = 0;
            if (cfg.autoBpm && onLoopBump) {
              onLoopBump();
            }
          } else {
            const endDelay = Math.max(0, (this.etudeNextTime - ctx.currentTime) * 1000 + 120);
            this.etudePlaying = false;
            clearInterval(this.etudeTimerId);
            this.etudeTimerId = null;
            const endTid = setTimeout(() => {
              if (onComplete) onComplete();
            }, endDelay);
            this.etudeUiTimeouts.push(endTid);
            return;
          }
        }

        const freshCfg = getConfig();
        const bpm = Math.max(40, Math.min(220, freshCfg.bpm || 92));
        const stepDur = (60 / bpm) * 0.5;
        const idx = this.etudeStepIdx;
        const ev = events[idx];

        this.triggerEtudeEvent(ev, { when: this.etudeNextTime, stepDur });
        if (freshCfg.clickOn) {
          this.triggerGuideClick(this.etudeNextTime, Boolean(ev.accent));
        }

        const uiDelay = Math.max(0, (this.etudeNextTime - ctx.currentTime) * 1000);
        const snapIdx = idx;
        const snapEv = ev;
        const tid = setTimeout(() => {
          if (this.etudePlaying && onStep) {
            onStep(snapIdx, snapEv);
          }
        }, uiDelay);
        this.etudeUiTimeouts.push(tid);

        this.etudeStepIdx += 1;
        this.etudeNextTime += stepDur;
      }
    }, 25);
  }

  playModalPad({ rootQ, intervalsQ, duration = 2.6, when = null, style = 'pad' } = {}) {
    const ctx = this.ensureContext();
    const now = when !== null ? when : ctx.currentTime;
    const bassQ = 72 + (rootQ % 24);
    const upperBaseQ = 96 + (rootQ % 24);
    const chordQs = [bassQ, ...intervalsQ.slice(0, 5).map((iv) => upperBaseQ + iv)];

    if (style === 'strum') {
      const perVel = Math.min(0.24, 0.6 / Math.sqrt(chordQs.length));
      chordQs.forEach((q, idx) => {
        this.pluckQ(q, {
          duration: Math.max(1.4, duration * 0.95),
          velocity: perVel,
          when: now + idx * 0.045
        });
      });
      return;
    }

    const padGain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(980, now);
    filter.frequency.exponentialRampToValueAtTime(480, now + duration);
    filter.Q.value = 1.1;

    padGain.gain.setValueAtTime(0.0001, now);
    padGain.gain.linearRampToValueAtTime(0.19, now + Math.min(0.28, duration * 0.2));
    padGain.gain.setValueAtTime(0.16, now + Math.max(0.3, duration * 0.72));
    padGain.gain.exponentialRampToValueAtTime(0.0008, now + duration + 0.08);

    filter.connect(padGain).connect(this.masterGain);

    const perOscGain = 1 / Math.max(2, chordQs.length);
    chordQs.forEach((q, idx) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = idx === 0 ? 'triangle' : 'sawtooth';
      osc.frequency.setValueAtTime(qToFreq(q), now);
      g.gain.value = idx === 0 ? perOscGain * 1.35 : perOscGain * 0.78;
      osc.connect(g).connect(filter);
      osc.start(now);
      osc.stop(now + duration + 0.12);
    });
  }

  startVampSequencer(getConfig, { onBeat } = {}) {
    this.stopVampSequencer();
    const ctx = this.ensureContext();
    this.vampPlaying = true;
    this.vampStepIdx = 0;
    this.vampBarInStep = 0;
    this.vampBeatInBar = 0;
    this.vampNextBeatTime = ctx.currentTime + 0.05;

    this.vampTimerId = setInterval(() => {
      if (!this.vampPlaying) return;
      const cfg = getConfig();
      const steps = cfg.steps || [];
      if (!steps.length) {
        this.stopVampSequencer();
        return;
      }

      const scheduleAhead = 0.14;
      while (this.vampNextBeatTime < ctx.currentTime + scheduleAhead && this.vampPlaying) {
        const fresh = getConfig();
        const bpm = Math.max(44, Math.min(200, fresh.bpm || 90));
        const beatsPerBar = Math.max(2, Math.min(9, fresh.beatsPerBar || 4));
        const beatDur = 60 / bpm;

        const stepIdx = this.vampStepIdx % steps.length;
        const step = steps[stepIdx];
        const totalBars = Math.max(1, step.bars || 2);
        const isStepStart = this.vampBarInStep === 0 && this.vampBeatInBar === 0;
        const isBarStart = this.vampBeatInBar === 0;

        if (isStepStart || (fresh.style === 'strum' && isBarStart)) {
          const chordDur = fresh.style === 'strum' ? beatDur * beatsPerBar : beatDur * beatsPerBar * totalBars;
          this.playModalPad({
            rootQ: step.rootQ,
            intervalsQ: fresh.getChordIntervals(step.chordId),
            duration: chordDur,
            when: this.vampNextBeatTime,
            style: fresh.style || 'pad'
          });
        } else if (isBarStart) {
          this.pluckQ(72 + (step.rootQ % 24), {
            duration: beatDur * 1.8,
            velocity: 0.24,
            when: this.vampNextBeatTime
          });
        }

        if (fresh.clickOn) {
          this.triggerGuideClick(this.vampNextBeatTime, isBarStart);
        }

        const uiDelay = Math.max(0, (this.vampNextBeatTime - ctx.currentTime) * 1000);
        const snapStep = stepIdx;
        const snapBar = this.vampBarInStep;
        const snapBeat = this.vampBeatInBar;
        const tid = setTimeout(() => {
          if (this.vampPlaying && onBeat) {
            onBeat({ stepIdx: snapStep, barInStep: snapBar, beatInBar: snapBeat, isStepStart });
          }
        }, uiDelay);
        this.vampUiTimeouts.push(tid);

        this.vampBeatInBar += 1;
        if (this.vampBeatInBar >= beatsPerBar) {
          this.vampBeatInBar = 0;
          this.vampBarInStep += 1;
          if (this.vampBarInStep >= totalBars) {
            this.vampBarInStep = 0;
            this.vampStepIdx = (stepIdx + 1) % steps.length;
          }
        }

        this.vampNextBeatTime += beatDur;
      }
    }, 25);
  }

  stopVampSequencer() {
    this.vampPlaying = false;
    if (this.vampTimerId !== null) {
      clearInterval(this.vampTimerId);
      this.vampTimerId = null;
    }
    this.vampUiTimeouts.forEach((id) => clearTimeout(id));
    this.vampUiTimeouts = [];
  }

  stopEtudeSequencer() {
    this.etudePlaying = false;
    if (this.etudeTimerId !== null) {
      clearInterval(this.etudeTimerId);
      this.etudeTimerId = null;
    }
    this.etudeUiTimeouts.forEach((id) => clearTimeout(id));
    this.etudeUiTimeouts = [];
  }

  strumVoicing(voicing, { spreadSec = 0.042, duration = 2.4 } = {}) {
    if (!voicing || !voicing.notes?.length) return;
    const ctx = this.ensureContext();
    const baseTime = ctx.currentTime + 0.01;
    const perNoteVel = Math.min(0.28, 0.72 / Math.sqrt(voicing.notes.length));

    voicing.notes.forEach((n, idx) => {
      this.pluckQ(n.absQ, {
        duration,
        velocity: perNoteVel,
        when: baseTime + idx * spreadSec
      });
    });
  }

  arpeggiateVoicing(voicing, { stepSec = 0.21 } = {}) {
    if (!voicing || !voicing.notes?.length) return;
    const ctx = this.ensureContext();
    const baseTime = ctx.currentTime + 0.01;
    const up = voicing.notes;
    const down = [...voicing.notes].slice(0, -1).reverse();
    const seq = [...up, ...down];

    seq.forEach((n, idx) => {
      this.pluckQ(n.absQ, {
        duration: 1.5,
        velocity: 0.3,
        when: baseTime + idx * stepSec
      });
    });
  }

  playPhrase(events, { bpm = 104, onStep = null, onComplete = null } = {}) {
    if (!events || !events.length) return;
    this.stopScaleSequence();
    this.ensureContext();

    const stepMs = Math.max(130, Math.round((60000 / bpm) * 0.5));
    events.forEach((ev, idx) => {
      const id = setTimeout(() => {
        this.pluckQ(ev.q, { duration: Math.max(0.8, stepMs / 550), velocity: 0.34 });
        if (onStep) onStep(ev.q % 24);
      }, idx * stepMs);
      this.scaleTimerIds.push(id);
    });

    const endId = setTimeout(() => {
      this.scaleTimerIds = [];
      if (onComplete) onComplete();
    }, events.length * stepMs + 220);
    this.scaleTimerIds.push(endId);
  }

  updateDrone(enabled, rootQ, includeFifth = true) {
    if (!enabled) {
      this.stopDrone();
      return;
    }

    const ctx = this.ensureContext();
    const now = ctx.currentTime;
    const baseQ = 72 + (rootQ % 24);
    const rootFreq = qToFreq(baseQ);
    const subFreq = rootFreq * 0.5;
    const fifthFreq = qToFreq(baseQ + 14);

    if (this.droneNodes) {
      this.droneNodes.oscRoot.frequency.setTargetAtTime(rootFreq, now, 0.08);
      this.droneNodes.oscSub.frequency.setTargetAtTime(subFreq, now, 0.08);
      this.droneNodes.oscFifth.frequency.setTargetAtTime(fifthFreq, now, 0.08);
      this.droneNodes.fifthGain.gain.setTargetAtTime(includeFifth ? 0.22 : 0.0001, now, 0.08);
      return;
    }

    const droneGain = ctx.createGain();
    droneGain.gain.setValueAtTime(0.0001, now);
    droneGain.gain.linearRampToValueAtTime(0.18, now + 0.45);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 620;
    filter.Q.value = 1.8;

    const oscRoot = ctx.createOscillator();
    oscRoot.type = 'sawtooth';
    oscRoot.frequency.setValueAtTime(rootFreq, now);

    const oscSub = ctx.createOscillator();
    oscSub.type = 'triangle';
    oscSub.frequency.setValueAtTime(subFreq, now);

    const oscFifth = ctx.createOscillator();
    oscFifth.type = 'triangle';
    oscFifth.frequency.setValueAtTime(fifthFreq, now);

    const rootGain = ctx.createGain();
    rootGain.gain.value = 0.48;
    const subGain = ctx.createGain();
    subGain.gain.value = 0.55;
    const fifthGain = ctx.createGain();
    fifthGain.gain.value = includeFifth ? 0.22 : 0.0001;

    oscRoot.connect(rootGain).connect(filter);
    oscSub.connect(subGain).connect(filter);
    oscFifth.connect(fifthGain).connect(filter);
    filter.connect(droneGain).connect(this.masterGain);

    oscRoot.start(now);
    oscSub.start(now);
    oscFifth.start(now);

    this.droneNodes = { oscRoot, oscSub, oscFifth, fifthGain, droneGain };
  }

  stopDrone() {
    if (!this.droneNodes || !this.ctx) return;
    const now = this.ctx.currentTime;
    const { oscRoot, oscSub, oscFifth, droneGain } = this.droneNodes;
    droneGain.gain.cancelScheduledValues(now);
    droneGain.gain.setValueAtTime(droneGain.gain.value, now);
    droneGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);

    setTimeout(() => {
      try {
        oscRoot.stop();
        oscSub.stop();
        oscFifth.stop();
      } catch {
        // Already stopped
      }
    }, 300);

    this.droneNodes = null;
  }

  playScaleSequence({ rootQ, intervalsQ, bpm, onStep, onComplete }) {
    this.stopScaleSequence();
    this.ensureContext();

    const baseQ = 96 + (rootQ % 24);
    const asc = [...intervalsQ, 24].map((iv) => baseQ + iv);
    const desc = [...intervalsQ].reverse().map((iv) => baseQ + iv);
    const sequence = [...asc, ...desc];

    const stepMs = Math.max(120, Math.round((60000 / bpm) * 0.5));

    sequence.forEach((q, idx) => {
      const id = setTimeout(() => {
        this.pluckQ(q, { duration: Math.max(0.7, stepMs / 650), velocity: 0.34 });
        if (onStep) onStep(q % 24);
      }, idx * stepMs);
      this.scaleTimerIds.push(id);
    });

    const endId = setTimeout(() => {
      this.scaleTimerIds = [];
      if (onComplete) onComplete();
    }, sequence.length * stepMs + 220);
    this.scaleTimerIds.push(endId);
  }


  /**
   * Plays an arbitrary sequence of pure Hz frequencies (e.g. Scala .scl / 53-TET / Bohlen-Pierce)
   */
  playFreqSequence(items, { bpm = 92, onStep = null, onComplete = null } = {}) {
    if (!items || !items.length) return;
    this.stopScaleSequence();
    this.ensureContext();

    const stepMs = Math.max(150, Math.round((60000 / bpm) * 0.58));
    items.forEach((item, idx) => {
      const id = setTimeout(() => {
        this.pluckFreq(item.freq, { duration: Math.max(0.85, stepMs / 520), velocity: 0.35 });
        if (onStep) onStep(item, idx);
      }, idx * stepMs);
      this.scaleTimerIds.push(id);
    });

    const endId = setTimeout(() => {
      this.scaleTimerIds = [];
      if (onComplete) onComplete();
    }, items.length * stepMs + 240);
    this.scaleTimerIds.push(endId);
  }

  stopScaleSequence() {
    this.scaleTimerIds.forEach((id) => clearTimeout(id));
    this.scaleTimerIds = [];
  }
}

export const synthEngine = new SynthEngine();
