import { test, expect } from "@playwright/test";

/**
 * B-ART-2 — Verifie que les cards "Articles recents" de la landing
 * pointent vers des pages reellement ouvrables (pas de 404).
 *
 * Garde-fou contre la regression du commit 8ae1e65 (RG-32) ou les slugs
 * d'articles de section etaient prefixes deux fois (-> /fr/mcp/mcp/...).
 */

const LOCALES = [
  { code: "fr", regionName: "Articles récents" },
  { code: "en", regionName: "Recent articles" },
] as const;

for (const { code, regionName } of LOCALES) {
  test.describe(`Landing /${code}/ — section "Articles recents"`, () => {
    test(`chaque card mene a une page valide (pas de 404)`, async ({ page }) => {
      await page.goto(`/${code}/`);

      const region = page.getByRole("region", { name: regionName });
      await expect(region).toBeVisible();

      const cardLinks = region.locator("a[href]");
      const count = await cardLinks.count();
      expect(count).toBeGreaterThan(0);

      const hrefs: string[] = [];
      for (let i = 0; i < count; i += 1) {
        const href = await cardLinks.nth(i).getAttribute("href");
        if (href && !hrefs.includes(href)) {
          hrefs.push(href);
        }
      }

      // Garantit qu'aucun href n'a la section dupliquee (regression B-ART-1).
      for (const href of hrefs) {
        const segments = href.split("/").filter(Boolean);
        const duplicates = segments.filter(
          (segment, index) => segments.indexOf(segment) !== index
        );
        expect(
          duplicates,
          `href ${href} contient des segments dupliques: ${duplicates.join(", ")}`
        ).toEqual([]);
      }

      for (const href of hrefs) {
        const response = await page.goto(href);
        expect(response, `goto(${href}) sans response`).not.toBeNull();
        expect(response!.ok(), `${href} -> status ${response!.status()}`).toBe(
          true
        );
        const title = await page.title();
        expect(title.trim().length, `${href} -> title vide`).toBeGreaterThan(0);
        await expect(
          page.getByRole("heading", { level: 1 }).first()
        ).toBeVisible();
      }
    });
  });
}
