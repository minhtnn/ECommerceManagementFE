import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/hooks/use-cart";
import { useCustomer } from "@/hooks/use-customer";
import { useOrder } from "@/hooks/use-order";
import EndUserLayout from "@/layouts/EndUserLayout";
import { handleApiError } from "@/lib/error";
import { formatPrice } from "@/lib/utils";
import { PATH_END_CUSTOMER, PATH_GUEST } from "@/routes/path";
import { TCustomerAddressListResponse } from "@/schemas/customer.schema";
import {
  TCreateOrderRequest,
  TCreateOrderResponse,
} from "@/schemas/order.schema";
import {
  ChevronLeft,
  CreditCard,
  Edit,
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
import { PageLoader } from "@/components/LoadingScreen";
import { usePayment } from "@/hooks/use-payment";
import OrderSuccessDialog from "./components/OrderSuccessDialog";

interface Voucher {
  id: string;
  code: string;
  name: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  usageLimit: number;
  usedCount: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

const availableVouchers: Voucher[] = [
  {
    id: "1",
    code: "GIAM5K",
    name: "Giảm 5K",
    discountType: "fixed",
    discountValue: 5000,
    minOrderValue: 0,
    usageLimit: 100,
    usedCount: 25,
    startDate: "2024-01-01",
    endDate: "2026-12-31",
    isActive: true,
  },
  {
    id: "2",
    code: "KM5PHAN",
    name: "Khuyến mãi 5%",
    discountType: "percentage",
    discountValue: 5,
    minOrderValue: 50000,
    maxDiscount: 20000,
    usageLimit: 200,
    usedCount: 80,
    startDate: "2024-01-01",
    endDate: "2025-12-31",
    isActive: true,
  },
  {
    id: "3",
    code: "GIAM10PHAN",
    name: "Giảm 10%",
    discountType: "percentage",
    discountValue: 10,
    minOrderValue: 100000,
    maxDiscount: 50000,
    usageLimit: 50,
    usedCount: 10,
    startDate: "2024-01-01",
    endDate: "2025-12-31",
    isActive: true,
  },
];

const EndCustomerCheckoutPage = () => {
  const navigate = useNavigate();
  const { getEndCustomerCart } = useCart();
  const { getCustomerAddresses } = useCustomer();
  const { getBrandPublicPaymentMethods } = usePayment();
  const { createOrder } = useOrder();

  // All useState hooks
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null,
  );
  const [addressDialogOpen, setAddressDialogOpen] = useState(false);
  const [orderSuccessDialogOpen, setOrderSuccessDialogOpen] = useState(false);
  const [createdOrderData, setCreatedOrderData] =
    useState<TCreateOrderResponse | null>(null);
  const [editingAddress, setEditingAddress] =
    useState<TCustomerAddressListResponse | null>(null);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] =
    useState<string>("");

  const [formData, setFormData] = useState({
    notes: "",
  });

  const [discountCode, setDiscountCode] = useState("");
  const [appliedVoucher, setAppliedVoucher] = useState<Voucher | null>(null);

  // All useQuery hooks
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

  // Mutations
  const createOrderMutation = createOrder();

  // Derive data
  const cart = cartData?.data?.data;
  const addresses = addressesData?.data?.data || [];
  const paymentMethods = brandPublicPaymentMethodsData?.data?.data || [];

  // useEffect for address selection
  useEffect(() => {
    if (addresses.length > 0 && !selectedAddressId) {
      const primaryAddress = addresses.find((addr) => addr.isPrimary);
      setSelectedAddressId(primaryAddress?.id || addresses[0]?.id || null);
    }
  }, [addresses, selectedAddressId]);

  // useEffect for payment method selection
  useEffect(() => {
    if (paymentMethods.length > 0 && !selectedPaymentMethodId) {
      const defaultMethod = paymentMethods.find((pm) => pm.isDefault === true);
      setSelectedPaymentMethodId(
        defaultMethod?.id || paymentMethods[0]?.id || "",
      );
    }
  }, [paymentMethods, selectedPaymentMethodId]);

  // Early returns AFTER all hooks
  if (
    isCartLoading ||
    isAddressesLoading ||
    isBrandPublicPaymentMethodsLoading
  ) {
    return <PageLoader />;
  }

  // Handle errors
  if (isAddressesError && addressesError) {
    handleApiError(addressesError);
  }

  if (isCartError && cartError) {
    handleApiError(cartError);
  }

  if (isBrandPublicPaymentMethodsError && brandPublicPaymentMethodsError) {
    handleApiError(brandPublicPaymentMethodsError);
  }

  // Check if cart exists and has items
  if (!cart || cart.items.length === 0) {
    return (
      <EndUserLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-muted-foreground mb-4">Giỏ hàng trống</p>
          <Link to={PATH_GUEST.home.root}>
            <Button>Về trang chủ</Button>
          </Link>
        </div>
      </EndUserLayout>
    );
  }

  const selectedAddress = addresses.find(
    (addr) => addr.id === selectedAddressId,
  );
  const selectedPaymentMethod = paymentMethods.find(
    (pm) => pm.id === selectedPaymentMethodId,
  );

  const shipping =
    cart.totalAmountWithoutDiscount >= 399000
      ? 0
      : cart.totalAmountWithoutDiscount > 0
        ? 30000
        : 0;

  // Calculate discount based on applied voucher
  const calculateDiscount = (): number => {
    if (!appliedVoucher) return 0;

    if (appliedVoucher.discountType === "fixed") {
      return appliedVoucher.discountValue;
    } else {
      const percentageDiscount =
        (cart.totalAmountWithoutDiscount * appliedVoucher.discountValue) / 100;
      if (appliedVoucher.maxDiscount) {
        return Math.min(percentageDiscount, appliedVoucher.maxDiscount);
      }
      return percentageDiscount;
    }
  };

  const discount = calculateDiscount();
  const total = cart.totalAmountWithoutDiscount + shipping - discount;

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleApplyDiscount = () => {
    const trimmedCode = discountCode.trim();

    if (!trimmedCode) {
      toast.error("Vui lòng nhập mã giảm giá");
      return;
    }

    const voucher = availableVouchers.find(
      (v) => v.code.toUpperCase() === trimmedCode.toUpperCase() && v.isActive,
    );

    if (!voucher) {
      toast.error("Mã giảm giá không hợp lệ hoặc đã hết hạn");
      return;
    }

    const now = new Date();
    const startDate = new Date(voucher.startDate);
    const endDate = new Date(voucher.endDate);

    if (now < startDate) {
      toast.error("Mã giảm giá chưa có hiệu lực");
      return;
    }

    if (now > endDate) {
      toast.error("Mã giảm giá đã hết hạn");
      return;
    }

    if (voucher.usedCount >= voucher.usageLimit) {
      toast.error("Mã giảm giá đã hết lượt sử dụng");
      return;
    }

    if (cart.totalAmountWithoutDiscount < voucher.minOrderValue) {
      toast.error(
        `Đơn hàng tối thiểu ${formatPrice(voucher.minOrderValue)} để áp dụng mã này`,
      );
      return;
    }

    setAppliedVoucher(voucher);
    toast.success(`Đã áp dụng mã giảm giá "${voucher.name}"!`);
  };

  const handleRemoveVoucher = () => {
    setAppliedVoucher(null);
    setDiscountCode("");
    toast.info("Đã hủy mã giảm giá");
  };

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
    // Validations
    if (!selectedAddress) {
      toast.error("Vui lòng chọn địa chỉ giao hàng");
      return;
    }
    if (!selectedPaymentMethodId) {
      toast.error("Vui lòng chọn phương thức thanh toán");
      return;
    }
    if (!cart || cart.items.length === 0) {
      toast.error("Giỏ hàng trống");
      return;
    }

    // ⭐ Build order request - Updated theo BE
    const orderRequest: TCreateOrderRequest = {
      brandPaymentMethodId: selectedPaymentMethodId,
      cartId: cart.id,
      shippingAddress: selectedAddress.address,
      shippingContact: selectedAddress.shippingContact,
      customerNote: formData.notes || null,
    };

    try {
      const response = await createOrderMutation.mutateAsync(orderRequest);
      const orderData = response.data?.data;

      if (!orderData) {
        toast.error("Không nhận được thông tin đơn hàng");
        return;
      }

      const paymentMethod = paymentMethods.find(
        (pm) => pm.id === selectedPaymentMethodId,
      );

      // If payment URL exists (PayOS), redirect to payment gateway
      if (orderData.paymentUrl) {
        if (
          paymentMethod?.name.toUpperCase().includes("PAYOS") ||
          orderData.paymentUrl
        ) {
          toast.success("Đang chuyển đến trang thanh toán...");
          // Navigate to custom payment page instead of external URL
          navigate(PATH_END_CUSTOMER.payment(orderData.orderId));
        } else if (paymentMethod?.name.toUpperCase().includes("COD")) {
          // COD - show success dialog
          setCreatedOrderData(orderData);
          setOrderSuccessDialogOpen(true);
          toast.success("Đặt hàng thành công!");
        } else {
          // Other payment methods - redirect to payment URL if available
          if (orderData.paymentUrl) {
            window.location.href = orderData.paymentUrl;
          } else {
            setCreatedOrderData(orderData);
            setOrderSuccessDialogOpen(true);
            toast.success("Đặt hàng thành công!");
          }
        }
      }
    } catch (error: any) {
      // Error is handled in mutation onError
      console.error("Order creation failed:", error);
    }
  };

  const handleCloseSuccessDialog = () => {
    setOrderSuccessDialogOpen(false);
    // Navigate to home or orders page after closing
    navigate(PATH_GUEST.home.root);
  };

  return (
    <EndUserLayout>
      <div className="bg-muted/30 min-h-screen py-6">
        <div className="container mx-auto px-4">
          {/* Logo centered */}
          <div className="text-center mb-8">
            <Link to={PATH_GUEST.home.root} className="inline-block">
              <h1 className="text-2xl font-bold text-primary">
                UNI COFFEE ROASTERY
              </h1>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Form */}
            <div className="lg:col-span-2 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Customer Information - Address Selection */}
                <div className="bg-card rounded-lg p-6 shadow-sm animate-fade-in">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
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

                  {/* Notes */}
                  <div className="mt-6">
                    <Label className="text-sm text-muted-foreground mb-2">
                      Ghi chú đơn hàng (tùy chọn)
                    </Label>
                    <Textarea
                      placeholder="Ghi chú về đơn hàng, ví dụ: thời gian hay chỉ dẫn địa điểm giao hàng chi tiết hơn"
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
                  {/* Shipping */}
                  <div
                    className="bg-card rounded-lg p-6 shadow-sm animate-fade-in"
                    style={{ animationDelay: "0.1s" }}
                  >
                    <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
                      <Truck size={20} className="text-primary" />
                      Vận chuyển
                    </h2>
                    <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 text-center text-sm text-foreground">
                      {selectedAddress
                        ? "Giao hàng tiêu chuẩn"
                        : "Vui lòng chọn địa chỉ giao hàng"}
                    </div>
                  </div>

                  {/* Payment Methods */}
                  <div
                    className="bg-card rounded-lg p-6 shadow-sm animate-fade-in"
                    style={{ animationDelay: "0.2s" }}
                  >
                    <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
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
                          const isDefault = method.isDefault === true;
                          const isSelected =
                            selectedPaymentMethodId === method.id;
                          return (
                            <div
                              key={method.id} // Changed from paymentMethodId
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
                                  value={method.id} // Changed from paymentMethodId
                                  id={method.id} // Changed from paymentMethodId
                                />
                                <Label
                                  htmlFor={method.id} // Changed from paymentMethodId
                                  className="cursor-pointer flex items-center gap-2"
                                >
                                  {method.name}
                                  {isDefault && (
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

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div
                className="bg-card rounded-lg p-6 shadow-sm sticky top-24 animate-fade-in"
                style={{ animationDelay: "0.3s" }}
              >
                <h2 className="text-lg font-semibold text-foreground mb-4">
                  Đơn hàng (
                  {cart.items.reduce((sum, item) => sum + item.quantity, 0)} sản
                  phẩm)
                </h2>

                {/* Cart Items */}
                <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                  {cart.items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center flex-shrink-0">
                            {item.quantity}
                          </span>
                          <h4 className="text-sm font-medium text-foreground line-clamp-2">
                            {item.productNameSnapshot}
                          </h4>
                        </div>
                      </div>
                      <div className="text-sm font-medium text-foreground whitespace-nowrap">
                        {formatPrice(item.unitPriceSnapshot)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Discount Code */}
                <div className="space-y-3 mb-6">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Nhập mã giảm giá"
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value)}
                      className="bg-background"
                      disabled={!!appliedVoucher}
                    />
                    <Button
                      variant="outline"
                      className="shrink-0 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                      onClick={handleApplyDiscount}
                      disabled={!!appliedVoucher}
                    >
                      Áp dụng
                    </Button>
                  </div>

                  {/* Applied Voucher Display */}
                  {appliedVoucher && (
                    <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <Tag size={16} className="text-green-600" />
                        <div>
                          <p className="text-sm font-medium text-green-700">
                            {appliedVoucher.name}
                          </p>
                          <p className="text-xs text-green-600">
                            {appliedVoucher.discountType === "percentage"
                              ? `Giảm ${appliedVoucher.discountValue}%${appliedVoucher.maxDiscount ? ` (tối đa ${formatPrice(appliedVoucher.maxDiscount)})` : ""}`
                              : `Giảm ${formatPrice(appliedVoucher.discountValue)}`}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-green-600 hover:text-red-500 hover:bg-red-50"
                        onClick={handleRemoveVoucher}
                      >
                        <X size={14} />
                      </Button>
                    </div>
                  )}
                </div>

                {/* Order Totals */}
                <div className="space-y-3 text-sm border-t border-border pt-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tạm tính</span>
                    <span>{formatPrice(cart.totalAmountWithoutDiscount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Phí vận chuyển
                    </span>
                    <span>
                      {shipping === 0 ? "Miễn phí" : formatPrice(shipping)}
                    </span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span className="flex items-center gap-1">
                        <Tag size={12} />
                        Giảm giá
                      </span>
                      <span>-{formatPrice(discount)}</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center border-t border-border pt-4 mt-4">
                  <span className="font-medium">Tổng cộng</span>
                  <span className="text-xl font-bold text-primary">
                    {formatPrice(total)}
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
        </div>
      </div>

      {/* Dialogs */}
      <CustomerAddressDialog
        open={addressDialogOpen}
        onOpenChange={setAddressDialogOpen}
        address={editingAddress}
        mode={dialogMode}
      />

      <OrderSuccessDialog
        open={orderSuccessDialogOpen}
        onOpenChange={handleCloseSuccessDialog}
        orderData={createdOrderData}
      />
    </EndUserLayout>
  );
};

export default EndCustomerCheckoutPage;
