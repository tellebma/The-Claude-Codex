import { setRequestLocale } from "next-intl/server";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  Shield,
  Users,
  Calculator,
  HelpCircle,
  Settings,
  TrendingUp,
  Lock,
  UserCheck,
  ChevronRight,
} from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FeatureCard } from "@/components/ui/FeatureCard";
import { AnimateOnScroll, StaggerChildren } from "@/components/ui/AnimateOnScroll";
import { createPageMetadata, SITE_URL } from "@/lib/metadata";
import { createArticleSchema, serializeJsonLd } from "@/lib/structured-data";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return createPageMetadata({
    title: "Claude Code en entreprise",
    description:
      "Deployer Claude Code dans votre organisation : securite, conformite RGPD, plan d'adoption, calculateur TCO, gouvernance et FAQ enterprise.",
    path: `/${locale}/enterprise`,
    locale,
  });
}

function buildArticleJsonLd(locale: string) {
  return createArticleSchema({
    title: "Claude Code en entreprise",
    description:
      "Deployer Claude Code dans votre organisation : securite, conformite RGPD, plan d'adoption, calculateur TCO, gouvernance et FAQ enterprise.",
    url: `${SITE_URL}/${locale}/enterprise`,
    locale,
    datePublished: "2026-03-12",
    dateModified: "2026-03-12",
  });
}

const SUB_PAGES = [
  {
    href: "/enterprise/security-compliance",
    icon: Shield,
    step: "01",
    title: "Sécurité et conformité",
    description:
      "RGPD, AI Act, protection des données, certifications Anthropic, audit trail et bonnes pratiques de sécurité pour les équipes.",
    color: "brand" as const,
  },
  {
    href: "/enterprise/team-adoption",
    icon: Users,
    step: "02",
    title: "Guide d’adoption d’équipe",
    description:
      "Plan en 4 phases : préparation, pilote, déploiement et optimisation. Change management et templates de communication.",
    color: "brand" as const,
  },
  {
    href: "/enterprise/tco-calculator",
    icon: Calculator,
    step: "03",
    title: "Calculateur de coût total (TCO)",
    description:
      "Estimez le budget par plan, comparez avec Copilot et Cursor, et calculez le retour sur investissement pour votre équipe.",
    color: "accent" as const,
  },
  {
    href: "/enterprise/faq",
    icon: HelpCircle,
    step: "04",
    title: "FAQ Enterprise",
    description:
      "15+ réponses sur les données, la conformité, les coûts, le déploiement, la propriété intellectuelle et le support.",
    color: "accent" as const,
  },
  {
    href: "/enterprise/governance",
    icon: Settings,
    step: "05",
    title: "Gouvernance et rôles",
    description:
      "Permissions par rôle, gestion centralisée des configs, allow list MCP, audit et politique de mise à jour.",
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

/* Moved jsonLd computation into component to access locale */

export default async function EnterprisePage({
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
              <Building2 className="h-4 w-4" aria-hidden="true" />
              Enterprise
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl">
              <span className="text-gradient">Claude Code</span> pour
              <br />
              votre organisation
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300 sm:text-xl">
              S&eacute;curit&eacute;, conformit&eacute;, gouvernance et adoption :
              tout ce qu&apos;il faut pour d&eacute;ployer Claude Code dans une
              &eacute;quipe de 5 &agrave; 500 d&eacute;veloppeurs.
            </p>
          </div>
        </div>
      </section>

      {/* ===== 4 PILLARS ===== */}
      <section className="py-16 sm:py-20">
        <div className="px-4 sm:px-6 lg:px-0">
          <AnimateOnScroll preset="fade-up">
            <SectionHeading
              badge="4 piliers"
              title="Les fondations d'un deploiement reussi"
              description="Chaque pilier couvre un aspect essentiel du deploiement de Claude Code en entreprise."
            />
          </AnimateOnScroll>

          <StaggerChildren className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4" staggerDelay={0.08}>
            <FeatureCard
              icon={TrendingUp}
              title="Productivite"
              description="55 % plus rapide sur les taches de codage. 5 a 10 heures gagnees par dev par semaine sur les taches repetitives."
              gradient="teal"
            />
            <FeatureCard
              icon={Lock}
              title="Securite"
              description="Chiffrement, retention configurable, SOC 2 Type II. Zero retention via Bedrock ou Vertex AI."
              gradient="amber"
            />
            <FeatureCard
              icon={Settings}
              title="Gouvernance"
              description="Roles, permissions, allow list MCP, audit trail. Configuration centralisee et hierarchique."
              gradient="purple"
            />
            <FeatureCard
              icon={UserCheck}
              title="Adoption"
              description="Plan en 4 phases, champions internes, metriques de suivi et gestion des resistances."
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
                5 guides
              </span>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Explorez la section Enterprise
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-300">
                De la s&eacute;curit&eacute; au calcul de ROI, chaque guide couvre
                un aspect concret du d&eacute;ploiement en organisation.
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

      {/* ===== KEY NUMBERS ===== */}
      <section className="py-16 sm:py-20">
        <div className="px-4 sm:px-6 lg:px-0">
          <AnimateOnScroll preset="fade-up">
            <SectionHeading
              badge="Chiffres"
              title="L'impact mesure de l'IA sur les equipes"
            />
          </AnimateOnScroll>

          <StaggerChildren className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4" staggerDelay={0.06}>
            <div className="glass-card p-6 text-center">
              <p className="text-4xl font-extrabold text-brand-600 dark:text-brand-400">
                +55%
              </p>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                Vitesse de completion des taches
              </p>
              <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                Source : GitHub (2024)
              </p>
            </div>
            <div className="glass-card p-6 text-center">
              <p className="text-4xl font-extrabold text-brand-600 dark:text-brand-400">
                5-10h
              </p>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                Gagnees par dev par semaine
              </p>
              <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                Retours d&apos;equipes en production
              </p>
            </div>
            <div className="glass-card p-6 text-center">
              <p className="text-4xl font-extrabold text-accent-600 dark:text-accent-400">
                -40%
              </p>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                Temps de revue de code
              </p>
              <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                Premier passage automatise
              </p>
            </div>
            <div className="glass-card p-6 text-center">
              <p className="text-4xl font-extrabold text-accent-600 dark:text-accent-400">
                12x
              </p>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                ROI moyen de l&apos;outil
              </p>
              <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                Estimation sur gain de 7h/semaine
              </p>
            </div>
          </StaggerChildren>
        </div>
      </section>

      {/* ===== GETTING STARTED STEPS ===== */}
      <section className="bg-slate-50/50 py-16 dark:bg-slate-900/50 sm:py-20">
        <div className="px-4 sm:px-6 lg:px-0">
          <SectionHeading
            badge="Par ou commencer"
            title="3 etapes pour lancer votre pilote"
          />

          <div className="mt-16 space-y-6">
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-0">
              <div className="glass-card flex-1 p-6 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500/20 to-brand-500/5">
                  <Calculator className="h-6 w-6 text-brand-700 dark:text-brand-400" aria-hidden="true" />
                </div>
                <p className="text-sm font-semibold">1. Estimez les couts</p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-300">
                  <Link href={`/${locale}/enterprise/tco-calculator`} className="text-brand-600 underline dark:text-brand-400">
                    Calculateur TCO
                  </Link>
                </p>
              </div>
              <div className="flex items-center justify-center sm:px-2">
                <ChevronRight className="h-6 w-6 rotate-90 text-slate-400 sm:rotate-0" aria-hidden="true" />
              </div>
              <div className="glass-card flex-1 p-6 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-accent-500/20 to-accent-500/5">
                  <Users className="h-6 w-6 text-accent-600 dark:text-accent-400" aria-hidden="true" />
                </div>
                <p className="text-sm font-semibold">2. Lancez un pilote</p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-300">
                  <Link href={`/${locale}/enterprise/team-adoption`} className="text-brand-600 underline dark:text-brand-400">
                    Guide d&apos;adoption
                  </Link>
                </p>
              </div>
              <div className="flex items-center justify-center sm:px-2">
                <ChevronRight className="h-6 w-6 rotate-90 text-slate-400 sm:rotate-0" aria-hidden="true" />
              </div>
              <div className="glass-card flex-1 p-6 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/5">
                  <Shield className="h-6 w-6 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                </div>
                <p className="text-sm font-semibold">3. Cadrez la securite</p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-300">
                  <Link href={`/${locale}/enterprise/security-compliance`} className="text-brand-600 underline dark:text-brand-400">
                    Securite et conformite
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="relative overflow-hidden py-20 sm:py-28">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-950 via-slate-900 to-brand-900" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(6,182,212,0.15),_transparent_70%)]" />

        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl">
            Pret a <span className="text-gradient">deployer</span> ?
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300">
            Commencez par un pilote de 4 semaines avec une equipe reduite.
            Les resultats parleront d&apos;eux-memes.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="https://www.anthropic.com/contact-sales"
              className="group inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-sm font-semibold text-slate-900 shadow-lg transition-all hover:bg-slate-100"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Building2 className="h-4 w-4" aria-hidden="true" />
              Contacter Anthropic
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
            <Link
              href={`/${locale}/enterprise/team-adoption`}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-600 px-8 py-3.5 text-sm font-semibold text-white transition-all hover:border-slate-500 hover:bg-white/5"
            >
              <Users className="h-4 w-4" aria-hidden="true" />
              Commencer un pilote
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
