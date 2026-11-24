# Changelog — String Atlas (Modal Guitar Lab)

Todas as entregas estruturais do projeto, da fundação 24-TET ao lançamento PWA de produção (`v8.4.0`).

## [8.9.0] — 2026-11-23 · Tela Inicial Limpa & Hierarquia Visual do Braço
### Melhorado (a partir da rodada de testes com usuários)
- **Zero Menus Permanentes Acima do Braço (`index.html`, `deckPanelsView.js`, `main.js`):** a gaveta `#deckShell` agora inicia completamente recolhida (`hidden`), liberando o palco do instrumento logo ao abrir o app. O cabeçalho concentra apenas 4 ações claras (`▶ Ouvir`, `🎙 Afinar`, `⚙ Controles` e `Opções`), o nome da escala + pílula de afinação no topo do braço é clicável para trocar escala/afinação, e o estúdio inferior fica recolhido em uma barra discreta (`🧭 Ferramentas do Estúdio ▾`).
- **Seletor de Clareza do Braço em 4 Modos (`js/core/fretClarity.js`, `fretboardView.js`, `store.js`):** alternância direta no palco entre **`Livre`** (braço limpo para afinar, explorar ou acompanhar ao vivo), **`Posição`** *(novo padrão inicial: `0–12` destacando apenas a janela tocável `0–5` com pontos-fantasma mínimos fora da posição)*, **`0–12`** e **`0–22`**.
- **Hierarquia Gráfica em 3 Camadas + Escala Adaptativa (`fretboardView.js`):**
  - **Nível 1 (Tônica):** maior (`13px`), sólida com anel fino único (removidos os 4 pontos satélites que invadiam cordas vizinhas).
  - **Nível 2 (Grau Característico & Microtom):** médio (`10,9px`), sólido; no modo *Bend +50¢*, a caixa externa `↑¼` foi substituída por cápsula compacta com seta integrada (`▲`) sem invadir a corda de cima.
  - **Nível 3 (Demais Notas da Escala):** menores (`9,2px`), centro translúcido + anel nítido na cor da escala, fazendo tônicas e graus característicos saltarem aos olhos.
  - Espaçamento vertical ampliado entre cordas (`36px → 42px`), redução adaptativa automática nas casas agudas (`13–22`), legenda movida para uma micro-legenda contextual no rodapé do braço e `string-atlas-v8.9.0` (56 assets offline).

## [8.8.0] — 2026-11-23 · Refinamento Acústico & Polimento de UX
### Adicionado
- **Diapasão Global `A4` Configurável (`415–446 Hz` em `theory24.js`, `deckPanelsView.js`, `store.js`):** presets rápidos (`415`, `432`, `440`, `442 Hz`) e slider fino no compartimento `🔊 Áudio & FX`, recalculando em cascata síntese, Drone, Scala `.scl`, calculadora de tensão e afinador YIN com persistência em `localStorage`.
- **Timbre Físico *Karplus-Strong* (`Corda Física` em `synthEngine.js`):** síntese física por guia de onda com atraso fracionário *allpass* de 1ª ordem (precisão 24-TET/Scala), filtro pente de palheta, amortecimento adaptativo por frequência, ressonância de corpo e cache LRU de buffers.
- **Estabilizador Adaptativo de Graves (`PitchStabilizer`) & Modo Estroboscópico (`Estrobo`):** janela mediana adaptativa (7 quadros abaixo de `115 Hz`), suavização exponencial com *snap* instantâneo em saltos `> 70¢`, histerese de troca de nota e faixas ópticas estroboscópicas no HUD Vivo que travam paradas em verde dentro de `±4¢`.
- **Sistema Global de Notificações (*Toasts* em `toastView.js`):** feedback discreto e temático para salvar/excluir scordaturas, copiar links/relatórios, aplicar Setup B, alternar designs (`T`), exportar PNG/SVG, ajustar `A4`, silenciar áudio (`Esc`) e reativar áudio mobile.
- **Polimento de Contraste nos 10 Mundos & Manual `v8.8.0`:** `color-scheme` nativo para `<select>`/scrollbars, contraste reforçado nos 4 temas claros (*Nahar*, *Avant*, *Brasilidade*, *Kintsugi*), anéis `:focus-visible`, alívio de `backdrop-filter` do *Shoegaze* no Safari mobile e manual PDF atualizado em `docs/manual_do_usuario.pdf`.

## [8.7.0] — 2026-11-23 · Galeria Expandida: 10 Mundos Visuais Esculturais
### Adicionado
- **Shoegaze · Névoa & Offset (`shoegaze`):** atmosfera 4AD/anos 90 em índigo e ameixa com rosa-quartzo e azul-lunar, inlays de blocos perolados de guitarra *offset* (`offset_block`), marcadores com halo *bloom* (`bloom`), medalhão de fita magnética e cantoneiras de ondas de *reverb*.
- **Kintsugi · Cerâmica & Silêncio (`kintsugi`):** 3º tema diurno/claro (*wabi-sabi* japonês) em porcelana areia, tinta *sumi*, folha de ouro e selo *hanko* vermelhão, com braço em *roasted maple* + textura de veios dourados (`grainStyle: kintsugi`), inlays de fissura dourada (`kintsugi_vein`), marcadores selo *hanko* (`hanko`), medalhão *Ensō* e cantoneiras *Kumiko*.
- **Blue Note · Vinil & Latão (`bluenote`):** estética editorial de capas de jazz 1962 (*Reid Miles / Impulse!*) em preto vinil, azul-prússia, latão escovado e laranja-vermelhão com fonte *Oswald*, braço *archtop* em ébano com inlays `archtop_split_block`, marcadores `brass_ring`, medalhão de disco LP e sulcos de vinil no fundo.
- **CI/CD GitHub Pages:** workflow `.github/workflows/deploy.yml` consolidado em jobs separados `build` e `deploy`.

## [8.6.0] — 2026-11-23 · Microfone & Interface de Áudio (Modelo Oud Visualizer)
### Adicionado
- **Compartimento Dedicado `🎙 Mic / Interface` no Trilho Superior (`deckPanelsView.js`):** acesso direto logo acima do braço virtual (sem precisar abrir a zona de Estudo), com alternância `🎙 Microfone` vs. `🔌 Interface (Line Mode)`, seletor de dispositivo USB com atualização automática `devicechange`, seleção de canal (`L+R · Ch 1 · Ch 2`), sliders de Gain e Noise Gate e medidor VU em tempo real.
- **HUD Vivo no Palco do Braço (`#liveStageHud` em `lineModeView.js`):** aparece automaticamente logo acima do braço quando a escuta está ativa (oculto quando desligado), com nota 24-TET colorida por pertencimento à escala, agulha alternável (**Afinador `-50¢..+50¢`** ↔ **Micro-Bend `0..+50¢..+100¢`**), indicação instantânea *Aperte/Afrouxe/✔ Afinada* e faixa clicável de cravelhas de referência para 6, 7 e 8 cordas.
- **Acompanhamento Aprimorado no Braço Virtual (`fretboardView.js`):** marcação em tempo real (Horizontal e Vertical Mobile) com cores semânticas (Tônica dourada, Na Escala verde, Microtom âmbar, Fora da Escala coral), badge flutuante `Nota ±¢`, **Rastro de Notas (`Trail`)** das últimas 5 alturas tocadas e opção **Focar Janela Fechada**.
- **Barra Inferior Mobile (`mobileNavView.js`):** botão **`🎙 Mic/Line`** de 1 toque direto na barra do polegar (padrão *Oud Visualizer*).

## [8.5.0] — 2026-11-23 · Luthieria Avançada
### Adicionado
- **Comparador A/B na Calculadora de Tensão (`js/core/tensionEngine.js`, `js/views/tensionView.js`):** compara dois setups físicos lado a lado (ex.: `A Standard` em `25.5″` vs. `27.0″`, ou dois packs de calibres / Multi-Scale / afinações), com gráfico SVG de barras duplas, diferença corda a corda (`Δ B − A`), **Diagnóstico de Tensor (Truss Rod)**, `Clonar A → B`, `⇄ Trocar A ↔ B`, `Aplicar B no Ativo`, `✦ Balancear B` e `Copiar A/B`.
- **Scordaturas Salvas (`js/core/customTunings.js`, `js/views/deckPanelsView.js`, `js/views/commandPaletteView.js`, `js/views/snapshotsView.js`):** salve afinações customizadas do *Fine Retuner* ou da *Calculadora de Tensão* (6, 7 ou 8 cordas em 12-TET ou 24-TET) permanentemente no `localStorage`, acessíveis no seletor principal (`✦ Minhas Scordaturas Salvas`), atalhos rápidos, busca `⌘K` e backups `.json`.

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
