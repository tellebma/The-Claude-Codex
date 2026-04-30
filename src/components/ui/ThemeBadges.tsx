"use client";

import { useTranslations } from "next-intl";
import clsx from "clsx";
import {
  THEME_REGISTRY,
  isThemeKey,
  type ThemeKey,
} from "@/lib/themes";

interface ThemeBadgesProps {
  /**
   * Cles thematiques issues du frontmatter MDX. Les cles inconnues sont
   * silencieusement filtrees (validation au build via `lib/mdx.ts`).
   */
  readonly themes?: ReadonlyArray<string>;
  /**
   * Affichage compact (sans label, juste l'icone) pour les listings d'articles
   * denses. Defaut : false (badges complets).
   */
  readonly compact?: boolean;
}

/**
 * Affiche 1 a 3 badges thematiques pour un article (RG-31).
 *
 * Si `themes` est absent ou vide, le composant ne rend rien (graceful fallback).
 * Les couleurs sont consommees via les tokens C1 (cf. `lib/themes.ts`).
 */
export function ThemeBadges({
  themes,
  compact = false,
}: Readonly<ThemeBadgesProps>) {
  const t = useTranslations("themes");

  if (!themes || themes.length === 0) {
    return null;
  }

  const validKeys = themes.filter((k): k is ThemeKey => isThemeKey(k));
  if (validKeys.length === 0) {
    return null;
  }

  return (
    <ul
      className="flex flex-wrap gap-2"
      aria-label={t("badgesLabel")}
    >
      {validKeys.map((key) => {
        const meta = THEME_REGISTRY[key];
        const Icon = meta.icon;
        return (
          <li key={key}>
            <span
              className={clsx(
                "inline-flex items-center gap-1.5 rounded-full border text-[11px] font-medium",
                compact ? "px-1.5 py-0.5" : "px-2.5 py-1"
              )}
              style={{
                color: meta.color,
                borderColor: `color-mix(in srgb, ${meta.color} 35%, transparent)`,
                backgroundColor: `color-mix(in srgb, ${meta.color} 10%, transparent)`,
              }}
            >
              <Icon
                className={compact ? "h-3 w-3" : "h-3.5 w-3.5"}
                aria-hidden="true"
              />
              {!compact && <span>{t(key)}</span>}
              {compact && <span className="sr-only">{t(key)}</span>}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
