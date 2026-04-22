import { test, expect } from "@playwright/test";

// Le combobox n'existe QUE quand le SearchDialog est ouvert (conditional render).
// C'est donc un proxy fiable pour "dialog visible/hidden".
// On utilise cet indirect car `getByRole("dialog", { name: "Recherche globale" })`
// renvoie "Received: hidden" en Chromium headless malgré un dialog visuellement
// ouvert (bug d'accessibilité / heuristique Playwright avec aria-modal).
const dialogProxy = (page: import("@playwright/test").Page) =>
  page.getByRole("combobox", { name: "Rechercher" });

test.describe("Search", () => {
  test("opens search dialog with Ctrl+K", async ({ page }) => {
    await page.goto("/fr/");
    await page.keyboard.press("Control+k");
    await expect(dialogProxy(page)).toBeVisible();
  });

  test("opens search dialog by clicking the search button", async ({
    page,
  }) => {
    await page.goto("/fr/");
    await page.getByRole("button", { name: /Rechercher/ }).click();
    await expect(dialogProxy(page)).toBeVisible();
  });

  test("shows results when typing a search query", async ({ page }) => {
    await page.goto("/fr/");
    await page.getByRole("button", { name: /Rechercher/ }).click();

    const input = page.getByRole("combobox", { name: "Rechercher" });
    await input.fill("MCP");

    // Wait for results to appear in the listbox
    const listbox = page.getByRole("listbox", {
      name: "Résultats de recherche",
    });
    await expect(listbox.getByRole("option").first()).toBeVisible();
  });

  test("shows no-result message for unknown queries", async ({ page }) => {
    await page.goto("/fr/");
    await page.getByRole("button", { name: /Rechercher/ }).click();

    const input = page.getByRole("combobox", { name: "Rechercher" });
    await input.fill("xyznonexistentterm");

    // Scope au paragraphe visible (pas à la live region sr-only qui porte
    // le même texte pour les lecteurs d'écran — strict-mode-violation sinon).
    await expect(
      page.getByRole("paragraph").filter({ hasText: /Aucun résultat/ }),
    ).toBeVisible();
  });

  test("closes search dialog with Escape", async ({ page }) => {
    await page.goto("/fr/");
    await page.keyboard.press("Control+k");
    await expect(dialogProxy(page)).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(dialogProxy(page)).not.toBeVisible();
  });
});
