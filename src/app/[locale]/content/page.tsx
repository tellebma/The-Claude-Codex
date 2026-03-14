import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, ArrowRight } from "lucide-react";
import { getAllMdxFiles } from "@/lib/mdx";
import { createPageMetadata, SITE_URL } from "@/lib/metadata";
import {
  createCollectionPageSchema,
  serializeJsonLd,
} from "@/lib/structured-data";
import { SectionHeading } from "@/components/ui/SectionHeading";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return createPageMetadata({
    title: "Contenus editoriaux",
    description:
      "Tous les articles et guides editoriaux du Claude Codex. Explorez nos contenus MDX sur Claude Code, les MCP, les Skills et le prompting.",
    path: `/${locale}/content`,
    locale,
  });
}

function buildCollectionJsonLd(locale: string) {
  return createCollectionPageSchema({
    name: "Contenus editoriaux",
    description:
      "Tous les articles et guides editoriaux du Claude Codex sur Claude Code, les MCP, les Skills et le prompting.",
    url: `${SITE_URL}/${locale}/content`,
  });
}

export default async function ContentIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const allFiles = getAllMdxFiles();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(buildCollectionJsonLd(locale)),
        }}
      />
      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-[var(--gradient-hero)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(6,182,212,0.15),_transparent_60%)]" />

        <div className="relative px-4 pb-12 pt-16 sm:px-6 sm:pb-16 sm:pt-24 lg:px-8">
          <div className="text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-brand-500/10 px-4 py-1.5 text-sm text-brand-300">
              <BookOpen className="h-4 w-4" aria-hidden="true" />
              Contenus editoriaux
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Tous nos <span className="text-gradient">articles</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-300">
              Explorez nos guides editoriaux au format MDX. Chaque article est
              autonome et peut etre lu independamment.
            </p>
          </div>
        </div>
      </section>

      {/* Articles list */}
      <section className="py-16 sm:py-20">
        <div className="px-4 sm:px-6 lg:px-0">
          <SectionHeading
            badge="Articles"
            title="Guides disponibles"
            description="Cliquez sur un article pour le lire. Les contenus sont classes par ordre de progression."
          />

          <div className="mt-12 space-y-4">
            {allFiles.map((file) => (
              <Link
                key={file.slug}
                href={`/content/${file.slug}`}
                className="group flex items-center justify-between rounded-xl border border-slate-200/50 bg-white/50 p-6 transition-all hover:-translate-y-0.5 hover:border-brand-500/30 hover:shadow-lg dark:border-slate-700/50 dark:bg-slate-800/50 dark:hover:border-brand-500/30"
              >
                <div>
                  {file.frontmatter.badge && (
                    <span className="mb-2 inline-block rounded-full bg-brand-500/10 px-3 py-0.5 text-xs font-semibold text-brand-700 dark:text-brand-400">
                      {file.frontmatter.badge}
                    </span>
                  )}
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                    {file.frontmatter.title}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">
                    {file.frontmatter.description}
                  </p>
                </div>
                <ArrowRight className="ml-4 h-5 w-5 shrink-0 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-brand-500" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
