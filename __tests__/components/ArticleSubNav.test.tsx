import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ArticleSubNav } from "@/components/layout/ArticleSubNav";

vi.mock("@/i18n/navigation", () => ({
  Link: ({
    href,
    children,
    className,
  }: Readonly<{ href: string; children: React.ReactNode; className?: string }>) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

describe("ArticleSubNav", () => {
  it("renders the breadcrumb chain with chevron separators", () => {
    render(
      <ArticleSubNav
        currentLocale="fr"
        ariaLabelBreadcrumb="Fil d'Ariane"
        crumbs={[
          { label: "Accueil", href: "/" },
          { label: "Contenus", href: "/content/" },
          { label: "Article test" },
        ]}
      />
    );

    expect(screen.getByText("Accueil")).toBeInTheDocument();
    expect(screen.getByText("Contenus")).toBeInTheDocument();
    expect(screen.getByText("Article test")).toBeInTheDocument();
    // Last item is current : not a link
    expect(screen.getByText("Article test").tagName).toBe("SPAN");
  });

  it("renders only links for non-last items with href", () => {
    const { container } = render(
      <ArticleSubNav
        currentLocale="fr"
        ariaLabelBreadcrumb="Fil"
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Current" },
        ]}
      />
    );
    const links = container.querySelectorAll("nav a");
    expect(links).toHaveLength(1);
    expect(links[0]).toHaveAttribute("href", "/");
  });

  it("renders the lang switcher pill when otherLocaleHref is provided", () => {
    render(
      <ArticleSubNav
        currentLocale="fr"
        otherLocaleHref="/content/intro/"
        ariaLabelBreadcrumb="Fil"
        crumbs={[{ label: "Article" }]}
      />
    );
    const langGroup = screen.getByRole("group", { name: "Langue" });
    expect(langGroup).toBeInTheDocument();
    expect(screen.getByText("FR")).toBeInTheDocument();
    expect(screen.getByText("EN")).toBeInTheDocument();
  });

  it("does not render the lang switcher when otherLocaleHref is missing", () => {
    render(
      <ArticleSubNav
        currentLocale="fr"
        ariaLabelBreadcrumb="Fil"
        crumbs={[{ label: "Article" }]}
      />
    );
    expect(screen.queryByRole("group", { name: "Langue" })).not.toBeInTheDocument();
  });
});
