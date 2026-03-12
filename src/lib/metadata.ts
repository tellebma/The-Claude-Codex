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
          alt: `${title} | ${SITE_NAME}`,
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
      "Le guide de r\u00e9f\u00e9rence gratuit pour ma\u00eetriser Claude Code. MCP, Skills, Prompting avanc\u00e9, pour d\u00e9veloppeurs et non-d\u00e9veloppeurs.",
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
    path: "/getting-started/prerequisites-zero",
    title: "Pr\u00e9-requis pour grands d\u00e9butants",
    description:
      "Vous n\u2019avez jamais utilis\u00e9 un terminal ? Cette page explique en langage humain : terminal, Node.js, cl\u00e9 API, npm et intelligence artificielle.",
    priority: 0.9,
    changeFrequency: "monthly",
    lastModified: "2026-03-11",
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
    lastModified: "2026-03-11",
  },
  {
    path: "/getting-started/faq-beginner",
    title: "FAQ d\u00e9butants : Questions fr\u00e9quentes sur Claude Code",
    description:
      "R\u00e9ponses honn\u00eates aux questions les plus courantes des d\u00e9butants : s\u00e9curit\u00e9, vie priv\u00e9e, co\u00fbts, diff\u00e9rence avec ChatGPT, pr\u00e9requis techniques.",
    priority: 0.85,
    changeFrequency: "monthly",
    lastModified: "2026-03-11",
  },
  {
    path: "/glossary",
    title: "Glossaire : Termes techniques expliqu\u00e9s simplement",
    description:
      "Plus de 40 termes techniques de l\u2019IA et du d\u00e9veloppement web expliqu\u00e9s en langage humain, avec des analogies concr\u00e8tes. Terminal, API, Git, npm, Docker et bien plus.",
    priority: 0.8,
    changeFrequency: "monthly",
    lastModified: "2026-03-11",
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
    path: "/mcp/securite-mcp",
    title: "S\u00e9curit\u00e9 des MCP : dangers r\u00e9els et comment s\u2019en prot\u00e9ger",
    description:
      "Guide complet de s\u00e9curit\u00e9 pour les MCP Claude Code : prompt injection, exfiltration de donn\u00e9es, supply chain attacks, permissions et checklist de s\u00e9curit\u00e9.",
    priority: 0.85,
    changeFrequency: "monthly",
    lastModified: "2026-03-11",
  },
  {
    path: "/mcp/create-mcp-typescript",
    title: "Cr\u00e9er un MCP Server en TypeScript",
    description:
      "Tutoriel complet pour cr\u00e9er votre propre MCP Server avec le SDK TypeScript : tools, resources, prompts, test local et int\u00e9gration Claude Code.",
    priority: 0.7,
    changeFrequency: "monthly",
    lastModified: "2026-03-12",
  },
  {
    path: "/mcp/create-mcp-python",
    title: "Cr\u00e9er un MCP Server en Python",
    description:
      "Tutoriel pour cr\u00e9er un MCP Server avec le SDK Python : d\u00e9corateurs, tools, resources et test avec uvx.",
    priority: 0.7,
    changeFrequency: "monthly",
    lastModified: "2026-03-12",
  },
  {
    path: "/mcp/advanced-protocol",
    title: "Protocole MCP avanc\u00e9 : transports et architecture",
    description:
      "Sp\u00e9cification JSON-RPC 2.0, transports stdio/SSE/HTTP, capabilities negotiation, s\u00e9curit\u00e9 et debugging des MCP.",
    priority: 0.7,
    changeFrequency: "monthly",
    lastModified: "2026-03-12",
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
    title: "Prompting avancé et multi-agents",
    description:
      "Techniques avancées de prompting : patterns par use case (debugging, refactoring, code review, migration, TDD), chain-of-thought, few-shot et orchestration multi-agents.",
    priority: 0.75,
    changeFrequency: "monthly",
    lastModified: "2026-03-11",
  },
  {
    path: "/prompting/context-management",
    title: "Gestion du contexte et fenêtre de 200K tokens",
    description:
      "Maîtrisez la fenêtre de contexte de Claude Code : 200K tokens, commande /compact, stratégies pour les gros projets, CLAUDE.md comme mémoire persistante et suivi des coûts.",
    priority: 0.75,
    changeFrequency: "monthly",
    lastModified: "2026-03-11",
  },
  {
    path: "/prompting/thinking-and-planning",
    title: "Extended Thinking et Plan Mode",
    description:
      "Maîtrisez l'Extended Thinking et le Plan Mode de Claude Code. Activation, cas d'usage, chain-of-thought, différences entre Haiku, Sonnet et Opus, impact sur les coûts.",
    priority: 0.75,
    changeFrequency: "monthly",
    lastModified: "2026-03-11",
  },
  {
    path: "/prompting/chaining-and-agents",
    title: "Prompt chaining et orchestration multi-agents",
    description:
      "Maîtrisez le prompt chaining et l'orchestration multi-agents avec Claude Code. 3 exemples complets, architectures fan-out/fan-in, pipeline séquentiel et configuration d'agents.",
    priority: 0.75,
    changeFrequency: "monthly",
    lastModified: "2026-03-11",
  },
  {
    path: "/prompting/non-dev-prompting",
    title: "Prompting pour non-développeurs",
    description:
      "20+ templates de prompts pour non-développeurs : communication professionnelle, analyse de documents, création de contenu, organisation. Copiez et utilisez directement.",
    priority: 0.75,
    changeFrequency: "monthly",
    lastModified: "2026-03-11",
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
      "Decouvrez les plugins Claude Code pour enrichir votre assistant IA. Agents specialises, design, securite, qualite, installez les meilleurs plugins du marketplace.",
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
    path: "/enterprise",
    title: "Claude Code en entreprise : s\u00e9curit\u00e9, adoption et gouvernance",
    description:
      "D\u00e9ployer Claude Code dans votre organisation : s\u00e9curit\u00e9, conformit\u00e9 RGPD, plan d\u2019adoption, calculateur TCO, gouvernance et FAQ enterprise.",
    priority: 0.8,
    changeFrequency: "monthly",
    lastModified: "2026-03-12",
  },
  {
    path: "/enterprise/security-compliance",
    title: "S\u00e9curit\u00e9 et conformit\u00e9 : Claude Code en entreprise",
    description:
      "Protection des donn\u00e9es, RGPD, AI Act europ\u00e9en, certifications Anthropic et bonnes pratiques de s\u00e9curit\u00e9 pour d\u00e9ployer Claude Code en entreprise.",
    priority: 0.7,
    changeFrequency: "monthly",
    lastModified: "2026-03-12",
  },
  {
    path: "/enterprise/team-adoption",
    title: "Guide d\u2019adoption d\u2019\u00e9quipe : Claude Code en entreprise",
    description:
      "Plan en 4 phases pour d\u00e9ployer Claude Code dans votre organisation : pr\u00e9paration, pilote, d\u00e9ploiement et optimisation continue.",
    priority: 0.7,
    changeFrequency: "monthly",
    lastModified: "2026-03-12",
  },
  {
    path: "/enterprise/tco-calculator",
    title: "Calculateur de co\u00fbt total (TCO) : Claude Code en entreprise",
    description:
      "Estimez le co\u00fbt de Claude Code pour votre \u00e9quipe : comparatif des plans, ROI, et comparaison avec Copilot Enterprise et Cursor Business.",
    priority: 0.7,
    changeFrequency: "monthly",
    lastModified: "2026-03-12",
  },
  {
    path: "/enterprise/faq",
    title: "FAQ Enterprise : Claude Code",
    description:
      "R\u00e9ponses aux questions fr\u00e9quentes sur le d\u00e9ploiement de Claude Code en entreprise : donn\u00e9es, conformit\u00e9, co\u00fbts, formation, propri\u00e9t\u00e9 intellectuelle et support.",
    priority: 0.7,
    changeFrequency: "monthly",
    lastModified: "2026-03-12",
  },
  {
    path: "/enterprise/governance",
    title: "Gouvernance et r\u00f4les : Claude Code en entreprise",
    description:
      "D\u00e9finissez les permissions, les r\u00f4les et les r\u00e8gles pour un d\u00e9ploiement Claude Code structur\u00e9 : audit, gestion centralis\u00e9e des configs et politiques de mise \u00e0 jour.",
    priority: 0.7,
    changeFrequency: "monthly",
    lastModified: "2026-03-12",
  },
  {
    path: "/advanced",
    title: "Utilisation avanc\u00e9e de Claude Code",
    description:
      "Hooks, mode headless, int\u00e9gration CI/CD, multi-provider et configuration enterprise. Ma\u00eetrisez les fonctionnalit\u00e9s avanc\u00e9es de Claude Code.",
    priority: 0.8,
    changeFrequency: "monthly",
    lastModified: "2026-03-11",
  },
  {
    path: "/advanced/hooks",
    title: "Syst\u00e8me de Hooks : Claude Code",
    description:
      "Automatisez vos workflows avec les hooks PreToolUse, PostToolUse et Stop. Auto-format avec Prettier, notifications Slack, rapports de session et patterns avanc\u00e9s.",
    priority: 0.75,
    changeFrequency: "monthly",
    lastModified: "2026-03-11",
  },
  {
    path: "/advanced/headless-ci",
    title: "Mode Headless et CI/CD : Claude Code",
    description:
      "Utilisez Claude Code en mode non-interactif dans vos pipelines. GitHub Actions, GitLab CI, pre-commit hooks et bonnes pratiques de s\u00e9curit\u00e9.",
    priority: 0.75,
    changeFrequency: "monthly",
    lastModified: "2026-03-11",
  },
  {
    path: "/advanced/multi-provider",
    title: "Multi-provider et Enterprise : Claude Code",
    description:
      "Configurez Claude Code avec AWS Bedrock, Google Vertex AI ou un proxy OpenAI-compatible. Gestion des credentials, s\u00e9lection de mod\u00e8le par t\u00e2che et configuration enterprise.",
    priority: 0.75,
    changeFrequency: "monthly",
    lastModified: "2026-03-11",
  },
  {
    path: "/reference",
    title: "R\u00e9f\u00e9rence technique : Claude Code",
    description:
      "Documentation de r\u00e9f\u00e9rence compl\u00e8te pour Claude Code : commandes CLI, slash commands, raccourcis clavier, settings.json et variables d\u2019environnement.",
    priority: 0.85,
    changeFrequency: "monthly",
    lastModified: "2026-03-11",
  },
  {
    path: "/reference/cheatsheet",
    title: "Cheatsheet : R\u00e9f\u00e9rence rapide Claude Code",
    description:
      "Toutes les slash commands, raccourcis clavier, fichiers de configuration et modes d\u2019ex\u00e9cution de Claude Code en un seul endroit. Format dense et copiable.",
    priority: 0.8,
    changeFrequency: "monthly",
    lastModified: "2026-03-11",
  },
  {
    path: "/reference/cli",
    title: "CLI : R\u00e9f\u00e9rence compl\u00e8te des commandes Claude Code",
    description:
      "R\u00e9f\u00e9rence exhaustive de la commande claude : tous les flags, sous-commandes mcp/config/doctor, modes d\u2019ex\u00e9cution et exemples concrets.",
    priority: 0.8,
    changeFrequency: "monthly",
    lastModified: "2026-03-11",
  },
  {
    path: "/reference/settings",
    title: "settings.json : R\u00e9f\u00e9rence de configuration Claude Code",
    description:
      "Toutes les options du fichier settings.json : 3 niveaux de configuration, permissions, MCP, mod\u00e8les, outils et exemples complets.",
    priority: 0.8,
    changeFrequency: "monthly",
    lastModified: "2026-03-11",
  },
  {
    path: "/reference/environment",
    title: "Variables d\u2019environnement : R\u00e9f\u00e9rence Claude Code",
    description:
      "Toutes les variables d\u2019environnement reconnues par Claude Code : cl\u00e9 API, mod\u00e8le, proxy, tokens, r\u00e9pertoire de config et exemples CI/CD.",
    priority: 0.8,
    changeFrequency: "monthly",
    lastModified: "2026-03-11",
  },
  {
    path: "/configurator",
    title: "Configurateur interactif Claude Code",
    description:
      "Générez votre configuration Claude Code sur mesure. CLAUDE.md, settings.json, .mcp.json et agents, en quelques clics.",
    priority: 0.85,
    changeFrequency: "monthly",
    lastModified: "2026-03-10",
  },
  {
    path: "/content/couts-reels-claude-code",
    title: "Co\u00fbts r\u00e9els de Claude Code : tokens, MCP et abonnements",
    description:
      "Calcul concret des co\u00fbts Claude Code selon votre usage : prix Anthropic \u00e0 jour, impact des MCP, comparatif des plans, et strat\u00e9gies pour optimiser votre budget.",
    priority: 0.75,
    changeFrequency: "monthly",
    lastModified: "2026-03-11",
  },
  {
    path: "/content/mythes-claude-code",
    title: "8 id\u00e9es re\u00e7ues sur Claude Code : Mythes et r\u00e9alit\u00e9s",
    description:
      "Les 8 mythes les plus r\u00e9pandus sur Claude Code d\u00e9mystifi\u00e9s : s\u00e9curit\u00e9 des MCP, co\u00fbts, terminologie, risques du mode auto et limites du contexte.",
    priority: 0.75,
    changeFrequency: "monthly",
    lastModified: "2026-03-11",
  },
  {
    path: "/content/bonnes-pratiques-securite",
    title: "Guide de s\u00e9curit\u00e9 Claude Code : bonnes pratiques",
    description:
      "Guide complet de s\u00e9curit\u00e9 pour Claude Code : principe du moindre privil\u00e8ge, audit des MCP, profils de configuration, monitoring et checklist copiable.",
    priority: 0.75,
    changeFrequency: "monthly",
    lastModified: "2026-03-11",
  },
];
