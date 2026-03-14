import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/metadata";
import {
  createBreadcrumbSchema,
  createDefinedTermSetSchema,
  serializeJsonLd,
} from "@/lib/structured-data";
import { glossaryTerms } from "@/data/glossary";

export const metadata: Metadata = createPageMetadata({
  title: "Glossaire IA & Claude Code",
  description:
    "Plus de 40 termes techniques de l'IA et du développement web expliqués en langage humain, avec des analogies concrètes. Terminal, API, Git, npm, Docker et bien plus.",
  path: "/glossary",
  type: "website",
});

const breadcrumbJsonLd = createBreadcrumbSchema([
  { name: "Accueil", href: "/" },
  { name: "Glossaire", href: "/glossary" },
]);

const definedTermSetJsonLd = createDefinedTermSetSchema(
  glossaryTerms.map((t) => ({
    name: t.term,
    description: t.definition,
    anchor: t.term.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
  }))
);

export default function GlossaryLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(breadcrumbJsonLd),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(definedTermSetJsonLd),
        }}
      />
      {children}
    </>
  );
}
