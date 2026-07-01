"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics/matomo";

/**
 * TUTO-10 — Mesure l'usage reel de `ArticlePager` (sur les pages tuto) et
 * `SectionPeers` via un seul listener delegue `click` capture-phase, sur
 * le meme modele que `useExternalLinkTracking`.
 *
 * Les elements cibles portent un attribut `data-track-category` (la
 * categorie Matomo a utiliser) et un `data-track-action` (l'action). Le
 * label optionnel vient de `data-track-label` (sinon `href` de l'ancre).
 */
export function useTutoComponentTracking(): void {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (event.defaultPrevented) return;
      if (event.button !== 0) return;

      const target = event.target as Element | null;
      if (!target || typeof target.closest !== "function") return;

      const tracked = target.closest<HTMLElement>("[data-track-category]");
      if (!tracked) return;

      const category = tracked.dataset.trackCategory;
      const action = tracked.dataset.trackAction;
      if (!category || !action) return;

      const label =
        tracked.dataset.trackLabel ??
        (tracked instanceof HTMLAnchorElement ? tracked.href : undefined);

      trackEvent(category, action, label);
    };

    document.addEventListener("click", handleClick, { capture: true });
    return () => {
      document.removeEventListener("click", handleClick, { capture: true });
    };
  }, []);
}
