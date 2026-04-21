"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { flushSync } from "react-dom";
import {
  Search,
  X,
  ArrowRight,
  FileText,
  CornerDownLeft,
  Sparkles,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { searchEntries, type SearchEntry } from "@/lib/search-index";

const RESULTS_LISTBOX_ID = "search-results-listbox";

function getOptionId(index: number): string {
  return `search-option-${index}`;
}

const SUGGESTION_HREFS = [
  { href: "/getting-started", labelKey: "suggestGettingStarted" as const },
  { href: "/mcp", labelKey: "suggestMcp" as const },
  { href: "/prompting", labelKey: "suggestPrompting" as const },
  { href: "/skills", labelKey: "suggestSkills" as const },
];

export function SearchDialog() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("search");

  const results = useMemo<ReadonlyArray<SearchEntry>>(
    () => searchEntries(query, locale),
    [query, locale]
  );

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const closeDialog = useCallback(() => {
    setOpen(false);
    setQuery("");
    setSelectedIndex(0);
    requestAnimationFrame(() => triggerRef.current?.focus());
  }, []);

  const openDialog = useCallback(() => {
    // flushSync forces the dialog to mount synchronously, so the input
    // exists in the DOM when we call .focus() below — still within the
    // same user-gesture tick. iOS Safari only raises the soft keyboard
    // when .focus() runs synchronously inside a user gesture: a
    // setTimeout(..., 60) (or any deferred focus via useEffect) breaks
    // that chain and the keyboard never appears on mobile.
    flushSync(() => {
      setOpen(true);
      setQuery("");
      setSelectedIndex(0);
    });
    inputRef.current?.focus();
  }, []);

  const navigateTo = useCallback(
    (href: string) => {
      setOpen(false);
      setQuery("");
      setSelectedIndex(0);
      router.push(href);
    },
    [router]
  );

  // Global shortcut: Ctrl/Cmd+K toggles, Escape closes
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

  // Desktop Ctrl/Cmd+K does NOT go through openDialog (it bypasses
  // the click path), so we still need a focus-on-open effect for that
  // branch. On keyboard shortcut, the soft keyboard is not relevant —
  // iOS users don't have a physical Ctrl key — so a zero-delay
  // microtask is fine and avoids the layout jank of a longer timeout.
  useEffect(() => {
    if (!open) return;
    if (document.activeElement === inputRef.current) return;
    queueMicrotask(() => inputRef.current?.focus());
  }, [open]);

  // Lock body scroll while keeping layout stable
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

  // Hide background content from assistive tech and tab order
  useEffect(() => {
    if (!open) return;
    const main = document.getElementById("main-content");
    const header = document.querySelector("header");
    main?.setAttribute("inert", "");
    header?.setAttribute("inert", "");
    return () => {
      main?.removeAttribute("inert");
      header?.removeAttribute("inert");
    };
  }, [open]);

  // Auto-scroll active option into view
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
      if (selected) navigateTo(selected.href);
    }
  };

  const handleDialogKeyDown = useCallback((e: React.KeyboardEvent) => {
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
  }, []);

  const activeDescendant =
    results.length > 0 ? getOptionId(selectedIndex) : undefined;
  const hasQuery = query.trim().length > 0;
  const showEmptyState = !hasQuery;
  const showNoResults = hasQuery && results.length === 0;
  const showResults = hasQuery && results.length > 0;

  return (
    <>
      {/* Trigger button — icon-only on mobile, label + shortcut on larger screens */}
      <button
        ref={triggerRef}
        onClick={openDialog}
        aria-label={t("triggerShort")}
        aria-haspopup="dialog"
        aria-expanded={open}
        className="group inline-flex h-11 min-w-[44px] items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white/80 px-3 text-sm text-slate-500 transition-all hover:border-brand-500/40 hover:bg-slate-100 hover:text-slate-700 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:border-brand-400/40 dark:hover:bg-slate-700 dark:hover:text-white md:min-w-[200px] md:justify-between md:pr-1.5"
      >
        <span className="flex items-center gap-2">
          <Search className="h-4 w-4" aria-hidden="true" />
          <span className="hidden sm:inline">{t("trigger")}</span>
        </span>
        <kbd
          className="hidden items-center gap-0.5 rounded border border-slate-300 bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-slate-600 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300 md:inline-flex"
          aria-hidden="true"
        >
          <span className="text-[11px]">⌘</span>K
        </kbd>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[60] flex animate-fade-in flex-col bg-slate-900/60 backdrop-blur-sm sm:items-start sm:justify-center sm:pt-[12vh]"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeDialog();
          }}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-label={t("dialogTitle")}
            aria-modal="true"
            onKeyDown={handleDialogKeyDown}
            className="flex h-full w-full flex-col overflow-hidden bg-white shadow-2xl ring-1 ring-slate-200/50 dark:bg-slate-900 dark:ring-slate-700/40 sm:mx-4 sm:h-auto sm:max-h-[80vh] sm:w-full sm:max-w-2xl sm:animate-slide-up sm:rounded-2xl"
            style={{
              paddingTop: "env(safe-area-inset-top)",
              paddingBottom: "env(safe-area-inset-bottom)",
            }}
          >
            {/* Search input */}
            <div className="flex items-center gap-2 border-b border-slate-200 px-3 py-2 dark:border-slate-700 sm:px-4">
              <Search
                className="h-5 w-5 shrink-0 text-slate-400"
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
                className="min-w-0 flex-1 bg-transparent py-3 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-white dark:placeholder:text-slate-500 sm:text-sm"
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
              {hasQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    inputRef.current?.focus();
                  }}
                  aria-label={t("clear")}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              )}
              <button
                type="button"
                onClick={closeDialog}
                aria-label={t("close")}
                className="ml-1 hidden h-9 shrink-0 items-center rounded-md px-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white sm:flex"
              >
                {t("cancel")}
              </button>
              <button
                type="button"
                onClick={closeDialog}
                aria-label={t("close")}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white sm:hidden"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            {/* Live region for screen readers */}
            <div role="status" aria-live="polite" className="sr-only">
              {hasQuery && results.length > 0 &&
                t("resultCount", { count: results.length })}
              {showNoResults && t("noResults", { query })}
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto overscroll-contain">
              {showEmptyState && (
                <div className="px-3 py-4 sm:px-4">
                  <div className="mb-2 flex items-center gap-2 px-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
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
                          className="group flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm text-slate-700 transition-colors hover:bg-brand-50 hover:text-brand-700 dark:text-slate-200 dark:hover:bg-brand-500/10 dark:hover:text-brand-300"
                        >
                          <FileText
                            className="h-4 w-4 shrink-0 text-slate-400 group-hover:text-brand-500"
                            aria-hidden="true"
                          />
                          <span className="flex-1 truncate font-medium">
                            {t(link.labelKey)}
                          </span>
                          <ArrowRight
                            className="h-3.5 w-3.5 shrink-0 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-brand-500 dark:text-slate-600"
                            aria-hidden="true"
                          />
                        </button>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 px-2 text-center text-xs text-slate-400 dark:text-slate-500">
                    {t("typeToSearch")}
                  </p>
                </div>
              )}

              {showNoResults && (
                <div className="px-3 py-6 text-center sm:px-4">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                    <Search
                      className="h-5 w-5 text-slate-400"
                      aria-hidden="true"
                    />
                  </div>
                  <p className="mt-3 text-sm font-medium text-slate-900 dark:text-white">
                    {t("noResults", { query })}
                  </p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {t("noResultsHint")}
                  </p>
                  <div className="mt-5 space-y-1">
                    <p className="px-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      {t("suggestions")}
                    </p>
                    {SUGGESTION_HREFS.map((link) => (
                      <button
                        type="button"
                        key={link.href}
                        onClick={() => navigateTo(link.href)}
                        className="block w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-brand-700 transition-colors hover:bg-brand-50 dark:text-brand-400 dark:hover:bg-brand-500/10"
                      >
                        {t(link.labelKey)}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {showResults && (
                <ul
                  id={RESULTS_LISTBOX_ID}
                  role="listbox"
                  aria-label={t("resultsLabel")}
                  className="space-y-0.5 px-2 py-2"
                >
                  {results.map((result, index) => {
                    const isActive = index === selectedIndex;
                    return (
                      <li
                        key={result.href}
                        id={getOptionId(index)}
                        role="option"
                        aria-selected={isActive}
                        onClick={() => navigateTo(result.href)}
                        onMouseEnter={() => setSelectedIndex(index)}
                        className={`group flex cursor-pointer items-start gap-3 rounded-lg px-3 py-3 transition-colors ${
                          isActive
                            ? "bg-brand-50 dark:bg-brand-500/10"
                            : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
                        }`}
                      >
                        <span
                          className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${
                            isActive
                              ? "bg-brand-500/15 text-brand-600 dark:bg-brand-500/20 dark:text-brand-300"
                              : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                          }`}
                          aria-hidden="true"
                        >
                          <FileText className="h-3.5 w-3.5" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                            <span
                              className={`truncate text-sm font-semibold ${
                                isActive
                                  ? "text-brand-700 dark:text-brand-300"
                                  : "text-slate-900 dark:text-white"
                              }`}
                            >
                              {result.title}
                            </span>
                            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-500 dark:bg-slate-800 dark:text-slate-300">
                              {result.section}
                            </span>
                          </div>
                          <p className="mt-0.5 line-clamp-2 text-xs text-slate-500 dark:text-slate-400">
                            {result.description}
                          </p>
                        </div>
                        <ArrowRight
                          className={`mt-2 h-4 w-4 shrink-0 transition-transform ${
                            isActive
                              ? "translate-x-0.5 text-brand-500"
                              : "text-slate-300 dark:text-slate-600"
                          }`}
                          aria-hidden="true"
                        />
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {/* Footer — desktop only (mobile uses cancel button at top) */}
            <div className="hidden border-t border-slate-200 px-4 py-2 text-xs text-slate-500 dark:border-slate-700 dark:text-slate-400 sm:flex sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <kbd className="rounded border border-slate-300 px-1.5 py-0.5 font-mono dark:border-slate-600">
                  Esc
                </kbd>
                <span>{t("escToClose")}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <kbd className="rounded border border-slate-300 px-1.5 py-0.5 font-mono dark:border-slate-600">
                    ↑↓
                  </kbd>
                  <span>{t("arrowsToNavigate")}</span>
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="inline-flex items-center rounded border border-slate-300 px-1.5 py-0.5 font-mono dark:border-slate-600">
                    <CornerDownLeft className="h-3 w-3" aria-hidden="true" />
                  </kbd>
                  <span>{t("enterToOpen")}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
