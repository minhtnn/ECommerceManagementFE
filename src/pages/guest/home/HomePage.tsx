import { Skeleton } from "@/components/ui/skeleton";
import { useHomeMenu } from "@/hooks/use-home-menu";
import EndUserLayout from "@/layouts/EndUserLayout";
import { handleApiError } from "@/lib/error";
import HeroBanner from "@/pages/guest/home/components/HeroBanner";
import QuickLinks from "@/pages/guest/home/components/QuickLinks";
import { TMenuProductCategoryResponse } from "@/schemas/menu-product.schema";
import ProductSection from "./components/ProductSection";

const HomePage = () => {
  const { getHomeMenuData } = useHomeMenu();
  const { data: menuData, isLoading, isError, error } = getHomeMenuData();

  if (isError && error) {
    handleApiError(error);
  }

  const rootCategories = menuData.data.data.productCategoriesTree;

  const allProducts = menuData.data.data.products.items;

  const productsByCategory = new Map<string, typeof allProducts>();

  if (rootCategories.length && allProducts.length) {
    const getAllCategoryIds = (
      category: TMenuProductCategoryResponse,
    ): string[] => {
      const ids = [category.id];
      if (category.children && category.children.length > 0) {
        category.children.forEach((child) => {
          ids.push(...getAllCategoryIds(child));
        });
      }
      return ids;
    };

    rootCategories.forEach((rootCategory) => {
      const categoryIds = getAllCategoryIds(rootCategory);

      const categoryProducts = allProducts.filter((product) =>
        categoryIds.includes(product.productCategoryId),
      );

      productsByCategory.set(rootCategory.id, categoryProducts.slice(0, 10));
    });
  }

  if (isLoading) {
    return (
      <EndUserLayout>
        <div className="container mx-auto px-4 py-8">
          {/* Hero Skeleton */}
          <Skeleton className="h-96 w-full rounded-lg mb-8" />

          {/* Quick Links Skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-24 w-full rounded-lg" />
            ))}
          </div>

          {/* Product Sections Skeleton */}
          {[1, 2].map((section) => (
            <div key={section} className="mb-8">
              <Skeleton className="h-12 w-64 mb-4" />
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-80 w-full rounded-lg" />
                ))}
              </div>
            </div>
          ))}
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

      {/* Empty State */}
      {rootCategories.length === 0 && (
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-muted-foreground">
            Hiện chưa có sản phẩm nào. Vui lòng quay lại sau.
          </p>
        </div>
      )}
    </EndUserLayout>
  );
};

export default HomePage;
