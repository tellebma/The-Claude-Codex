/**
 * THE-4 — Configuration de la capture newsletter (Supabase).
 *
 * Le site est exporte en statique (`output: 'export'`) : il n'y a pas de
 * runtime serveur Next. La persistance se fait donc cote client via l'API
 * REST PostgREST de Supabase, protegee par une policy RLS « insert-only »
 * pour la cle anon publique. Aucun secret au-dela de la cle anon n'est
 * embarque (cf. THE-4 : escalade CEO requise au-dela de l'anon key).
 *
 * Les deux variables sont publiques par conception (`NEXT_PUBLIC_*`) :
 * l'URL du projet et la cle anon sont destinees au navigateur.
 */

export interface NewsletterConfig {
  readonly url: string;
  readonly anonKey: string;
}

/** Nom de la table cible dans le schema `public`. */
export const NEWSLETTER_TABLE = "newsletter_subscribers";

/**
 * Lit la configuration depuis les variables d'environnement publiques.
 * @returns la config si les deux variables sont presentes, sinon `null`.
 */
export function getNewsletterConfig(): NewsletterConfig | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  if (!url || !anonKey) {
    return null;
  }

  return { url, anonKey };
}

/** Indique si la newsletter est correctement cablee a un projet Supabase. */
export function isNewsletterConfigured(): boolean {
  return getNewsletterConfig() !== null;
}
