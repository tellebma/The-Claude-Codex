import { describe, it, expect } from "vitest";
import {
  localeToLanguageTag,
  createArticleSchema,
  createHowToSchema,
  createBreadcrumbSchema,
  createWebSiteSchema,
  createOrganizationSchema,
  createFAQPageSchema,
  createDefinedTermSetSchema,
  createCollectionPageSchema,
  serializeJsonLd,
} from "@/lib/structured-data";
import { SITE_URL, SITE_NAME } from "@/lib/metadata";

describe("createWebSiteSchema", () => {
  it("creates a valid WebSite schema", () => {
    const schema = createWebSiteSchema({
      name: "Test Site",
      url: "https://example.com",
      description: "A test site",
    });

    expect(schema["@context"]).toBe("https://schema.org");
    expect(schema["@type"]).toBe("WebSite");
    expect(schema.name).toBe("Test Site");
    expect(schema.url).toBe("https://example.com");
    expect(schema.description).toBe("A test site");
    expect(schema.inLanguage).toBe("fr-FR");
  });

  it("includes publisher information", () => {
    const schema = createWebSiteSchema({
      name: "Test",
      url: "https://example.com",
      description: "desc",
    });

    const publisher = schema.publisher as Record<string, unknown>;
    expect(publisher["@type"]).toBe("Organization");
    expect(publisher.name).toBe(SITE_NAME);
    expect(publisher.url).toBe(SITE_URL);
  });
});

describe("createArticleSchema", () => {
  it("creates a valid Article schema", () => {
    const schema = createArticleSchema({
      title: "Test Article",
      description: "Article description",
      url: "https://claude-codex.fr/test",
    });

    expect(schema["@context"]).toBe("https://schema.org");
    expect(schema["@type"]).toBe("Article");
    expect(schema.headline).toBe("Test Article");
    expect(schema.description).toBe("Article description");
    expect(schema.url).toBe("https://claude-codex.fr/test/");
    expect(schema.inLanguage).toBe("fr-FR");
  });

  it("includes dates when provided", () => {
    const schema = createArticleSchema({
      title: "Test",
      description: "desc",
      url: "https://claude-codex.fr/test",
      datePublished: "2026-01-01",
      dateModified: "2026-02-01",
    });

    expect(schema.datePublished).toBe("2026-01-01");
    expect(schema.dateModified).toBe("2026-02-01");
  });

  it("omits dates when not provided", () => {
    const schema = createArticleSchema({
      title: "Test",
      description: "desc",
      url: "https://claude-codex.fr/test",
    });

    expect(schema.datePublished).toBeUndefined();
    expect(schema.dateModified).toBeUndefined();
  });

  it("includes image with full URL for relative paths", () => {
    const schema = createArticleSchema({
      title: "Test",
      description: "desc",
      url: "https://claude-codex.fr/test",
      image: "/og/test.png",
    });

    const image = schema.image as Record<string, unknown>;
    expect(image["@type"]).toBe("ImageObject");
    expect(image.url).toBe(`${SITE_URL}/og/test.png`);
    expect(image.width).toBe(1200);
    expect(image.height).toBe(630);
  });

  it("keeps absolute image URLs as-is", () => {
    const schema = createArticleSchema({
      title: "Test",
      description: "desc",
      url: "https://claude-codex.fr/test",
      image: "https://cdn.example.com/img.png",
    });

    const image = schema.image as Record<string, unknown>;
    expect(image.url).toBe("https://cdn.example.com/img.png");
  });

  it("includes mainEntityOfPage and publisher", () => {
    const schema = createArticleSchema({
      title: "Test",
      description: "desc",
      url: "https://claude-codex.fr/test",
    });

    const mainEntity = schema.mainEntityOfPage as Record<string, unknown>;
    expect(mainEntity["@type"]).toBe("WebPage");
    expect(mainEntity["@id"]).toBe("https://claude-codex.fr/test/");

    const publisher = schema.publisher as Record<string, unknown>;
    expect(publisher["@type"]).toBe("Organization");
    expect(publisher.name).toBe(SITE_NAME);
  });
});

describe("createHowToSchema", () => {
  const steps = [
    { name: "Step One", text: "Do the first thing" },
    { name: "Step Two", text: "Do the second thing" },
  ];

  it("creates a valid HowTo schema", () => {
    const schema = createHowToSchema({
      title: "How To Test",
      description: "A how-to guide",
      url: "https://claude-codex.fr/howto",
      steps,
    });

    expect(schema["@context"]).toBe("https://schema.org");
    expect(schema["@type"]).toBe("HowTo");
    expect(schema.name).toBe("How To Test");
    expect(schema.description).toBe("A how-to guide");
    expect(schema.inLanguage).toBe("fr-FR");
  });

  it("maps steps with correct positions", () => {
    const schema = createHowToSchema({
      title: "Test",
      description: "desc",
      url: "https://claude-codex.fr/howto",
      steps,
    });

    const schemaSteps = schema.step as ReadonlyArray<Record<string, unknown>>;
    expect(schemaSteps).toHaveLength(2);
    expect(schemaSteps[0]["@type"]).toBe("HowToStep");
    expect(schemaSteps[0].position).toBe(1);
    expect(schemaSteps[0].name).toBe("Step One");
    expect(schemaSteps[0].text).toBe("Do the first thing");
    expect(schemaSteps[1].position).toBe(2);
  });

  it("includes image when provided", () => {
    const schema = createHowToSchema({
      title: "Test",
      description: "desc",
      url: "https://claude-codex.fr/howto",
      steps,
      image: "/og/howto.png",
    });

    const image = schema.image as Record<string, unknown>;
    expect(image["@type"]).toBe("ImageObject");
    expect(image.url).toBe(`${SITE_URL}/og/howto.png`);
  });
});

describe("createBreadcrumbSchema", () => {
  it("creates a valid BreadcrumbList schema", () => {
    const schema = createBreadcrumbSchema([
      { name: "Accueil", href: "/" },
      { name: "MCP", href: "/mcp" },
    ]);

    expect(schema["@context"]).toBe("https://schema.org");
    expect(schema["@type"]).toBe("BreadcrumbList");
  });

  it("maps items with correct positions and full URLs", () => {
    const schema = createBreadcrumbSchema([
      { name: "Accueil", href: "/" },
      { name: "MCP", href: "/mcp" },
      { name: "Setup", href: "/mcp/setup" },
    ]);

    const items = schema.itemListElement as ReadonlyArray<
      Record<string, unknown>
    >;
    expect(items).toHaveLength(3);
    expect(items[0]).toMatchObject({
      "@type": "ListItem",
      position: 1,
      name: "Accueil",
      item: `${SITE_URL}/`,
    });
    expect(items[1].position).toBe(2);
    expect(items[1].item).toBe(`${SITE_URL}/mcp/`);
    expect(items[2].position).toBe(3);
  });
});

describe("serializeJsonLd", () => {
  it("serializes a schema object to JSON string", () => {
    const schema = { "@context": "https://schema.org", "@type": "WebSite" };
    const result = serializeJsonLd(schema);
    expect(result).toBe(JSON.stringify(schema));
  });

  it("produces valid JSON", () => {
    const schema = createArticleSchema({
      title: "Test",
      description: "desc",
      url: "https://example.com",
    });
    const serialized = serializeJsonLd(schema);
    expect(() => JSON.parse(serialized)).not.toThrow();
  });

  it("handles special characters safely", () => {
    const schema = {
      "@context": "https://schema.org",
      name: 'Test with "quotes" and <script>',
    };
    const serialized = serializeJsonLd(schema);
    const parsed = JSON.parse(serialized) as Record<string, unknown>;
    expect(parsed.name).toBe('Test with "quotes" and <script>');
  });
});

describe("localeToLanguageTag", () => {
  it("maps 'fr' to 'fr-FR'", () => {
    expect(localeToLanguageTag("fr")).toBe("fr-FR");
  });

  it("maps 'en' to 'en-US'", () => {
    expect(localeToLanguageTag("en")).toBe("en-US");
  });

  it("defaults to 'fr-FR' for unknown locales", () => {
    expect(localeToLanguageTag("de")).toBe("fr-FR");
  });
});

describe("createOrganizationSchema", () => {
  it("creates a valid Organization schema", () => {
    const schema = createOrganizationSchema();
    expect(schema["@context"]).toBe("https://schema.org");
    expect(schema["@type"]).toBe("Organization");
    expect(schema.name).toBe(SITE_NAME);
    expect(schema.url).toBe(SITE_URL);
  });

  it("includes logo with correct dimensions", () => {
    const schema = createOrganizationSchema();
    const logo = schema.logo as Record<string, unknown>;
    expect(logo["@type"]).toBe("ImageObject");
    expect(logo.url).toBe(`${SITE_URL}/icon.svg`);
    expect(logo.width).toBe(512);
    expect(logo.height).toBe(512);
  });

  it("includes founder information", () => {
    const schema = createOrganizationSchema();
    const founder = schema.founder as Record<string, unknown>;
    expect(founder["@type"]).toBe("Person");
    expect(founder.name).toBe("tellebma");
  });

  it("includes sameAs with GitHub URL", () => {
    const schema = createOrganizationSchema();
    const sameAs = schema.sameAs as string[];
    expect(sameAs.length).toBeGreaterThan(0);
    expect(sameAs[0]).toContain("github.com");
  });
});

describe("createFAQPageSchema", () => {
  const faqItems = [
    { question: "What is Claude?", answer: "An AI assistant." },
    { question: "How much does it cost?", answer: "See pricing page." },
  ];

  it("creates a valid FAQPage schema", () => {
    const schema = createFAQPageSchema(faqItems);
    expect(schema["@context"]).toBe("https://schema.org");
    expect(schema["@type"]).toBe("FAQPage");
  });

  it("maps FAQ items to Question/Answer pairs", () => {
    const schema = createFAQPageSchema(faqItems);
    const entities = schema.mainEntity as ReadonlyArray<Record<string, unknown>>;
    expect(entities).toHaveLength(2);
    expect(entities[0]["@type"]).toBe("Question");
    expect(entities[0].name).toBe("What is Claude?");
    const answer = entities[0].acceptedAnswer as Record<string, unknown>;
    expect(answer["@type"]).toBe("Answer");
    expect(answer.text).toBe("An AI assistant.");
  });

  it("handles empty FAQ list", () => {
    const schema = createFAQPageSchema([]);
    const entities = schema.mainEntity as ReadonlyArray<unknown>;
    expect(entities).toHaveLength(0);
  });
});

describe("createDefinedTermSetSchema", () => {
  const terms = [
    { name: "MCP", description: "Model Context Protocol", anchor: "mcp" },
    { name: "LLM", description: "Large Language Model", anchor: "llm" },
  ];

  it("creates a valid DefinedTermSet schema", () => {
    const schema = createDefinedTermSetSchema(terms);
    expect(schema["@context"]).toBe("https://schema.org");
    expect(schema["@type"]).toBe("DefinedTermSet");
  });

  it("uses French name by default", () => {
    const schema = createDefinedTermSetSchema(terms);
    expect(schema.name).toContain("Glossaire");
  });

  it("uses English name when locale is en", () => {
    const schema = createDefinedTermSetSchema(terms, "en");
    expect(schema.name).toContain("Glossary");
  });

  it("maps terms correctly", () => {
    const schema = createDefinedTermSetSchema(terms);
    const defined = schema.hasDefinedTerm as ReadonlyArray<Record<string, unknown>>;
    expect(defined).toHaveLength(2);
    expect(defined[0]["@type"]).toBe("DefinedTerm");
    expect(defined[0].name).toBe("MCP");
    expect(defined[0].description).toBe("Model Context Protocol");
    expect(defined[0].url).toContain("#mcp");
  });

  it("includes locale in URL", () => {
    const schema = createDefinedTermSetSchema(terms, "en");
    expect(schema.url).toContain("/en/glossary");
  });
});

describe("createCollectionPageSchema", () => {
  it("creates a valid CollectionPage schema", () => {
    const schema = createCollectionPageSchema({
      name: "Articles",
      description: "All articles",
      url: "https://claude-codex.fr/content",
    });
    expect(schema["@context"]).toBe("https://schema.org");
    expect(schema["@type"]).toBe("CollectionPage");
    expect(schema.name).toBe("Articles");
    expect(schema.description).toBe("All articles");
  });

  it("defaults to French language", () => {
    const schema = createCollectionPageSchema({
      name: "Test",
      description: "desc",
      url: "https://claude-codex.fr/test",
    });
    expect(schema.inLanguage).toBe("fr-FR");
  });

  it("supports English locale", () => {
    const schema = createCollectionPageSchema({
      name: "Test",
      description: "desc",
      url: "https://claude-codex.fr/en/test",
      locale: "en",
    });
    expect(schema.inLanguage).toBe("en-US");
  });

  it("includes isPartOf with site info", () => {
    const schema = createCollectionPageSchema({
      name: "Test",
      description: "desc",
      url: "https://claude-codex.fr/test",
    });
    const isPartOf = schema.isPartOf as Record<string, unknown>;
    expect(isPartOf["@type"]).toBe("WebSite");
    expect(isPartOf.name).toBe(SITE_NAME);
    expect(isPartOf.url).toBe(SITE_URL);
  });
});

describe("createWebSiteSchema with locale", () => {
  it("uses English language tag when locale is en", () => {
    const schema = createWebSiteSchema({
      name: "Test",
      url: "https://example.com",
      description: "desc",
      locale: "en",
    });
    expect(schema.inLanguage).toBe("en-US");
  });
});

describe("createArticleSchema with locale", () => {
  it("uses English language tag when locale is en", () => {
    const schema = createArticleSchema({
      title: "Test",
      description: "desc",
      url: "https://example.com/test",
      locale: "en",
    });
    expect(schema.inLanguage).toBe("en-US");
  });
});

describe("createHowToSchema with locale", () => {
  it("uses English language tag when locale is en", () => {
    const schema = createHowToSchema({
      title: "Test",
      description: "desc",
      url: "https://example.com/test",
      locale: "en",
      steps: [{ name: "Step", text: "Do it" }],
    });
    expect(schema.inLanguage).toBe("en-US");
  });
});
