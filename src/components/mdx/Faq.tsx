"use client";

import { useCallback, useId, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

interface FaqProps {
  readonly children: ReactNode;
}

interface FaqItemProps {
  readonly question: string;
  readonly children: ReactNode;
  readonly defaultOpen?: boolean;
}

/**
 * RG2-05 — Accordeon FAQ pour articles editoriaux MDX.
 *
 * Wrapper `<Faq>` + `<FaqItem question="...">contenu</FaqItem>`. Item radius
 * 14, border default, etat open avec border brand-500/40 + shadow brand
 * subtile, chevron 28x28 qui rotate 180 et bg brand-500 quand ouvert.
 *
 * A11y : button avec aria-expanded + aria-controls, region avec aria-labelledby,
 * hidden quand ferme. Keyboard : Enter/Space togglent (natif sur button).
 *
 * Source : `design-source/.../article.css` `.art-faq`, `.art-faq-item`,
 * `.art-faq-q`, `.art-faq-a`.
 */
export function Faq({ children }: Readonly<FaqProps>) {
  return <div className="my-6 flex flex-col gap-3">{children}</div>;
}

export function FaqItem({
  question,
  children,
  defaultOpen = false,
}: Readonly<FaqItemProps>) {
  const [open, setOpen] = useState(defaultOpen);
  const reactId = useId();
  const buttonId = `faq-q-${reactId}`;
  const panelId = `faq-a-${reactId}`;

  const handleToggle = useCallback(() => {
    setOpen((current) => !current);
  }, []);

  const itemBorder = open
    ? "border-[color:var(--color-brand-500)]/40 shadow-[0_8px_24px_-12px_rgba(6,182,212,0.25)]"
    : "border-[color:var(--border-default)]";

  return (
    <div
      className={`overflow-hidden rounded-2xl border bg-[color:var(--bg-elevated)] transition-all duration-300 ease-out ${itemBorder}`}
    >
      <button
        type="button"
        id={buttonId}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={handleToggle}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-base font-semibold text-[color:var(--fg-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--bg-elevated)]"
      >
        <span>{question}</span>
        <span
          aria-hidden="true"
          className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-all duration-300 ease-out ${
            open
              ? "rotate-180 bg-[color:var(--color-brand-500)] text-[color:var(--fg-on-brand)]"
              : "bg-[color:var(--bg-subtle)] text-[color:var(--fg-muted)]"
          }`}
        >
          <ChevronDown className="h-4 w-4" />
        </span>
      </button>
      <section
        id={panelId}
        aria-labelledby={buttonId}
        hidden={!open}
        className="px-5 pb-5 text-[15px] leading-[1.65] text-[color:var(--fg-secondary)]"
      >
        {children}
      </section>
    </div>
  );
}
