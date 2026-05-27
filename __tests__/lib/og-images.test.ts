import { describe, expect, it } from "vitest";
import {
  OG_CARD_SIZE,
  OG_HERO_SIZE,
  hasOgImage,
  isOgManifest,
  ogImagePublicPath,
  ogManifestKey,
  ogVariantForSize,
  resolveOgImageUrl,
  type OgManifest,
} from "@/lib/og-images";

const manifest: OgManifest = {
  generatedAt: "2026-05-27T00:00:00.000Z",
  images: [
    { locale: "fr", slug: "comprendre-claude-code-internals" },
    { locale: "en", slug: "leaked-api-key-recovery" },
  ],
};

describe("ogVariantForSize", () => {
  it("maps hero to the hero variant and grid/row to the card variant", () => {
    expect(ogVariantForSize("hero")).toBe("hero");
    expect(ogVariantForSize("grid")).toBe("card");
    expect(ogVariantForSize("row")).toBe("card");
  });
});

describe("ogImagePublicPath", () => {
  it("builds the 1200x630 hero path without suffix", () => {
    expect(ogImagePublicPath("fr", "foo", "hero")).toBe("/og/content/fr/foo.png");
  });

  it("builds the 600x315 card path with the -card suffix", () => {
    expect(ogImagePublicPath("en", "bar", "card")).toBe("/og/content/en/bar-card.png");
  });
});

describe("dimension constants", () => {
  it("exposes the two distinct sizes required by CTN-10", () => {
    expect(OG_HERO_SIZE).toEqual({ width: 1200, height: 630 });
    expect(OG_CARD_SIZE).toEqual({ width: 600, height: 315 });
  });
});

describe("ogManifestKey", () => {
  it("joins locale and slug with a colon", () => {
    expect(ogManifestKey("fr", "foo")).toBe("fr:foo");
  });
});

describe("hasOgImage", () => {
  it("returns true for an entry present in the manifest", () => {
    expect(hasOgImage("fr", "comprendre-claude-code-internals", manifest)).toBe(true);
  });

  it("returns false for an absent entry", () => {
    expect(hasOgImage("fr", "leaked-api-key-recovery", manifest)).toBe(false);
    expect(hasOgImage("de", "comprendre-claude-code-internals", manifest)).toBe(false);
  });
});

describe("resolveOgImageUrl", () => {
  it("returns the card path for a grid card whose image exists", () => {
    expect(
      resolveOgImageUrl("fr", "comprendre-claude-code-internals", "grid", manifest),
    ).toBe("/og/content/fr/comprendre-claude-code-internals-card.png");
  });

  it("returns the hero path for a hero card whose image exists", () => {
    expect(
      resolveOgImageUrl("fr", "comprendre-claude-code-internals", "hero", manifest),
    ).toBe("/og/content/fr/comprendre-claude-code-internals.png");
  });

  it("returns undefined when the image is not in the manifest (icon fallback)", () => {
    expect(resolveOgImageUrl("fr", "unknown-slug", "grid", manifest)).toBeUndefined();
  });
});

describe("isOgManifest", () => {
  it("accepts a well-formed manifest", () => {
    expect(isOgManifest(manifest)).toBe(true);
    expect(isOgManifest({ generatedAt: "x", images: [] })).toBe(true);
  });

  it("rejects malformed shapes", () => {
    expect(isOgManifest(null)).toBe(false);
    expect(isOgManifest({ images: [] })).toBe(false);
    expect(isOgManifest({ generatedAt: "x", images: [{ locale: "fr" }] })).toBe(false);
    expect(isOgManifest({ generatedAt: "x", images: "nope" })).toBe(false);
  });
});
