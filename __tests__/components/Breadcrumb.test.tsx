import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

// Track the mocked pathname
let mockPathname = "/";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  usePathname: () => mockPathname,
}));

// Mock next/link to render a plain anchor
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

describe("Breadcrumb", () => {
  beforeEach(() => {
    mockPathname = "/";
  });

  it("renders nothing on the homepage", () => {
    mockPathname = "/";
    const { container } = render(<Breadcrumb />);
    expect(container.querySelector("nav")).toBeNull();
  });

  it("renders breadcrumb navigation for a section page", () => {
    mockPathname = "/mcp";
    render(<Breadcrumb />);

    const nav = screen.getByRole("navigation", { name: "Fil d'Ariane" });
    expect(nav).toBeInTheDocument();

    // Home link
    const homeLink = screen.getByRole("link", { name: "Accueil" });
    expect(homeLink).toHaveAttribute("href", "/");

    // Current page (last breadcrumb) should be a span, not a link
    expect(screen.getByText("MCP")).toBeInTheDocument();
    expect(screen.getByText("MCP").getAttribute("aria-current")).toBe("page");
  });

  it("renders multi-level breadcrumbs with intermediate links", () => {
    mockPathname = "/mcp/setup";
    render(<Breadcrumb />);

    // Home
    expect(screen.getByRole("link", { name: "Accueil" })).toBeInTheDocument();

    // MCP should be a link (not the last item)
    const mcpLink = screen.getByRole("link", { name: "MCP" });
    expect(mcpLink).toHaveAttribute("href", "/mcp");

    // Setup should be the current page (span)
    const lastItem = screen.getByText("Setup");
    expect(lastItem.getAttribute("aria-current")).toBe("page");
  });

  it("uses known labels for sections (getting-started -> Demarrer)", () => {
    mockPathname = "/getting-started";
    render(<Breadcrumb />);
    expect(screen.getByText("Demarrer")).toBeInTheDocument();
  });

  it("capitalizes unknown segments", () => {
    mockPathname = "/some-unknown-section";
    render(<Breadcrumb />);
    expect(screen.getByText("Some Unknown Section")).toBeInTheDocument();
  });

  it("includes JSON-LD structured data", () => {
    mockPathname = "/mcp";
    const { container } = render(<Breadcrumb />);
    const script = container.querySelector(
      'script[type="application/ld+json"]'
    );
    expect(script).not.toBeNull();

    if (script) {
      const data = JSON.parse(script.innerHTML) as Record<string, unknown>;
      expect(data["@type"]).toBe("BreadcrumbList");
    }
  });
});
