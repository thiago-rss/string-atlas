/**
 * Phase 5 Session Snapshots, Shareable URL Hash (#sa=...) & Zen Practice Floating Bar
 */
import { DB } from '../core/database.js';
import { qToNoteName } from '../core/theory24.js';
import { encodeSessionHash, extractShareablePayload } from '../core/sessionCodec.js';
import { VAMP_PRESETS } from '../core/vampEngine.js';
import { t } from '../core/i18n.js';
import { getActiveScale, getActiveTuning, getState, setState } from '../state/store.js';
import { synthEngine } from '../audio/synthEngine.js';
import { toggleVampPlayback, stopVampPlayback } from './vampView.js';

export function renderSnapshotsDrawer(state) {
  const drawer = document.getElementById('snapshotsDrawer');
  if (!drawer) return;

  if (!state.snapshotsOpen) {
    drawer.hidden = true;
    return;
  }
  drawer.hidden = false;

  const list = state.snapshots || [];
  const cardsHtml = list.length === 0
    ? `<p class="empty-hint">${t(state.lang, 'snapEmpty')}</p>`
    : `
      <div class="snap-grid">
        ${list.map((snap, idx) => `
          <div class="snap-card">
            <div class="snap-card-head">
              <strong>${snap.name}</strong>
              <button type="button" class="btn-mini" data-sn-action="delete" data-idx="${idx}" aria-label="Delete">✕</button>
            </div>
            <span class="mono-tag">${snap.meta}</span>
            <button type="button" class="btn-mini active-mini" data-sn-action="load" data-idx="${idx}">${t(state.lang, 'snapLoad')}</button>
          </div>
        `).join('')}
      </div>
    `;

  drawer.innerHTML = `
    <div class="panel">
      <div class="section-heading" style="flex-wrap:wrap">
        <span>${t(state.lang, 'snapTitle')}</span>
        <div class="pill-row">
          <button type="button" class="btn-pill active-teal" id="btnCopyShareUrl" data-sn-action="copyUrl">${t(state.lang, 'snapCopyUrl')}</button>
          <button type="button" class="btn-mini" data-sn-action="exportBackup">${t(state.lang, 'snapExportJson')}</button>
          <button type="button" class="btn-mini" data-sn-action="importBackup">${t(state.lang, 'snapImportJson')}</button>
          <input type="file" id="inpImportBackup" accept="application/json,.json" hidden />
          <button type="button" class="btn-mini" data-sn-action="close">${t(state.lang, 'atlasClose')}</button>
        </div>
      </div>

      <div class="snap-save-row">
        <input type="text" id="inpSnapName" class="search-input" placeholder="${t(state.lang, 'snapPlaceholder')}" maxlength="48" />
        <button type="button" class="btn-primary" data-sn-action="save">${t(state.lang, 'snapSaveBtn')}</button>
      </div>

      ${cardsHtml}
    </div>
  `;

  drawer.onclick = (e) => {
    const btn = e.target.closest('button[data-sn-action]');
    if (!btn) return;
    const act = btn.dataset.snAction;
    const st = getState();

    if (act === 'close') {
      setState({ snapshotsOpen: false });
    } else if (act === 'copyUrl') {
      const hash = encodeSessionHash(st);
      const url = `${window.location.origin}${window.location.pathname}${hash}`;
      window.history.replaceState(null, '', hash);
      if (navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(url).catch(() => {});
      }
      const orig = btn.textContent;
      btn.textContent = t(st.lang, 'snapCopiedUrl');
      setTimeout(() => { btn.textContent = orig; }, 1600);
    } else if (act === 'save') {
      const inp = drawer.querySelector('#inpSnapName');
      const sc = getActiveScale();
      const tun = getActiveTuning();
      const rootName = qToNoteName(st.rootQ, false);
      const defaultName = `${rootName} ${st.lang === 'en' ? sc.nameEn : sc.namePt} · ${tun.short}`;
      const name = (inp?.value || '').trim() || defaultName;
      const newSnap = {
        id: `sn_${Date.now()}`,
        name,
        meta: `${tun.short} · ${st.microMode}`,
        payload: extractShareablePayload(st)
      };
      setState({ snapshots: [newSnap, ...st.snapshots] });
    } else if (act === 'delete') {
      const idx = Number(btn.dataset.idx);
      setState({ snapshots: st.snapshots.filter((_, i) => i !== idx) });
    } else if (act === 'exportBackup') {
      const bundle = {
        app: 'string-atlas',
        version: '6.0.0',
        exportedAt: new Date().toISOString(),
        snapshots: st.snapshots || [],
        completedLessons: st.completedLessons || [],
        earStats: st.earStats || { correct: 0, total: 0, streak: 0, bestStreak: 0 }
      };
      const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'string-atlas-backup.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else if (act === 'importBackup') {
      const fileInp = drawer.querySelector('#inpImportBackup');
      if (fileInp) fileInp.click();
    } else if (act === 'load') {
      const idx = Number(btn.dataset.idx);
      const snap = st.snapshots[idx];
      if (!snap?.payload) return;
      applySnapshotPayload(snap.payload);
    }
  };

  const importInp = drawer.querySelector('#inpImportBackup');
  if (importInp) {
    importInp.onchange = (ev) => {
      const file = ev.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const parsed = JSON.parse(String(reader.result || '{}'));
          const patch = {};
          if (Array.isArray(parsed.snapshots)) patch.snapshots = parsed.snapshots.slice(0, 24);
          if (Array.isArray(parsed.completedLessons)) patch.completedLessons = parsed.completedLessons;
          if (parsed.earStats && typeof parsed.earStats === 'object') patch.earStats = parsed.earStats;
          setState(patch);
        } catch {
          // Ignore malformed JSON gracefully
        }
      };
      reader.readAsText(file);
    };
  }
}

function applySnapshotPayload(p) {
  stopVampPlayback();
  synthEngine.stopScaleSequence();
  synthEngine.stopEtudeSequencer();

  const tun = DB.tunings.find((x) => x.id === p.t) || DB.tunings[0];
  const rhy = DB.rhythms.find((x) => x.id === p.ry) || DB.rhythms[0];
  const vp = VAMP_PRESETS.find((x) => x.id === p.vp) || VAMP_PRESETS[0];

  setState({
    scaleId: DB.scales.some((x) => x.id === p.s) ? p.s : 'maqam_bayati',
    customScaleIntervalsQ: null,
    rootQ: Number.isInteger(p.r) ? p.r : 4,
    tuningId: tun.id,
    customStringsQ: [...tun.stringsQ],
    microMode: p.m || 'bend',
    labelMode: p.l || 'note',
    chordId: DB.chords.some((x) => x.id === p.c) ? p.c : 'quartal_3',
    voicingOverlayOn: Boolean(p.vo),
    harmonicsOn: Boolean(p.h),
    rhythmId: rhy.id,
    rhythmSteps: [...rhy.steps],
    etudePatternId: p.ep || 'micro_bend_lab',
    vampPresetId: vp.id,
    vampSteps: vp.steps.map((s) => ({ ...s })),
    fretWindowOn: Boolean(p.fw),
    fretWindowStart: Number.isInteger(p.fs) ? p.fs : 0,
    fretWindowSpan: Number.isInteger(p.fl) ? p.fl : 5,
    snapshotsOpen: false
  });
}

/**
 * Floating Zen Practice Bar (visible only when body[data-zen="true"])
 */
export function renderZenBar(state) {
  const bar = document.getElementById('zenPracticeBar');
  if (!bar) return;

  document.body.setAttribute('data-zen', state.zenMode ? 'true' : 'false');
  bar.hidden = !state.zenMode;
  if (!state.zenMode) return;

  bar.innerHTML = `
    <div class="zen-bar-inner">
      <div class="pill-row">
        <button type="button" class="btn-primary" data-z-action="toggleVamp">
          ${state.vampPlaying ? t(state.lang, 'vampStop') : t(state.lang, 'vampPlay')}
        </button>
        <button type="button" class="btn-pill ${state.droneOn ? 'active-teal' : ''}" data-z-action="toggleDrone">
          ${state.droneOn ? t(state.lang, 'droneOn') : t(state.lang, 'droneOff')}
        </button>
        <button type="button" class="btn-pill ${state.fretWindowOn ? 'active' : ''}" data-z-action="toggleWindow">
          ${state.fretWindowOn ? `${t(state.lang, 'fretWinShort')} ${state.fretWindowStart}–${state.fretWindowStart + state.fretWindowSpan}` : t(state.lang, 'fretWinFull')}
        </button>
        <span class="mono-tag" id="zenVampHud"></span>
      </div>
      <button type="button" class="btn-ghost" data-z-action="exitZen">${t(state.lang, 'zenExit')}</button>
    </div>
  `;

  bar.onclick = (e) => {
    const btn = e.target.closest('button[data-z-action]');
    if (!btn) return;
    const act = btn.dataset.zAction;
    const st = getState();
    if (act === 'exitZen') {
      setState({ zenMode: false });
    } else if (act === 'toggleVamp') {
      toggleVampPlayback();
    } else if (act === 'toggleDrone') {
      const next = !st.droneOn;
      synthEngine.updateDrone(next, st.rootQ, st.droneFifth);
      setState({ droneOn: next });
    } else if (act === 'toggleWindow') {
      setState({ fretWindowOn: !st.fretWindowOn });
    }
  };
}
