import { afterEach, describe, expect, it } from "vitest";

import { computeDateRange, loadConfig } from "../../scripts/analytics/config.ts";

describe("computeDateRange", () => {
  it("returns a window that ends 3 days before today and covers periodDays", () => {
    const today = new Date("2026-04-22T12:00:00Z");
    const range = computeDateRange(7, today);
    expect(range.endDate).toBe("2026-04-19");
    expect(range.startDate).toBe("2026-04-13");
  });

  it("handles custom period lengths", () => {
    const today = new Date("2026-04-22T12:00:00Z");
    const range = computeDateRange(30, today);
    expect(range.endDate).toBe("2026-04-19");
    expect(range.startDate).toBe("2026-03-21");
  });
});

describe("loadConfig", () => {
  const originalEnv = { ...process.env };

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it("throws when a required secret is missing", () => {
    delete process.env.GSC_SERVICE_ACCOUNT_JSON;
    delete process.env.MATOMO_SITE_ID;
    delete process.env.MATOMO_TOKEN_AUTH;
    expect(() => loadConfig()).toThrow(/Missing required env var/);
  });

  it("reads all required fields and applies sensible defaults", () => {
    process.env.GSC_SERVICE_ACCOUNT_JSON = "{}";
    process.env.MATOMO_SITE_ID = "42";
    process.env.MATOMO_TOKEN_AUTH = "deadbeef";
    delete process.env.DISCORD_WEBHOOK_URL;
    const config = loadConfig();
    expect(config.gscSiteUrl).toBe("sc-domain:claude-codex.fr");
    expect(config.matomoBaseUrl).toBe("https://matomo.tellebma.fr");
    expect(config.matomoSiteId).toBe("42");
    expect(config.discordWebhookUrl).toBeNull();
    expect(config.periodDays).toBe(7);
  });

  it("rejects a negative ANALYTICS_PERIOD_DAYS", () => {
    process.env.GSC_SERVICE_ACCOUNT_JSON = "{}";
    process.env.MATOMO_SITE_ID = "1";
    process.env.MATOMO_TOKEN_AUTH = "x";
    process.env.ANALYTICS_PERIOD_DAYS = "-1";
    expect(() => loadConfig()).toThrow(/Invalid ANALYTICS_PERIOD_DAYS/);
  });

  it("accepts Discord webhook when provided", () => {
    process.env.GSC_SERVICE_ACCOUNT_JSON = "{}";
    process.env.MATOMO_SITE_ID = "1";
    process.env.MATOMO_TOKEN_AUTH = "x";
    process.env.DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1/abc";
    const config = loadConfig();
    expect(config.discordWebhookUrl).toBe("https://discord.com/api/webhooks/1/abc");
  });
});
