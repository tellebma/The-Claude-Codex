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
    // toBeFocused() fait son propre retry — évite la course entre le commit
    // React (unmount du portal) et la restauration du focus sur le trigger.
    await expect(trigger).toBeFocused();
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

  // Spotlight dialog is horizontally centered on desktop (within ~20px).
  test("spotlight: dialog is horizontally centered on desktop", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/fr/");
    await page.getByRole("button", { name: /Rechercher/ }).click();
    const dialog = page.locator('[role="dialog"][aria-modal="true"]');
    await expect(dialog).toBeVisible();
    const box = await dialog.boundingBox();
    expect(box).not.toBeNull();
    if (box) {
      const dialogCenter = box.x + box.width / 2;
      const viewportCenter = 1440 / 2;
      // Center within 20px — accounts for scrollbar padding compensation.
      expect(Math.abs(dialogCenter - viewportCenter)).toBeLessThan(20);
    }
  });

  // Portal: the dialog must NOT be a descendant of the header (otherwise the
  // header's backdrop-filter would clip it). It must live on document.body.
  test("portal: dialog is attached to document.body, not inside the header", async ({
    page,
  }) => {
    await page.goto("/fr/");
    await page.getByRole("button", { name: /Rechercher/ }).click();
    await expect(
      page.getByRole("combobox", { name: "Rechercher" }),
    ).toBeVisible();

    const dialogInsideHeader = await page.locator(
      'header [role="dialog"][aria-modal="true"]',
    ).count();
    expect(dialogInsideHeader).toBe(0);

    const dialogOnBody = await page.locator(
      'body > [role="dialog"][aria-modal="true"], body > div > [role="dialog"][aria-modal="true"]',
    ).count();
    // Portal target = body (Next.js may wrap with a div for RSC hydration);
    // either way the dialog must not be inside the header.
    expect(dialogOnBody).toBeGreaterThan(0);
  });

  // Negative: pressing letter keys without Ctrl/Cmd must NOT open the dialog.
  test("plain letter keys do not open the dialog", async ({ page }) => {
    await page.goto("/fr/");
    await page.keyboard.press("k");
    await page.keyboard.press("/");
    await page.keyboard.press("Enter");
    // Short wait — if the dialog were going to open it would be visible by now.
    await page.waitForTimeout(150);
    await expect(
      page.getByRole("combobox", { name: "Rechercher" }),
    ).not.toBeVisible();
  });

  // Negative: 1-char queries must NOT show results (min-chars gate).
  test("a 1-char query never surfaces results", async ({ page }) => {
    await page.goto("/fr/");
    await page.getByRole("button", { name: /Rechercher/ }).click();
    const input = page.getByRole("combobox", { name: "Rechercher" });
    await input.fill("m");
    // Wait past the debounce window.
    await page.waitForTimeout(250);
    await expect(
      page.getByRole("listbox", { name: "Résultats de recherche" }),
    ).not.toBeVisible();
  });

  // Negative: whitespace-only queries must behave like empty queries.
  test("whitespace-only query does not trigger a search", async ({ page }) => {
    await page.goto("/fr/");
    await page.getByRole("button", { name: /Rechercher/ }).click();
    const input = page.getByRole("combobox", { name: "Rechercher" });
    await input.fill("     ");
    await page.waitForTimeout(250);
    // Suggestions (empty-state) still visible; no listbox, no noResults.
    await expect(
      page.getByRole("listbox", { name: "Résultats de recherche" }),
    ).not.toBeVisible();
  });

  // Negative: Enter with no results does not close the dialog.
  test("Enter with no matching results does not close the dialog", async ({
    page,
  }) => {
    await page.goto("/fr/");
    await page.getByRole("button", { name: /Rechercher/ }).click();
    const input = page.getByRole("combobox", { name: "Rechercher" });
    await input.fill("qwertyzzzunlikely");
    await expect(
      page.getByRole("paragraph").filter({ hasText: /Aucun résultat/ }),
    ).toBeVisible();
    await page.keyboard.press("Enter");
    // Combobox still visible = dialog still open.
    await expect(input).toBeVisible();
  });

  // Cmd+K / Ctrl+K toggles: first press opens, second press closes.
  test("Ctrl+K twice toggles the dialog open then closed", async ({ page }) => {
    await page.goto("/fr/");
    await page.keyboard.press("Control+k");
    const input = page.getByRole("combobox", { name: "Rechercher" });
    await expect(input).toBeVisible();
    await page.keyboard.press("Control+k");
    await expect(input).not.toBeVisible();
  });

  // Backdrop click closes the dialog without navigating away.
  test("clicking the backdrop closes the dialog", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/fr/");
    const url = page.url();
    await page.getByRole("button", { name: /Rechercher/ }).click();
    await expect(
      page.getByRole("combobox", { name: "Rechercher" }),
    ).toBeVisible();
    // Le backdrop (z-0, inset-0) est recouvert au centre par le dialog (z-10).
    // Clique volontairement en haut-gauche, hors du dialog, pour viser la
    // zone réellement cliquable du backdrop.
    await page
      .getByTestId("search-backdrop")
      .click({ position: { x: 10, y: 10 } });
    await expect(
      page.getByRole("combobox", { name: "Rechercher" }),
    ).not.toBeVisible();
    expect(page.url()).toBe(url);
  });

  // Unicode / emojis / special chars must not crash the search runtime.
  test("special chars and emojis do not crash the search", async ({ page }) => {
    await page.goto("/fr/");
    await page.getByRole("button", { name: /Rechercher/ }).click();
    const input = page.getByRole("combobox", { name: "Rechercher" });
    await input.fill("🚀 é~!@#$");
    await page.waitForTimeout(250);
    // Either noResults OR still open — the key assertion is the dialog is
    // still alive (no crash, no white screen).
    await expect(input).toBeVisible();
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

  // Mobile "3 X" fix: when a query is typed, at most ONE X icon is visible
  // inside the dialog (the clear button). The mobile close button is hidden
  // and the native webkit-search-cancel-button is CSS-suppressed.
  test("mobile: a query renders a single visible clear X (no triple X)", async ({
    page,
  }) => {
    await page.goto("/fr/");
    await page.getByRole("button", { name: /Rechercher/ }).click();
    const input = page.getByRole("combobox", { name: "Rechercher" });
    await input.fill("mcp");
    await expect(
      page.getByRole("listbox", { name: "Résultats de recherche" })
        .getByRole("option").first(),
    ).toBeVisible();

    const dialog = page.locator('[role="dialog"][aria-modal="true"]');
    // Count accessible buttons whose aria-label resolves to "clear"/"close"
    // and that are currently visible. We expect exactly 1 (the clear button).
    const clearBtn = dialog.getByRole("button", { name: /effacer|clear/i });
    await expect(clearBtn).toBeVisible();
    const closeBtns = dialog.getByRole("button", { name: /fermer|close/i });
    // The mobile close button is removed from the DOM while a query exists,
    // so count must be 0.
    await expect(closeBtns).toHaveCount(0);
  });

  // Mobile: no query → close button is available (needed to dismiss).
  test("mobile: no query shows the close button", async ({ page }) => {
    await page.goto("/fr/");
    await page.getByRole("button", { name: /Rechercher/ }).click();
    const dialog = page.locator('[role="dialog"][aria-modal="true"]');
    await expect(dialog).toBeVisible();
    const closeBtn = dialog.getByRole("button", { name: /fermer|close/i });
    await expect(closeBtn.first()).toBeVisible();
  });
});
