import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, User, Package, Lock, MapPin, LogOut, Eye, Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatPrice } from "@/data/mockData";
import EndUserLayout from "@/layouts/EndUserLayout";

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
}

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: "pending" | "processing" | "shipping" | "delivered" | "cancelled";
  items: OrderItem[];
  total: number;
  shippingAddress: string;
  paymentMethod: string;
}

const mockOrders: Order[] = [
  {
    id: "1",
    orderNumber: "DH001234",
    date: "2024-12-20",
    status: "delivered",
    items: [
      { id: "1", name: "Cà Phê Rang Xay Signature", quantity: 2, price: 185000, image: "/placeholder.svg" },
      { id: "2", name: "Cà Phê Hạt Arabica", quantity: 1, price: 245000, image: "/placeholder.svg" },
    ],
    total: 615000,
    shippingAddress: "3141/A Phạm Thế Hiển, Quận 8, TP Hồ Chí Minh",
    paymentMethod: "COD",
  },
  {
    id: "2",
    orderNumber: "DH001235",
    date: "2024-12-18",
    status: "shipping",
    items: [
      { id: "3", name: "Cà Phê Hòa Tan 3in1", quantity: 3, price: 125000, image: "/placeholder.svg" },
    ],
    total: 375000,
    shippingAddress: "3141/A Phạm Thế Hiển, Quận 8, TP Hồ Chí Minh",
    paymentMethod: "Bank Transfer",
  },
  {
    id: "3",
    orderNumber: "DH001236",
    date: "2024-12-15",
    status: "processing",
    items: [
      { id: "4", name: "Cà Phê Uống Liền Premium", quantity: 1, price: 165000, image: "/placeholder.svg" },
      { id: "5", name: "Cà Phê Rang Xay Classic", quantity: 2, price: 155000, image: "/placeholder.svg" },
    ],
    total: 475000,
    shippingAddress: "3141/A Phạm Thế Hiển, Quận 8, TP Hồ Chí Minh",
    paymentMethod: "COD",
  },
];

const statusLabels: Record<string, { label: string; className: string }> = {
  pending: { label: "Chờ xác nhận", className: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  processing: { label: "Đang xử lý", className: "bg-blue-100 text-blue-700 border-blue-200" },
  shipping: { label: "Đang giao", className: "bg-purple-100 text-purple-700 border-purple-200" },
  delivered: { label: "Đã giao", className: "bg-green-100 text-green-700 border-green-200" },
  cancelled: { label: "Đã hủy", className: "bg-red-100 text-red-700 border-red-200" },
};

const CustomerOrders = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  const customerName = "Trần Quốc An";

  const menuItems = [
    { id: "info", label: "Thông tin tài khoản", icon: User, path: "/account" },
    { id: "orders", label: "Đơn hàng của bạn", icon: Package, path: "/orders" },
    { id: "password", label: "Đổi mật khẩu", icon: Lock, path: "/account" },
    { id: "addresses", label: "Sổ địa chỉ (2)", icon: MapPin, path: "/account" },
  ];

  const handleLogout = () => {
    toast.success("Đăng xuất thành công!");
    navigate("/auth");
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailDialogOpen(true);
  };

  const filteredOrders = mockOrders.filter((order) => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <EndUserLayout>
      {/* Breadcrumb */}
      <div className="bg-muted/30 py-3 border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
              Trang chủ
            </Link>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
            <Link to="/account" className="text-muted-foreground hover:text-primary transition-colors">
              Trang khách hàng
            </Link>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
            <span className="text-primary font-medium">Đơn hàng của bạn</span>
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
                Xin chào, <span className="font-medium text-foreground">{customerName}</span> !
              </p>

              <nav className="space-y-1">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = item.id === "orders";
                  return (
                    <Link
                      key={item.id}
                      to={item.path}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-left text-sm transition-colors ${
                        isActive
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </Link>
                  );
                })}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-left text-sm text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Đăng xuất
                </button>
              </nav>
            </div>
          </div>

          {/* Right Content */}
          <div className="md:col-span-2">
            <div className="bg-background rounded-lg border p-6">
              <h2 className="text-xl font-bold mb-6">ĐƠN HÀNG CỦA BẠN</h2>

              {/* Filters */}
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="relative flex-1 max-w-xs">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Tìm theo mã đơn hàng..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="pending">Chờ xác nhận</SelectItem>
                    <SelectItem value="processing">Đang xử lý</SelectItem>
                    <SelectItem value="shipping">Đang giao</SelectItem>
                    <SelectItem value="delivered">Đã giao</SelectItem>
                    <SelectItem value="cancelled">Đã hủy</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Orders List */}
              {filteredOrders.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Không có đơn hàng nào</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredOrders.map((order) => (
                    <div
                      key={order.id}
                      className="border rounded-lg p-4 hover:border-primary/50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <span className="font-semibold">#{order.orderNumber}</span>
                            <Badge variant="outline" className={statusLabels[order.status].className}>
                              {statusLabels[order.status].label}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Ngày đặt: {new Date(order.date).toLocaleDateString("vi-VN")}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewOrder(order)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Chi tiết
                        </Button>
                      </div>

                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-muted-foreground">
                          {order.items.length} sản phẩm
                        </span>
                        <span className="font-semibold text-primary">
                          {formatPrice(order.total)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Order Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Chi tiết đơn hàng #{selectedOrder?.orderNumber}</DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Trạng thái:</span>
                <Badge variant="outline" className={statusLabels[selectedOrder.status].className}>
                  {statusLabels[selectedOrder.status].label}
                </Badge>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Sản phẩm</h4>
                <div className="space-y-3">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-muted rounded-md flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          x{item.quantity} • {formatPrice(item.price)}
                        </p>
                      </div>
                      <span className="text-sm font-medium">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Địa chỉ giao hàng:</span>
                  <span className="text-right max-w-[60%]">{selectedOrder.shippingAddress}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Phương thức thanh toán:</span>
                  <span>{selectedOrder.paymentMethod}</span>
                </div>
                <div className="flex justify-between font-semibold pt-2 border-t">
                  <span>Tổng cộng:</span>
                  <span className="text-primary">{formatPrice(selectedOrder.total)}</span>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => setIsDetailDialogOpen(false)}
              >
                Đóng
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </EndUserLayout>
  );
};

export default CustomerOrders;
