import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import React from "react";
import { TypingTerminal } from "@/components/ui/TypingTerminal";

// Control the reduced-motion hook
let mockReducedMotion = false;
vi.mock("@/lib/use-reduced-motion", () => ({
  usePrefersReducedMotion: () => mockReducedMotion,
}));

describe("TypingTerminal", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mockReducedMotion = false;
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const sampleLines = [
    { text: "Line one", delay: 100 },
    { text: "Line two", delay: 50 },
  ];

  it("shows all lines immediately when reduced motion is preferred", () => {
    mockReducedMotion = true;
    render(<TypingTerminal lines={sampleLines} />);
    expect(screen.getByText("Line one")).toBeInTheDocument();
    expect(screen.getByText("Line two")).toBeInTheDocument();
  });

  it("does not show a cursor when reduced motion is preferred", () => {
    mockReducedMotion = true;
    const { container } = render(<TypingTerminal lines={sampleLines} />);
    const cursor = container.querySelector(".animate-pulse");
    expect(cursor).not.toBeInTheDocument();
  });

  it("starts typing the first line after initial delay", () => {
    render(<TypingTerminal lines={sampleLines} typingSpeed={10} />);

    // Initially, nothing typed yet
    expect(screen.queryByText("L")).not.toBeInTheDocument();

    // Advance past the first line's delay (100ms)
    act(() => {
      vi.advanceTimersByTime(100);
    });

    // After delay, first character should appear
    // The timer fires and sets the first character
    act(() => {
      vi.advanceTimersByTime(10);
    });

    // At least the first character should be visible
    const firstLineDiv = screen.getByText(/^L/);
    expect(firstLineDiv).toBeInTheDocument();
  });

  it("shows blinking cursor on current line during animation", () => {
    const { container } = render(
      <TypingTerminal lines={sampleLines} typingSpeed={10} />
    );

    // The cursor (animate-pulse span) should be present on the current line
    const cursor = container.querySelector(".animate-pulse");
    expect(cursor).toBeInTheDocument();
  });

  it("applies custom className from line definition", () => {
    mockReducedMotion = true;
    const lines = [
      { text: "Styled line", className: "text-emerald-400" },
    ];
    const { container } = render(<TypingTerminal lines={lines} />);
    const lineDiv = container.querySelector(".text-emerald-400");
    expect(lineDiv).toBeInTheDocument();
    expect(lineDiv).toHaveTextContent("Styled line");
  });

  it("uses default className when line has no className", () => {
    mockReducedMotion = true;
    const lines = [{ text: "Default styled" }];
    const { container } = render(<TypingTerminal lines={lines} />);
    const lineDiv = container.querySelector(".text-slate-400");
    expect(lineDiv).toBeInTheDocument();
  });

  it("types through entire first line with enough time", () => {
    const lines = [{ text: "AB", delay: 0 }];
    render(<TypingTerminal lines={lines} typingSpeed={10} />);

    // First char after typingSpeed
    act(() => { vi.advanceTimersByTime(10); });
    // Second char
    act(() => { vi.advanceTimersByTime(10); });

    expect(screen.getByText("AB")).toBeInTheDocument();
  });
});
