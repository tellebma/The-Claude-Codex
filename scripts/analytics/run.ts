/**
 * Main entry point for the weekly analytics pipeline.
 *
 * Steps:
 *  1. Load config from env vars
 *  2. Compute current and previous date windows
 *  3. Fetch GSC + Matomo in parallel (current + previous)
 *  4. Detect alerts
 *  5. Write CSVs + REPORT.md under docs/analytics/<endDate>/
 *  6. (Optional) Post Discord summary
 *
 * Designed to be invoked from a GitHub Actions workflow. It exits with
 * code 1 on any fatal error so the job fails loudly.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { computeDateRange, loadConfig } from "./config.ts";
import { detectAlerts } from "./detect-alerts.ts";
import { fetchGsc } from "./fetch-gsc.ts";
import { fetchMatomo } from "./fetch-matomo.ts";
import { notifyDiscord } from "./notify-discord.ts";
import { renderDiscordEmbed, renderReportMarkdown } from "./render-report.ts";
import type {
  AnalyticsReport,
  AnalyticsSnapshot,
  DateRange,
  GscPageRow,
  GscQueryRow,
  MatomoEventRow,
  MatomoPageRow,
} from "./types.ts";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(SCRIPT_DIR, "..", "..");

function csvCell(value: string | number): string {
  if (typeof value === "number") return String(value);
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

function toCsv<T extends object>(
  headers: readonly (keyof T & string)[],
  rows: readonly T[],
): string {
  const lines = [headers.join(",")];
  for (const row of rows) {
    lines.push(
      headers
        .map((h) => {
          const value = (row as Record<string, unknown>)[h];
          if (value === null || value === undefined) return "";
          if (typeof value === "number") return csvCell(value);
          return csvCell(String(value));
        })
        .join(","),
    );
  }
  return `${lines.join("\n")}\n`;
}

function writeFileSafely(filePath: string, content: string): void {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, "utf8");
}

async function buildSnapshot(
  range: DateRange,
  gscConfig: { siteUrl: string; serviceAccountJson: string },
  matomoConfig: { baseUrl: string; siteId: string; tokenAuth: string },
): Promise<AnalyticsSnapshot> {
  const [gsc, matomo] = await Promise.all([
    fetchGsc(gscConfig.siteUrl, gscConfig.serviceAccountJson, range),
    fetchMatomo(
      matomoConfig.baseUrl,
      matomoConfig.siteId,
      matomoConfig.tokenAuth,
      range,
    ),
  ]);
  return {
    range,
    gscQueries: gsc.queries,
    gscPages: gsc.pages,
    matomoPages: matomo.pages,
    matomoEvents: matomo.events,
  };
}

function writeSnapshot(outDir: string, snap: AnalyticsSnapshot): void {
  writeFileSafely(
    path.join(outDir, "gsc-queries.csv"),
    toCsv<GscQueryRow>(["query", "clicks", "impressions", "ctr", "position"], snap.gscQueries),
  );
  writeFileSafely(
    path.join(outDir, "gsc-pages.csv"),
    toCsv<GscPageRow>(["page", "clicks", "impressions", "ctr", "position"], snap.gscPages),
  );
  writeFileSafely(
    path.join(outDir, "matomo-pages.csv"),
    toCsv<MatomoPageRow>(
      ["label", "nb_visits", "nb_hits", "bounce_rate", "avg_time_on_page"],
      snap.matomoPages,
    ),
  );
  interface MatomoEventCsvRow {
    readonly category: string;
    readonly action: string;
    readonly name: string;
    readonly nb_events: number;
    readonly nb_visits: number;
  }
  writeFileSafely(
    path.join(outDir, "matomo-events.csv"),
    toCsv<MatomoEventCsvRow>(
      ["category", "action", "name", "nb_events", "nb_visits"],
      snap.matomoEvents.map(
        (e): MatomoEventCsvRow => ({
          category: e.category,
          action: e.action,
          name: e.name ?? "",
          nb_events: e.nb_events,
          nb_visits: e.nb_visits,
        }),
      ),
    ),
  );
}

function previousWindow(range: DateRange, periodDays: number): DateRange {
  const start = new Date(`${range.startDate}T00:00:00Z`);
  const prevEnd = new Date(start);
  prevEnd.setUTCDate(prevEnd.getUTCDate() - 1);
  const prevStart = new Date(prevEnd);
  prevStart.setUTCDate(prevStart.getUTCDate() - (periodDays - 1));
  const fmt = (d: Date) => d.toISOString().slice(0, 10);
  return { startDate: fmt(prevStart), endDate: fmt(prevEnd) };
}

async function main(): Promise<void> {
  const config = loadConfig();
  const current = computeDateRange(config.periodDays);
  const previous = previousWindow(current, config.periodDays);

  console.log(`[analytics] current window: ${current.startDate} -> ${current.endDate}`);
  console.log(`[analytics] previous window: ${previous.startDate} -> ${previous.endDate}`);

  const gscConfig = {
    siteUrl: config.gscSiteUrl,
    serviceAccountJson: config.gscServiceAccountJson,
  };
  const matomoConfig = {
    baseUrl: config.matomoBaseUrl,
    siteId: config.matomoSiteId,
    tokenAuth: config.matomoTokenAuth,
  };

  const currentSnapshot = await buildSnapshot(current, gscConfig, matomoConfig);
  let previousSnapshot: AnalyticsSnapshot | null = null;
  try {
    previousSnapshot = await buildSnapshot(previous, gscConfig, matomoConfig);
  } catch (err) {
    console.warn(`[analytics] previous window fetch failed: ${(err as Error).message}`);
  }

  const alerts = detectAlerts(currentSnapshot, previousSnapshot);
  console.log(`[analytics] detected ${alerts.length} alerts`);

  const report: AnalyticsReport = {
    current: currentSnapshot,
    previous: previousSnapshot,
    alerts,
    generatedAt: new Date().toISOString(),
  };

  const outDir = path.isAbsolute(config.outputDir)
    ? path.join(config.outputDir, current.endDate)
    : path.join(REPO_ROOT, config.outputDir, current.endDate);

  writeSnapshot(outDir, currentSnapshot);
  writeFileSafely(path.join(outDir, "alerts.json"), `${JSON.stringify(alerts, null, 2)}\n`);
  writeFileSafely(path.join(outDir, "REPORT.md"), renderReportMarkdown(report));
  console.log(`[analytics] wrote report to ${outDir}`);

  if (config.discordWebhookUrl) {
    const reportUrl = process.env.ANALYTICS_REPORT_URL ?? null;
    const embed = renderDiscordEmbed(report, reportUrl);
    try {
      await notifyDiscord(config.discordWebhookUrl, embed);
      console.log("[analytics] Discord notification sent");
    } catch (err) {
      console.warn(`[analytics] Discord notification failed: ${(err as Error).message}`);
    }
  }
}

main().catch((err: unknown) => {
  console.error("[analytics] FATAL", err);
  process.exit(1);
});
