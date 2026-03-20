import { cn, formatPrice } from "@/lib/utils";
import { PATH_END_CUSTOMER } from "@/routes/path";
import { EOrderStatus, getOrderStatusConfig } from "@/types/enums/order-status.enum";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface OrderCardProps {
  order: {
    id?: string;
    code?: string;
    orderStatus?: EOrderStatus;
    totalAmount?: number;
    itemCount?: number;
    createdDate?: Date;
  };
}

const STATUS_BAR: Partial<Record<EOrderStatus, string>> = {
  [EOrderStatus.WaitingPayment]: "bg-yellow-400",
  [EOrderStatus.Pending]:        "bg-orange-400",
  [EOrderStatus.Processing]:     "bg-blue-400",
  [EOrderStatus.Shipped]:        "bg-purple-500",
  [EOrderStatus.Delivered]:      "bg-green-500",
  [EOrderStatus.Cancelled]:      "bg-red-400",
};

export const OrderCard = ({ order }: OrderCardProps) => {
  const navigate = useNavigate();
  const { label, className } = getOrderStatusConfig(order.orderStatus);
  const barColor = order.orderStatus !== undefined
    ? (STATUS_BAR[order.orderStatus] ?? "bg-zinc-300")
    : "bg-zinc-300";

  return (
    <div
      onClick={() => navigate(PATH_END_CUSTOMER.orders.view(order.id))}
      className="group flex overflow-hidden rounded-2xl border border-border/60 bg-white dark:bg-zinc-900 shadow-sm hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 cursor-pointer"
    >
      {/* Accent bar trái */}
      <div className={cn("w-1 shrink-0", barColor)} />

      {/* Nội dung */}
      <div className="flex-1 px-5 py-4 min-w-0">

        {/* Row 1: mã đơn + giá */}
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="min-w-0">
            <p className="text-[15px] font-bold text-foreground tracking-tight truncate">
              #{order.code}
            </p>
            <p className="text-[12.5px] text-muted-foreground mt-0.5">
              {format(new Date(order.createdDate!), "dd MMMM, yyyy · HH:mm", { locale: vi })}
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-[22px] font-bold text-foreground tracking-tight leading-none tabular-nums">
              {formatPrice(order.totalAmount)}
            </p>
            <p className="text-[11px] text-muted-foreground mt-1">Tổng đơn hàng</p>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-border/50 mb-3" />

        {/* Row 2: status pill + item count + arrow */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-bold border",
              className,
            )}>
              <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", barColor)} />
              {label}
            </span>
            <span className="text-[12px] font-semibold text-muted-foreground">
              {order.itemCount} sản phẩm
            </span>
          </div>

          <div className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200",
            "group-hover:translate-x-0.5",
            "group-hover:bg-gray-100 dark:group-hover:bg-zinc-700",
          )}>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </div>
  );
};