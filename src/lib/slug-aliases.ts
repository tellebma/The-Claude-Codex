/**
 * Mapping bidirectionnel des slugs qui different entre les locales FR et EN.
 *
 * Pour les pages dont le slug est identique dans les deux locales, aucune entree
 * n'est necessaire : getAlternateLocalePath retourne le pathname inchange.
 *
 * A mettre a jour lors de tout ajout d'article avec des slugs divergents.
 */
const SLUG_ALIASES: Readonly<Record<string, string>> = {
  // content : FR → EN
  "bonnes-pratiques-securite": "security-best-practices",
  "ci-cd-cyber-securite": "ci-cd-cyber-security",
  "cout-tokens-par-langue": "token-cost-by-language",
  "couts-reels-claude-code": "real-costs-claude-code",
  "fuite-cle-api": "leaked-api-key-recovery",
  "mode-plan-vs-thinking": "plan-vs-thinking-mode",
  "mythes-claude-code": "claude-code-myths",
  "ne-pas-donner-cles-api-a-claude-code": "do-not-give-api-keys-to-claude-code",
  "refaire-une-card-avec-impeccable-et-playwright":
    "redo-a-card-with-impeccable-and-playwright",
  "sonnet-5-fable-5-nouveaux-modeles": "claude-sonnet-5-fable-5-new-models",
  // content : EN → FR
  "security-best-practices": "bonnes-pratiques-securite",
  "ci-cd-cyber-security": "ci-cd-cyber-securite",
  "token-cost-by-language": "cout-tokens-par-langue",
  "real-costs-claude-code": "couts-reels-claude-code",
  "leaked-api-key-recovery": "fuite-cle-api",
  "plan-vs-thinking-mode": "mode-plan-vs-thinking",
  "claude-code-myths": "mythes-claude-code",
  "do-not-give-api-keys-to-claude-code": "ne-pas-donner-cles-api-a-claude-code",
  "redo-a-card-with-impeccable-and-playwright":
    "refaire-une-card-avec-impeccable-et-playwright",
  "claude-sonnet-5-fable-5-new-models": "sonnet-5-fable-5-nouveaux-modeles",
  // mcp : FR ↔ EN
  "securite-mcp": "mcp-security",
  "mcp-security": "securite-mcp",
};

/**
 * Pour un pathname sans prefixe de locale (tel que retourne par usePathname()),
 * remplace le dernier segment de slug par son equivalent dans l'autre locale
 * si un alias est defini. Retourne le pathname inchange si aucun alias n'existe.
 *
 * Exemples :
 *   "/content/ci-cd-cyber-security/" → "/content/ci-cd-cyber-securite/"
 *   "/mcp/mcp-security/"            → "/mcp/securite-mcp/"
 *   "/content/garry-tan-stack/"     → "/content/garry-tan-stack/" (inchange)
 */
export function getAlternateLocalePath(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  const lastSegment = segments.at(-1);
  if (!lastSegment) return pathname;

  const alias = SLUG_ALIASES[lastSegment];
  if (!alias) return pathname;

  const newSegments = [...segments.slice(0, -1), alias];
  const result = `/${newSegments.join("/")}`;
  return pathname.endsWith("/") ? `${result}/` : result;
}
