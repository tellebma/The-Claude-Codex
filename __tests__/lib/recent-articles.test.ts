import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/mdx", () => ({
  getAllMdxFiles: vi.fn(),
}));

import { getRecentArticles } from "@/lib/recent-articles";
import { getAllMdxFiles } from "@/lib/mdx";

const mockGetAllMdxFiles = vi.mocked(getAllMdxFiles);

type MockMdxFile = {
  slug: string;
  content: string;
  frontmatter: {
    title: string;
    description: string;
    datePublished?: string;
    badge?: string;
  };
};

function buildFile(slug: string, datePublished?: string, badge?: string): MockMdxFile {
  return {
    slug,
    content: "",
    frontmatter: {
      title: `Title ${slug}`,
      description: `Description ${slug}`,
      ...(datePublished && { datePublished }),
      ...(badge && { badge }),
    },
  };
}

describe("getRecentArticles", () => {
  beforeEach(() => {
    mockGetAllMdxFiles.mockReset();
  });

  it("retourne les articles triés par datePublished décroissant", () => {
    mockGetAllMdxFiles.mockReturnValue([
      buildFile("old", "2025-01-01"),
      buildFile("recent", "2026-04-20"),
      buildFile("middle", "2026-01-15"),
    ] as ReturnType<typeof getAllMdxFiles>);

    const result = getRecentArticles("fr");

    expect(result).toHaveLength(3);
    expect(result[0]!.href).toBe("/content/recent");
    expect(result[1]!.href).toBe("/content/middle");
    expect(result[2]!.href).toBe("/content/old");
  });

  it("filtre les articles sans datePublished", () => {
    mockGetAllMdxFiles.mockReturnValue([
      buildFile("with-date", "2026-04-20"),
      buildFile("no-date"),
    ] as ReturnType<typeof getAllMdxFiles>);

    const result = getRecentArticles("fr");

    expect(result).toHaveLength(1);
    expect(result[0]!.href).toBe("/content/with-date");
  });

  it("respecte la limite par défaut de 4", () => {
    mockGetAllMdxFiles.mockReturnValue(
      Array.from({ length: 10 }, (_, i) =>
        buildFile(`article-${i}`, `2026-04-${String(i + 1).padStart(2, "0")}`),
      ) as ReturnType<typeof getAllMdxFiles>,
    );

    const result = getRecentArticles("fr");

    expect(result).toHaveLength(4);
  });

  it("accepte une limite custom", () => {
    mockGetAllMdxFiles.mockReturnValue([
      buildFile("a", "2026-04-01"),
      buildFile("b", "2026-04-02"),
      buildFile("c", "2026-04-03"),
    ] as ReturnType<typeof getAllMdxFiles>);

    const result = getRecentArticles("fr", 2);

    expect(result).toHaveLength(2);
    expect(result[0]!.href).toBe("/content/c");
    expect(result[1]!.href).toBe("/content/b");
  });

  it("retourne un tableau vide si aucun fichier daté", () => {
    mockGetAllMdxFiles.mockReturnValue([] as ReturnType<typeof getAllMdxFiles>);

    const result = getRecentArticles("fr");

    expect(result).toEqual([]);
  });

  it("propage le badge du frontmatter", () => {
    mockGetAllMdxFiles.mockReturnValue([
      buildFile("featured", "2026-04-20", "NEW"),
    ] as ReturnType<typeof getAllMdxFiles>);

    const result = getRecentArticles("fr");

    expect(result[0]!.badge).toBe("NEW");
  });

  it("appelle getAllMdxFiles avec la locale passée", () => {
    mockGetAllMdxFiles.mockReturnValue([] as ReturnType<typeof getAllMdxFiles>);

    getRecentArticles("en");

    expect(mockGetAllMdxFiles).toHaveBeenCalledWith("en");
  });

  it("construit le href au format /content/<slug>", () => {
    mockGetAllMdxFiles.mockReturnValue([
      buildFile("mon-article-seo", "2026-04-20"),
    ] as ReturnType<typeof getAllMdxFiles>);

    const result = getRecentArticles("fr");

    expect(result[0]!.href).toBe("/content/mon-article-seo");
  });
});
