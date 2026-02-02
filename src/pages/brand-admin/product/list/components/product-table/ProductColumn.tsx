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
import { TProductList } from "@/schemas/product.schema";
import type { ColumnDef } from "@tanstack/react-table";
import { Copy, Eye, ImageOff } from "lucide-react";
import { PhotoProvider, PhotoView } from "react-photo-view";
import { Link } from "react-router-dom";

export const columns: ColumnDef<TProductList>[] = [
  {
    accessorKey: "mainImageUrl",
    colSpan: 1,
    header: () => <div className="font-semibold text-base"></div>,
    cell: (info) => {
      const mainImageUrl = info.getValue() as string;

      return (
        <div className="flex items-center justify-center min-w-0">
          {mainImageUrl ? (
            <PhotoProvider>
              <PhotoView src={mainImageUrl}>
                <img
                  src={mainImageUrl}
                  className="w-16 h-16 object-cover rounded-full hover:cursor-pointer border border-gray-300 flex-shrink-0"
                />
              </PhotoView>
            </PhotoProvider>
          ) : (
            <div className="w-16 h-16 object-cover rounded-full hover:cursor-pointer border border-gray-300 flex flex-item items-center justify-center flex-shrink-0">
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
    colSpan: 2,
    header: () => <div className="font-semibold text-base">Mã</div>,
    cell: (info) => {
      const code = info.getValue() as string;
      return (
        <div className="flex items-center gap-2 min-w-0 max-w-full">
          <Badge variant="secondary" className="font-mono text-base truncate max-w-[calc(100%-32px)]">
            {code}
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 flex-shrink-0"
            // onClick={ () => copyToClipboard( code, "Mã thương hiệu" ) }
          >
            <Copy className="h-3 w-3" />
          </Button>
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    colSpan: 2,
    header: () => <div className="font-semibold text-base">Tên sản phẩm</div>,
    cell: (info) => {
      const name = info.getValue() as string;
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="font-medium text-base truncate cursor-default">
                {name}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{name}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    accessorKey: "price",
    colSpan: 1,
    header: () => (
      <div className="text-center font-semibold text-base">Giá bán</div>
    ),
    cell: (info) => {
      const price = info.getValue() as number;
      return (
        <div className="flex justify-center min-w-0">
          <Badge
            className={cn(
              "bg-blue-100 text-blue-600 border-blue-600",
              "text-base truncate max-w-full"
            )}
          >
            {formatPrice(price)}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "stockQuantity",
    colSpan: 1,
    header: () => (
      <div className="text-center font-semibold text-base">Tồn kho</div>
    ),
    cell: (info) => {
      const stockQuantity = info.getValue() as number;
      return (
        <div className="flex justify-center min-w-0">
          <Badge
            className={cn(
              "bg-blue-100 text-blue-600 border-blue-600",
              "text-base truncate max-w-full"
            )}
          >
            {formatNumber(stockQuantity)}
          </Badge>
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
        <div className="flex justify-center min-w-0">
          <Badge
            className={cn(
              status === 0
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-600",
              "text-base truncate max-w-full whitespace-nowrap"
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
    colSpan: 1,
    header: () => (
      <div className="text-center font-semibold text-base">Thao tác</div>
    ),
    cell: ({ row }) => {
      const product = row.original;

      return (
        <div className="flex justify-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link to={PATH_BRAND_DASHBOARD.product.edit(product.id)}>
                  <Eye className="h-4 w-4 hover:cursor-pointer" />
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-base">Xem chi tiết</div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      );
    },
  },
];