"use client";

import dynamic from "next/dynamic";
import { clsx } from "clsx";

interface InteractiveRobotProps {
  readonly className?: string;
  readonly ariaLabel?: string;
}

function RobotFallback() {
  return (
    <div
      className="flex h-full w-full items-center justify-center bg-slate-950"
      aria-hidden="true"
    >
      <svg
        className="h-6 w-6 animate-spin text-white/80"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l2-2.647z"
        />
      </svg>
    </div>
  );
}

const Scene = dynamic(() => import("./InteractiveRobotScene"), {
  ssr: false,
  loading: () => <RobotFallback />,
});

export function InteractiveRobot({
  className,
  ariaLabel,
}: InteractiveRobotProps) {
  return (
    <figure
      className={clsx("relative m-0 overflow-hidden", className)}
      aria-label={ariaLabel ?? "Robot 3D interactif qui suit votre souris"}
    >
      <div className="absolute inset-0">
        <Scene />
      </div>

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 mx-auto h-[55%] w-[80%] max-w-3xl"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 55% 40% at 50% 70%, rgba(6,182,212,0.28) 0%, rgba(245,158,11,0.15) 45%, transparent 75%)",
          filter: "blur(14px)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 z-10"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse at 50% 55%, transparent 0%, transparent 35%, rgba(2,6,23,0.7) 75%, #020617 100%)",
        }}
      />
    </figure>
  );
}
