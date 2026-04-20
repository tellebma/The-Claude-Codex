import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useScrollDepthTracking } from "@/hooks/useScrollDepthTracking";

/**
 * Helpers to drive scroll-depth computation deterministically in jsdom:
 * - `scrollHeight` of the document element defines the full page height.
 * - `window.innerHeight` defines the viewport height.
 * - `window.scrollY` defines the current scroll position.
 *
 * We set up a 2000 px tall document with a 1000 px viewport, so the
 * scrollable range is [0, 1000] and each 250 px of scrollY ≈ 25 %.
 */
function setupPageDimensions(options: {
  viewport: number;
  scrollHeight: number;
}) {
  Object.defineProperty(window, "innerHeight", {
    configurable: true,
    writable: true,
    value: options.viewport,
  });
  Object.defineProperty(document.documentElement, "scrollHeight", {
    configurable: true,
    value: options.scrollHeight,
  });
  Object.defineProperty(document.documentElement, "offsetHeight", {
    configurable: true,
    value: options.scrollHeight,
  });
  Object.defineProperty(document.documentElement, "clientHeight", {
    configurable: true,
    value: options.viewport,
  });
  Object.defineProperty(document.body, "scrollHeight", {
    configurable: true,
    value: options.scrollHeight,
  });
  Object.defineProperty(document.body, "offsetHeight", {
    configurable: true,
    value: options.scrollHeight,
  });
}

function scrollTo(y: number) {
  Object.defineProperty(window, "scrollY", {
    configurable: true,
    writable: true,
    value: y,
  });
  window.dispatchEvent(new Event("scroll"));
}

describe("useScrollDepthTracking", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // Provide a _paq queue we can inspect.
    (window as unknown as { _paq: unknown[] })._paq = [];
    setupPageDimensions({ viewport: 1000, scrollHeight: 2000 });
    Object.defineProperty(window, "scrollY", {
      configurable: true,
      writable: true,
      value: 0,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    delete (window as unknown as { _paq?: unknown[] })._paq;
  });

  function getScrollDepthEvents(): Array<{
    threshold: string;
    value: number;
  }> {
    const paq = (window as unknown as { _paq: unknown[][] })._paq;
    return paq
      .filter((cmd) => cmd[0] === "trackEvent" && cmd[2] === "scroll_depth")
      .map((cmd) => ({
        threshold: cmd[3] as string,
        value: cmd[4] as number,
      }));
  }

  it("fires each threshold at most once per mount", () => {
    renderHook(() => useScrollDepthTracking());

    // initial fire (depth = 0 on a scrollable page)
    expect(getScrollDepthEvents()).toHaveLength(0);

    // Scroll to 25% and flush debounce.
    act(() => {
      scrollTo(250);
      vi.advanceTimersByTime(200);
    });
    expect(getScrollDepthEvents().map((e) => e.threshold)).toEqual(["25"]);

    // Scroll again within 25% — should NOT re-fire 25 event.
    act(() => {
      scrollTo(260);
      vi.advanceTimersByTime(200);
    });
    expect(getScrollDepthEvents().map((e) => e.threshold)).toEqual(["25"]);

    // Scroll to 50%.
    act(() => {
      scrollTo(500);
      vi.advanceTimersByTime(200);
    });
    expect(getScrollDepthEvents().map((e) => e.threshold)).toEqual(["25", "50"]);

    // Scroll to 100% (value >= 1000 = scrollable range end).
    act(() => {
      scrollTo(1000);
      vi.advanceTimersByTime(200);
    });
    expect(getScrollDepthEvents().map((e) => e.threshold)).toEqual([
      "25",
      "50",
      "75",
      "100",
    ]);

    // Additional scroll events should not duplicate any threshold.
    act(() => {
      scrollTo(1000);
      vi.advanceTimersByTime(200);
    });
    expect(getScrollDepthEvents()).toHaveLength(4);
  });

  it("fires 100% immediately on short pages with no scrollable range", () => {
    setupPageDimensions({ viewport: 1000, scrollHeight: 500 });
    renderHook(() => useScrollDepthTracking());
    // initial fireIfNeeded runs synchronously after mount
    const events = getScrollDepthEvents().map((e) => e.threshold);
    expect(events).toContain("25");
    expect(events).toContain("50");
    expect(events).toContain("75");
    expect(events).toContain("100");
    expect(events).toHaveLength(4);
  });

  it("debounces rapid scroll events", () => {
    renderHook(() => useScrollDepthTracking());

    // Fire many scroll events very fast, all within a single debounce window.
    act(() => {
      for (let i = 0; i < 10; i++) {
        scrollTo(100 + i * 10);
      }
      // Advance less than the debounce — no event yet.
      vi.advanceTimersByTime(50);
    });
    expect(getScrollDepthEvents()).toHaveLength(0);

    // Push scroll into 25% territory then flush.
    act(() => {
      scrollTo(300);
      vi.advanceTimersByTime(200);
    });
    // Only the final state should produce one event, not one per scroll.
    expect(getScrollDepthEvents().map((e) => e.threshold)).toEqual(["25"]);
  });

  it("no-ops safely when _paq is missing", () => {
    delete (window as unknown as { _paq?: unknown[] })._paq;
    expect(() => {
      renderHook(() => useScrollDepthTracking());
      act(() => {
        scrollTo(500);
        vi.advanceTimersByTime(200);
      });
    }).not.toThrow();
  });
});
