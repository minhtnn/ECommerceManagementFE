import { PageLoader } from "@/components/LoadingScreen";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { handleApiError } from "@/lib/error";
import { handleChangePasswordDashboardDialogOpen } from "@/redux/modal/modal-slice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { ChangePasswordPageDashboardDialog } from "./components/ChangePasswordPageDashboardDialog";
import EditAccountDialog from "./components/EditAccountDialog";

const DashboardAccountPage = () => {
  const dispatch = useDispatch();
  const { getAccountDetail } = useAuth();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

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

  const account = userData?.data?.data;

  const infoFields = [
    { label: "Thương hiệu", value: account?.name },
    { label: "Tên đầy đủ", value: account?.fullName },
    { label: "Email", value: account?.email },
    { label: "Điện thoại", value: account?.phoneNumber },
    { label: "Địa chỉ", value: account?.address },
  ];

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="bg-background rounded-xl border shadow-sm overflow-hidden">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-5 border-b">
          <h2 className="text-lg font-bold tracking-wide uppercase text-foreground">
            Thông tin tài khoản
          </h2>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 sm:flex-none"
              onClick={() => setIsEditDialogOpen(true)}
            >
              Chỉnh sửa
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 sm:flex-none"
              onClick={() =>
                dispatch(handleChangePasswordDashboardDialogOpen(true))
              }
            >
              Đổi mật khẩu
            </Button>
          </div>
        </div>

        {/* Avatar Section */}
        <div className="flex flex-col items-center justify-center gap-3 py-8 px-6 bg-muted/30 border-b">
          <Avatar className="w-24 h-24 sm:w-28 sm:h-28 ring-2 ring-primary/20">
            <AvatarImage
              src={account?.imageUrl ?? undefined}
              className="object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
            <AvatarFallback className="text-3xl font-semibold bg-primary/10 text-primary">
              {account?.fullName?.charAt(0)?.toUpperCase() ??
                account?.name?.charAt(0)?.toUpperCase() ??
                "B"}
            </AvatarFallback>
          </Avatar>
          <div className="text-center">
            <p className="font-semibold text-base text-foreground">
              {account?.name || account?.fullName || "Thương hiệu"}
            </p>
            <p className="text-sm text-muted-foreground mt-0.5">
              {account?.email || ""}
            </p>
          </div>
        </div>

        {/* Info Fields */}
        <div className="px-6 py-4 divide-y divide-border">
          {infoFields.map(({ label, value }) => (
            <div
              key={label}
              className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-4 py-3.5"
            >
              <span className="text-sm font-medium text-foreground">
                {label}:
              </span>
              <span className="sm:col-span-2 text-sm text-muted-foreground break-all">
                {value || "Chưa cập nhật"}
              </span>
            </div>
          ))}
        </div>
      </div>

      <EditAccountDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        account={account}
      />

      <ChangePasswordPageDashboardDialog />
    </div>
  );
};

export default DashboardAccountPage;