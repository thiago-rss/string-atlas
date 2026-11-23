/**
 * Pure Electric Guitar String Tension Physics Engine (24-TET & Multi-Scale Aware)
 * Formula: T_lbs = UW * (2 * L_in * f_Hz)^2 / 386.0886
 * Zero DOM/audio dependencies — supports 6-, 7-, and 8-string guitars, standard & fanned-fret scales,
 * microtonal tunings (exact qToFreq), feel diagnostics, and inverse balanced-gauge recommendation.
 */
import { qToFreq, qToNoteName } from './theory24.js';

export const GRAVITY_IN_S2 = 386.0886;
export const LBS_TO_KG = 0.45359237;
export const IN_TO_MM = 25.4;
const PLAIN_STEEL_K = 0.22274; // rho_steel (0.2836 lb/in^3) * pi / 4

export const SCALE_PRESETS = [
  { id: '24_0',      labelPt: '24.0" (610 mm · Jaguar / Mustang)',        labelEn: '24.0" (610 mm · Jaguar / Mustang)',      treble: 24.0,  bass: 24.0,  multi: false },
  { id: '24_75',     labelPt: '24.75" (629 mm · Les Paul / SG)',          labelEn: '24.75" (629 mm · Les Paul / SG)',        treble: 24.75, bass: 24.75, multi: false },
  { id: '25_0',      labelPt: '25.0" (635 mm · PRS)',                     labelEn: '25.0" (635 mm · PRS)',                   treble: 25.0,  bass: 25.0,  multi: false },
  { id: '25_5',      labelPt: '25.5" (648 mm · Fender / Superstrat)',     labelEn: '25.5" (648 mm · Fender / Superstrat)',   treble: 25.5,  bass: 25.5,  multi: false },
  { id: '26_5',      labelPt: '26.5" (673 mm · 7 Cordas / Estendida)',    labelEn: '26.5" (673 mm · 7-String / Extended)',   treble: 26.5,  bass: 26.5,  multi: false },
  { id: '27_0',      labelPt: '27.0" (686 mm · Barítono B / A Std)',      labelEn: '27.0" (686 mm · Baritone B / A Std)',    treble: 27.0,  bass: 27.0,  multi: false },
  { id: '28_0',      labelPt: '28.0" (711 mm · 8 Cordas / Barítono Longa)', labelEn: '28.0" (711 mm · 8-String / Long Baritone)', treble: 28.0, bass: 28.0, multi: false },
  { id: '30_0',      labelPt: '30.0" (762 mm · Bass VI / Ultra Barítono)', labelEn: '30.0" (762 mm · Bass VI / Ultra Baritone)', treble: 30.0, bass: 30.0, multi: false },
  { id: 'ms_255_265', labelPt: 'Multi-Scale 25.5" – 26.5" (6/7c)',        labelEn: 'Multi-Scale 25.5" – 26.5" (6/7-Str)',    treble: 25.5,  bass: 26.5,  multi: true },
  { id: 'ms_255_270', labelPt: 'Multi-Scale 25.5" – 27.0" (7c)',          labelEn: 'Multi-Scale 25.5" – 27.0" (7-Str)',      treble: 25.5,  bass: 27.0,  multi: true },
  { id: 'ms_255_280', labelPt: 'Multi-Scale 25.5" – 28.0" (8c Djent)',    labelEn: 'Multi-Scale 25.5" – 28.0" (8-Str Djent)', treble: 25.5, bass: 28.0,  multi: true }
];

export const STRING_MATERIALS = [
  { id: 'nickel_plated', labelPt: 'Aço Niquelado (Padrão XL · 1.00×)', labelEn: 'Nickel-Plated Steel (Standard · 1.00×)', woundFactor: 1.00 },
  { id: 'pure_nickel',   labelPt: 'Níquel Puro Vintage (Anos 70 · 1.035×)', labelEn: 'Pure Nickel Vintage (70s · 1.035×)', woundFactor: 1.035 },
  { id: 'stainless',     labelPt: 'Aço Inox (Brilhante / Tech · 0.985×)', labelEn: 'Stainless Steel (Bright / Tech · 0.985×)', woundFactor: 0.985 },
  { id: 'bronze_hybrid', labelPt: 'Bronze Fósforo / Híbrido (1.045×)', labelEn: 'Phosphor Bronze / Hybrid (1.045×)', woundFactor: 1.045 }
];

/**
 * Industry-calibrated Nickel-Plated Steel Wound unit weights (lb/in) vs gauge (inches)
 * Anchored against published D'Addario XL & Stringjoy engineering tension charts.
 */
const WOUND_UW_TABLE = [
  [0.017, 0.0000555],
  [0.018, 0.0000622],
  [0.020, 0.0000756],
  [0.022, 0.0000908],
  [0.024, 0.0001076],
  [0.026, 0.0001266],
  [0.028, 0.0001465],
  [0.030, 0.0001682],
  [0.032, 0.0001912],
  [0.034, 0.0002145],
  [0.036, 0.0002390],
  [0.038, 0.0002655],
  [0.040, 0.0002930],
  [0.042, 0.0003215],
  [0.044, 0.0003515],
  [0.046, 0.0003824],
  [0.048, 0.0004148],
  [0.050, 0.0004490],
  [0.052, 0.0004850],
  [0.054, 0.0005220],
  [0.056, 0.0005600],
  [0.058, 0.0005995],
  [0.060, 0.0006400],
  [0.062, 0.0006820],
  [0.064, 0.0007245],
  [0.066, 0.0007670],
  [0.068, 0.0008100],
  [0.070, 0.0008565],
  [0.072, 0.0009050],
  [0.074, 0.0009550],
  [0.076, 0.0010040],
  [0.078, 0.0010540],
  [0.080, 0.0011050],
  [0.084, 0.0012150],
  [0.090, 0.0013880]
];

export const COMMERCIAL_GAUGES = [
  0.008, 0.0085, 0.009, 0.0095, 0.010, 0.0105, 0.011, 0.0115, 0.012, 0.013,
  0.0135, 0.014, 0.015, 0.016, 0.017, 0.018, 0.019, 0.020, 0.021, 0.022,
  0.024, 0.026, 0.028, 0.030, 0.032, 0.034, 0.036, 0.038, 0.040, 0.042,
  0.044, 0.046, 0.048, 0.050, 0.052, 0.054, 0.056, 0.058, 0.060, 0.062,
  0.064, 0.066, 0.068, 0.070, 0.072, 0.074, 0.076, 0.078, 0.080, 0.084, 0.090
];

/**
 * Curated Gauge Packs ordered from LOWEST string (index 0) to HIGHEST string (index N-1),
 * matching state.customStringsQ order!
 */
export const GAUGE_PACKS = [
  // --- 6-STRING PACKS ---
  {
    id: '6_09_42', stringCount: 6,
    namePt: '.009 – .042 (Super Light · E Std)', nameEn: '.009 – .042 (Super Light · E Std)',
    strings: [
      { gauge: 0.042, wound: true }, { gauge: 0.032, wound: true }, { gauge: 0.024, wound: true },
      { gauge: 0.016, wound: false }, { gauge: 0.011, wound: false }, { gauge: 0.009, wound: false }
    ]
  },
  {
    id: '6_10_46', stringCount: 6,
    namePt: '.010 – .046 (Regular Light · E Std)', nameEn: '.010 – .046 (Regular Light · E Std)',
    strings: [
      { gauge: 0.046, wound: true }, { gauge: 0.036, wound: true }, { gauge: 0.026, wound: true },
      { gauge: 0.017, wound: false }, { gauge: 0.013, wound: false }, { gauge: 0.010, wound: false }
    ]
  },
  {
    id: '6_10_52', stringCount: 6,
    namePt: '.010 – .052 (Light Top / Heavy Bottom · Drop D)', nameEn: '.010 – .052 (Light Top / Heavy Bottom · Drop D)',
    strings: [
      { gauge: 0.052, wound: true }, { gauge: 0.042, wound: true }, { gauge: 0.030, wound: true },
      { gauge: 0.017, wound: false }, { gauge: 0.013, wound: false }, { gauge: 0.010, wound: false }
    ]
  },
  {
    id: '6_11_49', stringCount: 6,
    namePt: '.011 – .049 (Medium · E♭ / D Std)', nameEn: '.011 – .049 (Medium · E♭ / D Std)',
    strings: [
      { gauge: 0.049, wound: true }, { gauge: 0.038, wound: true }, { gauge: 0.028, wound: true },
      { gauge: 0.018, wound: false }, { gauge: 0.014, wound: false }, { gauge: 0.011, wound: false }
    ]
  },
  {
    id: '6_11_56', stringCount: 6,
    namePt: '.011 – .056 (Heavy Bottom · C♯ / C Std)', nameEn: '.011 – .056 (Heavy Bottom · C♯ / C Std)',
    strings: [
      { gauge: 0.056, wound: true }, { gauge: 0.044, wound: true }, { gauge: 0.032, wound: true },
      { gauge: 0.019, wound: false }, { gauge: 0.014, wound: false }, { gauge: 0.011, wound: false }
    ]
  },
  {
    id: '6_12_60', stringCount: 6,
    namePt: '.012 – .060 (Barítono Médio · B Std / Drop B)', nameEn: '.012 – .060 (Baritone Medium · B Std / Drop B)',
    strings: [
      { gauge: 0.060, wound: true }, { gauge: 0.046, wound: true }, { gauge: 0.034, wound: true },
      { gauge: 0.022, wound: true }, { gauge: 0.016, wound: false }, { gauge: 0.012, wound: false }
    ]
  },
  {
    id: '6_13_62', stringCount: 6,
    namePt: '.013 – .062 (Barítono Firme · B Std / A Std)', nameEn: '.013 – .062 (Baritone Firm · B Std / A Std)',
    strings: [
      { gauge: 0.062, wound: true }, { gauge: 0.046, wound: true }, { gauge: 0.036, wound: true },
      { gauge: 0.026, wound: true }, { gauge: 0.017, wound: false }, { gauge: 0.013, wound: false }
    ]
  },
  {
    id: '6_14_68', stringCount: 6,
    namePt: '.014 – .068 (Barítono Grave · A Standard / Drop A)', nameEn: '.014 – .068 (Low Baritone · A Standard / Drop A)',
    strings: [
      { gauge: 0.068, wound: true }, { gauge: 0.052, wound: true }, { gauge: 0.038, wound: true },
      { gauge: 0.026, wound: true }, { gauge: 0.018, wound: false }, { gauge: 0.014, wound: false }
    ]
  },

  // --- 7-STRING PACKS ---
  {
    id: '7_09_54', stringCount: 7,
    namePt: '7c .009 – .054 (Light · 7c B Std)', nameEn: '7-Str .009 – .054 (Light · 7c B Std)',
    strings: [
      { gauge: 0.054, wound: true }, { gauge: 0.042, wound: true }, { gauge: 0.032, wound: true },
      { gauge: 0.024, wound: true }, { gauge: 0.016, wound: false }, { gauge: 0.011, wound: false },
      { gauge: 0.009, wound: false }
    ]
  },
  {
    id: '7_10_59', stringCount: 7,
    namePt: '7c .010 – .059 (Regular · 7c B Std)', nameEn: '7-Str .010 – .059 (Regular · 7c B Std)',
    strings: [
      { gauge: 0.059, wound: true }, { gauge: 0.046, wound: true }, { gauge: 0.036, wound: true },
      { gauge: 0.026, wound: true }, { gauge: 0.017, wound: false }, { gauge: 0.013, wound: false },
      { gauge: 0.010, wound: false }
    ]
  },
  {
    id: '7_10_64', stringCount: 7,
    namePt: '7c .010 – .064 (Heavy Bottom · 7c Drop A)', nameEn: '7-Str .010 – .064 (Heavy Bottom · 7c Drop A)',
    strings: [
      { gauge: 0.064, wound: true }, { gauge: 0.048, wound: true }, { gauge: 0.036, wound: true },
      { gauge: 0.026, wound: true }, { gauge: 0.017, wound: false }, { gauge: 0.013, wound: false },
      { gauge: 0.010, wound: false }
    ]
  },
  {
    id: '7_11_68', stringCount: 7,
    namePt: '7c .011 – .068 (Barítono · 7c A Std / Drop G)', nameEn: '7-Str .011 – .068 (Baritone · 7c A Std / Drop G)',
    strings: [
      { gauge: 0.068, wound: true }, { gauge: 0.052, wound: true }, { gauge: 0.038, wound: true },
      { gauge: 0.028, wound: true }, { gauge: 0.018, wound: false }, { gauge: 0.014, wound: false },
      { gauge: 0.011, wound: false }
    ]
  },

  // --- 8-STRING PACKS ---
  {
    id: '8_09_74', stringCount: 8,
    namePt: '8c .009 – .074 (Light · 8c F♯ Std)', nameEn: '8-Str .009 – .074 (Light · 8c F♯ Std)',
    strings: [
      { gauge: 0.074, wound: true }, { gauge: 0.054, wound: true }, { gauge: 0.042, wound: true },
      { gauge: 0.032, wound: true }, { gauge: 0.024, wound: true }, { gauge: 0.016, wound: false },
      { gauge: 0.011, wound: false }, { gauge: 0.009, wound: false }
    ]
  },
  {
    id: '8_10_74', stringCount: 8,
    namePt: '8c .010 – .074 (Regular · 8c F♯ / F Std)', nameEn: '8-Str .010 – .074 (Regular · 8c F♯ / F Std)',
    strings: [
      { gauge: 0.074, wound: true }, { gauge: 0.056, wound: true }, { gauge: 0.046, wound: true },
      { gauge: 0.036, wound: true }, { gauge: 0.026, wound: true }, { gauge: 0.017, wound: false },
      { gauge: 0.013, wound: false }, { gauge: 0.010, wound: false }
    ]
  },
  {
    id: '8_10_80', stringCount: 8,
    namePt: '8c .010 – .080 (Heavy · 8c Drop E / Meshuggah)', nameEn: '8-Str .010 – .080 (Heavy · 8c Drop E / Meshuggah)',
    strings: [
      { gauge: 0.080, wound: true }, { gauge: 0.060, wound: true }, { gauge: 0.046, wound: true },
      { gauge: 0.036, wound: true }, { gauge: 0.026, wound: true }, { gauge: 0.017, wound: false },
      { gauge: 0.013, wound: false }, { gauge: 0.010, wound: false }
    ]
  },
  {
    id: '8_11_84', stringCount: 8,
    namePt: '8c .011 – .084 (Ultra-Low · 8c Drop E / E♭)', nameEn: '8-Str .011 – .084 (Ultra-Low · 8c Drop E / E♭)',
    strings: [
      { gauge: 0.084, wound: true }, { gauge: 0.064, wound: true }, { gauge: 0.048, wound: true },
      { gauge: 0.038, wound: true }, { gauge: 0.028, wound: true }, { gauge: 0.018, wound: false },
      { gauge: 0.014, wound: false }, { gauge: 0.011, wound: false }
    ]
  }
];

export function getDefaultPackForCount(stringCount, tuningId = '') {
  if (stringCount === 8) {
    return GAUGE_PACKS.find((p) => p.id === (tuningId.includes('drop') || tuningId.includes('meshuggah') ? '8_10_80' : '8_10_74')) || GAUGE_PACKS.find((p) => p.stringCount === 8);
  }
  if (stringCount === 7) {
    return GAUGE_PACKS.find((p) => p.id === (tuningId.includes('a') || tuningId.includes('g') ? '7_10_64' : '7_10_59')) || GAUGE_PACKS.find((p) => p.stringCount === 7);
  }
  if (tuningId === 'a_standard' || tuningId === 'drop_a' || tuningId === 'drop_g') {
    return GAUGE_PACKS.find((p) => p.id === '6_14_68');
  }
  if (tuningId === 'b_standard' || tuningId === 'drop_b' || tuningId === 'baritone_bfbeb') {
    return GAUGE_PACKS.find((p) => p.id === '6_13_62');
  }
  return GAUGE_PACKS.find((p) => p.id === '6_10_46');
}

export function getUnitWeight(gaugeIn, wound = false, materialId = 'nickel_plated') {
  const g = Math.max(0.006, Math.min(0.11, Number(gaugeIn) || 0.010));
  if (!wound) {
    return PLAIN_STEEL_K * g * g;
  }

  const mat = STRING_MATERIALS.find((m) => m.id === materialId) || STRING_MATERIALS[0];
  const factor = mat.woundFactor;

  // Interpolate WOUND_UW_TABLE
  if (g <= WOUND_UW_TABLE[0][0]) {
    const [g0, uw0] = WOUND_UW_TABLE[0];
    return uw0 * Math.pow(g / g0, 2) * factor;
  }
  const last = WOUND_UW_TABLE[WOUND_UW_TABLE.length - 1];
  if (g >= last[0]) {
    return last[1] * Math.pow(g / last[0], 2) * factor;
  }
  for (let i = 0; i < WOUND_UW_TABLE.length - 1; i += 1) {
    const [gA, uwA] = WOUND_UW_TABLE[i];
    const [gB, uwB] = WOUND_UW_TABLE[i + 1];
    if (g >= gA && g <= gB) {
      const ratio = (g - gA) / (gB - gA);
      return (uwA + (uwB - uwA) * ratio) * factor;
    }
  }
  return PLAIN_STEEL_K * 0.8 * g * g * factor;
}

export function calculateStringTensionLbs({ freqHz, scaleIn, gaugeIn, wound, materialId = 'nickel_plated' }) {
  const uw = getUnitWeight(gaugeIn, wound, materialId);
  const vel = 2 * scaleIn * freqHz;
  return (uw * vel * vel) / GRAVITY_IN_S2;
}

export function classifyTensionFeel(lbs) {
  if (lbs < 11.2) return 'floppy';
  if (lbs < 14.5) return 'light';
  if (lbs <= 19.8) return 'balanced';
  if (lbs <= 23.8) return 'heavy';
  return 'stiff';
}

export function formatGaugeCode(gaugeIn, wound) {
  const thousandths = Math.round(gaugeIn * 10000) / 10;
  const str = Number.isInteger(thousandths)
    ? String(thousandths).padStart(2, '0')
    : String(thousandths).padStart(4, '0');
  return `.0${str}${wound ? 'W' : 'P'}`;
}

/**
 * Calculates full tension telemetry for all strings of the active instrument.
 */
export function calculateSetTension({
  stringsQ,
  gauges,
  scaleTrebleIn = 25.5,
  scaleBassIn = 25.5,
  multiScale = false,
  materialId = 'nickel_plated'
}) {
  const numStrings = stringsQ.length;
  const rows = [];

  for (let idx = 0; idx < numStrings; idx += 1) {
    const sq = stringsQ[idx];
    const freqHz = qToFreq(sq);
    // idx 0 = lowest (bass) string -> scaleBassIn; idx N-1 = highest (treble) string -> scaleTrebleIn
    const t = numStrings > 1 ? idx / (numStrings - 1) : 0;
    const effScaleIn = multiScale
      ? scaleBassIn + (scaleTrebleIn - scaleBassIn) * t
      : scaleTrebleIn;

    const gEntry = gauges[idx] || { gauge: 0.010, wound: false };
    const lbs = calculateStringTensionLbs({
      freqHz,
      scaleIn: effScaleIn,
      gaugeIn: gEntry.gauge,
      wound: Boolean(gEntry.wound),
      materialId
    });
    const kg = lbs * LBS_TO_KG;

    rows.push({
      strIdx: idx,
      guitarStr: numStrings - idx, // 6..1 (or 7..1 / 8..1)
      q: sq,
      noteName: qToNoteName(sq, true),
      freqHz,
      scaleIn: effScaleIn,
      scaleMm: effScaleIn * IN_TO_MM,
      gauge: gEntry.gauge,
      wound: Boolean(gEntry.wound),
      gaugeCode: formatGaugeCode(gEntry.gauge, Boolean(gEntry.wound)),
      lbs,
      kg,
      feel: classifyTensionFeel(lbs)
    });
  }

  const totalLbs = rows.reduce((acc, r) => acc + r.lbs, 0);
  const totalKg = totalLbs * LBS_TO_KG;
  const lbsVals = rows.map((r) => r.lbs);
  const minLbs = Math.min(...lbsVals);
  const maxLbs = Math.max(...lbsVals);
  const avgLbs = totalLbs / Math.max(1, numStrings);

  const plainRows = rows.filter((r) => !r.wound);
  const woundRows = rows.filter((r) => r.wound);
  const plainAvgLbs = plainRows.length ? plainRows.reduce((a, r) => a + r.lbs, 0) / plainRows.length : 0;
  const woundAvgLbs = woundRows.length ? woundRows.reduce((a, r) => a + r.lbs, 0) / woundRows.length : 0;

  // Balance score (100% = zero variance across strings; penalizes excessive spread)
  const spreadLbs = maxLbs - minLbs;
  const balanceScore = Math.max(0, Math.min(100, Math.round(100 - (spreadLbs / Math.max(1, avgLbs)) * 95)));

  // High-to-low display order (String 1 high -> String N low)
  const displayRows = [...rows].reverse();

  return {
    rows,         // idx 0 (low) .. N-1 (high)
    displayRows,  // String 1 (high) .. String N (low)
    totalLbs,
    totalKg,
    avgLbs,
    avgKg: avgLbs * LBS_TO_KG,
    minLbs,
    maxLbs,
    spreadLbs,
    plainAvgLbs,
    woundAvgLbs,
    balanceScore
  };
}

/**
 * Inverse Solver: recommends the closest commercial gauge for every string to hit targetLbs
 * (with optional slight progressive bassBiasLbs on wound strings for crisp low-end pick attack).
 */
export function recommendBalancedGauges({
  stringsQ,
  scaleTrebleIn = 25.5,
  scaleBassIn = 25.5,
  multiScale = false,
  materialId = 'nickel_plated',
  targetLbs = 16.5,
  bassBiasLbs = 1.4
}) {
  const numStrings = stringsQ.length;
  const result = [];

  for (let idx = 0; idx < numStrings; idx += 1) {
    const sq = stringsQ[idx];
    const freqHz = qToFreq(sq);
    const frac = numStrings > 1 ? idx / (numStrings - 1) : 0;
    const effScaleIn = multiScale
      ? scaleBassIn + (scaleTrebleIn - scaleBassIn) * frac
      : scaleTrebleIn;

    // Decide natural Plain vs Wound crossover: <= 190 Hz (below G3) or lowest N-3 strings -> Wound
    const isWound = freqHz <= 188 || idx < Math.max(3, numStrings - 3);
    // Subtle progressive boost on lower wound strings (prevents floppy low B/A/E strings)
    const desiredLbs = targetLbs + (isWound ? bassBiasLbs * (1 - frac) : 0);

    const candidateGauges = isWound
      ? COMMERCIAL_GAUGES.filter((g) => g >= 0.018)
      : COMMERCIAL_GAUGES.filter((g) => g <= 0.022);

    let bestGauge = candidateGauges[0];
    let bestErr = Infinity;
    for (const g of candidateGauges) {
      const lbs = calculateStringTensionLbs({ freqHz, scaleIn: effScaleIn, gaugeIn: g, wound: isWound, materialId });
      const err = Math.abs(lbs - desiredLbs);
      if (err < bestErr) {
        bestErr = err;
        bestGauge = g;
      }
    }

    result.push({ gauge: bestGauge, wound: isWound });
  }

  return result;
}
