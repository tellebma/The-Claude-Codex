import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { notifyDiscord } from "../../scripts/analytics/notify-discord.ts";

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
      notifyDiscord("https://example.com/api/webhook", "hi"),
    ).rejects.toThrow(/discord\.com/);
  });

  it("posts JSON to the webhook endpoint with the given content", async () => {
    await notifyDiscord(
      "https://discord.com/api/webhooks/1/abc",
      "hello world",
    );
    const fetchMock = globalThis.fetch as unknown as ReturnType<typeof vi.fn>;
    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("https://discord.com/api/webhooks/1/abc");
    expect(init.method).toBe("POST");
    const body = JSON.parse(init.body as string) as { content: string; username: string };
    expect(body.content).toBe("hello world");
    expect(body.username).toBe("Claude Codex Analytics");
  });

  it("truncates oversized content", async () => {
    const huge = "a".repeat(5000);
    await notifyDiscord("https://discord.com/api/webhooks/1/abc", huge);
    const fetchMock = globalThis.fetch as unknown as ReturnType<typeof vi.fn>;
    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    const body = JSON.parse(init.body as string) as { content: string };
    expect(body.content.length).toBeLessThan(2000);
    expect(body.content.endsWith("[truncated]")).toBe(true);
  });

  it("throws when the webhook responds with a non-2xx status", async () => {
    globalThis.fetch = vi
      .fn()
      .mockResolvedValue(new Response("bad token", { status: 401 }));
    await expect(
      notifyDiscord("https://discord.com/api/webhooks/1/abc", "hi"),
    ).rejects.toThrow(/401/);
  });
});
