// Sources and missables: the source matrix (every trophy mapped to its
// sources) and the missable watch list, with the dispute notes.

import { SOURCE_DEFS, trophySources } from './data.js';

function escapeHtml(text) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export function renderSourceList(el) {
  el.innerHTML = `<div class="source-cards">${SOURCE_DEFS.map((def) => `
    <div class="source-card">
      <h3>${escapeHtml(def.name)}</h3>
      <div class="source-date">${escapeHtml(def.date)}</div>
      <p>${escapeHtml(def.covers)}</p>
    </div>`).join('')}</div>`;
}

export function renderMatrix(el, trophies) {
  const head = SOURCE_DEFS.map((def) => `<th>${escapeHtml(def.name.split(' ')[0])}</th>`).join('');
  const rows = trophies.map((t) => {
    const cited = new Set(trophySources(t).map((d) => d.key));
    const cells = SOURCE_DEFS.map((def) => cited.has(def.key)
      ? '<td class="check">✓</td>'
      : '<td class="dash">—</td>').join('');
    return `<tr><td><a href="#trophy-${t.id}">${escapeHtml(t.name)}</a>${t.missable ? ' ⚠' : ''}${t.unconfirmed ? ' *' : ''}</td>${cells}<td>${t.sources.length}</td></tr>`;
  }).join('');
  el.innerHTML = `<div class="matrix-wrap"><table class="matrix">
    <thead><tr><th>Trophy</th>${head}<th>Cited</th></tr></thead>
    <tbody>${rows}</tbody>
  </table></div>
  <p style="font-size:12.5px;color:var(--muted)">⚠ = possibly missable &nbsp;·&nbsp; * = an unconfirmed detail, marked honestly &nbsp;·&nbsp; Every trophy cites the official list; steps cite the guide they draw on.</p>`;
}

export function renderMissable(el, trophies) {
  const flagged = trophies.filter((t) => t.missable);
  el.innerHTML = flagged.map((t) => `
    <div class="missable-card">
      <h3>⚠ ${escapeHtml(t.name)} — ${t.grade} — ${escapeHtml(t.countLabel || '')}</h3>
      <p><em>Official description: “${escapeHtml(t.description)}”</em></p>
      <p>${escapeHtml(t.guide)}</p>
      <div class="sources"><h3>Sources</h3><ul>${t.sources.map((s) => `<li>${escapeHtml(s)}</li>`).join('')}</ul></div>
    </div>`).join('') +
    `<p style="font-size:13.5px;color:var(--muted)">Verdict: <strong style="color:var(--text)">1 of 55</strong> trophies is reported as possibly missable — and even that one is unconfirmed, because the guides disagree on whether the Chapter 1 meditation is required. The other 54 are safe in free roam after the story.</p>`;
}
