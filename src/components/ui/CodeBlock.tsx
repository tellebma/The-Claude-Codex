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

export function CodeBlock({ code, language = "bash", filename }: Readonly<CodeBlockProps>) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const t = useTranslations("common");

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
      const success = document.execCommand("copy");
      document.body.removeChild(textArea);
      if (success) {
        setCopied(true);
        timeoutRef.current = setTimeout(() => setCopied(false), 2000);
      }
    }
  }, [code]);

  return (
    <div className="group my-4 overflow-hidden rounded-xl border border-slate-200/50 bg-slate-950 dark:border-slate-700/50">
      {filename && (
        <div className="flex items-center justify-between border-b border-slate-800 px-4 py-2">
          <span className="text-xs text-slate-400">{filename}</span>
          <span className="rounded bg-slate-800 px-2 py-0.5 text-xs text-slate-500">
            {language}
          </span>
        </div>
      )}
      <div className="relative">
        <button
          onClick={handleCopy}
          className={`absolute right-2 top-2 flex min-h-[44px] min-w-[44px] items-center justify-center gap-1.5 rounded-md border px-2 py-1.5 text-xs font-medium transition-all focus:outline-none focus:ring-2 focus:ring-brand-500 ${
            copied
              ? "border-emerald-500/50 bg-emerald-500/20 text-emerald-400 opacity-100"
              : "border-slate-700 bg-slate-800 text-slate-400 opacity-0 hover:border-slate-600 hover:bg-slate-700 hover:text-slate-300 group-hover:opacity-100 focus:opacity-100"
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
        <Highlight theme={themes.nightOwl} code={code} language={language}>
          {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <pre
              className={`${className} overflow-x-auto p-4 text-sm leading-relaxed`}
              style={{ ...style, backgroundColor: "transparent" }}
            >
              {tokens.map((line, i) => {
                const lineKey = `line-${i}-${line.map((t) => t.content).join("").slice(0, 40)}`;
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
