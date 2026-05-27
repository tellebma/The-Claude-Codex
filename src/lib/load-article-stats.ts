/**
 * Loader du snapshot Matomo `src/data/article-stats.json` (CTN-8/9).
 *
 * Le fichier JSON est genere par le workflow hebdo CTN-7. Un placeholder
 * vide est committe initialement pour que l'import statique compile
 * meme avant le premier run du workflow. Tant que `articles` est vide,
 * le loader retourne `null` et les sections Trending / Most read sont
 * absentes du DOM (fallback gracieux, cf. spec §4.4
 * `seo-technical-decisions.md`).
 *
 * On utilise un `import` JSON statique au lieu de `fs.readFileSync`
 * pour eviter le security hotspot Sonar S2092 sur les acces filesystem
 * et le code smell S6671 sur les `require` statements.
 */

import articleStatsJson from "@/data/article-stats.json";
import { isArticleStatsFile, type ArticleStatsFile } from "@/data/article-stats";

function isNonEmptyStatsFile(value: unknown): value is ArticleStatsFile {
  if (!isArticleStatsFile(value)) return false;
  return value.articles.length > 0;
}

export function loadArticleStats(): ArticleStatsFile | null {
  if (isNonEmptyStatsFile(articleStatsJson)) {
    return articleStatsJson;
  }
  return null;
}
