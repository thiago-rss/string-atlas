/**
 * Fronteira Microtonal — Scala (.scl) Importer, 53-TET, Just Intonation & Bohlen-Pierce Lab (v8.0)
 */
import {
  SCALA_PRESETS,
  buildScalaPlayFrequencies,
  exportToSclText,
  getScalaPresetById,
  parseSclText
} from '../core/scalaEngine.js';
import { triggerFileDownload } from '../core/exportEngine.js';
import { qToFreq, qToNoteName } from '../core/theory24.js';
import { t } from '../core/i18n.js';
import { getState, setState } from '../state/store.js';
import { synthEngine } from '../audio/synthEngine.js';

export function getActiveParsedScala(state) {
  if (state.scalaCustomText) {
    const p = parseSclText(state.scalaCustomText);
    if (p.ok) return p;
  }
  const preset = getScalaPresetById(state.scalaPresetId);
  return parseSclText(preset.scl);
}

export function renderScalaView(state) {
  const container = document.getElementById('tabScala');
  if (!container) return;

  const isEn = state.lang === 'en';
  const presetObj = getScalaPresetById(state.scalaPresetId);
  const rawScl = state.scalaCustomText || presetObj.scl;
  const parsed = parseSclText(rawScl);
  const rootName = qToNoteName(state.rootQ, false);
  const rootHz = qToFreq(96 + (((state.rootQ % 24) + 24) % 24));

  const presetOptions = SCALA_PRESETS.map((p) => `
    <option value="${p.id}" ${!state.scalaCustomText && p.id === state.scalaPresetId ? 'selected' : ''}>
      ${isEn ? p.nameEn : p.namePt}
    </option>
  `).join('');

  const degreesHtml = parsed.ok
    ? parsed.fullDegrees.map((d) => {
        const freq = rootHz * d.ratio;
        const dev = Math.round(d.devFrom12Cents);
        const devTxt = dev === 0 ? '0¢ (12-TET)' : `${dev > 0 ? '+' : ''}${dev}¢`;
        const isPure = Math.abs(dev) <= 4;
        const isPeriod = d.index === parsed.noteCount;
        const barPct = Math.min(100, Math.max(0, ((d.devFrom12Cents + 50) / 100) * 100));

        return `
          <button type="button" class="scala-deg-card ${d.index === 0 || isPeriod ? 'is-root' : ''} ${isPure ? 'is-pure' : ''}" data-sc-action="auditionDeg" data-freq="${freq.toFixed(3)}">
            <div class="scala-deg-top">
              <strong>${isPeriod ? t(state.lang, 'scalaPeriodTag') : `#${d.index}`} · ${d.raw}</strong>
              <span class="mono-tag">${d.cents.toFixed(1)}¢</span>
            </div>
            <div class="scala-deg-meta">
              <span class="mono-tag">${freq.toFixed(2)} Hz</span>
              <span class="scala-dev-pill ${isPure ? 'is-pure' : 'is-micro'}">${devTxt}</span>
            </div>
            <div class="scala-dev-bar" aria-hidden="true">
              <span class="scala-dev-center"></span>
              <span class="scala-dev-dot" style="left:${barPct.toFixed(1)}%"></span>
            </div>
          </button>
        `;
      }).join('')
    : `<p class="line-error-banner">${parsed.error}</p>`;

  const periodBadge = parsed.ok
    ? `${parsed.noteCount} ${t(state.lang, 'notesUnit')} · ${t(state.lang, 'scalaPeriodLabel')}: ${parsed.periodCents.toFixed(1)}¢ (${parsed.isOctave ? t(state.lang, 'scalaOctave') : t(state.lang, 'scalaNonOctave')})`
    : 'Invalid .scl';

  container.innerHTML = `
    <div class="panel">
      <div class="section-heading" style="flex-wrap:wrap">
        <span>${t(state.lang, 'scalaTitle')}</span>
        <span class="mono-tag">${periodBadge}</span>
      </div>

      <div class="scala-top-bar">
        <div class="control-group" style="flex:1.4;min-width:240px">
          <label class="control-label" for="selScalaPreset">${t(state.lang, 'scalaPresetLabel')}</label>
          <select id="selScalaPreset">${presetOptions}</select>
        </div>

        <div class="pill-row">
          <button type="button" class="${state.scalaOverlayOn ? 'btn-primary' : 'btn-pill active-teal'}" data-sc-action="toggleOverlay">
            ${state.scalaOverlayOn ? t(state.lang, 'scalaOverlayOn') : t(state.lang, 'scalaOverlayOff')}
          </button>

          <button type="button" class="btn-pill" data-sc-action="playScala">
            ${t(state.lang, 'scalaPlayBtn')} (${rootName})
          </button>

          <button type="button" class="btn-mini" data-sc-action="importScl">${t(state.lang, 'scalaImportBtn')}</button>
          <input type="file" id="inpImportScl" accept=".scl,text/plain" hidden />

          <button type="button" class="btn-mini" data-sc-action="exportScl">${t(state.lang, 'scalaExportBtn')}</button>

          <button type="button" class="btn-mini ${state.scalaEditorOpen ? 'active-mini' : ''}" data-sc-action="toggleEditor">
            ${t(state.lang, 'scalaEditorToggle')}
          </button>
        </div>
      </div>

      ${!state.scalaCustomText && presetObj ? `<p class="rhythm-note">${isEn ? presetObj.descEn : presetObj.descPt}</p>` : ''}

      ${state.scalaEditorOpen ? `
        <div class="scala-editor-box">
          <div class="compartment-head">
            <span class="control-label">${t(state.lang, 'scalaEditorLabel')}</span>
            <div class="pill-row">
              <button type="button" class="btn-primary" data-sc-action="applyEditor">${t(state.lang, 'scalaApplyBtn')}</button>
              <button type="button" class="btn-mini" data-sc-action="resetEditor">${t(state.lang, 'retunerReset')}</button>
            </div>
          </div>
          <textarea id="txtScalaScl" class="scala-textarea" rows="9" spellcheck="false">${rawScl.replace(/</g, '&lt;')}</textarea>
          ${state.scalaParseError ? `<p class="line-error-banner" style="margin-top:8px">${state.scalaParseError}</p>` : ''}
        </div>
      ` : ''}

      <div class="scala-degrees-grid">${degreesHtml}</div>

      <p class="empty-hint" style="margin-top:10px">${t(state.lang, 'scalaFooterTip')}</p>
    </div>
  `;

  container.querySelector('#selScalaPreset').onchange = (e) => {
    setState({
      scalaPresetId: e.target.value,
      scalaCustomText: '',
      scalaParseError: ''
    });
  };

  const fileInp = container.querySelector('#inpImportScl');
  if (fileInp) {
    fileInp.onchange = (ev) => {
      const file = ev.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        const text = String(reader.result || '');
        const check = parseSclText(text);
        if (!check.ok) {
          setState({ scalaEditorOpen: true, scalaParseError: check.error });
          return;
        }
        setState({
          scalaCustomText: text,
          scalaParseError: '',
          scalaOverlayOn: true
        });
      };
      reader.readAsText(file);
    };
  }

  container.onclick = (e) => {
    const btn = e.target.closest('button[data-sc-action]');
    if (!btn) return;
    const act = btn.dataset.scAction;
    const st = getState();

    if (act === 'toggleOverlay') {
      setState({ scalaOverlayOn: !st.scalaOverlayOn, inspectedNote: null });
    } else if (act === 'auditionDeg') {
      const freq = Number(btn.dataset.freq);
      if (Number.isFinite(freq)) {
        synthEngine.pluckFreq(freq, { duration: 1.9, velocity: 0.36 });
      }
    } else if (act === 'playScala') {
      const activeParsed = getActiveParsedScala(st);
      if (!activeParsed.ok) return;
      const seq = buildScalaPlayFrequencies({ parsed: activeParsed, rootQ: st.rootQ });
      synthEngine.playFreqSequence(seq, { bpm: st.bpm });
    } else if (act === 'importScl') {
      container.querySelector('#inpImportScl')?.click();
    } else if (act === 'exportScl') {
      const activeParsed = getActiveParsedScala(st);
      if (!activeParsed.ok) return;
      const out = exportToSclText(activeParsed);
      triggerFileDownload(out, `string-atlas-${st.scalaPresetId || 'custom'}.scl`, 'text/plain;charset=utf-8');
    } else if (act === 'toggleEditor') {
      setState({ scalaEditorOpen: !st.scalaEditorOpen });
    } else if (act === 'applyEditor') {
      const ta = container.querySelector('#txtScalaScl');
      const txt = ta ? ta.value : '';
      const res = parseSclText(txt);
      if (!res.ok) {
        setState({ scalaParseError: res.error });
        return;
      }
      setState({ scalaCustomText: txt, scalaParseError: '', scalaOverlayOn: true });
    } else if (act === 'resetEditor') {
      setState({ scalaCustomText: '', scalaParseError: '' });
    }
  };
}
