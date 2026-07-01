import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import {
  sectionNavigation,
  resolveNavHref,
} from "@/lib/section-navigation";
import clsx from "clsx";

/**
 * TUTO-2 — Bloc "pages de la section" rendu dans le rail droit du
 * `ArticleShell` des pages tuto.
 *
 * Server Component testable isolement (props explicites, aucun usage
 * de `usePathname` ou de hooks client). Rendu en deux variantes :
 *
 * - `< xl` : `<details>` natif replie par defaut (accordeon mobile/tablette).
 * - `>= xl` : `<aside>` sticky toujours visible, summary masque.
 *
 * Choix design (cf. EPIC-tuto-pages-article-shell-2026-05, decision SEO + UX) :
 * - Rendu de toute la section par defaut (pas de troncature) pour preserver
 *   le maillage interne. `maxItems` reste un override explicite.
 * - `aria-current="page"` sur l'item courant pour les lecteurs d'ecran et
 *   la navigation clavier.
 * - Lien "voir toute la section" pointe sur la page overview locale.
 */
export interface SectionPeersProps {
  /** Cle de section (ex: "getting-started", "skills") -> matche `sectionNavigation`. */
  readonly section: string;
  /** Slug courant de la page (sans le prefixe de section). Pour `/skills/impeccable`, c'est `"impeccable"`. Optionnel : si absent ou inconnu, aucun item n'est marque `aria-current`. */
  readonly currentSlug?: string;
  /** Locale active pour resoudre les hrefs et charger les traductions. */
  readonly locale: string;
  /** Override optionnel : tronquer apres N items. Par defaut, pas de troncature. */
  readonly maxItems?: number;
}

export async function SectionPeers({
  section,
  currentSlug,
  locale,
  maxItems,
}: Readonly<SectionPeersProps>) {
  const config = sectionNavigation[section];
  if (!config || config.items.length <= 1) {
    return null;
  }

  const t = await getTranslations({ locale, namespace: "sectionNav" });

  const items =
    typeof maxItems === "number" && maxItems > 0
      ? config.items.slice(0, maxItems)
      : config.items;

  const overviewItem = config.items[0];
  const overviewHref = resolveNavHref(overviewItem, locale);
  const sectionTitle = t(config.titleKey);

  const currentNormalizedHref = currentSlug
    ? `/${section}/${currentSlug}`.replace(/\/$/, "")
    : null;

  // Determine si un item est l'item courant. Compare le slug final pour
  // resister aux locales qui traduisent le slug (cf. hrefByLocale).
  const isItemActive = (itemHref: string): boolean => {
    if (!currentNormalizedHref) return false;
    const normalized = itemHref.replace(/\/$/, "");
    if (normalized === currentNormalizedHref) return true;
    // Fallback : compare le dernier segment (le slug) pour les locales
    // qui ont un slug different (`hrefByLocale`).
    const normalizedSlug = normalized.split("/").pop() ?? "";
    return normalizedSlug === currentSlug;
  };

  const listItems = items.map((item) => {
    const itemHref = resolveNavHref(item, locale);
    const isActive = isItemActive(item.href);
    return (
      <li key={item.href}>
        <Link
          href={itemHref}
          aria-current={isActive ? "page" : undefined}
          data-track-category="tuto_section_peers"
          data-track-action="item_click"
          data-track-label={section}
          className={clsx(
            "block rounded-md px-3 py-2 text-sm transition-colors",
            isActive
              ? "bg-brand-500/10 font-medium text-[color:var(--brand-primary)]"
              : "text-[color:var(--fg-secondary)] hover:bg-[color:var(--bg-subtle)] hover:text-[color:var(--fg-primary)]"
          )}
        >
          {t(item.labelKey)}
        </Link>
      </li>
    );
  });

  return (
    <section
      aria-label={`Pages de la section ${sectionTitle}`}
      className="section-peers not-prose"
      data-section={section}
    >
      {/* Variante < xl : accordeon replie par defaut */}
      <details className="rounded-lg border border-[color:var(--border-default)] bg-[color:var(--bg-subtle)] xl:hidden">
        <summary className="cursor-pointer list-none rounded-lg px-4 py-3 text-sm font-semibold text-[color:var(--fg-primary)] outline-offset-2 hover:bg-[color:var(--bg-base)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-500">
          <span className="inline-flex items-center gap-2">
            <span aria-hidden="true">▸</span>
            <span>
              {t("section-peers.toggleLabel", { section: sectionTitle })}
            </span>
          </span>
        </summary>
        <nav
          aria-label={`Pages de la section ${sectionTitle}`}
          className="border-t border-[color:var(--border-default)] px-2 py-2"
        >
          <ul className="space-y-0.5">{listItems}</ul>
          <div className="mt-2 border-t border-[color:var(--border-default)] pt-2">
            <Link
              href={overviewHref}
              data-track-category="tuto_section_peers"
              data-track-action="overview_click"
              data-track-label={section}
              className="block rounded-md px-3 py-2 text-xs font-medium text-[color:var(--brand-primary)] hover:underline"
            >
              {t("section-peers.overviewLink", { section: sectionTitle })}
            </Link>
          </div>
        </nav>
      </details>

      {/* Variante >= xl : aside sticky toujours visible */}
      <aside
        aria-label={`Pages de la section ${sectionTitle}`}
        className="hidden xl:block"
      >
        <div className="sticky top-24">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[color:var(--fg-muted)]">
            {sectionTitle}
          </h3>
          <ul className="space-y-0.5">{listItems}</ul>
          <Link
            href={overviewHref}
            data-track-category="tuto_section_peers"
            data-track-action="overview_click"
            data-track-label={section}
            className="mt-3 inline-block rounded-md text-xs font-medium text-[color:var(--brand-primary)] hover:underline"
          >
            {t("section-peers.overviewLink", { section: sectionTitle })}
          </Link>
        </div>
      </aside>
    </section>
  );
}
