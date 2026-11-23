/**
 * Mobile-First Bottom Thumb Dock & PWA Install Controller (v8.0)
 * - Fixed ergonomic bottom bar on screens <= 768px with safe-area-inset-bottom
 * - Instant scroll & compartment jump without reaching the top of the phone screen
 * - Captures `beforeinstallprompt` (Android/Chrome/Edge) for 1-tap PWA installation
 */
import { t } from '../core/i18n.js';
import { getState, setState } from '../state/store.js';

let deferredInstallPrompt = null;
let installReady = false;
let mobileActiveTab = 'neck';

export function initMobilePwaInstall() {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredInstallPrompt = e;
    installReady = true;
    renderInstallButton();
  });

  window.addEventListener('appinstalled', () => {
    deferredInstallPrompt = null;
    installReady = false;
    renderInstallButton();
  });

  renderInstallButton();
}

export function renderInstallButton() {
  const btn = document.getElementById('btnPwaInstall');
  if (!btn) return;
  const st = getState();
  btn.textContent = t(st.lang, 'pwaInstallBtn');
  btn.hidden = !installReady;
  btn.onclick = async () => {
    if (!deferredInstallPrompt) return;
    deferredInstallPrompt.prompt();
    try {
      await deferredInstallPrompt.userChoice;
    } catch {
      // Ignore dismissal
    }
    deferredInstallPrompt = null;
    installReady = false;
    btn.hidden = true;
  };
}

export function renderMobileBottomNav(state) {
  const nav = document.getElementById('mobileBottomNav');
  if (!nav) return;

  renderInstallButton();

  const items = [
    { id: 'neck',    icon: '🎸', label: t(state.lang, 'mobNavNeck') },
    { id: 'deck',    icon: '🎛', label: t(state.lang, 'mobNavDeck') },
    { id: 'studio',  icon: '🧭', label: t(state.lang, 'mobNavStudio') },
    { id: 'search',  icon: '⌘',  label: t(state.lang, 'mobNavSearch') },
    { id: 'design',  icon: '🎨', label: t(state.lang, 'mobNavDesign') }
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
    } else if (id === 'deck') {
      document.querySelector('.deck-shell')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (id === 'studio') {
      if (!st.workspaceOpen) setState({ workspaceOpen: true });
      requestAnimationFrame(() => {
        document.getElementById('labTabs')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    } else if (id === 'search') {
      setState({ paletteOpen: true, shortcutsOpen: false });
    } else if (id === 'design') {
      setState({ themeDrawerOpen: !st.themeDrawerOpen, snapshotsOpen: false });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    renderMobileBottomNav(getState());
  };
}
