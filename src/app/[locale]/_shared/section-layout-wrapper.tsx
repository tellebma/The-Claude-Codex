import { SectionLayout } from "@/components/layout/SectionLayout";

/**
 * Shared layout wrapper for all section pages.
 * Each section's layout.tsx re-exports this as its default export.
 */
export default function SectionLayoutWrapper({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <SectionLayout>{children}</SectionLayout>;
}
