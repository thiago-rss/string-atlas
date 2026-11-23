/**
 * Immersive Full-Viewport Vector Artworks & Emblem Banners per Musical World (v7.6)
 * Transforms the entire spatial atmosphere behind the workspace with fluid, non-generic forms.
 */

export function getThemeHeaderBannerSvg(themeId) {
  if (themeId === 'rock70s') {
    // 70s Analog: Psychedelic Ribbon Curves + Vinyl Disc + Analog VU Meter + Glowing Tube
    return `
      <svg class="ornament-art-svg" viewBox="0 0 960 38" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        <defs>
          <linearGradient id="orn70sWave" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="#f27729" stop-opacity="0"/>
            <stop offset="20%" stop-color="#f27729"/>
            <stop offset="50%" stop-color="#f7cc54"/>
            <stop offset="80%" stop-color="#6eb881"/>
            <stop offset="100%" stop-color="#6eb881" stop-opacity="0"/>
          </linearGradient>
          <radialGradient id="ornTubeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#ffaa48" stop-opacity="0.95"/>
            <stop offset="58%" stop-color="#f05a1a" stop-opacity="0.35"/>
            <stop offset="100%" stop-color="#f05a1a" stop-opacity="0"/>
          </radialGradient>
        </defs>
        <!-- Flowing 70s Fillmore poster double ribbon -->
        <path d="M16 24 C 130 4, 240 34, 376 19" fill="none" stroke="url(#orn70sWave)" stroke-width="2.4" stroke-linecap="round"/>
        <path d="M16 18 C 140 34, 250 4, 376 19" fill="none" stroke="#f7cc54" stroke-opacity="0.45" stroke-width="1.2"/>
        <path d="M584 19 C 710 4, 820 34, 944 16" fill="none" stroke="url(#orn70sWave)" stroke-width="2.4" stroke-linecap="round"/>
        <path d="M584 19 C 720 34, 830 4, 944 22" fill="none" stroke="#f7cc54" stroke-opacity="0.45" stroke-width="1.2"/>
        <!-- Vinyl Disc -->
        <g transform="translate(412,19)">
          <circle r="13" fill="#18100a" stroke="#e5b864" stroke-width="1.2"/>
          <circle r="9.5" fill="none" stroke="#b38840" stroke-width="0.65" stroke-opacity="0.7"/>
          <circle r="6.5" fill="none" stroke="#b38840" stroke-width="0.65" stroke-opacity="0.6"/>
          <circle r="3.8" fill="#f27729"/>
          <circle r="1.2" fill="#18100a"/>
        </g>
        <!-- Center Analog VU Meter + Tube Glow -->
        <g transform="translate(480,19)">
          <ellipse cx="0" cy="0" rx="46" ry="16" fill="url(#ornTubeGlow)"/>
          <path d="M-28 7 A 30 30 0 0 1 28 7" fill="none" stroke="#f9e6ba" stroke-width="1.5"/>
          <path d="M13 -4 A 30 30 0 0 1 28 7" fill="none" stroke="#e04332" stroke-width="2.4"/>
          <line x1="0" y1="10" x2="10" y2="-8" stroke="#fff3cc" stroke-width="1.6" stroke-linecap="round"/>
          <circle cx="0" cy="10" r="2.5" fill="#e5b864"/>
        </g>
        <!-- Vacuum Tube Filament -->
        <g transform="translate(548,19)">
          <rect x="-8.5" y="-12" width="17" height="24" rx="8.5" fill="#23140c" stroke="#e5b864" stroke-width="1.1"/>
          <path d="M-3.2 5 L-3.2 -3 L0 -6.5 L3.2 -3 L3.2 5" fill="none" stroke="#ff9d42" stroke-width="1.5"/>
          <line x1="-5" y1="8" x2="5" y2="8" stroke="#c89844" stroke-width="1.2"/>
        </g>
      </svg>
    `;
  }

  if (themeId === 'doom') {
    // Doom Ritual: Gothic Lancet Arches + Lunar Eclipse Cycle + Obsidian Monolith Sigil
    return `
      <svg class="ornament-art-svg" viewBox="0 0 960 38" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        <defs>
          <linearGradient id="ornDoomLine" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="#dba342" stop-opacity="0"/>
            <stop offset="25%" stop-color="#dba342" stop-opacity="0.72"/>
            <stop offset="50%" stop-color="#b880ff" stop-opacity="0.88"/>
            <stop offset="75%" stop-color="#dba342" stop-opacity="0.72"/>
            <stop offset="100%" stop-color="#dba342" stop-opacity="0"/>
          </linearGradient>
        </defs>
        <path d="M30 19 L342 19 M618 19 L930 19" stroke="url(#ornDoomLine)" stroke-width="1.1"/>
        <path d="M120 19 L142 12 L164 19 L142 26 Z M796 19 L818 12 L840 19 L818 26 Z" fill="none" stroke="#dba342" stroke-opacity="0.45" stroke-width="1"/>
        <g transform="translate(480,19)" stroke="#dba342" fill="none" stroke-width="1.1">
          <path d="M-94 -7.5 A 7.5 7.5 0 1 0 -94 7.5 A 5.2 7.5 0 1 1 -94 -7.5 Z" fill="#dba342" fill-opacity="0.6" stroke="none"/>
          <circle cx="-50" cy="0" r="8" stroke-opacity="0.75"/>
          <path d="M-50 -8 A 8 8 0 0 0 -50 8 Z" fill="#dba342" fill-opacity="0.72" stroke="none"/>
          <circle cx="0" cy="0" r="15.5" stroke="#b880ff" stroke-opacity="0.55" stroke-dasharray="2.5 2.5"/>
          <polygon points="0,-17 11,0 0,17 -11,0" fill="#09060e" stroke="#e6b85c" stroke-width="1.3"/>
          <polygon points="0,-10 5,0 0,10 -5,0" fill="#dba342" fill-opacity="0.28" stroke="#e6b85c" stroke-width="0.9"/>
          <circle cx="0" cy="0" r="2.6" fill="#e33648" stroke="none"/>
          <circle cx="50" cy="0" r="8" stroke-opacity="0.75"/>
          <path d="M50 -8 A 8 8 0 0 1 50 8 Z" fill="#dba342" fill-opacity="0.72" stroke="none"/>
          <path d="M94 -7.5 A 7.5 7.5 0 1 1 94 7.5 A 5.2 7.5 0 1 0 94 -7.5 Z" fill="#dba342" fill-opacity="0.6" stroke="none"/>
        </g>
      </svg>
    `;
  }

  if (themeId === 'djent') {
    // Djent Poly: Kinetic Polymetric Oscilloscope & Diagonal Polygon Chevrons
    return `
      <svg class="ornament-art-svg" viewBox="0 0 960 38" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        <path d="M16 19 L290 19 M670 19 L944 19" stroke="#00e5ff" stroke-opacity="0.28" stroke-width="1"/>
        <g fill="#00e5ff">
          <polygon points="20,14 44,14 38,24 14,24" fill-opacity="0.9"/>
          <polygon points="48,15 62,15 58,23 44,23" fill="#34f599" fill-opacity="0.8"/>
          <polygon points="66,16 76,16 73,22 63,22" fill-opacity="0.45"/>
        </g>
        <polyline
          points="300,19 326,19 338,7 352,31 368,4 384,34 400,12 414,26 428,19 462,19 476,6 490,32 504,9 518,29 532,19 566,19 580,8 594,30 610,11 624,27 638,19 662,19"
          fill="none" stroke="#00e5ff" stroke-width="1.6" stroke-linejoin="bevel"
        />
        <polyline
          points="300,19 342,19 356,11 372,27 388,19 458,19 476,11 494,27 512,19 574,19 592,12 610,26 628,19 662,19"
          fill="none" stroke="#34f599" stroke-width="1.1" stroke-opacity="0.75"
        />
        <text x="940" y="22" text-anchor="end" fill="#00e5ff" font-size="9.5" font-weight="700" letter-spacing="2.2" font-family="var(--font-mono, monospace)">24-TET // POLY-CNC</text>
      </svg>
    `;
  }

  if (themeId === 'experimental') {
    // Avant / Experimental: John Cage / Fontana Mix Graphic Score Ribbon
    return `
      <svg class="ornament-art-svg" viewBox="0 0 960 38" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        <line x1="12" y1="8" x2="948" y2="8" stroke="#141414" stroke-width="1.5"/>
        <line x1="12" y1="30" x2="948" y2="30" stroke="#141414" stroke-width="1"/>
        <path d="M130 30 Q 245 2, 360 22 T 590 11 T 820 26" fill="none" stroke="#1e4fd6" stroke-width="1.6"/>
        <path d="M185 10 C 280 35, 400 3, 515 27 C 620 38, 710 6, 795 15" fill="none" stroke="#dc3826" stroke-width="1.4" stroke-dasharray="5 3"/>
        <circle cx="255" cy="14" r="4.8" fill="#dc3826"/>
        <polygon points="480,6 489,23 471,23" fill="none" stroke="#141414" stroke-width="1.6"/>
        <circle cx="480" cy="18" r="2.3" fill="#1e4fd6"/>
        <rect x="680" y="12" width="11" height="11" fill="#141414"/>
        <text x="18" y="23" fill="#141414" font-size="9.5" font-weight="700" font-family="var(--font-mono, monospace)">⊕ FIG. 01 · GRAPHIC SCORE</text>
        <text x="942" y="23" text-anchor="end" fill="#dc3826" font-size="9.5" font-weight="700" font-family="var(--font-mono, monospace)">24-TET // FLUXUS ⊕</text>
      </svg>
    `;
  }

  if (themeId === 'brazilian') {
    // Brasilidade: Sweeping Copacabana / Niemeyer Fluid Waves + Armorial Sunburst Medallion
    return `
      <svg class="ornament-art-svg" viewBox="0 0 960 38" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        <!-- Flowing Copacabana/Niemeyer double waves -->
        <path d="M14 26 C 90 6, 170 36, 250 16 C 320 0, 385 32, 444 19" fill="none" stroke="#0e7c5d" stroke-width="3" stroke-linecap="round"/>
        <path d="M14 19 C 95 36, 175 6, 255 24 C 325 36, 390 8, 444 19" fill="none" stroke="#d68a12" stroke-width="1.8" stroke-linecap="round"/>
        <path d="M516 19 C 575 6, 640 36, 710 16 C 790 0, 870 34, 946 14" fill="none" stroke="#0e7c5d" stroke-width="3" stroke-linecap="round"/>
        <path d="M516 19 C 570 32, 635 4, 705 24 C 785 36, 865 6, 946 22" fill="none" stroke="#c84b26" stroke-width="1.8" stroke-linecap="round"/>
        <!-- Center Armorial Woodcut Sunburst Medallion -->
        <g transform="translate(480,19)">
          <circle r="16.5" fill="#fffbf2" stroke="#c84b26" stroke-width="1.8"/>
          <polygon points="0,-13.5 3.2,-3.2 13.5,0 3.2,3.2 0,13.5 -3.2,3.2 -13.5,0 -3.2,-3.2" fill="#d68a12" stroke="#8a3316" stroke-width="0.7"/>
          <circle r="3.6" fill="#0e7c5d"/>
        </g>
      </svg>
    `;
  }

  // Layl & Nahar: Andalusian / Oud Astrolabe Arc & 8-Pointed Rub el Hizb Rosette
  const isLight = themeId === 'nahar';
  const mainStroke = isLight ? '#b85c1b' : '#e5a955';
  const secStroke = isLight ? '#1d7a68' : '#4cc9b0';
  return `
    <svg class="ornament-art-svg" viewBox="0 0 960 38" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <defs>
        <linearGradient id="ornOudLine" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="${mainStroke}" stop-opacity="0"/>
          <stop offset="28%" stop-color="${mainStroke}" stop-opacity="0.75"/>
          <stop offset="50%" stop-color="${secStroke}" stop-opacity="0.9"/>
          <stop offset="72%" stop-color="${mainStroke}" stop-opacity="0.75"/>
          <stop offset="100%" stop-color="${mainStroke}" stop-opacity="0"/>
        </linearGradient>
      </defs>
      <path d="M40 19 Q 240 6, 442 19 M518 19 Q 720 32, 920 19" fill="none" stroke="url(#ornOudLine)" stroke-width="1.3"/>
      <line x1="80" y1="19" x2="442" y2="19" stroke="url(#ornOudLine)" stroke-width="0.9" stroke-opacity="0.55"/>
      <line x1="518" y1="19" x2="880" y2="19" stroke="url(#ornOudLine)" stroke-width="0.9" stroke-opacity="0.55"/>
      <g transform="translate(480,19)" fill="none">
        <circle r="15.5" stroke="${mainStroke}" stroke-width="0.9" stroke-opacity="0.6" stroke-dasharray="2.5 2.5"/>
        <rect x="-9.5" y="-9.5" width="19" height="19" stroke="${mainStroke}" stroke-width="1.25"/>
        <rect x="-9.5" y="-9.5" width="19" height="19" transform="rotate(45)" stroke="${secStroke}" stroke-width="1.25"/>
        <circle r="3.4" fill="${mainStroke}"/>
      </g>
    </svg>
  `;
}

/**
 * Full-Viewport Sweeping Artistic Backdrop Composition (sits behind the glass/sculpted workspace)
 */
export function getThemeBackdropWatermarkSvg(themeId) {
  if (themeId === 'rock70s') {
    // Flowing 1970s Psychedelic Liquid Ribbon Curves + Giant Vinyl Grooves
    return `
      <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <linearGradient id="bg70s" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#f27729" stop-opacity="0.16"/>
            <stop offset="50%" stop-color="#f7cc54" stop-opacity="0.09"/>
            <stop offset="100%" stop-color="#6eb881" stop-opacity="0.06"/>
          </linearGradient>
        </defs>
        <path d="M-80 260 C 280 40, 560 440, 960 190 C 1200 40, 1360 180, 1520 120 L 1520 260 C 1320 340, 1140 160, 920 300 C 520 550, 240 180, -80 390 Z" fill="url(#bg70s)"/>
        <path d="M-60 660 C 340 480, 740 840, 1180 560 C 1340 460, 1440 520, 1520 490" fill="none" stroke="#f27729" stroke-opacity="0.14" stroke-width="3"/>
        <g transform="translate(1240,190)" fill="none" stroke="#f7cc54">
          <circle r="240" stroke-width="1.2" stroke-opacity="0.14"/>
          <circle r="205" stroke-width="0.9" stroke-opacity="0.11"/>
          <circle r="170" stroke-width="0.9" stroke-opacity="0.1"/>
          <circle r="135" stroke-width="0.9" stroke-opacity="0.09"/>
          <circle r="72" stroke="#f27729" stroke-width="2" stroke-opacity="0.18"/>
        </g>
      </svg>
    `;
  }

  if (themeId === 'doom') {
    // Cathedral Lancet Arch Silhouette + Celestial Occult Geometry
    return `
      <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <g fill="none" stroke="#dba342">
          <!-- Pointed Cathedral Arch framing the viewport -->
          <path d="M120 900 L120 380 Q 120 120, 720 30 Q 1320 120, 1320 380 L1320 900" stroke-opacity="0.1" stroke-width="1.8"/>
          <path d="M170 900 L170 400 Q 170 175, 720 88 Q 1270 175, 1270 400 L1270 900" stroke="#b880ff" stroke-opacity="0.08" stroke-width="1.2" stroke-dasharray="6 8"/>
          <!-- Giant Eclipse Rose Window -->
          <g transform="translate(720,250)">
            <circle r="190" stroke-opacity="0.14" stroke-width="1.3"/>
            <circle r="158" stroke="#b880ff" stroke-opacity="0.11" stroke-width="1" stroke-dasharray="5 6"/>
            <polygon points="0,-185 160,92 -160,92" stroke-opacity="0.12" stroke-width="1.1"/>
            <polygon points="0,185 160,-92 -160,-92" stroke="#b880ff" stroke-opacity="0.1" stroke-width="1.1"/>
            <line x1="0" y1="-220" x2="0" y2="220" stroke-opacity="0.12" stroke-width="1"/>
          </g>
        </g>
      </svg>
    `;
  }

  if (themeId === 'djent') {
    // Isometric Polygonal Architecture + Kinetic Vector Horizon
    return `
      <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <g fill="none" stroke="#00e5ff">
          <polygon points="1220,30 1400,134 1400,342 1220,446 1040,342 1040,134" stroke-opacity="0.16" stroke-width="1.4"/>
          <polygon points="1220,90 1348,164 1348,312 1220,386 1092,312 1092,164" stroke="#34f599" stroke-opacity="0.13" stroke-width="1.1"/>
          <polygon points="140,560 280,640 280,800 140,880 0,800 0,640" stroke-opacity="0.11" stroke-width="1.2"/>
          <path d="M-40 520 L380 520 L460 440 L1020 440 L1100 520 L1480 520" stroke-opacity="0.12" stroke-width="1.2"/>
          <path d="M-40 544 L390 544 L470 464 L1010 464 L1090 544 L1480 544" stroke="#34f599" stroke-opacity="0.08" stroke-width="0.9"/>
        </g>
      </svg>
    `;
  }

  if (themeId === 'experimental') {
    // Large-Scale Graphic Score Composition (Sweeping Gestural Arcs & Geometric Coordinates)
    return `
      <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <g fill="none">
          <path d="M-40 680 C 310 140, 740 820, 1480 180" stroke="#1e4fd6" stroke-opacity="0.13" stroke-width="2"/>
          <path d="M-40 260 C 420 560, 880 60, 1480 540" stroke="#dc3826" stroke-opacity="0.12" stroke-width="1.6" stroke-dasharray="10 8"/>
          <circle cx="1180" cy="240" r="180" stroke="#141414" stroke-opacity="0.08" stroke-width="1.2"/>
          <line x1="940" y1="240" x2="1420" y2="240" stroke="#141414" stroke-opacity="0.07" stroke-width="1"/>
          <line x1="1180" y1="20" x2="1180" y2="460" stroke="#141414" stroke-opacity="0.07" stroke-width="1"/>
        </g>
      </svg>
    `;
  }

  if (themeId === 'brazilian') {
    // Sweeping Niemeyer Concrete Arches + Copacabana Waves + Radiant Armorial Sun
    return `
      <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <linearGradient id="brWave" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#d68a12" stop-opacity="0.14"/>
            <stop offset="50%" stop-color="#0e7c5d" stop-opacity="0.11"/>
            <stop offset="100%" stop-color="#c84b26" stop-opacity="0.08"/>
          </linearGradient>
        </defs>
        <!-- Sweeping Niemeyer modernist parabola & fluid wave -->
        <path d="M-80 760 C 260 520, 620 880, 1040 580 C 1240 440, 1380 540, 1520 460 L 1520 920 L -80 920 Z" fill="url(#brWave)"/>
        <path d="M-60 220 Q 340 -40, 740 160 T 1500 120" fill="none" stroke="#c84b26" stroke-opacity="0.14" stroke-width="2.4"/>
        <!-- Radiant Armorial Sunburst on Upper Right -->
        <g transform="translate(1240,180)" fill="none">
          <circle r="190" stroke="#d68a12" stroke-opacity="0.15" stroke-width="1.4"/>
          <circle r="142" stroke="#0e7c5d" stroke-opacity="0.14" stroke-width="1.2" stroke-dasharray="10 7"/>
          <polygon points="0,-175 26,-26 175,0 26,26 0,175 -26,26 -175,0 -26,-26" stroke="#c84b26" stroke-opacity="0.14" stroke-width="1.4"/>
        </g>
      </svg>
    `;
  }

  // Layl & Nahar: Expansive Brass Astrolabe Celestial Arcs & Shamsa Rosette
  const col = themeId === 'nahar' ? '#b85c1b' : '#e5a955';
  const sec = themeId === 'nahar' ? '#1d7a68' : '#4cc9b0';
  return `
    <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <g fill="none">
        <!-- Giant Celestial Astrolabe Arcs -->
        <circle cx="1220" cy="180" r="340" stroke="${col}" stroke-opacity="0.11" stroke-width="1.2"/>
        <circle cx="1220" cy="180" r="280" stroke="${sec}" stroke-opacity="0.1" stroke-width="1" stroke-dasharray="5 7"/>
        <circle cx="1220" cy="180" r="210" stroke="${col}" stroke-opacity="0.12" stroke-width="1.1"/>
        <circle cx="200" cy="760" r="300" stroke="${sec}" stroke-opacity="0.09" stroke-width="1.2"/>
        <path d="M-40 420 Q 720 120, 1480 460" stroke="${col}" stroke-opacity="0.09" stroke-width="1.2"/>
        <!-- Subtle Shamsa Star -->
        <g transform="translate(1220,180)">
          <rect x="-120" y="-120" width="240" height="240" stroke="${col}" stroke-opacity="0.11" stroke-width="1"/>
          <rect x="-120" y="-120" width="240" height="240" transform="rotate(30)" stroke="${sec}" stroke-opacity="0.09" stroke-width="1"/>
          <rect x="-120" y="-120" width="240" height="240" transform="rotate(60)" stroke="${col}" stroke-opacity="0.09" stroke-width="1"/>
        </g>
      </g>
    </svg>
  `;
}
