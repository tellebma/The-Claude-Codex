import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { subscribeEmail } from "@/lib/newsletter/subscribe";

const URL_KEY = "NEXT_PUBLIC_SUPABASE_URL";
const ANON_KEY = "NEXT_PUBLIC_SUPABASE_ANON_KEY";

function configure() {
  process.env[URL_KEY] = "https://proj.supabase.co";
  process.env[ANON_KEY] = "anon-key";
}

function fetchReturning(status: number): typeof fetch {
  return vi.fn(async () =>
    new Response(null, { status }),
  ) as unknown as typeof fetch;
}

beforeEach(() => {
  window.localStorage.clear();
});

afterEach(() => {
  delete process.env[URL_KEY];
  delete process.env[ANON_KEY];
  vi.restoreAllMocks();
});

describe("subscribeEmail", () => {
  it("treats a filled honeypot as silent success without calling fetch", async () => {
    configure();
    const fetchImpl = fetchReturning(201);
    const result = await subscribeEmail(
      { email: "bot@x.com", honeypot: "I am a bot" },
      { fetchImpl, now: 1_000 },
    );
    expect(result.outcome).toBe("success");
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("rejects an invalid email before any network call", async () => {
    configure();
    const fetchImpl = fetchReturning(201);
    const result = await subscribeEmail(
      { email: "not-an-email" },
      { fetchImpl, now: 1_000 },
    );
    expect(result.outcome).toBe("invalid_email");
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("returns rate_limited when within the cooldown window", async () => {
    configure();
    const fetchImpl = fetchReturning(201);
    await subscribeEmail({ email: "a@x.com" }, { fetchImpl, now: 0 });
    const second = await subscribeEmail(
      { email: "b@x.com" },
      { fetchImpl, now: 5_000 },
    );
    expect(second.outcome).toBe("rate_limited");
    expect(second.retryAfterMs).toBeGreaterThan(0);
  });

  it("returns not_configured when env vars are missing", async () => {
    const fetchImpl = fetchReturning(201);
    const result = await subscribeEmail(
      { email: "a@x.com" },
      { fetchImpl, now: 1_000 },
    );
    expect(result.outcome).toBe("not_configured");
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("posts to the PostgREST endpoint with anon headers on success", async () => {
    configure();
    const fetchImpl = fetchReturning(201);
    const result = await subscribeEmail(
      { email: "  New@Example.com ", source: "footer" },
      { fetchImpl, now: 1_000 },
    );
    expect(result.outcome).toBe("success");
    expect(fetchImpl).toHaveBeenCalledTimes(1);
    const [url, init] = (fetchImpl as unknown as ReturnType<typeof vi.fn>).mock
      .calls[0];
    expect(url).toBe(
      "https://proj.supabase.co/rest/v1/newsletter_subscribers",
    );
    expect(init.method).toBe("POST");
    expect(init.headers.apikey).toBe("anon-key");
    expect(init.headers.Authorization).toBe("Bearer anon-key");
    const body = JSON.parse(init.body);
    expect(body).toEqual({ email: "new@example.com", source: "footer" });
  });

  it("maps a 409 conflict to already_subscribed", async () => {
    configure();
    const result = await subscribeEmail(
      { email: "dup@x.com" },
      { fetchImpl: fetchReturning(409), now: 1_000 },
    );
    expect(result.outcome).toBe("already_subscribed");
  });

  it("maps other non-ok statuses to error", async () => {
    configure();
    const result = await subscribeEmail(
      { email: "a@x.com" },
      { fetchImpl: fetchReturning(500), now: 1_000 },
    );
    expect(result.outcome).toBe("error");
  });

  it("maps a thrown fetch to error", async () => {
    configure();
    const fetchImpl = vi.fn(async () => {
      throw new Error("network down");
    }) as unknown as typeof fetch;
    const result = await subscribeEmail(
      { email: "a@x.com" },
      { fetchImpl, now: 1_000 },
    );
    expect(result.outcome).toBe("error");
  });

  it("defaults source to 'site' when omitted", async () => {
    configure();
    const fetchImpl = fetchReturning(201);
    await subscribeEmail({ email: "a@x.com" }, { fetchImpl, now: 1_000 });
    const [, init] = (fetchImpl as unknown as ReturnType<typeof vi.fn>).mock
      .calls[0];
    expect(JSON.parse(init.body).source).toBe("site");
  });
});
