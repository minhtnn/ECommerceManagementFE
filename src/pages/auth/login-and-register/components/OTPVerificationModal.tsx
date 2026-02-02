import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { setUser } from "@/redux/user/user-slice";
import { ERole } from "@/types/enums/role.enum";
import { jwtDecode } from "jwt-decode";
import { LoaderCircle } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

interface OTPVerificationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  email: string;
  onVerifySuccess: () => void;
}

export function OTPVerificationModal({
  open,
  onOpenChange,
  email,
  onVerifySuccess,
}: OTPVerificationModalProps) {
  const [otp, setOtp] = useState("");
  const { verifyEmailMutation, resendOtpVerifyEmailMutation } = useAuth();
  const dispatch = useDispatch();

  const handleVerifyOTP = async () => {
    if (verifyEmailMutation.isPending) return;
    if (otp.length !== 6) {
      toast.error("Vui lòng nhập đủ 6 số OTP");
      return;
    }

    try {
      const data = { email: email, otpCode: otp };
      const result = await verifyEmailMutation.mutateAsync(data);

      if (result.data.status >= 200 && result.data.status < 300) {
        toast.success("Xác thực thành công!");
        const accessToken = result.data.data.accessToken;
        const role = (jwtDecode(accessToken) as any).role;
        if (!(role in ERole)) {
          toast.error("Vai trò người dùng không hợp lệ.");
          return;
        }
        dispatch(setUser({ ...result.data.data, role: ERole[role] }));
        onVerifySuccess();
        onOpenChange(false);
      } else {
        toast.error(result.data.message || "Mã OTP không hợp lệ");
      }
    } catch (error) {
      toast.error(error?.response?.data?.data || "Có lỗi xảy ra, vui lòng thử lại");
    }
  };

  const handleResendOTP = async () => {
    if (resendOtpVerifyEmailMutation.isPending) return;
    try {
      const data = { email: email };
      const result = await resendOtpVerifyEmailMutation.mutateAsync(data);
      if (result.data.status >= 200 && result.data.status < 300) {
        toast.success(result.data.message || "Đã gửi lại mã OTP thành công!");
      }
    } catch (error) {
      toast.error(error?.response?.data?.data || "Có lỗi xảy ra, vui lòng thử lại");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Xác thực Email</DialogTitle>
          <DialogDescription>
            Mã OTP đã được gửi đến email: <strong>{email}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Nhập mã OTP</label>
            <Input
              type="text"
              maxLength={6}
              placeholder="Nhập 6 số"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              className="text-center text-2xl tracking-widest"
              disabled={verifyEmailMutation.isPending}
            />
          </div>

          <Button
            onClick={handleVerifyOTP}
            className="w-full"
            disabled={verifyEmailMutation.isPending || otp.length !== 6}
          >
            {verifyEmailMutation.isPending ? (
              <>
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                Đang xác thực...
              </>
            ) : (
              "Xác thực"
            )}
          </Button>

          <div className="text-center">
            <button
              type="button"
              onClick={handleResendOTP}
              className="text-sm text-primary hover:underline"
              disabled={verifyEmailMutation.isPending}
            >
              Gửi lại mã OTP
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
