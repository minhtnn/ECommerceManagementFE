import { PATH_GUEST } from "@/routes/path";
import {
  Facebook,
  Twitter,
  Youtube,
  Instagram,
  Phone,
  MapPin,
  Mail,
} from "lucide-react";
import { Link } from "react-router-dom";

const AppEndUserFooter = () => {
  return (
    <footer className="bg-background border-t border-border mt-12">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="font-bold text-foreground mb-4 uppercase">
              Uni Coffee Roastery
            </h3>
            <p className="text-muted-foreground text-sm mb-4">
              Công ty phân phối hợp lệ sản phẩm cà phê thương hiệu Uni Coffee
              Roastery®.
            </p>
            <div className="flex items-center gap-2 mt-4 p-3 bg-muted rounded-lg">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground text-xs font-bold">
                  ✓
                </span>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">
                  ĐÃ THÔNG BÁO
                </div>
                <div className="text-sm font-semibold text-primary">
                  BỘ CÔNG THƯƠNG
                </div>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-foreground mb-4 uppercase">
              Thông tin
            </h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-start gap-2">
                <MapPin size={16} className="mt-1 flex-shrink-0" />
                <span>
                  Trụ sở văn phòng: Tầng 1, Tòa nhà QTSC Building 9, Lô 42,
                  Đường só 3, Công Viên Phần Mềm Quang Trung, P. Tân Chánh Hiệp,
                  Q12, Tp. HCM
                </span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin size={16} className="mt-1 flex-shrink-0" />
                <span>
                  Trụ sở nhà máy: 25 Lý Thường Kiệt, Hóc Môn, Huyện Hóc Môn, Tp.
                  HCM
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={16} className="flex-shrink-0" />
                <span>Điện thoại: 0909 429 323</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={16} className="flex-shrink-0" />
                <span>Email: unicoffeeroasteryvn@gmail.com</span>
              </div>
            </div>
          </div>

          {/* Customer Support */}
          <div>
            <h3 className="font-bold text-foreground mb-4 uppercase">
              Hỗ trợ khách hàng
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/returns"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  • Chính sách đổi trả
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  • Chính sách bảo mật
                </Link>
              </li>
              <li>
                <Link
                  to="/shipping"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  • Chính sách giao hàng
                </Link>
              </li>
              <li>
                <Link
                  to={PATH_GUEST.contact.root}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  • Liên hệ
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h3 className="font-bold text-foreground mb-4 uppercase">
              Chăm sóc khách hàng
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone size={20} className="text-primary" />
                <div>
                  <div className="text-sm text-muted-foreground">
                    Cà phê đóng gói:
                  </div>
                  <div className="font-bold text-foreground">0909 429 323</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={20} className="text-primary" />
                <div>
                  <div className="text-sm text-muted-foreground">
                    Email:
                  </div>
                  <div className="font-bold text-foreground">unicoffeeroasteryvn@gmail.com</div>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="mt-6">
              <div className="font-semibold text-foreground mb-3">
                FOLLOW US
              </div>
              <div className="flex items-center gap-3">
                <a
                  href="https://www.facebook.com/unicoffeeroastery"
                  className="w-10 h-10 bg-muted rounded-full flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <Facebook size={20} />
                </a>
                {/* <a
                  href="#"
                  className="w-10 h-10 bg-muted rounded-full flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <Twitter size={20} />
                </a> */}
                {/* <a
                  href="#"
                  className="w-10 h-10 bg-muted rounded-full flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <Youtube size={20} />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-muted rounded-full flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <Instagram size={20} />
                </a> */}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="bg-muted py-4">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © Bản quyền thuộc về{" "}
          <span className="font-semibold text-foreground">
            Uni Coffee Roastery
          </span>{" "}
        </div>
      </div>
    </footer>
  );
};

export default AppEndUserFooter;
