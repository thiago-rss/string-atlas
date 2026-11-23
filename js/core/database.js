/**
 * String Atlas Unified Database v2.0 (24-TET compatible with Oud Visualizer contracts)
 * Contains:
 * - DB.scales (Arabic Maqamat, Ragas, Global, Messiaen, Slonimsky, Pitch-Class Sets, Reference)
 * - DB.chords (Non-Tercial Quartal/Quintal, Clusters, Drop Voicings, Post-Tonal Sets, Microtonal Arabic Dyads/Triads)
 * - DB.rhythms (Arabic Iqa'at + Balkan/Aksak & Odd Meters for Polymetric Engine)
 * - DB.tunings (9 Scordatura presets)
 * - DB.obliqueStrategies (Creative experiment cards)
 */

export const DB = {
  categories: [
    { id: 'all', labelPt: 'Tudo', labelEn: 'All' },
    { id: 'arabic', labelPt: 'Maqamat (24-TET)', labelEn: 'Maqamat (24-TET)' },
    { id: 'global', labelPt: 'Global & Ragas', labelEn: 'Global & Ragas' },
    { id: 'messiaen', labelPt: 'Messiaen & Simetrias', labelEn: 'Messiaen & Symmetries' },
    { id: 'postTonal', labelPt: 'Pitch Sets & Pós-Tonal', labelEn: 'Pitch Sets & Post-Tonal' },
    { id: 'standard', labelPt: 'Referência Modal', labelEn: 'Modal Reference' }
  ],

  scales: [
    // --- ARABIC MAQAMAT (24-TET — imported & expanded from Oud Visualizer) ---
    {
      id: 'maqam_bayati',
      category: 'arabic',
      namePt: 'Maqam Bayati',
      nameEn: 'Maqam Bayati',
      intervalsQ: [0, 3, 6, 10, 14, 16, 20],
      characteristicQ: [3, 6],
      tagsPt: ['Jins Bayati', '2ª Neutra (150¢)', 'Taqsim'],
      tagsEn: ['Jins Bayati', 'Neutral 2nd (150¢)', 'Taqsim'],
      dossier: {
        structurePt: 'Tetracorde inferior Jins Bayati (¾ · ¾ · 1) seguido de Jins Nahawand ou Rast no 4º grau. A 2ª meio-bemol cria gravidade melódica rumo à tônica.',
        structureEn: 'Lower tetrachord Jins Bayati (¾ · ¾ · 1) followed by Jins Nahawand or Rast on the 4th degree. The half-flat 2nd creates strong gravity toward the tonic.',
        temperamentPt: 'Em 24-TET o 2º grau está a +150¢ da tônica; na prática levantina/egípcia costuma soar ligeiramente mais baixo (~135–145¢) em descida.',
        temperamentEn: 'In 24-TET the 2nd degree sits at +150¢; in Levantine/Egyptian practice it often inflects slightly lower (~135–145¢) when descending.',
        articulationPt: 'Na guitarra 12-TET, ataque a casa da ♭2 e aplique micro-bend de +50¢ sem vibrato excessivo; experimente tocar com corda solta em drone na tônica.',
        articulationEn: 'On a 12-TET guitar, fret the ♭2 and apply a controlled +50¢ micro-bend without heavy vibrato; try pairing with an open-string tonic drone.',
        repertoire: 'Samai Bayati Ibrahim al-Aryan · Munir Bashir Taqsim Bayati'
      }
    },
    {
      id: 'maqam_rast',
      category: 'arabic',
      namePt: 'Maqam Rast',
      nameEn: 'Maqam Rast',
      intervalsQ: [0, 4, 7, 10, 14, 18, 21],
      characteristicQ: [7, 21],
      tagsPt: ['3ª Neutra (350¢)', '7ª Neutra (1050¢)', 'Pilar Árabe'],
      tagsEn: ['Neutral 3rd (350¢)', 'Neutral 7th (1050¢)', 'Arabic Pillar'],
      dossier: {
        structurePt: 'Baseado no Jins Rast (1 · ¾ · ¾) sobre a tônica e replicado na 5ª justa. Na descida tradicional, o 7º grau frequentemente desce para ♭7 (1000¢).',
        structureEn: 'Built on Jins Rast (1 · ¾ · ¾) on the tonic and replicated on the 5th. Traditionally, descending phrases often lower the 7th degree to a standard ♭7.',
        temperamentPt: 'A terça neutra (350¢) habita exatamente o limiar entre o maior e o menor, dissolvendo a dicotomia tonal ocidental.',
        temperamentEn: 'The neutral 3rd (350¢) sits right between major and minor, dissolving Western major/minor duality.',
        articulationPt: 'Use bottleneck/slide ou micro-bends curtos saindo da terça menor (♭3) para atingir a neutralidade do Rast. Excelente com timbre limpo e reverb longo.',
        articulationEn: 'Use slide or short micro-bends up from the minor 3rd (♭3) to hit the neutral sweet spot. Shines with clean tone and ambient reverb.',
        repertoire: 'Umm Kulthum — Al-Atlal · Farid al-Atrash Taqsim Rast'
      }
    },
    {
      id: 'maqam_hijaz',
      category: 'arabic',
      namePt: 'Maqam Hijaz',
      nameEn: 'Maqam Hijaz',
      intervalsQ: [0, 2, 8, 10, 14, 17, 20],
      characteristicQ: [2, 8, 17],
      tagsPt: ['2ª Aumentada', '6ª Neutra', 'Jins Hijaz'],
      tagsEn: ['Augmented 2nd', 'Neutral 6th', 'Jins Hijaz'],
      dossier: {
        structurePt: 'Tetracorde Jins Hijaz (½ · 1½ · ½) combinado com Jins Rast na 4ª. A 6ª meio-bemol suaviza o contraste dramático do salto de segunda aumentada.',
        structureEn: 'Jins Hijaz tetrachord (½ · 1½ · ½) paired with Jins Rast on the 4th. The neutral 6th softens the dramatic augmented-second leap.',
        temperamentPt: 'Na execução tradicional, a ♭2 tende a subir levemente (~120¢) e a 3ª maior a descer (~385¢), comprimindo o salto de 1½ tom.',
        temperamentEn: 'In traditional phrasing, ♭2 slightly sharpens (~120¢) and major 3rd slightly flattens (~385¢), narrowing the augmented second.',
        articulationPt: 'Explore fraseados lineares em uma única corda (estilo Oud/Saz) deslizando entre ♭2 e 3 com legato e palhetada alternada seca.',
        articulationEn: 'Explore single-string linear phrasing (Oud/Saz approach), sliding between ♭2 and 3 with tight legato and crisp picking.',
        repertoire: 'Anouar Brahem — Astrakan Café · Samai Hijaz'
      }
    },
    {
      id: 'maqam_hijaz_kar',
      category: 'arabic',
      namePt: 'Maqam Hijaz Kar',
      nameEn: 'Maqam Hijaz Kar',
      intervalsQ: [0, 2, 8, 10, 14, 16, 22],
      characteristicQ: [2, 8, 16, 22],
      tagsPt: ['Duplo Jins Hijaz', '12-TET', 'Simetria Espelhada'],
      tagsEn: ['Double Jins Hijaz', '12-TET', 'Mirrored Symmetry'],
      dossier: {
        structurePt: 'Empilha dois tetracordes Jins Hijaz separados por 1 tom (na tônica e na 5ª justa). Compartilha a malha 12-TET com Raga Bhairav, mas com condução melódica centrada na 5ª (Ghammaz).',
        structureEn: 'Stacks two Jins Hijaz tetrachords separated by a whole step (on tonic and 5th). Shares pitches with Raga Bhairav, with sayr pivoting around the 5th (Ghammaz).',
        temperamentPt: 'Totalmente executável em 12-TET; permite acordes abertos de 5ª justa + ♭2 e 7ª maior em choque controlado.',
        temperamentEn: 'Fully 12-TET playable; supports open fifth voicings rubbing against ♭2 and major 7th.',
        articulationPt: 'Experimente arpejos híbridos alternando corda solta na tônica com saltos ♭6→7 nas cordas agudas.',
        articulationEn: 'Try hybrid-picked arpeggios alternating an open tonic pedal with ♭6→7 leaps on treble strings.',
        repertoire: 'Samai Hijaz Kar · Sayyid Darwish'
      }
    },
    {
      id: 'maqam_nahawand',
      category: 'arabic',
      namePt: 'Maqam Nahawand',
      nameEn: 'Maqam Nahawand',
      intervalsQ: [0, 4, 6, 10, 14, 16, 22],
      characteristicQ: [6, 16, 22],
      tagsPt: ['Jins Nahawand', 'Jins Hijaz na 5ª', '12-TET'],
      tagsEn: ['Jins Nahawand', 'Upper Jins Hijaz', '12-TET'],
      dossier: {
        structurePt: 'Tetracorde menor Jins Nahawand (1 · ½ · 1) seguido de Jins Hijaz no 5º grau (ou Kurd na descida). Um dos maqamat mais líricos e imediatos na guitarra.',
        structureEn: 'Minor tetrachord Jins Nahawand (W · H · W) topped by Jins Hijaz on the 5th (shifting to Kurd on descent). One of the most lyrical maqamat on guitar.',
        temperamentPt: 'Nativo em 12-TET; ótimo laboratório para praticar modulações (Sayr) entre 7ª maior (sensível) e ♭7 descendente.',
        temperamentEn: '12-TET native; ideal lab for practicing sayr shifts between leading tone 7 and descending ♭7.',
        articulationPt: 'Acentue o 5º grau como polo dramático usando vibrato vocal e ornamentos rápidos (mordentes) saindo da ♭6.',
        articulationEn: 'Treat the 5th as a dramatic pivot using vocal vibrato and crisp mordents from the ♭6.',
        repertoire: 'Fairuz — Ya Ana Ya Ana · Riyad al-Sunbati'
      }
    },
    {
      id: 'maqam_ajam',
      category: 'arabic',
      namePt: 'Maqam Ajam',
      nameEn: 'Maqam Ajam',
      intervalsQ: [0, 4, 8, 10, 14, 18, 22],
      characteristicQ: [8, 14],
      tagsPt: ['Jins Ajam', '12-TET', 'Solar / Épico'],
      tagsEn: ['Jins Ajam', '12-TET', 'Radiant / Epic'],
      dossier: {
        structurePt: 'Embora coincida em notas com a escala maior ocidental, o Ajam organiza-se por Jins Ajam na base (1 · 1 · ½) e modula com frequência para Nahawand na 5ª ou Saba/Hijaz no 3º grau.',
        structureEn: 'Though pitch-identical to Western Major, Ajam phrases through Jins Ajam (W · W · H) and frequently modulates to Nahawand on the 5th or Hijaz on the 3rd.',
        temperamentPt: 'Na execução tradicional do Oud, a 3ª maior tende ligeiramente mais próxima da entonação justa (~386¢) sobre o drone.',
        temperamentEn: 'In traditional Oud performance, the major 3rd often leans slightly toward Just Intonation (~386¢) against a drone.',
        articulationPt: 'Evite cadências V7–I óbvias: explore linhas horizontais com drones em B♭ ou C e voicings quintais abertos.',
        articulationEn: 'Bypass cliché V7–I cadences: explore horizontal melodies over B♭ or C drones and open quintal voicings.',
        repertoire: 'Mohammed Abdel Wahab · Samai Ajam'
      }
    },
    {
      id: 'maqam_nikriz',
      category: 'arabic',
      namePt: 'Maqam Nikriz',
      nameEn: 'Maqam Nikriz',
      intervalsQ: [0, 4, 6, 12, 14, 18, 20],
      characteristicQ: [6, 12, 18],
      tagsPt: ['Jins Nikriz', 'Dórico ♯4', '12-TET'],
      tagsEn: ['Jins Nikriz', 'Dorian ♯4', '12-TET'],
      dossier: {
        structurePt: 'Pentacorde Jins Nikriz (1 · ½ · 1½ · ½) com salto expressivo entre ♭3 e ♯4, combinado com 6ª maior e ♭7 no registro agudo (Jins Nahawand ou Rast na 5ª).',
        structureEn: 'Jins Nikriz pentachord (W · H · m3 · H) spotlighting the ♭3→♯4 leap, paired with major 6th and ♭7 above.',
        temperamentPt: '12-TET nativo (equivalente ao 4º modo da menor harmônica / Dórico ♯4), perfeito para fundir linguagem árabe, jazz modal e metal progressivo.',
        temperamentEn: '12-TET native (4th mode of harmonic minor / Dorian ♯4), a powerhouse for fusing Arabic phrasing, modal jazz, and progressive metal.',
        articulationPt: 'Combine riffs sincopados em 10/8 (Sama’i Thaqil) enfatizando o trítono ♯4 resolvendo na 5ª justa.',
        articulationEn: 'Pair with syncopated 10/8 (Sama’i Thaqil) riffs leaning on the ♯4 tritone resolving into the 5th.',
        repertoire: 'Rabih Abou-Khalil — Blue Camel · Samai Nikriz'
      }
    },
    {
      id: 'maqam_saba',
      category: 'arabic',
      namePt: 'Maqam Saba',
      nameEn: 'Maqam Saba',
      intervalsQ: [0, 3, 6, 8, 14, 16, 20],
      characteristicQ: [3, 8],
      tagsPt: ['4ª Diminuta', 'Tensão Intensa', 'Assimétrico'],
      tagsEn: ['Diminished 4th', 'High Tension', 'Asymmetric'],
      dossier: {
        structurePt: 'Começa com Jins Saba (¾ · ¾ · ½), quebrando a 4ª justa em uma 4ª diminuta (8q) que gera uma sensação melancólica e suspensa inconfundível.',
        structureEn: 'Opens with Jins Saba (¾ · ¾ · ½), collapsing the perfect 4th into a diminished 4th (8q) for a haunting, unresolved gravity.',
        temperamentPt: 'A distância entre o 2º grau neutro (150¢) e a 4ª diminuta (400¢) concentra alta densidade intervalar na região grave da oitava.',
        temperamentEn: 'The tight cluster from neutral 2nd (150¢) to diminished 4th (400¢) concentrates dense emotional gravity in the lower register.',
        articulationPt: 'Evite acordes fechados ocidentais; use intervalos de 2ª/4ª aberta ou drones de uma nota só enquanto explora bends lentos de ¼ de tom.',
        articulationEn: 'Avoid dense Western triads; use open drone dyads or single-note swells while leaning into slow quarter-tone bends.',
        repertoire: 'Simon Shaheen — Taqsim Saba · Wadih El Safi'
      }
    },
    {
      id: 'maqam_nawa_athar',
      category: 'arabic',
      namePt: 'Maqam Nawa Athar',
      nameEn: 'Maqam Nawa Athar',
      intervalsQ: [0, 4, 6, 12, 14, 16, 22],
      characteristicQ: [6, 12, 22],
      tagsPt: ['12-TET Compatível', 'Dupla 2ª Aumentada', 'Escuro'],
      tagsEn: ['12-TET Friendly', 'Double Aug 2nd', 'Dark'],
      dossier: {
        structurePt: 'Também chamado de Menor Húngara no Ocidente: dois saltos de segunda aumentada (♭3→♯4 e ♭6→7) criam simetria sombria e cinematográfica.',
        structureEn: 'Equivalent in 12-TET to Hungarian Minor: two augmented-second leaps (♭3→♯4 and ♭6→7) create a dark, dramatic symmetry.',
        temperamentPt: 'Não exige microtons obrigatórios, tornando-se a ponte ideal para transferir fraseado árabe e riffs pesados/modais diretamente para a guitarra com trastes.',
        temperamentEn: 'Requires no quarter-tones, making it an ideal bridge for transferring Arabic phrasing and dark modal riffs straight to standard fretted guitar.',
        articulationPt: 'Experimente arpejar díades de trítono (1–♯4) e 7ª maior (1–7) com overdrive moderado ou fuzz, alternando com frases rápidas de tremolo picking.',
        articulationEn: 'Try arpeggiating tritone (1–♯4) and major-7th dyads with overdrive or fuzz, contrasting with rapid tremolo-picked lines.',
        repertoire: 'Farid al-Atrash — Nawa Athar · Rabih Abou-Khalil'
      }
    },
    {
      id: 'maqam_athar_kurd',
      category: 'arabic',
      namePt: 'Maqam Athar Kurd',
      nameEn: 'Maqam Athar Kurd',
      intervalsQ: [0, 2, 6, 12, 14, 16, 22],
      characteristicQ: [2, 12, 22],
      tagsPt: ['Kurd + ♯4 + 7M', '12-TET', 'Dramático'],
      tagsEn: ['Kurd + ♯4 + M7', '12-TET', 'Dramatic'],
      dossier: {
        structurePt: 'Funde o início sombrio do Kurd (♭2, ♭3) com a ♯4 e a 7ª maior do Nawa Athar. Gera uma paleta extremamente expressiva para solos e riffs modais.',
        structureEn: 'Merges the dark Kurd opening (♭2, ♭3) with Nawa Athar’s ♯4 and major 7th — delivering an intensely dramatic palette for solos and modal riffs.',
        temperamentPt: '12-TET nativo com dois saltos de 1½ tom (♭3→♯4 e ♭6→7) e dois semitons adjacentes à tônica (7–1–♭2).',
        temperamentEn: '12-TET native featuring two augmented-2nd leaps (♭3→♯4 and ♭6→7) and semitones flanking the tonic (7–1–♭2).',
        articulationPt: 'Explore o cluster cromático 7–1–♭2 em cordas adjacentes com sustain elétrico ou delay modulante.',
        articulationEn: 'Exploit the 7–1–♭2 chromatic cluster across adjacent strings with electric sustain or modulated delay.',
        repertoire: 'Farid al-Atrash · Marcel Khalife'
      }
    },
    {
      id: 'maqam_sikah',
      category: 'arabic',
      namePt: 'Maqam Sikah',
      nameEn: 'Maqam Sikah',
      intervalsQ: [0, 3, 7, 11, 14, 17, 21],
      characteristicQ: [3, 7, 11],
      tagsPt: ['Tricorde Sikah', 'Eixo Neutro', 'Microtonal'],
      tagsEn: ['Sikah Trichord', 'Neutral Axis', 'Microtonal'],
      dossier: {
        structurePt: 'Construído a partir de um tricorde (¾ · 1) em vez de tetracorde. Tradicionalmente nasce sobre E½♭, fazendo praticamente toda a malha intervalar flutuar em quartos de tom.',
        structureEn: 'Built on a trichord (¾ · 1) rather than a tetrachord. Traditionally rooted on E½♭, making the scale grid float across quarter-tone intervals.',
        temperamentPt: 'Ótimo teste de percepção no modo Slide ou Trastes 24-TET: observe como a 5ª justa (14q) ancora um ambiente cercado de graus neutros.',
        temperamentEn: 'A prime ear-training lab in Slide or 24-TET Frets mode: notice how the perfect 5th (14q) anchors a field of neutral degrees.',
        articulationPt: 'Ative o modo Slide/Fretless e explore glissandos suaves em uma única corda, repousando na tônica e no 3º grau neutro.',
        articulationEn: 'Switch to Slide/Fretless mode and explore slow single-string glissandi, resting on the tonic and neutral 3rd.',
        repertoire: 'Samai Sikah · George Abyad'
      }
    },
    {
      id: 'maqam_kurd',
      category: 'arabic',
      namePt: 'Maqam Kurd',
      nameEn: 'Maqam Kurd',
      intervalsQ: [0, 2, 6, 10, 14, 16, 20],
      characteristicQ: [2, 16],
      tagsPt: ['12-TET', 'Jins Kurd', 'Frígio Árabe'],
      tagsEn: ['12-TET', 'Jins Kurd', 'Arabic Phrygian'],
      dossier: {
        structurePt: 'Compartilha as notas do modo Frígio, mas organiza-se por Jins Kurd (½ · 1 · 1) na base e Jins Nahawand na 4ª justa — mudando completamente os pontos de repouso.',
        structureEn: 'Shares pitches with Phrygian, but organizes around Jins Kurd (½ · 1 · 1) and Jins Nahawand on the 4th — transforming phrasing and resting tones.',
        temperamentPt: 'Totalmente executável em 12-TET, com micro-inflexões expressivas opcionais na ♭2.',
        temperamentEn: 'Fully playable in 12-TET, with optional expressive micro-inflections on the ♭2.',
        articulationPt: 'Use a 4ª justa como pivô melódico antes de resolver na tônica via ♭2. Funciona extraordinariamente bem em DADGAD ou Drop D.',
        articulationEn: 'Use the perfect 4th as a melodic pivot before resolving down through ♭2 to the tonic. Works brilliantly in DADGAD or Drop D.',
        repertoire: 'Le Trio Joubran · Fairuz — Habaytak Bissayf'
      }
    },

    // --- GLOBAL & RAGAS ---
    {
      id: 'raga_bhairav',
      category: 'global',
      namePt: 'Raga Bhairav (Thaat)',
      nameEn: 'Raga Bhairav (Thaat)',
      intervalsQ: [0, 2, 8, 10, 14, 16, 22],
      characteristicQ: [2, 16],
      tagsPt: ['Dupla Harmônica', 'Andolan', 'Raga da Aurora'],
      tagsEn: ['Double Harmonic', 'Andolan', 'Dawn Raga'],
      dossier: {
        structurePt: 'Simetria espelhada entre os dois tetracordes (½ · 1½ · ½ | 1 | ½ · 1½ · ½). Equivalente à escala Bizantina / Hijaz Kar.',
        structureEn: 'Mirrored symmetry across both tetrachords (½ · 1½ · ½ | 1 | ½ · 1½ · ½). Equivalent to Byzantine / Hijaz Kar.',
        temperamentPt: 'No Hindustani clássico, Komal Re (♭2) e Komal Dha (♭6) recebem Andolan — uma oscilação microtonal lenta e solene.',
        temperamentEn: 'In Hindustani practice, Komal Re (♭2) and Komal Dha (♭6) receive Andolan — a slow, solemn microtonal oscillation.',
        articulationPt: 'Ligue o Drone com 5ª justa e pratique bends lentos (Meend) ligando a tônica à 3ª maior passando pela ♭2 sem atacar novamente com a palheta.',
        articulationEn: 'Turn on the Drone with 5th and practice slow bends (Meend) gliding between tonic, ♭2, and major 3rd on a single pick stroke.',
        repertoire: 'Ravi Shankar — Raga Bhairav · Nikhil Banerjee'
      }
    },
    {
      id: 'raga_marwa',
      category: 'global',
      namePt: 'Raga Marwa (Hexatônica)',
      nameEn: 'Raga Marwa (Hexatonic)',
      intervalsQ: [0, 2, 8, 12, 18, 22],
      characteristicQ: [2, 12, 18],
      tagsPt: ['Sem 5ª Justa', 'Crepúsculo', 'Tensão Suspensa'],
      tagsEn: ['No Perfect 5th', 'Dusk Raga', 'Suspended Tension'],
      dossier: {
        structurePt: 'Omite deliberadamente a 5ª justa! Combina ♭2, 3ª maior, ♯4 (Tivra Ma), 6ª maior e 7ª maior — criando sensação de flutuação sem chão harmônico.',
        structureEn: 'Deliberately omits the perfect 5th! Combines ♭2, major 3rd, ♯4 (Tivra Ma), major 6th, and major 7th — producing an ungrounded, floating aura.',
        temperamentPt: 'Como não há 5ª justa, evite ligar a 5ª no drone (deixe apenas a tônica pura) para preservar o vazio acústico típico do Marwa.',
        temperamentEn: 'Because the 5th is omitted, keep the drone on pure tonic (5th off) to preserve Marwa’s stark acoustic suspension.',
        articulationPt: 'Trate a ♭2 e a 6ª maior como polos de repouso temporário, evitando cair na tônica cedo demais. Ótima para texturas shoegaze/ambient.',
        articulationEn: 'Treat ♭2 and major 6th as temporary resting poles, delaying tonic resolution. Stellar for shoegaze and ambient textures.',
        repertoire: 'Ali Akbar Khan — Raga Marwa · Derek Bailey (modal fragments)'
      }
    },
    {
      id: 'gamelan_pelog_24',
      category: 'global',
      namePt: 'Gamelan Pelog (Aprox. 24-TET)',
      nameEn: 'Gamelan Pelog (24-TET Approx.)',
      intervalsQ: [0, 3, 6, 11, 14, 16, 21],
      characteristicQ: [3, 11, 21],
      tagsPt: ['Java / Bali', 'Microtonal', 'Ciclos Kotekan'],
      tagsEn: ['Java / Bali', 'Microtonal', 'Kotekan Cycles'],
      dossier: {
        structurePt: 'Aproximação em 24-TET da escala heptatônica indonésia Pelog (geralmente praticada em subconjuntos pentatônicos como Pelog Bem ou Pelog Barang).',
        structureEn: '24-TET approximation of the Indonesian 7-tone Pelog system (often played in 5-tone subsets such as Pelog Bem or Pelog Barang).',
        temperamentPt: 'Cada conjunto de Gamelan possui sua afinação única (embat); os graus em 150¢, 550¢ e 1050¢ capturam o contraste entre intervalos estreitos e amplos.',
        temperamentEn: 'Every Gamelan ensemble has a unique tuning (embat); degrees at 150¢, 550¢, and 1050¢ capture its stark contrast of narrow and wide steps.',
        articulationPt: 'Ative o modo Trastes 24-TET ou Slide e crie padrões entrelaçados (kotekan) com delay rítmico e o motor polimétrico em 7 ou 5.',
        articulationEn: 'Enable 24-TET Frets or Slide mode and build interlocking kotekan ostinatos with rhythmic delay and polymetric track B.',
        repertoire: 'Gamelan Gong Kebyar · Lou Harrison · King Gizzard (microtonal)'
      }
    },
    {
      id: 'jp_insen',
      category: 'global',
      namePt: 'Escala In-Sen (Japão)',
      nameEn: 'In-Sen Scale (Japan)',
      intervalsQ: [0, 2, 10, 14, 20],
      characteristicQ: [2, 10],
      tagsPt: ['Pentatônica', 'Koto / Shakuhachi', 'Quartal'],
      tagsEn: ['Pentatonic', 'Koto / Shakuhachi', 'Quartal'],
      dossier: {
        structurePt: 'Pentatônica semitonal (1 · ♭2 · 4 · 5 · ♭7). Gera automaticamente acordes suspensos, quartais e sonoridades de koto.',
        structureEn: 'Hemitonic pentatonic (1 · ♭2 · 4 · 5 · ♭7). Naturally yields suspended voicings, quartal stacks, and koto-like phrasing.',
        temperamentPt: 'Compatível com 12-TET, mas responde muito bem a micro-bends expressivos sobre a ♭2 e a ♭7 (estilo shakuhachi).',
        temperamentEn: '12-TET native, yet responds wonderfully to subtle shakuhachi-style pitch bends on ♭2 and ♭7.',
        articulationPt: 'Experimente arpejar shapes abertos misturando cordas soltas e harmônicos naturais na 5ª, 7ª e 12ª casas.',
        articulationEn: 'Arpeggiate open shapes blending open strings with natural harmonics at the 5th, 7th, and 12th frets.',
        repertoire: 'Toru Takemitsu · Allan Holdsworth (pentatonic extensions)'
      }
    },
    {
      id: 'br_armorial_lydian_b7',
      category: 'global',
      namePt: 'Nordestina / Lídio ♭7 (Armorial)',
      nameEn: 'Northeastern / Lydian ♭7 (Armorial)',
      intervalsQ: [0, 4, 8, 12, 14, 18, 20],
      characteristicQ: [12, 20],
      tagsPt: ['Série Harmônica', 'Movimento Armorial', 'Bordão'],
      tagsEn: ['Acoustic Scale', 'Armorial Movement', 'Drone'],
      dossier: {
        structurePt: 'Combina a ♯4 do Lídio com a ♭7 do Mixolídio (escala acústica / 4º modo da menor melódica). Base recorrente na rabeca, pífano e viola nordestina.',
        structureEn: 'Combines Lydian ♯4 with Mixolydian ♭7 (acoustic scale / 4th mode of melodic minor). Core color of Northeastern Brazilian rabeca, pífano, and viola.',
        temperamentPt: 'Aproxima-se diretamente dos parciais 7 (♭7 a -31¢) e 11 (♯4 a -49¢) da série harmônica natural.',
        temperamentEn: 'Closely mirrors partials 7 (♭7 at -31¢) and 11 (♯4 at -49¢) of the natural overtone series.',
        articulationPt: 'Ative os Harmônicos Espectrais e toque em DADGAD ou Orkney usando bordões contínuos e ataques percussivos na mão direita.',
        articulationEn: 'Toggle Spectral Harmonics and try DADGAD or Orkney tuning with continuous drone strings and percussive right-hand articulation.',
        repertoire: 'Quinteto Armorial · Hermeto Pascoal · Elomar'
      }
    },

    // --- MESSIAEN & SYMMETRIES ---
    {
      id: 'messiaen_mode2',
      category: 'messiaen',
      namePt: 'Messiaen Modo 2 (Octatônica ½–1)',
      nameEn: 'Messiaen Mode 2 (Octatonic H–W)',
      intervalsQ: [0, 2, 6, 8, 12, 14, 18, 20],
      characteristicQ: [2, 12],
      tagsPt: ['3 Transposições', 'Simetria em 3ªm', 'Diminuta'],
      tagsEn: ['3 Transpositions', 'm3 Symmetry', 'Diminished'],
      dossier: {
        structurePt: 'Alternância estrita ½ · 1 · ½ · 1 · ½ · 1 · ½ · 1. Qualquer digitação desenhada no braço pode ser deslocada exatamente 3 casas acima ou abaixo mantendo a mesma escala.',
        structureEn: 'Strict H · W alternation. Any fretboard geometry shifts identically every 3 frets up or down while remaining inside the exact same pitch collection.',
        temperamentPt: 'Simetria pura em 12-TET. Permite sobrepor quatro tríades maiores ou menores espaçadas por terças menores (ex.: C, E♭, F♯, A).',
        temperamentEn: 'Pure 12-TET symmetry. Allows superimposing four major or minor triads spaced by minor 3rds (e.g., C, E♭, F♯, A).',
        articulationPt: 'Desenhe um motivo de 4 notas em duas cordas e mova-o em blocos de +3 casas com palhetada híbrida ou tapping simétrico.',
        articulationEn: 'Build a 4-note cell across two strings and shift it in +3 fret blocks using hybrid picking or symmetrical tapping.',
        repertoire: 'Olivier Messiaen — Quatuor pour la fin du temps · Tigran Hamasyan'
      }
    },
    {
      id: 'messiaen_mode3',
      category: 'messiaen',
      namePt: 'Messiaen Modo 3 (9 Notas)',
      nameEn: 'Messiaen Mode 3 (9-Note)',
      intervalsQ: [0, 4, 6, 8, 12, 14, 16, 20, 22],
      characteristicQ: [8, 16],
      tagsPt: ['4 Transposições', 'Simetria em 3ªM', 'Aumentada'],
      tagsEn: ['4 Transpositions', 'M3 Symmetry', 'Augmented'],
      dossier: {
        structurePt: 'Divide a oitava em três células idênticas (1 · ½ · ½) espaçadas por terças maiores (4 casas). Em afinação Major Thirds, o desenho se repete idêntico em todas as cordas.',
        structureEn: 'Divides the octave into three identical cells (W · H · H) spaced by major 3rds (4 frets). In Major Thirds tuning, the shape repeats identically across every string.',
        temperamentPt: 'Riquíssimo em tríades aumentadas e policordes em relação mediântica cromática (ex.: C, E, A♭).',
        temperamentEn: 'Rich in augmented triads and chromatic mediant polychords (e.g., C, E, A♭).',
        articulationPt: 'Combine com a afinação Major Thirds (C–E–G♯–C–E–G♯) e crie arpejos diagonais simétricos de alto impacto.',
        articulationEn: 'Pair with Major Thirds tuning (C–E–G♯–C–E–G♯) to unlock effortless diagonal symmetrical arpeggios.',
        repertoire: 'Olivier Messiaen · Kurt Rosenwinkel · Allan Holdsworth'
      }
    },
    {
      id: 'messiaen_mode4',
      category: 'messiaen',
      namePt: 'Messiaen Modo 4 (Simetria em Trítono)',
      nameEn: 'Messiaen Mode 4 (Tritone Symmetry)',
      intervalsQ: [0, 2, 4, 10, 12, 14, 16, 22],
      characteristicQ: [2, 10, 12],
      tagsPt: ['6 Transposições', 'Clusters + Saltos', 'Contemporâneo'],
      tagsEn: ['6 Transpositions', 'Clusters + Leaps', 'Contemporary'],
      dossier: {
        structurePt: 'Duas metades idênticas (½ · ½ · 1½ · ½) replicadas no trítono. Alterna blocos cromáticos densos com grandes vazios de terça menor.',
        structureEn: 'Two identical halves (H · H · m3 · H) replicated at the tritone. Alternates tight chromatic clusters with wide minor-3rd voids.',
        temperamentPt: 'Ideal para gerar voicings secundais/clusters que deslizam simetricamente em saltos de 6 casas.',
        temperamentEn: 'Ideal for building secundal cluster voicings that glide symmetrically in 6-fret leaps.',
        articulationPt: 'No Laboratório Harmônico, teste o Cluster Secundai sobre este modo e mova o voicing +6 casas.',
        articulationEn: 'In the Harmony Lab, try the Secundal Cluster over this mode and shift the voicing +6 frets.',
        repertoire: 'Olivier Messiaen — Turangalîla · Ben Monder'
      }
    },
    {
      id: 'messiaen_mode6',
      category: 'messiaen',
      namePt: 'Messiaen Modo 6',
      nameEn: 'Messiaen Mode 6',
      intervalsQ: [0, 4, 8, 10, 12, 16, 20, 22],
      characteristicQ: [8, 12],
      tagsPt: ['6 Transposições', 'Simetria em Trítono', 'Híbrido'],
      tagsEn: ['6 Transpositions', 'Tritone Symmetry', 'Hybrid'],
      dossier: {
        structurePt: 'Duas metades idênticas separadas por um trítono (1 · 1 · ½ · ½). Mistura a flutuação da escala de tons inteiros com tensões cromáticas afiadas.',
        structureEn: 'Two identical halves separated by a tritone (W · W · H · H). Blends whole-tone drift with razor-sharp chromatic tension.',
        temperamentPt: 'Qualquer frase ou acorde funciona exatamente igual 6 casas acima.',
        temperamentEn: 'Any melodic cell or chord shape transposes identically 6 frets up.',
        articulationPt: 'Use voicings com 2ªs menores internas (clusters de 4 e ♯4) deixando soar com delay longo para texturas cinematográficas.',
        articulationEn: 'Build voicings with internal minor 2nds (4 against ♯4 clusters) letting them bloom into long delay trails.',
        repertoire: 'Olivier Messiaen — Vingt Regards · Ben Monder'
      }
    },
    {
      id: 'slonimsky_tritone_interp',
      category: 'messiaen',
      namePt: 'Slonimsky #1 (Interpolação de Trítono)',
      nameEn: 'Slonimsky #1 (Tritone Interpolation)',
      intervalsQ: [0, 2, 6, 12, 14, 18],
      characteristicQ: [6, 12],
      tagsPt: ['Slonimsky', 'Angular', '6 Notas'],
      tagsEn: ['Slonimsky', 'Angular', '6-Note'],
      dossier: {
        structurePt: 'Inspirado no Thesaurus de Nicolas Slonimsky: divide a oitava ao meio (trítono) e interpola cada metade com os mesmos saltos (½ · 1 · 1½).',
        structureEn: 'Drawn from Nicolas Slonimsky’s Thesaurus: bisects the octave at the tritone and interpolates each half identically (H · W · m3).',
        temperamentPt: 'Padrão simétrico de 6 notas excelente para quebrar hábitos escalares diatônicos e gerar linhas pós-bop / free jazz.',
        temperamentEn: 'A 6-note symmetrical grid ideal for breaking scalar muscle memory and generating angular post-bop or free-jazz lines.',
        articulationPt: 'Experimente em All Fourths (EADGCF) com string skipping (saltando uma corda entre cada par de notas).',
        articulationEn: 'Try in All Fourths (EADGCF) using string skipping between note pairs.',
        repertoire: 'John Coltrane — Giant Steps sketches · Eric Dolphy · Meshuggah'
      }
    },

    // --- POST-TONAL & PITCH SETS ---
    {
      id: 'set_viennese_016',
      category: 'postTonal',
      namePt: 'Tricorde Vienense [0, 1, 6]',
      nameEn: 'Viennese Trichord [0, 1, 6]',
      intervalsQ: [0, 2, 12],
      characteristicQ: [2, 12],
      tagsPt: ['Forte 3-5', 'Vetor <100011>', 'Atonal'],
      tagsEn: ['Forte 3-5', 'Vector <100011>', 'Atonal'],
      dossier: {
        structurePt: 'Assinatura da Segunda Escola de Viena (Webern, Berg, Schoenberg): reúne semitom, quarta justa e trítono em apenas três alturas.',
        structureEn: 'Signature of the Second Viennese School (Webern, Berg, Schoenberg): packs a semitone, perfect 4th, and tritone into just three pitches.',
        temperamentPt: 'Alta tensão harmônica com clareza estrutural extrema — zero terças maiores ou menores no vetor intervalar.',
        temperamentEn: 'High harmonic tension with razor-sharp clarity — zero major or minor thirds in its interval vector.',
        articulationPt: 'Toque como acordes espaçados de 3 cordas (ex.: tônica grave + trítono médio + ♭2 aguda) ou como arpejo esparso com dinâmica pontilhista.',
        articulationEn: 'Voice as wide 3-string chords (low root + mid tritone + high ♭2) or pointillist sparse arpeggios.',
        repertoire: 'Anton Webern · Alban Berg · Sonny Sharrock · Mary Halvorson'
      }
    },
    {
      id: 'set_all_interval_0146',
      category: 'postTonal',
      namePt: 'Tetracorde Todos-os-Intervalos [0, 1, 4, 6]',
      nameEn: 'All-Interval Tetrachord [0, 1, 4, 6]',
      intervalsQ: [0, 2, 8, 12],
      characteristicQ: [2, 8, 12],
      tagsPt: ['Forte 4-Z15', 'Vetor <111111>', 'Universal'],
      tagsEn: ['Forte 4-Z15', 'Vector <111111>', 'Universal'],
      dossier: {
        structurePt: 'Um dos dois únicos conjuntos de 4 notas capazes de conter exatamente uma ocorrência de cada classe intervalar (da 2ªm ao trítono).',
        structureEn: 'One of only two 4-note sets containing exactly one occurrence of every interval class from minor 2nd to tritone.',
        temperamentPt: 'Equilíbrio matemático perfeito entre consonância e dissonância (<1,1,1,1,1,1>).',
        temperamentEn: 'Perfect mathematical balance between consonance and dissonance (<1,1,1,1,1,1>).',
        articulationPt: 'Use o gerador de voicings abaixo para explorar 4 inversões desse tetracorde com condução suave de vozes.',
        articulationEn: 'Use the voicing solver below to explore 4 inversions of this tetrachord with smooth voice-leading.',
        repertoire: 'Elliott Carter · György Ligeti · Marc Ribot'
      }
    },
    {
      id: 'set_quartal_pent',
      category: 'postTonal',
      namePt: 'Pilha Quartal Aberta [0, 2, 5, 7, 10]',
      nameEn: 'Open Quartal Stack [0, 2, 5, 7, 10]',
      intervalsQ: [0, 4, 10, 14, 20],
      characteristicQ: [10, 20],
      tagsPt: ['Harmonia Quartal', 'McCoy Tyner', 'Aberto'],
      tagsEn: ['Quartal Harmony', 'McCoy Tyner', 'Open'],
      dossier: {
        structurePt: 'Equivalente ao empilhamento de 5 quartas consecutivas (ex.: C–F–B♭–E♭–A♭ reordenado), produzindo um campo harmônico aberto sem centro tonal rígido.',
        structureEn: 'Generated by stacking consecutive 4ths, creating an open, non-functional harmonic field free from tonic-dominant gravity.',
        temperamentPt: 'Na afinação All Fourths (EADGCF), acordes quartais viram pestanas verticais puras em qualquer casa do braço.',
        temperamentEn: 'In All Fourths tuning (EADGCF), quartal voicings collapse into pure vertical barres anywhere on the neck.',
        articulationPt: 'Deslize blocos paralelos de 3 ou 4 cordas (planing) sobre um drone contínuo na tônica.',
        articulationEn: 'Slide parallel 3- or 4-string quartal blocks (planing) over a sustained tonic drone.',
        repertoire: 'McCoy Tyner · Bill Frisell · Julian Lage'
      }
    },

    // --- MODAL REFERENCE ---
    {
      id: 'std_dorian',
      category: 'standard',
      namePt: 'Dórico (Referência Modal)',
      nameEn: 'Dorian (Modal Reference)',
      intervalsQ: [0, 4, 6, 10, 14, 18, 20],
      characteristicQ: [18],
      tagsPt: ['6ª Maior', 'Simétrico', 'Jazz / Fusion'],
      tagsEn: ['Major 6th', 'Palindromic', 'Jazz / Fusion'],
      dossier: {
        structurePt: 'Escala palíndroma (1 · ½ · 1 · 1 · 1 · ½ · 1): idêntica de frente para trás. A 6ª maior sobre base menor traz brilho modal equilibrado.',
        structureEn: 'Palindromic interval structure (W · H · W · W · W · H · W). The natural 6th over a minor triad creates balanced modal lift.',
        temperamentPt: 'Referência fundamental para contrastar com Bayati (rebaixando a 2ª em ¼ de tom) ou Kurd (rebaixando a 2ª em ½ tom).',
        temperamentEn: 'Ideal baseline for contrasting with Bayati (lowering the 2nd by a quarter-tone) or Kurd (lowering the 2nd by a semitone).',
        articulationPt: 'Explore voicings quartais construídos sobre os graus 1, 2 e 5 para comping modal contemporâneo.',
        articulationEn: 'Explore quartal voicings built on degrees 1, 2, and 5 for modern modal comping.',
        repertoire: 'Miles Davis — So What · Grant Green · Charles Mingus'
      }
    },
    {
      id: 'std_lydian',
      category: 'standard',
      namePt: 'Lídio (Referência Modal)',
      nameEn: 'Lydian (Modal Reference)',
      intervalsQ: [0, 4, 8, 12, 14, 18, 22],
      characteristicQ: [12],
      tagsPt: ['4ª Aumentada', 'Luminoso', 'Post-Rock / Jazz'],
      tagsEn: ['Augmented 4th', 'Luminous', 'Post-Rock / Jazz'],
      dossier: {
        structurePt: 'Empilhamento completo de 7 quintas justas (C–G–D–A–E–B–F♯). A ♯4 elimina a tensão de evitar-nota da 4ª justa sobre acordes maiores.',
        structureEn: 'Complete stack of 7 perfect fifths. The ♯4 removes the avoid-note rub over major harmony, opening vast shimmering sonorities.',
        temperamentPt: 'Forte afinidade com a afinação Open Lydian (F–A–C–G–C–E) e com harmônicos naturais.',
        temperamentEn: 'Strong affinity with Open Lydian tuning (F–A–C–G–C–E) and natural string harmonics.',
        articulationPt: 'Deixe cordas soltas ressoarem junto com díades de ♯4–5 ou 7–♯4 em volume swells.',
        articulationEn: 'Let open strings ring sympathetically against ♯4–5 or 7–♯4 dyads using volume swells.',
        repertoire: 'Joe Satriani · Deafheaven (shoegaze sections) · Pat Metheny'
      }
    }
  ],

  /**
   * Phase 2 Harmonic Structures — Non-Tercial, Post-Tonal, Microtonal Arabic & Contemporary Jazz
   */
  chords: [
    {
      id: 'quartal_3',
      family: 'nonTercial',
      namePt: 'Quartal de 3 Vozes (1–4–♭7)',
      nameEn: '3-Voice Quartal (1–4–♭7)',
      symbol: 'Q3',
      intervalsQ: [0, 10, 20],
      notePt: 'Empilhamento puro de duas 4ªs justas. Base do comping modal (McCoy Tyner / So What) e superposição livre sobre Dórico, Kurd ou In-Sen.',
      noteEn: 'Pure stack of two perfect 4ths. Core of modal comping (McCoy Tyner / So What) and free planing over Dorian, Kurd, or In-Sen.'
    },
    {
      id: 'quartal_4_so_what',
      family: 'nonTercial',
      namePt: 'So What / Quartal + 3ªM (1–4–♭7–♭3–5)',
      nameEn: 'So What Voicing (1–4–♭7–♭3–5)',
      symbol: 'm11(SW)',
      intervalsQ: [0, 10, 20, 6, 14],
      notePt: 'Três quartas justas coroadas por uma terça maior no topo (Bill Evans). Funciona como tônica menor modal ou acorde suspenso moderno.',
      noteEn: 'Three stacked 4ths crowned by a major 3rd on top (Bill Evans). Serves as a lush modal minor tonic or modern suspended color.'
    },
    {
      id: 'quintal_3',
      family: 'nonTercial',
      namePt: 'Quintal Aberto (1–5–9)',
      nameEn: 'Open Quintal (1–5–9)',
      symbol: 'add9(no3)',
      intervalsQ: [0, 14, 4],
      notePt: 'Duas 5ªs justas empilhadas sem terça: ambiguidade maior/menor ideal para Shoegaze, Post-Rock, Metal Atmosférico e bordões modais.',
      noteEn: 'Two stacked 5ths with no 3rd: major/minor ambiguity ideal for Shoegaze, Post-Rock, Atmospheric Metal, and modal drones.'
    },
    {
      id: 'lydian_shell',
      family: 'nonTercial',
      namePt: 'Lídio Cristalino (1–♯4–5–7)',
      nameEn: 'Crystalline Lydian (1–♯4–5–7)',
      symbol: 'maj7♯11(no3)',
      intervalsQ: [0, 12, 14, 22],
      notePt: 'Atrito luminoso entre ♯4 e 5ª justa sustentado pela 7ª maior. Excelente com reverb longo ou afinação Open Lydian.',
      noteEn: 'Luminous rub between ♯4 and perfect 5th framed by major 7th. Shines with ambient reverb or Open Lydian tuning.'
    },
    {
      id: 'cluster_secundal',
      family: 'cluster',
      namePt: 'Cluster Secundai (1–♭2–2–5)',
      nameEn: 'Secundal Cluster (1–♭2–2–5)',
      symbol: 'Clust',
      intervalsQ: [0, 2, 4, 14],
      notePt: 'Choque denso de 2ªs menores e maiores ancorado pela 5ª. Textura visceral para música experimental, noise controlado e Messiaen Modo 4.',
      noteEn: 'Dense clash of minor and major 2nds anchored by the 5th. Visceral texture for experimental music, controlled noise, and Messiaen Mode 4.'
    },
    {
      id: 'viennese_chord',
      family: 'postTonal',
      namePt: 'Tricorde Vienense [0, 1, 6]',
      nameEn: 'Viennese Trichord [0, 1, 6]',
      symbol: '[016]',
      intervalsQ: [0, 2, 12],
      notePt: 'Semitom + Trítono (Forte 3-5). Sonoridade angular de Webern/Berg e guitarra avant-garde.',
      noteEn: 'Semitone + Tritone (Forte 3-5). Angular harmonic signature of Webern/Berg and avant-garde guitar.'
    },
    {
      id: 'all_interval_chord',
      family: 'postTonal',
      namePt: 'Tetracorde Todos-os-Intervalos [0, 1, 4, 6]',
      nameEn: 'All-Interval Tetrachord [0, 1, 4, 6]',
      symbol: '[0146]',
      intervalsQ: [0, 2, 8, 12],
      notePt: 'Contém todas as 6 classes intervalares (<111111>). Tensão equilibrada de alta sofisticação harmônica.',
      noteEn: 'Contains every interval class once (<111111>). Balanced high-density contemporary tension.'
    },
    {
      id: 'rast_neutral_triad',
      family: 'microtonal',
      namePt: 'Tríade Neutra Rast (1–3½♭–5)',
      nameEn: 'Rast Neutral Triad (1–3½♭–5)',
      symbol: 'Rast(½♭)',
      intervalsQ: [0, 7, 14],
      notePt: 'Acorde microtonal 24-TET com terça neutra a +350¢: nem maior, nem menor. No modo Bend, execute a terça neutra com micro-bend de +50¢.',
      noteEn: '24-TET microtonal triad with a +350¢ neutral 3rd: neither major nor minor. In Bend mode, lift the neutral 3rd by +50¢.'
    },
    {
      id: 'bayati_neutral_dyad',
      family: 'microtonal',
      namePt: 'Tríade Suspensa Bayati (1–2½♭–4–5)',
      nameEn: 'Bayati Neutral Sus (1–2½♭–4–5)',
      symbol: 'Bayati(½♭)',
      intervalsQ: [0, 3, 10, 14],
      notePt: 'Combina o grau neutro característico do Maqam Bayati (+150¢) com a moldura aberta de 4ª e 5ª justa.',
      noteEn: 'Combines Maqam Bayati’s signature neutral 2nd (+150¢) with an open 4th/5th frame.'
    },
    {
      id: 'hijaz_drone_chord',
      family: 'microtonal',
      namePt: 'Acorde Drone Hijaz (1–♭2–3–5)',
      nameEn: 'Hijaz Drone Chord (1–♭2–3–5)',
      symbol: 'Hijaz',
      intervalsQ: [0, 2, 8, 14],
      notePt: 'Captura o choque dramático do Jins Hijaz (♭2 contra 3ª maior sobre o bordão de 5ª). Funciona em 12-TET puro.',
      noteEn: 'Captures Jins Hijaz’s dramatic rub (♭2 against major 3rd over a 5th drone). Pure 12-TET playable.'
    },
    {
      id: 'min_maj7_9',
      family: 'jazz',
      namePt: 'Menor com 7ª Maior e ♯11 (Nawa Athar)',
      nameEn: 'Min(maj7)♯11 (Nawa Athar)',
      symbol: 'm(M7)♯11',
      intervalsQ: [0, 6, 12, 22],
      notePt: 'Extração harmônica direta de Maqam Nawa Athar: terça menor, trítono e sétima maior em um voicing denso e cinematográfico.',
      noteEn: 'Harmonic distillation of Maqam Nawa Athar: minor 3rd, tritone, and major 7th in a dark cinematic voicing.'
    },
    {
      id: 'maj7_b5',
      family: 'jazz',
      namePt: 'Tétrade 7M(♭5) / Drop 2',
      nameEn: 'Maj7(♭5) / Drop 2 Color',
      symbol: 'maj7♭5',
      intervalsQ: [0, 8, 12, 22],
      notePt: 'Voicing aéreo sem 5ª justa — ressoa diretamente em Lídio, Raga Marwa e Messiaen Modo 6.',
      noteEn: 'Airy fifth-less voicing resonating naturally across Lydian, Raga Marwa, and Messiaen Mode 6.'
    }
  ],

  /**
   * Phase 2 Universal Rhythm Library: Arabic Iqa'at (from Oud Visualizer) + Aksak / Odd Meters
   * Step symbols: 'D' = Dum (low resonant), 'T' = Tak (crisp high), 'K' = Ka (soft ghost), '-' = Rest
   */
  rhythms: [
    {
      id: 'iqa_maqsum',
      family: 'iqa',
      namePt: 'Maqsum (Iqa’ Árabe)',
      nameEn: 'Maqsum (Arabic Iqa’)',
      meter: '4/4',
      subdivision: 2, // eighth-note grid (8 steps)
      grouping: '2+2+2+2',
      steps: ['D', 'T', '-', 'T', 'D', '-', 'T', '-'],
      notePt: 'O ciclo mais ubíquo da música árabe moderna. Excelente base para groove modal e riffs sincopados.',
      noteEn: 'The backbone of modern Arabic music. Ideal groove anchor for modal phrasing and syncopated riffs.'
    },
    {
      id: 'iqa_samai_thaqil',
      family: 'iqa',
      namePt: 'Sama’i Thaqil (Iqa’ Clássico)',
      nameEn: 'Sama’i Thaqil (Classical Iqa’)',
      meter: '10/8',
      subdivision: 2,
      grouping: '3+2+2+3',
      steps: ['D', '-', '-', 'T', '-', 'D', 'D', 'T', '-', '-'],
      notePt: 'Clássico ciclo de 10 pulsos (3+2+2+3) das composições instrumentais Sama’i. O dobro de Dum nos tempos 6–7 cria uma propulsão única.',
      noteEn: 'Classical 10-beat cycle (3+2+2+3) of instrumental Sama’i forms. The double Dum on beats 6–7 creates unmistakable momentum.'
    },
    {
      id: 'iqa_jurjina',
      family: 'iqa',
      namePt: 'Jurjina (Iraquiano / Curdo)',
      nameEn: 'Jurjina (Iraqi / Kurdish)',
      meter: '10/16',
      subdivision: 4,
      grouping: '3+2+2+3',
      steps: ['D', '-', 'K', 'T', '-', 'D', '-', 'T', '-', 'K'],
      notePt: 'Ciclo vivo em 10/16 muito usado no Iraque e no repertório de Munir Bashir. Excelente para palhetada alternada assimétrica.',
      noteEn: 'Lively 10/16 cycle central to Iraqi tradition and Munir Bashir’s repertoire. Great for asymmetric alternate picking.'
    },
    {
      id: 'iqa_baladi',
      family: 'iqa',
      namePt: 'Masmudi Saghir / Baladi',
      nameEn: 'Masmudi Saghir / Baladi',
      meter: '4/4',
      subdivision: 2,
      grouping: '2+2+2+2',
      steps: ['D', 'D', '-', 'T', 'D', '-', 'T', 'K'],
      notePt: 'Abertura pesada com dois Dums seguidos — conecta perfeitamente com riffs graves em Drop D ou DADGAD.',
      noteEn: 'Heavy double-Dum opening — locks right into low-register riffs in Drop D or DADGAD.'
    },
    {
      id: 'iqa_aqsak_9',
      family: 'iqa',
      namePt: 'Aqsaq (Otomano / Árabe)',
      nameEn: 'Aqsaq (Ottoman / Arabic)',
      meter: '9/8',
      subdivision: 2,
      grouping: '2+2+2+3',
      steps: ['D', '-', 'T', 'K', 'D', '-', 'T', '-', 'K'],
      notePt: 'Clássico 9/8 manco ("aksak") com grupo final alongado em 3 pulsos.',
      noteEn: 'Classic limping 9/8 ("aksak") with an elongated 3-pulse tail.'
    },
    {
      id: 'iqa_malfuf',
      family: 'iqa',
      namePt: 'Malfuf (2/4 Dinâmico)',
      nameEn: 'Malfuf (Driving 2/4)',
      meter: '2/4',
      subdivision: 4,
      grouping: '3+3+2',
      steps: ['D', '-', '-', 'T', '-', '-', 'T', '-'],
      notePt: 'Subdivisão 3+3+2 (mesma célula rítmica do baião/tresillo!), ligando diretamente o mundo árabe à rítmica brasileira.',
      noteEn: '3+3+2 subdivision (the exact tresillo/baião cell!), bridging Arabic cycles directly with Brazilian rhythm.'
    },
    {
      id: 'aksak_7_223',
      family: 'aksak',
      namePt: 'Aksak 7/8 (2+2+3 · Rachenitsa)',
      nameEn: 'Aksak 7/8 (2+2+3 · Rachenitsa)',
      meter: '7/8',
      subdivision: 2,
      grouping: '2+2+3',
      steps: ['D', '-', 'T', '-', 'D', 'K', 'T'],
      notePt: 'Groove balcânico acelerado com apoio estendido no último grupo de 3 colcheias.',
      noteEn: 'Driving Balkan groove with a stretched 3-eighth closing cell.'
    },
    {
      id: 'aksak_7_322',
      family: 'aksak',
      namePt: 'Aksak 7/8 (3+2+2 · Kalamatianos)',
      nameEn: 'Aksak 7/8 (3+2+2 · Kalamatianos)',
      meter: '7/8',
      subdivision: 2,
      grouping: '3+2+2',
      steps: ['D', '-', 'K', 'T', '-', 'T', 'K'],
      notePt: 'Acentuação frontal longa (3+2+2) — excelente para sobrepor uma polimetria de 4 na Trilha B.',
      noteEn: 'Front-loaded long pulse (3+2+2) — prime material for overlaying a 4-pulse polymeter on Track B.'
    },
    {
      id: 'odd_5_4',
      family: 'aksak',
      namePt: 'Assimétrico 5/4 (3+2)',
      nameEn: 'Asymmetric 5/4 (3+2)',
      meter: '5/4',
      subdivision: 2,
      grouping: '3+2 (10 steps)',
      steps: ['D', '-', 'K', 'T', '-', 'K', 'D', '-', 'T', '-'],
      notePt: 'Grade de 10 colcheias articulada em 3+2. Combine com Trilha B em 4 ou 3 para modulação métrica.',
      noteEn: '10-eighth grid articulated as 3+2. Combine with Track B in 4 or 3 for metric modulation studies.'
    },
    {
      id: 'aksak_11_8',
      family: 'aksak',
      namePt: 'Kopanitsa 11/8 (2+2+3+2+2)',
      nameEn: 'Kopanitsa 11/8 (2+2+3+2+2)',
      meter: '11/8',
      subdivision: 2,
      grouping: '2+2+3+2+2',
      steps: ['D', '-', 'T', '-', 'D', '-', 'K', 'T', '-', 'T', 'K'],
      notePt: 'Pilar assimétrico de 11 pulsos muito explorado no jazz contemporâneo (Tigran Hamasyan) e no prog.',
      noteEn: '11-pulse asymmetric cornerstone beloved in contemporary jazz (Tigran Hamasyan) and progressive music.'
    },
    {
      id: 'odd_13_16',
      family: 'aksak',
      namePt: 'Ciclo 13/16 (3+3+3+2+2)',
      nameEn: '13/16 Cycle (3+3+3+2+2)',
      meter: '13/16',
      subdivision: 4,
      grouping: '3+3+3+2+2',
      steps: ['D', '-', 'K', 'T', '-', 'K', 'D', '-', 'K', 'T', '-', 'T', '-'],
      notePt: 'Ciclo primo de 13 semicolcheias — ideal para riffs polimétricos (ative Trilha B = 4 para ouvir o deslocamento contínuo estilo Meshuggah).',
      noteEn: 'Prime 13-sixteenth cycle — ideal for polymetric riffs (enable Track B = 4 to feel continuous phase displacement).'
    }
  ],

  tunings: [
    {
      id: 'standard',
      namePt: 'Standard (E A D G B E)',
      nameEn: 'Standard (E A D G B E)',
      short: 'EADGBE',
      stringsQ: [80, 90, 100, 110, 118, 128]
    },
    {
      id: 'drop_d',
      namePt: 'Drop D (D A D G B E)',
      nameEn: 'Drop D (D A D G B E)',
      short: 'DADGBE',
      stringsQ: [76, 90, 100, 110, 118, 128]
    },
    {
      id: 'dadgad',
      namePt: 'DADGAD (Modal / Celta / Árabe)',
      nameEn: 'DADGAD (Modal / Celtic / Arabic)',
      short: 'DADGAD',
      stringsQ: [76, 90, 100, 110, 114, 124]
    },
    {
      id: 'all_fourths',
      namePt: 'All Fourths (E A D G C F)',
      nameEn: 'All Fourths (E A D G C F)',
      short: 'EADGCF',
      stringsQ: [80, 90, 100, 110, 120, 130]
    },
    {
      id: 'fripp_nst',
      namePt: 'New Standard / Quintas (C G D A E G)',
      nameEn: 'New Standard / Fifths (C G D A E G)',
      short: 'CGDAEG',
      stringsQ: [72, 86, 100, 114, 128, 134]
    },
    {
      id: 'major_thirds',
      namePt: 'Terças Maiores (C E G♯ C E G♯)',
      nameEn: 'Major Thirds (C E G♯ C E G♯)',
      short: 'CEG♯CEG♯',
      stringsQ: [72, 80, 88, 96, 104, 112]
    },
    {
      id: 'orkney',
      namePt: 'Orkney Drone (C G D G C D)',
      nameEn: 'Orkney Drone (C G D G C D)',
      short: 'CGDGCD',
      stringsQ: [72, 86, 100, 110, 120, 124]
    },
    {
      id: 'open_lydian',
      namePt: 'Open Lydian (F A C G C E)',
      nameEn: 'Open Lydian (F A C G C E)',
      short: 'FACGCE',
      stringsQ: [82, 90, 96, 110, 120, 128]
    },
    {
      id: 'sonic_unison',
      namePt: 'Drone Uníssono (F♯ F♯ F♯ F♯ E B)',
      nameEn: 'Unison Drone (F♯ F♯ F♯ F♯ E B)',
      short: 'F♯⁴-E-B',
      stringsQ: [84, 84, 108, 108, 128, 142]
    }
  ],

  obliqueStrategies: [
    {
      id: 'exp_bayati_dadgad',
      titlePt: 'Taqsim Elétrico em DADGAD',
      titleEn: 'Electric Taqsim in DADGAD',
      promptPt: 'Toque em Ré Bayati usando a 6ª e a 4ª cordas soltas como bordão contínuo. Construa frases lentas exclusivamente nas cordas 1 e 2, afinando o E½♭ por micro-bend (+50¢).',
      promptEn: 'Play D Bayati using open strings 6 and 4 as a continuous drone. Craft slow phrases strictly on strings 1 and 2, intoning E½♭ via +50¢ micro-bend.',
      constraintPt: 'Restrição: toque no máximo 4 notas por respiração e ative a Tríade Suspensa Bayati como mapa de repouso.',
      constraintEn: 'Constraint: play at most 4 notes per breath and toggle the Bayati Neutral Sus chord as your resting map.',
      preset: { scaleId: 'maqam_bayati', rootQ: 4, tuningId: 'dadgad', microMode: 'bend', droneOn: true, harmonicsOn: false, chordId: 'bayati_neutral_dyad', rhythmId: 'iqa_samai_thaqil' }
    },
    {
      id: 'exp_nikriz_samai',
      titlePt: 'Nikriz em Sama’i Thaqil (10/8)',
      titleEn: 'Nikriz in Sama’i Thaqil (10/8)',
      promptPt: 'Ative o ciclo 10/8 (3+2+2+3) em Maqam Nikriz sobre Dó. Construa um riff modal que enfatize o salto ♭3→♯4 nos dois Dums consecutivos dos tempos 6 e 7.',
      promptEn: 'Start the 10/8 cycle (3+2+2+3) in C Maqam Nikriz. Craft a modal riff emphasizing the ♭3→♯4 leap right on the double Dum of beats 6 and 7.',
      constraintPt: 'Restrição: ligue a Trilha B polimétrica em 4 para criar tensão cruzada sobre o 10/8.',
      constraintEn: 'Constraint: engage Polymeter Track B in 4 to generate cross-accent tension over 10/8.',
      preset: { scaleId: 'maqam_nikriz', rootQ: 0, tuningId: 'drop_d', microMode: 'bend', droneOn: false, harmonicsOn: false, chordId: 'quartal_3', rhythmId: 'iqa_samai_thaqil' }
    },
    {
      id: 'exp_messiaen_m3',
      titlePt: 'Geometria Sem Gravidade',
      titleEn: 'Zero-Gravity Geometry',
      promptPt: 'Explore o Modo 3 de Messiaen em afinação de Terças Maiores. Desenhe uma célula de 3 notas em uma região e replique-a na mesma casa em cordas diferentes — o padrão é invariante.',
      promptEn: 'Explore Messiaen Mode 3 in Major Thirds tuning. Pick a 3-note cell and mirror it on the exact same frets across strings — the geometry stays invariant.',
      constraintPt: 'Restrição: nenhum acorde pode conter 5ª justa.',
      constraintEn: 'Constraint: no chord voicing may contain a perfect 5th.',
      preset: { scaleId: 'messiaen_mode3', rootQ: 0, tuningId: 'major_thirds', microMode: 'bend', droneOn: false, harmonicsOn: false, chordId: 'maj7_b5', rhythmId: 'odd_5_4' }
    },
    {
      id: 'exp_saba_slide',
      titlePt: 'Lamento Microtonal em Slide',
      titleEn: 'Microtonal Slide Lament',
      promptPt: 'Mude para o modo Slide/Fretless em Ré Saba. Use volume swells ou ataque suave com os dedos deslizando lentamente entre o 2º grau neutro e a 4ª diminuta.',
      promptEn: 'Switch to Slide/Fretless mode in D Saba. Use volume swells or soft finger attacks gliding slowly between the neutral 2nd and diminished 4th.',
      constraintPt: 'Restrição: permaneça apenas na corda G (3ª) durante toda a exploração.',
      constraintEn: 'Constraint: stay strictly on the 3rd string for the entire exploration.',
      preset: { scaleId: 'maqam_saba', rootQ: 4, tuningId: 'drop_d', microMode: 'slide', droneOn: true, harmonicsOn: false, chordId: 'bayati_neutral_dyad', rhythmId: 'iqa_aqsak_9' }
    },
    {
      id: 'exp_viennese_fourths',
      titlePt: 'Pontilhismo Vienense [0,1,6]',
      titleEn: 'Viennese Pointillism [0,1,6]',
      promptPt: 'Em All Fourths (EADGCF), distribua as 3 notas do tricorde [0,1,6] por três oitavas diferentes usando os voicings calculados no Laboratório Harmônico.',
      promptEn: 'In All Fourths (EADGCF), scatter the 3 pitches of [0,1,6] across three octaves using the calculated voicings in the Harmony Lab.',
      constraintPt: 'Restrição: alterne cada acorde de 3 notas com um harmônico natural isolado em 11/8.',
      constraintEn: 'Constraint: alternate every 3-note chord with an isolated natural harmonic over 11/8.',
      preset: { scaleId: 'set_viennese_016', rootQ: 8, tuningId: 'all_fourths', microMode: 'bend', droneOn: false, harmonicsOn: true, chordId: 'viennese_chord', rhythmId: 'aksak_11_8' }
    },
    {
      id: 'exp_armorial_harmonics',
      titlePt: 'Série Harmônica & Sertão Espectral',
      titleEn: 'Spectral Overtone Sertão',
      promptPt: 'Em Orkney (CGDGCD) sobre Dó Lídio ♭7, misture os harmônicos naturais de 5º e 7º parciais com a melodia na 1ª corda sobre o ciclo Malfuf (3+3+2).',
      promptEn: 'In Orkney (CGDGCD) over C Lydian ♭7, weave 5th- and 7th-partial natural harmonics into a 1st-string melody above the Malfuf (3+3+2) pulse.',
      constraintPt: 'Restrição: use apenas a mão esquerda (hammer-on/pull-off) nos trechos graves.',
      constraintEn: 'Constraint: use left-hand legato only on low-register notes.',
      preset: { scaleId: 'br_armorial_lydian_b7', rootQ: 0, tuningId: 'orkney', microMode: 'bend', droneOn: true, harmonicsOn: true, chordId: 'quintal_3', rhythmId: 'iqa_malfuf' }
    },
    {
      id: 'exp_gamelan_13_16',
      titlePt: 'Kotekan Microtonal em 13/16',
      titleEn: 'Microtonal Kotekan in 13/16',
      promptPt: 'Ative Gamelan Pelog em Trastes 24-TET com o ciclo 13/16. Grave uma célula de 6 notas no Gravador de Tablatura clicando no braço e reproduza sobre o pulso.',
      promptEn: 'Load Gamelan Pelog in 24-TET Frets with the 13/16 cycle. Record a 6-note cell in the Tab Scratchpad by clicking the neck and audition it against the pulse.',
      constraintPt: 'Restrição: evite qualquer intervalo de 3ª maior ou menor consecutiva.',
      constraintEn: 'Constraint: avoid any consecutive major or minor 3rd leaps.',
      preset: { scaleId: 'gamelan_pelog_24', rootQ: 0, tuningId: 'fripp_nst', microMode: 'frets24', droneOn: false, harmonicsOn: false, chordId: 'rast_neutral_triad', rhythmId: 'odd_13_16' }
    },
    {
      id: 'exp_marwa_unison',
      titlePt: 'Muro de Som em Raga Marwa',
      titleEn: 'Wall of Sound in Raga Marwa',
      promptPt: 'Ative a afinação Drone Uníssono (F♯⁴-E-B) em F♯ Marwa. Deixe as quatro cordas graves vibrarem em leve batimento enquanto traça melodias sem 5ª justa nas duas agudas.',
      promptEn: 'Load Unison Drone (F♯⁴-E-B) in F♯ Marwa. Let the four low unison strings shimmer while tracing fifth-less melodies on the top two strings.',
      constraintPt: 'Restrição: termine todas as frases na ♭2 ou na 6ª maior antes da resolução final.',
      constraintEn: 'Constraint: end every phrase on ♭2 or major 6th before the final resolution.',
      preset: { scaleId: 'raga_marwa', rootQ: 12, tuningId: 'sonic_unison', microMode: 'bend', droneOn: true, harmonicsOn: false, chordId: 'maj7_b5', rhythmId: 'aksak_7_322' }
    }
  ]
};
