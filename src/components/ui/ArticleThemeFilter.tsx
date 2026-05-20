"use client";

import {
  Fragment,
  useCallback,
  useMemo,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { SearchX } from "lucide-react";

import {
  THEME_REGISTRY,
  type ContentTypeKey,
  type DomainKey,
  type ThemeKey,
} from "@/lib/themes";
import { trackContentIndex } from "@/lib/analytics/trackContentIndex";

const TYPE_KEYS: ReadonlyArray<ContentTypeKey> = [
  "tutorial",
  "guide",
  "reference",
  "comparison",
  "use-case",
];

const DOMAIN_KEYS: ReadonlyArray<DomainKey> = [
  "security",
  "devsecops",
  "architecture",
  "performance",
  "tooling",
  "productivity",
  "migration",
];

const FILTER_FIRST_ATTR = "data-theme-filter-first";

interface ArticleLike {
  readonly slug: string;
  readonly themes?: ReadonlyArray<ThemeKey>;
}

export interface ArticleThemeFilterLabels {
  readonly ariaLabel: string;
  readonly typeGroup: string;
  readonly domainGroup: string;
  readonly themeNames: Readonly<Record<ThemeKey, string>>;
  readonly countSingular: string;
  readonly countPlural: string;
  readonly reset: string;
  readonly emptyTitle: string;
  readonly emptyCta: string;
}

export interface ArticleThemeFilterProps {
  readonly articles: ReadonlyArray<ArticleLike>;
  readonly cardsBySlug: Readonly<Record<string, ReactNode>>;
  readonly labels: ArticleThemeFilterLabels;
}

function matchesActiveFilters(
  article: ArticleLike,
  active: ReadonlySet<ThemeKey>,
): boolean {
  if (active.size === 0) return true;
  if (!article.themes || article.themes.length === 0) return false;
  for (const t of article.themes) {
    if (active.has(t)) return true;
  }
  return false;
}

interface ChipProps {
  readonly themeKey: ThemeKey;
  readonly label: string;
  readonly active: boolean;
  readonly isFirst: boolean;
  readonly onToggle: (key: ThemeKey) => void;
  readonly onKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => void;
}

function ThemeChip({
  themeKey,
  label,
  active,
  isFirst,
  onToggle,
  onKeyDown,
}: ChipProps) {
  const meta = THEME_REGISTRY[themeKey];
  const Icon = meta.icon;
  const baseClasses =
    "inline-flex h-9 items-center gap-1.5 rounded-full border px-3.5 text-sm font-medium transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700";
  const activeClasses =
    "border-brand-500/30 bg-brand-500/10 text-[color:var(--brand-primary)] hover:bg-brand-500/15";
  const inactiveClasses =
    "border-[color:var(--border-default)] bg-[color:var(--bg-elevated)] text-[color:var(--fg-secondary)] hover:border-[color:var(--border-strong)] hover:text-[color:var(--fg-primary)]";

  const firstAttr = isFirst ? { [FILTER_FIRST_ATTR]: "" } : {};

  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={() => onToggle(themeKey)}
      onKeyDown={onKeyDown}
      className={`${baseClasses} ${active ? activeClasses : inactiveClasses}`}
      {...firstAttr}
    >
      {active && (
        <Icon
          className="h-3.5 w-3.5"
          aria-hidden="true"
          style={{ color: meta.color }}
        />
      )}
      {label}
    </button>
  );
}

export function ArticleThemeFilter({
  articles,
  cardsBySlug,
  labels,
}: ArticleThemeFilterProps) {
  const [active, setActive] = useState<ReadonlySet<ThemeKey>>(
    () => new Set<ThemeKey>(),
  );

  const filteredArticles = useMemo(
    () => articles.filter((a) => matchesActiveFilters(a, active)),
    [articles, active],
  );

  const toggle = useCallback(
    (key: ThemeKey) => {
      setActive((prev) => {
        const next = new Set(prev);
        const wasActive = next.has(key);
        if (wasActive) {
          next.delete(key);
        } else {
          next.add(key);
        }
        trackContentIndex.themeFilterToggle(key, !wasActive);
        return next;
      });
    },
    [],
  );

  const reset = useCallback(() => {
    setActive((prev) => {
      if (prev.size === 0) return prev;
      return new Set<ThemeKey>();
    });
  }, []);

  const handleChipKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>) => {
      if (event.key === "Escape" && active.size > 0) {
        event.preventDefault();
        reset();
      }
    },
    [active.size, reset],
  );

  const hasActiveFilters = active.size > 0;
  const emptyState = filteredArticles.length === 0 && hasActiveFilters;

  return (
    <fieldset
      aria-label={labels.ariaLabel}
      className="flex flex-col gap-4 border-0 p-0"
    >
      <div className="flex flex-col gap-2">
        <span className="cc-eyebrow">{labels.typeGroup}</span>
        <div className="flex flex-wrap gap-2">
          {TYPE_KEYS.map((key, index) => (
            <ThemeChip
              key={key}
              themeKey={key}
              label={labels.themeNames[key]}
              active={active.has(key)}
              isFirst={index === 0}
              onToggle={toggle}
              onKeyDown={handleChipKeyDown}
            />
          ))}
        </div>
      </div>

      <div className="mt-2 flex flex-col gap-2">
        <span className="cc-eyebrow">{labels.domainGroup}</span>
        <div className="flex flex-wrap gap-2">
          {DOMAIN_KEYS.map((key) => (
            <ThemeChip
              key={key}
              themeKey={key}
              label={labels.themeNames[key]}
              active={active.has(key)}
              isFirst={false}
              onToggle={toggle}
              onKeyDown={handleChipKeyDown}
            />
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-baseline justify-between gap-3">
        <p
          aria-live="polite"
          className="text-sm text-[color:var(--fg-muted)]"
        >
          <span className="font-semibold text-[color:var(--fg-primary)]">
            {filteredArticles.length}
          </span>{" "}
          {filteredArticles.length === 1
            ? labels.countSingular
            : labels.countPlural}
        </p>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={reset}
            className="text-sm text-[color:var(--brand-primary)] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
          >
            {labels.reset}
          </button>
        )}
      </div>

      {emptyState ? (
        <div className="mt-8 flex flex-col items-center justify-center gap-4 rounded-2xl border border-[color:var(--border-default)] bg-[color:var(--bg-elevated)] px-6 py-12 text-center">
          <SearchX
            className="h-8 w-8 text-[color:var(--fg-muted)]"
            aria-hidden="true"
          />
          <p className="text-base text-[color:var(--fg-secondary)]">
            {labels.emptyTitle}
          </p>
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-lg bg-[color:var(--brand-primary)] px-5 py-2.5 text-sm font-semibold text-[color:var(--fg-on-brand)] shadow-[var(--shadow-sm)] transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out)] hover:bg-[color:var(--brand-hover)]"
          >
            {labels.emptyCta}
          </button>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredArticles.map((article) => (
            <Fragment key={article.slug}>{cardsBySlug[article.slug]}</Fragment>
          ))}
        </div>
      )}
    </fieldset>
  );
}
