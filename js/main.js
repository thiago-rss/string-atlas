/**
 * String Atlas — Modal Guitar Lab Bootstrap
 */
import { t } from './core/i18n.js';
import { getState, setState, subscribe } from './state/store.js';
import { synthEngine } from './audio/synthEngine.js';
import { renderDeckPanel, toggleScalePlayback } from './views/deckPanelsView.js';
import { renderFretboard, renderInspector } from './views/fretboardView.js';
import { renderDossierAndOblique } from './views/dossierView.js';

function applyStaticI18nAndTheme(state) {
  document.documentElement.setAttribute('data-theme', state.theme);
  document.documentElement.lang = state.lang === 'en' ? 'en' : 'pt-BR';

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    el.textContent = t(state.lang, key);
  });

  const btnLang = document.getElementById('btnLangToggle');
  if (btnLang) btnLang.textContent = state.lang === 'en' ? 'EN · PT' : 'PT · EN';

  const btnTheme = document.getElementById('btnThemeToggle');
  if (btnTheme) btnTheme.textContent = state.theme === 'nahar' ? t(state.lang, 'themeNahar') : t(state.lang, 'themeLayl');
}

function renderAll(state, patch = null) {
  // Fast path: BPM slider updates state silently without tearing down the range input
  if (patch && Object.keys(patch).length === 1 && 'bpm' in patch) {
    return;
  }

  // Fast path: if only inspectedNote changed, only update inspector strip
  if (patch && Object.keys(patch).length === 1 && 'inspectedNote' in patch) {
    renderInspector(state);
    return;
  }

  // Fast path: if only playingPcQ changed during scale playback, re-render fretboard only
  if (patch && Object.keys(patch).length === 1 && 'playingPcQ' in patch) {
    renderFretboard(state);
    return;
  }

  applyStaticI18nAndTheme(state);
  renderDeckPanel(state);
  renderFretboard(state);
  renderDossierAndOblique(state);
}

function bindGlobalControls() {
  document.getElementById('btnLangToggle')?.addEventListener('click', () => {
    const st = getState();
    setState({ lang: st.lang === 'pt' ? 'en' : 'pt' });
  });

  document.getElementById('btnThemeToggle')?.addEventListener('click', () => {
    const st = getState();
    setState({ theme: st.theme === 'layl' ? 'nahar' : 'layl' });
  });

  window.addEventListener('keydown', (ev) => {
    if (['INPUT', 'SELECT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;

    const st = getState();
    if (ev.code === 'Space') {
      ev.preventDefault();
      toggleScalePlayback(st);
    } else if (ev.key.toLowerCase() === 'd') {
      const next = !st.droneOn;
      synthEngine.updateDrone(next, st.rootQ, st.droneFifth);
      setState({ droneOn: next });
    } else if (ev.key.toLowerCase() === 'h') {
      setState({ harmonicsOn: !st.harmonicsOn });
    }
  });
}

function registerServiceWorker() {
  if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').catch(() => {
        // Ignore registration errors in restricted contexts
      });
    });
  }
}

function boot() {
  subscribe(renderAll);
  bindGlobalControls();
  renderAll(getState());
  registerServiceWorker();
}

boot();
