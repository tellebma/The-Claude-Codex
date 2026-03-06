import { Info, Lightbulb, AlertTriangle } from "lucide-react";
import clsx from "clsx";

interface CalloutProps {
  type?: "info" | "tip" | "warning";
  title?: string;
  children: React.ReactNode;
}

const styles = {
  info: {
    container: "border-brand-500/30 bg-brand-500/5",
    icon: "text-brand-500",
    IconComponent: Info,
    defaultTitle: "Information",
  },
  tip: {
    container: "border-emerald-500/30 bg-emerald-500/5",
    icon: "text-emerald-500",
    IconComponent: Lightbulb,
    defaultTitle: "Astuce",
  },
  warning: {
    container: "border-amber-500/30 bg-amber-500/5",
    icon: "text-amber-500",
    IconComponent: AlertTriangle,
    defaultTitle: "Attention",
  },
};

export function Callout({ type = "info", title, children }: CalloutProps) {
  const style = styles[type];
  const { IconComponent } = style;

  return (
    <div
      className={clsx(
        "my-6 rounded-xl border-l-4 p-4",
        style.container
      )}
      role="note"
    >
      <div className="flex items-start gap-3">
        <IconComponent className={clsx("mt-0.5 h-5 w-5 shrink-0", style.icon)} />
        <div>
          <p className="mb-1 font-semibold">{title ?? style.defaultTitle}</p>
          <div className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
