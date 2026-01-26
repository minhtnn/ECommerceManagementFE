import { PageLoader } from "@/components/LoadingScreen";
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
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useProductCategory } from "@/hooks/use-product-category";
import { handleApiError } from "@/lib/error";
import { cn, formatDateTimeInShort } from "@/lib/utils";
import {
  TUpdateProductCategory,
  UpdateProductCategorySchema,
} from "@/schemas/product-category.schema";
import { ECategoryStatus } from "@/types/enums/product-category-status.enum";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

const ProductCategoryEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isImageChanged, setIsImageChanged] = useState(false);
  const [imageError, setImageError] = useState(false);

  const [open, setOpen] = useState(false);
  const {
    getProductCategoryById,
    getProductCategorySuspendById,
    updateProductCategory,
  } = useProductCategory();

  const {
    data: productCategoryData,
    isError,
    error,
    isLoading,
  } = getProductCategorySuspendById(id);
  var productCategory = productCategoryData.data.data;
  const form = useForm<TUpdateProductCategory>({
    resolver: zodResolver(UpdateProductCategorySchema),
    defaultValues: {
      id: productCategory.id,
      name: productCategory.name,
      description: productCategory.description,
      displayOrder: productCategory.displayOrder,
      status: productCategory.status,
    },
  });

  if (isLoading) {
    return <PageLoader />;
  }

  if (isError && error) {
    handleApiError(error);
  }
  const updateProductCategoryMutation = updateProductCategory(id!);

  useEffect(() => {
    if (!productCategory.imageUrl) return;

    // Chỉ set image preview từ server khi chưa có thay đổi từ user
    if (!isImageChanged) {
      setImagePreview(productCategory.imageUrl);
      setImageError(false);
    }
  }, [productCategory.imageUrl, isImageChanged]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Vui lòng chọn file ảnh");
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      alert("Kích thước ảnh không được vượt quá 5MB");
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
      setImageError(false);
    };
    reader.readAsDataURL(file);

    // Store file for upload
    setImageFile(file);
    setIsImageChanged(true);
  };

  const removeImage = () => {
    setImagePreview(null);
    setImageFile(null);
    setIsImageChanged(true);
    setImageError(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Xử lý khi ảnh từ signed URL bị lỗi (expired hoặc không load được)
  const handleImageError = () => {
    setImageError(true);
  };

  const onSubmit = async (data: TUpdateProductCategory) => {
    const hasFormChanges = Object.keys(form.formState.dirtyFields).length > 0;
    const hasImageChanges = isImageChanged;

    if (!hasFormChanges && !hasImageChanges) {
      toast.warning("Bạn chưa thay đổi dữ kiện nào!");
      return;
    }

    if (updateProductCategoryMutation.isPending) return;

    const formData = new FormData();
    formData.append("Id", data.id);
    formData.append("Name", data.name);
    if (data.description) {
      formData.append("Description", data.description);
    }

    // Add image if exists
    if (imageFile) {
      formData.append("Image", imageFile);
    }

    formData.append("DisplayOrder", data.displayOrder.toString());
    formData.append("Status", data.status.toString());

    try {
      const result = await updateProductCategoryMutation.mutateAsync(formData);
      if (result.data.status >= 200 && result.data.status < 300) {
        toast.success(result.data.message);
      }
    } catch (err) {
      handleApiError(err);
    }
  };
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Cập nhật danh mục</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Left side - Image upload */}
          <div className="bg-background rounded-lg border p-6">
            <div className="flex flex-col items-center justify-center h-full border-2 border-dashed border-muted-foreground/25 rounded-lg p-8">
              {imagePreview ? (
                <div className="relative w-full max-w-[300px]">
                  {/* Hiển thị ảnh hoặc placeholder khi lỗi */}
                  {imageError && !isImageChanged ? (
                    <div className="w-full aspect-square bg-muted rounded-lg flex flex-col items-center justify-center gap-4">
                      <div className="text-center">
                        <Upload className="h-10 w-10 text-muted-foreground/50 mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">
                          Không thể tải ảnh
                        </p>
                        <p className="text-xs text-muted-foreground/70">
                          URL có thể đã hết hạn
                        </p>
                      </div>
                    </div>
                  ) : (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-auto rounded-lg object-cover"
                      onError={handleImageError}
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
                    {imageFile && (
                      <>
                        <p className="text-sm text-muted-foreground text-center">
                          {imageFile.name}
                        </p>
                        <p className="text-xs text-muted-foreground text-center">
                          {`${(imageFile.size / 1024).toFixed(2)} KB`}
                        </p>
                      </>
                    )}
                    {!imageFile && !imageError && (
                      <p className="text-xs text-muted-foreground text-center">
                        Ảnh hiện tại
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  <Upload className="h-10 w-10 text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground mb-2">
                    Chưa chọn hình ảnh
                  </p>
                  <p className="text-xs text-muted-foreground mb-4 text-center">
                    Định dạng: JPG, PNG, GIF (Tối đa 5MB)
                  </p>
                  <label htmlFor="image-upload">
                    <Button type="button" variant="outline" asChild>
                      <span>
                        <Upload className="h-4 w-4 mr-2" />
                        Tải lên
                      </span>
                    </Button>
                  </label>
                  <input
                    ref={fileInputRef}
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </>
              )}
            </div>
          </div>

          {/* Right side - Category info */}
          <div className="bg-background rounded-lg border p-6 space-y-6">
            {/* Header with status toggle */}
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Thông tin danh mục</h2>
              <div className="flex items-center">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormLabel htmlFor="code">Trạng thái</FormLabel>
                      <FormControl className="flex items-center">
                        <Switch
                          checked={field.value === ECategoryStatus.Active}
                          onCheckedChange={(checked) =>
                            field.onChange(
                              checked
                                ? ECategoryStatus.Active
                                : ECategoryStatus.Inactive,
                            )
                          }
                          disabled={updateProductCategoryMutation.isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div
              className={cn(
                productCategory.parentProductCategoryName != null
                  ? "grid grid-cols-2 gap-4"
                  : "",
              )}
            >
              <div>
                <Label>Mã danh mục</Label>
                <div className="h-10 px-3 py-2 border rounded-md bg-muted">
                  {productCategory.code}
                </div>
              </div>
              {productCategory.parentProductCategoryName != null && (
                <div>
                  <Label>Danh mục cha</Label>
                  <div className="h-10 px-3 py-2 border rounded-md bg-muted">
                    {productCategory.parentProductCategoryName}
                  </div>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="name">
                      Tên danh mục<span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Nhập tên danh mục"
                        {...field}
                        disabled={updateProductCategoryMutation.isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="configuration">Mô tả</FormLabel>
                    <FormControl>
                      <Textarea
                        id="description"
                        placeholder="Mô tả về danh mục"
                        {...field}
                        disabled={updateProductCategoryMutation.isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="displayOrder"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="displayOrder">
                      Thứ tự hiển thị
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        min={1}
                        onChange={(e) => {
                          const value =
                            e.target.value === "" ? "" : Number(e.target.value);
                          field.onChange(value);
                        }}
                        disabled={updateProductCategoryMutation.isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/* Submit button */}
            <div className="flex justify-between items-center pt-4">
              <div className="text-gray">
                Ngày cập nhật:{" "}
                {formatDateTimeInShort(
                  productCategory.lastModifiedDate
                    ? productCategory.lastModifiedDate
                    : productCategory.createdDate,
                )}
              </div>
              <Button
                type="submit"
                className="bg-primary hover:bg-primary/90"
                disabled={updateProductCategoryMutation.isPending}
              >
                Lưu
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ProductCategoryEditPage;
