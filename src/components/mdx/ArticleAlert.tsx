import { AlertTriangle, Info, AlertCircle, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type ArticleAlertVariant = "urgent" | "info" | "warning";

interface ArticleAlertProps {
  readonly variant?: ArticleAlertVariant;
  readonly title?: string;
  readonly children: ReactNode;
}

interface VariantStyle {
  readonly container: string;
  readonly icon: string;
  readonly Icon: LucideIcon;
  readonly defaultRole: "alert" | "status";
}

const VARIANT_STYLES: Record<ArticleAlertVariant, VariantStyle> = {
  urgent: {
    container:
      "bg-[linear-gradient(135deg,rgba(239,68,68,0.10),rgba(245,158,11,0.06))] border-[color:rgba(239,68,68,0.3)] shadow-[0_0_40px_-16px_rgba(239,68,68,0.4)] dark:bg-[linear-gradient(135deg,rgba(239,68,68,0.15),rgba(245,158,11,0.08))] dark:border-[color:rgba(239,68,68,0.4)]",
    icon: "bg-[color:rgba(239,68,68,0.15)] text-[color:var(--color-error)] dark:bg-[color:rgba(239,68,68,0.2)] dark:text-[color:rgba(252,165,165,1)]",
    Icon: AlertCircle,
    defaultRole: "alert",
  },
  info: {
    container:
      "bg-[color:rgba(6,182,212,0.06)] border-[color:rgba(6,182,212,0.2)] dark:bg-[color:rgba(34,211,238,0.08)] dark:border-[color:rgba(34,211,238,0.25)]",
    icon: "bg-[color:rgba(6,182,212,0.15)] text-[color:var(--color-brand-700)] dark:bg-[color:rgba(34,211,238,0.15)] dark:text-[color:rgba(103,232,249,1)]",
    Icon: Info,
    defaultRole: "status",
  },
  warning: {
    container:
      "bg-[color:rgba(245,158,11,0.06)] border-[color:rgba(245,158,11,0.25)] dark:bg-[color:rgba(245,158,11,0.10)] dark:border-[color:rgba(245,158,11,0.3)]",
    icon: "bg-[color:rgba(245,158,11,0.15)] text-[color:rgba(180,83,9,1)] dark:bg-[color:rgba(245,158,11,0.18)] dark:text-[color:rgba(251,191,36,1)]",
    Icon: AlertTriangle,
    defaultRole: "status",
  },
};

/**
 * RG2-06 — Alerte editoriale avancee pour articles longs (securite, urgence,
 * info contextuelle, warning critique).
 *
 * Variantes :
 * - `urgent` : gradient rouge/amber + glow rouge subtil, role=alert
 * - `info` : cyan, role=status
 * - `warning` : amber, role=status
 *
 * Le composant `<Callout>` existant garde son role pour les notes legeres
 * dans la doc ; `<ArticleAlert>` est destine aux articles editoriaux ou
 * un ton plus fort est requis (ex : "Cle API fuitee").
 *
 * Source design : `article.css` `.art-alert`, `.art-alert.is-urgent`,
 * `.art-alert-ic`, `.art-alert-title`, `.art-alert-text`.
 */
export function ArticleAlert({
  variant = "info",
  title,
  children,
}: Readonly<ArticleAlertProps>) {
  const style = VARIANT_STYLES[variant];
  const { Icon } = style;

  return (
    <div
      role={style.defaultRole}
      className={`my-7 flex gap-4 overflow-hidden rounded-2xl border px-6 py-5 ${style.container}`}
    >
      <span
        aria-hidden="true"
        className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${style.icon}`}
      >
        <Icon className="h-5 w-5" />
      </span>
      <div className="min-w-0 flex-1">
        {title && (
          <p className="mb-1.5 text-base font-bold text-[color:var(--fg-primary)]">
            {title}
          </p>
        )}
        <div className="text-[15px] leading-relaxed text-[color:var(--fg-primary)]">
          {children}
        </div>
      </div>
    </div>
  );
}
