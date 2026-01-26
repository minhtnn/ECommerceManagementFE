import { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { formatPrice } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { QrCode } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

interface OrderData {
  orderNumber: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }>;
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  shippingAddress: {
    name: string;
    address: string;
    ward: string;
    phone: string;
  };
  paymentMethod: string;
  shippingMethod: string;
  notes: string;
}

const MomoPayment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const orderData = location.state?.orderData as OrderData | undefined;
  
  const [timeLeft, setTimeLeft] = useState(10 * 60); // 10 minutes in seconds

  useEffect(() => {
    if (!orderData) {
      navigate("/");
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate("/");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [orderData, navigate]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const handlePaymentComplete = () => {
    clearCart();
    toast.success("Thanh toán thành công!");
    navigate("/order-success", { state: { orderData } });
  };

  if (!orderData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8e8f0] to-white">
      {/* Header */}
      <header className="bg-white border-b border-border py-4">
        <div className="container mx-auto px-4 flex items-center gap-4">
          <div className="w-12 h-12 bg-[#a50064] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">MoMo</span>
          </div>
          <span className="text-lg font-medium text-foreground">Cổng thanh toán MoMo</span>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Order Info */}
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
            <h2 className="text-xl font-semibold text-foreground">Thông tin đơn hàng</h2>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Nhà cung cấp</p>
                <p className="font-medium text-foreground">UNI COFFEE ROASTERY</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Mã đơn hàng</p>
                <p className="font-medium text-foreground">{orderData.orderNumber}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Mô tả</p>
                <p className="font-medium text-foreground">Thanh toán đơn hàng #{orderData.orderNumber}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Số tiền</p>
                <p className="text-3xl font-bold text-foreground">{formatPrice(orderData.total)}</p>
              </div>
            </div>

            {/* Countdown */}
            <div className="border-t border-border pt-6">
              <p className="text-center text-[#a50064] font-medium mb-4">Đơn hàng sẽ hết hạn sau:</p>
              <div className="flex justify-center gap-4">
                <div className="bg-muted rounded-lg px-4 py-2 text-center min-w-[60px]">
                  <p className="text-2xl font-bold text-foreground">{String(minutes).padStart(2, "0")}</p>
                  <p className="text-xs text-muted-foreground">Phút</p>
                </div>
                <div className="bg-muted rounded-lg px-4 py-2 text-center min-w-[60px]">
                  <p className="text-2xl font-bold text-foreground">{String(seconds).padStart(2, "0")}</p>
                  <p className="text-xs text-muted-foreground">Giây</p>
                </div>
              </div>
              <Link 
                to="/" 
                className="block text-center text-[#a50064] hover:underline mt-4 text-sm"
              >
                Quay về
              </Link>
            </div>
          </div>

          {/* QR Code Section */}
          <div className="bg-gradient-to-br from-[#d82d8b] to-[#a50064] rounded-xl shadow-sm p-6 text-white">
            <h2 className="text-xl font-semibold text-center mb-4">Quét mã QR để thanh toán</h2>
            
            {/* Partner logos */}
            <div className="bg-white rounded-lg p-3 flex items-center justify-center gap-4 mb-6">
              <span className="text-[#a50064] font-bold text-lg">MoMo</span>
              <span className="text-[#1a73e8] font-bold text-lg">VietQR</span>
              <span className="text-[#e31837] font-bold text-lg">napas</span>
            </div>

            {/* QR Code placeholder */}
            <div className="bg-white rounded-xl p-4 mx-auto max-w-[280px] mb-6">
              <div className="aspect-square bg-muted rounded-lg flex items-center justify-center relative">
                <div className="absolute inset-4 border-2 border-dashed border-muted-foreground/30 rounded-lg" />
                <div className="flex flex-col items-center gap-2">
                  <QrCode size={80} className="text-[#a50064]" />
                  <span className="text-xs text-muted-foreground text-center px-4">
                    Mã QR thanh toán
                  </span>
                </div>
                {/* MoMo logo overlay */}
                <div className="absolute bottom-4 right-4 w-10 h-10 bg-[#a50064] rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-[8px]">MoMo</span>
                </div>
              </div>
            </div>

            <p className="text-center text-sm mb-2 flex items-center justify-center gap-2">
              <QrCode size={16} />
              Sử dụng <strong>App MoMo</strong> hoặc ứng dụng ngân hàng để quét mã
            </p>

            <p className="text-center text-sm">
              Gặp khó khăn khi thanh toán?{" "}
              <a href="#" className="underline font-medium">Xem Hướng dẫn</a>
            </p>

            {/* Demo: Complete payment button */}
            <div className="mt-6 pt-6 border-t border-white/20">
              <Button 
                onClick={handlePaymentComplete}
                className="w-full bg-white text-[#a50064] hover:bg-white/90"
              >
                Xác nhận đã thanh toán (Demo)
              </Button>
            </div>
          </div>
        </div>

        {/* Bank partners */}
        <div className="mt-8 max-w-5xl mx-auto bg-white rounded-xl shadow-sm p-6">
          <p className="text-center text-sm text-muted-foreground mb-4">Ngân hàng liên kết</p>
          <div className="flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">
            {["Vietcombank", "BIDV", "Techcombank", "VPBank", "MB Bank", "ACB", "TPBank", "VIB", "OCB", "SHB"].map((bank) => (
              <span key={bank} className="px-3 py-1 bg-muted rounded-full">{bank}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-8 py-4 border-t border-border bg-white">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-2 text-sm text-muted-foreground">
          <p>© 2024 - Cổng thanh toán MoMo</p>
          <p>Hỗ trợ khách hàng: 1900 54 54 41</p>
        </div>
      </footer>
    </div>
  );
};

export default MomoPayment;
