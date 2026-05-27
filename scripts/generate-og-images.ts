/**
 * CTN-10 — Genere une vignette Open Graph par article editorial.
 *
 * Mire la technique RG-28 (`generate-og-png.ts`) : un Chromium headless rend un
 * gabarit HTML (degrade brand->accent + voile sombre + titre en Plus Jakarta
 * Sans) et capture un screenshot pixel-exact. Aucune dependance native ni
 * limitation de fonte (contrairement a Satori/next-og).
 *
 * Pour chaque article racine `content/{locale}/*.mdx` (route `/content/[slug]`),
 * deux tailles sont produites dans `public/og/content/{locale}/` :
 *   - `{slug}.png`       1200x630  (variant hero + image de partage social)
 *   - `{slug}-card.png`  600x315   (variant carte grid/row)
 *
 * La liste des articles generes est ecrite dans `src/data/og-manifest.json`,
 * importe statiquement par `src/lib/og-images.ts` pour resoudre les URLs sans
 * acces filesystem au runtime.
 *
 * Usage : npm run build:og-articles
 * A relancer quand un article est ajoute, supprime ou que son titre change.
 */
import { chromium, type Browser } from "@playwright/test";
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const ROOT = process.cwd();
const CONTENT_DIR = path.join(ROOT, "content");
const OUTPUT_DIR = path.join(ROOT, "public", "og", "content");
const MANIFEST_PATH = path.join(ROOT, "src", "data", "og-manifest.json");
const LOCALES = ["fr", "en"] as const;

const HERO = { width: 1200, height: 630 } as const;
const CARD = { width: 600, height: 315 } as const;

interface ArticleMeta {
  readonly locale: string;
  readonly slug: string;
  readonly title: string;
}

/** Liste les articles racine `content/{locale}/*.mdx` (non recursif). */
function listRootArticles(locale: string): ArticleMeta[] {
  const dir = path.join(CONTENT_DIR, locale);
  if (!fs.existsSync(dir)) return [];
  const out: ArticleMeta[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith(".mdx")) continue;
    const raw = fs.readFileSync(path.join(dir, entry.name), "utf-8");
    const { data } = matter(raw);
    const title = typeof data.title === "string" ? data.title : entry.name;
    out.push({ locale, slug: entry.name.replace(/\.mdx$/, ""), title });
  }
  return out;
}

function escapeHtml(text: string): string {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

/**
 * Gabarit HTML d'une vignette. Tailles exprimees en `vh`/`vw` pour rester
 * proportionnelles entre la version 1200x630 et 600x315. Voile sombre
 * `rgba(0,0,0,.6)` sous le titre pour garantir un contraste AA du texte blanc
 * sur le degrade brand->accent vif.
 */
function buildHtml(title: string): string {
  return `<!doctype html>
<html lang="fr"><head><meta charset="utf-8" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;800&family=JetBrains+Mono:wght@700&display=swap" rel="stylesheet" />
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { width: 100%; height: 100%; overflow: hidden; }
  .stage {
    width: 100%; height: 100%;
    background: linear-gradient(135deg, #06b6d4 0%, #0891b2 38%, #f59e0b 100%);
    position: relative;
    font-family: "Plus Jakarta Sans", system-ui, sans-serif;
    display: flex; flex-direction: column; justify-content: space-between;
    padding: 8.5vh 7vh;
  }
  .stage::after {
    content: ""; position: absolute; inset: 0;
    background: rgba(0, 0, 0, 0.6);
  }
  .stage > * { position: relative; z-index: 1; }
  .kicker { display: flex; align-items: center; gap: 1.6vh; }
  .mark {
    font-family: "JetBrains Mono", monospace; font-weight: 700;
    color: #fff; font-size: 4.6vh;
    background: linear-gradient(135deg, #06b6d4, #f59e0b);
    width: 8.6vh; height: 8.6vh; border-radius: 1.8vh;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 0 0 0.4vh rgba(255,255,255,0.15);
  }
  .brand { color: #fff; font-weight: 800; font-size: 3.4vh; letter-spacing: -0.02em; }
  .title {
    color: #fff; font-weight: 800; font-size: 8.2vh; line-height: 1.06;
    letter-spacing: -0.03em; max-height: 33vh; overflow: hidden;
    text-shadow: 0 0.3vh 2vh rgba(0,0,0,0.35);
  }
  .accent { height: 1.4vh; width: 22vh; border-radius: 1vh;
    background: linear-gradient(90deg, #22d3ee, #fbbf24); }
</style></head>
<body><div class="stage">
  <div class="kicker">
    <div class="mark">&gt;_</div>
    <div class="brand">The Claude Codex</div>
  </div>
  <h1 class="title">${escapeHtml(title)}</h1>
  <div class="accent"></div>
</div></body></html>`;
}

async function renderSize(
  browser: Browser,
  html: string,
  size: { width: number; height: number },
  outPath: string,
): Promise<void> {
  const page = await browser.newPage({
    viewport: { width: size.width, height: size.height },
    deviceScaleFactor: 1,
  });
  await page.setContent(html, { waitUntil: "load" });
  // Laisse les Google Fonts se charger ; retombe sur system-ui si offline.
  await page
    .evaluate(() =>
      "fonts" in document
        ? (document.fonts as { ready: Promise<unknown> }).ready
        : null,
    )
    .catch(() => null);
  const buffer = await page.screenshot({
    type: "png",
    clip: { x: 0, y: 0, width: size.width, height: size.height },
  });
  await page.close();
  // Quantification palette + dithering : ~6x plus leger qu'un PNG truecolor,
  // sans banding visible sur le degrade (verifie CTN-10). Reste en PNG pour
  // rester compatible og:image sur toutes les plateformes.
  const optimized = await sharp(buffer)
    .png({ compressionLevel: 9, palette: true, quality: 90, effort: 10 })
    .toBuffer();
  fs.writeFileSync(outPath, optimized);
}

async function main(): Promise<void> {
  const articles = LOCALES.flatMap((locale) => listRootArticles(locale));
  const browser = await chromium.launch();
  const generated: Array<{ locale: string; slug: string }> = [];

  try {
    for (const article of articles) {
      const dir = path.join(OUTPUT_DIR, article.locale);
      fs.mkdirSync(dir, { recursive: true });
      const html = buildHtml(article.title);
      await renderSize(browser, html, HERO, path.join(dir, `${article.slug}.png`));
      await renderSize(browser, html, CARD, path.join(dir, `${article.slug}-card.png`));
      generated.push({ locale: article.locale, slug: article.slug });
      console.log(`OK ${article.locale}/${article.slug}`);
    }
  } finally {
    await browser.close();
  }

  generated.sort((a, b) =>
    a.locale === b.locale ? a.slug.localeCompare(b.slug) : a.locale.localeCompare(b.locale),
  );
  const manifest = {
    generatedAt: new Date().toISOString(),
    images: generated,
  };
  fs.writeFileSync(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(`\nManifest: ${generated.length} articles -> ${MANIFEST_PATH}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
