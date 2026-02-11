import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { PATH_AUTH, PATH_END_CUSTOMER } from "@/routes/path";
import { Lock, LogOut, MapPin, Package, User } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

export const EndCustomerAccountSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { getAccountDetail, logout, logoutAllDevices } = useAuth();

  const { data: userData } = getAccountDetail();
  const account = userData?.data?.data;

   const menuItems = [
      {
        id: "info",
        label: "Thông tin tài khoản",
        icon: User,
        path: PATH_AUTH.account,
      },
      {
        id: "orders",
        label: "Đơn hàng của bạn",
        icon: Package,
        path: PATH_END_CUSTOMER.orders.root,
      },
      {
        id: "password",
        label: "Đổi mật khẩu",
        icon: Lock,
        path: "PATH_END_CUSTOMER.changePassword", 
      },
      {
        id: "addresses",
        label: "Sổ địa chỉ",
        icon: MapPin,
        path: PATH_END_CUSTOMER.addresses, 
      },
    ];

  return (
    <div className="bg-background rounded-lg border p-6 sticky top-4">
      <h2 className="text-lg font-bold mb-1">TRANG TÀI KHOẢN</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Xin chào,{" "}
        <span className="font-medium text-foreground">
          {account?.name || "Khách hàng"}
        </span>
        !
      </p>

      <nav className="space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-left text-sm transition-colors ${
                isActive
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </button>
          );
        })}

        <div className="pt-2 mt-2 border-t">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-left text-sm text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Đăng xuất
          </button>

          <button
            onClick={logoutAllDevices}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-left text-sm text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Đăng xuất tất cả thiết bị
          </button>
        </div>
      </nav>
    </div>
  );
};