import { setRequestLocale } from "next-intl/server";
import Link from "next/link";
import {
  ArrowRight,
  Terminal,
  Download,
  Settings,
  BookOpen,
  Puzzle,
  MessageSquare,
  Sparkles,
  Rocket,
} from "lucide-react";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";
import { createPageMetadata, SITE_URL } from "@/lib/metadata";
import {
  createHowToSchema,
  serializeJsonLd,
} from "@/lib/structured-data";

const translations = {
  fr: {
    metaTitle: "Premiers pas avec Claude Code",
    metaDescription:
      "Guide complet pour installer, configurer et utiliser Claude Code. De zéro à votre premier projet en quelques minutes.",
    howToTitle: "Premiers pas avec Claude Code",
    howToDescription:
      "Guide complet pour installer, configurer et utiliser Claude Code.",
    steps: [
      {
        name: "Découvrir Claude Code",
        text: "Comprendre ce qu'est Claude Code, à qui il s'adresse et ce qui le différencie des autres outils.",
      },
      {
        name: "Installer les prérequis et Claude Code",
        text: "Installer Node.js et exécuter la commande npm install -g @anthropic-ai/claude-code.",
      },
      {
        name: "Configurer votre environnement",
        text: "Configurer votre clé API, le fichier settings.json et le fichier CLAUDE.md.",
      },
      {
        name: "Créer votre premier projet",
        text: "Lancer Claude Code dans un dossier et créer un site web complet en 5 minutes.",
      },
    ],
    heroBadge: "Guide pas \u00e0 pas",
    heroTitle: "Premiers pas avec",
    heroSubtitle:
      "Vous \u00eates au bon endroit. Que vous soyez d\u00e9veloppeur exp\u00e9riment\u00e9 ou que vous n\u0027ayez jamais ouvert un terminal, ce guide vous accompagne de l\u0027installation \u00e0 votre premier projet concret. Pas de jargon inutile, juste l\u0027essentiel.",
    guidesCount: "4 guides",
    guidesTitle: "Suivez le parcours",
    guidesDescription:
      "Chaque guide aborde un aspect essentiel de Claude Code. Suivez-les dans l\u0027ordre ou piochez directement celui qui vous int\u00e9resse.",
    readGuide: "Lire le guide",
    subPages: [
      {
        title: "Qu\u0027est-ce que Claude Code ?",
        description:
          "D\u00e9couvrez ce qui rend Claude Code unique, comparez-le aux autres outils (Copilot, Cursor) et explorez les cas d\u0027usage concrets.",
      },
      {
        title: "Pr\u00e9requis et installation",
        description:
          "Installez Claude Code en quelques minutes : Node.js 18+, la commande npm, l\u0027authentification API key ou Max.",
      },
      {
        title: "Configuration de l\u0027environnement",
        description:
          "Configurez la cl\u00e9 API, le fichier settings.json, le puissant CLAUDE.md et les permissions de s\u00e9curit\u00e9.",
      },
      {
        title: "Premier projet pas \u00e0 pas",
        description:
          "Tutoriel concret : cr\u00e9ez un site web complet en 5 minutes, it\u00e9rez sur le r\u00e9sultat et d\u00e9couvrez les bonnes pratiques.",
      },
    ],
    nextBadge: "Et ensuite ?",
    nextTitle: "Vous \u00eates pr\u00eat. Continuez votre",
    nextTitleHighlight: "apprentissage",
    nextDescription:
      "Maintenant que Claude Code est install\u00e9 et configur\u00e9, explorez les fonctionnalit\u00e9s avanc\u00e9es qui vont transformer votre quotidien.",
    mcpTitle: "Les MCP",
    mcpDescription:
      "Connectez Claude Code \u00e0 Gmail, GitHub, Slack, vos bases de donn\u00e9es et des dizaines d\u0027autres outils.",
    mcpLink: "D\u00e9couvrir les MCP",
    skillsTitle: "Les Skills",
    skillsDescription:
      "Cr\u00e9ez des comp\u00e9tences r\u00e9utilisables pour automatiser vos t\u00e2ches r\u00e9p\u00e9titives et standardiser vos workflows.",
    skillsLink: "Explorer les Skills",
    promptingTitle: "Le Prompting",
    promptingDescription:
      "Ma\u00eetrisez l\u0027art de communiquer avec Claude Code pour obtenir des r\u00e9sultats pr\u00e9cis et de haute qualit\u00e9.",
    promptingLink: "Apprendre le prompting",
  },
  en: {
    metaTitle: "Getting Started with Claude Code",
    metaDescription:
      "Complete guide to install, configure, and use Claude Code. From zero to your first project in minutes.",
    howToTitle: "Getting Started with Claude Code",
    howToDescription:
      "Complete guide to install, configure, and use Claude Code.",
    steps: [
      {
        name: "Discover Claude Code",
        text: "Understand what Claude Code is, who it's for, and what sets it apart from other tools.",
      },
      {
        name: "Install prerequisites and Claude Code",
        text: "Install Node.js and run npm install -g @anthropic-ai/claude-code.",
      },
      {
        name: "Configure your environment",
        text: "Set up your API key, settings.json, and CLAUDE.md file.",
      },
      {
        name: "Create your first project",
        text: "Launch Claude Code in a folder and build a complete website in 5 minutes.",
      },
    ],
    heroBadge: "Step-by-step guide",
    heroTitle: "Getting started with",
    heroSubtitle:
      "You're in the right place. Whether you're an experienced developer or have never opened a terminal, this guide walks you through installation to your first real project. No unnecessary jargon, just what matters.",
    guidesCount: "4 guides",
    guidesTitle: "Follow the path",
    guidesDescription:
      "Each guide covers an essential aspect of Claude Code. Follow them in order or jump straight to the one you need.",
    readGuide: "Read the guide",
    subPages: [
      {
        title: "What is Claude Code?",
        description:
          "Discover what makes Claude Code unique, compare it to other tools (Copilot, Cursor), and explore real-world use cases.",
      },
      {
        title: "Prerequisites and installation",
        description:
          "Install Claude Code in minutes: Node.js 18+, the npm command, API key or Max authentication.",
      },
      {
        title: "Environment configuration",
        description:
          "Set up the API key, settings.json, the powerful CLAUDE.md file, and security permissions.",
      },
      {
        title: "First project step by step",
        description:
          "Hands-on tutorial: build a complete website in 5 minutes, iterate on the result, and learn best practices.",
      },
    ],
    nextBadge: "What's next?",
    nextTitle: "You're ready. Continue your",
    nextTitleHighlight: "learning journey",
    nextDescription:
      "Now that Claude Code is installed and configured, explore advanced features that will transform your daily workflow.",
    mcpTitle: "MCPs",
    mcpDescription:
      "Connect Claude Code to Gmail, GitHub, Slack, your databases, and dozens of other tools.",
    mcpLink: "Discover MCPs",
    skillsTitle: "Skills",
    skillsDescription:
      "Create reusable capabilities to automate repetitive tasks and standardize your workflows.",
    skillsLink: "Explore Skills",
    promptingTitle: "Prompting",
    promptingDescription:
      "Master the art of communicating with Claude Code for precise, high-quality results.",
    promptingLink: "Learn prompting",
  },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = translations[locale as "fr" | "en"];
  return createPageMetadata({
    title: t.metaTitle,
    description: t.metaDescription,
    path: `/${locale}/getting-started`,
    locale,
  });
}

function buildHowToJsonLd(locale: string) {
  const t = translations[locale as "fr" | "en"];
  return createHowToSchema({
    title: t.howToTitle,
    description: t.howToDescription,
    url: `${SITE_URL}/${locale}/getting-started`,
    locale,
    steps: t.steps,
  });
}

const SUB_PAGES = [
  { href: "/getting-started/what-is-claude-code", icon: Terminal, step: "01", color: "brand" as const },
  { href: "/getting-started/installation", icon: Download, step: "02", color: "brand" as const },
  { href: "/getting-started/environment-setup", icon: Settings, step: "03", color: "accent" as const },
  { href: "/getting-started/first-project", icon: Rocket, step: "04", color: "accent" as const },
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

export default async function GettingStartedPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = translations[locale as "fr" | "en"];

  /*
   * JSON-LD structured data -- safe: static schema built at build time
   * from hardcoded values, serialized via JSON.stringify. No user input
   * reaches this code path. Same pattern used across the entire site.
   */
  const howToJsonLdHtml = serializeJsonLd(buildHowToJsonLd(locale));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: howToJsonLdHtml }}
      />

      {/* ===== HERO / INTRO ===== */}
      <section className="relative overflow-hidden bg-slate-50 dark:bg-slate-950">
        <div className="absolute inset-0 bg-[var(--gradient-hero)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(6,182,212,0.15),_transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(245,158,11,0.1),_transparent_60%)]" />

        <div className="relative px-4 pb-16 pt-20 sm:px-6 sm:pb-20 sm:pt-28 lg:px-8">
          <div className="text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-brand-500/10 px-4 py-1.5 text-sm text-brand-700 dark:text-brand-400">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              {t.heroBadge}
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl">
              {t.heroTitle}{" "}
              <span className="text-gradient">Claude Code</span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-300 sm:text-xl">
              {t.heroSubtitle}
            </p>
          </div>
        </div>
      </section>

      {/* ===== SUB-PAGES CARDS ===== */}
      <section className="py-16 sm:py-20">
        <div className="px-4 sm:px-6 lg:px-0">
          <AnimateOnScroll preset="fade-up">
            <div className="mb-12 text-center">
              <span className="mb-3 inline-block rounded-full bg-brand-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand-700 dark:text-brand-400">
                {t.guidesCount}
              </span>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {t.guidesTitle}
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-300">
                {t.guidesDescription}
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
                  <Link
                    href={`/${locale}${page.href}`}
                    className={`group relative flex flex-col rounded-xl border border-slate-200/50 bg-white/50 p-6 transition-all hover:bg-white hover:shadow-lg dark:border-slate-700/50 dark:bg-slate-800/50 dark:hover:bg-slate-800/80 ${styles.hoverBorder}`}
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

      {/* ===== PROCHAINES ETAPES ===== */}
      <section className="relative overflow-hidden py-16 sm:py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-50 via-slate-50 to-brand-100 dark:from-brand-950 dark:via-slate-900 dark:to-brand-900" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(6,182,212,0.12),_transparent_70%)]" />

        <div className="relative px-4 sm:px-6 lg:px-0">
          <div className="text-center">
            <span className="mb-3 inline-block rounded-full bg-brand-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand-700 dark:text-brand-400">
              {t.nextBadge}
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              {t.nextTitle}{" "}
              <span className="text-gradient">{t.nextTitleHighlight}</span>.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-300">
              {t.nextDescription}
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            <Link
              href={`/${locale}/mcp`}
              className="group rounded-xl border border-slate-200 bg-white/70 p-6 backdrop-blur transition-all hover:border-brand-500/50 hover:bg-white dark:border-slate-700/50 dark:bg-slate-800/50 dark:hover:bg-slate-800/80"
            >
              <Puzzle className="mb-3 h-8 w-8 text-brand-600 dark:text-brand-400" aria-hidden="true" />
              <h3 className="mb-2 font-semibold text-slate-900 dark:text-white">{t.mcpTitle}</h3>
              <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">{t.mcpDescription}</p>
              <div className="mt-4 flex items-center gap-1 text-sm font-medium text-brand-600 transition-colors group-hover:text-brand-500 dark:text-brand-400 dark:group-hover:text-brand-300">
                {t.mcpLink}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </div>
            </Link>

            <Link
              href={`/${locale}/skills`}
              className="group rounded-xl border border-slate-200 bg-white/70 p-6 backdrop-blur transition-all hover:border-accent-500/50 hover:bg-white dark:border-slate-700/50 dark:bg-slate-800/50 dark:hover:bg-slate-800/80"
            >
              <BookOpen className="mb-3 h-8 w-8 text-accent-600 dark:text-accent-400" aria-hidden="true" />
              <h3 className="mb-2 font-semibold text-slate-900 dark:text-white">{t.skillsTitle}</h3>
              <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">{t.skillsDescription}</p>
              <div className="mt-4 flex items-center gap-1 text-sm font-medium text-accent-600 transition-colors group-hover:text-accent-500 dark:text-accent-400 dark:group-hover:text-accent-300">
                {t.skillsLink}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </div>
            </Link>

            <Link
              href={`/${locale}/prompting`}
              className="group rounded-xl border border-slate-200 bg-white/70 p-6 backdrop-blur transition-all hover:border-emerald-500/50 hover:bg-white dark:border-slate-700/50 dark:bg-slate-800/50 dark:hover:bg-slate-800/80"
            >
              <MessageSquare className="mb-3 h-8 w-8 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
              <h3 className="mb-2 font-semibold text-slate-900 dark:text-white">{t.promptingTitle}</h3>
              <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">{t.promptingDescription}</p>
              <div className="mt-4 flex items-center gap-1 text-sm font-medium text-emerald-600 transition-colors group-hover:text-emerald-500 dark:text-emerald-400 dark:group-hover:text-emerald-300">
                {t.promptingLink}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </div>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
