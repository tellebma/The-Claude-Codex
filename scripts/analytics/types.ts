/**
 * Shared types for the weekly analytics pipeline.
 *
 * The pipeline produces a `Report` combining data from two sources
 * (Google Search Console + Matomo) and a set of `Alert`s derived from it.
 */

export interface DateRange {
  readonly startDate: string; // ISO YYYY-MM-DD, inclusive
  readonly endDate: string; // ISO YYYY-MM-DD, inclusive
}

export interface GscQueryRow {
  readonly query: string;
  readonly clicks: number;
  readonly impressions: number;
  readonly ctr: number; // 0..1
  readonly position: number;
}

export interface GscPageRow {
  readonly page: string; // full URL
  readonly clicks: number;
  readonly impressions: number;
  readonly ctr: number;
  readonly position: number;
}

export interface MatomoPageRow {
  readonly label: string; // URL path, without host
  readonly nb_visits: number;
  readonly nb_hits: number;
  readonly bounce_rate: number; // 0..100
  readonly avg_time_on_page: number; // seconds
}

export interface MatomoEventRow {
  readonly category: string; // "engagement" | "navigation" | "configurator" | ...
  readonly action: string; // "scroll_depth" | "external_link_click" | ...
  readonly name: string | null; // label: "25", "50", url, step index...
  readonly nb_events: number;
  readonly nb_visits: number;
}

export type AlertSeverity = "critical" | "warning" | "info";

export type AlertKind =
  | "ctr_urgent"
  | "position_drop"
  | "query_opportunity"
  | "ctr_anomaly"
  | "engagement_low"
  | "tracking_mismatch"
  | "funnel_drop";

export interface Alert {
  readonly kind: AlertKind;
  readonly severity: AlertSeverity;
  readonly subject: string; // page URL or query text
  readonly message: string; // one-line human description
  readonly metrics: Readonly<Record<string, number | string>>; // supporting numbers
}

export interface AnalyticsSnapshot {
  readonly range: DateRange;
  readonly gscQueries: readonly GscQueryRow[];
  readonly gscPages: readonly GscPageRow[];
  readonly matomoPages: readonly MatomoPageRow[];
  readonly matomoEvents: readonly MatomoEventRow[];
}

export interface AnalyticsReport {
  readonly current: AnalyticsSnapshot;
  readonly previous: AnalyticsSnapshot | null; // null = first run, no delta yet
  readonly alerts: readonly Alert[];
  readonly generatedAt: string; // ISO timestamp
}
