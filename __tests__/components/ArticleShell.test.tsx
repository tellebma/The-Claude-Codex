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

  describe("sectionPeers (TUTO-3)", () => {
    it("keeps the TOC rail hidden below xl when no sectionPeers is passed", () => {
      const { container } = render(
        <ArticleShell shareUrl="x" shareTitle="t">
          <p />
        </ArticleShell>
      );
      const rail = container.querySelector(".art-toc-rail");
      expect(rail).not.toBeNull();
      // Pages /content : comportement inchange, rail masque sous xl.
      expect(rail?.className).toContain("hidden");
      expect(rail?.className).toContain("xl:block");
    });

    it("renders the sectionPeers node alongside the TOC when provided", () => {
      render(
        <ArticleShell
          shareUrl="x"
          shareTitle="t"
          sectionPeers={<nav data-testid="peers">peers</nav>}
        >
          <p />
        </ArticleShell>
      );
      expect(screen.getByTestId("peers")).toBeInTheDocument();
      expect(screen.getByTestId("mocked-toc")).toBeInTheDocument();
    });

    it("makes the rail visible below xl when sectionPeers is present (accordeon)", () => {
      const { container } = render(
        <ArticleShell
          shareUrl="x"
          shareTitle="t"
          sectionPeers={<nav data-testid="peers">peers</nav>}
        >
          <p />
        </ArticleShell>
      );
      const rail = container.querySelector(".art-toc-rail");
      expect(rail).not.toBeNull();
      // Le rail ne doit pas etre masque sous xl : l'accordeon SectionPeers
      // doit pouvoir s'afficher sur mobile/tablette.
      expect(rail?.className).not.toContain("hidden");
    });
  });
});
