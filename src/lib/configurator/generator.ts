import type {
  ConfigState,
  GeneratedConfig,
  GeneratedFile,
  Profile,
} from "./types";
import { PROFILES, SUBSCRIPTIONS, FEATURES } from "./presets";

/**
 * Trouve le label d'un profil par son id.
 */
function getProfileLabel(profileId: string): string {
  const found = PROFILES.find((p) => p.id === profileId);
  return found ? found.label : profileId;
}

type Stacks = ReadonlyArray<string>;

function hasAny(stacks: Stacks, candidates: ReadonlyArray<string>): boolean {
  return candidates.some((c) => stacks.includes(c));
}

// --- Sous-fonctions pures par responsabilité --------------------------------

function renderHeader(config: ConfigState): ReadonlyArray<string> {
  const profileLabel = config.profile
    ? getProfileLabel(config.profile)
    : "Développeur";
  const stacksList =
    config.stacks.length > 0 ? config.stacks.join(", ") : "Non spécifié";

  return [
    `# Configuration Claude Code : ${profileLabel}`,
    "",
    "Ce fichier a été généré par le Configurateur Interactif de The Claude Codex.",
    `Profil : ${profileLabel} | Stacks : ${stacksList}`,
    "",
  ];
}

function renderStackSection(config: ConfigState): ReadonlyArray<string> {
  const items =
    config.stacks.length > 0
      ? config.stacks.map((s) => `- ${s}`)
      : ["- Aucune stack spécifiée"];
  return ["## Stack technique", "", ...items, ""];
}

/**
 * Table de commandes par profil (+ variantes de stack).
 * Chaque entrée est une fonction pure (stacks) => commands[].
 */
const COMMAND_STRATEGIES: Readonly<
  Record<Profile, (stacks: Stacks) => ReadonlyArray<string>>
> = {
  "web-frontend": frontendCommands,
  designer: frontendCommands,
  "web-backend": backendCommands,
  mobile: () => [
    "- `npx expo start` : Démarrer le serveur Expo",
    "- `npx expo run:ios` : Lancer sur iOS",
    "- `npx expo run:android` : Lancer sur Android",
  ],
  devops: () => [
    "- `docker compose up -d` : Démarrer les services",
    "- `terraform plan` : Planifier les changements infra",
    "- `kubectl get pods` : Vérifier l'état des pods",
  ],
  data: () => [
    "- `jupyter notebook` : Lancer Jupyter",
    "- `python -m pytest` : Lancer les tests",
    "- `pip install -r requirements.txt` : Installer les dépendances",
  ],
  writer: () => ["- Adaptez ces commandes à votre projet"],
  beginner: () => ["- Adaptez ces commandes à votre projet"],
};

function frontendCommands(stacks: Stacks): ReadonlyArray<string> {
  if (hasAny(stacks, ["Next.js", "Nuxt"])) {
    return [
      "- `npm run dev` : Serveur de développement",
      "- `npm run build` : Build de production",
      "- `npm run lint` : Vérification du code",
    ];
  }
  if (hasAny(stacks, ["React", "Vue.js"])) {
    return [
      "- `npm run dev` : Serveur de développement",
      "- `npm run build` : Build de production",
      "- `npm run test` : Lancer les tests",
    ];
  }
  return [];
}

function backendCommands(stacks: Stacks): ReadonlyArray<string> {
  if (hasAny(stacks, ["Python", "FastAPI"])) {
    return [
      "- `python -m pytest` : Lancer les tests",
      "- `uvicorn main:app --reload` : Serveur de développement",
      "- `pip install -r requirements.txt` : Installer les dépendances",
    ];
  }
  if (stacks.includes("Node.js")) {
    return [
      "- `npm run dev` : Serveur de développement",
      "- `npm run build` : Build de production",
      "- `npm test` : Lancer les tests",
    ];
  }
  return [];
}

function renderCommandsSection(config: ConfigState): ReadonlyArray<string> {
  const strategy =
    (config.profile && COMMAND_STRATEGIES[config.profile]) ?? null;
  // Preserve original behavior: dev profiles with a known stack push commands,
  // dev profiles with an unmatched stack push nothing, writer/beginner/no-profile
  // falls back to the generic hint.
  const isGenericProfile =
    !strategy || config.profile === "writer" || config.profile === "beginner";
  const commands = strategy
    ? strategy(config.stacks)
    : ["- Adaptez ces commandes à votre projet"];
  const result = isGenericProfile && commands.length === 0
    ? ["- Adaptez ces commandes à votre projet"]
    : commands;
  return ["## Commandes", "", ...result, ""];
}

/**
 * Arbre d'architecture suggéré en fonction de la stack principale.
 */
function renderArchitectureSection(
  config: ConfigState
): ReadonlyArray<string> {
  let tree: ReadonlyArray<string>;
  if (hasAny(config.stacks, ["Next.js", "Nuxt"])) {
    tree = [
      "/app              → Pages et layouts",
      "/components       → Composants réutilisables",
      "/lib              → Utilitaires et helpers",
      "/public           → Assets statiques",
    ];
  } else if (hasAny(config.stacks, ["FastAPI", "Django"])) {
    tree = [
      "/app              → Module principal",
      "/api              → Routes et endpoints",
      "/models           → Modèles de données",
      "/services         → Logique métier",
      "/tests            → Tests",
    ];
  } else if (hasAny(config.stacks, ["Express", "NestJS"])) {
    tree = [
      "/src              → Code source",
      "/src/routes       → Routes API",
      "/src/services     → Logique métier",
      "/src/models       → Modèles de données",
      "/tests            → Tests",
    ];
  } else {
    tree = [
      "/src              → Code source",
      "/tests            → Tests",
      "/docs             → Documentation",
    ];
  }
  return ["## Architecture", "", "```", ...tree, "```", ""];
}

function renderStyleSection(config: ConfigState): ReadonlyArray<string> {
  const lines: string[] = ["## Style de code", ""];

  if (config.stacks.includes("TypeScript")) {
    lines.push(
      "- TypeScript strict, jamais de `any`",
      "- Exports nommés uniquement (sauf pages/composants racine)"
    );
  }
  if (hasAny(config.stacks, ["React", "React Native"])) {
    lines.push(
      "- Composants fonctionnels avec hooks",
      "- Un composant par fichier"
    );
  }
  if (config.stacks.includes("Tailwind CSS")) {
    lines.push("- Tailwind utility classes, pas de CSS custom");
  }
  if (config.stacks.includes("Python")) {
    lines.push(
      "- Suivre PEP 8 pour le style de code",
      "- Utiliser des type hints systématiquement",
      "- Docstrings pour toutes les fonctions publiques"
    );
  }

  lines.push(
    "- Immutabilité : créer de nouveaux objets, ne jamais muter",
    "- Fichiers courts et focalisés (< 400 lignes)",
    "- Fonctions courtes (< 50 lignes)",
    "- Gestion d'erreurs explicite à chaque niveau",
    ""
  );
  return lines;
}

function renderSecuritySection(): ReadonlyArray<string> {
  return [
    "## Sécurité",
    "",
    "- JAMAIS de secrets ou clés API dans le code source",
    "- Utiliser des variables d'environnement pour les secrets",
    "- Valider toutes les entrées utilisateur",
    "- Prévenir les injections SQL (requêtes paramétrées)",
    "",
  ];
}

function renderFeaturesSection(config: ConfigState): ReadonlyArray<string> {
  if (config.features.length === 0) return [];
  const lines: string[] = ["## Features activées", ""];
  for (const featureId of config.features) {
    if (featureId === "backlog") continue;
    const info = FEATURES.find((f) => f.id === featureId);
    if (!info) continue;
    lines.push(`### ${info.label}`, info.description, "");
  }
  // Pas de section si seul backlog était demandé.
  return lines.length > 2 ? lines : [];
}

/**
 * Génère le contenu du fichier CLAUDE.md.
 *
 * Le fichier est assemblé en sections indépendantes (header, stacks,
 * commandes, architecture, style, sécurité, features, backlog). Chaque
 * section est une fonction pure qui retourne des lignes Markdown.
 */
export function generateClaudeMd(config: ConfigState): string {
  const lines: string[] = [
    ...renderHeader(config),
    ...renderStackSection(config),
    ...renderCommandsSection(config),
    ...renderArchitectureSection(config),
    ...renderStyleSection(config),
    ...renderSecuritySection(),
    ...renderFeaturesSection(config),
  ];

  if (config.features.includes("backlog")) {
    lines.push(...generateBacklogSection());
  }

  return lines.join("\n");
}

/**
 * Génère la section Backlog & Suivi des demandes pour CLAUDE.md.
 */
function generateBacklogSection(): string[] {
  const lines: string[] = [];

  lines.push("## Backlog & Suivi des demandes");
  lines.push("");
  lines.push("### Structure");
  lines.push("");
  lines.push("Le backlog est géré localement dans `BACKLOG/` (gitignored). Il centralise EPICs, features et user stories :");
  lines.push("");
  lines.push("```");
  lines.push("BACKLOG/");
  lines.push("  README.md                        # Vue macro de toutes les EPICs");
  lines.push("  EPIC-{nom}/");
  lines.push("    README.md                      # Objectif, périmètre, tableau de progression");
  lines.push("    FEATURES/{feature}/");
  lines.push("      README.md                    # Routes, branche git, progression par US");
  lines.push("      us-{sujet}.md                # User Story : rôle / action / bénéfice + critères");
  lines.push("    ENABLERS/{enabler}/");
  lines.push("      README.md                    # Contexte technique, progression par US");
  lines.push("      us-{sujet}.md                # Découpage technique");
  lines.push("```");
  lines.push("");
  lines.push("### Suivi de progression");
  lines.push("");
  lines.push("Chaque README contient un tableau avec 4 colonnes :");
  lines.push("");
  lines.push("| Colonne | Responsable | Signification |");
  lines.push("|---|---|---|");
  lines.push("| 🤖 Claude | Claude | Implémenté et fonctionnel (auto-évaluation) |");
  lines.push("| ✅ PO | Product Owner | Validation métier acceptée |");
  lines.push("| 🧪 Tests | QA | Tests unitaires/intégration couvrant la feature |");
  lines.push("| 🚀 Shipped | DevOps | Mergé sur main, déployable |");
  lines.push("");
  lines.push("États : `✅ Done` · `🔄 In Progress` · `⬜ To Do` · `❌ Blocked`");
  lines.push("");
  lines.push("### Mises à jour (Claude)");
  lines.push("");
  lines.push("Claude met à jour la colonne 🤖 en temps réel :");
  lines.push("- US terminée : `✅ Done` dans `us-{sujet}.md` ET dans le README parent");
  lines.push("- Feature complète : mise à jour du README de l'EPIC");
  lines.push("- US en cours : `🔄 In Progress`");
  lines.push("- US bloquée : `❌ Blocked` + note explicative");
  lines.push("");
  lines.push("### Quand un besoin non suivi est exprimé");
  lines.push("");
  lines.push("Si l'utilisateur mentionne une feature, amélioration ou correction non encore suivie, Claude doit :");
  lines.push("");
  lines.push("1. **Identifier** l'EPIC concernée (ou en créer une nouvelle)");
  lines.push("2. **Créer** le fichier `us-{sujet}.md` avec rôle / action / bénéfice + critères d'acceptation");
  lines.push("3. **Mettre à jour** les README de la feature/enabler et de l'EPIC");
  lines.push("4. **Confirmer** à l'utilisateur que la US a été créée avant de commencer l'implémentation");
  lines.push("");
  lines.push("> Ne jamais ignorer un besoin en supposant qu'il sera suivi plus tard. Chaque demande reçoit une user story immédiatement.");
  lines.push("");
  lines.push("### Format de User Story");
  lines.push("");
  lines.push("```markdown");
  lines.push("# US : {Titre}");
  lines.push("");
  lines.push("**En tant que** {rôle},");
  lines.push("**je veux** {action},");
  lines.push("**afin de** {bénéfice}.");
  lines.push("");
  lines.push("## Critères d'acceptation");
  lines.push("");
  lines.push("- [ ] {critère 1}");
  lines.push("- [ ] {critère 2}");
  lines.push("- [ ] {critère 3}");
  lines.push("");
  lines.push("## Notes techniques");
  lines.push("");
  lines.push("{Notes optionnelles : contraintes, dépendances, contexte technique}");
  lines.push("```");
  lines.push("");

  return lines;
}

// --- Autres générateurs (inchangés sur le fond, petits lints) ---------------

/**
 * Génère le contenu du fichier settings.json.
 */
export function generateSettingsJson(config: ConfigState): string {
  const allow: string[] = [
    "Read",
    "Edit",
    "Write",
    "Glob",
    "Grep",
    "Bash(npm run *)",
    "Bash(git *)",
  ];

  if (config.profile === "web-backend" || config.profile === "devops") {
    allow.push("Bash(docker *)", "Bash(curl *)");
  }
  if (config.profile === "data") {
    allow.push("Bash(python *)", "Bash(jupyter *)");
  }
  if (config.profile === "devops") {
    allow.push("Bash(terraform *)", "Bash(kubectl *)");
  }

  const settings: Record<string, unknown> = {
    permissions: {
      allow,
      deny: ["Bash(rm -rf *)"],
    },
  };

  return JSON.stringify(settings, null, 2);
}

/**
 * Génère le contenu du fichier .mcp.json.
 */
export function generateMcpJson(config: ConfigState): string {
  if (!config.features.includes("mcp")) {
    return JSON.stringify({ mcpServers: {} }, null, 2);
  }

  const servers: Record<string, unknown> = {};

  const needsContext7 =
    config.profile === "web-frontend" ||
    config.profile === "web-backend" ||
    config.profile === "mobile" ||
    config.profile === "data";
  if (needsContext7) {
    servers["context7"] = {
      command: "npx",
      args: ["-y", "@upstash/context7-mcp@latest"],
    };
  }

  const needsPlaywright =
    config.profile === "web-frontend" || config.profile === "designer";
  if (needsPlaywright) {
    servers["playwright"] = {
      command: "npx",
      args: ["-y", "@playwright/mcp"],
    };
  }

  const needsGithub =
    config.profile !== "writer" && config.profile !== "beginner";
  if (needsGithub) {
    servers["github"] = {
      command: "npx",
      args: ["-y", "@modelcontextprotocol/server-github"],
      env: { GITHUB_TOKEN: "VOTRE_TOKEN_ICI" },
    };
  }

  const needsSentry =
    config.profile === "web-backend" || config.profile === "devops";
  if (needsSentry) {
    servers["sentry"] = {
      command: "npx",
      args: ["-y", "@sentry/mcp-server"],
      env: { SENTRY_AUTH_TOKEN: "VOTRE_TOKEN_ICI" },
    };
  }

  return JSON.stringify({ mcpServers: servers }, null, 2);
}

/**
 * Génère les fichiers d'agents spécialisés.
 */
export function generateAgentFiles(
  config: ConfigState
): ReadonlyArray<GeneratedFile> {
  const agents: GeneratedFile[] = [];

  if (!config.features.includes("skills")) {
    return agents;
  }

  agents.push({
    name: "code-reviewer.md",
    content: [
      "# Agent : Code Reviewer",
      "",
      "Tu es un expert en revue de code. Ton rôle est d'analyser le code modifié",
      "et de fournir des suggestions d'amélioration.",
      "",
      "## Processus",
      "",
      "1. Lire les fichiers modifiés (git diff)",
      "2. Vérifier la qualité du code :",
      "   - Lisibilité et nommage",
      "   - Gestion des erreurs",
      "   - Performance",
      "   - Sécurité",
      "3. Classer les problèmes : CRITICAL, HIGH, MEDIUM, LOW",
      "4. Proposer des corrections concrètes",
      "",
      "## Règles",
      "",
      "- Ne jamais modifier le code directement",
      "- Toujours expliquer le « pourquoi » d'une suggestion",
      "- Prioriser les problèmes de sécurité",
    ].join("\n"),
  });

  const isDev =
    config.profile === "web-frontend" ||
    config.profile === "web-backend" ||
    config.profile === "mobile" ||
    config.profile === "data";
  if (isDev) {
    agents.push({
      name: "tdd-guide.md",
      content: [
        "# Agent : TDD Guide",
        "",
        "Tu es un expert en Test-Driven Development. Tu guides le développeur",
        "dans l'écriture de tests avant l'implémentation.",
        "",
        "## Processus",
        "",
        "1. Comprendre la fonctionnalité à implémenter",
        "2. Écrire le test en premier (RED)",
        "3. Vérifier que le test échoue",
        "4. Écrire l'implémentation minimale (GREEN)",
        "5. Vérifier que le test passe",
        "6. Refactorer si nécessaire (IMPROVE)",
        "",
        "## Règles",
        "",
        "- Couverture minimum visée : 80%",
        "- Tests unitaires + tests d'intégration",
        "- Ne jamais modifier un test pour le faire passer artificiellement",
      ].join("\n"),
    });
  }

  if (config.profile === "web-backend" || config.profile === "devops") {
    agents.push({
      name: "security-reviewer.md",
      content: [
        "# Agent : Security Reviewer",
        "",
        "Tu es un expert en sécurité applicative. Tu analyses le code",
        "pour détecter les vulnérabilités potentielles.",
        "",
        "## Checklist",
        "",
        "- [ ] Pas de secrets hardcodés",
        "- [ ] Validation des entrées utilisateur",
        "- [ ] Protection contre les injections SQL",
        "- [ ] Protection XSS",
        "- [ ] Protection CSRF",
        "- [ ] Authentification et autorisation vérifiées",
        "- [ ] Rate limiting configuré",
        "- [ ] Messages d'erreur sans fuite de données sensibles",
        "",
        "## Règles",
        "",
        "- Stopper immédiatement si une faille critique est trouvée",
        "- Proposer un fix pour chaque problème identifié",
        "- Vérifier l'ensemble du codebase pour des patterns similaires",
      ].join("\n"),
    });
  }

  return agents;
}

/**
 * Génère le guide d'installation textuel.
 */
export function generateInstallGuide(config: ConfigState): string {
  const lines: string[] = [];

  lines.push("# Guide d'installation de votre configuration Claude Code");
  lines.push("");
  lines.push("## 1. Prérequis");
  lines.push("");
  lines.push("- Node.js 18+ installé");
  lines.push("- npm ou yarn installé");
  lines.push(
    "- Un compte Anthropic (https://console.anthropic.com) ou un abonnement Claude"
  );
  lines.push("");

  lines.push("## 2. Installer Claude Code");
  lines.push("");
  lines.push("```bash");
  lines.push("npm install -g @anthropic-ai/claude-code");
  lines.push("```");
  lines.push("");

  const subInfo = SUBSCRIPTIONS.find((s) => s.id === config.subscription);
  if (subInfo) {
    lines.push(
      `## 3. Abonnement recommandé : ${subInfo.label} (${subInfo.price})`
    );
    lines.push("");
    lines.push(subInfo.description);
    lines.push("");
  }

  lines.push("## 4. Placer les fichiers");
  lines.push("");
  lines.push("Copiez les fichiers générés à la racine de votre projet :");
  lines.push("");
  lines.push("```");
  lines.push("votre-projet/");
  lines.push("├── CLAUDE.md              # Instructions pour Claude Code");
  lines.push("├── .claude/");
  lines.push("│   └── settings.json      # Paramètres Claude Code");

  if (config.features.includes("mcp")) {
    lines.push("├── .mcp.json              # Configuration des MCP");
  }

  const agents = generateAgentFiles(config);
  if (agents.length > 0) {
    lines.push("├── .claude/commands/");
    for (const agent of agents) {
      lines.push(`│   └── ${agent.name}`);
    }
  }

  if (config.features.includes("backlog")) {
    lines.push(
      "├── BACKLOG/               # Backlog EPICs & User Stories (gitignored)"
    );
    lines.push("│   └── README.md          # Vue macro de toutes les EPICs");
  }

  lines.push("└── ...");
  lines.push("```");
  lines.push("");

  lines.push("## 5. Lancer Claude Code");
  lines.push("");
  lines.push("```bash");
  lines.push("cd votre-projet");
  lines.push("claude");
  lines.push("```");
  lines.push("");

  lines.push("## 6. Vérifier la configuration");
  lines.push("");
  lines.push(
    'Tapez dans Claude Code : "Lis mon CLAUDE.md et confirme que tu comprends ma configuration."'
  );
  lines.push("");

  if (config.features.includes("mcp")) {
    lines.push("## 7. Configurer les MCP");
    lines.push("");
    lines.push(
      "N'oubliez pas de remplacer les tokens placeholder (VOTRE_TOKEN_ICI) dans .mcp.json par vos vrais tokens."
    );
    lines.push("");
  }

  if (config.features.includes("backlog")) {
    lines.push("## 8. Initialiser le backlog");
    lines.push("");
    lines.push("```bash");
    lines.push("mkdir -p BACKLOG");
    lines.push('echo "BACKLOG/" >> .gitignore');
    lines.push("```");
    lines.push("");
    lines.push(
      "Le dossier `BACKLOG/` est local et gitignored. Claude créera automatiquement les EPICs et user stories au fil de vos demandes."
    );
    lines.push("");
  }

  lines.push("---");
  lines.push(
    "Configuration générée par The Claude Codex | https://claude-codex.fr/configurator"
  );

  return lines.join("\n");
}

/**
 * Génère l'ensemble complet des fichiers de configuration.
 */
export function generateAll(config: ConfigState): GeneratedConfig {
  return {
    claudeMd: generateClaudeMd(config),
    settingsJson: generateSettingsJson(config),
    mcpJson: generateMcpJson(config),
    agentFiles: generateAgentFiles(config),
    installGuide: generateInstallGuide(config),
  };
}
