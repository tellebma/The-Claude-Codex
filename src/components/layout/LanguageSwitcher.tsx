"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Globe } from "lucide-react";
import {
  getLocaleFromPathname,
  stripLocaleFromPathname,
  prefixWithLocale,
} from "@/lib/locale-utils";
import { locales } from "@/i18n/config";
import type { Locale } from "@/i18n/config";
import clsx from "clsx";

const localeLabels: Record<Locale, string> = {
  fr: "FR",
  en: "EN",
};

export function LanguageSwitcher() {
  const pathname = usePathname();
  const currentLocale = getLocaleFromPathname(pathname);
  const strippedPath = stripLocaleFromPathname(pathname);
  const t = useTranslations("languageSwitcher");

  return (
    <div className="flex items-center gap-1" role="navigation" aria-label={t("label")}>
      <Globe className="h-4 w-4 text-slate-500 dark:text-slate-400" aria-hidden="true" />
      {locales.map((locale) => {
        const href = prefixWithLocale(strippedPath, locale);
        const isActive = locale === currentLocale;

        return (
          <Link
            key={locale}
            href={href}
            locale={locale}
            aria-label={t(locale)}
            aria-current={isActive ? "page" : undefined}
            className={clsx(
              "rounded px-1.5 py-0.5 text-xs font-medium transition-colors",
              isActive
                ? "bg-brand-500/15 text-brand-700 dark:bg-brand-500/25 dark:text-brand-400"
                : "text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
            )}
          >
            {localeLabels[locale]}
          </Link>
        );
      })}
    </div>
  );
}
