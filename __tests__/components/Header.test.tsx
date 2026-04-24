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

  it("closes more dropdown when Escape is pressed on the button", () => {
    render(<Header />);
    const moreButton = screen.getByRole("button", { name: /more/ });

    // Open the dropdown
    fireEvent.click(moreButton);
    expect(screen.getByRole("menu")).toBeInTheDocument();

    // Press Escape on the button
    fireEvent.keyDown(moreButton, { key: "Escape" });
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("opens more dropdown with ArrowDown key", () => {
    render(<Header />);
    const moreButton = screen.getByRole("button", { name: /more/ });

    fireEvent.keyDown(moreButton, { key: "ArrowDown" });
    expect(screen.getByRole("menu")).toBeInTheDocument();
  });

  it("opens more dropdown with Enter key", () => {
    render(<Header />);
    const moreButton = screen.getByRole("button", { name: /more/ });

    fireEvent.keyDown(moreButton, { key: "Enter" });
    expect(screen.getByRole("menu")).toBeInTheDocument();
  });

  it("opens more dropdown with Space key", () => {
    render(<Header />);
    const moreButton = screen.getByRole("button", { name: /more/ });

    fireEvent.keyDown(moreButton, { key: " " });
    expect(screen.getByRole("menu")).toBeInTheDocument();
  });

  it("does not crash on keyboard navigation in menu (ArrowDown/ArrowUp/Home/End)", () => {
    render(<Header />);
    const moreButton = screen.getByRole("button", { name: /more/ });

    fireEvent.click(moreButton);
    const menuItems = screen.getAllByRole("menuitem");
    expect(menuItems.length).toBeGreaterThan(0);

    // The keyboard handlers must not throw and the menu must stay open
    // while the user navigates.
    expect(() => {
      fireEvent.keyDown(menuItems[0], { key: "ArrowDown" });
      fireEvent.keyDown(menuItems[menuItems.length - 1], { key: "ArrowUp" });
      fireEvent.keyDown(menuItems[0], { key: "Home" });
      fireEvent.keyDown(menuItems[0], { key: "End" });
    }).not.toThrow();

    expect(screen.getByRole("menu")).toBeInTheDocument();
  });

  it("closes dropdown with Escape from menu item", () => {
    render(<Header />);
    const moreButton = screen.getByRole("button", { name: /more/ });

    fireEvent.click(moreButton);
    const menuItems = screen.getAllByRole("menuitem");

    fireEvent.keyDown(menuItems[0], { key: "Escape" });
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("closes dropdown with Tab from menu item", () => {
    render(<Header />);
    const moreButton = screen.getByRole("button", { name: /more/ });

    fireEvent.click(moreButton);
    const menuItems = screen.getAllByRole("menuitem");

    fireEvent.keyDown(menuItems[0], { key: "Tab" });
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("closes dropdown when clicking outside", () => {
    render(<Header />);
    const moreButton = screen.getByRole("button", { name: /more/ });

    fireEvent.click(moreButton);
    expect(screen.getByRole("menu")).toBeInTheDocument();

    // Click outside the dropdown
    fireEvent.mouseDown(document.body);
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("closes dropdown when clicking a menu item", () => {
    render(<Header />);
    const moreButton = screen.getByRole("button", { name: /more/ });

    fireEvent.click(moreButton);
    const menuItems = screen.getAllByRole("menuitem");

    fireEvent.click(menuItems[0]);
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("highlights secondary nav when secondary page is active", () => {
    mockPathname = "/configurator";
    render(<Header />);
    const moreButton = screen.getByRole("button", { name: /more/ });
    expect(moreButton.className).toContain("text-brand");
  });

  it("mobile menu is hidden (inert) when closed", () => {
    render(<Header />);
    const mobileMenu = document.getElementById("mobile-nav-menu");
    expect(mobileMenu).toBeInTheDocument();
    expect(mobileMenu).toHaveAttribute("aria-hidden", "true");
  });

  it("mobile menu shows all nav items when open", () => {
    render(<Header />);
    const menuButton = screen.getByRole("button", { name: "menuToggle" });
    fireEvent.click(menuButton);

    // Mobile menu should have aria-hidden=false
    const mobileMenu = document.getElementById("mobile-nav-menu");
    expect(mobileMenu).toHaveAttribute("aria-hidden", "false");
  });
});
