/**
 * Reactive Unidirectional Store (no global state leaks, zero circular view imports)
 */
import { DB } from '../core/database.js';

const STORAGE_KEY = 'string_atlas_prefs_v1';

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
    // Ignore storage quota / private mode errors
  }
}

const saved = loadSavedPrefs();
const defaultTuning = DB.tunings[0];

const state = {
  lang: saved.lang === 'en' ? 'en' : 'pt',
  theme: saved.theme === 'nahar' ? 'nahar' : 'layl',
  category: 'all',
  scaleId: 'maqam_bayati',
  rootQ: 4, // D (matches classic Bayati & DADGAD exploration)
  tuningId: defaultTuning.id,
  customStringsQ: [...defaultTuning.stringsQ],
  retunerOpen: false,
  microMode: 'bend', // 'bend' | 'slide' | 'frets24'
  labelMode: 'note', // 'note' | 'degree' | 'cents'
  harmonicsOn: false,
  droneOn: false,
  droneFifth: true,
  isPlayingScale: false,
  playingPcQ: null,
  bpm: 96,
  inspectedNote: null,
  obliqueIndex: 0
};

const listeners = new Set();

export function getState() {
  return state;
}

export function getActiveScale() {
  return DB.scales.find((s) => s.id === state.scaleId) || DB.scales[0];
}

export function getActiveTuning() {
  return DB.tunings.find((t) => t.id === state.tuningId) || DB.tunings[0];
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function setState(patch) {
  Object.assign(state, patch);
  if ('lang' in patch || 'theme' in patch) {
    savePrefs(state);
  }
  listeners.forEach((fn) => fn(state, patch));
}
