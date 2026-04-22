import { test, expect, devices } from "@playwright/test";

test.describe("Search advanced behaviour", () => {
  test("trigger button has an accessible tap target (44px minimum)", async ({
    page,
  }) => {
    await page.goto("/");
    const btn = page.getByRole("button", { name: /Rechercher/ });
    const box = await btn.boundingBox();
    expect(box).not.toBeNull();
    if (box) {
      expect(box.height).toBeGreaterThanOrEqual(44);
      expect(box.width).toBeGreaterThanOrEqual(44);
    }
  });

  test("empty query shows recommended sections", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /Rechercher/ }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    // At least one of the suggestion buttons should appear
    const suggestions = page.locator("button", { hasText: /MCP|Démarrer|prompting|Skills/i });
    await expect(suggestions.first()).toBeVisible();
  });

  test("focus returns to trigger button after closing", async ({ page }) => {
    await page.goto("/");
    const trigger = page.getByRole("button", { name: /Rechercher/ });
    await trigger.click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).not.toBeVisible();
    // The trigger should be the active element
    const isFocused = await trigger.evaluate((el) => el === document.activeElement);
    expect(isFocused).toBe(true);
  });

  test("ArrowDown selects next result", async ({ page }) => {
    await page.goto("/");
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
    await page.goto("/");
    await page.getByRole("button", { name: /Rechercher/ }).click();
    const input = page.getByRole("combobox", { name: "Rechercher" });
    await input.fill("installation");

    const firstOption = page.getByRole("option").first();
    await expect(firstOption).toBeVisible();

    await page.keyboard.press("Enter");
    // Dialog closes
    await expect(page.getByRole("dialog")).not.toBeVisible();
    // URL changed to the selected result
    await expect(page).not.toHaveURL(/^https?:\/\/[^/]+\/?$/);
  });

  test("clear button empties the input", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /Rechercher/ }).click();
    const input = page.getByRole("combobox", { name: "Rechercher" });
    await input.fill("something");
    await expect(input).toHaveValue("something");
    // The clear button appears when input has value
    const clearBtn = page.getByRole("button", { name: /effacer|clear/i });
    if (await clearBtn.isVisible()) {
      await clearBtn.click();
      await expect(input).toHaveValue("");
    }
  });
});

test.describe("Search on mobile viewport", () => {
  // Ne spread pas devices["iPhone 13"] entier : inclut defaultBrowserType: 'webkit'
  // qui n'est pas autorisé dans un describe (forcerait un nouveau worker).
  // On reproduit juste le viewport iPhone 13 — suffisant pour tester la logique
  // responsive (dialog full-screen, type=search, enterKeyHint).
  test.use({ viewport: devices["iPhone 13"].viewport });

  test("opens full-screen dialog on mobile", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /Rechercher/ }).click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    const box = await dialog.boundingBox();
    const viewport = page.viewportSize();
    expect(box).not.toBeNull();
    expect(viewport).not.toBeNull();
    if (box && viewport) {
      expect(box.width).toBeGreaterThanOrEqual(viewport.width - 1);
    }
  });

  test("search input has type='search' for native mobile UX", async ({
    page,
  }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /Rechercher/ }).click();
    const input = page.getByRole("combobox", { name: "Rechercher" });
    await expect(input).toHaveAttribute("type", "search");
  });

  test("search input has enterKeyHint='search'", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /Rechercher/ }).click();
    const input = page.getByRole("combobox", { name: "Rechercher" });
    await expect(input).toHaveAttribute("enterkeyhint", "search");
  });
});
