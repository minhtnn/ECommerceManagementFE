import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { handleChangePasswordDashboardDialogOpen } from "@/redux/modal/modal-slice";
import { RootState } from "@/redux/store";
import {
  ChangePasswordSchema,
  TChangePasswordRequest,
} from "@/schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

export const ChangePasswordPageDashboardDialog = () => {
  const dispatch = useDispatch();
  // const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  // const [showNewPassword, setShowNewPassword] = useState(false);
  // const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { isChangePasswordDashboardDialogOpen } = useSelector(
    (state: RootState) => state.modal,
  );

  const { changePassword } = useAuth();

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
    <Dialog
      open={isChangePasswordDashboardDialogOpen}
      onOpenChange={(open) => {
        dispatch(handleChangePasswordDashboardDialogOpen(open));
      }}
    >
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Đổi mật khẩu</DialogTitle>
          <p className="text-muted-foreground mt-1">
            Cập nhật mật khẩu của bạn để bảo mật tài khoản
          </p>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="current-password">
                    Mật khẩu hiện tại{" "}
                    <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        // type={showCurrentPassword ? "text" : "password"}
                        type="password"
                        placeholder="Nhập mật khẩu hiện tại"
                        className="pr-10"
                        {...field}
                      />
                      {/* <button
                        type="button"
                        onClick={() =>
                          // setShowCurrentPassword(!showCurrentPassword)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showCurrentPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button> */}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="new-password">
                    Mật khẩu mới <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        // type={showNewPassword ? "text" : "password"}
                        type="password"
                        placeholder="Nhập mật khẩu mới"
                        className="pr-10"
                        {...field}
                      />
                      {/* <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showNewPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button> */}
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
                  <FormLabel htmlFor="confirm-password">
                    Xác nhận mật khẩu mới{" "}
                    <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        // type={showConfirmPassword ? "text" : "password"}
                        type="password"
                        placeholder="Nhập lại mật khẩu mới"
                        className="pr-10"
                        {...field}
                      />
                      {/* <button
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
                      </button> */}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() =>
                  dispatch(handleChangePasswordDashboardDialogOpen(false))
                }
              >
                Hủy
              </Button>
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
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
