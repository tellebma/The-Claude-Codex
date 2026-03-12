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
