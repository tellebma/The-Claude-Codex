import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";

describe("LanguageSwitcher", () => {
  it("renders one link per locale", () => {
    render(<LanguageSwitcher />);
    // The mock declares locales = ["fr", "en"] in setup.tsx
    expect(screen.getByText("FR")).toBeInTheDocument();
    expect(screen.getByText("EN")).toBeInTheDocument();
  });

  it("marks the active locale with aria-current=\"true\"", () => {
    render(<LanguageSwitcher />);
    // Mock useLocale() returns "fr"
    const frLink = screen.getByText("FR").closest("a");
    const enLink = screen.getByText("EN").closest("a");
    expect(frLink?.getAttribute("aria-current")).toBe("true");
    expect(enLink?.getAttribute("aria-current")).toBeNull();
  });

  it("uses semantic tokens (no hardcoded slate)", () => {
    render(<LanguageSwitcher />);
    const frLink = screen.getByText("FR").closest("a");
    const enLink = screen.getByText("EN").closest("a");
    // Active link must use the brand semantic token
    expect(frLink?.className).toContain("text-[color:var(--brand-primary)]");
    // Inactive link must use foreground muted token
    expect(enLink?.className).toContain("text-[color:var(--fg-muted)]");
    expect(frLink?.className).not.toMatch(/dark:text-slate/);
    expect(enLink?.className).not.toMatch(/dark:text-slate/);
  });

  it("exposes a focus-visible ring via brand token", () => {
    render(<LanguageSwitcher />);
    const link = screen.getByText("FR").closest("a");
    expect(link?.className).toContain(
      "focus-visible:ring-[color:var(--brand-primary)]"
    );
  });

  it("decorates with a hidden Globe icon", () => {
    render(<LanguageSwitcher />);
    const nav = screen.getByRole("navigation");
    const svg = nav.querySelector("svg");
    expect(svg).not.toBeNull();
    expect(svg?.getAttribute("aria-hidden")).toBe("true");
  });
});
