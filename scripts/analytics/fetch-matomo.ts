/**
 * Matomo Reporting API client.
 *
 * Docs: https://developer.matomo.org/api-reference/reporting-api
 *
 * We use POST to keep the token_auth out of URL logs. Matomo accepts both
 * GET (query string) and POST (form body) with identical semantics.
 */

import type {
  DateRange,
  MatomoEventRow,
  MatomoPageRow,
} from "./types.ts";

interface MatomoPageApiRow {
  readonly label?: string;
  readonly url?: string;
  readonly nb_visits?: number;
  readonly nb_hits?: number;
  readonly bounce_rate?: string | number;
  readonly avg_time_on_page?: number;
}

interface MatomoEventApiRow {
  readonly label?: string;
  readonly nb_events?: number;
  readonly nb_visits?: number;
  readonly subtable?: readonly MatomoEventApiRow[];
}

async function callMatomo<T>(
  baseUrl: string,
  params: Record<string, string>,
): Promise<T> {
  const body = new URLSearchParams({
    module: "API",
    format: "json",
    ...params,
  });
  const endpoint = `${baseUrl.replace(/\/$/, "")}/index.php`;
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!res.ok) {
    throw new Error(`Matomo API ${params.method} failed: ${res.status} ${await res.text()}`);
  }
  const json = (await res.json()) as T;
  if (typeof json === "object" && json !== null && "result" in json && (json as { result: string }).result === "error") {
    const msg = "message" in json ? (json as { message: string }).message : "unknown error";
    throw new Error(`Matomo API ${params.method} error: ${msg}`);
  }
  return json;
}

function parseBounceRate(v: string | number | undefined): number {
  if (typeof v === "number") return v;
  if (typeof v !== "string") return 0;
  const m = v.match(/^(\d+(?:\.\d+)?)/);
  return m ? Number(m[1]) : 0;
}

function toMatomoPageRow(row: MatomoPageApiRow): MatomoPageRow {
  return {
    label: row.label ?? row.url ?? "",
    nb_visits: row.nb_visits ?? 0,
    nb_hits: row.nb_hits ?? 0,
    bounce_rate: parseBounceRate(row.bounce_rate),
    avg_time_on_page: row.avg_time_on_page ?? 0,
  };
}

function flattenEvents(
  rows: readonly MatomoEventApiRow[],
  category: string,
): MatomoEventRow[] {
  const flat: MatomoEventRow[] = [];
  for (const row of rows) {
    const action = row.label ?? "";
    const children = row.subtable ?? [];
    if (children.length === 0) {
      flat.push({
        category,
        action,
        name: null,
        nb_events: row.nb_events ?? 0,
        nb_visits: row.nb_visits ?? 0,
      });
      continue;
    }
    for (const child of children) {
      flat.push({
        category,
        action,
        name: child.label ?? null,
        nb_events: child.nb_events ?? 0,
        nb_visits: child.nb_visits ?? 0,
      });
    }
  }
  return flat;
}

async function fetchPages(
  baseUrl: string,
  siteId: string,
  tokenAuth: string,
  range: DateRange,
): Promise<readonly MatomoPageRow[]> {
  const rows = await callMatomo<readonly MatomoPageApiRow[]>(baseUrl, {
    method: "Actions.getPageUrls",
    idSite: siteId,
    period: "range",
    date: `${range.startDate},${range.endDate}`,
    flat: "1",
    filter_limit: "500",
    token_auth: tokenAuth,
  });
  return rows.map(toMatomoPageRow);
}

async function fetchEventCategories(
  baseUrl: string,
  siteId: string,
  tokenAuth: string,
  range: DateRange,
): Promise<readonly MatomoEventRow[]> {
  const categories = await callMatomo<readonly MatomoEventApiRow[]>(baseUrl, {
    method: "Events.getCategory",
    idSite: siteId,
    period: "range",
    date: `${range.startDate},${range.endDate}`,
    expanded: "1",
    filter_limit: "500",
    token_auth: tokenAuth,
  });
  const out: MatomoEventRow[] = [];
  for (const cat of categories) {
    const category = cat.label ?? "";
    // Fetch actions and names for each category via Events.getAction with segment
    const actions = await callMatomo<readonly MatomoEventApiRow[]>(baseUrl, {
      method: "Events.getAction",
      idSite: siteId,
      period: "range",
      date: `${range.startDate},${range.endDate}`,
      segment: `eventCategory==${category}`,
      expanded: "1",
      filter_limit: "500",
      token_auth: tokenAuth,
    });
    out.push(...flattenEvents(actions, category));
  }
  return out;
}

export async function fetchMatomo(
  baseUrl: string,
  siteId: string,
  tokenAuth: string,
  range: DateRange,
): Promise<{ readonly pages: readonly MatomoPageRow[]; readonly events: readonly MatomoEventRow[] }> {
  const [pages, events] = await Promise.all([
    fetchPages(baseUrl, siteId, tokenAuth, range),
    fetchEventCategories(baseUrl, siteId, tokenAuth, range),
  ]);
  return { pages, events };
}
