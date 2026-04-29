"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { Globe } from "lucide-react";
import { locales } from "@/i18n/config";
import type { Locale } from "@/i18n/config";
import clsx from "clsx";

const localeLabels: Record<Locale, string> = {
  fr: "FR",
  en: "EN",
};

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations("languageSwitcher");

  return (
    <nav className="flex items-center gap-1" aria-label={t("label")}>
      <Globe
        className="h-4 w-4 text-[color:var(--fg-muted)]"
        aria-hidden="true"
      />
      {locales.map((l) => {
        const isActive = l === locale;

        return (
          <Link
            key={l}
            href={pathname}
            locale={l}
            aria-label={t(l)}
            // aria-current="true" : la langue active n'est pas une "page" mais
            // l'option courante d'un selecteur — "true" est semantiquement plus
            // approprie que "page" ici (cf. ARIA Authoring Practices).
            aria-current={isActive ? "true" : undefined}
            className={clsx(
              "inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded px-1.5 py-0.5 text-xs font-medium transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--brand-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--bg-page)]",
              isActive
                ? "bg-brand-500/15 text-[color:var(--brand-primary)]"
                : "text-[color:var(--fg-muted)] hover:bg-[color:var(--bg-subtle)] hover:text-[color:var(--fg-primary)]"
            )}
          >
            {localeLabels[l]}
          </Link>
        );
      })}
    </nav>
  );
}
