// pages/system-admin/brand/BrandCreatePage.tsx
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
import { Textarea } from "@/components/ui/textarea";
import { useBrand } from "@/hooks/use-brand";
import { useSystemConfig } from "@/hooks/use-system-config";
import { handleApiError } from "@/lib/error";
import { PATH_SYSTEM_ADMIN_DASHBOARD } from "@/routes/path";
import { CreateBrandSchema, TCreateBrandRequest } from "@/schemas/brand.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload, X } from "lucide-react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { BrandConfigurationSection } from "./components/BrandConfigurationSection";

const BrandCreatePage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [configurationJson, setConfigurationJson] = useState<string>("");

  const { createBrand } = useBrand();
  const createBrandMutation = createBrand();

  const { getSystemConfigs } = useSystemConfig();
  const { data: configData } = getSystemConfigs();
  const systemConfigs = configData?.data?.data ?? [];

  const form = useForm<TCreateBrandRequest>({
    resolver: zodResolver(CreateBrandSchema),
    defaultValues: {},
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Vui lòng chọn file ảnh");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("Kích thước ảnh không được vượt quá 5MB");
      return;
    }
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

  const onSubmit = async (data: TCreateBrandRequest) => {
    if (createBrandMutation.isPending) return;

    const formData = new FormData();
    formData.append("Code", data.code);
    formData.append("Name", data.name);
    formData.append("Email", data.email);
    if (data.phoneNumber) formData.append("PhoneNumber", data.phoneNumber);
    formData.append("Username", data.username);
    formData.append("PasswordString", data.passwordString);
    formData.append("Address", data.address);
    if (imageFile) formData.append("Logo", imageFile);
    if (configurationJson) formData.append("Configuration", configurationJson);

    try {
      await createBrandMutation.mutateAsync(formData);
      navigate(PATH_SYSTEM_ADMIN_DASHBOARD.brand.root);
    } catch (err) {
      handleApiError(err);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Tạo thương hiệu mới</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Left — Image upload */}
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
                  <p className="text-muted-foreground mb-2">Chưa chọn hình ảnh</p>
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

          {/* Right — Brand info */}
          <div className="bg-background rounded-lg border p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Thông tin thương hiệu</h2>
            </div>

            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Mã thương hiệu <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nhập mã thương hiệu"
                      {...field}
                      disabled={createBrandMutation.isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Tên thương hiệu <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nhập tên thương hiệu"
                      {...field}
                      disabled={createBrandMutation.isPending}
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
                  <FormLabel>
                    Địa chỉ <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Địa chỉ của thương hiệu"
                      {...field}
                      disabled={createBrandMutation.isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Configuration Section */}
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
                    initialConfiguration={null}
                    disabled={createBrandMutation.isPending}
                    onChange={(json) => {
                      setConfigurationJson(json);
                      form.setValue("configuration", json, {
                        shouldDirty: true,
                      });
                    }}
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Email <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Nhập email"
                        {...field}
                        disabled={createBrandMutation.isPending}
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
                    <FormLabel>Số điện thoại</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nhập số điện thoại"
                        {...field}
                        disabled={createBrandMutation.isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Tên tài khoản <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nhập tên tài khoản"
                        {...field}
                        disabled={createBrandMutation.isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="passwordString"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Mật khẩu <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Nhập mật khẩu"
                        {...field}
                        disabled={createBrandMutation.isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                disabled={createBrandMutation.isPending}
                className="bg-primary hover:bg-primary/90"
              >
                {createBrandMutation.isPending ? "Đang lưu..." : "Lưu"}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default BrandCreatePage;