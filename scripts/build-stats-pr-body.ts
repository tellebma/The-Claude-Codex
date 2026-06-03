/**
 * Genere le body Markdown de la PR draft hebdo (CTN-7).
 *
 * Lit `src/data/article-stats.json` (output de CTN-6) et ecrit un
 * fichier markdown utilise par `peter-evans/create-pull-request` via
 * son option `body-path`. Met en avant les articles avec delta > 50 %.
 *
 * Usage local : `tsx scripts/build-stats-pr-body.ts <input.json> <output.md>`
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  isArticleStatsFile,
  type ArticleStatsEntry,
  type ArticleStatsFile,
} from "../src/data/article-stats";

export const DELTA_HIGHLIGHT_THRESHOLD = 50;

export function formatDeltaPct(value: number): string {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)} %`;
}

export function selectHighlighted(
  articles: ReadonlyArray<ArticleStatsEntry>,
  threshold: number = DELTA_HIGHLIGHT_THRESHOLD,
): ReadonlyArray<ArticleStatsEntry> {
  return [...articles]
    .filter((entry) => entry.deltaPct >= threshold)
    .sort((a, b) => b.deltaPct - a.deltaPct);
}

export function sortForRecap(
  articles: ReadonlyArray<ArticleStatsEntry>,
): ReadonlyArray<ArticleStatsEntry> {
  return [...articles].sort((a, b) => b.pageviewsLast30d - a.pageviewsLast30d);
}

function articleUrl(entry: ArticleStatsEntry): string {
  return `/${entry.locale}/content/${entry.slug}/`;
}

export function renderHighlightedSection(
  highlighted: ReadonlyArray<ArticleStatsEntry>,
): string {
  if (highlighted.length === 0) {
    return "_Aucun article avec un delta superieur a 50 % cette semaine._";
  }
  const lines = highlighted.map(
    (entry) =>
      `- [\`${articleUrl(entry)}\`](https://claude-codex.fr${articleUrl(entry)}) — ` +
      `${formatDeltaPct(entry.deltaPct)} (${entry.pageviewsLast7d} vs ${entry.pageviewsPrev7d} pageviews)`,
  );
  return lines.join("\n");
}

export function renderRecapTable(
  articles: ReadonlyArray<ArticleStatsEntry>,
): string {
  if (articles.length === 0) {
    return "_Pas de donnees Matomo cette semaine._";
  }
  const header =
    "| Locale | Slug | 30j | 7j | 7j prec | Delta | Scroll 75 % |\n" +
    "|--------|------|----:|---:|--------:|------:|------------:|";
  const rows = sortForRecap(articles).map((entry) => {
    const scroll = `${(entry.scrollDepth75Pct * 100).toFixed(1)} %`;
    return (
      `| ${entry.locale} | \`${entry.slug}\` | ${entry.pageviewsLast30d} | ` +
      `${entry.pageviewsLast7d} | ${entry.pageviewsPrev7d} | ` +
      `${formatDeltaPct(entry.deltaPct)} | ${scroll} |`
    );
  });
  return [header, ...rows].join("\n");
}

export function buildPrBody(file: ArticleStatsFile): string {
  const generatedAt = file.generatedAt;
  const articleCount = file.articles.length;
  const highlighted = selectHighlighted(file.articles);

  return [
    "## Refresh hebdomadaire des statistiques d'articles",
    "",
    `Snapshot Matomo genere le \`${generatedAt}\` (periode : ${file.matomoPeriodDays} jours).`,
    `Source : \`${file.source}\` — ${articleCount} article${articleCount > 1 ? "s" : ""} suivi${articleCount > 1 ? "s" : ""}.`,
    "",
    `### Articles avec delta > ${DELTA_HIGHLIGHT_THRESHOLD} % (last7 vs prev7)`,
    "",
    renderHighlightedSection(highlighted),
    "",
    "### Recapitulatif",
    "",
    renderRecapTable(file.articles),
    "",
    "---",
    "",
    "_PR draft generee automatiquement par `.github/workflows/weekly-article-stats.yml` (CTN-7)._",
    "_Merger uniquement apres revue PO du diff `src/data/article-stats.json`._",
    "",
  ].join("\n");
}

export function loadStatsFile(filePath: string): ArticleStatsFile {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Stats file not found at ${filePath}`);
  }
  const raw = fs.readFileSync(filePath, "utf-8");
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error(`Stats file is not valid JSON: ${filePath}`);
  }
  if (!isArticleStatsFile(parsed)) {
    throw new Error(`Stats file does not match ArticleStatsFile schema: ${filePath}`);
  }
  return parsed;
}

function main(): void {
  const [inputArg, outputArg] = process.argv.slice(2);
  if (!inputArg || !outputArg) {
    // eslint-disable-next-line no-console
    console.error(
      "Usage: tsx scripts/build-stats-pr-body.ts <input.json> <output.md>",
    );
    process.exit(1);
  }
  const here = path.dirname(fileURLToPath(import.meta.url));
  const repoRoot = path.resolve(here, "..");
  const inputPath = path.isAbsolute(inputArg) ? inputArg : path.join(repoRoot, inputArg);
  const outputPath = path.isAbsolute(outputArg)
    ? outputArg
    : path.join(repoRoot, outputArg);

  const file = loadStatsFile(inputPath);
  const body = buildPrBody(file);
  fs.writeFileSync(outputPath, body, "utf-8");
  // eslint-disable-next-line no-console
  console.log(`[stats-pr-body] Wrote ${outputPath} (${body.length} chars)`);
}

const isDirectInvocation =
  import.meta.url === `file://${process.argv[1]}` ||
  import.meta.url.endsWith(path.basename(process.argv[1] ?? ""));

if (isDirectInvocation) {
  main();
}
