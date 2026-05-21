import type { MdxFile } from "./mdx";
import type { ArticleCardArticle } from "@/components/ui/ArticleCard";
import type {
  ArticleLocale,
  ArticleStatsEntry,
  ArticleStatsFile,
} from "@/data/article-stats";

/**
 * Helper de cascade pour la page /content (CTN-3 + CTN-8/9).
 *
 * Calcule les ensembles disjoints Pinned / Trending / Most read /
 * Latest / All a partir de la liste plate des MDX racine, en
 * appliquant la regle de cascade :
 *
 *   Pinned > Trending > Most read > Latest > All
 *
 * Sprint 2 : Trending et Most read sont calcules a partir du snapshot
 * Matomo (`src/data/article-stats.json`, charge via `loadArticleStats`).
 * Si le snapshot est absent ou vide (fallback gracieux), ces sections
 * sont vides et le DOM doit les omettre.
 */

const DEFAULT_LATEST_LIMIT = 5;
const DEFAULT_MOST_READ_LIMIT = 6;
const DEFAULT_TRENDING_LIMIT = 5;
const DEFAULT_TRENDING_MIN_LAST7D = 20;

interface ComputeOptions {
  readonly files: ReadonlyArray<MdxFile>;
  readonly locale: ArticleLocale;
  readonly pinnedSlug: string | null;
  readonly stats?: ArticleStatsFile | null;
  readonly latestLimit?: number;
  readonly mostReadLimit?: number;
  readonly trendingLimit?: number;
  readonly trendingMinLast7d?: number;
}

export interface TrendingItem {
  readonly article: ArticleCardArticle;
  readonly deltaPct: number;
  readonly pageviewsLast7d: number;
}

export interface ContentSections {
  readonly pinned: ArticleCardArticle | null;
  readonly trending: ReadonlyArray<TrendingItem>;
  readonly mostRead: ReadonlyArray<ArticleCardArticle>;
  readonly latest: ReadonlyArray<ArticleCardArticle>;
  readonly all: ReadonlyArray<ArticleCardArticle>;
}

function toArticle(file: MdxFile, locale: string): ArticleCardArticle {
  // Les fichiers passes a computeContentSections viennent de
  // getAllMdxFiles(locale) (articles racine `content/{locale}/*.mdx`).
  // Leur frontmatter `section` est un tag de categorie pour la sidebar
  // (ex: "future", "mcp", "prompting"), PAS un segment de route. Forcer
  // section=null pour que ArticleCard genere /content/{slug} et evite
  // un 404 (cf. bugfix observe en preview Vercel develop 2026-05-20).
  return {
    title: file.frontmatter.title,
    description: file.frontmatter.description,
    locale,
    slug: file.slug,
    section: null,
    dateModified:
      file.frontmatter.dateModified ?? file.frontmatter.datePublished ?? "",
    themes: file.frontmatter.themes,
  };
}

function parseDate(file: MdxFile): number {
  const value =
    file.frontmatter.dateModified ?? file.frontmatter.datePublished;
  if (!value) return 0;
  const ts = Date.parse(value);
  return Number.isNaN(ts) ? 0 : ts;
}

function compareByDateDesc(a: MdxFile, b: MdxFile): number {
  return parseDate(b) - parseDate(a);
}

interface StatsLookup {
  readonly byKey: ReadonlyMap<string, ArticleStatsEntry>;
}

function buildStatsLookup(
  stats: ArticleStatsFile | null | undefined,
  locale: ArticleLocale,
): StatsLookup {
  const byKey = new Map<string, ArticleStatsEntry>();
  if (stats) {
    for (const entry of stats.articles) {
      if (entry.locale !== locale) continue;
      byKey.set(entry.slug, entry);
    }
  }
  return { byKey };
}

export interface SelectMostReadOptions {
  readonly stats: ArticleStatsFile | null | undefined;
  readonly locale: ArticleLocale;
  readonly files: ReadonlyArray<MdxFile>;
  readonly excludeSlugs: ReadonlySet<string>;
  readonly limit?: number;
}

export function selectMostRead({
  stats,
  locale,
  files,
  excludeSlugs,
  limit = DEFAULT_MOST_READ_LIMIT,
}: SelectMostReadOptions): ReadonlyArray<ArticleCardArticle> {
  const lookup = buildStatsLookup(stats, locale);
  if (lookup.byKey.size === 0) return [];
  const candidates: Array<{ file: MdxFile; pageviewsLast30d: number }> = [];
  for (const file of files) {
    if (excludeSlugs.has(file.slug)) continue;
    const entry = lookup.byKey.get(file.slug);
    if (!entry || entry.pageviewsLast30d <= 0) continue;
    candidates.push({ file, pageviewsLast30d: entry.pageviewsLast30d });
  }
  candidates.sort((a, b) => b.pageviewsLast30d - a.pageviewsLast30d);
  return candidates.slice(0, limit).map(({ file }) => toArticle(file, locale));
}

export interface SelectTrendingOptions {
  readonly stats: ArticleStatsFile | null | undefined;
  readonly locale: ArticleLocale;
  readonly files: ReadonlyArray<MdxFile>;
  readonly excludeSlugs: ReadonlySet<string>;
  readonly limit?: number;
  readonly minPageviewsLast7d?: number;
}

export function selectTrending({
  stats,
  locale,
  files,
  excludeSlugs,
  limit = DEFAULT_TRENDING_LIMIT,
  minPageviewsLast7d = DEFAULT_TRENDING_MIN_LAST7D,
}: SelectTrendingOptions): ReadonlyArray<TrendingItem> {
  const lookup = buildStatsLookup(stats, locale);
  if (lookup.byKey.size === 0) return [];
  const candidates: Array<{
    file: MdxFile;
    deltaPct: number;
    pageviewsLast7d: number;
  }> = [];
  for (const file of files) {
    if (excludeSlugs.has(file.slug)) continue;
    const entry = lookup.byKey.get(file.slug);
    if (!entry) continue;
    if (entry.deltaPct <= 0) continue;
    if (entry.pageviewsLast7d <= minPageviewsLast7d) continue;
    candidates.push({
      file,
      deltaPct: entry.deltaPct,
      pageviewsLast7d: entry.pageviewsLast7d,
    });
  }
  candidates.sort((a, b) => b.deltaPct - a.deltaPct);
  return candidates.slice(0, limit).map((c) => ({
    article: toArticle(c.file, locale),
    deltaPct: c.deltaPct,
    pageviewsLast7d: c.pageviewsLast7d,
  }));
}

export function computeContentSections({
  files,
  locale,
  pinnedSlug,
  stats,
  latestLimit = DEFAULT_LATEST_LIMIT,
  mostReadLimit = DEFAULT_MOST_READ_LIMIT,
  trendingLimit = DEFAULT_TRENDING_LIMIT,
  trendingMinLast7d = DEFAULT_TRENDING_MIN_LAST7D,
}: ComputeOptions): ContentSections {
  const pinnedFile =
    pinnedSlug === null
      ? undefined
      : files.find((file) => file.slug === pinnedSlug);

  const pinned = pinnedFile ? toArticle(pinnedFile, locale) : null;
  const used = new Set<string>();
  if (pinnedFile) used.add(pinnedFile.slug);

  const trending = selectTrending({
    stats,
    locale,
    files,
    excludeSlugs: used,
    limit: trendingLimit,
    minPageviewsLast7d: trendingMinLast7d,
  });
  for (const item of trending) used.add(item.article.slug);

  const mostRead = selectMostRead({
    stats,
    locale,
    files,
    excludeSlugs: used,
    limit: mostReadLimit,
  });
  for (const article of mostRead) used.add(article.slug);

  const latestCandidates = [...files]
    .filter((file) => !used.has(file.slug))
    .sort(compareByDateDesc);
  const latest = latestCandidates
    .slice(0, latestLimit)
    .map((file) => toArticle(file, locale));

  // `all` alimente le filtre par theme (CTN-5). On exclut uniquement le
  // Pinned : Trending et Most read sont des vues editoriales mises en
  // avant en haut de page, on souhaite que les filtres themes puissent
  // toujours retrouver ces articles dans la liste complete plus bas.
  const all = files
    .filter((file) => file.slug !== pinnedFile?.slug)
    .map((file) => toArticle(file, locale));

  return { pinned, trending, mostRead, latest, all };
}
