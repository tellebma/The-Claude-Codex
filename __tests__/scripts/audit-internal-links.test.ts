/**
 * Tests unitaires des helpers de scripts/audit-internal-links.ts (SEO-7).
 * Note : la fonction `auditLinks()` qui touche au filesystem est testee en
 * integration via le run reel `npm run audit:links` apres `npm run build`.
 */
import { describe, expect, it } from "vitest";
import {
  extractHrefs,
  extractIds,
  isInternalLink,
  resolveTargetPath,
  buildReport,
} from "../../scripts/audit-internal-links";
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

describe("extractHrefs", () => {
  it("extrait les href d'un HTML simple", () => {
    const html = '<a href="/fr/mcp/">MCP</a><a href="/en/">EN</a>';
    expect(extractHrefs(html)).toEqual(["/fr/mcp/", "/en/"]);
  });

  it("supporte simples et doubles quotes", () => {
    const html = `<a href='/a'>A</a><a href="/b">B</a>`;
    expect(extractHrefs(html)).toEqual(["/a", "/b"]);
  });

  it("ignore les balises non-a", () => {
    const html = '<link href="/style.css"/><a href="/a">A</a>';
    expect(extractHrefs(html)).toEqual(["/a"]);
  });

  it("supporte les attributs additionnels", () => {
    const html = '<a class="x" href="/a" data-test="y">A</a>';
    expect(extractHrefs(html)).toEqual(["/a"]);
  });

  it("retourne une liste vide pour un HTML sans liens", () => {
    expect(extractHrefs("<p>hello</p>")).toEqual([]);
  });
});

describe("extractIds", () => {
  it("extrait les id des balises HTML", () => {
    const html = '<h2 id="section-1">Titre</h2><div id="footer"></div>';
    expect([...extractIds(html)]).toEqual(["section-1", "footer"]);
  });

  it("dedupe les id repetes (cas insolite mais possible)", () => {
    const html = '<h2 id="x">A</h2><h3 id="x">B</h3>';
    expect([...extractIds(html)]).toEqual(["x"]);
  });

  it("ignore les id contenant des espaces ou hash", () => {
    const html = '<div id="ok"></div><div id="bad space"></div>';
    expect([...extractIds(html)]).toEqual(["ok"]);
  });
});

describe("isInternalLink", () => {
  it.each([
    ["/fr/mcp/", true],
    ["/", true],
    ["/en/agents/what-are-agents/", true],
  ])("internal: %s -> %s", (href, expected) => {
    expect(isInternalLink(href)).toBe(expected);
  });

  it.each([
    ["https://example.com/", false],
    ["http://localhost:3000/", false],
    ["//cdn.example.com/asset.js", false],
    ["mailto:foo@bar.com", false],
    ["tel:+33000", false],
    ["javascript:void(0)", false],
    ["JavaScript:alert(1)", false],
    ["data:text/html,<script>1</script>", false],
    ["vbscript:msgbox(1)", false],
    [" javascript:alert(1)", false], // espaces leading
    ["#section", false],
    ["", false],
  ])("external: %s -> %s", (href, expected) => {
    expect(isInternalLink(href)).toBe(expected);
  });
});

describe("resolveTargetPath", () => {
  // Setup un FS temporaire qui mime out/
  const dir = mkdtempSync(join(tmpdir(), "audit-links-"));
  mkdirSync(join(dir, "fr", "mcp"), { recursive: true });
  writeFileSync(join(dir, "fr", "mcp", "index.html"), "<html/>");
  writeFileSync(join(dir, "fr", "mcp", "what-are-mcps.html"), "<html/>");
  mkdirSync(join(dir, "fr", "agents", "agent-sdk"), { recursive: true });
  writeFileSync(
    join(dir, "fr", "agents", "agent-sdk", "index.html"),
    "<html/>"
  );
  writeFileSync(join(dir, "search-index-fr.json"), "[]");

  it("resoud un chemin avec trailing slash vers index.html", () => {
    const result = resolveTargetPath("/fr/mcp/", dir);
    expect(result).toContain("fr/mcp/index.html");
  });

  it("resoud un chemin sans trailing slash vers .html direct", () => {
    const result = resolveTargetPath("/fr/mcp/what-are-mcps", dir);
    expect(result).toContain("fr/mcp/what-are-mcps.html");
  });

  it("resoud un chemin profond avec trailing slash", () => {
    const result = resolveTargetPath("/fr/agents/agent-sdk/", dir);
    expect(result).toContain("fr/agents/agent-sdk/index.html");
  });

  it("resoud un asset binaire/fichier statique", () => {
    const result = resolveTargetPath("/search-index-fr.json", dir);
    expect(result).toContain("search-index-fr.json");
  });

  it("retourne null pour un chemin inexistant", () => {
    expect(resolveTargetPath("/fr/missing/", dir)).toBeNull();
    expect(resolveTargetPath("/fr/missing/page", dir)).toBeNull();
  });
});

describe("buildReport", () => {
  it("rapport vide quand aucun probleme", () => {
    const report = buildReport([], 200);
    expect(report).toContain("# Audit maillage interne");
    expect(report).toContain("✅ Aucun probleme detecte");
    expect(report).toContain("| **Total** | **0** |");
  });

  it("liste les pages 404 et ancres manquantes separement", () => {
    const issues = [
      {
        source: "fr/index.html",
        href: "/fr/dead-page/",
        type: "missing-page" as const,
      },
      {
        source: "fr/mcp/index.html",
        href: "/fr/mcp/securite-mcp/#nope",
        type: "missing-anchor" as const,
        anchor: "nope",
      },
    ];
    const report = buildReport(issues, 5);
    expect(report).toContain("Liens vers pages absentes du build");
    expect(report).toContain("`/fr/dead-page/`");
    expect(report).toContain("Ancres invalides");
    expect(report).toContain("`#nope`");
    expect(report).toContain("| **Total** | **2** |");
  });
});
