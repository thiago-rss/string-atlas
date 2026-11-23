/**
 * Pure Custom Scordaturas (Saved Tunings) Manager — v8.5
 * Supports 6-, 7-, and 8-string guitars with full 24-TET (quarter-tone) pitch resolution.
 * Persisted cleanly in localStorage and included in JSON studio backups.
 */
import { qToNoteName } from './theory24.js';

export const CUSTOM_TUNINGS_KEY = 'string_atlas_custom_tunings_v1';

export function formatStringsSignature(stringsQ) {
  return (stringsQ || []).map((q) => qToNoteName(q, false)).join(' ');
}

export function sanitizeCustomTuning(entry, fallbackIdx = 0) {
  if (!entry || !Array.isArray(entry.stringsQ)) return null;
  const len = entry.stringsQ.length;
  if (len < 6 || len > 8) return null;

  const cleanQ = entry.stringsQ.map((q) => {
    const n = Math.round(Number(q));
    return Number.isFinite(n) ? Math.max(46, Math.min(168, n)) : 80;
  });

  const sig = formatStringsSignature(cleanQ);
  const rawShort = String(entry.short || entry.name || '').trim().slice(0, 28) || `Scordatura ${sig}`;
  const fullName = `${rawShort} (${sig})`;

  return {
    id: (typeof entry.id === 'string' && entry.id.startsWith('custom_tun_'))
      ? entry.id
      : `custom_tun_${Date.now()}_${fallbackIdx}`,
    group: 'custom',
    custom: true,
    pinned: true,
    short: rawShort,
    namePt: fullName,
    nameEn: fullName,
    stringsQ: cleanQ
  };
}

export function createCustomTuning({ name, stringsQ }) {
  const sig = formatStringsSignature(stringsQ);
  const cleanName = String(name || '').trim().slice(0, 28) || `Custom ${sig}`;
  return sanitizeCustomTuning({
    id: `custom_tun_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    short: cleanName,
    stringsQ
  });
}

export function stringsEqual(a, b) {
  if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) return false;
  for (let i = 0; i < a.length; i += 1) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

export function loadCustomTunings() {
  if (typeof localStorage === 'undefined') return [];
  try {
    const raw = localStorage.getItem(CUSTOM_TUNINGS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((item, idx) => sanitizeCustomTuning(item, idx))
      .filter(Boolean)
      .slice(0, 32);
  } catch {
    return [];
  }
}

export function saveCustomTunings(list) {
  if (typeof localStorage === 'undefined') return;
  try {
    const clean = (Array.isArray(list) ? list : [])
      .map((item, idx) => sanitizeCustomTuning(item, idx))
      .filter(Boolean)
      .slice(0, 32);
    localStorage.setItem(CUSTOM_TUNINGS_KEY, JSON.stringify(clean));
  } catch {
    // Ignore storage quota errors gracefully
  }
}
