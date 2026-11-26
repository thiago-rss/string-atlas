/**
 * Multi-Instrument String Families & Native Tunings Engine (v9.0)
 * Supports:
 * - Electric Guitar (6/7/8 strings, fretted, 25.5")
 * - Acoustic Guitar / Violão (6/7 strings, fretted, 25.4", acoustic Karplus body)
 * - Bass Guitar (4/5/6 strings, fretted or fretless, 34.0", deep sub-bass support)
 * - Arabic / Syrian Oud (6 courses, 24-TET quarter-tones, fretless with reference markers, C-F-A-d-g-c)
 * - Bowed Strings — Violin / Viola / Cello (4 strings, fretless, sustained swell/bowed response)
 * - Folk & Double-Course — Mandolin / Cavaquinho / Charango (4/5 courses, fretted)
 */
import { DB } from './database.js';
import { computeTuningInputCalibration } from '../audio/pitchDetector.js';

// Note: q = MIDI * 2 (C4=120, A4=138, E2=80, E1=56, B0=46, C2=72, G3=110, D4=124, E5=152)
export const INSTRUMENT_FAMILIES = [
  {
    id: 'electric_guitar',
    namePt: 'Guitarra Elétrica',
    nameEn: 'Electric Guitar',
    shortPt: 'Guitarra',
    shortEn: 'Guitar',
    icon: '🎸',
    defaultTonePreset: 'clean',
    fretless: false,
    defaultStringCount: 6,
    allowedStringCounts: [6, 7, 8],
    scaleLengthIn: 25.5,
    nativeTunings: []
  },
  {
    id: 'acoustic_guitar',
    namePt: 'Violão / Acústica',
    nameEn: 'Acoustic Guitar',
    shortPt: 'Violão',
    shortEn: 'Acoustic',
    icon: '🪕',
    defaultTonePreset: 'karplus',
    fretless: false,
    defaultStringCount: 6,
    allowedStringCounts: [6, 7],
    scaleLengthIn: 25.4,
    nativeTunings: [
      {
        id: 'ac_dadgad',
        group: 'modal_drone',
        namePt: 'DADGAD (D A D G A D)',
        nameEn: 'DADGAD (D A D G A D)',
        short: 'DADGAD',
        stringsQ: [76, 90, 100, 110, 122, 124]
      },
      {
        id: 'ac_open_g',
        group: 'modal_drone',
        namePt: 'Open G Violão (D G D G B D)',
        nameEn: 'Open G Acoustic (D G D G B D)',
        short: 'Open G',
        stringsQ: [76, 86, 100, 110, 118, 124]
      },
      {
        id: 'ac_violao_7_br',
        group: 'ext_7',
        namePt: 'Violão 7 Cordas BR (C E A D G B E)',
        nameEn: '7-String Brazilian (C E A D G B E)',
        short: '7-Str C',
        stringsQ: [72, 80, 90, 100, 110, 118, 128]
      }
    ]
  },
  {
    id: 'bass_guitar',
    namePt: 'Baixo (4 / 5 / 6 Cordas)',
    nameEn: 'Bass Guitar (4 / 5 / 6-Str)',
    shortPt: 'Baixo',
    shortEn: 'Bass',
    icon: '🎛',
    defaultTonePreset: 'karplus',
    fretless: false,
    defaultStringCount: 4,
    allowedStringCounts: [4, 5, 6],
    scaleLengthIn: 34.0,
    nativeTunings: [
      {
        id: 'bass_4_std',
        group: 'standard_baritone',
        namePt: '4 Cordas Standard (E1 A1 D2 G2)',
        nameEn: '4-String Standard (E1 A1 D2 G2)',
        short: '4-Str Std',
        stringsQ: [56, 66, 76, 86]
      },
      {
        id: 'bass_4_drop_d',
        group: 'drops',
        namePt: '4 Cordas Drop D (D1 A1 D2 G2)',
        nameEn: '4-String Drop D (D1 A1 D2 G2)',
        short: '4-Drop D',
        stringsQ: [52, 66, 76, 86]
      },
      {
        id: 'bass_5_std',
        group: 'ext_7',
        namePt: '5 Cordas Standard (B0 E1 A1 D2 G2)',
        nameEn: '5-String Standard (B0 E1 A1 D2 G2)',
        short: '5-Str Std',
        stringsQ: [46, 56, 66, 76, 86]
      },
      {
        id: 'bass_6_std',
        group: 'ext_8',
        namePt: '6 Cordas Standard (B0 E1 A1 D2 G2 C3)',
        nameEn: '6-String Standard (B0 E1 A1 D2 G2 C3)',
        short: '6-Str Std',
        stringsQ: [46, 56, 66, 76, 86, 96]
      }
    ]
  },
  {
    id: 'oud',
    namePt: 'Oud Árabe / Sírio (24-TET)',
    nameEn: 'Arabic / Syrian Oud (24-TET)',
    shortPt: 'Oud',
    shortEn: 'Oud',
    icon: '🪈',
    defaultTonePreset: 'karplus',
    fretless: true,
    defaultStringCount: 6,
    allowedStringCounts: [5, 6],
    scaleLengthIn: 23.2,
    nativeTunings: [
      {
        id: 'oud_syrian_cfadgc',
        group: 'modal_drone',
        namePt: 'Oud Sírio / Árabe (C2 F2 A2 d3 g3 c4)',
        nameEn: 'Syrian / Arabic Oud (C2 F2 A2 d3 g3 c4)',
        short: 'C-F-A-d-g-c',
        stringsQ: [72, 82, 92, 104, 114, 124]
      },
      {
        id: 'oud_iraqi_cfadgc',
        group: 'modal_drone',
        namePt: 'Oud Iraquiano / Clássico (C2 F2 A2 d3 g3 c4)',
        nameEn: 'Iraqi / Classical Oud (C2 F2 A2 d3 g3 c4)',
        short: 'Iraqi C',
        stringsQ: [72, 82, 92, 104, 114, 124]
      },
      {
        id: 'oud_5_course',
        group: 'modal_drone',
        namePt: 'Oud 5 Cursos (F2 A2 d3 g3 c4)',
        nameEn: '5-Course Oud (F2 A2 d3 g3 c4)',
        short: '5-Course',
        stringsQ: [82, 92, 104, 114, 124]
      }
    ]
  },
  {
    id: 'bowed_strings',
    namePt: 'Arco · Violino / Viola / Celo',
    nameEn: 'Bowed · Violin / Viola / Cello',
    shortPt: 'Arco',
    shortEn: 'Bowed',
    icon: '🎻',
    defaultTonePreset: 'swell',
    fretless: true,
    defaultStringCount: 4,
    allowedStringCounts: [4, 5],
    scaleLengthIn: 13.0,
    nativeTunings: [
      {
        id: 'bow_violin_gdae',
        group: 'standard_baritone',
        namePt: 'Violino Standard (G3 D4 A4 E5)',
        nameEn: 'Violin Standard (G3 D4 A4 E5)',
        short: 'Violin G-E',
        stringsQ: [110, 124, 138, 152]
      },
      {
        id: 'bow_viola_cgda',
        group: 'modal_drone',
        namePt: 'Viola Clássica (C3 G3 D4 A4)',
        nameEn: 'Viola Standard (C3 G3 D4 A4)',
        short: 'Viola C-A',
        stringsQ: [96, 110, 124, 138]
      },
      {
        id: 'bow_cello_cgda',
        group: 'ext_7',
        namePt: 'Violoncelo Standard (C2 G2 D3 A3)',
        nameEn: 'Cello Standard (C2 G2 D3 A3)',
        short: 'Cello C-A',
        stringsQ: [72, 86, 100, 114]
      }
    ]
  },
  {
    id: 'folk_courses',
    namePt: 'Bandolim · Cavaquinho · Charango',
    nameEn: 'Mandolin · Cavaquinho · Charango',
    shortPt: 'Bandolim/Cav',
    shortEn: 'Mandolin/Folk',
    icon: '🎶',
    defaultTonePreset: 'karplus',
    fretless: false,
    defaultStringCount: 4,
    allowedStringCounts: [4, 5],
    scaleLengthIn: 13.8,
    nativeTunings: [
      {
        id: 'folk_mandolin_gdae',
        group: 'standard_baritone',
        namePt: 'Bandolim Standard (G3 D4 A4 E5)',
        nameEn: 'Mandolin Standard (G3 D4 A4 E5)',
        short: 'Mandolin',
        stringsQ: [110, 124, 138, 152]
      },
      {
        id: 'folk_cavaquinho_dgbd',
        group: 'modal_drone',
        namePt: 'Cavaquinho Brasileiro (D4 G4 B4 D5)',
        nameEn: 'Brazilian Cavaquinho (D4 G4 B4 D5)',
        short: 'Cavaquinho',
        stringsQ: [124, 134, 142, 148]
      },
      {
        id: 'folk_charango_gceae',
        group: 'modal_drone',
        namePt: 'Charango Andino (G4 C5 E5 A4 E5)',
        nameEn: 'Andean Charango (G4 C5 E5 A4 E5)',
        short: 'Charango',
        stringsQ: [134, 144, 152, 138, 152]
      }
    ]
  }
];

export function getInstrumentById(id) {
  return INSTRUMENT_FAMILIES.find((item) => item.id === id) || INSTRUMENT_FAMILIES[0];
}

export function getTuningsForInstrument(instrumentId, customTunings = []) {
  const inst = getInstrumentById(instrumentId);
  const native = inst.nativeTunings.map((t) => ({ ...t, instrumentId: inst.id }));
  const dbMatching = DB.tunings.filter((t) => inst.allowedStringCounts.includes(t.stringsQ.length));
  const customMatching = customTunings.filter((t) => inst.allowedStringCounts.includes(t.stringsQ.length));
  return [...native, ...dbMatching, ...customMatching];
}

export function applyInstrumentSelection(instrumentId, currentState = {}) {
  const inst = getInstrumentById(instrumentId);
  const pool = getTuningsForInstrument(inst.id, currentState.customTunings || []);
  const preferredTuning = pool.find((t) => inst.allowedStringCounts.includes(t.stringsQ.length)) || pool[0];
  const nextStringsQ = preferredTuning ? [...preferredTuning.stringsQ] : [80, 90, 100, 110, 118, 128];
  const cal = computeTuningInputCalibration(nextStringsQ, currentState.refA4Hz || 440);

  return {
    instrumentId: inst.id,
    tuningId: preferredTuning ? preferredTuning.id : (currentState.tuningId || 'standard'),
    customStringsQ: nextStringsQ,
    stringCount: nextStringsQ.length,
    fretless: inst.fretless,
    tonePreset: inst.defaultTonePreset,
    lineInputGain: cal.inputGain,
    lineRmsGate: cal.rmsGate,
    inspectedNote: null
  };
}
