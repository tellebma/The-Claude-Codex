/**
 * Socle de donnees de la page « Benchmarks LLM ».
 *
 * ---------------------------------------------------------------------------
 * REGLE STRUCTURANTE : ce fichier ne contient AUCUNE prose traduisible.
 * ---------------------------------------------------------------------------
 * Uniquement des chiffres, des URLs, des dates ISO et des noms propres. Les
 * descriptions de benchmarks et les mises en garde vivent dans le MDX de chaque
 * locale (`content/{fr,en,es}/benchmarks-llm.mdx`) ; les en-tetes de colonnes
 * passent par `next-intl` (namespace `benchmarks`). Sans cette regle, chaque
 * rafraichissement de scores deviendrait une tache de traduction sur trois
 * langues.
 *
 * Le champ `note` fait exception apparente : il est volontairement ecrit en
 * fragments `cle=valeur` separes par ` · ` (`effort=max`, `agent=Claude Code`,
 * `ci=±1.2`, `votes=686`, `tools=off`, `split=public`, `fallback=Claude Opus
 * 4.8`, `submitted=2026-06-07`). Ce format est lisible a l'identique dans les
 * trois locales et ne demande aucune traduction.
 *
 * ---------------------------------------------------------------------------
 * SIGNIFICATION DE `sourceType`
 * ---------------------------------------------------------------------------
 * - `"vendor-reported"` : le chiffre a ete publie par un editeur de modeles
 *   (system card Anthropic, article OpenAI, README Moonshot, carte modele Z.ai).
 *   Le champ `publisher` dit lequel : il n'est pas toujours l'editeur du modele
 *   mesure. Un editeur qui publie le score d'un concurrent reste un editeur.
 * - `"independent"` : le chiffre a ete mesure et publie par un tiers qui ne vend
 *   aucun des modeles compares (Artificial Analysis, Arena, leaderboard officiel
 *   du benchmark). `publisher` dit lequel.
 *
 * Un meme modele peut donc apparaitre deux fois sur un benchmark : une fois en
 * `vendor-reported`, une fois en `independent`. C'est l'interet de la page.
 *
 * ---------------------------------------------------------------------------
 * REGLES DE SAISIE
 * ---------------------------------------------------------------------------
 * 1. Aucun chiffre sans `sourceUrl` (https obligatoire) ni `measuredAt`.
 * 2. `measuredAt` = date a laquelle la valeur a ete relevee sur la source :
 *    date du snapshot pour un leaderboard, date de publication du document pour
 *    un chiffre editeur. Ce n'est jamais la date d'edition de ce fichier.
 * 3. Une seule entree par `(modelId, benchmarkId, sourceType)`. Quand une source
 *    publie plusieurs variantes d'effort pour un meme modele, on retient la
 *    meilleure et l'effort part dans `note`. Quand deux editeurs publient des
 *    valeurs differentes pour un meme modele, on retient celle de l'editeur du
 *    modele ; a defaut, la source la plus complete, et `publisher` tranche.
 * 4. `releasedAt` est optionnel : il n'est renseigne que lorsqu'une source
 *    primaire documente une date d'annonce ou de disponibilite generale.
 * 5. `maintainer` designe qui maintient le leaderboard reference par
 *    `leaderboardUrl`, pas forcement qui a cree le benchmark.
 *
 * Procedure complete de rafraichissement : `docs/benchmarks-update.md`.
 */

export type BenchmarkCategory =
  | "coding-agentic"
  | "reasoning"
  | "agents-tools"
  | "long-context"
  | "human-preference"
  | "meta-index";

export type ScoreUnit = "percent" | "elo" | "index";

export type ScoreSourceType = "vendor-reported" | "independent";

export interface BenchmarkDefinition {
  /** Identifiant stable, utilise comme prop `benchmarkId` du composant. */
  readonly id: string;
  /** Nom propre du benchmark, jamais traduit. */
  readonly label: string;
  readonly category: BenchmarkCategory;
  /** URL officielle du classement ou de la page d'evaluation. */
  readonly leaderboardUrl: string;
  /** Qui maintient le classement reference ci-dessus. */
  readonly maintainer: string;
}

export interface ModelEntry {
  readonly id: string;
  /** Nom propre du modele, jamais traduit. */
  readonly label: string;
  readonly vendor: string;
  /**
   * `"proprietary"` et `"unknown"` sont des cles traduites cote composant ;
   * toute autre valeur est un nom de licence affiche tel quel
   * (`"MIT"`, `"Apache-2.0"`, `"Kimi K3 License"`).
   */
  readonly license: "proprietary" | "unknown" | string;
  /** ISO `YYYY-MM-DD`. Absent si aucune source primaire ne documente la date. */
  readonly releasedAt?: string;
}

export interface ScoreEntry {
  readonly modelId: string;
  readonly benchmarkId: string;
  readonly value: number;
  readonly unit: ScoreUnit;
  /** URL https de la page ou du document ou la valeur a ete lue. */
  readonly sourceUrl: string;
  /** ISO `YYYY-MM-DD`, date de releve. */
  readonly measuredAt: string;
  readonly sourceType: ScoreSourceType;
  /** Nom propre de l'organisation qui publie la valeur. */
  readonly publisher: string;
  /** Fragments `cle=valeur` separes par ` · ` : effort, harness, IC, votes. */
  readonly note?: string;
}

/** URLs de sources, regroupees pour eviter les fautes de frappe a la saisie. */
const SRC = {
  anthropicOpus5SystemCard:
    "https://www-cdn.anthropic.com/c5fbac3f0b1280a933ebd26d3cb8bb9f5bdeaf48/Claude%20Opus%205%20System%20Card.pdf",
  openaiGpt56: "https://openai.com/index/gpt-5-6/",
  moonshotKimiK3: "https://huggingface.co/moonshotai/Kimi-K3",
  zaiGlm52: "https://huggingface.co/zai-org/GLM-5.2",
  aaModels: "https://artificialanalysis.ai/leaderboards/models",
  aaTerminalBench: "https://artificialanalysis.ai/evaluations/terminalbench-v2-1",
  aaGpqa: "https://artificialanalysis.ai/evaluations/gpqa-diamond",
  aaHle: "https://artificialanalysis.ai/evaluations/humanitys-last-exam",
  aaLcr:
    "https://artificialanalysis.ai/evaluations/artificial-analysis-long-context-reasoning",
  arenaText: "https://arena.ai/leaderboard/text",
  arenaCode: "https://arena.ai/leaderboard/code",
  tbench: "https://www.tbench.ai/leaderboard/terminal-bench/2.1",
  swebench: "https://www.swebench.com/",
  scaleSwebenchPro: "https://labs.scale.com/leaderboard/swe_bench_pro_public",
} as const;

/** Dates de releve, regroupees pour la meme raison. */
const AT = {
  /** Consultation des leaderboards tiers. */
  leaderboards: "2026-07-28",
  /** Snapshot Arena texte et WebDev. */
  arena: "2026-07-27",
  /** System card et annonce Claude Opus 5. */
  anthropicOpus5: "2026-07-24",
  /** Article de disponibilite generale de la famille GPT-5.6. */
  openaiGpt56: "2026-07-09",
  /** Resultats d'evaluation de la carte modele Kimi K3. */
  moonshotKimiK3: "2026-07-23",
  /** Release de la carte modele GLM-5.2. */
  zaiGlm52: "2026-06-17",
} as const;

const PUB = {
  anthropic: "Anthropic",
  openai: "OpenAI",
  moonshot: "Moonshot AI",
  zai: "Z.ai",
  artificialAnalysis: "Artificial Analysis",
  arena: "Arena",
  terminalBench: "Terminal-Bench",
  swebench: "SWE-bench",
  scaleAi: "Scale AI",
} as const;

export const benchmarks: ReadonlyArray<BenchmarkDefinition> = [
  {
    id: "terminal-bench-2-1",
    label: "Terminal-Bench 2.1",
    category: "coding-agentic",
    leaderboardUrl: SRC.tbench,
    maintainer: "Terminal-Bench (tbench.ai)",
  },
  {
    id: "terminal-bench-2-1-aa",
    label: "Terminal-Bench 2.1 (Artificial Analysis)",
    category: "coding-agentic",
    leaderboardUrl: SRC.aaTerminalBench,
    maintainer: "Artificial Analysis",
  },
  {
    id: "swe-bench-verified",
    label: "SWE-bench Verified",
    category: "coding-agentic",
    leaderboardUrl: "https://www.swebench.com/verified.html",
    maintainer: "SWE-bench team",
  },
  {
    id: "swe-bench-pro",
    label: "SWE-bench Pro",
    category: "coding-agentic",
    leaderboardUrl: SRC.scaleSwebenchPro,
    maintainer: "Scale AI",
  },
  {
    id: "gpqa-diamond",
    label: "GPQA Diamond",
    category: "reasoning",
    leaderboardUrl: SRC.aaGpqa,
    maintainer: "Artificial Analysis",
  },
  {
    id: "humanitys-last-exam",
    label: "Humanity's Last Exam",
    category: "reasoning",
    leaderboardUrl: "https://agi.safe.ai/",
    maintainer: "Center for AI Safety, Scale AI",
  },
  {
    id: "gdpval-aa-v2",
    label: "GDPval-AA v2",
    category: "agents-tools",
    leaderboardUrl: "https://artificialanalysis.ai/evaluations",
    maintainer: "Artificial Analysis",
  },
  {
    id: "osworld-2-0",
    label: "OSWorld 2.0",
    category: "agents-tools",
    leaderboardUrl: "http://osworld-v1.xlang.ai/",
    maintainer: "OSWorld team, University of Hong Kong",
  },
  {
    id: "browsecomp",
    label: "BrowseComp",
    category: "agents-tools",
    leaderboardUrl: "https://www.kaggle.com/benchmarks/openai/browsecomp",
    maintainer: "OpenAI",
  },
  {
    id: "aa-lcr",
    label: "AA-LCR",
    category: "long-context",
    leaderboardUrl: SRC.aaLcr,
    maintainer: "Artificial Analysis",
  },
  {
    id: "openai-mrcr-v2-8-needle",
    label: "OpenAI MRCR v2 (8-needle, 256K-512K)",
    category: "long-context",
    leaderboardUrl: "https://huggingface.co/datasets/openai/mrcr",
    maintainer: "OpenAI",
  },
  {
    id: "text-arena",
    label: "Text Arena",
    category: "human-preference",
    leaderboardUrl: SRC.arenaText,
    maintainer: "Arena",
  },
  {
    id: "webdev-arena",
    label: "WebDev Arena",
    category: "human-preference",
    leaderboardUrl: SRC.arenaCode,
    maintainer: "Arena",
  },
  {
    id: "aa-intelligence-index-v4-1",
    label: "Artificial Analysis Intelligence Index v4.1",
    category: "meta-index",
    leaderboardUrl: SRC.aaModels,
    maintainer: "Artificial Analysis",
  },
];

export const models: ReadonlyArray<ModelEntry> = [
  {
    id: "claude-opus-5",
    label: "Claude Opus 5",
    vendor: "Anthropic",
    license: "proprietary",
    releasedAt: "2026-07-24",
  },
  {
    id: "claude-fable-5",
    label: "Claude Fable 5",
    vendor: "Anthropic",
    license: "proprietary",
    releasedAt: "2026-06-09",
  },
  {
    id: "claude-mythos-5",
    label: "Claude Mythos 5",
    vendor: "Anthropic",
    license: "proprietary",
  },
  {
    id: "claude-mythos-preview",
    label: "Claude Mythos Preview",
    vendor: "Anthropic",
    license: "proprietary",
  },
  {
    id: "claude-sonnet-5",
    label: "Claude Sonnet 5",
    vendor: "Anthropic",
    license: "proprietary",
    releasedAt: "2026-06-30",
  },
  {
    id: "claude-opus-4-8",
    label: "Claude Opus 4.8",
    vendor: "Anthropic",
    license: "proprietary",
  },
  {
    id: "claude-opus-4-7",
    label: "Claude Opus 4.7",
    vendor: "Anthropic",
    license: "proprietary",
  },
  {
    id: "claude-opus-4-6",
    label: "Claude Opus 4.6",
    vendor: "Anthropic",
    license: "proprietary",
  },
  {
    id: "claude-opus-4-5",
    label: "Claude Opus 4.5",
    vendor: "Anthropic",
    license: "proprietary",
  },
  {
    id: "claude-sonnet-4-5",
    label: "Claude Sonnet 4.5",
    vendor: "Anthropic",
    license: "proprietary",
  },
  {
    id: "gpt-5-6-sol",
    label: "GPT-5.6 Sol",
    vendor: "OpenAI",
    license: "proprietary",
    releasedAt: "2026-07-09",
  },
  {
    id: "gpt-5-6-terra",
    label: "GPT-5.6 Terra",
    vendor: "OpenAI",
    license: "proprietary",
    releasedAt: "2026-07-09",
  },
  {
    id: "gpt-5-6-luna",
    label: "GPT-5.6 Luna",
    vendor: "OpenAI",
    license: "proprietary",
    releasedAt: "2026-07-09",
  },
  {
    id: "gpt-5-5",
    label: "GPT-5.5",
    vendor: "OpenAI",
    license: "proprietary",
  },
  {
    id: "gpt-5-4",
    label: "GPT-5.4",
    vendor: "OpenAI",
    license: "proprietary",
  },
  {
    id: "gpt-5-2-codex",
    label: "GPT-5.2 Codex",
    vendor: "OpenAI",
    license: "proprietary",
  },
  {
    id: "gpt-5-1",
    label: "GPT-5.1",
    vendor: "OpenAI",
    license: "proprietary",
  },
  {
    id: "gpt-5",
    label: "GPT-5",
    vendor: "OpenAI",
    license: "proprietary",
  },
  {
    id: "kimi-k3",
    label: "Kimi K3",
    vendor: "Moonshot AI",
    license: "Kimi K3 License",
    releasedAt: "2026-07-27",
  },
  {
    id: "glm-5-2",
    label: "GLM-5.2",
    vendor: "Z.ai",
    license: "MIT",
    releasedAt: "2026-06-17",
  },
  {
    id: "gemini-3-1-pro",
    label: "Gemini 3.1 Pro",
    vendor: "Google",
    license: "proprietary",
  },
  {
    id: "gemini-3-pro",
    label: "Gemini 3 Pro",
    vendor: "Google",
    license: "proprietary",
  },
  {
    id: "gemini-3-flash",
    label: "Gemini 3 Flash",
    vendor: "Google",
    license: "proprietary",
  },
  {
    id: "gemini-3-5-flash",
    label: "Gemini 3.5 Flash",
    vendor: "Google",
    license: "proprietary",
    releasedAt: "2026-05-19",
  },
  {
    id: "gemini-3-6-flash",
    label: "Gemini 3.6 Flash",
    vendor: "Google",
    license: "proprietary",
  },
  {
    id: "muse-spark-1-1",
    label: "Muse Spark 1.1",
    vendor: "Meta",
    license: "unknown",
  },
  {
    id: "muse-spark",
    label: "Muse Spark",
    vendor: "Meta",
    license: "unknown",
  },
];

export const scores: ReadonlyArray<ScoreEntry> = [
  // --- Terminal-Bench 2.1, leaderboard officiel (couples agent x modele) ------
  // Une seule entree par modele : le meilleur couple agent x modele du tableau.
  {
    modelId: "claude-fable-5",
    benchmarkId: "terminal-bench-2-1",
    value: 83.8,
    unit: "percent",
    sourceUrl: SRC.tbench,
    measuredAt: AT.leaderboards,
    sourceType: "independent",
    publisher: PUB.terminalBench,
    note: "agent=Claude Code · ci=±1.2 · submitted=2026-06-07",
  },
  {
    modelId: "gpt-5-5",
    benchmarkId: "terminal-bench-2-1",
    value: 83.1,
    unit: "percent",
    sourceUrl: SRC.tbench,
    measuredAt: AT.leaderboards,
    sourceType: "independent",
    publisher: PUB.terminalBench,
    note: "agent=Codex · ci=±1.1 · submitted=2026-05-01",
  },
  {
    modelId: "claude-opus-4-8",
    benchmarkId: "terminal-bench-2-1",
    value: 78.9,
    unit: "percent",
    sourceUrl: SRC.tbench,
    measuredAt: AT.leaderboards,
    sourceType: "independent",
    publisher: PUB.terminalBench,
    note: "agent=Claude Code · ci=±1.3 · submitted=2026-07-09",
  },
  {
    modelId: "gpt-5-6-terra",
    benchmarkId: "terminal-bench-2-1",
    value: 78.4,
    unit: "percent",
    sourceUrl: SRC.tbench,
    measuredAt: AT.leaderboards,
    sourceType: "independent",
    publisher: PUB.terminalBench,
    note: "agent=Codex · ci=±1.3 · submitted=2026-07-11",
  },
  {
    modelId: "muse-spark-1-1",
    benchmarkId: "terminal-bench-2-1",
    value: 76.2,
    unit: "percent",
    sourceUrl: SRC.tbench,
    measuredAt: AT.leaderboards,
    sourceType: "independent",
    publisher: PUB.terminalBench,
    note: "agent=mini-SWE-agent · ci=±1.2 · submitted=2026-07-09",
  },
  {
    modelId: "gpt-5-6-luna",
    benchmarkId: "terminal-bench-2-1",
    value: 75.7,
    unit: "percent",
    sourceUrl: SRC.tbench,
    measuredAt: AT.leaderboards,
    sourceType: "independent",
    publisher: PUB.terminalBench,
    note: "agent=Codex · ci=±1.3 · submitted=2026-07-11",
  },
  {
    modelId: "claude-sonnet-5",
    benchmarkId: "terminal-bench-2-1",
    value: 74.6,
    unit: "percent",
    sourceUrl: SRC.tbench,
    measuredAt: AT.leaderboards,
    sourceType: "independent",
    publisher: PUB.terminalBench,
    note: "agent=Claude Code · ci=±1.6 · submitted=2026-07-09",
  },
  {
    modelId: "gemini-3-pro",
    benchmarkId: "terminal-bench-2-1",
    value: 73.9,
    unit: "percent",
    sourceUrl: SRC.tbench,
    measuredAt: AT.leaderboards,
    sourceType: "independent",
    publisher: PUB.terminalBench,
    note: "agent=Terminus 2 · ci=±1.3 · submitted=2026-05-01",
  },
  {
    modelId: "claude-opus-4-7",
    benchmarkId: "terminal-bench-2-1",
    value: 68.9,
    unit: "percent",
    sourceUrl: SRC.tbench,
    measuredAt: AT.leaderboards,
    sourceType: "independent",
    publisher: PUB.terminalBench,
    note: "agent=Claude Code · ci=±1.4 · submitted=2026-05-01",
  },
  {
    modelId: "gemini-3-1-pro",
    benchmarkId: "terminal-bench-2-1",
    value: 65.8,
    unit: "percent",
    sourceUrl: SRC.tbench,
    measuredAt: AT.leaderboards,
    sourceType: "independent",
    publisher: PUB.terminalBench,
    note: "agent=Gemini CLI · ci=±1.7 · submitted=2026-05-05",
  },

  // --- Terminal-Bench 2.1 rejoue par Artificial Analysis ---------------------
  {
    modelId: "gpt-5-6-sol",
    benchmarkId: "terminal-bench-2-1-aa",
    value: 89.5,
    unit: "percent",
    sourceUrl: SRC.aaTerminalBench,
    measuredAt: AT.leaderboards,
    sourceType: "independent",
    publisher: PUB.artificialAnalysis,
    note: "effort=xhigh · agent=Terminus 2 · runs=3",
  },
  {
    modelId: "claude-opus-5",
    benchmarkId: "terminal-bench-2-1-aa",
    value: 89.1,
    unit: "percent",
    sourceUrl: SRC.aaTerminalBench,
    measuredAt: AT.leaderboards,
    sourceType: "independent",
    publisher: PUB.artificialAnalysis,
    note: "effort=max · mode=adaptive · agent=Terminus 2 · runs=3",
  },

  // --- SWE-bench Verified ---------------------------------------------------
  // Le leaderboard officiel n'a pas d'entree posterieure a fevrier 2026 :
  // le 96,0 % d'Opus 5 est auto-rapporte et n'y figure pas.
  {
    modelId: "claude-opus-5",
    benchmarkId: "swe-bench-verified",
    value: 96.0,
    unit: "percent",
    sourceUrl: SRC.anthropicOpus5SystemCard,
    measuredAt: AT.anthropicOpus5,
    sourceType: "vendor-reported",
    publisher: PUB.anthropic,
    note: "effort=max · runs=5 · n=500",
  },
  {
    modelId: "claude-opus-4-5",
    benchmarkId: "swe-bench-verified",
    value: 76.8,
    unit: "percent",
    sourceUrl: SRC.swebench,
    measuredAt: AT.leaderboards,
    sourceType: "independent",
    publisher: PUB.swebench,
    note: "effort=high · agent=mini-SWE-agent",
  },
  {
    modelId: "gemini-3-flash",
    benchmarkId: "swe-bench-verified",
    value: 75.8,
    unit: "percent",
    sourceUrl: SRC.swebench,
    measuredAt: AT.leaderboards,
    sourceType: "independent",
    publisher: PUB.swebench,
    note: "effort=high · agent=mini-SWE-agent",
  },
  {
    modelId: "claude-opus-4-6",
    benchmarkId: "swe-bench-verified",
    value: 75.6,
    unit: "percent",
    sourceUrl: SRC.swebench,
    measuredAt: AT.leaderboards,
    sourceType: "independent",
    publisher: PUB.swebench,
    note: "agent=mini-SWE-agent",
  },
  {
    modelId: "gpt-5-2-codex",
    benchmarkId: "swe-bench-verified",
    value: 72.8,
    unit: "percent",
    sourceUrl: SRC.swebench,
    measuredAt: AT.leaderboards,
    sourceType: "independent",
    publisher: PUB.swebench,
    note: "agent=mini-SWE-agent",
  },
  {
    modelId: "claude-sonnet-4-5",
    benchmarkId: "swe-bench-verified",
    value: 71.4,
    unit: "percent",
    sourceUrl: SRC.swebench,
    measuredAt: AT.leaderboards,
    sourceType: "independent",
    publisher: PUB.swebench,
    note: "effort=high · agent=mini-SWE-agent",
  },
  {
    modelId: "gemini-3-pro",
    benchmarkId: "swe-bench-verified",
    value: 69.6,
    unit: "percent",
    sourceUrl: SRC.swebench,
    measuredAt: AT.leaderboards,
    sourceType: "independent",
    publisher: PUB.swebench,
    note: "agent=mini-SWE-agent",
  },

  // --- SWE-bench Pro --------------------------------------------------------
  {
    modelId: "claude-mythos-5",
    benchmarkId: "swe-bench-pro",
    value: 80.3,
    unit: "percent",
    sourceUrl: SRC.openaiGpt56,
    measuredAt: AT.openaiGpt56,
    sourceType: "vendor-reported",
    publisher: PUB.openai,
  },
  {
    modelId: "claude-fable-5",
    benchmarkId: "swe-bench-pro",
    value: 80.0,
    unit: "percent",
    sourceUrl: SRC.anthropicOpus5SystemCard,
    measuredAt: AT.anthropicOpus5,
    sourceType: "vendor-reported",
    publisher: PUB.anthropic,
    note: "effort=max",
  },
  {
    modelId: "claude-opus-5",
    benchmarkId: "swe-bench-pro",
    value: 79.2,
    unit: "percent",
    sourceUrl: SRC.anthropicOpus5SystemCard,
    measuredAt: AT.anthropicOpus5,
    sourceType: "vendor-reported",
    publisher: PUB.anthropic,
    note: "effort=max · runs=5",
  },
  {
    modelId: "claude-mythos-preview",
    benchmarkId: "swe-bench-pro",
    value: 77.8,
    unit: "percent",
    sourceUrl: SRC.openaiGpt56,
    measuredAt: AT.openaiGpt56,
    sourceType: "vendor-reported",
    publisher: PUB.openai,
  },
  {
    modelId: "claude-opus-4-8",
    benchmarkId: "swe-bench-pro",
    value: 69.2,
    unit: "percent",
    sourceUrl: SRC.anthropicOpus5SystemCard,
    measuredAt: AT.anthropicOpus5,
    sourceType: "vendor-reported",
    publisher: PUB.anthropic,
  },
  {
    modelId: "gpt-5-6-sol",
    benchmarkId: "swe-bench-pro",
    value: 64.6,
    unit: "percent",
    sourceUrl: SRC.openaiGpt56,
    measuredAt: AT.openaiGpt56,
    sourceType: "vendor-reported",
    publisher: PUB.openai,
  },
  {
    modelId: "gpt-5-6-terra",
    benchmarkId: "swe-bench-pro",
    value: 63.4,
    unit: "percent",
    sourceUrl: SRC.openaiGpt56,
    measuredAt: AT.openaiGpt56,
    sourceType: "vendor-reported",
    publisher: PUB.openai,
  },
  {
    modelId: "gpt-5-6-luna",
    benchmarkId: "swe-bench-pro",
    value: 62.7,
    unit: "percent",
    sourceUrl: SRC.openaiGpt56,
    measuredAt: AT.openaiGpt56,
    sourceType: "vendor-reported",
    publisher: PUB.openai,
  },
  {
    modelId: "glm-5-2",
    benchmarkId: "swe-bench-pro",
    value: 62.1,
    unit: "percent",
    sourceUrl: SRC.zaiGlm52,
    measuredAt: AT.zaiGlm52,
    sourceType: "vendor-reported",
    publisher: PUB.zai,
    note: "effort=max",
  },
  {
    modelId: "gpt-5-5",
    benchmarkId: "swe-bench-pro",
    value: 59.4,
    unit: "percent",
    sourceUrl: SRC.openaiGpt56,
    measuredAt: AT.openaiGpt56,
    sourceType: "vendor-reported",
    publisher: PUB.openai,
  },
  {
    modelId: "gemini-3-1-pro",
    benchmarkId: "swe-bench-pro",
    value: 54.2,
    unit: "percent",
    sourceUrl: SRC.openaiGpt56,
    measuredAt: AT.openaiGpt56,
    sourceType: "vendor-reported",
    publisher: PUB.openai,
  },
  {
    modelId: "muse-spark-1-1",
    benchmarkId: "swe-bench-pro",
    value: 61.5,
    unit: "percent",
    sourceUrl: SRC.scaleSwebenchPro,
    measuredAt: AT.leaderboards,
    sourceType: "independent",
    publisher: PUB.scaleAi,
    note: "split=public · ci=±3.10",
  },
  {
    modelId: "gpt-5-4",
    benchmarkId: "swe-bench-pro",
    value: 59.1,
    unit: "percent",
    sourceUrl: SRC.scaleSwebenchPro,
    measuredAt: AT.leaderboards,
    sourceType: "independent",
    publisher: PUB.scaleAi,
    note: "split=public · effort=xhigh · ci=±3.56",
  },
  {
    modelId: "muse-spark",
    benchmarkId: "swe-bench-pro",
    value: 55.0,
    unit: "percent",
    sourceUrl: SRC.scaleSwebenchPro,
    measuredAt: AT.leaderboards,
    sourceType: "independent",
    publisher: PUB.scaleAi,
    note: "split=public · ci=±3.60",
  },
  {
    modelId: "claude-opus-4-6",
    benchmarkId: "swe-bench-pro",
    value: 51.9,
    unit: "percent",
    sourceUrl: SRC.scaleSwebenchPro,
    measuredAt: AT.leaderboards,
    sourceType: "independent",
    publisher: PUB.scaleAi,
    note: "split=public · mode=thinking · ci=±3.61",
  },
  {
    modelId: "gemini-3-1-pro",
    benchmarkId: "swe-bench-pro",
    value: 46.1,
    unit: "percent",
    sourceUrl: SRC.scaleSwebenchPro,
    measuredAt: AT.leaderboards,
    sourceType: "independent",
    publisher: PUB.scaleAi,
    note: "split=public · mode=thinking · ci=±3.60",
  },

  // --- GPQA Diamond ---------------------------------------------------------
  // Anthropic ne publie aucun GPQA : les valeurs des modeles Claude viennent
  // des tableaux d'OpenAI, jamais d'Anthropic.
  {
    modelId: "gpt-5-6-sol",
    benchmarkId: "gpqa-diamond",
    value: 94.6,
    unit: "percent",
    sourceUrl: SRC.openaiGpt56,
    measuredAt: AT.openaiGpt56,
    sourceType: "vendor-reported",
    publisher: PUB.openai,
  },
  {
    modelId: "gemini-3-1-pro",
    benchmarkId: "gpqa-diamond",
    value: 94.3,
    unit: "percent",
    sourceUrl: SRC.openaiGpt56,
    measuredAt: AT.openaiGpt56,
    sourceType: "vendor-reported",
    publisher: PUB.openai,
  },
  {
    modelId: "gpt-5-5",
    benchmarkId: "gpqa-diamond",
    value: 93.6,
    unit: "percent",
    sourceUrl: SRC.openaiGpt56,
    measuredAt: AT.openaiGpt56,
    sourceType: "vendor-reported",
    publisher: PUB.openai,
  },
  {
    modelId: "gpt-5-6-terra",
    benchmarkId: "gpqa-diamond",
    value: 92.9,
    unit: "percent",
    sourceUrl: SRC.openaiGpt56,
    measuredAt: AT.openaiGpt56,
    sourceType: "vendor-reported",
    publisher: PUB.openai,
  },
  {
    modelId: "gpt-5-6-luna",
    benchmarkId: "gpqa-diamond",
    value: 92.3,
    unit: "percent",
    sourceUrl: SRC.openaiGpt56,
    measuredAt: AT.openaiGpt56,
    sourceType: "vendor-reported",
    publisher: PUB.openai,
  },
  {
    modelId: "claude-fable-5",
    benchmarkId: "gpqa-diamond",
    value: 92.6,
    unit: "percent",
    sourceUrl: SRC.openaiGpt56,
    measuredAt: AT.openaiGpt56,
    sourceType: "vendor-reported",
    publisher: PUB.openai,
  },
  {
    modelId: "claude-opus-4-8",
    benchmarkId: "gpqa-diamond",
    value: 92.0,
    unit: "percent",
    sourceUrl: SRC.openaiGpt56,
    measuredAt: AT.openaiGpt56,
    sourceType: "vendor-reported",
    publisher: PUB.openai,
  },
  {
    modelId: "kimi-k3",
    benchmarkId: "gpqa-diamond",
    value: 93.5,
    unit: "percent",
    sourceUrl: SRC.moonshotKimiK3,
    measuredAt: AT.moonshotKimiK3,
    sourceType: "vendor-reported",
    publisher: PUB.moonshot,
    note: "effort=max",
  },
  {
    modelId: "glm-5-2",
    benchmarkId: "gpqa-diamond",
    value: 91.2,
    unit: "percent",
    sourceUrl: SRC.moonshotKimiK3,
    measuredAt: AT.moonshotKimiK3,
    sourceType: "vendor-reported",
    publisher: PUB.moonshot,
    note: "effort=max",
  },
  {
    modelId: "gpt-5-6-sol",
    benchmarkId: "gpqa-diamond",
    value: 94.1,
    unit: "percent",
    sourceUrl: SRC.aaGpqa,
    measuredAt: AT.leaderboards,
    sourceType: "independent",
    publisher: PUB.artificialAnalysis,
    note: "effort=max",
  },
  {
    modelId: "gemini-3-1-pro",
    benchmarkId: "gpqa-diamond",
    value: 94.1,
    unit: "percent",
    sourceUrl: SRC.aaGpqa,
    measuredAt: AT.leaderboards,
    sourceType: "independent",
    publisher: PUB.artificialAnalysis,
  },
  {
    modelId: "claude-opus-5",
    benchmarkId: "gpqa-diamond",
    value: 93.7,
    unit: "percent",
    sourceUrl: SRC.aaGpqa,
    measuredAt: AT.leaderboards,
    sourceType: "independent",
    publisher: PUB.artificialAnalysis,
    note: "effort=high · mode=adaptive",
  },

  // --- Humanity's Last Exam -------------------------------------------------
  {
    modelId: "claude-fable-5",
    benchmarkId: "humanitys-last-exam",
    value: 56.5,
    unit: "percent",
    sourceUrl: SRC.anthropicOpus5SystemCard,
    measuredAt: AT.anthropicOpus5,
    sourceType: "vendor-reported",
    publisher: PUB.anthropic,
    note: "tools=off",
  },
  {
    modelId: "claude-opus-5",
    benchmarkId: "humanitys-last-exam",
    value: 56.3,
    unit: "percent",
    sourceUrl: SRC.anthropicOpus5SystemCard,
    measuredAt: AT.anthropicOpus5,
    sourceType: "vendor-reported",
    publisher: PUB.anthropic,
    note: "tools=off · effort=max · runs=5",
  },
  {
    modelId: "claude-opus-4-8",
    benchmarkId: "humanitys-last-exam",
    value: 49.8,
    unit: "percent",
    sourceUrl: SRC.anthropicOpus5SystemCard,
    measuredAt: AT.anthropicOpus5,
    sourceType: "vendor-reported",
    publisher: PUB.anthropic,
    note: "tools=off",
  },
  {
    modelId: "gpt-5-6-sol",
    benchmarkId: "humanitys-last-exam",
    value: 44.5,
    unit: "percent",
    sourceUrl: SRC.moonshotKimiK3,
    measuredAt: AT.moonshotKimiK3,
    sourceType: "vendor-reported",
    publisher: PUB.moonshot,
    note: "tools=off · dataset=full",
  },
  {
    modelId: "kimi-k3",
    benchmarkId: "humanitys-last-exam",
    value: 43.5,
    unit: "percent",
    sourceUrl: SRC.moonshotKimiK3,
    measuredAt: AT.moonshotKimiK3,
    sourceType: "vendor-reported",
    publisher: PUB.moonshot,
    note: "tools=off · dataset=full · effort=max",
  },
  {
    modelId: "gpt-5-5",
    benchmarkId: "humanitys-last-exam",
    value: 41.4,
    unit: "percent",
    sourceUrl: SRC.moonshotKimiK3,
    measuredAt: AT.moonshotKimiK3,
    sourceType: "vendor-reported",
    publisher: PUB.moonshot,
    note: "tools=off · dataset=full",
  },
  {
    modelId: "glm-5-2",
    benchmarkId: "humanitys-last-exam",
    value: 40.5,
    unit: "percent",
    sourceUrl: SRC.zaiGlm52,
    measuredAt: AT.zaiGlm52,
    sourceType: "vendor-reported",
    publisher: PUB.zai,
    note: "tools=off · subset=text-only",
  },
  {
    modelId: "claude-fable-5",
    benchmarkId: "humanitys-last-exam",
    value: 53.3,
    unit: "percent",
    sourceUrl: SRC.aaHle,
    measuredAt: AT.leaderboards,
    sourceType: "independent",
    publisher: PUB.artificialAnalysis,
    note: "effort=max · fallback=Claude Opus 4.8 · subset=text-only · n=2158",
  },
  {
    modelId: "claude-opus-5",
    benchmarkId: "humanitys-last-exam",
    value: 52.6,
    unit: "percent",
    sourceUrl: SRC.aaHle,
    measuredAt: AT.leaderboards,
    sourceType: "independent",
    publisher: PUB.artificialAnalysis,
    note: "effort=max · mode=adaptive · subset=text-only · n=2158",
  },

  // --- GDPval-AA v2 (Elo) ---------------------------------------------------
  {
    modelId: "claude-opus-5",
    benchmarkId: "gdpval-aa-v2",
    value: 1861,
    unit: "elo",
    sourceUrl: SRC.anthropicOpus5SystemCard,
    measuredAt: AT.anthropicOpus5,
    sourceType: "vendor-reported",
    publisher: PUB.anthropic,
    note: "effort=max",
  },
  {
    modelId: "claude-fable-5",
    benchmarkId: "gdpval-aa-v2",
    value: 1747,
    unit: "elo",
    sourceUrl: SRC.anthropicOpus5SystemCard,
    measuredAt: AT.anthropicOpus5,
    sourceType: "vendor-reported",
    publisher: PUB.anthropic,
  },
  {
    modelId: "claude-opus-4-8",
    benchmarkId: "gdpval-aa-v2",
    value: 1593,
    unit: "elo",
    sourceUrl: SRC.anthropicOpus5SystemCard,
    measuredAt: AT.anthropicOpus5,
    sourceType: "vendor-reported",
    publisher: PUB.anthropic,
  },
  {
    modelId: "gpt-5-6-sol",
    benchmarkId: "gdpval-aa-v2",
    value: 1747.8,
    unit: "elo",
    sourceUrl: SRC.openaiGpt56,
    measuredAt: AT.openaiGpt56,
    sourceType: "vendor-reported",
    publisher: PUB.openai,
  },
  {
    modelId: "gpt-5-6-terra",
    benchmarkId: "gdpval-aa-v2",
    value: 1593,
    unit: "elo",
    sourceUrl: SRC.openaiGpt56,
    measuredAt: AT.openaiGpt56,
    sourceType: "vendor-reported",
    publisher: PUB.openai,
  },
  {
    modelId: "gpt-5-6-luna",
    benchmarkId: "gdpval-aa-v2",
    value: 1591.8,
    unit: "elo",
    sourceUrl: SRC.openaiGpt56,
    measuredAt: AT.openaiGpt56,
    sourceType: "vendor-reported",
    publisher: PUB.openai,
  },
  {
    modelId: "gpt-5-5",
    benchmarkId: "gdpval-aa-v2",
    value: 1493.7,
    unit: "elo",
    sourceUrl: SRC.openaiGpt56,
    measuredAt: AT.openaiGpt56,
    sourceType: "vendor-reported",
    publisher: PUB.openai,
  },
  {
    modelId: "gemini-3-5-flash",
    benchmarkId: "gdpval-aa-v2",
    value: 1348.8,
    unit: "elo",
    sourceUrl: SRC.openaiGpt56,
    measuredAt: AT.openaiGpt56,
    sourceType: "vendor-reported",
    publisher: PUB.openai,
  },
  {
    modelId: "gemini-3-1-pro",
    benchmarkId: "gdpval-aa-v2",
    value: 962.3,
    unit: "elo",
    sourceUrl: SRC.openaiGpt56,
    measuredAt: AT.openaiGpt56,
    sourceType: "vendor-reported",
    publisher: PUB.openai,
  },
  {
    modelId: "kimi-k3",
    benchmarkId: "gdpval-aa-v2",
    value: 1686,
    unit: "elo",
    sourceUrl: SRC.moonshotKimiK3,
    measuredAt: AT.moonshotKimiK3,
    sourceType: "vendor-reported",
    publisher: PUB.moonshot,
    note: "effort=max",
  },
  {
    modelId: "glm-5-2",
    benchmarkId: "gdpval-aa-v2",
    value: 1510,
    unit: "elo",
    sourceUrl: SRC.moonshotKimiK3,
    measuredAt: AT.moonshotKimiK3,
    sourceType: "vendor-reported",
    publisher: PUB.moonshot,
    note: "effort=max",
  },

  // --- OSWorld 2.0 ----------------------------------------------------------
  {
    modelId: "claude-opus-5",
    benchmarkId: "osworld-2-0",
    value: 70.6,
    unit: "percent",
    sourceUrl: SRC.anthropicOpus5SystemCard,
    measuredAt: AT.anthropicOpus5,
    sourceType: "vendor-reported",
    publisher: PUB.anthropic,
    note: "effort=max",
  },
  {
    modelId: "claude-fable-5",
    benchmarkId: "osworld-2-0",
    value: 66.1,
    unit: "percent",
    sourceUrl: SRC.anthropicOpus5SystemCard,
    measuredAt: AT.anthropicOpus5,
    sourceType: "vendor-reported",
    publisher: PUB.anthropic,
  },
  {
    modelId: "claude-opus-4-8",
    benchmarkId: "osworld-2-0",
    value: 55.7,
    unit: "percent",
    sourceUrl: SRC.anthropicOpus5SystemCard,
    measuredAt: AT.anthropicOpus5,
    sourceType: "vendor-reported",
    publisher: PUB.anthropic,
  },
  {
    modelId: "gpt-5-6-sol",
    benchmarkId: "osworld-2-0",
    value: 62.6,
    unit: "percent",
    sourceUrl: SRC.openaiGpt56,
    measuredAt: AT.openaiGpt56,
    sourceType: "vendor-reported",
    publisher: PUB.openai,
  },
  {
    modelId: "gpt-5-6-terra",
    benchmarkId: "osworld-2-0",
    value: 50.2,
    unit: "percent",
    sourceUrl: SRC.openaiGpt56,
    measuredAt: AT.openaiGpt56,
    sourceType: "vendor-reported",
    publisher: PUB.openai,
  },
  {
    modelId: "gpt-5-6-luna",
    benchmarkId: "osworld-2-0",
    value: 45.6,
    unit: "percent",
    sourceUrl: SRC.openaiGpt56,
    measuredAt: AT.openaiGpt56,
    sourceType: "vendor-reported",
    publisher: PUB.openai,
  },
  {
    modelId: "gpt-5-5",
    benchmarkId: "osworld-2-0",
    value: 47.5,
    unit: "percent",
    sourceUrl: SRC.openaiGpt56,
    measuredAt: AT.openaiGpt56,
    sourceType: "vendor-reported",
    publisher: PUB.openai,
  },
  {
    modelId: "kimi-k3",
    benchmarkId: "osworld-2-0",
    value: 58.3,
    unit: "percent",
    sourceUrl: SRC.moonshotKimiK3,
    measuredAt: AT.moonshotKimiK3,
    sourceType: "vendor-reported",
    publisher: PUB.moonshot,
    note: "effort=max",
  },

  // --- BrowseComp -----------------------------------------------------------
  {
    modelId: "claude-opus-5",
    benchmarkId: "browsecomp",
    value: 90.8,
    unit: "percent",
    sourceUrl: SRC.anthropicOpus5SystemCard,
    measuredAt: AT.anthropicOpus5,
    sourceType: "vendor-reported",
    publisher: PUB.anthropic,
    note: "effort=max",
  },
  {
    modelId: "claude-fable-5",
    benchmarkId: "browsecomp",
    value: 87.4,
    unit: "percent",
    sourceUrl: SRC.anthropicOpus5SystemCard,
    measuredAt: AT.anthropicOpus5,
    sourceType: "vendor-reported",
    publisher: PUB.anthropic,
  },
  {
    modelId: "claude-opus-4-8",
    benchmarkId: "browsecomp",
    value: 84.3,
    unit: "percent",
    sourceUrl: SRC.anthropicOpus5SystemCard,
    measuredAt: AT.anthropicOpus5,
    sourceType: "vendor-reported",
    publisher: PUB.anthropic,
  },
  {
    modelId: "gpt-5-6-sol",
    benchmarkId: "browsecomp",
    value: 90.4,
    unit: "percent",
    sourceUrl: SRC.openaiGpt56,
    measuredAt: AT.openaiGpt56,
    sourceType: "vendor-reported",
    publisher: PUB.openai,
  },
  {
    modelId: "gpt-5-6-terra",
    benchmarkId: "browsecomp",
    value: 87.5,
    unit: "percent",
    sourceUrl: SRC.openaiGpt56,
    measuredAt: AT.openaiGpt56,
    sourceType: "vendor-reported",
    publisher: PUB.openai,
  },
  {
    modelId: "gemini-3-1-pro",
    benchmarkId: "browsecomp",
    value: 85.9,
    unit: "percent",
    sourceUrl: SRC.openaiGpt56,
    measuredAt: AT.openaiGpt56,
    sourceType: "vendor-reported",
    publisher: PUB.openai,
  },
  {
    modelId: "gpt-5-5",
    benchmarkId: "browsecomp",
    value: 84.4,
    unit: "percent",
    sourceUrl: SRC.openaiGpt56,
    measuredAt: AT.openaiGpt56,
    sourceType: "vendor-reported",
    publisher: PUB.openai,
  },
  {
    modelId: "gpt-5-6-luna",
    benchmarkId: "browsecomp",
    value: 83.3,
    unit: "percent",
    sourceUrl: SRC.openaiGpt56,
    measuredAt: AT.openaiGpt56,
    sourceType: "vendor-reported",
    publisher: PUB.openai,
  },
  {
    modelId: "kimi-k3",
    benchmarkId: "browsecomp",
    value: 91.2,
    unit: "percent",
    sourceUrl: SRC.moonshotKimiK3,
    measuredAt: AT.moonshotKimiK3,
    sourceType: "vendor-reported",
    publisher: PUB.moonshot,
    note: "effort=max · compaction=300K",
  },

  // --- AA-LCR (long contexte) -----------------------------------------------
  {
    modelId: "gpt-5-2-codex",
    benchmarkId: "aa-lcr",
    value: 75.7,
    unit: "percent",
    sourceUrl: SRC.aaLcr,
    measuredAt: AT.leaderboards,
    sourceType: "independent",
    publisher: PUB.artificialAnalysis,
    note: "effort=xhigh",
  },
  {
    modelId: "gpt-5",
    benchmarkId: "aa-lcr",
    value: 75.6,
    unit: "percent",
    sourceUrl: SRC.aaLcr,
    measuredAt: AT.leaderboards,
    sourceType: "independent",
    publisher: PUB.artificialAnalysis,
    note: "effort=high",
  },
  {
    modelId: "gpt-5-1",
    benchmarkId: "aa-lcr",
    value: 75.0,
    unit: "percent",
    sourceUrl: SRC.aaLcr,
    measuredAt: AT.leaderboards,
    sourceType: "independent",
    publisher: PUB.artificialAnalysis,
    note: "effort=high",
  },

  // --- OpenAI MRCR v2 -------------------------------------------------------
  {
    modelId: "gpt-5-6-sol",
    benchmarkId: "openai-mrcr-v2-8-needle",
    value: 91.5,
    unit: "percent",
    sourceUrl: SRC.openaiGpt56,
    measuredAt: AT.openaiGpt56,
    sourceType: "vendor-reported",
    publisher: PUB.openai,
  },
  {
    modelId: "gpt-5-6-terra",
    benchmarkId: "openai-mrcr-v2-8-needle",
    value: 89.6,
    unit: "percent",
    sourceUrl: SRC.openaiGpt56,
    measuredAt: AT.openaiGpt56,
    sourceType: "vendor-reported",
    publisher: PUB.openai,
  },
  {
    modelId: "gpt-5-5",
    benchmarkId: "openai-mrcr-v2-8-needle",
    value: 81.5,
    unit: "percent",
    sourceUrl: SRC.openaiGpt56,
    measuredAt: AT.openaiGpt56,
    sourceType: "vendor-reported",
    publisher: PUB.openai,
  },
  {
    modelId: "gpt-5-6-luna",
    benchmarkId: "openai-mrcr-v2-8-needle",
    value: 41.3,
    unit: "percent",
    sourceUrl: SRC.openaiGpt56,
    measuredAt: AT.openaiGpt56,
    sourceType: "vendor-reported",
    publisher: PUB.openai,
  },

  // --- Text Arena (Elo) -----------------------------------------------------
  {
    modelId: "claude-fable-5",
    benchmarkId: "text-arena",
    value: 1508,
    unit: "elo",
    sourceUrl: SRC.arenaText,
    measuredAt: AT.arena,
    sourceType: "independent",
    publisher: PUB.arena,
    note: "ci=±6",
  },
  {
    modelId: "claude-opus-4-6",
    benchmarkId: "text-arena",
    value: 1505,
    unit: "elo",
    sourceUrl: SRC.arenaText,
    measuredAt: AT.arena,
    sourceType: "independent",
    publisher: PUB.arena,
    note: "mode=thinking · ci=±4",
  },
  {
    modelId: "claude-opus-4-7",
    benchmarkId: "text-arena",
    value: 1502,
    unit: "elo",
    sourceUrl: SRC.arenaText,
    measuredAt: AT.arena,
    sourceType: "independent",
    publisher: PUB.arena,
    note: "mode=thinking · ci=±4",
  },
  {
    modelId: "claude-opus-5",
    benchmarkId: "text-arena",
    value: 1495,
    unit: "elo",
    sourceUrl: SRC.arenaText,
    measuredAt: AT.arena,
    sourceType: "independent",
    publisher: PUB.arena,
    note: "effort=max · ci=±12",
  },
  {
    modelId: "muse-spark-1-1",
    benchmarkId: "text-arena",
    value: 1491,
    unit: "elo",
    sourceUrl: SRC.arenaText,
    measuredAt: AT.arena,
    sourceType: "independent",
    publisher: PUB.arena,
    note: "ci=±7",
  },
  {
    modelId: "muse-spark",
    benchmarkId: "text-arena",
    value: 1488,
    unit: "elo",
    sourceUrl: SRC.arenaText,
    measuredAt: AT.arena,
    sourceType: "independent",
    publisher: PUB.arena,
    note: "ci=±6",
  },
  {
    modelId: "gemini-3-1-pro",
    benchmarkId: "text-arena",
    value: 1486,
    unit: "elo",
    sourceUrl: SRC.arenaText,
    measuredAt: AT.arena,
    sourceType: "independent",
    publisher: PUB.arena,
    note: "ci=±3",
  },

  // --- WebDev Arena (Elo) ---------------------------------------------------
  {
    modelId: "claude-opus-5",
    benchmarkId: "webdev-arena",
    value: 1725,
    unit: "elo",
    sourceUrl: SRC.arenaCode,
    measuredAt: AT.arena,
    sourceType: "independent",
    publisher: PUB.arena,
    note: "effort=max · votes=686",
  },
  {
    modelId: "kimi-k3",
    benchmarkId: "webdev-arena",
    value: 1682,
    unit: "elo",
    sourceUrl: SRC.arenaCode,
    measuredAt: AT.arena,
    sourceType: "independent",
    publisher: PUB.arena,
    note: "effort=max · votes=3777",
  },
  {
    modelId: "claude-fable-5",
    benchmarkId: "webdev-arena",
    value: 1629,
    unit: "elo",
    sourceUrl: SRC.arenaCode,
    measuredAt: AT.arena,
    sourceType: "independent",
    publisher: PUB.arena,
    note: "votes=5801",
  },
  {
    modelId: "gpt-5-6-sol",
    benchmarkId: "webdev-arena",
    value: 1623,
    unit: "elo",
    sourceUrl: SRC.arenaCode,
    measuredAt: AT.arena,
    sourceType: "independent",
    publisher: PUB.arena,
    note: "effort=xhigh · votes=5340",
  },
  {
    modelId: "glm-5-2",
    benchmarkId: "webdev-arena",
    value: 1587,
    unit: "elo",
    sourceUrl: SRC.arenaCode,
    measuredAt: AT.arena,
    sourceType: "independent",
    publisher: PUB.arena,
    note: "effort=max · votes=5779",
  },
  {
    modelId: "claude-opus-4-8",
    benchmarkId: "webdev-arena",
    value: 1568,
    unit: "elo",
    sourceUrl: SRC.arenaCode,
    measuredAt: AT.arena,
    sourceType: "independent",
    publisher: PUB.arena,
    note: "mode=thinking · votes=8321",
  },
  {
    modelId: "claude-opus-4-7",
    benchmarkId: "webdev-arena",
    value: 1560,
    unit: "elo",
    sourceUrl: SRC.arenaCode,
    measuredAt: AT.arena,
    sourceType: "independent",
    publisher: PUB.arena,
    note: "votes=11138",
  },

  // --- Artificial Analysis Intelligence Index v4.1 --------------------------
  {
    modelId: "claude-opus-5",
    benchmarkId: "aa-intelligence-index-v4-1",
    value: 61,
    unit: "index",
    sourceUrl: SRC.aaModels,
    measuredAt: AT.leaderboards,
    sourceType: "independent",
    publisher: PUB.artificialAnalysis,
    note: "effort=max",
  },
  {
    modelId: "claude-fable-5",
    benchmarkId: "aa-intelligence-index-v4-1",
    value: 60,
    unit: "index",
    sourceUrl: SRC.aaModels,
    measuredAt: AT.leaderboards,
    sourceType: "independent",
    publisher: PUB.artificialAnalysis,
    note: "fallback=Claude Opus 4.8",
  },
  {
    modelId: "gpt-5-6-sol",
    benchmarkId: "aa-intelligence-index-v4-1",
    value: 59,
    unit: "index",
    sourceUrl: SRC.aaModels,
    measuredAt: AT.leaderboards,
    sourceType: "independent",
    publisher: PUB.artificialAnalysis,
    note: "effort=max",
  },
  {
    modelId: "kimi-k3",
    benchmarkId: "aa-intelligence-index-v4-1",
    value: 57,
    unit: "index",
    sourceUrl: SRC.aaModels,
    measuredAt: AT.leaderboards,
    sourceType: "independent",
    publisher: PUB.artificialAnalysis,
  },
  {
    modelId: "gpt-5-6-terra",
    benchmarkId: "aa-intelligence-index-v4-1",
    value: 55,
    unit: "index",
    sourceUrl: SRC.aaModels,
    measuredAt: AT.leaderboards,
    sourceType: "independent",
    publisher: PUB.artificialAnalysis,
    note: "effort=max",
  },
  {
    modelId: "claude-sonnet-5",
    benchmarkId: "aa-intelligence-index-v4-1",
    value: 53,
    unit: "index",
    sourceUrl: SRC.aaModels,
    measuredAt: AT.leaderboards,
    sourceType: "independent",
    publisher: PUB.artificialAnalysis,
    note: "effort=max",
  },
  {
    modelId: "gpt-5-6-luna",
    benchmarkId: "aa-intelligence-index-v4-1",
    value: 51,
    unit: "index",
    sourceUrl: SRC.aaModels,
    measuredAt: AT.leaderboards,
    sourceType: "independent",
    publisher: PUB.artificialAnalysis,
    note: "effort=max",
  },
  {
    modelId: "glm-5-2",
    benchmarkId: "aa-intelligence-index-v4-1",
    value: 51,
    unit: "index",
    sourceUrl: SRC.aaModels,
    measuredAt: AT.leaderboards,
    sourceType: "independent",
    publisher: PUB.artificialAnalysis,
    note: "effort=max",
  },
  {
    modelId: "muse-spark-1-1",
    benchmarkId: "aa-intelligence-index-v4-1",
    value: 51,
    unit: "index",
    sourceUrl: SRC.aaModels,
    measuredAt: AT.leaderboards,
    sourceType: "independent",
    publisher: PUB.artificialAnalysis,
    note: "effort=xhigh",
  },
  {
    modelId: "gemini-3-5-flash",
    benchmarkId: "aa-intelligence-index-v4-1",
    value: 50,
    unit: "index",
    sourceUrl: SRC.aaModels,
    measuredAt: AT.leaderboards,
    sourceType: "independent",
    publisher: PUB.artificialAnalysis,
  },
  {
    modelId: "gemini-3-6-flash",
    benchmarkId: "aa-intelligence-index-v4-1",
    value: 50,
    unit: "index",
    sourceUrl: SRC.aaModels,
    measuredAt: AT.leaderboards,
    sourceType: "independent",
    publisher: PUB.artificialAnalysis,
  },
  {
    modelId: "gemini-3-1-pro",
    benchmarkId: "aa-intelligence-index-v4-1",
    value: 46,
    unit: "index",
    sourceUrl: SRC.aaModels,
    measuredAt: AT.leaderboards,
    sourceType: "independent",
    publisher: PUB.artificialAnalysis,
  },
];

/** Date du dernier releve, toutes sources confondues (ISO `YYYY-MM-DD`). */
export const lastReviewedAt: string = "2026-07-28";

export function getBenchmark(id: string): BenchmarkDefinition | undefined {
  return benchmarks.find((benchmark) => benchmark.id === id);
}

export function getModel(id: string): ModelEntry | undefined {
  return models.find((model) => model.id === id);
}

/** Benchmarks d'une categorie, dans l'ordre de declaration. */
export function getBenchmarksByCategory(
  category: BenchmarkCategory,
): ReadonlyArray<BenchmarkDefinition> {
  return benchmarks.filter((benchmark) => benchmark.category === category);
}

/**
 * Scores d'un benchmark, tries par valeur decroissante.
 * Egalite departagee par l'identifiant de modele, pour un ordre deterministe.
 * Ne mute jamais `scores`.
 */
export function getScoresForBenchmark(
  benchmarkId: string,
): ReadonlyArray<ScoreEntry> {
  // `filter` renvoie deja un nouveau tableau : le `sort` ne mute pas `scores`.
  return scores
    .filter((score) => score.benchmarkId === benchmarkId)
    .sort((a, b) =>
      b.value === a.value ? a.modelId.localeCompare(b.modelId) : b.value - a.value,
    );
}
