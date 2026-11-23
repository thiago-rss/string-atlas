/**
 * Interactive 22-Fret Luthier-Grade SVG Fretboard Renderer v7.2
 * - Dynamic 6, 7, or 8 strings
 * - Theme-matched woodgrain / carbon-fiber / matte surfaces, 3D neck curvature gradients,
 *   neck binding with side-dot markers, slotted nut, 3D metallic fret wires,
 *   cast string shadows, wound bass strings, and 6 distinct thematic inlay styles!
 * - 3 Microtonal Modes ('bend', 'slide', 'frets24'), Spectral Harmonics, Voicing Overlay,
 *   Closed-Position Fret Window, Radar Scale B Overlay, Etude Playhead & Live Pitch Mirror.
 */
import { DB } from '../core/database.js';
import { getThemeById } from '../core/themes.js';
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
const SVG_W = 1240;
const NUT_X = 86;
const RIGHT_PAD = 24;
const TOP_Y = 44;
const STRING_GAP = 36;
const INLAY_FRETS = [3, 5, 7, 9, 12, 15, 17, 19, 21];
const INLAY_SET = new Set(INLAY_FRETS);

function computeSvgH(numStrings) {
  return TOP_Y + (numStrings - 1) * STRING_GAP + 54;
}

function buildFretXs() {
  const xs = [NUT_X];
  const usableW = SVG_W - NUT_X - RIGHT_PAD;
  let totalWeight = 0;
  const weights = [];
  for (let f = 1; f <= NUM_FRETS; f += 1) {
    const w = Math.pow(0.958, f - 1);
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
  if (pos <= 0) return NUT_X - 36;
  const fLow = Math.floor(pos);
  const frac = pos - fLow;
  if (fLow >= NUM_FRETS) return FRET_XS[NUM_FRETS];
  return FRET_XS[fLow] + (FRET_XS[fLow + 1] - FRET_XS[fLow]) * frac;
}

function fretCenterX(f) {
  if (f === 0) return NUT_X - 38;
  return (FRET_XS[f - 1] + FRET_XS[f]) / 2;
}

function stepQToX(stepQ, microMode) {
  if (stepQ === 0) return NUT_X - 38;
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

/**
 * Builds rich SVG <defs> for the active theme's fretboard material, metallic frets,
 * slotted nut, carbon/wood grain pattern, and marker shadows.
 */
function buildFretboardDefs(fbSkin) {
  const [w0, w1, w2] = fbSkin.woodStops;
  const [n0, n1, n2] = fbSkin.nutStops;
  const [f0, f1, f2] = fbSkin.fretStops;

  let surfacePattern = '';
  if (fbSkin.grainStyle === 'carbon') {
    surfacePattern = `
      <pattern id="saBoardTexture" width="12" height="12" patternUnits="userSpaceOnUse">
        <rect width="6" height="6" fill="${fbSkin.grainColor}"/>
        <rect x="6" y="6" width="6" height="6" fill="${fbSkin.grainColor}"/>
        <path d="M0 12 L12 0 M-3 3 L3 -3 M9 15 L15 9" stroke="rgba(255,255,255,0.035)" stroke-width="1"/>
      </pattern>
    `;
  } else if (fbSkin.grainStyle === 'matte') {
    surfacePattern = `
      <pattern id="saBoardTexture" width="24" height="24" patternUnits="userSpaceOnUse">
        <circle cx="12" cy="12" r="0.8" fill="${fbSkin.grainColor}"/>
        <line x1="0" y1="0" x2="24" y2="0" stroke="rgba(255,255,255,0.025)" stroke-width="0.6"/>
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
      <linearGradient id="saWoodGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${w0}"/>
        <stop offset="48%" stop-color="${w1}"/>
        <stop offset="100%" stop-color="${w2}"/>
      </linearGradient>

      <linearGradient id="saNutGrad" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="${n0}"/>
        <stop offset="45%" stop-color="${n1}"/>
        <stop offset="100%" stop-color="${n2}"/>
      </linearGradient>

      <linearGradient id="saFretGrad" x1="0" y1="0" x2="1" y2="0">
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

      <linearGradient id="saNeckVignette" x1="0" y1="0" x2="0" y2="1">
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

/**
 * Renders theme-specific fretboard inlays (Pearl Dots, 70s Trapezoids, Doom Monoliths,
 * Djent Sharktooth, Avant Crosshairs, or Brazilian Armorial Sunbursts).
 */
function renderThematicInlays({ fbSkin, numStrings, boardTop, boardH }) {
  const out = [];
  const midY = TOP_Y + STRING_GAP * ((numStrings - 1) / 2);
  const style = fbSkin.inlayStyle || 'pearl_dot';

  INLAY_FRETS.forEach((f) => {
    const cx = fretCenterX(f);
    const fretW = FRET_XS[f] - FRET_XS[f - 1];

    if (style === 'vintage_trapezoid') {
      // Classic 70s Les Paul / SG pearloid trapezoids scaled to each fret width
      const h = f === 12 ? boardH * 0.56 : boardH * 0.48;
      const wTop = Math.min(20, fretW * 0.42);
      const wBot = Math.min(26, fretW * 0.54);
      const y1 = midY - h / 2;
      const y2 = midY + h / 2;
      out.push(`
        <polygon
          points="${(cx - wTop / 2).toFixed(1)},${y1.toFixed(1)} ${(cx + wTop / 2).toFixed(1)},${y1.toFixed(1)} ${(cx + wBot / 2).toFixed(1)},${y2.toFixed(1)} ${(cx - wBot / 2).toFixed(1)},${y2.toFixed(1)}"
          fill="url(#saPearlGrad)" fill-opacity="0.34" stroke="${fbSkin.inlayStroke}" stroke-width="1"
        />
      `);
    } else if (style === 'doom_monolith') {
      // Gothic elongated pointed diamond / double monolith at 12th fret
      const drawGlyph = (gy, scale = 1) => {
        const rx = Math.min(9.5, fretW * 0.24) * scale;
        const ry = 18 * scale;
        return `
          <polygon points="${cx.toFixed(1)},${(gy - ry).toFixed(1)} ${(cx + rx).toFixed(1)},${gy.toFixed(1)} ${cx.toFixed(1)},${(gy + ry).toFixed(1)} ${(cx - rx).toFixed(1)},${gy.toFixed(1)}"
            fill="${fbSkin.inlayFill}" fill-opacity="0.24" stroke="${fbSkin.inlayStroke}" stroke-width="1.1"/>
          <line x1="${cx.toFixed(1)}" y1="${(gy - ry * 0.65).toFixed(1)}" x2="${cx.toFixed(1)}" y2="${(gy + ry * 0.65).toFixed(1)}" stroke="${fbSkin.inlayStroke}" stroke-width="0.9" stroke-opacity="0.7"/>
        `;
      };
      if (f === 12) {
        out.push(drawGlyph(TOP_Y + STRING_GAP * 1.5, 0.85));
        out.push(drawGlyph(TOP_Y + STRING_GAP * (numStrings - 2.5), 0.85));
      } else {
        out.push(drawGlyph(midY, 1));
      }
    } else if (style === 'djent_sharktooth') {
      // Aggressive precision angled sharktooth inlays hugging the bass side
      const xL = FRET_XS[f - 1] + fretW * 0.22;
      const xR = FRET_XS[f] - fretW * 0.2;
      const yBot = boardTop + boardH - 10;
      const yPeak = f === 12 ? boardTop + 14 : boardTop + boardH * 0.42;
      out.push(`
        <polygon points="${xL.toFixed(1)},${yBot.toFixed(1)} ${xR.toFixed(1)},${yBot.toFixed(1)} ${xR.toFixed(1)},${yPeak.toFixed(1)}"
          fill="${fbSkin.inlayFill}" stroke="${fbSkin.inlayStroke}" stroke-width="1" stroke-opacity="0.65"/>
      `);
    } else if (style === 'avant_crosshair') {
      // Fluxus / John Cage technical score crosshairs + registration circles
      const drawCross = (gy) => `
        <g stroke="${fbSkin.inlayStroke}" stroke-width="1" fill="none">
          <circle cx="${cx.toFixed(1)}" cy="${gy.toFixed(1)}" r="7.5"/>
          <line x1="${(cx - 12).toFixed(1)}" y1="${gy.toFixed(1)}" x2="${(cx + 12).toFixed(1)}" y2="${gy.toFixed(1)}"/>
          <line x1="${cx.toFixed(1)}" y1="${(gy - 12).toFixed(1)}" x2="${cx.toFixed(1)}" y2="${(gy + 12).toFixed(1)}"/>
        </g>
      `;
      if (f === 12) {
        out.push(drawCross(TOP_Y + STRING_GAP * 1.5));
        out.push(drawCross(TOP_Y + STRING_GAP * (numStrings - 2.5)));
      } else {
        out.push(drawCross(midY));
      }
    } else if (style === 'armorial_sun') {
      // Brazilian Armorial woodcut 4-pointed sunburst star inlaid in warm pearl & terracotta rim
      const drawStar = (gy, rOut, rIn) => {
        const pts = [];
        for (let k = 0; k < 8; k += 1) {
          const ang = (k * Math.PI) / 4;
          const rad = k % 2 === 0 ? rOut : rIn;
          pts.push(`${(cx + Math.cos(ang) * rad).toFixed(1)},${(gy + Math.sin(ang) * rad).toFixed(1)}`);
        }
        return `<polygon points="${pts.join(' ')}" fill="url(#saPearlGrad)" fill-opacity="0.38" stroke="${fbSkin.inlayStroke}" stroke-width="1"/>`;
      };
      if (f === 12) {
        out.push(drawStar(TOP_Y + STRING_GAP * 1.5, 13, 4.5));
        out.push(drawStar(TOP_Y + STRING_GAP * (numStrings - 2.5), 13, 4.5));
      } else {
        out.push(drawStar(midY, Math.min(14, fretW * 0.34), 4.8));
      }
    } else {
      // Clean Studio Pearloid Dots
      if (f === 12) {
        out.push(`<circle cx="${cx.toFixed(1)}" cy="${(TOP_Y + STRING_GAP * 1.5).toFixed(1)}" r="6.2" fill="url(#saPearlGrad)" fill-opacity="0.34" stroke="${fbSkin.inlayStroke}" stroke-width="0.9"/>`);
        out.push(`<circle cx="${cx.toFixed(1)}" cy="${(TOP_Y + STRING_GAP * (numStrings - 2.5)).toFixed(1)}" r="6.2" fill="url(#saPearlGrad)" fill-opacity="0.34" stroke="${fbSkin.inlayStroke}" stroke-width="0.9"/>`);
      } else {
        out.push(`<circle cx="${cx.toFixed(1)}" cy="${midY.toFixed(1)}" r="6.2" fill="url(#saPearlGrad)" fill-opacity="0.34" stroke="${fbSkin.inlayStroke}" stroke-width="0.9"/>`);
      }
    }

    // Side-dot marker embedded along the top neck binding strip!
    const bindDotY = boardTop - 3;
    if (f === 12) {
      out.push(`<circle cx="${(cx - 4.5).toFixed(1)}" cy="${bindDotY}" r="1.9" fill="${fbSkin.sideDotColor}"/>`);
      out.push(`<circle cx="${(cx + 4.5).toFixed(1)}" cy="${bindDotY}" r="1.9" fill="${fbSkin.sideDotColor}"/>`);
    } else {
      out.push(`<circle cx="${cx.toFixed(1)}" cy="${bindDotY}" r="1.9" fill="${fbSkin.sideDotColor}"/>`);
    }
  });

  return out.join('');
}

export function highlightFretboardEtudeEvent(ev, microMode) {
  const layer = document.getElementById('etudePlayheadLayer');
  if (!layer) return;
  if (!ev) {
    layer.innerHTML = '';
    return;
  }

  const numStrings = getState().customStringsQ.length;
  const visIdx = (numStrings - 1) - ev.strIdx;
  const y = TOP_Y + visIdx * STRING_GAP;
  const x = ev.kind === 'harmonic'
    ? fretPosToX(ev.fret)
    : stepQToX(ev.stepQ, microMode);

  const badgeText = ev.articulation || '';
  layer.innerHTML = `
    <circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="20" fill="none" stroke="var(--accent-etude)" stroke-width="3" stroke-opacity="0.95" class="etude-cursor-ring"/>
    <circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="15" fill="var(--accent-etude)" fill-opacity="0.22"/>
    <rect x="${(x - 14).toFixed(1)}" y="${(y - 31).toFixed(1)}" width="28" height="14" rx="4" fill="var(--accent-etude)"/>
    <text x="${x.toFixed(1)}" y="${(y - 21).toFixed(1)}" text-anchor="middle" fill="#0d1017" font-size="9" font-weight="800" font-family="ui-monospace, monospace">${badgeText}</text>
  `;
}

export function highlightFretboardLivePitch(pitch, state) {
  const layer = document.getElementById('livePitchLayer');
  if (!layer) return;
  if (!pitch || !state.lineShowOnNeck) {
    layer.innerHTML = '';
    return;
  }

  const hits = [];
  const numStrings = state.customStringsQ.length;
  for (let visIdx = 0; visIdx < numStrings; visIdx += 1) {
    const stringArrIdx = (numStrings - 1) - visIdx;
    const openQ = state.customStringsQ[stringArrIdx];
    const stepQ = pitch.nearestQ - openQ;
    if (stepQ < 0 || stepQ > NUM_FRETS * 2) continue;
    if (stepQ === 1 && state.microMode === 'bend') continue;

    const x = stepQToX(stepQ, state.microMode);
    const y = TOP_Y + visIdx * STRING_GAP;
    hits.push({ x, y });
  }

  if (!hits.length) {
    layer.innerHTML = '';
    return;
  }

  const inTune = Math.abs(pitch.centsFrom24) <= 14;
  const stroke = inTune ? 'var(--accent-live)' : 'var(--accent-micro)';

  layer.innerHTML = hits
    .map(
      ({ x, y }) => `
        <circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="19" fill="none" stroke="${stroke}" stroke-width="3" stroke-dasharray="5 3" class="live-pitch-ring"/>
        <circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="7" fill="${stroke}" fill-opacity="0.35"/>
      `
    )
    .join('');
}


/**
 * Renders theme-specific sculptural note marker geometry while preserving unmistakable
 * microtonal indicators (bend badge ↑¼ and slide diamond) and high label legibility.
 */
function renderThemedNoteMarker({ cx, y, fill, ink, label, fontSize, isRoot, isChar, isMicroStep, microMode, nodeShape }) {
  const xStr = cx.toFixed(1);

  // Microtonal slide diamond & micro-bend pill remain unmistakable across all themes
  if (isMicroStep && microMode === 'slide') {
    const r = 13.4;
    return `
      <polygon points="${xStr},${(y - r).toFixed(1)} ${(cx + r).toFixed(1)},${y} ${xStr},${(y + r).toFixed(1)} ${(cx - r).toFixed(1)},${y}" fill="${fill}" stroke="#0d1017" stroke-width="1.2"/>
      <polygon points="${xStr},${(y - r).toFixed(1)} ${(cx + r).toFixed(1)},${y} ${xStr},${(y + r).toFixed(1)} ${(cx - r).toFixed(1)},${y}" fill="url(#saJewelGloss)" style="pointer-events:none"/>
      <text x="${xStr}" y="${(y + 3.5).toFixed(1)}" text-anchor="middle" fill="${ink}" font-size="${fontSize}" font-weight="700">${label}</text>
    `;
  }

  if (isMicroStep && microMode === 'bend') {
    const rx = nodeShape === 'hex' || nodeShape === 'bauhaus' ? 2 : 7;
    return `
      <rect x="${(cx - 14).toFixed(1)}" y="${y - 12}" width="28" height="24" rx="${rx}" fill="${fill}" stroke="#0d1017" stroke-width="1.2"/>
      <rect x="${(cx - 14).toFixed(1)}" y="${y - 12}" width="28" height="24" rx="${rx}" fill="url(#saJewelGloss)" style="pointer-events:none"/>
      <text x="${xStr}" y="${(y + 3.5).toFixed(1)}" text-anchor="middle" fill="${ink}" font-size="${fontSize}" font-weight="700">${label}</text>
      <rect x="${(cx + 5).toFixed(1)}" y="${y - 18}" width="16" height="11" rx="3" fill="#0d1017" stroke="var(--accent-micro)" stroke-width="0.9"/>
      <text x="${(cx + 13).toFixed(1)}" y="${y - 10}" text-anchor="middle" fill="var(--accent-micro)" font-size="7.8" font-weight="800">↑¼</text>
    `;
  }

  if (nodeShape === 'hex') {
    // Djent CNC Machined Hexagon Node
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
    // Doom Carved Octagonal Obsidian Stele Gem
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
    // Avant / Fluxus Graphic Score Geometry: Sharp Square for Root, Crisp Circle for Scale
    if (isRoot) {
      return `
        <rect x="${(cx - 12.5).toFixed(1)}" y="${(y - 12.5).toFixed(1)}" width="25" height="25" rx="1" fill="${fill}" stroke="#ffffff" stroke-width="1.4"/>
        <text x="${xStr}" y="${(y + 3.6).toFixed(1)}" text-anchor="middle" fill="${ink}" font-size="${fontSize}" font-weight="800">${label}</text>
      `;
    }
    return `
      <circle cx="${xStr}" cy="${y}" r="12.2" fill="${fill}" stroke="${isChar ? '#ffffff' : 'rgba(255,255,255,0.45)'}" stroke-width="${isChar ? 2 : 1.1}"/>
      <text x="${xStr}" y="${(y + 3.6).toFixed(1)}" text-anchor="middle" fill="${ink}" font-size="${fontSize}" font-weight="700">${label}</text>
    `;
  }

  if (nodeShape === 'knob') {
    // 70s Vintage Console Dome Knob with Brass Skirt Ring
    return `
      <circle cx="${xStr}" cy="${y}" r="13" fill="#18100a" stroke="rgba(240,210,150,0.48)" stroke-width="1"/>
      <circle cx="${xStr}" cy="${y}" r="11.2" fill="${fill}"/>
      <circle cx="${xStr}" cy="${y}" r="11.2" fill="url(#saJewelGloss)" style="pointer-events:none"/>
      ${isRoot ? `<line x1="${xStr}" y1="${(y - 12.5).toFixed(1)}" x2="${xStr}" y2="${(y - 9.2).toFixed(1)}" stroke="#fff4cc" stroke-width="1.8" stroke-linecap="round"/>` : ''}
      <text x="${xStr}" y="${(y + 3.5).toFixed(1)}" text-anchor="middle" fill="${ink}" font-size="${fontSize}" font-weight="800">${label}</text>
    `;
  }

  if (nodeShape === 'ceramic') {
    // Brazilian Glazed Ceramic Medallion with Warm Clay Rim
    return `
      <circle cx="${xStr}" cy="${y}" r="12.8" fill="${fill}" stroke="#fff4dc" stroke-width="${isRoot ? 2 : 1.2}" stroke-opacity="${isRoot ? 0.9 : 0.65}"/>
      <circle cx="${xStr}" cy="${y}" r="12.2" fill="url(#saJewelGloss)" style="pointer-events:none"/>
      <text x="${xStr}" y="${(y + 3.5).toFixed(1)}" text-anchor="middle" fill="${ink}" font-size="${fontSize}" font-weight="800">${label}</text>
    `;
  }

  // Default ('jewel'): Luminous Celestial Studio Jewel
  return `
    <circle cx="${xStr}" cy="${y}" r="12.4" fill="${fill}" stroke="rgba(0,0,0,0.62)" stroke-width="1.25"/>
    <circle cx="${xStr}" cy="${y}" r="12.1" fill="url(#saJewelGloss)" style="pointer-events:none"/>
    <circle cx="${xStr}" cy="${y}" r="10.9" fill="none" stroke="rgba(255,255,255,0.28)" stroke-width="0.75"/>
    <text x="${xStr}" y="${(y + 3.5).toFixed(1)}" text-anchor="middle" fill="${ink}" font-size="${fontSize}" font-weight="700">${label}</text>
  `;
}

export function renderFretboard(state) {
  const container = document.getElementById('fretboardContainer');
  const titleEl = document.getElementById('activeScaleTitle');
  const formulaEl = document.getElementById('activeFormulaTag');
  const legendEl = document.getElementById('fretboardLegend');
  if (!container) return;

  const activeTheme = getThemeById(state.theme);
  const fbSkin = activeTheme.fretboard;

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
    ${state.activeTab === 'etude' ? `<span class="legend-item"><span class="legend-ring etude"></span>${t(state.lang, 'legendEtudeCursor')}</span>` : ''}
    ${state.lineModeRunning ? `<span class="legend-item"><span class="legend-ring live"></span>${t(state.lang, 'legendLivePitch')}</span>` : ''}
    ${state.radarOverlayOnNeck && state.radarCompareScaleId ? `<span class="legend-item"><span class="legend-ring radar-b"></span>${t(state.lang, 'legendRadarB')}</span>` : ''}
    ${state.harmonicsOn ? `<span class="legend-item"><span class="legend-dot" style="background:var(--accent-harmonic)"></span>${t(state.lang, 'legendHarm')}</span>` : ''}
  `;

  renderFretWindowControls(state);

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

  const numStrings = state.customStringsQ.length;
  const svgH = computeSvgH(numStrings);
  const boardTop = TOP_Y - 16;
  const boardH = STRING_GAP * (numStrings - 1) + 32;
  const boardW = SVG_W - NUT_X - RIGHT_PAD;

  const parts = [];
  parts.push(`<svg class="fretboard-svg" viewBox="0 0 ${SVG_W} ${svgH}" role="img" aria-label="${rootName} ${scaleName}">`);
  parts.push(buildFretboardDefs(fbSkin));

  // Headstock transition area (behind the nut)
  parts.push(`<rect x="10" y="${boardTop - 4}" width="${NUT_X - 18}" height="${boardH + 8}" rx="6" fill="${fbSkin.headstockFill}" fill-opacity="0.88" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>`);

  // Top & Bottom Neck Binding Strips (authentic luthier trim)
  parts.push(`<rect x="${NUT_X - 10}" y="${boardTop - 6}" width="${boardW + 10}" height="6" rx="2" fill="${fbSkin.bindingColor}" stroke="${fbSkin.bindingStroke}" stroke-width="0.9"/>`);
  parts.push(`<rect x="${NUT_X - 10}" y="${boardTop + boardH}" width="${boardW + 10}" height="6" rx="2" fill="${fbSkin.bindingColor}" stroke="${fbSkin.bindingStroke}" stroke-width="0.9"/>`);

  // Main radiused wood / carbon fretboard surface + texture overlay
  parts.push(`<rect x="${NUT_X}" y="${boardTop}" width="${boardW}" height="${boardH}" fill="url(#saWoodGrad)"/>`);
  parts.push(`<rect x="${NUT_X}" y="${boardTop}" width="${boardW}" height="${boardH}" fill="url(#saBoardTexture)"/>`);
  parts.push(`<rect x="${NUT_X}" y="${boardTop}" width="${boardW}" height="${boardH}" fill="url(#saNeckSheen)"/>`);
  parts.push(`<rect x="${NUT_X}" y="${boardTop}" width="${boardW}" height="${boardH}" fill="url(#saNeckVignette)"/>`);

  // Subtle dark shadow cast by the nut onto fret 1
  parts.push(`<rect x="${NUT_X}" y="${boardTop}" width="6" height="${boardH}" fill="#000000" fill-opacity="0.28"/>`);

  // Realistic 3D Slotted Nut
  parts.push(`<rect x="${NUT_X - 10}" y="${boardTop}" width="10" height="${boardH}" rx="1.5" fill="url(#saNutGrad)" stroke="rgba(0,0,0,0.5)" stroke-width="0.9"/>`);

  // Thematic Inlays + Binding Side Dots
  parts.push(renderThematicInlays({ fbSkin, numStrings, boardTop, boardH }));

  // Closed-Position Fretboard Window highlight box
  const winMin = state.fretWindowStart;
  const winMax = Math.min(NUM_FRETS, state.fretWindowStart + state.fretWindowSpan);
  if (state.fretWindowOn) {
    const wx1 = winMin === 0 ? NUT_X - 58 : FRET_XS[Math.max(0, winMin - 1)];
    const wx2 = FRET_XS[winMax];
    parts.push(`<rect x="${wx1}" y="${boardTop}" width="${Math.max(12, wx2 - wx1)}" height="${boardH}" rx="3" fill="var(--accent-scale)" fill-opacity="0.13" stroke="var(--accent-scale)" stroke-width="1.6" stroke-dasharray="5 3"/>`);
  }

  // 3D Metallic Fret Wires & Highlighted Fret Ruler Numbers
  for (let f = 1; f <= NUM_FRETS; f += 1) {
    const x = FRET_XS[f];
    // Cast fret shadow
    parts.push(`<line x1="${(x + 1.6).toFixed(1)}" y1="${boardTop}" x2="${(x + 1.6).toFixed(1)}" y2="${boardTop + boardH}" stroke="#000000" stroke-opacity="0.45" stroke-width="2"/>`);
    // Metallic fret crown
    parts.push(`<rect x="${(x - 1.3).toFixed(1)}" y="${boardTop}" width="2.6" height="${boardH}" rx="1" fill="url(#saFretGrad)"/>`);

    const isInlayFret = INLAY_SET.has(f);
    const numColor = isInlayFret ? 'var(--accent-root)' : 'var(--text-muted)';
    parts.push(`<text x="${fretCenterX(f).toFixed(1)}" y="${svgH - 13}" text-anchor="middle" fill="${numColor}" font-size="${isInlayFret ? 11.5 : 10.2}" font-weight="${isInlayFret ? 700 : 500}" font-family="var(--font-mono, ui-monospace, monospace)">${f}</text>`);

    // 24-TET dashed quarter-tone frets
    if (state.microMode === 'frets24') {
      const microX = (FRET_XS[f - 1] + FRET_XS[f]) / 2;
      parts.push(`<line x1="${microX.toFixed(1)}" y1="${boardTop + 2}" x2="${microX.toFixed(1)}" y2="${boardTop + boardH - 2}" stroke="var(--fret-micro)" stroke-width="1.35" stroke-dasharray="4 4"/>`);
    }
  }

  // Realistic Guitar Strings (Cast Shadow + Plain/Wound Metallic Gauge + Nut Slots)
  const woundStartVisIdx = numStrings <= 6 ? 3 : (numStrings === 7 ? 3 : 3);
  for (let visIdx = 0; visIdx < numStrings; visIdx += 1) {
    const stringArrIdx = (numStrings - 1) - visIdx;
    const openQ = state.customStringsQ[stringArrIdx];
    const y = TOP_Y + visIdx * STRING_GAP;
    const isWound = visIdx >= woundStartVisIdx;
    const strokeW = 1.15 + visIdx * 0.42;

    const openPc = mod24(openQ);
    const openInScale = allowedMap.has(openPc);
    const strColor = openInScale
      ? 'var(--accent-open)'
      : (isWound ? fbSkin.stringWound : fbSkin.stringPlain);

    // Subtle string slot notch on the nut
    parts.push(`<line x1="${NUT_X - 10}" y1="${y}" x2="${NUT_X}" y2="${y}" stroke="rgba(0,0,0,0.55)" stroke-width="${(strokeW + 1).toFixed(1)}"/>`);

    // Cast shadow onto fretboard wood
    parts.push(`<line x1="${NUT_X}" y1="${(y + 2.4).toFixed(1)}" x2="${SVG_W - RIGHT_PAD}" y2="${(y + 2.4).toFixed(1)}" stroke="#000000" stroke-opacity="0.45" stroke-width="${(strokeW + 0.6).toFixed(1)}"/>`);

    // Resonant glow for in-scale open string
    if (openInScale) {
      parts.push(`<line x1="${NUT_X - 8}" y1="${y}" x2="${SVG_W - RIGHT_PAD}" y2="${y}" stroke="var(--accent-open)" stroke-opacity="0.22" stroke-width="${(strokeW + 4).toFixed(1)}"/>`);
    }

    // Core string wire
    parts.push(`<line x1="${NUT_X - 24}" y1="${y}" x2="${SVG_W - RIGHT_PAD}" y2="${y}" stroke="${strColor}" stroke-width="${strokeW.toFixed(2)}" stroke-opacity="${openInScale ? '0.94' : '0.78'}"/>`);

    // Specular highlight / wound ribbing sheen
    if (isWound) {
      parts.push(`<line x1="${NUT_X}" y1="${(y - 0.35).toFixed(2)}" x2="${SVG_W - RIGHT_PAD}" y2="${(y - 0.35).toFixed(2)}" stroke="#ffffff" stroke-opacity="0.28" stroke-width="0.9" stroke-dasharray="2.2 2"/>`);
    } else {
      parts.push(`<line x1="${NUT_X}" y1="${(y - 0.35).toFixed(2)}" x2="${SVG_W - RIGHT_PAD}" y2="${(y - 0.35).toFixed(2)}" stroke="#ffffff" stroke-opacity="0.34" stroke-width="0.65"/>`);
    }

    // String number badge on far left headstock edge
    parts.push(`<text x="19" y="${y + 4}" text-anchor="middle" fill="var(--text-muted)" font-size="10.2" font-weight="600" font-family="var(--font-mono, ui-monospace, monospace)">${visIdx + 1}</text>`);
  }

  // Voicing spine connecting chord notes
  if (activeVoicing && activeVoicing.notes.length >= 2) {
    const pts = activeVoicing.notes
      .map((n) => {
        const visIdx = (numStrings - 1) - n.strIdx;
        const x = stepQToX(n.stepQ, state.microMode);
        const y = TOP_Y + visIdx * STRING_GAP;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');
    parts.push(`<polyline points="${pts}" fill="none" stroke="var(--accent-voicing)" stroke-width="3.2" stroke-opacity="0.52" stroke-linecap="round" stroke-linejoin="round"/>`);
  }

  // Open Strings, Harmonics, Scale, Voicing & Radar B Nodes
  for (let visIdx = 0; visIdx < numStrings; visIdx += 1) {
    const stringArrIdx = (numStrings - 1) - visIdx;
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
    const openCx = NUT_X - 38;

    parts.push(`
      <g class="note-node ${isPlayingOpen ? 'is-playing' : ''} ${state.fretWindowOn && winMin > 0 && !openInVoicing ? 'is-outside-win' : ''}" filter="url(#saNoteShadow)" data-kind="note" data-q="${openQ}" data-string="${visIdx + 1}" data-fret="0" data-iv="${openInScale ? openIv : (openInVoicing ? voicingMap.get(`${stringArrIdx}:0`).intervalQ : -1)}" data-micro="0">
        ${openInVoicing ? `<circle cx="${openCx}" cy="${y}" r="17.5" fill="none" stroke="var(--accent-voicing)" stroke-width="2.6"/>` : ''}
        ${openInScale && openIv === 0 ? `<circle cx="${openCx}" cy="${y}" r="16" fill="none" stroke="var(--accent-root)" stroke-width="1.5" stroke-opacity="0.7"/>` : ''}
        <circle cx="${openCx}" cy="${y}" r="13.2" fill="${openFill}" stroke="${openInScale || openInVoicing ? 'rgba(0,0,0,0.55)' : 'var(--border-strong)'}" stroke-width="1.1"/>
        ${openInScale || openInVoicing ? `<circle cx="${openCx}" cy="${y}" r="13" fill="url(#saJewelGloss)" style="pointer-events:none"/>` : ''}
        <text x="${openCx}" y="${y + 4}" text-anchor="middle" fill="${openInk}" font-size="10.2" font-weight="700">${openLabel}</text>
      </g>
    `);

    if (state.harmonicsOn) {
      SPECTRAL_HARMONICS.forEach((h) => {
        const hx = fretPosToX(h.fretPos);
        const hFreq = qToFreq(openQ) * h.ratio;
        parts.push(`
          <g class="note-node" filter="url(#saNoteShadow)" data-kind="harmonic" data-freq="${hFreq.toFixed(3)}" data-partial="${h.partial}" data-ji="${h.jiCentsOffset}" data-string="${visIdx + 1}" data-fretpos="${h.fretPos}" data-openq="${openQ}">
            <polygon points="${hx.toFixed(1)},${(y - 20).toFixed(1)} ${(hx + 7.5).toFixed(1)},${(y - 12.5).toFixed(1)} ${hx.toFixed(1)},${(y - 5).toFixed(1)} ${(hx - 7.5).toFixed(1)},${(y - 12.5).toFixed(1)}" fill="var(--accent-harmonic)" stroke="#0d1017" stroke-width="1.1"/>
            <text x="${hx.toFixed(1)}" y="${(y - 9.5).toFixed(1)}" text-anchor="middle" fill="#0c1220" font-size="8.2" font-weight="800">${h.partial}</text>
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
      const inRadarB = radarBMap.has(pc);
      if (!inScale && !voicingHit && !inRadarB) continue;

      const intervalQ = inScale
        ? allowedMap.get(pc)
        : (voicingHit ? voicingHit.intervalQ : radarBMap.get(pc));
      const isMicroStep = stepQ % 2 !== 0;
      const fretNum = Math.floor(stepQ / 2);

      if (isMicroStep && fretNum === 0 && state.microMode === 'bend') continue;

      const cx = stepQToX(stepQ, state.microMode);
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

      parts.push(`<g class="note-node ${isPlaying ? 'is-playing' : ''} ${dimClass}" filter="url(#saNoteShadow)" data-kind="note" data-q="${absQ}" data-string="${visIdx + 1}" data-fret="${isMicroStep ? `${fretNum}+¼` : fretNum}" data-iv="${intervalQ}" data-micro="${isMicroStep ? 1 : 0}">`);

      if (voicingHit) {
        parts.push(`<circle cx="${cx.toFixed(1)}" cy="${y}" r="16.5" fill="none" stroke="var(--accent-voicing)" stroke-width="2.6"/>`);
      } else if (inScale && inRadarB) {
        parts.push(`<circle cx="${cx.toFixed(1)}" cy="${y}" r="16" fill="none" stroke="var(--accent-radar-b)" stroke-width="2.2" stroke-dasharray="4 2"/>`);
      } else if (isRoot) {
        // Crown halo ring for instant tonic orientation
        parts.push(`<circle cx="${cx.toFixed(1)}" cy="${y}" r="15.2" fill="none" stroke="var(--accent-root)" stroke-width="1.5" stroke-opacity="0.72"/>`);
      }

      parts.push(renderThemedNoteMarker({
        cx, y, fill, ink, label, fontSize, isRoot, isChar, isMicroStep,
        microMode: state.microMode,
        nodeShape: fbSkin.nodeShape || 'jewel'
      }));

      parts.push('</g>');
    }
  }

  // Dedicated top layers for live Etude Playhead & Live Pitch Mirror
  parts.push('<g id="etudePlayheadLayer" style="pointer-events:none"></g>');
  parts.push('<g id="livePitchLayer" style="pointer-events:none"></g>');
  parts.push('</svg>');
  container.innerHTML = parts.join('');

  if (state.etudeActiveIdx >= 0 && state.currentEtude?.events?.[state.etudeActiveIdx]) {
    highlightFretboardEtudeEvent(state.currentEtude.events[state.etudeActiveIdx], state.microMode);
  }

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

function renderFretWindowControls(state) {
  const bar = document.getElementById('fretWindowControls');
  if (!bar) return;

  const endFret = Math.min(NUM_FRETS, state.fretWindowStart + state.fretWindowSpan);
  bar.innerHTML = `
    <div class="fret-window-bar">
      <button type="button" class="btn-mini ${state.fretWindowOn ? 'active-mini' : ''}" data-fw-action="toggle">
        ${state.fretWindowOn ? `${t(state.lang, 'fretWinClosed')}: ${state.fretWindowStart}–${endFret}` : t(state.lang, 'fretWinFull')}
      </button>
      ${state.fretWindowOn ? `
        <button type="button" class="btn-mini" data-fw-action="shift" data-delta="-1" ${state.fretWindowStart <= 0 ? 'disabled' : ''}>◀ -1</button>
        <button type="button" class="btn-mini" data-fw-action="shift" data-delta="1" ${state.fretWindowStart + state.fretWindowSpan >= NUM_FRETS ? 'disabled' : ''}>+1 ▶</button>
        <span class="mono-tag">${t(state.lang, 'fretWinSpanLabel')}:</span>
        ${[4, 5, 6].map((sp) => `
          <button type="button" class="btn-mini ${state.fretWindowSpan === sp ? 'active-mini' : ''}" data-fw-action="span" data-val="${sp}">${sp}</button>
        `).join('')}
      ` : ''}
    </div>
  `;

  bar.onclick = (e) => {
    const btn = e.target.closest('button[data-fw-action]');
    if (!btn) return;
    const act = btn.dataset.fwAction;
    const st = getState();
    if (act === 'toggle') {
      setState({ fretWindowOn: !st.fretWindowOn });
    } else if (act === 'shift') {
      const d = Number(btn.dataset.delta);
      const maxStart = Math.max(0, NUM_FRETS - st.fretWindowSpan);
      setState({ fretWindowStart: Math.max(0, Math.min(maxStart, st.fretWindowStart + d)) });
    } else if (act === 'span') {
      const sp = Number(btn.dataset.val);
      const maxStart = Math.max(0, NUM_FRETS - sp);
      setState({ fretWindowSpan: sp, fretWindowStart: Math.min(st.fretWindowStart, maxStart) });
    }
  };
}
