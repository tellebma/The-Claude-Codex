/**
 * Generates /llms.txt and /llms-full.txt for AI crawlers (ChatGPT, Claude,
 * Perplexity, etc.) following the spec at https://llmstxt.org.
 *
 * - llms.txt: short index with links to the most relevant pages (FR + EN).
 * - llms-full.txt: full markdown dump of every MDX content page, grouped by
 *   locale, stripped of MDX-specific imports and components.
 *
 * Runs at build time (prebuild step in package.json). Outputs to /public so
 * that `next build` copies the files into /out.
 */

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const SITE_URL = "https://claude-codex.fr";
const SITE_NAME = "The Claude Codex";
const SITE_DESCRIPTION_FR =
  "Guide de reference gratuit pour maitriser Claude Code : installation, MCP, Skills, Plugins, Agents, Prompting avance et bonnes pratiques. Pour developpeurs et non-developpeurs.";
const SITE_DESCRIPTION_EN =
  "Free reference guide to master Claude Code: installation, MCP, Skills, Plugins, Agents, advanced prompting and best practices. For developers and non-developers.";

const ROOT_DIR = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const CONTENT_DIR = path.join(ROOT_DIR, "content");
const PUBLIC_DIR = path.join(ROOT_DIR, "public");

interface Frontmatter {
  title: string;
  description: string;
  section?: string;
  order?: number;
  badge?: string;
  datePublished?: string;
  dateModified?: string;
  draft?: boolean;
}

interface MdxPage {
  slug: string; // e.g. "getting-started/installation" or "mcp-guide"
  locale: "fr" | "en";
  url: string; // absolute URL including locale prefix
  frontmatter: Frontmatter;
  body: string; // cleaned markdown body
  absPath: string;
}

/**
 * Walks a directory recursively, collecting every .mdx file.
 */
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

/**
 * Removes MDX-specific syntax from the markdown body so it reads as plain
 * markdown for LLM consumption. We keep inline code, headings, lists, tables,
 * links, and blockquotes. We strip: import/export statements, JSX components
 * (opening/closing tags), and expression braces.
 *
 * Components that mostly carry data (TerminalScreenshot, CodeBlock, Mermaid)
 * are stripped entirely, including their multi-line JSX props blocks. Block
 * components whose children contain prose (Callout, Step, Tabs, Card, Steps)
 * are unwrapped so the inner text remains.
 */
function cleanMdxBody(raw: string): string {
  let out = raw;

  // Remove leading import/export statements
  out = out.replace(/^\s*(import|export)[^\n]*\n/gm, "");

  // Drop multi-line self-closing JSX components (e.g. <TerminalScreenshot ... />)
  // Matches a capitalised component name, any attributes across newlines, then />
  out = out.replace(/<([A-Z][A-Za-z0-9]*)\b[\s\S]*?\/>/g, "");

  // For block components that span multiple lines like
  //   <CodeBlock\n  code={`...`}\n  language="ts"\n/>
  // the regex above already handles the self-closing variant.

  // Unwrap single-line opening tags: <Callout type="tip" title="...">
  out = out.replace(/<([A-Z][A-Za-z0-9]*)\b[^>]*>/g, "");

  // Unwrap multi-line opening tags (e.g. <Tabs\n  items={[\n    ...\n  ]}\n>)
  out = out.replace(/<([A-Z][A-Za-z0-9]*)\b[\s\S]*?>/g, "");

  // Remove closing tags: </Callout>
  out = out.replace(/<\/[A-Z][A-Za-z0-9]*>/g, "");

  // Remove stray JSX expression fragments that survived (lines made only of
  // closing braces/brackets from multi-line props we didn't catch)
  out = out.replace(/^\s*[}\])]+\s*$/gm, "");

  // Collapse 3+ consecutive newlines
  out = out.replace(/\n{3,}/g, "\n\n");

  return out.trim();
}

/**
 * Maps a file relative to /content/{locale}/ to its canonical site URL.
 *
 * Special cases (root-level MDX files that map to /content/[slug]):
 *   - /content/fr/mcp-guide.mdx          -> /fr/content/mcp-guide
 *   - /content/fr/getting-started/X.mdx  -> /fr/getting-started/X
 *   - /content/fr/getting-started-intro.mdx -> /fr/getting-started-intro
 *     (root files are served under /content/ per the app routing)
 *
 * Looking at src/app/[locale] layout, section folders (getting-started, mcp,
 * skills, etc.) have their own [slug] route, while root MDX files fall under
 * /{locale}/content/[slug]. We detect "section" pages via a directory prefix.
 */
function pageUrlFromFile(relPath: string, locale: string): string {
  // relPath example: "getting-started/installation.mdx" or "mcp-guide.mdx"
  const withoutExt = relPath.replace(/\.mdx$/, "");
  const parts = withoutExt.split("/");

  if (parts.length >= 2) {
    // Nested file: section/slug, goes under /{locale}/{section}/{slug}/
    return `${SITE_URL}/${locale}/${parts.join("/")}/`;
  }

  // Root MDX: /content/[slug] route
  return `${SITE_URL}/${locale}/content/${parts[0]}/`;
}

function readAllPages(): MdxPage[] {
  const pages: MdxPage[] = [];

  for (const locale of ["fr", "en"] as const) {
    const baseDir = path.join(CONTENT_DIR, locale);
    const files = walkMdx(baseDir);

    for (const abs of files) {
      const rel = path.relative(baseDir, abs).split(path.sep).join("/");
      const raw = fs.readFileSync(abs, "utf-8");
      const parsed = matter(raw);
      const data = parsed.data as Record<string, unknown>;

      if (data["draft"] === true) continue;
      if (typeof data["title"] !== "string" || typeof data["description"] !== "string") {
        // Skip silently; mdx.ts validation already catches this at build time
        continue;
      }

      const frontmatter: Frontmatter = {
        title: data["title"],
        description: data["description"],
        section: typeof data["section"] === "string" ? data["section"] : undefined,
        order: typeof data["order"] === "number" ? data["order"] : undefined,
        badge: typeof data["badge"] === "string" ? data["badge"] : undefined,
        datePublished: typeof data["datePublished"] === "string" ? data["datePublished"] : undefined,
        dateModified: typeof data["dateModified"] === "string" ? data["dateModified"] : undefined,
      };

      const slug = rel.replace(/\.mdx$/, "");
      const url = pageUrlFromFile(rel, locale);
      const body = cleanMdxBody(parsed.content);

      pages.push({
        slug,
        locale,
        url,
        frontmatter,
        body,
        absPath: abs,
      });
    }
  }

  return pages;
}

/**
 * Groups pages by top-level section (first path segment) for llms.txt H2
 * sections. Root-level MDX files are grouped under "articles".
 */
function groupBySection(pages: MdxPage[]): Map<string, MdxPage[]> {
  const groups = new Map<string, MdxPage[]>();
  for (const page of pages) {
    const firstSegment = page.slug.includes("/") ? page.slug.split("/")[0]! : "articles";
    const list = groups.get(firstSegment) ?? [];
    list.push(page);
    groups.set(firstSegment, list);
  }
  // Sort pages within each group by order then title
  groups.forEach((list) => {
    list.sort((a: MdxPage, b: MdxPage) => {
      const oa = a.frontmatter.order ?? 999;
      const ob = b.frontmatter.order ?? 999;
      if (oa !== ob) return oa - ob;
      return a.frontmatter.title.localeCompare(b.frontmatter.title);
    });
  });
  return groups;
}

const SECTION_TITLES_FR: Record<string, string> = {
  "getting-started": "Premiers pas",
  mcp: "MCP (Model Context Protocol)",
  skills: "Skills",
  plugins: "Plugins",
  agents: "Agents",
  prompting: "Prompting",
  advanced: "Avance",
  enterprise: "Entreprise",
  future: "Futur & vision",
  personas: "Personas",
  "use-cases": "Cas d'usage",
  limits: "Limites",
  reference: "Reference",
  articles: "Articles",
};

const SECTION_TITLES_EN: Record<string, string> = {
  "getting-started": "Getting started",
  mcp: "MCP (Model Context Protocol)",
  skills: "Skills",
  plugins: "Plugins",
  agents: "Agents",
  prompting: "Prompting",
  advanced: "Advanced",
  enterprise: "Enterprise",
  future: "Future & vision",
  personas: "Personas",
  "use-cases": "Use cases",
  limits: "Limits",
  reference: "Reference",
  articles: "Articles",
};

function sectionOrder(key: string): number {
  const order = [
    "getting-started",
    "prompting",
    "mcp",
    "skills",
    "plugins",
    "agents",
    "advanced",
    "enterprise",
    "future",
    "personas",
    "use-cases",
    "limits",
    "reference",
    "articles",
  ];
  const idx = order.indexOf(key);
  return idx === -1 ? 999 : idx;
}

/**
 * Section landing pages to list in llms.txt per locale. These are not MDX
 * files (they are app/page.tsx overviews), so we define them inline.
 */
const SECTION_LANDINGS_FR = [
  { slug: "getting-started", title: "Premiers pas", desc: "Installation, configuration et premier projet avec Claude Code." },
  { slug: "prompting", title: "Prompting", desc: "L'art de communiquer avec Claude Code : bases, directives, templates." },
  { slug: "mcp", title: "MCP (Model Context Protocol)", desc: "Connecter Claude Code a vos outils : GitHub, Slack, bases de donnees, design." },
  { slug: "skills", title: "Skills", desc: "Automatiser des workflows avec les Skills (slash commands) Claude Code." },
  { slug: "plugins", title: "Plugins", desc: "Extensions communautaires : skills, agents, regles et configurations." },
  { slug: "agents", title: "Agents", desc: "Sous-agents specialises et orchestration multi-agents avec Claude Code." },
  { slug: "advanced", title: "Avance", desc: "Worktrees, hooks, permissions, CI headless, multi-provider, automation." },
  { slug: "enterprise", title: "Entreprise", desc: "TCO, gouvernance, adoption en equipe, securite et conformite." },
  { slug: "future", title: "Futur & vision", desc: "Tendances IA 2026, roadmap Claude Code, pourquoi l'IA compte." },
];

const SECTION_LANDINGS_EN = [
  { slug: "getting-started", title: "Getting started", desc: "Install, configure and build your first project with Claude Code." },
  { slug: "prompting", title: "Prompting", desc: "The art of talking to Claude Code: basics, directives, templates." },
  { slug: "mcp", title: "MCP (Model Context Protocol)", desc: "Connect Claude Code to your tools: GitHub, Slack, databases, design apps." },
  { slug: "skills", title: "Skills", desc: "Automate workflows with Skills (slash commands) in Claude Code." },
  { slug: "plugins", title: "Plugins", desc: "Community extensions: skills, agents, rules and configuration presets." },
  { slug: "agents", title: "Agents", desc: "Specialised sub-agents and multi-agent orchestration with Claude Code." },
  { slug: "advanced", title: "Advanced", desc: "Worktrees, hooks, permissions, headless CI, multi-provider, automation." },
  { slug: "enterprise", title: "Enterprise", desc: "TCO, governance, team adoption, security and compliance." },
  { slug: "future", title: "Future & vision", desc: "AI trends 2026, Claude Code roadmap, why AI matters." },
];

/**
 * Curated "popular / cornerstone" MDX pages by slug (without locale prefix).
 * Slugs must match the file path under content/{locale}/.
 */
const POPULAR_SLUGS_FR = [
  "getting-started/what-is-claude-code",
  "getting-started/installation",
  "getting-started/first-project",
  "prompting/basics",
  "prompting/claude-md",
  "mcp/what-are-mcps",
  "mcp/setup",
  "skills/what-are-skills",
  "bonnes-pratiques-securite",
  "couts-reels-claude-code",
];

const POPULAR_SLUGS_EN = [
  "getting-started/what-is-claude-code",
  "getting-started/installation",
  "getting-started/first-project",
  "prompting/basics",
  "prompting/claude-md",
  "mcp/what-are-mcps",
  "mcp/setup",
  "skills/what-are-skills",
  "security-best-practices",
  "real-costs-claude-code",
];

function buildLlmsTxt(pagesByLocale: Map<string, MdxPage[]>): string {
  const lines: string[] = [];

  lines.push(`# ${SITE_NAME}`);
  lines.push("");
  lines.push(
    "> Guide de reference gratuit et open source pour maitriser Claude Code, l'assistant IA en ligne de commande d'Anthropic. Installation, MCP, Skills, Plugins, Agents, prompting avance, bonnes pratiques et securite. Contenu FR et EN."
  );
  lines.push("");
  lines.push(`Site : ${SITE_URL}/`);
  lines.push(`Content dump complet (pour crawlers IA) : ${SITE_URL}/llms-full.txt`);
  lines.push("");

  for (const locale of ["fr", "en"] as const) {
    const pages = pagesByLocale.get(locale) ?? [];
    const bySlug = new Map(pages.map((p) => [p.slug, p]));

    const localeLabel = locale === "fr" ? "Francais (FR)" : "English (EN)";
    const homeLabel = locale === "fr" ? "Accueil" : "Home";
    const homeDesc = locale === "fr" ? SITE_DESCRIPTION_FR : SITE_DESCRIPTION_EN;
    const sectionsHeading = locale === "fr" ? "Sections" : "Sections";
    const popularHeading = locale === "fr" ? "Pages essentielles" : "Essential pages";
    const landings = locale === "fr" ? SECTION_LANDINGS_FR : SECTION_LANDINGS_EN;
    const popularSlugs = locale === "fr" ? POPULAR_SLUGS_FR : POPULAR_SLUGS_EN;

    lines.push(`## ${localeLabel}`);
    lines.push("");
    lines.push(`- [${homeLabel}](${SITE_URL}/${locale}/): ${homeDesc}`);
    lines.push("");

    lines.push(`### ${sectionsHeading}`);
    lines.push("");
    for (const section of landings) {
      lines.push(
        `- [${section.title}](${SITE_URL}/${locale}/${section.slug}/): ${section.desc}`
      );
    }
    lines.push("");

    lines.push(`### ${popularHeading}`);
    lines.push("");
    for (const slug of popularSlugs) {
      const page = bySlug.get(slug);
      if (!page) continue;
      const desc = page.frontmatter.description.replace(/\s+/g, " ").trim();
      lines.push(`- [${page.frontmatter.title}](${page.url}): ${desc}`);
    }
    lines.push("");
  }

  lines.push("## Optional");
  lines.push("");
  lines.push(
    `- [Full content dump](${SITE_URL}/llms-full.txt): markdown concatenation of every page (FR + EN) for deep retrieval.`
  );
  lines.push(`- [Sitemap XML](${SITE_URL}/sitemap.xml): complete list of URLs with lastmod dates.`);
  lines.push("");

  return lines.join("\n").replace(/\n{3,}/g, "\n\n").trimEnd() + "\n";
}

function buildLlmsFullTxt(pagesByLocale: Map<string, MdxPage[]>): string {
  const lines: string[] = [];

  lines.push(`# ${SITE_NAME} - Full content dump`);
  lines.push("");
  lines.push(
    `> ${SITE_DESCRIPTION_FR}`
  );
  lines.push("");
  lines.push("Licence : contenu editorial sous licence Creative Commons BY 4.0, code source sous licence MIT.");
  lines.push(`Repository : https://github.com/tellebma/The-Claude-Codex`);
  lines.push(`Website : ${SITE_URL}/`);
  lines.push("");
  lines.push(
    "Ce fichier regroupe l'integralite du contenu MDX du site, nettoye des composants propres au framework, pour faciliter la consultation et la citation par les assistants IA (ChatGPT, Claude, Perplexity, Gemini, etc.)."
  );
  lines.push("");

  for (const locale of ["fr", "en"] as const) {
    const pages = pagesByLocale.get(locale) ?? [];
    const groups = groupBySection(pages);
    const groupKeys: string[] = [];
    groups.forEach((_, key) => groupKeys.push(key));
    const sortedGroupKeys = groupKeys.sort(
      (a: string, b: string) => sectionOrder(a) - sectionOrder(b)
    );

    const separator = "=".repeat(72);
    const header =
      locale === "fr"
        ? "PARTIE 1 - VERSION FRANCAISE"
        : "PARTIE 2 - ENGLISH VERSION";

    lines.push(separator);
    lines.push(header);
    lines.push(separator);
    lines.push("");

    for (const key of sortedGroupKeys) {
      const titles = locale === "fr" ? SECTION_TITLES_FR : SECTION_TITLES_EN;
      const heading = titles[key] ?? key;
      const list = groups.get(key) ?? [];

      lines.push(`# ${heading}`);
      lines.push("");

      for (const page of list) {
        lines.push(`## ${page.frontmatter.title} (${page.url})`);
        lines.push("");
        lines.push(page.frontmatter.description);
        lines.push("");
        if (page.body.length > 0) {
          lines.push(page.body);
          lines.push("");
        }
        lines.push("---");
        lines.push("");
      }
    }
  }

  return lines.join("\n").replace(/\n{4,}/g, "\n\n\n").trimEnd() + "\n";
}

function main(): void {
  console.log("[llms-txt] Reading MDX content...");
  const allPages = readAllPages();

  const byLocale = new Map<string, MdxPage[]>();
  for (const page of allPages) {
    const list = byLocale.get(page.locale) ?? [];
    list.push(page);
    byLocale.set(page.locale, list);
  }

  const frCount = byLocale.get("fr")?.length ?? 0;
  const enCount = byLocale.get("en")?.length ?? 0;
  console.log(`[llms-txt] Found ${allPages.length} pages (FR: ${frCount}, EN: ${enCount})`);

  if (!fs.existsSync(PUBLIC_DIR)) {
    fs.mkdirSync(PUBLIC_DIR, { recursive: true });
  }

  const llmsTxt = buildLlmsTxt(byLocale);
  const llmsFullTxt = buildLlmsFullTxt(byLocale);

  const llmsTxtPath = path.join(PUBLIC_DIR, "llms.txt");
  const llmsFullPath = path.join(PUBLIC_DIR, "llms-full.txt");

  fs.writeFileSync(llmsTxtPath, llmsTxt, "utf-8");
  fs.writeFileSync(llmsFullPath, llmsFullTxt, "utf-8");

  const llmsSize = Buffer.byteLength(llmsTxt, "utf-8");
  const fullSize = Buffer.byteLength(llmsFullTxt, "utf-8");

  console.log(`[llms-txt] Wrote ${llmsTxtPath} (${(llmsSize / 1024).toFixed(1)} KB)`);
  console.log(`[llms-txt] Wrote ${llmsFullPath} (${(fullSize / 1024 / 1024).toFixed(2)} MB)`);

  if (fullSize > 5 * 1024 * 1024) {
    console.warn(
      `[llms-txt] WARNING: llms-full.txt is ${(fullSize / 1024 / 1024).toFixed(2)} MB, above the 5 MB target.`
    );
  }
}

main();
