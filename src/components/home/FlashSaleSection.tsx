import { useRef } from "react";
import { ChevronLeft, ChevronRight, Zap } from "lucide-react";
// import { flashSaleProducts } from "@/data/mockData";
import ProductCard from "@/pages/guest/products/list/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const FlashSaleSection = () => {
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

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6 p-4 bg-secondary rounded-lg">
        <div className="flex items-center gap-2">
          <Zap className="text-sale fill-sale" size={24} />
          <h2 className="text-xl font-bold text-sale uppercase">
            Flash Sale - Chính Hãng 100%
          </h2>
        </div>
        <Link to="/sale">
          <Button className="view-all-btn">Xem tất cả</Button>
        </Link>
      </div>

      {/* Products Carousel */}
      <div className="relative">
        <button
          onClick={() => scroll("left")}
          className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-background shadow-lg rounded-full flex items-center justify-center hover:bg-muted transition-colors"
        >
          <ChevronLeft size={20} />
        </button>

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-4"
        >
          {/* {flashSaleProducts.map((product, index) => (
            <div
              key={product.id}
              className="min-w-[250px] max-w-[250px] animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <ProductCard product={product} />
            </div>
          ))} */}
        </div>

        <button
          onClick={() => scroll("right")}
          className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-background shadow-lg rounded-full flex items-center justify-center hover:bg-muted transition-colors"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default FlashSaleSection;
