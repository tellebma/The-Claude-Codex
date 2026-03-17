import { SectionLayout } from "@/components/layout/SectionLayout";

export default function FutureLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <SectionLayout>{children}</SectionLayout>;
}
