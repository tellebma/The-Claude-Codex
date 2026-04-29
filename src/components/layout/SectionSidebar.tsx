"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import {
  sectionNavigation,
  getSectionFromPathname,
  resolveNavHref,
} from "@/lib/section-navigation";
import clsx from "clsx";

export function SectionSidebar() {
  const pathname = usePathname();
  const sectionKey = getSectionFromPathname(pathname);
  const t = useTranslations("sectionNav");
  const locale = useLocale();

  if (!sectionKey) {
    return null;
  }

  const config = sectionNavigation[sectionKey];
  if (!config) {
    return null;
  }

  // Don't show sidebar if there's only one item (the overview page)
  if (config.items.length <= 1) {
    return null;
  }

  const title = t(config.titleKey);

  const normalizedPathname = pathname.replace(/\/$/, "");
  const totalPages = config.items.length;
  const currentIndex = config.items.findIndex(
    (item) => normalizedPathname === resolveNavHref(item, locale).replace(/\/$/, "")
  );
  const currentPage = currentIndex >= 0 ? currentIndex + 1 : 0;

  return (
    <aside
      aria-label={`Navigation ${title}`}
      className="hidden h-full lg:block"
    >
      <nav className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto">
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[color:var(--fg-muted)]">
          {title}
        </h3>
        {currentPage > 0 && (
          <div className="mb-3">
            <div className="flex items-center justify-between text-xs text-[color:var(--fg-muted)]">
              <span aria-live="polite">
                Page {currentPage} / {totalPages}
              </span>
              <span className="sr-only">
                {Math.round((currentPage / totalPages) * 100)}% complete
              </span>
            </div>
            <progress
              value={currentPage}
              max={totalPages}
              aria-label={`Progress: page ${currentPage} of ${totalPages}`}
              className="sr-only"
            />
            <div
              aria-hidden="true"
              className="mt-1.5 h-1 overflow-hidden rounded-full bg-[color:var(--border-default)]"
            >
              <div
                className="h-full rounded-full bg-brand-500 transition-all"
                style={{
                  width: `${(currentPage / totalPages) * 100}%`,
                  transitionDuration: "var(--duration-base)",
                  transitionTimingFunction: "var(--ease-out)",
                }}
              />
            </div>
          </div>
        )}
        <ul className="space-y-1">
          {config.items.map((item) => {
            const localeHref = resolveNavHref(item, locale);
            const normalizedHref = localeHref.replace(/\/$/, "");
            const isActive = normalizedPathname === normalizedHref;

            return (
              <li key={item.href}>
                <Link
                  href={localeHref}
                  aria-current={isActive ? "page" : undefined}
                  className={clsx(
                    "block rounded-lg px-3 py-2 text-sm transition-colors",
                    // Indicateur lateral pour renforcer la lisibilite de l'item actif
                    isActive &&
                      "border-l-2 border-brand-500 -ml-0.5 bg-brand-500/10 font-medium text-[color:var(--brand-primary)]",
                    !isActive &&
                      "text-[color:var(--fg-secondary)] hover:bg-[color:var(--bg-subtle)] hover:text-[color:var(--fg-primary)]"
                  )}
                >
                  {t(item.labelKey)}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
