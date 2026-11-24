/**
 * High-Precision Lookahead Rhythm Engine (Web Audio API)
 * Synthesizes Arabic percussion (Dum, Tak, Ka) on Track A + independent Polymetric pulse on Track B.
 */
import { synthEngine } from './synthEngine.js';

class RhythmEngine {
  constructor() {
    this.isPlaying = false;
    this.timerId = null;
    this.nextNoteTime = 0;
    this.mainStep = 0;
    this.polyStep = 0;
    this.noiseBuffer = null;

    this.getConfig = null;
    this.onTick = null;
  }

  ensureNoiseBuffer(ctx) {
    if (this.noiseBuffer && this.noiseBuffer.sampleRate === ctx.sampleRate) {
      return this.noiseBuffer;
    }
    const len = Math.floor(ctx.sampleRate * 0.12);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i += 1) {
      data[i] = Math.random() * 2 - 1;
    }
    this.noiseBuffer = buf;
    return buf;
  }

  start(getConfig, onTick) {
    this.stop();
    const ctx = synthEngine.ensureContext();
    this.ensureNoiseBuffer(ctx);

    this.getConfig = getConfig;
    this.onTick = onTick;
    this.isPlaying = true;
    this.mainStep = 0;
    this.polyStep = 0;
    this.nextNoteTime = ctx.currentTime + 0.04;

    this.timerId = setInterval(() => this.scheduler(), 25);
  }

  stop() {
    this.isPlaying = false;
    if (this.timerId !== null) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  resyncClock() {
    if (!this.isPlaying || !synthEngine.ctx) return;
    const now = synthEngine.ctx.currentTime;
    if (this.nextNoteTime < now - 0.2) {
      this.nextNoteTime = now + 0.04;
    }
  }

  scheduler() {
    if (!this.isPlaying || !this.getConfig) return;
    const ctx = synthEngine.ensureContext();
    if (ctx.state !== 'running') return;
    if (this.nextNoteTime < ctx.currentTime - 0.28) {
      this.nextNoteTime = ctx.currentTime + 0.04;
    }
    const scheduleAheadTime = 0.12;

    while (this.nextNoteTime < ctx.currentTime + scheduleAheadTime) {
      const cfg = this.getConfig();
      const steps = cfg.steps && cfg.steps.length ? cfg.steps : ['D', '-', 'T', '-'];
      const sub = cfg.subdivision || 2;
      const bpm = Math.max(40, Math.min(240, cfg.bpm || 110));
      const stepDur = 60 / bpm / sub;

      const curMain = this.mainStep % steps.length;
      const hit = steps[curMain];

      if (hit === 'D') this.triggerDum(ctx, this.nextNoteTime, curMain === 0 ? 0.52 : 0.42);
      else if (hit === 'T') this.triggerTak(ctx, this.nextNoteTime, 0.34);
      else if (hit === 'K') this.triggerKa(ctx, this.nextNoteTime, 0.18);

      let curPoly = -1;
      if (cfg.polyEnabled && cfg.polyLength >= 2) {
        curPoly = this.polyStep % cfg.polyLength;
        this.triggerPoly(ctx, this.nextNoteTime, curPoly === 0);
      }

      // Schedule UI LED callback synchronized with audio time
      const delayMs = Math.max(0, (this.nextNoteTime - ctx.currentTime) * 1000);
      const snapMain = curMain;
      const snapPoly = curPoly;
      setTimeout(() => {
        if (this.isPlaying && this.onTick) {
          this.onTick(snapMain, snapPoly);
        }
      }, delayMs);

      this.mainStep = (curMain + 1) % steps.length;
      if (cfg.polyEnabled && cfg.polyLength >= 2) {
        this.polyStep = (curPoly + 1) % cfg.polyLength;
      } else {
        this.polyStep = 0;
      }

      this.nextNoteTime += stepDur;
    }
  }

  triggerDum(ctx, time, gainVal) {
    const out = synthEngine.getPercussionInput();
    const jitter = 0.99 + Math.random() * 0.02;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(148 * jitter, time);
    osc.frequency.exponentialRampToValueAtTime(62 * jitter, time + 0.14);
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.linearRampToValueAtTime(gainVal, time + 0.003);
    gain.gain.exponentialRampToValueAtTime(0.0008, time + 0.28);
    osc.connect(gain).connect(out);
    osc.start(time); osc.stop(time + 0.3);

    const overtone = ctx.createOscillator();
    const otGain = ctx.createGain();
    overtone.type = 'triangle';
    overtone.frequency.setValueAtTime(235 * jitter, time);
    overtone.frequency.exponentialRampToValueAtTime(108 * jitter, time + 0.08);
    otGain.gain.setValueAtTime(0.0001, time);
    otGain.gain.linearRampToValueAtTime(gainVal * 0.24, time + 0.002);
    otGain.gain.exponentialRampToValueAtTime(0.0005, time + 0.11);
    overtone.connect(otGain).connect(out);
    overtone.start(time); overtone.stop(time + 0.13);

    const slap = ctx.createBufferSource();
    slap.buffer = this.ensureNoiseBuffer(ctx);
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 620;
    const sGain = ctx.createGain();
    sGain.gain.setValueAtTime(gainVal * 0.22, time);
    sGain.gain.exponentialRampToValueAtTime(0.0005, time + 0.024);
    slap.connect(lp).connect(sGain).connect(out);
    slap.start(time); slap.stop(time + 0.03);
  }

  triggerTak(ctx, time, gainVal) {
    const out = synthEngine.getPercussionInput();
    const jitter = 0.985 + Math.random() * 0.03;
    const noise = ctx.createBufferSource();
    noise.buffer = this.ensureNoiseBuffer(ctx);
    const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.setValueAtTime(2550 * jitter, time); bp.Q.value = 3.0;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.linearRampToValueAtTime(gainVal, time + 0.0018);
    gain.gain.exponentialRampToValueAtTime(0.0008, time + 0.08);
    noise.connect(bp).connect(gain).connect(out);
    noise.start(time); noise.stop(time + 0.095);

    const ping = ctx.createOscillator();
    const pGain = ctx.createGain();
    ping.type = 'triangle';
    ping.frequency.setValueAtTime(790 * jitter, time);
    ping.frequency.exponentialRampToValueAtTime(455 * jitter, time + 0.045);
    pGain.gain.setValueAtTime(gainVal * 0.42, time);
    pGain.gain.exponentialRampToValueAtTime(0.0008, time + 0.058);
    ping.connect(pGain).connect(out);
    ping.start(time); ping.stop(time + 0.068);
  }

  triggerKa(ctx, time, gainVal) {
    const out = synthEngine.getPercussionInput();
    const jitter = 0.97 + Math.random() * 0.06;
    const noise = ctx.createBufferSource();
    noise.buffer = this.ensureNoiseBuffer(ctx);
    const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.setValueAtTime(3400 * jitter, time); bp.Q.value = 1.8;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.linearRampToValueAtTime(gainVal, time + 0.0015);
    gain.gain.exponentialRampToValueAtTime(0.0008, time + 0.042);
    noise.connect(bp).connect(gain).connect(out);
    noise.start(time); noise.stop(time + 0.052);
  }

  triggerPoly(ctx, time, isDownbeat) {
    const out = synthEngine.getPercussionInput();
    const baseFreq = isDownbeat ? 1340 : 980;
    const peak = isDownbeat ? 0.26 : 0.11;
    const dur = isDownbeat ? 0.072 : 0.04;
    const osc1 = ctx.createOscillator(); const osc2 = ctx.createOscillator();
    const g1 = ctx.createGain(); const g2 = ctx.createGain();
    osc1.type = 'sine'; osc2.type = 'sine';
    osc1.frequency.setValueAtTime(baseFreq, time);
    osc1.frequency.exponentialRampToValueAtTime(baseFreq * 0.92, time + dur);
    osc2.frequency.setValueAtTime(baseFreq * 2.76, time);
    g1.gain.setValueAtTime(0.0001, time); g1.gain.linearRampToValueAtTime(peak, time + 0.0015); g1.gain.exponentialRampToValueAtTime(0.0006, time + dur);
    g2.gain.setValueAtTime(0.0001, time); g2.gain.linearRampToValueAtTime(peak * 0.34, time + 0.001); g2.gain.exponentialRampToValueAtTime(0.0005, time + dur * 0.45);
    osc1.connect(g1).connect(out); osc2.connect(g2).connect(out);
    osc1.start(time); osc2.start(time);
    osc1.stop(time + dur + 0.015); osc2.stop(time + dur + 0.015);
  }
}

export const rhythmEngine = new RhythmEngine();
