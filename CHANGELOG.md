# Changelog — String Atlas (Modal Guitar Lab)

Todas as entregas estruturais do projeto, da fundação 24-TET ao lançamento PWA de produção (`v8.4.0`).

## [8.4.0] — 2026-11-23
### Adicionado
- **Glossário Técnico & Teórico Interativo (`js/core/glossary.js`, `js/views/glossaryView.js`):** 39 termos bilíngues (PT/EN) em 5 categorias com busca instantânea, dicas práticas na guitarra, demonstrações em áudio Web Audio (`100¢` vs `150¢`, `5/4` vs `12-TET`, `53-TET` vs `24-TET`, série harmônica) e atalhos diretos para escalas/módulos.
- **Currículo Progressivo Reestruturado em 4 Níveis (`js/core/studyGuide.js`, `js/core/studyDossiers.js`):** 9 capítulos e **40 lições + 40 dossiês PT/EN** partindo dos fundamentos (*E Standard / 12-TET*) até *Mestre & Fronteira Microtonal*, preservando 100% dos 32 IDs anteriores no `localStorage`.
- Banner **Próxima Lição Recomendada**, filtros por Nível/Capítulo/Status e chips clicáveis conectando cada lição ao Glossário.
- **Kit de Publicação:** workflow CI/CD `.github/workflows/deploy.yml`, `.nojekyll`, `.gitignore`, `LICENSE` (MIT), `manifest.json` isolado para subpaths do GitHub Pages e Manual do Usuário em PDF (`docs/manual_do_usuario.pdf`).

## [8.3.0] — Blindagem de Áudio Mobile & Line Mode Multicanal
- Guardião de sessão mobile (`js/audio/mobileAudioGuard.js`): desbloqueio silencioso no 1º toque (iOS/Android), gerenciamento de `navigator.audioSession` (`playback` ↔ `play-and-record`), neutralização de `MediaSession` na tela de bloqueio, recuperação pós-bloqueio e Screen Wake Lock automático.
- Limiter transparente (`-3 dBFS`) no barramento mestre (`synthEngine.js` e `rhythmEngine.js`) e proteção anti-burst para sequenciadores ao acordar.
- Seletor de canal da interface (`L+R` · `Ch 1` · `Ch 2`), cadeia progressiva de fallback em 3 níveis no `getUserMedia`, adaptação dinâmica para taxas Bluetooth HFP (16 kHz / 24 kHz) e botão **↻ Reativar Áudio**.

## [8.2.0] — Diagramação Mobile Proporcional & Braço Vertical Automático
- Orientação responsiva **`auto`** (`resize` + `orientationchange`): alterna automaticamente entre **Braço Vertical (`↕`, 0–12 casas)** em mobile retrato e **Horizontal (`↔`)** no desktop/paisagem.
- Remoção do botão persistente de Drone da barra fixa, grade simétrica de 4 compartimentos no Deck e no Estúdio (recolhidos por padrão) e barra inferior mobile de 4 ações (*Tocar · Escala · Estúdio · Opções*).

## [8.1.0] — Compartimentos Puros & Braço Vertical Nativo
- Cabeçalho minimalista com menu **`Opções`** recolhível (`headerMenuView.js`), eliminação da Control Matrix permanente e motor geométrico dual Horizontal/Vertical em `fretboardView.js`.

## [8.0.0] — Fronteira Microtonal Scala (`.scl`), 32 Lições & Mobile PWA
- Parser, editor ao vivo, exportador e 12 presets **Scala (`.scl`)** (`scalaEngine.js`, `scalaView.js`): Entonação Justa 5/7/11-limit, 53-TET Otomano (Rast, Uşşak, Hicaz), Bohlen-Pierce (`3/1` Tritava), Gamelan Pelog/Slendro reais, Mesotônico ¼-comma, 19-EDO e Wendy Carlos Alpha, com projeção direta `±¢` no braço.
- Expansão curricular para 8 capítulos / 32 lições e camada mobile dedicada (`styles/mobile.css`, `mobileNavView.js`).

## [7.8.0] — Braço Vivo, Paleta `⌘K`, Transporte Global & Pranchas PNG/SVG
- Vibração física da corda + *ripple* luminoso, ressonância de oitavas no *hover*, Zoom `0–12`/`0–22`, Modo Canhoto (`⇄`).
- Exportação editorial de pranchas em **PNG (2× Retina)** e **SVG** (`plateExporter.js`).
- **Command Palette (`⌘K` / `/`)**, **Mini-Dock Global de Áudio (`Esc` = Parar Tudo)** e **Modal de Atalhos (`?`)** (`commandPaletteView.js`).

## [7.4.0 – 7.7.0] — Compartimentos, Profundidade Tátil & Ornamentação Mística
- Organização em compartimentos modulares sob demanda e 6 camadas vetoriais exclusivas por tema (`themeGraphics.js`): medalhão vivo, filigranas de 4 cantos, coroa do palco, frisos de cabeçalho/rodapé, marchetaria no braço e geometria própria dos marcadores de nota.

## [7.3.0] — Calculadora Física de Tensão de Encordoamento
- Motor físico (`tensionEngine.js`, `tensionView.js`) para 6/7/8 cordas, escalas `24"` a `30"` + Multi-Scale (*Fanned Fret*), 4 materiais, 16 packs e solver inverso de calibres balanceados.

## [7.1.0 – 7.2.0] — Galeria de 7 Mundos Visuais & Braço de Luthieria
- 7 designs autorais com fontes dedicadas e braço SVG temático: *Layl · Astrolábio*, *Nahar · Códice*, *70s Analog · Console Valvulado*, *Doom Ritual · Catedral*, *Djent Poly · Lâmina CNC*, *Avant · Partitura Gráfica* e *Brasilidade · Curvas & Cordel*.

## [7.0.0] — Alcance Estendido (6/7/8 Cordas), MIDI 24-TET & MusicXML 4.0
- Expansão para **39 afinações** (6, 7 e 8 cordas até `E1 41,2 Hz`), exportação nativa **MIDI 24-TET (`.mid`)** com RPN ±2st + Pitch Bend `+50¢` e **MusicXML 4.0 (`.musicxml`)** (`exportEngine.js`), e ícones PWA PNG (`192`, `512`, `180`).

## [6.0.0] — Radar Modal 24-TET, Rack de Timbre FX & Treino Auditivo
- Relógio polar 24-TET com mutações paralelas e pivôs *Sayr* (`modulationRadar.js`), 4 timbres elétricos Web Audio (*Clean*, *Swell*, *Crunch*, *Fuzz*) + Delay/Tremolo, Treinador Auditivo 24-TET (`earTrainer.js`) e backup `.json`.

## [5.0.0] — Vamps Modais & Sayr, Janela Fechada, Afinador & Modo Zen
- 10 jornadas de Vamp/Sayr sincronizadas ao braço (`vampEngine.js`), Janela Móvel de Formas Fechadas, Afinador de Scordatura, Snapshots com URL compartilhável (`#sa=...`) e Modo Zen (`Z`).

## [4.0.0] — Line Mode (YIN 24-TET) & Guia de Estudos Progressivo
- Detector YIN em tempo real (`pitchDetector.js`) com medidor de precisão de micro-bend (`+50¢`) e validação de Etudes + primeiros 4 capítulos / 16 lições bilíngues.

## [3.1.0] — Atlas Expandido (74 Escalas & 26 Afinações incl. B/A Standard)
- Expansão do catálogo para 74 escalas em 7 domínios, 26 afinações com atalhos barítono (`B Std`, `A Std`, `Drop B/A`), busca instantânea e Atlas Visual.

## [1.0.0 – 3.0.0] — Fundação 24-TET, Harmonia Não-Tercial, Ritmo & Etudes
- Braço interativo 24-TET (3 modos microtonais + harmônicos espectrais), solver dinâmico de voicings não-terciais e Pitch-Class Sets, partitura 24-TET + tablatura, motor rítmico *Iqa’at*/Polimetria e 6 geradores procedurais de Etudes com exportação ASCII.
