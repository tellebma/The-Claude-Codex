import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpen } from "lucide-react";
import {
  getSectionMdxBySlug,
  getSectionMdxSlugs,
  getAllSectionMdxFiles,
} from "@/lib/mdx";
import { MdxRenderer } from "@/components/mdx/MdxRenderer";
import { createPageMetadata, SITE_URL } from "@/lib/metadata";
import {
  createArticleSchema,
  createBreadcrumbSchema,
  createFAQPageSchema,
  serializeJsonLd,
} from "@/lib/structured-data";

const SECTION = "getting-started";

interface GettingStartedSlugPageProps {
  readonly params: { slug: string };
}

/**
 * Generate static params for all getting-started MDX files.
 * Required for SSG with `output: 'export'`.
 */
export function generateStaticParams(): Array<{ slug: string }> {
  const slugs = getSectionMdxSlugs(SECTION);
  return [...slugs].map((slug) => ({ slug }));
}

/**
 * Generate metadata from MDX frontmatter.
 */
export function generateMetadata({
  params,
}: GettingStartedSlugPageProps): Metadata {
  const { frontmatter } = getSectionMdxBySlug(SECTION, params.slug);

  return createPageMetadata({
    title: frontmatter.title,
    description: frontmatter.description,
    path: `/${SECTION}/${params.slug}`,
    publishedTime: frontmatter.datePublished,
    modifiedTime: frontmatter.dateModified,
  });
}

/**
 * Resolve previous and next articles within the getting-started section.
 */
function getAdjacentPages(currentSlug: string) {
  const allFiles = getAllSectionMdxFiles(SECTION);
  const currentIndex = allFiles.findIndex(
    (f) => f.slug === `${SECTION}/${currentSlug}`
  );

  return {
    prev: currentIndex > 0 ? allFiles[currentIndex - 1] : null,
    next:
      currentIndex !== -1 && currentIndex < allFiles.length - 1
        ? allFiles[currentIndex + 1]
        : null,
  };
}

/**
 * Extract the simple slug from a section-prefixed slug.
 * E.g. "getting-started/installation" -> "installation"
 */
function extractSimpleSlug(fullSlug: string): string {
  const parts = fullSlug.split("/");
  return parts[parts.length - 1];
}

export default function GettingStartedSlugPage({
  params,
}: GettingStartedSlugPageProps) {
  const { frontmatter, content } = getSectionMdxBySlug(SECTION, params.slug);
  const { prev, next } = getAdjacentPages(params.slug);

  const articleJsonLd = createArticleSchema({
    title: frontmatter.title,
    description: frontmatter.description,
    url: `${SITE_URL}/${SECTION}/${params.slug}`,
    datePublished: frontmatter.datePublished,
    dateModified: frontmatter.dateModified,
  });

  const breadcrumbJsonLd = createBreadcrumbSchema([
    { name: "Accueil", href: "/" },
    { name: "Premiers pas", href: `/${SECTION}` },
    { name: frontmatter.title, href: `/${SECTION}/${params.slug}` },
  ]);

  const faqJsonLd =
    params.slug === "faq-beginner"
      ? createFAQPageSchema([
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
        ])
      : null;

  /*
   * JSON-LD structured data — safe: static schema objects built from
   * our own frontmatter at build time, serialized via JSON.stringify.
   * No user input reaches this path. Same pattern used in content/[slug]/page.tsx
   * and getting-started/page.tsx.
   */
  const articleJsonLdHtml = serializeJsonLd(articleJsonLd);
  const breadcrumbJsonLdHtml = serializeJsonLd(breadcrumbJsonLd);

  return (
    <>
      {/* JSON-LD structured data — safe: static schema, no user input */}
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: articleJsonLdHtml }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: breadcrumbJsonLdHtml }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(faqJsonLd) }}
        />
      )}

      {/* Hero section */}
      <section className="relative overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-[var(--gradient-hero)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(6,182,212,0.15),_transparent_60%)]" />

        <div className="relative px-4 pb-12 pt-16 sm:px-6 sm:pb-16 sm:pt-24 lg:px-8">
          {/* Breadcrumb */}
          <nav
            aria-label="Fil d'Ariane"
            className="mb-6 flex items-center gap-2 text-sm text-slate-400"
          >
            <Link
              href="/"
              className="transition-colors hover:text-white"
            >
              Accueil
            </Link>
            <span aria-hidden="true">/</span>
            <Link
              href={`/${SECTION}`}
              className="transition-colors hover:text-white"
            >
              Premiers pas
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-slate-200">{frontmatter.title}</span>
          </nav>

          <div className="text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-brand-500/10 px-4 py-1.5 text-sm text-brand-300">
              <BookOpen className="h-4 w-4" aria-hidden="true" />
              Premiers pas
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
              {frontmatter.title}
            </h1>
            {frontmatter.description && (
              <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-300">
                {frontmatter.description}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 sm:py-16">
        <div className="px-4 sm:px-6 lg:px-0">
          <MdxRenderer source={content} />
        </div>
      </section>

      {/* Navigation between pages */}
      <section className="border-t border-slate-200/50 py-12 dark:border-slate-800">
        <div className="px-4 sm:px-6 lg:px-0">
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
            {prev ? (
              <Link
                href={`/${SECTION}/${extractSimpleSlug(prev.slug)}`}
                className="group flex items-center gap-2 rounded-xl border border-slate-200/50 px-6 py-4 transition-all hover:border-brand-500/30 hover:bg-slate-50 dark:border-slate-700/50 dark:hover:border-brand-500/30 dark:hover:bg-slate-800/50"
              >
                <ArrowLeft className="h-4 w-4 text-slate-400 transition-transform group-hover:-translate-x-1" aria-hidden="true" />
                <div>
                  <p className="text-xs text-slate-400">Pr&eacute;c&eacute;dent</p>
                  <p className="text-sm font-semibold">
                    {prev.frontmatter.title}
                  </p>
                </div>
              </Link>
            ) : (
              <Link
                href={`/${SECTION}`}
                className="group flex items-center gap-2 rounded-xl border border-slate-200/50 px-6 py-4 transition-all hover:border-brand-500/30 hover:bg-slate-50 dark:border-slate-700/50 dark:hover:border-brand-500/30 dark:hover:bg-slate-800/50"
              >
                <ArrowLeft className="h-4 w-4 text-slate-400 transition-transform group-hover:-translate-x-1" aria-hidden="true" />
                <div>
                  <p className="text-xs text-slate-400">Retour</p>
                  <p className="text-sm font-semibold">Vue d&apos;ensemble</p>
                </div>
              </Link>
            )}
            {next ? (
              <Link
                href={`/${SECTION}/${extractSimpleSlug(next.slug)}`}
                className="group flex items-center justify-end gap-2 rounded-xl border border-slate-200/50 px-6 py-4 text-right transition-all hover:border-brand-500/30 hover:bg-slate-50 dark:border-slate-700/50 dark:hover:border-brand-500/30 dark:hover:bg-slate-800/50"
              >
                <div>
                  <p className="text-xs text-slate-400">Suivant</p>
                  <p className="text-sm font-semibold">
                    {next.frontmatter.title}
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            ) : (
              <div />
            )}
          </div>
        </div>
      </section>
    </>
  );
}
