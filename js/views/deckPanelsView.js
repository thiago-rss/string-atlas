/**
 * Top Control Deck v2.0
 */
import { DB } from '../core/database.js';
import { NOTE_NAMES_24, mod24, qToNoteName } from '../core/theory24.js';
import { t } from '../core/i18n.js';
import { getActiveScale, getActiveTuning, setState } from '../state/store.js';
import { synthEngine } from '../audio/synthEngine.js';

export function renderDeckPanel(state) {
  const panel = document.getElementById('deckPanel');
  if (!panel) return;

  const filteredScales = state.category === 'all'
    ? DB.scales
    : DB.scales.filter((s) => s.category === state.category);

  const activeScale = getActiveScale();
  const allowedPcs = new Set(activeScale.intervalsQ.map((iv) => mod24(state.rootQ + iv)));

  const categoryBtns = DB.categories.map((cat) => {
    const label = state.lang === 'en' ? cat.labelEn : cat.labelPt;
    return `<button type="button" class="btn-pill ${state.category === cat.id ? 'active' : ''}" data-action="category" data-val="${cat.id}">${label}</button>`;
  }).join('');

  const scaleOptions = filteredScales.map((s) => {
    const label = state.lang === 'en' ? s.nameEn : s.namePt;
    return `<option value="${s.id}" ${!state.customScaleIntervalsQ && s.id === state.scaleId ? 'selected' : ''}>${label}</option>`;
  }).join('');

  const rootOptions = NOTE_NAMES_24.map((name, q) => {
    const tag = q % 2 !== 0 ? ' (¼)' : '';
    return `<option value="${q}" ${q === state.rootQ ? 'selected' : ''}>${name}${tag}</option>`;
  }).join('');

  const tuningOptions = DB.tunings.map((tun) => {
    const label = state.lang === 'en' ? tun.nameEn : tun.namePt;
    return `<option value="${tun.id}" ${tun.id === state.tuningId ? 'selected' : ''}>${label}</option>`;
  }).join('');

  const retunerHtml = state.retunerOpen ? `
    <div class="retuner-box">
      <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;">
        <span class="control-label">${t(state.lang, 'retunerToggle')}</span>
        <button type="button" class="btn-mini" data-action="resetTuning">${t(state.lang, 'retunerReset')}</button>
      </div>
      <div class="retuner-grid">
        ${state.customStringsQ.map((sq, idx) => {
          const guitarStrNum = 6 - idx;
          const inScale = allowedPcs.has(mod24(sq));
          return `
            <div class="retuner-string ${inScale ? 'in-scale' : ''}">
              <div class="retuner-string-head">
                <strong>${t(state.lang, 'inspString')} ${guitarStrNum} · ${qToNoteName(sq, true)}</strong>
                ${inScale ? `<span style="color:var(--accent-open);font-size:0.72rem">● ${t(state.lang, 'openInScale')}</span>` : ''}
              </div>
              <div class="retuner-btns">
                <button type="button" class="btn-mini" data-action="retune" data-idx="${idx}" data-delta="-2">-1st</button>
                <button type="button" class="btn-mini" data-action="retune" data-idx="${idx}" data-delta="-1">-¼</button>
                <button type="button" class="btn-mini" data-action="retune" data-idx="${idx}" data-delta="1">+¼</button>
                <button type="button" class="btn-mini" data-action="retune" data-idx="${idx}" data-delta="2">+1st</button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  ` : '';

  panel.innerHTML = `
    <div class="category-bar">${categoryBtns}</div>

    <div class="deck-grid">
      <div class="control-group">
        <label class="control-label" for="selScale">${t(state.lang, 'scaleLabel')}</label>
        <select id="selScale">${scaleOptions}</select>
      </div>

      <div class="control-group">
        <label class="control-label" for="selRoot">${t(state.lang, 'rootLabel')}</label>
        <select id="selRoot">${rootOptions}</select>
      </div>

      <div class="control-group">
        <label class="control-label" for="selTuning">${t(state.lang, 'tuningLabel')}</label>
        <select id="selTuning">${tuningOptions}</select>
      </div>

      <div class="control-group">
        <span class="control-label">${t(state.lang, 'microModeLabel')}</span>
        <div class="pill-row">
          <button type="button" class="btn-pill ${state.microMode === 'bend' ? 'active' : ''}" data-action="microMode" data-val="bend">${t(state.lang, 'modeBend')}</button>
          <button type="button" class="btn-pill ${state.microMode === 'slide' ? 'active' : ''}" data-action="microMode" data-val="slide">${t(state.lang, 'modeSlide')}</button>
          <button type="button" class="btn-pill ${state.microMode === 'frets24' ? 'active' : ''}" data-action="microMode" data-val="frets24">${t(state.lang, 'modeFrets24')}</button>
        </div>
      </div>

      <div class="control-group">
        <span class="control-label">${t(state.lang, 'labelModeLabel')}</span>
        <div class="pill-row">
          <button type="button" class="btn-pill ${state.labelMode === 'note' ? 'active-teal' : ''}" data-action="labelMode" data-val="note">${t(state.lang, 'lblNote')}</button>
          <button type="button" class="btn-pill ${state.labelMode === 'degree' ? 'active-teal' : ''}" data-action="labelMode" data-val="degree">${t(state.lang, 'lblDegree')}</button>
          <button type="button" class="btn-pill ${state.labelMode === 'cents' ? 'active-teal' : ''}" data-action="labelMode" data-val="cents">${t(state.lang, 'lblCents')}</button>
        </div>
      </div>
    </div>

    <div class="audio-bar">
      <div class="audio-controls-left">
        <button type="button" class="btn-primary" data-action="playScale">
          ${state.isPlayingScale ? t(state.lang, 'stopScale') : t(state.lang, 'playScale')}
        </button>

        <label class="bpm-control">
          <span>BPM</span>
          <input type="range" id="rngBpm" min="48" max="180" step="2" value="${state.bpm}" />
          <strong id="bpmVal">${state.bpm}</strong>
        </label>

        <button type="button" class="btn-pill ${state.droneOn ? 'active-teal' : ''}" data-action="toggleDrone">
          ${state.droneOn ? t(state.lang, 'droneOn') : t(state.lang, 'droneOff')}
        </button>

        <button type="button" class="btn-pill ${state.droneFifth ? 'active' : ''}" data-action="toggleDroneFifth">
          ${t(state.lang, 'droneFifth')}
        </button>
      </div>

      <div class="audio-controls-right">
        <button type="button" class="btn-pill ${state.voicingOverlayOn ? 'active-voicing' : ''}" data-action="toggleVoicingOverlay">
          ${state.voicingOverlayOn ? t(state.lang, 'voicingOverlayOn') : t(state.lang, 'voicingOverlayOff')}
        </button>

        <button type="button" class="btn-pill ${state.harmonicsOn ? 'active-harm' : ''}" data-action="toggleHarmonics">
          ${state.harmonicsOn ? t(state.lang, 'harmonicsOn') : t(state.lang, 'harmonicsOff')}
        </button>

        <button type="button" class="btn-pill ${state.retunerOpen ? 'active' : ''}" data-action="toggleRetuner">
          ${t(state.lang, 'retunerToggle')}
        </button>
      </div>
    </div>

    ${retunerHtml}
  `;

  panel.querySelector('#selScale').onchange = (e) => {
    stopPlaybackIfNeeded();
    setState({ scaleId: e.target.value, customScaleIntervalsQ: null, inspectedNote: null });
  };

  panel.querySelector('#selRoot').onchange = (e) => {
    const nextRoot = Number(e.target.value);
    setState({ rootQ: nextRoot });
    if (state.droneOn) {
      synthEngine.updateDrone(true, nextRoot, state.droneFifth);
    }
  };

  panel.querySelector('#selTuning').onchange = (e) => {
    stopPlaybackIfNeeded();
    const tun = DB.tunings.find((item) => item.id === e.target.value) || DB.tunings[0];
    setState({ tuningId: tun.id, customStringsQ: [...tun.stringsQ], inspectedNote: null });
  };

  const bpmSlider = panel.querySelector('#rngBpm');
  const bpmVal = panel.querySelector('#bpmVal');
  bpmSlider.oninput = (e) => {
    bpmVal.textContent = e.target.value;
    setState({ bpm: Number(e.target.value) });
  };

  panel.onclick = (e) => {
    const btn = e.target.closest('button[data-action]');
    if (!btn) return;
    const action = btn.dataset.action;

    if (action === 'category') {
      const cat = btn.dataset.val;
      const list = cat === 'all' ? DB.scales : DB.scales.filter((s) => s.category === cat);
      const stillVisible = list.some((s) => s.id === state.scaleId);
      setState({
        category: cat,
        customScaleIntervalsQ: null,
        scaleId: stillVisible ? state.scaleId : (list[0]?.id || state.scaleId)
      });
    } else if (action === 'microMode') {
      setState({ microMode: btn.dataset.val });
    } else if (action === 'labelMode') {
      setState({ labelMode: btn.dataset.val });
    } else if (action === 'playScale') {
      toggleScalePlayback(state);
    } else if (action === 'toggleDrone') {
      const next = !state.droneOn;
      synthEngine.updateDrone(next, state.rootQ, state.droneFifth);
      setState({ droneOn: next });
    } else if (action === 'toggleDroneFifth') {
      const next = !state.droneFifth;
      if (state.droneOn) synthEngine.updateDrone(true, state.rootQ, next);
      setState({ droneFifth: next });
    } else if (action === 'toggleVoicingOverlay') {
      setState({ voicingOverlayOn: !state.voicingOverlayOn });
    } else if (action === 'toggleHarmonics') {
      setState({ harmonicsOn: !state.harmonicsOn });
    } else if (action === 'toggleRetuner') {
      setState({ retunerOpen: !state.retunerOpen });
    } else if (action === 'resetTuning') {
      const tun = getActiveTuning();
      setState({ customStringsQ: [...tun.stringsQ] });
    } else if (action === 'retune') {
      const idx = Number(btn.dataset.idx);
      const delta = Number(btn.dataset.delta);
      const updated = [...state.customStringsQ];
      updated[idx] = Math.max(48, Math.min(168, updated[idx] + delta));
      synthEngine.pluckQ(updated[idx], { duration: 1.2, velocity: 0.34 });
      setState({ customStringsQ: updated });
    }
  };

  const badge = document.getElementById('tuningSummaryBadge');
  if (badge) {
    badge.textContent = state.customStringsQ.map((q) => qToNoteName(q, false)).join(' ');
  }
}

export function stopPlaybackIfNeeded() {
  synthEngine.stopScaleSequence();
  synthEngine.stopEtudeSequencer();
  setState({ isPlayingScale: false, playingPcQ: null, etudePlaying: false, etudeActiveIdx: -1 });
}

export function toggleScalePlayback(state) {
  if (state.isPlayingScale) {
    stopPlaybackIfNeeded();
    return;
  }

  const scale = getActiveScale();
  setState({ isPlayingScale: true });
  synthEngine.playScaleSequence({
    rootQ: state.rootQ,
    intervalsQ: scale.intervalsQ,
    bpm: state.bpm,
    onStep: (pcQ) => setState({ playingPcQ: pcQ }),
    onComplete: () => setState({ isPlayingScale: false, playingPcQ: null })
  });
}
