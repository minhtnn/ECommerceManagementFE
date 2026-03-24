import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import EndUserLayout from "@/layouts/EndUserLayout";
import { handleApiError } from "@/lib/error";
import { PATH_AUTH, PATH_END_CUSTOMER } from "@/routes/path";
import {
  ChevronRight,
  Lock,
  LogOut,
  MapPin,
  Package,
  User,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import EditAccountDialog from "./components/EditAccountDialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { OTPVerificationModal } from "./components/OTPVerificationModal";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const EndUserAccountPage = () => {
  const navigate = useNavigate();
  const { getAccountDetail, logout, logoutAllDevices } = useAuth();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isShowOTPModal, setIsShowOTPModal] = useState(false);
  const { registerEmail } = useSelector((state: RootState) => state.modal);

  const {
    data: userData,
    error: userError,
    isError: isUserError,
    isLoading: isUserLoading,
  } = getAccountDetail();

  if (isUserError && userError) {
    handleApiError(userError);
  }

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
      path: PATH_END_CUSTOMER.changePassword,
    },
    {
      id: "addresses",
      label: "Sổ địa chỉ",
      icon: MapPin,
      path: PATH_END_CUSTOMER.addresses,
    },
  ];

  const handleMenuClick = (path: string) => {
    navigate(path);
  };

  if (isUserLoading) {
    return (
      <EndUserLayout>
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
              <span className="text-primary font-medium">Trang khách hàng</span>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <Skeleton className="h-96 w-full rounded-lg" />
            </div>
            <div className="md:col-span-2">
              <Skeleton className="h-96 w-full rounded-lg" />
            </div>
          </div>
        </div>
      </EndUserLayout>
    );
  }

  const account = userData?.data?.data;
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
            <span className="text-primary font-medium">Tài khoản</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Left Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-background rounded-lg border p-6 sticky top-4">
              <h2 className="text-lg font-bold mb-1">TRANG TÀI KHOẢN</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Xin chào,{" "}
                <span className="font-medium text-foreground">
                  {account?.fullName || "Khách hàng"}
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
                      onClick={() => handleMenuClick(item.path)}
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
          </div>

          {/* Right Content - EndUserAccountPage Info */}
          <div className="md:col-span-2">
            <div className="bg-background rounded-lg border p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">THÔNG TIN TÀI KHOẢN</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditDialogOpen(true)}
                >
                  Chỉnh sửa
                </Button>
              </div>
              <div className="flex flex-col items-center gap-2 mb-6">
                <Avatar className="w-24 h-24 ring-2 ring-primary/20">
                  <AvatarImage src={account?.imageUrl ?? undefined} />
                  <AvatarFallback className="text-2xl font-semibold bg-primary/10 text-primary">
                    {account?.fullName?.charAt(0)?.toUpperCase() ?? "K"}
                  </AvatarFallback>
                </Avatar>
                <p className="text-sm font-medium text-foreground">
                  {account?.fullName || "Khách hàng"}
                </p>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 py-3 border-b">
                  <span className="font-medium text-foreground">Họ tên:</span>
                  <span className="col-span-2 text-muted-foreground">
                    {account?.fullName || "Chưa cập nhật"}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4 py-3 border-b">
                  <span className="font-medium text-foreground">Email:</span>
                  <span className="col-span-2 text-muted-foreground">
                    {account?.email || "Chưa cập nhật"}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4 py-3">
                  <span className="font-medium text-foreground">
                    Điện thoại:
                  </span>
                  <span className="col-span-2 text-muted-foreground">
                    {account?.phoneNumber || "Chưa cập nhật"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <EditAccountDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onUpdateEmailSuccess={(open) => {
          setIsShowOTPModal(open);
        }}
        account={account}
      />
      <OTPVerificationModal
        open={isShowOTPModal}
        onOpenChange={(open) => {}}
        email={registerEmail || ""}
        onVerifySuccess={(open) => setIsShowOTPModal(open)}
      />
    </EndUserLayout>
  );
};

export default EndUserAccountPage;
