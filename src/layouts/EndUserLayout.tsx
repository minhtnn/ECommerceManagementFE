import AppEndUserFooter from "@/components/AppFooterNavItem";
import { AppEndUserHeader } from "@/components/AppHeaderNavItem";
import FloatingButtons from "@/components/button/FloatingButtons";
import { CartProvider } from "@/contexts/CartContext";
import { ReactNode } from "react";

interface EndUserLayoutProps {
  children: ReactNode;
}

const EndUserLayout = ({ children }: EndUserLayoutProps) => {
  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col">
        <AppEndUserHeader />
        <main className="flex-1">{children}</main>
        <AppEndUserFooter />
        <FloatingButtons />
      </div>
    </CartProvider>
  );
};

export default EndUserLayout;
