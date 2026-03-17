import { PageLoader } from "@/components/LoadingScreen";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { handleApiError } from "@/lib/error";
import { cn } from "@/lib/utils";
import {
  handleChangePasswordDashboardDialogOpen,
  handleSetIsEditAccountDialogOpen,
} from "@/redux/modal/modal-slice";
import { RootState } from "@/redux/store";
import { ImageOff, Upload } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ChangePasswordPageDashboardDialog } from "./components/ChangePasswordPageDashboardDialog";

interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
}

const Account = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { getAccountDetail, changePassword } = useAuth();

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  const { isEditAccountDialogOpen } = useSelector(
    (state: RootState) => state.modal,
  );

  const {
    data: userData,
    error: userError,
    isError: isUserError,
    isLoading: isUserLoading,
  } = getAccountDetail();

  if (isUserLoading) {
    return <PageLoader />;
  }

  if (isUserError && userError) {
    handleApiError(userError);
  }
  const account = userData.data.data;
  const reader = new FileReader();

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div>
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Left Sidebar */}
          <div className="bg-background rounded-lg border p-6">
            <div className="flex flex-col items-center justify-center h-full border-2 border-dashed border-muted-foreground/25 rounded-lg p-8">
              {imagePreview ? (
                <div className="relative w-full max-w-[300px]">
                  {/* Hiển thị ảnh hoặc placeholder khi lỗi */}
                  {imageError ? (
                    <div className="w-full aspect-square bg-muted rounded-lg flex flex-col items-center justify-center gap-4">
                      <div className="text-center">
                        <Upload className="h-10 w-10 text-muted-foreground/50 mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">
                          Không thể tải ảnh
                        </p>
                        <p className="text-xs text-muted-foreground/70">
                          URL có thể đã hết hạn
                        </p>
                      </div>
                    </div>
                  ) : (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-auto rounded-lg object-cover"
                      onError={handleImageError}
                    />
                  )}
                </div>
              ) : (
                <ImageOff className={cn("size-10")} />
              )}
            </div>
          </div>

          {/* Right Content */}
          <div className="md:col-span-2">
            <div className="bg-background rounded-lg border p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">THÔNG TIN TÀI KHOẢN</h2>
                <div className="space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      dispatch(handleSetIsEditAccountDialogOpen(true));
                    }}
                  >
                    Chỉnh sửa
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      dispatch(handleChangePasswordDashboardDialogOpen(true));
                    }}
                  >
                    Đổi mật khẩu
                  </Button>
                </div>
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
      <Dialog
        open={isEditAccountDialogOpen}
        onOpenChange={(open) => {
          dispatch(handleSetIsEditAccountDialogOpen(open));
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa thông tin</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Họ và tên</Label>
              {/* <Input
                id="edit-name"
                value={editFormData.name}
                onChange={(e) =>
                  setEditFormData((prev) => ({ ...prev, name: e.target.value }))
                }
              /> */}
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              {/* <Input
                id="edit-email"
                type="email"
                value={editFormData.email}
                disabled
                className="bg-muted"
              /> */}
              <p className="text-xs text-muted-foreground">
                Email không thể thay đổi
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-phone">Số điện thoại</Label>
              {/* <Input
                id="edit-phone"
                value={editFormData.phone}
                onChange={(e) =>
                  setEditFormData((prev) => ({
                    ...prev,
                    phone: e.target.value,
                  }))
                }
              /> */}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() =>
                  dispatch(handleSetIsEditAccountDialogOpen(false))
                }
              >
                Hủy
              </Button>
              <Button onClick={() => {}}>Lưu thay đổi</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Change Password Dialog */}
      <ChangePasswordPageDashboardDialog />
    </div>
  );
};

export default Account;
