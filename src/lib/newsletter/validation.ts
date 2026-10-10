/**
 * THE-4 — Validation et normalisation des emails newsletter.
 *
 * Validation legere cote frontiere (input utilisateur), sans dependance
 * externe pour rester lean. Le pattern accepte la grande majorite des
 * adresses reelles tout en rejetant les saisies manifestement invalides.
 */

/** Longueur maximale acceptee (RFC 5321 limite l'adresse a 254 caracteres). */
export const MAX_EMAIL_LENGTH = 254;

/**
 * Pattern email pragmatique : `local@domaine.tld`.
 * - local : caracteres usuels hors espaces et `@`
 * - domaine : au moins un point, TLD de 2+ lettres
 */
const EMAIL_PATTERN =
  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Normalise une adresse : trim + lowercase.
 * Le store reste la source de verite ; cette normalisation evite les
 * doublons triviaux (`A@x.com` vs `a@x.com `).
 */
export function normalizeEmail(raw: string): string {
  return raw.trim().toLowerCase();
}

/**
 * Valide une adresse email apres normalisation.
 * @returns `true` si l'adresse est plausible et dans la limite de longueur.
 */
export function isValidEmail(raw: string): boolean {
  const email = normalizeEmail(raw);
  if (email.length === 0 || email.length > MAX_EMAIL_LENGTH) {
    return false;
  }
  return EMAIL_PATTERN.test(email);
}
