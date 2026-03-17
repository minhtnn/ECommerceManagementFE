import { Button } from "@/components/ui/button";
import { useCartContext } from "@/contexts/CartContext";
import { useProduct } from "@/hooks/use-product";
import { handleApiError } from "@/lib/error";
import { formatPrice } from "@/lib/utils";
import { RootState } from "@/redux/store";
import { PATH_AUTH } from "@/routes/path";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Minus,
  Plus,
  RotateCcw,
  Share2,
  Shield,
  ShoppingCart,
  Truck,
} from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const ProductDetailPage = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state: RootState) => state.user);

  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { getPublicProductById } = useProduct();

  const {
    data: productData,
    error: productError,
    isError: isProductError,
    isLoading,
  } = getPublicProductById(productId as string);

  if (isProductError && productError) {
    handleApiError(productError);
  }

  const product = productData?.data.data;
  const images = product?.getProductImagesResponse || [];
  const hasMultipleImages = images.length > 1;

  const { cartData, updateCartMutation } = useCartContext();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng");
      navigate(PATH_AUTH.login, { state: { from: window.location.pathname } });
      return;
    }

    try {
      const currentCart = cartData?.data?.data;

      // Lọc bỏ gift items
      const currentItems = (currentCart?.items || []).filter(
        (item) => !item.isGiftItem,
      );

      const existingItemIndex = currentItems.findIndex(
        (item) => item.productId === product.id,
      );

      let updatedItems;

      if (existingItemIndex >= 0) {
        updatedItems = currentItems.map((item, index) => ({
          productId: item.productId,
          productImageUrlSnapshot: item.productImageUrlSnapshot,
          quantity:
            index === existingItemIndex
              ? item.quantity + quantity // cộng đúng quantity đang chọn
              : item.quantity,
        }));
      } else {
        updatedItems = [
          ...currentItems.map((item) => ({
            productId: item.productId,
            productImageUrlSnapshot: item.productImageUrlSnapshot,
            quantity: item.quantity,
          })),
          {
            productId: product.id,
            productImageUrlSnapshot:
              images.length > 0 ? images[0].imageUrl : null,
            quantity: quantity,
          },
        ];
      }

      await updateCartMutation.mutateAsync({
        cartId: currentCart?.id,
        items: updatedItems,
        customerNote: currentCart?.customerNote || null,
        appliedPromotions:
          currentCart?.appliedPromotions?.map((promo) => ({
            promotionRuleId: promo.promotionId,
            promotionRuleCode: promo.promotionRuleCode,
            promotionRuleNameSnapshot: promo.promotionRuleNameSnapshot,
            discountAmountApplied: promo.discountAmountApplied,
          })) || [],
      });

      toast.success(`Đã thêm "${product.name}" vào giỏ hàng`);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Không thể thêm vào giỏ hàng",
      );
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  if (isLoading || !product) {
    return (
      <>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
        </div>
      </>
    );
  }

  return (
    <>
      {/* Product Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Image Gallery */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative bg-cream rounded-lg p-8 aspect-square flex items-center justify-center overflow-hidden group">
            {images.length > 0 ? (
              <>
                <img
                  src={images[currentImageIndex].imageUrl}
                  alt={images[currentImageIndex].altText || product.name}
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                  className="max-w-full max-h-full object-contain animate-scale-in"
                />

                {/* Navigation Arrows */}
                {hasMultipleImages && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ChevronLeft className="w-6 h-6 text-gray-700" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ChevronRight className="w-6 h-6 text-gray-700" />
                    </button>
                  </>
                )}

                {/* Image Counter */}
                {hasMultipleImages && (
                  <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                    {currentImageIndex + 1} / {images.length}
                  </div>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-lg">
                <span className="text-gray-500">Không có ảnh</span>
              </div>
            )}
          </div>

          {/* Thumbnail Images */}
          {hasMultipleImages && (
            <div className="grid grid-cols-5 gap-2">
              {images.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                    index === currentImageIndex
                      ? "border-primary shadow-md"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <img
                    src={image.imageUrl}
                    alt={image.altText || `${product.name} - ${index + 1}`}
                    loading="lazy"
                    decoding="async"
                    fetchPriority="low"
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="animate-fade-in">
          {/* Category Badge */}
          {product.productCategoryName && (
            <span className="inline-block bg-gray-100 text-gray-700 text-sm font-medium px-3 py-1 rounded-full mb-4">
              {product.productCategoryName}
            </span>
          )}

          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            {product.fullName || product.name}
          </h1>

          {/* Product Code */}
          {product.code && (
            <p className="text-sm text-muted-foreground mb-4">
              Mã SP: {product.code}
            </p>
          )}

          {/* Stock Status */}
          <div className="mb-6">
            {product.stockQuantity > 0 ? (
              <span className="text-green-600 font-medium">
                ✓ Còn hàng ({product.stockQuantity} sản phẩm)
              </span>
            ) : (
              <span className="text-red-600 font-medium">✗ Hết hàng</span>
            )}
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-4 mb-6">
            <span className="text-3xl font-bold text-primary">
              {formatPrice(product.price)}
            </span>
          </div>

          {/* Description */}
          {product.description && (
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Mô tả:</h3>
              <p className="text-muted-foreground">{product.description}</p>
            </div>
          )}

          {/* Quantity */}
          <div className="flex items-center gap-4 mb-6">
            <span className="font-medium">Số lượng:</span>
            <div className="flex items-center border border-border rounded-lg">
              <button
                className="p-3 hover:bg-muted transition-colors disabled:opacity-50"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                <Minus size={16} />
              </button>
              <span className="w-12 text-center font-medium">{quantity}</span>
              <button
                className="p-3 hover:bg-muted transition-colors disabled:opacity-50"
                onClick={() => setQuantity(quantity + 1)}
                disabled={quantity >= product.stockQuantity}
              >
                <Plus size={16} />
              </button>
            </div>
            <span className="text-sm text-muted-foreground">
              (Tối đa: {product.stockQuantity})
            </span>
          </div>

          {/* Actions */}
          <div className="flex gap-4 mb-8">
            <Button
              size="lg"
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-6"
              onClick={handleAddToCart}
              disabled={product.stockQuantity === 0}
            >
              <ShoppingCart size={20} className="mr-2" />
              Thêm vào giỏ hàng
            </Button>
            <Button variant="outline" size="lg" className="px-4">
              <Heart size={20} />
            </Button>
            <Button variant="outline" size="lg" className="px-4">
              <Share2 size={20} />
            </Button>
          </div>

          {/* NEW: Side Attributes Section */}
          {product.getProductSideAttributesResponse &&
            product.getProductSideAttributesResponse.length > 0 && (
              <div className="border-t border-border pt-6 mt-6">
                <h3 className="font-semibold mb-4">Mô tả chi tiết:</h3>
                <div className="grid grid-cols-2 gap-3">
                  {product.getProductSideAttributesResponse.map((attr) => (
                    <div
                      key={attr.id}
                      className="flex justify-between items-center bg-gray-50 rounded-lg p-3"
                    >
                      <span className="text-sm text-muted-foreground">
                        {attr.key}:
                      </span>
                      <span className="text-sm font-medium">{attr.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          {/* Features */}
          <div className="space-y-3 border-t border-border pt-6 mt-6">
            <div className="flex items-center gap-3 text-sm">
              <Truck size={20} className="text-primary" />
              <span>Giao hàng toàn quốc - Freeship đơn từ 399.000đ</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Shield size={20} className="text-primary" />
              <span>Sản phẩm chính hãng 100%</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <RotateCcw size={20} className="text-primary" />
              <span>Đổi trả trong 7 ngày nếu lỗi từ nhà sản xuất</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetailPage;
