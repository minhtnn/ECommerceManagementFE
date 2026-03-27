// pages/system-admin/brand/components/BrandEditForm.tsx
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
import { TSystemConfigResponse } from "@/schemas/system-config.schema";
import { EBrandStatus } from "@/types/enums/brand-status.enum";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircleIcon, Upload, X } from "lucide-react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { BrandConfigurationSection } from "./BrandConfigurationSection";

interface BrandEditFormProps {
  brand: any;
  id: string;
  systemConfigs: TSystemConfigResponse[]; // ← thêm prop
}

export const BrandEditForm = ({ brand, id, systemConfigs }: BrandEditFormProps) => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [imagePreview, setImagePreview] = useState<string | null>(brand.logoUrl ?? null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isImageChanged, setIsImageChanged] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [configurationJson, setConfigurationJson] = useState<string>(
    brand.configuration ?? ""
  );

  const { updateBrand } = useBrand();
  const updateBrandMutation = updateBrand(id);

  const form = useForm<TUpdateBrandRequest>({
    resolver: zodResolver(UpdateBrandSchema),
    defaultValues: {
      id,
      name: brand.name,
      fullname: brand.fullName,
      email: brand.email,
      address: brand.address?.trim() || undefined,
      status: brand.status,
      ...(brand.configuration && { configuration: brand.configuration }),
      ...(brand.slogan && { slogan: brand.slogan }),
      ...(brand.phoneNumber && { phoneNumber: brand.phoneNumber }),
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { alert("Vui lòng chọn file ảnh"); return; }
    if (file.size > 5 * 1024 * 1024) { alert("Kích thước ảnh không được vượt quá 5MB"); return; }
    const reader = new FileReader();
    reader.onloadend = () => { setImagePreview(reader.result as string); setImageError(false); };
    reader.readAsDataURL(file);
    setImageFile(file);
    setIsImageChanged(true);
  };

  const removeImage = () => {
    setImagePreview(null);
    setImageFile(null);
    setIsImageChanged(true);
    setImageError(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onSubmit = async (data: TUpdateBrandRequest) => {
    const hasFormChanges = Object.keys(form.formState.dirtyFields).length > 0;
    if (!hasFormChanges && !isImageChanged) {
      toast.warning("Bạn chưa thay đổi dữ liệu nào!");
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
    if (configurationJson) formData.append("Configuration", configurationJson);
    formData.append("Status", data.status.toString());
    if (isImageChanged && imageFile) formData.append("Logo", imageFile);

    try {
      const result = await updateBrandMutation.mutateAsync(formData);
      const { message, status } = result.data;
      if (message) {
        status >= 200 && status < 300 ? toast.success(message) : toast.error(message);
      }
    } catch (err) {
      handleApiError(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Cập nhật thương hiệu</h1>
        <Button variant="outline" onClick={() => navigate(PATH_SYSTEM_ADMIN_DASHBOARD.brand.root)}>
          Quay lại
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Left — Image upload */}
          <div className="bg-background rounded-lg border p-6">
            <div className="flex flex-col items-center justify-center h-full border-2 border-dashed border-muted-foreground/25 rounded-lg p-8">
              {imagePreview ? (
                <div className="relative w-full max-w-[300px]">
                  {imageError && !isImageChanged ? (
                    <div className="w-full aspect-square bg-muted rounded-lg flex flex-col items-center justify-center gap-4">
                      <Upload className="h-10 w-10 text-muted-foreground/50 mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Không thể tải ảnh</p>
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
                    type="button" variant="destructive" size="icon"
                    className="absolute -top-2 -right-2 h-8 w-8 rounded-full"
                    onClick={removeImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <div className="mt-4 space-y-2">
                    {imageFile ? (
                      <>
                        <p className="text-sm text-muted-foreground text-center">{imageFile.name}</p>
                        <p className="text-xs text-muted-foreground text-center">{`${(imageFile.size / 1024).toFixed(2)} KB`}</p>
                      </>
                    ) : !imageError && (
                      <p className="text-xs text-muted-foreground text-center">Ảnh hiện tại</p>
                    )}
                    <Button
                      type="button" variant="outline" size="sm" className="w-full"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="h-4 w-4 mr-2" /> Thay đổi ảnh
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <Upload className="h-10 w-10 text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground mb-2">Chưa chọn hình ảnh</p>
                  <p className="text-xs text-muted-foreground mb-4 text-center">Định dạng: JPG, PNG, GIF (Tối đa 5MB)</p>
                  <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                    <Upload className="h-4 w-4 mr-2" /> Tải lên
                  </Button>
                </>
              )}
              <input
                ref={fileInputRef} type="file" accept="image/*"
                className="hidden" onChange={handleImageChange}
              />
            </div>
          </div>

          {/* Right — Brand info */}
          <div className="bg-background rounded-lg border p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Thông tin thương hiệu</h2>
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormLabel>Trạng thái</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value === EBrandStatus.Active}
                        onCheckedChange={(checked) =>
                          field.onChange(checked ? EBrandStatus.Active : EBrandStatus.Inactive)
                        }
                        disabled={updateBrandMutation.isPending}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem>
                <FormLabel>Tên thương hiệu <span className="text-destructive">*</span></FormLabel>
                <FormControl>
                  <Input placeholder="Nhập tên thương hiệu" {...field} disabled={updateBrandMutation.isPending} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="fullname" render={({ field }) => (
              <FormItem>
                <FormLabel>Tên đầy đủ</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập tên đầy đủ" {...field} disabled={updateBrandMutation.isPending} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="slogan" render={({ field }) => (
              <FormItem>
                <FormLabel>Slogan</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập slogan" {...field} disabled={updateBrandMutation.isPending} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="address" render={({ field }) => (
              <FormItem>
                <FormLabel>Địa chỉ <span className="text-destructive">*</span></FormLabel>
                <FormControl>
                  <Textarea placeholder="Địa chỉ của thương hiệu" {...field} disabled={updateBrandMutation.isPending} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            {/* Configuration Section — dynamic theo system config */}
            {systemConfigs.length > 0 && (
              <div className="space-y-3">
                <div>
                  <h3 className="text-sm font-semibold">Cấu hình thương hiệu</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Các cấu hình hệ thống áp dụng cho thương hiệu này
                  </p>
                </div>
                <div className="border rounded-lg p-4">
                  <BrandConfigurationSection
                    systemConfigs={systemConfigs}
                    initialConfiguration={brand.configuration}
                    disabled={updateBrandMutation.isPending}
                    onChange={(json) => {
                      setConfigurationJson(json);
                      form.setValue("configuration", json, { shouldDirty: true });
                    }}
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Nhập email" {...field} disabled={updateBrandMutation.isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="phoneNumber" render={({ field }) => (
                <FormItem>
                  <FormLabel>Số điện thoại</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập số điện thoại" {...field} disabled={updateBrandMutation.isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button" variant="outline"
                onClick={() => navigate(PATH_SYSTEM_ADMIN_DASHBOARD.brand.root)}
                disabled={updateBrandMutation.isPending}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={updateBrandMutation.isPending}>
                {updateBrandMutation.isPending ? (
                  <><LoaderCircleIcon className="mr-2 h-4 w-4 animate-spin" />Đang lưu...</>
                ) : "Cập nhật"}
              </Button>
            </div>
          </div>

        </form>
      </Form>
    </div>
  );
};