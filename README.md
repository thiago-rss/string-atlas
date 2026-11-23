# String Atlas — Modal Guitar Lab (`v8.4.0`)

Laboratório PWA offline-first (desktop e **mobile nativo com braço vertical automático**) de experimentação modal, microtonal (**24-TET + Scala `.scl` / 53-TET / Entonação Justa / Bohlen-Pierce**), estendida (**6, 7 e 8 cordas**), engenharia de tensão, harmonia não-tercial e polimetria para guitarra elétrica — **zero dependências externas**.

## Destaques da Plataforma (`v8.4.0`)

- **Currículo Progressivo em 4 Níveis (9 Capítulos · 40 Lições & 40 Dossiês PT/EN):** começa pelos fundamentos em *E Standard / 12-TET* (*Drone, Dórico/Frígio/Lídio, Formas Fechadas, Cents, Menor Harmônica, Kurd/Nahawand 12-TET, Quintais e 7/8*), evolui para *24-TET & Barítono B/A Standard*, *Harmonia Não-Tercial, Radar/Sayr e 7/8 Cordas*, e culmina em *Messiaen, Slonimsky, Allen Forte e Scala `.scl` / 53-TET / Entonação Justa*.
- **Glossário Técnico & Teórico Interativo (39 Termos PT/EN):** busca instantânea por conceito ou símbolo, dicas práticas na guitarra, demonstrações em áudio Web Audio (`100¢` vs `150¢`, `5/4` vs `12-TET`, `53-TET` vs `24-TET`, série harmônica) e links diretos a partir de cada lição do Guia de Estudos.
- **Blindagem de Áudio Mobile (iOS / Android / Bluetooth) & Line Mode Multicanal:** `mobileAudioGuard.js` (desbloqueio no 1º toque, `navigator.audioSession`, neutralização de MediaSession na tela de bloqueio, Wake Lock, Limiter `-3 dBFS`, anti-burst pós-bloqueio e seleção de canal `Ch 1 / Ch 2 / L+R`).
- **Compartimentos Puros & 7 Mundos Visuais Esculturais (`T`):** tela limpa com cabeçalho minimalista, trilhos simétricos de 4 compartimentos, braço vertical automático no celular e exportação de pranchas **PNG (2× Retina) / SVG**, **MIDI 24-TET** e **MusicXML 4.0**.

## Execução Local & Validação

    node scripts/check.mjs
    python3 -m http.server 8080

Acesse `http://localhost:8080`.
