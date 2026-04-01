import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ScrollToTop } from "@/components/ui/ScrollToTop";
import { TableOfContents } from "@/components/ui/TableOfContents";
import { SectionSidebar } from "@/components/layout/SectionSidebar";

interface SectionLayoutProps {
  readonly children: React.ReactNode;
}

export function SectionLayout({ children }: SectionLayoutProps) {
  return (
    <>
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8 xl:max-w-[1400px] 2xl:max-w-[1800px]">
        <Breadcrumb />
      </div>
      <div className="mx-auto max-w-7xl lg:flex lg:gap-8 lg:px-4 xl:max-w-[1400px] xl:gap-12 2xl:max-w-[1800px] 2xl:gap-16">
        {/* Left sidebar for section navigation */}
        <div className="hidden w-56 shrink-0 pt-6 lg:block xl:w-60 2xl:w-64">
          <SectionSidebar />
        </div>

        {/* Main content */}
        <div className="min-w-0 flex-1 max-w-3xl">
          {children}
        </div>

        {/* Right sidebar for Table of Contents */}
        <div className="hidden w-56 shrink-0 xl:block xl:w-60 2xl:w-64">
          <div className="pt-6">
            <TableOfContents />
          </div>
        </div>
      </div>
      <ScrollToTop />
    </>
  );
}
