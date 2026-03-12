import { describe, it, expect } from "vitest";
import {
  createPageMetadata,
  SITE_URL,
  SITE_NAME,
  SITE_LOCALE,
  DEFAULT_OG_IMAGE,
  SITE_PAGES,
} from "@/lib/metadata";

describe("createPageMetadata", () => {
  it("generates title and description", () => {
    const meta = createPageMetadata({
      title: "Test Page",
      description: "A test page description",
      path: "/test",
    });

    expect(meta.title).toBe("Test Page");
    expect(meta.description).toBe("A test page description");
  });

  it("generates canonical URL from path", () => {
    const meta = createPageMetadata({
      title: "Test",
      description: "desc",
      path: "/getting-started",
    });

    expect(meta.alternates?.canonical).toBe(
      `${SITE_URL}/getting-started`
    );
  });

  it("generates OpenGraph metadata with site name", () => {
    const meta = createPageMetadata({
      title: "Test",
      description: "desc",
      path: "/test",
    });

    const og = meta.openGraph;
    expect(og).toBeDefined();
    if (og) {
      expect(og.title).toBe(`Test | ${SITE_NAME}`);
      expect(og.description).toBe("desc");
      expect(og.siteName).toBe(SITE_NAME);
      expect(og.locale).toBe(SITE_LOCALE);
      expect(og.url).toBe(`${SITE_URL}/test`);
    }
  });

  it("uses DEFAULT_OG_IMAGE when no ogImage is provided", () => {
    const meta = createPageMetadata({
      title: "Test",
      description: "desc",
      path: "/test",
    });

    const og = meta.openGraph;
    expect(og).toBeDefined();
    if (og && "images" in og && Array.isArray(og.images)) {
      expect(og.images[0]).toMatchObject({
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
      });
    }
  });

  it("uses custom ogImage when provided", () => {
    const meta = createPageMetadata({
      title: "Test",
      description: "desc",
      path: "/test",
      ogImage: "/og/custom.png",
    });

    const og = meta.openGraph;
    if (og && "images" in og && Array.isArray(og.images)) {
      expect(og.images[0]).toMatchObject({ url: "/og/custom.png" });
    }
  });

  it("defaults type to article", () => {
    const meta = createPageMetadata({
      title: "Test",
      description: "desc",
      path: "/test",
    });

    const og = meta.openGraph as Record<string, unknown> | undefined;
    if (og) {
      expect(og.type).toBe("article");
    }
  });

  it("allows overriding type to website", () => {
    const meta = createPageMetadata({
      title: "Test",
      description: "desc",
      path: "/",
      type: "website",
    });

    const og = meta.openGraph as Record<string, unknown> | undefined;
    if (og) {
      expect(og.type).toBe("website");
    }
  });

  it("generates Twitter card metadata", () => {
    const meta = createPageMetadata({
      title: "Test",
      description: "desc",
      path: "/test",
    });

    const twitter = meta.twitter as Record<string, unknown> | undefined;
    expect(twitter).toBeDefined();
    if (twitter) {
      expect(twitter.card).toBe("summary_large_image");
      expect(twitter.title).toBe(`Test | ${SITE_NAME}`);
      expect(twitter.description).toBe("desc");
    }
  });

  it("includes publishedTime and modifiedTime when provided", () => {
    const meta = createPageMetadata({
      title: "Test",
      description: "desc",
      path: "/test",
      publishedTime: "2026-01-01",
      modifiedTime: "2026-02-01",
    });

    const og = meta.openGraph;
    if (og && "publishedTime" in og) {
      expect(og.publishedTime).toBe("2026-01-01");
    }
    if (og && "modifiedTime" in og) {
      expect(og.modifiedTime).toBe("2026-02-01");
    }
  });
});

describe("SITE_PAGES", () => {
  it("is a non-empty array", () => {
    expect(SITE_PAGES.length).toBeGreaterThan(0);
  });

  it("has required fields for every page entry", () => {
    for (const page of SITE_PAGES) {
      expect(page.path).toBeTruthy();
      expect(page.path.startsWith("/")).toBe(true);
      expect(page.title).toBeTruthy();
      expect(page.description).toBeTruthy();
      expect(page.priority).toBeGreaterThanOrEqual(0);
      expect(page.priority).toBeLessThanOrEqual(1);
      expect(page.changeFrequency).toBeTruthy();
    }
  });

  it("includes the homepage", () => {
    const homepage = SITE_PAGES.find((p) => p.path === "/");
    expect(homepage).toBeDefined();
    expect(homepage?.priority).toBe(1.0);
  });

  it("includes core sections", () => {
    const corePaths = [
      "/getting-started",
      "/mcp",
      "/skills",
      "/prompting",
      "/future",
      "/reference",
    ];
    for (const path of corePaths) {
      const found = SITE_PAGES.find((p) => p.path === path);
      expect(found).toBeDefined();
    }
  });

  it("has no duplicate paths", () => {
    const paths = SITE_PAGES.map((p) => p.path);
    const uniquePaths = new Set(paths);
    expect(uniquePaths.size).toBe(paths.length);
  });
});

describe("Constants", () => {
  it("SITE_URL is the production URL", () => {
    expect(SITE_URL).toBe("https://claude-codex.fr");
  });

  it("SITE_NAME is correctly defined", () => {
    expect(SITE_NAME).toBe("The Claude Codex");
  });

  it("SITE_LOCALE is French", () => {
    expect(SITE_LOCALE).toBe("fr_FR");
  });
});
