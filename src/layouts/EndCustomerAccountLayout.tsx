// components/account/AccountLayout.tsx
import EndUserLayout from "@/layouts/EndUserLayout";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { ReactNode } from "react";
import { EndCustomerAccountSidebar } from "@/components/EndCustomerAccountSidebar";

interface EndCustomerAccountLayoutProps {
  children: ReactNode;
  breadcrumbs?: { label: string; href?: string }[];
}

export const EndCustomerAccountLayout = ({
  children,
  breadcrumbs = [],
}: EndCustomerAccountLayoutProps) => {
  return (
    <EndUserLayout>
      {/* Breadcrumb */}
      <div className="bg-muted/30 py-3 border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 text-sm">
            <Link
              to="/"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Trang chủ
            </Link>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
            <Link
              to="/account"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Tài khoản
            </Link>
            {breadcrumbs.map((crumb, index) => (
              <div key={index} className="flex items-center gap-2">
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
                {crumb.href ? (
                  <Link
                    to={crumb.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-primary font-medium">{crumb.label}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Left Sidebar */}
          <div className="md:col-span-1">
            <EndCustomerAccountSidebar />
          </div>

          {/* Right Content */}
          <div className="md:col-span-2">{children}</div>
        </div>
      </div>
    </EndUserLayout>
  );
};