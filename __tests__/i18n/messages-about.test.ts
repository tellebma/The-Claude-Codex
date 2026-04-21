import { describe, it, expect } from "vitest";
import fr from "../../messages/fr.json";
import en from "../../messages/en.json";

const ABOUT_KEYS_USED_BY_PAGE = [
  "badge",
  "title",
  "titleHighlight",
  "subtitle",
  "missionBadge",
  "missionTitle",
  "missionDescription",
  "missionP1",
  "missionP2",
  "missionP3",
  "valuesBadge",
  "valuesTitle",
  "authorBadge",
  "authorTitle",
  "authorName",
  "authorRole",
  "authorP1",
  "authorP2",
  "github",
  "sourceCode",
  "ctaTitle",
  "ctaHighlight",
  "ctaDescription",
  "ctaGuide",
  "ctaGithub",
] as const;

describe("i18n about namespace", () => {
  it("exists in FR", () => {
    expect((fr as Record<string, unknown>).about).toBeDefined();
    expect(typeof (fr as Record<string, unknown>).about).toBe("object");
  });

  it("exists in EN", () => {
    expect((en as Record<string, unknown>).about).toBeDefined();
    expect(typeof (en as Record<string, unknown>).about).toBe("object");
  });

  for (const key of ABOUT_KEYS_USED_BY_PAGE) {
    it(`FR has about.${key}`, () => {
      const about = (fr as Record<string, Record<string, unknown>>).about;
      expect(about?.[key], `missing about.${key} in fr.json`).toBeTruthy();
      expect(typeof about?.[key]).toBe("string");
    });

    it(`EN has about.${key}`, () => {
      const about = (en as Record<string, Record<string, unknown>>).about;
      expect(about?.[key], `missing about.${key} in en.json`).toBeTruthy();
      expect(typeof about?.[key]).toBe("string");
    });
  }
});
