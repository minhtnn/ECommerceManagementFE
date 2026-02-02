import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn, copyToClipboard } from "@/lib/utils";
import { PATH_BRAND_DASHBOARD } from "@/routes/path";
import { TCustomerListResponse } from "@/schemas/customer.schema";
import { ECustomerStatus } from "@/types/enums/customer-status";
import type { ColumnDef } from "@tanstack/react-table";
import { Copy, Eye, ImageOff } from "lucide-react";
import { PhotoProvider, PhotoView } from "react-photo-view";
import { Link } from "react-router-dom";

export const columns: ColumnDef<TCustomerListResponse>[] = [
  {
    accessorKey: "avatarUrl",
    colSpan: 1,
    header: () => <div className="font-semibold text-base"></div>,
    // <div className="font-semibold text-base">Ảnh</div>,
    cell: (info) => {
      const avatarUrl = info.getValue() as string;

      return (
        <div className={`flex items-center gap-2 justify-center`}>
          {avatarUrl ? (
            <PhotoProvider>
              <PhotoView src={avatarUrl}>
                <img
                  src={avatarUrl}
                  className="w-16 h-16 object-cover rounded-full hover:cursor-pointer border border-gray-300"
                />
              </PhotoView>
            </PhotoProvider>
          ) : (
            <div
              className={`w-16 h-16 object-cover rounded-full hover:cursor-pointer border border-gray-300 flex flex-item items-center justify-center`}
            >
              <ImageOff fillOpacity={0.5} />
            </div>
          )}
        </div>
      );
    },
    size: 80,
  },
  {
    accessorKey: "fullName",
    colSpan: 2,
    header: () => <div className="font-semibold text-base">Họ và tên</div>,
    cell: (info) => {
      const fullName = info.getValue() as string;
      return (
        <div className="font-medium truncate text-base truncate">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>{fullName}</TooltipTrigger>
            </Tooltip>
          </TooltipProvider>
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    colSpan: 2,
    header: () => (
      <div className="text-center font-semibold text-base">Email</div>
    ),
    cell: ({ row }) => {
      const email = row.original.email;
      return (
        <div className="font-medium truncate text-base truncate">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>{email}</TooltipTrigger>
            </Tooltip>
          </TooltipProvider>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    colSpan: 1,
    header: () => (
      <div className="text-center font-semibold text-base">Trạng thái</div>
    ),
    cell: (info) => {
      const status = info.getValue() as number;
      return (
        <div className="flex justify-center">
          <Badge
            className={cn(
              status === ECustomerStatus.Active
                ? "bg-green-100 text-green-800"
                : status === ECustomerStatus.EmailVerifyPending
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-gray-100 text-gray-600",
              "text-base",
            )}
          >
            {status === ECustomerStatus.Active
              ? "Hoạt động"
              : status === ECustomerStatus.EmailVerifyPending
                ? "Chờ xác minh email"
                : "Ngừng hoạt động"}
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
      const customer = row.original;

      return (
        <div className="flex justify-center">
          <TooltipProvider>
            <Tooltip>
              <Link to={PATH_BRAND_DASHBOARD.customer.detail(customer.id)}>
                <TooltipTrigger>
                  <Eye className="h-4 w-4 hover:cursor-pointer" />
                  <TooltipContent>
                    <div className="text-base">Xem chi tiết</div>
                  </TooltipContent>
                </TooltipTrigger>
              </Link>
            </Tooltip>
          </TooltipProvider>
        </div>
      );
    },
  },
];
