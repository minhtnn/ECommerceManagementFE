import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EndUserLayout from "@/layouts/EndUserLayout";
import { Check, ChevronRight, Gift } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { LoginForm } from "./components/LoginForm";
import { RegisterForm } from "./components/RegisterForm";

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

  const memberBenefits = [
    "Giảm giá độc quyền",
    "Tích luỹ điểm thưởng",
    "Ưu tiên đối với sản phẩm mới",
  ];

  return (
    <EndUserLayout>
      {/* Breadcrumb */}

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
                  <RegisterForm/>
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
