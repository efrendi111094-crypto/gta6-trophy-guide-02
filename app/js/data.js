// Trophy data: loading the official list and the shared lookups every view uses.
// The data file itself (app/data/trophies.json) holds the 55 official trophies with
// this entry's own guides and per-trophy citations; this module only reads it.

export const DATA_URL = 'data/trophies.json';

/** The six roadmap stages, in the order a player should work through them. */
export const STAGES = [
  { n: 1, title: 'Chapter 1 — First Steps', blurb: 'Play the opening, start Kenton\u2019s treasure hunt, and do the one possibly missable meditation before the chapter ends.' },
  { n: 2, title: 'Chapters 2–3 — Partners in Vice City', blurb: 'Both characters are playable together now: story missions, character quest lines, and the partner trophies.' },
  { n: 3, title: 'Chapters 4–5 — Finish the Story', blurb: 'The last chapters and the final mission. Free roam continues after the credits, so everything after this is clean-up.' },
  { n: 4, title: 'Strangers, Odd Jobs & Mysteries', blurb: 'Stranger strands, Cal\u2019s fishing, the arcade, the bowling robbery and the hidden oddities — several still unconfirmed by guides.' },
  { n: 5, title: 'Collectibles & Exploring Leonida', blurb: 'Finish the meditations, card sets, WAiNK scans, vehicle scans, garages and the full map.' },
  { n: 6, title: 'Clean-Up, 100% & the Platinum', blurb: 'The long tail: stunts, ranges, races, challenges, vaults, gang operations, and A Long Road — then the platinum pops.' },
];

/** The sources this guide cites, matched against each trophy's sources list. */
export const SOURCE_DEFS = [
  { key: 'official', match: 'Exophase', name: 'Official list via Exophase & PSNProfiles', date: '18 Nov 2026', covers: 'All 55 names, descriptions, grades, hidden flags and tracked counts. The two lists agree on every name, description and grade.' },
  { key: 'gtabase', match: 'GTABase', name: 'GTABase trophy guide & roadmap', date: '19 Nov 2026', covers: 'Step-by-step unlock tips for most trophies, the 100% checklist thresholds, and the missable warning.' },
  { key: 'powerpyx', match: 'PowerPyx', name: 'PowerPyx trophy guide & roadmap', date: '18 Nov 2026', covers: 'Roadmap structure, the missable meditation warning, and the platinum estimate (~200 hours, difficulty 4/10).' },
  { key: 'crypto', match: 'CryptoGames', name: 'CryptoGames / EGamers trophy lists', date: '19 Nov 2026', covers: 'Independent corroboration of the missable warning and the 18-vs-15 meditation dispute.' },
];

/** The 12 trophies ?demo=1 seeds as earned, for screenshots only. */
export const DEMO_EARNED = [2, 3, 8, 16, 20, 21, 31, 35, 42, 46, 53, 55];

/** Load the trophy data file. Returns { trophies, meta }. */
export async function loadTrophies() {
  const res = await fetch(DATA_URL);
  if (!res.ok) throw new Error('Could not load the trophy list.');
  const data = await res.json();
  return { trophies: data.trophies, meta: data };
}

export function trophyById(trophies, id) {
  return trophies.find((t) => t.id === id) || null;
}

export function kindLabel(kind) {
  const labels = { story: 'Story', collectibles: 'Collectibles', activities: 'Activities', platinum: 'Platinum', missable: 'Missable' };
  return labels[kind] || kind;
}

/** Which of the named sources a trophy's guide cites. */
export function trophySources(trophy) {
  return SOURCE_DEFS.filter((def) => trophy.sources.some((s) => s.includes(def.match)));
}

/** A one-line fact for roadmap rows: the count the trophy tracks, or its kind. */
export function trophyFact(trophy) {
  return trophy.countLabel || kindLabel(trophy.kind);
}
