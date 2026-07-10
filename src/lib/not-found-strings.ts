import type {
  NotFoundBundle,
  NotFoundStrings,
} from "@/components/not-found/NotFoundClient";
import type { SearchEntry } from "@/lib/search-index";
import { getRecentArticles } from "@/lib/recent-articles";

export type Locale = "fr" | "en" | "es";

export const NOT_FOUND_STRINGS_FR: NotFoundStrings = {
  title: "Page introuvable",
  subtitle:
    "Cette page n'existe pas ou a été déplacée. Whobee vous propose quelques pistes pour retrouver votre chemin.",
  suggestionsTitle: "Vous cherchiez peut-être...",
  fallbackTitle: "Par où commencer ?",
  recentTitle: "Articles récents",
  backToHome: "Retour à l'accueil",
  searchHint: "Ouvrir la recherche",
  urlLabel: "URL demandée :",
  robotAlt: "Robot 3D interactif qui suit votre souris",
};

export const NOT_FOUND_STRINGS_EN: NotFoundStrings = {
  title: "Page not found",
  subtitle:
    "This page doesn't exist or has been moved. Whobee has a few ideas to help you find your way.",
  suggestionsTitle: "Were you looking for...",
  fallbackTitle: "Where to start?",
  recentTitle: "Recent articles",
  backToHome: "Back to home",
  searchHint: "Open search",
  urlLabel: "Requested URL:",
  robotAlt: "Interactive 3D robot tracking your cursor",
};

export const NOT_FOUND_STRINGS_ES: NotFoundStrings = {
  title: "Página no encontrada",
  subtitle:
    "Esta página no existe o ha sido movida. Whobee te propone algunas pistas para encontrar tu camino.",
  suggestionsTitle: "Quizás buscabas...",
  fallbackTitle: "¿Por dónde empezar?",
  recentTitle: "Artículos recientes",
  backToHome: "Volver al inicio",
  searchHint: "Abrir la búsqueda",
  urlLabel: "URL solicitada:",
  robotAlt: "Robot 3D interactivo que sigue tu cursor",
};

type SuggestionPage = Pick<SearchEntry, "title" | "description" | "href">;

export const FALLBACK_SUGGESTIONS_FR: ReadonlyArray<SuggestionPage> = [
  {
    title: "Accueil",
    description: "Retour à la page principale du guide.",
    href: "/",
  },
  {
    title: "Configurateur",
    description:
      "Générez votre configuration Claude Code personnalisée en 2 minutes.",
    href: "/configurator",
  },
  {
    title: "Démarrer",
    description: "Installation, premiers pas et votre premier projet guidé.",
    href: "/getting-started",
  },
];

export const FALLBACK_SUGGESTIONS_EN: ReadonlyArray<SuggestionPage> = [
  {
    title: "Home",
    description: "Back to the main guide page.",
    href: "/",
  },
  {
    title: "Configurator",
    description: "Generate your personalized Claude Code setup in 2 minutes.",
    href: "/configurator",
  },
  {
    title: "Getting Started",
    description:
      "Installation, first steps and your first guided project.",
    href: "/getting-started",
  },
];

export const FALLBACK_SUGGESTIONS_ES: ReadonlyArray<SuggestionPage> = [
  {
    title: "Inicio",
    description: "Volver a la página principal de la guía.",
    href: "/",
  },
  {
    title: "Configurador",
    description:
      "Genera tu configuración de Claude Code personalizada en 2 minutos.",
    href: "/configurator",
  },
  {
    title: "Empezar",
    description:
      "Instalación, primeros pasos y tu primer proyecto guiado.",
    href: "/getting-started",
  },
];

export function getNotFoundBundles(): Readonly<Record<Locale, NotFoundBundle>> {
  return {
    fr: {
      strings: NOT_FOUND_STRINGS_FR,
      fallbackSuggestions: FALLBACK_SUGGESTIONS_FR,
      recentArticles: getRecentArticles("fr", 4),
    },
    en: {
      strings: NOT_FOUND_STRINGS_EN,
      fallbackSuggestions: FALLBACK_SUGGESTIONS_EN,
      recentArticles: getRecentArticles("en", 4),
    },
    es: {
      strings: NOT_FOUND_STRINGS_ES,
      fallbackSuggestions: FALLBACK_SUGGESTIONS_ES,
      recentArticles: getRecentArticles("es", 4),
    },
  };
}
