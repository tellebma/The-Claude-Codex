import { describe, it, expect, vi } from "vitest";

vi.mock("@/lib/mdx", () => ({
  getAllMdxFiles: vi.fn(() => []),
}));

import {
  NOT_FOUND_STRINGS_FR,
  NOT_FOUND_STRINGS_EN,
  FALLBACK_SUGGESTIONS_FR,
  FALLBACK_SUGGESTIONS_EN,
  getNotFoundBundles,
} from "@/lib/not-found-strings";

describe("not-found-strings", () => {
  describe("strings constantes", () => {
    it("FR et EN ont les mêmes clés", () => {
      expect(Object.keys(NOT_FOUND_STRINGS_FR).sort()).toEqual(
        Object.keys(NOT_FOUND_STRINGS_EN).sort(),
      );
    });

    it("toutes les strings FR sont non-vides", () => {
      for (const value of Object.values(NOT_FOUND_STRINGS_FR)) {
        expect(value.length).toBeGreaterThan(0);
      }
    });

    it("toutes les strings EN sont non-vides", () => {
      for (const value of Object.values(NOT_FOUND_STRINGS_EN)) {
        expect(value.length).toBeGreaterThan(0);
      }
    });
  });

  describe("fallback suggestions", () => {
    it("FR et EN exposent le même nombre de suggestions", () => {
      expect(FALLBACK_SUGGESTIONS_FR.length).toBe(
        FALLBACK_SUGGESTIONS_EN.length,
      );
    });

    it("chaque suggestion FR a un href non vide", () => {
      for (const s of FALLBACK_SUGGESTIONS_FR) {
        expect(s.href.length).toBeGreaterThan(0);
        expect(s.title.length).toBeGreaterThan(0);
        expect(s.description.length).toBeGreaterThan(0);
      }
    });

    it("chaque suggestion EN a un href non vide", () => {
      for (const s of FALLBACK_SUGGESTIONS_EN) {
        expect(s.href.length).toBeGreaterThan(0);
        expect(s.title.length).toBeGreaterThan(0);
        expect(s.description.length).toBeGreaterThan(0);
      }
    });

    it("les href FR et EN pointent vers les mêmes slugs (miroir)", () => {
      const hrefsFr = FALLBACK_SUGGESTIONS_FR.map((s) => s.href);
      const hrefsEn = FALLBACK_SUGGESTIONS_EN.map((s) => s.href);
      expect(hrefsFr).toEqual(hrefsEn);
    });
  });

  describe("getNotFoundBundles", () => {
    it("retourne un bundle pour fr et en", () => {
      const bundles = getNotFoundBundles();
      expect(bundles.fr).toBeDefined();
      expect(bundles.en).toBeDefined();
    });

    it("chaque bundle contient strings, fallbackSuggestions et recentArticles", () => {
      const bundles = getNotFoundBundles();
      expect(bundles.fr.strings).toBe(NOT_FOUND_STRINGS_FR);
      expect(bundles.fr.fallbackSuggestions).toBe(FALLBACK_SUGGESTIONS_FR);
      expect(bundles.fr.recentArticles).toBeInstanceOf(Array);
      expect(bundles.en.strings).toBe(NOT_FOUND_STRINGS_EN);
      expect(bundles.en.fallbackSuggestions).toBe(FALLBACK_SUGGESTIONS_EN);
      expect(bundles.en.recentArticles).toBeInstanceOf(Array);
    });
  });
});
