"use client";

import { useEffect, useMemo, useCallback } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { Home, Search, Terminal, FileText, ArrowRight } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { NotFoundAnimation } from "@/components/ui/NotFoundAnimation";
import { searchEntries, type SearchEntry } from "@/lib/search-index";

// Augment Window type to include Matomo's _paq tracker queue
declare global {
  interface Window {
    _paq?: Array<unknown[]>;
  }
}

/** Minimal shape needed to render a suggestion card. */
type SuggestionPage = Pick<SearchEntry, "title" | "description" | "href">;

/** Fallback pages shown when no contextual suggestion can be found. */
const FALLBACK_PAGES_FR: ReadonlyArray<SuggestionPage> = [
  {
    title: "Accueil",
    description: "Retour à la page principale du guide.",
    href: "/",
  },
  {
    title: "Configurateur",
    description:
      "Générez votre configuration Claude Code personnalisée en 2 minutes.",
    href: "/configurator",
  },
  {
    title: "Démarrer",
    description: "Installation, premiers pas et votre premier projet guidé.",
    href: "/getting-started",
  },
];

const FALLBACK_PAGES_EN: ReadonlyArray<SuggestionPage> = [
  {
    title: "Home",
    description: "Back to the main guide page.",
    href: "/",
  },
  {
    title: "Configurator",
    description: "Generate your personalized Claude Code setup in 2 minutes.",
    href: "/configurator",
  },
  {
    title: "Getting Started",
    description:
      "Installation, first steps and your first guided project.",
    href: "/getting-started",
  },
];

/** Extract searchable tokens from a URL path segment. */
function pathToQuery(pathname: string): string {
  return pathname
    .replace(/^\//, "")
    .replace(/\/$/, "")
    .replaceAll(/[-_]/g, " ")
    .replaceAll("/", " ");
}

/** Push a Matomo event if the tracker is loaded. */
function trackMatomo404(requestedUrl: string): void {
  if (typeof window !== "undefined" && window._paq) {
    window._paq.push(["trackEvent", "404", "404_visit", requestedUrl]);
  }
}

export default function NotFound() {
  const t = useTranslations("notFound");
  const locale = useLocale();
  const pathname = usePathname();

  // Track the 404 visit once on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const fullUrl =
        window.location.pathname + window.location.search;
      trackMatomo404(fullUrl);
    }
  }, []);

  // Compute contextual suggestions based on the current URL
  const suggestions = useMemo<ReadonlyArray<SuggestionPage>>(() => {
    const query = pathToQuery(pathname);
    if (query.trim().length === 0) {
      return [];
    }
    const results = searchEntries(query, locale);
    return results.slice(0, 3);
  }, [pathname, locale]);

  const fallbackPages =
    locale === "en" ? FALLBACK_PAGES_EN : FALLBACK_PAGES_FR;

  const pagesToShow =
    suggestions.length > 0 ? suggestions : fallbackPages;
  const sectionTitle =
    suggestions.length > 0 ? t("suggestionsTitle") : t("fallbackTitle");

  // Open the global search dialog via keyboard event
  const openSearch = useCallback(() => {
    if (typeof window !== "undefined") {
      const event = new KeyboardEvent("keydown", {
        key: "k",
        ctrlKey: true,
        bubbles: true,
      });
      document.dispatchEvent(event);
    }
  }, []);

  return (
    <section
      className="relative flex min-h-[calc(100vh-8rem)] items-center overflow-hidden bg-slate-50 dark:bg-slate-950"
      aria-labelledby="not-found-title"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-[var(--gradient-hero)]" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at top right, var(--gradient-hero-radial-1), transparent 60%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at bottom left, var(--gradient-hero-radial-2), transparent 60%)",
        }}
      />

      {/* Grid pattern */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(var(--hero-grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--hero-grid-line) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative mx-auto w-full max-w-4xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        {/* Header */}
        <div className="text-center">
          <NotFoundAnimation>
            <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 shadow-lg shadow-brand-500/25 sm:h-24 sm:w-24">
              <Terminal
                className="h-10 w-10 text-white sm:h-12 sm:w-12"
                aria-hidden="true"
              />
            </div>
          </NotFoundAnimation>

          <p className="text-6xl font-extrabold tracking-tight sm:text-8xl">
            <span className="text-gradient">404</span>
          </p>

          <h1
            id="not-found-title"
            className="mt-4 text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl"
          >
            {t("title")}
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-base text-slate-600 dark:text-slate-300 sm:text-lg">
            {t("subtitle")}
          </p>

          {/* Requested URL hint */}
          {pathname && pathname !== "/" && (
            <p className="mx-auto mt-2 max-w-lg truncate text-sm text-slate-400 dark:text-slate-500">
              <span className="font-medium">{t("urlLabel")}</span>{" "}
              <code className="font-mono">{pathname}</code>
            </p>
          )}
        </div>

        {/* Contextual suggestions */}
        <div className="mt-12">
          <p className="mb-4 text-center text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {sectionTitle}
          </p>

          <nav
            aria-label={sectionTitle}
            className="grid gap-3 sm:grid-cols-3"
          >
            {pagesToShow.map((page) => (
              <Link
                key={page.href}
                href={page.href}
                className="group flex flex-col gap-3 rounded-xl border border-slate-200/60 bg-white/70 p-4 text-left backdrop-blur transition-all hover:border-brand-300 hover:bg-white hover:shadow-md dark:border-slate-700/40 dark:bg-slate-800/40 dark:hover:border-brand-600 dark:hover:bg-slate-800/70"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-500/10 text-brand-700 transition-colors group-hover:bg-brand-500/20 dark:bg-brand-500/15 dark:text-brand-400">
                    <FileText className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <ArrowRight
                    className="mt-1 h-3.5 w-3.5 shrink-0 text-slate-300 opacity-0 transition-opacity group-hover:opacity-100 dark:text-slate-600"
                    aria-hidden="true"
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {page.title}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                    {page.description}
                  </p>
                </div>
              </Link>
            ))}
          </nav>
        </div>

        {/* CTAs */}
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-500/25 transition-all hover:shadow-xl hover:shadow-brand-500/30"
          >
            <Home className="h-4 w-4" aria-hidden="true" />
            {t("backToHome")}
          </Link>

          <button
            onClick={openSearch}
            type="button"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200/60 bg-white/70 px-6 py-3 text-sm font-semibold text-slate-700 backdrop-blur transition-all hover:border-brand-300 hover:bg-white hover:shadow-md dark:border-slate-700/40 dark:bg-slate-800/40 dark:text-slate-200 dark:hover:border-brand-600 dark:hover:bg-slate-800/70"
          >
            <Search className="h-4 w-4" aria-hidden="true" />
            {t("searchHint")}
            <kbd className="ml-1 rounded border border-slate-300 bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-slate-600 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300">
              Ctrl+K
            </kbd>
          </button>
        </div>
      </div>
    </section>
  );
}
