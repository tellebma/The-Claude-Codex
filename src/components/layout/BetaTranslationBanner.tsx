"use client";

import { useEffect, useState } from "react";
import { X, Languages } from "lucide-react";

const STORAGE_KEY = "tcc:es-beta-banner-dismissed";
const ISSUES_URL = "https://github.com/tellebma/The-Claude-Codex/issues";

function readDismissed(): boolean {
  try {
    return globalThis.localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function writeDismissed(): void {
  try {
    globalThis.localStorage.setItem(STORAGE_KEY, "1");
  } catch {
    /* localStorage indisponible (navigation privee, quota plein) -- on ignore */
  }
}

/**
 * Banniere "traduction beta" affichee uniquement sur la locale ES (EPIC
 * i18n-espagnol-2026-05, ES-6). La traduction est generee par LLM + glossaire
 * (docs/i18n/glossary-es.md), sans relecture native pour l'instant -- la
 * banniere invite a signaler les erreurs via GitHub Issues pendant la phase
 * de validation.
 *
 * Dismissible via localStorage : se ferme au premier clic et ne reapparait
 * plus lors des visites suivantes depuis le meme navigateur. L'etat initial
 * cote serveur est toujours "visible" (SSR-safe, pas d'acces a localStorage)
 * et se met a jour apres le montage client -- meme pattern que
 * FooterVersion.tsx, aucun mismatch d'hydratation.
 */
export function BetaTranslationBanner() {
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (readDismissed()) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDismissed(true);
    }
  }, []);

  if (dismissed) return null;

  function handleDismiss(): void {
    writeDismissed();
    setDismissed(true);
  }

  return (
    <div
      role="note"
      className="relative border-b border-[color:var(--border-default)] bg-[color:var(--bg-subtle)] px-4 py-2.5 text-sm sm:px-6"
    >
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-2 gap-y-1 pr-8 text-center text-[color:var(--fg-secondary)]">
        <Languages
          className="h-4 w-4 shrink-0 text-[color:var(--brand-primary)]"
          aria-hidden="true"
        />
        <span>
          Traducción automática en fase de mejora, sin revisión nativa
          todavía.{" "}
          <a
            href={ISSUES_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-[color:var(--brand-primary)] underline underline-offset-2 hover:text-[color:var(--brand-hover)]"
          >
            Informa de errores en GitHub
            <span className="sr-only"> (se abre en una pestaña nueva)</span>
          </a>
          .
        </span>
      </div>
      <button
        type="button"
        onClick={handleDismiss}
        aria-label="Cerrar este aviso"
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1.5 text-[color:var(--fg-muted)] transition-colors hover:bg-[color:var(--bg-elevated)] hover:text-[color:var(--fg-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--brand-primary)]"
      >
        <X className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}
