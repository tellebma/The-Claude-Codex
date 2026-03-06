import type { LucideIcon } from "lucide-react";
import clsx from "clsx";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  gradient?: "teal" | "amber" | "purple" | "green";
}

const gradients = {
  teal: "from-brand-500/20 to-brand-500/5",
  amber: "from-accent-500/20 to-accent-500/5",
  purple: "from-violet-500/20 to-violet-500/5",
  green: "from-emerald-500/20 to-emerald-500/5",
};

const iconColors = {
  teal: "text-brand-500",
  amber: "text-accent-500",
  purple: "text-violet-500",
  green: "text-emerald-500",
};

export function FeatureCard({
  icon: Icon,
  title,
  description,
  gradient = "teal",
}: FeatureCardProps) {
  return (
    <div className="glass-card group p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div
        className={clsx(
          "mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br",
          gradients[gradient]
        )}
      >
        <Icon className={clsx("h-6 w-6", iconColors[gradient])} />
      </div>
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
        {description}
      </p>
    </div>
  );
}
