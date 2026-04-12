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

  it("default variant applies correct classes", () => {
    const { container } = render(<Card variant="default">Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain("border-slate-200");
    expect(card.className).toContain("bg-white");
    expect(card.className).toContain("dark:border-slate-700");
    expect(card.className).toContain("dark:bg-slate-800");
  });

  it("accent variant applies correct classes", () => {
    const { container } = render(<Card variant="accent">Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain("border-brand-500/30");
    expect(card.className).toContain("bg-brand-50");
  });

  it("highlight variant applies correct classes", () => {
    const { container } = render(<Card variant="highlight">Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain("border-accent-500/30");
    expect(card.className).toContain("bg-accent-50");
  });
});
