/**
 * Header Options & Studio Menu Compartment (#headerMenuDrawer) v8.1
 * Keeps the topbar serene and uncluttered (Oud Visualizer pattern):
 * Visual Design, Presets/Link, Command Palette, Zen Mode, Language, Shortcuts & PWA Install
 * live neatly inside a single on-demand compartment drawer.
 */
import { getThemeById } from '../core/themes.js';
import { t } from '../core/i18n.js';
import { getState, setState } from '../state/store.js';
import { cycleNextTheme } from './themeDrawerView.js';
import { isPwaInstallAvailable, triggerPwaInstall } from './mobileNavView.js';

export function renderHeaderMenuDrawer(state) {
  const btn = document.getElementById('btnHeaderMenu');
  if (btn) {
    const th = getThemeById(state.theme);
    btn.classList.toggle('is-open', Boolean(state.headerMenuOpen || state.themeDrawerOpen || state.snapshotsOpen));
    btn.innerHTML = `<span class="theme-btn-dot" style="background:${th.swatches[2]};border-color:${th.swatches[3]}"></span><span>${t(state.lang, 'headerMenuBtn')}</span>`;
  }

  const drawer = document.getElementById('headerMenuDrawer');
  if (!drawer) return;

  if (!state.headerMenuOpen) {
    drawer.hidden = true;
    return;
  }
  drawer.hidden = false;

  const th = getThemeById(state.theme);
  const themeName = state.lang === 'en' ? th.nameEn : th.namePt;
  const canInstall = isPwaInstallAvailable();

  drawer.innerHTML = `
    <div class="panel header-menu-panel">
      <div class="compartment-head">
        <span class="control-label">${t(state.lang, 'headerMenuTitle')}</span>
        <button type="button" class="btn-mini" data-hm-action="close">${t(state.lang, 'compClose')}</button>
      </div>

      <div class="header-menu-grid">
        <button type="button" class="hm-tile" data-hm-action="openThemes">
          <span class="hm-tile-icon">🎨</span>
          <span class="hm-tile-text">
            <strong>${t(state.lang, 'hmDesignTitle')}</strong>
            <small>${themeName}</small>
          </span>
        </button>

        <button type="button" class="hm-tile" data-hm-action="cycleTheme">
          <span class="hm-tile-icon">✦</span>
          <span class="hm-tile-text">
            <strong>${t(state.lang, 'themeCycleBtn')}</strong>
            <small>${t(state.lang, 'themeGalleryHint')}</small>
          </span>
        </button>

        <button type="button" class="hm-tile" data-hm-action="openSnapshots">
          <span class="hm-tile-icon">🔗</span>
          <span class="hm-tile-text">
            <strong>${t(state.lang, 'snapBtnHeader')}</strong>
            <small>${t(state.lang, 'hmSnapshotsSub')}</small>
          </span>
        </button>

        <button type="button" class="hm-tile" data-hm-action="openPalette">
          <span class="hm-tile-icon">⌘</span>
          <span class="hm-tile-text">
            <strong>${t(state.lang, 'cpBtnHeader')}</strong>
            <small>${t(state.lang, 'hmPaletteSub')}</small>
          </span>
        </button>

        <button type="button" class="hm-tile" data-hm-action="toggleZen">
          <span class="hm-tile-icon">◎</span>
          <span class="hm-tile-text">
            <strong>${t(state.lang, 'hmZenTitle')}</strong>
            <small>${t(state.lang, 'hmZenSub')}</small>
          </span>
        </button>

        <button type="button" class="hm-tile" data-hm-action="toggleLang">
          <span class="hm-tile-icon">🌐</span>
          <span class="hm-tile-text">
            <strong>${state.lang === 'en' ? 'Language: EN → PT' : 'Idioma: PT → EN'}</strong>
            <small>${t(state.lang, 'hmLangSub')}</small>
          </span>
        </button>

        <button type="button" class="hm-tile" data-hm-action="openGlossary">
          <span class="hm-tile-icon">📖</span>
          <span class="hm-tile-text">
            <strong>${t(state.lang, 'hmGlossaryTitle')}</strong>
            <small>${t(state.lang, 'hmGlossarySub')}</small>
          </span>
        </button>

        <button type="button" class="hm-tile" data-hm-action="openShortcuts">
          <span class="hm-tile-icon">?</span>
          <span class="hm-tile-text">
            <strong>${t(state.lang, 'hmShortcutsTitle')}</strong>
            <small>${t(state.lang, 'hmShortcutsSub')}</small>
          </span>
        </button>

        ${canInstall ? `
          <button type="button" class="hm-tile is-accent" data-hm-action="installPwa">
            <span class="hm-tile-icon">⬇</span>
            <span class="hm-tile-text">
              <strong>${t(state.lang, 'pwaInstallBtn')}</strong>
              <small>PWA Offline</small>
            </span>
          </button>
        ` : ''}
      </div>
    </div>
  `;

  drawer.onclick = (e) => {
    const btnEl = e.target.closest('button[data-hm-action]');
    if (!btnEl) return;
    const act = btnEl.dataset.hmAction;
    const st = getState();

    if (act === 'close') {
      setState({ headerMenuOpen: false });
    } else if (act === 'openThemes') {
      setState({ headerMenuOpen: false, themeDrawerOpen: !st.themeDrawerOpen, snapshotsOpen: false });
    } else if (act === 'cycleTheme') {
      cycleNextTheme();
    } else if (act === 'openSnapshots') {
      setState({ headerMenuOpen: false, snapshotsOpen: !st.snapshotsOpen, themeDrawerOpen: false });
    } else if (act === 'openPalette') {
      setState({ headerMenuOpen: false, paletteOpen: true, shortcutsOpen: false });
    } else if (act === 'toggleZen') {
      setState({ headerMenuOpen: false, zenMode: !st.zenMode });
    } else if (act === 'toggleLang') {
      setState({ lang: st.lang === 'pt' ? 'en' : 'pt' });
    } else if (act === 'openGlossary') {
      setState({ headerMenuOpen: false, activeTab: 'glossary', workspaceOpen: true });
    } else if (act === 'openShortcuts') {
      setState({ headerMenuOpen: false, shortcutsOpen: true, paletteOpen: false });
    } else if (act === 'installPwa') {
      triggerPwaInstall();
      setState({ headerMenuOpen: false });
    }
  };
}
