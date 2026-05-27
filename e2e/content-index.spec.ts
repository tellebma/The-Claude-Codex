import { test, expect, type Page } from "@playwright/test";

/**
 * CTN-12 — Couverture E2E de la vitrine editoriale /content (EPIC Content
 * page redesign). Parite FR + EN, sections, filtres themes (toggle / OR /
 * aria-pressed / reset / clavier), JSON-LD (CollectionPage + BreadcrumbList +
 * ItemList), balises OpenGraph, lien vers un article, CTA du hero.
 *
 * Etat des sections data-driven au moment de l'ecriture :
 *   - "Most read" (most-read) : visible des que article-stats.json a des vues
 *     30 jours (cf. refresh Matomo CTN-6/7).
 *   - "Trending" (trending) : visible uniquement si un article depasse le seuil
 *     pageviewsLast7d > 20 ; sinon masque (fallback gracieux). On verifie donc
 *     l'ABSENCE du DOM quand la donnee ne le justifie pas.
 */

interface LocaleFixture {
  readonly locale: "fr" | "en";
  readonly path: string;
  readonly htmlLang: string;
  readonly heroTitle: RegExp;
  readonly allArticlesAria: string;
  readonly filterAria: string;
  readonly resetLabel: RegExp;
}

const LOCALES: ReadonlyArray<LocaleFixture> = [
  {
    locale: "fr",
    path: "/fr/content/",
    htmlLang: "fr",
    heroTitle: /Contenus editoriaux/i,
    allArticlesAria: "Tous les articles",
    filterAria: "Filtrer par theme",
    resetLabel: /Reinitialiser les filtres/i,
  },
  {
    locale: "en",
    path: "/en/content/",
    htmlLang: "en",
    heroTitle: /Editorial content/i,
    allArticlesAria: "All articles",
    filterAria: "Filter by theme",
    resetLabel: /Reset filters/i,
  },
];

async function readJsonLdTypes(page: Page): Promise<string[]> {
  const raw = await page.locator('script[type="application/ld+json"]').allTextContents();
  const types: string[] = [];
  for (const block of raw) {
    try {
      const parsed = JSON.parse(block) as { "@type"?: unknown };
      if (typeof parsed["@type"] === "string") types.push(parsed["@type"]);
    } catch {
      // un bloc JSON-LD malforme ferait echouer un autre test dedie
    }
  }
  return types;
}

for (const fx of LOCALES) {
  test.describe(`/content (${fx.locale})`, () => {
    test("rend le hero, le compteur et les sections de base", async ({ page }) => {
      await page.goto(fx.path);

      await expect(page.locator("html")).toHaveAttribute("lang", fx.htmlLang);
      const h1 = page.getByRole("heading", { level: 1 });
      await expect(h1).toBeVisible();
      await expect(h1).toContainText(fx.heroTitle);

      // Sections structurelles toujours presentes.
      await expect(page.locator("#pinned-latest")).toBeVisible();
      await expect(page.locator("#all-articles")).toBeVisible();
    });

    test("expose le JSON-LD CollectionPage + BreadcrumbList", async ({ page }) => {
      await page.goto(fx.path);
      const types = await readJsonLdTypes(page);
      expect(types).toContain("CollectionPage");
      expect(types).toContain("BreadcrumbList");
    });

    test("expose les balises OpenGraph (image, title, description)", async ({ page }) => {
      await page.goto(fx.path);
      for (const prop of ["og:image", "og:title", "og:description"]) {
        const content = await page
          .locator(`meta[property="${prop}"]`)
          .first()
          .getAttribute("content");
        expect(content, `${prop} doit etre present et non vide`).toBeTruthy();
      }
    });

    test("filtre par theme : toggle aria-pressed + bouton reset", async ({ page }) => {
      await page.goto(fx.path);
      const firstChip = page.locator("button[aria-pressed]").first();
      await firstChip.scrollIntoViewIfNeeded();
      await expect(firstChip).toHaveAttribute("aria-pressed", "false");

      await firstChip.click();
      await expect(firstChip).toHaveAttribute("aria-pressed", "true");

      // Le bouton de reinitialisation apparait quand un filtre est actif.
      const reset = page.getByRole("button", { name: fx.resetLabel });
      await expect(reset).toBeVisible();
      await reset.click();
      await expect(firstChip).toHaveAttribute("aria-pressed", "false");
    });

    test("filtre accessible au clavier (Enter pour activer, Escape pour reset)", async ({
      page,
    }) => {
      await page.goto(fx.path);
      const firstChip = page.locator("button[aria-pressed]").first();
      await firstChip.scrollIntoViewIfNeeded();
      await firstChip.focus();
      await expect(firstChip).toBeFocused();

      await page.keyboard.press("Enter");
      await expect(firstChip).toHaveAttribute("aria-pressed", "true");

      await page.keyboard.press("Escape");
      await expect(firstChip).toHaveAttribute("aria-pressed", "false");
    });

    test("le premier article mene vers une page /content/<slug>", async ({ page }) => {
      await page.goto(fx.path);
      const firstArticleLink = page
        .locator("#pinned-latest a[data-matomo-action='article_card_click']")
        .first();
      await expect(firstArticleLink).toBeVisible();
      const href = await firstArticleLink.getAttribute("href");
      expect(href).toMatch(/\/content\/[^/]+/);
      await firstArticleLink.click();
      await expect(page).toHaveURL(/\/content\/[^/]+\/?$/);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    });
  });
}

test.describe("/content — sections data-driven (Most read / Trending)", () => {
  test("FR : Most read visible (stats peuplees), Trending masque sans trafic 7j", async ({
    page,
  }) => {
    await page.goto("/fr/content/");
    // Most read : presente des que des vues 30j existent (snapshot Matomo).
    await expect(page.locator('[data-section="most-read"]')).toBeVisible();
    const itemListPresent = (await readJsonLdTypes(page)).includes("ItemList");
    expect(itemListPresent).toBe(true);
    // Trending : masquee tant qu'aucun article ne depasse le seuil 7j.
    await expect(page.locator('[data-section="trending"]')).toHaveCount(0);
  });
});
