import { describe, it, expect } from "vitest";
import { glossaryTerms } from "@/data/glossary";

describe("glossaryTerms", () => {
  it("exports a non-empty array", () => {
    expect(Array.isArray(glossaryTerms)).toBe(true);
    expect(glossaryTerms.length).toBeGreaterThan(0);
  });

  it("every entry has non-empty required fields: term, definition, analogy", () => {
    for (const entry of glossaryTerms) {
      expect(
        typeof entry.term === "string" && entry.term.trim().length > 0,
        `term should be a non-empty string (got: ${JSON.stringify(entry.term)})`,
      ).toBe(true);

      expect(
        typeof entry.definition === "string" && entry.definition.trim().length > 0,
        `definition should be a non-empty string for term "${entry.term}"`,
      ).toBe(true);

      expect(
        typeof entry.analogy === "string" && entry.analogy.trim().length > 0,
        `analogy should be a non-empty string for term "${entry.term}"`,
      ).toBe(true);
    }
  });

  it("has no duplicate terms (case-sensitive)", () => {
    const terms = glossaryTerms.map((e) => e.term);
    const unique = new Set(terms);

    expect(unique.size).toBe(terms.length);
  });

  it("has no duplicate terms (case-insensitive)", () => {
    const normalised = glossaryTerms.map((e) => e.term.toLowerCase());
    const unique = new Set(normalised);

    expect(unique.size).toBe(normalised.length);
  });

  it("all links, when present, start with '/'", () => {
    for (const entry of glossaryTerms) {
      if (entry.link !== undefined) {
        expect(
          entry.link.startsWith("/"),
          `link for "${entry.term}" should start with "/" (got: "${entry.link}")`,
        ).toBe(true);
      }
    }
  });
});
