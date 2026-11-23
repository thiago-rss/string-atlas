/**
 * Top Control Deck v3.1
 * - Organized Category Bar with live counts
 * - Live Scale Search + 12-TET / 24-TET Temperament Filter + Visual Scale Atlas Drawer
 * - Grouped <optgroup> Selectors for Scales (by Subfamily) & Tunings (by Group)
 * - 1-Click Pinned Tuning Bar (incl. E Std, B Std, A Std, Drop B, Drop A, All 4ths, DADGAD)
 */
import { DB } from '../core/database.js';
import {
  NOTE_NAMES_24,
  formatStepFormula,
  mod24,
  qToNoteName
} from '../core/theory24.js';
import { t } from '../core/i18n.js';
import {
  getActiveScale,
  getActiveTuning,
  getFilteredScales,
  getState,
  scaleIsMicrotonal,
  setState
} from '../state/store.js';
import { synthEngine } from '../audio/synthEngine.js';

function groupScalesBySubfamily(scales, lang) {
  const isEn = lang === 'en';
  const groups = new Map();
  scales.forEach((s) => {
    const key = isEn ? (s.subfamilyEn || s.category) : (s.subfamilyPt || s.category);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(s);
  });
  return groups;
}

function buildScaleSelectOptionsHtml(filteredScales, state) {
  if (!filteredScales.length) {
    return `<option value="" disabled selected>${t(state.lang, 'noScaleMatches')}</option>`;
  }

  const isEn = state.lang === 'en';
  const grouped = groupScalesBySubfamily(filteredScales, state.lang);
  const parts = [];

  grouped.forEach((list, groupLabel) => {
    parts.push(`<optgroup label="${groupLabel}">`);
    list.forEach((s) => {
      const name = isEn ? s.nameEn : s.namePt;
      const microTag = scaleIsMicrotonal(s) ? ' [24-TET]' : '';
      const selected = !state.customScaleIntervalsQ && s.id === state.scaleId ? 'selected' : '';
      parts.push(`<option value="${s.id}" ${selected}>${name}${microTag}</option>`);
    });
    parts.push('</optgroup>');
  });

  return parts.join('');
}

function buildScaleAtlasBodyHtml(filteredScales, state) {
  if (!filteredScales.length) {
    return `
      <div class="atlas-empty">
        <p class="empty-hint">${t(state.lang, 'noScaleMatches')}</p>
        <button type="button" class="btn-mini" data-action="clearFilters">${t(state.lang, 'clearFilters')}</button>
      </div>
    `;
  }

  const isEn = state.lang === 'en';
  const grouped = groupScalesBySubfamily(filteredScales, state.lang);
  const sections = [];

  grouped.forEach((list, groupLabel) => {
    const cards = list.map((s) => {
      const isSelected = !state.customScaleIntervalsQ && s.id === state.scaleId;
      const isMicro = scaleIsMicrotonal(s);
      const name = isEn ? s.nameEn : s.namePt;
      const formula = formatStepFormula(s.intervalsQ);
      return `
        <button type="button" class="atlas-card ${isSelected ? 'is-selected' : ''} ${isMicro ? 'is-micro' : ''}" data-action="pickScale" data-id="${s.id}">
          <div class="atlas-card-head">
            <strong>${name}</strong>
            <span class="atlas-badge ${isMicro ? 'micro' : 'tet12'}">${isMicro ? '24-TET' : '12-TET'}</span>
          </div>
          <div class="atlas-card-meta">
            <span>${s.intervalsQ.length} ${t(state.lang, 'notesUnit')}</span>
            <span class="mono-tag">${formula}</span>
          </div>
        </button>
      `;
    }).join('');

    sections.push(`
      <div class="atlas-group">
        <h4 class="atlas-group-title">${groupLabel} <span class="mono-tag">(${list.length})</span></h4>
        <div class="atlas-cards-grid">${cards}</div>
      </div>
    `);
  });

  return sections.join('');
}

function buildTuningOptionsHtml(state) {
  const isEn = state.lang === 'en';
  return DB.tuningGroups.map((grp) => {
    const label = isEn ? grp.labelEn : grp.labelPt;
    const list = DB.tunings.filter((tun) => tun.group === grp.id);
    if (!list.length) return '';
    const opts = list.map((tun) => `
      <option value="${tun.id}" ${tun.id === state.tuningId ? 'selected' : ''}>
        ${isEn ? tun.nameEn : tun.namePt}
      </option>
    `).join('');
    return `<optgroup label="${label}">${opts}</optgroup>`;
  }).join('');
}

/**
 * Updates only the scale <select> options, result counter, and open Atlas body in place
 * so typing in #inpScaleSearch never destroys the input or drops keyboard focus.
 */
export function refreshScaleBrowserInPlace(state) {
  const filteredScales = getFilteredScales(state);

  const sel = document.getElementById('selScale');
  if (sel) {
    sel.innerHTML = buildScaleSelectOptionsHtml(filteredScales, state);
  }

  const countBadge = document.getElementById('scaleMatchCount');
  if (countBadge) {
    countBadge.textContent = `${filteredScales.length} ${t(state.lang, 'scalesUnit')}`;
  }

  const atlasBody = document.getElementById('scaleAtlasBody');
  if (atlasBody) {
    atlasBody.innerHTML = buildScaleAtlasBodyHtml(filteredScales, state);
  }
}

export function renderDeckPanel(state) {
  const panel = document.getElementById('deckPanel');
  if (!panel) return;

  const isEn = state.lang === 'en';
  const filteredScales = getFilteredScales(state);
  const activeScale = getActiveScale();
  const allowedPcs = new Set(activeScale.intervalsQ.map((iv) => mod24(state.rootQ + iv)));

  // Category bar with live counts (respecting temperament filter)
  const categoryBtns = DB.categories.map((cat) => {
    const label = isEn ? cat.labelEn : cat.labelPt;
    const count = DB.scales.filter((s) => {
      if (cat.id !== 'all' && s.category !== cat.id) return false;
      const isMicro = scaleIsMicrotonal(s);
      if (state.temperamentFilter === '24tet' && !isMicro) return false;
      if (state.temperamentFilter === '12tet' && isMicro) return false;
      return true;
    }).length;
    return `
      <button type="button" class="btn-pill ${state.category === cat.id ? 'active' : ''}" data-action="category" data-val="${cat.id}">
        ${label} <span class="cat-count">${count}</span>
      </button>
    `;
  }).join('');

  const scaleOptions = buildScaleSelectOptionsHtml(filteredScales, state);

  const rootOptions = NOTE_NAMES_24.map((name, q) => {
    const tag = q % 2 !== 0 ? ' (¼)' : '';
    return `<option value="${q}" ${q === state.rootQ ? 'selected' : ''}>${name}${tag}</option>`;
  }).join('');

  const tuningOptions = buildTuningOptionsHtml(state);
  const pinnedTunings = DB.tunings.filter((tun) => tun.pinned);

  const atlasDrawerHtml = state.atlasOpen ? `
    <div class="atlas-drawer" id="scaleAtlasDrawer">
      <div class="atlas-drawer-head">
        <span class="control-label">${t(state.lang, 'atlasTitle')}</span>
        <button type="button" class="btn-mini" data-action="toggleAtlas">${t(state.lang, 'atlasClose')}</button>
      </div>
      <div class="atlas-drawer-body" id="scaleAtlasBody">
        ${buildScaleAtlasBodyHtml(filteredScales, state)}
      </div>
    </div>
  ` : '';

  const fxRackHtml = state.fxOpen ? `
    <div class="fx-rack-box">
      <div class="rhythm-track-head" style="margin-bottom:8px;flex-wrap:wrap;gap:8px">
        <span class="control-label">${t(state.lang, 'fxRackTitle')}</span>
        <div class="pill-row">
          ${[
            { id: 'clean', key: 'fxClean' },
            { id: 'swell', key: 'fxSwell' },
            { id: 'crunch', key: 'fxCrunch' },
            { id: 'fuzz', key: 'fxFuzz' }
          ].map((tp) => `
            <button type="button" class="btn-mini ${state.tonePreset === tp.id ? 'active-mini' : ''}" data-action="tonePreset" data-val="${tp.id}">
              ${t(state.lang, tp.key)}
            </button>
          `).join('')}
        </div>
      </div>

      <div class="fx-sliders-grid">
        <label class="bpm-control">
          <span>${t(state.lang, 'fxDelayMix')}</span>
          <input type="range" id="rngFxDelayMix" min="0" max="0.65" step="0.05" value="${state.delayMix}" />
          <strong id="valFxDelayMix">${Math.round(state.delayMix * 100)}%</strong>
        </label>

        <label class="bpm-control">
          <span>${t(state.lang, 'fxDelayTime')}</span>
          <input type="range" id="rngFxDelayTime" min="0.12" max="0.68" step="0.02" value="${state.delayTime}" />
          <strong id="valFxDelayTime">${Math.round(state.delayTime * 1000)}ms</strong>
        </label>

        <label class="bpm-control">
          <span>${t(state.lang, 'fxTremDepth')}</span>
          <input type="range" id="rngFxTremDepth" min="0" max="0.85" step="0.05" value="${state.tremoloDepth}" />
          <strong id="valFxTremDepth">${Math.round(state.tremoloDepth * 100)}%</strong>
        </label>

        <label class="bpm-control">
          <span>${t(state.lang, 'fxTremRate')}</span>
          <input type="range" id="rngFxTremRate" min="1.5" max="9.0" step="0.3" value="${state.tremoloRate}" />
          <strong id="valFxTremRate">${state.tremoloRate.toFixed(1)}Hz</strong>
        </label>

        <label class="bpm-control">
          <span>${t(state.lang, 'fxMasterVol')}</span>
          <input type="range" id="rngFxVol" min="0.15" max="1.0" step="0.05" value="${state.masterVolume}" />
          <strong id="valFxVol">${Math.round(state.masterVolume * 100)}%</strong>
        </label>
      </div>
    </div>
  ` : '';

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

    <div class="filter-toolbar">
      <div class="search-wrap">
        <input
          type="search"
          id="inpScaleSearch"
          class="search-input"
          placeholder="${t(state.lang, 'searchPlaceholder')}"
          value="${(state.scaleSearch || '').replace(/"/g, '&quot;')}"
          autocomplete="off"
        />
        <span class="mono-tag search-count" id="scaleMatchCount">${filteredScales.length} ${t(state.lang, 'scalesUnit')}</span>
      </div>

      <div class="pill-row">
        <button type="button" class="btn-mini ${state.temperamentFilter === 'all' ? 'active-mini' : ''}" data-action="tempFilter" data-val="all">${t(state.lang, 'tempAll')}</button>
        <button type="button" class="btn-mini ${state.temperamentFilter === '12tet' ? 'active-mini' : ''}" data-action="tempFilter" data-val="12tet">${t(state.lang, 'temp12')}</button>
        <button type="button" class="btn-mini ${state.temperamentFilter === '24tet' ? 'active-mini' : ''}" data-action="tempFilter" data-val="24tet">${t(state.lang, 'temp24')}</button>
        <button type="button" class="btn-pill ${state.atlasOpen ? 'active-teal' : ''}" data-action="toggleAtlas">
          ${state.atlasOpen ? t(state.lang, 'atlasClose') : t(state.lang, 'atlasOpen')}
        </button>
      </div>
    </div>

    ${atlasDrawerHtml}

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
        <div class="quick-tunings-row" aria-label="${t(state.lang, 'quickTuningsLabel')}">
          ${pinnedTunings.map((tun) => `
            <button type="button" class="btn-mini ${tun.id === state.tuningId ? 'active-mini' : ''}" data-action="quickTuning" data-id="${tun.id}">
              ${tun.short}
            </button>
          `).join('')}
        </div>
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

        <button type="button" class="btn-pill ${state.fxOpen ? 'active-teal' : ''}" data-action="toggleFx">
          ${t(state.lang, 'fxToggleBtn')} (${t(state.lang, `fx_${state.tonePreset}`)})
        </button>

        <button type="button" class="btn-pill ${state.retunerOpen ? 'active' : ''}" data-action="toggleRetuner">
          ${t(state.lang, 'retunerToggle')}
        </button>
      </div>
    </div>

    ${fxRackHtml}
    ${retunerHtml}
  `;

  // Bind live search input cleanly (triggers fast-path in main.js without losing focus)
  const searchInp = panel.querySelector('#inpScaleSearch');
  searchInp.oninput = (e) => {
    setState({ scaleSearch: e.target.value });
  };

  panel.querySelector('#selScale').onchange = (e) => {
    if (!e.target.value) return;
    stopPlaybackIfNeeded();
    setState({ scaleId: e.target.value, customScaleIntervalsQ: null, inspectedNote: null });
  };

  panel.querySelector('#selRoot').onchange = (e) => {
    const nextRoot = Number(e.target.value);
    setState({ rootQ: nextRoot });
    if (getState().droneOn) {
      synthEngine.updateDrone(true, nextRoot, getState().droneFifth);
    }
  };

  panel.querySelector('#selTuning').onchange = (e) => {
    applyTuningById(e.target.value);
  };

  const bpmSlider = panel.querySelector('#rngBpm');
  const bpmVal = panel.querySelector('#bpmVal');
  bpmSlider.oninput = (e) => {
    bpmVal.textContent = e.target.value;
    setState({ bpm: Number(e.target.value) });
  };

  const bindFxRange = (id, valId, key, fmt) => {
    const el = panel.querySelector(id);
    const out = panel.querySelector(valId);
    if (!el) return;
    el.oninput = (ev) => {
      const v = Number(ev.target.value);
      if (out) out.textContent = fmt(v);
      synthEngine.updateToneFx({ [key]: v });
      setState({ [key]: v });
    };
  };
  bindFxRange('#rngFxDelayMix', '#valFxDelayMix', 'delayMix', (v) => `${Math.round(v * 100)}%`);
  bindFxRange('#rngFxDelayTime', '#valFxDelayTime', 'delayTime', (v) => `${Math.round(v * 1000)}ms`);
  bindFxRange('#rngFxTremDepth', '#valFxTremDepth', 'tremoloDepth', (v) => `${Math.round(v * 100)}%`);
  bindFxRange('#rngFxTremRate', '#valFxTremRate', 'tremoloRate', (v) => `${v.toFixed(1)}Hz`);
  bindFxRange('#rngFxVol', '#valFxVol', 'masterVolume', (v) => `${Math.round(v * 100)}%`);

  panel.onclick = (e) => {
    const btn = e.target.closest('button[data-action]');
    if (!btn) return;
    const action = btn.dataset.action;
    const st = getState();

    if (action === 'category') {
      const cat = btn.dataset.val;
      const nextFiltered = getFilteredScales({ ...st, category: cat });
      const stillVisible = nextFiltered.some((s) => s.id === st.scaleId);
      setState({
        category: cat,
        customScaleIntervalsQ: null,
        scaleId: stillVisible ? st.scaleId : (nextFiltered[0]?.id || st.scaleId)
      });
    } else if (action === 'tempFilter') {
      const tf = btn.dataset.val;
      const nextFiltered = getFilteredScales({ ...st, temperamentFilter: tf });
      const stillVisible = nextFiltered.some((s) => s.id === st.scaleId);
      setState({
        temperamentFilter: tf,
        customScaleIntervalsQ: null,
        scaleId: stillVisible ? st.scaleId : (nextFiltered[0]?.id || st.scaleId)
      });
    } else if (action === 'toggleAtlas') {
      setState({ atlasOpen: !st.atlasOpen });
    } else if (action === 'pickScale') {
      stopPlaybackIfNeeded();
      setState({
        scaleId: btn.dataset.id,
        customScaleIntervalsQ: null,
        inspectedNote: null
      });
    } else if (action === 'clearFilters') {
      setState({ category: 'all', temperamentFilter: 'all', scaleSearch: '' });
    } else if (action === 'quickTuning') {
      applyTuningById(btn.dataset.id);
    } else if (action === 'microMode') {
      setState({ microMode: btn.dataset.val });
    } else if (action === 'labelMode') {
      setState({ labelMode: btn.dataset.val });
    } else if (action === 'playScale') {
      toggleScalePlayback(st);
    } else if (action === 'toggleDrone') {
      const next = !st.droneOn;
      synthEngine.updateDrone(next, st.rootQ, st.droneFifth);
      setState({ droneOn: next });
    } else if (action === 'toggleDroneFifth') {
      const next = !st.droneFifth;
      if (st.droneOn) synthEngine.updateDrone(true, st.rootQ, next);
      setState({ droneFifth: next });
    } else if (action === 'toggleVoicingOverlay') {
      setState({ voicingOverlayOn: !st.voicingOverlayOn });
    } else if (action === 'toggleHarmonics') {
      setState({ harmonicsOn: !st.harmonicsOn });
    } else if (action === 'toggleFx') {
      setState({ fxOpen: !st.fxOpen });
    } else if (action === 'tonePreset') {
      const preset = btn.dataset.val;
      const delayMix = preset === 'swell' ? Math.max(st.delayMix, 0.42) : st.delayMix;
      synthEngine.updateToneFx({ tonePreset: preset, delayMix });
      // Audition root chord tone so user immediately hears the new amp/FX character
      synthEngine.pluckQ(96 + mod24(st.rootQ), { duration: 1.4, velocity: 0.35 });
      setState({ tonePreset: preset, delayMix });
    } else if (action === 'toggleRetuner') {
      setState({ retunerOpen: !st.retunerOpen });
    } else if (action === 'resetTuning') {
      const tun = getActiveTuning();
      setState({ customStringsQ: [...tun.stringsQ] });
    } else if (action === 'retune') {
      const idx = Number(btn.dataset.idx);
      const delta = Number(btn.dataset.delta);
      const updated = [...st.customStringsQ];
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

function applyTuningById(tuningId) {
  stopPlaybackIfNeeded();
  const tun = DB.tunings.find((item) => item.id === tuningId) || DB.tunings[0];
  setState({ tuningId: tun.id, customStringsQ: [...tun.stringsQ], inspectedNote: null });
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
