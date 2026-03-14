"use client";

import type { Profile, Stack } from "@/lib/configurator/types";
import { PROFILES } from "@/lib/configurator/presets";
import clsx from "clsx";

interface StepStackProps {
  readonly profile: Profile | null;
  readonly selected: ReadonlyArray<Stack>;
  readonly onToggle: (stack: Stack) => void;
}

export function StepStack({ profile, selected, onToggle }: StepStackProps) {
  const profileInfo = PROFILES.find((p) => p.id === profile);
  const availableStacks = profileInfo ? profileInfo.stacks : [];

  if (!profile) {
    return (
      <div>
        <h3 className="mb-2 text-xl font-bold">Choisissez vos stacks</h3>
        <p className="text-sm text-slate-500 dark:text-slate-300">
          Veuillez d&apos;abord sélectionner un profil à l&apos;étape 1.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="mb-2 text-xl font-bold">Choisissez vos stacks</h3>
      <p className="mb-6 text-sm text-slate-600 dark:text-slate-300">
        Sélectionnez les technologies que vous utilisez. Vous pouvez en choisir
        plusieurs.
      </p>

      <div className="flex flex-wrap gap-2">
        {availableStacks.map((stack) => {
          const isSelected = selected.includes(stack);

          return (
            <button
              key={stack}
              type="button"
              onClick={() => onToggle(stack)}
              aria-label={`${isSelected ? "Retirer" : "Ajouter"} ${stack}`}
              aria-pressed={isSelected}
              className={clsx(
                "rounded-full border px-4 py-2 text-sm font-medium transition-all duration-150",
                isSelected
                  ? "border-brand-500 bg-brand-500 text-white shadow-sm"
                  : "border-slate-300 bg-white text-slate-700 hover:border-brand-400 hover:text-brand-600 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-brand-500"
              )}
            >
              {stack}
            </button>
          );
        })}
      </div>

      {selected.length > 0 && (
        <p className="mt-4 text-xs text-slate-500 dark:text-slate-300">
          {selected.length} stack{selected.length > 1 ? "s" : ""} sélectionnée
          {selected.length > 1 ? "s" : ""}
        </p>
      )}
    </div>
  );
}
