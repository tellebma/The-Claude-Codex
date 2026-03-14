import { SectionLayout } from "@/components/layout/SectionLayout";

export default function UseCasesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <SectionLayout>{children}</SectionLayout>;
}
