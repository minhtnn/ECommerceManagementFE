import EndUserLayout from "@/layouts/EndUserLayout";
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
  ResetPasswordSchema,
  TResetPasswordRequest,
} from "@/schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  Check,
  ChevronRight,
  Eye,
  EyeOff,
  LoaderCircle,
  LockKeyhole,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PATH_AUTH } from "@/routes/path";

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { validateResetToken, resetPassword } = useAuth();
  const validateTokenMutation = validateResetToken();
  const resetPasswordMutation = resetPassword();

  const [isValidating, setIsValidating] = useState(true);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const hashParams = new URLSearchParams(location.hash.substring(1));
const token = hashParams.get("token");
const email = hashParams.get("email");

  const form = useForm<TResetPasswordRequest>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      email: email || "",
      token: token || "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  // Validate token on mount
  useEffect(() => {
    const validateToken = async () => {
      if (!token || !email) {
        toast.error("Link không hợp lệ");
        navigate(PATH_AUTH.forgotPassword, { replace: true });
        return;
      }

      try {
        setIsValidating(true);
        const result = await validateTokenMutation.mutateAsync({
          token,
          email,
        });

        if (result?.data?.status >= 200 && result?.data?.status < 300) {
          setIsTokenValid(true);
        } else {
          toast.error(
            result?.data?.message || "Link không hợp lệ hoặc đã hết hạn"
          );
          navigate(PATH_AUTH.forgotPassword, { replace: true });
        }
      } catch (error: any) {
        handleApiError(error);
        navigate(PATH_AUTH.forgotPassword, { replace: true });
      } finally {
        setIsValidating(false);
      }
    };

    validateToken();
  }, [token, email, navigate]);

  const onSubmit = async (data: TResetPasswordRequest) => {
    if (resetPasswordMutation.isPending) return;

    try {
      const result = await resetPasswordMutation.mutateAsync(data);

      if (result?.data?.status >= 200 && result?.data?.status < 300) {
        toast.success(
          result?.data?.message ||
            "Đặt lại mật khẩu thành công! Vui lòng đăng nhập."
        );
        navigate(PATH_AUTH.login, { replace: true });
      } else {
        toast.error(result?.data?.message || "Có lỗi xảy ra, vui lòng thử lại");
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  // Loading state
  if (isValidating) {
    return (
      <EndUserLayout>
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-md mx-auto">
            <div className="bg-background rounded-lg shadow-lg border p-8">
              <div className="flex flex-col items-center justify-center py-12">
                <LoaderCircle className="w-12 h-12 text-primary animate-spin mb-4" />
                <p className="text-muted-foreground">Đang xác thực...</p>
              </div>
            </div>
          </div>
        </div>
      </EndUserLayout>
    );
  }

  // Invalid token - will redirect
  if (!isTokenValid) {
    return null;
  }

  return (
    <EndUserLayout>
      {/* Breadcrumb */}
      <div className="bg-muted/30 py-3 border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 text-sm">
            <Link
              to="/"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Trang chủ
            </Link>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
            <span className="text-foreground font-medium">
              Đặt lại mật khẩu
            </span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <div className="bg-background rounded-lg shadow-lg border p-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                <LockKeyhole className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mb-2">Đặt lại mật khẩu</h1>
              <p className="text-muted-foreground text-sm">
                Nhập mật khẩu mới cho tài khoản
                <br />
                <strong className="text-foreground">{email}</strong>
              </p>
            </div>

            <Alert className="mb-6 border-yellow-500/50 bg-yellow-50">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-sm text-yellow-800">
                Link này chỉ có thể sử dụng <strong>một lần duy nhất</strong> và
                sẽ hết hạn sau khi đặt lại mật khẩu.
              </AlertDescription>
            </Alert>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                {/* Hidden fields */}
                <input type="hidden" {...form.register("email")} />
                <input type="hidden" {...form.register("token")} />

                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Mật khẩu mới<span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Nhập mật khẩu mới"
                            className={`h-11 pr-10 ${
                              form.formState.errors.newPassword
                                ? "border-destructive"
                                : ""
                            }`}
                            disabled={resetPasswordMutation.isPending}
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            {showPassword ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs text-destructive" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmNewPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Xác nhận mật khẩu
                        <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Nhập lại mật khẩu mới"
                            className={`h-11 pr-10 ${
                              form.formState.errors.confirmNewPassword
                                ? "border-destructive"
                                : ""
                            }`}
                            disabled={resetPasswordMutation.isPending}
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs text-destructive" />
                    </FormItem>
                  )}
                />

                {/* Password requirements */}
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-sm font-medium mb-2">
                    Yêu cầu mật khẩu:
                  </p>
                  <ul className="space-y-1 text-xs text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <Check className="w-3 h-3" />
                      Ít nhất 8 ký tự
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3 h-3" />
                      Có ít nhất 1 chữ hoa (A-Z)
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3 h-3" />
                      Có ít nhất 1 chữ thường (a-z)
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3 h-3" />
                      Có ít nhất 1 số (0-9)
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3 h-3" />
                      Có ít nhất 1 ký tự đặc biệt (!@#$%^&*)
                    </li>
                  </ul>
                </div>

                <Button
                  type="submit"
                  className="w-full h-11"
                  disabled={resetPasswordMutation.isPending}
                >
                  {resetPasswordMutation.isPending ? (
                    <>
                      <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                      Đang xử lý...
                    </>
                  ) : (
                    "Đặt lại mật khẩu"
                  )}
                </Button>

                <div className="text-center">
                  <Link
                    to={PATH_AUTH.login}
                    className="text-sm text-primary hover:underline"
                  >
                    ← Quay lại đăng nhập
                  </Link>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </EndUserLayout>
  );
};

export default ResetPasswordPage;