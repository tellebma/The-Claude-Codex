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
  return content.replace(/'/g, "'\\''");
}

/**
 * Génère un script shell qui crée tous les fichiers de configuration.
 */
export function generateShellScript(config: GeneratedConfig): string {
  const lines: string[] = [];

  lines.push("#!/bin/bash");
  lines.push("# Script généré par The Claude Codex | https://claude-codex.fr/configurator");
  lines.push("# Exécutez ce script à la racine de votre projet.");
  lines.push("");

  // CLAUDE.md
  lines.push("# Créer CLAUDE.md");
  lines.push(`cat > CLAUDE.md << 'CLAUDE_EOF'`);
  lines.push(config.claudeMd);
  lines.push("CLAUDE_EOF");
  lines.push("");

  // settings.json
  lines.push("# Créer .claude/settings.json");
  lines.push("mkdir -p .claude");
  lines.push(`cat > .claude/settings.json << 'SETTINGS_EOF'`);
  lines.push(config.settingsJson);
  lines.push("SETTINGS_EOF");
  lines.push("");

  // .mcp.json
  lines.push("# Créer .mcp.json");
  lines.push(`cat > .mcp.json << 'MCP_EOF'`);
  lines.push(config.mcpJson);
  lines.push("MCP_EOF");
  lines.push("");

  // Agent files
  if (config.agentFiles.length > 0) {
    lines.push("# Créer les commandes (slash commands)");
    lines.push("mkdir -p .claude/commands");
    lines.push("");

    for (const agent of config.agentFiles) {
      lines.push(`cat > '.claude/commands/${escapeForShell(agent.name)}' << 'AGENT_EOF'`);
      lines.push(agent.content);
      lines.push("AGENT_EOF");
      lines.push("");
    }
  }

  lines.push('echo "Configuration Claude Code installée avec succès !"');
  lines.push('echo "Lancez claude pour commencer."');

  return lines.join("\n");
}
