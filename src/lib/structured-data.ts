import { SITE_NAME, SITE_URL } from "@/lib/metadata";

/**
 * JSON-LD structured data types for schema.org.
 * All functions return plain objects ready to be serialized.
 */

/**
 * Ensures a URL ends with a trailing slash to match the
 * Next.js trailingSlash: true configuration.
 * Skips URLs that are just a domain (no path segments).
 */
function ensureTrailingSlash(url: string): string {
  return url.endsWith("/") ? url : `${url}/`;
}

/**
 * Maps a locale code to a BCP 47 language tag for schema.org inLanguage.
 */
export function localeToLanguageTag(locale: string): string {
  return locale === "en" ? "en-US" : "fr-FR";
}

interface WebSiteSchemaOptions {
  readonly name: string;
  readonly url: string;
  readonly description: string;
  readonly locale?: string;
}

export function createWebSiteSchema({
  name,
  url,
  description,
  locale = "fr",
}: WebSiteSchemaOptions): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name,
    url,
    description,
    inLanguage: localeToLanguageTag(locale),
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

interface SoftwareApplicationOptions {
  readonly name: string;
  readonly description: string;
  readonly url: string;
  readonly applicationCategory?: string;
  readonly operatingSystem?: string;
  /** Code SPDX de la licence (ex: "MIT", "Apache-2.0"). */
  readonly license?: string;
  /** URL canonique de la licence (ex: lien GitHub LICENSE). */
  readonly licenseUrl?: string;
  readonly offerPrice?: string;
  readonly offerCurrency?: string;
  readonly locale?: string;
}

/**
 * Schema SoftwareApplication pour les fiches outil (skills tiers).
 * Le prix n'est emis que si `offerPrice` est fourni : un skill gratuit
 * declare `offerPrice: "0"`, un skill payant son tarif. Sans prix, aucun
 * bloc `offers` n'est ajoute pour eviter une donnee structuree erronee.
 */
export function createSoftwareApplicationSchema(
  options: SoftwareApplicationOptions,
): Record<string, unknown> {
  const {
    name,
    description,
    url,
    applicationCategory = "DeveloperApplication",
    operatingSystem = "Cross-platform",
    license,
    licenseUrl,
    offerPrice,
    offerCurrency = "USD",
    locale = "fr",
  } = options;

  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name,
    description,
    url: ensureTrailingSlash(url),
    applicationCategory,
    operatingSystem,
    inLanguage: localeToLanguageTag(locale),
    ...(licenseUrl ? { license: licenseUrl } : {}),
    ...(license ? { licenseDeclared: license } : {}),
    ...(offerPrice !== undefined
      ? {
          offers: {
            "@type": "Offer",
            price: offerPrice,
            priceCurrency: offerCurrency,
          },
        }
      : {}),
  };
}

interface DefinedTermItem {
  readonly name: string;
  readonly description: string;
  readonly anchor: string;
}

export function createDefinedTermSetSchema(
  terms: ReadonlyArray<DefinedTermItem>,
  locale: string = "fr"
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    name: locale === "en" ? "Claude Code & AI Glossary" : "Glossaire Claude Code et IA",
    url: `${SITE_URL}/${locale}/glossary/`,
    inLanguage: localeToLanguageTag(locale),
    hasDefinedTerm: terms.map((term) => ({
      "@type": "DefinedTerm",
      name: term.name,
      description: term.description,
      url: `${SITE_URL}/${locale}/glossary/#${term.anchor}`,
    })),
  };
}

interface CollectionPagePart {
  readonly url: string;
  readonly name: string;
  readonly dateModified?: string;
  readonly inLanguage?: string;
}

interface CollectionPageSchemaOptions {
  readonly name: string;
  readonly description: string;
  readonly url: string;
  readonly locale?: string;
  readonly dateModified?: string;
  readonly hasPart?: ReadonlyArray<CollectionPagePart>;
}

function buildHasPart(
  parts: ReadonlyArray<CollectionPagePart>,
  parentLang: string
): ReadonlyArray<Record<string, unknown>> {
  return parts.map((part) => {
    const absoluteUrl = part.url.startsWith("http")
      ? part.url
      : `${SITE_URL}${part.url}`;
    return {
      "@type": "Article",
      name: part.name,
      url: ensureTrailingSlash(absoluteUrl),
      inLanguage: part.inLanguage ?? parentLang,
      ...(part.dateModified ? { dateModified: part.dateModified } : {}),
    };
  });
}

export function createCollectionPageSchema(
  options: CollectionPageSchemaOptions
): Record<string, unknown> {
  const lang = localeToLanguageTag(options.locale ?? "fr");
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: options.name,
    description: options.description,
    url: ensureTrailingSlash(options.url),
    inLanguage: lang,
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    ...(options.dateModified ? { dateModified: options.dateModified } : {}),
    ...(options.hasPart && options.hasPart.length > 0
      ? { hasPart: buildHasPart(options.hasPart, lang) }
      : {}),
  };
}

interface ArticleSchemaOptions {
  readonly title: string;
  readonly description: string;
  readonly url: string;
  readonly locale?: string;
  readonly datePublished?: string;
  readonly dateModified?: string;
  readonly image?: string;
}

export function createArticleSchema({
  title,
  description,
  url,
  locale = "fr",
  datePublished,
  dateModified,
  image,
}: ArticleSchemaOptions): Record<string, unknown> {
  const canonicalUrl = ensureTrailingSlash(url);
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url: canonicalUrl,
    inLanguage: localeToLanguageTag(locale),
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
      "@id": canonicalUrl,
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
  readonly locale?: string;
  readonly steps: ReadonlyArray<HowToStep>;
  readonly image?: string;
}

export function createHowToSchema({
  title,
  description,
  url,
  locale = "fr",
  steps,
  image,
}: HowToSchemaOptions): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: title,
    description,
    url: ensureTrailingSlash(url),
    inLanguage: localeToLanguageTag(locale),
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
      item: ensureTrailingSlash(`${SITE_URL}${item.href}`),
    })),
  };
}

interface ItemListEntry {
  readonly position: number;
  readonly url: string;
  readonly name: string;
}

interface ItemListSchemaOptions {
  readonly name: string;
  readonly description: string;
  readonly items: ReadonlyArray<ItemListEntry>;
  readonly locale?: string;
}

/**
 * CTN-8 / CTN-9 : ItemList JSON-LD pour Most read et Trending sur
 * /content. Spec : `position` 1-indexed, `itemListOrder = Descending`
 * (tri par signal d'usage), `numberOfItems` toujours emis pour les
 * validateurs tiers (cf. seo-technical-decisions §1.3).
 */
export function createItemListSchema(
  options: ItemListSchemaOptions,
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: options.name,
    description: options.description,
    inLanguage: localeToLanguageTag(options.locale ?? "fr"),
    numberOfItems: options.items.length,
    itemListOrder: "https://schema.org/ItemListOrderDescending",
    itemListElement: options.items.map((entry) => ({
      "@type": "ListItem",
      position: entry.position,
      url: ensureTrailingSlash(
        entry.url.startsWith("http") ? entry.url : `${SITE_URL}${entry.url}`,
      ),
      name: entry.name,
    })),
  };
}

/**
 * Serializes a JSON-LD schema object into a safe JSON string
 * for embedding in a <script> tag. Only accepts our own
 * statically-built schema objects (no user input).
 */
export function serializeJsonLd(schema: Record<string, unknown>): string {
  return JSON.stringify(schema).replaceAll("</", String.raw`<\/`);
}
