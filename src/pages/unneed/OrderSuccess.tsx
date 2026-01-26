import EndUserLayout from "@/layouts/EndUserLayout";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/data/mockData";
import { Link, useLocation, Navigate } from "react-router-dom";
import { CheckCircle, Printer, Tag } from "lucide-react";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  quantity: number;
  badge?: string;
}

interface OrderData {
  orderNumber: string;
  items: OrderItem[];
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

const OrderSuccess = () => {
  const location = useLocation();
  const orderData = location.state?.orderData as OrderData | undefined;

  // Redirect to home if no order data
  if (!orderData) {
    return <Navigate to="/" replace />;
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <EndUserLayout>
      <div className="bg-muted/30 min-h-screen py-6">
        <div className="container mx-auto px-4">
          {/* Logo centered */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-block">
              <h1 className="text-2xl font-bold text-primary">UNI COFFEE ROASTERY</h1>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Order Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Success Message */}
              <div className="bg-card rounded-lg p-6 shadow-sm animate-fade-in">
                <div className="flex items-start gap-4">
                  <div className="shrink-0">
                    <CheckCircle size={48} className="text-green-500" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-foreground mb-2">
                      Cảm ơn bạn đã đặt hàng!
                    </h2>
                    <p className="text-muted-foreground">
                      Một email xác nhận đã được gửi tới {orderData.customer.email || "email của bạn"}.
                    </p>
                    <p className="text-muted-foreground">
                      Xin vui lòng kiểm tra email của bạn
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Information */}
              <div className="bg-card rounded-lg p-6 shadow-sm animate-fade-in" style={{ animationDelay: "0.1s" }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Customer Info */}
                  <div>
                    <h3 className="font-semibold text-foreground mb-4">
                      Thông tin mua hàng
                    </h3>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p className="text-foreground font-medium">{orderData.customer.name}</p>
                      {orderData.customer.email && <p>{orderData.customer.email}</p>}
                      <p>{orderData.customer.phone}</p>
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div>
                    <h3 className="font-semibold text-foreground mb-4">
                      Địa chỉ nhận hàng
                    </h3>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p className="text-foreground font-medium">{orderData.shippingAddress.name}</p>
                      <p>{orderData.shippingAddress.address}</p>
                      <p>{orderData.shippingAddress.ward}</p>
                      <p>{orderData.shippingAddress.phone}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 pt-6 border-t border-border">
                  {/* Payment Method */}
                  <div>
                    <h3 className="font-semibold text-foreground mb-4">
                      Phương thức thanh toán
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {orderData.paymentMethod}
                    </p>
                  </div>

                  {/* Shipping Method */}
                  <div>
                    <h3 className="font-semibold text-foreground mb-4">
                      Phương thức vận chuyển
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {orderData.shippingMethod}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: "0.2s" }}>
                <Link to="/">
                  <Button className="bg-primary hover:bg-primary/90 font-bold px-8 py-6">
                    Tiếp tục mua hàng
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  className="text-foreground hover:bg-muted flex items-center gap-2"
                  onClick={handlePrint}
                >
                  <Printer size={18} />
                  In
                </Button>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-lg p-6 shadow-sm sticky top-24 animate-fade-in" style={{ animationDelay: "0.3s" }}>
                <h2 className="text-lg font-semibold text-foreground mb-4">
                  Đơn hàng #{orderData.orderNumber} ({orderData.items.reduce((sum, item) => sum + item.quantity, 0)})
                </h2>

                {/* Order Items */}
                <div className="space-y-4 mb-6 max-h-80 overflow-y-auto">
                  {orderData.items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="relative">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-contain bg-cream rounded-lg"
                        />
                        <span className="absolute -top-2 -right-2 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-foreground line-clamp-2">
                          {item.name}
                        </h4>
                        {item.badge && (
                          <div className="flex items-center gap-1 mt-1 text-xs text-primary">
                            <Tag size={10} />
                            {item.badge}
                          </div>
                        )}
                      </div>
                      <div className="text-sm font-medium text-foreground whitespace-nowrap">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Totals */}
                <div className="space-y-3 text-sm border-t border-border pt-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tạm tính</span>
                    <span>{formatPrice(orderData.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Phí vận chuyển</span>
                    <span>{orderData.shipping === 0 ? "Miễn phí" : formatPrice(orderData.shipping)}</span>
                  </div>
                  {orderData.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Giảm giá</span>
                      <span>-{formatPrice(orderData.discount)}</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center border-t border-border pt-4 mt-4">
                  <span className="font-medium">Tổng cộng</span>
                  <span className="text-xl font-bold text-primary">{formatPrice(orderData.total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </EndUserLayout>
  );
};

export default OrderSuccess;
