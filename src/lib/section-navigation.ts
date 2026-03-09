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
      { label: "Qu'est-ce que Claude Code ?", href: "/getting-started/what-is-claude-code" },
      { label: "Prérequis et installation", href: "/getting-started/installation" },
      { label: "Configuration de l'environnement", href: "/getting-started/environment-setup" },
      { label: "Premier projet pas à pas", href: "/getting-started/first-project" },
    ],
  },
  mcp: {
    title: "MCP",
    items: [
      { label: "Vue d'ensemble", href: "/mcp" },
    ],
  },
  plugins: {
    title: "Plugins",
    items: [
      { label: "Vue d'ensemble", href: "/plugins" },
    ],
  },
  skills: {
    title: "Skills",
    items: [
      { label: "Vue d'ensemble", href: "/skills" },
    ],
  },
  agents: {
    title: "Agents",
    items: [
      { label: "Vue d'ensemble", href: "/agents" },
    ],
  },
  prompting: {
    title: "Prompting",
    items: [
      { label: "Vue d'ensemble", href: "/prompting" },
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
      { label: "Vue d'ensemble", href: "/configurator" },
    ],
  },
  content: {
    title: "Contenus",
    items: [
      { label: "Tous les articles", href: "/content" },
    ],
  },
};

export function getSectionFromPathname(pathname: string): string | null {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) return null;
  const firstSegment = segments[0];
  return firstSegment in sectionNavigation ? firstSegment : null;
}
