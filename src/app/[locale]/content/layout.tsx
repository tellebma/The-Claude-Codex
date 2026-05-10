/**
 * Layout des articles editoriaux (`/content/<slug>`).
 *
 * RG2-01 — Bypass de SectionLayout : les articles editoriaux n'ont pas
 * de sidebar de section. La structure 3 colonnes (share rail / body / TOC)
 * est portee par ArticleShell directement dans la page.
 */
export default function ContentLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="bg-[color:var(--bg-page)]">{children}</div>;
}
