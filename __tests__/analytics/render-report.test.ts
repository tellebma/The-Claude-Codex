import { describe, expect, it } from "vitest";

import {
  renderDiscordSummary,
  renderReportMarkdown,
} from "../../scripts/analytics/render-report.ts";
import type {
  Alert,
  AnalyticsReport,
  AnalyticsSnapshot,
} from "../../scripts/analytics/types.ts";

function emptySnapshot(end = "2026-04-21"): AnalyticsSnapshot {
  return {
    range: { startDate: "2026-04-15", endDate: end },
    gscQueries: [],
    gscPages: [],
    matomoPages: [],
    matomoEvents: [],
  };
}

function report(overrides: Partial<AnalyticsReport> = {}): AnalyticsReport {
  return {
    current: emptySnapshot(),
    previous: null,
    alerts: [],
    generatedAt: "2026-04-22T06:00:00Z",
    ...overrides,
  };
}

describe("renderReportMarkdown", () => {
  it("renders a header, an empty-alerts section, and a footer on empty input", () => {
    const md = renderReportMarkdown(report());
    expect(md).toContain("# Rapport analytics hebdo");
    expect(md).toContain("2026-04-15 -> 2026-04-21");
    expect(md).toContain("Aucune alerte declenchee cette semaine.");
    expect(md).toContain("## Meta");
    expect(md).toContain("Queries GSC distinctes : 0");
  });

  it("sorts alerts by severity, critical first", () => {
    const alerts: Alert[] = [
      {
        kind: "engagement_low",
        severity: "info",
        subject: "site",
        message: "info alert",
        metrics: {},
      },
      {
        kind: "ctr_urgent",
        severity: "critical",
        subject: "/a/",
        message: "crit alert",
        metrics: {},
      },
      {
        kind: "ctr_anomaly",
        severity: "warning",
        subject: "/b/",
        message: "warn alert",
        metrics: {},
      },
    ];
    const md = renderReportMarkdown(report({ alerts }));
    const critIdx = md.indexOf("[CRIT]");
    const warnIdx = md.indexOf("[WARN]");
    const infoIdx = md.indexOf("[INFO]");
    expect(critIdx).toBeGreaterThanOrEqual(0);
    expect(critIdx).toBeLessThan(warnIdx);
    expect(warnIdx).toBeLessThan(infoIdx);
  });

  it("renders the GSC queries table with impression-sorted rows", () => {
    const md = renderReportMarkdown(
      report({
        current: {
          ...emptySnapshot(),
          gscQueries: [
            { query: "low", clicks: 0, impressions: 10, ctr: 0, position: 5 },
            { query: "high", clicks: 3, impressions: 500, ctr: 0.006, position: 7 },
          ],
        },
      }),
    );
    const highIdx = md.indexOf("| high |");
    const lowIdx = md.indexOf("| low |");
    expect(highIdx).toBeGreaterThan(0);
    expect(lowIdx).toBeGreaterThan(highIdx);
  });

  it("joins GSC pages with Matomo pageviews on normalized paths", () => {
    const md = renderReportMarkdown(
      report({
        current: {
          ...emptySnapshot(),
          gscPages: [
            {
              page: "https://claude-codex.fr/en/test/",
              clicks: 5,
              impressions: 100,
              ctr: 0.05,
              position: 3,
            },
          ],
          matomoPages: [
            {
              label: "/en/test/",
              nb_visits: 40,
              nb_hits: 42,
              bounce_rate: 50,
              avg_time_on_page: 90,
            },
          ],
        },
      }),
    );
    expect(md).toMatch(/`\/en\/test\/`.*\| 42 \|/);
  });

  it("summarizes Matomo events per category", () => {
    const md = renderReportMarkdown(
      report({
        current: {
          ...emptySnapshot(),
          matomoEvents: [
            { category: "engagement", action: "scroll_depth", name: "50", nb_events: 30, nb_visits: 25 },
            { category: "engagement", action: "scroll_depth", name: "75", nb_events: 10, nb_visits: 8 },
            { category: "configurator", action: "configurator_start", name: null, nb_events: 5, nb_visits: 5 },
          ],
        },
      }),
    );
    expect(md).toContain("| engagement | 40 |");
    expect(md).toContain("| configurator | 5 |");
  });
});

describe("renderDiscordSummary", () => {
  it("lists severity counts and a no-alerts message when empty", () => {
    const text = renderDiscordSummary(report(), null);
    expect(text).toContain("0 crit / 0 warn / 0 info");
    expect(text).toContain("Aucune alerte");
  });

  it("lists the top 5 alerts when more exist", () => {
    const alerts: Alert[] = Array.from({ length: 7 }, (_, i) => ({
      kind: "ctr_anomaly",
      severity: "warning",
      subject: `/page-${i}/`,
      message: `alert ${i}`,
      metrics: {},
    }));
    const text = renderDiscordSummary(report({ alerts }), null);
    const matches = text.match(/\/page-\d+\//g);
    expect(matches).toHaveLength(5);
  });

  it("appends the PR URL when provided", () => {
    const text = renderDiscordSummary(report(), "https://github.com/owner/repo/pull/42");
    expect(text).toContain("https://github.com/owner/repo/pull/42");
  });

  it("does not mention a PR URL when it is null", () => {
    const text = renderDiscordSummary(report(), null);
    expect(text).not.toContain("Rapport complet");
  });
});
