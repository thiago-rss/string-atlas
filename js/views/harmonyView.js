/**
 * Phase 2 Harmony & Voicing Lab + 24-TET Pitch-Class Set Builder
 */
import { DB } from '../core/database.js';
import {
  INTERVAL_NAMES_24,
  computeIntervalVector,
  intervalQToLabel,
  mod24,
  qToNoteName
} from '../core/theory24.js';
import { t } from '../core/i18n.js';
import {
  getActiveChord,
  getActiveChordIntervalsQ,
  getActiveVoicing,
  setState
} from '../state/store.js';
import { synthEngine } from '../audio/synthEngine.js';

export function renderHarmonyView(state) {
  const container = document.getElementById('tabHarmony');
  if (!container) return;

  const isEn = state.lang === 'en';
  const activeChord = getActiveChord();
  const activeIntervalsQ = getActiveChordIntervalsQ();
  const activeVoicing = getActiveVoicing();
  const ivVec = computeIntervalVector(activeIntervalsQ);
  const rootName = qToNoteName(state.rootQ, false);

  const vecBadge = ivVec
    ? `<span class="soft-tag">${t(state.lang, 'intervalVector')}: &lt;${ivVec.join('')}&gt;</span>`
    : `<span class="soft-tag" style="color:var(--accent-micro)">${t(state.lang, 'microtonalSet')}</span>`;

  const modeSelectorHtml = state.harmonyMode === 'catalog'
    ? `
      <div class="harmony-controls-row">
        <div class="control-group" style="flex:1;min-width:240px">
          <label class="control-label" for="selChord">${t(state.lang, 'chordStructureLabel')}</label>
          <select id="selChord">
            ${DB.chords.map((c) => `
              <option value="${c.id}" ${c.id === state.chordId ? 'selected' : ''}>
                ${rootName} ${c.symbol} — ${isEn ? c.nameEn : c.namePt}
              </option>
            `).join('')}
          </select>
        </div>
        <div class="harmony-meta-note">
          <p>${isEn ? activeChord.noteEn : activeChord.notePt}</p>
        </div>
      </div>
    `
    : `
      <div class="custom-set-box">
        <p class="custom-set-hint">${t(state.lang, 'customSetHint')}</p>
        <div class="pitch-matrix">
          ${INTERVAL_NAMES_24.map((lbl, q) => {
            const isActive = state.customSetIntervalsQ.includes(q);
            const isMicro = q % 2 !== 0;
            const isRoot = q === 0;
            const noteLbl = qToNoteName(mod24(state.rootQ + q), false);
            return `
              <button
                type="button"
                class="pitch-cell ${isActive ? 'is-on' : ''} ${isMicro ? 'is-micro' : ''} ${isRoot ? 'is-root' : ''}"
                data-h-action="toggleCustomQ"
                data-q="${q}"
                ${isRoot ? 'disabled' : ''}
              >
                <span class="pitch-deg">${lbl}</span>
                <span class="pitch-note">${noteLbl}</span>
              </button>
            `;
          }).join('')}
        </div>
        <div class="pill-row" style="margin-top:10px">
          <button type="button" class="btn-mini" data-h-action="resetCustomSet">${t(state.lang, 'customSetReset')}</button>
          <button type="button" class="btn-pill active-teal" data-h-action="projectCustomToScale">${t(state.lang, 'customSetApplyScale')}</button>
        </div>
      </div>
    `;

  const voicingsHtml = state.computedVoicings.length === 0
    ? `<p class="empty-hint">${t(state.lang, 'noVoicingsFound')}</p>`
    : `
      <div class="voicing-grid">
        ${state.computedVoicings.map((v, idx) => {
          const isSelected = idx === state.selectedVoicingIdx;
          const posRange = v.minFret === 0 && v.maxFret === 0
            ? 'Open'
            : `Fret ${v.minFret}–${v.maxFret}`;
          return `
            <button type="button" class="voicing-card ${isSelected ? 'is-selected' : ''}" data-h-action="selectVoicing" data-idx="${idx}">
              <div class="voicing-card-top">
                <span class="voicing-pos">#${idx + 1} · ${posRange}</span>
                <span class="voicing-bass">${t(state.lang, 'voicingBass')}: ${v.bassNoteName} (${v.bassInterval})</span>
              </div>
              <div class="voicing-tab-sig">${v.signature}</div>
              <div class="voicing-badges">
                ${v.hasOpenString ? `<span class="micro-badge open">${t(state.lang, 'voicingOpenTag')}</span>` : ''}
                ${v.hasMicrotone ? `<span class="micro-badge micro">${t(state.lang, 'voicingMicroTag')}</span>` : ''}
              </div>
            </button>
          `;
        }).join('')}
      </div>
    `;

  container.innerHTML = `
    <div class="panel">
      <div class="section-heading" style="flex-wrap:wrap">
        <span>${t(state.lang, 'harmonyTitle')}</span>
        <div class="pill-row">
          <button type="button" class="btn-pill ${state.harmonyMode === 'catalog' ? 'active' : ''}" data-h-action="harmonyMode" data-val="catalog">${t(state.lang, 'harmonyModeCatalog')}</button>
          <button type="button" class="btn-pill ${state.harmonyMode === 'custom' ? 'active' : ''}" data-h-action="harmonyMode" data-val="custom">${t(state.lang, 'harmonyModeCustom')}</button>
        </div>
      </div>

      <div class="tag-list">
        <span class="soft-tag">${activeIntervalsQ.map((iv) => intervalQToLabel(iv)).join(' · ')}</span>
        ${vecBadge}
        <span class="soft-tag">${state.computedVoicings.length} ${t(state.lang, 'voicingsFound')}</span>
      </div>

      ${modeSelectorHtml}

      <div class="harmony-action-bar">
        <button type="button" class="btn-primary" data-h-action="strum" ${activeVoicing ? '' : 'disabled'}>${t(state.lang, 'btnStrum')}</button>
        <button type="button" class="btn-pill" data-h-action="arpeggiate" ${activeVoicing ? '' : 'disabled'}>${t(state.lang, 'btnArpeggiate')}</button>
        <button type="button" class="btn-pill ${state.voicingOverlayOn ? 'active-voicing' : ''}" data-h-action="toggleOverlay">${t(state.lang, 'btnToggleOverlay')}</button>
      </div>

      ${voicingsHtml}
    </div>
  `;

  const selChord = container.querySelector('#selChord');
  if (selChord) {
    selChord.onchange = (e) => {
      setState({ chordId: e.target.value, selectedVoicingIdx: 0, voicingOverlayOn: true });
    };
  }

  container.onclick = (e) => {
    const btn = e.target.closest('button[data-h-action]');
    if (!btn) return;
    const act = btn.dataset.hAction;

    if (act === 'harmonyMode') {
      setState({ harmonyMode: btn.dataset.val, selectedVoicingIdx: 0 });
    } else if (act === 'selectVoicing') {
      const idx = Number(btn.dataset.idx);
      const chosen = state.computedVoicings[idx];
      setState({ selectedVoicingIdx: idx, voicingOverlayOn: true });
      if (chosen) synthEngine.strumVoicing(chosen);
    } else if (act === 'strum') {
      const v = getActiveVoicing();
      if (v) synthEngine.strumVoicing(v);
    } else if (act === 'arpeggiate') {
      const v = getActiveVoicing();
      if (v) synthEngine.arpeggiateVoicing(v);
    } else if (act === 'toggleOverlay') {
      setState({ voicingOverlayOn: !state.voicingOverlayOn });
    } else if (act === 'toggleCustomQ') {
      const q = Number(btn.dataset.q);
      if (q === 0) return;
      const exists = state.customSetIntervalsQ.includes(q);
      const next = exists
        ? state.customSetIntervalsQ.filter((x) => x !== q)
        : [...state.customSetIntervalsQ, q].sort((a, b) => a - b);
      if (next.length >= 2) {
        synthEngine.pluckQ(96 + mod24(state.rootQ + q), { duration: 1.1, velocity: 0.3 });
        setState({ customSetIntervalsQ: next, selectedVoicingIdx: 0 });
      }
    } else if (act === 'resetCustomSet') {
      setState({ customSetIntervalsQ: [0, 2, 12], selectedVoicingIdx: 0 });
    } else if (act === 'projectCustomToScale') {
      setState({ customScaleIntervalsQ: [...state.customSetIntervalsQ] });
    }
  };
}
