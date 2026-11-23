/**
 * Luthier String Tension Calculator View (v7.3)
 * - Synced live with String Atlas active tuning (6, 7, or 8 strings + Fine Retuner 24-TET pitches)
 * - Supports Standard & Multi-Scale (Fanned Fret) lengths, 4 string materials, curated gauge packs,
 *   per-string gauge + Plain/Wound controls, live tension profile SVG chart, and Inverse Gauge Solver!
 */
import {
  COMMERCIAL_GAUGES,
  GAUGE_PACKS,
  IN_TO_MM,
  LBS_TO_KG,
  SCALE_PRESETS,
  STRING_MATERIALS,
  calculateSetTension,
  formatGaugeCode,
  getDefaultPackForCount,
  recommendBalancedGauges
} from '../core/tensionEngine.js';
import { t } from '../core/i18n.js';
import { getActiveTuning, getState, setState } from '../state/store.js';
import { synthEngine } from '../audio/synthEngine.js';

function ensureSyncedGauges(state) {
  const n = state.customStringsQ.length;
  if (Array.isArray(state.tensionGauges) && state.tensionGauges.length === n) {
    return state.tensionGauges;
  }
  const pack = getDefaultPackForCount(n, state.tuningId);
  return pack.strings.map((x) => ({ ...x }));
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

function buildTensionChartSvg(calc, unit, lang) {
  const rows = calc.displayRows; // String 1 (high) .. String N (low)
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

  // Shaded ideal comfort band (14.5 – 19.8 lbs)
  parts.push(`<rect x="${idealX1.toFixed(1)}" y="${padTop - 6}" width="${(idealX2 - idealX1).toFixed(1)}" height="${n * rowH + 10}" fill="var(--accent-live)" fill-opacity="0.11" stroke="var(--accent-live)" stroke-opacity="0.35" stroke-dasharray="4 3"/>`);
  parts.push(`<text x="${((idealX1 + idealX2) / 2).toFixed(1)}" y="14" text-anchor="middle" fill="var(--accent-live)" font-size="9.5" font-weight="700" font-family="var(--font-mono, monospace)">${t(lang, 'tensIdealZone')} (14.5–19.8 lbs)</text>`);

  // Vertical reference ticks
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
    parts.push(`<text x="${(padL + barW + 8).toFixed(1)}" y="${y + 15}" fill="var(--text-primary)" font-size="10.2" font-weight="700" font-family="var(--font-mono, monospace)">${fmtTension(r.lbs, unit)}</text>`);
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
  const unit = state.tensionUnit || 'lbs';

  const calc = calculateSetTension({
    stringsQ: state.customStringsQ,
    gauges,
    scaleTrebleIn: state.tensionScaleTreble,
    scaleBassIn: state.tensionScaleBass,
    multiScale: state.tensionMultiScale,
    materialId: state.tensionMaterial
  });

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
    ? `${state.tensionScaleTreble.toFixed(2)}" – ${state.tensionScaleBass.toFixed(2)}"`
    : `${state.tensionScaleTreble.toFixed(2)}" (${Math.round(state.tensionScaleTreble * IN_TO_MM)} mm)`;

  container.innerHTML = `
    <div class="panel">
      <div class="section-heading" style="flex-wrap:wrap">
        <span>${t(state.lang, 'tensTitle')}</span>
        <div class="pill-row">
          <button type="button" class="btn-mini ${unit === 'lbs' ? 'active-mini' : ''}" data-ts-action="setUnit" data-val="lbs">lbs</button>
          <button type="button" class="btn-mini ${unit === 'kg' ? 'active-mini' : ''}" data-ts-action="setUnit" data-val="kg">kg</button>
          <button type="button" class="btn-mini" id="btnCopyTensionSetup" data-ts-action="copySetup">${t(state.lang, 'tensCopySetup')}</button>
        </div>
      </div>

      <!-- Configuration Grid -->
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
          <strong class="tension-kpi-val" style="font-size:1.05rem">${activeTuning.short}</strong>
          <span class="mono-tag">${calc.displayRows.map((r) => r.gaugeCode).join(' · ')}</span>
        </div>
      </div>

      <!-- Visual Tension Profile SVG -->
      <div class="tension-chart-wrap">
        ${buildTensionChartSvg(calc, unit, state.lang)}
      </div>

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

      <p class="empty-hint" style="margin-top:10px">${t(state.lang, 'tensPhysicsNote')}</p>
    </div>
  `;

  // Bind preset selects & numeric inputs
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

  // Per-string gauge dropdowns
  container.onchange = (e) => {
    const sel = e.target.closest('select[data-ts-gauge]');
    if (!sel) return;
    const idx = Number(sel.dataset.tsGauge);
    const nextG = Number(sel.value);
    const st = getState();
    const cur = ensureSyncedGauges(st).map((x) => ({ ...x }));
    if (!cur[idx]) return;
    cur[idx].gauge = nextG;
    // Smart auto-flip Plain/Wound if user jumps clearly past crossover
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

    if (act === 'setUnit') {
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
        `Tuning : ${getActiveTuning().namePt}`,
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
      const orig = btn.textContent;
      btn.textContent = t(st.lang, 'tensCopiedSetup');
      setTimeout(() => { btn.textContent = orig; }, 1600);
    }
  };
}
