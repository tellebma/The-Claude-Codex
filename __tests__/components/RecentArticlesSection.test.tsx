import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";

vi.mock("@/lib/mdx", () => ({
  getMostRecentArticles: vi.fn(),
}));

import { getMostRecentArticles, type RecentArticle } from "@/lib/mdx";
import { RecentArticlesSection } from "@/components/ui/RecentArticlesSection";

const mockGetMostRecentArticles = vi.mocked(getMostRecentArticles);

async function renderAsync(node: React.ReactNode) {
  const resolved = await node;
  return render(resolved as React.ReactElement);
}

const sample = (overrides: Partial<RecentArticle> = {}): RecentArticle => ({
  title: "Sample Article",
  description: "A sample description.",
  section: "getting-started",
  slug: "intro",
  locale: "fr",
  dateModified: "2026-04-15",
  ...overrides,
});

describe("RecentArticlesSection", () => {
  beforeEach(() => {
    mockGetMostRecentArticles.mockReset();
  });

  it("renders nothing when there are no articles", async () => {
    mockGetMostRecentArticles.mockReturnValue([]);
    const { container } = await renderAsync(RecentArticlesSection({ locale: "fr" }));
    expect(container.firstChild).toBeNull();
  });

  it("renders 1 hero card when only 1 article exists", async () => {
    mockGetMostRecentArticles.mockReturnValue([sample({ title: "Hero only" })]);
    await renderAsync(RecentArticlesSection({ locale: "fr" }));
    expect(screen.getByText("Hero only")).toBeInTheDocument();
  });

  it("renders 1 hero + 2 small cards when 3 articles exist", async () => {
    mockGetMostRecentArticles.mockReturnValue([
      sample({ slug: "a", title: "Article A" }),
      sample({ slug: "b", title: "Article B" }),
      sample({ slug: "c", title: "Article C" }),
    ]);
    await renderAsync(RecentArticlesSection({ locale: "fr" }));
    expect(screen.getByText("Article A")).toBeInTheDocument();
    expect(screen.getByText("Article B")).toBeInTheDocument();
    expect(screen.getByText("Article C")).toBeInTheDocument();
  });

  it("uses the section heading and aria-label from translations", async () => {
    mockGetMostRecentArticles.mockReturnValue([sample()]);
    await renderAsync(RecentArticlesSection({ locale: "fr" }));
    expect(screen.getByRole("region", { name: "ariaLabel" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("title");
  });

  it("generates href under the section for sectioned articles", async () => {
    mockGetMostRecentArticles.mockReturnValue([
      sample({ section: "mcp", slug: "what-are-mcps" }),
    ]);
    await renderAsync(RecentArticlesSection({ locale: "fr" }));
    const link = screen.getByRole("link");
    expect(link.getAttribute("href")).toBe("/mcp/what-are-mcps");
  });

  it("generates href under /content for root articles (section=null)", async () => {
    mockGetMostRecentArticles.mockReturnValue([
      sample({ section: null, slug: "ceo-letter" }),
    ]);
    await renderAsync(RecentArticlesSection({ locale: "fr" }));
    const link = screen.getByRole("link");
    expect(link.getAttribute("href")).toBe("/content/ceo-letter");
  });
});
