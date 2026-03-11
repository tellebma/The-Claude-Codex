export interface SearchEntry {
  readonly title: string;
  readonly description: string;
  readonly href: string;
  readonly section: string;
  readonly keywords: ReadonlyArray<string>;
}

export const searchIndex: ReadonlyArray<SearchEntry> = [
  // Getting Started
  {
    title: "Premiers pas avec Claude Code",
    description:
      "Guide complet pour installer, configurer et utiliser Claude Code. De zero a votre premier projet.",
    href: "/getting-started",
    section: "Demarrer",
    keywords: [
      "installation",
      "configuration",
      "premiers pas",
      "demarrer",
      "debutant",
      "node",
      "npm",
      "terminal",
      "api key",
      "CLAUDE.md",
      "settings.json",
      "hello world",
    ],
  },
  {
    title: "Pre-requis pour grands debutants",
    description:
      "Terminal, Node.js, cle API, npm expliques en langage humain avec des analogies concretes. Pour ceux qui n'ont jamais ouvert un terminal.",
    href: "/getting-started/prerequisites-zero",
    section: "Demarrer",
    keywords: [
      "debutant",
      "terminal",
      "node.js",
      "cle api",
      "npm",
      "intelligence artificielle",
      "ia",
      "commande",
      "invite de commandes",
      "console",
      "zero",
      "novice",
      "prerequis",
    ],
  },
  {
    title: "FAQ debutants — Questions frequentes sur Claude Code",
    description:
      "Reponses aux questions les plus courantes : securite, vie privee, couts, difference avec ChatGPT, prerequis techniques.",
    href: "/getting-started/faq-beginner",
    section: "Demarrer",
    keywords: [
      "faq",
      "questions",
      "securite",
      "vie privee",
      "gratuit",
      "cout",
      "prix",
      "chatgpt",
      "difference",
      "abonnement",
      "annuler",
      "emploi",
      "legal",
      "casser",
      "ordinateur",
      "tablette",
      "telephone",
    ],
  },
  {
    title: "Glossaire — Termes techniques expliques simplement",
    description:
      "Plus de 40 termes techniques de l'IA et du developpement web expliques avec des analogies. Terminal, API, Git, npm, Docker et bien plus.",
    href: "/glossary",
    section: "Reference",
    keywords: [
      "glossaire",
      "vocabulaire",
      "termes",
      "definitions",
      "terminal",
      "api",
      "git",
      "npm",
      "docker",
      "typescript",
      "react",
      "hook",
      "composant",
      "token",
      "contexte",
      "mcp",
      "skill",
      "plugin",
      "commit",
      "branche",
    ],
  },
  // MCP
  {
    title: "Les MCP : Super-pouvoirs pour Claude Code",
    description:
      "Decouvrez les MCP (Model Context Protocol) pour connecter Claude Code a vos outils favoris.",
    href: "/mcp",
    section: "MCP",
    keywords: [
      "mcp",
      "model context protocol",
      "plugin",
      "extension",
      "github",
      "slack",
      "gmail",
      "filesystem",
      "database",
      "postgresql",
      "sqlite",
      "puppeteer",
      "playwright",
      "connecter",
      "outil",
    ],
  },
  // Skills
  {
    title: "Les Skills : Enseignez de nouveaux talents a Claude Code",
    description:
      "Apprenez a utiliser et creer des Skills pour Claude Code. Automatisez vos workflows.",
    href: "/skills",
    section: "Skills",
    keywords: [
      "skills",
      "competences",
      "automatiser",
      "workflow",
      "tdd",
      "code review",
      "planner",
      "security",
      "testing",
      "e2e",
      "recette",
      "personnalise",
      "custom",
    ],
  },
  // Prompting
  {
    title: "L'art du prompting avec Claude Code",
    description:
      "Maitrisez l'art de communiquer avec l'IA. Techniques, templates et bonnes pratiques.",
    href: "/prompting",
    section: "Prompting",
    keywords: [
      "prompting",
      "prompt",
      "template",
      "technique",
      "chaining",
      "multi-agent",
      "workflow",
      "CLAUDE.md",
      "few-shot",
      "specifique",
      "role",
      "format",
      "iterer",
      "erreurs",
    ],
  },
  {
    title: "Les bases du prompting avec Claude Code",
    description:
      "Fondamentaux du prompting : structure d'un bon prompt, 5 principes cles, exemples avant/apres pour developpeurs, entrepreneurs et etudiants.",
    href: "/prompting/basics",
    section: "Prompting",
    keywords: [
      "bases",
      "fondamentaux",
      "structure",
      "contexte",
      "tache",
      "contraintes",
      "format de sortie",
      "precision",
      "iteration",
      "erreurs debutants",
      "exemples",
      "entrepreneur",
      "etudiant",
    ],
  },
  {
    title: "Prompting avance et multi-agents",
    description:
      "Patterns par use case : debugging, refactoring, code review, migration, TDD. Chain-of-thought, few-shot et orchestration multi-agents.",
    href: "/prompting/advanced",
    section: "Prompting",
    keywords: [
      "avance",
      "pattern",
      "debugging",
      "refactoring",
      "code review",
      "migration",
      "TDD",
      "chain-of-thought",
      "few-shot",
      "multi-agents",
      "decomposition",
      "contextuel",
      "subagent",
    ],
  },
  {
    title: "Gestion du contexte et fenetre de 200K tokens",
    description:
      "Maitrisez la fenetre de contexte de Claude Code : 200K tokens, /compact, strategies pour les gros projets.",
    href: "/prompting/context-management",
    section: "Prompting",
    keywords: [
      "contexte",
      "fenetre de contexte",
      "200K tokens",
      "compact",
      "memoire",
      "sessions",
      "gros projets",
      "CLAUDE.md",
      "cost",
      "tokens",
      "limite",
      "oubli",
    ],
  },
  {
    title: "Extended Thinking et Plan Mode",
    description:
      "Activez le raisonnement profond de Claude Code. Extended Thinking, Plan Mode, chain-of-thought, Haiku Sonnet Opus.",
    href: "/prompting/thinking-and-planning",
    section: "Prompting",
    keywords: [
      "extended thinking",
      "plan mode",
      "raisonnement",
      "thinking",
      "haiku",
      "sonnet",
      "opus",
      "modele",
      "cout",
      "latence",
      "chain-of-thought",
      "hallucination",
      "Alt+T",
    ],
  },
  {
    title: "Prompt chaining et orchestration multi-agents",
    description:
      "Decomposez les taches complexes en pipelines. Fan-out/fan-in, pipelines sequentiels, configuration d'agents.",
    href: "/prompting/chaining-and-agents",
    section: "Prompting",
    keywords: [
      "chaining",
      "pipeline",
      "orchestration",
      "multi-agents",
      "fan-out",
      "fan-in",
      "parallele",
      "sequentiel",
      "subagent",
      "task tool",
      "agent",
      "decomposer",
    ],
  },
  {
    title: "Prompting pour non-developpeurs",
    description:
      "20+ templates de prompts pour la communication, l'analyse, la creation de contenu et l'organisation.",
    href: "/prompting/non-dev-prompting",
    section: "Prompting",
    keywords: [
      "non-developpeur",
      "template",
      "email",
      "communication",
      "analyse",
      "rapport",
      "presentation",
      "newsletter",
      "linkedin",
      "compte-rendu",
      "planning",
      "manager",
      "entrepreneur",
      "marketing",
    ],
  },
  // Future
  {
    title: "Vision & Futur de l'IA",
    description:
      "L'avenir de l'IA est deja la. Tendances, preparation et roadmap de The Claude Codex.",
    href: "/future",
    section: "Vision",
    keywords: [
      "futur",
      "vision",
      "tendances",
      "roadmap",
      "agents autonomes",
      "multi-modale",
      "marketplace",
      "transformation",
      "preparation",
      "contribuer",
      "open-source",
    ],
  },
  // Content (MDX)
  {
    title: "Contenus \u00e9ditoriaux",
    description:
      "Articles et guides au format MDX. Explorez nos contenus sur Claude Code, les MCP, les Skills et le prompting.",
    href: "/content",
    section: "Contenus",
    keywords: [
      "contenu",
      "article",
      "mdx",
      "editorial",
      "guide",
      "tutoriel",
    ],
  },
  // MCP Security
  {
    title: "Securite des MCP : dangers reels et comment s'en proteger",
    description:
      "Prompt injection, exfiltration de donnees, supply chain attacks, confusion de permissions. Checklist de securite copiable pour CLAUDE.md.",
    href: "/mcp/securite-mcp",
    section: "MCP",
    keywords: [
      "securite",
      "mcp",
      "prompt injection",
      "exfiltration",
      "supply chain",
      "typosquatting",
      "permissions",
      "dangerouslySkipPermissions",
      "checklist",
      "audit",
      "malveillant",
      "credentials",
      "exploit",
    ],
  },
  // Costs
  {
    title: "Couts reels de Claude Code : tokens, MCP et abonnements",
    description:
      "Prix Anthropic a jour, calcul concret par session, impact des MCP sur la consommation, comparatif des plans et strategies d'optimisation.",
    href: "/content/couts-reels-claude-code",
    section: "Contenus",
    keywords: [
      "cout",
      "prix",
      "tokens",
      "budget",
      "abonnement",
      "pro",
      "max",
      "api",
      "facture",
      "sonnet",
      "opus",
      "haiku",
      "mcp",
      "economiser",
      "throttling",
      "limite",
    ],
  },
  // Myths
  {
    title: "8 idees recues sur Claude Code - Mythes et realites",
    description:
      "Les mythes les plus repandus demystifies : securite des MCP, couts reels, terminologie correcte, risques du mode auto et limites du contexte.",
    href: "/content/mythes-claude-code",
    section: "Contenus",
    keywords: [
      "mythes",
      "idees recues",
      "demystifier",
      "realite",
      "mcp officiel",
      "securite",
      "gratuit",
      "plugin",
      "skill",
      "mode auto",
      "context",
      "compact",
      "CLAUDE.md prive",
    ],
  },
  // Security Best Practices
  {
    title: "Guide de securite Claude Code : principes et bonnes pratiques",
    description:
      "Moindre privilege, audit avant installation, profils de configuration, monitoring, rotation des sessions et checklist complete copiable.",
    href: "/content/bonnes-pratiques-securite",
    section: "Contenus",
    keywords: [
      "securite",
      "bonnes pratiques",
      "moindre privilege",
      "audit",
      "profil",
      "configuration",
      "monitoring",
      "rotation",
      "session",
      "checklist",
      "permissions",
      "sandbox",
      "credentials",
      "production",
      "developpement",
    ],
  },
];

export function searchEntries(
  query: string
): ReadonlyArray<SearchEntry> {
  const normalizedQuery = query
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

  if (normalizedQuery.length === 0) {
    return [];
  }

  const queryTokens = normalizedQuery.split(/\s+/);

  const scored = searchIndex
    .map((entry) => {
      const titleNorm = entry.title
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      const descNorm = entry.description
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      const keywordsNorm = entry.keywords
        .map((k) =>
          k
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
        )
        .join(" ");

      let score = 0;

      for (const token of queryTokens) {
        if (titleNorm.includes(token)) {
          score += 10;
        }
        if (keywordsNorm.includes(token)) {
          score += 5;
        }
        if (descNorm.includes(token)) {
          score += 2;
        }
      }

      return { entry, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.map((item) => item.entry);
}
