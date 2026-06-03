import { describe, it, expect } from "vitest";
import { PINNED_ARTICLE_SLUG } from "@/data/pinned-article";

describe("PINNED_ARTICLE_SLUG", () => {
  it("is either null or a non-empty string slug", () => {
    if (PINNED_ARTICLE_SLUG !== null) {
      expect(typeof PINNED_ARTICLE_SLUG).toBe("string");
      expect(PINNED_ARTICLE_SLUG.length).toBeGreaterThan(0);
      expect(PINNED_ARTICLE_SLUG.trim()).toBe(PINNED_ARTICLE_SLUG);
    }
  });
});
