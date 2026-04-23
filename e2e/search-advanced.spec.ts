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
    const suggestions = page.locator("button", {
      hasText: /MCP|Démarrer|prompting|Skills/i,
    });
    await expect(suggestions.first()).toBeVisible();
  });

  test("focus returns to trigger button after closing", async ({ page }) => {
    await page.goto("/fr/");
    const trigger = page.getByRole("button", { name: /Rechercher/ });
    await trigger.click();
    const combobox = page.getByRole("combobox", { name: "Rechercher" });
    await expect(combobox).toBeVisible();
    await page.keyboard.press("Escape");
    // Combobox proxy: getByRole("dialog") renvoie "hidden" en Chromium
    // headless malgré un dialog ouvert (bug Playwright avec aria-modal).
    await expect(combobox).not.toBeVisible();
    const isFocused = await trigger.evaluate(
      (el) => el === document.activeElement,
    );
    expect(isFocused).toBe(true);
  });

  test("ArrowDown selects next result", async ({ page }) => {
    await page.goto("/fr/");
    await page.getByRole("button", { name: /Rechercher/ }).click();
    const input = page.getByRole("combobox", { name: "Rechercher" });
    await input.fill("MCP");

    const options = page.getByRole("option");
    // Wait for the debounced + lazy-loaded results to render.
    await expect(options.first()).toBeVisible();
    // Need at least two results to test ArrowDown selection change.
    await expect(options.nth(1)).toBeVisible();

    const initiallySelected = await options
      .first()
      .getAttribute("aria-selected");
    expect(initiallySelected).toBe("true");

    await page.keyboard.press("ArrowDown");
    const secondSelected = await options.nth(1).getAttribute("aria-selected");
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

  test("results can include hits from page body content, not just titles", async ({
    page,
  }) => {
    await page.goto("/fr/");
    await page.getByRole("button", { name: /Rechercher/ }).click();
    // "terminal" is a prose word that typically lives in article bodies
    // (installation, prerequisites, etc.), not in every title.
    const input = page.getByRole("combobox", { name: "Rechercher" });
    await input.fill("terminal");

    const listbox = page.getByRole("listbox", {
      name: "Résultats de recherche",
    });
    await expect(listbox.getByRole("option").first()).toBeVisible();
    // A body hit surfaces a snippet, recognised by the <mark> element.
    await expect(listbox.locator("mark:visible").first()).toBeVisible();
  });

  test("live search: results appear character-by-character without pressing Enter", async ({
    page,
  }) => {
    await page.goto("/fr/");
    await page.getByRole("button", { name: /Rechercher/ }).click();
    const input = page.getByRole("combobox", { name: "Rechercher" });

    // Use pressSequentially so each keystroke fires a real input event.
    // Debounced live search must surface results without Enter being pressed.
    await input.pressSequentially("mcp", { delay: 40 });

    const listbox = page.getByRole("listbox", {
      name: "Résultats de recherche",
    });
    await expect(listbox.getByRole("option").first()).toBeVisible();

    // Sanity: no Enter key was sent between pressSequentially and assertion.
    // The combobox still holds the typed query.
    await expect(input).toHaveValue("mcp");
  });

  test("spotlight: dialog floats centered-top, not at y=0", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/fr/");
    await page.getByRole("button", { name: /Rechercher/ }).click();
    const dialog = page.locator('[role="dialog"][aria-modal="true"]');
    await expect(dialog).toBeVisible();
    const box = await dialog.boundingBox();
    expect(box).not.toBeNull();
    if (box) {
      // Spotlight floats: at least ~10vh padding above the dialog on desktop.
      expect(box.y).toBeGreaterThan(60);
      // And never spans full height on desktop.
      expect(box.height).toBeLessThan(900);
    }
  });
});

test.describe("Search on mobile viewport", () => {
  // Ne spread pas devices["iPhone 13"] entier : inclut defaultBrowserType: 'webkit'
  // qui n'est pas autorisé dans un describe (forcerait un nouveau worker).
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

  test("on mobile, a body-hit result displays a snippet", async ({ page }) => {
    await page.goto("/fr/");
    await page.getByRole("button", { name: /Rechercher/ }).click();
    const input = page.getByRole("combobox", { name: "Rechercher" });
    await input.fill("terminal");

    const listbox = page.getByRole("listbox", {
      name: "Résultats de recherche",
    });
    await expect(listbox.getByRole("option").first()).toBeVisible();
    // Mobile uses a single line-clamp-1 snippet; still contains <mark>.
    await expect(listbox.locator("mark:visible").first()).toBeVisible();
  });
});
