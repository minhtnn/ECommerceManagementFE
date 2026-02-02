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
import { setUser } from "@/redux/user/user-slice";
import {
  FELoginSchema,
  TBELoginRequest,
  TFELoginRequest,
} from "@/schemas/auth.schema";
import { ERole } from "@/types/enums/role.enum";
import { zodResolver } from "@hookform/resolvers/zod";
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
  const { loginMutation } = useAuth();
  const dispatch = useDispatch();
  const form = useForm<TFELoginRequest>({
    resolver: zodResolver(FELoginSchema),
    defaultValues: {
      usernameOrEmail: "",
      password: "",
    },
  });

  const onSubmit = async (data: TFELoginRequest) => {
    if (loginMutation.isPending) return;
    try {
      const loginData: TBELoginRequest = {
        password: data.password,
        ...(data.usernameOrEmail?.includes("@")
          ? { email: data.usernameOrEmail }
          : { username: data.usernameOrEmail }),
      };
      const result = await loginMutation.mutateAsync(loginData);
      const accessToken = result.data.data.accessToken;
      // console.log("Access Token:", jwtDecode(accessToken));
      const role = (jwtDecode(accessToken) as any).role;
      if ((!(role in ERole))) {
        toast.error("Vai trò người dùng không hợp lệ.");
        return;
      }
      dispatch(setUser({ ...result.data.data, role: ERole[role] }));
    } catch (error) {
      handleApiError(error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
              to="/forgot-password"
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

        <p className="text-xs text-muted-foreground text-center mt-4">
          Uni Coffee cam kết bảo mật và sẽ không bao giờ đăng hay chia sẻ thông
          tin mà chưa có được sự đồng ý của bạn.
        </p>
      </form>
    </Form>
  );
}
