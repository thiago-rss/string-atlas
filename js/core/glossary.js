/**
 * String Atlas Technical & Theoretical Bilingual Glossary (PT/EN) — v8.4
 * 39 curated entries across 5 domains.
 */

export const GLOSSARY_CATEGORIES = [
  {
    "id": "all",
    "labelPt": "Todos",
    "labelEn": "All"
  },
  {
    "id": "microtonal",
    "labelPt": "Microtonalidade & Afinação",
    "labelEn": "Microtonality & Tuning"
  },
  {
    "id": "maqam",
    "labelPt": "Maqam, Raga & Global",
    "labelEn": "Maqam, Raga & Global"
  },
  {
    "id": "modal",
    "labelPt": "Modalismo, Simetria & Pós-Tonal",
    "labelEn": "Modal, Symmetry & Post-Tonal"
  },
  {
    "id": "harmony_rhythm",
    "labelPt": "Harmonia & Polimetria",
    "labelEn": "Harmony & Polymeter"
  },
  {
    "id": "luthier_dsp",
    "labelPt": "Guitarra, Luthieria & Áudio",
    "labelEn": "Guitar, Luthier & Audio"
  }
];

export const GLOSSARY_TERMS = [
  {
    "id": "12tet",
    "category": "microtonal",
    "symbol": "12-TET · 100¢",
    "termPt": "12-TET (Temperamento Igual de 12 Notas)",
    "termEn": "12-TET (12-Tone Equal Temperament)",
    "defPt": "Sistema padrão ocidental que divide a oitava em 12 semitons exatamente iguais de 100 cents cada (razão 2^(1/12)). Permite modular livremente para qualquer tom, mas tempera levemente terças e sextas.",
    "defEn": "Standard Western tuning dividing the octave into 12 equal semitones of 100 cents each (ratio 2^(1/12)). Allows free transposition at the cost of slightly tempered thirds and sixths.",
    "guitarTipPt": "É o espaçamento físico dos trastes comuns da guitarra elétrica. Todas as escalas sem quartos de tom (Gregas, Messiaen, Kurd, Nawa Athar) são nativas em 12-TET.",
    "guitarTipEn": "Matches standard guitar fret spacing. All non-quarter-tone scales (Greek modes, Messiaen, Kurd, Nawa Athar) play natively in 12-TET.",
    "audioDemo": {
      "type": "interval",
      "baseQ": 96,
      "targetQ": 100
    },
    "jumpAction": {
      "tab": "radar"
    }
  },
  {
    "id": "24tet",
    "category": "microtonal",
    "symbol": "24-TET · 50¢",
    "termPt": "24-TET (Sistema de Quartos de Tom)",
    "termEn": "24-TET (Quarter-Tone System)",
    "defPt": "Divide a oitava em 24 passos iguais de 50 cents — inserindo exatamente uma altura intermediária (quarto de tom) entre cada dois trastes adjacentes da guitarra.",
    "defEn": "Divides the octave into 24 equal steps of 50 cents — placing one exact quarter-tone midway between every pair of standard guitar frets.",
    "guitarTipPt": "Base teórica moderna dos Maqamat árabes no String Atlas. Na guitarra 12-TET, acesse os quartos de tom por Micro-Bend (+50¢), Slide/Fretless ou trastes microtonais.",
    "guitarTipEn": "Modern backbone of Arabic Maqamat in String Atlas. Reach quarter-tones on a 12-TET neck via +50¢ Micro-Bends, Slide/Fretless, or 24-TET refretted grids.",
    "audioDemo": {
      "type": "interval",
      "baseQ": 96,
      "targetQ": 99
    },
    "jumpAction": {
      "scaleId": "maqam_bayati",
      "rootQ": 4
    }
  },
  {
    "id": "cent",
    "category": "microtonal",
    "symbol": "1¢ = 1/100 st",
    "termPt": "Cent (¢)",
    "termEn": "Cent (¢)",
    "defPt": "Unidade logarítmica padrão para medir intervalos musicais com precisão fina. 1 oitava = 1200¢, 1 semitom 12-TET = 100¢ e 1 quarto de tom 24-TET = 50¢.",
    "defEn": "Standard logarithmic unit for fine pitch measurement. 1 octave = 1200¢, 1 standard semitone = 100¢, and 1 quarter-tone = 50¢.",
    "guitarTipPt": "Ative o rótulo 'Cents' no compartimento Braço & Vista para ler a distância exata de cada nota até a tônica e use o medidor do Line Mode para calibrar desvios.",
    "guitarTipEn": "Switch labels to 'Cents' inside Neck & View to read every degree’s exact distance from the root, and use Line Mode to gauge ±¢ precision.",
    "audioDemo": {
      "type": "pair_compare",
      "baseHz": 220,
      "hzA": 233.08188075904496,
      "hzB": 239.91170118635668
    },
    "jumpAction": {
      "tab": "line"
    }
  },
  {
    "id": "neutral_degree",
    "category": "microtonal",
    "symbol": "½♭ / ½♯ · 150¢ / 350¢",
    "termPt": "Grau Neutro (Meio-Bemol ½♭ / Meio-Sustenido ½♯)",
    "termEn": "Neutral Degree (Half-Flat ½♭ / Half-Sharp ½♯)",
    "defPt": "Intervalo situado exatamente no ponto médio entre o menor e o maior: a 2ª neutra (2½♭ = 150¢) habita entre ♭2 e 2, e a 3ª neutra (3½♭ = 350¢) habita entre ♭3 e 3M.",
    "defEn": "Interval poised midway between minor and major: a neutral 2nd (2½♭ = 150¢) sits between ♭2 and 2, while a neutral 3rd (3½♭ = 350¢) bridges ♭3 and major 3rd.",
    "guitarTipPt": "Dissolve a dualidade ocidental alegre/triste. Ouça a comparação no Treino Auditivo 24-TET para internalizar 300¢ vs. 350¢ vs. 400¢.",
    "guitarTipEn": "Dissolves Western happy/sad duality. Practice 300¢ vs. 350¢ vs. 400¢ side by side in the 24-TET Ear Trainer.",
    "audioDemo": {
      "type": "interval",
      "baseQ": 96,
      "targetQ": 103
    },
    "jumpAction": {
      "tab": "ear"
    }
  },
  {
    "id": "micro_bend",
    "category": "microtonal",
    "symbol": "B↑¼ (+50¢)",
    "termPt": "Micro-Bend (+50¢)",
    "termEn": "Micro-Bend (+50¢)",
    "defPt": "Técnica de guitarra que eleva uma nota pressionada em exatamente meio semitom (+50 cents), atingindo quartos de tom 24-TET sem precisar modificar os trastes do instrumento.",
    "defEn": "Guitar technique bending a fretted note upward by exactly half a semitone (+50 cents), sounding 24-TET quarter-tones on any standard fretted guitar.",
    "guitarTipPt": "Use o modo 'Bend +50¢' no braço, evite vibrato largo na chegada e valide a altura exata na zona verde (+50¢ ±14¢) do medidor no Line Mode.",
    "guitarTipEn": "Use 'Bend +50¢' fretboard mode, avoid wide vibrato on arrival, and lock the pitch inside Line Mode’s green +50¢ target zone.",
    "audioDemo": {
      "type": "interval",
      "baseQ": 100,
      "targetQ": 103
    },
    "jumpAction": {
      "tab": "line"
    }
  },
  {
    "id": "just_intonation",
    "category": "microtonal",
    "symbol": "JI · 5/4, 7/4",
    "termPt": "Entonação Justa (Just Intonation / JI)",
    "termEn": "Just Intonation (JI)",
    "defPt": "Sistema de afinação baseado em razões exatas de números inteiros pequenos (3/2, 4/3, 5/4, 7/4) derivadas diretamente da física da série harmônica, eliminando batimentos acústicos.",
    "defEn": "Tuning system built on pure small-integer frequency ratios (3/2, 4/3, 5/4, 7/4) from the harmonic series, eliminating acoustic beating.",
    "guitarTipPt": "A terça maior pura (5/4) soa −14¢ abaixo do 12-TET e a sétima harmônica (7/4) soa −31¢ abaixo. Explore e ouça em Hz puros no Laboratório Scala (.scl).",
    "guitarTipEn": "Pure major 3rd (5/4) sits −14¢ flat of 12-TET and harmonic 7th (7/4) sits −31¢ flat. Audition and project pure ratios in the Scala (.scl) Lab.",
    "audioDemo": {
      "type": "pair_compare",
      "baseHz": 261.63,
      "hzA": 327.0375,
      "hzB": 329.63314428399565
    },
    "jumpAction": {
      "tab": "scala",
      "scalaPresetId": "ji_5limit"
    }
  },
  {
    "id": "harmonic_series",
    "category": "microtonal",
    "symbol": "f · 2f · 3f · 5f · 7f",
    "termPt": "Série Harmônica & Parciais Naturais",
    "termEn": "Harmonic Series & Natural Partials",
    "defPt": "Conjunto de frequências múltiplas inteiras (2º, 3º, 4º, 5º, 6º, 7º parciais) que vibram naturalmente em uma corda presa nas duas extremidades.",
    "defEn": "Set of integer-multiple frequencies (2nd through 7th partials) vibrating naturally along a plucked guitar string.",
    "guitarTipPt": "Ative 'Harmônicos' no braço para ver os nós exatos nas casas 12, 7, 5, ~3,86 (−14¢) e ~9,69 (−31¢). Base física da escala Lídio ♭7 Armorial.",
    "guitarTipEn": "Toggle 'Harmonics' on the neck to locate exact nodes at frets 12, 7, 5, ~3.86 (−14¢), and ~9.69 (−31¢) — physical backbone of Lydian ♭7.",
    "audioDemo": {
      "type": "harmonic_demo",
      "baseHz": 110
    },
    "jumpAction": {
      "scaleId": "br_armorial_lydian_b7",
      "rootQ": 0
    }
  },
  {
    "id": "edo_53",
    "category": "microtonal",
    "symbol": "53-TET · 22,64¢",
    "termPt": "53-TET & Comma Holderiana",
    "termEn": "53-TET & Holderian Comma",
    "defPt": "Divisão da oitava em 53 commas iguais (~22,64¢ cada), base da teoria clássica turca/otomana (Arel-Ezgi-Uzdilek). Permite distinguir matizes sutis como 8 commas (181¢) vs. 150¢ árabe.",
    "defEn": "Divides the octave into 53 equal commas (~22.64¢ each), foundation of Ottoman/Turkish makam theory — capturing nuances like 8-comma Ussak (181¢) vs. 150¢ Arabic Bayati.",
    "guitarTipPt": "Teste os presets 53-TET Rast, Uşşak e Hicaz no Laboratório Scala e projete os desvios exatos (±¢) sobre o braço.",
    "guitarTipEn": "Explore the 53-TET Rast, Ussak, and Hicaz presets in the Scala Lab and project exact ±¢ fret offsets onto the neck.",
    "audioDemo": {
      "type": "pair_compare",
      "baseHz": 293.66,
      "hzA": 320.2385007744796,
      "hzB": 326.0489182900325
    },
    "jumpAction": {
      "tab": "scala",
      "scalaPresetId": "turkish_53_ussak"
    }
  },
  {
    "id": "scala_scl",
    "category": "microtonal",
    "symbol": ".scl",
    "termPt": "Formato Scala (.scl)",
    "termEn": "Scala (.scl) Tuning Format",
    "defPt": "Padrão aberto universal para descrever qualquer escala ou sistema microtonal em texto simples, aceitando tanto razões puras (ex.: 5/4) quanto valores em cents (ex.: 181.13).",
    "defEn": "Universal plain-text open standard defining arbitrary microtonal tunings via exact frequency ratios (5/4) or cent offsets (181.13).",
    "guitarTipPt": "No compartimento Scala (.scl) você pode importar arquivos .scl externos, editar linhas ao vivo, ouvir em Hz puros e mapear cada nota no braço.",
    "guitarTipEn": "In the Scala (.scl) Lab you can import external .scl files, live-edit intervals, audition pure Hz, and map every pitch onto the guitar neck.",
    "audioDemo": null,
    "jumpAction": {
      "tab": "scala"
    }
  },
  {
    "id": "bohlen_pierce",
    "category": "microtonal",
    "symbol": "3/1 · 1902¢",
    "termPt": "Bohlen-Pierce & Tritava (3/1)",
    "termEn": "Bohlen-Pierce & Tritave (3/1)",
    "defPt": "Sistema microtonal sem equivalência de oitava: o ciclo repete-se na Tritava (razão 3/1 = oitava + 5ª justa = 1901,96¢), dividida em 13 passos iguais de 146,3¢.",
    "defEn": "Non-octave microtonal lattice repeating at the Tritave (3/1 = octave + fifth = 1901.96¢), divided into 13 equal steps of 146.3¢.",
    "guitarTipPt": "Na guitarra, a repetição do padrão ocorre 19 casas acima (em vez da casa 12), abrindo harmonias baseadas exclusivamente em harmônicos ímpares (3:5:7).",
    "guitarTipEn": "On guitar, pitch repetition lands 19 frets higher instead of fret 12, unlocking alien consonances built purely on odd harmonics (3:5:7).",
    "audioDemo": null,
    "jumpAction": {
      "tab": "scala",
      "scalaPresetId": "bohlen_pierce_13"
    }
  },
  {
    "id": "maqam",
    "category": "maqam",
    "symbol": "Maqamat",
    "termPt": "Maqam (pl. Maqamat)",
    "termEn": "Maqam (pl. Maqamat)",
    "defPt": "Sistema modal da música clássica árabe. Muito mais do que uma escala, um Maqam define entonação (24-TET), tetracordes constituintes (Ajnas), notas de repouso e o percurso melódico (Sayr).",
    "defEn": "Modal system of classical Arabic music. Beyond a pitch list, a Maqam specifies 24-TET intonation, constituent tetrachords (Ajnas), resting poles, and melodic path (Sayr).",
    "guitarTipPt": "Comece pelos Maqamat 12-TET (Kurd, Nahawand, Nawa Athar) e avance para Bayati, Rast, Hijaz e Saba com micro-bends ou slide.",
    "guitarTipEn": "Start with 12-TET Maqamat (Kurd, Nahawand, Nawa Athar), then step into Bayati, Rast, Hijaz, and Saba with micro-bends or slide.",
    "audioDemo": null,
    "jumpAction": {
      "scaleId": "maqam_bayati",
      "rootQ": 4
    }
  },
  {
    "id": "jins",
    "category": "maqam",
    "symbol": "Jins (3–5 notas)",
    "termPt": "Jins (pl. Ajnas)",
    "termEn": "Jins (pl. Ajnas)",
    "defPt": "Célula modal de 3, 4 ou 5 notas (tricorde, tetracorde ou pentacorde) que funciona como bloco de construção dos Maqamat — por exemplo, Jins Bayati (¾·¾·1) + Jins Hijaz (½·1½·½).",
    "defEn": "3-, 4-, or 5-note modal building block (trichord, tetrachord, or pentachord) stacked to form Maqamat — e.g., Jins Bayati + Jins Hijaz.",
    "guitarTipPt": "Pensar em Ajnas de 4 notas em cordas vizinhas (ou em uma única corda) transforma instantaneamente o fraseado da guitarra em linguagem de Oud.",
    "guitarTipEn": "Thinking in 4-note Ajnas along a single string or closed neck cell immediately transforms guitar phrasing into authentic Oud language.",
    "audioDemo": null,
    "jumpAction": {
      "scaleId": "maqam_bayati_shuri",
      "rootQ": 4
    }
  },
  {
    "id": "qarar_ghammaz",
    "category": "maqam",
    "symbol": "Qarar (1) · Ghammaz (4/5)",
    "termPt": "Qarar & Ghammaz",
    "termEn": "Qarar & Ghammaz",
    "defPt": "Qarar é a tônica principal (base de repouso) do Maqam; Ghammaz é o grau-pivô (geralmente a 4ª ou 5ª justa) onde o segundo Jins começa e de onde partem as modulações.",
    "defEn": "Qarar is the main tonic (home resting pitch); Ghammaz is the structural pivot degree (usually 4th or 5th) where the upper Jins and modulations launch.",
    "guitarTipPt": "No Radar Modal 24-TET, filtre por '4ª' ou '5ª' para descobrir modulações autênticas a partir do Ghammaz da escala ativa.",
    "guitarTipEn": "In the 24-TET Modal Radar, filter by '4th' or '5th' to uncover authentic modulations pivoting off your active scale’s Ghammaz.",
    "audioDemo": null,
    "jumpAction": {
      "tab": "radar"
    }
  },
  {
    "id": "sayr",
    "category": "maqam",
    "symbol": "Sayr (Jornada)",
    "termPt": "Sayr (Percurso Melódico)",
    "termEn": "Sayr (Melodic Path)",
    "defPt": "A dramaturgia tradicional de um Maqam: em qual registro começar, quais notas enfatizar, para quais Ajnas modular temporariamente e como retornar ao Qarar.",
    "defEn": "Traditional narrative arc of a Maqam: opening register, emphasized resting pitches, secondary modulations, and final cadence home to the Qarar.",
    "guitarTipPt": "Use a aba Vamps & Sayr para improvisar enquanto o braço atualiza automaticamente os modos e notas-alvo a cada etapa da modulação.",
    "guitarTipEn": "Use the Vamps & Sayr tab to improvise while the fretboard automatically updates scales and target tones across each modulation step.",
    "audioDemo": null,
    "jumpAction": {
      "tab": "vamp"
    }
  },
  {
    "id": "taqsim",
    "category": "maqam",
    "symbol": "Taqsim (Livre)",
    "termPt": "Taqsim",
    "termEn": "Taqsim",
    "defPt": "Improvisação solo em ritmo livre (sem pulso fixo) que explora em profundidade a entonação, os ornamentos e o Sayr de um Maqam sobre um bordão ou silêncio.",
    "defEn": "Solo free-rhythm improvisation unfolding a Maqam’s intonation, ornamentation, and Sayr over a drone or silence.",
    "guitarTipPt": "Ligue o Drone no compartimento Áudio, ative o Modo Zen (Z) e improvise frases lentas de 3 a 5 notas respeitando pausas respiradas.",
    "guitarTipEn": "Turn on the Drone in Audio, enter Zen Mode (Z), and phrase slow 3–5 note statements framed by unhurried breathing pauses.",
    "audioDemo": null,
    "jumpAction": {
      "scaleId": "maqam_rast",
      "rootQ": 0
    }
  },
  {
    "id": "iqa",
    "category": "maqam",
    "symbol": "D · T · K",
    "termPt": "Iqa’ (pl. Iqa’at) & Dum / Tak / Ka",
    "termEn": "Iqa’ (pl. Iqa’at) & Dum / Tak / Ka",
    "defPt": "Ciclo rítmico da música árabe estruturado pela combinação de timbres percussivos: Dum (D, grave central), Tak (T, agudo de borda) e Ka (K, nota fantasma suave).",
    "defEn": "Arabic rhythmic cycle built from contrasting percussion timbres: Dum (D, low resonant center), Tak (T, crisp rim), and Ka (K, soft ghost stroke).",
    "guitarTipPt": "Pratique riffs graves acompanhando os Dums em Maqsum (4/4), Baladi (4/4), Malfuf (3+3+2 = baião) e Sama’i Thaqil (10/8 = 3+2+2+3).",
    "guitarTipEn": "Lock low-register guitar riffs onto the Dums of Maqsum (4/4), Baladi (4/4), Malfuf (3+3+2), and Sama’i Thaqil (10/8).",
    "audioDemo": null,
    "jumpAction": {
      "tab": "rhythm"
    }
  },
  {
    "id": "raga_andolan",
    "category": "maqam",
    "symbol": "Raga · Thaat · Meend",
    "termPt": "Raga, Thaat, Andolan & Meend",
    "termEn": "Raga, Thaat, Andolan & Meend",
    "defPt": "Na música indiana Hindustani, Thaat é a matriz escalar; Raga é a entidade melódica com frases e horários próprios; Meend é o glissando contínuo e Andolan é a oscilação microtonal lenta.",
    "defEn": "In Hindustani music, Thaat is the parent scale; Raga is the melodic identity; Meend is continuous pitch glide and Andolan is slow microtonal oscillation.",
    "guitarTipPt": "Experimente Raga Bhairav ou Raga Marwa (sem 5ª justa — desligue a +5ª do Drone!) usando slides lentos e volume swells.",
    "guitarTipEn": "Try Raga Bhairav or fifth-less Raga Marwa (turn Drone +5th OFF!) using slow slides and clean volume swells.",
    "audioDemo": null,
    "jumpAction": {
      "scaleId": "raga_marwa",
      "rootQ": 12
    }
  },
  {
    "id": "gamelan",
    "category": "maqam",
    "symbol": "Pelog · Slendro",
    "termPt": "Gamelan (Pelog & Slendro)",
    "termEn": "Gamelan (Pelog & Slendro)",
    "defPt": "Os dois grandes sistemas de afinação da Indonésia (Java e Bali): Slendro (pentatônica quase equidistante ~240¢) e Pelog (heptatônica assimétrica). Cada orquestra tem sua própria afinação (embat).",
    "defEn": "Indonesia’s two core tuning systems: near-equidistant 5-tone Slendro (~240¢ steps) and asymmetric 7-tone Pelog — each ensemble uniquely tuned (embat).",
    "guitarTipPt": "Compare a aproximação 24-TET do catálogo com as medições reais em cents (1212¢/1208¢) disponíveis no Laboratório Scala (.scl).",
    "guitarTipEn": "Compare the 24-TET approximations in the main catalog against real measured-cent Pelog & Slendro presets in the Scala (.scl) Lab.",
    "audioDemo": null,
    "jumpAction": {
      "tab": "scala",
      "scalaPresetId": "gamelan_pelog_bali"
    }
  },
  {
    "id": "modal_vs_tonal",
    "category": "modal",
    "symbol": "Centro Único",
    "termPt": "Pensamento Modal vs. Tonal",
    "termEn": "Modal vs. Functional Tonal Thinking",
    "defPt": "Enquanto o sistema tonal move-se por tensões funcionais (Tônica → Subdominante → Dominante → Tônica), o modalismo sustenta um único centro gravitacional (drone/pedal) para destacar a cor pura de cada grau.",
    "defEn": "While functional tonality relies on V7–I cadences, modal music anchors a single tonal center (drone/pedal) to spotlight each degree’s pure color.",
    "guitarTipPt": "Evite cadências V–I óbvias: mantenha um bordão na tônica e enfatize o grau característico (ex.: 6M no Dórico, ♭2 no Frígio, ♯4 no Lídio).",
    "guitarTipEn": "Skip cliché V–I cadences: anchor a tonic drone and lean into the characteristic degree (M6 in Dorian, ♭2 in Phrygian, ♯4 in Lydian).",
    "audioDemo": null,
    "jumpAction": {
      "scaleId": "std_dorian",
      "rootQ": 4
    }
  },
  {
    "id": "drone",
    "category": "modal",
    "symbol": "Bordão (1 + 5)",
    "termPt": "Drone / Bordão",
    "termEn": "Drone / Pedal Tone",
    "defPt": "Nota grave contínua (tônica pura ou tônica + 5ª justa) que serve como horizonte acústico fixo, permitindo que o ouvido perceba cada intervalo e microtom em relação direta ao centro.",
    "defEn": "Sustained low reference pitch (pure tonic or tonic + 5th) serving as a fixed acoustic horizon so every interval and microtone pops into focus.",
    "guitarTipPt": "Ligue/desligue o Drone a qualquer momento pelo atalho D ou no compartimento Áudio. Desligue '+5ª Justa' em escalas sem quinta (Lócrio, Marwa, Bohlen-Pierce).",
    "guitarTipEn": "Toggle the Drone anytime via shortcut D or inside Audio. Turn '+5th' OFF for fifth-less scales (Locrian, Raga Marwa, Bohlen-Pierce).",
    "audioDemo": null,
    "jumpAction": null
  },
  {
    "id": "char_degree",
    "category": "modal",
    "symbol": "Grau-Assinatura",
    "termPt": "Grau Característico",
    "termEn": "Characteristic Degree",
    "defPt": "A nota (ou par de notas) que diferencia imediatamente um modo de seus vizinhos mais próximos — destacada em coral/carmesim no braço do String Atlas.",
    "defEn": "The signature pitch (or pair) that immediately distinguishes a mode from its closest neighbors — highlighted in coral/crimson on the String Atlas fretboard.",
    "guitarTipPt": "Ao improvisar, aterrisse nos marcadores característicos sobre tempos fortes para revelar na hora a identidade do modo.",
    "guitarTipEn": "Land on characteristic-degree markers on strong beats so the mode’s identity rings unmistakably right away.",
    "audioDemo": null,
    "jumpAction": null
  },
  {
    "id": "greek_modes",
    "category": "modal",
    "symbol": "7 Modos Diatônicos",
    "termPt": "Modos Gregos (Diatônicos)",
    "termEn": "Greek (Diatonic) Modes",
    "defPt": "As 7 rotações da escala diatônica ordenadas do mais brilhante ao mais escuro: Lídio (♯4), Jônio (Maior), Mixolídio (♭7), Dórico (♭3, 6M), Eólio (Menor), Frígio (♭2) e Lócrio (♭2, ♭5).",
    "defEn": "The 7 rotations of the diatonic scale ordered bright-to-dark: Lydian (♯4), Ionian, Mixolydian (♭7), Dorian (♭3, M6), Aeolian, Phrygian (♭2), and Locrian (♭2, ♭5).",
    "guitarTipPt": "Use-os como mapa de referência no Radar Modal: baixar apenas 1 grau do Dórico leva a Bayati (¼ tom) e a Kurd/Frígio (½ tom).",
    "guitarTipEn": "Use them as your compass in Modal Radar: lowering just one degree of Dorian steps through Bayati (¼ tone) into Kurd/Phrygian (½ tone).",
    "audioDemo": null,
    "jumpAction": {
      "scaleId": "std_lydian",
      "rootQ": 0
    }
  },
  {
    "id": "messiaen",
    "category": "modal",
    "symbol": "Modos 1–7",
    "termPt": "Modos de Transposição Limitada (Olivier Messiaen)",
    "termEn": "Modes of Limited Transposition (Olivier Messiaen)",
    "defPt": "Sete escalas simétricas catalogadas por Messiaen cuja estrutura intervalar repete-se dentro da oitava, gerando menos de 12 transposições distintas (ex.: Tons Inteiros = 2; Octatônica = 3; Modo 3 = 4).",
    "defEn": "Seven symmetrical scales catalogued by Messiaen whose repeating cells yield fewer than 12 unique transpositions (Whole Tone = 2; Octatonic = 3; Mode 3 = 4).",
    "guitarTipPt": "Na guitarra, qualquer digitação ou acorde repete-se identicamente deslocando +2 casas (Modo 1), +3 casas (Modo 2), +4 casas (Modo 3) ou +6 casas (Modos 4–7).",
    "guitarTipEn": "On guitar, any shape shifts verbatim by +2 frets (Mode 1), +3 frets (Mode 2), +4 frets (Mode 3), or +6 frets (Modes 4–7).",
    "audioDemo": null,
    "jumpAction": {
      "scaleId": "messiaen_mode2",
      "rootQ": 0
    }
  },
  {
    "id": "slonimsky",
    "category": "modal",
    "symbol": "Interpolação",
    "termPt": "Padrões de Slonimsky",
    "termEn": "Slonimsky Patterns",
    "defPt": "Método do Thesaurus of Scales and Melodic Patterns (Nicolas Slonimsky, 1947) que divide a oitava em partes iguais (como o trítono) e interpola cada segmento com saltos idênticos.",
    "defEn": "Method from Nicolas Slonimsky’s 1947 Thesaurus dividing the octave into equal spans (like the tritone) and interpolating identical leaps inside each.",
    "guitarTipPt": "Excelente para quebrar hábitos diatônicos com String Skipping angular em jazz contemporâneo, fusion e metal técnico.",
    "guitarTipEn": "Superb for breaking scalar muscle memory via angular String Skipping in contemporary jazz, fusion, and technical metal.",
    "audioDemo": null,
    "jumpAction": {
      "scaleId": "slonimsky_tritone_interp",
      "rootQ": 8
    }
  },
  {
    "id": "pitch_class_set",
    "category": "modal",
    "symbol": "[0, 1, 6] · Forte",
    "termPt": "Pitch-Class Set & Teoria dos Conjuntos (Allen Forte)",
    "termEn": "Pitch-Class Set Theory (Allen Forte)",
    "defPt": "Sistema pós-tonal que trata qualquer coleção de notas (independente de oitava ou função tonal) como um conjunto numérico normalizado a partir de 0 — ex.: Tricorde Vienense [0, 1, 6] (Forte 3-5).",
    "defEn": "Post-tonal framework classifying any pitch collection regardless of octave or key as a normalized integer set starting at 0 — e.g., Viennese Trichord [0, 1, 6] (Forte 3-5).",
    "guitarTipPt": "Na aba Harmonia & Voicings, alterne para o 'Construtor de Pitch-Class Set' para montar conjuntos próprios em 24-TET e calcular voicings jogáveis na hora.",
    "guitarTipEn": "In Harmony & Voicings, switch to 'Pitch-Class Set Builder' to assemble custom 24-TET sets and compute playable voicings immediately.",
    "audioDemo": null,
    "jumpAction": {
      "tab": "harmony"
    }
  },
  {
    "id": "interval_vector",
    "category": "modal",
    "symbol": "<ic1..ic6>",
    "termPt": "Vetor Intervalar (ICV)",
    "termEn": "Interval Class Vector (ICV)",
    "defPt": "Assinatura de 6 dígitos <ic1, ic2, ic3, ic4, ic5, ic6> que conta quantas 2ªs m, 2ªs M, 3ªs m, 3ªs M, 4ªs/5ªs e trítonos existem dentro de um Pitch-Class Set. Ex.: <111111> contém todos os intervalos igualmente.",
    "defEn": "Six-digit signature <ic1..ic6> counting every minor 2nd, major 2nd, minor 3rd, major 3rd, 4th/5th, and tritone inside a set. E.g. <111111> holds one of each.",
    "guitarTipPt": "Use o vetor no Dossiê para prever a cor harmônica: alto ic1/ic6 = atrito angular/dissonante; alto ic5 = abertura quartal/quintal.",
    "guitarTipEn": "Read the vector in the Dossier to anticipate harmonic color: high ic1/ic6 = sharp angular tension; high ic5 = open quartal/quintal glow.",
    "audioDemo": null,
    "jumpAction": {
      "scaleId": "set_all_interval_0146",
      "rootQ": 4
    }
  },
  {
    "id": "chromatic_mediants",
    "category": "modal",
    "symbol": "±3ªm / ±3ªM",
    "termPt": "Mediantes Cromáticas",
    "termEn": "Chromatic Mediants",
    "defPt": "Modulação direta entre centros tonais separados por terça menor ou maior (ex.: F → A♭ → B → D) mantendo o mesmo modo (como Lídio), criando efeito cinematográfico sem cadência dominante.",
    "defEn": "Direct modulation between tonal centers a minor or major third apart (e.g., F → A♭ → B → D) sharing the same mode for sweeping cinematic lift.",
    "guitarTipPt": "Experimente o Vamp 'Mediantes Lídias' com o timbre Ambient Swell para sentir a conexão suave pelas notas comuns.",
    "guitarTipEn": "Try the 'Lydian Chromatic Mediants' Vamp with Ambient Swell tone to hear common tones glue distant keys together.",
    "audioDemo": null,
    "jumpAction": {
      "tab": "vamp"
    }
  },
  {
    "id": "quartal_harmony",
    "category": "harmony_rhythm",
    "symbol": "1 · 4 · ♭7",
    "termPt": "Harmonia Quartal & Voicing 'So What'",
    "termEn": "Quartal Harmony & 'So What' Voicing",
    "defPt": "Acordes construídos empilhando quartas justas em vez de terças. O célebre voicing 'So What' (Bill Evans / Miles Davis) empilha três quartas e coroa com uma terça maior (1–4–♭7–♭3–5).",
    "defEn": "Chords built by stacking perfect fourths instead of thirds. Bill Evans’s iconic 'So What' voicing stacks three fourths topped by a major third.",
    "guitarTipPt": "Permite deslizar blocos paralelos (planing) por toda a escala modal sem impor gravidade tonal fechada. Brilha em All Fourths e Dórico.",
    "guitarTipEn": "Allows parallel block planing across any modal scale free of rigid tertian pull. Effortless in All Fourths and Dorian.",
    "audioDemo": null,
    "jumpAction": {
      "tab": "harmony"
    }
  },
  {
    "id": "quintal_harmony",
    "category": "harmony_rhythm",
    "symbol": "1 · 5 · 9",
    "termPt": "Harmonia Quintal (Aberta)",
    "termEn": "Open Quintal Harmony",
    "defPt": "Empilhamento de quintas justas consecutivas (1–5–9 / add9 sem terça). Cria sonoridade ampla, ambígua e colossal — perfeita para shoegaze, post-rock e afinações barítono graves.",
    "defEn": "Stacked consecutive perfect fifths (1–5–9 / add9 no3). Produces expansive, ambiguous resonance ideal for shoegaze, post-rock, and low baritone rigs.",
    "guitarTipPt": "Em B Standard e A Standard, voicings quintais mantêm clareza de sobra nas cordas graves onde tríades fechadas embolariam.",
    "guitarTipEn": "In B Standard and A Standard, quintal voicings stay punchy and articulate in sub-low registers where closed triads turn muddy.",
    "audioDemo": null,
    "jumpAction": {
      "tab": "harmony"
    }
  },
  {
    "id": "secundal_cluster",
    "category": "harmony_rhythm",
    "symbol": "1 · ♭2 · 2",
    "termPt": "Cluster Secundai",
    "termEn": "Secundal Cluster",
    "defPt": "Agrupamento de notas adjacentes separadas por segundas menores ou maiores soando simultaneamente, gerando fricção densa, cintilação atmosférica ou peso dissonante.",
    "defEn": "Adjacent pitches separated by minor or major seconds sounded together, creating dense friction, shimmering dissonance, or stark avant-garde texture.",
    "guitarTipPt": "Na guitarra, aproveite cordas soltas combinadas com notas presas em cordas vizinhas para tocar clusters com abertura confortável na mão esquerda.",
    "guitarTipEn": "On guitar, blend open strings against fretted notes on neighboring strings to voice rich clusters with comfortable hand stretch.",
    "audioDemo": null,
    "jumpAction": {
      "tab": "harmony"
    }
  },
  {
    "id": "aksak",
    "category": "harmony_rhythm",
    "symbol": "7/8 · 9/8 · 11/8",
    "termPt": "Ritmo Aksak (Assimétrico / 'Manco')",
    "termEn": "Aksak (Asymmetric / 'Limping') Rhythm",
    "defPt": "Termo turco/balcânico para compassos que misturam subdivisões binárias (2) e ternárias (3) no mesmo ciclo — ex.: 7/8 (2+2+3), 9/8 (2+2+2+3), 10/8 (3+2+2+3) e 11/8 (2+2+3+2+2).",
    "defEn": "Turkish/Balkan term for meters combining binary (2) and ternary (3) pulse groups inside one cycle — e.g., 7/8 (2+2+3), 9/8, 10/8, and 11/8.",
    "guitarTipPt": "Em vez de contar números altos, sinta os blocos curtos ('ta-ka') e longos ('ta-ki-ta') no Motor Rítmico Universal.",
    "guitarTipEn": "Instead of counting high numbers, internalize short ('ta-ka') and long ('ta-ki-ta') groupings in the Universal Rhythm Engine.",
    "audioDemo": null,
    "jumpAction": {
      "tab": "rhythm"
    }
  },
  {
    "id": "polymeter",
    "category": "harmony_rhythm",
    "symbol": "A × B · MMC",
    "termPt": "Polimetria & Convergência (MMC)",
    "termEn": "Polymeter & Convergence (LCM)",
    "defPt": "Sobreposição simultânea de dois ciclos de tamanhos diferentes compartilhando a mesma subdivisão (ex.: 13/16 contra 4 pulsos). Os ciclos se deslocam continuamente até convergirem no Mínimo Múltiplo Comum (MMC).",
    "defEn": "Simultaneous layering of two different cycle lengths sharing one subdivision (e.g., 13/16 over 4). Accents shift continuously until converging at the Least Common Multiple (LCM).",
    "guitarTipPt": "No Motor Rítmico, ligue a Trilha B polimétrica (ex.: 4 pulsos sobre 10/8 ou 13/16) e observe o cálculo automático do MMC.",
    "guitarTipEn": "In the Rhythm Engine, engage Polymeter Track B (e.g., 4 pulses over 10/8 or 13/16) and track the live LCM convergence counter.",
    "audioDemo": null,
    "jumpAction": {
      "tab": "rhythm"
    }
  },
  {
    "id": "scordatura",
    "category": "luthier_dsp",
    "symbol": "DADGAD · CFADGC",
    "termPt": "Scordatura (Afinação Alternativa)",
    "termEn": "Scordatura (Alternate Tuning)",
    "defPt": "Alteração deliberada da afinação padrão das cordas para destravar novas ressonâncias de cordas soltas, extensões graves (B/A Standard) ou simetrias geométricas no braço.",
    "defEn": "Deliberate departure from standard tuning to unlock sympathetic open-string resonance, low baritone range (B/A Standard), or symmetric fretboard geometry.",
    "guitarTipPt": "No String Atlas, todas as 39 afinações (6, 7 e 8 cordas) recalculam automaticamente braço, voicings, etudes, tablatura, afinador e tensão física.",
    "guitarTipEn": "In String Atlas, all 39 tunings (6/7/8 strings) automatically recalculate neck maps, voicings, etudes, tab, tuner, and string tension.",
    "audioDemo": null,
    "jumpAction": null
  },
  {
    "id": "all_fourths",
    "category": "luthier_dsp",
    "symbol": "P4 · P4 · P4",
    "termPt": "Afinação All Fourths (Todas em Quartas)",
    "termEn": "All Fourths Tuning",
    "defPt": "Elimina a quebra de terça maior entre as cordas G e B afinando todas as cordas em quartas justas (ex.: E A D G C F ou B E A D G C). Qualquer desenho de escala ou acorde move-se sem adaptação.",
    "defEn": "Eliminates the standard G–B major-third warp by tuning every adjacent pair a perfect fourth apart (E A D G C F / B E A D G C), making every shape 100% invariant.",
    "guitarTipPt": "Ponte poderosa para transferir formas fechadas do Oud (CFADGC) e arpejos simétricos de Messiaen/Slonimsky para a guitarra.",
    "guitarTipEn": "Powerful bridge for transferring closed Oud shapes (CFADGC) and symmetric Messiaen/Slonimsky lines onto guitar.",
    "audioDemo": null,
    "jumpAction": null
  },
  {
    "id": "baritone_multiscale",
    "category": "luthier_dsp",
    "symbol": "27″ · Fanned Fret",
    "termPt": "Escala Barítono & Multi-Scale (Fanned Fret)",
    "termEn": "Baritone & Multi-Scale (Fanned Fret)",
    "defPt": "Comprimento vibrante maior entre pestana e ponte (26,5″ a 30″) para sustentar afinações graves (B Std, A Std, Drop E) com firmeza. Multi-Scale usa escala longa nos graves e curta nos agudos.",
    "defEn": "Longer vibrating string length (26.5″–30″) supporting low tunings (B Std, A Std, Drop E) with clarity. Multi-Scale pairs longer bass strings with nimble treble lengths.",
    "guitarTipPt": "Compare escalas 25,5″, 27,0″ e Multi-Scale 25,5″–28,0″ diretamente na aba Tensão de Cordas (Luthieria).",
    "guitarTipEn": "Compare 25.5″, 27.0″, and 25.5″–28.0″ Multi-Scale lengths directly inside the String Tension (Luthier) tab.",
    "audioDemo": null,
    "jumpAction": {
      "tab": "tension"
    }
  },
  {
    "id": "string_tension",
    "category": "luthier_dsp",
    "symbol": "T = UW·(2Lf)²/g",
    "termPt": "Tensão Física de Encordoamento (lbs / kg)",
    "termEn": "Physical String Tension (lbs / kg)",
    "defPt": "Força longitudinal exercida por cada corda esticada até sua frequência de afinação. Cresce com o quadrado do comprimento da escala (L) e da frequência (f), e linearmente com o peso unitário (UW).",
    "defEn": "Longitudinal pull exerted by a string tuned to pitch. Scales with the square of scale length (L) and frequency (f), and linearly with unit weight (UW).",
    "guitarTipPt": "Zona confortável típica: 14,5–19,8 lbs por corda. Use '✦ Sugerir Calibres Ideais' na aba Tensão de Cordas para balancear B Standard ou A Standard.",
    "guitarTipEn": "Typical comfort band: 14.5–19.8 lbs per string. Hit '✦ Recommend Balanced Gauges' in String Tension to balance B Standard or A Standard.",
    "audioDemo": null,
    "jumpAction": {
      "tab": "tension"
    }
  },
  {
    "id": "closed_shape",
    "category": "luthier_dsp",
    "symbol": "4–6 Casas",
    "termPt": "Forma Fechada Móvel (Closed Shape)",
    "termEn": "Movable Closed Shape",
    "defPt": "Digitação confinada em uma janela de 4 a 6 casas sem depender de cordas soltas — pode ser transposta imediatamente para qualquer tônica apenas deslizando a mão pelo braço.",
    "defEn": "Fingering confined inside a 4-to-6 fret window without relying on open strings — transposes instantaneously to any root by shifting hand position.",
    "guitarTipPt": "Ative a 'Janela Fechada' dentro do compartimento Braço & Vista e deslize ◀/▶ casa a casa para estudar formas fechadas em todas as regiões.",
    "guitarTipEn": "Toggle 'Closed Window' inside Neck & View and shift ◀/▶ fret-by-fret to master movable shapes across every register.",
    "audioDemo": null,
    "jumpAction": null
  },
  {
    "id": "line_mode_yin",
    "category": "luthier_dsp",
    "symbol": "YIN · 34–1480 Hz",
    "termPt": "Line Mode & Detector YIN",
    "termEn": "Line Mode & YIN Pitch Detector",
    "defPt": "Line Mode desliga cancelamento de eco e supressão de ruído do navegador para receber o sinal puro de uma interface de áudio (com seleção de Canal 1 / Canal 2 / L+R). O algoritmo YIN rastreia fundamentais até 34 Hz.",
    "defEn": "Line Mode bypasses browser echo cancellation and noise suppression for clean direct audio-interface input (Ch 1 / Ch 2 / L+R). YIN tracks fundamentals down to 34 Hz.",
    "guitarTipPt": "Ideal para aferir micro-bends (+50¢), afinar cordas graves (B1 61,7 Hz, A1 55 Hz, E1 41,2 Hz) e validar Etudes em tempo real.",
    "guitarTipEn": "Ideal for checking +50¢ micro-bends, tuning baritone/8-string lows (B1, A1, E1), and validating procedural Etudes live.",
    "audioDemo": null,
    "jumpAction": {
      "tab": "line"
    }
  },
  {
    "id": "midi_musicxml_24",
    "category": "luthier_dsp",
    "symbol": ".mid · .musicxml",
    "termPt": "MIDI 24-TET (Pitch Bend / MPE) & MusicXML 4.0",
    "termEn": "24-TET MIDI (Pitch Bend / MPE) & MusicXML 4.0",
    "defPt": "Padrões de exportação do String Atlas: arquivos .mid usam RPN ±2st + Pitch Bend (+50¢) e canais individuais por voz nos Vamps; arquivos .musicxml incluem acidentes <alter>±0.5</alter> e tablatura 6/7/8 cordas.",
    "defEn": "String Atlas export formats: .mid files emit RPN ±2st +50¢ Pitch Bend and per-voice channels on Vamps; .musicxml exports quarter-tone <alter>±0.5</alter> + 6/7/8-string TAB.",
    "guitarTipPt": "Abra o compartimento Partitura & Tab (ou Etudes / Vamps) para baixar seus estudos prontos para DAW, MuseScore 4 ou Guitar Pro 8.",
    "guitarTipEn": "Open Staff & Tab (or Etudes / Vamps) to export ready-to-use files straight into your DAW, MuseScore 4, or Guitar Pro 8.",
    "audioDemo": null,
    "jumpAction": null
  }
];

export function getGlossaryTermById(id) {
  return GLOSSARY_TERMS.find((item) => item.id === id) || null;
}
