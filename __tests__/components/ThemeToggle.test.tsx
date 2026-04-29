import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

describe("ThemeToggle", () => {
  it("renders a button after mount", () => {
    render(<ThemeToggle />);
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
  });

  it("has an aria-label coming from translations", () => {
    render(<ThemeToggle />);
    const button = screen.getByRole("button");
    // Mock t() returns the key itself; theme=light from the mock => label = darkMode
    expect(button.getAttribute("aria-label")).toBe("darkMode");
  });

  it("uses semantic tokens for surface and border (no hardcoded slate)", () => {
    render(<ThemeToggle />);
    const button = screen.getByRole("button");
    expect(button.className).toContain("bg-[color:var(--bg-elevated)]");
    expect(button.className).toContain("border-[color:var(--border-default)]");
    expect(button.className).not.toMatch(/slate-\d+/);
    expect(button.className).not.toMatch(/dark:bg-slate/);
  });

  it("renders both Sun and Moon icons (decorative)", () => {
    render(<ThemeToggle />);
    const button = screen.getByRole("button");
    const svgs = button.querySelectorAll("svg");
    expect(svgs.length).toBe(2);
    for (const svg of Array.from(svgs)) {
      expect(svg.getAttribute("aria-hidden")).toBe("true");
    }
  });

  it("uses motion tokens for transitions", () => {
    render(<ThemeToggle />);
    const button = screen.getByRole("button");
    const buttonStyle = button.getAttribute("style") ?? "";
    expect(buttonStyle).toContain("var(--duration-base)");
    expect(buttonStyle).toContain("var(--ease-out)");
  });
});
