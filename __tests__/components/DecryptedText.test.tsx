import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import React from "react";
import { DecryptedText } from "@/components/ui/DecryptedText";

let intersectionCallback: IntersectionObserverCallback;
const mockDisconnect = vi.fn();
const mockObserve = vi.fn();

beforeEach(() => {
  mockDisconnect.mockClear();
  mockObserve.mockClear();

  class MockIntersectionObserver {
    readonly root = null;
    readonly rootMargin = "";
    readonly scrollMargin = "";
    readonly thresholds: ReadonlyArray<number> = [];
    constructor(callback: IntersectionObserverCallback) {
      intersectionCallback = callback;
    }
    observe(target: Element) { mockObserve(target); }
    disconnect() { mockDisconnect(); }
    unobserve() {}
    takeRecords(): IntersectionObserverEntry[] { return []; }
  }

  global.IntersectionObserver =
    MockIntersectionObserver as unknown as typeof IntersectionObserver;
});

describe("DecryptedText", () => {
  it("renders the text in aria-label for accessibility", () => {
    render(<DecryptedText text="Hello World" />);
    const span = screen.getByLabelText("Hello World");
    expect(span).toBeInTheDocument();
  });

  it("renders with custom className", () => {
    render(<DecryptedText text="Test" className="text-xl font-bold" />);
    const span = screen.getByLabelText("Test");
    expect(span.className).toContain("text-xl");
    expect(span.className).toContain("font-bold");
  });

  it("displays the original text content initially (before animation)", () => {
    render(<DecryptedText text="Stable Text" />);
    const span = screen.getByLabelText("Stable Text");
    // The displayText state starts with the text prop
    expect(span).toHaveTextContent("Stable Text");
  });

  it("skips animation when prefers-reduced-motion is set", () => {
    // Override the matchMedia mock to return matches: true
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: query === "(prefers-reduced-motion: reduce)",
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    render(<DecryptedText text="No Animation" />);
    // With reduced motion, the text should remain as-is
    expect(screen.getByLabelText("No Animation")).toHaveTextContent(
      "No Animation"
    );

    // Restore default mock
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  it("observes the element with IntersectionObserver", () => {
    render(<DecryptedText text="Observed" />);
    expect(mockObserve).toHaveBeenCalled();
  });

  it("starts animation when element intersects", () => {
    // Mock requestAnimationFrame to execute immediately
    const rafSpy = vi
      .spyOn(window, "requestAnimationFrame")
      .mockImplementation((cb) => {
        cb(performance.now());
        return 1;
      });

    render(<DecryptedText text="Decrypt Me" duration={0} />);

    act(() => {
      intersectionCallback(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver
      );
    });

    // After animation with duration=0, text should be fully revealed
    expect(screen.getByLabelText("Decrypt Me")).toHaveTextContent("Decrypt Me");

    rafSpy.mockRestore();
  });

  it("disconnects observer after intersection", () => {
    render(<DecryptedText text="Test" />);

    act(() => {
      intersectionCallback(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver
      );
    });

    expect(mockDisconnect).toHaveBeenCalled();
  });

  it("does not animate when element is not intersecting", () => {
    const rafSpy = vi.spyOn(window, "requestAnimationFrame");

    render(<DecryptedText text="Not Yet" />);

    act(() => {
      intersectionCallback(
        [{ isIntersecting: false } as IntersectionObserverEntry],
        {} as IntersectionObserver
      );
    });

    // requestAnimationFrame should NOT have been called for animation
    expect(rafSpy).not.toHaveBeenCalled();

    rafSpy.mockRestore();
  });
});
