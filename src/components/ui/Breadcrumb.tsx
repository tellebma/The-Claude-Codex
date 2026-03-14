"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { ChevronRight, Home } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  createBreadcrumbSchema,
  serializeJsonLd,
} from "@/lib/structured-data";
import {
  getLocaleFromPathname,
  stripLocaleFromPathname,
  prefixWithLocale,
} from "@/lib/locale-utils";

interface BreadcrumbSegment {
  readonly label: string;
  readonly href: string;
}

function buildBreadcrumbs(
  pathname: string,
  locale: string,
  getSectionLabel: (segment: string) => string
): ReadonlyArray<BreadcrumbSegment> {
  const strippedPathname = stripLocaleFromPathname(pathname);
  const segments = strippedPathname.split("/").filter(Boolean);
  const breadcrumbs: BreadcrumbSegment[] = [];

  let currentPath = "";
  for (const segment of segments) {
    currentPath += `/${segment}`;
    const label = getSectionLabel(segment);
    breadcrumbs.push({
      label,
      href: prefixWithLocale(currentPath, locale),
    });
  }

  return breadcrumbs;
}

/**
 * Renders a breadcrumb navigation with schema.org BreadcrumbList JSON-LD.
 *
 * Security: The dangerouslySetInnerHTML usage below is safe because the
 * content is built from our own static labels, serialized via JSON.stringify.
 * No user-supplied HTML is involved.
 */
export function Breadcrumb() {
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);
  const strippedPathname = stripLocaleFromPathname(pathname);
  const t = useTranslations("breadcrumb");

  const getSectionLabel = useMemo(() => {
    return (segment: string) => {
      const key = `sections.${segment}`;
      if (t.has(key)) {
        return t(key);
      }
      return segment
        .replace(/-/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
    };
  }, [t]);

  const breadcrumbs = useMemo(
    () =>
      strippedPathname === "/"
        ? []
        : buildBreadcrumbs(pathname, locale, getSectionLabel),
    [pathname, locale, strippedPathname, getSectionLabel]
  );

  const breadcrumbJsonLd = useMemo(() => {
    if (breadcrumbs.length === 0) return null;

    const items = [
      { name: t("home"), href: prefixWithLocale("/", locale) },
      ...breadcrumbs.map((crumb) => ({
        name: crumb.label,
        href: crumb.href,
      })),
    ];

    return serializeJsonLd(createBreadcrumbSchema(items));
  }, [breadcrumbs, locale, t]);

  if (strippedPathname === "/" || breadcrumbs.length === 0) {
    return null;
  }

  return (
    <>
      {/* JSON-LD: safe — serialized from static schema via JSON.stringify, no user HTML */}
      {breadcrumbJsonLd !== null && (
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger -- safe: JSON.stringify of static schema
          dangerouslySetInnerHTML={{ __html: breadcrumbJsonLd }}
        />
      )}
      <nav aria-label={t("ariaLabel")} className="mb-6">
        <ol className="flex flex-wrap items-center gap-1 text-sm">
          <li>
            <Link
              href={prefixWithLocale("/", locale)}
              className="flex items-center gap-1 text-slate-500 transition-colors hover:text-brand-700 dark:text-slate-300 dark:hover:text-brand-400"
              aria-label={t("home")}
            >
              <Home className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </li>
          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1;
            return (
              <li key={crumb.href} className="flex items-center gap-1">
                <ChevronRight
                  className="h-3.5 w-3.5 text-slate-400 dark:text-slate-600"
                  aria-hidden="true"
                />
                {isLast ? (
                  <span
                    className="font-medium text-slate-900 dark:text-white"
                    aria-current="page"
                  >
                    {crumb.label}
                  </span>
                ) : (
                  <Link
                    href={crumb.href}
                    className="text-slate-500 transition-colors hover:text-brand-700 dark:text-slate-300 dark:hover:text-brand-400"
                  >
                    {crumb.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
