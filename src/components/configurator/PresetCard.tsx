"use client";

import {
  Monitor,
  Server,
  Smartphone,
  Cloud,
  Palette,
  PenTool,
  GraduationCap,
  Layers,
  Code2,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Preset } from "@/lib/configurator/types";
import clsx from "clsx";

const PRESET_ICON_MAP: Readonly<Record<string, LucideIcon>> = {
  React: Code2,
  Vue: Code2,
  Node: Server,
  Python: Server,
  Mobile: Smartphone,
  FullStack: Layers,
  DevOps: Cloud,
  Designer: Palette,
  Writer: PenTool,
  Beginner: GraduationCap,
};

interface PresetCardProps {
  readonly preset: Preset;
  readonly onSelect: (preset: Preset) => void;
}

export function PresetCard({ preset, onSelect }: PresetCardProps) {
  const Icon = PRESET_ICON_MAP[preset.icon] ?? Monitor;

  return (
    <button
      type="button"
      onClick={() => onSelect(preset)}
      aria-label={`Utiliser le preset ${preset.name}`}
      className={clsx(
        "group flex flex-col items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 text-left",
        "transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md",
        "dark:border-slate-700 dark:bg-slate-800/50 dark:hover:border-brand-600"
      )}
    >
      <div className="flex w-full items-center justify-between">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500/10 text-brand-600 transition-colors group-hover:bg-brand-500/20 dark:text-brand-400">
          <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
        </div>
        <Zap
          className="h-4 w-4 text-slate-300 transition-colors group-hover:text-accent-500 dark:text-slate-600"
          aria-hidden="true"
        />
      </div>

      <div>
        <h4 className="font-semibold text-slate-900 dark:text-slate-100">
          {preset.name}
        </h4>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          {preset.description}
        </p>
      </div>

      <div className="flex flex-wrap gap-1">
        {preset.stacks.slice(0, 4).map((stack) => (
          <span
            key={stack}
            className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-600 dark:bg-slate-700 dark:text-slate-400"
          >
            {stack}
          </span>
        ))}
        {preset.stacks.length > 4 && (
          <span className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-500 dark:bg-slate-700 dark:text-slate-400">
            +{preset.stacks.length - 4}
          </span>
        )}
      </div>
    </button>
  );
}
