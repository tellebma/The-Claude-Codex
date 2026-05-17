import { test, expect } from "@playwright/test";

/**
 * FS-7 : parité FR/EN sur la page /skills/find-skills.
 * Couvre le rendu, le breadcrumb, les H2 cornerstone, la commande
 * d'installation visible, et la présence de cross-links vers les
 * 4 cornerstones skills (cf. FS-6).
 */

const FR_PATH = "/fr/skills/find-skills/";
const EN_PATH = "/en/skills/find-skills/";

test.describe("/skills/find-skills — rendu et structure", () => {
  test("FR : titre, h1 et mention du skill", async ({ page }) => {
    await page.goto(FR_PATH);
    await expect(page).toHaveTitle(/find-skills/i);
    const h1 = page.getByRole("heading", { level: 1 });
    await expect(h1).toBeVisible();
    await expect(h1).toContainText(/find-skills/i);
    await expect(page.locator("main")).toContainText("find-skills");
  });

  test("EN : title, h1 and skill mention", async ({ page }) => {
    await page.goto(EN_PATH);
    await expect(page).toHaveTitle(/find-skills/i);
    const h1 = page.getByRole("heading", { level: 1 });
    await expect(h1).toBeVisible();
    await expect(h1).toContainText(/find-skills/i);
    await expect(page.locator("main")).toContainText("find-skills");
  });
});

test.describe("/skills/find-skills — breadcrumb", () => {
  // NB : workaround `.first()` aligné sur la pattern existante des autres
  // pages section (cf. e2e/advanced-security-review.spec.ts) — la page
  // expose deux <nav> avec le même aria-label (bug a11y latent côté layout).
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

test.describe("/skills/find-skills — sections éditoriales", () => {
  test("FR : H2 cornerstone (comment fonctionne, installer, critères, limites)", async ({
    page,
  }) => {
    await page.goto(FR_PATH);
    await expect(
      page.getByRole("heading", { level: 2, name: /comment fonctionne/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { level: 2, name: /installer/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { level: 2, name: /critères de qualité/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { level: 2, name: /limites/i }),
    ).toBeVisible();
  });

  test("EN : main H2 sections (how it works, install, quality, limits)", async ({
    page,
  }) => {
    await page.goto(EN_PATH);
    await expect(
      page.getByRole("heading", { level: 2, name: /how .+ works/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { level: 2, name: /install/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { level: 2, name: /quality criteria/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { level: 2, name: /limits/i }),
    ).toBeVisible();
  });
});

test.describe("/skills/find-skills — commande d'installation", () => {
  test("FR : commande npx skills add visible", async ({ page }) => {
    await page.goto(FR_PATH);
    await expect(page.locator("main")).toContainText(
      "npx skills add vercel-labs/skills@find-skills",
    );
  });

  test("EN : npx skills add command visible", async ({ page }) => {
    await page.goto(EN_PATH);
    await expect(page.locator("main")).toContainText(
      "npx skills add vercel-labs/skills@find-skills",
    );
  });
});

test.describe("/skills/find-skills — cross-links vers cornerstones skills", () => {
  // FS-6 a établi la bidirectionnalité : la page link vers les 4 autres
  // pages skills. Ce test valide qu'au moins 3 des 4 liens internes
  // attendus sont présents (tolérance pour évolutions éditoriales).
  test("FR : liens vers what-are-skills, best-skills, comparison, create-custom", async ({
    page,
  }) => {
    await page.goto(FR_PATH);
    const main = page.locator("main");
    await expect(
      main.getByRole("link", { name: /qu'est-ce qu'un skill/i }).first(),
    ).toBeVisible();
    await expect(
      main.getByRole("link", { name: /skills incontournables 2026/i }).first(),
    ).toBeVisible();
    await expect(
      main
        .getByRole("link", { name: /comparaison.*skills.*agents.*plugins/i })
        .first(),
    ).toBeVisible();
    await expect(
      main.getByRole("link", { name: /créer son propre skill/i }).first(),
    ).toBeVisible();
  });

  test("EN : links to what-are-skills, best-skills, comparison, create-custom", async ({
    page,
  }) => {
    await page.goto(EN_PATH);
    const main = page.locator("main");
    await expect(
      main.getByRole("link", { name: /what is a skill/i }).first(),
    ).toBeVisible();
    await expect(
      main.getByRole("link", { name: /top skills for 2026/i }).first(),
    ).toBeVisible();
    await expect(
      main
        .getByRole("link", { name: /skills vs agents vs plugins/i })
        .first(),
    ).toBeVisible();
    await expect(
      main.getByRole("link", { name: /create your own skill/i }).first(),
    ).toBeVisible();
  });
});

test.describe("/skills/find-skills — lien sortant vers github vercel-labs", () => {
  test("FR : lien vers github.com/vercel-labs/skills présent", async ({
    page,
  }) => {
    await page.goto(FR_PATH);
    await expect(
      page
        .locator("main")
        .getByRole("link", { name: "github.com/vercel-labs/skills" })
        .first(),
    ).toBeVisible();
  });

  test("EN : link to github.com/vercel-labs/skills present", async ({
    page,
  }) => {
    await page.goto(EN_PATH);
    await expect(
      page
        .locator("main")
        .getByRole("link", { name: "github.com/vercel-labs/skills" })
        .first(),
    ).toBeVisible();
  });
});
