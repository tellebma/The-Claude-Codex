/**
 * Valide que le build statique (`out/`) contient les fichiers SEO/IA attendus
 * avec une structure minimale correcte. Exécuté en CI après `npm run build`.
 *
 * Échec = exit code 1 + message explicite sur la première erreur rencontrée.
 */

import { existsSync, readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";

const OUT = resolve(process.cwd(), "out");
const errors: string[] = [];

const SITE_URL = "https://claude-codex.fr";

function must(condition: boolean, message: string): void {
  if (!condition) {
    errors.push(message);
  }
}

function mustExistAndNonEmpty(filePath: string): boolean {
  if (!existsSync(filePath)) {
    errors.push(`Fichier manquant : ${filePath}`);
    return false;
  }
  const size = statSync(filePath).size;
  if (size === 0) {
    errors.push(`Fichier vide : ${filePath}`);
    return false;
  }
  return true;
}

// --- 1. Landings i18n
must(existsSync(`${OUT}/fr/index.html`), "FR landing (out/fr/index.html) manquante");
must(existsSync(`${OUT}/en/index.html`), "EN landing (out/en/index.html) manquante");

// --- 2. sitemap.xml
const sitemapPath = `${OUT}/sitemap.xml`;
if (mustExistAndNonEmpty(sitemapPath)) {
  const sitemap = readFileSync(sitemapPath, "utf-8");
  must(sitemap.includes("<?xml"), "sitemap.xml : déclaration XML manquante");
  must(sitemap.includes("<urlset"), "sitemap.xml : élément <urlset> manquant");
  must(sitemap.includes(`${SITE_URL}/fr/`), "sitemap.xml : URL /fr/ absente");
  must(sitemap.includes(`${SITE_URL}/en/`), "sitemap.xml : URL /en/ absente");
  must(
    (sitemap.match(/<loc>/g) ?? []).length >= 20,
    "sitemap.xml : moins de 20 URLs listées (probable bug de génération)",
  );
  must(
    sitemap.includes('hreflang="fr"') && sitemap.includes('hreflang="en"'),
    "sitemap.xml : alternates hreflang FR/EN manquants",
  );
}

// --- 3. robots.txt
const robotsPath = `${OUT}/robots.txt`;
if (mustExistAndNonEmpty(robotsPath)) {
  const robots = readFileSync(robotsPath, "utf-8");
  must(/User-[Aa]gent:\s*\*/.test(robots), "robots.txt : User-agent: * manquant");
  must(robots.includes("Sitemap:"), "robots.txt : directive Sitemap: manquante");
  must(
    robots.includes("llms.txt") && robots.includes("llms-full.txt"),
    "robots.txt : llms.txt ou llms-full.txt non explicitement allowé",
  );
}

// --- 4. llms.txt (spec llmstxt.org)
const llmsPath = `${OUT}/llms.txt`;
if (mustExistAndNonEmpty(llmsPath)) {
  const llms = readFileSync(llmsPath, "utf-8");
  must(llms.startsWith("# "), "llms.txt : doit commencer par un titre H1");
  must(
    /\n> /.test(llms),
    "llms.txt : description en blockquote (> ...) manquante après le H1",
  );
  must(llms.includes("## "), "llms.txt : aucune section H2 détectée");
  must(
    llms.includes("/fr/") && llms.includes("/en/"),
    "llms.txt : liens vers /fr/ et /en/ attendus",
  );
}

// --- 5. llms-full.txt
const llmsFullPath = `${OUT}/llms-full.txt`;
if (mustExistAndNonEmpty(llmsFullPath)) {
  const size = statSync(llmsFullPath).size;
  // Le dump complet de tous les MDX doit faire au moins 50 KB — sinon
  // probablement un bug de génération (fichier tronqué).
  must(
    size >= 50_000,
    `llms-full.txt : taille ${size} o trop petite (< 50 KB), génération probablement incomplète`,
  );
}

// --- Rapport final
if (errors.length > 0) {
  console.error("\n❌ Validation du build statique échouée :\n");
  for (const e of errors) {
    console.error(`  - ${e}`);
  }
  console.error(`\n${errors.length} erreur(s).\n`);
  process.exit(1);
}

console.log("✅ Build statique validé — sitemap, robots, llms.txt et llms-full.txt conformes.");
