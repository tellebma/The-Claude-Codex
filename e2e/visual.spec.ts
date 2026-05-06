import { test, expect, type Page } from "@playwright/test";

// RG-25 — Tests de regression visuelle Playwright.
//
// Strategie :
// - 10 routes cles x 2 themes (light + dark) = 20 baselines screenshots.
// - Theme applique via addInitScript (localStorage["theme"]) AVANT le premier
//   paint, donc pas de flash et la baseline correspond directement au mode.
// - Animations gelees au moment du screenshot via une feuille de style
//   injectee : tout ce qui anime (lp-pulse, lp-blink, lp-grid-fade, terminal
//   cursor) est neutralise pour garantir des captures deterministes.
// - Diff > 0.1% (maxDiffPixelRatio: 0.001) declenche un echec.
// - Lancer `npx playwright test --project=visual --update-snapshots` pour
//   regenerer les baselines apres une refonte intentionnelle.
//
// Ces specs sont isolees dans le projet `visual` de playwright.config.ts —
// elles ne tournent pas avec `--project=chromium` (smoke) pour ne pas
// alourdir la CI standard.

const ROUTES: ReadonlyArray<{ readonly path: string; readonly name: string }> = [
  { path: "/fr/", name: "fr-landing" },
  { path: "/en/", name: "en-landing" },
  { path: "/fr/getting-started/", name: "fr-getting-started" },
  { path: "/fr/getting-started/installation/", name: "fr-installation" },
  { path: "/fr/mcp/", name: "fr-mcp" },
  { path: "/fr/prompting/", name: "fr-prompting" },
  { path: "/fr/configurator/", name: "fr-configurator" },
  { path: "/fr/glossary/", name: "fr-glossary" },
  { path: "/fr/about/", name: "fr-about" },
  { path: "/fr/future/", name: "fr-future" },
];

const THEMES: ReadonlyArray<"light" | "dark"> = ["light", "dark"];

// CSS injecte au moment du screenshot pour figer les animations qui survivent
// a `prefers-reduced-motion: reduce` (ex: keyframes en CSS pure non gatees).
const FREEZE_ANIMATIONS_CSS = `
  *, *::before, *::after {
    animation-duration: 0s !important;
    animation-delay: 0s !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0s !important;
    transition-delay: 0s !important;
    caret-color: transparent !important;
  }
  /* Curseur terminal qui clignote (lp-blink) — bloque sur la frame visible. */
  .lp-cursor, [class*="cursor-blink"] {
    opacity: 1 !important;
  }
`;

async function prepareForVisual(page: Page, theme: "light" | "dark") {
  await page.addInitScript((t) => {
    try {
      window.localStorage.setItem("theme", t);
    } catch {
      // Ignore: storage indisponible (mode prive, etc.) — la page tombera
      // alors sur le defaultTheme du provider, ce qui est acceptable.
    }
  }, theme);
}

async function settle(page: Page) {
  await page.waitForLoadState("networkidle");
  await page.evaluate(() => {
    if (typeof document !== "undefined" && "fonts" in document) {
      return (document.fonts as { ready: Promise<unknown> }).ready;
    }
    return null;
  });
  await page.addStyleTag({ content: FREEZE_ANIMATIONS_CSS });
  // Petite stabilisation apres injection style + reduced-motion.
  await page.waitForTimeout(150);
}

test.describe("Visual regression — landing & sections cles", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  // Pages longues (prompting, configurator) ont plus de 6000px de hauteur
  // en fullPage : capture + comparaison peut depasser les 5s par defaut.
  test.setTimeout(60_000);

  for (const theme of THEMES) {
    for (const { path, name } of ROUTES) {
      test(`${name} — ${theme}`, async ({ page }) => {
        await prepareForVisual(page, theme);
        await page.goto(path);
        await settle(page);

        await expect(page).toHaveScreenshot(`${name}-${theme}.png`, {
          fullPage: true,
          // 0.1% de pixels diff toleres (bruit anti-aliasing, sub-pixels).
          maxDiffPixelRatio: 0.001,
          // Anim/glow halos peuvent varier marginalement entre runs : un peu
          // de tolerance par-pixel rgb pour eviter les faux positifs.
          threshold: 0.2,
          animations: "disabled",
          caret: "hide",
          // Capture fullPage demande plus que les 5s par defaut sur les
          // longues pages (prompting/configurator > 6000px) en CI.
          timeout: 30_000,
        });
      });
    }
  }
});
