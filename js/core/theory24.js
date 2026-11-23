/**
 * Core 24-TET Music Theory, Staff Spelling & Acoustics Engine
 * Quarter-tone index q = MIDI * 2 (C4 = 120, A4 = 138, E2 = 80)
 */

export const Q_PER_OCTAVE = 24;
export const A4_Q = 138;
export const A4_HZ = 440;
export const A4_MIN_HZ = 415;
export const A4_MAX_HZ = 446;
export const A4_PRESETS = [415, 432, 440, 442];

let currentReferenceA4 = A4_HZ;

export function getReferenceA4() {
  return currentReferenceA4;
}

export function setReferenceA4(hz) {
  const num = Number(hz);
  if (!Number.isFinite(num)) return currentReferenceA4;
  const clamped = Math.max(A4_MIN_HZ, Math.min(A4_MAX_HZ, Math.round(num * 2) / 2));
  currentReferenceA4 = clamped;
  return currentReferenceA4;
}

export const NOTE_NAMES_24 = [
  'C', 'C½♯', 'C♯', 'D½♭',
  'D', 'D½♯', 'E♭', 'E½♭',
  'E', 'E½♯', 'F', 'F½♯',
  'F♯', 'G½♭', 'G', 'G½♯',
  'A♭', 'A½♭', 'A', 'A½♯',
  'B♭', 'B½♭', 'B', 'B½♯'
];

export const INTERVAL_NAMES_24 = [
  '1', '1½♯', '♭2', '2½♭',
  '2', '2½♯', '♭3', '3½♭',
  '3', '3½♯', '4', '4½♯',
  '♯4', '5½♭', '5', '5½♯',
  '♭6', '6½♭', '6', '6½♯',
  '♭7', '7½♭', '7', '7½♯'
];

/**
 * Maps each 24-TET pitch class (0..23) to diatonic letter index (C=0..B=6) + accidental glyph
 * for legible 24-TET treble-clef staff rendering.
 */
export const STAFF_SPELLINGS_24 = [
  { letter: 0, acc: '' },    // 0  C
  { letter: 0, acc: '½♯' },  // 1  C½♯
  { letter: 0, acc: '♯' },   // 2  C♯
  { letter: 1, acc: '½♭' },  // 3  D½♭
  { letter: 1, acc: '' },    // 4  D
  { letter: 1, acc: '½♯' },  // 5  D½♯
  { letter: 2, acc: '♭' },   // 6  E♭
  { letter: 2, acc: '½♭' },  // 7  E½♭
  { letter: 2, acc: '' },    // 8  E
  { letter: 2, acc: '½♯' },  // 9  E½♯
  { letter: 3, acc: '' },    // 10 F
  { letter: 3, acc: '½♯' },  // 11 F½♯
  { letter: 3, acc: '♯' },   // 12 F♯
  { letter: 4, acc: '½♭' },  // 13 G½♭
  { letter: 4, acc: '' },    // 14 G
  { letter: 4, acc: '½♯' },  // 15 G½♯
  { letter: 5, acc: '♭' },   // 16 A♭
  { letter: 5, acc: '½♭' },  // 17 A½♭
  { letter: 5, acc: '' },    // 18 A
  { letter: 5, acc: '½♯' },  // 19 A½♯
  { letter: 6, acc: '♭' },   // 20 B♭
  { letter: 6, acc: '½♭' },  // 21 B½♭
  { letter: 6, acc: '' },    // 22 B
  { letter: 6, acc: '½♯' }   // 23 B½♯
];

export const SPECTRAL_HARMONICS = [
  { partial: 2, ratio: 2, fretPos: 12.0, jiCentsOffset: 0, intervalLabel: 'P8 (2º)' },
  { partial: 3, ratio: 3, fretPos: 7.02, jiCentsOffset: +2, intervalLabel: 'P12 (3º)' },
  { partial: 3, ratio: 3, fretPos: 19.02, jiCentsOffset: +2, intervalLabel: 'P12 (3º)' },
  { partial: 4, ratio: 4, fretPos: 5.0, jiCentsOffset: 0, intervalLabel: '2P8 (4º)' },
  { partial: 5, ratio: 5, fretPos: 3.86, jiCentsOffset: -14, intervalLabel: 'M17 (5º)' },
  { partial: 5, ratio: 5, fretPos: 8.84, jiCentsOffset: -14, intervalLabel: 'M17 (5º)' },
  { partial: 5, ratio: 5, fretPos: 15.86, jiCentsOffset: -14, intervalLabel: 'M17 (5º)' },
  { partial: 7, ratio: 7, fretPos: 2.67, jiCentsOffset: -31, intervalLabel: 'm21 (7º)' },
  { partial: 7, ratio: 7, fretPos: 9.69, jiCentsOffset: -31, intervalLabel: 'm21 (7º)' }
];

export function mod24(n) {
  return ((n % Q_PER_OCTAVE) + Q_PER_OCTAVE) % Q_PER_OCTAVE;
}

export function qToFreq(q, a4Hz = currentReferenceA4) {
  return a4Hz * Math.pow(2, (q - A4_Q) / Q_PER_OCTAVE);
}

export function qToPitchClass(q) {
  return mod24(q);
}

export function qToOctave(q) {
  return Math.floor(q / Q_PER_OCTAVE) - 1;
}

export function qToNoteName(q, withOctave = false) {
  const pc = qToPitchClass(q);
  const name = NOTE_NAMES_24[pc];
  return withOctave ? `${name}${qToOctave(q)}` : name;
}

/**
 * Guitar written staff position (written one octave above sounding pitch).
 * Returns diatonic step index relative to written E4 (bottom line of treble staff = 0).
 * E4 = 0, F4 = 1, G4 = 2, A4 = 3, B4 = 4, C5 = 5, D5 = 6, E5 = 7, F5 = 8.
 */
export function qToGuitarStaffPos(q) {
  const writtenQ = q + Q_PER_OCTAVE;
  const pc = qToPitchClass(writtenQ);
  const octave = qToOctave(writtenQ);
  const sp = STAFF_SPELLINGS_24[pc];
  // E4 has octave 4, letter 2 => absolute diatonic = 4*7 + 2 = 30
  const absDiatonic = octave * 7 + sp.letter;
  return {
    stepFromE4: absDiatonic - 30,
    accidental: sp.acc,
    isMicro: pc % 2 !== 0
  };
}

export function isQuarterTone(q) {
  return mod24(q) % 2 !== 0;
}

export function intervalQToLabel(intervalQ) {
  return INTERVAL_NAMES_24[mod24(intervalQ)];
}

export function intervalQToCents(intervalQ) {
  return mod24(intervalQ) * 50;
}

export function computeIntervalVector(intervalsQ) {
  if (intervalsQ.some((q) => mod24(q) % 2 !== 0)) {
    return null;
  }
  const pcs = [...new Set(intervalsQ.map((q) => mod24(q) / 2))].sort((a, b) => a - b);
  const vec = [0, 0, 0, 0, 0, 0];
  for (let i = 0; i < pcs.length; i += 1) {
    for (let j = i + 1; j < pcs.length; j += 1) {
      const diff = (pcs[j] - pcs[i] + 12) % 12;
      const ic = Math.min(diff, 12 - diff);
      if (ic >= 1 && ic <= 6) {
        vec[ic - 1] += 1;
      }
    }
  }
  return vec;
}

export function formatStepFormula(intervalsQ) {
  const sorted = [...intervalsQ].sort((a, b) => a - b);
  const steps = [];
  for (let i = 0; i < sorted.length; i += 1) {
    const next = i + 1 < sorted.length ? sorted[i + 1] : 24;
    const diffQ = next - sorted[i];
    steps.push(formatQStep(diffQ));
  }
  return steps.join(' · ');
}

function formatQStep(q) {
  const map = {
    1: '¼',
    2: '½',
    3: '¾',
    4: '1',
    5: '1¼',
    6: '1½',
    7: '1¾',
    8: '2'
  };
  return map[q] || `${q / 2}`;
}

export function gcd(a, b) {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
}

export function lcm(a, b) {
  return Math.abs(a * b) / gcd(a, b);
}
