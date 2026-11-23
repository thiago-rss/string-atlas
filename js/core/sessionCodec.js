/**
 * Session Snapshot & Shareable URL Hash Codec (#sa=...)
 * Encodes/decodes compact lab setups with zero external dependencies.
 */

const SNAPSHOTS_KEY = 'string_atlas_snapshots_v5';

export function extractShareablePayload(state) {
  return {
    s: state.scaleId,
    r: state.rootQ,
    t: state.tuningId,
    m: state.microMode,
    l: state.labelMode,
    c: state.chordId,
    vo: state.voicingOverlayOn ? 1 : 0,
    h: state.harmonicsOn ? 1 : 0,
    ry: state.rhythmId,
    ep: state.etudePatternId,
    vp: state.vampPresetId,
    fw: state.fretWindowOn ? 1 : 0,
    fs: state.fretWindowStart,
    fl: state.fretWindowSpan,
    th: state.theme
  };
}

export function encodeSessionHash(state) {
  const payload = extractShareablePayload(state);
  const json = JSON.stringify(payload);
  // UTF-8 safe base64url encoding
  const bytes = new TextEncoder().encode(json);
  let bin = '';
  bytes.forEach((b) => { bin += String.fromCharCode(b); });
  const b64 = btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  return `#sa=${b64}`;
}

export function decodeSessionHash(hashStr) {
  if (!hashStr || !hashStr.startsWith('#sa=')) return null;
  try {
    let b64 = hashStr.slice(4).replace(/-/g, '+').replace(/_/g, '/');
    while (b64.length % 4 !== 0) b64 += '=';
    const bin = atob(b64);
    const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
    const json = new TextDecoder().decode(bytes);
    const data = JSON.parse(json);
    if (!data || typeof data !== 'object') return null;
    return data;
  } catch {
    return null;
  }
}

export function loadSnapshots() {
  try {
    const raw = localStorage.getItem(SNAPSHOTS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveSnapshots(list) {
  try {
    localStorage.setItem(SNAPSHOTS_KEY, JSON.stringify(list.slice(0, 24)));
  } catch {
    // Ignore quota errors
  }
}
