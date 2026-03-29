import { Button } from "@/components/ui/button";
import { useCartContext } from "@/contexts/CartContext";
import { formatPrice } from "@/lib/utils";
import { RootState } from "@/redux/store";
import { PATH_AUTH, PATH_GUEST } from "@/routes/path";
import { TMenuProductListResponse } from "@/schemas/menu-product.schema";
import { ImageOff, ShoppingCart } from "lucide-react";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const ProductCard = memo(
  (product: TMenuProductListResponse) => {
    const navigate = useNavigate();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isHovering, setIsHovering] = useState(false);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const { isAuthenticated } = useSelector((state: RootState) => state.user);
    const { cartData, updateCartMutation } = useCartContext();

    const images = product.images || [];
    const hasMultipleImages = images.length > 1;

    // Auto-slide on hover
    useEffect(() => {
      if (isHovering && hasMultipleImages) {
        intervalRef.current = setInterval(() => {
          setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
        }, 1000);
      } else {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        // Reset to first image when not hovering
        setCurrentImageIndex(0);
      }
      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    }, [isHovering, hasMultipleImages, images.length]);

    const handleAddToCart = useCallback(
      async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isAuthenticated) {
          toast.error("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng");
          navigate(PATH_AUTH.login, { state: { from: window.location.pathname } });
          return;
        }

        try {
          const currentCart = cartData?.data?.data;
          const currentItems = (currentCart?.items || []).filter((item) => !item.isGiftItem);
          const existingItemIndex = currentItems.findIndex((item) => item.productId === product.id);

          const updatedItems =
            existingItemIndex >= 0
              ? currentItems.map((item, i) => ({
                  productId: item.productId,
                  productImageUrlSnapshot: item.productImageUrlSnapshot,
                  quantity: i === existingItemIndex ? item.quantity + 1 : item.quantity,
                }))
              : [
                  ...currentItems.map((item) => ({
                    productId: item.productId,
                    productImageUrlSnapshot: item.productImageUrlSnapshot,
                    quantity: item.quantity,
                  })),
                  {
                    productId: product.id,
                    productImageUrlSnapshot: images.length > 0 ? images[0].url : null,
                    quantity: 1,
                  },
                ];

          await updateCartMutation.mutateAsync({
            cartId: currentCart?.id,
            items: updatedItems,
            customerNote: currentCart?.customerNote || null,
            appliedPromotions:
              currentCart?.appliedPromotions.map((promo) => ({
                promotionRuleId: promo.promotionId,
                promotionRuleCode: promo.promotionRuleCode,
                promotionRuleNameSnapshot: promo.promotionRuleNameSnapshot,
                discountAmountApplied: promo.discountAmountApplied,
              })) || [],
          });

          toast.success(`Đã thêm "${product.name}" vào giỏ hàng`);
        } catch (error: any) {
          toast.error(error?.response?.data?.message || "Không thể thêm vào giỏ hàng");
        }
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [isAuthenticated, cartData, product.id, images, updateCartMutation],
    );

    const handleClick = useCallback(
      () => navigate(PATH_GUEST.products.detail(product.id)),
      [navigate, product.id],
    );

    return (
      <div
        className="product-card group block cursor-pointer"
        onClick={handleClick}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* Image container */}
        <div className="relative aspect-square bg-cream overflow-hidden">
          {images.length > 0 ? (
            <div className="relative w-full h-full">
              {images.map((image, index) => (
                <img
                  key={image.id}
                  src={image.url}
                  alt={image.altText || product.name}
                  /*
                    PERF: Only first image is eager+high-priority.
                    Others are lazy so they don't block LCP or
                    compete for bandwidth on initial page load.
                  */
                  loading={index === 0 ? "eager" : "lazy"}
                  decoding={index === 0 ? "sync" : "async"}
                  {...({
                    fetchpriority: index === 0 ? "high" : "low",
                  } as React.HTMLAttributes<HTMLImageElement>)}
                  className="absolute inset-0 w-full h-full object-contain p-4"
                  style={{
                    /*
                      PERF: Use opacity+transform instead of class toggle.
                      Both are compositor-only — no layout reflow.
                      scale on hover also runs on GPU.
                    */
                    opacity: index === currentImageIndex ? 1 : 0,
                    transform: `
                      translateX(${
                        index === currentImageIndex ? 0 : index < currentImageIndex ? -100 : 100
                      }%)
                      scale(${isHovering ? 1.08 : 1})
                    `,
                    transition: "opacity 0.4s ease, transform 0.5s ease",
                    willChange: index === currentImageIndex ? "transform" : "auto",
                  }}
                />
              ))}

              {/* Slide indicators */}
              {hasMultipleImages && (
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                  {images.map((_, index) => (
                    <div
                      key={index}
                      className="h-1.5 rounded-full transition-all duration-300"
                      style={{
                        width: index === currentImageIndex ? "1rem" : "0.375rem",
                        background:
                          index === currentImageIndex
                            ? "hsl(var(--primary))"
                            : "hsl(var(--muted-foreground) / 0.4)",
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center w-full h-full">
              <ImageOff className="w-10 h-10 text-muted-foreground/30" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-medium text-foreground text-sm leading-tight line-clamp-2 min-h-[2.5rem] mb-2 group-hover:text-primary transition-colors duration-150">
            {product.name}
          </h3>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="price-sale text-lg">{formatPrice(product.price)}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full btn-add-cart"
            onClick={handleAddToCart}
            disabled={updateCartMutation.isPending}
          >
            <ShoppingCart size={15} className="mr-2" />
            {updateCartMutation.isPending ? "Đang thêm..." : "Chọn mua"}
          </Button>
        </div>
      </div>
    );
  },
  // Custom comparator: only re-render if product data actually changed
  // Prevents parent list re-renders from cascading into every card
  (prev, next) =>
    prev.id === next.id &&
    prev.price === next.price &&
    prev.name === next.name &&
    prev.images === next.images,
);

ProductCard.displayName = "ProductCard";

export default ProductCard;