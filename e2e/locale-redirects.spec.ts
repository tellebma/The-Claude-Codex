import { test, expect } from "@playwright/test";

/**
 * These tests only make sense against a production build served by Vercel
 * (or any reverse proxy that honours vercel.json redirects). In `npm run dev`
 * with Next.js output:'export', redirects are not applied — so the tests
 * skip unless VERCEL_PREVIEW_URL is set.
 *
 * Usage:
 *   VERCEL_PREVIEW_URL=https://the-claude-codex.vercel.app npx playwright test locale-redirects
 */
const BASE = process.env.VERCEL_PREVIEW_URL || process.env.PLAYWRIGHT_BASE_URL;

test.describe("Vercel URL redirects (production only)", () => {
  test.skip(
    !BASE || BASE.includes("localhost"),
    "requires VERCEL_PREVIEW_URL pointing to a deployed build",
  );

  test("root redirects to /fr/", async ({ request }) => {
    const res = await request.get(`${BASE}/`, { maxRedirects: 0 });
    expect([301, 307, 308]).toContain(res.status());
    expect(res.headers().location).toMatch(/\/fr\/?$/);
  });

  test("locale-less URL /content/<slug>/ redirects to /fr/content/<slug>/", async ({
    request,
  }) => {
    const res = await request.get(`${BASE}/content/prompting-guide/`, {
      maxRedirects: 0,
    });
    expect([301, 307, 308]).toContain(res.status());
    expect(res.headers().location).toMatch(/\/fr\/content\/prompting-guide\/?$/);
  });

  test("locale-less URL /mcp/ redirects to /fr/mcp/", async ({ request }) => {
    const res = await request.get(`${BASE}/mcp/`, { maxRedirects: 0 });
    expect([301, 307, 308]).toContain(res.status());
    expect(res.headers().location).toMatch(/\/fr\/mcp\/?$/);
  });

  test("/fr/ URLs are NOT redirected", async ({ request }) => {
    const res = await request.get(`${BASE}/fr/`, { maxRedirects: 0 });
    expect(res.status()).toBe(200);
  });

  test("/en/ URLs are NOT redirected", async ({ request }) => {
    const res = await request.get(`${BASE}/en/`, { maxRedirects: 0 });
    expect(res.status()).toBe(200);
  });

  test("MT1: /en/content/bonnes-pratiques-securite redirects to new slug", async ({
    request,
  }) => {
    const res = await request.get(
      `${BASE}/en/content/bonnes-pratiques-securite/`,
      { maxRedirects: 0 },
    );
    expect([301, 307, 308]).toContain(res.status());
    expect(res.headers().location).toMatch(
      /\/en\/content\/security-best-practices\/?$/,
    );
  });

  test("MT1: /en/content/mythes-claude-code redirects to new slug", async ({
    request,
  }) => {
    const res = await request.get(
      `${BASE}/en/content/mythes-claude-code/`,
      { maxRedirects: 0 },
    );
    expect([301, 307, 308]).toContain(res.status());
    expect(res.headers().location).toMatch(
      /\/en\/content\/claude-code-myths\/?$/,
    );
  });

  test("MT1: /en/mcp/securite-mcp redirects to new slug", async ({
    request,
  }) => {
    const res = await request.get(`${BASE}/en/mcp/securite-mcp/`, {
      maxRedirects: 0,
    });
    expect([301, 307, 308]).toContain(res.status());
    expect(res.headers().location).toMatch(/\/en\/mcp\/mcp-security\/?$/);
  });

  test("static assets (_next/) are NOT redirected", async ({ request }) => {
    const res = await request.get(`${BASE}/_next/static/chunks/doesnotexist.js`, {
      maxRedirects: 0,
    });
    // 404 is fine; what we check is that it's NOT a redirect
    expect([200, 404]).toContain(res.status());
  });

  test("favicon / robots / sitemap are NOT redirected", async ({ request }) => {
    for (const path of ["/favicon.ico", "/robots.txt", "/sitemap.xml"]) {
      const res = await request.get(`${BASE}${path}`, { maxRedirects: 0 });
      expect([200, 404]).toContain(res.status());
    }
  });

  test("CSP header is served on HTML responses", async ({ request }) => {
    const res = await request.get(`${BASE}/fr/`);
    expect(res.status()).toBe(200);
    const csp = res.headers()["content-security-policy"];
    expect(csp).toBeDefined();
    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain("matomo.tellebma.fr");
  });

  test("security headers are present", async ({ request }) => {
    const res = await request.get(`${BASE}/fr/`);
    const h = res.headers();
    expect(h["x-frame-options"]).toBe("SAMEORIGIN");
    expect(h["x-content-type-options"]).toBe("nosniff");
    expect(h["referrer-policy"]).toBe("strict-origin-when-cross-origin");
    expect(h["strict-transport-security"]).toMatch(/max-age=\d+/);
    expect(h["permissions-policy"]).toContain("camera=()");
  });
});
