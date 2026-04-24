/**
 * Generates full-text search indexes consumed by the SearchDialog component.
 *
 * Walks every MDX file under /content/{fr,en}/**, strips MDX-specific syntax,
 * extracts headings and plain-text body, and writes two JSON files:
 *   - /public/search-index-fr.json
 *   - /public/search-index-en.json
 *
 * The indexes are served as static assets and fetched lazily by the client
 * the first time the search dialog is opened.
 *
 * Runs in the prebuild step. Also runnable via `npm run build:search-index`.
 */

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const ROOT_DIR = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const CONTENT_DIR = path.join(ROOT_DIR, "content");
const PUBLIC_DIR = path.join(ROOT_DIR, "public");

const BODY_MAX_CHARS = 12_000;

interface SearchDoc {
  readonly title: string;
  readonly description: string;
  readonly section: string;
  readonly href: string;
  readonly locale: "fr" | "en";
  readonly headings: ReadonlyArray<string>;
  readonly body: string;
}

function walkMdx(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const out: string[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...walkMdx(full));
    } else if (entry.isFile() && entry.name.endsWith(".mdx")) {
      out.push(full);
    }
  }
  return out;
}

function stripMdx(raw: string): string {
  let out = raw;
  out = out.replaceAll(/^\s*(import|export)[^\n]*\n/gm, "");
  out = out.replaceAll(/<([A-Z][A-Za-z0-9]*)\b[\s\S]*?\/>/g, " ");
  out = out.replaceAll(/<([A-Z][A-Za-z0-9]*)\b[^>]*>/g, " ");
  out = out.replaceAll(/<([A-Z][A-Za-z0-9]*)\b[\s\S]*?>/g, " ");
  out = out.replaceAll(/<\/[A-Z][A-Za-z0-9]*>/g, " ");
  out = out.replaceAll(/^\s*[}\])]+\s*$/gm, "");
  out = out.replaceAll(/```[\s\S]*?```/g, " ");
  out = out.replaceAll(/`([^`]+)`/g, "$1");
  out = out.replaceAll(/\*\*([^*]+)\*\*/g, "$1");
  out = out.replaceAll(/\*([^*]+)\*/g, "$1");
  out = out.replaceAll(/!\[[^\]]*\]\([^)]*\)/g, " ");
  out = out.replaceAll(/\[([^\]]+)\]\([^)]+\)/g, "$1");
  return out;
}

function extractHeadings(markdown: string): string[] {
  const headings: string[] = [];
  const re = /^#{2,4}\s+(.+)$/gm;
  let match: RegExpExecArray | null;
  while ((match = re.exec(markdown)) !== null) {
    const text = match[1]?.trim();
    if (text) headings.push(text);
  }
  return headings;
}

function collapseWhitespace(text: string): string {
  return text.replaceAll(/\s+/g, " ").trim();
}

function bodyFromStripped(stripped: string): string {
  const withoutHeadings = stripped.replaceAll(/^#{1,6}\s+.+$/gm, " ");
  return collapseWhitespace(withoutHeadings).slice(0, BODY_MAX_CHARS);
}

function hrefFromFile(relPath: string, locale: string): string {
  const withoutExt = relPath.replaceAll(/\.mdx$/g, "");
  const parts = withoutExt.split("/");
  if (parts.length >= 2) {
    return `/${locale}/${parts.join("/")}`;
  }
  return `/${locale}/content/${parts[0]}`;
}

const SECTION_LABELS: Record<string, Record<string, string>> = {
  fr: {
    "getting-started": "Démarrer",
    mcp: "MCP",
    skills: "Skills",
    plugins: "Plugins",
    agents: "Agents",
    prompting: "Prompting",
    advanced: "Avancé",
    enterprise: "Entreprise",
    future: "Futur",
    personas: "Personas",
    "use-cases": "Cas d'usage",
    limits: "Limites",
    reference: "Référence",
    articles: "Article",
  },
  en: {
    "getting-started": "Getting started",
    mcp: "MCP",
    skills: "Skills",
    plugins: "Plugins",
    agents: "Agents",
    prompting: "Prompting",
    advanced: "Advanced",
    enterprise: "Enterprise",
    future: "Future",
    personas: "Personas",
    "use-cases": "Use cases",
    limits: "Limits",
    reference: "Reference",
    articles: "Article",
  },
};

function sectionLabel(slug: string, locale: "fr" | "en"): string {
  const first = slug.includes("/") ? slug.split("/")[0]! : "articles";
  const table = SECTION_LABELS[locale] ?? SECTION_LABELS["fr"]!;
  return table[first] ?? first;
}

function buildIndex(locale: "fr" | "en"): SearchDoc[] {
  const baseDir = path.join(CONTENT_DIR, locale);
  const files = walkMdx(baseDir);
  const docs: SearchDoc[] = [];

  for (const abs of files) {
    const rel = path.relative(baseDir, abs).split(path.sep).join("/");
    const raw = fs.readFileSync(abs, "utf-8");
    const parsed = matter(raw);
    const data = parsed.data as Record<string, unknown>;

    if (data["draft"] === true) continue;
    if (typeof data["title"] !== "string" || typeof data["description"] !== "string") continue;

    const slug = rel.replaceAll(/\.mdx$/g, "");
    const href = hrefFromFile(rel, locale);
    const stripped = stripMdx(parsed.content);
    const headings = extractHeadings(parsed.content);
    const body = bodyFromStripped(stripped);

    docs.push({
      title: data["title"],
      description: data["description"],
      section: sectionLabel(slug, locale),
      href,
      locale,
      headings,
      body,
    });
  }

  docs.sort((a, b) => a.href.localeCompare(b.href));
  return docs;
}

function main(): void {
  if (!fs.existsSync(PUBLIC_DIR)) {
    fs.mkdirSync(PUBLIC_DIR, { recursive: true });
  }

  for (const locale of ["fr", "en"] as const) {
    const docs = buildIndex(locale);
    const outPath = path.join(PUBLIC_DIR, `search-index-${locale}.json`);
    const payload = JSON.stringify(docs);
    fs.writeFileSync(outPath, payload, "utf-8");
    const sizeKb = Buffer.byteLength(payload, "utf-8") / 1024;
    console.log(
      `[search-index] Wrote ${outPath} (${docs.length} docs, ${sizeKb.toFixed(1)} KB)`
    );
  }
}

main();
