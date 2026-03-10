import type { ConfigState, GeneratedConfig, GeneratedFile } from "./types";
import { PROFILES, SUBSCRIPTIONS, FEATURES } from "./presets";

/**
 * Trouve le label d'un profil par son id.
 */
function getProfileLabel(profileId: string): string {
  const found = PROFILES.find((p) => p.id === profileId);
  return found ? found.label : profileId;
}

/**
 * Génère le contenu du fichier CLAUDE.md.
 */
export function generateClaudeMd(config: ConfigState): string {
  const profileLabel = config.profile
    ? getProfileLabel(config.profile)
    : "Développeur";

  const stacksList = config.stacks.length > 0
    ? config.stacks.join(", ")
    : "Non spécifié";

  const sections: string[] = [];

  // Header
  sections.push(`# Configuration Claude Code — ${profileLabel}`);
  sections.push("");
  sections.push(
    `Ce fichier a été généré par le Configurateur Interactif de The Claude Codex.`
  );
  sections.push(`Profil : ${profileLabel} | Stacks : ${stacksList}`);
  sections.push("");

  // Stack et contexte
  sections.push("## Stack technique");
  sections.push("");
  if (config.stacks.length > 0) {
    for (const stack of config.stacks) {
      sections.push(`- ${stack}`);
    }
  } else {
    sections.push("- Aucune stack spécifiée");
  }
  sections.push("");

  // Commandes utiles selon le profil
  sections.push("## Commandes");
  sections.push("");

  if (config.profile === "web-frontend" || config.profile === "designer") {
    if (config.stacks.includes("Next.js") || config.stacks.includes("Nuxt")) {
      sections.push("- `npm run dev` : Serveur de développement");
      sections.push("- `npm run build` : Build de production");
      sections.push("- `npm run lint` : Vérification du code");
    } else if (config.stacks.includes("React") || config.stacks.includes("Vue.js")) {
      sections.push("- `npm run dev` : Serveur de développement");
      sections.push("- `npm run build` : Build de production");
      sections.push("- `npm run test` : Lancer les tests");
    }
  } else if (config.profile === "web-backend") {
    if (config.stacks.includes("Python") || config.stacks.includes("FastAPI")) {
      sections.push("- `python -m pytest` : Lancer les tests");
      sections.push("- `uvicorn main:app --reload` : Serveur de développement");
      sections.push("- `pip install -r requirements.txt` : Installer les dépendances");
    } else if (config.stacks.includes("Node.js")) {
      sections.push("- `npm run dev` : Serveur de développement");
      sections.push("- `npm run build` : Build de production");
      sections.push("- `npm test` : Lancer les tests");
    }
  } else if (config.profile === "mobile") {
    sections.push("- `npx expo start` : Démarrer le serveur Expo");
    sections.push("- `npx expo run:ios` : Lancer sur iOS");
    sections.push("- `npx expo run:android` : Lancer sur Android");
  } else if (config.profile === "devops") {
    sections.push("- `docker compose up -d` : Démarrer les services");
    sections.push("- `terraform plan` : Planifier les changements infra");
    sections.push("- `kubectl get pods` : Vérifier l'état des pods");
  } else if (config.profile === "data") {
    sections.push("- `jupyter notebook` : Lancer Jupyter");
    sections.push("- `python -m pytest` : Lancer les tests");
    sections.push("- `pip install -r requirements.txt` : Installer les dépendances");
  } else {
    sections.push("- Adaptez ces commandes à votre projet");
  }
  sections.push("");

  // Architecture
  sections.push("## Architecture");
  sections.push("");
  sections.push("```");
  if (config.stacks.includes("Next.js") || config.stacks.includes("Nuxt")) {
    sections.push("/app              → Pages et layouts");
    sections.push("/components       → Composants réutilisables");
    sections.push("/lib              → Utilitaires et helpers");
    sections.push("/public           → Assets statiques");
  } else if (config.stacks.includes("FastAPI") || config.stacks.includes("Django")) {
    sections.push("/app              → Module principal");
    sections.push("/api              → Routes et endpoints");
    sections.push("/models           → Modèles de données");
    sections.push("/services         → Logique métier");
    sections.push("/tests            → Tests");
  } else if (config.stacks.includes("Express") || config.stacks.includes("NestJS")) {
    sections.push("/src              → Code source");
    sections.push("/src/routes       → Routes API");
    sections.push("/src/services     → Logique métier");
    sections.push("/src/models       → Modèles de données");
    sections.push("/tests            → Tests");
  } else {
    sections.push("/src              → Code source");
    sections.push("/tests            → Tests");
    sections.push("/docs             → Documentation");
  }
  sections.push("```");
  sections.push("");

  // Style de code
  sections.push("## Style de code");
  sections.push("");

  if (config.stacks.includes("TypeScript")) {
    sections.push("- TypeScript strict, jamais de `any`");
    sections.push("- Exports nommés uniquement (sauf pages/composants racine)");
  }
  if (config.stacks.includes("React") || config.stacks.includes("React Native")) {
    sections.push("- Composants fonctionnels avec hooks");
    sections.push("- Un composant par fichier");
  }
  if (config.stacks.includes("Tailwind CSS")) {
    sections.push("- Tailwind utility classes, pas de CSS custom");
  }
  if (config.stacks.includes("Python")) {
    sections.push("- Suivre PEP 8 pour le style de code");
    sections.push("- Utiliser des type hints systématiquement");
    sections.push("- Docstrings pour toutes les fonctions publiques");
  }

  // Règles génériques toujours présentes
  sections.push("- Immutabilité : créer de nouveaux objets, ne jamais muter");
  sections.push("- Fichiers courts et focalisés (< 400 lignes)");
  sections.push("- Fonctions courtes (< 50 lignes)");
  sections.push("- Gestion d'erreurs explicite à chaque niveau");
  sections.push("");

  // Règles de sécurité
  sections.push("## Sécurité");
  sections.push("");
  sections.push("- JAMAIS de secrets ou clés API dans le code source");
  sections.push("- Utiliser des variables d'environnement pour les secrets");
  sections.push("- Valider toutes les entrées utilisateur");
  sections.push("- Prévenir les injections SQL (requêtes paramétrées)");
  sections.push("");

  // Features activées
  if (config.features.length > 0) {
    sections.push("## Features activées");
    sections.push("");
    for (const featureId of config.features) {
      const featureInfo = FEATURES.find((f) => f.id === featureId);
      if (featureInfo) {
        sections.push(`### ${featureInfo.label}`);
        sections.push(`${featureInfo.description}`);
        sections.push("");
      }
    }
  }

  return sections.join("\n");
}

/**
 * Génère le contenu du fichier settings.json.
 */
export function generateSettingsJson(config: ConfigState): string {
  const settings: Record<string, unknown> = {};

  // Permissions selon le profil
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
    allow.push("Bash(docker *)");
    allow.push("Bash(curl *)");
  }

  if (config.profile === "data") {
    allow.push("Bash(python *)");
    allow.push("Bash(jupyter *)");
  }

  if (config.profile === "devops") {
    allow.push("Bash(terraform *)");
    allow.push("Bash(kubectl *)");
  }

  settings["permissions"] = {
    allow,
    deny: ["Bash(rm -rf *)"],
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

  // Context7 pour le dev
  if (
    config.profile === "web-frontend" ||
    config.profile === "web-backend" ||
    config.profile === "mobile" ||
    config.profile === "data"
  ) {
    servers["context7"] = {
      command: "npx",
      args: ["-y", "@upstash/context7-mcp@latest"],
    };
  }

  // Playwright pour les tests UI
  if (config.profile === "web-frontend" || config.profile === "designer") {
    servers["playwright"] = {
      command: "npx",
      args: ["-y", "@playwright/mcp"],
    };
  }

  // GitHub
  if (
    config.profile !== "writer" &&
    config.profile !== "beginner"
  ) {
    servers["github"] = {
      command: "npx",
      args: ["-y", "@modelcontextprotocol/server-github"],
      env: {
        GITHUB_TOKEN: "VOTRE_TOKEN_ICI",
      },
    };
  }

  // Sentry pour le monitoring
  if (config.profile === "web-backend" || config.profile === "devops") {
    servers["sentry"] = {
      command: "npx",
      args: ["-y", "@sentry/mcp-server"],
      env: {
        SENTRY_AUTH_TOKEN: "VOTRE_TOKEN_ICI",
      },
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

  // Agent code-reviewer (toujours utile)
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

  // Agent TDD si dev
  if (
    config.profile === "web-frontend" ||
    config.profile === "web-backend" ||
    config.profile === "mobile" ||
    config.profile === "data"
  ) {
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

  // Agent sécurité si backend ou devops
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

  // Abonnement
  const subInfo = SUBSCRIPTIONS.find((s) => s.id === config.subscription);
  if (subInfo) {
    lines.push(`## 3. Abonnement recommandé : ${subInfo.label} (${subInfo.price})`);
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
  lines.push('Tapez dans Claude Code : "Lis mon CLAUDE.md et confirme que tu comprends ma configuration."');
  lines.push("");

  if (config.features.includes("mcp")) {
    lines.push("## 7. Configurer les MCP");
    lines.push("");
    lines.push(
      "N'oubliez pas de remplacer les tokens placeholder (VOTRE_TOKEN_ICI) dans .mcp.json par vos vrais tokens."
    );
    lines.push("");
  }

  lines.push("---");
  lines.push(
    "Configuration générée par The Claude Codex — https://claude-codex.fr/configurator"
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
