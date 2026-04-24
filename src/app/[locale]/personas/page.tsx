import { setRequestLocale } from "next-intl/server";
import Link from "next/link";
import { ArrowRight, Code, Users, UserCircle, Briefcase, GraduationCap, Compass, Sparkles } from "lucide-react";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";
import { createPageMetadata, SITE_URL } from "@/lib/metadata";
import { createArticleSchema, serializeJsonLd } from "@/lib/structured-data";

const translations = {
  fr: {
    metaTitle: "Parcours personas : trouvez votre chemin",
    metaDescription: "Cinq parcours de lecture adaptes a votre profil. Developpeur, lead technique, non-developpeur, freelance ou etudiant : suivez le guide qui vous correspond.",
    heroBadge: "Parcours guid\u00e9s", heroTitle: "Trouvez votre", heroTitleHighlight: "parcours",
    heroSubtitle: "Cinq profils, cinq itin\u00e9raires de lecture. Choisissez celui qui correspond \u00e0 votre situation et suivez les \u00e9tapes dans l'ordre. Pas besoin de tout lire : concentrez-vous sur ce qui compte pour vous.",
    guidesCount: "5 parcours", guidesTitle: "Quel profil vous correspond ?",
    guidesDescription: "Chaque parcours propose un itin\u00e9raire structur\u00e9 \u00e0 travers les pages du site. Suivez les \u00e9tapes ou piochez directement ce qui vous int\u00e9resse.",
    followPath: "Suivre ce parcours",
    subPages: [
      { title: "Le d\u00e9veloppeur", description: "Installation, prompting, MCP, agents et techniques avanc\u00e9es. Le parcours complet pour coder plus vite avec Claude Code." },
      { title: "Le lead technique", description: "Adoption d'\u00e9quipe, gouvernance, s\u00e9curit\u00e9, CI/CD et Skills. Tout pour d\u00e9ployer Claude Code dans votre organisation." },
      { title: "Le non-d\u00e9veloppeur", description: "Pr\u00e9-requis, premiers pas, FAQ et templates de prompting. Un parcours progressif pour ceux qui partent de z\u00e9ro." },
      { title: "Le freelance", description: "Productivit\u00e9, plugins, automatisation et workflows MCP. Chaque heure \u00e9conomis\u00e9e est une heure gagn\u00e9e." },
      { title: "L'\u00e9tudiant", description: "Fondamentaux, projets pratiques et bonnes pratiques professionnelles. Apprenez \u00e0 coder avec un tuteur IA." },
    ],
    ctaBadge: "Pas encore d\u00e9cid\u00e9 ?", ctaTitle: "Commencez par les", ctaTitleHighlight: "fondamentaux",
    ctaDescription: "Si aucun profil ne vous correspond parfaitement, commencez par la section \"Premiers pas\". Elle couvre l'essentiel pour tout le monde.",
    startTitle: "Premiers pas", startDesc: "Le guide universel : installation, configuration et premier projet. Adapt\u00e9 \u00e0 tous les niveaux.", startLink: "Commencer ici",
    configTitle: "Configurateur", configDesc: "G\u00e9n\u00e9rez une configuration Claude Code sur mesure en r\u00e9pondant \u00e0 quelques questions simples.", configLink: "Configurer",
  },
  en: {
    metaTitle: "Persona paths: find your way",
    metaDescription: "Five reading paths tailored to your profile. Developer, tech lead, non-developer, freelancer, or student: follow the guide that fits you.",
    heroBadge: "Guided paths", heroTitle: "Find your", heroTitleHighlight: "path",
    heroSubtitle: "Five profiles, five reading journeys. Pick the one that matches your situation and follow the steps in order. No need to read everything: focus on what matters to you.",
    guidesCount: "5 paths", guidesTitle: "Which profile fits you?",
    guidesDescription: "Each path offers a structured journey through the site. Follow the steps or jump straight to what interests you.",
    followPath: "Follow this path",
    subPages: [
      { title: "The developer", description: "Installation, prompting, MCPs, agents, and advanced techniques. The full path to code faster with Claude Code." },
      { title: "The tech lead", description: "Team adoption, governance, security, CI/CD, and Skills. Everything to deploy Claude Code in your organization." },
      { title: "The non-developer", description: "Prerequisites, first steps, FAQ, and prompting templates. A progressive path for those starting from scratch." },
      { title: "The freelancer", description: "Productivity, plugins, automation, and MCP workflows. Every hour saved is an hour earned." },
      { title: "The student", description: "Fundamentals, hands-on projects, and professional best practices. Learn to code with an AI tutor." },
    ],
    ctaBadge: "Not sure yet?", ctaTitle: "Start with the", ctaTitleHighlight: "fundamentals",
    ctaDescription: "If no profile fits perfectly, start with the \"Getting Started\" section. It covers the essentials for everyone.",
    startTitle: "Getting started", startDesc: "The universal guide: installation, configuration, and first project. Suitable for all levels.", startLink: "Start here",
    configTitle: "Configurator", configDesc: "Generate a custom Claude Code configuration by answering a few simple questions.", configLink: "Configure",
  },
};

const coursesJsonLd = { "@context": "https://schema.org", "@type": "ItemList", itemListElement: [
  { "@type": "Course", position: 1, name: "Parcours Developpeur", description: "Installation, prompting, MCP, agents et techniques avancees.", url: `${SITE_URL}/personas/developer`, provider: { "@type": "Organization", name: "The Claude Codex" }, inLanguage: "fr-FR" },
  { "@type": "Course", position: 2, name: "Parcours Lead Technique", description: "Adoption d'equipe, gouvernance, securite, CI/CD et Skills.", url: `${SITE_URL}/personas/team-lead`, provider: { "@type": "Organization", name: "The Claude Codex" }, inLanguage: "fr-FR" },
  { "@type": "Course", position: 3, name: "Parcours Non-developpeur", description: "Pre-requis, premiers pas, FAQ et templates de prompting.", url: `${SITE_URL}/personas/non-dev`, provider: { "@type": "Organization", name: "The Claude Codex" }, inLanguage: "fr-FR" },
  { "@type": "Course", position: 4, name: "Parcours Freelance", description: "Productivite, plugins, automatisation et workflows MCP.", url: `${SITE_URL}/personas/freelance`, provider: { "@type": "Organization", name: "The Claude Codex" }, inLanguage: "fr-FR" },
  { "@type": "Course", position: 5, name: "Parcours Etudiant", description: "Fondamentaux, projets pratiques et bonnes pratiques.", url: `${SITE_URL}/personas/student`, provider: { "@type": "Organization", name: "The Claude Codex" }, inLanguage: "fr-FR" },
] };
const coursesJsonLdHtml = serializeJsonLd(coursesJsonLd);

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params; const t = translations[locale as "fr" | "en"];
  return createPageMetadata({ title: t.metaTitle, description: t.metaDescription, path: `/${locale}/personas`, locale });
}
function buildArticleJsonLd(locale: string) {
  const t = translations[locale as "fr" | "en"];
  return createArticleSchema({ title: t.metaTitle, description: t.metaDescription, url: `${SITE_URL}/${locale}/personas`, locale, datePublished: "2026-03-12", dateModified: "2026-03-12" });
}

const SUB_PAGES = [
  { href: "/personas/developer", icon: Code, step: "01", color: "brand" as const },
  { href: "/personas/team-lead", icon: Users, step: "02", color: "brand" as const },
  { href: "/personas/non-dev", icon: UserCircle, step: "03", color: "accent" as const },
  { href: "/personas/freelance", icon: Briefcase, step: "04", color: "accent" as const },
  { href: "/personas/student", icon: GraduationCap, step: "05", color: "brand" as const },
] as const;
const colorStyles = {
  brand: { iconBg: "bg-brand-500/10", iconText: "text-brand-700 dark:text-brand-400", hoverBorder: "hover:border-brand-500/30", linkText: "text-brand-700 dark:text-brand-400", linkHover: "group-hover:text-brand-600 dark:group-hover:text-brand-300", step: "text-brand-500/40" },
  accent: { iconBg: "bg-accent-500/10", iconText: "text-accent-600 dark:text-accent-400", hoverBorder: "hover:border-accent-500/30", linkText: "text-accent-600 dark:text-accent-400", linkHover: "group-hover:text-accent-500 dark:group-hover:text-accent-300", step: "text-accent-500/40" },
};

export default async function PersonasPage({ params }: Readonly<{ params: Promise<{ locale: string }> }>) {
  const { locale } = await params; setRequestLocale(locale);
  const t = translations[locale as "fr" | "en"];
  /* JSON-LD: safe -- static schema, no user input */
  const articleJsonLdHtml = serializeJsonLd(buildArticleJsonLd(locale));
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: articleJsonLdHtml }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: coursesJsonLdHtml }} />
      <section className="relative overflow-hidden bg-slate-950"><div className="absolute inset-0 bg-[var(--gradient-hero)]" /><div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(6,182,212,0.15),_transparent_60%)]" /><div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(245,158,11,0.1),_transparent_60%)]" />
        <div className="relative px-4 pb-16 pt-20 sm:px-6 sm:pb-20 sm:pt-28 lg:px-8"><div className="text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-brand-500/10 px-4 py-1.5 text-sm text-brand-300"><Compass className="h-4 w-4" aria-hidden="true" />{t.heroBadge}</div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">{t.heroTitle}{" "}<span className="text-gradient">{t.heroTitleHighlight}</span></h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300 sm:text-xl">{t.heroSubtitle}</p>
        </div></div>
      </section>
      <section className="py-16 sm:py-20"><div className="px-4 sm:px-6 lg:px-0">
        <AnimateOnScroll preset="fade-up"><div className="mb-12 text-center">
          <span className="mb-3 inline-block rounded-full bg-brand-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand-700 dark:text-brand-400">{t.guidesCount}</span>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{t.guidesTitle}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-300">{t.guidesDescription}</p>
        </div></AnimateOnScroll>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{SUB_PAGES.map((page, index) => {
          const Icon = page.icon; const styles = colorStyles[page.color]; const subPage = t.subPages[index];
          return (<AnimateOnScroll key={page.href} preset="fade-up"><Link href={`/${locale}${page.href}`} className={`group relative flex flex-col rounded-xl border border-slate-200/50 bg-white/50 p-6 transition-all hover:bg-white hover:shadow-lg dark:border-slate-700/50 dark:bg-slate-800/50 dark:hover:bg-slate-800/80 ${styles.hoverBorder}`}>
            <div className="mb-4 flex items-center justify-between"><div className={`flex h-12 w-12 items-center justify-center rounded-xl ${styles.iconBg}`}><Icon className={`h-6 w-6 ${styles.iconText}`} aria-hidden="true" /></div><span className={`text-3xl font-black ${styles.step}`}>{page.step}</span></div>
            <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">{subPage.title}</h3>
            <p className="mb-4 flex-1 text-sm leading-relaxed text-slate-500 dark:text-slate-300">{subPage.description}</p>
            <div className={`flex items-center gap-1 text-sm font-medium ${styles.linkText} transition-colors ${styles.linkHover}`}>{t.followPath}<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" /></div>
          </Link></AnimateOnScroll>);
        })}</div>
      </div></section>
      <section className="relative overflow-hidden py-16 sm:py-20"><div className="absolute inset-0 bg-gradient-to-br from-brand-950 via-slate-900 to-brand-900" /><div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(6,182,212,0.12),_transparent_70%)]" />
        <div className="relative px-4 sm:px-6 lg:px-0"><div className="text-center">
          <span className="mb-3 inline-block rounded-full bg-brand-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand-400">{t.ctaBadge}</span>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">{t.ctaTitle}{" "}<span className="text-gradient">{t.ctaTitleHighlight}</span></h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-300">{t.ctaDescription}</p>
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          <Link href={`/${locale}/getting-started`} className="group rounded-xl border border-slate-700/50 bg-slate-800/50 p-6 backdrop-blur transition-all hover:border-brand-500/50 hover:bg-slate-800/80">
            <Sparkles className="mb-3 h-8 w-8 text-brand-400" aria-hidden="true" /><h3 className="mb-2 font-semibold text-white">{t.startTitle}</h3><p className="text-sm leading-relaxed text-slate-400">{t.startDesc}</p>
            <div className="mt-4 flex items-center gap-1 text-sm font-medium text-brand-400 transition-colors group-hover:text-brand-300">{t.startLink}<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" /></div>
          </Link>
          <Link href={`/${locale}/configurator`} className="group rounded-xl border border-slate-700/50 bg-slate-800/50 p-6 backdrop-blur transition-all hover:border-accent-500/50 hover:bg-slate-800/80">
            <Compass className="mb-3 h-8 w-8 text-accent-400" aria-hidden="true" /><h3 className="mb-2 font-semibold text-white">{t.configTitle}</h3><p className="text-sm leading-relaxed text-slate-400">{t.configDesc}</p>
            <div className="mt-4 flex items-center gap-1 text-sm font-medium text-accent-400 transition-colors group-hover:text-accent-300">{t.configLink}<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" /></div>
          </Link>
        </div></div>
      </section>
    </>
  );
}
