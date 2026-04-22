import { test, expect } from "@playwright/test";

test.describe("Theme Toggle", () => {
  test("page loads with a theme applied", async ({ page }) => {
    await page.goto("/fr/");
    const html = page.locator("html");
    // next-themes ajoute la classe après hydration — attendre que le toggle
    // soit présent pour garantir que le provider a posé la classe.
    await expect(
      page.getByRole("button", { name: /Passer en mode/ }),
    ).toBeVisible();
    const classList = await html.getAttribute("class");
    const style = await html.getAttribute("style");
    const hasThemeIndicator =
      (classList && (classList.includes("light") || classList.includes("dark"))) ||
      (style && style.includes("color-scheme"));
    expect(hasThemeIndicator).toBeTruthy();
  });

  test("theme toggle button is visible", async ({ page }) => {
    await page.goto("/fr/");
    const button = page.getByRole("button", {
      name: /Passer en mode/,
    });
    await expect(button).toBeVisible();
  });

  test("clicking theme toggle changes the theme", async ({ page }) => {
    await page.goto("/fr/");

    const html = page.locator("html");
    const button = page.getByRole("button", {
      name: /Passer en mode/,
    });
    await expect(button).toBeVisible();

    const initialClass = await html.getAttribute("class");

    await button.click();

    // Wait for theme change to apply deterministically
    await expect(html).not.toHaveClass(initialClass ?? "", { timeout: 2000 });

    const newClass = await html.getAttribute("class");
    expect(newClass).not.toEqual(initialClass);
  });

  test("toggling twice returns to original theme", async ({ page }) => {
    await page.goto("/fr/");

    const html = page.locator("html");
    const button = page.getByRole("button", {
      name: /Passer en mode/,
    });
    await expect(button).toBeVisible();

    const initialClass = await html.getAttribute("class");

    // Toggle twice
    await button.click();
    await expect(html).not.toHaveClass(initialClass ?? "", { timeout: 2000 });

    await button.click();
    await expect(html).toHaveClass(initialClass ?? "", { timeout: 2000 });

    const finalClass = await html.getAttribute("class");
    expect(finalClass).toEqual(initialClass);
  });
});
