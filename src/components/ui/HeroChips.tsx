import { Sparkles, Zap, Shield } from "lucide-react";

/**
 * RG2-11 — Chips orbitaux flottants autour du HeroTerminal.
 *
 * 3 pills positionnees absolutes autour du terminal hero (top-left,
 * middle-right, bottom-left), animees via keyframe `lp-float` 7s
 * ease-in-out infinite avec delays 0s / 1.3s / 2.6s pour qu'elles
 * flottent en decale.
 *
 * Mobile (< 1024px) : caches via `lg:block` parent — encombrement
 * visuel inutile sur petit ecran. `prefers-reduced-motion: reduce`
 * neutralise l'animation via le wrapper global dans globals.css.
 *
 * Source : `design-source/.../landing.css` `.lp-chip-orbit`,
 * `.lp-chip-a/b/c`, `@keyframes lp-float`.
 */
export function HeroChips() {
  return (
    <>
      {/* Chip A : top-left, cyan, "MCP" */}
      <span
        className="lp-chip lp-chip-a hidden lg:inline-flex"
        style={{ animationDelay: "0s" }}
      >
        <span className="lp-chip-ic" style={{ background: "var(--brand-primary)" }}>
          <Sparkles aria-hidden="true" className="h-3.5 w-3.5" />
        </span>
        <span>MCP</span>
      </span>

      {/* Chip B : middle-right, ambre, "Skills" */}
      <span
        className="lp-chip lp-chip-b hidden lg:inline-flex"
        style={{ animationDelay: "1.3s" }}
      >
        <span className="lp-chip-ic" style={{ background: "var(--color-accent-500)" }}>
          <Zap aria-hidden="true" className="h-3.5 w-3.5" />
        </span>
        <span>Skills</span>
      </span>

      {/* Chip C : bottom-left, success, "Agents" */}
      <span
        className="lp-chip lp-chip-c hidden lg:inline-flex"
        style={{ animationDelay: "2.6s" }}
      >
        <span className="lp-chip-ic" style={{ background: "var(--color-success)" }}>
          <Shield aria-hidden="true" className="h-3.5 w-3.5" />
        </span>
        <span>Agents</span>
      </span>
    </>
  );
}
