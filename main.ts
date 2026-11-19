// Leonida Crown — the entry program for make.fun's gta6-trophy-guide-01 bounty.
//
// The guide itself is this directory's app/ folder: plain static files a browser
// opens at app/index.html (ES modules, one stylesheet, no build step), fully
// offline — it loads nothing over the network, and its trophy list and cited
// guides live in app/data/trophies.json. screenshots/ holds four real renders
// of the app, the first by name being the cover.
//
// This program hands the entry in: it copies app/ and screenshots/ from beside
// this file to the output directory and writes dossier.json there — the summary
// the judge reads (the screenshots, the first load's files and bytes, and the
// source) — with the vendored make.fun library. vendor/makefun-frontend.ts is
// the kit's copy, unchanged: the scorer requires dossier.json to be byte for
// byte what its own copy writes.
//
// Run locally with:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// In the grader's container MAKEFUN_OUTPUT_DIR is unset and /output is used.
// Serve the guide locally with `node serve.ts`, then open http://localhost:8080.

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(outputDir, { recursive: true });
cpSync(join(repoRoot, 'app'), join(outputDir, 'app'), { recursive: true });
mkdirSync(join(outputDir, 'screenshots'), { recursive: true });
if (existsSync(join(repoRoot, 'screenshots'))) {
  cpSync(join(repoRoot, 'screenshots'), join(outputDir, 'screenshots'), { recursive: true });
}

// The scorer's own caps: only text_max_bytes shapes the bytes; the others refuse
// an entry the scorer would refuse (more than 4 screenshots or one over 256 KiB;
// more than 993 files and directories in app/ or 48 MiB of app files — app/
// counts beside /output's own 1000-entry cap, its screenshots/ and dossier.json).
writeFileSync(
  join(outputDir, 'dossier.json'),
  buildDossier(outputDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 50331648,
  }),
);
