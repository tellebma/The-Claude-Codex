import { SectionLayout } from "@/components/layout/SectionLayout";

export default function ConfiguratorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <SectionLayout>{children}</SectionLayout>;
}
