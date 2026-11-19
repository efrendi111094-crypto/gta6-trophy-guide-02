// Roadmap: the six stages to the platinum, every one of the 55 trophies
// listed in stage order with its grade and its key fact.

import { STAGES, trophyFact } from './data.js';

function escapeHtml(text) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export function renderRoadmap(el, trophies, state) {
  el.innerHTML = STAGES.map((stage) => {
    const members = trophies.filter((t) => t.stage === stage.n);
    const earned = members.filter((t) => state.earned.has(t.id)).length;
    const rows = members.map((t) => {
      const done = state.earned.has(t.id);
      const missable = t.missable ? ' <span class="tag missable">⚠ Missable</span>' : '';
      return `<li>
        <span class="t-num">${done ? '✓' : t.id}</span>
        <span><a href="#trophy-${t.id}">${escapeHtml(t.name)}</a>${missable}</span>
        <span class="t-fact">${escapeHtml(trophyFact(t))}</span>
        <span class="grade-badge grade-${t.grade}">${t.grade}</span>
      </li>`;
    }).join('');
    return `<section class="stage">
      <div class="stage-head">
        <div><h3><span class="stage-num">Stage ${stage.n}</span>${escapeHtml(stage.title)}</h3>
        <p>${escapeHtml(stage.blurb)}</p></div>
        <span class="stage-count">${earned}/${members.length} earned</span>
      </div>
      <ul class="stage-trophies">${rows}</ul>
    </section>`;
  }).join('');
}
