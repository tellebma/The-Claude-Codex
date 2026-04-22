import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

/**
 * Frontmatter shape expected in MDX content files.
 */
export interface MdxFrontmatter {
  readonly title: string;
  readonly description: string;
  readonly badge?: string;
  readonly order?: number;
  readonly section?: string;
  readonly datePublished?: string;
  readonly dateModified?: string;
}

/**
 * Parsed MDX file with frontmatter and raw MDX source.
 */
export interface MdxFile {
  readonly frontmatter: MdxFrontmatter;
  readonly content: string;
  readonly slug: string;
}

const DEFAULT_LOCALE = "fr";

/**
 * Returns the content directory for a given locale.
 * Falls back to the default locale ("fr") if the locale directory doesn't exist.
 */
function getContentDir(locale: string = DEFAULT_LOCALE): string {
  return path.join(process.cwd(), "content", locale);
}

/**
 * Validates that gray-matter parsed data contains the required frontmatter fields.
 * Throws a descriptive error at build time if a content file is missing required fields,
 * rather than letting undefined values propagate silently.
 */
function validateFrontmatter(
  data: Record<string, unknown>,
  slug: string
): MdxFrontmatter {
  if (typeof data["title"] !== "string" || data["title"].trim() === "") {
    throw new Error(
      `MDX frontmatter error in "${slug}.mdx": missing or empty required field "title".`
    );
  }
  if (
    typeof data["description"] !== "string" ||
    data["description"].trim() === ""
  ) {
    throw new Error(
      `MDX frontmatter error in "${slug}.mdx": missing or empty required field "description".`
    );
  }

  return {
    title: data["title"],
    description: data["description"],
    badge:
      typeof data["badge"] === "string" ? data["badge"] : undefined,
    order:
      typeof data["order"] === "number" ? data["order"] : undefined,
    section:
      typeof data["section"] === "string" ? data["section"] : undefined,
    datePublished:
      typeof data["datePublished"] === "string"
        ? data["datePublished"]
        : undefined,
    dateModified:
      typeof data["dateModified"] === "string"
        ? data["dateModified"]
        : undefined,
  };
}

/**
 * Reads a single MDX file from the content directory by slug.
 * Returns parsed frontmatter and raw MDX source string.
 * Falls back to the default locale if the file doesn't exist in the requested locale.
 * Throws if the file does not exist in either locale or required frontmatter fields are missing.
 */
export function getMdxBySlug(slug: string, locale: string = DEFAULT_LOCALE): MdxFile {
  const filePath = path.join(getContentDir(locale), `${slug}.mdx`);
  const fallbackPath = path.join(getContentDir(DEFAULT_LOCALE), `${slug}.mdx`);

  const resolvedPath = fs.existsSync(filePath) ? filePath : fallbackPath;

  if (!fs.existsSync(resolvedPath)) {
    throw new Error(`MDX file not found: ${filePath} (also tried fallback: ${fallbackPath})`);
  }

  const fileContents = fs.readFileSync(resolvedPath, "utf-8");
  const { data, content } = matter(fileContents);

  return {
    frontmatter: validateFrontmatter(data as Record<string, unknown>, slug),
    content,
    slug,
  };
}

/**
 * Returns all MDX slugs found in the content directory for a given locale.
 * Used for `generateStaticParams` in dynamic routes.
 */
export function getAllMdxSlugs(locale: string = DEFAULT_LOCALE): ReadonlyArray<string> {
  const contentDir = getContentDir(locale);

  if (!fs.existsSync(contentDir)) {
    return [];
  }

  return fs
    .readdirSync(contentDir)
    .filter((filename) => filename.endsWith(".mdx"))
    .map((filename) => filename.replace(/\.mdx$/, ""));
}

/**
 * Returns all MDX files in the content directory, sorted by `order` frontmatter.
 */
export function getAllMdxFiles(locale: string = DEFAULT_LOCALE): ReadonlyArray<MdxFile> {
  const slugs = getAllMdxSlugs(locale);

  const files = slugs.map((slug) => getMdxBySlug(slug, locale));

  return [...files].sort((a, b) => {
    const orderA = a.frontmatter.order ?? 999;
    const orderB = b.frontmatter.order ?? 999;
    return orderA - orderB;
  });
}

/**
 * Returns MDX files filtered by section, sorted by order.
 */
export function getMdxFilesBySection(
  section: string,
  locale: string = DEFAULT_LOCALE
): ReadonlyArray<MdxFile> {
  return getAllMdxFiles(locale).filter(
    (file) => file.frontmatter.section === section
  );
}

/**
 * Returns all MDX slugs found in a section subdirectory (e.g. "getting-started").
 * Used for `generateStaticParams` in section-specific dynamic routes.
 */
export function getSectionMdxSlugs(
  section: string,
  locale: string = DEFAULT_LOCALE
): ReadonlyArray<string> {
  const sectionDir = path.join(getContentDir(locale), section);

  if (!fs.existsSync(sectionDir)) {
    return [];
  }

  return fs
    .readdirSync(sectionDir)
    .filter((filename) => filename.endsWith(".mdx") && filename !== "index.mdx")
    .map((filename) => filename.replace(/\.mdx$/, ""));
}

/**
 * Reads a single MDX file from a section subdirectory by slug.
 * Falls back to the default locale if the file doesn't exist in the requested locale.
 */
export function getSectionMdxBySlug(
  section: string,
  slug: string,
  locale: string = DEFAULT_LOCALE
): MdxFile {
  return getMdxBySlug(`${section}/${slug}`, locale);
}

/**
 * Returns all MDX files in a section subdirectory, sorted by `order` frontmatter.
 */
export function getAllSectionMdxFiles(
  section: string,
  locale: string = DEFAULT_LOCALE
): ReadonlyArray<MdxFile> {
  const slugs = getSectionMdxSlugs(section, locale);

  const files = slugs.map((slug) =>
    getSectionMdxBySlug(section, slug, locale)
  );

  return [...files].sort((a, b) => {
    const orderA = a.frontmatter.order ?? 999;
    const orderB = b.frontmatter.order ?? 999;
    return orderA - orderB;
  });
}
