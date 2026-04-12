import { describe, it, expect, vi, beforeEach } from "vitest";
import { copyToClipboard, generateShellScript } from "@/lib/configurator/zip";
import type { GeneratedConfig } from "@/lib/configurator/types";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeConfig(overrides: Partial<GeneratedConfig> = {}): GeneratedConfig {
  return {
    claudeMd: "# My project\nSome instructions.",
    settingsJson: '{"permissions": {}}',
    mcpJson: '{"mcpServers": {}}',
    agentFiles: [],
    installGuide: "",
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// copyToClipboard
// ---------------------------------------------------------------------------

describe("copyToClipboard", () => {
  beforeEach(() => {
    // Reset any existing clipboard mock between tests
    vi.restoreAllMocks();
  });

  it("returns true when the Clipboard API succeeds", async () => {
    Object.assign(navigator, {
      clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
    });

    const result = await copyToClipboard("hello");

    expect(result).toBe(true);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("hello");
  });

  it("falls back to execCommand when the Clipboard API throws", async () => {
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockRejectedValue(new Error("Not allowed")),
      },
    });

    // jsdom does not define execCommand — define it so vi.spyOn can wrap it
    if (!document.execCommand) {
      Object.defineProperty(document, "execCommand", {
        writable: true,
        configurable: true,
        value: () => false,
      });
    }

    const execCommandSpy = vi
      .spyOn(document, "execCommand")
      .mockReturnValue(true);

    const result = await copyToClipboard("fallback text");

    expect(result).toBe(true);
    expect(execCommandSpy).toHaveBeenCalledWith("copy");
  });
});

// ---------------------------------------------------------------------------
// generateShellScript
// ---------------------------------------------------------------------------

describe("generateShellScript", () => {
  it("includes a shebang and header comment", () => {
    const script = generateShellScript(makeConfig());

    expect(script).toMatch(/^#!\/bin\/bash/);
    expect(script).toContain("# Script généré par The Claude Codex");
  });

  it("includes CLAUDE.md content inside a heredoc", () => {
    const config = makeConfig({ claudeMd: "# Project\nSome rules." });
    const script = generateShellScript(config);

    expect(script).toContain("cat > CLAUDE.md << 'CLAUDE_EOF'");
    expect(script).toContain("# Project\nSome rules.");
    expect(script).toContain("CLAUDE_EOF");
  });

  it("includes settings.json with mkdir -p .claude", () => {
    const config = makeConfig({ settingsJson: '{"key": "value"}' });
    const script = generateShellScript(config);

    expect(script).toContain("mkdir -p .claude");
    expect(script).toContain("cat > .claude/settings.json << 'SETTINGS_EOF'");
    expect(script).toContain('{"key": "value"}');
    expect(script).toContain("SETTINGS_EOF");
  });

  it("includes .mcp.json content inside a heredoc", () => {
    const config = makeConfig({ mcpJson: '{"mcpServers": {"github": {}}}' });
    const script = generateShellScript(config);

    expect(script).toContain("cat > .mcp.json << 'MCP_EOF'");
    expect(script).toContain('{"mcpServers": {"github": {}}}');
    expect(script).toContain("MCP_EOF");
  });

  it("includes agent file content when agent files are present", () => {
    const config = makeConfig({
      agentFiles: [{ name: "review.md", content: "Review instructions." }],
    });
    const script = generateShellScript(config);

    expect(script).toContain("mkdir -p .claude/commands");
    expect(script).toContain(".claude/commands/review.md");
    expect(script).toContain("Review instructions.");
    expect(script).toContain("AGENT_EOF");
  });

  it("omits agent section entirely when no agent files are provided", () => {
    const config = makeConfig({ agentFiles: [] });
    const script = generateShellScript(config);

    expect(script).not.toContain("mkdir -p .claude/commands");
    expect(script).not.toContain("AGENT_EOF");
  });

  it("escapes single quotes in agent file names", () => {
    const config = makeConfig({
      agentFiles: [
        { name: "it's-tricky.md", content: "Some content." },
      ],
    });
    const script = generateShellScript(config);

    // Single quote in the name should be escaped as '\''
    expect(script).toContain("it'\\''s-tricky.md");
  });

  it("includes both agent files when multiple are provided", () => {
    const config = makeConfig({
      agentFiles: [
        { name: "commit.md", content: "Commit instructions." },
        { name: "review.md", content: "Review instructions." },
      ],
    });
    const script = generateShellScript(config);

    expect(script).toContain(".claude/commands/commit.md");
    expect(script).toContain("Commit instructions.");
    expect(script).toContain(".claude/commands/review.md");
    expect(script).toContain("Review instructions.");
  });
});
