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

// Couleurs d'icones uniformes light/dark : la classe Tailwind brand/accent/
// violet/emerald-600 garde un contraste suffisant sur le fond gradient clair
// de la pastille.
const iconColors = {
  teal: "text-brand-700",
  amber: "text-accent-600",
  purple: "text-violet-600",
  green: "text-emerald-600",
};

export function FeatureCard({
  icon: Icon,
  title,
  description,
  gradient = "teal",
  href,
}: Readonly<FeatureCardProps>) {
  // glass-card est defini dans globals.css et utilise deja les tokens de
  // surface ; on y ajoute la transition motion via tokens et le focus ring
  // qui pointe sur --bg-page (qui bascule light/dark).
  const baseClassName = "glass-card group h-full p-6 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--bg-page)]";

  const interactiveClassName = "hover:-translate-y-1 hover:shadow-[var(--shadow-lg)] active:scale-[0.98] cursor-pointer";

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
      <h3 className="mb-2 text-lg font-semibold text-[color:var(--fg-primary)]">{title}</h3>
      <p className="text-base leading-relaxed text-[color:var(--fg-secondary)]">
        {description}
      </p>
    </>
  );

  const motionStyle = {
    transitionDuration: "var(--duration-base)",
    transitionTimingFunction: "var(--ease-out)",
  };

  if (href) {
    return (
      <Link
        href={href}
        data-interactive
        className={clsx(baseClassName, interactiveClassName, "block")}
        style={motionStyle}
      >
        {content}
      </Link>
    );
  }

  return (
    <div className={baseClassName} style={motionStyle}>
      {content}
    </div>
  );
}
