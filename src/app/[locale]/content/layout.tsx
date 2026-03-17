import { SectionLayout } from "@/components/layout/SectionLayout";

export default function ContentLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <SectionLayout>{children}</SectionLayout>;
}
