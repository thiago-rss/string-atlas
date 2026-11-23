/**
 * Reactive Unidirectional Store v2.0
 */
import { DB } from '../core/database.js';
import { generateVoicings } from '../core/voicingEngine.js';

const STORAGE_KEY = 'string_atlas_prefs_v2';

function loadSavedPrefs() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function savePrefs(state) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        lang: state.lang,
        theme: state.theme
      })
    );
  } catch {
    // Ignore storage errors
  }
}

const saved = loadSavedPrefs();
const defaultTuning = DB.tunings[0];
const defaultRhythm = DB.rhythms[1]; // Sama'i Thaqil 10/8 — immediately showcases experimental identity

const state = {
  lang: saved.lang === 'en' ? 'en' : 'pt',
  theme: saved.theme === 'nahar' ? 'nahar' : 'layl',

  // Scale / Modal state
  category: 'all',
  scaleId: 'maqam_bayati',
  rootQ: 4, // D
  customScaleIntervalsQ: null, // optional projection from custom pitch-class set

  // Scordatura & Fretboard state
  tuningId: defaultTuning.id,
  customStringsQ: [...defaultTuning.stringsQ],
  retunerOpen: false,
  microMode: 'bend', // 'bend' | 'slide' | 'frets24'
  labelMode: 'note', // 'note' | 'degree' | 'cents'
  harmonicsOn: false,

  // Audio state
  droneOn: false,
  droneFifth: true,
  isPlayingScale: false,
  playingPcQ: null,
  bpm: 96,
  inspectedNote: null,

  // Phase 2: Workspace tab ('harmony' | 'rhythm' | 'dossier')
  activeTab: 'harmony',

  // Phase 2: Harmony & Voicing Lab
  harmonyMode: 'catalog', // 'catalog' | 'custom'
  chordId: 'quartal_3',
  customSetIntervalsQ: [0, 2, 12], // Viennese [0,1,6] default in builder
  voicingOverlayOn: true,
  selectedVoicingIdx: 0,
  computedVoicings: [],

  // Phase 2: Synchronized 24-TET Notation & Tablature
  notationMode: 'voicing', // 'voicing' | 'scale' | 'phrase'
  phraseEvents: [], // [{ q, guitarStr, fret, isMicro, intervalQ }]

  // Phase 2: Universal Rhythm & Polymeter Engine
  rhythmFilter: 'all', // 'all' | 'iqa' | 'aksak'
  rhythmId: defaultRhythm.id,
  rhythmSteps: [...defaultRhythm.steps],
  rhythmBpm: 112,
  rhythmPlaying: false,
  polyEnabled: false,
  polyLength: 4,

  // Oblique Lab
  obliqueIndex: 0
};

function recomputeVoicings() {
  const intervalsQ = getActiveChordIntervalsQ();
  state.computedVoicings = generateVoicings({
    rootQ: state.rootQ,
    intervalsQ,
    stringsQ: state.customStringsQ,
    limit: 12
  });
  if (state.selectedVoicingIdx >= state.computedVoicings.length) {
    state.selectedVoicingIdx = 0;
  }
}

export function getActiveChordIntervalsQ() {
  if (state.harmonyMode === 'custom') {
    return state.customSetIntervalsQ.length >= 2 ? state.customSetIntervalsQ : [0, 14];
  }
  const ch = DB.chords.find((c) => c.id === state.chordId) || DB.chords[0];
  return ch.intervalsQ;
}

export function getActiveChord() {
  return DB.chords.find((c) => c.id === state.chordId) || DB.chords[0];
}

export function getActiveVoicing() {
  if (!state.computedVoicings.length) return null;
  return state.computedVoicings[state.selectedVoicingIdx] || state.computedVoicings[0];
}

export function getActiveRhythm() {
  return DB.rhythms.find((r) => r.id === state.rhythmId) || DB.rhythms[0];
}

export function getActiveScale() {
  if (state.customScaleIntervalsQ && state.customScaleIntervalsQ.length >= 2) {
    return {
      id: '__custom_set__',
      category: 'postTonal',
      namePt: 'Conjunto Customizado (Pitch-Class Set)',
      nameEn: 'Custom Pitch-Class Set',
      intervalsQ: state.customScaleIntervalsQ,
      characteristicQ: state.customScaleIntervalsQ.slice(1, 3),
      tagsPt: ['Custom 24-TET', `${state.customScaleIntervalsQ.length} Notas`],
      tagsEn: ['Custom 24-TET', `${state.customScaleIntervalsQ.length} Notes`],
      dossier: {
        structurePt: 'Conjunto personalizado criado no Construtor de Pitch-Class Set. Altere os graus na aba Harmonia & Voicings para explorar novas simetrias.',
        structureEn: 'Custom collection crafted in the Pitch-Class Set Builder. Toggle degrees in Harmony & Voicings to discover new symmetries.',
        temperamentPt: 'Compatível com 12-TET e quartos de tom 24-TET dependendo dos graus ativados.',
        temperamentEn: 'Supports both 12-TET and 24-TET quarter-tones depending on toggled degrees.',
        articulationPt: 'Experimente alternar os modos Microtonal e projetar os voicings calculados sobre o braço.',
        articulationEn: 'Experiment with switching Microtonal modes and overlaying computed voicings onto the neck.',
        repertoire: 'String Atlas Custom Lab'
      }
    };
  }
  return DB.scales.find((s) => s.id === state.scaleId) || DB.scales[0];
}

export function getActiveTuning() {
  return DB.tunings.find((t) => t.id === state.tuningId) || DB.tunings[0];
}

// Initial voicing computation
recomputeVoicings();

const listeners = new Set();

export function getState() {
  return state;
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

const VOICING_AFFECTING_KEYS = new Set([
  'rootQ',
  'customStringsQ',
  'tuningId',
  'chordId',
  'harmonyMode',
  'customSetIntervalsQ'
]);

export function setState(patch) {
  Object.assign(state, patch);

  if (Object.keys(patch).some((k) => VOICING_AFFECTING_KEYS.has(k))) {
    recomputeVoicings();
  }

  if ('lang' in patch || 'theme' in patch) {
    savePrefs(state);
  }

  listeners.forEach((fn) => fn(state, patch));
}
