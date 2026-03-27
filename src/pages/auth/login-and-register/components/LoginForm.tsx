import { GoogleIcon } from "@/assets";
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
import { auth, googleProvider } from "@/lib/firebase";
import { setUser } from "@/redux/user/user-slice";
import { PATH_AUTH } from "@/routes/path";
import {
  FELoginSchema,
  TBELoginRequest,
  TFELoginRequest,
} from "@/schemas/auth.schema";
import { ERole } from "@/types/enums/role.enum";
import { zodResolver } from "@hookform/resolvers/zod";
import { el } from "date-fns/locale";
import { signInWithPopup } from "firebase/auth";
import { jwtDecode } from "jwt-decode";
import { LoaderCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "sonner";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { login, endCustomerGoogleLoginAndRegister } = useAuth();
  const loginMutation = login();
  const loginGoogleMutation = endCustomerGoogleLoginAndRegister();
  const dispatch = useDispatch();
  const form = useForm<TFELoginRequest>({
    resolver: zodResolver(FELoginSchema),
    defaultValues: {
      usernameOrEmail: "",
      password: "",
    },
  });

  const onNormalLoginSubmit = async (data: TFELoginRequest) => {
    if (loginMutation.isPending) return;
    try {
      const loginData: TBELoginRequest = {
        password: data.password,
        ...(data.usernameOrEmail?.includes("@")
          ? { email: data.usernameOrEmail }
          : { username: data.usernameOrEmail }),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      };
      const result = await loginMutation.mutateAsync(loginData);
      if (result?.data?.status >= 200 && result?.data?.status < 300) {
        const accessToken = result.data.data.accessToken;
        const role = (jwtDecode(accessToken) as any).role;
        if (!(role in ERole)) {
          toast.error("Vai trò người dùng không hợp lệ.");
          return;
        }
        dispatch(setUser({ ...result.data.data, role: ERole[role] }));
      } else {
        toast.error(result?.data?.message || "Đăng nhập thất bại");
      }
    } catch (error) {
      handleApiError(error);
    }
  };
  const onGoogleLoginSubmit = async () => {
    if (loginGoogleMutation.isPending) return;

    try {
      // 1. Mở popup Google Sign-In
      const result = await signInWithPopup(auth, googleProvider);

      // 2. Lấy ID Token từ Firebase
      const idToken = await result.user.getIdToken();

      // 3. Gửi lên BE
      const response = await loginGoogleMutation.mutateAsync({
        IdToken: idToken,
        TimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });

      if (response?.data?.status >= 200 && response?.data?.status < 300) {
        const accessToken = response.data.data.accessToken;
        const role = (jwtDecode(accessToken) as any).role;

        if (!(role in ERole)) {
          toast.error("Vai trò người dùng không hợp lệ.");
          return;
        }

        dispatch(setUser({ ...response.data.data, role: ERole[role] }));
        toast.success("Đăng nhập thành công!");
      } else {
        toast.error(response?.data?.message || "Đăng ký Google thất bại");
      }
    } catch (error: any) {
      // Firebase errors
      if (error.code && error.code.startsWith("auth/")) {
        const firebaseErrors: Record<string, string> = {
          "auth/popup-closed-by-user": "Bạn đã đóng cửa sổ đăng nhập",
          "auth/cancelled-popup-request": "Yêu cầu đăng nhập đã bị hủy",
          "auth/popup-blocked":
            "Trình duyệt chặn popup. Vui lòng cho phép popup.",
          "auth/account-exists-with-different-credential":
            "Email đã được đăng ký bằng phương thức khác",
          "auth/user-not-found":
            "Tài khoản không tồn tại. Vui lòng đăng ký trước.",
        };

        // Không hiển thị error cho popup close
        if (
          ![
            "auth/popup-closed-by-user",
            "auth/cancelled-popup-request",
          ].includes(error.code)
        ) {
          toast.error(firebaseErrors[error.code] || error.message, {
            duration: 5000,
            position: "top-right",
          });
        }
        return;
      }

      // API errors
      handleApiError(error);
    }
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onNormalLoginSubmit)}
        className="space-y-4"
      >
        <div className="space-y-2">
          <FormField
            control={form.control}
            name="usernameOrEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  EMAIL OR USERNAME<span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    id="login-email"
                    type="text"
                    placeholder="Nhập Địa chỉ Email"
                    className={`h-11 ${
                      form.formState.errors.usernameOrEmail
                        ? "border-destructive"
                        : ""
                    }`}
                    disabled={loginMutation.isPending}
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
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  MẬT KHẨU<span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="Nhập Mật khẩu"
                    className={`h-11 ${
                      form.formState.errors.password ? "border-destructive" : ""
                    }`}
                    disabled={loginMutation.isPending}
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs text-destructive" />
              </FormItem>
            )}
          />
          <div className="text-right">
            <Link
              to={PATH_AUTH.forgotPassword}
              className="text-sm text-primary hover:underline"
            >
              Quên mật khẩu?
            </Link>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full h-11 text-base font-medium"
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending ? (
            <>
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
              Đang xử lý...
            </>
          ) : (
            "ĐĂNG NHẬP"
          )}
        </Button>
        {/* Divider */}
        <div className="relative my-2">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Hoặc
            </span>
          </div>
        </div>

        {/* Google Login Button */}
        <Button
          type="button"
          variant="outline"
          className="w-full h-11 gap-2"
          onClick={onGoogleLoginSubmit}
          disabled={loginGoogleMutation.isPending}
        >
          {loginGoogleMutation.isPending ? (
            <LoaderCircle className="h-4 w-4 animate-spin" />
          ) : (
            <img src={GoogleIcon} alt="Google" className="w-5 h-5" />
          )}
          Đăng nhập với Google
        </Button>
        <p className="text-xs text-muted-foreground text-center mt-4">
          Uni Coffee cam kết bảo mật và sẽ không bao giờ đăng hay chia sẻ thông
          tin mà chưa có được sự đồng ý của bạn.
        </p>
      </form>
    </Form>
  );
}
