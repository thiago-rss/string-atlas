/**
 * Modal & Acoustic Dossier + Oblique Creative Lab View
 */
import { DB } from '../core/database.js';
import {
  computeIntervalVector,
  formatStepFormula,
  intervalQToCents,
  intervalQToLabel,
  mod24,
  qToNoteName
} from '../core/theory24.js';
import { t } from '../core/i18n.js';
import { getActiveScale, setState } from '../state/store.js';
import { synthEngine } from '../audio/synthEngine.js';

export function renderDossierAndOblique(state) {
  renderDossier(state);
  renderOblique(state);
}

function renderDossier(state) {
  const el = document.getElementById('dossierPanel');
  if (!el) return;

  const scale = getActiveScale();
  const isEn = state.lang === 'en';
  const tags = isEn ? scale.tagsEn : scale.tagsPt;
  const ivVec = computeIntervalVector(scale.intervalsQ);
  const stepFormula = formatStepFormula(scale.intervalsQ);

  const degreeChips = scale.intervalsQ.map((iv) => {
    const absQ = 96 + mod24(state.rootQ + iv);
    const note = qToNoteName(absQ, false);
    const deg = intervalQToLabel(iv);
    const cents = intervalQToCents(iv);
    const isMicro = iv % 2 !== 0;
    const isRoot = iv === 0;
    return `
      <button type="button" class="degree-chip ${isRoot ? 'is-root' : ''} ${isMicro ? 'is-micro' : ''}" data-play-q="${absQ}">
        ${deg} · ${note} (${cents}¢)
      </button>
    `;
  }).join('');

  const vecBadge = ivVec
    ? `<span class="soft-tag">${t(state.lang, 'intervalVector')}: &lt;${ivVec.join('')}&gt;</span>`
    : `<span class="soft-tag" style="color:var(--accent-micro)">${t(state.lang, 'microtonalSet')}</span>`;

  el.innerHTML = `
    <div class="section-heading">
      <span>${t(state.lang, 'dossierTitle')}</span>
      <span class="mono-tag">${stepFormula}</span>
    </div>

    <div class="tag-list">
      ${tags.map((tag) => `<span class="soft-tag">${tag}</span>`).join('')}
      ${vecBadge}
    </div>

    <div class="dossier-block">
      <h4>${t(state.lang, 'formulaTitle')}</h4>
      <div class="degree-pills">${degreeChips}</div>
    </div>

    <div class="dossier-block">
      <h4>${t(state.lang, 'structureTitle')}</h4>
      <p>${isEn ? scale.dossier.structureEn : scale.dossier.structurePt}</p>
    </div>

    <div class="dossier-block">
      <h4>${t(state.lang, 'temperamentTitle')}</h4>
      <p>${isEn ? scale.dossier.temperamentEn : scale.dossier.temperamentPt}</p>
    </div>

    <div class="dossier-block">
      <h4>${t(state.lang, 'articulationTitle')}</h4>
      <p>${isEn ? scale.dossier.articulationEn : scale.dossier.articulationPt}</p>
    </div>

    <div class="dossier-block" style="margin-bottom:0">
      <h4>${t(state.lang, 'repertoireTitle')}</h4>
      <p class="mono-tag" style="color:var(--text-primary)">${scale.dossier.repertoire}</p>
    </div>
  `;

  el.querySelectorAll('button[data-play-q]').forEach((btn) => {
    btn.addEventListener('click', () => {
      synthEngine.pluckQ(Number(btn.dataset.playQ), { duration: 1.5, velocity: 0.35 });
    });
  });
}

function renderOblique(state) {
  const el = document.getElementById('obliquePanel');
  if (!el) return;

  const card = DB.obliqueStrategies[state.obliqueIndex % DB.obliqueStrategies.length];
  const isEn = state.lang === 'en';

  el.innerHTML = `
    <div class="section-heading">
      <span>${t(state.lang, 'obliqueTitle')}</span>
      <span class="mono-tag">#${state.obliqueIndex + 1} / ${DB.obliqueStrategies.length}</span>
    </div>

    <div class="oblique-card">
      <h3 class="oblique-title">${isEn ? card.titleEn : card.titlePt}</h3>
      <p class="oblique-prompt">${isEn ? card.promptEn : card.promptPt}</p>
      <p class="oblique-constraint">${isEn ? card.constraintEn : card.constraintPt}</p>

      <div class="oblique-actions">
        <button type="button" class="btn-primary" id="btnApplyOblique">${t(state.lang, 'obliqueApply')}</button>
        <button type="button" class="btn-ghost" id="btnDrawOblique">${t(state.lang, 'obliqueDraw')}</button>
      </div>
    </div>
  `;

  el.querySelector('#btnDrawOblique').addEventListener('click', () => {
    const nextIdx = (state.obliqueIndex + 1) % DB.obliqueStrategies.length;
    setState({ obliqueIndex: nextIdx });
  });

  el.querySelector('#btnApplyOblique').addEventListener('click', () => {
    const p = card.preset;
    const tun = DB.tunings.find((item) => item.id === p.tuningId) || DB.tunings[0];
    synthEngine.stopScaleSequence();
    synthEngine.updateDrone(p.droneOn, p.rootQ, state.droneFifth);

    setState({
      category: 'all',
      scaleId: p.scaleId,
      rootQ: p.rootQ,
      tuningId: tun.id,
      customStringsQ: [...tun.stringsQ],
      microMode: p.microMode,
      droneOn: p.droneOn,
      harmonicsOn: p.harmonicsOn,
      isPlayingScale: false,
      playingPcQ: null,
      inspectedNote: null
    });
  });
}
