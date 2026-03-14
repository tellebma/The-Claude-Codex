import Link from "next/link";
import {
  Wand2,
  BookOpen,
  FolderCog,
  Users,
  Terminal,
  ArrowRight,
  FlaskConical,
  Palette,
  SearchCheck,
  ClipboardList,
  TestTube2,
  ShieldCheck,
  Lightbulb,
  Layers,
  Rocket,
  FileCode2,
  ChevronRight,
  Sparkles,
  Boxes,
  Play,
  MessageSquare,
} from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Callout } from "@/components/ui/Callout";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AnimateOnScroll, StaggerChildren } from "@/components/ui/AnimateOnScroll";
import { createPageMetadata, SITE_URL } from "@/lib/metadata";
import { createArticleSchema, serializeJsonLd } from "@/lib/structured-data";

export const metadata = createPageMetadata({
  title: "Les Skills Claude Code",
  description:
    "Apprenez à utiliser et créer des Skills pour Claude Code. Automatisez vos workflows, ajoutez des capacités et enseignez de nouveaux talents à votre assistant IA.",
  path: "/skills",
});

const articleJsonLd = createArticleSchema({
  title: "Les Skills Claude Code",
  description:
    "Apprenez à utiliser et créer des Skills pour Claude Code.",
  url: `${SITE_URL}/skills`,
  datePublished: "2026-03-07",
  dateModified: "2026-03-10",
});

const topSkills = [
  {
    name: "TDD Guide",
    category: "Dev",
    categoryColor: "bg-brand-500/10 text-brand-700 dark:text-brand-400",
    icon: FlaskConical,
    iconColor: "text-brand-700 dark:text-brand-400",
    iconBg: "from-brand-500/20 to-brand-500/5",
    description:
      "Impose un workflow Test-Driven Development rigoureux : ecrire les tests d'abord, implementer le minimum pour les faire passer, puis refactorer.",
    useCase:
      "Vous demandez une nouvelle feature et Claude ecrit automatiquement les tests avant le code.",
  },
  {
    name: "Frontend Design",
    category: "Design",
    categoryColor: "bg-violet-500/10 text-violet-500",
    icon: Palette,
    iconColor: "text-violet-500",
    iconBg: "from-violet-500/20 to-violet-500/5",
    description:
      "Genere des composants UI modernes, accessibles et responsives avec Tailwind CSS, en respectant les bonnes pratiques de design system.",
    useCase:
      "Claude cree un formulaire de contact avec validation, animations et dark mode integre.",
  },
  {
    name: "Code Reviewer",
    category: "Qualite",
    categoryColor: "bg-emerald-500/10 text-emerald-500",
    icon: SearchCheck,
    iconColor: "text-emerald-500",
    iconBg: "from-emerald-500/20 to-emerald-500/5",
    description:
      "Revue de code automatique qui detecte les bugs, les problemes de performance, les failles de securite et les violations de conventions.",
    useCase:
      "Apres chaque modification, Claude analyse le code et signale les problemes classes par severite.",
  },
  {
    name: "Plan",
    category: "Process",
    categoryColor: "bg-accent-500/10 text-accent-500",
    icon: ClipboardList,
    iconColor: "text-accent-500",
    iconBg: "from-accent-500/20 to-accent-500/5",
    description:
      "Cree un plan d'implementation structure avant de coder : PRD, architecture, design systeme, liste de taches priorisees.",
    useCase:
      "Avant un refactoring majeur, Claude produit un plan detaille avec les risques et les dependances.",
  },
  {
    name: "E2E Testing",
    category: "Testing",
    categoryColor: "bg-sky-500/10 text-sky-500",
    icon: TestTube2,
    iconColor: "text-sky-500",
    iconBg: "from-sky-500/20 to-sky-500/5",
    description:
      "Genere des tests end-to-end avec Playwright qui simulent de vrais parcours utilisateurs dans le navigateur.",
    useCase:
      "Claude ecrit un test complet pour le flow d'inscription : formulaire, email de confirmation, premiere connexion.",
  },
  {
    name: "Security Review",
    category: "Securite",
    categoryColor: "bg-red-500/10 text-red-500",
    icon: ShieldCheck,
    iconColor: "text-red-500",
    iconBg: "from-red-500/20 to-red-500/5",
    description:
      "Analyse de securite systematique : injection SQL, XSS, CSRF, secrets en clair, dependances vulnerables, mauvaises configurations.",
    useCase:
      "Avant chaque commit, Claude verifie qu'aucun secret n'est expose et que les inputs sont valides.",
  },
];

const useCases = [
  {
    icon: Rocket,
    title: "Lancer un MVP en mode TDD",
    description:
      "Un entrepreneur utilise le Skill \"Plan\" pour structurer son projet, puis \"TDD Guide\" pour implementer chaque feature avec des tests solides. Resultat : un MVP fiable en 3 jours au lieu de 3 semaines.",
    skills: ["Plan", "TDD Guide", "Code Reviewer"],
  },
  {
    icon: Layers,
    title: "Refactoring securise d'une codebase legacy",
    description:
      "Un lead developer combine \"Security Review\" pour identifier les failles existantes, \"E2E Testing\" pour ajouter une couverture de tests avant de toucher au code, puis \"Code Reviewer\" pour valider chaque changement.",
    skills: ["Security Review", "E2E Testing", "Code Reviewer"],
  },
  {
    icon: Sparkles,
    title: "Creer un design system coherent",
    description:
      "Une equipe utilise \"Frontend Design\" pour generer des composants UI consistants, puis cree un Skill personnalise qui encode les conventions de leur charte graphique. Chaque nouveau composant respecte automatiquement le systeme.",
    skills: ["Frontend Design", "Skill personnalise"],
  },
];

export default function SkillsPage() {
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

        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-20 sm:px-6 sm:pb-24 sm:pt-28 lg:px-8 lg:pb-28 lg:pt-32">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-brand-500/10 px-4 py-1.5 text-sm text-brand-300">
              <Wand2 className="h-4 w-4" />
              Guide Skills
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Les Skills : Enseignez de{" "}
              <span className="text-gradient">nouveaux talents</span>
              <br className="hidden sm:block" />
              {" "}a Claude Code
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300 sm:text-xl">
              Les Skills transforment Claude Code en un assistant specialise.
              Ajoutez des capacites, automatisez vos workflows et creez vos
              propres recettes reutilisables.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href="#tutorial"
                className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-500/25 transition-all hover:shadow-xl hover:shadow-brand-500/30"
              >
                Creer votre premier Skill
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href="#top-skills"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-600 px-8 py-3.5 text-sm font-semibold text-slate-200 transition-all hover:border-slate-500 hover:bg-white/5"
              >
                Voir les Skills recommandes
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ===== QU'EST-CE QU'UN SKILL ? ===== */}
      <section className="py-20 sm:py-28">
        <div className="px-4 sm:px-6 lg:px-0">
          <AnimateOnScroll preset="fade-up">
            <SectionHeading
              badge="Concept"
              title="Qu'est-ce qu'un Skill ?"
              description="Comprendre les Skills en 2 minutes, meme si vous n'etes pas developpeur."
            />
          </AnimateOnScroll>

          <div className="mt-16">
            <div className="glass-card p-8 sm:p-10">
              <div className="flex items-start gap-4">
                <div className="hidden shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500/20 to-brand-500/5 p-3 sm:flex">
                  <BookOpen className="h-6 w-6 text-brand-700 dark:text-brand-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold sm:text-2xl">
                    Un Skill, c&apos;est une recette pour Claude
                  </h3>
                  <p className="mt-4 leading-relaxed text-slate-600 dark:text-slate-300">
                    Imaginez que Claude Code est un chef cuisinier talentueux. Il
                    sait deja cuisiner, mais si vous lui donnez une{" "}
                    <strong className="text-slate-900 dark:text-white">
                      recette precise
                    </strong>
                    , il produira exactement le plat que vous voulez, a chaque
                    fois. Les Skills sont ces recettes : des{" "}
                    <strong className="text-slate-900 dark:text-white">
                      instructions structurees
                    </strong>{" "}
                    qui guident Claude pour executer des taches complexes de
                    maniere reproductible.
                  </p>
                  <p className="mt-4 leading-relaxed text-slate-600 dark:text-slate-300">
                    Concretement, un Skill est un{" "}
                    <strong className="text-slate-900 dark:text-white">
                      fichier Markdown
                    </strong>{" "}
                    qui definit un workflow, des regles et des etapes a suivre.
                    Quand vous invoquez un Skill, Claude le charge en memoire et
                    adapte son comportement en consequence. C&apos;est comme un{" "}
                    <strong className="text-slate-900 dark:text-white">
                      plugin
                    </strong>{" "}
                    que vous pouvez activer a la demande.
                  </p>
                </div>
              </div>
            </div>

            <Callout type="tip" title="Analogie simple">
              Si les MCP sont les <strong>outils</strong> de Claude (marteau,
              tournevis, perceuse), les Skills sont les{" "}
              <strong>modes d&apos;emploi</strong> qui lui expliquent{" "}
              <em>comment</em> et <em>quand</em> utiliser ces outils ensemble
              pour accomplir une tache complexe.
            </Callout>
          </div>
        </div>
      </section>

      {/* ===== TYPES DE SKILLS ===== */}
      <section className="bg-slate-50/50 py-20 dark:bg-slate-900/50 sm:py-28">
        <div className="px-4 sm:px-6 lg:px-0">
          <SectionHeading
            badge="Categories"
            title="Les trois types de Skills"
            description="Chaque type repond a un besoin different. Combinez-les pour un maximum d'efficacite."
          />

          <div className="mt-16 grid gap-8 lg:grid-cols-3">
            {/* Built-in Skills */}
            <div className="glass-card p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500/20 to-brand-500/5">
                <Users className="h-6 w-6 text-brand-700 dark:text-brand-400" />
              </div>
              <h3 className="mb-2 text-xl font-bold">Built-in Skills</h3>
              <p className="mb-4 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                Fournis par la communaute et les outils, ces Skills sont
                disponibles immediatement. Ils couvrent les workflows les plus
                courants : TDD, code review, planning, etc.
              </p>
              <CodeBlock
                code={`# Utiliser un skill built-in
> /tdd-guide
> /code-reviewer
> /planner`}
                language="bash"
                filename="terminal"
              />
              <div className="mt-4 flex items-center gap-2 text-sm text-brand-700 dark:text-brand-400">
                <Boxes className="h-4 w-4" />
                <span>Prets a l&apos;emploi, maintenus par la communaute</span>
              </div>
            </div>

            {/* Custom Skills */}
            <div className="glass-card p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-accent-500/20 to-accent-500/5">
                <FolderCog className="h-6 w-6 text-accent-500" />
              </div>
              <h3 className="mb-2 text-xl font-bold">Custom Skills</h3>
              <p className="mb-4 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                Crees par vous dans le dossier{" "}
                <code className="rounded bg-slate-200/80 px-1.5 py-0.5 text-xs font-mono dark:bg-slate-700/80">
                  ~/.claude/commands/
                </code>
                . Ils sont disponibles dans tous vos projets et refletent vos
                preferences personnelles.
              </p>
              <CodeBlock
                code={`# Structure des custom skills
~/.claude/
  commands/
    my-api-pattern.md
    react-component.md
    deploy-checklist.md`}
                language="bash"
                filename="structure"
              />
              <div className="mt-4 flex items-center gap-2 text-sm text-accent-500">
                <Lightbulb className="h-4 w-4" />
                <span>Personnels, disponibles partout</span>
              </div>
            </div>

            {/* Project Skills */}
            <div className="glass-card p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/20 to-violet-500/5">
                <FileCode2 className="h-6 w-6 text-violet-500" />
              </div>
              <h3 className="mb-2 text-xl font-bold">Project Skills</h3>
              <p className="mb-4 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                Definis dans le fichier{" "}
                <code className="rounded bg-slate-200/80 px-1.5 py-0.5 text-xs font-mono dark:bg-slate-700/80">
                  CLAUDE.md
                </code>{" "}
                ou le dossier{" "}
                <code className="rounded bg-slate-200/80 px-1.5 py-0.5 text-xs font-mono dark:bg-slate-700/80">
                  .claude/
                </code>{" "}
                de votre projet. Partages avec toute l&apos;equipe via Git.
              </p>
              <CodeBlock
                code={`# Skills de projet
mon-projet/
  .claude/
    commands/
      api-convention.md
      db-migration.md
  CLAUDE.md  # instructions globales`}
                language="bash"
                filename="structure"
              />
              <div className="mt-4 flex items-center gap-2 text-sm text-violet-500">
                <Users className="h-4 w-4" />
                <span>Partages en equipe, specifiques au projet</span>
              </div>
            </div>
          </div>

          <Callout type="info" title="Ordre de priorite">
            Quand plusieurs Skills coexistent, Claude applique les Project
            Skills en priorite (specifiques au contexte), puis les Custom Skills
            (vos preferences), puis les Built-in Skills. Cela vous permet de
            surcharger un comportement par defaut avec vos propres conventions.
          </Callout>
        </div>
      </section>

      {/* ===== COMMENT UTILISER UN SKILL ===== */}
      <section className="py-20 sm:py-28">
        <div className="px-4 sm:px-6 lg:px-0">
          <SectionHeading
            badge="Utilisation"
            title="Comment utiliser un Skill"
            description="Deux manieres d'activer un Skill : l'invocation explicite et l'activation automatique."
          />

          <div className="mt-16 space-y-12">
            {/* Explicit invocation */}
            <div>
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500/20 to-brand-500/5">
                  <Terminal className="h-4 w-4 text-brand-700 dark:text-brand-400" />
                </div>
                <h3 className="text-xl font-bold">
                  Invocation explicite avec{" "}
                  <code className="rounded bg-slate-200/80 px-2 py-1 text-lg font-mono dark:bg-slate-700/80">
                    /
                  </code>
                </h3>
              </div>
              <p className="mb-4 leading-relaxed text-slate-600 dark:text-slate-300">
                La maniere la plus directe d&apos;utiliser un Skill est de le
                prefixer avec{" "}
                <code className="rounded bg-slate-200/80 px-1.5 py-0.5 text-sm font-mono dark:bg-slate-700/80">
                  /
                </code>{" "}
                dans votre prompt. Claude chargera les instructions du Skill et
                les appliquera immediatement.
              </p>
              <CodeBlock
                code={`# Invoquer un Skill directement
> /tdd-guide Implemente une fonction de validation d'email

# Claude va alors :
# 1. Charger les instructions du Skill "tdd-guide"
# 2. Ecrire les tests en premier (RED)
# 3. Implementer le minimum pour passer les tests (GREEN)
# 4. Refactorer si necessaire (IMPROVE)

# Autre exemple avec le Skill "plan"
> /plan Refactoring du module d'authentification

# Claude va produire un plan structure avant de toucher au code`}
                language="bash"
                filename="terminal"
              />
            </div>

            {/* Automatic activation */}
            <div>
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-accent-500/20 to-accent-500/5">
                  <Sparkles className="h-4 w-4 text-accent-500" />
                </div>
                <h3 className="text-xl font-bold">Activation automatique</h3>
              </div>
              <p className="mb-4 leading-relaxed text-slate-600 dark:text-slate-300">
                Certains Skills s&apos;activent automatiquement selon le
                contexte. Par exemple, si votre fichier{" "}
                <code className="rounded bg-slate-200/80 px-1.5 py-0.5 text-sm font-mono dark:bg-slate-700/80">
                  CLAUDE.md
                </code>{" "}
                contient des instructions, Claude les applique
                systematiquement sans que vous ayez besoin de le demander.
              </p>
              <CodeBlock
                code={`# Exemple de CLAUDE.md avec des Skills automatiques
# Ce fichier est lu automatiquement par Claude a chaque session

## Conventions de code
- Toujours utiliser TypeScript strict
- Pas de \`any\`, utiliser \`unknown\` a la place
- Tests obligatoires pour toute nouvelle fonction

## Style
- Immutabilite : jamais de mutation directe
- Fichiers < 400 lignes
- Fonctions < 50 lignes

## Avant chaque commit
- Lancer le code-reviewer agent
- Verifier la couverture de tests (80%+)
- Aucun secret en dur dans le code`}
                language="markdown"
                filename="CLAUDE.md"
              />
            </div>

            <Callout type="tip" title="Combiner les deux approches">
              La strategie la plus efficace est de definir vos conventions
              generales dans{" "}
              <code className="rounded bg-emerald-200/50 px-1 py-0.5 text-xs font-mono dark:bg-emerald-800/30">
                CLAUDE.md
              </code>{" "}
              (activation automatique) et d&apos;invoquer les Skills specifiques
              avec{" "}
              <code className="rounded bg-emerald-200/50 px-1 py-0.5 text-xs font-mono dark:bg-emerald-800/30">
                /skill-name
              </code>{" "}
              pour les taches ponctuelles. Vous obtenez ainsi un comportement de
              base coherent avec la flexibilite d&apos;activer des workflows
              specialises a la demande.
            </Callout>
          </div>
        </div>
      </section>

      {/* ===== TOP SKILLS RECOMMANDES ===== */}
      <section
        id="top-skills"
        className="bg-slate-50/50 py-20 dark:bg-slate-900/50 sm:py-28"
      >
        <div className="px-4 sm:px-6 lg:px-0">
          <AnimateOnScroll preset="fade-up">
            <SectionHeading
              badge="Selection"
              title="Top Skills recommandes"
              description="Les 6 Skills incontournables pour transformer votre workflow de developpement."
            />
          </AnimateOnScroll>

          <StaggerChildren className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" staggerDelay={0.08}>
            {topSkills.map((skill) => {
              const Icon = skill.icon;
              return (
                <div
                  key={skill.name}
                  className="glass-card group flex flex-col p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="mb-4 flex items-start justify-between">
                    <div
                      className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${skill.iconBg}`}
                    >
                      <Icon className={`h-6 w-6 ${skill.iconColor}`} />
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${skill.categoryColor}`}
                    >
                      {skill.category}
                    </span>
                  </div>
                  <h3 className="mb-2 text-lg font-bold">{skill.name}</h3>
                  <p className="mb-4 flex-1 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                    {skill.description}
                  </p>
                  <div className="rounded-lg border border-slate-200/60 bg-slate-50/80 p-3 dark:border-slate-700/60 dark:bg-slate-800/50">
                    <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
                      <Play className="h-3 w-3" />
                      Exemple d&apos;utilisation
                    </div>
                    <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                      {skill.useCase}
                    </p>
                  </div>
                </div>
              );
            })}
          </StaggerChildren>
        </div>
      </section>

      {/* ===== TUTORIAL ===== */}
      <section id="tutorial" className="py-20 sm:py-28">
        <div className="px-4 sm:px-6 lg:px-0">
          <SectionHeading
            badge="Tutorial"
            title="Creez votre premier Skill en 10 minutes"
            description="Un guide pas-a-pas pour creer un Skill personnalise qui automatise la creation de composants React."
          />

          <div className="mt-16 space-y-10">
            {/* Step 1 */}
            <div className="flex gap-4 sm:gap-6">
              <div className="flex shrink-0 flex-col items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-600 text-sm font-bold text-white shadow-lg shadow-brand-500/25">
                  1
                </div>
                <div className="mt-2 h-full w-px bg-slate-200 dark:bg-slate-700" />
              </div>
              <div className="pb-10">
                <h3 className="text-xl font-bold">
                  Creer le dossier Skills
                </h3>
                <p className="mt-2 leading-relaxed text-slate-600 dark:text-slate-300">
                  Si ce n&apos;est pas deja fait, creez le dossier qui
                  contiendra vos Skills personnalises.
                </p>
                <CodeBlock
                  code={`mkdir -p ~/.claude/commands`}
                  language="bash"
                  filename="terminal"
                />
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-4 sm:gap-6">
              <div className="flex shrink-0 flex-col items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-600 text-sm font-bold text-white shadow-lg shadow-brand-500/25">
                  2
                </div>
                <div className="mt-2 h-full w-px bg-slate-200 dark:bg-slate-700" />
              </div>
              <div className="pb-10">
                <h3 className="text-xl font-bold">
                  Creer le fichier du Skill
                </h3>
                <p className="mt-2 leading-relaxed text-slate-600 dark:text-slate-300">
                  Creez un fichier Markdown avec un nom descriptif. Ici, on
                  va creer un Skill pour generer des composants React
                  standardises.
                </p>
                <CodeBlock
                  code={`touch ~/.claude/commands/react-component.md`}
                  language="bash"
                  filename="terminal"
                />
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-4 sm:gap-6">
              <div className="flex shrink-0 flex-col items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-600 text-sm font-bold text-white shadow-lg shadow-brand-500/25">
                  3
                </div>
                <div className="mt-2 h-full w-px bg-slate-200 dark:bg-slate-700" />
              </div>
              <div className="pb-10">
                <h3 className="text-xl font-bold">
                  Ecrire les instructions du Skill
                </h3>
                <p className="mt-2 leading-relaxed text-slate-600 dark:text-slate-300">
                  Un bon Skill contient : un titre clair, une description de
                  son objectif, les etapes a suivre, et des exemples concrets.
                  Voici un exemple complet.
                </p>
                <CodeBlock
                  code={`# React Component Generator

## Objectif
Generer un composant React TypeScript standardise avec les bonnes
pratiques de l'equipe.

## Regles
- Toujours utiliser TypeScript strict (pas de \`any\`)
- Composant fonctionnel avec export nomme
- Props definies dans une interface dediee
- Utiliser Tailwind CSS pour le styling
- Inclure les attributs d'accessibilite (aria-*)
- Fichier < 200 lignes, sinon decomposer

## Etapes
1. Creer l'interface des props avec JSDoc
2. Creer le composant fonctionnel
3. Ajouter les classes Tailwind responsive (mobile-first)
4. Ajouter les attributs d'accessibilite
5. Exporter le composant (export nomme, pas default)
6. Creer le fichier de test unitaire associe

## Structure attendue
\`\`\`
components/
  MonComposant/
    MonComposant.tsx       # Le composant
    MonComposant.test.tsx  # Les tests
    index.ts              # Re-export
\`\`\`

## Exemple de sortie
\`\`\`tsx
interface ButtonProps {
  /** Le texte affiche dans le bouton */
  label: string;
  /** Variante visuelle du bouton */
  variant?: "primary" | "secondary" | "ghost";
  /** Callback au clic */
  onClick?: () => void;
  /** Desactiver le bouton */
  disabled?: boolean;
}

export function Button({
  label,
  variant = "primary",
  onClick,
  disabled = false,
}: ButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-disabled={disabled}
      className={cn(
        "rounded-lg px-4 py-2 font-medium transition-colors",
        variants[variant]
      )}
    >
      {label}
    </button>
  );
}
\`\`\``}
                  language="markdown"
                  filename="~/.claude/commands/react-component.md"
                />
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex gap-4 sm:gap-6">
              <div className="flex shrink-0 flex-col items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-600 text-sm font-bold text-white shadow-lg shadow-brand-500/25">
                  4
                </div>
                <div className="mt-2 h-full w-px bg-slate-200 dark:bg-slate-700" />
              </div>
              <div className="pb-10">
                <h3 className="text-xl font-bold">
                  Tester votre Skill
                </h3>
                <p className="mt-2 leading-relaxed text-slate-600 dark:text-slate-300">
                  Lancez Claude Code et invoquez votre nouveau Skill. Il sera
                  automatiquement detecte et disponible.
                </p>
                <CodeBlock
                  code={`# Lancer Claude Code
$ claude

# Invoquer votre Skill personnalise
> /react-component Cree un composant Avatar avec image, fallback
> initiales et indicateur de statut en ligne

# Claude va suivre toutes les regles definies dans votre Skill :
# - Interface TypeScript stricte
# - Tailwind CSS responsive
# - Attributs d'accessibilite
# - Fichier de test associe
# - Structure de dossier standardisee`}
                  language="bash"
                  filename="terminal"
                />
              </div>
            </div>

            {/* Step 5 */}
            <div className="flex gap-4 sm:gap-6">
              <div className="flex shrink-0 flex-col items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-accent-500 to-accent-600 text-sm font-bold text-white shadow-lg shadow-accent-500/25">
                  5
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold">
                  Iterer et affiner
                </h3>
                <p className="mt-2 leading-relaxed text-slate-600 dark:text-slate-300">
                  Un Skill n&apos;est jamais parfait du premier coup. Utilisez-le
                  plusieurs fois, observez les resultats, et ajustez les
                  instructions. Ajoutez des regles quand vous remarquez un
                  pattern recurrent.
                </p>
                <Callout type="tip" title="Conseil de pro">
                  Versionez vos Skills avec Git ! Creez un repository dedie
                  pour vos fichiers{" "}
                  <code className="rounded bg-emerald-200/50 px-1 py-0.5 text-xs font-mono dark:bg-emerald-800/30">
                    ~/.claude/commands/
                  </code>{" "}
                  et partagez-les avec votre equipe. Chaque amelioration
                  profite a tout le monde.
                </Callout>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CAS D'USAGE ===== */}
      <section className="bg-slate-50/50 py-20 dark:bg-slate-900/50 sm:py-28">
        <div className="px-4 sm:px-6 lg:px-0">
          <SectionHeading
            badge="En pratique"
            title="Les Skills en action"
            description="Trois exemples concrets qui montrent la puissance des Skills combines dans des scenarios reels."
          />

          <div className="mt-16 grid gap-8 lg:grid-cols-3">
            {useCases.map((useCase) => {
              const Icon = useCase.icon;
              return (
                <div
                  key={useCase.title}
                  className="glass-card flex flex-col p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500/20 to-brand-500/5">
                    <Icon className="h-6 w-6 text-brand-700 dark:text-brand-400" />
                  </div>
                  <h3 className="mb-3 text-lg font-bold">{useCase.title}</h3>
                  <p className="mb-6 flex-1 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                    {useCase.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {useCase.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full bg-brand-500/10 px-3 py-1 text-xs font-semibold text-brand-700 dark:text-brand-400"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <Callout type="warning" title="Skills et tokens">
            Chaque Skill charge ajoute du contexte a la conversation de Claude.
            Evitez d&apos;invoquer trop de Skills simultanement pour ne pas
            surcharger la fenetre de contexte. Preferez combiner 2-3 Skills
            complementaires plutot que d&apos;en activer une dizaine.
          </Callout>
        </div>
      </section>

      {/* ===== NEXT STEPS ===== */}
      <section className="relative overflow-hidden py-20 sm:py-28">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-950 via-slate-900 to-brand-900" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(6,182,212,0.15),_transparent_70%)]" />

        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <SectionHeading
            badge="Etapes suivantes"
            title="Continuez votre apprentissage"
            description="Maintenant que vous maitrisez les Skills, explorez les deux autres piliers de Claude Code."
            centered
          />

          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            <Link
              href="/prompting"
              className="glass-card group flex items-start gap-4 p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-accent-500/20 to-accent-500/5">
                <MessageSquare className="h-6 w-6 text-accent-500" />
              </div>
              <div>
                <h3 className="mb-1 text-lg font-bold text-white">
                  Prompting avance
                </h3>
                <p className="text-sm leading-relaxed text-slate-400">
                  Apprenez a formuler vos demandes pour obtenir des resultats
                  optimaux. Techniques de prompt engineering adaptees a Claude
                  Code.
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand-400 transition-colors group-hover:text-brand-300">
                  Decouvrir
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>

            <Link
              href="/mcp"
              className="glass-card group flex items-start gap-4 p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/20 to-violet-500/5">
                <Boxes className="h-6 w-6 text-violet-500" />
              </div>
              <div>
                <h3 className="mb-1 text-lg font-bold text-white">
                  Les MCP (Model Context Protocol)
                </h3>
                <p className="text-sm leading-relaxed text-slate-400">
                  Connectez Claude Code a vos outils : GitHub, Slack,
                  bases de donnees, APIs. Etendez ses capacites a l&apos;infini.
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand-400 transition-colors group-hover:text-brand-300">
                  Decouvrir
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
