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

const translations = {
  fr: {
    metaTitle: "Claude Code pour tous : cas d'usage concrets",
    metaDescription: "Des exemples pratiques de Claude Code pour non-developpeurs. Cas d'usage business, histoires de reussite et tutoriels sans code.",
    heroBadge: "Pour tous les profils",
    heroTitle: "pour tous",
    heroSubtitle: "Vous n'\u00eates pas d\u00e9veloppeur ? Pas de probl\u00e8me. Voici des exemples concrets de ce que Claude Code peut faire pour vous au quotidien : emails, rapports, analyses, pr\u00e9sentations et plus encore.",
    quickBadge: "En un coup d'oeil",
    quickTitle: "Ce que Claude Code fait pour les non-dev",
    quickDescription: "Trois familles de t\u00e2ches o\u00f9 Claude Code fait gagner des heures chaque semaine, sans \u00e9crire une ligne de code.",
    writingTitle: "R\u00e9daction",
    writingDescription: "Emails, newsletters, posts LinkedIn, comptes-rendus, fiches de poste : gagnez 70% du temps de r\u00e9daction.",
    analysisTitle: "Analyse",
    analysisDescription: "R\u00e9sum\u00e9s de documents, analyse de donn\u00e9es CSV, veille concurrentielle, tableaux comparatifs.",
    orgTitle: "Organisation",
    orgDescription: "Plannings, pr\u00e9sentations, templates r\u00e9utilisables, rapports automatis\u00e9s.",
    guidesCount: "3 guides",
    guidesTitle: "Explorez les cas d'usage",
    guidesDescription: "Des prompts pr\u00eats \u00e0 copier, des t\u00e9moignages r\u00e9alistes et des tutoriels pas \u00e0 pas.",
    readGuide: "Lire le guide",
    subPages: [
      { title: "8 cas d'usage business", description: "Email professionnel, resum\u00e9 de document, analyse de donn\u00e9es, pr\u00e9sentation, planning, post LinkedIn : des prompts exacts \u00e0 copier." },
      { title: "Histoires de r\u00e9ussite", description: "4 professionnels non-d\u00e9veloppeurs racontent comment Claude Code a transform\u00e9 leur quotidien. Marketing, RH, finance et gestion de projet." },
      { title: "Tutoriels sans code", description: "Automatiser un rapport, cr\u00e9er un syst\u00e8me de templates email, g\u00e9n\u00e9rer une pr\u00e9sentation : pas \u00e0 pas, z\u00e9ro code." },
    ],
    ctaBadge: "Et ensuite ?",
    ctaTitle: "Pr\u00eat \u00e0 essayer ?",
    ctaTitleHighlight: "Lancez-vous.",
    ctaDescription: "Commencez par installer Claude Code, puis revenez ici copier votre premier prompt. Les r\u00e9sultats parlent d'eux-m\u00eames.",
    installTitle: "Installer Claude Code",
    installDescription: "Le guide pas \u00e0 pas pour installer et configurer Claude Code en quelques minutes.",
    installLink: "Premiers pas",
    nonDevPromptTitle: "Prompting non-dev",
    nonDevPromptDescription: "20+ templates de prompts pour la communication, l'analyse et la cr\u00e9ation de contenu.",
    nonDevPromptLink: "Voir les templates",
    personaTitle: "Parcours non-dev",
    personaDescription: "Un itin\u00e9raire complet pour les non-d\u00e9veloppeurs, du premier pas aux usages avanc\u00e9s.",
    personaLink: "Suivre le parcours",
  },
  en: {
    metaTitle: "Claude Code for everyone: real-world use cases",
    metaDescription: "Practical Claude Code examples for non-developers. Business use cases, success stories, and no-code tutorials.",
    heroBadge: "For all profiles",
    heroTitle: "for everyone",
    heroSubtitle: "Not a developer? No problem. Here are real examples of what Claude Code can do for you every day: emails, reports, analysis, presentations, and more.",
    quickBadge: "At a glance",
    quickTitle: "What Claude Code does for non-developers",
    quickDescription: "Three families of tasks where Claude Code saves hours every week, without writing a single line of code.",
    writingTitle: "Writing",
    writingDescription: "Emails, newsletters, LinkedIn posts, meeting notes, job descriptions: save 70% of your writing time.",
    analysisTitle: "Analysis",
    analysisDescription: "Document summaries, CSV data analysis, competitive intelligence, comparison tables.",
    orgTitle: "Organization",
    orgDescription: "Schedules, presentations, reusable templates, automated reports.",
    guidesCount: "3 guides",
    guidesTitle: "Explore use cases",
    guidesDescription: "Ready-to-copy prompts, realistic testimonials, and step-by-step tutorials.",
    readGuide: "Read the guide",
    subPages: [
      { title: "8 business use cases", description: "Professional emails, document summaries, data analysis, presentations, planning, LinkedIn posts: exact prompts to copy." },
      { title: "Success stories", description: "4 non-developer professionals share how Claude Code transformed their daily work. Marketing, HR, finance, and project management." },
      { title: "No-code tutorials", description: "Automate a report, create an email template system, generate a presentation: step by step, zero code." },
    ],
    ctaBadge: "What's next?",
    ctaTitle: "Ready to try?",
    ctaTitleHighlight: "Get started.",
    ctaDescription: "Start by installing Claude Code, then come back here to copy your first prompt. The results speak for themselves.",
    installTitle: "Install Claude Code",
    installDescription: "Step-by-step guide to install and configure Claude Code in minutes.",
    installLink: "Get started",
    nonDevPromptTitle: "Non-dev prompting",
    nonDevPromptDescription: "20+ prompt templates for communication, analysis, and content creation.",
    nonDevPromptLink: "See templates",
    personaTitle: "Non-dev path",
    personaDescription: "A complete journey for non-developers, from first steps to advanced usage.",
    personaLink: "Follow the path",
  },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = translations[locale as "fr" | "en"];
  return createPageMetadata({ title: t.metaTitle, description: t.metaDescription, path: `/${locale}/use-cases`, locale });
}

function buildArticleJsonLd(locale: string) {
  const t = translations[locale as "fr" | "en"];
  return createArticleSchema({ title: t.metaTitle, description: t.metaDescription, url: `${SITE_URL}/${locale}/use-cases`, locale, datePublished: "2026-03-12", dateModified: "2026-03-12" });
}

const SUB_PAGES = [
  { href: "/use-cases/business", icon: Briefcase, step: "01", color: "brand" as const },
  { href: "/use-cases/success-stories", icon: Users, step: "02", color: "accent" as const },
  { href: "/use-cases/no-code", icon: Zap, step: "03", color: "brand" as const },
] as const;

const colorStyles = {
  brand: { iconBg: "bg-brand-500/10", iconText: "text-brand-700 dark:text-brand-400", hoverBorder: "hover:border-brand-500/30", linkText: "text-brand-700 dark:text-brand-400", linkHover: "group-hover:text-brand-600 dark:group-hover:text-brand-300", step: "text-brand-500/40" },
  accent: { iconBg: "bg-accent-500/10", iconText: "text-accent-600 dark:text-accent-400", hoverBorder: "hover:border-accent-500/30", linkText: "text-accent-600 dark:text-accent-400", linkHover: "group-hover:text-accent-500 dark:group-hover:text-accent-300", step: "text-accent-500/40" },
};

export default async function UseCasesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = translations[locale as "fr" | "en"];
  const jsonLdHtml = serializeJsonLd(buildArticleJsonLd(locale));
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdHtml }} />
      <section className="relative overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-[var(--gradient-hero)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(6,182,212,0.15),_transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(245,158,11,0.1),_transparent_60%)]" />
        <div className="relative px-4 pb-16 pt-20 sm:px-6 sm:pb-20 sm:pt-28 lg:px-8">
          <div className="text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-brand-500/10 px-4 py-1.5 text-sm text-brand-300">
              <Lightbulb className="h-4 w-4" aria-hidden="true" />
              {t.heroBadge}
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              <span className="text-gradient">Claude Code</span> {t.heroTitle}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300 sm:text-xl">{t.heroSubtitle}</p>
          </div>
        </div>
      </section>
      <section className="py-16 sm:py-20">
        <div className="px-4 sm:px-6 lg:px-0">
          <AnimateOnScroll preset="fade-up">
            <div className="mb-12 text-center">
              <span className="mb-3 inline-block rounded-full bg-brand-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand-700 dark:text-brand-400">{t.quickBadge}</span>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{t.quickTitle}</h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-300">{t.quickDescription}</p>
            </div>
          </AnimateOnScroll>
          <div className="grid gap-6 sm:grid-cols-3">
            <AnimateOnScroll preset="fade-up">
              <div className="glass-card p-6 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500/20 to-brand-500/5">
                  <Mail className="h-6 w-6 text-brand-700 dark:text-brand-400" aria-hidden="true" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{t.writingTitle}</h3>
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{t.writingDescription}</p>
              </div>
            </AnimateOnScroll>
            <AnimateOnScroll preset="fade-up">
              <div className="glass-card p-6 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-accent-500/20 to-accent-500/5">
                  <BarChart3 className="h-6 w-6 text-accent-600 dark:text-accent-400" aria-hidden="true" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{t.analysisTitle}</h3>
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{t.analysisDescription}</p>
              </div>
            </AnimateOnScroll>
            <AnimateOnScroll preset="fade-up">
              <div className="glass-card p-6 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/5">
                  <FileText className="h-6 w-6 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{t.orgTitle}</h3>
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{t.orgDescription}</p>
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </section>
      <section className="bg-slate-50/50 py-16 dark:bg-slate-900/50 sm:py-20">
        <div className="px-4 sm:px-6 lg:px-0">
          <AnimateOnScroll preset="fade-up">
            <div className="mb-12 text-center">
              <span className="mb-3 inline-block rounded-full bg-brand-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand-700 dark:text-brand-400">{t.guidesCount}</span>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{t.guidesTitle}</h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-300">{t.guidesDescription}</p>
            </div>
          </AnimateOnScroll>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SUB_PAGES.map((page, index) => {
              const Icon = page.icon;
              const styles = colorStyles[page.color];
              const subPage = t.subPages[index];
              return (
                <AnimateOnScroll key={page.href} preset="fade-up">
                  <Link href={`/${locale}${page.href}`} className={`group relative flex flex-col rounded-xl border border-slate-200/50 bg-white/50 p-6 transition-all hover:bg-white hover:shadow-lg dark:border-slate-700/50 dark:bg-slate-800/50 dark:hover:bg-slate-800/80 ${styles.hoverBorder}`}>
                    <div className="mb-4 flex items-center justify-between">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${styles.iconBg}`}>
                        <Icon className={`h-6 w-6 ${styles.iconText}`} aria-hidden="true" />
                      </div>
                      <span className={`text-3xl font-black ${styles.step}`}>{page.step}</span>
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">{subPage.title}</h3>
                    <p className="mb-4 flex-1 text-sm leading-relaxed text-slate-500 dark:text-slate-300">{subPage.description}</p>
                    <div className={`flex items-center gap-1 text-sm font-medium ${styles.linkText} transition-colors ${styles.linkHover}`}>
                      {t.readGuide}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                    </div>
                  </Link>
                </AnimateOnScroll>
              );
            })}
          </div>
        </div>
      </section>
      <section className="relative overflow-hidden py-16 sm:py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-950 via-slate-900 to-brand-900" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(6,182,212,0.12),_transparent_70%)]" />
        <div className="relative px-4 sm:px-6 lg:px-0">
          <div className="text-center">
            <span className="mb-3 inline-block rounded-full bg-brand-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand-400">{t.ctaBadge}</span>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              {t.ctaTitle}{" "}<span className="text-gradient">{t.ctaTitleHighlight}</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-300">{t.ctaDescription}</p>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            <Link href={`/${locale}/getting-started`} className="group rounded-xl border border-slate-700/50 bg-slate-800/50 p-6 backdrop-blur transition-all hover:border-brand-500/50 hover:bg-slate-800/80">
              <Sparkles className="mb-3 h-8 w-8 text-brand-400" aria-hidden="true" />
              <h3 className="mb-2 font-semibold text-white">{t.installTitle}</h3>
              <p className="text-sm leading-relaxed text-slate-400">{t.installDescription}</p>
              <div className="mt-4 flex items-center gap-1 text-sm font-medium text-brand-400 transition-colors group-hover:text-brand-300">
                {t.installLink}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </div>
            </Link>
            <Link href={`/${locale}/prompting/non-dev-prompting`} className="group rounded-xl border border-slate-700/50 bg-slate-800/50 p-6 backdrop-blur transition-all hover:border-accent-500/50 hover:bg-slate-800/80">
              <Lightbulb className="mb-3 h-8 w-8 text-accent-400" aria-hidden="true" />
              <h3 className="mb-2 font-semibold text-white">{t.nonDevPromptTitle}</h3>
              <p className="text-sm leading-relaxed text-slate-400">{t.nonDevPromptDescription}</p>
              <div className="mt-4 flex items-center gap-1 text-sm font-medium text-accent-400 transition-colors group-hover:text-accent-300">
                {t.nonDevPromptLink}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </div>
            </Link>
            <Link href={`/${locale}/personas/non-dev`} className="group rounded-xl border border-slate-700/50 bg-slate-800/50 p-6 backdrop-blur transition-all hover:border-emerald-500/50 hover:bg-slate-800/80">
              <Users className="mb-3 h-8 w-8 text-emerald-400" aria-hidden="true" />
              <h3 className="mb-2 font-semibold text-white">{t.personaTitle}</h3>
              <p className="text-sm leading-relaxed text-slate-400">{t.personaDescription}</p>
              <div className="mt-4 flex items-center gap-1 text-sm font-medium text-emerald-400 transition-colors group-hover:text-emerald-300">
                {t.personaLink}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </div>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
