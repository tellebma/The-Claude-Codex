/**
 * Converts an AnalyticsReport into a human-readable markdown document.
 *
 * Layout:
 *  - Header with date range + alert count by severity
 *  - "Alerts" section (ordered: critical, warning, info)
 *  - Top queries table (GSC)
 *  - Top pages table (GSC + Matomo cross-join)
 *  - Raw Matomo events summary (engagement / navigation / configurator)
 */

import type { DiscordEmbed } from "./notify-discord.ts";
import type {
  Alert,
  AlertSeverity,
  AnalyticsReport,
  AnalyticsSnapshot,
  GscPageRow,
  GscQueryRow,
  MatomoEventRow,
  MatomoPageRow,
} from "./types.ts";

const SEVERITY_EMOJI: Readonly<Record<AlertSeverity, string>> = {
  critical: "[CRIT]",
  warning: "[WARN]",
  info: "[INFO]",
};

const SEVERITY_ORDER: Readonly<Record<AlertSeverity, number>> = {
  critical: 0,
  warning: 1,
  info: 2,
};

function normalizePath(raw: string): string {
  try {
    const url = new URL(raw, "https://claude-codex.fr");
    const path = url.pathname;
    return path.endsWith("/") ? path : `${path}/`;
  } catch {
    return raw.endsWith("/") ? raw : `${raw}/`;
  }
}

function formatPct(ratio: number, digits = 1): string {
  return `${(ratio * 100).toFixed(digits)} %`;
}

function sortByImpressionsDesc<T extends { readonly impressions: number }>(
  rows: readonly T[],
): readonly T[] {
  return [...rows].sort((a, b) => b.impressions - a.impressions);
}

function sortBySeverity(alerts: readonly Alert[]): readonly Alert[] {
  return [...alerts].sort((a, b) => {
    const bySeverity = SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity];
    if (bySeverity !== 0) return bySeverity;
    return a.kind.localeCompare(b.kind);
  });
}

function renderHeader(report: AnalyticsReport): string {
  const counts = { critical: 0, warning: 0, info: 0 };
  for (const a of report.alerts) counts[a.severity]++;
  const range = `${report.current.range.startDate} -> ${report.current.range.endDate}`;
  return [
    `# Rapport analytics hebdo ${report.current.range.endDate}`,
    "",
    `> Periode : **${range}**`,
    `> Sources : Google Search Console (\`sc-domain:claude-codex.fr\`) + Matomo (self-hosted)`,
    `> Genere le ${report.generatedAt}`,
    "",
    `**Alertes** : ${counts.critical} critiques, ${counts.warning} a surveiller, ${counts.info} infos.`,
    "",
  ].join("\n");
}

function renderAlertsSection(alerts: readonly Alert[]): string {
  if (alerts.length === 0) {
    return "## Alertes\n\nAucune alerte declenchee cette semaine.\n";
  }
  const lines = ["## Alertes", ""];
  for (const alert of sortBySeverity(alerts)) {
    lines.push(
      `- ${SEVERITY_EMOJI[alert.severity]} **${alert.kind}** : ${alert.subject}`,
      `  - ${alert.message}`,
    );
  }
  lines.push("");
  return lines.join("\n");
}

function renderGscQueriesTable(rows: readonly GscQueryRow[], limit = 15): string {
  const top = sortByImpressionsDesc(rows).slice(0, limit);
  if (top.length === 0) return "## Top queries GSC\n\nAucune donnee.\n";
  const lines = [
    "## Top queries GSC",
    "",
    "| Query | Impressions | Clics | CTR | Position |",
    "|-------|------------:|------:|----:|---------:|",
  ];
  for (const r of top) {
    lines.push(
      `| ${r.query} | ${r.impressions} | ${r.clicks} | ${formatPct(r.ctr)} | ${r.position.toFixed(1)} |`,
    );
  }
  lines.push("");
  return lines.join("\n");
}

function renderPagesCrossTable(
  gscPages: readonly GscPageRow[],
  matomoPages: readonly MatomoPageRow[],
  limit = 15,
): string {
  const matomoByPath = new Map<string, MatomoPageRow>();
  for (const mp of matomoPages) {
    matomoByPath.set(normalizePath(mp.label), mp);
  }
  const top = sortByImpressionsDesc(gscPages).slice(0, limit);
  if (top.length === 0) return "## Pages (GSC x Matomo)\n\nAucune donnee.\n";
  const lines = [
    "## Pages (GSC x Matomo)",
    "",
    "| Page | Imp | Clics | CTR | Pos | Pageviews | Scroll 75 % |",
    "|------|----:|------:|----:|----:|----------:|------------:|",
  ];
  for (const gp of top) {
    const key = normalizePath(gp.page);
    const match = matomoByPath.get(key);
    const pageviews = match ? match.nb_hits : 0;
    const scroll75 = "-"; // per-page scroll rate requires per-url event breakdown, skipped for v1
    lines.push(
      `| \`${key}\` | ${gp.impressions} | ${gp.clicks} | ${formatPct(gp.ctr)} | ${gp.position.toFixed(1)} | ${pageviews} | ${scroll75} |`,
    );
  }
  lines.push("");
  return lines.join("\n");
}

function renderEventsSummary(events: readonly MatomoEventRow[]): string {
  if (events.length === 0) return "## Evenements Matomo\n\nAucune donnee.\n";
  const byCategory = new Map<string, number>();
  for (const e of events) {
    byCategory.set(e.category, (byCategory.get(e.category) ?? 0) + e.nb_events);
  }
  const lines = [
    "## Evenements Matomo",
    "",
    "| Categorie | Evenements |",
    "|-----------|-----------:|",
  ];
  for (const [category, total] of byCategory) {
    lines.push(`| ${category} | ${total} |`);
  }
  lines.push("");
  return lines.join("\n");
}

function renderFooter(snap: AnalyticsSnapshot): string {
  return [
    "## Meta",
    "",
    `- Queries GSC distinctes : ${snap.gscQueries.length}`,
    `- Pages GSC avec impressions : ${snap.gscPages.length}`,
    `- Pages Matomo : ${snap.matomoPages.length}`,
    `- Evenements Matomo : ${snap.matomoEvents.length}`,
    "",
  ].join("\n");
}

export function renderReportMarkdown(report: AnalyticsReport): string {
  return [
    renderHeader(report),
    renderAlertsSection(report.alerts),
    renderGscQueriesTable(report.current.gscQueries),
    renderPagesCrossTable(report.current.gscPages, report.current.matomoPages),
    renderEventsSummary(report.current.matomoEvents),
    renderFooter(report.current),
  ].join("\n");
}

const SEVERITY_COLOR: Readonly<Record<AlertSeverity, number>> = {
  critical: 0xdc2626, // red-600
  warning: 0xf59e0b, // amber-500
  info: 0x0ea5e9, // sky-500
};

const OK_COLOR = 0x10b981; // emerald-500 — no alerts

function pickEmbedColor(alerts: readonly Alert[]): number {
  if (alerts.some((a) => a.severity === "critical")) return SEVERITY_COLOR.critical;
  if (alerts.some((a) => a.severity === "warning")) return SEVERITY_COLOR.warning;
  if (alerts.some((a) => a.severity === "info")) return SEVERITY_COLOR.info;
  return OK_COLOR;
}

function sumGsc(snap: AnalyticsSnapshot): { clicks: number; impressions: number } {
  let clicks = 0;
  let impressions = 0;
  for (const row of snap.gscQueries) {
    clicks += row.clicks;
    impressions += row.impressions;
  }
  return { clicks, impressions };
}

function sumMatomo(snap: AnalyticsSnapshot): { pageviews: number; events: number } {
  let pageviews = 0;
  for (const row of snap.matomoPages) pageviews += row.nb_hits;
  let events = 0;
  for (const row of snap.matomoEvents) events += row.nb_events;
  return { pageviews, events };
}

function renderAlertsField(alerts: readonly Alert[]): string {
  if (alerts.length === 0) return "Aucune alerte cette semaine.";
  const top = sortBySeverity(alerts).slice(0, 5);
  const lines = top.map(
    (a) => `${SEVERITY_EMOJI[a.severity]} \`${a.kind}\` — ${a.subject}`,
  );
  if (alerts.length > top.length) {
    lines.push(`... et ${alerts.length - top.length} autres (voir rapport complet)`);
  }
  return lines.join("\n");
}

export function renderDiscordSummary(report: AnalyticsReport, prUrl: string | null): string {
  const counts = { critical: 0, warning: 0, info: 0 };
  for (const a of report.alerts) counts[a.severity]++;
  const topAlerts = sortBySeverity(report.alerts).slice(0, 5);
  const lines = [
    `**Analytics hebdo ${report.current.range.endDate}**`,
    `Periode : ${report.current.range.startDate} -> ${report.current.range.endDate}`,
    `Alertes : ${counts.critical} crit / ${counts.warning} warn / ${counts.info} info`,
  ];
  if (topAlerts.length === 0) {
    lines.push("", "Aucune alerte cette semaine.");
  } else {
    lines.push("", "**Top alertes :**");
    for (const alert of topAlerts) {
      lines.push(`- ${SEVERITY_EMOJI[alert.severity]} ${alert.kind} : ${alert.subject}`);
    }
  }
  if (prUrl) {
    lines.push("", `Rapport complet : ${prUrl}`);
  }
  return lines.join("\n");
}

export function renderDiscordEmbed(
  report: AnalyticsReport,
  reportUrl: string | null,
): DiscordEmbed {
  const counts = { critical: 0, warning: 0, info: 0 };
  for (const a of report.alerts) counts[a.severity]++;

  const gsc = sumGsc(report.current);
  const matomo = sumMatomo(report.current);

  const { startDate, endDate } = report.current.range;
  const summary = report.alerts.length === 0
    ? "Aucune alerte declenchee, trafic suivi sur la periode."
    : `${counts.critical} critiques, ${counts.warning} a surveiller, ${counts.info} infos.`;

  const embed: DiscordEmbed = {
    title: `Rapport analytics hebdo ${endDate}`,
    description: summary,
    color: pickEmbedColor(report.alerts),
    ...(reportUrl ? { url: reportUrl } : {}),
    fields: [
      {
        name: "Periode",
        value: `${startDate} -> ${endDate}`,
        inline: true,
      },
      {
        name: "Alertes",
        value: `${counts.critical} crit / ${counts.warning} warn / ${counts.info} info`,
        inline: true,
      },
      {
        name: "GSC",
        value: `${gsc.clicks} clics / ${gsc.impressions} imp`,
        inline: true,
      },
      {
        name: "Matomo",
        value: `${matomo.pageviews} pageviews / ${matomo.events} events`,
        inline: true,
      },
      {
        name: "Top alertes",
        value: renderAlertsField(report.alerts),
        inline: false,
      },
    ],
    footer: { text: `Genere le ${report.generatedAt}` },
    timestamp: report.generatedAt,
  };
  return embed;
}
