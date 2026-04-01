import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { Header } from "@/components/layout/Header";

let mockPathname = "/";

vi.mock("@/i18n/navigation", () => ({
  Link: ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
    [key: string]: unknown;
  }) => {
    const resolvedHref = typeof href === "object" ? "/" : href;
    return (
      <a href={resolvedHref} {...props}>
        {children}
      </a>
    );
  },
  usePathname: () => mockPathname,
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
}));

describe("Header", () => {
  beforeEach(() => {
    mockPathname = "/";
  });

  it("renders the site logo link", () => {
    render(<Header />);
    const logoLinks = screen
      .getAllByRole("link")
      .filter((link) => link.getAttribute("href") === "/");
    expect(logoLinks.length).toBeGreaterThan(0);
  });

  it("renders all navigation items by their href", () => {
    render(<Header />);
    // primaryNav items are always visible in desktop nav
    const primaryHrefs = [
      "/getting-started",
      "/mcp",
      "/skills",
      "/prompting",
      "/use-cases",
      "/enterprise",
    ];

    for (const href of primaryHrefs) {
      const links = screen
        .getAllByRole("link")
        .filter((link) => link.getAttribute("href") === href);
      // Desktop nav always visible; mobile nav may be inert
      expect(links.length).toBeGreaterThanOrEqual(1);
    }

    // secondaryNav items are inside a closed dropdown (not rendered until opened)
    const secondaryHrefs = [
      "/personas",
      "/advanced",
      "/configurator",
      "/content",
      "/limits",
      "/reference",
      "/glossary",
      "/future",
    ];
    // Open the "More" dropdown — mock returns the key "more"
    const moreButton = screen.getByRole("button", { name: /more/ });
    fireEvent.click(moreButton);
    for (const href of secondaryHrefs) {
      // Dropdown items have role="menuitem" set explicitly
      const items = screen
        .getAllByRole("menuitem")
        .filter((item) => item.getAttribute("href") === href);
      expect(items.length).toBeGreaterThanOrEqual(1);
    }
  });

  it("marks the active navigation link with aria-current", () => {
    mockPathname = "/mcp";
    render(<Header />);
    const activeLinks = screen.getAllByRole("link", { current: "page" });
    expect(activeLinks.length).toBeGreaterThan(0);
    const isMcpActive = activeLinks.some(
      (link) => link.getAttribute("href") === "/mcp"
    );
    expect(isMcpActive).toBe(true);
  });

  it("marks sub-page navigation as active too", () => {
    mockPathname = "/mcp/setup";
    render(<Header />);
    const activeLinks = screen.getAllByRole("link", { current: "page" });
    const isMcpActive = activeLinks.some(
      (link) => link.getAttribute("href") === "/mcp"
    );
    expect(isMcpActive).toBe(true);
  });

  it("has no active nav links on homepage", () => {
    mockPathname = "/";
    render(<Header />);
    const navLinks = screen
      .getAllByRole("link")
      .filter(
        (link) =>
          link.getAttribute("href") !== "/" &&
          link.getAttribute("aria-current") === "page"
      );
    expect(navLinks).toHaveLength(0);
  });

  it("renders mobile menu toggle button", () => {
    render(<Header />);
    // useTranslations mock returns the key: "menuToggle"
    const menuButton = screen.getByRole("button", {
      name: "menuToggle",
    });
    expect(menuButton).toBeInTheDocument();
    expect(menuButton.getAttribute("aria-expanded")).toBe("false");
  });

  it("toggles mobile menu open and closed", () => {
    render(<Header />);
    const menuButton = screen.getByRole("button", {
      name: "menuToggle",
    });

    fireEvent.click(menuButton);
    expect(menuButton.getAttribute("aria-expanded")).toBe("true");

    fireEvent.click(menuButton);
    expect(menuButton.getAttribute("aria-expanded")).toBe("false");
  });

  it("renders search dialog trigger", () => {
    render(<Header />);
    // SearchDialog uses useTranslations("search") — button label is a translation key
    const searchButton = screen.getByRole("button", {
      name: /trigger/,
    });
    expect(searchButton).toBeInTheDocument();
  });
});
