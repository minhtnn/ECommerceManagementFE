import AppEndUserFooter from "@/components/AppFooterNavItem";
import { AppEndUserHeader } from "@/components/AppHeaderNavItem";
import FloatingButtons from "@/components/button/FloatingButtons";
import { ReactNode } from "react";

interface EndUserLayoutProps {
  children: ReactNode;
  breadcrumbs?: { title: string; url?: string }[];
  showBreadcrumb?: boolean;
}

const EndUserLayout = ({ children }: EndUserLayoutProps) => {
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
