/**
 * Phase 4 Line Mode & 24-TET Micro-Bend Precision Monitor
 * - Direct Audio Interface Line Mode (raw unprocessed input) & Microphone Mode
 * - Live 24-TET pitch readout, Hz, Scale/Maqam degree validation, & +50c Micro-Bend Gauge
 * - Optional Etude Target Lock: holds target pitch within ±16c to validate and auto-advance steps!
 */
import { intervalQToLabel, mod24, qToNoteName } from '../core/theory24.js';
import { t } from '../core/i18n.js';
import { getActiveScale, getState, setState } from '../state/store.js';
import { pitchDetector } from '../audio/pitchDetector.js';
import { highlightFretboardEtudeEvent, highlightFretboardLivePitch } from './fretboardView.js';
import { highlightEtudeStep } from './etudeView.js';
import { highlightNotationStep } from './notationView.js';

let targetLockStartMs = 0;
let lastValidatedIdx = -1;

export function renderLineModeView(state) {
  const container = document.getElementById('tabLineMode');
  if (!container) return;

  const deviceOptions = state.audioInputDevices.length
    ? [
        `<option value="">${t(state.lang, 'lineDefaultDevice')}</option>`,
        ...state.audioInputDevices.map(
          (d) => `<option value="${d.deviceId}" ${d.deviceId === state.lineDeviceId ? 'selected' : ''}>${d.label}</option>`
        )
      ].join('')
    : `<option value="">${t(state.lang, 'lineDefaultDevice')}</option>`;

  const targetEv = getCurrentEtudeTargetEvent(state);
  const targetNoteTxt = targetEv
    ? `${targetEv.kind === 'harmonic' ? `${targetEv.partial}º` : qToNoteName(targetEv.q, true)} (S${targetEv.guitarStr}·${targetEv.isMicro ? `${targetEv.fret}↑¼` : targetEv.fret})`
    : '—';

  container.innerHTML = `
    <div class="panel">
      <div class="section-heading" style="flex-wrap:wrap">
        <span>${t(state.lang, 'lineTitle')}</span>
        <span class="mono-tag">${t(state.lang, 'lineRangeBadge')}</span>
      </div>

      <div class="line-controls-bar">
        <button type="button" class="${state.lineModeRunning ? 'btn-danger' : 'btn-primary'}" data-l-action="toggleStart">
          ${state.lineModeRunning ? t(state.lang, 'lineStop') : t(state.lang, 'lineStart')}
        </button>

        <div class="pill-row">
          <button type="button" class="btn-pill ${state.lineInputMode === 'line' ? 'active-teal' : ''}" data-l-action="setMode" data-val="line">
            ${t(state.lang, 'lineModeDirect')}
          </button>
          <button type="button" class="btn-pill ${state.lineInputMode === 'mic' ? 'active-teal' : ''}" data-l-action="setMode" data-val="mic">
            ${t(state.lang, 'lineModeMic')}
          </button>
        </div>

        <div class="control-group" style="flex:1;min-width:200px">
          <select id="selAudioInput" aria-label="${t(state.lang, 'lineDeviceLabel')}">${deviceOptions}</select>
        </div>

        <button type="button" class="btn-pill ${state.lineShowOnNeck ? 'active' : ''}" data-l-action="toggleNeckMirror">
          ${t(state.lang, 'lineMirrorNeck')}
        </button>

        <button type="button" class="btn-pill ${state.lineValidateEtude ? 'active-voicing' : ''}" data-l-action="toggleEtudeValidate">
          ${t(state.lang, 'lineValidateEtude')}
        </button>
      </div>

      <div class="line-dsp-row">
        <label class="bpm-control">
          <span>${t(state.lang, 'lineGainLabel')}</span>
          <input type="range" id="rngLineGain" min="0.5" max="3.5" step="0.1" value="${state.lineInputGain}" />
          <strong id="valLineGain">${state.lineInputGain.toFixed(1)}×</strong>
        </label>

        <label class="bpm-control">
          <span>${t(state.lang, 'lineGateLabel')}</span>
          <input type="range" id="rngLineGate" min="0.004" max="0.060" step="0.002" value="${state.lineRmsGate}" />
          <strong id="valLineGate">${Math.round(state.lineRmsGate * 1000)}</strong>
        </label>

        <div class="level-meter-wrap">
          <span class="control-label">${t(state.lang, 'lineInputLevel')}</span>
          <div class="level-meter-track">
            <div class="level-meter-fill" id="lineLevelFill" style="width:0%"></div>
          </div>
        </div>
      </div>

      ${state.lineError ? `<p class="line-error-banner">${state.lineError}</p>` : ''}

      <div class="line-telemetry-grid">
        <!-- Main 24-TET Readout Card -->
        <div class="telemetry-card">
          <span class="control-label">${t(state.lang, 'lineDetected24')}</span>
          <div class="detected-note-big" id="liveNoteBig">—</div>
          <div class="detected-meta">
            <span class="mono-tag" id="liveFreqTxt">0.00 Hz</span>
            <span class="soft-tag" id="liveScaleStatus">${t(state.lang, 'lineWaiting')}</span>
          </div>
        </div>

        <!-- Micro-Bend Precision Gauge (-20c .. +100c) -->
        <div class="telemetry-card bend-gauge-card">
          <div class="bend-gauge-head">
            <span class="control-label">${t(state.lang, 'lineBendGaugeTitle')}</span>
            <span class="mono-tag" id="liveBendReadout">—</span>
          </div>

          <div class="bend-gauge-track">
            <!-- Target sweet-spot zone centered at +50c (58.3% along -20..+100 scale) -->
            <div class="bend-zone-quarter" title="+50¢ (¼ tom)"></div>
            <div class="bend-tick" style="left:16.67%"><span>0¢</span></div>
            <div class="bend-tick is-quarter" style="left:58.33%"><span>+50¢ (¼)</span></div>
            <div class="bend-tick" style="left:100%"><span>+100¢</span></div>
            <div class="bend-needle" id="liveBendNeedle" style="left:16.67%;opacity:0.25"></div>
          </div>

          <p class="mono-tag" style="margin:6px 0 0" id="liveBendAnchorTip">${t(state.lang, 'lineBendTip')}</p>
        </div>

        <!-- Etude Target Validator Card -->
        <div class="telemetry-card">
          <div class="bend-gauge-head">
            <span class="control-label">${t(state.lang, 'lineEtudeTargetTitle')}</span>
            <span class="mono-tag" id="liveEtudeCounter">${state.etudeActiveIdx >= 0 ? `#${state.etudeActiveIdx + 1}` : '#1'} / ${state.currentEtude?.events?.length || 0}</span>
          </div>
          <div class="etude-target-big" id="liveEtudeTargetNote">${targetNoteTxt}</div>
          <div class="detected-meta">
            <span class="soft-tag" id="liveEtudeMatchStatus">${state.lineValidateEtude ? t(state.lang, 'lineTargetReady') : t(state.lang, 'lineTargetOff')}</span>
            <button type="button" class="btn-mini" data-l-action="resetEtudeTarget">${t(state.lang, 'lineResetTarget')}</button>
          </div>
        </div>
      </div>

      <p class="empty-hint" style="margin-top:10px">${t(state.lang, 'lineTipFooter')}</p>
    </div>
  `;

  // Bind device, gain & gate controls cleanly
  container.querySelector('#selAudioInput').onchange = (e) => {
    const devId = e.target.value;
    setState({ lineDeviceId: devId });
    if (getState().lineModeRunning) {
      startLineMode();
    }
  };

  const gainSlider = container.querySelector('#rngLineGain');
  const gainVal = container.querySelector('#valLineGain');
  gainSlider.oninput = (e) => {
    const val = Number(e.target.value);
    gainVal.textContent = `${val.toFixed(1)}×`;
    pitchDetector.setInputGain(val);
    setState({ lineInputGain: val });
  };

  const gateSlider = container.querySelector('#rngLineGate');
  const gateVal = container.querySelector('#valLineGate');
  gateSlider.oninput = (e) => {
    const val = Number(e.target.value);
    gateVal.textContent = `${Math.round(val * 1000)}`;
    pitchDetector.setGate(val);
    setState({ lineRmsGate: val });
  };

  container.onclick = (e) => {
    const btn = e.target.closest('button[data-l-action]');
    if (!btn) return;
    const act = btn.dataset.lAction;
    const st = getState();

    if (act === 'toggleStart') {
      if (st.lineModeRunning) stopLineMode();
      else startLineMode();
    } else if (act === 'setMode') {
      const nextMode = btn.dataset.val;
      setState({ lineInputMode: nextMode });
      if (st.lineModeRunning) startLineMode();
    } else if (act === 'toggleNeckMirror') {
      const next = !st.lineShowOnNeck;
      if (!next) highlightFretboardLivePitch(null, st);
      setState({ lineShowOnNeck: next });
    } else if (act === 'toggleEtudeValidate') {
      const next = !st.lineValidateEtude;
      const startIdx = next && st.etudeActiveIdx < 0 ? 0 : st.etudeActiveIdx;
      targetLockStartMs = 0;
      lastValidatedIdx = -1;
      setState({ lineValidateEtude: next, etudeActiveIdx: startIdx, notationMode: next ? 'etude' : st.notationMode });
    } else if (act === 'resetEtudeTarget') {
      targetLockStartMs = 0;
      lastValidatedIdx = -1;
      setState({ etudeActiveIdx: 0, notationMode: 'etude' });
    }
  };
}

function getCurrentEtudeTargetEvent(state) {
  const events = state.currentEtude?.events || [];
  if (!events.length) return null;
  const idx = state.etudeActiveIdx >= 0 ? state.etudeActiveIdx : 0;
  return events[idx % events.length];
}

export async function startLineMode() {
  const st = getState();
  setState({ lineError: '' });

  try {
    await pitchDetector.start({
      mode: st.lineInputMode,
      deviceId: st.lineDeviceId,
      rmsGate: st.lineRmsGate,
      inputGain: st.lineInputGain,
      onFrame: (frame) => handleLivePitchFrame(frame)
    });

    const devices = await pitchDetector.listInputDevices();
    setState({
      lineModeRunning: true,
      audioInputDevices: devices,
      lineError: ''
    });
    updateLineHeaderBadge(true, null);
  } catch (err) {
    const curLang = getState().lang;
    const msg = err?.message === 'UNSUPPORTED_BROWSER'
      ? t(curLang, 'lineErrUnsupported')
      : t(curLang, 'lineErrPermission');
    setState({ lineModeRunning: false, lineError: msg });
    updateLineHeaderBadge(false, null);
  }
}

export function stopLineMode() {
  pitchDetector.stop();
  const st = getState();
  highlightFretboardLivePitch(null, st);
  targetLockStartMs = 0;
  lastValidatedIdx = -1;
  setState({ lineModeRunning: false });
  updateLineHeaderBadge(false, null);
}

function updateLineHeaderBadge(running, pitch) {
  const badge = document.getElementById('lineStatusBadge');
  if (!badge) return;
  if (!running) {
    badge.hidden = true;
    return;
  }
  badge.hidden = false;
  badge.textContent = pitch
    ? `● LIVE: ${pitch.noteName24} (${pitch.centsFrom24 >= 0 ? '+' : ''}${Math.round(pitch.centsFrom24)}¢)`
    : '● LIVE: —';
}

/**
 * High-frequency zero-thrash DOM updater called via requestAnimationFrame from YIN detector.
 */
function handleLivePitchFrame({ rms, pitch }) {
  const st = getState();

  // 1. Update input level meter
  const fillEl = document.getElementById('lineLevelFill');
  if (fillEl) {
    const pct = Math.min(100, Math.round(Math.sqrt(rms) * 230));
    fillEl.style.width = `${pct}%`;
    fillEl.classList.toggle('is-above-gate', rms >= st.lineRmsGate);
  }

  // 2. Mirror live note on fretboard SVG
  highlightFretboardLivePitch(pitch, st);
  updateLineHeaderBadge(st.lineModeRunning, pitch);

  const noteEl = document.getElementById('liveNoteBig');
  const freqEl = document.getElementById('liveFreqTxt');
  const statusEl = document.getElementById('liveScaleStatus');
  const bendReadEl = document.getElementById('liveBendReadout');
  const needleEl = document.getElementById('liveBendNeedle');
  const anchorTipEl = document.getElementById('liveBendAnchorTip');
  const matchEl = document.getElementById('liveEtudeMatchStatus');

  if (!pitch) {
    if (noteEl) noteEl.textContent = '—';
    if (freqEl) freqEl.textContent = '0.00 Hz';
    if (needleEl) needleEl.style.opacity = '0.25';
    targetLockStartMs = 0;
    return;
  }

  // 3. Scale / Maqam membership check
  const scale = getActiveScale();
  const relIv = mod24(pitch.pc24 - st.rootQ);
  const inScale = scale.intervalsQ.includes(relIv);
  const c24 = Math.round(pitch.centsFrom24);
  const c24Txt = `${c24 >= 0 ? '+' : ''}${c24}¢`;

  if (noteEl) {
    noteEl.textContent = pitch.noteName24;
    noteEl.classList.toggle('is-micro', pitch.isQuarterTone);
    noteEl.classList.toggle('is-in-scale', inScale);
  }
  if (freqEl) {
    freqEl.textContent = `${pitch.freq.toFixed(1)} Hz · ${c24Txt}`;
  }
  if (statusEl) {
    statusEl.textContent = inScale
      ? `${t(st.lang, 'lineInScale')} · ${intervalQToLabel(relIv)}`
      : t(st.lang, 'lineOutOfScale');
    statusEl.style.borderColor = inScale ? 'var(--accent-live)' : 'var(--border-subtle)';
    statusEl.style.color = inScale ? 'var(--accent-live)' : 'var(--text-muted)';
  }

  // 4. Micro-Bend Precision Gauge (-20c .. +100c -> 0% .. 100%)
  const clampedBend = Math.max(-20, Math.min(100, pitch.bendCentsFromAnchor));
  const pctX = ((clampedBend + 20) / 120) * 100;
  const inQuarterZone = Math.abs(pitch.bendCentsFromAnchor - 50) <= 14;
  const inZeroZone = Math.abs(pitch.bendCentsFromAnchor) <= 12;

  if (needleEl) {
    needleEl.style.left = `${pctX.toFixed(1)}%`;
    needleEl.style.opacity = '1';
    needleEl.classList.toggle('is-quarter-lock', inQuarterZone);
    needleEl.classList.toggle('is-zero-lock', inZeroZone);
  }
  if (bendReadEl) {
    const bRound = Math.round(pitch.bendCentsFromAnchor);
    bendReadEl.textContent = `${pitch.bendAnchorName} ${bRound >= 0 ? '+' : ''}${bRound}¢`;
  }
  if (anchorTipEl) {
    anchorTipEl.textContent = inQuarterZone
      ? t(st.lang, 'lineQuarterLocked')
      : t(st.lang, 'lineBendTip');
  }

  // 5. Etude Target Real-Time Validation (Auto-Advance on ±16c pitch lock for 160ms)
  if (st.lineValidateEtude && st.currentEtude?.events?.length) {
    const events = st.currentEtude.events;
    const curIdx = st.etudeActiveIdx >= 0 ? st.etudeActiveIdx : 0;
    const targetEv = events[curIdx % events.length];
    const diffCents = Math.abs(pitch.exactQ - targetEv.q) * 50;
    const pcDiffCents = Math.min(
      Math.abs(mod24(pitch.nearestQ - targetEv.q)),
      24 - Math.abs(mod24(pitch.nearestQ - targetEv.q))
    ) * 50 + Math.abs(pitch.centsFrom24);

    // Match exact pitch or octave-equivalent pitch class cleanly
    const isHit = diffCents <= 18 || pcDiffCents <= 18;
    const now = performance.now();

    if (isHit) {
      if (targetLockStartMs === 0) targetLockStartMs = now;
      if (matchEl) {
        matchEl.textContent = t(st.lang, 'lineTargetHit');
        matchEl.style.color = 'var(--accent-live)';
      }

      if (now - targetLockStartMs >= 160 && lastValidatedIdx !== curIdx) {
        lastValidatedIdx = curIdx;
        targetLockStartMs = 0;
        const nextIdx = (curIdx + 1) % events.length;
        const nextEv = events[nextIdx];

        // Update all cursors + target card smoothly
        highlightEtudeStep(nextIdx);
        highlightNotationStep(nextIdx);
        highlightFretboardEtudeEvent(nextEv, st.microMode);
        setState({ etudeActiveIdx: nextIdx });

        const targetNoteEl = document.getElementById('liveEtudeTargetNote');
        const counterEl = document.getElementById('liveEtudeCounter');
        if (targetNoteEl && nextEv) {
          targetNoteEl.textContent = `${nextEv.kind === 'harmonic' ? `${nextEv.partial}º` : qToNoteName(nextEv.q, true)} (S${nextEv.guitarStr}·${nextEv.isMicro ? `${nextEv.fret}↑¼` : nextEv.fret})`;
        }
        if (counterEl) {
          counterEl.textContent = `#${nextIdx + 1} / ${events.length}`;
        }
        setTimeout(() => {
          lastValidatedIdx = -1;
        }, 320);
      }
    } else {
      targetLockStartMs = 0;
      if (matchEl) {
        matchEl.textContent = t(st.lang, 'lineTargetReady');
        matchEl.style.color = 'var(--text-secondary)';
      }
    }
  }
}
