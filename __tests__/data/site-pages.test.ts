import { describe, it, expect } from "vitest";
import { SITE_PAGES } from "../../src/data/site-pages";

const VALID_CHANGE_FREQUENCIES = [
  "always",
  "hourly",
  "daily",
  "weekly",
  "monthly",
  "yearly",
  "never",
] as const;

describe("SITE_PAGES data integrity", () => {
  it("is a non-empty array", () => {
    expect(Array.isArray(SITE_PAGES)).toBe(true);
    expect(SITE_PAGES.length).toBeGreaterThan(0);
  });

  it("every path is unique", () => {
    const paths = SITE_PAGES.map((p) => p.path);
    const dupes = paths.filter((p, i) => paths.indexOf(p) !== i);
    expect(dupes, `duplicate paths: ${dupes.join(", ")}`).toEqual([]);
  });

  it("every path starts with /", () => {
    const invalid = SITE_PAGES.filter((p) => !p.path.startsWith("/"));
    expect(invalid.map((p) => p.path)).toEqual([]);
  });

  it("every path has no trailing slash (canonical form)", () => {
    const withSlash = SITE_PAGES.filter(
      (p) => p.path.length > 1 && p.path.endsWith("/"),
    );
    expect(withSlash.map((p) => p.path)).toEqual([]);
  });

  it("every priority is between 0 and 1", () => {
    const invalid = SITE_PAGES.filter(
      (p) => typeof p.priority !== "number" || p.priority < 0 || p.priority > 1,
    );
    expect(invalid.map((p) => p.path)).toEqual([]);
  });

  it("every changeFrequency is a valid sitemap value", () => {
    const invalid = SITE_PAGES.filter(
      (p) => !VALID_CHANGE_FREQUENCIES.includes(p.changeFrequency),
    );
    expect(invalid.map((p) => p.path)).toEqual([]);
  });

  it("lastModified, when set, is a YYYY-MM-DD ISO date", () => {
    const invalid = SITE_PAGES.filter(
      (p) => p.lastModified !== undefined && !/^\d{4}-\d{2}-\d{2}$/.test(p.lastModified),
    );
    expect(invalid.map((p) => p.path)).toEqual([]);
  });

  it("titles are non-empty", () => {
    const invalid = SITE_PAGES.filter((p) => !p.title || p.title.trim() === "");
    expect(invalid.map((p) => p.path)).toEqual([]);
  });

  it("titles stay under 120 chars (hard SEO limit)", () => {
    const invalid = SITE_PAGES.filter((p) => p.title.length > 120);
    expect(invalid.map((p) => `${p.path} (len ${p.title.length})`)).toEqual([]);
  });

  it("descriptions are non-empty", () => {
    const invalid = SITE_PAGES.filter(
      (p) => !p.description || p.description.trim() === "",
    );
    expect(invalid.map((p) => p.path)).toEqual([]);
  });

  it("descriptions stay under 320 chars (hard SEO limit)", () => {
    const invalid = SITE_PAGES.filter((p) => p.description.length > 320);
    expect(invalid.map((p) => `${p.path} (len ${p.description.length})`)).toEqual([]);
  });

  it("pathsByLocale keys are valid locales", () => {
    const invalid: string[] = [];
    for (const page of SITE_PAGES) {
      if (!page.pathsByLocale) continue;
      for (const locale of Object.keys(page.pathsByLocale)) {
        if (locale !== "fr" && locale !== "en") {
          invalid.push(`${page.path} -> ${locale}`);
        }
      }
    }
    expect(invalid).toEqual([]);
  });

  it("pathsByLocale targets start with /", () => {
    const invalid: string[] = [];
    for (const page of SITE_PAGES) {
      if (!page.pathsByLocale) continue;
      for (const [locale, p] of Object.entries(page.pathsByLocale)) {
        if (!p.startsWith("/")) invalid.push(`${page.path} -> ${locale}: ${p}`);
      }
    }
    expect(invalid).toEqual([]);
  });

  it("the /about page is present (regression for PR #48)", () => {
    const about = SITE_PAGES.find((p) => p.path === "/about");
    expect(about).toBeDefined();
    expect(about?.title).toBeTruthy();
    expect(about?.description).toBeTruthy();
  });

  it("all MT1 renamed EN slugs are declared via pathsByLocale", () => {
    const expected: Record<string, string> = {
      "/content/bonnes-pratiques-securite": "/content/security-best-practices",
      "/content/mythes-claude-code": "/content/claude-code-myths",
      "/content/couts-reels-claude-code": "/content/real-costs-claude-code",
      "/mcp/securite-mcp": "/mcp/mcp-security",
    };
    for (const [frPath, enPath] of Object.entries(expected)) {
      const page = SITE_PAGES.find((p) => p.path === frPath);
      expect(page, `missing page ${frPath}`).toBeDefined();
      expect(page?.pathsByLocale?.en).toBe(enPath);
    }
  });
});
