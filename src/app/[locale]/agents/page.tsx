import { setRequestLocale } from "next-intl/server";
import Link from "next/link";
import {
  ArrowRight,
  Bot,
  HelpCircle,
  Wrench,
  Users,
  Star,
  Network,
  Zap,
  Shield,
  Layers,
  ChevronRight,
  Sparkles,
  MessageSquare,
  Puzzle,
  Code2,
  Gauge,
} from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Callout } from "@/components/ui/Callout";
import { AnimateOnScroll, StaggerChildren } from "@/components/ui/AnimateOnScroll";
import { createPageMetadata, SITE_URL } from "@/lib/metadata";
import { createArticleSchema, serializeJsonLd } from "@/lib/structured-data";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return createPageMetadata({
    title: "Agents & Subagents : Orchestrez des workflows complexes avec Claude Code",
    description:
      "Découvrez les agents et subagents Claude Code. Créez des agents spécialisés, orchestrez des workflows multi-agents et automatisez vos processus de développement.",
    path: `/${locale}/agents`,
    locale,
  });
}

function buildArticleJsonLd(locale: string) {
  return createArticleSchema({
    title: "Agents & Subagents : Orchestrez des workflows complexes avec Claude Code",
    description:
      "Découvrez les agents et subagents Claude Code pour orchestrer des workflows complexes.",
    url: `${SITE_URL}/${locale}/agents`,
    locale,
    datePublished: "2026-03-10",
    dateModified: "2026-03-10",
  });
}

/**
 * Sub-pages of the Agents section, displayed as clickable cards.
 */
const SUB_PAGES = [
  {
    href: "/agents/what-are-agents",
    icon: HelpCircle,
    step: "01",
    title: "Comprendre les agents et subagents",
    description:
      "Qu’est-ce qu’un agent ? Différence avec un prompt classique, types d’agents, fonctionnement des subagents et isolation via worktrees.",
    color: "brand" as const,
  },
  {
    href: "/agents/create-subagent",
    icon: Wrench,
    step: "02",
    title: "Créer un subagent spécialisé",
    description:
      "Guide complet pour créer des agents custom. Structure, exemples concrets (review, tests, documentation) et bonnes pratiques de prompts.",
    color: "brand" as const,
  },
  {
    href: "/agents/agent-teams",
    icon: Users,
    step: "03",
    title: "Agent Teams : le guide complet",
    description:
      "Faites collaborer plusieurs agents sur un même projet. Configuration, cas d’usage (review croisée, développement parallèle) et limites.",
    color: "accent" as const,
  },
  {
    href: "/agents/best-agents",
    icon: Star,
    step: "04",
    title: "Top agents par cas d’usage",
    description:
      "Les meilleurs agents classés par catégorie : développement, architecture, sécurité, tests et maintenance. Fiches détaillées et exemples.",
    color: "accent" as const,
  },
  {
    href: "/agents/orchestration",
    icon: Network,
    step: "05",
    title: "Orchestration multi-agents avancée",
    description:
      "Patterns d’orchestration : séquentiel, parallèle, pipeline, split-role. Gestion du contexte, worktrees et bonnes pratiques.",
    color: "brand" as const,
  },
  {
    href: "/agents/agent-sdk",
    icon: Code2,
    step: "06",
    title: "Claude Agent SDK",
    description:
      "Construisez des agents programmatiques en TypeScript et Python. Outils custom, monitoring automatisé et intégration dans vos pipelines.",
    color: "accent" as const,
  },
  {
    href: "/agents/performance-limits",
    icon: Gauge,
    step: "07",
    title: "Performance et limites",
    description:
      "Coûts en tokens, profondeur de récursion, timeouts, stratégies de retry et bonnes pratiques pour la production.",
    color: "accent" as const,
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
  },
  accent: {
    iconBg: "bg-accent-500/10",
    iconText: "text-accent-600 dark:text-accent-400",
    hoverBorder: "hover:border-accent-500/30",
    linkText: "text-accent-600 dark:text-accent-400",
    linkHover: "group-hover:text-accent-500 dark:group-hover:text-accent-300",
    step: "text-accent-500/40",
  },
};

const benefits = [
  {
    icon: Zap,
    title: "Autonomie totale",
    description:
      "Les agents planifient, exécutent et vérifient sans intervention humaine à chaque étape. Confiez une tâche complexe et récupérez le résultat fini.",
  },
  {
    icon: Shield,
    title: "Qualité systématique",
    description:
      "Chaque agent suit un processus rigoureux et reproductible. Code review, tests, audit de sécurité, rien n’est oublié.",
  },
  {
    icon: Layers,
    title: "Spécialisation",
    description:
      "Chaque agent est expert dans son domaine. Combinez-les pour couvrir tous les aspects d’un workflow de développement.",
  },
  {
    icon: Network,
    title: "Parallélisation",
    description:
      "Lancez plusieurs agents en parallèle pour accélérer les workflows. Review, tests et sécurité en même temps.",
  },
];

export default async function AgentsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  /*
   * JSON-LD: safe — static schema from our own constants,
   * serialized via JSON.stringify. No user input.
   */
  const jsonLdHtml = serializeJsonLd(buildArticleJsonLd(locale));

  return (
    <>
      {/* JSON-LD structured data — safe: static schema via JSON.stringify */}
      <script
        type="application/ld+json"
        /* eslint-disable-next-line react/no-danger */
        dangerouslySetInnerHTML={{ __html: jsonLdHtml }}
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
              <Bot className="h-4 w-4" aria-hidden="true" />
              Agents &amp; Subagents
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl">
              Les <span className="text-gradient">Agents</span> : D&eacute;l&eacute;guez
              <br />
              vos workflows complexes
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300 sm:text-xl">
              Cr&eacute;ez des agents sp&eacute;cialis&eacute;s, orchestrez des
              pipelines multi-agents et automatisez vos processus de
              d&eacute;veloppement. Claude Code devient une &eacute;quipe
              compl&egrave;te &agrave; votre service.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href={`/${locale}/agents/what-are-agents`}
                className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-500/25 transition-all hover:shadow-xl hover:shadow-brand-500/30"
              >
                Comprendre les agents
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
              <Link
                href={`/${locale}/agents/best-agents`}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-600 px-8 py-3.5 text-sm font-semibold text-slate-200 transition-all hover:border-slate-500 hover:bg-white/5"
              >
                Voir les agents recommand&eacute;s
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SUB-PAGES CARDS ===== */}
      <section className="py-16 sm:py-20">
        <div className="px-4 sm:px-6 lg:px-0">
          <AnimateOnScroll preset="fade-up">
            <div className="mb-12 text-center">
              <span className="mb-3 inline-block rounded-full bg-brand-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand-700 dark:text-brand-400">
                7 guides
              </span>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Explorez les agents en profondeur
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-300">
                Des fondamentaux &agrave; l&apos;orchestration avanc&eacute;e, chaque guide
                couvre un aspect essentiel des agents Claude Code.
                Suivez-les dans l&apos;ordre ou piochez directement celui qui
                vous int&eacute;resse.
              </p>
            </div>
          </AnimateOnScroll>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SUB_PAGES.map((page) => {
              const Icon = page.icon;
              const styles = colorStyles[page.color];

              return (
                <AnimateOnScroll key={page.href} preset="fade-up">
                  <Link
                    href={`/${locale}${page.href}`}
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
                      <span
                        className={`text-3xl font-black ${styles.step}`}
                      >
                        {page.step}
                      </span>
                    </div>

                    <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">
                      {page.title}
                    </h3>
                    <p className="mb-4 flex-1 text-sm leading-relaxed text-slate-500 dark:text-slate-300">
                      {page.description}
                    </p>

                    <div
                      className={`flex items-center gap-1 text-sm font-medium ${styles.linkText} transition-colors ${styles.linkHover}`}
                    >
                      Lire le guide
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                    </div>
                  </Link>
                </AnimateOnScroll>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== POURQUOI UTILISER DES AGENTS ? ===== */}
      <section className="bg-slate-50/50 py-20 dark:bg-slate-900/50 sm:py-28">
        <div className="px-4 sm:px-6 lg:px-0">
          <AnimateOnScroll preset="fade-up">
            <SectionHeading
              badge="Avantages"
              title="Pourquoi utiliser des agents ?"
              description="Les agents transforment Claude Code d'un assistant passif en une équipe de spécialistes autonomes."
            />
          </AnimateOnScroll>

          <StaggerChildren className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4" staggerDelay={0.08}>
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={benefit.title}
                  className="glass-card flex flex-col items-center p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500/20 to-brand-500/5">
                    <Icon className="h-7 w-7 text-brand-700 dark:text-brand-400" aria-hidden="true" />
                  </div>
                  <h3 className="mb-2 text-lg font-bold">{benefit.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-300">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </StaggerChildren>

          <Callout type="tip" title="Agent vs Skill vs MCP">
            Les <strong>agents</strong> sont des processus autonomes qui
            ex&eacute;cutent des t&acirc;ches complexes. Les{" "}
            <a href={`/${locale}/skills`} className="underline">Skills</a> sont des
            recettes qui enseignent un comportement. Les{" "}
            <a href={`/${locale}/mcp`} className="underline">MCP</a> connectent Claude
            Code &agrave; des services externes. Les trois se compl&egrave;tent
            parfaitement : un agent peut utiliser des Skills et des MCP pour
            accomplir sa mission.
          </Callout>
        </div>
      </section>

      {/* ===== NEXT STEPS ===== */}
      <section className="relative overflow-hidden py-20 sm:py-28">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-950 via-slate-900 to-brand-900" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(6,182,212,0.15),_transparent_70%)]" />

        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl">
            Continuez votre{" "}
            <span className="text-gradient">apprentissage</span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300">
            Les agents ne sont qu&apos;une partie de l&apos;&eacute;cosyst&egrave;me
            Claude Code. D&eacute;couvrez les Skills pour enseigner des
            comportements, les MCP pour connecter vos outils, et le prompting
            pour communiquer efficacement.
          </p>

          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            <Link
              href={`/${locale}/skills`}
              className="glass-card group flex items-start gap-4 p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-accent-500/20 to-accent-500/5">
                <Sparkles className="h-6 w-6 text-accent-500" aria-hidden="true" />
              </div>
              <div>
                <h3 className="mb-1 text-lg font-bold text-white">
                  Les Skills
                </h3>
                <p className="text-sm leading-relaxed text-slate-400">
                  Enseignez des workflows et comportements r&eacute;utilisables
                  &agrave; Claude Code.
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand-400 transition-colors group-hover:text-brand-300">
                  D&eacute;couvrir
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </span>
              </div>
            </Link>

            <Link
              href={`/${locale}/mcp`}
              className="glass-card group flex items-start gap-4 p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/20 to-violet-500/5">
                <Puzzle className="h-6 w-6 text-violet-500" aria-hidden="true" />
              </div>
              <div>
                <h3 className="mb-1 text-lg font-bold text-white">
                  Les MCP
                </h3>
                <p className="text-sm leading-relaxed text-slate-400">
                  Connectez Claude Code &agrave; GitHub, Slack, Gmail et vos
                  outils favoris.
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand-400 transition-colors group-hover:text-brand-300">
                  D&eacute;couvrir
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </span>
              </div>
            </Link>

            <Link
              href={`/${locale}/prompting`}
              className="glass-card group flex items-start gap-4 p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/5">
                <MessageSquare className="h-6 w-6 text-emerald-500" aria-hidden="true" />
              </div>
              <div>
                <h3 className="mb-1 text-lg font-bold text-white">
                  Le Prompting
                </h3>
                <p className="text-sm leading-relaxed text-slate-400">
                  Ma&icirc;trisez l&apos;art de communiquer avec Claude Code
                  pour des r&eacute;sultats optimaux.
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand-400 transition-colors group-hover:text-brand-300">
                  D&eacute;couvrir
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
