import { describe, it, expect } from "vitest";
import {
  computeContentSections,
  selectMostRead,
  selectTrending,
} from "@/lib/content-sections";
import type { MdxFile } from "@/lib/mdx";
import type {
  ArticleStatsEntry,
  ArticleStatsFile,
} from "@/data/article-stats";

function makeStatsEntry(
  slug: string,
  overrides: Partial<ArticleStatsEntry> = {},
): ArticleStatsEntry {
  return {
    slug,
    locale: "fr",
    pageviewsLast30d: 100,
    pageviewsLast7d: 30,
    pageviewsPrev7d: 20,
    deltaPct: 50,
    scrollDepth75Pct: 0.4,
    ...overrides,
  };
}

function makeStatsFile(
  entries: ReadonlyArray<ArticleStatsEntry>,
): ArticleStatsFile {
  return {
    generatedAt: "2026-05-21T00:00:00.000Z",
    matomoPeriodDays: 30,
    source: "matomo",
    articles: entries,
  };
}

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

  it("returns empty trending/mostRead when stats is undefined", () => {
    const sections = computeContentSections({
      files,
      locale: "fr",
      pinnedSlug: null,
    });
    expect(sections.trending).toEqual([]);
    expect(sections.mostRead).toEqual([]);
  });

  it("populates mostRead and trending when stats are provided, excluding Pinned", () => {
    const stats = makeStatsFile([
      makeStatsEntry("c", { pageviewsLast30d: 500, pageviewsLast7d: 200, pageviewsPrev7d: 60, deltaPct: 233 }),
      makeStatsEntry("b", { pageviewsLast30d: 300, pageviewsLast7d: 90, pageviewsPrev7d: 50, deltaPct: 80 }),
      makeStatsEntry("a", { pageviewsLast30d: 200, pageviewsLast7d: 10, pageviewsPrev7d: 5, deltaPct: 100 }),
      makeStatsEntry("pinned-one", { pageviewsLast30d: 1000, pageviewsLast7d: 300, deltaPct: 200 }),
    ]);
    const sections = computeContentSections({
      files,
      locale: "fr",
      pinnedSlug: "pinned-one",
      stats,
    });
    // Pinned est exclu de Trending et Most read
    expect(sections.trending.map((t) => t.article.slug)).not.toContain("pinned-one");
    expect(sections.mostRead.map((m) => m.slug)).not.toContain("pinned-one");
    // Trending : c (delta=233) en haut puis a (delta=100, mais last7=10 < seuil 20)
    expect(sections.trending.map((t) => t.article.slug)).toEqual(["c", "b"]);
    // Most read tri par pageviewsLast30d desc, Trending exclu de Most read
    expect(sections.mostRead.map((m) => m.slug)).toEqual(["a"]);
  });
});

describe("selectMostRead", () => {
  const baseFiles: ReadonlyArray<MdxFile> = [
    makeFile("a", "2026-05-01"),
    makeFile("b", "2026-05-10"),
    makeFile("c", "2026-05-15"),
  ];

  it("returns empty list when stats is null", () => {
    expect(
      selectMostRead({
        stats: null,
        locale: "fr",
        files: baseFiles,
        excludeSlugs: new Set(),
      }),
    ).toEqual([]);
  });

  it("sorts by pageviewsLast30d descending and respects limit", () => {
    const stats = makeStatsFile([
      makeStatsEntry("a", { pageviewsLast30d: 50 }),
      makeStatsEntry("b", { pageviewsLast30d: 500 }),
      makeStatsEntry("c", { pageviewsLast30d: 200 }),
    ]);
    const result = selectMostRead({
      stats,
      locale: "fr",
      files: baseFiles,
      excludeSlugs: new Set(),
      limit: 2,
    });
    expect(result.map((a) => a.slug)).toEqual(["b", "c"]);
  });

  it("respects the excludeSlugs set", () => {
    const stats = makeStatsFile([
      makeStatsEntry("a", { pageviewsLast30d: 50 }),
      makeStatsEntry("b", { pageviewsLast30d: 500 }),
    ]);
    const result = selectMostRead({
      stats,
      locale: "fr",
      files: baseFiles,
      excludeSlugs: new Set(["b"]),
    });
    expect(result.map((a) => a.slug)).toEqual(["a"]);
  });

  it("filters out the wrong locale", () => {
    const stats = makeStatsFile([
      makeStatsEntry("a", { locale: "en", pageviewsLast30d: 999 }),
    ]);
    const result = selectMostRead({
      stats,
      locale: "fr",
      files: baseFiles,
      excludeSlugs: new Set(),
    });
    expect(result).toEqual([]);
  });

  it("excludes articles with pageviewsLast30d=0", () => {
    const stats = makeStatsFile([
      makeStatsEntry("a", { pageviewsLast30d: 0 }),
    ]);
    const result = selectMostRead({
      stats,
      locale: "fr",
      files: baseFiles,
      excludeSlugs: new Set(),
    });
    expect(result).toEqual([]);
  });
});

describe("selectTrending", () => {
  const baseFiles: ReadonlyArray<MdxFile> = [
    makeFile("a", "2026-05-01"),
    makeFile("b", "2026-05-10"),
    makeFile("c", "2026-05-15"),
    makeFile("d", "2026-04-20"),
  ];

  it("returns empty list when stats is null", () => {
    expect(
      selectTrending({
        stats: null,
        locale: "fr",
        files: baseFiles,
        excludeSlugs: new Set(),
      }),
    ).toEqual([]);
  });

  it("filters deltaPct > 0 and pageviewsLast7d > threshold", () => {
    const stats = makeStatsFile([
      makeStatsEntry("a", { deltaPct: -10, pageviewsLast7d: 100 }),
      makeStatsEntry("b", { deltaPct: 50, pageviewsLast7d: 5 }),
      makeStatsEntry("c", { deltaPct: 30, pageviewsLast7d: 60 }),
      makeStatsEntry("d", { deltaPct: 80, pageviewsLast7d: 200 }),
    ]);
    const result = selectTrending({
      stats,
      locale: "fr",
      files: baseFiles,
      excludeSlugs: new Set(),
    });
    expect(result.map((r) => r.article.slug)).toEqual(["d", "c"]);
  });

  it("returns deltaPct and pageviewsLast7d alongside the article", () => {
    const stats = makeStatsFile([
      makeStatsEntry("a", { deltaPct: 120, pageviewsLast7d: 60 }),
    ]);
    const result = selectTrending({
      stats,
      locale: "fr",
      files: baseFiles,
      excludeSlugs: new Set(),
    });
    expect(result[0]).toMatchObject({
      article: expect.objectContaining({ slug: "a" }),
      deltaPct: 120,
      pageviewsLast7d: 60,
    });
  });

  it("respects custom limit and minimum pageviews (strict greater than)", () => {
    const stats = makeStatsFile([
      makeStatsEntry("a", { deltaPct: 100, pageviewsLast7d: 25 }),
      makeStatsEntry("b", { deltaPct: 90, pageviewsLast7d: 30 }),
      makeStatsEntry("c", { deltaPct: 80, pageviewsLast7d: 35 }),
      makeStatsEntry("d", { deltaPct: 70, pageviewsLast7d: 100 }),
    ]);
    const result = selectTrending({
      stats,
      locale: "fr",
      files: baseFiles,
      excludeSlugs: new Set(),
      limit: 2,
      minPageviewsLast7d: 30,
    });
    // pageviewsLast7d must be > 30, so b (=30) and a (=25) are excluded
    expect(result.map((r) => r.article.slug)).toEqual(["c", "d"]);
  });

  it("respects the excludeSlugs set", () => {
    const stats = makeStatsFile([
      makeStatsEntry("a", { deltaPct: 200, pageviewsLast7d: 100 }),
      makeStatsEntry("b", { deltaPct: 100, pageviewsLast7d: 100 }),
    ]);
    const result = selectTrending({
      stats,
      locale: "fr",
      files: baseFiles,
      excludeSlugs: new Set(["a"]),
    });
    expect(result.map((r) => r.article.slug)).toEqual(["b"]);
  });

  it("filters out the wrong locale", () => {
    const stats = makeStatsFile([
      makeStatsEntry("a", { locale: "en", deltaPct: 200, pageviewsLast7d: 100 }),
    ]);
    const result = selectTrending({
      stats,
      locale: "fr",
      files: baseFiles,
      excludeSlugs: new Set(),
    });
    expect(result).toEqual([]);
  });
});
