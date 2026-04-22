import { setRequestLocale } from "next-intl/server";
import Link from "next/link";
import {
  ArrowRight,
  Puzzle,
  Sparkles,
  HelpCircle,
  Wrench,
  Star,
  Palette,
  Shield,
  Cable,
  MessageSquare,
} from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";
import { createPageMetadata, SITE_URL } from "@/lib/metadata";
import { createArticleSchema, serializeJsonLd } from "@/lib/structured-data";

const translations = {
  fr: {
    metaTitle: "Plugins : Etendez les capacites de Claude Code",
    metaDescription: "Decouvrez les plugins Claude Code pour enrichir votre assistant IA. Agents specialises, design, securite, qualite, installez les meilleurs plugins du marketplace.",
    heroBadge: "Plugins",
    heroTitle1: "Les",
    heroTitle2: ": \u00c9tendez",
    heroTitle3: "les capacit\u00e9s de Claude Code",
    heroSubtitle: "Installez des plugins depuis le marketplace pour enrichir Claude Code avec de nouveaux agents, styles de design, outils de s\u00e9curit\u00e9 et workflows automatis\u00e9s.",
    guidesCount: "5 guides",
    guidesTitle: "Explorez les plugins en profondeur",
    guidesDescription: "Des fondamentaux aux plugins sp\u00e9cialis\u00e9s, chaque guide couvre un aspect essentiel de l'\u00e9cosyst\u00e8me plugins. Suivez-les dans l'ordre ou piochez directement celui qui vous int\u00e9resse.",
    readGuide: "Lire le guide",
    subPages: [
      { title: "Comprendre les plugins Claude Code", description: "Qu'est-ce qu'un plugin ? Diff\u00e9rences avec les MCP et Skills, architecture, marketplace et comparaison avec les extensions VS Code." },
      { title: "Installer et g\u00e9rer ses plugins", description: "Commandes /plugin marketplace, install, list, remove. Configuration dans settings et cr\u00e9ation de plugins custom." },
      { title: "Top plugins essentiels 2026", description: "Everything Claude Code, Context7, Prompt Improver, Repomix, Ralph Loop : les plugins fondamentaux pour tout le monde." },
      { title: "Plugins design & frontend", description: "Frontend Design (96K installs), UI UX Pro Max, 21st Magic, Playwright : les plugins pour cr\u00e9er des interfaces professionnelles." },
      { title: "Plugins s\u00e9curit\u00e9 & qualit\u00e9", description: "Security Guidance, Code Review, AgentShield, TDD Guide : s\u00e9curisez et fiabilisez votre code automatiquement." },
    ],
    conceptBadge: "Concept",
    conceptTitle: "Plugin vs MCP vs Skill",
    conceptDescription: "Trois m\u00e9canismes compl\u00e9mentaires pour \u00e9tendre Claude Code.",
    pluginsLabel: "Plugins",
    pluginsDesc: "Des applications install\u00e9es depuis un marketplace. Elles ajoutent des capacit\u00e9s internes : agents, styles, analyseurs.",
    mcpLabel: "MCP",
    mcpDesc: "Des prises USB vers le monde ext\u00e9rieur. Elles connectent Claude Code \u00e0 GitHub, Slack, Gmail, bases de donn\u00e9es.",
    skillsLabel: "Skills",
    skillsDesc: "Des recettes m\u00e9moris\u00e9es. Des instructions Markdown qui enseignent des comportements et workflows \u00e0 Claude Code.",
    nextTitle: "Continuez votre",
    nextTitleHighlight: "apprentissage",
    nextDescription: "Les plugins ne sont qu'une partie de l'\u00e9cosyst\u00e8me. D\u00e9couvrez les MCP pour connecter Claude Code au monde ext\u00e9rieur, et les Skills pour lui enseigner vos workflows.",
    discoverMcp: "D\u00e9couvrir les MCP",
    exploreSkills: "Explorer les Skills",
    masterPrompting: "Ma\u00eetriser le prompting",
  },
  en: {
    metaTitle: "Plugins: Extend Claude Code's capabilities",
    metaDescription: "Discover Claude Code plugins to enrich your AI assistant. Specialized agents, design, security, quality -- install the best plugins from the marketplace.",
    heroBadge: "Plugins",
    heroTitle1: "",
    heroTitle2: ": Extend",
    heroTitle3: "Claude Code's capabilities",
    heroSubtitle: "Install plugins from the marketplace to enrich Claude Code with new agents, design styles, security tools, and automated workflows.",
    guidesCount: "5 guides",
    guidesTitle: "Explore plugins in depth",
    guidesDescription: "From fundamentals to specialized plugins, each guide covers an essential aspect of the plugin ecosystem. Follow them in order or jump to what interests you.",
    readGuide: "Read the guide",
    subPages: [
      { title: "Understanding Claude Code plugins", description: "What is a plugin? Differences with MCPs and Skills, architecture, marketplace, and comparison with VS Code extensions." },
      { title: "Install and manage plugins", description: "/plugin marketplace, install, list, remove commands. Settings configuration and custom plugin creation." },
      { title: "Top essential plugins 2026", description: "Everything Claude Code, Context7, Prompt Improver, Repomix, Ralph Loop: must-have plugins for everyone." },
      { title: "Design & frontend plugins", description: "Frontend Design (96K installs), UI UX Pro Max, 21st Magic, Playwright: plugins for professional interfaces." },
      { title: "Security & quality plugins", description: "Security Guidance, Code Review, AgentShield, TDD Guide: secure and harden your code automatically." },
    ],
    conceptBadge: "Concept",
    conceptTitle: "Plugin vs MCP vs Skill",
    conceptDescription: "Three complementary mechanisms to extend Claude Code.",
    pluginsLabel: "Plugins",
    pluginsDesc: "Applications installed from a marketplace. They add internal capabilities: agents, styles, analyzers.",
    mcpLabel: "MCP",
    mcpDesc: "USB ports to the outside world. They connect Claude Code to GitHub, Slack, Gmail, databases.",
    skillsLabel: "Skills",
    skillsDesc: "Memorized recipes. Markdown instructions that teach behaviors and workflows to Claude Code.",
    nextTitle: "Continue your",
    nextTitleHighlight: "learning journey",
    nextDescription: "Plugins are just one part of the ecosystem. Discover MCPs to connect Claude Code to the outside world, and Skills to teach it your workflows.",
    discoverMcp: "Discover MCPs",
    exploreSkills: "Explore Skills",
    masterPrompting: "Master prompting",
  },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = translations[locale as "fr" | "en"];
  return createPageMetadata({ title: t.metaTitle, description: t.metaDescription, path: `/${locale}/plugins`, locale });
}

function buildArticleJsonLd(locale: string) {
  const t = translations[locale as "fr" | "en"];
  return createArticleSchema({ title: t.metaTitle, description: t.metaDescription, url: `${SITE_URL}/${locale}/plugins`, locale, datePublished: "2026-03-09", dateModified: "2026-03-09" });
}

const SUB_PAGES = [
  { href: "/plugins/what-are-plugins", icon: HelpCircle, step: "01", color: "brand" as const },
  { href: "/plugins/setup", icon: Wrench, step: "02", color: "brand" as const },
  { href: "/plugins/best-essential", icon: Star, step: "03", color: "accent" as const },
  { href: "/plugins/best-design", icon: Palette, step: "04", color: "accent" as const },
  { href: "/plugins/best-security", icon: Shield, step: "05", color: "brand" as const },
] as const;

const colorStyles = {
  brand: { iconBg: "bg-brand-500/10", iconText: "text-brand-700 dark:text-brand-400", hoverBorder: "hover:border-brand-500/30", linkText: "text-brand-700 dark:text-brand-400", linkHover: "group-hover:text-brand-600 dark:group-hover:text-brand-300", step: "text-brand-500/40" },
  accent: { iconBg: "bg-accent-500/10", iconText: "text-accent-600 dark:text-accent-400", hoverBorder: "hover:border-accent-500/30", linkText: "text-accent-600 dark:text-accent-400", linkHover: "group-hover:text-accent-500 dark:group-hover:text-accent-300", step: "text-accent-500/40" },
};

export default async function PluginsPage({ params }: Readonly<{ params: Promise<{ locale: string }> }>) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = translations[locale as "fr" | "en"];
  /*
   * JSON-LD: safe -- static schema from our own constants,
   * serialized via JSON.stringify. No user input.
   */
  const jsonLdHtml = serializeJsonLd(buildArticleJsonLd(locale));
  return (
    <>
      {/* JSON-LD structured data -- safe: static schema via JSON.stringify */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdHtml }} />
      <section className="relative overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-[var(--gradient-hero)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(6,182,212,0.15),_transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(245,158,11,0.1),_transparent_60%)]" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-20 sm:px-6 sm:pb-28 sm:pt-28 lg:px-8 lg:pb-32 lg:pt-32">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-brand-500/10 px-4 py-1.5 text-sm text-brand-300">
              <Puzzle className="h-4 w-4" aria-hidden="true" />{t.heroBadge}
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl">
              {t.heroTitle1} <span className="text-gradient">Plugins</span>{t.heroTitle2}<br />{t.heroTitle3}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300 sm:text-xl">{t.heroSubtitle}</p>
          </div>
        </div>
      </section>
      <section className="py-16 sm:py-20">
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
              const Icon = page.icon; const styles = colorStyles[page.color]; const subPage = t.subPages[index];
              return (
                <AnimateOnScroll key={page.href} preset="fade-up">
                  <Link href={`/${locale}${page.href}`} className={`group relative flex flex-col rounded-xl border border-slate-200/50 bg-white/50 p-6 transition-all hover:bg-white hover:shadow-lg dark:border-slate-700/50 dark:bg-slate-800/50 dark:hover:bg-slate-800/80 ${styles.hoverBorder}`}>
                    <div className="mb-4 flex items-center justify-between">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${styles.iconBg}`}><Icon className={`h-6 w-6 ${styles.iconText}`} aria-hidden="true" /></div>
                      <span className={`text-3xl font-black ${styles.step}`}>{page.step}</span>
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">{subPage.title}</h3>
                    <p className="mb-4 flex-1 text-sm leading-relaxed text-slate-500 dark:text-slate-300">{subPage.description}</p>
                    <div className={`flex items-center gap-1 text-sm font-medium ${styles.linkText} transition-colors ${styles.linkHover}`}>
                      {t.readGuide}<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                    </div>
                  </Link>
                </AnimateOnScroll>
              );
            })}
          </div>
        </div>
      </section>
      <section className="bg-slate-50/50 py-20 dark:bg-slate-900/50 sm:py-28">
        <div className="px-4 sm:px-6 lg:px-0">
          <AnimateOnScroll preset="fade-up">
            <SectionHeading badge={t.conceptBadge} title={t.conceptTitle} description={t.conceptDescription} />
          </AnimateOnScroll>
          <div className="mt-16">
            <div className="grid gap-6 sm:grid-cols-3">
              <div className="glass-card p-6 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500/20 to-brand-500/5"><Puzzle className="h-7 w-7 text-brand-700 dark:text-brand-400" aria-hidden="true" /></div>
                <h4 className="mb-2 font-semibold">{t.pluginsLabel}</h4>
                <p className="text-sm text-slate-500 dark:text-slate-300">{t.pluginsDesc}</p>
              </div>
              <div className="glass-card p-6 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-accent-500/20 to-accent-500/5"><Cable className="h-7 w-7 text-accent-500" aria-hidden="true" /></div>
                <h4 className="mb-2 font-semibold">{t.mcpLabel}</h4>
                <p className="text-sm text-slate-500 dark:text-slate-300">{t.mcpDesc}</p>
              </div>
              <div className="glass-card p-6 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/5"><Sparkles className="h-7 w-7 text-emerald-500" aria-hidden="true" /></div>
                <h4 className="mb-2 font-semibold">{t.skillsLabel}</h4>
                <p className="text-sm text-slate-500 dark:text-slate-300">{t.skillsDesc}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="relative overflow-hidden py-20 sm:py-28">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-950 via-slate-900 to-brand-900" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(6,182,212,0.15),_transparent_70%)]" />
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl">{t.nextTitle}{" "}<span className="text-gradient">{t.nextTitleHighlight}</span></h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300">{t.nextDescription}</p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href={`/${locale}/mcp`} className="group inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-sm font-semibold text-slate-900 shadow-lg transition-all hover:bg-slate-100">
              <Cable className="h-4 w-4" aria-hidden="true" />{t.discoverMcp}<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
            <Link href={`/${locale}/skills`} className="inline-flex items-center gap-2 rounded-xl border border-slate-600 px-8 py-3.5 text-sm font-semibold text-white transition-all hover:border-slate-500 hover:bg-white/5">
              <Sparkles className="h-4 w-4" aria-hidden="true" />{t.exploreSkills}
            </Link>
            <Link href={`/${locale}/prompting`} className="inline-flex items-center gap-2 rounded-xl border border-slate-600 px-8 py-3.5 text-sm font-semibold text-white transition-all hover:border-slate-500 hover:bg-white/5">
              <MessageSquare className="h-4 w-4" aria-hidden="true" />{t.masterPrompting}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
