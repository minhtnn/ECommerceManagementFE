import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
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
import { Search, Eye, Calendar, Package } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface OrderProduct {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
}

interface Order {
  id: string;
  orderCode: string;
  customerName: string;
  customerPhone: string;
  address: string;
  totalAmount: number;
  status: "pending" | "confirmed" | "shipping" | "completed" | "cancelled";
  createdAt: string;
  items: number;
  products: OrderProduct[];
}

const mockOrders: Order[] = [
  {
    id: "1",
    orderCode: "DH001",
    customerName: "Nguyễn Văn A",
    customerPhone: "0912345678",
    address: "123 Nguyễn Huệ, Q.1, TP.HCM",
    totalAmount: 250000,
    status: "pending",
    createdAt: "2025-12-23 10:30",
    items: 3,
    products: [
      { id: "p1", name: "Cà phê Arabica Premium", quantity: 2, price: 85000, image: "/placeholder.svg" },
      { id: "p2", name: "Cà phê Robusta Đặc biệt", quantity: 1, price: 80000, image: "/placeholder.svg" },
    ],
  },
  {
    id: "2",
    orderCode: "DH002",
    customerName: "Trần Thị B",
    customerPhone: "0987654321",
    address: "456 Lê Lợi, Q.3, TP.HCM",
    totalAmount: 180000,
    status: "confirmed",
    createdAt: "2025-12-23 09:15",
    items: 2,
    products: [
      { id: "p3", name: "Cà phê Espresso Blend", quantity: 2, price: 90000, image: "/placeholder.svg" },
    ],
  },
  {
    id: "3",
    orderCode: "DH003",
    customerName: "Lê Văn C",
    customerPhone: "0909123456",
    address: "789 Trần Hưng Đạo, Q.5, TP.HCM",
    totalAmount: 450000,
    status: "completed",
    createdAt: "2025-12-22 16:45",
    items: 5,
    products: [
      { id: "p1", name: "Cà phê Arabica Premium", quantity: 3, price: 85000, image: "/placeholder.svg" },
      { id: "p4", name: "Cà phê Mocha Special", quantity: 2, price: 97500, image: "/placeholder.svg" },
    ],
  },
  {
    id: "4",
    orderCode: "DH004",
    customerName: "Phạm Thị D",
    customerPhone: "0918765432",
    address: "321 Võ Văn Tần, Q.3, TP.HCM",
    totalAmount: 320000,
    status: "shipping",
    createdAt: "2025-12-22 14:20",
    items: 4,
    products: [
      { id: "p2", name: "Cà phê Robusta Đặc biệt", quantity: 4, price: 80000, image: "/placeholder.svg" },
    ],
  },
];

const statusConfig = {
  pending: { label: "Chờ xử lý", className: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  confirmed: { label: "Đã xác nhận", className: "bg-blue-100 text-blue-700 border-blue-200" },
  shipping: { label: "Đang giao", className: "bg-purple-100 text-purple-700 border-purple-200" },
  completed: { label: "Hoàn thành", className: "bg-green-100 text-green-700 border-green-200" },
  cancelled: { label: "Đã hủy", className: "bg-red-100 text-red-700 border-red-200" },
};

const statusOptions: { value: Order["status"]; label: string }[] = [
  { value: "pending", label: "Chờ xử lý" },
  { value: "confirmed", label: "Đã xác nhận" },
  { value: "shipping", label: "Đang giao" },
  { value: "completed", label: "Hoàn thành" },
  { value: "cancelled", label: "Đã hủy" },
];

const Orders = () => {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerPhone.includes(searchTerm);
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsDialogOpen(true);
  };

  const handleStatusChange = (newStatus: Order["status"]) => {
    if (!selectedOrder) return;

    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === selectedOrder.id ? { ...order, status: newStatus } : order
      )
    );
    setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
    toast({
      title: "Cập nhật thành công",
      description: `Đơn hàng ${selectedOrder.orderCode} đã được cập nhật trạng thái thành "${statusConfig[newStatus].label}"`,
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Quản lý đơn hàng</h1>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm mã đơn, tên khách hàng, SĐT..."
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
              <SelectItem value="pending">Chờ xử lý</SelectItem>
              <SelectItem value="confirmed">Đã xác nhận</SelectItem>
              <SelectItem value="shipping">Đang giao</SelectItem>
              <SelectItem value="completed">Hoàn thành</SelectItem>
              <SelectItem value="cancelled">Đã hủy</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="pl-10 w-40"
                placeholder="Từ ngày"
              />
            </div>
            <span className="text-muted-foreground">-</span>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="pl-10 w-40"
                placeholder="Đến ngày"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-background rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">Mã đơn hàng</TableHead>
                <TableHead className="font-semibold">Khách hàng</TableHead>
                <TableHead className="font-semibold">SĐT</TableHead>
                <TableHead className="font-semibold">Địa chỉ</TableHead>
                <TableHead className="font-semibold text-center">Số SP</TableHead>
                <TableHead className="font-semibold">Trạng thái</TableHead>
                <TableHead className="font-semibold">Ngày tạo</TableHead>
                <TableHead className="font-semibold text-center">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200 font-mono">
                      {order.orderCode}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{order.customerName}</TableCell>
                  <TableCell>{order.customerPhone}</TableCell>
                  <TableCell className="max-w-[200px] truncate" title={order.address}>
                    {order.address}
                  </TableCell>
                  <TableCell className="text-center">{order.items}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={statusConfig[order.status].className}>
                      {statusConfig[order.status].label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{order.createdAt}</TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleViewOrder(order)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 border-t">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Số hàng mỗi trang:</span>
              <Select defaultValue="10">
                <SelectTrigger className="w-16 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Hiển thị 1 trên 1</span>
              <div className="flex gap-1">
                <Button variant="outline" size="icon" className="h-8 w-8">
                  {"<"}
                </Button>
                <Button className="h-8 w-8 bg-primary">1</Button>
                <Button variant="outline" size="icon" className="h-8 w-8">
                  {">"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Order Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Chi tiết đơn hàng {selectedOrder?.orderCode}
            </DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6">
              {/* Customer Info */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Khách hàng</p>
                  <p className="font-medium">{selectedOrder.customerName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Số điện thoại</p>
                  <p className="font-medium">{selectedOrder.customerPhone}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground">Địa chỉ</p>
                  <p className="font-medium">{selectedOrder.address}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Ngày tạo</p>
                  <p className="font-medium">{selectedOrder.createdAt}</p>
                </div>
              </div>

              {/* Status Update */}
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">Trạng thái:</span>
                <Select
                  value={selectedOrder.status}
                  onValueChange={(value) => handleStatusChange(value as Order["status"])}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Badge variant="outline" className={statusConfig[selectedOrder.status].className}>
                  {statusConfig[selectedOrder.status].label}
                </Badge>
              </div>

              {/* Products List */}
              <div>
                <h4 className="font-semibold mb-3">Sản phẩm trong đơn hàng</h4>
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead>Sản phẩm</TableHead>
                        <TableHead className="text-center">Số lượng</TableHead>
                        <TableHead className="text-right">Đơn giá</TableHead>
                        <TableHead className="text-right">Thành tiền</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedOrder.products.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-10 h-10 rounded object-cover bg-muted"
                              />
                              <span className="font-medium">{product.name}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">{product.quantity}</TableCell>
                          <TableCell className="text-right">{formatCurrency(product.price)}</TableCell>
                          <TableCell className="text-right font-medium">
                            {formatCurrency(product.price * product.quantity)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-end pt-4 border-t">
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Tổng tiền</p>
                  <p className="text-xl font-bold text-primary">
                    {formatCurrency(selectedOrder.totalAmount)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default Orders;
