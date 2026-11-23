/**
 * Phase 5 Modal Vamp & Sayr Modulation Lab View
 * - Plays 24-TET chord pads / electric strums through multi-bar modal & Sayr progressions
 * - Dynamically syncs the Fretboard, Root, Scale/Maqam, and Target Voicing on every modulation
 * - Displays Next-Bar Preview & live beat LEDs without DOM thrashing
 */
import { DB } from '../core/database.js';
import { NOTE_NAMES_24, qToNoteName } from '../core/theory24.js';
import { VAMP_PRESETS, buildVampFromCurrentLab } from '../core/vampEngine.js';
import { t } from '../core/i18n.js';
import { getActiveScale, getState, setState } from '../state/store.js';
import { synthEngine } from '../audio/synthEngine.js';
import { exportVampToMidi, triggerFileDownload } from '../core/exportEngine.js';

export function renderVampView(state) {
  const container = document.getElementById('tabVamp');
  if (!container) return;

  const isEn = state.lang === 'en';
  const presetMeta = VAMP_PRESETS.find((p) => p.id === state.vampPresetId);
  const steps = state.vampSteps || [];
  const curIdx = steps.length ? (state.vampActiveStepIdx % steps.length) : 0;
  const nextIdx = steps.length ? ((curIdx + 1) % steps.length) : 0;
  const curStep = steps[curIdx];
  const nextStep = steps[nextIdx];

  const presetOptions = VAMP_PRESETS.map((p) => `
    <option value="${p.id}" ${p.id === state.vampPresetId ? 'selected' : ''}>
      ${isEn ? p.nameEn : p.namePt}
    </option>
  `).join('');

  const scaleOptionsForStep = (selectedId) =>
    DB.scales.map((s) => `
      <option value="${s.id}" ${s.id === selectedId ? 'selected' : ''}>${isEn ? s.nameEn : s.namePt}</option>
    `).join('');

  const chordOptionsForStep = (selectedId) =>
    DB.chords.map((c) => `
      <option value="${c.id}" ${c.id === selectedId ? 'selected' : ''}>${c.symbol} · ${isEn ? c.nameEn : c.namePt}</option>
    `).join('');

  const beatLedsHtml = Array.from({ length: state.vampBeatsPerBar }, (_, i) => `
    <span class="vamp-beat-led ${i === 0 ? 'is-downbeat' : ''}" data-vamp-beat="${i}">${i + 1}</span>
  `).join('');

  const timelineHtml = steps.map((step, idx) => {
    const scaleObj = DB.scales.find((s) => s.id === step.scaleId);
    const chordObj = DB.chords.find((c) => c.id === step.chordId);
    const rootName = qToNoteName(step.rootQ, false);
    const isNow = idx === curIdx && state.vampPlaying;

    return `
      <div class="vamp-step-card ${isNow ? 'is-now' : ''}" data-vamp-card="${idx}">
        <div class="vamp-step-head">
          <button type="button" class="btn-mini" data-v-action="auditionStep" data-idx="${idx}">
            ▶ #${idx + 1} · ${rootName} ${chordObj ? chordObj.symbol : ''}
          </button>
          <div class="pill-row">
            <button type="button" class="btn-mini" data-v-action="cycleBars" data-idx="${idx}" title="${t(state.lang, 'vampBarsTitle')}">
              ${step.bars} ${step.bars === 1 ? t(state.lang, 'vampBarSing') : t(state.lang, 'vampBarPlur')}
            </button>
            ${steps.length > 2 ? `<button type="button" class="btn-mini" data-v-action="removeStep" data-idx="${idx}" aria-label="Remove">✕</button>` : ''}
          </div>
        </div>

        <div class="vamp-step-title">${step.label || `${rootName} ${scaleObj ? (isEn ? scaleObj.nameEn : scaleObj.namePt) : ''}`}</div>

        <div class="vamp-step-edits">
          <select class="vamp-mini-sel" data-v-edit="rootQ" data-idx="${idx}" aria-label="Root">
            ${NOTE_NAMES_24.map((nm, q) => `<option value="${q}" ${q === step.rootQ ? 'selected' : ''}>${nm}</option>`).join('')}
          </select>
          <select class="vamp-mini-sel" data-v-edit="scaleId" data-idx="${idx}" aria-label="Scale">
            ${scaleOptionsForStep(step.scaleId)}
          </select>
          <select class="vamp-mini-sel" data-v-edit="chordId" data-idx="${idx}" aria-label="Chord">
            ${chordOptionsForStep(step.chordId)}
          </select>
        </div>
      </div>
    `;
  }).join('');

  container.innerHTML = `
    <div class="panel">
      <div class="section-heading" style="flex-wrap:wrap">
        <span>${t(state.lang, 'vampTitle')}</span>
        <div class="pill-row">
          <button type="button" class="btn-mini" data-v-action="buildFromCurrent">${t(state.lang, 'vampBuildFromLab')}</button>
          <button type="button" class="btn-mini" data-v-action="addStep">+ ${t(state.lang, 'vampAddStep')}</button>
          <button type="button" class="btn-mini active-mini" data-v-action="exportVampMidi">${t(state.lang, 'vampExportMidi')}</button>
        </div>
      </div>

      <div class="vamp-top-row">
        <div class="control-group" style="flex:1.4;min-width:250px">
          <label class="control-label" for="selVampPreset">${t(state.lang, 'vampPresetLabel')}</label>
          <select id="selVampPreset">${presetOptions}</select>
        </div>

        <div class="vamp-transport-group">
          <button type="button" class="${state.vampPlaying ? 'btn-danger' : 'btn-primary'}" data-v-action="togglePlay">
            ${state.vampPlaying ? t(state.lang, 'vampStop') : t(state.lang, 'vampPlay')}
          </button>

          <label class="bpm-control">
            <span>BPM</span>
            <input type="range" id="rngVampBpm" min="48" max="180" step="2" value="${state.vampBpm}" />
            <strong id="valVampBpm">${state.vampBpm}</strong>
          </label>

          <div class="pill-row">
            ${[3, 4, 5, 7].map((b) => `
              <button type="button" class="btn-mini ${state.vampBeatsPerBar === b ? 'active-mini' : ''}" data-v-action="setBeats" data-val="${b}">${b}/4</button>
            `).join('')}
          </div>
        </div>
      </div>

      <div class="vamp-options-bar">
        <div class="pill-row">
          <button type="button" class="btn-pill ${state.vampStyle === 'pad' ? 'active-teal' : ''}" data-v-action="setStyle" data-val="pad">${t(state.lang, 'vampStylePad')}</button>
          <button type="button" class="btn-pill ${state.vampStyle === 'strum' ? 'active-teal' : ''}" data-v-action="setStyle" data-val="strum">${t(state.lang, 'vampStyleStrum')}</button>
          <button type="button" class="btn-pill ${state.vampSyncNeck ? 'active-voicing' : ''}" data-v-action="toggleSyncNeck">${t(state.lang, 'vampSyncNeck')}</button>
          <button type="button" class="btn-pill ${state.vampClickOn ? 'active' : ''}" data-v-action="toggleClick">${t(state.lang, 'etudeClick')}</button>
        </div>

        <div class="vamp-live-hud">
          <div class="vamp-beats-strip" id="vampBeatsStrip">${beatLedsHtml}</div>
          <span class="soft-tag" id="vampNextPreview">
            ${t(state.lang, 'vampNextLabel')}: <strong>${nextStep ? nextStep.label : '—'}</strong>
          </span>
        </div>
      </div>

      ${presetMeta ? `<p class="rhythm-note">${isEn ? presetMeta.descEn : presetMeta.descPt}</p>` : ''}

      <div class="vamp-timeline-grid" id="vampTimelineGrid">${timelineHtml}</div>
    </div>
  `;

  // Bind preset dropdown
  container.querySelector('#selVampPreset').onchange = (e) => {
    loadVampPreset(e.target.value);
  };

  // Bind BPM slider cleanly
  const bpmInp = container.querySelector('#rngVampBpm');
  const bpmVal = container.querySelector('#valVampBpm');
  bpmInp.oninput = (e) => {
    bpmVal.textContent = e.target.value;
    setState({ vampBpm: Number(e.target.value) });
  };

  // Bind inline step editors
  container.onchange = (e) => {
    const sel = e.target.closest('select[data-v-edit]');
    if (!sel) return;
    const idx = Number(sel.dataset.idx);
    const field = sel.dataset.vEdit;
    const st = getState();
    const updated = st.vampSteps.map((s, i) => {
      if (i !== idx) return s;
      const nextVal = field === 'rootQ' ? Number(sel.value) : sel.value;
      const nextStepObj = { ...s, [field]: nextVal };
      const scObj = DB.scales.find((x) => x.id === nextStepObj.scaleId);
      nextStepObj.label = `${qToNoteName(nextStepObj.rootQ, false)} ${scObj ? (st.lang === 'en' ? scObj.nameEn : scObj.namePt) : ''}`;
      return nextStepObj;
    });
    setState({ vampSteps: updated });
  };

  // Delegated button actions
  container.onclick = (e) => {
    const btn = e.target.closest('button[data-v-action]');
    if (!btn) return;
    const act = btn.dataset.vAction;
    const st = getState();

    if (act === 'togglePlay') {
      toggleVampPlayback();
    } else if (act === 'setBeats') {
      setState({ vampBeatsPerBar: Number(btn.dataset.val) });
    } else if (act === 'setStyle') {
      setState({ vampStyle: btn.dataset.val });
    } else if (act === 'toggleSyncNeck') {
      setState({ vampSyncNeck: !st.vampSyncNeck });
    } else if (act === 'toggleClick') {
      setState({ vampClickOn: !st.vampClickOn });
    } else if (act === 'auditionStep') {
      const idx = Number(btn.dataset.idx);
      const step = st.vampSteps[idx];
      if (!step) return;
      const ch = DB.chords.find((c) => c.id === step.chordId) || DB.chords[0];
      synthEngine.playModalPad({
        rootQ: step.rootQ,
        intervalsQ: ch.intervalsQ,
        duration: 2.2,
        style: st.vampStyle
      });
      applyVampStepToLab(step, idx);
    } else if (act === 'cycleBars') {
      const idx = Number(btn.dataset.idx);
      const barCycle = [1, 2, 4];
      const updated = st.vampSteps.map((s, i) => {
        if (i !== idx) return s;
        const nextB = barCycle[(barCycle.indexOf(s.bars) + 1) % barCycle.length];
        return { ...s, bars: nextB };
      });
      setState({ vampSteps: updated });
    } else if (act === 'removeStep') {
      const idx = Number(btn.dataset.idx);
      if (st.vampSteps.length <= 2) return;
      const updated = st.vampSteps.filter((_, i) => i !== idx);
      setState({ vampSteps: updated, vampActiveStepIdx: 0 });
    } else if (act === 'addStep') {
      const last = st.vampSteps[st.vampSteps.length - 1] || { rootQ: st.rootQ, scaleId: st.scaleId, chordId: st.chordId, bars: 2 };
      const nextStepObj = { ...last };
      setState({ vampSteps: [...st.vampSteps, nextStepObj] });
    } else if (act === 'exportVampMidi') {
      const bytes = exportVampToMidi({
        steps: st.vampSteps,
        bpm: st.vampBpm,
        beatsPerBar: st.vampBeatsPerBar,
        getChordIntervals: (cid) => (DB.chords.find((c) => c.id === cid) || DB.chords[0]).intervalsQ,
        title: `String Atlas Vamp (${st.vampPresetId})`
      });
      triggerFileDownload(bytes, `string-atlas-vamp-24tet.mid`, 'audio/midi');
    } else if (act === 'buildFromCurrent') {
      stopVampPlayback();
      const freshSteps = buildVampFromCurrentLab({
        rootQ: st.rootQ,
        scale: getActiveScale(),
        chordId: st.chordId
      });
      setState({ vampSteps: freshSteps, vampActiveStepIdx: 0 });
    }
  };

  updateVampBadge(state);
}

function loadVampPreset(presetId) {
  const preset = VAMP_PRESETS.find((p) => p.id === presetId) || VAMP_PRESETS[0];
  const wasPlaying = getState().vampPlaying;
  stopVampPlayback();

  const tun = DB.tunings.find((x) => x.id === preset.tuningId);
  const firstStep = preset.steps[0];
  const patch = {
    vampPresetId: preset.id,
    vampSteps: preset.steps.map((s) => ({ ...s })),
    vampBpm: preset.bpm,
    vampBeatsPerBar: preset.beatsPerBar,
    vampActiveStepIdx: 0
  };

  if (firstStep && getState().vampSyncNeck) {
    patch.scaleId = firstStep.scaleId;
    patch.customScaleIntervalsQ = null;
    patch.rootQ = firstStep.rootQ;
    patch.chordId = firstStep.chordId;
    patch.harmonyMode = 'catalog';
    patch.selectedVoicingIdx = 0;
    patch.voicingOverlayOn = true;
  }
  if (tun) {
    patch.stringCount = tun.stringsQ.length;
    patch.tuningId = tun.id;
    patch.customStringsQ = [...tun.stringsQ];
  }

  setState(patch);
  if (wasPlaying) toggleVampPlayback();
}

function applyVampStepToLab(step, idx) {
  const st = getState();
  if (!st.vampSyncNeck) {
    highlightVampLive(idx, 0, 0);
    return;
  }
  setState({
    vampActiveStepIdx: idx,
    category: 'all',
    customScaleIntervalsQ: null,
    scaleId: step.scaleId,
    rootQ: step.rootQ,
    chordId: step.chordId,
    harmonyMode: 'catalog',
    selectedVoicingIdx: 0,
    voicingOverlayOn: true
  });
}

export function highlightVampLive(stepIdx, barInStep, beatInBar) {
  const grid = document.getElementById('vampTimelineGrid');
  if (grid) {
    grid.querySelectorAll('.vamp-step-card').forEach((card) => {
      card.classList.toggle('is-now', Number(card.dataset.vampCard) === stepIdx);
    });
  }

  const beatsStrip = document.getElementById('vampBeatsStrip');
  if (beatsStrip) {
    beatsStrip.querySelectorAll('.vamp-beat-led').forEach((led) => {
      led.classList.toggle('is-lit', Number(led.dataset.vampBeat) === beatInBar);
    });
  }

  const st = getState();
  const steps = st.vampSteps || [];
  if (steps.length) {
    const cur = steps[stepIdx % steps.length];
    const nxt = steps[(stepIdx + 1) % steps.length];
    const previewEl = document.getElementById('vampNextPreview');
    if (previewEl && nxt) {
      previewEl.innerHTML = `${t(st.lang, 'vampNextLabel')}: <strong>${nxt.label}</strong> (${barInStep + 1}/${cur.bars})`;
    }
    const zenHud = document.getElementById('zenVampHud');
    if (zenHud && cur) {
      zenHud.textContent = `${cur.label} · ${barInStep + 1}/${cur.bars} · → ${nxt.label}`;
    }
  }
}

export function updateVampBadge(state) {
  const badge = document.getElementById('vampStatusBadge');
  if (!badge) return;
  if (!state.vampPlaying) {
    badge.hidden = true;
    return;
  }
  const steps = state.vampSteps || [];
  const cur = steps[state.vampActiveStepIdx % Math.max(1, steps.length)];
  badge.hidden = false;
  badge.textContent = cur ? `⟳ ${cur.label} · ${state.vampBpm} BPM` : `⟳ VAMP · ${state.vampBpm} BPM`;
}

export function stopVampPlayback() {
  synthEngine.stopVampSequencer();
  highlightVampLive(-1, 0, -1);
  if (getState().vampPlaying) {
    setState({ vampPlaying: false });
  }
  updateVampBadge(getState());
}

export function toggleVampPlayback() {
  const st = getState();
  if (st.vampPlaying) {
    stopVampPlayback();
    return;
  }

  // Stop competing scale/etude playback cleanly
  synthEngine.stopScaleSequence();
  synthEngine.stopEtudeSequencer();
  setState({ isPlayingScale: false, etudePlaying: false, vampPlaying: true });
  updateVampBadge(getState());

  synthEngine.startVampSequencer(
    () => {
      const cur = getState();
      return {
        steps: cur.vampSteps,
        bpm: cur.vampBpm,
        beatsPerBar: cur.vampBeatsPerBar,
        style: cur.vampStyle,
        clickOn: cur.vampClickOn,
        getChordIntervals: (chordId) => {
          const ch = DB.chords.find((c) => c.id === chordId) || DB.chords[0];
          return ch.intervalsQ;
        }
      };
    },
    {
      onBeat: ({ stepIdx, barInStep, beatInBar, isStepStart }) => {
        const cur = getState();
        const step = cur.vampSteps[stepIdx];
        if (isStepStart && step && cur.vampSyncNeck) {
          applyVampStepToLab(step, stepIdx);
        }
        highlightVampLive(stepIdx, barInStep, beatInBar);
        updateVampBadge(getState());
      }
    }
  );
}
