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
import { TPostList } from "@/schemas/post.schema";
import {
  EPostStatus,
  POST_STATUS_COLOR,
  POST_STATUS_LABEL,
} from "@/types/enums/post-status.enum";
import type { ColumnDef } from "@tanstack/react-table";
import { Copy, Eye, ImageOff } from "lucide-react";
import { PhotoProvider, PhotoView } from "react-photo-view";
import { Link } from "react-router-dom";

export const columns: ColumnDef<TPostList>[] = [
  {
    accessorKey: "imageUrl",
    header: () => <div className="font-semibold text-base"></div>,
    cell: (info) => {
      const imageUrl = info.getValue() as string;
      return (
        <div className="flex items-center gap-2 justify-center">
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
            <div className="w-16 h-16 rounded-full border border-gray-300 flex items-center justify-center">
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
          <Badge variant="secondary" className="font-mono text-base">
            {code}
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={() => copyToClipboard(code, "Mã bài đăng")}
          >
            <Copy className="h-3 w-3" />
          </Button>
        </div>
      );
    },
  },
  {
    accessorKey: "title",
    header: () => <div className="font-semibold text-base">Tiêu đề</div>,
    cell: (info) => {
      const title = info.getValue() as string;
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <div className="font-medium text-base max-w-[300px] truncate">
                {title}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{title}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    accessorKey: "status",
    header: () => <div className="font-semibold text-base">Trạng thái</div>,
    cell: (info) => {
      const status = info.getValue() as EPostStatus;
      return (
        <div className="flex justify-center">
          <Badge className={cn(POST_STATUS_COLOR[status], "text-base")}>
            {POST_STATUS_LABEL[status]}
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
      const post = row.original;
      return (
        <div className="flex justify-center">
          <TooltipProvider>
            <Tooltip>
              <Link to={PATH_BRAND_DASHBOARD.posts.edit(post.id)}>
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
