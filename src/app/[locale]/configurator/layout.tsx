import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ScrollToTop } from "@/components/ui/ScrollToTop";

export default function ConfiguratorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8 xl:max-w-[1400px] 2xl:max-w-[1800px]">
        <Breadcrumb />
      </div>
      {children}
      <ScrollToTop />
    </>
  );
}
