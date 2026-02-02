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
import { useAuth } from "@/hooks/use-auth";
import { handleApiError } from "@/lib/error";
import {
  handleSetRegisterEmail,
  handleToggleOTPModal,
} from "@/redux/modal/modal-slice";
import { RootState } from "@/redux/store";
import { FERegisterSchema, TFERegisterSchema } from "@/schemas/auth.schema";
import envConfig from "@/schemas/config.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Camera, LoaderCircle, Upload, X } from "lucide-react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { OTPVerificationModal } from "./OTPVerificationModal";

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { registerMutation } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showOTPModal, registerEmail } = useSelector((state: RootState) => state.modal);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const form = useForm<TFERegisterSchema>({
    resolver: zodResolver(FERegisterSchema),
    defaultValues: {
      brandCode: "",
      phoneNumber: "",
      email: "",
      username: "",
      fullName: "",
      passwordString: "",
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    validateAndSetImage(file);
  };

  const validateAndSetImage = (file: File) => {
    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Vui lòng chọn file ảnh");
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error("Kích thước ảnh không được vượt quá 5MB");
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

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      validateAndSetImage(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleVerifySuccess = () => {
    navigate("/"); // hoặc trang nào đó
  };

  const onSubmit = async (data: TFERegisterSchema) => {
    if (registerMutation.isPending) return;
    const formData = new FormData();
    formData.append("BrandCode", envConfig.BRAND_CODE);
    formData.append("Email", data.email);
    formData.append("FullName", data.fullName);
    formData.append("PhoneNumber", data.phoneNumber);
    formData.append("Username", data.username);
    formData.append("PasswordString", data.passwordString);
    if (imageFile) {
      formData.append("Avatar", imageFile);
    }

    try {
      const result = await registerMutation.mutateAsync(formData);
      if (result.data.status >= 200 && result.data.status < 300) {
        toast.info(result.data.message);
        dispatch(handleSetRegisterEmail(data.email));
        dispatch(handleToggleOTPModal(true));
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Avatar Upload Section */}
          <div className="flex flex-col items-center mb-6">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              disabled={registerMutation.isPending}
            />

            <div
              className={`relative w-32 h-32 rounded-full border-2 border-dashed transition-all cursor-pointer ${
                isDragging
                  ? "border-primary bg-primary/10"
                  : imagePreview
                    ? "border-transparent"
                    : "border-muted-foreground/25 hover:border-primary"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={!imagePreview ? handleUploadClick : undefined}
            >
              {imagePreview ? (
                <>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full rounded-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUploadClick();
                      }}
                      className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                      disabled={registerMutation.isPending}
                    >
                      <Camera className="w-4 h-4 text-gray-700" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage();
                      }}
                      className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                      disabled={registerMutation.isPending}
                    >
                      <X className="w-4 h-4 text-gray-700" />
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                  <Upload className="w-8 h-8 mb-2" />
                  <p className="text-xs text-center px-2">
                    {isDragging ? "Thả ảnh vào đây" : "Tải ảnh lên"}
                  </p>
                </div>
              )}
            </div>

            {!imagePreview && (
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Nhấn hoặc kéo thả ảnh vào đây
              </p>
            )}
          </div>

          <div className="space-y-2">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    htmlFor="register-username"
                    className="text-sm font-medium"
                  >
                    Tên đăng nhập<span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      id="register-username"
                      type="text"
                      placeholder="Nhập tên đăng nhập"
                      className={`h-11 ${
                        form.formState.errors.username
                          ? "border-destructive"
                          : ""
                      }`}
                      disabled={registerMutation.isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-destructive" />
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
                  <FormLabel
                    htmlFor="register-name"
                    className="text-sm font-medium"
                  >
                    Họ và tên<span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      id="register-name"
                      type="text"
                      placeholder="Nhập Họ và Tên"
                      className={`h-11 ${
                        form.formState.errors.fullName
                          ? "border-destructive"
                          : ""
                      }`}
                      disabled={registerMutation.isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-destructive" />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    htmlFor="register-email"
                    className="text-sm font-medium"
                  >
                    Email<span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="Nhập email"
                      className={`h-11 ${
                        form.formState.errors.email ? "border-destructive" : ""
                      }`}
                      disabled={registerMutation.isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-destructive" />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-2">
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    htmlFor="register-phone"
                    className="text-sm font-medium"
                  >
                    Số điện thoại
                  </FormLabel>
                  <FormControl>
                    <Input
                      id="register-phone"
                      type="text"
                      placeholder="Nhập số điện thoại"
                      className={`h-11 ${
                        form.formState.errors.fullName
                          ? "border-destructive"
                          : ""
                      }`}
                      disabled={registerMutation.isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-destructive" />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-2">
            <FormField
              control={form.control}
              name="passwordString"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Mật khẩu<span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="Nhập Mật khẩu"
                      className={`h-11 ${
                        form.formState.errors.passwordString
                          ? "border-destructive"
                          : ""
                      }`}
                      disabled={registerMutation.isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-destructive" />
                </FormItem>
              )}
            />
          </div>

          <Button
            type="submit"
            className="w-full h-11 text-base font-medium"
            disabled={registerMutation.isPending}
          >
            {registerMutation.isPending ? (
              <>
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                Đang xử lý...
              </>
            ) : (
              "ĐĂNG KÝ"
            )}
          </Button>

          <p className="text-xs text-muted-foreground text-center mt-4">
            Bằng việc đăng ký, bạn đã đồng ý với{" "}
            <Link to="/terms" className="text-primary hover:underline">
              Điều khoản dịch vụ
            </Link>{" "}
            &{" "}
            <Link to="/privacy" className="text-primary hover:underline">
              Chính sách bảo mật
            </Link>{" "}
            của chúng tôi.
          </p>
        </form>
      </Form>
      <OTPVerificationModal
        open={showOTPModal}
        onOpenChange={(open) => dispatch(handleToggleOTPModal(open))}
        email={registerEmail || ""}
        onVerifySuccess={handleVerifySuccess}
      />
    </>
  );
}
