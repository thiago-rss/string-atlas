/**
 * Interactive 22-Fret SVG Fretboard Renderer v2.0
 * - 3 Microtonal Modes: 'bend' (12-TET + ↑¼), 'slide' (midpoint diamonds), 'frets24' (quarter-tone frets)
 * - Spectral Harmonics Overlay (2nd–7th partials)
 * - Phase 2: Dynamic Voicing Overlay (highlighted rings + chord spine) & Phrase Scratchpad capture
 */
import {
  SPECTRAL_HARMONICS,
  mod24,
  qToFreq,
  qToNoteName,
  intervalQToLabel,
  intervalQToCents
} from '../core/theory24.js';
import { t } from '../core/i18n.js';
import { getActiveScale, getActiveVoicing, getState, setState } from '../state/store.js';
import { synthEngine } from '../audio/synthEngine.js';

const NUM_FRETS = 22;
const SVG_W = 1220;
const SVG_H = 266;
const NUT_X = 76;
const RIGHT_PAD = 24;
const TOP_Y = 38;
const STRING_GAP = 36;
const INLAY_FRETS = [3, 5, 7, 9, 12, 15, 17, 19, 21];

function buildFretXs() {
  const xs = [NUT_X];
  const usableW = SVG_W - NUT_X - RIGHT_PAD;
  let totalWeight = 0;
  const weights = [];
  for (let f = 1; f <= NUM_FRETS; f += 1) {
    const w = Math.pow(0.962, f - 1);
    weights.push(w);
    totalWeight += w;
  }
  let acc = NUT_X;
  for (let f = 1; f <= NUM_FRETS; f += 1) {
    acc += (weights[f - 1] / totalWeight) * usableW;
    xs.push(acc);
  }
  return xs;
}

const FRET_XS = buildFretXs();

function fretPosToX(pos) {
  if (pos <= 0) return NUT_X - 30;
  const fLow = Math.floor(pos);
  const frac = pos - fLow;
  if (fLow >= NUM_FRETS) return FRET_XS[NUM_FRETS];
  return FRET_XS[fLow] + (FRET_XS[fLow + 1] - FRET_XS[fLow]) * frac;
}

function fretCenterX(f) {
  if (f === 0) return NUT_X - 32;
  return (FRET_XS[f - 1] + FRET_XS[f]) / 2;
}

function stepQToX(stepQ, microMode) {
  if (stepQ === 0) return NUT_X - 32;
  const isMicro = stepQ % 2 !== 0;
  const fretNum = Math.floor(stepQ / 2);
  if (!isMicro) return fretCenterX(fretNum);
  if (microMode === 'bend') return fretCenterX(fretNum) + 4;
  if (microMode === 'slide') return FRET_XS[fretNum];
  const lowerWire = FRET_XS[fretNum];
  const microWire = (FRET_XS[fretNum] + FRET_XS[fretNum + 1]) / 2;
  return (lowerWire + microWire) / 2;
}

function getMarkerLabel(q, intervalQ, labelMode) {
  if (labelMode === 'degree') return intervalQToLabel(intervalQ);
  if (labelMode === 'cents') return `${intervalQToCents(intervalQ)}`;
  return qToNoteName(q, false);
}

export function renderFretboard(state) {
  const container = document.getElementById('fretboardContainer');
  const titleEl = document.getElementById('activeScaleTitle');
  const formulaEl = document.getElementById('activeFormulaTag');
  const legendEl = document.getElementById('fretboardLegend');
  if (!container) return;

  const scale = getActiveScale();
  const rootName = qToNoteName(state.rootQ, false);
  const scaleName = state.lang === 'en' ? scale.nameEn : scale.namePt;
  titleEl.textContent = `${rootName} ${scaleName}`;
  formulaEl.textContent = scale.intervalsQ.map((iv) => intervalQToLabel(iv)).join(' · ');

  const activeVoicing = state.voicingOverlayOn ? getActiveVoicing() : null;

  legendEl.innerHTML = `
    <span class="legend-item"><span class="legend-dot" style="background:var(--accent-root)"></span>${t(state.lang, 'legendRoot')}</span>
    <span class="legend-item"><span class="legend-dot" style="background:var(--accent-char)"></span>${t(state.lang, 'legendChar')}</span>
    <span class="legend-item"><span class="legend-dot" style="background:var(--accent-scale)"></span>${t(state.lang, 'legendScale')}</span>
    <span class="legend-item"><span class="legend-diamond" style="background:var(--accent-micro)"></span>${t(state.lang, 'legendMicro')}</span>
    ${activeVoicing ? `<span class="legend-item"><span class="legend-ring"></span>${t(state.lang, 'legendVoicing')}</span>` : ''}
    ${state.harmonicsOn ? `<span class="legend-item"><span class="legend-dot" style="background:var(--accent-harmonic)"></span>${t(state.lang, 'legendHarm')}</span>` : ''}
  `;

  const allowedMap = new Map();
  scale.intervalsQ.forEach((iv) => {
    allowedMap.set(mod24(state.rootQ + iv), iv);
  });
  const charSet = new Set(scale.characteristicQ || []);

  // Build quick lookup for active voicing notes: key = `${strIdx}:${stepQ}`
  const voicingMap = new Map();
  if (activeVoicing) {
    activeVoicing.notes.forEach((n) => {
      voicingMap.set(`${n.strIdx}:${n.stepQ}`, n);
    });
  }

  const parts = [];
  parts.push(`<svg class="fretboard-svg" viewBox="0 0 ${SVG_W} ${SVG_H}" role="img" aria-label="${rootName} ${scaleName}">`);

  // Fretboard wood & nut
  parts.push(`<rect x="${NUT_X}" y="${TOP_Y - 14}" width="${SVG_W - NUT_X - RIGHT_PAD}" height="${STRING_GAP * 5 + 28}" rx="4" fill="var(--bg-fretboard)"/>`);
  parts.push(`<rect x="${NUT_X - 7}" y="${TOP_Y - 14}" width="7" height="${STRING_GAP * 5 + 28}" fill="var(--bg-nut)"/>`);

  // Fret inlays
  const midY = TOP_Y + STRING_GAP * 2.5;
  INLAY_FRETS.forEach((f) => {
    const cx = fretCenterX(f);
    if (f === 12) {
      parts.push(`<circle cx="${cx}" cy="${TOP_Y + STRING_GAP * 1.5}" r="5.5" fill="var(--inlay-color)"/>`);
      parts.push(`<circle cx="${cx}" cy="${TOP_Y + STRING_GAP * 3.5}" r="5.5" fill="var(--inlay-color)"/>`);
    } else {
      parts.push(`<circle cx="${cx}" cy="${midY}" r="5.5" fill="var(--inlay-color)"/>`);
    }
  });

  // Semitone fret wires & numbers
  for (let f = 1; f <= NUM_FRETS; f += 1) {
    const x = FRET_XS[f];
    parts.push(`<line x1="${x}" y1="${TOP_Y - 14}" x2="${x}" y2="${TOP_Y + STRING_GAP * 5 + 14}" stroke="var(--fret-wire)" stroke-width="1.6"/>`);
    parts.push(`<text x="${fretCenterX(f)}" y="${SVG_H - 12}" text-anchor="middle" fill="var(--text-muted)" font-size="11" font-family="ui-monospace, monospace">${f}</text>`);

    if (state.microMode === 'frets24') {
      const microX = (FRET_XS[f - 1] + FRET_XS[f]) / 2;
      parts.push(`<line x1="${microX}" y1="${TOP_Y - 12}" x2="${microX}" y2="${TOP_Y + STRING_GAP * 5 + 12}" stroke="var(--fret-micro)" stroke-width="1.2" stroke-dasharray="4 4"/>`);
    }
  }

  // Strings (visIdx 0 = Str 1 high at top .. visIdx 5 = Str 6 low at bottom)
  for (let visIdx = 0; visIdx < 6; visIdx += 1) {
    const stringArrIdx = 5 - visIdx;
    const openQ = state.customStringsQ[stringArrIdx];
    const y = TOP_Y + visIdx * STRING_GAP;
    const strokeW = 1.2 + visIdx * 0.42;

    const openPc = mod24(openQ);
    const openInScale = allowedMap.has(openPc);

    parts.push(`<line x1="${NUT_X - 7}" y1="${y}" x2="${SVG_W - RIGHT_PAD}" y2="${y}" stroke="${openInScale ? 'var(--accent-open)' : 'var(--string-color)'}" stroke-width="${strokeW}" stroke-opacity="${openInScale ? '0.85' : '0.45'}"/>`);
    parts.push(`<text x="14" y="${y + 4}" fill="var(--text-muted)" font-size="10.5" font-family="ui-monospace, monospace">${visIdx + 1}</text>`);
  }

  // Optional subtle chord spine connecting active voicing notes before drawing note heads
  if (activeVoicing && activeVoicing.notes.length >= 2) {
    const pts = activeVoicing.notes
      .map((n) => {
        const visIdx = 5 - n.strIdx;
        const x = stepQToX(n.stepQ, state.microMode);
        const y = TOP_Y + visIdx * STRING_GAP;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');
    parts.push(`<polyline points="${pts}" fill="none" stroke="var(--accent-voicing)" stroke-width="3" stroke-opacity="0.48" stroke-linecap="round" stroke-linejoin="round"/>`);
  }

  // Draw Open Strings, Harmonics, Scale Nodes, and any out-of-scale Voicing Nodes
  for (let visIdx = 0; visIdx < 6; visIdx += 1) {
    const stringArrIdx = 5 - visIdx;
    const openQ = state.customStringsQ[stringArrIdx];
    const y = TOP_Y + visIdx * STRING_GAP;
    const openPc = mod24(openQ);
    const openInScale = allowedMap.has(openPc);
    const openIv = allowedMap.get(openPc);
    const isPlayingOpen = state.playingPcQ !== null && state.playingPcQ === openPc;
    const openInVoicing = voicingMap.has(`${stringArrIdx}:0`);

    const openFill = openInScale
      ? (openIv === 0 ? 'var(--accent-root)' : 'var(--accent-open)')
      : (openInVoicing ? 'var(--accent-voicing)' : 'var(--bg-elevated)');
    const openInk = (openInScale || openInVoicing) ? 'var(--accent-root-ink)' : 'var(--text-secondary)';
    const openLabel = qToNoteName(openQ, false);

    parts.push(`
      <g class="note-node ${isPlayingOpen ? 'is-playing' : ''}" data-kind="note" data-q="${openQ}" data-string="${visIdx + 1}" data-fret="0" data-iv="${openInScale ? openIv : (openInVoicing ? voicingMap.get(`${stringArrIdx}:0`).intervalQ : -1)}" data-micro="0">
        ${openInVoicing ? `<circle cx="${NUT_X - 32}" cy="${y}" r="17.5" fill="none" stroke="var(--accent-voicing)" stroke-width="2.6"/>` : ''}
        <circle cx="${NUT_X - 32}" cy="${y}" r="13.5" fill="${openFill}" stroke="${openInScale || openInVoicing ? 'none' : 'var(--border-strong)'}" stroke-width="1"/>
        <text x="${NUT_X - 32}" y="${y + 4}" text-anchor="middle" fill="${openInk}" font-size="10.5" font-weight="700">${openLabel}</text>
      </g>
    `);

    if (state.harmonicsOn) {
      SPECTRAL_HARMONICS.forEach((h) => {
        const hx = fretPosToX(h.fretPos);
        const hFreq = qToFreq(openQ) * h.ratio;
        parts.push(`
          <g class="note-node" data-kind="harmonic" data-freq="${hFreq.toFixed(3)}" data-partial="${h.partial}" data-ji="${h.jiCentsOffset}" data-string="${visIdx + 1}" data-fretpos="${h.fretPos}" data-openq="${openQ}">
            <circle cx="${hx}" cy="${y - 12}" r="7.5" fill="var(--accent-harmonic)" fill-opacity="0.92" stroke="#0d1017" stroke-width="1.2"/>
            <text x="${hx}" y="${y - 9}" text-anchor="middle" fill="#0c1220" font-size="8.5" font-weight="800">${h.partial}</text>
          </g>
        `);
      });
    }

    const maxStepQ = NUM_FRETS * 2;
    for (let stepQ = 1; stepQ <= maxStepQ; stepQ += 1) {
      const absQ = openQ + stepQ;
      const pc = mod24(absQ);
      const inScale = allowedMap.has(pc);
      const voicingHit = voicingMap.get(`${stringArrIdx}:${stepQ}`);
      if (!inScale && !voicingHit) continue;

      const intervalQ = inScale ? allowedMap.get(pc) : voicingHit.intervalQ;
      const isMicroStep = stepQ % 2 !== 0;
      const fretNum = Math.floor(stepQ / 2);

      if (isMicroStep && fretNum === 0 && state.microMode === 'bend') continue;

      const cx = stepQToX(stepQ, state.microMode);
      const isRoot = intervalQ === 0;
      const isChar = inScale && charSet.has(intervalQ);
      const isPlaying = state.playingPcQ !== null && state.playingPcQ === pc;

      let fill = 'var(--accent-scale)';
      let ink = 'var(--accent-scale-ink)';
      if (!inScale && voicingHit) {
        fill = 'var(--accent-voicing)';
        ink = '#111318';
      } else if (isRoot) {
        fill = 'var(--accent-root)';
        ink = 'var(--accent-root-ink)';
      } else if (isMicroStep) {
        fill = 'var(--accent-micro)';
        ink = 'var(--accent-micro-ink)';
      } else if (isChar) {
        fill = 'var(--accent-char)';
        ink = 'var(--accent-char-ink)';
      }

      const label = getMarkerLabel(absQ, intervalQ, state.labelMode);
      const fontSize = label.length >= 4 ? 8.4 : label.length === 3 ? 9.4 : 10.5;
      const dimClass = activeVoicing && !voicingHit ? 'is-dimmed' : '';

      parts.push(`<g class="note-node ${isPlaying ? 'is-playing' : ''} ${dimClass}" data-kind="note" data-q="${absQ}" data-string="${visIdx + 1}" data-fret="${isMicroStep ? `${fretNum}+¼` : fretNum}" data-iv="${intervalQ}" data-micro="${isMicroStep ? 1 : 0}">`);

      // Golden outer halo when note belongs to active Voicing
      if (voicingHit) {
        parts.push(`<circle cx="${cx}" cy="${y}" r="16.5" fill="none" stroke="var(--accent-voicing)" stroke-width="2.6"/>`);
      }

      if (isMicroStep && state.microMode === 'slide') {
        const r = 13;
        parts.push(`<polygon points="${cx},${y - r} ${cx + r},${y} ${cx},${y + r} ${cx - r},${y}" fill="${fill}" stroke="#0d1017" stroke-width="1.2"/>`);
        parts.push(`<text x="${cx}" y="${y + 3.5}" text-anchor="middle" fill="${ink}" font-size="${fontSize}" font-weight="700">${label}</text>`);
      } else if (isMicroStep && state.microMode === 'bend') {
        parts.push(`<rect x="${cx - 14}" y="${y - 12}" width="28" height="24" rx="7" fill="${fill}" stroke="#0d1017" stroke-width="1.2"/>`);
        parts.push(`<text x="${cx}" y="${y + 3.5}" text-anchor="middle" fill="${ink}" font-size="${fontSize}" font-weight="700">${label}</text>`);
        parts.push(`<text x="${cx + 12}" y="${y - 8}" text-anchor="middle" fill="var(--accent-micro)" font-size="8.5" font-weight="800">↑¼</text>`);
      } else {
        parts.push(`<circle cx="${cx}" cy="${y}" r="12.2" fill="${fill}" stroke="#0d1017" stroke-width="1.2"/>`);
        parts.push(`<text x="${cx}" y="${y + 3.5}" text-anchor="middle" fill="${ink}" font-size="${fontSize}" font-weight="700">${label}</text>`);
      }

      parts.push('</g>');
    }
  }

  parts.push('</svg>');
  container.innerHTML = parts.join('');

  const svgEl = container.querySelector('svg');
  svgEl.onclick = (ev) => {
    const node = ev.target.closest('.note-node');
    if (!node) return;

    const kind = node.dataset.kind;
    if (kind === 'harmonic') {
      const freq = Number(node.dataset.freq);
      const partial = Number(node.dataset.partial);
      const ji = Number(node.dataset.ji);
      const strNum = Number(node.dataset.string);
      const fretPos = node.dataset.fretpos;
      synthEngine.pluckFreq(freq, { duration: 2.2, velocity: 0.32, harmonicBell: true });
      setState({
        inspectedNote: { kind: 'harmonic', freq, partial, ji, stringNum: strNum, fretPos }
      });
      return;
    }

    const q = Number(node.dataset.q);
    const iv = Number(node.dataset.iv);
    const strNum = Number(node.dataset.string);
    const fret = node.dataset.fret;
    const isMicro = node.dataset.micro === '1';

    synthEngine.pluckQ(q, { duration: 1.7, velocity: 0.36 });

    // Append clicked note into Phrase Scratchpad (rolling window up to 16 events)
    const curState = getState();
    const nextPhrase = [
      ...curState.phraseEvents,
      { q, guitarStr: strNum, fret, isMicro, intervalQ: iv }
    ].slice(-16);

    setState({
      inspectedNote: {
        kind: 'note',
        q,
        freq: qToFreq(q),
        intervalQ: iv,
        stringNum: strNum,
        fret,
        isMicro
      },
      phraseEvents: nextPhrase
    });
  };

  renderInspector(state);
}

export function renderInspector(state) {
  const strip = document.getElementById('inspectorStrip');
  if (!strip) return;

  const info = state.inspectedNote;
  if (!info) {
    strip.innerHTML = `<span class="inspector-hint">${t(state.lang, 'inspectorHint')}</span>`;
    return;
  }

  if (info.kind === 'harmonic') {
    const sign = info.ji > 0 ? `+${info.ji}` : `${info.ji}`;
    strip.innerHTML = `
      <span class="inspector-kv">${t(state.lang, 'inspHarmonic')}: <strong>${info.partial}º</strong></span>
      <span class="inspector-kv">${t(state.lang, 'inspFreq')}: <strong>${info.freq.toFixed(2)} Hz</strong></span>
      <span class="inspector-kv">JI vs 12-TET: <strong>${sign}¢</strong></span>
      <span class="inspector-kv">${t(state.lang, 'inspPos')}: <strong>${t(state.lang, 'inspString')} ${info.stringNum} · ${t(state.lang, 'inspFret')} ~${info.fretPos}</strong></span>
    `;
    return;
  }

  const posText = info.fret === '0'
    ? `${t(state.lang, 'inspString')} ${info.stringNum} (${t(state.lang, 'inspOpen')})`
    : `${t(state.lang, 'inspString')} ${info.stringNum} · ${t(state.lang, 'inspFret')} ${info.fret}`;

  const degreeText = info.intervalQ >= 0 ? intervalQToLabel(info.intervalQ) : '—';
  const centsText = info.intervalQ >= 0 ? `${intervalQToCents(info.intervalQ)}¢` : '—';
  let microTip = '';
  if (info.isMicro) {
    const tipKey = state.microMode === 'bend' ? 'inspBendTip' : 'inspSlideTip';
    microTip = `<span class="soft-tag" style="color:var(--accent-micro);border-color:var(--accent-micro)">${t(state.lang, tipKey)}</span>`;
  }

  strip.innerHTML = `
    <span class="inspector-kv">${t(state.lang, 'inspNote')}: <strong>${qToNoteName(info.q, true)}</strong></span>
    <span class="inspector-kv">${t(state.lang, 'inspFreq')}: <strong>${info.freq.toFixed(2)} Hz</strong></span>
    <span class="inspector-kv">${t(state.lang, 'inspDegree')}: <strong>${degreeText}</strong></span>
    <span class="inspector-kv">${t(state.lang, 'inspCents')}: <strong>${centsText}</strong></span>
    <span class="inspector-kv">${t(state.lang, 'inspPos')}: <strong>${posText}</strong></span>
    ${microTip}
  `;
}
