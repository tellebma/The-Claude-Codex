import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale, getTranslations } from "next-intl/server";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { routing } from "@/i18n/routing";
import {
  SITE_URL,
  SITE_NAME,
  DEFAULT_OG_IMAGE,
} from "@/lib/metadata";
import {
  createWebSiteSchema,
  createOrganizationSchema,
  serializeJsonLd,
} from "@/lib/structured-data";
import "../globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const MATOMO_URL =
  process.env.NEXT_PUBLIC_MATOMO_URL ?? "https://matomo.tellebma.fr";
const MATOMO_SITE_ID = process.env.NEXT_PUBLIC_MATOMO_SITE_ID ?? "3";

/*
 * Matomo analytics script — safe: built from environment variables
 * or hardcoded defaults at build time. No user input reaches this path.
 * Same pattern used in the previous root layout.
 */
const matomoTrackingScript = `
  var _paq = window._paq = window._paq || [];
  _paq.push(['disableCookies']);
  _paq.push(['setDoNotTrack', true]);
  _paq.push(['trackPageView']);
  _paq.push(['enableLinkTracking']);
  (function() {
    var u = '${MATOMO_URL}/';
    _paq.push(['setTrackerUrl', u + 'matomo.php']);
    _paq.push(['setSiteId', '${MATOMO_SITE_ID}']);
    var d = document, g = d.createElement('script'), s = d.getElementsByTagName('script')[0];
    g.async = true; g.src = u + 'matomo.js'; s.parentNode.insertBefore(g, s);
  })();
`;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === "en";
  const tMeta = await getTranslations({ locale, namespace: "metadata" });

  const siteDescription = tMeta("siteDescription");
  const siteTitle = tMeta("siteTitle");
  const ogAlt = isEn
    ? `${SITE_NAME} | Reference guide to master Claude Code`
    : `${SITE_NAME} | Guide de référence pour maîtriser Claude Code`;

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? SITE_URL),
    title: {
      default: `${SITE_NAME} | ${siteTitle}`,
      template: `%s | ${SITE_NAME}`,
    },
    description: siteDescription,
    alternates: {
      canonical: `${SITE_URL}/${locale}`,
      languages: {
        fr: `${SITE_URL}/fr`,
        en: `${SITE_URL}/en`,
      },
    },
    openGraph: {
      title: SITE_NAME,
      description: siteDescription,
      type: "website",
      locale: isEn ? "en_US" : "fr_FR",
      siteName: SITE_NAME,
      url: `${SITE_URL}/${locale}`,
      images: [
        { url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: ogAlt },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: SITE_NAME,
      description: siteDescription,
      images: [DEFAULT_OG_IMAGE],
    },
    robots: { index: true, follow: true },
    icons: {
      icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
      apple: [
        {
          url: "/apple-touch-icon.svg",
          type: "image/svg+xml",
          sizes: "180x180",
        },
      ],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const tCommon = await getTranslations("common");
  const tMetadata = await getTranslations("metadata");

  const siteDescription = tMetadata("siteDescription");

  /*
   * JSON-LD structured data — safe: static schema built at build time
   * from hardcoded values, serialized via JSON.stringify. No user input
   * reaches this code path. Same pattern used across the entire site.
   */
  const websiteJsonLd = createWebSiteSchema({
    name: SITE_NAME,
    url: SITE_URL,
    description: siteDescription,
  });
  const organizationJsonLd = createOrganizationSchema();

  const websiteJsonLdHtml = serializeJsonLd(websiteJsonLd);
  const organizationJsonLdHtml = serializeJsonLd(organizationJsonLd);

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        {/* JSON-LD structured data — safe: static schema via JSON.stringify */}
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger -- safe: JSON.stringify of static schema
          dangerouslySetInnerHTML={{ __html: websiteJsonLdHtml }}
        />
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger -- safe: JSON.stringify of static schema
          dangerouslySetInnerHTML={{ __html: organizationJsonLdHtml }}
        />
        {/* Matomo cookieless analytics — safe: env vars / hardcoded defaults only */}
        <script
          // eslint-disable-next-line react/no-danger -- safe: built from env vars at build time
          dangerouslySetInnerHTML={{ __html: matomoTrackingScript }}
        />
      </head>
      <body
        className={`${jakarta.variable} ${mono.variable} font-sans antialiased`}
      >
        <NextIntlClientProvider messages={messages} locale={locale}>
          <ThemeProvider>
            <a href="#main-content" className="skip-to-content">
              {tCommon("skipToContent")}
            </a>
            <div className="flex min-h-screen flex-col">
              <Header />
              <main id="main-content" className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
