import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn, formatNumber, formatPrice } from "@/lib/utils";
import { PATH_BRAND_DASHBOARD } from "@/routes/path";
import { TBrandOrdersResponse } from "@/schemas/order.schema";
import { EOrderStatus } from "@/types/enums/order-status.enum";
import { EPaymentStatus } from "@/types/enums/payment-status.enum";
import type { ColumnDef } from "@tanstack/react-table";
import { Copy, Eye } from "lucide-react";
import { Link } from "react-router-dom";

// Helper function để lấy label và style cho order status
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
  return configs[status] || { label: "Không xác định", className: "bg-gray-100 text-gray-800" };
};

// Helper function để lấy label và style cho payment status
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
  return configs[status] || { label: "Không xác định", className: "bg-gray-100 text-gray-800" };
};

export const columns: ColumnDef<TBrandOrdersResponse>[] = [
  {
    accessorKey: "code",
    colSpan: 2,
    header: () => <div className="font-semibold text-base">Mã đơn hàng</div>,
    cell: (info) => {
      const code = info.getValue() as string;
      return (
        <div className="flex items-center gap-2 min-w-0 max-w-full">
          <Badge
            variant="secondary"
            className="font-mono text-base truncate max-w-[calc(100%-32px)]"
          >
            {code}
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 flex-shrink-0"
            onClick={() => {
              navigator.clipboard.writeText(code);
              // toast.success("Đã sao chép mã đơn hàng");
            }}
          >
            <Copy className="h-3 w-3" />
          </Button>
        </div>
      );
    },
  },
  {
    accessorKey: "customerName",
    colSpan: 2,
    header: () => <div className="font-semibold text-base">Tên khách hàng</div>,
    cell: (info) => {
      const name = info.getValue() as string;
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="font-medium text-base truncate cursor-default">
                {name || "N/A"}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{name || "Chưa có thông tin"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    accessorKey: "orderStatus",
    colSpan: 2,
    header: () => (
      <div className="text-center font-semibold text-base">
        Trạng thái đơn hàng
      </div>
    ),
    cell: (info) => {
      const status = info.getValue() as EOrderStatus;
      const config = getOrderStatusConfig(status);
      return (
        <div className="flex justify-center min-w-0">
          <Badge
            className={cn(
              config.className,
              "text-base truncate max-w-full whitespace-nowrap border"
            )}
          >
            {config.label}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "itemCount",
    colSpan: 1,
    header: () => (
      <div className="text-center font-semibold text-base">Số lượng SP</div>
    ),
    cell: (info) => {
      const itemCount = info.getValue() as number;
      return (
        <div className="flex justify-center min-w-0">
          <Badge
            variant="outline"
            className={cn(
              "bg-blue-50 text-blue-700 border-blue-300",
              "text-base truncate max-w-full font-semibold"
            )}
          >
            {formatNumber(itemCount)}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "totalAmount",
    colSpan: 1,
    header: () => (
      <div className="text-center font-semibold text-base">Tổng tiền</div>
    ),
    cell: (info) => {
      const price = info.getValue() as number;
      return (
        <div className="flex justify-center min-w-0">
          <Badge
            variant="outline"
            className={cn(
              "bg-emerald-50 text-emerald-700 border-emerald-300",
              "text-base truncate max-w-full font-semibold"
            )}
          >
            {formatPrice(price)}
          </Badge>
        </div>
      );
    },
  },
  {
    id: "actions",
    colSpan: 1,
    header: () => (
      <div className="text-center font-semibold text-base">Thao tác</div>
    ),
    cell: ({ row }) => {
      const order = row.original;

      return (
        <div className="flex justify-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link to={PATH_BRAND_DASHBOARD.order.detail(order.id)}>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Eye className="h-4 w-4" />
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-base">Xem chi tiết đơn hàng</div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      );
    },
  },
];