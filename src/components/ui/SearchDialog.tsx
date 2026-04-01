"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Search, X, ArrowRight, FileText } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { searchEntries, type SearchEntry } from "@/lib/search-index";

const RESULTS_LISTBOX_ID = "search-results-listbox";

function getOptionId(index: number): string {
  return `search-option-${index}`;
}

export function SearchDialog() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ReadonlyArray<SearchEntry>>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("search");

  const openDialog = useCallback(() => {
    setOpen(true);
    setQuery("");
    setResults([]);
    setSelectedIndex(0);
  }, []);

  const closeDialog = useCallback(() => {
    setOpen(false);
    setQuery("");
    setResults([]);
    setSelectedIndex(0);
  }, []);

  const navigateTo = useCallback(
    (href: string) => {
      closeDialog();
      router.push(href);
    },
    [closeDialog, router]
  );

  // Keyboard shortcut: Ctrl+K or Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (open) {
          closeDialog();
        } else {
          openDialog();
        }
      }
      if (e.key === "Escape" && open) {
        closeDialog();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, openDialog, closeDialog]);

  // Focus input when dialog opens
  useEffect(() => {
    if (open) {
      const timeout = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timeout);
    }
  }, [open]);

  // Update results when query changes
  useEffect(() => {
    const found = searchEntries(query, locale);
    setResults(found);
    setSelectedIndex(0);
  }, [query, locale]);

  // Keyboard navigation within results
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < results.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev > 0 ? prev - 1 : results.length - 1
      );
    } else if (e.key === "Enter" && results.length > 0) {
      e.preventDefault();
      const selected = results[selectedIndex];
      if (selected) {
        navigateTo(selected.href);
      }
    }
  };

  // Lock body scroll when dialog is open (with scrollbar compensation to avoid layout shift)
  useEffect(() => {
    if (open) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [open]);

  // Focus trap: cycle Tab/Shift+Tab within the dialog
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

    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }, []);

  const activeDescendant =
    results.length > 0 ? getOptionId(selectedIndex) : undefined;

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={openDialog}
        className="flex h-11 items-center gap-2 rounded-lg border border-slate-200 bg-white/80 px-3 text-sm text-slate-500 transition-all hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:bg-slate-700"
      >
        <Search className="h-4 w-4" aria-hidden="true" />
        <span className="sr-only sm:not-sr-only">{t("trigger")}</span>
        <kbd className="hidden rounded border border-slate-300 bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-slate-600 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300 sm:inline" aria-hidden="true">
          Ctrl K
        </kbd>
      </button>

      {/* Dialog overlay */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 pt-[15vh] backdrop-blur-sm"
          onClick={closeDialog}
        >
          {/* Dialog */}
          <div
            ref={dialogRef}
            role="dialog"
            aria-label={t("dialogTitle")}
            aria-modal="true"
            className="mx-4 w-full max-w-xl animate-fade-in overflow-hidden rounded-2xl border border-slate-200/50 bg-white shadow-2xl dark:border-slate-700/50 dark:bg-slate-900"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={handleDialogKeyDown}
          >
            {/* Search input */}
            <div className="flex items-center gap-3 border-b border-slate-200 px-4 dark:border-slate-700">
              <Search
                className="h-5 w-5 shrink-0 text-slate-400"
                aria-hidden="true"
              />
              <input
                ref={inputRef}
                role="combobox"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t("placeholder")}
                className="flex-1 bg-transparent py-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-white dark:placeholder:text-slate-500"
                aria-label={t("inputLabel")}
                aria-expanded={results.length > 0}
                aria-controls={RESULTS_LISTBOX_ID}
                aria-autocomplete="list"
                aria-activedescendant={activeDescendant}
                autoComplete="off"
              />
              <button
                onClick={closeDialog}
                aria-label={t("close")}
                className="rounded-md p-1 text-slate-500 transition-colors hover:text-slate-700 dark:text-slate-300 dark:hover:text-white"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            {/* Aria-live region for screen reader result count announcements */}
            <div role="status" aria-live="polite" className="sr-only">
              {query.length > 0 && results.length > 0 && t("resultCount", { count: results.length })}
              {query.length > 0 && results.length === 0 && t("noResults", { query })}
            </div>

            {/* Results */}
            <div className="max-h-80 overflow-y-auto p-2">
              {query.length > 0 && results.length === 0 && (
                <div className="px-4 py-6 text-center">
                  <p className="text-sm text-slate-500 dark:text-slate-300">
                    {t("noResults", { query })}
                  </p>
                  <div className="mt-4 space-y-1">
                    <p className="text-xs font-medium text-slate-400 dark:text-slate-500">{t("suggestions")}</p>
                    {[
                      { href: "/getting-started", label: t("suggestGettingStarted") },
                      { href: "/mcp", label: t("suggestMcp") },
                      { href: "/prompting", label: t("suggestPrompting") },
                      { href: "/skills", label: t("suggestSkills") },
                    ].map((link) => (
                      <button
                        key={link.href}
                        onClick={() => navigateTo(link.href)}
                        className="block w-full rounded-lg px-3 py-2 text-left text-sm text-brand-700 transition-colors hover:bg-brand-50 dark:text-brand-400 dark:hover:bg-brand-500/10"
                      >
                        {link.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <ul
                id={RESULTS_LISTBOX_ID}
                role="listbox"
                aria-label={t("resultsLabel")}
              >
                {results.map((result, index) => (
                  <li
                    key={result.href}
                    id={getOptionId(index)}
                    role="option"
                    aria-selected={index === selectedIndex}
                    onClick={() => navigateTo(result.href)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`flex w-full cursor-pointer items-start gap-3 rounded-lg px-3 py-3 text-left transition-colors ${
                      index === selectedIndex
                        ? "bg-brand-50 dark:bg-brand-500/10"
                        : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    }`}
                  >
                    <FileText
                      className={`mt-0.5 h-4 w-4 shrink-0 ${
                        index === selectedIndex
                          ? "text-brand-500"
                          : "text-slate-400"
                      }`}
                      aria-hidden="true"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-sm font-medium ${
                            index === selectedIndex
                              ? "text-brand-700 dark:text-brand-400"
                              : "text-slate-900 dark:text-white"
                          }`}
                        >
                          {result.title}
                        </span>
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-300">
                          {result.section}
                        </span>
                      </div>
                      <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-300">
                        {result.description}
                      </p>
                    </div>
                    <ArrowRight
                      className={`mt-1 h-3 w-3 shrink-0 ${
                        index === selectedIndex
                          ? "text-brand-500"
                          : "text-slate-300 dark:text-slate-600"
                      }`}
                      aria-hidden="true"
                    />
                  </li>
                ))}
              </ul>

              {query.length === 0 && (
                <div className="px-4 py-6 text-center text-sm text-slate-500 dark:text-slate-300">
                  {t("typeToSearch")}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-slate-200 px-4 py-2 text-xs text-slate-500 dark:border-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-2">
                <kbd className="rounded border border-slate-300 px-1 py-0.5 font-mono dark:border-slate-600">
                  Esc
                </kbd>
                <span>{t("escToClose")}</span>
              </div>
              <div className="flex items-center gap-2">
                <kbd className="rounded border border-slate-300 px-1 py-0.5 font-mono dark:border-slate-600">
                  &uarr;&darr;
                </kbd>
                <span>{t("arrowsToNavigate")}</span>
                <kbd className="rounded border border-slate-300 px-1 py-0.5 font-mono dark:border-slate-600">
                  &crarr;
                </kbd>
                <span>{t("enterToOpen")}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
