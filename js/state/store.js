/**
 * Reactive Unidirectional Store v5.0
 */
import { DB } from '../core/database.js';
import { VALID_THEME_IDS } from '../core/themes.js';
import { generateVoicings } from '../core/voicingEngine.js';
import { generateEtude } from '../core/etudeGenerator.js';
import { VAMP_PRESETS } from '../core/vampEngine.js';
import { getDefaultPackForCount } from '../core/tensionEngine.js';
import { decodeSessionHash, loadSnapshots, saveSnapshots } from '../core/sessionCodec.js';

const STORAGE_KEY = 'string_atlas_prefs_v82';

function loadSavedPrefs() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('string_atlas_prefs_v81') || localStorage.getItem('string_atlas_prefs_v8') || localStorage.getItem('string_atlas_prefs_v78') || localStorage.getItem('string_atlas_prefs_v7') || localStorage.getItem('string_atlas_prefs_v6') || localStorage.getItem('string_atlas_prefs_v5') || localStorage.getItem('string_atlas_prefs_v4');
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
        theme: state.theme,
        tuningId: state.tuningId,
        tonePreset: state.tonePreset,
        completedLessons: state.completedLessons,
        earStats: state.earStats,
        leftHanded: state.leftHanded
      })
    );
  } catch {
    // Ignore storage errors
  }
}


export function isMobilePortraitViewport() {
  if (typeof window === 'undefined') return false;
  const w = window.innerWidth;
  const h = window.innerHeight;
  return w <= 768 && h >= w * 0.92;
}

export function getEffectiveOrientation(st = state) {
  if (st.fretOrientationMode === 'vertical') return 'vertical';
  if (st.fretOrientationMode === 'horizontal') return 'horizontal';
  return isMobilePortraitViewport() ? 'vertical' : 'horizontal';
}

export function getEffectiveFretZoom(st = state) {
  if (st.fretZoomOverride === 12 || st.fretZoomOverride === 22) {
    return st.fretZoomOverride;
  }
  return getEffectiveOrientation(st) === 'vertical' ? 12 : 22;
}

const saved = loadSavedPrefs();
const hashPayload = typeof window !== 'undefined' ? decodeSessionHash(window.location.hash) : null;

const validScaleIds = new Set(DB.scales.map((s) => s.id));
const validTuningIds = new Set(DB.tunings.map((t) => t.id));
const validChordIds = new Set(DB.chords.map((c) => c.id));
const validRhythmIds = new Set(DB.rhythms.map((r) => r.id));
const validVampIds = new Set(VAMP_PRESETS.map((v) => v.id));

const resolvedTuningId = (hashPayload && validTuningIds.has(hashPayload.t))
  ? hashPayload.t
  : (validTuningIds.has(saved.tuningId) ? saved.tuningId : DB.tunings[0].id);
const initialTuning = DB.tunings.find((t) => t.id === resolvedTuningId) || DB.tunings[0];

const resolvedRhythmId = (hashPayload && validRhythmIds.has(hashPayload.ry))
  ? hashPayload.ry
  : DB.rhythms[1].id;
const initialRhythm = DB.rhythms.find((r) => r.id === resolvedRhythmId) || DB.rhythms[1];

const resolvedVampId = (hashPayload && validVampIds.has(hashPayload.vp))
  ? hashPayload.vp
  : VAMP_PRESETS[0].id;
const initialVamp = VAMP_PRESETS.find((v) => v.id === resolvedVampId) || VAMP_PRESETS[0];
const initialGaugePack = getDefaultPackForCount(initialTuning.stringsQ.length, initialTuning.id);

const state = {
  lang: saved.lang === 'en' ? 'en' : 'pt',
  theme: (hashPayload && VALID_THEME_IDS.has(hashPayload.th))
    ? hashPayload.th
    : (VALID_THEME_IDS.has(saved.theme) ? saved.theme : 'layl'),
  headerMenuOpen: false,
  pwaInstallable: false,
  themeDrawerOpen: false,
  deckCompartment: null, // null | 'setup' | 'neck' | 'audio'
  notationOpen: false,
  workspaceOpen: false,
  zenMode: false,
  paletteOpen: false,
  paletteQuery: '',
  shortcutsOpen: false,
  snapshotsOpen: false,
  snapshots: loadSnapshots(),

  // Scale / Modal browsing & filtering state
  category: 'all',
  temperamentFilter: 'all',
  scaleSearch: '',
  atlasOpen: false,
  scaleId: (hashPayload && validScaleIds.has(hashPayload.s)) ? hashPayload.s : 'maqam_bayati',
  rootQ: (hashPayload && Number.isInteger(hashPayload.r) && hashPayload.r >= 0 && hashPayload.r <= 23) ? hashPayload.r : 4,
  customScaleIntervalsQ: null,

  // Scordatura & Fretboard state
  stringCount: initialTuning.stringsQ.length,
  tuningId: initialTuning.id,
  customStringsQ: [...initialTuning.stringsQ],
  retunerOpen: false,
  microMode: (hashPayload && ['bend', 'slide', 'frets24'].includes(hashPayload.m)) ? hashPayload.m : 'bend',
  labelMode: (hashPayload && ['note', 'degree', 'cents'].includes(hashPayload.l)) ? hashPayload.l : 'note',
  harmonicsOn: hashPayload ? Boolean(hashPayload.h) : false,

  // Phase 5: Closed-Position Fretboard Window Filter
  fretWindowOn: hashPayload ? Boolean(hashPayload.fw) : false,
  fretWindowStart: (hashPayload && Number.isInteger(hashPayload.fs)) ? Math.max(0, Math.min(18, hashPayload.fs)) : 0,
  fretWindowSpan: (hashPayload && Number.isInteger(hashPayload.fl)) ? Math.max(4, Math.min(7, hashPayload.fl)) : 5,
  leftHanded: Boolean(saved.leftHanded),
  fretOrientationMode: 'auto', // 'auto' | 'vertical' | 'horizontal'
  fretZoomOverride: null,      // null (auto: 12 vertical / 22 horizontal) | 12 | 22
  viewportTick: 0,

  // Audio state
  droneOn: false,
  droneFifth: true,
  isPlayingScale: false,
  playingPcQ: null,
  bpm: 96,
  inspectedNote: null,

  // Workspace tab ('vamp' | 'study' | 'line' | 'etude' | 'harmony' | 'rhythm' | 'dossier')
  activeTab: 'radar',

  // Phase 5: Modal Vamp & Sayr Modulation Lab
  vampPresetId: initialVamp.id,
  vampSteps: initialVamp.steps.map((s) => ({ ...s })),
  vampBpm: initialVamp.bpm,
  vampBeatsPerBar: initialVamp.beatsPerBar,
  vampStyle: 'pad', // 'pad' | 'strum'
  vampClickOn: true,
  vampSyncNeck: true,
  vampPlaying: false,
  vampActiveStepIdx: 0,
  vampActiveBar: 0,
  vampActiveBeat: 0,

  // Phase 2: Harmony & Voicing Lab
  harmonyMode: 'catalog',
  chordId: (hashPayload && validChordIds.has(hashPayload.c)) ? hashPayload.c : 'quartal_3',
  customSetIntervalsQ: [0, 2, 12],
  voicingOverlayOn: hashPayload ? Boolean(hashPayload.vo) : false,
  selectedVoicingIdx: 0,
  computedVoicings: [],

  // Phase 3: Procedural Experimental Etude Lab
  etudePatternId: (hashPayload && hashPayload.ep) ? hashPayload.ep : 'micro_bend_lab',
  etudeZoneId: 'mid',
  etudeGroupingId: 'group5',
  etudeLength: 16,
  etudeDirection: 'pendulum',
  etudeSeed: 1,
  etudeBpm: 92,
  etudeLoop: true,
  etudeAutoBpm: false,
  etudeClick: true,
  etudePlaying: false,
  etudeActiveIdx: -1,
  currentEtude: null,

  // Synchronized 24-TET Notation & Tablature
  notationMode: 'etude',
  phraseEvents: [],

  // Universal Rhythm & Polymeter Engine
  rhythmFilter: 'all',
  rhythmId: initialRhythm.id,
  rhythmSteps: [...initialRhythm.steps],
  rhythmBpm: 112,
  rhythmPlaying: false,
  polyEnabled: false,
  polyLength: 4,

  // Phase 4: Line Mode & 24-TET Pitch Detector
  lineModeRunning: false,
  lineInputMode: 'line',
  lineDeviceId: '',
  lineChannel: 'mix', // 'mix' | 'ch1' | 'ch2'
  lineInputMeta: null,
  audioInputDevices: [],
  lineInputGain: 1.4,
  lineRmsGate: 0.014,
  lineShowOnNeck: true,
  lineValidateEtude: false,
  lineError: '',

  // Phase 8.0: Scala (.scl) Microtonal Frontier
  scalaPresetId: 'ji_5limit',
  scalaCustomText: '',
  scalaOverlayOn: false,
  scalaEditorOpen: false,
  scalaParseError: '',

  // Phase 4 & 8: Complete 8-Chapter Progressive Study Guide
  studyModuleFilter: 'all',
  studyStatusFilter: 'all', // 'all' | 'pending' | 'done'
  activeLessonId: null,
  openDossierLessonId: null,
  completedLessons: Array.isArray(saved.completedLessons) ? saved.completedLessons : [],

  // Phase 6: Studio Electric Guitar Tone & FX Rack
  fxOpen: false,
  tonePreset: ['clean', 'swell', 'crunch', 'fuzz'].includes(saved.tonePreset) ? saved.tonePreset : 'clean',
  delayMix: 0.22,
  delayTime: 0.28,
  tremoloDepth: 0.0,
  tremoloRate: 4.2,
  masterVolume: 0.72,

  // Phase 6: 24-TET Modal Radar & Pivot Explorer
  radarPivotFilter: 'all',
  radarCompareScaleId: null,
  radarCompareRootQ: 0,
  radarOverlayOnNeck: false,

  // Phase 6: 24-TET Ear Training Lab
  earMode: 'micro_intervals',
  earIntervalSet: 'seconds',
  earScalePool: 'arabic',
  earQuestion: null,
  earSelectedId: null,
  earStats: (saved.earStats && typeof saved.earStats === 'object')
    ? saved.earStats
    : { correct: 0, total: 0, streak: 0, bestStreak: 0 },

  // Phase 7.3: String Tension Calculator Lab
  tensionScalePresetId: initialTuning.stringsQ.length === 8 ? '28_0' : (initialTuning.stringsQ.length === 7 ? '26_5' : '25_5'),
  tensionScaleTreble: initialTuning.stringsQ.length === 8 ? 28.0 : (initialTuning.stringsQ.length === 7 ? 26.5 : 25.5),
  tensionScaleBass: initialTuning.stringsQ.length === 8 ? 28.0 : (initialTuning.stringsQ.length === 7 ? 26.5 : 25.5),
  tensionMultiScale: false,
  tensionMaterial: 'nickel_plated',
  tensionUnit: 'lbs',
  tensionTargetLbs: 16.5,
  tensionPackId: initialGaugePack.id,
  tensionGauges: initialGaugePack.strings.map((x) => ({ ...x })),

  // Oblique Lab
  obliqueIndex: 0
};

export function scaleIsMicrotonal(scale) {
  return scale.intervalsQ.some((iv) => iv % 2 !== 0);
}

export function getFilteredScales(st = state) {
  const q = (st.scaleSearch || '').trim().toLowerCase();
  return DB.scales.filter((s) => {
    if (st.category !== 'all' && s.category !== st.category) return false;
    const isMicro = scaleIsMicrotonal(s);
    if (st.temperamentFilter === '24tet' && !isMicro) return false;
    if (st.temperamentFilter === '12tet' && isMicro) return false;
    if (q) {
      const hay = [
        s.namePt, s.nameEn, s.subfamilyPt, s.subfamilyEn,
        ...(s.tagsPt || []), ...(s.tagsEn || []), s.dossier?.repertoire || ''
      ].join(' ').toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
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
      subfamilyPt: 'Conjunto Customizado',
      subfamilyEn: 'Custom Set',
      namePt: 'Conjunto Customizado (Pitch-Class Set)',
      nameEn: 'Custom Pitch-Class Set',
      intervalsQ: state.customScaleIntervalsQ,
      characteristicQ: state.customScaleIntervalsQ.slice(1, 3),
      tagsPt: ['Custom 24-TET', `${state.customScaleIntervalsQ.length} Notas`],
      tagsEn: ['Custom 24-TET', `${state.customScaleIntervalsQ.length} Notes`],
      dossier: {
        structurePt: 'Conjunto personalizado criado no Construtor de Pitch-Class Set.',
        structureEn: 'Custom collection crafted in the Pitch-Class Set Builder.',
        temperamentPt: 'Compatível com 12-TET e quartos de tom 24-TET dependendo dos graus ativados.',
        temperamentEn: 'Supports both 12-TET and 24-TET quarter-tones depending on toggled degrees.',
        articulationPt: 'Alterne modos Microtonal e projete voicings calculados sobre o braço.',
        articulationEn: 'Switch Microtonal modes and overlay computed voicings onto the neck.',
        repertoire: 'String Atlas Custom Lab'
      }
    };
  }
  return DB.scales.find((s) => s.id === state.scaleId) || DB.scales[0];
}

export function getActiveTuning() {
  return DB.tunings.find((t) => t.id === state.tuningId) || DB.tunings[0];
}

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

function recomputeEtude() {
  state.currentEtude = generateEtude({
    scale: getActiveScale(),
    rootQ: state.rootQ,
    stringsQ: state.customStringsQ,
    microMode: state.microMode,
    patternId: state.etudePatternId,
    zoneId: state.etudeZoneId,
    groupingId: state.etudeGroupingId,
    length: state.etudeLength,
    direction: state.etudeDirection,
    seed: state.etudeSeed
  });
  if (state.etudeActiveIdx >= state.currentEtude.events.length) {
    state.etudeActiveIdx = -1;
  }
}

recomputeVoicings();
recomputeEtude();

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

const ETUDE_AFFECTING_KEYS = new Set([
  'scaleId',
  'customScaleIntervalsQ',
  'rootQ',
  'customStringsQ',
  'tuningId',
  'microMode',
  'etudePatternId',
  'etudeZoneId',
  'etudeGroupingId',
  'etudeLength',
  'etudeDirection',
  'etudeSeed'
]);

export function setState(patch) {
  if ('activeTab' in patch && !('workspaceOpen' in patch)) {
    state.workspaceOpen = true;
  }
  Object.assign(state, patch);

  const patchKeys = Object.keys(patch);
  if (patchKeys.some((k) => VOICING_AFFECTING_KEYS.has(k))) {
    recomputeVoicings();
  }
  if (patchKeys.some((k) => ETUDE_AFFECTING_KEYS.has(k))) {
    recomputeEtude();
  }
  if (state.tensionGauges.length !== state.customStringsQ.length) {
    const autoPack = getDefaultPackForCount(state.customStringsQ.length, state.tuningId);
    state.tensionPackId = autoPack.id;
    state.tensionGauges = autoPack.strings.map((x) => ({ ...x }));
  }

  if ('snapshots' in patch) {
    saveSnapshots(state.snapshots);
  }
  if ('lang' in patch || 'theme' in patch || 'tuningId' in patch || 'completedLessons' in patch || 'tonePreset' in patch || 'earStats' in patch || 'leftHanded' in patch) {
    savePrefs(state);
  }

  listeners.forEach((fn) => fn(state, patch));
}
