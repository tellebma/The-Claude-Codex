import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/metadata";
import {
  createBreadcrumbSchema,
  serializeJsonLd,
} from "@/lib/structured-data";

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
      {children}
    </>
  );
}
