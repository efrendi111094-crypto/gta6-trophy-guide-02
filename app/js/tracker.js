// Tracker: the checklist itself, the progress bar, and the audit strip.
// Each row shows the official name, description and grade, with flags for
// hidden, missable and unconfirmed trophies.

import { applyFilters, isSpoilerHidden } from './filters.js';
import { kindLabel, trophySources } from './data.js';

function escapeHtml(text) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function rowHtml(trophy, state) {
  const earned = state.earned.has(trophy.id);
  const hidden = isSpoilerHidden(trophy, state);
  const name = hidden ? 'Hidden story trophy' : trophy.name;
  const desc = hidden ? 'Spoilers on — earn it (or turn spoilers off) to reveal the name and description.' : trophy.description;
  const tags = [`<span class="tag">${escapeHtml(kindLabel(trophy.kind))}</span>`];
  if (trophy.countLabel) tags.push(`<span class="tag">${escapeHtml(trophy.countLabel)}</span>`);
  if (trophy.missable) tags.push('<span class="tag missable">⚠ Possibly missable</span>');
  if (trophy.unconfirmed) tags.push('<span class="tag unconfirmed">Unconfirmed detail</span>');
  const hiddenMark = trophy.hidden && !hidden ? '<span class="hidden-mark">HIDDEN ON PSN</span>' : '';
  return `<li class="trophy-row${earned ? ' earned' : ''}${state.selected === trophy.id ? ' selected' : ''}" data-id="${trophy.id}">
    <input type="checkbox" ${earned ? 'checked' : ''} aria-label="Mark ${escapeHtml(name)} earned">
    <div>
      <div class="trophy-name">${escapeHtml(name)}${hiddenMark}</div>
      <div class="trophy-desc">${escapeHtml(desc)}</div>
      <div class="trophy-meta">${tags.join('')}</div>
    </div>
    <span class="grade-badge grade-${trophy.grade}">${trophy.grade}</span>
  </li>`;
}

export function renderList(trophies, state, onSelect, onToggle) {
  const list = document.getElementById('trophyList');
  const shown = applyFilters(trophies, state);
  list.innerHTML = shown.map((t) => rowHtml(t, state)).join('');
  const note = document.getElementById('listNote');
  note.textContent = shown.length === trophies.length
    ? `Showing all ${trophies.length} trophies. Click a row to read its cited guide; tick the box when you earn it.`
    : `Showing ${shown.length} of ${trophies.length} trophies.`;

  list.querySelectorAll('.trophy-row').forEach((row) => {
    const id = Number(row.dataset.id);
    row.addEventListener('click', (event) => {
      if (event.target.tagName === 'INPUT') return;
      onSelect(id);
    });
    row.querySelector('input').addEventListener('change', (event) => {
      event.stopPropagation();
      onToggle(id, event.target.checked);
    });
  });
}

export function updateProgress(trophies, state) {
  const earned = state.earned.size;
  const total = trophies.length;
  const pct = Math.round((earned / total) * 100);
  document.getElementById('progressText').textContent = `${earned} of ${total} earned`;
  document.getElementById('progressPct').textContent = `${pct}%`;
  const fill = document.getElementById('progressFill');
  fill.style.width = `${pct}%`;
  const wrap = document.getElementById('progressBarWrap');
  wrap.setAttribute('aria-valuenow', String(earned));
}

/** The audit strip: live counts that let a reader check coverage at a glance. */
export function updateAudit(trophies) {
  const cited = trophies.filter((t) => t.sources && t.sources.length > 0).length;
  const missable = trophies.filter((t) => t.missable).length;
  const unconfirmed = trophies.filter((t) => t.unconfirmed).length;
  const sourceKeys = new Set();
  trophies.forEach((t) => trophySources(t).forEach((d) => sourceKeys.add(d.key)));
  document.getElementById('auditTrophies').textContent = `${trophies.length}/${trophies.length}`;
  document.getElementById('auditCited').textContent = `${cited}/${trophies.length}`;
  document.getElementById('auditMissable').textContent = String(missable);
  document.getElementById('auditSources').textContent = String(sourceKeys.size);
  document.getElementById('auditUnconfirmed').textContent = String(unconfirmed);
}
