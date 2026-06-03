/**
 * Vercel Analytics custom events — SSR-safe wrapper.
 *
 * `@vercel/analytics`'s `track()` is import-time available, but the actual
 * beacon only fires when `<Analytics />` has mounted (client-side, on Vercel
 * deployment). On the server or when the SDK is not loaded, this helper
 * silently no-ops so we never crash and never throw.
 *
 * Convention :
 * - `name` : snake_case action name reused 1:1 dans le dashboard Vercel
 * - `properties` : record de strings/numbers/booleans (Vercel sanitise et
 *   tronque), evite tout PII et tout secret cote appelant.
 *
 * VM-4 : 2 events strategiques dupliques cote Vercel pour cross-check
 * Matomo / Vercel sur 1 mois (cf. EPIC Vercel Metrics 2026).
 */

import { track } from "@vercel/analytics";

type AllowedValue = string | number | boolean | null;

export function trackVercelEvent(
  name: string,
  properties?: Readonly<Record<string, AllowedValue>>
): void {
  // useEffect-only callers garantissent qu'on est cote client. On garde
  // quand meme un guard try/catch pour ne pas crasher si le SDK n'a pas
  // ete monte (ex: hors Vercel deploy, env de test sans <Analytics />).
  try {
    if (properties) {
      track(name, properties);
    } else {
      track(name);
    }
  } catch {
    /* SDK absent ou non monte : no-op silencieux */
  }
}
