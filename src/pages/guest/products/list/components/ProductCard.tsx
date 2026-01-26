import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { PATH_GUEST } from "@/routes/path";
import { TMenuProductListResponse } from "@/schemas/menu-product.schema";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ImageOff, ShoppingCart } from "lucide-react";
import { useState, useEffect, useRef } from "react";

const ProductCard = (product: TMenuProductListResponse) => {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const images = product.images || [];
  const hasMultipleImages = images.length > 1;

  // Auto-slide images when hovering
  useEffect(() => {
    if (isHovering && hasMultipleImages) {
      intervalRef.current = setInterval(() => {
        setCurrentImageIndex((prevIndex) => 
          prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
      }, 1000); // Slide every 1 second
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setCurrentImageIndex(0); // Reset to first image when not hovering
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isHovering, hasMultipleImages, images.length]);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toast.success(`Đã thêm "${product.name}" vào giỏ hàng`);
  };

  return (
    <div
      className="product-card group block cursor-pointer"
      onClick={() => navigate(PATH_GUEST.products.detail(product.id))}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-square bg-cream overflow-hidden">
        {images.length > 0 ? (
          <div className="relative w-full h-full">
            {images.map((image, index) => (
              <img
                key={image.id}
                src={image.url}
                alt={image.altText || product.name}
                className={`absolute inset-0 w-full h-full object-contain p-4 transition-all duration-500 ${
                  index === currentImageIndex 
                    ? 'opacity-100 translate-x-0' 
                    : index < currentImageIndex
                    ? 'opacity-0 -translate-x-full'
                    : 'opacity-0 translate-x-full'
                } ${isHovering ? 'scale-110' : 'scale-100'}`}
              />
            ))}
            
            {/* Image indicators */}
            {hasMultipleImages && (
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                {images.map((_, index) => (
                  <div
                    key={index}
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                      index === currentImageIndex 
                        ? 'bg-primary w-4' 
                        : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center w-full h-full">
            <ImageOff className="w-10 h-10 text-gray-300" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Product Name */}
        <h3 className="font-medium text-foreground text-sm leading-tight line-clamp-2 min-h-[2.5rem] mb-2 group-hover:text-primary transition-colors">
          {product.name}
        </h3>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-2">
          <span className="price-sale text-lg">
            {formatPrice(product.price)}
          </span>
        </div>

        {/* Add to Cart Button */}
        <Button
          variant="outline"
          className="w-full btn-add-cart"
          onClick={handleAddToCart}
        >
          <ShoppingCart size={16} className="mr-2" />
          Chọn mua
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;