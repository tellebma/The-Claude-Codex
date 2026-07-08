"use client";

import { useCallback, useId, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Check, Clipboard, Minus, Plus } from "lucide-react";
import {
  clampAdvisorCount,
  COUNCIL_LIMITS,
  estimateCalls,
  generatePrompt,
  generateSkillMd,
  type CouncilAdvisor,
  type CouncilConfig,
  type CouncilMode,
  type CouncilStrings,
} from "@/lib/council/council-prompt";

type OutputTab = "prompt" | "skill";

const DEFAULT_ROLE_KEYS = [
  "roleSkeptic",
  "roleAdvocate",
  "rolePractitioner",
  "roleGeneralist",
  "roleContrarian",
  "roleVisionary",
] as const;

function makeAdvisorId(index: number): string {
  return `advisor-${index}`;
}

export function CouncilBuilder() {
  const t = useTranslations("councilBuilder");
  const fieldId = useId();

  const buildDefaultAdvisors = useCallback(
    (count: number): CouncilAdvisor[] =>
      Array.from({ length: count }, (_, index) => {
        const key = DEFAULT_ROLE_KEYS[index % DEFAULT_ROLE_KEYS.length];
        return {
          id: makeAdvisorId(index),
          role: t(`${key}.role`),
          brief: t(`${key}.brief`),
        };
      }),
    [t],
  );

  const [mode, setMode] = useState<CouncilMode>("multi-persona");
  const [advisors, setAdvisors] = useState<CouncilAdvisor[]>(() =>
    buildDefaultAdvisors(3),
  );
  const [chairmanId, setChairmanId] = useState<string>(makeAdvisorId(0));
  const [question, setQuestion] = useState("");
  const [activeTab, setActiveTab] = useState<OutputTab>("prompt");
  const [copied, setCopied] = useState<OutputTab | null>(null);
  const copyTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const strings = useMemo<CouncilStrings>(
    () => ({
      promptIntroPersona: t("promptIntroPersona"),
      promptIntroModel: t("promptIntroModel"),
      advisorsHeading: t("advisorsHeading"),
      stage1Heading: t("stage1Heading"),
      stage1Body: t("stage1Body"),
      stage2Heading: t("stage2Heading"),
      stage2Body: t("stage2Body"),
      stage3Heading: t("stage3Heading"),
      stage3Body: t("stage3Body"),
      chairmanLabel: t("chairmanLabel"),
      questionLabel: t("questionLabel"),
      skillDescription: t("skillDescription"),
      skillWhenToUse: t("skillWhenToUse"),
      skillInstructions: t("skillInstructions"),
      fallbackQuestion: t("fallbackQuestion"),
    }),
    [t],
  );

  const chairmanRole = useMemo(() => {
    const found = advisors.find((advisor) => advisor.id === chairmanId);
    return found?.role ?? advisors[0]?.role ?? "";
  }, [advisors, chairmanId]);

  const config = useMemo<CouncilConfig>(
    () => ({ mode, advisors, chairman: chairmanRole, question }),
    [mode, advisors, chairmanRole, question],
  );

  const promptText = useMemo(
    () => generatePrompt(config, strings),
    [config, strings],
  );
  const skillText = useMemo(
    () => generateSkillMd(config, strings),
    [config, strings],
  );

  const setAdvisorCount = useCallback(
    (next: number) => {
      const target = clampAdvisorCount(next);
      setAdvisors((current) => {
        if (target === current.length) return current;
        if (target < current.length) {
          return current.slice(0, target);
        }
        const additions = Array.from(
          { length: target - current.length },
          (_, offset) => {
            const index = current.length + offset;
            const key = DEFAULT_ROLE_KEYS[index % DEFAULT_ROLE_KEYS.length];
            return {
              id: makeAdvisorId(index),
              role: t(`${key}.role`),
              brief: t(`${key}.brief`),
            };
          },
        );
        return [...current, ...additions];
      });
    },
    [t],
  );

  const updateAdvisor = useCallback(
    (id: string, patch: Partial<Pick<CouncilAdvisor, "role" | "brief">>) => {
      setAdvisors((current) =>
        current.map((advisor) =>
          advisor.id === id ? { ...advisor, ...patch } : advisor,
        ),
      );
    },
    [],
  );

  const handleCopy = useCallback(async (tab: OutputTab, text: string) => {
    if (copyTimeout.current !== null) {
      clearTimeout(copyTimeout.current);
    }
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.select();
      // NOSONAR typescript:S1874 — best-effort fallback for sandboxed contexts.
      document.execCommand("copy");
      textArea.remove();
    }
    setCopied(tab);
    copyTimeout.current = setTimeout(() => setCopied(null), 2000);
  }, []);

  const advisorCount = advisors.length;
  const calls = estimateCalls(advisorCount);
  const outputText = activeTab === "prompt" ? promptText : skillText;

  return (
    <section
      className="my-8 rounded-2xl border border-[color:var(--border-default)] bg-[color:var(--bg-subtle)] p-5 sm:p-6"
      aria-labelledby={`${fieldId}-title`}
    >
      <h3
        id={`${fieldId}-title`}
        className="mb-1 text-lg font-bold text-[var(--fg-primary)]"
      >
        {t("title")}
      </h3>
      <p className="mb-5 text-sm text-[color:var(--fg-secondary)]">
        {t("subtitle")}
      </p>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Controls */}
        {/* min-w-0 : items de grille shrinkables, sinon le <pre> du preview
            (lignes longues non secables) force la colonne au-dela du viewport. */}
        <div className="flex min-w-0 flex-col gap-5">
          {/* Mode */}
          <fieldset className="flex flex-col gap-2">
            <legend className="mb-1 text-sm font-semibold text-[var(--fg-primary)]">
              {t("modeLegend")}
            </legend>
            <div
              role="radiogroup"
              aria-label={t("modeLegend")}
              className="flex flex-wrap gap-2"
            >
              {(["multi-persona", "multi-model"] as const).map((value) => {
                const selected = mode === value;
                const label =
                  value === "multi-persona" ? t("modePersona") : t("modeModel");
                return (
                  <button
                    key={value}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => setMode(value)}
                    className={`min-h-[44px] rounded-lg border px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 ${
                      selected
                        ? "border-brand-500 bg-brand-500/10 text-[var(--fg-primary)]"
                        : "border-[color:var(--border-default)] text-[color:var(--fg-secondary)] hover:border-[color:var(--border-strong)]"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </fieldset>

          {/* Advisor count */}
          <div className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-[var(--fg-primary)]">
              {t("countLabel")}
            </span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setAdvisorCount(advisorCount - 1)}
                disabled={advisorCount <= COUNCIL_LIMITS.min}
                aria-label={t("countDecrease")}
                className="flex h-11 w-11 items-center justify-center rounded-lg border border-[color:var(--border-default)] text-[var(--fg-primary)] transition-colors hover:border-[color:var(--border-strong)] focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Minus className="h-4 w-4" aria-hidden="true" />
              </button>
              <output
                aria-live="polite"
                className="min-w-[2ch] text-center text-lg font-bold tabular-nums text-[var(--fg-primary)]"
              >
                {advisorCount}
              </output>
              <button
                type="button"
                onClick={() => setAdvisorCount(advisorCount + 1)}
                disabled={advisorCount >= COUNCIL_LIMITS.max}
                aria-label={t("countIncrease")}
                className="flex h-11 w-11 items-center justify-center rounded-lg border border-[color:var(--border-default)] text-[var(--fg-primary)] transition-colors hover:border-[color:var(--border-strong)] focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
              </button>
              <span className="text-sm text-[color:var(--fg-muted)]">
                {t("callsEstimate", { count: calls })}
              </span>
            </div>
          </div>

          {/* Advisors */}
          <div className="flex flex-col gap-3">
            <span className="text-sm font-semibold text-[var(--fg-primary)]">
              {t("advisorsLabel")}
            </span>
            {advisors.map((advisor, index) => (
              <div
                key={advisor.id}
                className="flex flex-col gap-2 rounded-lg border border-[color:var(--border-default)] p-3"
              >
                <label
                  className="flex flex-col gap-1 text-xs font-medium text-[color:var(--fg-secondary)]"
                  htmlFor={`${fieldId}-role-${advisor.id}`}
                >
                  {t("roleField", { index: index + 1 })}
                  <input
                    id={`${fieldId}-role-${advisor.id}`}
                    type="text"
                    value={advisor.role}
                    onChange={(event) =>
                      updateAdvisor(advisor.id, { role: event.target.value })
                    }
                    className="min-h-[44px] rounded-md border border-[color:var(--border-default)] bg-[color:var(--bg-page)] px-3 py-2 text-sm text-[var(--fg-primary)] focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </label>
                <label
                  className="flex flex-col gap-1 text-xs font-medium text-[color:var(--fg-secondary)]"
                  htmlFor={`${fieldId}-brief-${advisor.id}`}
                >
                  {t("briefField")}
                  <input
                    id={`${fieldId}-brief-${advisor.id}`}
                    type="text"
                    value={advisor.brief}
                    onChange={(event) =>
                      updateAdvisor(advisor.id, { brief: event.target.value })
                    }
                    className="min-h-[44px] rounded-md border border-[color:var(--border-default)] bg-[color:var(--bg-page)] px-3 py-2 text-sm text-[var(--fg-primary)] focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </label>
              </div>
            ))}
          </div>

          {/* Chairman */}
          <label
            className="flex flex-col gap-1 text-sm font-semibold text-[var(--fg-primary)]"
            htmlFor={`${fieldId}-chairman`}
          >
            {t("chairmanField")}
            <select
              id={`${fieldId}-chairman`}
              value={chairmanId}
              onChange={(event) => setChairmanId(event.target.value)}
              className="min-h-[44px] rounded-md border border-[color:var(--border-default)] bg-[color:var(--bg-page)] px-3 py-2 text-sm font-normal text-[var(--fg-primary)] focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              {advisors.map((advisor, index) => (
                <option key={advisor.id} value={advisor.id}>
                  {advisor.role || t("roleField", { index: index + 1 })}
                </option>
              ))}
            </select>
          </label>

          {/* Question */}
          <label
            className="flex flex-col gap-1 text-sm font-semibold text-[var(--fg-primary)]"
            htmlFor={`${fieldId}-question`}
          >
            {t("questionField")}
            <textarea
              id={`${fieldId}-question`}
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              rows={3}
              placeholder={t("questionPlaceholder")}
              className="rounded-md border border-[color:var(--border-default)] bg-[color:var(--bg-page)] px-3 py-2 text-sm font-normal text-[var(--fg-primary)] focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </label>
        </div>

        {/* Output */}
        <div className="flex min-w-0 flex-col gap-3">
          <div
            role="tablist"
            aria-label={t("outputLegend")}
            className="flex gap-2"
          >
            {(["prompt", "skill"] as const).map((tab) => {
              const selected = activeTab === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  id={`${fieldId}-tab-${tab}`}
                  aria-controls={`${fieldId}-panel-${tab}`}
                  onClick={() => setActiveTab(tab)}
                  className={`min-h-[44px] rounded-lg px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 ${
                    selected
                      ? "bg-brand-500 text-white"
                      : "border border-[color:var(--border-default)] text-[color:var(--fg-secondary)] hover:border-[color:var(--border-strong)]"
                  }`}
                >
                  {tab === "prompt" ? t("tabPrompt") : t("tabSkill")}
                </button>
              );
            })}
          </div>

          <div
            role="tabpanel"
            id={`${fieldId}-panel-${activeTab}`}
            aria-labelledby={`${fieldId}-tab-${activeTab}`}
            className="relative flex-1"
          >
            <button
              type="button"
              onClick={() => handleCopy(activeTab, outputText)}
              aria-label={copied === activeTab ? t("copied") : t("copy")}
              className={`absolute right-2 top-2 flex min-h-[44px] items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 ${
                copied === activeTab
                  ? "border-emerald-500/50 bg-emerald-500/20 text-emerald-700 dark:text-emerald-300"
                  : "border-[color:var(--border-default)] bg-[color:var(--bg-page)] text-[color:var(--fg-secondary)] hover:border-[color:var(--border-strong)]"
              }`}
            >
              {copied === activeTab ? (
                <Check className="h-3.5 w-3.5" aria-hidden="true" />
              ) : (
                <Clipboard className="h-3.5 w-3.5" aria-hidden="true" />
              )}
              {copied === activeTab ? t("copied") : t("copy")}
            </button>
            <pre className="h-full max-h-[28rem] overflow-auto rounded-lg border border-[color:var(--border-default)] bg-[color:var(--code-bg)] p-4 pt-14 text-xs leading-relaxed text-[color:var(--code-fg)]">
              <code data-testid="council-output">{outputText}</code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}
