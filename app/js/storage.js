// Tracker state: saving earned trophies and the spoiler setting in localStorage,
// plus export and import of progress as JSON. Nothing leaves the browser.

import { DEMO_EARNED } from './data.js';

const EARNED_KEY = 'leonida-crown-earned-v1';
const SPOILER_KEY = 'leonida-crown-spoiler-v1';

function readJson(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? null : JSON.parse(raw);
  } catch {
    return null;
  }
}

function writeJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage may be unavailable (private mode); the tracker still works in memory.
  }
}

/** Load the earned set. With ?demo=1 and no saved progress, seed the demo set. */
export function loadEarned(demo) {
  const saved = readJson(EARNED_KEY);
  if (Array.isArray(saved)) return new Set(saved.filter((n) => Number.isInteger(n)));
  if (demo) return new Set(DEMO_EARNED);
  return new Set();
}

export function saveEarned(earned) {
  writeJson(EARNED_KEY, [...earned].sort((a, b) => a - b));
}

/** Spoiler setting: on by default, so story trophies stay hidden until earned. */
export function loadSpoiler() {
  const saved = readJson(SPOILER_KEY);
  return saved === null ? true : saved === true;
}

export function saveSpoiler(on) {
  writeJson(SPOILER_KEY, on);
}

/** Serialise progress for export. */
export function exportProgress(earned) {
  return JSON.stringify({
    app: 'Leonida Crown',
    game: 'Grand Theft Auto VI',
    exported: new Date().toISOString(),
    earned: [...earned].sort((a, b) => a - b),
  }, null, 2);
}

/** Parse an imported file. Returns a Set of ids, or null when it is not valid progress. */
export function parseImport(text) {
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    return null;
  }
  const ids = Array.isArray(data) ? data : data.earned;
  if (!Array.isArray(ids)) return null;
  const clean = ids.filter((n) => Number.isInteger(n) && n >= 1 && n <= 55);
  return clean.length === 0 && ids.length > 0 ? null : new Set(clean);
}

/** Download a text file from the browser. */
export function downloadFile(filename, text) {
  const blob = new Blob([text], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
