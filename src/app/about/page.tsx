import Link from "next/link";
import {
  ArrowRight,
  Github,
  Heart,
  BookOpen,
  Users,
  Shield,
  Globe,
  ExternalLink,
} from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";
import { createPageMetadata, SITE_URL } from "@/lib/metadata";
import {
  createArticleSchema,
  serializeJsonLd,
} from "@/lib/structured-data";

export const metadata = createPageMetadata({
  title: "À propos du Claude Codex",
  description:
    "Qui sommes-nous, pourquoi ce guide existe, et comment contribuer au projet open-source The Claude Codex.",
  path: "/about",
});

const articleJsonLd = createArticleSchema({
  title: "À propos du Claude Codex",
  description:
    "Qui sommes-nous, pourquoi ce guide existe, et comment contribuer.",
  url: `${SITE_URL}/about`,
  datePublished: "2026-03-14",
  dateModified: "2026-03-14",
});

/* JSON-LD: safe static schema from build-time constants, serialized with
   JSON.stringify. Same pattern used across all section pages. */
const jsonLdHtml = serializeJsonLd(articleJsonLd);

const values = [
  {
    icon: BookOpen,
    title: "Gratuit et ouvert",
    description:
      "Tout le contenu est libre d'accès. Pas de paywall, pas de compte obligatoire, pas de contenu verrouillé. Le savoir doit circuler.",
  },
  {
    icon: Users,
    title: "Pour tous les profils",
    description:
      "Développeur senior ou entrepreneur qui n'a jamais codé : chaque guide est pensé pour être accessible quel que soit votre niveau technique.",
  },
  {
    icon: Shield,
    title: "Indépendant",
    description:
      "Ce projet n'est pas affilié à Anthropic. Le contenu reflète l'expérience terrain de la communauté, pas un discours marketing.",
  },
  {
    icon: Globe,
    title: "Francophone d'abord",
    description:
      "La documentation IA de qualité en français est rare. Ce guide comble ce manque pour la communauté francophone.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* JSON-LD structured data — safe: static schema, no user input */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdHtml }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-[var(--gradient-hero)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(6,182,212,0.15),_transparent_60%)]" />

        <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-20 sm:px-6 sm:pb-28 sm:pt-28 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-brand-500/10 px-4 py-1.5 text-sm text-brand-300">
              <Heart className="h-4 w-4" aria-hidden="true" />
              Open-source
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
              &Agrave; propos du{" "}
              <span className="text-gradient">Claude Codex</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300">
              Un guide complet, gratuit et en fran&ccedil;ais pour apprendre
              &agrave; utiliser Claude Code. Cr&eacute;&eacute; par des
              utilisateurs, pour des utilisateurs.
            </p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll preset="fade-up">
            <SectionHeading
              badge="Notre mission"
              title="Rendre l'IA accessible à tous"
              description="Claude Code est un outil puissant, mais sa documentation officielle est en anglais et orientée développeurs. Nous avons créé The Claude Codex pour changer ça."
            />
          </AnimateOnScroll>

          <div className="mx-auto mt-12 max-w-3xl space-y-6 text-lg text-slate-600 dark:text-slate-300">
            <p>
              The Claude Codex est n&eacute; d&apos;un constat simple : l&apos;IA
              g&eacute;n&eacute;rative transforme le travail quotidien de millions
              de personnes, mais les ressources pour apprendre &agrave; l&apos;utiliser
              correctement restent fragment&eacute;es, souvent en anglais, et rarement
              adapt&eacute;es aux non-d&eacute;veloppeurs.
            </p>
            <p>
              Ce guide couvre tout l&apos;&eacute;cosyst&egrave;me Claude Code :
              de l&apos;installation &agrave; l&apos;orchestration multi-agents, en
              passant par les MCP, les Skills, le prompting avanc&eacute; et les
              cas d&apos;usage concrets. Chaque page est r&eacute;dig&eacute;e pour
              &ecirc;tre compr&eacute;hensible par quelqu&apos;un qui d&eacute;couvre
              le sujet.
            </p>
            <p>
              Le projet est enti&egrave;rement open-source sous licence MIT. Vous
              pouvez lire le code, proposer des am&eacute;liorations, signaler des
              erreurs ou contribuer de nouvelles pages. Toute contribution est
              la bienvenue.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-slate-50/50 py-16 dark:bg-slate-900/50 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll preset="fade-up">
            <SectionHeading
              badge="Valeurs"
              title="Ce qui guide le projet"
            />
          </AnimateOnScroll>

          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <div key={value.title} className="glass-card p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500/20 to-brand-500/5">
                    <Icon className="h-6 w-6 text-brand-700 dark:text-brand-400" aria-hidden="true" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">{value.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Author */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll preset="fade-up">
            <SectionHeading
              badge="Auteur"
              title="Qui est derrière le projet ?"
            />
          </AnimateOnScroll>

          <div className="mx-auto mt-12 max-w-2xl">
            <div className="glass-card p-8">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-accent-500 text-xl font-bold text-white">
                  T
                </div>
                <div>
                  <h3 className="text-xl font-bold">tellebma</h3>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    D&eacute;veloppeur fullstack &amp; utilisateur quotidien de Claude Code
                  </p>
                </div>
              </div>
              <div className="mt-6 space-y-4 text-slate-600 dark:text-slate-300">
                <p>
                  Passionn&eacute; par les outils qui am&eacute;liorent la
                  productivit&eacute; des d&eacute;veloppeurs, j&apos;utilise
                  Claude Code au quotidien dans des projets Next.js, Python et
                  DevOps. Ce guide est le r&eacute;sultat de centaines d&apos;heures
                  d&apos;exp&eacute;rimentation et de documentation.
                </p>
                <p>
                  L&apos;objectif : partager ce que j&apos;ai appris pour que
                  d&apos;autres gagnent du temps. Pas de th&eacute;orie abstraite,
                  que des conseils test&eacute;s en conditions r&eacute;elles.
                </p>
              </div>
              <div className="mt-6 flex gap-4">
                <a
                  href="https://github.com/tellebma"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium transition-colors hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                >
                  <Github className="h-4 w-4" aria-hidden="true" />
                  GitHub
                  <ExternalLink className="h-3 w-3" aria-hidden="true" />
                </a>
                <a
                  href="https://github.com/tellebma/The-Claude-Codex"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium transition-colors hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                >
                  <BookOpen className="h-4 w-4" aria-hidden="true" />
                  Code source
                  <ExternalLink className="h-3 w-3" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden py-20 sm:py-28">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-950 via-slate-900 to-brand-900" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(6,182,212,0.15),_transparent_70%)]" />

        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl">
            Envie de{" "}
            <span className="text-gradient">contribuer</span> ?
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300">
            Le projet est open-source. Vous pouvez proposer des corrections,
            ajouter du contenu ou signaler des erreurs sur GitHub.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="https://github.com/tellebma/The-Claude-Codex"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-sm font-semibold text-slate-900 shadow-lg transition-all hover:bg-slate-100"
            >
              <Github className="h-4 w-4" aria-hidden="true" />
              Voir sur GitHub
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </a>
            <Link
              href="/getting-started"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-600 px-8 py-3.5 text-sm font-semibold text-white transition-all hover:border-slate-500 hover:bg-white/5"
            >
              Commencer le guide
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
