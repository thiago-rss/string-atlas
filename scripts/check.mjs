/**
 * Pre-commit integrity validator for String Atlas v3.0
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
  'js/audio/synthEngine.js',
  'js/audio/rhythmEngine.js',
  'js/views/fretboardView.js',
  'js/views/deckPanelsView.js',
  'js/views/notationView.js',
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
const scaleIds = new Set();
for (const s of DB.scales) {
  if (scaleIds.has(s.id)) fail(`Duplicate scale id: ${s.id}`);
  scaleIds.add(s.id);
  if (!s.intervalsQ.includes(0)) fail(`Scale ${s.id} missing root 0`);
  for (const iv of s.intervalsQ) {
    if (!Number.isInteger(iv) || iv < 0 || iv > 23) {
      fail(`Scale ${s.id} has invalid intervalQ: ${iv}`);
    }
  }
  if (!s.dossier?.structurePt || !s.dossier?.structureEn) {
    fail(`Scale ${s.id} missing bilingual dossier`);
  }
}
ok(`Validated ${DB.scales.length} scales in 24-TET catalog`);

// 3. Validate DB.chords & Voicing Solver
const chordIds = new Set();
const stdTuning = DB.tunings[0];
for (const c of DB.chords) {
  if (chordIds.has(c.id)) fail(`Duplicate chord id: ${c.id}`);
  chordIds.add(c.id);
  if (!c.intervalsQ.includes(0)) fail(`Chord ${c.id} missing root 0`);
  const voicings = generateVoicings({
    rootQ: 4,
    intervalsQ: c.intervalsQ,
    stringsQ: stdTuning.stringsQ,
    limit: 6
  });
  if (voicings.length === 0) {
    fail(`Voicing solver returned 0 voicings for ${c.id} on Standard tuning`);
  }
}
ok(`Validated ${DB.chords.length} experimental chords & voicing solver`);

// 4. Validate Procedural Etude Generator across patterns, scales & tunings
const sampleScales = [
  DB.scales.find((s) => s.id === 'maqam_bayati'),
  DB.scales.find((s) => s.id === 'messiaen_mode3'),
  DB.scales.find((s) => s.id === 'set_viennese_016')
].filter(Boolean);

const sampleTunings = [
  DB.tunings.find((t) => t.id === 'standard'),
  DB.tunings.find((t) => t.id === 'dadgad'),
  DB.tunings.find((t) => t.id === 'all_fourths')
].filter(Boolean);

let etudeCombos = 0;
for (const pat of ETUDE_PATTERNS) {
  for (const sc of sampleScales) {
    for (const tun of sampleTunings) {
      const etude = generateEtude({
        scale: sc,
        rootQ: 4,
        stringsQ: tun.stringsQ,
        microMode: 'bend',
        patternId: pat.id,
        zoneId: 'mid',
        groupingId: 'group5',
        length: 16,
        direction: 'pendulum',
        seed: 3
      });
      if (!etude.events || etude.events.length === 0) {
        fail(`Etude generator returned 0 events for ${pat.id} x ${sc.id} x ${tun.id}`);
      }
      const ascii = exportEtudeToAsciiTab({
        etude,
        scaleName: sc.namePt,
        rootQ: 4,
        stringsQ: tun.stringsQ,
        microMode: 'bend'
      });
      if (!ascii.includes('|')) {
        fail(`ASCII tab export invalid for ${pat.id}`);
      }
      etudeCombos += 1;
    }
  }
}
ok(`Validated ${ETUDE_PATTERNS.length} procedural etude patterns (${etudeCombos} combinations + ASCII tab export)`);

// 5. Validate DB.rhythms
const rhythmIds = new Set();
const validHits = new Set(['D', 'T', 'K', '-']);
for (const r of DB.rhythms) {
  if (rhythmIds.has(r.id)) fail(`Duplicate rhythm id: ${r.id}`);
  rhythmIds.add(r.id);
  if (!Array.isArray(r.steps) || r.steps.length < 2) {
    fail(`Rhythm ${r.id} has invalid steps`);
  }
  for (const hit of r.steps) {
    if (!validHits.has(hit)) fail(`Rhythm ${r.id} has unknown hit: ${hit}`);
  }
}
ok(`Validated ${DB.rhythms.length} Iqa'at & Aksak rhythmic cycles`);

// 6. Validate DB.tunings
const tuningIds = new Set();
for (const tun of DB.tunings) {
  if (tuningIds.has(tun.id)) fail(`Duplicate tuning id: ${tun.id}`);
  tuningIds.add(tun.id);
  if (tun.stringsQ.length !== 6) fail(`Tuning ${tun.id} must have 6 strings`);
}
ok(`Validated ${DB.tunings.length} scordatura tunings`);

// 7. Validate Oblique Strategy presets
for (const card of DB.obliqueStrategies) {
  if (!scaleIds.has(card.preset.scaleId)) {
    fail(`Oblique card ${card.id} references unknown scaleId: ${card.preset.scaleId}`);
  }
  if (!tuningIds.has(card.preset.tuningId)) {
    fail(`Oblique card ${card.id} references unknown tuningId: ${card.preset.tuningId}`);
  }
  if (card.preset.chordId && !chordIds.has(card.preset.chordId)) {
    fail(`Oblique card ${card.id} references unknown chordId: ${card.preset.chordId}`);
  }
  if (card.preset.rhythmId && !rhythmIds.has(card.preset.rhythmId)) {
    fail(`Oblique card ${card.id} references unknown rhythmId: ${card.preset.rhythmId}`);
  }
  if (card.preset.rootQ < 0 || card.preset.rootQ > 23) {
    fail(`Oblique card ${card.id} rootQ out of range: ${card.preset.rootQ}`);
  }
}
ok(`Validated ${DB.obliqueStrategies.length} Oblique Lab presets`);

// 8. Validate sw.js CORE_ASSETS exist on disk
const swSrc = fs.readFileSync(path.join(ROOT, 'sw.js'), 'utf8');
const assetMatches = [...swSrc.matchAll(/'(\.\/[^']+)'/g)].map((m) => m[1]);
for (const asset of assetMatches) {
  if (asset === './') continue;
  const diskPath = path.join(ROOT, asset.replace(/^\.\//, ''));
  if (!fs.existsSync(diskPath)) {
    fail(`sw.js CORE_ASSETS entry missing on disk: ${asset}`);
  }
}
ok(`Verified ${assetMatches.length} sw.js CORE_ASSETS entries`);

if (errors > 0) {
  console.error(`\nFailed with ${errors} error(s).`);
  process.exit(1);
}
console.log('\nAll String Atlas v3.0 integrity checks passed.');
