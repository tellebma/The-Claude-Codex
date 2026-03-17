"use client";

import { useState, useRef, useCallback, useId, useEffect } from "react";
import { glossaryTerms } from "@/data/glossary";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import clsx from "clsx";

interface GlossaryTooltipProps {
  readonly term: string;
  readonly children?: React.ReactNode;
}

/**
 * Composant tooltip accessible pour les termes du glossaire.
 * Affiche la définition et l'analogie au survol ou au focus clavier.
 * Sur mobile, bascule au tap (toggle).
 *
 * Corrections UX appliquées :
 * - Touch target 44px : inline-flex + min-h-[44px] + items-center (WCAG 2.5.5)
 * - aria-expanded retiré : incorrect sur un tooltip (réservé aux disclosure widgets)
 * - Bordure tooltip : border-slate-700 dans les deux modes (le panneau est toujours sombre)
 * - Largeur mobile : max-w-[calc(100vw-2rem)] pour éviter le débordement hors viewport
 * - Animation d'entrée : animate-fade-in (respecte prefers-reduced-motion via globals.css)
 * - Délai de fermeture porté à 250ms pour laisser le temps de cliquer sur le lien interne
 * - Fermeture avec Escape (WCAG 1.4.13)
 */
export function GlossaryTooltip({ term, children }: GlossaryTooltipProps) {
  const t = useTranslations("glossary");
  const [isOpen, setIsOpen] = useState(false);
  const tooltipId = useId();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const glossaryEntry = glossaryTerms.find(
    (entry) => entry.term.toLowerCase() === term.toLowerCase()
  );

  const openTooltip = useCallback(() => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsOpen(true);
  }, []);

  const closeTooltip = useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 250);
  }, []);

  const toggleTooltip = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  // WCAG 1.4.13 — fermer le tooltip avec la touche Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  if (!glossaryEntry) {
    return <span>{children ?? term}</span>;
  }

  return (
    <span className="relative inline-block">
      {/*
        inline-flex + min-h-[44px] + items-center garantissent un touch target ≥ 44px
        tout en conservant l'apparence inline dans le flux de texte.
        aria-expanded est volontairement absent : il appartient aux disclosure widgets
        (menus, accordéons), pas aux tooltips — aria-describedby suffit ici.
      */}
      <button
        type="button"
        aria-describedby={isOpen ? tooltipId : undefined}
        onMouseEnter={openTooltip}
        onMouseLeave={closeTooltip}
        onFocus={openTooltip}
        onBlur={closeTooltip}
        onClick={toggleTooltip}
        className={clsx(
          "inline-flex min-h-[44px] cursor-help items-center",
          "border-b border-dashed border-current font-medium transition-colors",
          "text-brand-700 dark:text-brand-400",
          "hover:text-brand-600 dark:hover:text-brand-300",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
        )}
      >
        {children ?? term}
      </button>

      {isOpen && (
        <span
          id={tooltipId}
          role="tooltip"
          onMouseEnter={openTooltip}
          onMouseLeave={closeTooltip}
          className={clsx(
            // Positionné au-dessus du trigger, centré horizontalement
            "absolute bottom-full left-1/2 z-50 mb-2",
            // w-72 sur desktop, capped à la largeur du viewport - 2rem sur mobile
            "w-72 max-w-[calc(100vw-2rem)] -translate-x-1/2",
            "rounded-xl shadow-2xl",
            // Panneau sombre dans les deux modes : lisibilité garantie sur toute surface
            // border-slate-700 (pas slate-200 en light mode qui contrastait mal sur fond sombre)
            "border border-slate-700 bg-slate-900",
            "p-4 text-left text-sm leading-relaxed",
            // Apparition progressive (prefers-reduced-motion géré globalement dans globals.css)
            "animate-fade-in"
          )}
        >
          {/* Flèche pointant vers le bas en direction du trigger */}
          <span
            aria-hidden="true"
            className="absolute left-1/2 top-full -translate-x-1/2 border-8 border-transparent border-t-slate-900"
          />

          <span className="mb-2 block font-semibold text-white">
            {glossaryEntry.term}
          </span>
          {/* text-slate-300 sur bg-slate-900 = ~9.4:1 — passe WCAG AA et AAA */}
          <span className="mb-3 block text-slate-300">
            {glossaryEntry.definition}
          </span>
          {/* text-slate-400 sur bg-slate-800 = ~5.9:1 — passe WCAG AA */}
          <span className="block rounded-lg bg-slate-800 px-3 py-2 text-xs italic text-slate-400">
            <span className="not-italic font-medium text-brand-400">{t("analogyLabel")} </span>
            {glossaryEntry.analogy}
          </span>
          {glossaryEntry.link && (
            <Link
              href={glossaryEntry.link}
              className={clsx(
                "mt-3 block text-xs font-medium text-brand-400",
                "hover:text-brand-300 hover:underline underline-offset-2",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500",
                "focus-visible:ring-offset-1 focus-visible:ring-offset-slate-900"
              )}
              aria-label={t("learnMoreAbout", { term: glossaryEntry.term })}
              onClick={(e) => e.stopPropagation()}
            >
              {t("learnMoreLink")}
            </Link>
          )}
        </span>
      )}
    </span>
  );
}
