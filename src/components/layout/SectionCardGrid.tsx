import { ArrowRight, type LucideIcon } from "lucide-react";
import clsx from "clsx";
import { Link } from "@/i18n/navigation";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";

type CardColor = "brand" | "accent" | "emerald";

export interface SectionCardItem {
  readonly href: string;
  readonly icon: LucideIcon;
  /** Numéro d'étape optionnel, ex: "01", "02". */
  readonly step?: string;
  readonly title: string;
  readonly description: string;
  readonly color: CardColor;
  /** Badge optionnel affiché en haut à droite (ex: "NEW"). */
  readonly badge?: string;
}

interface SectionCardGridProps {
  readonly items: ReadonlyArray<SectionCardItem>;
  /** Nombre de colonnes au-delà de `sm`. Défaut : 3 pour ≥ 4 cards, 2 sinon. */
  readonly columns?: 2 | 3;
  /** Texte du CTA de chaque card (ex: "Lire le guide"). */
  readonly cta: string;
  /** Anime chaque card en fade-up au scroll (défaut true). */
  readonly animate?: boolean;
}

const colorStyles: Record<
  CardColor,
  { readonly iconWrap: string; readonly icon: string; readonly hoverBorder: string }
> = {
  brand: {
    iconWrap: "bg-brand-500/10",
    icon: "text-brand-700 dark:text-brand-300",
    hoverBorder: "group-hover:border-brand-500/50",
  },
  accent: {
    iconWrap: "bg-accent-500/10",
    icon: "text-accent-600 dark:text-accent-300",
    hoverBorder: "group-hover:border-accent-500/50",
  },
  emerald: {
    iconWrap: "bg-emerald-500/10",
    icon: "text-emerald-600 dark:text-emerald-300",
    hoverBorder: "group-hover:border-emerald-500/50",
  },
};

const gridColumns: Record<2 | 3, string> = {
  2: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
};

/**
 * POL-2 — Grille de cartes de sous-pages réutilisable.
 *
 * Remplace le pattern JSX dupliqué sur les pages landing de section (cards
 * icône + titre + description + CTA). Responsive 1/2/3 colonnes, animation
 * `fade-up` optionnelle, palette via tokens (brand / accent / emerald).
 */
export function SectionCardGrid({
  items,
  columns,
  cta,
  animate = true,
}: Readonly<SectionCardGridProps>) {
  const resolvedColumns: 2 | 3 = columns ?? (items.length >= 4 ? 3 : 2);

  return (
    <div className={clsx("mt-10 grid gap-6 sm:mt-12", gridColumns[resolvedColumns])}>
      {items.map((item, index) =>
        animate ? (
          <AnimateOnScroll
            key={item.href}
            preset="fade-up"
            delay={Math.min(index * 0.06, 0.3)}
            className="h-full"
          >
            <SectionCard item={item} cta={cta} />
          </AnimateOnScroll>
        ) : (
          <SectionCard key={item.href} item={item} cta={cta} />
        ),
      )}
    </div>
  );
}

function SectionCard({
  item,
  cta,
}: Readonly<{ item: SectionCardItem; cta: string }>) {
  const { icon: Icon, color } = item;
  const styles = colorStyles[color];

  return (
    <Link
      href={item.href}
      data-interactive
      className={clsx(
        "group flex h-full flex-col rounded-2xl border border-[color:var(--border-default)] bg-[color:var(--surface-card)] p-6 shadow-[var(--shadow-sm)]",
        "transition-all duration-[var(--duration-base)] ease-[var(--ease-out)]",
        "hover:-translate-y-1 hover:shadow-[var(--shadow-lg)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--bg-page)]",
        "motion-reduce:transition-colors motion-reduce:hover:translate-y-0",
        styles.hoverBorder,
      )}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <span
          className={clsx(
            "inline-flex h-12 w-12 items-center justify-center rounded-xl",
            styles.iconWrap,
          )}
        >
          <Icon className={clsx("h-6 w-6", styles.icon)} aria-hidden="true" />
        </span>
        <div className="flex items-center gap-2">
          {item.badge && (
            <span className="rounded-full bg-brand-500/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-[color:var(--brand-primary)]">
              {item.badge}
            </span>
          )}
          {item.step && (
            <span className="font-mono text-sm font-semibold text-[color:var(--fg-muted)]">
              {item.step}
            </span>
          )}
        </div>
      </div>
      <h3 className="mb-2 text-lg font-semibold text-[color:var(--fg-primary)]">
        {item.title}
      </h3>
      <p className="text-base leading-relaxed text-[color:var(--fg-secondary)]">
        {item.description}
      </p>
      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[color:var(--brand-primary)] transition-[gap] duration-[var(--duration-base)] ease-[var(--ease-out)] group-hover:gap-2.5">
        {cta}
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </span>
    </Link>
  );
}
