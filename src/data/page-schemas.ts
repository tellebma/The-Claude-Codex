/**
 * SEO — Schemas JSON-LD additionnels par page (HowTo, SoftwareApplication).
 *
 * Complement de `page-faqs.ts` (FAQPage). Convention identique : la cle est
 * le path canonique sans locale ni trailing slash (ex: "/mcp/workflow-design-playwright").
 * Pour les paths divergents FR/EN, inscrire les deux entrees.
 *
 * Les route pages appellent `getPageExtraSchemas(path, locale)` et fusionnent
 * le resultat dans le tableau `extraJsonLd` injecte dans le DOM.
 */

import {
  createHowToSchema,
  createSoftwareApplicationSchema,
} from "@/lib/structured-data";
import { SITE_URL } from "@/lib/metadata";

type SchemaBuilder = (locale: string) => Record<string, unknown>;

const url = (path: string): string => `${SITE_URL}${path}`;

/**
 * DSK-6 — HowTo : workflow design Claude Code + Playwright MCP.
 * Etapes derivees du contenu MDX (onglet "workflow complet").
 */
const workflowDesignPlaywrightHowTo: Record<string, SchemaBuilder> = {
  fr: (locale) =>
    createHowToSchema({
      title: "Designer avec Claude Code et Playwright MCP",
      description:
        "Valider visuellement un composant genere par Claude Code avec Playwright MCP, etape par etape.",
      url: url("/mcp/workflow-design-playwright"),
      locale,
      steps: [
        {
          name: "Verifier le MCP Playwright",
          text: "Confirmer que le serveur Playwright MCP est installe et disponible dans Claude Code.",
        },
        {
          name: "Ecrire le brief",
          text: "Decrire le composant attendu : intention, contraintes visuelles et viewports cibles.",
        },
        {
          name: "Generer le composant",
          text: "Laisser Claude Code produire une premiere version du composant a partir du brief.",
        },
        {
          name: "Capturer en multi-viewport",
          text: "Prendre des screenshots du rendu sur plusieurs largeurs d'ecran via Playwright MCP.",
        },
        {
          name: "Critiquer et iterer",
          text: "Faire critiquer les captures par Claude, puis iterer jusqu'a un rendu satisfaisant.",
        },
        {
          name: "Controler l'accessibilite",
          text: "Verifier le contraste, le focus clavier et la semantique avant de valider.",
        },
      ],
    }),
  en: (locale) =>
    createHowToSchema({
      title: "Designing with Claude Code and Playwright MCP",
      description:
        "Visually validate a Claude Code component with Playwright MCP, step by step.",
      url: url("/mcp/workflow-design-playwright"),
      locale,
      steps: [
        {
          name: "Check the Playwright MCP",
          text: "Confirm the Playwright MCP server is installed and available in Claude Code.",
        },
        {
          name: "Write the brief",
          text: "Describe the target component: intent, visual constraints and target viewports.",
        },
        {
          name: "Generate the component",
          text: "Let Claude Code produce a first version of the component from the brief.",
        },
        {
          name: "Capture multi-viewport",
          text: "Take screenshots of the render at several screen widths via Playwright MCP.",
        },
        {
          name: "Critique and iterate",
          text: "Have Claude critique the captures, then iterate until the render is right.",
        },
        {
          name: "Check accessibility",
          text: "Verify contrast, keyboard focus and semantics before validating.",
        },
      ],
    }),
};

/**
 * DSK-8 — HowTo : refaire un composant existant avec Impeccable + Playwright.
 * Etapes derivees des sections Avant / Pendant / Apres du MDX.
 */
const redoCardHowTo: Record<string, SchemaBuilder> = {
  fr: (locale) =>
    createHowToSchema({
      title: "Refaire une card avec Impeccable et Playwright",
      description:
        "Reprendre une card existante et la refaire avec Impeccable et Playwright MCP, captures avant/apres a l'appui.",
      url: url("/content/refaire-une-card-avec-impeccable-et-playwright"),
      locale,
      steps: [
        {
          name: "Capturer l'etat initial",
          text: "Prendre un screenshot de la card existante avant toute modification, puis la faire critiquer.",
        },
        {
          name: "Cadrer et generer avec Impeccable",
          text: "Cadrer le besoin, puis laisser Impeccable proposer un layout et generer une premiere version.",
        },
        {
          name: "Iterer et valider avec Playwright",
          text: "Capturer le nouveau rendu en multi-viewport, iterer, puis comparer avant/apres avant de valider.",
        },
      ],
    }),
  en: (locale) =>
    createHowToSchema({
      title: "Redoing a card with Impeccable and Playwright",
      description:
        "Take an existing card and rebuild it with Impeccable and Playwright MCP, with before/after captures.",
      url: url("/content/redo-a-card-with-impeccable-and-playwright"),
      locale,
      steps: [
        {
          name: "Capture the initial state",
          text: "Take a screenshot of the existing card before any change, then have it critiqued.",
        },
        {
          name: "Frame and generate with Impeccable",
          text: "Frame the need, then let Impeccable propose a layout and generate a first version.",
        },
        {
          name: "Iterate and validate with Playwright",
          text: "Capture the new render multi-viewport, iterate, then compare before/after before validating.",
        },
      ],
    }),
};

/**
 * DSK-7 — SoftwareApplication : fiche outil Huashu Design.
 * Faits sources via API GitHub (spdx_id=MIT, relicence 2026-05-14) et README,
 * verifies 2026-06-03. Gratuit (licence MIT, usage perso et commercial).
 */
const huashuDesignSoftware: Record<string, SchemaBuilder> = {
  fr: (locale) =>
    createSoftwareApplicationSchema({
      name: "Huashu Design",
      description:
        "Skill MIT de Huasheng (花叔) qui genere des prototypes HTML cliquables, des decks PPTX et des animations MP4 depuis Claude Code.",
      url: url("/skills/huashu-design"),
      license: "MIT",
      licenseUrl: "https://github.com/alchaincyf/huashu-design",
      offerPrice: "0",
      locale,
    }),
  en: (locale) =>
    createSoftwareApplicationSchema({
      name: "Huashu Design",
      description:
        "MIT skill by Huasheng (花叔) that generates clickable HTML prototypes, PPTX decks and MP4 animations from Claude Code.",
      url: url("/skills/huashu-design"),
      license: "MIT",
      licenseUrl: "https://github.com/alchaincyf/huashu-design",
      offerPrice: "0",
      locale,
    }),
};

/**
 * CC-5 — HowTo : les 3 stages du pattern LLM Council (First opinions /
 * Review anonymisee / Final response). Source primaire karpathy/llm-council.
 */
const claudeCouncilHowTo: Record<string, SchemaBuilder> = {
  fr: (locale) =>
    createHowToSchema({
      title: "Claude Council : faire délibérer plusieurs IA",
      description:
        "Le pattern LLM Council applique a Claude : premiers avis independants, revue croisee anonymisee, synthese d'un Chairman.",
      url: url("/skills/claude-council"),
      locale,
      steps: [
        {
          name: "Premiers avis",
          text: "Chaque conseiller repond a la question de facon independante, sans voir les reponses des autres.",
        },
        {
          name: "Revue croisee anonymisee",
          text: "Chaque conseiller recoit les autres reponses sans connaitre leurs auteurs, et les classe sur l'exactitude et la profondeur.",
        },
        {
          name: "Synthese finale",
          text: "Un Chairman designe lit tous les avis et tous les classements, arbitre les desaccords et produit une recommandation unique.",
        },
      ],
    }),
  en: (locale) =>
    createHowToSchema({
      title: "Claude Council: make several AIs deliberate",
      description:
        "The LLM Council pattern applied to Claude: independent first opinions, anonymized cross-review, Chairman synthesis.",
      url: url("/skills/claude-council"),
      locale,
      steps: [
        {
          name: "First opinions",
          text: "Each advisor answers the question independently, without seeing the other answers.",
        },
        {
          name: "Anonymized cross-review",
          text: "Each advisor receives the other answers without knowing who wrote them, and ranks them on accuracy and insight.",
        },
        {
          name: "Final response",
          text: "A designated Chairman reads every opinion and ranking, arbitrates disagreements and produces a single recommendation.",
        },
      ],
    }),
};

const PAGE_SCHEMAS: Record<string, Record<string, SchemaBuilder>> = {
  "/mcp/workflow-design-playwright": workflowDesignPlaywrightHowTo,
  "/content/refaire-une-card-avec-impeccable-et-playwright": redoCardHowTo,
  "/content/redo-a-card-with-impeccable-and-playwright": redoCardHowTo,
  "/skills/huashu-design": huashuDesignSoftware,
  "/skills/claude-council": claudeCouncilHowTo,
};

/**
 * Retourne les schemas JSON-LD additionnels (HowTo, SoftwareApplication) pour
 * un path canonique et une locale, ou un tableau vide si aucun n'est defini.
 */
export function getPageExtraSchemas(
  canonicalPath: string,
  locale: string,
): ReadonlyArray<Record<string, unknown>> {
  const entry = PAGE_SCHEMAS[canonicalPath];
  if (!entry) return [];
  const lang = locale === "en" ? "en" : "fr";
  const builder = entry[lang] ?? entry.fr;
  return builder ? [builder(lang)] : [];
}
