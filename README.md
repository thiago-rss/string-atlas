# String Atlas — Modal Guitar Lab (`v7.0.0`)

Laboratório PWA offline-first de experimentação modal, microtonal (**24-TET**), estendida (**6, 7 e 8 cordas**), harmônica, rítmica e auditiva para guitarra elétrica — com **zero dependências externas** (Vanilla JS ES Modules, HTML5, CSS3 e Web Audio API).

## Principais Módulos

- **Braço Interativo 24-TET para 6, 7 e 8 Cordas (22 casas):** 3 modos microtonais (*Bend +50¢*, *Slide/Fretless* e *Trastes 24-TET*), janela móvel de formas fechadas (`4–6` casas), destaque de cordas soltas na escala e camada de **Harmônicos Espectrais** (2º ao 7º parciais em Entonação Justa).
- **Atlas Expandido:** **74 escalas e modos** em 7 domínios e subfamílias + **39 afinações** (26 de 6 cordas incl. **B Standard** e **A Standard**, 7 de **7 cordas** e 6 de **8 cordas** incl. *F♯ Standard*, *Meshuggah F Standard*, *Drop E* e *All Fourths 8*).
- **Exportação DAW & Partitura (`v7.0`):**
  - **MIDI 24-TET (`.mid`, SMF Type 0):** codifica quartos de tom exatos via RPN ±2st + Pitch Bend `+50¢` (e canais independentes por voz nos Vamps para harmonia microtonal em DAWs);
  - **MusicXML 4.0 (`.musicxml`):** pauta dupla (notação 24-TET 8vb com `<alter>±0.5</alter>` + tablatura dinâmica de 6/7/8 cordas com `<bend>` e `<harmonic/>`) pronta para MuseScore, Guitar Pro e Dorico.
- **Radar Modal 24-TET, Rack de Timbre/FX & Treino Auditivo:** relógio polar de 24 alturas, mutações paralelas e pivôs *Sayr*, 4 timbres Web Audio (*Clean Studio*, *Ambient Swell*, *Warm Crunch*, *Doom Fuzz*) e treinamento perceptual de microtons/modos/acordes.
- **Line Mode Estendido (YIN 34–1480 Hz):** rastreia de `E1 (41,2 Hz)` e `A1 (55 Hz)` até o registro agudo, com medidor de precisão de micro-bend (`+50¢`), afinador de scordatura de 6/7/8 cordas e validação de Etudes.
- **Guia de Estudos, Modo Zen & PWA Pronto para Produção:** 4 capítulos (16 lições PT/EN), ícones PNG (`192×192`, `512×512`, Apple Touch `180×180`), Snapshots com URL `#sa=...` e backup `.json`.

## Execução Local & Validação

    node scripts/check.mjs
    python3 -m http.server 8080

Acesse `http://localhost:8080`.
