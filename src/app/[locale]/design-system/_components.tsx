/**
 * Helpers locaux pour la page /design-system.
 * Tous server-side : pas d'interactivite JS, uniquement du CSS et des classes Tailwind / tokens.
 */

import type { CSSProperties, ReactNode } from "react";

/* -------------------------------------------------------------------------- */
/*  Section wrappers                                                          */
/* -------------------------------------------------------------------------- */

export function DSSection({
  id,
  eyebrow,
  title,
  description,
  children,
}: Readonly<{
  id: string;
  eyebrow: string;
  title: string;
  description?: string;
  children: ReactNode;
}>) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className="scroll-mt-24 border-t border-[var(--border-subtle)] py-16 first:border-t-0 sm:py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="mb-10 max-w-3xl">
          <p className="cc-eyebrow mb-3">{eyebrow}</p>
          <h2 id={`${id}-title`} className="cc-h2-article">
            {title}
          </h2>
          {description ? (
            <p className="cc-body-sm mt-3 max-w-2xl">{description}</p>
          ) : null}
        </header>
        {children}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Color swatch (palette)                                                    */
/* -------------------------------------------------------------------------- */

export function Swatch({
  name,
  hex,
  textOnDark,
}: Readonly<{
  name: string;
  hex: string;
  textOnDark: boolean;
}>) {
  return (
    <div className="overflow-hidden rounded-xl border border-[var(--border-default)] bg-[var(--bg-elevated)] shadow-[var(--shadow-xs)]">
      <div
        className="flex h-20 items-end p-3"
        style={{
          backgroundColor: hex,
          color: textOnDark ? "#ffffff" : "#0f172a",
        }}
      >
        <span className="font-mono text-[0.7rem] font-medium opacity-90">
          {hex}
        </span>
      </div>
      <div className="px-3 py-2">
        <p className="font-mono text-[0.75rem] text-[var(--fg-secondary)]">
          {name}
        </p>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Semantic token row (couleur + nom + usage)                                */
/* -------------------------------------------------------------------------- */

export function SemanticTokenRow({
  token,
  usage,
  swatchStyle,
  border = false,
}: Readonly<{
  token: string;
  usage: string;
  swatchStyle: CSSProperties;
  border?: boolean;
}>) {
  return (
    <li className="flex items-center gap-4 rounded-xl border border-[var(--border-default)] bg-[var(--bg-elevated)] p-3 shadow-[var(--shadow-xs)]">
      <span
        aria-hidden="true"
        className={`h-10 w-10 shrink-0 rounded-lg ${border ? "border-2" : ""}`}
        style={swatchStyle}
      />
      <div className="min-w-0 flex-1">
        <p className="truncate font-mono text-[0.8rem] font-medium text-[var(--fg-primary)]">
          {token}
        </p>
        <p className="truncate text-[0.8rem] text-[var(--fg-secondary)]">
          {usage}
        </p>
      </div>
    </li>
  );
}

/* -------------------------------------------------------------------------- */
/*  Surface card (page / subtle / elevated)                                   */
/* -------------------------------------------------------------------------- */

export function SurfaceCard({
  surfaceClass,
  label,
  token,
  description,
}: Readonly<{
  surfaceClass: string;
  label: string;
  token: string;
  description: string;
}>) {
  return (
    <div
      className={`${surfaceClass} flex h-full flex-col gap-3 rounded-2xl border border-[var(--border-default)] p-6`}
    >
      <span className="cc-eyebrow">{label}</span>
      <p className="font-mono text-[0.85rem] text-[var(--fg-primary)]">
        {token}
      </p>
      <p className="cc-body-sm">{description}</p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Status pill                                                                */
/* -------------------------------------------------------------------------- */

export function StatusPill({
  label,
  token,
  varName,
}: Readonly<{
  label: string;
  token: string;
  varName: string;
}>) {
  return (
    <div
      className="flex flex-col gap-2 rounded-xl border p-4"
      style={{
        borderColor: `var(${varName})`,
        backgroundColor: "var(--bg-elevated)",
      }}
    >
      <span
        className="inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold"
        style={{
          backgroundColor: `color-mix(in srgb, var(${varName}) 14%, transparent)`,
          color: `var(${varName})`,
        }}
      >
        <span
          aria-hidden="true"
          className="h-2 w-2 rounded-full"
          style={{ backgroundColor: `var(${varName})` }}
        />
        {label}
      </span>
      <p className="font-mono text-[0.75rem] text-[var(--fg-secondary)]">
        {token}
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Radius preview                                                            */
/* -------------------------------------------------------------------------- */

export function RadiusBox({
  varName,
  label,
}: Readonly<{ varName: string; label: string }>) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        aria-hidden="true"
        className="h-20 w-20 border border-[var(--border-strong)] bg-gradient-to-br from-[var(--brand-primary)] to-[var(--color-info)]"
        style={{ borderRadius: `var(${varName})` }}
      />
      <p className="font-mono text-[0.75rem] text-[var(--fg-primary)]">
        {label}
      </p>
      <p className="font-mono text-[0.7rem] text-[var(--fg-muted)]">
        {varName}
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Shadow preview                                                            */
/* -------------------------------------------------------------------------- */

export function ShadowCard({
  varName,
  label,
}: Readonly<{ varName: string; label: string }>) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div
        aria-hidden="true"
        className="h-24 w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)]"
        style={{ boxShadow: `var(${varName})` }}
      />
      <div className="text-center">
        <p className="font-mono text-[0.75rem] text-[var(--fg-primary)]">
          {label}
        </p>
        <p className="font-mono text-[0.7rem] text-[var(--fg-muted)]">
          {varName}
        </p>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Type sample                                                               */
/* -------------------------------------------------------------------------- */

export function TypeSample({
  className,
  sample,
  varName,
  notes,
}: Readonly<{
  className: string;
  sample: string;
  varName: string;
  notes: string;
}>) {
  return (
    <li className="flex flex-col gap-3 rounded-2xl border border-[var(--border-default)] bg-[var(--bg-elevated)] p-5 shadow-[var(--shadow-xs)] sm:flex-row sm:items-baseline sm:justify-between">
      <div className="min-w-0 flex-1">
        <p className={`${className} truncate`}>{sample}</p>
      </div>
      <div className="flex shrink-0 flex-col gap-0.5 sm:items-end">
        <code className="font-mono text-[0.75rem] text-[var(--fg-primary)]">
          .{className}
        </code>
        <code className="font-mono text-[0.7rem] text-[var(--fg-muted)]">
          {varName}
        </code>
        <p className="text-[0.75rem] text-[var(--fg-secondary)]">{notes}</p>
      </div>
    </li>
  );
}
