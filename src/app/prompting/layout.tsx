import { SectionLayout } from "@/components/layout/SectionLayout";

export default function PromptingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <SectionLayout>{children}</SectionLayout>;
}
