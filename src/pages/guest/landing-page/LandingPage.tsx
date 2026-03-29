import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import ImagePlaceholder from "../../../components/ImagePlaceholder";
import { useState } from "react";
import { PATH_GUEST } from "@/routes/path";

const LandingPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero */}
      <section className="bg-secondary">
        <div className="content-container py-16 md:py-24">
          <h1 className="font-sans text-4xl md:text-5xl lg:text-7xl font-black leading-[1.05] mb-6 max-w-3xl">
            Cà Phê Bền Vững.
            <br />
            Từ Nông Trại Đến Ly.
          </h1>
          <p className="section-subtitle max-w-xl mb-10">
            Chúng tôi cung cấp cà phê nhân xanh, cà phê rang xay và dịch vụ gia
            công OEM cho quán, chuỗi và thương hiệu cà phê trên toàn quốc.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to={PATH_GUEST.services.greenCoffee}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 text-sm font-semibold tracking-wide uppercase font-sans hover:opacity-90 transition-opacity"
            >
              NHÂN XANH <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to={PATH_GUEST.services.roastedCoffee}
              className="inline-flex items-center gap-2 border-2 border-foreground px-6 py-3 text-sm font-semibold tracking-wide uppercase font-sans hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              CÀ PHÊ RANG <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Hero Image */}
      <ImagePlaceholder className="w-full h-64 md:h-[500px]" />

      {/* Stats */}
      <section className="content-container py-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {[
          { value: "1.080m", label: "Độ cao nông trại" },
          { value: "20+", label: "Nông hộ liên kết" },
          { value: "100%", label: "Cà phê nguyên bản" },
          { value: "3", label: "Cơ sở trên toàn quốc" },
        ].map((stat, i) => (
          <div key={i}>
            <p className="font-sans text-3xl md:text-4xl font-bold">
              {stat.value}
            </p>
            <p className="text-sm text-muted-foreground font-sans mt-1">
              {stat.label}
            </p>
          </div>
        ))}
      </section>

      {/* Products Overview */}
      <section className="bg-secondary py-16">
        <div className="content-container">
          <div className="text-center mb-12">
            <p className="section-label mb-2">SẢN PHẨM & DỊCH VỤ</p>
            <h2 className="section-title">Giải Pháp Cà Phê Toàn Diện</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Nhân Xanh",
                desc: "Cung cấp nhân xanh Fine Robusta, Specialty Arabica từ vùng nguyên liệu đất đỏ Nam Ban.",
                link: PATH_GUEST.services.greenCoffee,
              },
              {
                title: "Cà Phê Rang",
                desc: "Giải pháp cà phê rang xay toàn diện cho quán và chuỗi cà phê trên toàn quốc.",
                link: PATH_GUEST.services.roastedCoffee,
              },
            ].map((item, i) => (
              <div key={i} className="bg-background p-0">
                <ImagePlaceholder className="w-full h-48" />
                <div className="p-6">
                  <h3 className="font-sans text-xl font-bold mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground font-sans mb-4">
                    {item.desc}
                  </p>
                  <Link
                    to={item.link}
                    className="text-sm font-semibold font-sans uppercase tracking-wide flex items-center gap-1 hover:gap-2 transition-all"
                  >
                    Tìm hiểu thêm <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="flex-1 content-container py-12 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
          {/* Left */}
          <div>
            <p className="section-label mb-4 text-coffee-red">
              PARTNER WITH US
            </p>
            <h1 className="font-sans text-4xl md:text-5xl lg:text-6xl font-black leading-[1.05] mb-6">
              NHẬN BÁO GIÁ
              <br />
              VÀ MẪU THỬ.
            </h1>
            <p className="section-subtitle max-w-md mb-8">
              Đừng để những hỏng hóc nhỏ làm ảnh hưởng đến hương vị ly cà phê và
              uy tín của quán. Hãy để lại thông tin, chuyên viên Bui sẽ liên hệ
              tư vấn và lên lịch "khám bệnh" cho cỗ máy của bạn.
            </p>
            <div className="space-y-1">
              <p className="font-bold text-base font-sans">
                Hotline: 0909.429.323
              </p>
              <p className="font-bold text-base font-sans">
                Email: unicoffeeroasteryvn@gmail.com
              </p>
            </div>
          </div>

          {/* Right - Form */}
          <div>
            <h1 className="font-sans text-lg font-semibold tracking-wide uppercase mb-6">
              ĐĂNG KÝ TƯ VẤN
            </h1>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Họ và tên"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full border-b-2 border-foreground bg-transparent py-3 text-sm font-sans outline-none placeholder:text-muted-foreground focus:border-coffee-red transition-colors"
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full border-b-2 border-foreground bg-transparent py-3 text-sm font-sans outline-none placeholder:text-muted-foreground focus:border-coffee-red transition-colors"
              />
              <input
                type="tel"
                placeholder="Số điện thoại"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full border-b-2 border-foreground bg-transparent py-3 text-sm font-sans outline-none placeholder:text-muted-foreground focus:border-coffee-red transition-colors"
              />
              <textarea
                placeholder="Nội dung yêu cầu"
                rows={4}
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                className="w-full border-b-2 border-foreground bg-transparent py-3 text-sm font-sans outline-none placeholder:text-muted-foreground focus:border-coffee-red transition-colors resize-none"
              />
              <button
                type="submit"
                className="w-full bg-primary text-primary-foreground py-4 text-sm font-semibold tracking-[0.15em] uppercase font-sans hover:opacity-90 transition-opacity"
              >
                GỬI YÊU CẦU
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
