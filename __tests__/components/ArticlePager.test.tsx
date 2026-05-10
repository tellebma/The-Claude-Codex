import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ArticlePager } from "@/components/layout/ArticlePager";

vi.mock("@/i18n/navigation", () => ({
  Link: ({ href, children, ...rest }: { href: string; children: React.ReactNode } & Record<string, unknown>) => (
    <a href={href} {...rest}>{children}</a>
  ),
}));

const sampleArticle = { href: "/content/slug-a/", title: "Article A" };
const sampleNext = { href: "/content/slug-b/", title: "Article B" };

describe("ArticlePager", () => {
  it("returns null when both prev and next are missing", () => {
    const { container } = render(
      <ArticlePager prev={null} next={null} previousLabel="Prev" nextLabel="Next" />
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders only the prev card when next is null (renders an empty placeholder for grid alignment)", () => {
    render(
      <ArticlePager
        prev={sampleArticle}
        next={null}
        previousLabel="Précédent"
        nextLabel="Suivant"
      />
    );
    expect(screen.getByText("Article A")).toBeInTheDocument();
    expect(screen.queryByText("Article B")).toBeNull();
    // 1 link rendered for prev
    expect(screen.getAllByRole("link")).toHaveLength(1);
  });

  it("renders only the next card when prev is null", () => {
    render(
      <ArticlePager
        prev={null}
        next={sampleNext}
        previousLabel="Précédent"
        nextLabel="Suivant"
      />
    );
    expect(screen.getByText("Article B")).toBeInTheDocument();
    expect(screen.getAllByRole("link")).toHaveLength(1);
  });

  it("renders both cards with correct hrefs and labels", () => {
    render(
      <ArticlePager
        prev={sampleArticle}
        next={sampleNext}
        previousLabel="Précédent"
        nextLabel="Suivant"
      />
    );
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(2);
    expect(links[0].getAttribute("href")).toBe("/content/slug-a/");
    expect(links[1].getAttribute("href")).toBe("/content/slug-b/");
    expect(screen.getByText("Précédent")).toBeInTheDocument();
    expect(screen.getByText("Suivant")).toBeInTheDocument();
  });

  it("nav has aria-label combining previous and next labels (named landmark)", () => {
    render(
      <ArticlePager
        prev={sampleArticle}
        next={sampleNext}
        previousLabel="Prev"
        nextLabel="Next"
      />
    );
    expect(screen.getByRole("navigation", { name: "Prev / Next" })).toBeInTheDocument();
  });

  it("uses the art-pager class so the source design CSS matches if loaded", () => {
    const { container } = render(
      <ArticlePager
        prev={sampleArticle}
        next={sampleNext}
        previousLabel="P"
        nextLabel="N"
      />
    );
    const nav = container.querySelector("nav");
    expect(nav?.className).toContain("art-pager");
  });

  it("next card aligns text to the right (RG2-08 spec)", () => {
    render(
      <ArticlePager
        prev={null}
        next={sampleNext}
        previousLabel="P"
        nextLabel="N"
      />
    );
    const link = screen.getByRole("link");
    expect(link.className).toContain("text-right");
  });
});
