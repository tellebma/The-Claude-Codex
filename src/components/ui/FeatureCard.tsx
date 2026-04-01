import { Link } from "@/i18n/navigation";
import type { LucideIcon } from "lucide-react";
import clsx from "clsx";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  gradient?: "teal" | "amber" | "purple" | "green";
  href?: string;
}

const gradients = {
  teal: "from-brand-100 to-brand-50",
  amber: "from-accent-100 to-accent-50",
  purple: "from-violet-100 to-violet-50",
  green: "from-emerald-100 to-emerald-50",
};

const iconColors = {
  teal: "text-brand-700 dark:text-brand-400",
  amber: "text-accent-600 dark:text-accent-400",
  purple: "text-violet-600 dark:text-violet-400",
  green: "text-emerald-600 dark:text-emerald-400",
};

export function FeatureCard({
  icon: Icon,
  title,
  description,
  gradient = "teal",
  href,
}: FeatureCardProps) {
  const baseClassName = "glass-card group h-full p-6 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-950";

  const interactiveClassName = "hover:-translate-y-1 hover:shadow-lg active:scale-[0.98] cursor-pointer";

  const content = (
    <>
      <div
        className={clsx(
          "mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br",
          gradients[gradient]
        )}
      >
        <Icon className={clsx("h-6 w-6", iconColors[gradient])} aria-hidden="true" />
      </div>
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
        {description}
      </p>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={clsx(baseClassName, interactiveClassName, "block")}>
        {content}
      </Link>
    );
  }

  return (
    <div className={baseClassName}>
      {content}
    </div>
  );
}
