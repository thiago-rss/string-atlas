/**
 * Phase 3 Procedural Experimental Etude Studio View
 * - Zero-thrash live playback highlighting (buttons remain 100% responsive at any BPM)
 * - Supports Loop, Auto +4 BPM tempo trainer, Guide Click, Step-by-Step, and ASCII Tab export
 */
import {
  ETUDE_GROUPINGS,
  ETUDE_PATTERNS,
  ETUDE_ZONES,
  exportEtudeToAsciiTab
} from '../core/etudeGenerator.js';
import { qToNoteName } from '../core/theory24.js';
import { t } from '../core/i18n.js';
import { getActiveScale, getState, setState } from '../state/store.js';
import { synthEngine } from '../audio/synthEngine.js';
import { highlightFretboardEtudeEvent } from './fretboardView.js';
import { highlightNotationStep } from './notationView.js';

export function renderEtudeView(state) {
  const container = document.getElementById('tabEtude');
  if (!container) return;

  const isEn = state.lang === 'en';
  const etude = state.currentEtude;
  if (!etude) return;

  const patternOptions = ETUDE_PATTERNS.map((p) => `
    <option value="${p.id}" ${p.id === state.etudePatternId ? 'selected' : ''}>
      ${isEn ? p.nameEn : p.namePt}
    </option>
  `).join('');

  const zoneOptions = Object.entries(ETUDE_ZONES).map(([id, z]) => `
    <option value="${id}" ${id === state.etudeZoneId ? 'selected' : ''}>
      ${isEn ? z.labelEn : z.labelPt}
    </option>
  `).join('');

  const groupingOptions = Object.entries(ETUDE_GROUPINGS).map(([id, g]) => `
    <option value="${id}" ${id === state.etudeGroupingId ? 'selected' : ''}>
      ${isEn ? g.labelEn : g.labelPt}
    </option>
  `).join('');

  const lengthOptions = [8, 12, 16, 24].map((len) => `
    <option value="${len}" ${len === state.etudeLength ? 'selected' : ''}>${len}</option>
  `).join('');

  const dirOptions = [
    { id: 'pendulum', key: 'dirPendulum' },
    { id: 'asc', key: 'dirAsc' },
    { id: 'desc', key: 'dirDesc' },
    { id: 'random', key: 'dirRandom' }
  ].map((d) => `
    <option value="${d.id}" ${d.id === state.etudeDirection ? 'selected' : ''}>${t(state.lang, d.key)}</option>
  `).join('');

  const stepTilesHtml = etude.events.map((ev, idx) => {
    const noteLbl = ev.kind === 'harmonic' ? `${ev.partial}º` : qToNoteName(ev.q, false);
    const fretLbl = ev.kind === 'harmonic'
      ? (ev.fretDisplay || `⟨${ev.fret}⟩`)
      : (ev.isMicro ? (state.microMode === 'bend' ? `${ev.fret}↑¼` : `${ev.fret}.5`) : `${ev.fret}`);
    const isNow = idx === state.etudeActiveIdx;

    return `
      <button
        type="button"
        class="etude-step-tile ${ev.accent ? 'is-accent' : ''} ${ev.isMicro ? 'is-micro' : ''} ${ev.kind === 'harmonic' ? 'is-harm' : ''} ${isNow ? 'is-now' : ''}"
        data-e-action="jumpStep"
        data-idx="${idx}"
      >
        <span class="etude-step-art">${ev.articulation}</span>
        <strong class="etude-step-note">${noteLbl}</strong>
        <span class="etude-step-pos">S${ev.guitarStr}·${fretLbl}</span>
      </button>
    `;
  }).join('');

  container.innerHTML = `
    <div class="panel">
      <div class="section-heading" style="flex-wrap:wrap">
        <span>${t(state.lang, 'etudeTitle')}</span>
        <span class="mono-tag">Seed #${etude.seed}</span>
      </div>

      <div class="etude-config-grid">
        <div class="control-group" style="grid-column: span 2">
          <label class="control-label" for="selEtudePattern">${t(state.lang, 'etudePatternLabel')}</label>
          <select id="selEtudePattern">${patternOptions}</select>
        </div>

        <div class="control-group">
          <label class="control-label" for="selEtudeZone">${t(state.lang, 'etudeZoneLabel')}</label>
          <select id="selEtudeZone">${zoneOptions}</select>
        </div>

        <div class="control-group">
          <label class="control-label" for="selEtudeGrouping">${t(state.lang, 'etudeGroupingLabel')}</label>
          <select id="selEtudeGrouping">${groupingOptions}</select>
        </div>

        <div class="control-group">
          <label class="control-label" for="selEtudeDir">${t(state.lang, 'etudeDirectionLabel')}</label>
          <select id="selEtudeDir">${dirOptions}</select>
        </div>

        <div class="control-group">
          <label class="control-label" for="selEtudeLen">${t(state.lang, 'etudeLengthLabel')}</label>
          <select id="selEtudeLen">${lengthOptions}</select>
        </div>
      </div>

      <div class="etude-transport-bar">
        <div class="pill-row">
          <button type="button" class="btn-primary" data-e-action="togglePlay">
            ${state.etudePlaying ? t(state.lang, 'etudeStop') : t(state.lang, 'etudePlay')}
          </button>

          <button type="button" class="btn-pill active-teal" data-e-action="regenerate">
            ${t(state.lang, 'etudeRegenerate')}
          </button>

          <label class="bpm-control">
            <span>BPM</span>
            <input type="range" id="rngEtudeBpm" min="44" max="200" step="2" value="${state.etudeBpm}" />
            <strong id="etudeBpmVal">${state.etudeBpm}</strong>
          </label>

          <button type="button" class="btn-pill ${state.etudeLoop ? 'active' : ''}" data-e-action="toggleLoop">
            ${t(state.lang, 'etudeLoop')}
          </button>

          <button type="button" class="btn-pill ${state.etudeAutoBpm ? 'active-voicing' : ''}" data-e-action="toggleAutoBpm">
            ${t(state.lang, 'etudeAutoBpm')}
          </button>

          <button type="button" class="btn-pill ${state.etudeClick ? 'active' : ''}" data-e-action="toggleClick">
            ${t(state.lang, 'etudeClick')}
          </button>
        </div>

        <div class="pill-row">
          <button type="button" class="btn-mini" data-e-action="stepPrev">${t(state.lang, 'etudeStepPrev')}</button>
          <button type="button" class="btn-mini" data-e-action="stepNext">${t(state.lang, 'etudeStepNext')}</button>
          <button type="button" class="btn-mini" data-e-action="showInTab">${t(state.lang, 'etudeShowInTab')}</button>
          <button type="button" class="btn-mini" id="btnCopyAsciiTab" data-e-action="copyTab">${t(state.lang, 'etudeCopyTab')}</button>
          <button type="button" class="btn-mini" data-e-action="downloadTab">${t(state.lang, 'etudeDownloadTab')}</button>
        </div>
      </div>

      <div class="etude-focus-banner">
        <p>${isEn ? etude.focusEn : etude.focusPt}</p>
        <div class="tag-list" style="margin:6px 0 0">
          <span class="soft-tag">${t(state.lang, 'etudeStatsNotes')}: <strong>${etude.stats.noteCount}</strong></span>
          <span class="soft-tag">${t(state.lang, 'etudeStatsMicro')}: <strong>${etude.stats.microCount}</strong></span>
          <span class="soft-tag">${t(state.lang, 'etudeStatsSkips')}: <strong>${etude.stats.stringSkips}</strong></span>
          <span class="soft-tag">${t(state.lang, 'etudeStatsHarm')}: <strong>${etude.stats.harmonicCount}</strong></span>
          <span class="soft-tag">${t(state.lang, 'etudeStatsFrets')}: <strong>${etude.stats.fretRange}</strong></span>
        </div>
      </div>

      <div class="etude-step-grid" id="etudeStepGrid">${stepTilesHtml}</div>

      <p class="mono-tag" style="margin:10px 0 0">${t(state.lang, 'etudeLegendPick')}</p>
    </div>
  `;

  // Bind select controls cleanly via direct property handlers (no listener leaks)
  container.querySelector('#selEtudePattern').onchange = (e) => {
    stopEtudePlayback();
    setState({ etudePatternId: e.target.value, etudeActiveIdx: -1, notationMode: 'etude' });
  };
  container.querySelector('#selEtudeZone').onchange = (e) => {
    stopEtudePlayback();
    setState({ etudeZoneId: e.target.value, etudeActiveIdx: -1 });
  };
  container.querySelector('#selEtudeGrouping').onchange = (e) => {
    setState({ etudeGroupingId: e.target.value });
  };
  container.querySelector('#selEtudeDir').onchange = (e) => {
    stopEtudePlayback();
    setState({ etudeDirection: e.target.value, etudeActiveIdx: -1 });
  };
  container.querySelector('#selEtudeLen').onchange = (e) => {
    stopEtudePlayback();
    setState({ etudeLength: Number(e.target.value), etudeActiveIdx: -1 });
  };

  const bpmSlider = container.querySelector('#rngEtudeBpm');
  const bpmVal = container.querySelector('#etudeBpmVal');
  bpmSlider.oninput = (e) => {
    bpmVal.textContent = e.target.value;
    setState({ etudeBpm: Number(e.target.value) });
  };

  // Delegated button actions
  container.onclick = (e) => {
    const btn = e.target.closest('button[data-e-action]');
    if (!btn) return;
    const act = btn.dataset.eAction;
    const st = getState();

    if (act === 'togglePlay') {
      toggleEtudePlayback();
    } else if (act === 'regenerate') {
      regenerateEtude();
    } else if (act === 'toggleLoop') {
      setState({ etudeLoop: !st.etudeLoop });
    } else if (act === 'toggleAutoBpm') {
      setState({ etudeAutoBpm: !st.etudeAutoBpm, etudeLoop: !st.etudeAutoBpm ? true : st.etudeLoop });
    } else if (act === 'toggleClick') {
      setState({ etudeClick: !st.etudeClick });
    } else if (act === 'stepPrev') {
      stepEtudeBy(-1);
    } else if (act === 'stepNext') {
      stepEtudeBy(1);
    } else if (act === 'jumpStep') {
      jumpToEtudeStep(Number(btn.dataset.idx));
    } else if (act === 'showInTab') {
      setState({ notationMode: 'etude' });
      document.getElementById('notationPanel')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } else if (act === 'copyTab') {
      handleCopyAsciiTab(st, btn);
    } else if (act === 'downloadTab') {
      handleDownloadAsciiTab(st);
    }
  };
}

export function highlightEtudeStep(activeIdx) {
  const grid = document.getElementById('etudeStepGrid');
  if (!grid) return;
  grid.querySelectorAll('.etude-step-tile').forEach((tile) => {
    tile.classList.toggle('is-now', Number(tile.dataset.idx) === activeIdx);
  });
}

export function syncEtudeBpmUi(bpm) {
  const slider = document.getElementById('rngEtudeBpm');
  const val = document.getElementById('etudeBpmVal');
  if (slider) slider.value = String(bpm);
  if (val) val.textContent = String(bpm);
}

export function regenerateEtude() {
  const st = getState();
  const wasPlaying = st.etudePlaying;
  stopEtudePlayback();
  setState({
    etudeSeed: st.etudeSeed + 1,
    etudeActiveIdx: -1,
    notationMode: 'etude'
  });
  if (wasPlaying) {
    toggleEtudePlayback();
  }
}

export function stopEtudePlayback() {
  synthEngine.stopEtudeSequencer();
  highlightEtudeStep(-1);
  highlightNotationStep(-1);
  highlightFretboardEtudeEvent(null);
  if (getState().etudePlaying) {
    setState({ etudePlaying: false, etudeActiveIdx: -1 });
  }
}

export function toggleEtudePlayback() {
  const st = getState();
  if (st.etudePlaying) {
    stopEtudePlayback();
    return;
  }

  // Stop any competing scale arpeggio sequence cleanly
  synthEngine.stopScaleSequence();
  setState({ isPlayingScale: false, playingPcQ: null, etudePlaying: true, notationMode: 'etude' });

  synthEngine.startEtudeSequencer(
    () => {
      const cur = getState();
      return {
        events: cur.currentEtude?.events || [],
        bpm: cur.etudeBpm,
        loop: cur.etudeLoop,
        autoBpm: cur.etudeAutoBpm,
        clickOn: cur.etudeClick
      };
    },
    {
      onStep: (idx, ev) => {
        const cur = getState();
        // Zero-thrash live DOM cursor updates across all 3 synchronized surfaces
        highlightEtudeStep(idx);
        highlightNotationStep(idx);
        highlightFretboardEtudeEvent(ev, cur.microMode);
      },
      onLoopBump: () => {
        const cur = getState();
        const nextBpm = Math.min(200, cur.etudeBpm + 4);
        if (nextBpm !== cur.etudeBpm) {
          syncEtudeBpmUi(nextBpm);
          setState({ etudeBpm: nextBpm });
        }
      },
      onComplete: () => {
        highlightEtudeStep(-1);
        highlightNotationStep(-1);
        highlightFretboardEtudeEvent(null);
        setState({ etudePlaying: false, etudeActiveIdx: -1 });
      }
    }
  );
}

function jumpToEtudeStep(idx) {
  const st = getState();
  const events = st.currentEtude?.events || [];
  if (!events.length) return;
  const clamped = ((idx % events.length) + events.length) % events.length;
  const ev = events[clamped];

  synthEngine.triggerEtudeEvent(ev, { stepDur: 0.45 });
  highlightEtudeStep(clamped);
  highlightNotationStep(clamped);
  highlightFretboardEtudeEvent(ev, st.microMode);
  setState({ etudeActiveIdx: clamped });
}

function stepEtudeBy(delta) {
  const st = getState();
  if (st.etudePlaying) stopEtudePlayback();
  const next = st.etudeActiveIdx < 0 ? 0 : st.etudeActiveIdx + delta;
  jumpToEtudeStep(next);
}

function buildAsciiForCurrentState(st) {
  const scale = getActiveScale();
  const scaleName = st.lang === 'en' ? scale.nameEn : scale.namePt;
  return exportEtudeToAsciiTab({
    etude: st.currentEtude,
    scaleName,
    rootQ: st.rootQ,
    stringsQ: st.customStringsQ,
    microMode: st.microMode
  });
}

function handleCopyAsciiTab(st, btn) {
  const ascii = buildAsciiForCurrentState(st);
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(ascii).catch(() => {});
  }
  const orig = btn.textContent;
  btn.textContent = t(st.lang, 'etudeCopiedTab');
  setTimeout(() => {
    btn.textContent = orig;
  }, 1500);
}

function handleDownloadAsciiTab(st) {
  const ascii = buildAsciiForCurrentState(st);
  const blob = new Blob([ascii], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `string-atlas-etude-seed-${st.currentEtude.seed}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
