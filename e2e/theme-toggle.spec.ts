import { test, expect } from "@playwright/test";

test.describe("Theme Toggle", () => {
  test("page loads with a theme applied", async ({ page }) => {
    await page.goto("/");
    const html = page.locator("html");
    // next-themes adds a class or data-theme attribute to <html>
    // By default it should have one of: light, dark, or system
    const classList = await html.getAttribute("class");
    const style = await html.getAttribute("style");
    // The theme provider applies either a class or a style attribute
    const hasThemeIndicator =
      (classList && (classList.includes("light") || classList.includes("dark"))) ||
      (style && style.includes("color-scheme"));
    expect(hasThemeIndicator).toBeTruthy();
  });

  test("theme toggle button is visible", async ({ page }) => {
    await page.goto("/");
    const button = page.getByRole("button", {
      name: /Passer en mode/,
    });
    await expect(button).toBeVisible();
  });

  test("clicking theme toggle changes the theme", async ({ page }) => {
    await page.goto("/");

    const html = page.locator("html");
    const initialClass = await html.getAttribute("class");

    // Click the theme toggle
    const button = page.getByRole("button", {
      name: /Passer en mode/,
    });
    await button.click();

    // Wait for theme change to apply deterministically
    await expect(html).not.toHaveClass(initialClass ?? "", { timeout: 2000 });

    const newClass = await html.getAttribute("class");
    // The class should have changed
    expect(newClass).not.toEqual(initialClass);
  });

  test("toggling twice returns to original theme", async ({ page }) => {
    await page.goto("/");

    const html = page.locator("html");
    const initialClass = await html.getAttribute("class");

    const button = page.getByRole("button", {
      name: /Passer en mode/,
    });

    // Toggle twice
    await button.click();
    await expect(html).not.toHaveClass(initialClass ?? "", { timeout: 2000 });

    await button.click();
    await expect(html).toHaveClass(initialClass ?? "", { timeout: 2000 });

    const finalClass = await html.getAttribute("class");
    expect(finalClass).toEqual(initialClass);
  });
});
