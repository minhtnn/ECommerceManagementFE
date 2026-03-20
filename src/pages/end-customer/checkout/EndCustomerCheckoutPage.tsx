import { PageLoader } from "@/components/LoadingScreen";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/hooks/use-cart";
import { useCustomer } from "@/hooks/use-customer";
import { useOrder } from "@/hooks/use-order";
import { usePayment } from "@/hooks/use-payment";
import { handleApiError } from "@/lib/error";
import { formatPrice } from "@/lib/utils";
import { PATH_END_CUSTOMER, PATH_GUEST } from "@/routes/path";
import { TCustomerAddressListResponse } from "@/schemas/customer.schema";
import {
  TCreateOrderRequest,
  TCreateOrderResponse,
} from "@/schemas/order.schema";
import { EOrderStatus } from "@/types/enums/order-status.enum";
import {
  ChevronLeft,
  CreditCard,
  Edit,
  Gift,
  ImageOff,
  Loader2,
  MapPin,
  Phone,
  Plus,
  Star,
  Tag,
  Truck,
  User,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import CustomerAddressDialog from "./components/CustomerAddressDialog";
import OrderSuccessDialog from "./components/OrderSuccessDialog";

const EndCustomerCheckoutPage = () => {
  const navigate = useNavigate();
  const { getEndCustomerCart, updateEndCustomerCart } = useCart();
  const { getCustomerAddresses } = useCustomer();
  const { getBrandPublicPaymentMethods } = usePayment();
  const { createOrder } = useOrder();

  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null,
  );
  const [addressDialogOpen, setAddressDialogOpen] = useState(false);
  const [orderSuccessDialog, setOrderSuccessDialog] = useState<{
    open: boolean;
    data: TCreateOrderResponse | null;
  }>({ open: false, data: null });
  const [editingAddress, setEditingAddress] =
    useState<TCustomerAddressListResponse | null>(null);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] =
    useState<string>("");
  const [formData, setFormData] = useState({ notes: "" });
  const [promoCode, setPromoCode] = useState("");
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);

  const {
    data: cartData,
    error: cartError,
    isError: isCartError,
    isLoading: isCartLoading,
  } = getEndCustomerCart();

  const {
    data: addressesData,
    isLoading: isAddressesLoading,
    isError: isAddressesError,
    error: addressesError,
  } = getCustomerAddresses({});

  const {
    data: brandPublicPaymentMethodsData,
    isLoading: isBrandPublicPaymentMethodsLoading,
    isError: isBrandPublicPaymentMethodsError,
    error: brandPublicPaymentMethodsError,
  } = getBrandPublicPaymentMethods();

  const createOrderMutation = createOrder();
  const updateCartMutation = updateEndCustomerCart();

  const cart = cartData?.data?.data;
  const addresses = addressesData?.data?.data || [];
  const paymentMethods = brandPublicPaymentMethodsData?.data?.data || [];

  useEffect(() => {
    if (addresses.length > 0 && !selectedAddressId) {
      const primary = addresses.find((a) => a.isPrimary);
      setSelectedAddressId(primary?.id || addresses[0]?.id || null);
    }
  }, [addresses, selectedAddressId]);

  useEffect(() => {
    if (paymentMethods.length > 0 && !selectedPaymentMethodId) {
      const def = paymentMethods.find((pm) => pm.isDefault === true);
      setSelectedPaymentMethodId(def?.id || paymentMethods[0]?.id || "");
    }
  }, [paymentMethods, selectedPaymentMethodId]);

  if (isCartLoading || isAddressesLoading || isBrandPublicPaymentMethodsLoading)
    return <PageLoader />;

  if (isAddressesError && addressesError) handleApiError(addressesError);
  if (isCartError && cartError) handleApiError(cartError);
  if (isBrandPublicPaymentMethodsError && brandPublicPaymentMethodsError)
    handleApiError(brandPublicPaymentMethodsError);

  const nonGiftItems = cart?.items.filter((i) => !i.isGiftItem) ?? [];
  const giftItems = cart?.items.filter((i) => i.isGiftItem) ?? [];
  const totalNonGiftQty = nonGiftItems.reduce((s, i) => s + i.quantity, 0);
  const totalGiftQty = giftItems.reduce((s, i) => s + i.quantity, 0);
  const isEmpty = !cart || nonGiftItems.length === 0;

  const selectedAddress = addresses.find((a) => a.id === selectedAddressId);
  const shipping = cart?.totalOrderShippingFee ?? 0;

  const buildCurrentItems = () =>
    nonGiftItems.map((i) => ({
      productId: i.productId,
      productImageUrlSnapshot: i.productImageUrlSnapshot,
      quantity: i.quantity,
    }));

  const buildCurrentPromotions = () =>
    (cart?.appliedPromotions ?? []).map((p) => ({
      promotionRuleId: p.promotionId,
      promotionRuleCode: p.promotionRuleCode,
      promotionRuleNameSnapshot: p.promotionRuleNameSnapshot,
      discountAmountApplied: p.discountAmountApplied,
    }));

  const buildBasePayload = () => ({
    cartId: cart!.id,
    customerNote: cart!.customerNote,
    items: buildCurrentItems(),
  });

  const openSuccessDialog = (data: TCreateOrderResponse) =>
    setOrderSuccessDialog({ open: true, data });

  const closeSuccessDialog = () =>
    setOrderSuccessDialog({ open: false, data: null });

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return;
    setIsApplyingPromo(true);
    try {
      await updateCartMutation.mutateAsync({
        ...buildBasePayload(),
        promotionCodeToApply: promoCode.trim(),
      });
      toast.success("Áp dụng mã khuyến mãi thành công!");
      setPromoCode("");
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsApplyingPromo(false);
    }
  };

  const handleRemovePromo = async (promotionId: string) => {
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

  const handleInputChange = (field: string, value: string) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleOpenCreateDialog = () => {
    setDialogMode("create");
    setEditingAddress(null);
    setAddressDialogOpen(true);
  };

  const handleOpenEditDialog = (address: TCustomerAddressListResponse) => {
    setDialogMode("edit");
    setEditingAddress(address);
    setAddressDialogOpen(true);
  };

  const handlePlaceOrder = async () => {
    if (!cart) return;

    if (!selectedAddress) {
      toast.error("Vui lòng chọn địa chỉ giao hàng");
      return;
    }
    if (!selectedPaymentMethodId) {
      toast.error("Vui lòng chọn phương thức thanh toán");
      return;
    }

    const orderRequest: TCreateOrderRequest = {
      brandPaymentMethodId: selectedPaymentMethodId,
      cartId: cart.id,
      shippingAddress: selectedAddress.address,
      shippingContact: selectedAddress.shippingContact,
      customerNote: formData.notes || null,
    };

    try {
      const response = await createOrderMutation.mutateAsync(orderRequest);
      if (response.data.status >= 200 && response.data.status < 300) {
        const orderData = response.data?.data;
        if (!orderData) {
          toast.error("Không nhận được thông tin đơn hàng");
          return;
        }

        const paymentMethod = paymentMethods.find(
          (pm) => pm.id === selectedPaymentMethodId,
        );

        // Trường hợp cần thanh toán online
        if (
          orderData.orderStatus === EOrderStatus.WaitingPayment &&
          orderData.paymentUrl
        ) {
          if (
            paymentMethod?.brandPaymentMethodCode
              .toUpperCase()
              .includes("PAYOS")
          ) {
            toast.success("Đang chuyển đến trang thanh toán...");
            navigate(PATH_END_CUSTOMER.payment(orderData.orderId));
          } else {
            window.location.href = orderData.paymentUrl;
          }
          return; // early return — không mở success dialog
        }

        // Trường hợp COD hoặc Pending không cần thanh toán
        if (
          orderData.orderStatus === EOrderStatus.Pending &&
          orderData.paymentUrl == null
        ) {
          toast.success("Đặt hàng thành công!");
          openSuccessDialog(orderData);
        }
      } else {
        toast.error(response.data.message || "Đặt hàng thất bại");
      }
    } catch (error: any) {
      console.error("Order creation failed:", error);
      handleApiError(error);
    }
  };

  return (
    <>
      <div className="bg-muted/30 min-h-screen py-6">
        <div className="container mx-auto px-4">
          {isEmpty ? (
            <div className="container mx-auto px-4 py-16 text-center">
              <p className="text-muted-foreground mb-4">Giỏ hàng trống</p>
              <Link to={PATH_GUEST.home.root}>
                <Button>Về trang chủ</Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <Link to={PATH_GUEST.home.root} className="inline-block">
                  <h1 className="text-2xl font-bold text-primary">
                    UNI COFFEE ROASTERY
                  </h1>
                </Link>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Address */}
                    <div className="bg-card rounded-lg p-6 shadow-sm animate-fade-in">
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold flex items-center gap-2">
                          <User size={20} className="text-primary" />
                          Thông tin nhận hàng
                        </h2>
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-2"
                          onClick={handleOpenCreateDialog}
                        >
                          <Plus size={16} />
                          Thêm mới
                        </Button>
                      </div>

                      {addresses.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8 border-2 border-dashed rounded-lg">
                          <MapPin
                            size={40}
                            className="text-muted-foreground mb-2"
                          />
                          <p className="text-sm text-muted-foreground mb-4">
                            Chưa có địa chỉ giao hàng
                          </p>
                          <Button onClick={handleOpenCreateDialog} size="sm">
                            <Plus size={16} className="mr-2" />
                            Thêm địa chỉ mới
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-3 max-h-[500px] overflow-y-auto">
                          {addresses.map((address) => {
                            const isSelected = selectedAddressId === address.id;
                            return (
                              <div
                                key={address.id}
                                onClick={() => setSelectedAddressId(address.id)}
                                className={`relative border rounded-lg p-4 cursor-pointer transition-all ${
                                  isSelected
                                    ? "border-primary bg-primary/5 shadow-sm"
                                    : "border-border hover:border-primary/50 hover:bg-muted/50"
                                }`}
                              >
                                {address.isPrimary && (
                                  <div className="absolute top-2 right-2">
                                    <span className="inline-flex items-center gap-1 text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                                      <Star size={10} fill="currentColor" />
                                      Mặc định
                                    </span>
                                  </div>
                                )}
                                <div className="pr-16">
                                  <div className="flex items-start gap-2 mb-2">
                                    <User
                                      size={16}
                                      className="text-muted-foreground mt-0.5"
                                    />
                                    <div>
                                      <p className="font-medium text-sm">
                                        {address.receiver}
                                      </p>
                                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                        <Phone size={12} />
                                        {address.shippingContact}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-start gap-2">
                                    <MapPin
                                      size={16}
                                      className="text-muted-foreground mt-0.5"
                                    />
                                    <p className="text-sm text-muted-foreground">
                                      {address.address}
                                    </p>
                                  </div>
                                </div>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="absolute bottom-2 right-2 h-8 w-8"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleOpenEditDialog(address);
                                  }}
                                >
                                  <Edit size={14} />
                                </Button>
                                {isSelected && (
                                  <div className="absolute top-2 left-2">
                                    <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                                      <div className="h-2 w-2 rounded-full bg-white" />
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}

                      <div className="mt-6">
                        <Label className="text-sm text-muted-foreground mb-2">
                          Ghi chú đơn hàng (tùy chọn)
                        </Label>
                        <Textarea
                          placeholder="Ghi chú về đơn hàng..."
                          value={formData.notes}
                          onChange={(e) =>
                            handleInputChange("notes", e.target.value)
                          }
                          className="bg-background resize-none"
                          rows={3}
                        />
                      </div>
                    </div>

                    {/* Shipping & Payment */}
                    <div className="space-y-6">
                      <div
                        className="bg-card rounded-lg p-6 shadow-sm animate-fade-in"
                        style={{ animationDelay: "0.1s" }}
                      >
                        <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
                          <Truck size={20} className="text-primary" />
                          Vận chuyển
                        </h2>
                        <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 text-center text-sm">
                          {selectedAddress
                            ? "Giao hàng tiêu chuẩn"
                            : "Vui lòng chọn địa chỉ giao hàng"}
                        </div>
                      </div>

                      <div
                        className="bg-card rounded-lg p-6 shadow-sm animate-fade-in"
                        style={{ animationDelay: "0.2s" }}
                      >
                        <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
                          <CreditCard size={20} className="text-primary" />
                          Thanh toán
                        </h2>
                        {paymentMethods.length === 0 ? (
                          <div className="flex flex-col items-center justify-center py-8 border-2 border-dashed rounded-lg">
                            <CreditCard
                              size={40}
                              className="text-muted-foreground mb-2"
                            />
                            <p className="text-sm text-muted-foreground">
                              Không có phương thức thanh toán
                            </p>
                          </div>
                        ) : (
                          <RadioGroup
                            value={selectedPaymentMethodId}
                            onValueChange={setSelectedPaymentMethodId}
                            className="space-y-3"
                          >
                            {paymentMethods.map((method) => {
                              const isSelected =
                                selectedPaymentMethodId === method.id;
                              return (
                                <div
                                  key={method.id}
                                  onClick={() =>
                                    setSelectedPaymentMethodId(method.id)
                                  }
                                  className={`flex items-center justify-between p-4 border rounded-lg transition-all cursor-pointer ${
                                    isSelected
                                      ? "border-primary bg-primary/5 shadow-sm"
                                      : "border-border hover:border-primary/50 hover:bg-muted/50"
                                  }`}
                                >
                                  <div className="flex items-center gap-3 flex-1">
                                    <RadioGroupItem
                                      value={method.id}
                                      id={method.id}
                                    />
                                    <Label
                                      htmlFor={method.id}
                                      className="cursor-pointer flex items-center gap-2"
                                    >
                                      {method.name}
                                      {method.isDefault && (
                                        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                                          Mặc định
                                        </span>
                                      )}
                                    </Label>
                                  </div>
                                  {method.imageUrl && (
                                    <div className="w-12 h-12 rounded-lg overflow-hidden border flex items-center justify-center bg-white">
                                      <img
                                        src={method.imageUrl}
                                        alt={method.name}
                                        className="w-full h-full object-contain"
                                      />
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </RadioGroup>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-1">
                  <div
                    className="bg-card rounded-lg p-6 shadow-sm sticky top-24 animate-fade-in"
                    style={{ animationDelay: "0.3s" }}
                  >
                    <h2 className="text-lg font-semibold mb-4">
                      Đơn hàng ({totalNonGiftQty} sản phẩm)
                    </h2>

                    {/* Non-gift items */}
                    <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
                      {nonGiftItems.map((item) => (
                        <div
                          key={item.productId}
                          className="flex gap-3 items-center"
                        >
                          {item.productImageUrlSnapshot ? (
                            <img
                              src={item.productImageUrlSnapshot}
                              alt={item.productNameSnapshot}
                              className="w-12 h-12 rounded object-cover shrink-0"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center shrink-0">
                              <ImageOff size={12} className="text-gray-400" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="w-5 h-5 bg-primary text-primary-foreground text-sm font-medium rounded flex items-center justify-center flex-shrink-0">
                                {item.quantity}
                              </span>
                              <h4 className="text-sm font-medium line-clamp-2">
                                {item.productNameSnapshot}
                              </h4>
                            </div>
                          </div>
                          <div className="text-sm font-medium whitespace-nowrap">
                            {formatPrice(item.unitPriceSnapshot)}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Gift items */}
                    {giftItems.length > 0 && (
                      <div className="border-t border-green-100 pt-3 mb-4">
                        <p className="text-xs font-medium text-green-700 flex items-center gap-1 mb-2">
                          <Gift size={12} />
                          Quà tặng kèm ({totalGiftQty} sản phẩm)
                        </p>
                        <div className="space-y-2 max-h-32 overflow-y-auto">
                          {giftItems.map((item) => (
                            <div
                              key={`gift-${item.productId}-${item.promotionId}`}
                              className="flex gap-2 items-center bg-green-50 rounded-md px-2 py-1.5"
                            >
                              {item.productImageUrlSnapshot ? (
                                <img
                                  src={item.productImageUrlSnapshot}
                                  alt={item.productNameSnapshot}
                                  className="w-10 h-10 rounded object-cover shrink-0"
                                />
                              ) : (
                                <div className="w-10 h-10 bg-green-100 rounded flex items-center justify-center shrink-0">
                                  <Gift size={12} className="text-green-400" />
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <span className="w-4 h-4 bg-green-500 text-white text-xs font-medium rounded flex items-center justify-center flex-shrink-0">
                                    {item.quantity}
                                  </span>
                                  <p className="text-xs text-green-800 line-clamp-1 font-medium">
                                    {item.productNameSnapshot}
                                  </p>
                                </div>
                              </div>
                              <span className="text-xs font-semibold text-green-600 whitespace-nowrap shrink-0">
                                Miễn phí
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Promotion input */}
                    <div className="space-y-2 mb-4">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Nhập mã khuyến mãi"
                          value={promoCode}
                          onChange={(e) =>
                            setPromoCode(e.target.value.toUpperCase())
                          }
                          onKeyDown={(e) =>
                            e.key === "Enter" && handleApplyPromo()
                          }
                          disabled={isApplyingPromo}
                          className="bg-background font-mono text-sm"
                        />
                        <Button
                          variant="outline"
                          className="shrink-0 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                          onClick={handleApplyPromo}
                          disabled={!promoCode.trim() || isApplyingPromo}
                        >
                          {isApplyingPromo ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            "Áp dụng"
                          )}
                        </Button>
                      </div>

                      {(cart.appliedPromotions?.length ?? 0) > 0 && (
                        <div className="space-y-1.5">
                          {cart.appliedPromotions.map((promo) => (
                            <div
                              key={promo.promotionId}
                              className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-2.5"
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <Tag
                                  size={12}
                                  className="text-green-600 shrink-0"
                                />
                                <div className="min-w-0">
                                  <p className="text-xs font-mono font-semibold text-green-700 truncate">
                                    {promo.promotionRuleCode}
                                  </p>
                                  <p className="text-xs text-green-600 truncate">
                                    {promo.promotionRuleNameSnapshot}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-1.5 shrink-0 ml-2">
                                <span className="text-xs text-green-700 font-medium">
                                  {promo.discountAmountApplied > 0
                                    ? `-${formatPrice(promo.discountAmountApplied)}`
                                    : "🎁 Quà tặng"}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-5 w-5 text-green-600 hover:text-red-500 hover:bg-red-50"
                                  onClick={() =>
                                    handleRemovePromo(promo.promotionId)
                                  }
                                  disabled={updateCartMutation.isPending}
                                >
                                  <X size={12} />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Totals */}
                    <div className="space-y-2.5 text-sm border-t border-border pt-4">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tạm tính</span>
                        <span>
                          {formatPrice(cart.totalAmountWithoutDiscount)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Phí vận chuyển
                        </span>
                        <span>
                          {shipping === 0 ? "Miễn phí" : formatPrice(shipping)}
                        </span>
                      </div>
                      {cart.totalOrderDiscount > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span className="flex items-center gap-1">
                            <Tag size={12} />
                            Giảm giá
                          </span>
                          <span>-{formatPrice(cart.totalOrderDiscount)}</span>
                        </div>
                      )}
                      {giftItems.length > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span className="flex items-center gap-1">
                            <Gift size={12} />
                            Quà tặng
                          </span>
                          <span>{totalGiftQty} sản phẩm</span>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between items-center border-t border-border pt-4 mt-3">
                      <span className="font-medium">Tổng cộng</span>
                      <span className="text-xl font-bold text-primary">
                        {formatPrice(cart.totalAmount)}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between mt-6 gap-4">
                      <Link
                        to={PATH_END_CUSTOMER.cart}
                        className="text-sm text-primary hover:underline flex items-center gap-1"
                      >
                        <ChevronLeft size={16} />
                        Quay về giỏ hàng
                      </Link>
                      <Button
                        className="bg-primary hover:bg-primary/90 font-bold px-6"
                        onClick={handlePlaceOrder}
                        disabled={createOrderMutation.isPending}
                      >
                        {createOrderMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Đang xử lý...
                          </>
                        ) : (
                          "ĐẶT HÀNG"
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <OrderSuccessDialog
        open={orderSuccessDialog.open}
        onOpenChange={(open) => {
          if (!open) closeSuccessDialog();
        }}
        orderData={orderSuccessDialog.data}
      />

      <CustomerAddressDialog
        open={addressDialogOpen}
        onOpenChange={setAddressDialogOpen}
        address={editingAddress}
        mode={dialogMode}
      />
    </>
  );
};

export default EndCustomerCheckoutPage;
