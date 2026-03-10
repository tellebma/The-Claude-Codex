import type { Metadata } from "next";

export const SITE_URL = "https://claude-codex.fr";
export const SITE_NAME = "The Claude Codex";
export const SITE_LOCALE = "fr_FR";
export const DEFAULT_OG_IMAGE = "/og/og-default.png";

interface PageMetadataOptions {
  readonly title: string;
  readonly description: string;
  readonly path: string;
  readonly ogImage?: string;
  readonly type?: "website" | "article";
  readonly publishedTime?: string;
  readonly modifiedTime?: string;
}

/**
 * Generates complete metadata for a page including OpenGraph, Twitter,
 * canonical URL, and all required meta tags.
 */
export function createPageMetadata({
  title,
  description,
  path,
  ogImage,
  type = "article",
  publishedTime,
  modifiedTime,
}: PageMetadataOptions): Metadata {
  const canonicalUrl = `${SITE_URL}${path}`;
  const imageUrl = ogImage ?? DEFAULT_OG_IMAGE;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      type,
      locale: SITE_LOCALE,
      url: canonicalUrl,
      siteName: SITE_NAME,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${title} — ${SITE_NAME}`,
        },
      ],
      ...(publishedTime ? { publishedTime } : {}),
      ...(modifiedTime ? { modifiedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_NAME}`,
      description,
      images: [imageUrl],
    },
  };
}

/**
 * All site pages with their metadata for sitemap generation
 * and centralized metadata management.
 */
export interface PageInfo {
  readonly path: string;
  readonly title: string;
  readonly description: string;
  readonly priority: number;
  readonly changeFrequency:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  readonly lastModified?: string;
}

export const SITE_PAGES: ReadonlyArray<PageInfo> = [
  {
    path: "/",
    title: "Ma\u00eetrisez Claude Code",
    description:
      "Le guide de r\u00e9f\u00e9rence gratuit pour ma\u00eetriser Claude Code. MCP, Skills, Prompting avanc\u00e9 \u2014 pour d\u00e9veloppeurs et non-d\u00e9veloppeurs.",
    priority: 1.0,
    changeFrequency: "weekly",
    lastModified: "2026-03-07",
  },
  {
    path: "/getting-started",
    title: "Premiers pas avec Claude Code",
    description:
      "Guide complet pour installer, configurer et utiliser Claude Code. De z\u00e9ro \u00e0 votre premier projet en quelques minutes.",
    priority: 0.9,
    changeFrequency: "monthly",
    lastModified: "2026-03-09",
  },
  {
    path: "/getting-started/what-is-claude-code",
    title: "Qu\u2019est-ce que Claude Code ?",
    description:
      "D\u00e9couvrez Claude Code, l\u2019assistant IA en ligne de commande d\u2019Anthropic. Comprenez ce qui le diff\u00e9rencie de Copilot ou Cursor.",
    priority: 0.85,
    changeFrequency: "monthly",
    lastModified: "2026-03-09",
  },
  {
    path: "/getting-started/installation",
    title: "Pr\u00e9requis et installation de Claude Code",
    description:
      "Installez Claude Code en quelques minutes : Node.js 18+, npm, authentification API key ou Max, et r\u00e9solution des erreurs courantes.",
    priority: 0.85,
    changeFrequency: "monthly",
    lastModified: "2026-03-09",
  },
  {
    path: "/getting-started/environment-setup",
    title: "Configuration de l\u2019environnement Claude Code",
    description:
      "Configurez Claude Code : variable d\u2019environnement API key, fichier settings.json, fichier CLAUDE.md, permissions et s\u00e9curit\u00e9.",
    priority: 0.85,
    changeFrequency: "monthly",
    lastModified: "2026-03-09",
  },
  {
    path: "/getting-started/first-project",
    title: "Premier projet avec Claude Code",
    description:
      "Tutoriel concret : cr\u00e9ez votre premier site web avec Claude Code en 5 minutes. Exemples de prompts et bonnes pratiques.",
    priority: 0.85,
    changeFrequency: "monthly",
    lastModified: "2026-03-09",
  },
  {
    path: "/mcp",
    title: "Les MCP : Donnez des super-pouvoirs a Claude Code",
    description:
      "Decouvrez les MCP (Model Context Protocol) pour connecter Claude Code a vos outils favoris : GitHub, Slack, Gmail, bases de donnees et plus encore.",
    priority: 0.9,
    changeFrequency: "monthly",
    lastModified: "2026-03-09",
  },
  {
    path: "/mcp/what-are-mcps",
    title: "Comprendre les MCP en 5 minutes",
    description:
      "D\u00e9couvrez le Model Context Protocol (MCP) : l\u2019adaptateur universel qui connecte Claude Code \u00e0 vos outils. Architecture, fonctionnement et diff\u00e9rences avec les plugins et skills.",
    priority: 0.85,
    changeFrequency: "monthly",
    lastModified: "2026-03-09",
  },
  {
    path: "/mcp/setup",
    title: "Installer et configurer un MCP",
    description:
      "Guide complet pour installer, configurer et d\u00e9boguer un MCP dans Claude Code. Fichier .mcp.json, commande claude mcp add, et r\u00e9solution des probl\u00e8mes courants.",
    priority: 0.85,
    changeFrequency: "monthly",
    lastModified: "2026-03-09",
  },
  {
    path: "/mcp/best-productivity",
    title: "Top MCP productivit\u00e9",
    description:
      "Les meilleurs MCP pour booster votre productivit\u00e9 avec Claude Code : Figma, Lighthouse, Gmail, Slack et Google Calendar.",
    priority: 0.85,
    changeFrequency: "monthly",
    lastModified: "2026-03-09",
  },
  {
    path: "/mcp/best-development",
    title: "Top MCP d\u00e9veloppement",
    description:
      "Les meilleurs MCP pour le d\u00e9veloppement avec Claude Code : Context7, Sentry, Linear, PostgreSQL/Supabase et GitHub.",
    priority: 0.85,
    changeFrequency: "monthly",
    lastModified: "2026-03-09",
  },
  {
    path: "/mcp/best-design",
    title: "Top MCP design & UI",
    description:
      "Les meilleurs MCP pour le design et l\u2019UI avec Claude Code : Playwright, Chrome DevTools, 21st.dev Magic et Puppeteer.",
    priority: 0.85,
    changeFrequency: "monthly",
    lastModified: "2026-03-09",
  },
  {
    path: "/mcp/first-workflow",
    title: "Cr\u00e9er son premier workflow MCP",
    description:
      "Tutoriel pas \u00e0 pas pour combiner Context7, GitHub et Playwright dans un workflow MCP complet.",
    priority: 0.85,
    changeFrequency: "monthly",
    lastModified: "2026-03-09",
  },
  {
    path: "/skills",
    title: "Skills : Enseignez de nouveaux talents \u00e0 Claude Code",
    description:
      "Apprenez \u00e0 utiliser et cr\u00e9er des Skills pour Claude Code. Automatisez vos workflows, ajoutez des capacit\u00e9s et enseignez de nouveaux talents \u00e0 votre assistant IA.",
    priority: 0.8,
    changeFrequency: "monthly",
    lastModified: "2026-03-10",
  },
  {
    path: "/prompting",
    title: "Prompting : L\u2019art de communiquer avec l\u2019IA",
    description:
      "Ma\u00eetrisez l\u2019art du prompting avec Claude Code. Techniques, templates et bonnes pratiques pour tirer le maximum de l\u2019IA.",
    priority: 0.8,
    changeFrequency: "monthly",
    lastModified: "2026-03-10",
  },
  {
    path: "/prompting/basics",
    title: "Les bases du prompting avec Claude Code",
    description:
      "Apprenez les fondamentaux du prompting avec Claude Code. Structure d\u2019un bon prompt, 5 principes cl\u00e9s, exemples avant/apr\u00e8s et erreurs de d\u00e9butants \u00e0 \u00e9viter.",
    priority: 0.75,
    changeFrequency: "monthly",
    lastModified: "2026-03-10",
  },
  {
    path: "/prompting/directives",
    title: "Les directives qui font la diff\u00e9rence",
    description:
      "Ma\u00eetrisez les directives avanc\u00e9es de prompting : r\u00f4les, contraintes, formats de sortie, patterns DO/DON\u2019T et instructions syst\u00e8me pour cadrer Claude Code efficacement.",
    priority: 0.75,
    changeFrequency: "monthly",
    lastModified: "2026-03-10",
  },
  {
    path: "/prompting/templates",
    title: "Templates de prompts par m\u00e9tier",
    description:
      "Templates de prompts pr\u00eats \u00e0 l\u2019emploi pour d\u00e9veloppeurs web, mobile, backend, DevOps, designers et r\u00e9dacteurs. Copiez, adaptez et utilisez directement avec Claude Code.",
    priority: 0.75,
    changeFrequency: "monthly",
    lastModified: "2026-03-10",
  },
  {
    path: "/prompting/mistakes",
    title: "Erreurs courantes \u00e0 \u00e9viter",
    description:
      "Les 10 erreurs les plus fr\u00e9quentes en prompting avec Claude Code. Pour chaque erreur : description, impact, correction et exemples concrets de mauvais vs bon prompt.",
    priority: 0.75,
    changeFrequency: "monthly",
    lastModified: "2026-03-10",
  },
  {
    path: "/prompting/claude-md",
    title: "Le guide complet CLAUDE.md",
    description:
      "Tout sur le fichier CLAUDE.md : r\u00f4le, structure, bonnes pratiques, commande /init, diff\u00e9rences avec settings.json et .claude/rules/. Exemples r\u00e9els et recommandations.",
    priority: 0.75,
    changeFrequency: "monthly",
    lastModified: "2026-03-10",
  },
  {
    path: "/prompting/advanced",
    title: "Prompting avanc\u00e9 et multi-agents",
    description:
      "Techniques avanc\u00e9es de prompting : chain-of-thought, few-shot, d\u00e9composition, multi-agents, Extended Thinking, Plan Mode et debugging de prompts.",
    priority: 0.75,
    changeFrequency: "monthly",
    lastModified: "2026-03-10",
  },
  {
    path: "/future",
    title: "Vision & Futur de l'IA",
    description:
      "L'avenir de l'IA est deja la. Decouvrez comment vous preparer, les tendances a suivre, et la roadmap de The Claude Codex.",
    priority: 0.7,
    changeFrequency: "monthly",
    lastModified: "2026-03-07",
  },
  {
    path: "/content",
    title: "Contenus \u00e9ditoriaux",
    description:
      "Tous les articles et guides \u00e9ditoriaux du Claude Codex. Explorez nos contenus MDX sur Claude Code, les MCP, les Skills et le prompting.",
    priority: 0.6,
    changeFrequency: "weekly",
    lastModified: "2026-03-09",
  },
  {
    path: "/plugins",
    title: "Plugins : Etendez les capacites de Claude Code",
    description:
      "Decouvrez les plugins Claude Code pour enrichir votre assistant IA. Agents specialises, design, securite, qualite — installez les meilleurs plugins du marketplace.",
    priority: 0.8,
    changeFrequency: "monthly",
    lastModified: "2026-03-09",
  },
  {
    path: "/plugins/what-are-plugins",
    title: "Comprendre les plugins Claude Code",
    description:
      "Qu\u2019est-ce qu\u2019un plugin Claude Code ? Architecture, marketplace, diff\u00e9rences avec les MCP et Skills, et comparaison avec les extensions VS Code.",
    priority: 0.75,
    changeFrequency: "monthly",
    lastModified: "2026-03-09",
  },
  {
    path: "/plugins/setup",
    title: "Installer et g\u00e9rer ses plugins",
    description:
      "Guide complet pour installer, configurer et g\u00e9rer les plugins Claude Code. Commandes marketplace, installation, suppression et cr\u00e9ation de plugins custom.",
    priority: 0.75,
    changeFrequency: "monthly",
    lastModified: "2026-03-09",
  },
  {
    path: "/plugins/best-essential",
    title: "Top plugins essentiels 2026",
    description:
      "Les plugins Claude Code incontournables en 2026 : Everything Claude Code, Context7, Prompt Improver, Repomix et Ralph Loop.",
    priority: 0.75,
    changeFrequency: "monthly",
    lastModified: "2026-03-09",
  },
  {
    path: "/plugins/best-design",
    title: "Plugins design & frontend",
    description:
      "Les meilleurs plugins Claude Code pour le design et le frontend : Frontend Design, UI UX Pro Max, 21st Magic et Playwright.",
    priority: 0.75,
    changeFrequency: "monthly",
    lastModified: "2026-03-09",
  },
  {
    path: "/plugins/best-security",
    title: "Plugins s\u00e9curit\u00e9 & qualit\u00e9",
    description:
      "Les meilleurs plugins Claude Code pour la s\u00e9curit\u00e9 et la qualit\u00e9 du code : Security Guidance, Code Review, AgentShield et TDD Guide.",
    priority: 0.75,
    changeFrequency: "monthly",
    lastModified: "2026-03-09",
  },
  {
    path: "/skills/what-are-skills",
    title: "Qu\u2019est-ce qu\u2019un Skill Claude Code ?",
    description:
      "Comprendre les Skills Claude Code : concept, types, fonctionnement et diff\u00e9rences avec les instructions du CLAUDE.md. Guide complet pour ma\u00eetriser les slash commands.",
    priority: 0.75,
    changeFrequency: "monthly",
    lastModified: "2026-03-10",
  },
  {
    path: "/skills/best-skills",
    title: "Top Skills recommand\u00e9s 2026",
    description:
      "Les meilleurs Skills Claude Code pour la productivit\u00e9, le d\u00e9veloppement et la qualit\u00e9 de code. TDD Guide, Code Reviewer, Frontend Design, Plan, E2E Testing et plus.",
    priority: 0.75,
    changeFrequency: "monthly",
    lastModified: "2026-03-10",
  },
  {
    path: "/skills/create-custom",
    title: "Cr\u00e9er un Skill custom pas \u00e0 pas",
    description:
      "Guide complet pour cr\u00e9er vos propres Skills Claude Code. Structure, bonnes pratiques, exemples concrets et tutoriel pas \u00e0 pas pour \u00e9crire des slash commands sur mesure.",
    priority: 0.75,
    changeFrequency: "monthly",
    lastModified: "2026-03-10",
  },
  {
    path: "/skills/comparison",
    title: "Skills vs MCP vs Plugins : le comparatif complet",
    description:
      "Comparaison d\u00e9taill\u00e9e entre Skills, MCP et Plugins Claude Code. Quand utiliser quoi, exemples concrets, combinaisons recommand\u00e9es et FAQ.",
    priority: 0.75,
    changeFrequency: "monthly",
    lastModified: "2026-03-10",
  },
  {
    path: "/agents",
    title: "Agents & Subagents : Orchestrez des workflows complexes avec Claude Code",
    description:
      "D\u00e9couvrez les agents et subagents Claude Code. Cr\u00e9ez des agents sp\u00e9cialis\u00e9s, orchestrez des workflows multi-agents et automatisez vos processus de d\u00e9veloppement.",
    priority: 0.8,
    changeFrequency: "monthly",
    lastModified: "2026-03-10",
  },
  {
    path: "/agents/what-are-agents",
    title: "Comprendre les agents et subagents Claude Code",
    description:
      "Qu\u2019est-ce qu\u2019un agent Claude Code ? D\u00e9couvrez les subagents, leur fonctionnement, les types d\u2019agents disponibles et comment ils orchestrent des workflows complexes de mani\u00e8re autonome.",
    priority: 0.75,
    changeFrequency: "monthly",
    lastModified: "2026-03-10",
  },
  {
    path: "/agents/create-subagent",
    title: "Cr\u00e9er un subagent sp\u00e9cialis\u00e9",
    description:
      "Guide complet pour cr\u00e9er des agents custom dans Claude Code. Structure d\u2019un agent, exemples concrets, configuration et bonnes pratiques d\u2019\u00e9criture de prompts pour agents.",
    priority: 0.75,
    changeFrequency: "monthly",
    lastModified: "2026-03-10",
  },
  {
    path: "/agents/agent-teams",
    title: "Agent Teams : le guide complet",
    description:
      "D\u00e9couvrez Agent Teams, la fonctionnalit\u00e9 exp\u00e9rimentale de Claude Code pour faire collaborer plusieurs agents sur un m\u00eame projet. Configuration, cas d\u2019usage et limites.",
    priority: 0.75,
    changeFrequency: "monthly",
    lastModified: "2026-03-10",
  },
  {
    path: "/agents/best-agents",
    title: "Top agents par cas d\u2019usage",
    description:
      "Les meilleurs agents Claude Code class\u00e9s par cat\u00e9gorie : d\u00e9veloppement, architecture, s\u00e9curit\u00e9, tests et maintenance. Description, quand les utiliser et exemples d\u2019invocation.",
    priority: 0.75,
    changeFrequency: "monthly",
    lastModified: "2026-03-10",
  },
  {
    path: "/agents/orchestration",
    title: "Orchestration multi-agents avanc\u00e9e",
    description:
      "Patterns d\u2019orchestration pour combiner plusieurs agents Claude Code : s\u00e9quentiel, parall\u00e8le, pipeline, split-role. Gestion du contexte, worktrees et bonnes pratiques.",
    priority: 0.75,
    changeFrequency: "monthly",
    lastModified: "2026-03-10",
  },
  {
    path: "/configurator",
    title: "Configurateur interactif Claude Code",
    description:
      "Générez votre configuration Claude Code sur mesure. CLAUDE.md, settings.json, .mcp.json et agents — en quelques clics.",
    priority: 0.85,
    changeFrequency: "monthly",
    lastModified: "2026-03-10",
  },
];
