export interface SectionNavItem {
  readonly labelKey: string;
  readonly href: string;
  /**
   * Per-locale href overrides. When a locale uses a different slug than
   * the canonical `href` (typically because the slug has been translated),
   * list its locale-specific href here. Locales absent from this map fall
   * back to `href`. Keys are locale codes (e.g. "fr", "en").
   */
  readonly hrefByLocale?: Readonly<Record<string, string>>;
}

export interface SectionNavConfig {
  readonly titleKey: string;
  readonly items: ReadonlyArray<SectionNavItem>;
}

/**
 * Returns the href for a nav item in a given locale, falling back to the
 * canonical `href` when no locale-specific override is defined.
 */
export function resolveNavHref(item: SectionNavItem, locale: string): string {
  return item.hrefByLocale?.[locale] ?? item.href;
}

export const sectionNavigation: Readonly<Record<string, SectionNavConfig>> = {
  "getting-started": {
    titleKey: "getting-started.title",
    items: [
      { labelKey: "getting-started.overview", href: "/getting-started" },
      { labelKey: "getting-started.prerequisites-zero", href: "/getting-started/prerequisites-zero" },
      { labelKey: "getting-started.what-is-claude-code", href: "/getting-started/what-is-claude-code" },
      { labelKey: "getting-started.installation", href: "/getting-started/installation" },
      { labelKey: "getting-started.environment-setup", href: "/getting-started/environment-setup" },
      { labelKey: "getting-started.first-project", href: "/getting-started/first-project" },
      { labelKey: "getting-started.faq-beginner", href: "/getting-started/faq-beginner" },
    ],
  },
  mcp: {
    titleKey: "mcp.title",
    items: [
      { labelKey: "mcp.overview", href: "/mcp" },
      { labelKey: "mcp.what-are-mcps", href: "/mcp/what-are-mcps" },
      { labelKey: "mcp.setup", href: "/mcp/setup" },
      { labelKey: "mcp.best-productivity", href: "/mcp/best-productivity" },
      { labelKey: "mcp.best-development", href: "/mcp/best-development" },
      { labelKey: "mcp.best-design", href: "/mcp/best-design" },
      { labelKey: "mcp.first-workflow", href: "/mcp/first-workflow" },
      {
        labelKey: "mcp.securite-mcp",
        href: "/mcp/securite-mcp",
        hrefByLocale: { en: "/mcp/mcp-security" },
      },
      { labelKey: "mcp.create-mcp-typescript", href: "/mcp/create-mcp-typescript" },
      { labelKey: "mcp.create-mcp-python", href: "/mcp/create-mcp-python" },
      { labelKey: "mcp.advanced-protocol", href: "/mcp/advanced-protocol" },
    ],
  },
  plugins: {
    titleKey: "plugins.title",
    items: [
      { labelKey: "plugins.overview", href: "/plugins" },
      { labelKey: "plugins.what-are-plugins", href: "/plugins/what-are-plugins" },
      { labelKey: "plugins.setup", href: "/plugins/setup" },
      { labelKey: "plugins.best-essential", href: "/plugins/best-essential" },
      { labelKey: "plugins.best-design", href: "/plugins/best-design" },
      { labelKey: "plugins.best-security", href: "/plugins/best-security" },
    ],
  },
  skills: {
    titleKey: "skills.title",
    items: [
      { labelKey: "skills.overview", href: "/skills" },
      { labelKey: "skills.what-are-skills", href: "/skills/what-are-skills" },
      { labelKey: "skills.best-skills", href: "/skills/best-skills" },
      { labelKey: "skills.create-custom", href: "/skills/create-custom" },
      { labelKey: "skills.comparison", href: "/skills/comparison" },
    ],
  },
  agents: {
    titleKey: "agents.title",
    items: [
      { labelKey: "agents.overview", href: "/agents" },
      { labelKey: "agents.what-are-agents", href: "/agents/what-are-agents" },
      { labelKey: "agents.create-subagent", href: "/agents/create-subagent" },
      { labelKey: "agents.agent-teams", href: "/agents/agent-teams" },
      { labelKey: "agents.best-agents", href: "/agents/best-agents" },
      { labelKey: "agents.orchestration", href: "/agents/orchestration" },
      { labelKey: "agents.orchestration-patterns", href: "/agents/orchestration-patterns" },
      { labelKey: "agents.agent-sdk", href: "/agents/agent-sdk" },
      { labelKey: "agents.performance-limits", href: "/agents/performance-limits" },
      { labelKey: "agents.background-agents", href: "/agents/background-agents" },
    ],
  },
  prompting: {
    titleKey: "prompting.title",
    items: [
      { labelKey: "prompting.overview", href: "/prompting" },
      { labelKey: "prompting.basics", href: "/prompting/basics" },
      { labelKey: "prompting.directives", href: "/prompting/directives" },
      { labelKey: "prompting.templates", href: "/prompting/templates" },
      { labelKey: "prompting.mistakes", href: "/prompting/mistakes" },
      { labelKey: "prompting.claude-md", href: "/prompting/claude-md" },
      { labelKey: "prompting.advanced", href: "/prompting/advanced" },
      { labelKey: "prompting.context-management", href: "/prompting/context-management" },
      { labelKey: "prompting.thinking-and-planning", href: "/prompting/thinking-and-planning" },
      { labelKey: "prompting.chaining-and-agents", href: "/prompting/chaining-and-agents" },
      { labelKey: "prompting.non-dev-prompting", href: "/prompting/non-dev-prompting" },
      { labelKey: "prompting.power-tips", href: "/prompting/power-tips" },
      { labelKey: "prompting.context-rot", href: "/prompting/context-rot" },
    ],
  },
  future: {
    titleKey: "future.title",
    items: [
      { labelKey: "future.overview", href: "/future" },
      { labelKey: "future.why-ai-matters", href: "/future/why-ai-matters" },
      { labelKey: "future.trends-2026", href: "/future/trends-2026" },
      { labelKey: "future.roadmap", href: "/future/roadmap" },
    ],
  },
  configurator: {
    titleKey: "configurator.title",
    items: [
      { labelKey: "configurator.interactive", href: "/configurator" },
    ],
  },
  "use-cases": {
    titleKey: "use-cases.title",
    items: [
      { labelKey: "use-cases.overview", href: "/use-cases" },
      { labelKey: "use-cases.business", href: "/use-cases/business" },
      { labelKey: "use-cases.success-stories", href: "/use-cases/success-stories" },
      { labelKey: "use-cases.no-code", href: "/use-cases/no-code" },
    ],
  },
  ecosystem: {
    titleKey: "ecosystem.title",
    items: [
      { labelKey: "ecosystem.overview", href: "/ecosystem" },
      { labelKey: "ecosystem.top-repos-github", href: "/ecosystem/top-repos-github" },
      { labelKey: "ecosystem.awesome-skills", href: "/ecosystem/awesome-skills" },
    ],
  },
  enterprise: {
    titleKey: "enterprise.title",
    items: [
      { labelKey: "enterprise.overview", href: "/enterprise" },
      { labelKey: "enterprise.security-compliance", href: "/enterprise/security-compliance" },
      { labelKey: "enterprise.team-adoption", href: "/enterprise/team-adoption" },
      { labelKey: "enterprise.tco-calculator", href: "/enterprise/tco-calculator" },
      { labelKey: "enterprise.faq", href: "/enterprise/faq" },
      { labelKey: "enterprise.governance", href: "/enterprise/governance" },
    ],
  },
  advanced: {
    titleKey: "advanced.title",
    items: [
      { labelKey: "advanced.overview", href: "/advanced" },
      { labelKey: "advanced.hooks", href: "/advanced/hooks" },
      { labelKey: "advanced.headless-ci", href: "/advanced/headless-ci" },
      { labelKey: "advanced.multi-provider", href: "/advanced/multi-provider" },
      { labelKey: "advanced.mcp-profiles", href: "/advanced/mcp-profiles" },
      { labelKey: "advanced.worktrees", href: "/advanced/worktrees" },
      { labelKey: "advanced.permissions-sandbox", href: "/advanced/permissions-sandbox" },
      { labelKey: "advanced.workflows", href: "/advanced/workflows" },
      { labelKey: "advanced.browser-automation", href: "/advanced/browser-automation" },
      { labelKey: "advanced.ultraplan", href: "/advanced/ultraplan" },
      { labelKey: "advanced.rpi-workflow", href: "/advanced/rpi-workflow" },
      { labelKey: "advanced.cross-model-workflow", href: "/advanced/cross-model-workflow" },
      { labelKey: "advanced.methodologies-ecosystem", href: "/advanced/methodologies-ecosystem" },
    ],
  },
  reference: {
    titleKey: "reference.title",
    items: [
      { labelKey: "reference.overview", href: "/reference" },
      { labelKey: "reference.cheatsheet", href: "/reference/cheatsheet" },
      { labelKey: "reference.cli", href: "/reference/cli" },
      { labelKey: "reference.settings", href: "/reference/settings" },
      { labelKey: "reference.environment", href: "/reference/environment" },
      { labelKey: "reference.voice-mode", href: "/reference/voice-mode" },
    ],
  },
  limits: {
    titleKey: "limits.title",
    items: [
      { labelKey: "limits.overview", href: "/limits" },
      { labelKey: "limits.known-limitations", href: "/limits/known-limitations" },
      { labelKey: "limits.vs-copilot", href: "/limits/vs-copilot" },
      { labelKey: "limits.vs-cursor", href: "/limits/vs-cursor" },
      { labelKey: "limits.when-not-to-use", href: "/limits/when-not-to-use" },
    ],
  },
  personas: {
    titleKey: "personas.title",
    items: [
      { labelKey: "personas.overview", href: "/personas" },
      { labelKey: "personas.developer", href: "/personas/developer" },
      { labelKey: "personas.team-lead", href: "/personas/team-lead" },
      { labelKey: "personas.non-dev", href: "/personas/non-dev" },
      { labelKey: "personas.freelance", href: "/personas/freelance" },
      { labelKey: "personas.student", href: "/personas/student" },
    ],
  },
  content: {
    titleKey: "content.title",
    items: [
      { labelKey: "content.all-articles", href: "/content" },
      { labelKey: "content.getting-started-intro", href: "/content/getting-started-intro" },
      { labelKey: "content.mcp-guide", href: "/content/mcp-guide" },
      { labelKey: "content.skills-guide", href: "/content/skills-guide" },
      { labelKey: "content.prompting-guide", href: "/content/prompting-guide" },
      { labelKey: "content.future-vision", href: "/content/future-vision" },
      {
        labelKey: "content.couts-reels",
        href: "/content/couts-reels-claude-code",
        hrefByLocale: { en: "/content/real-costs-claude-code" },
      },
      {
        labelKey: "content.mythes",
        href: "/content/mythes-claude-code",
        hrefByLocale: { en: "/content/claude-code-myths" },
      },
      {
        labelKey: "content.securite",
        href: "/content/bonnes-pratiques-securite",
        hrefByLocale: { en: "/content/security-best-practices" },
      },
    ],
  },
};

export function getSectionFromPathname(pathname: string): string | null {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) return null;

  // With i18n, the first segment is the locale (e.g., "fr", "en").
  // The section is the second segment.
  const firstSegment = segments[0];
  if (firstSegment in sectionNavigation) {
    return firstSegment;
  }

  // If first segment is a locale prefix, check the second segment
  if (segments.length > 1) {
    const secondSegment = segments[1];
    if (secondSegment in sectionNavigation) {
      return secondSegment;
    }
  }

  return null;
}
