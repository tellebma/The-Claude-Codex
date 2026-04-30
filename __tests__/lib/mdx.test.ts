import { describe, it, expect, vi, beforeEach } from "vitest";
import path from "node:path";

const mockExistsSync = vi.fn<(p: string) => boolean>();
const mockReadFileSync = vi.fn<(p: string, enc?: string) => string>();
const mockReaddirSync = vi.fn<(p: string) => string[]>();

vi.mock("node:fs", () => ({
  default: {
    existsSync: (...args: Parameters<typeof mockExistsSync>) => mockExistsSync(...args),
    readFileSync: (...args: Parameters<typeof mockReadFileSync>) => mockReadFileSync(...args),
    readdirSync: (...args: Parameters<typeof mockReaddirSync>) => mockReaddirSync(...args),
  },
  existsSync: (...args: Parameters<typeof mockExistsSync>) => mockExistsSync(...args),
  readFileSync: (...args: Parameters<typeof mockReadFileSync>) => mockReadFileSync(...args),
  readdirSync: (...args: Parameters<typeof mockReaddirSync>) => mockReaddirSync(...args),
}));

import {
  getMdxBySlug,
  getAllMdxSlugs,
  getAllMdxFiles,
  getMdxFilesBySection,
  getSectionMdxSlugs,
  getSectionMdxBySlug,
  getAllSectionMdxFiles,
  countAllArticles,
  countAllSections,
  getLastModifiedDate,
  getMostRecentArticles,
} from "@/lib/mdx";

const contentDir = path.join(process.cwd(), "content");

const validMdxContent = `---
title: "Test Article"
description: "A test description"
order: 1
---

# Content here
`;

const validMdxContent2 = `---
title: "Second Article"
description: "Second description"
order: 2
section: "mcp"
---

# More content
`;

beforeEach(() => {
  mockExistsSync.mockReset();
  mockReadFileSync.mockReset();
  mockReaddirSync.mockReset();
});

describe("getMdxBySlug", () => {
  it("reads and parses a valid MDX file", () => {
    const filePath = path.join(contentDir, "fr", "test-article.mdx");
    mockExistsSync.mockImplementation((p) => p === filePath);
    mockReadFileSync.mockReturnValue(validMdxContent);

    const result = getMdxBySlug("test-article", "fr");
    expect(result.frontmatter.title).toBe("Test Article");
    expect(result.frontmatter.description).toBe("A test description");
    expect(result.frontmatter.order).toBe(1);
    expect(result.slug).toBe("test-article");
    expect(result.content).toContain("# Content here");
  });

  it("falls back to default locale when requested locale file is missing", () => {
    const enPath = path.join(contentDir, "en", "test-article.mdx");
    const frPath = path.join(contentDir, "fr", "test-article.mdx");
    mockExistsSync.mockImplementation((p) => p === frPath);
    mockReadFileSync.mockReturnValue(validMdxContent);

    // Requesting "en" but file only exists in "fr"
    const result = getMdxBySlug("test-article", "en");
    expect(result.frontmatter.title).toBe("Test Article");
    expect(mockExistsSync).toHaveBeenCalledWith(enPath);
    expect(mockExistsSync).toHaveBeenCalledWith(frPath);
  });

  it("throws when file does not exist in any locale", () => {
    mockExistsSync.mockReturnValue(false);

    expect(() => getMdxBySlug("nonexistent", "en")).toThrow(
      "MDX file not found"
    );
  });

  it("throws when title is missing from frontmatter", () => {
    const filePath = path.join(contentDir, "fr", "bad-article.mdx");
    mockExistsSync.mockImplementation((p) => p === filePath);
    mockReadFileSync.mockReturnValue(`---
description: "Missing title"
---
Content`);

    expect(() => getMdxBySlug("bad-article", "fr")).toThrow(
      'missing or empty required field "title"'
    );
  });

  it("throws when description is missing from frontmatter", () => {
    const filePath = path.join(contentDir, "fr", "bad-article.mdx");
    mockExistsSync.mockImplementation((p) => p === filePath);
    mockReadFileSync.mockReturnValue(`---
title: "Missing Description"
---
Content`);

    expect(() => getMdxBySlug("bad-article", "fr")).toThrow(
      'missing or empty required field "description"'
    );
  });

  it("parses optional frontmatter fields correctly", () => {
    const filePath = path.join(contentDir, "fr", "article.mdx");
    mockExistsSync.mockImplementation((p) => p === filePath);
    mockReadFileSync.mockReturnValue(`---
title: "Full Article"
description: "Desc"
badge: "NEW"
order: 5
section: "mcp"
datePublished: "2026-01-01"
dateModified: "2026-02-01"
---
Content`);

    const result = getMdxBySlug("article", "fr");
    expect(result.frontmatter.badge).toBe("NEW");
    expect(result.frontmatter.order).toBe(5);
    expect(result.frontmatter.section).toBe("mcp");
    expect(result.frontmatter.datePublished).toBe("2026-01-01");
    expect(result.frontmatter.dateModified).toBe("2026-02-01");
  });

  it("parses optional themes field (RG-31)", () => {
    const filePath = path.join(contentDir, "fr", "themed.mdx");
    mockExistsSync.mockImplementation((p) => p === filePath);
    mockReadFileSync.mockReturnValue(`---
title: "Themed"
description: "Desc"
themes: ["tutorial", "security"]
---
Content`);

    const result = getMdxBySlug("themed", "fr");
    expect(result.frontmatter.themes).toEqual(["tutorial", "security"]);
  });

  it("returns themes undefined when not present", () => {
    const filePath = path.join(contentDir, "fr", "no-themes.mdx");
    mockExistsSync.mockImplementation((p) => p === filePath);
    mockReadFileSync.mockReturnValue(`---
title: "No themes"
description: "Desc"
---
Content`);

    const result = getMdxBySlug("no-themes", "fr");
    expect(result.frontmatter.themes).toBeUndefined();
  });

  it("throws when themes contains an unknown key", () => {
    const filePath = path.join(contentDir, "fr", "bad-theme.mdx");
    mockExistsSync.mockImplementation((p) => p === filePath);
    mockReadFileSync.mockReturnValue(`---
title: "Bad theme"
description: "Desc"
themes: ["unknown-key"]
---
Content`);

    expect(() => getMdxBySlug("bad-theme", "fr")).toThrow(
      /unknown key "unknown-key"/
    );
  });

  it("throws when themes has more than 3 entries", () => {
    const filePath = path.join(contentDir, "fr", "too-many.mdx");
    mockExistsSync.mockImplementation((p) => p === filePath);
    mockReadFileSync.mockReturnValue(`---
title: "Too many"
description: "Desc"
themes: ["tutorial", "security", "tooling", "performance"]
---
Content`);

    expect(() => getMdxBySlug("too-many", "fr")).toThrow(
      /at most 3 entries/
    );
  });

  it("throws when themes has no content type (only domains)", () => {
    const filePath = path.join(contentDir, "fr", "no-type.mdx");
    mockExistsSync.mockImplementation((p) => p === filePath);
    mockReadFileSync.mockReturnValue(`---
title: "No type"
description: "Desc"
themes: ["security", "performance"]
---
Content`);

    expect(() => getMdxBySlug("no-type", "fr")).toThrow(
      /at least one content type/
    );
  });

  it("treats empty title as missing", () => {
    const filePath = path.join(contentDir, "fr", "empty-title.mdx");
    mockExistsSync.mockImplementation((p) => p === filePath);
    mockReadFileSync.mockReturnValue(`---
title: "   "
description: "desc"
---
Content`);

    expect(() => getMdxBySlug("empty-title", "fr")).toThrow(
      'missing or empty required field "title"'
    );
  });
});

describe("getAllMdxSlugs", () => {
  it("returns slugs from the content directory", () => {
    const dir = path.join(contentDir, "fr");
    mockExistsSync.mockImplementation((p) => p === dir);
    mockReaddirSync.mockReturnValue([
      "article-one.mdx",
      "article-two.mdx",
      "not-mdx.txt",
    ]);

    const result = getAllMdxSlugs("fr");
    expect(result).toEqual(["article-one", "article-two"]);
  });

  it("returns empty array when directory does not exist", () => {
    mockExistsSync.mockReturnValue(false);

    const result = getAllMdxSlugs("de");
    expect(result).toEqual([]);
  });

  it("filters out non-mdx files", () => {
    const dir = path.join(contentDir, "fr");
    mockExistsSync.mockImplementation((p) => p === dir);
    mockReaddirSync.mockReturnValue(["readme.md", "article.mdx", "data.json"]);

    const result = getAllMdxSlugs("fr");
    expect(result).toEqual(["article"]);
  });
});

describe("getAllMdxFiles", () => {
  it("returns files sorted by order", () => {
    const dir = path.join(contentDir, "fr");

    mockExistsSync.mockReturnValue(true);
    mockReaddirSync.mockReturnValue(["b-article.mdx", "a-article.mdx"]);

    let callCount = 0;
    mockReadFileSync.mockImplementation(() => {
      callCount++;
      if (callCount === 1) {
        return `---
title: "B Article"
description: "desc"
order: 2
---
Content`;
      }
      return `---
title: "A Article"
description: "desc"
order: 1
---
Content`;
    });

    const result = getAllMdxFiles("fr");
    expect(result).toHaveLength(2);
    expect(result[0].frontmatter.title).toBe("A Article");
    expect(result[1].frontmatter.title).toBe("B Article");
  });
});

describe("getMdxFilesBySection", () => {
  it("filters files by section field", () => {
    const dir = path.join(contentDir, "fr");
    mockExistsSync.mockReturnValue(true);
    mockReaddirSync.mockReturnValue(["article-1.mdx", "article-2.mdx"]);

    let callCount = 0;
    mockReadFileSync.mockImplementation(() => {
      callCount++;
      if (callCount === 1) {
        return validMdxContent; // no section
      }
      return validMdxContent2; // section: "mcp"
    });

    const result = getMdxFilesBySection("mcp", "fr");
    expect(result).toHaveLength(1);
    expect(result[0].frontmatter.section).toBe("mcp");
  });
});

describe("getSectionMdxSlugs", () => {
  it("returns slugs from a section subdirectory", () => {
    const sectionDir = path.join(contentDir, "fr", "mcp");
    mockExistsSync.mockImplementation((p) => p === sectionDir);
    mockReaddirSync.mockReturnValue([
      "setup.mdx",
      "what-are-mcps.mdx",
      "index.mdx",
    ]);

    const result = getSectionMdxSlugs("mcp", "fr");
    expect(result).toEqual(["setup", "what-are-mcps"]);
    expect(result).not.toContain("index");
  });

  it("returns empty array when section directory does not exist", () => {
    mockExistsSync.mockReturnValue(false);

    const result = getSectionMdxSlugs("nonexistent", "fr");
    expect(result).toEqual([]);
  });
});

describe("getSectionMdxBySlug", () => {
  it("reads an MDX file from a section subdirectory", () => {
    const filePath = path.join(contentDir, "fr", "mcp", "setup.mdx");
    mockExistsSync.mockImplementation((p) => p === filePath);
    mockReadFileSync.mockReturnValue(validMdxContent);

    const result = getSectionMdxBySlug("mcp", "setup", "fr");
    expect(result.frontmatter.title).toBe("Test Article");
    expect(result.slug).toBe("mcp/setup");
  });
});

describe("getAllSectionMdxFiles", () => {
  it("returns sorted section files", () => {
    const sectionDir = path.join(contentDir, "fr", "mcp");
    mockExistsSync.mockReturnValue(true);
    mockReaddirSync.mockReturnValue(["b-page.mdx", "a-page.mdx"]);

    let callCount = 0;
    mockReadFileSync.mockImplementation(() => {
      callCount++;
      if (callCount === 1) {
        return `---
title: "B Page"
description: "desc"
order: 2
---
Content`;
      }
      return `---
title: "A Page"
description: "desc"
order: 1
---
Content`;
    });

    const result = getAllSectionMdxFiles("mcp", "fr");
    expect(result).toHaveLength(2);
    expect(result[0].frontmatter.title).toBe("A Page");
    expect(result[1].frontmatter.title).toBe("B Page");
  });
});

// ----------------------------------------------------------------------------
// Helpers RG-32 : countAllArticles, countAllSections, getLastModifiedDate,
// getMostRecentArticles. Mocks fs reduits a un seul article racine FR + EN
// pour valider la deduplication par slug.
// ----------------------------------------------------------------------------

describe("countAllSections", () => {
  it("returns 10 (les 10 sections actives definies en SECTIONS_FOR_COUNT)", () => {
    expect(countAllSections()).toBe(10);
  });
});

describe("countAllArticles + getLastModifiedDate + getMostRecentArticles (RG-32)", () => {
  beforeEach(() => {
    // Mock minimal : un seul article racine en FR et son equivalent EN.
    // Aucun article de section. countAllArticles doit retourner 1
    // (deduplication FR/EN sur le slug "intro").
    mockExistsSync.mockImplementation((p: string) => {
      const s = String(p);
      // Repertoires racine FR + EN existent
      if (s.endsWith("/content/fr")) return true;
      if (s.endsWith("/content/en")) return true;
      // Repertoires de section : aucun n'existe
      if (s.includes("/content/fr/") || s.includes("/content/en/")) {
        if (s.endsWith(".mdx")) return true;
        return false;
      }
      return true;
    });
    mockReaddirSync.mockImplementation((p: string) => {
      const s = String(p);
      if (s.endsWith("/content/fr") || s.endsWith("/content/en")) {
        return ["intro.mdx"];
      }
      return [];
    });
    mockReadFileSync.mockReturnValue(`---
title: "Intro"
description: "An intro"
dateModified: "2026-04-15"
---
Content`);
  });

  it("countAllArticles deduplique FR/EN sur le slug", () => {
    expect(countAllArticles()).toBe(1);
  });

  it("getLastModifiedDate retourne le max des dateModified (parse ISO)", () => {
    const d = getLastModifiedDate();
    expect(d).not.toBeNull();
    expect(d?.getUTCFullYear()).toBe(2026);
    expect(d?.getUTCMonth()).toBe(3); // Avril (0-indexed)
    expect(d?.getUTCDate()).toBe(15);
  });

  it("getMostRecentArticles retourne au plus N entrees triees par dateModified", () => {
    const recent = getMostRecentArticles(3, "fr");
    expect(recent).toHaveLength(1);
    expect(recent[0].slug).toBe("intro");
    expect(recent[0].section).toBeNull();
    // La locale preferee FR doit gagner sur le timestamp egal.
    expect(recent[0].locale).toBe("fr");
  });
});
