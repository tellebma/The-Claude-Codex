import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import React from "react";
import { TerminalScreenshot } from "@/components/ui/TerminalScreenshot";
import type { TerminalLine } from "@/components/ui/TerminalScreenshot";

// Mock IntersectionObserver
let intersectionCallback: IntersectionObserverCallback;
const mockDisconnect = vi.fn();
const mockObserve = vi.fn();

beforeEach(() => {
  mockDisconnect.mockClear();
  mockObserve.mockClear();

  class MockIntersectionObserver implements IntersectionObserver {
    readonly root = null;
    readonly rootMargin = "";
    readonly thresholds: ReadonlyArray<number> = [];
    constructor(callback: IntersectionObserverCallback) {
      intersectionCallback = callback;
    }
    observe(target: Element) { mockObserve(target); }
    disconnect() { mockDisconnect(); }
    unobserve() {}
    takeRecords(): IntersectionObserverEntry[] { return []; }
  }

  global.IntersectionObserver = MockIntersectionObserver;
});

const sampleLines: TerminalLine[] = [
  { type: "command", content: "npm install" },
  { type: "output", content: "added 123 packages" },
  { type: "highlight", content: "Build successful!" },
  { type: "comment", content: "# This is a comment" },
  { type: "prompt", content: "? Choose a framework:" },
  { type: "empty", content: "" },
];

describe("TerminalScreenshot", () => {
  it("renders with the default title", () => {
    render(<TerminalScreenshot lines={sampleLines} />);
    expect(screen.getByText("Terminal : zsh")).toBeInTheDocument();
  });

  it("renders with a custom title", () => {
    render(<TerminalScreenshot lines={sampleLines} title="My Terminal" />);
    expect(screen.getByText("My Terminal")).toBeInTheDocument();
  });

  it("has role=img with aria-label", () => {
    render(<TerminalScreenshot lines={sampleLines} title="Custom" />);
    const wrapper = screen.getByRole("img");
    expect(wrapper).toHaveAttribute(
      "aria-label",
      "Capture d'écran de terminal : Custom"
    );
  });

  it("renders skeleton placeholders before intersection", () => {
    const { container } = render(<TerminalScreenshot lines={sampleLines} />);
    // Before intersection, skeleton divs should be visible
    const skeletons = container.querySelectorAll(".animate-pulse");
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("renders terminal lines after intersection triggers", () => {
    render(<TerminalScreenshot lines={sampleLines} />);

    // Simulate intersection
    act(() => {
      intersectionCallback(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver
      );
    });

    // Now lines should be rendered
    expect(screen.getByText("npm install")).toBeInTheDocument();
    expect(screen.getByText("added 123 packages")).toBeInTheDocument();
    expect(screen.getByText("Build successful!")).toBeInTheDocument();
    expect(screen.getByText("# This is a comment")).toBeInTheDocument();
    expect(screen.getByText("? Choose a framework:")).toBeInTheDocument();
  });

  it("renders command lines with prompt symbol", () => {
    render(<TerminalScreenshot lines={[{ type: "command", content: "ls" }]} />);

    act(() => {
      intersectionCallback(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver
      );
    });

    expect(screen.getByText("$")).toBeInTheDocument();
    expect(screen.getByText("ls")).toBeInTheDocument();
  });

  it("renders command lines with custom prompt symbol", () => {
    render(
      <TerminalScreenshot
        lines={[{ type: "command", content: "echo hi", promptSymbol: ">" }]}
      />
    );

    act(() => {
      intersectionCallback(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver
      );
    });

    expect(screen.getByText(">")).toBeInTheDocument();
  });

  it("renders empty lines as non-breaking space", () => {
    const { container } = render(
      <TerminalScreenshot lines={[{ type: "empty", content: "" }]} />
    );

    act(() => {
      intersectionCallback(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver
      );
    });

    const emptySpan = container.querySelector("span.block");
    expect(emptySpan).toBeInTheDocument();
    // Non-breaking space: \u00A0
    expect(emptySpan?.innerHTML).toContain("&nbsp;");
  });

  it("disconnects observer after intersection", () => {
    render(<TerminalScreenshot lines={sampleLines} />);

    act(() => {
      intersectionCallback(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver
      );
    });

    expect(mockDisconnect).toHaveBeenCalled();
  });

  it("limits skeleton placeholders to max 6", () => {
    const manyLines: TerminalLine[] = Array.from({ length: 20 }, (_, i) => ({
      type: "output" as const,
      content: `Line ${i}`,
    }));
    const { container } = render(<TerminalScreenshot lines={manyLines} />);
    const skeletons = container.querySelectorAll(".animate-pulse");
    expect(skeletons.length).toBeLessThanOrEqual(6);
  });

  it("applies custom className", () => {
    const { container } = render(
      <TerminalScreenshot lines={sampleLines} className="my-custom-class" />
    );
    const wrapper = container.firstElementChild;
    expect(wrapper?.className).toContain("my-custom-class");
  });
});
