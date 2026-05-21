/**
 * Loader du snapshot Matomo `src/data/article-stats.json` (CTN-8/9).
 *
 * Le fichier JSON est genere par le workflow hebdo CTN-7 et peut etre
 * remplace par un override PO (`article-stats.override.json`). Tant
 * que ni l'auto ni l'override n'existent ou que les donnees sont
 * vides, le loader retourne `null` et les sections Trending /
 * Most read sont absentes du DOM (fallback gracieux, cf. spec §4.4
 * `seo-technical-decisions.md`).
 *
 * Lecture via `fs.readFileSync` + `JSON.parse` : on est cote Node.js
 * pendant `next build` (output: 'export', SSG), pas en Edge runtime,
 * donc fs est disponible. On evite `require(...)` qui declenche
 * la regle Sonar S6671 contre les require statements TypeScript.
 */

import fs from "node:fs";
import path from "node:path";
import { isArticleStatsFile, type ArticleStatsFile } from "@/data/article-stats";

const DATA_DIR = "src/data";
const AUTO_FILENAME = "article-stats.json";
const OVERRIDE_FILENAME = "article-stats.override.json";

function tryLoadJson(absolutePath: string): unknown {
  try {
    if (!fs.existsSync(absolutePath)) return null;
    const raw = fs.readFileSync(absolutePath, "utf-8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function isNonEmptyStatsFile(value: unknown): value is ArticleStatsFile {
  if (!isArticleStatsFile(value)) return false;
  return value.articles.length > 0;
}

export function loadArticleStats(): ArticleStatsFile | null {
  const root = process.cwd();
  const override = tryLoadJson(path.join(root, DATA_DIR, OVERRIDE_FILENAME));
  if (isNonEmptyStatsFile(override)) {
    return override;
  }
  const auto = tryLoadJson(path.join(root, DATA_DIR, AUTO_FILENAME));
  if (isNonEmptyStatsFile(auto)) {
    return auto;
  }
  return null;
}
