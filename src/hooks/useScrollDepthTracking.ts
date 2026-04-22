"use client";

import { useEffect, useRef } from "react";
import { trackEvent } from "@/lib/analytics/matomo";

/**
 * Thresholds (in percent) at which we fire a `scroll_depth` Matomo event.
 * Each threshold is sent at most once per page view.
 */
const SCROLL_DEPTH_THRESHOLDS = [25, 50, 75, 100] as const;

/** Minimum delay between two scroll handler executions, in milliseconds. */
const SCROLL_DEBOUNCE_MS = 150;

/**
 * Compute the current scroll depth as a percentage of the full scrollable
 * height. Returns a value in [0, 100]. For pages shorter than the viewport
 * (nothing to scroll), we return 100 to avoid counting them as 0% depth.
 */
function computeScrollDepth(): number {
  if (globalThis.window === undefined) return 0;
  const doc = document.documentElement;
  const scrollTop = globalThis.scrollY || doc.scrollTop;
  const viewport = globalThis.innerHeight || doc.clientHeight;
  const fullHeight = Math.max(
    doc.scrollHeight,
    doc.offsetHeight,
    document.body?.scrollHeight ?? 0,
    document.body?.offsetHeight ?? 0
  );
  const scrollable = fullHeight - viewport;
  if (scrollable <= 0) return 100;
  return Math.min(100, Math.max(0, (scrollTop / scrollable) * 100));
}

/**
 * Track reading depth on content pages.
 *
 * Sends a Matomo event `engagement / scroll_depth` with label `25`, `50`,
 * `75` or `100` the first time the user crosses each threshold on the
 * current page. The scroll handler is debounced so it runs at most once
 * every 150 ms.
 *
 * Usage: call inside a `"use client"` component mounted on the pages you
 * want to instrument (e.g. the content SectionLayout wrapper).
 *
 * SSR-safe: does nothing until the component mounts in the browser.
 */
export function useScrollDepthTracking(): void {
  const firedRef = useRef<Set<number>>(new Set());
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Reset fired thresholds on mount (new page view).
    firedRef.current = new Set();

    const fireIfNeeded = () => {
      const depth = computeScrollDepth();
      for (const threshold of SCROLL_DEPTH_THRESHOLDS) {
        if (depth >= threshold && !firedRef.current.has(threshold)) {
          firedRef.current.add(threshold);
          trackEvent(
            "engagement",
            "scroll_depth",
            String(threshold),
            threshold
          );
        }
      }
    };

    const handleScroll = () => {
      if (debounceTimer.current !== null) return;
      debounceTimer.current = setTimeout(() => {
        debounceTimer.current = null;
        fireIfNeeded();
      }, SCROLL_DEBOUNCE_MS);
    };

    // Run once on mount in case the page is already at/past a threshold
    // (e.g. short pages, or anchor link landing).
    fireIfNeeded();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (debounceTimer.current !== null) {
        clearTimeout(debounceTimer.current);
        debounceTimer.current = null;
      }
    };
  }, []);
}
