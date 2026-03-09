import Link from "next/link";
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
  teal: "from-brand-500/20 to-brand-500/5",
  amber: "from-accent-500/20 to-accent-500/5",
  purple: "from-violet-500/20 to-violet-500/5",
  green: "from-emerald-500/20 to-emerald-500/5",
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
  const sharedClassName = "glass-card group h-full p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg";

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
      <p className="text-base leading-relaxed text-slate-600 dark:text-slate-400">
        {description}
      </p>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={clsx(sharedClassName, "block")}>
        {content}
      </Link>
    );
  }

  return (
    <div className={sharedClassName}>
      {content}
    </div>
  );
}
