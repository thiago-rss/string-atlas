/**
 * Real-Time Microphone & Audio Interface (Line Mode) Engine UI — v8.6 (Oud Visualizer Model)
 * - Powers BOTH the sleek Live Stage HUD attached directly above the virtual fretboard
 *   (Chromatic/Scordatura Tuner + Micro-Bend +50c Gauge + 6/7/8-string Reference Pegs)
 *   AND the full Line Mode Workbench inside Studio -> Study (with Etude Auto-Validator).
 * - Multi-channel USB Interface routing (L+R, Ch 1, Ch 2) + automatic hot-plug device detection.
 */
import { intervalQToLabel, mod24, qToFreq, qToNoteName } from '../core/theory24.js';
import { t } from '../core/i18n.js';
import { getActiveScale, getState, setState } from '../state/store.js';
import { pitchDetector } from '../audio/pitchDetector.js';
import { synthEngine } from '../audio/synthEngine.js';
import {
  clearFretboardLiveTrail,
  highlightFretboardEtudeEvent,
  highlightFretboardLivePitch
} from './fretboardView.js';
import { highlightEtudeStep } from './etudeView.js';
import { highlightNotationStep } from './notationView.js';

let targetLockStartMs = 0;
let lastValidatedIdx = -1;
let deviceWatcherAttached = false;

export async function refreshAudioDevices() {
  const devices = await pitchDetector.listInputDevices();
  setState({ audioInputDevices: devices });
  return devices;
}

export function initAudioDeviceWatcher() {
  if (deviceWatcherAttached) return;
  deviceWatcherAttached = true;
  pitchDetector.watchDeviceChanges((devices) => {
    setState({ audioInputDevices: devices });
  });
}

/**
 * Sleek Live Stage HUD perched right above the virtual fretboard whenever Mic or Line Mode is ON.
 * Completely hidden when listening is OFF to preserve the clean Oud-Visualizer stage!
 */
export function renderLiveStageHud(state) {
  const hud = document.getElementById('liveStageHud');
  if (!hud) return;

  if (!state.lineModeRunning) {
    hud.hidden = true;
    return;
  }
  hud.hidden = false;

  const isTuner = state.lineHudMode !== 'microbend';
  const srcLabel = state.lineInputMode === 'line'
    ? `🔌 LINE · ${state.lineChannel.toUpperCase()}`
    : '🎙 MIC';
  const rateTxt = state.lineInputMeta?.sampleRate
    ? `${(state.lineInputMeta.sampleRate / 1000).toFixed(1)}kHz`
    : '';

  const gaugeHtml = isTuner
    ? `
      <div class="stage-gauge-track is-tuner-mode">
        <div class="stage-tuner-center-zone" title="±6¢"></div>
        <span class="stage-gauge-tick" style="left:8%">−50¢</span>
        <span class="stage-gauge-tick is-center" style="left:50%">0¢</span>
        <span class="stage-gauge-tick" style="left:92%">+50¢</span>
        <div class="stage-gauge-needle" id="stageLiveNeedle" style="left:50%;opacity:0.25"></div>
      </div>
    `
    : `
      <div class="stage-gauge-track is-bend-mode">
        <div class="bend-zone-quarter" title="+50¢ (¼ tom)"></div>
        <span class="stage-gauge-tick" style="left:16.7%">0¢</span>
        <span class="stage-gauge-tick is-center" style="left:58.3%">+50¢ (¼)</span>
        <span class="stage-gauge-tick" style="left:95%">+100¢</span>
        <div class="stage-gauge-needle" id="stageLiveNeedle" style="left:16.7%;opacity:0.25"></div>
      </div>
    `;

  const pegsHtml = isTuner
    ? `
      <div class="stage-tuner-pegs" id="stageTunerPegs">
        ${state.customStringsQ.map((sq, idx) => {
          const gStr = state.customStringsQ.length - idx;
          return `
            <button type="button" class="stage-peg-btn" data-sh-action="auditionString" data-q="${sq}" data-peg-idx="${idx}" title="${t(state.lang, 'stagePegAuditionTip')}">
              <span class="stage-peg-num">${gStr}</span>
              <strong>${qToNoteName(sq, true)}</strong>
              <span class="stage-peg-delta" data-peg-delta="${idx}">—</span>
            </button>
          `;
        }).join('')}
      </div>
    `
    : '';

  hud.innerHTML = `
    <div class="stage-hud-top">
      <div class="stage-hud-readout">
        <span class="stage-hud-note" id="stageLiveNote">—</span>
        <div class="stage-hud-meta-col">
          <div class="stage-hud-badges">
            <span class="mono-tag" id="stageLiveFreq">0.0 Hz</span>
            <span class="soft-tag" id="stageLiveScaleTag">${t(state.lang, 'lineWaiting')}</span>
          </div>
          <span class="mono-tag stage-hud-advice" id="stageTunerAdvice">${srcLabel}${rateTxt ? ` · ${rateTxt}` : ''} · ${t(state.lang, isTuner ? 'tunerStripHint' : 'lineBendTip')}</span>
        </div>
      </div>

      <div class="stage-hud-gauge-wrap">
        ${gaugeHtml}
        <div class="stage-vu-mini" aria-hidden="true">
          <div class="stage-vu-fill" id="stageVuFill" style="width:0%"></div>
        </div>
      </div>

      <div class="stage-hud-actions">
        <button type="button" class="btn-mini ${isTuner ? 'active-mini' : ''}" data-sh-action="setHudMode" data-val="tuner">${t(state.lang, 'hudModeTuner')}</button>
        <button type="button" class="btn-mini ${!isTuner ? 'active-mini' : ''}" data-sh-action="setHudMode" data-val="microbend">${t(state.lang, 'hudModeBend')}</button>
        <button type="button" class="btn-mini" data-sh-action="openConfig" title="${t(state.lang, 'dockInput')}">⚙</button>
        <button type="button" class="btn-danger stage-stop-btn" data-sh-action="stop">■</button>
      </div>
    </div>
    ${pegsHtml}
  `;

  hud.onclick = (e) => {
    const btn = e.target.closest('button[data-sh-action]');
    if (!btn) return;
    const act = btn.dataset.shAction;
    const st = getState();

    if (act === 'stop') {
      stopLineMode();
    } else if (act === 'setHudMode') {
      setState({ lineHudMode: btn.dataset.val });
    } else if (act === 'openConfig') {
      setState({ deckCompartment: st.deckCompartment === 'input' ? null : 'input' });
    } else if (act === 'auditionString') {
      synthEngine.pluckQ(Number(btn.dataset.q), { duration: 2.1, velocity: 0.36 });
    }
  };
}

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

        <div class="control-group" style="flex:1;min-width:190px">
          <select id="selAudioInput" aria-label="${t(state.lang, 'lineDeviceLabel')}">${deviceOptions}</select>
        </div>

        <button type="button" class="btn-mini" data-l-action="refreshDevices" title="${t(state.lang, 'lineRefreshDevices')}">↻</button>

        <div class="pill-row" role="group" aria-label="${t(state.lang, 'lineChannelLabel')}">
          <button type="button" class="btn-mini ${state.lineChannel === 'mix' ? 'active-mini' : ''}" data-l-action="setChannel" data-val="mix">L+R</button>
          <button type="button" class="btn-mini ${state.lineChannel === 'ch1' ? 'active-mini' : ''}" data-l-action="setChannel" data-val="ch1">Ch 1</button>
          <button type="button" class="btn-mini ${state.lineChannel === 'ch2' ? 'active-mini' : ''}" data-l-action="setChannel" data-val="ch2">Ch 2</button>
        </div>

        <button type="button" class="btn-pill ${state.lineShowOnNeck ? 'active' : ''}" data-l-action="toggleNeckMirror">
          ${t(state.lang, 'lineMirrorNeck')}
        </button>

        <button type="button" class="btn-pill ${state.lineTrailOn ? 'active-teal' : ''}" data-l-action="toggleTrail">
          ${t(state.lang, 'lineTrailLabel')}
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

      ${state.lineModeRunning && state.lineInputMeta ? `
        <div class="line-meta-strip">
          <span class="mono-tag">● ${(state.lineInputMeta.sampleRate / 1000).toFixed(1)} kHz · ${state.lineInputMeta.channelCount}ch · ${state.lineChannel.toUpperCase()}</span>
          ${state.lineInputMeta.label ? `<span class="soft-tag">${state.lineInputMeta.label}</span>` : ''}
          ${state.lineInputMeta.usedFallback ? `<span class="soft-tag" style="color:var(--accent-root)">${t(state.lang, 'lineFallbackTag')}</span>` : ''}
          ${state.lineInputMeta.isBluetooth ? `<span class="line-bt-warn">${t(state.lang, 'lineBtWarning')}</span>` : ''}
        </div>
      ` : ''}
      ${state.lineError ? `<p class="line-error-banner">${state.lineError}</p>` : ''}

      <div class="line-telemetry-grid">
        <div class="telemetry-card">
          <span class="control-label">${t(state.lang, 'lineDetected24')}</span>
          <div class="detected-note-big" id="liveNoteBig">—</div>
          <div class="detected-meta">
            <span class="mono-tag" id="liveFreqTxt">0.00 Hz</span>
            <span class="soft-tag" id="liveScaleStatus">${t(state.lang, 'lineWaiting')}</span>
          </div>
        </div>

        <div class="telemetry-card bend-gauge-card">
          <div class="bend-gauge-head">
            <span class="control-label">${t(state.lang, 'lineBendGaugeTitle')}</span>
            <span class="mono-tag" id="liveBendReadout">—</span>
          </div>

          <div class="bend-gauge-track">
            <div class="bend-zone-quarter" title="+50¢ (¼ tom)"></div>
            <div class="bend-tick" style="left:16.67%"><span>0¢</span></div>
            <div class="bend-tick is-quarter" style="left:58.33%"><span>+50¢ (¼)</span></div>
            <div class="bend-tick" style="left:100%"><span>+100¢</span></div>
            <div class="bend-needle" id="liveBendNeedle" style="left:16.67%;opacity:0.25"></div>
          </div>

          <p class="mono-tag" style="margin:6px 0 0" id="liveBendAnchorTip">${t(state.lang, 'lineBendTip')}</p>
        </div>

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

      <div class="scordatura-tuner-box">
        <div class="rhythm-track-head" style="margin-bottom:8px">
          <span class="control-label">${t(state.lang, 'tunerStripTitle')}</span>
          <span class="mono-tag" id="tunerLiveAdvice">${t(state.lang, 'tunerStripHint')}</span>
        </div>
        <div class="tuner-strings-grid" id="scordaturaTunerGrid">
          ${state.customStringsQ.map((sq, idx) => {
            const gStr = state.customStringsQ.length - idx;
            const hz = qToFreq(sq);
            return `
              <button type="button" class="tuner-str-card" data-l-action="auditionString" data-q="${sq}" data-tuner-idx="${idx}">
                <span class="tuner-str-num">${t(state.lang, 'inspString')} ${gStr}</span>
                <strong class="tuner-str-note">${qToNoteName(sq, true)}</strong>
                <span class="mono-tag">${hz.toFixed(1)} Hz</span>
                <span class="tuner-str-delta" data-tuner-delta="${idx}">—</span>
              </button>
            `;
          }).join('')}
        </div>
      </div>

      <p class="empty-hint" style="margin-top:10px">${t(state.lang, 'lineTipFooter')}</p>
    </div>
  `;

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
    } else if (act === 'refreshDevices') {
      refreshAudioDevices();
    } else if (act === 'setMode') {
      const nextMode = btn.dataset.val;
      setState({ lineInputMode: nextMode });
      if (st.lineModeRunning) startLineMode();
    } else if (act === 'setChannel') {
      const nextCh = btn.dataset.val;
      pitchDetector.setChannel(nextCh);
      setState({ lineChannel: nextCh });
    } else if (act === 'toggleNeckMirror') {
      const next = !st.lineShowOnNeck;
      if (!next) {
        clearFretboardLiveTrail();
        highlightFretboardLivePitch(null, { ...st, lineShowOnNeck: false });
      }
      setState({ lineShowOnNeck: next });
    } else if (act === 'toggleTrail') {
      const next = !st.lineTrailOn;
      if (!next) clearFretboardLiveTrail();
      setState({ lineTrailOn: next });
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
    } else if (act === 'auditionString') {
      synthEngine.pluckQ(Number(btn.dataset.q), { duration: 2.2, velocity: 0.36 });
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
  clearFretboardLiveTrail();
  setState({ lineError: '' });

  try {
    const meta = await pitchDetector.start({
      mode: st.lineInputMode,
      deviceId: st.lineDeviceId,
      channel: st.lineChannel,
      rmsGate: st.lineRmsGate,
      inputGain: st.lineInputGain,
      onFrame: (frame) => handleLivePitchFrame(frame),
      onEnded: () => {
        const cur = getState();
        clearFretboardLiveTrail();
        highlightFretboardLivePitch(null, cur);
        setState({
          lineModeRunning: false,
          lineInputMeta: null,
          lineError: t(cur.lang, 'lineErrDisconnected')
        });
        updateLineHeaderBadge(false, null);
      }
    });

    const devices = await pitchDetector.listInputDevices();
    setState({
      lineModeRunning: true,
      audioInputDevices: devices,
      lineInputMeta: meta,
      lineError: ''
    });
    updateLineHeaderBadge(true, null);
  } catch (err) {
    const curLang = getState().lang;
    const msg = err?.message === 'UNSUPPORTED_BROWSER'
      ? t(curLang, 'lineErrUnsupported')
      : t(curLang, 'lineErrPermission');
    setState({ lineModeRunning: false, lineInputMeta: null, lineError: msg });
    updateLineHeaderBadge(false, null);
  }
}

export function stopLineMode() {
  pitchDetector.stop();
  clearFretboardLiveTrail();
  const st = getState();
  highlightFretboardLivePitch(null, { ...st, lineShowOnNeck: false });
  targetLockStartMs = 0;
  lastValidatedIdx = -1;
  setState({ lineModeRunning: false, lineInputMeta: null });
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
 * Syncs Live Stage HUD, Deck VU meter, Virtual Fretboard Tracker/Trail, Tuner Pegs, Zen HUD & Etude Validator.
 */
function handleLivePitchFrame({ rms, pitch }) {
  const st = getState();
  const vuPct = Math.min(100, Math.round(Math.sqrt(rms) * 230));
  const aboveGate = rms >= st.lineRmsGate;

  // 1. Update all visible VU meters (Workbench, Upper Deck Compartment, Live Stage HUD)
  ['lineLevelFill', 'deckLineLevelFill', 'stageVuFill'].forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.style.width = `${vuPct}%`;
    el.classList.toggle('is-above-gate', aboveGate);
  });

  // 2. Mirror live note + trail on virtual fretboard SVG (Horizontal & Vertical!)
  highlightFretboardLivePitch(pitch, st);
  updateLineHeaderBadge(st.lineModeRunning, pitch);

  const noteEl = document.getElementById('liveNoteBig');
  const freqEl = document.getElementById('liveFreqTxt');
  const statusEl = document.getElementById('liveScaleStatus');
  const bendReadEl = document.getElementById('liveBendReadout');
  const needleEl = document.getElementById('liveBendNeedle');
  const anchorTipEl = document.getElementById('liveBendAnchorTip');
  const matchEl = document.getElementById('liveEtudeMatchStatus');

  const stageNoteEl = document.getElementById('stageLiveNote');
  const stageFreqEl = document.getElementById('stageLiveFreq');
  const stageScaleEl = document.getElementById('stageLiveScaleTag');
  const stageNeedleEl = document.getElementById('stageLiveNeedle');

  if (!pitch) {
    if (noteEl) noteEl.textContent = '—';
    if (freqEl) freqEl.textContent = '0.00 Hz';
    if (needleEl) needleEl.style.opacity = '0.25';
    if (stageNoteEl) {
      stageNoteEl.textContent = '—';
      stageNoteEl.classList.remove('is-in-scale', 'is-root', 'is-micro', 'is-out');
    }
    if (stageFreqEl) stageFreqEl.textContent = '0.0 Hz';
    if (stageNeedleEl) stageNeedleEl.style.opacity = '0.25';
    updateScordaturaTunerLive(null, st);
    targetLockStartMs = 0;
    return;
  }

  // 3. Scale / Maqam membership check
  const scale = getActiveScale();
  const relIv = mod24(pitch.pc24 - st.rootQ);
  const inScale = scale.intervalsQ.includes(relIv);
  const isRoot = relIv === 0;
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

  // 3b. Update Live Stage HUD above the virtual fretboard
  if (stageNoteEl) {
    stageNoteEl.textContent = pitch.noteName24;
    stageNoteEl.classList.toggle('is-root', isRoot);
    stageNoteEl.classList.toggle('is-in-scale', inScale && !isRoot);
    stageNoteEl.classList.toggle('is-micro', pitch.isQuarterTone && inScale);
    stageNoteEl.classList.toggle('is-out', !inScale);
  }
  if (stageFreqEl) {
    stageFreqEl.textContent = `${pitch.freq.toFixed(1)} Hz · ${c24Txt}`;
  }
  if (stageScaleEl) {
    stageScaleEl.textContent = inScale
      ? `${intervalQToLabel(relIv)} · ${t(st.lang, 'lineInScale')}`
      : t(st.lang, 'lineOutOfScale');
    stageScaleEl.style.borderColor = isRoot
      ? 'var(--accent-root)'
      : (inScale ? 'var(--accent-live)' : 'var(--accent-danger)');
    stageScaleEl.style.color = isRoot
      ? 'var(--accent-root)'
      : (inScale ? 'var(--accent-live)' : 'var(--accent-danger)');
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

  // Stage HUD needle: either Chromatic/Scordatura Tuner (-50..+50c) OR Micro-Bend (-20..+100c)
  if (stageNeedleEl) {
    if (st.lineHudMode === 'microbend') {
      stageNeedleEl.style.left = `${pctX.toFixed(1)}%`;
      stageNeedleEl.style.opacity = '1';
      stageNeedleEl.classList.toggle('is-lock', inQuarterZone);
      const stageAdv = document.getElementById('stageTunerAdvice');
      if (stageAdv) {
        const bRound = Math.round(pitch.bendCentsFromAnchor);
        stageAdv.textContent = inQuarterZone
          ? `${pitch.bendAnchorName} +${bRound}¢ · ${t(st.lang, 'lineQuarterLocked')}`
          : `${pitch.bendAnchorName} ${bRound >= 0 ? '+' : ''}${bRound}¢ · ${t(st.lang, 'lineBendTip')}`;
      }
    } else {
      const clampedTuner = Math.max(-50, Math.min(50, pitch.centsFrom12));
      const tunerPct = ((clampedTuner + 50) / 100) * 100;
      stageNeedleEl.style.left = `${tunerPct.toFixed(1)}%`;
      stageNeedleEl.style.opacity = '1';
      stageNeedleEl.classList.toggle('is-lock', Math.abs(pitch.centsFrom12) <= 6);
    }
  }

  const zenNote = document.getElementById('zenLiveNote');
  const zenNeedle = document.getElementById('zenBendNeedle');
  if (zenNote) {
    zenNote.textContent = `${pitch.noteName24} (${Math.round(pitch.bendCentsFromAnchor) >= 0 ? '+' : ''}${Math.round(pitch.bendCentsFromAnchor)}¢)`;
  }
  if (zenNeedle) {
    zenNeedle.style.left = `${pctX.toFixed(1)}%`;
    zenNeedle.classList.toggle('is-quarter-lock', inQuarterZone);
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

  // 4b. Update Scordatura Tuner (both Stage HUD Peg Strip & Workbench Grid)
  updateScordaturaTunerLive(pitch, st);

  // 5. Etude Target Real-Time Validation (Auto-Advance on ±18c pitch lock for 160ms)
  if (st.lineValidateEtude && st.currentEtude?.events?.length) {
    const events = st.currentEtude.events;
    const curIdx = st.etudeActiveIdx >= 0 ? st.etudeActiveIdx : 0;
    const targetEv = events[curIdx % events.length];
    const diffCents = Math.abs(pitch.exactQ - targetEv.q) * 50;
    const pcDiffCents = Math.min(
      Math.abs(mod24(pitch.nearestQ - targetEv.q)),
      24 - Math.abs(mod24(pitch.nearestQ - targetEv.q))
    ) * 50 + Math.abs(pitch.centsFrom24);

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

function updateScordaturaTunerLive(pitch, st) {
  const grid = document.getElementById('scordaturaTunerGrid');
  const adviceEl = document.getElementById('tunerLiveAdvice');
  const stagePegs = document.getElementById('stageTunerPegs');
  const stageAdvice = st.lineHudMode !== 'microbend' ? document.getElementById('stageTunerAdvice') : null;
  const stageNeedle = st.lineHudMode !== 'microbend' ? document.getElementById('stageLiveNeedle') : null;

  if (!pitch) {
    if (grid) {
      grid.querySelectorAll('.tuner-str-card').forEach((card) => {
        card.classList.remove('is-nearest', 'is-in-tune');
      });
    }
    if (stagePegs) {
      stagePegs.querySelectorAll('.stage-peg-btn').forEach((peg) => {
        peg.classList.remove('is-nearest', 'is-in-tune');
      });
    }
    return;
  }

  let bestIdx = -1;
  let bestDeltaCents = Infinity;
  st.customStringsQ.forEach((sq, idx) => {
    const delta = (pitch.exactQ - sq) * 50;
    if (Math.abs(delta) < Math.abs(bestDeltaCents)) {
      bestDeltaCents = delta;
      bestIdx = idx;
    }
  });

  const withinRange = bestIdx >= 0 && Math.abs(bestDeltaCents) <= 350;
  const inTune = withinRange && Math.abs(bestDeltaCents) <= 6;

  // When locked close to a target open string in Tuner mode, point the Stage HUD needle straight at that string!
  if (withinRange && stageNeedle && Math.abs(bestDeltaCents) <= 65) {
    const clamped = Math.max(-50, Math.min(50, bestDeltaCents));
    stageNeedle.style.left = `${(((clamped + 50) / 100) * 100).toFixed(1)}%`;
    stageNeedle.style.opacity = '1';
    stageNeedle.classList.toggle('is-lock', inTune);
  }

  if (grid) {
    grid.querySelectorAll('.tuner-str-card').forEach((card) => {
      const idx = Number(card.dataset.tunerIdx);
      const isHit = withinRange && idx === bestIdx;
      card.classList.toggle('is-nearest', isHit);
      card.classList.toggle('is-in-tune', isHit && inTune);
      const deltaEl = card.querySelector(`[data-tuner-delta="${idx}"]`);
      if (deltaEl) {
        if (isHit) {
          const r = Math.round(bestDeltaCents);
          deltaEl.textContent = inTune ? `✔ ${r >= 0 ? '+' : ''}${r}¢` : `${r >= 0 ? '+' : ''}${r}¢`;
        } else {
          deltaEl.textContent = '—';
        }
      }
    });
  }

  if (stagePegs) {
    stagePegs.querySelectorAll('.stage-peg-btn').forEach((peg) => {
      const idx = Number(peg.dataset.pegIdx);
      const isHit = withinRange && idx === bestIdx;
      peg.classList.toggle('is-nearest', isHit);
      peg.classList.toggle('is-in-tune', isHit && inTune);
      const deltaEl = peg.querySelector(`[data-peg-delta="${idx}"]`);
      if (deltaEl) {
        if (isHit) {
          const r = Math.round(bestDeltaCents);
          deltaEl.textContent = inTune ? '✔' : `${r >= 0 ? '+' : ''}${r}¢`;
        } else {
          deltaEl.textContent = '—';
        }
      }
    });
  }

  let adviceText = t(st.lang, 'tunerStripHint');
  if (withinRange) {
    const strName = qToNoteName(st.customStringsQ[bestIdx], true);
    const strNum = st.customStringsQ.length - bestIdx;
    if (inTune) {
      adviceText = `✔ ${t(st.lang, 'inspString')} ${strNum} (${strName}) · ${t(st.lang, 'tunerInTune')}`;
    } else {
      const dir = bestDeltaCents < 0 ? t(st.lang, 'tunerTighten') : t(st.lang, 'tunerLoosen');
      adviceText = `${t(st.lang, 'inspString')} ${strNum} (${strName}): ${dir} (${Math.round(bestDeltaCents)}¢)`;
    }
  } else {
    const c12 = Math.round(pitch.centsFrom12);
    adviceText = `${pitch.nearest12Name} (${c12 >= 0 ? '+' : ''}${c12}¢)`;
  }

  if (adviceEl) adviceEl.textContent = adviceText;
  if (stageAdvice) stageAdvice.textContent = adviceText;
}
