// contexts/CartContext.tsx
import { createContext, useContext, useMemo, ReactNode } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useCart } from "@/hooks/use-cart";
import { ERole } from "@/types/enums/role.enum";

interface CartContextValue {
  cartData: any;
  updateCartMutation: any;
}

const CartContext = createContext<CartContextValue | null>(null);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, role } = useSelector((state: RootState) => state.user);
  const isEndCustomer = isAuthenticated && role === ERole.EndCustomer;

  const { getEndCustomerCart, updateEndCustomerCart } = useCart();
  const { data: cartData } = getEndCustomerCart({ isAllowFetch: isEndCustomer });
  const updateCartMutation = updateEndCustomerCart();

  const value = useMemo(
    () => ({ cartData, updateCartMutation }),
    [cartData, updateCartMutation.isPending]
  );

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCartContext must be used inside CartProvider");
  return ctx;
};