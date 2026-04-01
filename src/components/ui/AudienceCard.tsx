import type { LucideIcon } from "lucide-react";

interface AudienceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function AudienceCard({ icon: Icon, title, description }: AudienceCardProps) {
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:shadow-none">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-brand-100 to-accent-50">
        <Icon className="h-5 w-5 text-brand-700 dark:text-brand-400" aria-hidden="true" />
      </div>
      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="mt-1 text-base text-slate-600 dark:text-slate-300">
          {description}
        </p>
      </div>
    </div>
  );
}
