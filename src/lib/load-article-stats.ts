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
 * `require` est utilise volontairement : le build SSG attache les
 * JSON statiques au bundle a la compilation. `await import` ne peut
 * pas etre appele dans un Server Component synchrone.
 */

import { isArticleStatsFile, type ArticleStatsFile } from "@/data/article-stats";

function tryRequire(modulePath: string): unknown {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require(modulePath);
  } catch {
    return null;
  }
}

function isNonEmptyStatsFile(value: unknown): value is ArticleStatsFile {
  if (!isArticleStatsFile(value)) return false;
  return value.articles.length > 0;
}

export function loadArticleStats(): ArticleStatsFile | null {
  const override = tryRequire("@/data/article-stats.override.json");
  if (isNonEmptyStatsFile(override)) {
    return override;
  }
  const auto = tryRequire("@/data/article-stats.json");
  if (isNonEmptyStatsFile(auto)) {
    return auto;
  }
  return null;
}
