import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useOrder } from "@/hooks/use-order";
import { EndCustomerAccountLayout } from "@/layouts/EndCustomerAccountLayout";
import { cn, formatPrice } from "@/lib/utils";
import { PATH_END_CUSTOMER } from "@/routes/path";
import { EOrderStatus } from "@/types/enums/order-status.enum";
import { EPaymentStatus } from "@/types/enums/payment-status.enum";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import {
  ArrowLeft,
  Calendar,
  CreditCard,
  MapPin,
  Package,
  Phone,
  Pencil,
  Loader2,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import CancelOrderDialog from "./components/CancelOrderDialog";
import EditShippingInfoDialog from "./components/EditShippingInfoDialog";
import { toast } from "sonner";

// Helper functions
const getOrderStatusConfig = (status: EOrderStatus) => {
  const configs = {
    [EOrderStatus.WaitingPayment]: {
      label: "Chờ thanh toán",
      className: "bg-yellow-100 text-yellow-800 border-yellow-300",
    },
    [EOrderStatus.Pending]: {
      label: "Chờ xác nhận",
      className: "bg-orange-100 text-orange-800 border-orange-300",
    },
    [EOrderStatus.Processing]: {
      label: "Đang xử lý",
      className: "bg-blue-100 text-blue-800 border-blue-300",
    },
    [EOrderStatus.Shipped]: {
      label: "Đang giao hàng",
      className: "bg-purple-100 text-purple-800 border-purple-300",
    },
    [EOrderStatus.Delivered]: {
      label: "Đã giao hàng",
      className: "bg-green-100 text-green-800 border-green-300",
    },
    [EOrderStatus.Cancelled]: {
      label: "Đã hủy",
      className: "bg-red-100 text-red-800 border-red-300",
    },
  };
  return (
    configs[status] || {
      label: "Không xác định",
      className: "bg-gray-100 text-gray-800",
    }
  );
};

const getPaymentStatusConfig = (status: EPaymentStatus) => {
  const configs = {
    [EPaymentStatus.Pending]: {
      label: "Chờ thanh toán",
      className: "bg-yellow-100 text-yellow-800 border-yellow-300",
    },
    [EPaymentStatus.Processing]: {
      label: "Đang xử lý",
      className: "bg-blue-100 text-blue-800 border-blue-300",
    },
    [EPaymentStatus.Completed]: {
      label: "Thành công",
      className: "bg-green-100 text-green-800 border-green-300",
    },
    [EPaymentStatus.Failed]: {
      label: "Thất bại",
      className: "bg-red-100 text-red-800 border-red-300",
    },
    [EPaymentStatus.Expired]: {
      label: "Hết hạn",
      className: "bg-gray-100 text-gray-800 border-gray-300",
    },
  };
  return (
    configs[status] || {
      label: "Không xác định",
      className: "bg-gray-100 text-gray-800",
    }
  );
};

// Loading skeleton component
const OrderDetailSkeleton = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-32" />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    </div>
  );
};

const CustomerOrdersDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getCustomerOrderById, updateOrder, getPaymentLink } = useOrder();
  const updateOrderMutation = updateOrder();
  const getPaymentLinkMutation = getPaymentLink();

  // Dialog states
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [editShippingDialogOpen, setEditShippingDialogOpen] = useState(false);

  const { data, isLoading, isError } = getCustomerOrderById(id!);

  // Cancel order handler
  const handleCancelOrder = async (reason: string) => {
    try {
      await updateOrderMutation.mutateAsync({
        id: id!,
        data: {
          newOrderStatus: EOrderStatus.Cancelled,
          cancelReason: reason,
        },
      });
      setCancelDialogOpen(false);
    } catch (error) {
      // Error handled by mutation onError
    }
  };

  // Edit shipping info handler
  const handleEditShippingInfo = async (data: {
    shippingAddress: string;
    shippingContact: string;
    customerNote: string;
  }) => {
    try {
      await updateOrderMutation.mutateAsync({
        id: id!,
        data,
      });
      setEditShippingDialogOpen(false);
    } catch (error) {
      // Error handled by mutation onError
    }
  };

  const handlePayNow = () => {
    if (order.qrCode) {
      navigate(PATH_END_CUSTOMER.payment(id!));
    } else {
      // If no QR, show error
      toast.error("Mã QR không khả dụng. Vui lòng thử lại sau.");
    }
  };

  if (isLoading) {
    return (
      <EndCustomerAccountLayout
        breadcrumbs={[
          { label: "Đơn hàng của bạn", href: PATH_END_CUSTOMER.orders.root },
          { label: "Chi tiết đơn hàng" },
        ]}
      >
        <OrderDetailSkeleton />
      </EndCustomerAccountLayout>
    );
  }

  if (isError || !data?.data?.data) {
    return (
      <EndCustomerAccountLayout
        breadcrumbs={[
          { label: "Đơn hàng của bạn", href: PATH_END_CUSTOMER.orders.root },
          { label: "Chi tiết đơn hàng" },
        ]}
      >
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              Không tìm thấy đơn hàng
            </h3>
            <p className="text-muted-foreground mb-4">
              Đơn hàng không tồn tại hoặc đã bị xóa
            </p>
            <Button onClick={() => navigate(PATH_END_CUSTOMER.orders.root)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại danh sách
            </Button>
          </CardContent>
        </Card>
      </EndCustomerAccountLayout>
    );
  }

  const order = data.data.data;
  const orderStatusConfig = getOrderStatusConfig(order.orderStatus);
  const paymentStatusConfig = getPaymentStatusConfig(order.paymentStatus);

  return (
    <EndCustomerAccountLayout
      breadcrumbs={[
        { label: "Đơn hàng của bạn", href: PATH_END_CUSTOMER.orders.root },
        { label: `Đơn hàng ${order.code}` },
      ]}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(PATH_END_CUSTOMER.orders.root)}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Quay lại
              </Button>
            </div>
            <h1 className="text-2xl font-bold">Chi tiết đơn hàng</h1>
            <p className="text-muted-foreground">
              Mã đơn hàng: <span className="font-mono">{order.code}</span>
            </p>
          </div>
          <div className="flex gap-3">
            <Badge
              className={cn(
                orderStatusConfig.className,
                "border text-base px-4 py-1",
              )}
            >
              {orderStatusConfig.label}
            </Badge>
            <Badge
              className={cn(
                paymentStatusConfig.className,
                "border text-base px-4 py-1",
              )}
            >
              {paymentStatusConfig.label}
            </Badge>
          </div>
        </div>

        {/* Cancel Info (if cancelled) */}
        {/* {order.orderStatus === EOrderStatus.Cancelled && order.cancelReason && (
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-800 text-base">
                Đơn hàng đã bị hủy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-red-700 font-medium">Lý do:</span>
                  <span className="text-red-900">{order.cancelReason}</span>
                </div>
                {order.cancelledAt && (
                  <div className="flex items-center gap-2 text-red-700">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {format(new Date(order.cancelledAt), "dd/MM/yyyy HH:mm", {
                        locale: vi,
                      })}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )} */}

        {/* Thông tin tổng quan */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Địa chỉ giao hàng */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <MapPin className="h-5 w-5" />
                Địa chỉ giao hàng
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Địa chỉ</p>
                <p className="font-medium text-sm">{order.shippingAddress}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  Liên hệ
                </p>
                <p className="font-medium text-sm">{order.shippingContact}</p>
              </div>
            </CardContent>
          </Card>

          {/* Thời gian */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Calendar className="h-5 w-5" />
                Thông tin đơn hàng
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Ngày đặt hàng</p>
                <p className="font-medium text-sm">
                  {format(new Date(order.createdDate), "dd/MM/yyyy HH:mm", {
                    locale: vi,
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Cập nhật lần cuối
                </p>
                <p className="font-medium text-sm">
                  {format(
                    new Date(order.lastModifiedDate),
                    "dd/MM/yyyy HH:mm",
                    {
                      locale: vi,
                    },
                  )}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Tổng quan tài chính */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <CreditCard className="h-5 w-5" />
                Thanh toán
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Tổng sản phẩm
                </span>
                <span className="font-medium text-sm">
                  {formatPrice(order.totalAmountWithoutDiscount)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Giảm giá</span>
                <span className="font-medium text-red-600 text-sm">
                  -{formatPrice(order.totalOrderDiscount)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Phí vận chuyển
                </span>
                <span className="font-medium text-sm">
                  {formatPrice(order.totalOrderShippingFee)}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="font-semibold">Tổng cộng</span>
                <span className="font-bold text-lg text-primary">
                  {formatPrice(order.totalAmount)}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Ghi chú khách hàng */}
        {order.customerNote && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Ghi chú của bạn</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm bg-muted p-4 rounded-md italic">
                "{order.customerNote}"
              </p>
            </CardContent>
          </Card>
        )}

        {/* Danh sách sản phẩm */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Sản phẩm trong đơn hàng</CardTitle>
            <CardDescription>
              Tổng {order.items.length} sản phẩm
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sản phẩm</TableHead>
                  <TableHead className="text-center">Số lượng</TableHead>
                  <TableHead className="text-right">Đơn giá</TableHead>
                  <TableHead className="text-right">Thành tiền</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="font-medium">
                        {item.productNameSnapshot}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className="font-mono">
                        {item.quantity}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatPrice(item.unitPriceSnapshot)}
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {formatPrice(item.totalPriceSnapshot)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Thông tin thanh toán */}
        {order.payments && order.payments.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Lịch sử thanh toán</CardTitle>
              <CardDescription>
                Tổng {order.payments.length} giao dịch
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mã giao dịch</TableHead>
                    <TableHead>Phương thức</TableHead>
                    <TableHead className="text-center">Trạng thái</TableHead>
                    <TableHead className="text-right">Số tiền</TableHead>
                    <TableHead className="text-right">Thời gian</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.payments.map((payment) => {
                    const config = getPaymentStatusConfig(
                      payment.paymentStatus,
                    );
                    return (
                      <TableRow key={payment.id}>
                        <TableCell>
                          <span className="font-mono text-sm">
                            {payment.transactionId}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {payment.paymentMethodCodeSnapshot}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge className={cn(config.className, "border")}>
                            {config.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          {formatPrice(payment.amount)}
                        </TableCell>
                        <TableCell className="text-right text-sm">
                          {payment.paidAt &&
                            format(
                              new Date(payment.paidAt),
                              "dd/MM/yyyy HH:mm",
                              {
                                locale: vi,
                              },
                            )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
              <div className="text-sm text-muted-foreground">
                Cần hỗ trợ?{" "}
                <a
                  href="/contact"
                  className="text-primary hover:underline font-medium"
                >
                  Liên hệ chúng tôi
                </a>
              </div>
              <div className="flex gap-3 flex-wrap justify-end">
                {/* Edit shipping info - Only when Pending */}
                {order.orderStatus === EOrderStatus.Pending && (
                  <Button
                    variant="outline"
                    onClick={() => setEditShippingDialogOpen(true)}
                    disabled={updateOrderMutation.isPending}
                  >
                    <Pencil className="mr-2 h-4 w-4" />
                    Sửa thông tin giao hàng
                  </Button>
                )}

                {/* Pay now - Only when WaitingPayment */}
                {order.orderStatus === EOrderStatus.WaitingPayment && (
                  <Button onClick={handlePayNow}>Thanh toán ngay</Button>
                )}

                {/* Reorder - Only when Delivered */}
                {/* {order.orderStatus === EOrderStatus.Delivered && (
                  <Button variant="outline">Mua lại</Button>
                )} */}

                {/* Cancel order - Only when Pending */}
                {order.orderStatus === EOrderStatus.Pending && (
                  <Button
                    variant="destructive"
                    onClick={() => setCancelDialogOpen(true)}
                    disabled={updateOrderMutation.isPending}
                  >
                    Hủy đơn hàng
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dialogs */}
        <CancelOrderDialog
          open={cancelDialogOpen}
          onOpenChange={setCancelDialogOpen}
          onConfirm={handleCancelOrder}
          isLoading={updateOrderMutation.isPending}
          isPaid={order.paymentStatus === EPaymentStatus.Completed}
        />

        <EditShippingInfoDialog
          open={editShippingDialogOpen}
          onOpenChange={setEditShippingDialogOpen}
          initialData={{
            shippingAddress: order.shippingAddress,
            shippingContact: order.shippingContact,
            customerNote: order.customerNote,
          }}
          onConfirm={handleEditShippingInfo}
          isLoading={updateOrderMutation.isPending}
        />
      </div>
    </EndCustomerAccountLayout>
  );
};

export default CustomerOrdersDetailPage;
