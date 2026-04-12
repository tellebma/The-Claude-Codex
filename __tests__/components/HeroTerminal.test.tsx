import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { HeroTerminal } from "@/components/ui/HeroTerminal";

// Mock TypingTerminal to avoid animation complexity in tests
vi.mock("@/components/ui/TypingTerminal", () => ({
  TypingTerminal: ({ lines }: { lines: ReadonlyArray<{ text: string }> }) => (
    <div data-testid="typing-terminal">
      {lines.map((line, i) => (
        <div key={i}>{line.text}</div>
      ))}
    </div>
  ),
}));

describe("HeroTerminal", () => {
  it("renders with role=img", () => {
    render(<HeroTerminal />);
    const terminal = screen.getByRole("img");
    expect(terminal).toBeInTheDocument();
  });

  it("has a default aria-label describing the terminal interaction", () => {
    render(<HeroTerminal />);
    const terminal = screen.getByRole("img");
    expect(terminal.getAttribute("aria-label")).toContain("Terminal");
    expect(terminal.getAttribute("aria-label")).toContain("Claude Code");
  });

  it("uses custom aria-label when provided", () => {
    render(<HeroTerminal ariaLabel="Custom terminal description" />);
    const terminal = screen.getByRole("img");
    expect(terminal).toHaveAttribute("aria-label", "Custom terminal description");
  });

  it("renders default lines when no lines prop provided", () => {
    render(<HeroTerminal />);
    const typingTerminal = screen.getByTestId("typing-terminal");
    // Default lines include "$ claude"
    expect(typingTerminal).toHaveTextContent("$ claude");
  });

  it("renders custom lines when provided", () => {
    const customLines = [
      { text: "$ custom-command", delay: 100 },
      { text: "Custom output", className: "text-green-400", delay: 200 },
    ];
    render(<HeroTerminal lines={customLines} />);
    expect(screen.getByText("$ custom-command")).toBeInTheDocument();
    expect(screen.getByText("Custom output")).toBeInTheDocument();
  });

  it("renders the terminal title bar with traffic light dots", () => {
    const { container } = render(<HeroTerminal />);
    // Title bar is aria-hidden
    const titleBar = container.querySelector("[aria-hidden='true']");
    expect(titleBar).toBeInTheDocument();
    expect(screen.getByText("terminal")).toBeInTheDocument();
  });

  it("has the terminal window decoration dots", () => {
    const { container } = render(<HeroTerminal />);
    // Three dots: red, yellow, green
    const dots = container.querySelectorAll(".rounded-full");
    expect(dots.length).toBeGreaterThanOrEqual(3);
  });
});
