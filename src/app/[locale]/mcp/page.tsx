import { setRequestLocale } from "next-intl/server";
import Link from "next/link";
import {
  ArrowRight,
  Plug,
  FolderOpen,
  Github,
  Database,
  Globe,
  MessageSquare,
  Mail,
  Zap,
  ChevronRight,
  Settings,
  Terminal,
  BookOpen,
  Sparkles,
  Shield,
  Cable,
  HelpCircle,
  Wrench,
  Briefcase,
  Code2,
  Palette,
  Route,
} from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FeatureCard } from "@/components/ui/FeatureCard";
import { Callout } from "@/components/ui/Callout";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AnimateOnScroll, StaggerChildren } from "@/components/ui/AnimateOnScroll";
import { createPageMetadata, SITE_URL } from "@/lib/metadata";
import { createArticleSchema, serializeJsonLd } from "@/lib/structured-data";

const translations = {
  fr: {
    metaTitle: "Les MCP pour Claude Code",
    metaDescription:
      "Decouvrez les MCP (Model Context Protocol) pour connecter Claude Code a vos outils favoris : GitHub, Slack, Gmail, bases de donnees et plus encore.",
    jsonLdTitle: "Les MCP pour Claude Code",
    jsonLdDescription:
      "Decouvrez les MCP (Model Context Protocol) pour connecter Claude Code a vos outils favoris.",
    heroBadge: "Model Context Protocol",
    heroTitle1: "Les ",
    heroTitle2: "MCP",
    heroTitle3: " : Donnez des",
    heroTitle4: "super-pouvoirs \u00e0 Claude Code",
    heroDescription:
      "Connectez Claude Code \u00e0 vos outils favoris (GitHub, Slack, Gmail, bases de donn\u00e9es) et transformez-le en assistant tout-puissant qui agit dans votre environnement r\u00e9el.",
    subPagesBadge: "6 guides",
    subPagesTitle: "Explorez les MCP en profondeur",
    subPagesDescription:
      "De la th\u00e9orie \u00e0 la pratique, chaque guide couvre un aspect essentiel des MCP. Suivez-les dans l\u0027ordre ou piochez directement celui qui vous int\u00e9resse.",
    readGuide: "Lire le guide",
    conceptBadge: "Concept",
    conceptTitle: "Qu’est-ce qu’un MCP ?",
    conceptDescription:
      "Le Model Context Protocol, c’est l’adaptateur universel entre Claude Code et le reste du monde numerique.",
    analogyTitle: "L\u0027analogie simple",
    analogyP1:
      "Imaginez que Claude Code est un expert polyvalent enferme dans une piece. Il est brillant, mais il ne peut rien ",
    analogyP1Bold1: "toucher",
    analogyP1Mid: " en dehors de cette piece. Les MCP, ce sont des ",
    analogyP1Bold2: "prises universelles",
    analogyP1End:
      " que vous branchez entre Claude et vos outils : votre boite mail, votre code source, vos bases de donnees, votre navigateur...",
    analogyP2:
      "Chaque MCP ouvre une nouvelle porte. Sans MCP, Claude Code peut seulement lire et ecrire des fichiers locaux. Avec les MCP, il peut envoyer un message Slack, creer une pull request GitHub, lancer une requete SQL, et bien plus encore. ",
    analogyP2Bold: "tout ca depuis le terminal",
    analogyP2End: ".",
    withoutMcp: "Sans MCP",
    withoutMcpDesc:
      "Claude Code lit et ecrit des fichiers locaux. Puissant, mais isole.",
    plusMcp: "+ MCP",
    plusMcpDesc:
      "Vous branchez des adaptateurs qui connectent Claude a vos services.",
    result: "Resultat",
    resultDesc:
      "Un assistant qui agit dans votre environnement reel, pas juste dans un chat.",
    archBadge: "Architecture",
    archTitle: "Comment ca marche ?",
    archDescription:
      "Le MCP agit comme un pont standardise entre Claude Code et les services externes.",
    flowYou: "Vous",
    flowYouDesc: "\u0022Montre-moi les issues GitHub ouvertes\u0022",
    flowClaude: "Claude Code",
    flowClaudeDesc: "Comprend votre demande et appelle le bon MCP",
    flowMcpServer: "MCP Server",
    flowMcpServerDesc: "Traduit la requete en appels API",
    flowService: "Service externe",
    flowServiceDesc: "GitHub, Slack, Gmail, BDD...",
    calloutProtocolTitle: "Protocole standard",
    calloutProtocol:
      "Le MCP est un protocole ouvert cree par Anthropic. Chaque MCP server expose un ensemble d\u0027outils (tools) que Claude Code peut appeler automatiquement. Vous n\u0027avez pas besoin d\u0027ecrire du code, juste de configurer la connexion.",
    installBadge: "Installation",
    installTitle: "Comment installer un MCP ?",
    installDescription:
      "Trois etapes simples pour connecter un nouveau service a Claude Code.",
    installStep1Title: "Ouvrir la configuration de Claude Code",
    installStep1Desc:
      "Les MCP se configurent dans le fichier ",
    installStep1DescEnd:
      " de Claude Code. Vous pouvez le modifier directement ou utiliser la commande dediee.",
    installStep1Code: `# Ouvrir la configuration via Claude Code
claude mcp add <nom-du-mcp> -- <commande> <args>

# Ou editer manuellement le fichier de configuration
# ~/.claude/settings.json (configuration globale)
# .claude/settings.json  (configuration par projet)`,
    installStep2Title: "Ajouter le MCP dans settings.json",
    installStep2Desc: "Chaque MCP est declare dans la section ",
    installStep2DescEnd: ". Voici la structure type :",
    installStep2Code: `{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/chemin/vers/votre/dossier"
      ]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_votre_token_ici"
      }
    }
  }
}`,
    calloutSecurityTitle: "Securite des tokens",
    calloutSecurity:
      "Ne commitez jamais vos tokens dans un repository Git. Utilisez des variables d\u0027environnement ou un gestionnaire de secrets pour les informations sensibles. Preferez la configuration globale (",
    calloutSecurityEnd: ") pour les tokens personnels.",
    installStep3Title: "Verifier que le MCP est actif",
    installStep3Desc:
      "Relancez Claude Code et verifiez que les outils du MCP sont disponibles. Claude Code detecte automatiquement les MCP configures au demarrage.",
    installStep3Code: `# Lister les MCP configures
claude mcp list

# Tester un MCP en demandant a Claude de l’utiliser
claude "Liste les fichiers dans mon dossier projet"`,
    calloutTipTitle: "Astuce",
    calloutTip:
      "Si un MCP ne se connecte pas, verifiez que la commande (npx, uvx, etc.) est bien installee et accessible dans votre PATH. Vous pouvez aussi regarder les logs avec ",
    recBadge: "Recommandations",
    recTitle: "Les MCP incontournables",
    recDescription:
      "Notre selection des meilleurs MCP servers pour debuter et aller plus loin avec Claude Code.",
    tutorialBadge: "Tutoriel",
    tutorialTitle: "Votre premier workflow MCP",
    tutorialDescription:
      "Installez et utilisez le MCP Filesystem en 5 minutes pour decouvrir la puissance des MCP.",
    tutoStep1Title: "Installer le MCP Filesystem",
    tutoStep1Desc:
      "Le MCP Filesystem est le plus simple pour debuter. Il permet a Claude Code de lire et manipuler les fichiers d\u0027un dossier que vous choisissez.",
    tutoStep1Code: `# Ajouter le MCP Filesystem en une commande
claude mcp add filesystem -- npx -y @modelcontextprotocol/server-filesystem /home/votre-user/projets`,
    tutoStep2Title: "Verifier la configuration",
    tutoStep2Desc:
      "Assurez-vous que le MCP est bien enregistre dans votre configuration.",
    tutoStep2Code: `claude mcp list

# Resultat attendu :
# filesystem: connected
#   Tools: read_file, write_file, list_directory, search_files, ...`,
    tutoStep3Title: "Utiliser le MCP dans une conversation",
    tutoStep3Desc:
      "Lancez Claude Code et demandez-lui d\u0027utiliser les fichiers. Il detectera automatiquement le MCP Filesystem et l\u0027utilisera.",
    tutoStep3Code: `# Lancer Claude Code
claude

# Puis demandez par exemple :
> Liste tous les fichiers TypeScript dans mon dossier projets
> et donne-moi un resume de chaque fichier.

# Claude va automatiquement :
# 1. Utiliser list_directory pour explorer le dossier
# 2. Utiliser read_file pour lire chaque fichier .ts
# 3. Vous fournir un resume structure`,
    tutoStep4Title: "Aller plus loin",
    tutoStep4Desc:
      "Combinez plusieurs MCP pour creer des workflows puissants. Par exemple, utilisez Filesystem + GitHub pour analyser un projet local et creer automatiquement une pull request.",
    tutoStep4Code: `{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/home/votre-user/projets"
      ]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_..."
      }
    },
    "slack": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-slack"],
      "env": {
        "SLACK_BOT_TOKEN": "xoxb-..."
      }
    }
  }
}`,
    calloutWorkflowTitle: "Workflow concret",
    calloutWorkflow:
      "Essayez : \u0022Analyse les fichiers modifies cette semaine dans mon projet, cree une pull request avec un resume des changements, et envoie une notification Slack a l\u0027equipe.\u0022 Claude Code enchainera les trois MCP automatiquement.",
    bestPracticesBadge: "Bonnes pratiques",
    bestPracticesTitle: "Tirer le meilleur des MCP",
    bpLeastPrivilege: "Principe du moindre privilege",
    bpLeastPrivilegeDesc:
      "N’accordez a chaque MCP que les permissions necessaires. Limitez les dossiers accessibles au MCP Filesystem, utilisez des tokens avec des scopes restreints pour GitHub.",
    bpProjectConfig: "Configuration par projet",
    bpProjectConfigDesc:
      "Utilisez le fichier .claude/settings.json a la racine de chaque projet pour des MCP specifiques. Reservez la config globale (~/.claude/settings.json) pour les MCP universels.",
    bpCombine: "Combinez les MCP",
    bpCombineDesc:
      "La vraie puissance emerge quand Claude enchaine plusieurs MCP dans un meme workflow. Filesystem + GitHub + Slack = automatisation complete.",
    bpDocument: "Documentez vos configurations",
    bpDocumentDesc:
      "Ajoutez un fichier CLAUDE.md a la racine de vos projets pour expliquer quels MCP sont utilises et pourquoi. Claude Code le lira automatiquement.",
    calloutLimitsTitle: "Limites a connaitre",
    calloutLimits:
      "Les MCP executent des actions reelles (envoi de messages, creation de fichiers, requetes API). Claude Code vous demandera toujours confirmation avant d\u0027executer une action sensible. Ne desactivez pas cette protection avec ",
    calloutLimitsEnd: " en production.",
    nextTitle1: "Continuez votre ",
    nextTitle2: "apprentissage",
    nextDescription:
      "Les MCP ne sont qu\u0027une piece du puzzle. Decouvrez les Skills pour enseigner des comportements personnalises a Claude Code, et maitrisez le prompting avance pour des resultats exceptionnels.",
    nextSkillsCta: "Decouvrir les Skills",
    nextPromptingCta: "Maitriser le prompting",
    recommendedMcps: [
      {
        name: "Filesystem",
        description:
          "Lire et ecrire des fichiers, explorer des repertoires, rechercher du contenu. L’outil de base pour interagir avec votre systeme de fichiers.",
        difficulty: "Debutant",
        useCase: "Organiser, analyser et transformer vos fichiers locaux",
      },
      {
        name: "GitHub",
        description:
          "Gerer les pull requests, issues, rechercher du code, consulter les workflows CI/CD. Indispensable pour les developpeurs.",
        difficulty: "Intermediaire",
        useCase: "Automatiser la gestion de vos repositories",
      },
      {
        name: "PostgreSQL / SQLite",
        description:
          "Interroger vos bases de donnees directement depuis Claude Code. Executer des requetes SQL, analyser les schemas, exporter des resultats.",
        difficulty: "Intermediaire",
        useCase: "Explorer et analyser vos donnees sans quitter le terminal",
      },
      {
        name: "Puppeteer / Playwright",
        description:
          "Automatiser un navigateur web : prendre des screenshots, remplir des formulaires, scraper des pages, tester des interfaces.",
        difficulty: "Avance",
        useCase: "Tests E2E, web scraping et automatisation de navigateur",
      },
      {
        name: "Slack",
        description:
          "Lire et envoyer des messages, gerer les channels, rechercher dans l’historique. Connectez votre communication d’equipe a Claude.",
        difficulty: "Debutant",
        useCase: "Automatiser les notifications et la veille d’equipe",
      },
      {
        name: "Gmail",
        description:
          "Lire, rechercher et trier vos emails. Creer des brouillons, analyser des conversations, extraire des informations cles.",
        difficulty: "Debutant",
        useCase: "Gagner du temps sur la gestion de vos emails",
      },
    ],
    subPages: [
      {
        title: "Comprendre les MCP en 5 minutes",
        description:
          "Le protocole MCP expliqué simplement : architecture client-serveur, JSON-RPC, différences avec les plugins et skills.",
      },
      {
        title: "Installer et configurer un MCP",
        description:
          "Le fichier .mcp.json, la commande claude mcp add, les trois méthodes d’installation et le debug des problèmes courants.",
      },
      {
        title: "Top MCP productivité",
        description:
          "Figma, Lighthouse, Gmail, Slack, Google Calendar : les MCP qui transforment votre quotidien professionnel.",
      },
      {
        title: "Top MCP développement",
        description:
          "Context7, Sentry, Linear, PostgreSQL, GitHub : les MCP essentiels pour les développeurs.",
      },
      {
        title: "Top MCP design & UI",
        description:
          "Playwright, Chrome DevTools, 21st.dev Magic, Puppeteer : voir et interagir avec le web.",
      },
      {
        title: "Créer son premier workflow MCP",
        description:
          "Tutoriel concret : combinez Context7 + GitHub + Playwright dans un flux de travail complet.",
      },
    ],
  },
  en: {
    metaTitle: "MCPs for Claude Code",
    metaDescription:
      "Discover MCPs (Model Context Protocol) to connect Claude Code to your favorite tools: GitHub, Slack, Gmail, databases and more.",
    jsonLdTitle: "MCPs for Claude Code",
    jsonLdDescription:
      "Discover MCPs (Model Context Protocol) to connect Claude Code to your favorite tools.",
    heroBadge: "Model Context Protocol",
    heroTitle1: "",
    heroTitle2: "MCPs",
    heroTitle3: ": Give",
    heroTitle4: "superpowers to Claude Code",
    heroDescription:
      "Connect Claude Code to your favorite tools (GitHub, Slack, Gmail, databases) and turn it into an all-powerful assistant that acts in your real environment.",
    subPagesBadge: "6 guides",
    subPagesTitle: "Explore MCPs in depth",
    subPagesDescription:
      "From theory to practice, each guide covers an essential aspect of MCPs. Follow them in order or jump straight to the one you need.",
    readGuide: "Read the guide",
    conceptBadge: "Concept",
    conceptTitle: "What is an MCP?",
    conceptDescription:
      "The Model Context Protocol is the universal adapter between Claude Code and the rest of the digital world.",
    analogyTitle: "The simple analogy",
    analogyP1:
      "Imagine Claude Code is a versatile expert locked in a room. It is brilliant, but it cannot ",
    analogyP1Bold1: "touch",
    analogyP1Mid: " anything outside that room. MCPs are ",
    analogyP1Bold2: "universal plugs",
    analogyP1End:
      " that you connect between Claude and your tools: your mailbox, your source code, your databases, your browser...",
    analogyP2:
      "Each MCP opens a new door. Without MCPs, Claude Code can only read and write local files. With MCPs, it can send a Slack message, create a GitHub pull request, run a SQL query, and much more. ",
    analogyP2Bold: "All from the terminal",
    analogyP2End: ".",
    withoutMcp: "Without MCP",
    withoutMcpDesc:
      "Claude Code reads and writes local files. Powerful, but isolated.",
    plusMcp: "+ MCP",
    plusMcpDesc:
      "You plug in adapters that connect Claude to your services.",
    result: "Result",
    resultDesc:
      "An assistant that acts in your real environment, not just in a chat.",
    archBadge: "Architecture",
    archTitle: "How does it work?",
    archDescription:
      "The MCP acts as a standardized bridge between Claude Code and external services.",
    flowYou: "You",
    flowYouDesc: "\u0022Show me the open GitHub issues\u0022",
    flowClaude: "Claude Code",
    flowClaudeDesc: "Understands your request and calls the right MCP",
    flowMcpServer: "MCP Server",
    flowMcpServerDesc: "Translates the request into API calls",
    flowService: "External service",
    flowServiceDesc: "GitHub, Slack, Gmail, DB...",
    calloutProtocolTitle: "Standard protocol",
    calloutProtocol:
      "MCP is an open protocol created by Anthropic. Each MCP server exposes a set of tools that Claude Code can call automatically. You don\u0027t need to write code, just configure the connection.",
    installBadge: "Installation",
    installTitle: "How to install an MCP?",
    installDescription:
      "Three simple steps to connect a new service to Claude Code.",
    installStep1Title: "Open the Claude Code configuration",
    installStep1Desc:
      "MCPs are configured in the ",
    installStep1DescEnd:
      " file of Claude Code. You can edit it directly or use the dedicated command.",
    installStep1Code: `# Open the configuration via Claude Code
claude mcp add <mcp-name> -- <command> <args>

# Or manually edit the configuration file
# ~/.claude/settings.json (global configuration)
# .claude/settings.json  (per-project configuration)`,
    installStep2Title: "Add the MCP in settings.json",
    installStep2Desc: "Each MCP is declared in the ",
    installStep2DescEnd: " section. Here is the typical structure:",
    installStep2Code: `{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/path/to/your/folder"
      ]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_your_token_here"
      }
    }
  }
}`,
    calloutSecurityTitle: "Token security",
    calloutSecurity:
      "Never commit your tokens to a Git repository. Use environment variables or a secret manager for sensitive information. Prefer the global configuration (",
    calloutSecurityEnd: ") for personal tokens.",
    installStep3Title: "Verify that the MCP is active",
    installStep3Desc:
      "Restart Claude Code and verify that the MCP tools are available. Claude Code automatically detects configured MCPs at startup.",
    installStep3Code: `# List configured MCPs
claude mcp list

# Test an MCP by asking Claude to use it
claude "List the files in my project folder"`,
    calloutTipTitle: "Tip",
    calloutTip:
      "If an MCP does not connect, check that the command (npx, uvx, etc.) is installed and accessible in your PATH. You can also check the logs with ",
    recBadge: "Recommendations",
    recTitle: "Essential MCPs",
    recDescription:
      "Our selection of the best MCP servers to get started and go further with Claude Code.",
    tutorialBadge: "Tutorial",
    tutorialTitle: "Your first MCP workflow",
    tutorialDescription:
      "Install and use the Filesystem MCP in 5 minutes to discover the power of MCPs.",
    tutoStep1Title: "Install the Filesystem MCP",
    tutoStep1Desc:
      "The Filesystem MCP is the simplest to start with. It allows Claude Code to read and manipulate files in a folder you choose.",
    tutoStep1Code: `# Add the Filesystem MCP in one command
claude mcp add filesystem -- npx -y @modelcontextprotocol/server-filesystem /home/your-user/projects`,
    tutoStep2Title: "Verify the configuration",
    tutoStep2Desc:
      "Make sure the MCP is properly registered in your configuration.",
    tutoStep2Code: `claude mcp list

# Expected result:
# filesystem: connected
#   Tools: read_file, write_file, list_directory, search_files, ...`,
    tutoStep3Title: "Use the MCP in a conversation",
    tutoStep3Desc:
      "Launch Claude Code and ask it to use the files. It will automatically detect the Filesystem MCP and use it.",
    tutoStep3Code: `# Launch Claude Code
claude

# Then ask for example:
> List all TypeScript files in my projects folder
> and give me a summary of each file.

# Claude will automatically:
# 1. Use list_directory to explore the folder
# 2. Use read_file to read each .ts file
# 3. Provide you with a structured summary`,
    tutoStep4Title: "Go further",
    tutoStep4Desc:
      "Combine multiple MCPs to create powerful workflows. For example, use Filesystem + GitHub to analyze a local project and automatically create a pull request.",
    tutoStep4Code: `{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/home/your-user/projects"
      ]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_..."
      }
    },
    "slack": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-slack"],
      "env": {
        "SLACK_BOT_TOKEN": "xoxb-..."
      }
    }
  }
}`,
    calloutWorkflowTitle: "Concrete workflow",
    calloutWorkflow:
      "Try: \u0022Analyze the files modified this week in my project, create a pull request with a summary of changes, and send a Slack notification to the team.\u0022 Claude Code will chain the three MCPs automatically.",
    bestPracticesBadge: "Best practices",
    bestPracticesTitle: "Getting the most out of MCPs",
    bpLeastPrivilege: "Principle of least privilege",
    bpLeastPrivilegeDesc:
      "Only grant each MCP the permissions it needs. Limit folders accessible to the Filesystem MCP, use tokens with restricted scopes for GitHub.",
    bpProjectConfig: "Per-project configuration",
    bpProjectConfigDesc:
      "Use the .claude/settings.json file at the root of each project for specific MCPs. Reserve the global config (~/.claude/settings.json) for universal MCPs.",
    bpCombine: "Combine MCPs",
    bpCombineDesc:
      "True power emerges when Claude chains multiple MCPs in the same workflow. Filesystem + GitHub + Slack = complete automation.",
    bpDocument: "Document your configurations",
    bpDocumentDesc:
      "Add a CLAUDE.md file at the root of your projects to explain which MCPs are used and why. Claude Code will read it automatically.",
    calloutLimitsTitle: "Limitations to know",
    calloutLimits:
      "MCPs execute real actions (sending messages, creating files, API requests). Claude Code will always ask for confirmation before executing a sensitive action. Do not disable this protection with ",
    calloutLimitsEnd: " in production.",
    nextTitle1: "Continue your ",
    nextTitle2: "learning",
    nextDescription:
      "MCPs are just one piece of the puzzle. Discover Skills to teach custom behaviors to Claude Code, and master advanced prompting for exceptional results.",
    nextSkillsCta: "Discover Skills",
    nextPromptingCta: "Master prompting",
    recommendedMcps: [
      {
        name: "Filesystem",
        description:
          "Read and write files, explore directories, search content. The basic tool to interact with your file system.",
        difficulty: "Beginner",
        useCase: "Organize, analyze and transform your local files",
      },
      {
        name: "GitHub",
        description:
          "Manage pull requests, issues, search code, check CI/CD workflows. Essential for developers.",
        difficulty: "Intermediate",
        useCase: "Automate the management of your repositories",
      },
      {
        name: "PostgreSQL / SQLite",
        description:
          "Query your databases directly from Claude Code. Execute SQL queries, analyze schemas, export results.",
        difficulty: "Intermediate",
        useCase: "Explore and analyze your data without leaving the terminal",
      },
      {
        name: "Puppeteer / Playwright",
        description:
          "Automate a web browser: take screenshots, fill forms, scrape pages, test interfaces.",
        difficulty: "Advanced",
        useCase: "E2E testing, web scraping and browser automation",
      },
      {
        name: "Slack",
        description:
          "Read and send messages, manage channels, search history. Connect your team communication to Claude.",
        difficulty: "Beginner",
        useCase: "Automate notifications and team monitoring",
      },
      {
        name: "Gmail",
        description:
          "Read, search and sort your emails. Create drafts, analyze conversations, extract key information.",
        difficulty: "Beginner",
        useCase: "Save time on managing your emails",
      },
    ],
    subPages: [
      {
        title: "Understand MCPs in 5 minutes",
        description:
          "The MCP protocol explained simply: client-server architecture, JSON-RPC, differences with plugins and skills.",
      },
      {
        title: "Install and configure an MCP",
        description:
          "The .mcp.json file, the claude mcp add command, the three installation methods and debugging common issues.",
      },
      {
        title: "Top productivity MCPs",
        description:
          "Figma, Lighthouse, Gmail, Slack, Google Calendar: the MCPs that transform your professional daily life.",
      },
      {
        title: "Top development MCPs",
        description:
          "Context7, Sentry, Linear, PostgreSQL, GitHub: the essential MCPs for developers.",
      },
      {
        title: "Top design & UI MCPs",
        description:
          "Playwright, Chrome DevTools, 21st.dev Magic, Puppeteer: see and interact with the web.",
      },
      {
        title: "Create your first MCP workflow",
        description:
          "Hands-on tutorial: combine Context7 + GitHub + Playwright in a complete workflow.",
      },
    ],
  },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = translations[locale as "fr" | "en"] ?? translations.fr;
  return createPageMetadata({
    title: t.metaTitle,
    description: t.metaDescription,
    path: `/${locale}/mcp`,
    locale,
  });
}

function buildArticleJsonLd(locale: string) {
  const t = translations[locale as "fr" | "en"] ?? translations.fr;
  return createArticleSchema({
    title: t.jsonLdTitle,
    description: t.jsonLdDescription,
    url: `${SITE_URL}/${locale}/mcp`,
    locale,
    datePublished: "2026-03-07",
    dateModified: "2026-03-07",
  });
}

const mcpIcons = [FolderOpen, Github, Database, Globe, MessageSquare, Mail];
const mcpDifficultyColors = [
  "bg-emerald-500/10 text-emerald-500",
  "bg-accent-500/10 text-accent-500",
  "bg-accent-500/10 text-accent-500",
  "bg-violet-500/10 text-violet-500",
  "bg-emerald-500/10 text-emerald-500",
  "bg-emerald-500/10 text-emerald-500",
];
const mcpGradients = ["teal", "purple", "green", "purple", "amber", "teal"] as const;

/**
 * Sub-pages of the MCP section, displayed as clickable cards.
 */
const SUB_PAGES_META = [
  { href: "/mcp/what-are-mcps", icon: HelpCircle, step: "01", color: "brand" as const },
  { href: "/mcp/setup", icon: Wrench, step: "02", color: "brand" as const },
  { href: "/mcp/best-productivity", icon: Briefcase, step: "03", color: "accent" as const },
  { href: "/mcp/best-development", icon: Code2, step: "04", color: "accent" as const },
  { href: "/mcp/best-design", icon: Palette, step: "05", color: "brand" as const },
  { href: "/mcp/first-workflow", icon: Route, step: "06", color: "accent" as const },
] as const;

const colorStyles = {
  brand: {
    iconBg: "bg-brand-500/10",
    iconText: "text-brand-700 dark:text-brand-400",
    hoverBorder: "hover:border-brand-500/30",
    linkText: "text-brand-700 dark:text-brand-400",
    linkHover: "group-hover:text-brand-600 dark:group-hover:text-brand-300",
    step: "text-brand-500/40",
  },
  accent: {
    iconBg: "bg-accent-500/10",
    iconText: "text-accent-600 dark:text-accent-400",
    hoverBorder: "hover:border-accent-500/30",
    linkText: "text-accent-600 dark:text-accent-400",
    linkHover: "group-hover:text-accent-500 dark:group-hover:text-accent-300",
    step: "text-accent-500/40",
  },
};

export default async function McpPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = translations[locale as "fr" | "en"] ?? translations.fr;

  const subPages = SUB_PAGES_META.map((meta, i) => ({
    ...meta,
    title: t.subPages[i].title,
    description: t.subPages[i].description,
  }));

  const recommendedMcps = t.recommendedMcps.map((mcp, i) => ({
    ...mcp,
    icon: mcpIcons[i],
    difficultyColor: mcpDifficultyColors[i],
    gradient: mcpGradients[i],
  }));

  return (
    <>
      {/* JSON-LD structured data: static schema from hardcoded values, serialized via JSON.stringify. No user input. */}
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(buildArticleJsonLd(locale)) }}
      />
      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-[var(--gradient-hero)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(6,182,212,0.15),_transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(245,158,11,0.1),_transparent_60%)]" />

        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-20 sm:px-6 sm:pb-28 sm:pt-28 lg:px-8 lg:pb-32 lg:pt-32">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-brand-500/10 px-4 py-1.5 text-sm text-brand-300">
              <Cable className="h-4 w-4" aria-hidden="true" />
              {t.heroBadge}
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl">
              {t.heroTitle1}<span className="text-gradient">{t.heroTitle2}</span>{t.heroTitle3}
              <br />
              {t.heroTitle4}
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300 sm:text-xl">
              {t.heroDescription}
            </p>
          </div>
        </div>
      </section>

      {/* ===== SUB-PAGES CARDS ===== */}
      <section className="py-16 sm:py-20">
        <div className="px-4 sm:px-6 lg:px-0">
          <AnimateOnScroll preset="fade-up">
            <div className="mb-12 text-center">
              <span className="mb-3 inline-block rounded-full bg-brand-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand-700 dark:text-brand-400">
                {t.subPagesBadge}
              </span>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {t.subPagesTitle}
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-300">
                {t.subPagesDescription}
              </p>
            </div>
          </AnimateOnScroll>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {subPages.map((page) => {
              const Icon = page.icon;
              const styles = colorStyles[page.color];

              return (
                <AnimateOnScroll key={page.href} preset="fade-up">
                  <Link
                    href={`/${locale}${page.href}`}
                    className={`group relative flex flex-col rounded-xl border border-slate-200/50 bg-white/50 p-6 transition-all hover:bg-white hover:shadow-lg dark:border-slate-700/50 dark:bg-slate-800/50 dark:hover:bg-slate-800/80 ${styles.hoverBorder}`}
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-xl ${styles.iconBg}`}
                      >
                        <Icon
                          className={`h-6 w-6 ${styles.iconText}`}
                          aria-hidden="true"
                        />
                      </div>
                      <span
                        className={`text-3xl font-black ${styles.step}`}
                      >
                        {page.step}
                      </span>
                    </div>

                    <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">
                      {page.title}
                    </h3>
                    <p className="mb-4 flex-1 text-sm leading-relaxed text-slate-500 dark:text-slate-300">
                      {page.description}
                    </p>

                    <div
                      className={`flex items-center gap-1 text-sm font-medium ${styles.linkText} transition-colors ${styles.linkHover}`}
                    >
                      {t.readGuide}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                    </div>
                  </Link>
                </AnimateOnScroll>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== QU'EST-CE QU'UN MCP ? ===== */}
      <section className="py-20 sm:py-28">
        <div className="px-4 sm:px-6 lg:px-0">
          <AnimateOnScroll preset="fade-up">
            <SectionHeading
              badge={t.conceptBadge}
              title={t.conceptTitle}
              description={t.conceptDescription}
            />
          </AnimateOnScroll>

          <div className="mt-16">
            <div className="glass-card p-8 sm:p-10">
              <h3 className="mb-4 text-xl font-bold">
                {t.analogyTitle}
              </h3>
              <p className="mb-6 text-slate-600 dark:text-slate-300">
                {t.analogyP1}
                <strong>{t.analogyP1Bold1}</strong>
                {t.analogyP1Mid}
                <strong>{t.analogyP1Bold2}</strong>
                {t.analogyP1End}
              </p>
              <p className="text-slate-600 dark:text-slate-300">
                {t.analogyP2}
                <strong>{t.analogyP2Bold}</strong>
                {t.analogyP2End}
              </p>
            </div>

            {/* Visual analogy */}
            <div className="mt-12 grid gap-6 sm:grid-cols-3">
              <div className="glass-card p-6 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500/20 to-brand-500/5">
                  <Terminal className="h-7 w-7 text-brand-700 dark:text-brand-400" aria-hidden="true" />
                </div>
                <h4 className="mb-2 font-semibold">{t.withoutMcp}</h4>
                <p className="text-sm text-slate-500 dark:text-slate-300">
                  {t.withoutMcpDesc}
                </p>
              </div>
              <div className="glass-card p-6 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-accent-500/20 to-accent-500/5">
                  <Plug className="h-7 w-7 text-accent-500" aria-hidden="true" />
                </div>
                <h4 className="mb-2 font-semibold">{t.plusMcp}</h4>
                <p className="text-sm text-slate-500 dark:text-slate-300">
                  {t.plusMcpDesc}
                </p>
              </div>
              <div className="glass-card p-6 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/5">
                  <Sparkles className="h-7 w-7 text-emerald-500" aria-hidden="true" />
                </div>
                <h4 className="mb-2 font-semibold">{t.result}</h4>
                <p className="text-sm text-slate-500 dark:text-slate-300">
                  {t.resultDesc}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== COMMENT CA MARCHE ? ===== */}
      <section className="bg-slate-50/50 py-20 dark:bg-slate-900/50 sm:py-28">
        <div className="px-4 sm:px-6 lg:px-0">
          <SectionHeading
            badge={t.archBadge}
            title={t.archTitle}
            description={t.archDescription}
          />

          {/* Flow diagram */}
          <div className="mt-16">
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-0">
              {/* User */}
              <div className="glass-card flex-1 p-5 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500/20 to-brand-500/5">
                  <BookOpen className="h-6 w-6 text-brand-700 dark:text-brand-400" aria-hidden="true" />
                </div>
                <p className="text-sm font-semibold">{t.flowYou}</p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-300">
                  {t.flowYouDesc}
                </p>
              </div>

              {/* Arrow */}
              <div className="flex items-center justify-center sm:px-2">
                <ChevronRight className="h-6 w-6 rotate-90 text-slate-400 sm:rotate-0" aria-hidden="true" />
              </div>

              {/* Claude Code */}
              <div className="glass-card flex-1 border-brand-500/30 p-5 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500/20 to-brand-500/5">
                  <Terminal className="h-6 w-6 text-brand-700 dark:text-brand-400" aria-hidden="true" />
                </div>
                <p className="text-sm font-semibold">{t.flowClaude}</p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-300">
                  {t.flowClaudeDesc}
                </p>
              </div>

              {/* Arrow */}
              <div className="flex items-center justify-center sm:px-2">
                <ChevronRight className="h-6 w-6 rotate-90 text-slate-400 sm:rotate-0" aria-hidden="true" />
              </div>

              {/* MCP Server */}
              <div className="glass-card flex-1 border-accent-500/30 p-5 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-accent-500/20 to-accent-500/5">
                  <Plug className="h-6 w-6 text-accent-500" aria-hidden="true" />
                </div>
                <p className="text-sm font-semibold">{t.flowMcpServer}</p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-300">
                  {t.flowMcpServerDesc}
                </p>
              </div>

              {/* Arrow */}
              <div className="flex items-center justify-center sm:px-2">
                <ChevronRight className="h-6 w-6 rotate-90 text-slate-400 sm:rotate-0" aria-hidden="true" />
              </div>

              {/* External Service */}
              <div className="glass-card flex-1 border-emerald-500/30 p-5 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/5">
                  <Globe className="h-6 w-6 text-emerald-500" aria-hidden="true" />
                </div>
                <p className="text-sm font-semibold">{t.flowService}</p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-300">
                  {t.flowServiceDesc}
                </p>
              </div>
            </div>

            <Callout type="info" title={t.calloutProtocolTitle}>
              {t.calloutProtocol}
            </Callout>
          </div>
        </div>
      </section>

      {/* ===== COMMENT INSTALLER UN MCP ? ===== */}
      <section className="py-20 sm:py-28">
        <div className="px-4 sm:px-6 lg:px-0">
          <SectionHeading
            badge={t.installBadge}
            title={t.installTitle}
            description={t.installDescription}
          />

          <div className="mt-16 space-y-12">
            {/* Step 1 */}
            <div>
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-500 text-sm font-bold text-white">
                  1
                </span>
                <h3 className="text-xl font-bold">
                  {t.installStep1Title}
                </h3>
              </div>
              <p className="mb-4 text-slate-600 dark:text-slate-300">
                {t.installStep1Desc}
                <code className="rounded bg-slate-100 px-1.5 py-0.5 text-sm font-mono text-brand-600 dark:bg-slate-800 dark:text-brand-400">
                  settings.json
                </code>
                {t.installStep1DescEnd}
              </p>
              <CodeBlock
                code={t.installStep1Code}
                language="bash"
                filename="Terminal"
              />
            </div>

            {/* Step 2 */}
            <div>
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-500 text-sm font-bold text-white">
                  2
                </span>
                <h3 className="text-xl font-bold">
                  {t.installStep2Title}
                </h3>
              </div>
              <p className="mb-4 text-slate-600 dark:text-slate-300">
                {t.installStep2Desc}
                <code className="rounded bg-slate-100 px-1.5 py-0.5 text-sm font-mono text-brand-600 dark:bg-slate-800 dark:text-brand-400">
                  mcpServers
                </code>
                {t.installStep2DescEnd}
              </p>
              <CodeBlock
                code={t.installStep2Code}
                language="json"
                filename="~/.claude/settings.json"
              />
              <Callout type="warning" title={t.calloutSecurityTitle}>
                {t.calloutSecurity}
                <code className="text-xs">~/.claude/settings.json</code>
                {t.calloutSecurityEnd}
              </Callout>
            </div>

            {/* Step 3 */}
            <div>
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-500 text-sm font-bold text-white">
                  3
                </span>
                <h3 className="text-xl font-bold">
                  {t.installStep3Title}
                </h3>
              </div>
              <p className="mb-4 text-slate-600 dark:text-slate-300">
                {t.installStep3Desc}
              </p>
              <CodeBlock
                code={t.installStep3Code}
                language="bash"
                filename="Terminal"
              />
              <Callout type="tip" title={t.calloutTipTitle}>
                {t.calloutTip}
                <code className="text-xs">claude mcp logs</code>.
              </Callout>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TOP MCP RECOMMANDES ===== */}
      <section className="bg-slate-50/50 py-20 dark:bg-slate-900/50 sm:py-28">
        <div className="px-4 sm:px-6 lg:px-0">
          <AnimateOnScroll preset="fade-up">
            <SectionHeading
              badge={t.recBadge}
              title={t.recTitle}
              description={t.recDescription}
            />
          </AnimateOnScroll>

          <StaggerChildren className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" staggerDelay={0.08}>
            {recommendedMcps.map((mcp) => (
              <div
                key={mcp.name}
                className="glass-card group p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mb-4 flex items-start justify-between">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500/20 to-brand-500/5">
                    <mcp.icon className="h-6 w-6 text-brand-700 dark:text-brand-400" />
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${mcp.difficultyColor}`}
                  >
                    {mcp.difficulty}
                  </span>
                </div>
                <h3 className="mb-2 text-lg font-semibold">{mcp.name}</h3>
                <p className="mb-4 text-sm leading-relaxed text-slate-500 dark:text-slate-300">
                  {mcp.description}
                </p>
                <div className="rounded-lg bg-slate-100/80 px-3 py-2 dark:bg-slate-800/80">
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-300">
                    <Zap className="mr-1.5 inline h-3 w-3 text-accent-500" />
                    {mcp.useCase}
                  </p>
                </div>
              </div>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* ===== TUTORIAL : PREMIER WORKFLOW MCP ===== */}
      <section className="py-20 sm:py-28">
        <div className="px-4 sm:px-6 lg:px-0">
          <SectionHeading
            badge={t.tutorialBadge}
            title={t.tutorialTitle}
            description={t.tutorialDescription}
          />

          <div className="mt-16 space-y-10">
            {/* Step 1 */}
            <div className="glass-card p-6 sm:p-8">
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-500 text-sm font-bold text-white">
                  1
                </span>
                <h3 className="text-lg font-bold">
                  {t.tutoStep1Title}
                </h3>
              </div>
              <p className="mb-4 text-slate-600 dark:text-slate-300">
                {t.tutoStep1Desc}
              </p>
              <CodeBlock
                code={t.tutoStep1Code}
                language="bash"
                filename="Terminal"
              />
            </div>

            {/* Step 2 */}
            <div className="glass-card p-6 sm:p-8">
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-500 text-sm font-bold text-white">
                  2
                </span>
                <h3 className="text-lg font-bold">
                  {t.tutoStep2Title}
                </h3>
              </div>
              <p className="mb-4 text-slate-600 dark:text-slate-300">
                {t.tutoStep2Desc}
              </p>
              <CodeBlock
                code={t.tutoStep2Code}
                language="bash"
                filename="Terminal"
              />
            </div>

            {/* Step 3 */}
            <div className="glass-card p-6 sm:p-8">
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-500 text-sm font-bold text-white">
                  3
                </span>
                <h3 className="text-lg font-bold">
                  {t.tutoStep3Title}
                </h3>
              </div>
              <p className="mb-4 text-slate-600 dark:text-slate-300">
                {t.tutoStep3Desc}
              </p>
              <CodeBlock
                code={t.tutoStep3Code}
                language="bash"
                filename="Terminal"
              />
            </div>

            {/* Step 4 */}
            <div className="glass-card p-6 sm:p-8">
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-500 text-sm font-bold text-white">
                  4
                </span>
                <h3 className="text-lg font-bold">
                  {t.tutoStep4Title}
                </h3>
              </div>
              <p className="mb-4 text-slate-600 dark:text-slate-300">
                {t.tutoStep4Desc}
              </p>
              <CodeBlock
                code={t.tutoStep4Code}
                language="json"
                filename="~/.claude/settings.json"
              />
              <Callout type="tip" title={t.calloutWorkflowTitle}>
                {t.calloutWorkflow}
              </Callout>
            </div>
          </div>
        </div>
      </section>

      {/* ===== BONNES PRATIQUES ===== */}
      <section className="bg-slate-50/50 py-20 dark:bg-slate-900/50 sm:py-28">
        <div className="px-4 sm:px-6 lg:px-0">
          <SectionHeading
            badge={t.bestPracticesBadge}
            title={t.bestPracticesTitle}
          />

          <div className="mt-16 space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <FeatureCard
                icon={Shield}
                title={t.bpLeastPrivilege}
                description={t.bpLeastPrivilegeDesc}
                gradient="teal"
              />
              <FeatureCard
                icon={Settings}
                title={t.bpProjectConfig}
                description={t.bpProjectConfigDesc}
                gradient="amber"
              />
              <FeatureCard
                icon={Zap}
                title={t.bpCombine}
                description={t.bpCombineDesc}
                gradient="purple"
              />
              <FeatureCard
                icon={BookOpen}
                title={t.bpDocument}
                description={t.bpDocumentDesc}
                gradient="green"
              />
            </div>

            <Callout type="warning" title={t.calloutLimitsTitle}>
              {t.calloutLimits}
              <code className="text-xs">--dangerously-skip-permissions</code>
              {t.calloutLimitsEnd}
            </Callout>
          </div>
        </div>
      </section>

      {/* ===== NEXT STEPS ===== */}
      <section className="relative overflow-hidden py-20 sm:py-28">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-950 via-slate-900 to-brand-900" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(6,182,212,0.15),_transparent_70%)]" />

        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl">
            {t.nextTitle1}
            <span className="text-gradient">{t.nextTitle2}</span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300">
            {t.nextDescription}
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href={`/${locale}/skills`}
              className="group inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-sm font-semibold text-slate-900 shadow-lg transition-all hover:bg-slate-100"
            >
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              {t.nextSkillsCta}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
            <Link
              href={`/${locale}/prompting`}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-600 px-8 py-3.5 text-sm font-semibold text-white transition-all hover:border-slate-500 hover:bg-white/5"
            >
              <MessageSquare className="h-4 w-4" aria-hidden="true" />
              {t.nextPromptingCta}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
