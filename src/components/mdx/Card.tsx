import clsx from "clsx";

interface CardProps {
  readonly title?: string;
  readonly variant?: "default" | "accent" | "highlight";
  readonly children: React.ReactNode;
}

const variantStyles = {
  default:
    "border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800",
  accent:
    "border-brand-500/30 bg-brand-50 dark:border-brand-500/20 dark:bg-brand-950",
  highlight:
    "border-accent-500/30 bg-accent-50 dark:border-accent-500/20 dark:bg-accent-950",
};

export function Card({ title, variant = "default", children }: CardProps) {
  return (
    <div
      className={clsx(
        "my-4 rounded-xl border p-6",
        variantStyles[variant]
      )}
    >
      {title && (
        <h3 className="mb-3 text-lg font-semibold text-slate-900 dark:text-white">
          {title}
        </h3>
      )}
      <div className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
        {children}
      </div>
    </div>
  );
}
