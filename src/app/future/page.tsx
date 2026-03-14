import Link from "next/link";
import {
  ArrowRight,
  Bot,
  BookOpen,
  BrainCircuit,
  Code2,
  Compass,
  ExternalLink,
  GalleryVerticalEnd,
  GitBranch,
  Globe,
  GraduationCap,
  Heart,
  Image,
  Lightbulb,
  Mic,
  MonitorSmartphone,
  Palette,
  Puzzle,
  Rocket,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Video,
  Wrench,
  Zap,
} from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Callout } from "@/components/ui/Callout";
import { AnimateOnScroll, StaggerChildren } from "@/components/ui/AnimateOnScroll";
import { createPageMetadata, SITE_URL } from "@/lib/metadata";
import { createArticleSchema, serializeJsonLd } from "@/lib/structured-data";

export const metadata = createPageMetadata({
  title: "Vision & Futur de l'IA",
  description:
    "L'avenir de l'IA est deja la. Decouvrez comment vous preparer, les tendances a suivre, et la roadmap de The Claude Codex.",
  path: "/future",
});

const articleJsonLd = createArticleSchema({
  title: "Vision & Futur de l'IA",
  description:
    "L'avenir de l'IA est deja la. Decouvrez comment vous preparer et les tendances a suivre.",
  url: `${SITE_URL}/future`,
  datePublished: "2026-03-07",
  dateModified: "2026-03-07",
});

/* ---------- data ---------- */

const professions = [
  {
    icon: Code2,
    title: "Developpement logiciel",
    description:
      "Les agents autonomes ecrivent, testent et deployent du code. Le developpeur devient architecte et superviseur, sa valeur se deplace vers la vision, la revue et la strategie technique.",
    gradient: "teal" as const,
  },
  {
    icon: Palette,
    title: "Industries creatives",
    description:
      "Du design generatif au montage video assiste, l'IA amplifie la creativite humaine. Les creatifs qui maitrisent ces outils gagnent en productivite sans sacrifier la qualite.",
    gradient: "amber" as const,
  },
  {
    icon: GraduationCap,
    title: "Education & apprentissage",
    description:
      "Tutorat personnalise, generation d'exercices adaptatifs, correction intelligente. L'IA transforme chaque apprenant en autodidacte accompagne 24h/24.",
    gradient: "purple" as const,
  },
  {
    icon: TrendingUp,
    title: "Business & entrepreneuriat",
    description:
      "De l'etude de marche au MVP, de l'automatisation comptable au service client intelligent, l'IA permet de lancer et scaler avec des equipes reduites.",
    gradient: "green" as const,
  },
];

const preparations = [
  {
    icon: Target,
    title: "Maitrisez les fondamentaux",
    description:
      "Apprenez le prompting, comprenez les modeles, explorez les outils. La base est accessible a tous, pas besoin d'etre ingenieur.",
    link: { label: "Guide de demarrage", href: "/getting-started" },
  },
  {
    icon: BookOpen,
    title: "Construisez une habitude d'apprentissage",
    description:
      "Consacrez 20 minutes par jour a experimenter. La regularite bat l'intensite. Creez un projet personnel et iterez chaque semaine.",
  },
  {
    icon: Compass,
    title: "Restez curieux, experimentez",
    description:
      "Testez chaque nouveau modele, chaque nouvel outil. L'experimentation directe est le meilleur professeur. Cassez des choses, apprenez, recommencez.",
  },
  {
    icon: Users,
    title: "Rejoignez des communautes",
    description:
      "Discord, GitHub, meetups locaux : entourez-vous de personnes qui partagent votre curiosite. L'intelligence collective accelere tout.",
  },
];

const trends = [
  {
    icon: Bot,
    title: "Agents autonomes",
    description:
      "Des IA qui planifient, executent et iterent sans intervention humaine. Claude Code en mode agent prefigure cette revolution.",
    color: "brand" as const,
  },
  {
    icon: Puzzle,
    title: "Expansion de l'ecosysteme MCP",
    description:
      "Le protocole MCP devient le standard universel pour connecter l'IA a tous les outils. Des milliers de serveurs MCP emergeront en 2026.",
    color: "accent" as const,
  },
  {
    icon: Zap,
    title: "Skills marketplace",
    description:
      "Un ecosysteme de competences partageables, comme des applications pour votre IA. Installez, combinez, creez et partagez des Skills.",
    color: "violet" as const,
  },
  {
    icon: Image,
    title: "IA multi-modale",
    description:
      "Code + images + voix + video dans un seul flux. Decrivez une interface a voix haute, l'IA la dessine et la code en temps reel.",
    color: "emerald" as const,
  },
  {
    icon: Wrench,
    title: "Outils de dev AI-native",
    description:
      "IDE, CI/CD, monitoring : tous les outils seront repenses autour de l'IA. Le terminal intelligent n'est que le debut.",
    color: "brand" as const,
  },
];

const roadmapItems = [
  {
    icon: MonitorSmartphone,
    title: "Tutoriels interactifs",
    description: "Apprenez en faisant, directement dans le navigateur.",
    status: "En cours",
  },
  {
    icon: Video,
    title: "Guides video",
    description: "Walkthroughs visuels pour chaque chapitre du guide.",
    status: "Q2 2026",
  },
  {
    icon: Users,
    title: "Contributions communautaires",
    description: "Soumettez vos recettes, workflows et retours d'experience.",
    status: "Q2 2026",
  },
  {
    icon: GalleryVerticalEnd,
    title: "Repertoire MCP & Skills",
    description: "Un catalogue searchable de tous les MCP et Skills disponibles.",
    status: "Q3 2026",
  },
  {
    icon: Globe,
    title: "Support multilingue",
    description: "Le guide traduit en anglais, espagnol, arabe et plus.",
    status: "Q4 2026",
  },
];

/* ---------- helper maps ---------- */

const professionGradients = {
  teal: "from-brand-500/20 to-brand-500/5",
  amber: "from-accent-500/20 to-accent-500/5",
  purple: "from-violet-500/20 to-violet-500/5",
  green: "from-emerald-500/20 to-emerald-500/5",
};

const professionIconColors = {
  teal: "text-brand-700 dark:text-brand-400",
  amber: "text-accent-500",
  purple: "text-violet-500",
  green: "text-emerald-500",
};

const trendColorMap = {
  brand: {
    border: "border-brand-500/30",
    bg: "bg-brand-500/10",
    icon: "text-brand-400",
    dot: "bg-brand-400",
  },
  accent: {
    border: "border-accent-500/30",
    bg: "bg-accent-500/10",
    icon: "text-accent-400",
    dot: "bg-accent-400",
  },
  violet: {
    border: "border-violet-500/30",
    bg: "bg-violet-500/10",
    icon: "text-violet-400",
    dot: "bg-violet-400",
  },
  emerald: {
    border: "border-emerald-500/30",
    bg: "bg-emerald-500/10",
    icon: "text-emerald-400",
    dot: "bg-emerald-400",
  },
};

/* ---------- page ---------- */

export default function FuturePage() {
  return (
    <>
      {/* JSON-LD structured data — safe: static schema via JSON.stringify */}
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(articleJsonLd) }}
      />
      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden bg-slate-950">
        {/* Background effects */}
        <div className="absolute inset-0 bg-[var(--gradient-hero)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(6,182,212,0.18),_transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(245,158,11,0.12),_transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(139,92,246,0.08),_transparent_50%)]" />

        {/* Animated grid */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-20 sm:px-6 sm:pb-28 sm:pt-28 lg:px-8 lg:pb-36 lg:pt-32">
          <div className="mx-auto max-w-4xl text-center">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-brand-500/10 px-4 py-1.5 text-sm text-brand-300">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              Vision & Futur
            </div>

            {/* Title */}
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl">
              L&apos;avenir est{" "}
              <span className="text-gradient">deja la</span>
            </h1>

            {/* Subtitle */}
            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300 sm:text-xl">
              L&apos;intelligence artificielle ne remplacera pas les humains.
              Elle amplifiera ceux qui apprendront a l&apos;utiliser. Ce qui
              etait de la science-fiction hier est votre outil de travail
              aujourd&apos;hui, et ce n&apos;est que le debut.
            </p>

            {/* Decorative orbit rings */}
            <div className="mx-auto mt-16 flex items-center justify-center">
              <div className="relative h-48 w-48 sm:h-64 sm:w-64">
                {/* Outer ring */}
                <div className="absolute inset-0 animate-[spin_20s_linear_infinite] rounded-full border border-brand-500/20" />
                {/* Middle ring */}
                <div className="absolute inset-4 animate-[spin_15s_linear_infinite_reverse] rounded-full border border-accent-500/20" />
                {/* Inner ring */}
                <div className="absolute inset-8 animate-[spin_10s_linear_infinite] rounded-full border border-violet-500/20" />
                {/* Center icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 shadow-lg shadow-brand-500/25 sm:h-20 sm:w-20">
                    <BrainCircuit className="h-8 w-8 text-white sm:h-10 sm:w-10" aria-hidden="true" />
                  </div>
                </div>
                {/* Orbit dots */}
                <div className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 rounded-full bg-brand-400 shadow-lg shadow-brand-400/50" />
                <div className="absolute bottom-4 right-4 h-2 w-2 rounded-full bg-accent-400 shadow-lg shadow-accent-400/50 sm:bottom-6 sm:right-6" />
                <div className="absolute bottom-4 left-4 h-1.5 w-1.5 rounded-full bg-violet-400 shadow-lg shadow-violet-400/50 sm:bottom-6 sm:left-6" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== POURQUOI L'IA VA TRANSFORMER CHAQUE METIER ===== */}
      <section className="py-20 sm:py-28">
        <div className="px-4 sm:px-6 lg:px-0">
          <AnimateOnScroll preset="fade-up">
            <SectionHeading
              badge="Transformation"
              title="Pourquoi l'IA va transformer chaque metier"
              description="L'IA n'est pas un outil de plus. C'est un multiplicateur universel de capacites humaines, un changement de paradigme comparable a l'arrivee d'Internet."
            />
          </AnimateOnScroll>

          <StaggerChildren className="mt-16 grid gap-6 sm:grid-cols-2" staggerDelay={0.1}>
            {professions.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="glass-card group p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div
                    className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${professionGradients[item.gradient]}`}
                  >
                    <Icon
                      className={`h-6 w-6 ${professionIconColors[item.gradient]}`}
                      aria-hidden="true"
                    />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-300">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </StaggerChildren>

          <div className="mt-12">
            <Callout type="tip" title="Le point cle">
              La question n&apos;est plus &laquo;&nbsp;l&apos;IA va-t-elle
              impacter mon metier&nbsp;?&nbsp;&raquo; mais &laquo;&nbsp;suis-je
              pret a utiliser l&apos;IA quand elle deviendra indispensable dans
              mon metier&nbsp;?&nbsp;&raquo;. Ceux qui commencent
              aujourd&apos;hui auront une longueur d&apos;avance decisive.
            </Callout>
          </div>
        </div>
      </section>

      {/* ===== COMMENT SE PREPARER ===== */}
      <section className="bg-slate-50/50 py-20 dark:bg-slate-900/50 sm:py-28">
        <div className="px-4 sm:px-6 lg:px-0">
          <SectionHeading
            badge="Passer a l'action"
            title="Comment se preparer des maintenant"
            description="Pas besoin d'attendre. Voici quatre actions concretes que vous pouvez commencer aujourd'hui."
          />

          <div className="mt-16 grid gap-8 sm:grid-cols-2">
            {preparations.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="flex gap-4">
                  {/* Number + icon */}
                  <div className="flex shrink-0 flex-col items-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 text-lg font-bold text-white shadow-lg shadow-brand-500/20">
                      {index + 1}
                    </div>
                    {index < preparations.length - 1 && (
                      <div className="mt-2 hidden h-full w-px bg-gradient-to-b from-brand-500/30 to-transparent sm:block" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="pb-8">
                    <div className="mb-1 flex items-center gap-2">
                      <Icon className="h-4 w-4 text-brand-700 dark:text-brand-400" aria-hidden="true" />
                      <h3 className="text-lg font-semibold">{item.title}</h3>
                    </div>
                    <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-300">
                      {item.description}
                    </p>
                    {item.link && (
                      <Link
                        href={item.link.href}
                        className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-brand-700 dark:text-brand-400 transition-colors hover:text-brand-700 dark:hover:text-brand-300"
                      >
                        {item.link.label}
                        <ArrowRight className="h-3 w-3" aria-hidden="true" />
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== TENDANCES A SUIVRE ===== */}
      <section className="py-20 sm:py-28">
        <div className="px-4 sm:px-6 lg:px-0">
          <AnimateOnScroll preset="fade-up">
            <SectionHeading
              badge="Tendances"
              title="Les tendances a suivre"
              description="Cinq evolutions majeures qui vont faconner l'ecosysteme IA dans les 12 a 24 prochains mois."
            />
          </AnimateOnScroll>

          <StaggerChildren className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" staggerDelay={0.08}>
            {trends.map((trend) => {
              const Icon = trend.icon;
              const colors = trendColorMap[trend.color];
              return (
                <div
                  key={trend.title}
                  className={`glass-card group relative overflow-hidden p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`}
                >
                  {/* Top accent bar */}
                  <div
                    className={`absolute inset-x-0 top-0 h-1 ${colors.bg}`}
                  />

                  <div className="mb-4 flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-lg ${colors.bg}`}
                    >
                      <Icon className={`h-5 w-5 ${colors.icon}`} aria-hidden="true" />
                    </div>
                    <div
                      className={`h-2 w-2 rounded-full ${colors.dot} animate-pulse`}
                    />
                  </div>

                  <h3 className="mb-2 text-lg font-semibold">{trend.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-300">
                    {trend.description}
                  </p>
                </div>
              );
            })}
          </StaggerChildren>

          <div className="mt-12">
            <Callout type="info" title="Restez informe">
              L&apos;ecosysteme evolue rapidement. Suivez le{" "}
              <Link
                href="https://github.com/anthropics/claude-code"
                className="font-medium text-brand-700 dark:text-brand-400 underline underline-offset-2 hover:text-brand-700 dark:hover:text-brand-300"
                target="_blank"
                rel="noopener noreferrer"
              >
                repository officiel de Claude Code
              </Link>{" "}
              et la documentation Anthropic pour ne rien manquer.
            </Callout>
          </div>
        </div>
      </section>

      {/* ===== ROADMAP DU SITE ===== */}
      <section className="bg-slate-50/50 py-20 dark:bg-slate-900/50 sm:py-28">
        <div className="px-4 sm:px-6 lg:px-0">
          <SectionHeading
            badge="Roadmap"
            title="Ce qui arrive sur The Claude Codex"
            description="Notre site evolue constamment. Voici ce que nous preparons pour vous."
          />

          {/* Visual timeline */}
          <div className="relative mx-auto mt-16 max-w-3xl">
            {/* Vertical line */}
            <div className="absolute left-6 top-0 hidden h-full w-px bg-gradient-to-b from-brand-500/50 via-accent-500/50 to-violet-500/50 sm:left-8 sm:block" />

            <div className="space-y-8">
              {roadmapItems.map((item, index) => {
                const Icon = item.icon;
                const isFirst = index === 0;
                return (
                  <div key={item.title} className="flex gap-4 sm:gap-6">
                    {/* Timeline dot */}
                    <div className="relative flex shrink-0 flex-col items-center">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-xl sm:h-16 sm:w-16 ${
                          isFirst
                            ? "bg-gradient-to-br from-brand-500 to-brand-600 shadow-lg shadow-brand-500/25"
                            : "border border-slate-200/60 bg-white/80 dark:border-slate-700/60 dark:bg-slate-800/80"
                        }`}
                      >
                        <Icon
                          className={`h-5 w-5 sm:h-6 sm:w-6 ${
                            isFirst ? "text-white" : "text-slate-500 dark:text-slate-300"
                          }`}
                          aria-hidden="true"
                        />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="glass-card flex-1 p-4 sm:p-5">
                      <div className="mb-1 flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold">{item.title}</h3>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            isFirst
                              ? "bg-brand-500/10 text-brand-700 dark:text-brand-400"
                              : "bg-slate-100 text-slate-500 dark:bg-slate-700/50 dark:text-slate-300"
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-300">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ===== APPEL A CONTRIBUER ===== */}
      <section className="relative overflow-hidden py-20 sm:py-28">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-950 via-slate-900 to-brand-900" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(6,182,212,0.15),_transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(245,158,11,0.1),_transparent_60%)]" />

        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-brand-500/10 px-4 py-1.5 text-sm text-brand-300">
            <Heart className="h-4 w-4" aria-hidden="true" />
            Open-source
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl">
            Construisons l&apos;avenir{" "}
            <span className="text-gradient">ensemble</span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300">
            The Claude Codex est un projet open-source. Chaque contribution
            compte, que ce soit une correction de faute, un nouveau tutoriel,
            une traduction ou une idee. Rejoignez-nous et aidez des milliers de
            personnes a maitriser l&apos;IA.
          </p>

          {/* Contribution cards */}
          <div className="mx-auto mt-12 grid max-w-2xl gap-4 text-left sm:grid-cols-3">
            <div className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-4 backdrop-blur">
              <GitBranch className="mb-2 h-5 w-5 text-brand-400" aria-hidden="true" />
              <h3 className="mb-1 text-sm font-semibold text-white">
                Fork & PR
              </h3>
              <p className="text-xs leading-relaxed text-slate-400">
                Clonez le repo, creez une branche, soumettez une pull request.
              </p>
            </div>
            <div className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-4 backdrop-blur">
              <Lightbulb className="mb-2 h-5 w-5 text-accent-400" aria-hidden="true" />
              <h3 className="mb-1 text-sm font-semibold text-white">
                Issues & Idees
              </h3>
              <p className="text-xs leading-relaxed text-slate-400">
                Signalez un bug, proposez une amelioration ou un nouveau
                chapitre.
              </p>
            </div>
            <div className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-4 backdrop-blur">
              <Mic className="mb-2 h-5 w-5 text-violet-400" aria-hidden="true" />
              <h3 className="mb-1 text-sm font-semibold text-white">
                Partagez
              </h3>
              <p className="text-xs leading-relaxed text-slate-400">
                Parlez du projet autour de vous, sur les reseaux sociaux ou dans
                vos equipes.
              </p>
            </div>
          </div>

          {/* CTA buttons */}
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="https://github.com/tellebma/The-Claude-Codex"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-sm font-semibold text-slate-900 shadow-lg transition-all hover:bg-slate-100"
            >
              <GitBranch className="h-4 w-4" aria-hidden="true" />
              Voir sur GitHub
              <ExternalLink className="h-3 w-3 opacity-50" aria-hidden="true" />
            </Link>
            <Link
              href="/getting-started"
              className="group inline-flex items-center gap-2 rounded-xl border border-slate-600 px-8 py-3.5 text-sm font-semibold text-white transition-all hover:border-slate-500 hover:bg-white/5"
            >
              <Rocket className="h-4 w-4" aria-hidden="true" />
              Commencer le guide
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
