import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ScrollToTop } from "@/components/ui/ScrollToTop";
import { AnalyticsTracker } from "@/components/layout/AnalyticsTracker";

export default function ConfiguratorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <AnalyticsTracker />
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8 xl:max-w-[1400px] 2xl:max-w-[1800px]">
        <Breadcrumb />
      </div>
      {children}
      <ScrollToTop />
    </>
  );
}
