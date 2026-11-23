/**
 * Interactive Luthier-Grade Living SVG Fretboard Renderer v8.1
 * - Dual Orientation: Classic Horizontal (desktop/landscape) & Native Vertical Neck (portrait mobile / toggle)
 * - Dynamic 6, 7, or 8 strings + 22-Fret Full View or 12-Fret Zoom View + Left-Handed Flip
 * - Full 24-TET Microtonal Modes, Arbitrary Scala (.scl) ±¢ Overlay, Spectral Harmonics,
 *   Voicing Spine, Closed-Position Window, Radar Scale B, Living String Vibration & Hover Octave Pulse.
 */
import { DB } from '../core/database.js';
import { getThemeById } from '../core/themes.js';
import { getScalaPresetById, mapScalaToFretboard, parseSclText } from '../core/scalaEngine.js';
import {
  SPECTRAL_HARMONICS,
  mod24,
  qToFreq,
  qToNoteName,
  intervalQToLabel,
  intervalQToCents
} from '../core/theory24.js';
import { t } from '../core/i18n.js';
import {
  getActiveScale,
  getActiveVoicing,
  getEffectiveFretZoom,
  getEffectiveOrientation,
  getState,
  setState
} from '../state/store.js';
import { synthEngine } from '../audio/synthEngine.js';

const SVG_H_W = 1240;
const NUT_X_H = 86;
const RIGHT_PAD_H = 24;
const TOP_Y_H = 44;
const STRING_GAP_H = 36;

const NUT_Y_V = 68;
const BOTTOM_PAD_V = 28;
const LEFT_PAD_V = 46;
const RIGHT_PAD_V = 32;

const INLAY_FRETS = [3, 5, 7, 9, 12, 15, 17, 19, 21];
const INLAY_SET = new Set(INLAY_FRETS);

function buildFretPositions(startPos, usableSpan, maxFrets) {
  const arr = [startPos];
  const decay = maxFrets <= 12 ? 0.968 : 0.958;
  let totalWeight = 0;
  const weights = [];
  for (let f = 1; f <= maxFrets; f += 1) {
    const w = Math.pow(decay, f - 1);
    weights.push(w);
    totalWeight += w;
  }
  let acc = startPos;
  for (let f = 1; f <= maxFrets; f += 1) {
    acc += (weights[f - 1] / totalWeight) * usableSpan;
    arr.push(acc);
  }
  return arr;
}

const FRET_XS_H22 = buildFretPositions(NUT_X_H, SVG_H_W - NUT_X_H - RIGHT_PAD_H, 22);
const FRET_XS_H12 = buildFretPositions(NUT_X_H, SVG_H_W - NUT_X_H - RIGHT_PAD_H, 12);
const FRET_YS_V22 = buildFretPositions(NUT_Y_V, 980, 22);
const FRET_YS_V12 = buildFretPositions(NUT_Y_V, 556, 12);

/**
 * Unified Dual-Orientation Geometry Provider (Horizontal & Vertical)
 */
function getBoardLayout(state, numStrings) {
  const isVertical = getEffectiveOrientation(state) === 'vertical';
  const maxFrets = getEffectiveFretZoom(state);
  const leftHanded = Boolean(state.leftHanded);

  if (isVertical) {
    const strGap = numStrings <= 6 ? 44 : (numStrings === 7 ? 40 : 36);
    const svgW = LEFT_PAD_V + (numStrings - 1) * strGap + RIGHT_PAD_V;
    const fretArr = maxFrets === 12 ? FRET_YS_V12 : FRET_YS_V22;
    const boardLen = fretArr[maxFrets] - NUT_Y_V;
    const svgH = fretArr[maxFrets] + BOTTOM_PAD_V;
    const boardLeft = LEFT_PAD_V - 18;
    const boardW = (numStrings - 1) * strGap + 36;

    // Right-handed vertical: lowest bass string (strIdx=0) on LEFT -> highest treble string (strIdx=N-1) on RIGHT
    const stringX = (strIdx) => {
      const col = leftHanded ? (numStrings - 1 - strIdx) : strIdx;
      return LEFT_PAD_V + col * strGap;
    };

    const fretCenter = (f) => (f === 0 ? NUT_Y_V - 30 : (fretArr[f - 1] + fretArr[f]) / 2);
    const fretFloatPos = (pos) => {
      if (pos <= 0) return NUT_Y_V - 30;
      const fLow = Math.floor(pos);
      const frac = pos - fLow;
      if (fLow >= maxFrets) return fretArr[maxFrets];
      return fretArr[fLow] + (fretArr[fLow + 1] - fretArr[fLow]) * frac;
    };
    const stepQPos = (stepQ, microMode) => {
      if (stepQ === 0) return NUT_Y_V - 30;
      const isMicro = stepQ % 2 !== 0;
      const fNum = Math.floor(stepQ / 2);
      if (!isMicro) return fretCenter(fNum);
      if (microMode === 'bend') return fretCenter(fNum) + 4;
      if (microMode === 'slide') return fretArr[fNum];
      const lowerWire = fretArr[fNum];
      const microWire = (fretArr[fNum] + fretArr[fNum + 1]) / 2;
      return (lowerWire + microWire) / 2;
    };

    return {
      isVertical: true,
      maxFrets,
      leftHanded,
      numStrings,
      strGap,
      svgW,
      svgH,
      fretArr,
      boardLeft,
      boardW,
      boardLen,
      nutPos: NUT_Y_V,
      stringCoord: stringX,
      fretCenter,
      fretFloatPos,
      stepQPos,
      pointFromStepQ: (strIdx, stepQ, microMode) => ({
        x: stringX(strIdx),
        y: stepQPos(stepQ, microMode)
      }),
      pointFromFretFloat: (strIdx, fretPos) => ({
        x: stringX(strIdx),
        y: fretFloatPos(fretPos)
      })
    };
  }

  // Horizontal layout
  const svgW = SVG_H_W;
  const svgH = TOP_Y_H + (numStrings - 1) * STRING_GAP_H + 54;
  const fretArr = maxFrets === 12 ? FRET_XS_H12 : FRET_XS_H22;
  const boardTop = TOP_Y_H - 16;
  const boardH = STRING_GAP_H * (numStrings - 1) + 32;
  const boardW = SVG_H_W - NUT_X_H - RIGHT_PAD_H;

  const tx = (x) => (leftHanded ? SVG_H_W - x : x);
  const txRect = (x, w) => (leftHanded ? SVG_H_W - x - w : x);

  // Horizontal: highest treble string (strIdx=N-1, visIdx=0) at TOP -> lowest bass string (strIdx=0) at BOTTOM
  const stringY = (strIdx) => TOP_Y_H + ((numStrings - 1) - strIdx) * STRING_GAP_H;
  const fretCenterRaw = (f) => (f === 0 ? NUT_X_H - 38 : (fretArr[f - 1] + fretArr[f]) / 2);
  const fretFloatRaw = (pos) => {
    if (pos <= 0) return NUT_X_H - 38;
    const fLow = Math.floor(pos);
    const frac = pos - fLow;
    if (fLow >= maxFrets) return fretArr[maxFrets];
    return fretArr[fLow] + (fretArr[fLow + 1] - fretArr[fLow]) * frac;
  };
  const stepQRaw = (stepQ, microMode) => {
    if (stepQ === 0) return NUT_X_H - 38;
    const isMicro = stepQ % 2 !== 0;
    const fNum = Math.floor(stepQ / 2);
    if (!isMicro) return fretCenterRaw(fNum);
    if (microMode === 'bend') return fretCenterRaw(fNum) + 4;
    if (microMode === 'slide') return fretArr[fNum];
    const lowerWire = fretArr[fNum];
    const microWire = (fretArr[fNum] + fretArr[fNum + 1]) / 2;
    return (lowerWire + microWire) / 2;
  };

  return {
    isVertical: false,
    maxFrets,
    leftHanded,
    numStrings,
    strGap: STRING_GAP_H,
    svgW,
    svgH,
    fretArr,
    boardTop,
    boardH,
    boardW,
    nutPos: NUT_X_H,
    tx,
    txRect,
    stringCoord: stringY,
    fretCenter: (f) => tx(fretCenterRaw(f)),
    fretFloatPos: (pos) => tx(fretFloatRaw(pos)),
    stepQPos: (stepQ, microMode) => tx(stepQRaw(stepQ, microMode)),
    pointFromStepQ: (strIdx, stepQ, microMode) => ({
      x: tx(stepQRaw(stepQ, microMode)),
      y: stringY(strIdx)
    }),
    pointFromFretFloat: (strIdx, fretPos) => ({
      x: tx(fretFloatRaw(fretPos)),
      y: stringY(strIdx)
    })
  };
}

function getMarkerLabel(q, intervalQ, labelMode) {
  if (labelMode === 'degree') return intervalQToLabel(intervalQ);
  if (labelMode === 'cents') return `${intervalQToCents(intervalQ)}`;
  return qToNoteName(q, false);
}

/**
 * Fires a damped physical string vibration + luminous SVG ripple wave in either orientation.
 */
export function triggerFretboardStringPluck({ strIdx, x, y, color = 'var(--accent-root)' }) {
  const svg = document.querySelector('#fretboardContainer svg');
  if (!svg) return;

  const isVert = svg.dataset.orientation === 'vertical';
  const vibeCls = isVert ? 'is-vibrating-v' : 'is-vibrating';
  const wire = svg.querySelector(`.sa-string-wire[data-str-idx="${strIdx}"]`);
  if (wire) {
    wire.classList.remove('is-vibrating', 'is-vibrating-v');
    void wire.getBoundingClientRect();
    wire.classList.add(vibeCls);
  }

  const layer = svg.querySelector('#fxPulseLayer');
  if (!layer) return;
  const ns = 'http://www.w3.org/2000/svg';
  const ring = document.createElementNS(ns, 'circle');
  ring.setAttribute('cx', x.toFixed(1));
  ring.setAttribute('cy', y.toFixed(1));
  ring.setAttribute('r', '14');
  ring.setAttribute('fill', 'none');
  ring.setAttribute('stroke', color);
  ring.setAttribute('stroke-width', '2.8');
  ring.setAttribute('class', 'sa-pluck-ripple');
  layer.appendChild(ring);
  setTimeout(() => {
    ring.remove();
  }, 520);
}

function buildFretboardDefs(fbSkin, isVertical) {
  const [w0, w1, w2] = fbSkin.woodStops;
  const [n0, n1, n2] = fbSkin.nutStops;
  const [f0, f1, f2] = fbSkin.fretStops;

  // Wood radius curvature runs perpendicular to the strings
  const woodCoords = isVertical ? 'x1="0" y1="0" x2="1" y2="0"' : 'x1="0" y1="0" x2="0" y2="1"';
  const nutCoords = isVertical ? 'x1="0" y1="0" x2="0" y2="1"' : 'x1="0" y1="0" x2="1" y2="0"';
  const vigCoords = isVertical ? 'x1="0" y1="0" x2="1" y2="0"' : 'x1="0" y1="0" x2="0" y2="1"';

  let surfacePattern = '';
  if (fbSkin.grainStyle === 'carbon') {
    surfacePattern = `
      <pattern id="saBoardTexture" width="12" height="12" patternUnits="userSpaceOnUse">
        <rect width="6" height="6" fill="${fbSkin.grainColor}"/>
        <rect x="6" y="6" width="6" height="6" fill="${fbSkin.grainColor}"/>
        <path d="M0 12 L12 0 M-3 3 L3 -3 M9 15 L15 9" stroke="rgba(255,255,255,0.035)" stroke-width="1"/>
      </pattern>
    `;
  } else if (fbSkin.grainStyle === 'kintsugi') {
    surfacePattern = isVertical
      ? `
        <pattern id="saBoardTexture" width="44" height="190" patternUnits="userSpaceOnUse">
          <path d="M8 0 Q 4 50, 9 95 T 7 190" fill="none" stroke="${fbSkin.grainColor}" stroke-width="1.3"/>
          <path d="M22 0 Q 26 60, 21 125 T 23 190" fill="none" stroke="${fbSkin.grainColor}" stroke-width="1.1"/>
          <path d="M36 0 Q 33 45, 37 100 T 35 190" fill="none" stroke="${fbSkin.grainColor}" stroke-width="1.2"/>
          <path d="M0 38 L14 56 L11 82 L28 106 L44 128" fill="none" stroke="rgba(248,208,108,0.42)" stroke-width="1.35" stroke-linejoin="round"/>
          <path d="M11 82 L2 110" fill="none" stroke="rgba(248,208,108,0.3)" stroke-width="0.9"/>
        </pattern>
      `
      : `
        <pattern id="saBoardTexture" width="190" height="44" patternUnits="userSpaceOnUse">
          <path d="M0 8 Q 50 4, 95 9 T 190 7" fill="none" stroke="${fbSkin.grainColor}" stroke-width="1.3"/>
          <path d="M0 22 Q 60 26, 125 21 T 190 23" fill="none" stroke="${fbSkin.grainColor}" stroke-width="1.1"/>
          <path d="M0 36 Q 45 33, 100 37 T 190 35" fill="none" stroke="${fbSkin.grainColor}" stroke-width="1.2"/>
          <path d="M38 0 L56 14 L82 11 L106 28 L128 44" fill="none" stroke="rgba(248,208,108,0.42)" stroke-width="1.35" stroke-linejoin="round"/>
          <path d="M82 11 L110 2" fill="none" stroke="rgba(248,208,108,0.3)" stroke-width="0.9"/>
        </pattern>
      `;
  } else if (fbSkin.grainStyle === 'matte') {
    surfacePattern = `
      <pattern id="saBoardTexture" width="24" height="24" patternUnits="userSpaceOnUse">
        <circle cx="12" cy="12" r="0.8" fill="${fbSkin.grainColor}"/>
        <line x1="0" y1="0" x2="24" y2="0" stroke="rgba(255,255,255,0.025)" stroke-width="0.6"/>
      </pattern>
    `;
  } else if (isVertical) {
    surfacePattern = `
      <pattern id="saBoardTexture" width="36" height="180" patternUnits="userSpaceOnUse">
        <path d="M6 0 Q 2 45, 7 90 T 6 180" fill="none" stroke="${fbSkin.grainColor}" stroke-width="1.6"/>
        <path d="M15 0 Q 19 60, 14 120 T 16 180" fill="none" stroke="${fbSkin.grainColor}" stroke-width="1.1"/>
        <path d="M24 0 Q 21 40, 26 95 T 23 180" fill="none" stroke="${fbSkin.grainColor}" stroke-width="1.8"/>
        <path d="M32 0 Q 35 55, 31 130 T 33 180" fill="none" stroke="${fbSkin.grainColor}" stroke-width="0.9"/>
      </pattern>
    `;
  } else {
    surfacePattern = `
      <pattern id="saBoardTexture" width="180" height="36" patternUnits="userSpaceOnUse">
        <path d="M0 6 Q 45 2, 90 7 T 180 6" fill="none" stroke="${fbSkin.grainColor}" stroke-width="1.6"/>
        <path d="M0 15 Q 60 19, 120 14 T 180 16" fill="none" stroke="${fbSkin.grainColor}" stroke-width="1.1"/>
        <path d="M0 24 Q 40 21, 95 26 T 180 23" fill="none" stroke="${fbSkin.grainColor}" stroke-width="1.8"/>
        <path d="M0 32 Q 55 35, 130 31 T 180 33" fill="none" stroke="${fbSkin.grainColor}" stroke-width="0.9"/>
      </pattern>
    `;
  }

  return `
    <defs>
      <linearGradient id="saWoodGrad" ${woodCoords}>
        <stop offset="0%" stop-color="${w0}"/>
        <stop offset="48%" stop-color="${w1}"/>
        <stop offset="100%" stop-color="${w2}"/>
      </linearGradient>

      <linearGradient id="saNutGrad" ${nutCoords}>
        <stop offset="0%" stop-color="${n0}"/>
        <stop offset="45%" stop-color="${n1}"/>
        <stop offset="100%" stop-color="${n2}"/>
      </linearGradient>

      <linearGradient id="saFretGrad" ${nutCoords}>
        <stop offset="0%" stop-color="${f0}"/>
        <stop offset="50%" stop-color="${f1}"/>
        <stop offset="100%" stop-color="${f2}"/>
      </linearGradient>

      <radialGradient id="saPearlGrad" cx="35%" cy="30%" r="70%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.95"/>
        <stop offset="65%" stop-color="${fbSkin.inlayFill === 'none' ? '#ffffff' : fbSkin.inlayFill}" stop-opacity="0.88"/>
        <stop offset="100%" stop-color="${fbSkin.inlayFill === 'none' ? '#cccccc' : fbSkin.inlayFill}" stop-opacity="0.58"/>
      </radialGradient>

      <linearGradient id="saNeckSheen" x1="0" y1="0" x2="1" y2="0.85">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.06"/>
        <stop offset="32%" stop-color="#ffffff" stop-opacity="0.0"/>
        <stop offset="52%" stop-color="#ffffff" stop-opacity="0.075"/>
        <stop offset="72%" stop-color="#000000" stop-opacity="0.04"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="0.16"/>
      </linearGradient>

      <linearGradient id="saNeckVignette" ${vigCoords}>
        <stop offset="0%" stop-color="#000000" stop-opacity="0.34"/>
        <stop offset="14%" stop-color="#000000" stop-opacity="0"/>
        <stop offset="86%" stop-color="#000000" stop-opacity="0"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="0.38"/>
      </linearGradient>

      <radialGradient id="saJewelGloss" cx="32%" cy="26%" r="72%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.52"/>
        <stop offset="38%" stop-color="#ffffff" stop-opacity="0.14"/>
        <stop offset="78%" stop-color="#000000" stop-opacity="0.06"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="0.34"/>
      </radialGradient>

      <filter id="saNoteShadow" x="-35%" y="-35%" width="170%" height="170%">
        <feDropShadow dx="0" dy="2.5" stdDeviation="2.6" flood-color="#000000" flood-opacity="0.62"/>
      </filter>

      ${surfacePattern}
    </defs>
  `;
}

function renderInlayGlyph(style, fbSkin, cx, cy, spanSize, isDouble = false, isVertical = false, boardBounds = {}) {
  if (style === 'offset_block') {
    if (isVertical) {
      const w = (boardBounds.boardW || 240) * (isDouble ? 0.6 : 0.48);
      const h = Math.min(20, spanSize * 0.46);
      return `
        <rect x="${(cx - w / 2).toFixed(1)}" y="${(cy - h / 2).toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" rx="2.5" fill="url(#saPearlGrad)" fill-opacity="0.34" stroke="${fbSkin.inlayStroke}" stroke-width="1.1"/>
        <rect x="${(cx - w / 2 + 3).toFixed(1)}" y="${(cy - h / 2 + 3).toFixed(1)}" width="${Math.max(4, w - 6).toFixed(1)}" height="${Math.max(3, h - 6).toFixed(1)}" rx="1.2" fill="none" stroke="#93c5fd" stroke-opacity="0.45" stroke-width="0.8"/>
      `;
    }
    const h = (boardBounds.boardH || 210) * (isDouble ? 0.6 : 0.48);
    const w = Math.min(24, spanSize * 0.48);
    return `
      <rect x="${(cx - w / 2).toFixed(1)}" y="${(cy - h / 2).toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" rx="2.5" fill="url(#saPearlGrad)" fill-opacity="0.34" stroke="${fbSkin.inlayStroke}" stroke-width="1.1"/>
      <rect x="${(cx - w / 2 + 3).toFixed(1)}" y="${(cy - h / 2 + 3).toFixed(1)}" width="${Math.max(3, w - 6).toFixed(1)}" height="${Math.max(4, h - 6).toFixed(1)}" rx="1.2" fill="none" stroke="#93c5fd" stroke-opacity="0.45" stroke-width="0.8"/>
    `;
  }

  if (style === 'archtop_split_block') {
    if (isVertical) {
      const w = (boardBounds.boardW || 240) * (isDouble ? 0.6 : 0.5);
      const h = Math.min(20, spanSize * 0.44);
      const x1 = cx - w / 2;
      const y1 = cy - h / 2;
      return `
        <rect x="${x1.toFixed(1)}" y="${y1.toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" rx="1.5" fill="url(#saPearlGrad)" fill-opacity="0.32" stroke="${fbSkin.inlayStroke}" stroke-width="1"/>
        <polygon points="${(cx - w * 0.14).toFixed(1)},${y1.toFixed(1)} ${(cx + w * 0.14).toFixed(1)},${(y1 + h).toFixed(1)} ${(cx - w * 0.04).toFixed(1)},${(y1 + h).toFixed(1)} ${(cx - w * 0.24).toFixed(1)},${y1.toFixed(1)}" fill="#e8a845" fill-opacity="0.45"/>
        <line x1="${(cx - w * 0.08).toFixed(1)}" y1="${y1.toFixed(1)}" x2="${(cx + w * 0.08).toFixed(1)}" y2="${(y1 + h).toFixed(1)}" stroke="#0c0e14" stroke-opacity="0.7" stroke-width="1.4"/>
      `;
    }
    const h = (boardBounds.boardH || 210) * (isDouble ? 0.6 : 0.5);
    const w = Math.min(22, spanSize * 0.44);
    const x1 = cx - w / 2;
    const y1 = cy - h / 2;
    return `
      <rect x="${x1.toFixed(1)}" y="${y1.toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" rx="1.5" fill="url(#saPearlGrad)" fill-opacity="0.32" stroke="${fbSkin.inlayStroke}" stroke-width="1"/>
      <polygon points="${x1.toFixed(1)},${(cy - h * 0.14).toFixed(1)} ${(x1 + w).toFixed(1)},${(cy + h * 0.14).toFixed(1)} ${(x1 + w).toFixed(1)},${(cy - h * 0.02).toFixed(1)} ${x1.toFixed(1)},${(cy - h * 0.24).toFixed(1)}" fill="#e8a845" fill-opacity="0.45"/>
      <line x1="${x1.toFixed(1)}" y1="${(cy - h * 0.08).toFixed(1)}" x2="${(x1 + w).toFixed(1)}" y2="${(cy + h * 0.08).toFixed(1)}" stroke="#0c0e14" stroke-opacity="0.7" stroke-width="1.4"/>
    `;
  }

  if (style === 'kintsugi_vein') {
    const s = Math.min(12, spanSize * 0.3);
    return `
      <g transform="translate(${cx.toFixed(1)},${cy.toFixed(1)})">
        <path d="M${(-s).toFixed(1)} ${(-s * 0.55).toFixed(1)} L${(-s * 0.2).toFixed(1)} ${(s * 0.1).toFixed(1)} L${(s * 0.35).toFixed(1)} ${(-s * 0.2).toFixed(1)} L${s.toFixed(1)} ${(s * 0.55).toFixed(1)}" fill="none" stroke="${fbSkin.inlayStroke}" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M${(-s).toFixed(1)} ${(-s * 0.55).toFixed(1)} L${(-s * 0.2).toFixed(1)} ${(s * 0.1).toFixed(1)} L${(s * 0.35).toFixed(1)} ${(-s * 0.2).toFixed(1)} L${s.toFixed(1)} ${(s * 0.55).toFixed(1)}" fill="none" stroke="${fbSkin.inlayFill}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="0" cy="0" r="2.2" fill="#c23b2b" fill-opacity="0.85"/>
      </g>
    `;
  }

  if (style === 'vintage_trapezoid' || style === 'offset_block' || style === 'archtop_split_block') {
    if (isVertical) {
      const w = (boardBounds.boardW || 240) * (isDouble ? 0.56 : 0.46);
      const hTop = Math.min(18, spanSize * 0.36);
      const hBot = Math.min(24, spanSize * 0.48);
      return `<polygon points="${(cx - w / 2).toFixed(1)},${(cy - hTop / 2).toFixed(1)} ${(cx + w / 2).toFixed(1)},${(cy - hBot / 2).toFixed(1)} ${(cx + w / 2).toFixed(1)},${(cy + hBot / 2).toFixed(1)} ${(cx - w / 2).toFixed(1)},${(cy + hTop / 2).toFixed(1)}" fill="url(#saPearlGrad)" fill-opacity="0.32" stroke="${fbSkin.inlayStroke}" stroke-width="1"/>`;
    }
    const h = (boardBounds.boardH || 210) * (isDouble ? 0.56 : 0.48);
    const wTop = Math.min(22, spanSize * 0.42);
    const wBot = Math.min(28, spanSize * 0.54);
    return `<polygon points="${(cx - wTop / 2).toFixed(1)},${(cy - h / 2).toFixed(1)} ${(cx + wTop / 2).toFixed(1)},${(cy - h / 2).toFixed(1)} ${(cx + wBot / 2).toFixed(1)},${(cy + h / 2).toFixed(1)} ${(cx - wBot / 2).toFixed(1)},${(cy + h / 2).toFixed(1)}" fill="url(#saPearlGrad)" fill-opacity="0.34" stroke="${fbSkin.inlayStroke}" stroke-width="1"/>`;
  }

  if (style === 'doom_monolith') {
    const rx = isVertical ? 14 : Math.min(10, spanSize * 0.24);
    const ry = isVertical ? Math.min(11, spanSize * 0.24) : 18;
    const sc = isDouble ? 0.85 : 1;
    return `
      <polygon points="${cx.toFixed(1)},${(cy - ry * sc).toFixed(1)} ${(cx + rx * sc).toFixed(1)},${cy.toFixed(1)} ${cx.toFixed(1)},${(cy + ry * sc).toFixed(1)} ${(cx - rx * sc).toFixed(1)},${cy.toFixed(1)}"
        fill="${fbSkin.inlayFill}" fill-opacity="0.24" stroke="${fbSkin.inlayStroke}" stroke-width="1.1"/>
      <line x1="${cx.toFixed(1)}" y1="${(cy - ry * sc * 0.65).toFixed(1)}" x2="${cx.toFixed(1)}" y2="${(cy + ry * sc * 0.65).toFixed(1)}" stroke="${fbSkin.inlayStroke}" stroke-width="0.9" stroke-opacity="0.7"/>
    `;
  }

  if (style === 'avant_crosshair') {
    return `
      <g stroke="${fbSkin.inlayStroke}" stroke-width="1" fill="none">
        <circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="7.5"/>
        <line x1="${(cx - 12).toFixed(1)}" y1="${cy.toFixed(1)}" x2="${(cx + 12).toFixed(1)}" y2="${cy.toFixed(1)}"/>
        <line x1="${cx.toFixed(1)}" y1="${(cy - 12).toFixed(1)}" x2="${cx.toFixed(1)}" y2="${(cy + 12).toFixed(1)}"/>
      </g>
    `;
  }

  if (style === 'armorial_sun') {
    const rOut = Math.min(13.5, spanSize * 0.32);
    const rIn = rOut * 0.35;
    const pts = [];
    for (let k = 0; k < 8; k += 1) {
      const ang = (k * Math.PI) / 4;
      const rad = k % 2 === 0 ? rOut : rIn;
      pts.push(`${(cx + Math.cos(ang) * rad).toFixed(1)},${(cy + Math.sin(ang) * rad).toFixed(1)}`);
    }
    return `<polygon points="${pts.join(' ')}" fill="url(#saPearlGrad)" fill-opacity="0.38" stroke="${fbSkin.inlayStroke}" stroke-width="1"/>`;
  }

  // Default: Heirloom 8-Pointed Andalusian / Oud Star (Rub el Hizb)
  const r = Math.min(7.5, spanSize * 0.19);
  return `
    <g transform="translate(${cx.toFixed(1)},${cy.toFixed(1)})">
      <rect x="${(-r).toFixed(1)}" y="${(-r).toFixed(1)}" width="${(r * 2).toFixed(1)}" height="${(r * 2).toFixed(1)}" fill="url(#saPearlGrad)" fill-opacity="0.28" stroke="${fbSkin.bindingColor}" stroke-opacity="0.58" stroke-width="0.85"/>
      <rect x="${(-r).toFixed(1)}" y="${(-r).toFixed(1)}" width="${(r * 2).toFixed(1)}" height="${(r * 2).toFixed(1)}" transform="rotate(45)" fill="url(#saPearlGrad)" fill-opacity="0.28" stroke="${fbSkin.bindingColor}" stroke-opacity="0.58" stroke-width="0.85"/>
      <circle r="${(r * 0.36).toFixed(1)}" fill="${fbSkin.bindingColor}" fill-opacity="0.55"/>
    </g>
  `;
}

function renderThematicInlays({ fbSkin, layout }) {
  const out = [];
  const { isVertical, maxFrets, numStrings, fretArr, strGap } = layout;
  const style = fbSkin.inlayStyle || 'pearl_dot';

  INLAY_FRETS.filter((f) => f <= maxFrets).forEach((f) => {
    const spanSize = fretArr[f] - fretArr[f - 1];

    if (isVertical) {
      const cy = layout.fretCenter(f);
      const midX = layout.boardLeft + layout.boardW / 2;

      if (style === 'vintage_trapezoid' || style === 'offset_block' || style === 'archtop_split_block') {
        out.push(renderInlayGlyph(style, fbSkin, midX, cy, spanSize, f === 12, true, layout));
      } else if (style === 'djent_sharktooth') {
        const y1 = fretArr[f - 1] + spanSize * 0.22;
        const y2 = fretArr[f] - spanSize * 0.2;
        const xEdge = layout.boardLeft + 10;
        const xPeak = f === 12 ? layout.boardLeft + layout.boardW - 14 : layout.boardLeft + layout.boardW * 0.56;
        out.push(`<polygon points="${xEdge.toFixed(1)},${y1.toFixed(1)} ${xEdge.toFixed(1)},${y2.toFixed(1)} ${xPeak.toFixed(1)},${y2.toFixed(1)}" fill="${fbSkin.inlayFill}" stroke="${fbSkin.inlayStroke}" stroke-width="1" stroke-opacity="0.65"/>`);
      } else if (f === 12) {
        const xA = LEFT_PAD_V + strGap * 1.25;
        const xB = LEFT_PAD_V + strGap * (numStrings - 2.25);
        out.push(renderInlayGlyph(style, fbSkin, xA, cy, spanSize, true, true, layout));
        out.push(renderInlayGlyph(style, fbSkin, xB, cy, spanSize, true, true, layout));
      } else {
        out.push(renderInlayGlyph(style, fbSkin, midX, cy, spanSize, false, true, layout));
      }

      // Side dots along left binding strip
      const sideX = layout.boardLeft - 3.5;
      if (f === 12) {
        out.push(`<circle cx="${sideX}" cy="${(cy - 4.5).toFixed(1)}" r="1.9" fill="${fbSkin.sideDotColor}"/>`);
        out.push(`<circle cx="${sideX}" cy="${(cy + 4.5).toFixed(1)}" r="1.9" fill="${fbSkin.sideDotColor}"/>`);
      } else {
        out.push(`<circle cx="${sideX}" cy="${cy.toFixed(1)}" r="1.9" fill="${fbSkin.sideDotColor}"/>`);
      }
      return;
    }

    // Horizontal inlays
    const cx = layout.fretCenter(f);
    const midY = TOP_Y_H + STRING_GAP_H * ((numStrings - 1) / 2);

    if (style === 'vintage_trapezoid' || style === 'offset_block' || style === 'archtop_split_block') {
      out.push(renderInlayGlyph(style, fbSkin, cx, midY, spanSize, f === 12, false, layout));
    } else if (style === 'djent_sharktooth') {
      const x1 = layout.tx(fretArr[f - 1] + spanSize * 0.22);
      const x2 = layout.tx(fretArr[f] - spanSize * 0.2);
      const yBot = layout.boardTop + layout.boardH - 10;
      const yPeak = f === 12 ? layout.boardTop + 14 : layout.boardTop + layout.boardH * 0.42;
      out.push(`<polygon points="${x1.toFixed(1)},${yBot.toFixed(1)} ${x2.toFixed(1)},${yBot.toFixed(1)} ${x2.toFixed(1)},${yPeak.toFixed(1)}" fill="${fbSkin.inlayFill}" stroke="${fbSkin.inlayStroke}" stroke-width="1" stroke-opacity="0.65"/>`);
    } else if (f === 12) {
      out.push(renderInlayGlyph(style, fbSkin, cx, TOP_Y_H + STRING_GAP_H * 1.5, spanSize, true, false, layout));
      out.push(renderInlayGlyph(style, fbSkin, cx, TOP_Y_H + STRING_GAP_H * (numStrings - 2.5), spanSize, true, false, layout));
    } else {
      out.push(renderInlayGlyph(style, fbSkin, cx, midY, spanSize, false, false, layout));
    }

    const bindDotY = layout.boardTop - 3.5;
    if (f === 12) {
      out.push(`<circle cx="${(cx - 4.5).toFixed(1)}" cy="${bindDotY}" r="1.9" fill="${fbSkin.sideDotColor}"/>`);
      out.push(`<circle cx="${(cx + 4.5).toFixed(1)}" cy="${bindDotY}" r="1.9" fill="${fbSkin.sideDotColor}"/>`);
    } else {
      out.push(`<circle cx="${cx.toFixed(1)}" cy="${bindDotY}" r="1.9" fill="${fbSkin.sideDotColor}"/>`);
    }
  });

  return out.join('');
}

function renderThemedNoteMarker({ cx, y, fill, ink, label, fontSize, isRoot, isChar, isMicroStep, microMode, nodeShape }) {
  const xStr = cx.toFixed(1);
  const yStr = y.toFixed(1);

  if (isMicroStep && microMode === 'slide') {
    const r = 13.4;
    return `
      <polygon points="${xStr},${(y - r).toFixed(1)} ${(cx + r).toFixed(1)},${yStr} ${xStr},${(y + r).toFixed(1)} ${(cx - r).toFixed(1)},${yStr}" fill="${fill}" stroke="#0d1017" stroke-width="1.2"/>
      <polygon points="${xStr},${(y - r).toFixed(1)} ${(cx + r).toFixed(1)},${yStr} ${xStr},${(y + r).toFixed(1)} ${(cx - r).toFixed(1)},${yStr}" fill="url(#saJewelGloss)" style="pointer-events:none"/>
      <text x="${xStr}" y="${(y + 3.5).toFixed(1)}" text-anchor="middle" fill="${ink}" font-size="${fontSize}" font-weight="700">${label}</text>
    `;
  }

  if (isMicroStep && microMode === 'bend') {
    const rx = nodeShape === 'hex' || nodeShape === 'bauhaus' ? 2 : 7;
    return `
      <rect x="${(cx - 14).toFixed(1)}" y="${(y - 12).toFixed(1)}" width="28" height="24" rx="${rx}" fill="${fill}" stroke="#0d1017" stroke-width="1.2"/>
      <rect x="${(cx - 14).toFixed(1)}" y="${(y - 12).toFixed(1)}" width="28" height="24" rx="${rx}" fill="url(#saJewelGloss)" style="pointer-events:none"/>
      <text x="${xStr}" y="${(y + 3.5).toFixed(1)}" text-anchor="middle" fill="${ink}" font-size="${fontSize}" font-weight="700">${label}</text>
      <rect x="${(cx + 5).toFixed(1)}" y="${(y - 18).toFixed(1)}" width="16" height="11" rx="3" fill="#0d1017" stroke="var(--accent-micro)" stroke-width="0.9"/>
      <text x="${(cx + 13).toFixed(1)}" y="${(y - 10).toFixed(1)}" text-anchor="middle" fill="var(--accent-micro)" font-size="7.8" font-weight="800">↑¼</text>
    `;
  }

  if (nodeShape === 'hex') {
    const r = isRoot ? 13.6 : 12.6;
    const pts = [];
    for (let k = 0; k < 6; k += 1) {
      const a = (k * Math.PI) / 3 - Math.PI / 6;
      pts.push(`${(cx + Math.cos(a) * r).toFixed(1)},${(y + Math.sin(a) * r).toFixed(1)}`);
    }
    const pStr = pts.join(' ');
    return `
      <polygon points="${pStr}" fill="${fill}" stroke="rgba(0,0,0,0.72)" stroke-width="1.3"/>
      <polygon points="${pStr}" fill="url(#saJewelGloss)" style="pointer-events:none"/>
      <text x="${xStr}" y="${(y + 3.5).toFixed(1)}" text-anchor="middle" fill="${ink}" font-size="${fontSize}" font-weight="800">${label}</text>
    `;
  }

  if (nodeShape === 'rune') {
    const r = isRoot ? 13.5 : 12.4;
    const c = r * 0.44;
    const pStr = [
      `${(cx - c).toFixed(1)},${(y - r).toFixed(1)}`,
      `${(cx + c).toFixed(1)},${(y - r).toFixed(1)}`,
      `${(cx + r).toFixed(1)},${(y - c).toFixed(1)}`,
      `${(cx + r).toFixed(1)},${(y + c).toFixed(1)}`,
      `${(cx + c).toFixed(1)},${(y + r).toFixed(1)}`,
      `${(cx - c).toFixed(1)},${(y + r).toFixed(1)}`,
      `${(cx - r).toFixed(1)},${(y + c).toFixed(1)}`,
      `${(cx - r).toFixed(1)},${(y - c).toFixed(1)}`
    ].join(' ');
    return `
      <polygon points="${pStr}" fill="${fill}" stroke="rgba(219,163,66,0.55)" stroke-width="1.2"/>
      <polygon points="${pStr}" fill="url(#saJewelGloss)" style="pointer-events:none"/>
      <text x="${xStr}" y="${(y + 3.6).toFixed(1)}" text-anchor="middle" fill="${ink}" font-size="${fontSize}" font-weight="700">${label}</text>
    `;
  }

  if (nodeShape === 'bauhaus') {
    if (isRoot) {
      return `
        <rect x="${(cx - 12.5).toFixed(1)}" y="${(y - 12.5).toFixed(1)}" width="25" height="25" rx="1" fill="${fill}" stroke="#ffffff" stroke-width="1.4"/>
        <text x="${xStr}" y="${(y + 3.6).toFixed(1)}" text-anchor="middle" fill="${ink}" font-size="${fontSize}" font-weight="800">${label}</text>
      `;
    }
    return `
      <circle cx="${xStr}" cy="${yStr}" r="12.2" fill="${fill}" stroke="${isChar ? '#ffffff' : 'rgba(255,255,255,0.45)'}" stroke-width="${isChar ? 2 : 1.1}"/>
      <text x="${xStr}" y="${(y + 3.6).toFixed(1)}" text-anchor="middle" fill="${ink}" font-size="${fontSize}" font-weight="700">${label}</text>
    `;
  }

  if (nodeShape === 'knob') {
    return `
      <circle cx="${xStr}" cy="${yStr}" r="13" fill="#18100a" stroke="rgba(240,210,150,0.48)" stroke-width="1"/>
      <circle cx="${xStr}" cy="${yStr}" r="11.2" fill="${fill}"/>
      <circle cx="${xStr}" cy="${yStr}" r="11.2" fill="url(#saJewelGloss)" style="pointer-events:none"/>
      ${isRoot ? `<line x1="${xStr}" y1="${(y - 12.5).toFixed(1)}" x2="${xStr}" y2="${(y - 9.2).toFixed(1)}" stroke="#fff4cc" stroke-width="1.8" stroke-linecap="round"/>` : ''}
      <text x="${xStr}" y="${(y + 3.5).toFixed(1)}" text-anchor="middle" fill="${ink}" font-size="${fontSize}" font-weight="800">${label}</text>
    `;
  }

  if (nodeShape === 'bloom') {
    return `
      <circle cx="${xStr}" cy="${yStr}" r="${isRoot ? 15.6 : 14.4}" fill="${fill}" fill-opacity="0.24" style="pointer-events:none"/>
      <circle cx="${xStr}" cy="${yStr}" r="${isRoot ? 12.6 : 11.8}" fill="${fill}" stroke="rgba(255,255,255,0.58)" stroke-width="${isRoot ? 1.5 : 1}"/>
      <circle cx="${xStr}" cy="${yStr}" r="${isRoot ? 12.2 : 11.4}" fill="url(#saJewelGloss)" style="pointer-events:none"/>
      <text x="${xStr}" y="${(y + 3.5).toFixed(1)}" text-anchor="middle" fill="${ink}" font-size="${fontSize}" font-weight="700">${label}</text>
    `;
  }

  if (nodeShape === 'hanko') {
    const s = isRoot ? 12.6 : 11.8;
    return `
      <rect x="${(cx - s).toFixed(1)}" y="${(y - s).toFixed(1)}" width="${(s * 2).toFixed(1)}" height="${(s * 2).toFixed(1)}" rx="4" fill="${fill}" stroke="#221e1a" stroke-width="1.3"/>
      <rect x="${(cx - s + 2.2).toFixed(1)}" y="${(y - s + 2.2).toFixed(1)}" width="${(s * 2 - 4.4).toFixed(1)}" height="${(s * 2 - 4.4).toFixed(1)}" rx="2.2" fill="none" stroke="${isRoot ? '#f7d886' : 'rgba(255,255,255,0.48)'}" stroke-width="${isRoot ? 1.15 : 0.85}"/>
      <text x="${xStr}" y="${(y + 3.6).toFixed(1)}" text-anchor="middle" fill="${ink}" font-size="${fontSize}" font-weight="800">${label}</text>
    `;
  }

  if (nodeShape === 'brass_ring') {
    return `
      <circle cx="${xStr}" cy="${yStr}" r="${isRoot ? 13.4 : 12.5}" fill="#0a0e16" stroke="${fill}" stroke-width="${isRoot ? 2.8 : 2.2}"/>
      <circle cx="${xStr}" cy="${yStr}" r="${isRoot ? 10.2 : 9.8}" fill="${fill}" fill-opacity="${isRoot ? 0.96 : 0.88}"/>
      <text x="${xStr}" y="${(y + 3.6).toFixed(1)}" text-anchor="middle" fill="${ink}" font-size="${fontSize}" font-weight="800">${label}</text>
    `;
  }

  if (nodeShape === 'ceramic') {
    return `
      <circle cx="${xStr}" cy="${yStr}" r="12.8" fill="${fill}" stroke="#fff4dc" stroke-width="${isRoot ? 2 : 1.2}" stroke-opacity="${isRoot ? 0.9 : 0.65}"/>
      <circle cx="${xStr}" cy="${yStr}" r="12.2" fill="url(#saJewelGloss)" style="pointer-events:none"/>
      <text x="${xStr}" y="${(y + 3.5).toFixed(1)}" text-anchor="middle" fill="${ink}" font-size="${fontSize}" font-weight="800">${label}</text>
    `;
  }

  return `
    <circle cx="${xStr}" cy="${yStr}" r="12.4" fill="${fill}" stroke="rgba(0,0,0,0.62)" stroke-width="1.25"/>
    <circle cx="${xStr}" cy="${yStr}" r="12.1" fill="url(#saJewelGloss)" style="pointer-events:none"/>
    <circle cx="${xStr}" cy="${yStr}" r="10.9" fill="none" stroke="rgba(255,255,255,0.28)" stroke-width="0.75"/>
    <text x="${xStr}" y="${(y + 3.5).toFixed(1)}" text-anchor="middle" fill="${ink}" font-size="${fontSize}" font-weight="700">${label}</text>
  `;
}

export function highlightFretboardEtudeEvent(ev, microMode) {
  const layer = document.getElementById('etudePlayheadLayer');
  if (!layer) return;
  if (!ev) {
    layer.innerHTML = '';
    return;
  }

  const st = getState();
  const layout = getBoardLayout(st, st.customStringsQ.length);
  if (ev.fret > layout.maxFrets) {
    layer.innerHTML = '';
    return;
  }

  const pt = ev.kind === 'harmonic'
    ? layout.pointFromFretFloat(ev.strIdx, ev.fret)
    : layout.pointFromStepQ(ev.strIdx, ev.stepQ, microMode);

  const badgeText = ev.articulation || '';
  layer.innerHTML = `
    <circle cx="${pt.x.toFixed(1)}" cy="${pt.y.toFixed(1)}" r="20" fill="none" stroke="var(--accent-etude)" stroke-width="3" stroke-opacity="0.95" class="etude-cursor-ring"/>
    <circle cx="${pt.x.toFixed(1)}" cy="${pt.y.toFixed(1)}" r="15" fill="var(--accent-etude)" fill-opacity="0.22"/>
    <rect x="${(pt.x - 14).toFixed(1)}" y="${(pt.y - 31).toFixed(1)}" width="28" height="14" rx="4" fill="var(--accent-etude)"/>
    <text x="${pt.x.toFixed(1)}" y="${(pt.y - 21).toFixed(1)}" text-anchor="middle" fill="#0d1017" font-size="9" font-weight="800" font-family="ui-monospace, monospace">${badgeText}</text>
  `;

  triggerFretboardStringPluck({ strIdx: ev.strIdx, x: pt.x, y: pt.y, color: 'var(--accent-etude)' });
}

const LIVE_TRAIL_MAX = 5;
const LIVE_TRAIL_TTL_MS = 3800;
let liveNoteTrail = [];
let lastLiveQ = null;

export function clearFretboardLiveTrail() {
  liveNoteTrail = [];
  lastLiveQ = null;
}

export function highlightFretboardLivePitch(pitch, state) {
  const layer = document.getElementById('livePitchLayer');
  if (!layer) return;
  if (!state.lineShowOnNeck) {
    layer.innerHTML = '';
    return;
  }

  const now = performance.now();
  const numStrings = state.customStringsQ.length;
  const layout = getBoardLayout(state, numStrings);
  const winMin = Math.min(state.fretWindowStart, layout.maxFrets);
  const winMax = Math.min(layout.maxFrets, state.fretWindowStart + state.fretWindowSpan);

  // Prune expired trail notes
  liveNoteTrail = liveNoteTrail.filter((item) => now - item.ts <= LIVE_TRAIL_TTL_MS);

  const findHitsForQ = (qVal) => {
    const allHits = [];
    for (let strIdx = 0; strIdx < numStrings; strIdx += 1) {
      const openQ = state.customStringsQ[strIdx];
      const stepQ = qVal - openQ;
      if (stepQ < 0 || stepQ > layout.maxFrets * 2) continue;
      if (stepQ === 1 && state.microMode === 'bend') continue;
      const fretNum = Math.floor(stepQ / 2);
      const pt = layout.pointFromStepQ(strIdx, stepQ, state.microMode);
      allHits.push({ ...pt, strIdx, fretNum });
    }
    if (state.fretWindowOn && state.lineClampToWindow && allHits.length > 1) {
      const inWin = allHits.filter((h) => h.fretNum >= winMin && h.fretNum <= winMax);
      if (inWin.length) return inWin;
    }
    return allHits;
  };

  const parts = [];

  // 1. Render fading melodic trail of recent notes played on the real instrument
  if (state.lineTrailOn && liveNoteTrail.length) {
    liveNoteTrail.forEach((entry) => {
      if (pitch && entry.q === pitch.nearestQ) return;
      const ageRatio = Math.max(0, 1 - (now - entry.ts) / LIVE_TRAIL_TTL_MS);
      const opacity = (0.14 + ageRatio * 0.42).toFixed(2);
      const trailHits = findHitsForQ(entry.q);
      trailHits.forEach(({ x, y }) => {
        parts.push(
          `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="15.5" fill="${entry.stroke}" fill-opacity="${(Number(opacity) * 0.25).toFixed(2)}" stroke="${entry.stroke}" stroke-opacity="${opacity}" stroke-width="2" stroke-dasharray="3 3"/>`
        );
      });
    });
  }

  if (!pitch) {
    layer.innerHTML = parts.join('');
    lastLiveQ = null;
    return;
  }

  const hits = findHitsForQ(pitch.nearestQ);
  if (!hits.length) {
    layer.innerHTML = parts.join('');
    return;
  }

  // Determine musical role color relative to active Scale / Maqam
  const scale = getActiveScale();
  const relIv = mod24(pitch.pc24 - state.rootQ);
  const inScale = scale.intervalsQ.includes(relIv);
  const isRoot = relIv === 0;
  const inTune = Math.abs(pitch.centsFrom24) <= 14;

  let stroke = 'var(--accent-danger)';
  if (isRoot) stroke = 'var(--accent-root)';
  else if (pitch.isQuarterTone && inScale) stroke = 'var(--accent-micro)';
  else if (inScale) stroke = 'var(--accent-live)';

  // Record note into trail when pitch changes stably
  if (state.lineTrailOn && pitch.nearestQ !== lastLiveQ) {
    lastLiveQ = pitch.nearestQ;
    liveNoteTrail = [
      { q: pitch.nearestQ, stroke, ts: now },
      ...liveNoteTrail.filter((item) => item.q !== pitch.nearestQ)
    ].slice(0, LIVE_TRAIL_MAX);
  }

  const cRound = Math.round(pitch.centsFrom24);
  const cLabel = `${pitch.noteShort24} ${cRound >= 0 ? '+' : ''}${cRound}¢`;

  hits.forEach(({ x, y }, idx) => {
    parts.push(`
      <circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="20.5" fill="${stroke}" fill-opacity="0.18" stroke="${stroke}" stroke-width="${inTune ? 3.2 : 2.5}" stroke-dasharray="${inTune ? 'none' : '5 3'}" class="live-pitch-ring"/>
      <circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="14.5" fill="none" stroke="#ffffff" stroke-opacity="0.65" stroke-width="1.2"/>
    `);
    // Attach crisp floating pitch tag to the primary hit (or up to 2 hits) without visual clutter
    if (idx === 0) {
      const tagY = Math.max(18, y - 24);
      const tagW = Math.max(48, cLabel.length * 6.4);
      parts.push(`
        <rect x="${(x - tagW / 2).toFixed(1)}" y="${(tagY - 10).toFixed(1)}" width="${tagW.toFixed(1)}" height="15" rx="4" fill="#0d1017" stroke="${stroke}" stroke-width="1.1"/>
        <text x="${x.toFixed(1)}" y="${(tagY + 1).toFixed(1)}" text-anchor="middle" fill="${stroke}" font-size="8.8" font-weight="800" font-family="ui-monospace, monospace">${cLabel}</text>
      `);
    }
  });

  layer.innerHTML = parts.join('');
}

export function renderFretboard(state) {
  const container = document.getElementById('fretboardContainer');
  const titleEl = document.getElementById('activeScaleTitle');
  const formulaEl = document.getElementById('activeFormulaTag');
  const legendEl = document.getElementById('fretboardLegend');
  if (!container) return;

  const activeTheme = getThemeById(state.theme);
  const fbSkin = activeTheme.fretboard;
  const numStrings = state.customStringsQ.length;
  const layout = getBoardLayout(state, numStrings);
  const { isVertical, maxFrets, fretArr } = layout;

  // Mark container orientation for CSS responsive sizing
  container.classList.toggle('is-vertical', isVertical);
  const swipeHint = document.getElementById('mobileSwipeHintText');
  if (swipeHint) {
    swipeHint.textContent = isVertical ? t(state.lang, 'mobSwipeHintVert') : t(state.lang, 'mobSwipeHint');
  }

  const scale = getActiveScale();
  const rootName = qToNoteName(state.rootQ, false);
  const scaleName = state.lang === 'en' ? scale.nameEn : scale.namePt;

  const activeScala = state.scalaOverlayOn
    ? parseSclText(state.scalaCustomText || getScalaPresetById(state.scalaPresetId).scl)
    : null;
  const scalaActive = Boolean(activeScala && activeScala.ok);

  if (scalaActive) {
    titleEl.textContent = `${rootName} · ${activeScala.description}`;
    formulaEl.textContent = `Scala .scl · ${activeScala.noteCount} ${t(state.lang, 'notesUnit')} · ${activeScala.periodCents.toFixed(1)}¢`;
  } else {
    titleEl.textContent = `${rootName} ${scaleName}`;
    formulaEl.textContent = scale.intervalsQ.map((iv) => intervalQToLabel(iv)).join(' · ');
  }

  const activeVoicing = state.voicingOverlayOn ? getActiveVoicing() : null;

  legendEl.innerHTML = `
    ${scalaActive ? `<span class="legend-item" style="color:var(--accent-micro);font-weight:700">✦ SCALA .SCL (${activeScala.periodCents.toFixed(0)}¢)</span>` : ''}
    <span class="legend-item"><span class="legend-dot" style="background:var(--accent-root)"></span>${t(state.lang, 'legendRoot')}</span>
    <span class="legend-item"><span class="legend-dot" style="background:var(--accent-char)"></span>${t(state.lang, 'legendChar')}</span>
    <span class="legend-item"><span class="legend-dot" style="background:var(--accent-scale)"></span>${t(state.lang, 'legendScale')}</span>
    <span class="legend-item"><span class="legend-diamond" style="background:var(--accent-micro)"></span>${t(state.lang, 'legendMicro')}</span>
    ${activeVoicing ? `<span class="legend-item"><span class="legend-ring"></span>${t(state.lang, 'legendVoicing')}</span>` : ''}
    ${state.activeTab === 'etude' ? `<span class="legend-item"><span class="legend-ring etude"></span>${t(state.lang, 'legendEtudeCursor')}</span>` : ''}
    ${state.lineModeRunning ? `<span class="legend-item"><span class="legend-ring live"></span>${t(state.lang, 'legendLivePitch')}</span>` : ''}
    ${state.radarOverlayOnNeck && state.radarCompareScaleId ? `<span class="legend-item"><span class="legend-ring radar-b"></span>${t(state.lang, 'legendRadarB')}</span>` : ''}
    ${state.harmonicsOn ? `<span class="legend-item"><span class="legend-dot" style="background:var(--accent-harmonic)"></span>${t(state.lang, 'legendHarm')}</span>` : ''}
  `;

  renderMinimalStageControls(state);

  const allowedMap = new Map();
  scale.intervalsQ.forEach((iv) => {
    allowedMap.set(mod24(state.rootQ + iv), iv);
  });
  const charSet = new Set(scale.characteristicQ || []);

  const voicingMap = new Map();
  if (activeVoicing) {
    activeVoicing.notes.forEach((n) => {
      voicingMap.set(`${n.strIdx}:${n.stepQ}`, n);
    });
  }

  const radarBMap = new Map();
  if (state.radarOverlayOnNeck && state.radarCompareScaleId) {
    const scB = DB.scales.find((s) => s.id === state.radarCompareScaleId);
    if (scB) {
      scB.intervalsQ.forEach((iv) => {
        radarBMap.set(mod24(state.radarCompareRootQ + iv), iv);
      });
    }
  }

  const winMin = Math.min(state.fretWindowStart, maxFrets);
  const winMax = Math.min(maxFrets, state.fretWindowStart + state.fretWindowSpan);

  const parts = [];
  parts.push(`<svg class="fretboard-svg ${isVertical ? 'is-vertical-svg' : ''}" data-orientation="${isVertical ? 'vertical' : 'horizontal'}" viewBox="0 0 ${layout.svgW} ${layout.svgH}" role="img" aria-label="${rootName} ${scaleName}">`);
  parts.push(buildFretboardDefs(fbSkin, isVertical));

  // -------------------------------------------------------------------------
  // ARCHITECTURE: Headstock, Binding, Marquetry, Wood, Nut, Inlays, Frets & Strings
  // -------------------------------------------------------------------------
  if (isVertical) {
    const bL = layout.boardLeft;
    const bW = layout.boardW;
    const bLen = layout.boardLen;
    const nutY = NUT_Y_V;

    // Engraved Headstock Plaque at Top
    parts.push(`<rect x="${bL - 6}" y="8" width="${bW + 12}" height="${nutY - 16}" rx="7" fill="${fbSkin.headstockFill}" fill-opacity="0.92" stroke="${fbSkin.bindingColor}" stroke-opacity="0.35" stroke-width="1.2"/>`);
    parts.push(`<rect x="${bL - 2}" y="12" width="${bW + 4}" height="${nutY - 24}" rx="5" fill="none" stroke="${fbSkin.bindingColor}" stroke-opacity="0.18" stroke-width="0.8" stroke-dasharray="3 3"/>`);

    // Left & Right Neck Binding Strips + Marquetry Purfling
    parts.push(`<rect x="${bL - 7}" y="${nutY - 10}" width="7" height="${bLen + 10}" rx="2" fill="${fbSkin.bindingColor}" stroke="${fbSkin.bindingStroke}" stroke-width="0.9"/>`);
    parts.push(`<line x1="${bL - 1.5}" y1="${nutY}" x2="${bL - 1.5}" y2="${nutY + bLen}" stroke="${fbSkin.bindingStroke}" stroke-opacity="0.7" stroke-width="1" stroke-dasharray="4 3"/>`);
    parts.push(`<rect x="${bL + bW}" y="${nutY - 10}" width="7" height="${bLen + 10}" rx="2" fill="${fbSkin.bindingColor}" stroke="${fbSkin.bindingStroke}" stroke-width="0.9"/>`);
    parts.push(`<line x1="${bL + bW + 1.5}" y1="${nutY}" x2="${bL + bW + 1.5}" y2="${nutY + bLen}" stroke="${fbSkin.bindingStroke}" stroke-opacity="0.7" stroke-width="1" stroke-dasharray="4 3"/>`);

    // Bottom Body Ornament (Soundhole Rosette Arc or Boutique Pickup Bezel)
    const botY = nutY + bLen;
    if (['layl', 'nahar', 'brazilian', 'kintsugi'].includes(state.theme)) {
      parts.push(`<path d="M${bL + 14} ${botY} A 96 68 0 0 1 ${bL + bW - 14} ${botY}" fill="none" stroke="${fbSkin.bindingColor}" stroke-opacity="0.52" stroke-width="2.2"/>`);
      parts.push(`<path d="M${bL + 22} ${botY} A 84 60 0 0 1 ${bL + bW - 22} ${botY}" fill="none" stroke="var(--accent-root)" stroke-opacity="0.55" stroke-width="1.3" stroke-dasharray="3 3"/>`);
    } else {
      parts.push(`<rect x="${bL + 6}" y="${botY + 3}" width="${bW - 12}" height="15" rx="3" fill="${fbSkin.headstockFill}" stroke="${fbSkin.bindingColor}" stroke-opacity="0.48" stroke-width="1"/>`);
      for (let strIdx = 0; strIdx < numStrings; strIdx += 1) {
        parts.push(`<circle cx="${layout.stringCoord(strIdx).toFixed(1)}" cy="${(botY + 10.5).toFixed(1)}" r="3.2" fill="url(#saFretGrad)" stroke="rgba(0,0,0,0.65)" stroke-width="0.8"/>`);
      }
    }

    // Main Vertical Wood / Carbon Surface + Texture + Sheen + Radius Vignette
    parts.push(`<rect x="${bL}" y="${nutY}" width="${bW}" height="${bLen}" fill="url(#saWoodGrad)"/>`);
    parts.push(`<rect x="${bL}" y="${nutY}" width="${bW}" height="${bLen}" fill="url(#saBoardTexture)"/>`);
    parts.push(`<rect x="${bL}" y="${nutY}" width="${bW}" height="${bLen}" fill="url(#saNeckSheen)"/>`);
    parts.push(`<rect x="${bL}" y="${nutY}" width="${bW}" height="${bLen}" fill="url(#saNeckVignette)"/>`);

    // Nut shadow + Realistic 3D Slotted Horizontal Nut
    parts.push(`<rect x="${bL}" y="${nutY}" width="${bW}" height="6" fill="#000000" fill-opacity="0.28"/>`);
    parts.push(`<rect x="${bL}" y="${nutY - 10}" width="${bW}" height="10" rx="1.5" fill="url(#saNutGrad)" stroke="rgba(0,0,0,0.5)" stroke-width="0.9"/>`);

    // Thematic Inlays + Left Side Dots
    parts.push(renderThematicInlays({ fbSkin, layout }));

    // Closed Window Highlight Box (Vertical)
    if (state.fretWindowOn && winMin <= maxFrets) {
      const wy1 = winMin === 0 ? nutY - 56 : fretArr[Math.max(0, winMin - 1)];
      const wy2 = fretArr[winMax];
      parts.push(`<rect x="${bL}" y="${wy1.toFixed(1)}" width="${bW}" height="${Math.max(12, wy2 - wy1).toFixed(1)}" rx="3" fill="var(--accent-scale)" fill-opacity="0.13" stroke="var(--accent-scale)" stroke-width="1.6" stroke-dasharray="5 3"/>`);
    }

    // 3D Metallic Horizontal Fret Wires & Left Gutter Fret Numbers
    for (let f = 1; f <= maxFrets; f += 1) {
      const fy = fretArr[f];
      parts.push(`<line x1="${bL}" y1="${(fy + 1.6).toFixed(1)}" x2="${bL + bW}" y2="${(fy + 1.6).toFixed(1)}" stroke="#000000" stroke-opacity="0.45" stroke-width="2"/>`);
      parts.push(`<rect x="${bL}" y="${(fy - 1.3).toFixed(1)}" width="${bW}" height="2.6" rx="1" fill="url(#saFretGrad)"/>`);

      const isInlay = INLAY_SET.has(f);
      parts.push(`<text x="14" y="${(layout.fretCenter(f) + 4).toFixed(1)}" text-anchor="middle" fill="${isInlay ? 'var(--accent-root)' : 'var(--text-muted)'}" font-size="${isInlay ? 11.8 : 10.5}" font-weight="${isInlay ? 700 : 500}" font-family="var(--font-mono, ui-monospace, monospace)">${f}</text>`);

      if (state.microMode === 'frets24') {
        const my = (fretArr[f - 1] + fretArr[f]) / 2;
        parts.push(`<line x1="${bL + 2}" y1="${my.toFixed(1)}" x2="${bL + bW - 2}" y2="${my.toFixed(1)}" stroke="var(--fret-micro)" stroke-width="1.35" stroke-dasharray="4 4"/>`);
      }
    }

    // Realistic Vertical Guitar Strings (strIdx 0 = Bass -> strIdx N-1 = Treble)
    for (let strIdx = 0; strIdx < numStrings; strIdx += 1) {
      const sx = layout.stringCoord(strIdx);
      const openQ = state.customStringsQ[strIdx];
      const guitarStrNum = numStrings - strIdx; // 6..1
      const isWound = strIdx < numStrings - 3;
      const strokeW = 1.15 + (numStrings - 1 - strIdx) * 0.44;
      const openInScale = allowedMap.has(mod24(openQ));
      const strColor = openInScale ? 'var(--accent-open)' : (isWound ? fbSkin.stringWound : fbSkin.stringPlain);

      // Nut slot notch & cast shadow
      parts.push(`<line x1="${sx.toFixed(1)}" y1="${nutY - 10}" x2="${sx.toFixed(1)}" y2="${nutY}" stroke="rgba(0,0,0,0.55)" stroke-width="${(strokeW + 1).toFixed(1)}"/>`);
      parts.push(`<line x1="${(sx + 2.4).toFixed(1)}" y1="${nutY}" x2="${(sx + 2.4).toFixed(1)}" y2="${botY}" stroke="#000000" stroke-opacity="0.45" stroke-width="${(strokeW + 0.6).toFixed(1)}"/>`);

      parts.push(`<g class="sa-string-wire" data-str-idx="${strIdx}">`);
      if (openInScale) {
        parts.push(`<line x1="${sx.toFixed(1)}" y1="${nutY - 10}" x2="${sx.toFixed(1)}" y2="${botY}" stroke="var(--accent-open)" stroke-opacity="0.22" stroke-width="${(strokeW + 4).toFixed(1)}"/>`);
      }
      parts.push(`<line x1="${sx.toFixed(1)}" y1="${nutY - 24}" x2="${sx.toFixed(1)}" y2="${botY}" stroke="${strColor}" stroke-width="${strokeW.toFixed(2)}" stroke-opacity="${openInScale ? '0.94' : '0.78'}"/>`);
      if (isWound) {
        parts.push(`<line x1="${(sx - 0.35).toFixed(2)}" y1="${nutY}" x2="${(sx - 0.35).toFixed(2)}" y2="${botY}" stroke="#ffffff" stroke-opacity="0.28" stroke-width="0.9" stroke-dasharray="2.2 2"/>`);
      } else {
        parts.push(`<line x1="${(sx - 0.35).toFixed(2)}" y1="${nutY}" x2="${(sx - 0.35).toFixed(2)}" y2="${botY}" stroke="#ffffff" stroke-opacity="0.34" stroke-width="0.65"/>`);
      }
      parts.push('</g>');

      // String number at top edge of headstock
      parts.push(`<text x="${sx.toFixed(1)}" y="19" text-anchor="middle" fill="var(--text-muted)" font-size="10" font-weight="600" font-family="var(--font-mono, ui-monospace, monospace)">${guitarStrNum}</text>`);
    }
  } else {
    // HORIZONTAL ARCHITECTURE
    const { boardTop, boardH, boardW, tx, txRect, leftHanded } = layout;

    parts.push(`<rect x="${txRect(8, NUT_X_H - 16)}" y="${boardTop - 6}" width="${NUT_X_H - 16}" height="${boardH + 12}" rx="6" fill="${fbSkin.headstockFill}" fill-opacity="0.92" stroke="${fbSkin.bindingColor}" stroke-opacity="0.35" stroke-width="1.2"/>`);
    parts.push(`<rect x="${txRect(12, NUT_X_H - 24)}" y="${boardTop - 2}" width="${NUT_X_H - 24}" height="${boardH + 4}" rx="4" fill="none" stroke="${fbSkin.bindingColor}" stroke-opacity="0.18" stroke-width="0.8" stroke-dasharray="3 3"/>`);

    const bindX = txRect(NUT_X_H - 10, boardW + 10);
    const boardX = txRect(NUT_X_H, boardW);
    parts.push(`<rect x="${bindX}" y="${boardTop - 7}" width="${boardW + 10}" height="7" rx="2" fill="${fbSkin.bindingColor}" stroke="${fbSkin.bindingStroke}" stroke-width="0.9"/>`);
    parts.push(`<line x1="${boardX}" y1="${boardTop - 1.5}" x2="${boardX + boardW}" y2="${boardTop - 1.5}" stroke="${fbSkin.bindingStroke}" stroke-opacity="0.7" stroke-width="1" stroke-dasharray="4 3"/>`);
    parts.push(`<rect x="${bindX}" y="${boardTop + boardH}" width="${boardW + 10}" height="7" rx="2" fill="${fbSkin.bindingColor}" stroke="${fbSkin.bindingStroke}" stroke-width="0.9"/>`);
    parts.push(`<line x1="${boardX}" y1="${boardTop + boardH + 1.5}" x2="${boardX + boardW}" y2="${boardTop + boardH + 1.5}" stroke="${fbSkin.bindingStroke}" stroke-opacity="0.7" stroke-width="1" stroke-dasharray="4 3"/>`);

    const bodyEndX = tx(SVG_H_W - RIGHT_PAD_H);
    if (['layl', 'nahar', 'brazilian', 'kintsugi'].includes(state.theme)) {
      const sweep = leftHanded ? 1 : 0;
      parts.push(`<path d="M${bodyEndX} ${boardTop + 10} A 78 96 0 0 ${sweep} ${bodyEndX} ${boardTop + boardH - 10}" fill="none" stroke="${fbSkin.bindingColor}" stroke-opacity="0.52" stroke-width="2.2"/>`);
      parts.push(`<path d="M${bodyEndX} ${boardTop + 18} A 70 88 0 0 ${sweep} ${bodyEndX} ${boardTop + boardH - 18}" fill="none" stroke="var(--accent-root)" stroke-opacity="0.55" stroke-width="1.3" stroke-dasharray="3 3"/>`);
    } else {
      const puX = txRect(SVG_H_W - RIGHT_PAD_H + 2, 14);
      parts.push(`<rect x="${puX}" y="${boardTop + 6}" width="14" height="${boardH - 12}" rx="3" fill="${fbSkin.headstockFill}" stroke="${fbSkin.bindingColor}" stroke-opacity="0.48" stroke-width="1"/>`);
      for (let pi = 0; pi < numStrings; pi += 1) {
        parts.push(`<circle cx="${puX + 7}" cy="${TOP_Y_H + pi * STRING_GAP_H}" r="3.1" fill="url(#saFretGrad)" stroke="rgba(0,0,0,0.65)" stroke-width="0.8"/>`);
      }
    }

    parts.push(`<rect x="${boardX}" y="${boardTop}" width="${boardW}" height="${boardH}" fill="url(#saWoodGrad)"/>`);
    parts.push(`<rect x="${boardX}" y="${boardTop}" width="${boardW}" height="${boardH}" fill="url(#saBoardTexture)"/>`);
    parts.push(`<rect x="${boardX}" y="${boardTop}" width="${boardW}" height="${boardH}" fill="url(#saNeckSheen)"/>`);
    parts.push(`<rect x="${boardX}" y="${boardTop}" width="${boardW}" height="${boardH}" fill="url(#saNeckVignette)"/>`);

    parts.push(`<rect x="${txRect(NUT_X_H, 6)}" y="${boardTop}" width="6" height="${boardH}" fill="#000000" fill-opacity="0.28"/>`);
    parts.push(`<rect x="${txRect(NUT_X_H - 10, 10)}" y="${boardTop}" width="10" height="${boardH}" rx="1.5" fill="url(#saNutGrad)" stroke="rgba(0,0,0,0.5)" stroke-width="0.9"/>`);

    parts.push(renderThematicInlays({ fbSkin, layout }));

    if (state.fretWindowOn && winMin <= maxFrets) {
      const rawWx1 = winMin === 0 ? NUT_X_H - 58 : fretArr[Math.max(0, winMin - 1)];
      const rawWx2 = fretArr[winMax];
      const winW = Math.max(12, rawWx2 - rawWx1);
      parts.push(`<rect x="${txRect(rawWx1, winW)}" y="${boardTop}" width="${winW}" height="${boardH}" rx="3" fill="var(--accent-scale)" fill-opacity="0.13" stroke="var(--accent-scale)" stroke-width="1.6" stroke-dasharray="5 3"/>`);
    }

    for (let f = 1; f <= maxFrets; f += 1) {
      const x = tx(fretArr[f]);
      const shX = leftHanded ? x - 1.6 : x + 1.6;
      parts.push(`<line x1="${shX.toFixed(1)}" y1="${boardTop}" x2="${shX.toFixed(1)}" y2="${boardTop + boardH}" stroke="#000000" stroke-opacity="0.45" stroke-width="2"/>`);
      parts.push(`<rect x="${(x - 1.3).toFixed(1)}" y="${boardTop}" width="2.6" height="${boardH}" rx="1" fill="url(#saFretGrad)"/>`);

      const isInlay = INLAY_SET.has(f);
      parts.push(`<text x="${layout.fretCenter(f).toFixed(1)}" y="${layout.svgH - 13}" text-anchor="middle" fill="${isInlay ? 'var(--accent-root)' : 'var(--text-muted)'}" font-size="${isInlay ? 11.5 : 10.2}" font-weight="${isInlay ? 700 : 500}" font-family="var(--font-mono, ui-monospace, monospace)">${f}</text>`);

      if (state.microMode === 'frets24') {
        const microX = tx((fretArr[f - 1] + fretArr[f]) / 2);
        parts.push(`<line x1="${microX.toFixed(1)}" y1="${boardTop + 2}" x2="${microX.toFixed(1)}" y2="${boardTop + boardH - 2}" stroke="var(--fret-micro)" stroke-width="1.35" stroke-dasharray="4 4"/>`);
      }
    }

    const strStartX = tx(NUT_X_H - 24);
    const strBoardStartX = tx(NUT_X_H);
    const strEndX = tx(SVG_H_W - RIGHT_PAD_H);
    const nutSlotX1 = tx(NUT_X_H - 10);
    const nutSlotX2 = tx(NUT_X_H);

    for (let strIdx = 0; strIdx < numStrings; strIdx += 1) {
      const visIdx = (numStrings - 1) - strIdx;
      const openQ = state.customStringsQ[strIdx];
      const y = layout.stringCoord(strIdx);
      const isWound = strIdx < numStrings - 3;
      const strokeW = 1.15 + visIdx * 0.42;
      const openInScale = allowedMap.has(mod24(openQ));
      const strColor = openInScale ? 'var(--accent-open)' : (isWound ? fbSkin.stringWound : fbSkin.stringPlain);

      parts.push(`<line x1="${nutSlotX1}" y1="${y}" x2="${nutSlotX2}" y2="${y}" stroke="rgba(0,0,0,0.55)" stroke-width="${(strokeW + 1).toFixed(1)}"/>`);
      parts.push(`<line x1="${strBoardStartX}" y1="${(y + 2.4).toFixed(1)}" x2="${strEndX}" y2="${(y + 2.4).toFixed(1)}" stroke="#000000" stroke-opacity="0.45" stroke-width="${(strokeW + 0.6).toFixed(1)}"/>`);

      parts.push(`<g class="sa-string-wire" data-str-idx="${strIdx}">`);
      if (openInScale) {
        parts.push(`<line x1="${nutSlotX1}" y1="${y}" x2="${strEndX}" y2="${y}" stroke="var(--accent-open)" stroke-opacity="0.22" stroke-width="${(strokeW + 4).toFixed(1)}"/>`);
      }
      parts.push(`<line x1="${strStartX}" y1="${y}" x2="${strEndX}" y2="${y}" stroke="${strColor}" stroke-width="${strokeW.toFixed(2)}" stroke-opacity="${openInScale ? '0.94' : '0.78'}"/>`);
      if (isWound) {
        parts.push(`<line x1="${strBoardStartX}" y1="${(y - 0.35).toFixed(2)}" x2="${strEndX}" y2="${(y - 0.35).toFixed(2)}" stroke="#ffffff" stroke-opacity="0.28" stroke-width="0.9" stroke-dasharray="2.2 2"/>`);
      } else {
        parts.push(`<line x1="${strBoardStartX}" y1="${(y - 0.35).toFixed(2)}" x2="${strEndX}" y2="${(y - 0.35).toFixed(2)}" stroke="#ffffff" stroke-opacity="0.34" stroke-width="0.65"/>`);
      }
      parts.push('</g>');

      parts.push(`<text x="${tx(19).toFixed(1)}" y="${y + 4}" text-anchor="middle" fill="var(--text-muted)" font-size="10.2" font-weight="600" font-family="var(--font-mono, ui-monospace, monospace)">${visIdx + 1}</text>`);
    }
  }

  // -------------------------------------------------------------------------
  // VOICING SPINE (Orientation-Agnostic!)
  // -------------------------------------------------------------------------
  if (activeVoicing && activeVoicing.notes.length >= 2) {
    const visibleNotes = activeVoicing.notes.filter((n) => n.fret <= maxFrets);
    if (visibleNotes.length >= 2) {
      const pts = visibleNotes
        .map((n) => {
          const p = layout.pointFromStepQ(n.strIdx, n.stepQ, state.microMode);
          return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
        })
        .join(' ');
      parts.push(`<polyline points="${pts}" fill="none" stroke="var(--accent-voicing)" stroke-width="3.2" stroke-opacity="0.52" stroke-linecap="round" stroke-linejoin="round"/>`);
    }
  }

  // -------------------------------------------------------------------------
  // OPEN STRINGS, HARMONICS, SCALA (.scl) OR 24-TET NODES (Orientation-Agnostic!)
  // -------------------------------------------------------------------------
  if (scalaActive) {
    const scalaMarkers = mapScalaToFretboard({
      parsed: activeScala,
      rootQ: state.rootQ,
      stringsQ: state.customStringsQ,
      maxFrets
    });

    for (let strIdx = 0; strIdx < numStrings; strIdx += 1) {
      const openQ = state.customStringsQ[strIdx];
      const guitarStrNum = numStrings - strIdx;
      const pt = layout.pointFromStepQ(strIdx, 0, state.microMode);
      parts.push(`
        <g class="note-node" filter="url(#saNoteShadow)" data-kind="note" data-pc="${mod24(openQ)}" data-str-idx="${strIdx}" data-cx="${pt.x.toFixed(1)}" data-cy="${pt.y.toFixed(1)}" data-q="${openQ}" data-string="${guitarStrNum}" data-fret="0" data-iv="-1" data-micro="0">
          <circle cx="${pt.x.toFixed(1)}" cy="${pt.y.toFixed(1)}" r="12.5" fill="var(--bg-elevated)" stroke="var(--border-strong)" stroke-width="1"/>
          <text x="${pt.x.toFixed(1)}" y="${(pt.y + 4).toFixed(1)}" text-anchor="middle" fill="var(--text-secondary)" font-size="10" font-weight="700">${qToNoteName(openQ, false)}</text>
        </g>
      `);
    }

    scalaMarkers.forEach((m) => {
      if (m.nearestFret === 0 && m.fretFloat < 0.35 && Math.abs(m.devCents) > 30) return;
      const pt = state.microMode === 'bend'
        ? layout.pointFromStepQ(m.strIdx, m.nearestFret * 2, 'bend')
        : (m.fretFloat <= 0.12 ? layout.pointFromStepQ(m.strIdx, 0, 'slide') : layout.pointFromFretFloat(m.strIdx, m.fretFloat));

      const devRound = Math.round(m.devCents);
      const devTxt = devRound === 0 ? '0¢' : `${devRound > 0 ? '+' : ''}${devRound}¢`;
      const fill = m.isRoot ? 'var(--accent-root)' : (m.isPure12 ? 'var(--accent-scale)' : 'var(--accent-micro)');
      const ink = m.isRoot ? 'var(--accent-root-ink)' : (m.isPure12 ? 'var(--accent-scale-ink)' : 'var(--accent-micro-ink)');
      const lbl = state.labelMode === 'cents'
        ? `${Math.round(m.centsInPeriod)}`
        : (state.labelMode === 'degree' ? `${m.degreeIndex + 1}` : m.raw.slice(0, 4));
      const fSize = lbl.length >= 4 ? 7.8 : 9.2;
      const outsideWin = state.fretWindowOn && (m.nearestFret < winMin || m.nearestFret > winMax);

      parts.push(`
        <g class="note-node ${outsideWin ? 'is-outside-win' : ''}" filter="url(#saNoteShadow)" data-kind="scala" data-str-idx="${m.strIdx}" data-cx="${pt.x.toFixed(1)}" data-cy="${pt.y.toFixed(1)}" data-freq="${m.freq.toFixed(3)}" data-raw="${m.raw}" data-cents="${m.centsInPeriod.toFixed(1)}" data-dev="${m.devCents.toFixed(1)}" data-deg="${m.degreeIndex + 1}" data-string="${m.guitarStr}" data-fret="${m.nearestFret}">
          ${m.isRoot ? `<circle cx="${pt.x.toFixed(1)}" cy="${pt.y.toFixed(1)}" r="15.8" fill="none" stroke="var(--accent-root)" stroke-width="1.4" stroke-opacity="0.78"/>` : ''}
          ${renderThemedNoteMarker({
            cx: pt.x, y: pt.y, fill, ink, label: lbl, fontSize: fSize,
            isRoot: m.isRoot, isChar: false, isMicroStep: false,
            microMode: 'frets24', nodeShape: fbSkin.nodeShape || 'jewel'
          })}
          ${Math.abs(devRound) >= 3 ? `
            <rect x="${(pt.x + 3).toFixed(1)}" y="${(pt.y - 19).toFixed(1)}" width="24" height="11" rx="3" fill="#0d1017" stroke="${fill}" stroke-width="0.85"/>
            <text x="${(pt.x + 15).toFixed(1)}" y="${(pt.y - 11).toFixed(1)}" text-anchor="middle" fill="${fill}" font-size="7.3" font-weight="800" font-family="ui-monospace, monospace">${devTxt}</text>
          ` : ''}
        </g>
      `);
    });
  } else {
    for (let strIdx = 0; strIdx < numStrings; strIdx += 1) {
      const guitarStrNum = numStrings - strIdx;
      const openQ = state.customStringsQ[strIdx];
      const openPc = mod24(openQ);
      const openInScale = allowedMap.has(openPc);
      const openIv = allowedMap.get(openPc);
      const isPlayingOpen = state.playingPcQ !== null && state.playingPcQ === openPc;
      const openInVoicing = voicingMap.has(`${strIdx}:0`);

      const openFill = openInScale
        ? (openIv === 0 ? 'var(--accent-root)' : 'var(--accent-open)')
        : (openInVoicing ? 'var(--accent-voicing)' : 'var(--bg-elevated)');
      const openInk = (openInScale || openInVoicing) ? 'var(--accent-root-ink)' : 'var(--text-secondary)';
      const openLabel = qToNoteName(openQ, false);
      const openPt = layout.pointFromStepQ(strIdx, 0, state.microMode);

      parts.push(`
        <g class="note-node ${isPlayingOpen ? 'is-playing' : ''} ${state.fretWindowOn && winMin > 0 && !openInVoicing ? 'is-outside-win' : ''}" filter="url(#saNoteShadow)" data-kind="note" data-pc="${openPc}" data-str-idx="${strIdx}" data-cx="${openPt.x.toFixed(1)}" data-cy="${openPt.y.toFixed(1)}" data-q="${openQ}" data-string="${guitarStrNum}" data-fret="0" data-iv="${openInScale ? openIv : (openInVoicing ? voicingMap.get(`${strIdx}:0`).intervalQ : -1)}" data-micro="0">
          ${openInVoicing ? `<circle cx="${openPt.x.toFixed(1)}" cy="${openPt.y.toFixed(1)}" r="17.5" fill="none" stroke="var(--accent-voicing)" stroke-width="2.6"/>` : ''}
          ${openInScale && openIv === 0 ? `<circle cx="${openPt.x.toFixed(1)}" cy="${openPt.y.toFixed(1)}" r="16" fill="none" stroke="var(--accent-root)" stroke-width="1.5" stroke-opacity="0.72"/>` : ''}
          <circle cx="${openPt.x.toFixed(1)}" cy="${openPt.y.toFixed(1)}" r="13.2" fill="${openFill}" stroke="${openInScale || openInVoicing ? 'rgba(0,0,0,0.55)' : 'var(--border-strong)'}" stroke-width="1.1"/>
          ${openInScale || openInVoicing ? `<circle cx="${openPt.x.toFixed(1)}" cy="${openPt.y.toFixed(1)}" r="13" fill="url(#saJewelGloss)" style="pointer-events:none"/>` : ''}
          <text x="${openPt.x.toFixed(1)}" y="${(openPt.y + 4).toFixed(1)}" text-anchor="middle" fill="${openInk}" font-size="10.2" font-weight="700">${openLabel}</text>
        </g>
      `);

      if (state.harmonicsOn) {
        SPECTRAL_HARMONICS.filter((h) => h.fretPos <= maxFrets + 0.3).forEach((h) => {
          const hp = layout.pointFromFretFloat(strIdx, h.fretPos);
          const hx = isVertical ? hp.x + 12 : hp.x;
          const hy = isVertical ? hp.y : hp.y - 12.5;
          const hFreq = qToFreq(openQ) * h.ratio;
          parts.push(`
            <g class="note-node" filter="url(#saNoteShadow)" data-kind="harmonic" data-str-idx="${strIdx}" data-cx="${hx.toFixed(1)}" data-cy="${hy.toFixed(1)}" data-freq="${hFreq.toFixed(3)}" data-partial="${h.partial}" data-ji="${h.jiCentsOffset}" data-string="${guitarStrNum}" data-fretpos="${h.fretPos}" data-openq="${openQ}">
              <polygon points="${hx.toFixed(1)},${(hy - 7.5).toFixed(1)} ${(hx + 7.5).toFixed(1)},${hy.toFixed(1)} ${hx.toFixed(1)},${(hy + 7.5).toFixed(1)} ${(hx - 7.5).toFixed(1)},${hy.toFixed(1)}" fill="var(--accent-harmonic)" stroke="#0d1017" stroke-width="1.1"/>
              <text x="${hx.toFixed(1)}" y="${(hy + 3).toFixed(1)}" text-anchor="middle" fill="#0c1220" font-size="8.2" font-weight="800">${h.partial}</text>
            </g>
          `);
        });
      }

      const maxStepQ = maxFrets * 2;
      for (let stepQ = 1; stepQ <= maxStepQ; stepQ += 1) {
        const absQ = openQ + stepQ;
        const pc = mod24(absQ);
        const inScale = allowedMap.has(pc);
        const voicingHit = voicingMap.get(`${strIdx}:${stepQ}`);
        const inRadarB = radarBMap.has(pc);
        if (!inScale && !voicingHit && !inRadarB) continue;

        const intervalQ = inScale
          ? allowedMap.get(pc)
          : (voicingHit ? voicingHit.intervalQ : radarBMap.get(pc));
        const isMicroStep = stepQ % 2 !== 0;
        const fretNum = Math.floor(stepQ / 2);
        if (isMicroStep && fretNum === 0 && state.microMode === 'bend') continue;

        const pt = layout.pointFromStepQ(strIdx, stepQ, state.microMode);
        const isRoot = intervalQ === 0 && inScale;
        const isChar = inScale && charSet.has(intervalQ);
        const isPlaying = state.playingPcQ !== null && state.playingPcQ === pc;

        let fill = 'var(--accent-scale)';
        let ink = 'var(--accent-scale-ink)';
        if (!inScale && voicingHit) {
          fill = 'var(--accent-voicing)';
          ink = '#111318';
        } else if (!inScale && inRadarB) {
          fill = 'var(--accent-radar-b)';
          ink = '#ffffff';
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
        const fontSize = label.length >= 4 ? 8.3 : label.length === 3 ? 9.3 : 10.4;
        const outsideWin = state.fretWindowOn && (fretNum < winMin || fretNum > winMax);
        const dimClass = outsideWin && !voicingHit ? 'is-outside-win' : (activeVoicing && !voicingHit ? 'is-dimmed' : '');

        parts.push(`<g class="note-node ${isPlaying ? 'is-playing' : ''} ${dimClass}" filter="url(#saNoteShadow)" data-kind="note" data-pc="${pc}" data-str-idx="${strIdx}" data-cx="${pt.x.toFixed(1)}" data-cy="${pt.y.toFixed(1)}" data-q="${absQ}" data-string="${guitarStrNum}" data-fret="${isMicroStep ? `${fretNum}+¼` : fretNum}" data-iv="${intervalQ}" data-micro="${isMicroStep ? 1 : 0}">`);

        if (voicingHit) {
          parts.push(`<circle cx="${pt.x.toFixed(1)}" cy="${pt.y.toFixed(1)}" r="16.5" fill="none" stroke="var(--accent-voicing)" stroke-width="2.6"/>`);
        } else if (inScale && inRadarB) {
          parts.push(`<circle cx="${pt.x.toFixed(1)}" cy="${pt.y.toFixed(1)}" r="16" fill="none" stroke="var(--accent-radar-b)" stroke-width="2.2" stroke-dasharray="4 2"/>`);
        } else if (isRoot) {
          parts.push(`<circle cx="${pt.x.toFixed(1)}" cy="${pt.y.toFixed(1)}" r="15.8" fill="none" stroke="var(--accent-root)" stroke-width="1.4" stroke-opacity="0.78"/>`);
          parts.push(`<circle cx="${pt.x.toFixed(1)}" cy="${(pt.y - 16).toFixed(1)}" r="1.8" fill="var(--accent-root)"/>`);
          parts.push(`<circle cx="${pt.x.toFixed(1)}" cy="${(pt.y + 16).toFixed(1)}" r="1.8" fill="var(--accent-root)"/>`);
          parts.push(`<circle cx="${(pt.x - 16).toFixed(1)}" cy="${pt.y.toFixed(1)}" r="1.8" fill="var(--accent-root)"/>`);
          parts.push(`<circle cx="${(pt.x + 16).toFixed(1)}" cy="${pt.y.toFixed(1)}" r="1.8" fill="var(--accent-root)"/>`);
        }

        parts.push(renderThemedNoteMarker({
          cx: pt.x, y: pt.y, fill, ink, label, fontSize, isRoot, isChar, isMicroStep,
          microMode: state.microMode,
          nodeShape: fbSkin.nodeShape || 'jewel'
        }));

        parts.push('</g>');
      }
    }
  }

  parts.push('<g id="fxPulseLayer" style="pointer-events:none"></g>');
  parts.push('<g id="etudePlayheadLayer" style="pointer-events:none"></g>');
  parts.push('<g id="livePitchLayer" style="pointer-events:none"></g>');
  parts.push('</svg>');
  container.innerHTML = parts.join('');

  if (state.etudeActiveIdx >= 0 && state.currentEtude?.events?.[state.etudeActiveIdx]) {
    highlightFretboardEtudeEvent(state.currentEtude.events[state.etudeActiveIdx], state.microMode);
  }

  const svgEl = container.querySelector('svg');

  // Delegated zero-thrash hover pitch-class octave resonance highlight
  let hoveredPc = null;
  svgEl.onmouseover = (ev) => {
    const node = ev.target.closest('.note-node[data-pc]');
    const nextPc = node ? node.dataset.pc : null;
    if (nextPc === hoveredPc) return;
    hoveredPc = nextPc;
    svgEl.querySelectorAll('.note-node.is-same-pc').forEach((el) => el.classList.remove('is-same-pc'));
    if (nextPc !== null) {
      svgEl.querySelectorAll(`.note-node[data-pc="${nextPc}"]`).forEach((el) => el.classList.add('is-same-pc'));
    }
  };
  svgEl.onmouseleave = () => {
    hoveredPc = null;
    svgEl.querySelectorAll('.note-node.is-same-pc').forEach((el) => el.classList.remove('is-same-pc'));
  };

  svgEl.onclick = (ev) => {
    const node = ev.target.closest('.note-node');
    if (!node) return;

    const strIdx = Number(node.dataset.strIdx);
    const nx = Number(node.dataset.cx);
    const ny = Number(node.dataset.cy);
    const kind = node.dataset.kind;

    if (kind === 'scala') {
      const freq = Number(node.dataset.freq);
      const raw = node.dataset.raw;
      const cents = Number(node.dataset.cents);
      const dev = Number(node.dataset.dev);
      const deg = Number(node.dataset.deg);
      const strNum = Number(node.dataset.string);
      const fret = node.dataset.fret;
      synthEngine.pluckFreq(freq, { duration: 1.9, velocity: 0.36 });
      triggerFretboardStringPluck({ strIdx, x: nx, y: ny, color: Math.abs(dev) <= 4 ? 'var(--accent-scale)' : 'var(--accent-micro)' });
      setState({
        inspectedNote: { kind: 'scala', freq, raw, cents, dev, deg, stringNum: strNum, fret }
      });
      return;
    }

    if (kind === 'harmonic') {
      const freq = Number(node.dataset.freq);
      const partial = Number(node.dataset.partial);
      const ji = Number(node.dataset.ji);
      const strNum = Number(node.dataset.string);
      const fretPos = node.dataset.fretpos;
      synthEngine.pluckFreq(freq, { duration: 2.2, velocity: 0.32, harmonicBell: true });
      triggerFretboardStringPluck({ strIdx, x: nx, y: ny, color: 'var(--accent-harmonic)' });
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
    triggerFretboardStringPluck({
      strIdx,
      x: nx,
      y: ny,
      color: isMicro ? 'var(--accent-micro)' : (iv === 0 ? 'var(--accent-root)' : 'var(--accent-scale)')
    });

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

  if (info.kind === 'scala') {
    const sign = info.dev >= 0 ? `+${info.dev.toFixed(1)}` : `${info.dev.toFixed(1)}`;
    strip.innerHTML = `
      <span class="inspector-kv">Scala: <strong>#${info.deg} (${info.raw})</strong></span>
      <span class="inspector-kv">${t(state.lang, 'inspCents')}: <strong>${info.cents.toFixed(1)}¢</strong></span>
      <span class="inspector-kv">${t(state.lang, 'inspFreq')}: <strong>${info.freq.toFixed(2)} Hz</strong></span>
      <span class="inspector-kv">Δ 12-TET: <strong style="color:var(--accent-micro)">${sign}¢</strong></span>
      <span class="inspector-kv">${t(state.lang, 'inspPos')}: <strong>${t(state.lang, 'inspString')} ${info.stringNum} · ${t(state.lang, 'inspFret')} ${info.fret}</strong></span>
    `;
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

/**
 * Minimalist Stage Corner Controls:
 * Only shows 1-tap Orientation Flip (↕ / ↔) + active Closed Window stepper if window is ON.
 * All deeper fretboard controls (Zoom, Lefty, Export PNG/SVG, Micro Mode) live cleanly inside `🎸 Braço & Vista`.
 */
function renderMinimalStageControls(state) {
  const bar = document.getElementById('fretWindowControls');
  if (!bar) return;

  const isVert = getEffectiveOrientation(state) === 'vertical';
  const maxFrets = getEffectiveFretZoom(state);
  const endFret = Math.min(maxFrets, state.fretWindowStart + state.fretWindowSpan);

  bar.innerHTML = `
    <div class="fret-window-bar">
      ${state.fretWindowOn ? `
        <button type="button" class="btn-mini" data-fw-action="shift" data-delta="-1" ${state.fretWindowStart <= 0 ? 'disabled' : ''}>◀</button>
        <span class="mono-tag">${state.fretWindowStart}–${endFret}</span>
        <button type="button" class="btn-mini" data-fw-action="shift" data-delta="1" ${state.fretWindowStart + state.fretWindowSpan >= maxFrets ? 'disabled' : ''}>▶</button>
      ` : ''}
      <button type="button" class="btn-mini ${isVert ? 'active-mini' : ''}" data-fw-action="toggleOrient" title="${t(state.lang, 'orientLabel')}">
        ${isVert ? '↕' : '↔'} ${isVert ? t(state.lang, 'orientVertShort') : t(state.lang, 'orientHorizShort')}
      </button>
    </div>
  `;

  bar.onclick = (e) => {
    const btn = e.target.closest('button[data-fw-action]');
    if (!btn) return;
    const act = btn.dataset.fwAction;
    const st = getState();
    const curMax = getEffectiveFretZoom(st);

    if (act === 'toggleOrient') {
      const curOrient = getEffectiveOrientation(st);
      setState({ fretOrientationMode: curOrient === 'vertical' ? 'horizontal' : 'vertical', fretZoomOverride: null });
    } else if (act === 'shift') {
      const d = Number(btn.dataset.delta);
      const maxStart = Math.max(0, curMax - st.fretWindowSpan);
      setState({ fretWindowStart: Math.max(0, Math.min(maxStart, st.fretWindowStart + d)) });
    }
  };
}
