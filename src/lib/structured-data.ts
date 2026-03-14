import { SITE_NAME, SITE_URL } from "@/lib/metadata";

/**
 * JSON-LD structured data types for schema.org.
 * All functions return plain objects ready to be serialized.
 */

interface WebSiteSchemaOptions {
  readonly name: string;
  readonly url: string;
  readonly description: string;
}

export function createWebSiteSchema({
  name,
  url,
  description,
}: WebSiteSchemaOptions): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name,
    url,
    description,
    inLanguage: "fr-FR",
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}

export function createOrganizationSchema(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/icon.svg`,
      width: 512,
      height: 512,
    },
    description:
      "Le guide de reference gratuit pour maitriser Claude Code. MCP, Skills, Prompting avance.",
    sameAs: ["https://github.com/tellebma/The-Claude-Codex"],
    founder: {
      "@type": "Person",
      name: "tellebma",
      url: "https://github.com/tellebma",
    },
  };
}

interface FAQItem {
  readonly question: string;
  readonly answer: string;
}

export function createFAQPageSchema(
  items: ReadonlyArray<FAQItem>
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

interface DefinedTermItem {
  readonly name: string;
  readonly description: string;
  readonly anchor: string;
}

export function createDefinedTermSetSchema(
  terms: ReadonlyArray<DefinedTermItem>
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    name: "Glossaire Claude Code et IA",
    url: `${SITE_URL}/glossary`,
    inLanguage: "fr-FR",
    hasDefinedTerm: terms.map((term) => ({
      "@type": "DefinedTerm",
      name: term.name,
      description: term.description,
      url: `${SITE_URL}/glossary#${term.anchor}`,
    })),
  };
}

export function createCollectionPageSchema(options: {
  readonly name: string;
  readonly description: string;
  readonly url: string;
}): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: options.name,
    description: options.description,
    url: options.url,
    inLanguage: "fr-FR",
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}

interface ArticleSchemaOptions {
  readonly title: string;
  readonly description: string;
  readonly url: string;
  readonly datePublished?: string;
  readonly dateModified?: string;
  readonly image?: string;
}

export function createArticleSchema({
  title,
  description,
  url,
  datePublished,
  dateModified,
  image,
}: ArticleSchemaOptions): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url,
    inLanguage: "fr-FR",
    ...(image
      ? {
          image: {
            "@type": "ImageObject",
            url: image.startsWith("http") ? image : `${SITE_URL}${image}`,
            width: 1200,
            height: 630,
          },
        }
      : {}),
    ...(datePublished ? { datePublished } : {}),
    ...(dateModified ? { dateModified } : {}),
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  };
}

interface HowToStep {
  readonly name: string;
  readonly text: string;
}

interface HowToSchemaOptions {
  readonly title: string;
  readonly description: string;
  readonly url: string;
  readonly steps: ReadonlyArray<HowToStep>;
  readonly image?: string;
}

export function createHowToSchema({
  title,
  description,
  url,
  steps,
  image,
}: HowToSchemaOptions): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: title,
    description,
    url,
    inLanguage: "fr-FR",
    ...(image
      ? {
          image: {
            "@type": "ImageObject",
            url: image.startsWith("http") ? image : `${SITE_URL}${image}`,
            width: 1200,
            height: 630,
          },
        }
      : {}),
    step: steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.name,
      text: step.text,
    })),
  };
}

interface BreadcrumbItem {
  readonly name: string;
  readonly href: string;
}

export function createBreadcrumbSchema(
  items: ReadonlyArray<BreadcrumbItem>
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.href}`,
    })),
  };
}

/**
 * Serializes a JSON-LD schema object into a safe JSON string
 * for embedding in a <script> tag. Only accepts our own
 * statically-built schema objects (no user input).
 */
export function serializeJsonLd(schema: Record<string, unknown>): string {
  return JSON.stringify(schema).replace(/<\//g, "<\\/");
}
