import { test, expect } from "@playwright/test";

/**
 * SR-8 : parité FR/EN sur la page /advanced/security-review.
 * Couvre le rendu, le breadcrumb, la TOC, le tableau d'éligibilité,
 * et la présence de cross-links vers les pages sécurité existantes
 * (cf. SR-6, PR #203).
 */

const FR_PATH = "/fr/advanced/security-review/";
const EN_PATH = "/en/advanced/security-review/";

test.describe("/advanced/security-review — rendu et structure", () => {
  test("FR : titre, h1 et mention de la commande", async ({ page }) => {
    await page.goto(FR_PATH);
    await expect(page).toHaveTitle(/security-review/i);
    const h1 = page.getByRole("heading", { level: 1 });
    await expect(h1).toBeVisible();
    await expect(h1).toContainText(/security-review/i);
    await expect(page.locator("main")).toContainText("/security-review");
  });

  test("EN : title, h1 and command mention", async ({ page }) => {
    await page.goto(EN_PATH);
    await expect(page).toHaveTitle(/security-review/i);
    const h1 = page.getByRole("heading", { level: 1 });
    await expect(h1).toBeVisible();
    await expect(h1).toContainText(/security-review/i);
    await expect(page.locator("main")).toContainText("/security-review");
  });
});

test.describe("/advanced/security-review — breadcrumb", () => {
  // NB : la page expose actuellement deux <nav> avec le même aria-label
  // (SectionLayout + SectionSlugContent). On cible le breadcrumb du contenu
  // principal via .first() en attendant un fix d'a11y côté layout.
  test("FR : breadcrumb visible avec lien Accueil", async ({ page }) => {
    await page.goto(FR_PATH);
    const breadcrumb = page
      .getByRole("navigation", { name: "Fil d'Ariane" })
      .first();
    await expect(breadcrumb).toBeVisible();
    await expect(
      breadcrumb.getByRole("link", { name: "Accueil" }).first(),
    ).toBeVisible();
  });

  test("EN : breadcrumb visible with Home link", async ({ page }) => {
    await page.goto(EN_PATH);
    const breadcrumb = page
      .getByRole("navigation", { name: "Breadcrumb" })
      .first();
    await expect(breadcrumb).toBeVisible();
    await expect(
      breadcrumb.getByRole("link", { name: "Home" }).first(),
    ).toBeVisible();
  });
});

test.describe("/advanced/security-review — sections éditoriales", () => {
  // SectionSlugContent ne rend pas <TableOfContents> sur cette section,
  // donc on valide directement la présence des H2 cornerstone qui
  // structurent la page (rigueur éditoriale + signal SEO).
  test("FR : sections principales (CLI, GHA, familles, limites)", async ({
    page,
  }) => {
    await page.goto(FR_PATH);
    await expect(
      page.getByRole("heading", { level: 2, name: /utiliser la commande/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { level: 2, name: /github action/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { level: 2, name: /5 familles/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { level: 2, name: /limites/i }),
    ).toBeVisible();
  });

  test("EN : main sections (CLI, GHA, families, limits)", async ({ page }) => {
    await page.goto(EN_PATH);
    await expect(
      page.getByRole("heading", { level: 2, name: /running the command/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { level: 2, name: /github action/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { level: 2, name: /5 official families/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { level: 2, name: /limits/i }),
    ).toBeVisible();
  });
});

test.describe("/advanced/security-review — éligibilité par plan", () => {
  test("FR : section éligibilité présente avec Pro et Max", async ({ page }) => {
    await page.goto(FR_PATH);
    const heading = page.getByRole("heading", {
      level: 2,
      name: /éligibilité/i,
    });
    await expect(heading).toBeVisible();
    const main = page.locator("main");
    await expect(main).toContainText(/Pro/);
    await expect(main).toContainText(/Max/);
  });

  test("EN : eligibility section with Pro and Max", async ({ page }) => {
    await page.goto(EN_PATH);
    const heading = page.getByRole("heading", {
      level: 2,
      name: /plan eligibility/i,
    });
    await expect(heading).toBeVisible();
    const main = page.locator("main");
    await expect(main).toContainText(/Pro/);
    await expect(main).toContainText(/Max/);
  });
});

test.describe("/advanced/security-review — cross-links sécurité (SR-6)", () => {
  test("FR : lien interne vers au moins une page sécurité existante", async ({
    page,
  }) => {
    await page.goto(FR_PATH);
    const securityLinks = page
      .locator("main")
      .locator(
        'a[href*="/fr/content/bonnes-pratiques-securite"], ' +
          'a[href*="/fr/content/ci-cd-cyber-securite"], ' +
          'a[href*="/fr/mcp/securite-mcp"], ' +
          'a[href*="/fr/plugins/best-security"], ' +
          'a[href*="/fr/content/fuite-cle-api"]',
      );
    expect(await securityLinks.count()).toBeGreaterThanOrEqual(1);
  });

  test("EN : internal link to at least one existing security page", async ({
    page,
  }) => {
    await page.goto(EN_PATH);
    const securityLinks = page
      .locator("main")
      .locator(
        'a[href*="/en/content/security-best-practices"], ' +
          'a[href*="/en/content/ci-cd-cyber-security"], ' +
          'a[href*="/en/mcp/mcp-security"], ' +
          'a[href*="/en/plugins/best-security"], ' +
          'a[href*="/en/content/leaked-api-key-recovery"]',
      );
    expect(await securityLinks.count()).toBeGreaterThanOrEqual(1);
  });
});

test.describe("/advanced/security-review — lien GitHub Action officielle", () => {
  test("FR : page mentionne et linke le repo anthropics/claude-code-security-review", async ({
    page,
  }) => {
    await page.goto(FR_PATH);
    const ghaLink = page
      .locator("main")
      .locator(
        'a[href*="github.com/anthropics/claude-code-security-review"]',
      );
    expect(await ghaLink.count()).toBeGreaterThanOrEqual(1);
  });

  test("EN : page references the official GitHub Action repo", async ({
    page,
  }) => {
    await page.goto(EN_PATH);
    const ghaLink = page
      .locator("main")
      .locator(
        'a[href*="github.com/anthropics/claude-code-security-review"]',
      );
    expect(await ghaLink.count()).toBeGreaterThanOrEqual(1);
  });
});
