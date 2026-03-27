import { PageLoader } from "@/components/LoadingScreen";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCountdownTimer } from "@/hooks/use-countdown-timer";
import { useOrder } from "@/hooks/use-order";
import { usePayment } from "@/hooks/use-payment";
import { usePaymentPolling } from "@/hooks/use-payment-polling";
import { handleApiError } from "@/lib/error";
import { formatPrice } from "@/lib/utils";
import {
  handleHideCancelConfirm,
  handleHideSuccessPopup,
  handleResetPaymentSession,
  handleShowCancelConfirm,
  handleStartPaymentSession,
} from "@/redux/payment/payment-slice";
import { RootState } from "@/redux/store";
import { PATH_GUEST } from "@/routes/path";
import { EPaymentStatus } from "@/types/enums/payment-status.enum";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Package,
  QrCode,
  Tag,
  X,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import CancelPaymentDialog from "./components/CancelPaymentDialog";
import PaymentSuccessDialog from "./components/PaymentSuccessDialog";

const PaymentPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { getCustomerOrderById } = useOrder();
  const { cancelPayment: cancelPaymentMutation } = usePayment();

  // Get state values from Redux
  const { showSuccessPopup, showCancelConfirm, paymentStatus } = useSelector(
    (state: RootState) => state.payment,
  );

  const { formattedTime, isExpired } = useCountdownTimer();
  usePaymentPolling(); // Start polling

  // Fetch order data
  const {
    data: orderData,
    isLoading: isOrderLoading,
    isError: isOrderError,
    error: orderError,
  } = getCustomerOrderById(id!!, Intl.DateTimeFormat().resolvedOptions().timeZone);

  const cancelMutation = cancelPaymentMutation();

  const order = orderData?.data?.data;

  // Initialize payment session
  useEffect(() => {
    if (id && order) {
      dispatch(
        handleStartPaymentSession({
          orderId: id,
          expiresInMinutes: 15,
        }),
      );
    }

    // Cleanup on unmount
    return () => {
      dispatch(handleResetPaymentSession());
    };
  }, [id, order, dispatch]);

  // Handle expired payment
  useEffect(() => {
    if (isExpired) {
      toast.error("Phiên thanh toán đã hết hạn");
      setTimeout(() => {
        navigate(PATH_GUEST.home.root);
      }, 3000);
    }
  }, [isExpired, navigate]);

  // Handle errors
  if (isOrderError && orderError) {
    handleApiError(orderError);
    return null;
  }

  if (isOrderLoading) {
    return <PageLoader />;
  }

  if (!order) {
    return (
      <>
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-muted-foreground mb-4">Không tìm thấy đơn hàng</p>
          <Button onClick={() => navigate(PATH_GUEST.home.root)}>
            Về trang chủ
          </Button>
        </div>
      </>
    );
  }

  const handleCancelPayment = async (reason?: string) => {
    if (!id) return;

    try {
      await cancelMutation.mutateAsync({
        orderId: id,
        data: { cancelReason: reason },
      });

      dispatch(handleHideCancelConfirm());
      dispatch(handleResetPaymentSession());

      // Redirect to home after 1 second
      setTimeout(() => {
        navigate(PATH_GUEST.home.root);
      }, 1000);
    } catch (error) {
      console.error("Cancel payment failed:", error);
    }
  };

  const handleSuccessDialogClose = () => {
    dispatch(handleHideSuccessPopup());
    dispatch(handleResetPaymentSession());
  };

  // Check if payment is already completed
  const isPaymentCompleted = paymentStatus === EPaymentStatus.Completed;
  const isPaymentFailed = paymentStatus === EPaymentStatus.Failed;

  return (
    <>
      <div className="bg-muted/30 min-h-screen py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Thanh toán đơn hàng
            </h1>
            <p className="text-muted-foreground">
              Quét mã QR hoặc chuyển khoản theo thông tin bên dưới
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* QR Code Card */}
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <QrCode size={20} className="text-primary" />
                  Mã QR thanh toán
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* QR Code */}
                {order.qrCode ? (
                  <div className="bg-white p-4 rounded-lg border-2 border-primary/20 flex justify-center">
                    <QRCodeSVG
                      value={order.qrCode}
                      size={256}
                      level="H"
                      includeMargin={true}
                    />
                  </div>
                ) : (
                  <div className="bg-muted rounded-lg p-8 text-center">
                    <QrCode
                      size={48}
                      className="mx-auto text-muted-foreground mb-2"
                    />
                    <p className="text-sm text-muted-foreground">
                      Mã QR không khả dụng
                    </p>
                  </div>
                )}

                {/* Countdown Timer */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock size={18} className="text-yellow-600" />
                      <span className="text-sm font-medium text-yellow-800">
                        Thời gian còn lại
                      </span>
                    </div>
                    <span
                      className={`text-xl font-bold ${isExpired ? "text-red-600" : "text-yellow-600"}`}
                    >
                      {formattedTime}
                    </span>
                  </div>
                  {isExpired && (
                    <p className="text-xs text-red-600 mt-2">
                      Phiên thanh toán đã hết hạn
                    </p>
                  )}
                </div>

                {/* Status Indicator */}
                {paymentStatus === EPaymentStatus.Pending && !isExpired && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-blue-800">
                          Đang chờ thanh toán...
                        </p>
                        <p className="text-xs text-blue-600 mt-1">
                          Vui lòng quét mã QR hoặc chuyển khoản theo thông tin
                          bên dưới
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {isPaymentCompleted && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={20} className="text-green-600" />
                      <p className="text-sm font-medium text-green-800">
                        Thanh toán thành công!
                      </p>
                    </div>
                  </div>
                )}

                {isPaymentFailed && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center gap-2">
                      <X size={20} className="text-red-600" />
                      <p className="text-sm font-medium text-red-800">
                        Thanh toán thất bại
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Order Info Card */}
            <Card
              className="animate-fade-in"
              style={{ animationDelay: "0.1s" }}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package size={20} className="text-primary" />
                  Thông tin đơn hàng
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Order Details */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Mã đơn hàng</span>
                    <span className="font-medium">{order.code}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Số sản phẩm</span>
                    <span className="font-medium">
                      {order.items?.length || 0}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Phương thức</span>
                    <span className="font-medium">PayOS</span>
                  </div>
                </div>

                <Separator />

                {/* Products */}
                <div className="space-y-2">
                  <p className="text-sm font-medium">Sản phẩm</p>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {order.items?.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between text-sm bg-muted/50 rounded p-2"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs">
                            {item.quantity}
                          </span>
                          <span className="line-clamp-1">
                            {item.productNameSnapshot}
                          </span>
                        </div>
                        <span className="font-medium whitespace-nowrap ml-2">
                          {formatPrice(item.unitPriceSnapshot)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Total Amount */}
                <div className="bg-primary/5 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tạm tính</span>
                    <span>{formatPrice(order.totalAmountWithoutDiscount)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Phí vận chuyển
                    </span>
                    <span>
                      {order.totalOrderShippingFee === 0
                        ? "Miễn phí"
                        : formatPrice(order.totalOrderShippingFee)}
                    </span>
                  </div>
                  {order.totalOrderDiscount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span className="flex items-center gap-1">
                        <Tag size={12} />
                        Giảm giá
                      </span>
                      <span>-{formatPrice(order.totalOrderDiscount)}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between items-center pt-1">
                    <span className="text-lg font-medium">Tổng tiền</span>
                    <span className="text-2xl font-bold text-primary">
                      {formatPrice(order.totalAmount)}
                    </span>
                  </div>
                </div>

                {/* Payment Instructions */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
                  <p className="font-medium text-blue-900 mb-2">
                    Hướng dẫn thanh toán:
                  </p>
                  <ol className="list-decimal list-inside space-y-1 text-blue-800">
                    <li>Mở ứng dụng ngân hàng</li>
                    <li>Quét mã QR bên trái</li>
                    <li>Xác nhận số tiền và nội dung chuyển khoản</li>
                    <li>Hoàn tất thanh toán</li>
                  </ol>
                </div>

                {/* Cancel Button */}
                {!isPaymentCompleted && !isPaymentFailed && !isExpired && (
                  <Button
                    variant="outline"
                    className="w-full border-red-500 text-red-500 hover:bg-red-50"
                    onClick={() => dispatch(handleShowCancelConfirm())}
                    disabled={cancelMutation.isPending}
                  >
                    <X size={18} className="mr-2" />
                    Hủy thanh toán
                  </Button>
                )}

                {(isPaymentFailed || isExpired) && (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate(PATH_GUEST.home.root)}
                  >
                    Về trang chủ
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Help Section */}
          <Card
            className="mt-6 animate-fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <AlertCircle size={20} className="text-yellow-600 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-sm mb-1">Lưu ý quan trọng</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>
                      • Vui lòng không đóng trang này cho đến khi thanh toán
                      hoàn tất
                    </li>
                    <li>
                      • Hệ thống sẽ tự động cập nhật khi bạn chuyển khoản thành
                      công
                    </li>
                    <li>
                      • Nếu gặp vấn đề, vui lòng liên hệ hotline: 1900.123.456
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Success Dialog */}
      <PaymentSuccessDialog
        open={showSuccessPopup}
        onOpenChange={handleSuccessDialogClose}
        orderCode={order.code}
        amount={order.totalAmount}
        autoRedirectSeconds={3}
      />

      {/* Cancel Confirmation Dialog */}
      <CancelPaymentDialog
        open={showCancelConfirm}
        onOpenChange={(open) => {
          if (!open) dispatch(handleHideCancelConfirm());
        }}
        onConfirm={handleCancelPayment}
        isLoading={cancelMutation.isPending}
      />
    </>
  );
};

export default PaymentPage;
