/**
 * Mobile-First 5-Button Thumb Action Bar & PWA Install Controller (v8.6 — Oud Visualizer Model)
 *   ▶ Tocar  |  🎛 Escala  |  🎙 Mic/Line (1-tap ON/OFF)  |  🧭 Estúdio  |  ☰ Opções
 */
import { t } from '../core/i18n.js';
import { getState, setState } from '../state/store.js';
import { toggleScalePlayback } from './deckPanelsView.js';
import { startLineMode, stopLineMode } from './lineModeView.js';

let deferredInstallPrompt = null;
let installReady = false;

export function isPwaInstallAvailable() {
  return installReady;
}

export async function triggerPwaInstall() {
  if (!deferredInstallPrompt) return;
  deferredInstallPrompt.prompt();
  try {
    await deferredInstallPrompt.userChoice;
  } catch {
    // Ignore dismissal
  }
  deferredInstallPrompt = null;
  installReady = false;
}

export function initMobilePwaInstall() {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredInstallPrompt = e;
    installReady = true;
    setState({ pwaInstallable: true });
  });

  window.addEventListener('appinstalled', () => {
    deferredInstallPrompt = null;
    installReady = false;
    setState({ pwaInstallable: false });
  });
}

export function renderMobileBottomNav(state) {
  const nav = document.getElementById('mobileBottomNav');
  if (!nav) return;

  const items = [
    {
      id: 'play',
      icon: state.isPlayingScale ? '■' : '▶',
      label: state.isPlayingScale ? t(state.lang, 'mobNavStop') : t(state.lang, 'mobNavPlay'),
      active: Boolean(state.isPlayingScale),
      live: false
    },
    {
      id: 'setup',
      icon: '🎛',
      label: t(state.lang, 'mobNavScale'),
      active: state.deckCompartment === 'setup',
      live: false
    },
    {
      id: 'mic',
      icon: state.lineModeRunning ? '●' : '🎙',
      label: state.lineModeRunning ? 'LIVE' : t(state.lang, 'mobNavMic'),
      active: Boolean(state.lineModeRunning || state.deckCompartment === 'input'),
      live: Boolean(state.lineModeRunning)
    },
    {
      id: 'studio',
      icon: '🧭',
      label: t(state.lang, 'mobNavStudio'),
      active: Boolean(state.workspaceOpen),
      live: false
    },
    {
      id: 'menu',
      icon: '☰',
      label: t(state.lang, 'headerMenuBtn'),
      active: Boolean(state.headerMenuOpen || state.themeDrawerOpen || state.snapshotsOpen),
      live: false
    }
  ];

  nav.innerHTML = items.map((it) => `
    <button type="button" class="mob-nav-btn ${it.active ? 'is-active' : ''} ${it.live ? 'is-live' : ''}" data-mob-nav="${it.id}">
      <span class="mob-nav-icon">${it.icon}</span>
      <span class="mob-nav-label">${it.label}</span>
    </button>
  `).join('');

  nav.onclick = (e) => {
    const btn = e.target.closest('button[data-mob-nav]');
    if (!btn) return;
    const id = btn.dataset.mobNav;
    const st = getState();

    if (id === 'play') {
      toggleScalePlayback(st);
    } else if (id === 'setup') {
      const opening = st.deckCompartment !== 'setup';
      setState({
        deckCompartment: opening ? 'setup' : null,
        headerMenuOpen: false,
        themeDrawerOpen: false,
        snapshotsOpen: false
      });
      if (opening) {
        requestAnimationFrame(() => {
          document.querySelector('.deck-shell')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      }
    } else if (id === 'mic') {
      if (st.lineModeRunning) {
        stopLineMode();
      } else {
        startLineMode();
        requestAnimationFrame(() => {
          document.querySelector('.fretboard-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      }
    } else if (id === 'studio') {
      const opening = !st.workspaceOpen;
      setState({ workspaceOpen: opening });
      if (opening) {
        requestAnimationFrame(() => {
          document.getElementById('labTabs')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      }
    } else if (id === 'menu') {
      const opening = !st.headerMenuOpen;
      setState({
        headerMenuOpen: opening,
        themeDrawerOpen: false,
        snapshotsOpen: false
      });
      if (opening) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };
}
