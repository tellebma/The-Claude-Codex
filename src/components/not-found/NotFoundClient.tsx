"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowRight,
  FileText,
  Home,
  Search,
  Sparkles,
  Terminal,
} from "lucide-react";
import { InteractiveRobot } from "@/components/ui/InteractiveRobot";
import { searchEntries, type SearchEntry } from "@/lib/search-index";
import type { RecentArticle } from "@/lib/recent-articles";
import {
  detectLocaleFromPath,
  pathToQuery,
  prefixWithLocale,
  type Locale,
} from "@/lib/not-found-utils";

declare global {
  interface Window {
    _paq?: Array<unknown[]>;
  }
}

type SuggestionPage = Pick<SearchEntry, "title" | "description" | "href">;

export interface NotFoundStrings {
  readonly title: string;
  readonly subtitle: string;
  readonly suggestionsTitle: string;
  readonly fallbackTitle: string;
  readonly recentTitle: string;
  readonly backToHome: string;
  readonly searchHint: string;
  readonly urlLabel: string;
  readonly robotAlt: string;
}

export interface NotFoundBundle {
  readonly strings: NotFoundStrings;
  readonly fallbackSuggestions: ReadonlyArray<SuggestionPage>;
  readonly recentArticles: ReadonlyArray<RecentArticle>;
}

interface NotFoundClientProps {
  readonly defaultLocale: Locale;
  readonly bundles: Readonly<Record<Locale, NotFoundBundle>>;
}

function trackMatomo404(requestedUrl: string): void {
  if (globalThis.window === undefined) return;
  const g = globalThis as unknown as { _paq?: Array<unknown[]> };
  if (!Array.isArray(g._paq)) return;
  g._paq.push(["trackEvent", "404", "404_visit", requestedUrl]);
}

export function NotFoundClient({
  defaultLocale,
  bundles,
}: NotFoundClientProps) {
  const routerPathname = usePathname() ?? "/";
  const [clientLocale, setClientLocale] = useState<Locale>(defaultLocale);

  useEffect(() => {
    if (globalThis.window === undefined) return;
    const actualPath = globalThis.location.pathname;
    const detected = detectLocaleFromPath(actualPath);
    if (detected !== null && detected !== clientLocale) {
      setClientLocale(detected);
    }
    trackMatomo404(actualPath + globalThis.location.search);
  }, [clientLocale]);

  const locale = clientLocale;
  const bundle = bundles[locale];
  const strings = bundle.strings;

  const suggestions = useMemo<ReadonlyArray<SuggestionPage>>(() => {
    const query = pathToQuery(routerPathname);
    if (query.trim().length === 0) return [];
    return searchEntries(query, locale).slice(0, 3);
  }, [routerPathname, locale]);

  const pagesToShow =
    suggestions.length > 0 ? suggestions : bundle.fallbackSuggestions;
  const sectionTitle =
    suggestions.length > 0 ? strings.suggestionsTitle : strings.fallbackTitle;

  const openSearch = useCallback(() => {
    if (globalThis.window === undefined) return;
    const event = new KeyboardEvent("keydown", {
      key: "k",
      ctrlKey: true,
      bubbles: true,
    });
    document.dispatchEvent(event);
  }, []);

  const homeHref = `/${locale}`;

  return (
    <section
      className="relative isolate overflow-hidden bg-slate-950 text-white"
      aria-labelledby="not-found-title"
    >
      <div className="absolute inset-0">
        <InteractiveRobot
          className="absolute inset-0 h-full w-full"
          ariaLabel={strings.robotAlt}
        />
      </div>

      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/40 to-slate-950/90"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at top right, rgba(6,182,212,0.2), transparent 55%), radial-gradient(ellipse at bottom left, rgba(245,158,11,0.18), transparent 60%)",
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl flex-col gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <header className="max-w-2xl">
          <div className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-wider text-white/80 backdrop-blur">
            <Terminal className="h-3.5 w-3.5" aria-hidden="true" />
            <span>404</span>
          </div>

          <h1
            id="not-found-title"
            className="mt-6 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl"
          >
            <span className="text-gradient">{strings.title}</span>
          </h1>

          <p className="mt-4 max-w-xl text-base text-white/80 sm:text-lg">
            {strings.subtitle}
          </p>

          {routerPathname && routerPathname !== "/" ? (
            <p className="mt-3 inline-flex max-w-full items-center gap-2 rounded-lg border border-white/10 bg-black/30 px-3 py-1.5 text-sm text-white/70 backdrop-blur">
              <span className="shrink-0 font-medium">{strings.urlLabel}</span>
              <code className="truncate font-mono text-white/90">
                {routerPathname}
              </code>
            </p>
          ) : null}

          <div className="pointer-events-auto mt-8 flex flex-wrap items-center gap-3">
            <NextLink
              href={homeHref}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-500/25 transition hover:shadow-xl hover:shadow-brand-500/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            >
              <Home className="h-4 w-4" aria-hidden="true" />
              {strings.backToHome}
            </NextLink>

            <button
              type="button"
              onClick={openSearch}
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur transition hover:border-white/30 hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            >
              <Search className="h-4 w-4" aria-hidden="true" />
              {strings.searchHint}
              <kbd className="ml-1 rounded border border-white/20 bg-black/30 px-1.5 py-0.5 font-mono text-xs text-white/80">
                Ctrl+K
              </kbd>
            </button>
          </div>
        </header>

        <div className="pointer-events-auto grid gap-8 lg:grid-cols-2">
          <section aria-label={sectionTitle}>
            <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white/60">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              {sectionTitle}
            </p>
            <nav aria-label={sectionTitle} className="grid gap-3">
              {pagesToShow.map((page) => (
                <NextLink
                  key={page.href}
                  href={prefixWithLocale(page.href, locale)}
                  className="group flex items-start gap-4 rounded-xl border border-white/10 bg-white/5 p-4 text-left backdrop-blur transition hover:border-brand-400/60 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-500/20 text-brand-200 transition-colors group-hover:bg-brand-500/30">
                    <FileText className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-white">
                      {page.title}
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-white/70">
                      {page.description}
                    </p>
                  </div>
                  <ArrowRight
                    className="mt-1 h-4 w-4 shrink-0 text-white/30 transition group-hover:translate-x-1 group-hover:text-white"
                    aria-hidden="true"
                  />
                </NextLink>
              ))}
            </nav>
          </section>

          {bundle.recentArticles.length > 0 ? (
            <section aria-label={strings.recentTitle}>
              <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white/60">
                <FileText className="h-3.5 w-3.5" aria-hidden="true" />
                {strings.recentTitle}
              </p>
              <ul className="grid gap-3">
                {bundle.recentArticles.map((article) => (
                  <li key={article.href}>
                    <NextLink
                      href={prefixWithLocale(article.href, locale)}
                      className="group flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-4 text-left backdrop-blur transition hover:border-accent-400/60 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-semibold text-white group-hover:text-accent-200">
                            {article.title}
                          </p>
                          {article.badge ? (
                            <span className="rounded-full border border-accent-400/40 bg-accent-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent-200">
                              {article.badge}
                            </span>
                          ) : null}
                        </div>
                        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-white/70">
                          {article.description}
                        </p>
                        {article.datePublished ? (
                          <time
                            dateTime={article.datePublished}
                            className="mt-2 block text-[11px] font-medium uppercase tracking-wider text-white/40"
                          >
                            {article.datePublished}
                          </time>
                        ) : null}
                      </div>
                      <ArrowRight
                        className="mt-1 h-4 w-4 shrink-0 text-white/30 transition group-hover:translate-x-1 group-hover:text-accent-200"
                        aria-hidden="true"
                      />
                    </NextLink>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>

        <p className="pointer-events-auto mt-auto text-[10px] text-white/40">
          3D model “Sad Toaster” by{" "}
          <a
            href="https://sketchfab.com/tasha.lime"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-white/70"
          >
            Tasha Lime
          </a>{" "}
          · CC Attribution on{" "}
          <a
            href="https://sketchfab.com/tasha.lime"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-white/70"
          >
            Sketchfab
          </a>
        </p>
      </div>
    </section>
  );
}
