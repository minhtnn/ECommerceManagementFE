//#region IMPORTS
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
import { useProduct } from "@/hooks/use-product";
import { handleApiError } from "@/lib/error";
import { cn, formatDateTimeInShort } from "@/lib/utils";
import { PATH_BRAND_DASHBOARD } from "@/routes/path";
import { TUpdateProduct, UpdateProductSchema } from "@/schemas/product.schema";
import { EProductStatus } from "@/types/enums/product-status.enum";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  LoaderCircle,
  Plus,
  RefreshCw,
  Star,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
//#endregion

//#region TYPES & INTERFACES
interface ImagePreview {
  id: string;
  file?: File;
  preview: string;
  altText: string;
  isMainImage: boolean;
  isExisting: boolean;
}

interface SideAttribute {
  id: string;
  key: string;
  value: string;
}

interface ImagesState {
  list: ImagePreview[];
  errorIds: Set<string>;
}

//#endregion

//#region MEMOIZED COMPONENTS
const ImageCard = memo(
  ({
    img,
    onSetMain,
    onRemove,
    onUpdateAlt,
    onError,
    hasError,
    disabled,
  }: {
    img: ImagePreview;
    onSetMain: (id: string) => void;
    onRemove: (id: string) => void;
    onUpdateAlt: (id: string, value: string) => void;
    onError: (id: string) => void;
    hasError: boolean;
    disabled: boolean;
  }) => {
    return (
      <div className="space-y-2">
        <div className="relative group">
          <div className="aspect-square rounded-lg border overflow-hidden bg-muted">
            {hasError ? (
              <div className="w-full h-full flex flex-col items-center justify-center gap-2 p-4">
                <Upload className="h-8 w-8 text-muted-foreground/50" />
                <p className="text-xs text-muted-foreground text-center">
                  Không thể tải ảnh
                </p>
              </div>
            ) : (
              <img
                src={img.preview}
                alt={img.altText || "Ảnh sản phẩm"}
                className="w-full h-full object-cover"
                onError={() => onError(img.id)}
                loading="lazy"
              />
            )}
          </div>

          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
            <Button
              type="button"
              size="icon"
              variant="secondary"
              onClick={() => onSetMain(img.id)}
              title="Đặt làm ảnh chính"
              className="h-8 w-8"
            >
              <Star
                className={`h-4 w-4 ${img.isMainImage ? "fill-current" : ""}`}
              />
            </Button>
            <Button
              type="button"
              size="icon"
              variant="destructive"
              onClick={() => onRemove(img.id)}
              title="Xóa"
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {img.isMainImage && (
            <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
              Ảnh chính
            </div>
          )}
        </div>

        <Input
          placeholder="Mô tả ảnh"
          value={img.altText}
          onChange={(e) => onUpdateAlt(img.id, e.target.value)}
          className="text-xs"
          disabled={disabled}
        />
      </div>
    );
  },
);

ImageCard.displayName = "ImageCard";

const AttributeRow = memo(
  ({
    attr,
    onUpdate,
    onRemove,
    disabled,
  }: {
    attr: SideAttribute;
    onUpdate: (id: string, field: "key" | "value", value: string) => void;
    onRemove: (id: string) => void;
    disabled: boolean;
  }) => {
    return (
      <div className="flex gap-2">
        <Input
          placeholder="Tên thuộc tính"
          value={attr.key}
          onChange={(e) => onUpdate(attr.id, "key", e.target.value)}
          disabled={disabled}
        />
        <Input
          placeholder="Giá trị"
          value={attr.value}
          onChange={(e) => onUpdate(attr.id, "value", e.target.value)}
          disabled={disabled}
        />
        <Button
          type="button"
          variant="destructive"
          size="icon"
          onClick={() => onRemove(attr.id)}
          className={cn("p-4")}
          disabled={disabled}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    );
  },
);

AttributeRow.displayName = "AttributeRow";
//#endregion

//#region SECTION COMPONENTS
interface ImagesSectionProps {
  imagesState: ImagesState;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSetMain: (id: string) => void;
  onRemove: (id: string) => void;
  onUpdateAlt: (id: string, value: string) => void;
  onError: (id: string) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  disabled: boolean;
  fileInputRef: React.RefObject<HTMLInputElement>;
}

const ImagesSection = memo(
  ({
    imagesState,
    onImageChange,
    onSetMain,
    onRemove,
    onUpdateAlt,
    onError,
    onRefresh,
    isRefreshing,
    disabled,
    fileInputRef,
  }: ImagesSectionProps) => {
    const { list: images, errorIds } = imagesState;
    const existingImages = images.filter((img) => img.isExisting);
    const newImages = images.filter((img) => !img.isExisting);
    const remainingSlots = 4 - images.length;

    return (
      <div className="bg-background rounded-lg border p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            Hình ảnh sản phẩm ({images.length}/4)
          </h2>
          {errorIds.size > 0 && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={isRefreshing}
            >
              {isRefreshing ? (
                <LoaderCircle className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Tải lại ảnh
            </Button>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={onImageChange}
        />

        {/* Existing Images */}
        {existingImages.length > 0 && (
          <div className="space-y-3">
            <p className="text-sm font-medium text-muted-foreground">
              Ảnh hiện tại
            </p>
            <div className="grid grid-cols-2 gap-4">
              {existingImages.map((img) => (
                <ImageCard
                  key={img.id}
                  img={img}
                  onSetMain={onSetMain}
                  onRemove={onRemove}
                  onUpdateAlt={onUpdateAlt}
                  onError={onError}
                  hasError={errorIds.has(img.id)}
                  disabled={disabled}
                />
              ))}
            </div>
          </div>
        )}

        {/* New Images */}
        {newImages.length > 0 && (
          <div className="space-y-3">
            <p className="text-sm font-medium text-muted-foreground">Ảnh mới</p>
            <div className="grid grid-cols-2 gap-4">
              {newImages.map((img) => (
                <ImageCard
                  key={img.id}
                  img={img}
                  onSetMain={onSetMain}
                  onRemove={onRemove}
                  onUpdateAlt={onUpdateAlt}
                  onError={onError}
                  hasError={errorIds.has(img.id)}
                  disabled={disabled}
                />
              ))}
            </div>
          </div>
        )}

        {/* Upload area */}
        <div>
          {images.length === 0 ? (
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-12 text-center">
              <Upload className="h-10 w-10 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground mb-2">Chưa có hình ảnh</p>
              <p className="text-xs text-muted-foreground mb-4">
                Tối đa 4 ảnh • JPG, PNG, GIF • Tối đa 5MB/ảnh
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                Tải ảnh lên
              </Button>
            </div>
          ) : remainingSlots > 0 ? (
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
              <Upload className="h-8 w-8 text-muted-foreground/50 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground mb-3">
                Còn {remainingSlots} vị trí • Thêm ảnh để sản phẩm hấp dẫn hơn
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled}
              >
                <Upload className="h-4 w-4 mr-2" />
                Tải thêm ảnh
              </Button>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-2">
              Đã đạt giới hạn 4 ảnh
            </p>
          )}
        </div>
      </div>
    );
  },
);

ImagesSection.displayName = "ImagesSection";

interface BasicInfoSectionProps {
  form: any;
  product: any;
  isPending: boolean;
}

const BasicInfoSection = memo(
  ({ form, product, isPending }: BasicInfoSectionProps) => {
    return (
      <div className="bg-background rounded-lg border p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Thông tin cơ bản</h2>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Mã sản phẩm</Label>
            <div className="h-10 px-3 py-2 border rounded-md bg-muted">
              {product?.code}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Thuộc danh mục</Label>
            <div className="h-10 px-3 py-2 border rounded-md bg-muted truncate">
              {product?.productCategoryName}
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Tên sản phẩm<span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input {...field} disabled={isPending} />
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
                <FormLabel>Tên đầy đủ</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isPending} />
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
                <FormLabel>Mô tả</FormLabel>
                <FormControl>
                  <Textarea {...field} rows={4} disabled={isPending} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Giá</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => {
                        const value =
                          e.target.value === "" ? "" : Number(e.target.value);
                        field.onChange(value);
                      }}
                      disabled={isPending}
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
                  <FormLabel htmlFor="stockQuantity">
                    Số lượng tồn kho<span className="text-destructive">*</span>
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
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </div>
    );
  },
);

BasicInfoSection.displayName = "BasicInfoSection";

interface AttributesSectionProps {
  attributes: SideAttribute[];
  onAdd: () => void;
  onUpdate: (id: string, field: "key" | "value", value: string) => void;
  onRemove: (id: string) => void;
  disabled: boolean;
}

const AttributesSection = memo(
  ({
    attributes,
    onAdd,
    onUpdate,
    onRemove,
    disabled,
  }: AttributesSectionProps) => {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Thuộc tính bổ sung</h2>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onAdd}
            disabled={attributes.length >= 20 || disabled}
          >
            <Plus className="h-4 w-4 mr-2" />
            Thêm thuộc tính
          </Button>
        </div>

        {attributes.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            Chưa có thuộc tính nào
          </p>
        ) : (
          <div className="space-y-3">
            {attributes.map((attr) => (
              <AttributeRow
                key={attr.id}
                attr={attr}
                onUpdate={onUpdate}
                onRemove={onRemove}
                disabled={disabled}
              />
            ))}
          </div>
        )}
      </div>
    );
  },
);

AttributesSection.displayName = "AttributesSection";
//#endregion

//#region MAIN COMPONENT
const ProductEditPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isRefreshingImages, setIsRefreshingImages] = useState(false);
  const [hasImageChanges, setHasImageChanges] = useState(false);
  const [hasAttributeChanges, setHasAttributeChanges] = useState(false);

  const { getProductById, updateProduct } = useProduct();
  const { data: productData, isLoading, refetch } = getProductById(id!);
  const updateProductMutation = updateProduct();

  const product = productData?.data.data;
  const [imagesState, setImagesState] = useState<ImagesState>({
    list:
      product.getProductImagesResponse?.map((img) => ({
        id: img.id,
        preview: img.imageUrl,
        altText: img.altText || "",
        isMainImage: img.isMainImage,
        isExisting: true,
      })) ?? [],
    errorIds: new Set(),
  });

  const [sideAttributes, setSideAttributes] = useState<SideAttribute[]>(
    product.getProductSideAttributesResponse?.map((attr) => ({
      id: attr.id,
      key: attr.key,
      value: attr.value,
    })) ?? [],
  );

  const form = useForm<TUpdateProduct>({
    resolver: zodResolver(UpdateProductSchema),
    defaultValues: {
      id: id!,
      name: product.name || "",
      fullName: product.fullName || "",
      description: product.description || "",
      price: product.price || 0,
      status: product.status,
      stockQuantity: product.stockQuantity || 0,
      existingImageIds: [],
      newImages: [],
      sideAttributes: [],
    },
  });

  //#region EFFECTS

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      imagesState.list.forEach((img) => {
        if (img.preview && !img.isExisting) {
          URL.revokeObjectURL(img.preview);
        }
      });
    };
  }, [imagesState.list]);
  //#endregion

  //#region IMAGE HANDLERS
  const handleImageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      if (files.length === 0) return;

      setImagesState((currentState) => {
        const currentRemaining = 4 - currentState.list.length;

        if (currentRemaining <= 0) {
          alert("Chỉ được tải tối đa 4 ảnh");
          if (fileInputRef.current) fileInputRef.current.value = "";
          return currentState;
        }

        const filesToUpload = files.slice(0, currentRemaining);

        if (files.length > currentRemaining) {
          alert(
            `Chỉ có thể thêm ${currentRemaining} ảnh. ${files.length - currentRemaining} ảnh đã bị bỏ qua.`,
          );
        }

        // Validate
        for (const file of filesToUpload) {
          if (!file.type.startsWith("image/")) {
            alert("Vui lòng chỉ chọn file ảnh");
            if (fileInputRef.current) fileInputRef.current.value = "";
            return currentState;
          }
          if (file.size > 5 * 1024 * 1024) {
            alert("Kích thước ảnh không được vượt quá 5MB");
            if (fileInputRef.current) fileInputRef.current.value = "";
            return currentState;
          }
        }

        const newImagePreviews: ImagePreview[] = filesToUpload.map((file) => ({
          id: crypto.randomUUID(),
          file,
          preview: URL.createObjectURL(file),
          altText: "",
          isMainImage: currentState.list.length === 0,
          isExisting: false,
        }));

        if (fileInputRef.current) fileInputRef.current.value = "";
        setHasImageChanges(true);
        return {
          list: [...currentState.list, ...newImagePreviews],
          errorIds: currentState.errorIds,
        };
      });
    },
    [],
  );

  const removeImage = useCallback((id: string) => {
    setImagesState((prev) => {
      const imageToRemove = prev.list.find((img) => img.id === id);
      const updatedList = prev.list.filter((img) => img.id !== id);

      if (imageToRemove && !imageToRemove.isExisting && imageToRemove.preview) {
        URL.revokeObjectURL(imageToRemove.preview);
      }

      if (imageToRemove?.isMainImage && updatedList.length > 0) {
        updatedList[0].isMainImage = true;
      }

      const updatedErrorIds = new Set(prev.errorIds);
      updatedErrorIds.delete(id);
      setHasImageChanges(true);
      return {
        list: updatedList,
        errorIds: updatedErrorIds,
      };
    });
  }, []);

  const setMainImage = useCallback((id: string) => {
    setImagesState((prev) => ({
      list: prev.list.map((img) => ({
        ...img,
        isMainImage: img.id === id,
      })),
      errorIds: prev.errorIds,
    }));
    setHasImageChanges(true);
  }, []);

  const updateImageAltText = useCallback((id: string, altText: string) => {
    setImagesState((prev) => ({
      list: prev.list.map((img) => (img.id === id ? { ...img, altText } : img)),
      errorIds: prev.errorIds,
    }));
    setHasImageChanges(true);
  }, []);

  const handleImageError = useCallback((id: string) => {
    setImagesState((prev) => ({
      list: prev.list,
      errorIds: new Set(prev.errorIds).add(id),
    }));
  }, []);

  const handleRefreshImages = useCallback(async () => {
    setIsRefreshingImages(true);
    try {
      await refetch();
      setImagesState((prev) => ({
        list: prev.list,
        errorIds: new Set(),
      }));
    } catch (error) {
      console.error("Failed to refresh images:", error);
    } finally {
      setIsRefreshingImages(false);
    }
  }, [refetch]);

  //#endregion

  //#region ATTRIBUTE HANDLERS
  const addSideAttribute = useCallback(() => {
    setSideAttributes((prev) => {
      if (prev.length >= 20) {
        toast.error("Chỉ được thêm tối đa 20 thuộc tính");
        return prev;
      }
      setHasAttributeChanges(true);
      return [...prev, { id: crypto.randomUUID(), key: "", value: "" }];
    });
  }, []);

  const removeSideAttribute = useCallback((id: string) => {
    setSideAttributes((prev) => prev.filter((attr) => attr.id !== id));
    setHasAttributeChanges(true);
  }, []);

  const updateSideAttribute = useCallback(
    (id: string, field: "key" | "value", value: string) => {
      setSideAttributes((prev) =>
        prev.map((attr) =>
          attr.id === id ? { ...attr, [field]: value } : attr,
        ),
      );
      setHasAttributeChanges(true);
    },
    [],
  );
  //#endregion

  //#region SUBMIT HANDLER

  const onSubmit = useCallback(
    async (data: TUpdateProduct) => {
      if (updateProductMutation.isPending) return;

      const hasFormChanges = Object.keys(form.formState.dirtyFields).length > 0;

      if (!hasFormChanges && !hasImageChanges && !hasAttributeChanges) {
        toast.warning("Bạn chưa thay đổi dữ kiện nào!");
        return;
      }

      const formData = new FormData();
      formData.append("Id", id!);
      formData.append("Name", data.name);
      formData.append("FullName", data.fullName || "");
      formData.append("Description", data.description || "");
      formData.append("Price", data.price.toString());
      formData.append("Status", data.status.toString());
      formData.append("StockQuantity", data.stockQuantity.toString());

      // Existing Images + their metadata
      const existingImages = imagesState.list.filter(
        (img) => img.isExisting && img.id,
      );
      existingImages.forEach((img) => {
        formData.append("ExistingImageIds", img.id);
      });

      // Serialize existing image metadata as JSON
      const existingImageMetadata = existingImages.map((img) => ({
        Id: img.id,
        AltText: img.altText || "",
        IsMainImage: img.isMainImage,
      }));
      formData.append(
        "ExistingImageMetadataJson",
        JSON.stringify(existingImageMetadata),
      );

      // New Images
      const newImagesList = imagesState.list.filter(
        (img) => !img.isExisting && img.file,
      );
      newImagesList.forEach((img, index) => {
        formData.append(`NewImages[${index}].File`, img.file!);
        formData.append(`NewImages[${index}].AltText`, img.altText || "");
        formData.append(
          `NewImages[${index}].IsMainImage`,
          img.isMainImage.toString(),
        );
      });

      const validAttrs = sideAttributes
        .map((attr) => ({
          ...attr,
          key: attr.key.trim(),
          value: attr.value.trim(),
        }))
        .filter((attr) => attr.key !== "" && attr.value !== "");
      validAttrs.forEach((attr, index) => {
        formData.append(`SideAttributes[${index}].Key`, attr.key);
        formData.append(`SideAttributes[${index}].Value`, attr.value);
      });
      try {
        const result = await updateProductMutation.mutateAsync({
          id: id!,
          data: formData,
        });
        if (result?.data?.status >= 200 && result?.data?.status < 300) {
          toast.success("Cập nhật sản phẩm thành công");
        }
      } catch (err) {
        handleApiError(err);
      }
    },
    [
      id,
      imagesState.list,
      sideAttributes,
      updateProductMutation,
      product,
      form.formState.dirtyFields,
    ],
  );

  //#endregion

  // Show loading while fetching data OR while data is not ready
  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Cập nhật sản phẩm</h1>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Images Section */}
          <ImagesSection
            imagesState={imagesState}
            onImageChange={handleImageChange}
            onSetMain={setMainImage}
            onRemove={removeImage}
            onUpdateAlt={updateImageAltText}
            onError={handleImageError}
            onRefresh={handleRefreshImages}
            isRefreshing={isRefreshingImages}
            disabled={updateProductMutation.isPending}
            fileInputRef={fileInputRef}
          />

          {/* Product Info Section */}
          <div className="space-y-6">
            <BasicInfoSection
              form={form}
              product={product}
              isPending={updateProductMutation.isPending}
            />

            <div className="bg-background rounded-lg border p-6">
              <AttributesSection
                attributes={sideAttributes}
                onAdd={addSideAttribute}
                onUpdate={updateSideAttribute}
                onRemove={removeSideAttribute}
                disabled={updateProductMutation.isPending}
              />
            </div>
          </div>
          {/* Submit Section */}
          <div className="lg:col-span-2 flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">
                Lần cập nhật cuối:{" "}
                {product?.lastModifiedDate
                  ? formatDateTimeInShort(new Date(product.lastModifiedDate))
                  : product?.createdDate
                    ? formatDateTimeInShort(new Date(product.createdDate))
                    : "N/A"}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(PATH_BRAND_DASHBOARD.product.root)}
                disabled={updateProductMutation.isPending}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={updateProductMutation.isPending}>
                {updateProductMutation.isPending ? (
                  <>
                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                    Đang lưu...
                  </>
                ) : (
                  "Cập nhật"
                )}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};
export default ProductEditPage;

//#endregion
