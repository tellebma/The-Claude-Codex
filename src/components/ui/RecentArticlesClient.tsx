"use client";

import { useMemo, useState } from "react";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import type { RecentArticle } from "@/lib/mdx";

interface RecentArticlesClientProps {
  readonly articles: ReadonlyArray<RecentArticle>;
  readonly title: string;
  readonly subtitle: string;
  readonly ariaLabel: string;
  readonly readArticleLabel: string;
  readonly allFilterLabel: string;
  /** Map section key -> human label (ex: { mcp: "MCP", skills: "Skills" }). */
  readonly sectionLabels: Readonly<Record<string, string>>;
}

/**
 * RG2-13 — Section "Articles recents" client-side avec filtres.
 *
 * Reçoit les articles pre-charges au build (server) et gere le state local
 * du filtre. Le default "all" affiche tous, les pills permettent de
 * restreindre par section. Les sections disponibles sont calculees a
 * partir des articles fournis (pas de filtre fantome).
 *
 * Source : `design-source/.../landing.css` `.lp-articles`,
 * `.lp-article-hero`, `.lp-article-sm`, `.lp-articles-filter`.
 */
export function RecentArticlesClient({
  articles,
  title,
  subtitle,
  ariaLabel,
  readArticleLabel,
  allFilterLabel,
  sectionLabels,
}: Readonly<RecentArticlesClientProps>) {
  const [filter, setFilter] = useState<string>("all");

  const availableSections = useMemo(() => {
    const set = new Set<string>();
    for (const a of articles) {
      if (a.section) set.add(a.section);
    }
    // Tri pour stabilite (alphabetique).
    return [...set].sort((a, b) => a.localeCompare(b));
  }, [articles]);

  const filtered = useMemo(() => {
    if (filter === "all") return articles;
    return articles.filter((a) => a.section === filter);
  }, [articles, filter]);

  if (filtered.length === 0) {
    return null;
  }

  const [hero, ...small] = filtered;

  return (
    <section
      aria-label={ariaLabel}
      className="bg-[color:var(--bg-page)] py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <h2 className="text-h2 font-bold tracking-tight text-[color:var(--fg-primary)]">
              {title}
            </h2>
            <p className="mt-3 text-lead text-[color:var(--fg-secondary)]">
              {subtitle}
            </p>
          </div>

          {availableSections.length > 1 && (
            <div
              className="flex flex-wrap gap-2"
              role="group"
              aria-label="Filtrer par section"
            >
              <FilterPill
                active={filter === "all"}
                onClick={() => setFilter("all")}
                label={allFilterLabel}
              />
              {availableSections.map((section) => (
                <FilterPill
                  key={section}
                  active={filter === section}
                  onClick={() => setFilter(section)}
                  label={sectionLabels[section] ?? section}
                />
              ))}
            </div>
          )}
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr] lg:gap-8">
          <ArticleHeroCard article={hero} ctaLabel={readArticleLabel} />

          {small.length > 0 && (
            <div className="grid gap-6">
              {small.slice(0, 2).map((article) => (
                <ArticleSmallCard
                  key={`${article.section ?? "_"}/${article.slug}`}
                  article={article}
                  ctaLabel={readArticleLabel}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

interface FilterPillProps {
  readonly active: boolean;
  readonly onClick: () => void;
  readonly label: string;
}

function FilterPill({ active, onClick, label }: Readonly<FilterPillProps>) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex h-9 items-center rounded-full border px-3.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
        active
          ? "border-brand-500/30 bg-brand-500/10 text-[color:var(--brand-primary)]"
          : "border-[color:var(--border-default)] bg-[color:var(--bg-elevated)] text-[color:var(--fg-secondary)] hover:border-[color:var(--border-strong)] hover:text-[color:var(--fg-primary)]"
      }`}
    >
      {label}
    </button>
  );
}

interface ArticleCardProps {
  readonly article: RecentArticle;
  readonly ctaLabel: string;
}

function articleHref(article: RecentArticle): string {
  return article.section
    ? `/${article.section}/${article.slug}`
    : `/content/${article.slug}`;
}

const CARD_BASE =
  "group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[color:var(--border-default)] bg-[color:var(--bg-elevated)] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--bg-page)]";

function ArticleHeroCard({
  article,
  ctaLabel,
}: Readonly<ArticleCardProps>) {
  return (
    <Link
      href={articleHref(article)}
      aria-label={`${ctaLabel} : ${article.title}`}
      data-category={article.section ?? "content"}
      className={`${CARD_BASE} hover:-translate-y-1 hover:shadow-[var(--shadow-lg)]`}
      style={{
        boxShadow: "var(--shadow-card)",
        transitionDuration: "var(--duration-base)",
        transitionTimingFunction: "var(--ease-out)",
      }}
    >
      {/* Visual area : 200px de hauteur avec radial gradients cyan/ambre +
          grid pattern + glyph SVG bottom-right (signature lp-article-hero) */}
      <div
        aria-hidden="true"
        className="lp-article-visual relative h-48 overflow-hidden border-b border-[color:var(--border-default)] sm:h-52"
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 60% at 0% 0%, rgba(6, 182, 212, 0.18), transparent 60%), radial-gradient(ellipse 50% 50% at 100% 100%, rgba(245, 158, 11, 0.14), transparent 60%), linear-gradient(135deg, rgba(15, 23, 42, 0.04), transparent 50%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage:
              "linear-gradient(var(--art-hero-grid-line, rgba(15,23,42,0.04)) 1px, transparent 1px), linear-gradient(90deg, var(--art-hero-grid-line, rgba(15,23,42,0.04)) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <svg
          className="absolute -bottom-6 -right-6 h-32 w-32 text-[color:var(--brand-primary)] opacity-15"
          viewBox="0 0 96 96"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M20 28L40 48L20 68"
            stroke="currentColor"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M52 68H76"
            stroke="currentColor"
            strokeWidth="6"
            strokeLinecap="round"
          />
        </svg>
        {article.section && (
          <span className="absolute left-5 top-5 inline-flex items-center gap-1.5 rounded-full bg-[rgba(15,23,42,0.5)] px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white backdrop-blur-md">
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-300"
            />
            {article.section}
          </span>
        )}
      </div>
      {/* Body */}
      <div className="flex flex-1 flex-col p-7 sm:p-8">
        <h3
          className="text-2xl font-bold leading-tight text-[color:var(--fg-primary)]"
          style={{ fontSize: "clamp(1.5rem, 2.4vw, 1.875rem)" }}
        >
          {article.title}
        </h3>
        <p className="mt-3 line-clamp-3 text-base leading-relaxed text-[color:var(--fg-secondary)]">
          {article.description}
        </p>
        <span className="mt-auto inline-flex items-center gap-1 pt-6 text-sm font-semibold text-[color:var(--brand-primary)] transition-all group-hover:gap-2">
          {ctaLabel}
          <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
}

function ArticleSmallCard({
  article,
  ctaLabel,
}: Readonly<ArticleCardProps>) {
  return (
    <Link
      href={articleHref(article)}
      aria-label={`${ctaLabel} : ${article.title}`}
      data-category={article.section ?? "content"}
      className={`${CARD_BASE} p-6 hover:-translate-y-px hover:border-brand-500/30 hover:shadow-[var(--shadow-md)]`}
      style={{
        boxShadow: "var(--shadow-card)",
        transitionDuration: "var(--duration-fast)",
        transitionTimingFunction: "var(--ease-out)",
      }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-brand-500 to-accent-500"
      />
      {article.section && (
        <span className="mb-3 text-xs font-semibold uppercase tracking-wider text-[color:var(--fg-muted)]">
          {article.section}
        </span>
      )}
      <h3 className="text-lg font-semibold leading-snug text-[color:var(--fg-primary)]">
        {article.title}
      </h3>
      <p className="mt-2 line-clamp-2 text-sm text-[color:var(--fg-secondary)]">
        {article.description}
      </p>
    </Link>
  );
}
