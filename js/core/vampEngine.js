/**
 * Modal Vamp, Sayr Modulation & Dynamic Target-Tone Engine (24-TET)
 */
import { mod24, qToNoteName } from './theory24.js';

export const VAMP_PRESETS = [
  {
    "id": "vamp_sayr_bayati",
    "category": "sayr",
    "namePt": "Sayr Maqam Bayati (Bayati → Hijaz na 4ª → Rast → Bayati)",
    "nameEn": "Maqam Bayati Sayr (Bayati → Hijaz on 4th → Rast → Bayati)",
    "descPt": "Jornada clássica de modulação árabe (Sayr) sobre Ré: estabelece Jins Bayati, tensiona modulando para Hijaz no 4º grau (Sol), ilumina em Rast e retorna à tônica.",
    "descEn": "Classic Arabic Sayr modulation journey in D: establishes Jins Bayati, modulates to Hijaz on the 4th (G), brightens into Rast, and resolves home.",
    "tuningId": "dadgad",
    "bpm": 88,
    "beatsPerBar": 4,
    "steps": [
      {
        "label": "D Bayati (Qarar)",
        "rootQ": 4,
        "scaleId": "maqam_bayati",
        "chordId": "bayati_neutral_dyad",
        "bars": 2
      },
      {
        "label": "G Hijaz (Ghammaz)",
        "rootQ": 14,
        "scaleId": "maqam_hijaz",
        "chordId": "hijaz_drone_chord",
        "bars": 2
      },
      {
        "label": "G Rast (Luz Neutra)",
        "rootQ": 14,
        "scaleId": "maqam_rast",
        "chordId": "rast_neutral_triad",
        "bars": 2
      },
      {
        "label": "D Bayati (Retorno)",
        "rootQ": 4,
        "scaleId": "maqam_bayati",
        "chordId": "bayati_neutral_dyad",
        "bars": 2
      }
    ]
  },
  {
    "id": "vamp_sayr_nahawand",
    "category": "sayr",
    "namePt": "Sayr Nahawand Lírico (Nahawand → Hijaz na 5ª → Kurd)",
    "nameEn": "Lyrical Nahawand Sayr (Nahawand → Hijaz on 5th → Kurd)",
    "descPt": "Modulação 100% 12-TET ideal para guitarra limpa ou overdrive leve: navega entre a liricidade do Nahawand, o drama do Hijaz na 5ª e a resolução sombria do Kurd.",
    "descEn": "Pure 12-TET Arabic modulation ideal for clean or mild-overdrive guitar: flows from lyrical Nahawand through dramatic upper Hijaz and dark Kurd cadence.",
    "tuningId": "standard",
    "bpm": 96,
    "beatsPerBar": 4,
    "steps": [
      {
        "label": "C Nahawand",
        "rootQ": 0,
        "scaleId": "maqam_nahawand",
        "chordId": "quintal_3",
        "bars": 2
      },
      {
        "label": "G Hijaz Kar (5ª)",
        "rootQ": 14,
        "scaleId": "maqam_hijaz_kar",
        "chordId": "hijaz_drone_chord",
        "bars": 2
      },
      {
        "label": "F Kurd (4ª)",
        "rootQ": 10,
        "scaleId": "maqam_kurd",
        "chordId": "quartal_3",
        "bars": 2
      },
      {
        "label": "C Nahawand (Qarar)",
        "rootQ": 0,
        "scaleId": "maqam_nahawand",
        "chordId": "min_maj7_9",
        "bars": 2
      }
    ]
  },
  {
    "id": "vamp_baritone_b_doom",
    "category": "baritone",
    "namePt": "B Standard Modal Doom (Nawa Athar → Saba Zamzam)",
    "nameEn": "B Standard Modal Doom (Nawa Athar → Saba Zamzam)",
    "descPt": "Vamp grave e hipnótico construído para B Standard (B1 = 61,7 Hz): alterna a simetria gótica do Nawa Athar com a opressão sem-quarta-justa do Saba Zamzam.",
    "descEn": "Hypnotic low-end vamp tailored for B Standard (B1 = 61.7 Hz): alternates Nawa Athar’s gothic symmetry with Saba Zamzam’s fourth-less gloom.",
    "tuningId": "b_standard",
    "bpm": 76,
    "beatsPerBar": 4,
    "steps": [
      {
        "label": "B Nawa Athar",
        "rootQ": 22,
        "scaleId": "maqam_nawa_athar",
        "chordId": "min_maj7_9",
        "bars": 2
      },
      {
        "label": "C Hijaz Kar (♭II)",
        "rootQ": 0,
        "scaleId": "maqam_hijaz_kar",
        "chordId": "hijaz_drone_chord",
        "bars": 1
      },
      {
        "label": "B Saba Zamzam",
        "rootQ": 22,
        "scaleId": "maqam_saba_zamzam",
        "chordId": "viennese_chord",
        "bars": 2
      },
      {
        "label": "F♯ Phrygian Dom (V)",
        "rootQ": 12,
        "scaleId": "phrygian_dominant",
        "chordId": "hijaz_drone_chord",
        "bars": 1
      }
    ]
  },
  {
    "id": "vamp_baritone_a_posttonal",
    "category": "baritone",
    "namePt": "A Standard Pós-Tonal ([0,1,3,7] → Frígio → [0,1,6])",
    "nameEn": "A Standard Post-Tonal ([0,1,3,7] → Phrygian → [0,1,6])",
    "descPt": "Ciclo angular em A Standard (A1 = 55 Hz) combinando Forte 4-Z29, peso Frígio e o Tricorde Vienense em compasso de 5/4.",
    "descEn": "Angular A Standard cycle (A1 = 55 Hz) weaving Forte 4-Z29, heavy Phrygian gravity, and the Viennese Trichord in 5/4.",
    "tuningId": "a_standard",
    "bpm": 102,
    "beatsPerBar": 5,
    "steps": [
      {
        "label": "A [0,1,3,7]",
        "rootQ": 18,
        "scaleId": "set_all_interval_0137",
        "chordId": "cluster_secundal",
        "bars": 2
      },
      {
        "label": "B♭ Lydian ♯2",
        "rootQ": 20,
        "scaleId": "lydian_sharp2",
        "chordId": "maj7_b5",
        "bars": 1
      },
      {
        "label": "A Phrygian",
        "rootQ": 18,
        "scaleId": "std_phrygian",
        "chordId": "quintal_3",
        "bars": 2
      },
      {
        "label": "E♭ [0,1,6] (Trítono)",
        "rootQ": 6,
        "scaleId": "set_viennese_016",
        "chordId": "viennese_chord",
        "bars": 1
      }
    ]
  },
  {
    "id": "vamp_so_what_quartal",
    "category": "jazz",
    "namePt": "So What Quartal Shift (D Dórico → E♭ Dórico)",
    "nameEn": "So What Quartal Shift (D Dorian → E♭ Dorian)",
    "descPt": "Clássico deslocamento modal por semitom do jazz contemporâneo — ideal para treinar voicings quartais (So What) e saltos suaves entre centros tonais.",
    "descEn": "Classic half-step modal jazz shift — ideal for practicing So What quartal voicings and seamless target-tone voice leading.",
    "tuningId": "standard",
    "bpm": 116,
    "beatsPerBar": 4,
    "steps": [
      {
        "label": "D Dorian (So What)",
        "rootQ": 4,
        "scaleId": "std_dorian",
        "chordId": "quartal_4_so_what",
        "bars": 4
      },
      {
        "label": "E♭ Dorian (+1 semitom)",
        "rootQ": 6,
        "scaleId": "std_dorian",
        "chordId": "quartal_4_so_what",
        "bars": 2
      },
      {
        "label": "D Dorian (Retorno)",
        "rootQ": 4,
        "scaleId": "std_dorian",
        "chordId": "quartal_3",
        "bars": 2
      }
    ]
  },
  {
    "id": "vamp_lydian_mediants",
    "category": "experimental",
    "namePt": "Mediantes Lídias (F → A♭ → B → D Lídio)",
    "nameEn": "Lydian Chromatic Mediants (F → A♭ → B → D Lydian)",
    "descPt": "Ciclo simétrico de terças menores em acordes Lídios cristalinos (maj7♯11): atmosfera cinematográfica de shoegaze, post-rock e jazz espacial.",
    "descEn": "Symmetrical minor-3rd cycle of crystalline Lydian chords (maj7♯11): cinematic atmosphere for shoegaze, post-rock, and space jazz.",
    "tuningId": "open_lydian",
    "bpm": 86,
    "beatsPerBar": 4,
    "steps": [
      {
        "label": "F Lydian",
        "rootQ": 10,
        "scaleId": "std_lydian",
        "chordId": "lydian_shell",
        "bars": 2
      },
      {
        "label": "A♭ Lydian",
        "rootQ": 16,
        "scaleId": "std_lydian",
        "chordId": "lydian_shell",
        "bars": 2
      },
      {
        "label": "B Lydian",
        "rootQ": 22,
        "scaleId": "std_lydian",
        "chordId": "lydian_shell",
        "bars": 2
      },
      {
        "label": "D Lydian",
        "rootQ": 4,
        "scaleId": "std_lydian",
        "chordId": "lydian_shell",
        "bars": 2
      }
    ]
  },
  {
    "id": "vamp_messiaen_sym",
    "category": "experimental",
    "namePt": "Messiaen & Slonimsky (Modo 3 → Modo 2 → Modo 6)",
    "nameEn": "Messiaen & Slonimsky (Mode 3 → Mode 2 → Mode 6)",
    "descPt": "Laboratório simétrico em 7/4 ou 4/4 que alterna os três maiores eixos de simetria do século XX (3ªM, 3ªm e Trítono).",
    "descEn": "Symmetrical lab cycling across the three pillars of 20th-century symmetry (major 3rd, minor 3rd, and tritone).",
    "tuningId": "all_fourths",
    "bpm": 98,
    "beatsPerBar": 4,
    "steps": [
      {
        "label": "C Messiaen Mode 3",
        "rootQ": 0,
        "scaleId": "messiaen_mode3",
        "chordId": "maj7_b5",
        "bars": 2
      },
      {
        "label": "E Messiaen Mode 2",
        "rootQ": 8,
        "scaleId": "messiaen_mode2",
        "chordId": "all_interval_chord",
        "bars": 2
      },
      {
        "label": "F♯ Messiaen Mode 6",
        "rootQ": 12,
        "scaleId": "messiaen_mode6",
        "chordId": "cluster_secundal",
        "bars": 2
      }
    ]
  },
  {
    "id": "vamp_andalusian",
    "category": "global",
    "namePt": "Cadência Andaluza / Flamenca (Am → G → F → E Hijaz)",
    "nameEn": "Andalusian / Flamenco Cadence (Am → G → F → E Hijaz)",
    "descPt": "A progressão descendente clássica ibérico-mediterrânea: aproveite a mudança do braço para alternar Eólio, Mixolídio, Lídio e a explosão em Mi Frígio Dominante.",
    "descEn": "Classic Iberian-Mediterranean descent: ride the live fretboard updates across Aeolian, Mixolydian, Lydian, and fiery E Phrygian Dominant.",
    "tuningId": "standard",
    "bpm": 108,
    "beatsPerBar": 3,
    "steps": [
      {
        "label": "A Aeolian (iv)",
        "rootQ": 18,
        "scaleId": "std_aeolian",
        "chordId": "quintal_3",
        "bars": 2
      },
      {
        "label": "G Mixolydian (♭III)",
        "rootQ": 14,
        "scaleId": "std_mixolydian",
        "chordId": "quartal_3",
        "bars": 2
      },
      {
        "label": "F Lydian (♭II)",
        "rootQ": 10,
        "scaleId": "std_lydian",
        "chordId": "lydian_shell",
        "bars": 2
      },
      {
        "label": "E Phrygian Dom (I)",
        "rootQ": 8,
        "scaleId": "phrygian_dominant",
        "chordId": "hijaz_drone_chord",
        "bars": 2
      }
    ]
  },
  {
    "id": "vamp_armorial_sertao",
    "category": "global",
    "namePt": "Sertão Armorial (C Lídio ♭7 → B♭ Lídio → G Mixo)",
    "nameEn": "Armorial Sertão (C Lydian ♭7 → B♭ Lydian → G Mixo)",
    "descPt": "Ciclo modal nordestino inspirado na viola e no Quinteto Armorial — encaixa perfeitamente com harmônicos naturais e o ciclo Malfuf (3+3+2).",
    "descEn": "Northeastern Brazilian modal cycle inspired by viola drones and Quinteto Armorial — pairs effortlessly with natural harmonics and 3+3+2 Malfuf.",
    "tuningId": "orkney",
    "bpm": 104,
    "beatsPerBar": 4,
    "steps": [
      {
        "label": "C Lídio ♭7 (Armorial)",
        "rootQ": 0,
        "scaleId": "br_armorial_lydian_b7",
        "chordId": "quintal_3",
        "bars": 2
      },
      {
        "label": "B♭ Lídio (♭VII)",
        "rootQ": 20,
        "scaleId": "std_lydian",
        "chordId": "lydian_shell",
        "bars": 1
      },
      {
        "label": "G Mixolídio (V)",
        "rootQ": 14,
        "scaleId": "std_mixolydian",
        "chordId": "quartal_3",
        "bars": 1
      }
    ]
  },
  {
    "id": "vamp_marwa_dusk",
    "category": "global",
    "namePt": "Crepúsculo em Raga Marwa (Sem 5ª Justa)",
    "nameEn": "Raga Marwa Dusk Suspension (Fifth-less)",
    "descPt": "Vamp atmosférico lento para ambient/shoegaze: alterna a suspensão sem-quinta do Raga Marwa com a cor onírica do Lídio Aumentado.",
    "descEn": "Slow atmospheric vamp for ambient/shoegaze: pivots between Raga Marwa’s fifth-less suspension and dreamy Lydian Augmented.",
    "tuningId": "sonic_unison",
    "bpm": 72,
    "beatsPerBar": 4,
    "steps": [
      {
        "label": "F♯ Raga Marwa",
        "rootQ": 12,
        "scaleId": "raga_marwa",
        "chordId": "maj7_b5",
        "bars": 2
      },
      {
        "label": "G Lydian Aug (♭II)",
        "rootQ": 14,
        "scaleId": "lydian_augmented",
        "chordId": "lydian_shell",
        "bars": 2
      }
    ]
  }
];

/**
 * Builds a fresh 2-step modal vamp centered on whatever scale/root/chord the user currently has loaded.
 */
export function buildVampFromCurrentLab({ rootQ, scale, chordId }) {
  const rootName = qToNoteName(rootQ, false);
  // Pick a musically compelling secondary pivot: 4th (10q) for Arabic/Minor, ♭II (2q) for Phrygian/Post-Tonal, or 5th (14q)
  const pivotOffset = scale.intervalsQ.includes(2) ? 2 : (scale.intervalsQ.includes(10) ? 10 : 14);
  const pivotRootQ = mod24(rootQ + pivotOffset);
  const pivotName = qToNoteName(pivotRootQ, false);

  return [
    {
      label: `${rootName} ${scale.namePt} (Base)`,
      rootQ,
      scaleId: scale.id === '__custom_set__' ? 'maqam_bayati' : scale.id,
      chordId,
      bars: 2
    },
    {
      label: `${pivotName} Pivot (+${pivotOffset / 2}st)`,
      rootQ: pivotRootQ,
      scaleId: scale.id === '__custom_set__' ? 'maqam_hijaz' : scale.id,
      chordId,
      bars: 2
    }
  ];
}
