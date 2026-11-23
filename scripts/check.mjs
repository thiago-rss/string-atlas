/**
 * Pre-commit integrity validator for String Atlas
 * Run: node scripts/check.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { DB } from '../js/core/database.js';

const ROOT = process.cwd();
let errors = 0;

function fail(msg) {
  console.error(`✖ ${msg}`);
  errors += 1;
}

function ok(msg) {
  console.log(`✔ ${msg}`);
}

// 1. Validate JS syntax across all .js files
const jsFiles = [
  'sw.js',
  'js/main.js',
  'js/state/store.js',
  'js/core/theory24.js',
  'js/core/database.js',
  'js/core/i18n.js',
  'js/audio/synthEngine.js',
  'js/views/fretboardView.js',
  'js/views/deckPanelsView.js',
  'js/views/dossierView.js'
];

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

// 2. Validate DB.scales 24-TET bounds & bilingual fields
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

// 3. Validate DB.tunings
const tuningIds = new Set();
for (const tun of DB.tunings) {
  if (tuningIds.has(tun.id)) fail(`Duplicate tuning id: ${tun.id}`);
  tuningIds.add(tun.id);
  if (tun.stringsQ.length !== 6) fail(`Tuning ${tun.id} must have 6 strings`);
}
ok(`Validated ${DB.tunings.length} scordatura tunings`);

// 4. Validate Oblique Strategy presets
for (const card of DB.obliqueStrategies) {
  if (!scaleIds.has(card.preset.scaleId)) {
    fail(`Oblique card ${card.id} references unknown scaleId: ${card.preset.scaleId}`);
  }
  if (!tuningIds.has(card.preset.tuningId)) {
    fail(`Oblique card ${card.id} references unknown tuningId: ${card.preset.tuningId}`);
  }
  if (card.preset.rootQ < 0 || card.preset.rootQ > 23) {
    fail(`Oblique card ${card.id} rootQ out of range: ${card.preset.rootQ}`);
  }
}
ok(`Validated ${DB.obliqueStrategies.length} Oblique Lab presets`);

// 5. Validate sw.js CORE_ASSETS exist on disk
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
  console.error(`
Failed with ${errors} error(s).`);
  process.exit(1);
}
console.log('
All String Atlas integrity checks passed.');
