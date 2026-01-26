import { createContext, useContext, useState, ReactNode } from "react";

export interface Product {
  id: string;
  code: string;
  name: string;
  description: string;
  categoryId: string;
  price: number;
  originalPrice?: number;
  stock: number;
  unit: string;
  image?: string;
  images?: string[];
  hasVariants: boolean;
  isFeatured: boolean;
  isOnSale: boolean;
  status: "active" | "inactive";
  order?: number;
}

interface ProductsContextType {
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  getProductsByCategory: (categoryId: string) => Product[];
  getActiveProducts: () => Product[];
  getFeaturedProducts: () => Product[];
  getSaleProducts: () => Product[];
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

// Initial mock products linked to categories
const initialProducts: Product[] = [
  { 
    id: "1", 
    code: "BANHBAODAUXANH", 
    name: "Bánh Bao Đậu Xanh", 
    description: "Bánh bao nhân đậu xanh thơm ngon", 
    categoryId: "1", 
    price: 15000, 
    originalPrice: 18000, 
    stock: 100, 
    unit: "cái", 
    hasVariants: false, 
    isFeatured: true, 
    isOnSale: true, 
    status: "active" 
  },
  { 
    id: "2", 
    code: "BANHBAOXAXIU", 
    name: "Bánh Bao Nhân Xá Xíu", 
    description: "Bánh bao nhân xá xíu đậm đà", 
    categoryId: "1", 
    price: 18000, 
    stock: 80, 
    unit: "cái", 
    hasVariants: false, 
    isFeatured: false, 
    isOnSale: false, 
    status: "active" 
  },
  { 
    id: "3", 
    code: "BANHBAOCONHEO", 
    name: "Bánh Bao Tạo Hình Con Heo", 
    description: "Bánh bao hình con heo dễ thương", 
    categoryId: "1", 
    price: 20000, 
    stock: 50, 
    unit: "cái", 
    hasVariants: false, 
    isFeatured: true, 
    isOnSale: false, 
    status: "active" 
  },
  { 
    id: "4", 
    code: "BANHHOANGKIM", 
    name: "Bánh Hoàng Kim", 
    description: "Bánh hoàng kim truyền thống", 
    categoryId: "2", 
    price: 25000, 
    originalPrice: 30000, 
    stock: 60, 
    unit: "cái", 
    hasVariants: false, 
    isFeatured: false, 
    isOnSale: true, 
    status: "active" 
  },
  { 
    id: "5", 
    code: "SUACHUAHOA", 
    name: "Sữa Chua Hoa Quả", 
    description: "Sữa chua tươi với hoa quả tự nhiên", 
    categoryId: "4", 
    price: 35000, 
    stock: 40, 
    unit: "ly", 
    hasVariants: false, 
    isFeatured: true, 
    isOnSale: false, 
    status: "active" 
  },
];

export const ProductsProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);

  const addProduct = (product: Product) => {
    setProducts((prev) => [...prev, product]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const getProductsByCategory = (categoryId: string) => {
    return products.filter((p) => p.categoryId === categoryId && p.status === "active");
  };

  const getActiveProducts = () => {
    return products.filter((p) => p.status === "active");
  };

  const getFeaturedProducts = () => {
    return products.filter((p) => p.status === "active" && p.isFeatured);
  };

  const getSaleProducts = () => {
    return products.filter((p) => p.status === "active" && p.isOnSale);
  };

  return (
    <ProductsContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        getProductsByCategory,
        getActiveProducts,
        getFeaturedProducts,
        getSaleProducts,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (context === undefined) {
    throw new Error("useProducts must be used within a ProductsProvider");
  }
  return context;
};
