import clsx from "clsx";

interface SectionHeadingProps {
  badge?: string;
  title: string;
  description?: string;
  centered?: boolean;
}

export function SectionHeading({
  badge,
  title,
  description,
  centered = true,
}: Readonly<SectionHeadingProps>) {
  return (
    <div className={clsx("max-w-3xl", centered && "mx-auto text-center")}>
      {badge && (
        <span className="mb-3 inline-block rounded-full bg-brand-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[color:var(--brand-primary)]">
          {badge}
        </span>
      )}
      <h2 className="text-display-2 font-bold tracking-tight text-[color:var(--fg-primary)]">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-lead text-[color:var(--fg-secondary)]">
          {description}
        </p>
      )}
    </div>
  );
}
