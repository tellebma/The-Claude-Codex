import { SectionLayout } from "@/components/layout/SectionLayout";

export default function McpLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <SectionLayout>{children}</SectionLayout>;
}
