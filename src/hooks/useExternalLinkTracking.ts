"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics/matomo";

/**
 * Hostnames considered "internal". Clicks on these are not tracked as
 * external, since they stay on the site. The site domain itself is
 * automatically included via `window.location.hostname`.
 */
const INTERNAL_HOSTS = new Set<string>([
  "localhost",
  "127.0.0.1",
  "claude-codex.fr",
]);

/**
 * Determine whether a URL is external to the current site.
 * Returns false for same-origin links, mailto:, tel:, anchor fragments, etc.
 */
function isExternalUrl(href: string): boolean {
  if (!href) return false;
  if (href.startsWith("#")) return false;
  if (href.startsWith("/")) return false;
  if (
    href.startsWith("mailto:") ||
    href.startsWith("tel:") ||
    href.startsWith("javascript:")
  )
    return false;
  try {
    const url = new URL(href, globalThis.location.href);
    if (url.protocol !== "http:" && url.protocol !== "https:") return false;
    if (url.hostname === globalThis.location.hostname) return false;
    if (INTERNAL_HOSTS.has(url.hostname)) return false;
    return true;
  } catch {
    return false;
  }
}

/**
 * Track clicks on external links (i.e. links leaving the site) via a single
 * capture-phase listener on the document. For each external click we fire
 * a Matomo event `navigation / external_link_click` with the target URL
 * (no query-string tracking, we store the href as-is as Matomo label).
 *
 * The listener uses event delegation so newly-rendered links are picked up
 * without having to re-bind, which is important for client-side navigation.
 *
 * SSR-safe: does nothing until mounted in the browser.
 */
export function useExternalLinkTracking(): void {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      // Only left-clicks, no modifier keys (so middle-click / cmd+click
      // open in a new tab without double-firing from our listener).
      if (event.defaultPrevented) return;
      if (event.button !== 0) return;

      const target = event.target as Element | null;
      if (!target || typeof target.closest !== "function") return;

      const anchor = target.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      if (!isExternalUrl(href)) return;

      // We resolve the absolute URL so the event label is always fully
      // qualified even when the page used a protocol-relative href.
      let absoluteHref = href;
      try {
        absoluteHref = new URL(href, globalThis.location.href).toString();
      } catch {
        /* keep href as-is */
      }

      trackEvent("navigation", "external_link_click", absoluteHref);
    };

    document.addEventListener("click", handleClick, { capture: true });
    return () => {
      document.removeEventListener("click", handleClick, { capture: true });
    };
  }, []);
}
