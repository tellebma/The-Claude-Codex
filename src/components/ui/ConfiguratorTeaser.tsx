"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Settings, Cpu, Wand2 } from "lucide-react";
import { getLocaleFromPathname, prefixWithLocale } from "@/lib/locale-utils";

export function ConfiguratorTeaser() {
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);
  return (
    <div className="glass-card relative overflow-hidden p-8 sm:p-10 lg:p-12">
      {/* Background decorative gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 via-transparent to-accent-500/5" />
      <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-brand-500/10 blur-3xl" />
      <div className="absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-accent-500/10 blur-3xl" />

      <div className="relative flex flex-col items-center text-center lg:flex-row lg:text-left">
        {/* Left: Icon cluster */}
        <div className="mb-8 flex shrink-0 items-center justify-center lg:mb-0 lg:mr-10">
          <div className="relative">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 shadow-lg shadow-brand-500/25">
              <Settings className="h-10 w-10 text-white" aria-hidden="true" />
            </div>
            <div className="absolute -right-3 -top-3 flex h-8 w-8 items-center justify-center rounded-lg bg-accent-500 shadow-md shadow-accent-500/25">
              <Wand2 className="h-4 w-4 text-white" aria-hidden="true" />
            </div>
            <div className="absolute -bottom-2 -left-3 flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500 shadow-md shadow-violet-500/25">
              <Cpu className="h-4 w-4 text-white" aria-hidden="true" />
            </div>
          </div>
        </div>

        {/* Center: Text */}
        <div className="flex-1">
          <h3 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Configurez votre{" "}
            <span className="text-gradient">environnement idéal</span>
          </h3>
          <p className="mt-3 max-w-2xl text-base text-slate-600 dark:text-slate-300 sm:text-lg">
            Répondez à quelques questions simples et obtenez une configuration
            Claude Code personnalisée : MCP recommandés, fichier CLAUDE.md
            généré, et conseils adaptés à votre profil.
          </p>

          {/* Mini feature pills */}
          <div className="mt-5 flex flex-wrap justify-center gap-2 lg:justify-start">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-500/10 px-3 py-1 text-xs font-medium text-brand-700 dark:text-brand-400">
              <Wand2 className="h-3 w-3" aria-hidden="true" />
              Configuration guidée
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-500/10 px-3 py-1 text-xs font-medium text-accent-700 dark:text-accent-400">
              <Cpu className="h-3 w-3" aria-hidden="true" />
              MCP recommandés
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-700 dark:text-violet-400">
              <Settings className="h-3 w-3" aria-hidden="true" />
              CLAUDE.md généré
            </span>
          </div>
        </div>

        {/* Right: CTA */}
        <div className="mt-8 shrink-0 lg:ml-10 lg:mt-0">
          <Link
            href={prefixWithLocale("/configurator", locale)}
            className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-brand-500/25 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-brand-500/30"
          >
            Lancer le configurateur
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
}
