import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { Wand2 } from "lucide-react";
import { getSectionMdxBySlug, getSectionMdxSlugs } from "@/lib/mdx";
import { createPageMetadata, SITE_URL } from "@/lib/metadata";
import { createHowToSchema } from "@/lib/structured-data";
import SectionSlugContent from "@/components/layout/SectionSlugContent";
import { TutoArticleContent } from "@/components/layout/TutoArticleContent";

const SECTION = "skills";

/** TUTO-3 — slugs migres vers le shell article premium (rollout progressif). */
const ARTICLE_SHELL_SLUGS = new Set(["what-are-skills"]);

/**
 * HowTo JSON-LD pour la page claude-council : les 3 stages du pattern LLM
 * Council (First opinions / Review anonymisee / Final response). Localise FR/EN.
 */
const COUNCIL_HOWTO_STEPS: Readonly<
  Record<string, ReadonlyArray<{ name: string; text: string }>>
> = {
  fr: [
    {
      name: "Premiers avis",
      text: "Chaque conseiller repond a la question de facon independante, sans voir les reponses des autres.",
    },
    {
      name: "Revue croisee anonymisee",
      text: "Chaque conseiller recoit les autres reponses sans connaitre leurs auteurs, et les classe sur l'exactitude et la profondeur.",
    },
    {
      name: "Synthese finale",
      text: "Un Chairman designe lit tous les avis et tous les classements, arbitre les desaccords et produit une recommandation unique.",
    },
  ],
  en: [
    {
      name: "First opinions",
      text: "Each advisor answers the question independently, without seeing the other answers.",
    },
    {
      name: "Anonymized cross-review",
      text: "Each advisor receives the other answers without knowing who wrote them, and ranks them on accuracy and insight.",
    },
    {
      name: "Final response",
      text: "A designated Chairman reads every opinion and ranking, arbitrates disagreements and produces a single recommendation.",
    },
  ],
};

function buildCouncilHowTo(
  locale: string,
  title: string,
  description: string,
): ReadonlyArray<Record<string, unknown>> {
  const steps = COUNCIL_HOWTO_STEPS[locale] ?? COUNCIL_HOWTO_STEPS.fr;
  return [
    createHowToSchema({
      title,
      description,
      url: `${SITE_URL}/${locale}/${SECTION}/claude-council`,
      locale,
      steps,
    }),
  ];
}

interface PageProps {
  readonly params: Promise<{ locale: string; slug: string }>;
}

export function generateStaticParams({
  params,
}: {
  params: { locale: string };
}): Array<{ slug: string }> {
  return [...getSectionMdxSlugs(SECTION, params.locale)].map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!getSectionMdxSlugs(SECTION, locale).includes(slug)) {
    return {};
  }
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

export default async function SkillsSlugPage({ params }: PageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  if (ARTICLE_SHELL_SLUGS.has(slug)) {
    return <TutoArticleContent section={SECTION} slug={slug} locale={locale} />;
  }

  let extraJsonLd: ReadonlyArray<Record<string, unknown>> | undefined;
  if (slug === "claude-council") {
    const { frontmatter } = getSectionMdxBySlug(SECTION, slug, locale);
    extraJsonLd = buildCouncilHowTo(
      locale,
      frontmatter.title,
      frontmatter.description,
    );
  }

  return (
    <SectionSlugContent
      section={SECTION}
      slug={slug}
      locale={locale}
      icon={Wand2}
      extraJsonLd={extraJsonLd}
    />
  );
}
