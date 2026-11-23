/**
 * Visual Design Studio Gallery Drawer (#themeDrawer)
 * Allows instant 1-click switching across all 7 musical-aesthetic designs with live swatch previews.
 */
import { THEMES, getThemeById } from '../core/themes.js';
import { t } from '../core/i18n.js';
import { getState, setState } from '../state/store.js';

export function updateThemeHeaderButton(state) {
  const btn = document.getElementById('btnThemeToggle');
  if (!btn) return;
  const th = getThemeById(state.theme);
  const shortName = (state.lang === 'en' ? th.nameEn : th.namePt).split('·')[0].trim();
  btn.innerHTML = `<span class="theme-btn-dot" style="background:${th.swatches[2]};border-color:${th.swatches[3]}"></span><span>${shortName}</span>`;
  btn.classList.toggle('is-open', Boolean(state.themeDrawerOpen));

  // Sync PWA browser chrome color with active design
  const metaTheme = document.querySelector('meta[name="theme-color"]');
  if (metaTheme && th.themeColor) {
    metaTheme.setAttribute('content', th.themeColor);
  }
}

export function renderThemeDrawer(state) {
  updateThemeHeaderButton(state);

  const drawer = document.getElementById('themeDrawer');
  if (!drawer) return;

  if (!state.themeDrawerOpen) {
    drawer.hidden = true;
    return;
  }
  drawer.hidden = false;

  const isEn = state.lang === 'en';
  const cardsHtml = THEMES.map((th) => {
    const isActive = state.theme === th.id;
    const title = isEn ? th.nameEn : th.namePt;
    const era = isEn ? th.eraEn : th.eraPt;
    const desc = isEn ? th.descEn : th.descPt;

    const swatchesHtml = th.swatches
      .map((hex) => `<span class="theme-swatch" style="background:${hex}"></span>`)
      .join('');

    return `
      <button type="button" class="theme-card ${isActive ? 'is-active' : ''}" data-th-action="pick" data-id="${th.id}">
        <div class="theme-card-preview" style="background:${th.swatches[0]};border-color:${th.swatches[2]}">
          <div class="theme-mini-neck" style="background:${th.fretboardHex}">
            <span class="mini-dot" style="background:${th.swatches[2]}"></span>
            <span class="mini-dot" style="background:${th.swatches[3]}"></span>
            <span class="mini-dot is-dia" style="background:${th.swatches[4]}"></span>
          </div>
          <div class="theme-swatches-row">${swatchesHtml}</div>
        </div>

        <div class="theme-card-body">
          <div class="theme-card-head">
            <strong>${title}</strong>
            <span class="theme-era-badge">${era}</span>
          </div>
          <p class="theme-card-desc">${desc}</p>
        </div>
      </button>
    `;
  }).join('');

  drawer.innerHTML = `
    <div class="panel theme-gallery-panel">
      <div class="section-heading" style="flex-wrap:wrap">
        <span>${t(state.lang, 'themeGalleryTitle')}</span>
        <div class="pill-row">
          <span class="mono-tag">${t(state.lang, 'themeGalleryHint')}</span>
          <button type="button" class="btn-mini" data-th-action="cycle">${t(state.lang, 'themeCycleBtn')}</button>
          <button type="button" class="btn-mini" data-th-action="close">${t(state.lang, 'atlasClose')}</button>
        </div>
      </div>

      <div class="theme-gallery-grid">${cardsHtml}</div>
    </div>
  `;

  drawer.onclick = (e) => {
    const btn = e.target.closest('button[data-th-action]');
    if (!btn) return;
    const act = btn.dataset.thAction;
    const st = getState();

    if (act === 'close') {
      setState({ themeDrawerOpen: false });
    } else if (act === 'pick') {
      setState({ theme: btn.dataset.id });
    } else if (act === 'cycle') {
      cycleNextTheme();
    }
  };
}

export function cycleNextTheme() {
  const st = getState();
  const idx = THEMES.findIndex((th) => th.id === st.theme);
  const next = THEMES[(idx + 1) % THEMES.length];
  setState({ theme: next.id });
}
