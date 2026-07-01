import { setRequestLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { MdxRenderer } from "@/components/mdx/MdxRenderer";
import { ArticleSubNav } from "@/components/layout/ArticleSubNav";
import { ArticleHero } from "@/components/layout/ArticleHero";
import { ArticleShell } from "@/components/layout/ArticleShell";
import { ArticlePager } from "@/components/layout/ArticlePager";
import { SectionPeers } from "@/components/layout/SectionPeers";
import { ReadingProgressBar } from "@/components/ui/ReadingProgressBar";
import { ThemeBadges } from "@/components/ui/ThemeBadges";
import { SITE_URL } from "@/lib/metadata";
import {
  createArticleSchema,
  createBreadcrumbSchema,
  serializeJsonLd,
} from "@/lib/structured-data";
import { getSectionMdxBySlug, getSectionMdxSlugs } from "@/lib/mdx";
import {
  extractSimpleSlug,
  getAdjacentPages,
  sanitizeSlugForHref,
} from "@/lib/section-utils";

interface TutoArticleContentProps {
  readonly section: string;
  readonly slug: string;
  readonly locale: string;
  /** Schemas JSON-LD additionnels (FAQ, HowTo) injectes apres Article + Breadcrumb. */
  readonly extraJsonLd?: ReadonlyArray<Record<string, unknown>>;
}

/**
 * TUTO-4 — Shell article unifie pour les pages tuto des sections
 * documentaires (`getting-started`, `prompting`, `skills`, ...).
 *
 * Factorise le cablage du shell editorial premium (RG2) pour les pages
 * tuto : barre de progression, sous-nav breadcrumb + switch de langue,
 * hero editorial, shell 3 colonnes avec `SectionPeers` dans le rail droit
 * (preservation du maillage interne, cf. EPIC tuto-pages article-shell),
 * MDX pleine largeur de lecture et pager prev/next intra-section.
 *
 * Server Component. Le slug inconnu pour la locale courante tombe sur la
 * 404 stylisee (generateStaticParams est par-locale, les slugs peuvent
 * diverger entre FR et EN).
 */
export async function TutoArticleContent({
  section,
  slug,
  locale,
  extraJsonLd,
}: Readonly<TutoArticleContentProps>) {
  setRequestLocale(locale);

  const availableSlugs = getSectionMdxSlugs(section, locale);
  if (!availableSlugs.includes(slug)) {
    notFound();
  }

  const { frontmatter, content } = getSectionMdxBySlug(section, slug, locale);
  const { prev, next } = getAdjacentPages(section, slug, locale);
  const tCommon = await getTranslations("common");
  const tBreadcrumb = await getTranslations("breadcrumb");

  const currentLocale: "fr" | "en" = locale === "en" ? "en" : "fr";
  const sectionLabel = tBreadcrumb(`sections.${section}`);
  const articleUrl = `${SITE_URL}/${locale}/${section}/${slug}/`;

  // JSON-LD : objets statiques construits depuis notre frontmatter au build,
  // serialises via JSON.stringify. Aucune entree utilisateur n'atteint ce chemin.
  const articleJsonLdHtml = serializeJsonLd(
    createArticleSchema({
      title: frontmatter.title,
      description: frontmatter.description,
      url: articleUrl,
      locale,
      datePublished: frontmatter.datePublished,
      dateModified: frontmatter.dateModified,
    })
  );
  const breadcrumbJsonLdHtml = serializeJsonLd(
    createBreadcrumbSchema([
      { name: tCommon("home"), href: `/${locale}/` },
      { name: sectionLabel, href: `/${locale}/${section}/` },
      { name: frontmatter.title, href: articleUrl },
    ])
  );

  const prevHref = prev
    ? `/${section}/${sanitizeSlugForHref(extractSimpleSlug(prev.slug))}/`
    : null;
  const nextHref = next
    ? `/${section}/${sanitizeSlugForHref(extractSimpleSlug(next.slug))}/`
    : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: articleJsonLdHtml }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: breadcrumbJsonLdHtml }}
      />
      {extraJsonLd?.map((schema) => {
        const schemaType =
          typeof schema["@type"] === "string"
            ? schema["@type"]
            : `extra-${JSON.stringify(schema).length}`;
        return (
          <script
            key={`jsonld-${schemaType}`}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: serializeJsonLd(schema) }}
          />
        );
      })}

      {/* RG2-02 — Barre de progression de lecture */}
      <ReadingProgressBar />

      <ArticleSubNav
        currentLocale={currentLocale}
        otherLocaleHref={`/${section}/${slug}/`}
        ariaLabelBreadcrumb={tBreadcrumb("ariaLabel")}
        crumbs={[
          { label: tCommon("home"), href: "/" },
          { label: sectionLabel, href: `/${section}/` },
          { label: frontmatter.title },
        ]}
      />

      <ArticleHero
        category={sectionLabel}
        title={frontmatter.title}
        lead={frontmatter.description}
        datePublished={frontmatter.datePublished}
        dateModified={frontmatter.dateModified}
        publishedLabel={tCommon("published")}
        modifiedLabel={tCommon("updated")}
        locale={currentLocale === "en" ? "en-US" : "fr-FR"}
        themeBadges={
          frontmatter.themes && frontmatter.themes.length > 0 ? (
            <ThemeBadges themes={frontmatter.themes} />
          ) : null
        }
      />

      <ArticleShell
        shareUrl={articleUrl}
        shareTitle={frontmatter.title}
        shareLabel={tCommon("share")}
        copyAriaLabel={tCommon("copyLink")}
        copiedLabel={tCommon("linkCopied")}
        sectionPeers={
          <SectionPeers section={section} currentSlug={slug} locale={locale} />
        }
      >
        <MdxRenderer source={content} locale={locale} />
      </ArticleShell>

      <ArticlePager
        previousLabel={tCommon("previous")}
        nextLabel={tCommon("next")}
        analyticsCategory="tuto_pager"
        prev={
          prevHref && prev
            ? { href: prevHref, title: prev.frontmatter.title }
            : null
        }
        next={
          nextHref && next
            ? { href: nextHref, title: next.frontmatter.title }
            : null
        }
      />
    </>
  );
}
