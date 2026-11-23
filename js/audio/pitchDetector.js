/**
 * Real-Time 24-TET Pitch & Micro-Bend Detector (Web Audio API + YIN Algorithm)
 * - Supports Audio Interface "Line Mode" (zero browser DSP: no AEC, NS, or AGC) & Microphone Mode
 * - Extended low-frequency range down to ~42 Hz (covers E Standard, B Standard B1=61.7Hz, A Standard A1=55Hz, Drop G G1=49Hz)
 * - Computes 24-TET nearest pitch class, 12-TET anchor + micro-bend cents (+50c = exact quarter-tone!)
 */
import { A4_HZ, A4_Q, mod24, qToFreq, qToNoteName } from '../core/theory24.js';

const BUFFER_SIZE = 4096; // ~85ms @ 48kHz -> clean tracking down to ~42 Hz
const MIN_FREQ_HZ = 34;
const MAX_FREQ_HZ = 1480;
const YIN_THRESHOLD = 0.14;

/**
 * YIN fundamental frequency estimator with parabolic interpolation.
 * Far more resilient against 2nd/3rd octave harmonics on electric guitars than raw autocorrelation.
 */
export function detectPitchYIN(buf, sampleRate, rmsGate = 0.012) {
  const n = buf.length;
  let sumSq = 0;
  for (let i = 0; i < n; i += 1) {
    sumSq += buf[i] * buf[i];
  }
  const rms = Math.sqrt(sumSq / n);
  if (rms < rmsGate) {
    return { freq: null, rms, clarity: 0 };
  }

  const maxTau = Math.min(Math.floor(n / 2), Math.ceil(sampleRate / MIN_FREQ_HZ));
  const minTau = Math.max(2, Math.floor(sampleRate / MAX_FREQ_HZ));
  const diff = new Float32Array(maxTau);
  const cmnd = new Float32Array(maxTau);

  // Step 1 & 2: Difference function + Cumulative mean normalized difference
  cmnd[0] = 1;
  let runningSum = 0;
  for (let tau = 1; tau < maxTau; tau += 1) {
    let s = 0;
    const limit = n - maxTau;
    for (let i = 0; i < limit; i += 1) {
      const d = buf[i] - buf[i + tau];
      s += d * d;
    }
    diff[tau] = s;
    runningSum += s;
    cmnd[tau] = runningSum > 0 ? (s * tau) / runningSum : 1;
  }

  // Step 3: Absolute threshold search for first local minimum below YIN_THRESHOLD
  let tauEstimate = -1;
  for (let tau = minTau; tau < maxTau - 1; tau += 1) {
    if (cmnd[tau] < YIN_THRESHOLD) {
      while (tau + 1 < maxTau - 1 && cmnd[tau + 1] < cmnd[tau]) {
        tau += 1;
      }
      tauEstimate = tau;
      break;
    }
  }

  if (tauEstimate === -1) {
    return { freq: null, rms, clarity: 0 };
  }

  // Step 4: Parabolic interpolation around tauEstimate for sub-sample precision
  const x0 = tauEstimate > 1 ? tauEstimate - 1 : tauEstimate;
  const x2 = tauEstimate + 1 < maxTau ? tauEstimate + 1 : tauEstimate;
  let betterTau = tauEstimate;
  if (x0 !== tauEstimate && x2 !== tauEstimate) {
    const s0 = cmnd[x0];
    const s1 = cmnd[tauEstimate];
    const s2 = cmnd[x2];
    const denom = 2 * (2 * s1 - s2 - s0);
    if (Math.abs(denom) > 1e-9) {
      betterTau = tauEstimate + (s2 - s0) / denom;
    }
  }

  const freq = sampleRate / betterTau;
  if (!Number.isFinite(freq) || freq < MIN_FREQ_HZ || freq > MAX_FREQ_HZ) {
    return { freq: null, rms, clarity: 0 };
  }

  const clarity = Math.max(0, Math.min(1, 1 - cmnd[tauEstimate]));
  return { freq, rms, clarity };
}

/**
 * Converts a detected frequency (Hz) into rich 24-TET & 12-TET micro-bend telemetry.
 */
export function analyzePitch24(freq) {
  // Continuous 24-TET quarter-tone index (A4 = 138)
  const exactQ = A4_Q + 24 * Math.log2(freq / A4_HZ);
  const nearestQ = Math.round(exactQ);
  const centsFrom24 = (exactQ - nearestQ) * 50; // -25c .. +25c

  // Continuous 12-TET semitone index (MIDI)
  const exactMidi = exactQ / 2;
  const nearestMidi = Math.round(exactMidi);
  const centsFrom12 = (exactMidi - nearestMidi) * 100; // -50c .. +50c

  // Micro-bend anchor: floor semitone (12-TET) -> bend amount in 0..+100c
  // If just slightly flat of a semitone (-20c..0c), keep anchor on nearest semitone so gauge reads cleanly
  const bendAnchorMidi = centsFrom12 < -22 ? Math.floor(exactMidi) : (centsFrom12 >= 20 ? Math.floor(exactMidi) : nearestMidi);
  const bendAnchorQ = bendAnchorMidi * 2;
  const bendCentsFromAnchor = (exactMidi - bendAnchorMidi) * 100; // typically -22c .. +100c

  return {
    freq,
    exactQ,
    nearestQ,
    pc24: mod24(nearestQ),
    noteName24: qToNoteName(nearestQ, true),
    noteShort24: qToNoteName(nearestQ, false),
    isQuarterTone: mod24(nearestQ) % 2 !== 0,
    centsFrom24,
    nearest12Name: qToNoteName(nearestMidi * 2, true),
    centsFrom12,
    bendAnchorQ,
    bendAnchorName: qToNoteName(bendAnchorQ, true),
    bendCentsFromAnchor,
    targetFreq24: qToFreq(nearestQ)
  };
}

class PitchDetectorService {
  constructor() {
    this.ctx = null;
    this.stream = null;
    this.source = null;
    this.gainNode = null;
    this.analyser = null;
    this.timeBuf = null;
    this.rafId = null;
    this.running = false;

    this.rmsGate = 0.014;
    this.inputGain = 1.4;
    this.history = [];
    this.onFrame = null;
  }

  async listInputDevices() {
    if (!navigator.mediaDevices?.enumerateDevices) return [];
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      return devices
        .filter((d) => d.kind === 'audioinput')
        .map((d, idx) => ({
          deviceId: d.deviceId,
          label: d.label || `Audio Input ${idx + 1}`
        }));
    } catch {
      return [];
    }
  }

  setGate(rmsGate) {
    this.rmsGate = Math.max(0.003, Math.min(0.12, rmsGate));
  }

  setInputGain(gainVal) {
    this.inputGain = Math.max(0.4, Math.min(4.0, gainVal));
    if (this.gainNode && this.ctx) {
      this.gainNode.gain.setTargetAtTime(this.inputGain, this.ctx.currentTime, 0.03);
    }
  }

  async start({ mode = 'line', deviceId = '', rmsGate = 0.014, inputGain = 1.4, onFrame }) {
    this.stop();
    if (!navigator.mediaDevices?.getUserMedia) {
      throw new Error('UNSUPPORTED_BROWSER');
    }

    this.rmsGate = rmsGate;
    this.inputGain = inputGain;
    this.onFrame = onFrame;
    this.history = [];

    const audioConstraints = {
      echoCancellation: mode === 'mic',
      noiseSuppression: mode === 'mic',
      autoGainControl: false,
      channelCount: 1
    };
    if (deviceId) {
      audioConstraints.deviceId = { exact: deviceId };
    }

    this.stream = await navigator.mediaDevices.getUserMedia({ audio: audioConstraints, video: false });

    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AudioCtx({ latencyHint: 'interactive' });
    if (this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }

    this.source = this.ctx.createMediaStreamSource(this.stream);
    this.gainNode = this.ctx.createGain();
    this.gainNode.gain.value = this.inputGain;

    // Gentle high-pass @ 36 Hz to remove DC rumble without hurting A1 (55 Hz) or G1 (49 Hz)
    const hpf = this.ctx.createBiquadFilter();
    hpf.type = 'highpass';
    hpf.frequency.value = 26;

    // Gentle low-pass @ 1.8 kHz to suppress pick scrape & upper fret harmonics for cleaner YIN lock
    const lpf = this.ctx.createBiquadFilter();
    lpf.type = 'lowpass';
    lpf.frequency.value = 1800;

    this.analyser = this.ctx.createAnalyser();
    this.analyser.fftSize = BUFFER_SIZE;
    this.analyser.smoothingTimeConstant = 0;

    this.source.connect(this.gainNode);
    this.gainNode.connect(hpf);
    hpf.connect(lpf);
    lpf.connect(this.analyser);

    this.timeBuf = new Float32Array(BUFFER_SIZE);
    this.running = true;

    const tick = () => {
      if (!this.running) return;
      this.analyser.getFloatTimeDomainData(this.timeBuf);
      const raw = detectPitchYIN(this.timeBuf, this.ctx.sampleRate, this.rmsGate);

      let analysis = null;
      if (raw.freq) {
        this.history.push(raw.freq);
        if (this.history.length > 5) this.history.shift();
        // Median of last 5 frames eliminates single-frame octave jumps cleanly
        const sorted = [...this.history].sort((a, b) => a - b);
        const medianFreq = sorted[Math.floor(sorted.length / 2)];
        analysis = analyzePitch24(medianFreq);
      } else {
        // Decay history gradually during silence
        if (this.history.length > 0) this.history.shift();
      }

      if (this.onFrame) {
        this.onFrame({
          rms: raw.rms,
          clarity: raw.clarity,
          pitch: analysis
        });
      }

      this.rafId = requestAnimationFrame(tick);
    };

    this.rafId = requestAnimationFrame(tick);
  }

  stop() {
    this.running = false;
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    if (this.stream) {
      this.stream.getTracks().forEach((tr) => tr.stop());
      this.stream = null;
    }
    if (this.ctx) {
      this.ctx.close().catch(() => {});
      this.ctx = null;
    }
    this.source = null;
    this.gainNode = null;
    this.analyser = null;
    this.history = [];
  }
}

export const pitchDetector = new PitchDetectorService();
