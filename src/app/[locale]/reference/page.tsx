import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import {
  ArrowRight,
  BookOpen,
  Terminal,
  Settings,
  Variable,
  Keyboard,
} from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";
import { createPageMetadata, SITE_URL } from "@/lib/metadata";
import { createArticleSchema, serializeJsonLd } from "@/lib/structured-data";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return createPageMetadata({
    title: "Référence technique : Claude Code",
    description:
      "Documentation de référence complète pour Claude Code : commandes CLI, slash commands, raccourcis clavier, settings.json et variables d’environnement.",
    path: `/${locale}/reference`,
    locale,
  });
}

function buildArticleJsonLd(locale: string) {
  return createArticleSchema({
    title: "Référence technique : Claude Code",
    description:
      "Documentation de référence complète pour Claude Code : commandes CLI, slash commands, raccourcis clavier, settings.json et variables d’environnement.",
    url: `${SITE_URL}/${locale}/reference`,
    locale,
    datePublished: "2026-03-11",
    dateModified: "2026-03-11",
  });
}

const SUB_PAGES = [
  {
    href: "/reference/cheatsheet",
    icon: Keyboard,
    step: "01",
    title: "Cheatsheet : Référence rapide",
    description:
      "Toutes les slash commands, raccourcis clavier, fichiers de configuration et modes d’exécution en un seul endroit. Format dense, copiable.",
    color: "brand" as const,
    tags: ["/help", "/compact", "Ctrl+C", "Alt+T"],
  },
  {
    href: "/reference/cli",
    icon: Terminal,
    step: "02",
    title: "CLI : Tous les flags",
    description:
      "Référence exhaustive de la commande claude : --print, --model, --max-turns, --output-format, mode pipe et sous-commandes mcp/config/doctor.",
    color: "brand" as const,
    tags: ["--print", "--model", "claude mcp add", "stream-json"],
  },
  {
    href: "/reference/settings",
    icon: Settings,
    step: "03",
    title: "settings.json : Configuration",
    description:
      "3 niveaux de configuration, permissions par outil, structure mcpServers, modèles, variables d’environnement injectées et exemples complets.",
    color: "accent" as const,
    tags: ["permissions", "mcpServers", "allowedTools", "env"],
  },
  {
    href: "/reference/environment",
    icon: Variable,
    step: "04",
    title: "Variables d’environnement",
    description:
      "Toutes les variables reconnues par Claude Code : clé API, modèle, proxy, tokens de thinking, répertoire de config et désactivation des mises à jour.",
    color: "accent" as const,
    tags: [
      "ANTHROPIC_API_KEY",
      "CLAUDE_MODEL",
      "HTTPS_PROXY",
      "MAX_THINKING_TOKENS",
    ],
  },
] as const;

const colorStyles = {
  brand: {
    iconBg: "bg-brand-500/10",
    iconText: "text-brand-700 dark:text-brand-400",
    hoverBorder: "hover:border-brand-500/30",
    linkText: "text-brand-700 dark:text-brand-400",
    linkHover: "group-hover:text-brand-600 dark:group-hover:text-brand-300",
    step: "text-brand-500/40",
    tagBg: "bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300",
  },
  accent: {
    iconBg: "bg-accent-500/10",
    iconText: "text-accent-600 dark:text-accent-400",
    hoverBorder: "hover:border-accent-500/30",
    linkText: "text-accent-600 dark:text-accent-400",
    linkHover: "group-hover:text-accent-500 dark:group-hover:text-accent-300",
    step: "text-accent-500/40",
    tagBg:
      "bg-accent-50 text-accent-700 dark:bg-accent-900/30 dark:text-accent-300",
  },
};

export default async function ReferencePage({
  params,
}: Readonly<{
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      {/* JSON-LD structured data — safe: static schema via JSON.stringify */}
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(buildArticleJsonLd(locale)) }}
      />

      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-[var(--gradient-hero)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(6,182,212,0.15),_transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(245,158,11,0.1),_transparent_60%)]" />

        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-20 sm:px-6 sm:pb-28 sm:pt-28 lg:px-8 lg:pb-32 lg:pt-32">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-brand-500/10 px-4 py-1.5 text-sm text-brand-300">
              <BookOpen className="h-4 w-4" aria-hidden="true" />
              Documentation de r&eacute;f&eacute;rence
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl">
              R&eacute;f&eacute;rence{" "}
              <span className="text-gradient">technique</span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300 sm:text-xl">
              Toutes les commandes, options, configurations et variables
              d&apos;environnement de Claude Code. Format dense et scannable,
              con&ccedil;u pour la consultation rapide.
            </p>
          </div>
        </div>
      </section>

      {/* ===== SUB-PAGES CARDS ===== */}
      <section className="py-16 sm:py-20">
        <div className="px-4 sm:px-6 lg:px-0">
          <AnimateOnScroll preset="fade-up">
            <div className="mb-12 text-center">
              <span className="mb-3 inline-block rounded-full bg-brand-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand-700 dark:text-brand-400">
                4 pages de r&eacute;f&eacute;rence
              </span>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Trouvez ce dont vous avez besoin
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-300">
                Chaque page couvre un aspect sp&eacute;cifique de la
                configuration et de l&apos;utilisation de Claude Code. Utilisez
                la recherche ou naviguez directement.
              </p>
            </div>
          </AnimateOnScroll>

          <div className="grid gap-6 sm:grid-cols-2">
            {SUB_PAGES.map((page) => {
              const Icon = page.icon;
              const styles = colorStyles[page.color];

              return (
                <AnimateOnScroll key={page.href} preset="fade-up">
                  <Link
                    href={page.href}
                    className={`group relative flex flex-col rounded-xl border border-slate-200/50 bg-white/50 p-6 transition-all hover:bg-white hover:shadow-lg dark:border-slate-700/50 dark:bg-slate-800/50 dark:hover:bg-slate-800/80 ${styles.hoverBorder}`}
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-xl ${styles.iconBg}`}
                      >
                        <Icon
                          className={`h-6 w-6 ${styles.iconText}`}
                          aria-hidden="true"
                        />
                      </div>
                      <span className={`text-3xl font-black ${styles.step}`}>
                        {page.step}
                      </span>
                    </div>

                    <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">
                      {page.title}
                    </h3>
                    <p className="mb-4 flex-1 text-sm leading-relaxed text-slate-500 dark:text-slate-300">
                      {page.description}
                    </p>

                    <div className="mb-4 flex flex-wrap gap-1.5">
                      {page.tags.map((tag) => (
                        <span
                          key={tag}
                          className={`rounded-md px-2 py-0.5 font-mono text-xs ${styles.tagBg}`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div
                      className={`flex items-center gap-1 text-sm font-medium ${styles.linkText} transition-colors ${styles.linkHover}`}
                    >
                      Consulter la r&eacute;f&eacute;rence
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                    </div>
                  </Link>
                </AnimateOnScroll>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== ACCES RAPIDE ===== */}
      <section className="bg-slate-50/50 py-16 dark:bg-slate-900/50 sm:py-20">
        <div className="px-4 sm:px-6 lg:px-0">
          <SectionHeading
            badge="Accès rapide"
            title="Questions fréquentes"
            description="Les informations les plus recherchées."
          />

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                q: "Changer de modèle",
                a: "claude --model claude-opus-4-5",
                href: "/reference/cli",
              },
              {
                q: "Exécuter sans interaction",
                a: "claude --print \"prompt\"",
                href: "/reference/cli",
              },
              {
                q: "Ajouter un MCP",
                a: "claude mcp add nom -- cmd",
                href: "/reference/cli",
              },
              {
                q: "Compacter le contexte",
                a: "/compact",
                href: "/reference/cheatsheet",
              },
              {
                q: "Activer Extended Thinking",
                a: "Alt+T ou alwaysThinkingEnabled",
                href: "/reference/settings",
              },
              {
                q: "Définir la clé API",
                a: "export ANTHROPIC_API_KEY=sk-ant-...",
                href: "/reference/environment",
              },
              {
                q: "Configurer un proxy",
                a: "export HTTPS_PROXY=http://...",
                href: "/reference/environment",
              },
              {
                q: "Restreindre les outils",
                a: "allowedTools dans settings.json",
                href: "/reference/settings",
              },
              {
                q: "Diagnostiquer une erreur",
                a: "claude doctor",
                href: "/reference/cli",
              },
            ].map((item) => (
              <Link
                key={item.q}
                href={item.href}
                className="group rounded-xl border border-slate-200/50 bg-white/70 p-4 transition-all hover:border-brand-500/30 hover:bg-white hover:shadow-sm dark:border-slate-700/50 dark:bg-slate-800/50 dark:hover:border-brand-500/30 dark:hover:bg-slate-800/80"
              >
                <p className="mb-1.5 text-sm font-medium text-slate-700 dark:text-slate-200">
                  {item.q}
                </p>
                <code className="text-xs text-brand-600 dark:text-brand-400">
                  {item.a}
                </code>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
