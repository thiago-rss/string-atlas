/**
 * High-Resolution Editorial Fretboard Plate Exporter (.svg & 2x Retina .png)
 * Resolves all CSS custom properties `var(--...)` from the active theme into
 * self-contained SVG markup so exported sheets render identically outside the browser.
 */
import { triggerFileDownload } from './exportEngine.js';

function escapeXml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Replaces every `var(--token, fallback)` reference in an SVG string using a resolver function.
 */
export function resolveCssVarsInSvg(svgMarkup, resolveVar) {
  return svgMarkup.replace(/var\((--[A-Za-z0-9_-]+)(?:,\s*([^)]+))?\)/g, (_, name, fallback) => {
    const val = resolveVar(name);
    if (val && val.trim()) return val.trim();
    return fallback ? fallback.trim() : '#cccccc';
  });
}

/**
 * Builds a complete, standalone editorial SVG plate wrapping the live fretboard SVG
 * with themed background, header typography, tuning & formula metadata, and legend strip.
 */
export function buildEditorialPlateSvg({
  fretboardSvgMarkup,
  title,
  formula,
  tuningLabel,
  themeName,
  palette
}) {
  // Parse viewBox dimensions of inner fretboard SVG
  const vbMatch = fretboardSvgMarkup.match(/viewBox="0 0 (\d+(?:\.\d+)?) (\d+(?:\.\d+)?)"/);
  const fbW = vbMatch ? Number(vbMatch[1]) : 1240;
  const fbH = vbMatch ? Number(vbMatch[2]) : 278;

  const padX = 36;
  const headerH = 92;
  const footerH = 44;
  const plateW = fbW + padX * 2;
  const plateH = headerH + fbH + footerH + 18;

  // Strip outer <svg ...> and </svg> tags to nest cleanly inside a positioned <g>
  const innerContent = fretboardSvgMarkup
    .replace(/^<svg[^>]*>/i, '')
    .replace(/<\/svg>\s*$/i, '');

  const bgCanvas = palette.bgCanvas || '#0c0f15';
  const bgPanel = palette.bgPanel || '#141923';
  const borderStrong = palette.borderStrong || 'rgba(229,169,85,0.45)';
  const textPrimary = palette.textPrimary || '#eef2f7';
  const textSecondary = palette.textSecondary || '#9aa7b8';
  const accentRoot = palette.accentRoot || '#e5a955';
  const accentScale = palette.accentScale || '#4cc9b0';
  const accentChar = palette.accentChar || '#e06c75';
  const accentMicro = palette.accentMicro || '#f08c4b';
  const fontDisplay = escapeXml(palette.fontDisplay || 'Georgia, serif');
  const fontMono = 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace';

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${plateW}" height="${plateH}" viewBox="0 0 ${plateW} ${plateH}">
  <rect width="${plateW}" height="${plateH}" fill="${bgCanvas}"/>
  <rect x="14" y="14" width="${plateW - 28}" height="${plateH - 28}" rx="12" fill="${bgPanel}" stroke="${borderStrong}" stroke-width="1.6"/>
  <rect x="20" y="20" width="${plateW - 40}" height="${plateH - 40}" rx="8" fill="none" stroke="${accentRoot}" stroke-opacity="0.28" stroke-width="1"/>

  <!-- Editorial Header -->
  <text x="${padX + 4}" y="52" fill="${accentRoot}" font-family="${fontDisplay}" font-size="24" font-weight="700">${escapeXml(title)}</text>
  <text x="${padX + 4}" y="74" fill="${textSecondary}" font-family="${fontMono}" font-size="13">${escapeXml(formula)}  ·  ${escapeXml(tuningLabel)}</text>

  <text x="${plateW - padX - 4}" y="50" text-anchor="end" fill="${textPrimary}" font-family="${fontDisplay}" font-size="14" font-weight="700" opacity="0.9">STRING ATLAS · 24-TET</text>
  <text x="${plateW - padX - 4}" y="70" text-anchor="end" fill="${textSecondary}" font-family="${fontMono}" font-size="11">${escapeXml(themeName)}</text>
  <line x1="${padX}" y1="84" x2="${plateW - padX}" y2="84" stroke="${borderStrong}" stroke-opacity="0.45" stroke-width="1"/>

  <!-- Embedded Luthier Fretboard -->
  <g transform="translate(${padX}, ${headerH})">
    ${innerContent}
  </g>

  <!-- Compact Legend Footer -->
  <g transform="translate(${padX + 4}, ${headerH + fbH + 22})" font-family="${fontMono}" font-size="11.5" fill="${textSecondary}">
    <circle cx="6" cy="-4" r="5" fill="${accentRoot}"/>
    <text x="17" y="0">Root / Tônica</text>

    <circle cx="145" cy="-4" r="5" fill="${accentChar}"/>
    <text x="156" y="0">Characteristic</text>

    <circle cx="290" cy="-4" r="5" fill="${accentScale}"/>
    <text x="301" y="0">Scale (12-TET)</text>

    <polygon points="432,-10 438,-4 432,2 426,-4" fill="${accentMicro}"/>
    <text x="444" y="0">Quarter-Tone (24-TET)</text>

    <text x="${fbW - 8}" y="0" text-anchor="end" opacity="0.72">String Atlas — Modal Guitar Lab</text>
  </g>
</svg>`;
}

function captureActivePlateSvg({ title, formula, tuningLabel, themeName }) {
  const svgEl = document.querySelector('#fretboardContainer svg');
  if (!svgEl) return null;

  const computed = window.getComputedStyle(document.documentElement);
  const resolveVar = (name) => computed.getPropertyValue(name);

  // Clone and strip live ephemeral layers before exporting a clean printable plate
  const clone = svgEl.cloneNode(true);
  clone.querySelector('#etudePlayheadLayer')?.replaceChildren();
  clone.querySelector('#livePitchLayer')?.replaceChildren();
  clone.querySelector('#fxPulseLayer')?.replaceChildren();

  const rawMarkup = new XMLSerializer().serializeToString(clone);
  const resolvedFretboard = resolveCssVarsInSvg(rawMarkup, resolveVar);

  const palette = {
    bgCanvas: resolveVar('--bg-canvas').trim() || '#0c0f15',
    bgPanel: resolveVar('--bg-panel').trim() || '#141923',
    borderStrong: resolveVar('--border-strong').trim() || '#555555',
    textPrimary: resolveVar('--text-primary').trim() || '#ffffff',
    textSecondary: resolveVar('--text-secondary').trim() || '#aaaaaa',
    accentRoot: resolveVar('--accent-root').trim() || '#e5a955',
    accentScale: resolveVar('--accent-scale').trim() || '#4cc9b0',
    accentChar: resolveVar('--accent-char').trim() || '#e06c75',
    accentMicro: resolveVar('--accent-micro').trim() || '#f08c4b',
    fontDisplay: resolveVar('--font-display').trim() || 'Georgia, serif'
  };

  return buildEditorialPlateSvg({
    fretboardSvgMarkup: resolvedFretboard,
    title,
    formula,
    tuningLabel,
    themeName,
    palette
  });
}

export function exportFretboardPlateSvg(meta) {
  const plateSvg = captureActivePlateSvg(meta);
  if (!plateSvg) return;
  const slug = (meta.title || 'fretboard').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  triggerFileDownload(plateSvg, `string-atlas-${slug}.svg`, 'image/svg+xml;charset=utf-8');
}

export function exportFretboardPlatePng(meta) {
  const plateSvg = captureActivePlateSvg(meta);
  if (!plateSvg) return;

  const vbMatch = plateSvg.match(/viewBox="0 0 (\d+(?:\.\d+)?) (\d+(?:\.\d+)?)"/);
  const w = vbMatch ? Number(vbMatch[1]) : 1312;
  const h = vbMatch ? Number(vbMatch[2]) : 430;
  const scale = 2; // 2x Retina high-resolution export

  const svgBlob = new Blob([plateSvg], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);
  const img = new Image();

  img.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(w * scale);
    canvas.height = Math.round(h * scale);
    const ctx = canvas.getContext('2d');
    ctx.scale(scale, scale);
    ctx.drawImage(img, 0, 0, w, h);
    URL.revokeObjectURL(url);

    canvas.toBlob((pngBlob) => {
      if (!pngBlob) return;
      const slug = (meta.title || 'fretboard').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      const pngUrl = URL.createObjectURL(pngBlob);
      const a = document.createElement('a');
      a.href = pngUrl;
      a.download = `string-atlas-${slug}-2x.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(pngUrl);
    }, 'image/png');
  };

  img.onerror = () => {
    URL.revokeObjectURL(url);
  };
  img.src = url;
}
