//#region Import library
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useProduct } from "@/hooks/use-product";
import { useProductCategory } from "@/hooks/use-product-category";
import { useQueryParams } from "@/hooks/use-query-params";
import { handleApiError } from "@/lib/error";
import { cn } from "@/lib/utils";
import { CreateProductSchema, TCreateProduct } from "@/schemas/product.schema";
import { EProductStatus } from "@/types/enums/product-status.enum";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  CheckIcon,
  ChevronsUpDownIcon,
  LoaderCircleIcon,
  PlusIcon,
  TrashIcon,
  Upload,
  X
} from "lucide-react";
import { useRef, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

//#endregion

const ProductCreatePage = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    currentPage: currentCategoryPage,
    pageSize: pageCategorySize,
    sortBy: sortCategoryBy,
    isAsc: isCategoryAsc,
    filter: filterCategory,
  } = useQueryParams({
    defaultSortBy: "name",
    defaultFilter: [
      { id: "name", value: "" },
      { id: "code", value: null },
    ],
  });
  const { createProduct } = useProduct();
  const { getProductCategories } = useProductCategory();

  const {
    data: categoryData,
    error: categoryError,
    isError: isCategoryError,
    isLoading: isCategoryLoading,
  } = getProductCategories({
    page: currentCategoryPage,
    size: pageCategorySize,
    sortBy: sortCategoryBy,
    isAsc: isCategoryAsc,
    isLeafOnly: true,
    status: EProductStatus.Active,
  });
  const createProductMutation = createProduct();
  const form = useForm<TCreateProduct>({
    resolver: zodResolver(CreateProductSchema),
    defaultValues: {
      productCategoryId: "",
      code: "",
      name: "",
      fullName: "",
      description: "",
      price: 0,
      status: EProductStatus.Active,
      stockQuantity: 0,
      images: [],
      sideAttributes: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "sideAttributes",
  });
  const categories = categoryData?.data?.data?.items || [];

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    // Validate total images (existing + new <= 4)
    if (imageFiles.length + files.length > 4) {
      alert("Chỉ được upload tối đa 4 ảnh");
      return;
    }

    // Validate each file
    const validFiles: File[] = [];
    const newPreviews: string[] = [];

    files.forEach((file) => {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert(`File ${file.name} không phải là ảnh`);
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert(`File ${file.name} vượt quá 5MB`);
        return;
      }

      validFiles.push(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result as string);
        if (newPreviews.length === validFiles.length) {
          setImagePreviews((prev) => [...prev, ...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    });

    setImageFiles((prev) => [...prev, ...validFiles]);

    // Update form images metadata
    const currentImages = form.getValues("images") || [];
    const newImages = validFiles.map((_, index) => ({
      altText: "",
      isMainImage: currentImages.length === 0 && index === 0, // First image is main
    }));
    form.setValue("images", [...currentImages, ...newImages]);
  };

  const removeImage = (index: number) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setImageFiles((prev) => prev.filter((_, i) => i !== index));

    const currentImages = form.getValues("images") || [];
    form.setValue(
      "images",
      currentImages.filter((_, i) => i !== index),
    );
  };

  const setMainImage = (index: number) => {
    const currentImages = form.getValues("images") || [];
    const updatedImages = currentImages.map((img, i) => ({
      ...img,
      isMainImage: i === index,
    }));
    form.setValue("images", updatedImages);
  };

  const onSubmit = async (data: TCreateProduct) => {
    if (createProductMutation.isPending) return;

    // Validate có ít nhất 1 ảnh nếu status = Active
    // if (data.status === EProductStatus.Active && imageFiles.length === 0) {
    //     toast.error("Sản phẩm đang hoạt động phải có ít nhất 1 ảnh");
    //     return;
    // }

    const formData = new FormData();

    // Basic fields
    formData.append("ProductCategoryId", data.productCategoryId);
    formData.append("Code", data.code);
    formData.append("Name", data.name);

    if (data.fullName) {
      formData.append("FullName", data.fullName);
    }

    if (data.description) {
      formData.append("Description", data.description);
    }

    if (data.price !== undefined) {
      formData.append("Price", data.price.toString());
    }

    formData.append("Status", data.status.toString());
    formData.append("StockQuantity", data.stockQuantity.toString());

    // Images
    imageFiles.forEach((file) => {
      formData.append("ImageFiles", file);
    });

    // Image metadata as JSON
    if (data.images && data.images.length > 0) {
      formData.append("ImageMetadataJson", JSON.stringify(data.images));
    }

    // Side attributes as JSON
    if (data.sideAttributes && data.sideAttributes.length > 0) {
      formData.append("SideAttibutes", JSON.stringify(data.sideAttributes));
    }

    try {
      // for (const [key, value] of formData.entries()) {
      //   if (value instanceof File) {
      //     console.log(`  ${key}: File(${value.name}, ${value.size} bytes)`);
      //   } else {
      //     console.log(`  ${key}: ${value}`);
      //   }
      // }
      const result = await createProductMutation.mutateAsync(formData);
      if (result?.data?.status >= 200 && result?.data?.status < 300) {
        toast.success("Tạo sản phẩm thành công");
        form.reset();
        setImageFiles([]);
        setImagePreviews([]);
      }
      // navigate(PATH_BRAND_DASHBOARD.product.root);
    } catch (err) {
      handleApiError(err);
    }
  };
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Tạo sản phẩm mới</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <div className="lg:col-span-1">
            <div className="bg-background rounded-lg border p-6 space-y-4 h-full">
              <h2 className="text-lg font-semibold">Hình ảnh sản phẩm</h2>

              {/* Image Grid */}
              <div className="grid grid-cols-2 gap-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                      <Button
                        type="button"
                        size="icon"
                        variant="secondary"
                        onClick={() => setMainImage(index)}
                        title="Đặt làm ảnh chính"
                      >
                        <CheckIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        size="icon"
                        variant="destructive"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Main image badge */}
                    {form.watch("images")?.[index]?.isMainImage && (
                      <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                        Ảnh chính
                      </div>
                    )}

                    {/* Image metadata */}
                    <div className="mt-2">
                      <Input
                        placeholder="Mô tả ảnh (Alt text)"
                        value={form.watch("images")?.[index]?.altText || ""}
                        onChange={(e) => {
                          const images = form.getValues("images") || [];
                          images[index] = {
                            ...images[index],
                            altText: e.target.value,
                          };
                          form.setValue("images", images);
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Upload button */}
              {imageFiles.length < 4 && (
                <div className="border-2 border-dashed rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground mb-4">
                    Còn lại: {4 - imageFiles.length}/4 ảnh
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleImagesChange}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Tải ảnh lên
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Right side - Category info */}
          <div className="bg-background rounded-lg border p-6 space-y-6">
            {/* Header with status toggle */}
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Thông tin sản phẩm</h2>
              <div className="flex items-center">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormLabel>Trạng thái</FormLabel>
                      <FormControl>
                        <Switch
                          checked={field.value === EProductStatus.Active}
                          onCheckedChange={(checked) =>
                            field.onChange(
                              checked
                                ? EProductStatus.Active
                                : EProductStatus.Inactive,
                            )
                          }
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="code">
                        Mã sản phẩm<span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Nhập mã sản phẩm"
                          {...field}
                          disabled={createProductMutation.isPending}
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
                  name="productCategoryId"
                  render={({ field, fieldState }) => (
                    <FormItem className="flex flex-col">
                      <Field
                        orientation="responsive"
                        data-invalid={fieldState.invalid}
                      >
                        <FieldContent>
                          <FieldLabel>Danh mục</FieldLabel>
                        </FieldContent>

                        {isCategoryLoading ? (
                          <div className="flex items-center justify-center h-10 border rounded-md">
                            <LoaderCircleIcon className="h-4 w-4 animate-spin text-muted-foreground" />
                            <span className="ml-2 text-sm text-muted-foreground">
                              Đang tải...
                            </span>
                          </div>
                        ) : isCategoryError ? (
                          <div className="flex items-center justify-center h-10 border rounded-md border-destructive/50 bg-destructive/5">
                            <span className="text-sm text-destructive">
                              Không thể tải dữ liệu
                            </span>
                          </div>
                        ) : (
                          <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  aria-expanded={open}
                                  className="w-full justify-between"
                                  disabled={createProductMutation.isPending}
                                >
                                  {field.value
                                    ? categories.find(
                                        (category) =>
                                          category.id === field.value,
                                      )?.name
                                    : "Chọn danh mục..."}
                                  <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                              <Command>
                                <CommandInput placeholder="Tìm kiếm danh mục..." />
                                <CommandList>
                                  <CommandEmpty>
                                    Không tìm thấy danh mục
                                  </CommandEmpty>
                                  <CommandGroup>
                                    {categories.map((category) => (
                                      <CommandItem
                                        key={category.id}
                                        value={category.id}
                                        onSelect={() => {
                                          field.onChange(
                                            category.id === field.value
                                              ? ""
                                              : category.id,
                                          );
                                          setOpen(false);
                                        }}
                                      >
                                        <CheckIcon
                                          className={cn(
                                            "mr-2 h-4 w-4",
                                            field.value === category.id
                                              ? "opacity-100"
                                              : "opacity-0",
                                          )}
                                        />
                                        {category.code} - {category.name}
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                        )}
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="name">
                      Tên sản phẩm<span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Nhập tên sản phẩm"
                        {...field}
                        disabled={createProductMutation.isPending}
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
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="name">Tên sản phẩm đầy đủ</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Nhập tên sản phẩm"
                        {...field}
                        disabled={createProductMutation.isPending}
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
                        placeholder="Mô tả về sản phẩm"
                        {...field}
                        disabled={createProductMutation.isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="name">
                        Giá bán<span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Nhập giá bán sản phẩm"
                          {...field}
                          type="number"
                          onChange={(e) => {
                            const value =
                              e.target.value === ""
                                ? ""
                                : Number(e.target.value);
                            field.onChange(value);
                          }}
                          disabled={createProductMutation.isPending}
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
                  name="stockQuantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="name">
                        Tồn kho<span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Nhập tồn kho hiện tại của sản phẩm"
                          {...field}
                          type="number"
                          onChange={(e) => {
                            const value =
                              e.target.value === ""
                                ? ""
                                : Number(e.target.value);
                            field.onChange(value);
                          }}
                          disabled={createProductMutation.isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Side Attributes */}
            <div className="bg-background rounded-lg border p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Thuộc tính bổ sung</h2>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ key: "", value: "" })}
                  disabled={fields.length >= 20}
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Thêm thuộc tính
                </Button>
              </div>

              {fields.map((field, index) => (
                <div key={field.id} className="flex gap-2">
                  <FormField
                    control={form.control}
                    name={`sideAttributes.${index}.key`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input
                            placeholder="Tên thuộc tính (VD: Màu sắc)"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`sideAttributes.${index}.value`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input placeholder="Giá trị (VD: Đỏ)" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => remove(index)}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              {fields.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Chưa có thuộc tính nào
                </p>
              )}
            </div>

            {/* Submit button */}
            <div className="flex justify-end pt-4">
              <Button type="submit" className="bg-primary hover:bg-primary/90">
                Lưu
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ProductCreatePage;
