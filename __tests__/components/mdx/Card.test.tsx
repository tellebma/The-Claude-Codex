import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { Card } from "@/components/mdx/Card";

describe("Card", () => {
  it("renders children content", () => {
    render(<Card>Card body text</Card>);
    expect(screen.getByText("Card body text")).toBeInTheDocument();
  });

  it("renders title as h3 when provided", () => {
    render(<Card title="My Card Title">Content</Card>);
    const heading = screen.getByRole("heading", { level: 3, name: "My Card Title" });
    expect(heading).toBeInTheDocument();
  });

  it("does not render h3 when no title is provided", () => {
    render(<Card>Content without title</Card>);
    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
  });

  it("default variant uses semantic tokens (no hardcoded slate)", () => {
    const { container } = render(<Card variant="default">Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain("border-[color:var(--border-default)]");
    expect(card.className).toContain("bg-[color:var(--bg-elevated)]");
    expect(card.className).not.toMatch(/dark:bg-slate/);
    expect(card.className).not.toMatch(/dark:border-slate/);
  });

  it("accent variant applies correct classes", () => {
    const { container } = render(<Card variant="accent">Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain("border-brand-500/30");
    expect(card.className).toContain("bg-brand-500/10");
  });

  it("highlight variant applies correct classes", () => {
    const { container } = render(<Card variant="highlight">Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain("border-accent-500/30");
    expect(card.className).toContain("bg-accent-500/10");
  });

  it("applies hover lift transition via motion tokens", () => {
    const { container } = render(<Card>Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain("hover:-translate-y-px");
    expect(card.className).toContain("hover:shadow-[var(--shadow-md)]");
    const inlineStyle = card.getAttribute("style") ?? "";
    expect(inlineStyle).toContain("var(--duration-fast)");
    expect(inlineStyle).toContain("var(--ease-out)");
    expect(inlineStyle).toContain("var(--shadow-card)");
  });
});
