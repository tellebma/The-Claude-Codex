"use client";

import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { ArrowLeft, ArrowRight, RotateCcw, Eye, EyeOff } from "lucide-react";
import type {
  ConfigState,
  Profile,
  Stack,
  Subscription,
  Feature,
  WizardStep,
  Preset,
} from "@/lib/configurator/types";
import { WIZARD_STEP_LABELS } from "@/lib/configurator/types";
import { PRESETS } from "@/lib/configurator/presets";
import { generateAll } from "@/lib/configurator/generator";
import { trackConfigurator } from "@/lib/analytics/trackConfigurator";
import { StepProfile } from "./StepProfile";
import { StepStack } from "./StepStack";
import { StepSubscription } from "./StepSubscription";
import { StepFeatures } from "./StepFeatures";
import { ConfigPreview } from "./ConfigPreview";
import { PresetCard } from "./PresetCard";
import clsx from "clsx";

/**
 * Classes Tailwind pour l'état visuel d'un step du wizard.
 * Extraites en fonctions dédiées pour éviter les ternaires imbriqués
 * (Sonar S3358) et rester lisibles lors d'ajout d'un nouvel état.
 */
function stepLabelClasses(
  isReachable: boolean,
  isCurrent: boolean,
  isCompleted: boolean
): string {
  if (!isReachable) return "cursor-not-allowed text-slate-300 dark:text-slate-600";
  if (isCurrent) return "bg-brand-500/10 text-brand-700 dark:text-brand-400";
  if (isCompleted) return "text-emerald-600 dark:text-emerald-400";
  return "text-slate-400 dark:text-slate-500";
}

function stepBadgeClasses(isCurrent: boolean, isCompleted: boolean): string {
  if (isCurrent) return "bg-brand-500 text-white";
  if (isCompleted) return "bg-emerald-500 text-white";
  return "bg-slate-200 text-slate-500 dark:bg-slate-700 dark:text-slate-300";
}

const INITIAL_STATE: ConfigState = {
  profile: null,
  stacks: [],
  subscription: null,
  features: [],
};

export function ConfiguratorWizard() {
  const [config, setConfig] = useState<ConfigState>(INITIAL_STATE);
  const [step, setStep] = useState<WizardStep>(1);
  const [showPreview, setShowPreview] = useState(false);
  const [showPreviewMobile, setShowPreviewMobile] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const hasStartedRef = useRef(false);
  const hasCompletedRef = useRef(false);

  // Memoize generated config
  const generatedConfig = useMemo(() => generateAll(config), [config]);

  // Fire `configurator_start` on mount (once per page view).
  useEffect(() => {
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;
    trackConfigurator.start();
  }, []);

  // Fire `configurator_step` whenever the current step changes.
  useEffect(() => {
    trackConfigurator.step(step);
  }, [step]);

  // Fire `configurator_complete` the first time the preview is shown.
  useEffect(() => {
    if (!showPreview || hasCompletedRef.current) return;
    hasCompletedRef.current = true;
    trackConfigurator.complete();
  }, [showPreview]);

  // Profile selection
  const handleProfileSelect = useCallback((profile: Profile) => {
    setConfig((prev) => ({
      ...prev,
      profile,
      stacks: [], // Reset stacks when profile changes
    }));
  }, []);

  // Stack toggle
  const handleStackToggle = useCallback((stack: Stack) => {
    setConfig((prev) => {
      const isSelected = prev.stacks.includes(stack);
      return {
        ...prev,
        stacks: isSelected
          ? prev.stacks.filter((s) => s !== stack)
          : [...prev.stacks, stack],
      };
    });
  }, []);

  // Subscription selection
  const handleSubscriptionSelect = useCallback((subscription: Subscription) => {
    setConfig((prev) => ({
      ...prev,
      subscription,
    }));
  }, []);

  // Feature toggle
  const handleFeatureToggle = useCallback((feature: Feature) => {
    setConfig((prev) => {
      const isSelected = prev.features.includes(feature);
      return {
        ...prev,
        features: isSelected
          ? prev.features.filter((f) => f !== feature)
          : [...prev.features, feature],
      };
    });
  }, []);

  // Preset selection
  const handlePresetSelect = useCallback((preset: Preset) => {
    setConfig({
      profile: preset.profile,
      stacks: [...preset.stacks],
      subscription: preset.subscription,
      features: [...preset.features],
    });
    setShowPreview(true);
    setShowPreviewMobile(true);
    requestAnimationFrame(() => {
      previewRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, []);

  // Navigation
  const handleNext = useCallback(() => {
    if (step < 4) {
      setStep((prev) => (prev + 1) as WizardStep);
    } else {
      setShowPreview(true);
    }
  }, [step]);

  const handlePrev = useCallback(() => {
    if (step > 1) {
      setStep((prev) => (prev - 1) as WizardStep);
    }
  }, [step]);

  // Reset
  const handleReset = useCallback(() => {
    setConfig(INITIAL_STATE);
    setStep(1);
    setShowPreview(false);
    setShowPreviewMobile(false);
  }, []);

  // Can navigate forward?
  const canGoNext = useMemo((): boolean => {
    switch (step) {
      case 1:
        return config.profile !== null;
      case 2:
        return config.stacks.length > 0;
      case 3:
        return config.subscription !== null;
      case 4:
        return true;
      default:
        return false;
    }
  }, [step, config]);

  /** Highest step the user is allowed to visit (all previous steps must be valid) */
  const maxReachableStep = useMemo((): WizardStep => {
    if (config.profile === null) return 1;
    if (config.stacks.length === 0) return 2;
    if (config.subscription === null) return 3;
    return 4;
  }, [config]);

  /** Navigate to a step only if all preceding steps are completed */
  const handleStepClick = useCallback(
    (targetStep: WizardStep) => {
      if (targetStep <= maxReachableStep) {
        setStep(targetStep);
      }
    },
    [maxReachableStep]
  );

  // Render current step
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <StepProfile
            selected={config.profile}
            onSelect={handleProfileSelect}
          />
        );
      case 2:
        return (
          <StepStack
            profile={config.profile}
            selected={config.stacks}
            onToggle={handleStackToggle}
          />
        );
      case 3:
        return (
          <StepSubscription
            selected={config.subscription}
            onSelect={handleSubscriptionSelect}
          />
        );
      case 4:
        return (
          <StepFeatures
            selected={config.features}
            subscription={config.subscription}
            onToggle={handleFeatureToggle}
          />
        );
      default:
        return null;
    }
  };

  const hasConfig = config.profile !== null || showPreview;

  return (
    <div>
      {/* Section Presets */}
      <div className="mb-12 sm:mb-16">
        <h2 className="mb-2 text-2xl font-bold tracking-tight sm:text-3xl">
          Presets rapides
        </h2>
        <p className="mb-6 text-slate-600 dark:text-slate-300">
          Choisissez un preset pour démarrer instantanément avec une
          configuration optimisée.
        </p>

        <div className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {PRESETS.map((preset) => (
            <PresetCard
              key={preset.id}
              preset={preset}
              onSelect={handlePresetSelect}
            />
          ))}
        </div>
      </div>

      {/* Séparateur */}
      <div className="mb-12 flex items-center gap-4 sm:mb-16">
        <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
        <span className="text-sm font-medium text-slate-500 dark:text-slate-300">
          ou configurez pas à pas
        </span>
        <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
      </div>

      {/* Wizard pas à pas */}
      <div className="mb-8 flex items-center justify-between sm:mb-10">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Configurateur pas à pas
        </h2>
        {hasConfig && (
          <button
            type="button"
            onClick={handleReset}
            aria-label="Réinitialiser la configuration"
            className="flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            Réinitialiser
          </button>
        )}
      </div>

      {/* Stepper */}
      <nav className="mb-8" role="navigation" aria-label="Progression du configurateur">
        <div className="flex items-center justify-between">
          {([1, 2, 3, 4] as ReadonlyArray<WizardStep>).map((s) => {
            const isReachable = s <= maxReachableStep;
            return (
            <button
              key={s}
              type="button"
              onClick={() => handleStepClick(s)}
              disabled={!isReachable}
              aria-label={`Aller à l'étape ${s} : ${WIZARD_STEP_LABELS[s]}${isReachable ? "" : " (complétez les étapes précédentes)"}`}
              aria-current={step === s ? "step" : undefined}
              className={clsx(
                "flex items-center gap-2 rounded-lg px-1.5 py-2 text-sm font-medium transition-colors sm:px-3",
                stepLabelClasses(isReachable, step === s, s < step)
              )}
            >
              <span
                className={clsx(
                  "flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold",
                  stepBadgeClasses(step === s, s < step)
                )}
              >
                {s < step ? (
                  <svg
                    className="h-3.5 w-3.5"
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
                ) : (
                  s
                )}
              </span>
              <span className="hidden sm:inline">
                {WIZARD_STEP_LABELS[s]}
              </span>
            </button>
            );
          })}
        </div>

        {/* Current step label on mobile */}
        <p className="mt-2 text-center text-xs font-medium text-brand-600 dark:text-brand-400 sm:hidden">
          {WIZARD_STEP_LABELS[step]}
        </p>

        {/* Progress bar */}
        <div
          className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700 sm:h-1"
          role="progressbar"
          aria-valuenow={step}
          aria-valuemin={1}
          aria-valuemax={4}
          aria-label={`Étape ${step} sur 4`}
        >
          <div
            className="h-full rounded-full bg-brand-500 transition-all duration-500"
            style={{ width: `${((step - 1) / 3) * 100}%` }}
          />
        </div>
      </nav>

      {/* Contenu principal : step + preview */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1fr] xl:grid-cols-[3fr_2fr]">
        {/* Zone de l'étape courante */}
        <div className="min-w-0">
          {renderStep()}

          {/* Boutons de navigation — sticky sur mobile */}
          <div className="sticky bottom-0 z-10 -mx-4 mt-8 border-t border-slate-200 bg-white/80 px-4 py-3 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/80 sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:px-0 sm:py-0 sm:backdrop-blur-none">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={handlePrev}
                disabled={step === 1}
                aria-label="Étape précédente"
                className={clsx(
                  "flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors",
                  step === 1
                    ? "cursor-not-allowed text-slate-300 dark:text-slate-600"
                    : "border border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
                )}
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                Précédent
              </button>

              <button
                type="button"
                onClick={handleNext}
                disabled={!canGoNext}
                aria-label={
                  step === 4
                    ? "Générer la configuration"
                    : "Passer à l'étape suivante"
                }
                className={clsx(
                  "flex items-center gap-1.5 rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors",
                  canGoNext
                    ? "bg-brand-500 text-white shadow-sm hover:bg-brand-600"
                    : "cursor-not-allowed bg-slate-200 text-slate-400 dark:bg-slate-700 dark:text-slate-500"
                )}
              >
                {step === 4 ? "Générer" : "Suivant"}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Mobile : toggle aperçu */}
          {hasConfig && (
            <button
              type="button"
              onClick={() => setShowPreviewMobile((prev) => !prev)}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 py-2.5 text-sm font-medium text-slate-600 dark:border-slate-700 dark:text-slate-300 lg:hidden"
            >
              {showPreviewMobile ? (
                <>
                  <EyeOff className="h-4 w-4" aria-hidden="true" />
                  Masquer l&apos;aperçu
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4" aria-hidden="true" />
                  Voir l&apos;aperçu
                </>
              )}
            </button>
          )}
        </div>

        {/* Preview en temps réel — sticky sur desktop */}
        <div
          ref={previewRef}
          className={clsx(
            "min-w-0 lg:sticky lg:top-24 lg:self-start",
            !hasConfig && "hidden lg:block",
            hasConfig && !showPreviewMobile && "hidden lg:block",
            hasConfig && showPreviewMobile && "block"
          )}
        >
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Aperçu en temps réel
            </h3>
            {!showPreview && config.profile === null && (
              <span className="text-xs text-slate-400">
                Sélectionnez un profil pour commencer
              </span>
            )}
          </div>
          <ConfigPreview config={generatedConfig} />
        </div>
      </div>
    </div>
  );
}
