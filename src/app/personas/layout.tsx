import { SectionLayout } from "@/components/layout/SectionLayout";

export default function PersonasLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <SectionLayout>{children}</SectionLayout>;
}
