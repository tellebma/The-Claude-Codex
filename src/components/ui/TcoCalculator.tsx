"use client";

import { useState, useCallback, useId } from "react";

type PlanKey = "max5x" | "max20x" | "api";

interface PlanConfig {
  readonly label: string;
  readonly monthlyCostPerDev: number;
  readonly description: string;
}

const PLANS: Readonly<Record<PlanKey, PlanConfig>> = {
  max5x: {
    label: "Max 5x (100 $/mois)",
    monthlyCostPerDev: 100,
    description: "5x la capacite du plan Pro, ideal pour un usage quotidien",
  },
  max20x: {
    label: "Max 20x (200 $/mois)",
    monthlyCostPerDev: 200,
    description: "20x la capacite du plan Pro, pour les equipes intensives",
  },
  api: {
    label: "API Team (~40 $/mois)",
    monthlyCostPerDev: 40,
    description: "Pay-as-you-go, cout moyen estime a 40 $/dev/mois",
  },
};

const COMPETITORS = [
  { name: "GitHub Copilot Enterprise", monthlyCost: 39 },
  { name: "Cursor Business", monthlyCost: 40 },
] as const;

function formatCurrency(value: number, currency: string = "$"): string {
  return `${currency}${value.toLocaleString("fr-FR")}`;
}

function formatEuro(value: number): string {
  return `${Math.round(value).toLocaleString("fr-FR")} \u20AC`;
}

export function TcoCalculator() {
  const [devCount, setDevCount] = useState(10);
  const [selectedPlan, setSelectedPlan] = useState<PlanKey>("max5x");
  const [annualSalary, setAnnualSalary] = useState(80000);
  const [hoursGainedPerWeek, setHoursGainedPerWeek] = useState(7);

  const inputIdPrefix = useId();

  const plan = PLANS[selectedPlan];
  const monthlyCost = plan.monthlyCostPerDev * devCount;
  const annualCost = monthlyCost * 12;
  const costPerDev = plan.monthlyCostPerDev;

  // ROI calculation
  const hourlyRate = annualSalary / 1900; // heures travaillees par an
  const weeklyGainPerDev = hoursGainedPerWeek * hourlyRate;
  const monthlyGainPerDev = weeklyGainPerDev * 4.33;
  const monthlyGainTotal = monthlyGainPerDev * devCount;
  const annualGainTotal = monthlyGainTotal * 12;
  const roiMultiplier = annualCost > 0 ? annualGainTotal / annualCost : 0;

  // Competitor comparison
  const copilotMonthlyCost = COMPETITORS[0].monthlyCost * devCount;
  const cursorMonthlyCost = COMPETITORS[1].monthlyCost * devCount;

  const handleDevCountChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseInt(e.target.value, 10);
      if (!isNaN(value) && value >= 1 && value <= 1000) {
        setDevCount(value);
      }
    },
    []
  );

  const handlePlanChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSelectedPlan(e.target.value as PlanKey);
    },
    []
  );

  const handleSalaryChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseInt(e.target.value, 10);
      if (!isNaN(value) && value >= 20000 && value <= 300000) {
        setAnnualSalary(value);
      }
    },
    []
  );

  const handleHoursChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseInt(e.target.value, 10);
      if (!isNaN(value) && value >= 1 && value <= 30) {
        setHoursGainedPerWeek(value);
      }
    },
    []
  );

  return (
    <div className="my-8 space-y-8">
      {/* Inputs Section */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800/50 sm:p-8">
        <h3 className="mb-6 text-xl font-bold text-slate-900 dark:text-white">
          Parametres de votre equipe
        </h3>

        <div className="grid gap-6 sm:grid-cols-2">
          {/* Dev count */}
          <div>
            <label
              htmlFor={`${inputIdPrefix}-devcount`}
              className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Nombre de developpeurs
            </label>
            <input
              id={`${inputIdPrefix}-devcount`}
              type="number"
              min={1}
              max={1000}
              value={devCount}
              onChange={handleDevCountChange}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:border-brand-400"
              aria-describedby={`${inputIdPrefix}-devcount-desc`}
            />
            <p
              id={`${inputIdPrefix}-devcount-desc`}
              className="mt-1 text-xs text-slate-500 dark:text-slate-400"
            >
              De 1 a 1 000 developpeurs
            </p>
          </div>

          {/* Plan selector */}
          <fieldset>
            <legend className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Plan Claude Code
            </legend>
            <div className="space-y-2">
              {(Object.entries(PLANS) as ReadonlyArray<[PlanKey, PlanConfig]>).map(
                ([key, planOption]) => (
                  <label
                    key={key}
                    className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 px-3 py-2 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-700/50"
                  >
                    <input
                      type="radio"
                      name={`${inputIdPrefix}-plan`}
                      value={key}
                      checked={selectedPlan === key}
                      onChange={handlePlanChange}
                      className="h-4 w-4 border-slate-300 text-brand-500 focus:ring-brand-500 dark:border-slate-500"
                    />
                    <span className="text-sm text-slate-700 dark:text-slate-300">
                      {planOption.label}
                    </span>
                  </label>
                )
              )}
            </div>
          </fieldset>
        </div>
      </div>

      {/* Cost Results */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800/50 sm:p-8">
        <h3 className="mb-6 text-xl font-bold text-slate-900 dark:text-white">
          Couts estimes
        </h3>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg bg-brand-50 p-4 dark:bg-brand-500/10">
            <p className="text-sm text-brand-700 dark:text-brand-300">
              Cout mensuel
            </p>
            <p className="mt-1 text-2xl font-bold text-brand-900 dark:text-brand-100">
              {formatCurrency(monthlyCost)}
            </p>
          </div>
          <div className="rounded-lg bg-brand-50 p-4 dark:bg-brand-500/10">
            <p className="text-sm text-brand-700 dark:text-brand-300">
              Cout annuel
            </p>
            <p className="mt-1 text-2xl font-bold text-brand-900 dark:text-brand-100">
              {formatCurrency(annualCost)}
            </p>
          </div>
          <div className="rounded-lg bg-brand-50 p-4 dark:bg-brand-500/10">
            <p className="text-sm text-brand-700 dark:text-brand-300">
              Par developpeur/mois
            </p>
            <p className="mt-1 text-2xl font-bold text-brand-900 dark:text-brand-100">
              {formatCurrency(costPerDev)}
            </p>
          </div>
        </div>

        {/* Competitor comparison */}
        <div className="mt-6">
          <h4 className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-300">
            Comparaison mensuelle ({devCount} devs)
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-2.5 dark:bg-slate-700/50">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Claude Code ({plan.label.split(" (")[0]})
              </span>
              <span className="text-sm font-bold text-slate-900 dark:text-white">
                {formatCurrency(monthlyCost)}/mois
              </span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-2.5 dark:bg-slate-700/50">
              <span className="text-sm text-slate-600 dark:text-slate-400">
                {COMPETITORS[0].name} (39 $/dev)
              </span>
              <span className="text-sm text-slate-700 dark:text-slate-300">
                {formatCurrency(copilotMonthlyCost)}/mois
              </span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-2.5 dark:bg-slate-700/50">
              <span className="text-sm text-slate-600 dark:text-slate-400">
                {COMPETITORS[1].name} (40 $/dev)
              </span>
              <span className="text-sm text-slate-700 dark:text-slate-300">
                {formatCurrency(cursorMonthlyCost)}/mois
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ROI Section */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800/50 sm:p-8">
        <h3 className="mb-6 text-xl font-bold text-slate-900 dark:text-white">
          Estimation du ROI
        </h3>

        <div className="mb-6 grid gap-6 sm:grid-cols-2">
          {/* Annual salary */}
          <div>
            <label
              htmlFor={`${inputIdPrefix}-salary`}
              className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Salaire annuel brut charge moyen
            </label>
            <div className="relative">
              <input
                id={`${inputIdPrefix}-salary`}
                type="number"
                min={20000}
                max={300000}
                step={5000}
                value={annualSalary}
                onChange={handleSalaryChange}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 pr-8 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:border-brand-400"
                aria-describedby={`${inputIdPrefix}-salary-desc`}
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                {"\u20AC"}
              </span>
            </div>
            <p
              id={`${inputIdPrefix}-salary-desc`}
              className="mt-1 text-xs text-slate-500 dark:text-slate-400"
            >
              Cout employeur annuel moyen par developpeur
            </p>
          </div>

          {/* Hours gained */}
          <div>
            <label
              htmlFor={`${inputIdPrefix}-hours`}
              className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Heures gagnees par semaine/dev
            </label>
            <input
              id={`${inputIdPrefix}-hours`}
              type="range"
              min={1}
              max={20}
              value={hoursGainedPerWeek}
              onChange={handleHoursChange}
              className="mt-2 w-full accent-brand-500"
              aria-describedby={`${inputIdPrefix}-hours-desc`}
              aria-valuemin={1}
              aria-valuemax={20}
              aria-valuenow={hoursGainedPerWeek}
              aria-valuetext={`${hoursGainedPerWeek} heures par semaine`}
            />
            <div className="mt-1 flex justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>1h</span>
              <span
                id={`${inputIdPrefix}-hours-desc`}
                className="font-semibold text-brand-600 dark:text-brand-400"
              >
                {hoursGainedPerWeek}h/semaine
              </span>
              <span>20h</span>
            </div>
          </div>
        </div>

        {/* ROI Results */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg bg-emerald-50 p-4 dark:bg-emerald-500/10">
            <p className="text-sm text-emerald-700 dark:text-emerald-300">
              Gain mensuel/dev
            </p>
            <p className="mt-1 text-xl font-bold text-emerald-900 dark:text-emerald-100">
              {formatEuro(monthlyGainPerDev)}
            </p>
          </div>
          <div className="rounded-lg bg-emerald-50 p-4 dark:bg-emerald-500/10">
            <p className="text-sm text-emerald-700 dark:text-emerald-300">
              Gain mensuel total
            </p>
            <p className="mt-1 text-xl font-bold text-emerald-900 dark:text-emerald-100">
              {formatEuro(monthlyGainTotal)}
            </p>
          </div>
          <div className="rounded-lg bg-emerald-50 p-4 dark:bg-emerald-500/10">
            <p className="text-sm text-emerald-700 dark:text-emerald-300">
              Gain annuel total
            </p>
            <p className="mt-1 text-xl font-bold text-emerald-900 dark:text-emerald-100">
              {formatEuro(annualGainTotal)}
            </p>
          </div>
          <div className="rounded-lg bg-accent-50 p-4 dark:bg-accent-500/10">
            <p className="text-sm text-accent-700 dark:text-accent-300">
              ROI
            </p>
            <p className="mt-1 text-xl font-bold text-accent-900 dark:text-accent-100">
              {roiMultiplier.toFixed(1)}x
            </p>
            <p className="mt-0.5 text-xs text-accent-600 dark:text-accent-400">
              le cout de l&apos;outil
            </p>
          </div>
        </div>

        <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
          Estimation basee sur {hoursGainedPerWeek}h gagnees/semaine/dev, un cout
          horaire de {formatEuro(hourlyRate)}/h (salaire charge de{" "}
          {formatEuro(annualSalary)} / 1 900h), et le plan{" "}
          {plan.label.split(" (")[0]} pour {devCount} developpeur
          {devCount > 1 ? "s" : ""}.
        </p>
      </div>
    </div>
  );
}
