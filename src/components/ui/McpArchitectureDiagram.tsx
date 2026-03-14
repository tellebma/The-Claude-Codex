"use client";

import { BookOpen, Terminal, Plug, Globe } from "lucide-react";
import { AnimatedBeam } from "@/components/ui/AnimatedBeam";

const nodes = [
  {
    icon: BookOpen,
    label: "Vous",
    description: '"Montre-moi les issues GitHub ouvertes"',
    gradient: "from-brand-500/20 to-brand-500/5",
    iconColor: "text-brand-700 dark:text-brand-400",
    border: "",
    beamColor: "#06b6d4",
  },
  {
    icon: Terminal,
    label: "Claude Code",
    description: "Comprend votre demande et appelle le bon MCP",
    gradient: "from-brand-500/20 to-brand-500/5",
    iconColor: "text-brand-700 dark:text-brand-400",
    border: "border-brand-500/30",
    beamColor: "#f59e0b",
  },
  {
    icon: Plug,
    label: "MCP Server",
    description: "Traduit la requête en appels API",
    gradient: "from-accent-500/20 to-accent-500/5",
    iconColor: "text-accent-500",
    border: "border-accent-500/30",
    beamColor: "#22c55e",
  },
  {
    icon: Globe,
    label: "Service externe",
    description: "GitHub, Slack, Gmail, BDD...",
    gradient: "from-emerald-500/20 to-emerald-500/5",
    iconColor: "text-emerald-500",
    border: "border-emerald-500/30",
    beamColor: "",
  },
] as const;

export function McpArchitectureDiagram() {
  return (
    <div className="flex flex-col items-center gap-0 sm:flex-row">
      {nodes.map((node, i) => {
        const Icon = node.icon;
        return (
          <div key={node.label} className="flex flex-col items-center sm:flex-row sm:flex-1">
            <div className={`glass-card flex-1 p-5 text-center ${node.border}`}>
              <div
                className={`mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${node.gradient}`}
              >
                <Icon className={`h-6 w-6 ${node.iconColor}`} aria-hidden="true" />
              </div>
              <p className="text-sm font-semibold">{node.label}</p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-300">
                {node.description}
              </p>
            </div>
            {i < nodes.length - 1 && (
              <>
                <div className="hidden sm:block">
                  <AnimatedBeam direction="horizontal" color={node.beamColor} />
                </div>
                <div className="block sm:hidden">
                  <AnimatedBeam direction="vertical" color={node.beamColor} />
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
