import fs from "fs";
import path from "path";
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

const CONTENT_DIR = path.join(process.cwd(), "content");

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
 * Throws if the file does not exist or required frontmatter fields are missing.
 */
export function getMdxBySlug(slug: string): MdxFile {
  const filePath = path.join(CONTENT_DIR, `${slug}.mdx`);

  if (!fs.existsSync(filePath)) {
    throw new Error(`MDX file not found: ${filePath}`);
  }

  const fileContents = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContents);

  return {
    frontmatter: validateFrontmatter(data as Record<string, unknown>, slug),
    content,
    slug,
  };
}

/**
 * Returns all MDX slugs found in the content directory.
 * Used for `generateStaticParams` in dynamic routes.
 */
export function getAllMdxSlugs(): ReadonlyArray<string> {
  if (!fs.existsSync(CONTENT_DIR)) {
    return [];
  }

  return fs
    .readdirSync(CONTENT_DIR)
    .filter((filename) => filename.endsWith(".mdx"))
    .map((filename) => filename.replace(/\.mdx$/, ""));
}

/**
 * Returns all MDX files in the content directory, sorted by `order` frontmatter.
 */
export function getAllMdxFiles(): ReadonlyArray<MdxFile> {
  const slugs = getAllMdxSlugs();

  const files = slugs.map((slug) => getMdxBySlug(slug));

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
  section: string
): ReadonlyArray<MdxFile> {
  return getAllMdxFiles().filter(
    (file) => file.frontmatter.section === section
  );
}
