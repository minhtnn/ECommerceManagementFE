import { ContactAndSupport } from "@/assets";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCustomer } from "@/hooks/use-customer";
import { useToast } from "@/hooks/use-toast";
import { handleApiError } from "@/lib/error";
import {
  CreateCustomerConsultantSchema,
  TCreateCustomerConsultant,
} from "@/schemas/customer.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronRight, Clock, Mail, MapPin, Phone } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const ContactPage = () => {
  const navigate = useNavigate();
  const { createCustomerConsultant } = useCustomer();
  const createCustomerConsultantMutation = createCustomerConsultant();

  const form = useForm<TCreateCustomerConsultant>({
    resolver: zodResolver(CreateCustomerConsultantSchema),
    defaultValues: {
      customerFullName: "",
      customerEmail: "",
      customerPhone: "",
      customerMessage: "",
    },
  });

  // const handleFaqClick = (topic: string) => {
  //   navigate(`/support-chat?topic=${encodeURIComponent(topic)}`);
  // };

  const onSubmit = async (data: TCreateCustomerConsultant) => {
    if (createCustomerConsultantMutation.isPending) return;
    try {
      const result = await createCustomerConsultantMutation.mutateAsync(data);
      if (result?.data?.status >= 200 && result?.data?.status < 300) {
        toast.success(
          result?.data?.message || "Gửi thông tin đăng kí tư vấn thành công!",
        );
        form.reset();
      } else {
        toast.error(
          result?.data?.message || "Lỗi gửi thông tin đăng kí tư vấn!",
        );
      }
    } catch (err) {
      handleApiError(err);
    }
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Hotline",
      content: "0909.429.323",
      subContent: "Miễn phí cuộc gọi",
    },
    {
      icon: Mail,
      title: "Email",
      content: "unicoffeeroasteryvn@gmail.com",
      subContent: "Phản hồi trong 24h",
    },
    {
      icon: MapPin,
      title: "Địa chỉ",
      content:
        "Tầng 1, Tòa nhà QTSC Building 9, Lô 42, Đường só 3, Công Viên Phần Mềm Quang Trung, P. Tân Chánh Hiệp, Q12",
      subContent: "TP. Hồ Chí Minh",
    },
    {
      icon: Clock,
      title: "Giờ làm việc",
      content: "8:00 - 22:00",
      subContent: "Thứ 2 - Chủ nhật",
    },
  ];

  return (
    <>
      {/* Hero */}
      <div className="relative h-[300px] md:h-[400px]">
        <img
          src={ContactAndSupport}
          alt="Contact Uni Coffee"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Contact Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-16">
          {contactInfo.map((item, index) => (
            <div
              key={item.title}
              className="text-center p-6 bg-cream rounded-lg animate-fade-in hover:shadow-lg transition-shadow"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <item.icon size={28} className="text-primary-foreground" />
              </div>
              <h3 className="font-bold text-foreground mb-1">{item.title}</h3>
              <p className="text-primary font-semibold">{item.content}</p>
              <p className="text-sm text-muted-foreground">{item.subContent}</p>
            </div>
          ))}
        </div>

        {/* Contact Form & FAQ */}
        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          {/* Contact Form */}
          <div className="rounded-lg p-6 md:p-8">
            <h1 className="font-sans text-lg font-semibold tracking-wide uppercase mb-6">
              ĐĂNG KÝ TƯ VẤN
            </h1>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="customerFullName"
                    render={({ field }) => (
                      <FormItem className="w-full border-b-2 border-foreground bg-transparent py-3 text-sm font-sans outline-none placeholder:text-muted-foreground transition-colors p-0 m-0">
                        <FormControl className="flex items-center">
                          <Input
                            type="text"
                            placeholder="Họ và tên"
                            {...field}
                            className="border-none focus:ring-0 w-full p-0 m-0"
                            disabled={
                              createCustomerConsultantMutation.isPending
                            }
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
                    name="customerEmail"
                    render={({ field }) => (
                      <FormItem className="w-full border-b-2 border-foreground bg-transparent py-3 text-sm font-sans outline-none placeholder:text-muted-foreground transition-colors p-0 m-0">
                        <FormControl className="flex items-center">
                          <Input
                            type="email"
                            placeholder="Email"
                            {...field}
                            className="border-none focus:ring-0 w-full p-0 m-0"
                            disabled={
                              createCustomerConsultantMutation.isPending
                            }
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
                    name="customerPhone"
                    render={({ field }) => (
                      <FormItem className="w-full border-b-2 border-foreground bg-transparent py-3 text-sm font-sans outline-none placeholder:text-muted-foreground transition-colors p-0 m-0">
                        <FormControl className="flex items-center">
                          <Input
                            type="tel"
                            placeholder="Số điện thoại"
                            {...field}
                            className="border-none focus:ring-0 w-full p-0 m-0"
                            disabled={
                              createCustomerConsultantMutation.isPending
                            }
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
                    name="customerMessage"
                    render={({ field }) => (
                      <FormItem className="w-full border-b-2 border-foreground bg-transparent py-3 text-sm font-sans outline-none placeholder:text-muted-foreground transition-colors p-0 m-0">
                        <FormControl className="flex items-center">
                          <Textarea
                            placeholder="Nội dung yêu cầu"
                            rows={4}
                            {...field}
                            className="border-none focus:ring-0 w-full p-0 m-0"
                            disabled={
                              createCustomerConsultantMutation.isPending
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground py-4 text-sm font-semibold tracking-[0.15em] uppercase font-sans hover:opacity-90 transition-opacity"
                >
                  GỬI YÊU CẦU
                </Button>
              </form>
            </Form>
          </div>

          {/* FAQ Section */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Câu hỏi thường gặp
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: "Làm sao để theo dõi đơn hàng?",
                  a: "Bạn có thể theo dõi đơn hàng bằng cách đăng nhập vào tài khoản và vào mục 'Đơn hàng của tôi' hoặc liên hệ hotline.",
                },
                {
                  q: "Chính sách đổi trả như thế nào?",
                  a: "Chúng tôi hỗ trợ đổi trả trong vòng 7 ngày kể từ ngày nhận hàng nếu sản phẩm bị lỗi hoặc không đúng mô tả.",
                },
                {
                  q: "Thời gian giao hàng mất bao lâu?",
                  a: "Nội thành HCM: 1-2 ngày. Các tỉnh thành khác: 3-5 ngày làm việc.",
                },
                {
                  q: "Có hỗ trợ mua sỉ không?",
                  a: "Có, chúng tôi có chương trình giá sỉ đặc biệt cho đại lý và doanh nghiệp. Vui lòng liên hệ hotline để được tư vấn.",
                },
              ].map((faq, index) => (
                <div
                  key={index}
                  className="bg-muted/30 rounded-lg p-4 animate-fade-in cursor-pointer hover:bg-muted/50 transition-colors group"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  // onClick={() => handleFaqClick(faq.q)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">
                        {faq.q}
                      </h3>
                      <p className="text-sm text-muted-foreground">{faq.a}</p>
                    </div>
                    {/* <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-1" /> */}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center bg-primary text-primary-foreground rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-4">Cần hỗ trợ ngay?</h2>
          <p className="text-primary-foreground/80 mb-6">
            Đội ngũ chăm sóc khách hàng của chúng tôi sẵn sàng hỗ trợ bạn 24/7
          </p>
          <a
            href="tel:0909429323"
            className="inline-block bg-accent hover:bg-accent/90 text-accent-foreground font-bold px-8 py-3 rounded-full transition-colors"
          >
            <Phone className="w-5 h-5 inline mr-2" />
            Gọi ngay: 0909.429.323
          </a>
        </div>
      </div>
    </>
  );
};

export default ContactPage;
