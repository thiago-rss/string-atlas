/**
 * String Atlas — Modal Guitar Lab Bootstrap v8.2
 * Pure Oud-Visualizer Compartment Ergonomics + Automatic Responsive Vertical Mobile Fretboard
 */
import { t } from './core/i18n.js';
import {
  getEffectiveOrientation,
  getState,
  setState,
  subscribe
} from './state/store.js';
import { synthEngine } from './audio/synthEngine.js';
import { rhythmEngine } from './audio/rhythmEngine.js';
import { pitchDetector } from './audio/pitchDetector.js';
import { mobileAudioGuard } from './audio/mobileAudioGuard.js';
import {
  renderDeckPanel,
  refreshScaleBrowserInPlace,
  toggleScalePlayback
} from './views/deckPanelsView.js';
import {
  renderFretboard,
  renderInspector,
  highlightFretboardEtudeEvent
} from './views/fretboardView.js';
import { renderNotationPanel, highlightNotationStep } from './views/notationView.js';
import { renderRadarView } from './views/radarView.js';
import { renderScalaView } from './views/scalaView.js';
import { initMobilePwaInstall, renderMobileBottomNav } from './views/mobileNavView.js';
import { renderVampView, toggleVampPlayback, updateVampBadge } from './views/vampView.js';
import { renderEarLabView } from './views/earLabView.js';
import { renderSnapshotsDrawer, renderZenBar } from './views/snapshotsView.js';
import { renderThemeDrawer, cycleNextTheme, updateThemeHeaderButton } from './views/themeDrawerView.js';
import { renderHeaderMenuDrawer } from './views/headerMenuView.js';
import { renderStudyGuideView } from './views/studyGuideView.js';
import {
  renderLineModeView,
  startLineMode,
  stopLineMode
} from './views/lineModeView.js';
import { renderHarmonyView } from './views/harmonyView.js';
import {
  renderEtudeView,
  highlightEtudeStep,
  regenerateEtude,
  stopEtudePlayback,
  toggleEtudePlayback
} from './views/etudeView.js';
import {
  renderRhythmView,
  toggleRhythmPlayback,
  updateRhythmBadge
} from './views/rhythmView.js';
import { renderTensionView } from './views/tensionView.js';
import { renderDossierAndOblique } from './views/dossierView.js';
import {
  renderAudioTransportDock,
  renderCommandPalette,
  renderShortcutsModal,
  stopAllAudioEngines,
  updatePaletteResultsList
} from './views/commandPaletteView.js';

const WORKSPACE_ZONES = [
  {
    id: 'explore',
    icon: '🧭',
    labelKey: 'zoneExplore',
    shortPt: 'Teoria',
    shortEn: 'Theory',
    tools: [
      { id: 'radar', labelKey: 'tabRadar' },
      { id: 'scala', labelKey: 'tabScala' },
      { id: 'harmony', labelKey: 'tabHarmony' },
      { id: 'dossier', labelKey: 'tabDossier' }
    ]
  },
  {
    id: 'jam',
    icon: '▶',
    labelKey: 'zoneJam',
    shortPt: 'Jam',
    shortEn: 'Jam',
    tools: [
      { id: 'vamp', labelKey: 'tabVamp' },
      { id: 'etude', labelKey: 'tabEtude' },
      { id: 'rhythm', labelKey: 'tabRhythm' }
    ]
  },
  {
    id: 'practice',
    icon: '🎧',
    labelKey: 'zonePractice',
    shortPt: 'Estudo',
    shortEn: 'Study',
    tools: [
      { id: 'study', labelKey: 'tabStudyGuide' },
      { id: 'line', labelKey: 'tabLineMode' },
      { id: 'ear', labelKey: 'tabEarLab' }
    ]
  },
  {
    id: 'luthier',
    icon: '🔧',
    labelKey: 'zoneLuthier',
    shortPt: 'Tensão',
    shortEn: 'Tension',
    tools: [
      { id: 'tension', labelKey: 'tabTension' }
    ]
  }
];

const TAB_TO_SECTION_ID = {
  radar: 'tabRadar',
  scala: 'tabScala',
  vamp: 'tabVamp',
  ear: 'tabEarLab',
  study: 'tabStudyGuide',
  line: 'tabLineMode',
  etude: 'tabEtude',
  harmony: 'tabHarmony',
  rhythm: 'tabRhythm',
  tension: 'tabTension',
  dossier: 'tabDossier'
};

const lastToolByZone = {
  explore: 'radar',
  jam: 'vamp',
  practice: 'study',
  luthier: 'tension'
};

function findZoneForTab(tabId) {
  return WORKSPACE_ZONES.find((z) => z.tools.some((tool) => tool.id === tabId)) || WORKSPACE_ZONES[0];
}

function isToolLive(state, toolId) {
  if (toolId === 'vamp') return Boolean(state.vampPlaying);
  if (toolId === 'etude') return Boolean(state.etudePlaying);
  if (toolId === 'rhythm') return Boolean(state.rhythmPlaying);
  if (toolId === 'line') return Boolean(state.lineModeRunning);
  return false;
}

function applyStaticI18nAndTheme(state) {
  document.documentElement.setAttribute('data-theme', state.theme);
  document.documentElement.lang = state.lang === 'en' ? 'en' : 'pt-BR';

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    el.textContent = t(state.lang, key);
  });

  updateThemeHeaderButton(state);
}

function renderLabTabs(state) {
  const nav = document.getElementById('labTabs');
  if (!nav) return;

  const isEn = state.lang === 'en';
  const activeZone = findZoneForTab(state.activeTab);
  lastToolByZone[activeZone.id] = state.activeTab;

  const zoneBtnsHtml = WORKSPACE_ZONES.map((z) => {
    const isSelected = state.workspaceOpen && z.id === activeZone.id;
    const hasLive = z.tools.some((tool) => isToolLive(state, tool.id));
    return `
      <button type="button" class="zone-tab-btn ${isSelected ? 'is-active' : ''}" data-zone="${z.id}">
        <span class="zone-icon" aria-hidden="true">${z.icon}</span>
        <span class="zone-label-full">${t(state.lang, z.labelKey)}</span>
        <span class="zone-label-short">${isEn ? z.shortEn : z.shortPt}</span>
        ${hasLive ? '<span class="live-pulse-dot" aria-hidden="true"></span>' : ''}
      </button>
    `;
  }).join('');

  const subToolsHtml = state.workspaceOpen && activeZone.tools.length > 1
    ? `
      <div class="zone-subtools-bar">
        ${activeZone.tools.map((tool) => {
          const isCur = state.activeTab === tool.id;
          const live = isToolLive(state, tool.id);
          return `
            <button type="button" class="subtool-pill ${isCur ? 'is-active' : ''}" data-tab="${tool.id}">
              <span>${t(state.lang, tool.labelKey)}</span>
              ${live ? '<span class="live-pulse-dot" aria-hidden="true"></span>' : ''}
            </button>
          `;
        }).join('')}
      </div>
    `
    : '';

  nav.innerHTML = `
    <div class="zone-primary-bar">
      <div class="zone-pills-group zone-grid-4">${zoneBtnsHtml}</div>
      ${state.workspaceOpen ? `
        <button type="button" class="btn-mini zone-collapse-btn" data-ws-toggle="1" title="${t(state.lang, 'wsCollapse')}">
          ✕
        </button>
      ` : ''}
    </div>
    ${subToolsHtml}
  `;

  nav.onclick = (e) => {
    const toggleBtn = e.target.closest('button[data-ws-toggle]');
    if (toggleBtn) {
      setState({ workspaceOpen: false });
      return;
    }

    const zoneBtn = e.target.closest('button[data-zone]');
    if (zoneBtn) {
      const zId = zoneBtn.dataset.zone;
      const st = getState();
      const targetTab = lastToolByZone[zId] || WORKSPACE_ZONES.find((z) => z.id === zId)?.tools[0]?.id || 'radar';
      if (st.workspaceOpen && findZoneForTab(st.activeTab).id === zId) {
        // Pure toggle compartment: clicking active zone collapses cleanly
        setState({ workspaceOpen: false });
      } else {
        setState({ activeTab: targetTab, workspaceOpen: true });
      }
      return;
    }

    const toolBtn = e.target.closest('button[data-tab]');
    if (toolBtn) {
      setState({ activeTab: toolBtn.dataset.tab, workspaceOpen: true });
    }
  };

  Object.entries(TAB_TO_SECTION_ID).forEach(([tabId, secId]) => {
    const el = document.getElementById(secId);
    if (el) {
      el.hidden = !state.workspaceOpen || state.activeTab !== tabId;
    }
  });
}

const SILENT_SLIDER_KEYS = new Set([
  'bpm', 'etudeBpm', 'lineInputGain', 'lineRmsGate',
  'delayMix', 'delayTime', 'tremoloDepth', 'tremoloRate', 'masterVolume', 'tensionTargetLbs'
]);

function renderAll(state, patch = null) {
  if (patch) {
    const keys = Object.keys(patch);

    if (keys.length === 1 && SILENT_SLIDER_KEYS.has(keys[0])) {
      return;
    }
    if (keys.length === 1 && keys[0] === 'vampBpm') {
      updateVampBadge(state);
      return;
    }
    if (keys.length === 1 && keys[0] === 'scaleSearch') {
      refreshScaleBrowserInPlace(state);
      return;
    }
    if (keys.length === 1 && keys[0] === 'rhythmBpm') {
      updateRhythmBadge(state);
      return;
    }
    if (keys.length === 1 && keys[0] === 'etudeActiveIdx') {
      highlightEtudeStep(state.etudeActiveIdx);
      highlightNotationStep(state.etudeActiveIdx);
      const ev = state.etudeActiveIdx >= 0 ? state.currentEtude?.events?.[state.etudeActiveIdx] : null;
      highlightFretboardEtudeEvent(ev, state.microMode);
      return;
    }
    if (keys.every((k) => k === 'inspectedNote' || k === 'phraseEvents')) {
      renderInspector(state);
      renderNotationPanel(state);
      renderDeckPanel(state);
      return;
    }
    if (keys.length === 1 && keys[0] === 'playingPcQ') {
      renderFretboard(state);
      return;
    }
    if (keys.every((k) => k === 'deckCompartment' || k === 'headerMenuOpen' || k === 'themeDrawerOpen' || k === 'snapshotsOpen')) {
      renderDeckPanel(state);
      renderHeaderMenuDrawer(state);
      renderThemeDrawer(state);
      renderSnapshotsDrawer(state);
      renderMobileBottomNav(state);
      return;
    }
    if (keys.length === 1 && keys[0] === 'notationOpen') {
      renderDeckPanel(state);
      renderNotationPanel(state);
      return;
    }
    if (keys.every((k) => k === 'activeTab' || k === 'workspaceOpen')) {
      renderLabTabs(state);
      renderMobileBottomNav(state);
      return;
    }
    if (keys.length === 1 && keys[0] === 'zenMode') {
      renderZenBar(state);
      return;
    }
    if (keys.length === 1 && keys[0] === 'paletteQuery') {
      updatePaletteResultsList(state);
      return;
    }
    if (keys.every((k) => k === 'paletteOpen' || k === 'paletteQuery')) {
      renderCommandPalette(state);
      return;
    }
    if (keys.length === 1 && keys[0] === 'shortcutsOpen') {
      renderShortcutsModal(state);
      return;
    }
    if (keys.length === 1 && keys[0] === 'pwaInstallable') {
      renderHeaderMenuDrawer(state);
      return;
    }
    if (keys.every((k) => ['fretWindowOn', 'fretWindowStart', 'fretWindowSpan', 'leftHanded', 'fretZoomOverride', 'fretOrientationMode', 'viewportTick'].includes(k))) {
      renderFretboard(state);
      renderDeckPanel(state);
      renderZenBar(state);
      renderMobileBottomNav(state);
      return;
    }
    if (keys.every((k) => ['theme', 'themeDrawerOpen', 'headerMenuOpen', 'snapshotsOpen'].includes(k))) {
      document.documentElement.setAttribute('data-theme', state.theme);
      renderHeaderMenuDrawer(state);
      renderThemeDrawer(state);
      renderSnapshotsDrawer(state);
      renderMobileBottomNav(state);
      if ('theme' in patch) {
        renderFretboard(state);
      }
      return;
    }
    if (keys.every((k) => k === 'snapshotsOpen' || k === 'snapshots')) {
      renderSnapshotsDrawer(state);
      return;
    }
    if (keys.every((k) => ['studyModuleFilter', 'studyStatusFilter', 'openDossierLessonId', 'completedLessons'].includes(k))) {
      renderStudyGuideView(state);
      return;
    }
    if (keys.every((k) => ['earMode', 'earIntervalSet', 'earScalePool', 'earQuestion', 'earSelectedId', 'earStats'].includes(k))) {
      renderEarLabView(state);
      return;
    }
    if (keys.every((k) => k.startsWith('tension'))) {
      renderTensionView(state);
      return;
    }
    if (keys.every((k) => k.startsWith('scala'))) {
      renderScalaView(state);
      renderFretboard(state);
      return;
    }
    if (keys.every((k) => ['radarPivotFilter', 'radarCompareScaleId', 'radarCompareRootQ', 'radarOverlayOnNeck'].includes(k))) {
      renderRadarView(state);
      renderFretboard(state);
      return;
    }
  }

  applyStaticI18nAndTheme(state);
  renderHeaderMenuDrawer(state);
  renderThemeDrawer(state);
  renderSnapshotsDrawer(state);
  renderZenBar(state);
  renderDeckPanel(state);
  renderFretboard(state);
  renderNotationPanel(state);
  renderLabTabs(state);
  renderRadarView(state);
  renderScalaView(state);
  renderVampView(state);
  renderEarLabView(state);
  renderStudyGuideView(state);
  renderLineModeView(state);
  renderHarmonyView(state);
  renderEtudeView(state);
  renderRhythmView(state);
  renderTensionView(state);
  renderDossierAndOblique(state);
  renderAudioTransportDock(state);
  renderCommandPalette(state);
  renderShortcutsModal(state);
  renderMobileBottomNav(state);

  // Keep screen awake cleanly while audio playback or Line Mode is running
  const anyActive = Boolean(
    state.droneOn || state.vampPlaying || state.etudePlaying || state.rhythmPlaying || state.lineModeRunning
  );
  mobileAudioGuard.syncWakeLock(anyActive);
}

/**
 * Live Responsive Viewport Watcher:
 * Automatically flips the fretboard between Vertical (mobile portrait) and Horizontal (desktop/landscape)
 * whenever the viewport resizes, rotates, or switches into mobile DevTools mode!
 */
function bindResponsiveViewportListener() {
  let lastEffective = getEffectiveOrientation(getState());
  let timer = null;

  const checkOrientation = () => {
    const st = getState();
    if (st.fretOrientationMode !== 'auto') return;
    const nextEffective = getEffectiveOrientation(st);
    if (nextEffective !== lastEffective) {
      lastEffective = nextEffective;
      setState({ viewportTick: st.viewportTick + 1 });
    }
  };

  window.addEventListener('resize', () => {
    clearTimeout(timer);
    timer = setTimeout(checkOrientation, 90);
  });
  window.addEventListener('orientationchange', () => {
    setTimeout(checkOrientation, 120);
  });
}

function bindGlobalControls() {
  document.getElementById('btnHeaderMenu')?.addEventListener('click', () => {
    const st = getState();
    setState({
      headerMenuOpen: !st.headerMenuOpen,
      themeDrawerOpen: false,
      snapshotsOpen: false
    });
  });

  window.addEventListener('keydown', (ev) => {
    const st = getState();

    if ((ev.metaKey || ev.ctrlKey) && ev.key.toLowerCase() === 'k') {
      ev.preventDefault();
      setState({ paletteOpen: !st.paletteOpen, shortcutsOpen: false });
      return;
    }

    if (ev.key === 'Escape') {
      if (st.paletteOpen || st.shortcutsOpen || st.headerMenuOpen || st.themeDrawerOpen || st.snapshotsOpen) {
        setState({ paletteOpen: false, paletteQuery: '', shortcutsOpen: false, headerMenuOpen: false, themeDrawerOpen: false, snapshotsOpen: false });
        return;
      }
      if (st.droneOn || st.vampPlaying || st.etudePlaying || st.rhythmPlaying || st.isPlayingScale || st.lineModeRunning) {
        stopAllAudioEngines();
        return;
      }
      if (st.zenMode) {
        setState({ zenMode: false });
      }
      return;
    }

    if (['INPUT', 'SELECT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;

    if (ev.key === '/' && !ev.metaKey && !ev.ctrlKey) {
      ev.preventDefault();
      setState({ paletteOpen: true, shortcutsOpen: false });
      return;
    }

    if (ev.key === '?') {
      ev.preventDefault();
      setState({ shortcutsOpen: !st.shortcutsOpen, paletteOpen: false });
      return;
    }

    const key = ev.key.toLowerCase();
    if (ev.code === 'Space') {
      ev.preventDefault();
      if (st.etudePlaying) stopEtudePlayback();
      toggleScalePlayback(st);
    } else if (key === 'm') {
      toggleVampPlayback();
    } else if (key === 'e') {
      toggleEtudePlayback();
    } else if (key === 'n') {
      regenerateEtude();
    } else if (key === 't') {
      cycleNextTheme();
    } else if (key === 'z') {
      setState({ zenMode: !st.zenMode });
    } else if (key === 'l') {
      if (st.lineModeRunning) stopLineMode();
      else {
        setState({ activeTab: 'line', workspaceOpen: true });
        startLineMode();
      }
    } else if (key === 'd') {
      const next = !st.droneOn;
      synthEngine.updateDrone(next, st.rootQ, st.droneFifth);
      setState({ droneOn: next });
    } else if (key === 'h') {
      setState({ harmonicsOn: !st.harmonicsOn });
    } else if (key === 'v') {
      setState({ voicingOverlayOn: !st.voicingOverlayOn });
    } else if (key === 'r') {
      toggleRhythmPlayback();
    }
  });
}

function registerServiceWorker() {
  if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').catch(() => {
        // Ignore in restricted contexts
      });
    });
  }
}

function boot() {
  const initial = getState();
  synthEngine.updateToneFx({
    tonePreset: initial.tonePreset,
    delayMix: initial.delayMix,
    delayTime: initial.delayTime,
    tremoloDepth: initial.tremoloDepth,
    tremoloRate: initial.tremoloRate,
    masterVolume: initial.masterVolume
  });
  mobileAudioGuard.init({
    getContexts: () => [synthEngine.ctx, pitchDetector.ctx],
    onWakeRecovery: () => {
      synthEngine.resyncActiveSequencers();
      rhythmEngine.resyncClock();
    }
  });
  subscribe(renderAll);
  bindGlobalControls();
  bindResponsiveViewportListener();
  initMobilePwaInstall();
  renderAll(initial);
  registerServiceWorker();
}

boot();
