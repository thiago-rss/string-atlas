/**
 * Pure Scala (.scl) Microtonal Tuning Parser, Preset Library & Fretboard Mapper (v8.0)
 * Supports arbitrary cents, pure ratios (5/4, 7/4, 11/8), 53-TET commas, Just Intonation,
 * non-octave Bohlen-Pierce (3/1 tritave), Wendy Carlos Alpha, and measured Gamelan scales.
 */
import { qToFreq } from './theory24.js';

export const SCALA_PRESETS = [
  {
    "id": "ji_5limit",
    "group": "ji",
    "namePt": "Entonação Justa 5-Limit (Ptolomeu / Zarlino)",
    "nameEn": "5-Limit Just Intonation (Ptolemy / Zarlino)",
    "descPt": "Terças maiores puras (5/4 = −14¢), quintas perfeitas (3/2 = +2¢) e sextas puras (5/3 = −16¢). Zero batimento em acordes maiores e menores sobre drone.",
    "descEn": "Pure major thirds (5/4 = −14¢), beatless fifths (3/2 = +2¢), and pure sixths (5/3 = −16¢). Crystal-clear resonance over drones.",
    "scl": "! ji_5limit.scl\n5-Limit Ptolemaic Just Intonation (7 notes)\n 7\n!\n 9/8\n 5/4\n 4/3\n 3/2\n 5/3\n 15/8\n 2/1"
  },
  {
    "id": "ji_7limit_septimal",
    "group": "ji",
    "namePt": "Entonação Justa 7-Limit (Blues & Sétima Harmônica)",
    "nameEn": "7-Limit Just Intonation (Septimal Blues)",
    "descPt": "Inclui a terça menor septimal (7/6 = 267¢, −33¢), o trítono septimal (7/5 = 583¢) e a sétima harmônica pura (7/4 = 969¢, −31¢) — a verdadeira entonação do blues profundo.",
    "descEn": "Features the septimal minor third (7/6 = 267¢, −33¢), septimal tritone (7/5 = 583¢), and pure harmonic seventh (7/4 = 969¢, −31¢).",
    "scl": "! ji_7limit_septimal.scl\n7-Limit Septimal Blues & Harmonic Seventh (7 notes)\n 8\n!\n 8/7\n 7/6\n 5/4\n 4/3\n 7/5\n 3/2\n 7/4\n 2/1"
  },
  {
    "id": "ji_overtone_11",
    "group": "ji",
    "namePt": "Série Harmônica 11-Limit (Lídio ♭7 Acústico Puro)",
    "nameEn": "11-Limit Overtone Scale (Pure Acoustic Lydian ♭7)",
    "descPt": "Parciais 8 ao 16 da série harmônica natural (9/8, 5/4, 11/8 = 551¢, 3/2, 13/8 = 841¢, 7/4 = 969¢, 15/8). Ponte direta entre música espectral e modalismo Armorial.",
    "descEn": "Natural overtone partials 8–16 (9/8, 5/4, 11/8 = 551¢, 3/2, 13/8 = 841¢, 7/4 = 969¢, 15/8). Direct bridge between spectralism and acoustic folk.",
    "scl": "! ji_overtone_11.scl\n11-Limit & 13-Limit Natural Harmonic Series (8 notes)\n 8\n!\n 9/8\n 5/4\n 11/8\n 3/2\n 13/8\n 7/4\n 15/8\n 2/1"
  },
  {
    "id": "turkish_53_rast",
    "group": "edo53",
    "namePt": "53-TET Otomano · Makam Rast (Commas Holderianas)",
    "nameEn": "53-TET Ottoman · Makam Rast (Holderian Commas)",
    "descPt": "Sistema teórico turco/otomano de 53 commas por oitava (22,64¢ cada): Rast usa a terça segâh em 17 commas (384,9¢, −15¢) — mais alta que os 350¢ do Rast árabe.",
    "descEn": "Turkish/Ottoman 53-comma theory (22.64¢ per comma): Rast places its Segah 3rd at 17 commas (384.9¢, −15¢) — brighter than 350¢ Arabic Rast.",
    "scl": "! turkish_53_rast.scl\nOttoman 53-TET Makam Rast (9-8-5-9-9-8-5 commas)\n 7\n!\n 203.7736\n 384.9057\n 498.1132\n 701.8868\n 905.6604\n 1086.7925\n 1200.0"
  },
  {
    "id": "turkish_53_ussak",
    "group": "edo53",
    "namePt": "53-TET Otomano · Makam Uşşak / Bayati (8 Commas)",
    "nameEn": "53-TET Ottoman · Makam Ussak / Bayati (8 Commas)",
    "descPt": "A célebre segunda Koma bemol do Uşşak turco em 8 commas (181,1¢, −19¢ abaixo da 2ª maior) — contraste sutil e fascinante frente aos 150¢ do Bayati árabe 24-TET.",
    "descEn": "Turkish Ussak’s signature 8-comma second (181.1¢, −19¢ below major 2nd) — a revealing intonation contrast against 150¢ Arabic 24-TET Bayati.",
    "scl": "! turkish_53_ussak.scl\nOttoman 53-TET Makam Ussak (8-5-9-9-4-9-9 commas)\n 7\n!\n 181.1321\n 294.3396\n 498.1132\n 701.8868\n 792.4528\n 996.2264\n 1200.0"
  },
  {
    "id": "turkish_53_hicaz",
    "group": "edo53",
    "namePt": "53-TET Otomano · Makam Hicaz (5–12–5 Commas)",
    "nameEn": "53-TET Ottoman · Makam Hicaz (5–12–5 Commas)",
    "descPt": "Tetracorde Hicaz autêntico (113,2¢ → 384,9¢ → 498,1¢): comprime levemente a segunda aumentada (271,7¢ em vez de 300¢) trazendo fluidez vocal inconfundível.",
    "descEn": "Authentic Ottoman Hicaz tetrachord (113.2¢ → 384.9¢ → 498.1¢): gently narrows the augmented second (271.7¢ vs 300¢) for vocal poise.",
    "scl": "! turkish_53_hicaz.scl\nOttoman 53-TET Makam Hicaz (5-12-5-9-8-5-9 commas)\n 7\n!\n 113.2075\n 384.9057\n 498.1132\n 701.8868\n 883.0189\n 996.2264\n 1200.0"
  },
  {
    "id": "bohlen_pierce_13",
    "group": "non_octave",
    "namePt": "Bohlen-Pierce · 13 Passos na Tritava (3/1 = 1902¢)",
    "nameEn": "Bohlen-Pierce · 13-Step Tritave (3/1 = 1902¢)",
    "descPt": "Sistema microtonal radical SEM OITAVA! Repete-se na Tritava (razão 3/1 = oitava + quinta justa, 1901,96¢) dividida em 13 passos iguais de 146,3¢.",
    "descEn": "Radical non-octave microtonal lattice! Repeats at the Tritave (3/1 = octave + fifth, 1901.96¢) divided into 13 equal steps of 146.3¢.",
    "scl": "! bohlen_pierce_13.scl\nBohlen-Pierce 13-Step Equal Tritave (period 3/1 = 1901.955c)\n 13\n!\n 146.3042\n 292.6085\n 438.9127\n 585.2169\n 731.5212\n 877.8254\n 1024.1296\n 1170.4339\n 1316.7381\n 1463.0423\n 1609.3465\n 1755.6508\n 3/1"
  },
  {
    "id": "gamelan_pelog_bali",
    "group": "world",
    "namePt": "Gamelan Pelog Balinês (Cents Reais · Semar Pegulingan)",
    "nameEn": "Balinese Gamelan Pelog (Measured Cents)",
    "descPt": "Medição real de um conjunto Semar Pegulingan em Bali (7 tons com oitava levemente esticada em 1212¢) — combina intervalos ultracurtos e grandes vazios expressivos.",
    "descEn": "Measured Balinese Semar Pegulingan Pelog tuning (7 tones with a slightly stretched 1212¢ octave) blending tight steps and wide gaps.",
    "scl": "! gamelan_pelog_bali.scl\nBalinese Semar Pegulingan Pelog (Measured Cents)\n 7\n!\n 125.0\n 265.0\n 545.0\n 680.0\n 800.0\n 965.0\n 1212.0"
  },
  {
    "id": "gamelan_slendro_java",
    "group": "world",
    "namePt": "Gamelan Slendro Javanês (Cents Reais · Pentatônica)",
    "nameEn": "Javanese Gamelan Slendro (Measured Cents)",
    "descPt": "Pentatônica javanesa quase equidistante (~242¢ por passo com oitava em 1208¢): dissolve por completo a noção ocidental de terças maiores e menores.",
    "descEn": "Near-equidistant Javanese pentatonic (~242¢ steps with 1208¢ octave): completely dissolves Western major/minor third expectations.",
    "scl": "! gamelan_slendro_java.scl\nJavanese Gamelan Slendro (Measured Cents)\n 5\n!\n 242.0\n 486.0\n 728.0\n 972.0\n 1208.0"
  },
  {
    "id": "meantone_quarter",
    "group": "historical",
    "namePt": "Mesotônico ¼ de Comma (Renascença / Barroco)",
    "nameEn": "Quarter-Comma Meantone (Renaissance / Baroque)",
    "descPt": "Temperamento histórico dos séculos XVI–XVII com terças maiores perfeitamente puras (386,3¢) e quintas suavemente temperadas em 696,6¢.",
    "descEn": "Historical 16th–17th century temperament featuring pure 5/4 major thirds (386.3¢) and gently narrowed 696.6¢ fifths.",
    "scl": "! meantone_quarter.scl\nQuarter-Comma Meantone (7-note Diatonic)\n 7\n!\n 193.1569\n 386.3137\n 503.4216\n 696.5784\n 889.7353\n 1082.8921\n 2/1"
  },
  {
    "id": "edo_19_diatonic",
    "group": "edo",
    "namePt": "19-EDO (Escala Diatônica + Terças Doces)",
    "nameEn": "19-EDO (Diatonic Subset + Sweet Thirds)",
    "descPt": "19 divisões iguais da oitava (passos de 63,16¢). Oferece terças menores quase justas (315,8¢) e terças maiores de 378,9¢ — um dos sistemas microtonais mais musicais na guitarra.",
    "descEn": "19 equal divisions per octave (63.16¢ steps). Yields remarkably sweet minor thirds (315.8¢) and 378.9¢ major thirds.",
    "scl": "! edo_19_diatonic.scl\n19-EDO Diatonic Major Subset (3-3-2-3-3-3-2 steps)\n 7\n!\n 189.4737\n 378.9474\n 505.2632\n 694.7368\n 884.2105\n 1073.6842\n 1200.0"
  },
  {
    "id": "wendy_carlos_alpha",
    "group": "non_octave",
    "namePt": "Wendy Carlos Alpha (78¢ · Sem Oitava)",
    "nameEn": "Wendy Carlos Alpha (78¢ · Non-Octave)",
    "descPt": "Escala sintética criada por Wendy Carlos baseada em passos de 78,0¢ (9 passos = 702¢ quinta perfeita; 5 passos = 390¢ terça maior pura) sobre uma malha sem oitava.",
    "descEn": "Synthetic scale by Wendy Carlos using 78.0¢ steps (9 steps = 702¢ pure fifth; 5 steps = 390¢ near-pure major 3rd) without octave equivalence.",
    "scl": "! wendy_carlos_alpha.scl\nWendy Carlos Alpha Scale (9 steps to perfect fifth 702c)\n 9\n!\n 78.0\n 156.0\n 234.0\n 312.0\n 390.0\n 468.0\n 546.0\n 624.0\n 702.0"
  }
];

/**
 * Parses an official Scala (.scl) specification string into exact cents, frequency ratios,
 * nearest 12-TET semitone, and cent deviation telemetry.
 */
export function parseSclText(rawText) {
  if (!rawText || typeof rawText !== 'string') {
    return { ok: false, error: 'Empty .scl text' };
  }

  const lines = rawText
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => !l.startsWith('!'));

  if (lines.length < 2) {
    return { ok: false, error: 'Invalid .scl header (missing description or note count)' };
  }

  const description = lines[0] || 'Custom Scala Tuning';
  const declaredCount = parseInt(lines[1], 10);
  if (!Number.isInteger(declaredCount) || declaredCount < 1 || declaredCount > 128) {
    return { ok: false, error: `Invalid note count: "${lines[1]}"` };
  }

  const pitchLines = lines.slice(2).filter((l) => l.length > 0);
  if (pitchLines.length < declaredCount) {
    return { ok: false, error: `Expected ${declaredCount} pitch entries, found ${pitchLines.length}` };
  }

  const parsedDegrees = [
    {
      index: 0,
      raw: '1/1',
      cents: 0,
      ratio: 1,
      nearest12: 0,
      devFrom12Cents: 0
    }
  ];

  for (let i = 0; i < declaredCount; i += 1) {
    const token = pitchLines[i].split(/\s+/)[0];
    let cents = NaN;
    let ratio = NaN;

    if (token.includes('.')) {
      cents = parseFloat(token);
      if (Number.isFinite(cents)) {
        ratio = Math.pow(2, cents / 1200);
      }
    } else if (token.includes('/')) {
      const [numStr, denStr] = token.split('/');
      const num = parseFloat(numStr);
      const den = parseFloat(denStr);
      if (Number.isFinite(num) && Number.isFinite(den) && num > 0 && den > 0) {
        ratio = num / den;
        cents = 1200 * Math.log2(ratio);
      }
    } else {
      const intVal = parseFloat(token);
      if (Number.isFinite(intVal) && intVal > 0) {
        ratio = intVal;
        cents = 1200 * Math.log2(ratio);
      }
    }

    if (!Number.isFinite(cents) || !Number.isFinite(ratio) || ratio <= 0) {
      return { ok: false, error: `Invalid pitch token on entry #${i + 1}: "${token}"` };
    }

    const nearest12 = Math.round(cents / 100);
    const devFrom12Cents = cents - nearest12 * 100;

    parsedDegrees.push({
      index: i + 1,
      raw: token,
      cents,
      ratio,
      nearest12,
      devFrom12Cents
    });
  }

  const periodEntry = parsedDegrees[parsedDegrees.length - 1];
  const periodCents = periodEntry.cents;
  const periodRatio = periodEntry.ratio;
  if (periodCents <= 20) {
    return { ok: false, error: 'Scale period must be greater than 20 cents' };
  }

  // Unique degrees inside 1 period (0 .. declaredCount - 1)
  const scaleDegrees = parsedDegrees.slice(0, declaredCount);

  return {
    ok: true,
    description,
    noteCount: declaredCount,
    periodCents,
    periodRatio,
    isOctave: Math.abs(periodCents - 1200) <= 18,
    degrees: scaleDegrees, // 0 .. N-1 (without closing period)
    fullDegrees: parsedDegrees // 0 .. N (including closing period e.g. 2/1 or 3/1)
  };
}

/**
 * Serializes a parsed Scala object back to a valid .scl file string.
 */
export function exportToSclText(parsed) {
  if (!parsed || !parsed.ok) return '';
  const body = parsed.fullDegrees
    .slice(1)
    .map((d) => ` ${d.raw}`)
    .join('\n');
  return `! Exported by String Atlas — Modal Guitar Lab\n${parsed.description}\n ${parsed.noteCount}\n!\n${body}\n`;
}

/**
 * Generates an ordered frequency sequence for 1 period ascending + descending playback.
 */
export function buildScalaPlayFrequencies({ parsed, rootQ }) {
  if (!parsed || !parsed.ok) return [];
  // Anchor in comfortable guitar middle register (C3..B3: q = 96 + rootQ)
  const rootHz = qToFreq(96 + (((rootQ % 24) + 24) % 24));
  const asc = parsed.fullDegrees.map((d) => ({
    freq: rootHz * d.ratio,
    degreeIndex: d.index % parsed.noteCount,
    cents: d.cents,
    raw: d.raw
  }));
  const desc = [...asc].slice(0, -1).reverse();
  return [...asc, ...desc];
}

/**
 * Maps an arbitrary Scala tuning onto every string of the guitar (6, 7, or 8 strings)
 * across 0..maxFrets, computing exact continuous fret position, nearest 12-TET fret,
 * and exact cent deviation (±¢) from standard 12-TET frets!
 */
export function mapScalaToFretboard({ parsed, rootQ, stringsQ, maxFrets = 22 }) {
  if (!parsed || !parsed.ok) return [];

  // Anchor tonic reference in guitar register (octave 2: q = 72 + pc)
  const refRootHz = qToFreq(72 + (((rootQ % 24) + 24) % 24));
  const periodRatio = parsed.periodRatio;
  const markers = [];

  for (let strIdx = 0; strIdx < stringsQ.length; strIdx += 1) {
    const openHz = qToFreq(stringsQ[strIdx]);
    const minFreq = openHz * 0.965; // slight margin below open string
    const maxFreq = openHz * Math.pow(2, (maxFrets + 0.48) / 12);

    // Find period range kMin..kMax covering this string's frequency span
    const kMin = Math.floor(Math.log(minFreq / refRootHz) / Math.log(periodRatio)) - 1;
    const kMax = Math.ceil(Math.log(maxFreq / refRootHz) / Math.log(periodRatio)) + 1;

    for (let k = kMin; k <= kMax; k += 1) {
      const periodBaseHz = refRootHz * Math.pow(periodRatio, k);
      for (const deg of parsed.degrees) {
        const freq = periodBaseHz * deg.ratio;
        const fretFloat = 12 * Math.log2(freq / openHz);
        if (fretFloat < -0.35 || fretFloat > maxFrets + 0.45) continue;

        const nearestFret = Math.max(0, Math.min(maxFrets, Math.round(fretFloat)));
        const devCents = (fretFloat - nearestFret) * 100;

        markers.push({
          strIdx,
          guitarStr: stringsQ.length - strIdx,
          degreeIndex: deg.index,
          isRoot: deg.index === 0,
          raw: deg.raw,
          centsInPeriod: deg.cents,
          freq,
          fretFloat: Math.max(0, fretFloat),
          nearestFret,
          devCents,
          isPure12: Math.abs(devCents) <= 5
        });
      }
    }
  }

  return markers;
}

export function getScalaPresetById(id) {
  return SCALA_PRESETS.find((p) => p.id === id) || SCALA_PRESETS[0];
}
