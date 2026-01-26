import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EndUserLayout from "@/layouts/EndUserLayout";
import { Check, ChevronRight, Gift } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { LoginForm } from "./components/LoginForm";

const LoginPage = () => {
  const navigate = useNavigate();
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerName, setRegisterName] = useState("");
  const [registerPhone, setRegisterPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = (
    schema: z.ZodType,
    value: string,
    fieldName: string
  ): boolean => {
    try {
      schema.parse(value);
      setErrors((prev) => ({ ...prev, [fieldName]: "" }));
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors((prev) => ({
          ...prev,
          [fieldName]: error.errors[0].message,
        }));
      }
      return false;
    }
  };

  // const handleRegister = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setErrors({});

  //   const nameValid = validateField(nameSchema, registerName, "registerName");
  //   const phoneValid = validateField(
  //     phoneSchema,
  //     registerPhone,
  //     "registerPhone"
  //   );
  //   const emailValid = validateField(
  //     emailSchema,
  //     registerEmail,
  //     "registerEmail"
  //   );
  //   const passwordValid = validateField(
  //     passwordSchema,
  //     registerPassword,
  //     "registerPassword"
  //   );

  //   if (!nameValid || !phoneValid || !emailValid || !passwordValid) return;

  //   setIsLoading(true);
  //   // try {
  //   //   const redirectUrl = `${window.location.origin}/`;

  //   //   const { error } = await supabase.auth.signUp({
  //   //     email: registerEmail.trim(),
  //   //     password: registerPassword,
  //   //     options: {
  //   //       emailRedirectTo: redirectUrl,
  //   //       data: {
  //   //         full_name: registerName.trim(),
  //   //         phone: registerPhone.trim(),
  //   //       }
  //   //     }
  //   //   });

  //   //   if (error) {
  //   //     if (error.message.includes("User already registered")) {
  //   //       toast.error("Email này đã được đăng ký. Vui lòng đăng nhập.");
  //   //     } else {
  //   //       toast.error(error.message);
  //   //     }
  //   //     return;
  //   //   }

  //   //   toast.success("Đăng ký thành công! Chào mừng bạn đến với UNI COFFEE.");
  //   //   navigate("/");
  //   // } catch (error) {
  //   //   toast.error("Có lỗi xảy ra, vui lòng thử lại");
  //   // } finally {
  //   //   setIsLoading(false);
  //   // }
  // };

  const memberBenefits = [
    "Giảm giá độc quyền",
    "Tích luỹ điểm thưởng",
    "Ưu tiên đối với sản phẩm mới",
  ];

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
              Đăng nhập tài khoản
            </span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-0 bg-background rounded-lg overflow-hidden shadow-lg border">
            {/* Left Side - Promotional Banner */}
            <div className="bg-gradient-to-br from-primary/90 to-primary p-8 text-primary-foreground flex flex-col justify-center items-center text-center">
              <p className="text-sm mb-2 opacity-90">
                Thưởng thức <span className="font-bold">UNI COFFEE</span>, tại
                nhà!
              </p>
              <h2 className="text-3xl font-bold mb-6">
                ĐĂNG KÝ
                <br />
                THÀNH VIÊN
              </h2>

              {/* Gift illustration */}
              <div className="relative w-40 h-40 mb-8">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 bg-primary-foreground/20 rounded-lg rotate-12 flex items-center justify-center">
                    <Gift className="w-16 h-16 text-primary-foreground" />
                  </div>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-yellow-900">★</span>
                </div>
                <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-yellow-900">★</span>
                </div>
              </div>

              <h3 className="text-lg font-bold mb-4">QUYỀN LỢI THÀNH VIÊN</h3>
              <ul className="space-y-2 text-left">
                {memberBenefits.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    <span className="text-sm">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right Side - Auth Forms */}
            <div className="p-8">
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="login" className="text-sm font-medium">
                    Đăng nhập
                  </TabsTrigger>
                  <TabsTrigger value="register" className="text-sm font-medium">
                    Đăng ký
                  </TabsTrigger>
                </TabsList>

                {/* Login Tab */}
                <TabsContent value="login">
                  <LoginForm/>
                </TabsContent>

                {/* Register Tab */}
                <TabsContent value="register">
                  {/* <form onSubmit={handleRegister} className="space-y-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="register-name"
                        className="text-sm font-medium"
                      >
                        HỌ VÀ TÊN<span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="register-name"
                        type="text"
                        placeholder="Nhập Họ và Tên"
                        value={registerName}
                        onChange={(e) => setRegisterName(e.target.value)}
                        required
                        className={`h-11 ${
                          errors.registerName ? "border-destructive" : ""
                        }`}
                        disabled={isLoading}
                      />
                      {errors.registerName && (
                        <p className="text-xs text-destructive">
                          {errors.registerName}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="register-phone"
                        className="text-sm font-medium"
                      >
                        SỐ ĐIỆN THOẠI<span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="register-phone"
                        type="tel"
                        placeholder="Nhập Số điện thoại"
                        value={registerPhone}
                        onChange={(e) => setRegisterPhone(e.target.value)}
                        required
                        className={`h-11 ${
                          errors.registerPhone ? "border-destructive" : ""
                        }`}
                        disabled={isLoading}
                      />
                      {errors.registerPhone && (
                        <p className="text-xs text-destructive">
                          {errors.registerPhone}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="register-email"
                        className="text-sm font-medium"
                      >
                        EMAIL<span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="Nhập Địa chỉ Email"
                        value={registerEmail}
                        onChange={(e) => setRegisterEmail(e.target.value)}
                        required
                        className={`h-11 ${
                          errors.registerEmail ? "border-destructive" : ""
                        }`}
                        disabled={isLoading}
                      />
                      {errors.registerEmail && (
                        <p className="text-xs text-destructive">
                          {errors.registerEmail}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="register-password"
                        className="text-sm font-medium"
                      >
                        MẬT KHẨU<span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="register-password"
                        type="password"
                        placeholder="Nhập Mật khẩu"
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                        required
                        className={`h-11 ${
                          errors.registerPassword ? "border-destructive" : ""
                        }`}
                        disabled={isLoading}
                      />
                      {errors.registerPassword && (
                        <p className="text-xs text-destructive">
                          {errors.registerPassword}
                        </p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-11 text-base font-medium"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Đang xử lý...
                        </>
                      ) : (
                        "ĐĂNG KÝ"
                      )}
                    </Button>

                    <p className="text-xs text-muted-foreground text-center mt-4">
                      Bằng việc đăng ký, bạn đã đồng ý với{" "}
                      <Link
                        to="/terms"
                        className="text-primary hover:underline"
                      >
                        Điều khoản dịch vụ
                      </Link>{" "}
                      &{" "}
                      <Link
                        to="/privacy"
                        className="text-primary hover:underline"
                      >
                        Chính sách bảo mật
                      </Link>{" "}
                      của chúng tôi.
                    </p>
                  </form> */}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </EndUserLayout>
  );
};
export default LoginPage;
