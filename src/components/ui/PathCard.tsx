import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";
import clsx from "clsx";

interface PathCardProps {
  icon: LucideIcon;
  level: string;
  title: string;
  description: string;
  items: string[];
  href: string;
  color: "teal" | "amber" | "purple";
}

const borderColors = {
  teal: "border-brand-500/30 hover:border-brand-500",
  amber: "border-accent-500/30 hover:border-accent-500",
  purple: "border-violet-500/30 hover:border-violet-500",
};

const badgeColors = {
  teal: "bg-brand-500/10 text-brand-700 dark:text-brand-400",
  amber: "bg-accent-500/10 text-accent-700 dark:text-accent-400",
  purple: "bg-violet-500/10 text-violet-700 dark:text-violet-400",
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

export function PathCard({
  icon: Icon,
  level,
  title,
  description,
  items,
  href,
  color,
}: PathCardProps) {
  return (
    <Link
      href={href}
      className={clsx(
        "glass-card group flex h-full flex-col p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-950 active:scale-[0.98]",
        borderColors[color]
      )}
    >
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

      <h3 className="mb-2 text-xl font-bold">{title}</h3>
      <p className="mb-4 text-base text-slate-600 dark:text-slate-300">
        {description}
      </p>

      <ul className="mb-6 flex-1 space-y-2">
        {items.map((item) => (
          <li
            key={item}
            className="flex items-start gap-2 text-base text-slate-600 dark:text-slate-300"
          >
            <span className={clsx("mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full", bulletColors[color])} />
            {item}
          </li>
        ))}
      </ul>

      <span className="inline-flex items-center gap-1 text-sm font-semibold text-brand-700 dark:text-brand-400 transition-all group-hover:gap-2">
        Commencer ce parcours
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </span>
    </Link>
  );
}
