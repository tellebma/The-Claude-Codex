import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import React from "react";

import { ArticleThemeFilter } from "@/components/ui/ArticleThemeFilter";
import type { ThemeKey } from "@/lib/themes";

const themeNames: Record<ThemeKey, string> = {
  tutorial: "Tutoriel",
  guide: "Guide",
  reference: "Référence",
  comparison: "Comparatif",
  "use-case": "Cas d'usage",
  security: "Sécurité",
  devsecops: "DevSecOps",
  architecture: "Architecture",
  performance: "Performance",
  tooling: "Outils",
  productivity: "Productivité",
  migration: "Migration",
};

const labels = {
  ariaLabel: "Filtrer par thème",
  typeGroup: "Type",
  domainGroup: "Domaine",
  themeNames,
  countSingular: "article",
  countPlural: "articles",
  reset: "Réinitialiser les filtres",
  emptyTitle: "Aucun article ne correspond à ces filtres.",
  emptyCta: "Réinitialiser les filtres",
};

interface FixtureArticle {
  slug: string;
  themes?: ReadonlyArray<ThemeKey>;
}

const articles: FixtureArticle[] = [
  { slug: "a-security", themes: ["tutorial", "security"] },
  { slug: "b-architecture", themes: ["guide", "architecture"] },
  { slug: "c-productivity", themes: ["use-case", "productivity"] },
  { slug: "d-no-themes" },
];

const cardsBySlug: Record<string, React.ReactNode> = Object.fromEntries(
  articles.map((a) => [a.slug, <article key={a.slug} data-slug={a.slug}>{a.slug}</article>]),
);

describe("ArticleThemeFilter", () => {
  beforeEach(() => {
    (window as unknown as { _paq: unknown[] })._paq = [];
  });

  afterEach(() => {
    delete (window as unknown as { _paq?: unknown[] })._paq;
    vi.restoreAllMocks();
  });

  it("renders 12 chips grouped in Type (5) and Domaine (7) sections", () => {
    render(
      <ArticleThemeFilter
        articles={articles}
        cardsBySlug={cardsBySlug}
        labels={labels}
      />,
    );
    const chips = screen.getAllByRole("button");
    expect(chips).toHaveLength(12);
    expect(screen.getByText("Type")).toBeInTheDocument();
    expect(screen.getByText("Domaine")).toBeInTheDocument();
  });

  it("renders all articles when no filter is active", () => {
    render(
      <ArticleThemeFilter
        articles={articles}
        cardsBySlug={cardsBySlug}
        labels={labels}
      />,
    );
    expect(screen.getByText(/^4$/)).toBeInTheDocument();
    expect(screen.getByText("a-security")).toBeInTheDocument();
    expect(screen.getByText("d-no-themes")).toBeInTheDocument();
  });

  it("toggles a chip and filters articles down to matching themes", () => {
    render(
      <ArticleThemeFilter
        articles={articles}
        cardsBySlug={cardsBySlug}
        labels={labels}
      />,
    );
    const securityChip = screen.getByRole("button", { name: /Sécurité/ });
    expect(securityChip).toHaveAttribute("aria-pressed", "false");
    fireEvent.click(securityChip);
    expect(securityChip).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText("a-security")).toBeInTheDocument();
    expect(screen.queryByText("b-architecture")).not.toBeInTheDocument();
    expect(screen.queryByText("d-no-themes")).not.toBeInTheDocument();
  });

  it("applies OR logic across multiple active chips", () => {
    render(
      <ArticleThemeFilter
        articles={articles}
        cardsBySlug={cardsBySlug}
        labels={labels}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: /Sécurité/ }));
    fireEvent.click(screen.getByRole("button", { name: /Architecture/ }));
    expect(screen.getByText("a-security")).toBeInTheDocument();
    expect(screen.getByText("b-architecture")).toBeInTheDocument();
    expect(screen.queryByText("c-productivity")).not.toBeInTheDocument();
    expect(screen.queryByText("d-no-themes")).not.toBeInTheDocument();
  });

  it("emits Matomo event with value=1 on activation and value=0 on deactivation", () => {
    render(
      <ArticleThemeFilter
        articles={articles}
        cardsBySlug={cardsBySlug}
        labels={labels}
      />,
    );
    const chip = screen.getByRole("button", { name: /Tutoriel/ });
    fireEvent.click(chip);
    fireEvent.click(chip);
    const paq = (window as unknown as { _paq: unknown[][] })._paq;
    expect(paq).toHaveLength(2);
    expect(paq[0]).toEqual([
      "trackEvent",
      "content_index",
      "article_theme_filter_toggle",
      "tutorial",
      1,
    ]);
    expect(paq[1]).toEqual([
      "trackEvent",
      "content_index",
      "article_theme_filter_toggle",
      "tutorial",
      0,
    ]);
  });

  it("shows empty state when no article matches active filters", () => {
    render(
      <ArticleThemeFilter
        articles={articles}
        cardsBySlug={cardsBySlug}
        labels={labels}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: /Migration/ }));
    expect(
      screen.getByText("Aucun article ne correspond à ces filtres."),
    ).toBeInTheDocument();
    const ctas = screen.getAllByRole("button", {
      name: /Réinitialiser les filtres/,
    });
    expect(ctas.length).toBeGreaterThanOrEqual(1);
  });

  it("reset CTA clears all active filters and restores full grid", () => {
    render(
      <ArticleThemeFilter
        articles={articles}
        cardsBySlug={cardsBySlug}
        labels={labels}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: /Sécurité/ }));
    const resetButtons = screen.getAllByRole("button", {
      name: /Réinitialiser les filtres/,
    });
    fireEvent.click(resetButtons[0]);
    expect(
      screen.getByRole("button", { name: /Sécurité/ }),
    ).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByText("a-security")).toBeInTheDocument();
    expect(screen.getByText("d-no-themes")).toBeInTheDocument();
  });

  it("Escape key on a chip resets all active filters", () => {
    render(
      <ArticleThemeFilter
        articles={articles}
        cardsBySlug={cardsBySlug}
        labels={labels}
      />,
    );
    const securityChip = screen.getByRole("button", { name: /Sécurité/ });
    fireEvent.click(securityChip);
    fireEvent.keyDown(securityChip, { key: "Escape" });
    expect(securityChip).toHaveAttribute("aria-pressed", "false");
  });

  it("Escape key on a chip is a no-op when no filter is active", () => {
    render(
      <ArticleThemeFilter
        articles={articles}
        cardsBySlug={cardsBySlug}
        labels={labels}
      />,
    );
    const tutorialChip = screen.getByRole("button", { name: /Tutoriel/ });
    fireEvent.keyDown(tutorialChip, { key: "Escape" });
    const chips = screen.getAllByRole("button");
    for (const chip of chips) {
      expect(chip).toHaveAttribute("aria-pressed", "false");
    }
  });

  it("exposes role=group with provided aria-label and aria-live polite on count", () => {
    render(
      <ArticleThemeFilter
        articles={articles}
        cardsBySlug={cardsBySlug}
        labels={labels}
      />,
    );
    expect(
      screen.getByRole("group", { name: /Filtrer par thème/ }),
    ).toBeInTheDocument();
    const counter = screen.getByText(/4/).closest("p");
    expect(counter).toHaveAttribute("aria-live", "polite");
  });

  it("marks the first Type chip with data-theme-filter-first for focus from hero CTA", () => {
    const { container } = render(
      <ArticleThemeFilter
        articles={articles}
        cardsBySlug={cardsBySlug}
        labels={labels}
      />,
    );
    const firstChip = container.querySelector("[data-theme-filter-first]");
    expect(firstChip).not.toBeNull();
    expect(firstChip).toHaveTextContent("Tutoriel");
  });

  it("excludes articles without themes when any filter is active", () => {
    render(
      <ArticleThemeFilter
        articles={articles}
        cardsBySlug={cardsBySlug}
        labels={labels}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: /Tutoriel/ }));
    expect(screen.queryByText("d-no-themes")).not.toBeInTheDocument();
  });

  it("reset button is hidden when no filter is active", () => {
    render(
      <ArticleThemeFilter
        articles={articles}
        cardsBySlug={cardsBySlug}
        labels={labels}
      />,
    );
    const resetButtons = screen.queryAllByRole("button", {
      name: /Réinitialiser les filtres/,
    });
    expect(resetButtons).toHaveLength(0);
  });

  it("updates dynamic counter when filters change", () => {
    render(
      <ArticleThemeFilter
        articles={articles}
        cardsBySlug={cardsBySlug}
        labels={labels}
      />,
    );
    expect(screen.getByText(/^4$/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Sécurité/ }));
    expect(screen.getByText(/^1$/)).toBeInTheDocument();
  });

  it("renders only filtered articles in the grid via cardsBySlug lookup", () => {
    const { container } = render(
      <ArticleThemeFilter
        articles={articles}
        cardsBySlug={cardsBySlug}
        labels={labels}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: /Architecture/ }));
    const grid = container.querySelector(".grid");
    expect(grid).not.toBeNull();
    const renderedSlugs = within(grid as HTMLElement)
      .getAllByText(/^[a-d]-/)
      .map((node) => node.textContent);
    expect(renderedSlugs).toEqual(["b-architecture"]);
  });
});
