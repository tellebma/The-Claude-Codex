/**
 * Google Search Console API client.
 *
 * Auth flow:
 *  1. Parse the service account JSON
 *  2. Build + sign a JWT (RS256) for scope
 *     https://www.googleapis.com/auth/webmasters.readonly
 *  3. Exchange the JWT for an access token at oauth2.googleapis.com/token
 *  4. POST searchAnalytics.query with Bearer <access_token>
 *
 * We call the endpoint twice: once with dimension=["query"] and once with
 * dimension=["page"]. Rows beyond 25 000 are not paginated for v1.
 */

import { createSign } from "node:crypto";
import type { DateRange, GscPageRow, GscQueryRow } from "./types.ts";

interface ServiceAccount {
  readonly client_email: string;
  readonly private_key: string;
  readonly token_uri?: string;
}

interface TokenResponse {
  readonly access_token: string;
  readonly expires_in: number;
}

interface SearchAnalyticsRow {
  readonly keys?: readonly string[];
  readonly clicks?: number;
  readonly impressions?: number;
  readonly ctr?: number;
  readonly position?: number;
}

interface SearchAnalyticsResponse {
  readonly rows?: readonly SearchAnalyticsRow[];
}

function base64url(data: Buffer | string): string {
  const buf = typeof data === "string" ? Buffer.from(data) : data;
  return buf.toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

function parseServiceAccount(raw: string): ServiceAccount {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    throw new Error(`GSC service account JSON is not valid JSON: ${(err as Error).message}`);
  }
  if (typeof parsed !== "object" || parsed === null) {
    throw new Error("GSC service account JSON must be an object");
  }
  const obj = parsed as Record<string, unknown>;
  if (typeof obj.client_email !== "string" || typeof obj.private_key !== "string") {
    throw new Error("GSC service account JSON missing client_email or private_key");
  }
  return {
    client_email: obj.client_email,
    private_key: obj.private_key,
    token_uri: typeof obj.token_uri === "string" ? obj.token_uri : undefined,
  };
}

async function getAccessToken(sa: ServiceAccount): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "RS256", typ: "JWT" };
  const payload = {
    iss: sa.client_email,
    scope: "https://www.googleapis.com/auth/webmasters.readonly",
    aud: sa.token_uri ?? "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  };
  const input = `${base64url(JSON.stringify(header))}.${base64url(JSON.stringify(payload))}`;
  const signer = createSign("RSA-SHA256");
  signer.update(input);
  const signature = base64url(signer.sign(sa.private_key));
  const jwt = `${input}.${signature}`;
  const body = new URLSearchParams({
    grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
    assertion: jwt,
  });
  const res = await fetch(sa.token_uri ?? "https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!res.ok) {
    throw new Error(`GSC token exchange failed: ${res.status} ${await res.text()}`);
  }
  const json = (await res.json()) as TokenResponse;
  return json.access_token;
}

async function querySearchAnalytics(
  siteUrl: string,
  accessToken: string,
  range: DateRange,
  dimension: "query" | "page",
  rowLimit = 25000,
): Promise<readonly SearchAnalyticsRow[]> {
  const endpoint = `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`;
  const body = {
    startDate: range.startDate,
    endDate: range.endDate,
    dimensions: [dimension],
    rowLimit,
  };
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(`GSC query (${dimension}) failed: ${res.status} ${await res.text()}`);
  }
  const json = (await res.json()) as SearchAnalyticsResponse;
  return json.rows ?? [];
}

function toGscQueryRow(row: SearchAnalyticsRow): GscQueryRow {
  return {
    query: row.keys?.[0] ?? "",
    clicks: row.clicks ?? 0,
    impressions: row.impressions ?? 0,
    ctr: row.ctr ?? 0,
    position: row.position ?? 0,
  };
}

function toGscPageRow(row: SearchAnalyticsRow): GscPageRow {
  return {
    page: row.keys?.[0] ?? "",
    clicks: row.clicks ?? 0,
    impressions: row.impressions ?? 0,
    ctr: row.ctr ?? 0,
    position: row.position ?? 0,
  };
}

export async function fetchGsc(
  siteUrl: string,
  serviceAccountJson: string,
  range: DateRange,
): Promise<{ readonly queries: readonly GscQueryRow[]; readonly pages: readonly GscPageRow[] }> {
  const sa = parseServiceAccount(serviceAccountJson);
  const token = await getAccessToken(sa);
  const [queryRows, pageRows] = await Promise.all([
    querySearchAnalytics(siteUrl, token, range, "query"),
    querySearchAnalytics(siteUrl, token, range, "page"),
  ]);
  return {
    queries: queryRows.map(toGscQueryRow),
    pages: pageRows.map(toGscPageRow),
  };
}
