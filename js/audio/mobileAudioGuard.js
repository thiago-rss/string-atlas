/**
 * Mobile Audio Hardening & Session Guardian (v8.3)
 * - Unlocks Web Audio on first user gesture (iOS Safari, Chrome iOS, Android) via 1-sample silent buffer
 * - Manages iOS navigator.audioSession ('playback' for A2DP/Bluetooth & mute-switch bypass; 'play-and-record' for Line/Mic)
 * - Neutralizes Lock Screen / Control Center MediaSession widgets so Web Audio stays silent to OS media controls
 * - Auto-recovers suspended / Apple 'interrupted' AudioContexts after screen lock, calls, or Bluetooth handoffs
 * - Manages Screen Wake Lock cleanly while audio playback or live monitoring is active
 */

const BT_PATTERNS = [
  /airpods/i,
  /bluetooth/i,
  /hands[- ]?free/i,
  /\bhfp\b/i,
  /\bsco\b/i,
  /headset/i,
  /galaxy\s*buds/i,
  /pixel\s*buds/i,
  /beats/i,
  /bose\s*(qc|quiet|soundlink)/i,
  /sony\s*(wh|wf)/i,
  /jbl\s*(tune|live|flip|charge)/i
];

export function isBluetoothDeviceLabel(label) {
  if (!label || typeof label !== 'string') return false;
  return BT_PATTERNS.some((re) => re.test(label));
}

export function isIOSBrowser() {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent || '';
  return /iP(hone|ad|od)/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

/**
 * Neutralizes OS Lock Screen / Control Center audio player controls so tapping play/pause
 * on AirPods or lock screen never hijacks or shows a broken blank player for Web Audio.
 */
export function disableLockScreenMediaSession() {
  if (typeof navigator === 'undefined' || !('mediaSession' in navigator)) return;
  try {
    navigator.mediaSession.metadata = null;
    navigator.mediaSession.playbackState = 'none';
    const actions = ['play', 'pause', 'stop', 'seekbackward', 'seekforward', 'previoustrack', 'nexttrack'];
    actions.forEach((act) => {
      try {
        navigator.mediaSession.setActionHandler(act, null);
      } catch {
        // Unsupported media action on this browser
      }
    });
  } catch {
    // Ignore restricted MediaSession contexts
  }
}

/**
 * Configures iOS 17+ navigator.audioSession cleanly:
 * - 'playback': plays through mute switch and preserves high-quality stereo A2DP on AirPods/Bluetooth
 * - 'play-and-record': allows simultaneous input capture + Web Audio monitoring in Line/Mic Mode
 */
export function setIOSAudioSessionType(type = 'playback') {
  if (typeof navigator === 'undefined' || !navigator.audioSession) return false;
  try {
    if (navigator.audioSession.type !== type) {
      navigator.audioSession.type = type;
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Plays an imperceptible 1-sample silent buffer to prime iOS WebKit hardware audio routing
 * without creating an HTML <audio> tag (which would trigger the Lock Screen player).
 */
export function primeAudioContextSilent(ctx) {
  if (!ctx) return;
  try {
    const buf = ctx.createBuffer(1, 1, 22050);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.connect(ctx.destination);
    src.start(0);
  } catch {
    // Context closed or not yet ready
  }
}

class MobileAudioGuard {
  constructor() {
    this.initialized = false;
    this.unlocked = false;
    this.wakeLockSentinel = null;
    this.onWakeRecovery = null;
    this.onUnlockState = null;
    this.getContexts = () => [];
  }

  init({ getContexts, onWakeRecovery = null, onUnlockState = null } = {}) {
    if (this.initialized) return;
    this.initialized = true;
    if (typeof getContexts === 'function') this.getContexts = getContexts;
    this.onWakeRecovery = onWakeRecovery;
    this.onUnlockState = onUnlockState;

    setIOSAudioSessionType('playback');
    disableLockScreenMediaSession();

    const handleFirstGesture = () => {
      this.unlockNow();
    };

    const gestureEvents = ['touchstart', 'pointerdown', 'mousedown', 'keydown'];
    gestureEvents.forEach((evName) => {
      window.addEventListener(evName, handleFirstGesture, { capture: true, passive: true });
    });

    // Recover interrupted/suspended AudioContexts after screen lock, incoming call, or app switch
    const handleResumeCheck = () => {
      if (document.visibilityState === 'visible') {
        disableLockScreenMediaSession();
        this.recoverContexts();
      }
    };

    document.addEventListener('visibilitychange', handleResumeCheck);
    window.addEventListener('pageshow', handleResumeCheck);
    window.addEventListener('focus', handleResumeCheck);
  }

  attachContextStateWatcher(ctx) {
    if (!ctx || ctx.__saGuardAttached) return;
    ctx.__saGuardAttached = true;

    ctx.addEventListener('statechange', () => {
      if (ctx.state === 'running') {
        if (!this.unlocked) {
          this.unlocked = true;
          if (this.onUnlockState) this.onUnlockState(true);
        }
        disableLockScreenMediaSession();
      } else if (ctx.state === 'interrupted' || ctx.state === 'suspended') {
        if (document.visibilityState === 'visible') {
          ctx.resume().catch(() => {});
        }
      }
    });
  }

  async unlockNow() {
    setIOSAudioSessionType('playback');
    disableLockScreenMediaSession();

    const contexts = this.getContexts().filter(Boolean);
    for (const ctx of contexts) {
      this.attachContextStateWatcher(ctx);
      if (ctx.state === 'suspended' || ctx.state === 'interrupted') {
        try {
          await ctx.resume();
        } catch {
          // Will retry on next user tap
        }
      }
      if (!this.unlocked && ctx.state === 'running') {
        primeAudioContextSilent(ctx);
      }
      if (ctx.state === 'running') {
        this.unlocked = true;
        if (this.onUnlockState) this.onUnlockState(true);
      }
    }
  }

  async recoverContexts() {
    const contexts = this.getContexts().filter(Boolean);
    let recovered = false;
    for (const ctx of contexts) {
      this.attachContextStateWatcher(ctx);
      if (ctx.state === 'suspended' || ctx.state === 'interrupted') {
        try {
          await ctx.resume();
          primeAudioContextSilent(ctx);
          recovered = true;
        } catch {
          // Requires user tap on strict iOS policy
        }
      }
    }
    if (recovered && this.onWakeRecovery) {
      this.onWakeRecovery();
    }
  }

  async syncWakeLock(shouldHold) {
    if (typeof navigator === 'undefined' || !navigator.wakeLock?.request) return;
    if (shouldHold && document.visibilityState === 'visible') {
      if (this.wakeLockSentinel) return;
      try {
        this.wakeLockSentinel = await navigator.wakeLock.request('screen');
        this.wakeLockSentinel.addEventListener('release', () => {
          this.wakeLockSentinel = null;
        });
      } catch {
        // Wake lock denied or unsupported in battery-saver mode
      }
    } else if (!shouldHold && this.wakeLockSentinel) {
      try {
        await this.wakeLockSentinel.release();
      } catch {
        // Already released
      }
      this.wakeLockSentinel = null;
    }
  }
}

export const mobileAudioGuard = new MobileAudioGuard();
