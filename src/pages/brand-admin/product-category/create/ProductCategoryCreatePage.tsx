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
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useProductCategory } from "@/hooks/use-product-category";
import { useQueryParams } from "@/hooks/use-query-params";
import { handleApiError } from "@/lib/error";
import { cn } from "@/lib/utils";
import {
  CreateProductCategorySchema,
  TCreateProductCategory,
} from "@/schemas/product-category.schema";
import { ECategoryStatus } from "@/types/enums/product-category-status.enum";
import { EProductCategoryType } from "@/types/enums/product-category-type.enum";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CheckIcon,
  ChevronsUpDownIcon,
  LoaderCircleIcon,
  Upload,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

//#endregion

const ProductCategoryCreatePage = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedType, setSelectedType] = useState<EProductCategoryType>(
    EProductCategoryType.Parent,
  );
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [open, setOpen] = useState(false);
  const { currentPage, pageSize, sortBy, isAsc, filter } = useQueryParams({
    defaultSortBy: "name",
    defaultFilter: [
      { id: "name", value: "" },
      { id: "code", value: null },
    ],
  });
  const { createProductCategory, getSuspendProductCategories } = useProductCategory();
  const {
    data: categoryData,
    isLoading: isCategoryLoading,
    isError: isCategoryError,
    error: categoryError,
  } = getSuspendProductCategories({
    page: currentPage,
    size: pageSize,
    sortBy,
    isAsc,
    allowFetch: selectedType == EProductCategoryType.Child,
  });

  const createProductCategoryMutation = createProductCategory();
  const form = useForm<TCreateProductCategory>({
    resolver: zodResolver(CreateProductCategorySchema),
    defaultValues: {
      code: "",
      name: "",
      parentProductCategoryId: undefined,
      description: "",
      displayOrder: 1,
      status: ECategoryStatus.Active,
    },
  });
  const categories = categoryData?.data?.data?.items || [];

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
    };
    reader.readAsDataURL(file);

    // Store file for upload
    setImageFile(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit = async (data: TCreateProductCategory) => {
    if (createProductCategoryMutation.isPending) return;

    if (
      selectedType === EProductCategoryType.Child &&
      data.parentProductCategoryId == null
    ) {
      form.setError("parentProductCategoryId", {
        message: "Chưa chọn danh mục cha",
      });
      return;
    }

    const formData = new FormData();
    formData.append("Code", data.code);
    formData.append("Name", data.name);
    if (imageFile) {
      formData.append("Image", imageFile);
    }
    if (data.description) {
      formData.append("Description", data.description);
    }

    formData.append("DisplayOrder", data.displayOrder.toString());
    formData.append("Status", data.status.toString());

    // Add parent category if Child type
    if (
      selectedType === EProductCategoryType.Child &&
      data.parentProductCategoryId
    ) {
      formData.append("ParentProductCategoryId", data.parentProductCategoryId);
    }

    try {
      const result = await createProductCategoryMutation.mutateAsync(formData);
      if (result?.data?.status >= 200 && result?.data?.status < 300) {
        toast.success("Tạo danh mục thành công");
        form.reset();
        setImageFile(null);
        setImagePreview(null);
      }
      // navigate(PATH_BRAND_DASHBOARD.productCategory.root);
    } catch (err) {
      handleApiError(err);
    }
  };

  useEffect(() => {
    if (selectedType === EProductCategoryType.Parent) {
      form.setValue("parentProductCategoryId", undefined);
    }
  }, [selectedType, form]);
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Tạo danh mục mới</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <div className="bg-background rounded-lg border p-6">
            <div className="flex flex-col items-center justify-center h-full border-2 border-dashed border-muted-foreground/25 rounded-lg p-8">
              {imagePreview ? (
                <div className="relative w-full max-w-[300px]">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-auto rounded-lg object-cover"
                  />
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
                    <p className="text-sm text-muted-foreground text-center">
                      {imageFile?.name}
                    </p>
                    <p className="text-xs text-muted-foreground text-center">
                      {imageFile && `${(imageFile.size / 1024).toFixed(2)} KB`}
                    </p>
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
                          checked={field.value == ECategoryStatus.Active}
                          onCheckedChange={(checked) =>
                            field.onChange(
                              checked
                                ? ECategoryStatus.Active
                                : ECategoryStatus.Inactive,
                            )
                          }
                          disabled={createProductCategoryMutation.isPending}
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
                        Mã danh mục<span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Nhập mã danh mục"
                          {...field}
                          disabled={createProductCategoryMutation.isPending}
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
                          onChange={(e) => {
                            const value =
                              e.target.value === ""
                                ? ""
                                : Number(e.target.value);
                            field.onChange(value);
                          }}
                          disabled={createProductCategoryMutation.isPending}
                        />
                      </FormControl>
                      <FormMessage />
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
                      Tên danh mục<span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Nhập tên danh mục"
                        {...field}
                        disabled={createProductCategoryMutation.isPending}
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
                        disabled={createProductCategoryMutation.isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div>
                  <Label>
                    Loại danh mục <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={selectedType}
                    onValueChange={(value: EProductCategoryType) =>
                      setSelectedType(value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn loại danh mục" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={EProductCategoryType.Parent}>
                        Danh mục cha
                      </SelectItem>
                      <SelectItem value={EProductCategoryType.Child}>
                        Danh mục con
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                {selectedType === EProductCategoryType.Child && (
                  <FormField
                    control={form.control}
                    name="parentProductCategoryId"
                    render={({ field, fieldState }) => (
                      <FormItem className="flex flex-col">
                        <Field
                          orientation="responsive"
                          data-invalid={fieldState.invalid}
                        >
                          <FieldContent>
                            <FieldLabel>Danh mục cha</FieldLabel>
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
                                    disabled={
                                      createProductCategoryMutation.isPending
                                    }
                                  >
                                    {field.value
                                      ? categories.find(
                                          (category) =>
                                            category.id === field.value,
                                        )?.name
                                      : "Chọn danh mục cha..."}
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
                        </Field>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
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

export default ProductCategoryCreatePage;
