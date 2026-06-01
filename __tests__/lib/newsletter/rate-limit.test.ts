import { describe, it, expect, beforeEach } from "vitest";
import {
  remainingCooldownMs,
  markSubmitted,
  RATE_LIMIT_KEY,
  RATE_LIMIT_WINDOW_MS,
} from "@/lib/newsletter/rate-limit";

describe("rate-limit", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("allows submission when nothing stored", () => {
    expect(remainingCooldownMs(1_000)).toBe(0);
  });

  it("returns remaining window right after a submit", () => {
    markSubmitted(1_000);
    expect(remainingCooldownMs(1_000)).toBe(RATE_LIMIT_WINDOW_MS);
  });

  it("decreases as time passes", () => {
    markSubmitted(0);
    expect(remainingCooldownMs(10_000)).toBe(RATE_LIMIT_WINDOW_MS - 10_000);
  });

  it("allows again once the window elapsed", () => {
    markSubmitted(0);
    expect(remainingCooldownMs(RATE_LIMIT_WINDOW_MS)).toBe(0);
    expect(remainingCooldownMs(RATE_LIMIT_WINDOW_MS + 5_000)).toBe(0);
  });

  it("ignores a corrupted stored value", () => {
    window.localStorage.setItem(RATE_LIMIT_KEY, "not-a-number");
    expect(remainingCooldownMs(1_000)).toBe(0);
  });
});
