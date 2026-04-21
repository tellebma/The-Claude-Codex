import { describe, it, expect } from "vitest";
import { existsSync, readFileSync, readdirSync, statSync } from "fs";
import { join } from "path";

/**
 * Regression guard for the 2026-04-21 bug where pages in src/app/[locale]/
 * used Link from "next/link" AND forgot to prepend the locale, producing
 * hrefs like "/content/prompting-guide/" (no locale) that 404ed on Vercel.
 *
 * This test scans the BUILT output (./out) for any HTML file that emits
 * an internal href not starting with /fr/, /en/, or an allowed asset
 * prefix. If the build exists, run it. Otherwise skip (local dev).
 *
 * In CI this runs after `npm run build`, catching the bug class for real.
 */

const OUT_DIR = join(process.cwd(), "out");

// Paths that legitimately exist at the root (not locale-prefixed).
const ALLOWED_PREFIXES = [
  "/fr/",
  "/en/",
  "/_next/",
  "/icon",
  "/apple-touch",
  "/robots",
  "/sitemap",
  "/llms",
  "/og/",
  "/favicon",
  "/manifest",
  "/images/",
  "/404",
  "/500",
  "/fr", // "/fr" exact (rare, but e.g. root Link)
  "/en",
];

function isAllowed(href: string): boolean {
  if (!href.startsWith("/")) return true; // external or relative
  if (href === "/") return true; // root
  if (href.startsWith("#")) return true;
  return ALLOWED_PREFIXES.some(
    (p) => href === p || href.startsWith(p + "/") || href.startsWith(p),
  );
}

function walkHtml(dir: string): string[] {
  const out: string[] = [];
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    const s = statSync(p);
    if (s.isDirectory()) out.push(...walkHtml(p));
    else if (entry.endsWith(".html")) out.push(p);
  }
  return out;
}

describe("Built HTML has no locale-less internal hrefs", () => {
  const hasBuild = existsSync(OUT_DIR);

  it.skipIf(!hasBuild)(
    "every internal href in out/**/*.html has a locale prefix",
    () => {
      const files = walkHtml(OUT_DIR);
      expect(files.length, "no html files found in out/").toBeGreaterThan(0);

      const offenders: Array<{ file: string; hrefs: string[] }> = [];

      for (const file of files) {
        const content = readFileSync(file, "utf-8");
        const matches = content.match(/href="\/[^"#?]*"/g) || [];
        const bad = matches
          .map((m) => m.slice(6, -1)) // strip `href="` and trailing `"`
          .filter((h) => !isAllowed(h))
          .filter((h, i, arr) => arr.indexOf(h) === i); // unique

        if (bad.length > 0) {
          offenders.push({
            file: file.replace(process.cwd() + "/", ""),
            hrefs: bad,
          });
        }
      }

      expect(
        offenders,
        offenders.length === 0
          ? ""
          : `Found ${offenders.length} page(s) with locale-less hrefs:\n` +
              offenders
                .map((o) => `  ${o.file}\n    ${o.hrefs.join("\n    ")}`)
                .join("\n"),
      ).toEqual([]);
    },
  );

  it(
    "OUT_DIR marker",
    () => {
      expect(OUT_DIR).toContain("out");
    },
  );
});
