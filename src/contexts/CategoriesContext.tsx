import { createContext, useContext, useState, ReactNode } from "react";

export interface Category {
  id: string;
  code: string;
  name: string;
  description?: string;
  type: "parent" | "child";
  order: number;
  status: "active" | "inactive";
  image?: string;
}

interface CategoriesContextType {
  categories: Category[];
  addCategory: (category: Category) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  getActiveCategories: () => Category[];
}

const CategoriesContext = createContext<CategoriesContextType | undefined>(undefined);

// Initial mock categories
const initialCategories: Category[] = [
  { id: "1", code: "BANHBAO", name: "Bánh Bao", type: "parent", order: 1, status: "active" },
  { id: "2", code: "BANHNGOT", name: "Bánh Ngọt", type: "parent", order: 2, status: "active" },
  { id: "3", code: "BANHMAN", name: "Bánh Mặn", type: "parent", order: 3, status: "active" },
  { id: "4", code: "DOUONG", name: "Đồ Uống", type: "parent", order: 4, status: "active" },
  { id: "5", code: "DIMSUM", name: "Dimsum", type: "parent", order: 5, status: "active" },
];

export const CategoriesProvider = ({ children }: { children: ReactNode }) => {
  const [categories, setCategories] = useState<Category[]>(initialCategories);

  const addCategory = (category: Category) => {
    setCategories((prev) => [...prev, category]);
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    setCategories((prev) =>
      prev.map((cat) => (cat.id === id ? { ...cat, ...updates } : cat))
    );
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((cat) => cat.id !== id));
  };

  const getActiveCategories = () => {
    return categories
      .filter((cat) => cat.status === "active")
      .sort((a, b) => a.order - b.order);
  };

  return (
    <CategoriesContext.Provider
      value={{
        categories,
        addCategory,
        updateCategory,
        deleteCategory,
        getActiveCategories,
      }}
    >
      {children}
    </CategoriesContext.Provider>
  );
};

export const useCategories = () => {
  const context = useContext(CategoriesContext);
  if (context === undefined) {
    throw new Error("useCategories must be used within a CategoriesProvider");
  }
  return context;
};
