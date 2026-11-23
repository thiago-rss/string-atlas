/**
 * Pure 24-TET Perceptual Ear Training Engine
 * Modes:
 * - 'micro_intervals': Quarter-tone vs 12-TET interval discrimination (100c vs 150c vs 200c, 300c vs 350c vs 400c, etc.)
 * - 'scales_modes': Maqam, Greek, Messiaen & Raga listening recognition
 * - 'chord_colors': Non-tercial, Post-tonal & Microtonal chord color recognition
 */
import { mod24 } from './theory24.js';

export const MICRO_INTERVAL_SETS = [
  {
    id: 'seconds',
    labelPt: 'Segundas (♭2 · 2½♭ · 2)',
    labelEn: 'Seconds (♭2 · 2½♭ · 2)',
    items: [
      { id: 'iv_2',  intervalQ: 2,  labelPt: '♭2 · 2ª Menor (100¢ · Kurd/Frígio)', labelEn: '♭2 · Minor 2nd (100¢ · Kurd/Phrygian)' },
      { id: 'iv_3',  intervalQ: 3,  labelPt: '2½♭ · 2ª Neutra (150¢ · Bayati)', labelEn: '2½♭ · Neutral 2nd (150¢ · Bayati)' },
      { id: 'iv_4',  intervalQ: 4,  labelPt: '2 · 2ª Maior (200¢ · Dórico/Rast)', labelEn: '2 · Major 2nd (200¢ · Dorian/Rast)' }
    ]
  },
  {
    id: 'thirds',
    labelPt: 'Terças (♭3 · 3½♭ · 3)',
    labelEn: 'Thirds (♭3 · 3½♭ · 3)',
    items: [
      { id: 'iv_6',  intervalQ: 6,  labelPt: '♭3 · 3ª Menor (300¢ · Nahawand)', labelEn: '♭3 · Minor 3rd (300¢ · Nahawand)' },
      { id: 'iv_7',  intervalQ: 7,  labelPt: '3½♭ · 3ª Neutra (350¢ · Rast)', labelEn: '3½♭ · Neutral 3rd (350¢ · Rast)' },
      { id: 'iv_8',  intervalQ: 8,  labelPt: '3 · 3ª Maior (400¢ · Hijaz/Ajam)', labelEn: '3 · Major 3rd (400¢ · Hijaz/Ajam)' }
    ]
  },
  {
    id: 'sixths_sevenths',
    labelPt: 'Sextas & Sétimas Neutras',
    labelEn: 'Neutral 6ths & 7ths',
    items: [
      { id: 'iv_16', intervalQ: 16, labelPt: '♭6 · 6ª Menor (800¢)', labelEn: '♭6 · Minor 6th (800¢)' },
      { id: 'iv_17', intervalQ: 17, labelPt: '6½♭ · 6ª Neutra (850¢ · Hijaz)', labelEn: '6½♭ · Neutral 6th (850¢ · Hijaz)' },
      { id: 'iv_20', intervalQ: 20, labelPt: '♭7 · 7ª Menor (1000¢)', labelEn: '♭7 · Minor 7th (1000¢)' },
      { id: 'iv_21', intervalQ: 21, labelPt: '7½♭ · 7ª Neutra (1050¢ · Rast)', labelEn: '7½♭ · Neutral 7th (1050¢ · Rast)' }
    ]
  },
  {
    id: 'all_24',
    labelPt: 'Desafio Completo (Microtons + Trítono)',
    labelEn: 'Full Challenge (Microtones + Tritone)',
    items: [
      { id: 'iv_2',  intervalQ: 2,  labelPt: '♭2 · 100¢', labelEn: '♭2 · 100¢' },
      { id: 'iv_3',  intervalQ: 3,  labelPt: '2½♭ · 150¢ (Bayati)', labelEn: '2½♭ · 150¢ (Bayati)' },
      { id: 'iv_6',  intervalQ: 6,  labelPt: '♭3 · 300¢', labelEn: '♭3 · 300¢' },
      { id: 'iv_7',  intervalQ: 7,  labelPt: '3½♭ · 350¢ (Rast)', labelEn: '3½♭ · 350¢ (Rast)' },
      { id: 'iv_8',  intervalQ: 8,  labelPt: '3 · 400¢', labelEn: '3 · 400¢' },
      { id: 'iv_12', intervalQ: 12, labelPt: '♯4 · Trítono (600¢)', labelEn: '♯4 · Tritone (600¢)' }
    ]
  }
];

function shuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Generates a self-contained Ear Training quiz question.
 */
export function createEarQuestion({
  mode = 'micro_intervals',
  intervalSetId = 'seconds',
  scalePool = 'arabic',
  rootQ = 4,
  scales = [],
  chords = []
}) {
  const baseQ = 96 + mod24(rootQ); // Guitar middle register (octave 3)

  if (mode === 'micro_intervals') {
    const setObj = MICRO_INTERVAL_SETS.find((s) => s.id === intervalSetId) || MICRO_INTERVAL_SETS[0];
    const pool = setObj.items;
    const chosen = pool[Math.floor(Math.random() * pool.length)];

    return {
      mode,
      rootQ: mod24(rootQ),
      baseQ,
      answerId: chosen.id,
      answerPlaySpec: { type: 'interval', baseQ, targetQ: baseQ + chosen.intervalQ },
      choices: pool.map((it) => ({
        id: it.id,
        labelPt: it.labelPt,
        labelEn: it.labelEn,
        playSpec: { type: 'interval', baseQ, targetQ: baseQ + it.intervalQ }
      }))
    };
  }

  if (mode === 'chord_colors') {
    const pool = chords.length >= 4 ? chords : [];
    const picked = shuffle(pool).slice(0, 4);
    const answer = picked[Math.floor(Math.random() * picked.length)];

    return {
      mode,
      rootQ: mod24(rootQ),
      baseQ,
      answerId: answer.id,
      inspectChordId: answer.id,
      answerPlaySpec: { type: 'chord', rootQ: mod24(rootQ), intervalsQ: answer.intervalsQ },
      choices: picked.map((ch) => ({
        id: ch.id,
        labelPt: `${ch.symbol} — ${ch.namePt}`,
        labelEn: `${ch.symbol} — ${ch.nameEn}`,
        playSpec: { type: 'chord', rootQ: mod24(rootQ), intervalsQ: ch.intervalsQ }
      }))
    };
  }

  // Default: 'scales_modes'
  const filtered = scalePool === 'all'
    ? scales
    : scales.filter((s) => s.category === scalePool);
  const workingPool = filtered.length >= 4 ? filtered : scales;
  const picked = shuffle(workingPool).slice(0, 4);
  const answer = picked[Math.floor(Math.random() * picked.length)];

  return {
    mode: 'scales_modes',
    rootQ: mod24(rootQ),
    baseQ,
    answerId: answer.id,
    inspectScaleId: answer.id,
    answerPlaySpec: { type: 'scale', rootQ: mod24(rootQ), intervalsQ: answer.intervalsQ },
    choices: picked.map((sc) => ({
      id: sc.id,
      labelPt: sc.namePt,
      labelEn: sc.nameEn,
      playSpec: { type: 'scale', rootQ: mod24(rootQ), intervalsQ: sc.intervalsQ }
    }))
  };
}
