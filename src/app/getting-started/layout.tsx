import { SectionLayout } from "@/components/layout/SectionLayout";

export default function GettingStartedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <SectionLayout>{children}</SectionLayout>;
}
