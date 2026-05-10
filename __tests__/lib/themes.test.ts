import { describe, it, expect } from "vitest";
import {
  THEME_REGISTRY,
  ALL_THEME_KEYS,
  isThemeKey,
  getTheme,
  validateThemes,
} from "@/lib/themes";

describe("themes registry", () => {
  it("registers exactly 12 keys (5 content types + 7 domains)", () => {
    expect(ALL_THEME_KEYS).toHaveLength(12);
    const types = ALL_THEME_KEYS.filter(
      (k) => THEME_REGISTRY[k].kind === "type"
    );
    const domains = ALL_THEME_KEYS.filter(
      (k) => THEME_REGISTRY[k].kind === "domain"
    );
    expect(types).toHaveLength(5);
    expect(domains).toHaveLength(7);
  });

  it("each entry has a color (CSS var) and an icon", () => {
    for (const key of ALL_THEME_KEYS) {
      const meta = THEME_REGISTRY[key];
      expect(meta.color).toMatch(/^var\(--/);
      expect(meta.icon).toBeDefined();
    }
  });

  it("all 5 content types are present", () => {
    expect(ALL_THEME_KEYS).toContain("tutorial");
    expect(ALL_THEME_KEYS).toContain("guide");
    expect(ALL_THEME_KEYS).toContain("reference");
    expect(ALL_THEME_KEYS).toContain("comparison");
    expect(ALL_THEME_KEYS).toContain("use-case");
  });

  it("all 7 domains are present", () => {
    expect(ALL_THEME_KEYS).toContain("security");
    expect(ALL_THEME_KEYS).toContain("devsecops");
    expect(ALL_THEME_KEYS).toContain("architecture");
    expect(ALL_THEME_KEYS).toContain("performance");
    expect(ALL_THEME_KEYS).toContain("tooling");
    expect(ALL_THEME_KEYS).toContain("productivity");
    expect(ALL_THEME_KEYS).toContain("migration");
  });

  it("devsecops uses the dedicated --theme-devsecops token", () => {
    expect(THEME_REGISTRY["devsecops"].color).toBe("var(--theme-devsecops)");
  });
});

describe("isThemeKey", () => {
  it("returns true for known keys", () => {
    expect(isThemeKey("tutorial")).toBe(true);
    expect(isThemeKey("security")).toBe(true);
  });

  it("returns false for unknown strings", () => {
    expect(isThemeKey("unknown")).toBe(false);
    expect(isThemeKey("Tutorial")).toBe(false); // case sensitive
  });

  it("returns false for non-string values", () => {
    expect(isThemeKey(undefined)).toBe(false);
    expect(isThemeKey(null)).toBe(false);
    expect(isThemeKey(42)).toBe(false);
    expect(isThemeKey({ key: "tutorial" })).toBe(false);
    expect(isThemeKey([])).toBe(false);
  });
});

describe("getTheme", () => {
  it("returns the meta for a known key", () => {
    const meta = getTheme("tutorial");
    expect(meta.kind).toBe("type");
    expect(meta.color).toBe("var(--fg-secondary)");
  });
});

describe("validateThemes", () => {
  const slug = "test-article";

  it("returns null when raw is undefined", () => {
    expect(validateThemes(undefined, slug)).toBeNull();
  });

  it("returns null when raw is null", () => {
    expect(validateThemes(null, slug)).toBeNull();
  });

  it("returns null when raw is an empty array", () => {
    expect(validateThemes([], slug)).toBeNull();
  });

  it("throws when raw is not an array", () => {
    expect(() => validateThemes("tutorial", slug)).toThrow(/must be an array/);
    expect(() => validateThemes({ key: "tutorial" }, slug)).toThrow(
      /must be an array/
    );
    expect(() => validateThemes(42, slug)).toThrow(/must be an array/);
  });

  it("throws when raw contains more than 3 entries", () => {
    expect(() =>
      validateThemes(
        ["tutorial", "security", "performance", "tooling"],
        slug
      )
    ).toThrow(/at most 3 entries/);
  });

  it("throws when raw contains an unknown key", () => {
    expect(() => validateThemes(["tutorial", "bogus-key"], slug)).toThrow(
      /unknown key "bogus-key"/
    );
  });

  it("throws when raw contains no content type (only domains)", () => {
    expect(() => validateThemes(["security", "performance"], slug)).toThrow(
      /at least one content type/
    );
  });

  it("accepts a valid 1-key list (content type only)", () => {
    expect(validateThemes(["tutorial"], slug)).toEqual(["tutorial"]);
  });

  it("accepts a valid 2-key list (1 type + 1 domain)", () => {
    expect(validateThemes(["guide", "architecture"], slug)).toEqual([
      "guide",
      "architecture",
    ]);
  });

  it("accepts a valid 3-key list (1 type + 2 domains)", () => {
    expect(
      validateThemes(["tutorial", "security", "performance"], slug)
    ).toEqual(["tutorial", "security", "performance"]);
  });

  it("accepts a list with multiple content types (no rule against it)", () => {
    expect(validateThemes(["tutorial", "guide"], slug)).toEqual([
      "tutorial",
      "guide",
    ]);
  });

  it("includes the slug in error messages for build-time debugging", () => {
    expect(() => validateThemes(["unknown-key"], "my-article")).toThrow(
      /my-article\.mdx/
    );
  });
});
