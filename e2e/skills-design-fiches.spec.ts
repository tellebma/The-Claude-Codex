import { test, expect } from "@playwright/test";

/**
 * DSK-3 / DSK-4 : parité FR/EN sur les fiches /skills/ui-ux-pro-max et
 * /skills/taste-skill. Couvre le rendu, le H1, la commande d'installation
 * visible et les cross-links vers les autres fiches design.
 */

interface FicheCase {
  readonly slug: string;
  readonly titleRe: RegExp;
  readonly installFr: string;
  readonly installEn: string;
}

const FICHES: readonly FicheCase[] = [
  {
    slug: "ui-ux-pro-max",
    titleRe: /UI UX Pro Max/i,
    installFr: "uipro init --ai claude",
    installEn: "uipro init --ai claude",
  },
  {
    slug: "taste-skill",
    titleRe: /Taste Skill/i,
    installFr: "npx skills add Leonxlnx/taste-skill",
    installEn: "npx skills add Leonxlnx/taste-skill",
  },
];

for (const fiche of FICHES) {
  test.describe(`/skills/${fiche.slug} — rendu et structure`, () => {
    test(`FR : titre, h1 et commande d'installation`, async ({ page }) => {
      await page.goto(`/fr/skills/${fiche.slug}/`);
      await expect(page).toHaveTitle(fiche.titleRe);
      const h1 = page.getByRole("heading", { level: 1 });
      await expect(h1).toBeVisible();
      await expect(h1).toContainText(fiche.titleRe);
      await expect(page.locator("main")).toContainText(fiche.installFr);
    });

    test(`EN : title, h1 and install command`, async ({ page }) => {
      await page.goto(`/en/skills/${fiche.slug}/`);
      await expect(page).toHaveTitle(fiche.titleRe);
      const h1 = page.getByRole("heading", { level: 1 });
      await expect(h1).toBeVisible();
      await expect(h1).toContainText(fiche.titleRe);
      await expect(page.locator("main")).toContainText(fiche.installEn);
    });
  });

  test.describe(`/skills/${fiche.slug} — sections clés`, () => {
    test(`FR : H2 TL;DR, installation, cas d'échec`, async ({ page }) => {
      await page.goto(`/fr/skills/${fiche.slug}/`);
      await expect(
        page.getByRole("heading", { level: 2, name: /installation/i }),
      ).toBeVisible();
      await expect(
        page.getByRole("heading", { level: 2, name: /cas d'échec/i }),
      ).toBeVisible();
    });

    test(`EN : H2 TL;DR, installation, failure modes`, async ({ page }) => {
      await page.goto(`/en/skills/${fiche.slug}/`);
      await expect(
        page.getByRole("heading", { level: 2, name: /^install/i }),
      ).toBeVisible();
      await expect(
        page.getByRole("heading", { level: 2, name: /failure modes/i }),
      ).toBeVisible();
    });
  });

  test.describe(`/skills/${fiche.slug} — cross-links design`, () => {
    test(`FR : liens vers comparison et best-skills`, async ({ page }) => {
      await page.goto(`/fr/skills/${fiche.slug}/`);
      const main = page.locator("main");
      await expect(
        main.getByRole("link", { name: /skills incontournables 2026/i }).first(),
      ).toBeVisible();
    });

    test(`EN : links to comparison and best-skills`, async ({ page }) => {
      await page.goto(`/en/skills/${fiche.slug}/`);
      const main = page.locator("main");
      await expect(
        main.getByRole("link", { name: /must-have skills 2026/i }).first(),
      ).toBeVisible();
    });
  });
}
