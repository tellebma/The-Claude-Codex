import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";

vi.mock("@/lib/mdx", () => ({
  countAllArticles: vi.fn(),
  countAllSections: vi.fn(),
  getLastModifiedDate: vi.fn(),
}));

import { countAllArticles, countAllSections, getLastModifiedDate } from "@/lib/mdx";
import { CodexStatsBand } from "@/components/ui/CodexStatsBand";

const mockCountAllArticles = vi.mocked(countAllArticles);
const mockCountAllSections = vi.mocked(countAllSections);
const mockGetLastModifiedDate = vi.mocked(getLastModifiedDate);

async function renderAsync(node: React.ReactNode) {
  const resolved = await node;
  return render(resolved as React.ReactElement);
}

describe("CodexStatsBand", () => {
  beforeEach(() => {
    mockCountAllArticles.mockReturnValue(42);
    mockCountAllSections.mockReturnValue(10);
    mockGetLastModifiedDate.mockReturnValue(new Date("2026-04-15T00:00:00Z"));
  });

  it("renders 4 stats (articles, sections, languages, last update)", async () => {
    await renderAsync(CodexStatsBand({ locale: "fr" }));
    expect(screen.getByText("42")).toBeInTheDocument(); // articles
    expect(screen.getByText("10")).toBeInTheDocument(); // sections
    expect(screen.getByText("2")).toBeInTheDocument(); // languages (constante)
  });

  it("renders the section with aria-label from translations", async () => {
    await renderAsync(CodexStatsBand({ locale: "fr" }));
    const section = screen.getByRole("region", { name: "ariaLabel" });
    expect(section).toBeInTheDocument();
  });

  it("hides the section when articlesCount is 0 (graceful fallback)", async () => {
    mockCountAllArticles.mockReturnValue(0);
    const { container } = await renderAsync(CodexStatsBand({ locale: "fr" }));
    expect(container.firstChild).toBeNull();
  });

  it("renders an em-dash placeholder when no last modified date is available", async () => {
    mockGetLastModifiedDate.mockReturnValue(null);
    await renderAsync(CodexStatsBand({ locale: "fr" }));
    expect(screen.getByText("—")).toBeInTheDocument();
  });

  it("uses semantic tokens for the dark band background", async () => {
    const { container } = await renderAsync(CodexStatsBand({ locale: "fr" }));
    const section = container.firstElementChild as HTMLElement;
    expect(section?.className).toContain("bg-[color:var(--color-slate-900)]");
    expect(section?.className).not.toMatch(/dark:bg/);
  });

  it("does not render a <dl> (axe a11y rule only-dlitems)", async () => {
    const { container } = await renderAsync(CodexStatsBand({ locale: "fr" }));
    expect(container.querySelector("dl")).toBeNull();
  });
});
