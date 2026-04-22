import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// Pages critiques auditées. Couvre FR+EN pour attraper les régressions i18n.
const pages: Array<{ url: string; name: string }> = [
  { url: "/fr/", name: "FR landing" },
  { url: "/en/", name: "EN landing" },
  { url: "/fr/getting-started/", name: "FR getting-started" },
  { url: "/en/getting-started/", name: "EN getting-started" },
  { url: "/fr/mcp/", name: "FR MCP overview" },
  { url: "/en/mcp/", name: "EN MCP overview" },
];

for (const { url, name } of pages) {
  test(`a11y: ${name} — no axe violations`, async ({ page }) => {
    await page.goto(url);
    await page.waitForLoadState("networkidle");

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();

    expect.soft(results.violations, `a11y violations on ${url}`).toEqual([]);
  });
}
