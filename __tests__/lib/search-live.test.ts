import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  runSearch,
  loadSearchIndex,
  clearSearchIndexCache,
  MIN_CHARS,
  type SearchDoc,
} from "@/lib/search-live";

const DOCS: SearchDoc[] = [
  {
    title: "Installation de Claude Code",
    description: "Comment installer Claude Code avec npm.",
    section: "Démarrer",
    href: "/fr/getting-started/installation",
    locale: "fr",
    headings: ["Prérequis", "Installation"],
    body:
      "Pour installer Claude Code vous aurez besoin de Node.js 18 minimum. " +
      "La commande npm install -g @anthropic/claude-code installe le CLI. " +
      "Testez avec la commande claude --version pour vérifier.",
  },
  {
    title: "MCP Guide",
    description: "Comprendre les serveurs MCP.",
    section: "MCP",
    href: "/fr/mcp/what-are-mcps",
    locale: "fr",
    headings: ["Introduction"],
    body:
      "Le Model Context Protocol connecte Claude Code à des outils externes " +
      "comme GitHub, Slack, ou vos bases de données.",
  },
  {
    title: "Prompting basics",
    description: "L'art du prompting avec Claude.",
    section: "Prompting",
    href: "/fr/prompting/basics",
    locale: "fr",
    headings: ["Le cœur du prompting"],
    body:
      "Un bon prompt explique le contexte, l'objectif et les contraintes. " +
      "Claude répond mieux quand la demande est précise.",
  },
];

describe("runSearch", () => {
  it("returns empty when query is below min chars", () => {
    const r = runSearch("a", DOCS);
    expect(r.results).toEqual([]);
    expect(r.total).toBe(0);
  });

  it("exposes the min chars threshold", () => {
    expect(MIN_CHARS).toBe(2);
  });

  it("matches on body text and extracts a snippet", () => {
    const r = runSearch("node", DOCS);
    expect(r.results).toHaveLength(1);
    const hit = r.results[0]!;
    expect(hit.href).toBe("/fr/getting-started/installation");
    expect(hit.snippets.length).toBeGreaterThan(0);
    expect(hit.snippets[0]!.match.toLowerCase()).toBe("node");
  });

  it("boosts title matches above body-only matches", () => {
    const r = runSearch("mcp", DOCS);
    expect(r.results[0]!.href).toBe("/fr/mcp/what-are-mcps");
    expect(r.results[0]!.titleMatch).toBe(true);
  });

  it("is case-insensitive and accent-insensitive", () => {
    const r = runSearch("PROMPTING", DOCS);
    expect(r.results.some((h) => h.href === "/fr/prompting/basics")).toBe(true);

    // "Prérequis" heading must match "prerequis" (no accent).
    const r2 = runSearch("prerequis", DOCS);
    expect(r2.results.some((h) => h.href === "/fr/getting-started/installation")).toBe(true);
  });

  it("requires every query token to match at least one field (AND semantics)", () => {
    const r = runSearch("node xyznotfound", DOCS);
    expect(r.results).toEqual([]);
  });

  it("flags the titleMatch only when a token is in the title", () => {
    const r = runSearch("node", DOCS);
    expect(r.results[0]!.titleMatch).toBe(false);
  });

  it("returns the total count separate from the truncated results list", () => {
    const many: SearchDoc[] = Array.from({ length: 25 }, (_, i) => ({
      ...DOCS[0]!,
      title: `Doc ${i}`,
      href: `/fr/doc-${i}`,
      body: "Claude Code installation guide page",
    }));
    const r = runSearch("claude", many);
    expect(r.results).toHaveLength(20);
    expect(r.truncated).toBe(5);
    expect(r.total).toBe(25);
  });
});

describe("loadSearchIndex", () => {
  beforeEach(() => {
    clearSearchIndexCache();
    vi.restoreAllMocks();
  });

  it("fetches the index for the given locale and caches it", async () => {
    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(new Response(JSON.stringify(DOCS)));

    const first = await loadSearchIndex("fr");
    const second = await loadSearchIndex("fr");

    expect(first).toEqual(DOCS);
    expect(second).toEqual(DOCS);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(fetchSpy).toHaveBeenCalledWith(
      "/search-index-fr.json",
      expect.any(Object)
    );
  });

  it("throws and clears the cache on HTTP failure", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response("oops", { status: 500 })
    );

    await expect(loadSearchIndex("en")).rejects.toThrow(/search index/i);
  });
});
