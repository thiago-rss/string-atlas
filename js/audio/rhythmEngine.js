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

  scheduler() {
    if (!this.isPlaying || !this.getConfig) return;
    const ctx = synthEngine.ensureContext();
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

  /** Deep darbuka / frame-drum Dum */
  triggerDum(ctx, time, gainVal) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(145, time);
    osc.frequency.exponentialRampToValueAtTime(58, time + 0.16);

    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.linearRampToValueAtTime(gainVal, time + 0.004);
    gain.gain.exponentialRampToValueAtTime(0.0008, time + 0.24);

    osc.connect(gain).connect(ctx.destination);
    osc.start(time);
    osc.stop(time + 0.26);
  }

  /** Crisp darbuka rim Tak */
  triggerTak(ctx, time, gainVal) {
    const noise = ctx.createBufferSource();
    noise.buffer = this.ensureNoiseBuffer(ctx);

    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.setValueAtTime(2400, time);
    bp.Q.value = 3.2;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.linearRampToValueAtTime(gainVal, time + 0.002);
    gain.gain.exponentialRampToValueAtTime(0.0008, time + 0.075);

    noise.connect(bp).connect(gain).connect(ctx.destination);
    noise.start(time);
    noise.stop(time + 0.09);

    // Metallic overtone ping
    const ping = ctx.createOscillator();
    const pGain = ctx.createGain();
    ping.type = 'triangle';
    ping.frequency.setValueAtTime(740, time);
    ping.frequency.exponentialRampToValueAtTime(420, time + 0.04);
    pGain.gain.setValueAtTime(gainVal * 0.45, time);
    pGain.gain.exponentialRampToValueAtTime(0.0008, time + 0.05);
    ping.connect(pGain).connect(ctx.destination);
    ping.start(time);
    ping.stop(time + 0.06);
  }

  /** Soft ghost Ka */
  triggerKa(ctx, time, gainVal) {
    const noise = ctx.createBufferSource();
    noise.buffer = this.ensureNoiseBuffer(ctx);

    const hp = ctx.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.setValueAtTime(3200, time);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.linearRampToValueAtTime(gainVal, time + 0.002);
    gain.gain.exponentialRampToValueAtTime(0.0008, time + 0.045);

    noise.connect(hp).connect(gain).connect(ctx.destination);
    noise.start(time);
    noise.stop(time + 0.055);
  }

  /** Polymetric Track B woodblock / clave pulse */
  triggerPoly(ctx, time, isDownbeat) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    const freq = isDownbeat ? 1180 : 880;
    osc.frequency.setValueAtTime(freq, time);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.72, time + 0.045);

    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.linearRampToValueAtTime(isDownbeat ? 0.28 : 0.11, time + 0.002);
    gain.gain.exponentialRampToValueAtTime(0.0008, time + (isDownbeat ? 0.075 : 0.035));

    osc.connect(gain).connect(ctx.destination);
    osc.start(time);
    osc.stop(time + 0.09);
  }
}

export const rhythmEngine = new RhythmEngine();
