import { SectionLayout } from "@/components/layout/SectionLayout";

export default function LimitsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <SectionLayout>{children}</SectionLayout>;
}
