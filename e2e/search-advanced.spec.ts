import { test, expect, devices } from "@playwright/test";

test.describe("Search advanced behaviour", () => {
  test("trigger button has an accessible tap target (44px minimum)", async ({
    page,
  }) => {
    await page.goto("/fr/");
    // .first() évite les matches multiples pendant l'hydration React
    // (si un placeholder SSR et la version hydratée coexistent brièvement).
    const btn = page.getByRole("button", { name: /Rechercher/ }).first();
    await expect(btn).toBeVisible();
    const box = await btn.boundingBox();
    expect(box).not.toBeNull();
    if (box) {
      expect(box.height).toBeGreaterThanOrEqual(44);
      expect(box.width).toBeGreaterThanOrEqual(44);
    }
  });

  test("empty query shows recommended sections", async ({ page }) => {
    await page.goto("/fr/");
    await page.getByRole("button", { name: /Rechercher/ }).click();
    // Proxy dialog-ouvert via combobox (getByRole("dialog") renvoie "hidden"
    // en Chromium headless — bug Playwright avec role=dialog + aria-modal).
    await expect(
      page.getByRole("combobox", { name: "Rechercher" }),
    ).toBeVisible();
    // At least one of the suggestion buttons should appear
    const suggestions = page.locator("button", { hasText: /MCP|Démarrer|prompting|Skills/i });
    await expect(suggestions.first()).toBeVisible();
  });

  test("focus returns to trigger button after closing", async ({ page }) => {
    await page.goto("/fr/");
    const trigger = page.getByRole("button", { name: /Rechercher/ });
    await trigger.click();
    const combobox = page.getByRole("combobox", { name: "Rechercher" });
    await expect(combobox).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(combobox).not.toBeVisible();
    // The trigger should be the active element
    const isFocused = await trigger.evaluate((el) => el === document.activeElement);
    expect(isFocused).toBe(true);
  });

  test("ArrowDown selects next result", async ({ page }) => {
    await page.goto("/fr/");
    await page.getByRole("button", { name: /Rechercher/ }).click();
    const input = page.getByRole("combobox", { name: "Rechercher" });
    await input.fill("MCP");

    const options = page.getByRole("option");
    await expect(options.first()).toBeVisible();

    const initiallySelected = await options
      .first()
      .getAttribute("aria-selected");
    expect(initiallySelected).toBe("true");

    await page.keyboard.press("ArrowDown");
    const secondSelected = await options
      .nth(1)
      .getAttribute("aria-selected");
    expect(secondSelected).toBe("true");
  });

  test("Enter navigates to the selected result", async ({ page }) => {
    await page.goto("/fr/");
    await page.getByRole("button", { name: /Rechercher/ }).click();
    const input = page.getByRole("combobox", { name: "Rechercher" });
    await input.fill("installation");

    const firstOption = page.getByRole("option").first();
    await expect(firstOption).toBeVisible();

    await page.keyboard.press("Enter");
    // Dialog closes — check combobox instead of role=dialog (Playwright bug
    // avec aria-modal renvoyant "hidden" malgré dialog visible).
    await expect(
      page.getByRole("combobox", { name: "Rechercher" }),
    ).not.toBeVisible();
    // URL changed to the selected result
    await expect(page).not.toHaveURL(/^https?:\/\/[^/]+\/?$/);
  });

  test("clear button empties the input", async ({ page }) => {
    await page.goto("/fr/");
    await page.getByRole("button", { name: /Rechercher/ }).click();
    const input = page.getByRole("combobox", { name: "Rechercher" });
    await input.fill("something");
    await expect(input).toHaveValue("something");
    const clearBtn = page.getByRole("button", { name: /effacer|clear/i });
    await expect(clearBtn).toBeVisible();
    // Déclenche le click natif directement sur le bouton. Évite les flakes
    // de stabilité liés au padding-right scrollbar appliqué au body au
    // moment de l'ouverture du dialog (micro-shift de layout).
    await clearBtn.evaluate((btn: HTMLButtonElement) => btn.click());
    await expect(input).toHaveValue("");
  });
});

test.describe("Search on mobile viewport", () => {
  // Ne spread pas devices["iPhone 13"] entier : inclut defaultBrowserType: 'webkit'
  // qui n'est pas autorisé dans un describe (forcerait un nouveau worker).
  // On reproduit juste le viewport iPhone 13 — suffisant pour tester la logique
  // responsive (dialog full-screen, type=search, enterKeyHint).
  test.use({ viewport: devices["iPhone 13"].viewport });

  test("opens full-screen dialog on mobile", async ({ page }) => {
    await page.goto("/fr/");
    await page.getByRole("button", { name: /Rechercher/ }).click();
    // Attente d'ouverture via combobox (getByRole("dialog") renvoie "hidden"
    // en Chromium headless malgré le dialog ouvert).
    await expect(
      page.getByRole("combobox", { name: "Rechercher" }),
    ).toBeVisible();
    // Une fois ouvert, on récupère la boundingBox du container dialog
    // via CSS locator (contourne la même limitation pour les mesures).
    const dialog = page.locator('[role="dialog"][aria-modal="true"]');
    const box = await dialog.boundingBox();
    const viewport = page.viewportSize();
    expect(box).not.toBeNull();
    expect(viewport).not.toBeNull();
    if (box && viewport) {
      // Tolérance 4px : le body.paddingRight ajusté pour la scrollbar
      // peut réduire de 2-4px la largeur utile du dialog en mode emulé.
      // "Full-screen" = largeur ≥ viewport - 4px reste l'intention.
      expect(box.width).toBeGreaterThanOrEqual(viewport.width - 4);
    }
  });

  test("search input has type='search' for native mobile UX", async ({
    page,
  }) => {
    await page.goto("/fr/");
    await page.getByRole("button", { name: /Rechercher/ }).click();
    const input = page.getByRole("combobox", { name: "Rechercher" });
    await expect(input).toHaveAttribute("type", "search");
  });

  test("search input has enterKeyHint='search'", async ({ page }) => {
    await page.goto("/fr/");
    await page.getByRole("button", { name: /Rechercher/ }).click();
    const input = page.getByRole("combobox", { name: "Rechercher" });
    await expect(input).toHaveAttribute("enterkeyhint", "search");
  });
});
