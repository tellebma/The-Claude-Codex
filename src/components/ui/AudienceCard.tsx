import type { LucideIcon } from "lucide-react";

interface AudienceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function AudienceCard({ icon: Icon, title, description }: Readonly<AudienceCardProps>) {
  return (
    <div
      className="flex items-start gap-4 rounded-2xl border border-[color:var(--border-default)] bg-[color:var(--bg-elevated)] p-5 transition-all hover:-translate-y-px hover:shadow-[var(--shadow-md)]"
      style={{
        boxShadow: "var(--shadow-card)",
        transitionDuration: "var(--duration-fast)",
        transitionTimingFunction: "var(--ease-out)",
      }}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-brand-100 to-accent-50">
        <Icon className="h-5 w-5 text-brand-700" aria-hidden="true" />
      </div>
      <div>
        <h3 className="font-semibold text-[color:var(--fg-primary)]">{title}</h3>
        <p className="mt-1 text-base text-[color:var(--fg-secondary)]">
          {description}
        </p>
      </div>
    </div>
  );
}
