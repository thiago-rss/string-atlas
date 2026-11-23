/**
 * Procedural Experimental Electric Guitar Etude Generator (24-TET & Scordatura-Aware)
 * Zero DOM dependencies — returns immutable study objects ready for audio playback,
 * fretboard highlighting, 24-TET staff/tab notation, and ASCII tablature export.
 */
import {
  SPECTRAL_HARMONICS,
  getReferenceA4,
  mod24,
  qToFreq,
  qToNoteName,
  intervalQToLabel
} from './theory24.js';

export const ETUDE_PATTERNS = [
  {
    id: 'linear_oud',
    namePt: 'Fraseado Linear em Corda Única (Oud / Slide)',
    nameEn: 'Single-String Linear Phrasing (Oud / Slide)',
    focusPt: 'Desenvolve consciência horizontal do braço, glissandos precisos e entonação de graus neutros sem depender de boxes verticais.',
    focusEn: 'Develops horizontal fretboard awareness, expressive slides, and microtonal intonation free from vertical box habits.'
  },
  {
    id: 'string_skip',
    namePt: 'String Skipping Angular (Slonimsky / Pós-Tonal)',
    nameEn: 'Angular String Skipping (Slonimsky / Post-Tonal)',
    focusPt: 'Alterna saltos de cordas não adjacentes (pulando 1 ou 2 cordas) para destravar precisão da mão direita e fraseado intervalar amplo.',
    focusEn: 'Leaps across non-adjacent strings (skipping 1–2 strings) to build right-hand accuracy and wide angular melodic contours.'
  },
  {
    id: 'micro_bend_lab',
    namePt: 'Laboratório de Micro-Bends (+50¢) & Ornamentos',
    nameEn: 'Micro-Bend (+50¢) & Ornamentation Lab',
    focusPt: 'Isola graus microtonais (ou graus característicos em 12-TET) com motivos de preparação → alvo → resolução para treinar precisão de bend e legato.',
    focusEn: 'Isolates quarter-tone degrees (or characteristic degrees in 12-TET) with anchor → target → resolution cells for bend and legato precision.'
  },
  {
    id: 'pedal_drone',
    namePt: 'Bordão de Corda Solta & Contraponto Modal',
    nameEn: 'Open-String Pedal Drone & Modal Counterpoint',
    focusPt: 'Alterna uma corda solta ressonante (ideal em DADGAD, Orkney ou Standard) com uma linha modal móvel — excelente para palhetada híbrida.',
    focusEn: 'Interleaves a resonant open-string pedal (ideal in DADGAD, Orkney, or Standard) against a moving modal voice — prime hybrid-picking workout.'
  },
  {
    id: 'interval_seq',
    namePt: 'Sequências Intervalares & Células Assimétricas',
    nameEn: 'Intervallic Sequences & Asymmetric Cells',
    focusPt: 'Organiza a escala/maqam em saltos intervalares quebrados (terças/quartas modais) e acentuação assimétrica de 3, 5 ou 7 notas.',
    focusEn: 'Organizes the scale/maqam into broken modal leaps (3rds/4ths) paired with asymmetric 3-, 5-, or 7-note accent groupings.'
  },
  {
    id: 'harmonic_weave',
    namePt: 'Trama de Harmônicos Espectrais (2º–5º Parciais)',
    nameEn: 'Spectral Harmonics Weave (2nd–5th Partials)',
    focusPt: 'Entrelaça harmônicos naturais (casas ~12, ~7, ~5, ~3.9) dentro de frases modais presas, explorando cor tímbrica e entonação justa.',
    focusEn: 'Weaves natural overtone harmonics (frets ~12, ~7, ~5, ~3.9) directly inside fretted modal lines, fusing timbral color with Just Intonation.'
  }
];

export const ETUDE_ZONES = {
  open: { minFret: 0, maxFret: 5, labelPt: 'Região Aberta (0–5)', labelEn: 'Open Zone (0–5)' },
  mid: { minFret: 4, maxFret: 10, labelPt: 'Região Média (4–10)', labelEn: 'Mid Zone (4–10)' },
  high: { minFret: 9, maxFret: 16, labelPt: 'Região Aguda (9–16)', labelEn: 'High Zone (9–16)' },
  full: { minFret: 0, maxFret: 18, labelPt: 'Braço Inteiro (0–18)', labelEn: 'Full Neck (0–18)' }
};

export const ETUDE_GROUPINGS = {
  even: { accentEvery: 4, labelPt: 'Regular (4/4)', labelEn: 'Even (4/4)' },
  group3: { accentEvery: 3, labelPt: 'Acento em 3', labelEn: 'Accent in 3s' },
  group5: { accentEvery: 5, labelPt: 'Assimétrico 5', labelEn: 'Asymmetric 5s' },
  group7: { accentEvery: 7, labelPt: 'Assimétrico 7', labelEn: 'Asymmetric 7s' }
};

/** Deterministic mulberry32 PRNG for reproducible variations */
function createRng(seed) {
  let a = (seed >>> 0) || 1;
  return () => {
    a |= 0;
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Collects all playable scale positions on the fretboard within [minFret..maxFret] */
function collectPositions({ rootQ, intervalsQ, stringsQ, minFret, maxFret, microMode }) {
  const allowedMap = new Map(intervalsQ.map((iv) => [mod24(rootQ + iv), iv]));
  const positions = [];

  const numStrings = stringsQ.length;
  for (let strIdx = 0; strIdx < numStrings; strIdx += 1) {
    const openQ = stringsQ[strIdx];
    const startStep = minFret === 0 ? 0 : minFret * 2;
    const endStep = maxFret * 2;

    for (let stepQ = startStep; stepQ <= endStep; stepQ += 1) {
      const isMicro = stepQ % 2 !== 0;
      const fret = Math.floor(stepQ / 2);
      // Avoid 0+¼ micro-bend above open string in bend mode
      if (isMicro && fret === 0 && microMode === 'bend') continue;

      const absQ = openQ + stepQ;
      const pc = mod24(absQ);
      if (!allowedMap.has(pc)) continue;

      positions.push({
        kind: 'note',
        strIdx,
        guitarStr: numStrings - strIdx,
        stepQ,
        fret,
        isMicro,
        q: absQ,
        freq: qToFreq(absQ),
        intervalQ: allowedMap.get(pc)
      });
    }
  }
  return positions;
}

function sortPositionsByContour(list, direction, rng) {
  const byPitch = [...list].sort((a, b) => a.q - b.q || a.strIdx - b.strIdx);
  // Deduplicate exact same pitch in same hand zone while keeping playable ergonomics
  const dedup = [];
  for (const item of byPitch) {
    const prev = dedup[dedup.length - 1];
    if (prev && prev.q === item.q) {
      if (Math.abs(item.fret - 6) < Math.abs(prev.fret - 6)) {
        dedup[dedup.length - 1] = item;
      }
    } else {
      dedup.push(item);
    }
  }

  if (direction === 'desc') return dedup.reverse();
  if (direction === 'pendulum') {
    const tail = dedup.length > 2 ? [...dedup].slice(1, -1).reverse() : [];
    return [...dedup, ...tail];
  }
  if (direction === 'random') {
    const arr = [...dedup];
    for (let i = arr.length - 1; i > 0; i -= 1) {
      const j = Math.floor(rng() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
  return dedup;
}

/**
 * Main Procedural Etude Generator
 */
export function generateEtude({
  scale,
  rootQ,
  stringsQ,
  microMode = 'bend',
  patternId = 'linear_oud',
  zoneId = 'mid',
  groupingId = 'group5',
  length = 16,
  direction = 'pendulum',
  seed = 1
}) {
  const rng = createRng(seed * 9973 + rootQ * 31 + length * 7);
  const zone = ETUDE_ZONES[zoneId] || ETUDE_ZONES.mid;
  const grouping = ETUDE_GROUPINGS[groupingId] || ETUDE_GROUPINGS.even;
  const patternMeta = ETUDE_PATTERNS.find((p) => p.id === patternId) || ETUDE_PATTERNS[0];

  let pool = collectPositions({
    rootQ,
    intervalsQ: scale.intervalsQ,
    stringsQ,
    minFret: zone.minFret,
    maxFret: zone.maxFret,
    microMode
  });

  // Fallback to full neck if tiny pitch-set + tight zone yielded too few notes
  if (pool.length < 4) {
    pool = collectPositions({
      rootQ,
      intervalsQ: scale.intervalsQ,
      stringsQ,
      minFret: 0,
      maxFret: 18,
      microMode
    });
  }

  let rawEvents = [];

  if (patternId === 'linear_oud') {
    rawEvents = buildLinearOudEtude({ scale, rootQ, stringsQ, microMode, length, direction, rng });
  } else if (patternId === 'string_skip') {
    rawEvents = buildStringSkipEtude({ pool, length, direction, rng });
  } else if (patternId === 'micro_bend_lab') {
    rawEvents = buildMicroBendEtude({ pool, scale, length, direction, rng });
  } else if (patternId === 'pedal_drone') {
    rawEvents = buildPedalDroneEtude({ pool, scale, rootQ, stringsQ, length, direction, rng });
  } else if (patternId === 'harmonic_weave') {
    rawEvents = buildHarmonicWeaveEtude({ pool, stringsQ, length, direction, rng });
  } else {
    rawEvents = buildIntervalSeqEtude({ pool, length, direction, rng });
  }

  // Guarantee non-empty output even in extreme custom tunings
  if (rawEvents.length === 0 && pool.length > 0) {
    for (let i = 0; i < length; i += 1) {
      rawEvents.push({ ...pool[i % pool.length] });
    }
  }

  // Annotate picking / left-hand articulation + asymmetric metric accents
  const events = rawEvents.slice(0, length).map((ev, idx, arr) => {
    const prev = idx > 0 ? arr[idx - 1] : null;
    let articulation = ev.articulation || (idx % 2 === 0 ? '↓' : '↑');

    if (ev.kind === 'harmonic') {
      articulation = '◇';
    } else if (ev.isMicro) {
      articulation = microMode === 'bend' ? 'B↑¼' : 'S';
    } else if (!ev.articulation && prev && prev.kind === 'note' && prev.strIdx === ev.strIdx && prev.fret !== ev.fret) {
      const diff = Math.abs(ev.fret - prev.fret);
      if (patternId === 'linear_oud' && diff >= 3) {
        articulation = 'S';
      } else if (diff <= 2 && idx % 3 === 1) {
        articulation = ev.fret > prev.fret ? 'H' : 'P';
      }
    }

    return {
      ...ev,
      idx,
      articulation,
      accent: idx % grouping.accentEvery === 0
    };
  });

  // Compute compact pedagogy statistics
  let microCount = 0;
  let stringSkips = 0;
  let harmonicCount = 0;
  const frettedVals = [];

  events.forEach((ev, idx) => {
    if (ev.isMicro) microCount += 1;
    if (ev.kind === 'harmonic') harmonicCount += 1;
    if (ev.kind === 'note' && ev.fret > 0) frettedVals.push(ev.fret);
    if (idx > 0 && Math.abs(ev.strIdx - events[idx - 1].strIdx) >= 2) {
      stringSkips += 1;
    }
  });

  const minFret = frettedVals.length ? Math.min(...frettedVals) : 0;
  const maxFret = frettedVals.length ? Math.max(...frettedVals) : 0;

  return {
    id: `${patternId}_${scale.id}_${seed}`,
    seed,
    patternId,
    zoneId,
    groupingId,
    direction,
    namePt: patternMeta.namePt,
    nameEn: patternMeta.nameEn,
    focusPt: patternMeta.focusPt,
    focusEn: patternMeta.focusEn,
    events,
    stats: {
      noteCount: events.length,
      microCount,
      stringSkips,
      harmonicCount,
      fretRange: `${minFret}–${maxFret}`
    }
  };
}

function buildLinearOudEtude({ scale, rootQ, stringsQ, microMode, length, direction, rng }) {
  // Choose one expressive string (bias towards strings 2, 3, 4 = indices 2, 3, 4)
  const numStrings = stringsQ.length;
  const midStart = Math.max(1, numStrings - 4);
  const candidateStrs = [midStart, midStart + 1, midStart + 2].filter((x) => x < numStrings);
  const chosenStr = candidateStrs[Math.floor(rng() * candidateStrs.length)];
  const openQ = stringsQ[chosenStr];
  const allowedMap = new Map(scale.intervalsQ.map((iv) => [mod24(rootQ + iv), iv]));

  const line = [];
  for (let stepQ = 0; stepQ <= 34; stepQ += 1) {
    const isMicro = stepQ % 2 !== 0;
    const fret = Math.floor(stepQ / 2);
    if (isMicro && fret === 0 && microMode === 'bend') continue;
    const absQ = openQ + stepQ;
    const pc = mod24(absQ);
    if (!allowedMap.has(pc)) continue;
    line.push({
      kind: 'note',
      strIdx: chosenStr,
      guitarStr: numStrings - chosenStr,
      stepQ,
      fret,
      isMicro,
      q: absQ,
      freq: qToFreq(absQ),
      intervalQ: allowedMap.get(pc)
    });
  }

  if (line.length < 3) return [];

  // Build horizontal Oud-like jins motif (step forward, ornament back, slide up)
  const ordered = direction === 'desc' ? [...line].reverse() : line;
  const out = [];
  let cursor = Math.min(Math.floor(rng() * Math.max(1, ordered.length - 5)), Math.max(0, ordered.length - 1));
  let dirSign = 1;

  for (let i = 0; i < length; i += 1) {
    out.push({ ...ordered[cursor] });
    // Melodic contour: occasional 2-step leap or turnaround
    const r = rng();
    let delta = dirSign;
    if (r < 0.22) delta = dirSign * 2;
    else if (r < 0.36) delta = -dirSign;

    let next = cursor + delta;
    if (next >= ordered.length || next < 0) {
      dirSign = -dirSign;
      next = Math.max(0, Math.min(ordered.length - 1, cursor + dirSign));
    }
    cursor = next;
  }
  return out;
}

function buildStringSkipEtude({ pool, length, direction, rng }) {
  const maxStrIdx = pool.reduce((m, p) => Math.max(m, p.strIdx), 5);
  const byStr = Array.from({ length: maxStrIdx + 1 }, () => []);
  pool.forEach((p) => byStr[p.strIdx].push(p));
  const populated = byStr.map((arr, idx) => ({ idx, arr })).filter((x) => x.arr.length > 0);
  if (populated.length < 2) return sortPositionsByContour(pool, direction, rng).slice(0, length);

  // Pair strings that are >= 2 apart (e.g., 6-4, 5-3, 4-2, 3-1)
  const skipPairs = [];
  for (let i = 0; i < populated.length; i += 1) {
    for (let j = i + 1; j < populated.length; j += 1) {
      if (Math.abs(populated[j].idx - populated[i].idx) >= 2) {
        skipPairs.push([populated[i].idx, populated[j].idx]);
      }
    }
  }
  if (skipPairs.length === 0) {
    skipPairs.push([populated[0].idx, populated[populated.length - 1].idx]);
  }

  const out = [];
  const startPairIdx = Math.floor(rng() * skipPairs.length);

  for (let i = 0; i < length; i += 1) {
    const pair = skipPairs[(startPairIdx + Math.floor(i / 4)) % skipPairs.length];
    const targetStr = direction === 'desc'
      ? pair[i % 2 === 0 ? 1 : 0]
      : pair[i % 2 === 0 ? 0 : 1];

    const cands = byStr[targetStr];
    const pickIdx = direction === 'random'
      ? Math.floor(rng() * cands.length)
      : (Math.floor(i / 2) + (i % 2)) % cands.length;

    out.push({
      ...cands[pickIdx],
      articulation: i % 2 === 0 ? '↓' : '↑'
    });
  }
  return out;
}

function buildMicroBendEtude({ pool, scale, length, direction, rng }) {
  const charSet = new Set(scale.characteristicQ || []);
  const ordered = sortPositionsByContour(pool, direction === 'random' ? 'asc' : direction, rng);
  if (ordered.length < 2) return ordered;

  // Locate target focal indices (microtones first, then characteristic degrees)
  let targetIndices = ordered
    .map((n, i) => (n.isMicro ? i : -1))
    .filter((i) => i >= 0);

  if (targetIndices.length === 0) {
    targetIndices = ordered
      .map((n, i) => (charSet.has(n.intervalQ) ? i : -1))
      .filter((i) => i >= 0);
  }
  if (targetIndices.length === 0) {
    targetIndices = [Math.min(1, ordered.length - 1)];
  }

  // Construct 4-note expressive cells around each target: [anchor below -> target -> neighbor above -> resolution]
  const out = [];
  const offset = Math.floor(rng() * targetIndices.length);
  let cellIdx = 0;

  while (out.length < length) {
    const tIdx = targetIndices[(offset + cellIdx) % targetIndices.length];
    const lowerIdx = Math.max(0, tIdx - 1);
    const upperIdx = Math.min(ordered.length - 1, tIdx + 1);
    const resIdx = lowerIdx;

    out.push({ ...ordered[lowerIdx], articulation: '↓' });
    if (out.length < length) out.push({ ...ordered[tIdx] });
    if (out.length < length) out.push({ ...ordered[upperIdx], articulation: '↑' });
    if (out.length < length) out.push({ ...ordered[resIdx], articulation: '↓' });

    cellIdx += 1;
  }
  return out;
}

function buildPedalDroneEtude({ pool, scale, rootQ, stringsQ, length, direction, rng }) {
  const allowedPcs = new Set(scale.intervalsQ.map((iv) => mod24(rootQ + iv)));
  // Pick the lowest open string that belongs to the scale (or fallback to string 6)
  let pedalStrIdx = 0;
  for (let s = 0; s < 4; s += 1) {
    if (allowedPcs.has(mod24(stringsQ[s]))) {
      pedalStrIdx = s;
      break;
    }
  }

  const pedalOpenQ = stringsQ[pedalStrIdx];
  const pedalNote = {
    kind: 'note',
    strIdx: pedalStrIdx,
    guitarStr: stringsQ.length - pedalStrIdx,
    stepQ: 0,
    fret: 0,
    isMicro: false,
    q: pedalOpenQ,
    freq: qToFreq(pedalOpenQ),
    intervalQ: mod24(pedalOpenQ - rootQ),
    articulation: '↓'
  };

  const upperPool = pool.filter((p) => p.strIdx > pedalStrIdx);
  const melody = sortPositionsByContour(upperPool.length >= 3 ? upperPool : pool, direction, rng);
  if (melody.length === 0) return [];

  const startMel = Math.floor(rng() * Math.max(1, melody.length - 4));
  const out = [];

  for (let i = 0; i < length; i += 1) {
    if (i % 2 === 0) {
      out.push({ ...pedalNote });
    } else {
      const mIdx = (startMel + Math.floor(i / 2)) % melody.length;
      out.push({ ...melody[mIdx], articulation: '↑' });
    }
  }
  return out;
}

function buildIntervalSeqEtude({ pool, length, direction, rng }) {
  const ordered = sortPositionsByContour(pool, direction === 'random' ? 'asc' : direction, rng);
  if (ordered.length < 3) return ordered;

  // Pick a broken-interval leap size of 2 (modal 3rds) or 3 (modal 4ths)
  const leap = rng() < 0.5 ? 2 : 3;
  const out = [];
  let base = Math.floor(rng() * Math.max(1, Math.min(3, ordered.length - 2)));

  while (out.length < length) {
    const a = ordered[base % ordered.length];
    const b = ordered[(base + leap) % ordered.length];
    const c = ordered[(base + 1) % ordered.length];
    out.push({ ...a });
    if (out.length < length) out.push({ ...b });
    if (out.length < length) out.push({ ...c });
    base += 1;
  }
  return out;
}

function buildHarmonicWeaveEtude({ pool, stringsQ, length, direction, rng }) {
  const ordered = sortPositionsByContour(pool, direction, rng);
  if (ordered.length === 0) return [];

  // Musical natural harmonics (partials 2, 3, 4, 5 — frets 12, 7.02, 5, 3.86)
  const usableHarmonics = SPECTRAL_HARMONICS.filter((h) => h.partial <= 5 && h.fretPos <= 12.5);
  const out = [];
  let mCursor = Math.floor(rng() * Math.max(1, Math.min(4, ordered.length)));

  for (let i = 0; i < length; i += 1) {
    if (i % 3 === 2) {
      // Insert a sparkling natural harmonic on a resonant upper/mid string
      const hStrIdx = Math.min(stringsQ.length - 2, 1 + Math.floor(rng() * Math.max(2, stringsQ.length - 2)));
      const h = usableHarmonics[Math.floor(rng() * usableHarmonics.length)];
      const openQ = stringsQ[hStrIdx];
      const hFreq = qToFreq(openQ) * h.ratio;
      // Approximate nearest 24-TET pitch for staff rendering
      const approxQ = Math.round(138 + 24 * Math.log2(hFreq / getReferenceA4()));
      out.push({
        kind: 'harmonic',
        strIdx: hStrIdx,
        guitarStr: stringsQ.length - hStrIdx,
        stepQ: Math.round(h.fretPos * 2),
        fret: Math.round(h.fretPos),
        fretDisplay: `⟨${h.fretPos === 12 || h.fretPos === 5 ? h.fretPos : h.fretPos.toFixed(1)}⟩`,
        partial: h.partial,
        jiCentsOffset: h.jiCentsOffset,
        isMicro: false,
        q: approxQ,
        freq: hFreq,
        intervalQ: -1,
        articulation: '◇'
      });
    } else {
      out.push({ ...ordered[mCursor % ordered.length] });
      mCursor += 1;
    }
  }
  return out;
}

/**
 * Exports any generated etude as clean, monospaced 6-string ASCII guitar tablature
 * including micro-bend (↑¼ / .5), natural harmonic (<12>), and picking/articulation header.
 */
export function exportEtudeToAsciiTab({ etude, scaleName, rootQ, stringsQ, microMode }) {
  const rootName = qToNoteName(rootQ, false);
  const tuningLabelsHighToLow = [...stringsQ]
    .reverse()
    .map((q) => qToNoteName(q, false).padEnd(3, ' '));

  const artRow = ['    '];
  const rows = tuningLabelsHighToLow.map((lbl) => [`${lbl}|-`]);

  etude.events.forEach((ev) => {
    let cell = '';
    if (ev.kind === 'harmonic') {
      cell = `<${ev.fret}>`;
    } else if (ev.isMicro) {
      cell = microMode === 'bend' ? `${ev.fret}^` : `${ev.fret}.5`;
    } else {
      cell = `${ev.fret}`;
    }

    const colW = Math.max(cell.length, ev.articulation.length, 2) + 1;
    artRow.push(ev.articulation.padEnd(colW, ' '));

    const numStrings = stringsQ.length;
    for (let lineIdx = 0; lineIdx < numStrings; lineIdx += 1) {
      const targetLine = ev.guitarStr - 1;
      if (lineIdx === targetLine) {
        rows[lineIdx].push(cell.padEnd(colW, '-'));
      } else {
        rows[lineIdx].push('-'.repeat(colW));
      }
    }
  });

  rows.forEach((r) => r.push('|'));

  const header = [
    `String Atlas — Modal Guitar Lab (24-TET Procedural Etude)`,
    `Scale : ${rootName} ${scaleName}`,
    `Study : ${etude.namePt} (Seed #${etude.seed})`,
    `Legend: ^ = +50c micro-bend (1/4 tone) | <n> = natural harmonic | H/P/S = legato/slide`,
    ``,
    artRow.join(''),
    ...rows.map((r) => r.join(''))
  ];
  return header.join('\n');
}
