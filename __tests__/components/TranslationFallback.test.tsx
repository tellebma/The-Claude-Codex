import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
    [key: string]: unknown;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

import { TranslationFallback } from "@/components/ui/TranslationFallback";

describe("TranslationFallback", () => {
  it("English locale: shows English title and links to French version", () => {
    render(<TranslationFallback locale="en" slug="my-page" />);
    expect(
      screen.getByText("This page is not yet available in English")
    ).toBeInTheDocument();
    const link = screen.getByRole("link", { name: /Read in French/i });
    expect(link).toHaveAttribute("href", "/fr/content/my-page");
  });

  it("French locale: shows French title and links to English version", () => {
    render(<TranslationFallback locale="fr" slug="ma-page" />);
    expect(
      screen.getByText("Cette page n'est pas encore disponible en français")
    ).toBeInTheDocument();
    const link = screen.getByRole("link", { name: /Lire en anglais/i });
    expect(link).toHaveAttribute("href", "/en/content/ma-page");
  });

  it("with section: href is /{fallbackLocale}/{section}/{slug}", () => {
    render(
      <TranslationFallback locale="en" slug="my-page" section="getting-started" />
    );
    const link = screen.getByRole("link", { name: /Read in French/i });
    expect(link).toHaveAttribute("href", "/fr/getting-started/my-page");
  });

  it("without section: href is /{fallbackLocale}/content/{slug}", () => {
    render(<TranslationFallback locale="fr" slug="my-article" />);
    const link = screen.getByRole("link", { name: /Lire en anglais/i });
    expect(link).toHaveAttribute("href", "/en/content/my-article");
  });

  it("renders heading with title", () => {
    render(<TranslationFallback locale="en" slug="my-page" />);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading.textContent).toBe("This page is not yet available in English");
  });

  it("renders CTA link text", () => {
    render(<TranslationFallback locale="en" slug="my-page" />);
    expect(screen.getByText("Read in French")).toBeInTheDocument();
  });
});
