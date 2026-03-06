import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  MessageSquare,
  Target,
  UserCheck,
  FileOutput,
  ListChecks,
  RefreshCcw,
  Globe,
  FileText,
  Zap,
  BarChart3,
  PenTool,
  XCircle,
  CheckCircle,
  Layers,
  Bot,
  BookOpen,
  ChevronRight,
  Sparkles,
  BrainCircuit,
  Link2,
} from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Callout } from "@/components/ui/Callout";
import { CodeBlock } from "@/components/ui/CodeBlock";

export const metadata: Metadata = {
  title: "Prompting",
  description:
    "Maitrisez l'art du prompting avec Claude Code. Techniques, templates et bonnes pratiques pour tirer le maximum de l'IA.",
};

const principles = [
  {
    icon: Target,
    title: "Soyez specifique",
    description:
      "Fournissez du contexte et des contraintes claires. Plus votre prompt est precis, plus la reponse sera pertinente.",
    example: `# Vague
"Fais-moi un formulaire"

# Specifique
"Cree un formulaire de contact en React avec TypeScript.
Champs : nom (requis), email (requis, valide), message (requis, min 20 caracteres).
Utilise react-hook-form avec validation Zod.
Style avec Tailwind CSS, responsive mobile-first.
Affiche un toast de confirmation apres envoi."`,
  },
  {
    icon: UserCheck,
    title: "Definissez un role",
    description:
      "Donnez une identite a Claude pour cadrer ses reponses. Le role influence le niveau de detail, le vocabulaire et l'approche.",
    example: `"Tu es un architecte logiciel senior specialise en React et Next.js.
Tu privilegies la maintenabilite, la performance et les bonnes pratiques.
Tu commentes ton code en francais et tu expliques chaque decision d'architecture."`,
  },
  {
    icon: FileOutput,
    title: "Specifiez le format attendu",
    description:
      "Indiquez clairement la structure de la reponse souhaitee : code, liste, tableau, JSON, markdown, etc.",
    example: `"Genere la reponse au format suivant :
1. Un resume en 2-3 phrases
2. Le code complet avec commentaires inline
3. Un tableau des dependances necessaires (nom | version | usage)
4. Les instructions d'installation etape par etape"`,
  },
  {
    icon: ListChecks,
    title: "Donnez des exemples (few-shot)",
    description:
      "Montrez a Claude ce que vous attendez avec des exemples concrets. C'est la technique la plus puissante pour obtenir le format exact souhaite.",
    example: `"Genere des noms de variables en suivant ce pattern :

Exemple 1 : utilisateur connecte → isUserLoggedIn
Exemple 2 : nombre de produits dans le panier → cartItemCount
Exemple 3 : date de derniere mise a jour → lastUpdatedAt

Maintenant, genere pour :
- formulaire en cours de soumission
- erreur de validation de l'email
- liste des commandes filtrees"`,
  },
  {
    icon: RefreshCcw,
    title: "Iterez et affinez",
    description:
      "Le prompting est un dialogue. Affinez progressivement vos demandes en fonction des reponses obtenues.",
    example: `# Iteration 1
"Cree un composant Button"

# Iteration 2
"Ajoute les variantes : primary, secondary, ghost et danger"

# Iteration 3
"Ajoute le support des icones a gauche et a droite,
un etat loading avec un spinner, et la prop disabled"

# Iteration 4
"Ajoute les tests unitaires avec Testing Library
et les stories Storybook pour chaque variante"`,
  },
];

const templates = [
  {
    icon: Globe,
    category: "Developpement web",
    color: "text-brand-700 dark:text-brand-400",
    bgColor: "bg-brand-500/10",
    description:
      "Pour creer des composants, des pages ou des fonctionnalites web completes.",
    code: `Tu es un developpeur senior React/Next.js/TypeScript.

Cree un composant React qui [DESCRIPTION DU COMPOSANT].

Contexte technique :
- Framework : Next.js 14 (App Router)
- Langage : TypeScript (strict mode)
- Style : Tailwind CSS
- State management : [zustand / React Context / aucun]

Specifications fonctionnelles :
- [Fonctionnalite 1]
- [Fonctionnalite 2]
- [Fonctionnalite 3]

Contraintes :
- Responsive mobile-first
- Accessible (ARIA, focus management)
- Performance optimisee (memo, lazy loading si necessaire)
- Gestion des erreurs et etats de chargement

Genere le code complet avec :
1. Le composant principal
2. Les types/interfaces TypeScript
3. Un exemple d'utilisation
4. Les tests unitaires (Vitest + Testing Library)`,
    filename: "template-web-dev.txt",
  },
  {
    icon: FileText,
    category: "Documentation",
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    description:
      "Pour generer de la documentation technique claire et structuree.",
    code: `Tu es un redacteur technique senior.

Redige la documentation technique pour [NOM DU PROJET/MODULE].

Public cible : [developpeurs juniors / equipe interne / open-source]

Structure attendue :
1. Vue d'ensemble (2-3 phrases)
2. Installation et prerequis
3. Configuration
4. Guide de demarrage rapide (Quick Start)
5. Reference API (chaque fonction avec parametres, retour, exemple)
6. Exemples d'utilisation avances
7. FAQ et depannage

Conventions :
- Exemples de code en [TypeScript/Python/etc.]
- Tous les snippets doivent etre copiables et fonctionnels
- Utilise des admonitions (note, warning, tip) quand pertinent
- Inclus un sommaire navigable en debut de document`,
    filename: "template-documentation.txt",
  },
  {
    icon: Zap,
    category: "Automatisation",
    color: "text-accent-500",
    bgColor: "bg-accent-500/10",
    description:
      "Pour creer des scripts et pipelines d'automatisation robustes.",
    code: `Tu es un ingenieur DevOps/SRE senior.

Cree un script qui automatise [DESCRIPTION DE LA TACHE].

Environnement :
- OS : [Linux/macOS/Windows]
- Langage : [Bash/Python/Node.js]
- Outils disponibles : [Docker, GitHub Actions, etc.]

Fonctionnement attendu :
1. [Etape 1 du processus]
2. [Etape 2 du processus]
3. [Etape 3 du processus]

Exigences :
- Gestion d'erreurs robuste (exit codes, try/catch)
- Logging avec niveaux (info, warn, error)
- Mode dry-run pour tester sans executer
- Variables configurables via .env ou arguments CLI
- Idempotent (peut etre relance sans effet de bord)

Genere :
1. Le script complet et commente
2. Le fichier .env.example
3. Le README d'utilisation
4. Un exemple de cron/schedule si pertinent`,
    filename: "template-automatisation.txt",
  },
  {
    icon: BarChart3,
    category: "Analyse de donnees",
    color: "text-violet-500",
    bgColor: "bg-violet-500/10",
    description:
      "Pour explorer, transformer et visualiser des donnees efficacement.",
    code: `Tu es un data analyst senior expert en Python.

Analyse ce dataset CSV et [OBJECTIF DE L'ANALYSE].

Informations sur les donnees :
- Source : [description de la source]
- Colonnes principales : [col1, col2, col3, ...]
- Volume : [nombre de lignes approximatif]
- Periode : [plage temporelle des donnees]

Analyse demandee :
1. Exploration : statistiques descriptives, valeurs manquantes, distributions
2. Nettoyage : gestion des outliers, normalisation, encodage
3. Analyse : [correlations / tendances / segmentation / prediction]
4. Visualisation : graphiques pertinents avec matplotlib/seaborn

Format de sortie :
- Code Python complet (pandas, numpy, matplotlib)
- Commentaires expliquant chaque etape
- Interpretation des resultats en langage non-technique
- Recommandations basees sur les insights`,
    filename: "template-data-analysis.txt",
  },
  {
    icon: PenTool,
    category: "Creation de contenu",
    color: "text-rose-500",
    bgColor: "bg-rose-500/10",
    description:
      "Pour rediger du contenu structure, engageant et optimise.",
    code: `Tu es un redacteur web senior specialise en [DOMAINE].

Redige un article de blog sur [SUJET].

Parametres :
- Ton : [professionnel / decontracte / pedagogique]
- Longueur : [800-1200 mots]
- Public cible : [description du lecteur type]
- Objectif : [informer / convaincre / tutoriel]

Structure :
1. Titre accrocheur (max 60 caracteres)
2. Introduction avec hook (probleme/question)
3. 3-5 sections avec sous-titres H2
4. Exemples concrets et donnees chiffrees
5. Conclusion avec call-to-action

SEO :
- Mot-cle principal : [mot-cle]
- Mots-cles secondaires : [mot-cle-2, mot-cle-3]
- Meta description (max 155 caracteres)
- Suggestions de liens internes

Contraintes :
- Pas de jargon inutile
- Phrases courtes (max 20 mots)
- Un paragraphe = une idee
- Inclure des listes a puces pour la lisibilite`,
    filename: "template-contenu.txt",
  },
];

const mistakes = [
  {
    title: "Trop vague",
    bad: `"Fais-moi un site web"`,
    good: `"Cree une landing page pour une app SaaS de gestion de projet.
Stack : Next.js 14, TypeScript, Tailwind CSS.
Sections : hero avec CTA, features (3 colonnes), pricing (3 plans), FAQ accordion.
Design : moderne, dark mode, animations subtiles au scroll."`,
    tip: "Plus vous etes precis, moins vous aurez d'iterations a faire.",
  },
  {
    title: "Pas de contexte",
    bad: `"Corrige ce bug"`,
    good: `"J'ai une erreur 'TypeError: Cannot read property map of undefined'
dans mon composant ProductList.tsx (ligne 42).
Ce composant recoit un prop 'products' depuis une API REST.
L'erreur apparait uniquement au premier rendu, avant que l'API reponde.
Voici le composant : [code]"`,
    tip: "Donnez toujours le contexte : fichier, erreur exacte, comportement attendu vs obtenu.",
  },
  {
    title: "Tout demander d'un coup",
    bad: `"Cree-moi une app complete avec auth, dashboard, API, base de donnees, tests, CI/CD et deploiement"`,
    good: `"Commencons par la base de donnees.
Cree le schema Prisma pour une app de gestion de taches avec :
- Table User (id, email, name, createdAt)
- Table Project (id, name, ownerId, createdAt)
- Table Task (id, title, status, projectId, assigneeId, dueDate)
Relations : User 1-N Project, Project 1-N Task, User 1-N Task"`,
    tip: "Decomposez les gros projets en etapes. Une demande claire = une reponse precise.",
  },
  {
    title: "Ne pas iterer",
    bad: `"Ce n'est pas ce que je voulais" (sans plus de details)`,
    good: `"Le composant est bien structure, mais j'aimerais 3 modifications :
1. Remplace le bouton bleu par un gradient teal-to-cyan
2. Ajoute une animation fadeIn au montage du composant
3. Le champ email doit valider le format en temps reel (pas seulement au submit)"`,
    tip: "Dites precisement ce qui est bien, ce qui ne va pas, et ce que vous voulez changer.",
  },
];

export default function PromptingPage() {
  return (
    <>
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

        <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-20 sm:px-6 sm:pb-28 sm:pt-28 lg:px-8 lg:pb-36 lg:pt-32">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-brand-500/10 px-4 py-1.5 text-sm text-brand-300">
              <MessageSquare className="h-4 w-4" />
              Guide du prompting
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl">
              L&apos;art du{" "}
              <span className="text-gradient">prompting</span>
              <br />
              avec Claude Code
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300 sm:text-xl">
              Maitrisez l&apos;art de communiquer avec l&apos;IA. Un bon prompt fait
              la difference entre une reponse generique et un resultat exactement
              adapte a vos besoins.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href="#fondamentaux"
                className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-500/25 transition-all hover:shadow-xl hover:shadow-brand-500/30"
              >
                Decouvrir les fondamentaux
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href="#templates"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-600 px-8 py-3.5 text-sm font-semibold text-slate-200 transition-all hover:border-slate-500 hover:bg-white/5"
              >
                Voir les templates
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FONDAMENTAUX ===== */}
      <section id="fondamentaux" className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="Fondamentaux"
            title="Les 5 principes du bon prompting"
            description="Ces principes sont la base de toute interaction efficace avec Claude Code. Maitrisez-les et vous obtiendrez des resultats 10x meilleurs."
          />

          <div className="mt-16 space-y-12">
            {principles.map((principle, index) => {
              const Icon = principle.icon;
              return (
                <div
                  key={principle.title}
                  className="glass-card overflow-hidden p-0"
                >
                  <div className="flex flex-col lg:flex-row">
                    {/* Left: explanation */}
                    <div className="flex flex-col justify-center p-6 sm:p-8 lg:w-2/5">
                      <div className="mb-4 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500/20 to-brand-500/5">
                          <Icon className="h-5 w-5 text-brand-700 dark:text-brand-400" />
                        </div>
                        <span className="text-sm font-semibold text-brand-700 dark:text-brand-400">
                          Principe {index + 1}
                        </span>
                      </div>
                      <h3 className="mb-3 text-xl font-bold sm:text-2xl">
                        {principle.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                        {principle.description}
                      </p>
                    </div>

                    {/* Right: code example */}
                    <div className="border-t border-slate-200/40 dark:border-slate-700/40 lg:w-3/5 lg:border-l lg:border-t-0">
                      <div className="p-4 sm:p-6">
                        <CodeBlock
                          code={principle.example}
                          language="markdown"
                          filename={`exemple-principe-${index + 1}.md`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <Callout type="tip" title="La regle d'or">
            Imaginez que vous delegue une tache a un collegue brillant mais qui ne
            connait rien a votre projet. Que lui diriez-vous pour qu&apos;il
            reussisse du premier coup ? C&apos;est exactement ce qu&apos;il faut
            dire a Claude.
          </Callout>
        </div>
      </section>

      {/* ===== TEMPLATES ===== */}
      <section
        id="templates"
        className="bg-slate-50/50 py-20 dark:bg-slate-900/50 sm:py-28"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="Templates"
            title="Prompts prets a l'emploi"
            description="Copiez, adaptez et utilisez ces templates pour vos projets. Chaque template suit les 5 principes et a ete optimise pour obtenir les meilleurs resultats."
          />

          <div className="mt-16 space-y-10">
            {templates.map((template) => {
              const Icon = template.icon;
              return (
                <div key={template.category} className="glass-card p-6 sm:p-8">
                  <div className="mb-6 flex items-center gap-4">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl ${template.bgColor}`}
                    >
                      <Icon className={`h-6 w-6 ${template.color}`} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold sm:text-xl">
                        {template.category}
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {template.description}
                      </p>
                    </div>
                  </div>

                  <CodeBlock
                    code={template.code}
                    language="markdown"
                    filename={template.filename}
                  />

                  <Callout type="info" title="Comment personnaliser">
                    Remplacez les elements entre [CROCHETS] par vos propres valeurs.
                    Ajoutez ou retirez des sections selon vos besoins. Ce template
                    est un point de depart, pas un format rigide.
                  </Callout>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== ERREURS COURANTES ===== */}
      <section id="erreurs" className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="A eviter"
            title="Les erreurs courantes de prompting"
            description="Apprenez a reconnaitre et corriger les prompts inefficaces. Chaque exemple montre un avant/apres concret."
          />

          <div className="mt-16 space-y-10">
            {mistakes.map((mistake) => (
              <div key={mistake.title} className="glass-card p-6 sm:p-8">
                <h3 className="mb-6 text-lg font-bold sm:text-xl">
                  {mistake.title}
                </h3>

                <div className="grid gap-6 lg:grid-cols-2">
                  {/* Bad example */}
                  <div>
                    <div className="mb-3 flex items-center gap-2">
                      <XCircle className="h-5 w-5 text-red-500" />
                      <span className="text-sm font-semibold text-red-500">
                        A ne pas faire
                      </span>
                    </div>
                    <CodeBlock
                      code={mistake.bad}
                      language="markdown"
                      filename="mauvais-prompt.md"
                    />
                  </div>

                  {/* Good example */}
                  <div>
                    <div className="mb-3 flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-emerald-500" />
                      <span className="text-sm font-semibold text-emerald-500">
                        A faire
                      </span>
                    </div>
                    <CodeBlock
                      code={mistake.good}
                      language="markdown"
                      filename="bon-prompt.md"
                    />
                  </div>
                </div>

                <Callout type="tip" title="Conseil">
                  {mistake.tip}
                </Callout>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PROMPTING AVANCE ===== */}
      <section
        id="avance"
        className="bg-slate-50/50 py-20 dark:bg-slate-900/50 sm:py-28"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="Avance"
            title="Prompting avance pour power users"
            description="Allez au-dela des bases avec des techniques qui exploitent toute la puissance de Claude Code."
          />

          <div className="mt-16 space-y-12">
            {/* Prompt Chaining */}
            <div className="glass-card p-6 sm:p-8">
              <div className="mb-6 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500/10">
                  <Link2 className="h-6 w-6 text-brand-700 dark:text-brand-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold sm:text-xl">
                    Prompt chaining (chainage multi-etapes)
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Decomposez une tache complexe en une sequence de prompts ou
                    chaque etape alimente la suivante.
                  </p>
                </div>
              </div>

              <CodeBlock
                code={`# Etape 1 : Analyse
"Analyse ce codebase et identifie les problemes de performance.
Liste chaque probleme avec : fichier, ligne, severite, description."

# Etape 2 : Priorisation (utilise la sortie de l'etape 1)
"A partir de cette liste de problemes, cree un plan d'action priorise.
Criteres : impact utilisateur, complexite de correction, risque de regression."

# Etape 3 : Implementation (utilise la sortie de l'etape 2)
"Implemente la correction du probleme #1 : [description].
Genere le code corrige, les tests de non-regression, et un benchmark avant/apres."

# Etape 4 : Validation
"Revois les corrections appliquees. Verifie qu'elles ne cassent rien
et que les tests passent. Suggere des ameliorations supplementaires si pertinent."`}
                language="markdown"
                filename="prompt-chaining.md"
              />

              <Callout type="tip" title="Pourquoi ca marche">
                Le chainage force Claude a se concentrer sur une seule tache a la
                fois. Chaque etape produit un resultat de meilleure qualite car le
                contexte est plus cible.
              </Callout>
            </div>

            {/* Multi-agent orchestration */}
            <div className="glass-card p-6 sm:p-8">
              <div className="mb-6 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10">
                  <Bot className="h-6 w-6 text-violet-500" />
                </div>
                <div>
                  <h3 className="text-lg font-bold sm:text-xl">
                    Orchestration multi-agents
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Utilisez plusieurs agents specialises qui travaillent en
                    parallele sur differents aspects d&apos;un probleme.
                  </p>
                </div>
              </div>

              <CodeBlock
                code={`# Dans votre CLAUDE.md, definissez des agents specialises :

## Agents disponibles

| Agent          | Role                        | Quand l'utiliser              |
|----------------|-----------------------------|-------------------------------|
| planner        | Planification               | Avant toute feature complexe  |
| tdd-guide      | Test-Driven Development     | Nouvelles features, bug fixes |
| code-reviewer  | Revue de code               | Apres chaque implementation   |
| security-check | Analyse de securite         | Avant chaque commit           |
| architect      | Decisions d'architecture    | Choix techniques importants   |

# Exemple d'utilisation dans un prompt :

"Utilise l'agent planner pour decomposer cette feature en taches.
Puis lance en parallele :
- Agent 1 (tdd-guide) : ecrit les tests pour le module auth
- Agent 2 (tdd-guide) : ecrit les tests pour le module API
- Agent 3 (security-check) : analyse les implications securite

Une fois les tests ecrits, implemente le code pour les faire passer."`}
                language="markdown"
                filename="multi-agent.md"
              />

              <Callout type="info" title="Parallelisme">
                Les agents independants peuvent travailler simultanement. Cela
                divise le temps de travail et apporte des perspectives differentes
                sur le meme probleme.
              </Callout>
            </div>

            {/* Complex workflows */}
            <div className="glass-card p-6 sm:p-8">
              <div className="mb-6 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-500/10">
                  <Layers className="h-6 w-6 text-accent-500" />
                </div>
                <div>
                  <h3 className="text-lg font-bold sm:text-xl">
                    Workflows complexes avec agents
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Combinez chainage, multi-agents et contexte persistant pour des
                    workflows de production.
                  </p>
                </div>
              </div>

              <CodeBlock
                code={`# Workflow complet : nouvelle feature du planning a la production

## Phase 1 — Recherche et planification
"Recherche les implementations existantes de [feature] sur GitHub.
Evalue les 3 meilleures options selon : securite, extensibilite, pertinence.
Genere un plan d'implementation detaille avec phases et risques."

## Phase 2 — TDD (Test-Driven Development)
"En suivant le plan, ecris d'abord les tests (RED).
Pour chaque module :
1. Ecris le test → verifie qu'il echoue
2. Ecris l'implementation minimale → verifie qu'il passe (GREEN)
3. Refactorise → verifie que tout passe toujours (REFACTOR)"

## Phase 3 — Revue et securite
"Lance en parallele :
- Code review : qualite, patterns, maintenabilite
- Security review : injections, auth, secrets, XSS
- Performance review : N+1, memory leaks, bundle size
Corrige les issues CRITICAL et HIGH avant de continuer."

## Phase 4 — Integration et deploiement
"Cree la PR avec un resume complet des changements.
Verifie que le CI passe. Deploie en staging pour validation."`}
                language="markdown"
                filename="workflow-complet.md"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ===== CLAUDE.MD ===== */}
      <section id="claude-md" className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="Secret weapon"
            title="CLAUDE.md — Votre arme secrete"
            description="Le fichier CLAUDE.md est le contexte persistant que Claude Code lit a chaque session. C'est la cle pour obtenir des resultats coherents et adaptes a votre projet."
          />

          <div className="mt-16 space-y-8">
            <div className="glass-card p-6 sm:p-8">
              <div className="mb-6 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500/10">
                  <BookOpen className="h-6 w-6 text-brand-700 dark:text-brand-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold sm:text-xl">
                    Structure d&apos;un CLAUDE.md efficace
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Un bon CLAUDE.md transforme Claude en un membre de votre equipe
                    qui connait votre projet sur le bout des doigts.
                  </p>
                </div>
              </div>

              <CodeBlock
                code={`# CLAUDE.md

## Projet
Nom : MonApp — Application SaaS de gestion de projet
Stack : Next.js 14, TypeScript, Tailwind CSS, Prisma, PostgreSQL
Repo : monorepo avec apps/ (web, api) et packages/ (ui, utils, config)

## Conventions de code
- Immutabilite : toujours creer de nouveaux objets, jamais muter
- Fichiers < 400 lignes, fonctions < 50 lignes
- Nommage : camelCase (variables), PascalCase (composants), kebab-case (fichiers)
- Commentaires en francais, code en anglais
- Gestion d'erreurs explicite a chaque niveau

## Architecture
- Feature-based : src/features/[feature]/{components,hooks,utils,types}
- Repository pattern pour l'acces aux donnees
- API responses : { success, data, error, meta }

## Tests
- Minimum 80% de couverture
- TDD obligatoire : RED → GREEN → REFACTOR
- Stack : Vitest + Testing Library + MSW pour les mocks API

## Git
- Conventional commits : feat:, fix:, refactor:, test:, docs:
- PR avec description detaillee et test plan
- Jamais de push force sur main

## Securite
- Pas de secrets en dur — utiliser .env
- Validation des inputs a toutes les frontieres
- Requetes parametrees (pas de concatenation SQL)

## Agents
| Agent | Usage |
|-------|-------|
| planner | Avant toute feature complexe |
| tdd-guide | Nouvelles features, corrections |
| code-reviewer | Apres chaque implementation |
| security-reviewer | Avant chaque commit |`}
                language="markdown"
                filename="CLAUDE.md"
              />

              <Callout type="tip" title="Ou placer le fichier">
                Placez <code className="rounded bg-slate-200 px-1.5 py-0.5 text-sm dark:bg-slate-700">CLAUDE.md</code> a
                la racine de votre projet. Claude Code le lit automatiquement au
                debut de chaque session. Vous pouvez aussi avoir des fichiers
                CLAUDE.md par dossier pour du contexte specifique a un module.
              </Callout>

              <Callout type="warning" title="Attention">
                Ne mettez jamais de secrets, tokens ou mots de passe dans votre
                CLAUDE.md. Ce fichier est souvent commite dans le repo et doit
                rester public-safe.
              </Callout>
            </div>

            <div className="glass-card p-6 sm:p-8">
              <h3 className="mb-4 text-lg font-bold">
                Les 3 niveaux de CLAUDE.md
              </h3>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-slate-200/40 p-5 dark:border-slate-700/40">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-brand-500/10">
                    <Sparkles className="h-5 w-5 text-brand-700 dark:text-brand-400" />
                  </div>
                  <h4 className="mb-1 font-semibold">Global</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    <code className="rounded bg-slate-200 px-1 py-0.5 text-xs dark:bg-slate-700">
                      ~/.claude/CLAUDE.md
                    </code>
                    <br />
                    Preferences personnelles appliquees a tous vos projets (langue,
                    style, conventions generales).
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200/40 p-5 dark:border-slate-700/40">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-accent-500/10">
                    <BrainCircuit className="h-5 w-5 text-accent-500" />
                  </div>
                  <h4 className="mb-1 font-semibold">Projet</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    <code className="rounded bg-slate-200 px-1 py-0.5 text-xs dark:bg-slate-700">
                      ./CLAUDE.md
                    </code>
                    <br />
                    Contexte specifique au projet : stack, architecture, conventions
                    d&apos;equipe, agents configures.
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200/40 p-5 dark:border-slate-700/40">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/10">
                    <Layers className="h-5 w-5 text-violet-500" />
                  </div>
                  <h4 className="mb-1 font-semibold">Module</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    <code className="rounded bg-slate-200 px-1 py-0.5 text-xs dark:bg-slate-700">
                      ./src/features/auth/CLAUDE.md
                    </code>
                    <br />
                    Contexte ultra-specifique pour un module : schema, API,
                    contraintes metier particulieres.
                  </p>
                </div>
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
          <SectionHeading
            badge="Et maintenant ?"
            title="Continuez votre apprentissage"
            description="Le prompting est une competence qui s'ameliore avec la pratique. Explorez les autres guides pour devenir un expert de Claude Code."
            centered
          />

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              href="/getting-started"
              className="group rounded-xl border border-slate-700/50 bg-slate-800/50 p-6 text-left backdrop-blur transition-all hover:-translate-y-1 hover:border-brand-500/30 hover:bg-slate-800/80"
            >
              <h3 className="mb-2 font-semibold text-white">
                Demarrer avec Claude Code
              </h3>
              <p className="mb-4 text-sm text-slate-400">
                Installation, configuration et premiers pas pour bien commencer.
              </p>
              <span className="inline-flex items-center gap-1 text-sm font-medium text-brand-400 transition-colors group-hover:text-brand-300">
                Lire le guide
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>

            <Link
              href="/mcp"
              className="group rounded-xl border border-slate-700/50 bg-slate-800/50 p-6 text-left backdrop-blur transition-all hover:-translate-y-1 hover:border-brand-500/30 hover:bg-slate-800/80"
            >
              <h3 className="mb-2 font-semibold text-white">
                Les MCP en detail
              </h3>
              <p className="mb-4 text-sm text-slate-400">
                Connectez Claude Code a Gmail, GitHub, Slack et des dizaines
                d&apos;autres outils.
              </p>
              <span className="inline-flex items-center gap-1 text-sm font-medium text-brand-400 transition-colors group-hover:text-brand-300">
                Explorer les MCP
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>

            <Link
              href="/skills"
              className="group rounded-xl border border-slate-700/50 bg-slate-800/50 p-6 text-left backdrop-blur transition-all hover:-translate-y-1 hover:border-brand-500/30 hover:bg-slate-800/80"
            >
              <h3 className="mb-2 font-semibold text-white">
                Creer des Skills
              </h3>
              <p className="mb-4 text-sm text-slate-400">
                Automatisez vos workflows avec des Skills personnalises et
                reutilisables.
              </p>
              <span className="inline-flex items-center gap-1 text-sm font-medium text-brand-400 transition-colors group-hover:text-brand-300">
                Decouvrir les Skills
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </div>

          <div className="mt-10">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-600 px-8 py-3.5 text-sm font-semibold text-white transition-all hover:border-slate-500 hover:bg-white/5"
            >
              Retour a l&apos;accueil
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
