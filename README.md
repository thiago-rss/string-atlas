# String Atlas — Modal Guitar Lab (`v8.0.0`)

Laboratório PWA offline-first (desktop e **mobile nativo**) de experimentação modal, microtonal (**24-TET + Scala `.scl` / 53-TET / Entonação Justa / Bohlen-Pierce**), estendida (**6, 7 e 8 cordas**), engenharia de tensão, harmonia não-tercial e polimetria para guitarra elétrica — **zero dependências externas**.

## Destaques da Plataforma (`v8.0.0`)

- **Fronteira Microtonal — Scala (`.scl`) & Sistemas Avançados:** 12 presets prontos (**Entonação Justa 5/7/11-limit**, **53-TET Otomano** Rast/Uşşak/Hicaz em commas, **Bohlen-Pierce 3/1 Tritava**, **Gamelan Pelog/Slendro reais**, **Mesotônico ¼-comma**, **19-EDO** e **Wendy Carlos Alpha**), importação/exportação de arquivos `.scl`, editor embutido, síntese em Hz puros e projeção direta no braço SVG exibindo o desvio exato `±¢` em cada casa.
- **Currículo Completo (8 Capítulos · 32 Lições + 32 Dossiês PT/EN):** cobre *Maqamat 24-TET*, *Barítono B/A Standard & Scordatura*, *Messiaen & Pitch Sets*, *Harmonia Não-Tercial & Iqa’at*, *Alcance Estendido 7 & 8 Cordas*, *Modulação Radar & Sayr*, *Fronteira Microtonal Scala/53-TET/JI* e *Treino Auditivo, Polimetria 11/8 & Engenharia de Tensão*.
- **Versão Mobile PWA Nativa:** barra inferior ergonômica para o polegar (*Braço*, *Deck*, *Estúdio*, *Buscar*, *Design*), suporte a `safe-area-inset-bottom`, zoom inteligente `0–12` em telas estreitas, toque tátil 44px, rolagem suave horizontal, modo paisagem otimizado e botão de instalação PWA (`beforeinstallprompt`).
- **Braço Vivo de Luthieria (6/7/8 Cordas) & 7 Mundos Visuais Esculturais (`T`):** vibração física da corda + *ripple*, ressonância de oitavas no *hover*, modo canhoto (`⇄`), 7 designs autorais com fontes e filigranas dedicadas e exportação de pranchas em **PNG (2× Retina) & SVG**, **MIDI 24-TET** e **MusicXML 4.0**.

## Execução Local & Validação

    node scripts/check.mjs
    python3 -m http.server 8080

Acesse `http://localhost:8080`.
