"use client";

import { Terminal, ExternalLink } from "lucide-react";
import { GitHubIcon } from "@/components/ui/icons/GitHubIcon";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { CopyrightYear } from "@/components/ui/CopyrightYear";
import { FooterVersion } from "@/components/layout/FooterVersion";

const guidesNavKeys = [
  { key: "gettingStarted", href: "/getting-started" },
  { key: "mcp", href: "/mcp" },
  { key: "skills", href: "/skills" },
  { key: "prompting", href: "/prompting" },
  { key: "agents", href: "/agents" },
  { key: "enterprise", href: "/enterprise" },
] as const;

const outilsNavKeys = [
  { key: "configurator", href: "/configurator" },
  { key: "glossary", href: "/glossary" },
  { key: "reference", href: "/reference" },
  { key: "useCases", href: "/use-cases" },
  { key: "content", href: "/content" },
  { key: "future", href: "/future" },
  { key: "about", href: "/about" },
] as const;

const resourcesLinks = [
  {
    key: "claudeCodeOfficial",
    href: "https://github.com/anthropics/claude-code",
    external: true,
  },
  {
    key: "anthropicDocs",
    href: "https://docs.anthropic.com",
    external: true,
  },
  {
    key: "mcpRegistry",
    href: "https://github.com/modelcontextprotocol/servers",
    external: true,
  },
] as const;

export function Footer() {
  const tNav = useTranslations("navigation");
  const tFooter = useTranslations("footer");
  const tCommon = useTranslations("common");

  return (
    <footer className="border-t border-slate-200/50 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 xl:max-w-[1400px] 2xl:max-w-[1800px]">
        <div className="grid grid-cols-2 gap-6 lg:grid-cols-5">
          <div className="col-span-2">
            <Link
              href="/"
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
              {tFooter("description")}
            </p>
          </div>

          <nav aria-label={tCommon("guides")}>
            <p className="text-sm font-semibold uppercase tracking-wider text-slate-900 dark:text-white">
              {tCommon("guides")}
            </p>
            <ul className="mt-3 space-y-2">
              {guidesNavKeys.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex min-h-[44px] items-center text-sm text-slate-600 transition-colors hover:text-brand-700 dark:text-slate-300 dark:hover:text-brand-400"
                  >
                    {tNav(link.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label={tCommon("tools")}>
            <p className="text-sm font-semibold uppercase tracking-wider text-slate-900 dark:text-white">
              {tCommon("tools")}
            </p>
            <ul className="mt-3 space-y-2">
              {outilsNavKeys.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex min-h-[44px] items-center text-sm text-slate-600 transition-colors hover:text-brand-700 dark:text-slate-300 dark:hover:text-brand-400"
                  >
                    {tNav(link.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label={tCommon("resources")}>
            <p className="text-sm font-semibold uppercase tracking-wider text-slate-900 dark:text-white">
              {tCommon("resources")}
            </p>
            <ul className="mt-3 space-y-2">
              {resourcesLinks.map((link) => (
                <li key={link.href}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-[44px] items-center gap-1 text-sm text-slate-600 transition-colors hover:text-brand-700 dark:text-slate-300 dark:hover:text-brand-400"
                    >
                      {tFooter(link.key)}
                      <ExternalLink
                        className="h-3 w-3"
                        aria-hidden="true"
                      />
                      <span className="sr-only"> {tCommon("opensNewTab")}</span>
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="inline-flex min-h-[44px] items-center text-sm text-slate-600 transition-colors hover:text-brand-700 dark:text-slate-300 dark:hover:text-brand-400"
                    >
                      {tFooter(link.key)}
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
              <CopyrightYear /> The Claude Codex. {tCommon("openSource")}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <FooterVersion />
            <a
              href="https://github.com/tellebma/The-Claude-Codex"
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-[44px] items-center gap-2 text-sm text-slate-500 transition-colors hover:text-brand-700 dark:text-slate-300 dark:hover:text-brand-400"
            >
              <GitHubIcon className="h-4 w-4" aria-hidden="true" />
              GitHub
              <span className="sr-only"> {tCommon("opensNewTab")}</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
