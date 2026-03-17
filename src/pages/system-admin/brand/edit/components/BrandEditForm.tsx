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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useBrand } from "@/hooks/use-brand";
import { handleApiError } from "@/lib/error";
import { PATH_SYSTEM_ADMIN_DASHBOARD } from "@/routes/path";
import { TUpdateBrandRequest, UpdateBrandSchema } from "@/schemas/brand.schema";
import { EBrandStatus } from "@/types/enums/brand-status.enum";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircleIcon, Upload, X } from "lucide-react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const BrandEditForm = ({
  brand,
  id,
}: {
  brand: any;
  id: string;
}) => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [imagePreview, setImagePreview] = useState<string | null>(
    brand.logoUrl ?? null,
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isImageChanged, setIsImageChanged] = useState(false);
  const [imageError, setImageError] = useState(false);

  const { updateBrand } = useBrand();
  const updateBrandMutation = updateBrand(id);

  const form = useForm<TUpdateBrandRequest>({
    resolver: zodResolver(UpdateBrandSchema),
    defaultValues: {
      id,
      name: brand.name,
      fullname: brand.fullName,
      email: brand.email,
      address: brand.address.trim() || undefined,
      status: brand.status,
      ...(brand.configuration && { configuration: brand.configuration }),
      ...(brand.slogan && { slogan: brand.slogan }),
      ...(brand.phoneNumber && { phoneNumber: brand.phoneNumber }),
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Vui lòng chọn file ảnh");
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      alert("Kích thước ảnh không được vượt quá 5MB");
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

  const handleImageError = () => {
    setImageError(true);
  };

  const onSubmit = async (data: TUpdateBrandRequest) => {
    const hasFormChanges = Object.keys(form.formState.dirtyFields).length > 0;
    const hasImageChanges = isImageChanged;

    if (!hasFormChanges && !hasImageChanges) {
      toast.warning("Bạn chưa thay đổi dữ kiện nào!");
      return;
    }
    if (updateBrandMutation.isPending) return;

    const formData = new FormData();
    formData.append("Id", id);
    formData.append("Name", data.name);
    if (data.fullname) formData.append("Fullname", data.fullname);
    if (data.slogan) formData.append("Slogan", data.slogan);
    formData.append("Email", data.email);
    if (data.phoneNumber) formData.append("PhoneNumber", data.phoneNumber);
    formData.append("Address", data.address);
    if (data.configuration) formData.append("Configuration", data.configuration);
    formData.append("Status", data.status.toString());
    if (isImageChanged && imageFile) formData.append("Logo", imageFile);

    try {
      const result = await updateBrandMutation.mutateAsync(formData);
      const { message, status } = result.data;
      if (message) {
        status >= 200 && status < 300
          ? toast.success(message)
          : toast.error(message);
      }
    } catch (err) {
      handleApiError(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Cập nhật thương hiệu</h1>
        <Button
          variant="outline"
          onClick={() => navigate(PATH_SYSTEM_ADMIN_DASHBOARD.brand.root)}
        >
          Quay lại
        </Button>
      </div>

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

          {/* Right side - Brand info */}
          <div className="bg-background rounded-lg border p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Thông tin thương hiệu</h2>
              <div className="flex items-center">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormLabel htmlFor="code">Trạng thái</FormLabel>
                      <FormControl className="flex items-center">
                        <Switch
                          checked={field.value === EBrandStatus.Active}
                          onCheckedChange={(checked) =>
                            field.onChange(
                              checked ? EBrandStatus.Active : EBrandStatus.Inactive,
                            )
                          }
                          disabled={updateBrandMutation.isPending}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="name">
                    Tên thương hiệu<span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Nhập tên thương hiệu"
                      {...field}
                      disabled={updateBrandMutation.isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fullname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="fullname">Tên đầy đủ</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Nhập tên đầy đủ"
                      {...field}
                      disabled={updateBrandMutation.isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slogan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="slogan">Slogan</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Nhập slogan"
                      {...field}
                      disabled={updateBrandMutation.isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="address">
                    Địa chỉ<span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Địa chỉ của thương hiệu"
                      {...field}
                      disabled={updateBrandMutation.isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="configuration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="configuration">Cấu hình</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Cấu hình của thương hiệu"
                      {...field}
                      disabled={updateBrandMutation.isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Nhập email"
                        {...field}
                        disabled={updateBrandMutation.isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="phoneNumber">Số điện thoại</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Nhập số điện thoại"
                        {...field}
                        disabled={updateBrandMutation.isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(PATH_SYSTEM_ADMIN_DASHBOARD.brand.root)}
                disabled={updateBrandMutation.isPending}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                className="bg-primary hover:bg-primary/90"
                disabled={updateBrandMutation.isPending}
              >
                {updateBrandMutation.isPending ? (
                  <>
                    <LoaderCircleIcon className="mr-2 h-4 w-4 animate-spin" />
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