import { Link } from "@/i18n/navigation";
import { ChevronRight } from "lucide-react";

interface BreadcrumbItem {
  readonly label: string;
  readonly href?: string;
}

interface ArticleSubNavProps {
  readonly crumbs: ReadonlyArray<BreadcrumbItem>;
  readonly currentLocale: "fr" | "en";
  /** Path on the OTHER locale, ex: "/en/content/intro" if currentLocale=fr. */
  readonly otherLocaleHref?: string;
  readonly ariaLabelBreadcrumb: string;
}

/**
 * RG2-01 — Sub-navigation au-dessus du hero d'article.
 *
 * Reproduit `.art-subnav` du design source : breadcrumb a gauche, lang
 * switcher pill a droite. Sticky non, sub-nav purement structurelle qui
 * vit sous le header global.
 *
 * Source : `design-source/.../article.css` `.art-subnav`, `.art-crumbs`,
 * `.art-lang`.
 */
export function ArticleSubNav({
  crumbs,
  currentLocale,
  otherLocaleHref,
  ariaLabelBreadcrumb,
}: ArticleSubNavProps) {
  const otherLocale = currentLocale === "fr" ? "en" : "fr";
  const lastIndex = crumbs.length - 1;

  return (
    <div
      className="border-b border-[color:var(--border-default)] bg-[color:var(--bg-subtle)]/50 px-4 py-3.5 backdrop-blur-sm sm:px-8"
      style={{ backgroundColor: "color-mix(in srgb, var(--bg-subtle) 50%, transparent)" }}
    >
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
        <nav
          aria-label={ariaLabelBreadcrumb}
          className="inline-flex items-center gap-2 text-sm text-[color:var(--fg-muted)]"
        >
          {crumbs.map((crumb, idx) => {
            const isLast = idx === lastIndex;
            // Cle stable : label + href (les breadcrumbs ont des couples uniques).
            // Evite typescript:S6479 (index seul comme cle).
            const key = `${crumb.label}::${crumb.href ?? "_current"}`;
            return (
              <span
                key={key}
                className="inline-flex items-center gap-2"
              >
                {crumb.href && !isLast ? (
                  <Link
                    href={crumb.href}
                    className="text-[color:var(--fg-secondary)] transition-colors hover:text-[color:var(--brand-primary)]"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="font-medium text-[color:var(--fg-primary)]">
                    {crumb.label}
                  </span>
                )}
                {!isLast && (
                  <ChevronRight
                    aria-hidden="true"
                    className="h-3 w-3 text-[color:var(--fg-muted)] opacity-40"
                  />
                )}
              </span>
            );
          })}
        </nav>

        {otherLocaleHref && (
          <div
            className="inline-flex gap-1 rounded-full border border-[color:var(--border-default)] bg-[color:var(--bg-elevated)] p-0.5 text-xs"
            role="group"
            aria-label="Langue"
          >
            <span className="rounded-full bg-brand-500 px-3 py-1 font-semibold text-[color:var(--fg-on-brand)]">
              {currentLocale.toUpperCase()}
            </span>
            <Link
              href={otherLocaleHref}
              className="rounded-full px-3 py-1 font-semibold text-[color:var(--fg-muted)] transition-colors hover:text-[color:var(--fg-primary)]"
            >
              {otherLocale.toUpperCase()}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
