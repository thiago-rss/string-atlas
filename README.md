# String Atlas — Modal Guitar Lab (`v7.8.0`)

Laboratório PWA offline-first de experimentação modal, microtonal (**24-TET**), estendida (**6, 7 e 8 cordas**), luthieria, harmonia, ritmo e escuta para guitarra elétrica — **zero dependências externas** (Vanilla JS ES Modules, HTML5, CSS3 e Web Audio API).

## Destaques da Plataforma

- **Braço Vivo de Luthieria (6, 7 e 8 Cordas):** vibração física da corda + *ripple* luminoso ao tocar, destaque de oitavas no *hover*, **Zoom `0–12` / `0–22` casas**, **Modo Canhoto (`⇄`)**, janela móvel de formas fechadas, 3 modos microtonais (*Bend +50¢*, *Slide/Fretless*, *Trastes 24-TET*) e **Harmônicos Espectrais** (2º–7º parciais).
- **7 Mundos Visuais Esculturais (`T`):** *Layl · Astrolábio*, *Nahar · Códice*, *70s Analog · Console Valvulado*, *Doom Ritual · Catedral*, *Djent Poly · Lâmina CNC*, *Avant · Partitura Gráfica* e *Brasilidade · Curvas & Cordel* — cada um com fontes próprias, filigranas de 4 cantos, medalhão de marca e geometria própria dos nós e inlays no braço.
- **Exportação Completa:** **Pranchas Didáticas em PNG (2× Retina) & SVG**, **MIDI 24-TET (`.mid` com Pitch Bend +50¢ e canais MPE nos Vamps)**, **MusicXML 4.0 (`.musicxml` com tablatura 6/7/8 cordas)** e **Tablatura ASCII (`.txt`)**.
- **Navegação de Estúdio & Compartimentos:** **Command Palette (`⌘K` / `/`)**, **Mini-Dock Flutuante de Áudio Global (`Esc` = Parar Tudo)**, **Modal de Atalhos (`?`)**, **Modo Zen (`Z`) com mini-HUD de Vamp e Micro-Bend**, Snapshots com URL `#sa=...` e backup `.json`.
- **Atlas & Laboratórios Integrados:** **74 escalas/modos** em 7 domínios, **39 afinações** (incl. **B Standard**, **A Standard**, 7c e 8c), **Calculadora Física de Tensão de Cordas** (Multi-Scale + Solver de Calibres), **Radar Modal 24-TET**, **Vamps & Sayr**, **Etudes Procedurais**, **Iqa’at & Polimetria**, **Treino Auditivo 24-TET**, **Line Mode (YIN 34–1480 Hz)** e **Guia de Estudos (16 lições PT/EN)**.

## Execução Local & Validação

    node scripts/check.mjs
    python3 -m http.server 8080

Acesse `http://localhost:8080`.
