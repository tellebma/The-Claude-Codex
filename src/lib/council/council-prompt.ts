/**
 * Pure, framework-free generation logic for the Claude Council builder.
 *
 * No React, no network, no i18n runtime here: the component passes localized
 * strings in, this module assembles deterministic text out. Kept separate so it
 * can be unit-tested in isolation (snapshot of prompt + SKILL.md per config).
 */

export type CouncilMode = "multi-persona" | "multi-model";

export interface CouncilAdvisor {
  /** Stable id used for React keys and ordering. */
  readonly id: string;
  /** Short role label, e.g. "Sceptique". */
  readonly role: string;
  /** One-line behaviour brief for the advisor. */
  readonly brief: string;
}

export interface CouncilConfig {
  readonly mode: CouncilMode;
  readonly advisors: ReadonlyArray<CouncilAdvisor>;
  /** Role label of the advisor designated as Chairman. */
  readonly chairman: string;
  /** The user question / topic the council deliberates on. */
  readonly question: string;
}

/**
 * Localized static strings injected by the component so the generated text
 * matches the active locale without coupling this module to next-intl.
 */
export interface CouncilStrings {
  readonly promptIntroPersona: string;
  readonly promptIntroModel: string;
  readonly advisorsHeading: string;
  readonly stage1Heading: string;
  readonly stage1Body: string;
  readonly stage2Heading: string;
  readonly stage2Body: string;
  readonly stage3Heading: string;
  readonly stage3Body: string;
  readonly chairmanLabel: string;
  readonly questionLabel: string;
  readonly skillDescription: string;
  readonly skillWhenToUse: string;
  readonly skillInstructions: string;
  readonly fallbackQuestion: string;
}

const MIN_ADVISORS = 2;
const MAX_ADVISORS = 6;

export const COUNCIL_LIMITS = {
  min: MIN_ADVISORS,
  max: MAX_ADVISORS,
} as const;

/** Clamp the advisor count to the supported range. */
export function clampAdvisorCount(count: number): number {
  if (Number.isNaN(count)) return MIN_ADVISORS;
  return Math.min(MAX_ADVISORS, Math.max(MIN_ADVISORS, Math.trunc(count)));
}

/** Estimated LLM calls for a council run: N first opinions + N reviews + 1 chairman. */
export function estimateCalls(advisorCount: number): number {
  const n = clampAdvisorCount(advisorCount);
  return 2 * n + 1;
}

function sanitizeLine(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function resolveQuestion(
  config: CouncilConfig,
  strings: CouncilStrings,
): string {
  const question = sanitizeLine(config.question);
  return question.length > 0 ? question : strings.fallbackQuestion;
}

function renderAdvisorList(advisors: ReadonlyArray<CouncilAdvisor>): string {
  return advisors
    .map((advisor, index) => {
      const role = sanitizeLine(advisor.role) || `Conseiller ${index + 1}`;
      const brief = sanitizeLine(advisor.brief);
      return brief.length > 0
        ? `${index + 1}. ${role} : ${brief}`
        : `${index + 1}. ${role}`;
    })
    .join("\n");
}

/**
 * Build a copy-pasteable prompt that drives a council in a single conversation.
 */
export function generatePrompt(
  config: CouncilConfig,
  strings: CouncilStrings,
): string {
  const intro =
    config.mode === "multi-persona"
      ? strings.promptIntroPersona
      : strings.promptIntroModel;
  const question = resolveQuestion(config, strings);
  const chairman =
    sanitizeLine(config.chairman) || config.advisors[0]?.role || "Chairman";

  const sections = [
    intro,
    "",
    `## ${strings.advisorsHeading}`,
    renderAdvisorList(config.advisors),
    "",
    `## ${strings.stage1Heading}`,
    strings.stage1Body,
    "",
    `## ${strings.stage2Heading}`,
    strings.stage2Body,
    "",
    `## ${strings.stage3Heading}`,
    `${strings.chairmanLabel} ${chairman}.`,
    strings.stage3Body,
    "",
    `## ${strings.questionLabel}`,
    question,
  ];

  return sections.join("\n");
}

/**
 * Build a SKILL.md skeleton that packages the same council behaviour as a
 * reusable Claude skill.
 */
export function generateSkillMd(
  config: CouncilConfig,
  strings: CouncilStrings,
): string {
  const chairman =
    sanitizeLine(config.chairman) || config.advisors[0]?.role || "Chairman";
  const advisorList = renderAdvisorList(config.advisors);

  const frontmatter = [
    "---",
    "name: claude-council",
    `description: ${strings.skillDescription}`,
    "---",
  ].join("\n");

  const body = [
    "## When to use this skill",
    "",
    strings.skillWhenToUse,
    "",
    "## Council members",
    "",
    advisorList,
    "",
    "## Instructions",
    "",
    strings.skillInstructions,
    "",
    `1. **${strings.stage1Heading}** ${strings.stage1Body}`,
    `2. **${strings.stage2Heading}** ${strings.stage2Body}`,
    `3. **${strings.stage3Heading}** ${strings.chairmanLabel} ${chairman}. ${strings.stage3Body}`,
  ].join("\n");

  return `${frontmatter}\n\n${body}\n`;
}
