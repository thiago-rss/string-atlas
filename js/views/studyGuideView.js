/**
 * Restructured Progressive Study Guide View v8.4
 * - 4 Progressive Levels (Foundation -> Intermediate -> Advanced -> Master) · 9 Chapters · 40 Lessons
 * - "Next Recommended Lesson" Banner guiding learners step-by-step from #01 to #40
 * - Clickable Glossary Term pills linking straight into the interactive Glossary
 * - 100% backwards-compatible localStorage progress for all 32 original lesson IDs
 */
import { DB } from '../core/database.js';
import { getGlossaryTermById } from '../core/glossary.js';
import { STUDY_LESSONS, STUDY_LEVELS, STUDY_MODULES } from '../core/studyGuide.js';
import { STUDY_DOSSIERS } from '../core/studyDossiers.js';
import { VAMP_PRESETS } from '../core/vampEngine.js';
import { t } from '../core/i18n.js';
import { getState, setState } from '../state/store.js';
import { synthEngine } from '../audio/synthEngine.js';
import { toggleEtudePlayback, stopEtudePlayback } from './etudeView.js';
import { toggleRhythmPlayback } from './rhythmView.js';
import { toggleVampPlayback, stopVampPlayback } from './vampView.js';
import { startLineMode } from './lineModeView.js';

const LEVEL_META = {
  foundation:   { pt: 'Nível 1 · Fundamentos', en: 'Level 1 · Foundation', cls: 'lvl-foundation' },
  intermediate: { pt: 'Nível 2 · Intermediário', en: 'Level 2 · Intermediate', cls: 'lvl-intermediate' },
  advanced:     { pt: 'Nível 3 · Avançado', en: 'Level 3 · Advanced', cls: 'lvl-advanced' },
  master:       { pt: 'Nível 4 · Mestre', en: 'Level 4 · Master', cls: 'lvl-master' }
};

export function renderStudyGuideView(state) {
  const container = document.getElementById('tabStudyGuide');
  if (!container) return;

  const isEn = state.lang === 'en';
  const doneSet = new Set(state.completedLessons || []);
  const totalCount = STUDY_LESSONS.length;
  const doneCount = STUDY_LESSONS.filter((l) => doneSet.has(l.id)).length;
  const pct = totalCount ? Math.round((doneCount / totalCount) * 100) : 0;

  // Find the next sequential uncompleted lesson to guide beginners immediately
  const nextRecommended = STUDY_LESSONS.find((l) => !doneSet.has(l.id)) || null;

  const levelFilter = state.studyLevelFilter || 'all';
  const visibleModules = levelFilter === 'all'
    ? STUDY_MODULES
    : STUDY_MODULES.filter((m) => m.level === levelFilter);

  const validModIds = new Set(visibleModules.map((m) => m.id));
  const activeModFilter = state.studyModuleFilter !== 'all' && validModIds.has(state.studyModuleFilter)
    ? state.studyModuleFilter
    : 'all';

  let visibleLessons = STUDY_LESSONS.filter((l) => {
    if (levelFilter !== 'all' && l.level !== levelFilter) return false;
    if (activeModFilter !== 'all' && l.moduleId !== activeModFilter) return false;
    return true;
  });

  if (state.studyStatusFilter === 'pending') {
    visibleLessons = visibleLessons.filter((l) => !doneSet.has(l.id));
  } else if (state.studyStatusFilter === 'done') {
    visibleLessons = visibleLessons.filter((l) => doneSet.has(l.id));
  }

  // Level filter strip
  const levelPills = STUDY_LEVELS.map((lv) => {
    const lvLessons = lv.id === 'all' ? STUDY_LESSONS : STUDY_LESSONS.filter((l) => l.level === lv.id);
    const lvDone = lvLessons.filter((l) => doneSet.has(l.id)).length;
    return `
      <button type="button" class="btn-pill ${levelFilter === lv.id ? 'active-teal' : ''}" data-sg-action="filterLevel" data-val="${lv.id}">
        ${isEn ? lv.labelEn : lv.labelPt} <span class="cat-count">${lvDone}/${lvLessons.length}</span>
      </button>
    `;
  }).join('');

  // Chapter rail scoped to the active level
  const chapterPills = [
    `<button type="button" class="btn-pill ${activeModFilter === 'all' ? 'active' : ''}" data-sg-action="filterMod" data-val="all">${t(state.lang, 'sgAllChapters')} (${visibleModules.reduce((acc, m) => acc + STUDY_LESSONS.filter((l) => l.moduleId === m.id).length, 0)})</button>`,
    ...visibleModules.map((m) => {
      const label = isEn ? m.titleEn : m.titlePt;
      const mLessons = STUDY_LESSONS.filter((l) => l.moduleId === m.id);
      const mDone = mLessons.filter((l) => doneSet.has(l.id)).length;
      return `
        <button type="button" class="btn-pill ${activeModFilter === m.id ? 'active' : ''}" data-sg-action="filterMod" data-val="${m.id}">
          ${label} <span class="cat-count">${mDone}/${mLessons.length}</span>
        </button>
      `;
    })
  ].join('');

  const activeChapterMeta = activeModFilter !== 'all'
    ? STUDY_MODULES.find((m) => m.id === activeModFilter)
    : null;

  const nextBannerHtml = nextRecommended ? `
    <div class="sg-next-banner">
      <div class="sg-next-info">
        <span class="control-label">${t(state.lang, 'sgNextRecommended')}</span>
        <strong>#${String(nextRecommended.number).padStart(2, '0')} · ${isEn ? nextRecommended.titleEn : nextRecommended.titlePt}</strong>
        <span class="mono-tag">${isEn ? LEVEL_META[nextRecommended.level].en : LEVEL_META[nextRecommended.level].pt} · ${nextRecommended.duration}</span>
      </div>
      <button type="button" class="btn-primary" data-sg-action="applyLesson" data-id="${nextRecommended.id}">
        ▶ ${t(state.lang, 'sgStartNextBtn')}
      </button>
    </div>
  ` : `
    <div class="sg-next-banner is-complete">
      <strong>✦ ${t(state.lang, 'sgAllCompleteBanner')}</strong>
    </div>
  `;

  const cardsHtml = visibleLessons.length === 0
    ? `<p class="empty-hint">${t(state.lang, 'sgNoFilteredLessons')}</p>`
    : visibleLessons.map((lesson) => {
        const dossier = STUDY_DOSSIERS[lesson.id];
        const isDone = doneSet.has(lesson.id);
        const isActive = state.activeLessonId === lesson.id;
        const isDossierOpen = state.openDossierLessonId === lesson.id;
        const tags = isEn ? (dossier?.tagsEn || []) : (dossier?.tagsPt || []);
        const lvlInfo = LEVEL_META[lesson.level] || LEVEL_META.foundation;

        const tunObj = DB.tunings.find((x) => x.id === lesson.preset.tuningId);
        const tunBadge = tunObj ? tunObj.short : lesson.preset.tuningId;

        const glChipsHtml = (lesson.glossaryIds || [])
          .map((gid) => getGlossaryTermById(gid))
          .filter(Boolean)
          .map((term) => `
            <button type="button" class="btn-mini gl-link-chip" data-sg-action="openGlossary" data-gid="${term.id}" title="${t(state.lang, 'sgGlossaryLinkTip')}">
              📖 ${(isEn ? term.termEn : term.termPt).split('(')[0].trim()}
            </button>
          `)
          .join('');

        const dossierHtml = isDossierOpen && dossier ? `
          <div class="sg-dossier-box">
            <div class="dossier-block">
              <h4>${t(state.lang, 'structureTitle')}</h4>
              <p>${isEn ? dossier.structureEn : dossier.structurePt}</p>
            </div>
            <div class="dossier-block">
              <h4>${t(state.lang, 'temperamentTitle')}</h4>
              <p>${isEn ? dossier.temperamentEn : dossier.temperamentPt}</p>
            </div>
            <div class="dossier-block">
              <h4>${t(state.lang, 'sgPitfallTitle')}</h4>
              <p>${isEn ? dossier.pitfallEn : dossier.pitfallPt}</p>
            </div>
            <div class="dossier-block">
              <h4>${t(state.lang, 'sgExperimentTitle')}</h4>
              <p>${isEn ? dossier.experimentEn : dossier.experimentPt}</p>
            </div>
            <div class="dossier-block" style="margin-bottom:0">
              <h4>${t(state.lang, 'repertoireTitle')}</h4>
              <p class="mono-tag" style="color:var(--text-primary)">${dossier.repertoire}</p>
            </div>
          </div>
        ` : '';

        return `
          <article class="sg-card ${isActive ? 'is-active' : ''} ${isDone ? 'is-done' : ''}">
            <div class="sg-card-top">
              <div class="sg-card-meta">
                <span class="sg-num">#${String(lesson.number).padStart(2, '0')}</span>
                <span class="sg-level-badge ${lvlInfo.cls}">${isEn ? lvlInfo.en : lvlInfo.pt}</span>
                <span class="soft-tag">${lesson.duration}</span>
                <span class="soft-tag" style="color:var(--accent-root)">${tunBadge}</span>
              </div>
              <button type="button" class="btn-mini ${isDone ? 'active-mini' : ''}" data-sg-action="toggleDone" data-id="${lesson.id}">
                ${isDone ? t(state.lang, 'sgCompleted') : t(state.lang, 'sgMarkDone')}
              </button>
            </div>

            <h3 class="sg-card-title">${isEn ? lesson.titleEn : lesson.titlePt}</h3>
            <p class="sg-card-summary">${isEn ? lesson.summaryEn : lesson.summaryPt}</p>

            <div class="sg-task-box">
              <strong>${t(state.lang, 'sgTaskLabel')}:</strong> ${isEn ? lesson.taskEn : lesson.taskPt}
            </div>
            <p class="sg-ear-tip">
              <strong>${t(state.lang, 'sgEarTipLabel')}:</strong> ${isEn ? lesson.earTipEn : lesson.earTipPt}
            </p>

            <div class="tag-list" style="margin-bottom:6px">
              ${tags.map((tg) => `<span class="soft-tag">${tg}</span>`).join('')}
            </div>

            ${glChipsHtml ? `<div class="pill-row" style="margin-bottom:8px">${glChipsHtml}</div>` : ''}

            <div class="sg-card-actions">
              <button type="button" class="btn-primary" data-sg-action="applyLesson" data-id="${lesson.id}">
                ${t(state.lang, 'sgApplyPreset')}
              </button>
              <button type="button" class="btn-ghost" data-sg-action="toggleDossier" data-id="${lesson.id}">
                ${isDossierOpen ? t(state.lang, 'sgHideDossier') : t(state.lang, 'sgShowDossier')}
              </button>
              ${lesson.suggestLivePitch ? `<button type="button" class="btn-mini" data-sg-action="openTool" data-tool="line" data-id="${lesson.id}">${t(state.lang, 'sgOpenLineMode')}</button>` : ''}
              ${lesson.suggestScala ? `<button type="button" class="btn-mini" data-sg-action="openTool" data-tool="scala" data-id="${lesson.id}">${t(state.lang, 'sgOpenScalaLab')}</button>` : ''}
              ${lesson.suggestRadar ? `<button type="button" class="btn-mini" data-sg-action="openTool" data-tool="radar" data-id="${lesson.id}">${t(state.lang, 'tabRadar')}</button>` : ''}
              ${lesson.suggestTension ? `<button type="button" class="btn-mini" data-sg-action="openTool" data-tool="tension" data-id="${lesson.id}">${t(state.lang, 'tabTension')}</button>` : ''}
              ${lesson.suggestEar ? `<button type="button" class="btn-mini" data-sg-action="openTool" data-tool="ear" data-id="${lesson.id}">${t(state.lang, 'tabEarLab')}</button>` : ''}
            </div>

            ${dossierHtml}
          </article>
        `;
      }).join('');

  container.innerHTML = `
    <div class="panel">
      <div class="section-heading" style="flex-wrap:wrap">
        <span>${t(state.lang, 'sgTitle')}</span>
        <div class="pill-row">
          <span class="mono-tag">${doneCount} / ${totalCount} ${t(state.lang, 'sgProgressUnit')} (${pct}%)</span>
          <button type="button" class="btn-mini ${state.studyStatusFilter === 'all' ? 'active-mini' : ''}" data-sg-action="filterStatus" data-val="all">${t(state.lang, 'sgFilterAll')}</button>
          <button type="button" class="btn-mini ${state.studyStatusFilter === 'pending' ? 'active-mini' : ''}" data-sg-action="filterStatus" data-val="pending">${t(state.lang, 'sgFilterPending')}</button>
          <button type="button" class="btn-mini ${state.studyStatusFilter === 'done' ? 'active-mini' : ''}" data-sg-action="filterStatus" data-val="done">${t(state.lang, 'sgFilterDone')}</button>
        </div>
      </div>

      <div class="sg-progress-track">
        <div class="sg-progress-fill" style="width:${pct}%"></div>
      </div>

      ${nextBannerHtml}

      <div class="category-bar sg-chapter-rail" style="margin-top:10px">${levelPills}</div>
      <div class="category-bar sg-chapter-rail" style="margin-top:6px">${chapterPills}</div>

      ${activeChapterMeta ? `<p class="rhythm-note">${isEn ? activeChapterMeta.descEn : activeChapterMeta.descPt}</p>` : ''}

      <div class="sg-grid">${cardsHtml}</div>
    </div>
  `;

  container.onclick = (e) => {
    const btn = e.target.closest('button[data-sg-action]');
    if (!btn) return;
    const act = btn.dataset.sgAction;
    const st = getState();

    if (act === 'filterLevel') {
      setState({ studyLevelFilter: btn.dataset.val, studyModuleFilter: 'all' });
    } else if (act === 'filterMod') {
      setState({ studyModuleFilter: btn.dataset.val });
    } else if (act === 'filterStatus') {
      setState({ studyStatusFilter: btn.dataset.val });
    } else if (act === 'toggleDone') {
      const id = btn.dataset.id;
      const cur = new Set(st.completedLessons || []);
      if (cur.has(id)) cur.delete(id);
      else cur.add(id);
      setState({ completedLessons: [...cur] });
    } else if (act === 'toggleDossier') {
      const id = btn.dataset.id;
      setState({ openDossierLessonId: st.openDossierLessonId === id ? null : id });
    } else if (act === 'openGlossary') {
      setState({
        glossaryCategory: 'all',
        glossarySearch: '',
        glossaryFocusId: btn.dataset.gid,
        activeTab: 'glossary',
        workspaceOpen: true
      });
    } else if (act === 'applyLesson') {
      applyLessonPreset(btn.dataset.id, null);
    } else if (act === 'openTool') {
      applyLessonPreset(btn.dataset.id, btn.dataset.tool);
    }
  };
}

function applyLessonPreset(lessonId, jumpTab = null) {
  const lesson = STUDY_LESSONS.find((l) => l.id === lessonId);
  if (!lesson) return;
  const p = lesson.preset;
  const st = getState();

  const tun = DB.tunings.find((item) => item.id === p.tuningId) || DB.tunings[0];
  const rhy = DB.rhythms.find((item) => item.id === p.rhythmId) || DB.rhythms[0];
  const vp = p.vampPresetId ? VAMP_PRESETS.find((v) => v.id === p.vampPresetId) : null;

  stopEtudePlayback();
  stopVampPlayback();
  synthEngine.stopScaleSequence();

  const droneFifth = (p.scaleId === 'raga_marwa' || p.scalaPresetId === 'bohlen_pierce_13') ? false : st.droneFifth;
  synthEngine.updateDrone(Boolean(p.droneOn), p.rootQ, droneFifth);

  const nextNotMode = p.voicingOverlayOn ? 'voicing' : (p.etudePatternId ? 'etude' : 'scale');

  setState({
    activeLessonId: lesson.id,
    category: 'all',
    temperamentFilter: 'all',
    scaleSearch: '',
    customScaleIntervalsQ: null,
    scaleId: p.scaleId,
    rootQ: p.rootQ,
    stringCount: tun.stringsQ.length,
    tuningId: tun.id,
    customStringsQ: [...tun.stringsQ],
    microMode: p.microMode || 'bend',
    chordId: p.chordId || st.chordId,
    harmonyMode: 'catalog',
    selectedVoicingIdx: 0,
    voicingOverlayOn: Boolean(p.voicingOverlayOn),
    rhythmId: rhy.id,
    rhythmSteps: [...rhy.steps],
    etudePatternId: p.etudePatternId || st.etudePatternId,
    etudeActiveIdx: -1,
    ...(vp ? { vampPresetId: vp.id, vampSteps: vp.steps.map((s) => ({ ...s })), vampBpm: vp.bpm, vampBeatsPerBar: vp.beatsPerBar, vampActiveStepIdx: 0 } : {}),
    scalaPresetId: p.scalaPresetId || st.scalaPresetId,
    scalaCustomText: p.scalaPresetId ? '' : st.scalaCustomText,
    scalaOverlayOn: Boolean(p.scalaOverlayOn),
    droneOn: Boolean(p.droneOn),
    droneFifth,
    harmonicsOn: Boolean(p.harmonicsOn),
    notationMode: nextNotMode,
    inspectedNote: null,
    activeTab: jumpTab || st.activeTab,
    workspaceOpen: true
  });

  if (jumpTab === 'line') {
    startLineMode();
    return;
  }

  if (!jumpTab) {
    if (lesson.audioAction === 'VOICING') {
      const v = getState().computedVoicings?.[0];
      if (v) synthEngine.strumVoicing(v);
    } else if (lesson.audioAction === 'ETUDE') {
      toggleEtudePlayback();
    } else if (lesson.audioAction === 'RHYTHM' && !getState().rhythmPlaying) {
      toggleRhythmPlayback();
    } else if (lesson.audioAction === 'VAMP') {
      toggleVampPlayback();
    }
  }
}
