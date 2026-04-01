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
  return parts[parts.length - 1];
}
