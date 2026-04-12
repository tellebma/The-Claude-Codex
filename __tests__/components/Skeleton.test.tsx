import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { Skeleton, SkeletonCard } from "@/components/ui/Skeleton";

describe("Skeleton", () => {
  it("default variant has text classes (h-4 w-full)", () => {
    const { container } = render(<Skeleton />);
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain("h-4");
    expect(el.className).toContain("w-full");
  });

  it("card variant has card classes (h-48 rounded-2xl)", () => {
    const { container } = render(<Skeleton variant="card" />);
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain("h-48");
    expect(el.className).toContain("rounded-2xl");
  });

  it("circle variant has circle classes (h-12 w-12 rounded-full)", () => {
    const { container } = render(<Skeleton variant="circle" />);
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain("h-12");
    expect(el.className).toContain("w-12");
    expect(el.className).toContain("rounded-full");
  });

  it("is aria-hidden='true'", () => {
    const { container } = render(<Skeleton />);
    const el = container.firstChild as HTMLElement;
    expect(el).toHaveAttribute("aria-hidden", "true");
  });

  it("accepts additional className", () => {
    const { container } = render(<Skeleton className="my-custom-class" />);
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain("my-custom-class");
  });
});

describe("SkeletonCard", () => {
  it("renders multiple Skeleton children", () => {
    const { container } = render(<SkeletonCard />);
    // SkeletonCard renders 4 Skeleton divs inside a wrapper div
    const innerDivs = container.querySelectorAll("[aria-hidden='true']");
    // The outer wrapper also has aria-hidden="true", plus 4 Skeleton children
    expect(innerDivs.length).toBeGreaterThanOrEqual(4);
  });
});
