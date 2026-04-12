import { describe, it, expect } from "vitest";
import {
  generateClaudeMd,
  generateSettingsJson,
  generateMcpJson,
  generateAgentFiles,
  generateInstallGuide,
  generateAll,
} from "@/lib/configurator/generator";
import type { ConfigState } from "@/lib/configurator/types";

const baseConfig: ConfigState = {
  profile: "web-frontend",
  stacks: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
  subscription: "pro",
  features: ["mcp", "skills"],
};

describe("generateClaudeMd", () => {
  it("includes the profile label in the header", () => {
    const result = generateClaudeMd(baseConfig);
    expect(result).toContain("Développeur Frontend");
  });

  it("includes the stacks list", () => {
    const result = generateClaudeMd(baseConfig);
    expect(result).toContain("React, Next.js, TypeScript, Tailwind CSS");
  });

  it("lists stacks in the stack section", () => {
    const result = generateClaudeMd(baseConfig);
    expect(result).toContain("- React");
    expect(result).toContain("- Next.js");
  });

  it("includes frontend commands for web-frontend profile", () => {
    const result = generateClaudeMd(baseConfig);
    expect(result).toContain("npm run dev");
    expect(result).toContain("npm run build");
  });

  it("includes backend commands for web-backend profile with Python", () => {
    const config: ConfigState = {
      ...baseConfig,
      profile: "web-backend",
      stacks: ["Python", "FastAPI"],
    };
    const result = generateClaudeMd(config);
    expect(result).toContain("python -m pytest");
    expect(result).toContain("uvicorn");
  });

  it("includes Node.js backend commands", () => {
    const config: ConfigState = {
      ...baseConfig,
      profile: "web-backend",
      stacks: ["Node.js"],
    };
    const result = generateClaudeMd(config);
    expect(result).toContain("npm run dev");
    expect(result).toContain("npm test");
  });

  it("includes mobile commands for mobile profile", () => {
    const config: ConfigState = {
      ...baseConfig,
      profile: "mobile",
      stacks: ["React Native"],
    };
    const result = generateClaudeMd(config);
    expect(result).toContain("npx expo start");
  });

  it("includes devops commands", () => {
    const config: ConfigState = {
      ...baseConfig,
      profile: "devops",
      stacks: ["Docker", "Terraform"],
    };
    const result = generateClaudeMd(config);
    expect(result).toContain("docker compose up");
    expect(result).toContain("terraform plan");
  });

  it("includes data commands", () => {
    const config: ConfigState = {
      ...baseConfig,
      profile: "data",
      stacks: ["Python", "Jupyter"],
    };
    const result = generateClaudeMd(config);
    expect(result).toContain("jupyter notebook");
  });

  it("includes generic commands for unknown profiles", () => {
    const config: ConfigState = {
      ...baseConfig,
      profile: "writer",
      stacks: [],
    };
    const result = generateClaudeMd(config);
    expect(result).toContain("Adaptez ces commandes");
  });

  it("includes Next.js architecture for Next.js stack", () => {
    const result = generateClaudeMd(baseConfig);
    expect(result).toContain("/app");
    expect(result).toContain("/components");
  });

  it("includes FastAPI architecture when using FastAPI", () => {
    const config: ConfigState = {
      ...baseConfig,
      profile: "web-backend",
      stacks: ["FastAPI"],
    };
    const result = generateClaudeMd(config);
    expect(result).toContain("/api");
    expect(result).toContain("/models");
  });

  it("includes Express architecture for Express stack", () => {
    const config: ConfigState = {
      ...baseConfig,
      profile: "web-backend",
      stacks: ["Express"],
    };
    const result = generateClaudeMd(config);
    expect(result).toContain("/src/routes");
    expect(result).toContain("/src/services");
  });

  it("includes TypeScript style rules when TypeScript is in stacks", () => {
    const result = generateClaudeMd(baseConfig);
    expect(result).toContain("TypeScript strict");
    expect(result).toContain("jamais de `any`");
  });

  it("includes React style rules when React is in stacks", () => {
    const result = generateClaudeMd(baseConfig);
    expect(result).toContain("Composants fonctionnels");
  });

  it("includes Tailwind rule when Tailwind CSS is in stacks", () => {
    const result = generateClaudeMd(baseConfig);
    expect(result).toContain("Tailwind utility classes");
  });

  it("includes Python style rules when Python is in stacks", () => {
    const config: ConfigState = {
      ...baseConfig,
      stacks: ["Python"],
    };
    const result = generateClaudeMd(config);
    expect(result).toContain("PEP 8");
    expect(result).toContain("type hints");
  });

  it("always includes generic code style rules", () => {
    const result = generateClaudeMd(baseConfig);
    expect(result).toContain("Immutabilit");
    expect(result).toContain("< 400 lignes");
  });

  it("always includes security section", () => {
    const result = generateClaudeMd(baseConfig);
    expect(result).toContain("JAMAIS de secrets");
    expect(result).toContain("variables d'environnement");
  });

  it("includes feature descriptions when features are set", () => {
    const result = generateClaudeMd(baseConfig);
    expect(result).toContain("Features activ");
  });

  it("includes backlog section when backlog feature is enabled", () => {
    const config: ConfigState = {
      ...baseConfig,
      features: ["backlog"],
    };
    const result = generateClaudeMd(config);
    expect(result).toContain("Backlog & Suivi des demandes");
    expect(result).toContain("EPIC");
    expect(result).toContain("User Story");
  });

  it("handles null profile gracefully", () => {
    const config: ConfigState = {
      profile: null,
      stacks: [],
      subscription: null,
      features: [],
    };
    const result = generateClaudeMd(config);
    expect(result).toContain("Développeur");
    expect(result).toContain("Non spécifié");
  });

  it("handles empty stacks", () => {
    const config: ConfigState = {
      ...baseConfig,
      stacks: [],
    };
    const result = generateClaudeMd(config);
    expect(result).toContain("Aucune stack spécifiée");
  });
});

describe("generateSettingsJson", () => {
  it("returns valid JSON", () => {
    const result = generateSettingsJson(baseConfig);
    expect(() => JSON.parse(result)).not.toThrow();
  });

  it("includes base permissions for all profiles", () => {
    const parsed = JSON.parse(generateSettingsJson(baseConfig));
    const allow = parsed.permissions.allow as string[];
    expect(allow).toContain("Read");
    expect(allow).toContain("Edit");
    expect(allow).toContain("Write");
    expect(allow).toContain("Bash(npm run *)");
    expect(allow).toContain("Bash(git *)");
  });

  it("includes docker and curl for web-backend", () => {
    const config: ConfigState = { ...baseConfig, profile: "web-backend" };
    const parsed = JSON.parse(generateSettingsJson(config));
    const allow = parsed.permissions.allow as string[];
    expect(allow).toContain("Bash(docker *)");
    expect(allow).toContain("Bash(curl *)");
  });

  it("includes python and jupyter for data profile", () => {
    const config: ConfigState = { ...baseConfig, profile: "data" };
    const parsed = JSON.parse(generateSettingsJson(config));
    const allow = parsed.permissions.allow as string[];
    expect(allow).toContain("Bash(python *)");
    expect(allow).toContain("Bash(jupyter *)");
  });

  it("includes terraform and kubectl for devops", () => {
    const config: ConfigState = { ...baseConfig, profile: "devops" };
    const parsed = JSON.parse(generateSettingsJson(config));
    const allow = parsed.permissions.allow as string[];
    expect(allow).toContain("Bash(terraform *)");
    expect(allow).toContain("Bash(kubectl *)");
    // devops also gets docker
    expect(allow).toContain("Bash(docker *)");
  });

  it("always denies rm -rf", () => {
    const parsed = JSON.parse(generateSettingsJson(baseConfig));
    expect(parsed.permissions.deny).toContain("Bash(rm -rf *)");
  });
});

describe("generateMcpJson", () => {
  it("returns valid JSON", () => {
    const result = generateMcpJson(baseConfig);
    expect(() => JSON.parse(result)).not.toThrow();
  });

  it("returns empty mcpServers when mcp feature is disabled", () => {
    const config: ConfigState = { ...baseConfig, features: [] };
    const parsed = JSON.parse(generateMcpJson(config));
    expect(parsed.mcpServers).toEqual({});
  });

  it("includes context7 for frontend profiles", () => {
    const parsed = JSON.parse(generateMcpJson(baseConfig));
    expect(parsed.mcpServers).toHaveProperty("context7");
  });

  it("includes playwright for frontend profiles", () => {
    const parsed = JSON.parse(generateMcpJson(baseConfig));
    expect(parsed.mcpServers).toHaveProperty("playwright");
  });

  it("includes github for non-writer, non-beginner profiles", () => {
    const parsed = JSON.parse(generateMcpJson(baseConfig));
    expect(parsed.mcpServers).toHaveProperty("github");
  });

  it("excludes github for writer profile", () => {
    const config: ConfigState = {
      ...baseConfig,
      profile: "writer",
    };
    const parsed = JSON.parse(generateMcpJson(config));
    expect(parsed.mcpServers).not.toHaveProperty("github");
  });

  it("excludes github for beginner profile", () => {
    const config: ConfigState = {
      ...baseConfig,
      profile: "beginner",
    };
    const parsed = JSON.parse(generateMcpJson(config));
    expect(parsed.mcpServers).not.toHaveProperty("github");
  });

  it("includes sentry for backend profiles", () => {
    const config: ConfigState = {
      ...baseConfig,
      profile: "web-backend",
    };
    const parsed = JSON.parse(generateMcpJson(config));
    expect(parsed.mcpServers).toHaveProperty("sentry");
  });

  it("excludes sentry for frontend profiles", () => {
    const parsed = JSON.parse(generateMcpJson(baseConfig));
    expect(parsed.mcpServers).not.toHaveProperty("sentry");
  });
});

describe("generateAgentFiles", () => {
  it("returns empty array when skills feature is disabled", () => {
    const config: ConfigState = { ...baseConfig, features: [] };
    const result = generateAgentFiles(config);
    expect(result).toHaveLength(0);
  });

  it("always includes code-reviewer agent when skills is enabled", () => {
    const result = generateAgentFiles(baseConfig);
    const names = result.map((f) => f.name);
    expect(names).toContain("code-reviewer.md");
  });

  it("includes tdd-guide for dev profiles", () => {
    const result = generateAgentFiles(baseConfig);
    const names = result.map((f) => f.name);
    expect(names).toContain("tdd-guide.md");
  });

  it("includes security-reviewer for backend profiles", () => {
    const config: ConfigState = {
      ...baseConfig,
      profile: "web-backend",
    };
    const result = generateAgentFiles(config);
    const names = result.map((f) => f.name);
    expect(names).toContain("security-reviewer.md");
  });

  it("excludes tdd-guide for writer profile", () => {
    const config: ConfigState = {
      ...baseConfig,
      profile: "writer",
    };
    const result = generateAgentFiles(config);
    const names = result.map((f) => f.name);
    expect(names).not.toContain("tdd-guide.md");
  });

  it("each agent file has a non-empty content", () => {
    const result = generateAgentFiles(baseConfig);
    for (const file of result) {
      expect(file.name).toBeTruthy();
      expect(file.content.length).toBeGreaterThan(0);
    }
  });
});

describe("generateInstallGuide", () => {
  it("includes prerequisite section", () => {
    const result = generateInstallGuide(baseConfig);
    expect(result).toContain("Prérequis");
    expect(result).toContain("Node.js 18+");
  });

  it("includes install command", () => {
    const result = generateInstallGuide(baseConfig);
    expect(result).toContain("npm install -g @anthropic-ai/claude-code");
  });

  it("includes subscription info when set", () => {
    const result = generateInstallGuide(baseConfig);
    expect(result).toContain("Pro");
    expect(result).toContain("20 $/mois");
  });

  it("includes MCP section when mcp feature is enabled", () => {
    const result = generateInstallGuide(baseConfig);
    expect(result).toContain("Configurer les MCP");
    expect(result).toContain("VOTRE_TOKEN_ICI");
  });

  it("excludes MCP section when mcp feature is disabled", () => {
    const config: ConfigState = { ...baseConfig, features: ["skills"] };
    const result = generateInstallGuide(config);
    expect(result).not.toContain("Configurer les MCP");
  });

  it("includes backlog section when backlog feature is enabled", () => {
    const config: ConfigState = {
      ...baseConfig,
      features: ["backlog"],
    };
    const result = generateInstallGuide(config);
    expect(result).toContain("Initialiser le backlog");
    expect(result).toContain("mkdir -p BACKLOG");
  });

  it("includes file tree with agent files when skills is enabled", () => {
    const result = generateInstallGuide(baseConfig);
    expect(result).toContain("code-reviewer.md");
  });

  it("includes the codex footer", () => {
    const result = generateInstallGuide(baseConfig);
    expect(result).toContain("claude-codex.fr/configurator");
  });
});

describe("generateAll", () => {
  it("returns all expected fields", () => {
    const result = generateAll(baseConfig);
    expect(result.claudeMd).toBeTruthy();
    expect(result.settingsJson).toBeTruthy();
    expect(result.mcpJson).toBeTruthy();
    expect(result.agentFiles).toBeDefined();
    expect(result.installGuide).toBeTruthy();
  });

  it("generates consistent output across individual generators", () => {
    const all = generateAll(baseConfig);
    expect(all.claudeMd).toBe(generateClaudeMd(baseConfig));
    expect(all.settingsJson).toBe(generateSettingsJson(baseConfig));
    expect(all.mcpJson).toBe(generateMcpJson(baseConfig));
    expect(all.installGuide).toBe(generateInstallGuide(baseConfig));
  });
});
