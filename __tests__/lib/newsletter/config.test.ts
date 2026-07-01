import { describe, it, expect, afterEach } from "vitest";
import {
  getNewsletterConfig,
  isNewsletterConfigured,
  NEWSLETTER_TABLE,
} from "@/lib/newsletter/config";

const URL_KEY = "NEXT_PUBLIC_SUPABASE_URL";
const ANON_KEY = "NEXT_PUBLIC_SUPABASE_ANON_KEY";

afterEach(() => {
  delete process.env[URL_KEY];
  delete process.env[ANON_KEY];
});

describe("getNewsletterConfig", () => {
  it("returns null when both vars are missing", () => {
    expect(getNewsletterConfig()).toBeNull();
    expect(isNewsletterConfigured()).toBe(false);
  });

  it("returns null when only the URL is set", () => {
    process.env[URL_KEY] = "https://x.supabase.co";
    expect(getNewsletterConfig()).toBeNull();
  });

  it("returns trimmed config when both vars are set", () => {
    process.env[URL_KEY] = "  https://x.supabase.co  ";
    process.env[ANON_KEY] = "  anon-key  ";
    expect(getNewsletterConfig()).toEqual({
      url: "https://x.supabase.co",
      anonKey: "anon-key",
    });
    expect(isNewsletterConfigured()).toBe(true);
  });

  it("exposes the target table name", () => {
    expect(NEWSLETTER_TABLE).toBe("newsletter_subscribers");
  });
});
