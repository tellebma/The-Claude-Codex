import { setRequestLocale } from "next-intl/server";
import Link from "next/link";
import {
  ArrowRight,
  Settings2,
  Webhook,
  Terminal,
  Cloud,
  ChevronRight,
  Cpu,
  GitBranch,
  Shield,
} from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AnimateOnScroll, StaggerChildren } from "@/components/ui/AnimateOnScroll";
import { createPageMetadata, SITE_URL } from "@/lib/metadata";
import { createArticleSchema, serializeJsonLd } from "@/lib/structured-data";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return createPageMetadata({
    title: "Utilisation avancée de Claude Code",
    description:
      "Hooks, mode headless, intégration CI/CD, multi-provider et configuration enterprise. Maîtrisez les fonctionnalités avancées de Claude Code.",
    path: `/${locale}/advanced`,
    locale,
  });
}

function buildArticleJsonLd(locale: string) {
  return createArticleSchema({
    title: "Utilisation avancée de Claude Code",
    description:
      "Hooks, mode headless, CI/CD, multi-provider et configuration enterprise.",
    url: `${SITE_URL}/${locale}/advanced`,
    locale,
    datePublished: "2026-03-11",
    dateModified: "2026-03-11",
  });
}

/**
 * Sub-pages of the Advanced section, displayed as clickable cards.
 */
const SUB_PAGES = [
  {
    href: "/advanced/hooks",
    icon: Webhook,
    step: "01",
    title: "Système de Hooks",
    description:
      "Automatisez vos workflows avec PreToolUse, PostToolUse et Stop. Auto-format, notifications Slack, rapports de session et patterns avancés.",
    color: "brand" as const,
  },
  {
    href: "/advanced/headless-ci",
    icon: Terminal,
    step: "02",
    title: "Mode Headless et CI/CD",
    description:
      "Utilisez Claude Code en mode non-interactif. GitHub Actions, GitLab CI, pre-commit hooks et bonnes pratiques de sécurité en pipeline.",
    color: "brand" as const,
  },
  {
    href: "/advanced/multi-provider",
    icon: Cloud,
    step: "03",
    title: "Multi-provider et Enterprise",
    description:
      "AWS Bedrock, Google Vertex AI, proxy OpenAI-compatible. Changez de modèle selon la tâche et gérez vos credentials d’entreprise.",
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
    icon: Cpu,
    title: "Automatisation totale",
    description:
      "Les hooks transforment Claude Code en orchestrateur. Validez, formatez, notifiez, tout automatiquement à chaque action.",
  },
  {
    icon: GitBranch,
    title: "Intégration CI/CD",
    description:
      "Review de PR, génération de tests, audit de sécurité : intégrez Claude Code directement dans vos pipelines GitHub Actions ou GitLab.",
  },
  {
    icon: Cloud,
    title: "Flexibilité enterprise",
    description:
      "AWS Bedrock ou Google Vertex AI pour garder les données dans votre infrastructure. Multi-provider selon les contraintes métier.",
  },
  {
    icon: Shield,
    title: "Sécurité renforcée",
    description:
      "Hooks de validation avant exécution, pipelines sans secrets exposés, gestion fine des permissions par environnement.",
  },
];

export default async function AdvancedPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  /*
   * JSON-LD: safe -- static schema from our own constants,
   * serialized via JSON.stringify. No user input.
   */
  const jsonLdHtml = serializeJsonLd(buildArticleJsonLd(locale));

  return (
    <>
      {/* JSON-LD structured data -- safe: static schema via JSON.stringify */}
      <script
        type="application/ld+json"
        /* eslint-disable-next-line react/no-danger */
        dangerouslySetInnerHTML={{ __html: jsonLdHtml }}
      />

      {/* HERO */}
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
              <Settings2 className="h-4 w-4" aria-hidden="true" />
              Utilisation avanc&eacute;e
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl">
              Claude Code <span className="text-gradient">en production</span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300 sm:text-xl">
              Hooks, mode headless, int&eacute;gration CI/CD, multi-provider
              et configuration enterprise. Passez de l&apos;usage interactif
              &agrave; l&apos;automatisation totale.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href={`/${locale}/advanced/hooks`}
                className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-500/25 transition-all hover:shadow-xl hover:shadow-brand-500/30"
              >
                D&eacute;couvrir les hooks
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
              <Link
                href={`/${locale}/advanced/headless-ci`}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-600 px-8 py-3.5 text-sm font-semibold text-slate-200 transition-all hover:border-slate-500 hover:bg-white/5"
              >
                Int&eacute;gration CI/CD
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SUB-PAGES CARDS */}
      <section className="py-16 sm:py-20">
        <div className="px-4 sm:px-6 lg:px-0">
          <AnimateOnScroll preset="fade-up">
            <div className="mb-12 text-center">
              <span className="mb-3 inline-block rounded-full bg-brand-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand-700 dark:text-brand-400">
                3 guides
              </span>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Explorez les fonctionnalit&eacute;s avanc&eacute;es
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-300">
                Du syst&egrave;me de hooks &agrave; la configuration enterprise,
                chaque guide couvre un aspect essentiel de l&apos;utilisation
                avanc&eacute;e de Claude Code.
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

      {/* BENEFITS */}
      <section className="bg-slate-50/50 py-20 dark:bg-slate-900/50 sm:py-28">
        <div className="px-4 sm:px-6 lg:px-0">
          <AnimateOnScroll preset="fade-up">
            <SectionHeading
              badge="Pourquoi aller plus loin ?"
              title="De l&apos;interactif &agrave; l&apos;autonome"
              description="Les fonctionnalit&eacute;s avanc&eacute;es de Claude Code permettent d&apos;int&eacute;grer l&apos;IA directement dans vos processus de d&eacute;veloppement."
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
        </div>
      </section>

      {/* NEXT STEPS */}
      <section className="relative overflow-hidden py-20 sm:py-28">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-950 via-slate-900 to-brand-900" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(6,182,212,0.15),_transparent_70%)]" />

        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl">
            Combinez avec le reste de{" "}
            <span className="text-gradient">l&apos;&eacute;cosyst&egrave;me</span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300">
            Les fonctionnalit&eacute;s avanc&eacute;es compl&egrave;tent
            parfaitement les agents, les MCP et le prompting pour
            construire des workflows de d&eacute;veloppement complets.
          </p>

          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            <Link
              href={`/${locale}/agents`}
              className="glass-card group flex items-start gap-4 p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500/20 to-brand-500/5">
                <Cpu className="h-6 w-6 text-brand-400" aria-hidden="true" />
              </div>
              <div>
                <h3 className="mb-1 text-lg font-bold text-white">
                  Les Agents
                </h3>
                <p className="text-sm leading-relaxed text-slate-400">
                  Orchestrez des workflows complexes avec des agents
                  sp&eacute;cialis&eacute;s.
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand-400 transition-colors group-hover:text-brand-300">
                  D&eacute;couvrir
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </span>
              </div>
            </Link>

            <Link
              href={`/${locale}/reference/settings`}
              className="glass-card group flex items-start gap-4 p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-accent-500/20 to-accent-500/5">
                <Settings2 className="h-6 w-6 text-accent-500" aria-hidden="true" />
              </div>
              <div>
                <h3 className="mb-1 text-lg font-bold text-white">
                  settings.json
                </h3>
                <p className="text-sm leading-relaxed text-slate-400">
                  R&eacute;f&eacute;rence compl&egrave;te de toutes les options
                  de configuration.
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand-400 transition-colors group-hover:text-brand-300">
                  Consulter
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </span>
              </div>
            </Link>

            <Link
              href={`/${locale}/mcp`}
              className="glass-card group flex items-start gap-4 p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/20 to-violet-500/5">
                <Cloud className="h-6 w-6 text-violet-500" aria-hidden="true" />
              </div>
              <div>
                <h3 className="mb-1 text-lg font-bold text-white">
                  Les MCP
                </h3>
                <p className="text-sm leading-relaxed text-slate-400">
                  Connectez Claude Code &agrave; vos outils et services
                  externes.
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
