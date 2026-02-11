import { ShoppingCart, Trash2, Minus, Plus, ArrowRight, ImageOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { Link } from "react-router-dom";
import EndUserLayout from "@/layouts/EndUserLayout";
import { useCart } from "@/hooks/use-cart";
import { handleApiError } from "@/lib/error";
import { toast } from "sonner";
import { PATH_END_CUSTOMER, PATH_GUEST } from "@/routes/path";
import { PageLoader } from "@/components/LoadingScreen";

const EndCustomerCartPage = () => {
  const { getEndCustomerCart, updateEndCustomerCart } = useCart();

  const {
    data: cartData,
    error: cartError,
    isError: isCartError,
    isLoading: isCartLoading,
  } = getEndCustomerCart();

  const updateCartMutation = updateEndCustomerCart();

  if(isCartLoading){
    return <PageLoader/>;
  }

  if (isCartError && cartError) {
    handleApiError(cartError);
  }

  const cart = cartData?.data?.data;

  const removeItem = async (productId: string) => {
    if (!cart) return;

    try {
      // Remove item by filtering out
      const updatedItems = cart.items
        .filter((item) => item.productId !== productId)
        .map((item) => ({
          productId: item.productId,
          productNameSnapshot: item.productNameSnapshot,
          quantity: item.quantity,
          unitPriceSnapshot: item.unitPriceSnapshot,
        }));

      await updateCartMutation.mutateAsync({
        items: updatedItems,
        customerNote: cart.customerNote,
        appliedPromotions: cart.appliedPromotions?.map((promo) => ({
          promotionId: promo.promotionId,
          promotionRuleNameSnapshot: promo.promotionRuleNameSnapshot,
          discountAmountApplied: promo.discountAmountApplied,
        })),
      });

      toast.success("Đã xóa sản phẩm khỏi giỏ hàng");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Không thể xóa sản phẩm");
    }
  };

  const updateQuantity = async (productId: string, newQuantity: number) => {
    if (!cart) return;
    if (newQuantity < 1) {
      removeItem(productId);
      return;
    }

    try {
      const updatedItems = cart.items.map((item) =>
        item.productId === productId
          ? {
              productId: item.productId,
              productNameSnapshot: item.productNameSnapshot,
              quantity: newQuantity,
              unitPriceSnapshot: item.unitPriceSnapshot,
            }
          : {
              productId: item.productId,
              productNameSnapshot: item.productNameSnapshot,
              quantity: item.quantity,
              unitPriceSnapshot: item.unitPriceSnapshot,
            }
      );

      await updateCartMutation.mutateAsync({
        items: updatedItems,
        customerNote: cart.customerNote,
        appliedPromotions: cart.appliedPromotions?.map((promo) => ({
          promotionId: promo.promotionId,
          promotionRuleNameSnapshot: promo.promotionRuleNameSnapshot,
          discountAmountApplied: promo.discountAmountApplied,
        })),
      });
    } catch (error) {
      toast.error("Không thể cập nhật số lượng");
    }
  };

  return (
    <EndUserLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-8 flex items-center gap-3">
          <ShoppingCart size={28} />
          Giỏ hàng của bạn
        </h1>

        {isCartLoading ? (
          <p>Đang tải giỏ hàng...</p>
        ) : !cart || cart.items.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingCart
              size={64}
              className="mx-auto text-muted-foreground mb-4"
            />
            <p className="text-xl text-muted-foreground mb-6">Giỏ hàng trống</p>
            <Link to={PATH_GUEST.products.root}>
              <Button className="bg-primary hover:bg-primary/90">
                Tiếp tục mua sắm
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.items.map((item, index) => (
                <div
                  key={item.productId}
                  className="bg-card rounded-lg p-4 flex gap-4 shadow-sm animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.productNameSnapshot}
                      className="w-24 h-24 object-contain bg-cream rounded-lg"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                      <ImageOff size={24} className="text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground mb-2 line-clamp-2">
                      {item.productNameSnapshot}
                    </h3>
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-primary">
                        {formatPrice(item.unitPriceSnapshot)}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <button
                      onClick={() => removeItem(item.productId)}
                      className="text-muted-foreground hover:text-destructive transition-colors"
                      disabled={updateCartMutation.isPending}
                    >
                      <Trash2 size={18} />
                    </button>
                    <div className="flex items-center border border-border rounded">
                      <button
                        className="p-2 hover:bg-muted"
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity - 1)
                        }
                        disabled={updateCartMutation.isPending}
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center text-sm">
                        {item.quantity}
                      </span>
                      <button
                        className="p-2 hover:bg-muted"
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity + 1)
                        }
                        disabled={updateCartMutation.isPending}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div
              className="bg-card rounded-lg p-6 shadow-sm h-fit animate-fade-in"
              style={{ animationDelay: "0.2s" }}
            >
              <h2 className="font-bold text-lg mb-4">Tóm tắt đơn hàng</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tạm tính</span>
                  <span>{formatPrice(cart.totalAmountWithoutDiscount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phí vận chuyển</span>
                  <span>
                    {cart.totalOrderShippingFee === 0
                      ? "Miễn phí"
                      : formatPrice(cart.totalOrderShippingFee)}
                  </span>
                </div>
                {cart.totalOrderShippingFee > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Mua thêm{" "}
                    {formatPrice(399000 - cart.totalAmountWithoutDiscount)} để
                    được freeship
                  </p>
                )}
                {cart.appliedPromotions.length > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Giảm giá</span>
                    <span className="text-primary">
                      -{formatPrice(cart.totalOrderDiscount)}
                    </span>
                  </div>
                )}
                <div className="border-t border-border pt-3 flex justify-between font-bold text-lg">
                  <span>Tổng cộng</span>
                  <span className="text-primary">
                    {formatPrice(cart.totalAmount)}
                  </span>
                </div>
              </div>
              <Link to={PATH_END_CUSTOMER.checkout}>
                <Button className="w-full mt-6 bg-primary hover:bg-primary/90 font-bold py-6">
                  Tiến hành thanh toán
                  <ArrowRight size={18} className="ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </EndUserLayout>
  );
};

export default EndCustomerCartPage;