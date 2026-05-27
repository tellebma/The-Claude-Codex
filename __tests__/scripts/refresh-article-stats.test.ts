/**
 * Tests unitaires CTN-6 : transformation Matomo -> ArticleStatsFile.
 * La couche reseau (fetch) est mockee via FetchOptions.fetchFn / sleepFn.
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  aggregateStats,
  buildPageUrlsRequest,
  buildScrollDepthMap,
  buildScrollDepthRequest,
  collectArticleDates,
  computeDeltaPct,
  computeMatomoDateRanges,
  detectStaleViralArticles,
  extractPageviewsMap,
  fetchMatomoJson,
  formatMatomoDate,
  normalizeArticlePath,
  parseArticleUrl,
  readMatomoEnv,
  runRefresh,
  REQUEST_TIMEOUT_MS,
  SERVER_ERROR_RETRY_DELAY_MS,
} from "../../scripts/refresh-article-stats";

describe("normalizeArticlePath", () => {
  it("strips https://domain prefix", () => {
    expect(normalizeArticlePath("https://claude-codex.fr/fr/content/foo/")).toBe(
      "/fr/content/foo/",
    );
  });

  it("strips http://domain prefix", () => {
    expect(normalizeArticlePath("http://claude-codex.fr/en/content/bar")).toBe(
      "/en/content/bar",
    );
  });

  it("adds leading slash to a bare domain-style path", () => {
    expect(normalizeArticlePath("claude-codex.fr/fr/content/baz/")).toBe(
      "/fr/content/baz/",
    );
  });

  it("returns the path unchanged when already canonical", () => {
    expect(normalizeArticlePath("/fr/content/foo/")).toBe("/fr/content/foo/");
  });

  it("trims surrounding whitespace", () => {
    expect(normalizeArticlePath("  /fr/content/foo/  ")).toBe("/fr/content/foo/");
  });

  it("returns null on empty input or no slash at all", () => {
    expect(normalizeArticlePath("")).toBeNull();
    expect(normalizeArticlePath("garbage")).toBeNull();
  });
});

describe("parseArticleUrl", () => {
  it("parses /fr/content/{slug}/ correctly", () => {
    expect(parseArticleUrl("/fr/content/comprendre-claude-code-internals/")).toEqual({
      locale: "fr",
      slug: "comprendre-claude-code-internals",
    });
  });

  it("parses /en/content/{slug} without trailing slash", () => {
    expect(parseArticleUrl("/en/content/leaked-api-key-recovery")).toEqual({
      locale: "en",
      slug: "leaked-api-key-recovery",
    });
  });

  it("strips query string and hash", () => {
    expect(parseArticleUrl("/fr/content/article-x/?theme=tutorial#anchor")).toEqual({
      locale: "fr",
      slug: "article-x",
    });
  });

  it("rejects locale outside fr/en", () => {
    expect(parseArticleUrl("/es/content/foo/")).toBeNull();
  });

  it("rejects nested sub-paths", () => {
    expect(parseArticleUrl("/fr/content/foo/bar/")).toBeNull();
  });

  it("rejects /fr/content/ index", () => {
    expect(parseArticleUrl("/fr/content/")).toBeNull();
  });

  it("rejects empty and non-string input", () => {
    expect(parseArticleUrl("")).toBeNull();
    expect(parseArticleUrl("/fr/skills/find-skills/")).toBeNull();
  });

  it("parses an URL prefixed with the canonical domain", () => {
    expect(
      parseArticleUrl("https://claude-codex.fr/fr/content/comprendre-claude-code-internals/"),
    ).toEqual({ locale: "fr", slug: "comprendre-claude-code-internals" });
  });

  it("parses a Matomo-style bare domain prefix", () => {
    expect(parseArticleUrl("claude-codex.fr/en/content/leaked-api-key-recovery")).toEqual({
      locale: "en",
      slug: "leaked-api-key-recovery",
    });
  });
});

describe("computeDeltaPct", () => {
  it("computes positive delta and rounds to 1 decimal", () => {
    expect(computeDeltaPct(280, 210)).toBeCloseTo(33.3, 5);
  });

  it("computes negative delta and rounds to 1 decimal", () => {
    expect(computeDeltaPct(150, 300)).toBe(-50);
  });

  it("returns 100 when prev7 is 0 and last7 > 0", () => {
    expect(computeDeltaPct(50, 0)).toBe(100);
  });

  it("returns 0 when both periods are 0", () => {
    expect(computeDeltaPct(0, 0)).toBe(0);
  });

  it("rounds 33.333 to 33.3", () => {
    expect(computeDeltaPct(400, 300)).toBe(33.3);
  });
});

describe("extractPageviewsMap", () => {
  it("aggregates rows by locale:slug key", () => {
    const map = extractPageviewsMap([
      { url: "/fr/content/article-a/", nb_visits: 100 },
      { url: "/en/content/article-b/", nb_visits: 50 },
      { url: "/fr/content/article-a/", nb_visits: 25 },
    ]);
    expect(map["fr:article-a"]).toBe(125);
    expect(map["en:article-b"]).toBe(50);
  });

  it("falls back to label when url is absent", () => {
    const map = extractPageviewsMap([
      { label: "/fr/content/article-c/", nb_visits: 7 },
    ]);
    expect(map["fr:article-c"]).toBe(7);
  });

  it("ignores rows without article URL", () => {
    const map = extractPageviewsMap([
      { url: "/fr/skills/foo/", nb_visits: 999 },
      { url: "/fr/content/", nb_visits: 50 },
      { nb_visits: 10 },
    ]);
    expect(Object.keys(map)).toHaveLength(0);
  });

  it("treats missing nb_visits as 0", () => {
    const map = extractPageviewsMap([{ url: "/fr/content/foo/" }]);
    expect(map["fr:foo"]).toBe(0);
  });
});

describe("aggregateStats", () => {
  it("combines 3 periods into ArticleStatsEntry sorted by locale then slug", () => {
    const entries = aggregateStats({
      last30: [
        { url: "/fr/content/zeta/", nb_visits: 300 },
        { url: "/en/content/alpha/", nb_visits: 200 },
        { url: "/fr/content/beta/", nb_visits: 150 },
      ],
      last7: [
        { url: "/fr/content/zeta/", nb_visits: 80 },
        { url: "/en/content/alpha/", nb_visits: 60 },
      ],
      prev7: [
        { url: "/fr/content/zeta/", nb_visits: 100 },
        { url: "/en/content/alpha/", nb_visits: 40 },
      ],
      scrollDepth75: new Map([["fr:zeta", 0.42]]),
    });
    expect(entries.map((e) => `${e.locale}:${e.slug}`)).toEqual([
      "en:alpha",
      "fr:beta",
      "fr:zeta",
    ]);
    const zeta = entries.find((e) => e.slug === "zeta");
    expect(zeta).toMatchObject({
      pageviewsLast30d: 300,
      pageviewsLast7d: 80,
      pageviewsPrev7d: 100,
      deltaPct: -20,
      scrollDepth75Pct: 0.42,
    });
  });

  it("clamps scrollDepth75Pct to [0, 1] and rounds to 3 decimals", () => {
    const entries = aggregateStats({
      last30: [{ url: "/fr/content/x/", nb_visits: 10 }],
      last7: [],
      prev7: [],
      scrollDepth75: new Map([["fr:x", 1.5]]),
    });
    expect(entries[0]?.scrollDepth75Pct).toBe(1);
  });

  it("excludes articles with zero pageviews everywhere", () => {
    const entries = aggregateStats({
      last30: [],
      last7: [],
      prev7: [],
      scrollDepth75: new Map(),
    });
    expect(entries).toHaveLength(0);
  });

  it("keeps articles even if only previous7 has data", () => {
    const entries = aggregateStats({
      last30: [],
      last7: [],
      prev7: [{ url: "/fr/content/decline/", nb_visits: 50 }],
      scrollDepth75: new Map(),
    });
    expect(entries).toHaveLength(1);
    expect(entries[0]?.deltaPct).toBe(-100);
  });
});

describe("buildScrollDepthMap", () => {
  it("computes ratio events / pageviews_last30", () => {
    const map = buildScrollDepthMap(
      [{ Events_EventUrl: "/fr/content/foo/", nb_events: 30 }],
      { "fr:foo": 100 },
    );
    expect(map.get("fr:foo")).toBeCloseTo(0.3, 5);
  });

  it("ignores articles with zero pageviews denom", () => {
    const map = buildScrollDepthMap(
      [{ Events_EventUrl: "/fr/content/foo/", nb_events: 30 }],
      {},
    );
    expect(map.size).toBe(0);
  });

  it("ignores non-article URLs", () => {
    const map = buildScrollDepthMap(
      [{ Events_EventUrl: "/fr/skills/x/", nb_events: 99 }],
      { "fr:x": 200 },
    );
    expect(map.size).toBe(0);
  });
});

describe("detectStaleViralArticles", () => {
  const now = new Date("2026-05-21T00:00:00Z");

  it("flags articles with viral last7 traffic but old dateModified", () => {
    const dates = new Map([["fr:old-viral", new Date("2026-01-01T00:00:00Z")]]);
    const alerts = detectStaleViralArticles(
      [
        {
          slug: "old-viral",
          locale: "fr",
          pageviewsLast30d: 500,
          pageviewsLast7d: 200,
          pageviewsPrev7d: 50,
          deltaPct: 300,
          scrollDepth75Pct: 0.4,
        },
      ],
      dates,
      now,
    );
    expect(alerts).toHaveLength(1);
    expect(alerts[0]?.daysSinceModified).toBeGreaterThanOrEqual(90);
  });

  it("ignores articles below pageviews threshold", () => {
    const dates = new Map([["fr:quiet", new Date("2026-01-01T00:00:00Z")]]);
    const alerts = detectStaleViralArticles(
      [
        {
          slug: "quiet",
          locale: "fr",
          pageviewsLast30d: 60,
          pageviewsLast7d: 20,
          pageviewsPrev7d: 10,
          deltaPct: 100,
          scrollDepth75Pct: 0.3,
        },
      ],
      dates,
      now,
    );
    expect(alerts).toHaveLength(0);
  });

  it("ignores articles when dateModified is missing", () => {
    const alerts = detectStaleViralArticles(
      [
        {
          slug: "ghost",
          locale: "fr",
          pageviewsLast30d: 500,
          pageviewsLast7d: 200,
          pageviewsPrev7d: 50,
          deltaPct: 300,
          scrollDepth75Pct: 0.4,
        },
      ],
      new Map(),
      now,
    );
    expect(alerts).toHaveLength(0);
  });

  it("ignores recently updated viral articles", () => {
    const dates = new Map([["fr:recent", new Date("2026-05-15T00:00:00Z")]]);
    const alerts = detectStaleViralArticles(
      [
        {
          slug: "recent",
          locale: "fr",
          pageviewsLast30d: 500,
          pageviewsLast7d: 200,
          pageviewsPrev7d: 50,
          deltaPct: 300,
          scrollDepth75Pct: 0.4,
        },
      ],
      dates,
      now,
    );
    expect(alerts).toHaveLength(0);
  });
});

describe("readMatomoEnv", () => {
  it("returns trimmed env when all keys are present", () => {
    expect(
      readMatomoEnv({
        MATOMO_API_URL: "  https://matomo.example/  ",
        MATOMO_AUTH_TOKEN: " token ",
        MATOMO_SITE_ID: " 42 ",
      }),
    ).toEqual({
      apiUrl: "https://matomo.example/",
      authToken: "token",
      siteId: "42",
    });
  });

  it("throws when any required env var is missing", () => {
    expect(() => readMatomoEnv({ MATOMO_API_URL: "x" })).toThrow(
      /MATOMO_AUTH_TOKEN.*MATOMO_SITE_ID/,
    );
  });

  it("treats whitespace-only values as missing", () => {
    expect(() =>
      readMatomoEnv({
        MATOMO_API_URL: "   ",
        MATOMO_AUTH_TOKEN: "t",
        MATOMO_SITE_ID: "1",
      }),
    ).toThrow(/MATOMO_API_URL/);
  });
});

describe("formatMatomoDate", () => {
  it("formats a UTC date in YYYY-MM-DD", () => {
    expect(formatMatomoDate(new Date("2026-05-21T13:43:54Z"))).toBe("2026-05-21");
  });

  it("zero-pads single-digit months and days", () => {
    expect(formatMatomoDate(new Date("2026-03-05T00:00:00Z"))).toBe("2026-03-05");
  });
});

describe("computeMatomoDateRanges", () => {
  it("computes inclusive last30 / last7 / previous7 ranges anchored on today UTC", () => {
    const ranges = computeMatomoDateRanges(new Date("2026-05-21T13:43:54Z"));
    expect(ranges.last30).toBe("2026-04-22,2026-05-21");
    expect(ranges.last7).toBe("2026-05-15,2026-05-21");
    expect(ranges.previous7).toBe("2026-05-08,2026-05-14");
  });

  it("handles month boundaries", () => {
    const ranges = computeMatomoDateRanges(new Date("2026-03-05T00:00:00Z"));
    expect(ranges.last7).toBe("2026-02-27,2026-03-05");
  });
});

describe("buildPageUrlsRequest", () => {
  it("includes required Matomo params in the URL without leaking the token", () => {
    const { url, body } = buildPageUrlsRequest(
      { apiUrl: "https://matomo.example/", authToken: "TOK", siteId: "12" },
      "last30",
    );
    expect(url).toMatch(/^https:\/\/matomo\.example\/index\.php\?/);
    expect(url).toContain("method=Actions.getPageUrls");
    expect(url).toContain("idSite=12");
    expect(url).toContain("date=last30");
    expect(url).toContain("flat=1");
    // Le token ne doit JAMAIS apparaitre dans l'URL (fuite logs/referer + 401
    // Matomo "secure requests only"). Il passe dans le corps POST.
    expect(url).not.toContain("token_auth");
    expect(body.get("token_auth")).toBe("TOK");
  });
});

describe("buildScrollDepthRequest", () => {
  it("includes Events.getName method and scroll-depth segment, token in body", () => {
    const { url, body } = buildScrollDepthRequest(
      {
        apiUrl: "https://matomo.example/",
        authToken: "TOK",
        siteId: "12",
      },
      "2026-04-22,2026-05-21",
    );
    expect(url).toContain("method=Events.getName");
    expect(url).toContain("date=2026-04-22%2C2026-05-21");
    expect(decodeURIComponent(url)).toContain(
      "segment=eventCategory==engagement;eventAction==scroll_depth;eventName==75",
    );
    expect(url).not.toContain("token_auth");
    expect(body.get("token_auth")).toBe("TOK");
  });
});

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function req(url: string, token = "TOK") {
  return { url, body: new URLSearchParams({ token_auth: token }) };
}

describe("fetchMatomoJson", () => {
  it("returns parsed JSON on 200", async () => {
    const fetchFn = vi.fn(async () => jsonResponse([{ a: 1 }]));
    const result = await fetchMatomoJson<unknown[]>(req("https://x"), "test", { fetchFn });
    expect(result).toEqual([{ a: 1 }]);
    expect(fetchFn).toHaveBeenCalledTimes(1);
  });

  it("issues a POST request carrying token_auth in the body, not the URL", async () => {
    const fetchFn = vi.fn(async () => jsonResponse([]));
    await fetchMatomoJson(req("https://matomo.example/index.php?method=X", "SECRET"), "post", {
      fetchFn,
    });
    const [calledUrl, init] = fetchFn.mock.calls[0] as unknown as [string, RequestInit];
    expect(calledUrl).toBe("https://matomo.example/index.php?method=X");
    expect(calledUrl).not.toContain("token_auth");
    expect(init.method).toBe("POST");
    expect(init.body).toBeInstanceOf(URLSearchParams);
    expect((init.body as URLSearchParams).get("token_auth")).toBe("SECRET");
  });

  it("retries once on HTTP 5xx then succeeds", async () => {
    const fetchFn = vi
      .fn()
      .mockResolvedValueOnce(new Response("", { status: 503 }))
      .mockResolvedValueOnce(jsonResponse([{ ok: true }]));
    const sleepFn = vi.fn(async () => undefined);
    const result = await fetchMatomoJson(req("https://x"), "retry-ok", { fetchFn, sleepFn });
    expect(result).toEqual([{ ok: true }]);
    expect(fetchFn).toHaveBeenCalledTimes(2);
    expect(sleepFn).toHaveBeenCalledWith(SERVER_ERROR_RETRY_DELAY_MS);
  });

  it("throws after retry exhausted on persistent 5xx", async () => {
    const fetchFn = vi.fn(async () => new Response("", { status: 502 }));
    const sleepFn = vi.fn(async () => undefined);
    await expect(
      fetchMatomoJson(req("https://x"), "retry-fail", { fetchFn, sleepFn }),
    ).rejects.toThrow(/HTTP 502/);
    expect(fetchFn).toHaveBeenCalledTimes(2);
  });

  it("aborts immediately on HTTP 4xx without retry", async () => {
    const fetchFn = vi.fn(async () => new Response("", { status: 401 }));
    const sleepFn = vi.fn(async () => undefined);
    await expect(
      fetchMatomoJson(req("https://x"), "auth", { fetchFn, sleepFn }),
    ).rejects.toThrow(/HTTP 401/);
    expect(fetchFn).toHaveBeenCalledTimes(1);
    expect(sleepFn).not.toHaveBeenCalled();
  });

  it("surfaces the Matomo error message on an authentication failure", async () => {
    const fetchFn = vi.fn(
      async () =>
        new Response(
          JSON.stringify({
            result: "error",
            message:
              "Unable to authenticate with the provided token. It is either invalid, expired or is required to be sent as a POST parameter.",
          }),
          { status: 401, headers: { "Content-Type": "application/json" } },
        ),
    );
    const sleepFn = vi.fn(async () => undefined);
    await expect(
      fetchMatomoJson(req("https://x"), "auth-detail", { fetchFn, sleepFn }),
    ).rejects.toThrow(/HTTP 401.*required to be sent as a POST parameter/);
  });

  it("falls back to the raw error body when it is not JSON", async () => {
    const fetchFn = vi.fn(
      async () => new Response("<html>503 Service Unavailable</html>", { status: 403 }),
    );
    const sleepFn = vi.fn(async () => undefined);
    await expect(
      fetchMatomoJson(req("https://x"), "html-err", { fetchFn, sleepFn }),
    ).rejects.toThrow(/HTTP 403.*503 Service Unavailable/);
  });

  it("throws on malformed JSON body", async () => {
    const fetchFn = vi.fn(
      async () =>
        new Response("not-json", {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
    );
    await expect(
      fetchMatomoJson(req("https://x"), "json", { fetchFn }),
    ).rejects.toThrow(/malformed JSON/);
  });

  it("wraps network errors with context", async () => {
    const fetchFn = vi.fn(async () => {
      throw new Error("ECONNREFUSED");
    });
    await expect(
      fetchMatomoJson(req("https://x"), "net", { fetchFn }),
    ).rejects.toThrow(/network or timeout error: ECONNREFUSED/);
  });

  it("uses the global timeout constant", () => {
    expect(REQUEST_TIMEOUT_MS).toBeGreaterThanOrEqual(5_000);
  });
});

describe("collectArticleDates", () => {
  let tmpRoot: string;

  afterEach(() => {
    if (tmpRoot) fs.rmSync(tmpRoot, { recursive: true, force: true });
  });

  it("reads dateModified (or fallback datePublished) from MDX frontmatter", () => {
    tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), "stats-"));
    const frDir = path.join(tmpRoot, "content", "fr");
    fs.mkdirSync(frDir, { recursive: true });
    fs.writeFileSync(
      path.join(frDir, "article-a.mdx"),
      `---\ntitle: A\ndescription: d\ndateModified: "2026-03-01"\n---\nbody\n`,
    );
    fs.writeFileSync(
      path.join(frDir, "article-b.mdx"),
      `---\ntitle: B\ndescription: d\ndatePublished: "2026-02-15"\n---\nbody\n`,
    );
    fs.writeFileSync(
      path.join(frDir, "article-c.mdx"),
      `---\ntitle: C\ndescription: d\n---\nno date here\n`,
    );

    const map = collectArticleDates(tmpRoot);
    expect(map.get("fr:article-a")?.toISOString()).toBe("2026-03-01T00:00:00.000Z");
    expect(map.get("fr:article-b")?.toISOString()).toBe("2026-02-15T00:00:00.000Z");
    expect(map.has("fr:article-c")).toBe(false);
  });

  it("returns empty map when content dir is absent", () => {
    tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), "stats-empty-"));
    const map = collectArticleDates(tmpRoot);
    expect(map.size).toBe(0);
  });
});

describe("runRefresh (integration with mocked fetch)", () => {
  it("writes a valid ArticleStatsFile to the configured output path", async () => {
    const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), "stats-run-"));
    try {
      const fetchFn = vi.fn(async (input: RequestInfo | URL) => {
        const url = typeof input === "string" ? input : input.toString();
        if (url.includes("Events.getName")) {
          return jsonResponse([
            { Events_EventUrl: "/fr/content/foo/", nb_events: 25 },
          ]);
        }
        // For now=2026-05-21, ranges are:
        //   last30   = 2026-04-22,2026-05-21
        //   last7    = 2026-05-15,2026-05-21
        //   previous7= 2026-05-08,2026-05-14
        if (url.includes("2026-04-22")) {
          return jsonResponse([{ url: "/fr/content/foo/", nb_visits: 100 }]);
        }
        if (url.includes("2026-05-15")) {
          return jsonResponse([{ url: "/fr/content/foo/", nb_visits: 40 }]);
        }
        return jsonResponse([{ url: "/fr/content/foo/", nb_visits: 20 }]);
      });
      const writes: Array<{ path: string; contents: string }> = [];

      const result = await runRefresh({
        env: {
          MATOMO_API_URL: "https://matomo.example/",
          MATOMO_AUTH_TOKEN: "TOK",
          MATOMO_SITE_ID: "1",
        },
        fetchFn: fetchFn as unknown as typeof globalThis.fetch,
        sleepFn: async () => undefined,
        now: new Date("2026-05-21T00:00:00Z"),
        repoRoot: tmpRoot,
        writeFile: (p, c) => writes.push({ path: p, contents: c }),
      });

      expect(result.file.source).toBe("matomo");
      expect(result.file.matomoPeriodDays).toBe(30);
      expect(result.file.generatedAt).toBe("2026-05-21T00:00:00.000Z");
      expect(result.file.articles).toHaveLength(1);
      const article = result.file.articles[0]!;
      expect(article).toMatchObject({
        slug: "foo",
        locale: "fr",
        pageviewsLast30d: 100,
        pageviewsLast7d: 40,
        pageviewsPrev7d: 20,
        deltaPct: 100,
      });
      expect(article.scrollDepth75Pct).toBeCloseTo(0.25, 5);
      expect(writes).toHaveLength(1);
      expect(writes[0]?.path).toMatch(/article-stats\.json$/);
      expect(writes[0]?.contents.endsWith("\n")).toBe(true);
    } finally {
      fs.rmSync(tmpRoot, { recursive: true, force: true });
    }
  });

  it("still writes data when scroll-depth fetch fails", async () => {
    const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), "stats-run-"));
    try {
      const fetchFn = vi.fn(async (input: RequestInfo | URL) => {
        const url = typeof input === "string" ? input : input.toString();
        if (url.includes("Events.getName")) {
          return new Response("", { status: 401 });
        }
        return jsonResponse([{ url: "/en/content/bar/", nb_visits: 10 }]);
      });
      const writes: Array<{ path: string; contents: string }> = [];
      const result = await runRefresh({
        env: {
          MATOMO_API_URL: "https://matomo.example/",
          MATOMO_AUTH_TOKEN: "TOK",
          MATOMO_SITE_ID: "1",
        },
        fetchFn: fetchFn as unknown as typeof globalThis.fetch,
        sleepFn: async () => undefined,
        now: new Date("2026-05-21T00:00:00Z"),
        repoRoot: tmpRoot,
        writeFile: (p, c) => writes.push({ path: p, contents: c }),
      });
      expect(result.file.articles[0]?.scrollDepth75Pct).toBe(0);
      expect(writes).toHaveLength(1);
    } finally {
      fs.rmSync(tmpRoot, { recursive: true, force: true });
    }
  });

  it("propagates env errors without writing", async () => {
    const writes: string[] = [];
    await expect(
      runRefresh({
        env: {},
        writeFile: (p) => writes.push(p),
      }),
    ).rejects.toThrow(/Missing environment variables/);
    expect(writes).toHaveLength(0);
  });
});
