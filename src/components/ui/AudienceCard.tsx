import type { LucideIcon } from "lucide-react";

interface AudienceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function AudienceCard({ icon: Icon, title, description }: AudienceCardProps) {
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-slate-200/50 bg-white/50 p-5 transition-all duration-300 hover:border-brand-500/30 hover:shadow-md dark:border-slate-700/50 dark:bg-slate-800/50">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500/20 to-accent-500/10">
        <Icon className="h-5 w-5 text-brand-500" />
      </div>
      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {description}
        </p>
      </div>
    </div>
  );
}
