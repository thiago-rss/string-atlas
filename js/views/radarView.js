/**
 * Phase 6 Modal Radar & Pivot-Modulation Explorer
 * - Interactive 24-TET Polar Pitch-Class Clock SVG (audition any pitch on click)
 * - Parallel 1–2 degree mutations (same root) & Structural Ghammaz/Pivot modulations
 * - Live Scale A vs. Scale B Comparison Overlay (both on Radar SVG and Fretboard SVG)
 * - 1-click "Send to Vamp Lab" bridge for instant modulation improvisation
 */
import { DB } from '../core/database.js';
import { NOTE_NAMES_24, mod24, qToNoteName } from '../core/theory24.js';
import {
  PIVOT_OFFSETS,
  compareScales24,
  findParallelMutations,
  findPivotModulations
} from '../core/modulationRadar.js';
import { t } from '../core/i18n.js';
import { getActiveScale, getState, setState } from '../state/store.js';
import { synthEngine } from '../audio/synthEngine.js';

function polarXY(cx, cy, r, idx24) {
  // 0 (C) at 12 o'clock (-90 deg), clockwise
  const angle = (-Math.PI / 2) + (idx24 / 24) * Math.PI * 2;
  return {
    x: cx + r * Math.cos(angle),
    y: cy + r * Math.sin(angle)
  };
}

function buildRadarSvg({ rootA, scaleA, compareTarget }) {
  const size = 340;
  const cx = 170;
  const cy = 170;
  const rOuter = 128;
  const rPoly = 104;
  const rLabel = 148;

  const setA = new Set(scaleA.intervalsQ.map((iv) => mod24(rootA + iv)));
  const setB = compareTarget
    ? new Set(compareTarget.scale.intervalsQ.map((iv) => mod24(compareTarget.rootQ + iv)))
    : null;

  const parts = [];
  parts.push(`<svg class="radar-svg" viewBox="0 0 ${size} ${size}" role="img" aria-label="24-TET Pitch Class Radar">`);
  parts.push(`
    <defs>
      <radialGradient id="saRadarDial" cx="50%" cy="44%" r="58%">
        <stop offset="0%" stop-color="var(--accent-root)" stop-opacity="0.09"/>
        <stop offset="55%" stop-color="var(--bg-panel)" stop-opacity="0.5"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="0.28"/>
      </radialGradient>
      <filter id="saRadarGlow" x="-25%" y="-25%" width="150%" height="150%">
        <feDropShadow dx="0" dy="0" stdDeviation="3.5" flood-color="var(--accent-scale)" flood-opacity="0.45"/>
      </filter>
    </defs>
  `);
  parts.push(`<circle cx="${cx}" cy="${cy}" r="${rOuter + 4}" fill="url(#saRadarDial)" stroke="var(--border-strong)" stroke-width="1.2"/>`);

  // Concentric reference rings
  parts.push(`<circle cx="${cx}" cy="${cy}" r="${rOuter}" fill="none" stroke="var(--border-strong)" stroke-width="1.2"/>`);
  parts.push(`<circle cx="${cx}" cy="${cy}" r="${rPoly}" fill="none" stroke="var(--border-subtle)" stroke-width="1" stroke-dasharray="3 3"/>`);
  parts.push(`<circle cx="${cx}" cy="${cy}" r="52" fill="none" stroke="var(--border-subtle)" stroke-width="0.9"/>`);

  // Radial ticks for all 24 quarter-tones
  for (let i = 0; i < 24; i += 1) {
    const isMicro = i % 2 !== 0;
    const p1 = polarXY(cx, cy, rOuter - (isMicro ? 5 : 9), i);
    const p2 = polarXY(cx, cy, rOuter, i);
    parts.push(`<line x1="${p1.x.toFixed(1)}" y1="${p1.y.toFixed(1)}" x2="${p2.x.toFixed(1)}" y2="${p2.y.toFixed(1)}" stroke="${isMicro ? 'var(--fret-micro)' : 'var(--border-strong)'}" stroke-width="${isMicro ? 1 : 1.4}"/>`);
  }

  // Scale A Polygon
  const orderedA = [...setA].sort((a, b) => a - b);
  if (orderedA.length >= 2) {
    const ptsA = orderedA.map((pc) => {
      const p = polarXY(cx, cy, rPoly, pc);
      return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
    }).join(' ');
    parts.push(`<polygon points="${ptsA}" fill="var(--accent-scale)" fill-opacity="0.2" stroke="var(--accent-scale)" stroke-width="2.3" filter="url(#saRadarGlow)"/>`);
  }

  // Optional Scale B Comparison Polygon
  if (setB) {
    const orderedB = [...setB].sort((a, b) => a - b);
    if (orderedB.length >= 2) {
      const ptsB = orderedB.map((pc) => {
        const p = polarXY(cx, cy, rPoly - 8, pc);
        return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
      }).join(' ');
      parts.push(`<polygon points="${ptsB}" fill="var(--accent-radar-b)" fill-opacity="0.16" stroke="var(--accent-radar-b)" stroke-width="2.2" stroke-dasharray="5 3"/>`);
    }
  }

  // 24 Clickable Pitch Nodes & Labels
  for (let pc = 0; pc < 24; pc += 1) {
    const inA = setA.has(pc);
    const inB = setB ? setB.has(pc) : false;
    const isRootA = pc === mod24(rootA);
    const isRootB = compareTarget ? pc === mod24(compareTarget.rootQ) : false;
    const isMicro = pc % 2 !== 0;

    const pNode = polarXY(cx, cy, rPoly, pc);
    const pLbl = polarXY(cx, cy, rLabel, pc);

    // Draw label for all 12-TET notes + any active 24-TET quarter-tones
    if (!isMicro || inA || inB) {
      const lblFill = isRootA
        ? 'var(--accent-root)'
        : (inA && inB ? 'var(--text-primary)' : (inB ? 'var(--accent-radar-b)' : (inA ? 'var(--accent-scale)' : 'var(--text-muted)')));
      parts.push(`<text x="${pLbl.x.toFixed(1)}" y="${(pLbl.y + 3.5).toFixed(1)}" text-anchor="middle" fill="${lblFill}" font-size="${isMicro ? 8.2 : 9.8}" font-weight="${inA || inB ? 700 : 500}" font-family="ui-monospace, monospace">${NOTE_NAMES_24[pc]}</text>`);
    }

    if (inA || inB) {
      let fill = 'var(--accent-scale)';
      let radius = 6.2;
      if (isRootA) {
        fill = 'var(--accent-root)';
        radius = 8.2;
      } else if (inA && inB) {
        fill = 'var(--accent-voicing)';
        radius = 7.4;
      } else if (inB) {
        fill = 'var(--accent-radar-b)';
        radius = 6.5;
      } else if (isMicro) {
        fill = 'var(--accent-micro)';
        radius = 6.8;
      }

      parts.push(`
        <g class="radar-node" data-radar-pc="${pc}" style="cursor:pointer">
          ${isRootB ? `<circle cx="${pNode.x.toFixed(1)}" cy="${pNode.y.toFixed(1)}" r="11" fill="none" stroke="var(--accent-radar-b)" stroke-width="2"/>` : ''}
          <circle cx="${pNode.x.toFixed(1)}" cy="${pNode.y.toFixed(1)}" r="${radius}" fill="${fill}" stroke="#0d1017" stroke-width="1.3"/>
        </g>
      `);
    } else if (!isMicro) {
      parts.push(`
        <circle class="radar-node" data-radar-pc="${pc}" cx="${pNode.x.toFixed(1)}" cy="${pNode.y.toFixed(1)}" r="3.2" fill="var(--border-strong)" style="cursor:pointer"/>
      `);
    }
  }

  // Center readout
  parts.push(`<text x="${cx}" y="${cy - 5}" text-anchor="middle" fill="var(--accent-root)" font-size="14" font-weight="800" font-family="ui-monospace, monospace">${qToNoteName(rootA, false)}</text>`);
  parts.push(`<text x="${cx}" y="${cy + 12}" text-anchor="middle" fill="var(--text-muted)" font-size="9.5" font-family="ui-monospace, monospace">24-TET</text>`);
  parts.push('</svg>');
  return parts.join('');
}

export function renderRadarView(state) {
  const container = document.getElementById('tabRadar');
  if (!container) return;

  const isEn = state.lang === 'en';
  const activeScale = getActiveScale();
  const rootName = qToNoteName(state.rootQ, false);
  const scaleName = isEn ? activeScale.nameEn : activeScale.namePt;

  const parallelList = findParallelMutations({
    rootQ: state.rootQ,
    scale: activeScale,
    allScales: DB.scales,
    limit: 8
  });

  const pivotList = findPivotModulations({
    rootQ: state.rootQ,
    scale: activeScale,
    allScales: DB.scales,
    pivotFilter: state.radarPivotFilter,
    limit: 10
  });

  // Resolve current comparison target if selected
  let compareTarget = null;
  if (state.radarCompareScaleId) {
    const found = DB.scales.find((s) => s.id === state.radarCompareScaleId);
    if (found) {
      compareTarget = { rootQ: state.radarCompareRootQ, scale: found };
    }
  }

  const compareStats = compareTarget
    ? compareScales24({
        rootA: state.rootQ,
        intervalsA: activeScale.intervalsQ,
        rootB: compareTarget.rootQ,
        intervalsB: compareTarget.scale.intervalsQ
      })
    : null;

  const pivotFilterBtns = [
    `<button type="button" class="btn-mini ${state.radarPivotFilter === 'all' ? 'active-mini' : ''}" data-rd-action="pivotFilter" data-val="all">${t(state.lang, 'rhythmFilterAll')}</button>`,
    ...PIVOT_OFFSETS.map((p) => `
      <button type="button" class="btn-mini ${state.radarPivotFilter === p.id ? 'active-mini' : ''}" data-rd-action="pivotFilter" data-val="${p.id}">
        ${isEn ? p.labelEn.split(' ')[0] : p.labelPt.split(' ')[0]}
      </button>
    `)
  ].join('');

  const renderCandidateCard = (item) => {
    const isComparing =
      compareTarget &&
      compareTarget.scale.id === item.targetScale.id &&
      compareTarget.rootQ === item.targetRootQ;
    const tName = isEn ? item.targetScale.nameEn : item.targetScale.namePt;

    const diffBadges = item.kind === 'parallel'
      ? `
        <div class="radar-diff-row">
          ${item.removedDegs.map((d) => `<span class="diff-chip is-rem">−${d}</span>`).join('')}
          ${item.addedDegs.map((d) => `<span class="diff-chip is-add">+${d}</span>`).join('')}
        </div>
      `
      : `
        <div class="radar-diff-row">
          <span class="soft-tag">${t(state.lang, 'radarPivotDeg')}: <strong>${item.pivotDegreeLabel}</strong></span>
          ${item.pivotInSource ? `<span class="micro-badge open">${t(state.lang, 'radarInScalePivot')}</span>` : ''}
        </div>
      `;

    return `
      <div class="radar-item-card ${isComparing ? 'is-selected' : ''}">
        <div class="radar-item-top">
          <strong>${item.targetRootName} ${tName}</strong>
          <span class="mono-tag" style="color:var(--accent-voicing)">${item.overlapPct}% (${item.sharedCount})</span>
        </div>
        ${diffBadges}
        <div class="pill-row" style="margin-top:4px">
          <button type="button" class="btn-mini ${isComparing ? 'active-mini' : ''}" data-rd-action="compare" data-scale="${item.targetScale.id}" data-root="${item.targetRootQ}">
            ${isComparing ? t(state.lang, 'radarComparing') : t(state.lang, 'radarCompareBtn')}
          </button>
          <button type="button" class="btn-mini" data-rd-action="load" data-scale="${item.targetScale.id}" data-root="${item.targetRootQ}">
            ${t(state.lang, 'radarLoadBtn')}
          </button>
          <button type="button" class="btn-mini" data-rd-action="sendVamp" data-scale="${item.targetScale.id}" data-root="${item.targetRootQ}">
            ${t(state.lang, 'radarSendVamp')}
          </button>
        </div>
      </div>
    `;
  };

  container.innerHTML = `
    <div class="panel">
      <div class="section-heading" style="flex-wrap:wrap">
        <span>${t(state.lang, 'radarTitle')}</span>
        <div class="pill-row">
          ${compareTarget ? `
            <button type="button" class="btn-pill ${state.radarOverlayOnNeck ? 'active-radar' : ''}" data-rd-action="toggleNeckCompare">
              ${state.radarOverlayOnNeck ? t(state.lang, 'radarNeckOverlayOn') : t(state.lang, 'radarNeckOverlayOff')}
            </button>
            <button type="button" class="btn-mini" data-rd-action="clearCompare">${t(state.lang, 'radarClearCompare')}</button>
          ` : ''}
        </div>
      </div>

      <div class="radar-layout">
        <!-- Left: 24-TET Polar Pitch-Class Circle -->
        <div class="radar-clock-panel">
          <div class="radar-clock-head">
            <strong>A: ${rootName} ${scaleName}</strong>
            ${compareTarget ? `<strong style="color:var(--accent-radar-b)">B: ${qToNoteName(compareTarget.rootQ, false)} ${isEn ? compareTarget.scale.nameEn : compareTarget.scale.namePt}</strong>` : ''}
          </div>

          ${buildRadarSvg({ rootA: state.rootQ, scaleA: activeScale, compareTarget })}

          ${compareStats ? `
            <div class="radar-compare-summary">
              <span class="soft-tag" style="color:var(--accent-voicing)">${t(state.lang, 'radarSharedPitches')}: <strong>${compareStats.sharedCount}</strong> (${compareStats.overlapPct}%)</span>
              <span class="soft-tag" style="color:var(--accent-radar-b)">${t(state.lang, 'radarNewPitches')}: <strong>${compareStats.onlyBPcs.map((pc) => NOTE_NAMES_24[pc]).join(' · ') || '—'}</strong></span>
            </div>
          ` : `<p class="empty-hint" style="text-align:center">${t(state.lang, 'radarClockHint')}</p>`}
        </div>

        <!-- Right: Parallel Mutations & Pivot Modulations -->
        <div class="radar-lists-col">
          <div class="radar-section">
            <div class="rhythm-track-head">
              <span class="control-label">${t(state.lang, 'radarParallelTitle')}</span>
              <span class="mono-tag">${t(state.lang, 'radarParallelHint')}</span>
            </div>
            <div class="radar-cards-grid">
              ${parallelList.map(renderCandidateCard).join('')}
            </div>
          </div>

          <div class="radar-section">
            <div class="rhythm-track-head" style="flex-wrap:wrap;gap:6px">
              <span class="control-label">${t(state.lang, 'radarPivotTitle')}</span>
              <div class="pill-row">${pivotFilterBtns}</div>
            </div>
            <div class="radar-cards-grid">
              ${pivotList.map(renderCandidateCard).join('')}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  container.onclick = (e) => {
    const node = e.target.closest('[data-radar-pc]');
    if (node) {
      const pc = Number(node.dataset.radarPc);
      synthEngine.pluckQ(96 + pc, { duration: 1.5, velocity: 0.35 });
      return;
    }

    const btn = e.target.closest('button[data-rd-action]');
    if (!btn) return;
    const act = btn.dataset.rdAction;
    const st = getState();

    if (act === 'pivotFilter') {
      setState({ radarPivotFilter: btn.dataset.val });
    } else if (act === 'compare') {
      const sid = btn.dataset.scale;
      const rq = Number(btn.dataset.root);
      const same = st.radarCompareScaleId === sid && st.radarCompareRootQ === rq;
      setState({
        radarCompareScaleId: same ? null : sid,
        radarCompareRootQ: same ? 0 : rq,
        radarOverlayOnNeck: !same
      });
    } else if (act === 'toggleNeckCompare') {
      setState({ radarOverlayOnNeck: !st.radarOverlayOnNeck });
    } else if (act === 'clearCompare') {
      setState({ radarCompareScaleId: null, radarOverlayOnNeck: false });
    } else if (act === 'load') {
      const sid = btn.dataset.scale;
      const rq = Number(btn.dataset.root);
      setState({
        category: 'all',
        temperamentFilter: 'all',
        scaleSearch: '',
        customScaleIntervalsQ: null,
        scaleId: sid,
        rootQ: rq,
        radarCompareScaleId: null,
        radarOverlayOnNeck: false,
        inspectedNote: null
      });
    } else if (act === 'sendVamp') {
      const targetScale = DB.scales.find((s) => s.id === btn.dataset.scale);
      if (!targetScale) return;
      const targetRootQ = Number(btn.dataset.root);
      const curScale = getActiveScale();
      const curRootName = qToNoteName(st.rootQ, false);
      const tgtRootName = qToNoteName(targetRootQ, false);
      const srcScaleId = curScale.id === '__custom_set__' ? 'maqam_bayati' : curScale.id;

      const vampSteps = [
        {
          label: `${curRootName} ${st.lang === 'en' ? curScale.nameEn : curScale.namePt}`,
          rootQ: st.rootQ,
          scaleId: srcScaleId,
          chordId: st.chordId,
          bars: 2
        },
        {
          label: `${tgtRootName} ${st.lang === 'en' ? targetScale.nameEn : targetScale.namePt}`,
          rootQ: targetRootQ,
          scaleId: targetScale.id,
          chordId: st.chordId,
          bars: 2
        }
      ];

      setState({
        vampSteps,
        vampActiveStepIdx: 0,
        activeTab: 'vamp'
      });
    }
  };
}
