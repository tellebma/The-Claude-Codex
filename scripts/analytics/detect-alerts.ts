/**
 * Pure alert detection: takes two snapshots (current + previous)
 * and emits the list of Niveau 3 alerts described in docs/analytics/README.md.
 *
 * All thresholds live here as named constants so tests can assert them.
 */

import type {
  Alert,
  AnalyticsSnapshot,
  GscPageRow,
  GscQueryRow,
  MatomoEventRow,
  MatomoPageRow,
} from "./types.ts";

export const THRESHOLDS = Object.freeze({
  CTR_URGENT_MIN_IMPRESSIONS: 100,
  POSITION_DROP_MIN: 2,
  QUERY_OPPORTUNITY_MIN_IMPRESSIONS: 50,
  QUERY_OPPORTUNITY_MIN_POSITION: 5,
  QUERY_OPPORTUNITY_MAX_POSITION: 15,
  CTR_ANOMALY_MAX_POSITION: 5,
  CTR_ANOMALY_MAX_CTR: 0.02,
  ENGAGEMENT_MIN_PAGEVIEWS: 50,
  ENGAGEMENT_MIN_SCROLL75_RATE: 0.2,
  TRACKING_MISMATCH_MAX_POSITION: 10,
  FUNNEL_STEP_MIN_CONVERSION: 0.5,
});

interface PageKey {
  readonly raw: string;
  readonly normalized: string;
}

function normalizePath(raw: string): PageKey {
  let normalized = raw;
  try {
    const url = new URL(raw, "https://claude-codex.fr");
    normalized = url.pathname;
  } catch {
    normalized = raw;
  }
  if (!normalized.endsWith("/")) normalized += "/";
  return { raw, normalized };
}

function ctrUrgentAlerts(pages: readonly GscPageRow[]): readonly Alert[] {
  return pages
    .filter(
      (p) => p.impressions >= THRESHOLDS.CTR_URGENT_MIN_IMPRESSIONS && p.clicks === 0,
    )
    .map((p) => ({
      kind: "ctr_urgent" as const,
      severity: "critical" as const,
      subject: p.page,
      message: `${p.impressions} impressions, 0 clic (position ${p.position.toFixed(1)})`,
      metrics: {
        impressions: p.impressions,
        clicks: p.clicks,
        position: Number(p.position.toFixed(1)),
      },
    }));
}

function positionDropAlerts(
  current: readonly GscPageRow[],
  previous: readonly GscPageRow[] | null,
): readonly Alert[] {
  if (!previous) return [];
  const prevByPage = new Map(previous.map((p) => [normalizePath(p.page).normalized, p]));
  const alerts: Alert[] = [];
  for (const p of current) {
    const prev = prevByPage.get(normalizePath(p.page).normalized);
    if (!prev) continue;
    const delta = p.position - prev.position;
    if (delta < THRESHOLDS.POSITION_DROP_MIN) continue;
    alerts.push({
      kind: "position_drop",
      severity: "warning",
      subject: p.page,
      message: `position ${prev.position.toFixed(1)} -> ${p.position.toFixed(1)} (+${delta.toFixed(1)} rangs)`,
      metrics: {
        previousPosition: Number(prev.position.toFixed(1)),
        currentPosition: Number(p.position.toFixed(1)),
        delta: Number(delta.toFixed(1)),
      },
    });
  }
  return alerts;
}

function queryOpportunityAlerts(queries: readonly GscQueryRow[]): readonly Alert[] {
  return queries
    .filter(
      (q) =>
        q.impressions >= THRESHOLDS.QUERY_OPPORTUNITY_MIN_IMPRESSIONS &&
        q.clicks === 0 &&
        q.position >= THRESHOLDS.QUERY_OPPORTUNITY_MIN_POSITION &&
        q.position <= THRESHOLDS.QUERY_OPPORTUNITY_MAX_POSITION,
    )
    .map((q) => ({
      kind: "query_opportunity" as const,
      severity: "warning" as const,
      subject: q.query,
      message: `${q.impressions} impressions, 0 clic, position ${q.position.toFixed(1)} : page a enrichir ou creer`,
      metrics: {
        impressions: q.impressions,
        position: Number(q.position.toFixed(1)),
      },
    }));
}

function ctrAnomalyAlerts(pages: readonly GscPageRow[]): readonly Alert[] {
  return pages
    .filter(
      (p) =>
        p.position > 0 &&
        p.position < THRESHOLDS.CTR_ANOMALY_MAX_POSITION &&
        p.clicks > 0 &&
        p.ctr < THRESHOLDS.CTR_ANOMALY_MAX_CTR,
    )
    .map((p) => ({
      kind: "ctr_anomaly" as const,
      severity: "warning" as const,
      subject: p.page,
      message: `position ${p.position.toFixed(1)} mais CTR ${(p.ctr * 100).toFixed(1)} % : titre/snippet a revoir`,
      metrics: {
        position: Number(p.position.toFixed(1)),
        ctr: Number((p.ctr * 100).toFixed(1)),
        impressions: p.impressions,
      },
    }));
}

function scroll75RateByPage(events: readonly MatomoEventRow[]): Map<string, number> {
  const byLabel = new Map<string, number>();
  for (const e of events) {
    if (e.category === "engagement" && e.action === "scroll_depth" && e.name === "75") {
      byLabel.set(e.name ?? "", e.nb_events);
    }
  }
  return byLabel;
}

function engagementLowAlerts(
  matomoPages: readonly MatomoPageRow[],
  matomoEvents: readonly MatomoEventRow[],
): readonly Alert[] {
  const totalScroll75 = [...scroll75RateByPage(matomoEvents).values()].reduce(
    (a, b) => a + b,
    0,
  );
  const totalPageviews = matomoPages.reduce((sum, p) => sum + p.nb_hits, 0);
  if (totalPageviews < THRESHOLDS.ENGAGEMENT_MIN_PAGEVIEWS) return [];
  const globalRate = totalPageviews === 0 ? 0 : totalScroll75 / totalPageviews;
  if (globalRate >= THRESHOLDS.ENGAGEMENT_MIN_SCROLL75_RATE) return [];
  return [
    {
      kind: "engagement_low",
      severity: "info",
      subject: "site global",
      message: `scroll 75 % sur ${(globalRate * 100).toFixed(1)} % des pageviews (${totalScroll75}/${totalPageviews})`,
      metrics: {
        scroll75: totalScroll75,
        pageviews: totalPageviews,
        rate: Number((globalRate * 100).toFixed(1)),
      },
    },
  ];
}

function trackingMismatchAlerts(
  gscPages: readonly GscPageRow[],
  matomoPages: readonly MatomoPageRow[],
): readonly Alert[] {
  const matomoByPath = new Map<string, MatomoPageRow>();
  for (const mp of matomoPages) {
    matomoByPath.set(normalizePath(mp.label).normalized, mp);
  }
  const alerts: Alert[] = [];
  for (const gp of gscPages) {
    if (
      gp.clicks <= 0 ||
      gp.position <= 0 ||
      gp.position > THRESHOLDS.TRACKING_MISMATCH_MAX_POSITION
    ) {
      continue;
    }
    const match = matomoByPath.get(normalizePath(gp.page).normalized);
    if (match && match.nb_hits > 0) continue;
    alerts.push({
      kind: "tracking_mismatch",
      severity: "info",
      subject: gp.page,
      message: `${gp.clicks} clics GSC mais 0 pageview Matomo : trafic bot ou analytics casse`,
      metrics: {
        gscClicks: gp.clicks,
        gscPosition: Number(gp.position.toFixed(1)),
        matomoPageviews: match?.nb_hits ?? 0,
      },
    });
  }
  return alerts;
}

function funnelDropAlerts(events: readonly MatomoEventRow[]): readonly Alert[] {
  const stepCounts = new Map<string, number>();
  for (const e of events) {
    if (e.category === "configurator" && e.action === "configurator_step" && e.name) {
      stepCounts.set(e.name, (stepCounts.get(e.name) ?? 0) + e.nb_events);
    }
  }
  const alerts: Alert[] = [];
  const orderedSteps = [...stepCounts.keys()].sort((a, b) => Number(a) - Number(b));
  for (let i = 0; i < orderedSteps.length - 1; i++) {
    const from = orderedSteps[i];
    const to = orderedSteps[i + 1];
    const fromCount = stepCounts.get(from) ?? 0;
    const toCount = stepCounts.get(to) ?? 0;
    if (fromCount < 10) continue; // avoid noise on low traffic
    const rate = toCount / fromCount;
    if (rate >= THRESHOLDS.FUNNEL_STEP_MIN_CONVERSION) continue;
    alerts.push({
      kind: "funnel_drop",
      severity: "warning",
      subject: `configurator step ${from} -> ${to}`,
      message: `conversion ${(rate * 100).toFixed(0)} % (${toCount}/${fromCount})`,
      metrics: {
        from: Number(from),
        to: Number(to),
        fromCount,
        toCount,
        rate: Number((rate * 100).toFixed(1)),
      },
    });
  }
  return alerts;
}

export function detectAlerts(
  current: AnalyticsSnapshot,
  previous: AnalyticsSnapshot | null,
): readonly Alert[] {
  return [
    ...ctrUrgentAlerts(current.gscPages),
    ...positionDropAlerts(current.gscPages, previous?.gscPages ?? null),
    ...queryOpportunityAlerts(current.gscQueries),
    ...ctrAnomalyAlerts(current.gscPages),
    ...engagementLowAlerts(current.matomoPages, current.matomoEvents),
    ...trackingMismatchAlerts(current.gscPages, current.matomoPages),
    ...funnelDropAlerts(current.matomoEvents),
  ];
}
