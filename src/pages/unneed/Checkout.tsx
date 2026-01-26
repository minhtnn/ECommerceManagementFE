import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { formatPrice } from "@/data/mockData";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, User, CreditCard, Truck, Banknote, Tag, X } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/contexts/CartContext";
import EndUserLayout from "@/layouts/EndUserLayout";

// Mock vouchers (same as admin)
interface Voucher {
  id: string;
  code: string;
  name: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  usageLimit: number;
  usedCount: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

const availableVouchers: Voucher[] = [
  {
    id: "1",
    code: "GIAM5K",
    name: "Giảm 5K",
    discountType: "fixed",
    discountValue: 5000,
    minOrderValue: 0,
    usageLimit: 100,
    usedCount: 25,
    startDate: "2024-01-01",
    endDate: "2025-12-31",
    isActive: true,
  },
  {
    id: "2",
    code: "KM5PHAN",
    name: "Khuyến mãi 5%",
    discountType: "percentage",
    discountValue: 5,
    minOrderValue: 50000,
    maxDiscount: 20000,
    usageLimit: 200,
    usedCount: 80,
    startDate: "2024-01-01",
    endDate: "2025-12-31",
    isActive: true,
  },
  {
    id: "3",
    code: "GIAM10PHAN",
    name: "Giảm 10%",
    discountType: "percentage",
    discountValue: 10,
    minOrderValue: 100000,
    maxDiscount: 50000,
    usageLimit: 50,
    usedCount: 10,
    startDate: "2024-01-01",
    endDate: "2025-12-31",
    isActive: true,
  },
];

const Checkout = () => {
  const navigate = useNavigate();
  const { items: cartItems, subtotal, clearCart } = useCart();
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    phone: "",
    address: "",
    province: "",
    district: "",
    ward: "",
    notes: "",
    paymentMethod: "cod",
  });

  const [discountCode, setDiscountCode] = useState("");
  const [appliedVoucher, setAppliedVoucher] = useState<Voucher | null>(null);

  const shipping = subtotal >= 399000 ? 0 : (subtotal > 0 ? 30000 : 0);

  // Calculate discount based on applied voucher
  const calculateDiscount = (): number => {
    if (!appliedVoucher) return 0;

    if (appliedVoucher.discountType === "fixed") {
      return appliedVoucher.discountValue;
    } else {
      const percentageDiscount = (subtotal * appliedVoucher.discountValue) / 100;
      if (appliedVoucher.maxDiscount) {
        return Math.min(percentageDiscount, appliedVoucher.maxDiscount);
      }
      return percentageDiscount;
    }
  };

  const discount = calculateDiscount();
  const total = subtotal + shipping - discount;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleApplyDiscount = () => {
    if (!discountCode.trim()) {
      toast.error("Vui lòng nhập mã giảm giá");
      return;
    }

    const voucher = availableVouchers.find(
      (v) => v.code.toUpperCase() === discountCode.trim().toUpperCase()
    );

    if (!voucher) {
      toast.error("Mã giảm giá không tồn tại");
      return;
    }

    if (!voucher.isActive) {
      toast.error("Mã giảm giá đã ngừng hoạt động");
      return;
    }

    const now = new Date();
    const startDate = new Date(voucher.startDate);
    const endDate = new Date(voucher.endDate);

    if (now < startDate || now > endDate) {
      toast.error("Mã giảm giá đã hết hạn");
      return;
    }

    if (voucher.usedCount >= voucher.usageLimit) {
      toast.error("Mã giảm giá đã hết lượt sử dụng");
      return;
    }

    if (subtotal < voucher.minOrderValue) {
      toast.error(`Đơn hàng tối thiểu ${formatPrice(voucher.minOrderValue)} để sử dụng mã này`);
      return;
    }

    setAppliedVoucher(voucher);
    toast.success(`Áp dụng mã "${voucher.name}" thành công!`);
  };

  const handleRemoveVoucher = () => {
    setAppliedVoucher(null);
    setDiscountCode("");
    toast.info("Đã hủy mã giảm giá");
  };

  const handlePlaceOrder = () => {
    if (!formData.fullName || !formData.phone || !formData.address || !formData.province) {
      toast.error("Vui lòng điền đầy đủ thông tin giao hàng");
      return;
    }
    if (cartItems.length === 0) {
      toast.error("Giỏ hàng trống");
      return;
    }
    
    // Get full labels for province, district, ward
    const provinceName = provinces.find(p => p.value === formData.province)?.label || formData.province;
    const districtName = districts.find(d => d.value === formData.district)?.label || formData.district;
    const wardName = wards.find(w => w.value === formData.ward)?.label || formData.ward;
    
    const orderData = {
      orderNumber: Math.floor(10000 + Math.random() * 90000).toString(),
      items: cartItems,
      subtotal,
      shipping,
      discount,
      total,
      customer: {
        name: formData.fullName,
        email: formData.email || "",
        phone: formData.phone,
      },
      shippingAddress: {
        name: formData.fullName,
        address: formData.address,
        ward: `${wardName}, ${districtName}, ${provinceName}`,
        phone: formData.phone,
      },
      paymentMethod: formData.paymentMethod === "cod" ? "Thanh toán khi giao hàng (COD)" : "Thanh toán qua Ví điện tử MoMo",
      shippingMethod: "Giao hàng tiêu chuẩn",
      notes: formData.notes,
    };
    
    // If MoMo payment, redirect to MoMo payment page
    if (formData.paymentMethod === "momo") {
      navigate("/momo-payment", { state: { orderData } });
      return;
    }
    
    // For COD, go directly to order success
    clearCart();
    toast.success("Đặt hàng thành công!");
    navigate("/order-success", { state: { orderData } });
  };

  // Mock data for provinces
  const provinces = [
    { value: "hcm", label: "TP. Hồ Chí Minh" },
    { value: "hn", label: "Hà Nội" },
    { value: "dn", label: "Đà Nẵng" },
    { value: "hp", label: "Hải Phòng" },
    { value: "ct", label: "Cần Thơ" },
  ];

  const districts = [
    { value: "q1", label: "Quận 1" },
    { value: "q2", label: "Quận 2" },
    { value: "q3", label: "Quận 3" },
    { value: "q7", label: "Quận 7" },
    { value: "td", label: "Thủ Đức" },
  ];

  const wards = [
    { value: "p1", label: "Phường 1" },
    { value: "p2", label: "Phường 2" },
    { value: "p3", label: "Phường 3" },
    { value: "p4", label: "Phường 4" },
  ];

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
            {/* Left Column - Form */}
            <div className="lg:col-span-2 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Customer Information */}
                <div className="bg-card rounded-lg p-6 shadow-sm animate-fade-in">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                      <User size={20} className="text-primary" />
                      Thông tin nhận hàng
                    </h2>
                    <Link 
                      to="/login" 
                      className="text-sm text-primary hover:underline flex items-center gap-1"
                    >
                      <User size={14} />
                      Đăng nhập
                    </Link>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Input
                        placeholder="Email (tùy chọn)"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="bg-background"
                      />
                    </div>
                    <div>
                      <Input
                        placeholder="Họ và tên"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange("fullName", e.target.value)}
                        className="bg-background"
                        required
                      />
                    </div>
                    <div className="relative">
                      <Input
                        placeholder="Số điện thoại"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        className="bg-background pl-16"
                        required
                      />
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-sm text-muted-foreground border-r pr-2">
                        <span className="text-lg">🇻🇳</span>
                      </div>
                    </div>
                    <div>
                      <Input
                        placeholder="Địa chỉ"
                        value={formData.address}
                        onChange={(e) => handleInputChange("address", e.target.value)}
                        className="bg-background"
                        required
                      />
                    </div>
                    <div>
                      <Select 
                        value={formData.province} 
                        onValueChange={(value) => handleInputChange("province", value)}
                      >
                        <SelectTrigger className="bg-background">
                          <SelectValue placeholder="Tỉnh thành" />
                        </SelectTrigger>
                        <SelectContent>
                          {provinces.map((province) => (
                            <SelectItem key={province.value} value={province.value}>
                              {province.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Select 
                        value={formData.district} 
                        onValueChange={(value) => handleInputChange("district", value)}
                      >
                        <SelectTrigger className="bg-background">
                          <SelectValue placeholder="Quận huyện" />
                        </SelectTrigger>
                        <SelectContent>
                          {districts.map((district) => (
                            <SelectItem key={district.value} value={district.value}>
                              {district.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Select 
                        value={formData.ward} 
                        onValueChange={(value) => handleInputChange("ward", value)}
                      >
                        <SelectTrigger className="bg-background">
                          <SelectValue placeholder="Phường xã" />
                        </SelectTrigger>
                        <SelectContent>
                          {wards.map((ward) => (
                            <SelectItem key={ward.value} value={ward.value}>
                              {ward.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Textarea
                        placeholder="Ghi chú (tùy chọn)"
                        value={formData.notes}
                        onChange={(e) => handleInputChange("notes", e.target.value)}
                        className="bg-background resize-none"
                        rows={3}
                      />
                    </div>
                  </div>
                </div>

                {/* Shipping & Payment */}
                <div className="space-y-6">
                  {/* Shipping */}
                  <div className="bg-card rounded-lg p-6 shadow-sm animate-fade-in" style={{ animationDelay: "0.1s" }}>
                    <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
                      <Truck size={20} className="text-primary" />
                      Vận chuyển
                    </h2>
                    <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 text-center text-sm text-foreground">
                      Vui lòng nhập thông tin giao hàng
                    </div>
                  </div>

                  {/* Payment Methods */}
                  <div className="bg-card rounded-lg p-6 shadow-sm animate-fade-in" style={{ animationDelay: "0.2s" }}>
                    <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
                      <CreditCard size={20} className="text-primary" />
                      Thanh toán
                    </h2>
                    <RadioGroup
                      value={formData.paymentMethod}
                      onValueChange={(value) => handleInputChange("paymentMethod", value)}
                      className="space-y-3"
                    >
                      <div className="flex items-center justify-between p-4 border border-border rounded-lg hover:border-primary/50 transition-colors cursor-pointer">
                        <div className="flex items-center gap-3">
                          <RadioGroupItem value="momo" id="momo" />
                          <Label htmlFor="momo" className="cursor-pointer">
                            Thanh toán qua Ví điện tử MoMo
                          </Label>
                        </div>
                        <div className="w-10 h-10 bg-[#a50064] rounded-lg flex items-center justify-center text-white font-bold text-xs">
                          MoMo
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-4 border border-border rounded-lg hover:border-primary/50 transition-colors cursor-pointer">
                        <div className="flex items-center gap-3">
                          <RadioGroupItem value="cod" id="cod" />
                          <Label htmlFor="cod" className="cursor-pointer">
                            Thanh toán khi giao hàng (COD)
                          </Label>
                        </div>
                        <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                          <Banknote size={20} className="text-muted-foreground" />
                        </div>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-lg p-6 shadow-sm sticky top-24 animate-fade-in" style={{ animationDelay: "0.3s" }}>
                <h2 className="text-lg font-semibold text-foreground mb-4">
                  Đơn hàng ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} sản phẩm)
                </h2>

                {/* Cart Items */}
                <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                  {cartItems.map((item) => (
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
                      </div>
                      <div className="text-sm font-medium text-foreground whitespace-nowrap">
                        {formatPrice(item.price)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Discount Code */}
                <div className="space-y-3 mb-6">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Nhập mã giảm giá"
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value)}
                      className="bg-background"
                      disabled={!!appliedVoucher}
                    />
                    <Button 
                      variant="outline" 
                      className="shrink-0 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                      onClick={handleApplyDiscount}
                      disabled={!!appliedVoucher}
                    >
                      Áp dụng
                    </Button>
                  </div>
                  
                  {/* Applied Voucher Display */}
                  {appliedVoucher && (
                    <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <Tag size={16} className="text-green-600" />
                        <div>
                          <p className="text-sm font-medium text-green-700">{appliedVoucher.name}</p>
                          <p className="text-xs text-green-600">
                            {appliedVoucher.discountType === "percentage" 
                              ? `Giảm ${appliedVoucher.discountValue}%${appliedVoucher.maxDiscount ? ` (tối đa ${formatPrice(appliedVoucher.maxDiscount)})` : ''}`
                              : `Giảm ${formatPrice(appliedVoucher.discountValue)}`
                            }
                          </p>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 text-green-600 hover:text-red-500 hover:bg-red-50"
                        onClick={handleRemoveVoucher}
                      >
                        <X size={14} />
                      </Button>
                    </div>
                  )}
                </div>

                {/* Order Totals */}
                <div className="space-y-3 text-sm border-t border-border pt-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tạm tính</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Phí vận chuyển</span>
                    <span>{shipping === 0 ? "Miễn phí" : formatPrice(shipping)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span className="flex items-center gap-1">
                        <Tag size={12} />
                        Giảm giá
                      </span>
                      <span>-{formatPrice(discount)}</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center border-t border-border pt-4 mt-4">
                  <span className="font-medium">Tổng cộng</span>
                  <span className="text-xl font-bold text-primary">{formatPrice(total)}</span>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between mt-6 gap-4">
                  <Link 
                    to="/cart" 
                    className="text-sm text-primary hover:underline flex items-center gap-1"
                  >
                    <ChevronLeft size={16} />
                    Quay về giỏ hàng
                  </Link>
                  <Button 
                    className="bg-primary hover:bg-primary/90 font-bold px-6"
                    onClick={handlePlaceOrder}
                  >
                    ĐẶT HÀNG
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </EndUserLayout>
  );
};

export default Checkout;
