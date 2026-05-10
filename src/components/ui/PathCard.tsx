import { Link } from "@/i18n/navigation";
import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";
import clsx from "clsx";
import { BorderBeam } from "@/components/ui/BorderBeam";

interface PathCardProps {
  icon: LucideIcon;
  level: string;
  title: string;
  description: string;
  items: string[];
  href: string;
  color: "teal" | "amber" | "purple";
  ctaLabel: string;
}

const borderColors = {
  teal: "border-brand-500/30 hover:border-brand-500",
  amber: "border-accent-500/30 hover:border-accent-500",
  purple: "border-violet-500/30 hover:border-violet-500",
};

// Badges : sur fond dark, le texte doit passer en 300 pour preserver le
// contraste WCAG AA 4.5:1 (verifie via axe-core E2E). Les variants 700 ne
// passaient que 1.81-2.44:1 sur fond dark.
const badgeColors = {
  teal: "bg-brand-500/10 text-brand-700 dark:text-brand-300",
  amber: "bg-accent-500/10 text-accent-700 dark:text-accent-300",
  purple: "bg-violet-500/10 text-violet-700 dark:text-violet-300",
};

const iconBg = {
  teal: "from-brand-500 to-brand-600",
  amber: "from-accent-500 to-accent-600",
  purple: "from-violet-500 to-violet-600",
};

const bulletColors = {
  teal: "bg-brand-500",
  amber: "bg-accent-500",
  purple: "bg-violet-500",
};

/**
 * Stagger du BorderBeam par couleur de carte, pour éviter que les 3 cartes
 * animent en synchro. Table plate pour rester lisible (ex-nested ternary).
 */
const BEAM_DELAY: Readonly<Record<"teal" | "amber" | "purple", number>> = {
  teal: 0,
  amber: 1.5,
  purple: 3,
};

export function PathCard({
  icon: Icon,
  level,
  title,
  description,
  items,
  href,
  color,
  ctaLabel,
}: Readonly<PathCardProps>) {
  const beamColors = {
    teal: { from: "#06b6d4", to: "#22d3ee" },
    amber: { from: "#f59e0b", to: "#fbbf24" },
    purple: { from: "#8b5cf6", to: "#a78bfa" },
  };

  return (
    <Link
      href={href}
      aria-label={`${level} : ${title}`}
      className={clsx(
        "glass-card group relative flex h-full flex-col overflow-hidden p-6 transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-xl)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--bg-page)] active:scale-[0.98]",
        borderColors[color]
      )}
      style={{
        transitionDuration: "var(--duration-base)",
        transitionTimingFunction: "var(--ease-out)",
      }}
    >
      <BorderBeam
        colorFrom={beamColors[color].from}
        colorTo={beamColors[color].to}
        duration={5}
        delay={BEAM_DELAY[color]}
      />
      <div className="mb-4 flex items-center gap-3">
        <div
          className={clsx(
            "flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br text-white",
            iconBg[color]
          )}
        >
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
        <span
          className={clsx(
            "rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider",
            badgeColors[color]
          )}
        >
          {level}
        </span>
      </div>

      <h3 className="mb-2 text-xl font-bold text-[color:var(--fg-primary)]">{title}</h3>
      <p className="mb-4 text-base text-[color:var(--fg-secondary)]">
        {description}
      </p>

      <ul className="mb-6 flex-1 space-y-2">
        {items.map((item) => (
          <li
            key={item}
            className="flex items-start gap-2 text-base text-[color:var(--fg-secondary)]"
          >
            <span className={clsx("mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full", bulletColors[color])} />
            {item}
          </li>
        ))}
      </ul>

      <span className="inline-flex items-center gap-1 text-sm font-semibold text-[color:var(--brand-primary)] transition-all group-hover:gap-2">
        {ctaLabel}
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </span>
    </Link>
  );
}
