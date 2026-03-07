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
    title: "Maitrisez Claude Code",
    description:
      "Le guide de reference gratuit pour maitriser Claude Code. MCP, Skills, Prompting avance — pour developpeurs et non-developpeurs.",
    priority: 1.0,
    changeFrequency: "weekly",
    lastModified: "2026-03-07",
  },
  {
    path: "/getting-started",
    title: "Premiers pas avec Claude Code",
    description:
      "Guide complet pour installer, configurer et utiliser Claude Code. De zero a votre premier projet en quelques minutes.",
    priority: 0.9,
    changeFrequency: "monthly",
    lastModified: "2026-03-07",
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
