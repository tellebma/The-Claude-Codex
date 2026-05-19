"use client";

import { Filter, ArrowDown } from "lucide-react";

interface ContentHeroActionsProps {
  readonly primaryLabel: string;
  readonly secondaryLabel: string;
}

const PRIMARY_TARGET = "all-articles";
const SECONDARY_TARGET = "pinned-latest";
const FILTER_FIRST_CHIP_SELECTOR = "[data-theme-filter-first]";

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function scrollToAnchor(id: string): HTMLElement | null {
  const target = document.getElementById(id);
  if (!target) return null;
  const behavior: ScrollBehavior = prefersReducedMotion() ? "auto" : "smooth";
  target.scrollIntoView({ behavior, block: "start" });
  return target;
}

function focusFirstFilterChip(container: HTMLElement | null): void {
  if (!container) return;
  const candidate =
    container.querySelector<HTMLElement>(FILTER_FIRST_CHIP_SELECTOR) ??
    container.querySelector<HTMLElement>(
      "[role='group'] button, button[aria-pressed]"
    );
  if (candidate) {
    candidate.focus({ preventScroll: true });
  }
}

export function ContentHeroActions({
  primaryLabel,
  secondaryLabel,
}: ContentHeroActionsProps) {
  const handlePrimary = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const target = scrollToAnchor(PRIMARY_TARGET);
    if (target) {
      window.setTimeout(() => focusFirstFilterChip(target), 350);
    }
  };

  const handleSecondary = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    scrollToAnchor(SECONDARY_TARGET);
  };

  return (
    <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
      <a
        href={`#${PRIMARY_TARGET}`}
        onClick={handlePrimary}
        className="inline-flex items-center gap-2 rounded-lg bg-[color:var(--brand-primary)] px-5 py-3 text-base font-semibold text-[color:var(--fg-on-brand)] shadow-[var(--shadow-sm)] transition-all duration-[var(--duration-fast)] ease-[var(--ease-out)] hover:-translate-y-px hover:bg-[color:var(--brand-hover)] hover:shadow-[var(--shadow-md)] motion-reduce:hover:translate-y-0 motion-reduce:transition-colors"
      >
        <Filter className="h-4 w-4" aria-hidden="true" />
        {primaryLabel}
      </a>
      <a
        href={`#${SECONDARY_TARGET}`}
        onClick={handleSecondary}
        className="hero-cta-secondary inline-flex items-center gap-2 rounded-lg border border-[color:var(--hero-cta-secondary-border)] bg-transparent px-5 py-3 text-base font-semibold text-[color:var(--hero-cta-secondary-text)] transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out)]"
      >
        {secondaryLabel}
        <ArrowDown className="h-4 w-4" aria-hidden="true" />
      </a>
    </div>
  );
}
