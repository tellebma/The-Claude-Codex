import { describe, expect, it } from "vitest";

import {
  THRESHOLDS,
  detectAlerts,
} from "../../scripts/analytics/detect-alerts.ts";
import type {
  AnalyticsSnapshot,
  GscPageRow,
  GscQueryRow,
  MatomoEventRow,
  MatomoPageRow,
} from "../../scripts/analytics/types.ts";

function snap(overrides: Partial<AnalyticsSnapshot> = {}): AnalyticsSnapshot {
  return {
    range: { startDate: "2026-04-15", endDate: "2026-04-21" },
    gscQueries: [],
    gscPages: [],
    matomoPages: [],
    matomoEvents: [],
    ...overrides,
  };
}

function gscPage(p: Partial<GscPageRow>): GscPageRow {
  return {
    page: p.page ?? "https://claude-codex.fr/en/test/",
    clicks: p.clicks ?? 0,
    impressions: p.impressions ?? 0,
    ctr: p.ctr ?? 0,
    position: p.position ?? 0,
  };
}

function gscQuery(q: Partial<GscQueryRow>): GscQueryRow {
  return {
    query: q.query ?? "test query",
    clicks: q.clicks ?? 0,
    impressions: q.impressions ?? 0,
    ctr: q.ctr ?? 0,
    position: q.position ?? 0,
  };
}

describe("detectAlerts /ctr_urgent", () => {
  it("flags pages with high impressions and zero clicks", () => {
    const alerts = detectAlerts(
      snap({
        gscPages: [gscPage({ page: "/a/", impressions: 200, clicks: 0, position: 7 })],
      }),
      null,
    );
    expect(alerts.find((a) => a.kind === "ctr_urgent")).toBeDefined();
  });

  it("ignores pages below the impression threshold", () => {
    const alerts = detectAlerts(
      snap({
        gscPages: [
          gscPage({
            impressions: THRESHOLDS.CTR_URGENT_MIN_IMPRESSIONS - 1,
            clicks: 0,
          }),
        ],
      }),
      null,
    );
    expect(alerts.filter((a) => a.kind === "ctr_urgent")).toHaveLength(0);
  });

  it("ignores pages with any clicks", () => {
    const alerts = detectAlerts(
      snap({ gscPages: [gscPage({ impressions: 500, clicks: 1 })] }),
      null,
    );
    expect(alerts.filter((a) => a.kind === "ctr_urgent")).toHaveLength(0);
  });
});

describe("detectAlerts /position_drop", () => {
  it("flags pages that lost more than 2 position ranks", () => {
    const current = snap({
      gscPages: [gscPage({ page: "/a/", position: 9 })],
    });
    const previous = snap({
      gscPages: [gscPage({ page: "/a/", position: 5 })],
    });
    const alerts = detectAlerts(current, previous);
    expect(alerts.find((a) => a.kind === "position_drop")).toBeDefined();
  });

  it("returns no drop when previous snapshot is absent", () => {
    const alerts = detectAlerts(
      snap({ gscPages: [gscPage({ position: 9 })] }),
      null,
    );
    expect(alerts.filter((a) => a.kind === "position_drop")).toHaveLength(0);
  });

  it("ignores position gains or stable positions", () => {
    const alerts = detectAlerts(
      snap({ gscPages: [gscPage({ page: "/a/", position: 5 })] }),
      snap({ gscPages: [gscPage({ page: "/a/", position: 7 })] }),
    );
    expect(alerts.filter((a) => a.kind === "position_drop")).toHaveLength(0);
  });

  it("normalizes trailing slash when matching pages across snapshots", () => {
    const alerts = detectAlerts(
      snap({
        gscPages: [gscPage({ page: "https://claude-codex.fr/a", position: 10 })],
      }),
      snap({
        gscPages: [gscPage({ page: "https://claude-codex.fr/a/", position: 6 })],
      }),
    );
    expect(alerts.find((a) => a.kind === "position_drop")).toBeDefined();
  });
});

describe("detectAlerts /query_opportunity", () => {
  it("flags queries in sweet spot position range with zero clicks", () => {
    const alerts = detectAlerts(
      snap({
        gscQueries: [
          gscQuery({ query: "foo", impressions: 80, clicks: 0, position: 8 }),
        ],
      }),
      null,
    );
    expect(alerts.find((a) => a.kind === "query_opportunity")).toBeDefined();
  });

  it("ignores queries outside the sweet spot range", () => {
    const alerts = detectAlerts(
      snap({
        gscQueries: [
          gscQuery({ query: "already top", impressions: 500, clicks: 0, position: 3 }),
          gscQuery({ query: "too deep", impressions: 500, clicks: 0, position: 20 }),
        ],
      }),
      null,
    );
    expect(alerts.filter((a) => a.kind === "query_opportunity")).toHaveLength(0);
  });
});

describe("detectAlerts /ctr_anomaly", () => {
  it("flags top-positioned pages with suspiciously low CTR", () => {
    const alerts = detectAlerts(
      snap({
        gscPages: [
          gscPage({
            page: "/anomaly/",
            position: 3,
            impressions: 1000,
            clicks: 10,
            ctr: 0.01,
          }),
        ],
      }),
      null,
    );
    expect(alerts.find((a) => a.kind === "ctr_anomaly")).toBeDefined();
  });

  it("does not flag pages with healthy CTR", () => {
    const alerts = detectAlerts(
      snap({
        gscPages: [
          gscPage({ position: 3, impressions: 1000, clicks: 100, ctr: 0.1 }),
        ],
      }),
      null,
    );
    expect(alerts.filter((a) => a.kind === "ctr_anomaly")).toHaveLength(0);
  });
});

describe("detectAlerts /engagement_low", () => {
  it("flags when scroll 75 rate is below threshold on enough pageviews", () => {
    const matomoPages: MatomoPageRow[] = [
      {
        label: "/a/",
        nb_visits: 100,
        nb_hits: 100,
        bounce_rate: 60,
        avg_time_on_page: 30,
      },
    ];
    const matomoEvents: MatomoEventRow[] = [
      {
        category: "engagement",
        action: "scroll_depth",
        name: "75",
        nb_events: 10, // 10% rate, below 20% threshold
        nb_visits: 10,
      },
    ];
    const alerts = detectAlerts(snap({ matomoPages, matomoEvents }), null);
    expect(alerts.find((a) => a.kind === "engagement_low")).toBeDefined();
  });

  it("does not flag when pageview volume is too low", () => {
    const matomoPages: MatomoPageRow[] = [
      {
        label: "/a/",
        nb_visits: 5,
        nb_hits: 5,
        bounce_rate: 60,
        avg_time_on_page: 30,
      },
    ];
    const alerts = detectAlerts(snap({ matomoPages, matomoEvents: [] }), null);
    expect(alerts.filter((a) => a.kind === "engagement_low")).toHaveLength(0);
  });
});

describe("detectAlerts /tracking_mismatch", () => {
  it("flags pages with GSC clicks but zero Matomo pageviews", () => {
    const alerts = detectAlerts(
      snap({
        gscPages: [gscPage({ page: "/ghost/", clicks: 5, position: 4, impressions: 100 })],
        matomoPages: [],
      }),
      null,
    );
    expect(alerts.find((a) => a.kind === "tracking_mismatch")).toBeDefined();
  });

  it("does not flag pages that are also in Matomo", () => {
    const alerts = detectAlerts(
      snap({
        gscPages: [gscPage({ page: "https://claude-codex.fr/a/", clicks: 5, position: 4 })],
        matomoPages: [
          {
            label: "/a/",
            nb_visits: 30,
            nb_hits: 40,
            bounce_rate: 50,
            avg_time_on_page: 60,
          },
        ],
      }),
      null,
    );
    expect(alerts.filter((a) => a.kind === "tracking_mismatch")).toHaveLength(0);
  });
});

describe("detectAlerts /funnel_drop", () => {
  it("flags configurator steps with conversion below 50 percent", () => {
    const events: MatomoEventRow[] = [
      { category: "configurator", action: "configurator_step", name: "1", nb_events: 100, nb_visits: 100 },
      { category: "configurator", action: "configurator_step", name: "2", nb_events: 30, nb_visits: 30 },
    ];
    const alerts = detectAlerts(snap({ matomoEvents: events }), null);
    const drop = alerts.find((a) => a.kind === "funnel_drop");
    expect(drop).toBeDefined();
    expect(drop?.metrics.rate).toBeLessThan(50);
  });

  it("does not flag when every step keeps at least half the traffic", () => {
    const events: MatomoEventRow[] = [
      { category: "configurator", action: "configurator_step", name: "1", nb_events: 100, nb_visits: 100 },
      { category: "configurator", action: "configurator_step", name: "2", nb_events: 80, nb_visits: 80 },
    ];
    const alerts = detectAlerts(snap({ matomoEvents: events }), null);
    expect(alerts.filter((a) => a.kind === "funnel_drop")).toHaveLength(0);
  });

  it("ignores low-volume funnel steps", () => {
    const events: MatomoEventRow[] = [
      { category: "configurator", action: "configurator_step", name: "1", nb_events: 5, nb_visits: 5 },
      { category: "configurator", action: "configurator_step", name: "2", nb_events: 1, nb_visits: 1 },
    ];
    const alerts = detectAlerts(snap({ matomoEvents: events }), null);
    expect(alerts.filter((a) => a.kind === "funnel_drop")).toHaveLength(0);
  });
});

describe("detectAlerts /general", () => {
  it("returns an empty array when no snapshots contain anything interesting", () => {
    expect(detectAlerts(snap(), null)).toEqual([]);
  });
});
