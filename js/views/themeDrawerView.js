/**
 * Visual Design Studio Gallery Drawer (#themeDrawer) v7.2
 * Renders each design card using its authentic typography, binding strip, inlay silhouette & swatches.
 */
import { THEMES, getThemeById } from '../core/themes.js';
import {
  getThemeBackdropWatermarkSvg,
  getThemeBrandMedallionSvg,
  getThemeCornerFiligreeSvg,
  getThemeFooterOrnamentSvg,
  getThemeHeaderBannerSvg,
  getThemePanelCrownSvg
} from '../core/themeGraphics.js';
import { t } from '../core/i18n.js';
import { getState, setState } from '../state/store.js';

const INLAY_PREVIEW_GLYPH = {
  pearl_dot: '●',
  vintage_trapezoid: '▰',
  doom_monolith: '◆',
  djent_sharktooth: '◢',
  avant_crosshair: '⊕',
  armorial_sun: '✦'
};

export function updateThemeHeaderButton(state) {
  const th = getThemeById(state.theme);
  const btn = document.getElementById('btnThemeToggle');
  if (btn) {
    const shortName = (state.lang === 'en' ? th.nameEn : th.namePt).split('·')[0].trim();
    btn.innerHTML = `<span class="theme-btn-dot" style="background:${th.swatches[2]};border-color:${th.swatches[3]}"></span><span>${shortName}</span>`;
    btn.classList.toggle('is-open', Boolean(state.themeDrawerOpen));
  }

  const metaTheme = document.querySelector('meta[name="theme-color"]');
  if (metaTheme && th.themeColor) {
    metaTheme.setAttribute('content', th.themeColor);
  }

  // Inject all 6 bespoke inline SVG ornamental layers cleanly (zero-thrash cache check per theme)
  const ornBar = document.getElementById('themeOrnamentBar');
  if (ornBar && ornBar.dataset.renderedTheme !== th.id) {
    ornBar.innerHTML = getThemeHeaderBannerSvg(th.id);
    ornBar.dataset.renderedTheme = th.id;
  }

  const brandMed = document.getElementById('brandMedallion');
  if (brandMed && brandMed.dataset.renderedTheme !== th.id) {
    brandMed.innerHTML = getThemeBrandMedallionSvg(th.id);
    brandMed.dataset.renderedTheme = th.id;
  }

  const footerOrn = document.getElementById('themeFooterOrnament');
  if (footerOrn && footerOrn.dataset.renderedTheme !== th.id) {
    footerOrn.innerHTML = getThemeFooterOrnamentSvg(th.id);
    footerOrn.dataset.renderedTheme = th.id;
  }

  const fbCrown = document.getElementById('fretboardCrown');
  if (fbCrown && fbCrown.dataset.renderedTheme !== th.id) {
    fbCrown.innerHTML = getThemePanelCrownSvg(th.id);
    fbCrown.dataset.renderedTheme = th.id;
  }

  const cornerSvg = getThemeCornerFiligreeSvg(th.id);
  document.querySelectorAll('.panel-corners[data-corner-mount]').forEach((mount) => {
    if (mount.dataset.renderedTheme === th.id) return;
    mount.innerHTML = `
      <span class="corner-finial c-tl">${cornerSvg}</span>
      <span class="corner-finial c-tr">${cornerSvg}</span>
      <span class="corner-finial c-bl">${cornerSvg}</span>
      <span class="corner-finial c-br">${cornerSvg}</span>
    `;
    mount.dataset.renderedTheme = th.id;
  });

  const backdrop = document.getElementById('themeStageBackdrop');
  if (backdrop && backdrop.dataset.renderedTheme !== th.id) {
    backdrop.innerHTML = getThemeBackdropWatermarkSvg(th.id);
    backdrop.dataset.renderedTheme = th.id;
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
    const ornTag = isEn ? th.ornamentTagEn : th.ornamentTagPt;
    const glyph = INLAY_PREVIEW_GLYPH[th.fretboard?.inlayStyle] || '●';
    const bindCol = th.fretboard?.bindingColor || th.swatches[2];

    const swatchesHtml = th.swatches
      .map((hex) => `<span class="theme-swatch" style="background:${hex}"></span>`)
      .join('');

    return `
      <button type="button" class="theme-card ${isActive ? 'is-active' : ''}" data-th-action="pick" data-id="${th.id}">
        <div class="theme-card-preview" style="background:${th.swatches[0]};border-color:${th.swatches[2]}">
          <div class="theme-mini-neck" style="background-color:${th.fretboardHex};border-top-color:${bindCol};border-bottom-color:${bindCol}">
            <span class="mini-inlay-glyph" style="color:${bindCol}">${glyph}</span>
            <span class="mini-dot" style="background:${th.swatches[2]}"></span>
            <span class="mini-dot" style="background:${th.swatches[3]}"></span>
            <span class="mini-dot is-dia" style="background:${th.swatches[4]}"></span>
            <span class="mini-inlay-glyph" style="color:${bindCol}">${glyph}</span>
          </div>
          <div class="theme-swatches-row">${swatchesHtml}</div>
        </div>

        <div class="theme-card-body">
          <div class="theme-card-head">
            <strong style="font-family:${th.fontPreview}">${title}</strong>
            <span class="theme-era-badge">${era}</span>
          </div>
          <span class="theme-ornament-tag">${ornTag}</span>
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
