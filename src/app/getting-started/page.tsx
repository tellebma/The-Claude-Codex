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

export const metadata = createPageMetadata({
  title: "Premiers pas avec Claude Code",
  description:
    "Guide complet pour installer, configurer et utiliser Claude Code. De z\u00e9ro \u00e0 votre premier projet en quelques minutes.",
  path: "/getting-started",
});

const howToJsonLd = createHowToSchema({
  title: "Premiers pas avec Claude Code",
  description:
    "Guide complet pour installer, configurer et utiliser Claude Code.",
  url: `${SITE_URL}/getting-started`,
  steps: [
    {
      name: "D\u00e9couvrir Claude Code",
      text: "Comprendre ce qu\u2019est Claude Code, \u00e0 qui il s\u2019adresse et ce qui le diff\u00e9rencie des autres outils.",
    },
    {
      name: "Installer les pr\u00e9requis et Claude Code",
      text: "Installer Node.js et ex\u00e9cuter la commande npm install -g @anthropic-ai/claude-code.",
    },
    {
      name: "Configurer votre environnement",
      text: "Configurer votre cl\u00e9 API, le fichier settings.json et le fichier CLAUDE.md.",
    },
    {
      name: "Cr\u00e9er votre premier projet",
      text: "Lancer Claude Code dans un dossier et cr\u00e9er un site web complet en 5 minutes.",
    },
  ],
});

/*
 * JSON-LD structured data — safe: static schema built at build time
 * from hardcoded values, serialized via JSON.stringify. No user input
 * reaches this code path. Same pattern used across the entire site.
 */
const howToJsonLdHtml = serializeJsonLd(howToJsonLd);

/**
 * Sub-pages of the Getting Started section, displayed as clickable cards.
 */
const SUB_PAGES = [
  {
    href: "/getting-started/what-is-claude-code",
    icon: Terminal,
    step: "01",
    title: "Qu\u2019est-ce que Claude Code ?",
    description:
      "D\u00e9couvrez ce qui rend Claude Code unique, comparez-le aux autres outils (Copilot, Cursor) et explorez les cas d\u2019usage concrets.",
    color: "brand" as const,
  },
  {
    href: "/getting-started/installation",
    icon: Download,
    step: "02",
    title: "Pr\u00e9requis et installation",
    description:
      "Installez Claude Code en quelques minutes : Node.js 18+, la commande npm, l\u2019authentification API key ou Max.",
    color: "brand" as const,
  },
  {
    href: "/getting-started/environment-setup",
    icon: Settings,
    step: "03",
    title: "Configuration de l\u2019environnement",
    description:
      "Configurez la cl\u00e9 API, le fichier settings.json, le puissant CLAUDE.md et les permissions de s\u00e9curit\u00e9.",
    color: "accent" as const,
  },
  {
    href: "/getting-started/first-project",
    icon: Rocket,
    step: "04",
    title: "Premier projet pas \u00e0 pas",
    description:
      "Tutoriel concret : cr\u00e9ez un site web complet en 5 minutes, it\u00e9rez sur le r\u00e9sultat et d\u00e9couvrez les bonnes pratiques.",
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

export default function GettingStartedPage() {
  return (
    <>
      {/* JSON-LD structured data — safe: static schema, no user input */}
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: howToJsonLdHtml }}
      />

      {/* ===== HERO / INTRO ===== */}
      <section className="relative overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-[var(--gradient-hero)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(6,182,212,0.15),_transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(245,158,11,0.1),_transparent_60%)]" />

        <div className="relative mx-auto max-w-4xl px-4 pb-16 pt-20 sm:px-6 sm:pb-20 sm:pt-28 lg:px-8">
          <div className="text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-brand-500/10 px-4 py-1.5 text-sm text-brand-300">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              Guide pas &agrave; pas
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Premiers pas avec{" "}
              <span className="text-gradient">Claude Code</span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300 sm:text-xl">
              Vous &ecirc;tes au bon endroit. Que vous soyez d&eacute;veloppeur exp&eacute;riment&eacute; ou
              que vous n&apos;ayez jamais ouvert un terminal, ce guide vous
              accompagne de l&apos;installation &agrave; votre premier projet concret.
              Pas de jargon inutile, juste l&apos;essentiel.
            </p>
          </div>
        </div>
      </section>

      {/* ===== SUB-PAGES CARDS ===== */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll preset="fade-up">
            <div className="mb-12 text-center">
              <span className="mb-3 inline-block rounded-full bg-brand-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand-700 dark:text-brand-400">
                4 guides
              </span>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Suivez le parcours
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
                Chaque guide aborde un aspect essentiel de Claude Code.
                Suivez-les dans l&apos;ordre ou piochez directement celui qui
                vous int&eacute;resse.
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
                    href={page.href}
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
                    <p className="mb-4 flex-1 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
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

      {/* ===== PROCHAINES ETAPES ===== */}
      <section className="relative overflow-hidden py-16 sm:py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-950 via-slate-900 to-brand-900" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(6,182,212,0.12),_transparent_70%)]" />

        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="mb-3 inline-block rounded-full bg-brand-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand-400">
              Et ensuite ?
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Vous &ecirc;tes pr&ecirc;t. Continuez votre{" "}
              <span className="text-gradient">apprentissage</span>.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-300">
              Maintenant que Claude Code est install&eacute; et configur&eacute;, explorez les
              fonctionnalit&eacute;s avanc&eacute;es qui vont transformer votre quotidien.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            <Link
              href="/mcp"
              className="group rounded-xl border border-slate-700/50 bg-slate-800/50 p-6 backdrop-blur transition-all hover:border-brand-500/50 hover:bg-slate-800/80"
            >
              <Puzzle className="mb-3 h-8 w-8 text-brand-400" aria-hidden="true" />
              <h3 className="mb-2 font-semibold text-white">
                Les MCP
              </h3>
              <p className="text-sm leading-relaxed text-slate-400">
                Connectez Claude Code &agrave; Gmail, GitHub, Slack, vos bases de donn&eacute;es
                et des dizaines d&apos;autres outils.
              </p>
              <div className="mt-4 flex items-center gap-1 text-sm font-medium text-brand-400 transition-colors group-hover:text-brand-300">
                D&eacute;couvrir les MCP
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </div>
            </Link>

            <Link
              href="/skills"
              className="group rounded-xl border border-slate-700/50 bg-slate-800/50 p-6 backdrop-blur transition-all hover:border-accent-500/50 hover:bg-slate-800/80"
            >
              <BookOpen className="mb-3 h-8 w-8 text-accent-400" aria-hidden="true" />
              <h3 className="mb-2 font-semibold text-white">
                Les Skills
              </h3>
              <p className="text-sm leading-relaxed text-slate-400">
                Cr&eacute;ez des comp&eacute;tences r&eacute;utilisables pour automatiser vos t&acirc;ches
                r&eacute;p&eacute;titives et standardiser vos workflows.
              </p>
              <div className="mt-4 flex items-center gap-1 text-sm font-medium text-accent-400 transition-colors group-hover:text-accent-300">
                Explorer les Skills
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </div>
            </Link>

            <Link
              href="/prompting"
              className="group rounded-xl border border-slate-700/50 bg-slate-800/50 p-6 backdrop-blur transition-all hover:border-emerald-500/50 hover:bg-slate-800/80"
            >
              <MessageSquare className="mb-3 h-8 w-8 text-emerald-400" aria-hidden="true" />
              <h3 className="mb-2 font-semibold text-white">
                Le Prompting
              </h3>
              <p className="text-sm leading-relaxed text-slate-400">
                Ma&icirc;trisez l&apos;art de communiquer avec Claude Code pour obtenir
                des r&eacute;sultats pr&eacute;cis et de haute qualit&eacute;.
              </p>
              <div className="mt-4 flex items-center gap-1 text-sm font-medium text-emerald-400 transition-colors group-hover:text-emerald-300">
                Apprendre le prompting
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </div>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
