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
  "Le guide de r\u00e9f\u00e9rence gratuit pour ma\u00eetriser Claude Code. MCP, Skills, Prompting avanc\u00e9 \u2014 pour d\u00e9veloppeurs et non-d\u00e9veloppeurs.";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? SITE_URL
  ),
  title: {
    default: `${SITE_NAME} | Ma\u00eetrisez Claude Code`,
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
        alt: `${SITE_NAME} \u2014 Guide de r\u00e9f\u00e9rence pour ma\u00eetriser Claude Code`,
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
};

const websiteJsonLd = createWebSiteSchema({
  name: SITE_NAME,
  url: SITE_URL,
  description: siteDescription,
});

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
