import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import {
  DSSection,
  RadiusBox,
  SemanticTokenRow,
  ShadowCard,
  StatusPill,
  SurfaceCard,
  Swatch,
  TypeSample,
} from "./_components";
import { AnalyticsTracker } from "@/components/layout/AnalyticsTracker";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

/**
 * Page interne RG-04 : showcase exhaustif des tokens C1 (couleurs, typo,
 * surfaces, callouts, radius, shadows, motion). Hors index public, hors nav.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "designSystem" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    robots: { index: false, follow: false, nocache: true },
    alternates: { canonical: undefined },
  };
}

/* -------------------------------------------------------------------------- */
/*  Donnees statiques tokenisees (referentiels C1)                            */
/* -------------------------------------------------------------------------- */

const PALETTE_STEPS = [
  "50",
  "100",
  "200",
  "300",
  "400",
  "500",
  "600",
  "700",
  "800",
  "900",
  "950",
] as const;

const BRAND_HEX: Record<(typeof PALETTE_STEPS)[number], string> = {
  "50": "#ecfeff",
  "100": "#cffafe",
  "200": "#a5f3fc",
  "300": "#67e8f9",
  "400": "#22d3ee",
  "500": "#06b6d4",
  "600": "#0891b2",
  "700": "#0e7490",
  "800": "#155e75",
  "900": "#164e63",
  "950": "#083344",
};

const ACCENT_HEX: Record<(typeof PALETTE_STEPS)[number], string> = {
  "50": "#fffbeb",
  "100": "#fef3c7",
  "200": "#fde68a",
  "300": "#fcd34d",
  "400": "#fbbf24",
  "500": "#f59e0b",
  "600": "#d97706",
  "700": "#b45309",
  "800": "#92400e",
  "900": "#78350f",
  "950": "#451a03",
};

const SLATE_HEX: Record<(typeof PALETTE_STEPS)[number], string> = {
  "50": "#f8fafc",
  "100": "#f1f5f9",
  "200": "#e2e8f0",
  "300": "#cbd5e1",
  "400": "#94a3b8",
  "500": "#64748b",
  "600": "#475569",
  "700": "#334155",
  "800": "#1e293b",
  "900": "#0f172a",
  "950": "#020617",
};

// Palier a partir duquel le texte doit etre clair pour rester lisible
const DARK_TEXT_THRESHOLD = 400;

function isDarkSwatch(step: string): boolean {
  const stepNum = Number(step);
  return Number.isFinite(stepNum) && stepNum >= DARK_TEXT_THRESHOLD;
}

const TYPO_SAMPLES = [
  { className: "cc-display-1", varName: "--text-display-1", trackingKey: "tight" },
  { className: "cc-display-2", varName: "--text-display-2", trackingKey: "tight" },
  { className: "cc-h1", varName: "--text-h1", trackingKey: "tight" },
  { className: "cc-h1-doc", varName: "--text-h1-doc", trackingKey: "tightDoc" },
  { className: "cc-h2", varName: "--text-h2", trackingKey: "tight2" },
  { className: "cc-h2-article", varName: "--text-h2-article", trackingKey: "tight2" },
  { className: "cc-h2-doc", varName: "--text-h2-doc", trackingKey: "tight2" },
  { className: "cc-h3", varName: "--text-h3", trackingKey: "tightSmall" },
  { className: "cc-h4", varName: "--text-h4", trackingKey: "normal" },
  { className: "cc-lead", varName: "--text-lead", trackingKey: "normal" },
  { className: "cc-body", varName: "--text-body", trackingKey: "normal" },
  { className: "cc-body-sm", varName: "--text-body-sm", trackingKey: "normal" },
  { className: "cc-caption", varName: "--text-caption", trackingKey: "normal" },
  { className: "cc-eyebrow", varName: "--text-eyebrow", trackingKey: "wide" },
] as const;

const SEMANTIC_BG_TOKENS = [
  { token: "--bg-page", usage: "semantic.bgPageUsage" },
  { token: "--bg-subtle", usage: "semantic.bgSubtleUsage" },
  { token: "--bg-elevated", usage: "semantic.bgElevatedUsage" },
] as const;

const SEMANTIC_FG_TOKENS = [
  { token: "--fg-primary", usage: "semantic.fgPrimaryUsage" },
  { token: "--fg-secondary", usage: "semantic.fgSecondaryUsage" },
  { token: "--fg-muted", usage: "semantic.fgMutedUsage" },
  { token: "--fg-on-brand", usage: "semantic.fgOnBrandUsage" },
] as const;

const SEMANTIC_BORDER_TOKENS = [
  { token: "--border-subtle", usage: "semantic.borderSubtleUsage" },
  { token: "--border-default", usage: "semantic.borderDefaultUsage" },
  { token: "--border-strong", usage: "semantic.borderStrongUsage" },
] as const;

const SEMANTIC_BRAND_TOKENS = [
  { token: "--brand-primary", usage: "semantic.brandPrimaryUsage" },
  { token: "--brand-hover", usage: "semantic.brandHoverUsage" },
  { token: "--brand-700", usage: "semantic.brand700Usage" },
  { token: "--brand-800", usage: "semantic.brand800Usage" },
] as const;

const RADIUS_TOKENS = [
  { var: "--radius-xs", label: "xs · 0.25rem" },
  { var: "--radius-sm", label: "sm · 0.375rem" },
  { var: "--radius-md", label: "md · 0.5rem" },
  { var: "--radius-lg", label: "lg · 0.75rem" },
  { var: "--radius-xl", label: "xl · 1rem" },
  { var: "--radius-2xl", label: "2xl · 1.25rem" },
  { var: "--radius-full", label: "full · 9999px" },
] as const;

const SHADOW_TOKENS = [
  { var: "--shadow-xs", label: "xs" },
  { var: "--shadow-sm", label: "sm" },
  { var: "--shadow-md", label: "md" },
  { var: "--shadow-lg", label: "lg" },
  { var: "--shadow-xl", label: "xl" },
  { var: "--shadow-2xl", label: "2xl" },
] as const;

const MOTION_TOKENS = [
  { var: "--duration-instant", value: "80ms" },
  { var: "--duration-fast", value: "150ms" },
  { var: "--duration-base", value: "300ms" },
  { var: "--duration-slow", value: "500ms" },
  { var: "--duration-slower", value: "700ms" },
  { var: "--ease-out", value: "cubic-bezier(0.16, 1, 0.3, 1)" },
  { var: "--ease-in-out", value: "cubic-bezier(0.4, 0, 0.6, 1)" },
  { var: "--ease-spring", value: "cubic-bezier(0.34, 1.56, 0.64, 1)" },
] as const;

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default async function DesignSystemPage({
  params,
}: Readonly<{
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "designSystem" });

  return (
    <div className="cc-surface-page">
      <AnalyticsTracker />
      {/* ===== HERO ===== */}
      <header className="border-b border-[var(--border-subtle)] bg-[var(--bg-subtle)]">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
          <p className="cc-eyebrow mb-4">{t("hero.eyebrow")}</p>
          <h1 className="cc-display-1 max-w-3xl">{t("hero.title")}</h1>
          <p className="cc-lead mt-6 max-w-2xl">{t("hero.subtitle")}</p>
          <p className="cc-caption mt-6 max-w-2xl">{t("hero.notice")}</p>
        </div>
      </header>

      {/* ===== TYPOGRAPHIE ===== */}
      <DSSection
        id="typography"
        eyebrow={t("typography.eyebrow")}
        title={t("typography.title")}
        description={t("typography.description")}
      >
        <ul className="space-y-3">
          {TYPO_SAMPLES.map((sample) => (
            <TypeSample
              key={sample.className}
              className={sample.className}
              sample={t(`typography.sample.${sample.className}`)}
              varName={sample.varName}
              notes={t(`typography.tracking.${sample.trackingKey}`)}
            />
          ))}
        </ul>
      </DSSection>

      {/* ===== PALETTES ===== */}
      <DSSection
        id="palettes"
        eyebrow={t("palettes.eyebrow")}
        title={t("palettes.title")}
        description={t("palettes.description")}
      >
        <div className="space-y-10">
          <div>
            <h3 className="cc-h3 mb-4">{t("palettes.brand")}</h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-11">
              {PALETTE_STEPS.map((step) => (
                <Swatch
                  key={`brand-${step}`}
                  name={`brand-${step}`}
                  hex={BRAND_HEX[step]}
                  textOnDark={isDarkSwatch(step)}
                />
              ))}
            </div>
          </div>

          <div>
            <h3 className="cc-h3 mb-4">{t("palettes.accent")}</h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-11">
              {PALETTE_STEPS.map((step) => (
                <Swatch
                  key={`accent-${step}`}
                  name={`accent-${step}`}
                  hex={ACCENT_HEX[step]}
                  textOnDark={isDarkSwatch(step)}
                />
              ))}
            </div>
          </div>

          <div>
            <h3 className="cc-h3 mb-4">{t("palettes.slate")}</h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-11">
              {PALETTE_STEPS.map((step) => (
                <Swatch
                  key={`slate-${step}`}
                  name={`slate-${step}`}
                  hex={SLATE_HEX[step]}
                  textOnDark={isDarkSwatch(step)}
                />
              ))}
            </div>
          </div>
        </div>
      </DSSection>

      {/* ===== TOKENS SEMANTIQUES ===== */}
      <DSSection
        id="semantic"
        eyebrow={t("semantic.eyebrow")}
        title={t("semantic.title")}
        description={t("semantic.description")}
      >
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <h3 className="cc-h3 mb-4">{t("semantic.bgGroup")}</h3>
            <ul className="space-y-3">
              {SEMANTIC_BG_TOKENS.map((row) => (
                <SemanticTokenRow
                  key={row.token}
                  token={row.token}
                  usage={t(row.usage)}
                  swatchStyle={{
                    backgroundColor: `var(${row.token})`,
                    borderColor: "var(--border-strong)",
                  }}
                  border
                />
              ))}
            </ul>
          </div>

          <div>
            <h3 className="cc-h3 mb-4">{t("semantic.fgGroup")}</h3>
            <ul className="space-y-3">
              {SEMANTIC_FG_TOKENS.map((row) => (
                <SemanticTokenRow
                  key={row.token}
                  token={row.token}
                  usage={t(row.usage)}
                  swatchStyle={{
                    backgroundColor: `var(${row.token})`,
                    borderColor: "var(--border-strong)",
                  }}
                  border
                />
              ))}
            </ul>
          </div>

          <div>
            <h3 className="cc-h3 mb-4">{t("semantic.borderGroup")}</h3>
            <ul className="space-y-3">
              {SEMANTIC_BORDER_TOKENS.map((row) => (
                <SemanticTokenRow
                  key={row.token}
                  token={row.token}
                  usage={t(row.usage)}
                  swatchStyle={{
                    backgroundColor: "var(--bg-page)",
                    borderColor: `var(${row.token})`,
                    borderStyle: "solid",
                  }}
                  border
                />
              ))}
            </ul>
          </div>

          <div>
            <h3 className="cc-h3 mb-4">{t("semantic.brandGroup")}</h3>
            <ul className="space-y-3">
              {SEMANTIC_BRAND_TOKENS.map((row) => (
                <SemanticTokenRow
                  key={row.token}
                  token={row.token}
                  usage={t(row.usage)}
                  swatchStyle={{ backgroundColor: `var(${row.token})` }}
                />
              ))}
            </ul>
          </div>
        </div>
      </DSSection>

      {/* ===== SURFACES ===== */}
      <DSSection
        id="surfaces"
        eyebrow={t("surfaces.eyebrow")}
        title={t("surfaces.title")}
        description={t("surfaces.description")}
      >
        <div className="grid gap-4 md:grid-cols-3">
          <SurfaceCard
            surfaceClass="cc-surface-page"
            label={t("surfaces.page")}
            token="--bg-page"
            description={t("surfaces.pageUsage")}
          />
          <SurfaceCard
            surfaceClass="cc-surface-subtle"
            label={t("surfaces.subtle")}
            token="--bg-subtle"
            description={t("surfaces.subtleUsage")}
          />
          <SurfaceCard
            surfaceClass="cc-surface-elevated"
            label={t("surfaces.elevated")}
            token="--bg-elevated"
            description={t("surfaces.elevatedUsage")}
          />
        </div>
      </DSSection>

      {/* ===== STATUTS ===== */}
      <DSSection
        id="status"
        eyebrow={t("status.eyebrow")}
        title={t("status.title")}
        description={t("status.description")}
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatusPill
            label={t("status.success")}
            token="--color-success"
            varName="--color-success"
          />
          <StatusPill
            label={t("status.warning")}
            token="--color-warning"
            varName="--color-warning"
          />
          <StatusPill
            label={t("status.error")}
            token="--color-error"
            varName="--color-error"
          />
          <StatusPill
            label={t("status.info")}
            token="--color-info"
            varName="--color-info"
          />
        </div>
      </DSSection>

      {/* ===== CARTES ===== */}
      <DSSection
        id="cards"
        eyebrow={t("cards.eyebrow")}
        title={t("cards.title")}
        description={t("cards.description")}
      >
        <div className="grid gap-6 md:grid-cols-2">
          <article className="cc-card p-6">
            <p className="cc-eyebrow mb-2">{t("cards.staticLabel")}</p>
            <h3 className="cc-h3">.cc-card</h3>
            <p className="cc-body-sm mt-3">{t("cards.staticDescription")}</p>
          </article>
          <article className="cc-card p-6" data-interactive="true">
            <p className="cc-eyebrow mb-2">{t("cards.interactiveLabel")}</p>
            <h3 className="cc-h3">.cc-card[data-interactive]</h3>
            <p className="cc-body-sm mt-3">
              {t("cards.interactiveDescription")}
            </p>
          </article>
        </div>
      </DSSection>

      {/* ===== CALLOUTS ===== */}
      <DSSection
        id="callouts"
        eyebrow={t("callouts.eyebrow")}
        title={t("callouts.title")}
        description={t("callouts.description")}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="cc-callout cc-callout-info">
            <p className="font-semibold">{t("callouts.info.title")}</p>
            <p className="cc-body-sm mt-1">{t("callouts.info.body")}</p>
          </div>
          <div className="cc-callout cc-callout-tip">
            <p className="font-semibold">{t("callouts.tip.title")}</p>
            <p className="cc-body-sm mt-1">{t("callouts.tip.body")}</p>
          </div>
          <div className="cc-callout cc-callout-warning">
            <p className="font-semibold">{t("callouts.warning.title")}</p>
            <p className="cc-body-sm mt-1">{t("callouts.warning.body")}</p>
          </div>
          <div className="cc-callout cc-callout-error">
            <p className="font-semibold">{t("callouts.error.title")}</p>
            <p className="cc-body-sm mt-1">{t("callouts.error.body")}</p>
          </div>
        </div>
      </DSSection>

      {/* ===== RADIUS ===== */}
      <DSSection
        id="radius"
        eyebrow={t("radius.eyebrow")}
        title={t("radius.title")}
        description={t("radius.description")}
      >
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 lg:grid-cols-7">
          {RADIUS_TOKENS.map((r) => (
            <RadiusBox key={r.var} varName={r.var} label={r.label} />
          ))}
        </div>
      </DSSection>

      {/* ===== SHADOWS ===== */}
      <DSSection
        id="shadows"
        eyebrow={t("shadows.eyebrow")}
        title={t("shadows.title")}
        description={t("shadows.description")}
      >
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {SHADOW_TOKENS.map((s) => (
            <ShadowCard key={s.var} varName={s.var} label={s.label} />
          ))}
          <div className="flex flex-col items-center gap-3">
            <div
              aria-hidden="true"
              className="h-24 w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)]"
              style={{ boxShadow: "var(--glow-brand)" }}
            />
            <div className="text-center">
              <p className="font-mono text-[0.75rem] text-[var(--fg-primary)]">
                glow-brand
              </p>
              <p className="font-mono text-[0.7rem] text-[var(--fg-muted)]">
                --glow-brand
              </p>
            </div>
          </div>
          <div className="flex flex-col items-center gap-3">
            <div
              aria-hidden="true"
              className="h-24 w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)]"
              style={{ boxShadow: "var(--glow-amber)" }}
            />
            <div className="text-center">
              <p className="font-mono text-[0.75rem] text-[var(--fg-primary)]">
                glow-amber
              </p>
              <p className="font-mono text-[0.7rem] text-[var(--fg-muted)]">
                --glow-amber
              </p>
            </div>
          </div>
        </div>
      </DSSection>

      {/* ===== MOTION ===== */}
      <DSSection
        id="motion"
        eyebrow={t("motion.eyebrow")}
        title={t("motion.title")}
        description={t("motion.description")}
      >
        <div className="grid gap-6 md:grid-cols-3">
          <article
            className="ds-motion-card group rounded-2xl border border-[var(--border-default)] bg-[var(--bg-elevated)] p-6 shadow-[var(--shadow-card)]"
            style={{
              transitionProperty: "transform, box-shadow",
              transitionDuration: "var(--duration-base)",
              transitionTimingFunction: "var(--ease-out)",
            }}
          >
            <p className="cc-eyebrow mb-2">{t("motion.hoverLabel")}</p>
            <h3 className="cc-h3">{t("motion.hoverTitle")}</h3>
            <p className="cc-body-sm mt-3">{t("motion.hoverBody")}</p>
            <p className="mt-4 font-mono text-[0.75rem] text-[var(--fg-muted)]">
              translateY(-3px) · var(--duration-base) · var(--ease-out)
            </p>
          </article>

          <ul className="md:col-span-2 grid gap-2 self-start">
            {MOTION_TOKENS.map((m) => (
              <li
                key={m.var}
                className="flex items-baseline justify-between gap-4 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-4 py-3"
              >
                <code className="font-mono text-[0.8rem] text-[var(--fg-primary)]">
                  {m.var}
                </code>
                <code className="font-mono text-[0.75rem] text-[var(--fg-secondary)]">
                  {m.value}
                </code>
              </li>
            ))}
          </ul>
        </div>

        <p className="cc-caption mt-8 max-w-2xl">{t("motion.reducedMotion")}</p>
      </DSSection>

      {/* Hover behavior pour la carte motion : implementee via :hover sans JS */}
      <style>{`
        .ds-motion-card:hover {
          transform: translateY(-3px);
          box-shadow: var(--shadow-md);
        }
        @media (prefers-reduced-motion: reduce) {
          .ds-motion-card:hover {
            transform: none;
          }
        }
      `}</style>
    </div>
  );
}
