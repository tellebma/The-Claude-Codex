import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ArticleHero } from "@/components/layout/ArticleHero";

describe("ArticleHero", () => {
  it("renders the title only", () => {
    render(<ArticleHero title="Mon article" />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Mon article"
    );
  });

  it("renders the cat pill when category is provided", () => {
    const { container } = render(
      <ArticleHero title="X" category="Securite" />
    );
    expect(container.querySelector(".art-cat-pill")).not.toBeNull();
    expect(screen.getByText("Securite")).toBeInTheDocument();
  });

  it("renders title with gradient highlight when titleHighlight is provided", () => {
    const { container } = render(
      <ArticleHero title="Cle API fuitee ?" titleHighlight="Plan d'action" />
    );
    expect(container.querySelector(".art-title-hl")).not.toBeNull();
    expect(screen.getByText("Plan d'action")).toBeInTheDocument();
  });

  it("renders the lead paragraph", () => {
    render(<ArticleHero title="X" lead="Une introduction." />);
    expect(screen.getByText("Une introduction.")).toBeInTheDocument();
  });

  it("formats published and modified dates with the FR locale by default", () => {
    render(
      <ArticleHero
        title="X"
        datePublished="2026-04-20"
        dateModified="2026-04-23"
        publishedLabel="Publié le"
        modifiedLabel="Mis à jour le"
      />
    );
    // Date FR : "20 avril 2026"
    expect(screen.getByText(/20 avril 2026/)).toBeInTheDocument();
    expect(screen.getByText(/23 avril 2026/)).toBeInTheDocument();
  });

  it("does not render modified date if equal to published", () => {
    render(
      <ArticleHero
        title="X"
        datePublished="2026-04-20"
        dateModified="2026-04-20"
        publishedLabel="Publié le"
      />
    );
    // Only one occurrence of "20 avril"
    expect(screen.getAllByText(/20 avril/)).toHaveLength(1);
  });

  it("falls back to ISO when dates are invalid", () => {
    render(
      <ArticleHero
        title="X"
        datePublished="not-a-date"
        publishedLabel="Publié"
      />
    );
    expect(screen.getByText(/not-a-date/)).toBeInTheDocument();
  });

  it("uses custom locale when provided", () => {
    render(
      <ArticleHero
        title="X"
        datePublished="2026-04-20"
        publishedLabel="Published on"
        locale="en-US"
      />
    );
    // EN format : "April 20, 2026"
    expect(screen.getByText(/April 20, 2026/)).toBeInTheDocument();
  });

  it("does not render meta block when no dates are provided", () => {
    const { container } = render(<ArticleHero title="X" />);
    expect(container.querySelector(".art-meta")).toBeNull();
  });
});
