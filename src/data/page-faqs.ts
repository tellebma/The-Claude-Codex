/**
 * SEO-4 — Donnees FAQ par page strategique pour le schema FAQPage.
 *
 * Source unique des Q/R injectees a la fois :
 * 1. dans le JSON-LD FAQPage (server-side, lu par Google AI Overviews)
 * 2. dans l'accordeon visible <Faq><FaqItem> du MDX (les Q/R doivent
 *    correspondre mot pour mot pour valider Rich Results Test)
 *
 * Convention : la cle est le path canonique sans locale et sans trailing
 * slash (ex: "/reference/environment", "/content/leaked-api-key-recovery").
 * Pour les paths divergents FR/EN (ex: bonnes-pratiques-securite ↔
 * security-best-practices), inscrire les deux entrees.
 */

export interface PageFaqItem {
  readonly question: string;
  readonly answer: string;
}

export interface PageFaqsByLocale {
  readonly fr?: ReadonlyArray<PageFaqItem>;
  readonly en?: ReadonlyArray<PageFaqItem>;
}

const PAGE_FAQS: Record<string, PageFaqsByLocale> = {
  // ---- /reference/environment ------------------------------------------
  "/reference/environment": {
    fr: [
      {
        question: "Qu'est-ce que ANTHROPIC_API_KEY et où la définir ?",
        answer:
          "C'est la clé API Anthropic au format sk-ant-api03-... Elle se définit dans votre shell rc (.bashrc, .zshrc) ou dans un fichier .env du projet. Claude Code la lit au démarrage.",
      },
      {
        question:
          "Quelle différence entre ANTHROPIC_AUTH_TOKEN et ANTHROPIC_API_KEY ?",
        answer:
          "ANTHROPIC_API_KEY est la clé directe sk-ant-api03. ANTHROPIC_AUTH_TOKEN est utilisée pour les flux OAuth et les proxies d'entreprise qui injectent un token Bearer.",
      },
      {
        question:
          "Comment configurer Claude Code derrière un proxy d'entreprise ?",
        answer:
          "Définissez HTTPS_PROXY et NO_PROXY avant le lancement. ANTHROPIC_BASE_URL peut aussi pointer vers votre passerelle interne (ex: https://gateway.corp/anthropic).",
      },
      {
        question: "Depuis où Claude Code lit-il les variables d'environnement ?",
        answer:
          "Quatre sources lues dans cet ordre : variables du processus shell, fichier .env à la racine du projet, ~/.claude/env, puis settings.json (clé claudeCode.environmentVariables).",
      },
      {
        question: "Comment changer de modèle Claude Code ?",
        answer:
          "Définissez ANTHROPIC_MODEL avec un identifiant valide, par exemple ANTHROPIC_MODEL=claude-sonnet-4-6. Vous pouvez aussi le faire par session via l'argument --model.",
      },
      {
        question: "Peut-on désactiver des comportements via une variable ?",
        answer:
          "Oui. Par exemple DISABLE_AUTOUPDATER=1, DISABLE_TELEMETRY=1, DISABLE_AUTOCOMPACT=1 ou MAX_THINKING_TOKENS=0. La référence complète liste les variables et leurs valeurs acceptées.",
      },
    ],
    en: [
      {
        question: "What is ANTHROPIC_API_KEY and where do I set it?",
        answer:
          "It's the Anthropic API key in sk-ant-api03-... format. Set it in your shell rc (.bashrc, .zshrc) or in a project .env file. Claude Code reads it on launch.",
      },
      {
        question:
          "What is the difference between ANTHROPIC_AUTH_TOKEN and ANTHROPIC_API_KEY?",
        answer:
          "ANTHROPIC_API_KEY is the direct sk-ant-api03 key. ANTHROPIC_AUTH_TOKEN is used for OAuth flows and corporate proxies that inject a Bearer token.",
      },
      {
        question: "How do I configure Claude Code behind a corporate proxy?",
        answer:
          "Set HTTPS_PROXY and NO_PROXY before launching. ANTHROPIC_BASE_URL can also point to your internal gateway (e.g. https://gateway.corp/anthropic).",
      },
      {
        question: "Where does Claude Code read its environment variables from?",
        answer:
          "Four sources, read in this order: shell process env, .env file at project root, ~/.claude/env, then settings.json (claudeCode.environmentVariables key).",
      },
      {
        question: "How do I switch Claude Code to a different model?",
        answer:
          "Set ANTHROPIC_MODEL to a valid identifier, e.g. ANTHROPIC_MODEL=claude-sonnet-4-6. You can also override per-session with the --model argument.",
      },
      {
        question: "Can I disable specific behaviors with an env variable?",
        answer:
          "Yes. For example DISABLE_AUTOUPDATER=1, DISABLE_TELEMETRY=1, DISABLE_AUTOCOMPACT=1 or MAX_THINKING_TOKENS=0. The full reference lists every variable and accepted values.",
      },
    ],
  },

  // ---- /content/leaked-api-key-recovery (EN) ---------------------------
  "/content/leaked-api-key-recovery": {
    en: [
      {
        question: "My Anthropic API key was leaked, what do I do first?",
        answer:
          "Revoke it immediately at console.anthropic.com/settings/keys. Treat the key as compromised even if you only suspect a leak.",
      },
      {
        question: "How do I rotate an Anthropic API key safely?",
        answer:
          "Generate a new key, update every environment that uses the old one (CI, local, prod), then disable the old key. Don't delete it before validating no service still depends on it.",
      },
      {
        question: "How long does it take for Anthropic to revoke a leaked key?",
        answer:
          "Revocation is instant from the console. Existing requests using the key will fail on their next call. There is no grace period.",
      },
      {
        question: "What's the cost impact of a leaked Anthropic API key?",
        answer:
          "It depends on usage. Set monthly spend limits in console.anthropic.com/settings/limits to cap exposure proactively, before any leak happens.",
      },
      {
        question: "How do I scan my repo for leaked API keys?",
        answer:
          "Run gitleaks, trufflehog or git-secrets on the full git history (not just HEAD). Add a pre-commit hook to block future leaks at commit time.",
      },
      {
        question: "Should I rewrite git history to remove a leaked key?",
        answer:
          "For private repos, yes via git filter-repo or BFG. For public repos, the key is already crawled by bots, so rotation is mandatory and history rewrite is optional.",
      },
    ],
  },

  // ---- /content/fuite-cle-api (FR mirror) ------------------------------
  "/content/fuite-cle-api": {
    fr: [
      {
        question: "Ma clé API Anthropic a fuité, par quoi commencer ?",
        answer:
          "Révoquez-la immédiatement sur console.anthropic.com/settings/keys. Considérez la clé comme compromise même si vous n'avez qu'un soupçon.",
      },
      {
        question: "Comment faire une rotation de clé API Anthropic en sécurité ?",
        answer:
          "Générez une nouvelle clé, mettez à jour tous les environnements (CI, local, prod), puis désactivez l'ancienne. Ne supprimez pas avant d'avoir vérifié qu'aucun service ne l'utilise.",
      },
      {
        question: "Combien de temps prend la révocation d'une clé fuitée ?",
        answer:
          "La révocation est instantanée depuis la console. Les requêtes en cours qui utilisent la clé échouent au prochain appel. Aucune période de grâce.",
      },
      {
        question: "Quel est l'impact financier d'une clé API Anthropic fuitée ?",
        answer:
          "Cela dépend de l'usage abusif. Définissez des plafonds mensuels dans console.anthropic.com/settings/limits pour capper l'exposition avant toute fuite.",
      },
      {
        question: "Comment scanner mon dépôt à la recherche de clés fuitées ?",
        answer:
          "Lancez gitleaks, trufflehog ou git-secrets sur l'historique complet (pas seulement HEAD). Ajoutez un pre-commit hook pour bloquer les futures fuites au commit.",
      },
      {
        question: "Faut-il réécrire l'historique git pour effacer une clé fuitée ?",
        answer:
          "Pour un dépôt privé, oui via git filter-repo ou BFG. Pour un dépôt public, la clé est déjà crawlée par des bots : la rotation est obligatoire, la réécriture optionnelle.",
      },
    ],
  },

  // ---- /future/trends-2026 ---------------------------------------------
  "/future/trends-2026": {
    fr: [
      {
        question: "Quelles sont les grandes tendances IA coding pour 2026 ?",
        answer:
          "Agents autonomes en mode multi-étapes, MCP devenu standard de fait, multimodalité (texte + image + voix), IDE IA-native, et déplacement du métier de dev vers la supervision et l'architecture.",
      },
      {
        question: "Les agents IA vont-ils remplacer les développeurs en 2026 ?",
        answer:
          "Non, pas en 2026. Ils prennent les tâches répétitives et le boilerplate, mais l'architecture, le diagnostic complexe et la supervision restent humains. Le métier change, il ne disparaît pas.",
      },
      {
        question: "Pourquoi MCP est devenu un standard en 2026 ?",
        answer:
          "Anthropic, Microsoft, Google et OpenAI ont tous adopté MCP comme protocole d'intégration outils, ce qui en fait l'équivalent d'OAuth pour la connexion d'IA à des systèmes tiers.",
      },
      {
        question: "Quelle différence entre IDE IA et IDE traditionnel ?",
        answer:
          "Un IDE IA-native (Cursor, Zed, Claude Code en CLI) place l'agent au centre. Le code n'est plus tapé caractère par caractère mais décrit, généré, puis revu. L'éditeur devient un panneau de contrôle.",
      },
      {
        question: "Comment la multimodalité change les workflows de coding ?",
        answer:
          "Vous pouvez décrire à l'oral, montrer une capture d'écran d'un design ou un schéma sur tableau, et l'IA génère le code correspondant. La barrière entre intention et implémentation s'efface.",
      },
      {
        question: "Quelles compétences un dev doit-il développer en 2026 ?",
        answer:
          "Architecture système, prompting structuré, revue critique de code généré, sécurité (MCP, secrets), et collaboration avec des agents en parallèle. Les langages spécifiques perdent en importance relative.",
      },
    ],
    en: [
      {
        question: "What are the top AI coding trends for 2026?",
        answer:
          "Autonomous multi-step agents, MCP as the de facto standard, multimodality (text + image + voice), AI-native IDEs, and a shift of the developer role toward supervision and architecture.",
      },
      {
        question: "Will AI agents replace developers in 2026?",
        answer:
          "No, not in 2026. They take over repetitive tasks and boilerplate, but architecture, complex debugging and oversight remain human. The job changes, it doesn't disappear.",
      },
      {
        question: "Why did MCP become a standard in 2026?",
        answer:
          "Anthropic, Microsoft, Google and OpenAI all adopted MCP as the tool integration protocol, making it the OAuth-equivalent for connecting AIs to third-party systems.",
      },
      {
        question: "What's the difference between an AI IDE and a traditional IDE?",
        answer:
          "An AI-native IDE (Cursor, Zed, Claude Code as a CLI) puts the agent at the center. Code is no longer typed character by character but described, generated, and reviewed. The editor becomes a control panel.",
      },
      {
        question: "How does multimodality change coding workflows?",
        answer:
          "You can describe out loud, show a design screenshot or a whiteboard diagram, and the AI generates the matching code. The barrier between intent and implementation fades.",
      },
      {
        question: "What skills should a developer build in 2026?",
        answer:
          "System architecture, structured prompting, critical review of generated code, security (MCP, secrets), and collaboration with multiple parallel agents. Specific languages lose relative importance.",
      },
    ],
  },

  // ---- /content/security-best-practices (EN) ---------------------------
  "/content/security-best-practices": {
    en: [
      {
        question: "What are the top security risks with Claude Code?",
        answer:
          "Leaked API keys in commits, malicious MCP servers, prompt injection from untrusted content, over-broad file access, and secrets bleeding into LLM context. The checklist covers each one.",
      },
      {
        question: "How do I apply least privilege to Claude Code?",
        answer:
          "Run Claude Code from the smallest possible folder, use sandboxed config profiles per project, and restrict allowed_tools to the strict minimum the agent needs.",
      },
      {
        question: "How do I vet a community MCP before installing?",
        answer:
          "Read the source on GitHub, check the publisher reputation, look for telemetry or remote calls, run it in a sandbox first, and review what tools it exposes to the model.",
      },
      {
        question: "How do I scan for secrets in Claude Code config?",
        answer:
          "Use gitleaks or trufflehog on .claude/, settings.json and .env files. Add a pre-commit hook to block secrets at commit time, before they reach git history.",
      },
      {
        question: "What's a sandboxed Claude Code config profile?",
        answer:
          "A folder-scoped settings.json that limits the agent's permissions: which tools it can call, which paths it can read or write, and which commands are auto-approved.",
      },
      {
        question: "Can Claude Code access my private files outside the project?",
        answer:
          "Only if you allow it. By default it's scoped to the cwd. Bash and Edit tools obey the working directory. Be cautious with global MCPs that may bypass this scope.",
      },
    ],
  },

  // ---- /content/bonnes-pratiques-securite (FR mirror) ------------------
  "/content/bonnes-pratiques-securite": {
    fr: [
      {
        question: "Quels sont les principaux risques de sécurité avec Claude Code ?",
        answer:
          "Clés API qui fuitent dans les commits, MCP malveillants, prompt injection via contenu non fiable, accès fichiers trop large, et secrets qui se retrouvent dans le contexte LLM. La checklist traite chacun.",
      },
      {
        question: "Comment appliquer le principe de moindre privilège à Claude Code ?",
        answer:
          "Lancez Claude Code depuis le plus petit dossier possible, utilisez des profils sandboxés par projet, et restreignez allowed_tools au strict minimum nécessaire à l'agent.",
      },
      {
        question: "Comment auditer un MCP communautaire avant installation ?",
        answer:
          "Lisez le code source sur GitHub, vérifiez la réputation du publisher, cherchez les appels télémétrie ou réseau, testez d'abord en sandbox, et inventoriez les outils qu'il expose au modèle.",
      },
      {
        question: "Comment scanner les secrets dans la config Claude Code ?",
        answer:
          "Utilisez gitleaks ou trufflehog sur .claude/, settings.json et .env. Ajoutez un pre-commit hook pour bloquer les secrets au commit, avant qu'ils n'arrivent dans l'historique git.",
      },
      {
        question: "C'est quoi un profil de config Claude Code sandboxé ?",
        answer:
          "Un settings.json scopé au dossier, qui limite les permissions de l'agent : outils appelables, chemins lisibles ou modifiables, et commandes auto-approuvées.",
      },
      {
        question: "Claude Code peut-il accéder à mes fichiers personnels hors projet ?",
        answer:
          "Seulement si vous l'autorisez. Par défaut il est scopé au cwd. Bash et Edit respectent le working directory. Attention aux MCPs globaux qui peuvent contourner ce scope.",
      },
    ],
  },

  // ---- /mcp/mcp-security (EN) ------------------------------------------
  "/mcp/mcp-security": {
    en: [
      {
        question: "What are the main MCP security risks in production?",
        answer:
          "Prompt injection from untrusted content, data exfiltration via tool calls, supply chain attacks (malicious npm packages), excessive permissions granted to the MCP, and credential theft.",
      },
      {
        question: "How does prompt injection work in MCP?",
        answer:
          "Untrusted content (web page, GitHub issue, email) contains hidden instructions the model executes as if they came from the user. Mitigations: sanitize inputs, isolate sensitive tools, and review tool calls.",
      },
      {
        question: "Can a malicious MCP exfiltrate my data?",
        answer:
          "Yes, if you grant it network access and file read tools. An adversarial MCP could read secrets, call out to a remote server, or write malicious code to your project.",
      },
      {
        question: "What permissions should I grant to an MCP?",
        answer:
          "Only what it strictly needs. Disable network access if the MCP is purely local. Restrict file paths via working directory. Review the tool list and disable any tool that surprises you.",
      },
      {
        question: "How do I detect supply chain attacks on MCPs?",
        answer:
          "Pin MCP versions in your config, use npm audit and Snyk, watch for sudden permission changes between versions, and verify maintainer signatures when available.",
      },
      {
        question: "Are official MCPs safer than community ones?",
        answer:
          "Generally yes, because they get more scrutiny and security review. But even official MCPs can have bugs. Always assume any MCP you install can act on your project.",
      },
    ],
  },

  // ---- /mcp/securite-mcp (FR mirror) -----------------------------------
  "/mcp/securite-mcp": {
    fr: [
      {
        question: "Quels sont les principaux risques de sécurité MCP en production ?",
        answer:
          "Prompt injection via contenu non fiable, exfiltration de données via tool calls, attaques supply chain (packages npm malveillants), permissions excessives accordées au MCP, vol de credentials.",
      },
      {
        question: "Comment fonctionne le prompt injection dans MCP ?",
        answer:
          "Du contenu non fiable (page web, issue GitHub, email) contient des instructions cachées que le modèle exécute comme si elles venaient de l'utilisateur. Mitigations : sanitiser les inputs, isoler les outils sensibles, revoir les tool calls.",
      },
      {
        question: "Un MCP malveillant peut-il exfiltrer mes données ?",
        answer:
          "Oui, si vous lui accordez l'accès réseau et la lecture fichiers. Un MCP adversarial peut lire des secrets, appeler un serveur distant, ou écrire du code malveillant dans votre projet.",
      },
      {
        question: "Quelles permissions accorder à un MCP ?",
        answer:
          "Seulement celles dont il a strictement besoin. Désactivez l'accès réseau si le MCP est purement local. Restreignez les chemins fichiers via le working directory. Revoyez la liste d'outils.",
      },
      {
        question: "Comment détecter les attaques supply chain sur MCP ?",
        answer:
          "Épinglez les versions MCP dans votre config, utilisez npm audit et Snyk, surveillez les changements brusques de permissions entre versions, vérifiez les signatures du mainteneur si disponibles.",
      },
      {
        question: "Les MCP officiels sont-ils plus sûrs que les communautaires ?",
        answer:
          "Globalement oui, car ils font l'objet de plus de revues sécurité. Mais même les MCP officiels peuvent avoir des bugs. Considérez toujours que tout MCP installé peut agir sur votre projet.",
      },
    ],
  },

  // ---- /agents/what-are-agents -----------------------------------------
  "/agents/what-are-agents": {
    fr: [
      {
        question: "Qu'est-ce qu'un agent Claude Code ?",
        answer:
          "Un agent est une instance Claude spécialisée avec son propre prompt système, ses outils dédiés et son contexte isolé. Il exécute des tâches multi-étapes en autonomie sans pollution du contexte principal.",
      },
      {
        question: "Quelle différence entre un agent et un subagent ?",
        answer:
          "Un agent est invoqué directement par l'utilisateur (mention par nom). Un subagent est invoqué par un autre agent via la Task tool, pour déléguer une sous-tâche dans son propre contexte.",
      },
      {
        question: "Comment créer un agent Claude Code custom ?",
        answer:
          "Créez un fichier markdown dans .claude/agents/ avec un frontmatter (name, description, tools, model) et un prompt système. L'agent est immédiatement disponible via @nom-agent.",
      },
      {
        question: "Quand utiliser un agent plutôt qu'une slash command ?",
        answer:
          "Une slash command est un raccourci de prompt sans isolation. Un agent isole le contexte, restreint les outils et a un prompt système dédié. Préférez l'agent pour les tâches longues ou sensibles.",
      },
      {
        question: "À quel point les agents Claude Code sont-ils autonomes ?",
        answer:
          "Très autonomes : ils peuvent enchaîner dizaines d'outils sans intervention. Vous gardez le contrôle via les permissions, les hooks (ex: PreToolUse), et la possibilité d'interrompre à tout moment.",
      },
      {
        question: "Plusieurs agents peuvent-ils tourner en parallèle ?",
        answer:
          "Oui, via la Task tool : un agent principal peut dispatcher plusieurs subagents en parallèle. Chacun a son contexte isolé et retourne un résultat consolidé à l'orchestrateur.",
      },
    ],
    en: [
      {
        question: "What is a Claude Code agent?",
        answer:
          "An agent is a specialized Claude instance with its own system prompt, dedicated tools and isolated context. It executes multi-step tasks autonomously without polluting the main conversation.",
      },
      {
        question: "What's the difference between an agent and a subagent?",
        answer:
          "An agent is invoked directly by the user (by name mention). A subagent is invoked by another agent via the Task tool, to delegate a sub-task in its own isolated context.",
      },
      {
        question: "How do I create a custom Claude Code agent?",
        answer:
          "Create a markdown file in .claude/agents/ with frontmatter (name, description, tools, model) and a system prompt. The agent becomes immediately available via @agent-name.",
      },
      {
        question: "When should I use an agent vs a slash command?",
        answer:
          "A slash command is a prompt shortcut with no isolation. An agent isolates context, restricts tools and has a dedicated system prompt. Prefer agents for long or sensitive tasks.",
      },
      {
        question: "How autonomous are Claude Code agents?",
        answer:
          "Very autonomous: they can chain dozens of tool calls without intervention. You keep control via permissions, hooks (e.g. PreToolUse), and the ability to interrupt at any time.",
      },
      {
        question: "Can multiple agents run in parallel?",
        answer:
          "Yes, via the Task tool: a main agent can dispatch multiple subagents in parallel. Each has an isolated context and returns a consolidated result to the orchestrator.",
      },
    ],
  },
};

/**
 * Retourne les FAQ items pour un path canonique et une locale.
 * Utilise dans les server components des [slug]/page.tsx pour injecter
 * le schema FAQPage dans le JSON-LD de la page.
 */
export function getPageFaqs(
  canonicalPath: string,
  locale: string
): ReadonlyArray<PageFaqItem> | null {
  const entry = PAGE_FAQS[canonicalPath];
  if (!entry) return null;
  const lang = locale === "en" ? "en" : "fr";
  return entry[lang] ?? null;
}
