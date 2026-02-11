import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { PATH_END_CUSTOMER, PATH_GUEST } from "@/routes/path";
import { CheckCircle, Package, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { TCreateOrderResponse } from "@/schemas/order.schema";
import { Separator } from "@/components/ui/separator";

interface OrderSuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderData: TCreateOrderResponse | null;
}

const OrderSuccessDialog = ({
  open,
  onOpenChange,
  orderData,
}: OrderSuccessDialogProps) => {
  if (!orderData) return null;

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };

  const getOrderStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      WaitingPayment: "Chờ thanh toán",
      Pending: "Chờ xử lý",
      Processing: "Đang xử lý",
      Shipped: "Đang giao hàng",
      Delivered: "Đã giao hàng",
      Cancelled: "Đã hủy",
    };
    return statusMap[status] || status;
  };

  const getPaymentStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      Pending: "Chờ thanh toán",
      Processing: "Đang xử lý",
      Completed: "Đã thanh toán",
      Failed: "Thất bại",
      Expired: "Hết hạn",
    };
    return statusMap[status] || status;
  };

  const getPaymentStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      Pending: "text-yellow-600 bg-yellow-50",
      Processing: "text-blue-600 bg-blue-50",
      Completed: "text-green-600 bg-green-50",
      Failed: "text-red-600 bg-red-50",
      Expired: "text-gray-600 bg-gray-50",
    };
    return colorMap[status] || "text-gray-600 bg-gray-50";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 gap-0">
        {/* Header with Success Icon */}
        <div className="bg-gradient-to-b from-green-50 to-white p-6 pb-4">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4 animate-bounce-once">
              <CheckCircle size={32} className="text-green-600" />
            </div>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-center">
                Đặt hàng thành công!
              </DialogTitle>
              <DialogDescription className="text-center text-base mt-2">
                Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ xử lý đơn hàng của bạn sớm
                nhất có thể.
              </DialogDescription>
            </DialogHeader>
          </div>
        </div>

        {/* Order Details */}
        <div className="px-6 py-4 space-y-4">
          {/* Order Code Card */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">
                  Mã đơn hàng
                </p>
                <p className="font-bold text-lg text-primary">
                  {orderData.orderCode}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground mb-1">Tổng tiền</p>
                <p className="font-bold text-lg text-foreground">
                  {formatPrice(orderData.totalAmount)}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Order Info */}
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Trạng thái đơn hàng</span>
              <span className="font-medium">
                {getOrderStatusText(orderData.orderStatus.toString())}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">
                Trạng thái thanh toán
              </span>
              <span
                className={`font-medium px-2 py-1 rounded-full text-xs ${getPaymentStatusColor(orderData.paymentStatus.toString())}`}
              >
                {getPaymentStatusText(orderData.paymentStatus.toString())}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Thời gian đặt hàng</span>
              <span className="font-medium">
                {formatDate(orderData.createdDate)}
              </span>
            </div>
          </div>

          {/* Payment URL Info (if COD) */}
          {!orderData.paymentUrl && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                💵 Bạn sẽ thanh toán khi nhận hàng
              </p>
            </div>
          )}

          {/* QR Code (if available) */}
          {orderData.qrCode && (
            <div className="bg-muted rounded-lg p-4 text-center">
              <p className="text-sm text-muted-foreground mb-3">
                Quét mã QR để thanh toán
              </p>
              <img
                src={orderData.qrCode}
                alt="QR Code"
                className="w-48 h-48 mx-auto"
              />
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="px-6 pb-6 space-y-3">
          <Link
            to={PATH_END_CUSTOMER.orders.view(orderData.orderId)}
            onClick={() => onOpenChange(false)}
            className="block w-full"
          >
            <Button variant="outline" className="w-full gap-2">
              <Package size={16} />
              Xem chi tiết đơn hàng
            </Button>
          </Link>

          <Link
            to={PATH_GUEST.products.root}
            onClick={() => onOpenChange(false)}
            className="block w-full"
          >
            <Button className="w-full gap-2 bg-primary hover:bg-primary/90">
              <ShoppingBag size={16} />
              Tiếp tục mua sắm
            </Button>
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderSuccessDialog;
