"use client";

import { Check, Star } from "lucide-react";
import type { Subscription } from "@/lib/configurator/types";
import { SUBSCRIPTIONS } from "@/lib/configurator/presets";
import clsx from "clsx";

interface StepSubscriptionProps {
  readonly selected: Subscription | null;
  readonly recommended?: Subscription;
  readonly onSelect: (subscription: Subscription) => void;
}

export function StepSubscription({
  selected,
  recommended = "pro",
  onSelect,
}: StepSubscriptionProps) {
  return (
    <div>
      <h3 className="mb-2 text-xl font-bold">Choisissez votre abonnement</h3>
      <p className="mb-6 text-sm text-slate-600 dark:text-slate-300">
        Sélectionnez le niveau d&apos;abonnement qui correspond à vos besoins.
      </p>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {SUBSCRIPTIONS.map((sub) => {
          const isSelected = selected === sub.id;
          const isRecommended = recommended === sub.id;

          return (
            <button
              key={sub.id}
              type="button"
              onClick={() => onSelect(sub.id)}
              aria-label={`Sélectionner l'abonnement ${sub.label} à ${sub.price}`}
              aria-pressed={isSelected}
              className={clsx(
                "relative flex flex-col rounded-xl border-2 p-4 text-left transition-all duration-200",
                isSelected
                  ? "border-brand-500 bg-brand-500/10 shadow-md shadow-brand-500/10"
                  : isRecommended
                    ? "border-accent-400 bg-accent-500/5 hover:border-accent-500 dark:border-accent-600 dark:bg-accent-500/10"
                    : "border-slate-200 bg-white hover:border-brand-300 hover:shadow-sm dark:border-slate-700 dark:bg-slate-800/50 dark:hover:border-brand-600"
              )}
            >
              {isRecommended && (
                <div className="absolute -top-3 left-4 flex items-center gap-1 rounded-full bg-accent-500 px-3 py-0.5 text-xs font-semibold text-white">
                  <Star className="h-3 w-3" aria-hidden="true" />
                  Recommandé
                </div>
              )}

              <div className="mb-3 flex items-baseline justify-between">
                <span className="text-lg font-bold">{sub.label}</span>
                <span
                  className={clsx(
                    "text-sm font-semibold",
                    isSelected
                      ? "text-brand-600 dark:text-brand-400"
                      : "text-slate-500 dark:text-slate-300"
                  )}
                >
                  {sub.price}
                </span>
              </div>

              <p className="mb-3 text-xs text-slate-600 dark:text-slate-300">
                {sub.description}
              </p>

              <ul className="space-y-1.5">
                {sub.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300"
                  >
                    <Check
                      className={clsx(
                        "mt-0.5 h-3 w-3 shrink-0",
                        isSelected
                          ? "text-brand-500"
                          : "text-emerald-500"
                      )}
                      aria-hidden="true"
                    />
                    {feature}
                  </li>
                ))}
              </ul>
            </button>
          );
        })}
      </div>
    </div>
  );
}
