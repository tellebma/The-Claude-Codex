"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { pushMatomoCommand } from "@/lib/analytics/matomo";

/**
 * Track Matomo pageviews on Next.js App Router client-side navigations.
 *
 * Pourquoi ce hook : le snippet Matomo charge dans `<head>` execute
 * `_paq.push(['trackPageView'])` une seule fois au chargement initial.
 * Or Next.js App Router fait des navigations cote client (Link, router.push)
 * sans recharger la page, donc le snippet ne re-fire jamais. Resultat :
 * un seul pageview par session, peu importe combien de pages le visiteur
 * consulte. Ce gap explique le 78 pages Matomo vs 234 pages GSC du rapport
 * 2026-04-25 → 2026-05-01.
 *
 * Le fix standard : un hook client qui ecoute les changements de route et
 * pousse un nouveau `trackPageView` a chaque navigation, en mettant a
 * jour `setCustomUrl` et `setDocumentTitle` au prealable pour eviter
 * que tous les events soient attribues a l'URL initiale.
 *
 * SSR-safe : `pushMatomoCommand` no-op cote serveur et quand `_paq` est
 * absent (env vars Matomo non definies en dev).
 */
export function useMatomoPageviewTracking(): void {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (globalThis.window === undefined) return;

    const queryString = searchParams?.toString() ?? "";
    const fullUrl =
      window.location.origin +
      pathname +
      (queryString ? `?${queryString}` : "");

    // setCustomUrl avant trackPageView pour que Matomo attribue l'event
    // a la nouvelle URL et non a celle de la 1re page chargee.
    pushMatomoCommand(["setCustomUrl", fullUrl]);
    pushMatomoCommand(["setDocumentTitle", document.title]);
    pushMatomoCommand(["trackPageView"]);
  }, [pathname, searchParams]);
}
