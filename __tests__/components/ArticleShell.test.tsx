import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ArticleShell } from "@/components/layout/ArticleShell";

vi.mock("@/components/ui/TableOfContents", () => ({
  TableOfContents: () => <nav data-testid="mocked-toc">TOC</nav>,
}));

vi.mock("@/components/ui/ArticleShareRail", () => ({
  ArticleShareRail: ({ url, title }: Readonly<{ url: string; title: string }>) => (
    <aside data-testid="mocked-share" data-url={url} data-title={title} />
  ),
}));

describe("ArticleShell", () => {
  it("renders children inside the article body", () => {
    render(
      <ArticleShell shareUrl="https://x.test/a" shareTitle="A">
        <p>body content</p>
      </ArticleShell>
    );
    expect(screen.getByText("body content")).toBeInTheDocument();
  });

  it("forwards share metadata to ArticleShareRail", () => {
    const { container } = render(
      <ArticleShell shareUrl="https://x.test/a" shareTitle="My title">
        <p />
      </ArticleShell>
    );
    const share = container.querySelector('[data-testid="mocked-share"]');
    expect(share).not.toBeNull();
    expect(share?.getAttribute("data-url")).toBe("https://x.test/a");
    expect(share?.getAttribute("data-title")).toBe("My title");
  });

  it("renders the TOC rail", () => {
    render(
      <ArticleShell shareUrl="x" shareTitle="t">
        <p />
      </ArticleShell>
    );
    expect(screen.getByTestId("mocked-toc")).toBeInTheDocument();
  });

  it("uses art-shell + art-body grid classes", () => {
    const { container } = render(
      <ArticleShell shareUrl="x" shareTitle="t">
        <p />
      </ArticleShell>
    );
    expect(container.querySelector(".art-shell")).not.toBeNull();
    expect(container.querySelector(".art-body")).not.toBeNull();
  });
});
