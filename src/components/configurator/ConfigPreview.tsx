"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Highlight, themes } from "prism-react-renderer";
import { Check, Clipboard, Terminal } from "lucide-react";
import type { GeneratedConfig } from "@/lib/configurator/types";
import { copyToClipboard, generateShellScript } from "@/lib/configurator/zip";
import clsx from "clsx";

type TabId = "claude-md" | "settings" | "mcp" | "agents" | "install";

interface TabDef {
  readonly id: TabId;
  readonly label: string;
  readonly language: string;
}

const TABS: ReadonlyArray<TabDef> = [
  { id: "claude-md", label: "CLAUDE.md", language: "markdown" },
  { id: "settings", label: "settings.json", language: "json" },
  { id: "mcp", label: ".mcp.json", language: "json" },
  { id: "agents", label: "Agents", language: "markdown" },
  { id: "install", label: "Guide", language: "markdown" },
];

interface ConfigPreviewProps {
  readonly config: GeneratedConfig;
}

export function ConfigPreview({ config }: ConfigPreviewProps) {
  const [activeTab, setActiveTab] = useState<TabId>("claude-md");
  const [copiedFile, setCopiedFile] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const fileCopyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const allCopyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tabRefs = useRef<Map<TabId, HTMLButtonElement>>(new Map());

  useEffect(() => {
    return () => {
      if (fileCopyTimeoutRef.current !== null) {
        clearTimeout(fileCopyTimeoutRef.current);
      }
      if (allCopyTimeoutRef.current !== null) {
        clearTimeout(allCopyTimeoutRef.current);
      }
    };
  }, []);

  /** Keyboard navigation for ARIA tabs pattern (arrow keys, Home, End) */
  const handleTabKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>) => {
      const currentIndex = TABS.findIndex((t) => t.id === activeTab);
      let nextIndex = currentIndex;

      switch (e.key) {
        case "ArrowRight":
          e.preventDefault();
          nextIndex = (currentIndex + 1) % TABS.length;
          break;
        case "ArrowLeft":
          e.preventDefault();
          nextIndex = (currentIndex - 1 + TABS.length) % TABS.length;
          break;
        case "Home":
          e.preventDefault();
          nextIndex = 0;
          break;
        case "End":
          e.preventDefault();
          nextIndex = TABS.length - 1;
          break;
        default:
          return;
      }

      const nextTabId = TABS[nextIndex].id;
      setActiveTab(nextTabId);
      const nextButton = tabRefs.current.get(nextTabId);
      if (nextButton) {
        nextButton.focus();
      }
    },
    [activeTab]
  );

  const getTabContent = useCallback((): string => {
    switch (activeTab) {
      case "claude-md":
        return config.claudeMd;
      case "settings":
        return config.settingsJson;
      case "mcp":
        return config.mcpJson;
      case "agents":
        if (config.agentFiles.length === 0) {
          return "# Aucun agent configuré\n\nActivez la feature \"Skills\" pour générer des agents spécialisés.";
        }
        return config.agentFiles
          .map(
            (f) =>
              `# --- ${f.name} ---\n\n${f.content}`
          )
          .join("\n\n---\n\n");
      case "install":
        return config.installGuide;
      default:
        return "";
    }
  }, [activeTab, config]);

  const getTabLanguage = useCallback((): string => {
    const tab = TABS.find((t) => t.id === activeTab);
    return tab ? tab.language : "markdown";
  }, [activeTab]);

  const handleCopyFile = useCallback(async () => {
    if (fileCopyTimeoutRef.current !== null) {
      clearTimeout(fileCopyTimeoutRef.current);
    }
    const content = getTabContent();
    const success = await copyToClipboard(content);
    if (success) {
      setCopiedFile(activeTab);
      fileCopyTimeoutRef.current = setTimeout(
        () => setCopiedFile(null),
        2000
      );
    }
  }, [activeTab, getTabContent]);

  const handleCopyAll = useCallback(async () => {
    if (allCopyTimeoutRef.current !== null) {
      clearTimeout(allCopyTimeoutRef.current);
    }
    const script = generateShellScript(config);
    const success = await copyToClipboard(script);
    if (success) {
      setCopiedAll(true);
      allCopyTimeoutRef.current = setTimeout(
        () => setCopiedAll(false),
        2000
      );
    }
  }, [config]);

  const content = getTabContent();
  const language = getTabLanguage();

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
      {/* Header avec tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700">
        <div className="flex overflow-x-auto" role="tablist" aria-label="Fichiers de configuration">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              ref={(el) => {
                if (el) {
                  tabRefs.current.set(tab.id, el);
                }
              }}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              onKeyDown={handleTabKeyDown}
              aria-selected={activeTab === tab.id}
              role="tab"
              id={`tab-${tab.id}`}
              aria-controls={`tabpanel-${tab.id}`}
              tabIndex={activeTab === tab.id ? 0 : -1}
              className={clsx(
                "whitespace-nowrap border-b-2 px-3 py-2.5 text-xs font-medium transition-colors sm:px-4 sm:text-sm",
                activeTab === tab.id
                  ? "border-brand-500 text-brand-600 dark:text-brand-400"
                  : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-300 dark:hover:text-white"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 px-2 sm:gap-2 sm:px-3">
          {/* Copier le fichier courant */}
          <button
            type="button"
            onClick={handleCopyFile}
            aria-label={
              copiedFile === activeTab
                ? "Fichier copié"
                : "Copier ce fichier"
            }
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 text-xs text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 sm:px-3"
          >
            {copiedFile === activeTab ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-500" aria-hidden="true" />
                <span className="hidden sm:inline">Copié</span>
              </>
            ) : (
              <>
                <Clipboard className="h-3.5 w-3.5" aria-hidden="true" />
                <span className="hidden sm:inline">Copier</span>
              </>
            )}
          </button>

          {/* Tout copier (script shell) */}
          <button
            type="button"
            onClick={handleCopyAll}
            aria-label={
              copiedAll
                ? "Script copié"
                : "Copier le script d'installation complet"
            }
            className="flex items-center gap-1.5 rounded-lg border border-brand-300 bg-brand-500/10 px-2 py-1.5 text-xs font-medium text-brand-700 transition-colors hover:bg-brand-500/20 dark:border-brand-600 dark:text-brand-400 dark:hover:bg-brand-500/20 sm:px-3"
          >
            {copiedAll ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-500" aria-hidden="true" />
                <span className="hidden sm:inline">Copié</span>
              </>
            ) : (
              <>
                <Terminal className="h-3.5 w-3.5" aria-hidden="true" />
                <span className="hidden sm:inline">Tout copier</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Contenu avec syntax highlighting */}
      <div
        className="max-h-[500px] overflow-auto bg-slate-950"
        role="tabpanel"
        id={`tabpanel-${activeTab}`}
        aria-labelledby={`tab-${activeTab}`}
      >
        <Highlight theme={themes.nightOwl} code={content} language={language}>
          {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <pre
              className={`${className} p-4 text-xs leading-relaxed sm:text-sm`}
              style={{ ...style, backgroundColor: "transparent" }}
            >
              {tokens.map((line, i) => (
                <div key={i} {...getLineProps({ line })}>
                  <span className="mr-4 inline-block w-8 select-none text-right text-slate-600">
                    {i + 1}
                  </span>
                  {line.map((token, j) => (
                    <span key={j} {...getTokenProps({ token })} />
                  ))}
                </div>
              ))}
            </pre>
          )}
        </Highlight>
      </div>
    </div>
  );
}
