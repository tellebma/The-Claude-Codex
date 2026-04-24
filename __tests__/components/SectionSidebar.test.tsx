import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";

// The mock must be declared before the component import so Vitest hoists it.
// We use a module-level variable to control pathname per test.
let mockPathname = "/getting-started";

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

import { SectionSidebar } from "@/components/layout/SectionSidebar";

// The useTranslations mock in setup.tsx returns the translation key as-is,
// so t("getting-started.title") => "getting-started.title", etc.
//
// The getting-started section has 7 items:
//   /getting-started (index 0, page 1)
//   /getting-started/prerequisites-zero (index 1, page 2)
//   /getting-started/what-is-claude-code (index 2, page 3)
//   /getting-started/installation (index 3, page 4)
//   /getting-started/environment-setup (index 4, page 5)
//   /getting-started/first-project (index 5, page 6)
//   /getting-started/faq-beginner (index 6, page 7)
//
// The configurator section has only 1 item, so it should return null.

describe("SectionSidebar", () => {
  beforeEach(() => {
    mockPathname = "/getting-started";
  });

  it("returns null when pathname does not match any known section", () => {
    mockPathname = "/";
    render(<SectionSidebar />);
    expect(screen.queryByRole("complementary")).toBeNull();
  });

  it("returns null for an unrecognised path segment", () => {
    mockPathname = "/unknown-section/some-page";
    render(<SectionSidebar />);
    expect(screen.queryByRole("complementary")).toBeNull();
  });

  it("renders the sidebar aside element when on a valid section page", () => {
    mockPathname = "/getting-started";
    render(<SectionSidebar />);
    expect(screen.getByRole("complementary")).toBeInTheDocument();
  });

  it("renders the section title in the sidebar", () => {
    mockPathname = "/getting-started";
    render(<SectionSidebar />);
    // useTranslations mock returns the key verbatim
    expect(screen.getByText("getting-started.title")).toBeInTheDocument();
  });

  it("renders all navigation items as links", () => {
    mockPathname = "/getting-started";
    render(<SectionSidebar />);

    const expectedHrefs = [
      "/getting-started",
      "/getting-started/prerequisites-zero",
      "/getting-started/what-is-claude-code",
      "/getting-started/installation",
      "/getting-started/environment-setup",
      "/getting-started/first-project",
      "/getting-started/faq-beginner",
    ];

    for (const href of expectedHrefs) {
      const link = screen
        .getAllByRole("link")
        .find((el) => el.getAttribute("href") === href);
      expect(link, `Expected a link with href="${href}"`).toBeTruthy();
    }
  });

  it("marks the active link with aria-current='page'", () => {
    mockPathname = "/getting-started/installation";
    render(<SectionSidebar />);

    const activeLink = screen.getByRole("link", { current: "page" });
    expect(activeLink).toHaveAttribute("href", "/getting-started/installation");
  });

  it("does not set aria-current on non-active links", () => {
    mockPathname = "/getting-started/installation";
    render(<SectionSidebar />);

    const allLinks = screen.getAllByRole("link");
    const nonActiveLinks = allLinks.filter(
      (link) => link.getAttribute("href") !== "/getting-started/installation"
    );

    for (const link of nonActiveLinks) {
      expect(link.getAttribute("aria-current")).toBeNull();
    }
  });

  it("only one link has aria-current='page' at a time", () => {
    mockPathname = "/getting-started/first-project";
    render(<SectionSidebar />);

    const activeLinks = screen.getAllByRole("link", { current: "page" });
    expect(activeLinks).toHaveLength(1);
    expect(activeLinks[0]).toHaveAttribute(
      "href",
      "/getting-started/first-project"
    );
  });

  it("shows the progress bar when on a known page in the section", () => {
    mockPathname = "/getting-started";
    render(<SectionSidebar />);

    const progressbar = screen.getByRole("progressbar");
    expect(progressbar).toBeInTheDocument();
  });

  it("shows 'Page 1 / 7' when on the overview page of getting-started", () => {
    mockPathname = "/getting-started";
    render(<SectionSidebar />);

    // The component renders: "Page {currentPage} / {totalPages}"
    expect(screen.getByText("Page 1 / 7")).toBeInTheDocument();
  });

  it("shows 'Page 4 / 7' when on the installation page of getting-started", () => {
    mockPathname = "/getting-started/installation";
    render(<SectionSidebar />);

    expect(screen.getByText("Page 4 / 7")).toBeInTheDocument();
  });

  it("shows 'Page 7 / 7' when on the last page of getting-started", () => {
    mockPathname = "/getting-started/faq-beginner";
    render(<SectionSidebar />);

    expect(screen.getByText("Page 7 / 7")).toBeInTheDocument();
  });

  it("sets correct value/max on the progress bar", () => {
    mockPathname = "/getting-started/what-is-claude-code";
    render(<SectionSidebar />);

    // Native <progress> element carries value/max (not aria-valuenow).
    const progressbar = screen.getByRole("progressbar") as HTMLProgressElement;
    expect(progressbar.value).toBe(3);
    expect(progressbar.max).toBe(7);
  });

  it("does not render the progress bar when on a page not in the section item list", () => {
    // A path that matches the section but not any specific item
    // currentIndex will be -1, currentPage will be 0, so the progress bar block is not rendered
    mockPathname = "/getting-started/nonexistent-page";
    render(<SectionSidebar />);

    expect(screen.queryByRole("progressbar")).toBeNull();
  });

  it("returns null for the configurator section which has only 1 item", () => {
    mockPathname = "/configurator";
    render(<SectionSidebar />);
    expect(screen.queryByRole("complementary")).toBeNull();
  });

  it("works correctly for another section (mcp)", () => {
    mockPathname = "/mcp/setup";
    render(<SectionSidebar />);

    expect(screen.getByRole("complementary")).toBeInTheDocument();
    expect(screen.getByText("mcp.title")).toBeInTheDocument();

    const activeLink = screen.getByRole("link", { current: "page" });
    expect(activeLink).toHaveAttribute("href", "/mcp/setup");
  });

  it("handles locale-prefixed pathnames (i18n)", () => {
    // getSectionFromPathname checks the second segment when the first is not a section key
    // e.g., "/fr/getting-started" -> section "getting-started"
    mockPathname = "/fr/getting-started";
    render(<SectionSidebar />);

    expect(screen.getByRole("complementary")).toBeInTheDocument();
    expect(screen.getByText("getting-started.title")).toBeInTheDocument();
  });
});
