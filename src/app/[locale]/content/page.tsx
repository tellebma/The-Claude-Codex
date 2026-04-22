import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { BookOpen, ArrowRight } from "lucide-react";
import { getAllMdxFiles } from "@/lib/mdx";
import { createPageMetadata, SITE_URL } from "@/lib/metadata";
import {
  createCollectionPageSchema,
  serializeJsonLd,
} from "@/lib/structured-data";
import { SectionHeading } from "@/components/ui/SectionHeading";

const translations = {
  fr: {
    metaTitle: "Contenus editoriaux",
    metaDescription:
      "Tous les articles et guides editoriaux du Claude Codex. Explorez nos contenus MDX sur Claude Code, les MCP, les Skills et le prompting.",
    collectionName: "Contenus editoriaux",
    collectionDescription:
      "Tous les articles et guides editoriaux du Claude Codex sur Claude Code, les MCP, les Skills et le prompting.",
    heroBadge: "Contenus editoriaux",
    heroTitle: "Tous nos",
    heroTitleHighlight: "articles",
    heroSubtitle:
      "Explorez nos guides editoriaux au format MDX. Chaque article est autonome et peut etre lu independamment.",
    sectionBadge: "Articles",
    sectionTitle: "Guides disponibles",
    sectionDescription:
      "Cliquez sur un article pour le lire. Les contenus sont classes par ordre de progression.",
  },
  en: {
    metaTitle: "Editorial content",
    metaDescription:
      "All editorial articles and guides from The Claude Codex. Explore our MDX content on Claude Code, MCPs, Skills, and prompting.",
    collectionName: "Editorial content",
    collectionDescription:
      "All editorial articles and guides from The Claude Codex on Claude Code, MCPs, Skills, and prompting.",
    heroBadge: "Editorial content",
    heroTitle: "All our",
    heroTitleHighlight: "articles",
    heroSubtitle:
      "Explore our editorial guides in MDX format. Each article is self-contained and can be read independently.",
    sectionBadge: "Articles",
    sectionTitle: "Available guides",
    sectionDescription:
      "Click an article to read it. Content is sorted by progression order.",
  },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = translations[locale as "fr" | "en"];
  return createPageMetadata({
    title: t.metaTitle,
    description: t.metaDescription,
    path: `/${locale}/content`,
    locale,
  });
}

function buildCollectionJsonLd(locale: string) {
  const t = translations[locale as "fr" | "en"];
  return createCollectionPageSchema({
    name: t.collectionName,
    description: t.collectionDescription,
    url: `${SITE_URL}/${locale}/content`,
    locale,
  });
}

export default async function ContentIndexPage({
  params,
}: Readonly<{
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = translations[locale as "fr" | "en"];
  const allFiles = getAllMdxFiles(locale);

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
              {t.heroBadge}
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
              {t.heroTitle} <span className="text-gradient">{t.heroTitleHighlight}</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-300">
              {t.heroSubtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-0">
          <div className="space-y-6 text-lg text-slate-600 dark:text-slate-300">
            <p>
              Les articles &eacute;ditoriaux du Claude Codex sont des guides
              autonomes qui traitent chacun d&apos;un sujet pr&eacute;cis. Contrairement
              aux pages de documentation structur&eacute;es par section (MCP, Skills,
              Prompting), ces contenus abordent des th&egrave;mes transversaux :
              s&eacute;curit&eacute;, co&ucirc;ts r&eacute;els, bonnes pratiques
              et mythes &agrave; d&eacute;construire.
            </p>
            <p>
              Chaque article est r&eacute;dig&eacute; pour &ecirc;tre lu en 5 &agrave;
              15 minutes. Vous pouvez les lire dans n&apos;importe quel ordre.
              Si vous d&eacute;butez, commencez par &quot;Qu&apos;est-ce que Claude
              Code&quot; dans la section D&eacute;marrer, puis revenez ici pour approfondir
              les sujets qui vous int&eacute;ressent.
            </p>
          </div>
        </div>
      </section>

      {/* Articles list */}
      <section className="bg-slate-50/50 py-16 dark:bg-slate-900/50 sm:py-20">
        <div className="px-4 sm:px-6 lg:px-0">
          <SectionHeading
            badge={t.sectionBadge}
            title={t.sectionTitle}
            description={t.sectionDescription}
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
