/**
 * Matomo analytics helpers.
 *
 * The base tracking (pageview) is initialized in `src/app/[locale]/layout.tsx`
 * via the `_paq` global array injected in `<head>`. This module only adds
 * custom events on top of that, using the standard Matomo API:
 *
 *   window._paq.push(['trackEvent', category, action, name?, value?]);
 *
 * All helpers are SSR-safe: they no-op when called during server rendering
 * or when Matomo has not been initialized (e.g. env vars missing in dev).
 *
 * We never send personal data: only URL targets for external links and
 * category/action/label strings we control.
 */

type MatomoCommand = ReadonlyArray<unknown>;

interface MatomoWindow extends Window {
  _paq?: MatomoCommand[];
}

/**
 * Push a raw command to Matomo's `_paq` queue.
 * Safe to call on the server (it simply does nothing).
 */
export function pushMatomoCommand(command: MatomoCommand): void {
  if (typeof window === "undefined") return;
  const w = window as MatomoWindow;
  if (!Array.isArray(w._paq)) return;
  w._paq.push(command);
}

/**
 * Track a custom Matomo event.
 *
 * @param category High-level grouping, e.g. "engagement", "navigation".
 * @param action   Specific action, e.g. "scroll_depth", "external_link_click".
 * @param name     Optional label (string) giving context (URL, step number…).
 * @param value    Optional numeric value (e.g. seconds on page).
 */
export function trackEvent(
  category: string,
  action: string,
  name?: string,
  value?: number
): void {
  const command: unknown[] = ["trackEvent", category, action];
  if (name !== undefined) command.push(name);
  if (value !== undefined) command.push(value);
  pushMatomoCommand(command);
}
