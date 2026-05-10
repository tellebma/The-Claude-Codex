"use client";

import { Suspense } from "react";
import { useScrollDepthTracking } from "@/hooks/useScrollDepthTracking";
import { useExternalLinkTracking } from "@/hooks/useExternalLinkTracking";
import { useMatomoPageviewTracking } from "@/hooks/useMatomoPageviewTracking";

/**
 * Invisible tracker component.
 *
 * Renders nothing; its sole purpose is to activate three Matomo hooks
 * on the client :
 * - `useMatomoPageviewTracking` (SEO-8) : emet un pageview a chaque
 *   navigation App Router cote client. Le snippet `<head>` n'en fire
 *   qu'un au load initial, donc sans ce hook les SPA-navigations ne
 *   sont jamais tracees (cause root du gap 78 pages Matomo vs 234 GSC
 *   du rapport 2026-04-25 → 2026-05-01).
 * - `useScrollDepthTracking` : evenements `engagement / scroll_depth`
 *   a 25 / 50 / 75 / 100% une seule fois par page.
 * - `useExternalLinkTracking` : evenements `navigation / external_link_click`
 *   a chaque clic sur un lien externe.
 *
 * Mount it inside layouts that wrap content pages (e.g. `SectionLayout`)
 * ou directement dans les page.tsx hors layout (cf. SEO-9 PR no 166).
 *
 * Le hook pageview utilise `useSearchParams` qui requiert un `<Suspense>`
 * boundary en App Router (sinon Next.js force la page entiere en CSR).
 * On le wrappe ici pour ne pas obliger chaque appelant a le faire.
 */
/**
 * Wrapper interne necessaire car `useMatomoPageviewTracking` utilise
 * `useSearchParams` qui requiert un boundary `<Suspense>` parent en
 * App Router (sinon Next.js opt out le route en pure CSR au build).
 */
function MatomoPageviewWrapper() {
  useMatomoPageviewTracking();
  return null;
}

export function AnalyticsTracker() {
  useScrollDepthTracking();
  useExternalLinkTracking();
  return (
    <Suspense fallback={null}>
      <MatomoPageviewWrapper />
    </Suspense>
  );
}
