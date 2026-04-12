import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import { ConfigPreview } from "@/components/configurator/ConfigPreview";
import type { GeneratedConfig } from "@/lib/configurator/types";

// Mock prism-react-renderer
vi.mock("prism-react-renderer", () => ({
  Highlight: ({
    children,
    code,
  }: {
    children: (props: {
      className: string;
      style: Record<string, string>;
      tokens: Array<Array<{ content: string; types: string[] }>>;
      getLineProps: (opts: {
        line: Array<{ content: string; types: string[] }>;
      }) => Record<string, unknown>;
      getTokenProps: (opts: {
        token: { content: string; types: string[] };
      }) => Record<string, unknown>;
    }) => React.ReactNode;
    code: string;
    language: string;
    theme: unknown;
  }) => {
    const lines = code.split("\n").map((line) => [
      { content: line, types: ["plain"] },
    ]);
    return children({
      className: "prism-code",
      style: {},
      tokens: lines,
      getLineProps: () => ({}),
      getTokenProps: ({ token }: { token: { content: string } }) => ({
        children: token.content,
      }),
    });
  },
  themes: { nightOwl: {} },
}));

// Mock zip utilities
vi.mock("@/lib/configurator/zip", () => ({
  copyToClipboard: vi.fn().mockResolvedValue(true),
  generateShellScript: vi.fn().mockReturnValue("#!/bin/bash\necho install"),
}));

const sampleConfig: GeneratedConfig = {
  claudeMd: "# CLAUDE.md content",
  settingsJson: '{ "setting": true }',
  mcpJson: '{ "mcp": "config" }',
  agentFiles: [
    { name: "agent-1.md", content: "Agent 1 content" },
  ],
  installGuide: "# Installation guide",
};

describe("ConfigPreview", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders all tab labels", () => {
    render(<ConfigPreview config={sampleConfig} />);
    expect(screen.getByRole("tab", { name: "CLAUDE.md" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "settings.json" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: ".mcp.json" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Agents" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Guide" })).toBeInTheDocument();
  });

  it("shows CLAUDE.md content by default", () => {
    render(<ConfigPreview config={sampleConfig} />);
    expect(screen.getByText("# CLAUDE.md content")).toBeInTheDocument();
  });

  it("switches to settings tab when clicked", () => {
    render(<ConfigPreview config={sampleConfig} />);
    fireEvent.click(screen.getByRole("tab", { name: "settings.json" }));
    expect(screen.getByText('{ "setting": true }')).toBeInTheDocument();
  });

  it("switches to MCP tab", () => {
    render(<ConfigPreview config={sampleConfig} />);
    fireEvent.click(screen.getByRole("tab", { name: ".mcp.json" }));
    expect(screen.getByText('{ "mcp": "config" }')).toBeInTheDocument();
  });

  it("shows agent files content", () => {
    render(<ConfigPreview config={sampleConfig} />);
    fireEvent.click(screen.getByRole("tab", { name: "Agents" }));
    expect(screen.getByText(/agent-1\.md/)).toBeInTheDocument();
  });

  it("shows fallback message when no agent files", () => {
    const configNoAgents: GeneratedConfig = {
      ...sampleConfig,
      agentFiles: [],
    };
    render(<ConfigPreview config={configNoAgents} />);
    fireEvent.click(screen.getByRole("tab", { name: "Agents" }));
    expect(screen.getByText(/Aucun agent configuré/)).toBeInTheDocument();
  });

  it("shows install guide content", () => {
    render(<ConfigPreview config={sampleConfig} />);
    fireEvent.click(screen.getByRole("tab", { name: "Guide" }));
    expect(screen.getByText("# Installation guide")).toBeInTheDocument();
  });

  it("first tab is selected by default (aria-selected)", () => {
    render(<ConfigPreview config={sampleConfig} />);
    const firstTab = screen.getByRole("tab", { name: "CLAUDE.md" });
    expect(firstTab).toHaveAttribute("aria-selected", "true");
  });

  it("updates aria-selected when switching tabs", () => {
    render(<ConfigPreview config={sampleConfig} />);
    const settingsTab = screen.getByRole("tab", { name: "settings.json" });
    fireEvent.click(settingsTab);
    expect(settingsTab).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tab", { name: "CLAUDE.md" })).toHaveAttribute("aria-selected", "false");
  });

  it("navigates tabs with ArrowRight key", () => {
    render(<ConfigPreview config={sampleConfig} />);
    const firstTab = screen.getByRole("tab", { name: "CLAUDE.md" });
    fireEvent.keyDown(firstTab, { key: "ArrowRight" });
    expect(screen.getByRole("tab", { name: "settings.json" })).toHaveAttribute("aria-selected", "true");
  });

  it("navigates tabs with ArrowLeft key", () => {
    render(<ConfigPreview config={sampleConfig} />);
    // First switch to settings tab
    fireEvent.click(screen.getByRole("tab", { name: "settings.json" }));
    const settingsTab = screen.getByRole("tab", { name: "settings.json" });
    fireEvent.keyDown(settingsTab, { key: "ArrowLeft" });
    expect(screen.getByRole("tab", { name: "CLAUDE.md" })).toHaveAttribute("aria-selected", "true");
  });

  it("navigates to first tab with Home key", () => {
    render(<ConfigPreview config={sampleConfig} />);
    fireEvent.click(screen.getByRole("tab", { name: "Guide" }));
    const guideTab = screen.getByRole("tab", { name: "Guide" });
    fireEvent.keyDown(guideTab, { key: "Home" });
    expect(screen.getByRole("tab", { name: "CLAUDE.md" })).toHaveAttribute("aria-selected", "true");
  });

  it("navigates to last tab with End key", () => {
    render(<ConfigPreview config={sampleConfig} />);
    const firstTab = screen.getByRole("tab", { name: "CLAUDE.md" });
    fireEvent.keyDown(firstTab, { key: "End" });
    expect(screen.getByRole("tab", { name: "Guide" })).toHaveAttribute("aria-selected", "true");
  });

  it("copies current file to clipboard", async () => {
    const { copyToClipboard } = await import("@/lib/configurator/zip");
    render(<ConfigPreview config={sampleConfig} />);
    const copyBtn = screen.getByLabelText("Copier ce fichier");
    fireEvent.click(copyBtn);

    await waitFor(() => {
      expect(copyToClipboard).toHaveBeenCalledWith("# CLAUDE.md content");
    });
  });

  it("copies all (shell script) to clipboard", async () => {
    const { copyToClipboard, generateShellScript } = await import("@/lib/configurator/zip");
    render(<ConfigPreview config={sampleConfig} />);
    const copyAllBtn = screen.getByLabelText("Copier le script d'installation complet");
    fireEvent.click(copyAllBtn);

    await waitFor(() => {
      expect(generateShellScript).toHaveBeenCalledWith(sampleConfig);
      expect(copyToClipboard).toHaveBeenCalledWith("#!/bin/bash\necho install");
    });
  });

  it("shows copied feedback after successful copy", async () => {
    render(<ConfigPreview config={sampleConfig} />);
    const copyBtn = screen.getByLabelText("Copier ce fichier");
    fireEvent.click(copyBtn);

    await waitFor(() => {
      expect(screen.getByLabelText("Fichier copié")).toBeInTheDocument();
    });
  });

  it("has correct tabpanel accessibility attributes", () => {
    render(<ConfigPreview config={sampleConfig} />);
    const panel = screen.getByRole("tabpanel");
    expect(panel).toHaveAttribute("id", "tabpanel-claude-md");
    expect(panel).toHaveAttribute("aria-labelledby", "tab-claude-md");
  });
});
