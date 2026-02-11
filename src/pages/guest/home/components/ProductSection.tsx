// components/home/ProductSection.tsx
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "@/pages/guest/products/list/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { TMenuProductListResponse } from "@/schemas/menu-product.schema";

interface ProductSectionProps {
  title: string;
  products: TMenuProductListResponse[];
  categoryId?: string;
  showCarousel?: boolean;
}

const ProductSection = ({ 
  title, 
  products, 
  categoryId,
  showCarousel = true 
}: ProductSectionProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 ">
      {/* Category Header */}
      <div className="category-header mb-8 bg-primary text-primary-foreground">
        {title}
      </div>

      {/* Products */}
      <div className="relative">
        {showCarousel && products.length > 5 && (
          <button
            onClick={() => scroll("left")}
            className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-background shadow-lg rounded-full flex items-center justify-center hover:bg-muted transition-colors"
            aria-label="Scroll left"
          >
            <ChevronLeft size={20} />
          </button>
        )}

        <div
          ref={scrollRef}
          className={
            showCarousel 
              ? "flex gap-4 overflow-x-auto scrollbar-hide pb-4" 
              : "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
          }
        >
          {products.map((product, index) => (
            <div
              key={product.id}
              className={
                showCarousel 
                  ? "min-w-[250px] max-w-[250px] animate-fade-in" 
                  : "animate-fade-in"
              }
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <ProductCard {...product} />
            </div>
          ))}
        </div>

        {showCarousel && products.length > 5 && (
          <button
            onClick={() => scroll("right")}
            className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-background shadow-lg rounded-full flex items-center justify-center hover:bg-muted transition-colors"
            aria-label="Scroll right"
          >
            <ChevronRight size={20} />
          </button>
        )}
      </div>

      {/* View All Button */}
      {categoryId && (
        <div className="flex justify-center mt-8">
          <Link to={`/products?categoryId=${categoryId}`}>
            <Button variant="outline" className="btn-add-cart px-8">
              Xem tất cả <span className="font-bold ml-1">{title.toLowerCase()}</span>
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default ProductSection;