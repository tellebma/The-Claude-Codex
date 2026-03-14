import { setRequestLocale } from "next-intl/server";
import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  Users,
  Zap,
  Lightbulb,
  Sparkles,
  Mail,
  BarChart3,
  FileText,
} from "lucide-react";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";
import { createPageMetadata, SITE_URL } from "@/lib/metadata";
import {
  createArticleSchema,
  serializeJsonLd,
} from "@/lib/structured-data";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return createPageMetadata({
    title: "Claude Code pour tous : cas d'usage concrets",
    description:
      "Des exemples pratiques de Claude Code pour non-developpeurs. Cas d'usage business, histoires de reussite et tutoriels sans code.",
    path: `/${locale}/use-cases`,
    locale,
  });
}

function buildArticleJsonLd(locale: string) {
  return createArticleSchema({
    title: "Claude Code pour tous : cas d'usage concrets",
    description:
      "Des exemples pratiques de Claude Code pour non-developpeurs. Cas d'usage business, histoires de reussite et tutoriels sans code.",
    url: `${SITE_URL}/${locale}/use-cases`,
    locale,
    datePublished: "2026-03-12",
    dateModified: "2026-03-12",
  });
}

const SUB_PAGES = [
  {
    href: "/use-cases/business",
    icon: Briefcase,
    step: "01",
    title: "8 cas d’usage business",
    description:
      "Email professionnel, resumé de document, analyse de données, présentation, planning, post LinkedIn : des prompts exacts à copier.",
    color: "brand" as const,
  },
  {
    href: "/use-cases/success-stories",
    icon: Users,
    step: "02",
    title: "Histoires de réussite",
    description:
      "4 professionnels non-développeurs racontent comment Claude Code a transformé leur quotidien. Marketing, RH, finance et gestion de projet.",
    color: "accent" as const,
  },
  {
    href: "/use-cases/no-code",
    icon: Zap,
    step: "03",
    title: "Tutoriels sans code",
    description:
      "Automatiser un rapport, créer un système de templates email, générer une présentation : pas à pas, zéro code.",
    color: "brand" as const,
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

export default async function UseCasesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const jsonLdHtml = serializeJsonLd(buildArticleJsonLd(locale));
  return (
    <>
      {/*
       * JSON-LD structured data: safe static schema built at build time
       * from hardcoded values. No user input. Same pattern used site-wide.
       */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdHtml }}
      />

      {/* ===== HERO / INTRO ===== */}
      <section className="relative overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-[var(--gradient-hero)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(6,182,212,0.15),_transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(245,158,11,0.1),_transparent_60%)]" />

        <div className="relative px-4 pb-16 pt-20 sm:px-6 sm:pb-20 sm:pt-28 lg:px-8">
          <div className="text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-brand-500/10 px-4 py-1.5 text-sm text-brand-300">
              <Lightbulb className="h-4 w-4" aria-hidden="true" />
              Pour tous les profils
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              <span className="text-gradient">Claude Code</span> pour tous
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300 sm:text-xl">
              Vous n&apos;&ecirc;tes pas d&eacute;veloppeur ? Pas de probl&egrave;me.
              Voici des exemples concrets de ce que Claude Code peut faire pour vous au quotidien :
              emails, rapports, analyses, pr&eacute;sentations et plus encore.
            </p>
          </div>
        </div>
      </section>

      {/* ===== QUICK EXAMPLES ===== */}
      <section className="py-16 sm:py-20">
        <div className="px-4 sm:px-6 lg:px-0">
          <AnimateOnScroll preset="fade-up">
            <div className="mb-12 text-center">
              <span className="mb-3 inline-block rounded-full bg-brand-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand-700 dark:text-brand-400">
                En un coup d&apos;oeil
              </span>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Ce que Claude Code fait pour les non-dev
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-300">
                Trois familles de t&acirc;ches o&ugrave; Claude Code fait gagner
                des heures chaque semaine, sans &eacute;crire une ligne de code.
              </p>
            </div>
          </AnimateOnScroll>

          <div className="grid gap-6 sm:grid-cols-3">
            <AnimateOnScroll preset="fade-up">
              <div className="glass-card p-6 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500/20 to-brand-500/5">
                  <Mail className="h-6 w-6 text-brand-700 dark:text-brand-400" aria-hidden="true" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">R&eacute;daction</h3>
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  Emails, newsletters, posts LinkedIn, comptes-rendus, fiches de poste :
                  gagnez 70% du temps de r&eacute;daction.
                </p>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll preset="fade-up">
              <div className="glass-card p-6 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-accent-500/20 to-accent-500/5">
                  <BarChart3 className="h-6 w-6 text-accent-600 dark:text-accent-400" aria-hidden="true" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">Analyse</h3>
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  R&eacute;sum&eacute;s de documents, analyse de donn&eacute;es CSV,
                  veille concurrentielle, tableaux comparatifs.
                </p>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll preset="fade-up">
              <div className="glass-card p-6 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/5">
                  <FileText className="h-6 w-6 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">Organisation</h3>
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  Plannings, pr&eacute;sentations, templates r&eacute;utilisables,
                  rapports automatis&eacute;s.
                </p>
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* ===== SUB-PAGES CARDS ===== */}
      <section className="bg-slate-50/50 py-16 dark:bg-slate-900/50 sm:py-20">
        <div className="px-4 sm:px-6 lg:px-0">
          <AnimateOnScroll preset="fade-up">
            <div className="mb-12 text-center">
              <span className="mb-3 inline-block rounded-full bg-brand-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand-700 dark:text-brand-400">
                3 guides
              </span>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Explorez les cas d&apos;usage
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-300">
                Des prompts pr&ecirc;ts &agrave; copier, des t&eacute;moignages r&eacute;alistes
                et des tutoriels pas &agrave; pas.
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

      {/* ===== CTA / NEXT STEPS ===== */}
      <section className="relative overflow-hidden py-16 sm:py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-950 via-slate-900 to-brand-900" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(6,182,212,0.12),_transparent_70%)]" />

        <div className="relative px-4 sm:px-6 lg:px-0">
          <div className="text-center">
            <span className="mb-3 inline-block rounded-full bg-brand-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand-400">
              Et ensuite ?
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Pr&ecirc;t &agrave; essayer ?{" "}
              <span className="text-gradient">Lancez-vous.</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-300">
              Commencez par installer Claude Code, puis revenez ici copier
              votre premier prompt. Les r&eacute;sultats parlent d&apos;eux-m&ecirc;mes.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            <Link
              href={`/${locale}/getting-started`}
              className="group rounded-xl border border-slate-700/50 bg-slate-800/50 p-6 backdrop-blur transition-all hover:border-brand-500/50 hover:bg-slate-800/80"
            >
              <Sparkles className="mb-3 h-8 w-8 text-brand-400" aria-hidden="true" />
              <h3 className="mb-2 font-semibold text-white">
                Installer Claude Code
              </h3>
              <p className="text-sm leading-relaxed text-slate-400">
                Le guide pas &agrave; pas pour installer et configurer Claude Code
                en quelques minutes.
              </p>
              <div className="mt-4 flex items-center gap-1 text-sm font-medium text-brand-400 transition-colors group-hover:text-brand-300">
                Premiers pas
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </div>
            </Link>

            <Link
              href={`/${locale}/prompting/non-dev-prompting`}
              className="group rounded-xl border border-slate-700/50 bg-slate-800/50 p-6 backdrop-blur transition-all hover:border-accent-500/50 hover:bg-slate-800/80"
            >
              <Lightbulb className="mb-3 h-8 w-8 text-accent-400" aria-hidden="true" />
              <h3 className="mb-2 font-semibold text-white">
                Prompting non-dev
              </h3>
              <p className="text-sm leading-relaxed text-slate-400">
                20+ templates de prompts pour la communication,
                l&apos;analyse et la cr&eacute;ation de contenu.
              </p>
              <div className="mt-4 flex items-center gap-1 text-sm font-medium text-accent-400 transition-colors group-hover:text-accent-300">
                Voir les templates
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </div>
            </Link>

            <Link
              href={`/${locale}/personas/non-dev`}
              className="group rounded-xl border border-slate-700/50 bg-slate-800/50 p-6 backdrop-blur transition-all hover:border-emerald-500/50 hover:bg-slate-800/80"
            >
              <Users className="mb-3 h-8 w-8 text-emerald-400" aria-hidden="true" />
              <h3 className="mb-2 font-semibold text-white">
                Parcours non-dev
              </h3>
              <p className="text-sm leading-relaxed text-slate-400">
                Un itin&eacute;raire complet pour les non-d&eacute;veloppeurs,
                du premier pas aux usages avanc&eacute;s.
              </p>
              <div className="mt-4 flex items-center gap-1 text-sm font-medium text-emerald-400 transition-colors group-hover:text-emerald-300">
                Suivre le parcours
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </div>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
