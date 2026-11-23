# String Atlas — Modal Guitar Lab (`v6.0.0`)

Laboratório PWA offline-first de experimentação modal, microtonal (**24-TET**), harmônica, rítmica e auditiva para guitarra elétrica — construído com **zero dependências externas** (Vanilla JS ES Modules, HTML5, CSS3 e Web Audio API).

## Principais Módulos

- **Braço Interativo 24-TET (22 casas):** 3 modos microtonais (*Bend +50¢*, *Slide/Fretless* e *Trastes 24-TET*), janela móvel de formas fechadas (`4–6` casas), destaque de cordas soltas na escala e camada de **Harmônicos Espectrais** (2º ao 7º parciais em Entonação Justa).
- **Atlas Expandido:** **74 escalas e modos** organizados em 7 domínios e subfamílias (18 *Maqamat* árabes, 7 modos gregos, sistemas menor harmônica/melódica/exóticos, *Ragas* indianos, Japão/Gamelan, modalismo brasileiro Armorial, todos os 7 modos de Messiaen, Slonimsky, *Pitch-Class Sets* de Allen Forte e pentatônicas experimentais) + **26 afinações** (incluindo **B Standard**, **A Standard**, Drop B/A/G, All Fourths, DADGAD, Oud-Mapped `CFADGC` e Drones).
- **Radar Modal 24-TET & Modulações (`v6.0`):** relógio polar de 24 alturas, descoberta automática de mutações paralelas (±1 grau / microtons), pivôs *Ghammaz/Sayr*, sobreposição visual *Escala A vs. Escala B* no braço e ponte em 1 clique para o Vamp Lab.
- **Rack de Timbre Elétrico & FX (`v6.0`):** 4 perfis Web Audio (*Clean Studio*, *Ambient Swell*, *Warm Crunch* e *Doom Fuzz*) com controles ao vivo de Delay, Tremolo e Volume.
- **Treino Auditivo 24-TET (`v6.0`):** discriminação de intervalos neutros (`100¢` vs `150¢` vs `200¢`; `300¢` vs `350¢` vs `400¢`), reconhecimento de *Maqamat*/modos e cores harmônicas com estatísticas salvas.
- **Vamps Modais & Modulações *Sayr*:** 10 jornadas prontas + editor inline com sincronização ao vivo no braço.
- **Line Mode (YIN 42–1480 Hz):** detector de pitch 24-TET otimizado para interface de áudio (incluindo `B1 = 61,7 Hz` e `A1 = 55 Hz`), medidor de precisão de micro-bend (`+50¢`), afinador de scordatura de 6 cordas e validação automática de Etudes.
- **Harmonia Não-Tercial, Etudes Procedurais & Polimetria:** solver dinâmico de voicings por scordatura, Construtor de Pitch-Class Set 24-TET, partitura 24-TET + tablatura sincronizada, 6 geradores procedurais de Etudes com exportação ASCII e motor rítmico de *Iqa'at* + Polimetria.
- **Guia de Estudos Progressivo, Modo Zen & Backup:** 4 capítulos (16 lições bilíngues PT/EN com dossiês), Modo Zen (`Z`), Snapshots com URL compartilhável (`#sa=...`) e exportação/importação `.json`.

## Execução Local & Validação

    node scripts/check.mjs
    python3 -m http.server 8080

Acesse `http://localhost:8080`.
