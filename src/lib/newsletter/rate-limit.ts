/**
 * THE-4 — Anti-spam leger cote client : cooldown entre deux soumissions.
 *
 * Ce n'est pas une securite (le client est manipulable) mais un garde-fou
 * qui decourage le flood naif. La vraie protection repose sur la policy RLS
 * et la contrainte d'unicite cote base. Le cooldown est persiste dans
 * `localStorage` pour survivre a un rechargement de page.
 */

/** Cle de stockage du dernier envoi reussi (timestamp ms). */
export const RATE_LIMIT_KEY = "codex_newsletter_last_submit";

/** Delai minimal entre deux soumissions (ms). */
export const RATE_LIMIT_WINDOW_MS = 30_000;

function safeStorage(): Storage | null {
  try {
    if (typeof window === "undefined" || !window.localStorage) {
      return null;
    }
    return window.localStorage;
  } catch {
    // Acces localStorage peut lever (mode prive, cookies bloques).
    return null;
  }
}

/**
 * @returns le nombre de millisecondes restantes avant la prochaine
 * soumission autorisee, ou `0` si l'envoi est permis immediatement.
 */
export function remainingCooldownMs(now: number): number {
  const storage = safeStorage();
  if (!storage) {
    return 0;
  }
  const raw = storage.getItem(RATE_LIMIT_KEY);
  if (!raw) {
    return 0;
  }
  const last = Number.parseInt(raw, 10);
  if (!Number.isFinite(last)) {
    return 0;
  }
  const elapsed = now - last;
  if (elapsed >= RATE_LIMIT_WINDOW_MS) {
    return 0;
  }
  return RATE_LIMIT_WINDOW_MS - elapsed;
}

/** Marque l'instant d'un envoi reussi pour armer le cooldown. */
export function markSubmitted(now: number): void {
  const storage = safeStorage();
  storage?.setItem(RATE_LIMIT_KEY, String(now));
}
