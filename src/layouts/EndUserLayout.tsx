import AppEndUserFooter from "@/components/AppFooterNavItem";
import { AppEndUserHeader } from "@/components/AppHeaderNavItem";
import FloatingButtons from "@/components/button/FloatingButtons";
import { useBreadcrumbActions } from "@/contexts/BreadcrumbContext";
import { ReactNode, useEffect } from "react";

interface EndUserLayoutProps {
  children: ReactNode;
  breadcrumbs?: { title: string; url?: string }[];
  showBreadcrumb?: boolean;
}

const EndUserLayout = ({ children, breadcrumbs, showBreadcrumb }: EndUserLayoutProps) => {
  const { setBreadcrumbs, setShowBreadcrumb } = useBreadcrumbActions();
  useEffect(() => {
    if (breadcrumbs) {
      setBreadcrumbs(breadcrumbs);
    }
    if (showBreadcrumb !== undefined) {
      setShowBreadcrumb(showBreadcrumb);
    }
    return () => {
      setShowBreadcrumb(false);
    };
  }, [breadcrumbs, showBreadcrumb]);
  return (
    <div className="min-h-screen flex flex-col">
      <AppEndUserHeader />
      <main className="flex-1">{children}</main>
      <AppEndUserFooter />
      <FloatingButtons />
    </div>
  );
};

export default EndUserLayout;
