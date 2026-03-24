import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  EPostStatus,
  POST_STATUS_COLOR,
  POST_STATUS_LABEL,
} from "@/types/enums/post-status.enum";
import { BookOpen, Calendar, Clock, Eye, Tag, User, X } from "lucide-react";
import DOMPurify from "dompurify";
import { cn } from "@/lib/utils";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

interface PostPreviewDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
  data: {
    code: string;
    title: string;
    slug?: string | null;
    excerpt?: string | null;
    content?: string | null;
    status: EPostStatus;
    imagePreview?: string | null;
    author?: string | null;
  };
}

const PostPreviewDialog = ({
  open,
  onClose,
  onConfirm,
  isLoading = false,
  data,
}: PostPreviewDialogProps) => {
  const words = (data.content ?? "").split(/\s+/).filter(Boolean).length;
  const readingTime = Math.max(1, Math.ceil(words / 200));

  const today = new Date().toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-4xl w-full p-0 overflow-hidden rounded-2xl gap-0 border-0 shadow-2xl">
        {/* ── Toolbar ── */}
        <DialogHeader className="flex flex-row items-center justify-between px-5 py-3 border-b border-border/50 bg-background shrink-0">
          <VisuallyHidden.Root>
            <DialogTitle>Xem trước bài đăng</DialogTitle>
            <DialogDescription>
              Xem trước nội dung bài đăng trước khi lưu
            </DialogDescription>
          </VisuallyHidden.Root>
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
              <Eye className="w-3.5 h-3.5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium leading-none">
                Xem trước bài đăng
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Kiểm tra nội dung trước khi lưu
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 pr-6">
            <Badge className={`text-xs ${POST_STATUS_COLOR[data.status]}`}>
              {POST_STATUS_LABEL[data.status]}
            </Badge>
            {/* <button
              onClick={onClose}
              className="w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button> */}
          </div>
        </DialogHeader>

        {/* ── Scrollable article body ── */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Hero image */}
          {data.imagePreview && (
            <div className="relative w-full aspect-[21/9] overflow-hidden bg-muted">
              <img
                src={data.imagePreview}
                alt={data.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            </div>
          )}

          <div
            className={`px-8 py-7 max-w-2xl mx-auto ${!data.imagePreview ? "pt-8" : ""}`}
          >
            {/* Category / code badge */}
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-flex items-center gap-1 text-xs font-medium text-primary bg-primary/8 border border-primary/15 rounded-full px-2.5 py-1">
                <Tag className="w-2.5 h-2.5" />
                {data.code}
              </span>
              {data.slug && (
                <span className="text-xs text-muted-foreground font-mono truncate max-w-[180px]">
                  /{data.slug}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold leading-tight tracking-tight mb-4 text-foreground">
              {data.title || (
                <span className="text-muted-foreground italic">
                  Chưa có tiêu đề
                </span>
              )}
            </h1>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground mb-5 pb-5 border-b border-border/50">
              {data.author && (
                <span className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-full bg-primary/15 flex items-center justify-center text-[9px] font-bold text-primary">
                    {data.author.charAt(0).toUpperCase()}
                  </div>
                  <span>{data.author}</span>
                </span>
              )}
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {today}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {readingTime} phút đọc
              </span>
              <span className="flex items-center gap-1">
                <BookOpen className="w-3 h-3" />
                {words} từ
              </span>
            </div>

            {/* Excerpt */}
            {data.excerpt && (
              <div className="mb-5 pl-4 border-l-2 border-primary/40">
                <p className="text-sm text-muted-foreground leading-relaxed italic">
                  {data.excerpt}
                </p>
              </div>
            )}

            {/* Content */}
            {data.content ? (
              <div
                className={cn(
                  "prose prose-lg max-w-none text-foreground rich-content",
                  "prose prose-sm max-w-none text-foreground/90 leading-relaxed rich-content",
                  "prose prose-sm max-w-none text-foreground/90 leading-relaxed",
                  "[&_img]:rounded-lg [&_img]:max-w-full [&_img]:h-auto [&_img]:my-4 [&_img]:block",
                  "[&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mt-6 [&_h1]:mb-3",
                  "[&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-5 [&_h2]:mb-2",
                  "[&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-4 [&_h3]:mb-2",
                  "[&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6",
                  "[&_blockquote]:border-l-4 [&_blockquote]:border-primary/40 [&_blockquote]:pl-4 [&_blockquote]:italic",
                  "[&_a]:text-primary [&_a]:underline",
                  "[&_pre]:bg-muted [&_pre]:rounded-lg [&_pre]:p-4 [&_pre]:my-4",
                  "[&_code]:text-sm [&_code]:font-mono",
                  "[&_hr]:border-border [&_hr]:my-6",
                )}
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(data.content, {
                    ALLOWED_TAGS: [
                      "p",
                      "br",
                      "strong",
                      "em",
                      "s",
                      "u",
                      "h1",
                      "h2",
                      "h3",
                      "ul",
                      "ol",
                      "li",
                      "blockquote",
                      "hr",
                      "img",
                      "a",
                      "pre",
                      "code",
                      "span",
                    ],
                    ALLOWED_ATTR: [
                      "src",
                      "alt",
                      "href",
                      "target",
                      "class",
                      "style",
                      "data-alignment",
                      "width",
                      "height",
                    ],
                    // Cho phép base64 để preview ảnh chưa upload
                    ADD_DATA_URI_TAGS: ["img"],
                  }),
                }}
              />
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-3">
                  <BookOpen className="w-5 h-5 text-muted-foreground/50" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Chưa có nội dung
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ── Footer actions ── */}
        <div className="shrink-0 flex items-center justify-between px-5 py-3.5 border-t border-border/50 bg-muted/30">
          <p className="text-xs text-muted-foreground">
            Đây là bản xem trước — nội dung thực tế có thể khác khi hiển thị.
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isLoading}
              className="h-8 px-4 text-xs"
            >
              Chỉnh sửa lại
            </Button>
            <Button
              size="sm"
              onClick={onConfirm}
              disabled={isLoading}
              className="h-8 px-4 text-xs bg-primary hover:bg-primary/90"
            >
              {isLoading ? "Đang lưu..." : "Xác nhận & Lưu"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PostPreviewDialog;
