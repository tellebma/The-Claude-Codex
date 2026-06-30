import { test, expect } from "@playwright/test";

/**
 * DSK-1 : article cornerstone /content/stack-design-claude-code.
 * Parité FR/EN, TL;DR, tableau comparatif (DSK-5), liens vers les fiches,
 * JSON-LD Article, et journey card → fiche Impeccable.
 */

const FR_PATH = "/fr/content/stack-design-claude-code/";
const EN_PATH = "/en/content/stack-design-claude-code/";

test.describe("/content/stack-design-claude-code — rendu et structure", () => {
  test("FR : titre, h1 et TL;DR actionnable", async ({ page }) => {
    await page.goto(FR_PATH);
    await expect(page).toHaveTitle(/Stack design Claude Code/i);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.locator("main")).toContainText(
      "npx skills add pbakaus/impeccable",
    );
  });

  test("EN : title, h1 and actionable TL;DR", async ({ page }) => {
    await page.goto(EN_PATH);
    await expect(page).toHaveTitle(/design stack/i);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.locator("main")).toContainText(
      "npx skills add Leonxlnx/taste-skill",
    );
  });
});

test.describe("/content/stack-design-claude-code — comparatif (DSK-5)", () => {
  test("FR : tableau comparatif avec les 4 skills", async ({ page }) => {
    await page.goto(FR_PATH);
    const table = page.locator("main table");
    await expect(table.first()).toBeVisible();
    await expect(table.first()).toContainText("Impeccable");
    await expect(table.first()).toContainText("UI UX Pro Max");
    await expect(table.first()).toContainText("Taste Skill");
    await expect(table.first()).toContainText("Huashu Design");
  });
});

test.describe("/content/stack-design-claude-code — JSON-LD Article", () => {
  test("FR : un script JSON-LD de type Article est présent", async ({
    page,
  }) => {
    await page.goto(FR_PATH);
    const scripts = page.locator('script[type="application/ld+json"]');
    const count = await scripts.count();
    let foundArticle = false;
    for (let i = 0; i < count; i++) {
      const content = await scripts.nth(i).textContent();
      if (content?.includes('"@type":"Article"')) {
        foundArticle = true;
        break;
      }
    }
    expect(foundArticle).toBe(true);
  });
});

test.describe("/content/stack-design-claude-code — journey vers fiche", () => {
  test("FR : lien vers la fiche Impeccable navigue correctement", async ({
    page,
  }) => {
    await page.goto(FR_PATH);
    await page
      .locator("main")
      .getByRole("link", { name: /Fiche détaillée Impeccable/i })
      .first()
      .click();
    await expect(page).toHaveURL(/\/fr\/skills\/impeccable\/?$/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      /Impeccable/i,
    );
  });
});
