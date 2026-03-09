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

export const metadata = createPageMetadata({
  title: "Plugins : Etendez les capacites de Claude Code",
  description:
    "Decouvrez les plugins Claude Code pour enrichir votre assistant IA. Agents specialises, design, securite, qualite — installez les meilleurs plugins du marketplace.",
  path: "/plugins",
});

const articleJsonLd = createArticleSchema({
  title: "Plugins : Etendez les capacites de Claude Code",
  description:
    "Decouvrez les plugins Claude Code pour enrichir votre assistant IA.",
  url: `${SITE_URL}/plugins`,
  datePublished: "2026-03-09",
  dateModified: "2026-03-09",
});

/**
 * Sub-pages of the Plugins section, displayed as clickable cards.
 */
const SUB_PAGES = [
  {
    href: "/plugins/what-are-plugins",
    icon: HelpCircle,
    step: "01",
    title: "Comprendre les plugins Claude Code",
    description:
      "Qu\u2019est-ce qu\u2019un plugin ? Diff\u00e9rences avec les MCP et Skills, architecture, marketplace et comparaison avec les extensions VS Code.",
    color: "brand" as const,
  },
  {
    href: "/plugins/setup",
    icon: Wrench,
    step: "02",
    title: "Installer et g\u00e9rer ses plugins",
    description:
      "Commandes /plugin marketplace, install, list, remove. Configuration dans settings et cr\u00e9ation de plugins custom.",
    color: "brand" as const,
  },
  {
    href: "/plugins/best-essential",
    icon: Star,
    step: "03",
    title: "Top plugins essentiels 2026",
    description:
      "Everything Claude Code, Context7, Prompt Improver, Repomix, Ralph Loop \u2014 les plugins fondamentaux pour tout le monde.",
    color: "accent" as const,
  },
  {
    href: "/plugins/best-design",
    icon: Palette,
    step: "04",
    title: "Plugins design & frontend",
    description:
      "Frontend Design (96K installs), UI UX Pro Max, 21st Magic, Playwright \u2014 les plugins pour cr\u00e9er des interfaces professionnelles.",
    color: "accent" as const,
  },
  {
    href: "/plugins/best-security",
    icon: Shield,
    step: "05",
    title: "Plugins s\u00e9curit\u00e9 & qualit\u00e9",
    description:
      "Security Guidance, Code Review, AgentShield, TDD Guide \u2014 s\u00e9curisez et fiabilisez votre code automatiquement.",
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

export default function PluginsPage() {
  /*
   * JSON-LD: safe — static schema from our own constants,
   * serialized via JSON.stringify. No user input.
   */
  const jsonLdHtml = serializeJsonLd(articleJsonLd);

  return (
    <>
      {/* JSON-LD structured data — safe: static schema via JSON.stringify */}
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
              <Puzzle className="h-4 w-4" aria-hidden="true" />
              Plugins
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl">
              Les <span className="text-gradient">Plugins</span> : &Eacute;tendez
              <br />
              les capacit&eacute;s de Claude Code
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300 sm:text-xl">
              Installez des plugins depuis le marketplace pour enrichir Claude
              Code avec de nouveaux agents, styles de design, outils de
              s&eacute;curit&eacute; et workflows automatis&eacute;s.
            </p>
          </div>
        </div>
      </section>

      {/* ===== SUB-PAGES CARDS ===== */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll preset="fade-up">
            <div className="mb-12 text-center">
              <span className="mb-3 inline-block rounded-full bg-brand-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand-700 dark:text-brand-400">
                5 guides
              </span>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Explorez les plugins en profondeur
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
                Des fondamentaux aux plugins sp&eacute;cialis&eacute;s, chaque guide
                couvre un aspect essentiel de l&apos;&eacute;cosyst&egrave;me plugins.
                Suivez-les dans l&apos;ordre ou piochez directement celui qui
                vous int&eacute;resse.
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

      {/* ===== PLUGIN VS MCP VS SKILL ===== */}
      <section className="bg-slate-50/50 py-20 dark:bg-slate-900/50 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll preset="fade-up">
            <SectionHeading
              badge="Concept"
              title="Plugin vs MCP vs Skill"
              description="Trois mécanismes complémentaires pour étendre Claude Code."
            />
          </AnimateOnScroll>

          <div className="mx-auto mt-16 max-w-4xl">
            <div className="grid gap-6 sm:grid-cols-3">
              <div className="glass-card p-6 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500/20 to-brand-500/5">
                  <Puzzle className="h-7 w-7 text-brand-700 dark:text-brand-400" aria-hidden="true" />
                </div>
                <h4 className="mb-2 font-semibold">Plugins</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Des <strong>applications</strong> install&eacute;es depuis un
                  marketplace. Elles ajoutent des capacit&eacute;s internes :
                  agents, styles, analyseurs.
                </p>
              </div>
              <div className="glass-card p-6 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-accent-500/20 to-accent-500/5">
                  <Cable className="h-7 w-7 text-accent-500" aria-hidden="true" />
                </div>
                <h4 className="mb-2 font-semibold">MCP</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Des <strong>prises USB</strong> vers le monde ext&eacute;rieur.
                  Elles connectent Claude Code &agrave; GitHub, Slack, Gmail,
                  bases de donn&eacute;es.
                </p>
              </div>
              <div className="glass-card p-6 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/5">
                  <Sparkles className="h-7 w-7 text-emerald-500" aria-hidden="true" />
                </div>
                <h4 className="mb-2 font-semibold">Skills</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Des <strong>recettes</strong> m&eacute;moris&eacute;es. Des
                  instructions Markdown qui enseignent des comportements et
                  workflows &agrave; Claude Code.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== NEXT STEPS ===== */}
      <section className="relative overflow-hidden py-20 sm:py-28">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-950 via-slate-900 to-brand-900" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(6,182,212,0.15),_transparent_70%)]" />

        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl">
            Continuez votre{" "}
            <span className="text-gradient">apprentissage</span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300">
            Les plugins ne sont qu&apos;une partie de l&apos;&eacute;cosyst&egrave;me.
            D&eacute;couvrez les MCP pour connecter Claude Code au monde
            ext&eacute;rieur, et les Skills pour lui enseigner vos workflows.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/mcp"
              className="group inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-sm font-semibold text-slate-900 shadow-lg transition-all hover:bg-slate-100"
            >
              <Cable className="h-4 w-4" aria-hidden="true" />
              D&eacute;couvrir les MCP
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
            <Link
              href="/skills"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-600 px-8 py-3.5 text-sm font-semibold text-white transition-all hover:border-slate-500 hover:bg-white/5"
            >
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              Explorer les Skills
            </Link>
            <Link
              href="/prompting"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-600 px-8 py-3.5 text-sm font-semibold text-white transition-all hover:border-slate-500 hover:bg-white/5"
            >
              <MessageSquare className="h-4 w-4" aria-hidden="true" />
              Ma&icirc;triser le prompting
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
