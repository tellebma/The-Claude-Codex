/**
 * Refresh du snapshot Matomo des statistiques d'articles (CTN-6).
 *
 * Appele par le workflow hebdo `weekly-article-stats.yml` (CTN-7) et utilisable
 * en local via `npm run refresh:article-stats`. Lit l'API Matomo Reporting
 * (https://developer.matomo.org/api-reference/reporting-api), filtre les URLs
 * `/fr/content/{slug}/` et `/en/content/{slug}/`, ecrit `src/data/article-stats.json`.
 *
 * Gestion d'erreur :
 *   - env manquant -> log + exit 1
 *   - HTTP 4xx     -> abort + exit 1
 *   - HTTP 5xx     -> 1 retry apres 5s, puis abort + exit 1
 *   - timeout 15s  -> abort + exit 1
 *   - JSON malforme -> abort + exit 1 (le fichier existant est preserve)
 *
 * Les logs sont au format JSON Lines (1 ligne par event) pour parsing CI.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import {
  isArticleLocale,
  type ArticleLocale,
  type ArticleStatsEntry,
  type ArticleStatsFile,
} from "../src/data/article-stats";

export const REQUEST_TIMEOUT_MS = 15_000;
export const SERVER_ERROR_RETRY_DELAY_MS = 5_000;
export const VIRAL_PAGEVIEWS_THRESHOLD = 50;
export const STALE_DAYS_THRESHOLD = 90;

const USER_AGENT = "claude-codex-stats-bot/1.0";
const OUTPUT_REL_PATH = "src/data/article-stats.json";
const CONTENT_REL_PATH = "content";

const ARTICLE_URL_RE = /^\/(?<locale>fr|en)\/content\/(?<slug>[^/]+?)\/?$/;

type LogLevel = "info" | "warn" | "error";

interface LogEntry {
  readonly level: LogLevel;
  readonly ts: string;
  readonly message: string;
  readonly [key: string]: unknown;
}

export interface MatomoEnv {
  readonly apiUrl: string;
  readonly authToken: string;
  readonly siteId: string;
}

export interface MatomoPageRow {
  readonly label?: string;
  readonly url?: string;
  readonly nb_visits?: number;
  readonly nb_hits?: number;
}

export interface ParsedArticleUrl {
  readonly locale: ArticleLocale;
  readonly slug: string;
}

export interface StaleViralAlert {
  readonly slug: string;
  readonly locale: ArticleLocale;
  readonly pageviewsLast7d: number;
  readonly daysSinceModified: number;
}

interface AggregateInput {
  readonly last30: ReadonlyArray<MatomoPageRow>;
  readonly last7: ReadonlyArray<MatomoPageRow>;
  readonly prev7: ReadonlyArray<MatomoPageRow>;
  readonly scrollDepth75: ReadonlyMap<string, number>;
}

interface PageviewsByKey {
  readonly [key: string]: number;
}

function emit(level: LogLevel, message: string, extra: Record<string, unknown> = {}): void {
  const entry: LogEntry = {
    level,
    ts: new Date().toISOString(),
    message,
    ...extra,
  };
  // eslint-disable-next-line no-console
  console.log(JSON.stringify(entry));
}

export function normalizeArticlePath(rawUrl: string): string | null {
  if (typeof rawUrl !== "string" || rawUrl.length === 0) return null;
  let cleaned = rawUrl.split("?")[0]!.split("#")[0]!.trim();
  cleaned = cleaned.replace(/^https?:\/\/[^/]+/i, "");
  if (!cleaned.startsWith("/")) {
    const firstSlash = cleaned.indexOf("/");
    if (firstSlash === -1) return null;
    cleaned = cleaned.slice(firstSlash);
  }
  return cleaned;
}

export function parseArticleUrl(rawUrl: string): ParsedArticleUrl | null {
  const path = normalizeArticlePath(rawUrl);
  if (!path) return null;
  const match = ARTICLE_URL_RE.exec(path);
  if (!match?.groups) return null;
  const { locale, slug } = match.groups;
  if (!isArticleLocale(locale)) return null;
  if (!slug || slug.length === 0 || slug === "index") return null;
  return { locale, slug };
}

export function rowKey(parsed: ParsedArticleUrl): string {
  return `${parsed.locale}:${parsed.slug}`;
}

export function extractPageviewsMap(rows: ReadonlyArray<MatomoPageRow>): PageviewsByKey {
  const out: Record<string, number> = {};
  for (const row of rows) {
    const candidate = row.url ?? row.label;
    if (!candidate) continue;
    const parsed = parseArticleUrl(candidate);
    if (!parsed) continue;
    const visits = typeof row.nb_visits === "number" ? row.nb_visits : 0;
    out[rowKey(parsed)] = (out[rowKey(parsed)] ?? 0) + visits;
  }
  return out;
}

export function computeDeltaPct(last7: number, prev7: number): number {
  if (prev7 === 0) {
    return last7 > 0 ? 100 : 0;
  }
  const raw = ((last7 - prev7) / prev7) * 100;
  return Math.round(raw * 10) / 10;
}

export function aggregateStats(input: AggregateInput): ReadonlyArray<ArticleStatsEntry> {
  const last30Map = extractPageviewsMap(input.last30);
  const last7Map = extractPageviewsMap(input.last7);
  const prev7Map = extractPageviewsMap(input.prev7);

  const allKeys = new Set<string>([
    ...Object.keys(last30Map),
    ...Object.keys(last7Map),
    ...Object.keys(prev7Map),
  ]);

  const entries: ArticleStatsEntry[] = [];
  for (const key of allKeys) {
    const [locale, ...slugParts] = key.split(":");
    const slug = slugParts.join(":");
    if (!isArticleLocale(locale) || slug.length === 0) continue;

    const last30 = last30Map[key] ?? 0;
    const last7 = last7Map[key] ?? 0;
    const prev7 = prev7Map[key] ?? 0;
    if (last30 === 0 && last7 === 0 && prev7 === 0) continue;

    const scrollRatio = input.scrollDepth75.get(key) ?? 0;
    entries.push({
      slug,
      locale,
      pageviewsLast30d: last30,
      pageviewsLast7d: last7,
      pageviewsPrev7d: prev7,
      deltaPct: computeDeltaPct(last7, prev7),
      scrollDepth75Pct: Math.max(0, Math.min(1, Math.round(scrollRatio * 1000) / 1000)),
    });
  }

  entries.sort((a, b) => {
    if (a.locale !== b.locale) return a.locale.localeCompare(b.locale);
    return a.slug.localeCompare(b.slug);
  });
  return entries;
}

export function detectStaleViralArticles(
  entries: ReadonlyArray<ArticleStatsEntry>,
  articleDates: ReadonlyMap<string, Date>,
  now: Date,
  pageviewsThreshold: number = VIRAL_PAGEVIEWS_THRESHOLD,
  staleDays: number = STALE_DAYS_THRESHOLD,
): ReadonlyArray<StaleViralAlert> {
  const alerts: StaleViralAlert[] = [];
  const msPerDay = 86_400_000;
  for (const entry of entries) {
    if (entry.pageviewsLast7d <= pageviewsThreshold) continue;
    const lastModified = articleDates.get(`${entry.locale}:${entry.slug}`);
    if (!lastModified) continue;
    const days = Math.floor((now.getTime() - lastModified.getTime()) / msPerDay);
    if (days >= staleDays) {
      alerts.push({
        slug: entry.slug,
        locale: entry.locale,
        pageviewsLast7d: entry.pageviewsLast7d,
        daysSinceModified: days,
      });
    }
  }
  return alerts;
}

export function readMatomoEnv(env: Readonly<Record<string, string | undefined>>): MatomoEnv {
  const apiUrl = (env["MATOMO_API_URL"] ?? "").trim();
  const authToken = (env["MATOMO_AUTH_TOKEN"] ?? "").trim();
  const siteId = (env["MATOMO_SITE_ID"] ?? "").trim();
  const missing: string[] = [];
  if (apiUrl.length === 0) missing.push("MATOMO_API_URL");
  if (authToken.length === 0) missing.push("MATOMO_AUTH_TOKEN");
  if (siteId.length === 0) missing.push("MATOMO_SITE_ID");
  if (missing.length > 0) {
    throw new Error(`Missing environment variables: ${missing.join(", ")}`);
  }
  return { apiUrl, authToken, siteId };
}

export function buildPageUrlsQuery(env: MatomoEnv, date: string): string {
  const base = env.apiUrl.replace(/\/$/, "");
  const params = new URLSearchParams({
    module: "API",
    method: "Actions.getPageUrls",
    idSite: env.siteId,
    period: "range",
    date,
    format: "json",
    flat: "1",
    filter_limit: "500",
    token_auth: env.authToken,
  });
  return `${base}?${params.toString()}`;
}

export function buildScrollDepthQuery(env: MatomoEnv): string {
  const base = env.apiUrl.replace(/\/$/, "");
  const params = new URLSearchParams({
    module: "API",
    method: "Events.getName",
    idSite: env.siteId,
    period: "range",
    date: "last30",
    format: "json",
    filter_limit: "500",
    segment: "eventCategory==engagement;eventAction==scroll_depth;eventName==75",
    secondaryDimension: "eventUrl",
    flat: "1",
    token_auth: env.authToken,
  });
  return `${base}?${params.toString()}`;
}

interface FetchOptions {
  readonly fetchFn?: typeof globalThis.fetch;
  readonly sleepFn?: (ms: number) => Promise<void>;
}

async function defaultSleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchMatomoJson<T>(
  url: string,
  label: string,
  options: FetchOptions = {},
): Promise<T> {
  const fetchFn = options.fetchFn ?? globalThis.fetch;
  const sleepFn = options.sleepFn ?? defaultSleep;

  const attempt = async (allowRetry: boolean): Promise<T> => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    let response: Response;
    try {
      response = await fetchFn(url, {
        signal: controller.signal,
        headers: {
          Accept: "application/json",
          "User-Agent": USER_AGENT,
        },
      });
    } catch (err) {
      const reason = err instanceof Error ? err.message : String(err);
      throw new Error(`[${label}] network or timeout error: ${reason}`);
    } finally {
      clearTimeout(timer);
    }

    if (response.status >= 500 && response.status < 600) {
      if (allowRetry) {
        emit("warn", `[${label}] HTTP ${response.status}, retrying`, {
          retryDelayMs: SERVER_ERROR_RETRY_DELAY_MS,
        });
        await sleepFn(SERVER_ERROR_RETRY_DELAY_MS);
        return attempt(false);
      }
      throw new Error(`[${label}] HTTP ${response.status} (after retry)`);
    }
    if (!response.ok) {
      throw new Error(`[${label}] HTTP ${response.status}`);
    }

    let body: unknown;
    try {
      body = await response.json();
    } catch {
      throw new Error(`[${label}] malformed JSON`);
    }
    return body as T;
  };

  return attempt(true);
}

interface MatomoEventRow {
  readonly label?: string;
  readonly url?: string;
  readonly nb_events?: number;
  readonly Events_EventUrl?: string;
}

export function buildScrollDepthMap(
  eventRows: ReadonlyArray<MatomoEventRow>,
  pageviewsLast30: PageviewsByKey,
): ReadonlyMap<string, number> {
  const counts: Record<string, number> = {};
  for (const row of eventRows) {
    const candidate = row.Events_EventUrl ?? row.url ?? row.label;
    if (!candidate) continue;
    const parsed = parseArticleUrl(candidate);
    if (!parsed) continue;
    const events = typeof row.nb_events === "number" ? row.nb_events : 0;
    const key = rowKey(parsed);
    counts[key] = (counts[key] ?? 0) + events;
  }
  const map = new Map<string, number>();
  for (const [key, eventCount] of Object.entries(counts)) {
    const denom = pageviewsLast30[key] ?? 0;
    if (denom <= 0) continue;
    map.set(key, eventCount / denom);
  }
  return map;
}

function findRepoRoot(): string {
  const here = path.dirname(fileURLToPath(import.meta.url));
  return path.resolve(here, "..");
}

export function collectArticleDates(repoRoot: string): ReadonlyMap<string, Date> {
  const map = new Map<string, Date>();
  for (const locale of ["fr", "en"] as const) {
    const dir = path.join(repoRoot, CONTENT_REL_PATH, locale);
    if (!fs.existsSync(dir)) continue;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (!entry.isFile() || !entry.name.endsWith(".mdx")) continue;
      const slug = entry.name.replace(/\.mdx$/, "");
      const raw = fs.readFileSync(path.join(dir, entry.name), "utf-8");
      const parsed = matter(raw);
      const data = parsed.data as Record<string, unknown>;
      const candidate = data["dateModified"] ?? data["datePublished"];
      if (typeof candidate !== "string") continue;
      const parsedDate = new Date(candidate);
      if (Number.isNaN(parsedDate.getTime())) continue;
      map.set(`${locale}:${slug}`, parsedDate);
    }
  }
  return map;
}

interface MatomoPagesResponse {
  readonly rows: ReadonlyArray<MatomoPageRow>;
}

function normalizePages(raw: unknown): ReadonlyArray<MatomoPageRow> {
  if (Array.isArray(raw)) return raw as ReadonlyArray<MatomoPageRow>;
  if (typeof raw === "object" && raw !== null) {
    const candidate = (raw as MatomoPagesResponse).rows;
    if (Array.isArray(candidate)) return candidate;
  }
  return [];
}

export interface RunOptions {
  readonly env?: Readonly<Record<string, string | undefined>>;
  readonly fetchFn?: typeof globalThis.fetch;
  readonly sleepFn?: (ms: number) => Promise<void>;
  readonly now?: Date;
  readonly repoRoot?: string;
  readonly writeFile?: (filePath: string, contents: string) => void;
}

export interface RunResult {
  readonly file: ArticleStatsFile;
  readonly outputPath: string;
  readonly alerts: ReadonlyArray<StaleViralAlert>;
}

export async function runRefresh(options: RunOptions = {}): Promise<RunResult> {
  const env = readMatomoEnv(options.env ?? process.env);
  const now = options.now ?? new Date();
  const repoRoot = options.repoRoot ?? findRepoRoot();
  const fetchOpts: FetchOptions = { fetchFn: options.fetchFn, sleepFn: options.sleepFn };

  emit("info", "Fetching Matomo pageviews", { periods: ["last30", "last7", "previous7"] });

  const last30Raw = await fetchMatomoJson<unknown>(
    buildPageUrlsQuery(env, "last30"),
    "pageviews-last30",
    fetchOpts,
  );
  const last7Raw = await fetchMatomoJson<unknown>(
    buildPageUrlsQuery(env, "last7"),
    "pageviews-last7",
    fetchOpts,
  );
  const prev7Raw = await fetchMatomoJson<unknown>(
    buildPageUrlsQuery(env, "previous7"),
    "pageviews-previous7",
    fetchOpts,
  );
  const scrollRaw = await fetchMatomoJson<unknown>(
    buildScrollDepthQuery(env),
    "scroll-depth-75",
    fetchOpts,
  ).catch((err: unknown) => {
    const reason = err instanceof Error ? err.message : String(err);
    emit("warn", "Scroll-depth fetch failed, defaulting to 0", { reason });
    return [];
  });

  const last30 = normalizePages(last30Raw);
  const last7 = normalizePages(last7Raw);
  const prev7 = normalizePages(prev7Raw);
  const scrollRows = Array.isArray(scrollRaw) ? (scrollRaw as ReadonlyArray<MatomoEventRow>) : [];

  const last30Pageviews = extractPageviewsMap(last30);
  const scrollDepth75 = buildScrollDepthMap(scrollRows, last30Pageviews);

  const rejected: string[] = [];
  for (const row of last30) {
    if (rejected.length >= 5) break;
    const candidate = row.url ?? row.label;
    if (candidate && !parseArticleUrl(candidate)) rejected.push(candidate);
  }
  emit("info", "Matomo URL parsing stats", {
    last30Rows: last30.length,
    last30Matched: Object.keys(last30Pageviews).length,
    sampleRejectedUrls: rejected,
  });

  const articles = aggregateStats({ last30, last7, prev7, scrollDepth75 });
  const articleDates = collectArticleDates(repoRoot);
  const alerts = detectStaleViralArticles(articles, articleDates, now);
  for (const alert of alerts) {
    emit("warn", "Article viral but stale (not updated > 90d)", { ...alert });
  }

  const file: ArticleStatsFile = {
    generatedAt: now.toISOString(),
    matomoPeriodDays: 30,
    source: "matomo",
    articles,
  };

  const outputPath = path.join(repoRoot, OUTPUT_REL_PATH);
  const contents = `${JSON.stringify(file, null, 2)}\n`;
  const writeFile =
    options.writeFile ?? ((p: string, c: string) => fs.writeFileSync(p, c, "utf-8"));
  writeFile(outputPath, contents);

  emit("info", "Wrote article-stats.json", {
    outputPath,
    articleCount: articles.length,
    alertCount: alerts.length,
  });

  return { file, outputPath, alerts };
}

async function main(): Promise<void> {
  try {
    await runRefresh();
  } catch (err) {
    const reason = err instanceof Error ? err.message : String(err);
    emit("error", "Refresh aborted", { reason });
    process.exit(1);
  }
}

const isDirectInvocation =
  import.meta.url === `file://${process.argv[1]}` ||
  import.meta.url.endsWith(path.basename(process.argv[1] ?? ""));

if (isDirectInvocation) {
  void main();
}
