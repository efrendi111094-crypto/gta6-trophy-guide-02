// Leonida Crown — bootstrap: load the data, wire the views, route deep links.
// One playthrough, no network: everything the app needs is under app/.

import { loadTrophies, trophyById } from './data.js';
import { loadEarned, loadSpoiler, saveEarned, saveSpoiler, exportProgress, parseImport, downloadFile } from './storage.js';
import { wireFilters } from './filters.js';
import { renderList, updateProgress, updateAudit } from './tracker.js';
import { renderGuide, trophyIdFromHash } from './guide.js';
import { renderRoadmap } from './roadmap.js';
import { renderSourceList, renderMatrix, renderMissable } from './sources.js';

const VIEWS = ['tracker', 'roadmap', 'sources', 'missable'];
const params = new URLSearchParams(location.search);
const demo = params.get('demo') === '1';

const state = {
  earned: loadEarned(demo),
  spoiler: loadSpoiler(),
  kind: 'all',
  query: '',
  selected: null,
  view: 'tracker',
};

let trophies = [];

function showView(name) {
  if (!VIEWS.includes(name)) name = 'tracker';
  state.view = name;
  document.querySelectorAll('.tab').forEach((tab) => tab.classList.toggle('active', tab.dataset.view === name));
  document.querySelectorAll('.view').forEach((view) => view.classList.toggle('active', view.id === `view-${name}`));
}

function renderAll(save = false) {
  if (save) {
    saveEarned(state.earned);
    saveSpoiler(state.spoiler);
  }
  updateProgress(trophies, state);
  renderList(trophies, state, selectTrophy, toggleEarned);
  renderRoadmap(document.getElementById('roadmapStages'), trophies, state);
  const selected = state.selected === null ? null : trophyById(trophies, state.selected);
  renderGuide(document.getElementById('guidePanel'), selected, state);
}

function selectTrophy(id) {
  state.selected = id;
  showView('tracker');
  renderAll();
  const panel = document.getElementById('guidePanel');
  panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function toggleEarned(id, earned) {
  if (earned) state.earned.add(id);
  else state.earned.delete(id);
  renderAll(true);
}

function routeFromHash() {
  const hash = location.hash;
  const trophyId = trophyIdFromHash(hash);
  if (trophyId !== null && trophyById(trophies, trophyId)) {
    state.selected = trophyId;
    showView('tracker');
    renderAll();
    return;
  }
  const view = hash.replace(/^#/, '');
  if (VIEWS.includes(view)) {
    showView(view);
  }
}

function wireTabs() {
  document.querySelectorAll('.tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      showView(tab.dataset.view);
      history.replaceState(null, '', `#${tab.dataset.view}`);
    });
  });
}

function wireExportImport() {
  document.getElementById('exportBtn').addEventListener('click', () => {
    downloadFile('leonida-crown-progress.json', exportProgress(state.earned));
  });
  document.getElementById('importFile').addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const text = await file.text();
    const imported = parseImport(text);
    if (imported === null) {
      alert('That file is not Leonida Crown progress (expected a JSON file with an "earned" list of trophy ids).');
    } else {
      state.earned = imported;
      renderAll(true);
    }
    event.target.value = '';
  });
}

async function init() {
  try {
    const data = await loadTrophies();
    trophies = data.trophies;
  } catch (err) {
    document.getElementById('trophyList').innerHTML = `<li class="trophy-row"><div>Could not load the trophy list. ${err.message}</div></li>`;
    return;
  }
  updateAudit(trophies);
  renderSourceList(document.getElementById('sourceList'));
  renderMatrix(document.getElementById('sourceMatrix'), trophies);
  renderMissable(document.getElementById('missableList'), trophies);
  wireTabs();
  wireFilters(state, (save) => renderAll(save));
  wireExportImport();
  window.addEventListener('hashchange', routeFromHash);
  routeFromHash();
  renderAll();
}

init();
