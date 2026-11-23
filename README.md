# String Atlas — Modal Guitar Lab

![Version](https://img.shields.io/badge/version-8.4.0-e5a955?style=flat-square)
![PWA](https://img.shields.io/badge/PWA-Offline--First-4cc9b0?style=flat-square)
![Tuning](https://img.shields.io/badge/tuning-24--TET%20%2B%20Scala%20.scl-f08c4b?style=flat-square)
![Strings](https://img.shields.io/badge/strings-6%20%7C%207%20%7C%208-89a9c7?style=flat-square)
![Zero Deps](https://img.shields.io/badge/dependencies-zero-52f29c?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-9aa7b8?style=flat-square)

**String Atlas** é um laboratório PWA (*Progressive Web App*) **offline-first** para guitarra elétrica dedicado à experimentação **modal, microtonal (24-TET & Scala `.scl`), harmônica não-tercial, polimétrica e de luthieria** — construído integralmente em **Vanilla JavaScript (ES Modules), HTML5, CSS3 e Web Audio API**, sem frameworks nem dependências externas.

> 📖 **Manual Completo em PDF:** consulte [`docs/manual_do_usuario.pdf`](./docs/manual_do_usuario.pdf) para o guia ilustrado de todos os compartimentos, modos microtonais, Line Mode multicanal, calculadora física de tensão e tabela de atalhos.

---

## Principais Recursos

| Pilar | O que inclui |
| :--- | :--- |
| **Braço Vivo de Luthieria (6, 7 e 8 Cordas)** | **Orientação Dual Automática** (*Horizontal* no desktop · *Vertical* no mobile retrato), vibração física da corda + *ripple*, ressonância de oitavas no *hover*, Zoom `0–12` / `0–22`, Modo Canhoto (`⇄`), Janela Móvel de Formas Fechadas (`4–6` casas), 3 modos microtonais (*Bend +50¢*, *Slide/Fretless*, *Trastes 24-TET*) e **Harmônicos Espectrais** (2º–7º parciais em Entonação Justa). |
| **Atlas Expandido & Fronteira Microtonal** | **74 escalas e modos** em 7 domínios (18 *Maqamat*, 7 Modos Gregos, Menor Harmônica/Melódica, Ragas, Japão/Gamelan, Armorial, todos os 7 Modos de Messiaen, Slonimsky e *Pitch-Class Sets*) + **39 afinações** (`E Std` → `B Std`, `A Std`, `7c`, `8c Drop E`, `All Fourths`, `DADGAD`, `CFADGC`) + **Laboratório Scala (`.scl`)** com 12 presets (*Just Intonation 5/7/11-limit*, *53-TET Otomano*, *Bohlen-Pierce 3/1*, *Gamelan real*) e projeção `±¢` no braço. |
| **7 Mundos Visuais Esculturais (`T`)** | *Layl · Astrolábio*, *Nahar · Códice*, *70s Analog · Console Valvulado*, *Doom Ritual · Catedral*, *Djent Poly · Lâmina CNC*, *Avant · Partitura Gráfica* e *Brasilidade · Curvas & Cordel* — cada um com tipografia própria, filigranas vetoriais, acabamento de madeira/carbono e geometria própria de marcadores no braço. |
| **Estúdio em Compartimentos Puros** | **Radar Modal 24-TET**, **Vamps & Sayr**, **Etudes Procedurais (6 geradores)**, **Harmonia Não-Tercial & Construtor de Pitch-Class Set**, **Motor Rítmico Universal (*Iqa’at* & Polimetria)**, **Treino Auditivo 24-TET**, **Calculadora Física de Tensão de Cordas** (Multi-Scale + Solver de Calibres) e **Dossiê / Lab Oblíquo**. |
| **Line Mode Multicanal & Áudio Mobile Blindado** | Detector **YIN (34–1480 Hz)** otimizado para interfaces de áudio (`L+R` · `Ch 1` · `Ch 2`) com medidor de micro-bend `+50¢`, afinador de scordatura e validação automática de Etudes; `mobileAudioGuard.js` com desbloqueio no 1º toque (iOS/Android), `audioSession`, limiter `-3 dBFS`, anti-burst e Wake Lock. |
| **Currículo Progressivo & Glossário** | **4 Níveis · 9 Capítulos · 40 Lições & 40 Dossiês PT/EN** (de fundamentos em *E Standard/12-TET* até *53-TET/Scala/Pós-Tonal*) integrados ao **Glossário Técnico Interativo (39 termos)** com exemplos sonoros Web Audio. |
| **Exportação Completa** | **Pranchas Didáticas PNG (2× Retina) & SVG**, **MIDI 24-TET (`.mid` com RPN ±2st + Pitch Bend `+50¢` e canais por voz)**, **MusicXML 4.0 (`.musicxml` com tablatura 6/7/8 cordas)**, **Scala `.scl`**, **Tablatura ASCII (`.txt`)**, **Snapshots `#sa=...`** e **Backup `.json`**. |

---

## Execução Local & Validação

Requer apenas **Node.js 18+** (para validação) e qualquer servidor HTTP estático (Python 3, `npx serve`, etc.):

```bash
# 1. Validar integridade, sintaxe, catálogo, DSP YIN, Scala, Tensão, Glossário e SW
node scripts/check.mjs

# 2. Subir servidor local (libera getUserMedia/Line Mode em localhost)
python3 -m http.server 8080
```

Abra `http://localhost:8080` no navegador.

---

## Publicação Automática no GitHub Pages (CI/CD)

Este repositório já inclui o workflow `.github/workflows/deploy.yml`:

1. Faça `push` para a branch `main` (ou `master`).
2. No GitHub, acesse **Settings → Pages → Build and deployment → Source** e selecione **GitHub Actions**.
3. A cada `push`, o GitHub executa automaticamente `node scripts/check.mjs` e, se todos os testes passarem, publica o bundle estático em HTTPS (`https://<usuario>.github.io/string-atlas/`).

### Instalação como Aplicativo (PWA Offline)
- **iOS (Safari):** abra a URL HTTPS → toque em **Compartilhar** → **Adicionar à Tela de Início**.
- **Android (Chrome/Edge):** toque no aviso de instalação ou abra **Opções → ⬇ Instalar App**.
- **macOS (Safari / Chrome):** *Arquivo → Adicionar ao Dock* (Safari) ou ícone de instalação na barra de endereços (Chrome).

---

## Atalhos de Teclado

| Tecla | Ação |
| :--- | :--- |
| `⌘K` / `Ctrl+K` / `/` | Abrir **Paleta de Comandos** (busca em escalas, afinações, designs, aulas e glossário) |
| `?` | Abrir guia rápido de atalhos |
| `Esc` | Fechar modal / **Parar Todo Áudio** (Panic) |
| `Espaço` | Tocar / Parar escala ativa (24-TET ou Scala Hz puros) |
| `M` | Iniciar / Parar **Vamp & Sayr** |
| `E` / `N` | Tocar / Parar **Etude Procedural** · Nova variação (*Seed*) |
| `D` / `R` / `L` | Alternar **Drone** · **Ritmo (Iqa’at)** · **Line Mode** |
| `V` / `H` | Alternar **Voicing no Braço** · **Harmônicos Espectrais** |
| `T` / `Z` | Alternar **Design Visual (7 Mundos)** · **Modo Zen** |

---

## Arquitetura do Repositório

```text
string-atlas/
├── .github/workflows/deploy.yml   # CI (check.mjs) + Deploy GitHub Pages
├── docs/manual_do_usuario.pdf     # Manual ilustrado do usuário (PDF)
├── index.html                     # Shell PWA minimalista em compartimentos
├── manifest.json                  # Manifesto PWA isolado para subpath
├── sw.js                          # Service Worker offline-first (53 assets)
├── assets/icons/                  # Ícones SVG + PNG (192, 512, Apple 180)
├── styles/                        # main.css, themes.css (7 mundos) & mobile.css
├── js/
│   ├── main.js                    # Bootstrap, compartimentos e watcher responsivo
│   ├── state/store.js             # Store reativo unidirecional + localStorage
│   ├── core/                      # Motores puros (24-TET, Scala, Voicing, Etude, Radar, Tensão, Export, Glossário, Guia)
│   ├── audio/                     # Web Audio (Synth/FX, Rhythm, YIN Pitch, MobileAudioGuard)
│   └── views/                     # Views desacopladas por compartimento
├── scripts/check.mjs              # Validador de integridade e testes unitários
├── CHANGELOG.md                   # Histórico de versões v1.0.0 → v8.4.0
└── LICENSE                        # Licença MIT
```

---

## Licença

Distribuído sob a licença **MIT**. Consulte o arquivo [`LICENSE`](./LICENSE) para detalhes.
