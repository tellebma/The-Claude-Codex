import { setRequestLocale } from "next-intl/server";
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
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";
import { createPageMetadata, SITE_URL } from "@/lib/metadata";
import { createArticleSchema, serializeJsonLd } from "@/lib/structured-data";

const translations = {
  fr: {
    metaTitle: "Prompting Claude Code : 5 principes + templates pour bons prompts",
    metaDescription:
      "Maitriser le prompting Claude Code : 5 principes fondamentaux, templates copiables, erreurs courantes et techniques avancees pour des resultats parfaits.",
    jsonLdDescription:
      "Techniques, templates et bonnes pratiques pour tirer le maximum de l'IA.",
    heroBadge: "Guide du prompting",
    heroTitleStart: "L'art du ",
    heroTitleHighlight: "prompting",
    heroTitleEnd: "avec Claude Code",
    heroSubtitle:
      "Maitrisez l'art de communiquer avec l'IA. Un bon prompt fait la difference entre une reponse generique et un resultat exactement adapte a vos besoins.",
    heroCtaPrimary: "Decouvrir les fondamentaux",
    heroCtaSecondary: "Voir les templates",
    fundamentalsBadge: "Fondamentaux",
    fundamentalsTitle: "Les 5 principes du bon prompting",
    fundamentalsDescription:
      "Ces principes sont la base de toute interaction efficace avec Claude Code. Maitrisez-les et vous obtiendrez des resultats 10x meilleurs.",
    principleLabel: "Principe",
    goldenRuleTitle: "La regle d'or",
    goldenRuleContent:
      "Imaginez que vous delegue une tache a un collegue brillant mais qui ne connait rien a votre projet. Que lui diriez-vous pour qu'il reussisse du premier coup ? C'est exactement ce qu'il faut dire a Claude.",
    templatesBadge: "Templates",
    templatesTitle: "Prompts prets a l'emploi",
    templatesDescription:
      "Copiez, adaptez et utilisez ces templates pour vos projets. Chaque template suit les 5 principes et a ete optimise pour obtenir les meilleurs resultats.",
    templateCustomizeTitle: "Comment personnaliser",
    templateCustomizeContent:
      "Remplacez les elements entre [CROCHETS] par vos propres valeurs. Ajoutez ou retirez des sections selon vos besoins. Ce template est un point de depart, pas un format rigide.",
    mistakesBadge: "A eviter",
    mistakesTitle: "Les erreurs courantes de prompting",
    mistakesDescription:
      "Apprenez a reconnaitre et corriger les prompts inefficaces. Chaque exemple montre un avant/apres concret.",
    mistakeBadLabel: "A ne pas faire",
    mistakeGoodLabel: "A faire",
    mistakeBadFilename: "mauvais-prompt.md",
    mistakeGoodFilename: "bon-prompt.md",
    mistakeAdviceTitle: "Conseil",
    advancedBadge: "Avance",
    advancedTitle: "Prompting avance pour power users",
    advancedDescription:
      "Allez au-dela des bases avec des techniques qui exploitent toute la puissance de Claude Code.",
    chainingTitle: "Prompt chaining (chainage multi-etapes)",
    chainingDescription:
      "Decomposez une tache complexe en une sequence de prompts ou chaque etape alimente la suivante.",
    chainingTipTitle: "Pourquoi ca marche",
    chainingTipContent:
      "Le chainage force Claude a se concentrer sur une seule tache a la fois. Chaque etape produit un resultat de meilleure qualite car le contexte est plus cible.",
    multiAgentTitle: "Orchestration multi-agents",
    multiAgentDescription:
      "Utilisez plusieurs agents specialises qui travaillent en parallele sur differents aspects d'un probleme.",
    multiAgentTipTitle: "Parallelisme",
    multiAgentTipContent:
      "Les agents independants peuvent travailler simultanement. Cela divise le temps de travail et apporte des perspectives differentes sur le meme probleme.",
    workflowTitle: "Workflows complexes avec agents",
    workflowDescription:
      "Combinez chainage, multi-agents et contexte persistant pour des workflows de production.",
    claudeMdBadge: "Secret weapon",
    claudeMdTitle: "CLAUDE.md : Votre arme secrete",
    claudeMdDescription:
      "Le fichier CLAUDE.md est le contexte persistant que Claude Code lit a chaque session. C'est la cle pour obtenir des resultats coherents et adaptes a votre projet.",
    claudeMdStructureTitle: "Structure d'un CLAUDE.md efficace",
    claudeMdStructureDescription:
      "Un bon CLAUDE.md transforme Claude en un membre de votre equipe qui connait votre projet sur le bout des doigts.",
    claudeMdPlacementTitle: "Ou placer le fichier",
    claudeMdPlacementContent:
      "a la racine de votre projet. Claude Code le lit automatiquement au debut de chaque session. Vous pouvez aussi avoir des fichiers CLAUDE.md par dossier pour du contexte specifique a un module.",
    claudeMdWarningTitle: "Attention",
    claudeMdWarningContent:
      "Ne mettez jamais de secrets, tokens ou mots de passe dans votre CLAUDE.md. Ce fichier est souvent commite dans le repo et doit rester public-safe.",
    claudeMdLevelsTitle: "Les 3 niveaux de CLAUDE.md",
    claudeMdGlobalTitle: "Global",
    claudeMdGlobalDescription:
      "Preferences personnelles appliquees a tous vos projets (langue, style, conventions generales).",
    claudeMdProjectTitle: "Projet",
    claudeMdProjectDescription:
      "Contexte specifique au projet : stack, architecture, conventions d'equipe, agents configures.",
    claudeMdModuleTitle: "Module",
    claudeMdModuleDescription:
      "Contexte ultra-specifique pour un module : schema, API, contraintes metier particulieres.",
    nextStepsBadge: "Et maintenant ?",
    nextStepsTitle: "Continuez votre apprentissage",
    nextStepsDescription:
      "Le prompting est une competence qui s'ameliore avec la pratique. Explorez les autres guides pour devenir un expert de Claude Code.",
    nextStepGettingStartedTitle: "Demarrer avec Claude Code",
    nextStepGettingStartedDescription:
      "Installation, configuration et premiers pas pour bien commencer.",
    nextStepGettingStartedLink: "Lire le guide",
    nextStepMcpTitle: "Les MCP en detail",
    nextStepMcpDescription:
      "Connectez Claude Code a Gmail, GitHub, Slack et des dizaines d'autres outils.",
    nextStepMcpLink: "Explorer les MCP",
    nextStepSkillsTitle: "Creer des Skills",
    nextStepSkillsDescription:
      "Automatisez vos workflows avec des Skills personnalises et reutilisables.",
    nextStepSkillsLink: "Decouvrir les Skills",
    backToHome: "Retour a l'accueil",
    principles: [
      {
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
        title: "Definissez un role",
        description:
          "Donnez une identite a Claude pour cadrer ses reponses. Le role influence le niveau de detail, le vocabulaire et l'approche.",
        example: `"Tu es un architecte logiciel senior specialise en React et Next.js.
Tu privilegies la maintenabilite, la performance et les bonnes pratiques.
Tu commentes ton code en francais et tu expliques chaque decision d'architecture."`,
      },
      {
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
    ],
    templates: [
      {
        category: "Developpement web",
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
        category: "Documentation",
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
        category: "Automatisation",
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
        category: "Analyse de donnees",
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
        category: "Creation de contenu",
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
    ],
    mistakes: [
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
    ],
  },
  en: {
    metaTitle: "Prompting Claude Code: 5 principles + templates for great prompts",
    metaDescription:
      "Master Claude Code prompting: 5 core principles, copy-paste templates, common mistakes, and advanced techniques to get the results you actually want.",
    jsonLdDescription:
      "Techniques, templates and best practices to get the most out of AI.",
    heroBadge: "Prompting guide",
    heroTitleStart: "The art of ",
    heroTitleHighlight: "prompting",
    heroTitleEnd: "with Claude Code",
    heroSubtitle:
      "Master the art of communicating with AI. A good prompt makes the difference between a generic answer and a result perfectly tailored to your needs.",
    heroCtaPrimary: "Discover the fundamentals",
    heroCtaSecondary: "View templates",
    fundamentalsBadge: "Fundamentals",
    fundamentalsTitle: "The 5 principles of good prompting",
    fundamentalsDescription:
      "These principles are the foundation of every effective interaction with Claude Code. Master them and you will get 10x better results.",
    principleLabel: "Principle",
    goldenRuleTitle: "The golden rule",
    goldenRuleContent:
      "Imagine you are delegating a task to a brilliant colleague who knows nothing about your project. What would you tell them so they succeed on the first try? That is exactly what you should tell Claude.",
    templatesBadge: "Templates",
    templatesTitle: "Ready-to-use prompts",
    templatesDescription:
      "Copy, adapt and use these templates for your projects. Each template follows the 5 principles and has been optimized for the best results.",
    templateCustomizeTitle: "How to customize",
    templateCustomizeContent:
      "Replace the elements in [BRACKETS] with your own values. Add or remove sections as needed. This template is a starting point, not a rigid format.",
    mistakesBadge: "Avoid",
    mistakesTitle: "Common prompting mistakes",
    mistakesDescription:
      "Learn to recognize and fix ineffective prompts. Each example shows a concrete before/after.",
    mistakeBadLabel: "Don't do this",
    mistakeGoodLabel: "Do this instead",
    mistakeBadFilename: "bad-prompt.md",
    mistakeGoodFilename: "good-prompt.md",
    mistakeAdviceTitle: "Tip",
    advancedBadge: "Advanced",
    advancedTitle: "Advanced prompting for power users",
    advancedDescription:
      "Go beyond the basics with techniques that leverage the full power of Claude Code.",
    chainingTitle: "Prompt chaining (multi-step sequencing)",
    chainingDescription:
      "Break down a complex task into a sequence of prompts where each step feeds the next.",
    chainingTipTitle: "Why it works",
    chainingTipContent:
      "Chaining forces Claude to focus on a single task at a time. Each step produces a higher quality result because the context is more focused.",
    multiAgentTitle: "Multi-agent orchestration",
    multiAgentDescription:
      "Use multiple specialized agents working in parallel on different aspects of a problem.",
    multiAgentTipTitle: "Parallelism",
    multiAgentTipContent:
      "Independent agents can work simultaneously. This divides the workload and brings different perspectives to the same problem.",
    workflowTitle: "Complex workflows with agents",
    workflowDescription:
      "Combine chaining, multi-agents and persistent context for production workflows.",
    claudeMdBadge: "Secret weapon",
    claudeMdTitle: "CLAUDE.md: Your secret weapon",
    claudeMdDescription:
      "The CLAUDE.md file is the persistent context that Claude Code reads at every session. It is the key to getting consistent, project-tailored results.",
    claudeMdStructureTitle: "Structure of an effective CLAUDE.md",
    claudeMdStructureDescription:
      "A good CLAUDE.md turns Claude into a team member who knows your project inside out.",
    claudeMdPlacementTitle: "Where to place the file",
    claudeMdPlacementContent:
      "at the root of your project. Claude Code reads it automatically at the start of each session. You can also have CLAUDE.md files per folder for module-specific context.",
    claudeMdWarningTitle: "Warning",
    claudeMdWarningContent:
      "Never put secrets, tokens or passwords in your CLAUDE.md. This file is often committed to the repo and must remain public-safe.",
    claudeMdLevelsTitle: "The 3 levels of CLAUDE.md",
    claudeMdGlobalTitle: "Global",
    claudeMdGlobalDescription:
      "Personal preferences applied to all your projects (language, style, general conventions).",
    claudeMdProjectTitle: "Project",
    claudeMdProjectDescription:
      "Project-specific context: stack, architecture, team conventions, configured agents.",
    claudeMdModuleTitle: "Module",
    claudeMdModuleDescription:
      "Ultra-specific context for a module: schema, API, particular business constraints.",
    nextStepsBadge: "What's next?",
    nextStepsTitle: "Continue your learning",
    nextStepsDescription:
      "Prompting is a skill that improves with practice. Explore the other guides to become a Claude Code expert.",
    nextStepGettingStartedTitle: "Getting started with Claude Code",
    nextStepGettingStartedDescription:
      "Installation, configuration and first steps to get started.",
    nextStepGettingStartedLink: "Read the guide",
    nextStepMcpTitle: "MCPs in detail",
    nextStepMcpDescription:
      "Connect Claude Code to Gmail, GitHub, Slack and dozens of other tools.",
    nextStepMcpLink: "Explore MCPs",
    nextStepSkillsTitle: "Create Skills",
    nextStepSkillsDescription:
      "Automate your workflows with custom, reusable Skills.",
    nextStepSkillsLink: "Discover Skills",
    backToHome: "Back to home",
    principles: [
      {
        title: "Be specific",
        description:
          "Provide context and clear constraints. The more precise your prompt, the more relevant the response.",
        example: `# Vague
"Make me a form"

# Specific
"Create a contact form in React with TypeScript.
Fields: name (required), email (required, valid), message (required, min 20 chars).
Use react-hook-form with Zod validation.
Style with Tailwind CSS, responsive mobile-first.
Show a confirmation toast after submission."`,
      },
      {
        title: "Define a role",
        description:
          "Give Claude an identity to frame its responses. The role influences the level of detail, vocabulary and approach.",
        example: `"You are a senior software architect specializing in React and Next.js.
You prioritize maintainability, performance and best practices.
You comment your code in English and explain each architectural decision."`,
      },
      {
        title: "Specify the expected format",
        description:
          "Clearly indicate the desired response structure: code, list, table, JSON, markdown, etc.",
        example: `"Generate the response in the following format:
1. A summary in 2-3 sentences
2. The complete code with inline comments
3. A table of required dependencies (name | version | usage)
4. Step-by-step installation instructions"`,
      },
      {
        title: "Give examples (few-shot)",
        description:
          "Show Claude what you expect with concrete examples. This is the most powerful technique for getting the exact format you want.",
        example: `"Generate variable names following this pattern:

Example 1: logged in user → isUserLoggedIn
Example 2: number of products in cart → cartItemCount
Example 3: last update date → lastUpdatedAt

Now generate for:
- form being submitted
- email validation error
- filtered orders list"`,
      },
      {
        title: "Iterate and refine",
        description:
          "Prompting is a dialogue. Progressively refine your requests based on the responses you get.",
        example: `# Iteration 1
"Create a Button component"

# Iteration 2
"Add variants: primary, secondary, ghost and danger"

# Iteration 3
"Add icon support on left and right,
a loading state with a spinner, and the disabled prop"

# Iteration 4
"Add unit tests with Testing Library
and Storybook stories for each variant"`,
      },
    ],
    templates: [
      {
        category: "Web development",
        description:
          "To create components, pages or complete web features.",
        code: `You are a senior React/Next.js/TypeScript developer.

Create a React component that [COMPONENT DESCRIPTION].

Technical context:
- Framework: Next.js 14 (App Router)
- Language: TypeScript (strict mode)
- Styling: Tailwind CSS
- State management: [zustand / React Context / none]

Functional specifications:
- [Feature 1]
- [Feature 2]
- [Feature 3]

Constraints:
- Responsive mobile-first
- Accessible (ARIA, focus management)
- Performance optimized (memo, lazy loading if needed)
- Error handling and loading states

Generate the complete code with:
1. The main component
2. TypeScript types/interfaces
3. A usage example
4. Unit tests (Vitest + Testing Library)`,
        filename: "template-web-dev.txt",
      },
      {
        category: "Documentation",
        description:
          "To generate clear and structured technical documentation.",
        code: `You are a senior technical writer.

Write the technical documentation for [PROJECT/MODULE NAME].

Target audience: [junior developers / internal team / open-source]

Expected structure:
1. Overview (2-3 sentences)
2. Installation and prerequisites
3. Configuration
4. Quick Start guide
5. API Reference (each function with parameters, return, example)
6. Advanced usage examples
7. FAQ and troubleshooting

Conventions:
- Code examples in [TypeScript/Python/etc.]
- All snippets must be copyable and functional
- Use admonitions (note, warning, tip) when relevant
- Include a navigable table of contents at the beginning`,
        filename: "template-documentation.txt",
      },
      {
        category: "Automation",
        description:
          "To create robust automation scripts and pipelines.",
        code: `You are a senior DevOps/SRE engineer.

Create a script that automates [TASK DESCRIPTION].

Environment:
- OS: [Linux/macOS/Windows]
- Language: [Bash/Python/Node.js]
- Available tools: [Docker, GitHub Actions, etc.]

Expected behavior:
1. [Step 1 of the process]
2. [Step 2 of the process]
3. [Step 3 of the process]

Requirements:
- Robust error handling (exit codes, try/catch)
- Logging with levels (info, warn, error)
- Dry-run mode for testing without executing
- Configurable variables via .env or CLI arguments
- Idempotent (can be re-run without side effects)

Generate:
1. The complete commented script
2. The .env.example file
3. The usage README
4. A cron/schedule example if relevant`,
        filename: "template-automation.txt",
      },
      {
        category: "Data analysis",
        description:
          "To explore, transform and visualize data effectively.",
        code: `You are a senior data analyst expert in Python.

Analyze this CSV dataset and [ANALYSIS OBJECTIVE].

Data information:
- Source: [source description]
- Main columns: [col1, col2, col3, ...]
- Volume: [approximate number of rows]
- Period: [time range of data]

Requested analysis:
1. Exploration: descriptive statistics, missing values, distributions
2. Cleaning: outlier handling, normalization, encoding
3. Analysis: [correlations / trends / segmentation / prediction]
4. Visualization: relevant charts with matplotlib/seaborn

Output format:
- Complete Python code (pandas, numpy, matplotlib)
- Comments explaining each step
- Interpretation of results in non-technical language
- Recommendations based on insights`,
        filename: "template-data-analysis.txt",
      },
      {
        category: "Content creation",
        description:
          "To write structured, engaging and optimized content.",
        code: `You are a senior web writer specializing in [DOMAIN].

Write a blog post about [TOPIC].

Parameters:
- Tone: [professional / casual / educational]
- Length: [800-1200 words]
- Target audience: [typical reader description]
- Objective: [inform / persuade / tutorial]

Structure:
1. Catchy title (max 60 characters)
2. Introduction with hook (problem/question)
3. 3-5 sections with H2 subheadings
4. Concrete examples and data
5. Conclusion with call-to-action

SEO:
- Main keyword: [keyword]
- Secondary keywords: [keyword-2, keyword-3]
- Meta description (max 155 characters)
- Internal link suggestions

Constraints:
- No unnecessary jargon
- Short sentences (max 20 words)
- One paragraph = one idea
- Include bullet lists for readability`,
        filename: "template-content.txt",
      },
    ],
    mistakes: [
      {
        title: "Too vague",
        bad: `"Make me a website"`,
        good: `"Create a landing page for a project management SaaS app.
Stack: Next.js 14, TypeScript, Tailwind CSS.
Sections: hero with CTA, features (3 columns), pricing (3 plans), FAQ accordion.
Design: modern, dark mode, subtle scroll animations."`,
        tip: "The more precise you are, the fewer iterations you will need.",
      },
      {
        title: "No context",
        bad: `"Fix this bug"`,
        good: `"I have a 'TypeError: Cannot read property map of undefined' error
in my ProductList.tsx component (line 42).
This component receives a 'products' prop from a REST API.
The error only appears on first render, before the API responds.
Here is the component: [code]"`,
        tip: "Always provide context: file, exact error, expected vs actual behavior.",
      },
      {
        title: "Asking for everything at once",
        bad: `"Build me a complete app with auth, dashboard, API, database, tests, CI/CD and deployment"`,
        good: `"Let's start with the database.
Create the Prisma schema for a task management app with:
- Table User (id, email, name, createdAt)
- Table Project (id, name, ownerId, createdAt)
- Table Task (id, title, status, projectId, assigneeId, dueDate)
Relations: User 1-N Project, Project 1-N Task, User 1-N Task"`,
        tip: "Break large projects into steps. One clear request = one precise answer.",
      },
      {
        title: "Not iterating",
        bad: `"That's not what I wanted" (without more details)`,
        good: `"The component is well structured, but I'd like 3 changes:
1. Replace the blue button with a teal-to-cyan gradient
2. Add a fadeIn animation on component mount
3. The email field should validate the format in real-time (not only on submit)"`,
        tip: "Say precisely what is good, what is wrong, and what you want to change.",
      },
    ],
  },
};

const principleIcons = [Target, UserCheck, FileOutput, ListChecks, RefreshCcw];

const templateMeta = [
  { icon: Globe, color: "text-brand-700 dark:text-brand-400", bgColor: "bg-brand-500/10" },
  { icon: FileText, color: "text-emerald-500", bgColor: "bg-emerald-500/10" },
  { icon: Zap, color: "text-accent-500", bgColor: "bg-accent-500/10" },
  { icon: BarChart3, color: "text-violet-500", bgColor: "bg-violet-500/10" },
  { icon: PenTool, color: "text-rose-500", bgColor: "bg-rose-500/10" },
];

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = translations[locale as "fr" | "en"] ?? translations.fr;
  return createPageMetadata({
    title: t.metaTitle,
    description: t.metaDescription,
    path: `/${locale}/prompting`,
    locale,
  });
}

function buildArticleJsonLd(locale: string) {
  const t = translations[locale as "fr" | "en"] ?? translations.fr;
  return createArticleSchema({
    title: t.metaTitle,
    description: t.jsonLdDescription,
    url: `${SITE_URL}/${locale}/prompting`,
    locale,
    datePublished: "2026-03-07",
    dateModified: "2026-05-09",
  });
}

export default async function PromptingPage({
  params,
}: Readonly<{
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = translations[locale as "fr" | "en"] ?? translations.fr;
  return (
    <>
      {/* JSON-LD structured data — safe: static schema from hardcoded values, no user input */}
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(buildArticleJsonLd(locale)) }}
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

        <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-20 sm:px-6 sm:pb-28 sm:pt-28 lg:px-8 lg:pb-36 lg:pt-32">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-brand-500/10 px-4 py-1.5 text-sm text-brand-300">
              <MessageSquare className="h-4 w-4" aria-hidden="true" />
              {t.heroBadge}
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl">
              {t.heroTitleStart}
              <span className="text-gradient">{t.heroTitleHighlight}</span>
              <br />
              {t.heroTitleEnd}
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300 sm:text-xl">
              {t.heroSubtitle}
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href="#fondamentaux"
                className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-500/25 transition-all hover:shadow-xl hover:shadow-brand-500/30"
              >
                {t.heroCtaPrimary}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </a>
              <a
                href="#templates"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-600 px-8 py-3.5 text-sm font-semibold text-slate-200 transition-all hover:border-slate-500 hover:bg-white/5"
              >
                {t.heroCtaSecondary}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FONDAMENTAUX ===== */}
      <section id="fondamentaux" className="py-20 sm:py-28">
        <div className="px-4 sm:px-6 lg:px-0">
          <AnimateOnScroll preset="fade-up">
            <SectionHeading
              badge={t.fundamentalsBadge}
              title={t.fundamentalsTitle}
              description={t.fundamentalsDescription}
            />
          </AnimateOnScroll>

          <div className="mt-16 space-y-12">
            {t.principles.map((principle, index) => {
              const Icon = principleIcons[index];
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
                          <Icon className="h-5 w-5 text-brand-700 dark:text-brand-400" aria-hidden="true" />
                        </div>
                        <span className="text-sm font-semibold text-brand-700 dark:text-brand-400">
                          {t.principleLabel} {index + 1}
                        </span>
                      </div>
                      <h3 className="mb-3 text-xl font-bold sm:text-2xl">
                        {principle.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
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

          <Callout type="tip" title={t.goldenRuleTitle}>
            {t.goldenRuleContent}
          </Callout>
        </div>
      </section>

      {/* ===== TEMPLATES ===== */}
      <section
        id="templates"
        className="bg-slate-50/50 py-20 dark:bg-slate-900/50 sm:py-28"
      >
        <div className="px-4 sm:px-6 lg:px-0">
          <SectionHeading
            badge={t.templatesBadge}
            title={t.templatesTitle}
            description={t.templatesDescription}
          />

          <div className="mt-16 space-y-10">
            {t.templates.map((template, index) => {
              const meta = templateMeta[index];
              const Icon = meta.icon;
              return (
                <div key={template.category} className="glass-card p-6 sm:p-8">
                  <div className="mb-6 flex items-center gap-4">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl ${meta.bgColor}`}
                    >
                      <Icon className={`h-6 w-6 ${meta.color}`} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold sm:text-xl">
                        {template.category}
                      </h3>
                      <p className="text-sm text-slate-700 dark:text-slate-300">
                        {template.description}
                      </p>
                    </div>
                  </div>

                  <CodeBlock
                    code={template.code}
                    language="markdown"
                    filename={template.filename}
                  />

                  <Callout type="info" title={t.templateCustomizeTitle}>
                    {t.templateCustomizeContent}
                  </Callout>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== ERREURS COURANTES ===== */}
      <section id="erreurs" className="py-20 sm:py-28">
        <div className="px-4 sm:px-6 lg:px-0">
          <SectionHeading
            badge={t.mistakesBadge}
            title={t.mistakesTitle}
            description={t.mistakesDescription}
          />

          <div className="mt-16 space-y-10">
            {t.mistakes.map((mistake) => (
              <div key={mistake.title} className="glass-card p-6 sm:p-8">
                <h3 className="mb-6 text-lg font-bold sm:text-xl">
                  {mistake.title}
                </h3>

                <div className="grid gap-6 lg:grid-cols-2">
                  {/* Bad example */}
                  <div>
                    <div className="mb-3 flex items-center gap-2">
                      <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" aria-hidden="true" />
                      <span className="text-sm font-semibold text-red-700 dark:text-red-400">
                        {t.mistakeBadLabel}
                      </span>
                    </div>
                    <CodeBlock
                      code={mistake.bad}
                      language="markdown"
                      filename={t.mistakeBadFilename}
                    />
                  </div>

                  {/* Good example */}
                  <div>
                    <div className="mb-3 flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                      <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                        {t.mistakeGoodLabel}
                      </span>
                    </div>
                    <CodeBlock
                      code={mistake.good}
                      language="markdown"
                      filename={t.mistakeGoodFilename}
                    />
                  </div>
                </div>

                <Callout type="tip" title={t.mistakeAdviceTitle}>
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
        <div className="px-4 sm:px-6 lg:px-0">
          <SectionHeading
            badge={t.advancedBadge}
            title={t.advancedTitle}
            description={t.advancedDescription}
          />

          <div className="mt-16 space-y-12">
            {/* Prompt Chaining */}
            <div className="glass-card p-6 sm:p-8">
              <div className="mb-6 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500/10">
                  <Link2 className="h-6 w-6 text-brand-700 dark:text-brand-400" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-lg font-bold sm:text-xl">
                    {t.chainingTitle}
                  </h3>
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    {t.chainingDescription}
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

              <Callout type="tip" title={t.chainingTipTitle}>
                {t.chainingTipContent}
              </Callout>
            </div>

            {/* Multi-agent orchestration */}
            <div className="glass-card p-6 sm:p-8">
              <div className="mb-6 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10">
                  <Bot className="h-6 w-6 text-violet-500" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-lg font-bold sm:text-xl">
                    {t.multiAgentTitle}
                  </h3>
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    {t.multiAgentDescription}
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

              <Callout type="info" title={t.multiAgentTipTitle}>
                {t.multiAgentTipContent}
              </Callout>
            </div>

            {/* Complex workflows */}
            <div className="glass-card p-6 sm:p-8">
              <div className="mb-6 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-500/10">
                  <Layers className="h-6 w-6 text-accent-500" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-lg font-bold sm:text-xl">
                    {t.workflowTitle}
                  </h3>
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    {t.workflowDescription}
                  </p>
                </div>
              </div>

              <CodeBlock
                code={`# Workflow complet : nouvelle feature du planning a la production

## Phase 1 : Recherche et planification
"Recherche les implementations existantes de [feature] sur GitHub.
Evalue les 3 meilleures options selon : securite, extensibilite, pertinence.
Genere un plan d'implementation detaille avec phases et risques."

## Phase 2 : TDD (Test-Driven Development)
"En suivant le plan, ecris d'abord les tests (RED).
Pour chaque module :
1. Ecris le test → verifie qu'il echoue
2. Ecris l'implementation minimale → verifie qu'il passe (GREEN)
3. Refactorise → verifie que tout passe toujours (REFACTOR)"

## Phase 3 : Revue et securite
"Lance en parallele :
- Code review : qualite, patterns, maintenabilite
- Security review : injections, auth, secrets, XSS
- Performance review : N+1, memory leaks, bundle size
Corrige les issues CRITICAL et HIGH avant de continuer."

## Phase 4 : Integration et deploiement
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
        <div className="px-4 sm:px-6 lg:px-0">
          <SectionHeading
            badge={t.claudeMdBadge}
            title={t.claudeMdTitle}
            description={t.claudeMdDescription}
          />

          <div className="mt-16 space-y-8">
            <div className="glass-card p-6 sm:p-8">
              <div className="mb-6 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500/10">
                  <BookOpen className="h-6 w-6 text-brand-700 dark:text-brand-400" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-lg font-bold sm:text-xl">
                    {t.claudeMdStructureTitle}
                  </h3>
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    {t.claudeMdStructureDescription}
                  </p>
                </div>
              </div>

              <CodeBlock
                code={`# CLAUDE.md

## Projet
Nom : MonApp, Application SaaS de gestion de projet
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
- Pas de secrets en dur, utiliser .env
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

              <Callout type="tip" title={t.claudeMdPlacementTitle}>
                <code className="rounded bg-slate-200 px-1.5 py-0.5 text-sm dark:bg-slate-700">CLAUDE.md</code> {t.claudeMdPlacementContent}
              </Callout>

              <Callout type="warning" title={t.claudeMdWarningTitle}>
                {t.claudeMdWarningContent}
              </Callout>
            </div>

            <div className="glass-card p-6 sm:p-8">
              <h3 className="mb-4 text-lg font-bold">
                {t.claudeMdLevelsTitle}
              </h3>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-slate-200/40 p-5 dark:border-slate-700/40">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-brand-500/10">
                    <Sparkles className="h-5 w-5 text-brand-700 dark:text-brand-400" aria-hidden="true" />
                  </div>
                  <h4 className="mb-1 font-semibold">{t.claudeMdGlobalTitle}</h4>
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    <code className="rounded bg-slate-200 px-1 py-0.5 text-xs dark:bg-slate-700">
                      ~/.claude/CLAUDE.md
                    </code>
                    <br />
                    {t.claudeMdGlobalDescription}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200/40 p-5 dark:border-slate-700/40">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-accent-500/10">
                    <BrainCircuit className="h-5 w-5 text-accent-500" aria-hidden="true" />
                  </div>
                  <h4 className="mb-1 font-semibold">{t.claudeMdProjectTitle}</h4>
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    <code className="rounded bg-slate-200 px-1 py-0.5 text-xs dark:bg-slate-700">
                      ./CLAUDE.md
                    </code>
                    <br />
                    {t.claudeMdProjectDescription}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200/40 p-5 dark:border-slate-700/40">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/10">
                    <Layers className="h-5 w-5 text-violet-500" aria-hidden="true" />
                  </div>
                  <h4 className="mb-1 font-semibold">{t.claudeMdModuleTitle}</h4>
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    <code className="rounded bg-slate-200 px-1 py-0.5 text-xs dark:bg-slate-700">
                      ./src/features/auth/CLAUDE.md
                    </code>
                    <br />
                    {t.claudeMdModuleDescription}
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
            badge={t.nextStepsBadge}
            title={t.nextStepsTitle}
            description={t.nextStepsDescription}
            centered
          />

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              href={`/${locale}/getting-started`}
              className="group rounded-xl border border-slate-700/50 bg-slate-800/50 p-6 text-left backdrop-blur transition-all hover:-translate-y-1 hover:border-brand-500/30 hover:bg-slate-800/80"
            >
              <h3 className="mb-2 font-semibold text-white">
                {t.nextStepGettingStartedTitle}
              </h3>
              <p className="mb-4 text-sm text-slate-400">
                {t.nextStepGettingStartedDescription}
              </p>
              <span className="inline-flex items-center gap-1 text-sm font-medium text-brand-400 transition-colors group-hover:text-brand-300">
                {t.nextStepGettingStartedLink}
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </span>
            </Link>

            <Link
              href={`/${locale}/mcp`}
              className="group rounded-xl border border-slate-700/50 bg-slate-800/50 p-6 text-left backdrop-blur transition-all hover:-translate-y-1 hover:border-brand-500/30 hover:bg-slate-800/80"
            >
              <h3 className="mb-2 font-semibold text-white">
                {t.nextStepMcpTitle}
              </h3>
              <p className="mb-4 text-sm text-slate-400">
                {t.nextStepMcpDescription}
              </p>
              <span className="inline-flex items-center gap-1 text-sm font-medium text-brand-400 transition-colors group-hover:text-brand-300">
                {t.nextStepMcpLink}
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </span>
            </Link>

            <Link
              href={`/${locale}/skills`}
              className="group rounded-xl border border-slate-700/50 bg-slate-800/50 p-6 text-left backdrop-blur transition-all hover:-translate-y-1 hover:border-brand-500/30 hover:bg-slate-800/80"
            >
              <h3 className="mb-2 font-semibold text-white">
                {t.nextStepSkillsTitle}
              </h3>
              <p className="mb-4 text-sm text-slate-400">
                {t.nextStepSkillsDescription}
              </p>
              <span className="inline-flex items-center gap-1 text-sm font-medium text-brand-400 transition-colors group-hover:text-brand-300">
                {t.nextStepSkillsLink}
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </span>
            </Link>
          </div>

          <div className="mt-10">
            <Link
              href={`/${locale}`}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-600 px-8 py-3.5 text-sm font-semibold text-white transition-all hover:border-slate-500 hover:bg-white/5"
            >
              {t.backToHome}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
