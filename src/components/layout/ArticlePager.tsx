import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";

interface PagerEntry {
  readonly href: string;
  readonly title: string;
}

interface ArticlePagerProps {
  readonly prev: PagerEntry | null;
  readonly next: PagerEntry | null;
  readonly previousLabel: string;
  readonly nextLabel: string;
}

/**
 * RG2-08 — Pager prev/next bas d'article editorial.
 *
 * Reproduit `.art-pager` du source design : grid 1fr 1fr gap 16 mt-16,
 * padding 20/22, border default radius 14. Hover border brand-400 +
 * translate-y -2 + shadow-md. Label 12px / 600 / 0.05em uppercase muted,
 * title 16px / 600 / 1.35.
 *
 * Source : `design-source/.../article.css` `.art-pager`, `.art-pager-label`,
 * `.art-pager-title`.
 */
export function ArticlePager({
  prev,
  next,
  previousLabel,
  nextLabel,
}: Readonly<ArticlePagerProps>) {
  if (!prev && !next) return null;

  return (
    <nav
      aria-label={`${previousLabel} / ${nextLabel}`}
      className="art-pager mx-auto mt-16 grid max-w-7xl grid-cols-1 gap-4 px-4 sm:grid-cols-2 sm:px-8"
    >
      {prev ? (
        <Link
          href={prev.href}
          className="group block rounded-2xl border border-[color:var(--border-default)] bg-[color:var(--bg-elevated)] px-5 py-5 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-brand-400 hover:shadow-[var(--shadow-md)]"
        >
          <p className="mb-1.5 inline-flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-[0.05em] text-[color:var(--fg-muted)]">
            <ArrowLeft
              aria-hidden="true"
              className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5"
            />
            {previousLabel}
          </p>
          <p className="text-base font-semibold leading-snug text-[color:var(--fg-primary)]">
            {prev.title}
          </p>
        </Link>
      ) : (
        <div aria-hidden="true" />
      )}
      {next ? (
        <Link
          href={next.href}
          className="group block rounded-2xl border border-[color:var(--border-default)] bg-[color:var(--bg-elevated)] px-5 py-5 text-right transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-brand-400 hover:shadow-[var(--shadow-md)]"
        >
          <p className="mb-1.5 inline-flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-[0.05em] text-[color:var(--fg-muted)]">
            {nextLabel}
            <ArrowRight
              aria-hidden="true"
              className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
            />
          </p>
          <p className="text-base font-semibold leading-snug text-[color:var(--fg-primary)]">
            {next.title}
          </p>
        </Link>
      ) : (
        <div aria-hidden="true" />
      )}
    </nav>
  );
}
