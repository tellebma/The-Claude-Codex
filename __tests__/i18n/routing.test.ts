import { describe, it, expect } from "vitest";
import { routing } from "../../src/i18n/routing";

describe("i18n/routing", () => {
  it("exposes locales matching the project config", () => {
    expect(routing.locales).toContain("fr");
    expect(routing.locales).toContain("en");
  });

  it("has a defined defaultLocale", () => {
    expect(routing.defaultLocale).toBe("fr");
  });

  it("defaultLocale is one of the declared locales", () => {
    expect(routing.locales).toContain(routing.defaultLocale);
  });
});
