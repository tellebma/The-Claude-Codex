import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { validateThemes, type ThemeKey } from "./themes";

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
  /** Themes thematiques (RG-31) : 1 a 3 cles, dont au moins un type de contenu. */
  readonly themes?: ReadonlyArray<ThemeKey>;
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

  const themes = validateThemes(data["themes"], slug);

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
    themes: themes ?? undefined,
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

// ----------------------------------------------------------------------------
// Helpers landing (RG-32) : stats factuelles + articles recents.
// Tous les calculs sont faits au build (SSG-compatible). Aucune query runtime.
// ----------------------------------------------------------------------------

const SECTIONS_FOR_COUNT: ReadonlyArray<string> = [
  "getting-started",
  "mcp",
  "skills",
  "agents",
  "prompting",
  "use-cases",
  "personas",
  "advanced",
  "limits",
  "reference",
];

/**
 * Compte les articles MDX deduplique sur le slug : si un article existe en
 * FR et en EN, il compte comme 1 seul article (la traduction n'augmente pas
 * le total). Inclut les articles racine et les articles de chaque section.
 * (RG-32)
 */
export function countAllArticles(): number {
  const slugs = new Set<string>();
  for (const slug of getAllMdxSlugs("fr")) slugs.add(slug);
  for (const slug of getAllMdxSlugs("en")) slugs.add(slug);
  for (const section of SECTIONS_FOR_COUNT) {
    for (const slug of getSectionMdxSlugs(section, "fr")) {
      slugs.add(`${section}/${slug}`);
    }
    for (const slug of getSectionMdxSlugs(section, "en")) {
      slugs.add(`${section}/${slug}`);
    }
  }
  return slugs.size;
}

/** Nombre de sections de documentation actives (RG-32). */
export function countAllSections(): number {
  return SECTIONS_FOR_COUNT.length;
}

/** Date de derniere modification globale du contenu (RG-32). */
export function getLastModifiedDate(): Date | null {
  const dates: number[] = [];
  for (const locale of ["fr", "en"] as const) {
    for (const file of getAllMdxFiles(locale)) {
      const dm = file.frontmatter.dateModified;
      if (typeof dm === "string") {
        const t = Date.parse(dm);
        if (!Number.isNaN(t)) dates.push(t);
      }
    }
    for (const section of SECTIONS_FOR_COUNT) {
      for (const file of getAllSectionMdxFiles(section, locale)) {
        const dm = file.frontmatter.dateModified;
        if (typeof dm === "string") {
          const t = Date.parse(dm);
          if (!Number.isNaN(t)) dates.push(t);
        }
      }
    }
  }
  if (dates.length === 0) return null;
  return new Date(Math.max(...dates));
}

/**
 * Article enrichi avec son chemin (section + slug ou racine) et sa locale,
 * pour generer le href local correctement (RG-32).
 */
export interface RecentArticle {
  readonly title: string;
  readonly description: string;
  readonly section: string | null;
  readonly slug: string;
  readonly locale: string;
  readonly dateModified: string;
  readonly themes?: ReadonlyArray<ThemeKey>;
}

/**
 * Retourne les N articles les plus recemment modifies (toutes sections,
 * toutes locales). Dedoublonne par "section/slug" en gardant la version
 * dans la locale preferee. (RG-32)
 */
export function getMostRecentArticles(
  limit: number,
  preferredLocale: string = DEFAULT_LOCALE
): ReadonlyArray<RecentArticle> {
  type Entry = RecentArticle & { ts: number };
  const seen = new Map<string, Entry>();

  function addEntry(file: MdxFile, section: string | null, locale: string): void {
    const dm = file.frontmatter.dateModified;
    if (typeof dm !== "string") return;
    const ts = Date.parse(dm);
    if (Number.isNaN(ts)) return;
    const key = section ? `${section}/${file.slug}` : file.slug;
    const existing = seen.get(key);
    if (
      !existing ||
      ts > existing.ts ||
      (ts === existing.ts && locale === preferredLocale)
    ) {
      seen.set(key, {
        title: file.frontmatter.title,
        description: file.frontmatter.description,
        section,
        slug: file.slug,
        locale,
        dateModified: dm,
        themes: file.frontmatter.themes,
        ts,
      });
    }
  }

  for (const locale of ["fr", "en"] as const) {
    for (const file of getAllMdxFiles(locale)) {
      addEntry(file, null, locale);
    }
    for (const section of SECTIONS_FOR_COUNT) {
      for (const file of getAllSectionMdxFiles(section, locale)) {
        addEntry(file, section, locale);
      }
    }
  }

  return [...seen.values()]
    .sort((a, b) => b.ts - a.ts)
    .slice(0, limit)
    .map(({ ts: _ts, ...rest }) => rest);
}
