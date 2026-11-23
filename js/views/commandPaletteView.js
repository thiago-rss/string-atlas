/**
 * High-Speed Navigation & Global Audio Control Suite (v7.8)
 * 1. Command Palette (Cmd+K / Ctrl+K / /) searching all 74 scales, 39 tunings, 10 designs,
 *    10 studio tools, 10 vamps & 16 study lessons with keyboard navigation (↑/↓/Enter/Esc)
 * 2. Floating Global Audio Transport Dock (#audioTransportDock) with 1-click Stop All (Esc)
 * 3. Bilingual Keyboard Shortcuts Modal (?)
 */
import { DB } from '../core/database.js';
import { THEMES } from '../core/themes.js';
import { VAMP_PRESETS } from '../core/vampEngine.js';
import { STUDY_LESSONS } from '../core/studyGuide.js';
import { SCALA_PRESETS } from '../core/scalaEngine.js';
import { GLOSSARY_TERMS } from '../core/glossary.js';
import { t } from '../core/i18n.js';
import { findTuningById, getAllTunings, getState, setState } from '../state/store.js';
import { synthEngine } from '../audio/synthEngine.js';
import { rhythmEngine } from '../audio/rhythmEngine.js';
import { stopEtudePlayback } from './etudeView.js';
import { stopVampPlayback } from './vampView.js';
import { highlightRhythmStep, updateRhythmBadge } from './rhythmView.js';
import { stopLineMode } from './lineModeView.js';

const TOOL_COMMANDS = [
  { id: 'radar',   key: 'tabRadar',      icon: '🧭' },
  { id: 'scala',   key: 'tabScala',      icon: '∞' },
  { id: 'vamp',    key: 'tabVamp',       icon: '⟳' },
  { id: 'etude',   key: 'tabEtude',      icon: '⚡' },
  { id: 'harmony', key: 'tabHarmony',    icon: '◈' },
  { id: 'rhythm',  key: 'tabRhythm',     icon: '♪' },
  { id: 'study',   key: 'tabStudyGuide', icon: '✦' },
  { id: 'glossary', key: 'tabGlossary',  icon: '📖' },
  { id: 'line',    key: 'tabLineMode',   icon: '●' },
  { id: 'ear',     key: 'tabEarLab',     icon: '🎧' },
  { id: 'tension', key: 'tabTension',    icon: '🔧' },
  { id: 'dossier', key: 'tabDossier',    icon: '📖' }
];

/**
 * Builds a unified searchable command index across the entire String Atlas studio.
 */
export function buildCommandIndex(lang = 'pt', customTunings = []) {
  const isEn = lang === 'en';
  const items = [];

  // 1. Studio Tools
  TOOL_COMMANDS.forEach((tool) => {
    items.push({
      uid: `tool:${tool.id}`,
      type: 'tool',
      badge: isEn ? 'Tool' : 'Ferramenta',
      icon: tool.icon,
      title: t(lang, tool.key),
      sub: isEn ? 'Open Studio Compartment' : 'Abrir compartimento do estúdio',
      search: `${t('pt', tool.key)} ${t('en', tool.key)} ${tool.id}`.toLowerCase(),
      payload: { tab: tool.id }
    });
  });

  // 2. Visual Designs (10 Worlds)
  THEMES.forEach((th) => {
    items.push({
      uid: `theme:${th.id}`,
      type: 'theme',
      badge: isEn ? 'Design' : 'Design',
      icon: '🎨',
      title: isEn ? th.nameEn : th.namePt,
      sub: isEn ? th.ornamentTagEn : th.ornamentTagPt,
      search: `${th.namePt} ${th.nameEn} ${th.eraPt} ${th.eraEn} ${th.id} tema design`.toLowerCase(),
      payload: { themeId: th.id }
    });
  });

  // 3. Tunings (39 built-in + saved custom scordaturas)
  [...customTunings, ...DB.tunings].forEach((tun) => {
    items.push({
      uid: `tuning:${tun.id}`,
      type: 'tuning',
      badge: `${tun.stringsQ.length}${t(lang, 'strSuffix')}`,
      icon: tun.custom ? '✦' : '🎸',
      title: isEn ? tun.nameEn : tun.namePt,
      sub: tun.short,
      search: `${tun.namePt} ${tun.nameEn} ${tun.short} ${tun.stringsQ.length}c tuning afinacao`.toLowerCase(),
      payload: { tuningId: tun.id }
    });
  });

  // 4. Scales & Maqamat (74)
  DB.scales.forEach((sc) => {
    const isMicro = sc.intervalsQ.some((q) => q % 2 !== 0);
    items.push({
      uid: `scale:${sc.id}`,
      type: 'scale',
      badge: isMicro ? '24-TET' : '12-TET',
      icon: isMicro ? '◆' : '●',
      title: isEn ? sc.nameEn : sc.namePt,
      sub: isEn ? sc.subfamilyEn : sc.subfamilyPt,
      search: `${sc.namePt} ${sc.nameEn} ${sc.subfamilyPt} ${sc.subfamilyEn} ${(sc.tagsPt || []).join(' ')} ${(sc.tagsEn || []).join(' ')} ${sc.dossier?.repertoire || ''}`.toLowerCase(),
      payload: { scaleId: sc.id }
    });
  });

  // 5. Modal Vamp & Sayr Presets (10)
  VAMP_PRESETS.forEach((vp) => {
    items.push({
      uid: `vamp:${vp.id}`,
      type: 'vamp',
      badge: 'Vamp',
      icon: '⟳',
      title: isEn ? vp.nameEn : vp.namePt,
      sub: `${vp.bpm} BPM · ${vp.beatsPerBar}/4`,
      search: `${vp.namePt} ${vp.nameEn} vamp sayr ${vp.category}`.toLowerCase(),
      payload: { vampId: vp.id }
    });
  });

  // 5b. Scala (.scl) Microtonal Presets (12)
  SCALA_PRESETS.forEach((sp) => {
    items.push({
      uid: `scala:${sp.id}`,
      type: 'scala',
      badge: '.scl',
      icon: '∞',
      title: isEn ? sp.nameEn : sp.namePt,
      sub: isEn ? 'Scala Microtonal System' : 'Sistema Microtonal Scala',
      search: `${sp.namePt} ${sp.nameEn} scala scl microtonal 53-tet ji bohlen gamelan ${sp.id}`.toLowerCase(),
      payload: { scalaPresetId: sp.id }
    });
  });

  // 5c. Glossary Terms (39)
  GLOSSARY_TERMS.forEach((g) => {
    items.push({
      uid: `glossary:${g.id}`,
      type: 'glossary',
      badge: g.symbol,
      icon: '📖',
      title: isEn ? g.termEn : g.termPt,
      sub: isEn ? 'Technical Glossary' : 'Glossário Técnico',
      search: `${g.termPt} ${g.termEn} ${g.symbol} glossario glossary ${g.id}`.toLowerCase(),
      payload: { glossaryId: g.id }
    });
  });

  // 6. Study Lessons (40)
  STUDY_LESSONS.forEach((l) => {
    items.push({
      uid: `lesson:${l.id}`,
      type: 'lesson',
      badge: `#${String(l.number).padStart(2, '0')}`,
      icon: '✦',
      title: isEn ? l.titleEn : l.titlePt,
      sub: l.glossaryTerm,
      search: `${l.titlePt} ${l.titleEn} ${l.glossaryTerm} aula licao lesson`.toLowerCase(),
      payload: { lessonId: l.id }
    });
  });

  return items;
}

let paletteHighlightIdx = 0;
let cachedIndexKey = null;
let cachedIndex = [];

function getIndex(state) {
  const customKey = (state.customTunings || []).map((c) => `${c.id}:${c.short}`).join('|');
  const key = `${state.lang}::${customKey}`;
  if (cachedIndexKey !== key) {
    cachedIndex = buildCommandIndex(state.lang, state.customTunings || []);
    cachedIndexKey = key;
  }
  return cachedIndex;
}

function getFilteredCommands(state) {
  const q = (state.paletteQuery || '').trim().toLowerCase();
  const idx = getIndex(state);
  if (!q) {
    // Curated quick launch defaults when search is empty
    return idx.filter((it) => it.type === 'tool' || it.type === 'theme').slice(0, 14);
  }
  const tokens = q.split(/\s+/).filter(Boolean);
  return idx
    .filter((it) => tokens.every((tok) => it.search.includes(tok)))
    .slice(0, 18);
}

export function executeCommandItem(item) {
  if (!item) return;
  const st = getState();

  if (item.type === 'tool') {
    setState({ activeTab: item.payload.tab, workspaceOpen: true, paletteOpen: false, paletteQuery: '' });
    return;
  }

  if (item.type === 'theme') {
    setState({ theme: item.payload.themeId, paletteOpen: false, paletteQuery: '' });
    return;
  }

  if (item.type === 'tuning') {
    const tun = findTuningById(item.payload.tuningId);
    if (!tun) return;
    setState({
      stringCount: tun.stringsQ.length,
      tuningId: tun.id,
      customStringsQ: [...tun.stringsQ],
      inspectedNote: null,
      paletteOpen: false,
      paletteQuery: ''
    });
    return;
  }

  if (item.type === 'scale') {
    setState({
      category: 'all',
      temperamentFilter: 'all',
      scaleSearch: '',
      customScaleIntervalsQ: null,
      scaleId: item.payload.scaleId,
      inspectedNote: null,
      paletteOpen: false,
      paletteQuery: ''
    });
    return;
  }

  if (item.type === 'vamp') {
    const vp = VAMP_PRESETS.find((v) => v.id === item.payload.vampId);
    if (!vp) return;
    stopVampPlayback();
    const tun = DB.tunings.find((x) => x.id === vp.tuningId);
    const first = vp.steps[0];
    setState({
      vampPresetId: vp.id,
      vampSteps: vp.steps.map((s) => ({ ...s })),
      vampBpm: vp.bpm,
      vampBeatsPerBar: vp.beatsPerBar,
      vampActiveStepIdx: 0,
      ...(first ? { scaleId: first.scaleId, customScaleIntervalsQ: null, rootQ: first.rootQ, chordId: first.chordId } : {}),
      ...(tun ? { stringCount: tun.stringsQ.length, tuningId: tun.id, customStringsQ: [...tun.stringsQ] } : {}),
      activeTab: 'vamp',
      workspaceOpen: true,
      paletteOpen: false,
      paletteQuery: ''
    });
    return;
  }

  if (item.type === 'scala') {
    setState({
      scalaPresetId: item.payload.scalaPresetId,
      scalaCustomText: '',
      scalaOverlayOn: true,
      activeTab: 'scala',
      workspaceOpen: true,
      paletteOpen: false,
      paletteQuery: ''
    });
    return;
  }

  if (item.type === 'glossary') {
    setState({
      glossaryCategory: 'all',
      glossarySearch: '',
      glossaryFocusId: item.payload.glossaryId,
      activeTab: 'glossary',
      workspaceOpen: true,
      paletteOpen: false,
      paletteQuery: ''
    });
    return;
  }

  if (item.type === 'lesson') {
    const lesson = STUDY_LESSONS.find((l) => l.id === item.payload.lessonId);
    if (!lesson) return;
    const p = lesson.preset;
    const tun = DB.tunings.find((x) => x.id === p.tuningId) || DB.tunings[0];
    setState({
      activeLessonId: lesson.id,
      studyModuleFilter: 'all',
      scaleId: p.scaleId,
      customScaleIntervalsQ: null,
      rootQ: p.rootQ,
      stringCount: tun.stringsQ.length,
      tuningId: tun.id,
      customStringsQ: [...tun.stringsQ],
      microMode: p.microMode || 'bend',
      activeTab: 'study',
      workspaceOpen: true,
      paletteOpen: false,
      paletteQuery: ''
    });
  }
}

export function renderCommandPalette(state) {
  const modal = document.getElementById('commandPaletteModal');
  if (!modal) return;

  if (!state.paletteOpen) {
    modal.hidden = true;
    return;
  }

  const wasHidden = modal.hidden;
  modal.hidden = false;

  const matches = getFilteredCommands(state);
  if (paletteHighlightIdx >= matches.length) paletteHighlightIdx = 0;

  if (wasHidden || !modal.querySelector('#inpPaletteSearch')) {
    modal.innerHTML = `
      <div class="modal-backdrop" data-cp-close="1"></div>
      <div class="panel modal-dialog palette-dialog" role="dialog" aria-modal="true" aria-label="${t(state.lang, 'cpTitle')}">
        <div class="palette-input-row">
          <span class="palette-icon">⌘</span>
          <input
            type="search"
            id="inpPaletteSearch"
            class="palette-input"
            placeholder="${t(state.lang, 'cpPlaceholder')}"
            value="${(state.paletteQuery || '').replace(/"/g, '&quot;')}"
            autocomplete="off"
          />
          <button type="button" class="btn-mini" data-cp-close="1">Esc</button>
        </div>
        <div class="palette-results" id="paletteResultsList"></div>
        <div class="palette-footer">
          <span class="mono-tag">${t(state.lang, 'cpHint')}</span>
        </div>
      </div>
    `;

    const inp = modal.querySelector('#inpPaletteSearch');
    inp.oninput = (e) => {
      paletteHighlightIdx = 0;
      setState({ paletteQuery: e.target.value });
    };
    inp.onkeydown = (e) => {
      const curMatches = getFilteredCommands(getState());
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        paletteHighlightIdx = curMatches.length ? (paletteHighlightIdx + 1) % curMatches.length : 0;
        updatePaletteResultsList(getState());
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        paletteHighlightIdx = curMatches.length ? (paletteHighlightIdx - 1 + curMatches.length) % curMatches.length : 0;
        updatePaletteResultsList(getState());
      } else if (e.key === 'Enter' && curMatches[paletteHighlightIdx]) {
        e.preventDefault();
        executeCommandItem(curMatches[paletteHighlightIdx]);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setState({ paletteOpen: false, paletteQuery: '' });
      }
    };

    modal.onclick = (e) => {
      if (e.target.closest('[data-cp-close]')) {
        setState({ paletteOpen: false, paletteQuery: '' });
        return;
      }
      const row = e.target.closest('button[data-cp-idx]');
      if (row) {
        const idx = Number(row.dataset.cpIdx);
        const curMatches = getFilteredCommands(getState());
        executeCommandItem(curMatches[idx]);
      }
    };

    requestAnimationFrame(() => inp.focus());
  }

  updatePaletteResultsList(state);
}

export function updatePaletteResultsList(state) {
  const listEl = document.getElementById('paletteResultsList');
  if (!listEl) return;

  const matches = getFilteredCommands(state);
  if (!matches.length) {
    listEl.innerHTML = `<p class="empty-hint" style="padding:14px">${t(state.lang, 'cpNoResults')}</p>`;
    return;
  }

  listEl.innerHTML = matches.map((it, idx) => `
    <button type="button" class="palette-item ${idx === paletteHighlightIdx ? 'is-focused' : ''}" data-cp-idx="${idx}">
      <span class="palette-item-left">
        <span class="palette-item-icon">${it.icon}</span>
        <span>
          <strong>${it.title}</strong>
          <small class="palette-item-sub">${it.sub}</small>
        </span>
      </span>
      <span class="soft-tag">${it.badge}</span>
    </button>
  `).join('');
}

/**
 * Keyboard Shortcuts Quick Reference Modal (?)
 */
export function renderShortcutsModal(state) {
  const modal = document.getElementById('shortcutsModal');
  if (!modal) return;

  if (!state.shortcutsOpen) {
    modal.hidden = true;
    return;
  }
  modal.hidden = false;

  const shortcuts = [
    ['Cmd/Ctrl + K · /', t(state.lang, 'scPalette')],
    ['Esc', t(state.lang, 'scStopAll')],
    ['Space', t(state.lang, 'scScale')],
    ['M', t(state.lang, 'scVamp')],
    ['E', t(state.lang, 'scEtude')],
    ['N', t(state.lang, 'scVariation')],
    ['D', t(state.lang, 'scDrone')],
    ['R', t(state.lang, 'scRhythm')],
    ['L', t(state.lang, 'scLine')],
    ['V', t(state.lang, 'scVoicing')],
    ['H', t(state.lang, 'scHarmonics')],
    ['T', t(state.lang, 'scTheme')],
    ['Z', t(state.lang, 'scZen')],
    ['?', t(state.lang, 'scHelp')]
  ];

  modal.innerHTML = `
    <div class="modal-backdrop" data-sc-close="1"></div>
    <div class="panel modal-dialog shortcuts-dialog" role="dialog" aria-modal="true" aria-label="${t(state.lang, 'scTitle')}">
      <div class="section-heading">
        <span>${t(state.lang, 'scTitle')}</span>
        <button type="button" class="btn-mini" data-sc-close="1">✕</button>
      </div>
      <div class="shortcuts-grid">
        ${shortcuts.map(([k, desc]) => `
          <div class="shortcut-row">
            <kbd class="kbd-key">${k}</kbd>
            <span>${desc}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  modal.onclick = (e) => {
    if (e.target.closest('[data-sc-close]')) {
      setState({ shortcutsOpen: false });
    }
  };
}

/**
 * Floating Global Audio Transport Dock (visible whenever any audio engine or Line Mode is active)
 */
export function renderAudioTransportDock(state) {
  const dock = document.getElementById('audioTransportDock');
  if (!dock) return;

  const activeEngines = [];
  if (state.droneOn) activeEngines.push({ id: 'drone', label: 'Drone', cls: 'active-teal' });
  if (state.vampPlaying) activeEngines.push({ id: 'vamp', label: `Vamp · ${state.vampBpm}`, cls: 'active-voicing' });
  if (state.etudePlaying) activeEngines.push({ id: 'etude', label: `Etude · ${state.etudeBpm}`, cls: 'active' });
  if (state.rhythmPlaying) activeEngines.push({ id: 'rhythm', label: `Iqa’ · ${state.rhythmBpm}`, cls: 'active' });
  if (state.isPlayingScale) activeEngines.push({ id: 'scale', label: 'Scale', cls: 'active' });
  if (state.lineModeRunning) activeEngines.push({ id: 'line', label: 'LIVE', cls: 'live-pill' });

  if (!activeEngines.length) {
    dock.hidden = true;
    return;
  }
  dock.hidden = false;

  dock.innerHTML = `
    <div class="transport-dock-inner">
      <div class="pill-row">
        ${activeEngines.map((eng) => `
          <button type="button" class="btn-mini ${eng.cls}" data-td-stop="${eng.id}" title="${t(state.lang, 'tdClickStop')}">
            ● ${eng.label} ×
          </button>
        `).join('')}
      </div>
      <button type="button" class="btn-danger transport-stop-all" data-td-all="1">
        ■ ${t(state.lang, 'tdStopAll')}
      </button>
    </div>
  `;

  dock.onclick = (e) => {
    if (e.target.closest('[data-td-all]')) {
      stopAllAudioEngines();
      return;
    }
    const stopBtn = e.target.closest('button[data-td-stop]');
    if (!stopBtn) return;
    const id = stopBtn.dataset.tdStop;
    if (id === 'drone') {
      synthEngine.stopDrone();
      setState({ droneOn: false });
    } else if (id === 'vamp') {
      stopVampPlayback();
    } else if (id === 'etude') {
      stopEtudePlayback();
    } else if (id === 'rhythm') {
      rhythmEngine.stop();
      highlightRhythmStep(-1, -1);
      setState({ rhythmPlaying: false });
      updateRhythmBadge(getState());
    } else if (id === 'scale') {
      synthEngine.stopScaleSequence();
      setState({ isPlayingScale: false, playingPcQ: null });
    } else if (id === 'line') {
      stopLineMode();
    }
  };
}

/**
 * Global Panic Button (Esc): halts every running audio generator cleanly in 1 shot.
 */
export function stopAllAudioEngines() {
  synthEngine.stopScaleSequence();
  synthEngine.stopDrone();
  stopEtudePlayback();
  stopVampPlayback();
  rhythmEngine.stop();
  highlightRhythmStep(-1, -1);
  if (getState().lineModeRunning) {
    stopLineMode();
  }
  setState({
    droneOn: false,
    isPlayingScale: false,
    playingPcQ: null,
    rhythmPlaying: false,
    etudePlaying: false,
    etudeActiveIdx: -1,
    vampPlaying: false
  });
  updateRhythmBadge(getState());
}
