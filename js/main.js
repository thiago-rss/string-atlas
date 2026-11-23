/**
 * String Atlas — Modal Guitar Lab Bootstrap v7.4 (Modular Studio Compartments)
 */
import { t } from './core/i18n.js';
import { getState, setState, subscribe } from './state/store.js';
import { synthEngine } from './audio/synthEngine.js';
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

// Remember last visited tool inside each compartment zone for effortless switching
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

  const btnLang = document.getElementById('btnLangToggle');
  if (btnLang) btnLang.textContent = state.lang === 'en' ? 'EN · PT' : 'PT · EN';

  updateThemeHeaderButton(state);
}

function renderLabTabs(state) {
  const nav = document.getElementById('labTabs');
  if (!nav) return;

  const activeZone = findZoneForTab(state.activeTab);
  lastToolByZone[activeZone.id] = state.activeTab;

  const zoneBtnsHtml = WORKSPACE_ZONES.map((z) => {
    const isSelected = state.workspaceOpen && z.id === activeZone.id;
    const hasLive = z.tools.some((tool) => isToolLive(state, tool.id));
    return `
      <button type="button" class="zone-tab-btn ${isSelected ? 'is-active' : ''}" data-zone="${z.id}">
        <span class="zone-icon">${z.icon}</span>
        <span>${t(state.lang, z.labelKey)}</span>
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
      <div class="zone-pills-group">${zoneBtnsHtml}</div>
      <button type="button" class="btn-mini zone-collapse-btn" data-ws-toggle="1">
        ${state.workspaceOpen ? t(state.lang, 'wsCollapse') : t(state.lang, 'wsExpand')}
      </button>
    </div>
    ${subToolsHtml}
  `;

  nav.onclick = (e) => {
    const toggleBtn = e.target.closest('button[data-ws-toggle]');
    if (toggleBtn) {
      setState({ workspaceOpen: !getState().workspaceOpen });
      return;
    }

    const zoneBtn = e.target.closest('button[data-zone]');
    if (zoneBtn) {
      const zId = zoneBtn.dataset.zone;
      const st = getState();
      const targetTab = lastToolByZone[zId] || WORKSPACE_ZONES.find((z) => z.id === zId)?.tools[0]?.id || 'radar';
      if (st.workspaceOpen && findZoneForTab(st.activeTab).id === zId) {
        // Clicking the already-active zone gently toggles collapse if desired? No, keep predictable: ensure open.
        setState({ workspaceOpen: true });
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
    if (keys.length === 1 && keys[0] === 'deckCompartment') {
      renderDeckPanel(state);
      return;
    }
    if (keys.length === 1 && keys[0] === 'notationOpen') {
      renderDeckPanel(state);
      renderNotationPanel(state);
      return;
    }
    if (keys.every((k) => k === 'activeTab' || k === 'workspaceOpen')) {
      renderLabTabs(state);
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
    if (keys.every((k) => ['fretWindowOn', 'fretWindowStart', 'fretWindowSpan', 'leftHanded', 'fretZoom'].includes(k))) {
      renderFretboard(state);
      renderZenBar(state);
      return;
    }
    if (keys.every((k) => k === 'theme' || k === 'themeDrawerOpen')) {
      document.documentElement.setAttribute('data-theme', state.theme);
      renderThemeDrawer(state);
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
  renderScalaView(state);
      renderFretboard(state);
      return;
    }
  }

  applyStaticI18nAndTheme(state);
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
}

function bindGlobalControls() {
  document.getElementById('btnLangToggle')?.addEventListener('click', () => {
    const st = getState();
    setState({ lang: st.lang === 'pt' ? 'en' : 'pt' });
  });

  document.getElementById('btnThemeToggle')?.addEventListener('click', () => {
    const st = getState();
    setState({ themeDrawerOpen: !st.themeDrawerOpen, snapshotsOpen: false });
  });

  document.getElementById('btnZenToggle')?.addEventListener('click', () => {
    setState({ zenMode: !getState().zenMode });
  });

  document.getElementById('btnCmdPalette')?.addEventListener('click', () => {
    setState({ paletteOpen: !getState().paletteOpen, shortcutsOpen: false });
  });

  document.getElementById('btnShortcutsHelp')?.addEventListener('click', () => {
    setState({ shortcutsOpen: !getState().shortcutsOpen, paletteOpen: false });
  });

  document.getElementById('btnSnapshotsToggle')?.addEventListener('click', () => {
    setState({ snapshotsOpen: !getState().snapshotsOpen, themeDrawerOpen: false });
  });

  window.addEventListener('keydown', (ev) => {
    const st = getState();

    // Global Cmd+K / Ctrl+K opens Command Palette even when focused inside inputs!
    if ((ev.metaKey || ev.ctrlKey) && ev.key.toLowerCase() === 'k') {
      ev.preventDefault();
      setState({ paletteOpen: !st.paletteOpen, shortcutsOpen: false });
      return;
    }

    if (ev.key === 'Escape') {
      if (st.paletteOpen || st.shortcutsOpen || st.themeDrawerOpen || st.snapshotsOpen) {
        setState({ paletteOpen: false, paletteQuery: '', shortcutsOpen: false, themeDrawerOpen: false, snapshotsOpen: false });
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
  subscribe(renderAll);
  bindGlobalControls();
  initMobilePwaInstall();
  renderAll(initial);
  registerServiceWorker();
}

boot();
