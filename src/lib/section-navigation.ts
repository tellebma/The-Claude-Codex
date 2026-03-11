export interface SectionNavItem {
  readonly label: string;
  readonly href: string;
}

export interface SectionNavConfig {
  readonly title: string;
  readonly items: ReadonlyArray<SectionNavItem>;
}

export const sectionNavigation: Readonly<Record<string, SectionNavConfig>> = {
  "getting-started": {
    title: "Démarrer",
    items: [
      { label: "Vue d'ensemble", href: "/getting-started" },
      { label: "Pré-requis pour grands débutants", href: "/getting-started/prerequisites-zero" },
      { label: "Qu'est-ce que Claude Code ?", href: "/getting-started/what-is-claude-code" },
      { label: "Prérequis et installation", href: "/getting-started/installation" },
      { label: "Configuration de l'environnement", href: "/getting-started/environment-setup" },
      { label: "Premier projet pas à pas", href: "/getting-started/first-project" },
      { label: "FAQ débutants", href: "/getting-started/faq-beginner" },
    ],
  },
  mcp: {
    title: "MCP",
    items: [
      { label: "Vue d'ensemble", href: "/mcp" },
      { label: "Comprendre les MCP", href: "/mcp/what-are-mcps" },
      { label: "Installer et configurer", href: "/mcp/setup" },
      { label: "Top MCP productivité", href: "/mcp/best-productivity" },
      { label: "Top MCP développement", href: "/mcp/best-development" },
      { label: "Top MCP design & UI", href: "/mcp/best-design" },
      { label: "Premier workflow MCP", href: "/mcp/first-workflow" },
      { label: "Sécurité des MCP", href: "/mcp/securite-mcp" },
    ],
  },
  plugins: {
    title: "Plugins",
    items: [
      { label: "Vue d'ensemble", href: "/plugins" },
      { label: "Comprendre les plugins", href: "/plugins/what-are-plugins" },
      { label: "Installer et gérer", href: "/plugins/setup" },
      { label: "Top plugins essentiels", href: "/plugins/best-essential" },
      { label: "Plugins design & frontend", href: "/plugins/best-design" },
      { label: "Plugins sécurité & qualité", href: "/plugins/best-security" },
    ],
  },
  skills: {
    title: "Skills",
    items: [
      { label: "Vue d'ensemble", href: "/skills" },
      { label: "Qu'est-ce qu'un Skill ?", href: "/skills/what-are-skills" },
      { label: "Top Skills recommandés", href: "/skills/best-skills" },
      { label: "Créer un Skill custom", href: "/skills/create-custom" },
      { label: "Skills vs MCP vs Plugins", href: "/skills/comparison" },
    ],
  },
  agents: {
    title: "Agents",
    items: [
      { label: "Vue d'ensemble", href: "/agents" },
      { label: "Comprendre les agents", href: "/agents/what-are-agents" },
      { label: "Créer un subagent", href: "/agents/create-subagent" },
      { label: "Agent Teams", href: "/agents/agent-teams" },
      { label: "Top agents par cas d'usage", href: "/agents/best-agents" },
      { label: "Orchestration avancée", href: "/agents/orchestration" },
    ],
  },
  prompting: {
    title: "Prompting",
    items: [
      { label: "Vue d'ensemble", href: "/prompting" },
      { label: "Les bases du prompting", href: "/prompting/basics" },
      { label: "Directives avancées", href: "/prompting/directives" },
      { label: "Templates par métier", href: "/prompting/templates" },
      { label: "Erreurs à éviter", href: "/prompting/mistakes" },
      { label: "Guide CLAUDE.md", href: "/prompting/claude-md" },
      { label: "Prompting avancé", href: "/prompting/advanced" },
      { label: "Gestion du contexte", href: "/prompting/context-management" },
      { label: "Extended Thinking & Plan Mode", href: "/prompting/thinking-and-planning" },
      { label: "Chaining & multi-agents", href: "/prompting/chaining-and-agents" },
      { label: "Prompting non-développeurs", href: "/prompting/non-dev-prompting" },
    ],
  },
  future: {
    title: "Vision",
    items: [
      { label: "Vue d'ensemble", href: "/future" },
    ],
  },
  configurator: {
    title: "Configurateur",
    items: [
      { label: "Configurateur interactif", href: "/configurator" },
    ],
  },
  content: {
    title: "Contenus",
    items: [
      { label: "Tous les articles", href: "/content" },
      { label: "Introduction à Claude Code", href: "/content/getting-started-intro" },
      { label: "Guide complet des MCP", href: "/content/mcp-guide" },
      { label: "Guide complet des Skills", href: "/content/skills-guide" },
      { label: "Guide du prompting", href: "/content/prompting-guide" },
      { label: "Vision et tendances IA", href: "/content/future-vision" },
      { label: "Coûts réels de Claude Code", href: "/content/couts-reels-claude-code" },
      { label: "8 idées reçues sur Claude Code", href: "/content/mythes-claude-code" },
      { label: "Guide de sécurité", href: "/content/bonnes-pratiques-securite" },
    ],
  },
};

export function getSectionFromPathname(pathname: string): string | null {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) return null;
  const firstSegment = segments[0];
  return firstSegment in sectionNavigation ? firstSegment : null;
}
