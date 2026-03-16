import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { usePost } from "@/hooks/use-post";
import { handleApiError } from "@/lib/error";
import { CreatePostSchema, TCreatePost } from "@/schemas/post.schema";
import { EPostStatus } from "@/types/enums/post-status.enum";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload, X } from "lucide-react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import PostPreviewDialog from "./components/PostPreviewDialog";

const PostCreatePage = () => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [pendingFormData, setPendingFormData] = useState<FormData | null>(null);

    const { createPost } = usePost();
    const createPostMutation = createPost();

    const form = useForm<TCreatePost>({
        resolver: zodResolver(CreatePostSchema),
        defaultValues: { code: "", title: "", slug: "", excerpt: "", content: "" },
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith("image/")) { toast.error("Vui lòng chọn file ảnh"); return; }
        if (file.size > 5 * 1024 * 1024) { toast.error("Kích thước ảnh không vượt quá 5MB"); return; }
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result as string);
        reader.readAsDataURL(file);
        setImageFile(file);
    };

    const removeImage = () => {
        setImagePreview(null);
        setImageFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    // Step 1: validate → build FormData → open preview
    const onSubmit = (data: TCreatePost) => {
        const formData = new FormData();
        formData.append("Code", data.code);
        formData.append("Title", data.title);
        if (data.slug) formData.append("Slug", data.slug);
        if (data.excerpt) formData.append("Excerpt", data.excerpt);
        if (data.content) formData.append("Content", data.content);
        if (imageFile) formData.append("Image", imageFile);
        setPendingFormData(formData);
        setPreviewOpen(true);
    };

    // Step 2: user confirmed in dialog → actually submit
    const handleConfirm = async () => {
        if (!pendingFormData || createPostMutation.isPending) return;
        try {
            const result = await createPostMutation.mutateAsync(pendingFormData);
            if (result?.data?.status >= 200 && result?.data?.status < 300) {
                toast.success("Tạo bài đăng thành công");
                form.reset();
                setImageFile(null);
                setImagePreview(null);
                setPendingFormData(null);
                setPreviewOpen(false);
            }
        } catch (err) {
            handleApiError(err);
        }
    };

    const values = form.watch();

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Tạo bài đăng mới</h1>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* ── Left: Image upload ── */}
                    <div className="bg-background rounded-lg border p-6">
                        <div className="flex flex-col items-center justify-center h-full border-2 border-dashed border-muted-foreground/25 rounded-lg p-8">
                            {imagePreview ? (
                                <div className="relative w-full max-w-[300px]">
                                    <img src={imagePreview} alt="Preview" className="w-full h-auto rounded-lg object-cover" />
                                    <Button type="button" variant="destructive" size="icon"
                                        className="absolute -top-2 -right-2 h-8 w-8 rounded-full" onClick={removeImage}>
                                        <X className="h-4 w-4" />
                                    </Button>
                                    <div className="mt-4 space-y-2">
                                        <p className="text-sm text-muted-foreground text-center">{imageFile?.name}</p>
                                        <p className="text-xs text-muted-foreground text-center">
                                            {imageFile && `${(imageFile.size / 1024).toFixed(2)} KB`}
                                        </p>
                                        <Button type="button" variant="outline" size="sm" className="w-full"
                                            onClick={() => fileInputRef.current?.click()}>
                                            <Upload className="h-4 w-4 mr-2" />Thay đổi ảnh
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <Upload className="h-10 w-10 text-muted-foreground/50 mb-4" />
                                    <p className="text-muted-foreground mb-2">Chưa chọn hình ảnh</p>
                                    <p className="text-xs text-muted-foreground mb-4 text-center">Định dạng: JPG, PNG, GIF (Tối đa 5MB)</p>
                                    <label htmlFor="image-upload">
                                        <Button type="button" variant="outline" asChild>
                                            <span><Upload className="h-4 w-4 mr-2" />Tải lên</span>
                                        </Button>
                                    </label>
                                    <input ref={fileInputRef} id="image-upload" type="file" accept="image/*"
                                        className="hidden" onChange={handleImageChange} />
                                </>
                            )}
                        </div>
                    </div>

                    {/* ── Right: Fields ── */}
                    <div className="bg-background rounded-lg border p-6 space-y-4">
                        <h2 className="text-lg font-semibold">Thông tin bài đăng</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="code" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Mã bài đăng <span className="text-destructive">*</span></FormLabel>
                                    <FormControl><Input placeholder="Nhập mã" {...field} disabled={createPostMutation.isPending} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="slug" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Slug</FormLabel>
                                    <FormControl><Input placeholder="vd: bai-dang-moi" {...field} disabled={createPostMutation.isPending} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </div>
                        <FormField control={form.control} name="title" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tiêu đề <span className="text-destructive">*</span></FormLabel>
                                <FormControl><Input placeholder="Nhập tiêu đề bài đăng" {...field} disabled={createPostMutation.isPending} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="excerpt" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tóm tắt</FormLabel>
                                <FormControl><Textarea placeholder="Nhập tóm tắt ngắn" rows={3} {...field} disabled={createPostMutation.isPending} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="content" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nội dung</FormLabel>
                                <FormControl><Textarea placeholder="Nhập nội dung bài đăng" rows={6} {...field} disabled={createPostMutation.isPending} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <div className="flex justify-end pt-2">
                            <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={createPostMutation.isPending}>
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
                isLoading={createPostMutation.isPending}
                data={{
                    code: values.code,
                    title: values.title,
                    slug: values.slug,
                    excerpt: values.excerpt,
                    content: values.content,
                    status: EPostStatus.PendingReview,
                    imagePreview,
                    author: undefined,
                }}
            />
        </div>
    );
};

export default PostCreatePage;