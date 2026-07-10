import { describe, it, expect } from "vitest";
import { getAlternateLocalePath } from "@/lib/slug-aliases";

/**
 * Regression guard pour les liens internes casses detectes par
 * `npm run audit:links` : le LanguageSwitcher pointait vers /fr/<slug-EN>/
 * au lieu de /fr/<slug-FR>/ pour les articles aux slugs traduits.
 *
 * Depuis l'ajout de la locale ES, la fonction prend explicitement la locale
 * source et la locale cible (mapping par groupe, pas un simple toggle
 * binaire) : voir la doc de `getAlternateLocalePath`.
 */
describe("getAlternateLocalePath", () => {
  it("traduit le slug d'un article content FR vers EN", () => {
    expect(
      getAlternateLocalePath("/content/ci-cd-cyber-securite/", "fr", "en"),
    ).toBe("/content/ci-cd-cyber-security/");
  });

  it("traduit le slug d'un article content EN vers FR", () => {
    expect(
      getAlternateLocalePath("/content/security-best-practices/", "en", "fr"),
    ).toBe("/content/bonnes-pratiques-securite/");
  });

  it("traduit le slug de l'article cout des tokens dans les deux sens", () => {
    expect(
      getAlternateLocalePath("/content/cout-tokens-par-langue/", "fr", "en"),
    ).toBe("/content/token-cost-by-language/");
    expect(
      getAlternateLocalePath("/content/token-cost-by-language/", "en", "fr"),
    ).toBe("/content/cout-tokens-par-langue/");
  });

  it("traduit le slug de l'article demo card (DSK-8) dans les deux sens", () => {
    expect(
      getAlternateLocalePath(
        "/content/refaire-une-card-avec-impeccable-et-playwright/",
        "fr",
        "en",
      ),
    ).toBe("/content/redo-a-card-with-impeccable-and-playwright/");
    expect(
      getAlternateLocalePath(
        "/content/redo-a-card-with-impeccable-and-playwright/",
        "en",
        "fr",
      ),
    ).toBe("/content/refaire-une-card-avec-impeccable-et-playwright/");
  });

  it("traduit le slug d'une page MCP dans les deux sens", () => {
    expect(getAlternateLocalePath("/mcp/mcp-security/", "en", "fr")).toBe(
      "/mcp/securite-mcp/",
    );
    expect(getAlternateLocalePath("/mcp/securite-mcp/", "fr", "en")).toBe(
      "/mcp/mcp-security/",
    );
  });

  it("preserve le pathname quand le slug est identique entre locales", () => {
    expect(
      getAlternateLocalePath(
        "/content/garry-tan-stack-claude-code/",
        "fr",
        "en",
      ),
    ).toBe("/content/garry-tan-stack-claude-code/");
  });

  it("preserve l'absence de trailing slash", () => {
    expect(
      getAlternateLocalePath("/content/fuite-cle-api", "fr", "en"),
    ).toBe("/content/leaked-api-key-recovery");
  });

  it("retourne la racine inchangee", () => {
    expect(getAlternateLocalePath("/", "fr", "en")).toBe("/");
  });

  it("retourne le pathname inchange quand la locale source et cible sont identiques", () => {
    expect(
      getAlternateLocalePath("/content/bonnes-pratiques-securite/", "fr", "fr"),
    ).toBe("/content/bonnes-pratiques-securite/");
  });

  it("retombe sur le slug FR vers ES tant qu'aucune traduction ES n'existe pour un article a slug divergent", () => {
    // Le build ES genere les pages manquantes via un fallback sur le slug FR
    // (cf. generateStaticParams des routes [slug]) : le lien doit donc pointer
    // vers ce slug FR, pas vers le slug source original, sous peine de 404
    // (regression detectee par `npm run audit:links`).
    expect(
      getAlternateLocalePath("/content/bonnes-pratiques-securite/", "fr", "es"),
    ).toBe("/content/bonnes-pratiques-securite/");
    expect(
      getAlternateLocalePath("/content/security-best-practices/", "en", "es"),
    ).toBe("/content/bonnes-pratiques-securite/");
  });

  it("retombe sur le slug FR vers EN/FR quand on part d'une page ES generee en fallback", () => {
    // Une page /es/content/bonnes-pratiques-securite/ est un fallback FR (pas
    // encore de traduction ES) : le lien vers EN doit resoudre le VRAI slug
    // EN traduit, pas rester sur le slug FR (qui n'existe pas sous /en/).
    expect(
      getAlternateLocalePath("/content/bonnes-pratiques-securite/", "es", "en"),
    ).toBe("/content/security-best-practices/");
    expect(
      getAlternateLocalePath("/content/bonnes-pratiques-securite/", "es", "fr"),
    ).toBe("/content/bonnes-pratiques-securite/");
  });

  it("preserve un pathname sans slug divergent vers ES", () => {
    expect(
      getAlternateLocalePath("/getting-started/installation/", "fr", "es"),
    ).toBe("/getting-started/installation/");
  });
});
