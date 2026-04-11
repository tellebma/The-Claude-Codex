import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

// Track the mocked pathname
let mockPathname = "/";

// Override the global @/i18n/navigation mock to use local mockPathname
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

    // useTranslations mock returns the key: t("ariaLabel") -> "ariaLabel"
    const nav = screen.getByRole("navigation", { name: "ariaLabel" });
    expect(nav).toBeInTheDocument();

    // Home link: t("home") -> "home"
    const homeLink = screen.getByRole("link", { name: "home" });
    expect(homeLink).toHaveAttribute("href", "/");

    // Current page: t.has("sections.mcp") returns true, t("sections.mcp") -> "sections.mcp"
    expect(screen.getByText("sections.mcp")).toBeInTheDocument();
    expect(screen.getByText("sections.mcp").getAttribute("aria-current")).toBe(
      "page"
    );
  });

  it("renders multi-level breadcrumbs with intermediate links", () => {
    mockPathname = "/mcp/setup";
    render(<Breadcrumb />);

    // Home
    expect(screen.getByRole("link", { name: "home" })).toBeInTheDocument();

    // MCP should be a link (not the last item): t("sections.mcp") -> "sections.mcp"
    const mcpLink = screen.getByRole("link", { name: "sections.mcp" });
    expect(mcpLink).toHaveAttribute("href", "/mcp");

    // Setup should be the current page: t("sections.setup") -> "sections.setup"
    const lastItem = screen.getByText("sections.setup");
    expect(lastItem.getAttribute("aria-current")).toBe("page");
  });

  it("returns translation key for known sections", () => {
    mockPathname = "/getting-started";
    render(<Breadcrumb />);
    // t.has returns true, t("sections.getting-started") -> "sections.getting-started"
    expect(screen.getByText("sections.getting-started")).toBeInTheDocument();
  });

  it("returns translation key for unknown segments too (t.has always true in mock)", () => {
    mockPathname = "/some-unknown-section";
    render(<Breadcrumb />);
    // Even unknown segments: t.has returns true, t("sections.some-unknown-section")
    expect(
      screen.getByText("sections.some-unknown-section")
    ).toBeInTheDocument();
  });

  it("does not emit JSON-LD (server component SectionSlugContent owns it)", () => {
    // The BreadcrumbList schema.org JSON-LD is emitted by SectionSlugContent
    // on the server, where locale prefix and frontmatter title are available.
    // This client component used to emit a second, locale-stripped duplicate
    // which confused Google's rich results — hence the removal.
    mockPathname = "/mcp";
    const { container } = render(<Breadcrumb />);
    const script = container.querySelector(
      'script[type="application/ld+json"]'
    );
    expect(script).toBeNull();
  });
});
