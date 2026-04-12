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
  const uniqueId = useId().replace(/:/g, "-");
  const captionId = `mermaid-caption${uniqueId}`;

  const isDark = resolvedTheme === "dark";
  const accessibleName = ariaLabel ?? caption ?? "Diagram";

  useEffect(() => {
    setRendered(false);
    setError(null);

    let cancelled = false;

    import("mermaid").then(({ default: mermaid }) => {
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

      mermaid
        .render(id, chart)
        .then(({ svg }) => {
          if (cancelled || !containerRef.current) return;
          containerRef.current.innerHTML = svg;

          // xychart-beta ignores themeCSS — fix post-render
          const bgRect = containerRef.current.querySelector(
            ".background"
          ) as SVGElement | null;
          if (bgRect) {
            bgRect.style.fill = isDark ? "#1e293b" : "#f8fafc";
          }
          containerRef.current
            .querySelectorAll(".line-plot-0 path")
            .forEach((el) => {
              (el as SVGElement).style.stroke = "#06b6d4";
              (el as SVGElement).style.strokeWidth = "2.5";
            });
          containerRef.current
            .querySelectorAll(".label text")
            .forEach((el) => {
              (el as SVGElement).style.fill = isDark ? "#cbd5e1" : "#334155";
            });
          const title = containerRef.current.querySelector(
            ".chart-title text"
          ) as SVGElement | null;
          if (title) {
            title.style.fill = isDark ? "#e2e8f0" : "#0f172a";
            title.style.fontWeight = "600";
          }

          setRendered(true);
        })
        .catch((err) => {
          if (!cancelled) setError(String(err));
        });
    });

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

  return (
    <figure className="my-6">
      {!rendered && !error && (
        <div
          aria-hidden="true"
          className="h-32 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800"
        />
      )}
      <div
        ref={containerRef}
        role="img"
        tabIndex={0}
        aria-labelledby={caption ? captionId : undefined}
        aria-label={!caption ? accessibleName : undefined}
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
