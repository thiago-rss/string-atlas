/**
 * Pure Fretboard Visual Clarity & 3-Tier Graphic Hierarchy Engine (v8.9)
 * Solves overcrowded fretboards by enforcing:
 *  - 4 clear display modes: 'clean' (Livre) | 'position' (Posição 0-5) | 'octave' (0-12) | 'full' (0-22)
 *  - 3-tier note prominence: Root (Tier 1 solid large) > Characteristic/Microtone (Tier 2 solid medium) > Scale Skeleton (Tier 3 crisp ring)
 *  - Adaptive marker scale based on physical fret spacing so upper frets (13-22) never collide
 */

export const FRET_DISPLAY_MODES = ['clean', 'position', 'octave', 'full'];

/**
 * Resolves a clarity mode selection into synchronized store fields.
 */
export function resolveFretDisplayPatch(mode, currentState = {}) {
  const safeMode = FRET_DISPLAY_MODES.includes(mode) ? mode : 'position';
  const span = Number.isInteger(currentState.fretWindowSpan) ? currentState.fretWindowSpan : 5;
  const curStart = Number.isInteger(currentState.fretWindowStart) ? currentState.fretWindowStart : 0;

  if (safeMode === 'clean') {
    return {
      fretDisplayMode: 'clean',
      fretWindowOn: false,
      fretZoomOverride: 12
    };
  }
  if (safeMode === 'position') {
    const clampedStart = Math.max(0, Math.min(12 - span, curStart));
    return {
      fretDisplayMode: 'position',
      fretWindowOn: true,
      fretWindowStart: clampedStart,
      fretZoomOverride: 12
    };
  }
  if (safeMode === 'octave') {
    return {
      fretDisplayMode: 'octave',
      fretWindowOn: false,
      fretZoomOverride: 12
    };
  }
  return {
    fretDisplayMode: 'full',
    fretWindowOn: false,
    fretZoomOverride: 22
  };
}

/**
 * Classifies a scale note into a clear 3-tier visual hierarchy:
 *  - 'root'   : Tier 1 (Primary focal anchor — largest, solid root fill + subtle halo)
 *  - 'accent' : Tier 2 (Characteristic degree, microtone, voicing or radar B — medium solid fill)
 *  - 'scale'  : Tier 3 (Supporting scale skeleton — compact translucent core + crisp colored ring)
 */
export function getNoteVisualTier({ isRoot = false, isChar = false, isMicroStep = false, isVoicing = false, isRadarOnly = false }) {
  if (isRoot) return 'root';
  if (isChar || isMicroStep || isVoicing || isRadarOnly) return 'accent';
  return 'scale';
}

/**
 * Computes base radius & adaptive scale factor from the available fret span (px) and string gap (px),
 * preventing overlap on upper frets (13..22) and tight 8-string necks.
 */
export function computeNoteGeometry({ tier, fretSpanPx = 56, strGapPx = 42 }) {
  const baseRadius = tier === 'root' ? 13.0 : (tier === 'accent' ? 10.9 : 9.2);
  const maxByFret = Math.max(7.2, (fretSpanPx - 6) * 0.48);
  const maxByStr = Math.max(7.2, (strGapPx - 7) * 0.48);
  const cap = Math.min(maxByFret, maxByStr);
  const scale = Math.max(0.68, Math.min(1.0, cap / 13.2));

  return {
    radius: Number((baseRadius * scale).toFixed(2)),
    scale: Number(scale.toFixed(3))
  };
}
