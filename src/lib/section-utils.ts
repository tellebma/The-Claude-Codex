import { getAllSectionMdxFiles, type MdxFile } from "@/lib/mdx";

/**
 * Resolve previous and next pages within a section, based on frontmatter order.
 */
export function getAdjacentPages(
  section: string,
  currentSlug: string,
  locale: string
): { prev: MdxFile | null; next: MdxFile | null } {
  const allFiles = getAllSectionMdxFiles(section, locale);
  const currentIndex = allFiles.findIndex(
    (f) => f.slug === `${section}/${currentSlug}`
  );

  return {
    prev: currentIndex > 0 ? allFiles[currentIndex - 1] : null,
    next:
      currentIndex !== -1 && currentIndex < allFiles.length - 1
        ? allFiles[currentIndex + 1]
        : null,
  };
}

/**
 * Extract the simple slug from a section-prefixed slug.
 * E.g. "mcp/setup" -> "setup"
 */
export function extractSimpleSlug(fullSlug: string): string {
  const parts = fullSlug.split("/");
  return parts.at(-1) ?? "";
}

const SAFE_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * Whitelist-validate a slug before interpolating it into an href to defuse
 * stored-XSS attack paths flagged by CodeQL. Slugs that do not match the
 * canonical pattern (lowercase alphanumerics and dashes) return "" which
 * produces a link to the section landing page, a graceful fallback.
 */
export function sanitizeSlugForHref(slug: string): string {
  return SAFE_SLUG_PATTERN.test(slug) ? slug : "";
}
