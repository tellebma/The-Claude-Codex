import { SectionLayout } from "@/components/layout/SectionLayout";

export default function SkillsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <SectionLayout>{children}</SectionLayout>;
}
