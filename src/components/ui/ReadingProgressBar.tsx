"use client";

import { useEffect, useRef, useState } from "react";

/**
 * RG2-02 — Barre de progression de lecture fixe en haut de page article.
 *
 * Atmosphere :
 * - Position fixed top-0 left-0 right-0, hauteur 3px, z-100
 * - Fill gradient linear cyan -> amber -> rouge (intensite croissante)
 * - Transition width 80ms linear pour suivi smooth du scroll
 * - Cache (transition supprime) en prefers-reduced-motion : reduce
 *
 * Calcul : pourcentage de scrollY relatif a la hauteur totale du document
 * scrollable. Listener scroll passive (perf), throttle natif via setState
 * (React batchings).
 *
 * Source design : `article.css` `.art-progress`, `.art-progress-fill`.
 */
export function ReadingProgressBar() {
  const [progress, setProgress] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const mq = globalThis.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReducedMotion(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    const compute = () => {
      const scrollTop = globalThis.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - globalThis.innerHeight;
      const ratio = docHeight > 0 ? Math.min(1, scrollTop / docHeight) : 0;
      setProgress(ratio * 100);
    };

    const onScroll = () => {
      if (rafRef.current !== null) return;
      rafRef.current = globalThis.requestAnimationFrame(() => {
        rafRef.current = null;
        compute();
      });
    };

    compute();
    globalThis.addEventListener("scroll", onScroll, { passive: true });
    globalThis.addEventListener("resize", onScroll, { passive: true });

    return () => {
      globalThis.removeEventListener("scroll", onScroll);
      globalThis.removeEventListener("resize", onScroll);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="art-progress fixed inset-x-0 top-0 z-[100] h-[3px] bg-transparent"
    >
      <div
        className="art-progress-fill h-full"
        style={{
          width: `${progress}%`,
          background:
            "linear-gradient(90deg, var(--color-brand-500), var(--color-accent-500), var(--color-error))",
          transition: reducedMotion ? "none" : "width 80ms linear",
        }}
      />
    </div>
  );
}
