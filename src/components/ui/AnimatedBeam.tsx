"use client";

import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

interface AnimatedBeamProps {
  readonly direction?: "horizontal" | "vertical";
  readonly color?: string;
}

export function AnimatedBeam({
  direction = "horizontal",
  color = "#06b6d4",
}: AnimatedBeamProps) {
  const prefersReduced = usePrefersReducedMotion();

  const isHorizontal = direction === "horizontal";

  if (prefersReduced) {
    return (
      <div className="flex items-center justify-center sm:px-2">
        <svg
          className={`h-6 w-6 text-slate-400 ${isHorizontal ? "rotate-0 hidden sm:block" : "rotate-90 sm:hidden"}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    );
  }

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden ${isHorizontal ? "hidden sm:flex sm:px-1 sm:py-0" : "flex sm:hidden px-0 py-1"}`}
      style={{
        width: isHorizontal ? 40 : "auto",
        height: isHorizontal ? "auto" : 40,
      }}
    >
      <div
        className="absolute"
        style={{
          width: isHorizontal ? "100%" : 2,
          height: isHorizontal ? 2 : "100%",
          background: `linear-gradient(${isHorizontal ? "to right" : "to bottom"}, transparent, ${color}40, transparent)`,
        }}
      />
      <div
        style={{
          width: isHorizontal ? 16 : 4,
          height: isHorizontal ? 4 : 16,
          background: color,
          borderRadius: 4,
          filter: `blur(1px) drop-shadow(0 0 4px ${color})`,
          animation: `beam-flow 2s ease-in-out infinite`,
        }}
      />
    </div>
  );
}
