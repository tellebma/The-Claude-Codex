"use client";

import { useEffect, useRef, useState, useId } from "react";
import { useTheme } from "next-themes";

interface MermaidDiagramProps {
  readonly chart: string;
  readonly caption?: string;
  readonly ariaLabel?: string;
  readonly handDrawn?: boolean;
}

const DARK_VARS = {
  primaryColor: "#0891b2",
  primaryTextColor: "#e2e8f0",
  primaryBorderColor: "#06b6d4",
  lineColor: "#64748b",
  secondaryColor: "#1e293b",
  tertiaryColor: "#0f172a",
  noteBkgColor: "#1e293b",
  noteTextColor: "#e2e8f0",
  actorBkg: "#155e75",
  actorBorder: "#0e7490",
  actorTextColor: "#f1f5f9",
  signalColor: "#94a3b8",
  signalTextColor: "#e2e8f0",
} as const;

const LIGHT_VARS = {
  primaryColor: "#a5f3fc",
  primaryTextColor: "#0f172a",
  primaryBorderColor: "#0891b2",
  lineColor: "#334155",
  secondaryColor: "#e0f2fe",
  tertiaryColor: "#cffafe",
  noteBkgColor: "#e0f2fe",
  noteTextColor: "#0f172a",
  actorBkg: "#155e75",
  actorBorder: "#0e7490",
  actorTextColor: "#ffffff",
  signalColor: "#334155",
  signalTextColor: "#1e293b",
} as const;

/**
 * xychart-beta ignores Mermaid's themeCSS — apply per-node overrides after
 * the SVG is injected into the DOM. Extracted as a named function to keep
 * the main render effect readable (max 2 levels of nesting).
 */
function applyXyChartOverrides(container: HTMLElement, isDark: boolean): void {
  const bgRect = container.querySelector(".background") as SVGElement | null;
  if (bgRect) {
    bgRect.style.fill = isDark ? "#1e293b" : "#f8fafc";
  }

  container.querySelectorAll<SVGElement>(".line-plot-0 path").forEach((el) => {
    el.style.stroke = "#06b6d4";
    el.style.strokeWidth = "2.5";
  });

  const labelFill = isDark ? "#cbd5e1" : "#334155";
  container.querySelectorAll<SVGElement>(".label text").forEach((el) => {
    el.style.fill = labelFill;
  });

  const title = container.querySelector(
    ".chart-title text"
  ) as SVGElement | null;
  if (title) {
    title.style.fill = isDark ? "#e2e8f0" : "#0f172a";
    title.style.fontWeight = "600";
  }
}

/** CSS injected into the SVG to override Mermaid's defaults */
function getOverrideCss(isDark: boolean): string {
  if (isDark) {
    return `
      .messageText { fill: #e2e8f0 !important; font-weight: 500; }
      .messageLine0, .messageLine1 { stroke: #64748b !important; }
      .actor-line { stroke: #475569 !important; }
      text.actor { fill: #f1f5f9 !important; }
      .xychart-title { fill: #e2e8f0 !important; }
      .xychart-plot-line { stroke: #06b6d4 !important; stroke-width: 2.5; }
      .tick text, .axis-title { fill: #94a3b8 !important; }
      .tick line, .domain { stroke: #475569 !important; }
      .xychart-plot-band rect { fill: #0891b2 !important; }
    `;
  }
  return `
    .messageText { fill: #1e293b !important; font-weight: 500; }
    .messageLine0, .messageLine1 { stroke: #334155 !important; }
    .actor-line { stroke: #cbd5e1 !important; }
    text.actor { fill: #ffffff !important; }
    .activation0 { fill: #e0f2fe !important; stroke: #0891b2 !important; }
    .xychart-title { fill: #0f172a !important; }
    .xychart-plot-line { stroke: #0891b2 !important; stroke-width: 2.5; }
    .tick text, .axis-title { fill: #334155 !important; }
  `;
}

export function MermaidDiagram({
  chart,
  caption,
  ariaLabel,
  handDrawn,
}: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [rendered, setRendered] = useState(false);
  const { resolvedTheme } = useTheme();
  const uniqueId = useId().replaceAll(":", "-");
  const captionId = `mermaid-caption${uniqueId}`;

  const isDark = resolvedTheme === "dark";
  const accessibleName = ariaLabel ?? caption ?? "Diagram";

  useEffect(() => {
    setRendered(false);
    setError(null);

    let cancelled = false;

    async function renderChart() {
      try {
        const { default: mermaid } = await import("mermaid");
        if (cancelled) return;

        mermaid.initialize({
          startOnLoad: false,
          look: handDrawn ? "handDrawn" : "classic",
          theme: "base",
          fontFamily: "var(--font-jakarta), system-ui, sans-serif",
          themeVariables: isDark ? DARK_VARS : LIGHT_VARS,
          themeCSS: getOverrideCss(isDark),
        });

        const id = `mermaid${uniqueId}${Date.now()}`;
        const { svg } = await mermaid.render(id, chart);
        if (cancelled || !containerRef.current) return;

        containerRef.current.innerHTML = svg;
        applyXyChartOverrides(containerRef.current, isDark);
        setRendered(true);
      } catch (err) {
        if (!cancelled) setError(String(err));
      }
    }

    renderChart();

    return () => {
      cancelled = true;
    };
  }, [chart, isDark, uniqueId, handDrawn]);

  if (error) {
    return (
      <div
        role="alert"
        className="my-4 rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-400"
      >
        Erreur de rendu du diagramme.
      </div>
    );
  }

  /*
   * Accessibility: the <figure> provides the semantic grouping. Its
   * aria-label (or aria-labelledby pointing to the figcaption) gives
   * the diagram an accessible name that screen readers announce as a
   * single graphical unit. No role="img" on the inner <div> — Sonar
   * S6819 flags that pattern, and it's redundant with a labeled
   * <figure>.
   */
  return (
    <figure
      className="my-6"
      aria-label={caption ? undefined : accessibleName}
      aria-labelledby={caption ? captionId : undefined}
    >
      {!rendered && !error && (
        <div
          aria-hidden="true"
          className="h-32 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800"
        />
      )}
      {/*
       * Conteneur scrollable du SVG Mermaid. role="region" + tabIndex=0
       * est le pattern WAI-ARIA pour un bloc de contenu focusable au
       * clavier (utile quand le diagramme déborde horizontalement sur
       * mobile). Sonar S6845 accepte tabIndex sur un élément avec rôle
       * interactif / région explicite.
       */}
      <div
        ref={containerRef}
        role="region"
        tabIndex={0}
        aria-label={accessibleName}
        aria-hidden={!rendered}
        className={`overflow-x-auto rounded-xl border border-slate-200/50 bg-white p-6 dark:border-slate-700/50 dark:bg-slate-900 motion-safe:transition-opacity motion-safe:duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
          rendered ? "opacity-100" : "opacity-0"
        }`}
      />
      {caption && (
        <figcaption
          id={captionId}
          className="mt-2 text-center text-sm text-slate-500 dark:text-slate-400"
        >
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
