import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { Callout } from "@/components/ui/Callout";

describe("Callout", () => {
  it("renders children content", () => {
    render(<Callout>Some helpful text</Callout>);
    expect(screen.getByText("Some helpful text")).toBeInTheDocument();
  });

  it("renders with default type 'info'", () => {
    render(<Callout>Content</Callout>);
    const aside = screen.getByRole("complementary");
    expect(aside).toBeInTheDocument();
    // Default type is "info" — mock t("info") returns "info"
    expect(aside).toHaveAttribute("aria-label", "info");
    expect(aside.className).toContain("cc-callout-info");
  });

  it("renders tip variant with correct styles", () => {
    render(<Callout type="tip">A tip</Callout>);
    const aside = screen.getByRole("complementary");
    expect(aside).toHaveAttribute("aria-label", "tip");
    expect(aside.className).toContain("cc-callout-tip");
  });

  it("renders warning variant with correct styles", () => {
    render(<Callout type="warning">A warning</Callout>);
    const aside = screen.getByRole("complementary");
    expect(aside).toHaveAttribute("aria-label", "warning");
    expect(aside.className).toContain("cc-callout-warning");
  });

  it("renders error variant with correct styles", () => {
    render(<Callout type="error">An error</Callout>);
    const aside = screen.getByRole("complementary");
    expect(aside).toHaveAttribute("aria-label", "error");
    expect(aside.className).toContain("cc-callout-error");
  });

  it("uses custom title when provided", () => {
    render(<Callout title="Custom Title">Content</Callout>);
    expect(screen.getByText("Custom Title")).toBeInTheDocument();
    expect(screen.getByRole("complementary")).toHaveAttribute(
      "aria-label",
      "Custom Title"
    );
  });

  it("uses translation key as default title when no title prop given", () => {
    // The mock returns the key itself: t("warning") → "warning"
    render(<Callout type="warning">Content</Callout>);
    expect(screen.getByText("warning")).toBeInTheDocument();
  });

  it("has correct accessibility structure", () => {
    render(<Callout type="info" title="Note">Information here</Callout>);
    const aside = screen.getByRole("complementary");
    expect(aside.tagName.toLowerCase()).toBe("aside");
    expect(aside).toHaveAttribute("aria-label", "Note");
    // Icon should be decorative
    const svg = aside.querySelector("svg");
    expect(svg).toHaveAttribute("aria-hidden", "true");
  });
});
