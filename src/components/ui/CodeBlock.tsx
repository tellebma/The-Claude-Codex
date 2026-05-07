"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Highlight, themes } from "prism-react-renderer";
import { Check, Clipboard } from "lucide-react";
import { useTranslations } from "next-intl";

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
}

// RG2-17 — Le CodeBlock reste toujours sombre, conformement a la decision
// design SYNTHESIS section 7.1 : "CodeBlock toujours sombre, pas d'inversion
// en light mode (choix design delibere)". L'ancienne implementation RG-14
// basculait nightOwl <-> nightOwlLight via useTheme — contraire a l'intention
// design. Theme fige sur nightOwl. Le conteneur utilise --code-bg qui est
// fixe au sombre dans :root ET .dark via globals.css.

export function CodeBlock({
  code,
  language = "bash",
  filename,
}: Readonly<CodeBlockProps>) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const t = useTranslations("common");
  const codeTheme = themes.nightOwl;

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleCopy = useCallback(async () => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
    }

    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      timeoutRef.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for browsers without Clipboard API support
      const textArea = document.createElement("textarea");
      textArea.value = code;
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.select();
      // execCommand is deprecated but retained as a best-effort fallback
      // for browsers without navigator.clipboard (http://, iframe sandbox).
      // NOSONAR typescript:S1874 — intentional browser-compat fallback
      const success = document.execCommand("copy");
      textArea.remove();
      if (success) {
        setCopied(true);
        timeoutRef.current = setTimeout(() => setCopied(false), 2000);
      }
    }
  }, [code]);

  return (
    <div
      className="group my-4 overflow-hidden rounded-xl border border-[color:var(--code-border)] bg-[color:var(--code-bg)]"
      suppressHydrationWarning
    >
      {filename && (
        <div className="flex items-center justify-between border-b border-[color:var(--code-border)] px-4 py-2">
          <span className="text-xs text-[color:var(--code-fg-secondary)]">
            {filename}
          </span>
          <span className="rounded bg-[color:var(--code-bg-deep)] px-2 py-0.5 text-xs text-[color:var(--code-fg-secondary)]">
            {language}
          </span>
        </div>
      )}
      <div className="relative">
        <button
          onClick={handleCopy}
          className={`absolute right-2 top-2 flex min-h-[44px] min-w-[44px] items-center justify-center gap-1.5 rounded-md border px-2 py-1.5 text-xs font-medium transition-all focus:outline-none focus:ring-2 focus:ring-brand-500 ${
            copied
              ? "border-emerald-500/50 bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 opacity-100"
              : "border-[color:var(--code-border)] bg-[color:var(--code-bg-deep)] text-[color:var(--code-fg-muted)] opacity-0 hover:border-[color:var(--border-strong)] hover:bg-[color:var(--bg-subtle)] hover:text-[color:var(--code-fg-secondary)] group-hover:opacity-100 focus:opacity-100"
          }`}
          aria-label={copied ? t("copiedCode") : t("copyCode")}
          type="button"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{t("copiedCode")}</span>
            </>
          ) : (
            <>
              <Clipboard className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{t("copyCode")}</span>
            </>
          )}
        </button>
        <Highlight theme={codeTheme} code={code} language={language}>
          {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <pre
              className={`${className} overflow-x-auto p-4 text-sm leading-relaxed`}
              style={{ ...style, backgroundColor: "transparent" }}
            >
              {tokens.map((line, i) => {
                const lineKey = `line-${i}-${line
                  .map((t) => t.content)
                  .join("")
                  .slice(0, 40)}`;
                return (
                  <div key={lineKey} {...getLineProps({ line })}>
                    {line.map((token, j) => (
                      <span
                        key={`${lineKey}-tok-${j}-${token.content.slice(0, 16)}`}
                        {...getTokenProps({ token })}
                      />
                    ))}
                  </div>
                );
              })}
            </pre>
          )}
        </Highlight>
      </div>
    </div>
  );
}
