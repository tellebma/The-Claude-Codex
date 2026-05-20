import { describe, it, expect } from "vitest";
import { computeContentSections } from "@/lib/content-sections";
import type { MdxFile } from "@/lib/mdx";

function makeFile(
  slug: string,
  date: string,
  options: Partial<MdxFile["frontmatter"]> = {},
): MdxFile {
  return {
    slug,
    content: "",
    frontmatter: {
      title: slug,
      description: `desc-${slug}`,
      dateModified: date,
      ...options,
    },
  };
}

const files: ReadonlyArray<MdxFile> = [
  makeFile("a", "2026-05-01"),
  makeFile("b", "2026-05-10"),
  makeFile("c", "2026-05-15"),
  makeFile("d", "2026-04-20"),
  makeFile("e", "2026-04-15"),
  makeFile("f", "2026-04-01"),
  makeFile("pinned-one", "2026-03-01"),
];

describe("computeContentSections", () => {
  it("returns pinned + latest + all when pinned slug matches", () => {
    const sections = computeContentSections({
      files,
      locale: "fr",
      pinnedSlug: "pinned-one",
    });
    expect(sections.pinned?.slug).toBe("pinned-one");
    expect(sections.latest).toHaveLength(5);
    expect(sections.latest.map((a) => a.slug)).toEqual([
      "c",
      "b",
      "a",
      "d",
      "e",
    ]);
    expect(sections.all.map((a) => a.slug)).not.toContain("pinned-one");
    expect(sections.all).toHaveLength(6);
  });

  it("returns pinned=null and full latest when pinned slug is null", () => {
    const sections = computeContentSections({
      files,
      locale: "fr",
      pinnedSlug: null,
    });
    expect(sections.pinned).toBeNull();
    expect(sections.latest).toHaveLength(5);
    expect(sections.latest[0]?.slug).toBe("c");
    expect(sections.all).toHaveLength(7);
  });

  it("returns pinned=null when pinned slug doesnt match any file", () => {
    const sections = computeContentSections({
      files,
      locale: "fr",
      pinnedSlug: "ghost-article",
    });
    expect(sections.pinned).toBeNull();
    expect(sections.latest).toHaveLength(5);
    expect(sections.all).toHaveLength(7);
  });

  it("sorts latest by dateModified desc", () => {
    const sections = computeContentSections({
      files,
      locale: "fr",
      pinnedSlug: null,
    });
    const dates = sections.latest.map((a) => a.dateModified);
    const sorted = [...dates].sort().reverse();
    expect(dates).toEqual(sorted);
  });

  it("falls back to datePublished when dateModified is missing", () => {
    const customFiles: ReadonlyArray<MdxFile> = [
      {
        slug: "no-modified",
        content: "",
        frontmatter: {
          title: "No mod",
          description: "x",
          datePublished: "2026-05-25",
        },
      },
      makeFile("regular", "2026-05-20"),
    ];
    const sections = computeContentSections({
      files: customFiles,
      locale: "fr",
      pinnedSlug: null,
    });
    expect(sections.latest[0]?.slug).toBe("no-modified");
  });

  it("respects custom latestLimit", () => {
    const sections = computeContentSections({
      files,
      locale: "fr",
      pinnedSlug: "pinned-one",
      latestLimit: 2,
    });
    expect(sections.latest).toHaveLength(2);
    expect(sections.latest.map((a) => a.slug)).toEqual(["c", "b"]);
  });

  it("handles fewer files than latestLimit gracefully", () => {
    const tinyFiles: ReadonlyArray<MdxFile> = [
      makeFile("only", "2026-05-01"),
    ];
    const sections = computeContentSections({
      files: tinyFiles,
      locale: "fr",
      pinnedSlug: null,
    });
    expect(sections.latest).toHaveLength(1);
    expect(sections.all).toHaveLength(1);
  });

  it("propagates locale to each ArticleCardArticle", () => {
    const sections = computeContentSections({
      files,
      locale: "en",
      pinnedSlug: "pinned-one",
    });
    expect(sections.pinned?.locale).toBe("en");
    for (const article of sections.latest) {
      expect(article.locale).toBe("en");
    }
    for (const article of sections.all) {
      expect(article.locale).toBe("en");
    }
  });

  it("preserves themes when present", () => {
    const themedFiles: ReadonlyArray<MdxFile> = [
      makeFile("with-themes", "2026-05-01", {
        themes: ["tutorial", "security"],
      }),
    ];
    const sections = computeContentSections({
      files: themedFiles,
      locale: "fr",
      pinnedSlug: null,
    });
    expect(sections.latest[0]?.themes).toEqual(["tutorial", "security"]);
  });

  it("sets section=null on root articles", () => {
    const sections = computeContentSections({
      files,
      locale: "fr",
      pinnedSlug: null,
    });
    for (const article of sections.all) {
      expect(article.section).toBeNull();
    }
  });

  it("forces section=null even when frontmatter declares a section tag (categorie sidebar, pas une route)", () => {
    const taggedFiles: ReadonlyArray<MdxFile> = [
      makeFile("future-vision", "2026-05-12", { section: "future" }),
      makeFile("mcp-guide", "2026-05-10", { section: "mcp" }),
      makeFile("prompting-guide", "2026-05-08", { section: "prompting" }),
      makeFile("comprendre-claude-code-internals", "2026-05-12", {
        section: "content",
      }),
    ];
    const sections = computeContentSections({
      files: taggedFiles,
      locale: "fr",
      pinnedSlug: "comprendre-claude-code-internals",
    });
    expect(sections.pinned?.section).toBeNull();
    for (const article of sections.latest) {
      expect(article.section).toBeNull();
    }
    for (const article of sections.all) {
      expect(article.section).toBeNull();
    }
  });
});
