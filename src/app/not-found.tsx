import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import { createPageMetadata } from "@/lib/metadata";
import { NotFoundClient } from "@/components/not-found/NotFoundClient";
import { getNotFoundBundles } from "@/lib/not-found-strings";
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

export const metadata: Metadata = createPageMetadata({
  title: "Page introuvable",
  description:
    "La page que vous cherchez n'existe pas ou a été déplacée. Whobee, le petit robot, vous aide à retrouver votre chemin parmi les guides et articles récents.",
  path: "/404",
});

export default function NotFound() {
  const bundles = getNotFoundBundles();

  return (
    <html
      lang="fr"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <body
        className={`${jakarta.variable} ${mono.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <NotFoundClient defaultLocale="fr" bundles={bundles} />
      </body>
    </html>
  );
}
