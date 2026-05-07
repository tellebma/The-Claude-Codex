import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { RecentArticlesClient } from "@/components/ui/RecentArticlesClient";
import type { RecentArticle } from "@/lib/mdx";

vi.mock("@/i18n/navigation", () => ({
  Link: ({
    href,
    children,
    className,
    ...rest
  }: Readonly<
    {
      href: string;
      children: React.ReactNode;
      className?: string;
    } & Record<string, unknown>
  >) => (
    <a href={href} className={className} {...rest}>
      {children}
    </a>
  ),
}));

const mkArticle = (overrides: Partial<RecentArticle> = {}): RecentArticle => ({
  title: "T",
  description: "D",
  section: "mcp",
  slug: "a",
  locale: "fr",
  dateModified: "2026-04-15",
  ...overrides,
});

describe("RecentArticlesClient", () => {
  const baseProps = {
    title: "Latest",
    subtitle: "Sub",
    ariaLabel: "Recent",
    readArticleLabel: "Read",
    allFilterLabel: "All",
    sectionLabels: { mcp: "MCP", skills: "Skills", agents: "Agents" } as Record<
      string,
      string
    >,
  };

  it("renders nothing when no articles", () => {
    const { container } = render(
      <RecentArticlesClient articles={[]} {...baseProps} />
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders title + subtitle + 1 hero + 2 small with default filter 'all'", () => {
    render(
      <RecentArticlesClient
        articles={[
          mkArticle({ title: "A", slug: "a", section: "mcp" }),
          mkArticle({ title: "B", slug: "b", section: "skills" }),
          mkArticle({ title: "C", slug: "c", section: "agents" }),
        ]}
        {...baseProps}
      />
    );
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("Latest");
    expect(screen.getByText("Sub")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: "A" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: "B" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: "C" })).toBeInTheDocument();
  });

  it("does not render filter pills when only one section is present", () => {
    render(
      <RecentArticlesClient
        articles={[mkArticle({ slug: "a", section: "mcp" })]}
        {...baseProps}
      />
    );
    expect(
      screen.queryByRole("group", { name: "Filtrer par section" })
    ).not.toBeInTheDocument();
  });

  it("renders filter pills for distinct sections + 'All'", () => {
    render(
      <RecentArticlesClient
        articles={[
          mkArticle({ slug: "a", section: "mcp" }),
          mkArticle({ slug: "b", section: "skills" }),
        ]}
        {...baseProps}
      />
    );
    const group = screen.getByRole("group", { name: "Filtrer par section" });
    expect(group).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "All" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "MCP" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Skills" })).toBeInTheDocument();
  });

  it("filters articles when a section pill is clicked", () => {
    render(
      <RecentArticlesClient
        articles={[
          mkArticle({ slug: "a", title: "Article MCP", section: "mcp" }),
          mkArticle({ slug: "b", title: "Article Skills", section: "skills" }),
        ]}
        {...baseProps}
      />
    );
    expect(screen.getByText("Article MCP")).toBeInTheDocument();
    expect(screen.getByText("Article Skills")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "MCP" }));

    expect(screen.getByText("Article MCP")).toBeInTheDocument();
    expect(screen.queryByText("Article Skills")).not.toBeInTheDocument();
  });

  it("returning to 'All' shows all articles again", () => {
    render(
      <RecentArticlesClient
        articles={[
          mkArticle({ slug: "a", title: "A", section: "mcp" }),
          mkArticle({ slug: "b", title: "B", section: "skills" }),
        ]}
        {...baseProps}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: "Skills" }));
    expect(screen.queryByText("A")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "All" }));
    expect(screen.getByText("A")).toBeInTheDocument();
    expect(screen.getByText("B")).toBeInTheDocument();
  });

  it("active pill has aria-pressed=true", () => {
    render(
      <RecentArticlesClient
        articles={[
          mkArticle({ slug: "a", section: "mcp" }),
          mkArticle({ slug: "b", section: "skills" }),
        ]}
        {...baseProps}
      />
    );
    expect(screen.getByRole("button", { name: "All" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
    fireEvent.click(screen.getByRole("button", { name: "MCP" }));
    expect(screen.getByRole("button", { name: "MCP" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
    expect(screen.getByRole("button", { name: "All" })).toHaveAttribute(
      "aria-pressed",
      "false"
    );
  });

  it("data-category is set on each card for css filtering hooks", () => {
    const { container } = render(
      <RecentArticlesClient
        articles={[
          mkArticle({ slug: "a", section: "mcp" }),
          mkArticle({ slug: "b", section: "skills" }),
        ]}
        {...baseProps}
      />
    );
    const cards = container.querySelectorAll("[data-category]");
    expect(cards.length).toBeGreaterThan(0);
    expect(cards[0].getAttribute("data-category")).toBe("mcp");
  });
});
