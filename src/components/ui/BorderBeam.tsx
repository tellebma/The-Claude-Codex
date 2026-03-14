"use client";

import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

interface BorderBeamProps {
  readonly duration?: number;
  readonly size?: number;
  readonly colorFrom?: string;
  readonly colorTo?: string;
  readonly delay?: number;
}

export function BorderBeam({
  duration = 4,
  size = 200,
  colorFrom = "#06b6d4",
  colorTo = "#f59e0b",
  delay = 0,
}: BorderBeamProps) {
  const prefersReduced = usePrefersReducedMotion();

  if (prefersReduced) return null;

  return (
    <div
      className="pointer-events-none absolute inset-0 rounded-[inherit]"
      style={{
        overflow: "hidden",
        WebkitMask:
          "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
        WebkitMaskComposite: "xor",
        maskComposite: "exclude",
        padding: "1px",
      }}
    >
      <div
        className="absolute"
        style={{
          width: size,
          height: size,
          background: `linear-gradient(${colorFrom}, ${colorTo})`,
          borderRadius: "50%",
          filter: "blur(6px)",
          offsetPath: `rect(0 auto auto 0 round ${size}px)`,
          animation: `border-beam ${duration}s linear infinite`,
          animationDelay: `${delay}s`,
        }}
      />
    </div>
  );
}
