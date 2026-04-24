import { setRequestLocale } from "next-intl/server";
import Link from "next/link";
import { ArrowRight, Building2, Shield, Users, Calculator, HelpCircle, Settings, TrendingUp, Lock, UserCheck, ChevronRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FeatureCard } from "@/components/ui/FeatureCard";
import { AnimateOnScroll, StaggerChildren } from "@/components/ui/AnimateOnScroll";
import { createPageMetadata, SITE_URL } from "@/lib/metadata";
import { createArticleSchema, serializeJsonLd } from "@/lib/structured-data";

const translations = {
  fr: {
    metaTitle: "Claude Code en entreprise",
    metaDescription: "Deployer Claude Code dans votre organisation : securite, conformite RGPD, plan d'adoption, calculateur TCO, gouvernance et FAQ enterprise.",
    heroBadge: "Enterprise", heroTitle: "pour", heroTitle2: "votre organisation",
    heroSubtitle: "S\u00e9curit\u00e9, conformit\u00e9, gouvernance et adoption : tout ce qu'il faut pour d\u00e9ployer Claude Code dans une \u00e9quipe de 5 \u00e0 500 d\u00e9veloppeurs.",
    pillarsBadge: "4 piliers", pillarsTitle: "Les fondations d'un deploiement reussi", pillarsDescription: "Chaque pilier couvre un aspect essentiel du deploiement de Claude Code en entreprise.",
    prodTitle: "Productivite", prodDesc: "55 % plus rapide sur les taches de codage. 5 a 10 heures gagnees par dev par semaine sur les taches repetitives.",
    secTitle: "Securite", secDesc: "Chiffrement, retention configurable, SOC 2 Type II. Zero retention via Bedrock ou Vertex AI.",
    govTitle: "Gouvernance", govDesc: "Roles, permissions, allow list MCP, audit trail. Configuration centralisee et hierarchique.",
    adoptTitle: "Adoption", adoptDesc: "Plan en 4 phases, champions internes, metriques de suivi et gestion des resistances.",
    guidesCount: "5 guides", guidesTitle: "Explorez la section Enterprise",
    guidesDescription: "De la s\u00e9curit\u00e9 au calcul de ROI, chaque guide couvre un aspect concret du d\u00e9ploiement en organisation.",
    readGuide: "Lire le guide",
    subPages: [
      { title: "S\u00e9curit\u00e9 et conformit\u00e9", description: "RGPD, AI Act, protection des donn\u00e9es, certifications Anthropic, audit trail et bonnes pratiques." },
      { title: "Guide d'adoption d'\u00e9quipe", description: "Plan en 4 phases : pr\u00e9paration, pilote, d\u00e9ploiement et optimisation." },
      { title: "Calculateur de co\u00fbt total (TCO)", description: "Estimez le budget par plan, comparez avec Copilot et Cursor, calculez le ROI." },
      { title: "FAQ Enterprise", description: "15+ r\u00e9ponses sur les donn\u00e9es, la conformit\u00e9, les co\u00fbts et le support." },
      { title: "Gouvernance et r\u00f4les", description: "Permissions par r\u00f4le, gestion centralis\u00e9e, allow list MCP, audit." },
    ],
    numBadge: "Chiffres", numTitle: "L'impact mesure de l'IA sur les equipes",
    taskSpeed: "Vitesse de completion des taches", taskSource: "Source : GitHub (2024)",
    hoursSaved: "Gagnees par dev par semaine", hoursSrc: "Retours d'\u00e9quipes en production",
    reviewTime: "Temps de revue de code", reviewSrc: "Premier passage automatise",
    roiLabel: "ROI moyen de l'outil", roiSrc: "Estimation sur gain de 7h/semaine",
    stepsBadge: "Par ou commencer", stepsTitle: "3 etapes pour lancer votre pilote",
    step1: "1. Estimez les couts", step2: "2. Lancez un pilote", step3: "3. Cadrez la securite",
    tcoLink: "Calculateur TCO", adoptionLink: "Guide d'adoption", secLink: "Securite et conformite",
    ctaTitle: "Pret a", ctaHighlight: "deployer", ctaQ: " ?",
    ctaDesc: "Commencez par un pilote de 4 semaines avec une equipe reduite. Les resultats parleront d'eux-memes.",
    contactBtn: "Contacter Anthropic", pilotBtn: "Commencer un pilote",
  },
  en: {
    metaTitle: "Claude Code for Enterprise",
    metaDescription: "Deploy Claude Code in your organization: security, GDPR compliance, adoption plan, TCO calculator, governance, and enterprise FAQ.",
    heroBadge: "Enterprise", heroTitle: "for", heroTitle2: "your organization",
    heroSubtitle: "Security, compliance, governance, and adoption: everything to deploy Claude Code in a team of 5 to 500 developers.",
    pillarsBadge: "4 pillars", pillarsTitle: "Foundations of a successful deployment", pillarsDescription: "Each pillar covers an essential aspect of deploying Claude Code in an enterprise.",
    prodTitle: "Productivity", prodDesc: "55% faster on coding tasks. 5 to 10 hours saved per developer per week on repetitive tasks.",
    secTitle: "Security", secDesc: "Encryption, configurable retention, SOC 2 Type II. Zero retention via Bedrock or Vertex AI.",
    govTitle: "Governance", govDesc: "Roles, permissions, MCP allow list, audit trail. Centralized, hierarchical configuration.",
    adoptTitle: "Adoption", adoptDesc: "4-phase plan, internal champions, tracking metrics, and resistance management.",
    guidesCount: "5 guides", guidesTitle: "Explore the Enterprise section",
    guidesDescription: "From security to ROI calculation, each guide covers a concrete aspect of organizational deployment.",
    readGuide: "Read the guide",
    subPages: [
      { title: "Security and compliance", description: "GDPR, AI Act, data protection, Anthropic certifications, audit trail, and best practices." },
      { title: "Team adoption guide", description: "4-phase plan: preparation, pilot, deployment, and optimization." },
      { title: "Total Cost of Ownership (TCO) calculator", description: "Estimate budget by plan, compare with Copilot and Cursor, calculate ROI." },
      { title: "Enterprise FAQ", description: "15+ answers on data, compliance, costs, and support." },
      { title: "Governance and roles", description: "Role-based permissions, centralized config, MCP allow list, audit." },
    ],
    numBadge: "Numbers", numTitle: "The measured impact of AI on teams",
    taskSpeed: "Task completion speed", taskSource: "Source: GitHub (2024)",
    hoursSaved: "Saved per dev per week", hoursSrc: "Feedback from teams in production",
    reviewTime: "Code review time", reviewSrc: "First pass automated",
    roiLabel: "Average tool ROI", roiSrc: "Estimated on 7h/week gain",
    stepsBadge: "Where to start", stepsTitle: "3 steps to launch your pilot",
    step1: "1. Estimate costs", step2: "2. Launch a pilot", step3: "3. Frame security",
    tcoLink: "TCO Calculator", adoptionLink: "Adoption guide", secLink: "Security and compliance",
    ctaTitle: "Ready to", ctaHighlight: "deploy", ctaQ: "?",
    ctaDesc: "Start with a 4-week pilot with a small team. The results will speak for themselves.",
    contactBtn: "Contact Anthropic", pilotBtn: "Start a pilot",
  },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params; const t = translations[locale as "fr" | "en"];
  return createPageMetadata({ title: t.metaTitle, description: t.metaDescription, path: `/${locale}/enterprise`, locale });
}
function buildArticleJsonLd(locale: string) { const t = translations[locale as "fr" | "en"]; return createArticleSchema({ title: t.metaTitle, description: t.metaDescription, url: `${SITE_URL}/${locale}/enterprise`, locale, datePublished: "2026-03-12", dateModified: "2026-03-12" }); }

const SUB_PAGES = [
  { href: "/enterprise/security-compliance", icon: Shield, step: "01", color: "brand" as const },
  { href: "/enterprise/team-adoption", icon: Users, step: "02", color: "brand" as const },
  { href: "/enterprise/tco-calculator", icon: Calculator, step: "03", color: "accent" as const },
  { href: "/enterprise/faq", icon: HelpCircle, step: "04", color: "accent" as const },
  { href: "/enterprise/governance", icon: Settings, step: "05", color: "brand" as const },
] as const;
const colorStyles = {
  brand: { iconBg: "bg-brand-500/10", iconText: "text-brand-700 dark:text-brand-400", hoverBorder: "hover:border-brand-500/30", linkText: "text-brand-700 dark:text-brand-400", linkHover: "group-hover:text-brand-600 dark:group-hover:text-brand-300", step: "text-brand-500/40" },
  accent: { iconBg: "bg-accent-500/10", iconText: "text-accent-600 dark:text-accent-400", hoverBorder: "hover:border-accent-500/30", linkText: "text-accent-600 dark:text-accent-400", linkHover: "group-hover:text-accent-500 dark:group-hover:text-accent-300", step: "text-accent-500/40" },
};

export default async function EnterprisePage({ params }: Readonly<{ params: Promise<{ locale: string }> }>) {
  const { locale } = await params; setRequestLocale(locale); const t = translations[locale as "fr" | "en"];
  /*
   * JSON-LD: safe -- static schema from our own constants,
   * serialized via JSON.stringify. No user input.
   */
  const jsonLdHtml = serializeJsonLd(buildArticleJsonLd(locale));
  return (
    <>
      {/* JSON-LD structured data -- safe: static schema, no user input */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdHtml }} />
      <section className="relative overflow-hidden bg-slate-950"><div className="absolute inset-0 bg-[var(--gradient-hero)]" /><div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(6,182,212,0.15),_transparent_60%)]" /><div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(245,158,11,0.1),_transparent_60%)]" /><div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-20 sm:px-6 sm:pb-28 sm:pt-28 lg:px-8 lg:pb-32 lg:pt-32"><div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-brand-500/10 px-4 py-1.5 text-sm text-brand-300"><Building2 className="h-4 w-4" aria-hidden="true" />{t.heroBadge}</div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl"><span className="text-gradient">Claude Code</span> {t.heroTitle}<br />{t.heroTitle2}</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300 sm:text-xl">{t.heroSubtitle}</p>
        </div></div>
      </section>
      <section className="py-16 sm:py-20"><div className="px-4 sm:px-6 lg:px-0">
        <AnimateOnScroll preset="fade-up"><SectionHeading badge={t.pillarsBadge} title={t.pillarsTitle} description={t.pillarsDescription} /></AnimateOnScroll>
        <StaggerChildren className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4" staggerDelay={0.08}>
          <FeatureCard icon={TrendingUp} title={t.prodTitle} description={t.prodDesc} gradient="teal" />
          <FeatureCard icon={Lock} title={t.secTitle} description={t.secDesc} gradient="amber" />
          <FeatureCard icon={Settings} title={t.govTitle} description={t.govDesc} gradient="purple" />
          <FeatureCard icon={UserCheck} title={t.adoptTitle} description={t.adoptDesc} gradient="green" />
        </StaggerChildren>
      </div></section>
      <section className="bg-slate-50/50 py-16 dark:bg-slate-900/50 sm:py-20"><div className="px-4 sm:px-6 lg:px-0">
        <AnimateOnScroll preset="fade-up"><div className="mb-12 text-center">
          <span className="mb-3 inline-block rounded-full bg-brand-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand-700 dark:text-brand-400">{t.guidesCount}</span>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{t.guidesTitle}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-300">{t.guidesDescription}</p>
        </div></AnimateOnScroll>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{SUB_PAGES.map((page, idx) => {
          const Icon = page.icon; const styles = colorStyles[page.color]; const sp = t.subPages[idx];
          return (<AnimateOnScroll key={page.href} preset="fade-up"><Link href={`/${locale}${page.href}`} className={`group relative flex flex-col rounded-xl border border-slate-200/50 bg-white/50 p-6 transition-all hover:bg-white hover:shadow-lg dark:border-slate-700/50 dark:bg-slate-800/50 dark:hover:bg-slate-800/80 ${styles.hoverBorder}`}>
            <div className="mb-4 flex items-center justify-between"><div className={`flex h-12 w-12 items-center justify-center rounded-xl ${styles.iconBg}`}><Icon className={`h-6 w-6 ${styles.iconText}`} aria-hidden="true" /></div><span className={`text-3xl font-black ${styles.step}`}>{page.step}</span></div>
            <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">{sp.title}</h3><p className="mb-4 flex-1 text-sm leading-relaxed text-slate-500 dark:text-slate-300">{sp.description}</p>
            <div className={`flex items-center gap-1 text-sm font-medium ${styles.linkText} transition-colors ${styles.linkHover}`}>{t.readGuide}<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" /></div>
          </Link></AnimateOnScroll>);
        })}</div>
      </div></section>
      <section className="py-16 sm:py-20"><div className="px-4 sm:px-6 lg:px-0">
        <AnimateOnScroll preset="fade-up"><SectionHeading badge={t.numBadge} title={t.numTitle} /></AnimateOnScroll>
        <StaggerChildren className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4" staggerDelay={0.06}>
          <div className="glass-card p-6 text-center"><p className="text-4xl font-extrabold text-brand-600 dark:text-brand-400">+55%</p><p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{t.taskSpeed}</p><p className="mt-1 text-xs text-slate-400 dark:text-slate-500">{t.taskSource}</p></div>
          <div className="glass-card p-6 text-center"><p className="text-4xl font-extrabold text-brand-600 dark:text-brand-400">5-10h</p><p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{t.hoursSaved}</p><p className="mt-1 text-xs text-slate-400 dark:text-slate-500">{t.hoursSrc}</p></div>
          <div className="glass-card p-6 text-center"><p className="text-4xl font-extrabold text-accent-600 dark:text-accent-400">-40%</p><p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{t.reviewTime}</p><p className="mt-1 text-xs text-slate-400 dark:text-slate-500">{t.reviewSrc}</p></div>
          <div className="glass-card p-6 text-center"><p className="text-4xl font-extrabold text-accent-600 dark:text-accent-400">12x</p><p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{t.roiLabel}</p><p className="mt-1 text-xs text-slate-400 dark:text-slate-500">{t.roiSrc}</p></div>
        </StaggerChildren>
      </div></section>
      <section className="bg-slate-50/50 py-16 dark:bg-slate-900/50 sm:py-20"><div className="px-4 sm:px-6 lg:px-0">
        <SectionHeading badge={t.stepsBadge} title={t.stepsTitle} />
        <div className="mt-16 space-y-6"><div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-0">
          <div className="glass-card flex-1 p-6 text-center"><div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500/20 to-brand-500/5"><Calculator className="h-6 w-6 text-brand-700 dark:text-brand-400" aria-hidden="true" /></div><p className="text-sm font-semibold">{t.step1}</p><p className="mt-1 text-xs text-slate-500 dark:text-slate-300"><Link href={`/${locale}/enterprise/tco-calculator`} className="text-brand-600 underline dark:text-brand-400">{t.tcoLink}</Link></p></div>
          <div className="flex items-center justify-center sm:px-2"><ChevronRight className="h-6 w-6 rotate-90 text-slate-400 sm:rotate-0" aria-hidden="true" /></div>
          <div className="glass-card flex-1 p-6 text-center"><div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-accent-500/20 to-accent-500/5"><Users className="h-6 w-6 text-accent-600 dark:text-accent-400" aria-hidden="true" /></div><p className="text-sm font-semibold">{t.step2}</p><p className="mt-1 text-xs text-slate-500 dark:text-slate-300"><Link href={`/${locale}/enterprise/team-adoption`} className="text-brand-600 underline dark:text-brand-400">{t.adoptionLink}</Link></p></div>
          <div className="flex items-center justify-center sm:px-2"><ChevronRight className="h-6 w-6 rotate-90 text-slate-400 sm:rotate-0" aria-hidden="true" /></div>
          <div className="glass-card flex-1 p-6 text-center"><div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/5"><Shield className="h-6 w-6 text-emerald-600 dark:text-emerald-400" aria-hidden="true" /></div><p className="text-sm font-semibold">{t.step3}</p><p className="mt-1 text-xs text-slate-500 dark:text-slate-300"><Link href={`/${locale}/enterprise/security-compliance`} className="text-brand-600 underline dark:text-brand-400">{t.secLink}</Link></p></div>
        </div></div>
      </div></section>
      <section className="relative overflow-hidden py-20 sm:py-28"><div className="absolute inset-0 bg-gradient-to-br from-brand-950 via-slate-900 to-brand-900" /><div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(6,182,212,0.15),_transparent_70%)]" />
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl">{t.ctaTitle} <span className="text-gradient">{t.ctaHighlight}</span>{t.ctaQ}</h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300">{t.ctaDesc}</p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="https://www.anthropic.com/contact-sales" className="group inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-sm font-semibold text-slate-900 shadow-lg transition-all hover:bg-slate-100" target="_blank" rel="noopener noreferrer"><Building2 className="h-4 w-4" aria-hidden="true" />{t.contactBtn}<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" /></Link>
            <Link href={`/${locale}/enterprise/team-adoption`} className="inline-flex items-center gap-2 rounded-xl border border-slate-600 px-8 py-3.5 text-sm font-semibold text-white transition-all hover:border-slate-500 hover:bg-white/5"><Users className="h-4 w-4" aria-hidden="true" />{t.pilotBtn}</Link>
          </div>
        </div>
      </section>
    </>
  );
}
