// Filters: kind chips, search text, and the spoiler rule.
// The spoiler rule hides a story trophy's name and description until it is earned.

import { kindLabel } from './data.js';

export function isSpoilerHidden(trophy, state) {
  return state.spoiler && trophy.kind === 'story' && !state.earned.has(trophy.id);
}

export function applyFilters(trophies, state) {
  const query = state.query.trim().toLowerCase();
  return trophies.filter((t) => {
    if (state.kind === 'missable' && !t.missable) return false;
    if (state.kind === 'earned' && !state.earned.has(t.id)) return false;
    if (state.kind === 'remaining' && state.earned.has(t.id)) return false;
    if (state.kind !== 'all' && state.kind !== 'missable' && state.kind !== 'earned' && state.kind !== 'remaining' && t.kind !== state.kind) return false;
    if (query) {
      const hay = `${t.name} ${t.description} ${t.guide} ${kindLabel(t.kind)}`.toLowerCase();
      if (!hay.includes(query)) return false;
    }
    return true;
  });
}

export function wireFilters(state, onChange) {
  const chips = document.querySelectorAll('#kindFilters .chip');
  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      chips.forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');
      state.kind = chip.dataset.kind;
      onChange();
    });
  });

  const search = document.getElementById('searchBox');
  search.addEventListener('input', () => {
    state.query = search.value;
    onChange();
  });

  const spoiler = document.getElementById('spoilerToggle');
  spoiler.checked = state.spoiler;
  spoiler.addEventListener('change', () => {
    state.spoiler = spoiler.checked;
    onChange(true);
  });
}
