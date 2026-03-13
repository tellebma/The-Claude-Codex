import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
  SITE_URL,
  SITE_NAME,
  SITE_LOCALE,
  DEFAULT_OG_IMAGE,
} from "@/lib/metadata";
import {
  createWebSiteSchema,
  serializeJsonLd,
} from "@/lib/structured-data";
import "./globals.css";

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

const siteDescription =
  "Le guide de référence gratuit pour maîtriser Claude Code. MCP, Skills, Prompting avancé, pour développeurs et non-développeurs.";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? SITE_URL
  ),
  title: {
    default: `${SITE_NAME} | Maîtrisez Claude Code`,
    template: `%s | ${SITE_NAME}`,
  },
  description: siteDescription,
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: SITE_NAME,
    description: siteDescription,
    type: "website",
    locale: SITE_LOCALE,
    siteName: SITE_NAME,
    url: SITE_URL,
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} | Guide de référence pour maîtriser Claude Code`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: siteDescription,
    images: [DEFAULT_OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/apple-touch-icon.svg", type: "image/svg+xml", sizes: "180x180" }],
  },
};

const websiteJsonLd = createWebSiteSchema({
  name: SITE_NAME,
  url: SITE_URL,
  description: siteDescription,
});

const MATOMO_URL = process.env.NEXT_PUBLIC_MATOMO_URL ?? "https://matomo.tellebma.fr";
const MATOMO_SITE_ID = process.env.NEXT_PUBLIC_MATOMO_SITE_ID ?? "3";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: serializeJsonLd(websiteJsonLd),
          }}
        />
        {/* Matomo cookieless analytics — no user data stored, respects Do Not Track */}
        <script
          dangerouslySetInnerHTML={{
            __html: matomoTrackingScript,
          }}
        />
      </head>
      <body
        className={`${jakarta.variable} ${mono.variable} font-sans antialiased`}
      >
        <ThemeProvider>
          <a href="#main-content" className="skip-to-content">
            Aller au contenu principal
          </a>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main id="main-content" className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
