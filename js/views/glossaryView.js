/**
 * Interactive Technical & Theoretical Glossary View (PT/EN) — v8.4
 * - Live search across 39 terms, symbols, definitions & guitar tips (zero-thrash input)
 * - Category filter rail with live counts
 * - Built-in Web Audio acoustic demonstrations (e.g., 100c vs 150c, 5/4 vs 12-TET, 53-TET vs 24-TET)
 * - Direct jump buttons into matching tools, scales, or Scala (.scl) presets
 */
import { GLOSSARY_CATEGORIES, GLOSSARY_TERMS } from '../core/glossary.js';
import { t } from '../core/i18n.js';
import { getState, setState } from '../state/store.js';
import { synthEngine } from '../audio/synthEngine.js';

function getFilteredTerms(state) {
  const q = (state.glossarySearch || '').trim().toLowerCase();
  return GLOSSARY_TERMS.filter((item) => {
    if (state.glossaryCategory !== 'all' && item.category !== state.glossaryCategory) return false;
    if (q) {
      const hay = [
        item.termPt,
        item.termEn,
        item.symbol,
        item.defPt,
        item.defEn,
        item.guitarTipPt,
        item.guitarTipEn
      ].join(' ').toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

function buildGlossaryCardsHtml(terms, state) {
  if (!terms.length) {
    return `
      <div class="atlas-empty">
        <p class="empty-hint">${t(state.lang, 'glNoMatches')}</p>
        <button type="button" class="btn-mini" data-gl-action="clear">${t(state.lang, 'clearFilters')}</button>
      </div>
    `;
  }

  const isEn = state.lang === 'en';
  const catMap = new Map(GLOSSARY_CATEGORIES.map((c) => [c.id, isEn ? c.labelEn : c.labelPt]));

  return `
    <div class="glossary-grid">
      ${terms.map((item) => {
        const isFocused = state.glossaryFocusId === item.id;
        return `
          <article class="gl-card ${isFocused ? 'is-focused' : ''}" id="gl-term-${item.id}">
            <div class="gl-card-head">
              <span class="soft-tag" style="color:var(--accent-root)">${item.symbol}</span>
              <span class="mono-tag">${catMap.get(item.category) || ''}</span>
            </div>
            <h3 class="gl-card-title">${isEn ? item.termEn : item.termPt}</h3>
            <p class="gl-card-def">${isEn ? item.defEn : item.defPt}</p>
            <div class="gl-tip-box">
              <strong>${t(state.lang, 'glGuitarTipLabel')}:</strong> ${isEn ? item.guitarTipEn : item.guitarTipPt}
            </div>
            ${(item.audioDemo || item.jumpAction) ? `
              <div class="pill-row" style="margin-top:4px">
                ${item.audioDemo ? `<button type="button" class="btn-mini active-mini" data-gl-action="audition" data-id="${item.id}">▶ ${t(state.lang, 'glAuditionBtn')}</button>` : ''}
                ${item.jumpAction ? `<button type="button" class="btn-mini" data-gl-action="jump" data-id="${item.id}">${t(state.lang, 'glExploreBtn')} →</button>` : ''}
              </div>
            ` : ''}
          </article>
        `;
      }).join('')}
    </div>
  `;
}

export function refreshGlossaryListInPlace(state) {
  const filtered = getFilteredTerms(state);
  const body = document.getElementById('glossaryListBody');
  if (body) {
    body.innerHTML = buildGlossaryCardsHtml(filtered, state);
  }
  const countEl = document.getElementById('glossaryMatchCount');
  if (countEl) {
    countEl.textContent = `${filtered.length} ${t(state.lang, 'glTermsUnit')}`;
  }
}

export function renderGlossaryView(state) {
  const container = document.getElementById('tabGlossary');
  if (!container) return;

  const isEn = state.lang === 'en';
  const filtered = getFilteredTerms(state);

  const catPills = GLOSSARY_CATEGORIES.map((c) => {
    const cnt = c.id === 'all'
      ? GLOSSARY_TERMS.length
      : GLOSSARY_TERMS.filter((x) => x.category === c.id).length;
    return `
      <button type="button" class="btn-pill ${state.glossaryCategory === c.id ? 'active' : ''}" data-gl-action="cat" data-val="${c.id}">
        ${isEn ? c.labelEn : c.labelPt} <span class="cat-count">${cnt}</span>
      </button>
    `;
  }).join('');

  container.innerHTML = `
    <div class="panel">
      <div class="section-heading" style="flex-wrap:wrap">
        <span>${t(state.lang, 'glTitle')}</span>
        <span class="mono-tag" id="glossaryMatchCount">${filtered.length} ${t(state.lang, 'glTermsUnit')}</span>
      </div>

      <div class="category-bar sg-chapter-rail">${catPills}</div>

      <div class="filter-toolbar" style="margin-top:8px">
        <div class="search-wrap">
          <input
            type="search"
            id="inpGlossarySearch"
            class="search-input"
            placeholder="${t(state.lang, 'glSearchPlaceholder')}"
            value="${(state.glossarySearch || '').replace(/"/g, '&quot;')}"
            autocomplete="off"
          />
        </div>
      </div>

      <div id="glossaryListBody">
        ${buildGlossaryCardsHtml(filtered, state)}
      </div>
    </div>
  `;

  const searchInp = container.querySelector('#inpGlossarySearch');
  if (searchInp) {
    searchInp.oninput = (e) => {
      setState({ glossarySearch: e.target.value, glossaryFocusId: null });
    };
  }

  container.onclick = (e) => {
    const btn = e.target.closest('button[data-gl-action]');
    if (!btn) return;
    const act = btn.dataset.glAction;

    if (act === 'cat') {
      setState({ glossaryCategory: btn.dataset.val, glossaryFocusId: null });
    } else if (act === 'clear') {
      setState({ glossaryCategory: 'all', glossarySearch: '', glossaryFocusId: null });
    } else if (act === 'audition') {
      const term = GLOSSARY_TERMS.find((x) => x.id === btn.dataset.id);
      if (term?.audioDemo) playGlossaryAudioDemo(term.audioDemo);
    } else if (act === 'jump') {
      const term = GLOSSARY_TERMS.find((x) => x.id === btn.dataset.id);
      if (term?.jumpAction) executeGlossaryJump(term.jumpAction);
    }
  };

  if (state.glossaryFocusId && state.activeTab === 'glossary' && state.workspaceOpen) {
    requestAnimationFrame(() => {
      const el = document.getElementById(`gl-term-${state.glossaryFocusId}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }
}

function playGlossaryAudioDemo(demo) {
  if (demo.type === 'interval') {
    synthEngine.playEarPrompt(demo);
    return;
  }
  if (demo.type === 'pair_compare') {
    // Play root + pitch A (pause) root + pitch B so learner hears microtonal difference clearly!
    const ctx = synthEngine.ensureContext();
    const now = ctx.currentTime + 0.03;
    synthEngine.pluckFreq(demo.baseHz, { duration: 1.3, velocity: 0.3, when: now });
    synthEngine.pluckFreq(demo.hzA, { duration: 1.3, velocity: 0.32, when: now + 0.25 });
    synthEngine.pluckFreq(demo.baseHz, { duration: 1.5, velocity: 0.3, when: now + 1.5 });
    synthEngine.pluckFreq(demo.hzB, { duration: 1.5, velocity: 0.32, when: now + 1.75 });
    return;
  }
  if (demo.type === 'harmonic_demo') {
    const ctx = synthEngine.ensureContext();
    const now = ctx.currentTime + 0.03;
    [1, 2, 3, 4, 5, 6, 7].forEach((p, idx) => {
      synthEngine.pluckFreq(demo.baseHz * p, {
        duration: 1.5,
        velocity: 0.28,
        harmonicBell: p >= 2,
        when: now + idx * 0.34
      });
    });
  }
}

function executeGlossaryJump(jump) {
  const patch = { workspaceOpen: true };
  if (jump.tab) patch.activeTab = jump.tab;
  if (jump.scaleId) {
    patch.scaleId = jump.scaleId;
    patch.customScaleIntervalsQ = null;
    patch.scalaOverlayOn = false;
    patch.category = 'all';
    patch.temperamentFilter = 'all';
    patch.scaleSearch = '';
  }
  if (Number.isInteger(jump.rootQ)) patch.rootQ = jump.rootQ;
  if (jump.scalaPresetId) {
    patch.scalaPresetId = jump.scalaPresetId;
    patch.scalaCustomText = '';
    patch.scalaOverlayOn = true;
    patch.activeTab = 'scala';
  }
  setState(patch);
}
