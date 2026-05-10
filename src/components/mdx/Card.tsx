import clsx from "clsx";

interface CardProps {
  readonly title?: string;
  readonly variant?: "default" | "accent" | "highlight";
  readonly children: React.ReactNode;
}

// Variantes basees sur les tokens C1. La variante "default" utilise les
// tokens de surface ; "accent" et "highlight" gardent les classes brand/
// accent Tailwind (declarees dans @theme) avec des fonds semitransparents
// uniformes light/dark, plus de prefix dark: dans le composant.
const variantStyles = {
  default:
    "border-[color:var(--border-default)] bg-[color:var(--bg-elevated)]",
  accent:
    "border-brand-500/30 bg-brand-500/10",
  highlight:
    "border-accent-500/30 bg-accent-500/10",
};

export function Card({ title, variant = "default", children }: CardProps) {
  return (
    <div
      className={clsx(
        "my-4 rounded-xl border p-6 transition-all",
        // Hover subtil : leger lift + shadow renforcee, durees via tokens
        // motion. Le translate-y respecte prefers-reduced-motion (a evaluer
        // en RG-26).
        "hover:-translate-y-px hover:shadow-[var(--shadow-md)]",
        variantStyles[variant]
      )}
      style={{
        boxShadow: "var(--shadow-card)",
        transitionDuration: "var(--duration-fast)",
        transitionTimingFunction: "var(--ease-out)",
      }}
    >
      {title && (
        <h3 className="mb-3 text-lg font-semibold text-[color:var(--fg-primary)]">
          {title}
        </h3>
      )}
      <div className="text-sm leading-relaxed text-[color:var(--fg-secondary)]">
        {children}
      </div>
    </div>
  );
}
