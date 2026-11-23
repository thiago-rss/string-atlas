/**
 * Mobile-First Bottom Thumb Dock & PWA Install Controller (v8.1)
 * - Fixed ergonomic bottom bar on screens <= 768px with safe-area-inset-bottom
 * - 1-tap Vertical/Horizontal Neck flip, Compartment triggers & Header Menu access
 * - Captures `beforeinstallprompt` for native PWA installation
 */
import { t } from '../core/i18n.js';
import { getState, setState } from '../state/store.js';

let deferredInstallPrompt = null;
let installReady = false;
let mobileActiveTab = 'neck';

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

  const isVert = state.fretOrientation === 'vertical';
  const items = [
    { id: 'neck',   icon: '🎸', label: t(state.lang, 'mobNavNeck') },
    { id: 'setup',  icon: '🎛', label: t(state.lang, 'mobNavScale') },
    { id: 'orient', icon: isVert ? '↔' : '↕', label: isVert ? t(state.lang, 'orientHorizShort') : t(state.lang, 'orientVertShort') },
    { id: 'studio', icon: '🧭', label: t(state.lang, 'mobNavStudio') },
    { id: 'menu',   icon: '☰',  label: t(state.lang, 'headerMenuBtn') }
  ];

  nav.innerHTML = items.map((it) => `
    <button type="button" class="mob-nav-btn ${mobileActiveTab === it.id ? 'is-active' : ''}" data-mob-nav="${it.id}">
      <span class="mob-nav-icon">${it.icon}</span>
      <span class="mob-nav-label">${it.label}</span>
    </button>
  `).join('');

  nav.onclick = (e) => {
    const btn = e.target.closest('button[data-mob-nav]');
    if (!btn) return;
    const id = btn.dataset.mobNav;
    const st = getState();
    mobileActiveTab = id;

    if (id === 'neck') {
      document.querySelector('.fretboard-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (id === 'setup') {
      setState({
        deckCompartment: st.deckCompartment === 'setup' ? null : 'setup',
        headerMenuOpen: false,
        themeDrawerOpen: false,
        snapshotsOpen: false
      });
      requestAnimationFrame(() => {
        document.querySelector('.deck-shell')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    } else if (id === 'orient') {
      const nextOrient = st.fretOrientation === 'vertical' ? 'horizontal' : 'vertical';
      setState({ fretOrientation: nextOrient });
      requestAnimationFrame(() => {
        document.querySelector('.fretboard-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    } else if (id === 'studio') {
      if (!st.workspaceOpen) setState({ workspaceOpen: true });
      requestAnimationFrame(() => {
        document.getElementById('labTabs')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    } else if (id === 'menu') {
      setState({
        headerMenuOpen: !st.headerMenuOpen,
        themeDrawerOpen: false,
        snapshotsOpen: false
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    renderMobileBottomNav(getState());
  };
}
