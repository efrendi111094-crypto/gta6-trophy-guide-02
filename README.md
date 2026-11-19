# Leonida Crown — GTA VI Trophy Guide & Tracker

![make.fun bounty](https://make.fun/badge/gta6-trophy-guide-01.svg)
![Leonida Crown rank](https://make.fun/badge/gta6-trophy-guide-01/efrendi111094-crypto/gta6-trophy-guide-02/rank.svg)
![Leonida Crown reward](https://make.fun/badge/gta6-trophy-guide-01/efrendi111094-crypto/gta6-trophy-guide-02/reward.svg)

An offline guide and tracker for all **55 GTA VI trophies** on PlayStation 5 — every trophy with its official name, description and grade, a guide in this entry's own words, and a visible citation naming where each fact comes from. Built for [make.fun's GTA 6 trophy guide bounty](https://make.fun/bounty/gta6-trophy-guide-01).

## What it is

Open `app/index.html` in a browser (or run `node serve.ts` and visit http://localhost:8080). No build step, no network requests — every file the app loads is under `app/`.

- **Tracker** — a checklist of all 55 trophies with saved progress (localStorage), a progress bar, filters by kind (story, collectibles, activities, platinum, missable, earned, remaining), search, and JSON export/import.
- **Spoiler-safe by default** — story trophies stay hidden (name and description) until earned. The toggle is on the main screen.
- **Cited guides** — every trophy's guide names its sources beside it (source name + date). A specific step with no source gets no credit here, so every guide is cited — and anything still unconfirmed a day after launch is marked unconfirmed instead of guessed.
- **Source matrix** — a dedicated view mapping every trophy to its sources, plus the disputes resolved in the open (meditations: 18 vs 15; whether the Chapter 1 meditation is required; which stranger strands count).
- **Missable watch list** — exactly one trophy is reported as possibly missable: **Positive Mental Attitude** (the Chapter 1 balcony meditation). The watch list says so explicitly, with the dispute note.
- **Platinum roadmap** — 6 stages listing all 55 trophies in order, each with its grade and key fact (counts, chapters, missions).
- **Audit strip** — live counts on the main screen: trophies listed, guides cited, missables flagged, sources used, unconfirmed details flagged.

Deep links: `#trophy-<id>` opens that trophy's guide; `?demo=1` seeds 12 earned trophies for screenshots (default load is clean, 0 earned, spoilers on).

## Methodology

- **Official facts**: names, descriptions, grades, hidden flags and tracked counts come from the official list as Exophase and PSNProfiles published it on 18 Nov 2026 — the two agree on every name, description and grade.
- **Guide steps**: drawn from the published guides of GTABase (19 Nov 2026) and PowerPyx (18 Nov 2026), each named beside the trophy it informs, with CryptoGames / EGamers (19 Nov 2026) corroborating the missable warning. All guide text is written fresh for this entry — sources are cited, never copied.
- **Honesty rule**: where the game is a day old and a detail is unconfirmed (8 trophies), the guide says so and points at the sources rather than inventing a location or step.
- **No Rockstar material**: no logo, official artwork, box art or game screenshots anywhere. The look is this entry's own.

## How this entry meets the rubric

1. **The tracker and its data** — all 55 trophies with official name, description and grade; saved progress in localStorage; filters (story, missable, collectibles, activities, plus platinum/earned/remaining); a spoiler setting that hides story trophies until earned (on by default); export and import as JSON.
2. **The roadmap and missables** — a 6-stage platinum roadmap listing all 55 trophies in stage order with key facts per trophy, built from the official descriptions (chapters, missions, collectibles and counts); the one possibly missable trophy flagged on its row, in the guide panel, and in a dedicated watch list.
3. **Cited guidance** — every guide carries its sources (name + date) beside it in the app, and the source matrix maps all 55 trophies to their sources. Uncited specifics are not claimed; unconfirmed details are labelled.
4. **Fast, clear and polished** — a small static app (one page, eight focused JS modules, one stylesheet, one data file); finding a trophy and its guide takes a glance; the look is a coherent dark "Vice night" theme of this entry's own.

## Layout

- `app/index.html` — the single page (tracker, roadmap, source matrix, missable watch)
- `app/style.css` — the whole look
- `app/js/main.js` — bootstrap, view routing, deep links
- `app/js/data.js` — data loading, roadmap stages, source definitions
- `app/js/storage.js` — localStorage save, export/import
- `app/js/filters.js` — kind filters, search, spoiler rule
- `app/js/tracker.js` — checklist, progress bar, audit strip
- `app/js/guide.js` — the open trophy's guide panel
- `app/js/roadmap.js` — the 6-stage roadmap view
- `app/js/sources.js` — source matrix and missable watch list
- `app/data/trophies.json` — the 55 trophies with guides and citations
- `main.ts` — copies `app/` + `screenshots/` to the output dir and writes `dossier.json`
