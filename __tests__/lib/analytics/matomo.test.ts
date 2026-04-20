import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { pushMatomoCommand, trackEvent } from "@/lib/analytics/matomo";

describe("matomo helpers", () => {
  beforeEach(() => {
    (window as unknown as { _paq: unknown[] })._paq = [];
  });

  afterEach(() => {
    delete (window as unknown as { _paq?: unknown[] })._paq;
  });

  it("pushes raw commands when _paq is a valid array", () => {
    pushMatomoCommand(["setUserId", "anon"]);
    const paq = (window as unknown as { _paq: unknown[][] })._paq;
    expect(paq).toHaveLength(1);
    expect(paq[0]).toEqual(["setUserId", "anon"]);
  });

  it("is a no-op when _paq is missing", () => {
    delete (window as unknown as { _paq?: unknown[] })._paq;
    expect(() => pushMatomoCommand(["foo"])).not.toThrow();
  });

  it("is a no-op when _paq is not an array", () => {
    (window as unknown as { _paq: unknown })._paq = { push: () => {} };
    expect(() => pushMatomoCommand(["foo"])).not.toThrow();
  });

  it("trackEvent sends trackEvent with category and action", () => {
    trackEvent("engagement", "scroll_depth");
    const paq = (window as unknown as { _paq: unknown[][] })._paq;
    expect(paq[0]).toEqual(["trackEvent", "engagement", "scroll_depth"]);
  });

  it("trackEvent adds label and value when provided", () => {
    trackEvent("engagement", "scroll_depth", "50", 50);
    const paq = (window as unknown as { _paq: unknown[][] })._paq;
    expect(paq[0]).toEqual([
      "trackEvent",
      "engagement",
      "scroll_depth",
      "50",
      50,
    ]);
  });
});
