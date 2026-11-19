// Guide panel: the open trophy's guide, its official description, its flags
// and its citations. Deep links (#trophy-<id>) open a trophy from anywhere.

import { isSpoilerHidden } from './filters.js';
import { kindLabel } from './data.js';

function escapeHtml(text) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export function renderGuide(panel, trophy, state) {
  if (!trophy) {
    panel.innerHTML = `<div class="guide-empty">
      <h2>Pick a trophy to read its guide</h2>
      <p>Every guide is written in this entry's own words and names its sources beside it. Story trophies stay hidden while spoilers are on — tick one earned (or turn spoilers off) to reveal it.</p>
      <p class="guide-tip"><strong>One warning:</strong> <a href="#trophy-28">Positive Mental Attitude</a> is the only trophy reported as possibly missable. Do Lucia's balcony meditation in Chapter 1.</p>
    </div>`;
    return;
  }
  const hidden = isSpoilerHidden(trophy, state);
  const name = hidden ? 'Hidden story trophy' : trophy.name;
  const earned = state.earned.has(trophy.id);
  const sourceItems = trophy.sources.map((s) => `<li>${escapeHtml(s)}</li>`).join('');
  const missableNote = trophy.missable
    ? `<div class="missable-note"><strong>⚠ Possibly missable.</strong> The Chapter 1 balcony meditation at Jason's house is gone after Chapter 1, and it is unconfirmed whether the trophy needs it. Do it to be safe — it costs a minute.</div>`
    : '';
  const unconfirmedNote = trophy.unconfirmed
    ? `<div class="unconfirmed-note"><strong>Unconfirmed detail:</strong> ${escapeHtml(trophy.unconfirmed)}</div>`
    : '';
  const body = hidden
    ? '<p class="guide-text">Spoilers are on, so this story trophy stays hidden until you earn it. Tick its box, or turn spoilers off, to read the guide.</p>'
    : `<p class="official">Official description: “${escapeHtml(trophy.description)}”</p>
       <p class="guide-text">${escapeHtml(trophy.guide)}</p>
       ${missableNote}${unconfirmedNote}`;
  panel.innerHTML = `<h2>${escapeHtml(name)}</h2>
    <div class="trophy-meta">
      <span class="grade-badge grade-${trophy.grade}">${trophy.grade}</span>
      <span class="tag">${escapeHtml(kindLabel(trophy.kind))}</span>
      ${trophy.countLabel ? `<span class="tag">${escapeHtml(trophy.countLabel)}</span>` : ''}
      ${trophy.hidden ? '<span class="tag">Hidden on PSN</span>' : ''}
      <span class="tag">Roadmap stage ${trophy.stage}</span>
      ${earned ? '<span class="tag">✓ Earned</span>' : ''}
    </div>
    <div style="height:10px"></div>
    ${body}
    <div class="sources"><h3>Sources</h3><ul>${sourceItems}</ul>
    <p style="font-size:12px;color:var(--muted);margin:8px 0 0">Guide text is this entry's own words. Sources are cited, never copied.</p></div>`;
}

/** Parse a deep link hash: "#trophy-28" -> 28, anything else -> null. */
export function trophyIdFromHash(hash) {
  const match = /^#trophy-(\d+)$/.exec(hash || '');
  return match ? Number(match[1]) : null;
}
