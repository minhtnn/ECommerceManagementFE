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
import { EndCustomerAccountLayout } from "@/layouts/EndCustomerAccountLayout";
import {
  ChangePasswordSchema,
  TChangePasswordRequest,
} from "@/schemas/auth.schema";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, KeyRound, Loader2, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

const CustomerChangePasswordPage = () => {
  const { changePassword } = useAuth();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<TChangePasswordRequest>({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const changePasswordMutation = changePassword();

  const onSubmit = async (data: TChangePasswordRequest) => {
    changePasswordMutation.mutate(data);
  };

  return (
    <EndCustomerAccountLayout breadcrumbs={[{ label: "Đổi mật khẩu" }]}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <KeyRound className="w-7 h-7" />
          Đổi mật khẩu
        </h1>
        <p className="text-muted-foreground mt-1">
          Cập nhật mật khẩu của bạn để bảo mật tài khoản
        </p>
      </div>

      <div className="bg-background rounded-lg border p-6 max-w-2xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Current Password */}
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Mật khẩu hiện tại{" "}
                    <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showCurrentPassword ? "text" : "password"}
                        placeholder="Nhập mật khẩu hiện tại"
                        className="pr-10"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowCurrentPassword(!showCurrentPassword)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showCurrentPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* New Password */}
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Mật khẩu mới <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showNewPassword ? "text" : "password"}
                        placeholder="Nhập mật khẩu mới"
                        className="pr-10"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showNewPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                  <div className="text-xs text-muted-foreground mt-2 space-y-1">
                    <p className="flex items-center gap-1">
                      <ShieldCheck className="h-3 w-3" />
                      Mật khẩu phải có ít nhất 8 ký tự
                    </p>
                    <p className="flex items-center gap-1">
                      <ShieldCheck className="h-3 w-3" />
                      Bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt
                      (@$!%*?&#)
                    </p>
                  </div>
                </FormItem>
              )}
            />

            {/* Confirm New Password */}
            <FormField
              control={form.control}
              name="confirmNewPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Xác nhận mật khẩu mới{" "}
                    <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Nhập lại mật khẩu mới"
                        className="pr-10"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Buttons */}
            <div className="flex gap-3 pt-4 border-t">
              <Button
                type="submit"
                disabled={changePasswordMutation.isPending}
                className="min-w-[140px]"
              >
                {changePasswordMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  "Đổi mật khẩu"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
                disabled={changePasswordMutation.isPending}
              >
                Hủy bỏ
              </Button>
            </div>
          </form>
        </Form>

        {/* Security Notice */}
        <div className="mt-6 p-4 bg-muted/50 rounded-md">
          <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-primary" />
            Lưu ý bảo mật
          </h3>
          <ul className="text-xs text-muted-foreground space-y-1 ml-6 list-disc">
            <li>
              Sau khi đổi mật khẩu thành công, bạn sẽ được yêu cầu đăng nhập lại
            </li>
            <li>Tất cả các phiên đăng nhập khác sẽ bị đăng xuất tự động</li>
            <li>Không chia sẻ mật khẩu của bạn với bất kỳ ai</li>
          </ul>
        </div>
      </div>
    </EndCustomerAccountLayout>
  );
};

export default CustomerChangePasswordPage;