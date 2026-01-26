// import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

// export interface CartItem {
//   id: string;
//   name: string;
//   price: number;
//   originalPrice?: number;
//   image: string;
//   quantity: number;
// }

// interface CartContextType {
//   items: CartItem[];
//   addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
//   removeItem: (id: string) => void;
//   updateQuantity: (id: string, quantity: number) => void;
//   clearCart: () => void;
//   totalItems: number;
//   subtotal: number;
// }

// const CartContext = createContext<CartContextType | undefined>(undefined);

// const CART_STORAGE_KEY = "uni-coffee-cart";

// export const CartProvider = ({ children }: { children: ReactNode }) => {
//   const [items, setItems] = useState<CartItem[]>(() => {
//     const stored = localStorage.getItem(CART_STORAGE_KEY);
//     return stored ? JSON.parse(stored) : [];
//   });

//   useEffect(() => {
//     localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
//   }, [items]);

//   const addItem = (item: Omit<CartItem, "quantity">, quantity = 1) => {
//     setItems((prev) => {
//       const existingItem = prev.find((i) => i.id === item.id);
//       if (existingItem) {
//         return prev.map((i) =>
//           i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i
//         );
//       }
//       return [...prev, { ...item, quantity }];
//     });
//   };

//   const removeItem = (id: string) => {
//     setItems((prev) => prev.filter((item) => item.id !== id));
//   };

//   const updateQuantity = (id: string, quantity: number) => {
//     if (quantity <= 0) {
//       removeItem(id);
//       return;
//     }
//     setItems((prev) =>
//       prev.map((item) => (item.id === id ? { ...item, quantity } : item))
//     );
//   };

//   const clearCart = () => {
//     setItems([]);
//   };

//   const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
//   const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

//   return (
//     <CartContext.Provider
//       value={{
//         items,
//         addItem,
//         removeItem,
//         updateQuantity,
//         clearCart,
//         totalItems,
//         subtotal,
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// };

// export const useCart = () => {
//   const context = useContext(CartContext);
//   if (!context) {
//     throw new Error("useCart must be used within a CartProvider");
//   }
//   return context;
// };
