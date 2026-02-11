// pages/guest/home/HomePage.tsx
import HeroBanner from "@/components/home/HeroBanner";
import EndUserLayout from "@/layouts/EndUserLayout";
import QuickLinks from "@/pages/guest/home/components/QuickLinks";
import { useHomeMenu } from "@/hooks/use-home-menu";
import { handleApiError } from "@/lib/error";
import { useMemo } from "react";
import { TMenuProductCategoryResponse } from "@/schemas/menu-product.schema";
import ProductSection from "./components/ProductSection";

const HomePage = () => {
  const { getHomeMenuData } = useHomeMenu();
  const {
    data: menuData,
    isLoading,
    isError,
    error,
  } = getHomeMenuData();

  if (isError && error) {
    handleApiError(error);
  }

  // Lấy các category cha (root categories)
  const rootCategories = useMemo(() => {
    if (!menuData?.data?.data?.productCategoriesTree) return [];
    return menuData.data.data.productCategoriesTree;
  }, [menuData]);

  // Nhóm products theo category
  const productsByCategory = useMemo(() => {
    if (!menuData?.data?.data) return new Map();
    
    const allProducts = menuData.data.data.products || [];
    const categoriesTree = menuData.data.data.productCategoriesTree || [];
    
    const categoryProductsMap = new Map<string, typeof allProducts>();

    // Hàm đệ quy để lấy tất cả category IDs (bao gồm cả children)
    const getAllCategoryIds = (category: TMenuProductCategoryResponse): string[] => {
      const ids = [category.id];
      if (category.children && category.children.length > 0) {
        category.children.forEach(child => {
          ids.push(...getAllCategoryIds(child));
        });
      }
      return ids;
    };

    // Với mỗi root category, lấy products từ nó và các children
    categoriesTree.forEach(rootCategory => {
      const categoryIds = getAllCategoryIds(rootCategory);
      
      // Filter products thuộc category này
      // Lưu ý: Bạn cần thêm categoryId vào product response từ backend
      // Hoặc sử dụng logic filter khác phù hợp với dữ liệu của bạn
      const categoryProducts = allProducts.filter(product => {
        // TODO: Điều chỉnh logic này dựa trên cấu trúc dữ liệu thực tế
        // Có thể cần thêm field categoryId vào GetMenuProductResponse
        return true; // Tạm thời lấy tất cả
      });

      categoryProductsMap.set(rootCategory.id, categoryProducts);
    });

    return categoryProductsMap;
  }, [menuData]);

  if (isLoading) {
    return (
      <EndUserLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p>Đang tải...</p>
          </div>
        </div>
      </EndUserLayout>
    );
  }

  return (
    <EndUserLayout>
      {/* SEO Meta */}
      <title>Uni Coffee Roastery - Cà Phê Việt Nam Chất Lượng Cao</title>
      
      {/* Hero Banner */}
      <HeroBanner />

      {/* Quick Links */}
      <QuickLinks />

      {/* Dynamic Product Sections by Root Categories */}
      {rootCategories.map((category) => {
        const products = productsByCategory.get(category.id) || [];
        
        // Chỉ hiển thị section nếu có products
        if (products.length === 0) return null;

        return (
          <ProductSection
            key={category.id}
            title={category.name}
            products={products}
            categoryId={category.id}
            showCarousel={true}
          />
        );
      })}
    </EndUserLayout>
  );
};

export default HomePage;