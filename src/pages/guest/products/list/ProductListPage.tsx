// pages/guest/products/list/ProductPage.tsx
import { Button } from "@/components/ui/button";
import { useProductMenu, usePublicProductMenu } from "@/hooks/use-product-menu";
import { handleApiError } from "@/lib/error";
import ProductCard from "@/pages/guest/products/list/components/ProductCard";
import { handleSetChosenCategoryId } from "@/redux/modal/modal-slice";
import { RootState } from "@/redux/store";
import { Loader2, Zap } from "lucide-react";
import { useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CategoryTreeItem } from "./components/CategoryTreeItem";

const ProductListPage = () => {
  const dispatch = useDispatch();
  const { chosenCategoryId } = useSelector((state: RootState) => state.modal);
  const params = useMemo(
    () => (chosenCategoryId ? { categoryId: chosenCategoryId } : {}),
    [chosenCategoryId],
  );
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = usePublicProductMenu(params);

  // Infinite scroll observer
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isError && error) {
    handleApiError(error);
  }

  // Flatten all pages into single array
  const allProducts =
    data?.pages?.flatMap((page) => page?.data?.data?.products?.items || []) ||
    [];

  // Get categories from first page only (they're the same in all pages)
  const categoriesTree =
    data?.pages?.[0]?.data?.data?.productCategoriesTree || [];

  if (isLoading) {
    return (
      <>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        </div>
      </>
    );
  }

  if (!data?.pages?.[0]?.data?.data) {
    return (
      <>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-foreground/70">
            <h2 className="text-2xl font-semibold mb-4">
              Không có sản phẩm nào
            </h2>
            <p>
              Hiện tại không có sản phẩm nào trong danh mục này. Vui lòng quay
              lại sau hoặc chọn danh mục khác.
            </p>
          </div>
        </div>
      </>
    );
  }

  if (categoriesTree.length === 0 && allProducts.length === 0) {
    return (
      <>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-foreground/70">
            <h2 className="text-2xl font-semibold mb-4">
              Không có sản phẩm nào
            </h2>
            <p>
              Hiện tại không có sản phẩm nào trong danh mục này. Vui lòng quay
              lại sau hoặc chọn danh mục khác.
            </p>
          </div>
        </div>
      </>
    );
  }

  const handleCategorySelect = (categoryId: string) => {
    dispatch(handleSetChosenCategoryId(categoryId));
  };

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-1">
            {/* Categories */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-foreground mb-4 uppercase tracking-wide">
                Danh mục
              </h3>
              <div className="space-y-1">
                {categoriesTree.map((category) => (
                  <CategoryTreeItem
                    key={category.id}
                    category={category}
                    selectedId={chosenCategoryId}
                    onSelect={handleCategorySelect}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-lg p-8 mb-8 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Zap className="fill-accent text-accent" size={32} />
                <h1 className="text-3xl md:text-4xl font-bold">FLASH SALE</h1>
                <Zap className="fill-accent text-accent" size={32} />
              </div>
              <p className="text-primary-foreground/80">
                Chính hãng 100% - Ưu đãi có hạn
              </p>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {allProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${Math.min(index * 0.05, 0.3)}s` }}
                >
                  <ProductCard {...product} />
                </div>
              ))}
            </div>

            {/* Loading More Indicator */}
            <div ref={observerTarget} className="py-8">
              {isFetchingNextPage && (
                <div className="flex justify-center">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              )}

              {!hasNextPage && allProducts.length > 0 && (
                <p className="text-center text-muted-foreground text-sm">
                  Đã hiển thị tất cả {allProducts.length} sản phẩm
                </p>
              )}

              {/* Manual Load More Button (Optional) */}
              {hasNextPage && !isFetchingNextPage && (
                <div className="flex justify-center">
                  <Button
                    variant="outline"
                    onClick={() => fetchNextPage()}
                    className="px-8"
                  >
                    Xem thêm sản phẩm
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductListPage;
