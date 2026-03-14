import { setRequestLocale } from "next-intl/server";
import Link from "next/link";
import {
  ArrowRight,
  AlertTriangle,
  Scale,
  GitCompare,
  ShieldX,
  Ban,
  Eye,
  Target,
} from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FeatureCard } from "@/components/ui/FeatureCard";
import { AnimateOnScroll, StaggerChildren } from "@/components/ui/AnimateOnScroll";
import { createPageMetadata, SITE_URL } from "@/lib/metadata";
import { createArticleSchema, serializeJsonLd } from "@/lib/structured-data";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return createPageMetadata({
    title: "Limites de Claude Code",
    description:
      "Un tour d'horizon honnete des limites de Claude Code, des comparaisons equilibrees avec Copilot et Cursor, et un guide pour savoir quand ne PAS utiliser cet outil.",
    path: `/${locale}/limits`,
    locale,
  });
}

function buildArticleJsonLd(locale: string) {
  return createArticleSchema({
    title: "Limites de Claude Code",
    description:
      "Un tour d'horizon honnete des limites de Claude Code, des comparaisons equilibrees avec Copilot et Cursor, et un guide pour savoir quand ne PAS utiliser cet outil.",
    url: `${SITE_URL}/${locale}/limits`,
    locale,
    datePublished: "2026-03-12",
    dateModified: "2026-03-12",
  });
}

const SUB_PAGES = [
  {
    href: "/limits/known-limitations",
    icon: AlertTriangle,
    step: "01",
    title: "Limites connues",
    description:
      "Fenêtre de contexte, hallucinations, latence, coûts et support des langages. Les contraintes réelles avec des stratégies pour chacune.",
    color: "brand" as const,
  },
  {
    href: "/limits/vs-copilot",
    icon: GitCompare,
    step: "02",
    title: "Claude Code vs GitHub Copilot",
    description:
      "Agent CLI vs autocomplétion IDE. Deux philosophies différentes, chacune avec ses forces. Comparaison équilibrée.",
    color: "brand" as const,
  },
  {
    href: "/limits/vs-cursor",
    icon: Scale,
    step: "03",
    title: "Claude Code vs Cursor",
    description:
      "Deux approches agent, deux interfaces. Terminal vs IDE intégré, MCP vs multi-modèle, personnalisation vs expérience visuelle.",
    color: "accent" as const,
  },
  {
    href: "/limits/when-not-to-use",
    icon: Ban,
    step: "04",
    title: "Quand ne PAS utiliser Claude Code",
    description:
      "Systèmes temps réel, industries réglementées, code critique sans revue. Les situations où un autre outil serait plus adapté.",
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

/* jsonLdHtml moved into component to access locale */

export default async function LimitsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const jsonLdHtml = serializeJsonLd(buildArticleJsonLd(locale));
  return (
    <>
      {/* JSON-LD structured data — safe: static schema, no user input */}
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: jsonLdHtml }}
      />

      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-[var(--gradient-hero)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(6,182,212,0.15),_transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(245,158,11,0.1),_transparent_60%)]" />

        <div className="relative px-4 pb-16 pt-20 sm:px-6 sm:pb-20 sm:pt-28 lg:px-8">
          <div className="text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-brand-500/10 px-4 py-1.5 text-sm text-brand-300">
              <Eye className="h-4 w-4" aria-hidden="true" />
              Regard honn&ecirc;te
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Conna&icirc;tre les{" "}
              <span className="text-gradient">limites</span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300 sm:text-xl">
              Aucun outil n&apos;est parfait. Comprendre ce que Claude Code ne
              fait pas bien, c&apos;est l&apos;utiliser l&agrave; o&ugrave; il
              brille vraiment. Comparaisons &eacute;quilibr&eacute;es, limites
              document&eacute;es, z&eacute;ro langue de bois.
            </p>
          </div>
        </div>
      </section>

      {/* ===== KEY PRINCIPLES ===== */}
      <section className="py-16 sm:py-20">
        <div className="px-4 sm:px-6 lg:px-0">
          <AnimateOnScroll preset="fade-up">
            <SectionHeading
              badge="Principes"
              title="Pourquoi cette section existe"
              description="La plupart des guides IA ne parlent que des avantages. On a fait le choix inverse : documenter les limites pour que chaque recommandation repose sur une vision realiste."
            />
          </AnimateOnScroll>

          <StaggerChildren className="mt-16 grid gap-6 sm:grid-cols-3" staggerDelay={0.08}>
            <FeatureCard
              icon={Eye}
              title="Transparence"
              description="Les limites techniques reelles, documentees sans langue de bois. Fenetre de contexte, hallucinations, couts, latence."
              gradient="teal"
            />
            <FeatureCard
              icon={Scale}
              title="Equilibre"
              description="Les comparaisons reconnaissent ou Copilot et Cursor font mieux. Pas de marketing, juste les faits."
              gradient="amber"
            />
            <FeatureCard
              icon={Target}
              title="Pragmatisme"
              description="Pour chaque limite, une strategie de contournement ou une alternative concrete."
              gradient="green"
            />
          </StaggerChildren>
        </div>
      </section>

      {/* ===== SUB-PAGES CARDS ===== */}
      <section className="bg-slate-50/50 py-16 dark:bg-slate-900/50 sm:py-20">
        <div className="px-4 sm:px-6 lg:px-0">
          <AnimateOnScroll preset="fade-up">
            <div className="mb-12 text-center">
              <span className="mb-3 inline-block rounded-full bg-brand-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand-700 dark:text-brand-400">
                4 guides
              </span>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Explorez la section
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-300">
                Des limites techniques aux comparaisons avec la concurrence,
                chaque guide vous donne les cl&eacute;s pour d&eacute;cider en
                connaissance de cause.
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

      {/* ===== CTA ===== */}
      <section className="relative overflow-hidden py-16 sm:py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-950 via-slate-900 to-brand-900" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(6,182,212,0.12),_transparent_70%)]" />

        <div className="relative px-4 sm:px-6 lg:px-0">
          <div className="text-center">
            <span className="mb-3 inline-block rounded-full bg-brand-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand-400">
              Et ensuite ?
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Vous connaissez les limites.{" "}
              <span className="text-gradient">Exploitez les forces.</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-300">
              Maintenant que vous savez ce que Claude Code ne fait pas bien,
              d&eacute;couvrez ce qu&apos;il fait de mieux que les autres.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            <Link
              href={`/${locale}/getting-started`}
              className="group rounded-xl border border-slate-700/50 bg-slate-800/50 p-6 backdrop-blur transition-all hover:border-brand-500/50 hover:bg-slate-800/80"
            >
              <ShieldX className="mb-3 h-8 w-8 text-brand-400" aria-hidden="true" />
              <h3 className="mb-2 font-semibold text-white">
                Premiers pas
              </h3>
              <p className="text-sm leading-relaxed text-slate-400">
                Installez Claude Code et testez-le sur un vrai projet. Le
                meilleur moyen de juger, c&apos;est d&apos;essayer.
              </p>
              <div className="mt-4 flex items-center gap-1 text-sm font-medium text-brand-400 transition-colors group-hover:text-brand-300">
                Commencer
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </div>
            </Link>

            <Link
              href={`/${locale}/prompting`}
              className="group rounded-xl border border-slate-700/50 bg-slate-800/50 p-6 backdrop-blur transition-all hover:border-accent-500/50 hover:bg-slate-800/80"
            >
              <Target className="mb-3 h-8 w-8 text-accent-400" aria-hidden="true" />
              <h3 className="mb-2 font-semibold text-white">
                Prompting
              </h3>
              <p className="text-sm leading-relaxed text-slate-400">
                Apprenez les techniques pour contourner les limites et obtenir
                de meilleurs r&eacute;sultats.
              </p>
              <div className="mt-4 flex items-center gap-1 text-sm font-medium text-accent-400 transition-colors group-hover:text-accent-300">
                Apprendre
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </div>
            </Link>

            <Link
              href={`/${locale}/mcp`}
              className="group rounded-xl border border-slate-700/50 bg-slate-800/50 p-6 backdrop-blur transition-all hover:border-emerald-500/50 hover:bg-slate-800/80"
            >
              <Scale className="mb-3 h-8 w-8 text-emerald-400" aria-hidden="true" />
              <h3 className="mb-2 font-semibold text-white">
                MCP
              </h3>
              <p className="text-sm leading-relaxed text-slate-400">
                Les MCP comblent certaines limites : acc&egrave;s web, documentation
                &agrave; jour, int&eacute;grations externes.
              </p>
              <div className="mt-4 flex items-center gap-1 text-sm font-medium text-emerald-400 transition-colors group-hover:text-emerald-300">
                Explorer les MCP
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </div>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
