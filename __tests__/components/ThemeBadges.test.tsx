import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ThemeBadges } from "@/components/ui/ThemeBadges";

describe("ThemeBadges", () => {
  it("renders nothing when themes is undefined (graceful fallback)", () => {
    const { container } = render(<ThemeBadges />);
    expect(container.firstChild).toBeNull();
  });

  it("renders nothing when themes is empty", () => {
    const { container } = render(<ThemeBadges themes={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders nothing when themes contains only unknown keys", () => {
    const { container } = render(<ThemeBadges themes={["unknown-key"]} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders one badge per valid key", () => {
    render(<ThemeBadges themes={["tutorial", "security"]} />);
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });

  it("uses translated labels (FR mock returns the key)", () => {
    render(<ThemeBadges themes={["tutorial"]} />);
    // Mock t() returns the key itself
    expect(screen.getByText("tutorial")).toBeInTheDocument();
  });

  it("filters silently unknown keys when mixed with valid ones", () => {
    render(<ThemeBadges themes={["tutorial", "bogus-key"]} />);
    expect(screen.getAllByRole("listitem")).toHaveLength(1);
    expect(screen.getByText("tutorial")).toBeInTheDocument();
  });

  it("compact mode hides the visible label but keeps it in sr-only", () => {
    render(<ThemeBadges themes={["tutorial"]} compact />);
    const visible = screen.queryByText("tutorial", { selector: "span:not(.sr-only)" });
    expect(visible).toBeNull();
    const srOnly = screen.getByText("tutorial", { selector: ".sr-only" });
    expect(srOnly).toBeInTheDocument();
  });

  it("applies a list aria-label from translations", () => {
    render(<ThemeBadges themes={["tutorial"]} />);
    const list = screen.getByRole("list");
    expect(list.getAttribute("aria-label")).toBe("badgesLabel");
  });
});
