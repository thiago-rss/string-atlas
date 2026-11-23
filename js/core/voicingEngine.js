/**
 * Dynamic Scordatura-Aware Guitar Voicing Engine (12-TET & 24-TET)
 * Computes ergonomic voicings across any 6-string tuning and any harmonic structure
 * (quartal stacks, clusters, Drop 2/3, pitch-class sets, and microtonal dyads/chords).
 */
import { mod24, qToNoteName, intervalQToLabel } from './theory24.js';

const MAX_FRET = 16;
const MAX_HAND_SPAN = 4; // semitones between lowest and highest fretted notes

/**
 * Generates up to `limit` distinct, playable guitar voicings for a chord/pitch-set.
 * @param {Object} params
 * @param {number} params.rootQ - 0..23 root pitch class
 * @param {number[]} params.intervalsQ - unique interval offsets in 0..23 (includes 0)
 * @param {number[]} params.stringsQ - 6 open-string absolute q values [Str 6 low .. Str 1 high]
 * @param {number} [params.limit=12]
 * @returns {Array<Object>} sorted voicings
 */
export function generateVoicings({ rootQ, intervalsQ, stringsQ, limit = 12 }) {
  const numStrings = stringsQ.length;
  const uniqueIv = [...new Set(intervalsQ.map(mod24))].sort((a, b) => a - b);
  if (uniqueIv.length < 2) return [];

  const targetPcs = new Set(uniqueIv.map((iv) => mod24(rootQ + iv)));
  const pcToInterval = new Map(uniqueIv.map((iv) => [mod24(rootQ + iv), iv]));
  const hasMicrotones = uniqueIv.some((iv) => iv % 2 !== 0);

  // Per string (0=low 6th .. 5=high 1st), collect candidate note positions
  const stringCandidates = stringsQ.map((openQ, strIdx) => {
    const cands = [];
    for (let stepQ = 0; stepQ <= MAX_FRET * 2; stepQ += 1) {
      const isMicro = stepQ % 2 !== 0;
      // Only allow quarter-tone steps when the target chord actually needs microtones
      if (isMicro && !hasMicrotones) continue;
      // Avoid 0+¼ micro-bend above open string
      if (stepQ === 1) continue;

      const absQ = openQ + stepQ;
      const pc = mod24(absQ);
      if (!targetPcs.has(pc)) continue;

      cands.push({
        strIdx,          // 0 (Str 6) .. 5 (Str 1)
        guitarStr: numStrings - strIdx,
        stepQ,
        fret: Math.floor(stepQ / 2),
        isMicro,
        absQ,
        pc,
        intervalQ: pcToInterval.get(pc)
      });
    }
    return cands;
  });

  const requiredCount = Math.min(uniqueIv.length, 5);
  const maxNotes = uniqueIv.length <= 2 ? 3 : Math.min(Math.max(uniqueIv.length, 3), 5);
  const seen = new Map();

  // Scan hand windows: open window (0..4) + sliding windows (1..MAX_FRET-3)
  const windows = [{ low: 0, high: 4, allowOpen: true }];
  for (let low = 1; low <= MAX_FRET - MAX_HAND_SPAN; low += 1) {
    windows.push({ low, high: low + MAX_HAND_SPAN, allowOpen: low <= 5 });
  }

  for (const win of windows) {
    // Filter candidates per string to this hand window (keeping at most 2 best options per string to stay ultra-fast)
    const winCands = stringCandidates.map((list) => {
      const matched = list.filter((c) => {
        if (c.stepQ === 0) return win.allowOpen;
        return c.fret >= Math.max(1, win.low) && c.fret <= win.high;
      });
      // Prefer open string or closest to window start
      return matched.slice(0, 2);
    });

    const chosen = [];

    function backtrack(strIdx, usedPcsMask) {
      if (chosen.length >= requiredCount) {
        const coveredCount = chosen.reduce((acc, n) => acc.add(n.pc), new Set()).size;
        if (coveredCount >= requiredCount) {
          evaluateAndStore(chosen, uniqueIv.length, rootQ, seen, numStrings);
        }
        if (chosen.length >= maxNotes) return;
      }

      if (strIdx >= numStrings) return;
      // Pruning: if remaining strings cannot even reach requiredCount, stop
      if (chosen.length + (numStrings - strIdx) < requiredCount) return;

      // Branch 1: pick a candidate on strIdx
      for (const cand of winCands[strIdx]) {
        chosen.push(cand);
        backtrack(strIdx + 1, usedPcsMask | (1 << cand.pc));
        chosen.pop();
      }

      // Branch 2: mute strIdx
      backtrack(strIdx + 1, usedPcsMask);
    }

    backtrack(0, 0);
  }

  const all = [...seen.values()];
  if (all.length === 0) return [];

  // Bucket by register (low/mid/high) so user gets rich exploration across the entire neck
  all.sort((a, b) => b.score - a.score);

  const selected = [];
  const usedBuckets = new Map();
  for (const v of all) {
    const bucket = Math.floor(v.avgFret / 2.5);
    const count = usedBuckets.get(bucket) || 0;
    if (count < 2 || selected.length < Math.min(4, limit)) {
      selected.push(v);
      usedBuckets.set(bucket, count + 1);
    }
    if (selected.length >= limit) break;
  }

  // Final display order: lowest fretboard position -> highest fretboard position
  selected.sort((a, b) => a.minFret - b.minFret || a.avgFret - b.avgFret);
  return selected;
}

function evaluateAndStore(notes, targetCard, rootQ, seen, numStrings) {
  // Check fretted span strictly <= MAX_HAND_SPAN
  const fretted = notes.filter((n) => n.stepQ > 0);
  let minFret = 0;
  let maxFret = 0;
  if (fretted.length > 0) {
    minFret = Math.min(...fretted.map((n) => n.fret));
    maxFret = Math.max(...fretted.map((n) => n.fret));
    if (maxFret - minFret > MAX_HAND_SPAN) return;
  }

  // Check interior muted gaps (allow at most 1 muted string gap for crisp Drop 3 / hybrid voicings)
  const strIndices = notes.map((n) => n.strIdx);
  const spanStrings = strIndices[strIndices.length - 1] - strIndices[0] + 1;
  const mutedInside = spanStrings - notes.length;
  if (mutedInside > 2) return;

  // Build canonical signature
  const frets = Array(numStrings).fill(null);
  notes.forEach((n) => {
    frets[n.strIdx] = n.isMicro ? `${n.fret}+¼` : `${n.fret}`;
  });
  const sig = frets.map((f) => (f === null ? 'x' : f)).join('-');
  if (seen.has(sig)) return;

  // Score ergonomics & musical clarity
  let score = 100;
  const fretSpan = fretted.length > 0 ? maxFret - minFret : 0;
  score -= fretSpan * 8;
  score -= mutedInside * 9;

  // Root in bass bonus
  const bassNote = notes[0];
  if (bassNote.pc === mod24(rootQ)) {
    score += 18;
  }

  // Open string resonance bonus (especially rewarding in scordatura!)
  const openCount = notes.filter((n) => n.stepQ === 0).length;
  score += openCount * 6;

  // Complete pitch-class coverage bonus
  const uniquePcs = new Set(notes.map((n) => n.pc)).size;
  if (uniquePcs === targetCard) score += 20;

  // Slight preference against excessive doubling on tiny sets
  const extraDoublings = notes.length - uniquePcs;
  score -= extraDoublings * 5;

  // Prefer comfortable mid-register slightly over extreme 15th fret stretches
  const avgFret = fretted.length > 0
    ? fretted.reduce((s, n) => s + n.fret, 0) / fretted.length
    : 0;
  score -= Math.max(0, avgFret - 10) * 1.5;

  seen.set(sig, {
    id: sig,
    signature: sig,
    notes: notes.map((n) => ({ ...n })),
    frets,
    minFret,
    maxFret,
    avgFret,
    bassNoteName: qToNoteName(bassNote.absQ, false),
    bassInterval: intervalQToLabel(bassNote.intervalQ),
    hasOpenString: openCount > 0,
    hasMicrotone: notes.some((n) => n.isMicro),
    score
  });
}

/**
 * Finds a clean 1-octave ascending scale tab path on the current tuning for notation/tab preview.
 */
export function buildScaleTabSequence({ rootQ, intervalsQ, stringsQ }) {
  // Automatically anchor 1-octave scale inside the natural register of the active tuning
  const lowStrQ = Math.min(...stringsQ);
  let baseQ = 72 + mod24(rootQ);
  while (baseQ < lowStrQ + 8) baseQ += 24;
  if (baseQ > lowStrQ + 34) baseQ -= 24;
  const targetQs = [...intervalsQ, 24].map((iv) => baseQ + iv);
  const path = [];
  let prevFret = 4;

  for (const absQ of targetQs) {
    let best = null;
    const numStrings = stringsQ.length;
    for (let strIdx = 0; strIdx < numStrings; strIdx += 1) {
      const stepQ = absQ - stringsQ[strIdx];
      if (stepQ < 0 || stepQ > 40) continue;
      if (stepQ === 1) continue;
      const fret = Math.floor(stepQ / 2);
      const isMicro = stepQ % 2 !== 0;
      const dist = Math.abs(fret - prevFret) + (fret > 15 ? 4 : 0);
      if (!best || dist < best.dist) {
        best = {
          strIdx,
          guitarStr: numStrings - strIdx,
          stepQ,
          fret,
          isMicro,
          absQ,
          intervalQ: mod24(absQ - rootQ),
          dist
        };
      }
    }
    if (best) {
      prevFret = best.fret;
      path.push(best);
    }
  }
  return path;
}
