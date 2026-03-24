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
import { ForgotPasswordSchema, TForgotPasswordRequest } from "@/schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronRight, LoaderCircle, Mail } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { PATH_AUTH } from "@/routes/path";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const { forgotPassword } = useAuth();
  const forgotPasswordMutation = forgotPassword();
  const [emailSent, setEmailSent] = useState(false);
  const [sentEmail, setSentEmail] = useState("");

  const form = useForm<TForgotPasswordRequest>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: TForgotPasswordRequest) => {
    if (forgotPasswordMutation.isPending) return;

    try {
      const result = await forgotPasswordMutation.mutateAsync(data);

      if (result?.data?.status >= 200 && result?.data?.status < 300) {
        toast.success(
          result?.data?.message ||
            "Link đặt lại mật khẩu đã được gửi đến email của bạn."
        );
        setSentEmail(data.email);
        setEmailSent(true);
      } else {
        toast.error(result?.data?.message || "Có lỗi xảy ra, vui lòng thử lại");
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleResend = () => {
    setEmailSent(false);
    form.setValue("email", sentEmail);
  };

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
            <span className="text-foreground font-medium">Quên mật khẩu</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <div className="bg-background rounded-lg shadow-lg border p-8">
            {!emailSent ? (
              <>
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                    <Mail className="w-8 h-8 text-primary" />
                  </div>
                  <h1 className="text-2xl font-bold mb-2">Quên mật khẩu?</h1>
                  <p className="text-muted-foreground text-sm">
                    Nhập địa chỉ email của bạn và chúng tôi sẽ gửi link để đặt
                    lại mật khẩu.
                  </p>
                </div>

                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                  >
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Email<span className="text-destructive">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="Nhập địa chỉ email"
                              className={`h-11 ${
                                form.formState.errors.email
                                  ? "border-destructive"
                                  : ""
                              }`}
                              disabled={forgotPasswordMutation.isPending}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-xs text-destructive" />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full h-11"
                      disabled={forgotPasswordMutation.isPending}
                    >
                      {forgotPasswordMutation.isPending ? (
                        <>
                          <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                          Đang gửi...
                        </>
                      ) : (
                        "Gửi link đặt lại mật khẩu"
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
              </>
            ) : (
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <Mail className="w-8 h-8 text-green-600" />
                </div>
                <h1 className="text-2xl font-bold mb-2">Kiểm tra email</h1>
                <p className="text-muted-foreground text-sm mb-6">
                  Chúng tôi đã gửi link đặt lại mật khẩu đến
                  <br />
                  <strong className="text-foreground">{sentEmail}</strong>
                </p>

                <div className="bg-muted/50 rounded-lg p-4 mb-6">
                  <p className="text-sm text-muted-foreground">
                    Nếu bạn không nhận được email trong vài phút, vui lòng kiểm
                    tra thư mục spam hoặc thử gửi lại.
                  </p>
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={handleResend}
                    variant="outline"
                    className="w-full h-11"
                    disabled={forgotPasswordMutation.isPending}
                  >
                    Gửi lại email
                  </Button>

                  <Link to={PATH_AUTH.login}>
                    <Button variant="ghost" className="w-full h-11">
                      ← Quay lại đăng nhập
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>

          <p className="text-xs text-muted-foreground text-center mt-6">
            Link đặt lại mật khẩu có hiệu lực trong <strong>15 phút</strong>.
            <br />
            Vui lòng không chia sẻ link này với bất kỳ ai.
          </p>
        </div>
      </div>
    </EndUserLayout>
  );
};

export default ForgotPasswordPage;