import { SectionLayout } from "@/components/layout/SectionLayout";

export default function AdvancedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <SectionLayout>{children}</SectionLayout>;
}
