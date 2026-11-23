/**
 * Modular Studio Command Deck v7.4 (Oud Visualizer Compartment Architecture)
 * - Ultra-clean Primary Bar: Scale, 24-TET Root, 6/7/8-String Tuning, Quick Play & Drone
 * - Compact Compartment Dock:
 *     1. Atlas & Filtros   (Categories, Live Search, 12-TET/24-TET Filter, Visual Scale Atlas)
 *     2. Braço & Afinação  (Quick Tunings, Microtonal Mode, Label Mode, Voicing/Harmonics, Fine Retuner)
 *     3. Áudio & FX        (Scale BPM, Drone +5th, Tone Presets, Delay, Tremolo, Volume)
 *     4. Partitura & Tab   (Independent toggle for Synchronized 24-TET Staff & Tablature)
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
  const count = state.stringCount || state.customStringsQ.length;
  return DB.tuningGroups.map((grp) => {
    const label = isEn ? grp.labelEn : grp.labelPt;
    const list = DB.tunings.filter((tun) => tun.group === grp.id && tun.stringsQ.length === count);
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
 * Updates scale <select>, match counter, and Atlas grid in place without dropping search input focus.
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
  const activeStrCount = state.stringCount || state.customStringsQ.length;
  const openComp = state.deckCompartment; // null | 'atlas' | 'neck' | 'audio'

  const scaleOptions = buildScaleSelectOptionsHtml(filteredScales, state);
  const rootOptions = NOTE_NAMES_24.map((name, q) => {
    const tag = q % 2 !== 0 ? ' (¼)' : '';
    return `<option value="${q}" ${q === state.rootQ ? 'selected' : ''}>${name}${tag}</option>`;
  }).join('');
  const tuningOptions = buildTuningOptionsHtml(state);
  const pinnedTunings = DB.tunings.filter((tun) => tun.pinned && tun.stringsQ.length === activeStrCount);

  // Build active compartment drawer body (strictly 1 open at a time for a calm, uncluttered screen)
  let compartmentDrawerHtml = '';

  if (openComp === 'atlas') {
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

    compartmentDrawerHtml = `
      <div class="deck-compartment-body" id="compAtlas">
        <div class="compartment-head">
          <span class="control-label">${t(state.lang, 'compAtlasTitle')}</span>
          <button type="button" class="btn-mini" data-action="closeCompartment">${t(state.lang, 'compClose')}</button>
        </div>

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
          </div>
        </div>

        <div class="atlas-drawer-body" id="scaleAtlasBody">
          ${buildScaleAtlasBodyHtml(filteredScales, state)}
        </div>
      </div>
    `;
  } else if (openComp === 'neck') {
    compartmentDrawerHtml = `
      <div class="deck-compartment-body" id="compNeck">
        <div class="compartment-head">
          <span class="control-label">${t(state.lang, 'compNeckTitle')}</span>
          <button type="button" class="btn-mini" data-action="closeCompartment">${t(state.lang, 'compClose')}</button>
        </div>

        <div class="comp-grid">
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

          <div class="control-group">
            <span class="control-label">${t(state.lang, 'compLayersLabel')}</span>
            <div class="pill-row">
              <button type="button" class="btn-pill ${state.voicingOverlayOn ? 'active-voicing' : ''}" data-action="toggleVoicingOverlay">
                ${state.voicingOverlayOn ? t(state.lang, 'voicingOverlayOn') : t(state.lang, 'voicingOverlayOff')}
              </button>
              <button type="button" class="btn-pill ${state.harmonicsOn ? 'active-harm' : ''}" data-action="toggleHarmonics">
                ${state.harmonicsOn ? t(state.lang, 'harmonicsOn') : t(state.lang, 'harmonicsOff')}
              </button>
            </div>
          </div>
        </div>

        <div class="comp-subsection">
          <div class="compartment-head" style="margin-bottom:6px">
            <span class="control-label">${t(state.lang, 'quickTuningsLabel')} (${activeStrCount}${t(state.lang, 'strSuffix')})</span>
            <div class="pill-row">
              ${[6, 7, 8].map((cnt) => `
                <button type="button" class="btn-mini ${activeStrCount === cnt ? 'active-mini' : ''}" data-action="setStringCount" data-val="${cnt}">${cnt}${t(state.lang, 'strSuffix')}</button>
              `).join('')}
            </div>
          </div>
          <div class="pill-row">
            ${pinnedTunings.map((tun) => `
              <button type="button" class="btn-mini ${tun.id === state.tuningId ? 'active-mini' : ''}" data-action="quickTuning" data-id="${tun.id}">
                ${tun.short}
              </button>
            `).join('')}
          </div>
        </div>

        <div class="retuner-box" style="margin-top:10px">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;">
            <span class="control-label">${t(state.lang, 'retunerToggle')} (${activeStrCount})</span>
            <button type="button" class="btn-mini" data-action="resetTuning">${t(state.lang, 'retunerReset')}</button>
          </div>
          <div class="retuner-grid">
            ${state.customStringsQ.map((sq, idx) => {
              const guitarStrNum = state.customStringsQ.length - idx;
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
      </div>
    `;
  } else if (openComp === 'audio') {
    compartmentDrawerHtml = `
      <div class="deck-compartment-body" id="compAudio">
        <div class="compartment-head">
          <span class="control-label">${t(state.lang, 'compAudioTitle')}</span>
          <button type="button" class="btn-mini" data-action="closeCompartment">${t(state.lang, 'compClose')}</button>
        </div>

        <div class="comp-audio-top">
          <label class="bpm-control">
            <span>${t(state.lang, 'compScaleBpm')}</span>
            <input type="range" id="rngBpm" min="48" max="180" step="2" value="${state.bpm}" />
            <strong id="bpmVal">${state.bpm}</strong>
          </label>

          <button type="button" class="btn-pill ${state.droneOn ? 'active-teal' : ''}" data-action="toggleDrone">
            ${state.droneOn ? t(state.lang, 'droneOn') : t(state.lang, 'droneOff')}
          </button>

          <button type="button" class="btn-pill ${state.droneFifth ? 'active' : ''}" data-action="toggleDroneFifth">
            ${t(state.lang, 'droneFifth')}
          </button>

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

        <div class="fx-sliders-grid" style="margin-top:10px">
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
    `;
  }

  const microBadgeTxt = state.microMode === 'bend' ? 'Bend' : (state.microMode === 'slide' ? 'Slide' : '24-TET');
  const filterActiveDot = (state.category !== 'all' || state.temperamentFilter !== 'all' || Boolean(state.scaleSearch)) ? '<span class="dock-dot"></span>' : '';

  panel.innerHTML = `
    <!-- Clean Primary Command Bar (always visible, 1 row) -->
    <div class="command-primary-row">
      <div class="cmd-field cmd-scale">
        <label class="control-label" for="selScale">${t(state.lang, 'scaleLabel')}</label>
        <select id="selScale">${scaleOptions}</select>
      </div>

      <div class="cmd-field cmd-root">
        <label class="control-label" for="selRoot">${t(state.lang, 'rootLabel')}</label>
        <select id="selRoot">${rootOptions}</select>
      </div>

      <div class="cmd-field cmd-tuning">
        <div class="tuning-label-row">
          <label class="control-label" for="selTuning">${t(state.lang, 'tuningLabel')}</label>
          <div class="pill-row">
            ${[6, 7, 8].map((cnt) => `
              <button type="button" class="btn-mini ${activeStrCount === cnt ? 'active-mini' : ''}" data-action="setStringCount" data-val="${cnt}">${cnt}${t(state.lang, 'strSuffix')}</button>
            `).join('')}
          </div>
        </div>
        <select id="selTuning">${tuningOptions}</select>
      </div>

      <div class="cmd-quick-audio">
        <button type="button" class="btn-primary" data-action="playScale">
          ${state.isPlayingScale ? t(state.lang, 'stopScale') : t(state.lang, 'playScale')}
        </button>
        <button type="button" class="btn-pill ${state.droneOn ? 'active-teal' : ''}" data-action="toggleDrone">
          ${state.droneOn ? t(state.lang, 'droneOn') : t(state.lang, 'droneOff')}
        </button>
      </div>
    </div>

    <!-- Clean Deck Compartment Dock -->
    <div class="compartment-dock" role="toolbar" aria-label="Deck Compartments">
      <button type="button" class="dock-btn ${openComp === 'atlas' ? 'is-open' : ''}" data-action="toggleCompartment" data-val="atlas">
        <span>🧭 ${t(state.lang, 'dockAtlas')}</span>
        <span class="dock-meta">${filteredScales.length}</span>
        ${filterActiveDot}
      </button>

      <button type="button" class="dock-btn ${openComp === 'neck' ? 'is-open' : ''}" data-action="toggleCompartment" data-val="neck">
        <span>🎛 ${t(state.lang, 'dockNeck')}</span>
        <span class="dock-meta">${microBadgeTxt}${state.voicingOverlayOn ? ' · V' : ''}${state.harmonicsOn ? ' · H' : ''}</span>
      </button>

      <button type="button" class="dock-btn ${openComp === 'audio' ? 'is-open' : ''}" data-action="toggleCompartment" data-val="audio">
        <span>🔊 ${t(state.lang, 'dockAudio')}</span>
        <span class="dock-meta">${t(state.lang, `fx_${state.tonePreset}`)}</span>
      </button>

      <button type="button" class="dock-btn ${state.notationOpen ? 'is-pinned' : ''}" data-action="toggleNotation">
        <span>🎼 ${t(state.lang, 'dockNotation')}</span>
        <span class="dock-meta">${state.notationOpen ? 'On' : (state.phraseEvents.length ? `${state.phraseEvents.length}` : 'Off')}</span>
      </button>
    </div>

    ${compartmentDrawerHtml}
  `;

  // Bind primary selectors
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

  // Optional compartment-specific inputs
  const searchInp = panel.querySelector('#inpScaleSearch');
  if (searchInp) {
    searchInp.oninput = (e) => {
      setState({ scaleSearch: e.target.value });
    };
  }

  const bpmSlider = panel.querySelector('#rngBpm');
  const bpmVal = panel.querySelector('#bpmVal');
  if (bpmSlider) {
    bpmSlider.oninput = (e) => {
      if (bpmVal) bpmVal.textContent = e.target.value;
      setState({ bpm: Number(e.target.value) });
    };
  }

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

  // Delegated click actions
  panel.onclick = (e) => {
    const btn = e.target.closest('button[data-action]');
    if (!btn) return;
    const action = btn.dataset.action;
    const st = getState();

    if (action === 'toggleCompartment') {
      const target = btn.dataset.val;
      setState({ deckCompartment: st.deckCompartment === target ? null : target });
    } else if (action === 'closeCompartment') {
      setState({ deckCompartment: null });
    } else if (action === 'toggleNotation') {
      setState({ notationOpen: !st.notationOpen });
    } else if (action === 'category') {
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
    } else if (action === 'pickScale') {
      stopPlaybackIfNeeded();
      setState({
        scaleId: btn.dataset.id,
        customScaleIntervalsQ: null,
        inspectedNote: null
      });
    } else if (action === 'clearFilters') {
      setState({ category: 'all', temperamentFilter: 'all', scaleSearch: '' });
    } else if (action === 'setStringCount') {
      const nextCnt = Number(btn.dataset.val);
      const firstMatch = DB.tunings.find((tun) => tun.stringsQ.length === nextCnt);
      if (firstMatch) {
        stopPlaybackIfNeeded();
        setState({
          stringCount: nextCnt,
          tuningId: firstMatch.id,
          customStringsQ: [...firstMatch.stringsQ],
          inspectedNote: null
        });
      }
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
    } else if (action === 'tonePreset') {
      const preset = btn.dataset.val;
      const delayMix = preset === 'swell' ? Math.max(st.delayMix, 0.42) : st.delayMix;
      synthEngine.updateToneFx({ tonePreset: preset, delayMix });
      synthEngine.pluckQ(96 + mod24(st.rootQ), { duration: 1.4, velocity: 0.35 });
      setState({ tonePreset: preset, delayMix });
    } else if (action === 'resetTuning') {
      const tun = getActiveTuning();
      setState({ customStringsQ: [...tun.stringsQ] });
    } else if (action === 'retune') {
      const idx = Number(btn.dataset.idx);
      const delta = Number(btn.dataset.delta);
      const updated = [...st.customStringsQ];
      updated[idx] = Math.max(46, Math.min(168, updated[idx] + delta));
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
  setState({ stringCount: tun.stringsQ.length, tuningId: tun.id, customStringsQ: [...tun.stringsQ], inspectedNote: null });
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
