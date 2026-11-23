/**
 * String Atlas — Modal Guitar Lab Bootstrap v2.0
 */
import { t } from './core/i18n.js';
import { getState, setState, subscribe } from './state/store.js';
import { synthEngine } from './audio/synthEngine.js';
import { renderDeckPanel, toggleScalePlayback } from './views/deckPanelsView.js';
import { renderFretboard, renderInspector } from './views/fretboardView.js';
import { renderNotationPanel } from './views/notationView.js';
import { renderHarmonyView } from './views/harmonyView.js';
import { renderRhythmView, toggleRhythmPlayback, updateRhythmBadge } from './views/rhythmView.js';
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

function renderLabTabs(state) {
  const nav = document.getElementById('labTabs');
  if (!nav) return;

  const tabs = [
    { id: 'harmony', label: t(state.lang, 'tabHarmony') },
    { id: 'rhythm', label: t(state.lang, 'tabRhythm') },
    { id: 'dossier', label: t(state.lang, 'tabDossier') }
  ];

  nav.innerHTML = tabs.map((tab) => `
    <button type="button" class="lab-tab-btn ${state.activeTab === tab.id ? 'is-active' : ''}" data-tab="${tab.id}">
      ${tab.label}
    </button>
  `).join('');

  nav.onclick = (e) => {
    const btn = e.target.closest('button[data-tab]');
    if (!btn) return;
    setState({ activeTab: btn.dataset.tab });
  };

  document.getElementById('tabHarmony').hidden = state.activeTab !== 'harmony';
  document.getElementById('tabRhythm').hidden = state.activeTab !== 'rhythm';
  document.getElementById('tabDossier').hidden = state.activeTab !== 'dossier';
}

function renderAll(state, patch = null) {
  if (patch) {
    const keys = Object.keys(patch);

    // Fast path: slider updates without tearing down inputs
    if (keys.length === 1 && keys[0] === 'bpm') return;
    if (keys.length === 1 && keys[0] === 'rhythmBpm') {
      updateRhythmBadge(state);
      return;
    }

    // Fast path: inspector + phrase capture on fretboard note click
    if (keys.every((k) => k === 'inspectedNote' || k === 'phraseEvents')) {
      renderInspector(state);
      renderNotationPanel(state);
      return;
    }

    // Fast path: scale/phrase playback note highlight
    if (keys.length === 1 && keys[0] === 'playingPcQ') {
      renderFretboard(state);
      return;
    }

    // Fast path: tab switch only
    if (keys.length === 1 && keys[0] === 'activeTab') {
      renderLabTabs(state);
      return;
    }
  }

  applyStaticI18nAndTheme(state);
  renderDeckPanel(state);
  renderFretboard(state);
  renderNotationPanel(state);
  renderLabTabs(state);
  renderHarmonyView(state);
  renderRhythmView(state);
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
    const key = ev.key.toLowerCase();
    if (ev.code === 'Space') {
      ev.preventDefault();
      toggleScalePlayback(st);
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
  subscribe(renderAll);
  bindGlobalControls();
  renderAll(getState());
  registerServiceWorker();
}

boot();
