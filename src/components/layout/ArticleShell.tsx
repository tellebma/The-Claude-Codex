import { TableOfContents } from "@/components/ui/TableOfContents";
import { ArticleShareRail } from "@/components/ui/ArticleShareRail";

interface ArticleShellProps {
  readonly children: React.ReactNode;
  readonly shareUrl: string;
  readonly shareTitle: string;
  readonly shareLabel?: string;
  readonly copyAriaLabel?: string;
  readonly copiedLabel?: string;
}

/**
 * RG2-01 — Shell article 3 colonnes.
 *
 * Layout grille `1fr | minmax(0, 720px) | 240px` gap 48px max-width 1280px.
 * Mobile (< 1100px) : stack vertical, share rail et TOC caches.
 *
 * Colonne 1 (gauche) : ArticleShareRail sticky
 * Colonne 2 (centre) : body article (children, scope max 720px lecture)
 * Colonne 3 (droite) : TableOfContents sticky
 *
 * Source : `design-source/.../article.css` `.art-shell`, `.art-spacer-left`,
 * `.art-share-rail`, `.art-toc`, `.art-body`.
 */
export function ArticleShell({
  children,
  shareUrl,
  shareTitle,
  shareLabel,
  copyAriaLabel,
  copiedLabel,
}: ArticleShellProps) {
  return (
    <div className="art-shell">
      <aside className="art-spacer-left hidden lg:block">
        <ArticleShareRail
          url={shareUrl}
          title={shareTitle}
          label={shareLabel}
          copyAriaLabel={copyAriaLabel}
          copiedLabel={copiedLabel}
        />
      </aside>

      <article className="art-body">{children}</article>

      <div className="art-toc-rail hidden xl:block">
        {/* TableOfContents gere son sticky / nav semantique en interne */}
        <TableOfContents />
      </div>
    </div>
  );
}
