import { test, expect } from "@playwright/test";

/**
 * DSK-2 : parité FR/EN sur la page /skills/impeccable.
 * Couvre le rendu, le breadcrumb, les H2 cornerstone, la commande
 * d'installation visible, les cross-links vers les 3 autres cornerstones
 * skills et le lien sortant vers le repo GitHub.
 */

const FR_PATH = "/fr/skills/impeccable/";
const EN_PATH = "/en/skills/impeccable/";

test.describe("/skills/impeccable — rendu et structure", () => {
  test("FR : titre, h1 et mention du skill", async ({ page }) => {
    await page.goto(FR_PATH);
    await expect(page).toHaveTitle(/Impeccable/i);
    const h1 = page.getByRole("heading", { level: 1 });
    await expect(h1).toBeVisible();
    await expect(h1).toContainText(/Impeccable/i);
    await expect(page.locator("main")).toContainText("Impeccable");
  });

  test("EN : title, h1 and skill mention", async ({ page }) => {
    await page.goto(EN_PATH);
    await expect(page).toHaveTitle(/Impeccable/i);
    const h1 = page.getByRole("heading", { level: 1 });
    await expect(h1).toBeVisible();
    await expect(h1).toContainText(/Impeccable/i);
    await expect(page.locator("main")).toContainText("Impeccable");
  });
});

test.describe("/skills/impeccable — breadcrumb", () => {
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

test.describe("/skills/impeccable — sections éditoriales", () => {
  test("FR : H2 cornerstone (installation, commandes, anti-patterns, cas d'échec)", async ({
    page,
  }) => {
    await page.goto(FR_PATH);
    await expect(
      page.getByRole("heading", { level: 2, name: /installation/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { level: 2, name: /23 commandes/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { level: 2, name: /anti-patterns/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { level: 2, name: /cas d'échec/i }),
    ).toBeVisible();
  });

  test("EN : main H2 sections (install, commands, anti-patterns, failure modes)", async ({
    page,
  }) => {
    await page.goto(EN_PATH);
    await expect(
      page.getByRole("heading", { level: 2, name: /^install/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { level: 2, name: /23 commands/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { level: 2, name: /anti-pattern rules/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { level: 2, name: /failure modes/i }),
    ).toBeVisible();
  });
});

test.describe("/skills/impeccable — commande d'installation", () => {
  test("FR : commande npx skills add pbakaus/impeccable visible", async ({
    page,
  }) => {
    await page.goto(FR_PATH);
    await expect(page.locator("main")).toContainText(
      "npx skills add pbakaus/impeccable",
    );
  });

  test("EN : npx skills add pbakaus/impeccable command visible", async ({
    page,
  }) => {
    await page.goto(EN_PATH);
    await expect(page.locator("main")).toContainText(
      "npx skills add pbakaus/impeccable",
    );
  });
});

test.describe("/skills/impeccable — cross-links vers cornerstones skills", () => {
  test("FR : liens vers find-skills, best-skills, comparison", async ({
    page,
  }) => {
    await page.goto(FR_PATH);
    const main = page.locator("main");
    await expect(
      main.getByRole("link", { name: /find-skills/i }).first(),
    ).toBeVisible();
    await expect(
      main.getByRole("link", { name: /skills incontournables 2026/i }).first(),
    ).toBeVisible();
    await expect(
      main
        .getByRole("link", { name: /comparatif.*skills.*mcp.*plugins/i })
        .first(),
    ).toBeVisible();
  });

  test("EN : links to find-skills, best-skills, comparison", async ({
    page,
  }) => {
    await page.goto(EN_PATH);
    const main = page.locator("main");
    await expect(
      main.getByRole("link", { name: /find-skills/i }).first(),
    ).toBeVisible();
    await expect(
      main.getByRole("link", { name: /must-have skills 2026/i }).first(),
    ).toBeVisible();
    await expect(
      main
        .getByRole("link", { name: /skills vs mcp vs plugins comparison/i })
        .first(),
    ).toBeVisible();
  });
});

test.describe("/skills/impeccable — lien sortant vers github pbakaus", () => {
  test("FR : lien vers github.com/pbakaus/impeccable présent", async ({
    page,
  }) => {
    await page.goto(FR_PATH);
    await expect(
      page
        .locator("main")
        .getByRole("link", { name: "github.com/pbakaus/impeccable" })
        .first(),
    ).toBeVisible();
  });

  test("EN : link to github.com/pbakaus/impeccable present", async ({
    page,
  }) => {
    await page.goto(EN_PATH);
    await expect(
      page
        .locator("main")
        .getByRole("link", { name: "github.com/pbakaus/impeccable" })
        .first(),
    ).toBeVisible();
  });
});
