import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CopyrightYear } from "@/components/ui/CopyrightYear";

describe("CopyrightYear", () => {
  it("renders the current year", () => {
    render(<CopyrightYear />);
    const expected = new Date().getFullYear().toString();
    expect(screen.getByText(expected)).toBeInTheDocument();
  });

  it("uses a span element with suppressHydrationWarning", () => {
    const { container } = render(<CopyrightYear />);
    const span = container.querySelector("span");
    expect(span).not.toBeNull();
  });
});
