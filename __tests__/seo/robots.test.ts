import { describe, it, expect } from "vitest";
import robots from "@/app/robots";
import { SITE_URL } from "@/lib/metadata";

describe("robots()", () => {
  const result = robots();

  it("declares a wildcard User-agent rule", () => {
    expect(Array.isArray(result.rules)).toBe(true);
    const rules = Array.isArray(result.rules) ? result.rules : [result.rules];
    expect(rules.some((r) => r.userAgent === "*")).toBe(true);
  });

  it("references an absolute sitemap URL on the site domain", () => {
    expect(result.sitemap).toBeDefined();
    const sitemapUrl = Array.isArray(result.sitemap)
      ? result.sitemap[0]
      : result.sitemap;
    expect(typeof sitemapUrl).toBe("string");
    expect(sitemapUrl!.startsWith(SITE_URL)).toBe(true);
    expect(sitemapUrl!.endsWith("/sitemap.xml")).toBe(true);
  });

  it("sets the canonical host to SITE_URL", () => {
    expect(result.host).toBe(SITE_URL);
  });

  it("does not contain any unexpected Disallow directive", () => {
    const rules = Array.isArray(result.rules) ? result.rules : [result.rules];
    for (const rule of rules) {
      if (!rule.disallow) continue;
      const disallowed = Array.isArray(rule.disallow)
        ? rule.disallow
        : [rule.disallow];
      expect(disallowed).toEqual([]);
    }
  });

  it("explicitly allows the LLM indexing files", () => {
    const rules = Array.isArray(result.rules) ? result.rules : [result.rules];
    const wildcard = rules.find((r) => r.userAgent === "*");
    expect(wildcard).toBeDefined();
    const allowed = Array.isArray(wildcard!.allow)
      ? wildcard!.allow
      : [wildcard!.allow];
    expect(allowed).toContain("/llms.txt");
    expect(allowed).toContain("/llms-full.txt");
  });
});
