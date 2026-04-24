import { describe, it, expect } from "vitest";
import {
  pathToQuery,
  detectLocaleFromPath,
  prefixWithLocale,
} from "@/lib/not-found-utils";

describe("not-found-utils", () => {
  describe("pathToQuery", () => {
    it("retire les slashes de bords et remplace séparateurs par espaces", () => {
      expect(pathToQuery("/fr/getting-started/first-project/")).toBe(
        "fr getting started first project",
      );
    });

    it("gère un pathname sans slash final", () => {
      expect(pathToQuery("/mcp/setup")).toBe("mcp setup");
    });

    it("remplace les underscores aussi", () => {
      expect(pathToQuery("/my_fancy_page")).toBe("my fancy page");
    });

    it("retourne chaîne vide pour la racine", () => {
      expect(pathToQuery("/")).toBe("");
    });

    it("gère les multiples tirets consécutifs", () => {
      expect(pathToQuery("/foo--bar")).toBe("foo  bar");
    });
  });

  describe("detectLocaleFromPath", () => {
    it("détecte /fr prefixé", () => {
      expect(detectLocaleFromPath("/fr/mcp/setup")).toBe("fr");
    });

    it("détecte /en prefixé", () => {
      expect(detectLocaleFromPath("/en/skills/best-skills")).toBe("en");
    });

    it("détecte /fr exact (pas de slash après)", () => {
      expect(detectLocaleFromPath("/fr")).toBe("fr");
    });

    it("détecte /en exact", () => {
      expect(detectLocaleFromPath("/en")).toBe("en");
    });

    it("retourne null pour un chemin sans locale", () => {
      expect(detectLocaleFromPath("/random/path")).toBeNull();
    });

    it("retourne null pour la racine", () => {
      expect(detectLocaleFromPath("/")).toBeNull();
    });

    it("ne match pas /french (préfixe partiel)", () => {
      expect(detectLocaleFromPath("/french-guide")).toBeNull();
    });

    it("ne match pas /england (préfixe partiel)", () => {
      expect(detectLocaleFromPath("/england-travel")).toBeNull();
    });
  });

  describe("prefixWithLocale", () => {
    it("ajoute le préfixe /fr si absent", () => {
      expect(prefixWithLocale("/mcp/setup", "fr")).toBe("/fr/mcp/setup");
    });

    it("ajoute le préfixe /en si absent", () => {
      expect(prefixWithLocale("/skills", "en")).toBe("/en/skills");
    });

    it("conserve l'href déjà préfixé /fr/", () => {
      expect(prefixWithLocale("/fr/getting-started", "fr")).toBe(
        "/fr/getting-started",
      );
    });

    it("conserve l'href qui est exactement /fr", () => {
      expect(prefixWithLocale("/fr", "fr")).toBe("/fr");
    });

    it("conserve les URLs absolues http", () => {
      expect(prefixWithLocale("http://example.com", "fr")).toBe(
        "http://example.com",
      );
    });

    it("conserve les URLs absolues https", () => {
      expect(prefixWithLocale("https://example.com/path", "en")).toBe(
        "https://example.com/path",
      );
    });

    it("normalise /", () => {
      expect(prefixWithLocale("/", "fr")).toBe("/fr");
    });

    it("ajoute le slash manquant si besoin", () => {
      expect(prefixWithLocale("content/article", "fr")).toBe(
        "/fr/content/article",
      );
    });
  });
});
