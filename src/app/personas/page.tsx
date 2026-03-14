import Link from "next/link";
import {
  ArrowRight,
  Code,
  Users,
  UserCircle,
  Briefcase,
  GraduationCap,
  Compass,
  Sparkles,
} from "lucide-react";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";
import { createPageMetadata, SITE_URL } from "@/lib/metadata";
import {
  createArticleSchema,
  serializeJsonLd,
} from "@/lib/structured-data";

export const metadata = createPageMetadata({
  title: "Parcours personas : trouvez votre chemin",
  description:
    "Cinq parcours de lecture adaptes a votre profil. Developpeur, lead technique, non-developpeur, freelance ou etudiant : suivez le guide qui vous correspond.",
  path: "/personas",
});

const articleJsonLd = createArticleSchema({
  title: "Parcours personas : trouvez votre chemin",
  description:
    "Cinq parcours de lecture adaptes a votre profil. Developpeur, lead technique, non-developpeur, freelance ou etudiant.",
  url: `${SITE_URL}/personas`,
  datePublished: "2026-03-12",
  dateModified: "2026-03-12",
});

/*
 * JSON-LD structured data — safe: static schema built at build time
 * from hardcoded values, serialized via JSON.stringify. No user input
 * reaches this code path. Same pattern used across the entire site.
 */
const coursesJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  itemListElement: [
    {
      "@type": "Course",
      position: 1,
      name: "Parcours Developpeur",
      description:
        "Installation, prompting, MCP, agents et techniques avancees pour coder plus vite avec Claude Code.",
      url: `${SITE_URL}/personas/developer`,
      provider: { "@type": "Organization", name: "The Claude Codex" },
      inLanguage: "fr-FR",
    },
    {
      "@type": "Course",
      position: 2,
      name: "Parcours Lead Technique",
      description:
        "Adoption d'equipe, gouvernance, securite, CI/CD et Skills pour deployer Claude Code dans votre organisation.",
      url: `${SITE_URL}/personas/team-lead`,
      provider: { "@type": "Organization", name: "The Claude Codex" },
      inLanguage: "fr-FR",
    },
    {
      "@type": "Course",
      position: 3,
      name: "Parcours Non-developpeur",
      description:
        "Pre-requis, premiers pas, FAQ et templates de prompting. Un parcours progressif pour ceux qui partent de zero.",
      url: `${SITE_URL}/personas/non-dev`,
      provider: { "@type": "Organization", name: "The Claude Codex" },
      inLanguage: "fr-FR",
    },
    {
      "@type": "Course",
      position: 4,
      name: "Parcours Freelance",
      description:
        "Productivite, plugins, automatisation et workflows MCP. Chaque heure economisee est une heure gagnee.",
      url: `${SITE_URL}/personas/freelance`,
      provider: { "@type": "Organization", name: "The Claude Codex" },
      inLanguage: "fr-FR",
    },
    {
      "@type": "Course",
      position: 5,
      name: "Parcours Etudiant",
      description:
        "Fondamentaux, projets pratiques et bonnes pratiques professionnelles. Apprenez a coder avec un tuteur IA.",
      url: `${SITE_URL}/personas/student`,
      provider: { "@type": "Organization", name: "The Claude Codex" },
      inLanguage: "fr-FR",
    },
  ],
};

const articleJsonLdHtml = serializeJsonLd(articleJsonLd);
const coursesJsonLdHtml = serializeJsonLd(coursesJsonLd);

/**
 * Sub-pages of the Personas section, displayed as clickable cards.
 */
const SUB_PAGES = [
  {
    href: "/personas/developer",
    icon: Code,
    step: "01",
    title: "Le développeur",
    description:
      "Installation, prompting, MCP, agents et techniques avancées. Le parcours complet pour coder plus vite avec Claude Code.",
    color: "brand" as const,
  },
  {
    href: "/personas/team-lead",
    icon: Users,
    step: "02",
    title: "Le lead technique",
    description:
      "Adoption d’équipe, gouvernance, sécurité, CI/CD et Skills. Tout pour déployer Claude Code dans votre organisation.",
    color: "brand" as const,
  },
  {
    href: "/personas/non-dev",
    icon: UserCircle,
    step: "03",
    title: "Le non-développeur",
    description:
      "Pré-requis, premiers pas, FAQ et templates de prompting. Un parcours progressif pour ceux qui partent de zéro.",
    color: "accent" as const,
  },
  {
    href: "/personas/freelance",
    icon: Briefcase,
    step: "04",
    title: "Le freelance",
    description:
      "Productivité, plugins, automatisation et workflows MCP. Chaque heure économisée est une heure gagnée.",
    color: "accent" as const,
  },
  {
    href: "/personas/student",
    icon: GraduationCap,
    step: "05",
    title: "L’étudiant",
    description:
      "Fondamentaux, projets pratiques et bonnes pratiques professionnelles. Apprenez à coder avec un tuteur IA.",
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

export default function PersonasPage() {
  return (
    <>
      {/* JSON-LD structured data — safe: static schema, no user input */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: articleJsonLdHtml }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: coursesJsonLdHtml }}
      />

      {/* ===== HERO / INTRO ===== */}
      <section className="relative overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-[var(--gradient-hero)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(6,182,212,0.15),_transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(245,158,11,0.1),_transparent_60%)]" />

        <div className="relative px-4 pb-16 pt-20 sm:px-6 sm:pb-20 sm:pt-28 lg:px-8">
          <div className="text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-brand-500/10 px-4 py-1.5 text-sm text-brand-300">
              <Compass className="h-4 w-4" aria-hidden="true" />
              Parcours guid&eacute;s
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Trouvez votre{" "}
              <span className="text-gradient">parcours</span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300 sm:text-xl">
              Cinq profils, cinq itin&eacute;raires de lecture. Choisissez celui qui
              correspond &agrave; votre situation et suivez les &eacute;tapes dans l&apos;ordre.
              Pas besoin de tout lire : concentrez-vous sur ce qui compte pour vous.
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
                5 parcours
              </span>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Quel profil vous correspond ?
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
                Chaque parcours propose un itin&eacute;raire structur&eacute; &agrave; travers les pages
                du site. Suivez les &eacute;tapes ou piochez directement ce qui vous int&eacute;resse.
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
                      Suivre ce parcours
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

        <div className="relative px-4 sm:px-6 lg:px-0">
          <div className="text-center">
            <span className="mb-3 inline-block rounded-full bg-brand-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand-400">
              Pas encore d&eacute;cid&eacute; ?
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Commencez par les{" "}
              <span className="text-gradient">fondamentaux</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-300">
              Si aucun profil ne vous correspond parfaitement, commencez par la section
              &quot;Premiers pas&quot;. Elle couvre l&apos;essentiel pour tout le monde.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            <Link
              href="/getting-started"
              className="group rounded-xl border border-slate-700/50 bg-slate-800/50 p-6 backdrop-blur transition-all hover:border-brand-500/50 hover:bg-slate-800/80"
            >
              <Sparkles className="mb-3 h-8 w-8 text-brand-400" aria-hidden="true" />
              <h3 className="mb-2 font-semibold text-white">
                Premiers pas
              </h3>
              <p className="text-sm leading-relaxed text-slate-400">
                Le guide universel : installation, configuration et premier projet.
                Adapt&eacute; &agrave; tous les niveaux.
              </p>
              <div className="mt-4 flex items-center gap-1 text-sm font-medium text-brand-400 transition-colors group-hover:text-brand-300">
                Commencer ici
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </div>
            </Link>

            <Link
              href="/configurator"
              className="group rounded-xl border border-slate-700/50 bg-slate-800/50 p-6 backdrop-blur transition-all hover:border-accent-500/50 hover:bg-slate-800/80"
            >
              <Compass className="mb-3 h-8 w-8 text-accent-400" aria-hidden="true" />
              <h3 className="mb-2 font-semibold text-white">
                Configurateur
              </h3>
              <p className="text-sm leading-relaxed text-slate-400">
                G&eacute;n&eacute;rez une configuration Claude Code sur mesure en r&eacute;pondant
                &agrave; quelques questions simples.
              </p>
              <div className="mt-4 flex items-center gap-1 text-sm font-medium text-accent-400 transition-colors group-hover:text-accent-300">
                Configurer
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </div>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
