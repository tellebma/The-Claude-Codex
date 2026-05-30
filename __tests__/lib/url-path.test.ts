import { describe, expect, it } from "vitest";
import { hasStaticFileExtension } from "@/lib/url-path";

describe("hasStaticFileExtension", () => {
  it.each([
    ["/skills/find-skills.md", true],
    ["/images/hero.webp?size=large", true],
    ["/downloads/template.zip#install", true],
    ["/fr/content/security-best-practices/", false],
    ["/mcp/setup", false],
    ["/folder.with.dot/page", false],
  ])("returns %s for %s", (href, expected) => {
    expect(hasStaticFileExtension(href)).toBe(expected);
  });
});
