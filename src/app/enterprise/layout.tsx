import { SectionLayout } from "@/components/layout/SectionLayout";

export default function EnterpriseLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <SectionLayout>{children}</SectionLayout>;
}
