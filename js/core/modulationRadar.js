/**
 * 24-TET Modal Radar & Pivot-Modulation Engine
 * Pure mathematical engine (zero DOM/audio) computing:
 * - Pitch-class overlap between any two 24-TET scales/maqamat/sets
 * - Parallel 1-to-2 degree mutations on the same tonic (including quarter-tone inflections)
 * - Structural Ghammaz / Pivot modulations to neighboring roots
 */
import { intervalQToLabel, mod24, qToNoteName } from './theory24.js';

export const PIVOT_OFFSETS = [
  { offsetQ: 10, id: 'p4', labelPt: '4ª Justa (Ghammaz)', labelEn: 'Perfect 4th (Ghammaz)' },
  { offsetQ: 14, id: 'p5', labelPt: '5ª Justa (Ghammaz)', labelEn: 'Perfect 5th (Ghammaz)' },
  { offsetQ: 2,  id: 'b2', labelPt: '♭2 (Napolitano / Frígio)', labelEn: '♭2 (Neapolitan / Phrygian)' },
  { offsetQ: 6,  id: 'b3', labelPt: '♭3 (Relativa / Mediante)', labelEn: '♭3 (Relative / Mediant)' },
  { offsetQ: 8,  id: 'm3', labelPt: '3ª Maior (Mediante Crom.)', labelEn: 'Major 3rd (Chromatic Mediant)' },
  { offsetQ: 12, id: 'tt', labelPt: '♯4 (Trítono / Simetria)', labelEn: '♯4 (Tritone / Symmetry)' },
  { offsetQ: 20, id: 'b7', labelPt: '♭7 (Subtônica Modal)', labelEn: '♭7 (Modal Subtonic)' }
];

export function getPitchClassSet(rootQ, intervalsQ) {
  return new Set(intervalsQ.map((iv) => mod24(rootQ + iv)));
}

/**
 * Compares Scale A (rootA, intervalsA) against Scale B (rootB, intervalsB) in 24-TET pitch-class space.
 */
export function compareScales24({ rootA, intervalsA, rootB, intervalsB }) {
  const setA = getPitchClassSet(rootA, intervalsA);
  const setB = getPitchClassSet(rootB, intervalsB);

  const sharedPcs = [];
  const onlyAPcs = [];
  const onlyBPcs = [];

  for (let pc = 0; pc < 24; pc += 1) {
    const inA = setA.has(pc);
    const inB = setB.has(pc);
    if (inA && inB) sharedPcs.push(pc);
    else if (inA) onlyAPcs.push(pc);
    else if (inB) onlyBPcs.push(pc);
  }

  const unionSize = sharedPcs.length + onlyAPcs.length + onlyBPcs.length;
  const overlapRatio = unionSize > 0 ? sharedPcs.length / unionSize : 0;

  return {
    sharedPcs,
    onlyAPcs,
    onlyBPcs,
    sharedCount: sharedPcs.length,
    symmetricDiff: onlyAPcs.length + onlyBPcs.length,
    overlapRatio,
    overlapPct: Math.round(overlapRatio * 100)
  };
}

/**
 * Finds parallel scale mutations on the SAME root sorted by minimal pitch difference
 * (spots 1-note shifts & quarter-tone inflections like Dorian -> Bayati -> Kurd!).
 */
export function findParallelMutations({ rootQ, scale, allScales, limit = 10 }) {
  const results = [];

  for (const cand of allScales) {
    if (cand.id === scale.id) continue;
    const cmp = compareScales24({
      rootA: rootQ,
      intervalsA: scale.intervalsQ,
      rootB: rootQ,
      intervalsB: cand.intervalsQ
    });

    if (cmp.sharedCount < Math.min(3, scale.intervalsQ.length - 1)) continue;

    const removedDegs = cmp.onlyAPcs.map((pc) => intervalQToLabel(mod24(pc - rootQ)));
    const addedDegs = cmp.onlyBPcs.map((pc) => intervalQToLabel(mod24(pc - rootQ)));

    results.push({
      kind: 'parallel',
      targetRootQ: rootQ,
      targetRootName: qToNoteName(rootQ, false),
      targetScale: cand,
      pivotOffsetQ: 0,
      pivotDegreeLabel: '1',
      removedDegs,
      addedDegs,
      ...cmp
    });
  }

  results.sort(
    (a, b) =>
      a.symmetricDiff - b.symmetricDiff ||
      b.overlapRatio - a.overlapRatio ||
      b.sharedCount - a.sharedCount
  );

  return results.slice(0, limit);
}

/**
 * Finds high-overlap modulations onto structural pivot roots (4th, 5th, ♭2, ♭3, 3rd, ♯4, ♭7).
 * Prioritizes pivot tones that actually exist inside the current scale (authentic Sayr / Ghammaz).
 */
export function findPivotModulations({
  rootQ,
  scale,
  allScales,
  pivotFilter = 'all',
  limit = 12
}) {
  const activeIntervalsSet = new Set(scale.intervalsQ.map(mod24));
  const offsetsToScan = pivotFilter === 'all'
    ? PIVOT_OFFSETS
    : PIVOT_OFFSETS.filter((p) => p.id === pivotFilter);

  const candidates = [];

  for (const piv of offsetsToScan) {
    const targetRootQ = mod24(rootQ + piv.offsetQ);
    const pivotInSource = activeIntervalsSet.has(piv.offsetQ);

    for (const cand of allScales) {
      const cmp = compareScales24({
        rootA: rootQ,
        intervalsA: scale.intervalsQ,
        rootB: targetRootQ,
        intervalsB: cand.intervalsQ
      });

      // Skip identical pitch collections on same scale (e.g. symmetric self-rotation with 0 diff unless informative)
      const isSameScaleFullOverlap = cand.id === scale.id && cmp.symmetricDiff === 0;
      if (cmp.overlapPct < 45) continue;

      // Musical score favors strong pitch overlap + authentic Ghammaz in-scale root + gentle contrast
      let score = cmp.overlapPct;
      if (pivotInSource) score += 14;
      if (piv.offsetQ === 10 || piv.offsetQ === 14) score += 6; // Ghammaz 4th / 5th boost
      if (cand.category === 'arabic' && scale.category === 'arabic') score += 5;
      if (isSameScaleFullOverlap) score -= 18; // keep interesting contrasting modes slightly ahead of exact self-rotations

      candidates.push({
        kind: 'pivot',
        pivotId: piv.id,
        pivotOffsetQ: piv.offsetQ,
        pivotDegreeLabel: intervalQToLabel(piv.offsetQ),
        pivotInSource,
        targetRootQ,
        targetRootName: qToNoteName(targetRootQ, false),
        targetScale: cand,
        score,
        ...cmp
      });
    }
  }

  candidates.sort((a, b) => b.score - a.score || b.sharedCount - a.sharedCount);

  // Deduplicate by targetRootQ + targetScale.id
  const unique = [];
  const seen = new Set();
  for (const c of candidates) {
    const key = `${c.targetRootQ}:${c.targetScale.id}`;
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(c);
    if (unique.length >= limit) break;
  }

  return unique;
}
