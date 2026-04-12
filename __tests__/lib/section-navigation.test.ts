import { describe, it, expect } from "vitest";
import {
  sectionNavigation,
  getSectionFromPathname,
} from "@/lib/section-navigation";

describe("sectionNavigation", () => {
  it("contains all expected sections", () => {
    const expectedSections = [
      "getting-started",
      "mcp",
      "plugins",
      "skills",
      "agents",
      "prompting",
      "future",
      "configurator",
      "use-cases",
      "enterprise",
      "advanced",
      "reference",
      "limits",
      "personas",
      "content",
    ];

    for (const section of expectedSections) {
      expect(sectionNavigation).toHaveProperty(section);
    }
  });

  it("each section has a titleKey and non-empty items array", () => {
    for (const [key, config] of Object.entries(sectionNavigation)) {
      expect(config.titleKey).toBeTruthy();
      expect(config.items.length).toBeGreaterThan(0);
      // titleKey should match the pattern "section.title"
      expect(config.titleKey).toBe(`${key}.title`);
    }
  });

  it("each item has a labelKey and href starting with /", () => {
    for (const [, config] of Object.entries(sectionNavigation)) {
      for (const item of config.items) {
        expect(item.labelKey).toBeTruthy();
        expect(item.href).toMatch(/^\//);
      }
    }
  });

  it("first item of each section is the overview page", () => {
    for (const [key, config] of Object.entries(sectionNavigation)) {
      const firstItem = config.items[0];
      expect(firstItem.href).toBe(`/${key}`);
    }
  });

  it("all hrefs within a section start with the section path", () => {
    for (const [key, config] of Object.entries(sectionNavigation)) {
      for (const item of config.items) {
        expect(item.href).toMatch(new RegExp(`^/${key}`));
      }
    }
  });

  it("has no duplicate hrefs across sections", () => {
    const allHrefs: string[] = [];
    for (const [, config] of Object.entries(sectionNavigation)) {
      for (const item of config.items) {
        allHrefs.push(item.href);
      }
    }
    const unique = new Set(allHrefs);
    expect(unique.size).toBe(allHrefs.length);
  });
});

describe("getSectionFromPathname", () => {
  it("returns null for an empty path", () => {
    expect(getSectionFromPathname("")).toBeNull();
    expect(getSectionFromPathname("/")).toBeNull();
  });

  it("returns the section from a direct section path", () => {
    expect(getSectionFromPathname("/mcp")).toBe("mcp");
    expect(getSectionFromPathname("/getting-started")).toBe("getting-started");
    expect(getSectionFromPathname("/prompting")).toBe("prompting");
  });

  it("returns the section from a sub-page path", () => {
    expect(getSectionFromPathname("/mcp/setup")).toBe("mcp");
    expect(getSectionFromPathname("/getting-started/installation")).toBe(
      "getting-started"
    );
  });

  it("returns the section when a locale prefix is present", () => {
    expect(getSectionFromPathname("/fr/mcp")).toBe("mcp");
    expect(getSectionFromPathname("/en/agents")).toBe("agents");
    expect(getSectionFromPathname("/fr/getting-started/installation")).toBe(
      "getting-started"
    );
  });

  it("returns null for unknown paths", () => {
    expect(getSectionFromPathname("/unknown-section")).toBeNull();
    expect(getSectionFromPathname("/fr/unknown")).toBeNull();
  });

  it("returns the section even with trailing segments", () => {
    expect(getSectionFromPathname("/plugins/setup")).toBe("plugins");
    expect(getSectionFromPathname("/en/skills/create-custom")).toBe("skills");
  });
});
