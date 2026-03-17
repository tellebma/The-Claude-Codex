import { setRequestLocale } from "next-intl/server";
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

const translations = {
  fr: {
    metaTitle: "Les Skills Claude Code",
    metaDescription:
      "Apprenez à utiliser et créer des Skills pour Claude Code. Automatisez vos workflows, ajoutez des capacités et enseignez de nouveaux talents à votre assistant IA.",
    jsonLdTitle: "Les Skills Claude Code",
    jsonLdDescription:
      "Apprenez à utiliser et créer des Skills pour Claude Code.",
    heroBadge: "Guide Skills",
    heroTitle1: "Les Skills : Enseignez de ",
    heroTitle2: "nouveaux talents",
    heroTitle3: " a Claude Code",
    heroDescription:
      "Les Skills transforment Claude Code en un assistant specialise. Ajoutez des capacites, automatisez vos workflows et creez vos propres recettes reutilisables.",
    heroCta1: "Creer votre premier Skill",
    heroCta2: "Voir les Skills recommandes",
    conceptBadge: "Concept",
    conceptTitle: "Qu'est-ce qu'un Skill ?",
    conceptDescription:
      "Comprendre les Skills en 2 minutes, meme si vous n'etes pas developpeur.",
    conceptCardTitle: "Un Skill, c\u0027est une recette pour Claude",
    conceptCardP1Start:
      "Imaginez que Claude Code est un chef cuisinier talentueux. Il sait deja cuisiner, mais si vous lui donnez une ",
    conceptCardP1Bold1: "recette precise",
    conceptCardP1Mid:
      ", il produira exactement le plat que vous voulez, a chaque fois. Les Skills sont ces recettes : des ",
    conceptCardP1Bold2: "instructions structurees",
    conceptCardP1End:
      " qui guident Claude pour executer des taches complexes de maniere reproductible.",
    conceptCardP2Start: "Concretement, un Skill est un ",
    conceptCardP2Bold1: "fichier Markdown",
    conceptCardP2Mid:
      " qui definit un workflow, des regles et des etapes a suivre. Quand vous invoquez un Skill, Claude le charge en memoire et adapte son comportement en consequence. C\u0027est comme un ",
    conceptCardP2Bold2: "plugin",
    conceptCardP2End: " que vous pouvez activer a la demande.",
    conceptCalloutTitle: "Analogie simple",
    conceptCalloutStart:
      "Si les MCP sont les ",
    conceptCalloutBold1: "outils",
    conceptCalloutMid:
      " de Claude (marteau, tournevis, perceuse), les Skills sont les ",
    conceptCalloutBold2: "modes d\u0027emploi",
    conceptCalloutEnd:
      " qui lui expliquent ",
    conceptCalloutEm1: "comment",
    conceptCalloutAnd: " et ",
    conceptCalloutEm2: "quand",
    conceptCalloutFinal:
      " utiliser ces outils ensemble pour accomplir une tache complexe.",
    typesBadge: "Categories",
    typesTitle: "Les trois types de Skills",
    typesDescription:
      "Chaque type repond a un besoin different. Combinez-les pour un maximum d'efficacite.",
    builtInTitle: "Built-in Skills",
    builtInDesc:
      "Fournis par la communaute et les outils, ces Skills sont disponibles immediatement. Ils couvrent les workflows les plus courants : TDD, code review, planning, etc.",
    builtInFooter: "Prets a l\u0027emploi, maintenus par la communaute",
    customTitle: "Custom Skills",
    customDescStart: "Crees par vous dans le dossier ",
    customDescEnd:
      ". Ils sont disponibles dans tous vos projets et refletent vos preferences personnelles.",
    customFooter: "Personnels, disponibles partout",
    projectTitle: "Project Skills",
    projectDescStart: "Definis dans le fichier ",
    projectDescMid: " ou le dossier ",
    projectDescEnd:
      " de votre projet. Partages avec toute l\u0027equipe via Git.",
    projectFooter: "Partages en equipe, specifiques au projet",
    typesCalloutTitle: "Ordre de priorite",
    typesCallout:
      "Quand plusieurs Skills coexistent, Claude applique les Project Skills en priorite (specifiques au contexte), puis les Custom Skills (vos preferences), puis les Built-in Skills. Cela vous permet de surcharger un comportement par defaut avec vos propres conventions.",
    usageBadge: "Utilisation",
    usageTitle: "Comment utiliser un Skill",
    usageDescription:
      "Deux manieres d'activer un Skill : l'invocation explicite et l'activation automatique.",
    usageExplicitTitle: "Invocation explicite avec ",
    usageExplicitDesc:
      "La maniere la plus directe d\u0027utiliser un Skill est de le prefixer avec ",
    usageExplicitDescEnd:
      " dans votre prompt. Claude chargera les instructions du Skill et les appliquera immediatement.",
    usageExplicitCode: `# Invoquer un Skill directement
> /tdd-guide Implemente une fonction de validation d'email

# Claude va alors :
# 1. Charger les instructions du Skill "tdd-guide"
# 2. Ecrire les tests en premier (RED)
# 3. Implementer le minimum pour passer les tests (GREEN)
# 4. Refactorer si necessaire (IMPROVE)

# Autre exemple avec le Skill "plan"
> /plan Refactoring du module d'authentification

# Claude va produire un plan structure avant de toucher au code`,
    usageAutoTitle: "Activation automatique",
    usageAutoDesc:
      "Certains Skills s\u0027activent automatiquement selon le contexte. Par exemple, si votre fichier ",
    usageAutoDescEnd:
      " contient des instructions, Claude les applique systematiquement sans que vous ayez besoin de le demander.",
    usageAutoCode: `# Exemple de CLAUDE.md avec des Skills automatiques
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
- Aucun secret en dur dans le code`,
    usageCombineTitle: "Combiner les deux approches",
    usageCombineStart:
      "La strategie la plus efficace est de definir vos conventions generales dans ",
    usageCombineMid:
      " (activation automatique) et d\u0027invoquer les Skills specifiques avec ",
    usageCombineEnd:
      " pour les taches ponctuelles. Vous obtenez ainsi un comportement de base coherent avec la flexibilite d\u0027activer des workflows specialises a la demande.",
    topSkillsBadge: "Selection",
    topSkillsTitle: "Top Skills recommandes",
    topSkillsDescription:
      "Les 6 Skills incontournables pour transformer votre workflow de developpement.",
    exampleUsage: "Exemple d\u0027utilisation",
    tutorialBadge: "Tutorial",
    tutorialTitle: "Creez votre premier Skill en 10 minutes",
    tutorialDescription:
      "Un guide pas-a-pas pour creer un Skill personnalise qui automatise la creation de composants React.",
    tutoStep1Title: "Creer le dossier Skills",
    tutoStep1Desc:
      "Si ce n\u0027est pas deja fait, creez le dossier qui contiendra vos Skills personnalises.",
    tutoStep2Title: "Creer le fichier du Skill",
    tutoStep2Desc:
      "Creez un fichier Markdown avec un nom descriptif. Ici, on va creer un Skill pour generer des composants React standardises.",
    tutoStep3Title: "Ecrire les instructions du Skill",
    tutoStep3Desc:
      "Un bon Skill contient : un titre clair, une description de son objectif, les etapes a suivre, et des exemples concrets. Voici un exemple complet.",
    tutoStep4Title: "Tester votre Skill",
    tutoStep4Desc:
      "Lancez Claude Code et invoquez votre nouveau Skill. Il sera automatiquement detecte et disponible.",
    tutoStep5Title: "Iterer et affiner",
    tutoStep5Desc:
      "Un Skill n\u0027est jamais parfait du premier coup. Utilisez-le plusieurs fois, observez les resultats, et ajustez les instructions. Ajoutez des regles quand vous remarquez un pattern recurrent.",
    tutoStep5CalloutTitle: "Conseil de pro",
    tutoStep5CalloutStart:
      "Versionez vos Skills avec Git ! Creez un repository dedie pour vos fichiers ",
    tutoStep5CalloutEnd:
      " et partagez-les avec votre equipe. Chaque amelioration profite a tout le monde.",
    useCasesBadge: "En pratique",
    useCasesTitle: "Les Skills en action",
    useCasesDescription:
      "Trois exemples concrets qui montrent la puissance des Skills combines dans des scenarios reels.",
    useCasesCalloutTitle: "Skills et tokens",
    useCasesCallout:
      "Chaque Skill charge ajoute du contexte a la conversation de Claude. Evitez d\u0027invoquer trop de Skills simultanement pour ne pas surcharger la fenetre de contexte. Preferez combiner 2-3 Skills complementaires plutot que d\u0027en activer une dizaine.",
    nextBadge: "Etapes suivantes",
    nextTitle: "Continuez votre apprentissage",
    nextDescription:
      "Maintenant que vous maitrisez les Skills, explorez les deux autres piliers de Claude Code.",
    nextPromptingTitle: "Prompting avance",
    nextPromptingDesc:
      "Apprenez a formuler vos demandes pour obtenir des resultats optimaux. Techniques de prompt engineering adaptees a Claude Code.",
    nextPromptingCta: "Decouvrir",
    nextMcpTitle: "Les MCP (Model Context Protocol)",
    nextMcpDesc:
      "Connectez Claude Code a vos outils : GitHub, Slack, bases de donnees, APIs. Etendez ses capacites a l\u0027infini.",
    nextMcpCta: "Decouvrir",
    topSkills: [
      {
        name: "TDD Guide",
        category: "Dev",
        description:
          "Impose un workflow Test-Driven Development rigoureux : ecrire les tests d'abord, implementer le minimum pour les faire passer, puis refactorer.",
        useCase:
          "Vous demandez une nouvelle feature et Claude ecrit automatiquement les tests avant le code.",
      },
      {
        name: "Frontend Design",
        category: "Design",
        description:
          "Genere des composants UI modernes, accessibles et responsives avec Tailwind CSS, en respectant les bonnes pratiques de design system.",
        useCase:
          "Claude cree un formulaire de contact avec validation, animations et dark mode integre.",
      },
      {
        name: "Code Reviewer",
        category: "Qualite",
        description:
          "Revue de code automatique qui detecte les bugs, les problemes de performance, les failles de securite et les violations de conventions.",
        useCase:
          "Apres chaque modification, Claude analyse le code et signale les problemes classes par severite.",
      },
      {
        name: "Plan",
        category: "Process",
        description:
          "Cree un plan d'implementation structure avant de coder : PRD, architecture, design systeme, liste de taches priorisees.",
        useCase:
          "Avant un refactoring majeur, Claude produit un plan detaille avec les risques et les dependances.",
      },
      {
        name: "E2E Testing",
        category: "Testing",
        description:
          "Genere des tests end-to-end avec Playwright qui simulent de vrais parcours utilisateurs dans le navigateur.",
        useCase:
          "Claude ecrit un test complet pour le flow d'inscription : formulaire, email de confirmation, premiere connexion.",
      },
      {
        name: "Security Review",
        category: "Securite",
        description:
          "Analyse de securite systematique : injection SQL, XSS, CSRF, secrets en clair, dependances vulnerables, mauvaises configurations.",
        useCase:
          "Avant chaque commit, Claude verifie qu'aucun secret n'est expose et que les inputs sont valides.",
      },
    ],
    useCases: [
      {
        title: "Lancer un MVP en mode TDD",
        description:
          "Un entrepreneur utilise le Skill \"Plan\" pour structurer son projet, puis \"TDD Guide\" pour implementer chaque feature avec des tests solides. Resultat : un MVP fiable en 3 jours au lieu de 3 semaines.",
        skills: ["Plan", "TDD Guide", "Code Reviewer"],
      },
      {
        title: "Refactoring securise d'une codebase legacy",
        description:
          "Un lead developer combine \"Security Review\" pour identifier les failles existantes, \"E2E Testing\" pour ajouter une couverture de tests avant de toucher au code, puis \"Code Reviewer\" pour valider chaque changement.",
        skills: ["Security Review", "E2E Testing", "Code Reviewer"],
      },
      {
        title: "Creer un design system coherent",
        description:
          "Une equipe utilise \"Frontend Design\" pour generer des composants UI consistants, puis cree un Skill personnalise qui encode les conventions de leur charte graphique. Chaque nouveau composant respecte automatiquement le systeme.",
        skills: ["Frontend Design", "Skill personnalise"],
      },
    ],
  },
  en: {
    metaTitle: "Claude Code Skills",
    metaDescription:
      "Learn to use and create Skills for Claude Code. Automate your workflows, add capabilities and teach new talents to your AI assistant.",
    jsonLdTitle: "Claude Code Skills",
    jsonLdDescription:
      "Learn to use and create Skills for Claude Code.",
    heroBadge: "Skills Guide",
    heroTitle1: "Skills: Teach ",
    heroTitle2: "new talents",
    heroTitle3: " to Claude Code",
    heroDescription:
      "Skills turn Claude Code into a specialized assistant. Add capabilities, automate your workflows and create your own reusable recipes.",
    heroCta1: "Create your first Skill",
    heroCta2: "See recommended Skills",
    conceptBadge: "Concept",
    conceptTitle: "What is a Skill?",
    conceptDescription:
      "Understand Skills in 2 minutes, even if you are not a developer.",
    conceptCardTitle: "A Skill is a recipe for Claude",
    conceptCardP1Start:
      "Imagine Claude Code is a talented chef. It already knows how to cook, but if you give it a ",
    conceptCardP1Bold1: "precise recipe",
    conceptCardP1Mid:
      ", it will produce exactly the dish you want, every time. Skills are those recipes: ",
    conceptCardP1Bold2: "structured instructions",
    conceptCardP1End:
      " that guide Claude to execute complex tasks in a reproducible way.",
    conceptCardP2Start: "Concretely, a Skill is a ",
    conceptCardP2Bold1: "Markdown file",
    conceptCardP2Mid:
      " that defines a workflow, rules and steps to follow. When you invoke a Skill, Claude loads it into memory and adapts its behavior accordingly. It is like a ",
    conceptCardP2Bold2: "plugin",
    conceptCardP2End: " you can activate on demand.",
    conceptCalloutTitle: "Simple analogy",
    conceptCalloutStart:
      "If MCPs are Claude\u0027s ",
    conceptCalloutBold1: "tools",
    conceptCalloutMid:
      " (hammer, screwdriver, drill), Skills are the ",
    conceptCalloutBold2: "user manuals",
    conceptCalloutEnd:
      " that explain ",
    conceptCalloutEm1: "how",
    conceptCalloutAnd: " and ",
    conceptCalloutEm2: "when",
    conceptCalloutFinal:
      " to use those tools together to accomplish a complex task.",
    typesBadge: "Categories",
    typesTitle: "The three types of Skills",
    typesDescription:
      "Each type addresses a different need. Combine them for maximum efficiency.",
    builtInTitle: "Built-in Skills",
    builtInDesc:
      "Provided by the community and tools, these Skills are available immediately. They cover the most common workflows: TDD, code review, planning, etc.",
    builtInFooter: "Ready to use, maintained by the community",
    customTitle: "Custom Skills",
    customDescStart: "Created by you in the ",
    customDescEnd:
      " folder. They are available in all your projects and reflect your personal preferences.",
    customFooter: "Personal, available everywhere",
    projectTitle: "Project Skills",
    projectDescStart: "Defined in the ",
    projectDescMid: " file or the ",
    projectDescEnd:
      " folder of your project. Shared with the entire team via Git.",
    projectFooter: "Shared with the team, project-specific",
    typesCalloutTitle: "Priority order",
    typesCallout:
      "When multiple Skills coexist, Claude applies Project Skills first (context-specific), then Custom Skills (your preferences), then Built-in Skills. This lets you override default behavior with your own conventions.",
    usageBadge: "Usage",
    usageTitle: "How to use a Skill",
    usageDescription:
      "Two ways to activate a Skill: explicit invocation and automatic activation.",
    usageExplicitTitle: "Explicit invocation with ",
    usageExplicitDesc:
      "The most direct way to use a Skill is to prefix it with ",
    usageExplicitDescEnd:
      " in your prompt. Claude will load the Skill instructions and apply them immediately.",
    usageExplicitCode: `# Invoke a Skill directly
> /tdd-guide Implement an email validation function

# Claude will then:
# 1. Load the "tdd-guide" Skill instructions
# 2. Write tests first (RED)
# 3. Implement the minimum to pass tests (GREEN)
# 4. Refactor if needed (IMPROVE)

# Another example with the "plan" Skill
> /plan Refactoring the authentication module

# Claude will produce a structured plan before touching the code`,
    usageAutoTitle: "Automatic activation",
    usageAutoDesc:
      "Some Skills activate automatically based on context. For example, if your ",
    usageAutoDescEnd:
      " file contains instructions, Claude applies them systematically without you needing to ask.",
    usageAutoCode: `# Example CLAUDE.md with automatic Skills
# This file is read automatically by Claude at each session

## Code conventions
- Always use strict TypeScript
- No \`any\`, use \`unknown\` instead
- Tests required for every new function

## Style
- Immutability: never mutate directly
- Files < 400 lines
- Functions < 50 lines

## Before each commit
- Run the code-reviewer agent
- Check test coverage (80%+)
- No hardcoded secrets in the code`,
    usageCombineTitle: "Combine both approaches",
    usageCombineStart:
      "The most effective strategy is to define your general conventions in ",
    usageCombineMid:
      " (automatic activation) and invoke specific Skills with ",
    usageCombineEnd:
      " for one-off tasks. You get a consistent base behavior with the flexibility to activate specialized workflows on demand.",
    topSkillsBadge: "Selection",
    topSkillsTitle: "Top recommended Skills",
    topSkillsDescription:
      "The 6 essential Skills to transform your development workflow.",
    exampleUsage: "Example usage",
    tutorialBadge: "Tutorial",
    tutorialTitle: "Create your first Skill in 10 minutes",
    tutorialDescription:
      "A step-by-step guide to create a custom Skill that automates React component creation.",
    tutoStep1Title: "Create the Skills folder",
    tutoStep1Desc:
      "If not already done, create the folder that will contain your custom Skills.",
    tutoStep2Title: "Create the Skill file",
    tutoStep2Desc:
      "Create a Markdown file with a descriptive name. Here, we will create a Skill to generate standardized React components.",
    tutoStep3Title: "Write the Skill instructions",
    tutoStep3Desc:
      "A good Skill contains: a clear title, a description of its purpose, steps to follow, and concrete examples. Here is a complete example.",
    tutoStep4Title: "Test your Skill",
    tutoStep4Desc:
      "Launch Claude Code and invoke your new Skill. It will be automatically detected and available.",
    tutoStep5Title: "Iterate and refine",
    tutoStep5Desc:
      "A Skill is never perfect on the first try. Use it several times, observe the results, and adjust the instructions. Add rules when you notice a recurring pattern.",
    tutoStep5CalloutTitle: "Pro tip",
    tutoStep5CalloutStart:
      "Version your Skills with Git! Create a dedicated repository for your ",
    tutoStep5CalloutEnd:
      " files and share them with your team. Every improvement benefits everyone.",
    useCasesBadge: "In practice",
    useCasesTitle: "Skills in action",
    useCasesDescription:
      "Three concrete examples that show the power of combined Skills in real-world scenarios.",
    useCasesCalloutTitle: "Skills and tokens",
    useCasesCallout:
      "Each loaded Skill adds context to Claude\u0027s conversation. Avoid invoking too many Skills simultaneously to not overload the context window. Prefer combining 2-3 complementary Skills rather than activating a dozen.",
    nextBadge: "Next steps",
    nextTitle: "Continue your learning",
    nextDescription:
      "Now that you have mastered Skills, explore the two other pillars of Claude Code.",
    nextPromptingTitle: "Advanced prompting",
    nextPromptingDesc:
      "Learn to formulate your requests for optimal results. Prompt engineering techniques adapted to Claude Code.",
    nextPromptingCta: "Discover",
    nextMcpTitle: "MCPs (Model Context Protocol)",
    nextMcpDesc:
      "Connect Claude Code to your tools: GitHub, Slack, databases, APIs. Extend its capabilities infinitely.",
    nextMcpCta: "Discover",
    topSkills: [
      {
        name: "TDD Guide",
        category: "Dev",
        description:
          "Enforces a rigorous Test-Driven Development workflow: write tests first, implement the minimum to pass them, then refactor.",
        useCase:
          "You ask for a new feature and Claude automatically writes the tests before the code.",
      },
      {
        name: "Frontend Design",
        category: "Design",
        description:
          "Generates modern, accessible and responsive UI components with Tailwind CSS, following design system best practices.",
        useCase:
          "Claude creates a contact form with validation, animations and built-in dark mode.",
      },
      {
        name: "Code Reviewer",
        category: "Quality",
        description:
          "Automatic code review that detects bugs, performance issues, security flaws and convention violations.",
        useCase:
          "After each change, Claude analyzes the code and reports issues classified by severity.",
      },
      {
        name: "Plan",
        category: "Process",
        description:
          "Creates a structured implementation plan before coding: PRD, architecture, system design, prioritized task list.",
        useCase:
          "Before a major refactoring, Claude produces a detailed plan with risks and dependencies.",
      },
      {
        name: "E2E Testing",
        category: "Testing",
        description:
          "Generates end-to-end tests with Playwright that simulate real user journeys in the browser.",
        useCase:
          "Claude writes a complete test for the signup flow: form, confirmation email, first login.",
      },
      {
        name: "Security Review",
        category: "Security",
        description:
          "Systematic security analysis: SQL injection, XSS, CSRF, plaintext secrets, vulnerable dependencies, misconfigurations.",
        useCase:
          "Before each commit, Claude verifies that no secret is exposed and that inputs are validated.",
      },
    ],
    useCases: [
      {
        title: "Launch an MVP with TDD",
        description:
          "An entrepreneur uses the \"Plan\" Skill to structure their project, then \"TDD Guide\" to implement each feature with solid tests. Result: a reliable MVP in 3 days instead of 3 weeks.",
        skills: ["Plan", "TDD Guide", "Code Reviewer"],
      },
      {
        title: "Secure refactoring of a legacy codebase",
        description:
          "A lead developer combines \"Security Review\" to identify existing flaws, \"E2E Testing\" to add test coverage before touching the code, then \"Code Reviewer\" to validate each change.",
        skills: ["Security Review", "E2E Testing", "Code Reviewer"],
      },
      {
        title: "Create a coherent design system",
        description:
          "A team uses \"Frontend Design\" to generate consistent UI components, then creates a custom Skill that encodes their brand guidelines. Every new component automatically follows the system.",
        skills: ["Frontend Design", "Custom Skill"],
      },
    ],
  },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = translations[locale as "fr" | "en"] ?? translations.fr;
  return createPageMetadata({
    title: t.metaTitle,
    description: t.metaDescription,
    path: `/${locale}/skills`,
    locale,
  });
}

function buildArticleJsonLd(locale: string) {
  const t = translations[locale as "fr" | "en"] ?? translations.fr;
  return createArticleSchema({
    title: t.jsonLdTitle,
    description: t.jsonLdDescription,
    url: `${SITE_URL}/${locale}/skills`,
    locale,
    datePublished: "2026-03-07",
    dateModified: "2026-03-10",
  });
}

const skillIcons = [FlaskConical, Palette, SearchCheck, ClipboardList, TestTube2, ShieldCheck];
const skillCategoryColors = [
  "bg-brand-500/10 text-brand-700 dark:text-brand-400",
  "bg-violet-500/10 text-violet-500",
  "bg-emerald-500/10 text-emerald-500",
  "bg-accent-500/10 text-accent-500",
  "bg-sky-500/10 text-sky-500",
  "bg-red-500/10 text-red-500",
];
const skillIconColors = [
  "text-brand-700 dark:text-brand-400",
  "text-violet-500",
  "text-emerald-500",
  "text-accent-500",
  "text-sky-500",
  "text-red-500",
];
const skillIconBgs = [
  "from-brand-500/20 to-brand-500/5",
  "from-violet-500/20 to-violet-500/5",
  "from-emerald-500/20 to-emerald-500/5",
  "from-accent-500/20 to-accent-500/5",
  "from-sky-500/20 to-sky-500/5",
  "from-red-500/20 to-red-500/5",
];

const useCaseIcons = [Rocket, Layers, Sparkles];

export default async function SkillsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = translations[locale as "fr" | "en"] ?? translations.fr;

  const topSkills = t.topSkills.map((skill, i) => ({
    ...skill,
    icon: skillIcons[i],
    categoryColor: skillCategoryColors[i],
    iconColor: skillIconColors[i],
    iconBg: skillIconBgs[i],
  }));

  const useCases = t.useCases.map((uc, i) => ({
    ...uc,
    icon: useCaseIcons[i],
  }));

  return (
    <>
      {/* JSON-LD structured data: static schema from hardcoded values, no user input */}
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

        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-20 sm:px-6 sm:pb-24 sm:pt-28 lg:px-8 lg:pb-28 lg:pt-32">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-brand-500/10 px-4 py-1.5 text-sm text-brand-300">
              <Wand2 className="h-4 w-4" aria-hidden="true" />
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
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
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
                  <BookOpen className="h-6 w-6 text-brand-700 dark:text-brand-400" aria-hidden="true" />
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
                <Users className="h-6 w-6 text-brand-700 dark:text-brand-400" aria-hidden="true" />
              </div>
              <h3 className="mb-2 text-xl font-bold">Built-in Skills</h3>
              <p className="mb-4 text-sm leading-relaxed text-slate-500 dark:text-slate-300">
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
                <Boxes className="h-4 w-4" aria-hidden="true" />
                <span>Prets a l&apos;emploi, maintenus par la communaute</span>
              </div>
            </div>

            {/* Custom Skills */}
            <div className="glass-card p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-accent-500/20 to-accent-500/5">
                <FolderCog className="h-6 w-6 text-accent-500" aria-hidden="true" />
              </div>
              <h3 className="mb-2 text-xl font-bold">Custom Skills</h3>
              <p className="mb-4 text-sm leading-relaxed text-slate-500 dark:text-slate-300">
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
                <Lightbulb className="h-4 w-4" aria-hidden="true" />
                <span>Personnels, disponibles partout</span>
              </div>
            </div>

            {/* Project Skills */}
            <div className="glass-card p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/20 to-violet-500/5">
                <FileCode2 className="h-6 w-6 text-violet-500" aria-hidden="true" />
              </div>
              <h3 className="mb-2 text-xl font-bold">Project Skills</h3>
              <p className="mb-4 text-sm leading-relaxed text-slate-500 dark:text-slate-300">
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
                <Users className="h-4 w-4" aria-hidden="true" />
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
                  <Terminal className="h-4 w-4 text-brand-700 dark:text-brand-400" aria-hidden="true" />
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
                  <Sparkles className="h-4 w-4 text-accent-500" aria-hidden="true" />
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
                  <p className="mb-4 flex-1 text-sm leading-relaxed text-slate-500 dark:text-slate-300">
                    {skill.description}
                  </p>
                  <div className="rounded-lg border border-slate-200/60 bg-slate-50/80 p-3 dark:border-slate-700/60 dark:bg-slate-800/50">
                    <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
                      <Play className="h-3 w-3" aria-hidden="true" />
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
                    <Icon className="h-6 w-6 text-brand-700 dark:text-brand-400" aria-hidden="true" />
                  </div>
                  <h3 className="mb-3 text-lg font-bold">{useCase.title}</h3>
                  <p className="mb-6 flex-1 text-sm leading-relaxed text-slate-500 dark:text-slate-300">
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
            title="Skills maitrisés. Et maintenant ?"
            description="Combinez vos Skills avec les MCP pour connecter Claude Code a vos outils, et affinez vos prompts pour tirer le maximum de chaque interaction."
            centered
          />

          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            <Link
              href={`/${locale}/prompting`}
              className="glass-card group flex items-start gap-4 p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-accent-500/20 to-accent-500/5">
                <MessageSquare className="h-6 w-6 text-accent-500" aria-hidden="true" />
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
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </span>
              </div>
            </Link>

            <Link
              href={`/${locale}/mcp`}
              className="glass-card group flex items-start gap-4 p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/20 to-violet-500/5">
                <Boxes className="h-6 w-6 text-violet-500" aria-hidden="true" />
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
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
