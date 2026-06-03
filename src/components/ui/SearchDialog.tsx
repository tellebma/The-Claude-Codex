"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { flushSync, createPortal } from "react-dom";
import {
  Search,
  X,
  ArrowRight,
  FileText,
  CornerDownLeft,
  Sparkles,
  Loader2,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import {
  loadSearchIndex,
  runSearch,
  MIN_CHARS,
  type SearchDoc,
  type SearchResult,
  type SearchRunResult,
  type SearchSnippet,
} from "@/lib/search-live";
import { trackSearchDialogOpen } from "@/lib/analytics/trackSearch";

const RESULTS_LISTBOX_ID = "search-results-listbox";
const DEBOUNCE_MS = 120;

function getOptionId(index: number): string {
  return `search-option-${index}`;
}

const SUGGESTION_HREFS = [
  { href: "/getting-started", labelKey: "suggestGettingStarted" as const },
  { href: "/mcp", labelKey: "suggestMcp" as const },
  { href: "/prompting", labelKey: "suggestPrompting" as const },
  { href: "/skills", labelKey: "suggestSkills" as const },
];

const EMPTY_RUN: SearchRunResult = { results: [], truncated: 0, total: 0 };

export function SearchDialog() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [index, setIndex] = useState<ReadonlyArray<SearchDoc> | null>(null);
  const [indexLoading, setIndexLoading] = useState(false);
  const [indexError, setIndexError] = useState(false);
  const [portalReady, setPortalReady] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const primeInputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("search");

  // Mount-only — enables portal target after hydration.
  useEffect(() => setPortalReady(true), []);

  const run: SearchRunResult = useMemo(() => {
    if (!index || debouncedQuery.trim().length < MIN_CHARS) return EMPTY_RUN;
    return runSearch(debouncedQuery, index);
  }, [debouncedQuery, index]);

  const results = run.results;
  const hasQuery = query.trim().length > 0;
  const hasValidQuery = query.trim().length >= MIN_CHARS;
  const isDebouncing = hasValidQuery && debouncedQuery !== query.trim();
  const showMinChars = hasQuery && !hasValidQuery;
  const showResults = hasValidQuery && results.length > 0;
  const showNoResults =
    hasValidQuery && !isDebouncing && !indexLoading && results.length === 0 && !indexError;
  const showEmptyState = !hasQuery;
  const showError = hasValidQuery && indexError;

  const ensureIndex = useCallback(async () => {
    if (index || indexLoading) return;
    setIndexLoading(true);
    setIndexError(false);
    try {
      const docs = await loadSearchIndex(locale);
      setIndex(docs);
    } catch {
      setIndexError(true);
    } finally {
      setIndexLoading(false);
    }
  }, [index, indexLoading, locale]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [debouncedQuery, results.length]);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < MIN_CHARS) {
      setDebouncedQuery("");
      return;
    }
    const handle = globalThis.setTimeout(() => {
      setDebouncedQuery(trimmed);
    }, DEBOUNCE_MS);
    return () => globalThis.clearTimeout(handle);
  }, [query]);

  const closeDialog = useCallback(() => {
    setOpen(false);
    setQuery("");
    setDebouncedQuery("");
    setSelectedIndex(0);
  }, []);

  // Return focus to the trigger after the dialog closes.
  // Using an effect guarantees the DOM has committed the unmount before
  // we re-focus, which keeps Playwright's actionability checks happy.
  // Aussi : VM-4, fire l'event search_dialog_open sur la transition
  // closed -> open (Matomo + Vercel Web Analytics).
  const wasOpenRef = useRef(false);
  useEffect(() => {
    if (wasOpenRef.current && !open) {
      triggerRef.current?.focus();
    }
    if (!wasOpenRef.current && open) {
      trackSearchDialogOpen();
    }
    wasOpenRef.current = open;
  }, [open]);

  const openDialog = useCallback(() => {
    // iOS Safari 17+ keyboard-raising dance: prime input first, then
    // flushSync-open the dialog and transfer focus synchronously.
    primeInputRef.current?.focus({ preventScroll: true });
    flushSync(() => {
      setOpen(true);
      setQuery("");
      setDebouncedQuery("");
      setSelectedIndex(0);
    });
    inputRef.current?.focus({ preventScroll: true });
    ensureIndex().catch(() => undefined);
  }, [ensureIndex]);

  const navigateTo = useCallback(
    (href: string) => {
      setOpen(false);
      setQuery("");
      setDebouncedQuery("");
      setSelectedIndex(0);
      router.push(href);
    },
    [router]
  );

  const navigateToResult = useCallback(
    (href: string) => {
      const match = /^\/(fr|en)(\/.*)?$/.exec(href);
      if (!match) {
        navigateTo(href);
        return;
      }
      const targetLocale = match[1];
      const pathWithoutLocale = match[2] ?? "/";
      setOpen(false);
      setQuery("");
      setDebouncedQuery("");
      setSelectedIndex(0);
      if (targetLocale === locale) {
        router.push(pathWithoutLocale);
      } else {
        router.push(pathWithoutLocale, { locale: targetLocale as "fr" | "en" });
      }
    },
    [navigateTo, router, locale]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (open) {
          closeDialog();
        } else {
          openDialog();
        }
      }
      if (e.key === "Escape" && open) {
        e.preventDefault();
        closeDialog();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, openDialog, closeDialog]);

  useEffect(() => {
    if (!open) return;
    if (document.activeElement === inputRef.current) return;
    queueMicrotask(() => inputRef.current?.focus());
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    const previousOverflow = document.body.style.overflow;
    const previousPadding = document.body.style.paddingRight;
    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPadding;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const main = document.getElementById("main-content");
    main?.setAttribute("inert", "");
    return () => {
      main?.removeAttribute("inert");
    };
  }, [open]);

  useEffect(() => {
    if (!open || results.length === 0) return;
    const optionEl = document.getElementById(getOptionId(selectedIndex));
    optionEl?.scrollIntoView({ block: "nearest" });
  }, [open, selectedIndex, results.length]);

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (results.length === 0) return;
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (results.length === 0) return;
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === "Enter" && results.length > 0) {
      e.preventDefault();
      const selected = results[selectedIndex];
      if (selected) navigateToResult(selected.href);
    }
  };

  useEffect(() => {
    if (!open) return;
    const handleTabTrap = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const dialog = dialogRef.current;
      if (!dialog) return;
      const focusable = dialog.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", handleTabTrap);
    return () => document.removeEventListener("keydown", handleTabTrap);
  }, [open]);

  const activeDescendant =
    results.length > 0 ? getOptionId(selectedIndex) : undefined;

  // Sticky Header uses backdrop-filter which creates a containing block for
  // fixed descendants — would clip the modal to the header bounds. Portal
  // escapes this by mounting on document.body.
  const dialogNode = (
    <div className="fixed inset-0 z-[100] flex motion-safe:animate-fade-in flex-col bg-[color:var(--fg-primary)]/50 backdrop-blur-md sm:items-center sm:justify-start sm:pt-[10vh]">
      <button
        type="button"
        aria-label={t("close")}
        tabIndex={-1}
        onClick={closeDialog}
        className="absolute inset-0 z-0 cursor-default"
        data-testid="search-backdrop"
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-label={t("dialogTitle")}
        aria-modal="true"
        className="relative z-10 flex h-full w-full flex-col overflow-hidden bg-[color:var(--bg-elevated)] shadow-2xl ring-1 ring-[color:var(--border-subtle)] backdrop-blur-xl sm:mx-4 sm:h-auto sm:max-h-[72vh] sm:w-full sm:max-w-2xl motion-safe:sm:animate-slide-up sm:rounded-2xl"
        style={{
          paddingTop: "env(safe-area-inset-top)",
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
      >
        <div
          className={`relative flex items-center gap-3 border-b px-4 py-2 sm:px-5 ${
            isDebouncing || indexLoading
              ? "border-brand-400/40"
              : "border-[color:var(--border-subtle)]"
          }`}
        >
          <Search
            className="h-5 w-5 shrink-0 text-[color:var(--fg-muted)] sm:h-[22px] sm:w-[22px]"
            aria-hidden="true"
          />
          <input
            ref={inputRef}
            role="combobox"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder={t("placeholder")}
            className="min-w-0 flex-1 bg-transparent py-3 text-base font-medium text-[color:var(--fg-primary)] placeholder:font-normal placeholder:text-[color:var(--fg-muted)] focus:outline-none sm:py-4 sm:text-lg [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none [&::-webkit-search-results-button]:appearance-none [&::-webkit-search-results-decoration]:appearance-none"
            aria-label={t("inputLabel")}
            aria-expanded={results.length > 0}
            aria-controls={RESULTS_LISTBOX_ID}
            aria-autocomplete="list"
            aria-activedescendant={activeDescendant}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            enterKeyHint="search"
          />
          {(isDebouncing || indexLoading) && (
            <span
              className="hidden items-center gap-1 text-xs text-[color:var(--fg-muted)] sm:inline-flex"
              aria-hidden="true"
            >
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              {t("searching")}
            </span>
          )}
          {hasQuery && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              aria-label={t("clear")}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[color:var(--fg-muted)] transition-colors hover:bg-[color:var(--bg-subtle)] hover:text-[color:var(--fg-primary)]"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
          <kbd
            className="ml-1 hidden h-6 shrink-0 items-center rounded-md border border-[color:var(--border-default)] bg-[color:var(--bg-subtle)] px-1.5 font-mono text-[10px] font-semibold text-[color:var(--fg-muted)] sm:inline-flex"
            aria-hidden="true"
          >
            esc
          </kbd>
          {!hasQuery && (
            <button
              type="button"
              onClick={closeDialog}
              aria-label={t("close")}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[color:var(--fg-muted)] transition-colors hover:bg-[color:var(--bg-subtle)] hover:text-[color:var(--fg-primary)] sm:hidden"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          )}
        </div>

        <div role="status" aria-live="polite" className="sr-only">
          {showResults && t("resultCount", { count: run.total })}
          {showNoResults && t("noResults", { query })}
          {showError && t("loadError")}
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain">
          {showEmptyState && (
            <div className="px-3 py-4 sm:px-4">
              <div className="mb-2 flex items-center gap-2 px-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-[color:var(--fg-muted)]">
                <Sparkles
                  className="h-3.5 w-3.5 text-accent-500"
                  aria-hidden="true"
                />
                {t("popularSearches")}
              </div>
              <ul className="space-y-1">
                {SUGGESTION_HREFS.map((link) => (
                  <li key={link.href}>
                    <button
                      type="button"
                      onClick={() => navigateTo(link.href)}
                      className="group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm text-[color:var(--fg-secondary)] transition-colors hover:bg-brand-500/10 hover:text-[color:var(--brand-primary)]"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[color:var(--bg-subtle)] text-[color:var(--fg-muted)] group-hover:bg-brand-500/10 group-hover:text-[color:var(--brand-primary)]">
                        <FileText className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <span className="flex-1 truncate font-medium">
                        {t(link.labelKey)}
                      </span>
                      <ArrowRight
                        className="h-3.5 w-3.5 shrink-0 text-[color:var(--border-strong)] transition-transform group-hover:translate-x-0.5 group-hover:text-brand-500"
                        aria-hidden="true"
                      />
                    </button>
                  </li>
                ))}
              </ul>
              <p className="mt-4 px-2 text-center text-xs text-[color:var(--fg-muted)]">
                {t("typeToSearch")}
              </p>
            </div>
          )}

          {showMinChars && (
            <div className="px-3 py-12 text-center sm:px-4">
              <p className="text-sm text-[color:var(--fg-muted)]">
                {t("minCharsHint")}
              </p>
            </div>
          )}

          {showError && (
            <div className="px-3 py-10 text-center sm:px-4">
              <p className="text-sm font-medium text-[color:var(--fg-primary)]">
                {t("loadError")}
              </p>
            </div>
          )}

          {showNoResults && (
            <div className="px-3 py-8 text-center sm:px-4">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[color:var(--bg-subtle)]">
                <Search
                  className="h-5 w-5 text-[color:var(--fg-muted)]"
                  aria-hidden="true"
                />
              </div>
              <p className="mt-3 text-sm font-medium text-[color:var(--fg-primary)]">
                {t("noResults", { query })}
              </p>
              <p className="mt-1 text-xs text-[color:var(--fg-muted)]">
                {t("noResultsHint")}
              </p>
              <div className="mt-5 space-y-1">
                <p className="px-2 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-[color:var(--fg-muted)]">
                  {t("suggestions")}
                </p>
                {SUGGESTION_HREFS.map((link) => (
                  <button
                    type="button"
                    key={link.href}
                    onClick={() => navigateTo(link.href)}
                    className="block w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-[color:var(--brand-primary)] transition-colors hover:bg-brand-500/10"
                  >
                    {t(link.labelKey)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {showResults && (
            <div
              id={RESULTS_LISTBOX_ID}
              role="listbox"
              aria-label={t("resultsLabel")}
              className="space-y-0.5 px-2 py-2"
            >
              {results.map((result, idx) => (
                <SearchResultRow
                  key={result.href}
                  result={result}
                  index={idx}
                  isActive={idx === selectedIndex}
                  onSelect={() => navigateToResult(result.href)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  titleBadgeLabel={t("titleBadge")}
                  matchesLabel={(n) => t("matchesInPage", { count: n })}
                  currentLocale={locale}
                />
              ))}
              {run.truncated > 0 && (
                <p className="mt-2 px-3 py-2 text-center text-xs text-[color:var(--fg-muted)]">
                  {t("moreResults", { count: run.truncated })}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="hidden border-t border-[color:var(--border-subtle)] bg-[color:var(--bg-subtle)] px-4 py-2 text-xs text-[color:var(--fg-muted)] sm:flex sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-[color:var(--border-default)] px-1.5 py-0.5 font-mono">
                ↑↓
              </kbd>
              <span>{t("arrowsToNavigate")}</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="inline-flex items-center rounded border border-[color:var(--border-default)] px-1.5 py-0.5 font-mono">
                <CornerDownLeft className="h-3 w-3" aria-hidden="true" />
              </kbd>
              <span>{t("enterToOpen")}</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <kbd className="rounded border border-[color:var(--border-default)] px-1.5 py-0.5 font-mono">
              Esc
            </kbd>
            <span>{t("escToClose")}</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button
        ref={triggerRef}
        onClick={openDialog}
        aria-label={t("triggerShort")}
        aria-haspopup="dialog"
        aria-expanded={open}
        className="group inline-flex h-11 min-w-[44px] items-center justify-center gap-2 rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-elevated)] px-3 text-sm text-[color:var(--fg-muted)] backdrop-blur transition-all hover:border-brand-500/40 hover:bg-[color:var(--bg-subtle)] hover:text-[color:var(--fg-secondary)] hover:shadow-sm md:min-w-[220px] md:justify-between md:pr-1.5"
      >
        <span className="flex items-center gap-2">
          <Search className="h-4 w-4" aria-hidden="true" />
          <span className="hidden sm:inline">{t("trigger")}</span>
        </span>
        <kbd
          className="hidden items-center gap-0.5 rounded-md border border-[color:var(--border-default)] bg-[color:var(--bg-subtle)] px-1.5 py-0.5 font-mono text-[10px] font-semibold text-[color:var(--fg-secondary)] md:inline-flex"
          aria-hidden="true"
        >
          <span className="text-[11px]">⌘</span>K
        </kbd>
      </button>

      <input
        ref={primeInputRef}
        type="text"
        tabIndex={-1}
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "-9999px",
          top: "auto",
          width: "1px",
          height: "1px",
          overflow: "hidden",
        }}
      />

      {open && portalReady && createPortal(dialogNode, document.body)}
    </>
  );
}

interface SearchResultRowProps {
  readonly result: SearchResult;
  readonly index: number;
  readonly isActive: boolean;
  readonly currentLocale: string;
  readonly onSelect: () => void;
  readonly onMouseEnter: () => void;
  readonly titleBadgeLabel: string;
  readonly matchesLabel: (count: number) => string;
}

function SearchResultRow({
  result,
  index,
  isActive,
  currentLocale,
  onSelect,
  onMouseEnter,
  titleBadgeLabel,
  matchesLabel,
}: SearchResultRowProps) {
  const showLocaleBadge = result.locale !== currentLocale;

  return (
    <div
      id={getOptionId(index)}
      role="option"
      tabIndex={isActive ? 0 : -1}
      aria-selected={isActive}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
      onMouseEnter={onMouseEnter}
      className={`group flex cursor-pointer items-start gap-3 rounded-xl px-3 py-2.5 transition-colors sm:py-3 ${
        isActive
          ? "bg-brand-500/10"
          : "hover:bg-[color:var(--bg-subtle)]"
      }`}
    >
      <span
        className={`mt-0.5 hidden h-8 w-8 shrink-0 items-center justify-center rounded-lg sm:flex ${
          isActive
            ? "bg-brand-500/15 text-[color:var(--brand-primary)]"
            : "bg-[color:var(--bg-subtle)] text-[color:var(--fg-muted)]"
        }`}
        aria-hidden="true"
      >
        <FileText className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span
            className={`truncate text-sm font-semibold ${
              isActive
                ? "text-[color:var(--brand-primary)]"
                : "text-[color:var(--fg-primary)]"
            }`}
          >
            {result.title}
          </span>
          <span className="rounded-full bg-[color:var(--bg-subtle)] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-[color:var(--fg-muted)]">
            {result.section}
          </span>
          {result.titleMatch && (
            <span className="rounded-full bg-brand-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[color:var(--brand-primary)]">
              {titleBadgeLabel}
            </span>
          )}
          {showLocaleBadge && (
            <span className="rounded-full bg-accent-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent-700 dark:text-accent-300">
              {result.locale.toUpperCase()}
            </span>
          )}
        </div>
        {result.snippets.length > 0 ? (
          <div className="mt-1 space-y-1 sm:mt-1.5">
            <SnippetLine snippet={result.snippets[0]} mobileOnly />
            {result.snippets.map((s) => (
              <SnippetLine key={`${s.pre}|${s.match}|${s.post}`} snippet={s} />
            ))}
          </div>
        ) : (
          <p className="mt-0.5 line-clamp-2 text-xs text-[color:var(--fg-muted)]">
            {result.description}
          </p>
        )}
        {result.totalHits > 1 && (
          <p className="mt-1 text-[11px] text-[color:var(--fg-muted)]">
            {matchesLabel(result.totalHits)}
          </p>
        )}
      </div>
      <ArrowRight
        className={`mt-2 hidden h-4 w-4 shrink-0 transition-transform sm:block ${
          isActive
            ? "translate-x-0.5 text-brand-500"
            : "text-[color:var(--border-strong)]"
        }`}
        aria-hidden="true"
      />
    </div>
  );
}

interface SnippetLineProps {
  readonly snippet: SearchSnippet;
  readonly mobileOnly?: boolean;
}

function SnippetLine({ snippet, mobileOnly = false }: SnippetLineProps) {
  const className = mobileOnly
    ? "line-clamp-1 text-xs text-[color:var(--fg-muted)] sm:hidden"
    : "hidden line-clamp-2 text-xs text-[color:var(--fg-muted)] sm:block";
  return (
    <p className={className}>
      <span>{snippet.pre}</span>
      <mark className="rounded-sm bg-accent-200/60 px-0.5 text-inherit dark:bg-accent-500/30">
        {snippet.match}
      </mark>
      <span>{snippet.post}</span>
    </p>
  );
}
