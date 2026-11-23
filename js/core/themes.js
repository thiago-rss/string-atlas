/**
 * String Atlas Multi-Design Studio Theme Catalog (v7.1)
 */

export const THEMES = [
  {
    "id": "layl",
    "namePt": "Layl · Obsidian",
    "nameEn": "Layl · Obsidian",
    "eraPt": "Estúdio Dark",
    "eraEn": "Dark Studio",
    "descPt": "Visual noturno de referência: grafite profundo, ouro âmbar e turquesa de estúdio.",
    "descEn": "Reference nocturnal studio look: deep graphite, warm amber gold, and crisp studio teal.",
    "themeColor": "#0c0f15",
    "fretboardHex": "#161412",
    "swatches": [
      "#0c0f15",
      "#141923",
      "#e5a955",
      "#4cc9b0",
      "#f08c4b"
    ]
  },
  {
    "id": "nahar",
    "namePt": "Nahar · Pergaminho",
    "nameEn": "Nahar · Parchment",
    "eraPt": "Estúdio Light",
    "eraEn": "Light Studio",
    "descPt": "Papel marfim quente e leitura limpa para sessões diurnas e impressão de partituras.",
    "descEn": "Warm ivory parchment and crisp daytime legibility for long study sessions.",
    "themeColor": "#f3efe6",
    "fretboardHex": "#231d18",
    "swatches": [
      "#f3efe6",
      "#fbf9f4",
      "#c47d1e",
      "#1d8a75",
      "#d9641e"
    ]
  },
  {
    "id": "rock70s",
    "namePt": "70s Analog · Valvulado",
    "nameEn": "70s Analog · Tube & Vinyl",
    "eraPt": "Rock Anos 70",
    "eraEn": "70s Rock",
    "descPt": "Amplificadores valvulados, tela de caixa tecida, nogueira quente, laranja queimado e ouro mostarda.",
    "descEn": "Vintage tube amps, woven grille cloth, warm walnut wood, burnt tangerine, and mustard vinyl gold.",
    "themeColor": "#19120d",
    "fretboardHex": "#2b1a12",
    "swatches": [
      "#19120d",
      "#261b14",
      "#f0752c",
      "#6ab07c",
      "#e8b948"
    ]
  },
  {
    "id": "doom",
    "namePt": "Doom Ritual · Monólito",
    "nameEn": "Doom Ritual · Monolith",
    "eraPt": "Doom Metal",
    "eraEn": "Doom Metal",
    "descPt": "Obsidiana fumacenta, névoa violeta, carmesim ritualístico, bronze envelhecido e tipografia solene.",
    "descEn": "Smoked obsidian, velvet violet haze, ritual crimson, antique brass, and monolithic serif typography.",
    "themeColor": "#08070a",
    "fretboardHex": "#0c0a0e",
    "swatches": [
      "#08070a",
      "#120e18",
      "#d49a3a",
      "#b078ff",
      "#e03546"
    ]
  },
  {
    "id": "djent",
    "namePt": "Djent Poly · Carbono",
    "nameEn": "Djent Poly · CNC Grid",
    "eraPt": "Djent / Tech",
    "eraEn": "Djent / Tech",
    "descPt": "Chassi de fibra de carbono, grade técnica de precisão, ciano cirúrgico, menta ácido e cantos afiados.",
    "descEn": "Carbon-fiber chassis, precision technical blueprint grid, surgical cyan, acid mint, and razor edges.",
    "themeColor": "#06090e",
    "fretboardHex": "#0b0f16",
    "swatches": [
      "#06090e",
      "#0c121b",
      "#00e5ff",
      "#34f599",
      "#ff3b8d"
    ]
  },
  {
    "id": "experimental",
    "namePt": "Avant · Partitura Gráfica",
    "nameEn": "Avant · Graphic Score",
    "eraPt": "Experimental",
    "eraEn": "Experimental",
    "descPt": "Inspirado em Fluxus, John Cage e Bauhaus: papel de galeria pontilhado, bordas de tinta preta, vermelho vermelhão e azul Klein.",
    "descEn": "Inspired by Fluxus, John Cage, and Bauhaus: dot-grid gallery paper, stark ink borders, vermilion red, and Klein blue.",
    "themeColor": "#eeece6",
    "fretboardHex": "#1c1c1e",
    "swatches": [
      "#eeece6",
      "#faf9f5",
      "#dc3826",
      "#1e4fd6",
      "#d95f18"
    ]
  },
  {
    "id": "brazilian",
    "namePt": "Brasilidade · Tropicália",
    "nameEn": "Brasilidade · Tropicália",
    "eraPt": "Música Brasileira",
    "eraEn": "Brazilian Music",
    "descPt": "Encontro entre Movimento Armorial, Bahia e Tropicália: areia solar, terracota, dendê, esmeralda e braço em jacarandá.",
    "descEn": "Armorial woodcuts meet Bahia & Tropicália: sunlit sand, terracotta, dendê gold, tropical emerald, and jacarandá neck.",
    "themeColor": "#f6eee0",
    "fretboardHex": "#2b1812",
    "swatches": [
      "#f6eee0",
      "#fffaf0",
      "#d48914",
      "#0f7a5c",
      "#c84b26"
    ]
  }
];

export const VALID_THEME_IDS = new Set(THEMES.map((th) => th.id));

export function getThemeById(id) {
  return THEMES.find((th) => th.id === id) || THEMES[0];
}
