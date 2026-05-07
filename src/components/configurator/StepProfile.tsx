"use client";

import {
  Monitor,
  Server,
  Smartphone,
  Cloud,
  Palette,
  PenTool,
  BarChart3,
  GraduationCap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Profile } from "@/lib/configurator/types";
import { PROFILES } from "@/lib/configurator/presets";
import clsx from "clsx";

const ICON_MAP: Readonly<Record<string, LucideIcon>> = {
  Monitor,
  Server,
  Smartphone,
  Cloud,
  Palette,
  PenTool,
  BarChart3,
  GraduationCap,
};

interface StepProfileProps {
  readonly selected: Profile | null;
  readonly onSelect: (profile: Profile) => void;
}

export function StepProfile({ selected, onSelect }: StepProfileProps) {
  return (
    <div>
      <h3 className="mb-2 text-xl font-bold">Choisissez votre profil</h3>
      <p className="mb-6 text-sm text-slate-600 dark:text-slate-300">
        Sélectionnez le profil qui correspond le mieux à votre activité
        principale.
      </p>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
        {PROFILES.map((profile) => {
          const Icon = ICON_MAP[profile.icon] ?? Monitor;
          const isSelected = selected === profile.id;

          return (
            <button
              key={profile.id}
              type="button"
              onClick={() => onSelect(profile.id)}
              aria-label={`Sélectionner le profil ${profile.label}`}
              aria-pressed={isSelected}
              className={clsx(
                "group relative flex flex-col items-start gap-3 rounded-xl border-2 p-4 text-left transition-all duration-200",
                isSelected
                  ? "border-brand-500 bg-brand-500/10 shadow-md shadow-brand-500/10"
                  : "border-slate-200 bg-white hover:border-brand-300 hover:shadow-sm dark:border-slate-700 dark:bg-slate-800/50 dark:hover:border-brand-600"
              )}
            >
              <div
                className={clsx(
                  "flex h-10 w-10 items-center justify-center rounded-lg transition-colors",
                  isSelected
                    ? "bg-brand-500/20 text-brand-700 dark:text-brand-300"
                    : "bg-slate-100 text-slate-700 group-hover:bg-brand-500/10 group-hover:text-brand-700 dark:bg-slate-700 dark:text-slate-300"
                )}
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
              </div>

              <div>
                <div className="font-semibold">{profile.label}</div>
                <div className="mt-1 text-xs text-slate-700 dark:text-slate-300">
                  {profile.description}
                </div>
              </div>

              {isSelected && (
                <div className="absolute right-3 top-3 h-3 w-3 rounded-full bg-brand-500" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
