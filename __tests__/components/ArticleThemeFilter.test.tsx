import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import React from "react";

import {
  ArticleThemeFilter,
  parseThemeQueryParam,
  serializeThemeFilters,
  THEME_QUERY_PARAM,
} from "@/components/ui/ArticleThemeFilter";
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
    window.history.replaceState(null, "", "/fr/content/");
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

describe("parseThemeQueryParam (CTN-13)", () => {
  it("returns an empty set when raw is null or empty", () => {
    expect(parseThemeQueryParam(null).size).toBe(0);
    expect(parseThemeQueryParam("").size).toBe(0);
  });

  it("parses a single valid theme key", () => {
    const result = parseThemeQueryParam("tutorial");
    expect(result.has("tutorial")).toBe(true);
    expect(result.size).toBe(1);
  });

  it("parses multiple comma-separated valid keys", () => {
    const result = parseThemeQueryParam("tutorial,security,architecture");
    expect(Array.from(result).sort()).toEqual([
      "architecture",
      "security",
      "tutorial",
    ]);
  });

  it("trims whitespace around each token", () => {
    const result = parseThemeQueryParam(" tutorial , security ");
    expect(result.has("tutorial")).toBe(true);
    expect(result.has("security")).toBe(true);
  });

  it("silently drops unknown keys", () => {
    const result = parseThemeQueryParam("tutorial,unknown,security");
    expect(result.has("tutorial")).toBe(true);
    expect(result.has("security")).toBe(true);
    expect(result.size).toBe(2);
  });

  it("returns an empty set when all values are invalid", () => {
    expect(parseThemeQueryParam("foo,bar,baz").size).toBe(0);
  });
});

describe("serializeThemeFilters (CTN-13)", () => {
  it("returns null for an empty set", () => {
    expect(serializeThemeFilters(new Set())).toBeNull();
  });

  it("joins multiple keys with comma", () => {
    const result = serializeThemeFilters(
      new Set<ThemeKey>(["tutorial", "security"]),
    );
    expect(result).toMatch(/^(tutorial,security|security,tutorial)$/);
  });

  it("returns a single key without trailing comma", () => {
    expect(serializeThemeFilters(new Set<ThemeKey>(["tutorial"]))).toBe(
      "tutorial",
    );
  });
});

describe("ArticleThemeFilter URL state (CTN-13)", () => {
  beforeEach(() => {
    (window as unknown as { _paq: unknown[] })._paq = [];
    window.history.replaceState(null, "", "/fr/content/");
  });

  afterEach(() => {
    delete (window as unknown as { _paq?: unknown[] })._paq;
    vi.restoreAllMocks();
  });

  it("uses 'theme' as the query parameter key", () => {
    expect(THEME_QUERY_PARAM).toBe("theme");
  });

  it("applies filters parsed from ?theme= at mount", () => {
    window.history.replaceState(null, "", "/fr/content/?theme=security,tutorial");
    render(
      <ArticleThemeFilter
        articles={articles}
        cardsBySlug={cardsBySlug}
        labels={labels}
      />,
    );
    expect(
      screen.getByRole("button", { name: /Sécurité/ }),
    ).toHaveAttribute("aria-pressed", "true");
    expect(
      screen.getByRole("button", { name: /Tutoriel/ }),
    ).toHaveAttribute("aria-pressed", "true");
    expect(screen.queryByText("d-no-themes")).not.toBeInTheDocument();
  });

  it("ignores unknown keys silently in the URL parameter", () => {
    window.history.replaceState(null, "", "/fr/content/?theme=tutorial,fake,security");
    render(
      <ArticleThemeFilter
        articles={articles}
        cardsBySlug={cardsBySlug}
        labels={labels}
      />,
    );
    expect(
      screen.getByRole("button", { name: /Tutoriel/ }),
    ).toHaveAttribute("aria-pressed", "true");
    expect(
      screen.getByRole("button", { name: /Sécurité/ }),
    ).toHaveAttribute("aria-pressed", "true");
  });

  it("writes ?theme= to the URL after toggling a chip", () => {
    render(
      <ArticleThemeFilter
        articles={articles}
        cardsBySlug={cardsBySlug}
        labels={labels}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: /Sécurité/ }));
    expect(window.location.pathname).toBe("/fr/content/");
    expect(window.location.search).toBe("?theme=security");
  });

  it("removes ?theme= from URL when filters are cleared via reset", () => {
    window.history.replaceState(null, "", "/fr/content/?theme=security");
    render(
      <ArticleThemeFilter
        articles={articles}
        cardsBySlug={cardsBySlug}
        labels={labels}
      />,
    );
    const resetButtons = screen.getAllByRole("button", {
      name: /Réinitialiser les filtres/,
    });
    fireEvent.click(resetButtons[0]);
    expect(window.location.search).toBe("");
    expect(window.location.pathname).toBe("/fr/content/");
  });

  it("preserves the order of selection when serializing multiple themes", () => {
    render(
      <ArticleThemeFilter
        articles={articles}
        cardsBySlug={cardsBySlug}
        labels={labels}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: /Sécurité/ }));
    fireEvent.click(screen.getByRole("button", { name: /Architecture/ }));
    expect(window.location.search).toBe("?theme=security,architecture");
  });

  it("preserves unrelated query params when writing the theme filter", () => {
    window.history.replaceState(null, "", "/fr/content/?utm_source=newsletter");
    render(
      <ArticleThemeFilter
        articles={articles}
        cardsBySlug={cardsBySlug}
        labels={labels}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: /Sécurité/ }));
    expect(window.location.search).toContain("theme=security");
    expect(window.location.search).toContain("utm_source=newsletter");
  });

  it("does not throw when the URL has no query string at mount", () => {
    expect(() =>
      render(
        <ArticleThemeFilter
          articles={articles}
          cardsBySlug={cardsBySlug}
          labels={labels}
        />,
      ),
    ).not.toThrow();
  });
});
