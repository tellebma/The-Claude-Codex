import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { NextSteps } from "@/components/mdx/NextSteps";

vi.mock("@/i18n/navigation", () => ({
  Link: ({ href, children, ...rest }: { href: string; children: React.ReactNode } & Record<string, unknown>) => (
    <a href={href} {...rest}>{children}</a>
  ),
}));

describe("NextSteps", () => {
  const defaultItems = [
    { href: "/getting-started", label: "Get started" },
    { href: "/agents", label: "Agents", description: "Subagents et orchestration" },
  ];

  it("renders the title and eyebrow", () => {
    render(<NextSteps title="Continue your journey" items={defaultItems} />);
    expect(screen.getByText("Continue your journey")).toBeInTheDocument();
    expect(screen.getByText("Prochaines etapes")).toBeInTheDocument();
  });

  it("renders all items as links with their hrefs", () => {
    render(<NextSteps title="x" items={defaultItems} />);
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(2);
    expect(links[0].getAttribute("href")).toBe("/getting-started");
    expect(links[1].getAttribute("href")).toBe("/agents");
  });

  it("renders item descriptions when provided", () => {
    render(<NextSteps title="x" items={defaultItems} />);
    expect(screen.getByText("Subagents et orchestration")).toBeInTheDocument();
  });

  it("does not render a description for items that omit it", () => {
    render(<NextSteps title="x" items={[{ href: "/a", label: "A" }]} />);
    expect(screen.queryByText(/orchestration/)).toBeNull();
  });

  it("uses a custom eyebrow when provided", () => {
    render(<NextSteps title="x" items={defaultItems} eyebrow="Up next" />);
    expect(screen.getByText("Up next")).toBeInTheDocument();
  });

  it("nav has aria-labelledby pointing to the title id (a11y named landmark)", () => {
    render(<NextSteps title="My Title" items={defaultItems} />);
    const nav = screen.getByRole("navigation");
    const ariaLabelledBy = nav.getAttribute("aria-labelledby");
    expect(ariaLabelledBy).toBeTruthy();
    const heading = document.getElementById(ariaLabelledBy!);
    expect(heading?.textContent).toBe("My Title");
  });

  it("title id is slugified from the title (no spaces, lowercase)", () => {
    render(<NextSteps title="Hello World Foo" items={defaultItems} />);
    const heading = screen.getByRole("heading", { name: "Hello World Foo" });
    expect(heading.id).toBe("next-steps-hello-world-foo");
  });
});
