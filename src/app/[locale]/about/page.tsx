import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import {
  ArrowRight,
  Heart,
  BookOpen,
  Users,
  Shield,
  Globe,
  ExternalLink,
} from "lucide-react";
import { GitHubIcon } from "@/components/ui/icons/GitHubIcon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";
import { createPageMetadata, SITE_URL } from "@/lib/metadata";
import {
  createArticleSchema,
  serializeJsonLd,
} from "@/lib/structured-data";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return createPageMetadata({
    title: `${t("title")} ${t("titleHighlight")}`,
    description: t("subtitle"),
    path: `/${locale}/about`,
    locale,
  });
}

function buildArticleJsonLd(locale: string, title: string, description: string) {
  return createArticleSchema({
    title,
    description,
    url: `${SITE_URL}/${locale}/about`,
    locale,
    datePublished: "2026-03-14",
    dateModified: "2026-03-14",
  });
}

const valueIcons = [BookOpen, Users, Shield, Globe] as const;
const valueKeys = [
  "valueFree",
  "valueForAll",
  "valueIndependent",
  "valueFrench",
] as const;

export default async function AboutPage({
  params,
}: Readonly<{
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "about" });

  const fullTitle = `${t("title")} ${t("titleHighlight")}`;
  const jsonLdHtml = serializeJsonLd(
    buildArticleJsonLd(locale, fullTitle, t("subtitle"))
  );

  return (
    <>
      {/* JSON-LD structured data — safe: static schema, no user input */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdHtml }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-50 dark:bg-slate-950">
        <div className="absolute inset-0 bg-[var(--gradient-hero)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(6,182,212,0.15),_transparent_60%)]" />

        <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-20 sm:px-6 sm:pb-28 sm:pt-28 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-brand-500/10 px-4 py-1.5 text-sm text-brand-700 dark:text-brand-400">
              <Heart className="h-4 w-4" aria-hidden="true" />
              {t("badge")}
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
              {t("title")}{" "}
              <span className="text-gradient">{t("titleHighlight")}</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-300">
              {t("subtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll preset="fade-up">
            <SectionHeading
              badge={t("missionBadge")}
              title={t("missionTitle")}
              description={t("missionDescription")}
            />
          </AnimateOnScroll>

          <div className="mx-auto mt-12 max-w-3xl space-y-6 text-lg text-slate-600 dark:text-slate-300">
            <p>{t("missionP1")}</p>
            <p>{t("missionP2")}</p>
            <p>{t("missionP3")}</p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-slate-50/50 py-16 dark:bg-slate-900/50 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll preset="fade-up">
            <SectionHeading
              badge={t("valuesBadge")}
              title={t("valuesTitle")}
            />
          </AnimateOnScroll>

          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {valueKeys.map((key, index) => {
              const Icon = valueIcons[index];
              return (
                <div key={key} className="glass-card p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500/20 to-brand-500/5">
                    <Icon
                      className="h-6 w-6 text-brand-700 dark:text-brand-400"
                      aria-hidden="true"
                    />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">
                    {t(`${key}Title`)}
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    {t(`${key}Desc`)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Author */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll preset="fade-up">
            <SectionHeading
              badge={t("authorBadge")}
              title={t("authorTitle")}
            />
          </AnimateOnScroll>

          <div className="mx-auto mt-12 max-w-2xl">
            <div className="glass-card p-8">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-accent-500 text-xl font-bold text-white">
                  T
                </div>
                <div>
                  <h3 className="text-xl font-bold">{t("authorName")}</h3>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {t("authorRole")}
                  </p>
                </div>
              </div>
              <div className="mt-6 space-y-4 text-slate-600 dark:text-slate-300">
                <p>{t("authorP1")}</p>
                <p>{t("authorP2")}</p>
              </div>
              <div className="mt-6 flex gap-4">
                <a
                  href="https://github.com/tellebma"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium transition-colors hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                >
                  <GitHubIcon className="h-4 w-4" aria-hidden="true" />
                  {t("github")}
                  <ExternalLink className="h-3 w-3" aria-hidden="true" />
                </a>
                <a
                  href="https://github.com/tellebma/The-Claude-Codex"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium transition-colors hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                >
                  <BookOpen className="h-4 w-4" aria-hidden="true" />
                  {t("sourceCode")}
                  <ExternalLink className="h-3 w-3" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden py-20 sm:py-28">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-50 via-slate-50 to-brand-100 dark:from-brand-950 dark:via-slate-900 dark:to-brand-900" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(6,182,212,0.15),_transparent_70%)]" />

        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
            {t("ctaTitle")}{" "}
            <span className="text-gradient">{t("ctaHighlight")}</span> ?
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-300">
            {t("ctaDescription")}
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="https://github.com/tellebma/The-Claude-Codex"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-xl bg-slate-900 px-8 py-3.5 text-sm font-semibold text-white shadow-lg transition-all hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
            >
              <GitHubIcon className="h-4 w-4" aria-hidden="true" />
              {t("ctaGithub")}
              <ArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              />
            </a>
            <Link
              href="/getting-started"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-8 py-3.5 text-sm font-semibold text-slate-700 transition-all hover:border-slate-400 hover:bg-slate-100 dark:border-slate-600 dark:text-white dark:hover:border-slate-500 dark:hover:bg-white/5"
            >
              {t("ctaGuide")}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
