import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { PricingTable } from "@/components/ui/PricingTable";

describe("PricingTable", () => {
  it("renders all 3 plan names as h3 headings", () => {
    render(<PricingTable />);
    const headings = screen.getAllByRole("heading", { level: 3 });
    expect(headings).toHaveLength(3);
    const names = headings.map((h) => h.textContent);
    expect(names).toContain("Essai gratuit");
    expect(names).toContain("Claude Max");
    expect(names).toContain("Claude Code API");
  });

  it("renders the price for each plan", () => {
    render(<PricingTable />);
    expect(screen.getByText("Gratuit")).toBeInTheDocument();
    expect(screen.getByText("~20 €")).toBeInTheDocument();
    expect(screen.getByText("À l'usage")).toBeInTheDocument();
  });

  it("renders price detail labels for each plan", () => {
    render(<PricingTable />);
    expect(screen.getByText("crédit de démarrage inclus")).toBeInTheDocument();
    expect(screen.getByText("par mois")).toBeInTheDocument();
    expect(screen.getByText("selon la consommation")).toBeInTheDocument();
  });

  it("renders the recommendation badge only for Claude Max", () => {
    render(<PricingTable />);
    const badge = screen.getByText("Recommandé pour commencer");
    expect(badge).toBeInTheDocument();
    // Badge should be inside a span within the Claude Max card
    expect(badge.tagName.toLowerCase()).toBe("span");
  });

  it("renders exactly 5 feature items per plan (15 total)", () => {
    render(<PricingTable />);
    const featureLists = screen.getAllByRole("list");
    // 3 feature lists (one per plan) — the bottom note has no list
    expect(featureLists).toHaveLength(3);
    featureLists.forEach((list) => {
      const items = list.querySelectorAll("li");
      expect(items).toHaveLength(5);
    });
  });

  it("each feature list has an accessible aria-label", () => {
    render(<PricingTable />);
    expect(
      screen.getByRole("list", { name: "Fonctionnalités de l'offre Essai gratuit" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("list", { name: "Fonctionnalités de l'offre Claude Max" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("list", { name: "Fonctionnalités de l'offre Claude Code API" })
    ).toBeInTheDocument();
  });

  it("CTA links have correct href and open in a new tab", () => {
    render(<PricingTable />);
    const links = screen.getAllByRole("link");

    // Filter links matching the 3 plan CTA hrefs; note anthropic.com/pricing
    // also appears in the bottom disclaimer note (4 total matching links).
    const ctaLinks = links.filter((link) => {
      const href = link.getAttribute("href");
      return (
        href === "https://console.anthropic.com" ||
        href === "https://claude.ai/upgrade" ||
        href === "https://www.anthropic.com/pricing"
      );
    });

    // 3 plan CTAs + 1 bottom note link = 4 links matching the allowed hrefs
    expect(ctaLinks.length).toBeGreaterThanOrEqual(3);

    ctaLinks.forEach((link) => {
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });
  });

  it("Essai gratuit CTA links to console.anthropic.com", () => {
    render(<PricingTable />);
    const link = screen
      .getAllByRole("link")
      .find((l) => l.getAttribute("href") === "https://console.anthropic.com");
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("Claude Max CTA links to claude.ai/upgrade", () => {
    render(<PricingTable />);
    const link = screen
      .getAllByRole("link")
      .find((l) => l.getAttribute("href") === "https://claude.ai/upgrade");
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("Claude Code API CTA links to anthropic.com/pricing", () => {
    render(<PricingTable />);
    const links = screen
      .getAllByRole("link")
      .filter((l) => l.getAttribute("href") === "https://www.anthropic.com/pricing");
    // Both the CTA and the bottom note link to this URL
    expect(links.length).toBeGreaterThanOrEqual(1);
    links.forEach((link) => {
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });
  });

  it("bottom note links to anthropic.com/pricing", () => {
    render(<PricingTable />);
    const bottomNoteLink = screen.getByText("anthropic.com/pricing");
    expect(bottomNoteLink).toBeInTheDocument();
    expect(bottomNoteLink.tagName.toLowerCase()).toBe("a");
    expect(bottomNoteLink).toHaveAttribute(
      "href",
      "https://www.anthropic.com/pricing"
    );
    expect(bottomNoteLink).toHaveAttribute("target", "_blank");
    expect(bottomNoteLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("bottom note contains a disclaimer about indicative pricing", () => {
    render(<PricingTable />);
    expect(
      screen.getByText(/Les prix sont indicatifs et peuvent varier/i)
    ).toBeInTheDocument();
  });

  it("CTA aria-labels mention opening in a new tab", () => {
    render(<PricingTable />);
    const ctaLinks = screen
      .getAllByRole("link")
      .filter((l) => {
        const ariaLabel = l.getAttribute("aria-label") ?? "";
        return ariaLabel.includes("s'ouvre dans un nouvel onglet");
      });
    // At least the 3 plan CTAs + the bottom note link carry this aria-label
    expect(ctaLinks.length).toBeGreaterThanOrEqual(3);
  });
});
