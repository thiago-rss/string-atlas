/**
 * Real-Time 24-TET Pitch & Micro-Bend Detector (Web Audio API + YIN Algorithm) — v8.3 Mobile Hardened
 * - Direct Audio Interface Line Mode (zero browser DSP) with Channel Routing (L+R Mix, Ch 1 Left, Ch 2 Right)
 * - 3-Tier Progressive getUserMedia Fallback for iOS Safari / Chrome iOS / Android & Bluetooth AirPods
 * - Automatic iOS navigator.audioSession switching ('play-and-record' <-> 'playback')
 * - Extended low-frequency range down to 34 Hz (8-String E1 41.2 Hz, A1 55 Hz, B1 61.7 Hz)
 * - Adapts seamlessly to 16 kHz / 24 kHz Bluetooth HFP rates as well as 44.1 / 48 / 96 kHz interfaces
 */
import { A4_Q, getReferenceA4, mod24, qToFreq, qToNoteName } from '../core/theory24.js';
import {
  disableLockScreenMediaSession,
  isBluetoothDeviceLabel,
  mobileAudioGuard,
  setIOSAudioSessionType
} from './mobileAudioGuard.js';

const BUFFER_SIZE = 4096;
const MIN_FREQ_HZ = 34;
const MAX_FREQ_HZ = 1480;
const YIN_THRESHOLD = 0.14;

/**
 * Builds a 3-tier progressive getUserMedia constraints chain so strict desktop USB interface
 * constraints never break mobile Safari/Chrome or Bluetooth headset capture.
 */
export function buildConstraintFallbackChain({ mode = 'line', deviceId = '', channel = 'mix' } = {}) {
  const wantStereo = mode === 'line' || channel === 'ch1' || channel === 'ch2';
  const tier1 = {
    echoCancellation: mode === 'mic',
    noiseSuppression: mode === 'mic',
    autoGainControl: false,
    ...(wantStereo ? { channelCount: { ideal: 2 } } : {})
  };
  if (deviceId) {
    tier1.deviceId = { exact: deviceId };
  }

  const tier2 = {
    echoCancellation: mode === 'mic',
    noiseSuppression: false,
    autoGainControl: false
  };
  if (deviceId) {
    tier2.deviceId = { ideal: deviceId };
  }

  return [
    { label: 'preferred', constraints: { audio: tier1, video: false } },
    { label: 'relaxed', constraints: { audio: tier2, video: false } },
    { label: 'mobile_safe', constraints: { audio: true, video: false } }
  ];
}

/**
 * YIN fundamental frequency estimator with parabolic interpolation.
 * Adapts cleanly to any browser/Bluetooth sample rate (16 kHz .. 96 kHz).
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

  const maxTau = Math.min(Math.floor(n / 2) - 2, Math.ceil(sampleRate / MIN_FREQ_HZ));
  const minTau = Math.max(2, Math.floor(sampleRate / MAX_FREQ_HZ));
  if (maxTau <= minTau + 2) {
    return { freq: null, rms, clarity: 0 };
  }

  const diff = new Float32Array(maxTau);
  const cmnd = new Float32Array(maxTau);

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
export function analyzePitch24(freq, a4Hz = getReferenceA4()) {
  const exactQ = A4_Q + 24 * Math.log2(freq / a4Hz);
  const nearestQ = Math.round(exactQ);
  const centsFrom24 = (exactQ - nearestQ) * 50;

  const exactMidi = exactQ / 2;
  const nearestMidi = Math.round(exactMidi);
  const centsFrom12 = (exactMidi - nearestMidi) * 100;

  const bendAnchorMidi = centsFrom12 < -22 ? Math.floor(exactMidi) : (centsFrom12 >= 20 ? Math.floor(exactMidi) : nearestMidi);
  const bendAnchorQ = bendAnchorMidi * 2;
  const bendCentsFromAnchor = (exactMidi - bendAnchorMidi) * 100;

  return {
    freq,
    a4Hz,
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
    targetFreq24: qToFreq(nearestQ, a4Hz)
  };
}

/**
 * Adaptive Pitch Stabilizer for Low Bass (E1/A1/B1) & Micro-Bend Readability:
 * - Median window (7 frames < 115 Hz, 5 frames otherwise) rejects single-frame octave glitches
 * - Exponential smoothing calms needle jitter without lagging fast note changes (> 70c snaps instantly)
 * - Hysteresis deadband prevents note-label flickering near ±25c / ±50c boundaries
 */
export class PitchStabilizer {
  constructor() {
    this.history = [];
    this.smoothedFreq = null;
    this.lockedQ = null;
    this.silenceFrames = 0;
  }

  reset() {
    this.history = [];
    this.smoothedFreq = null;
    this.lockedQ = null;
    this.silenceFrames = 0;
  }

  push(rawFreq, a4Hz = getReferenceA4()) {
    if (!rawFreq) {
      this.silenceFrames += 1;
      if (this.history.length > 0) this.history.shift();
      if (this.silenceFrames >= 6) {
        this.smoothedFreq = null;
        this.lockedQ = null;
      }
      return null;
    }

    this.silenceFrames = 0;
    const isLowBass = rawFreq < 115;
    const winSize = isLowBass ? 7 : 5;
    this.history.push(rawFreq);
    while (this.history.length > winSize) this.history.shift();

    const sorted = [...this.history].sort((a, b) => a - b);
    const medianFreq = sorted[Math.floor(sorted.length / 2)];

    if (this.smoothedFreq === null) {
      this.smoothedFreq = medianFreq;
    } else {
      const jumpCents = Math.abs(1200 * Math.log2(medianFreq / this.smoothedFreq));
      if (jumpCents > 70) {
        this.smoothedFreq = medianFreq;
        this.history = [medianFreq];
        this.lockedQ = null;
      } else {
        const alpha = isLowBass ? 0.22 : 0.36;
        this.smoothedFreq = this.smoothedFreq + alpha * (medianFreq - this.smoothedFreq);
      }
    }

    const analysis = analyzePitch24(this.smoothedFreq, a4Hz);

    if (this.lockedQ !== null && analysis.nearestQ !== this.lockedQ) {
      const distFromLockedCents = Math.abs((analysis.exactQ - this.lockedQ) * 50);
      if (distFromLockedCents < 31) {
        analysis.nearestQ = this.lockedQ;
        analysis.pc24 = mod24(this.lockedQ);
        analysis.noteName24 = qToNoteName(this.lockedQ, true);
        analysis.noteShort24 = qToNoteName(this.lockedQ, false);
        analysis.isQuarterTone = mod24(this.lockedQ) % 2 !== 0;
        analysis.centsFrom24 = (analysis.exactQ - this.lockedQ) * 50;
        analysis.targetFreq24 = qToFreq(this.lockedQ, a4Hz);
      } else {
        this.lockedQ = analysis.nearestQ;
      }
    } else {
      this.lockedQ = analysis.nearestQ;
    }

    return analysis;
  }
}

class PitchDetectorService {
  constructor() {
    this.ctx = null;
    this.stream = null;
    this.source = null;
    this.splitter = null;
    this.gainNode = null;
    this.analyser = null;
    this.timeBuf = null;
    this.rafId = null;
    this.running = false;

    this.rmsGate = 0.014;
    this.inputGain = 1.4;
    this.channel = 'mix'; // 'mix' | 'ch1' | 'ch2'
    this.stabilizer = new PitchStabilizer();
    this.onFrame = null;
    this.onEnded = null;
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

  watchDeviceChanges(onChange) {
    if (!navigator.mediaDevices?.addEventListener || typeof onChange !== 'function') return () => {};
    const handler = async () => {
      const devices = await this.listInputDevices();
      onChange(devices);
    };
    navigator.mediaDevices.addEventListener('devicechange', handler);
    return () => navigator.mediaDevices.removeEventListener('devicechange', handler);
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

  setChannel(channel) {
    this.channel = ['mix', 'ch1', 'ch2'].includes(channel) ? channel : 'mix';
    if (this.running && this.source && this.gainNode) {
      this.wireInputRouting();
    }
  }

  wireInputRouting() {
    if (!this.source || !this.gainNode || !this.ctx) return;
    try {
      this.source.disconnect();
    } catch {
      // Not connected yet
    }
    if (this.splitter) {
      try {
        this.splitter.disconnect();
      } catch {
        // Ignore
      }
      this.splitter = null;
    }

    const track = this.stream?.getAudioTracks?.()[0];
    const reportedCh = track?.getSettings?.().channelCount || this.source.channelCount || 1;

    if ((this.channel === 'ch1' || this.channel === 'ch2') && reportedCh >= 2) {
      this.splitter = this.ctx.createChannelSplitter(Math.max(2, reportedCh));
      this.source.connect(this.splitter);
      const chIndex = this.channel === 'ch2' ? 1 : 0;
      this.splitter.connect(this.gainNode, chIndex);
    } else {
      // Mono sum (L+R) or single-channel mic
      this.source.connect(this.gainNode);
    }
  }

  async start({
    mode = 'line',
    deviceId = '',
    channel = 'mix',
    rmsGate = 0.014,
    inputGain = 1.4,
    onFrame,
    onEnded = null
  }) {
    this.stop();
    if (!navigator.mediaDevices?.getUserMedia) {
      throw new Error('UNSUPPORTED_BROWSER');
    }

    this.rmsGate = rmsGate;
    this.inputGain = inputGain;
    this.channel = ['mix', 'ch1', 'ch2'].includes(channel) ? channel : 'mix';
    this.onFrame = onFrame;
    this.onEnded = onEnded;
    this.stabilizer.reset();

    // Switch iOS audio session to duplex mode cleanly before opening mic/interface
    setIOSAudioSessionType('play-and-record');
    disableLockScreenMediaSession();

    const chain = buildConstraintFallbackChain({ mode, deviceId, channel: this.channel });
    let acquiredStream = null;
    let usedTier = 'preferred';
    let lastError = null;

    for (const tier of chain) {
      try {
        acquiredStream = await navigator.mediaDevices.getUserMedia(tier.constraints);
        usedTier = tier.label;
        break;
      } catch (err) {
        lastError = err;
        // If user explicitly denied permission, abort immediately rather than re-prompting
        if (err && (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError')) {
          setIOSAudioSessionType('playback');
          throw err;
        }
      }
    }

    if (!acquiredStream) {
      setIOSAudioSessionType('playback');
      throw lastError || new Error('MIC_UNAVAILABLE');
    }

    this.stream = acquiredStream;
    const track = this.stream.getAudioTracks()[0];
    if (track) {
      track.onended = () => {
        if (this.running) {
          this.stop();
          if (this.onEnded) this.onEnded();
        }
      };
    }

    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AudioCtx({ latencyHint: 'interactive' });
    mobileAudioGuard.attachContextStateWatcher(this.ctx);
    if (this.ctx.state === 'suspended' || this.ctx.state === 'interrupted') {
      await this.ctx.resume();
    }

    this.source = this.ctx.createMediaStreamSource(this.stream);
    this.gainNode = this.ctx.createGain();
    this.gainNode.gain.value = this.inputGain;

    const hpf = this.ctx.createBiquadFilter();
    hpf.type = 'highpass';
    hpf.frequency.value = 26;

    const lpf = this.ctx.createBiquadFilter();
    lpf.type = 'lowpass';
    // Keep LPF safely below Nyquist even on 16 kHz Bluetooth HFP streams!
    lpf.frequency.value = Math.min(1800, this.ctx.sampleRate * 0.42);

    this.analyser = this.ctx.createAnalyser();
    this.analyser.fftSize = BUFFER_SIZE;
    this.analyser.smoothingTimeConstant = 0;

    this.wireInputRouting();
    this.gainNode.connect(hpf);
    hpf.connect(lpf);
    lpf.connect(this.analyser);

    this.timeBuf = new Float32Array(BUFFER_SIZE);
    this.running = true;

    const tick = () => {
      if (!this.running || !this.ctx || !this.analyser) return;
      if (this.ctx.state === 'running') {
        this.analyser.getFloatTimeDomainData(this.timeBuf);
        const raw = detectPitchYIN(this.timeBuf, this.ctx.sampleRate, this.rmsGate);

        const analysis = this.stabilizer.push(raw.freq, getReferenceA4());

        if (this.onFrame) {
          this.onFrame({
            rms: raw.rms,
            clarity: raw.clarity,
            pitch: analysis
          });
        }
      }

      this.rafId = requestAnimationFrame(tick);
    };

    this.rafId = requestAnimationFrame(tick);

    const settings = track?.getSettings?.() || {};
    const label = track?.label || '';
    const sampleRate = this.ctx.sampleRate;
    const isBluetooth = isBluetoothDeviceLabel(label) || sampleRate <= 24000;

    return {
      label,
      sampleRate,
      channelCount: settings.channelCount || this.source.channelCount || 1,
      usedFallback: usedTier !== 'preferred',
      usedTier,
      isBluetooth
    };
  }

  stop() {
    this.running = false;
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    if (this.splitter) {
      try {
        this.splitter.disconnect();
      } catch {
        // Ignore
      }
      this.splitter = null;
    }
    if (this.stream) {
      this.stream.getTracks().forEach((tr) => {
        tr.onended = null;
        tr.stop();
      });
      this.stream = null;
    }
    if (this.ctx) {
      this.ctx.close().catch(() => {});
      this.ctx = null;
    }
    this.source = null;
    this.gainNode = null;
    this.analyser = null;
    this.stabilizer.reset();

    // Restore stereo A2DP / mute-switch-friendly playback session on iOS
    setIOSAudioSessionType('playback');
    disableLockScreenMediaSession();
  }
}

export const pitchDetector = new PitchDetectorService();
