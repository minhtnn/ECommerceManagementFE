import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronRight, Lock, MapPin, Package, User } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import EndUserLayout from "@/layouts/EndUserLayout";
import { useAuth } from "@/hooks/use-auth";
import { handleApiError } from "@/lib/error";

interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
}

const Account = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("info");
  const { getAccountDetail } = useAuth();

  const {
    data: userData,
    error: userError,
    isError: isUserError,
    isLoading: isUserLoading,
  } = getAccountDetail();

  if (isUserError && userError) {
    handleApiError(userError);
  }
  const account = userData.data.data;
  // const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  // const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  // const [isLoading, setIsLoading] = useState(true);
  // const [user, setUser] = useState<SupabaseUser | null>(null);

  // const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
  //   name: "",
  //   email: "",
  //   phone: "",
  //   address: "",
  // });

  // const [editFormData, setEditFormData] = useState<CustomerInfo>({ ...customerInfo });

  // const [passwordData, setPasswordData] = useState({
  //   currentPassword: "",
  //   newPassword: "",
  //   confirmPassword: "",
  // });

  // Check authentication and fetch user data
  // useEffect(() => {
  //   const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
  //     if (!session?.user) {
  //       navigate("/auth");
  //     } else {
  //       setUser(session.user);
  //     }
  //   });

  // supabase.auth.getSession().then(({ data: { session } }) => {
  //   if (!session?.user) {
  //     navigate("/auth");
  //   } else {
  //     setUser(session.user);
  //     fetchProfile(session.user.id);
  //   }
  // });

  // return () => subscription.unsubscribe();
  // }, [navigate]);

  // const fetchProfile = async (userId: string) => {
  //   try {
  //     const { data, error } = await supabase
  //       .from('profiles')
  //       .select('*')
  //       .eq('user_id', userId)
  //       .maybeSingle();

  //     if (error) throw error;

  //     if (data) {
  //       setCustomerInfo({
  //         name: data.full_name || '',
  //         email: data.email || '',
  //         phone: data.phone || '',
  //         address: '',
  //       });
  //       setEditFormData({
  //         name: data.full_name || '',
  //         email: data.email || '',
  //         phone: data.phone || '',
  //         address: '',
  //       });
  //     }
  //   } catch (error) {
  //     console.error('Error fetching profile:', error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const menuItems = [
    { id: "info", label: "Thông tin tài khoản", icon: User },
    { id: "orders", label: "Đơn hàng của bạn", icon: Package },
    { id: "password", label: "Đổi mật khẩu", icon: Lock },
    { id: "addresses", label: "Sổ địa chỉ", icon: MapPin },
  ];

  // const handleLogout = async () => {
  //   await supabase.auth.signOut();
  //   toast.success("Đăng xuất thành công!");
  //   navigate("/auth");
  // };

  // const handleSaveInfo = async () => {
  //   if (!user) return;

  //   try {
  //     const { error } = await supabase
  //       .from('profiles')
  //       .update({
  //         full_name: editFormData.name,
  //         phone: editFormData.phone,
  //       })
  //       .eq('user_id', user.id);

  //     if (error) throw error;

  //     setCustomerInfo(editFormData);
  //     setIsEditDialogOpen(false);
  //     toast.success("Cập nhật thông tin thành công!");
  //   } catch (error) {
  //     toast.error("Có lỗi xảy ra, vui lòng thử lại");
  //   }
  // };

  // const handleChangePassword = async () => {
  //   if (passwordData.newPassword !== passwordData.confirmPassword) {
  //     toast.error("Mật khẩu xác nhận không khớp!");
  //     return;
  //   }
  //   if (passwordData.newPassword.length < 6) {
  //     toast.error("Mật khẩu mới phải có ít nhất 6 ký tự!");
  //     return;
  //   }

  //   // try {
  //   //   const { error } = await supabase.auth.updateUser({
  //   //     password: passwordData.newPassword
  //   //   });

  //   //   if (error) throw error;

  //   //   setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
  //   //   setIsPasswordDialogOpen(false);
  //   //   toast.success("Đổi mật khẩu thành công!");
  //   // } catch (error: any) {
  //   //   toast.error(error.message || "Có lỗi xảy ra, vui lòng thử lại");
  //   // }
  // };

  // const handleMenuClick = (id: string) => {
  //   if (id === "password") {
  //     setIsPasswordDialogOpen(true);
  //   } else if (id === "orders") {
  //     navigate("/orders");
  //   } else {
  //     setActiveTab(id);
  //   }
  // };

  // if (isLoading) {
  //   return (
  //     <EndUserLayout>
  //       <div className="min-h-[60vh] flex items-center justify-center">
  //         <Loader2 className="h-8 w-8 animate-spin text-primary" />
  //       </div>
  //     </EndUserLayout>
  //   );
  // }

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
            <span className="text-primary font-medium">Trang khách hàng</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Left Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-background rounded-lg border p-6">
              <h2 className="text-lg font-bold mb-1">TRANG TÀI KHOẢN</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Xin chào,{" "}
                <span className="font-medium text-foreground">
                  {account.name || "Khách hàng"}
                </span>{" "}
                !
              </p>

              {/* <nav className="space-y-1">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleMenuClick(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-left text-sm transition-colors ${
                        activeTab === item.id
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </button>
                  );
                })}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-left text-sm text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Đăng xuất
                </button>
              </nav> */}
            </div>
          </div>

          {/* Right Content */}
          <div className="md:col-span-2">
            <div className="bg-background rounded-lg border p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">THÔNG TIN TÀI KHOẢN</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // setEditFormData({ ...customerInfo });
                    // setIsEditDialogOpen(true);
                  }}
                >
                  Chỉnh sửa
                </Button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 py-3 border-b">
                  <span className="font-medium text-foreground">Họ tên:</span>
                  <span className="col-span-2 text-muted-foreground">
                    {account.name || "Chưa cập nhật"}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4 py-3 border-b">
                  <span className="font-medium text-foreground">Email:</span>
                  <span className="col-span-2 text-muted-foreground">
                    {account.email || "Chưa cập nhật"}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4 py-3 border-b">
                  <span className="font-medium text-foreground">
                    Điện thoại:
                  </span>
                  <span className="col-span-2 text-muted-foreground">
                    {account.phoneNumber || "Chưa cập nhật"}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4 py-3">
                  <span className="font-medium text-foreground">Địa chỉ:</span>
                  <span className="col-span-2 text-muted-foreground">
                    {account.address || "Chưa cập nhật"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Info Dialog */}
      {/* <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa thông tin</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Họ và tên</Label>
              <Input
                id="edit-name"
                value={editFormData.name}
                onChange={(e) =>
                  setEditFormData((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={editFormData.email}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">
                Email không thể thay đổi
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-phone">Số điện thoại</Label>
              <Input
                id="edit-phone"
                value={editFormData.phone}
                onChange={(e) =>
                  setEditFormData((prev) => ({
                    ...prev,
                    phone: e.target.value,
                  }))
                }
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Hủy
              </Button>
              <Button onClick={handleSaveInfo}>Lưu thay đổi</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog> */}

      {/* Change Password Dialog */}
      {/* <Dialog
        open={isPasswordDialogOpen}
        onOpenChange={setIsPasswordDialogOpen}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Đổi mật khẩu</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">Mật khẩu mới</Label>
              <Input
                id="new-password"
                type="password"
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData((prev) => ({
                    ...prev,
                    newPassword: e.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Xác nhận mật khẩu mới</Label>
              <Input
                id="confirm-password"
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData((prev) => ({
                    ...prev,
                    confirmPassword: e.target.value,
                  }))
                }
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setIsPasswordDialogOpen(false)}
              >
                Hủy
              </Button>
              <Button onClick={handleChangePassword}>Đổi mật khẩu</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog> */}
    </EndUserLayout>
  );
};

export default Account;
