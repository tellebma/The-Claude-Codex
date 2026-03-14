"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Terminal, Github, ExternalLink } from "lucide-react";
import { CopyrightYear } from "@/components/ui/CopyrightYear";
import {
  getLocaleFromPathname,
  prefixWithLocale,
} from "@/lib/locale-utils";

const footerLinks = {
  guides: [
    { name: "Démarrer", href: "/getting-started" },
    { name: "MCP", href: "/mcp" },
    { name: "Skills", href: "/skills" },
    { name: "Prompting", href: "/prompting" },
  ],
  resources: [
    { name: "Vision & Futur", href: "/future" },
    {
      name: "Claude Code (officiel)",
      href: "https://github.com/anthropics/claude-code",
      external: true,
    },
    {
      name: "Documentation Anthropic",
      href: "https://docs.anthropic.com",
      external: true,
    },
  ],
};

export function Footer() {
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);

  return (
    <footer className="border-t border-slate-200/50 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 xl:max-w-[1400px] 2xl:max-w-[1800px]">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-2">
            <Link
              href={prefixWithLocale("/", locale)}
              className="flex items-center gap-2 text-lg font-bold"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-accent-500">
                <Terminal
                  className="h-4 w-4 text-white"
                  aria-hidden="true"
                />
              </div>
              The Claude <span className="text-gradient">Codex</span>
            </Link>
            <p className="mt-3 max-w-md text-sm text-slate-500 dark:text-slate-300">
              Le guide de référence gratuit pour maîtriser Claude Code. Créé
              par la communauté, pour la communauté. Pas de paywall, pas de
              tracking , juste du savoir partagé.
            </p>
          </div>

          <nav aria-label="Guides">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-900 dark:text-white">
              Guides
            </h3>
            <ul className="mt-3 space-y-2">
              {footerLinks.guides.map((link) => (
                <li key={link.href}>
                  <Link
                    href={prefixWithLocale(link.href, locale)}
                    className="inline-flex min-h-[44px] items-center text-sm text-slate-600 transition-colors hover:text-brand-700 dark:text-slate-300 dark:hover:text-brand-400"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Ressources">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-900 dark:text-white">
              Ressources
            </h3>
            <ul className="mt-3 space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  {"external" in link ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-[44px] items-center gap-1 text-sm text-slate-600 transition-colors hover:text-brand-700 dark:text-slate-300 dark:hover:text-brand-400"
                    >
                      {link.name}
                      <ExternalLink
                        className="h-3 w-3"
                        aria-hidden="true"
                      />
                    </a>
                  ) : (
                    <Link
                      href={prefixWithLocale(link.href, locale)}
                      className="inline-flex min-h-[44px] items-center text-sm text-slate-600 transition-colors hover:text-brand-700 dark:text-slate-300 dark:hover:text-brand-400"
                    >
                      {link.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-slate-200/50 pt-8 dark:border-slate-800 sm:flex-row">
          <div className="flex flex-col gap-1 text-center sm:text-left">
            <p className="text-sm text-slate-500 dark:text-slate-300">
              <CopyrightYear /> The Claude Codex. Projet open-source.
            </p>
          </div>
          <a
            href="https://github.com/tellebma/The-Claude-Codex"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-slate-500 transition-colors hover:text-brand-700 dark:text-slate-300 dark:hover:text-brand-400"
          >
            <Github className="h-4 w-4" aria-hidden="true" />
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
