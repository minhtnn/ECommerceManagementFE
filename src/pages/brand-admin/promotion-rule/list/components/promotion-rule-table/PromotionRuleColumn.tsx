import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn, copyToClipboard, formatPrice } from "@/lib/utils";
import { PATH_BRAND_DASHBOARD } from "@/routes/path";
import { TPromotionRuleList } from "@/schemas/promotion-rule.schema";
import { EPromotionStatus } from "@/types/enums/promotion-status.enum";
import { EPromotionType } from "@/types/enums/promotion-type.enum";
import type { ColumnDef } from "@tanstack/react-table";
import { Copy, Eye } from "lucide-react";
import { Link } from "react-router-dom";

const STATUS_CONFIG: Record<
  EPromotionStatus,
  { label: string; className: string }
> = {
  [EPromotionStatus.Draft]: {
    label: "Nháp",
    className: "bg-gray-100 text-gray-600",
  },
  [EPromotionStatus.Active]: {
    label: "Đang chạy",
    className: "bg-green-100 text-green-700",
  },
  [EPromotionStatus.Inactive]: {
    label: "Đã tắt",
    className: "bg-red-100 text-red-600",
  },
  [EPromotionStatus.Expired]: {
    label: "Hết hạn",
    className: "bg-slate-100 text-slate-500",
  },
};

const formatDateShort = (dateStr?: string | null) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export const columns: ColumnDef<TPromotionRuleList>[] = [
  {
    accessorKey: "code",
    header: () => <div className="font-semibold text-base">Mã</div>,
    cell: (info) => {
      const code = info.getValue() as string;
      return (
        <div className="flex items-center gap-2 min-w-0">
          <Badge
            variant="secondary"
            className="font-mono text-sm truncate max-w-[calc(100%-32px)]"
          >
            {code}
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={() => copyToClipboard(code, "Mã khuyến mãi")}
          >
            <Copy className="h-3 w-3" />
          </Button>
        </div>
      );
    },
    size: 130,
  },
  {
    accessorKey: "name",
    header: () => <div className="font-semibold text-base">Tên khuyến mãi</div>,
    cell: (info) => {
      const name = info.getValue() as string;
      const row = info.row.original;
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="space-y-1">
                <p className="font-medium text-sm truncate max-w-[220px] cursor-default">
                  {name}
                </p>
                {row.shortDescription && (
                  <p className="text-xs text-muted-foreground truncate max-w-[220px]">
                    {row.shortDescription}
                  </p>
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                Khuyến mãi: <span>{name} </span>
              </p>
              <p>Mô tả ngắn: {row.shortDescription}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    accessorKey: "startDate",
    header: () => (
      <div className="font-semibold text-base text-center">Thời gian</div>
    ),
    cell: (info) => {
      const row = info.row.original;
      return (
        <div className="text-center space-y-0.5">
          <p className="text-xs text-muted-foreground">
            {formatDateShort(row.startDate)}
          </p>
          <p className="text-xs text-muted-foreground">→</p>
          <p className="text-xs text-muted-foreground">
            {formatDateShort(row.endDate)}
          </p>
        </div>
      );
    },
    size: 120,
  },
  {
    accessorKey: "priority",
    header: () => (
      <div className="font-semibold text-base text-center">Ưu tiên</div>
    ),
    cell: (info) => {
      const priority = info.getValue() as number;
      return (
        <div className="flex justify-center">
          <Badge variant="outline" className="text-base truncate max-w-full">
            {priority}
          </Badge>
        </div>
      );
    },
    size: 80,
  },
  {
    accessorKey: "status",
    header: () => (
      <div className="font-semibold text-base text-center">Trạng thái</div>
    ),
    cell: (info) => {
      const status = info.getValue() as EPromotionStatus;
      const config = STATUS_CONFIG[status];
      return (
        <div className="flex justify-center">
          <Badge
            className={cn(
              "text-base truncate max-w-fullwhitespace-nowrap",
              config?.className,
            )}
          >
            {config?.label ?? status}
          </Badge>
        </div>
      );
    },
    size: 110,
  },
  {
    id: "actions",
    header: () => (
      <div className="font-semibold text-base text-center">Thao tác</div>
    ),
    cell: ({ row }) => {
      const promotion = row.original;
      return (
        <div className="flex justify-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  to={PATH_BRAND_DASHBOARD.promotionRule.edit(promotion.id)}
                >
                  <Eye className="h-4 w-4 hover:cursor-pointer" />
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-sm">Xem / Chỉnh sửa</div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      );
    },
    size: 80,
  },
];
