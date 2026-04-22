import type { GeneratedConfig } from "./types";

/**
 * Copie un texte dans le presse-papiers.
 * Retourne true si la copie a réussi.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback pour les navigateurs sans Clipboard API
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.opacity = "0";
    document.body.appendChild(textArea);
    textArea.select();
    const success = document.execCommand("copy");
    document.body.removeChild(textArea);
    return success;
  }
}

/**
 * Échappe une chaîne pour l'utiliser dans un heredoc shell.
 * Remplace les single quotes par '\'' pour la sécurité.
 */
function escapeForShell(content: string): string {
  return content.replaceAll("'", "'\\''");
}

/**
 * Génère un script shell qui crée tous les fichiers de configuration.
 */
export function generateShellScript(config: GeneratedConfig): string {
  const lines: string[] = [];

  lines.push("#!/bin/bash", "# Script généré par The Claude Codex | https://claude-codex.fr/configurator", "# Exécutez ce script à la racine de votre projet.", "");

  // CLAUDE.md
  lines.push("# Créer CLAUDE.md", `cat > CLAUDE.md << 'CLAUDE_EOF'`, config.claudeMd, "CLAUDE_EOF", "");

  // settings.json
  lines.push("# Créer .claude/settings.json", "mkdir -p .claude", `cat > .claude/settings.json << 'SETTINGS_EOF'`, config.settingsJson, "SETTINGS_EOF", "");

  // .mcp.json
  lines.push("# Créer .mcp.json", `cat > .mcp.json << 'MCP_EOF'`, config.mcpJson, "MCP_EOF", "");

  // Agent files
  if (config.agentFiles.length > 0) {
    lines.push("# Créer les commandes (slash commands)", "mkdir -p .claude/commands", "");

    for (const agent of config.agentFiles) {
      lines.push(`cat > '.claude/commands/${escapeForShell(agent.name)}' << 'AGENT_EOF'`, agent.content, "AGENT_EOF", "");
    }
  }

  lines.push('echo "Configuration Claude Code installée avec succès !"', 'echo "Lancez claude pour commencer."');

  return lines.join("\n");
}
