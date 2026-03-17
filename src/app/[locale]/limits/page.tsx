import { setRequestLocale } from "next-intl/server";
import Link from "next/link";
import { ArrowRight, AlertTriangle, Scale, GitCompare, ShieldX, Ban, Eye, Target } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FeatureCard } from "@/components/ui/FeatureCard";
import { AnimateOnScroll, StaggerChildren } from "@/components/ui/AnimateOnScroll";
import { createPageMetadata, SITE_URL } from "@/lib/metadata";
import { createArticleSchema, serializeJsonLd } from "@/lib/structured-data";

const translations = {
  fr: {
    metaTitle: "Limites de Claude Code",
    metaDescription: "Un tour d'horizon honnete des limites de Claude Code, des comparaisons equilibrees avec Copilot et Cursor, et un guide pour savoir quand ne PAS utiliser cet outil.",
    heroBadge: "Regard honn\u00eate",
    heroTitle: "Conna\u00eetre les",
    heroTitleHighlight: "limites",
    heroSubtitle: "Aucun outil n'est parfait. Comprendre ce que Claude Code ne fait pas bien, c'est l'utiliser l\u00e0 o\u00f9 il brille vraiment. Comparaisons \u00e9quilibr\u00e9es, limites document\u00e9es, z\u00e9ro langue de bois.",
    principlesBadge: "Principes", principlesTitle: "Pourquoi cette section existe", principlesDescription: "La plupart des guides IA ne parlent que des avantages. On a fait le choix inverse : documenter les limites pour que chaque recommandation repose sur une vision realiste.",
    transparencyTitle: "Transparence", transparencyDesc: "Les limites techniques reelles, documentees sans langue de bois. Fenetre de contexte, hallucinations, couts, latence.",
    balanceTitle: "Equilibre", balanceDesc: "Les comparaisons reconnaissent ou Copilot et Cursor font mieux. Pas de marketing, juste les faits.",
    pragmatismTitle: "Pragmatisme", pragmatismDesc: "Pour chaque limite, une strategie de contournement ou une alternative concrete.",
    guidesCount: "4 guides", guidesTitle: "Explorez la section", guidesDescription: "Des limites techniques aux comparaisons avec la concurrence, chaque guide vous donne les cl\u00e9s pour d\u00e9cider en connaissance de cause.",
    readGuide: "Lire le guide",
    subPages: [
      { title: "Limites connues", description: "Fen\u00eatre de contexte, hallucinations, latence, co\u00fbts et support des langages. Les contraintes r\u00e9elles avec des strat\u00e9gies pour chacune." },
      { title: "Claude Code vs GitHub Copilot", description: "Agent CLI vs autocompl\u00e9tion IDE. Deux philosophies diff\u00e9rentes, chacune avec ses forces. Comparaison \u00e9quilibr\u00e9e." },
      { title: "Claude Code vs Cursor", description: "Deux approches agent, deux interfaces. Terminal vs IDE int\u00e9gr\u00e9, MCP vs multi-mod\u00e8le, personnalisation vs exp\u00e9rience visuelle." },
      { title: "Quand ne PAS utiliser Claude Code", description: "Syst\u00e8mes temps r\u00e9el, industries r\u00e9glement\u00e9es, code critique sans revue. Les situations o\u00f9 un autre outil serait plus adapt\u00e9." },
    ],
    ctaBadge: "Et ensuite ?", ctaTitle: "Vous connaissez les limites.", ctaTitleHighlight: "Exploitez les forces.", ctaDescription: "Maintenant que vous savez ce que Claude Code ne fait pas bien, d\u00e9couvrez ce qu'il fait de mieux que les autres.",
    startTitle: "Premiers pas", startDesc: "Installez Claude Code et testez-le sur un vrai projet. Le meilleur moyen de juger, c'est d'essayer.", startLink: "Commencer",
    promptTitle: "Prompting", promptDesc: "Apprenez les techniques pour contourner les limites et obtenir de meilleurs r\u00e9sultats.", promptLink: "Apprendre",
    mcpTitle: "MCP", mcpDesc: "Les MCP comblent certaines limites : acc\u00e8s web, documentation \u00e0 jour, int\u00e9grations externes.", mcpLink: "Explorer les MCP",
  },
  en: {
    metaTitle: "Claude Code Limitations",
    metaDescription: "An honest overview of Claude Code's limitations, balanced comparisons with Copilot and Cursor, and a guide for knowing when NOT to use this tool.",
    heroBadge: "Honest look", heroTitle: "Know the", heroTitleHighlight: "limitations",
    heroSubtitle: "No tool is perfect. Understanding what Claude Code doesn't do well means using it where it truly shines. Balanced comparisons, documented limitations, zero spin.",
    principlesBadge: "Principles", principlesTitle: "Why this section exists", principlesDescription: "Most AI guides only talk about benefits. We chose the opposite: document the limitations so every recommendation is grounded in reality.",
    transparencyTitle: "Transparency", transparencyDesc: "Real technical limitations, documented without spin. Context window, hallucinations, costs, latency.",
    balanceTitle: "Balance", balanceDesc: "Our comparisons acknowledge where Copilot and Cursor do better. No marketing, just facts.",
    pragmatismTitle: "Pragmatism", pragmatismDesc: "For each limitation, a workaround strategy or a concrete alternative.",
    guidesCount: "4 guides", guidesTitle: "Explore this section", guidesDescription: "From technical limitations to competitive comparisons, each guide gives you the knowledge to decide wisely.",
    readGuide: "Read the guide",
    subPages: [
      { title: "Known limitations", description: "Context window, hallucinations, latency, costs, and language support. Real constraints with strategies for each." },
      { title: "Claude Code vs GitHub Copilot", description: "CLI agent vs IDE autocomplete. Two different philosophies, each with strengths. A balanced comparison." },
      { title: "Claude Code vs Cursor", description: "Two agent approaches, two interfaces. Terminal vs integrated IDE, MCP vs multi-model, customization vs visual experience." },
      { title: "When NOT to use Claude Code", description: "Real-time systems, regulated industries, critical code without review. Situations where another tool fits better." },
    ],
    ctaBadge: "What's next?", ctaTitle: "You know the limitations.", ctaTitleHighlight: "Leverage the strengths.", ctaDescription: "Now that you know what Claude Code doesn't do well, discover what it does better than anything else.",
    startTitle: "Getting started", startDesc: "Install Claude Code and test it on a real project. The best way to judge is to try.", startLink: "Start",
    promptTitle: "Prompting", promptDesc: "Learn techniques to work around limitations and get better results.", promptLink: "Learn",
    mcpTitle: "MCP", mcpDesc: "MCPs fill some gaps: web access, up-to-date docs, external integrations.", mcpLink: "Explore MCPs",
  },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params; const t = translations[locale as "fr" | "en"];
  return createPageMetadata({ title: t.metaTitle, description: t.metaDescription, path: `/${locale}/limits`, locale });
}
function buildArticleJsonLd(locale: string) {
  const t = translations[locale as "fr" | "en"];
  return createArticleSchema({ title: t.metaTitle, description: t.metaDescription, url: `${SITE_URL}/${locale}/limits`, locale, datePublished: "2026-03-12", dateModified: "2026-03-12" });
}

const SUB_PAGES = [
  { href: "/limits/known-limitations", icon: AlertTriangle, step: "01", color: "brand" as const },
  { href: "/limits/vs-copilot", icon: GitCompare, step: "02", color: "brand" as const },
  { href: "/limits/vs-cursor", icon: Scale, step: "03", color: "accent" as const },
  { href: "/limits/when-not-to-use", icon: Ban, step: "04", color: "accent" as const },
] as const;
const colorStyles = {
  brand: { iconBg: "bg-brand-500/10", iconText: "text-brand-700 dark:text-brand-400", hoverBorder: "hover:border-brand-500/30", linkText: "text-brand-700 dark:text-brand-400", linkHover: "group-hover:text-brand-600 dark:group-hover:text-brand-300", step: "text-brand-500/40" },
  accent: { iconBg: "bg-accent-500/10", iconText: "text-accent-600 dark:text-accent-400", hoverBorder: "hover:border-accent-500/30", linkText: "text-accent-600 dark:text-accent-400", linkHover: "group-hover:text-accent-500 dark:group-hover:text-accent-300", step: "text-accent-500/40" },
};

export default async function LimitsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params; setRequestLocale(locale);
  const t = translations[locale as "fr" | "en"];
  /* JSON-LD: safe -- static schema from our own constants, serialized via JSON.stringify. No user input. */
  const jsonLdHtml = serializeJsonLd(buildArticleJsonLd(locale));
  return (
    <>
      {/* JSON-LD structured data -- safe: static schema, no user input */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdHtml }} />
      <section className="relative overflow-hidden bg-slate-950"><div className="absolute inset-0 bg-[var(--gradient-hero)]" /><div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(6,182,212,0.15),_transparent_60%)]" /><div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(245,158,11,0.1),_transparent_60%)]" />
        <div className="relative px-4 pb-16 pt-20 sm:px-6 sm:pb-20 sm:pt-28 lg:px-8"><div className="text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-brand-500/10 px-4 py-1.5 text-sm text-brand-300"><Eye className="h-4 w-4" aria-hidden="true" />{t.heroBadge}</div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">{t.heroTitle}{" "}<span className="text-gradient">{t.heroTitleHighlight}</span></h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300 sm:text-xl">{t.heroSubtitle}</p>
        </div></div>
      </section>
      <section className="py-16 sm:py-20"><div className="px-4 sm:px-6 lg:px-0">
        <AnimateOnScroll preset="fade-up"><SectionHeading badge={t.principlesBadge} title={t.principlesTitle} description={t.principlesDescription} /></AnimateOnScroll>
        <StaggerChildren className="mt-16 grid gap-6 sm:grid-cols-3" staggerDelay={0.08}>
          <FeatureCard icon={Eye} title={t.transparencyTitle} description={t.transparencyDesc} gradient="teal" />
          <FeatureCard icon={Scale} title={t.balanceTitle} description={t.balanceDesc} gradient="amber" />
          <FeatureCard icon={Target} title={t.pragmatismTitle} description={t.pragmatismDesc} gradient="green" />
        </StaggerChildren>
      </div></section>
      <section className="bg-slate-50/50 py-16 dark:bg-slate-900/50 sm:py-20"><div className="px-4 sm:px-6 lg:px-0">
        <AnimateOnScroll preset="fade-up"><div className="mb-12 text-center">
          <span className="mb-3 inline-block rounded-full bg-brand-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand-700 dark:text-brand-400">{t.guidesCount}</span>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{t.guidesTitle}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-300">{t.guidesDescription}</p>
        </div></AnimateOnScroll>
        <div className="grid gap-6 sm:grid-cols-2">{SUB_PAGES.map((page, index) => {
          const Icon = page.icon; const styles = colorStyles[page.color]; const subPage = t.subPages[index];
          return (<AnimateOnScroll key={page.href} preset="fade-up"><Link href={`/${locale}${page.href}`} className={`group relative flex flex-col rounded-xl border border-slate-200/50 bg-white/50 p-6 transition-all hover:bg-white hover:shadow-lg dark:border-slate-700/50 dark:bg-slate-800/50 dark:hover:bg-slate-800/80 ${styles.hoverBorder}`}>
            <div className="mb-4 flex items-center justify-between"><div className={`flex h-12 w-12 items-center justify-center rounded-xl ${styles.iconBg}`}><Icon className={`h-6 w-6 ${styles.iconText}`} aria-hidden="true" /></div><span className={`text-3xl font-black ${styles.step}`}>{page.step}</span></div>
            <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">{subPage.title}</h3>
            <p className="mb-4 flex-1 text-sm leading-relaxed text-slate-500 dark:text-slate-300">{subPage.description}</p>
            <div className={`flex items-center gap-1 text-sm font-medium ${styles.linkText} transition-colors ${styles.linkHover}`}>{t.readGuide}<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" /></div>
          </Link></AnimateOnScroll>);
        })}</div>
      </div></section>
      <section className="relative overflow-hidden py-16 sm:py-20"><div className="absolute inset-0 bg-gradient-to-br from-brand-950 via-slate-900 to-brand-900" /><div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(6,182,212,0.12),_transparent_70%)]" />
        <div className="relative px-4 sm:px-6 lg:px-0"><div className="text-center">
          <span className="mb-3 inline-block rounded-full bg-brand-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand-400">{t.ctaBadge}</span>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">{t.ctaTitle}{" "}<span className="text-gradient">{t.ctaTitleHighlight}</span></h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-300">{t.ctaDescription}</p>
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          <Link href={`/${locale}/getting-started`} className="group rounded-xl border border-slate-700/50 bg-slate-800/50 p-6 backdrop-blur transition-all hover:border-brand-500/50 hover:bg-slate-800/80">
            <ShieldX className="mb-3 h-8 w-8 text-brand-400" aria-hidden="true" /><h3 className="mb-2 font-semibold text-white">{t.startTitle}</h3><p className="text-sm leading-relaxed text-slate-400">{t.startDesc}</p>
            <div className="mt-4 flex items-center gap-1 text-sm font-medium text-brand-400 transition-colors group-hover:text-brand-300">{t.startLink}<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" /></div>
          </Link>
          <Link href={`/${locale}/prompting`} className="group rounded-xl border border-slate-700/50 bg-slate-800/50 p-6 backdrop-blur transition-all hover:border-accent-500/50 hover:bg-slate-800/80">
            <Target className="mb-3 h-8 w-8 text-accent-400" aria-hidden="true" /><h3 className="mb-2 font-semibold text-white">{t.promptTitle}</h3><p className="text-sm leading-relaxed text-slate-400">{t.promptDesc}</p>
            <div className="mt-4 flex items-center gap-1 text-sm font-medium text-accent-400 transition-colors group-hover:text-accent-300">{t.promptLink}<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" /></div>
          </Link>
          <Link href={`/${locale}/mcp`} className="group rounded-xl border border-slate-700/50 bg-slate-800/50 p-6 backdrop-blur transition-all hover:border-emerald-500/50 hover:bg-slate-800/80">
            <Scale className="mb-3 h-8 w-8 text-emerald-400" aria-hidden="true" /><h3 className="mb-2 font-semibold text-white">{t.mcpTitle}</h3><p className="text-sm leading-relaxed text-slate-400">{t.mcpDesc}</p>
            <div className="mt-4 flex items-center gap-1 text-sm font-medium text-emerald-400 transition-colors group-hover:text-emerald-300">{t.mcpLink}<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" /></div>
          </Link>
        </div></div>
      </section>
    </>
  );
}
