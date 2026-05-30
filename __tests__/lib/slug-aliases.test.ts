import { describe, it, expect } from "vitest";
import { getAlternateLocalePath } from "@/lib/slug-aliases";

/**
 * Regression guard pour les 44 liens internes casses detectes par
 * `npm run audit:links` : le LanguageSwitcher pointait vers /fr/<slug-EN>/
 * au lieu de /fr/<slug-FR>/ pour les articles aux slugs traduits.
 */
describe("getAlternateLocalePath", () => {
  it("traduit le slug d'un article content FR vers EN", () => {
    expect(getAlternateLocalePath("/content/ci-cd-cyber-securite/")).toBe(
      "/content/ci-cd-cyber-security/",
    );
  });

  it("traduit le slug d'un article content EN vers FR", () => {
    expect(getAlternateLocalePath("/content/security-best-practices/")).toBe(
      "/content/bonnes-pratiques-securite/",
    );
  });

  it("traduit le slug d'une page MCP dans les deux sens", () => {
    expect(getAlternateLocalePath("/mcp/mcp-security/")).toBe(
      "/mcp/securite-mcp/",
    );
    expect(getAlternateLocalePath("/mcp/securite-mcp/")).toBe(
      "/mcp/mcp-security/",
    );
  });

  it("preserve le pathname quand le slug est identique entre locales", () => {
    expect(getAlternateLocalePath("/content/garry-tan-stack-claude-code/")).toBe(
      "/content/garry-tan-stack-claude-code/",
    );
  });

  it("preserve l'absence de trailing slash", () => {
    expect(getAlternateLocalePath("/content/fuite-cle-api")).toBe(
      "/content/leaked-api-key-recovery",
    );
  });

  it("retourne la racine inchangee", () => {
    expect(getAlternateLocalePath("/")).toBe("/");
  });
});
