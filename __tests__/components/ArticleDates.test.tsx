import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { ArticleDates } from "@/components/ui/ArticleDates";

describe("ArticleDates", () => {
  it("returns null when no dates provided", () => {
    const { container } = render(<ArticleDates />);
    expect(container.firstChild).toBeNull();
  });

  it("renders published date with <time> element and dateTime attribute", () => {
    render(<ArticleDates datePublished="2026-03-15" />);
    const timeEl = screen.getByText(/Publié le/);
    expect(timeEl.closest("time")).toHaveAttribute("dateTime", "2026-03-15");
  });

  it("renders modified date when different from published", () => {
    render(
      <ArticleDates datePublished="2026-03-15" dateModified="2026-04-01" />
    );
    expect(screen.getByText(/Mis à jour le/)).toBeInTheDocument();
    const times = screen.getAllByRole("generic", { hidden: true });
    const timeTags = document.querySelectorAll("time");
    expect(timeTags).toHaveLength(2);
    expect(timeTags[1]).toHaveAttribute("dateTime", "2026-04-01");
  });

  it("does NOT render modified date when same as published", () => {
    render(
      <ArticleDates datePublished="2026-03-15" dateModified="2026-03-15" />
    );
    const timeTags = document.querySelectorAll("time");
    expect(timeTags).toHaveLength(1);
    expect(screen.queryByText(/Mis à jour le/)).toBeNull();
  });

  it("renders both dates when different", () => {
    render(
      <ArticleDates datePublished="2026-01-10" dateModified="2026-04-12" />
    );
    expect(screen.getByText(/Publié le/)).toBeInTheDocument();
    expect(screen.getByText(/Mis à jour le/)).toBeInTheDocument();
    const timeTags = document.querySelectorAll("time");
    expect(timeTags).toHaveLength(2);
  });

  it("icons are decorative (aria-hidden='true')", () => {
    render(
      <ArticleDates datePublished="2026-01-10" dateModified="2026-04-12" />
    );
    const svgs = document.querySelectorAll("svg");
    expect(svgs.length).toBeGreaterThan(0);
    svgs.forEach((svg) => {
      expect(svg).toHaveAttribute("aria-hidden", "true");
    });
  });
});
