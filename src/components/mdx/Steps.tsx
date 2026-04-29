interface StepsProps {
  readonly children: React.ReactNode;
}

interface StepProps {
  readonly title: string;
  readonly stepNumber?: number;
  readonly isLast?: boolean;
  readonly children: React.ReactNode;
}

export function Steps({ children }: StepsProps) {
  return (
    <div className="my-8 space-y-8">
      {children}
    </div>
  );
}

/**
 * Individual step in a Steps sequence.
 * Pass `isLast` on the final step to suppress the connecting line.
 */
export function Step({ title, stepNumber, isLast = false, children }: StepProps) {
  return (
    <div className="flex gap-4 sm:gap-6">
      <div className="flex shrink-0 flex-col items-center">
        {stepNumber !== undefined && (
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-[color:var(--fg-on-brand)] shadow-lg shadow-brand-500/25"
            style={{ backgroundImage: "var(--gradient-brand)" }}
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
