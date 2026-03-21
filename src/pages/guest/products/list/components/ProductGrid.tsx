import { Loader2 } from "lucide-react";
import { memo } from "react";
import ProductCard from "./ProductCard";
import { Button } from "@/components/ui/button";
import { TMenuProductListResponse } from "@/schemas/menu-product.schema";

interface ProductGridProps {
  products: TMenuProductListResponse[];
  isFetching: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  fetchNextPage: () => void;
  observerTarget: React.RefObject<HTMLDivElement>;
}

export const ProductGrid = memo(
  ({
    products,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    observerTarget,
  }: ProductGridProps) => {
    return (
      <div className="relative">
        {isFetching && !isFetchingNextPage && (
          <div
            className="absolute inset-0 bg-background/60 backdrop-blur-sm z-10 
                        flex items-center justify-center rounded-lg"
          >
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        )}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {products.map((product, index) => (
            <div
              key={product.id}
              className="animate-fade-in"
              style={{ animationDelay: `${Math.min(index * 0.05, 0.3)}s` }}
            >
              <ProductCard {...product} />
            </div>
          ))}
        </div>
        <div ref={observerTarget} className="py-8">
          {isFetchingNextPage && (
            <div className="flex justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          )}
          {!hasNextPage && products.length > 0 && (
            <p className="text-center text-muted-foreground text-sm">
              Đã hiển thị tất cả {products.length} sản phẩm
            </p>
          )}
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
    );
  },
);
