import clsx from "clsx";

interface SkeletonProps {
  readonly className?: string;
  readonly variant?: "text" | "card" | "circle";
}

export function Skeleton({ className, variant = "text" }: SkeletonProps) {
  const baseClasses =
    "animate-shimmer bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 bg-[length:200%_100%] rounded-md";

  const variantClasses = {
    text: "h-4 w-full",
    card: "h-48 w-full rounded-2xl",
    circle: "h-12 w-12 rounded-full",
  };

  return (
    <div
      className={clsx(baseClasses, variantClasses[variant], className)}
      aria-hidden="true"
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="glass-card space-y-4 p-6" aria-hidden="true">
      <Skeleton variant="circle" />
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
    </div>
  );
}
