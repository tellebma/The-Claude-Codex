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
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-300">
          {title}
        </h3>
        {currentPage > 0 && (
          <div className="mb-3">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
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
              className="mt-1.5 h-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700"
            >
              <div
                className="h-full rounded-full bg-brand-500 transition-all duration-300"
                style={{ width: `${(currentPage / totalPages) * 100}%` }}
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
                    isActive
                      ? "bg-brand-500/10 font-medium text-brand-700 dark:bg-brand-500/20 dark:text-brand-400"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
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
