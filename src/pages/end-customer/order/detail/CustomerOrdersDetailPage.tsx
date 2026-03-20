import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { useOrder } from "@/hooks/use-order";
import { EndCustomerAccountLayout } from "@/layouts/EndCustomerAccountLayout";
import { cn, formatPrice } from "@/lib/utils";
import { PATH_END_CUSTOMER } from "@/routes/path";
import { EOrderStatus, getOrderStatusConfig } from "@/types/enums/order-status.enum";
import { EPaymentStatus, getPaymentStatusConfig } from "@/types/enums/payment-status.enum";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import {
  ArrowLeft, Calendar, CreditCard,
  MapPin, Package, Phone, Pencil,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import CancelOrderDialog from "./components/CancelOrderDialog";
import EditShippingInfoDialog from "./components/EditShippingInfoDialog";
import { toast } from "sonner";

const STATUS_BAR: Partial<Record<EOrderStatus, string>> = {
  [EOrderStatus.WaitingPayment]: "bg-yellow-400",
  [EOrderStatus.Pending]:        "bg-orange-400",
  [EOrderStatus.Processing]:     "bg-blue-400",
  [EOrderStatus.Shipped]:        "bg-purple-500",
  [EOrderStatus.Delivered]:      "bg-green-500",
  [EOrderStatus.Cancelled]:      "bg-red-400",
};

const OrderDetailSkeleton = () => (
  <div className="space-y-6">
    <Skeleton className="h-10 w-48" />
    <div className="grid gap-4 md:grid-cols-3">
      {[1,2,3].map(i => <Skeleton key={i} className="h-36 rounded-2xl" />)}
    </div>
    <Skeleton className="h-64 rounded-2xl" />
  </div>
);

// Reusable info card shell
const InfoCard = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("rounded-2xl border border-border/60 bg-white dark:bg-zinc-900 p-5", className)}>
    {children}
  </div>
);

const InfoLabel = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[11.5px] font-medium uppercase tracking-wider text-muted-foreground mb-1">
    {children}
  </p>
);

const InfoValue = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <p className={cn("text-[14px] font-semibold text-foreground", className)}>{children}</p>
);

const CustomerOrdersDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getCustomerOrderById, updateOrder, getPaymentLink } = useOrder();
  const updateOrderMutation = updateOrder();
  const getPaymentLinkMutation = getPaymentLink();

  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [editShippingDialogOpen, setEditShippingDialogOpen] = useState(false);

  const { data, isLoading, isError } = getCustomerOrderById(id!);

  const handleCancelOrder = async (reason: string) => {
    try {
      await updateOrderMutation.mutateAsync({
        id: id!,
        data: { newOrderStatus: EOrderStatus.Cancelled, cancelReason: reason },
      });
      setCancelDialogOpen(false);
    } catch {}
  };

  const handleEditShippingInfo = async (data: {
    shippingAddress: string;
    shippingContact: string;
    customerNote: string;
  }) => {
    try {
      await updateOrderMutation.mutateAsync({ id: id!, data });
      setEditShippingDialogOpen(false);
    } catch {}
  };

  const handlePayNow = () => {
    if (order.qrCode) navigate(PATH_END_CUSTOMER.payment(id!));
    else toast.error("Mã QR không khả dụng. Vui lòng thử lại sau.");
  };

  if (isLoading) {
    return (
      <EndCustomerAccountLayout breadcrumbs={[
        { label: "Đơn hàng của bạn", href: PATH_END_CUSTOMER.orders.root },
        { label: "Chi tiết đơn hàng" },
      ]}>
        <OrderDetailSkeleton />
      </EndCustomerAccountLayout>
    );
  }

  if (isError || !data?.data?.data) {
    return (
      <EndCustomerAccountLayout breadcrumbs={[
        { label: "Đơn hàng của bạn", href: PATH_END_CUSTOMER.orders.root },
        { label: "Chi tiết đơn hàng" },
      ]}>
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Package className="h-14 w-14 text-muted-foreground" />
          <p className="text-lg font-semibold">Không tìm thấy đơn hàng</p>
          <Button variant="outline" onClick={() => navigate(PATH_END_CUSTOMER.orders.root)}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại danh sách
          </Button>
        </div>
      </EndCustomerAccountLayout>
    );
  }

  const order = data.data.data;
  const { label: orderLabel, className: orderClassName } = getOrderStatusConfig(order.orderStatus);
  const barColor = STATUS_BAR[order.orderStatus] ?? "bg-zinc-300";

  return (
    <EndCustomerAccountLayout breadcrumbs={[
      { label: "Đơn hàng của bạn", href: PATH_END_CUSTOMER.orders.root },
      { label: `Đơn hàng ${order.code}` },
    ]}>
      <div className="space-y-5">

        {/* ── Header ── */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <Button variant="ghost" size="sm" className="-ml-2 mb-2"
              onClick={() => navigate(PATH_END_CUSTOMER.orders.root)}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại
            </Button>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Chi tiết đơn hàng
            </h1>
            <p className="text-[13px] text-muted-foreground mt-0.5 font-mono">
              #{order.code}
            </p>
          </div>

          {/* Status badge — dùng accent bar style nhất quán với OrderCard */}
          <div className={cn(
            "inline-flex items-center gap-2 px-4 py-2 rounded-full border text-[13px] font-bold",
            orderClassName,
          )}>
            <span className={cn("w-2 h-2 rounded-full", barColor)} />
            {orderLabel}
          </div>
        </div>

        {/* ── 3 info cards ── */}
        <div className="grid gap-4 md:grid-cols-3">

          {/* Địa chỉ giao hàng */}
          <InfoCard>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center">
                <MapPin className="w-4 h-4 text-muted-foreground" />
              </div>
              <span className="text-[13px] font-bold text-foreground">Địa chỉ giao hàng</span>
            </div>
            <div className="space-y-3">
              <div>
                <InfoLabel>Địa chỉ</InfoLabel>
                <InfoValue>{order.shippingAddress}</InfoValue>
              </div>
              <div>
                <InfoLabel>
                  <span className="inline-flex items-center gap-1">
                    <Phone className="w-3 h-3" /> Liên hệ
                  </span>
                </InfoLabel>
                <InfoValue>{order.shippingContact}</InfoValue>
              </div>
            </div>
          </InfoCard>

          {/* Thông tin đơn hàng */}
          <InfoCard>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center">
                <Calendar className="w-4 h-4 text-muted-foreground" />
              </div>
              <span className="text-[13px] font-bold text-foreground">Thông tin đơn hàng</span>
            </div>
            <div className="space-y-3">
              <div>
                <InfoLabel>Ngày đặt hàng</InfoLabel>
                <InfoValue>
                  {format(new Date(order.createdDate), "dd MMMM, yyyy · HH:mm", { locale: vi })}
                </InfoValue>
              </div>
              <div>
                <InfoLabel>Cập nhật lần cuối</InfoLabel>
                <InfoValue>
                  {format(new Date(order.lastModifiedDate), "dd MMMM, yyyy · HH:mm", { locale: vi })}
                </InfoValue>
              </div>
            </div>
          </InfoCard>

          {/* Thanh toán */}
          <InfoCard>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center">
                <CreditCard className="w-4 h-4 text-muted-foreground" />
              </div>
              <span className="text-[13px] font-bold text-foreground">Thanh toán</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <InfoLabel>Tổng sản phẩm</InfoLabel>
                <InfoValue>{formatPrice(order.totalAmountWithoutDiscount)}</InfoValue>
              </div>
              <div className="flex justify-between items-center">
                <InfoLabel>Giảm giá</InfoLabel>
                <InfoValue className="text-red-500">-{formatPrice(order.totalOrderDiscount)}</InfoValue>
              </div>
              <div className="flex justify-between items-center">
                <InfoLabel>Phí vận chuyển</InfoLabel>
                <InfoValue>{formatPrice(order.totalOrderShippingFee)}</InfoValue>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between items-center">
                <span className="text-[13px] font-bold text-foreground">Tổng cộng</span>
                <span className="text-[18px] font-bold text-foreground tabular-nums">
                  {formatPrice(order.totalAmount)}
                </span>
              </div>
            </div>
          </InfoCard>
        </div>

        {/* ── Ghi chú ── */}
        {order.customerNote && (
          <InfoCard>
            <InfoLabel>Ghi chú của bạn</InfoLabel>
            <p className="text-[14px] text-foreground italic mt-1">"{order.customerNote}"</p>
          </InfoCard>
        )}

        {/* ── Sản phẩm ── */}
        <InfoCard className="p-0 overflow-hidden">
          <div className="px-5 py-4 border-b border-border/60">
            <p className="text-[13px] font-bold text-foreground">Sản phẩm trong đơn hàng</p>
            <p className="text-[12px] text-muted-foreground mt-0.5">Tổng {order.items.length} sản phẩm</p>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="text-[12px] font-bold uppercase tracking-wide">Sản phẩm</TableHead>
                <TableHead className="text-center text-[12px] font-bold uppercase tracking-wide">Số lượng</TableHead>
                <TableHead className="text-right text-[12px] font-bold uppercase tracking-wide">Đơn giá</TableHead>
                <TableHead className="text-right text-[12px] font-bold uppercase tracking-wide">Thành tiền</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.items.map((item) => (
                <TableRow key={item.id} className="hover:bg-muted/30">
                  <TableCell className="font-semibold text-[14px]">
                    {item.productNameSnapshot}
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-muted text-[13px] font-bold">
                      {item.quantity}
                    </span>
                  </TableCell>
                  <TableCell className="text-right text-[13px] text-muted-foreground">
                    {formatPrice(item.unitPriceSnapshot)}
                  </TableCell>
                  <TableCell className="text-right text-[14px] font-bold">
                    {formatPrice(item.totalPriceSnapshot)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </InfoCard>

        {/* ── Lịch sử thanh toán ── */}
        {order.payments && order.payments.length > 0 && (
          <InfoCard className="p-0 overflow-hidden">
            <div className="px-5 py-4 border-b border-border/60">
              <p className="text-[13px] font-bold text-foreground">Lịch sử thanh toán</p>
              <p className="text-[12px] text-muted-foreground mt-0.5">Tổng {order.payments.length} giao dịch</p>
            </div>
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead className="text-[12px] font-bold uppercase tracking-wide">Phương thức</TableHead>
                  <TableHead className="text-center text-[12px] font-bold uppercase tracking-wide">Trạng thái</TableHead>
                  <TableHead className="text-right text-[12px] font-bold uppercase tracking-wide">Số tiền</TableHead>
                  <TableHead className="text-right text-[12px] font-bold uppercase tracking-wide">Thời gian</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.payments.map((payment) => {
                  const cfg = getPaymentStatusConfig(payment.paymentStatus);
                  return (
                    <TableRow key={payment.id} className="hover:bg-muted/30">
                      <TableCell>
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-muted text-[12px] font-semibold">
                          {payment.paymentMethodCodeSnapshot}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge className={cn(cfg.className, "border text-[12px]")}>
                          {cfg.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right text-[14px] font-bold">
                        {formatPrice(payment.amount)}
                      </TableCell>
                      <TableCell className="text-right text-[12px] text-muted-foreground">
                        {payment.paidAt && format(new Date(payment.paidAt), "dd/MM/yyyy HH:mm", { locale: vi })}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </InfoCard>
        )}

        {/* ── Actions ── */}
        <InfoCard className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[13px] text-muted-foreground">
            Cần hỗ trợ?{" "}
            <a href="/contact" className="text-primary font-semibold hover:underline">
              Liên hệ chúng tôi
            </a>
          </p>
          <div className="flex gap-2 flex-wrap justify-end">
            {order.orderStatus === EOrderStatus.Pending && (
              <Button variant="outline" size="sm"
                onClick={() => setEditShippingDialogOpen(true)}
                disabled={updateOrderMutation.isPending}>
                <Pencil className="mr-2 h-3.5 w-3.5" /> Sửa thông tin giao hàng
              </Button>
            )}
            {order.orderStatus === EOrderStatus.WaitingPayment && (
              <Button size="sm" onClick={handlePayNow}>Thanh toán ngay</Button>
            )}
            {order.orderStatus === EOrderStatus.Pending && (
              <Button variant="destructive" size="sm"
                onClick={() => setCancelDialogOpen(true)}
                disabled={updateOrderMutation.isPending}>
                Hủy đơn hàng
              </Button>
            )}
          </div>
        </InfoCard>

      </div>

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
    </EndCustomerAccountLayout>
  );
};

export default CustomerOrdersDetailPage;