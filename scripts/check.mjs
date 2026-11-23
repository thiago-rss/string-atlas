/**
 * Pre-commit integrity validator for String Atlas v5.0
 * Run: node scripts/check.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { DB } from '../js/core/database.js';
import { generateVoicings } from '../js/core/voicingEngine.js';
import { ETUDE_PATTERNS, exportEtudeToAsciiTab, generateEtude } from '../js/core/etudeGenerator.js';
import { VAMP_PRESETS, buildVampFromCurrentLab } from '../js/core/vampEngine.js';
import { decodeSessionHash, encodeSessionHash } from '../js/core/sessionCodec.js';
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
  'js/core/vampEngine.js',
  'js/core/sessionCodec.js',
  'js/core/studyGuide.js',
  'js/core/studyDossiers.js',
  'js/audio/synthEngine.js',
  'js/audio/rhythmEngine.js',
  'js/audio/pitchDetector.js',
  'js/views/fretboardView.js',
  'js/views/deckPanelsView.js',
  'js/views/notationView.js',
  'js/views/vampView.js',
  'js/views/snapshotsView.js',
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

// 2. Validate DB.scales, tunings, chords, rhythms
const scaleIds = new Set(DB.scales.map((s) => s.id));
const tuningIds = new Set(DB.tunings.map((t) => t.id));
const chordIds = new Set(DB.chords.map((c) => c.id));
const rhythmIds = new Set(DB.rhythms.map((r) => r.id));
const patternIds = new Set(ETUDE_PATTERNS.map((p) => p.id));

for (const tunId of ['standard', 'b_standard', 'a_standard']) {
  const tun = DB.tunings.find((t) => t.id === tunId);
  for (const c of DB.chords) {
    const v = generateVoicings({ rootQ: 4, intervalsQ: c.intervalsQ, stringsQ: tun.stringsQ, limit: 4 });
    if (!v.length) fail(`0 voicings for ${c.id} on ${tunId}`);
  }
}
ok(`Validated ${DB.scales.length} scales, ${DB.tunings.length} tunings & ${DB.chords.length} chords across E/B/A Standard`);

// 3. Validate Procedural Etudes
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
ok(`Validated ${ETUDE_PATTERNS.length} procedural etude patterns & ASCII export`);

// 4. Validate Phase 5 VAMP_PRESETS & dynamic builder
const vampIds = new Set();
for (const vp of VAMP_PRESETS) {
  if (vampIds.has(vp.id)) fail(`Duplicate vamp id: ${vp.id}`);
  vampIds.add(vp.id);
  if (!tuningIds.has(vp.tuningId)) fail(`Vamp ${vp.id} unknown tuningId: ${vp.tuningId}`);
  if (!Array.isArray(vp.steps) || vp.steps.length < 2) fail(`Vamp ${vp.id} needs >= 2 steps`);
  for (const st of vp.steps) {
    if (!scaleIds.has(st.scaleId)) fail(`Vamp ${vp.id} unknown scaleId: ${st.scaleId}`);
    if (!chordIds.has(st.chordId)) fail(`Vamp ${vp.id} unknown chordId: ${st.chordId}`);
    if (!Number.isInteger(st.rootQ) || st.rootQ < 0 || st.rootQ > 23) fail(`Vamp ${vp.id} invalid rootQ: ${st.rootQ}`);
  }
}
const autoVamp = buildVampFromCurrentLab({ rootQ: 22, scale: sampleScale, chordId: 'min_maj7_9' });
if (autoVamp.length !== 2) fail('buildVampFromCurrentLab did not return 2 steps');
ok(`Validated ${VAMP_PRESETS.length} Modal Vamp & Sayr presets + dynamic generator`);

// 5. Validate Session URL Hash Codec round-trip
const sampleState = {
  scaleId: 'maqam_nawa_athar', rootQ: 22, tuningId: 'b_standard', microMode: 'bend',
  labelMode: 'degree', chordId: 'min_maj7_9', voicingOverlayOn: true, harmonicsOn: false,
  rhythmId: 'iqa_samai_thaqil', etudePatternId: 'pedal_drone', vampPresetId: 'vamp_baritone_b_doom',
  fretWindowOn: true, fretWindowStart: 4, fretWindowSpan: 5
};
const encoded = encodeSessionHash(sampleState);
const decoded = decodeSessionHash(encoded);
if (!decoded || decoded.s !== 'maqam_nawa_athar' || decoded.t !== 'b_standard' || decoded.fs !== 4) {
  fail('Session URL hash codec round-trip failed');
}
ok('Verified Session Snapshot & Shareable URL (#sa=...) round-trip codec');

// 6. Validate Study Guide & Matching Dossiers
const modIds = new Set(STUDY_MODULES.map((m) => m.id));
for (const l of STUDY_LESSONS) {
  if (!modIds.has(l.moduleId)) fail(`Lesson ${l.id} unknown moduleId`);
  if (!STUDY_DOSSIERS[l.id]) fail(`Lesson ${l.id} missing dossier`);
  const p = l.preset;
  if (!scaleIds.has(p.scaleId) || !tuningIds.has(p.tuningId) || !chordIds.has(p.chordId) || !rhythmIds.has(p.rhythmId) || !patternIds.has(p.etudePatternId)) {
    fail(`Lesson ${l.id} invalid preset reference`);
  }
}
ok(`Validated ${STUDY_MODULES.length} chapters & ${STUDY_LESSONS.length} study lessons`);

// 7. Unit-test YIN 24-TET DSP engine (A1 55Hz, B1 61.74Hz & E½♭3 +50c)
const sr = 48000;
const testTones = [
  { label: 'A1', hz: 55.0, expected: 'A1', maxErr: 0.4 },
  { label: 'B1', hz: 61.735, expected: 'B1', maxErr: 0.5 },
  { label: 'E½♭3', hz: 440 * Math.pow(2, (103 - 138) / 24), expected: 'E½♭3', maxErr: 0.8 }
];
for (const tc of testTones) {
  const buf = new Float32Array(4096);
  for (let i = 0; i < buf.length; i += 1) {
    buf[i] = 0.65 * Math.sin((2 * Math.PI * tc.hz * i) / sr) + 0.25 * Math.sin((4 * Math.PI * tc.hz * i) / sr);
  }
  const det = detectPitchYIN(buf, sr, 0.01);
  if (!det.freq || Math.abs(det.freq - tc.hz) > tc.maxErr) {
    fail(`YIN error on ${tc.label}: ${det.freq}`);
  } else if (analyzePitch24(det.freq).noteName24 !== tc.expected) {
    fail(`24-TET mismatch on ${tc.label}`);
  }
}
ok('Unit-tested YIN 24-TET DSP engine (A1 55Hz, B1 61.7Hz & E½♭3 +50¢)');

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
console.log('\nAll String Atlas v5.0 integrity checks passed.');
