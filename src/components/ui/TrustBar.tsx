import type { LucideIcon } from "lucide-react";

interface TrustBarItem {
  readonly Icon: LucideIcon;
  readonly label: string;
}

interface TrustBarProps {
  readonly label: string;
  readonly items: ReadonlyArray<TrustBarItem>;
}

/**
 * RG2-15 — TrustBar landing.
 *
 * Bande sous le hero avec un label uppercase muted a gauche et une liste
 * d'items mono a droite (open-source, FR+EN, MCP officiel, etc).
 *
 * Atmosphere : padding 28/32, border-top + border-bottom default,
 * gradient subtil 0% -> 100%. Label 11px / 600 / 0.12em uppercase muted.
 * Items mono 13px secondary, icone muted.
 *
 * Source design : `landing.css` `.lp-trust`, `.lp-trust-inner`,
 * `.lp-trust-label`, `.lp-trust-items`, `.lp-trust-item`.
 */
export function TrustBar({ label, items }: Readonly<TrustBarProps>) {
  return (
    <section
      aria-label={label}
      className="border-y border-[color:var(--border-default)] bg-gradient-to-b from-[color:var(--bg-page)] to-[color:var(--bg-subtle)] px-8 py-7"
    >
      <div className="mx-auto flex max-w-[1240px] flex-wrap items-center gap-8">
        <p className="shrink-0 text-[11px] font-semibold uppercase tracking-[0.12em] text-[color:var(--fg-muted)]">
          {label}
        </p>
        <ul className="m-0 flex flex-1 list-none flex-wrap gap-7 p-0">
          {items.map(({ Icon, label: itemLabel }) => (
            <li
              key={itemLabel}
              className="inline-flex items-center gap-2 font-mono text-[13px] text-[color:var(--fg-secondary)]"
            >
              <Icon
                aria-hidden="true"
                className="h-3.5 w-3.5 text-[color:var(--fg-muted)]"
              />
              {itemLabel}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
