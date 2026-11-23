/**
 * Synchronized 24-TET Guitar Treble Staff (8vb) + 6-String Tablature View
 * Supports 3 modes:
 * - 'voicing': stacked chord on staff + 6-string tab + arpeggiated breakdown
 * - 'scale': 1-octave ascending scale/maqam with microtonal accidentals + suggested tab
 * - 'phrase': interactive 16-note scratchpad captured from fretboard clicks
 */
import { qToGuitarStaffPos, qToNoteName } from '../core/theory24.js';
import { buildScaleTabSequence } from '../core/voicingEngine.js';
import { t } from '../core/i18n.js';
import { getActiveScale, getActiveVoicing, setState } from '../state/store.js';
import { synthEngine } from '../audio/synthEngine.js';

const SVG_W = 1040;
const SVG_H = 228;
const STAFF_LEFT = 54;
const STAFF_RIGHT = 1018;
// Treble staff lines (bottom E4 = y 94, F4 = 89, G4 = 84 ... F5 = 54)
const E4_Y = 94;
const HALF_STEP_Y = 5; // 10px between adjacent staff lines

const TAB_TOP_Y = 136;
const TAB_GAP = 14; // 6 strings: 136, 150, 164, 178, 192, 206

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

function renderStaffAndTabBase(tuningNamesHighToLow) {
  const p = [];
  // 5 Treble staff lines (steps 0, 2, 4, 6, 8)
  for (let s = 0; s <= 8; s += 2) {
    const y = stepToStaffY(s);
    p.push(`<line x1="${STAFF_LEFT}" y1="${y}" x2="${STAFF_RIGHT}" y2="${y}" stroke="var(--border-strong)" stroke-width="1.1"/>`);
  }
  // Brace / left barline
  p.push(`<line x1="${STAFF_LEFT}" y1="${stepToStaffY(8)}" x2="${STAFF_LEFT}" y2="${TAB_TOP_Y + TAB_GAP * 5}" stroke="var(--text-muted)" stroke-width="2"/>`);
  p.push(`<line x1="${STAFF_RIGHT}" y1="${stepToStaffY(8)}" x2="${STAFF_RIGHT}" y2="${TAB_TOP_Y + TAB_GAP * 5}" stroke="var(--text-muted)" stroke-width="1.6"/>`);

  // Clef symbol + 8vb label
  p.push(`<text x="${STAFF_LEFT + 10}" y="${E4_Y - 8}" fill="var(--accent-root)" font-size="38" font-family="Georgia, serif">𝄞</text>`);
  p.push(`<text x="${STAFF_LEFT + 15}" y="${E4_Y + 13}" fill="var(--text-muted)" font-size="9.5" font-weight="700" font-family="ui-monospace, monospace">8vb</text>`);

  // 6 Tablature lines
  for (let i = 0; i < 6; i += 1) {
    const y = TAB_TOP_Y + i * TAB_GAP;
    p.push(`<line x1="${STAFF_LEFT}" y1="${y}" x2="${STAFF_RIGHT}" y2="${y}" stroke="var(--border-strong)" stroke-width="1"/>`);
    p.push(`<text x="${STAFF_LEFT - 10}" y="${y + 3.5}" text-anchor="end" fill="var(--text-muted)" font-size="9.5" font-family="ui-monospace, monospace">${tuningNamesHighToLow[i]}</text>`);
  }

  // TAB vertical letters
  p.push(`<text x="${STAFF_LEFT + 18}" y="${TAB_TOP_Y + 16}" text-anchor="middle" fill="var(--accent-scale)" font-size="11" font-weight="800" font-family="ui-monospace, monospace">T</text>`);
  p.push(`<text x="${STAFF_LEFT + 18}" y="${TAB_TOP_Y + 37}" text-anchor="middle" fill="var(--accent-scale)" font-size="11" font-weight="800" font-family="ui-monospace, monospace">A</text>`);
  p.push(`<text x="${STAFF_LEFT + 18}" y="${TAB_TOP_Y + 58}" text-anchor="middle" fill="var(--accent-scale)" font-size="11" font-weight="800" font-family="ui-monospace, monospace">B</text>`);

  return p.join('');
}

function formatTabFret(fret, isMicro, microMode) {
  if (!isMicro) return `${fret}`;
  if (microMode === 'bend') return `${fret}↑¼`;
  return `${fret}.5`;
}

function drawNoteColumn({ x, notes, microMode }) {
  const parts = [];
  // Sort by pitch so close seconds slightly offset horizontally for readability
  const sorted = [...notes].sort((a, b) => a.q - b.q);
  let lastStep = null;

  sorted.forEach((n, idx) => {
    const pos = qToGuitarStaffPos(n.q);
    const clampedStep = Math.max(-6, Math.min(14, pos.stepFromE4));
    const y = stepToStaffY(clampedStep);
    const nx = lastStep !== null && Math.abs(clampedStep - lastStep) <= 1 ? x + 10 : x;
    lastStep = clampedStep;

    const fill = pos.isMicro ? 'var(--accent-micro)' : (n.intervalQ === 0 ? 'var(--accent-root)' : 'var(--text-primary)');
    parts.push(renderLedgerLines(nx, clampedStep));
    parts.push(`<ellipse cx="${nx}" cy="${y}" rx="5.6" ry="4.1" transform="rotate(-16 ${nx} ${y})" fill="${fill}"/>`);

    if (pos.accidental) {
      const accX = nx - (pos.accidental.length > 1 ? 19 : 13) - (idx % 2 === 1 && sorted.length > 1 ? 10 : 0);
      parts.push(`<text x="${accX}" y="${y + 4}" fill="${pos.isMicro ? 'var(--accent-micro)' : 'var(--accent-scale)'}" font-size="${pos.accidental.length > 1 ? 10.5 : 13}" font-weight="700" font-family="ui-monospace, monospace">${pos.accidental}</text>`);
    }

    // Tablature fret pill on the corresponding string (guitarStr 1..6 -> line idx 0..5)
    const strLine = Math.max(0, Math.min(5, (n.guitarStr || 1) - 1));
    const ty = TAB_TOP_Y + strLine * TAB_GAP;
    const fretText = typeof n.fret === 'string' && n.fret.includes('+¼')
      ? formatTabFret(n.fret.replace('+¼', ''), true, microMode)
      : formatTabFret(n.fret, Boolean(n.isMicro), microMode);
    const pillW = Math.max(18, fretText.length * 7.2 + 6);

    parts.push(`<rect x="${x - pillW / 2}" y="${ty - 6.5}" width="${pillW}" height="13" rx="3" fill="var(--bg-panel)"/>`);
    parts.push(`<text x="${x}" y="${ty + 3.5}" text-anchor="middle" fill="${pos.isMicro ? 'var(--accent-micro)' : 'var(--accent-root)'}" font-size="10.5" font-weight="700" font-family="ui-monospace, monospace">${fretText}</text>`);
  });

  // Note name caption underneath tab for single-note columns
  if (sorted.length === 1) {
    parts.push(`<text x="${x}" y="${SVG_H - 6}" text-anchor="middle" fill="var(--text-muted)" font-size="9.5" font-family="ui-monospace, monospace">${qToNoteName(sorted[0].q, false)}</text>`);
  }

  return parts.join('');
}

export function renderNotationPanel(state) {
  const panel = document.getElementById('notationPanel');
  if (!panel) return;

  const mode = state.notationMode;
  const tuningHighToLow = [...state.customStringsQ].reverse().map((q) => qToNoteName(q, false));

  let bodyHtml = '';
  let extraActions = '';

  if (mode === 'phrase') {
    extraActions = `
      <div class="pill-row">
        <button type="button" class="btn-mini" data-not-action="playPhrase" ${state.phraseEvents.length ? '' : 'disabled'}>${t(state.lang, 'phrasePlay')}</button>
        <button type="button" class="btn-mini" data-not-action="undoPhrase" ${state.phraseEvents.length ? '' : 'disabled'}>${t(state.lang, 'phraseUndo')}</button>
        <button type="button" class="btn-mini" data-not-action="clearPhrase" ${state.phraseEvents.length ? '' : 'disabled'}>${t(state.lang, 'phraseClear')}</button>
      </div>
    `;
  }

  // Build SVG content based on mode
  if (mode === 'phrase' && state.phraseEvents.length === 0) {
    bodyHtml = `<p class="empty-hint">${t(state.lang, 'phraseEmpty')}</p>`;
  } else if (mode === 'voicing' && !getActiveVoicing()) {
    bodyHtml = `<p class="empty-hint">${t(state.lang, 'voicingEmptyTab')}</p>`;
  } else {
    const svgParts = [`<svg class="notation-svg" viewBox="0 0 ${SVG_W} ${SVG_H}" role="img">`];
    svgParts.push(renderStaffAndTabBase(tuningHighToLow));

    const startX = STAFF_LEFT + 76;
    const usableW = STAFF_RIGHT - startX - 30;

    if (mode === 'voicing') {
      const v = getActiveVoicing();
      // Column 0: full stacked chord voicing
      const chordNotes = v.notes.map((n) => ({
        q: n.absQ,
        guitarStr: n.guitarStr,
        fret: n.fret,
        isMicro: n.isMicro,
        intervalQ: n.intervalQ
      }));
      svgParts.push(drawNoteColumn({ x: startX + 18, notes: chordNotes, microMode: state.microMode }));

      // Barline separator then arpeggiated breakdown of every voice in the chord
      const sepX = startX + 74;
      svgParts.push(`<line x1="${sepX}" y1="${stepToStaffY(8)}" x2="${sepX}" y2="${TAB_TOP_Y + TAB_GAP * 5}" stroke="var(--border-strong)" stroke-dasharray="3 3"/>`);

      const stepW = Math.min(92, (STAFF_RIGHT - sepX - 40) / Math.max(1, chordNotes.length));
      chordNotes.forEach((cn, idx) => {
        const cx = sepX + 44 + idx * stepW;
        svgParts.push(drawNoteColumn({ x: cx, notes: [cn], microMode: state.microMode }));
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
            microMode: state.microMode
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
            microMode: state.microMode
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
          <button type="button" class="btn-mini ${mode === 'voicing' ? 'active-mini' : ''}" data-not-mode="voicing">${t(state.lang, 'notModeVoicing')}</button>
          <button type="button" class="btn-mini ${mode === 'scale' ? 'active-mini' : ''}" data-not-mode="scale">${t(state.lang, 'notModeScale')}</button>
          <button type="button" class="btn-mini ${mode === 'phrase' ? 'active-mini' : ''}" data-not-mode="phrase">${t(state.lang, 'notModePhrase')} (${state.phraseEvents.length})</button>
        </div>
      </div>
      ${extraActions}
    </div>
    ${bodyHtml}
  `;

  panel.onclick = (e) => {
    const modeBtn = e.target.closest('button[data-not-mode]');
    if (modeBtn) {
      setState({ notationMode: modeBtn.dataset.notMode });
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
    }
  };
}
