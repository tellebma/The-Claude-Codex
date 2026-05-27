/**
 * Article epingle manuellement par le PO sur /content (CTN-3).
 *
 * Le slug doit correspondre a un MDX racine present en FR et EN
 * (`content/{locale}/{slug}.mdx`). Si le slug est introuvable, le
 * layout degrade gracieusement (Latest reprend la pleine largeur).
 *
 * review monthly — verifier que le slug reste pertinent (article
 * cornerstone, traffic stable ou en hausse).
 */
export const PINNED_ARTICLE_SLUG: string | null =
  "comprendre-claude-code-internals";
