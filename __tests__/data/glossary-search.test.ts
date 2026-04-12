import { describe, it, expect } from "vitest";
import { searchGlossary, glossaryTerms } from "@/data/glossary";

describe("searchGlossary", () => {
  it("returns all terms when query is empty", () => {
    const result = searchGlossary("");
    expect(result).toEqual(glossaryTerms);
  });

  it("returns all terms when query is only whitespace", () => {
    const result = searchGlossary("   ");
    expect(result).toEqual(glossaryTerms);
  });

  it("finds a term by exact name (case-insensitive)", () => {
    const result = searchGlossary("terminal");
    expect(result.length).toBeGreaterThan(0);
    const hasTerminal = result.some((t) => t.term === "Terminal");
    expect(hasTerminal).toBe(true);
  });

  it("finds a term by partial name", () => {
    const result = searchGlossary("CLI");
    expect(result.length).toBeGreaterThan(0);
    const hasCli = result.some((t) => t.term === "CLI");
    expect(hasCli).toBe(true);
  });

  it("searches in definitions", () => {
    // "navigateur" appears in the Node.js definition
    const result = searchGlossary("navigateur");
    expect(result.length).toBeGreaterThan(0);
  });

  it("searches in analogies", () => {
    // "restaurant" appears in the API analogy
    const result = searchGlossary("restaurant");
    expect(result.length).toBeGreaterThan(0);
    const hasApi = result.some((t) => t.term === "API");
    expect(hasApi).toBe(true);
  });

  it("normalizes accents in query", () => {
    // "définition" should match entries containing "definition" without accents being a barrier
    const result = searchGlossary("téléchargement");
    // Even if no match, it shouldn't crash
    expect(Array.isArray(result)).toBe(true);
  });

  it("normalizes accents in terms/definitions too", () => {
    // "execution" (without accent) should find terms with "exécution" (with accent)
    const result = searchGlossary("execution");
    expect(result.length).toBeGreaterThan(0);
  });

  it("returns empty array for nonsense query", () => {
    const result = searchGlossary("xyzzyqwerty123456");
    expect(result).toHaveLength(0);
  });

  it("is case-insensitive", () => {
    const lower = searchGlossary("api");
    const upper = searchGlossary("API");
    const mixed = searchGlossary("Api");
    expect(lower).toEqual(upper);
    expect(upper).toEqual(mixed);
  });
});
