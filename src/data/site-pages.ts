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
  /**
   * Per-locale path overrides. When a locale diverges from the canonical
   * `path` (for example when a slug has been translated), list its
   * locale-specific path here. Locales absent from this map fall back to
   * `path`. The keys are locale codes (e.g. "fr", "en").
   */
  readonly pathsByLocale?: Readonly<Record<string, string>>;
}

export const SITE_PAGES: ReadonlyArray<PageInfo> = [
  {
    path: "/",
    title: "Maîtrisez Claude Code",
    description:
      "Le guide de référence gratuit pour maîtriser Claude Code. MCP, Skills, Prompting avancé, pour développeurs et non-développeurs.",
    priority: 1.0,
    changeFrequency: "weekly",
    lastModified: "2026-03-07",
  },
  {
    path: "/getting-started",
    title: "Premiers pas avec Claude Code",
    description:
      "Guide complet pour installer, configurer et utiliser Claude Code. De zéro à votre premier projet en quelques minutes.",
    priority: 0.9,
    changeFrequency: "monthly",
    lastModified: "2026-03-09",
  },
  {
    path: "/getting-started/prerequisites-zero",
    title: "Pré-requis pour grands débutants",
    description:
      "Vous n’avez jamais utilisé un terminal ? Cette page explique en langage humain : terminal, Node.js, clé API, npm et intelligence artificielle.",
    priority: 0.9,
    changeFrequency: "monthly",
    lastModified: "2026-03-11",
  },
  {
    path: "/getting-started/what-is-claude-code",
    title: "Qu’est-ce que Claude Code ?",
    description:
      "Découvrez Claude Code, l’assistant IA en ligne de commande d’Anthropic. Comprenez ce qui le différencie de Copilot ou Cursor.",
    priority: 0.85,
    changeFrequency: "monthly",
    lastModified: "2026-03-09",
  },
  {
    path: "/getting-started/installation",
    title: "Prérequis et installation de Claude Code",
    description:
      "Installez Claude Code en quelques minutes : Node.js 18+, npm, authentification API key ou Max, et résolution des erreurs courantes.",
    priority: 0.85,
    changeFrequency: "monthly",
    lastModified: "2026-03-09",
  },
  {
    path: "/getting-started/environment-setup",
    title: "Configuration de l’environnement Claude Code",
    description:
      "Configurez Claude Code : variable d’environnement API key, fichier settings.json, fichier CLAUDE.md, permissions et sécurité.",
    priority: 0.85,
    changeFrequency: "monthly",
    lastModified: "2026-03-09",
  },
  {
    path: "/getting-started/first-project",
    title: "Premier projet avec Claude Code",
    description:
      "Tutoriel concret : créez votre premier site web avec Claude Code en 5 minutes. Exemples de prompts et bonnes pratiques.",
    priority: 0.85,
    changeFrequency: "monthly",
    lastModified: "2026-03-11",
  },
  {
    path: "/getting-started/faq-beginner",
    title: "FAQ débutants : Questions fréquentes sur Claude Code",
    description:
      "Réponses honnêtes aux questions les plus courantes des débutants : sécurité, vie privée, coûts, différence avec ChatGPT, prérequis techniques.",
    priority: 0.85,
    changeFrequency: "monthly",
    lastModified: "2026-03-11",
  },
  {
    path: "/glossary",
    title: "Glossaire IA & Claude Code",
    description:
      "Plus de 40 termes techniques de l’IA et du développement web expliqués en langage humain, avec des analogies concrètes. Terminal, API, Git, npm, Docker et bien plus.",
    priority: 0.8,
    changeFrequency: "monthly",
    lastModified: "2026-03-11",
  },
  {
    path: "/mcp",
    title: "Les MCP pour Claude Code",
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
      "Découvrez le Model Context Protocol (MCP) : l’adaptateur universel qui connecte Claude Code à vos outils. Architecture, fonctionnement et différences avec les plugins et skills.",
    priority: 0.85,
    changeFrequency: "monthly",
    lastModified: "2026-03-09",
  },
  {
    path: "/mcp/setup",
    title: "Installer et configurer un MCP",
    description:
      "Guide complet pour installer, configurer et déboguer un MCP dans Claude Code. Fichier .mcp.json, commande claude mcp add, et résolution des problèmes courants.",
    priority: 0.85,
    changeFrequency: "monthly",
    lastModified: "2026-03-09",
  },
  {
    path: "/mcp/best-productivity",
    title: "Top MCP productivité",
    description:
      "Les meilleurs MCP pour booster votre productivité avec Claude Code : Figma, Lighthouse, Gmail, Slack et Google Calendar.",
    priority: 0.85,
    changeFrequency: "monthly",
    lastModified: "2026-03-09",
  },
  {
    path: "/mcp/best-development",
    title: "Top MCP développement",
    description:
      "Les meilleurs MCP pour le développement avec Claude Code : Context7, Sentry, Linear, PostgreSQL/Supabase et GitHub.",
    priority: 0.85,
    changeFrequency: "monthly",
    lastModified: "2026-03-09",
  },
  {
    path: "/mcp/best-design",
    title: "Top MCP design & UI",
    description:
      "Les meilleurs MCP pour le design et l’UI avec Claude Code : Playwright, Chrome DevTools, 21st.dev Magic et Puppeteer.",
    priority: 0.85,
    changeFrequency: "monthly",
    lastModified: "2026-03-09",
  },
  {
    path: "/mcp/first-workflow",
    title: "Créer son premier workflow MCP",
    description:
      "Tutoriel pas à pas pour combiner Context7, GitHub et Playwright dans un workflow MCP complet.",
    priority: 0.85,
    changeFrequency: "monthly",
    lastModified: "2026-03-09",
  },
  {
    path: "/mcp/securite-mcp",
    pathsByLocale: { en: "/mcp/mcp-security" },
    title: "Sécurité des MCP : dangers réels et comment s’en protéger",
    description:
      "Guide complet de sécurité pour les MCP Claude Code : prompt injection, exfiltration de données, supply chain attacks, permissions et checklist de sécurité.",
    priority: 0.85,
    changeFrequency: "monthly",
    lastModified: "2026-04-20",
  },
  {
    path: "/mcp/create-mcp-typescript",
    title: "Créer un MCP Server en TypeScript",
    description:
      "Tutoriel complet pour créer votre propre MCP Server avec le SDK TypeScript : tools, resources, prompts, test local et intégration Claude Code.",
    priority: 0.7,
    changeFrequency: "monthly",
    lastModified: "2026-03-12",
  },
  {
    path: "/mcp/create-mcp-python",
    title: "Créer un MCP Server en Python",
    description:
      "Tutoriel pour créer un MCP Server avec le SDK Python : décorateurs, tools, resources et test avec uvx.",
    priority: 0.7,
    changeFrequency: "monthly",
    lastModified: "2026-03-12",
  },
  {
    path: "/mcp/advanced-protocol",
    title: "Protocole MCP avancé : transports et architecture",
    description:
      "Spécification JSON-RPC 2.0, transports stdio/SSE/HTTP, capabilities negotiation, sécurité et debugging des MCP.",
    priority: 0.7,
    changeFrequency: "monthly",
    lastModified: "2026-03-12",
  },
  {
    path: "/skills",
    title: "Les Skills Claude Code",
    description:
      "Apprenez à utiliser et créer des Skills pour Claude Code. Automatisez vos workflows, ajoutez des capacités et enseignez de nouveaux talents à votre assistant IA.",
    priority: 0.8,
    changeFrequency: "monthly",
    lastModified: "2026-03-10",
  },
  {
    path: "/prompting",
    title: "Prompting : L’art de communiquer avec l’IA",
    description:
      "Maîtrisez l’art du prompting avec Claude Code. Techniques, templates et bonnes pratiques pour tirer le maximum de l’IA.",
    priority: 0.8,
    changeFrequency: "monthly",
    lastModified: "2026-03-10",
  },
  {
    path: "/prompting/basics",
    title: "Les bases du prompting avec Claude Code",
    description:
      "Apprenez les fondamentaux du prompting avec Claude Code. Structure d’un bon prompt, 5 principes clés, exemples avant/après et erreurs de débutants à éviter.",
    priority: 0.75,
    changeFrequency: "monthly",
    lastModified: "2026-03-10",
  },
  {
    path: "/prompting/directives",
    title: "Les directives qui font la différence",
    description:
      "Maîtrisez les directives avancées de prompting : rôles, contraintes, formats de sortie, patterns DO/DON’T et instructions système pour cadrer Claude Code efficacement.",
    priority: 0.75,
    changeFrequency: "monthly",
    lastModified: "2026-03-10",
  },
  {
    path: "/prompting/templates",
    title: "Templates de prompts par métier",
    description:
      "Templates de prompts prêts à l’emploi pour développeurs web, mobile, backend, DevOps, designers et rédacteurs. Copiez, adaptez et utilisez directement avec Claude Code.",
    priority: 0.75,
    changeFrequency: "monthly",
    lastModified: "2026-03-10",
  },
  {
    path: "/prompting/mistakes",
    title: "Erreurs courantes à éviter",
    description:
      "Les 10 erreurs les plus fréquentes en prompting avec Claude Code. Pour chaque erreur : description, impact, correction et exemples concrets de mauvais vs bon prompt.",
    priority: 0.75,
    changeFrequency: "monthly",
    lastModified: "2026-03-10",
  },
  {
    path: "/prompting/claude-md",
    title: "Le guide complet CLAUDE.md",
    description:
      "Tout sur le fichier CLAUDE.md : rôle, structure, bonnes pratiques, commande /init, différences avec settings.json et .claude/rules/. Exemples réels et recommandations.",
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
    lastModified: "2026-04-20",
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
    lastModified: "2026-03-12",
  },
  {
    path: "/future/why-ai-matters",
    title: "L'IA et les métiers du développement",
    description:
      "Comment l'intelligence artificielle transforme concrètement le quotidien des développeurs. Opportunités par profil, exemples avant/après, et ce qui ne changera pas.",
    priority: 0.7,
    changeFrequency: "monthly",
    lastModified: "2026-03-12",
  },
  {
    path: "/future/trends-2026",
    title: "Tendances IA 2026",
    description:
      "Agents autonomes, MCP comme standard, multimodalité, évolution des IDE IA et impact sur les méthodologies de développement. Les tendances qui façonnent 2026.",
    priority: 0.7,
    changeFrequency: "monthly",
    lastModified: "2026-03-12",
  },
  {
    path: "/future/roadmap",
    title: "Roadmap du projet The Claude Codex",
    description:
      "Ce qui a été fait, ce qui arrive, et comment contribuer. La feuille de route du guide de référence francophone pour Claude Code.",
    priority: 0.7,
    changeFrequency: "monthly",
    lastModified: "2026-03-12",
  },
  {
    path: "/content",
    title: "Contenus éditoriaux",
    description:
      "Tous les articles et guides éditoriaux du Claude Codex. Explorez nos contenus MDX sur Claude Code, les MCP, les Skills et le prompting.",
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
      "Qu’est-ce qu’un plugin Claude Code ? Architecture, marketplace, différences avec les MCP et Skills, et comparaison avec les extensions VS Code.",
    priority: 0.75,
    changeFrequency: "monthly",
    lastModified: "2026-03-09",
  },
  {
    path: "/plugins/setup",
    title: "Installer et gérer ses plugins",
    description:
      "Guide complet pour installer, configurer et gérer les plugins Claude Code. Commandes marketplace, installation, suppression et création de plugins custom.",
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
    title: "Plugins sécurité & qualité",
    description:
      "Les meilleurs plugins Claude Code pour la sécurité et la qualité du code : Security Guidance, Code Review, AgentShield et TDD Guide.",
    priority: 0.75,
    changeFrequency: "monthly",
    lastModified: "2026-03-09",
  },
  {
    path: "/skills/what-are-skills",
    title: "Qu’est-ce qu’un Skill Claude Code ?",
    description:
      "Les Skills Claude Code expliqués : workflows Markdown réutilisables déclenchés par slash commands. Fonctionnement, création, et différences avec les MCP et plugins.",
    priority: 0.75,
    changeFrequency: "monthly",
    lastModified: "2026-04-13",
  },
  {
    path: "/skills/best-skills",
    title: "Top Skills recommandés 2026",
    description:
      "Les meilleurs Skills Claude Code pour la productivité, le développement et la qualité de code. TDD Guide, Code Reviewer, Frontend Design, Plan, E2E Testing et plus.",
    priority: 0.75,
    changeFrequency: "monthly",
    lastModified: "2026-03-10",
  },
  {
    path: "/skills/create-custom",
    title: "Créer un Skill custom pas à pas",
    description:
      "Guide complet pour créer vos propres Skills Claude Code. Structure, bonnes pratiques, exemples concrets et tutoriel pas à pas pour écrire des slash commands sur mesure.",
    priority: 0.75,
    changeFrequency: "monthly",
    lastModified: "2026-03-10",
  },
  {
    path: "/skills/comparison",
    title: "Skills vs MCP vs Plugins : le comparatif complet",
    description:
      "Comparaison détaillée entre Skills, MCP et Plugins Claude Code. Quand utiliser quoi, exemples concrets, combinaisons recommandées et FAQ.",
    priority: 0.75,
    changeFrequency: "monthly",
    lastModified: "2026-03-10",
  },
  {
    path: "/agents",
    title: "Agents & Subagents : Orchestrez des workflows complexes avec Claude Code",
    description:
      "Découvrez les agents et subagents Claude Code. Créez des agents spécialisés, orchestrez des workflows multi-agents et automatisez vos processus de développement.",
    priority: 0.8,
    changeFrequency: "monthly",
    lastModified: "2026-03-10",
  },
  {
    path: "/agents/what-are-agents",
    title: "Comprendre les agents et subagents Claude Code",
    description:
      "Qu’est-ce qu’un agent Claude Code ? Découvrez les subagents, leur fonctionnement, les types d’agents disponibles et comment ils orchestrent des workflows complexes de manière autonome.",
    priority: 0.75,
    changeFrequency: "monthly",
    lastModified: "2026-03-10",
  },
  {
    path: "/agents/create-subagent",
    title: "Créer un subagent spécialisé",
    description:
      "Guide complet pour créer des agents custom dans Claude Code. Structure d’un agent, exemples concrets, configuration et bonnes pratiques d’écriture de prompts pour agents.",
    priority: 0.75,
    changeFrequency: "monthly",
    lastModified: "2026-03-10",
  },
  {
    path: "/agents/agent-teams",
    title: "Agent Teams : le guide complet",
    description:
      "Découvrez Agent Teams, la fonctionnalité expérimentale de Claude Code pour faire collaborer plusieurs agents sur un même projet. Configuration, cas d’usage et limites.",
    priority: 0.75,
    changeFrequency: "monthly",
    lastModified: "2026-03-10",
  },
  {
    path: "/agents/best-agents",
    title: "Top agents par cas d’usage",
    description:
      "Les meilleurs agents Claude Code classés par catégorie : développement, architecture, sécurité, tests et maintenance. Description, quand les utiliser et exemples d’invocation.",
    priority: 0.75,
    changeFrequency: "monthly",
    lastModified: "2026-03-10",
  },
  {
    path: "/agents/orchestration",
    title: "Orchestration multi-agents avancée",
    description:
      "Patterns d’orchestration pour combiner plusieurs agents Claude Code : séquentiel, parallèle, pipeline, split-role. Gestion du contexte, worktrees et bonnes pratiques.",
    priority: 0.75,
    changeFrequency: "monthly",
    lastModified: "2026-03-12",
  },
  {
    path: "/agents/agent-sdk",
    title: "Claude Agent SDK : construire des agents programmatiques",
    description:
      "Utilisez le Claude Agent SDK pour créer des agents en TypeScript et Python. Intégration d’outils, monitoring automatisé, pipelines de déploiement et comparaison avec les subagents natifs.",
    priority: 0.75,
    changeFrequency: "monthly",
    lastModified: "2026-03-12",
  },
  {
    path: "/agents/performance-limits",
    title: "Performance et limites des agents",
    description:
      "Coûts en tokens, profondeur de récursion, gestion d’erreurs et timeouts. Stratégies de retry et bonnes pratiques production pour les agents Claude Code.",
    priority: 0.75,
    changeFrequency: "monthly",
    lastModified: "2026-03-12",
  },
  {
    path: "/use-cases",
    title: "Claude Code pour tous : cas d’usage concrets",
    description:
      "Des exemples pratiques de Claude Code pour non-développeurs. Cas d’usage business, histoires de réussite et tutoriels sans code.",
    priority: 0.85,
    changeFrequency: "monthly",
    lastModified: "2026-03-12",
  },
  {
    path: "/use-cases/business",
    title: "Cas d’usage business : 8 exemples concrets",
    description:
      "8 cas d’usage professionnels de Claude Code pour non-développeurs : email, résumé, analyse de données, présentation, planning, post LinkedIn, rapport et veille.",
    priority: 0.8,
    changeFrequency: "monthly",
    lastModified: "2026-03-12",
  },
  {
    path: "/use-cases/success-stories",
    title: "Histoires de réussite : des non-développeurs racontent",
    description:
      "4 professionnels non-développeurs partagent comment Claude Code a transformé leur quotidien. Marketing, RH, finance et gestion de projet.",
    priority: 0.8,
    changeFrequency: "monthly",
    lastModified: "2026-03-12",
  },
  {
    path: "/use-cases/no-code",
    title: "Tutoriels sans code : automatiser ses tâches courantes",
    description:
      "3 tutoriels pas à pas pour automatiser un rapport, créer un template email et générer une présentation, le tout sans écrire une seule ligne de code.",
    priority: 0.8,
    changeFrequency: "monthly",
    lastModified: "2026-03-12",
  },
  {
    path: "/enterprise",
    title: "Claude Code en entreprise",
    description:
      "Déployer Claude Code dans votre organisation : sécurité, conformité RGPD, plan d’adoption, calculateur TCO, gouvernance et FAQ enterprise.",
    priority: 0.8,
    changeFrequency: "monthly",
    lastModified: "2026-03-12",
  },
  {
    path: "/enterprise/security-compliance",
    title: "Sécurité et conformité : Claude Code en entreprise",
    description:
      "Protection des données, RGPD, AI Act européen, certifications Anthropic et bonnes pratiques de sécurité pour déployer Claude Code en entreprise.",
    priority: 0.7,
    changeFrequency: "monthly",
    lastModified: "2026-03-12",
  },
  {
    path: "/enterprise/team-adoption",
    title: "Guide d’adoption d’équipe : Claude Code en entreprise",
    description:
      "Plan en 4 phases pour déployer Claude Code dans votre organisation : préparation, pilote, déploiement et optimisation continue.",
    priority: 0.7,
    changeFrequency: "monthly",
    lastModified: "2026-03-12",
  },
  {
    path: "/enterprise/tco-calculator",
    title: "Calculateur de coût total (TCO) : Claude Code en entreprise",
    description:
      "Estimez le coût de Claude Code pour votre équipe : comparatif des plans, ROI, et comparaison avec Copilot Enterprise et Cursor Business.",
    priority: 0.7,
    changeFrequency: "monthly",
    lastModified: "2026-03-12",
  },
  {
    path: "/enterprise/faq",
    title: "FAQ Enterprise : Claude Code",
    description:
      "Réponses aux questions fréquentes sur le déploiement de Claude Code en entreprise : données, conformité, coûts, formation, propriété intellectuelle et support.",
    priority: 0.7,
    changeFrequency: "monthly",
    lastModified: "2026-03-12",
  },
  {
    path: "/enterprise/governance",
    title: "Gouvernance et rôles : Claude Code en entreprise",
    description:
      "Définissez les permissions, les rôles et les règles pour un déploiement Claude Code structuré : audit, gestion centralisée des configs et politiques de mise à jour.",
    priority: 0.7,
    changeFrequency: "monthly",
    lastModified: "2026-03-12",
  },
  {
    path: "/advanced",
    title: "Utilisation avancée de Claude Code",
    description:
      "Hooks, mode headless, intégration CI/CD, multi-provider et configuration enterprise. Maîtrisez les fonctionnalités avancées de Claude Code.",
    priority: 0.8,
    changeFrequency: "monthly",
    lastModified: "2026-03-11",
  },
  {
    path: "/advanced/hooks",
    title: "Système de Hooks : Claude Code",
    description:
      "Automatisez vos workflows avec les hooks PreToolUse, PostToolUse et Stop. Auto-format avec Prettier, notifications Slack, rapports de session et patterns avancés.",
    priority: 0.75,
    changeFrequency: "monthly",
    lastModified: "2026-03-11",
  },
  {
    path: "/advanced/headless-ci",
    title: "Mode Headless et CI/CD : Claude Code",
    description:
      "Utilisez Claude Code en mode non-interactif dans vos pipelines. GitHub Actions, GitLab CI, pre-commit hooks et bonnes pratiques de sécurité.",
    priority: 0.75,
    changeFrequency: "monthly",
    lastModified: "2026-03-11",
  },
  {
    path: "/advanced/multi-provider",
    title: "Multi-provider et Enterprise : Claude Code",
    description:
      "Configurez Claude Code avec AWS Bedrock, Google Vertex AI ou un proxy OpenAI-compatible. Gestion des credentials, sélection de modèle par tâche et configuration enterprise.",
    priority: 0.75,
    changeFrequency: "monthly",
    lastModified: "2026-03-11",
  },
  {
    path: "/advanced/mcp-profiles",
    title: "Profils MCP : un Claude par mission",
    description:
      "Créez des profils spécialisés (SEO, UX, sécurité, dev) en combinant .mcp.json, CLAUDE.md et des alias shell. Chaque mission a son propre Claude.",
    priority: 0.75,
    changeFrequency: "monthly",
    lastModified: "2026-04-12",
  },
  {
    path: "/advanced/ultraplan",
    title: "Ultraplan : planifier dans le cloud",
    description:
      "Lancez un plan depuis votre CLI, affinez-le sur Claude Code web avec commentaires inline, puis exécutez-le dans le cloud ou en local.",
    priority: 0.8,
    changeFrequency: "monthly",
    lastModified: "2026-04-12",
  },
  {
    path: "/reference",
    title: "Référence technique : Claude Code",
    description:
      "Documentation de référence complète pour Claude Code : commandes CLI, slash commands, raccourcis clavier, settings.json et variables d’environnement.",
    priority: 0.85,
    changeFrequency: "monthly",
    lastModified: "2026-03-11",
  },
  {
    path: "/reference/cheatsheet",
    title: "Cheatsheet : Référence rapide Claude Code",
    description:
      "Toutes les slash commands, raccourcis clavier, fichiers de configuration et modes d’exécution de Claude Code en un seul endroit. Format dense et copiable.",
    priority: 0.8,
    changeFrequency: "monthly",
    lastModified: "2026-03-11",
  },
  {
    path: "/reference/cli",
    title: "CLI : Référence complète des commandes Claude Code",
    description:
      "Référence exhaustive de la commande claude : tous les flags, sous-commandes mcp/config/doctor, modes d’exécution et exemples concrets.",
    priority: 0.8,
    changeFrequency: "monthly",
    lastModified: "2026-03-11",
  },
  {
    path: "/reference/settings",
    title: "settings.json : Référence de configuration Claude Code",
    description:
      "Toutes les options du fichier settings.json : 3 niveaux de configuration, permissions, MCP, modèles, outils et exemples complets.",
    priority: 0.8,
    changeFrequency: "monthly",
    lastModified: "2026-03-11",
  },
  {
    path: "/reference/environment",
    title: "Variables d’environnement Claude Code : référence complète (clé API, proxy, limites)",
    description:
      "Toutes les variables d’environnement Claude Code : ANTHROPIC_API_KEY, ANTHROPIC_BASE_URL, BASH_MAX_OUTPUT_LENGTH, MAX_THINKING_TOKENS, NO_PROXY, claudeCode.environmentVariables.",
    priority: 0.8,
    changeFrequency: "monthly",
    lastModified: "2026-04-20",
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
    path: "/personas",
    title: "Parcours personas : trouvez votre chemin",
    description:
      "Cinq parcours de lecture adaptés à votre profil. Développeur, lead technique, non-développeur, freelance ou étudiant : suivez le guide qui vous correspond.",
    priority: 0.8,
    changeFrequency: "monthly",
    lastModified: "2026-03-12",
  },
  {
    path: "/personas/developer",
    title: "Parcours développeur",
    description:
      "Itinéraire de lecture pour les développeurs qui veulent coder plus vite avec Claude Code. Installation, prompting, MCP, agents et techniques avancées.",
    priority: 0.75,
    changeFrequency: "monthly",
    lastModified: "2026-03-12",
  },
  {
    path: "/personas/team-lead",
    title: "Parcours lead technique",
    description:
      "Itinéraire pour les leads techniques et managers qui déploient Claude Code dans leur équipe. Adoption, gouvernance, sécurité, CI/CD et bonnes pratiques.",
    priority: 0.75,
    changeFrequency: "monthly",
    lastModified: "2026-03-12",
  },
  {
    path: "/personas/non-dev",
    title: "Parcours non-développeur",
    description:
      "Itinéraire pour les non-développeurs qui découvrent Claude Code. Pré-requis, premiers pas, cas d’usage concrets et prompting adapté.",
    priority: 0.75,
    changeFrequency: "monthly",
    lastModified: "2026-03-12",
  },
  {
    path: "/personas/freelance",
    title: "Parcours freelance",
    description:
      "Itinéraire pour les freelances et indépendants qui veulent maximiser leur productivité avec Claude Code. Plugins, automatisation, MCP et workflows optimisés.",
    priority: 0.75,
    changeFrequency: "monthly",
    lastModified: "2026-03-12",
  },
  {
    path: "/personas/student",
    title: "Parcours étudiant",
    description:
      "Itinéraire pour les étudiants qui apprennent à coder avec Claude Code. Fondamentaux, projets pratiques, bonnes pratiques et préparation professionnelle.",
    priority: 0.75,
    changeFrequency: "monthly",
    lastModified: "2026-03-12",
  },
  {
    path: "/limits",
    title: "Limites de Claude Code",
    description:
      "Un tour d'horizon honnête des limites de Claude Code, des comparaisons équilibrées avec Copilot et Cursor, et un guide pour savoir quand ne PAS utiliser cet outil.",
    priority: 0.8,
    changeFrequency: "monthly",
    lastModified: "2026-03-12",
  },
  {
    path: "/limits/known-limitations",
    title: "Limites connues de Claude Code",
    description:
      "Les contraintes réelles de Claude Code en 2026 : fenêtre de contexte, hallucinations, exécution de code, latence, coûts et support des langages.",
    priority: 0.75,
    changeFrequency: "monthly",
    lastModified: "2026-03-12",
  },
  {
    path: "/limits/vs-copilot",
    title: "Claude Code vs GitHub Copilot : comparatif honnête (2026)",
    description:
      "Agent CLI vs autocomplétion IDE : prix, mode agent, intégration IDE et qualité du code comparés. Forces, faiblesses, et quel outil choisir selon votre cas d'usage.",
    priority: 0.75,
    changeFrequency: "monthly",
    lastModified: "2026-04-13",
  },
  {
    path: "/limits/vs-cursor",
    title: "Claude Code vs Cursor : comparaison honnête",
    description:
      "Comparaison équilibrée entre Claude Code et Cursor. Deux approches agent, terminal vs IDE, MCP vs multi-modèle.",
    priority: 0.75,
    changeFrequency: "monthly",
    lastModified: "2026-03-12",
  },
  {
    path: "/limits/when-not-to-use",
    title: "Quand ne PAS utiliser Claude Code",
    description:
      "Les situations où Claude Code n'est pas le bon choix : systèmes temps réel, industries réglementées, code critique sans revue, prototypage UI.",
    priority: 0.75,
    changeFrequency: "monthly",
    lastModified: "2026-03-12",
  },
  {
    path: "/content/couts-reels-claude-code",
    pathsByLocale: { en: "/content/real-costs-claude-code" },
    title: "Coûts réels de Claude Code : tokens, MCP et abonnements",
    description:
      "Calcul concret des coûts Claude Code selon votre usage : prix Anthropic à jour, impact des MCP, comparatif des plans, et stratégies pour optimiser votre budget.",
    priority: 0.75,
    changeFrequency: "monthly",
    lastModified: "2026-04-20",
  },
  {
    path: "/content/mythes-claude-code",
    pathsByLocale: { en: "/content/claude-code-myths" },
    title: "8 idées reçues sur Claude Code : Mythes et réalités",
    description:
      "Les 8 mythes les plus répandus sur Claude Code démystifiés : sécurité des MCP, coûts, terminologie, risques du mode auto et limites du contexte.",
    priority: 0.75,
    changeFrequency: "monthly",
    lastModified: "2026-04-20",
  },
  {
    path: "/content/bonnes-pratiques-securite",
    pathsByLocale: { en: "/content/security-best-practices" },
    title: "Sécurité Claude Code : bonnes pratiques et checklist copiable",
    description:
      "Moindre privilège, audit MCP, profils sandboxés, scan des secrets : guide pratique avec checklist prête à l'emploi pour sécuriser Claude Code en équipe.",
    priority: 0.75,
    changeFrequency: "monthly",
    lastModified: "2026-04-20",
  },
  {
    path: "/content/claude-design-vs-figma",
    title: "Claude Design vs Figma : qui va gagner la guerre du design IA en 2026 ?",
    description:
      "Claude Design (Anthropic Labs, avril 2026) attaque frontalement Figma AI. Comparatif honnête : conversation vs toile, itération, brand system, handoff dev.",
    priority: 0.85,
    changeFrequency: "monthly",
    lastModified: "2026-04-20",
  },
  {
    path: "/content/fuite-cle-api",
    pathsByLocale: { en: "/content/leaked-api-key-recovery" },
    title: "Clé API Anthropic fuitée ? Plan d'action en 5 étapes (2026)",
    description:
      "Votre clé API Anthropic sk-ant a fuité dans un commit, screenshot ou log ? Révoquez-la, faites la rotation, auditez les dégâts. Guide de récupération pas à pas.",
    priority: 0.8,
    changeFrequency: "monthly",
    lastModified: "2026-04-20",
  },
  {
    path: "/content/mode-plan-vs-thinking",
    pathsByLocale: { en: "/content/plan-vs-thinking-mode" },
    title: "Mode Plan vs Mode Thinking dans Claude Code : les différences clés",
    description:
      "Le mode Plan fait proposer un plan à Claude avant de toucher au code. Le mode Thinking lui fait raisonner plus longtemps. Deux leviers distincts, deux objectifs différents.",
    priority: 0.8,
    changeFrequency: "monthly",
    lastModified: "2026-04-20",
  },
  {
    path: "/content/ne-pas-donner-cles-api-a-claude-code",
    pathsByLocale: { en: "/content/do-not-give-api-keys-to-claude-code" },
    title: "Ne donnez jamais vos clés API ni vos vaults à Claude Code : ce qui peut vraiment mal tourner",
    description:
      "Partager une clé API ou un fichier vault avec Claude Code peut entraîner exfiltration, leak dans les logs ou commit public. Guide pratique pour cloisonner proprement.",
    priority: 0.85,
    changeFrequency: "monthly",
    lastModified: "2026-04-21",
  },
  {
    path: "/content/ci-cd-cyber-securite",
    pathsByLocale: { en: "/content/ci-cd-cyber-security" },
    title: "CI/CD et cybersécurité en 2026 : pourquoi c'est devenu non-négociable avec les agents IA",
    description:
      "Avec l'explosion du code généré par IA, une CI/CD robuste n'est plus un bonus : c'est la ligne de défense. Guide pratique avec Red Team, Blue Team et Purple Team.",
    priority: 0.85,
    changeFrequency: "monthly",
    lastModified: "2026-04-21",
  },
  {
    path: "/about",
    title: "À propos du Claude Codex",
    description:
      "Qui sommes-nous, pourquoi ce guide existe, et comment contribuer au projet open-source The Claude Codex.",
    priority: 0.5,
    changeFrequency: "monthly",
    lastModified: "2026-03-14",
  },
];
