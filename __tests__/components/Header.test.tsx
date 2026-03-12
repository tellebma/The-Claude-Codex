import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Header } from "@/components/layout/Header";

let mockPathname = "/";

vi.mock("next/navigation", () => ({
  usePathname: () => mockPathname,
  useRouter: () => ({ push: vi.fn() }),
}));

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

vi.mock("next-themes", () => ({
  useTheme: () => ({ theme: "light", setTheme: vi.fn() }),
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
    const expectedHrefs = [
      "/getting-started",
      "/content",
      "/mcp",
      "/skills",
      "/prompting",
      "/advanced",
      "/reference",
      "/configurator",
      "/glossary",
      "/future",
    ];

    for (const href of expectedHrefs) {
      const links = screen
        .getAllByRole("link")
        .filter((link) => link.getAttribute("href") === href);
      // Desktop nav always visible; mobile nav may be inert
      expect(links.length).toBeGreaterThanOrEqual(1);
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
    const menuButton = screen.getByRole("button", {
      name: "Menu de navigation",
    });
    expect(menuButton).toBeInTheDocument();
    expect(menuButton.getAttribute("aria-expanded")).toBe("false");
  });

  it("toggles mobile menu open and closed", () => {
    render(<Header />);
    const menuButton = screen.getByRole("button", {
      name: "Menu de navigation",
    });

    fireEvent.click(menuButton);
    expect(menuButton.getAttribute("aria-expanded")).toBe("true");

    fireEvent.click(menuButton);
    expect(menuButton.getAttribute("aria-expanded")).toBe("false");
  });

  it("renders search dialog trigger", () => {
    render(<Header />);
    const searchButton = screen.getByRole("button", {
      name: /Rechercher/,
    });
    expect(searchButton).toBeInTheDocument();
  });
});
