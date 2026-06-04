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

/**
 * HowTo : installer ComfyUI en local et le brancher a Claude Code via MCP.
 * Etapes derivees des <Step> du MDX (Cloner -> Lancer ComfyUI).
 */
const comfyuiMcpLocalHowTo: Record<string, SchemaBuilder> = {
  fr: (locale) =>
    createHowToSchema({
      title: "Brancher ComfyUI a Claude Code via MCP",
      description:
        "Installer ComfyUI en local et generer des images sur son GPU depuis Claude Code via MCP, etape par etape.",
      url: url("/mcp/comfyui-mcp-local"),
      locale,
      steps: [
        {
          name: "Cloner ComfyUI",
          text: "Recuperer le depot ComfyUI en local avec git clone.",
        },
        {
          name: "Creer un environnement virtuel Python",
          text: "Isoler les dependances dans un venv Python dedie.",
        },
        {
          name: "Installer PyTorch avec support CUDA",
          text: "Installer la build PyTorch correspondant a la version CUDA de la machine.",
        },
        {
          name: "Installer les dependances ComfyUI",
          text: "Installer les paquets requis depuis requirements.txt.",
        },
        {
          name: "Telecharger Flux Schnell (fp8)",
          text: "Recuperer le modele Flux Schnell en version fp8 et le placer dans le dossier des modeles.",
        },
        {
          name: "Lancer ComfyUI",
          text: "Demarrer le serveur ComfyUI, puis le brancher a Claude Code via le MCP pour generer des images.",
        },
      ],
    }),
  en: (locale) =>
    createHowToSchema({
      title: "Connect ComfyUI to Claude Code via MCP",
      description:
        "Install ComfyUI locally and generate images on your GPU from Claude Code via MCP, step by step.",
      url: url("/mcp/comfyui-mcp-local"),
      locale,
      steps: [
        {
          name: "Clone ComfyUI",
          text: "Pull the ComfyUI repository locally with git clone.",
        },
        {
          name: "Create a Python virtual environment",
          text: "Isolate dependencies in a dedicated Python venv.",
        },
        {
          name: "Install PyTorch with CUDA support",
          text: "Install the PyTorch build matching the machine's CUDA version.",
        },
        {
          name: "Install ComfyUI dependencies",
          text: "Install the required packages from requirements.txt.",
        },
        {
          name: "Download Flux Schnell (fp8)",
          text: "Download the Flux Schnell fp8 model and place it in the models folder.",
        },
        {
          name: "Launch ComfyUI",
          text: "Start the ComfyUI server, then wire it to Claude Code via MCP to generate images.",
        },
      ],
    }),
};

/**
 * HowTo : piloter un workflow ComfyUI JSON depuis Claude Code via un MCP custom.
 * Etapes derivees des <Step> du MDX.
 */
const comfyuiWorkflowPilotingHowTo: Record<string, SchemaBuilder> = {
  fr: (locale) =>
    createHowToSchema({
      title: "Piloter un workflow ComfyUI JSON depuis Claude Code",
      description:
        "Exposer un workflow ComfyUI exporte en JSON via un MCP custom et le faire editer dynamiquement par Claude Code.",
      url: url("/mcp/comfyui-workflow-piloting"),
      locale,
      steps: [
        {
          name: "Creer le projet et installer les dependances",
          text: "Initialiser le projet du serveur MCP et installer ses dependances.",
        },
        {
          name: "Preparer le fichier de workflow JSON",
          text: "Exporter le workflow ComfyUI en JSON (API format) et le placer dans le projet.",
        },
        {
          name: "Ecrire le wrapper MCP",
          text: "Coder l'outil MCP qui charge le JSON, modifie les noeuds (sampler, ControlNet, prompt) et l'envoie a ComfyUI.",
        },
        {
          name: "Configurer Claude Code pour utiliser le MCP",
          text: "Declarer le serveur MCP dans Claude Code pour piloter le workflow en langage naturel.",
        },
      ],
    }),
  en: (locale) =>
    createHowToSchema({
      title: "Pilot a ComfyUI JSON workflow from Claude Code",
      description:
        "Expose an exported ComfyUI workflow JSON via a custom MCP and have Claude Code edit it dynamically.",
      url: url("/mcp/comfyui-workflow-piloting"),
      locale,
      steps: [
        {
          name: "Create the project and install dependencies",
          text: "Initialize the MCP server project and install its dependencies.",
        },
        {
          name: "Prepare the JSON workflow file",
          text: "Export the ComfyUI workflow as JSON (API format) and add it to the project.",
        },
        {
          name: "Write the MCP wrapper",
          text: "Code the MCP tool that loads the JSON, edits nodes (sampler, ControlNet, prompt) and sends it to ComfyUI.",
        },
        {
          name: "Configure Claude Code to use the MCP",
          text: "Register the MCP server in Claude Code to drive the workflow in natural language.",
        },
      ],
    }),
};

/**
 * HowTo : agent Claude SDK qui genere et publie des assets visuels.
 * Etapes derivees du pipeline decrit dans le MDX (generer -> optimiser -> upload).
 */
const agentGenerationAssetsHowTo: Record<string, SchemaBuilder> = {
  fr: (locale) =>
    createHowToSchema({
      title: "Construire un agent Claude qui genere et publie des assets",
      description:
        "Batir un agent Claude SDK qui genere des images via Flux/Replicate, les optimise en WebP et les upload sur un storage.",
      url: url("/agents/agent-generation-assets"),
      locale,
      steps: [
        {
          name: "Cadrer l'agent et ses outils",
          text: "Definir le role de l'agent et les outils dont il dispose : generation d'image, optimisation, upload.",
        },
        {
          name: "Generer l'image via Flux/Replicate",
          text: "Appeler l'API Flux/Replicate depuis l'outil de generation pour produire l'image.",
        },
        {
          name: "Optimiser en WebP",
          text: "Convertir et compresser l'image generee en WebP pour le web.",
        },
        {
          name: "Uploader sur le storage",
          text: "Envoyer l'asset optimise sur le storage cible et recuperer son URL publique.",
        },
      ],
    }),
  en: (locale) =>
    createHowToSchema({
      title: "Build a Claude agent that generates and publishes assets",
      description:
        "Build a Claude SDK agent that generates images via Flux/Replicate, optimizes them to WebP and uploads them to storage.",
      url: url("/agents/agent-generation-assets"),
      locale,
      steps: [
        {
          name: "Frame the agent and its tools",
          text: "Define the agent's role and the tools it can use: image generation, optimization, upload.",
        },
        {
          name: "Generate the image via Flux/Replicate",
          text: "Call the Flux/Replicate API from the generation tool to produce the image.",
        },
        {
          name: "Optimize to WebP",
          text: "Convert and compress the generated image to WebP for the web.",
        },
        {
          name: "Upload to storage",
          text: "Send the optimized asset to the target storage and return its public URL.",
        },
      ],
    }),
};

const PAGE_SCHEMAS: Record<string, Record<string, SchemaBuilder>> = {
  "/mcp/workflow-design-playwright": workflowDesignPlaywrightHowTo,
  "/mcp/comfyui-mcp-local": comfyuiMcpLocalHowTo,
  "/mcp/comfyui-workflow-piloting": comfyuiWorkflowPilotingHowTo,
  "/agents/agent-generation-assets": agentGenerationAssetsHowTo,
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
