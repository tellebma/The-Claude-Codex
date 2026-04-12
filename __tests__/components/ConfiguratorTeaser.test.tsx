import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { ConfiguratorTeaser } from "@/components/ui/ConfiguratorTeaser";

describe("ConfiguratorTeaser", () => {
  it("renders title from translation keys", () => {
    render(<ConfiguratorTeaser />);
    // The mock returns the key as-is: t("title") -> "title", t("titleHighlight") -> "titleHighlight"
    expect(screen.getByText("title")).toBeInTheDocument();
    expect(screen.getByText("titleHighlight")).toBeInTheDocument();
  });

  it("renders description", () => {
    render(<ConfiguratorTeaser />);
    // t("description") -> "description"
    expect(screen.getByText("description")).toBeInTheDocument();
  });

  it("renders 3 feature pills with correct translation keys", () => {
    render(<ConfiguratorTeaser />);
    // t("pillGuided") -> "pillGuided", t("pillMcp") -> "pillMcp", t("pillClaudeMd") -> "pillClaudeMd"
    expect(screen.getByText("pillGuided")).toBeInTheDocument();
    expect(screen.getByText("pillMcp")).toBeInTheDocument();
    expect(screen.getByText("pillClaudeMd")).toBeInTheDocument();
  });

  it("CTA link points to /configurator", () => {
    render(<ConfiguratorTeaser />);
    // t("cta") -> "cta"
    const link = screen.getByRole("link", { name: /cta/i });
    expect(link).toHaveAttribute("href", "/configurator");
  });

  it("decorative icons are aria-hidden", () => {
    const { container } = render(<ConfiguratorTeaser />);
    const svgs = container.querySelectorAll("svg[aria-hidden='true']");
    // Settings (large), Wand2 (badge), Cpu (badge), Wand2 (pill), Cpu (pill), Settings (pill), ArrowRight (CTA)
    expect(svgs.length).toBeGreaterThan(0);
    svgs.forEach((svg) => {
      expect(svg).toHaveAttribute("aria-hidden", "true");
    });
  });
});
