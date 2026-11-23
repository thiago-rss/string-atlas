/**
 * Complete Progressive Experimental Study Guide View v8.0 (8 Chapters · 32 Bilingual Lessons)
 * - Persistent completion progress in localStorage (100% backwards-compatible with v4–v7 IDs)
 * - Chapter horizontal pill rail + status filter (All / Pending / Completed)
 * - 1-click "Load Lesson Preset" (including Scala .scl projection for Ch. 7!) + quick lab jumps
 */
import { DB } from '../core/database.js';
import { STUDY_LESSONS, STUDY_MODULES } from '../core/studyGuide.js';
import { STUDY_DOSSIERS } from '../core/studyDossiers.js';
import { VAMP_PRESETS } from '../core/vampEngine.js';
import { t } from '../core/i18n.js';
import { getState, setState } from '../state/store.js';
import { synthEngine } from '../audio/synthEngine.js';
import { toggleEtudePlayback, stopEtudePlayback } from './etudeView.js';
import { toggleRhythmPlayback } from './rhythmView.js';
import { toggleVampPlayback, stopVampPlayback } from './vampView.js';
import { startLineMode } from './lineModeView.js';

export function renderStudyGuideView(state) {
  const container = document.getElementById('tabStudyGuide');
  if (!container) return;

  const isEn = state.lang === 'en';
  const doneSet = new Set(state.completedLessons || []);
  const totalCount = STUDY_LESSONS.length;
  const doneCount = STUDY_LESSONS.filter((l) => doneSet.has(l.id)).length;
  const pct = totalCount ? Math.round((doneCount / totalCount) * 100) : 0;

  let visibleLessons = state.studyModuleFilter === 'all'
    ? STUDY_LESSONS
    : STUDY_LESSONS.filter((l) => l.moduleId === state.studyModuleFilter);

  if (state.studyStatusFilter === 'pending') {
    visibleLessons = visibleLessons.filter((l) => !doneSet.has(l.id));
  } else if (state.studyStatusFilter === 'done') {
    visibleLessons = visibleLessons.filter((l) => doneSet.has(l.id));
  }

  const chapterPills = [
    `<button type="button" class="btn-pill ${state.studyModuleFilter === 'all' ? 'active' : ''}" data-sg-action="filterMod" data-val="all">${t(state.lang, 'sgAllChapters')} (${totalCount})</button>`,
    ...STUDY_MODULES.map((m) => {
      const label = isEn ? m.titleEn : m.titlePt;
      const mLessons = STUDY_LESSONS.filter((l) => l.moduleId === m.id);
      const mDone = mLessons.filter((l) => doneSet.has(l.id)).length;
      return `
        <button type="button" class="btn-pill ${state.studyModuleFilter === m.id ? 'active' : ''}" data-sg-action="filterMod" data-val="${m.id}">
          ${label} <span class="cat-count">${mDone}/${mLessons.length}</span>
        </button>
      `;
    })
  ].join('');

  const activeChapterMeta = state.studyModuleFilter !== 'all'
    ? STUDY_MODULES.find((m) => m.id === state.studyModuleFilter)
    : null;

  const cardsHtml = visibleLessons.length === 0
    ? `<p class="empty-hint">${t(state.lang, 'sgNoFilteredLessons')}</p>`
    : visibleLessons.map((lesson) => {
        const dossier = STUDY_DOSSIERS[lesson.id];
        const isDone = doneSet.has(lesson.id);
        const isActive = state.activeLessonId === lesson.id;
        const isDossierOpen = state.openDossierLessonId === lesson.id;
        const tags = isEn ? (dossier?.tagsEn || []) : (dossier?.tagsPt || []);

        const tunObj = DB.tunings.find((x) => x.id === lesson.preset.tuningId);
        const tunBadge = tunObj ? tunObj.short : lesson.preset.tuningId;

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
                <span class="soft-tag">${lesson.duration}</span>
                <span class="soft-tag" style="color:var(--accent-root)">${tunBadge}</span>
                <span class="soft-tag">${lesson.glossaryTerm}</span>
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

            <div class="tag-list" style="margin-bottom:10px">
              ${tags.map((tg) => `<span class="soft-tag">${tg}</span>`).join('')}
            </div>

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

      <div class="category-bar sg-chapter-rail" style="margin-top:12px">${chapterPills}</div>

      ${activeChapterMeta ? `<p class="rhythm-note">${isEn ? activeChapterMeta.descEn : activeChapterMeta.descPt}</p>` : ''}

      <div class="sg-grid">${cardsHtml}</div>
    </div>
  `;

  container.onclick = (e) => {
    const btn = e.target.closest('button[data-sg-action]');
    if (!btn) return;
    const act = btn.dataset.sgAction;
    const st = getState();

    if (act === 'filterMod') {
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
