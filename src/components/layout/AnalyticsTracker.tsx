"use client";

import { useScrollDepthTracking } from "@/hooks/useScrollDepthTracking";
import { useExternalLinkTracking } from "@/hooks/useExternalLinkTracking";

/**
 * Invisible tracker component.
 *
 * Renders nothing; its sole purpose is to activate the scroll-depth and
 * external-link Matomo hooks on the client. Mount it inside layouts that
 * wrap content pages (e.g. `SectionLayout`) so documentation and articles
 * are instrumented by default, without touching individual pages.
 *
 * The component is a client component so it can be safely embedded in
 * server components that otherwise don't need `"use client"`.
 */
export function AnalyticsTracker() {
  useScrollDepthTracking();
  useExternalLinkTracking();
  return null;
}
