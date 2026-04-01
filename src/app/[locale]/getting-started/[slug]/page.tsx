import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { BookOpen } from "lucide-react";
import { getSectionMdxBySlug, getSectionMdxSlugs } from "@/lib/mdx";
import { createPageMetadata } from "@/lib/metadata";
import { createFAQPageSchema } from "@/lib/structured-data";
import SectionSlugContent from "@/components/layout/SectionSlugContent";

const SECTION = "getting-started";

interface PageProps {
  readonly params: Promise<{ locale: string; slug: string }>;
}

export function generateStaticParams(): Array<{ slug: string }> {
  return [...getSectionMdxSlugs(SECTION)].map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const { frontmatter } = getSectionMdxBySlug(SECTION, slug, locale);

  return createPageMetadata({
    title: frontmatter.title,
    description: frontmatter.description,
    path: `/${locale}/${SECTION}/${slug}`,
    locale,
    publishedTime: frontmatter.datePublished,
    modifiedTime: frontmatter.dateModified,
  });
}

/**
 * Build FAQ JSON-LD schema for the faq-beginner page only.
 */
function buildFaqSchema(slug: string): ReadonlyArray<Record<string, unknown>> {
  if (slug !== "faq-beginner") return [];

  return [
    createFAQPageSchema([
      {
        question: "Est-ce que ca peut casser mon ordinateur ?",
        answer:
          "Non. Claude Code est un outil logiciel qui ne touche pas a vos fichiers systeme et ne fait rien sans votre accord explicite.",
      },
      {
        question:
          "Est-ce que l'IA voit mes fichiers personnels : photos, documents, mails ?",
        answer:
          "Non. Claude Code n'accede qu'au dossier dans lequel vous le lancez, et seulement aux fichiers que vous lui montrez explicitement.",
      },
      {
        question:
          "C'est quoi la difference entre ChatGPT et Claude Code ?",
        answer:
          "ChatGPT et Claude.ai sont des chatbots web. Claude Code est un assistant qui travaille directement dans vos fichiers via le terminal.",
      },
      {
        question: "C'est gratuit ?",
        answer:
          "Ce guide est 100% gratuit. L'outil Claude Code lui-meme necessite un abonnement Claude Max ou une cle API.",
      },
      {
        question: "Faut-il savoir coder pour utiliser Claude Code ?",
        answer:
          "Non, ce n'est pas obligatoire. Claude Code peut aider avec des taches non-techniques comme rediger des emails ou analyser des documents.",
      },
      {
        question: "Mes donnees sont-elles privees ?",
        answer:
          "Anthropic collecte les conversations pour ameliorer ses modeles, mais vous pouvez configurer votre compte pour limiter cela. Ne partagez jamais de mots de passe ou donnees sensibles.",
      },
    ]),
  ];
}

export default async function GettingStartedSlugPage({
  params,
}: PageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  return (
    <SectionSlugContent
      section={SECTION}
      slug={slug}
      locale={locale}
      icon={BookOpen}
      extraJsonLd={buildFaqSchema(slug)}
    />
  );
}
