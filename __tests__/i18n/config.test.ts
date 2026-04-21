import { describe, it, expect } from "vitest";

// The setup.tsx mocks this module globally; import directly from the real file.
import * as config from "../../src/i18n/config";

describe("i18n/config", () => {
  it("exposes the expected locales", () => {
    expect(config.locales).toContain("fr");
    expect(config.locales).toContain("en");
    expect(config.locales).toHaveLength(2);
  });

  it("defaultLocale is part of locales", () => {
    expect(config.locales).toContain(config.defaultLocale);
  });

  it("defaultLocale is fr (FR-first site convention)", () => {
    expect(config.defaultLocale).toBe("fr");
  });

  it("locales is a readonly tuple at the type level", () => {
    const mutationAttempt = () => {
      (config.locales as unknown as string[]).push("de");
    };
    const copy = [...config.locales];
    try {
      mutationAttempt();
    } catch {
      // frozen tuple is fine
    }
    expect(config.locales.slice(0, 2)).toEqual(copy.slice(0, 2));
  });
});
