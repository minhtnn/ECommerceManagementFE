import { PageLoader } from "@/components/LoadingScreen";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { usePost } from "@/hooks/use-post";
import { handleApiError } from "@/lib/error";
import { cn, formatDateTimeInShort } from "@/lib/utils";
import { TUpdatePost, UpdatePostSchema } from "@/schemas/post.schema";
import {
  ALLOWED_TRANSITIONS,
    EPostStatus,
    POST_STATUS_COLOR,
    POST_STATUS_LABEL,
} from "@/types/enums/post-status.enum";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Upload, X } from "lucide-react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import PostPreviewDialog from "./components/PostPreviewDialog";

// Content fields — nếu thay đổi thì phải về PendingReview
const CONTENT_DIRTY_FIELDS: (keyof TUpdatePost)[] = [
    "title", "slug", "content", "excerpt",
];

const PostEditPage = () => {
    const { id } = useParams<{ id: string }>();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [isImageChanged, setIsImageChanged] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [pendingFormData, setPendingFormData] = useState<FormData | null>(null);

    const { getSuspendPostById, updatePost } = usePost();
    const { data: postData, isError, error, isLoading } = getSuspendPostById(id!);

    if (isLoading) return <PageLoader />;
    if (isError && error) handleApiError(error);
    const post = postData.data.data;

    const form = useForm<TUpdatePost>({
        resolver: zodResolver(UpdatePostSchema),
        defaultValues: {
            id: post.id,
            title: post.title,
            slug: post.slug ?? "",
            excerpt: post.excerpt ?? "",
            content: post.content ?? "",
            status: post.status,
        },
    });

    const [imagePreview, setImagePreview] = useState<string | null>(
        post.imageUrl ?? null,
    );

    const updatePostMutation = updatePost(id!);

    // Kiểm tra content fields có bị thay đổi không
    const dirtyFields = form.formState.dirtyFields;
    const isContentDirty =
        CONTENT_DIRTY_FIELDS.some((f) => dirtyFields[f]) || isImageChanged;

    // Nếu content dirty → status bị ép về PendingReview
    // Nếu không → cho chọn trong danh sách transition hợp lệ
    const currentStatus = post.status as EPostStatus;
    const allowedStatuses: EPostStatus[] = isContentDirty
        ? [EPostStatus.PendingReview]
        : ALLOWED_TRANSITIONS[currentStatus];

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith("image/")) {
            toast.error("Vui lòng chọn file ảnh");
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            toast.error("Kích thước ảnh không vượt quá 5MB");
            return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result as string);
            setImageError(false);
        };
        reader.readAsDataURL(file);
        setImageFile(file);
        setIsImageChanged(true);
        // Ép status về PendingReview khi đổi ảnh
        form.setValue("status", EPostStatus.PendingReview);
    };

    const removeImage = () => {
        setImagePreview(null);
        setImageFile(null);
        setIsImageChanged(true);
        setImageError(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
        form.setValue("status", EPostStatus.PendingReview);
    };

    // Khi dirty field thay đổi → ép status
    const handleContentFieldChange = () => {
        if (!isContentDirty) {
            // Sẽ trở nên dirty sau khi onChange — setValue ngay
            form.setValue("status", EPostStatus.PendingReview);
        }
    };

    const onSubmit = (data: TUpdatePost) => {
        const hasFormChanges = Object.keys(dirtyFields).length > 0;
        if (!hasFormChanges && !isImageChanged) {
            toast.warning("Bạn chưa thay đổi dữ liệu nào!");
            return;
        }

        // Đảm bảo status đúng khi content dirty
        const finalStatus = isContentDirty
            ? EPostStatus.PendingReview
            : data.status;

        const formData = new FormData();
        formData.append("Id", data.id);
        formData.append("Title", data.title);
        if (data.slug) formData.append("Slug", data.slug);
        if (data.excerpt) formData.append("Excerpt", data.excerpt);
        if (data.content) formData.append("Content", data.content);
        formData.append("Status", finalStatus.toString());
        if (imageFile) formData.append("Image", imageFile);

        setPendingFormData(formData);
        setPreviewOpen(true);
    };

    const handleConfirm = async () => {
        if (!pendingFormData || updatePostMutation.isPending) return;
        try {
            const result = await updatePostMutation.mutateAsync(pendingFormData);
            if (result.data.status >= 200 && result.data.status < 300) {
                toast.success(result.data.message);
                setIsImageChanged(false);
                setPendingFormData(null);
                setPreviewOpen(false);
            }
        } catch (err) {
            handleApiError(err);
        }
    };

    const values = form.watch();

    // Status hiển thị trong preview (đã tính toán đúng)
    const previewStatus = isContentDirty ? EPostStatus.PendingReview : values.status;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Cập nhật bài đăng</h1>

            {/* Banner cảnh báo khi content thay đổi */}
            {isContentDirty && (
                <div className="flex items-center gap-2 px-4 py-3 rounded-lg border border-yellow-200 bg-yellow-50 text-yellow-800 text-sm">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <p>
                        Bạn đã thay đổi nội dung — bài đăng sẽ tự động chuyển về{" "}
                        <span className="font-semibold">Chờ duyệt</span> để admin xem xét lại.
                    </p>
                </div>
            )}

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                >
                    {/* ── Left: Image ── */}
                    <div className="bg-background rounded-lg border p-6">
                        <div className="flex flex-col items-center justify-center h-full border-2 border-dashed border-muted-foreground/25 rounded-lg p-8">
                            {imagePreview ? (
                                <div className="relative w-full max-w-[300px]">
                                    {imageError && !isImageChanged ? (
                                        <div className="w-full aspect-square bg-muted rounded-lg flex flex-col items-center justify-center gap-2">
                                            <Upload className="h-10 w-10 text-muted-foreground/50" />
                                            <p className="text-sm text-muted-foreground">Không thể tải ảnh</p>
                                            <p className="text-xs text-muted-foreground/70">URL có thể đã hết hạn</p>
                                        </div>
                                    ) : (
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="w-full h-auto rounded-lg object-cover"
                                            onError={() => setImageError(true)}
                                        />
                                    )}
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon"
                                        className="absolute -top-2 -right-2 h-8 w-8 rounded-full"
                                        onClick={removeImage}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                    <div className="mt-4 space-y-2">
                                        {imageFile ? (
                                            <>
                                                <p className="text-sm text-muted-foreground text-center">{imageFile.name}</p>
                                                <p className="text-xs text-muted-foreground text-center">
                                                    {`${(imageFile.size / 1024).toFixed(2)} KB`}
                                                </p>
                                            </>
                                        ) : (
                                            !imageError && (
                                                <p className="text-xs text-muted-foreground text-center">Ảnh hiện tại</p>
                                            )
                                        )}
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            className="w-full"
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            <Upload className="h-4 w-4 mr-2" />
                                            Thay đổi ảnh
                                        </Button>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleImageChange}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <Upload className="h-10 w-10 text-muted-foreground/50 mb-4" />
                                    <p className="text-muted-foreground mb-2">Chưa chọn hình ảnh</p>
                                    <p className="text-xs text-muted-foreground mb-4 text-center">
                                        Định dạng: JPG, PNG, GIF (Tối đa 5MB)
                                    </p>
                                    <label htmlFor="image-upload-edit">
                                        <Button type="button" variant="outline" asChild>
                                            <span>
                                                <Upload className="h-4 w-4 mr-2" />
                                                Tải lên
                                            </span>
                                        </Button>
                                    </label>
                                    <input
                                        ref={fileInputRef}
                                        id="image-upload-edit"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleImageChange}
                                    />
                                </>
                            )}
                        </div>
                    </div>

                    {/* ── Right: Fields ── */}
                    <div className="bg-background rounded-lg border p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold">Thông tin bài đăng</h2>

                            {/* Status selector — disabled + locked khi content dirty */}
                            <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem>
                                        {isContentDirty ? (
                                            // Khi content dirty: chỉ hiển thị badge PendingReview, không cho chọn
                                            <Badge className={cn(POST_STATUS_COLOR[EPostStatus.PendingReview], "text-sm px-3 py-1")}>
                                                {POST_STATUS_LABEL[EPostStatus.PendingReview]}
                                            </Badge>
                                        ) : allowedStatuses.length > 0 ? (
                                            <Select
                                                value={String(field.value)}
                                                onValueChange={(v) => field.onChange(Number(v))}
                                                disabled={updatePostMutation.isPending}
                                            >
                                                <SelectTrigger className="w-[160px]">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {/* Status hiện tại luôn hiển thị đầu tiên (readonly option) */}
                                                    <SelectItem value={String(currentStatus)}>
                                                        <Badge className={cn(POST_STATUS_COLOR[currentStatus], "text-sm")}>
                                                            {POST_STATUS_LABEL[currentStatus]}
                                                        </Badge>
                                                    </SelectItem>
                                                    {allowedStatuses
                                                        .filter((s) => s !== currentStatus)
                                                        .map((s) => (
                                                            <SelectItem key={s} value={String(s)}>
                                                                <Badge className={cn(POST_STATUS_COLOR[s], "text-sm")}>
                                                                    {POST_STATUS_LABEL[s]}
                                                                </Badge>
                                                            </SelectItem>
                                                        ))}
                                                </SelectContent>
                                            </Select>
                                        ) : (
                                            // Hidden hoặc không có transition nào → chỉ hiển thị badge
                                            <Badge className={cn(POST_STATUS_COLOR[currentStatus], "text-sm px-3 py-1")}>
                                                {POST_STATUS_LABEL[currentStatus]}
                                            </Badge>
                                        )}
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm font-medium mb-1">Mã bài đăng</p>
                                <div className="h-10 px-3 py-2 border rounded-md bg-muted text-sm">{post.code}</div>
                            </div>
                            {post.author && (
                                <div>
                                    <p className="text-sm font-medium mb-1">Tác giả</p>
                                    <div className="h-10 px-3 py-2 border rounded-md bg-muted text-sm">{post.author}</div>
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem className="col-span-2">
                                        <FormLabel>
                                            Tiêu đề <span className="text-destructive">*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Nhập tiêu đề"
                                                {...field}
                                                disabled={updatePostMutation.isPending}
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                    handleContentFieldChange();
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="slug"
                                render={({ field }) => (
                                    <FormItem className="col-span-2">
                                        <FormLabel>Slug</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="vd: bai-dang-moi"
                                                {...field}
                                                disabled={updatePostMutation.isPending}
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                    handleContentFieldChange();
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="excerpt"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tóm tắt</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Nhập tóm tắt"
                                            rows={3}
                                            {...field}
                                            disabled={updatePostMutation.isPending}
                                            onChange={(e) => {
                                                field.onChange(e);
                                                handleContentFieldChange();
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nội dung</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Nhập nội dung"
                                            rows={6}
                                            {...field}
                                            disabled={updatePostMutation.isPending}
                                            onChange={(e) => {
                                                field.onChange(e);
                                                handleContentFieldChange();
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-between items-center pt-2">
                            <p className="text-sm text-muted-foreground">
                                Cập nhật:{" "}
                                {formatDateTimeInShort(post.lastModifiedDate ?? post.createdDate)}
                            </p>
                            <Button
                                type="submit"
                                className="bg-primary hover:bg-primary/90"
                                disabled={updatePostMutation.isPending}
                            >
                                Xem trước & Lưu
                            </Button>
                        </div>
                    </div>
                </form>
            </Form>

            <PostPreviewDialog
                open={previewOpen}
                onClose={() => setPreviewOpen(false)}
                onConfirm={handleConfirm}
                isLoading={updatePostMutation.isPending}
                data={{
                    code: post.code,
                    title: values.title,
                    slug: values.slug,
                    excerpt: values.excerpt,
                    content: values.content,
                    status: previewStatus,   // status đã được tính đúng
                    imagePreview,
                    author: post.author,
                }}
            />
        </div>
    );
};

export default PostEditPage;