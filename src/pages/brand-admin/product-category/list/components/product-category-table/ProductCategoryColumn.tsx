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
import { TProductCategoryList } from "@/schemas/product-category.schema";
import type { ColumnDef } from "@tanstack/react-table";
import { Copy, Eye, ImageOff } from "lucide-react";
import { PhotoProvider, PhotoView } from "react-photo-view";
import { Link } from "react-router-dom";

export const columns: ColumnDef<TProductCategoryList>[] = [
  {
    accessorKey: "imageUrl",
    header: () => <div className="font-semibold text-base"></div>,
    // <div className="font-semibold text-base">Ảnh</div>,
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
    header: () => <div className="font-semibold text-base">Mã</div>,
    cell: (info) => {
      const code = info.getValue() as string;
      return (
        <div className="flex items-center gap-2">
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
    header: () => <div className="font-semibold text-base">Tên danh mục</div>,
    cell: (info) => {
      const name = info.getValue() as string;
      return (
        <div className="font-medium truncate text-base truncate">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>{name}</TooltipTrigger>
            </Tooltip>
          </TooltipProvider>
        </div>
      );
    },
  },
  {
    id: "categoryType",
    header: () => (
      <div className="text-center font-semibold text-base">Loại danh mục</div>
    ),
    cell: ({ row }) => {
      const isLeafOnly = row.original.isLeafOnly as boolean;
      const level = row.original.level as number;
      const isParent = (isLeafOnly && level === 1) || !isLeafOnly;
      return (
        <div className="flex justify-center">
          <Badge
            className={cn(
              isParent
                ? "bg-purple-100 text-purple-600 border-purple-600"
                : "bg-blue-100 text-blue-600 border-blue-600",
              "text-base",
            )}
          >
            {isParent ? "Danh mục cha" : "Danh mục con"}
          </Badge>
        </div>
      );
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
              "text-base",
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
      const productCategory = row.original;

      return (
        <div className="flex justify-center">
          <TooltipProvider>
            <Tooltip>
              <Link
                to={PATH_BRAND_DASHBOARD.productCategory.edit(
                  productCategory.id,
                )}
              >
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
