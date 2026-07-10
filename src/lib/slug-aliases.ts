import type { Locale } from "@/i18n/config";

/**
 * Slugs qui divergent entre locales, regroupes par article/page canonique.
 *
 * Chaque entree du tableau represente UN article ou UNE page, avec son slug
 * dans chaque locale ou il a ete traduit avec un slug different. Une locale
 * absente d'un groupe (par exemple `es` tant que l'article n'a pas encore ete
 * traduit) fait retomber `getAlternateLocalePath` sur le pathname inchange
 * pour cette locale cible : voir la doc de la fonction plus bas.
 *
 * Pour les pages dont le slug est identique dans toutes les locales, aucune
 * entree n'est necessaire.
 *
 * A mettre a jour lors de tout ajout d'article avec des slugs divergents,
 * y compris lors de l'ajout d'une traduction ES a un article deja present
 * en FR/EN (ajouter juste la cle `es` au groupe existant).
 */
type LocaleSlugGroup = Partial<Record<Locale, string>>;

const SLUG_GROUPS: ReadonlyArray<LocaleSlugGroup> = [
  { fr: "bonnes-pratiques-securite", en: "security-best-practices" },
  { fr: "ci-cd-cyber-securite", en: "ci-cd-cyber-security" },
  { fr: "cout-tokens-par-langue", en: "token-cost-by-language" },
  { fr: "couts-reels-claude-code", en: "real-costs-claude-code" },
  { fr: "fuite-cle-api", en: "leaked-api-key-recovery" },
  { fr: "mode-plan-vs-thinking", en: "plan-vs-thinking-mode" },
  { fr: "mythes-claude-code", en: "claude-code-myths" },
  {
    fr: "ne-pas-donner-cles-api-a-claude-code",
    en: "do-not-give-api-keys-to-claude-code",
  },
  {
    fr: "refaire-une-card-avec-impeccable-et-playwright",
    en: "redo-a-card-with-impeccable-and-playwright",
  },
  { fr: "sonnet-5-fable-5-nouveaux-modeles", en: "claude-sonnet-5-fable-5-new-models" },
  { fr: "fable-5-est-de-retour", en: "fable-is-back-what-you-must-know" },
  { fr: "securite-mcp", en: "mcp-security" },
];

/**
 * Pour un pathname sans prefixe de locale (tel que retourne par usePathname()),
 * remplace le dernier segment de slug par son equivalent dans la locale cible.
 *
 * Le groupe est retrouve en cherchant le segment parmi TOUTES les valeurs
 * connues du groupe (pas seulement `fromLocale`) : une page ES generee en
 * fallback (tant qu'aucune traduction ES n'existe, cf. les `generateStaticParams`
 * des routes `[slug]`) est servie sous le slug par defaut (`fr`), donc un lien
 * PARTANT d'une telle page doit resoudre le groupe via sa cle `fr`, pas une
 * cle `es` qui n'existe pas encore.
 *
 * Une fois le groupe trouve, la cible est `group[toLocale]` si elle existe,
 * sinon `group.fr` (le slug par defaut, qui est garanti d'exister dans le
 * build tant que `toLocale` n'a pas sa propre traduction -- meme logique de
 * repli que les `generateStaticParams` cote build), sinon le segment
 * d'origine inchange. Si aucun groupe n'est trouve du tout, le slug est
 * identique dans toutes les locales : le pathname est retourne inchange.
 *
 * Exemples :
 *   getAlternateLocalePath("/content/ci-cd-cyber-security/", "en", "fr")
 *     → "/content/ci-cd-cyber-securite/"
 *   getAlternateLocalePath("/mcp/mcp-security/", "en", "fr")
 *     → "/mcp/securite-mcp/"
 *   getAlternateLocalePath("/content/garry-tan-stack/", "fr", "en")
 *     → "/content/garry-tan-stack/" (inchange, slug identique dans les 2 locales)
 *   getAlternateLocalePath("/content/security-best-practices/", "en", "es")
 *     → "/content/bonnes-pratiques-securite/" (pas de slug ES encore : repli
 *       sur le slug FR, qui est celui reellement genere par le build ES)
 */
export function getAlternateLocalePath(
  pathname: string,
  fromLocale: Locale,
  toLocale: Locale
): string {
  if (fromLocale === toLocale) return pathname;

  const segments = pathname.split("/").filter(Boolean);
  const lastSegment = segments.at(-1);
  if (!lastSegment) return pathname;

  const group = SLUG_GROUPS.find((g) =>
    Object.values(g).includes(lastSegment)
  );
  if (!group) return pathname;

  const alias = group[toLocale] ?? group.fr ?? lastSegment;
  if (alias === lastSegment) return pathname;

  const newSegments = [...segments.slice(0, -1), alias];
  const result = `/${newSegments.join("/")}`;
  return pathname.endsWith("/") ? `${result}/` : result;
}
