/**
 * Utilitaires purs pour la page 404 interactive. Extraits de NotFoundClient
 * pour permettre leur test unitaire indépendant (le composant lui-même utilise
 * React Three Fiber qui ne s'exécute pas en jsdom).
 */

export type Locale = "fr" | "en";

/**
 * Convertit un pathname en une requête de recherche pertinente. Retire les
 * slashes de bords, remplace les tirets/underscores et slashes internes par
 * des espaces. Utilisé pour proposer automatiquement une recherche pour
 * l'URL que l'utilisateur a tenté d'atteindre.
 */
export function pathToQuery(pathname: string): string {
  return pathname
    .replace(/^\//, "")
    .replace(/\/$/, "")
    .replaceAll(/[-_]/g, " ")
    .replaceAll("/", " ");
}

/**
 * Détecte la locale à partir du pathname courant. Retourne `null` si aucun
 * préfixe `/fr` ou `/en` n'est présent (laisser le caller choisir une
 * valeur par défaut).
 */
export function detectLocaleFromPath(pathname: string): Locale | null {
  if (pathname.startsWith("/en/") || pathname === "/en") return "en";
  if (pathname.startsWith("/fr/") || pathname === "/fr") return "fr";
  return null;
}

/**
 * Ajoute le préfixe de locale à un href si absent. Les URLs absolues
 * (http/https) sont retournées telles quelles, tout comme les URLs qui
 * commencent déjà par `/fr/` ou `/en/`.
 */
export function prefixWithLocale(href: string, locale: Locale): string {
  if (href.startsWith(`/${locale}/`) || href === `/${locale}`) return href;
  if (href.startsWith("http")) return href;
  const cleaned = href.startsWith("/") ? href : `/${href}`;
  return `/${locale}${cleaned === "/" ? "" : cleaned}`;
}
