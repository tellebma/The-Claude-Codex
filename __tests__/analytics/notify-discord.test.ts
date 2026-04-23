import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  notifyDiscord,
  type DiscordEmbed,
} from "../../scripts/analytics/notify-discord.ts";

const sampleEmbed: DiscordEmbed = {
  title: "Test report",
  description: "hello",
  color: 0x123456,
  fields: [{ name: "k", value: "v", inline: true }],
};

describe("notifyDiscord", () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    globalThis.fetch = vi.fn().mockResolvedValue(
      new Response(null, { status: 204 }),
    );
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("rejects webhook URLs that do not match Discord's hostname", async () => {
    await expect(
      notifyDiscord("https://example.com/api/webhook", sampleEmbed),
    ).rejects.toThrow("discord.com webhook endpoint");
  });

  it("posts JSON payload with a single embed", async () => {
    await notifyDiscord("https://discord.com/api/webhooks/1/abc", sampleEmbed);
    const fetchMock = globalThis.fetch as unknown as ReturnType<typeof vi.fn>;
    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("https://discord.com/api/webhooks/1/abc");
    expect(init.method).toBe("POST");
    const body = JSON.parse(init.body as string) as {
      username: string;
      embeds: readonly DiscordEmbed[];
    };
    expect(body.username).toBe("Claude Codex Analytics");
    expect(body.embeds).toHaveLength(1);
    expect(body.embeds[0].title).toBe("Test report");
    expect(body.embeds[0].color).toBe(0x123456);
  });

  it("truncates oversized description", async () => {
    const huge: DiscordEmbed = {
      title: "x",
      description: "a".repeat(5000),
    };
    await notifyDiscord("https://discord.com/api/webhooks/1/abc", huge);
    const fetchMock = globalThis.fetch as unknown as ReturnType<typeof vi.fn>;
    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    const body = JSON.parse(init.body as string) as {
      embeds: readonly DiscordEmbed[];
    };
    const desc = body.embeds[0].description ?? "";
    expect(desc.length).toBeLessThanOrEqual(4096);
    expect(desc.endsWith("[trunc]")).toBe(true);
  });

  it("truncates oversized field values", async () => {
    const embed: DiscordEmbed = {
      title: "x",
      fields: [{ name: "big", value: "b".repeat(2000) }],
    };
    await notifyDiscord("https://discord.com/api/webhooks/1/abc", embed);
    const fetchMock = globalThis.fetch as unknown as ReturnType<typeof vi.fn>;
    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    const body = JSON.parse(init.body as string) as {
      embeds: readonly DiscordEmbed[];
    };
    const value = body.embeds[0].fields?.[0]?.value ?? "";
    expect(value.length).toBeLessThanOrEqual(1024);
    expect(value.endsWith("[trunc]")).toBe(true);
  });

  it("throws when the webhook responds with a non-2xx status", async () => {
    globalThis.fetch = vi
      .fn()
      .mockResolvedValue(new Response("bad token", { status: 401 }));
    await expect(
      notifyDiscord("https://discord.com/api/webhooks/1/abc", sampleEmbed),
    ).rejects.toThrow(/401/);
  });
});
