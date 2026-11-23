/**
 * Luxurious, Mystical & Artisanal Inline SVG Ornamentation Library (v7.7)
 * Provides 6 bespoke graphic layers per visual world:
 *  1. Brand Medallion Emblem (44x44)
 *  2. Header Crown Banner (980x44)
 *  3. Footer Closing Tailpiece (980x28)
 *  4. Panel 4-Corner Filigree Finials (54x54, mirrored to all 4 corners)
 *  5. Fretboard Stage Center Cartouche Crest (180x26)
 *  6. Full-Viewport Atmospheric Tapestry Backdrop
 */

export function getThemeBrandMedallionSvg(themeId) {
  if (themeId === 'shoegaze') {
    return `
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <defs>
          <radialGradient id="bmShoe" cx="45%" cy="45%" r="58%">
            <stop offset="0%" stop-color="#f472b6" stop-opacity="0.55"/>
            <stop offset="55%" stop-color="#93c5fd" stop-opacity="0.22"/>
            <stop offset="100%" stop-color="#0b0714"/>
          </radialGradient>
        </defs>
        <circle cx="24" cy="24" r="22" fill="url(#bmShoe)" stroke="#f472b6" stroke-opacity="0.7" stroke-width="1.3"/>
        <circle cx="24" cy="24" r="16.5" fill="none" stroke="#93c5fd" stroke-opacity="0.55" stroke-width="1.1" stroke-dasharray="6 3"/>
        <circle cx="24" cy="24" r="11.2" fill="none" stroke="#e879f9" stroke-opacity="0.78" stroke-width="1.2"/>
        <path d="M24 9 A 15 15 0 0 1 39 24 M24 39 A 15 15 0 0 1 9 24" fill="none" stroke="#f472b6" stroke-width="1.6" stroke-linecap="round"/>
        <circle cx="24" cy="24" r="5" fill="#140d23" stroke="#93c5fd" stroke-width="1.3"/>
        <circle cx="24" cy="24" r="2.2" fill="#f472b6"/>
      </svg>
    `;
  }

  if (themeId === 'kintsugi') {
    return `
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <circle cx="24" cy="24" r="21.5" fill="#faf7f0" stroke="#c8beab" stroke-width="1"/>
        <path d="M35 12 A 15.5 15.5 0 1 0 38.5 29" fill="none" stroke="#221e1a" stroke-width="3.6" stroke-linecap="round"/>
        <path d="M34.5 11.5 L29.5 19 L34 24.5 L38.2 29.2" fill="none" stroke="#d49e32" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <rect x="28" y="29" width="7.5" height="7.5" rx="1.2" fill="#c23b2b"/>
        <rect x="29.6" y="30.6" width="4.3" height="4.3" rx="0.5" fill="none" stroke="#faf7f0" stroke-width="0.9"/>
        <circle cx="24" cy="24" r="3" fill="none" stroke="#3f6d52" stroke-width="1.1" stroke-opacity="0.7"/>
      </svg>
    `;
  }

  if (themeId === 'bluenote') {
    return `
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <circle cx="24" cy="24" r="22" fill="#090d14" stroke="#e8a845" stroke-width="1.4"/>
        <circle cx="24" cy="24" r="18.2" fill="none" stroke="#3888e8" stroke-opacity="0.45" stroke-width="0.9"/>
        <circle cx="24" cy="24" r="15" fill="none" stroke="#f5efe1" stroke-opacity="0.22" stroke-width="0.8"/>
        <circle cx="24" cy="24" r="12" fill="none" stroke="#3888e8" stroke-opacity="0.4" stroke-width="0.8"/>
        <circle cx="24" cy="24" r="9.2" fill="#3888e8" stroke="#f5efe1" stroke-width="1"/>
        <path d="M15 24 A 9 9 0 0 1 33 24 Z" fill="#f05528"/>
        <circle cx="24" cy="24" r="2.6" fill="#070b12" stroke="#e8a845" stroke-width="1"/>
      </svg>
    `;
  }

  if (themeId === 'rock70s') {
    return `
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <defs>
          <radialGradient id="bm70" cx="50%" cy="45%" r="55%">
            <stop offset="0%" stop-color="#ffcf70"/>
            <stop offset="55%" stop-color="#f27729"/>
            <stop offset="100%" stop-color="#4a1d06"/>
          </radialGradient>
        </defs>
        <circle cx="24" cy="24" r="22" fill="#1a0f08" stroke="#e5b864" stroke-width="1.6"/>
        <circle cx="24" cy="24" r="18.5" fill="none" stroke="#f27729" stroke-width="0.9" stroke-dasharray="2.5 2"/>
        <!-- Glowing vintage vacuum tube silhouette -->
        <rect x="16" y="10" width="16" height="24" rx="8" fill="#2a160b" stroke="#f7cc54" stroke-width="1.2"/>
        <ellipse cx="24" cy="21" rx="6" ry="7" fill="url(#bm70)" opacity="0.85"/>
        <path d="M20 27 L20 17 L24 13.5 L28 17 L28 27" fill="none" stroke="#fff6d6" stroke-width="1.4" stroke-linecap="round"/>
        <line x1="18" y1="30" x2="30" y2="30" stroke="#e5b864" stroke-width="1.5"/>
        <line x1="20" y1="34" x2="20" y2="38" stroke="#c89844" stroke-width="1.3"/>
        <line x1="24" y1="34" x2="24" y2="39" stroke="#c89844" stroke-width="1.3"/>
        <line x1="28" y1="34" x2="28" y2="38" stroke="#c89844" stroke-width="1.3"/>
      </svg>
    `;
  }

  if (themeId === 'doom') {
    return `
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <circle cx="24" cy="24" r="22" fill="#09060e" stroke="#dba342" stroke-width="1.4"/>
        <circle cx="24" cy="24" r="18" fill="none" stroke="#b880ff" stroke-width="0.9" stroke-dasharray="2 3"/>
        <polygon points="24,4 30,24 24,44 18,24" fill="#dba342" fill-opacity="0.18" stroke="#e8be66" stroke-width="1"/>
        <polygon points="4,24 24,18 44,24 24,30" fill="#b880ff" fill-opacity="0.14" stroke="#dba342" stroke-width="0.9"/>
        <circle cx="24" cy="24" r="7.5" fill="#08050c" stroke="#e8be66" stroke-width="1.3"/>
        <path d="M25.5 18.5 A 5.5 5.5 0 1 0 25.5 29.5 A 4 5.5 0 1 1 25.5 18.5 Z" fill="#dba342"/>
        <circle cx="26.5" cy="24" r="2" fill="#e33648"/>
      </svg>
    `;
  }

  if (themeId === 'djent') {
    return `
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <polygon points="24,2 43,13 43,35 24,46 5,35 5,13" fill="#060c14" stroke="#00e5ff" stroke-width="1.6"/>
        <polygon points="24,7 38,15 38,33 24,41 10,33 10,15" fill="none" stroke="#34f599" stroke-width="1" stroke-dasharray="4 2"/>
        <line x1="12" y1="24" x2="36" y2="24" stroke="#00e5ff" stroke-width="1.2" stroke-opacity="0.6"/>
        <line x1="24" y1="10" x2="24" y2="38" stroke="#00e5ff" stroke-width="1.2" stroke-opacity="0.6"/>
        <polygon points="24,14 33,24 24,34 15,24" fill="#00e5ff" fill-opacity="0.24" stroke="#00e5ff" stroke-width="1.4"/>
        <circle cx="24" cy="24" r="3.4" fill="#34f599"/>
      </svg>
    `;
  }

  if (themeId === 'experimental') {
    return `
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <rect x="2" y="2" width="44" height="44" fill="#fbf9f3" stroke="#141414" stroke-width="2.2"/>
        <line x1="2" y1="24" x2="46" y2="24" stroke="#141414" stroke-width="1"/>
        <line x1="24" y1="2" x2="24" y2="46" stroke="#141414" stroke-width="1"/>
        <circle cx="24" cy="24" r="14" fill="none" stroke="#1e4fd6" stroke-width="1.8"/>
        <polygon points="24,8 37,33 11,33" fill="none" stroke="#141414" stroke-width="1.6"/>
        <circle cx="24" cy="24" r="4.5" fill="#dc3826"/>
      </svg>
    `;
  }

  if (themeId === 'brazilian') {
    return `
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <circle cx="24" cy="24" r="22" fill="#2c150c" stroke="#c84b26" stroke-width="1.8"/>
        <circle cx="24" cy="24" r="18.5" fill="#fffbf2" stroke="#d68a12" stroke-width="1.2"/>
        <!-- 8-point Armorial woodcut sunburst -->
        <polygon points="24,7 27.5,19.5 41,24 27.5,28.5 24,41 20.5,28.5 7,24 20.5,19.5" fill="#d68a12" stroke="#8a3316" stroke-width="0.9"/>
        <polygon points="24,11 26.5,21 37,24 26.5,27 24,37 21.5,27 11,24 21.5,21" transform="rotate(45 24 24)" fill="#c84b26" fill-opacity="0.88"/>
        <circle cx="24" cy="24" r="5" fill="#0e7c5d" stroke="#fffbf2" stroke-width="1.3"/>
      </svg>
    `;
  }

  // Layl & Nahar: 12-Pointed Andalusian Oud Shamsa Rosette Medallion
  const isLight = themeId === 'nahar';
  const bg = isLight ? '#faf4e6' : '#0b101a';
  const gold = isLight ? '#b85c1b' : '#e8b35a';
  const teal = isLight ? '#1d7a68' : '#4cc9b0';
  const gem = isLight ? '#a83328' : '#f2c977';
  return `
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <circle cx="24" cy="24" r="22" fill="${bg}" stroke="${gold}" stroke-width="1.5"/>
      <circle cx="24" cy="24" r="19" fill="none" stroke="${gold}" stroke-width="0.8" stroke-dasharray="2 2"/>
      <g transform="translate(24,24)" fill="none">
        <rect x="-12" y="-12" width="24" height="24" stroke="${gold}" stroke-width="1.2"/>
        <rect x="-12" y="-12" width="24" height="24" transform="rotate(30)" stroke="${teal}" stroke-width="1.1"/>
        <rect x="-12" y="-12" width="24" height="24" transform="rotate(60)" stroke="${gold}" stroke-width="1.1"/>
        <circle r="6.8" fill="${bg}" stroke="${gold}" stroke-width="1.2"/>
        <circle r="3.2" fill="${gem}"/>
      </g>
    </svg>
  `;
}

export function getThemeHeaderBannerSvg(themeId) {
  if (themeId === 'shoegaze') {
    return `
      <svg class="ornament-art-svg" viewBox="0 0 980 44" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        <defs>
          <linearGradient id="ornShoeWave" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="#93c5fd" stop-opacity="0"/>
            <stop offset="22%" stop-color="#93c5fd" stop-opacity="0.75"/>
            <stop offset="50%" stop-color="#f472b6" stop-opacity="0.95"/>
            <stop offset="78%" stop-color="#e879f9" stop-opacity="0.75"/>
            <stop offset="100%" stop-color="#93c5fd" stop-opacity="0"/>
          </linearGradient>
        </defs>
        <path d="M30 24 Q 150 6, 270 22 T 490 22 T 710 22 T 950 20" fill="none" stroke="url(#ornShoeWave)" stroke-width="2.2"/>
        <path d="M50 20 Q 170 38, 290 22 T 490 22 T 690 22 T 930 24" fill="none" stroke="#93c5fd" stroke-opacity="0.45" stroke-width="1.3" stroke-dasharray="6 4"/>
        <g transform="translate(490,22)">
          <circle r="15" fill="#f472b6" fill-opacity="0.14" stroke="#f472b6" stroke-opacity="0.65" stroke-width="1"/>
          <circle r="9" fill="#93c5fd" fill-opacity="0.2" stroke="#93c5fd" stroke-width="1.1"/>
          <circle r="3.4" fill="#f472b6"/>
        </g>
      </svg>
    `;
  }

  if (themeId === 'kintsugi') {
    return `
      <svg class="ornament-art-svg" viewBox="0 0 980 44" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        <path d="M40 22 L210 22 L238 14 L268 27 L310 22 L462 22" fill="none" stroke="#c89228" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M518 22 L670 22 L712 16 L742 29 L770 22 L940 22" fill="none" stroke="#c89228" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
        <line x1="80" y1="22" x2="452" y2="22" stroke="#221e1a" stroke-opacity="0.18" stroke-width="0.9"/>
        <line x1="528" y1="22" x2="900" y2="22" stroke="#221e1a" stroke-opacity="0.18" stroke-width="0.9"/>
        <g transform="translate(490,22)">
          <path d="M12 -10 A 14 14 0 1 0 14 5" fill="none" stroke="#221e1a" stroke-width="2.4" stroke-linecap="round"/>
          <path d="M11 -10 L8 -2 L13.5 4.5" fill="none" stroke="#d49e32" stroke-width="1.6"/>
          <rect x="-4" y="-4" width="8" height="8" rx="1.2" fill="#c23b2b"/>
        </g>
      </svg>
    `;
  }

  if (themeId === 'bluenote') {
    return `
      <svg class="ornament-art-svg" viewBox="0 0 980 44" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        <rect x="40" y="19" width="386" height="2" fill="#3888e8" fill-opacity="0.65"/>
        <rect x="110" y="25" width="316" height="1.2" fill="#e8a845" fill-opacity="0.5"/>
        <rect x="554" y="19" width="386" height="2" fill="#3888e8" fill-opacity="0.65"/>
        <rect x="554" y="25" width="316" height="1.2" fill="#e8a845" fill-opacity="0.5"/>
        <rect x="438" y="14" width="16" height="16" fill="#3888e8"/>
        <rect x="462" y="14" width="56" height="16" fill="#0e1726" stroke="#e8a845" stroke-width="1.4"/>
        <circle cx="490" cy="22" r="5" fill="#f05528"/>
        <circle cx="490" cy="22" r="1.8" fill="#070b12"/>
        <rect x="526" y="14" width="16" height="16" fill="#e8a845"/>
      </svg>
    `;
  }

  if (themeId === 'rock70s') {
    return `
      <svg class="ornament-art-svg" viewBox="0 0 980 44" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        <defs>
          <linearGradient id="orn70sWave" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="#f27729" stop-opacity="0"/>
            <stop offset="18%" stop-color="#f27729"/>
            <stop offset="50%" stop-color="#f7cc54"/>
            <stop offset="82%" stop-color="#6eb881"/>
            <stop offset="100%" stop-color="#6eb881" stop-opacity="0"/>
          </linearGradient>
          <radialGradient id="ornTubeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#ffaa48" stop-opacity="0.95"/>
            <stop offset="60%" stop-color="#f05a1a" stop-opacity="0.35"/>
            <stop offset="100%" stop-color="#f05a1a" stop-opacity="0"/>
          </radialGradient>
        </defs>
        <path d="M16 28 C 120 4, 230 40, 368 22" fill="none" stroke="url(#orn70sWave)" stroke-width="2.6" stroke-linecap="round"/>
        <path d="M16 19 C 130 40, 240 4, 368 22" fill="none" stroke="#f7cc54" stroke-opacity="0.55" stroke-width="1.3"/>
        <path d="M612 22 C 740 4, 850 40, 964 16" fill="none" stroke="url(#orn70sWave)" stroke-width="2.6" stroke-linecap="round"/>
        <path d="M612 22 C 750 40, 860 4, 964 25" fill="none" stroke="#f7cc54" stroke-opacity="0.55" stroke-width="1.3"/>
        <!-- Sunburst Art Nouveau Left & Right Studs -->
        <circle cx="192" cy="22" r="4" fill="#f7cc54" opacity="0.75"/>
        <circle cx="788" cy="22" r="4" fill="#f7cc54" opacity="0.75"/>
        <!-- Left Vinyl LP -->
        <g transform="translate(408,22)">
          <circle r="15" fill="#18100a" stroke="#e5b864" stroke-width="1.3"/>
          <circle r="11" fill="none" stroke="#b38840" stroke-width="0.7" stroke-opacity="0.75"/>
          <circle r="7.5" fill="none" stroke="#b38840" stroke-width="0.7" stroke-opacity="0.65"/>
          <circle r="4.2" fill="#f27729"/>
          <circle r="1.4" fill="#18100a"/>
        </g>
        <!-- Center Analog VU Meter & Tube Halo -->
        <g transform="translate(490,22)">
          <ellipse cx="0" cy="0" rx="54" ry="18" fill="url(#ornTubeGlow)"/>
          <rect x="-38" y="-14" width="76" height="28" rx="14" fill="#1f1209" stroke="#e5b864" stroke-width="1.3"/>
          <path d="M-26 7 A 28 28 0 0 1 26 7" fill="none" stroke="#f9e6ba" stroke-width="1.5"/>
          <path d="M12 -4 A 28 28 0 0 1 26 7" fill="none" stroke="#e04332" stroke-width="2.5"/>
          <line x1="0" y1="10" x2="10" y2="-8" stroke="#fff3cc" stroke-width="1.6" stroke-linecap="round"/>
          <circle cx="0" cy="10" r="2.6" fill="#e5b864"/>
        </g>
        <!-- Right Dual Tube Emblem -->
        <g transform="translate(572,22)">
          <rect x="-10" y="-14" width="20" height="28" rx="10" fill="#23140c" stroke="#e5b864" stroke-width="1.2"/>
          <path d="M-3.5 6 L-3.5 -3.5 L0 -7.5 L3.5 -3.5 L3.5 6" fill="none" stroke="#ff9d42" stroke-width="1.6"/>
          <line x1="-6" y1="9" x2="6" y2="9" stroke="#c89844" stroke-width="1.3"/>
        </g>
      </svg>
    `;
  }

  if (themeId === 'doom') {
    return `
      <svg class="ornament-art-svg" viewBox="0 0 980 44" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        <defs>
          <linearGradient id="ornDoomLine" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="#dba342" stop-opacity="0"/>
            <stop offset="22%" stop-color="#dba342" stop-opacity="0.8"/>
            <stop offset="50%" stop-color="#b880ff" stop-opacity="0.9"/>
            <stop offset="78%" stop-color="#dba342" stop-opacity="0.8"/>
            <stop offset="100%" stop-color="#dba342" stop-opacity="0"/>
          </linearGradient>
        </defs>
        <path d="M26 22 L336 22 M644 22 L954 22" stroke="url(#ornDoomLine)" stroke-width="1.3"/>
        <path d="M60 22 Q 190 8, 336 22 M644 22 Q 790 8, 920 22" fill="none" stroke="#dba342" stroke-opacity="0.35" stroke-width="0.9"/>
        <path d="M60 22 Q 190 36, 336 22 M644 22 Q 790 36, 920 22" fill="none" stroke="#b880ff" stroke-opacity="0.28" stroke-width="0.9"/>
        <!-- Gothic Lancet Filigree Diamonds -->
        <path d="M160 22 L182 13 L204 22 L182 31 Z M776 22 L798 13 L820 22 L798 31 Z" fill="#100a17" stroke="#dba342" stroke-width="1.1"/>
        <circle cx="182" cy="22" r="2.2" fill="#e33648"/>
        <circle cx="798" cy="22" r="2.2" fill="#e33648"/>
        <!-- 5-Phase Lunar Eclipse Altar Crest -->
        <g transform="translate(490,22)" stroke="#dba342" fill="none" stroke-width="1.2">
          <path d="M-112 -8.5 A 8.5 8.5 0 1 0 -112 8.5 A 5.6 8.5 0 1 1 -112 -8.5 Z" fill="#dba342" fill-opacity="0.72" stroke="none"/>
          <circle cx="-62" cy="0" r="9" stroke-opacity="0.82"/>
          <path d="M-62 -9 A 9 9 0 0 0 -62 9 Z" fill="#dba342" fill-opacity="0.78" stroke="none"/>
          <!-- Center Cathedral Eclipse -->
          <circle cx="0" cy="0" r="19" stroke="#b880ff" stroke-opacity="0.55" stroke-dasharray="2.5 2.5"/>
          <polygon points="0,-20 14,0 0,20 -14,0" fill="#09060e" stroke="#f0c467" stroke-width="1.4"/>
          <polygon points="0,-13 7,0 0,13 -7,0" fill="#dba342" fill-opacity="0.28" stroke="#f0c467" stroke-width="1"/>
          <circle cx="0" cy="0" r="3.4" fill="#e33648" stroke="#ff9aa4" stroke-width="0.8"/>
          <circle cx="62" cy="0" r="9" stroke-opacity="0.82"/>
          <path d="M62 -9 A 9 9 0 0 1 62 9 Z" fill="#dba342" fill-opacity="0.78" stroke="none"/>
          <path d="M112 -8.5 A 8.5 8.5 0 1 1 112 8.5 A 5.6 8.5 0 1 0 112 -8.5 Z" fill="#dba342" fill-opacity="0.72" stroke="none"/>
        </g>
      </svg>
    `;
  }

  if (themeId === 'djent') {
    return `
      <svg class="ornament-art-svg" viewBox="0 0 980 44" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        <path d="M14 22 L280 22 M700 22 L966 22" stroke="#00e5ff" stroke-opacity="0.32" stroke-width="1"/>
        <g fill="#00e5ff">
          <polygon points="18,15 48,15 41,29 11,29" fill-opacity="0.92"/>
          <polygon points="53,16 71,16 66,28 48,28" fill="#34f599" fill-opacity="0.86"/>
          <polygon points="76,17 90,17 86,27 72,27" fill-opacity="0.5"/>
          <polygon points="95,18 104,18 101,26 92,26" fill="#ff3b8d" fill-opacity="0.75"/>
        </g>
        <polyline
          points="290,22 320,22 334,7 348,37 364,4 380,40 398,13 414,31 430,22 466,22 480,6 496,38 512,9 528,35 544,22 578,22 594,8 610,36 626,11 642,33 658,22 690,22"
          fill="none" stroke="#00e5ff" stroke-width="1.8" stroke-linejoin="bevel"
        />
        <polyline
          points="290,22 336,22 352,12 370,32 388,22 462,22 482,12 502,32 522,22 586,22 606,13 626,31 646,22 690,22"
          fill="none" stroke="#34f599" stroke-width="1.15" stroke-opacity="0.8"
        />
        <text x="962" y="25" text-anchor="end" fill="#00e5ff" font-size="10" font-weight="700" letter-spacing="2.4" font-family="var(--font-mono, monospace)">24-TET // POLY-CNC LAB</text>
      </svg>
    `;
  }

  if (themeId === 'experimental') {
    return `
      <svg class="ornament-art-svg" viewBox="0 0 980 44" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        <line x1="12" y1="8" x2="968" y2="8" stroke="#141414" stroke-width="1.6"/>
        <line x1="12" y1="36" x2="968" y2="36" stroke="#141414" stroke-width="1"/>
        <path d="M136 36 Q 250 2, 370 25 T 605 11 T 840 30" fill="none" stroke="#1e4fd6" stroke-width="1.8"/>
        <path d="M190 10 C 290 40, 410 2, 530 30 C 635 42, 725 6, 815 17" fill="none" stroke="#dc3826" stroke-width="1.5" stroke-dasharray="5 3"/>
        <circle cx="262" cy="15" r="5.5" fill="#dc3826"/>
        <polygon points="490,6 501,27 479,27" fill="none" stroke="#141414" stroke-width="1.7"/>
        <circle cx="490" cy="20" r="2.6" fill="#1e4fd6"/>
        <rect x="695" y="13" width="12" height="12" fill="#141414"/>
        <text x="18" y="26" fill="#141414" font-size="10" font-weight="700" font-family="var(--font-mono, monospace)">⊕ FIG. 01 · GRAPHIC SCORE</text>
        <text x="962" y="26" text-anchor="end" fill="#dc3826" font-size="10" font-weight="700" font-family="var(--font-mono, monospace)">24-TET // FLUXUS ⊕</text>
      </svg>
    `;
  }

  if (themeId === 'brazilian') {
    return `
      <svg class="ornament-art-svg" viewBox="0 0 980 44" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        <path d="M14 30 C 92 6, 174 42, 256 18 C 328 0, 396 36, 452 22" fill="none" stroke="#0e7c5d" stroke-width="3.2" stroke-linecap="round"/>
        <path d="M14 21 C 98 42, 180 6, 262 28 C 334 42, 400 8, 452 22" fill="none" stroke="#d68a12" stroke-width="2" stroke-linecap="round"/>
        <path d="M528 22 C 584 6, 652 42, 724 18 C 806 0, 888 38, 966 14" fill="none" stroke="#0e7c5d" stroke-width="3.2" stroke-linecap="round"/>
        <path d="M528 22 C 580 36, 646 4, 718 28 C 800 42, 882 6, 966 24" fill="none" stroke="#c84b26" stroke-width="2" stroke-linecap="round"/>
        <!-- Azulejo diamonds along wave crests -->
        <polygon points="256,12 262,18 256,24 250,18" fill="#c84b26"/>
        <polygon points="724,12 730,18 724,24 718,18" fill="#d68a12"/>
        <!-- Center Armorial Sun Medallion -->
        <g transform="translate(490,22)">
          <circle r="19" fill="#fffbf2" stroke="#c84b26" stroke-width="2"/>
          <circle r="15.5" fill="none" stroke="#d68a12" stroke-width="0.9" stroke-dasharray="2.5 2"/>
          <polygon points="0,-15 3.6,-3.6 15,0 3.6,3.6 0,15 -3.6,3.6 -15,0 -3.6,-3.6" fill="#d68a12" stroke="#8a3316" stroke-width="0.8"/>
          <circle r="4.2" fill="#0e7c5d" stroke="#fffbf2" stroke-width="1"/>
        </g>
      </svg>
    `;
  }

  // Layl & Nahar: Lush Oud Visualizer Arabesque Scrolls + Center Shamsa Astrolabe Crest
  const isLight = themeId === 'nahar';
  const mainStroke = isLight ? '#b85c1b' : '#e8b35a';
  const secStroke = isLight ? '#1d7a68' : '#4cc9b0';
  const gemFill = isLight ? '#a83328' : '#ffd88a';
  return `
    <svg class="ornament-art-svg" viewBox="0 0 980 44" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <defs>
        <linearGradient id="ornOudLine" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="${mainStroke}" stop-opacity="0"/>
          <stop offset="22%" stop-color="${mainStroke}" stop-opacity="0.82"/>
          <stop offset="50%" stop-color="${secStroke}" stop-opacity="0.95"/>
          <stop offset="78%" stop-color="${mainStroke}" stop-opacity="0.82"/>
          <stop offset="100%" stop-color="${mainStroke}" stop-opacity="0"/>
        </linearGradient>
      </defs>
      <!-- Arabesque interlocking wave scrolls -->
      <path d="M36 22 Q 140 6, 240 22 T 446 22" fill="none" stroke="url(#ornOudLine)" stroke-width="1.4"/>
      <path d="M36 22 Q 140 38, 240 22 T 446 22" fill="none" stroke="${mainStroke}" stroke-opacity="0.4" stroke-width="1"/>
      <path d="M534 22 Q 640 6, 740 22 T 944 22" fill="none" stroke="url(#ornOudLine)" stroke-width="1.4"/>
      <path d="M534 22 Q 640 38, 740 22 T 944 22" fill="none" stroke="${mainStroke}" stroke-opacity="0.4" stroke-width="1"/>
      <!-- Flanking Rub el Hizb mini stars -->
      <g transform="translate(240,22)" fill="none" stroke="${mainStroke}" stroke-width="1">
        <rect x="-5.5" y="-5.5" width="11" height="11"/>
        <rect x="-5.5" y="-5.5" width="11" height="11" transform="rotate(45)" stroke="${secStroke}"/>
        <circle r="1.8" fill="${gemFill}" stroke="none"/>
      </g>
      <g transform="translate(740,22)" fill="none" stroke="${mainStroke}" stroke-width="1">
        <rect x="-5.5" y="-5.5" width="11" height="11"/>
        <rect x="-5.5" y="-5.5" width="11" height="11" transform="rotate(45)" stroke="${secStroke}"/>
        <circle r="1.8" fill="${gemFill}" stroke="none"/>
      </g>
      <!-- Center Grand 12-Pointed Shamsa Rosette -->
      <g transform="translate(490,22)" fill="none">
        <circle r="19" stroke="${mainStroke}" stroke-width="1" stroke-opacity="0.65" stroke-dasharray="2.5 2"/>
        <circle r="15.5" stroke="${secStroke}" stroke-width="0.9" stroke-opacity="0.7"/>
        <rect x="-10.5" y="-10.5" width="21" height="21" stroke="${mainStroke}" stroke-width="1.3"/>
        <rect x="-10.5" y="-10.5" width="21" height="21" transform="rotate(30)" stroke="${secStroke}" stroke-width="1.15"/>
        <rect x="-10.5" y="-10.5" width="21" height="21" transform="rotate(60)" stroke="${mainStroke}" stroke-width="1.15"/>
        <circle r="4.2" fill="${gemFill}"/>
      </g>
    </svg>
  `;
}

/**
 * Matching Closing Tailpiece Ornament at the bottom of the app shell
 */
export function getThemeFooterOrnamentSvg(themeId) {
  const isLight = themeId === 'nahar' || themeId === 'experimental' || themeId === 'brazilian' || themeId === 'kintsugi';
  const col = themeId === 'djent'
    ? '#00e5ff'
    : (themeId === 'shoegaze' ? '#f472b6'
    : (themeId === 'kintsugi' ? '#b88424'
    : (themeId === 'bluenote' ? '#e8a845'
    : (themeId === 'brazilian' ? '#c84b26'
    : (themeId === 'experimental' ? '#141414'
    : (isLight ? '#b85c1b' : '#e5a955'))))));
  const sec = themeId === 'doom'
    ? '#b880ff'
    : (themeId === 'shoegaze' ? '#93c5fd'
    : (themeId === 'kintsugi' ? '#c23b2b'
    : (themeId === 'bluenote' ? '#3888e8'
    : (themeId === 'djent' ? '#34f599'
    : (themeId === 'brazilian' ? '#0e7c5d'
    : (themeId === 'experimental' ? '#1e4fd6' : '#4cc9b0'))))));

  return `
    <svg class="footer-ornament-svg" viewBox="0 0 920 22" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <line x1="60" y1="11" x2="424" y2="11" stroke="${col}" stroke-opacity="0.38" stroke-width="1"/>
      <line x1="496" y1="11" x2="860" y2="11" stroke="${col}" stroke-opacity="0.38" stroke-width="1"/>
      <g transform="translate(460,11)" fill="none">
        <polygon points="-24,0 -12,-5 0,0 -12,5" stroke="${col}" stroke-opacity="0.65" stroke-width="1"/>
        <polygon points="24,0 12,-5 0,0 12,5" stroke="${col}" stroke-opacity="0.65" stroke-width="1"/>
        <polygon points="0,-8 8,0 0,8 -8,0" fill="${sec}" fill-opacity="0.24" stroke="${col}" stroke-width="1.2"/>
        <circle r="2.3" fill="${col}"/>
      </g>
    </svg>
  `;
}

/**
 * Intricate 54x54 Corner Filigree Finial injected into all 4 corners of primary panels!
 * Top-left is drawn natively; CSS mirrors it cleanly to TR, BL, and BR.
 */
export function getThemeCornerFiligreeSvg(themeId) {
  if (themeId === 'shoegaze') {
    return `
      <svg viewBox="0 0 54 54" aria-hidden="true">
        <path d="M3 44 Q 4 12, 14 7 Q 22 3, 44 3" fill="none" stroke="#f472b6" stroke-width="1.6" stroke-linecap="round"/>
        <path d="M9 36 Q 10 17, 18 12 Q 24 9, 36 9" fill="none" stroke="#93c5fd" stroke-opacity="0.75" stroke-width="1.2" stroke-linecap="round"/>
        <path d="M15 28 Q 16 20, 20 17 Q 23 15, 28 15" fill="none" stroke="#e879f9" stroke-opacity="0.6" stroke-width="1"/>
        <circle cx="9" cy="9" r="2.6" fill="#f472b6"/>
        <circle cx="9" cy="9" r="5.2" fill="none" stroke="#93c5fd" stroke-opacity="0.45" stroke-width="0.9"/>
      </svg>
    `;
  }

  if (themeId === 'kintsugi') {
    return `
      <svg viewBox="0 0 54 54" aria-hidden="true">
        <path d="M2 44 L2 2 L44 2" fill="none" stroke="#221e1a" stroke-width="1.6"/>
        <path d="M8 34 L8 8 L34 8" fill="none" stroke="#b88424" stroke-width="1.1"/>
        <path d="M2 22 L14 14 L22 2" fill="none" stroke="#d49e32" stroke-width="1.5"/>
        <line x1="8" y1="8" x2="20" y2="20" stroke="#3f6d52" stroke-opacity="0.55" stroke-width="0.9"/>
        <rect x="4.5" y="4.5" width="5.5" height="5.5" rx="0.8" fill="#c23b2b"/>
      </svg>
    `;
  }

  if (themeId === 'bluenote') {
    return `
      <svg viewBox="0 0 54 54" aria-hidden="true">
        <path d="M2 46 L2 2 L46 2" fill="none" stroke="#3888e8" stroke-width="3"/>
        <path d="M8 30 L8 8 L30 8" fill="none" stroke="#e8a845" stroke-width="1.4"/>
        <rect x="12" y="12" width="7" height="7" fill="#f05528"/>
      </svg>
    `;
  }

  if (themeId === 'rock70s') {
    // Vintage Engraved Brass Amp Corner Plate + Rivet Stud + Sunburst Flourish
    return `
      <svg viewBox="0 0 54 54" aria-hidden="true">
        <path d="M2 46 L2 14 Q 2 2, 14 2 L46 2" fill="none" stroke="#e5b864" stroke-width="2.2" stroke-linecap="round"/>
        <path d="M7 38 L7 16 Q 7 7, 16 7 L38 7" fill="none" stroke="#f27729" stroke-width="1" stroke-opacity="0.72"/>
        <path d="M12 24 C 12 15, 15 12, 24 12" fill="none" stroke="#f7cc54" stroke-width="1.1"/>
        <circle cx="11" cy="11" r="4.2" fill="#2b190e" stroke="#f7cc54" stroke-width="1.3"/>
        <line x1="8.5" y1="8.5" x2="13.5" y2="13.5" stroke="#e5b864" stroke-width="1.1"/>
      </svg>
    `;
  }

  if (themeId === 'doom') {
    // Gothic Pointed Trefoil & Filigree Altar Corner Bracket
    return `
      <svg viewBox="0 0 54 54" aria-hidden="true">
        <path d="M2 50 L2 2 L50 2" fill="none" stroke="#dba342" stroke-width="1.8"/>
        <path d="M7 38 L7 7 L38 7" fill="none" stroke="#b880ff" stroke-width="0.95" stroke-opacity="0.65"/>
        <polygon points="2,2 14,2 7,7 2,14" fill="#dba342" fill-opacity="0.42"/>
        <path d="M12 24 Q 12 12, 24 12" fill="none" stroke="#dba342" stroke-width="1.1"/>
        <polygon points="15,15 20,12 18,18 12,20" fill="#e33648" fill-opacity="0.85"/>
        <circle cx="34" cy="7" r="1.8" fill="#dba342"/>
        <circle cx="7" cy="34" r="1.8" fill="#dba342"/>
      </svg>
    `;
  }

  if (themeId === 'djent') {
    // Precision CNC Chamfered Circuit Trace Corner + Micro LED Nodes
    return `
      <svg viewBox="0 0 54 54" aria-hidden="true">
        <path d="M2 46 L2 14 L14 2 L46 2" fill="none" stroke="#00e5ff" stroke-width="2"/>
        <path d="M7 36 L7 17 L17 7 L36 7" fill="none" stroke="#34f599" stroke-width="1" stroke-opacity="0.72"/>
        <line x1="17" y1="7" x2="23" y2="13" stroke="#00e5ff" stroke-width="1"/>
        <circle cx="24" cy="14" r="2.2" fill="#00e5ff"/>
        <circle cx="42" cy="2" r="2" fill="#34f599"/>
        <circle cx="2" cy="42" r="2" fill="#34f599"/>
      </svg>
    `;
  }

  if (themeId === 'experimental') {
    // Fluxus / Editorial Printmaker Crop Marks & Registration Crosshair
    return `
      <svg viewBox="0 0 54 54" aria-hidden="true">
        <path d="M2 28 L2 2 L28 2" fill="none" stroke="#141414" stroke-width="2"/>
        <circle cx="13" cy="13" r="4.5" fill="none" stroke="#dc3826" stroke-width="1.2"/>
        <line x1="7" y1="13" x2="19" y2="13" stroke="#141414" stroke-width="0.9"/>
        <line x1="13" y1="7" x2="13" y2="19" stroke="#141414" stroke-width="0.9"/>
      </svg>
    `;
  }

  if (themeId === 'brazilian') {
    // Armorial Woodcut & Baroque Azulejo Ceramic Corner Scroll
    return `
      <svg viewBox="0 0 54 54" aria-hidden="true">
        <path d="M3 46 C 3 16, 16 3, 46 3" fill="none" stroke="#c84b26" stroke-width="2.2" stroke-linecap="round"/>
        <path d="M9 38 C 9 18, 18 9, 38 9" fill="none" stroke="#0e7c5d" stroke-width="1.3" stroke-linecap="round"/>
        <polygon points="15,15 22,12 19,19 12,22" fill="#d68a12"/>
        <circle cx="15" cy="15" r="2.2" fill="#fffbf2"/>
        <circle cx="34" cy="9" r="2" fill="#c84b26"/>
        <circle cx="9" cy="34" r="2" fill="#c84b26"/>
      </svg>
    `;
  }

  // Layl & Nahar: Intricate Oud Visualizer Andalusian Arabesque Corner Filigree!
  const isLight = themeId === 'nahar';
  const gold = isLight ? '#b85c1b' : '#e8b35a';
  const teal = isLight ? '#1d7a68' : '#4cc9b0';
  return `
    <svg viewBox="0 0 54 54" aria-hidden="true">
      <path d="M3 48 L3 14 Q 3 3, 14 3 L48 3" fill="none" stroke="${gold}" stroke-width="1.6"/>
      <path d="M8 40 L8 16 Q 8 8, 16 8 L40 8" fill="none" stroke="${teal}" stroke-width="0.95" stroke-opacity="0.72"/>
      <!-- Arabesque corner vine scroll -->
      <path d="M13 30 C 13 18, 18 13, 30 13" fill="none" stroke="${gold}" stroke-width="1.1" stroke-opacity="0.85"/>
      <g transform="translate(14,14)" fill="none">
        <rect x="-4.5" y="-4.5" width="9" height="9" stroke="${gold}" stroke-width="1"/>
        <rect x="-4.5" y="-4.5" width="9" height="9" transform="rotate(45)" stroke="${teal}" stroke-width="1"/>
        <circle r="1.7" fill="${gold}"/>
      </g>
      <circle cx="36" cy="8" r="1.6" fill="${gold}"/>
      <circle cx="8" cy="36" r="1.6" fill="${gold}"/>
    </svg>
  `;
}

/**
 * Ornate Center Stage Cartouche Crest perched at the top border of the Fretboard Stage
 */
export function getThemePanelCrownSvg(themeId) {
  const isLight = themeId === 'nahar' || themeId === 'experimental' || themeId === 'brazilian' || themeId === 'kintsugi';
  const col = themeId === 'djent'
    ? '#00e5ff'
    : (themeId === 'shoegaze' ? '#f472b6'
    : (themeId === 'kintsugi' ? '#b88424'
    : (themeId === 'bluenote' ? '#e8a845'
    : (themeId === 'brazilian' ? '#c84b26'
    : (themeId === 'experimental' ? '#141414'
    : (themeId === 'rock70s' ? '#f7cc54'
    : (isLight ? '#b85c1b' : '#e8b35a')))))));
  const sec = themeId === 'doom'
    ? '#b880ff'
    : (themeId === 'shoegaze' ? '#93c5fd'
    : (themeId === 'kintsugi' ? '#c23b2b'
    : (themeId === 'bluenote' ? '#3888e8'
    : (themeId === 'djent' ? '#34f599'
    : (themeId === 'brazilian' ? '#0e7c5d'
    : (themeId === 'rock70s' ? '#f27729'
    : (themeId === 'experimental' ? '#dc3826' : '#4cc9b0')))))));
  const bg = themeId === 'nahar'
    ? '#faf5ea'
    : (themeId === 'kintsugi' ? '#faf7f0'
    : (themeId === 'shoegaze' ? '#140d23'
    : (themeId === 'bluenote' ? '#0e1726'
    : (themeId === 'experimental' ? '#fbf9f3'
    : (themeId === 'brazilian' ? '#fffbf2'
    : (themeId === 'rock70s' ? '#241811'
    : (themeId === 'doom' ? '#100c15'
    : (themeId === 'djent' ? '#0a101a' : '#111724'))))))));

  return `
    <svg viewBox="0 0 180 24" aria-hidden="true">
      <path d="M8 12 Q 46 2, 90 12 Q 134 2, 172 12 Q 134 22, 90 12 Q 46 22, 8 12 Z" fill="${bg}" stroke="${col}" stroke-width="1.2"/>
      <polygon points="90,3 101,12 90,21 79,12" fill="${bg}" stroke="${col}" stroke-width="1.3"/>
      <polygon points="90,6 96,12 90,18 84,12" fill="${sec}" fill-opacity="0.35" stroke="${sec}" stroke-width="1"/>
      <circle cx="90" cy="12" r="2.4" fill="${col}"/>
      <circle cx="48" cy="12" r="1.8" fill="${sec}"/>
      <circle cx="132" cy="12" r="1.8" fill="${sec}"/>
    </svg>
  `;
}

/**
 * Full-Viewport Flowing Artistic Tapestry Backdrop
 */
export function getThemeBackdropWatermarkSvg(themeId) {
  if (themeId === 'shoegaze') {
    return `
      <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <radialGradient id="bgShoeGlowA" cx="25%" cy="22%" r="48%">
            <stop offset="0%" stop-color="#f472b6" stop-opacity="0.16"/>
            <stop offset="100%" stop-color="#0b0714" stop-opacity="0"/>
          </radialGradient>
          <radialGradient id="bgShoeGlowB" cx="78%" cy="72%" r="46%">
            <stop offset="0%" stop-color="#93c5fd" stop-opacity="0.15"/>
            <stop offset="100%" stop-color="#0b0714" stop-opacity="0"/>
          </radialGradient>
        </defs>
        <rect width="1440" height="900" fill="url(#bgShoeGlowA)"/>
        <rect width="1440" height="900" fill="url(#bgShoeGlowB)"/>
        <g fill="none" stroke="#f472b6" stroke-opacity="0.11" stroke-width="1.4">
          <circle cx="240" cy="220" r="140"/>
          <circle cx="240" cy="220" r="240"/>
          <circle cx="240" cy="220" r="350" stroke-dasharray="10 8"/>
        </g>
        <g fill="none" stroke="#93c5fd" stroke-opacity="0.1" stroke-width="1.4">
          <path d="M-80 620 Q 320 440, 720 610 T 1520 580"/>
          <path d="M-80 680 Q 340 500, 740 670 T 1520 640"/>
          <path d="M-80 740 Q 360 560, 760 730 T 1520 700"/>
        </g>
      </svg>
    `;
  }

  if (themeId === 'kintsugi') {
    return `
      <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <g fill="none">
          <path d="M1140 160 A 240 240 0 1 0 1220 460" stroke="#221e1a" stroke-opacity="0.065" stroke-width="26" stroke-linecap="round"/>
          <path d="M0 740 L260 620 L420 660 L640 520 L820 560 L1080 390 L1240 430 L1440 280" stroke="#c89228" stroke-opacity="0.22" stroke-width="2.2"/>
          <path d="M420 660 L510 780 L610 900" stroke="#c89228" stroke-opacity="0.16" stroke-width="1.5"/>
          <path d="M820 560 L920 690 L1060 740" stroke="#c89228" stroke-opacity="0.15" stroke-width="1.4"/>
          <path d="M260 620 L190 480 L250 320" stroke="#3f6d52" stroke-opacity="0.09" stroke-width="1.2"/>
        </g>
      </svg>
    `;
  }

  if (themeId === 'bluenote') {
    return `
      <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <g fill="none">
          <circle cx="1220" cy="460" r="390" stroke="#3888e8" stroke-opacity="0.12" stroke-width="2"/>
          <circle cx="1220" cy="460" r="340" stroke="#f5efe1" stroke-opacity="0.06" stroke-width="1"/>
          <circle cx="1220" cy="460" r="290" stroke="#3888e8" stroke-opacity="0.1" stroke-width="1.2"/>
          <circle cx="1220" cy="460" r="240" stroke="#e8a845" stroke-opacity="0.1" stroke-width="1.2"/>
          <circle cx="1220" cy="460" r="145" fill="#3888e8" fill-opacity="0.05" stroke="#e8a845" stroke-opacity="0.16" stroke-width="1.4"/>
        </g>
        <rect x="64" y="0" width="6" height="900" fill="#3888e8" fill-opacity="0.12"/>
        <rect x="82" y="0" width="2" height="900" fill="#e8a845" fill-opacity="0.1"/>
        <rect x="0" y="760" width="520" height="4" fill="#f05528" fill-opacity="0.12"/>
      </svg>
    `;
  }

  if (themeId === 'rock70s') {
    return `
      <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <linearGradient id="bg70s" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#f27729" stop-opacity="0.2"/>
            <stop offset="50%" stop-color="#f7cc54" stop-opacity="0.11"/>
            <stop offset="100%" stop-color="#6eb881" stop-opacity="0.07"/>
          </linearGradient>
        </defs>
        <path d="M-80 260 C 280 40, 560 440, 960 190 C 1200 40, 1360 180, 1520 120 L 1520 260 C 1320 340, 1140 160, 920 300 C 520 550, 240 180, -80 390 Z" fill="url(#bg70s)"/>
        <path d="M-60 660 C 340 480, 740 840, 1180 560 C 1340 460, 1440 520, 1520 490" fill="none" stroke="#f27729" stroke-opacity="0.16" stroke-width="3.2"/>
        <g transform="translate(1240,190)" fill="none" stroke="#f7cc54">
          <circle r="260" stroke-width="1.3" stroke-opacity="0.16"/>
          <circle r="220" stroke-width="0.9" stroke-opacity="0.12"/>
          <circle r="180" stroke-width="0.9" stroke-opacity="0.11"/>
          <circle r="140" stroke-width="0.9" stroke-opacity="0.1"/>
          <circle r="76" stroke="#f27729" stroke-width="2.2" stroke-opacity="0.22"/>
        </g>
      </svg>
    `;
  }

  if (themeId === 'doom') {
    return `
      <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <g fill="none" stroke="#dba342">
          <path d="M100 900 L100 370 Q 100 100, 720 20 Q 1340 100, 1340 370 L1340 900" stroke-opacity="0.14" stroke-width="2"/>
          <path d="M160 900 L160 395 Q 160 165, 720 80 Q 1280 165, 1280 395 L1280 900" stroke="#b880ff" stroke-opacity="0.11" stroke-width="1.3" stroke-dasharray="6 8"/>
          <g transform="translate(720,250)">
            <circle r="210" stroke-opacity="0.16" stroke-width="1.4"/>
            <circle r="172" stroke="#b880ff" stroke-opacity="0.13" stroke-width="1.1" stroke-dasharray="5 6"/>
            <polygon points="0,-200 173,100 -173,100" stroke-opacity="0.14" stroke-width="1.2"/>
            <polygon points="0,200 173,-100 -173,-100" stroke="#b880ff" stroke-opacity="0.12" stroke-width="1.2"/>
            <line x1="0" y1="-240" x2="0" y2="240" stroke-opacity="0.14" stroke-width="1"/>
          </g>
        </g>
      </svg>
    `;
  }

  if (themeId === 'djent') {
    return `
      <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <g fill="none" stroke="#00e5ff">
          <polygon points="1220,20 1410,130 1410,350 1220,460 1030,350 1030,130" stroke-opacity="0.18" stroke-width="1.5"/>
          <polygon points="1220,85 1354,162 1354,318 1220,395 1086,318 1086,162" stroke="#34f599" stroke-opacity="0.15" stroke-width="1.2"/>
          <polygon points="140,560 280,640 280,800 140,880 0,800 0,640" stroke-opacity="0.13" stroke-width="1.3"/>
          <path d="M-40 520 L380 520 L460 440 L1020 440 L1100 520 L1480 520" stroke-opacity="0.14" stroke-width="1.3"/>
          <path d="M-40 546 L390 546 L470 466 L1010 466 L1090 546 L1480 546" stroke="#34f599" stroke-opacity="0.1" stroke-width="1"/>
        </g>
      </svg>
    `;
  }

  if (themeId === 'experimental') {
    return `
      <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <g fill="none">
          <path d="M-40 680 C 310 140, 740 820, 1480 180" stroke="#1e4fd6" stroke-opacity="0.14" stroke-width="2.2"/>
          <path d="M-40 260 C 420 560, 880 60, 1480 540" stroke="#dc3826" stroke-opacity="0.13" stroke-width="1.7" stroke-dasharray="10 8"/>
          <circle cx="1180" cy="240" r="190" stroke="#141414" stroke-opacity="0.09" stroke-width="1.3"/>
          <line x1="920" y1="240" x2="1440" y2="240" stroke="#141414" stroke-opacity="0.08" stroke-width="1"/>
          <line x1="1180" y1="10" x2="1180" y2="470" stroke="#141414" stroke-opacity="0.08" stroke-width="1"/>
        </g>
      </svg>
    `;
  }

  if (themeId === 'brazilian') {
    return `
      <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <linearGradient id="brWave" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#d68a12" stop-opacity="0.16"/>
            <stop offset="50%" stop-color="#0e7c5d" stop-opacity="0.13"/>
            <stop offset="100%" stop-color="#c84b26" stop-opacity="0.1"/>
          </linearGradient>
        </defs>
        <path d="M-80 760 C 260 520, 620 880, 1040 580 C 1240 440, 1380 540, 1520 460 L 1520 920 L -80 920 Z" fill="url(#brWave)"/>
        <path d="M-60 220 Q 340 -40, 740 160 T 1500 120" fill="none" stroke="#c84b26" stroke-opacity="0.16" stroke-width="2.6"/>
        <g transform="translate(1240,180)" fill="none">
          <circle r="210" stroke="#d68a12" stroke-opacity="0.18" stroke-width="1.5"/>
          <circle r="158" stroke="#0e7c5d" stroke-opacity="0.16" stroke-width="1.3" stroke-dasharray="10 7"/>
          <polygon points="0,-195 28,-28 195,0 28,28 0,195 -28,28 -195,0 -28,-28" stroke="#c84b26" stroke-opacity="0.16" stroke-width="1.5"/>
        </g>
      </svg>
    `;
  }

  // Layl & Nahar: Lush Andalusian Mashrabiya / Oud Shamsa Celestial Astrolabe Tapestry
  const col = themeId === 'nahar' ? '#b85c1b' : '#e8b35a';
  const sec = themeId === 'nahar' ? '#1d7a68' : '#4cc9b0';
  return `
    <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <pattern id="oudTess" width="96" height="96" patternUnits="userSpaceOnUse">
          <g fill="none" stroke="${col}" stroke-opacity="0.065" stroke-width="0.9">
            <rect x="24" y="24" width="48" height="48"/>
            <rect x="24" y="24" width="48" height="48" transform="rotate(45 48 48)"/>
            <circle cx="48" cy="48" r="14" stroke="${sec}" stroke-opacity="0.06"/>
          </g>
        </pattern>
      </defs>
      <rect width="1440" height="900" fill="url(#oudTess)"/>
      <g fill="none">
        <circle cx="1220" cy="180" r="350" stroke="${col}" stroke-opacity="0.14" stroke-width="1.3"/>
        <circle cx="1220" cy="180" r="285" stroke="${sec}" stroke-opacity="0.12" stroke-width="1.1" stroke-dasharray="5 7"/>
        <circle cx="1220" cy="180" r="215" stroke="${col}" stroke-opacity="0.15" stroke-width="1.2"/>
        <circle cx="200" cy="760" r="310" stroke="${sec}" stroke-opacity="0.11" stroke-width="1.3"/>
        <path d="M-40 420 Q 720 120, 1480 460" stroke="${col}" stroke-opacity="0.11" stroke-width="1.3"/>
        <g transform="translate(1220,180)">
          <rect x="-130" y="-130" width="260" height="260" stroke="${col}" stroke-opacity="0.13" stroke-width="1.1"/>
          <rect x="-130" y="-130" width="260" height="260" transform="rotate(30)" stroke="${sec}" stroke-opacity="0.11" stroke-width="1.1"/>
          <rect x="-130" y="-130" width="260" height="260" transform="rotate(60)" stroke="${col}" stroke-opacity="0.11" stroke-width="1.1"/>
        </g>
      </g>
    </svg>
  `;
}
