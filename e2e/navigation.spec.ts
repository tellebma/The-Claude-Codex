import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test("homepage loads with correct title", async ({ page }) => {
    await page.goto("/fr/");
    await expect(page).toHaveTitle(/Claude Codex/);
  });

  test("can navigate to Getting Started section", async ({ page }) => {
    await page.goto("/fr/");
    await page.getByRole("link", { name: "Démarrer" }).first().click();
    await expect(page).toHaveURL(/\/fr\/getting-started/);
    await expect(
      page.getByRole("heading", { level: 1 })
    ).toBeVisible();
  });

  test("can navigate to MCP section", async ({ page }) => {
    await page.goto("/fr/");
    await page.getByRole("link", { name: "MCP" }).first().click();
    await expect(page).toHaveURL(/\/fr\/mcp/);
    await expect(
      page.getByRole("heading", { level: 1 })
    ).toBeVisible();
  });

  test("can navigate to Prompting section", async ({ page }) => {
    await page.goto("/fr/");
    await page.getByRole("link", { name: "Prompting" }).first().click();
    await expect(page).toHaveURL(/\/fr\/prompting/);
    await expect(
      page.getByRole("heading", { level: 1 })
    ).toBeVisible();
  });

  test("can navigate to Reference section", async ({ page }) => {
    await page.goto("/fr/");
    await page.getByRole("link", { name: "Référence" }).first().click();
    await expect(page).toHaveURL(/\/fr\/reference/);
    await expect(
      page.getByRole("heading", { level: 1 })
    ).toBeVisible();
  });

  test("breadcrumb is visible on sub-pages", async ({ page }) => {
    await page.goto("/fr/mcp/");
    await expect(
      page.getByRole("navigation", { name: "Fil d'Ariane" })
    ).toBeVisible();
  });

  test("breadcrumb home link navigates to homepage", async ({ page }) => {
    await page.goto("/fr/mcp/");
    await page
      .getByRole("navigation", { name: "Fil d'Ariane" })
      .getByRole("link", { name: "Accueil" })
      .click();
    await expect(page).toHaveURL(/\/fr\/?$/);
  });
});
