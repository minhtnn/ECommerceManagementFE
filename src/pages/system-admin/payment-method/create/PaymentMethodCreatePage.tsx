import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { usePayment } from "@/hooks/use-payment";
import { handleApiError } from "@/lib/error";
import { PATH_SYSTEM_ADMIN_DASHBOARD } from "@/routes/path";
import { CreatePaymentMethodSchema, TCreatePaymentMethod } from "@/schemas/payment-method.schema";
import { EPaymentMethodStatus } from "@/types/enums/payment-method-status.enum";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload, X } from "lucide-react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const PaymentMethodsListPage = () => {
  const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);
  
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
  
    const { createPaymentMethod } = usePayment();
    const createPaymentMethodMutation = createPaymentMethod();
  
    const form = useForm<TCreatePaymentMethod>({
      resolver: zodResolver(CreatePaymentMethodSchema),
      defaultValues: {
        code: "",
        name: "",
        configurationSchema: "",
        status: EPaymentMethodStatus.Active,
      },
    });
  
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
  
    const onSubmit = async (data: TCreatePaymentMethod) => {
      if (createPaymentMethodMutation.isPending) return;
  
      const formData = new FormData();
      formData.append("Code", data.code);
      formData.append("Name", data.name);
      formData.append("ConfigurationSchema", data.configurationSchema);
      if (imageFile) {
        formData.append("Image", imageFile);
      }
      formData.append("Status", data.status.toString());
      try {
        await createPaymentMethodMutation.mutateAsync(formData);
        navigate(PATH_SYSTEM_ADMIN_DASHBOARD.paymentMethod.root);
      } catch (err) {
        handleApiError(err);
      }
    };
  
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Tạo phương thức thanh toán mới</h1>
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
                <h2 className="text-lg font-semibold">Thông tin phương thức thanh toán</h2>
                <div className="flex items-center gap-2"></div>
              </div>
  
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="code">
                        Mã phương thức thanh toán<span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Nhập mã phương thức thanh toán"
                          {...field}
                          disabled={createPaymentMethodMutation.isPending}
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
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="name">
                        Tên phương thức thanh toán<span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Nhập tên phương thức thanh toán"
                          {...field}
                          disabled={createPaymentMethodMutation.isPending}
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
                  name="configurationSchema"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="configuration">Cấu hình</FormLabel>
                      <FormControl>
                        <Textarea
                          id="configurationSchema"
                          placeholder="Cấu hình của phương thức thanh toán"
                          {...field}
                          disabled={createPaymentMethodMutation.isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
}

export default PaymentMethodsListPage;