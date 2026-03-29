import { Skeleton } from "@/components/ui/skeleton";
import { useHomeMenu } from "@/hooks/use-home-menu";
import { handleApiError } from "@/lib/error";
import HeroBanner from "@/pages/guest/home/components/HeroBanner";
import QuickLinks from "@/pages/guest/home/components/QuickLinks";
import { TMenuProductCategoryResponse } from "@/schemas/menu-product.schema";
import { memo, useMemo } from "react";
import ProductSection from "./components/ProductSection";

// ---------------------------------------------------------------------------
// Helpers — defined outside component so they're never recreated
// ---------------------------------------------------------------------------

function getAllCategoryIds(category: TMenuProductCategoryResponse): string[] {
  const ids = [category.id];
  category.children?.forEach((child) => ids.push(...getAllCategoryIds(child)));
  return ids;
}

// ---------------------------------------------------------------------------
// Skeleton — memoized so it's never re-created during data fetch
// ---------------------------------------------------------------------------

const HomePageSkeleton = memo(() => (
  <div className="container mx-auto px-4 py-8">
    <Skeleton className="h-[400px] md:h-[500px] w-full mb-8" />
    <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-8">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-24 w-28 rounded-lg" />
      ))}
    </div>
    {[1, 2].map((section) => (
      <div key={section} className="mb-8">
        <Skeleton className="h-12 w-64 mb-4" />
        <div className="flex gap-4 overflow-hidden">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-80 min-w-[220px] rounded-lg flex-shrink-0" />
          ))}
        </div>
      </div>
    ))}
  </div>
));
HomePageSkeleton.displayName = "HomePageSkeleton";

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

const HomePage = () => {
  const { getHomeMenuData } = useHomeMenu();
  const { data: menuData, isLoading, isError, error } = getHomeMenuData();

  if (isError && error) handleApiError(error);

  const rootCategories = menuData?.data?.data?.productCategoriesTree ?? [];
  const allProducts    = menuData?.data?.data?.products?.items ?? [];

  /*
    PERF: productsByCategory is a Map built once from stable server data.
    useMemo deps are the actual arrays from the server response — if the
    server data hasn't changed (same reference from React Query cache),
    this never re-runs.
  */
  const productsByCategory = useMemo(() => {
    const map = new Map<string, typeof allProducts>();
    if (!rootCategories.length || !allProducts.length) return map;

    rootCategories.forEach((rootCategory) => {
      const categoryIds = getAllCategoryIds(rootCategory);
      const products = allProducts
        .filter((p) => categoryIds.includes(p.productCategoryId))
        .slice(0, 10);
      map.set(rootCategory.id, products);
    });

    return map;
  }, [rootCategories, allProducts]);

  if (isLoading) return <HomePageSkeleton />;

  return (
    <>
      <title>Uni Coffee Roastery - Cà Phê Việt Nam Chất Lượng Cao</title>

      {/*
        PERF: HeroBanner and QuickLinks are stable — they never depend on
        product data. Wrapping them in fragments means React reconciles them
        independently from the dynamic product sections below.
      */}
      <HeroBanner />
      <QuickLinks />

      {rootCategories.map((category) => {
        const products = productsByCategory.get(category.id) ?? [];
        if (products.length === 0) return null;

        return (
          <ProductSection
            key={category.id}
            title={category.name}
            products={products}
            categoryId={category.id}
            showCarousel
          />
        );
      })}

      {rootCategories.length === 0 && (
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-muted-foreground">Hiện chưa có sản phẩm nào. Vui lòng quay lại sau.</p>
        </div>
      )}
    </>
  );
};

export default HomePage;