/**
 * SEO-7 — Audit du maillage interne post-RG.
 *
 * Crawle `out/` apres `npm run build` et detecte :
 * - Liens internes 404 (href vers une page qui n'existe pas dans le build)
 * - Ancres invalides (#section-id pointant vers un id absent dans la page cible)
 *
 * Genere un rapport markdown dans `reports/internal-links-audit-YYYY-MM-DD.md`.
 *
 * Exit 0 si aucun probleme, 1 sinon.
 *
 * Usage :
 *   npm run audit:links
 *   AUDIT_LINKS_WARN_ONLY=1 npm run audit:links  # exit 0 meme avec problemes
 */

import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync, statSync } from "node:fs";
import { join, resolve, dirname } from "node:path";

const OUT_DIR = resolve(process.cwd(), "out");
const REPORTS_DIR = resolve(process.cwd(), "reports");
const WARN_ONLY = process.env.AUDIT_LINKS_WARN_ONLY === "1";

interface LinkIssue {
  readonly source: string;
  readonly href: string;
  readonly type: "missing-page" | "missing-anchor";
  readonly anchor?: string;
}

/**
 * Walk recursivement un dossier et retourne tous les fichiers HTML.
 */
async function listHtmlFiles(dir: string): Promise<string[]> {
  const out: string[] = [];
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...(await listHtmlFiles(full)));
    } else if (entry.isFile() && entry.name.endsWith(".html")) {
      out.push(full);
    }
  }
  return out;
}

/**
 * Extrait les href de tous les <a href="..."> du HTML.
 * Strict-mode regex : on cherche href="..." ou href='...' uniquement.
 */
export function extractHrefs(html: string): ReadonlyArray<string> {
  const hrefs: string[] = [];
  const re = /<a\b[^>]*\shref\s*=\s*["']([^"']+)["']/gi;
  let match: RegExpExecArray | null;
  while ((match = re.exec(html)) !== null) {
    hrefs.push(match[1]);
  }
  return hrefs;
}

/**
 * Extrait tous les `id="..."` du HTML pour la verification d'ancres.
 */
export function extractIds(html: string): ReadonlySet<string> {
  const ids = new Set<string>();
  const re = /\sid\s*=\s*["']([^"'#\s]+)["']/gi;
  let match: RegExpExecArray | null;
  while ((match = re.exec(html)) !== null) {
    ids.add(match[1]);
  }
  return ids;
}

/**
 * Determine si un href est un lien interne (a verifier) ou externe (skip).
 */
export function isInternalLink(href: string): boolean {
  if (!href) return false;
  if (href.startsWith("#")) return false; // ancre pure dans la page courante
  if (href.startsWith("mailto:")) return false;
  if (href.startsWith("tel:")) return false;
  if (href.startsWith("javascript:")) return false;
  if (/^https?:\/\//i.test(href)) return false;
  if (href.startsWith("//")) return false;
  return href.startsWith("/");
}

/**
 * Resoudre un href interne vers le chemin du fichier HTML attendu dans out/.
 * Gere :
 * - /fr/mcp/  -> out/fr/mcp/index.html
 * - /fr/mcp/what-are-mcps  -> out/fr/mcp/what-are-mcps.html (avec ou sans trailingSlash)
 * - /fr/mcp/what-are-mcps/  -> out/fr/mcp/what-are-mcps/index.html
 * - href avec ?query ou #anchor : on strip avant resolution
 */
export function resolveTargetPath(
  hrefPath: string,
  outDir: string
): string | null {
  // Normalise (strip trailing slash sauf root)
  let path = hrefPath;
  if (path.length > 1 && path.endsWith("/")) {
    // /fr/mcp/  -> on tente d'abord index.html dans le dossier
    const indexPath = join(outDir, path, "index.html");
    if (existsSync(indexPath)) return indexPath;
  }

  // Sans trailing slash : /fr/mcp -> out/fr/mcp.html ou out/fr/mcp/index.html
  const noSlash = path.replace(/\/$/, "");
  const directHtml = join(outDir, noSlash + ".html");
  if (existsSync(directHtml)) return directHtml;

  const indexHtml = join(outDir, noSlash, "index.html");
  if (existsSync(indexHtml)) return indexHtml;

  // Asset binaire / fichier statique (image, json, etc.) : verifier juste l'existence
  const directFile = join(outDir, noSlash);
  if (existsSync(directFile) && statSync(directFile).isFile()) {
    return directFile;
  }

  return null;
}

/**
 * Audit principal : crawle out/, valide tous les liens internes.
 */
export async function auditLinks(outDir: string = OUT_DIR): Promise<ReadonlyArray<LinkIssue>> {
  if (!existsSync(outDir)) {
    throw new Error(
      `out/ introuvable. Lancer 'npm run build' avant 'npm run audit:links'.`
    );
  }

  const htmlFiles = await listHtmlFiles(outDir);
  // Cache des ids par fichier cible (eviter de relire 100x la meme page)
  const idsByFile = new Map<string, ReadonlySet<string>>();
  const issues: LinkIssue[] = [];

  for (const file of htmlFiles) {
    const html = await readFile(file, "utf8");
    const hrefs = extractHrefs(html);
    const sourceRel = file.replace(outDir, "").replace(/^\//, "");

    for (const href of hrefs) {
      if (!isInternalLink(href)) continue;

      // Split en path + anchor
      const hashIdx = href.indexOf("#");
      const queryIdx = href.indexOf("?");
      const splitIdx = Math.min(
        hashIdx === -1 ? Infinity : hashIdx,
        queryIdx === -1 ? Infinity : queryIdx
      );
      const pathPart = splitIdx === Infinity ? href : href.slice(0, splitIdx);
      const anchor =
        hashIdx === -1
          ? null
          : href.slice(hashIdx + 1).split("?")[0] || null;

      // Verifier l'existence de la page cible
      const target = resolveTargetPath(pathPart, outDir);
      if (target === null) {
        issues.push({ source: sourceRel, href, type: "missing-page" });
        continue;
      }

      // Si ancre, verifier qu'elle existe dans la page cible
      if (anchor) {
        let ids = idsByFile.get(target);
        if (!ids) {
          const targetHtml = await readFile(target, "utf8");
          ids = extractIds(targetHtml);
          idsByFile.set(target, ids);
        }
        if (!ids.has(anchor)) {
          issues.push({
            source: sourceRel,
            href,
            type: "missing-anchor",
            anchor,
          });
        }
      }
    }
  }

  return issues;
}

/**
 * Genere un rapport markdown a partir de la liste d'issues.
 */
export function buildReport(
  issues: ReadonlyArray<LinkIssue>,
  scannedFilesCount: number
): string {
  const date = new Date().toISOString().slice(0, 10);
  const missingPages = issues.filter((i) => i.type === "missing-page");
  const missingAnchors = issues.filter((i) => i.type === "missing-anchor");

  const lines: string[] = [];
  lines.push(`# Audit maillage interne — ${date}`);
  lines.push("");
  lines.push(
    `Crawl de \`out/\` (${scannedFilesCount} pages HTML). Detecte les liens internes ` +
      `pointant vers des pages absentes du build et les ancres \`#section-id\` ` +
      `referencees dans des liens internes mais absentes de la page cible.`
  );
  lines.push("");
  lines.push("## Resume");
  lines.push("");
  lines.push(`| Categorie | Total |`);
  lines.push(`|---|---:|`);
  lines.push(`| Liens vers pages 404 | ${missingPages.length} |`);
  lines.push(`| Ancres absentes | ${missingAnchors.length} |`);
  lines.push(`| **Total** | **${issues.length}** |`);
  lines.push("");

  if (missingPages.length > 0) {
    lines.push("## Liens vers pages absentes du build");
    lines.push("");
    lines.push("| Source | Href |");
    lines.push("|---|---|");
    for (const issue of missingPages) {
      lines.push(`| \`${issue.source}\` | \`${issue.href}\` |`);
    }
    lines.push("");
  }

  if (missingAnchors.length > 0) {
    lines.push("## Ancres invalides (#section-id)");
    lines.push("");
    lines.push("| Source | Href | Ancre |");
    lines.push("|---|---|---|");
    for (const issue of missingAnchors) {
      lines.push(`| \`${issue.source}\` | \`${issue.href}\` | \`#${issue.anchor}\` |`);
    }
    lines.push("");
  }

  if (issues.length === 0) {
    lines.push("✅ Aucun probleme detecte. Le maillage interne est sain.");
  }

  return lines.join("\n");
}

// CLI entry point — guard "if main" pour permettre d'importer le module dans les tests
if (import.meta.url === `file://${process.argv[1]}`) {
  void (async () => {
    try {
      const htmlFiles = await listHtmlFiles(OUT_DIR);
      const issues = await auditLinks(OUT_DIR);
      const report = buildReport(issues, htmlFiles.length);

      await mkdir(REPORTS_DIR, { recursive: true });
      const date = new Date().toISOString().slice(0, 10);
      const reportPath = join(REPORTS_DIR, `internal-links-audit-${date}.md`);
      await writeFile(reportPath, report, "utf8");

      console.log(report);
      console.log("");
      console.log(`Rapport ecrit dans ${reportPath}`);

      if (issues.length > 0 && !WARN_ONLY) {
        process.exit(1);
      }
    } catch (err) {
      console.error("[audit-internal-links] Erreur :", err);
      process.exit(1);
    }
  })();
}
