import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/utils";
import { PATH_END_CUSTOMER, PATH_GUEST } from "@/routes/path";
import { CheckCircle, Package, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { TCreateOrderResponse } from "@/schemas/order.schema";

interface OrderSuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderData: TCreateOrderResponse | null;
}

// ── Helpers ────────────────────────────────────────────────────────────────
const formatDate = (dateString: string) => {
  try {
    return new Date(dateString).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateString;
  }
};

const ORDER_STATUS_MAP: Record<string, string> = {
  WaitingPayment: "Chờ thanh toán",
  Pending: "Chờ xử lý",
  Processing: "Đang xử lý",
  Shipped: "Đang giao hàng",
  Delivered: "Đã giao hàng",
  Cancelled: "Đã hủy",
};

const PAYMENT_STATUS_MAP: Record<string, string> = {
  Pending: "Chờ thanh toán",
  Processing: "Đang xử lý",
  Completed: "Đã thanh toán",
  Failed: "Thất bại",
  Expired: "Hết hạn",
};

const PAYMENT_STATUS_COLOR: Record<string, string> = {
  Pending: "text-yellow-600 bg-yellow-50 border border-yellow-200",
  Processing: "text-blue-600 bg-blue-50 border border-blue-200",
  Completed: "text-green-600 bg-green-50 border border-green-200",
  Failed: "text-red-600 bg-red-50 border border-red-200",
  Expired: "text-gray-600 bg-gray-50 border border-gray-200",
};

// ── Component ──────────────────────────────────────────────────────────────
const OrderSuccessDialog = ({
  open,
  onOpenChange,
  orderData,
}: OrderSuccessDialogProps) => {
  if (!orderData) return null;

  const orderStatus = orderData.orderStatus.toString();
  const paymentStatus = orderData.paymentStatus.toString();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px] p-0 gap-0">
        {/* ── Header ──────────────────────────────────────────────── */}
        <div className="bg-gradient-to-b from-green-50 to-white p-8 pb-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4 animate-bounce-once">
              <CheckCircle size={48} className="text-green-600" />
            </div>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-center text-green-700">
                Đặt hàng thành công!
              </DialogTitle>
              <DialogDescription className="text-center text-base mt-3 text-gray-600">
                Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ xử lý đơn hàng của bạn
                sớm nhất có thể.
              </DialogDescription>
            </DialogHeader>
          </div>
        </div>

        {/* ── Order Info ──────────────────────────────────────────── */}
        <div className="px-8 py-6 space-y-4">
          {/* Order code + total */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Mã đơn hàng</span>
              <span className="font-bold text-green-700">{orderData.orderCode}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Tổng tiền</span>
              <span className="font-bold text-lg text-green-700">
                {formatPrice(orderData.totalAmount)}
              </span>
            </div>
          </div>

          <Separator />

          {/* Status rows */}
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Trạng thái đơn hàng</span>
              <span className="font-medium">
                {ORDER_STATUS_MAP[orderStatus] ?? orderStatus}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-600">Trạng thái thanh toán</span>
              <span
                className={`font-medium px-2 py-1 rounded-full text-xs ${
                  PAYMENT_STATUS_COLOR[paymentStatus] ??
                  "text-gray-600 bg-gray-50 border border-gray-200"
                }`}
              >
                {PAYMENT_STATUS_MAP[paymentStatus] ?? paymentStatus}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-600">Thời gian đặt hàng</span>
              <span className="font-medium">{formatDate(orderData.createdDate)}</span>
            </div>
          </div>

          {/* COD notice */}
          {!orderData.paymentUrl && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                💵 Bạn sẽ thanh toán khi nhận hàng
              </p>
            </div>
          )}

          {/* QR Code */}
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

          {/* Actions */}
          <div className="space-y-3 pt-1">
            <Link
              to={PATH_END_CUSTOMER.orders.view(orderData.orderId)}
              onClick={() => onOpenChange(false)}
              className="block w-full"
            >
              <Button variant="outline" className="w-full gap-2" size="lg">
                <Package size={18} />
                Xem chi tiết đơn hàng
              </Button>
            </Link>

            <Link
              to={PATH_GUEST.products.root}
              onClick={() => onOpenChange(false)}
              className="block w-full"
            >
              <Button
                className="w-full gap-2 bg-green-600 hover:bg-green-700"
                size="lg"
              >
                <ShoppingBag size={18} />
                Tiếp tục mua sắm
              </Button>
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderSuccessDialog;