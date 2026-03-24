// src/pages/components/PostPreviewOverlay.tsx
import { cn } from "@/lib/utils";
import {
    EPostStatus,
    POST_STATUS_COLOR,
    POST_STATUS_LABEL,
} from "@/types/enums/post-status.enum";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, ImageOff, Calendar, Clock, BookOpen, User, Tag, X } from "lucide-react";
import DOMPurify from "dompurify";

interface PostPreviewOverlayProps {
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

const estimateReadingTime = (text?: string | null) => {
    if (!text) return 1;
    const plain = text.replace(/<[^>]*>/g, " ");
    return Math.max(1, Math.ceil(plain.split(/\s+/).filter(Boolean).length / 200));
};

const PostPreviewOverlay = ({
    open,
    onClose,
    onConfirm,
    isLoading = false,
    data,
}: PostPreviewOverlayProps) => {
    if (!open) return null;

    const plainText = (data.content ?? "").replace(/<[^>]*>/g, " ");
    const words = plainText.split(/\s+/).filter(Boolean).length;
    const readingTime = estimateReadingTime(data.content);
    const today = new Date().toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });

    return (
        // Full screen overlay — fixed, z-50, đè lên tất cả
        <div className="fixed inset-0 z-50 flex flex-col bg-background">

            {/* ── Toolbar cố định phía trên ── */}
            <div className="shrink-0 flex items-center justify-between
                            px-5 py-3 border-b border-border/50 bg-background shadow-sm">
                <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-primary/10
                                    flex items-center justify-center">
                        <Eye className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <div>
                        <p className="text-sm font-medium leading-none">
                            Xem trước bài đăng
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            Giao diện thực tế khi hiển thị công khai
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Badge className={`text-xs ${POST_STATUS_COLOR[data.status]}`}>
                        {POST_STATUS_LABEL[data.status]}
                    </Badge>
                    <button
                        onClick={onClose}
                        className="w-7 h-7 rounded-md flex items-center justify-center
                                   text-muted-foreground hover:text-foreground
                                   hover:bg-muted transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* ── Scrollable body — GIỐNG HỆT PublicPostDetailPage ── */}
            <div className="flex-1 overflow-y-auto">
                <div className="container mx-auto px-4 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

                        {/* ── Sidebar placeholder ── */}
                        <aside className="lg:col-span-1 order-2 lg:order-1">
                            <div className="sticky top-4">
                                <h3 className="font-bold text-foreground mb-4
                                               uppercase tracking-wide text-sm">
                                    Bài đăng khác
                                </h3>
                                <div className="space-y-4">
                                    {Array.from({ length: 3 }).map((_, i) => (
                                        <div key={i} className="flex gap-3">
                                            <div className="w-16 h-12 rounded bg-muted
                                                            flex-shrink-0 flex items-center
                                                            justify-center">
                                                <ImageOff className="w-4 h-4 text-muted-foreground/30" />
                                            </div>
                                            <div className="flex-1 space-y-2">
                                                <div className="h-3 rounded bg-muted w-full" />
                                                <div className="h-3 rounded bg-muted w-3/4" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </aside>

                        {/* ── Main content — copy y chang PublicPostDetailPage ── */}
                        <main className="lg:col-span-3 order-1 lg:order-2 min-w-0">

                            {/* Header */}
                            <header className="mb-8">
                                <h1 className="text-2xl md:text-3xl font-bold
                                               text-foreground mb-4 leading-tight">
                                    {data.title || (
                                        <span className="text-muted-foreground italic">
                                            Chưa có tiêu đề
                                        </span>
                                    )}
                                </h1>
                                <div className="flex flex-wrap items-center gap-x-4
                                                gap-y-1.5 text-sm text-muted-foreground">
                                    {data.author && (
                                        <span className="flex items-center gap-1.5">
                                            <User className="w-3.5 h-3.5" />
                                            {data.author}
                                        </span>
                                    )}
                                    <span className="flex items-center gap-1.5">
                                        <Calendar className="w-3.5 h-3.5" />
                                        {today}
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <Clock className="w-3.5 h-3.5" />
                                        {readingTime} phút đọc
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <BookOpen className="w-3.5 h-3.5" />
                                        {words} từ
                                    </span>
                                    {data.slug && (
                                        <span className="flex items-center gap-1.5">
                                            <Tag className="w-3.5 h-3.5" />
                                            <span className="font-mono text-xs">
                                                /{data.slug}
                                            </span>
                                        </span>
                                    )}
                                </div>
                            </header>

                            {/* Featured image */}
                            <div className="aspect-video rounded-lg overflow-hidden
                                            bg-muted mb-8 flex items-center justify-center">
                                {data.imagePreview ? (
                                    <img
                                        src={data.imagePreview}
                                        alt={data.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="flex flex-col items-center gap-2
                                                    text-muted-foreground/30">
                                        <ImageOff className="w-12 h-12" />
                                        <span className="text-sm">Chưa có ảnh bìa</span>
                                    </div>
                                )}
                            </div>

                            {/* Excerpt */}
                            {data.excerpt && (
                                <div className="mb-6 pl-4 border-l-2 border-primary/40">
                                    <p className="text-muted-foreground
                                                  leading-relaxed italic">
                                        {data.excerpt}
                                    </p>
                                </div>
                            )}

                            {/* Content — dùng y chang PublicPostDetailPage */}
                            {data.content ? (
                                <article
                                    className={cn(
                                        "prose prose-lg max-w-none text-foreground rich-content",
                                        "prose-headings:text-foreground prose-headings:font-bold",
                                        "prose-h1:text-3xl prose-h1:mt-8 prose-h1:mb-4",
                                        "prose-h2:text-2xl prose-h2:mt-7 prose-h2:mb-3",
                                        "prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3",
                                        "prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-2",
                                        "prose-strong:text-foreground",
                                        "prose-em:text-primary",
                                        "prose-ul:text-muted-foreground prose-ul:my-4 prose-ul:list-disc prose-ul:pl-6",
                                        "prose-ol:text-muted-foreground prose-ol:my-4 prose-ol:list-decimal prose-ol:pl-6",
                                        "prose-li:my-1",
                                        "prose-blockquote:border-l-4 prose-blockquote:border-primary/40",
                                        "prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-muted-foreground",
                                        "prose-a:text-primary prose-a:underline prose-a:underline-offset-2",
                                        "prose-code:text-sm prose-code:font-mono prose-code:bg-muted prose-code:px-1 prose-code:rounded",
                                        "prose-pre:bg-muted prose-pre:rounded-lg prose-pre:p-4 prose-pre:my-4 prose-pre:overflow-x-auto",
                                        "prose-hr:border-border prose-hr:my-8",
                                    )}
                                    dangerouslySetInnerHTML={{
                                        __html: DOMPurify.sanitize(data.content, {
                                            ALLOWED_TAGS: [
                                                "p", "br", "strong", "em", "s", "u",
                                                "h1", "h2", "h3",
                                                "ul", "ol", "li",
                                                "blockquote", "hr",
                                                "img", "a",
                                                "pre", "code", "span",
                                            ],
                                            ALLOWED_ATTR: [
                                                "src", "alt", "href", "target", "class",
                                                "style",
                                                "data-alignment",
                                                "width", "height",
                                            ],
                                            ADD_DATA_URI_TAGS: ["img"],
                                        }),
                                    }}
                                />
                            ) : (
                                <p className="text-muted-foreground italic">
                                    Bài đăng này chưa có nội dung.
                                </p>
                            )}
                        </main>
                    </div>
                </div>
            </div>

            {/* ── Footer cố định phía dưới ── */}
            <div className="shrink-0 flex items-center justify-between
                            px-5 py-3.5 border-t border-border/50 bg-muted/30 shadow-sm">
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
        </div>
    );
};

export default PostPreviewOverlay;