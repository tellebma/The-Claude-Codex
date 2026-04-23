import { describe, it, expect, vi } from "vitest";
import {
  extractSimpleSlug,
  getAdjacentPages,
  sanitizeSlugForHref,
} from "@/lib/section-utils";

// Mock the mdx module to avoid filesystem access
vi.mock("@/lib/mdx", () => ({
  getAllSectionMdxFiles: (section: string) => {
    if (section === "mcp") {
      return [
        {
          slug: "mcp/what-are-mcps",
          frontmatter: { title: "What are MCPs", description: "desc", order: 1 },
          content: "",
        },
        {
          slug: "mcp/setup",
          frontmatter: { title: "Setup", description: "desc", order: 2 },
          content: "",
        },
        {
          slug: "mcp/best-productivity",
          frontmatter: {
            title: "Best Productivity",
            description: "desc",
            order: 3,
          },
          content: "",
        },
      ];
    }
    return [];
  },
}));

describe("extractSimpleSlug", () => {
  it("extracts the last segment from a section-prefixed slug", () => {
    expect(extractSimpleSlug("mcp/setup")).toBe("setup");
    expect(extractSimpleSlug("getting-started/installation")).toBe(
      "installation"
    );
  });

  it("returns the slug as-is when there is no prefix", () => {
    expect(extractSimpleSlug("setup")).toBe("setup");
  });

  it("handles deeply nested slugs", () => {
    expect(extractSimpleSlug("a/b/c")).toBe("c");
  });
});

describe("getAdjacentPages", () => {
  it("returns prev and next for a middle page", () => {
    const result = getAdjacentPages("mcp", "setup", "fr");
    expect(result.prev).not.toBeNull();
    expect(result.prev?.slug).toBe("mcp/what-are-mcps");
    expect(result.next).not.toBeNull();
    expect(result.next?.slug).toBe("mcp/best-productivity");
  });

  it("returns null prev for the first page", () => {
    const result = getAdjacentPages("mcp", "what-are-mcps", "fr");
    expect(result.prev).toBeNull();
    expect(result.next).not.toBeNull();
    expect(result.next?.slug).toBe("mcp/setup");
  });

  it("returns null next for the last page", () => {
    const result = getAdjacentPages("mcp", "best-productivity", "fr");
    expect(result.prev).not.toBeNull();
    expect(result.prev?.slug).toBe("mcp/setup");
    expect(result.next).toBeNull();
  });

  it("returns null for both when slug is not found", () => {
    const result = getAdjacentPages("mcp", "nonexistent", "fr");
    expect(result.prev).toBeNull();
    expect(result.next).toBeNull();
  });

  it("returns null for both when section is empty", () => {
    const result = getAdjacentPages("unknown-section", "any", "fr");
    expect(result.prev).toBeNull();
    expect(result.next).toBeNull();
  });
});

describe("sanitizeSlugForHref", () => {
  it("returns valid slugs unchanged", () => {
    expect(sanitizeSlugForHref("setup")).toBe("setup");
    expect(sanitizeSlugForHref("best-design")).toBe("best-design");
    expect(sanitizeSlugForHref("intro-to-mcp-v2")).toBe("intro-to-mcp-v2");
    expect(sanitizeSlugForHref("a1")).toBe("a1");
  });

  it("rejects slugs with special characters used for XSS", () => {
    expect(sanitizeSlugForHref("../../etc/passwd")).toBe("");
    expect(sanitizeSlugForHref('"><script>')).toBe("");
    expect(sanitizeSlugForHref("javascript:alert(1)")).toBe("");
    expect(sanitizeSlugForHref("slug onload=alert")).toBe("");
  });

  it("rejects slugs with uppercase or underscores", () => {
    expect(sanitizeSlugForHref("Setup")).toBe("");
    expect(sanitizeSlugForHref("with_underscore")).toBe("");
  });

  it("rejects edge cases", () => {
    expect(sanitizeSlugForHref("")).toBe("");
    expect(sanitizeSlugForHref("-starts-with-dash")).toBe("");
    expect(sanitizeSlugForHref("ends-with-dash-")).toBe("");
    expect(sanitizeSlugForHref("double--dash")).toBe("");
  });
});
