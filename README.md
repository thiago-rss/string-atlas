# String Atlas — Modal Guitar Lab

[![Abrir App Online](https://img.shields.io/badge/%E2%96%B6_Abrir_App_Online-String_Atlas_PWA-e5a955?style=for-the-badge)](https://thiago-rss.github.io/string-atlas/)
[![Manual em PDF](https://img.shields.io/badge/Manual_do_Usu%C3%A1rio-PDF-4cc9b0?style=for-the-badge)](https://thiago-rss.github.io/string-atlas/docs/manual_do_usuario.pdf)

![Version](https://img.shields.io/badge/version-8.5.0-e5a955?style=flat-square)
![PWA](https://img.shields.io/badge/PWA-Offline--First-4cc9b0?style=flat-square)
![Tuning](https://img.shields.io/badge/tuning-24--TET%20%2B%20Scala%20.scl-f08c4b?style=flat-square)
![Strings](https://img.shields.io/badge/strings-6%20%7C%207%20%7C%208-89a9c7?style=flat-square)
![Zero Deps](https://img.shields.io/badge/dependencies-zero-52f29c?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-9aa7b8?style=flat-square)

**String Atlas** é um laboratório PWA (*Progressive Web App*) **offline-first** para guitarra elétrica dedicado à experimentação **modal, microtonal (24-TET & Scala `.scl`), harmônica não-tercial, polimétrica e de luthieria** — construído integralmente em **Vanilla JavaScript (ES Modules), HTML5, CSS3 e Web Audio API**, sem frameworks nem dependências externas.

> 🎸 **Usar o App Online:** [**https://thiago-rss.github.io/string-atlas/**](https://thiago-rss.github.io/string-atlas/)  
> Funciona direto no navegador (desktop e mobile com braço vertical automático) e pode ser instalado na tela inicial para uso 100% offline.
>
> 📖 **Manual Completo em PDF:** consulte [`docs/manual_do_usuario.pdf`](./docs/manual_do_usuario.pdf) ([abrir versão online](https://thiago-rss.github.io/string-atlas/docs/manual_do_usuario.pdf)) para o guia ilustrado de todos os compartimentos, modos microtonais, Line Mode multicanal, calculadora física de tensão e tabela de atalhos.

---

## Principais Recursos

| Pilar | O que inclui |
| :--- | :--- |
| **Braço Vivo de Luthieria (6, 7 e 8 Cordas)** | **Orientação Dual Automática** (*Horizontal* no desktop · *Vertical* no mobile retrato), vibração física da corda + *ripple*, ressonância de oitavas no *hover*, Zoom `0–12` / `0–22`, Modo Canhoto (`⇄`), Janela Móvel de Formas Fechadas (`4–6` casas), 3 modos microtonais (*Bend +50¢*, *Slide/Fretless*, *Trastes 24-TET*) e **Harmônicos Espectrais** (2º–7º parciais em Entonação Justa). |
| **Luthieria Avançada & Scordaturas Salvas** | **Calculadora Física de Tensão** com **Comparador A/B lado a lado** (gráfico de barras duplas, `Δ` por corda e **Diagnóstico de Tensor/Truss Rod**), escalas `24″–30″` & *Multi-Scale*, Solver de Calibres Balanceados e **Scordaturas Customizadas Salvas** (6/7/8 cordas em 12-TET ou 24-TET integradas ao seletor principal, `⌘K` e backups `.json`). |
| **Atlas Expandido & Fronteira Microtonal** | **74 escalas e modos** em 7 domínios (18 *Maqamat*, 7 Modos Gregos, Menor Harmônica/Melódica, Ragas, Japão/Gamelan, Armorial, todos os 7 Modos de Messiaen, Slonimsky e *Pitch-Class Sets*) + **39 afinações** (`E Std` → `B Std`, `A Std`, `7c`, `8c Drop E`, `All Fourths`, `DADGAD`, `CFADGC`) + **Laboratório Scala (`.scl`)** com 12 presets (*Just Intonation 5/7/11-limit*, *53-TET Otomano*, *Bohlen-Pierce 3/1*, *Gamelan real*) e projeção `±¢` no braço. |
| **7 Mundos Visuais Esculturais (`T`)** | *Layl · Astrolábio*, *Nahar · Códice*, *70s Analog · Console Valvulado*, *Doom Ritual · Catedral*, *Djent Poly · Lâmina CNC*, *Avant · Partitura Gráfica* e *Brasilidade · Curvas & Cordel* — cada um com tipografia própria, filigranas vetoriais, acabamento de madeira/carbono e geometria própria de marcadores no braço. |
| **Estúdio em Compartimentos Puros** | **Radar Modal 24-TET**, **Vamps & Sayr**, **Etudes Procedurais (6 geradores)**, **Harmonia Não-Tercial & Construtor de Pitch-Class Set**, **Motor Rítmico Universal (*Iqa’at* & Polimetria)**, **Treino Auditivo 24-TET** e **Dossiê / Lab Oblíquo**. |
| **Line Mode Multicanal & Áudio Mobile Blindado** | Detector **YIN (34–1480 Hz)** otimizado para interfaces de áudio (`L+R` · `Ch 1` · `Ch 2`) com medidor de micro-bend `+50¢`, afinador de scordatura e validação automática de Etudes; `mobileAudioGuard.js` com desbloqueio no 1º toque (iOS/Android), `audioSession`, limiter `-3 dBFS`, anti-burst e Wake Lock. |
| **Currículo Progressivo & Glossário** | **4 Níveis · 9 Capítulos · 40 Lições & 40 Dossiês PT/EN** (de fundamentos em *E Standard/12-TET* até *53-TET/Scala/Pós-Tonal*) integrados ao **Glossário Técnico Interativo (39 termos)** com exemplos sonoros Web Audio. |
| **Exportação Completa** | **Pranchas Didáticas PNG (2× Retina) & SVG**, **MIDI 24-TET (`.mid` com RPN ±2st + Pitch Bend `+50¢` e canais por voz)**, **MusicXML 4.0 (`.musicxml` com tablatura 6/7/8 cordas)**, **Scala `.scl`**, **Tablatura ASCII (`.txt`)**, **Snapshots `#sa=...`** e **Backup `.json`**. |

---

## Instalação como Aplicativo (PWA Offline)

Acesse [**https://thiago-rss.github.io/string-atlas/**](https://thiago-rss.github.io/string-atlas/) em qualquer dispositivo:

- **iOS (Safari):** abra o link → toque em **Compartilhar** → **Adicionar à Tela de Início**.
- **Android (Chrome/Edge):** toque no aviso de instalação ou abra **Opções → ⬇ Instalar App**.
- **macOS (Safari / Chrome):** *Arquivo → Adicionar ao Dock* (Safari) ou ícone de instalação na barra de endereços (Chrome).

---

## Execução Local & Validação

Requer apenas **Node.js 18+** (para validação) e qualquer servidor HTTP estático (Python 3, `npx serve`, etc.):

~~~bash
# 1. Validar integridade, sintaxe, catálogo, DSP YIN, Scala, Tensão A/B, Scordaturas, Glossário e SW
node scripts/check.mjs

# 2. Subir servidor local (libera getUserMedia/Line Mode em localhost)
python3 -m http.server 8080
~~~

Abra `http://localhost:8080` no navegador.

---

## Publicação Automática no GitHub Pages (CI/CD)

Este repositório utiliza o workflow `.github/workflows/deploy.yml`: a cada `push` na branch `main`, o GitHub Actions executa automaticamente `node scripts/check.mjs` e, se todos os testes passarem, publica o bundle estático atualizado em [**https://thiago-rss.github.io/string-atlas/**](https://thiago-rss.github.io/string-atlas/).

---

## Licença

Distribuído sob a licença **MIT**. Consulte o arquivo [`LICENSE`](./LICENSE) para detalhes.
