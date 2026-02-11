import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { PATH_GUEST } from "@/routes/path";
import { CheckCircle, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

interface PaymentSuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderCode?: string;
  amount?: number;
  autoRedirectSeconds?: number;
}

const PaymentSuccessDialog = ({
  open,
  onOpenChange,
  orderCode,
  amount,
  autoRedirectSeconds = 3,
}: PaymentSuccessDialogProps) => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(autoRedirectSeconds);

  useEffect(() => {
    if (!open) {
      setCountdown(autoRedirectSeconds);
      return;
    }

    // Start countdown
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          navigate(PATH_GUEST.home.root);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [open, navigate, autoRedirectSeconds]);

  const handleGoHome = () => {
    onOpenChange(false);
    navigate(PATH_GUEST.home.root);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px] p-0 gap-0">
        {/* Success Animation */}
        <div className="bg-gradient-to-b from-green-50 to-white p-8 pb-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4 animate-bounce-once">
              <CheckCircle size={48} className="text-green-600" />
            </div>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-center text-green-700">
                Thanh toán thành công!
              </DialogTitle>
              <DialogDescription className="text-center text-base mt-3 text-gray-600">
                Đơn hàng của bạn đã được thanh toán thành công và đang được xử lý.
              </DialogDescription>
            </DialogHeader>
          </div>
        </div>

        {/* Order Info */}
        <div className="px-8 py-6 space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Mã đơn hàng</span>
              <span className="font-bold text-green-700">{orderCode || "N/A"}</span>
            </div>
            {amount && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Số tiền</span>
                <span className="font-bold text-lg text-green-700">
                  {formatPrice(amount)}
                </span>
              </div>
            )}
          </div>

          {/* Countdown Info */}
          <div className="text-center py-4">
            <p className="text-sm text-gray-600">
              Tự động chuyển về trang chủ sau{" "}
              <span className="font-bold text-primary">{countdown}</span> giây
            </p>
          </div>

          {/* Action Button */}
          <Button
            className="w-full bg-green-600 hover:bg-green-700 gap-2"
            onClick={handleGoHome}
            size="lg"
          >
            <Home size={20} />
            Về trang chủ ngay
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentSuccessDialog;