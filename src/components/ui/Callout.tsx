"use client";

import { Info, Lightbulb, AlertTriangle, CircleAlert } from "lucide-react";
import { useTranslations } from "next-intl";
import clsx from "clsx";

interface CalloutProps {
  type?: "info" | "tip" | "warning" | "error";
  title?: string;
  children: React.ReactNode;
}

// Chaque variante reutilise les utility classes `.cc-callout-*` definies
// dans globals.css (RG-03). Ces classes consomment les tokens semantiques
// --callout-*-bg / --callout-*-border / --callout-*-text qui basculent
// automatiquement en dark via la redefinition dans .dark{}, sans prefix
// Tailwind dark:.
const styles = {
  info: {
    container: "cc-callout-info",
    IconComponent: Info,
  },
  tip: {
    container: "cc-callout-tip",
    IconComponent: Lightbulb,
  },
  warning: {
    container: "cc-callout-warning",
    IconComponent: AlertTriangle,
  },
  error: {
    container: "cc-callout-error",
    IconComponent: CircleAlert,
  },
} as const;

export function Callout({ type = "info", title, children }: Readonly<CalloutProps>) {
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
        {/* IconComponent herite de la couleur du conteneur (currentColor sur les SVG lucide) */}
        <IconComponent className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
        <div>
          <p className="mb-1 font-semibold">{title ?? t(type)}</p>
          <div className="text-sm leading-relaxed text-[color:var(--fg-secondary)]">
            {children}
          </div>
        </div>
      </div>
    </aside>
  );
}
