/**
 * String Atlas Unified Database v7.0
 * - 74 Scales & Modes organized across 7 domains and subfamilies
 * - 39 Tunings across 6-String, 7-String & 8-String guitars
 * - 12 Experimental chords · 11 Iqa'at & Aksak cycles
 */

export const DB = {
  "categories": [
    {
      "id": "all",
      "labelPt": "Tudo",
      "labelEn": "All"
    },
    {
      "id": "arabic",
      "labelPt": "Maqamat (24-TET)",
      "labelEn": "Maqamat (24-TET)"
    },
    {
      "id": "greek",
      "labelPt": "Modos Gregos",
      "labelEn": "Greek Modes"
    },
    {
      "id": "minor_systems",
      "labelPt": "Menor Harm / Mel",
      "labelEn": "Harm / Mel Minor"
    },
    {
      "id": "global",
      "labelPt": "Global & Ragas",
      "labelEn": "Global & Ragas"
    },
    {
      "id": "messiaen",
      "labelPt": "Messiaen & Simetrias",
      "labelEn": "Messiaen & Symmetries"
    },
    {
      "id": "postTonal",
      "labelPt": "Pitch Sets & Pós-Tonal",
      "labelEn": "Pitch Sets & Post-Tonal"
    },
    {
      "id": "pentatonic",
      "labelPt": "Pentatônicas & Blues",
      "labelEn": "Pentatonics & Blues"
    }
  ],
  "tuningGroups": [
    {
      "id": "standard_baritone",
      "labelPt": "Standard & Barítono (E → A)",
      "labelEn": "Standard & Baritone (E → A)"
    },
    {
      "id": "drops",
      "labelPt": "Drop Tunings (D → G)",
      "labelEn": "Drop Tunings (D → G)"
    },
    {
      "id": "symmetric",
      "labelPt": "Simétricas & Contemporâneas",
      "labelEn": "Symmetric & Contemporary"
    },
    {
      "id": "modal_drone",
      "labelPt": "Modais, Abertas & Drones",
      "labelEn": "Modal, Open & Drone"
    },
    {
      "id": "ext_7",
      "labelPt": "7 Cordas (Barítono, Drop & Simétricas)",
      "labelEn": "7-String (Baritone, Drop & Symmetric)"
    },
    {
      "id": "ext_8",
      "labelPt": "8 Cordas (F♯/F Std, Drop E & Simétricas)",
      "labelEn": "8-String (F♯/F Std, Drop E & Symmetric)"
    }
  ],
  "tunings": [
    {
      "id": "standard",
      "group": "standard_baritone",
      "pinned": true,
      "namePt": "E Standard (E A D G B E)",
      "nameEn": "E Standard (E A D G B E)",
      "short": "E Std",
      "stringsQ": [
        80,
        90,
        100,
        110,
        118,
        128
      ]
    },
    {
      "id": "eb_standard",
      "group": "standard_baritone",
      "pinned": false,
      "namePt": "E♭ Standard (E♭ A♭ D♭ G♭ B♭ E♭)",
      "nameEn": "E♭ Standard (E♭ A♭ D♭ G♭ B♭ E♭)",
      "short": "E♭ Std",
      "stringsQ": [
        78,
        88,
        98,
        108,
        116,
        126
      ]
    },
    {
      "id": "d_standard",
      "group": "standard_baritone",
      "pinned": false,
      "namePt": "D Standard (D G C F A D)",
      "nameEn": "D Standard (D G C F A D)",
      "short": "D Std",
      "stringsQ": [
        76,
        86,
        96,
        106,
        114,
        124
      ]
    },
    {
      "id": "cs_standard",
      "group": "standard_baritone",
      "pinned": false,
      "namePt": "C♯ Standard (C♯ F♯ B E G♯ C♯)",
      "nameEn": "C♯ Standard (C♯ F♯ B E G♯ C♯)",
      "short": "C♯ Std",
      "stringsQ": [
        74,
        84,
        94,
        104,
        112,
        122
      ]
    },
    {
      "id": "c_standard",
      "group": "standard_baritone",
      "pinned": false,
      "namePt": "C Standard (C F B♭ E♭ G C)",
      "nameEn": "C Standard (C F B♭ E♭ G C)",
      "short": "C Std",
      "stringsQ": [
        72,
        82,
        92,
        102,
        110,
        120
      ]
    },
    {
      "id": "b_standard",
      "group": "standard_baritone",
      "pinned": true,
      "namePt": "B Standard / Barítono (B E A D F♯ B)",
      "nameEn": "B Standard / Baritone (B E A D F♯ B)",
      "short": "B Std",
      "stringsQ": [
        70,
        80,
        90,
        100,
        108,
        118
      ]
    },
    {
      "id": "a_standard",
      "group": "standard_baritone",
      "pinned": true,
      "namePt": "A Standard / Barítono Grave (A D G C E A)",
      "nameEn": "A Standard / Low Baritone (A D G C E A)",
      "short": "A Std",
      "stringsQ": [
        66,
        76,
        86,
        96,
        104,
        114
      ]
    },
    {
      "id": "drop_d",
      "group": "drops",
      "pinned": false,
      "namePt": "Drop D (D A D G B E)",
      "nameEn": "Drop D (D A D G B E)",
      "short": "Drop D",
      "stringsQ": [
        76,
        90,
        100,
        110,
        118,
        128
      ]
    },
    {
      "id": "drop_c",
      "group": "drops",
      "pinned": false,
      "namePt": "Drop C (C G C F A D)",
      "nameEn": "Drop C (C G C F A D)",
      "short": "Drop C",
      "stringsQ": [
        72,
        86,
        96,
        106,
        114,
        124
      ]
    },
    {
      "id": "drop_b",
      "group": "drops",
      "pinned": true,
      "namePt": "Drop B (B F♯ B E G♯ C♯)",
      "nameEn": "Drop B (B F♯ B E G♯ C♯)",
      "short": "Drop B",
      "stringsQ": [
        70,
        84,
        94,
        104,
        112,
        122
      ]
    },
    {
      "id": "drop_a",
      "group": "drops",
      "pinned": true,
      "namePt": "Drop A (A E A D F♯ B)",
      "nameEn": "Drop A (A E A D F♯ B)",
      "short": "Drop A",
      "stringsQ": [
        66,
        80,
        90,
        100,
        108,
        118
      ]
    },
    {
      "id": "drop_g",
      "group": "drops",
      "pinned": false,
      "namePt": "Drop G (G D G C E A)",
      "nameEn": "Drop G (G D G C E A)",
      "short": "Drop G",
      "stringsQ": [
        62,
        76,
        86,
        96,
        104,
        114
      ]
    },
    {
      "id": "all_fourths",
      "group": "symmetric",
      "pinned": true,
      "namePt": "All Fourths (E A D G C F)",
      "nameEn": "All Fourths (E A D G C F)",
      "short": "All 4ths",
      "stringsQ": [
        80,
        90,
        100,
        110,
        120,
        130
      ]
    },
    {
      "id": "all_fourths_b",
      "group": "symmetric",
      "pinned": false,
      "namePt": "All Fourths Barítono B (B E A D G C)",
      "nameEn": "All Fourths Baritone B (B E A D G C)",
      "short": "B 4ths",
      "stringsQ": [
        70,
        80,
        90,
        100,
        110,
        120
      ]
    },
    {
      "id": "all_fourths_a",
      "group": "symmetric",
      "pinned": false,
      "namePt": "All Fourths Barítono A (A D G C F B♭)",
      "nameEn": "All Fourths Baritone A (A D G C F B♭)",
      "short": "A 4ths",
      "stringsQ": [
        66,
        76,
        86,
        96,
        106,
        116
      ]
    },
    {
      "id": "fripp_nst",
      "group": "symmetric",
      "pinned": false,
      "namePt": "New Standard / Quintas (C G D A E G)",
      "nameEn": "New Standard / Fifths (C G D A E G)",
      "short": "NST 5ths",
      "stringsQ": [
        72,
        86,
        100,
        114,
        128,
        134
      ]
    },
    {
      "id": "major_thirds",
      "group": "symmetric",
      "pinned": false,
      "namePt": "Terças Maiores (C E G♯ C E G♯)",
      "nameEn": "Major Thirds (C E G♯ C E G♯)",
      "short": "M3 Sym",
      "stringsQ": [
        72,
        80,
        88,
        96,
        104,
        112
      ]
    },
    {
      "id": "dadgad",
      "group": "modal_drone",
      "pinned": true,
      "namePt": "DADGAD (Modal / Celta / Árabe)",
      "nameEn": "DADGAD (Modal / Celtic / Arabic)",
      "short": "DADGAD",
      "stringsQ": [
        76,
        90,
        100,
        110,
        114,
        124
      ]
    },
    {
      "id": "baritone_bfbeb",
      "group": "modal_drone",
      "pinned": false,
      "namePt": "Barítono Modal (B F♯ B E F♯ B · Low DADGAD)",
      "nameEn": "Baritone Modal (B F♯ B E F♯ B · Low DADGAD)",
      "short": "B Modal",
      "stringsQ": [
        70,
        84,
        94,
        104,
        108,
        118
      ]
    },
    {
      "id": "oud_cfadgc",
      "group": "modal_drone",
      "pinned": false,
      "namePt": "Oud-Mapped Guitar (C F A D G C)",
      "nameEn": "Oud-Mapped Guitar (C F A D G C)",
      "short": "CFADGC",
      "stringsQ": [
        72,
        82,
        90,
        100,
        110,
        120
      ]
    },
    {
      "id": "orkney",
      "group": "modal_drone",
      "pinned": false,
      "namePt": "Orkney Drone (C G D G C D)",
      "nameEn": "Orkney Drone (C G D G C D)",
      "short": "Orkney",
      "stringsQ": [
        72,
        86,
        100,
        110,
        120,
        124
      ]
    },
    {
      "id": "open_c",
      "group": "modal_drone",
      "pinned": false,
      "namePt": "Open C (C G C G C E)",
      "nameEn": "Open C (C G C G C E)",
      "short": "Open C",
      "stringsQ": [
        72,
        86,
        96,
        110,
        120,
        128
      ]
    },
    {
      "id": "open_c_minor",
      "group": "modal_drone",
      "pinned": false,
      "namePt": "Open C Minor (C G C G C E♭)",
      "nameEn": "Open C Minor (C G C G C E♭)",
      "short": "Open Cm",
      "stringsQ": [
        72,
        86,
        96,
        110,
        120,
        126
      ]
    },
    {
      "id": "open_lydian",
      "group": "modal_drone",
      "pinned": false,
      "namePt": "Open Lydian / Midwest (F A C G C E)",
      "nameEn": "Open Lydian / Midwest (F A C G C E)",
      "short": "FACGCE",
      "stringsQ": [
        82,
        90,
        96,
        110,
        120,
        128
      ]
    },
    {
      "id": "open_a9_shoegaze",
      "group": "modal_drone",
      "pinned": false,
      "namePt": "Open A9 / Post-Rock (D A E A C♯ E)",
      "nameEn": "Open A9 / Post-Rock (D A E A C♯ E)",
      "short": "DAEAC♯E",
      "stringsQ": [
        76,
        90,
        104,
        114,
        122,
        128
      ]
    },
    {
      "id": "sonic_unison",
      "group": "modal_drone",
      "pinned": false,
      "namePt": "Drone Uníssono (F♯ F♯ F♯ F♯ E B)",
      "nameEn": "Unison Drone (F♯ F♯ F♯ F♯ E B)",
      "short": "F♯⁴-E-B",
      "stringsQ": [
        84,
        84,
        108,
        108,
        128,
        142
      ]
    },
    {
      "id": "7_b_standard",
      "group": "ext_7",
      "pinned": true,
      "namePt": "7c B Standard (B E A D G B E)",
      "nameEn": "7-Str B Standard (B E A D G B E)",
      "short": "7c B Std",
      "stringsQ": [
        70,
        80,
        90,
        100,
        110,
        118,
        128
      ]
    },
    {
      "id": "7_a_standard",
      "group": "ext_7",
      "pinned": true,
      "namePt": "7c A Standard (A D G C F A D)",
      "nameEn": "7-Str A Standard (A D G C F A D)",
      "short": "7c A Std",
      "stringsQ": [
        66,
        76,
        86,
        96,
        106,
        114,
        124
      ]
    },
    {
      "id": "7_drop_a",
      "group": "ext_7",
      "pinned": true,
      "namePt": "7c Drop A (A E A D G B E)",
      "nameEn": "7-Str Drop A (A E A D G B E)",
      "short": "7c Drop A",
      "stringsQ": [
        66,
        80,
        90,
        100,
        110,
        118,
        128
      ]
    },
    {
      "id": "7_drop_g",
      "group": "ext_7",
      "pinned": true,
      "namePt": "7c Drop G (G D G C F A D)",
      "nameEn": "7-Str Drop G (G D G C F A D)",
      "short": "7c Drop G",
      "stringsQ": [
        62,
        76,
        86,
        96,
        106,
        114,
        124
      ]
    },
    {
      "id": "7_all_fourths",
      "group": "ext_7",
      "pinned": true,
      "namePt": "7c All Fourths (B E A D G C F)",
      "nameEn": "7-Str All Fourths (B E A D G C F)",
      "short": "7c 4ths",
      "stringsQ": [
        70,
        80,
        90,
        100,
        110,
        120,
        130
      ]
    },
    {
      "id": "7_dadgad_low_a",
      "group": "ext_7",
      "pinned": false,
      "namePt": "7c Modal Drone (A D A D G A D)",
      "nameEn": "7-Str Modal Drone (A D A D G A D)",
      "short": "7c DADGAD",
      "stringsQ": [
        66,
        76,
        90,
        100,
        110,
        114,
        124
      ]
    },
    {
      "id": "7_oud_extended",
      "group": "ext_7",
      "pinned": false,
      "namePt": "7c Oud-Mapped (G C F A D G C)",
      "nameEn": "7-Str Oud-Mapped (G C F A D G C)",
      "short": "7c Oud",
      "stringsQ": [
        62,
        72,
        82,
        90,
        100,
        110,
        120
      ]
    },
    {
      "id": "8_fs_standard",
      "group": "ext_8",
      "pinned": true,
      "namePt": "8c F♯ Standard (F♯ B E A D G B E)",
      "nameEn": "8-Str F♯ Standard (F♯ B E A D G B E)",
      "short": "8c F♯ Std",
      "stringsQ": [
        60,
        70,
        80,
        90,
        100,
        110,
        118,
        128
      ]
    },
    {
      "id": "8_f_meshuggah",
      "group": "ext_8",
      "pinned": true,
      "namePt": "8c F Standard / Meshuggah (F B♭ E♭ A♭ D♭ G♭ B♭ E♭)",
      "nameEn": "8-Str F Standard / Meshuggah (F B♭ E♭ A♭ D♭ G♭ B♭ E♭)",
      "short": "8c F Std",
      "stringsQ": [
        58,
        68,
        78,
        88,
        98,
        108,
        116,
        126
      ]
    },
    {
      "id": "8_drop_e",
      "group": "ext_8",
      "pinned": true,
      "namePt": "8c Drop E (E B E A D G B E)",
      "nameEn": "8-Str Drop E (E B E A D G B E)",
      "short": "8c Drop E",
      "stringsQ": [
        56,
        70,
        80,
        90,
        100,
        110,
        118,
        128
      ]
    },
    {
      "id": "8_hybrid_ea",
      "group": "ext_8",
      "pinned": true,
      "namePt": "8c Hybrid E-A (E A E A D G B E)",
      "nameEn": "8-Str Hybrid E-A (E A E A D G B E)",
      "short": "8c E-A",
      "stringsQ": [
        56,
        66,
        80,
        90,
        100,
        110,
        118,
        128
      ]
    },
    {
      "id": "8_all_fourths",
      "group": "ext_8",
      "pinned": true,
      "namePt": "8c All Fourths (F♯ B E A D G C F)",
      "nameEn": "8-Str All Fourths (F♯ B E A D G C F)",
      "short": "8c 4ths",
      "stringsQ": [
        60,
        70,
        80,
        90,
        100,
        110,
        120,
        130
      ]
    },
    {
      "id": "8_drop_eb",
      "group": "ext_8",
      "pinned": false,
      "namePt": "8c Drop E♭ (E♭ B♭ E♭ A♭ D♭ G♭ B♭ E♭)",
      "nameEn": "8-Str Drop E♭ (E♭ B♭ E♭ A♭ D♭ G♭ B♭ E♭)",
      "short": "8c Drop E♭",
      "stringsQ": [
        54,
        68,
        78,
        88,
        98,
        108,
        116,
        126
      ]
    }
  ],
  "scales": [
    {
      "id": "maqam_bayati",
      "category": "arabic",
      "subfamilyPt": "Família Bayati & Saba",
      "subfamilyEn": "Bayati & Saba Family",
      "namePt": "Maqam Bayati",
      "nameEn": "Maqam Bayati",
      "intervalsQ": [
        0,
        3,
        6,
        10,
        14,
        16,
        20
      ],
      "characteristicQ": [
        3,
        6
      ],
      "tagsPt": [
        "Jins Bayati",
        "2ª Neutra (150¢)",
        "Taqsim"
      ],
      "tagsEn": [
        "Jins Bayati",
        "Neutral 2nd (150¢)",
        "Taqsim"
      ],
      "dossier": {
        "structurePt": "Tetracorde inferior Jins Bayati (¾ · ¾ · 1) seguido de Jins Nahawand ou Rast no 4º grau. A 2ª meio-bemol cria gravidade melódica rumo à tônica.",
        "structureEn": "Lower tetrachord Jins Bayati (¾ · ¾ · 1) followed by Jins Nahawand or Rast on the 4th degree. The half-flat 2nd creates strong gravity toward the tonic.",
        "temperamentPt": "Em 24-TET o 2º grau está a +150¢ da tônica; na prática levantina/egípcia costuma soar ligeiramente mais baixo (~135–145¢) em descida.",
        "temperamentEn": "In 24-TET the 2nd degree sits at +150¢; in Levantine/Egyptian practice it often inflects slightly lower (~135–145¢) when descending.",
        "articulationPt": "Na guitarra 12-TET, ataque a casa da ♭2 e aplique micro-bend de +50¢ sem vibrato excessivo; em B ou A Standard, explore drones graves na 6ª corda solta.",
        "articulationEn": "On a 12-TET guitar, fret ♭2 and apply a controlled +50¢ micro-bend without heavy vibrato; in B or A Standard, anchor phrases over the open 6th-string drone.",
        "repertoire": "Samai Bayati Ibrahim al-Aryan · Munir Bashir Taqsim Bayati"
      }
    },
    {
      "id": "maqam_bayati_shuri",
      "category": "arabic",
      "subfamilyPt": "Família Bayati & Saba",
      "subfamilyEn": "Bayati & Saba Family",
      "namePt": "Maqam Bayati Shuri",
      "nameEn": "Maqam Bayati Shuri",
      "intervalsQ": [
        0,
        3,
        6,
        10,
        12,
        18,
        20
      ],
      "characteristicQ": [
        3,
        12,
        18
      ],
      "tagsPt": [
        "Jins Bayati + Hijaz",
        "2ª Neutra + ♯4",
        "24-TET"
      ],
      "tagsEn": [
        "Jins Bayati + Hijaz",
        "Neutral 2nd + ♯4",
        "24-TET"
      ],
      "dossier": {
        "structurePt": "Combina Jins Bayati na base (1 · 2½♭ · ♭3 · 4) com Jins Hijaz no 4º grau (4 · ♭5 · 6 · ♭7), criando um contraste dramático entre neutralidade e 2ª aumentada.",
        "structureEn": "Pairs Jins Bayati on the tonic with Jins Hijaz on the 4th degree (4 · ♭5 · 6 · ♭7), creating striking contrast between neutral warmth and an upper augmented 2nd.",
        "temperamentPt": "Reúne microtonalidade (2½♭ a +150¢) no registro inferior com a tensão cromática ♭5→6 no registro superior.",
        "temperamentEn": "Combines quarter-tone inflection (2½♭ at +150¢) below with the chromatic ♭5→6 leap above.",
        "articulationPt": "Use o 4º grau como ponto de virada: construa tensão no salto ♭5→6 com palhetada alternada seca e resolva suavemente via micro-bend na 2½♭.",
        "articulationEn": "Use the 4th degree as a pivot: build tension across the ♭5→6 leap with crisp alternate picking and resolve softly via a 2½♭ micro-bend.",
        "repertoire": "Samai Bayati Shuri · Umm Kulthum (trechos modulatórios)"
      }
    },
    {
      "id": "maqam_husayni",
      "category": "arabic",
      "subfamilyPt": "Família Bayati & Saba",
      "subfamilyEn": "Bayati & Saba Family",
      "namePt": "Maqam Husayni",
      "nameEn": "Maqam Husayni",
      "intervalsQ": [
        0,
        3,
        6,
        10,
        14,
        17,
        20
      ],
      "characteristicQ": [
        3,
        14,
        17
      ],
      "tagsPt": [
        "Jins Bayati na 1ª e 5ª",
        "6ª Neutra",
        "24-TET"
      ],
      "tagsEn": [
        "Jins Bayati on 1 & 5",
        "Neutral 6th",
        "24-TET"
      ],
      "dossier": {
        "structurePt": "Parente direto do Bayati que eleva a 6ª para 6½♭ (+850¢) formando um segundo Jins Bayati sobre a 5ª justa — deslocando o centro dramático para o registro agudo.",
        "structureEn": "Close sibling of Bayati raising the 6th to 6½♭ (+850¢) to form a second Jins Bayati on the 5th — shifting melodic gravity into the upper register.",
        "temperamentPt": "Possui dois graus neutros simétricos separados por 5ª justa: 2½♭ (150¢) e 6½♭ (850¢).",
        "temperamentEn": "Features two symmetrical neutral degrees a perfect 5th apart: 2½♭ (150¢) and 6½♭ (850¢).",
        "articulationPt": "Inicie o fraseado em torno da 5ª justa destacando a 6½♭ com micro-bend ou slide, descendo apenas no fechamento para a tônica.",
        "articulationEn": "Launch phrases around the 5th emphasizing 6½♭ via micro-bend or slide, descending to the tonic only at cadences.",
        "repertoire": "Folclore Levantino · Sabah Fakhri · Farid al-Atrash"
      }
    },
    {
      "id": "maqam_saba",
      "category": "arabic",
      "subfamilyPt": "Família Bayati & Saba",
      "subfamilyEn": "Bayati & Saba Family",
      "namePt": "Maqam Saba",
      "nameEn": "Maqam Saba",
      "intervalsQ": [
        0,
        3,
        6,
        8,
        14,
        16,
        20
      ],
      "characteristicQ": [
        3,
        8
      ],
      "tagsPt": [
        "4ª Diminuta",
        "Tensão Intensa",
        "24-TET"
      ],
      "tagsEn": [
        "Diminished 4th",
        "High Tension",
        "24-TET"
      ],
      "dossier": {
        "structurePt": "Começa com Jins Saba (¾ · ¾ · ½), quebrando a 4ª justa em uma 4ª diminuta (8q) que gera uma sensação melancólica e suspensa inconfundível.",
        "structureEn": "Opens with Jins Saba (¾ · ¾ · ½), collapsing the perfect 4th into a diminished 4th (8q) for a haunting, unresolved gravity.",
        "temperamentPt": "A distância entre o 2º grau neutro (150¢) e a 4ª diminuta (400¢) concentra alta densidade intervalar na região grave da oitava.",
        "temperamentEn": "The tight cluster from neutral 2nd (150¢) to diminished 4th (400¢) concentrates dense emotional gravity in the lower register.",
        "articulationPt": "Evite acordes fechados ocidentais; use drones graves (ex.: B1 ou A1 em barítono) e bends lentos de ¼ de tom com sustain elétrico.",
        "articulationEn": "Avoid dense Western triads; lean on low baritone drones (B1/A1) and slow quarter-tone bends with electric sustain.",
        "repertoire": "Simon Shaheen — Taqsim Saba · Wadih El Safi"
      }
    },
    {
      "id": "maqam_saba_zamzam",
      "category": "arabic",
      "subfamilyPt": "Família Bayati & Saba",
      "subfamilyEn": "Bayati & Saba Family",
      "namePt": "Maqam Saba Zamzam",
      "nameEn": "Maqam Saba Zamzam",
      "intervalsQ": [
        0,
        2,
        6,
        8,
        14,
        16,
        20
      ],
      "characteristicQ": [
        2,
        6,
        8
      ],
      "tagsPt": [
        "12-TET",
        "4ª Diminuta",
        "Sombrio / Doom"
      ],
      "tagsEn": [
        "12-TET",
        "Diminished 4th",
        "Dark / Doom"
      ],
      "dossier": {
        "structurePt": "Versão 12-TET do Maqam Saba: substitui a 2ª neutra por ♭2 (½ · 1 · ½) preservando a 4ª diminuta (♭4/3M). Cria uma sonoridade opressiva extraordinária em afinações graves.",
        "structureEn": "12-TET counterpart to Maqam Saba: replaces the neutral 2nd with ♭2 (H · W · H) while keeping the diminished 4th — devastating in low baritone tunings.",
        "temperamentPt": "100% compatível com trastes padrão 12-TET, mantendo o choque emocional típico do Saba entre ♭3 e ♭4.",
        "temperamentEn": "Fully playable on standard 12-TET frets while retaining Saba’s haunting rub between ♭3 and diminished 4th.",
        "articulationPt": "Em B Standard ou A Standard, explore riffs arrastados (doom/post-metal) alternando tônica, ♭2, ♭3 e a 4ª diminuta sem jamais tocar a 4ª justa.",
        "articulationEn": "In B or A Standard, craft slow doom/post-metal riffs alternating tonic, ♭2, ♭3, and diminished 4th without ever touching a perfect 4th.",
        "repertoire": "Umm Kulthum — Fakkaruni · Tradição Egípcia Moderna"
      }
    },
    {
      "id": "maqam_rast",
      "category": "arabic",
      "subfamilyPt": "Família Rast & Sikah",
      "subfamilyEn": "Rast & Sikah Family",
      "namePt": "Maqam Rast",
      "nameEn": "Maqam Rast",
      "intervalsQ": [
        0,
        4,
        7,
        10,
        14,
        18,
        21
      ],
      "characteristicQ": [
        7,
        21
      ],
      "tagsPt": [
        "3ª Neutra (350¢)",
        "7ª Neutra (1050¢)",
        "Pilar Árabe"
      ],
      "tagsEn": [
        "Neutral 3rd (350¢)",
        "Neutral 7th (1050¢)",
        "Arabic Pillar"
      ],
      "dossier": {
        "structurePt": "Baseado no Jins Rast (1 · ¾ · ¾) sobre a tônica e replicado na 5ª justa. Na descida tradicional, o 7º grau frequentemente desce para ♭7 (1000¢).",
        "structureEn": "Built on Jins Rast (1 · ¾ · ¾) on the tonic and replicated on the 5th. Traditionally, descending phrases often lower the 7th degree to standard ♭7.",
        "temperamentPt": "A terça neutra (350¢) habita exatamente o limiar entre o maior e o menor, dissolvendo a dicotomia tonal ocidental.",
        "temperamentEn": "The neutral 3rd (350¢) sits right between major and minor, dissolving Western major/minor duality.",
        "articulationPt": "Use bottleneck/slide ou micro-bends curtos saindo da terça menor (♭3) para atingir a neutralidade do Rast. Excelente com timbre limpo e reverb longo.",
        "articulationEn": "Use slide or short micro-bends up from minor 3rd (♭3) to hit the neutral sweet spot. Shines with clean tone and ambient reverb.",
        "repertoire": "Umm Kulthum — Al-Atlal · Farid al-Atrash Taqsim Rast"
      }
    },
    {
      "id": "maqam_suznak",
      "category": "arabic",
      "subfamilyPt": "Família Rast & Sikah",
      "subfamilyEn": "Rast & Sikah Family",
      "namePt": "Maqam Suznak",
      "nameEn": "Maqam Suznak",
      "intervalsQ": [
        0,
        4,
        7,
        10,
        14,
        16,
        22
      ],
      "characteristicQ": [
        7,
        16,
        22
      ],
      "tagsPt": [
        "Jins Rast + Hijaz",
        "3ª Neutra + 7M",
        "24-TET"
      ],
      "tagsEn": [
        "Jins Rast + Hijaz",
        "Neutral 3rd + M7",
        "24-TET"
      ],
      "dossier": {
        "structurePt": "Um dos híbridos mais célebres da música árabe: Jins Rast na base (1 · 2 · 3½♭ · 4) coroado por Jins Hijaz sobre a 5ª justa (5 · ♭6 · 7 · 8).",
        "structureEn": "One of Arabic music’s most celebrated hybrids: Jins Rast below (1 · 2 · 3½♭ · 4) crowned by Jins Hijaz on the 5th (5 · ♭6 · 7 · 8).",
        "temperamentPt": "Apenas um grau microtonal (3½♭ a 350¢) — fácil de dominar na guitarra 12-TET enquanto oferece todo o drama do Hijaz no agudo.",
        "temperamentEn": "Just one quarter-tone degree (3½♭ at 350¢) — highly accessible on 12-TET guitar while delivering full Hijaz drama upstairs.",
        "articulationPt": "Ótima porta de entrada para microtonalidade: toque a parte aguda em palhetada rápida e desacelere sobre a 3ª neutra com micro-bend preciso.",
        "articulationEn": "Ideal gateway to quarter-tones: pick the upper Hijaz tetrachord crisply and slow down onto the neutral 3rd with a precise micro-bend.",
        "repertoire": "Samai Suznak · Riyad al-Sunbati · Munir Bashir"
      }
    },
    {
      "id": "maqam_sikah",
      "category": "arabic",
      "subfamilyPt": "Família Rast & Sikah",
      "subfamilyEn": "Rast & Sikah Family",
      "namePt": "Maqam Sikah",
      "nameEn": "Maqam Sikah",
      "intervalsQ": [
        0,
        3,
        7,
        11,
        14,
        17,
        21
      ],
      "characteristicQ": [
        3,
        7,
        11
      ],
      "tagsPt": [
        "Tricorde Sikah",
        "Eixo Neutro",
        "24-TET"
      ],
      "tagsEn": [
        "Sikah Trichord",
        "Neutral Axis",
        "24-TET"
      ],
      "dossier": {
        "structurePt": "Construído a partir de um tricorde (¾ · 1) em vez de tetracorde. Tradicionalmente nasce sobre E½♭, fazendo praticamente toda a malha intervalar flutuar em quartos de tom.",
        "structureEn": "Built on a trichord (¾ · 1) rather than a tetrachord. Traditionally rooted on E½♭, making the scale grid float across quarter-tone intervals.",
        "temperamentPt": "Ótimo teste de percepção no modo Slide ou Trastes 24-TET: observe como a 5ª justa (14q) ancora um ambiente cercado de graus neutros.",
        "temperamentEn": "A prime ear-training lab in Slide or 24-TET Frets mode: notice how the perfect 5th (14q) anchors a field of neutral degrees.",
        "articulationPt": "Ative o modo Slide/Fretless e explore glissandos suaves em uma única corda, repousando na tônica e no 3º grau neutro.",
        "articulationEn": "Switch to Slide/Fretless mode and explore slow single-string glissandi, resting on the tonic and neutral 3rd.",
        "repertoire": "Samai Sikah · George Abyad"
      }
    },
    {
      "id": "maqam_huzam",
      "category": "arabic",
      "subfamilyPt": "Família Rast & Sikah",
      "subfamilyEn": "Rast & Sikah Family",
      "namePt": "Maqam Huzam",
      "nameEn": "Maqam Huzam",
      "intervalsQ": [
        0,
        3,
        7,
        9,
        15,
        17,
        21
      ],
      "characteristicQ": [
        3,
        9,
        15
      ],
      "tagsPt": [
        "Tricorde Sikah + Hijaz",
        "Microtonal",
        "24-TET"
      ],
      "tagsEn": [
        "Sikah Trichord + Hijaz",
        "Microtonal",
        "24-TET"
      ],
      "dossier": {
        "structurePt": "Funde o tricorde inicial do Sikah (¾ · 1) com Jins Hijaz no 3º grau (7q→9q→15q→17q), criando uma das cores mais hipnóticas da família Sikah.",
        "structureEn": "Fuses the opening Sikah trichord (¾ · 1) with Jins Hijaz on the 3rd degree (7q→9q→15q→17q), yielding one of the most hypnotic colors in the Sikah family.",
        "temperamentPt": "Quase todos os graus caem em quartos de tom relativos à tônica — brilhante para exploração com bottleneck/slide ou guitarra microtonal.",
        "temperamentEn": "Nearly every degree sits on quarter-tone offsets relative to the root — extraordinary for slide/fretless or 24-TET fretboard study.",
        "articulationPt": "Experimente no modo Trastes 24-TET ou Slide sobre um drone de tônica pura, destacando o salto de 1½ tom entre 4½♭ e 6½♭.",
        "articulationEn": "Try 24-TET Frets or Slide mode over a pure tonic drone, spotlighting the augmented-2nd leap in the middle register.",
        "repertoire": "Fairuz · Sabah Fakhri · Samai Huzam"
      }
    },
    {
      "id": "maqam_hijaz",
      "category": "arabic",
      "subfamilyPt": "Família Hijaz & Nawa Athar",
      "subfamilyEn": "Hijaz & Nawa Athar Family",
      "namePt": "Maqam Hijaz",
      "nameEn": "Maqam Hijaz",
      "intervalsQ": [
        0,
        2,
        8,
        10,
        14,
        17,
        20
      ],
      "characteristicQ": [
        2,
        8,
        17
      ],
      "tagsPt": [
        "2ª Aumentada",
        "6ª Neutra",
        "24-TET"
      ],
      "tagsEn": [
        "Augmented 2nd",
        "Neutral 6th",
        "24-TET"
      ],
      "dossier": {
        "structurePt": "Tetracorde Jins Hijaz (½ · 1½ · ½) combinado com Jins Rast na 4ª. A 6ª meio-bemol suaviza o contraste dramático do salto de segunda aumentada.",
        "structureEn": "Jins Hijaz tetrachord (½ · 1½ · ½) paired with Jins Rast on the 4th. The neutral 6th softens the dramatic augmented-second leap.",
        "temperamentPt": "Na execução tradicional, a ♭2 tende a subir levemente (~120¢) e a 3ª maior a descer (~385¢), comprimindo o salto de 1½ tom.",
        "temperamentEn": "In traditional phrasing, ♭2 slightly sharpens (~120¢) and major 3rd slightly flattens (~385¢), narrowing the augmented second.",
        "articulationPt": "Explore fraseados lineares em uma única corda (estilo Oud/Saz) deslizando entre ♭2 e 3 com legato e palhetada alternada seca.",
        "articulationEn": "Explore single-string linear phrasing (Oud/Saz approach), sliding between ♭2 and 3 with tight legato and crisp picking.",
        "repertoire": "Anouar Brahem — Astrakan Café · Samai Hijaz"
      }
    },
    {
      "id": "maqam_hijaz_kar",
      "category": "arabic",
      "subfamilyPt": "Família Hijaz & Nawa Athar",
      "subfamilyEn": "Hijaz & Nawa Athar Family",
      "namePt": "Maqam Hijaz Kar",
      "nameEn": "Maqam Hijaz Kar",
      "intervalsQ": [
        0,
        2,
        8,
        10,
        14,
        16,
        22
      ],
      "characteristicQ": [
        2,
        8,
        16,
        22
      ],
      "tagsPt": [
        "Duplo Jins Hijaz",
        "12-TET",
        "Simetria Espelhada"
      ],
      "tagsEn": [
        "Double Jins Hijaz",
        "12-TET",
        "Mirrored Symmetry"
      ],
      "dossier": {
        "structurePt": "Empilha dois tetracordes Jins Hijaz separados por 1 tom (na tônica e na 5ª justa). Compartilha a malha 12-TET com Raga Bhairav, mas com condução centrada na 5ª.",
        "structureEn": "Stacks two Jins Hijaz tetrachords separated by a whole step (on tonic and 5th). Shares pitches with Raga Bhairav, pivoting around the 5th (Ghammaz).",
        "temperamentPt": "Totalmente executável em 12-TET; permite acordes abertos de 5ª justa + ♭2 e 7ª maior em choque controlado.",
        "temperamentEn": "Fully 12-TET playable; supports open fifth voicings rubbing against ♭2 and major 7th.",
        "articulationPt": "Em afinações barítono (B/A Standard), explore arpejos híbridos alternando bordão grave com saltos ♭6→7 nas cordas agudas.",
        "articulationEn": "In baritone tunings (B/A Standard), pair low open pedals with ♭6→7 hybrid-picked leaps on upper strings.",
        "repertoire": "Samai Hijaz Kar · Sayyid Darwish"
      }
    },
    {
      "id": "maqam_nawa_athar",
      "category": "arabic",
      "subfamilyPt": "Família Hijaz & Nawa Athar",
      "subfamilyEn": "Hijaz & Nawa Athar Family",
      "namePt": "Maqam Nawa Athar",
      "nameEn": "Maqam Nawa Athar",
      "intervalsQ": [
        0,
        4,
        6,
        12,
        14,
        16,
        22
      ],
      "characteristicQ": [
        6,
        12,
        22
      ],
      "tagsPt": [
        "12-TET",
        "Dupla 2ª Aumentada",
        "Escuro / Metal"
      ],
      "tagsEn": [
        "12-TET",
        "Double Aug 2nd",
        "Dark / Metal"
      ],
      "dossier": {
        "structurePt": "Equivalente em 12-TET à Menor Húngara: dois saltos de segunda aumentada (♭3→♯4 e ♭6→7) criam simetria sombria e cinematográfica.",
        "structureEn": "12-TET counterpart to Hungarian Minor: two augmented-second leaps (♭3→♯4 and ♭6→7) create dark, dramatic symmetry.",
        "temperamentPt": "Não exige microtons obrigatórios — ponte imediata para transferir fraseado árabe e riffs pesados/modais para a guitarra elétrica.",
        "temperamentEn": "Requires no quarter-tones — an immediate bridge for Arabic phrasing and dark modal riffs on electric guitar.",
        "articulationPt": "Experimente arpejar díades de trítono (1–♯4) e 7ª maior (1–7) com fuzz/overdrive em B ou A Standard, alternando com tremolo picking.",
        "articulationEn": "Arpeggiate tritone (1–♯4) and major-7th dyads with fuzz/overdrive in B or A Standard, contrasting with tremolo-picked lines.",
        "repertoire": "Farid al-Atrash — Nawa Athar · Rabih Abou-Khalil"
      }
    },
    {
      "id": "maqam_athar_kurd",
      "category": "arabic",
      "subfamilyPt": "Família Hijaz & Nawa Athar",
      "subfamilyEn": "Hijaz & Nawa Athar Family",
      "namePt": "Maqam Athar Kurd",
      "nameEn": "Maqam Athar Kurd",
      "intervalsQ": [
        0,
        2,
        6,
        12,
        14,
        16,
        22
      ],
      "characteristicQ": [
        2,
        12,
        22
      ],
      "tagsPt": [
        "Kurd + ♯4 + 7M",
        "12-TET",
        "Dramático"
      ],
      "tagsEn": [
        "Kurd + ♯4 + M7",
        "12-TET",
        "Dramatic"
      ],
      "dossier": {
        "structurePt": "Funde o início sombrio do Kurd (♭2, ♭3) com a ♯4 e a 7ª maior do Nawa Athar. Gera uma paleta extremamente expressiva para solos e riffs modais.",
        "structureEn": "Merges the dark Kurd opening (♭2, ♭3) with Nawa Athar’s ♯4 and major 7th — delivering an intensely dramatic palette for solos and modal riffs.",
        "temperamentPt": "12-TET nativo com dois saltos de 1½ tom (♭3→♯4 e ♭6→7) e dois semitons adjacentes à tônica (7–1–♭2).",
        "temperamentEn": "12-TET native featuring two augmented-2nd leaps (♭3→♯4 and ♭6→7) and semitones flanking the tonic (7–1–♭2).",
        "articulationPt": "Explore o cluster cromático 7–1–♭2 em cordas adjacentes com sustain elétrico ou delay modulante.",
        "articulationEn": "Exploit the 7–1–♭2 chromatic cluster across adjacent strings with electric sustain or modulated delay.",
        "repertoire": "Farid al-Atrash · Marcel Khalife"
      }
    },
    {
      "id": "maqam_nikriz",
      "category": "arabic",
      "subfamilyPt": "Família Hijaz & Nawa Athar",
      "subfamilyEn": "Hijaz & Nawa Athar Family",
      "namePt": "Maqam Nikriz",
      "nameEn": "Maqam Nikriz",
      "intervalsQ": [
        0,
        4,
        6,
        12,
        14,
        18,
        20
      ],
      "characteristicQ": [
        6,
        12,
        18
      ],
      "tagsPt": [
        "Jins Nikriz",
        "Dórico ♯4",
        "12-TET"
      ],
      "tagsEn": [
        "Jins Nikriz",
        "Dorian ♯4",
        "12-TET"
      ],
      "dossier": {
        "structurePt": "Pentacorde Jins Nikriz (1 · ½ · 1½ · ½) com salto expressivo entre ♭3 e ♯4, combinado com 6ª maior e ♭7 no registro agudo.",
        "structureEn": "Jins Nikriz pentachord (W · H · m3 · H) spotlighting the ♭3→♯4 leap, paired with major 6th and ♭7 above.",
        "temperamentPt": "12-TET nativo (4º modo da menor harmônica / Dórico ♯4), perfeito para fundir linguagem árabe, jazz modal e metal progressivo.",
        "temperamentEn": "12-TET native (4th mode of harmonic minor / Dorian ♯4), a powerhouse for fusing Arabic phrasing, modal jazz, and progressive metal.",
        "articulationPt": "Combine riffs sincopados em 10/8 (Sama’i Thaqil) enfatizando o trítono ♯4 resolvendo na 5ª justa.",
        "articulationEn": "Pair with syncopated 10/8 (Sama’i Thaqil) riffs leaning on the ♯4 tritone resolving into the 5th.",
        "repertoire": "Rabih Abou-Khalil — Blue Camel · Samai Nikriz"
      }
    },
    {
      "id": "maqam_nahawand",
      "category": "arabic",
      "subfamilyPt": "Família Nahawand, Kurd & Ajam",
      "subfamilyEn": "Nahawand, Kurd & Ajam Family",
      "namePt": "Maqam Nahawand",
      "nameEn": "Maqam Nahawand",
      "intervalsQ": [
        0,
        4,
        6,
        10,
        14,
        16,
        22
      ],
      "characteristicQ": [
        6,
        16,
        22
      ],
      "tagsPt": [
        "Jins Nahawand",
        "Jins Hijaz na 5ª",
        "12-TET"
      ],
      "tagsEn": [
        "Jins Nahawand",
        "Upper Jins Hijaz",
        "12-TET"
      ],
      "dossier": {
        "structurePt": "Tetracorde menor Jins Nahawand (1 · ½ · 1) seguido de Jins Hijaz no 5º grau (ou Kurd na descida). Um dos maqamat mais líricos e imediatos na guitarra.",
        "structureEn": "Minor tetrachord Jins Nahawand (W · H · W) topped by Jins Hijaz on the 5th (shifting to Kurd on descent). One of the most lyrical maqamat on guitar.",
        "temperamentPt": "Nativo em 12-TET; ótimo laboratório para praticar modulações (Sayr) entre 7ª maior (sensível) e ♭7 descendente.",
        "temperamentEn": "12-TET native; ideal lab for practicing sayr shifts between leading tone 7 and descending ♭7.",
        "articulationPt": "Acentue o 5º grau como polo dramático usando vibrato vocal e ornamentos rápidos (mordentes) saindo da ♭6.",
        "articulationEn": "Treat the 5th as a dramatic pivot using vocal vibrato and crisp mordents from the ♭6.",
        "repertoire": "Fairuz — Ya Ana Ya Ana · Riyad al-Sunbati"
      }
    },
    {
      "id": "maqam_kurd",
      "category": "arabic",
      "subfamilyPt": "Família Nahawand, Kurd & Ajam",
      "subfamilyEn": "Nahawand, Kurd & Ajam Family",
      "namePt": "Maqam Kurd",
      "nameEn": "Maqam Kurd",
      "intervalsQ": [
        0,
        2,
        6,
        10,
        14,
        16,
        20
      ],
      "characteristicQ": [
        2,
        16
      ],
      "tagsPt": [
        "12-TET",
        "Jins Kurd",
        "Frígio Árabe"
      ],
      "tagsEn": [
        "12-TET",
        "Jins Kurd",
        "Arabic Phrygian"
      ],
      "dossier": {
        "structurePt": "Compartilha as notas do modo Frígio, mas organiza-se por Jins Kurd (½ · 1 · 1) na base e Jins Nahawand na 4ª justa — mudando completamente os pontos de repouso.",
        "structureEn": "Shares pitches with Phrygian, but organizes around Jins Kurd (H · W · W) and Jins Nahawand on the 4th — transforming phrasing and resting tones.",
        "temperamentPt": "Totalmente executável em 12-TET, com micro-inflexões expressivas opcionais na ♭2.",
        "temperamentEn": "Fully playable in 12-TET, with optional expressive micro-inflections on ♭2.",
        "articulationPt": "Use a 4ª justa como pivô melódico antes de resolver na tônica via ♭2. Brilha em DADGAD, B Standard ou Drop A.",
        "articulationEn": "Use the perfect 4th as a melodic pivot before resolving down through ♭2 to the tonic. Shines in DADGAD, B Standard, or Drop A.",
        "repertoire": "Le Trio Joubran · Fairuz — Habaytak Bissayf"
      }
    },
    {
      "id": "maqam_lami",
      "category": "arabic",
      "subfamilyPt": "Família Nahawand, Kurd & Ajam",
      "subfamilyEn": "Nahawand, Kurd & Ajam Family",
      "namePt": "Maqam Lami (Iraque)",
      "nameEn": "Maqam Lami (Iraq)",
      "intervalsQ": [
        0,
        2,
        6,
        10,
        12,
        16,
        20
      ],
      "characteristicQ": [
        2,
        12
      ],
      "tagsPt": [
        "Duplo Jins Kurd",
        "12-TET",
        "Iraquiano"
      ],
      "tagsEn": [
        "Double Jins Kurd",
        "12-TET",
        "Iraqi"
      ],
      "dossier": {
        "structurePt": "Maqam iraquiano sem microtons formado por dois Jins Kurd empilhados (na tônica e na 4ª justa). Compartilha notas com o Lócrio, mas com condução melódica estável sobre 1 e 4.",
        "structureEn": "12-TET Iraqi maqam built from two stacked Jins Kurd tetrachords (on tonic and 4th). Shares pitches with Locrian yet phrases stably around degrees 1 and 4.",
        "temperamentPt": "12-TET nativo — mostra como a organização por tetracordes (Ajnas) transforma o temido modo Lócrio em uma linguagem melódica cantável.",
        "temperamentEn": "12-TET native — demonstrates how tetrachordal phrasing (Ajnas) turns Locrian pitches into a deeply lyrical melodic language.",
        "articulationPt": "Evite power chords na tônica; use a 4ª justa como base de repouso e crie riffs sinuosos com a ♭5 em afinações graves.",
        "articulationEn": "Skip tonic power chords; treat the perfect 4th as a resting pole and weave sinuous ♭5 lines in baritone tunings.",
        "repertoire": "Nazem al-Ghazali · Munir Bashir — Maqam Lami"
      }
    },
    {
      "id": "maqam_ajam",
      "category": "arabic",
      "subfamilyPt": "Família Nahawand, Kurd & Ajam",
      "subfamilyEn": "Nahawand, Kurd & Ajam Family",
      "namePt": "Maqam Ajam",
      "nameEn": "Maqam Ajam",
      "intervalsQ": [
        0,
        4,
        8,
        10,
        14,
        18,
        22
      ],
      "characteristicQ": [
        8,
        14
      ],
      "tagsPt": [
        "Jins Ajam",
        "12-TET",
        "Solar / Épico"
      ],
      "tagsEn": [
        "Jins Ajam",
        "12-TET",
        "Radiant / Epic"
      ],
      "dossier": {
        "structurePt": "Embora coincida em notas com a escala maior ocidental, o Ajam organiza-se por Jins Ajam na base (1 · 1 · ½) e modula frequentemente para Nahawand na 5ª ou Hijaz no 3º grau.",
        "structureEn": "Though pitch-identical to Western Major, Ajam phrases through Jins Ajam (W · W · H) and frequently modulates to Nahawand on the 5th or Hijaz on the 3rd.",
        "temperamentPt": "Na execução tradicional do Oud, a 3ª maior tende ligeiramente mais próxima da entonação justa (~386¢) sobre o drone.",
        "temperamentEn": "In traditional Oud performance, the major 3rd leans slightly toward Just Intonation (~386¢) against a drone.",
        "articulationPt": "Evite cadências V7–I óbvias: explore linhas horizontais sobre drones graves e voicings quintais abertos.",
        "articulationEn": "Bypass cliché V7–I cadences: explore horizontal melodies over low drones and open quintal voicings.",
        "repertoire": "Mohammed Abdel Wahab · Samai Ajam"
      }
    },
    {
      "id": "std_ionian",
      "category": "greek",
      "subfamilyPt": "Modos Maiores (Brilho)",
      "subfamilyEn": "Major Modes (Bright)",
      "namePt": "Jônio (Maior Natural)",
      "nameEn": "Ionian (Natural Major)",
      "intervalsQ": [
        0,
        4,
        8,
        10,
        14,
        18,
        22
      ],
      "characteristicQ": [
        8,
        22
      ],
      "tagsPt": [
        "1º Grau",
        "12-TET",
        "Referência"
      ],
      "tagsEn": [
        "1st Degree",
        "12-TET",
        "Baseline"
      ],
      "dossier": {
        "structurePt": "Estrutura diatônica padrão (1 · 1 · ½ · 1 · 1 · 1 · ½). Ponto de referência para medir todas as alterações cromáticas e microtonais.",
        "structureEn": "Standard diatonic blueprint (W · W · H · W · W · W · H). Baseline reference for measuring every chromatic and microtonal alteration.",
        "temperamentPt": "12-TET padrão; compare com Lídio (♯4), Mixolídio (♭7) e Maqam Rast (3½♭, 7½♭).",
        "temperamentEn": "Standard 12-TET; contrast with Lydian (♯4), Mixolydian (♭7), and Maqam Rast (3½♭, 7½♭).",
        "articulationPt": "Para soar modal em vez de tonal, experimente voicings add9(no3) e pedais contínuos evitando resolver a 7ª maior diretamente na tônica.",
        "articulationEn": "To sound modal rather than functional, use add9(no3) voicings and pedal tones while avoiding cliché leading-tone resolutions.",
        "repertoire": "Steve Reich · Brian Eno · Bill Frisell"
      }
    },
    {
      "id": "std_lydian",
      "category": "greek",
      "subfamilyPt": "Modos Maiores (Brilho)",
      "subfamilyEn": "Major Modes (Bright)",
      "namePt": "Lídio",
      "nameEn": "Lydian",
      "intervalsQ": [
        0,
        4,
        8,
        12,
        14,
        18,
        22
      ],
      "characteristicQ": [
        12
      ],
      "tagsPt": [
        "4ª Aumentada",
        "Luminoso",
        "Post-Rock / Jazz"
      ],
      "tagsEn": [
        "Augmented 4th",
        "Luminous",
        "Post-Rock / Jazz"
      ],
      "dossier": {
        "structurePt": "Empilhamento completo de 7 quintas justas (C–G–D–A–E–B–F♯). A ♯4 elimina a tensão de evitar-nota da 4ª justa sobre acordes maiores.",
        "structureEn": "Complete stack of 7 perfect fifths. The ♯4 removes the avoid-note rub over major harmony, opening vast shimmering sonorities.",
        "temperamentPt": "Forte afinidade com a afinação Open Lydian (F–A–C–G–C–E) e com harmônicos naturais.",
        "temperamentEn": "Strong affinity with Open Lydian tuning (F–A–C–G–C–E) and natural string harmonics.",
        "articulationPt": "Deixe cordas soltas ressoarem junto com díades de ♯4–5 ou 7–♯4 em volume swells e reverb longo.",
        "articulationEn": "Let open strings ring sympathetically against ♯4–5 or 7–♯4 dyads using volume swells and lush reverb.",
        "repertoire": "Deafheaven (shoegaze sections) · Pat Metheny · Joe Satriani"
      }
    },
    {
      "id": "std_mixolydian",
      "category": "greek",
      "subfamilyPt": "Modos Maiores (Brilho)",
      "subfamilyEn": "Major Modes (Bright)",
      "namePt": "Mixolídio",
      "nameEn": "Mixolydian",
      "intervalsQ": [
        0,
        4,
        8,
        10,
        14,
        18,
        20
      ],
      "characteristicQ": [
        8,
        20
      ],
      "tagsPt": [
        "7ª Menor",
        "Groove / Drone",
        "5º Grau"
      ],
      "tagsEn": [
        "Minor 7th",
        "Groove / Drone",
        "5th Degree"
      ],
      "dossier": {
        "structurePt": "Escala maior com ♭7: combina o brilho da 3ª maior com a gravidade relaxada e hipnótica da sétima menor — muito presente em raga Khamaj, baião e rock psicodélico.",
        "structureEn": "Major scale with ♭7: combines major-3rd brightness with a relaxed, hypnotic ♭7 gravity central to Raga Khamaj, baião, and psychedelic rock.",
        "temperamentPt": "12-TET padrão; a ♭7 aproxima-se do 7º harmônico natural (-31¢).",
        "temperamentEn": "Standard 12-TET; its ♭7 evokes the natural 7th overtone partial (-31¢).",
        "articulationPt": "Explore drones graves em B ou A Standard combinados com acordes maiores sobre o grau ♭VII (ex.: A sobre B).",
        "articulationEn": "Explore low drones in B or A Standard paired with ♭VII major triads (e.g., A over B).",
        "repertoire": "King Gizzard · Rory Gallagher · John Coltrane (modal vamps)"
      }
    },
    {
      "id": "std_dorian",
      "category": "greek",
      "subfamilyPt": "Modos Menores & Escuros",
      "subfamilyEn": "Minor & Dark Modes",
      "namePt": "Dórico",
      "nameEn": "Dorian",
      "intervalsQ": [
        0,
        4,
        6,
        10,
        14,
        18,
        20
      ],
      "characteristicQ": [
        18
      ],
      "tagsPt": [
        "6ª Maior",
        "Palíndromo",
        "Jazz / Fusion"
      ],
      "tagsEn": [
        "Major 6th",
        "Palindromic",
        "Jazz / Fusion"
      ],
      "dossier": {
        "structurePt": "Escala palíndroma (1 · ½ · 1 · 1 · 1 · ½ · 1): idêntica de frente para trás. A 6ª maior sobre base menor traz brilho modal equilibrado.",
        "structureEn": "Palindromic interval structure (W · H · W · W · W · H · W). The natural 6th over a minor triad creates balanced modal lift.",
        "temperamentPt": "Referência fundamental para contrastar com Bayati (rebaixando a 2ª em ¼ de tom) ou Kurd/Frígio (rebaixando a 2ª em ½ tom).",
        "temperamentEn": "Ideal baseline for contrasting with Bayati (lowering the 2nd by a quarter-tone) or Kurd/Phrygian (lowering the 2nd by a semitone).",
        "articulationPt": "Explore voicings quartais (So What) construídos sobre os graus 1, 2 e 5 para comping modal contemporâneo.",
        "articulationEn": "Explore quartal (So What) voicings built on degrees 1, 2, and 5 for modern modal comping.",
        "repertoire": "Miles Davis — So What · Charles Mingus · Grant Green"
      }
    },
    {
      "id": "std_aeolian",
      "category": "greek",
      "subfamilyPt": "Modos Menores & Escuros",
      "subfamilyEn": "Minor & Dark Modes",
      "namePt": "Eólio (Menor Natural)",
      "nameEn": "Aeolian (Natural Minor)",
      "intervalsQ": [
        0,
        4,
        6,
        10,
        14,
        16,
        20
      ],
      "characteristicQ": [
        6,
        16
      ],
      "tagsPt": [
        "6ª Menor",
        "6º Grau",
        "12-TET"
      ],
      "tagsEn": [
        "Minor 6th",
        "6th Degree",
        "12-TET"
      ],
      "dossier": {
        "structurePt": "Base do menor natural ocidental (1 · ½ · 1 · 1 · ½ · 1 · 1). A presença conjunta de ♭3, ♭6 e ♭7 entrega peso dramático sem a sensível artificial da menor harmônica.",
        "structureEn": "Western natural minor foundation (W · H · W · W · H · W · W). Combining ♭3, ♭6, and ♭7 yields dramatic weight without harmonic-minor leading-tone pull.",
        "temperamentPt": "Compare diretamente com Nahawand (elevando a 7ª) e com Frígio (rebaixando a 2ª).",
        "temperamentEn": "Compare directly with Nahawand (raising the 7th) and Phrygian (lowering the 2nd).",
        "articulationPt": "Em B ou A Standard, use acordes suspensos add9 e quintais abertos deixando a ♭6 gerar tensão melancólica sobre o bordão.",
        "articulationEn": "In B or A Standard, pair open add9/quintal voicings with lingering ♭6 melodies over low drones.",
        "repertoire": "Boris · Radiohead · Black Sabbath · Iron Maiden"
      }
    },
    {
      "id": "std_phrygian",
      "category": "greek",
      "subfamilyPt": "Modos Menores & Escuros",
      "subfamilyEn": "Minor & Dark Modes",
      "namePt": "Frígio",
      "nameEn": "Phrygian",
      "intervalsQ": [
        0,
        2,
        6,
        10,
        14,
        16,
        20
      ],
      "characteristicQ": [
        2,
        16
      ],
      "tagsPt": [
        "2ª Menor (♭2)",
        "Metal / Flamenco",
        "3º Grau"
      ],
      "tagsEn": [
        "Minor 2nd (♭2)",
        "Metal / Flamenco",
        "3rd Degree"
      ],
      "dossier": {
        "structurePt": "Caracterizado pela força gravitacional imediata da ♭2 sobre a tônica. Pilar absoluto do metal extremo, doom, flamenco e base estrutural do Maqam Kurd.",
        "structureEn": "Defined by the stark downward gravity of ♭2 onto the tonic. A pillar of extreme metal, doom, flamenco, and the pitch foundation of Maqam Kurd.",
        "temperamentPt": "12-TET nativo; a tensão 1–♭2 ganha peso tectônico nas cordas graves em B Standard e A Standard.",
        "temperamentEn": "12-TET native; the 1–♭2 semitone clash hits with tectonic weight on low B Standard and A Standard strings.",
        "articulationPt": "Crie riffs rítmicos alternando a 6ª corda solta (tônica) com a casa 1 (♭2) e tríades maiores construídas sobre a ♭2 (acorde napolitano).",
        "articulationEn": "Build rhythmic riffs alternating open 6th-string tonic against fret 1 (♭2) and major triads built on ♭2 (Neapolitan color).",
        "repertoire": "Metallica · Meshuggah · Paco de Lucía · Boris"
      }
    },
    {
      "id": "std_locrian",
      "category": "greek",
      "subfamilyPt": "Modos Menores & Escuros",
      "subfamilyEn": "Minor & Dark Modes",
      "namePt": "Lócrio",
      "nameEn": "Locrian",
      "intervalsQ": [
        0,
        2,
        6,
        10,
        12,
        16,
        20
      ],
      "characteristicQ": [
        2,
        12
      ],
      "tagsPt": [
        "Quinta Diminuta (♭5)",
        "Instável",
        "7º Grau"
      ],
      "tagsEn": [
        "Diminished 5th (♭5)",
        "Unstable",
        "7th Degree"
      ],
      "dossier": {
        "structurePt": "O único modo diatônico sem 5ª justa (tríade diminuta na tônica: 1–♭3–♭5). A instabilidade constante o torna perfeito para texturas tensas, noise e metal técnico.",
        "structureEn": "The sole diatonic mode lacking a perfect 5th (diminished tonic triad: 1–♭3–♭5). Constant harmonic instability fuels tense avant-garde and technical metal lines.",
        "temperamentPt": "12-TET nativo; experimente contrastar com Maqam Lami e Lócrio ♮2.",
        "temperamentEn": "12-TET native; contrast with Maqam Lami and Locrian ♮2.",
        "articulationPt": "Abrace o trítono (1–♭5) como consonância local em riffs graves de B/A Standard usando o Tricorde Vienense [0,1,6] como acorde central.",
        "articulationEn": "Embrace the tritone (1–♭5) as a local consonance in low B/A Standard riffs using the Viennese Trichord [0,1,6] as home base.",
        "repertoire": "Björk — Army of Me · Meshuggah · John Kirkpatrick"
      }
    },
    {
      "id": "harm_minor",
      "category": "minor_systems",
      "subfamilyPt": "Sistema Menor Harmônica",
      "subfamilyEn": "Harmonic Minor System",
      "namePt": "Menor Harmônica",
      "nameEn": "Harmonic Minor",
      "intervalsQ": [
        0,
        4,
        6,
        10,
        14,
        16,
        22
      ],
      "characteristicQ": [
        16,
        22
      ],
      "tagsPt": [
        "2ª Aumentada (♭6–7)",
        "Sensível 7M",
        "12-TET"
      ],
      "tagsEn": [
        "Augmented 2nd (♭6–7)",
        "Leading Tone 7",
        "12-TET"
      ],
      "dossier": {
        "structurePt": "Menor natural com 7ª maior: cria o salto dramático de 1½ tom entre ♭6 e 7 e gera o acorde dominante alterado no V grau. Espelha a malha do Maqam Nahawand.",
        "structureEn": "Natural minor with raised 7th: generates the dramatic 1½-step leap between ♭6 and 7 and mirrors the pitch set of Maqam Nahawand.",
        "temperamentPt": "12-TET padrão; sua arquitetura gera 4 tríades/tétrades icônicas (mMaj7, m7♭5, augMaj7, dim7).",
        "temperamentEn": "Standard 12-TET; yields iconic symmetrical dim7 arpeggios every 3 frets.",
        "articulationPt": "Combine arpejos diminutos de 3 em 3 casas com saltos de corda (String Skipping) na aba de Etudes Procedurais.",
        "articulationEn": "Combine symmetrical dim7 arpeggios shifted every 3 frets with String Skipping in the Procedural Etude tab.",
        "repertoire": "J.S. Bach · Rachmaninoff · Yngwie Malmsteen · Martyr"
      }
    },
    {
      "id": "phrygian_dominant",
      "category": "minor_systems",
      "subfamilyPt": "Sistema Menor Harmônica",
      "subfamilyEn": "Harmonic Minor System",
      "namePt": "Frígio Dominante (5º Grau Harm. Menor)",
      "nameEn": "Phrygian Dominant (5th of Harm. Minor)",
      "intervalsQ": [
        0,
        2,
        8,
        10,
        14,
        16,
        20
      ],
      "characteristicQ": [
        2,
        8
      ],
      "tagsPt": [
        "Jins Hijaz (12-TET)",
        "Freygish",
        "Flamenco / Metal"
      ],
      "tagsEn": [
        "Jins Hijaz (12-TET)",
        "Freygish",
        "Flamenco / Metal"
      ],
      "dossier": {
        "structurePt": "5º modo da menor harmônica (1 · ♭2 · 3 · 4 · 5 · ♭6 · ♭7). Reúne o tetracorde Hijaz na base com ♭6 e ♭7 naturais — clássico no flamenco, klezmer (Freygish) e metal extremo.",
        "structureEn": "5th mode of harmonic minor (1 · ♭2 · 3 · 4 · 5 · ♭6 · ♭7). Combines the Hijaz lower tetrachord with ♭6 and ♭7 — iconic in flamenco, klezmer (Freygish), and metal.",
        "temperamentPt": "Compare diretamente com Maqam Hijaz (que eleva a 6ª em +50¢ para 6½♭).",
        "temperamentEn": "Compare directly with Maqam Hijaz (which raises the 6th by +50¢ to neutral 6½♭).",
        "articulationPt": "Em B ou A Standard, alterne acordes maiores na tônica e na ♭II (ex.: B → C) com palhetada alternada rápida sobre a ♭2 e a 3ª maior.",
        "articulationEn": "In B or A Standard, alternate I and ♭II major chords (e.g., B → C) with rapid alternate picking across ♭2 and major 3rd.",
        "repertoire": "Nile · Opeth · Paco de Lucía · Klezmer Freygish"
      }
    },
    {
      "id": "lydian_sharp2",
      "category": "minor_systems",
      "subfamilyPt": "Sistema Menor Harmônica",
      "subfamilyEn": "Harmonic Minor System",
      "namePt": "Lídio ♯2 (6º Grau Harm. Menor)",
      "nameEn": "Lydian ♯2 (6th of Harm. Minor)",
      "intervalsQ": [
        0,
        6,
        8,
        12,
        14,
        18,
        22
      ],
      "characteristicQ": [
        6,
        12
      ],
      "tagsPt": [
        "1–♯2–3–♯4",
        "Exótico Luminoso",
        "12-TET"
      ],
      "tagsEn": [
        "1–♯2–3–♯4",
        "Exotic Luminous",
        "12-TET"
      ],
      "dossier": {
        "structurePt": "6º modo da menor harmônica: abre com um salto imediato de 2ª aumentada (1→♯2) seguido de 3ª maior e ♯4. Brilhante e estranhamente cinematográfico.",
        "structureEn": "6th mode of harmonic minor: opens immediately with an augmented-2nd leap (1→♯2) into major 3rd and ♯4 — luminous yet otherworldly.",
        "temperamentPt": "12-TET nativo; gera voicings Maj7(♯9, ♯11) de altíssima riqueza harmônica.",
        "temperamentEn": "12-TET native; spawns richly colored Maj7(♯9, ♯11) voicings.",
        "articulationPt": "Explore acordes abertos combinando tônica, ♯2 (♭3 enarmônica) e 3ª maior em oitavas diferentes (split-third voicing).",
        "articulationEn": "Explore wide voicings placing ♯2 (enharmonic ♭3) and major 3rd in separate octaves (split-third shimmer).",
        "repertoire": "Steve Vai · Allan Holdsworth · Raga Rasikapriya"
      }
    },
    {
      "id": "ultralocrian",
      "category": "minor_systems",
      "subfamilyPt": "Sistema Menor Harmônica",
      "subfamilyEn": "Harmonic Minor System",
      "namePt": "Ultralócrio / Superlócrio ♭♭7",
      "nameEn": "Ultralocrian / Superlocrian ♭♭7",
      "intervalsQ": [
        0,
        2,
        6,
        8,
        12,
        16,
        18
      ],
      "characteristicQ": [
        8,
        12,
        18
      ],
      "tagsPt": [
        "7º Grau Harm. Menor",
        "Diminuto Extremo",
        "12-TET"
      ],
      "tagsEn": [
        "7th of Harm. Minor",
        "Extreme Diminished",
        "12-TET"
      ],
      "dossier": {
        "structurePt": "O modo mais escuro do sistema menor harmônico: todos os intervalos além da tônica são alterados para baixo (♭2, ♭3, ♭4, ♭5, ♭6, ♭♭7).",
        "structureEn": "The darkest mode of the harmonic minor family: every interval above the tonic is lowered (♭2, ♭3, ♭4, ♭5, ♭6, ♭♭7).",
        "temperamentPt": "Funciona sobre acordes diminutos (dim7) e gera tensão máxima antes de resoluções cromáticas.",
        "temperamentEn": "Locks directly onto dim7 harmony and generates extreme tension before chromatic resolutions.",
        "articulationPt": "Experimente linhas descendentes cromáticas combinadas com saltos de corda em B/A Standard para passagens dissonantes de metal ou free jazz.",
        "articulationEn": "Try descending chromatic cells with string skips in B/A Standard for dissonant metal or free-jazz passages.",
        "repertoire": "Allan Holdsworth · Gorguts · Tigran Hamasyan"
      }
    },
    {
      "id": "melodic_minor",
      "category": "minor_systems",
      "subfamilyPt": "Sistema Menor Melódica (Jazz)",
      "subfamilyEn": "Melodic Minor System (Jazz)",
      "namePt": "Menor Melódica (Jazz Minor)",
      "nameEn": "Melodic Minor (Jazz Minor)",
      "intervalsQ": [
        0,
        4,
        6,
        10,
        14,
        18,
        22
      ],
      "characteristicQ": [
        6,
        18,
        22
      ],
      "tagsPt": [
        "♭3 + 6M + 7M",
        "Jazz Moderno",
        "12-TET"
      ],
      "tagsEn": [
        "♭3 + M6 + M7",
        "Modern Jazz",
        "12-TET"
      ],
      "dossier": {
        "structurePt": "Combina a base menor (♭3) com a metade superior da escala maior (6 e 7). Matriz fundamental da harmonia moderna do jazz e da fusão.",
        "structureEn": "Fuses a minor lower tetrachord (♭3) with a major upper tetrachord (6 and 7). Foundational matrix of modern jazz and fusion harmony.",
        "temperamentPt": "12-TET padrão; cada um de seus 7 modos produz sonoridades indispensáveis no improviso contemporâneo.",
        "temperamentEn": "Standard 12-TET; each of its 7 modes yields a cornerstone color of contemporary improvisation.",
        "articulationPt": "Toque sobre acordes m(maj7) ou m6/9 usando pilhas quartais e arpejos de tríade aumentada sobre o ♭3.",
        "articulationEn": "Solo over m(maj7) or m6/9 harmony using quartal stacks and augmented triads built on the ♭3.",
        "repertoire": "Kurt Rosenwinkel · Wayne Shorter · Pat Martino"
      }
    },
    {
      "id": "dorian_b2",
      "category": "minor_systems",
      "subfamilyPt": "Sistema Menor Melódica (Jazz)",
      "subfamilyEn": "Melodic Minor System (Jazz)",
      "namePt": "Dórico ♭2 (Frígio ♮6)",
      "nameEn": "Dorian ♭2 (Phrygian ♮6)",
      "intervalsQ": [
        0,
        2,
        6,
        10,
        14,
        18,
        20
      ],
      "characteristicQ": [
        2,
        18
      ],
      "tagsPt": [
        "2º Grau Mel. Menor",
        "Sus♭9",
        "Raga Natabhairavi / Jawa"
      ],
      "tagsEn": [
        "2nd of Mel. Minor",
        "Sus♭9",
        "Modal Jazz"
      ],
      "dossier": {
        "structurePt": "Funde o ataque sombrio da ♭2 frígia com o brilho elevado da 6ª maior dórica. Som assinatura de acordes sus4(♭9) e do modalismo moderno.",
        "structureEn": "Fuses the dark Phrygian ♭2 attack with the lifted Dorian natural 6th — signature sound of sus4(♭9) harmony and modern modal jazz.",
        "temperamentPt": "12-TET nativo; a distância entre ♭2 e 6ª maior forma um trítono oculto riquíssimo em cor.",
        "temperamentEn": "12-TET native; the hidden tritone between ♭2 and natural 6th yields extraordinary harmonic color.",
        "articulationPt": "Construa voicings suspensos (1–4–♭7–♭2 ou 1–5–6–♭2) e deslize frases modais em 5/4 ou 7/8.",
        "articulationEn": "Voice sus4(♭9) chords (1–4–♭7–♭2) and glide modal phrases across 5/4 or 7/8 cycles.",
        "repertoire": "Herbie Hancock · John Scofield · Tool (modal twists)"
      }
    },
    {
      "id": "lydian_augmented",
      "category": "minor_systems",
      "subfamilyPt": "Sistema Menor Melódica (Jazz)",
      "subfamilyEn": "Melodic Minor System (Jazz)",
      "namePt": "Lídio Aumentado (3º Grau Mel. Menor)",
      "nameEn": "Lydian Augmented (3rd of Mel. Minor)",
      "intervalsQ": [
        0,
        4,
        8,
        12,
        16,
        18,
        22
      ],
      "characteristicQ": [
        12,
        16
      ],
      "tagsPt": [
        "♯4 + ♯5",
        "Maj7♯5",
        "Cinematográfico"
      ],
      "tagsEn": [
        "♯4 + ♯5",
        "Maj7♯5",
        "Cinematic"
      ],
      "dossier": {
        "structurePt": "Lídio com a 5ª elevada (♯5): contém uma sequência impressionante de 5 tons inteiros seguidos (1–2–3–♯4–♯5), flutuando no limite da escala de tons inteiros.",
        "structureEn": "Lydian with a raised 5th (♯5): spans five consecutive whole steps (1–2–3–♯4–♯5), hovering right on the edge of the whole-tone realm.",
        "temperamentPt": "12-TET nativo; excelente para acordes Maj7(♯5, ♯11) e texturas etéreas.",
        "temperamentEn": "12-TET native; ideal for Maj7(♯5, ♯11) voicings and ethereal textures.",
        "articulationPt": "Misture tríades maiores separadas por 1 tom (ex.: D e E sobre C) e deixe o delay criar nuvens harmônicas.",
        "articulationEn": "Stack major triads a whole step apart (e.g., D and E over C) and let delay trails bloom into harmonic clouds.",
        "repertoire": "Allan Holdsworth · Ben Monder · Wayne Shorter"
      }
    },
    {
      "id": "mixolydian_b6",
      "category": "minor_systems",
      "subfamilyPt": "Sistema Menor Melódica (Jazz)",
      "subfamilyEn": "Melodic Minor System (Jazz)",
      "namePt": "Mixolídio ♭6 (Hindu / Aeolian Dom.)",
      "nameEn": "Mixolydian ♭6 (Hindu / Aeolian Dom.)",
      "intervalsQ": [
        0,
        4,
        8,
        10,
        14,
        16,
        20
      ],
      "characteristicQ": [
        8,
        16
      ],
      "tagsPt": [
        "5º Grau Mel. Menor",
        "3M + ♭6",
        "Melancólico Solar"
      ],
      "tagsEn": [
        "5th of Mel. Minor",
        "M3 + ♭6",
        "Bittersweet"
      ],
      "dossier": {
        "structurePt": "Escala maior na base (1–2–3–4–5) e menor natural no topo (♭6–♭7). Produz uma beleza agridoce cinematográfica muito usada em trilhas, música indiana e MPB.",
        "structureEn": "Major on the bottom (1–2–3–4–5) and natural minor on top (♭6–♭7). Delivers bittersweet cinematic beauty across film scores, Indian music, and MPB.",
        "temperamentPt": "12-TET nativo; base perfeita para acordes dominantes 7(♭13) ou modulações entre maior e menor paralelo.",
        "temperamentEn": "12-TET native; ideal over 7(♭13) harmony or fluid pivots between parallel major and minor.",
        "articulationPt": "Explore acordes com cordas soltas misturando a 3ª maior grave com a ♭6 aguda em dedilhados lentos.",
        "articulationEn": "Explore open-string voicings blending a low major 3rd against a shimmering high ♭6 in slow fingerpicking.",
        "repertoire": "Raga Charukeshi · Radiohead · George Harrison"
      }
    },
    {
      "id": "locrian_nat2",
      "category": "minor_systems",
      "subfamilyPt": "Sistema Menor Melódica (Jazz)",
      "subfamilyEn": "Melodic Minor System (Jazz)",
      "namePt": "Lócrio ♮2 (Meio-Diminuta)",
      "nameEn": "Locrian ♮2 (Half-Diminished)",
      "intervalsQ": [
        0,
        4,
        6,
        10,
        12,
        16,
        20
      ],
      "characteristicQ": [
        4,
        12
      ],
      "tagsPt": [
        "6º Grau Mel. Menor",
        "m7♭5(9)",
        "Jazz / Metal Prog"
      ],
      "tagsEn": [
        "6th of Mel. Minor",
        "m7♭5(9)",
        "Jazz / Prog Metal"
      ],
      "dossier": {
        "structurePt": "Eleva a ♭2 do Lócrio para 2ª maior (♮9), removendo a aspereza extrema do semitom inicial e tornando o acorde meio-diminuto (m7♭5) incrivelmente fluido.",
        "structureEn": "Raises Locrian’s ♭2 to a natural 2nd (9), smoothing out the harsh semitone clash and making half-diminished (m7♭5) lines remarkably fluid.",
        "temperamentPt": "12-TET padrão; padrão ouro do jazz moderno sobre IIø7 em tonalidades menores.",
        "temperamentEn": "Standard 12-TET; modern jazz gold standard over minor-key IIø7 chords.",
        "articulationPt": "Combine arpejos de m7♭5 com a 9ª natural em saltos de corda ou voicings Drop 2.",
        "articulationEn": "Weave m7♭5 arpeggios with natural 9th extensions using string skips or Drop 2 voicings.",
        "repertoire": "Kurt Rosenwinkel · Jonathan Kreisberg · Cynic"
      }
    },
    {
      "id": "altered_superlocrian",
      "category": "minor_systems",
      "subfamilyPt": "Sistema Menor Melódica (Jazz)",
      "subfamilyEn": "Melodic Minor System (Jazz)",
      "namePt": "Alterada / Superlócrio (7º Grau Mel. Menor)",
      "nameEn": "Altered / Superlocrian (7th of Mel. Minor)",
      "intervalsQ": [
        0,
        2,
        6,
        8,
        12,
        16,
        20
      ],
      "characteristicQ": [
        2,
        6,
        12,
        16
      ],
      "tagsPt": [
        "7alt (♭9 ♯9 ♯11 ♭13)",
        "Tensão Máxima",
        "Jazz / Avant"
      ],
      "tagsEn": [
        "7alt (♭9 ♯9 ♯11 ♭13)",
        "Max Tension",
        "Jazz / Avant"
      ],
      "dossier": {
        "structurePt": "Contém tônica, 3ª maior (enarmônica de ♭4), ♭7 e TODAS as 4 tensões alteradas possíveis (♭9, ♯9, ♭5/♯11, ♯5/♭13). A ferramenta definitiva de tensão dominante e cromatismo.",
        "structureEn": "Packs root, major 3rd, ♭7, and ALL four possible altered tensions (♭9, ♯9, ♭5/♯11, ♯5/♭13). The ultimate tool for altered dominant tension and outside lines.",
        "temperamentPt": "12-TET nativo; note que a metade inferior é diminuta e a metade superior é de tons inteiros.",
        "temperamentEn": "12-TET native; its lower half mirrors diminished symmetry while its upper half is pure whole-tone.",
        "articulationPt": "Sobre um acorde V7 ou pedal grave em B/A Standard, toque o desenho da menor melódica meio-tom acima da tônica.",
        "articulationEn": "Over a V7 chord or low B/A Standard pedal, think melodic minor just one fret above the root.",
        "repertoire": "John Coltrane · Allan Holdsworth · Charles Mingus"
      }
    },
    {
      "id": "harmonic_major",
      "category": "minor_systems",
      "subfamilyPt": "Sistemas Exóticos & Híbridos",
      "subfamilyEn": "Exotic & Hybrid Systems",
      "namePt": "Maior Harmônica (Jônio ♭6)",
      "nameEn": "Harmonic Major (Ionian ♭6)",
      "intervalsQ": [
        0,
        4,
        8,
        10,
        14,
        16,
        22
      ],
      "characteristicQ": [
        8,
        16,
        22
      ],
      "tagsPt": [
        "3M + ♭6 + 7M",
        "Simetria Híbrida",
        "12-TET"
      ],
      "tagsEn": [
        "M3 + ♭6 + M7",
        "Hybrid Symmetry",
        "12-TET"
      ],
      "dossier": {
        "structurePt": "Escala maior com 6ª menor: gera o salto dramático de 2ª aumentada (♭6→7) dentro de um ambiente de 3ª maior luminoso — sonoridade sublime de Rimsky-Korsakov e jazz moderno.",
        "structureEn": "Major scale with a lowered 6th: injects an augmented-2nd leap (♭6→7) into a bright major-3rd space — beloved by Rimsky-Korsakov and modern jazz.",
        "temperamentPt": "12-TET nativo; sua matriz gera acordes Maj7(♭13) e tríades menores no IV grau (empréstimo modal instantâneo).",
        "temperamentEn": "12-TET native; naturally embeds minor-iv borrowing directly inside a major scale.",
        "articulationPt": "Experimente alternar Maj7 na tônica com uma tríade diminuta sobre a 7ª maior ou ♭6 em arpejos limpos.",
        "articulationEn": "Alternate tonic Maj7 voicings against dim7 upper structures on ♭6 or 7 in clean arpeggios.",
        "repertoire": "Rimsky-Korsakov · Tigran Hamasyan · Pat Metheny"
      }
    },
    {
      "id": "neapolitan_minor",
      "category": "minor_systems",
      "subfamilyPt": "Sistemas Exóticos & Híbridos",
      "subfamilyEn": "Exotic & Hybrid Systems",
      "namePt": "Napolitana Menor",
      "nameEn": "Neapolitan Minor",
      "intervalsQ": [
        0,
        2,
        6,
        10,
        14,
        16,
        22
      ],
      "characteristicQ": [
        2,
        16,
        22
      ],
      "tagsPt": [
        "♭2 + 7M",
        "Frígio Harmônico",
        "Gótico / Clássico"
      ],
      "tagsEn": [
        "♭2 + M7",
        "Harmonic Phrygian",
        "Gothic / Classical"
      ],
      "dossier": {
        "structurePt": "Combina a ♭2 sombria do Frígio com a 7ª maior da menor harmônica, criando dois semitons que comprimem a tônica por cima e por baixo (7–1–♭2).",
        "structureEn": "Combines Phrygian’s dark ♭2 with harmonic minor’s leading tone 7, squeezing the tonic between two semitones (7–1–♭2).",
        "temperamentPt": "12-TET nativo; altíssima carga dramática para riffs barrocos, doom e blackgaze.",
        "temperamentEn": "12-TET native; massive dramatic charge for baroque, doom, and blackgaze guitar.",
        "articulationPt": "Em B ou A Standard, crie pedais rápidos em tremolo picking fechando a tônica entre 7 e ♭2.",
        "articulationEn": "In B or A Standard, build tremolo-picked pedal figures framing the tonic tightly between 7 and ♭2.",
        "repertoire": "Beethoven · Vivaldi · Emperor · Ulver"
      }
    },
    {
      "id": "enigmatic_verdi",
      "category": "minor_systems",
      "subfamilyPt": "Sistemas Exóticos & Híbridos",
      "subfamilyEn": "Exotic & Hybrid Systems",
      "namePt": "Escala Enigmática (Verdi)",
      "nameEn": "Enigmatic Scale (Verdi)",
      "intervalsQ": [
        0,
        2,
        8,
        12,
        16,
        20,
        22
      ],
      "characteristicQ": [
        2,
        12,
        16,
        20
      ],
      "tagsPt": [
        "Sem 4ª nem 5ª Justa",
        "Cromática / Tons Inteiros",
        "Experimental"
      ],
      "tagsEn": [
        "No P4 or P5",
        "Chromatic / Whole-Tone",
        "Experimental"
      ],
      "dossier": {
        "structurePt": "Imortalizada por Giuseppe Verdi: não possui 4ª justa NEM 5ª justa! Abre com ♭2 e 3ª maior, atravessa quatro tons inteiros (3–♯4–♯5–♯6) e fecha com semitom na 7ª maior.",
        "structureEn": "Immortalized by Verdi: contains NEITHER a perfect 4th NOR a perfect 5th! Opens with ♭2→3, glides through four whole steps (3–♯4–♯5–♯6), and closes chromatically via 7.",
        "temperamentPt": "12-TET nativo; desafia completamente o ouvido tonal pela ausência total de quintas estruturais na tônica.",
        "temperamentEn": "12-TET native; completely disorients tonal gravity due to the total absence of perfect 4th and 5th above the root.",
        "articulationPt": "Use sem 5ª no drone (apenas tônica pura) e explore arpejos aumentados e clusters na região média do braço.",
        "articulationEn": "Disable the drone 5th (pure tonic only) and explore augmented arpeggios and clusters across the mid neck.",
        "repertoire": "Giuseppe Verdi — Ave Maria · Joe Satriani"
      }
    },
    {
      "id": "raga_bhairav",
      "category": "global",
      "subfamilyPt": "Ragas Indianos (Hindustani / Carnático)",
      "subfamilyEn": "Indian Ragas (Hindustani / Carnatic)",
      "namePt": "Raga Bhairav (Thaat)",
      "nameEn": "Raga Bhairav (Thaat)",
      "intervalsQ": [
        0,
        2,
        8,
        10,
        14,
        16,
        22
      ],
      "characteristicQ": [
        2,
        16
      ],
      "tagsPt": [
        "Dupla Harmônica",
        "Andolan",
        "Raga da Aurora"
      ],
      "tagsEn": [
        "Double Harmonic",
        "Andolan",
        "Dawn Raga"
      ],
      "dossier": {
        "structurePt": "Simetria espelhada entre os dois tetracordes (½ · 1½ · ½ | 1 | ½ · 1½ · ½). Equivalente à escala Bizantina / Hijaz Kar.",
        "structureEn": "Mirrored symmetry across both tetrachords (H · m3 · H | W | H · m3 · H). Equivalent to Byzantine / Hijaz Kar.",
        "temperamentPt": "No Hindustani clássico, Komal Re (♭2) e Komal Dha (♭6) recebem Andolan — uma oscilação microtonal lenta e solene.",
        "temperamentEn": "In Hindustani practice, Komal Re (♭2) and Komal Dha (♭6) receive Andolan — a slow, solemn microtonal oscillation.",
        "articulationPt": "Ligue o Drone com 5ª justa e pratique bends lentos (Meend) ligando a tônica à 3ª maior passando pela ♭2 sem atacar novamente.",
        "articulationEn": "Turn on the Drone with 5th and practice slow bends (Meend) gliding between tonic, ♭2, and major 3rd on a single pick stroke.",
        "repertoire": "Ravi Shankar — Raga Bhairav · Nikhil Banerjee"
      }
    },
    {
      "id": "raga_marwa",
      "category": "global",
      "subfamilyPt": "Ragas Indianos (Hindustani / Carnático)",
      "subfamilyEn": "Indian Ragas (Hindustani / Carnatic)",
      "namePt": "Raga Marwa (Hexatônica)",
      "nameEn": "Raga Marwa (Hexatonic)",
      "intervalsQ": [
        0,
        2,
        8,
        12,
        18,
        22
      ],
      "characteristicQ": [
        2,
        12,
        18
      ],
      "tagsPt": [
        "Sem 5ª Justa",
        "Crepúsculo",
        "Tensão Suspensa"
      ],
      "tagsEn": [
        "No Perfect 5th",
        "Dusk Raga",
        "Suspended Tension"
      ],
      "dossier": {
        "structurePt": "Omite deliberadamente a 5ª justa! Combina ♭2, 3ª maior, ♯4 (Tivra Ma), 6ª maior e 7ª maior — criando sensação de flutuação sem chão harmônico.",
        "structureEn": "Deliberately omits the perfect 5th! Combines ♭2, major 3rd, ♯4 (Tivra Ma), major 6th, and major 7th — producing an ungrounded, floating aura.",
        "temperamentPt": "Como não há 5ª justa, evite ligar a 5ª no drone (deixe apenas a tônica pura) para preservar o vazio acústico típico do Marwa.",
        "temperamentEn": "Because the 5th is omitted, keep the drone on pure tonic (5th off) to preserve Marwa’s stark acoustic suspension.",
        "articulationPt": "Trate a ♭2 e a 6ª maior como polos de repouso temporário, evitando cair na tônica cedo demais. Ótima para shoegaze/ambient.",
        "articulationEn": "Treat ♭2 and major 6th as temporary resting poles, delaying tonic resolution. Stellar for shoegaze and ambient textures.",
        "repertoire": "Ali Akbar Khan — Raga Marwa · Derek Bailey"
      }
    },
    {
      "id": "raga_todi",
      "category": "global",
      "subfamilyPt": "Ragas Indianos (Hindustani / Carnático)",
      "subfamilyEn": "Indian Ragas (Hindustani / Carnatic)",
      "namePt": "Raga Todi (Miyan Ki Todi)",
      "nameEn": "Raga Todi (Miyan Ki Todi)",
      "intervalsQ": [
        0,
        2,
        6,
        12,
        14,
        16,
        22
      ],
      "characteristicQ": [
        2,
        6,
        12
      ],
      "tagsPt": [
        "♭2 · ♭3 · ♯4 · ♭6 · 7",
        "Raga da Manhã",
        "Profundo"
      ],
      "tagsEn": [
        "♭2 · ♭3 · ♯4 · ♭6 · 7",
        "Morning Raga",
        "Profound"
      ],
      "dossier": {
        "structurePt": "Um dos ragas mais venerados do norte da Índia: reúne ♭2, ♭3, Tivra Ma (♯4), ♭6 e 7ª maior. Compartilha o conjunto 12-TET do Maqam Athar Kurd.",
        "structureEn": "One of North India’s most revered ragas: unites ♭2, ♭3, Tivra Ma (♯4), ♭6, and major 7th. Shares the 12-TET pitch set of Maqam Athar Kurd.",
        "temperamentPt": "Na execução tradicional, Komal Ga (♭3) e Komal Re (♭2) são entoados bem baixos (ati-komal), puxando em direção à tônica.",
        "temperamentEn": "Traditionally, Komal Ga (♭3) and Komal Re (♭2) are intoned extra-low (ati-komal), pulling gently toward the tonic.",
        "articulationPt": "Use o Etude Linear em Corda Única com glissandos suaves do ♯4 descendo até a ♭2 com sustain limpo ou overdrive cremoso.",
        "articulationEn": "Use the Single-String Linear Etude with smooth glissandi descending from ♯4 through ♭3 to ♭2 with clean sustain.",
        "repertoire": "Vilayat Khan — Raga Todi · Hariprasad Chaurasia"
      }
    },
    {
      "id": "raga_purvi",
      "category": "global",
      "subfamilyPt": "Ragas Indianos (Hindustani / Carnático)",
      "subfamilyEn": "Indian Ragas (Hindustani / Carnatic)",
      "namePt": "Raga Purvi (Thaat)",
      "nameEn": "Raga Purvi (Thaat)",
      "intervalsQ": [
        0,
        2,
        8,
        12,
        14,
        16,
        22
      ],
      "characteristicQ": [
        2,
        12,
        16
      ],
      "tagsPt": [
        "♭2 · 3 · ♯4 · ♭6 · 7",
        "Entardecer",
        "12-TET"
      ],
      "tagsEn": [
        "♭2 · 3 · ♯4 · ♭6 · 7",
        "Sunset Raga",
        "12-TET"
      ],
      "dossier": {
        "structurePt": "Funde a ♭2 e a ♭6 sombrias do Bhairav com o brilho penetrante do Tivra Ma (♯4), criando um contraste místico de pôr do sol.",
        "structureEn": "Merges Bhairav’s dark ♭2 and ♭6 with the piercing brightness of Tivra Ma (♯4), conjuring a mystical twilight tension.",
        "temperamentPt": "12-TET nativo; contrasta o semitom ♯4→5 com a 2ª aumentada ♭2→3.",
        "temperamentEn": "12-TET native; balances the ♯4→5 semitone against the ♭2→3 augmented second.",
        "articulationPt": "Experimente sobrepor um drone na tônica e 5ª enquanto cria linhas angulares em 7/8 ou 10/8.",
        "articulationEn": "Layer a tonic+5th drone underneath angular lines over 7/8 or 10/8 cycles.",
        "repertoire": "Nikhil Banerjee — Raga Purvi · John McLaughlin (Shakti)"
      }
    },
    {
      "id": "raga_hansadhwani",
      "category": "global",
      "subfamilyPt": "Ragas Indianos (Hindustani / Carnático)",
      "subfamilyEn": "Indian Ragas (Hindustani / Carnatic)",
      "namePt": "Raga Hansadhwani (Pentatônica 7M)",
      "nameEn": "Raga Hansadhwani (Maj7 Pentatonic)",
      "intervalsQ": [
        0,
        4,
        8,
        14,
        22
      ],
      "characteristicQ": [
        8,
        22
      ],
      "tagsPt": [
        "1 · 2 · 3 · 5 · 7",
        "Auspiciosa",
        "Pentatônica"
      ],
      "tagsEn": [
        "1 · 2 · 3 · 5 · 7",
        "Auspicious",
        "Pentatonic"
      ],
      "dossier": {
        "structurePt": "Pentatônica luminosa da tradição carnática e hindustani: substitui a 6ª da pentatônica maior clássica pela 7ª maior (1–2–3–5–7).",
        "structureEn": "Radiant pentatonic from Carnatic and Hindustani traditions: swaps the standard major pentatonic’s 6th for a shimmering major 7th (1–2–3–5–7).",
        "temperamentPt": "12-TET nativo; gera arpejos Maj9 abertos sem esforço em qualquer região do braço.",
        "temperamentEn": "12-TET native; yields effortless open Maj9 arpeggios anywhere on the neck.",
        "articulationPt": "Excelente para tapping, string skipping e passagens limpas/ambient com delay rítmico.",
        "articulationEn": "Outstanding for tapping, string skipping, and clean ambient passages with rhythmic delay.",
        "repertoire": "L. Subramaniam · Rashid Khan · Allan Holdsworth"
      }
    },
    {
      "id": "jp_insen",
      "category": "global",
      "subfamilyPt": "Japão & Gamelan (Ásia)",
      "subfamilyEn": "Japan & Gamelan (Asia)",
      "namePt": "Escala In-Sen (Japão)",
      "nameEn": "In-Sen Scale (Japan)",
      "intervalsQ": [
        0,
        2,
        10,
        14,
        20
      ],
      "characteristicQ": [
        2,
        10
      ],
      "tagsPt": [
        "Pentatônica",
        "Koto / Shakuhachi",
        "Quartal"
      ],
      "tagsEn": [
        "Pentatonic",
        "Koto / Shakuhachi",
        "Quartal"
      ],
      "dossier": {
        "structurePt": "Pentatônica semitonal (1 · ♭2 · 4 · 5 · ♭7). Gera automaticamente acordes suspensos, quartais e sonoridades de koto.",
        "structureEn": "Hemitonic pentatonic (1 · ♭2 · 4 · 5 · ♭7). Naturally yields suspended voicings, quartal stacks, and koto-like phrasing.",
        "temperamentPt": "Compatível com 12-TET, mas responde muito bem a micro-bends expressivos sobre a ♭2 e a ♭7 (estilo shakuhachi).",
        "temperamentEn": "12-TET native, yet responds wonderfully to subtle shakuhachi-style pitch bends on ♭2 and ♭7.",
        "articulationPt": "Experimente arpejar shapes abertos misturando cordas soltas e harmônicos naturais na 5ª, 7ª e 12ª casas.",
        "articulationEn": "Arpeggiate open shapes blending open strings with natural harmonics at the 5th, 7th, and 12th frets.",
        "repertoire": "Toru Takemitsu · Allan Holdsworth · Boris"
      }
    },
    {
      "id": "jp_hirajoshi",
      "category": "global",
      "subfamilyPt": "Japão & Gamelan (Ásia)",
      "subfamilyEn": "Japan & Gamelan (Asia)",
      "namePt": "Escala Hirajoshi (Japão)",
      "nameEn": "Hirajoshi Scale (Japan)",
      "intervalsQ": [
        0,
        4,
        6,
        14,
        16
      ],
      "characteristicQ": [
        6,
        16
      ],
      "tagsPt": [
        "1 · 2 · ♭3 · 5 · ♭6",
        "Koto",
        "5 Notas"
      ],
      "tagsEn": [
        "1 · 2 · ♭3 · 5 · ♭6",
        "Koto",
        "5-Note"
      ],
      "dossier": {
        "structurePt": "Clássica afinação de koto (1 · 2 · ♭3 · 5 · ♭6): dois grandes saltos de terça maior (♭3→5 e ♭6→1) dão contornos melódicos amplos e elegantes.",
        "structureEn": "Classic koto tuning (1 · 2 · ♭3 · 5 · ♭6): two wide major-3rd leaps (♭3→5 and ♭6→1) carve expansive, elegant melodic contours.",
        "temperamentPt": "12-TET nativo; funciona perfeitamente em afinações graves para riffs atmosféricos e solos de metal/fusion.",
        "temperamentEn": "12-TET native; works effortlessly in low baritone tunings for atmospheric riffs and metal/fusion solos.",
        "articulationPt": "Use o Etude de Sequências Intervalares para destacar os saltos abertos de ♭3→5 e ♭6→1 com legato.",
        "articulationEn": "Use the Intervallic Sequence Etude to spotlight the wide ♭3→5 and ♭6→1 leaps with fluid legato.",
        "repertoire": "Marty Friedman · Jason Becker · Toru Takemitsu"
      }
    },
    {
      "id": "jp_iwato",
      "category": "global",
      "subfamilyPt": "Japão & Gamelan (Ásia)",
      "subfamilyEn": "Japan & Gamelan (Asia)",
      "namePt": "Escala Iwato (Japão)",
      "nameEn": "Iwato Scale (Japan)",
      "intervalsQ": [
        0,
        2,
        10,
        12,
        20
      ],
      "characteristicQ": [
        2,
        12
      ],
      "tagsPt": [
        "1 · ♭2 · 4 · ♭5 · ♭7",
        "Sombria / Sem 5ª",
        "5 Notas"
      ],
      "tagsEn": [
        "1 · ♭2 · 4 · ♭5 · ♭7",
        "Dark / No P5",
        "5-Note"
      ],
      "dossier": {
        "structurePt": "Pentatônica obscura que combina ♭2, 4ª justa e trítono (♭5) sem 5ª justa. Sonoridade cortante, ritualística e ideal para riffs dissonantes.",
        "structureEn": "Dark pentatonic pairing ♭2, perfect 4th, and tritone (♭5) with no perfect 5th. Sharp, ritualistic, and devastating for dissonant riffs.",
        "temperamentPt": "12-TET nativo; contém o Tricorde Vienense [0,1,6] embutido na tônica.",
        "temperamentEn": "12-TET native; embeds the Viennese Trichord [0,1,6] straight off the tonic.",
        "articulationPt": "Em B ou A Standard, explore a frição entre 4ª justa e ♭5 com palm muting pesado ou fuzz de alta saturação.",
        "articulationEn": "In B or A Standard, exploit the 4th-vs-♭5 rub with heavy palm muting or saturated fuzz.",
        "repertoire": "Musica Tradicional Koto · Sunn O))) · Boris"
      }
    },
    {
      "id": "jp_kumoi",
      "category": "global",
      "subfamilyPt": "Japão & Gamelan (Ásia)",
      "subfamilyEn": "Japan & Gamelan (Asia)",
      "namePt": "Escala Kumoi (Japão)",
      "nameEn": "Kumoi Scale (Japan)",
      "intervalsQ": [
        0,
        4,
        6,
        14,
        18
      ],
      "characteristicQ": [
        6,
        18
      ],
      "tagsPt": [
        "1 · 2 · ♭3 · 5 · 6",
        "Dórica Pentatônica",
        "5 Notas"
      ],
      "tagsEn": [
        "1 · 2 · ♭3 · 5 · 6",
        "Dorian Pentatonic",
        "5-Note"
      ],
      "dossier": {
        "structurePt": "Versão luminosa da Hirajoshi com 6ª maior em vez de ♭6 — cria uma cor dórica cristalina e minimalista muito expressiva em acordes m6/9.",
        "structureEn": "Luminous sibling of Hirajoshi using a natural 6th instead of ♭6 — yields a crystalline, minimalist Dorian color over m6/9 harmony.",
        "temperamentPt": "12-TET nativo; perfeita sobre drones menores sem a previsibilidade da pentatônica menor comum.",
        "temperamentEn": "12-TET native; floats gracefully over minor drones without standard minor-pentatonic clichés.",
        "articulationPt": "Combine com harmônicos naturais na 12ª e 7ª casas para texturas espaciais e post-rock.",
        "articulationEn": "Blend with 12th- and 7th-fret natural harmonics for spacious post-rock textures.",
        "repertoire": "Bill Frisell · Ryuichi Sakamoto"
      }
    },
    {
      "id": "gamelan_pelog_24",
      "category": "global",
      "subfamilyPt": "Japão & Gamelan (Ásia)",
      "subfamilyEn": "Japan & Gamelan (Asia)",
      "namePt": "Gamelan Pelog (Aprox. 24-TET)",
      "nameEn": "Gamelan Pelog (24-TET Approx.)",
      "intervalsQ": [
        0,
        3,
        6,
        11,
        14,
        16,
        21
      ],
      "characteristicQ": [
        3,
        11,
        21
      ],
      "tagsPt": [
        "Java / Bali",
        "Microtonal",
        "24-TET"
      ],
      "tagsEn": [
        "Java / Bali",
        "Microtonal",
        "24-TET"
      ],
      "dossier": {
        "structurePt": "Aproximação em 24-TET da escala heptatônica indonésia Pelog (praticada frequentemente em subconjuntos pentatônicos como Pelog Bem ou Pelog Barang).",
        "structureEn": "24-TET approximation of the Indonesian 7-tone Pelog system (often performed in 5-tone subsets like Pelog Bem or Pelog Barang).",
        "temperamentPt": "Cada conjunto de Gamelan possui sua afinação única (embat); os graus em 150¢, 550¢ e 1050¢ capturam o contraste entre passos estreitos e amplos.",
        "temperamentEn": "Every Gamelan ensemble has a unique tuning (embat); degrees at 150¢, 550¢, and 1050¢ capture its stark contrast of narrow and wide steps.",
        "articulationPt": "Ative o modo Trastes 24-TET ou Slide e crie padrões entrelaçados (kotekan) com delay rítmico e o motor polimétrico em 7 ou 5.",
        "articulationEn": "Enable 24-TET Frets or Slide mode and build interlocking kotekan ostinatos with rhythmic delay and polymetric Track B.",
        "repertoire": "Gamelan Gong Kebyar · Lou Harrison · King Gizzard"
      }
    },
    {
      "id": "gamelan_slendro_24",
      "category": "global",
      "subfamilyPt": "Japão & Gamelan (Ásia)",
      "subfamilyEn": "Japan & Gamelan (Asia)",
      "namePt": "Gamelan Slendro (Aprox. 24-TET)",
      "nameEn": "Gamelan Slendro (24-TET Approx.)",
      "intervalsQ": [
        0,
        5,
        10,
        14,
        19
      ],
      "characteristicQ": [
        5,
        19
      ],
      "tagsPt": [
        "Pentatônica Quase-Equidistante",
        "24-TET",
        "Java / Bali"
      ],
      "tagsEn": [
        "Near-Equidistant Pentatonic",
        "24-TET",
        "Java / Bali"
      ],
      "dossier": {
        "structurePt": "Aproximação 24-TET da pentatônica Slendro (passos largos próximos de 240¢: 0, 250¢, 500¢, 700¢, 950¢), dissolvendo a sensação de terças maiores ou menores.",
        "structureEn": "24-TET approximation of the Slendro pentatonic (wide steps near 240¢: 0, 250¢, 500¢, 700¢, 950¢), dissolving traditional major/minor thirds.",
        "temperamentPt": "Os graus 5q (+250¢) e 19q (+950¢) criam batimentos acústicos fascinantes quando combinados com 4ª e 5ª justas.",
        "temperamentEn": "Degrees at 5q (+250¢) and 19q (+950¢) produce mesmerizing acoustic shimmer alongside the perfect 4th and 5th.",
        "articulationPt": "Explore em modo Slide ou Trastes 24-TET sobre polimetria 5×4 para texturas hipnóticas.",
        "articulationEn": "Explore in Slide or 24-TET Frets mode over a 5×4 polymeter for hypnotic textures.",
        "repertoire": "Gamelan Degung · Claude Debussy (influências) · Lou Harrison"
      }
    },
    {
      "id": "br_armorial_lydian_b7",
      "category": "global",
      "subfamilyPt": "Brasil & Ibérico (Modalismo)",
      "subfamilyEn": "Brazil & Iberian Modalism",
      "namePt": "Nordestina / Lídio ♭7 (Armorial)",
      "nameEn": "Northeastern / Lydian ♭7 (Armorial)",
      "intervalsQ": [
        0,
        4,
        8,
        12,
        14,
        18,
        20
      ],
      "characteristicQ": [
        12,
        20
      ],
      "tagsPt": [
        "Série Harmônica",
        "Movimento Armorial",
        "4º Grau Mel. Menor"
      ],
      "tagsEn": [
        "Acoustic Scale",
        "Armorial Movement",
        "4th of Mel. Minor"
      ],
      "dossier": {
        "structurePt": "Combina a ♯4 do Lídio com a ♭7 do Mixolídio (escala acústica / 4º modo da menor melódica). Base recorrente na rabeca, pífano e viola nordestina.",
        "structureEn": "Combines Lydian ♯4 with Mixolydian ♭7 (acoustic scale / 4th mode of melodic minor). Core color of Northeastern Brazilian rabeca, pífano, and viola.",
        "temperamentPt": "Aproxima-se diretamente dos parciais 7 (♭7 a -31¢) e 11 (♯4 a -49¢) da série harmônica natural.",
        "temperamentEn": "Closely mirrors partials 7 (♭7 at -31¢) and 11 (♯4 at -49¢) of the natural overtone series.",
        "articulationPt": "Ative os Harmônicos Espectrais e toque em DADGAD, Orkney ou B Modal usando bordões contínuos e o ciclo Malfuf (3+3+2).",
        "articulationEn": "Toggle Spectral Harmonics and try DADGAD, Orkney, or Baritone Modal with continuous drones and the Malfuf (3+3+2) cycle.",
        "repertoire": "Quinteto Armorial · Hermeto Pascoal · Elomar"
      }
    },
    {
      "id": "flamenco_andaluz",
      "category": "global",
      "subfamilyPt": "Brasil & Ibérico (Modalismo)",
      "subfamilyEn": "Brazil & Iberian Modalism",
      "namePt": "Escala Flamenca / Andaluza (8 Notas)",
      "nameEn": "Flamenco / Andalusian Scale (8-Note)",
      "intervalsQ": [
        0,
        2,
        6,
        8,
        10,
        14,
        16,
        20
      ],
      "characteristicQ": [
        2,
        6,
        8
      ],
      "tagsPt": [
        "♭3 + 3M (Bimodal)",
        "8 Notas",
        "Cadência Andaluza"
      ],
      "tagsEn": [
        "♭3 + M3 (Bimodal)",
        "8-Note",
        "Andalusian Cadence"
      ],
      "dossier": {
        "structurePt": "Une simultaneamente a ♭3 (Frígio) e a 3ª maior (Frígio Dominante) em uma malha de 8 notas — capturando o movimento real dos solos flamencos sobre a cadência andaluza.",
        "structureEn": "Unites both ♭3 (Phrygian) and major 3rd (Phrygian Dominant) inside an 8-note grid — capturing authentic flamenco phrasing over Andalusian cadences.",
        "temperamentPt": "12-TET nativo; o contraste entre ♭3 descendente e 3ª maior ascendente cria tensão expressiva imediata.",
        "temperamentEn": "12-TET native; contrasting ascending major 3rd against descending ♭3 generates immediate expressive fire.",
        "articulationPt": "Alterne rasgueados percussivos em B/A Standard com frases ligadas cruzando ♭2, ♭3 e 3ª maior.",
        "articulationEn": "Alternate percussive strums in B/A Standard with legato runs crossing ♭2, ♭3, and major 3rd.",
        "repertoire": "Paco de Lucía · Vicente Amigo · Tomatito"
      }
    },
    {
      "id": "messiaen_mode1",
      "category": "messiaen",
      "subfamilyPt": "Modos de Transposição Limitada (Messiaen)",
      "subfamilyEn": "Modes of Limited Transposition (Messiaen)",
      "namePt": "Messiaen Modo 1 (Tons Inteiros)",
      "nameEn": "Messiaen Mode 1 (Whole Tone)",
      "intervalsQ": [
        0,
        4,
        8,
        12,
        16,
        20
      ],
      "characteristicQ": [
        8,
        12,
        16
      ],
      "tagsPt": [
        "2 Transposições",
        "Simetria Total",
        "Onírico"
      ],
      "tagsEn": [
        "2 Transpositions",
        "Full Symmetry",
        "Dreamlike"
      ],
      "dossier": {
        "structurePt": "Seis tons inteiros exatos (1 · 1 · 1 · 1 · 1 · 1). Sem semitons nem 5ª justa — qualquer digitação repete-se identicamente a cada 2 casas pelo braço inteiro.",
        "structureEn": "Six consecutive whole steps. Zero semitones and zero perfect 5ths — any fretboard shape shifts identically every 2 frets across the entire neck.",
        "temperamentPt": "Apenas 2 coleções distintas existem em todo o sistema 12-TET (ex.: iniciando em C ou C♯).",
        "temperamentEn": "Only 2 distinct transpositions exist in all of 12-TET (starting on C or C♯).",
        "articulationPt": "Combine com a afinação Terças Maiores ou deslize tríades aumentadas de 2 em 2 casas com delay longo.",
        "articulationEn": "Pair with Major Thirds tuning or glide augmented triads every 2 frets into ambient delay.",
        "repertoire": "Claude Debussy · Olivier Messiaen · Thelonious Monk · King Crimson"
      }
    },
    {
      "id": "messiaen_mode2",
      "category": "messiaen",
      "subfamilyPt": "Modos de Transposição Limitada (Messiaen)",
      "subfamilyEn": "Modes of Limited Transposition (Messiaen)",
      "namePt": "Messiaen Modo 2 (Octatônica ½–1)",
      "nameEn": "Messiaen Mode 2 (Octatonic H–W)",
      "intervalsQ": [
        0,
        2,
        6,
        8,
        12,
        14,
        18,
        20
      ],
      "characteristicQ": [
        2,
        12
      ],
      "tagsPt": [
        "3 Transposições",
        "Simetria em 3ªm",
        "Diminuta Dom."
      ],
      "tagsEn": [
        "3 Transpositions",
        "m3 Symmetry",
        "Dom. Diminished"
      ],
      "dossier": {
        "structurePt": "Alternância estrita ½ · 1 · ½ · 1 · ½ · 1 · ½ · 1. Qualquer digitação pode ser deslocada exatamente 3 casas acima ou abaixo mantendo a mesma escala.",
        "structureEn": "Strict H · W alternation. Any fretboard geometry shifts identically every 3 frets up or down while remaining inside the exact same pitch collection.",
        "temperamentPt": "Simetria pura em 12-TET. Permite sobrepor quatro tríades maiores ou menores espaçadas por terças menores (ex.: C, E♭, F♯, A).",
        "temperamentEn": "Pure 12-TET symmetry. Allows superimposing four major or minor triads spaced by minor 3rds (e.g., C, E♭, F♯, A).",
        "articulationPt": "Desenhe um motivo de 4 notas em duas cordas e mova-o em blocos de +3 casas com palhetada híbrida ou tapping simétrico.",
        "articulationEn": "Build a 4-note cell across two strings and shift it in +3 fret blocks using hybrid picking or symmetrical tapping.",
        "repertoire": "Olivier Messiaen · Tigran Hamasyan · Meshuggah"
      }
    },
    {
      "id": "messiaen_mode2_wh",
      "category": "messiaen",
      "subfamilyPt": "Modos de Transposição Limitada (Messiaen)",
      "subfamilyEn": "Modes of Limited Transposition (Messiaen)",
      "namePt": "Messiaen Modo 2b (Octatônica 1–½)",
      "nameEn": "Messiaen Mode 2b (Octatonic W–H)",
      "intervalsQ": [
        0,
        4,
        6,
        10,
        12,
        16,
        18,
        22
      ],
      "characteristicQ": [
        6,
        12,
        22
      ],
      "tagsPt": [
        "3 Transposições",
        "Diminuta Tônica",
        "8 Notas"
      ],
      "tagsEn": [
        "3 Transpositions",
        "Tonic Diminished",
        "8-Note"
      ],
      "dossier": {
        "structurePt": "Inversão da Octatônica começando por tom inteiro (1 · ½ · 1 · ½). Ideal sobre acordes diminutos (dim7) e riffs cromáticos sombrios em B/A Standard.",
        "structureEn": "Whole-Half octatonic rotation (W · H · W · H). Locks directly onto dim7 chords and angular dark riffs in B/A Standard.",
        "temperamentPt": "Repete-se identicamente a cada 3 casas; contém 4 acordes menores com 7ª maior implícitos.",
        "temperamentEn": "Repeats verbatim every 3 frets; embeds four minor-major-7th structures.",
        "articulationPt": "Use o Etude de String Skipping em All Fourths ou B Standard movendo a mesma célula 3 casas por compasso.",
        "articulationEn": "Run the String Skipping Etude in All Fourths or B Standard, shifting the exact cell +3 frets per bar.",
        "repertoire": "Béla Bartók · Igor Stravinsky · Allan Holdsworth"
      }
    },
    {
      "id": "messiaen_mode3",
      "category": "messiaen",
      "subfamilyPt": "Modos de Transposição Limitada (Messiaen)",
      "subfamilyEn": "Modes of Limited Transposition (Messiaen)",
      "namePt": "Messiaen Modo 3 (9 Notas)",
      "nameEn": "Messiaen Mode 3 (9-Note)",
      "intervalsQ": [
        0,
        4,
        6,
        8,
        12,
        14,
        16,
        20,
        22
      ],
      "characteristicQ": [
        8,
        16
      ],
      "tagsPt": [
        "4 Transposições",
        "Simetria em 3ªM",
        "Aumentada"
      ],
      "tagsEn": [
        "4 Transpositions",
        "M3 Symmetry",
        "Augmented"
      ],
      "dossier": {
        "structurePt": "Divide a oitava em três células idênticas (1 · ½ · ½) espaçadas por terças maiores (4 casas). Em afinação Terças Maiores, o desenho se repete idêntico em todas as cordas.",
        "structureEn": "Divides the octave into three identical cells (W · H · H) spaced by major 3rds (4 frets). In Major Thirds tuning, the shape repeats identically across every string.",
        "temperamentPt": "Riquíssimo em tríades aumentadas e policordes em relação mediântica cromática (ex.: C, E, A♭).",
        "temperamentEn": "Rich in augmented triads and chromatic mediant polychords (e.g., C, E, A♭).",
        "articulationPt": "Combine com a afinação Terças Maiores ou crie arpejos diagonais simétricos deslocando 4 casas por vez.",
        "articulationEn": "Pair with Major Thirds tuning or craft diagonal symmetrical arpeggios shifting 4 frets at a time.",
        "repertoire": "Olivier Messiaen · Kurt Rosenwinkel · Allan Holdsworth"
      }
    },
    {
      "id": "messiaen_mode4",
      "category": "messiaen",
      "subfamilyPt": "Modos de Transposição Limitada (Messiaen)",
      "subfamilyEn": "Modes of Limited Transposition (Messiaen)",
      "namePt": "Messiaen Modo 4 (Simetria em Trítono)",
      "nameEn": "Messiaen Mode 4 (Tritone Symmetry)",
      "intervalsQ": [
        0,
        2,
        4,
        10,
        12,
        14,
        16,
        22
      ],
      "characteristicQ": [
        2,
        10,
        12
      ],
      "tagsPt": [
        "6 Transposições",
        "Clusters + Saltos",
        "Contemporâneo"
      ],
      "tagsEn": [
        "6 Transpositions",
        "Clusters + Leaps",
        "Contemporary"
      ],
      "dossier": {
        "structurePt": "Duas metades idênticas (½ · ½ · 1½ · ½) replicadas no trítono. Alterna blocos cromáticos densos com grandes vazios de terça menor.",
        "structureEn": "Two identical halves (H · H · m3 · H) replicated at the tritone. Alternates tight chromatic clusters with wide minor-3rd voids.",
        "temperamentPt": "Ideal para gerar voicings secundais/clusters que deslizam simetricamente em saltos de 6 casas.",
        "temperamentEn": "Ideal for building secundal cluster voicings that glide symmetrically in 6-fret leaps.",
        "articulationPt": "No Laboratório Harmônico, teste o Cluster Secundai sobre este modo e mova o voicing +6 casas.",
        "articulationEn": "In the Harmony Lab, try the Secundal Cluster over this mode and shift the voicing +6 frets.",
        "repertoire": "Olivier Messiaen — Turangalîla · Ben Monder"
      }
    },
    {
      "id": "messiaen_mode5",
      "category": "messiaen",
      "subfamilyPt": "Modos de Transposição Limitada (Messiaen)",
      "subfamilyEn": "Modes of Limited Transposition (Messiaen)",
      "namePt": "Messiaen Modo 5 (6 Notas)",
      "nameEn": "Messiaen Mode 5 (6-Note)",
      "intervalsQ": [
        0,
        2,
        10,
        12,
        14,
        22
      ],
      "characteristicQ": [
        2,
        10,
        12
      ],
      "tagsPt": [
        "6 Transposições",
        "Hexatônica Simétrica",
        "Vazios Amplos"
      ],
      "tagsEn": [
        "6 Transpositions",
        "Symmetric Hexatonic",
        "Wide Voids"
      ],
      "dossier": {
        "structurePt": "Subconjunto rarefeito do Modo 4 (½ · 2 · ½ | ½ · 2 · ½): dois grandes saltos de terça maior intercalados por clusters cromáticos simétricos no trítono.",
        "structureEn": "Sparse subset of Mode 4 (H · M3 · H | H · M3 · H): two wide major-3rd voids framed by tritone-mirrored semitone clusters.",
        "temperamentPt": "Contém dois Tricordes Vieneses [0,1,6] espelhados a distância de trítono.",
        "temperamentEn": "Contains two mirrored Viennese Trichords [0,1,6] separated by a tritone.",
        "articulationPt": "Excelente para guitarra limpa minimalista ou riffs arrastados em A Standard explorando saltos largos e semitons afiados.",
        "articulationEn": "Superb for sparse clean guitar or slow A Standard riffs exploiting wide leaps and razor semitones.",
        "repertoire": "Olivier Messiaen · Toru Takemitsu · Mary Halvorson"
      }
    },
    {
      "id": "messiaen_mode6",
      "category": "messiaen",
      "subfamilyPt": "Modos de Transposição Limitada (Messiaen)",
      "subfamilyEn": "Modes of Limited Transposition (Messiaen)",
      "namePt": "Messiaen Modo 6",
      "nameEn": "Messiaen Mode 6",
      "intervalsQ": [
        0,
        4,
        8,
        10,
        12,
        16,
        20,
        22
      ],
      "characteristicQ": [
        8,
        12
      ],
      "tagsPt": [
        "6 Transposições",
        "Simetria em Trítono",
        "Híbrido"
      ],
      "tagsEn": [
        "6 Transpositions",
        "Tritone Symmetry",
        "Hybrid"
      ],
      "dossier": {
        "structurePt": "Duas metades idênticas separadas por um trítono (1 · 1 · ½ · ½). Mistura a flutuação da escala de tons inteiros com tensões cromáticas afiadas.",
        "structureEn": "Two identical halves separated by a tritone (W · W · H · H). Blends whole-tone drift with razor-sharp chromatic tension.",
        "temperamentPt": "Qualquer frase ou acorde funciona exatamente igual 6 casas acima.",
        "temperamentEn": "Any melodic cell or chord shape transposes identically 6 frets up.",
        "articulationPt": "Use voicings com 2ªs menores internas (4 contra ♯4) deixando soar com delay longo para texturas cinematográficas.",
        "articulationEn": "Build voicings with internal minor 2nds (4 against ♯4 clusters) letting them bloom into long delay trails.",
        "repertoire": "Olivier Messiaen — Vingt Regards · Ben Monder"
      }
    },
    {
      "id": "messiaen_mode7",
      "category": "messiaen",
      "subfamilyPt": "Modos de Transposição Limitada (Messiaen)",
      "subfamilyEn": "Modes of Limited Transposition (Messiaen)",
      "namePt": "Messiaen Modo 7 (10 Notas)",
      "nameEn": "Messiaen Mode 7 (10-Note)",
      "intervalsQ": [
        0,
        2,
        4,
        6,
        10,
        12,
        14,
        16,
        18,
        22
      ],
      "characteristicQ": [
        2,
        10,
        12
      ],
      "tagsPt": [
        "6 Transposições",
        "Alta Densidade",
        "10 Notas"
      ],
      "tagsEn": [
        "6 Transpositions",
        "High Density",
        "10-Note"
      ],
      "dossier": {
        "structurePt": "O mais denso dos modos de Messiaen (½ · ½ · ½ · 1 · ½ repetido no trítono): omite apenas duas notas do total cromático (3ªM e ♭7), criando corredores cromáticos simétricos.",
        "structureEn": "Messiaen’s densest mode (H · H · H · W · H mirrored at the tritone): omits just two pitches from the chromatic total (M3 and ♭7), carving symmetrical chromatic corridors.",
        "temperamentPt": "Funciona como um filtro cromático altamente controlado para improvisação livre e linhas pós-tonais.",
        "temperamentEn": "Acts as a tightly controlled chromatic filter for free improvisation and post-tonal lines.",
        "articulationPt": "Use como paleta para pontilhismo, clusters e passagens cromáticas rápidas sobre ciclos ímpares (11/8 ou 13/16).",
        "articulationEn": "Use as a palette for pointillism, clusters, and rapid chromatic runs over odd cycles (11/8 or 13/16).",
        "repertoire": "Olivier Messiaen · Cecil Taylor · Derek Bailey"
      }
    },
    {
      "id": "sym_augmented",
      "category": "messiaen",
      "subfamilyPt": "Slonimsky & Outras Simetrias",
      "subfamilyEn": "Slonimsky & Other Symmetries",
      "namePt": "Escala Aumentada (Hexatônica 1½–½)",
      "nameEn": "Augmented Scale (Hexatonic m3–H)",
      "intervalsQ": [
        0,
        6,
        8,
        14,
        16,
        22
      ],
      "characteristicQ": [
        6,
        16
      ],
      "tagsPt": [
        "4 Transposições",
        "Dupla Tríade Aumentada",
        "Coltrane"
      ],
      "tagsEn": [
        "4 Transpositions",
        "Dual Augmented Triads",
        "Coltrane"
      ],
      "dossier": {
        "structurePt": "Alternância estrita 1½ · ½ (duas tríades aumentadas a distância de semitom: ex. C+ e B+). Base do ciclo harmônico de terças maiores (Coltrane Changes).",
        "structureEn": "Strict m3 · H alternation (two augmented triads a semitone apart: e.g., C+ and B+). Core engine behind major-third harmonic cycles (Coltrane Changes).",
        "temperamentPt": "Repete-se identicamente a cada 4 casas; riquíssima em tríades maiores e menores escondidas (C, E, A♭).",
        "temperamentEn": "Repeats identically every 4 frets; conceals major and minor triads on C, E, and A♭.",
        "articulationPt": "Crie arpejos quebrados saltando entre as duas tríades aumentadas com palhetada híbrida ou string skipping.",
        "articulationEn": "Weave broken arpeggios leaping between the two augmented triads using hybrid picking or string skipping.",
        "repertoire": "John Coltrane — Giant Steps · Oliver Nelson · Michael Brecker"
      }
    },
    {
      "id": "slonimsky_tritone_interp",
      "category": "messiaen",
      "subfamilyPt": "Slonimsky & Outras Simetrias",
      "subfamilyEn": "Slonimsky & Other Symmetries",
      "namePt": "Slonimsky #1 (Interpolação de Trítono)",
      "nameEn": "Slonimsky #1 (Tritone Interpolation)",
      "intervalsQ": [
        0,
        2,
        6,
        12,
        14,
        18
      ],
      "characteristicQ": [
        6,
        12
      ],
      "tagsPt": [
        "Slonimsky",
        "Angular",
        "6 Notas"
      ],
      "tagsEn": [
        "Slonimsky",
        "Angular",
        "6-Note"
      ],
      "dossier": {
        "structurePt": "Inspirado no Thesaurus de Nicolas Slonimsky: divide a oitava ao meio (trítono) e interpola cada metade com os mesmos saltos (½ · 1 · 1½).",
        "structureEn": "Drawn from Nicolas Slonimsky’s Thesaurus: bisects the octave at the tritone and interpolates each half identically (H · W · m3).",
        "temperamentPt": "Padrão simétrico de 6 notas excelente para quebrar hábitos escalares diatônicos e gerar linhas pós-bop / free jazz.",
        "temperamentEn": "A 6-note symmetrical grid ideal for breaking scalar muscle memory and generating angular post-bop or free-jazz lines.",
        "articulationPt": "Experimente em All Fourths (EADGCF ou B 4ths) com string skipping saltando uma corda entre cada par de notas.",
        "articulationEn": "Try in All Fourths (EADGCF or B 4ths) using string skipping between note pairs.",
        "repertoire": "Nicolas Slonimsky · John Coltrane · Eric Dolphy · Meshuggah"
      }
    },
    {
      "id": "scriabin_prometheus",
      "category": "messiaen",
      "subfamilyPt": "Slonimsky & Outras Simetrias",
      "subfamilyEn": "Slonimsky & Other Symmetries",
      "namePt": "Escala Prometeu / Acorde Místico (Scriabin)",
      "nameEn": "Prometheus / Mystic Scale (Scriabin)",
      "intervalsQ": [
        0,
        4,
        8,
        12,
        18,
        20
      ],
      "characteristicQ": [
        12,
        18,
        20
      ],
      "tagsPt": [
        "Acorde Místico",
        "Quartal Alterado",
        "6 Notas"
      ],
      "tagsEn": [
        "Mystic Chord",
        "Altered Quartal",
        "6-Note"
      ],
      "dossier": {
        "structurePt": "Baseada no Acorde Místico de Alexander Scriabin (pilha de quartas aumentadas, diminutas e justas: C–F♯–B♭–E–A–D). Omite a 5ª justa e brilha em cores impressionistas.",
        "structureEn": "Derived from Scriabin’s Mystic Chord (stacked augmented, diminished, and perfect 4ths: C–F♯–B♭–E–A–D). Fifth-less, iridescent, and impressionistic.",
        "temperamentPt": "12-TET nativo; equivale ao Lídio ♭7 sem a 5ª justa.",
        "temperamentEn": "12-TET native; effectively Lydian ♭7 stripped of its perfect 5th.",
        "articulationPt": "Use o Construtor de Voicings em All Fourths ou B Standard para montar acordes quartais brilhantes com ♯4 e ♭7.",
        "articulationEn": "Use the Voicing Solver in All Fourths or B Standard to build shimmering quartal chords with ♯4 and ♭7.",
        "repertoire": "Alexander Scriabin — Prometheus · Allan Holdsworth"
      }
    },
    {
      "id": "set_viennese_016",
      "category": "postTonal",
      "subfamilyPt": "Tricordes & Tetracordes (Forte)",
      "subfamilyEn": "Trichords & Tetrachords (Forte)",
      "namePt": "Tricorde Vienense [0, 1, 6]",
      "nameEn": "Viennese Trichord [0, 1, 6]",
      "intervalsQ": [
        0,
        2,
        12
      ],
      "characteristicQ": [
        2,
        12
      ],
      "tagsPt": [
        "Forte 3-5",
        "Vetor <100011>",
        "Atonal"
      ],
      "tagsEn": [
        "Forte 3-5",
        "Vector <100011>",
        "Atonal"
      ],
      "dossier": {
        "structurePt": "Assinatura da Segunda Escola de Viena (Webern, Berg, Schoenberg): reúne semitom, quarta justa e trítono em apenas três alturas.",
        "structureEn": "Signature of the Second Viennese School (Webern, Berg, Schoenberg): packs a semitone, perfect 4th, and tritone into just three pitches.",
        "temperamentPt": "Alta tensão harmônica com clareza estrutural extrema — zero terças maiores ou menores no vetor intervalar.",
        "temperamentEn": "High harmonic tension with razor-sharp clarity — zero major or minor thirds in its interval vector.",
        "articulationPt": "Toque como acordes espaçados de 3 cordas (tônica grave + trítono médio + ♭2 aguda) ou como arpejo pontilhista.",
        "articulationEn": "Voice as wide 3-string chords (low root + mid tritone + high ♭2) or pointillist sparse arpeggios.",
        "repertoire": "Anton Webern · Alban Berg · Sonny Sharrock · Mary Halvorson"
      }
    },
    {
      "id": "set_chromatic_third_014",
      "category": "postTonal",
      "subfamilyPt": "Tricordes & Tetracordes (Forte)",
      "subfamilyEn": "Trichords & Tetrachords (Forte)",
      "namePt": "Tricorde Menor-Maior [0, 1, 4]",
      "nameEn": "Major-Minor Trichord [0, 1, 4]",
      "intervalsQ": [
        0,
        2,
        8
      ],
      "characteristicQ": [
        2,
        8
      ],
      "tagsPt": [
        "Forte 3-3",
        "Vetor <101100>",
        "Célula Bartók / Hijaz"
      ],
      "tagsEn": [
        "Forte 3-3",
        "Vector <101100>",
        "Bartók / Hijaz Cell"
      ],
      "dossier": {
        "structurePt": "A célula fundamental que conecta Bartók, Webern e o início do Jins Hijaz: combina 2ª menor, 3ª menor e 3ª maior em três notas compactas.",
        "structureEn": "Foundational cell linking Bartók, Webern, and the opening of Jins Hijaz: packs a minor 2nd, minor 3rd, and major 3rd into three tight pitches.",
        "temperamentPt": "Vetor <101100>: zero quartas, quintas ou trítonos — pureza expressiva focada em semitons e terças.",
        "temperamentEn": "Vector <101100>: zero 4ths, 5ths, or tritones — pure chromatic-third expressiveness.",
        "articulationPt": "Desloque esse tricorde em terças maiores (4 casas) para gerar o Hexacorde de Schoenberg completo pelo braço.",
        "articulationEn": "Shift this trichord in major 3rds (4 frets) to trace Schoenberg’s full hexachord across the neck.",
        "repertoire": "Béla Bartók · Arnold Schoenberg · Marc Ribot"
      }
    },
    {
      "id": "set_all_interval_0146",
      "category": "postTonal",
      "subfamilyPt": "Tricordes & Tetracordes (Forte)",
      "subfamilyEn": "Trichords & Tetrachords (Forte)",
      "namePt": "Tetracorde Todos-os-Intervalos A [0, 1, 4, 6]",
      "nameEn": "All-Interval Tetrachord A [0, 1, 4, 6]",
      "intervalsQ": [
        0,
        2,
        8,
        12
      ],
      "characteristicQ": [
        2,
        8,
        12
      ],
      "tagsPt": [
        "Forte 4-Z15",
        "Vetor <111111>",
        "Universal"
      ],
      "tagsEn": [
        "Forte 4-Z15",
        "Vector <111111>",
        "Universal"
      ],
      "dossier": {
        "structurePt": "Um dos dois únicos conjuntos de 4 notas capazes de conter exatamente uma ocorrência de cada classe intervalar (da 2ªm ao trítono).",
        "structureEn": "One of only two 4-note sets containing exactly one occurrence of every interval class from minor 2nd to tritone.",
        "temperamentPt": "Equilíbrio matemático perfeito entre consonância e dissonância (<1,1,1,1,1,1>).",
        "temperamentEn": "Perfect mathematical balance between consonance and dissonance (<1,1,1,1,1,1>).",
        "articulationPt": "Use o gerador de voicings para explorar 4 inversões desse tetracorde com condução suave de vozes.",
        "articulationEn": "Use the voicing solver to explore 4 inversions of this tetrachord with smooth voice-leading.",
        "repertoire": "Elliott Carter · György Ligeti · Marc Ribot"
      }
    },
    {
      "id": "set_all_interval_0137",
      "category": "postTonal",
      "subfamilyPt": "Tricordes & Tetracordes (Forte)",
      "subfamilyEn": "Trichords & Tetrachords (Forte)",
      "namePt": "Tetracorde Todos-os-Intervalos B [0, 1, 3, 7]",
      "nameEn": "All-Interval Tetrachord B [0, 1, 3, 7]",
      "intervalsQ": [
        0,
        2,
        6,
        14
      ],
      "characteristicQ": [
        2,
        6,
        14
      ],
      "tagsPt": [
        "Forte 4-Z29",
        "Vetor <111111>",
        "Par Z-Relacionado"
      ],
      "tagsEn": [
        "Forte 4-Z29",
        "Vector <111111>",
        "Z-Related Twin"
      ],
      "dossier": {
        "structurePt": "O gêmeo Z-relacionado de [0,1,4,6]: também possui o vetor perfeito <1,1,1,1,1,1>, mas com 5ª justa na base (1 · ♭2 · ♭3 · 5), soando surpreendentemente cantável e sombrio.",
        "structureEn": "The Z-related twin of [0,1,4,6]: also holds the perfect <1,1,1,1,1,1> vector, yet anchors a perfect 5th on the bottom (1 · ♭2 · ♭3 · 5) for dark, resonant power.",
        "temperamentPt": "Incrivelmente musical em B Standard e A Standard — mistura power chord (1–5) com atrito frígio (♭2–♭3).",
        "temperamentEn": "Remarkably musical in B Standard and A Standard — fuses a power chord (1–5) with Phrygian tension (♭2–♭3).",
        "articulationPt": "Experimente montar riffs pesados ou arpejos abertos com esse conjunto sobre ciclos de 7/8 ou 11/8.",
        "articulationEn": "Craft heavy riffs or ringing arpeggios from this set over 7/8 or 11/8 cycles.",
        "repertoire": "Elliott Carter · Alban Berg · Krallice · Gorguts"
      }
    },
    {
      "id": "set_quartal_pent",
      "category": "postTonal",
      "subfamilyPt": "Estruturas Quartais & Hexacordes",
      "subfamilyEn": "Quartal & Hexachord Structures",
      "namePt": "Pilha Quartal Aberta [0, 2, 5, 7, 10]",
      "nameEn": "Open Quartal Stack [0, 2, 5, 7, 10]",
      "intervalsQ": [
        0,
        4,
        10,
        14,
        20
      ],
      "characteristicQ": [
        10,
        20
      ],
      "tagsPt": [
        "Harmonia Quartal",
        "McCoy Tyner",
        "Aberto"
      ],
      "tagsEn": [
        "Quartal Harmony",
        "McCoy Tyner",
        "Open"
      ],
      "dossier": {
        "structurePt": "Equivalente ao empilhamento de 5 quartas consecutivas, produzindo um campo harmônico aberto sem centro tonal rígido.",
        "structureEn": "Generated by stacking consecutive 4ths, creating an open, non-functional harmonic field free from tonic-dominant gravity.",
        "temperamentPt": "Na afinação All Fourths (EADGCF ou B/A 4ths), acordes quartais viram pestanas verticais puras em qualquer casa.",
        "temperamentEn": "In All Fourths tuning (EADGCF or B/A 4ths), quartal voicings collapse into pure vertical barres anywhere on the neck.",
        "articulationPt": "Deslize blocos paralelos de 3 ou 4 cordas (planing) sobre um drone contínuo na tônica.",
        "articulationEn": "Slide parallel 3- or 4-string quartal blocks (planing) over a sustained tonic drone.",
        "repertoire": "McCoy Tyner · Bill Frisell · Julian Lage"
      }
    },
    {
      "id": "set_schoenberg_hex",
      "category": "postTonal",
      "subfamilyPt": "Estruturas Quartais & Hexacordes",
      "subfamilyEn": "Quartal & Hexachord Structures",
      "namePt": "Hexacorde de Schoenberg [0, 1, 4, 5, 8, 9]",
      "nameEn": "Schoenberg Hexachord [0, 1, 4, 5, 8, 9]",
      "intervalsQ": [
        0,
        2,
        8,
        10,
        16,
        18
      ],
      "characteristicQ": [
        2,
        8,
        16
      ],
      "tagsPt": [
        "Forte 6-20",
        "Ode to Napoleon",
        "Simetria em 3ªM"
      ],
      "tagsEn": [
        "Forte 6-20",
        "Ode to Napoleon",
        "M3 Symmetry"
      ],
      "dossier": {
        "structurePt": "Três pares de semitons espaçados simetricamente por terças maiores (½ · 1½ · ½ · 1½ · ½ · 1½). Rotação da Escala Aumentada — pilar de Schoenberg, Webern e jazz avant-garde.",
        "structureEn": "Three semitone pairs spaced symmetrically by major 3rds (H · m3 · H · m3 · H · m3). Rotation of the Augmented Scale — pillar of Schoenberg and avant-garde jazz.",
        "temperamentPt": "Vetor intervalar <303630>: apenas semitons, terças e quartas — ZERO tons inteiros e ZERO trítonos!",
        "temperamentEn": "Interval vector <303630>: pure semitones, thirds, and fourths — ZERO whole steps and ZERO tritones!",
        "articulationPt": "Mova qualquer célula de 3 notas em saltos de 4 casas para construir solos hipnóticos e simétricos.",
        "articulationEn": "Shift any 3-note cell in 4-fret jumps to build hypnotic, symmetrical lines.",
        "repertoire": "Arnold Schoenberg — Ode to Napoleon · Milton Babbitt · John Coltrane"
      }
    },
    {
      "id": "pent_minor",
      "category": "pentatonic",
      "subfamilyPt": "Pentatônicas Essenciais & Blues",
      "subfamilyEn": "Essential Pentatonics & Blues",
      "namePt": "Pentatônica Menor",
      "nameEn": "Minor Pentatonic",
      "intervalsQ": [
        0,
        6,
        10,
        14,
        20
      ],
      "characteristicQ": [
        6,
        20
      ],
      "tagsPt": [
        "1 · ♭3 · 4 · 5 · ♭7",
        "Universal",
        "5 Notas"
      ],
      "tagsEn": [
        "1 · ♭3 · 4 · 5 · ♭7",
        "Universal",
        "5-Note"
      ],
      "dossier": {
        "structurePt": "A pentatônica anhemitônica (sem semitons) mais universal do planeta. Na guitarra experimental, serve como esqueleto limpo para sobreposições quartais e bends microtonais.",
        "structureEn": "The world’s most universal anhemitonic pentatonic. In experimental guitar, it serves as a clean skeleton for quartal stacks and expressive micro-bends.",
        "temperamentPt": "12-TET padrão; experimente micro-bends de +50¢ na ♭3 para aproximar a terça neutra do blues e do Maqam Rast.",
        "temperamentEn": "Standard 12-TET; try +50¢ micro-bends on the ♭3 to approach the neutral third shared by deep blues and Maqam Rast.",
        "articulationPt": "Use em B ou A Standard com saltos de corda (String Skipping) e acentuação assimétrica em 5 ou 7 notas.",
        "articulationEn": "Use in B or A Standard with String Skipping and asymmetric 5- or 7-note groupings.",
        "repertoire": "Rory Gallagher · Jimi Hendrix · Black Sabbath · Sonny Sharrock"
      }
    },
    {
      "id": "pent_major",
      "category": "pentatonic",
      "subfamilyPt": "Pentatônicas Essenciais & Blues",
      "subfamilyEn": "Essential Pentatonics & Blues",
      "namePt": "Pentatônica Maior",
      "nameEn": "Major Pentatonic",
      "intervalsQ": [
        0,
        4,
        8,
        14,
        18
      ],
      "characteristicQ": [
        8,
        18
      ],
      "tagsPt": [
        "1 · 2 · 3 · 5 · 6",
        "Anhemitônica",
        "5 Notas"
      ],
      "tagsEn": [
        "1 · 2 · 3 · 5 · 6",
        "Anhemitonic",
        "5-Note"
      ],
      "dossier": {
        "structurePt": "Cinco quintas justas empilhadas (C–G–D–A–E) sem semitons. Base do Raga Bhupali, música folclórica chinesa, blues maior e paisagens abertas.",
        "structureEn": "Five stacked perfect 5ths with zero semitones. Foundation of Raga Bhupali, Chinese folk traditions, major blues, and open soundscapes.",
        "temperamentPt": "12-TET padrão; sobrepõe-se facilmente sobre acordes maiores, menores (no ♭III) ou Lídio (no II e V).",
        "temperamentEn": "Standard 12-TET; superimposes effortlessly over major, minor (off ♭III), or Lydian (off II and V) harmony.",
        "articulationPt": "Experimente tocar a pentatônica maior um tom acima da tônica (ex.: C♯ sobre B) para coloração Lídia instantânea.",
        "articulationEn": "Superimpose a major pentatonic one whole step above the root (e.g., C♯ over B) for instant Lydian shimmer.",
        "repertoire": "Raga Bhupali · Duane Allman · Bill Frisell"
      }
    },
    {
      "id": "blues_minor",
      "category": "pentatonic",
      "subfamilyPt": "Pentatônicas Essenciais & Blues",
      "subfamilyEn": "Essential Pentatonics & Blues",
      "namePt": "Escala Blues (Hexatônica)",
      "nameEn": "Blues Scale (Hexatonic)",
      "intervalsQ": [
        0,
        6,
        10,
        12,
        14,
        20
      ],
      "characteristicQ": [
        6,
        12
      ],
      "tagsPt": [
        "Blue Note (♭5)",
        "6 Notas",
        "Expressiva"
      ],
      "tagsEn": [
        "Blue Note (♭5)",
        "6-Note",
        "Expressive"
      ],
      "dossier": {
        "structurePt": "Adiciona a ♭5 (blue note) à pentatônica menor, criando o corredor cromático 4–♭5–5 carregado de tensão rítmica e vocal.",
        "structureEn": "Adds the ♭5 blue note to minor pentatonic, forging the vocal chromatic corridor 4–♭5–5.",
        "temperamentPt": "Na prática viva do blues, a ♭3 e a ♭5 flutuam microtonalmente em torno de ±25–50¢ — ligue a ponte direta com o 24-TET.",
        "temperamentEn": "In living blues phrasing, ♭3 and ♭5 float microtonally by ±25–50¢ — bridging directly into 24-TET ear training.",
        "articulationPt": "Em B ou A Standard, explore riffs pesados centrados no choque 4–♭5–5 com fuzz ou overdrive dinâmico.",
        "articulationEn": "In B or A Standard, craft heavy riffs centered on the 4–♭5–5 crunch with fuzz or dynamic overdrive.",
        "repertoire": "Rory Gallagher · Charles Mingus · Boris · Sleep"
      }
    },
    {
      "id": "pent_dominant",
      "category": "pentatonic",
      "subfamilyPt": "Pentatônicas Experimentais & Modais",
      "subfamilyEn": "Experimental & Modal Pentatonics",
      "namePt": "Pentatônica Dominante / Mixolídia",
      "nameEn": "Dominant / Mixolydian Pentatonic",
      "intervalsQ": [
        0,
        4,
        8,
        14,
        20
      ],
      "characteristicQ": [
        8,
        20
      ],
      "tagsPt": [
        "1 · 2 · 3 · 5 · ♭7",
        "Blues-Jazz",
        "5 Notas"
      ],
      "tagsEn": [
        "1 · 2 · 3 · 5 · ♭7",
        "Blues-Jazz",
        "5-Note"
      ],
      "dossier": {
        "structurePt": "Troca a 6ª da pentatônica maior pela ♭7, delineando diretamente um acorde 9/13 sem a 4ª de evitar-nota.",
        "structureEn": "Swaps major pentatonic’s 6th for ♭7, outlining dominant 9th harmony cleanly without avoid notes.",
        "temperamentPt": "12-TET padrão; ótimo filtro melódico sobre vamps Mixolídios e Lídio ♭7.",
        "temperamentEn": "Standard 12-TET; sleek melodic filter over Mixolydian and Lydian ♭7 vamps.",
        "articulationPt": "Alterne com a Pentatônica Menor paralela para linhas híbridas de jazz-rock e blues contemporâneo.",
        "articulationEn": "Alternate with parallel Minor Pentatonic for modern jazz-rock and hybrid blues lines.",
        "repertoire": "Robben Ford · Scott Henderson · John Scofield"
      }
    },
    {
      "id": "pent_locrian",
      "category": "pentatonic",
      "subfamilyPt": "Pentatônicas Experimentais & Modais",
      "subfamilyEn": "Experimental & Modal Pentatonics",
      "namePt": "Pentatônica Lócria / Meio-Diminuta",
      "nameEn": "Locrian / Half-Diminished Pentatonic",
      "intervalsQ": [
        0,
        6,
        10,
        12,
        20
      ],
      "characteristicQ": [
        10,
        12
      ],
      "tagsPt": [
        "1 · ♭3 · 4 · ♭5 · ♭7",
        "Dissonante / Metal",
        "5 Notas"
      ],
      "tagsEn": [
        "1 · ♭3 · 4 · ♭5 · ♭7",
        "Dissonant / Metal",
        "5-Note"
      ],
      "dossier": {
        "structurePt": "Rebaixa a 5ª da pentatônica menor para ♭5 (1 · ♭3 · 4 · ♭5 · ♭7). Uma arma secreta para solos modernos sobre m7♭5, alterados e riffs pesados em barítono.",
        "structureEn": "Lowers minor pentatonic’s 5th to ♭5 (1 · ♭3 · 4 · ♭5 · ♭7). Secret weapon for modern m7♭5 lines, altered harmony, and heavy baritone riffs.",
        "temperamentPt": "12-TET nativo; preserva a ergonomia familiar de 2 notas por corda com sabor totalmente sombrio.",
        "temperamentEn": "12-TET native; preserves effortless 2-notes-per-string ergonomics with an unmistakably dark edge.",
        "articulationPt": "Toque seus padrões favoritos de pentatônica menor com a 5ª sempre 1 casa abaixo em B ou A Standard.",
        "articulationEn": "Play your favorite minor-pentatonic patterns with every 5th shifted 1 fret down in B or A Standard.",
        "repertoire": "Allan Holdsworth · Meshuggah · Kurt Rosenwinkel"
      }
    },
    {
      "id": "pent_rast_neutral",
      "category": "pentatonic",
      "subfamilyPt": "Pentatônicas Experimentais & Modais",
      "subfamilyEn": "Experimental & Modal Pentatonics",
      "namePt": "Pentatônica Neutra Rast (24-TET)",
      "nameEn": "Rast Neutral Pentatonic (24-TET)",
      "intervalsQ": [
        0,
        4,
        7,
        14,
        18
      ],
      "characteristicQ": [
        7,
        18
      ],
      "tagsPt": [
        "1 · 2 · 3½♭ · 5 · 6",
        "3ª Neutra (350¢)",
        "24-TET"
      ],
      "tagsEn": [
        "1 · 2 · 3½♭ · 5 · 6",
        "Neutral 3rd (350¢)",
        "24-TET"
      ],
      "dossier": {
        "structurePt": "Pentatônica maior com a 3ª reduzida em ¼ de tom para 3½♭ (+350¢) — destila a alma luminosa e ambígua do Maqam Rast em apenas 5 notas super acessíveis.",
        "structureEn": "Major pentatonic with its 3rd lowered by a quarter-tone to 3½♭ (+350¢) — distills Maqam Rast’s radiant ambiguity into 5 super-accessible notes.",
        "temperamentPt": "Apenas 1 grau microtonal em toda a escala: o campo de treino perfeito para dominar bends exatos de +50¢ na guitarra 12-TET.",
        "temperamentEn": "Just 1 quarter-tone degree across the entire scale: the ultimate training ground for nailing exact +50¢ micro-bends on 12-TET guitar.",
        "articulationPt": "Ative o Etude Laboratório de Micro-Bends (+50¢) com esta escala e sinta a diferença imediata entre ♭3, 3½♭ e 3M.",
        "articulationEn": "Run the Micro-Bend (+50¢) Etude with this scale and lock in the sweet spot between ♭3, 3½♭, and major 3rd.",
        "repertoire": "String Atlas 24-TET Lab · Maqam Rast / Deep Blues Bridge"
      }
    }
  ],
  "chords": [
    {
      "id": "quartal_3",
      "family": "nonTercial",
      "namePt": "Quartal de 3 Vozes (1–4–♭7)",
      "nameEn": "3-Voice Quartal (1–4–♭7)",
      "symbol": "Q3",
      "intervalsQ": [
        0,
        10,
        20
      ],
      "notePt": "Empilhamento puro de duas 4ªs justas. Base do comping modal (McCoy Tyner / So What) e superposição livre sobre Dórico, Kurd ou In-Sen.",
      "noteEn": "Pure stack of two perfect 4ths. Core of modal comping (McCoy Tyner / So What) and free planing over Dorian, Kurd, or In-Sen."
    },
    {
      "id": "quartal_4_so_what",
      "family": "nonTercial",
      "namePt": "So What / Quartal + 3ªM (1–4–♭7–♭3–5)",
      "nameEn": "So What Voicing (1–4–♭7–♭3–5)",
      "symbol": "m11(SW)",
      "intervalsQ": [
        0,
        10,
        20,
        6,
        14
      ],
      "notePt": "Três quartas justas coroadas por uma terça maior no topo (Bill Evans). Funciona como tônica menor modal ou acorde suspenso moderno.",
      "noteEn": "Three stacked 4ths crowned by a major 3rd on top (Bill Evans). Serves as a lush modal minor tonic or modern suspended color."
    },
    {
      "id": "quintal_3",
      "family": "nonTercial",
      "namePt": "Quintal Aberto (1–5–9)",
      "nameEn": "Open Quintal (1–5–9)",
      "symbol": "add9(no3)",
      "intervalsQ": [
        0,
        14,
        4
      ],
      "notePt": "Duas 5ªs justas empilhadas sem terça: ambiguidade maior/menor ideal para Shoegaze, Post-Rock, Metal Atmosférico e bordões em B/A Standard.",
      "noteEn": "Two stacked 5ths with no 3rd: major/minor ambiguity ideal for Shoegaze, Post-Rock, Atmospheric Metal, and drones in B/A Standard."
    },
    {
      "id": "lydian_shell",
      "family": "nonTercial",
      "namePt": "Lídio Cristalino (1–♯4–5–7)",
      "nameEn": "Crystalline Lydian (1–♯4–5–7)",
      "symbol": "maj7♯11(no3)",
      "intervalsQ": [
        0,
        12,
        14,
        22
      ],
      "notePt": "Atrito luminoso entre ♯4 e 5ª justa sustentado pela 7ª maior. Excelente com reverb longo ou afinação Open Lydian.",
      "noteEn": "Luminous rub between ♯4 and perfect 5th framed by major 7th. Shines with ambient reverb or Open Lydian tuning."
    },
    {
      "id": "cluster_secundal",
      "family": "cluster",
      "namePt": "Cluster Secundai (1–♭2–2–5)",
      "nameEn": "Secundal Cluster (1–♭2–2–5)",
      "symbol": "Clust",
      "intervalsQ": [
        0,
        2,
        4,
        14
      ],
      "notePt": "Choque denso de 2ªs menores e maiores ancorado pela 5ª. Textura visceral para música experimental, noise controlado e Messiaen Modo 4.",
      "noteEn": "Dense clash of minor and major 2nds anchored by the 5th. Visceral texture for experimental music, controlled noise, and Messiaen Mode 4."
    },
    {
      "id": "viennese_chord",
      "family": "postTonal",
      "namePt": "Tricorde Vienense [0, 1, 6]",
      "nameEn": "Viennese Trichord [0, 1, 6]",
      "symbol": "[016]",
      "intervalsQ": [
        0,
        2,
        12
      ],
      "notePt": "Semitom + Trítono (Forte 3-5). Sonoridade angular de Webern/Berg e guitarra avant-garde.",
      "noteEn": "Semitone + Tritone (Forte 3-5). Angular harmonic signature of Webern/Berg and avant-garde guitar."
    },
    {
      "id": "all_interval_chord",
      "family": "postTonal",
      "namePt": "Tetracorde Todos-os-Intervalos [0, 1, 4, 6]",
      "nameEn": "All-Interval Tetrachord [0, 1, 4, 6]",
      "symbol": "[0146]",
      "intervalsQ": [
        0,
        2,
        8,
        12
      ],
      "notePt": "Contém todas as 6 classes intervalares (<111111>). Tensão equilibrada de alta sofisticação harmônica.",
      "noteEn": "Contains every interval class once (<111111>). Balanced high-density contemporary tension."
    },
    {
      "id": "rast_neutral_triad",
      "family": "microtonal",
      "namePt": "Tríade Neutra Rast (1–3½♭–5)",
      "nameEn": "Rast Neutral Triad (1–3½♭–5)",
      "symbol": "Rast(½♭)",
      "intervalsQ": [
        0,
        7,
        14
      ],
      "notePt": "Acorde microtonal 24-TET com terça neutra a +350¢: nem maior, nem menor. No modo Bend, execute a terça neutra com micro-bend de +50¢.",
      "noteEn": "24-TET microtonal triad with a +350¢ neutral 3rd: neither major nor minor. In Bend mode, lift the neutral 3rd by +50¢."
    },
    {
      "id": "bayati_neutral_dyad",
      "family": "microtonal",
      "namePt": "Tríade Suspensa Bayati (1–2½♭–4–5)",
      "nameEn": "Bayati Neutral Sus (1–2½♭–4–5)",
      "symbol": "Bayati(½♭)",
      "intervalsQ": [
        0,
        3,
        10,
        14
      ],
      "notePt": "Combina o grau neutro característico do Maqam Bayati (+150¢) com a moldura aberta de 4ª e 5ª justa.",
      "noteEn": "Combines Maqam Bayati’s signature neutral 2nd (+150¢) with an open 4th/5th frame."
    },
    {
      "id": "hijaz_drone_chord",
      "family": "microtonal",
      "namePt": "Acorde Drone Hijaz (1–♭2–3–5)",
      "nameEn": "Hijaz Drone Chord (1–♭2–3–5)",
      "symbol": "Hijaz",
      "intervalsQ": [
        0,
        2,
        8,
        14
      ],
      "notePt": "Captura o choque dramático do Jins Hijaz (♭2 contra 3ª maior sobre o bordão de 5ª). Funciona em 12-TET puro.",
      "noteEn": "Captures Jins Hijaz’s dramatic rub (♭2 against major 3rd over a 5th drone). Pure 12-TET playable."
    },
    {
      "id": "min_maj7_9",
      "family": "jazz",
      "namePt": "Menor com 7ª Maior e ♯11 (Nawa Athar)",
      "nameEn": "Min(maj7)♯11 (Nawa Athar)",
      "symbol": "m(M7)♯11",
      "intervalsQ": [
        0,
        6,
        12,
        22
      ],
      "notePt": "Extração harmônica direta de Maqam Nawa Athar: terça menor, trítono e sétima maior em um voicing denso e cinematográfico.",
      "noteEn": "Harmonic distillation of Maqam Nawa Athar: minor 3rd, tritone, and major 7th in a dark cinematic voicing."
    },
    {
      "id": "maj7_b5",
      "family": "jazz",
      "namePt": "Tétrade 7M(♭5) / Drop 2",
      "nameEn": "Maj7(♭5) / Drop 2 Color",
      "symbol": "maj7♭5",
      "intervalsQ": [
        0,
        8,
        12,
        22
      ],
      "notePt": "Voicing aéreo sem 5ª justa — ressoa diretamente em Lídio, Raga Marwa e Messiaen Modo 6.",
      "noteEn": "Airy fifth-less voicing resonating naturally across Lydian, Raga Marwa, and Messiaen Mode 6."
    }
  ],
  "rhythms": [
    {
      "id": "iqa_maqsum",
      "family": "iqa",
      "namePt": "Maqsum (Iqa’ Árabe)",
      "nameEn": "Maqsum (Arabic Iqa’)",
      "meter": "4/4",
      "subdivision": 2,
      "grouping": "2+2+2+2",
      "steps": [
        "D",
        "T",
        "-",
        "T",
        "D",
        "-",
        "T",
        "-"
      ],
      "notePt": "O ciclo mais ubíquo da música árabe moderna. Excelente base para groove modal e riffs sincopados.",
      "noteEn": "The backbone of modern Arabic music. Ideal groove anchor for modal phrasing and syncopated riffs."
    },
    {
      "id": "iqa_samai_thaqil",
      "family": "iqa",
      "namePt": "Sama’i Thaqil (Iqa’ Clássico)",
      "nameEn": "Sama’i Thaqil (Classical Iqa’)",
      "meter": "10/8",
      "subdivision": 2,
      "grouping": "3+2+2+3",
      "steps": [
        "D",
        "-",
        "-",
        "T",
        "-",
        "D",
        "D",
        "T",
        "-",
        "-"
      ],
      "notePt": "Clássico ciclo de 10 pulsos (3+2+2+3) das composições instrumentais Sama’i. O dobro de Dum nos tempos 6–7 cria propulsão única.",
      "noteEn": "Classical 10-beat cycle (3+2+2+3) of instrumental Sama’i forms. The double Dum on beats 6–7 creates unmistakable momentum."
    },
    {
      "id": "iqa_jurjina",
      "family": "iqa",
      "namePt": "Jurjina (Iraquiano / Curdo)",
      "nameEn": "Jurjina (Iraqi / Kurdish)",
      "meter": "10/16",
      "subdivision": 4,
      "grouping": "3+2+2+3",
      "steps": [
        "D",
        "-",
        "K",
        "T",
        "-",
        "D",
        "-",
        "T",
        "-",
        "K"
      ],
      "notePt": "Ciclo vivo em 10/16 muito usado no Iraque e no repertório de Munir Bashir. Excelente para palhetada alternada assimétrica.",
      "noteEn": "Lively 10/16 cycle central to Iraqi tradition and Munir Bashir’s repertoire. Great for asymmetric alternate picking."
    },
    {
      "id": "iqa_baladi",
      "family": "iqa",
      "namePt": "Masmudi Saghir / Baladi",
      "nameEn": "Masmudi Saghir / Baladi",
      "meter": "4/4",
      "subdivision": 2,
      "grouping": "2+2+2+2",
      "steps": [
        "D",
        "D",
        "-",
        "T",
        "D",
        "-",
        "T",
        "K"
      ],
      "notePt": "Abertura pesada com dois Dums seguidos — conecta perfeitamente com riffs graves em B/A Standard ou Drop A.",
      "noteEn": "Heavy double-Dum opening — locks right into low-register riffs in B/A Standard or Drop A."
    },
    {
      "id": "iqa_aqsak_9",
      "family": "iqa",
      "namePt": "Aqsaq (Otomano / Árabe)",
      "nameEn": "Aqsaq (Ottoman / Arabic)",
      "meter": "9/8",
      "subdivision": 2,
      "grouping": "2+2+2+3",
      "steps": [
        "D",
        "-",
        "T",
        "K",
        "D",
        "-",
        "T",
        "-",
        "K"
      ],
      "notePt": "Clássico 9/8 manco ('aksak') com grupo final alongado em 3 pulsos.",
      "noteEn": "Classic limping 9/8 ('aksak') with an elongated 3-pulse tail."
    },
    {
      "id": "iqa_malfuf",
      "family": "iqa",
      "namePt": "Malfuf (2/4 Dinâmico)",
      "nameEn": "Malfuf (Driving 2/4)",
      "meter": "2/4",
      "subdivision": 4,
      "grouping": "3+3+2",
      "steps": [
        "D",
        "-",
        "-",
        "T",
        "-",
        "-",
        "T",
        "-"
      ],
      "notePt": "Subdivisão 3+3+2 (mesma célula rítmica do baião/tresillo!), ligando diretamente o mundo árabe à rítmica brasileira.",
      "noteEn": "3+3+2 subdivision (the exact tresillo/baião cell!), bridging Arabic cycles directly with Brazilian rhythm."
    },
    {
      "id": "aksak_7_223",
      "family": "aksak",
      "namePt": "Aksak 7/8 (2+2+3 · Rachenitsa)",
      "nameEn": "Aksak 7/8 (2+2+3 · Rachenitsa)",
      "meter": "7/8",
      "subdivision": 2,
      "grouping": "2+2+3",
      "steps": [
        "D",
        "-",
        "T",
        "-",
        "D",
        "K",
        "T"
      ],
      "notePt": "Groove balcânico acelerado com apoio estendido no último grupo de 3 colcheias.",
      "noteEn": "Driving Balkan groove with a stretched 3-eighth closing cell."
    },
    {
      "id": "aksak_7_322",
      "family": "aksak",
      "namePt": "Aksak 7/8 (3+2+2 · Kalamatianos)",
      "nameEn": "Aksak 7/8 (3+2+2 · Kalamatianos)",
      "meter": "7/8",
      "subdivision": 2,
      "grouping": "3+2+2",
      "steps": [
        "D",
        "-",
        "K",
        "T",
        "-",
        "T",
        "K"
      ],
      "notePt": "Acentuação frontal longa (3+2+2) — excelente para sobrepor uma polimetria de 4 na Trilha B.",
      "noteEn": "Front-loaded long pulse (3+2+2) — prime material for overlaying a 4-pulse polymeter on Track B."
    },
    {
      "id": "odd_5_4",
      "family": "aksak",
      "namePt": "Assimétrico 5/4 (3+2)",
      "nameEn": "Asymmetric 5/4 (3+2)",
      "meter": "5/4",
      "subdivision": 2,
      "grouping": "3+2 (10 steps)",
      "steps": [
        "D",
        "-",
        "K",
        "T",
        "-",
        "K",
        "D",
        "-",
        "T",
        "-"
      ],
      "notePt": "Grade de 10 colcheias articulada em 3+2. Combine com Trilha B em 4 ou 3 para modulação métrica.",
      "noteEn": "10-eighth grid articulated as 3+2. Combine with Track B in 4 or 3 for metric modulation studies."
    },
    {
      "id": "aksak_11_8",
      "family": "aksak",
      "namePt": "Kopanitsa 11/8 (2+2+3+2+2)",
      "nameEn": "Kopanitsa 11/8 (2+2+3+2+2)",
      "meter": "11/8",
      "subdivision": 2,
      "grouping": "2+2+3+2+2",
      "steps": [
        "D",
        "-",
        "T",
        "-",
        "D",
        "-",
        "K",
        "T",
        "-",
        "T",
        "K"
      ],
      "notePt": "Pilar assimétrico de 11 pulsos muito explorado no jazz contemporâneo (Tigran Hamasyan) e no prog.",
      "noteEn": "11-pulse asymmetric cornerstone beloved in contemporary jazz (Tigran Hamasyan) and progressive music."
    },
    {
      "id": "odd_13_16",
      "family": "aksak",
      "namePt": "Ciclo 13/16 (3+3+3+2+2)",
      "nameEn": "13/16 Cycle (3+3+3+2+2)",
      "meter": "13/16",
      "subdivision": 4,
      "grouping": "3+3+3+2+2",
      "steps": [
        "D",
        "-",
        "K",
        "T",
        "-",
        "K",
        "D",
        "-",
        "K",
        "T",
        "-",
        "T",
        "-"
      ],
      "notePt": "Ciclo primo de 13 semicolcheias — ideal para riffs polimétricos (ative Trilha B = 4 para deslocamento contínuo estilo Meshuggah).",
      "noteEn": "Prime 13-sixteenth cycle — ideal for polymetric riffs (enable Track B = 4 for continuous Meshuggah-style phase displacement)."
    }
  ],
  "obliqueStrategies": [
    {
      "id": "exp_bstd_saba_zamzam",
      "titlePt": "Doom Modal em B Standard (Saba Zamzam)",
      "titleEn": "Modal Doom in B Standard (Saba Zamzam)",
      "promptPt": "Em B Standard sobre Si Saba Zamzam, deixe a 6ª corda solta (B1) ressoar como coluna vertebral enquanto explora a tensão entre ♭2, ♭3 e a 4ª diminuta sobre Baladi.",
      "promptEn": "In B Standard over B Saba Zamzam, let the low open B1 ring as a spine while weaving slow tension across ♭2, ♭3, and the diminished 4th over Baladi.",
      "constraintPt": "Restrição: toque apenas nas 3 cordas mais graves e nunca use a 4ª justa.",
      "constraintEn": "Constraint: stay strictly on the lowest 3 strings and never play a perfect 4th.",
      "preset": {
        "scaleId": "maqam_saba_zamzam",
        "rootQ": 22,
        "tuningId": "b_standard",
        "microMode": "bend",
        "droneOn": true,
        "harmonicsOn": false,
        "chordId": "viennese_chord",
        "rhythmId": "iqa_baladi"
      }
    },
    {
      "id": "exp_astd_all_interval_b",
      "titlePt": "Gravidade Pós-Tonal em A Standard [0,1,3,7]",
      "titleEn": "Post-Tonal Gravity in A Standard [0,1,3,7]",
      "promptPt": "Em A Standard sobre Lá [0,1,3,7] (Forte 4-Z29), combine o peso da 5ª justa (A1–E2) com clusters de ♭2 e ♭3 sobre o ciclo polimétrico de 13/16.",
      "promptEn": "In A Standard over A [0,1,3,7] (Forte 4-Z29), fuse low 5th weight (A1–E2) with ♭2/♭3 clusters over the 13/16 polymetric cycle.",
      "constraintPt": "Restrição: ative a Trilha B em 4 pulsos e acentue cada ♭2 com palhetada seca.",
      "constraintEn": "Constraint: enable Track B in 4 pulses and accent every ♭2 with dry picking.",
      "preset": {
        "scaleId": "set_all_interval_0137",
        "rootQ": 18,
        "tuningId": "a_standard",
        "microMode": "bend",
        "droneOn": false,
        "harmonicsOn": false,
        "chordId": "cluster_secundal",
        "rhythmId": "odd_13_16"
      }
    },
    {
      "id": "exp_bayati_dadgad",
      "titlePt": "Taqsim Elétrico em DADGAD",
      "titleEn": "Electric Taqsim in DADGAD",
      "promptPt": "Toque em Ré Bayati usando a 6ª e a 4ª cordas soltas como bordão contínuo. Construa frases lentas exclusivamente nas cordas 1 e 2, afinando o E½♭ por micro-bend (+50¢).",
      "promptEn": "Play D Bayati using open strings 6 and 4 as a continuous drone. Craft slow phrases strictly on strings 1 and 2, intoning E½♭ via +50¢ micro-bend.",
      "constraintPt": "Restrição: toque no máximo 4 notas por respiração e ative a Tríade Suspensa Bayati como mapa de repouso.",
      "constraintEn": "Constraint: play at most 4 notes per breath and toggle the Bayati Neutral Sus chord as your resting map.",
      "preset": {
        "scaleId": "maqam_bayati",
        "rootQ": 4,
        "tuningId": "dadgad",
        "microMode": "bend",
        "droneOn": true,
        "harmonicsOn": false,
        "chordId": "bayati_neutral_dyad",
        "rhythmId": "iqa_samai_thaqil"
      }
    },
    {
      "id": "exp_nikriz_samai",
      "titlePt": "Nikriz em Sama’i Thaqil (10/8)",
      "titleEn": "Nikriz in Sama’i Thaqil (10/8)",
      "promptPt": "Ative o ciclo 10/8 (3+2+2+3) em Maqam Nikriz sobre Ré em B Standard. Construa um riff modal que enfatize o salto ♭3→♯4 nos dois Dums consecutivos dos tempos 6 e 7.",
      "promptEn": "Start the 10/8 cycle (3+2+2+3) in D Maqam Nikriz on B Standard. Craft a modal riff emphasizing the ♭3→♯4 leap right on the double Dum of beats 6 and 7.",
      "constraintPt": "Restrição: ligue a Trilha B polimétrica em 4 para criar tensão cruzada sobre o 10/8.",
      "constraintEn": "Constraint: engage Polymeter Track B in 4 to generate cross-accent tension over 10/8.",
      "preset": {
        "scaleId": "maqam_nikriz",
        "rootQ": 4,
        "tuningId": "b_standard",
        "microMode": "bend",
        "droneOn": false,
        "harmonicsOn": false,
        "chordId": "quartal_3",
        "rhythmId": "iqa_samai_thaqil"
      }
    },
    {
      "id": "exp_messiaen_m3",
      "titlePt": "Geometria Sem Gravidade",
      "titleEn": "Zero-Gravity Geometry",
      "promptPt": "Explore o Modo 3 de Messiaen em afinação de Terças Maiores. Desenhe uma célula de 3 notas em uma região e replique-a na mesma casa em cordas diferentes — o padrão é invariante.",
      "promptEn": "Explore Messiaen Mode 3 in Major Thirds tuning. Pick a 3-note cell and mirror it on the exact same frets across strings — the geometry stays invariant.",
      "constraintPt": "Restrição: nenhum acorde pode conter 5ª justa.",
      "constraintEn": "Constraint: no chord voicing may contain a perfect 5th.",
      "preset": {
        "scaleId": "messiaen_mode3",
        "rootQ": 0,
        "tuningId": "major_thirds",
        "microMode": "bend",
        "droneOn": false,
        "harmonicsOn": false,
        "chordId": "maj7_b5",
        "rhythmId": "odd_5_4"
      }
    },
    {
      "id": "exp_saba_slide",
      "titlePt": "Lamento Microtonal em Slide",
      "titleEn": "Microtonal Slide Lament",
      "promptPt": "Mude para o modo Slide/Fretless em Ré Saba. Use volume swells ou ataque suave com os dedos deslizando lentamente entre o 2º grau neutro e a 4ª diminuta.",
      "promptEn": "Switch to Slide/Fretless mode in D Saba. Use volume swells or soft finger attacks gliding slowly between the neutral 2nd and diminished 4th.",
      "constraintPt": "Restrição: permaneça apenas na corda G (3ª) durante toda a exploração.",
      "constraintEn": "Constraint: stay strictly on the 3rd string for the entire exploration.",
      "preset": {
        "scaleId": "maqam_saba",
        "rootQ": 4,
        "tuningId": "drop_d",
        "microMode": "slide",
        "droneOn": true,
        "harmonicsOn": false,
        "chordId": "bayati_neutral_dyad",
        "rhythmId": "iqa_aqsak_9"
      }
    },
    {
      "id": "exp_viennese_fourths",
      "titlePt": "Pontilhismo Vienense [0,1,6]",
      "titleEn": "Viennese Pointillism [0,1,6]",
      "promptPt": "Em All Fourths (EADGCF), distribua as 3 notas do tricorde [0,1,6] por três oitavas diferentes usando os voicings calculados no Laboratório Harmônico.",
      "promptEn": "In All Fourths (EADGCF), scatter the 3 pitches of [0,1,6] across three octaves using the calculated voicings in the Harmony Lab.",
      "constraintPt": "Restrição: alterne cada acorde de 3 notas com um harmônico natural isolado em 11/8.",
      "constraintEn": "Constraint: alternate every 3-note chord with an isolated natural harmonic over 11/8.",
      "preset": {
        "scaleId": "set_viennese_016",
        "rootQ": 8,
        "tuningId": "all_fourths",
        "microMode": "bend",
        "droneOn": false,
        "harmonicsOn": true,
        "chordId": "viennese_chord",
        "rhythmId": "aksak_11_8"
      }
    },
    {
      "id": "exp_armorial_harmonics",
      "titlePt": "Série Harmônica & Sertão Espectral",
      "titleEn": "Spectral Overtone Sertão",
      "promptPt": "Em Orkney (CGDGCD) sobre Dó Lídio ♭7, misture os harmônicos naturais de 5º e 7º parciais com a melodia na 1ª corda sobre o ciclo Malfuf (3+3+2).",
      "promptEn": "In Orkney (CGDGCD) over C Lydian ♭7, weave 5th- and 7th-partial natural harmonics into a 1st-string melody above the Malfuf (3+3+2) pulse.",
      "constraintPt": "Restrição: use apenas a mão esquerda (hammer-on/pull-off) nos trechos graves.",
      "constraintEn": "Constraint: use left-hand legato only on low-register notes.",
      "preset": {
        "scaleId": "br_armorial_lydian_b7",
        "rootQ": 0,
        "tuningId": "orkney",
        "microMode": "bend",
        "droneOn": true,
        "harmonicsOn": true,
        "chordId": "quintal_3",
        "rhythmId": "iqa_malfuf"
      }
    },
    {
      "id": "exp_oud_guitar_suznak",
      "titlePt": "Ponte Oud-Guitarra em Maqam Suznak",
      "titleEn": "Oud-to-Guitar Bridge in Maqam Suznak",
      "promptPt": "Carregue a afinação Oud-Mapped (C F A D G C) em Dó Suznak. Pratique bends exatos de +50¢ apenas na 3ª neutra (E½♭) enquanto articula o Jins Hijaz no registro agudo.",
      "promptEn": "Load Oud-Mapped tuning (C F A D G C) in C Suznak. Nail +50¢ micro-bends solely on the neutral 3rd (E½♭) while articulating upper Jins Hijaz lines.",
      "constraintPt": "Restrição: use o Etude Linear em Corda Única sobre a 2ª corda.",
      "constraintEn": "Constraint: run the Single-String Linear Etude along the 2nd string.",
      "preset": {
        "scaleId": "maqam_suznak",
        "rootQ": 0,
        "tuningId": "oud_cfadgc",
        "microMode": "bend",
        "droneOn": true,
        "harmonicsOn": false,
        "chordId": "rast_neutral_triad",
        "rhythmId": "iqa_maqsum"
      }
    },
    {
      "id": "exp_marwa_unison",
      "titlePt": "Muro de Som em Raga Marwa",
      "titleEn": "Wall of Sound in Raga Marwa",
      "promptPt": "Ative a afinação Drone Uníssono (F♯⁴-E-B) em F♯ Marwa. Deixe as quatro cordas graves vibrarem em leve batimento enquanto traça melodias sem 5ª justa nas duas agudas.",
      "promptEn": "Load Unison Drone (F♯⁴-E-B) in F♯ Marwa. Let the four low unison strings shimmer while tracing fifth-less melodies on the top two strings.",
      "constraintPt": "Restrição: termine todas as frases na ♭2 ou na 6ª maior antes da resolução final.",
      "constraintEn": "Constraint: end every phrase on ♭2 or major 6th before the final resolution.",
      "preset": {
        "scaleId": "raga_marwa",
        "rootQ": 12,
        "tuningId": "sonic_unison",
        "microMode": "bend",
        "droneOn": true,
        "harmonicsOn": false,
        "chordId": "maj7_b5",
        "rhythmId": "aksak_7_322"
      }
    }
  ]
};
