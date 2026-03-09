import type { Metadata } from "next";

export const SITE_URL = "https://claude-codex.fr";
export const SITE_NAME = "The Claude Codex";
export const SITE_LOCALE = "fr_FR";
export const DEFAULT_OG_IMAGE = "/og/og-default.png";

interface PageMetadataOptions {
  readonly title: string;
  readonly description: string;
  readonly path: string;
  readonly ogImage?: string;
  readonly type?: "website" | "article";
  readonly publishedTime?: string;
  readonly modifiedTime?: string;
}

/**
 * Generates complete metadata for a page including OpenGraph, Twitter,
 * canonical URL, and all required meta tags.
 */
export function createPageMetadata({
  title,
  description,
  path,
  ogImage,
  type = "article",
  publishedTime,
  modifiedTime,
}: PageMetadataOptions): Metadata {
  const canonicalUrl = `${SITE_URL}${path}`;
  const imageUrl = ogImage ?? DEFAULT_OG_IMAGE;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      type,
      locale: SITE_LOCALE,
      url: canonicalUrl,
      siteName: SITE_NAME,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${title} — ${SITE_NAME}`,
        },
      ],
      ...(publishedTime ? { publishedTime } : {}),
      ...(modifiedTime ? { modifiedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_NAME}`,
      description,
      images: [imageUrl],
    },
  };
}

/**
 * All site pages with their metadata for sitemap generation
 * and centralized metadata management.
 */
export interface PageInfo {
  readonly path: string;
  readonly title: string;
  readonly description: string;
  readonly priority: number;
  readonly changeFrequency:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  readonly lastModified?: string;
}

export const SITE_PAGES: ReadonlyArray<PageInfo> = [
  {
    path: "/",
    title: "Ma\u00eetrisez Claude Code",
    description:
      "Le guide de r\u00e9f\u00e9rence gratuit pour ma\u00eetriser Claude Code. MCP, Skills, Prompting avanc\u00e9 \u2014 pour d\u00e9veloppeurs et non-d\u00e9veloppeurs.",
    priority: 1.0,
    changeFrequency: "weekly",
    lastModified: "2026-03-07",
  },
  {
    path: "/getting-started",
    title: "Premiers pas avec Claude Code",
    description:
      "Guide complet pour installer, configurer et utiliser Claude Code. De z\u00e9ro \u00e0 votre premier projet en quelques minutes.",
    priority: 0.9,
    changeFrequency: "monthly",
    lastModified: "2026-03-09",
  },
  {
    path: "/getting-started/what-is-claude-code",
    title: "Qu\u2019est-ce que Claude Code ?",
    description:
      "D\u00e9couvrez Claude Code, l\u2019assistant IA en ligne de commande d\u2019Anthropic. Comprenez ce qui le diff\u00e9rencie de Copilot ou Cursor.",
    priority: 0.85,
    changeFrequency: "monthly",
    lastModified: "2026-03-09",
  },
  {
    path: "/getting-started/installation",
    title: "Pr\u00e9requis et installation de Claude Code",
    description:
      "Installez Claude Code en quelques minutes : Node.js 18+, npm, authentification API key ou Max, et r\u00e9solution des erreurs courantes.",
    priority: 0.85,
    changeFrequency: "monthly",
    lastModified: "2026-03-09",
  },
  {
    path: "/getting-started/environment-setup",
    title: "Configuration de l\u2019environnement Claude Code",
    description:
      "Configurez Claude Code : variable d\u2019environnement API key, fichier settings.json, fichier CLAUDE.md, permissions et s\u00e9curit\u00e9.",
    priority: 0.85,
    changeFrequency: "monthly",
    lastModified: "2026-03-09",
  },
  {
    path: "/getting-started/first-project",
    title: "Premier projet avec Claude Code",
    description:
      "Tutoriel concret : cr\u00e9ez votre premier site web avec Claude Code en 5 minutes. Exemples de prompts et bonnes pratiques.",
    priority: 0.85,
    changeFrequency: "monthly",
    lastModified: "2026-03-09",
  },
  {
    path: "/mcp",
    title: "Les MCP : Donnez des super-pouvoirs a Claude Code",
    description:
      "Decouvrez les MCP (Model Context Protocol) pour connecter Claude Code a vos outils favoris : GitHub, Slack, Gmail, bases de donnees et plus encore.",
    priority: 0.9,
    changeFrequency: "monthly",
    lastModified: "2026-03-07",
  },
  {
    path: "/skills",
    title: "Skills : Enseignez de nouveaux talents a Claude Code",
    description:
      "Apprenez a utiliser et creer des Skills pour Claude Code. Automatisez vos workflows, ajoutez des capacites et enseignez de nouveaux talents a votre assistant IA.",
    priority: 0.8,
    changeFrequency: "monthly",
    lastModified: "2026-03-07",
  },
  {
    path: "/prompting",
    title: "Prompting : L'art de communiquer avec l'IA",
    description:
      "Maitrisez l'art du prompting avec Claude Code. Techniques, templates et bonnes pratiques pour tirer le maximum de l'IA.",
    priority: 0.8,
    changeFrequency: "monthly",
    lastModified: "2026-03-07",
  },
  {
    path: "/future",
    title: "Vision & Futur de l'IA",
    description:
      "L'avenir de l'IA est deja la. Decouvrez comment vous preparer, les tendances a suivre, et la roadmap de The Claude Codex.",
    priority: 0.7,
    changeFrequency: "monthly",
    lastModified: "2026-03-07",
  },
  {
    path: "/content",
    title: "Contenus \u00e9ditoriaux",
    description:
      "Tous les articles et guides \u00e9ditoriaux du Claude Codex. Explorez nos contenus MDX sur Claude Code, les MCP, les Skills et le prompting.",
    priority: 0.6,
    changeFrequency: "weekly",
    lastModified: "2026-03-09",
  },
  {
    path: "/plugins",
    title: "Plugins pour Claude Code",
    description:
      "Decouvrez les plugins disponibles pour etendre les capacites de Claude Code.",
    priority: 0.5,
    changeFrequency: "monthly",
    lastModified: "2026-03-07",
  },
  {
    path: "/agents",
    title: "Agents pour Claude Code",
    description:
      "Decouvrez les agents disponibles pour orchestrer des workflows complexes avec Claude Code.",
    priority: 0.5,
    changeFrequency: "monthly",
    lastModified: "2026-03-07",
  },
  {
    path: "/configurator",
    title: "Configurateur Claude Code",
    description:
      "Configurez Claude Code de maniere interactive. Generez votre CLAUDE.md, settings.json et plus encore.",
    priority: 0.5,
    changeFrequency: "monthly",
    lastModified: "2026-03-07",
  },
];
