import type { MdxFile } from "./mdx";
import type { ArticleCardArticle } from "@/components/ui/ArticleCard";

/**
 * Helper de cascade pour la page /content (CTN-3).
 *
 * Calcule les ensembles disjoints Pinned / Latest / All a partir de la
 * liste plate des MDX racine, en appliquant la regle de cascade :
 *
 *   Pinned > Latest > All
 *
 * Pinned consomme 1 slug (PO), Latest prend les N suivants tries par
 * `dateModified` desc (fallback `datePublished`), All recoit tous les
 * autres articles tries par ordre frontmatter (pour rester previsible
 * dans le filtre par theme).
 *
 * Sprint 1 : Trending et Most Read absents (data Matomo pas encore
 * ingeree, cf. CTN-6/7). La cascade se reduit a Pinned + Latest + All.
 */

const DEFAULT_LATEST_LIMIT = 5;

interface ComputeOptions {
  readonly files: ReadonlyArray<MdxFile>;
  readonly locale: string;
  readonly pinnedSlug: string | null;
  readonly latestLimit?: number;
}

export interface ContentSections {
  readonly pinned: ArticleCardArticle | null;
  readonly latest: ReadonlyArray<ArticleCardArticle>;
  readonly all: ReadonlyArray<ArticleCardArticle>;
}

function toArticle(
  file: MdxFile,
  locale: string,
): ArticleCardArticle {
  return {
    title: file.frontmatter.title,
    description: file.frontmatter.description,
    locale,
    slug: file.slug,
    section: file.frontmatter.section ?? null,
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

export function computeContentSections({
  files,
  locale,
  pinnedSlug,
  latestLimit = DEFAULT_LATEST_LIMIT,
}: ComputeOptions): ContentSections {
  const pinnedFile =
    pinnedSlug !== null
      ? files.find((file) => file.slug === pinnedSlug)
      : undefined;

  const pinned = pinnedFile ? toArticle(pinnedFile, locale) : null;

  const remaining = pinnedFile
    ? files.filter((file) => file.slug !== pinnedFile.slug)
    : [...files];

  const latestSource = [...remaining].sort(compareByDateDesc);
  const latest = latestSource
    .slice(0, latestLimit)
    .map((file) => toArticle(file, locale));

  const all = remaining.map((file) => toArticle(file, locale));

  return { pinned, latest, all };
}
