/**
 * Phase 6 24-TET Ear Training & Microtonal Interval Trainer View
 */
import { DB } from '../core/database.js';
import { MICRO_INTERVAL_SETS, createEarQuestion } from '../core/earTrainer.js';
import { qToNoteName } from '../core/theory24.js';
import { t } from '../core/i18n.js';
import { getState, setState } from '../state/store.js';
import { synthEngine } from '../audio/synthEngine.js';

function ensureQuestion(state) {
  if (state.earQuestion) return state.earQuestion;
  const q = createEarQuestion({
    mode: state.earMode,
    intervalSetId: state.earIntervalSet,
    scalePool: state.earScalePool,
    rootQ: state.rootQ,
    scales: DB.scales,
    chords: DB.chords
  });
  state.earQuestion = q;
  return q;
}

export function renderEarLabView(state) {
  const container = document.getElementById('tabEarLab');
  if (!container) return;

  const isEn = state.lang === 'en';
  const q = ensureQuestion(state);
  const answered = Boolean(state.earSelectedId);
  const isCorrect = answered && state.earSelectedId === q.answerId;

  const stats = state.earStats || { correct: 0, total: 0, streak: 0, bestStreak: 0 };
  const accPct = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;

  const subSelectorHtml = state.earMode === 'micro_intervals'
    ? `
      <div class="pill-row">
        ${MICRO_INTERVAL_SETS.map((ms) => `
          <button type="button" class="btn-mini ${state.earIntervalSet === ms.id ? 'active-mini' : ''}" data-ear-action="setIntSet" data-val="${ms.id}">
            ${isEn ? ms.labelEn : ms.labelPt}
          </button>
        `).join('')}
      </div>
    `
    : state.earMode === 'scales_modes'
      ? `
        <div class="pill-row">
          ${[
            { id: 'arabic', pt: 'Maqamat', en: 'Maqamat' },
            { id: 'greek', pt: 'Gregos', en: 'Greek' },
            { id: 'messiaen', pt: 'Messiaen', en: 'Messiaen' },
            { id: 'global', pt: 'Global & Ragas', en: 'Global & Ragas' },
            { id: 'all', pt: 'Tudo (74)', en: 'All (74)' }
          ].map((pool) => `
            <button type="button" class="btn-mini ${state.earScalePool === pool.id ? 'active-mini' : ''}" data-ear-action="setScalePool" data-val="${pool.id}">
              ${isEn ? pool.en : pool.pt}
            </button>
          `).join('')}
        </div>
      `
      : '';

  const choicesHtml = q.choices.map((ch) => {
    let cls = 'ear-choice-btn';
    if (answered) {
      if (ch.id === q.answerId) cls += ' is-correct';
      else if (ch.id === state.earSelectedId) cls += ' is-wrong';
    }
    return `
      <button type="button" class="${cls}" data-ear-action="answer" data-id="${ch.id}">
        <span>${isEn ? ch.labelEn : ch.labelPt}</span>
        ${answered ? `<span class="mono-tag">▶</span>` : ''}
      </button>
    `;
  }).join('');

  const inspectBtnHtml = answered && (q.inspectScaleId || q.inspectChordId)
    ? `<button type="button" class="btn-pill active-teal" data-ear-action="inspectAnswer">${t(state.lang, 'earInspectNeck')}</button>`
    : '';

  container.innerHTML = `
    <div class="panel">
      <div class="section-heading" style="flex-wrap:wrap">
        <span>${t(state.lang, 'earTitle')}</span>
        <div class="pill-row">
          <span class="soft-tag">${t(state.lang, 'earAccuracy')}: <strong>${accPct}%</strong> (${stats.correct}/${stats.total})</span>
          <span class="soft-tag" style="color:var(--accent-root)">${t(state.lang, 'earStreak')}: <strong>${stats.streak}</strong> (Max ${stats.bestStreak})</span>
          <button type="button" class="btn-mini" data-ear-action="resetStats">${t(state.lang, 'retunerReset')}</button>
        </div>
      </div>

      <div class="ear-controls-row">
        <div class="pill-row">
          <button type="button" class="btn-pill ${state.earMode === 'micro_intervals' ? 'active' : ''}" data-ear-action="setMode" data-val="micro_intervals">${t(state.lang, 'earModeMicro')}</button>
          <button type="button" class="btn-pill ${state.earMode === 'scales_modes' ? 'active' : ''}" data-ear-action="setMode" data-val="scales_modes">${t(state.lang, 'earModeScales')}</button>
          <button type="button" class="btn-pill ${state.earMode === 'chord_colors' ? 'active' : ''}" data-ear-action="setMode" data-val="chord_colors">${t(state.lang, 'earModeChords')}</button>
        </div>
        ${subSelectorHtml}
      </div>

      <div class="ear-stage-box">
        <div class="ear-prompt-bar">
          <button type="button" class="btn-primary" data-ear-action="playPrompt">${t(state.lang, 'earPlayPrompt')}</button>
          <button type="button" class="btn-pill" data-ear-action="playRoot">${t(state.lang, 'earPlayRoot')} (${qToNoteName(q.rootQ, false)})</button>
          <button type="button" class="btn-pill active-teal" data-ear-action="nextQuestion">${t(state.lang, 'earNextQuestion')}</button>
          ${inspectBtnHtml}
        </div>

        ${answered ? `
          <div class="ear-feedback ${isCorrect ? 'is-correct' : 'is-wrong'}">
            ${isCorrect ? t(state.lang, 'earFeedbackOk') : t(state.lang, 'earFeedbackWrong')}
            <span class="mono-tag">${t(state.lang, 'earAuditionTip')}</span>
          </div>
        ` : `<p class="empty-hint" style="margin:0">${t(state.lang, 'earPromptHint')}</p>`}

        <div class="ear-choices-grid">${choicesHtml}</div>
      </div>
    </div>
  `;

  container.onclick = (e) => {
    const btn = e.target.closest('button[data-ear-action]');
    if (!btn) return;
    const act = btn.dataset.earAction;
    const st = getState();
    const curQ = ensureQuestion(st);

    if (act === 'playPrompt') {
      synthEngine.playEarPrompt(curQ.answerPlaySpec);
    } else if (act === 'playRoot') {
      synthEngine.pluckQ(curQ.baseQ, { duration: 1.5, velocity: 0.35 });
    } else if (act === 'setMode') {
      spawnNextQuestion({ earMode: btn.dataset.val });
    } else if (act === 'setIntSet') {
      spawnNextQuestion({ earIntervalSet: btn.dataset.val });
    } else if (act === 'setScalePool') {
      spawnNextQuestion({ earScalePool: btn.dataset.val });
    } else if (act === 'nextQuestion') {
      spawnNextQuestion({}, true);
    } else if (act === 'resetStats') {
      setState({ earStats: { correct: 0, total: 0, streak: 0, bestStreak: 0 } });
    } else if (act === 'inspectAnswer') {
      if (curQ.inspectScaleId) {
        setState({
          category: 'all',
          temperamentFilter: 'all',
          scaleSearch: '',
          customScaleIntervalsQ: null,
          scaleId: curQ.inspectScaleId,
          rootQ: curQ.rootQ
        });
      } else if (curQ.inspectChordId) {
        setState({
          harmonyMode: 'catalog',
          chordId: curQ.inspectChordId,
          rootQ: curQ.rootQ,
          voicingOverlayOn: true,
          activeTab: 'harmony'
        });
      }
    } else if (act === 'answer') {
      const choiceId = btn.dataset.id;
      const choiceObj = curQ.choices.find((c) => c.id === choiceId);

      // If already answered, clicking any choice auditions it for ear comparison!
      if (st.earSelectedId) {
        if (choiceObj) synthEngine.playEarPrompt(choiceObj.playSpec);
        return;
      }

      const ok = choiceId === curQ.answerId;
      const prev = st.earStats || { correct: 0, total: 0, streak: 0, bestStreak: 0 };
      const nextStreak = ok ? prev.streak + 1 : 0;
      const nextStats = {
        correct: prev.correct + (ok ? 1 : 0),
        total: prev.total + 1,
        streak: nextStreak,
        bestStreak: Math.max(prev.bestStreak, nextStreak)
      };
      setState({ earSelectedId: choiceId, earStats: nextStats });
    }
  };
}

function spawnNextQuestion(overrides = {}, autoPlay = false) {
  const st = getState();
  const mode = overrides.earMode || st.earMode;
  const intervalSetId = overrides.earIntervalSet || st.earIntervalSet;
  const scalePool = overrides.earScalePool || st.earScalePool;

  // Gently vary root across common guitar keys (C, D, E, G, A, B) for authentic relative-pitch training
  const guitarRoots = [0, 4, 8, 14, 18, 22];
  const nextRootQ = guitarRoots[Math.floor(Math.random() * guitarRoots.length)];

  const nextQ = createEarQuestion({
    mode,
    intervalSetId,
    scalePool,
    rootQ: nextRootQ,
    scales: DB.scales,
    chords: DB.chords
  });

  setState({
    ...overrides,
    earQuestion: nextQ,
    earSelectedId: null
  });

  if (autoPlay) {
    synthEngine.playEarPrompt(nextQ.answerPlaySpec);
  }
}
