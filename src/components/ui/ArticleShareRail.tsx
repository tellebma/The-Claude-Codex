"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Link2, Check } from "lucide-react";

/** Inline X (Twitter) brand icon — lucide-react n'expose pas les marques. */
function XIcon({ className }: Readonly<{ className?: string }>) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

/** Inline LinkedIn brand icon — lucide-react n'expose pas les marques. */
function LinkedInIcon({ className }: Readonly<{ className?: string }>) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.063 2.063 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

interface ArticleShareRailProps {
  readonly url: string;
  readonly title: string;
  readonly label?: string;
  readonly copyAriaLabel?: string;
  readonly copiedLabel?: string;
}

/**
 * RG2-01 — Share rail (rail vertical de partage) pour articles editoriaux.
 *
 * Sticky a gauche, propose 3 actions : Twitter / LinkedIn (ouvre l'intent
 * de partage natif) + Copy link (writeText fallback execCommand).
 *
 * Visuel : bg surface card, border default, radius 14, padding 14/10,
 * label vertical-rl rotate(180) uppercase muted. Boutons 36x36 transparent
 * hover bg-subtle text-brand-700.
 *
 * Source : `design-source/.../article.css` `.art-share-rail`.
 */
export function ArticleShareRail({
  url,
  title,
  label = "Partager",
  copyAriaLabel = "Copier le lien",
  copiedLabel = "Lien copie",
}: Readonly<ArticleShareRailProps>) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cleanup au demontage : annule le timeout en cours pour eviter une fuite
  // setState sur composant demonte (l'utilisateur peut naviguer pendant
  // les 2s d'affichage du "Copie").
  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const flashCopied = useCallback(() => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
    }
    setCopied(true);
    timeoutRef.current = setTimeout(() => setCopied(false), 2000);
  }, []);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url);
      flashCopied();
    } catch {
      // Fallback : execCommand pour environnements sans Clipboard API.
      const ta = document.createElement("textarea");
      ta.value = url;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      // NOSONAR typescript:S1874 — fallback navigateurs anciens / iframe
      const ok = document.execCommand("copy");
      ta.remove();
      if (ok) {
        flashCopied();
      }
    }
  }, [url, flashCopied]);

  const twitterHref = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
  const linkedinHref = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;

  return (
    <aside
      className="ml-auto flex w-fit flex-col items-center gap-2 rounded-2xl border border-[color:var(--border-default)] bg-[color:var(--bg-elevated)] px-2.5 py-3.5"
      aria-label={label}
    >
      <span
        className="mb-1 inline-block text-[10px] font-bold uppercase tracking-[0.1em] text-[color:var(--fg-muted)]"
        style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
      >
        {label}
      </span>
      <a
        href={twitterHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Partager sur X / Twitter"
        className="flex h-9 w-9 items-center justify-center rounded-lg text-[color:var(--fg-secondary)] transition-colors hover:bg-[color:var(--bg-subtle)] hover:text-[color:var(--brand-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
      >
        <XIcon className="h-4 w-4" />
      </a>
      <a
        href={linkedinHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Partager sur LinkedIn"
        className="flex h-9 w-9 items-center justify-center rounded-lg text-[color:var(--fg-secondary)] transition-colors hover:bg-[color:var(--bg-subtle)] hover:text-[color:var(--brand-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
      >
        <LinkedInIcon className="h-4 w-4" />
      </a>
      <button
        type="button"
        onClick={handleCopy}
        aria-label={copied ? copiedLabel : copyAriaLabel}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-[color:var(--fg-secondary)] transition-colors hover:bg-[color:var(--bg-subtle)] hover:text-[color:var(--brand-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
      >
        {copied ? (
          <Check aria-hidden="true" className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />
        ) : (
          <Link2 aria-hidden="true" className="h-4 w-4" />
        )}
      </button>
    </aside>
  );
}
