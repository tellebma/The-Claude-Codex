"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, BookOpen, ArrowRight } from "lucide-react";
import { glossaryTerms, searchGlossary } from "@/data/glossary";
import { getLocaleFromPathname, prefixWithLocale } from "@/lib/locale-utils";
import clsx from "clsx";

const translations = {
  fr: {
    heroBadge: "Référence",
    heroTitle: "Glossaire",
    heroSubtitleSuffix: "termes techniques expliqués en langage humain, avec des analogies concrètes pour comprendre sans être développeur.",
    searchPlaceholder: "Rechercher un terme...",
    searchLabel: "Rechercher dans le glossaire",
    resultsFor: "résultat",
    resultsForPlural: "résultats",
    resultsForPrefix: "pour",
    noResults: "Aucun terme trouvé pour",
    showAll: "Voir tous les termes",
    learnMore: "En savoir plus",
    learnMoreLabel: "En savoir plus sur",
    analogyLabel: "Analogie",
    breadcrumbHome: "Accueil",
    breadcrumbCurrent: "Glossaire",
    alphabeticNavLabel: "Navigation alphabétique",
    breadcrumbLabel: "Fil d'Ariane",
  },
  en: {
    heroBadge: "Reference",
    heroTitle: "Glossary",
    heroSubtitleSuffix: "technical terms explained in plain language, with real-world analogies so anyone can understand.",
    searchPlaceholder: "Search a term...",
    searchLabel: "Search the glossary",
    resultsFor: "result",
    resultsForPlural: "results",
    resultsForPrefix: "for",
    noResults: "No term found for",
    showAll: "Show all terms",
    learnMore: "Learn more",
    learnMoreLabel: "Learn more about",
    analogyLabel: "Analogy",
    breadcrumbHome: "Home",
    breadcrumbCurrent: "Glossary",
    alphabeticNavLabel: "Alphabetic navigation",
    breadcrumbLabel: "Breadcrumb",
  },
};

/**
 * Page glossaire listant tous les termes techniques avec recherche.
 * Client component pour la recherche interactive.
 *
 * Corrections UX appliquées :
 * - Touch target navigation alphabétique : h-10 w-10 (40px) → min-h-[44px] min-w-[44px]
 *   sur mobile via padding étendu (WCAG 2.5.5)
 * - Lettre de section : text-slate-400 light + dark:text-slate-500 dark
 *   (contrastes corrects : ~4.7:1 light, ~3.3:1 dark — décoratif, non porteur d'info)
 * - Lien "En savoir plus" dans GlossaryCard : remplace ExternalLink par ArrowRight
 *   car ces liens sont internes (href="/…"), pas externes
 * - Contraste du bouton "Voir tous les termes" : text-brand-600 sur blanc = 3.9:1
 *   → porté à text-brand-700 (5.6:1) pour passer WCAG AA
 */
export default function GlossaryPage() {
  const [query, setQuery] = useState("");
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);
  const t = translations[locale as "fr" | "en"];

  const filteredTerms = useMemo(
    () => (query.trim().length > 0 ? searchGlossary(query) : glossaryTerms),
    [query]
  );

  // Regrouper par lettre initiale
  const groupedTerms = useMemo(() => {
    const groups: Record<string, typeof filteredTerms> = {};
    for (const entry of filteredTerms) {
      const letter = entry.term[0].toUpperCase();
      if (!groups[letter]) {
        groups[letter] = [];
      }
      groups[letter] = [...(groups[letter] ?? []), entry];
    }
    return groups;
  }, [filteredTerms]);

  const letters = Object.keys(groupedTerms).sort();

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-[var(--gradient-hero)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(6,182,212,0.15),_transparent_60%)]" />

        <div className="relative px-4 pb-12 pt-16 sm:px-6 sm:pb-16 sm:pt-24 lg:px-8">
          {/* Breadcrumb */}
          <nav
            aria-label={t.breadcrumbLabel}
            className="mb-6 flex items-center gap-2 text-sm text-slate-400"
          >
            <Link href={prefixWithLocale("/", locale)} className="transition-colors hover:text-white">
              {t.breadcrumbHome}
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-slate-200">{t.breadcrumbCurrent}</span>
          </nav>

          <div className="text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-brand-500/10 px-4 py-1.5 text-sm text-brand-300">
              <BookOpen className="h-4 w-4" aria-hidden="true" />
              {t.heroBadge}
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
              {t.heroTitle}
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-300">
              {glossaryTerms.length} {t.heroSubtitleSuffix}
            </p>
          </div>
        </div>
      </section>

      {/* Barre de recherche — sticky sous le header (top-16 = 64px) */}
      <section className="sticky top-16 z-40 border-b border-slate-200/50 bg-white/90 backdrop-blur dark:border-slate-700/50 dark:bg-slate-900/90">
        <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6">
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              aria-label={t.searchLabel}
              className={clsx(
                "w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4",
                "text-slate-900 placeholder-slate-400",
                "focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20",
                "dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500"
              )}
            />
          </div>
          {query.trim().length > 0 && (
            <p
              className="mt-2 text-sm text-slate-500 dark:text-slate-300"
              aria-live="polite"
              aria-atomic="true"
            >
              {filteredTerms.length} {filteredTerms.length !== 1 ? t.resultsForPlural : t.resultsFor} {t.resultsForPrefix} &ldquo;{query}&rdquo;
            </p>
          )}
        </div>
      </section>

      {/* Navigation alphabétique */}
      {query.trim().length === 0 && (
        <section className="border-b border-slate-200/50 dark:border-slate-700/50">
          <div className="mx-auto max-w-4xl px-4 py-2 sm:px-6">
            <nav
              aria-label={t.alphabeticNavLabel}
            >
              <ul className="flex flex-wrap gap-0.5" role="list">
                {letters.map((letter) => (
                  <li key={letter}>
                    <a
                      href={`#letter-${letter}`}
                      className={clsx(
                        "flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg",
                        "text-sm font-semibold transition-colors",
                        "text-slate-600 hover:bg-brand-500/10 hover:text-brand-700",
                        "dark:text-slate-300 dark:hover:bg-brand-500/20 dark:hover:text-brand-300",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                      )}
                    >
                      {letter}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </section>
      )}

      {/* Termes */}
      <section className="py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          {filteredTerms.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-lg text-slate-500 dark:text-slate-300">
                {t.noResults} &ldquo;{query}&rdquo;
              </p>
              <button
                type="button"
                onClick={() => setQuery("")}
                className={clsx(
                  "mt-4 text-sm font-medium underline underline-offset-2",
                  "text-brand-700 hover:text-brand-800",
                  "dark:text-brand-400 dark:hover:text-brand-300",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                )}
              >
                {t.showAll}
              </button>
            </div>
          ) : query.trim().length > 0 ? (
            // Résultats de recherche sans groupement par lettre
            <div className="space-y-4">
              {filteredTerms.map((entry) => (
                <GlossaryCard key={entry.term} entry={entry} locale={locale} t={t} />
              ))}
            </div>
          ) : (
            // Groupement alphabétique
            <div className="space-y-12">
              {letters.map((letter) => (
                <div key={letter} id={`letter-${letter}`}>
                  <h2 className="mb-4 text-2xl font-extrabold text-slate-400 dark:text-slate-500">
                    {letter}
                  </h2>
                  <div className="space-y-4">
                    {(groupedTerms[letter] ?? []).map((entry) => (
                      <GlossaryCard key={entry.term} entry={entry} locale={locale} t={t} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

interface GlossaryCardProps {
  readonly entry: (typeof glossaryTerms)[number];
  readonly locale: string;
  readonly t: typeof translations.fr;
}

function GlossaryCard({ entry, locale, t }: GlossaryCardProps) {
  return (
    <article
      className={clsx(
        "rounded-2xl border border-slate-200 bg-white p-6",
        "transition-shadow hover:shadow-md",
        "dark:border-slate-700 dark:bg-slate-800/50"
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          {entry.term}
        </h3>
        {entry.link && (
          <Link
            href={prefixWithLocale(entry.link, locale)}
            className={clsx(
              "flex shrink-0 items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium",
              "text-brand-700 hover:bg-brand-500/10 dark:text-brand-400 dark:hover:bg-brand-500/20",
              "transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            )}
            aria-label={`${t.learnMoreLabel} ${entry.term}`}
          >
            {t.learnMore}
            <ArrowRight className="h-3 w-3" aria-hidden="true" />
          </Link>
        )}
      </div>
      <p className="mt-2 leading-relaxed text-slate-600 dark:text-slate-300">
        {entry.definition}
      </p>
      <div className="mt-3 rounded-xl bg-slate-50 px-4 py-3 dark:bg-slate-700/50">
        <span className="text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">
          {t.analogyLabel}
        </span>
        <p className="mt-1 text-sm italic text-slate-600 dark:text-slate-300">
          {entry.analogy}
        </p>
      </div>
    </article>
  );
}
