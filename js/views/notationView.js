/**
 * Synchronized 24-TET Guitar Treble Staff (8vb) + 6-String Tablature View v3.0
 * Modes: 'voicing' | 'etude' | 'scale' | 'phrase'
 */
import { qToGuitarStaffPos, qToNoteName } from '../core/theory24.js';
import { buildScaleTabSequence } from '../core/voicingEngine.js';
import { t } from '../core/i18n.js';
import { getActiveScale, getActiveVoicing, getState, setState } from '../state/store.js';
import { synthEngine } from '../audio/synthEngine.js';
import { exportEventsToMidi, exportEventsToMusicXML, triggerFileDownload } from '../core/exportEngine.js';
import { highlightFretboardEtudeEvent } from './fretboardView.js';

function computeNotationSvgH(numStrings) {
  return TAB_TOP_Y + (numStrings - 1) * TAB_GAP + 28;
}
const STAFF_LEFT = 54;
const E4_Y = 96;
const HALF_STEP_Y = 4.6;

const TAB_TOP_Y = 170;
const TAB_GAP = 14;

function stepToStaffY(stepFromE4) {
  return E4_Y - stepFromE4 * HALF_STEP_Y;
}

function renderLedgerLines(cx, stepFromE4) {
  const lines = [];
  if (stepFromE4 < 0) {
    for (let s = -2; s >= stepFromE4; s -= 2) {
      const y = stepToStaffY(s);
      lines.push(`<line x1="${cx - 11}" y1="${y}" x2="${cx + 11}" y2="${y}" stroke="var(--text-muted)" stroke-width="1.2"/>`);
    }
  } else if (stepFromE4 > 8) {
    for (let s = 10; s <= stepFromE4; s += 2) {
      const y = stepToStaffY(s);
      lines.push(`<line x1="${cx - 11}" y1="${y}" x2="${cx + 11}" y2="${y}" stroke="var(--text-muted)" stroke-width="1.2"/>`);
    }
  }
  return lines.join('');
}

function renderStaffAndTabBase(svgW, staffRight, tuningNamesHighToLow) {
  const numStrings = tuningNamesHighToLow.length;
  const p = [];
  for (let s = 0; s <= 8; s += 2) {
    const y = stepToStaffY(s);
    p.push(`<line x1="${STAFF_LEFT}" y1="${y}" x2="${staffRight}" y2="${y}" stroke="var(--border-strong)" stroke-width="1.1"/>`);
  }
  p.push(`<line x1="${STAFF_LEFT}" y1="${stepToStaffY(8)}" x2="${STAFF_LEFT}" y2="${TAB_TOP_Y + TAB_GAP * (numStrings - 1)}" stroke="var(--text-muted)" stroke-width="2"/>`);
  p.push(`<line x1="${staffRight}" y1="${stepToStaffY(8)}" x2="${staffRight}" y2="${TAB_TOP_Y + TAB_GAP * (numStrings - 1)}" stroke="var(--text-muted)" stroke-width="1.6"/>`);

  p.push(`<text x="${STAFF_LEFT + 10}" y="${E4_Y - 8}" fill="var(--accent-root)" font-size="38" font-family="Georgia, serif">𝄞</text>`);
  p.push(`<text x="${STAFF_LEFT + 15}" y="${E4_Y + 13}" fill="var(--text-muted)" font-size="9.5" font-weight="700" font-family="ui-monospace, monospace">8vb</text>`);

  for (let i = 0; i < numStrings; i += 1) {
    const y = TAB_TOP_Y + i * TAB_GAP;
    p.push(`<line x1="${STAFF_LEFT}" y1="${y}" x2="${staffRight}" y2="${y}" stroke="var(--border-strong)" stroke-width="1"/>`);
    p.push(`<text x="${STAFF_LEFT - 10}" y="${y + 3.5}" text-anchor="end" fill="var(--text-muted)" font-size="9.5" font-family="ui-monospace, monospace">${tuningNamesHighToLow[i]}</text>`);
  }

  p.push(`<text x="${STAFF_LEFT + 18}" y="${TAB_TOP_Y + 16}" text-anchor="middle" fill="var(--accent-scale)" font-size="11" font-weight="800" font-family="ui-monospace, monospace">T</text>`);
  p.push(`<text x="${STAFF_LEFT + 18}" y="${TAB_TOP_Y + 37}" text-anchor="middle" fill="var(--accent-scale)" font-size="11" font-weight="800" font-family="ui-monospace, monospace">A</text>`);
  p.push(`<text x="${STAFF_LEFT + 18}" y="${TAB_TOP_Y + 58}" text-anchor="middle" fill="var(--accent-scale)" font-size="11" font-weight="800" font-family="ui-monospace, monospace">B</text>`);

  return p.join('');
}

function formatTabFret(n, microMode) {
  if (n.kind === 'harmonic') {
    return n.fretDisplay || `⟨${n.fret}⟩`;
  }
  const isMicro = Boolean(n.isMicro) || (typeof n.fret === 'string' && n.fret.includes('+¼'));
  const baseFret = typeof n.fret === 'string' ? n.fret.replace('+¼', '') : n.fret;
  if (!isMicro) return `${baseFret}`;
  return microMode === 'bend' ? `${baseFret}↑¼` : `${baseFret}.5`;
}

function drawNoteColumn({ x, notes, microMode, numStrings = 6, svgH = 268, colIdx = null, articulation = null, accent = false }) {
  const parts = [];
  const clickableAttr = colIdx !== null ? `class="not-col" data-etude-col="${colIdx}" style="cursor:pointer"` : '';
  parts.push(`<g ${clickableAttr}>`);

  // Subtle highlight backdrop box toggled via .is-active-col during playback
  if (colIdx !== null) {
    parts.push(`<rect class="not-col-bg" x="${x - 20}" y="12" width="40" height="${svgH - 18}" rx="6" fill="var(--accent-etude)" fill-opacity="0"/>`);
  }

  // Articulation & accent header above treble staff
  if (articulation) {
    const artColor = articulation === 'B↑¼'
      ? 'var(--accent-micro)'
      : (articulation === '◇' ? 'var(--accent-harmonic)' : 'var(--accent-scale)');
    parts.push(`<text x="${x}" y="25" text-anchor="middle" fill="${artColor}" font-size="10.5" font-weight="800" font-family="ui-monospace, monospace">${articulation}</text>`);
  }
  if (accent) {
    parts.push(`<text x="${x}" y="38" text-anchor="middle" fill="var(--accent-root)" font-size="11" font-weight="800">&gt;</text>`);
  }

  const sorted = [...notes].sort((a, b) => a.q - b.q);
  let lastStep = null;

  sorted.forEach((n, idx) => {
    const pos = qToGuitarStaffPos(n.q);
    const clampedStep = Math.max(-12, Math.min(13, pos.stepFromE4));
    const y = stepToStaffY(clampedStep);
    const nx = lastStep !== null && Math.abs(clampedStep - lastStep) <= 1 ? x + 10 : x;
    lastStep = clampedStep;

    const isHarm = n.kind === 'harmonic';
    const fill = isHarm
      ? 'var(--accent-harmonic)'
      : (pos.isMicro ? 'var(--accent-micro)' : (n.intervalQ === 0 ? 'var(--accent-root)' : 'var(--text-primary)'));

    parts.push(renderLedgerLines(nx, clampedStep));
    if (isHarm) {
      parts.push(`<polygon points="${nx},${y - 5} ${nx + 6},${y} ${nx},${y + 5} ${nx - 6},${y}" fill="none" stroke="${fill}" stroke-width="2"/>`);
    } else {
      parts.push(`<ellipse cx="${nx}" cy="${y}" rx="5.5" ry="4" transform="rotate(-16 ${nx} ${y})" fill="${fill}"/>`);
    }

    if (pos.accidental && !isHarm) {
      const accX = nx - (pos.accidental.length > 1 ? 18 : 13) - (idx % 2 === 1 && sorted.length > 1 ? 10 : 0);
      parts.push(`<text x="${accX}" y="${y + 4}" fill="${pos.isMicro ? 'var(--accent-micro)' : 'var(--accent-scale)'}" font-size="${pos.accidental.length > 1 ? 10 : 12.5}" font-weight="700" font-family="ui-monospace, monospace">${pos.accidental}</text>`);
    }

    const strLine = Math.max(0, Math.min(numStrings - 1, (n.guitarStr || 1) - 1));
    const ty = TAB_TOP_Y + strLine * TAB_GAP;
    const fretText = formatTabFret(n, microMode);
    const pillW = Math.max(18, fretText.length * 6.8 + 6);

    parts.push(`<rect x="${x - pillW / 2}" y="${ty - 6.5}" width="${pillW}" height="13" rx="3" fill="var(--bg-panel)"/>`);
    parts.push(`<text x="${x}" y="${ty + 3.5}" text-anchor="middle" fill="${isHarm ? 'var(--accent-harmonic)' : (pos.isMicro ? 'var(--accent-micro)' : 'var(--accent-root)')}" font-size="10.2" font-weight="700" font-family="ui-monospace, monospace">${fretText}</text>`);
  });

  if (sorted.length === 1) {
    const caption = sorted[0].kind === 'harmonic'
      ? `${sorted[0].partial}º`
      : qToNoteName(sorted[0].q, false);
    parts.push(`<text x="${x}" y="${svgH - 6}" text-anchor="middle" fill="var(--text-muted)" font-size="9.2" font-family="ui-monospace, monospace">${caption}</text>`);
  }

  parts.push('</g>');
  return parts.join('');
}

/**
 * Lightweight live column highlight for Etude playback — zero DOM rebuild.
 */
export function highlightNotationStep(activeIdx) {
  const panel = document.getElementById('notationPanel');
  if (!panel) return;
  panel.querySelectorAll('.not-col').forEach((g) => {
    const isNow = Number(g.dataset.etudeCol) === activeIdx;
    g.classList.toggle('is-active-col', isNow);
  });
}

export function renderNotationPanel(state) {
  const panel = document.getElementById('notationPanel');
  if (!panel) return;

  const mode = state.notationMode;
  const numStrings = state.customStringsQ.length;
  const svgH = computeNotationSvgH(numStrings);
  const tuningHighToLow = [...state.customStringsQ].reverse().map((q) => qToNoteName(q, false));

  let bodyHtml = '';
  let extraActions = '';

  const phraseBtns = mode === 'phrase' ? `
    <button type="button" class="btn-mini" data-not-action="playPhrase" ${state.phraseEvents.length ? '' : 'disabled'}>${t(state.lang, 'phrasePlay')}</button>
    <button type="button" class="btn-mini" data-not-action="undoPhrase" ${state.phraseEvents.length ? '' : 'disabled'}>${t(state.lang, 'phraseUndo')}</button>
    <button type="button" class="btn-mini" data-not-action="clearPhrase" ${state.phraseEvents.length ? '' : 'disabled'}>${t(state.lang, 'phraseClear')}</button>
  ` : '';
  const hasExportable = mode === 'etude'
    ? Boolean(state.currentEtude?.events?.length)
    : (mode === 'phrase' ? state.phraseEvents.length > 0 : (mode === 'voicing' ? Boolean(getActiveVoicing()) : true));
  extraActions = `
    <div class="pill-row">
      ${phraseBtns}
      <button type="button" class="btn-mini" data-not-action="exportMidi" ${hasExportable ? '' : 'disabled'}>${t(state.lang, 'exportMidiBtn')}</button>
      <button type="button" class="btn-mini" data-not-action="exportXml" ${hasExportable ? '' : 'disabled'}>${t(state.lang, 'exportXmlBtn')}</button>
    </div>
  `;

  if (mode === 'phrase' && state.phraseEvents.length === 0) {
    bodyHtml = `<p class="empty-hint">${t(state.lang, 'phraseEmpty')}</p>`;
  } else if (mode === 'voicing' && !getActiveVoicing()) {
    bodyHtml = `<p class="empty-hint">${t(state.lang, 'voicingEmptyTab')}</p>`;
  } else {
    // Dynamically widen SVG for longer 16–24 note etudes so notation never crowds
    const etudeEvents = state.currentEtude?.events || [];
    const svgW = mode === 'etude' ? Math.max(1040, 180 + etudeEvents.length * 52) : 1040;
    const staffRight = svgW - 22;

    const svgParts = [`<svg class="notation-svg" style="min-width:${Math.min(svgW, 1280)}px" viewBox="0 0 ${svgW} ${svgH}" role="img">`];
    svgParts.push(renderStaffAndTabBase(svgW, staffRight, tuningHighToLow));

    const startX = STAFF_LEFT + 76;
    const usableW = staffRight - startX - 30;

    if (mode === 'etude' && etudeEvents.length > 0) {
      const stepW = Math.max(46, Math.min(68, usableW / etudeEvents.length));
      etudeEvents.forEach((ev, idx) => {
        svgParts.push(
          drawNoteColumn({
            x: startX + idx * stepW,
            notes: [ev],
            microMode: state.microMode, numStrings, svgH,
            colIdx: idx,
            articulation: ev.articulation,
            accent: ev.accent
          })
        );
      });
    } else if (mode === 'voicing') {
      const v = getActiveVoicing();
      const chordNotes = v.notes.map((n) => ({
        q: n.absQ,
        guitarStr: n.guitarStr,
        fret: n.fret,
        isMicro: n.isMicro,
        intervalQ: n.intervalQ
      }));
      svgParts.push(drawNoteColumn({ x: startX + 18, notes: chordNotes, microMode: state.microMode, numStrings, svgH }));

      const sepX = startX + 74;
      svgParts.push(`<line x1="${sepX}" y1="${stepToStaffY(8)}" x2="${sepX}" y2="${TAB_TOP_Y + TAB_GAP * (numStrings - 1)}" stroke="var(--border-strong)" stroke-dasharray="3 3"/>`);

      const stepW = Math.min(92, (staffRight - sepX - 40) / Math.max(1, chordNotes.length));
      chordNotes.forEach((cn, idx) => {
        svgParts.push(drawNoteColumn({ x: sepX + 44 + idx * stepW, notes: [cn], microMode: state.microMode, numStrings, svgH }));
      });
    } else if (mode === 'scale') {
      const scale = getActiveScale();
      const seq = buildScaleTabSequence({
        rootQ: state.rootQ,
        intervalsQ: scale.intervalsQ,
        stringsQ: state.customStringsQ
      });
      const stepW = Math.min(82, usableW / Math.max(1, seq.length));
      seq.forEach((item, idx) => {
        svgParts.push(
          drawNoteColumn({
            x: startX + idx * stepW,
            notes: [{
              q: item.absQ,
              guitarStr: item.guitarStr,
              fret: item.fret,
              isMicro: item.isMicro,
              intervalQ: item.intervalQ
            }],
            microMode: state.microMode,
            numStrings,
            svgH
          })
        );
      });
    } else if (mode === 'phrase') {
      const stepW = Math.min(56, usableW / Math.max(1, state.phraseEvents.length));
      state.phraseEvents.forEach((ev, idx) => {
        svgParts.push(
          drawNoteColumn({
            x: startX + idx * stepW,
            notes: [ev],
            microMode: state.microMode,
            numStrings,
            svgH
          })
        );
      });
    }

    svgParts.push('</svg>');
    bodyHtml = `<div class="notation-scroll">${svgParts.join('')}</div>`;
  }

  panel.innerHTML = `
    <div class="notation-header">
      <div class="fretboard-title-group">
        <span class="section-heading" style="margin:0">${t(state.lang, 'notationTitle')}</span>
        <div class="pill-row">
          <button type="button" class="btn-mini ${mode === 'etude' ? 'active-mini' : ''}" data-not-mode="etude">${t(state.lang, 'notModeEtude')}</button>
          <button type="button" class="btn-mini ${mode === 'voicing' ? 'active-mini' : ''}" data-not-mode="voicing">${t(state.lang, 'notModeVoicing')}</button>
          <button type="button" class="btn-mini ${mode === 'scale' ? 'active-mini' : ''}" data-not-mode="scale">${t(state.lang, 'notModeScale')}</button>
          <button type="button" class="btn-mini ${mode === 'phrase' ? 'active-mini' : ''}" data-not-mode="phrase">${t(state.lang, 'notModePhrase')} (${state.phraseEvents.length})</button>
        </div>
      </div>
      ${extraActions}
    </div>
    ${bodyHtml}
  `;

  if (mode === 'etude' && state.etudeActiveIdx >= 0) {
    highlightNotationStep(state.etudeActiveIdx);
  }

  panel.onclick = (e) => {
    const modeBtn = e.target.closest('button[data-not-mode]');
    if (modeBtn) {
      setState({ notationMode: modeBtn.dataset.notMode });
      return;
    }

    const col = e.target.closest('.not-col[data-etude-col]');
    if (col) {
      const idx = Number(col.dataset.etudeCol);
      const st = getState();
      const ev = st.currentEtude?.events?.[idx];
      if (ev) {
        synthEngine.triggerEtudeEvent(ev, { stepDur: 0.4 });
        highlightNotationStep(idx);
        highlightFretboardEtudeEvent(ev, st.microMode);
        setState({ etudeActiveIdx: idx });
      }
      return;
    }

    const actBtn = e.target.closest('button[data-not-action]');
    if (!actBtn) return;
    const act = actBtn.dataset.notAction;

    if (act === 'playPhrase' && state.phraseEvents.length) {
      synthEngine.playPhrase(state.phraseEvents, {
        bpm: state.bpm,
        onStep: (pcQ) => setState({ playingPcQ: pcQ }),
        onComplete: () => setState({ playingPcQ: null })
      });
    } else if (act === 'undoPhrase') {
      setState({ phraseEvents: state.phraseEvents.slice(0, -1) });
    } else if (act === 'clearPhrase') {
      setState({ phraseEvents: [] });
    } else if (act === 'exportMidi' || act === 'exportXml') {
      const st = getState();
      const events = collectActiveNotationEvents(st);
      if (!events.length) return;
      const scale = getActiveScale();
      const title = `${qToNoteName(st.rootQ, false)} ${scale.nameEn} (${st.notationMode})`;
      if (act === 'exportMidi') {
        const bytes = exportEventsToMidi({ events, bpm: st.notationMode === 'etude' ? st.etudeBpm : st.bpm, title });
        triggerFileDownload(bytes, `string-atlas-${st.notationMode}-24tet.mid`, 'audio/midi');
      } else {
        const xml = exportEventsToMusicXML({ events, stringsQ: st.customStringsQ, bpm: st.notationMode === 'etude' ? st.etudeBpm : st.bpm, title });
        triggerFileDownload(xml, `string-atlas-${st.notationMode}.musicxml`, 'application/vnd.recordare.musicxml+xml');
      }
    }
  };
}


function collectActiveNotationEvents(st) {
  if (st.notationMode === 'etude') {
    return st.currentEtude?.events || [];
  }
  if (st.notationMode === 'phrase') {
    return st.phraseEvents || [];
  }
  if (st.notationMode === 'voicing') {
    const v = getActiveVoicing();
    return v ? v.notes.map((n) => ({ q: n.absQ, guitarStr: n.guitarStr, fret: n.fret, isMicro: n.isMicro, kind: 'note' })) : [];
  }
  const sc = getActiveScale();
  return buildScaleTabSequence({
    rootQ: st.rootQ,
    intervalsQ: sc.intervalsQ,
    stringsQ: st.customStringsQ
  }).map((item) => ({ ...item, q: item.absQ, kind: 'note' }));
}
