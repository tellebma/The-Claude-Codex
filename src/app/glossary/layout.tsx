import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Glossaire : Termes techniques expliqués simplement",
  description:
    "Plus de 40 termes techniques de l'IA et du développement web expliqués en langage humain, avec des analogies concrètes. Terminal, API, Git, npm, Docker et bien plus.",
  path: "/glossary",
  type: "website",
});

export default function GlossaryLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
