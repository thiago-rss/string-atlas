/**
 * Phase 2 Universal Rhythm & Polymeter View
 * - Track A: Arabic Iqa'at (Maqsum, Sama'i Thaqil, Jurjina, Aqsaq, Malfuf...) & Aksak odd meters
 * - Track B: Independent Polymetric Pulse with LCM convergence calculation
 * - Zero-thrash live step highlighting via highlightRhythmStep()
 */
import { DB } from '../core/database.js';
import { lcm } from '../core/theory24.js';
import { t } from '../core/i18n.js';
import { getActiveRhythm, getState, setState } from '../state/store.js';
import { rhythmEngine } from '../audio/rhythmEngine.js';

const HIT_CYCLE = ['D', 'T', 'K', '-'];
const POLY_CHOICES = [3, 4, 5, 6, 7, 9, 11];

export function renderRhythmView(state) {
  const container = document.getElementById('tabRhythm');
  if (!container) return;

  const isEn = state.lang === 'en';
  const activeRhythm = getActiveRhythm();

  const filteredRhythms = state.rhythmFilter === 'all'
    ? DB.rhythms
    : DB.rhythms.filter((r) => r.family === state.rhythmFilter);

  const mainLen = state.rhythmSteps.length;
  const polyConvergence = lcm(mainLen, state.polyLength);

  container.innerHTML = `
    <div class="panel">
      <div class="section-heading" style="flex-wrap:wrap">
        <span>${t(state.lang, 'rhythmTitle')}</span>
        <div class="pill-row">
          <button type="button" class="btn-mini ${state.rhythmFilter === 'all' ? 'active-mini' : ''}" data-r-action="filter" data-val="all">${t(state.lang, 'rhythmFilterAll')}</button>
          <button type="button" class="btn-mini ${state.rhythmFilter === 'iqa' ? 'active-mini' : ''}" data-r-action="filter" data-val="iqa">${t(state.lang, 'rhythmFilterIqa')}</button>
          <button type="button" class="btn-mini ${state.rhythmFilter === 'aksak' ? 'active-mini' : ''}" data-r-action="filter" data-val="aksak">${t(state.lang, 'rhythmFilterAksak')}</button>
        </div>
      </div>

      <div class="rhythm-top-bar">
        <button type="button" class="btn-primary" data-r-action="togglePlay">
          ${state.rhythmPlaying ? t(state.lang, 'rhythmStop') : t(state.lang, 'rhythmPlay')}
        </button>

        <label class="bpm-control">
          <span>BPM</span>
          <input type="range" id="rngRhythmBpm" min="48" max="200" step="2" value="${state.rhythmBpm}" />
          <strong id="rhythmBpmVal">${state.rhythmBpm}</strong>
        </label>

        <div class="control-group" style="flex:1;min-width:220px">
          <select id="selRhythm" aria-label="${t(state.lang, 'rhythmSelectLabel')}">
            ${filteredRhythms.map((r) => `
              <option value="${r.id}" ${r.id === state.rhythmId ? 'selected' : ''}>
                ${r.meter} · ${isEn ? r.nameEn : r.namePt} (${r.grouping})
              </option>
            `).join('')}
          </select>
        </div>

        <button type="button" class="btn-mini" data-r-action="resetPattern">${t(state.lang, 'rhythmResetPattern')}</button>
      </div>

      <p class="rhythm-note">${isEn ? activeRhythm.noteEn : activeRhythm.notePt}</p>

      <div class="rhythm-track-block">
        <div class="rhythm-track-head">
          <span class="control-label">${t(state.lang, 'rhythmSelectLabel')} · ${activeRhythm.meter} (${activeRhythm.grouping})</span>
          <span class="mono-tag">${t(state.lang, 'rhythmEditHint')}</span>
        </div>
        <div class="step-grid" id="mainStepGrid">
          ${state.rhythmSteps.map((hit, idx) => `
            <button type="button" class="step-cell hit-${hit === '-' ? 'rest' : hit}" data-r-action="cycleStep" data-idx="${idx}" data-main-step="${idx}">
              <span class="step-num">${idx + 1}</span>
              <span class="step-glyph">${hit}</span>
            </button>
          `).join('')}
        </div>
      </div>

      <div class="rhythm-track-block poly-block">
        <div class="rhythm-track-head" style="flex-wrap:wrap;gap:8px">
          <div class="pill-row">
            <button type="button" class="btn-pill ${state.polyEnabled ? 'active-teal' : ''}" data-r-action="togglePoly">
              ${state.polyEnabled ? t(state.lang, 'polyActive') : t(state.lang, 'polyEnable')}
            </button>
            <span class="control-label" style="align-self:center">${t(state.lang, 'polyCycleLen')}:</span>
            ${POLY_CHOICES.map((len) => `
              <button type="button" class="btn-mini ${state.polyLength === len ? 'active-mini' : ''}" data-r-action="setPolyLen" data-val="${len}">${len}</button>
            `).join('')}
          </div>
          <span class="soft-tag">${t(state.lang, 'polyConvergence')}: <strong>${polyConvergence} ${t(state.lang, 'polyStepsUnit')}</strong> (${mainLen} × ${state.polyLength})</span>
        </div>

        <div class="step-grid poly-grid ${state.polyEnabled ? '' : 'is-disabled'}" id="polyStepGrid">
          ${Array.from({ length: state.polyLength }, (_, idx) => `
            <div class="step-cell poly-cell ${idx === 0 ? 'poly-accent' : ''}" data-poly-step="${idx}">
              <span class="step-num">${idx + 1}</span>
              <span class="step-glyph">${idx === 0 ? '●' : '·'}</span>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  const selRhythm = container.querySelector('#selRhythm');
  if (selRhythm) {
    selRhythm.onchange = (e) => {
      const r = DB.rhythms.find((item) => item.id === e.target.value) || DB.rhythms[0];
      setState({ rhythmId: r.id, rhythmSteps: [...r.steps] });
      updateRhythmBadge(getState());
    };
  }

  const bpmSlider = container.querySelector('#rngRhythmBpm');
  const bpmVal = container.querySelector('#rhythmBpmVal');
  if (bpmSlider) {
    bpmSlider.oninput = (e) => {
      bpmVal.textContent = e.target.value;
      setState({ rhythmBpm: Number(e.target.value) });
    };
  }

  container.onclick = (e) => {
    const btn = e.target.closest('button[data-r-action]');
    if (!btn) return;
    const act = btn.dataset.rAction;

    if (act === 'togglePlay') {
      toggleRhythmPlayback();
    } else if (act === 'filter') {
      const fam = btn.dataset.val;
      const list = fam === 'all' ? DB.rhythms : DB.rhythms.filter((r) => r.family === fam);
      const keep = list.some((r) => r.id === state.rhythmId);
      const nextR = keep ? getActiveRhythm() : list[0];
      setState({
        rhythmFilter: fam,
        rhythmId: nextR.id,
        rhythmSteps: keep ? state.rhythmSteps : [...nextR.steps]
      });
    } else if (act === 'resetPattern') {
      const r = getActiveRhythm();
      setState({ rhythmSteps: [...r.steps] });
    } else if (act === 'cycleStep') {
      const idx = Number(btn.dataset.idx);
      const updated = [...state.rhythmSteps];
      const curPos = HIT_CYCLE.indexOf(updated[idx]);
      updated[idx] = HIT_CYCLE[(curPos + 1) % HIT_CYCLE.length];
      setState({ rhythmSteps: updated });
    } else if (act === 'togglePoly') {
      setState({ polyEnabled: !state.polyEnabled });
    } else if (act === 'setPolyLen') {
      setState({ polyLength: Number(btn.dataset.val), polyEnabled: true });
    }
  };

  updateRhythmBadge(state);
}

/**
 * Lightweight live LED highlight — avoids full DOM re-rendering on every beat tick.
 */
export function highlightRhythmStep(mainStep, polyStep) {
  const mainGrid = document.getElementById('mainStepGrid');
  if (mainGrid) {
    mainGrid.querySelectorAll('.step-cell').forEach((el) => {
      el.classList.toggle('is-now', Number(el.dataset.mainStep) === mainStep);
    });
  }
  const polyGrid = document.getElementById('polyStepGrid');
  if (polyGrid) {
    polyGrid.querySelectorAll('.poly-cell').forEach((el) => {
      el.classList.toggle('is-now', Number(el.dataset.polyStep) === polyStep);
    });
  }
}

export function updateRhythmBadge(state) {
  const badge = document.getElementById('rhythmStatusBadge');
  if (!badge) return;
  if (!state.rhythmPlaying) {
    badge.hidden = true;
    return;
  }
  const r = getActiveRhythm();
  badge.hidden = false;
  badge.textContent = state.polyEnabled
    ? `♪ ${r.meter} + ${state.polyLength} · ${state.rhythmBpm} BPM`
    : `♪ ${r.meter} · ${state.rhythmBpm} BPM`;
}

export function toggleRhythmPlayback() {
  const st = getState();
  if (st.rhythmPlaying) {
    rhythmEngine.stop();
    highlightRhythmStep(-1, -1);
    setState({ rhythmPlaying: false });
    updateRhythmBadge(getState());
    return;
  }

  setState({ rhythmPlaying: true });
  updateRhythmBadge(getState());

  rhythmEngine.start(
    () => {
      const cur = getState();
      const r = getActiveRhythm();
      return {
        steps: cur.rhythmSteps,
        subdivision: r.subdivision,
        bpm: cur.rhythmBpm,
        polyEnabled: cur.polyEnabled,
        polyLength: cur.polyLength
      };
    },
    (mainStep, polyStep) => {
      highlightRhythmStep(mainStep, polyStep);
    }
  );
}
