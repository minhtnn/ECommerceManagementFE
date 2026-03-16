import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import EndUserLayout from "@/layouts/EndUserLayout";
import { AboutUniCoffeeRoastery, ContactAndSupport } from "@/assets";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleFaqClick = (topic: string) => {
    navigate(`/support-chat?topic=${encodeURIComponent(topic)}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Gửi thành công!",
      description: "Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.",
    });
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Hotline",
      content: "1900 123 456",
      subContent: "Miễn phí cuộc gọi",
    },
    {
      icon: Mail,
      title: "Email",
      content: "support@unicoffee.vn",
      subContent: "Phản hồi trong 24h",
    },
    {
      icon: MapPin,
      title: "Địa chỉ",
      content: "123 Nguyễn Huệ, Quận 1",
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
    <EndUserLayout>
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
          <div className="bg-cream rounded-lg p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <MessageCircle className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">
                Gửi tin nhắn
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  placeholder="Họ và tên *"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  className="bg-background"
                />
                <Input
                  type="email"
                  placeholder="Email *"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  className="bg-background"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  placeholder="Số điện thoại"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="bg-background"
                />
                <Input
                  placeholder="Chủ đề"
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  className="bg-background"
                />
              </div>
              <Textarea
                placeholder="Nội dung tin nhắn *"
                rows={5}
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                required
                className="bg-background resize-none"
              />
              <Button type="submit" className="w-full">
                <Send className="w-4 h-4 mr-2" />
                Gửi tin nhắn
              </Button>
            </form>
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
                  onClick={() => handleFaqClick(faq.q)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">
                        {faq.q}
                      </h3>
                      <p className="text-sm text-muted-foreground">{faq.a}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-1" />
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
            href="tel:1900123456"
            className="inline-block bg-accent hover:bg-accent/90 text-accent-foreground font-bold px-8 py-3 rounded-full transition-colors"
          >
            <Phone className="w-5 h-5 inline mr-2" />
            Gọi ngay: 1900 123 456
          </a>
        </div>
      </div>
    </EndUserLayout>
  );
};

export default ContactPage;
