import { SortableHeader } from "@/components/table/sortable-header";
import { createFormattedHeader } from "@/components/table/table-formatter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn, copyToClipboard } from "@/lib/utils";
import { PATH_SYSTEM_ADMIN_DASHBOARD } from "@/routes/path";
import { TBrandListResponse } from "@/schemas/brand.schema";
import type { ColumnDef } from "@tanstack/react-table";
import { Copy, Eye, ImageOff } from "lucide-react";
import { PhotoProvider, PhotoView } from "react-photo-view";
import { Link } from "react-router-dom";

export const columns: ColumnDef<TBrandListResponse>[] = [
  {
    accessorKey: "logoUrl",
    header: () => <div className="font-semibold text-base"></div>,
    cell: (info) => {
      const imageUrl = info.getValue() as string;

      return (
        <div className={`flex items-center gap-2 justify-center`}>
          {imageUrl ? (
            <PhotoProvider>
              <PhotoView src={imageUrl}>
                <img
                  src={imageUrl}
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
    accessorKey: "code",
    header: ({ column }) =>
      createFormattedHeader("Mã", column, {
        sortable: true,
        className: "font-semibold text-base",
        align: "left",
      }),
    cell: (info) => {
      const code = info.getValue() as string;
      return (
        <div className="flex items-center gap-2 max-w-[180px]">
          <Badge variant="secondary" className="font-mono text-base truncate">
            {code}
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={() => copyToClipboard(code, "Mã thương hiệu")}
          >
            <Copy className="h-3 w-3" />
          </Button>
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) =>
      // <div className="font-semibold text-base">Tên thương hiệu</div>,
      createFormattedHeader("Tên thương hiệu", column, {
        sortable: true,
        className: "font-semibold text-base",
        align: "left",
      }),
    cell: (info) => {
      const name = info.getValue() as string;
      return <div className="font-medium truncate text-base">{name}</div>;
    },
  },

  {
    accessorKey: "email",
    header: () => <div className="font-semibold text-base">Email</div>,
    cell: (info) => {
      const email = info.getValue() as string;
      return <div className="text-base font-normal text-gray-700">{email}</div>;
    },
  },
  {
    accessorKey: "status",
    header: () => (
      <div className="text-center font-semibold text-base">Trạng thái</div>
    ),
    cell: (info) => {
      const status = info.getValue() as number;
      return (
        <div className="flex justify-center">
          <Badge
            className={cn(
              status === 0
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-600",
              "text-base"
            )}
          >
            {status === 0 ? "Hoạt động" : "Ngừng hoạt động"}
          </Badge>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => (
      <div className="text-center font-semibold text-base">Thao tác</div>
    ),
    cell: ({ row }) => {
      const brand = row.original;

      return (
        <div className="flex justify-center">
          <TooltipProvider>
            <Tooltip>
              <Link to={PATH_SYSTEM_ADMIN_DASHBOARD.brand.edit(brand.id)}>
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
