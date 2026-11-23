/**
 * Bespoke Inline SVG Artwork & Architectural Watermarks for Each Musical Aesthetic
 * Zero external image requests — crisp vector rendering at any DPI, themed via CSS variables.
 */

export function getThemeHeaderBannerSvg(themeId) {
  if (themeId === 'rock70s') {
    // 70s Analog: Vinyl LP Disc + Vacuum Tube Glow + Vintage Analog VU Meter Arc
    return `
      <svg class="ornament-art-svg" viewBox="0 0 920 34" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        <defs>
          <linearGradient id="ornBrass" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="#6b4b1e" stop-opacity="0"/>
            <stop offset="18%" stop-color="#e8bd68"/>
            <stop offset="50%" stop-color="#fff0c4"/>
            <stop offset="82%" stop-color="#e8bd68"/>
            <stop offset="100%" stop-color="#6b4b1e" stop-opacity="0"/>
          </linearGradient>
          <radialGradient id="ornTubeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#ff9b42" stop-opacity="0.9"/>
            <stop offset="60%" stop-color="#f05a1a" stop-opacity="0.35"/>
            <stop offset="100%" stop-color="#f05a1a" stop-opacity="0"/>
          </radialGradient>
        </defs>
        <line x1="20" y1="17" x2="360" y2="17" stroke="url(#ornBrass)" stroke-width="1.4"/>
        <line x1="560" y1="17" x2="900" y2="17" stroke="url(#ornBrass)" stroke-width="1.4"/>
        <!-- Left Vinyl Groove Disc -->
        <g transform="translate(392,17)">
          <circle r="12" fill="#18100a" stroke="#d9a852" stroke-width="1.1"/>
          <circle r="9" fill="none" stroke="#a67c37" stroke-width="0.6" stroke-opacity="0.65"/>
          <circle r="6.2" fill="none" stroke="#a67c37" stroke-width="0.6" stroke-opacity="0.55"/>
          <circle r="3.4" fill="#f07428"/>
          <circle r="1.1" fill="#18100a"/>
        </g>
        <!-- Center Analog VU Meter Arc + Tube Glow -->
        <g transform="translate(460,17)">
          <ellipse cx="0" cy="0" rx="44" ry="15" fill="url(#ornTubeGlow)"/>
          <path d="M-26 6 A 28 28 0 0 1 26 6" fill="none" stroke="#f6e0ae" stroke-width="1.3"/>
          <path d="M12 -4 A 28 28 0 0 1 26 6" fill="none" stroke="#e04332" stroke-width="2"/>
          <line x1="0" y1="9" x2="9" y2="-7" stroke="#fff0c4" stroke-width="1.4" stroke-linecap="round"/>
          <circle cx="0" cy="9" r="2.2" fill="#d9a852"/>
        </g>
        <!-- Right Dual Vacuum Tube Filament Emblem -->
        <g transform="translate(528,17)">
          <rect x="-8" y="-11" width="16" height="22" rx="8" fill="#23140c" stroke="#e5b864" stroke-width="1"/>
          <path d="M-3 5 L-3 -3 L0 -6 L3 -3 L3 5" fill="none" stroke="#ff9d42" stroke-width="1.4"/>
          <line x1="-5" y1="7" x2="5" y2="7" stroke="#c89844" stroke-width="1.2"/>
        </g>
      </svg>
    `;
  }

  if (themeId === 'doom') {
    // Doom Ritual: Lunar Eclipse Phases & Monolithic Altar Sigil
    return `
      <svg class="ornament-art-svg" viewBox="0 0 920 34" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        <defs>
          <linearGradient id="ornDoomLine" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="#d9a13f" stop-opacity="0"/>
            <stop offset="25%" stop-color="#d9a13f" stop-opacity="0.65"/>
            <stop offset="50%" stop-color="#b57dff" stop-opacity="0.8"/>
            <stop offset="75%" stop-color="#d9a13f" stop-opacity="0.65"/>
            <stop offset="100%" stop-color="#d9a13f" stop-opacity="0"/>
          </linearGradient>
        </defs>
        <line x1="30" y1="17" x2="345" y2="17" stroke="url(#ornDoomLine)" stroke-width="1"/>
        <line x1="575" y1="17" x2="890" y2="17" stroke="url(#ornDoomLine)" stroke-width="1"/>
        <!-- Moon Phases -->
        <g transform="translate(460,17)" stroke="#d9a13f" fill="none" stroke-width="1.1">
          <!-- Far Left Waxing Crescent -->
          <path d="M-86 -7 A 7 7 0 1 0 -86 7 A 5 7 0 1 1 -86 -7 Z" fill="#d9a13f" fill-opacity="0.55" stroke="none"/>
          <!-- Inner Left Half Moon -->
          <circle cx="-46" cy="0" r="7.5" stroke-opacity="0.7"/>
          <path d="M-46 -7.5 A 7.5 7.5 0 0 0 -46 7.5 Z" fill="#d9a13f" fill-opacity="0.7" stroke="none"/>
          <!-- Center Obsidian Eclipse + Gothic Diamond Sigil -->
          <circle cx="0" cy="0" r="13.5" stroke="#b57dff" stroke-opacity="0.5" stroke-dasharray="2 2"/>
          <circle cx="0" cy="0" r="9.5" fill="#08060c" stroke="#e3b659" stroke-width="1.4"/>
          <polygon points="0,-15 4.5,0 0,15 -4.5,0" fill="#d9a13f" fill-opacity="0.28" stroke="#e3b659" stroke-width="1"/>
          <circle cx="0" cy="0" r="2.2" fill="#e33648" stroke="none"/>
          <!-- Inner Right Half Moon -->
          <circle cx="46" cy="0" r="7.5" stroke-opacity="0.7"/>
          <path d="M46 -7.5 A 7.5 7.5 0 0 1 46 7.5 Z" fill="#d9a13f" fill-opacity="0.7" stroke="none"/>
          <!-- Far Right Waning Crescent -->
          <path d="M86 -7 A 7 7 0 1 1 86 7 A 5 7 0 1 0 86 -7 Z" fill="#d9a13f" fill-opacity="0.55" stroke="none"/>
        </g>
      </svg>
    `;
  }

  if (themeId === 'djent') {
    // Djent Poly: CNC Telemetry Waveform & Polymetric Pulse Matrix
    return `
      <svg class="ornament-art-svg" viewBox="0 0 920 34" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        <line x1="16" y1="17" x2="290" y2="17" stroke="#00e5ff" stroke-opacity="0.25" stroke-width="1"/>
        <line x1="630" y1="17" x2="904" y2="17" stroke="#00e5ff" stroke-opacity="0.25" stroke-width="1"/>
        <!-- Left Precision Step Ticks -->
        <g fill="#00e5ff">
          <rect x="24" y="14" width="18" height="6" rx="1" fill-opacity="0.85"/>
          <rect x="46" y="15" width="6" height="4" rx="1" fill-opacity="0.45"/>
          <rect x="56" y="15" width="6" height="4" rx="1" fill-opacity="0.45"/>
          <rect x="66" y="14" width="12" height="6" rx="1" fill="#34f599" fill-opacity="0.85"/>
        </g>
        <!-- Center Polymetric Oscilloscope Waveform -->
        <polyline
          points="300,17 324,17 334,7 346,27 360,5 374,29 388,11 400,23 414,17 444,17 456,6 468,28 480,9 492,25 504,17 534,17 546,8 560,26 574,10 586,24 598,17 620,17"
          fill="none" stroke="#00e5ff" stroke-width="1.5" stroke-linejoin="bevel"
        />
        <polyline
          points="300,17 336,17 348,11 362,23 376,17 440,17 456,10 472,24 488,17 540,17 556,11 572,23 588,17 620,17"
          fill="none" stroke="#34f599" stroke-width="1" stroke-opacity="0.7"
        />
        <!-- Right CNC Telemetry Label -->
        <text x="896" y="20" text-anchor="end" fill="#00e5ff" font-size="9.5" font-weight="700" letter-spacing="2" font-family="var(--font-mono, monospace)">24-TET // POLY-CNC</text>
      </svg>
    `;
  }

  if (themeId === 'experimental') {
    // Avant / Experimental: John Cage / Fontana Mix Graphic Score Fragment
    return `
      <svg class="ornament-art-svg" viewBox="0 0 920 34" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        <line x1="12" y1="8" x2="908" y2="8" stroke="#141414" stroke-width="1.4"/>
        <line x1="12" y1="26" x2="908" y2="26" stroke="#141414" stroke-width="0.9"/>
        <!-- Graphic score sweeping arcs, points & Bauhaus vectors -->
        <path d="M120 26 Q 230 2, 340 20 T 560 11 T 780 24" fill="none" stroke="#1e4fd6" stroke-width="1.5"/>
        <path d="M170 10 C 260 32, 380 4, 490 25 C 590 36, 680 6, 760 14" fill="none" stroke="#dc3826" stroke-width="1.3" stroke-dasharray="5 3"/>
        <circle cx="242" cy="13" r="4.5" fill="#dc3826"/>
        <polygon points="460,5 468,21 452,21" fill="none" stroke="#141414" stroke-width="1.5"/>
        <circle cx="460" cy="16" r="2.2" fill="#1e4fd6"/>
        <rect x="650" y="11" width="10" height="10" fill="#141414"/>
        <text x="18" y="21" fill="#141414" font-size="9.5" font-weight="700" font-family="var(--font-mono, monospace)">⊕ FIG. 01 · GRAPHIC SCORE</text>
        <text x="902" y="21" text-anchor="end" fill="#dc3826" font-size="9.5" font-weight="700" font-family="var(--font-mono, monospace)">24-TET // FLUXUS ⊕</text>
      </svg>
    `;
  }

  if (themeId === 'brazilian') {
    // Brasilidade · Tropicália: Armorial Xilogravura Sunburst & Bahian Azulejo Tile Frieze
    return `
      <svg class="ornament-art-svg" viewBox="0 0 920 34" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        <defs>
          <pattern id="azulejoTile" width="44" height="22" patternUnits="userSpaceOnUse">
            <rect width="44" height="22" fill="#2c150c"/>
            <polygon points="22,2 32,11 22,20 12,11" fill="#d68a12"/>
            <polygon points="22,5.5 27.5,11 22,16.5 16.5,11" fill="#0e7c5d"/>
            <polygon points="0,11 9,2 9,20" fill="#c84b26"/>
            <polygon points="44,11 35,2 35,20" fill="#c84b26"/>
            <circle cx="22" cy="11" r="2.2" fill="#fffbf2"/>
          </pattern>
        </defs>
        <rect x="14" y="6" width="892" height="22" rx="5" fill="url(#azulejoTile)" stroke="#c84b26" stroke-width="1.2"/>
        <!-- Center Armorial Sun Medallion -->
        <g transform="translate(460,17)">
          <circle r="15.5" fill="#fffbf2" stroke="#c84b26" stroke-width="1.6"/>
          <polygon points="0,-12 3,-3 12,0 3,3 0,12 -3,3 -12,0 -3,-3" fill="#d68a12" stroke="#8a3316" stroke-width="0.7"/>
          <circle r="3.4" fill="#0e7c5d"/>
        </g>
      </svg>
    `;
  }

  // Default: Layl & Nahar (Oud Visualizer Andalusian / Mashrabiya Rosette & Gold Filigree)
  const isLight = themeId === 'nahar';
  const mainStroke = isLight ? '#b87216' : '#e5a955';
  const secStroke = isLight ? '#1d8a75' : '#4cc9b0';
  return `
    <svg class="ornament-art-svg" viewBox="0 0 920 34" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <defs>
        <linearGradient id="ornOudLine" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="${mainStroke}" stop-opacity="0"/>
          <stop offset="28%" stop-color="${mainStroke}" stop-opacity="0.75"/>
          <stop offset="50%" stop-color="${secStroke}" stop-opacity="0.9"/>
          <stop offset="72%" stop-color="${mainStroke}" stop-opacity="0.75"/>
          <stop offset="100%" stop-color="${mainStroke}" stop-opacity="0"/>
        </linearGradient>
      </defs>
      <line x1="40" y1="17" x2="424" y2="17" stroke="url(#ornOudLine)" stroke-width="1.2"/>
      <line x1="496" y1="17" x2="880" y2="17" stroke="url(#ornOudLine)" stroke-width="1.2"/>
      <!-- 8-Pointed Andalusian / Oud Rosette Star (Rub el Hizb) -->
      <g transform="translate(460,17)" fill="none">
        <circle r="14" stroke="${mainStroke}" stroke-width="0.9" stroke-opacity="0.55" stroke-dasharray="2.5 2.5"/>
        <rect x="-8.5" y="-8.5" width="17" height="17" stroke="${mainStroke}" stroke-width="1.2"/>
        <rect x="-8.5" y="-8.5" width="17" height="17" transform="rotate(45)" stroke="${secStroke}" stroke-width="1.2"/>
        <circle r="3.2" fill="${mainStroke}"/>
      </g>
    </svg>
  `;
}

/**
 * Large, ultra-subtle architectural backdrop emblem rendered behind the top workspace
 * to lend unmistakable editorial & instrument-craft depth without hurting readability.
 */
export function getThemeBackdropWatermarkSvg(themeId) {
  if (themeId === 'rock70s') {
    return `
      <svg viewBox="0 0 420 420" aria-hidden="true">
        <g transform="translate(210,210)" fill="none" stroke="#f0a848">
          <circle r="190" stroke-width="1.4" stroke-opacity="0.22"/>
          <circle r="165" stroke-width="0.8" stroke-opacity="0.16"/>
          <circle r="140" stroke-width="0.8" stroke-opacity="0.14"/>
          <circle r="115" stroke-width="0.8" stroke-opacity="0.12"/>
          <circle r="90" stroke-width="1" stroke-opacity="0.16"/>
          <circle r="56" stroke="#f07428" stroke-width="2" stroke-opacity="0.28"/>
          <circle r="10" stroke-width="1.5" stroke-opacity="0.35"/>
        </g>
      </svg>
    `;
  }

  if (themeId === 'doom') {
    return `
      <svg viewBox="0 0 420 420" aria-hidden="true">
        <g transform="translate(210,210)" fill="none" stroke="#d9a13f">
          <circle r="182" stroke-width="1.2" stroke-opacity="0.2"/>
          <circle r="154" stroke="#b57dff" stroke-width="1" stroke-opacity="0.16" stroke-dasharray="6 6"/>
          <polygon points="0,-170 147,85 -147,85" stroke-width="1.2" stroke-opacity="0.16"/>
          <polygon points="0,170 147,-85 -147,-85" stroke="#b57dff" stroke-width="1.1" stroke-opacity="0.14"/>
          <line x1="0" y1="-195" x2="0" y2="195" stroke-width="0.9" stroke-opacity="0.18"/>
          <circle r="48" stroke-width="1.5" stroke-opacity="0.24"/>
        </g>
      </svg>
    `;
  }

  if (themeId === 'djent') {
    return `
      <svg viewBox="0 0 420 420" aria-hidden="true">
        <g transform="translate(210,210)" fill="none" stroke="#00e5ff">
          <polygon points="0,-185 160,-92 160,92 0,185 -160,92 -160,-92" stroke-width="1.2" stroke-opacity="0.2"/>
          <polygon points="0,-132 114,-66 114,66 0,132 -114,66 -114,-66" stroke="#34f599" stroke-width="1" stroke-opacity="0.16"/>
          <line x1="-195" y1="0" x2="195" y2="0" stroke-width="0.8" stroke-opacity="0.14"/>
          <line x1="0" y1="-195" x2="0" y2="195" stroke-width="0.8" stroke-opacity="0.14"/>
          <circle r="76" stroke-width="1" stroke-opacity="0.16" stroke-dasharray="4 4"/>
        </g>
      </svg>
    `;
  }

  if (themeId === 'experimental') {
    return `
      <svg viewBox="0 0 420 420" aria-hidden="true">
        <g fill="none">
          <circle cx="210" cy="210" r="165" stroke="#141414" stroke-width="1.2" stroke-opacity="0.12"/>
          <path d="M20 310 Q 150 40, 260 220 T 400 90" stroke="#1e4fd6" stroke-width="1.6" stroke-opacity="0.16"/>
          <line x1="30" y1="120" x2="390" y2="320" stroke="#dc3826" stroke-width="1.3" stroke-opacity="0.16"/>
          <rect x="130" y="130" width="160" height="160" stroke="#141414" stroke-width="1" stroke-opacity="0.1" stroke-dasharray="8 6"/>
        </g>
      </svg>
    `;
  }

  if (themeId === 'brazilian') {
    return `
      <svg viewBox="0 0 420 420" aria-hidden="true">
        <g transform="translate(210,210)" fill="none">
          <circle r="176" stroke="#c84b26" stroke-width="1.3" stroke-opacity="0.16"/>
          <circle r="134" stroke="#0e7c5d" stroke-width="1.2" stroke-opacity="0.16" stroke-dasharray="10 6"/>
          <polygon points="0,-168 28,-28 168,0 28,28 0,168 -28,28 -168,0 -28,-28" stroke="#d68a12" stroke-width="1.4" stroke-opacity="0.2"/>
          <polygon points="0,-120 20,-20 120,0 20,20 0,120 -20,20 -120,0 -20,-20" transform="rotate(45)" stroke="#0e7c5d" stroke-width="1.2" stroke-opacity="0.18"/>
          <circle r="32" stroke="#c84b26" stroke-width="1.5" stroke-opacity="0.22"/>
        </g>
      </svg>
    `;
  }

  // Layl & Nahar: 12-petal Oud Soundhole Rosette (Shamsa)
  const col = themeId === 'nahar' ? '#b87216' : '#e5a955';
  const sec = themeId === 'nahar' ? '#1d8a75' : '#4cc9b0';
  return `
    <svg viewBox="0 0 420 420" aria-hidden="true">
      <g transform="translate(210,210)" fill="none">
        <circle r="184" stroke="${col}" stroke-width="1.2" stroke-opacity="0.18"/>
        <circle r="168" stroke="${sec}" stroke-width="0.9" stroke-opacity="0.15" stroke-dasharray="4 4"/>
        <rect x="-112" y="-112" width="224" height="224" stroke="${col}" stroke-width="1.1" stroke-opacity="0.15"/>
        <rect x="-112" y="-112" width="224" height="224" transform="rotate(30)" stroke="${sec}" stroke-width="1" stroke-opacity="0.13"/>
        <rect x="-112" y="-112" width="224" height="224" transform="rotate(60)" stroke="${col}" stroke-width="1" stroke-opacity="0.13"/>
        <circle r="68" stroke="${col}" stroke-width="1.2" stroke-opacity="0.2"/>
      </g>
    </svg>
  `;
}
