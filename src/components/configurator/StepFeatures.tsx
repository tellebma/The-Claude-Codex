"use client";

import { Lock } from "lucide-react";
import type { Feature, Subscription } from "@/lib/configurator/types";
import { FEATURES, SUBSCRIPTIONS } from "@/lib/configurator/presets";
import clsx from "clsx";

/** Ordre des abonnements pour comparaison */
const SUBSCRIPTION_ORDER: ReadonlyArray<string> = [
  "free",
  "pro",
  "max-100",
  "max-200",
  "api",
];

function subscriptionRank(sub: string | null): number {
  if (sub === null) return -1;
  const idx = SUBSCRIPTION_ORDER.indexOf(sub);
  return idx >= 0 ? idx : -1;
}

function isFeatureLocked(
  featureRequires: Subscription | undefined,
  currentSub: Subscription | null
): boolean {
  if (!featureRequires) return false;
  if (currentSub === "api") return false; // API a accès à tout
  return subscriptionRank(currentSub) < subscriptionRank(featureRequires);
}

interface StepFeaturesProps {
  readonly selected: ReadonlyArray<Feature>;
  readonly subscription: Subscription | null;
  readonly onToggle: (feature: Feature) => void;
}

export function StepFeatures({
  selected,
  subscription,
  onToggle,
}: StepFeaturesProps) {
  return (
    <div>
      <h3 className="mb-2 text-xl font-bold">Activez les features</h3>
      <p className="mb-6 text-sm text-slate-600 dark:text-slate-400">
        Sélectionnez les fonctionnalités avancées à inclure dans votre
        configuration.
      </p>

      <div className="space-y-3">
        {FEATURES.map((feature) => {
          const isSelected = selected.includes(feature.id);
          const locked = isFeatureLocked(
            feature.requiresSubscription,
            subscription
          );

          const requiredSubInfo = feature.requiresSubscription
            ? SUBSCRIPTIONS.find((s) => s.id === feature.requiresSubscription)
            : null;

          return (
            <button
              key={feature.id}
              type="button"
              onClick={() => {
                if (!locked) {
                  onToggle(feature.id);
                }
              }}
              disabled={locked}
              aria-label={`${isSelected ? "Désactiver" : "Activer"} ${feature.label}`}
              aria-pressed={isSelected}
              aria-disabled={locked}
              className={clsx(
                "flex w-full items-start gap-4 rounded-xl border-2 p-4 text-left transition-all duration-200",
                locked
                  ? "cursor-not-allowed border-slate-200 bg-slate-50 opacity-60 dark:border-slate-700 dark:bg-slate-800/30"
                  : isSelected
                    ? "border-brand-500 bg-brand-500/10 shadow-sm"
                    : "border-slate-200 bg-white hover:border-brand-300 dark:border-slate-700 dark:bg-slate-800/50 dark:hover:border-brand-600"
              )}
            >
              {/* Checkbox visuelle */}
              <div
                className={clsx(
                  "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors",
                  locked
                    ? "border-slate-300 dark:border-slate-600"
                    : isSelected
                      ? "border-brand-500 bg-brand-500"
                      : "border-slate-400 dark:border-slate-500"
                )}
              >
                {isSelected && !locked && (
                  <svg
                    className="h-3 w-3 text-white"
                    viewBox="0 0 12 12"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M2 6l3 3 5-5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{feature.label}</span>
                  {locked && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-200 px-2 py-0.5 text-xs text-slate-600 dark:bg-slate-700 dark:text-slate-400">
                      <Lock className="h-3 w-3" aria-hidden="true" />
                      {requiredSubInfo
                        ? `Nécessite ${requiredSubInfo.label}`
                        : "Abonnement requis"}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {feature.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
