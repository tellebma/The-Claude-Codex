import { describe, it, expect } from "vitest";
import { searchEntries, searchIndexFr, searchIndexEn } from "@/lib/search-index";

describe("searchEntries", () => {
  it("returns an empty array for an empty query", () => {
    expect(searchEntries("")).toEqual([]);
  });

  it("returns an empty array for a whitespace-only query", () => {
    expect(searchEntries("   ")).toEqual([]);
  });

  it("finds entries matching a keyword", () => {
    const results = searchEntries("mcp");
    expect(results.length).toBeGreaterThan(0);
    // The MCP overview should appear in results
    const hasMcpEntry = results.some((r) => r.href === "/mcp");
    expect(hasMcpEntry).toBe(true);
  });

  it("finds entries matching a title", () => {
    const results = searchEntries("glossaire");
    expect(results.length).toBeGreaterThan(0);
    const hasGlossary = results.some((r) => r.href === "/glossary");
    expect(hasGlossary).toBe(true);
  });

  it("is case-insensitive", () => {
    const lower = searchEntries("mcp");
    const upper = searchEntries("MCP");
    expect(lower).toEqual(upper);
  });

  it("normalizes accented characters", () => {
    const withAccent = searchEntries("securite");
    const withoutAccent = searchEntries("sécurité");
    expect(withAccent).toEqual(withoutAccent);
  });

  it("handles multi-word queries", () => {
    const results = searchEntries("extended thinking");
    expect(results.length).toBeGreaterThan(0);
    const hasThinkingPage = results.some((r) =>
      r.href.includes("thinking-and-planning")
    );
    expect(hasThinkingPage).toBe(true);
  });

  it("returns results sorted by relevance (title matches score higher)", () => {
    const results = searchEntries("prompting");
    // The prompting overview page has "prompting" in the title, so it
    // should be ranked near the top.
    expect(results.length).toBeGreaterThan(0);
    const firstFive = results.slice(0, 5);
    const hasPromptingOverview = firstFive.some((r) => r.href === "/prompting");
    expect(hasPromptingOverview).toBe(true);
  });

  it("returns no results for a completely unrelated query", () => {
    const results = searchEntries("xyznonexistentterm123");
    expect(results).toEqual([]);
  });

  it("searchIndexFr has entries with required fields", () => {
    for (const entry of searchIndexFr) {
      expect(entry.title).toBeTruthy();
      expect(entry.description).toBeTruthy();
      expect(entry.href).toMatch(/^\//);
      expect(entry.section).toBeTruthy();
      expect(entry.keywords.length).toBeGreaterThan(0);
    }
  });

  it("searchIndexEn has entries with required fields", () => {
    for (const entry of searchIndexEn) {
      expect(entry.title).toBeTruthy();
      expect(entry.description).toBeTruthy();
      expect(entry.href).toMatch(/^\//);
      expect(entry.section).toBeTruthy();
      expect(entry.keywords.length).toBeGreaterThan(0);
    }
  });

  it("searchIndexEn and searchIndexFr have the same number of entries", () => {
    expect(searchIndexEn.length).toBe(searchIndexFr.length);
  });

  it("returns English results when locale is en", () => {
    const results = searchEntries("mcp", "en");
    expect(results.length).toBeGreaterThan(0);
    const hasMcpEntry = results.some((r) => r.href === "/mcp");
    expect(hasMcpEntry).toBe(true);
    // Should return English title
    const mcpEntry = results.find((r) => r.href === "/mcp");
    expect(mcpEntry?.title).toContain("Superpowers");
  });

  it("returns French results when locale is fr", () => {
    const results = searchEntries("mcp", "fr");
    expect(results.length).toBeGreaterThan(0);
    const mcpEntry = results.find((r) => r.href === "/mcp");
    expect(mcpEntry?.title).toContain("Super-pouvoirs");
  });

  it("defaults to French when no locale is provided", () => {
    const results = searchEntries("mcp");
    const mcpEntry = results.find((r) => r.href === "/mcp");
    expect(mcpEntry?.title).toContain("Super-pouvoirs");
  });
});
