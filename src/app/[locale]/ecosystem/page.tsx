import { setRequestLocale } from "next-intl/server";
import Link from "next/link";
import {
  ArrowRight,
  Star,
  Sparkles,
  Puzzle,
  Server,
  Compass,
  TrendingUp,
  Network,
} from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FeatureCard } from "@/components/ui/FeatureCard";
import { AnimateOnScroll, StaggerChildren } from "@/components/ui/AnimateOnScroll";
import { createPageMetadata, SITE_URL } from "@/lib/metadata";
import { createArticleSchema, serializeJsonLd } from "@/lib/structured-data";

const translations = {
  fr: {
    metaTitle: "Écosystème Claude Code : repos, skills, plugins, MCP",
    metaDescription: "Le hub francophone de l'écosystème Claude Code. Top repos GitHub, awesome skills, plugins officiels Anthropic et serveurs MCP soigneusement curés.",
    heroBadge: "Hub écosystème",
    heroTitle: "L'écosystème",
    heroTitleHighlight: "Claude Code",
    heroSubtitle: "Un inventaire francophone des meilleurs outils, repos et ressources qui gravitent autour de Claude Code. Curé à la main, mis à jour mensuellement.",
    principlesBadge: "Pourquoi cette section",
    principlesTitle: "Une carte pour ne pas s'y perdre",
    principlesDescription: "L'écosystème Claude Code a explosé en 2026. Des centaines de repos, skills, plugins et serveurs MCP émergent chaque mois. Cette section vous donne la carte.",
    curationTitle: "Curation",
    curationDesc: "On filtre par étoiles GitHub mais aussi par qualité réelle d'usage. Pas de listing à la chaîne, chaque entrée a une fiche.",
    contextTitle: "Contexte",
    contextDesc: "Pour chaque outil, on explique à qui il s'adresse, ce qu'il remplace et la décision « adopter ou pas ».",
    freshnessTitle: "Fraîcheur",
    freshnessDesc: "Mise à jour mensuelle. Les outils morts ou abandonnés sont retirés, les nouveaux entrants intégrés.",
    hubsCount: "4 hubs",
    hubsTitle: "Explorez les hubs",
    hubsDescription: "Quatre points d'entrée selon ce que vous cherchez : repos GitHub trending, skills réutilisables, plugins officiels, ou serveurs MCP par catégorie.",
    readGuide: "Explorer",
    subPages: [
      { title: "Top repos GitHub", description: "30+ repos curés par catégorie : harness, awesome lists, mémoire, optimisation tokens, templates, multi-agents, hooks." },
      { title: "Awesome Skills", description: "Compilation des meilleurs skills publics. Des skills design (Impeccable, UI UX Pro Max) aux skills code et productivité." },
      { title: "Awesome Plugins", description: "Marketplace officielle Anthropic + écosystème community. Tri par cas d'usage et niveau de maintenance." },
      { title: "Awesome MCP Servers", description: "Serveurs MCP par catégorie : data, design, dev, security. Avec note d'usage et compatibilité." },
    ],
    comingSoonBadge: "À venir",
    comingSoonNote: "Ces hubs sont publiés progressivement (ECO-2 à ECO-5). En attendant, suivez la roadmap dans le backlog du projet.",
    ctaBadge: "Et ensuite ?",
    ctaTitle: "Une fois exploré,",
    ctaTitleHighlight: "passez à l'action.",
    ctaDescription: "L'inventaire ne sert à rien si vous ne testez pas. Choisissez 1 outil et utilisez-le sur un vrai projet cette semaine.",
    skillsTitle: "Skills",
    skillsDesc: "Les skills déjà couverts en profondeur sur le Codex, avec workflow et cas d'usage concrets.",
    skillsLink: "Voir les skills",
    mcpTitle: "MCP",
    mcpDesc: "L'architecture MCP expliquée + les serveurs les plus utiles au quotidien.",
    mcpLink: "Comprendre les MCP",
    pluginsTitle: "Plugins",
    pluginsDesc: "Les plugins officiels Anthropic, leur installation et leur configuration.",
    pluginsLink: "Découvrir les plugins",
  },
  en: {
    metaTitle: "Claude Code ecosystem: repos, skills, plugins, MCP",
    metaDescription: "The hub for the Claude Code ecosystem. Top GitHub repos, awesome skills, official Anthropic plugins, and carefully curated MCP servers.",
    heroBadge: "Ecosystem hub",
    heroTitle: "The Claude Code",
    heroTitleHighlight: "ecosystem",
    heroSubtitle: "A curated inventory of the best tools, repos, and resources orbiting around Claude Code. Hand-picked, refreshed monthly.",
    principlesBadge: "Why this section",
    principlesTitle: "A map so you don't get lost",
    principlesDescription: "The Claude Code ecosystem exploded in 2026. Hundreds of repos, skills, plugins, and MCP servers emerge every month. This section is your map.",
    curationTitle: "Curation",
    curationDesc: "We filter by GitHub stars but also by real-world quality. No bulk listing — every entry gets a fiche.",
    contextTitle: "Context",
    contextDesc: "For each tool, we explain who it's for, what it replaces, and whether to adopt it or pass.",
    freshnessTitle: "Freshness",
    freshnessDesc: "Refreshed monthly. Dead or abandoned tools are removed, new entrants are added.",
    hubsCount: "4 hubs",
    hubsTitle: "Explore the hubs",
    hubsDescription: "Four entry points depending on what you're looking for: trending GitHub repos, reusable skills, official plugins, or MCP servers by category.",
    readGuide: "Explore",
    subPages: [
      { title: "Top GitHub repos", description: "30+ repos curated by category: harness, awesome lists, memory, token optimization, templates, multi-agents, hooks." },
      { title: "Awesome Skills", description: "Compilation of the best public skills. From design skills (Impeccable, UI UX Pro Max) to code and productivity skills." },
      { title: "Awesome Plugins", description: "Official Anthropic marketplace + community ecosystem. Sorted by use case and maintenance level." },
      { title: "Awesome MCP Servers", description: "MCP servers by category: data, design, dev, security. With usage notes and compatibility." },
    ],
    comingSoonBadge: "Coming soon",
    comingSoonNote: "These hubs are released progressively (ECO-2 to ECO-5). In the meantime, follow the project backlog roadmap.",
    ctaBadge: "What's next?",
    ctaTitle: "Once explored,",
    ctaTitleHighlight: "take action.",
    ctaDescription: "The inventory is useless if you don't test. Pick 1 tool and use it on a real project this week.",
    skillsTitle: "Skills",
    skillsDesc: "Skills already covered in depth on the Codex, with workflow and concrete use cases.",
    skillsLink: "View skills",
    mcpTitle: "MCP",
    mcpDesc: "The MCP architecture explained + the most useful servers for daily work.",
    mcpLink: "Understand MCP",
    pluginsTitle: "Plugins",
    pluginsDesc: "Official Anthropic plugins, their installation, and configuration.",
    pluginsLink: "Discover plugins",
  },
};

const SUB_PAGES = [
  { href: "/ecosystem/top-repos-github", icon: Star, step: "01", color: "brand" as const },
  { href: "/ecosystem/awesome-skills", icon: Sparkles, step: "02", color: "accent" as const },
  { href: "/ecosystem/awesome-plugins", icon: Puzzle, step: "03", color: "brand" as const },
  { href: "/ecosystem/awesome-mcp-servers", icon: Server, step: "04", color: "accent" as const },
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

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = translations[locale as "fr" | "en"];
  return createPageMetadata({
    title: t.metaTitle,
    description: t.metaDescription,
    path: `/${locale}/ecosystem`,
    locale,
  });
}

function buildArticleJsonLd(locale: string) {
  const t = translations[locale as "fr" | "en"];
  return createArticleSchema({
    title: t.metaTitle,
    description: t.metaDescription,
    url: `${SITE_URL}/${locale}/ecosystem`,
    locale,
    datePublished: "2026-05-11",
    dateModified: "2026-05-11",
  });
}

export default async function EcosystemPage({
  params,
}: Readonly<{ params: Promise<{ locale: string }> }>) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = translations[locale as "fr" | "en"];
  const jsonLdHtml = serializeJsonLd(buildArticleJsonLd(locale));

  return (
    <>
      {/* JSON-LD structured data — safe: static schema, no user input */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdHtml }} />

      <section className="relative overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-[var(--gradient-hero)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(6,182,212,0.15),_transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(245,158,11,0.1),_transparent_60%)]" />
        <div className="relative px-4 pb-16 pt-20 sm:px-6 sm:pb-20 sm:pt-28 lg:px-8">
          <div className="text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-brand-500/10 px-4 py-1.5 text-sm text-brand-300">
              <Compass className="h-4 w-4" aria-hidden="true" />
              {t.heroBadge}
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              {t.heroTitle} <span className="text-gradient">{t.heroTitleHighlight}</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300 sm:text-xl">
              {t.heroSubtitle}
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="px-4 sm:px-6 lg:px-0">
          <AnimateOnScroll preset="fade-up">
            <SectionHeading
              badge={t.principlesBadge}
              title={t.principlesTitle}
              description={t.principlesDescription}
            />
          </AnimateOnScroll>
          <StaggerChildren className="mt-16 grid gap-6 sm:grid-cols-3" staggerDelay={0.08}>
            <FeatureCard icon={Network} title={t.curationTitle} description={t.curationDesc} gradient="teal" />
            <FeatureCard icon={Compass} title={t.contextTitle} description={t.contextDesc} gradient="amber" />
            <FeatureCard icon={TrendingUp} title={t.freshnessTitle} description={t.freshnessDesc} gradient="green" />
          </StaggerChildren>
        </div>
      </section>

      <section className="bg-slate-50/50 py-16 dark:bg-slate-900/50 sm:py-20">
        <div className="px-4 sm:px-6 lg:px-0">
          <AnimateOnScroll preset="fade-up">
            <div className="mb-12 text-center">
              <span className="mb-3 inline-block rounded-full bg-brand-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand-700 dark:text-brand-400">
                {t.hubsCount}
              </span>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{t.hubsTitle}</h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-300">
                {t.hubsDescription}
              </p>
              <span className="mt-6 inline-block rounded-full border border-accent-500/30 bg-accent-500/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-accent-700 dark:text-accent-400">
                {t.comingSoonBadge}
              </span>
              <p className="mx-auto mt-3 max-w-xl text-sm text-slate-500 dark:text-slate-400">
                {t.comingSoonNote}
              </p>
            </div>
          </AnimateOnScroll>
          <div className="grid gap-6 sm:grid-cols-2">
            {SUB_PAGES.map((page, index) => {
              const Icon = page.icon;
              const styles = colorStyles[page.color];
              const subPage = t.subPages[index];
              return (
                <AnimateOnScroll key={page.href} preset="fade-up">
                  <div
                    className={`group relative flex flex-col rounded-xl border border-slate-200/50 bg-white/50 p-6 opacity-70 dark:border-slate-700/50 dark:bg-slate-800/50`}
                    aria-disabled="true"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${styles.iconBg}`}>
                        <Icon className={`h-6 w-6 ${styles.iconText}`} aria-hidden="true" />
                      </div>
                      <span className={`text-3xl font-black ${styles.step}`}>{page.step}</span>
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">
                      {subPage.title}
                    </h3>
                    <p className="mb-4 flex-1 text-sm leading-relaxed text-slate-500 dark:text-slate-300">
                      {subPage.description}
                    </p>
                    <div className={`flex items-center gap-1 text-sm font-medium ${styles.linkText}`}>
                      {t.comingSoonBadge}
                    </div>
                  </div>
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
            <span className="mb-3 inline-block rounded-full bg-brand-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand-400">
              {t.ctaBadge}
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              {t.ctaTitle} <span className="text-gradient">{t.ctaTitleHighlight}</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-300">{t.ctaDescription}</p>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            <Link
              href={`/${locale}/skills`}
              className="group rounded-xl border border-slate-700/50 bg-slate-800/50 p-6 backdrop-blur transition-all hover:border-brand-500/50 hover:bg-slate-800/80"
            >
              <Sparkles className="mb-3 h-8 w-8 text-brand-400" aria-hidden="true" />
              <h3 className="mb-2 font-semibold text-white">{t.skillsTitle}</h3>
              <p className="text-sm leading-relaxed text-slate-400">{t.skillsDesc}</p>
              <div className="mt-4 flex items-center gap-1 text-sm font-medium text-brand-400 transition-colors group-hover:text-brand-300">
                {t.skillsLink}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </div>
            </Link>
            <Link
              href={`/${locale}/mcp`}
              className="group rounded-xl border border-slate-700/50 bg-slate-800/50 p-6 backdrop-blur transition-all hover:border-accent-500/50 hover:bg-slate-800/80"
            >
              <Server className="mb-3 h-8 w-8 text-accent-400" aria-hidden="true" />
              <h3 className="mb-2 font-semibold text-white">{t.mcpTitle}</h3>
              <p className="text-sm leading-relaxed text-slate-400">{t.mcpDesc}</p>
              <div className="mt-4 flex items-center gap-1 text-sm font-medium text-accent-400 transition-colors group-hover:text-accent-300">
                {t.mcpLink}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </div>
            </Link>
            <Link
              href={`/${locale}/plugins`}
              className="group rounded-xl border border-slate-700/50 bg-slate-800/50 p-6 backdrop-blur transition-all hover:border-emerald-500/50 hover:bg-slate-800/80"
            >
              <Puzzle className="mb-3 h-8 w-8 text-emerald-400" aria-hidden="true" />
              <h3 className="mb-2 font-semibold text-white">{t.pluginsTitle}</h3>
              <p className="text-sm leading-relaxed text-slate-400">{t.pluginsDesc}</p>
              <div className="mt-4 flex items-center gap-1 text-sm font-medium text-emerald-400 transition-colors group-hover:text-emerald-300">
                {t.pluginsLink}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </div>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
