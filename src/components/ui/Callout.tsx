"use client";

import { Info, Lightbulb, AlertTriangle } from "lucide-react";
import { useTranslations } from "next-intl";
import clsx from "clsx";

interface CalloutProps {
  type?: "info" | "tip" | "warning";
  title?: string;
  children: React.ReactNode;
}

const styles = {
  info: {
    container: "border-brand-500/30 bg-brand-500/5",
    icon: "text-brand-700 dark:text-brand-400",
    IconComponent: Info,
  },
  tip: {
    container: "border-emerald-500/30 bg-emerald-500/5",
    icon: "text-emerald-700 dark:text-emerald-400",
    IconComponent: Lightbulb,
  },
  warning: {
    container: "border-amber-500/30 bg-amber-500/5",
    icon: "text-amber-700 dark:text-amber-400",
    IconComponent: AlertTriangle,
  },
};

export function Callout({ type = "info", title, children }: CalloutProps) {
  const style = styles[type];
  const { IconComponent } = style;
  const t = useTranslations("callout");

  return (
    <aside
      aria-label={title ?? t(type)}
      className={clsx(
        "my-6 rounded-xl border-l-4 p-4",
        style.container
      )}
    >
      <div className="flex items-start gap-3">
        <IconComponent className={clsx("mt-0.5 h-5 w-5 shrink-0", style.icon)} aria-hidden="true" />
        <div>
          <p className="mb-1 font-semibold">{title ?? t(type)}</p>
          <div className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            {children}
          </div>
        </div>
      </div>
    </aside>
  );
}
