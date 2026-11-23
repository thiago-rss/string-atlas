/**
 * String Atlas Unified Database (24-TET compatible with Oud Visualizer contracts)
 * All intervalsQ live in 0..23 quarter-tone space (1 semitone = 2q, 1 tone = 4q).
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
    // --- ARABIC MAQAMAT (24-TET) ---
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
        repertoire: 'John Coltrane — Giant Steps sketches · Eric Dolphy · Meshuggah (angular cells)'
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
        articulationPt: 'Construa 4 voicings distintos espalhando essas 4 notas por grupos de cordas adjacentes e explore a transição suave entre eles.',
        articulationEn: 'Build 4 distinct voicings across adjacent string sets and explore smooth voice-leading between inversions.',
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
   * Guitar Tunings: array of 6 quarter-tone absolute indices [String 6 (low) ... String 1 (high)]
   * Reference: C2=72, D2=76, E2=80, F2=82, F#2=84, G2=86, A2=90, B2=94,
   *            C3=96, D3=100, E3=104, F3=106, F#3=108, G3=110, G#3=112, A3=114, B3=118,
   *            C4=120, D4=124, E4=128, F4=130, G4=134
   */
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

  /**
   * Oblique Creative Lab Cards — electric guitar experimentation prompts with one-click presets
   */
  obliqueStrategies: [
    {
      id: 'exp_bayati_dadgad',
      titlePt: 'Taqsim Elétrico em DADGAD',
      titleEn: 'Electric Taqsim in DADGAD',
      promptPt: 'Toque em Ré Bayati usando a 6ª e a 4ª cordas soltas como bordão contínuo. Construa frases lentas exclusivamente nas cordas 1 e 2, afinando o E½♭ por micro-bend (+50¢).',
      promptEn: 'Play D Bayati using open strings 6 and 4 as a continuous drone. Craft slow phrases strictly on strings 1 and 2, intoning E½♭ via +50¢ micro-bend.',
      constraintPt: 'Restrição: toque no máximo 4 notas por respiração e evite tocar o 4º grau nos primeiros 30 segundos.',
      constraintEn: 'Constraint: play at most 4 notes per breath and withhold the 4th degree for the first 30 seconds.',
      preset: { scaleId: 'maqam_bayati', rootQ: 4, tuningId: 'dadgad', microMode: 'bend', droneOn: true, harmonicsOn: false }
    },
    {
      id: 'exp_messiaen_m3',
      titlePt: 'Geometria Sem Gravidade',
      titleEn: 'Zero-Gravity Geometry',
      promptPt: 'Explore o Modo 3 de Messiaen em afinação de Terças Maiores. Desenhe uma célula de 3 notas em uma região e replique-a na mesma casa em cordas diferentes — o padrão é invariante.',
      promptEn: 'Explore Messiaen Mode 3 in Major Thirds tuning. Pick a 3-note cell and mirror it on the exact same frets across strings — the geometry stays invariant.',
      constraintPt: 'Restrição: nenhum acorde pode conter 5ª justa.',
      constraintEn: 'Constraint: no chord voicing may contain a perfect 5th.',
      preset: { scaleId: 'messiaen_mode3', rootQ: 0, tuningId: 'major_thirds', microMode: 'bend', droneOn: false, harmonicsOn: false }
    },
    {
      id: 'exp_saba_slide',
      titlePt: 'Lamento Microtonal em Slide',
      titleEn: 'Microtonal Slide Lament',
      promptPt: 'Mude para o modo Slide/Fretless em Ré Saba. Use volume swells ou ataque suave com os dedos deslizando lentamente entre o 2º grau neutro e a 4ª diminuta.',
      promptEn: 'Switch to Slide/Fretless mode in D Saba. Use volume swells or soft finger attacks gliding slowly between the neutral 2nd and diminished 4th.',
      constraintPt: 'Restrição: permaneça apenas na corda G (3ª) durante toda a exploração.',
      constraintEn: 'Constraint: stay strictly on the 3rd string for the entire exploration.',
      preset: { scaleId: 'maqam_saba', rootQ: 4, tuningId: 'drop_d', microMode: 'slide', droneOn: true, harmonicsOn: false }
    },
    {
      id: 'exp_viennese_fourths',
      titlePt: 'Pontilhismo Vienense [0,1,6]',
      titleEn: 'Viennese Pointillism [0,1,6]',
      promptPt: 'Em All Fourths (EADGCF), distribua as 3 notas do tricorde [0,1,6] por três oitavas diferentes usando saltos de corda e dinâmicas contrastantes (pp vs ff).',
      promptEn: 'In All Fourths (EADGCF), scatter the 3 pitches of [0,1,6] across three octaves using string skipping and stark dynamic contrasts (pp vs ff).',
      constraintPt: 'Restrição: alterne cada acorde de 3 notas com um harmônico natural isolado.',
      constraintEn: 'Constraint: alternate every 3-note chord with a single natural harmonic.',
      preset: { scaleId: 'set_viennese_016', rootQ: 8, tuningId: 'all_fourths', microMode: 'bend', droneOn: false, harmonicsOn: true }
    },
    {
      id: 'exp_armorial_harmonics',
      titlePt: 'Série Harmônica & Sertão Espectral',
      titleEn: 'Spectral Overtone Sertão',
      promptPt: 'Em Orkney (CGDGCD) sobre Dó Lídio ♭7, misture os harmônicos naturais de 5º e 7º parciais com a melodia na 1ª corda e o bordão grave em Dó.',
      promptEn: 'In Orkney (CGDGCD) over C Lydian ♭7, weave 5th- and 7th-partial natural harmonics into a 1st-string melody above the low C drone.',
      constraintPt: 'Restrição: use apenas a mão esquerda (hammer-on/pull-off) nos trechos graves.',
      constraintEn: 'Constraint: use left-hand legato only on low-register notes.',
      preset: { scaleId: 'br_armorial_lydian_b7', rootQ: 0, tuningId: 'orkney', microMode: 'bend', droneOn: true, harmonicsOn: true }
    },
    {
      id: 'exp_marwa_unison',
      titlePt: 'Muro de Som em Raga Marwa',
      titleEn: 'Wall of Sound in Raga Marwa',
      promptPt: 'Ative a afinação Drone Uníssono (F♯⁴-E-B) em F♯ Marwa. Deixe as quatro cordas graves vibrarem em leve batimento enquanto traça melodias sem 5ª justa nas duas agudas.',
      promptEn: 'Load Unison Drone (F♯⁴-E-B) in F♯ Marwa. Let the four low unison strings shimmer while tracing fifth-less melodies on the top two strings.',
      constraintPt: 'Restrição: termine todas as frases na ♭2 ou na 6ª maior antes da resolução final.',
      constraintEn: 'Constraint: end every phrase on ♭2 or major 6th before the final resolution.',
      preset: { scaleId: 'raga_marwa', rootQ: 12, tuningId: 'sonic_unison', microMode: 'bend', droneOn: true, harmonicsOn: false }
    },
    {
      id: 'exp_rast_frets24',
      titlePt: 'Cartografia 24-TET em Maqam Rast',
      titleEn: '24-TET Cartography in Maqam Rast',
      promptPt: 'Ative os Trastes 24-TET em Dó Rast. Observe a simetria visual das terças e sétimas neutras e pratique saltar diretamente entre a tônica, 3½♭ e 5.',
      promptEn: 'Activate 24-TET Frets in C Rast. Observe the visual symmetry of neutral 3rds and 7ths and practice direct leaps between root, 3½♭, and 5.',
      constraintPt: 'Restrição: toque o padrão em grupos assimétricos de 5 ou 7 notas.',
      constraintEn: 'Constraint: group your melodic contours into asymmetrical 5- or 7-note phrases.',
      preset: { scaleId: 'maqam_rast', rootQ: 0, tuningId: 'fripp_nst', microMode: 'frets24', droneOn: true, harmonicsOn: false }
    },
    {
      id: 'exp_slonimsky_angular',
      titlePt: 'Linhas Angulares de Slonimsky',
      titleEn: 'Angular Slonimsky Lines',
      promptPt: 'Aplique o padrão simétrico de trítono em Standard. Construa um ostinato de 6 notas cruzando 4 cordas e transponha tudo 6 casas acima sem mudar a digitação.',
      promptEn: 'Apply the tritone symmetrical pattern in Standard tuning. Build a 6-note ostinato across 4 strings and shift it 6 frets up verbatim.',
      constraintPt: 'Restrição: acentue sempre o trítono (♯4) com ataque mais forte ou palhetada híbrida.',
      constraintEn: 'Constraint: accent every tritone (♯4) with a sharper attack or hybrid snap.',
      preset: { scaleId: 'slonimsky_tritone_interp', rootQ: 8, tuningId: 'standard', microMode: 'bend', droneOn: false, harmonicsOn: false }
    }
  ]
};
