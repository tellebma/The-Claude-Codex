import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Footer } from "@/components/layout/Footer";

describe("Footer", () => {
  it("renders the site brand name", () => {
    render(<Footer />);
    // The brand text is split across elements: "The Claude " and "Codex"
    const brand = screen.getByText((_, element) => {
      return (
        element?.textContent === "The Claude Codex" && element.tagName === "A"
      );
    });
    expect(brand).toBeInTheDocument();
  });

  it("renders Guide section links", () => {
    render(<Footer />);
    const guideLinks = [
      { href: "/getting-started" },
      { href: "/mcp" },
      { href: "/skills" },
      { href: "/prompting" },
    ];

    for (const link of guideLinks) {
      const foundLinks = screen
        .getAllByRole("link")
        .filter((el) => el.getAttribute("href") === link.href);
      expect(foundLinks.length).toBeGreaterThan(0);
    }
  });

  it("renders Resources section with external links", () => {
    render(<Footer />);
    const externalLinks = screen
      .getAllByRole("link")
      .filter((link) => link.getAttribute("target") === "_blank");
    expect(externalLinks.length).toBeGreaterThanOrEqual(2);
    // Verify they have rel="noopener noreferrer"
    for (const link of externalLinks) {
      expect(link.getAttribute("rel")).toContain("noopener");
    }
  });

  it("renders the current year", () => {
    render(<Footer />);
    const year = new Date().getFullYear().toString();
    const yearText = screen.getByText(new RegExp(year));
    expect(yearText).toBeInTheDocument();
  });

  it("includes open-source text (translation key)", () => {
    render(<Footer />);
    // useTranslations mock returns the key: tCommon("openSource") -> "openSource"
    expect(screen.getByText(/openSource/)).toBeInTheDocument();
  });

  it("renders GitHub link", () => {
    render(<Footer />);
    const githubLink = screen.getByRole("link", { name: /GitHub/ });
    expect(githubLink).toBeInTheDocument();
    expect(githubLink.getAttribute("href")).toContain("github.com");
    expect(githubLink.getAttribute("target")).toBe("_blank");
  });

  it("has accessible navigation landmarks", () => {
    render(<Footer />);
    // useTranslations mock returns the key: tCommon("guides") -> "guides"
    const navGuides = screen.getByRole("navigation", { name: "guides" });
    // tCommon("resources") -> "resources"
    const navResources = screen.getByRole("navigation", {
      name: "resources",
    });
    expect(navGuides).toBeInTheDocument();
    expect(navResources).toBeInTheDocument();
  });

  it("renders Vision & Futur link in resources", () => {
    render(<Footer />);
    const visionLink = screen
      .getAllByRole("link")
      .filter((el) => el.getAttribute("href") === "/future");
    expect(visionLink.length).toBeGreaterThan(0);
  });
});
