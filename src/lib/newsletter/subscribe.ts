/**
 * THE-4 — Logique de souscription newsletter (cote client).
 *
 * Insere un email dans la table Supabase via l'API REST PostgREST. Pas de
 * SDK : un simple `fetch` suffit et garde le bundle leger (page-speed
 * first-class). L'insertion est protegee cote serveur par une policy RLS
 * « insert-only » pour la cle anon, et par une contrainte d'unicite sur
 * l'email (les doublons sont traites comme un succes idempotent).
 */

import { getNewsletterConfig, NEWSLETTER_TABLE } from "./config";
import { remainingCooldownMs, markSubmitted } from "./rate-limit";
import { isValidEmail, normalizeEmail } from "./validation";

/** Issue d'une tentative de souscription. */
export type SubscribeOutcome =
  | "success"
  | "already_subscribed"
  | "invalid_email"
  | "rate_limited"
  | "not_configured"
  | "error";

export interface SubscribeResult {
  readonly outcome: SubscribeOutcome;
  /** Cooldown restant (ms) quand `outcome === "rate_limited"`. */
  readonly retryAfterMs?: number;
}

export interface SubscribeInput {
  readonly email: string;
  /** Champ piege : doit rester vide. Rempli = bot. */
  readonly honeypot?: string;
  /** Emplacement d'origine (hero, footer…) pour la segmentation. */
  readonly source?: string;
}

export interface SubscribeDeps {
  readonly fetchImpl?: typeof fetch;
  readonly now?: number;
}

/**
 * Tente d'inscrire un email. Pure dans son flot de decision (honeypot,
 * validation, rate-limit) ; l'I/O reseau est injectable pour les tests.
 */
export async function subscribeEmail(
  input: SubscribeInput,
  deps: SubscribeDeps = {},
): Promise<SubscribeResult> {
  const now = deps.now ?? Date.now();

  // 1. Honeypot : un bot remplit le champ cache. On feint le succes pour
  //    ne pas signaler le piege.
  if (input.honeypot && input.honeypot.trim().length > 0) {
    return { outcome: "success" };
  }

  // 2. Validation email.
  if (!isValidEmail(input.email)) {
    return { outcome: "invalid_email" };
  }

  // 3. Rate-limit cote client.
  const cooldown = remainingCooldownMs(now);
  if (cooldown > 0) {
    return { outcome: "rate_limited", retryAfterMs: cooldown };
  }

  // 4. Configuration Supabase.
  const config = getNewsletterConfig();
  if (!config) {
    return { outcome: "not_configured" };
  }

  const email = normalizeEmail(input.email);
  const doFetch = deps.fetchImpl ?? fetch;

  try {
    const response = await doFetch(
      `${config.url}/rest/v1/${NEWSLETTER_TABLE}`,
      {
        method: "POST",
        headers: {
          apikey: config.anonKey,
          Authorization: `Bearer ${config.anonKey}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          email,
          source: input.source ?? "site",
        }),
      },
    );

    if (response.ok) {
      markSubmitted(now);
      return { outcome: "success" };
    }

    // 409 / 23505 : violation d'unicite -> deja inscrit (idempotent).
    if (response.status === 409) {
      markSubmitted(now);
      return { outcome: "already_subscribed" };
    }

    return { outcome: "error" };
  } catch {
    return { outcome: "error" };
  }
}
