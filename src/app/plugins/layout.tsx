import { SectionLayout } from "@/components/layout/SectionLayout";

export default function PluginsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <SectionLayout>{children}</SectionLayout>;
}
