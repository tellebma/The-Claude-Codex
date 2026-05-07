/**
 * RG-28 — Convertit public/og/og-default.svg en og-default.png (1200x630).
 *
 * Utilise Playwright (deja installe) plutot que sharp/resvg pour eviter
 * d'ajouter une dependance native. Lance un Chromium headless qui rend
 * le SVG dans une page HTML et capture un screenshot pixel-exact.
 *
 * Usage : npx tsx scripts/generate-og-png.ts
 */
import { chromium } from "@playwright/test";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const SVG_PATH = join(ROOT, "public/og/og-default.svg");
const PNG_PATH = join(ROOT, "public/og/og-default.png");

async function main() {
  const svg = readFileSync(SVG_PATH, "utf-8");

  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: 1,
  });

  // Page HTML qui inline le SVG en plein viewport, sans marge ni scrollbar.
  // background:transparent — on capture exactement le rendu SVG.
  await page.setContent(
    `<!doctype html>
<html><head><style>
  html, body { margin: 0; padding: 0; width: 1200px; height: 630px; overflow: hidden; background: transparent; }
  svg { display: block; }
</style></head><body>${svg}</body></html>`,
    { waitUntil: "load" }
  );

  // Petite stabilisation pour laisser les fonts charger (system-ui).
  await page.evaluate(() =>
    typeof document !== "undefined" && "fonts" in document
      ? (document.fonts as { ready: Promise<unknown> }).ready
      : null
  );

  const buffer = await page.screenshot({
    type: "png",
    fullPage: false,
    clip: { x: 0, y: 0, width: 1200, height: 630 },
    omitBackground: false,
  });

  writeFileSync(PNG_PATH, buffer);
  console.log(`OK : ${PNG_PATH} (${(buffer.length / 1024).toFixed(1)} kB)`);

  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
