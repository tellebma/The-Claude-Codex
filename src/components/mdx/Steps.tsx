interface StepsProps {
  readonly children: React.ReactNode;
}

interface StepProps {
  readonly title: string;
  readonly stepNumber?: number;
  readonly isLast?: boolean;
  /**
   * Variante visuelle du badge :
   * - "default" : gradient cyan -> ambre (--gradient-brand), defaut
   * - "security" : gradient rouge -> ambre, pour les articles securite
   *   (alerte critique, plan d'action urgent, etc.)
   */
  readonly variant?: "default" | "security";
  readonly children: React.ReactNode;
}

export function Steps({ children }: Readonly<StepsProps>) {
  return <div className="my-8 space-y-8">{children}</div>;
}

/**
 * RG2-04 — Etape numerotee dans un Steps.
 *
 * Le badge num est un carre 56x56 radius 14 (vs cercle 40x40 avant) avec
 * gradient cyan -> ambre + shadow brand subtle, mono 22px / 800. Aligne
 * avec le source design article.css `.art-step` / `.art-step-num`.
 *
 * Pass `isLast` on the final step to suppress the connecting line.
 */
export function Step({
  title,
  stepNumber,
  isLast = false,
  variant = "default",
  children,
}: Readonly<StepProps>) {
  const gradient =
    variant === "security"
      ? "linear-gradient(135deg, var(--color-error), var(--color-accent-500))"
      : "var(--gradient-brand)";

  return (
    <div className="art-step flex gap-4 sm:gap-6">
      <div className="flex shrink-0 flex-col items-center">
        {stepNumber !== undefined && (
          <div
            className="art-step-num flex h-14 w-14 items-center justify-center rounded-2xl font-mono text-[22px] font-extrabold text-[color:var(--fg-on-brand)]"
            style={{
              backgroundImage: gradient,
              boxShadow: "0 8px 20px -8px rgba(6, 182, 212, 0.5)",
            }}
          >
            {stepNumber}
          </div>
        )}
        {!isLast && (
          <div className="mt-2 h-full w-px bg-[color:var(--border-default)]" />
        )}
      </div>
      <div className="min-w-0 flex-1 pb-6">
        <h3 className="text-lg font-bold text-[color:var(--fg-primary)]">
          {title}
        </h3>
        <div className="mt-2 leading-relaxed text-[color:var(--fg-secondary)]">
          {children}
        </div>
      </div>
    </div>
  );
}
