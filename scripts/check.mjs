/**
 * Pre-commit integrity validator for String Atlas v4.0
 * Run: node scripts/check.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { DB } from '../js/core/database.js';
import { generateVoicings } from '../js/core/voicingEngine.js';
import {
  ETUDE_PATTERNS,
  exportEtudeToAsciiTab,
  generateEtude
} from '../js/core/etudeGenerator.js';
import { STUDY_LESSONS, STUDY_MODULES } from '../js/core/studyGuide.js';
import { STUDY_DOSSIERS } from '../js/core/studyDossiers.js';
import { analyzePitch24, detectPitchYIN } from '../js/audio/pitchDetector.js';

const ROOT = process.cwd();
let errors = 0;

function fail(msg) {
  console.error(`✖ ${msg}`);
  errors += 1;
}

function ok(msg) {
  console.log(`✔ ${msg}`);
}

const jsFiles = [
  'sw.js',
  'js/main.js',
  'js/state/store.js',
  'js/core/theory24.js',
  'js/core/database.js',
  'js/core/i18n.js',
  'js/core/voicingEngine.js',
  'js/core/etudeGenerator.js',
  'js/core/studyGuide.js',
  'js/core/studyDossiers.js',
  'js/audio/synthEngine.js',
  'js/audio/rhythmEngine.js',
  'js/audio/pitchDetector.js',
  'js/views/fretboardView.js',
  'js/views/deckPanelsView.js',
  'js/views/notationView.js',
  'js/views/studyGuideView.js',
  'js/views/lineModeView.js',
  'js/views/harmonyView.js',
  'js/views/etudeView.js',
  'js/views/rhythmView.js',
  'js/views/dossierView.js'
];

// 1. Validate JS syntax across all modules
for (const rel of jsFiles) {
  const full = path.join(ROOT, rel);
  if (!fs.existsSync(full)) {
    fail(`Missing JS file: ${rel}`);
    continue;
  }
  try {
    execSync(`node --check "${full}"`, { stdio: 'pipe' });
  } catch (err) {
    fail(`Syntax error in ${rel}: ${err.stderr?.toString() || err.message}`);
  }
}
if (errors === 0) ok(`JS syntax valid across ${jsFiles.length} modules`);

// 2. Validate DB.scales
const catIds = new Set(DB.categories.map((c) => c.id));
const scaleIds = new Set();
for (const s of DB.scales) {
  if (scaleIds.has(s.id)) fail(`Duplicate scale id: ${s.id}`);
  scaleIds.add(s.id);
  if (!catIds.has(s.category)) fail(`Scale ${s.id} has unknown category: ${s.category}`);
  if (!s.intervalsQ.includes(0)) fail(`Scale ${s.id} missing root 0`);
  for (const iv of s.intervalsQ) {
    if (!Number.isInteger(iv) || iv < 0 || iv > 23) fail(`Scale ${s.id} invalid intervalQ: ${iv}`);
  }
}
ok(`Validated ${DB.scales.length} scales across ${DB.categories.length - 1} categories`);

// 3. Validate DB.tunings
const tuningIds = new Set();
for (const tun of DB.tunings) {
  if (tuningIds.has(tun.id)) fail(`Duplicate tuning id: ${tun.id}`);
  tuningIds.add(tun.id);
  if (tun.stringsQ.length !== 6) fail(`Tuning ${tun.id} must have 6 strings`);
}
ok(`Validated ${DB.tunings.length} tunings (incl. B Standard & A Standard)`);

// 4. Validate DB.chords & Voicing Solver
const chordIds = new Set();
const coreTunings = ['standard', 'b_standard', 'a_standard']
  .map((id) => DB.tunings.find((t) => t.id === id))
  .filter(Boolean);

for (const c of DB.chords) {
  if (chordIds.has(c.id)) fail(`Duplicate chord id: ${c.id}`);
  chordIds.add(c.id);
  for (const tun of coreTunings) {
    const voicings = generateVoicings({ rootQ: 4, intervalsQ: c.intervalsQ, stringsQ: tun.stringsQ, limit: 6 });
    if (voicings.length === 0) fail(`0 voicings for ${c.id} on ${tun.id}`);
  }
}
ok(`Validated ${DB.chords.length} experimental chords on E/B/A Standard`);

// 5. Validate DB.rhythms & Etude Patterns
const rhythmIds = new Set(DB.rhythms.map((r) => r.id));
const patternIds = new Set(ETUDE_PATTERNS.map((p) => p.id));

const sampleScale = DB.scales.find((s) => s.id === 'maqam_bayati');
const bStd = DB.tunings.find((t) => t.id === 'b_standard');
for (const pat of ETUDE_PATTERNS) {
  const etude = generateEtude({
    scale: sampleScale, rootQ: 4, stringsQ: bStd.stringsQ,
    microMode: 'bend', patternId: pat.id, zoneId: 'mid', groupingId: 'group5', length: 16, seed: 2
  });
  if (!etude.events.length) fail(`Etude returned 0 events for ${pat.id}`);
  const ascii = exportEtudeToAsciiTab({ etude, scaleName: sampleScale.namePt, rootQ: 4, stringsQ: bStd.stringsQ, microMode: 'bend' });
  if (!ascii.includes('|')) fail(`Invalid ASCII tab export for ${pat.id}`);
}
ok(`Validated ${ETUDE_PATTERNS.length} procedural etude patterns & ASCII tab export`);

// 6. Validate Progressive Study Guide & Matching Dossiers (Oud Curriculum Architect contract)
const modIds = new Set(STUDY_MODULES.map((m) => m.id));
const lessonIds = new Set();
for (const l of STUDY_LESSONS) {
  if (lessonIds.has(l.id)) fail(`Duplicate lesson id: ${l.id}`);
  lessonIds.add(l.id);
  if (!modIds.has(l.moduleId)) fail(`Lesson ${l.id} unknown moduleId: ${l.moduleId}`);
  if (!STUDY_DOSSIERS[l.id]) fail(`Lesson ${l.id} missing matching STUDY_DOSSIERS entry`);
  const d = STUDY_DOSSIERS[l.id];
  if (d && (!d.structurePt || !d.structureEn || !d.pitfallPt || !d.experimentPt)) {
    fail(`Lesson ${l.id} dossier incomplete`);
  }
  const p = l.preset;
  if (!scaleIds.has(p.scaleId)) fail(`Lesson ${l.id} unknown scaleId: ${p.scaleId}`);
  if (!tuningIds.has(p.tuningId)) fail(`Lesson ${l.id} unknown tuningId: ${p.tuningId}`);
  if (p.chordId && !chordIds.has(p.chordId)) fail(`Lesson ${l.id} unknown chordId: ${p.chordId}`);
  if (p.rhythmId && !rhythmIds.has(p.rhythmId)) fail(`Lesson ${l.id} unknown rhythmId: ${p.rhythmId}`);
  if (p.etudePatternId && !patternIds.has(p.etudePatternId)) fail(`Lesson ${l.id} unknown etudePatternId: ${p.etudePatternId}`);
  if (!Number.isInteger(p.rootQ) || p.rootQ < 0 || p.rootQ > 23) fail(`Lesson ${l.id} invalid rootQ: ${p.rootQ}`);
}
ok(`Validated ${STUDY_MODULES.length} chapters, ${STUDY_LESSONS.length} study lessons & matching dossiers`);

// 7. Unit-test YIN 24-TET Pitch Detector on Baritone A1 (55Hz), B1 (61.74Hz) & E½♭3 (160.19Hz = +50c bend!)
const sr = 48000;
const testTones = [
  { label: 'A1 (A Standard 6th)', hz: 55.0, expectedNote: 'A1', maxErrHz: 0.4 },
  { label: 'B1 (B Standard 6th)', hz: 61.735, expectedNote: 'B1', maxErrHz: 0.5 },
  { label: 'E½♭3 (Bayati +50c)', hz: 440 * Math.pow(2, (103 - 138) / 24), expectedNote: 'E½♭3', maxErrHz: 0.8 }
];

for (const tc of testTones) {
  const buf = new Float32Array(4096);
  for (let i = 0; i < buf.length; i += 1) {
    // Fundamental + realistic 2nd harmonic
    buf[i] = 0.65 * Math.sin((2 * Math.PI * tc.hz * i) / sr) + 0.25 * Math.sin((4 * Math.PI * tc.hz * i) / sr);
  }
  const det = detectPitchYIN(buf, sr, 0.01);
  if (!det.freq || Math.abs(det.freq - tc.hz) > tc.maxErrHz) {
    fail(`YIN pitch error on ${tc.label}: got ${det.freq}, expected ${tc.hz}`);
    continue;
  }
  const info = analyzePitch24(det.freq);
  if (info.noteName24 !== tc.expectedNote) {
    fail(`24-TET label mismatch on ${tc.label}: got ${info.noteName24}, expected ${tc.expectedNote}`);
  }
}
ok(`Unit-tested YIN 24-TET DSP engine (A1 55Hz, B1 61.7Hz & E½♭3 +50¢ micro-bend)`);

// 8. Validate sw.js CORE_ASSETS exist on disk
const swSrc = fs.readFileSync(path.join(ROOT, 'sw.js'), 'utf8');
const assetMatches = [...swSrc.matchAll(/'(\.\/[^']+)'/g)].map((m) => m[1]);
for (const asset of assetMatches) {
  if (asset === './') continue;
  const diskPath = path.join(ROOT, asset.replace(/^\.\//, ''));
  if (!fs.existsSync(diskPath)) fail(`sw.js CORE_ASSETS missing on disk: ${asset}`);
}
ok(`Verified ${assetMatches.length} sw.js CORE_ASSETS entries`);

if (errors > 0) {
  console.error(`\nFailed with ${errors} error(s).`);
  process.exit(1);
}
console.log('\nAll String Atlas v4.0 integrity checks passed.');
