import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";

/**
 * Garde de regression — EPIC tuto-pages article-shell (TUTO-8).
 *
 * Verifie le cablage final du rollout du shell editorial :
 *
 *  - Les 6 sections tuto migrees (`getting-started`, `skills`, `prompting`,
 *    `mcp`, `agents`, `advanced`) rendent toutes `TutoArticleContent`
 *    (ArticleShell + SectionPeers) et n'importent plus l'ancien
 *    `SectionSlugContent`.
 *  - Les sections NON migrees continuent de rendre `SectionSlugContent`.
 *    Ce volet documente que `SectionSlugContent` (et la chaine
 *    `SectionLayout` + `SectionSidebar` qui l'entoure) reste necessaire :
 *    ce n'est PAS du code mort, malgre le rollout tuto.
 *
 * Test statique sur la source des routes `[slug]/page.tsx` : pas de build
 * ni de navigateur requis, donc sans impact sur le budget CI.
 */

const APP_DIR = join(process.cwd(), "src", "app", "[locale]");

function slugPageSource(section: string): string {
  return readFileSync(join(APP_DIR, section, "[slug]", "page.tsx"), "utf-8");
}

/** Sections basculees vers le shell article (TUTO-3 a TUTO-7). */
const MIGRATED_SECTIONS = [
  "getting-started",
  "skills",
  "prompting",
  "mcp",
  "agents",
  "advanced",
] as const;

/**
 * Sections hors scope EPIC tuto : elles gardent le rendu historique
 * `SectionSlugContent`. Sert de garde anti-suppression : tant qu'au moins
 * une route ici l'utilise, le composant ne doit pas etre supprime.
 */
const LEGACY_SECTIONS = [
  "plugins",
  "reference",
  "future",
  "enterprise",
  "personas",
  "limits",
  "use-cases",
  "ecosystem",
] as const;

describe("TUTO article-shell rollout guard", () => {
  describe.each(MIGRATED_SECTIONS)("migrated section %s", (section) => {
    const source = slugPageSource(section);

    it("renders TutoArticleContent", () => {
      expect(source).toMatch(
        /from\s+["']@\/components\/layout\/TutoArticleContent["']/
      );
      expect(source).toContain("<TutoArticleContent");
    });

    it("does not reference the legacy SectionSlugContent", () => {
      expect(source).not.toContain("SectionSlugContent");
    });
  });

  describe.each(LEGACY_SECTIONS)("non-migrated section %s", (section) => {
    const source = slugPageSource(section);

    it("still renders SectionSlugContent (component remains required)", () => {
      expect(source).toContain("SectionSlugContent");
    });

    it("is not (yet) on the article shell", () => {
      expect(source).not.toContain("TutoArticleContent");
    });
  });

  it("keeps SectionSlugContent in the codebase while legacy sections use it", () => {
    const componentPath = join(
      process.cwd(),
      "src",
      "components",
      "layout",
      "SectionSlugContent.tsx"
    );
    expect(() => readFileSync(componentPath, "utf-8")).not.toThrow();
  });
});
