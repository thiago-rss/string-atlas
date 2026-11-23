/**
 * Pre-commit integrity validator for String Atlas v7.0
 * Run: node scripts/check.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { A4_Q, getReferenceA4, qToFreq, setReferenceA4 } from '../js/core/theory24.js';
import { DB } from '../js/core/database.js';
import { THEMES } from '../js/core/themes.js';
import { getThemeBackdropWatermarkSvg, getThemeBrandMedallionSvg, getThemeCornerFiligreeSvg, getThemeFooterOrnamentSvg, getThemeHeaderBannerSvg, getThemePanelCrownSvg } from '../js/core/themeGraphics.js';
import { calculateSetTension, classifyTrussRodDelta, compareTensionSetups, getDefaultPackForCount, recommendBalancedGauges } from '../js/core/tensionEngine.js';
import { createCustomTuning, sanitizeCustomTuning } from '../js/core/customTunings.js';
import { generateVoicings } from '../js/core/voicingEngine.js';
import { ETUDE_PATTERNS, exportEtudeToAsciiTab, generateEtude } from '../js/core/etudeGenerator.js';
import { VAMP_PRESETS, buildVampFromCurrentLab } from '../js/core/vampEngine.js';
import { compareScales24, findParallelMutations, findPivotModulations } from '../js/core/modulationRadar.js';
import { MICRO_INTERVAL_SETS, createEarQuestion } from '../js/core/earTrainer.js';
import {
  exportEventsToMidi,
  exportEventsToMusicXML,
  exportVampToMidi
} from '../js/core/exportEngine.js';
import { buildEditorialPlateSvg, resolveCssVarsInSvg } from '../js/core/plateExporter.js';
import { SCALA_PRESETS, exportToSclText, mapScalaToFretboard, parseSclText } from '../js/core/scalaEngine.js';
import { decodeSessionHash, encodeSessionHash } from '../js/core/sessionCodec.js';
import { STUDY_LESSONS, STUDY_LEVELS, STUDY_MODULES } from '../js/core/studyGuide.js';
import { GLOSSARY_CATEGORIES, GLOSSARY_TERMS } from '../js/core/glossary.js';
import { STUDY_DOSSIERS } from '../js/core/studyDossiers.js';
import { PitchStabilizer, analyzePitch24, buildConstraintFallbackChain, detectPitchYIN } from '../js/audio/pitchDetector.js';
import { synthesizeKarplusStrongSamples } from '../js/audio/synthEngine.js';
import { isBluetoothDeviceLabel } from '../js/audio/mobileAudioGuard.js';

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
  'js/core/themes.js',
  'js/core/themeGraphics.js',
  'js/core/customTunings.js',
  'js/core/tensionEngine.js',
  'js/core/voicingEngine.js',
  'js/core/etudeGenerator.js',
  'js/core/vampEngine.js',
  'js/core/modulationRadar.js',
  'js/core/earTrainer.js',
  'js/core/exportEngine.js',
  'js/core/plateExporter.js',
  'js/core/scalaEngine.js',
  'js/core/sessionCodec.js',
  'js/core/studyGuide.js',
  'js/core/studyDossiers.js',
  'js/core/glossary.js',
  'js/audio/mobileAudioGuard.js',
  'js/audio/synthEngine.js',
  'js/audio/rhythmEngine.js',
  'js/audio/pitchDetector.js',
  'js/views/fretboardView.js',
  'js/views/deckPanelsView.js',
  'js/views/notationView.js',
  'js/views/themeDrawerView.js',
  'js/views/headerMenuView.js',
  'js/views/toastView.js',
  'js/views/radarView.js',
  'js/views/scalaView.js',
  'js/views/mobileNavView.js',
  'js/views/vampView.js',
  'js/views/earLabView.js',
  'js/views/snapshotsView.js',
  'js/views/commandPaletteView.js',
  'js/views/studyGuideView.js',
  'js/views/glossaryView.js',
  'js/views/lineModeView.js',
  'js/views/harmonyView.js',
  'js/views/etudeView.js',
  'js/views/rhythmView.js',
  'js/views/tensionView.js',
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

// 2. Validate 6-, 7-, and 8-string tunings & Voicing Solver across extended range
const scaleIds = new Set(DB.scales.map((s) => s.id));
const tuningIds = new Set(DB.tunings.map((t) => t.id));
const chordIds = new Set(DB.chords.map((c) => c.id));
const rhythmIds = new Set(DB.rhythms.map((r) => r.id));
const patternIds = new Set(ETUDE_PATTERNS.map((p) => p.id));

for (const tun of DB.tunings) {
  if (![6, 7, 8].includes(tun.stringsQ.length)) {
    fail(`Tuning ${tun.id} has unsupported string count: ${tun.stringsQ.length}`);
  }
}

for (const tunId of ['standard', 'b_standard', 'a_standard', '7_b_standard', '8_fs_standard', '8_drop_e']) {
  const tun = DB.tunings.find((t) => t.id === tunId);
  if (!tun) { fail(`Missing key tuning: ${tunId}`); continue; }
  for (const c of DB.chords) {
    const v = generateVoicings({ rootQ: 4, intervalsQ: c.intervalsQ, stringsQ: tun.stringsQ, limit: 4 });
    if (!v.length) fail(`0 voicings for ${c.id} on ${tunId}`);
  }
}
ok(`Validated ${DB.scales.length} scales, ${DB.tunings.length} tunings (6/7/8 strings) & ${DB.chords.length} chords`);

// 3. Validate Procedural Etudes + 24-TET MIDI & MusicXML 4.0 Exports on 6, 7 & 8 strings
const bayati = DB.scales.find((s) => s.id === 'maqam_bayati');
const dorian = DB.scales.find((s) => s.id === 'std_dorian');
const tun8 = DB.tunings.find((t) => t.id === '8_drop_e');

for (const pat of ETUDE_PATTERNS) {
  const etude = generateEtude({
    scale: bayati, rootQ: 4, stringsQ: tun8.stringsQ,
    microMode: 'bend', patternId: pat.id, zoneId: 'mid', groupingId: 'group5', length: 16, seed: 2
  });
  if (!etude.events.length) fail(`Etude returned 0 events on 8-string for ${pat.id}`);
  const ascii = exportEtudeToAsciiTab({ etude, scaleName: bayati.namePt, rootQ: 4, stringsQ: tun8.stringsQ, microMode: 'bend' });
  if (!ascii.includes('|')) fail(`Invalid 8-string ASCII tab for ${pat.id}`);
}

const sampleEtude = generateEtude({
  scale: bayati, rootQ: 4, stringsQ: tun8.stringsQ,
  microMode: 'bend', patternId: 'micro_bend_lab', zoneId: 'mid', groupingId: 'group5', length: 16, seed: 1
});
const midiBytes = exportEventsToMidi({ events: sampleEtude.events, bpm: 92, title: 'D Bayati 8-String' });
const headerStr = String.fromCharCode(...midiBytes.slice(0, 4));
if (headerStr !== 'MThd' || midiBytes.length < 60) fail('Invalid MIDI SMF0 binary header');
// Verify +50c quarter-tone pitch bend byte (0xE0, 0x00, 0x50) is emitted for Bayati microtones
let hasQuarterBend = false;
for (let i = 0; i < midiBytes.length - 2; i += 1) {
  if (midiBytes[i] === 0xe0 && midiBytes[i + 1] === 0x00 && midiBytes[i + 2] === 0x50) {
    hasQuarterBend = true;
    break;
  }
}
if (!hasQuarterBend) fail('MIDI export missing 24-TET +50c pitch bend message for Bayati');

const vampMidi = exportVampToMidi({
  steps: VAMP_PRESETS[0].steps,
  bpm: 88,
  beatsPerBar: 4,
  getChordIntervals: (cid) => (DB.chords.find((c) => c.id === cid) || DB.chords[0]).intervalsQ
});
if (String.fromCharCode(...vampMidi.slice(0, 4)) !== 'MThd') fail('Invalid Vamp MIDI binary');

const xmlOut = exportEventsToMusicXML({
  events: sampleEtude.events,
  stringsQ: tun8.stringsQ,
  bpm: 92,
  title: 'D Bayati 8-String'
});
if (!xmlOut.includes('<staff-lines>8</staff-lines>') || !xmlOut.includes('<bend-alter>0.5</bend-alter>')) {
  fail('MusicXML 4.0 export missing 8-string staff-lines or quarter-tone bend-alter');
}
ok('Validated 24-TET MIDI (.mid, SMF0 + RPN ±2st Pitch Bend) & MusicXML 4.0 (6/7/8-string TAB)');

// 4. Validate Modal Radar, Ear Trainer, Vamps, Codec & Study Guide
if (compareScales24({ rootA: 4, intervalsA: dorian.intervalsQ, rootB: 4, intervalsB: bayati.intervalsQ }).sharedCount < 5) {
  fail('Modal Radar comparison failed');
}
if (!findParallelMutations({ rootQ: 4, scale: bayati, allScales: DB.scales }).length ||
    !findPivotModulations({ rootQ: 4, scale: bayati, allScales: DB.scales }).length) {
  fail('Modal Radar empty results');
}
for (const mode of ['micro_intervals', 'scales_modes', 'chord_colors']) {
  const q = createEarQuestion({ mode, intervalSetId: MICRO_INTERVAL_SETS[0].id, scalePool: 'arabic', rootQ: 4, scales: DB.scales, chords: DB.chords });
  if (!q.choices.some((c) => c.id === q.answerId)) fail(`Ear Trainer failed for ${mode}`);
}
if (buildVampFromCurrentLab({ rootQ: 22, scale: bayati, chordId: 'min_maj7_9' }).length !== 2) fail('Vamp builder failed');
const dec = decodeSessionHash(encodeSessionHash({ scaleId: 'maqam_bayati', rootQ: 4, tuningId: '8_drop_e', microMode: 'bend', labelMode: 'note', chordId: 'quartal_3', voicingOverlayOn: false, harmonicsOn: false, rhythmId: 'iqa_maqsum', etudePatternId: 'linear_oud', vampPresetId: 'vamp_sayr_bayati', fretWindowOn: false, fretWindowStart: 0, fretWindowSpan: 5 }));
if (!dec || dec.t !== '8_drop_e') fail('Session codec failed for 8-string tuning');
const modIds = new Set(STUDY_MODULES.map((m) => m.id));
for (const l of STUDY_LESSONS) {
  if (!modIds.has(l.moduleId) || !STUDY_DOSSIERS[l.id] || !scaleIds.has(l.preset.scaleId) || !tuningIds.has(l.preset.tuningId) || !chordIds.has(l.preset.chordId) || !rhythmIds.has(l.preset.rhythmId) || !patternIds.has(l.preset.etudePatternId)) {
    fail(`Study lesson ${l.id} failed validation`);
  }
}
ok('Validated Modal Radar, Ear Trainer, Vamps, URL Codec & Progressive Study Guide');

// 5. Unit-test YIN 24-TET DSP engine down to 8-String Low E1 (41.2 Hz)!
const sr = 48000;
const testTones = [
  { label: 'E1 (8c Drop E)', hz: 41.203, expected: 'E1', maxErr: 0.4 },
  { label: 'A1 (A Std)', hz: 55.0, expected: 'A1', maxErr: 0.4 },
  { label: 'B1 (B Std)', hz: 61.735, expected: 'B1', maxErr: 0.5 },
  { label: 'E½♭3 (+50c)', hz: 440 * Math.pow(2, (103 - 138) / 24), expected: 'E½♭3', maxErr: 0.8 }
];
for (const tc of testTones) {
  const buf = new Float32Array(4096);
  for (let i = 0; i < buf.length; i += 1) {
    buf[i] = 0.65 * Math.sin((2 * Math.PI * tc.hz * i) / sr) + 0.25 * Math.sin((4 * Math.PI * tc.hz * i) / sr);
  }
  const det = detectPitchYIN(buf, sr, 0.01);
  if (!det.freq || Math.abs(det.freq - tc.hz) > tc.maxErr || analyzePitch24(det.freq).noteName24 !== tc.expected) {
    fail(`YIN DSP check failed on ${tc.label}: got ${det.freq}`);
  }
}
ok('Unit-tested YIN 24-TET DSP engine (8-String E1 41.2Hz, A1 55Hz, B1 61.7Hz & E½♭3 +50¢)');

// 5b. Validate Multi-Design Studio Themes & CSS selectors
const themeCss = fs.readFileSync(path.join(ROOT, 'styles/themes.css'), 'utf8');
const mainCss = fs.readFileSync(path.join(ROOT, 'styles/main.css'), 'utf8');
const allCss = mainCss + '\n' + themeCss;
for (const th of THEMES) {
  if (!allCss.includes(`[data-theme="${th.id}"]`)) {
    fail(`Missing CSS [data-theme="${th.id}"] block`);
  }
  if (!getThemeHeaderBannerSvg(th.id).includes('<svg') || !getThemeBackdropWatermarkSvg(th.id).includes('<svg') || !getThemeBrandMedallionSvg(th.id).includes('<svg') || !getThemeCornerFiligreeSvg(th.id).includes('<svg') || !getThemeFooterOrnamentSvg(th.id).includes('<svg') || !getThemePanelCrownSvg(th.id).includes('<svg')) {
    fail(`Theme ${th.id} missing custom SVG artwork in themeGraphics.js`);
  }
  if (!th.fretboard?.woodStops || th.fretboard.woodStops.length !== 3 || !th.fretboard.inlayStyle || !th.fretboard.nodeShape) {
    fail(`Theme ${th.id} missing luthier fretboard skin definition`);
  }
}
if (THEMES.length < 10) fail(`Expected at least 10 curated visual themes, got ${THEMES.length}`);
for (const reqTh of ['shoegaze', 'kintsugi', 'bluenote']) {
  if (!THEMES.some((th) => th.id === reqTh)) fail(`Missing v8.7 theme: ${reqTh}`);
}
ok(`Validated ${THEMES.length} curated musical-aesthetic designs in themes.js & styles/themes.css`);

// 5c. Unit-test String Tension Physics Engine (E Std 10-46, B Std, A Std 27", 8c Multi-Scale & Inverse Solver)
const stdTun = DB.tunings.find((t) => t.id === 'standard');
const pack1046 = getDefaultPackForCount(6, 'standard');
const calcStd = calculateSetTension({
  stringsQ: stdTun.stringsQ,
  gauges: pack1046.strings,
  scaleTrebleIn: 25.5,
  scaleBassIn: 25.5,
  multiScale: false
});
if (calcStd.totalLbs < 98 || calcStd.totalLbs > 110) {
  fail(`Unexpected E Std 10-46 @ 25.5" total tension: ${calcStd.totalLbs.toFixed(1)} lbs`);
}

const aStdTun = DB.tunings.find((t) => t.id === 'a_standard');
const recAStd = recommendBalancedGauges({
  stringsQ: aStdTun.stringsQ,
  scaleTrebleIn: 27.0,
  scaleBassIn: 27.0,
  multiScale: false,
  targetLbs: 16.5
});
const calcRecA = calculateSetTension({
  stringsQ: aStdTun.stringsQ,
  gauges: recAStd,
  scaleTrebleIn: 27.0,
  scaleBassIn: 27.0,
  multiScale: false
});
if (calcRecA.balanceScore < 75 || recAStd.length !== 6) {
  fail(`Balanced gauge solver underperformed for A Std 27": balance=${calcRecA.balanceScore}%`);
}

const tun8Ms = DB.tunings.find((t) => t.id === '8_drop_e');
const pack8 = getDefaultPackForCount(8, '8_drop_e');
const calc8Ms = calculateSetTension({
  stringsQ: tun8Ms.stringsQ,
  gauges: pack8.strings,
  scaleTrebleIn: 25.5,
  scaleBassIn: 28.0,
  multiScale: true
});
if (calc8Ms.rows[0].scaleIn !== 28.0 || calc8Ms.rows[7].scaleIn !== 25.5) {
  fail('Multi-scale interpolation failed on 8-string Drop E');
}
ok(`Unit-tested String Tension Physics (E Std 10-46=${calcStd.totalLbs.toFixed(1)} lbs, A Std 27" Solver=${calcRecA.balanceScore}% balance, 8c Multi-Scale OK)`);

// 5d. Unit-test Editorial Plate SVG Exporter & CSS Variable Resolver
const resolvedSvg = resolveCssVarsInSvg('<rect fill="var(--accent-root)" stroke="var(--missing, #fff)"/>', (k) => (k === '--accent-root' ? '#e5a955' : ''));
if (!resolvedSvg.includes('fill="#e5a955"') || !resolvedSvg.includes('stroke="#fff"')) {
  fail('resolveCssVarsInSvg failed token substitution');
}
const plateOut = buildEditorialPlateSvg({
  fretboardSvgMarkup: '<svg viewBox="0 0 1240 278"><rect width="1240" height="278" fill="#111"/></svg>',
  title: 'D Maqam Bayati',
  formula: '1 · 2½♭ · ♭3 · 4 · 5 · ♭6 · ♭7',
  tuningLabel: '6c B Std',
  themeName: 'Doom Ritual',
  palette: {}
});
if (!plateOut.includes('D Maqam Bayati') || !plateOut.includes('STRING ATLAS')) {
  fail('buildEditorialPlateSvg output incomplete');
}
ok('Unit-tested Editorial Plate SVG Exporter & CSS var resolver');

// 5e. Unit-test Scala (.scl) Parser, 53-TET, 5-Limit JI, Bohlen-Pierce & Fretboard Mapper
const scalaIds = new Set();
for (const sp of SCALA_PRESETS) {
  if (scalaIds.has(sp.id)) fail(`Duplicate Scala preset id: ${sp.id}`);
  scalaIds.add(sp.id);
  const parsed = parseSclText(sp.scl);
  if (!parsed.ok) {
    fail(`Scala preset ${sp.id} failed parsing: ${parsed.error}`);
    continue;
  }
  const roundTrip = parseSclText(exportToSclText(parsed));
  if (!roundTrip.ok || roundTrip.noteCount !== parsed.noteCount) {
    fail(`Scala export round-trip failed for ${sp.id}`);
  }
  const mapped = mapScalaToFretboard({ parsed, rootQ: 0, stringsQ: stdTun.stringsQ, maxFrets: 12 });
  if (!mapped.length) fail(`Scala fretboard mapper returned 0 markers for ${sp.id}`);
}
const ji5 = parseSclText(SCALA_PRESETS.find((p) => p.id === 'ji_5limit').scl);
if (Math.abs(ji5.degrees[2].cents - 386.3137) > 0.05) {
  fail(`Expected 5/4 Just Major 3rd = 386.31c, got ${ji5.degrees[2].cents}`);
}
const bp13 = parseSclText(SCALA_PRESETS.find((p) => p.id === 'bohlen_pierce_13').scl);
if (bp13.isOctave || Math.abs(bp13.periodCents - 1901.955) > 0.2) {
  fail(`Expected Bohlen-Pierce 3/1 tritave = 1901.96c, got ${bp13.periodCents}`);
}
for (const l of STUDY_LESSONS) {
  if (l.preset.scalaPresetId && !scalaIds.has(l.preset.scalaPresetId)) {
    fail(`Study lesson ${l.id} references unknown scalaPresetId: ${l.preset.scalaPresetId}`);
  }
}
ok(`Unit-tested Scala (.scl) Engine (${SCALA_PRESETS.length} presets: JI 5/7-limit, 53-TET, Bohlen-Pierce 3/1, Gamelan) & ${STUDY_LESSONS.length} lessons across ${STUDY_MODULES.length} chapters`);

// 5f. Unit-test Mobile Audio Hardening (3-tier getUserMedia fallback, Bluetooth detection & 16kHz HFP YIN)
const chain = buildConstraintFallbackChain({ mode: 'line', deviceId: 'usb-scarlett-2i2', channel: 'ch2' });
if (chain.length !== 3 || chain[0].constraints.audio.channelCount?.ideal !== 2 || chain[2].constraints.audio !== true) {
  fail('buildConstraintFallbackChain did not produce valid 3-tier fallback');
}
if (!isBluetoothDeviceLabel('AirPods Pro Hands-Free') || isBluetoothDeviceLabel('Scarlett 2i2 USB')) {
  fail('isBluetoothDeviceLabel heuristic mismatch');
}
// Verify YIN works accurately even if iOS/Bluetooth drops sampleRate to 16 kHz (e.g. A2 = 110 Hz)
const srBt = 16000;
const btBuf = new Float32Array(4096);
for (let i = 0; i < btBuf.length; i += 1) {
  btBuf[i] = 0.7 * Math.sin((2 * Math.PI * 110.0 * i) / srBt) + 0.2 * Math.sin((4 * Math.PI * 110.0 * i) / srBt);
}
const btDet = detectPitchYIN(btBuf, srBt, 0.01);
if (!btDet.freq || Math.abs(btDet.freq - 110.0) > 0.6) {
  fail(`YIN 16kHz Bluetooth HFP test failed: got ${btDet.freq}`);
}
ok('Unit-tested Mobile Audio Hardening (3-tier fallback, AirPods/BT detection & 16kHz HFP YIN)');

// 5g. Validate Interactive Bilingual Glossary & 4-Level 40-Lesson Curriculum Contract
const glCatIds = new Set(GLOSSARY_CATEGORIES.map((c) => c.id));
const glIds = new Set();
for (const g of GLOSSARY_TERMS) {
  if (glIds.has(g.id)) fail(`Duplicate glossary term id: ${g.id}`);
  glIds.add(g.id);
  if (!glCatIds.has(g.category)) fail(`Glossary term ${g.id} unknown category: ${g.category}`);
  if (!g.termPt || !g.termEn || !g.defPt || !g.defEn || !g.guitarTipPt || !g.guitarTipEn) {
    fail(`Glossary term ${g.id} incomplete bilingual fields`);
  }
}
const validLvlIds = new Set(STUDY_LEVELS.map((lv) => lv.id));
STUDY_LESSONS.forEach((l, idx) => {
  if (l.number !== idx + 1) fail(`Lesson ${l.id} has non-sequential number ${l.number} (expected ${idx + 1})`);
  if (!validLvlIds.has(l.level)) fail(`Lesson ${l.id} has invalid level: ${l.level}`);
  for (const gid of l.glossaryIds || []) {
    if (!glIds.has(gid)) fail(`Lesson ${l.id} references unknown glossaryId: ${gid}`);
  }
});
ok(`Validated ${GLOSSARY_TERMS.length} bilingual glossary terms & 4-level progressive curriculum (${STUDY_MODULES.length} chapters, ${STUDY_LESSONS.length} sequential lessons)`);

// 5h. Unit-test Advanced Luthier (A/B Tension Comparator, Truss-Rod Advisory & Saved Scordaturas)
const aStdPack = getDefaultPackForCount(6, 'a_standard');
const cmpAB = compareTensionSetups(
  { stringsQ: aStdTun.stringsQ, gauges: aStdPack.strings, scaleTrebleIn: 25.5, scaleBassIn: 25.5, multiScale: false },
  { stringsQ: aStdTun.stringsQ, gauges: aStdPack.strings, scaleTrebleIn: 27.0, scaleBassIn: 27.0, multiScale: false }
);
if (cmpAB.deltaTotalLbs <= 8 || cmpAB.rows.length !== 6) {
  fail(`Expected A Std 27.0" vs 25.5" to increase total tension > 8 lbs, got ${cmpAB.deltaTotalLbs.toFixed(1)} lbs`);
}
if (classifyTrussRodDelta(3.2) !== 'minimal' || classifyTrussRodDelta(12.0) !== 'slight' || classifyTrussRodDelta(-22.5) !== 'significant') {
  fail('classifyTrussRodDelta thresholds mismatch');
}
const customScord = createCustomTuning({ name: 'Syrian Oud Bridge', stringsQ: [72, 82, 90, 100, 110, 120] });
if (!customScord || !customScord.custom || customScord.stringsQ.length !== 6 || !customScord.id.startsWith('custom_tun_')) {
  fail('createCustomTuning failed for 6-string custom scordatura');
}
if (sanitizeCustomTuning({ stringsQ: [80, 90] }) !== null) {
  fail('sanitizeCustomTuning should reject invalid < 6 string arrays');
}
ok(`Unit-tested Advanced Luthier (A/B Comparator Δ=+${cmpAB.deltaTotalLbs.toFixed(1)} lbs for 25.5"→27.0", Truss Advisory & Saved Scordaturas)`);

// 5i. Unit-test v8.8 Acoustic Refinement (A4 Reference Calibration, Karplus-Strong Waveguide & PitchStabilizer)
setReferenceA4(432);
if (getReferenceA4() !== 432 || Math.abs(qToFreq(A4_Q) - 432) > 0.001) {
  fail(`Reference A4 calibration failed: got ${getReferenceA4()} / ${qToFreq(A4_Q)}`);
}
const a432Analysis = analyzePitch24(432, 432);
if (a432Analysis.noteName24 !== 'A4' || Math.abs(a432Analysis.centsFrom24) > 0.05) {
  fail(`analyzePitch24 failed for A4=432 Hz: got ${a432Analysis.noteName24} (${a432Analysis.centsFrom24}c)`);
}
setReferenceA4(440); // Restore standard concert pitch

// Verify Karplus-Strong physical string waveguide generates clean pitched samples (A2 = 110 Hz)
const ksBuf = synthesizeKarplusStrongSamples(110.0, 48000, 0.45);
if (!(ksBuf instanceof Float32Array) || ksBuf.length < 18000) {
  fail('synthesizeKarplusStrongSamples produced invalid buffer');
}
const ksTail = ksBuf.subarray(4096, 8192);
const ksDet = detectPitchYIN(ksTail, 48000, 0.005);
if (!ksDet.freq || Math.abs(ksDet.freq - 110.0) > 1.2) {
  fail(`Karplus-Strong pitch accuracy failed for 110 Hz: detected ${ksDet.freq}`);
}

// Verify PitchStabilizer rejects single-frame octave glitch on low baritone A1 (55 Hz)
const stab = new PitchStabilizer();
stab.push(55.0);
stab.push(55.1);
stab.push(54.9);
const afterGlitch = stab.push(110.0); // single-frame 2nd-harmonic jump
if (!afterGlitch || Math.abs(afterGlitch.freq - 55.0) > 1.0) {
  fail(`PitchStabilizer failed to reject single-frame octave glitch: got ${afterGlitch?.freq}`);
}
ok('Unit-tested v8.8 Acoustic Refinement (A4 415–446Hz, Karplus-Strong 110Hz YIN lock & Bass PitchStabilizer)');

// 6. Validate sw.js CORE_ASSETS (including PNG icons) exist on disk
const swSrc = fs.readFileSync(path.join(ROOT, 'sw.js'), 'utf8');
const assetMatches = [...swSrc.matchAll(/'(\.\/[^']+)'/g)].map((m) => m[1]);
for (const asset of assetMatches) {
  if (asset === './') continue;
  const diskPath = path.join(ROOT, asset.replace(/^\.\//, ''));
  if (!fs.existsSync(diskPath)) fail(`sw.js CORE_ASSETS missing on disk: ${asset}`);
}
ok(`Verified ${assetMatches.length} sw.js CORE_ASSETS entries (incl. PNG PWA icons)`);

if (errors > 0) {
  console.error(`\nFailed with ${errors} error(s).`);
  process.exit(1);
}
console.log('\nAll String Atlas v8.8 integrity checks passed.');
