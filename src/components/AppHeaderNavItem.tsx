import { useBreadcrumb } from "@/contexts/BreadcrumbContext";
import { cn } from "@/lib/utils";
import { handleChangeHeaderMenuOpenWhenChangingMobile } from "@/redux/modal/modal-slice";
import { RootState } from "@/redux/store";
import { PATH_AUTH, PATH_END_CUSTOMER, PATH_GUEST } from "@/routes/path";
import { ERole } from "@/types/enums/role.enum";
import {
  ChevronRight,
  Mail,
  Menu,
  Phone,
  Search,
  ShoppingCart,
  User,
  X,
  Sun,
  Moon,
} from "lucide-react";
import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "./ui/input";
import { useCart } from "@/hooks/use-cart";
import { useTheme } from "@/providers/theme-provider";

const EndUserHeaderRoutes = {
  home: {
    title: "Trang chủ",
    url: PATH_GUEST.home.root,
  },
  product: {
    title: "Sản phẩm",
    url: PATH_GUEST.products.root,
  },
  introduce: {
    title: "Giới thiệu",
    url: PATH_GUEST.introduce.root,
  },
  news: {
    title: "Tin tức",
    url: PATH_GUEST.news.root,
  },
  contact: {
    title: "Liên hệ",
    url: PATH_GUEST.contact.root,
  },
};

export function AppEndUserHeader({
  ...props
}: React.HTMLAttributes<typeof HTMLElement>) {
  const { isHeaderMenuOpenWhenChangingMobile } = useSelector(
    (state: RootState) => state.modal,
  );
  const dispatch = useDispatch();
  const { isAuthenticated, user, role } = useSelector(
    (state: RootState) => state.user,
  );
  const { theme, setTheme } = useTheme();
  const accountLink = isAuthenticated ? PATH_AUTH.account : PATH_AUTH.root;
  const isEndCustomer = isAuthenticated && role === ERole.EndCustomer;
  const navigate = useNavigate();
  const { breadcrumbs, showBreadcrumb } = useBreadcrumb();
  const activeRoute = useMemo(() => {
    const path = location.pathname;
    const matchedKey = Object.entries(EndUserHeaderRoutes).find(
      ([key, route]) => {
        if (path === route.url) return true;
        if (path.startsWith(route.url)) return true;
        return false;
      },
    );

    return matchedKey ? matchedKey[0] : "home";
  }, [location.pathname]);
  const { getEndCustomerCart } = useCart();
  const { data: cartData } = getEndCustomerCart({
    isAllowFetch: isEndCustomer,
  });
  const cart = cartData?.data?.data;
  const totalItems =
    cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <header className="bg-background sticky top-0 z-50 shadow-sm">
      <div className="bg-primary text-primary-foreground py-2 text-sm">
        <div className="container mx-auto flex items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline">Cần hỗ trợ?</span>
            <a
              href="tel:1900123456"
              className="flex items-center gap-1 hover:opacity-80 transition-opacity"
            >
              <Phone size={14} />
              <span>1900.123.456</span>
            </a>
            <a
              href="mailto:support@unicoffee.vn"
              className="hidden md:flex items-center gap-1 hover:opacity-80 transition-opacity"
            >
              <Mail size={14} />
              <span>support@unicoffee.vn</span>
            </a>
          </div>
          <div className="font-medium animate-pulse">
            UỐNG UNI COFFEE TẠI NHÀ !
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-3 gap-4">
          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 hover:bg-muted rounded-lg transition-colors"
            onClick={() =>
              dispatch(
                handleChangeHeaderMenuOpenWhenChangingMobile(
                  !isHeaderMenuOpenWhenChangingMobile,
                ),
              )
            }
          >
            {isHeaderMenuOpenWhenChangingMobile ? (
              <X size={24} />
            ) : (
              <Menu size={24} />
            )}
            <span className="text-xs block">MENU</span>
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-12 h-12 rounded-full flex items-center justify-center">
              <img
                src="/UniCoffeeRoastery.png"
                alt="UniCoffeeRoastery"
                className="text-primary-foreground font-bold text-lg"
              />
            </div>
            <div className="hidden sm:block">
              <div className="font-bold text-primary text-lg leading-tight">
                UNI COFFEE
              </div>
              <div className="text-xs text-muted-foreground">ROASTERY</div>
            </div>
          </Link>

          {/* Search Bar */}
          {/* <div className="hidden md:flex flex-1 max-w-xl mx-4">
            <div className="relative w-full">
              <Input
                type="text"
                placeholder="Tìm sản phẩm..."
                className="w-full pl-4 pr-12 py-2 border-2 border-border rounded-full focus:border-primary transition-colors"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-muted rounded-full transition-colors">
                <Search size={20} className="text-muted-foreground" />
              </button>
            </div>
          </div> */}

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              to={accountLink}
              className="flex flex-col items-center p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <User size={22} />
              <span className="text-xs hidden sm:block">
                {isAuthenticated ? user.username : "Tài khoản"}
              </span>
            </Link>

            {/* Chỉ hiển thị giỏ hàng khi user là EndCustomer */}
            {isEndCustomer && (
              <Link
                to={PATH_END_CUSTOMER.cart}
                className="flex flex-col items-center p-2 hover:bg-muted rounded-lg transition-colors relative"
              >
                <ShoppingCart size={22} />
                <span className="text-xs hidden sm:block">Giỏ hàng</span>
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {totalItems}
                  </span>
                )}
              </Link>
            )}

            {/* Theme Toggle Switch */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="relative inline-flex h-9 w-16 shrink-0 items-center rounded-full transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 hover:opacity-90"
              style={{
                backgroundColor: theme === "dark" ? "#475569" : "#f59e0b",
              }}
              aria-label="Chuyển đổi chế độ giao diện"
              title={theme === "dark" ? "Chuyển sang chế độ sáng" : "Chuyển sang chế độ tối"}
            >
              {/* Background Icons */}
              <Sun 
                size={14} 
                className={`absolute left-2 transition-opacity duration-300 ${
                  theme === "dark" ? "opacity-30 text-slate-300" : "opacity-0"
                }`}
              />
              <Moon 
                size={14} 
                className={`absolute right-2 transition-opacity duration-300 ${
                  theme === "dark" ? "opacity-0" : "opacity-30 text-amber-100"
                }`}
              />
              
              {/* Moving Circle */}
              <span
                className={`inline-flex h-7 w-7 items-center justify-center transform rounded-full bg-white shadow-md transition-transform duration-300 ease-in-out ${
                  theme === "dark" ? "translate-x-[30px]" : "translate-x-[2px]"
                }`}
              >
                {theme === "dark" ? (
                  <Moon size={16} className="text-slate-700" />
                ) : (
                  <Sun size={16} className="text-amber-500" />
                )}
              </span>
            </button>
          </div>
        </div>
      </div>
      <nav className="hidden lg:flex items-center justify-center py-2 border-t border-border">
        <div className="flex items-center justify-between gap-20">
          {Object.entries(EndUserHeaderRoutes).map(([key, route]) => (
            <button
              key={key}
              onClick={() => navigate(route.url)}
              className={cn(
                "nav-link",
                activeRoute === key ? "nav-link-active" : "",
                props.className,
              )}
            >
              {route.title}
            </button>
          ))}
        </div>
      </nav>
      {isHeaderMenuOpenWhenChangingMobile && (
        <div className="lg:hidden border-t border-border py-4 animate-fade-in">
          {/* Mobile Search */}
          <div className="mb-4">
            <div className="relative">
              <Input
                type="text"
                placeholder="Tìm sản phẩm..."
                className="w-full pl-4 pr-12 py-2 border-2 border-border rounded-full"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2">
                <Search size={20} className="text-muted-foreground" />
              </button>
            </div>
          </div>
          {/* Mobile Nav */}
          <div className="flex flex-col gap-2">
            {Object.entries(EndUserHeaderRoutes).map(([key, route]) => (
              <button
                key={key}
                onClick={() => navigate(route.url)}
                className={cn(
                  "nav-link",
                  activeRoute === key ? "nav-link-active" : "",
                  "px-4 py-3 rounded-lg font-medium transition-colors",
                  activeRoute === key
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted",
                  props.className,
                )}
              >
                {route.title}
              </button>
            ))}
          </div>
        </div>
      )}

      {showBreadcrumb && breadcrumbs.length > 0 && (
        <div className="bg-background border-b border-border">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center gap-2 text-sm flex-wrap">
              {breadcrumbs.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  {index > 0 && (
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  )}
                  {item.url ? (
                    <Link
                      to={item.url}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      {item.title}
                    </Link>
                  ) : (
                    <span className="text-primary font-medium line-clamp-1">
                      {item.title}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}