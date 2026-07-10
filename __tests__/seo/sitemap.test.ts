import { describe, it, expect } from "vitest";
import sitemap from "@/app/sitemap";
import { SITE_URL, SITE_PAGES } from "@/lib/metadata";
import { locales } from "@/i18n/config";

/**
 * Locales listed for a page when it doesn't set `localesAvailable`
 * explicitly. Kept in sync with `src/app/sitemap.ts`'s own default and with
 * `createPageMetadata`'s default in `src/lib/metadata.ts` (cf. EPIC
 * i18n-espagnol-2026-05 : only pages with real ES content should get an
 * `/es/*` sitemap entry, to avoid broken hreflang pointing at a 404).
 */
const DEFAULT_LOCALES = ["fr", "en"];

function expectedLocalesFor(page: (typeof SITE_PAGES)[number]): readonly string[] {
  return page.localesAvailable ?? DEFAULT_LOCALES;
}

describe("sitemap()", () => {
  const entries = sitemap();

  it("produces one entry per (page × locale available for that page)", () => {
    const expectedCount = SITE_PAGES.reduce(
      (sum, page) => sum + expectedLocalesFor(page).length,
      0
    );
    expect(entries.length).toBe(expectedCount);
  });

  it("produces URLs that are absolute and prefixed by SITE_URL", () => {
    for (const entry of entries) {
      expect(entry.url.startsWith(`${SITE_URL}/`)).toBe(true);
    }
  });

  it("produces URLs that end with a trailing slash (Next.js trailingSlash:true)", () => {
    for (const entry of entries) {
      expect(entry.url.endsWith("/")).toBe(true);
    }
  });

  it("produces URLs that start with a supported locale segment", () => {
    for (const entry of entries) {
      const path = entry.url.replace(`${SITE_URL}/`, "");
      const locale = path.split("/")[0];
      expect(locales).toContain(locale);
    }
  });

  it("attaches a valid lastModified Date to every entry", () => {
    for (const entry of entries) {
      expect(entry.lastModified).toBeInstanceOf(Date);
      expect(Number.isNaN((entry.lastModified as Date).getTime())).toBe(false);
    }
  });

  it("includes the home page for each supported locale", () => {
    for (const locale of locales) {
      expect(entries.some((e) => e.url === `${SITE_URL}/${locale}/`)).toBe(
        true
      );
    }
  });

  it("does not list an /es/* entry for a page without ES content", () => {
    const frenchOnlyPage = SITE_PAGES.find(
      (p) => !(p.localesAvailable ?? DEFAULT_LOCALES).includes("es")
    );
    expect(frenchOnlyPage, "expected at least one page without ES content").toBeDefined();
    const hasEsEntry = entries.some(
      (e) => e.url === `${SITE_URL}/es${frenchOnlyPage!.path}/`
    );
    expect(hasEsEntry).toBe(false);
  });

  it("lists an /es/* entry for the landing page (ES infra rollout)", () => {
    expect(entries.some((e) => e.url === `${SITE_URL}/es/`)).toBe(true);
  });

  it("includes hreflang alternates with x-default and every locale available for that page", () => {
    for (const page of SITE_PAGES) {
      const pageLocales = expectedLocalesFor(page);
      const firstLocale = pageLocales[0];
      const rawPath = page.pathsByLocale?.[firstLocale] ?? page.path;
      const expectedUrl = `${SITE_URL}/${firstLocale}${rawPath}`;
      const entry = entries.find(
        (e) => e.url === expectedUrl || e.url === `${expectedUrl}/`
      );
      expect(entry, `missing sitemap entry for ${page.path}`).toBeDefined();
      const langs = entry!.alternates!.languages as Record<string, string>;
      expect(langs["x-default"]).toBeDefined();
      for (const locale of pageLocales) {
        expect(langs[locale]).toBeDefined();
        expect(langs[locale].startsWith(`${SITE_URL}/`)).toBe(true);
      }
    }
  });

  it("keeps priority values within the [0, 1] range as per sitemap spec", () => {
    for (const entry of entries) {
      if (typeof entry.priority === "number") {
        expect(entry.priority).toBeGreaterThanOrEqual(0);
        expect(entry.priority).toBeLessThanOrEqual(1);
      }
    }
  });

  it("does not emit duplicate URLs", () => {
    const urls = entries.map((e) => e.url);
    const unique = new Set(urls);
    expect(unique.size).toBe(urls.length);
  });
});
