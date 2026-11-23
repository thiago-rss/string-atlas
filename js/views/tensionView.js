/**
 * Advanced Luthier String Tension Calculator & A/B Comparator View (v8.5)
 * - Synced live with String Atlas active tuning (6, 7, or 8 strings + custom saved scordaturas)
 * - Standard & Multi-Scale (Fanned Fret), 4 alloys, 16 gauge packs, Inverse Balanced Gauge Solver
 * - Side-by-Side A/B Setup Comparator (e.g. 25.5" vs 27.0" baritone, two gauge packs, or two tunings)
 *   with dual-bar SVG chart, Truss-Rod load advisory, Swap A <-> B, Apply B, and Copy A/B Report
 * - Quick "Save Scordatura" integration directly from the tension table
 */
import { DB } from '../core/database.js';
import {
  createCustomTuning,
  formatStringsSignature,
  stringsEqual
} from '../core/customTunings.js';
import {
  COMMERCIAL_GAUGES,
  GAUGE_PACKS,
  IN_TO_MM,
  LBS_TO_KG,
  SCALE_PRESETS,
  STRING_MATERIALS,
  calculateSetTension,
  compareTensionSetups,
  formatGaugeCode,
  getDefaultPackForCount,
  recommendBalancedGauges
} from '../core/tensionEngine.js';
import { t } from '../core/i18n.js';
import {
  findTuningById,
  getActiveTuning,
  getState,
  setState
} from '../state/store.js';
import { synthEngine } from '../audio/synthEngine.js';
import { showToast } from './toastView.js';

function ensureSyncedGauges(state) {
  const n = state.customStringsQ.length;
  if (Array.isArray(state.tensionGauges) && state.tensionGauges.length === n) {
    return state.tensionGauges;
  }
  const pack = getDefaultPackForCount(n, state.tuningId);
  return pack.strings.map((x) => ({ ...x }));
}

function ensureSyncedCompareB(state) {
  const raw = state.tensionCompareB;
  if (raw && Array.isArray(raw.stringsQ) && Array.isArray(raw.gauges) && raw.stringsQ.length === raw.gauges.length) {
    return raw;
  }
  const n = state.customStringsQ.length;
  const pack = getDefaultPackForCount(n, state.tuningId);
  return {
    label: 'Setup B',
    tuningId: state.tuningId,
    stringsQ: [...state.customStringsQ],
    scalePresetId: n === 8 ? 'ms_255_280' : (n === 7 ? 'ms_255_270' : '27_0'),
    scaleTrebleIn: n >= 7 ? 25.5 : 27.0,
    scaleBassIn: n === 8 ? 28.0 : 27.0,
    multiScale: n >= 7,
    materialId: state.tensionMaterial || 'nickel_plated',
    packId: pack.id,
    gauges: pack.strings.map((x) => ({ ...x }))
  };
}

function fmtTension(lbs, unit) {
  if (unit === 'kg') {
    return `${(lbs * LBS_TO_KG).toFixed(2)} kg`;
  }
  return `${lbs.toFixed(1)} lbs`;
}

function fmtSecondary(lbs, unit) {
  if (unit === 'kg') {
    return `${lbs.toFixed(1)} lbs`;
  }
  return `${(lbs * LBS_TO_KG).toFixed(2)} kg`;
}

function fmtDelta(deltaLbs, unit) {
  const val = unit === 'kg' ? (deltaLbs * LBS_TO_KG) : deltaLbs;
  const fixed = unit === 'kg' ? val.toFixed(2) : val.toFixed(1);
  const sign = val > 0.005 ? '+' : '';
  return `${sign}${fixed} ${unit}`;
}

function feelLabel(lang, feel) {
  const map = {
    floppy: 'tensFeelFloppy',
    light: 'tensFeelLight',
    balanced: 'tensFeelBalanced',
    heavy: 'tensFeelHeavy',
    stiff: 'tensFeelStiff'
  };
  return t(lang, map[feel] || 'tensFeelBalanced');
}

function trussLabel(lang, adv) {
  const map = {
    minimal: 'tensTrussMinimal',
    slight: 'tensTrussSlight',
    significant: 'tensTrussSignificant'
  };
  return t(lang, map[adv] || 'tensTrussMinimal');
}

function buildTuningSelectOptions(state, selectedId) {
  const isEn = state.lang === 'en';
  const customList = state.customTunings || [];
  const customOpt = customList.length
    ? `<optgroup label="✦ ${t(state.lang, 'customTuningsGroup')}">${customList.map((tun) => `
        <option value="${tun.id}" ${tun.id === selectedId ? 'selected' : ''}>
          ✦ ${tun.stringsQ.length}${t(state.lang, 'strSuffix')} · ${tun.namePt}
        </option>
      `).join('')}</optgroup>`
    : '';

  const builtIn = DB.tuningGroups.map((grp) => {
    const label = isEn ? grp.labelEn : grp.labelPt;
    const list = DB.tunings.filter((tun) => tun.group === grp.id);
    if (!list.length) return '';
    return `<optgroup label="${label}">${list.map((tun) => `
      <option value="${tun.id}" ${tun.id === selectedId ? 'selected' : ''}>
        ${tun.stringsQ.length}${t(state.lang, 'strSuffix')} · ${isEn ? tun.nameEn : tun.namePt}
      </option>
    `).join('')}</optgroup>`;
  }).join('');

  return customOpt + builtIn;
}

function buildTensionChartSvg(calc, unit, lang) {
  const rows = calc.displayRows;
  const n = rows.length;
  const svgW = 760;
  const rowH = 26;
  const padTop = 26;
  const padBot = 24;
  const padL = 78;
  const padR = 86;
  const svgH = padTop + n * rowH + padBot;
  const plotW = svgW - padL - padR;

  const maxLbsAxis = Math.max(28, Math.ceil(calc.maxLbs / 4) * 4 + 2);
  const xForLbs = (v) => padL + (Math.min(maxLbsAxis, Math.max(0, v)) / maxLbsAxis) * plotW;

  const idealX1 = xForLbs(14.5);
  const idealX2 = xForLbs(19.8);

  const parts = [];
  parts.push(`<svg class="tension-chart-svg" viewBox="0 0 ${svgW} ${svgH}" role="img" aria-label="String Tension Profile">`);

  parts.push(`<rect x="${idealX1.toFixed(1)}" y="${padTop - 6}" width="${(idealX2 - idealX1).toFixed(1)}" height="${n * rowH + 10}" fill="var(--accent-live)" fill-opacity="0.11" stroke="var(--accent-live)" stroke-opacity="0.35" stroke-dasharray="4 3"/>`);
  parts.push(`<text x="${((idealX1 + idealX2) / 2).toFixed(1)}" y="14" text-anchor="middle" fill="var(--accent-live)" font-size="9.5" font-weight="700" font-family="var(--font-mono, monospace)">${t(lang, 'tensIdealZone')} (14.5–19.8 lbs)</text>`);

  for (let v = 0; v <= maxLbsAxis; v += 5) {
    const x = xForLbs(v);
    parts.push(`<line x1="${x.toFixed(1)}" y1="${padTop - 4}" x2="${x.toFixed(1)}" y2="${padTop + n * rowH + 2}" stroke="var(--border-subtle)" stroke-width="1"/>`);
    const tickTxt = unit === 'kg' ? `${(v * LBS_TO_KG).toFixed(1)}kg` : `${v}lb`;
    parts.push(`<text x="${x.toFixed(1)}" y="${svgH - 6}" text-anchor="middle" fill="var(--text-muted)" font-size="9.5" font-family="var(--font-mono, monospace)">${tickTxt}</text>`);
  }

  const feelColors = {
    floppy: 'var(--accent-danger)',
    light: 'var(--accent-scale)',
    balanced: 'var(--accent-live)',
    heavy: 'var(--accent-root)',
    stiff: 'var(--accent-char)'
  };

  rows.forEach((r, i) => {
    const y = padTop + i * rowH;
    const barW = Math.max(4, xForLbs(r.lbs) - padL);
    const col = feelColors[r.feel] || 'var(--accent-scale)';

    parts.push(`<text x="${padL - 10}" y="${y + 15}" text-anchor="end" fill="var(--text-secondary)" font-size="10.5" font-weight="700" font-family="var(--font-mono, monospace)">S${r.guitarStr} · ${r.noteName}</text>`);
    parts.push(`<rect x="${padL}" y="${y + 4}" width="${plotW}" height="15" rx="3" fill="var(--bg-panel)" fill-opacity="0.55"/>`);
    parts.push(`<rect x="${padL}" y="${y + 4}" width="${barW.toFixed(1)}" height="15" rx="3" fill="${col}" fill-opacity="0.88"/>`);
    parts.push(`<rect x="${padL}" y="${y + 4}" width="${barW.toFixed(1)}" height="6.5" rx="2.5" fill="#ffffff" fill-opacity="0.22"/>`);
    parts.push(`<text x="${(padL + barW + 8).toFixed(1)}" y="${y + 15}" fill="var(--text-primary)" font-size="10.2" font-weight="700" font-family="var(--font-mono, monospace)">${fmtTension(r.lbs, unit)}</text>`);
  });

  parts.push('</svg>');
  return parts.join('');
}

function buildCompareChartSvg(cmp, unit, lang) {
  const rows = cmp.rows;
  const n = rows.length;
  const svgW = 760;
  const rowH = 34;
  const padTop = 30;
  const padBot = 24;
  const padL = 74;
  const padR = 112;
  const svgH = padTop + n * rowH + padBot;
  const plotW = svgW - padL - padR;

  const maxPeak = Math.max(cmp.calcA.maxLbs, cmp.calcB.maxLbs, 24);
  const maxLbsAxis = Math.max(28, Math.ceil(maxPeak / 4) * 4 + 2);
  const xForLbs = (v) => padL + (Math.min(maxLbsAxis, Math.max(0, v)) / maxLbsAxis) * plotW;

  const idealX1 = xForLbs(14.5);
  const idealX2 = xForLbs(19.8);

  const parts = [];
  parts.push(`<svg class="tension-chart-svg" viewBox="0 0 ${svgW} ${svgH}" role="img" aria-label="A/B String Tension Comparison">`);

  // Legend top-left
  parts.push(`<rect x="${padL}" y="6" width="12" height="8" rx="2" fill="var(--accent-root)"/>`);
  parts.push(`<text x="${padL + 16}" y="13.5" fill="var(--text-primary)" font-size="9.5" font-weight="700" font-family="var(--font-mono, monospace)">Setup A (${t(lang, 'tensActiveShort')})</text>`);
  parts.push(`<rect x="${padL + 145}" y="6" width="12" height="8" rx="2" fill="var(--accent-scale)"/>`);
  parts.push(`<text x="${padL + 161}" y="13.5" fill="var(--text-primary)" font-size="9.5" font-weight="700" font-family="var(--font-mono, monospace)">Setup B (${t(lang, 'tensCompareShort')})</text>`);

  // Shaded ideal comfort band
  parts.push(`<rect x="${idealX1.toFixed(1)}" y="${padTop - 4}" width="${(idealX2 - idealX1).toFixed(1)}" height="${n * rowH + 6}" fill="var(--accent-live)" fill-opacity="0.1" stroke="var(--accent-live)" stroke-opacity="0.34" stroke-dasharray="4 3"/>`);
  parts.push(`<text x="${((idealX1 + idealX2) / 2).toFixed(1)}" y="14" text-anchor="middle" fill="var(--accent-live)" font-size="9" font-weight="700" font-family="var(--font-mono, monospace)">14.5–19.8 lbs</text>`);

  for (let v = 0; v <= maxLbsAxis; v += 5) {
    const x = xForLbs(v);
    parts.push(`<line x1="${x.toFixed(1)}" y1="${padTop - 2}" x2="${x.toFixed(1)}" y2="${padTop + n * rowH + 2}" stroke="var(--border-subtle)" stroke-width="1"/>`);
    const tickTxt = unit === 'kg' ? `${(v * LBS_TO_KG).toFixed(1)}kg` : `${v}lb`;
    parts.push(`<text x="${x.toFixed(1)}" y="${svgH - 6}" text-anchor="middle" fill="var(--text-muted)" font-size="9.5" font-family="var(--font-mono, monospace)">${tickTxt}</text>`);
  }

  rows.forEach((item, i) => {
    const y = padTop + i * rowH;
    const lbl = item.rowA ? `S${item.guitarStr} · ${item.rowA.noteName}` : `S${item.guitarStr} · ${item.rowB?.noteName || '—'}`;
    parts.push(`<text x="${padL - 8}" y="${y + 19}" text-anchor="end" fill="var(--text-secondary)" font-size="10" font-weight="700" font-family="var(--font-mono, monospace)">${lbl}</text>`);

    if (item.rowA) {
      const wA = Math.max(4, xForLbs(item.rowA.lbs) - padL);
      parts.push(`<rect x="${padL}" y="${y + 4}" width="${plotW}" height="10" rx="2.5" fill="var(--bg-panel)" fill-opacity="0.5"/>`);
      parts.push(`<rect x="${padL}" y="${y + 4}" width="${wA.toFixed(1)}" height="10" rx="2.5" fill="var(--accent-root)" fill-opacity="0.9"/>`);
      parts.push(`<rect x="${padL}" y="${y + 4}" width="${wA.toFixed(1)}" height="4" rx="2" fill="#ffffff" fill-opacity="0.22"/>`);
    }
    if (item.rowB) {
      const wB = Math.max(4, xForLbs(item.rowB.lbs) - padL);
      parts.push(`<rect x="${padL}" y="${y + 16}" width="${plotW}" height="10" rx="2.5" fill="var(--bg-panel)" fill-opacity="0.5"/>`);
      parts.push(`<rect x="${padL}" y="${y + 16}" width="${wB.toFixed(1)}" height="10" rx="2.5" fill="var(--accent-scale)" fill-opacity="0.9"/>`);
      parts.push(`<rect x="${padL}" y="${y + 16}" width="${wB.toFixed(1)}" height="4" rx="2" fill="#ffffff" fill-opacity="0.22"/>`);
    }

    const maxBarX = Math.max(
      item.rowA ? xForLbs(item.rowA.lbs) : padL,
      item.rowB ? xForLbs(item.rowB.lbs) : padL
    );
    if (item.deltaLbs !== null) {
      const dCol = Math.abs(item.deltaLbs) < 0.4
        ? 'var(--text-muted)'
        : (item.deltaLbs > 0 ? 'var(--accent-root)' : 'var(--accent-scale)');
      parts.push(`<text x="${(maxBarX + 8).toFixed(1)}" y="${y + 19}" fill="${dCol}" font-size="9.8" font-weight="700" font-family="var(--font-mono, monospace)">Δ ${fmtDelta(item.deltaLbs, unit)}</text>`);
    }
  });

  parts.push('</svg>');
  return parts.join('');
}

export function renderTensionView(state) {
  const container = document.getElementById('tabTension');
  if (!container) return;

  const isEn = state.lang === 'en';
  const numStrings = state.customStringsQ.length;
  const gauges = ensureSyncedGauges(state);
  const activeTuning = getActiveTuning();
  const isRetuned = !stringsEqual(state.customStringsQ, activeTuning.stringsQ);
  const unit = state.tensionUnit || 'lbs';
  const compareOn = Boolean(state.tensionCompareOn);

  const setupA = {
    stringsQ: state.customStringsQ,
    gauges,
    scaleTrebleIn: state.tensionScaleTreble,
    scaleBassIn: state.tensionScaleBass,
    multiScale: state.tensionMultiScale,
    materialId: state.tensionMaterial
  };

  const calc = calculateSetTension(setupA);
  const matchingPacks = GAUGE_PACKS.filter((p) => p.stringCount === numStrings);

  const scalePresetOpts = SCALE_PRESETS.map((sp) => `
    <option value="${sp.id}" ${sp.id === state.tensionScalePresetId ? 'selected' : ''}>
      ${isEn ? sp.labelEn : sp.labelPt}
    </option>
  `).join('');

  const materialOpts = STRING_MATERIALS.map((m) => `
    <option value="${m.id}" ${m.id === state.tensionMaterial ? 'selected' : ''}>
      ${isEn ? m.labelEn : m.labelPt}
    </option>
  `).join('');

  const packOpts = [
    `<option value="custom" ${state.tensionPackId === 'custom' ? 'selected' : ''}>${t(state.lang, 'tensCustomPack')}</option>`,
    ...matchingPacks.map((p) => `
      <option value="${p.id}" ${p.id === state.tensionPackId ? 'selected' : ''}>
        ${isEn ? p.nameEn : p.namePt}
      </option>
    `)
  ].join('');

  const rowsHtml = calc.displayRows.map((row) => {
    const gaugeOptions = COMMERCIAL_GAUGES.map((g) => {
      const code = formatGaugeCode(g, false).replace('P', '');
      const sel = Math.abs(g - row.gauge) < 0.0001 ? 'selected' : '';
      return `<option value="${g}" ${sel}>${code}</option>`;
    }).join('');

    return `
      <tr class="tension-row feel-${row.feel}">
        <td class="mono-tag"><strong>${row.guitarStr}</strong></td>
        <td>
          <div class="tension-note-cell">
            <button type="button" class="btn-mini" data-ts-action="audition" data-q="${row.q}" title="${t(state.lang, 'tensAuditionTip')}">
              ▶ ${row.noteName}
            </button>
            <span class="mono-tag">${row.freqHz.toFixed(1)} Hz</span>
            <div class="tension-tune-btns">
              <button type="button" class="btn-mini" data-ts-action="tuneStep" data-idx="${row.strIdx}" data-delta="-2" title="-1 semitone">−1st</button>
              <button type="button" class="btn-mini" data-ts-action="tuneStep" data-idx="${row.strIdx}" data-delta="2" title="+1 semitone">+1st</button>
            </div>
          </div>
        </td>
        <td class="mono-tag">${row.scaleIn.toFixed(2)}″ <span class="tens-sub">(${Math.round(row.scaleMm)}mm)</span></td>
        <td>
          <div class="tension-gauge-cell">
            <select class="vamp-mini-sel" data-ts-gauge="${row.strIdx}" aria-label="Gauge string ${row.guitarStr}">
              ${gaugeOptions}
            </select>
            <button type="button" class="btn-mini ${row.wound ? 'active-mini' : ''}" data-ts-action="toggleWound" data-idx="${row.strIdx}">
              ${row.wound ? 'W' : 'P'}
            </button>
          </div>
        </td>
        <td class="mono-tag">
          <strong>${fmtTension(row.lbs, unit)}</strong>
          <span class="tens-sub">(${fmtSecondary(row.lbs, unit)})</span>
        </td>
        <td>
          <span class="feel-badge feel-${row.feel}">${feelLabel(state.lang, row.feel)}</span>
        </td>
      </tr>
    `;
  }).join('');

  const scaleDisplaySummary = state.tensionMultiScale
    ? `${state.tensionScaleTreble.toFixed(2)}″ – ${state.tensionScaleBass.toFixed(2)}″`
    : `${state.tensionScaleTreble.toFixed(2)}″ (${Math.round(state.tensionScaleTreble * IN_TO_MM)} mm)`;

  // -------------------------------------------------------------------------
  // OPTIONAL A/B COMPARATOR SECTION (Luthieria Avançada v8.5)
  // -------------------------------------------------------------------------
  let compareSectionHtml = '';
  if (compareOn) {
    const cfgB = ensureSyncedCompareB(state);
    const setupB = {
      stringsQ: cfgB.stringsQ,
      gauges: cfgB.gauges,
      scaleTrebleIn: cfgB.scaleTrebleIn,
      scaleBassIn: cfgB.scaleBassIn,
      multiScale: cfgB.multiScale,
      materialId: cfgB.materialId
    };
    const cmp = compareTensionSetups(setupA, setupB);
    const packsB = GAUGE_PACKS.filter((p) => p.stringCount === cfgB.stringsQ.length);

    const scaleOptsB = SCALE_PRESETS.map((sp) => `
      <option value="${sp.id}" ${sp.id === cfgB.scalePresetId ? 'selected' : ''}>
        ${isEn ? sp.labelEn : sp.labelPt}
      </option>
    `).join('');

    const packOptsB = [
      `<option value="custom" ${cfgB.packId === 'custom' ? 'selected' : ''}>${t(state.lang, 'tensCustomPack')}</option>`,
      ...packsB.map((p) => `
        <option value="${p.id}" ${p.id === cfgB.packId ? 'selected' : ''}>
          ${isEn ? p.nameEn : p.namePt}
        </option>
      `)
    ].join('');

    const matOptsB = STRING_MATERIALS.map((m) => `
      <option value="${m.id}" ${m.id === cfgB.materialId ? 'selected' : ''}>
        ${isEn ? m.labelEn : m.labelPt}
      </option>
    `).join('');

    const tunObjB = findTuningById(cfgB.tuningId, state);
    const scaleBSummary = cfgB.multiScale
      ? `${cfgB.scaleTrebleIn.toFixed(2)}″ – ${cfgB.scaleBassIn.toFixed(2)}″`
      : `${cfgB.scaleTrebleIn.toFixed(2)}″`;

    const cmpRowsHtml = cmp.rows.map((item) => {
      const aTxt = item.rowA
        ? `<strong>${item.rowA.noteName}</strong> · ${item.rowA.gaugeCode} · ${item.rowA.scaleIn.toFixed(2)}″ → <strong>${fmtTension(item.rowA.lbs, unit)}</strong>`
        : '—';
      const bTxt = item.rowB
        ? `<strong>${item.rowB.noteName}</strong> · ${item.rowB.gaugeCode} · ${item.rowB.scaleIn.toFixed(2)}″ → <strong>${fmtTension(item.rowB.lbs, unit)}</strong>`
        : '—';
      let deltaHtml = '<span class="mono-tag">—</span>';
      if (item.deltaLbs !== null) {
        const cls = Math.abs(item.deltaLbs) < 0.4 ? 'is-neutral' : (item.deltaLbs > 0 ? 'is-up' : 'is-down');
        deltaHtml = `<span class="cmp-delta-pill ${cls}">${fmtDelta(item.deltaLbs, unit)}</span>`;
      }
      return `
        <tr>
          <td class="mono-tag"><strong>${item.guitarStr}</strong></td>
          <td class="mono-tag">${aTxt}</td>
          <td class="mono-tag">${bTxt}</td>
          <td>${deltaHtml}</td>
        </tr>
      `;
    }).join('');

    const pctSign = cmp.deltaTotalPct > 0.05 ? '+' : '';
    const balSign = cmp.deltaBalance > 0 ? '+' : '';

    compareSectionHtml = `
      <div class="tension-compare-box">
        <div class="compartment-head" style="flex-wrap:wrap">
          <span class="control-label">⚖ ${t(state.lang, 'tensCompareHeading')}</span>
          <div class="pill-row">
            <button type="button" class="btn-mini" data-ts-action="cloneAtoB">${t(state.lang, 'tensCloneAtoB')}</button>
            <button type="button" class="btn-mini" data-ts-action="swapAB">⇄ ${t(state.lang, 'tensSwapAB')}</button>
            <button type="button" class="btn-mini active-mini" data-ts-action="applyBtoA">${t(state.lang, 'tensApplyBtoA')}</button>
            <button type="button" class="btn-mini" data-ts-action="recommendB">✦ ${t(state.lang, 'tensSolveB')}</button>
            <button type="button" class="btn-mini" data-ts-action="copyABReport">${t(state.lang, 'tensCopyAB')}</button>
          </div>
        </div>

        <div class="tension-config-grid">
          <div class="control-group">
            <label class="control-label" for="selTuningB">${t(state.lang, 'tensTuningBLabel')}</label>
            <select id="selTuningB">${buildTuningSelectOptions(state, cfgB.tuningId)}</select>
          </div>

          <div class="control-group">
            <label class="control-label" for="selScalePresetB">${t(state.lang, 'tensScaleBLabel')}</label>
            <select id="selScalePresetB">${scaleOptsB}</select>
          </div>

          <div class="control-group">
            <label class="control-label" for="selGaugePackB">${t(state.lang, 'tensPackBLabel')} (${cfgB.stringsQ.length}${t(state.lang, 'strSuffix')})</label>
            <select id="selGaugePackB">${packOptsB}</select>
          </div>

          <div class="control-group">
            <label class="control-label" for="selMatB">${t(state.lang, 'tensMaterialLabel')} (B)</label>
            <select id="selMatB">${matOptsB}</select>
          </div>
        </div>

        <div class="tension-kpi-grid" style="margin-top:10px">
          <div class="tension-kpi-card">
            <span class="control-label">${t(state.lang, 'tensDeltaNeck')}</span>
            <strong class="tension-kpi-val" style="color:${Math.abs(cmp.deltaTotalLbs) < 7.5 ? 'var(--accent-live)' : 'var(--accent-root)'}">
              ${fmtDelta(cmp.deltaTotalLbs, unit)} (${pctSign}${cmp.deltaTotalPct.toFixed(1)}%)
            </strong>
            <span class="mono-tag">A: ${fmtTension(cmp.calcA.totalLbs, unit)} · B: ${fmtTension(cmp.calcB.totalLbs, unit)}</span>
          </div>

          <div class="tension-kpi-card">
            <span class="control-label">${t(state.lang, 'tensTrussTitle')}</span>
            <strong class="tension-kpi-val" style="font-size:0.96rem;color:${cmp.trussAdvisory === 'minimal' ? 'var(--accent-live)' : (cmp.trussAdvisory === 'slight' ? 'var(--accent-root)' : 'var(--accent-char)')}">
              ${trussLabel(state.lang, cmp.trussAdvisory)}
            </strong>
            <span class="mono-tag">B: ${tunObjB ? tunObjB.short : 'Custom'} · ${scaleBSummary}</span>
          </div>

          <div class="tension-kpi-card">
            <span class="control-label">${t(state.lang, 'tensBalanceAB')}</span>
            <strong class="tension-kpi-val" style="font-size:1.15rem">
              ${cmp.calcA.balanceScore}% → ${cmp.calcB.balanceScore}% (${balSign}${cmp.deltaBalance}%)
            </strong>
            <span class="mono-tag">${t(state.lang, 'tensAvgString')}: ${fmtTension(cmp.calcA.avgLbs, unit)} → ${fmtTension(cmp.calcB.avgLbs, unit)}</span>
          </div>
        </div>

        <div class="tension-chart-wrap">
          ${buildCompareChartSvg(cmp, unit, state.lang)}
        </div>

        <div class="tension-table-scroll">
          <table class="tension-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Setup A (${activeTuning.short} · ${scaleDisplaySummary})</th>
                <th>Setup B (${tunObjB ? tunObjB.short : 'Custom'} · ${scaleBSummary})</th>
                <th>Δ (B − A)</th>
              </tr>
            </thead>
            <tbody>${cmpRowsHtml}</tbody>
          </table>
        </div>
      </div>
    `;
  }

  container.innerHTML = `
    <div class="panel">
      <div class="section-heading" style="flex-wrap:wrap">
        <span>${t(state.lang, 'tensTitle')}</span>
        <div class="pill-row">
          <button type="button" class="btn-pill ${compareOn ? 'active-teal' : ''}" data-ts-action="toggleCompare">
            ⚖ ${t(state.lang, 'tensCompareBtn')}
          </button>
          <button type="button" class="btn-mini ${unit === 'lbs' ? 'active-mini' : ''}" data-ts-action="setUnit" data-val="lbs">lbs</button>
          <button type="button" class="btn-mini ${unit === 'kg' ? 'active-mini' : ''}" data-ts-action="setUnit" data-val="kg">kg</button>
          <button type="button" class="btn-mini" id="btnCopyTensionSetup" data-ts-action="copySetup">${t(state.lang, 'tensCopySetup')}</button>
        </div>
      </div>

      ${compareSectionHtml}

      <!-- Setup A (Active Instrument) Configuration Grid -->
      <div class="tension-config-grid">
        <div class="control-group">
          <label class="control-label" for="selScalePreset">${t(state.lang, 'tensScalePresetLabel')}</label>
          <select id="selScalePreset">${scalePresetOpts}</select>
        </div>

        <div class="control-group">
          <label class="control-label" for="selGaugePack">${t(state.lang, 'tensGaugePackLabel')} (${numStrings}${t(state.lang, 'strSuffix')})</label>
          <select id="selGaugePack">${packOpts}</select>
        </div>

        <div class="control-group">
          <label class="control-label" for="selStringMat">${t(state.lang, 'tensMaterialLabel')}</label>
          <select id="selStringMat">${materialOpts}</select>
        </div>

        <div class="control-group">
          <span class="control-label">${t(state.lang, 'tensCustomScaleLabel')}</span>
          <div class="tension-scale-inputs">
            <label class="tens-num-wrap">
              <span>${state.tensionMultiScale ? t(state.lang, 'tensTrebleShort') : 'Scale'}</span>
              <input type="number" id="inpScaleTreble" min="20" max="36" step="0.25" value="${state.tensionScaleTreble}" />
              <span>″</span>
            </label>
            ${state.tensionMultiScale ? `
              <label class="tens-num-wrap">
                <span>${t(state.lang, 'tensBassShort')}</span>
                <input type="number" id="inpScaleBass" min="20" max="36" step="0.25" value="${state.tensionScaleBass}" />
                <span>″</span>
              </label>
            ` : ''}
            <button type="button" class="btn-mini ${state.tensionMultiScale ? 'active-mini' : ''}" data-ts-action="toggleMultiScale">
              ${t(state.lang, 'tensMultiScaleBtn')}
            </button>
          </div>
        </div>
      </div>

      <!-- Smart Balanced Gauge Recommender Bar -->
      <div class="tension-solver-bar">
        <div class="pill-row">
          <span class="control-label">${t(state.lang, 'tensSolverLabel')}</span>
          <label class="bpm-control">
            <span>${t(state.lang, 'tensTargetLabel')}</span>
            <input type="range" id="rngTargetLbs" min="11.5" max="22.0" step="0.5" value="${state.tensionTargetLbs}" />
            <strong id="valTargetLbs">${fmtTension(state.tensionTargetLbs, unit)}</strong>
          </label>
        </div>
        <div class="pill-row">
          <button type="button" class="btn-primary" data-ts-action="recommendBalanced">${t(state.lang, 'tensRecommendBtn')}</button>
          <button type="button" class="btn-mini" data-ts-action="matchActivePack">${t(state.lang, 'tensAutoPackBtn')}</button>
        </div>
      </div>

      <!-- Summary KPI Strip -->
      <div class="tension-kpi-grid">
        <div class="tension-kpi-card">
          <span class="control-label">${t(state.lang, 'tensTotalNeck')}</span>
          <strong class="tension-kpi-val">${fmtTension(calc.totalLbs, unit)}</strong>
          <span class="mono-tag">${fmtSecondary(calc.totalLbs, unit)} · ${scaleDisplaySummary}</span>
        </div>

        <div class="tension-kpi-card">
          <span class="control-label">${t(state.lang, 'tensAvgString')}</span>
          <strong class="tension-kpi-val">${fmtTension(calc.avgLbs, unit)}</strong>
          <span class="mono-tag">P: ${fmtTension(calc.plainAvgLbs, unit)} · W: ${fmtTension(calc.woundAvgLbs, unit)}</span>
        </div>

        <div class="tension-kpi-card">
          <span class="control-label">${t(state.lang, 'tensBalanceScore')}</span>
          <strong class="tension-kpi-val" style="color:${calc.balanceScore >= 78 ? 'var(--accent-live)' : 'var(--accent-root)'}">${calc.balanceScore}%</strong>
          <span class="mono-tag">Δ ${fmtTension(calc.spreadLbs, unit)} (${fmtTension(calc.minLbs, unit)}–${fmtTension(calc.maxLbs, unit)})</span>
        </div>

        <div class="tension-kpi-card">
          <span class="control-label">${t(state.lang, 'tensActiveTuning')}</span>
          <strong class="tension-kpi-val" style="font-size:1.05rem">${activeTuning.custom ? '✦ ' : ''}${activeTuning.short}${isRetuned ? '*' : ''}</strong>
          <span class="mono-tag">${calc.displayRows.map((r) => r.gaugeCode).join(' · ')}</span>
        </div>
      </div>

      <!-- Visual Tension Profile SVG (hidden when Compare A/B dual chart is shown to keep screen clean) -->
      ${!compareOn ? `
        <div class="tension-chart-wrap">
          ${buildTensionChartSvg(calc, unit, state.lang)}
        </div>
      ` : ''}

      <!-- Per-String Interactive Breakdown Table -->
      <div class="tension-table-scroll">
        <table class="tension-table">
          <thead>
            <tr>
              <th>#</th>
              <th>${t(state.lang, 'tensColNote')}</th>
              <th>${t(state.lang, 'tensColScale')}</th>
              <th>${t(state.lang, 'tensColGauge')}</th>
              <th>${t(state.lang, 'tensColTension')}</th>
              <th>${t(state.lang, 'tensColFeel')}</th>
            </tr>
          </thead>
          <tbody>${rowsHtml}</tbody>
        </table>
      </div>

      <!-- Quick Save Scordatura directly from Tension Lab -->
      <div class="custom-tuning-save-bar" style="margin-top:10px">
        <input
          type="text"
          id="inpTensCustomTunName"
          class="search-input"
          maxlength="28"
          placeholder="${t(state.lang, 'customTunPlaceholder')} (${formatStringsSignature(state.customStringsQ)})"
        />
        <button type="button" class="btn-mini active-mini" data-ts-action="saveCustomTuning">
          ✦ ${t(state.lang, 'customTunSaveBtn')}
        </button>
      </div>

      <p class="empty-hint" style="margin-top:10px">${t(state.lang, 'tensPhysicsNote')}</p>
    </div>
  `;

  // Bind Setup A selects & numeric inputs
  container.querySelector('#selScalePreset').onchange = (e) => {
    const sp = SCALE_PRESETS.find((x) => x.id === e.target.value);
    if (!sp) return;
    setState({
      tensionScalePresetId: sp.id,
      tensionScaleTreble: sp.treble,
      tensionScaleBass: sp.bass,
      tensionMultiScale: sp.multi
    });
  };

  container.querySelector('#selGaugePack').onchange = (e) => {
    const pack = GAUGE_PACKS.find((p) => p.id === e.target.value);
    if (!pack) return;
    setState({
      tensionPackId: pack.id,
      tensionGauges: pack.strings.map((x) => ({ ...x }))
    });
  };

  container.querySelector('#selStringMat').onchange = (e) => {
    setState({ tensionMaterial: e.target.value });
  };

  const inpTreble = container.querySelector('#inpScaleTreble');
  if (inpTreble) {
    inpTreble.onchange = (e) => {
      const val = Math.max(20, Math.min(36, Number(e.target.value) || 25.5));
      const st = getState();
      setState({
        tensionScalePresetId: 'custom',
        tensionScaleTreble: val,
        tensionScaleBass: st.tensionMultiScale ? st.tensionScaleBass : val
      });
    };
  }

  const inpBass = container.querySelector('#inpScaleBass');
  if (inpBass) {
    inpBass.onchange = (e) => {
      const val = Math.max(20, Math.min(36, Number(e.target.value) || 27.0));
      setState({ tensionScalePresetId: 'custom', tensionScaleBass: val });
    };
  }

  const rngTarget = container.querySelector('#rngTargetLbs');
  const valTarget = container.querySelector('#valTargetLbs');
  if (rngTarget) {
    rngTarget.oninput = (e) => {
      const v = Number(e.target.value);
      if (valTarget) valTarget.textContent = fmtTension(v, getState().tensionUnit);
      setState({ tensionTargetLbs: v });
    };
  }

  // Bind Setup B selectors when Comparator A/B is active
  const selTunB = container.querySelector('#selTuningB');
  if (selTunB) {
    selTunB.onchange = (e) => {
      const st = getState();
      const tun = findTuningById(e.target.value, st);
      if (!tun) return;
      const curB = ensureSyncedCompareB(st);
      const nextPack = tun.stringsQ.length !== curB.stringsQ.length
        ? getDefaultPackForCount(tun.stringsQ.length, tun.id)
        : null;
      setState({
        tensionCompareB: {
          ...curB,
          tuningId: tun.id,
          stringsQ: [...tun.stringsQ],
          ...(nextPack ? { packId: nextPack.id, gauges: nextPack.strings.map((x) => ({ ...x })) } : {})
        }
      });
    };
  }

  const selScaleB = container.querySelector('#selScalePresetB');
  if (selScaleB) {
    selScaleB.onchange = (e) => {
      const sp = SCALE_PRESETS.find((x) => x.id === e.target.value);
      if (!sp) return;
      const curB = ensureSyncedCompareB(getState());
      setState({
        tensionCompareB: {
          ...curB,
          scalePresetId: sp.id,
          scaleTrebleIn: sp.treble,
          scaleBassIn: sp.bass,
          multiScale: sp.multi
        }
      });
    };
  }

  const selPackB = container.querySelector('#selGaugePackB');
  if (selPackB) {
    selPackB.onchange = (e) => {
      const pack = GAUGE_PACKS.find((p) => p.id === e.target.value);
      if (!pack) return;
      const curB = ensureSyncedCompareB(getState());
      setState({
        tensionCompareB: {
          ...curB,
          packId: pack.id,
          gauges: pack.strings.map((x) => ({ ...x }))
        }
      });
    };
  }

  const selMatB = container.querySelector('#selMatB');
  if (selMatB) {
    selMatB.onchange = (e) => {
      const curB = ensureSyncedCompareB(getState());
      setState({
        tensionCompareB: { ...curB, materialId: e.target.value }
      });
    };
  }

  // Per-string gauge dropdowns (Setup A)
  container.onchange = (e) => {
    const sel = e.target.closest('select[data-ts-gauge]');
    if (!sel) return;
    const idx = Number(sel.dataset.tsGauge);
    const nextG = Number(sel.value);
    const st = getState();
    const cur = ensureSyncedGauges(st).map((x) => ({ ...x }));
    if (!cur[idx]) return;
    cur[idx].gauge = nextG;
    if (nextG >= 0.024) cur[idx].wound = true;
    else if (nextG <= 0.016) cur[idx].wound = false;
    setState({ tensionGauges: cur, tensionPackId: 'custom' });
  };

  // Delegated button actions
  container.onclick = (e) => {
    const btn = e.target.closest('button[data-ts-action]');
    if (!btn) return;
    const act = btn.dataset.tsAction;
    const st = getState();

    if (act === 'toggleCompare') {
      const nextOn = !st.tensionCompareOn;
      if (nextOn) {
        // Pre-seed Setup B smartly with current tuning & gauges at an informative alternate scale (e.g. 25.5" <-> 27.0")
        const curG = ensureSyncedGauges(st).map((x) => ({ ...x }));
        const altPreset = st.tensionScaleTreble >= 26.5
          ? SCALE_PRESETS.find((x) => x.id === '25_5')
          : SCALE_PRESETS.find((x) => x.id === '27_0');
        setState({
          tensionCompareOn: true,
          tensionCompareB: {
            label: 'Setup B',
            tuningId: st.tuningId,
            stringsQ: [...st.customStringsQ],
            scalePresetId: altPreset.id,
            scaleTrebleIn: altPreset.treble,
            scaleBassIn: altPreset.bass,
            multiScale: altPreset.multi,
            materialId: st.tensionMaterial,
            packId: st.tensionPackId,
            gauges: curG
          }
        });
      } else {
        setState({ tensionCompareOn: false });
      }
    } else if (act === 'cloneAtoB') {
      setState({
        tensionCompareB: {
          label: 'Setup B',
          tuningId: st.tuningId,
          stringsQ: [...st.customStringsQ],
          scalePresetId: st.tensionScalePresetId,
          scaleTrebleIn: st.tensionScaleTreble,
          scaleBassIn: st.tensionScaleBass,
          multiScale: st.tensionMultiScale,
          materialId: st.tensionMaterial,
          packId: st.tensionPackId,
          gauges: ensureSyncedGauges(st).map((x) => ({ ...x }))
        }
      });
    } else if (act === 'swapAB') {
      const curB = ensureSyncedCompareB(st);
      const snapA = {
        label: 'Setup B',
        tuningId: st.tuningId,
        stringsQ: [...st.customStringsQ],
        scalePresetId: st.tensionScalePresetId,
        scaleTrebleIn: st.tensionScaleTreble,
        scaleBassIn: st.tensionScaleBass,
        multiScale: st.tensionMultiScale,
        materialId: st.tensionMaterial,
        packId: st.tensionPackId,
        gauges: ensureSyncedGauges(st).map((x) => ({ ...x }))
      };
      setState({
        tuningId: curB.tuningId,
        stringCount: curB.stringsQ.length,
        customStringsQ: [...curB.stringsQ],
        tensionScalePresetId: curB.scalePresetId,
        tensionScaleTreble: curB.scaleTrebleIn,
        tensionScaleBass: curB.scaleBassIn,
        tensionMultiScale: curB.multiScale,
        tensionMaterial: curB.materialId,
        tensionPackId: curB.packId,
        tensionGauges: curB.gauges.map((x) => ({ ...x })),
        tensionCompareB: snapA
      });
    } else if (act === 'applyBtoA') {
      const curB = ensureSyncedCompareB(st);
      setState({
        tuningId: curB.tuningId,
        stringCount: curB.stringsQ.length,
        customStringsQ: [...curB.stringsQ],
        tensionScalePresetId: curB.scalePresetId,
        tensionScaleTreble: curB.scaleTrebleIn,
        tensionScaleBass: curB.scaleBassIn,
        tensionMultiScale: curB.multiScale,
        tensionMaterial: curB.materialId,
        tensionPackId: curB.packId,
        tensionGauges: curB.gauges.map((x) => ({ ...x }))
      });
      showToast(t(st.lang, 'toastAppliedB'), 'success');
    } else if (act === 'recommendB') {
      const curB = ensureSyncedCompareB(st);
      const recB = recommendBalancedGauges({
        stringsQ: curB.stringsQ,
        scaleTrebleIn: curB.scaleTrebleIn,
        scaleBassIn: curB.scaleBassIn,
        multiScale: curB.multiScale,
        materialId: curB.materialId,
        targetLbs: st.tensionTargetLbs,
        bassBiasLbs: 1.4
      });
      setState({
        tensionCompareB: { ...curB, packId: 'custom', gauges: recB }
      });
    } else if (act === 'copyABReport') {
      const curB = ensureSyncedCompareB(st);
      const cmp = compareTensionSetups(
        {
          stringsQ: st.customStringsQ,
          gauges: ensureSyncedGauges(st),
          scaleTrebleIn: st.tensionScaleTreble,
          scaleBassIn: st.tensionScaleBass,
          multiScale: st.tensionMultiScale,
          materialId: st.tensionMaterial
        },
        {
          stringsQ: curB.stringsQ,
          gauges: curB.gauges,
          scaleTrebleIn: curB.scaleTrebleIn,
          scaleBassIn: curB.scaleBassIn,
          multiScale: curB.multiScale,
          materialId: curB.materialId
        }
      );
      const tunB = findTuningById(curB.tuningId, st);
      const lines = [
        `String Atlas — Luthier A/B Tension Comparison`,
        `Setup A: ${getActiveTuning(st).short} | ${st.tensionMultiScale ? `${st.tensionScaleTreble}"–${st.tensionScaleBass}"` : `${st.tensionScaleTreble}"`} | Total ${cmp.calcA.totalLbs.toFixed(1)} lbs (${cmp.calcA.balanceScore}% bal)`,
        `Setup B: ${tunB ? tunB.short : 'Custom'} | ${curB.multiScale ? `${curB.scaleTrebleIn}"–${curB.scaleBassIn}"` : `${curB.scaleTrebleIn}"`} | Total ${cmp.calcB.totalLbs.toFixed(1)} lbs (${cmp.calcB.balanceScore}% bal)`,
        `Delta  : ${fmtDelta(cmp.deltaTotalLbs, 'lbs')} (${cmp.deltaTotalPct >= 0 ? '+' : ''}${cmp.deltaTotalPct.toFixed(1)}%) · ${trussLabel(st.lang, cmp.trussAdvisory)}`,
        ``,
        ...cmp.rows.map((r) => {
          const a = r.rowA ? `${r.rowA.noteName} ${r.rowA.gaugeCode} ${r.rowA.lbs.toFixed(1)}lb` : '—';
          const b = r.rowB ? `${r.rowB.noteName} ${r.rowB.gaugeCode} ${r.rowB.lbs.toFixed(1)}lb` : '—';
          const d = r.deltaLbs !== null ? fmtDelta(r.deltaLbs, 'lbs') : '—';
          return `S${r.guitarStr}: [A] ${a.padEnd(20)} | [B] ${b.padEnd(20)} | Δ ${d}`;
        })
      ];
      if (navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(lines.join('\n')).catch(() => {});
      }
      showToast(t(st.lang, 'tensCopiedSetup'), 'success');
    } else if (act === 'saveCustomTuning') {
      const inp = container.querySelector('#inpTensCustomTunName');
      const created = createCustomTuning({ name: inp?.value || '', stringsQ: st.customStringsQ });
      if (!created) return;
      const nextList = [created, ...(st.customTunings || []).filter((x) => x.short.toLowerCase() !== created.short.toLowerCase())].slice(0, 32);
      setState({
        customTunings: nextList,
        tuningId: created.id,
        stringCount: created.stringsQ.length,
        customStringsQ: [...created.stringsQ]
      });
      showToast(`${t(st.lang, 'toastScordSaved')}: ${created.short}`, 'success');
    } else if (act === 'setUnit') {
      setState({ tensionUnit: btn.dataset.val });
    } else if (act === 'toggleMultiScale') {
      const nextMs = !st.tensionMultiScale;
      const nextBass = nextMs && st.tensionScaleBass <= st.tensionScaleTreble
        ? Math.min(30, st.tensionScaleTreble + 1.5)
        : st.tensionScaleTreble;
      setState({ tensionMultiScale: nextMs, tensionScaleBass: nextBass });
    } else if (act === 'toggleWound') {
      const idx = Number(btn.dataset.idx);
      const cur = ensureSyncedGauges(st).map((x) => ({ ...x }));
      if (!cur[idx]) return;
      cur[idx].wound = !cur[idx].wound;
      setState({ tensionGauges: cur, tensionPackId: 'custom' });
    } else if (act === 'audition') {
      synthEngine.pluckQ(Number(btn.dataset.q), { duration: 1.8, velocity: 0.36 });
    } else if (act === 'tuneStep') {
      const idx = Number(btn.dataset.idx);
      const delta = Number(btn.dataset.delta);
      const updated = [...st.customStringsQ];
      updated[idx] = Math.max(46, Math.min(168, updated[idx] + delta));
      synthEngine.pluckQ(updated[idx], { duration: 1.4, velocity: 0.34 });
      setState({ customStringsQ: updated });
    } else if (act === 'recommendBalanced') {
      const rec = recommendBalancedGauges({
        stringsQ: st.customStringsQ,
        scaleTrebleIn: st.tensionScaleTreble,
        scaleBassIn: st.tensionScaleBass,
        multiScale: st.tensionMultiScale,
        materialId: st.tensionMaterial,
        targetLbs: st.tensionTargetLbs,
        bassBiasLbs: 1.4
      });
      setState({ tensionGauges: rec, tensionPackId: 'custom' });
    } else if (act === 'matchActivePack') {
      const pack = getDefaultPackForCount(st.customStringsQ.length, st.tuningId);
      setState({
        tensionPackId: pack.id,
        tensionGauges: pack.strings.map((x) => ({ ...x }))
      });
    } else if (act === 'copySetup') {
      const curCalc = calculateSetTension({
        stringsQ: st.customStringsQ,
        gauges: ensureSyncedGauges(st),
        scaleTrebleIn: st.tensionScaleTreble,
        scaleBassIn: st.tensionScaleBass,
        multiScale: st.tensionMultiScale,
        materialId: st.tensionMaterial
      });
      const lines = [
        `String Atlas — String Tension Setup`,
        `Tuning : ${getActiveTuning(st).namePt}`,
        `Scale  : ${st.tensionMultiScale ? `${st.tensionScaleTreble}" – ${st.tensionScaleBass}" (Multi-Scale)` : `${st.tensionScaleTreble}"`}`,
        `Total  : ${curCalc.totalLbs.toFixed(1)} lbs (${curCalc.totalKg.toFixed(1)} kg) · Balance ${curCalc.balanceScore}%`,
        `Gauges : ${curCalc.displayRows.map((r) => r.gaugeCode).join(' - ')}`,
        ``,
        ...curCalc.displayRows.map(
          (r) => `String ${r.guitarStr} (${r.noteName.padEnd(4)} / ${r.freqHz.toFixed(1).padStart(5)} Hz): ${r.gaugeCode} -> ${r.lbs.toFixed(1)} lbs (${r.kg.toFixed(2)} kg)`
        )
      ];
      if (navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(lines.join('\n')).catch(() => {});
      }
      showToast(t(st.lang, 'tensCopiedSetup'), 'success');
    }
  };
}
