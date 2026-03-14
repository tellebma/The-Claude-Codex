"use client";

import { useEffect, useState } from "react";

/**
 * Hook that detects whether the user prefers reduced motion.
 * Returns `true` if `prefers-reduced-motion: reduce` is active.
 * Safe for SSR: defaults to `false` until client-side hydration.
 */
export function usePrefersReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return prefersReduced;
}
