"use client";

import { TypingTerminal } from "@/components/ui/TypingTerminal";

interface TerminalLine {
  readonly text: string;
  readonly className?: string;
  readonly delay?: number;
}

interface HeroTerminalProps {
  readonly lines?: readonly TerminalLine[];
  readonly ariaLabel?: string;
}

const DEFAULT_LINES: readonly TerminalLine[] = [
  { text: "$ claude", className: "text-slate-400", delay: 500 },
  {
    text: "> Crée-moi un site web moderne avec une landing page,",
    className: "text-slate-400 mt-2",
    delay: 400,
  },
  {
    text: "  un système d'authentification et un dashboard admin.",
    className: "text-slate-400",
    delay: 200,
  },
  {
    text: "Bien sûr ! Je vais créer votre projet étape par étape...",
    className: "text-emerald-400 mt-3",
    delay: 600,
  },
  {
    text: "  Analyse des besoins... fait",
    className: "text-slate-400 mt-1",
    delay: 400,
  },
  {
    text: "  Création de l'architecture... fait",
    className: "text-slate-400",
    delay: 400,
  },
  {
    text: "  Génération du code... en cours",
    className: "text-accent-400",
    delay: 300,
  },
];

export function HeroTerminal({ lines, ariaLabel }: HeroTerminalProps) {
  const terminalLines = lines ?? DEFAULT_LINES;
  return (
    <div
      className="glow overflow-hidden rounded-2xl shadow-2xl backdrop-blur"
      role="img"
      aria-label={ariaLabel ?? "Terminal simulant une interaction avec Claude Code : l'utilisateur demande de créer un site web et Claude Code génère le projet étape par étape"}
      style={{
        borderWidth: "1px",
        borderStyle: "solid",
        borderColor: "var(--hero-terminal-border)",
        backgroundColor: "var(--hero-terminal-bg)",
      }}
    >
      <div className="flex items-center gap-2 border-b border-slate-700/50 px-4 py-3" aria-hidden="true">
        <div className="h-3 w-3 rounded-full bg-red-500/80" />
        <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
        <div className="h-3 w-3 rounded-full bg-green-500/80" />
        <span className="ml-2 text-xs text-slate-400">terminal</span>
      </div>
      <div className="p-6">
        <TypingTerminal lines={terminalLines} typingSpeed={25} />
      </div>
    </div>
  );
}
