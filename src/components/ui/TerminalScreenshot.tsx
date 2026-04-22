"use client";

import { useEffect, useRef, useState } from "react";

export type TerminalLine = Readonly<{
  type: "command" | "output" | "highlight" | "comment" | "prompt" | "empty";
  content: string;
  /** Prompt symbol, default "$". Used only for type "command" */
  promptSymbol?: string;
}>;

type TerminalScreenshotProps = Readonly<{
  /** Title displayed in the window title bar */
  title?: string;
  /** Array of lines to display in the terminal */
  lines: ReadonlyArray<TerminalLine>;
  /** Optional CSS class name to add to the outer wrapper */
  className?: string;
}>;

/**
 * Renders a simulated terminal screenshot window.
 * Always has a dark background (terminal), but the outer frame adapts to dark/light mode.
 * Lazy-loaded via IntersectionObserver.
 *
 * Accessibility:
 * - Outer wrapper carries role="img" + aria-label describing the terminal contents.
 * - Inner pre is aria-hidden to prevent screen readers from announcing raw pseudocode.
 *
 * WCAG contrast on bg-slate-950 (#020617):
 * - text-white (#fff)         ~21:1  ✓
 * - text-green-400 (#4ade80)  ~9.6:1 ✓
 * - text-brand-400 (#22d3ee)  ~7.2:1 ✓
 * - text-slate-400 (#94a3b8)  ~5.9:1 ✓  (output + comment)
 * - text-cyan-300  (#67e8f9)  ~9.1:1 ✓
 */
export function TerminalScreenshot({
  title = "Terminal : zsh",
  lines = [],
  className = "",
}: TerminalScreenshotProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={wrapperRef}
      className={`my-6 overflow-hidden rounded-xl border border-slate-200 shadow-lg dark:border-slate-700 ${className}`}
      aria-label={`Capture d'écran de terminal : ${title}`}
      role="img"
    >
      {/* Title bar — adapts to light/dark */}
      <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-100 px-4 py-2.5 dark:border-slate-700 dark:bg-slate-800">
        {/* macOS-style traffic lights */}
        <span className="h-3 w-3 rounded-full bg-red-500" aria-hidden="true" />
        <span
          className="h-3 w-3 rounded-full bg-yellow-400"
          aria-hidden="true"
        />
        <span
          className="h-3 w-3 rounded-full bg-green-500"
          aria-hidden="true"
        />
        <span className="ml-auto font-mono text-xs text-slate-500 dark:text-slate-300">
          {title}
        </span>
      </div>

      {/* Terminal body — always dark, scrolls horizontally on mobile */}
      <div className="overflow-x-auto bg-slate-950 p-4">
        {visible ? (
          /* aria-hidden: the outer role="img" wrapper already provides the accessible label */
          <pre className="font-mono text-sm leading-relaxed" aria-hidden="true">
            {lines.map((line, index) => (
              <TerminalLineComponent
                key={`term-${index}-${line.type}-${line.content.slice(0, 20)}`}
                line={line}
              />
            ))}
          </pre>
        ) : (
          /* Skeleton placeholder while waiting for IntersectionObserver trigger */
          <div className="space-y-2 py-2" aria-hidden="true">
            {Array.from({ length: Math.min(lines.length, 6) }).map((_, i) => (
              <div
                key={`skeleton-line-${i}`}
                className={[
                  "h-4 animate-pulse rounded bg-slate-800",
                  ["w-[55%]", "w-[65%]", "w-[75%]", "w-[85%]"][i % 4],
                ].join(" ")}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function TerminalLineComponent({ line }: { line: TerminalLine }) {
  if (line.type === "empty") {
    return <span className="block">&nbsp;</span>;
  }

  if (line.type === "command") {
    const symbol = line.promptSymbol ?? "$";
    return (
      <span className="block">
        <span className="select-none text-green-400">{symbol} </span>
        <span className="text-white">{line.content}</span>
      </span>
    );
  }

  if (line.type === "output") {
    // text-slate-400 (#94a3b8) on bg-slate-950 (#020617) = ~5.9:1 — passes WCAG AA
    return <span className="block text-slate-400">{line.content}</span>;
  }

  if (line.type === "highlight") {
    // text-brand-400 (#22d3ee) on bg-slate-950 (#020617) = ~7.2:1 — passes WCAG AA
    return <span className="block text-brand-400">{line.content}</span>;
  }

  if (line.type === "comment") {
    // Fix: was text-slate-500 (#64748b, ~3.8:1 — WCAG AA fail).
    // Raised to text-slate-400 (#94a3b8) for ~5.9:1 contrast on bg-slate-950.
    return <span className="block italic text-slate-400">{line.content}</span>;
  }

  if (line.type === "prompt") {
    // text-cyan-300 (#67e8f9) on bg-slate-950 (#020617) = ~9.1:1 — passes WCAG AA
    return <span className="block text-cyan-300">{line.content}</span>;
  }

  return <span className="block text-slate-300">{line.content}</span>;
}
