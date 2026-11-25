/**
 * Pure Compartment Studio Deck v8.1 (Oud Visualizer Minimalist Architecture)
 * - ZERO permanent Control Matrix! Opens as a single sleek compartment rail above the fretboard.
 * - Clicking any compartment unfolds ONLY that focused studio drawer:
 *     1. Escala & Afinação  (Scale, 24-TET Root, 6/7/8c Tuning, Quick Tunings, Search, Filters & Visual Atlas)
 *     2. Braço & Vista      (Vertical/Horizontal, Zoom 0-12/0-22, Left-Handed, Closed Window, Micro Mode, Layers, Export PNG/SVG & Fine Retuner)
 *     3. Áudio & FX         (Play Scale, BPM, Drone +5th, 4 Tone Presets, Delay, Tremolo & Master Volume)
 *     4. Partitura & Tab    (Independent toggle for Synchronized 24-TET Staff & Tablature)
 */
import { DB } from '../core/database.js';
import { createCustomTuning, formatStringsSignature, stringsEqual } from '../core/customTunings.js';
import { resolveFretDisplayPatch } from '../core/fretClarity.js';
import { getThemeById } from '../core/themes.js';
import { exportFretboardPlatePng, exportFretboardPlateSvg } from '../core/plateExporter.js';
import { buildScalaPlayFrequencies, getScalaPresetById, parseSclText } from '../core/scalaEngine.js';
import {
  A4_PRESETS,
  NOTE_NAMES_24,
  formatStepFormula,
  intervalQToLabel,
  mod24,
  qToFreq,
  qToNoteName
} from '../core/theory24.js';
import { t } from '../core/i18n.js';
import {
  getActiveScale,
  findTuningById,
  getActiveTuning,
  getAllTunings,
  getEffectiveFretZoom,
  getEffectiveOrientation,
  getFilteredScales,
  getState,
  scaleIsMicrotonal,
  setState
} from '../state/store.js';
import { synthEngine } from '../audio/synthEngine.js';
import { computeTuningInputCalibration, pitchDetector } from '../audio/pitchDetector.js';
import { refreshAudioDevices, startLineMode, stopLineMode } from './lineModeView.js';
import { showToast } from './toastView.js';

function groupScalesBySubfamily(scales, lang) {
  const isEn = lang === 'en';
  const groups = new Map();
  scales.forEach((s) => {
    const key = isEn ? (s.subfamilyEn || s.category) : (s.subfamilyPt || s.category);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(s);
  });
  // Sort groups by earliest scale study order in `scales` so Western/foundational groups appear first
  const ordered = new Map();
  scales.forEach((s) => {
    const key = isEn ? (s.subfamilyEn || s.category) : (s.subfamilyPt || s.category);
    if (!ordered.has(key) && groups.has(key)) {
      ordered.set(key, groups.get(key));
    }
  });
  return ordered;
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
  const customForCount = (state.customTunings || []).filter((tun) => tun.stringsQ.length === count);

  const customGroupHtml = customForCount.length
    ? `<optgroup label="✦ ${t(state.lang, 'customTuningsGroup')}">${customForCount.map((tun) => `
        <option value="${tun.id}" ${tun.id === state.tuningId ? 'selected' : ''}>
          ✦ ${tun.namePt}
        </option>
      `).join('')}</optgroup>`
    : '';

  const builtInGroupsHtml = DB.tuningGroups.map((grp) => {
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

  return customGroupHtml + builtInGroupsHtml;
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
  const shell = document.getElementById('deckShell');
  const panel = document.getElementById('deckPanel');
  if (!panel) return;

  if (!state.deckCompartment) {
    if (shell) shell.hidden = true;
    panel.innerHTML = '';
    return;
  }
  if (shell) shell.hidden = false;

  const isEn = state.lang === 'en';
  const filteredScales = getFilteredScales(state);
  const activeScale = getActiveScale();
  const activeTuning = getActiveTuning();
  const allowedPcs = new Set(activeScale.intervalsQ.map((iv) => mod24(state.rootQ + iv)));
  const activeStrCount = state.stringCount || state.customStringsQ.length;
  const openComp = state.deckCompartment; // null | 'setup' | 'neck' | 'input' | 'audio'
  const rootName = qToNoteName(state.rootQ, false);
  const isRetuned = !stringsEqual(state.customStringsQ, activeTuning.stringsQ);

  panel.classList.toggle('is-expanded', Boolean(openComp));

  // Build focused compartment drawer body ONLY when requested
  let compartmentDrawerHtml = '';

  if (openComp === 'setup') {
    const scaleOptions = buildScaleSelectOptionsHtml(filteredScales, state);
    const rootOptions = NOTE_NAMES_24.map((name, q) => {
      const tag = q % 2 !== 0 ? ' (¼)' : '';
      return `<option value="${q}" ${q === state.rootQ ? 'selected' : ''}>${name}${tag}</option>`;
    }).join('');
    const tuningOptions = buildTuningOptionsHtml(state);
    const pinnedTunings = [...(state.customTunings || []).filter((tun) => tun.stringsQ.length === activeStrCount), ...DB.tunings.filter((tun) => tun.pinned && tun.stringsQ.length === activeStrCount)];

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
      <div class="deck-compartment-body" id="compSetup">
        <div class="compartment-head">
          <span class="control-label">${t(state.lang, 'compSetupTitle')}</span>
          <button type="button" class="btn-mini" data-action="closeCompartment">${t(state.lang, 'compClose')}</button>
        </div>

        <div class="command-primary-row setup-inside-row">
          <div class="cmd-field">
            <label class="control-label" for="selScale">${t(state.lang, 'scaleLabel')}</label>
            <select id="selScale">${scaleOptions}</select>
          </div>

          <div class="cmd-field">
            <label class="control-label" for="selRoot">${t(state.lang, 'rootLabel')}</label>
            <select id="selRoot">${rootOptions}</select>
          </div>

          <div class="cmd-field">
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
        </div>

        <div class="comp-subsection">
          <span class="control-label" style="display:block;margin-bottom:6px">${t(state.lang, 'quickTuningsLabel')} (${activeStrCount}${t(state.lang, 'strSuffix')})</span>
          <div class="pill-row">
            ${pinnedTunings.map((tun) => `
              <button type="button" class="btn-mini ${tun.id === state.tuningId ? 'active-mini' : ''}" data-action="quickTuning" data-id="${tun.id}">
                ${tun.custom ? '✦ ' : ''}${tun.short}
              </button>
            `).join('')}
          </div>
        </div>

        <div class="comp-subsection">
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
      </div>
    `;
  } else if (openComp === 'neck') {
    const effZoom = getEffectiveFretZoom(state);
    const maxFrets = effZoom === 12 ? 12 : 22;
    const endFret = Math.min(maxFrets, state.fretWindowStart + state.fretWindowSpan);

    compartmentDrawerHtml = `
      <div class="deck-compartment-body" id="compNeck">
        <div class="compartment-head">
          <span class="control-label">${t(state.lang, 'compNeckViewTitle')}</span>
          <button type="button" class="btn-mini" data-action="closeCompartment">${t(state.lang, 'compClose')}</button>
        </div>

        <div class="comp-grid">
          <div class="control-group">
            <span class="control-label">${t(state.lang, 'orientLabel')}</span>
            <div class="pill-row">
              <button type="button" class="btn-pill ${state.fretOrientationMode === 'auto' ? 'active' : ''}" data-action="setOrientation" data-val="auto">${t(state.lang, 'orientAuto')}</button>
              <button type="button" class="btn-pill ${state.fretOrientationMode === 'horizontal' ? 'active' : ''}" data-action="setOrientation" data-val="horizontal">${t(state.lang, 'orientHoriz')}</button>
              <button type="button" class="btn-pill ${state.fretOrientationMode === 'vertical' ? 'active' : ''}" data-action="setOrientation" data-val="vertical">${t(state.lang, 'orientVert')}</button>
              <button type="button" class="btn-mini ${effZoom === 12 ? 'active-mini' : ''}" data-action="toggleZoom">🔍 ${effZoom === 12 ? '0–12' : '0–22'}</button>
              <button type="button" class="btn-mini ${state.leftHanded ? 'active-mini' : ''}" data-action="toggleLeftHand">⇄ ${t(state.lang, 'leftHandShort')}</button>
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

          <div class="control-group">
            <span class="control-label">${t(state.lang, 'compLayersLabel')}</span>
            <div class="pill-row">
              <button type="button" class="btn-pill ${state.voicingOverlayOn ? 'active-voicing' : ''}" data-action="toggleVoicingOverlay">
                ${state.voicingOverlayOn ? t(state.lang, 'voicingOverlayOn') : t(state.lang, 'voicingOverlayOff')}
              </button>
              <button type="button" class="btn-pill ${state.harmonicsOn ? 'active-harm' : ''}" data-action="toggleHarmonics">
                ${state.harmonicsOn ? t(state.lang, 'harmonicsOn') : t(state.lang, 'harmonicsOff')}
              </button>
              <button type="button" class="btn-pill ${state.scalaOverlayOn ? 'active-teal' : ''}" data-action="toggleScalaOverlay">
                Scala .scl
              </button>
            </div>
          </div>
        </div>

        <div class="comp-subsection comp-window-export-row">
          <div class="pill-row">
            <button type="button" class="btn-mini ${state.fretWindowOn ? 'active-mini' : ''}" data-action="fwToggle">
              ${state.fretWindowOn ? `${t(state.lang, 'fretWinClosed')}: ${state.fretWindowStart}–${endFret}` : t(state.lang, 'fretWinFull')}
            </button>
            ${state.fretWindowOn ? `
              <button type="button" class="btn-mini" data-action="fwShift" data-delta="-1" ${state.fretWindowStart <= 0 ? 'disabled' : ''}>◀</button>
              <button type="button" class="btn-mini" data-action="fwShift" data-delta="1" ${state.fretWindowStart + state.fretWindowSpan >= maxFrets ? 'disabled' : ''}>▶</button>
              ${[4, 5, 6].map((sp) => `
                <button type="button" class="btn-mini ${state.fretWindowSpan === sp ? 'active-mini' : ''}" data-action="fwSpan" data-val="${sp}">${sp}</button>
              `).join('')}
            ` : ''}
          </div>

          <div class="pill-row">
            <span class="control-label">${t(state.lang, 'compExportLabel')}:</span>
            <button type="button" class="btn-mini" data-action="exportPng">⬇ PNG (2×)</button>
            <button type="button" class="btn-mini" data-action="exportSvg">⬇ SVG</button>
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

          <!-- Save & Manage Custom Scordaturas (Luthieria Avançada) -->
          <div class="custom-tuning-save-bar">
            <input
              type="text"
              id="inpCustomTuningName"
              class="search-input"
              maxlength="28"
              placeholder="${t(state.lang, 'customTunPlaceholder')} (${formatStringsSignature(state.customStringsQ)})"
            />
            <button type="button" class="btn-primary" data-action="saveCustomTuning">
              ✦ ${t(state.lang, 'customTunSaveBtn')}
            </button>
          </div>

          ${(state.customTunings || []).length ? `
            <div class="saved-scordaturas-list">
              <span class="control-label">${t(state.lang, 'customTunSavedList')} (${state.customTunings.length})</span>
              <div class="saved-scordaturas-chips">
                ${state.customTunings.map((ct) => `
                  <div class="saved-tun-chip ${ct.id === state.tuningId ? 'is-active' : ''}">
                    <button type="button" class="saved-tun-load" data-action="quickTuning" data-id="${ct.id}">
                      ✦ <strong>${ct.short}</strong> <span class="mono-tag">${ct.stringsQ.length}${t(state.lang, 'strSuffix')} · ${formatStringsSignature(ct.stringsQ)}</span>
                    </button>
                    <button type="button" class="btn-mini saved-tun-del" data-action="deleteCustomTuning" data-id="${ct.id}" aria-label="Delete">✕</button>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  } else if (openComp === 'input') {
    const devOpts = state.audioInputDevices.length
      ? [
          `<option value="">${t(state.lang, 'lineDefaultDevice')}</option>`,
          ...state.audioInputDevices.map(
            (d) => `<option value="${d.deviceId}" ${d.deviceId === state.lineDeviceId ? 'selected' : ''}>${d.label}</option>`
          )
        ].join('')
      : `<option value="">${t(state.lang, 'lineDefaultDevice')}</option>`;

    compartmentDrawerHtml = `
      <div class="deck-compartment-body" id="compInput">
        <div class="compartment-head">
          <span class="control-label">${t(state.lang, 'compInputTitle')}</span>
          <div class="pill-row">
            <button type="button" class="btn-mini" data-action="autoCalibrateInput" title="${t(state.lang, 'calibTuningHint')}">
              ⚡ ${t(state.lang, 'calibTuningBtn')} (${activeTuning.short})
            </button>
            <button type="button" class="btn-mini" data-action="openFullLineTab">${t(state.lang, 'compInputFullBtn')} →</button>
            <button type="button" class="btn-mini" data-action="closeCompartment">${t(state.lang, 'compClose')}</button>
          </div>
        </div>

        <div class="input-comp-row">
          <button type="button" class="${state.lineModeRunning ? 'btn-danger' : 'btn-primary'}" data-action="toggleLineListening">
            ${state.lineModeRunning ? t(state.lang, 'lineStop') : t(state.lang, 'lineStart')}
          </button>

          <div class="pill-row">
            <button type="button" class="btn-pill ${state.lineInputMode === 'mic' ? 'active-teal' : ''}" data-action="setLineMode" data-val="mic">
              🎙 ${t(state.lang, 'lineModeMic')}
            </button>
            <button type="button" class="btn-pill ${state.lineInputMode === 'line' ? 'active-teal' : ''}" data-action="setLineMode" data-val="line">
              🔌 ${t(state.lang, 'lineModeDirect')}
            </button>
          </div>

          <div class="input-device-wrap">
            <select id="selDeckAudioInput" aria-label="${t(state.lang, 'lineDeviceLabel')}">${devOpts}</select>
            <button type="button" class="btn-mini" data-action="refreshLineDevices" title="${t(state.lang, 'lineRefreshDevices')}">↻</button>
          </div>

          <div class="pill-row" role="group" aria-label="${t(state.lang, 'lineChannelLabel')}">
            <button type="button" class="btn-mini ${state.lineChannel === 'mix' ? 'active-mini' : ''}" data-action="setLineChannel" data-val="mix">L+R</button>
            <button type="button" class="btn-mini ${state.lineChannel === 'ch1' ? 'active-mini' : ''}" data-action="setLineChannel" data-val="ch1">Ch 1</button>
            <button type="button" class="btn-mini ${state.lineChannel === 'ch2' ? 'active-mini' : ''}" data-action="setLineChannel" data-val="ch2">Ch 2</button>
          </div>
        </div>

        <div class="line-dsp-row" style="margin-top:10px;margin-bottom:0">
          <label class="bpm-control">
            <span>${t(state.lang, 'lineGainLabel')}</span>
            <input type="range" id="rngDeckLineGain" min="0.5" max="3.5" step="0.1" value="${state.lineInputGain}" />
            <strong id="valDeckLineGain">${state.lineInputGain.toFixed(1)}×</strong>
          </label>

          <label class="bpm-control">
            <span>${t(state.lang, 'lineGateLabel')}</span>
            <input type="range" id="rngDeckLineGate" min="0.004" max="0.060" step="0.002" value="${state.lineRmsGate}" />
            <strong id="valDeckLineGate">${Math.round(state.lineRmsGate * 1000)}</strong>
          </label>

          <div class="level-meter-wrap">
            <span class="control-label">${t(state.lang, 'lineInputLevel')}</span>
            <div class="level-meter-track">
              <div class="level-meter-fill" id="deckLineLevelFill" style="width:0%"></div>
            </div>
          </div>
        </div>

        <div class="comp-subsection input-tracking-row">
          <div class="pill-row">
            <button type="button" class="btn-mini ${state.lineShowOnNeck ? 'active-mini' : ''}" data-action="toggleLineNeck">
              ${t(state.lang, 'lineMirrorNeck')}
            </button>
            <button type="button" class="btn-mini ${state.lineTrailOn ? 'active-mini' : ''}" data-action="toggleLineTrail">
              ${t(state.lang, 'lineTrailLabel')}
            </button>
            <button type="button" class="btn-mini ${state.lineClampToWindow ? 'active-mini' : ''}" data-action="toggleLineClamp">
              ${t(state.lang, 'lineClampLabel')}
            </button>
          </div>

          <div class="pill-row">
            <span class="control-label">${t(state.lang, 'hudModeLabel')}:</span>
            <button type="button" class="btn-mini ${state.lineHudMode === 'tuner' ? 'active-mini' : ''}" data-action="setLineHudMode" data-val="tuner">${t(state.lang, 'hudModeTuner')}</button>
            <button type="button" class="btn-mini ${state.lineHudMode === 'strobe' ? 'active-mini' : ''}" data-action="setLineHudMode" data-val="strobe">${t(state.lang, 'hudModeStrobe')}</button>
            <button type="button" class="btn-mini ${state.lineHudMode === 'microbend' ? 'active-mini' : ''}" data-action="setLineHudMode" data-val="microbend">${t(state.lang, 'hudModeBend')}</button>
          </div>
        </div>

        ${state.lineModeRunning && state.lineInputMeta ? `
          <div class="line-meta-strip" style="margin-top:10px;margin-bottom:0">
            <span class="mono-tag">● ${(state.lineInputMeta.sampleRate / 1000).toFixed(1)} kHz · ${state.lineInputMeta.channelCount}ch · ${state.lineChannel.toUpperCase()}</span>
            ${state.lineInputMeta.label ? `<span class="soft-tag">${state.lineInputMeta.label}</span>` : ''}
            ${state.lineInputMeta.usedFallback ? `<span class="soft-tag" style="color:var(--accent-root)">${t(state.lang, 'lineFallbackTag')}</span>` : ''}
            ${state.lineInputMeta.isBluetooth ? `<span class="line-bt-warn">${t(state.lang, 'lineBtWarning')}</span>` : ''}
          </div>
        ` : ''}
        ${state.lineError ? `<p class="line-error-banner" style="margin-top:8px;margin-bottom:0">${state.lineError}</p>` : ''}
      </div>
    `;
  } else if (openComp === 'audio') {
    compartmentDrawerHtml = `
      <div class="deck-compartment-body" id="compAudio">
        <div class="compartment-head">
          <span class="control-label">${t(state.lang, 'compAudioTitle')}</span>
          <div class="pill-row">
            <button type="button" class="btn-mini" data-action="recoverAudio" title="${t(state.lang, 'audioRecoverTip')}">↻ ${t(state.lang, 'audioRecoverBtn')}</button>
            <button type="button" class="btn-mini" data-action="closeCompartment">${t(state.lang, 'compClose')}</button>
          </div>
        </div>

        <div class="comp-audio-top">
          <button type="button" class="btn-primary" data-action="playScale">
            ${state.isPlayingScale ? t(state.lang, 'stopScale') : t(state.lang, 'playScale')}
          </button>

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
              { id: 'karplus', key: 'fxKarplus' },
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
            <span>${t(state.lang, 'fxReverbMix')}</span>
            <input type="range" id="rngFxReverbMix" min="0" max="0.7" step="0.05" value="${state.reverbMix}" />
            <strong id="valFxReverbMix">${Math.round(state.reverbMix * 100)}%</strong>
          </label>

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

        <div class="comp-subsection a4-ref-row">
          <span class="control-label">${t(state.lang, 'refA4Label')}</span>
          <div class="pill-row">
            ${A4_PRESETS.map((hz) => `
              <button type="button" class="btn-mini ${Math.abs((state.refA4Hz || 440) - hz) < 0.05 ? 'active-mini' : ''}" data-action="setRefA4" data-val="${hz}">
                ${hz} Hz
              </button>
            `).join('')}
          </div>
          <label class="bpm-control">
            <span>A4</span>
            <input type="range" id="rngRefA4" min="415" max="446" step="0.5" value="${state.refA4Hz || 440}" />
            <strong id="valRefA4">${(state.refA4Hz || 440).toFixed((state.refA4Hz || 440) % 1 === 0 ? 0 : 1)} Hz</strong>
          </label>
        </div>
      </div>
    `;
  }

  const effOrient = getEffectiveOrientation(state);
  const orientSym = effOrient === 'vertical' ? '↕' : '↔';
  const microBadgeTxt = state.microMode === 'bend' ? 'Bend' : (state.microMode === 'slide' ? 'Slide' : '24');
  const filterActiveDot = (state.category !== 'all' || state.temperamentFilter !== 'all' || Boolean(state.scaleSearch)) ? '<span class="dock-dot"></span>' : '';
  const audioLiveDot = (state.droneOn || state.isPlayingScale) ? '<span class="live-pulse-dot" aria-hidden="true"></span>' : '';

  const inputMetaTxt = state.lineModeRunning
    ? 'LIVE'
    : (state.lineInputMode === 'line' ? `Line·${state.lineChannel.toUpperCase()}` : 'Mic');
  const inputLiveDot = state.lineModeRunning ? '<span class="live-pulse-dot" aria-hidden="true"></span>' : '';

  panel.innerHTML = `
    <!-- On-Demand Unified Controls Drawer Switcher (visible only when user opens Controles) -->
    <div class="drawer-switcher-head">
      <div class="compartment-dock rail-grid-5" role="tablist" aria-label="Studio Controls">
      <button type="button" class="dock-btn ${openComp === 'setup' ? 'is-open' : ''}" data-action="toggleCompartment" data-val="setup">
        <span class="dock-btn-main">
          <span class="dock-icon" aria-hidden="true">🎛</span>
          <span class="dock-label-full">${t(state.lang, 'dockSetup')}</span>
          <span class="dock-label-short">${t(state.lang, 'dockSetupShort')}</span>
        </span>
        <span class="dock-meta">${rootName} · ${activeTuning.custom ? '✦ ' : ''}${activeTuning.short}${isRetuned ? '*' : ''}</span>
        ${filterActiveDot}
      </button>

      <button type="button" class="dock-btn ${openComp === 'neck' ? 'is-open' : ''}" data-action="toggleCompartment" data-val="neck">
        <span class="dock-btn-main">
          <span class="dock-icon" aria-hidden="true">🎸</span>
          <span class="dock-label-full">${t(state.lang, 'dockNeck')}</span>
          <span class="dock-label-short">${t(state.lang, 'dockNeckShort')}</span>
        </span>
        <span class="dock-meta">${orientSym} · ${microBadgeTxt}${state.voicingOverlayOn ? ' · V' : ''}${state.harmonicsOn ? ' · H' : ''}</span>
      </button>

      <button type="button" class="dock-btn ${openComp === 'input' ? 'is-open' : ''} ${state.lineModeRunning ? 'is-live-dock' : ''}" data-action="toggleCompartment" data-val="input">
        <span class="dock-btn-main">
          <span class="dock-icon" aria-hidden="true">🎙</span>
          <span class="dock-label-full">${t(state.lang, 'dockInput')}</span>
          <span class="dock-label-short">${t(state.lang, 'dockInputShort')}</span>
        </span>
        <span class="dock-meta">${inputMetaTxt}</span>
        ${inputLiveDot}
      </button>

      <button type="button" class="dock-btn ${openComp === 'audio' ? 'is-open' : ''}" data-action="toggleCompartment" data-val="audio">
        <span class="dock-btn-main">
          <span class="dock-icon" aria-hidden="true">🔊</span>
          <span class="dock-label-full">${t(state.lang, 'dockAudio')}</span>
          <span class="dock-label-short">${t(state.lang, 'dockAudioShort')}</span>
        </span>
        <span class="dock-meta">${t(state.lang, `fx_${state.tonePreset}`)}${state.refA4Hz && state.refA4Hz !== 440 ? ` · ${state.refA4Hz}Hz` : ''}</span>
        ${audioLiveDot}
      </button>

      <button type="button" class="dock-btn ${state.notationOpen ? 'is-pinned' : ''}" data-action="toggleNotation">
        <span class="dock-btn-main">
          <span class="dock-icon" aria-hidden="true">🎼</span>
          <span class="dock-label-full">${t(state.lang, 'dockNotation')}</span>
          <span class="dock-label-short">${t(state.lang, 'dockNotationShort')}</span>
        </span>
        <span class="dock-meta">${state.notationOpen ? 'On' : (state.phraseEvents.length ? `${state.phraseEvents.length}` : 'Off')}</span>
      </button>
      </div>
    </div>

    ${compartmentDrawerHtml}
  `;

  // Bind optional compartment controls cleanly when present
  const selScale = panel.querySelector('#selScale');
  if (selScale) {
    selScale.onchange = (e) => {
      if (!e.target.value) return;
      stopPlaybackIfNeeded();
      const cur = getState();
      const revealPatch = cur.fretDisplayMode === 'clean' ? resolveFretDisplayPatch('position', cur) : {};
      setState({ ...revealPatch, scaleId: e.target.value, customScaleIntervalsQ: null, scalaOverlayOn: false, inspectedNote: null });
    };
  }

  const selRoot = panel.querySelector('#selRoot');
  if (selRoot) {
    selRoot.onchange = (e) => {
      const nextRoot = Number(e.target.value);
      setState({ rootQ: nextRoot });
      if (getState().droneOn) {
        synthEngine.updateDrone(true, nextRoot, getState().droneFifth);
      }
    };
  }

  const selTuning = panel.querySelector('#selTuning');
  if (selTuning) {
    selTuning.onchange = (e) => {
      applyTuningById(e.target.value);
    };
  }

  const searchInp = panel.querySelector('#inpScaleSearch');
  if (searchInp) {
    searchInp.oninput = (e) => {
      setState({ scaleSearch: e.target.value });
    };
  }

  const selDeckDev = panel.querySelector('#selDeckAudioInput');
  if (selDeckDev) {
    selDeckDev.onchange = (e) => {
      setState({ lineDeviceId: e.target.value });
      if (getState().lineModeRunning) startLineMode();
    };
  }

  const rngDeckGain = panel.querySelector('#rngDeckLineGain');
  const valDeckGain = panel.querySelector('#valDeckLineGain');
  if (rngDeckGain) {
    rngDeckGain.oninput = (e) => {
      const val = Number(e.target.value);
      if (valDeckGain) valDeckGain.textContent = `${val.toFixed(1)}×`;
      pitchDetector.setInputGain(val);
      setState({ lineInputGain: val });
    };
  }

  const rngDeckGate = panel.querySelector('#rngDeckLineGate');
  const valDeckGate = panel.querySelector('#valDeckLineGate');
  if (rngDeckGate) {
    rngDeckGate.oninput = (e) => {
      const val = Number(e.target.value);
      if (valDeckGate) valDeckGate.textContent = `${Math.round(val * 1000)}`;
      pitchDetector.setGate(val);
      setState({ lineRmsGate: val });
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
  bindFxRange('#rngFxReverbMix', '#valFxReverbMix', 'reverbMix', (v) => `${Math.round(v * 100)}%`);
  bindFxRange('#rngFxDelayMix', '#valFxDelayMix', 'delayMix', (v) => `${Math.round(v * 100)}%`);
  bindFxRange('#rngFxDelayTime', '#valFxDelayTime', 'delayTime', (v) => `${Math.round(v * 1000)}ms`);
  bindFxRange('#rngFxTremDepth', '#valFxTremDepth', 'tremoloDepth', (v) => `${Math.round(v * 100)}%`);
  bindFxRange('#rngFxTremRate', '#valFxTremRate', 'tremoloRate', (v) => `${v.toFixed(1)}Hz`);
  bindFxRange('#rngFxVol', '#valFxVol', 'masterVolume', (v) => `${Math.round(v * 100)}%`);

  const rngA4 = panel.querySelector('#rngRefA4');
  const valA4 = panel.querySelector('#valRefA4');
  if (rngA4) {
    rngA4.oninput = (e) => {
      const hz = Number(e.target.value);
      if (valA4) valA4.textContent = `${hz.toFixed(hz % 1 === 0 ? 0 : 1)} Hz`;
      setState({ refA4Hz: hz });
      const cur = getState();
      if (cur.droneOn) synthEngine.updateDrone(true, cur.rootQ, cur.droneFifth);
    };
    rngA4.onchange = () => {
      rngA4.blur();
      setState({ refA4Hz: Number(rngA4.value) });
    };
  }

  // Delegated click actions
  panel.onclick = (e) => {
    const btn = e.target.closest('button[data-action]');
    if (!btn) return;
    const action = btn.dataset.action;
    const st = getState();

    if (action === 'toggleCompartment') {
      const target = btn.dataset.val;
      const opening = st.deckCompartment !== target;
      setState({
        deckCompartment: opening ? target : null,
        headerMenuOpen: false
      });
      if (opening && target === 'input' && !st.audioInputDevices.length) {
        refreshAudioDevices();
      }
    } else if (action === 'autoCalibrateInput') {
      const cal = computeTuningInputCalibration(st.customStringsQ, st.refA4Hz);
      pitchDetector.setInputGain(cal.inputGain);
      pitchDetector.setGate(cal.rmsGate);
      setState({ lineInputGain: cal.inputGain, lineRmsGate: cal.rmsGate });
      showToast(
        st.lang === 'en'
          ? `Calibrated for ${activeTuning.short} (${cal.lowestHz} Hz): Gain ${cal.inputGain.toFixed(1)}× · Gate ${Math.round(cal.rmsGate * 1000)}`
          : `Calibrado para ${activeTuning.short} (${cal.lowestHz} Hz): Ganho ${cal.inputGain.toFixed(1)}× · Gate ${Math.round(cal.rmsGate * 1000)}`,
        'ok'
      );
    } else if (action === 'toggleLineListening') {
      if (st.lineModeRunning) stopLineMode();
      else startLineMode();
    } else if (action === 'setLineMode') {
      setState({ lineInputMode: btn.dataset.val });
      if (st.lineModeRunning) startLineMode();
    } else if (action === 'refreshLineDevices') {
      refreshAudioDevices();
    } else if (action === 'setLineChannel') {
      const ch = btn.dataset.val;
      pitchDetector.setChannel(ch);
      setState({ lineChannel: ch });
    } else if (action === 'toggleLineNeck') {
      setState({ lineShowOnNeck: !st.lineShowOnNeck });
    } else if (action === 'toggleLineTrail') {
      setState({ lineTrailOn: !st.lineTrailOn });
    } else if (action === 'toggleLineClamp') {
      setState({ lineClampToWindow: !st.lineClampToWindow });
    } else if (action === 'setLineHudMode') {
      setState({ lineHudMode: btn.dataset.val });
    } else if (action === 'openFullLineTab') {
      setState({ deckCompartment: null, activeTab: 'line', workspaceOpen: true });
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
        scalaOverlayOn: false,
        scaleId: stillVisible ? st.scaleId : (nextFiltered[0]?.id || st.scaleId)
      });
    } else if (action === 'tempFilter') {
      const tf = btn.dataset.val;
      const nextFiltered = getFilteredScales({ ...st, temperamentFilter: tf });
      const stillVisible = nextFiltered.some((s) => s.id === st.scaleId);
      setState({
        temperamentFilter: tf,
        customScaleIntervalsQ: null,
        scalaOverlayOn: false,
        scaleId: stillVisible ? st.scaleId : (nextFiltered[0]?.id || st.scaleId)
      });
    } else if (action === 'pickScale') {
      stopPlaybackIfNeeded();
      const revealPatch = st.fretDisplayMode === 'clean' ? resolveFretDisplayPatch('position', st) : {};
      setState({
        ...revealPatch,
        scaleId: btn.dataset.id,
        customScaleIntervalsQ: null,
        scalaOverlayOn: false,
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
    } else if (action === 'setOrientation') {
      setState({ fretOrientationMode: btn.dataset.val, fretZoomOverride: null });
    } else if (action === 'toggleZoom') {
      const curZoom = getEffectiveFretZoom(st);
      const nextMode = curZoom === 12 ? 'full' : (st.fretWindowOn ? 'position' : 'octave');
      setState(resolveFretDisplayPatch(nextMode, st));
    } else if (action === 'toggleLeftHand') {
      setState({ leftHanded: !st.leftHanded });
    } else if (action === 'fwToggle') {
      const nextMode = st.fretWindowOn ? 'octave' : 'position';
      setState(resolveFretDisplayPatch(nextMode, st));
    } else if (action === 'fwShift') {
      const curMax = getEffectiveFretZoom(st);
      const d = Number(btn.dataset.delta);
      const maxStart = Math.max(0, curMax - st.fretWindowSpan);
      const nextStart = Math.max(0, Math.min(maxStart, st.fretWindowStart + d));
      const keepClean = st.fretDisplayMode === 'clean';
      setState({
        fretWindowStart: nextStart,
        ...(keepClean ? { fretDisplayMode: 'clean', fretWindowOn: false } : {})
      });
    } else if (action === 'fwSpan') {
      const curMax = getEffectiveFretZoom(st);
      const sp = Number(btn.dataset.val);
      const maxStart = Math.max(0, curMax - sp);
      setState({ fretWindowSpan: sp, fretWindowStart: Math.min(st.fretWindowStart, maxStart) });
    } else if (action === 'exportPng' || action === 'exportSvg') {
      const sc = getActiveScale();
      const tun = getActiveTuning();
      const th = getThemeById(st.theme);
      const meta = {
        title: `${qToNoteName(st.rootQ, false)} ${st.lang === 'en' ? sc.nameEn : sc.namePt}`,
        formula: sc.intervalsQ.map((iv) => intervalQToLabel(iv)).join(' · '),
        tuningLabel: `${st.customStringsQ.length}c ${tun.short} (${st.customStringsQ.map((q) => qToNoteName(q, false)).join(' ')})`,
        themeName: st.lang === 'en' ? th.nameEn : th.namePt
      };
      if (action === 'exportPng') exportFretboardPlatePng(meta);
      else exportFretboardPlateSvg(meta);
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
    } else if (action === 'toggleScalaOverlay') {
      setState({ scalaOverlayOn: !st.scalaOverlayOn, inspectedNote: null });
    } else if (action === 'setRefA4') {
      const hz = Number(btn.dataset.val);
      setState({ refA4Hz: hz });
      const cur = getState();
      if (cur.droneOn) synthEngine.updateDrone(true, cur.rootQ, cur.droneFifth);
      synthEngine.pluckQ(114, { duration: 1.1, velocity: 0.3 });
      showToast(`${t(cur.lang, 'toastRefA4')}: A4 = ${hz} Hz`, 'info');
    } else if (action === 'recoverAudio') {
      synthEngine.recoverAudioEngine().then(() => {
        synthEngine.pluckQ(96 + mod24(st.rootQ), { duration: 1.0, velocity: 0.28 });
        showToast(t(st.lang, 'toastAudioRecovered'), 'success');
      });
    } else if (action === 'tonePreset') {
      const preset = btn.dataset.val;
      const delayMix = preset === 'swell' ? Math.max(st.delayMix, 0.42) : st.delayMix;
      synthEngine.updateToneFx({ tonePreset: preset, delayMix });
      synthEngine.pluckQ(96 + mod24(st.rootQ), { duration: 1.4, velocity: 0.35 });
      setState({ tonePreset: preset, delayMix });
    } else if (action === 'saveCustomTuning') {
      const inp = panel.querySelector('#inpCustomTuningName');
      const rawName = (inp?.value || '').trim();
      const created = createCustomTuning({ name: rawName, stringsQ: st.customStringsQ });
      if (!created) return;
      const nextList = [created, ...(st.customTunings || []).filter((x) => x.short.toLowerCase() !== created.short.toLowerCase())].slice(0, 32);
      setState({
        customTunings: nextList,
        tuningId: created.id,
        stringCount: created.stringsQ.length,
        customStringsQ: [...created.stringsQ]
      });
      showToast(`${t(st.lang, 'toastScordSaved')}: ${created.short}`, 'success');
    } else if (action === 'deleteCustomTuning') {
      const delId = btn.dataset.id;
      const nextList = (st.customTunings || []).filter((x) => x.id !== delId);
      const patch = { customTunings: nextList };
      if (st.tuningId === delId) {
        const fallback = DB.tunings.find((x) => x.stringsQ.length === st.stringCount) || DB.tunings[0];
        patch.tuningId = fallback.id;
        patch.customStringsQ = [...fallback.stringsQ];
      }
      setState(patch);
      showToast(t(st.lang, 'toastScordDeleted'), 'info');
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
}

function applyTuningById(tuningId) {
  stopPlaybackIfNeeded();
  const tun = findTuningById(tuningId) || DB.tunings[0];
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

  if (state.fretDisplayMode === 'clean' && !state.scalaOverlayOn) {
    const openItems = state.customStringsQ.map((sq) => ({ freq: qToFreq(sq), pc: mod24(sq) }));
    setState({ isPlayingScale: true });
    synthEngine.playFreqSequence(openItems, {
      bpm: Math.max(96, state.bpm),
      onStep: (item) => setState({ playingPcQ: item.pc }),
      onComplete: () => setState({ isPlayingScale: false, playingPcQ: null })
    });
    return;
  }

  if (state.scalaOverlayOn) {
    const parsed = parseSclText(state.scalaCustomText || getScalaPresetById(state.scalaPresetId).scl);
    if (parsed.ok) {
      const seq = buildScalaPlayFrequencies({ parsed, rootQ: state.rootQ });
      setState({ isPlayingScale: true });
      synthEngine.playFreqSequence(seq, {
        bpm: state.bpm,
        onComplete: () => setState({ isPlayingScale: false, playingPcQ: null })
      });
      return;
    }
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
