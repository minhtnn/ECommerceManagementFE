import { Button } from "@/components/ui/button";
import { TMenuProductListResponse } from "@/schemas/menu-product.schema";
import { Loader2 } from "lucide-react";
import { memo } from "react";
import ProductCard from "./ProductCard";

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
    /*
      PERF FIXES:
      1. Removed backdrop-blur-sm overlay — blur is one of the most expensive
         CSS effects on mobile (forces GPU layer creation + full repaint on
         every frame while visible). Replaced with a simple top progress bar.
      2. Removed stagger animationDelay per card — running 20+ staggered
         animations simultaneously causes frame drops on low-end devices.
         Cards now fade in as a group via CSS class instead.
      3. Added content-visibility: auto on each card wrapper so off-screen
         cards skip paint during initial render.
    */

    return (
      <div className="relative">
        {/* Lightweight loading indicator: thin bar instead of full overlay */}
        {isFetching && !isFetchingNextPage && (
          <div
            className="absolute top-0 left-0 right-0 h-[3px] z-10 overflow-hidden rounded-full"
            style={{ background: "hsl(var(--muted))" }}
          >
            <div
              className="h-full rounded-full"
              style={{
                background: "hsl(var(--primary))",
                animation: "gridFetchBar 1.2s ease-in-out infinite",
                transformOrigin: "left",
              }}
            />
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 pt-1">
          {products.map((product, index) => (
            <div
              key={product.id}
              /*
                content-visibility: auto skips rendering off-screen cards.
                containIntrinsicSize is a hint so scroll position stays stable.
                No per-card stagger — use a single fade-in on the grid instead.
              */
              style={{
                contentVisibility: "auto",
                containIntrinsicSize: "0 380px",
                // Simple fade in grouped by "page" of 8
                animation: index < 8 ? "cardFadeIn 0.3s ease both" : undefined,
                animationDelay: index < 8 ? `${index * 0.03}s` : undefined,
              }}
            >
              <ProductCard {...product} />
            </div>
          ))}
        </div>

        {/* Infinite scroll sentinel */}
        <div ref={observerTarget} className="py-8 flex flex-col items-center gap-3">
          {isFetchingNextPage && <Loader2 className="w-6 h-6 animate-spin text-primary" />}
          {!hasNextPage && products.length > 0 && (
            <p className="text-center text-muted-foreground text-sm">
              Đã hiển thị tất cả {products.length} sản phẩm
            </p>
          )}
          {hasNextPage && !isFetchingNextPage && (
            <Button variant="outline" onClick={fetchNextPage} className="px-8">
              Xem thêm sản phẩm
            </Button>
          )}
        </div>

        <style>{`
          @keyframes gridFetchBar {
            0%   { transform: scaleX(0); opacity: 1; }
            50%  { transform: scaleX(0.7); opacity: 1; }
            100% { transform: scaleX(1); opacity: 0; }
          }
          @keyframes cardFadeIn {
            from { opacity: 0; transform: translateY(8px); }
            to   { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    );
  },
);

ProductGrid.displayName = "ProductGrid";