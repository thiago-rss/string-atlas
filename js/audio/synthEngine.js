/**
 * Pure Web Audio API 24-TET Electric Guitar & Modal Drone Synth v2.0
 */
import { qToFreq } from '../core/theory24.js';

class SynthEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.delayNode = null;
    this.delayFeedback = null;
    this.droneNodes = null;
    this.scaleTimerIds = [];
  }

  ensureContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.72;

      // Subtle clean ambient delay bus
      this.delayNode = this.ctx.createDelay(1.0);
      this.delayNode.delayTime.value = 0.28;

      this.delayFeedback = this.ctx.createGain();
      this.delayFeedback.gain.value = 0.24;

      const delayFilter = this.ctx.createBiquadFilter();
      delayFilter.type = 'lowpass';
      delayFilter.frequency.value = 2400;

      const delayWet = this.ctx.createGain();
      delayWet.gain.value = 0.22;

      this.delayNode.connect(delayFilter);
      delayFilter.connect(this.delayFeedback);
      this.delayFeedback.connect(this.delayNode);
      delayFilter.connect(delayWet);

      this.masterGain.connect(this.ctx.destination);
      delayWet.connect(this.ctx.destination);
      this.masterGain.connect(this.delayNode);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  pluckFreq(freq, { duration = 1.6, velocity = 0.34, harmonicBell = false, when = null } = {}) {
    const ctx = this.ensureContext();
    const now = when !== null ? when : ctx.currentTime;

    const voiceGain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.Q.value = harmonicBell ? 3.2 : 1.4;

    const startCutoff = harmonicBell ? Math.min(freq * 6, 9000) : Math.min(freq * 7.5, 5800);
    const endCutoff = harmonicBell ? Math.min(freq * 2.5, 3600) : Math.max(freq * 1.4, 420);

    filter.frequency.setValueAtTime(startCutoff, now);
    filter.frequency.exponentialRampToValueAtTime(endCutoff, now + duration * 0.65);

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
      osc1.frequency.setValueAtTime(freq, now);
      osc2.frequency.setValueAtTime(freq * 1.0018, now);
    }

    const mix2 = ctx.createGain();
    mix2.gain.value = harmonicBell ? 0.14 : 0.22;

    osc1.connect(filter);
    osc2.connect(mix2);
    mix2.connect(filter);
    filter.connect(voiceGain);
    voiceGain.connect(this.masterGain);

    voiceGain.gain.setValueAtTime(0.0001, now);
    voiceGain.gain.linearRampToValueAtTime(velocity, now + 0.009);
    voiceGain.gain.exponentialRampToValueAtTime(0.0008, now + duration);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + duration + 0.05);
    osc2.stop(now + duration + 0.05);
  }

  pluckQ(q, opts = {}) {
    this.pluckFreq(qToFreq(q), opts);
  }

  /**
   * Strums a calculated voicing naturally from bass string to treble string
   */
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

  /**
   * Arpeggiates a voicing ascending + descending
   */
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

  /**
   * Plays a recorded phrase from the Tab/Staff scratchpad
   */
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

  stopScaleSequence() {
    this.scaleTimerIds.forEach((id) => clearTimeout(id));
    this.scaleTimerIds = [];
  }
}

export const synthEngine = new SynthEngine();
