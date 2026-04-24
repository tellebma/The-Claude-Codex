import { getAllMdxFiles } from "@/lib/mdx";

/**
 * Minimal shape needed to render a recent article card.
 */
export interface RecentArticle {
  readonly title: string;
  readonly description: string;
  readonly href: string;
  readonly badge?: string;
  readonly datePublished?: string;
}

/**
 * Returns the most recently published root-level articles for a locale,
 * sorted by `datePublished` (descending). Articles without a publish date
 * are ignored so the list always reflects real editorial output.
 */
export function getRecentArticles(
  locale: string,
  limit = 4,
): ReadonlyArray<RecentArticle> {
  const files = getAllMdxFiles(locale);

  const dated = files
    .filter((file) => typeof file.frontmatter.datePublished === "string")
    .map((file) => ({
      title: file.frontmatter.title,
      description: file.frontmatter.description,
      href: `/content/${file.slug}`,
      badge: file.frontmatter.badge,
      datePublished: file.frontmatter.datePublished,
    }));

  const sorted = [...dated].sort((a, b) => {
    const da = a.datePublished ?? "";
    const db = b.datePublished ?? "";
    return db.localeCompare(da);
  });

  return sorted.slice(0, limit);
}
