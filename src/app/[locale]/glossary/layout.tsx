import { createPageMetadata } from "@/lib/metadata";
import {
  createBreadcrumbSchema,
  createDefinedTermSetSchema,
  serializeJsonLd,
} from "@/lib/structured-data";
import { glossaryTerms } from "@/data/glossary";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return createPageMetadata({
    title: "Glossaire IA & Claude Code",
    description:
      "Plus de 40 termes techniques de l'IA et du développement web expliqués en langage humain, avec des analogies concrètes. Terminal, API, Git, npm, Docker et bien plus.",
    path: `/${locale}/glossary`,
    locale,
    type: "website",
  });
}

const definedTermSetJsonLd = createDefinedTermSetSchema(
  glossaryTerms.map((t) => ({
    name: t.term,
    description: t.definition,
    anchor: t.term.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
  }))
);

export default async function GlossaryLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  const breadcrumbJsonLd = createBreadcrumbSchema([
    { name: "Accueil", href: `/${locale}` },
    { name: "Glossaire", href: `/${locale}/glossary` },
  ]);

  /* JSON-LD structured data -- safe: static schema from hardcoded values, no user input */
  const breadcrumbHtml = serializeJsonLd(breadcrumbJsonLd);
  const termSetHtml = serializeJsonLd(definedTermSetJsonLd);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: breadcrumbHtml }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: termSetHtml }}
      />
      {children}
    </>
  );
}
