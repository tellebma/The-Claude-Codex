import type { ReactNode } from "react";

interface CtaFinalProps {
  readonly badge?: string;
  readonly title: string;
  readonly titleHighlight?: string;
  readonly description: string;
  /** Bouton(s) d'action — generalement un primaire + un secondaire. */
  readonly actions: ReactNode;
}

/**
 * RG2-16 — CTA final pattern dedie (lp-cta-final).
 *
 * Section finale imposante avec atmosphere brand : radial gradient + grid
 * pattern masque radial pour creer une halo douce qui guide vers l'action.
 *
 * Atmosphere :
 * - padding 120/32 (vertical/horizontal)
 * - ::before radial brand 60% center + linear (light: f8fafc -> ecfeff,
 *   dark: 060912 -> 0a1620)
 * - ::after grid pattern brand 8% avec mask radial 60% center
 * - title clamp(40px, 5vw, 64px) / 800 / -0.03em / 1.05
 * - sub 19px / 1.6 secondary max-width 580
 * - badge pill brand-700 avec bg brand-500/10 border brand-500/25
 *
 * Source design : `landing.css` `.lp-cta-final`, `.lp-cta-inner`,
 * `.lp-cta-title`, `.lp-cta-sub`, `.lp-cta-badge`.
 */
export function CtaFinal({
  badge,
  title,
  titleHighlight,
  description,
  actions,
}: Readonly<CtaFinalProps>) {
  return (
    <section className="lp-cta-final relative isolate overflow-hidden px-8 py-32 sm:py-32 lg:py-40">
      {/* ::before — radial brand au centre + linear soft */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_60%_at_50%_50%,rgba(6,182,212,0.15),transparent_70%),linear-gradient(180deg,var(--bg-page)_0%,var(--bg-subtle)_100%)] dark:bg-[radial-gradient(ellipse_60%_60%_at_50%_50%,rgba(34,211,238,0.18),transparent_70%),linear-gradient(180deg,var(--bg-page)_0%,var(--bg-subtle)_100%)]"
      />
      {/* ::after — grid pattern brand 8% avec mask radial centre */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-0 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,black,transparent_75%)] [-webkit-mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,black,transparent_75%)]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(6,182,212,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.08) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="lp-cta-inner relative mx-auto max-w-[820px] text-center">
        {badge && (
          <span className="lp-cta-badge inline-flex items-center gap-2.5 rounded-full border border-[color:rgba(6,182,212,0.25)] bg-[color:rgba(6,182,212,0.1)] px-4 py-2 text-[13px] font-semibold text-[color:var(--color-brand-700)]">
            {badge}
          </span>
        )}
        <h2
          className="lp-cta-title my-6 text-balance font-extrabold leading-[1.05] tracking-[-0.03em] text-[color:var(--fg-primary)]"
          style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}
        >
          {title}{" "}
          {titleHighlight && (
            <span className="text-gradient">{titleHighlight}</span>
          )}
        </h2>
        <p className="lp-cta-sub mx-auto mb-9 max-w-[580px] text-pretty text-[19px] leading-[1.6] text-[color:var(--fg-secondary)]">
          {description}
        </p>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          {actions}
        </div>
      </div>
    </section>
  );
}
