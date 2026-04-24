import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";

// Mock next/navigation
const mockPathname = vi.fn(() => "/unknown/path");
vi.mock("next/navigation", () => ({
  usePathname: () => mockPathname(),
}));

// Mock next/link (link as native anchor for tests)
vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    ...rest
  }: React.PropsWithChildren<{ href: string }>) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

// Mock InteractiveRobot (React Three Fiber — inutilisable en jsdom)
vi.mock("@/components/ui/InteractiveRobot", () => ({
  InteractiveRobot: ({ ariaLabel }: { ariaLabel?: string }) => (
    <div data-testid="mock-robot" aria-label={ariaLabel}>
      mock robot
    </div>
  ),
}));

// Mock search-index
vi.mock("@/lib/search-index", () => ({
  searchEntries: vi.fn(() => []),
}));

import { NotFoundClient } from "@/components/not-found/NotFoundClient";
import { searchEntries } from "@/lib/search-index";

const mockSearchEntries = vi.mocked(searchEntries);

const FR_BUNDLE = {
  strings: {
    title: "Page introuvable",
    subtitle: "Test subtitle FR",
    suggestionsTitle: "Suggestions FR",
    fallbackTitle: "Par où commencer FR",
    recentTitle: "Articles récents",
    backToHome: "Retour accueil",
    searchHint: "Ouvrir recherche",
    urlLabel: "URL :",
    robotAlt: "Robot",
  },
  fallbackSuggestions: [
    {
      title: "Accueil FR",
      description: "Fallback 1 FR",
      href: "/",
    },
  ],
  recentArticles: [
    {
      title: "Article récent 1",
      description: "Desc 1",
      href: "/content/recent-1",
      datePublished: "2026-04-20",
    },
  ],
};

const EN_BUNDLE = {
  strings: {
    title: "Page not found",
    subtitle: "Test subtitle EN",
    suggestionsTitle: "Suggestions EN",
    fallbackTitle: "Where to start EN",
    recentTitle: "Recent",
    backToHome: "Back home",
    searchHint: "Open search",
    urlLabel: "URL:",
    robotAlt: "Robot",
  },
  fallbackSuggestions: [
    {
      title: "Home EN",
      description: "Fallback 1 EN",
      href: "/",
    },
  ],
  recentArticles: [],
};

const bundles = { fr: FR_BUNDLE, en: EN_BUNDLE };

describe("NotFoundClient", () => {
  beforeEach(() => {
    mockPathname.mockReset();
    mockSearchEntries.mockReset();
    mockSearchEntries.mockReturnValue([]);
  });

  it("affiche le titre et le subtitle FR par défaut", () => {
    mockPathname.mockReturnValue("/unknown/path");
    render(<NotFoundClient defaultLocale="fr" bundles={bundles} />);

    expect(screen.getByText("Page introuvable")).toBeInTheDocument();
    expect(screen.getByText("Test subtitle FR")).toBeInTheDocument();
  });

  it("affiche le titre EN quand defaultLocale=en", () => {
    mockPathname.mockReturnValue("/unknown/path");
    render(<NotFoundClient defaultLocale="en" bundles={bundles} />);

    expect(screen.getByText("Page not found")).toBeInTheDocument();
    expect(screen.getByText("Test subtitle EN")).toBeInTheDocument();
  });

  it("affiche l'URL demandée quand elle n'est pas la racine", () => {
    mockPathname.mockReturnValue("/page-inexistante");
    render(<NotFoundClient defaultLocale="fr" bundles={bundles} />);

    expect(screen.getByText("URL :")).toBeInTheDocument();
    expect(screen.getByText("/page-inexistante")).toBeInTheDocument();
  });

  it("n'affiche pas la section URL si le pathname est racine", () => {
    mockPathname.mockReturnValue("/");
    render(<NotFoundClient defaultLocale="fr" bundles={bundles} />);

    expect(screen.queryByText("URL :")).not.toBeInTheDocument();
  });

  it("utilise les fallback suggestions quand aucune recherche ne matche", () => {
    mockSearchEntries.mockReturnValue([]);
    mockPathname.mockReturnValue("/unknown");
    render(<NotFoundClient defaultLocale="fr" bundles={bundles} />);

    expect(screen.getByText("Par où commencer FR")).toBeInTheDocument();
    expect(screen.getByText("Accueil FR")).toBeInTheDocument();
  });

  it("utilise les résultats de recherche quand il y en a", () => {
    mockSearchEntries.mockReturnValue([
      {
        title: "Result MCP",
        description: "desc mcp",
        href: "/mcp/setup",
        section: "mcp",
        keywords: [],
      },
    ] as ReturnType<typeof searchEntries>);
    mockPathname.mockReturnValue("/mcp");
    render(<NotFoundClient defaultLocale="fr" bundles={bundles} />);

    expect(screen.getByText("Suggestions FR")).toBeInTheDocument();
    expect(screen.getByText("Result MCP")).toBeInTheDocument();
  });

  it("affiche le bouton 'Retour accueil' pointant vers /fr", () => {
    mockPathname.mockReturnValue("/unknown");
    render(<NotFoundClient defaultLocale="fr" bundles={bundles} />);

    const homeLink = screen.getByText("Retour accueil").closest("a");
    expect(homeLink).toHaveAttribute("href", "/fr");
  });

  it("affiche le bouton 'Back home' pointant vers /en quand EN", () => {
    mockPathname.mockReturnValue("/unknown");
    render(<NotFoundClient defaultLocale="en" bundles={bundles} />);

    const homeLink = screen.getByText("Back home").closest("a");
    expect(homeLink).toHaveAttribute("href", "/en");
  });

  it("rend le robot avec aria-label", () => {
    mockPathname.mockReturnValue("/");
    render(<NotFoundClient defaultLocale="fr" bundles={bundles} />);

    const robot = screen.getByTestId("mock-robot");
    expect(robot).toHaveAttribute("aria-label", "Robot");
  });

  it("dispatche un event keydown Ctrl+K au clic sur 'Ouvrir recherche'", () => {
    mockPathname.mockReturnValue("/unknown");
    const spy = vi.spyOn(document, "dispatchEvent");

    render(<NotFoundClient defaultLocale="fr" bundles={bundles} />);
    const button = screen.getByRole("button", { name: /ouvrir recherche/i });
    fireEvent.click(button);

    expect(spy).toHaveBeenCalled();
    const event = spy.mock.calls.find(
      (c) => (c[0] as KeyboardEvent).key === "k",
    );
    expect(event).toBeDefined();
    expect((event?.[0] as KeyboardEvent).ctrlKey).toBe(true);
  });

  it("affiche les articles récents quand il y en a dans le bundle", () => {
    mockPathname.mockReturnValue("/");
    render(<NotFoundClient defaultLocale="fr" bundles={bundles} />);

    expect(screen.getByText("Article récent 1")).toBeInTheDocument();
  });
});
