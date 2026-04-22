import { describe, it, expect } from "vitest";
import sitemap from "@/app/sitemap";
import { SITE_URL, SITE_PAGES } from "@/lib/metadata";
import { locales } from "@/i18n/config";

describe("sitemap()", () => {
  const entries = sitemap();

  it("produces one entry per (page × locale)", () => {
    expect(entries.length).toBe(SITE_PAGES.length * locales.length);
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

  it("includes hreflang alternates with x-default and all locales", () => {
    for (const entry of entries) {
      expect(entry.alternates?.languages).toBeDefined();
      const langs = entry.alternates!.languages as Record<string, string>;
      expect(langs["x-default"]).toBeDefined();
      for (const locale of locales) {
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
