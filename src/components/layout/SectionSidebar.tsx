"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  sectionNavigation,
  getSectionFromPathname,
} from "@/lib/section-navigation";
import clsx from "clsx";

export function SectionSidebar() {
  const pathname = usePathname();
  const sectionKey = getSectionFromPathname(pathname);

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

  return (
    <aside
      aria-label={`Navigation ${config.title}`}
      className="hidden lg:block"
    >
      <nav className="sticky top-24">
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {config.title}
        </h3>
        <ul className="space-y-1">
          {config.items.map((item) => {
            // Normalize paths for comparison (handle trailing slashes)
            const normalizedPathname = pathname.replace(/\/$/, "");
            const normalizedHref = item.href.replace(/\/$/, "");
            const isActive = normalizedPathname === normalizedHref;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={clsx(
                    "block rounded-lg px-3 py-2 text-sm transition-colors",
                    isActive
                      ? "bg-brand-500/10 font-medium text-brand-700 dark:bg-brand-500/20 dark:text-brand-400"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                  )}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
