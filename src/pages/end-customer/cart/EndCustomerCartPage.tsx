import { PageLoader } from "@/components/LoadingScreen";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/hooks/use-cart";
import { usePromotionRule } from "@/hooks/use-promotion-rule";
import { handleApiError } from "@/lib/error";
import { formatPrice } from "@/lib/utils";
import { PATH_END_CUSTOMER, PATH_GUEST } from "@/routes/path";
import { TGetCustomerCartItemsResponse } from "@/schemas/cart.schema";
import {
  ArrowRight,
  Gift,
  ImageOff,
  Loader2,
  Minus,
  Plus,
  ShoppingCart,
  Tag,
  Trash2,
  X
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { ApplicablePromotionsSheet } from "./components/ApplicablePromotionsSheet";



const EndCustomerCartPage = () => {
  const { getEndCustomerCart, updateEndCustomerCart } = useCart();
  const { getApplicablePromotionRules } = usePromotionRule();

  const [promoCode, setPromoCode] = useState("");
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [applyingId, setApplyingId] = useState<string | null>(null);

  const {
    data: cartData,
    error: cartError,
    isError: isCartError,
    isLoading: isCartLoading,
  } = getEndCustomerCart();

  const updateCartMutation = updateEndCustomerCart();
  const { data: applicableData, isLoading: isApplicableLoading } =
    getApplicablePromotionRules({
      isAllowFetch: sheetOpen && cartData?.data?.data != null,
    });
  const applicablePromotions = applicableData?.data?.data ?? [];

  // Chỉ fetch applicable promotions khi sheet mở

  if (isCartLoading) return <PageLoader />;
  if (isCartError && cartError) handleApiError(cartError);

  const cart = cartData?.data?.data;

  // ── Helpers ────────────────────────────────────────────────────────────────
  const buildCurrentItems = () =>
    cart?.items
      .filter((i) => !i.isGiftItem)
      .map((i) => ({
        productId: i.productId,
        productImageUrlSnapshot: i.productImageUrlSnapshot,
        quantity: i.quantity,
      })) ?? [];

  const buildCurrentPromotions = () =>
    cart?.appliedPromotions.map((p) => ({
      promotionRuleId: p.promotionId,
      promotionRuleCode: p.promotionRuleCode,
      promotionRuleNameSnapshot: p.promotionRuleNameSnapshot,
      discountAmountApplied: p.discountAmountApplied,
    })) ?? [];

  const buildBasePayload = () => ({
    cartId: cart?.id,
    customerNote: cart?.customerNote,
    items: buildCurrentItems(),
  });

  const giftItems = cart?.items.filter((i) => i.isGiftItem) ?? [];
  const nonGiftItems = cart?.items.filter((i) => !i.isGiftItem) ?? [];
  const totalNonGiftItems = nonGiftItems.reduce(
    (sum, i) => sum + i.quantity,
    0,
  );

  const giftByPromotion = giftItems.reduce<
    Record<string, TGetCustomerCartItemsResponse[]>
  >((acc, item) => {
    const key = item.promotionId ?? "unknown";
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  const assignedPromotions = new Set<string>();

  // Promotions đã apply (để hiện dấu check trong sheet)
  const appliedPromotionIds = new Set(
    cart?.appliedPromotions.map((p) => p.promotionId) ?? [],
  );

  // ── Handlers ───────────────────────────────────────────────────────────────
  const removeItem = async (productId: string) => {
    if (!cart) return;
    try {
      await updateCartMutation.mutateAsync({
        ...buildBasePayload(),
        items: buildCurrentItems().filter((i) => i.productId !== productId),
        appliedPromotions: buildCurrentPromotions(),
      });
      toast.success("Đã xóa sản phẩm khỏi giỏ hàng");
    } catch (error) {
      handleApiError(error);
    }
  };

  const updateQuantity = async (productId: string, newQuantity: number) => {
    if (!cart) return;
    if (newQuantity < 1) {
      removeItem(productId);
      return;
    }
    try {
      await updateCartMutation.mutateAsync({
        ...buildBasePayload(),
        items: buildCurrentItems().map((i) =>
          i.productId === productId ? { ...i, quantity: newQuantity } : i,
        ),
        appliedPromotions: buildCurrentPromotions(),
      });
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleApplyPromo = async () => {
    if (!promoCode.trim() || !cart) return;
    setIsApplyingPromo(true);
    try {
      const result = await updateCartMutation.mutateAsync({
        ...buildBasePayload(),
        promotionCodeToApply: promoCode.trim(),
      });
      if (result.data.status >= 200 && result.data.status < 300) {
        toast.success("Áp dụng mã khuyến mãi thành công!");
        setPromoCode("");
      } else {
        toast.error(result.data.message || "Áp dụng mã khuyến mãi thất bại");
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsApplyingPromo(false);
    }
  };

  // Áp dụng promotion được chọn từ sheet (dùng Code)
  const handleApplyFromSheet = async (
    promotionCode: string,
    promotionId: string,
  ) => {
    if (!cart) return;
    setApplyingId(promotionId);
    try {
      const result = await updateCartMutation.mutateAsync({
        ...buildBasePayload(),
        promotionCodeToApply: promotionCode,
      });
      if (result.data.status >= 200 && result.data.status < 300) {
        toast.success("Áp dụng khuyến mãi thành công!");
        setSheetOpen(false);
      } else {
        toast.error(result.data.message || "Không thể áp dụng khuyến mãi này");
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setApplyingId(null);
    }
  };

  const handleRemovePromo = async (promotionId: string) => {
    if (!cart) return;
    try {
      await updateCartMutation.mutateAsync({
        ...buildBasePayload(),
        appliedPromotions: buildCurrentPromotions().filter(
          (p) => p.promotionRuleId !== promotionId,
        ),
      });
      toast.success("Đã xóa mã khuyến mãi");
    } catch (error) {
      handleApiError(error);
    }
  };

  // ── Sub-components ─────────────────────────────────────────────────────────
  const GiftItemCard = ({ item }: { item: TGetCustomerCartItemsResponse }) => (
    <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-md px-3 py-2 mt-2">
      <Gift size={14} className="text-green-600 shrink-0" />
      {item.productImageUrlSnapshot ? (
        <img
          src={item.productImageUrlSnapshot}
          alt={item.productNameSnapshot}
          className="w-10 h-10 rounded object-cover shrink-0"
        />
      ) : (
        <div className="w-10 h-10 bg-green-100 rounded flex items-center justify-center shrink-0">
          <Gift size={14} className="text-green-400" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-green-800 line-clamp-1">
          {item.productNameSnapshot}
        </p>
        <p className="text-xs text-green-600">x{item.quantity} • Miễn phí</p>
      </div>
      <span className="text-xs font-semibold text-green-700 shrink-0">0đ</span>
    </div>
  );

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-4 sm:mb-8 flex items-center gap-2 sm:gap-3">
          <ShoppingCart size={24} className="sm:w-7 sm:h-7" />
          Giỏ hàng của bạn
          {totalNonGiftItems > 0 && (
            <span className="text-sm sm:text-base font-normal text-muted-foreground">
              ({totalNonGiftItems} sản phẩm)
            </span>
          )}
        </h1>

        {!cart || nonGiftItems.length === 0 ? (
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-3">
              {nonGiftItems.map((item, index) => {
                const giftsForThisItem: TGetCustomerCartItemsResponse[] = [];
                for (const [promoId, gifts] of Object.entries(
                  giftByPromotion,
                )) {
                  if (!assignedPromotions.has(promoId)) {
                    giftsForThisItem.push(...gifts);
                    assignedPromotions.add(promoId);
                  }
                }
                return (
                  <div key={item.productId}>
                    <div
                      className="bg-card rounded-lg p-3 sm:p-4 flex gap-3 sm:gap-4 shadow-sm"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      {item.productImageUrlSnapshot ? (
                        <img
                          src={item.productImageUrlSnapshot}
                          alt={item.productNameSnapshot}
                          className="w-16 h-16 sm:w-24 sm:h-24 rounded-lg object-cover shrink-0"
                        />
                      ) : (
                        <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                          <ImageOff size={20} className="text-gray-400" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        {" "}
                        {/* min-w-0 tránh overflow */}
                        <h3 className="font-medium text-foreground mb-1 sm:mb-2 line-clamp-2 text-sm sm:text-base">
                          {item.productNameSnapshot}
                        </h3>
                        <span className="font-bold text-primary text-sm sm:text-base">
                          {formatPrice(item.unitPriceSnapshot)}
                        </span>
                      </div>
                      <div className="flex flex-col items-end justify-between shrink-0">
                        <button
                          onClick={() => removeItem(item.productId)}
                          className="text-muted-foreground hover:text-destructive transition-colors"
                          disabled={updateCartMutation.isPending}
                        >
                          <Trash2
                            size={16}
                            className="sm:w-[18px] sm:h-[18px]"
                          />
                        </button>
                        <div className="flex items-center border border-border rounded">
                          <button
                            className="p-1.5 sm:p-2 hover:bg-muted"
                            onClick={() =>
                              updateQuantity(item.productId, item.quantity - 1)
                            }
                            disabled={updateCartMutation.isPending}
                          >
                            <Minus
                              size={12}
                              className="sm:w-[14px] sm:h-[14px]"
                            />
                          </button>
                          <span className="w-6 sm:w-8 text-center text-xs sm:text-sm">
                            {item.quantity}
                          </span>
                          <button
                            className="p-1.5 sm:p-2 hover:bg-muted"
                            onClick={() =>
                              updateQuantity(item.productId, item.quantity + 1)
                            }
                            disabled={updateCartMutation.isPending}
                          >
                            <Plus
                              size={12}
                              className="sm:w-[14px] sm:h-[14px]"
                            />
                          </button>
                        </div>
                      </div>
                    </div>

                    {giftsForThisItem.length > 0 && (
                      <div className="ml-2 sm:ml-4 space-y-1">
                        {giftsForThisItem.map((gift) => (
                          <GiftItemCard
                            key={`${gift.productId}-${gift.promotionId}`}
                            item={gift}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* ── Order Summary ─────────────────────────────────── */}
            <div className="bg-card rounded-lg p-4 sm:p-6 shadow-sm h-fit space-y-4 lg:sticky lg:top-4">
              <h2 className="font-bold text-lg">Tóm tắt đơn hàng</h2>

              {/* Promotion section */}
              <div className="space-y-2">
                <p className="text-sm font-medium flex items-center gap-1.5">
                  <Tag size={14} />
                  Mã khuyến mãi
                </p>

                {/* Input nhập code thủ công */}
                <div className="flex gap-2">
                  <Input
                    placeholder="Hoặc nhập mã trực tiếp"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    onKeyDown={(e) => e.key === "Enter" && handleApplyPromo()}
                    disabled={isApplyingPromo}
                    className="font-mono text-sm"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleApplyPromo}
                    disabled={!promoCode.trim() || isApplyingPromo}
                    className="shrink-0"
                  >
                    {isApplyingPromo ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      "Áp dụng"
                    )}
                  </Button>
                </div>

                {/* Nút xem applicable promotions */}
                <ApplicablePromotionsSheet
                  sheetOpen={sheetOpen}
                  setSheetOpen={setSheetOpen}
                  isApplicableLoading={isApplicableLoading}
                  applicableData={applicableData}
                  applicablePromotions={applicablePromotions}
                  appliedPromotionIds={appliedPromotionIds}
                  applyingId={applyingId}
                  updateCartMutation={updateCartMutation}
                  handleApplyFromSheet={handleApplyFromSheet}
                />
                {/* Applied promotions list */}
                {cart.appliedPromotions.length > 0 && (
                  <div className="space-y-1.5 mt-2">
                    {cart.appliedPromotions.map((promo) => (
                      <div
                        key={promo.promotionId}
                        className="flex items-center justify-between bg-green-50 border border-green-200 rounded-md px-3 py-1.5 text-sm"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <Tag size={12} className="text-green-600 shrink-0" />
                          <div className="min-w-0">
                            <p className="font-mono font-semibold text-green-700 truncate">
                              {promo.promotionRuleCode}
                            </p>
                            <p className="text-xs text-green-600 truncate">
                              {promo.promotionRuleNameSnapshot}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0 ml-2">
                          <span className="text-green-700 font-medium text-xs">
                            {promo.discountAmountApplied > 0
                              ? `-${formatPrice(promo.discountAmountApplied)}`
                              : "Quà tặng 🎁"}
                          </span>
                          <button
                            onClick={() => handleRemovePromo(promo.promotionId)}
                            disabled={updateCartMutation.isPending}
                            className="text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Price breakdown */}
              <div className="space-y-3 text-sm border-t pt-4">
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
                {cart.totalOrderDiscount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Giảm giá</span>
                    <span>-{formatPrice(cart.totalOrderDiscount)}</span>
                  </div>
                )}
                {giftItems.length > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span className="flex items-center gap-1">
                      <Gift size={12} />
                      Quà tặng
                    </span>
                    <span>
                      {giftItems.reduce((s, i) => s + i.quantity, 0)} sản phẩm
                    </span>
                  </div>
                )}
                <div className="border-t pt-3 flex justify-between font-bold text-lg">
                  <span>Tổng cộng</span>
                  <span className="text-primary">
                    {formatPrice(cart.totalAmount)}
                  </span>
                </div>
              </div>

              <Link to={PATH_END_CUSTOMER.checkout}>
                <Button className="w-full bg-primary hover:bg-primary/90 font-bold py-6">
                  Tiến hành thanh toán
                  <ArrowRight size={18} className="ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default EndCustomerCartPage;
