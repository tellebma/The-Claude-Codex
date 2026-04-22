"use client";

import { Suspense, lazy } from "react";
import { clsx } from "clsx";

const Spline = lazy(() => import("@splinetool/react-spline"));

interface InteractiveRobotProps {
  readonly scene: string;
  readonly className?: string;
  readonly ariaLabel?: string;
}

function RobotFallback({ className }: Readonly<{ className?: string }>) {
  return (
    <div
      className={clsx(
        "flex h-full w-full items-center justify-center bg-slate-900/40 text-white",
        className,
      )}
      aria-hidden="true"
    >
      <svg
        className="mr-3 h-6 w-6 animate-spin text-white"
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

export function InteractiveRobot({
  scene,
  className,
  ariaLabel,
}: InteractiveRobotProps) {
  return (
    <figure
      className={clsx("relative m-0", className)}
      aria-label={ariaLabel ?? "Robot 3D interactif qui suit votre souris"}
    >
      <Suspense fallback={<RobotFallback />}>
        <Spline scene={scene} className="!h-full !w-full" />
      </Suspense>
    </figure>
  );
}
