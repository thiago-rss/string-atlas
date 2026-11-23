/**
 * Pure 24-TET Export Engine: Standard MIDI File (.mid, SMF Type 0) & MusicXML 4.0 (.musicxml)
 * Zero external dependencies — supports 6-, 7-, and 8-string guitars and exact quarter-tones!
 */
import { Q_PER_OCTAVE, mod24, qToOctave } from './theory24.js';

const MIDI_PPQ = 480;

const XML_SPELLING_24 = [
  { step: 'C', alter: 0,    acc: '' },
  { step: 'C', alter: 0.5,  acc: 'quarter-sharp' },
  { step: 'C', alter: 1,    acc: 'sharp' },
  { step: 'D', alter: -0.5, acc: 'quarter-flat' },
  { step: 'D', alter: 0,    acc: '' },
  { step: 'D', alter: 0.5,  acc: 'quarter-sharp' },
  { step: 'E', alter: -1,   acc: 'flat' },
  { step: 'E', alter: -0.5, acc: 'quarter-flat' },
  { step: 'E', alter: 0,    acc: '' },
  { step: 'E', alter: 0.5,  acc: 'quarter-sharp' },
  { step: 'F', alter: 0,    acc: '' },
  { step: 'F', alter: 0.5,  acc: 'quarter-sharp' },
  { step: 'F', alter: 1,    acc: 'sharp' },
  { step: 'G', alter: -0.5, acc: 'quarter-flat' },
  { step: 'G', alter: 0,    acc: '' },
  { step: 'G', alter: 0.5,  acc: 'quarter-sharp' },
  { step: 'A', alter: -1,   acc: 'flat' },
  { step: 'A', alter: -0.5, acc: 'quarter-flat' },
  { step: 'A', alter: 0,    acc: '' },
  { step: 'A', alter: 0.5,  acc: 'quarter-sharp' },
  { step: 'B', alter: -1,   acc: 'flat' },
  { step: 'B', alter: -0.5, acc: 'quarter-flat' },
  { step: 'B', alter: 0,    acc: '' },
  { step: 'B', alter: 0.5,  acc: 'quarter-sharp' }
];

function encodeVarLen(value) {
  let v = Math.max(0, Math.floor(value));
  const bytes = [v & 0x7f];
  v >>= 7;
  while (v > 0) {
    bytes.unshift((v & 0x7f) | 0x80);
    v >>= 7;
  }
  return bytes;
}

function uint32BE(n) {
  return [(n >>> 24) & 0xff, (n >>> 16) & 0xff, (n >>> 8) & 0xff, n & 0xff];
}

function uint16BE(n) {
  return [(n >>> 8) & 0xff, n & 0xff];
}

function asciiBytes(str) {
  return Array.from(str, (c) => c.charCodeAt(0) & 0x7f);
}

function buildTrackMetaHeader(title, bpm, channelsUsed) {
  const events = [];
  const cleanTitle = (title || 'String Atlas 24-TET').slice(0, 80);
  const titleBytes = asciiBytes(cleanTitle);
  events.push({ tick: 0, order: 0, bytes: [0xff, 0x03, ...encodeVarLen(titleBytes.length), ...titleBytes] });

  const usPerQuarter = Math.round(60000000 / Math.max(30, Math.min(260, bpm || 100)));
  events.push({
    tick: 0,
    order: 1,
    bytes: [0xff, 0x51, 0x03, (usPerQuarter >> 16) & 0xff, (usPerQuarter >> 8) & 0xff, usPerQuarter & 0xff]
  });

  // Initialize each used channel: Electric Guitar Clean (GM #27) + RPN 0,0 Pitch Bend Range = ±2 semitones
  for (const ch of channelsUsed) {
    const c = ch & 0x0f;
    events.push({ tick: 0, order: 2, bytes: [0xc0 | c, 27] });
    events.push({ tick: 0, order: 3, bytes: [0xb0 | c, 101, 0] });
    events.push({ tick: 0, order: 4, bytes: [0xb0 | c, 100, 0] });
    events.push({ tick: 0, order: 5, bytes: [0xb0 | c, 6, 2] });
    events.push({ tick: 0, order: 6, bytes: [0xb0 | c, 38, 0] });
    // Center pitch bend (8192 -> LSB=0x00, MSB=0x40)
    events.push({ tick: 0, order: 7, bytes: [0xe0 | c, 0x00, 0x40] });
  }
  return events;
}

function compileMidiEventsToSmf0(timedEvents) {
  timedEvents.sort((a, b) => a.tick - b.tick || a.order - b.order);

  const trackData = [];
  let prevTick = 0;
  for (const ev of timedEvents) {
    const delta = Math.max(0, Math.round(ev.tick - prevTick));
    prevTick = ev.tick;
    trackData.push(...encodeVarLen(delta), ...ev.bytes);
  }
  // End of Track meta event
  trackData.push(0x00, 0xff, 0x2f, 0x00);

  const header = [
    ...asciiBytes('MThd'),
    ...uint32BE(6),
    ...uint16BE(0), // SMF Format 0
    ...uint16BE(1), // 1 track
    ...uint16BE(MIDI_PPQ)
  ];

  const trackChunk = [
    ...asciiBytes('MTrk'),
    ...uint32BE(trackData.length),
    ...trackData
  ];

  return new Uint8Array([...header, ...trackChunk]);
}

/**
 * Exports a monophonic sequence (Etude, Recorded Phrase, or Scale) to a 24-TET MIDI binary (Uint8Array).
 * Quarter-tones automatically emit exact +50c pitch bend (+2048 units @ ±2st RPN range).
 */
export function exportEventsToMidi({ events, bpm = 96, stepTicks = 240, title = 'String Atlas Etude' }) {
  const timed = buildTrackMetaHeader(title, bpm, [0]);
  let cursorTick = 0;

  for (const ev of events || []) {
    const q = Math.round(ev.q);
    const midiNote = Math.max(0, Math.min(127, Math.floor(q / 2)));
    const isQuarter = ((q % 2) + 2) % 2 !== 0;
    const velocity = ev.accent ? 112 : 90;
    const noteDur = Math.max(60, Math.round(stepTicks * 0.9));

    // Pitch bend: +50c = 10240 (0x00, 0x50) | 0c = 8192 (0x00, 0x40)
    const pbMsb = isQuarter ? 0x50 : 0x40;
    timed.push({ tick: cursorTick, order: 10, bytes: [0xe0, 0x00, pbMsb] });
    timed.push({ tick: cursorTick, order: 11, bytes: [0x90, midiNote, velocity] });
    timed.push({ tick: cursorTick + noteDur, order: 9, bytes: [0x80, midiNote, 0] });

    cursorTick += stepTicks;
  }

  return compileMidiEventsToSmf0(timed);
}

/**
 * Exports a Modal Vamp / Sayr progression to a 24-TET multi-channel MIDI file (MPE-style per-voice pitch bend!).
 * Every voice in a chord receives its own MIDI channel (0..5) so microtonal voicings like Rast (1-3½♭-5)
 * render with authentic quarter-tone harmony in any DAW.
 */
export function exportVampToMidi({
  steps,
  bpm = 96,
  beatsPerBar = 4,
  getChordIntervals,
  title = 'String Atlas Modal Vamp'
}) {
  const channels = [0, 1, 2, 3, 4, 5];
  const timed = buildTrackMetaHeader(title, bpm, channels);
  let cursorTick = 0;

  for (const step of steps || []) {
    const bars = Math.max(1, step.bars || 2);
    const stepTicks = bars * beatsPerBar * MIDI_PPQ;
    const intervalsQ = getChordIntervals ? getChordIntervals(step.chordId) : [0, 14];

    const bassQ = 72 + mod24(step.rootQ);
    const upperBaseQ = 96 + mod24(step.rootQ);
    const voiceQs = [bassQ, ...intervalsQ.slice(0, 5).map((iv) => upperBaseQ + iv)];

    voiceQs.forEach((q, idx) => {
      const ch = idx % 6;
      const midiNote = Math.max(0, Math.min(127, Math.floor(q / 2)));
      const isQuarter = ((q % 2) + 2) % 2 !== 0;
      const pbMsb = isQuarter ? 0x50 : 0x40;
      const vel = idx === 0 ? 104 : 84;
      const noteOnTick = cursorTick + idx * 14; // subtle natural guitar strum spread

      timed.push({ tick: noteOnTick, order: 10, bytes: [0xe0 | ch, 0x00, pbMsb] });
      timed.push({ tick: noteOnTick, order: 11, bytes: [0x90 | ch, midiNote, vel] });
      timed.push({ tick: cursorTick + stepTicks - 24, order: 9, bytes: [0x80 | ch, midiNote, 0] });
    });

    cursorTick += stepTicks;
  }

  return compileMidiEventsToSmf0(timed);
}

function escapeXml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function qToXmlPitch(q) {
  const pc = mod24(q);
  const oct = qToOctave(q);
  const sp = XML_SPELLING_24[pc];
  return { step: sp.step, alter: sp.alter, acc: sp.acc, octave: oct };
}

/**
 * Exports a sequence (Etude, Phrase, Scale, or Voicing breakdown) to valid MusicXML 4.0
 * with dual Staff (24-TET treble 8vb + dynamic 6/7/8-string TAB clef) and micro-bend/harmonic tags.
 */
export function exportEventsToMusicXML({
  events,
  stringsQ,
  bpm = 96,
  title = 'String Atlas 24-TET Study'
}) {
  const numStrings = stringsQ.length;
  const divisions = 2; // 1 eighth-note = 1 division; 1 quarter-note = 2 divisions
  const beatsPerMeasure = 4;
  const notesPerMeasure = beatsPerMeasure * divisions; // 8 eighth-notes per 4/4 bar

  // Build <staff-tuning> from line 1 (lowest string) up to numStrings (highest string)
  const tuningXml = stringsQ.map((sq, idx) => {
    const p = qToXmlPitch(sq);
    const alterTag = p.alter !== 0 ? `<tuning-alter>${p.alter}</tuning-alter>` : '';
    return `          <staff-tuning line="${idx + 1}"><tuning-step>${p.step}</tuning-step>${alterTag}<tuning-octave>${p.octave}</tuning-octave></staff-tuning>`;
  }).join('\n');

  const safeEvents = events && events.length ? events : [];
  const totalMeasures = Math.max(1, Math.ceil(safeEvents.length / notesPerMeasure));
  const measuresXml = [];

  for (let m = 0; m < totalMeasures; m += 1) {
    const slice = safeEvents.slice(m * notesPerMeasure, (m + 1) * notesPerMeasure);
    const mParts = [];
    mParts.push(`    <measure number="${m + 1}">`);

    if (m === 0) {
      mParts.push(`      <attributes>
        <divisions>${divisions}</divisions>
        <key><fifths>0</fifths></key>
        <time><beats>${beatsPerMeasure}</beats><beat-type>4</beat-type></time>
        <staves>2</staves>
        <clef number="1"><sign>G</sign><line>2</line><clef-octave-change>-1</clef-octave-change></clef>
        <clef number="2"><sign>TAB</sign><line>5</line></clef>
        <staff-details number="2">
          <staff-lines>${numStrings}</staff-lines>
${tuningXml}
        </staff-details>
      </attributes>
      <direction placement="above">
        <direction-type><metronome><beat-unit>quarter</beat-unit><per-minute>${Math.round(bpm)}</per-minute></metronome></direction-type>
        <sound tempo="${Math.round(bpm)}"/>
      </direction>`);
    }

    // Staff 1: Standard 24-TET Notation
    for (let i = 0; i < notesPerMeasure; i += 1) {
      const ev = slice[i];
      if (!ev) {
        mParts.push(`      <note><rest/><duration>1</duration><voice>1</voice><type>eighth</type><staff>1</staff></note>`);
        continue;
      }
      const p = qToXmlPitch(Math.round(ev.q));
      const alterTag = p.alter !== 0 ? `<alter>${p.alter}</alter>` : '';
      const accTag = p.acc ? `<accidental>${p.acc}</accidental>` : '';
      const noteheadTag = ev.kind === 'harmonic' ? '<notehead>diamond</notehead>' : '';
      mParts.push(`      <note>
        <pitch><step>${p.step}</step>${alterTag}<octave>${p.octave}</octave></pitch>
        <duration>1</duration><voice>1</voice><type>eighth</type>${accTag}${noteheadTag}<staff>1</staff>
      </note>`);
    }

    // Backup to start of measure for Staff 2 (TAB)
    mParts.push(`      <backup><duration>${notesPerMeasure}</duration></backup>`);

    // Staff 2: 6/7/8-String Guitar Tablature
    for (let i = 0; i < notesPerMeasure; i += 1) {
      const ev = slice[i];
      if (!ev) {
        mParts.push(`      <note><rest/><duration>1</duration><voice>2</voice><type>eighth</type><staff>2</staff></note>`);
        continue;
      }
      const p = qToXmlPitch(Math.round(ev.q));
      const alterTag = p.alter !== 0 ? `<alter>${p.alter}</alter>` : '';
      const strNum = Math.max(1, Math.min(numStrings, ev.guitarStr || 1));
      const fretNum = typeof ev.fret === 'string' ? parseInt(ev.fret, 10) || 0 : (ev.fret || 0);
      const bendTag = ev.isMicro ? '<bend><bend-alter>0.5</bend-alter></bend>' : '';
      const harmTag = ev.kind === 'harmonic' ? '<harmonic><natural/></harmonic>' : '';
      mParts.push(`      <note>
        <pitch><step>${p.step}</step>${alterTag}<octave>${p.octave}</octave></pitch>
        <duration>1</duration><voice>2</voice><type>eighth</type><staff>2</staff>
        <notations><technical><string>${strNum}</string><fret>${fretNum}</fret>${bendTag}${harmTag}</technical></notations>
      </note>`);
    }

    mParts.push('    </measure>');
    measuresXml.push(mParts.join('\n'));
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE score-partwise PUBLIC "-//Recordare//DTD MusicXML 4.0 Partwise//EN" "http://www.musicxml.org/dtds/partwise.dtd">
<score-partwise version="4.0">
  <work><work-title>${escapeXml(title)}</work-title></work>
  <identification>
    <creator type="software">String Atlas — Modal Guitar Lab (24-TET)</creator>
  </identification>
  <part-list>
    <score-part id="P1">
      <part-name>Electric Guitar (${numStrings}-String)</part-name>
    </score-part>
  </part-list>
  <part id="P1">
${measuresXml.join('\n')}
  </part>
</score-partwise>
`;
}

/** Browser download helper for binary (.mid) or text (.musicxml) exports */
export function triggerFileDownload(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
