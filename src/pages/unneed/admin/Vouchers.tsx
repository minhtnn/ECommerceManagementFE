import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Search, Eye, Pencil, Trash2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

interface Voucher {
  id: string;
  code: string;
  name: string;
  description: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  usageLimit: number;
  usedCount: number;
  startDate: string;
  endDate: string;
  priority: number;
  isActive: boolean;
  status: "active" | "inactive";
}

const initialVouchers: Voucher[] = [
  {
    id: "1",
    code: "GIAM5K",
    name: "Giảm 5K",
    description: "Giảm 5K cho đơn từ 0đ",
    discountType: "fixed",
    discountValue: 5000,
    minOrderValue: 0,
    usageLimit: 100,
    usedCount: 25,
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    priority: 1,
    isActive: true,
    status: "active",
  },
  {
    id: "2",
    code: "KM5PHAN",
    name: "Khuyến mãi đơn hàng trên 50.000đ",
    description: "Khuyến mãi 5% đơn hàng trên 50.000đ",
    discountType: "percentage",
    discountValue: 5,
    minOrderValue: 50000,
    maxDiscount: 20000,
    usageLimit: 200,
    usedCount: 80,
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    priority: 1,
    isActive: true,
    status: "active",
  },
];

const Vouchers = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [vouchers, setVouchers] = useState<Voucher[]>(initialVouchers);

  // View dialog state
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [viewVoucher, setViewVoucher] = useState<Voucher | null>(null);

  // Edit dialog state
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<Voucher | null>(null);

  // Delete dialog state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [voucherToDelete, setVoucherToDelete] = useState<Voucher | null>(null);

  const filteredVouchers = vouchers.filter((voucher) =>
    voucher.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewClick = (voucher: Voucher) => {
    setViewVoucher(voucher);
    setIsViewDialogOpen(true);
  };

  const handleEditClick = (voucher: Voucher) => {
    setEditFormData({ ...voucher });
    setIsEditDialogOpen(true);
  };

  const handleUpdateVoucher = () => {
    if (!editFormData) return;

    if (!editFormData.name.trim()) {
      toast.error("Vui lòng nhập tên khuyến mãi");
      return;
    }

    setVouchers(
      vouchers.map((v) =>
        v.id === editFormData.id ? editFormData : v
      )
    );
    setIsEditDialogOpen(false);
    setEditFormData(null);
    toast.success("Cập nhật khuyến mãi thành công!");
  };

  const handleDeleteClick = (voucher: Voucher) => {
    setVoucherToDelete(voucher);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!voucherToDelete) return;

    setVouchers(vouchers.filter((v) => v.id !== voucherToDelete.id));
    setIsDeleteDialogOpen(false);
    setVoucherToDelete(null);
    toast.success("Xóa khuyến mãi thành công!");
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Quản lý khuyến mãi</h1>
          <Button 
            className="bg-primary hover:bg-primary/90"
            onClick={() => navigate("/admin/vouchers/create")}
          >
            <Plus className="w-4 h-4 mr-2" />
            Tạo khuyến mãi mới
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm theo tên khuyến mãi"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-background rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold w-16">STT</TableHead>
                <TableHead className="font-semibold">Tên khuyến mãi</TableHead>
                <TableHead className="font-semibold text-center">Độ ưu tiên</TableHead>
                <TableHead className="font-semibold">Trạng thái</TableHead>
                <TableHead className="font-semibold text-center">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVouchers.map((voucher, index) => (
                <TableRow key={voucher.id}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{voucher.name}</p>
                      <p className="text-sm text-muted-foreground">{voucher.description}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className="bg-gray-100 border-gray-200">
                      {voucher.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        voucher.status === "active"
                          ? "bg-green-100 text-green-700 border-green-200"
                          : "bg-gray-100 text-gray-700 border-gray-200"
                      }
                    >
                      {voucher.status === "active" ? "Hoạt động" : "Không hoạt động"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => handleViewClick(voucher)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleEditClick(voucher)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => handleDeleteClick(voucher)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
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

      {/* View Voucher Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chi tiết khuyến mãi</DialogTitle>
            <DialogDescription>
              Thông tin chi tiết về khuyến mãi.
            </DialogDescription>
          </DialogHeader>
          {viewVoucher && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground text-xs">Mã khuyến mãi</Label>
                  <p className="font-mono text-sm">{viewVoucher.code}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Tên khuyến mãi</Label>
                  <p className="font-medium">{viewVoucher.name}</p>
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground text-xs">Mô tả</Label>
                <p className="text-sm">{viewVoucher.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground text-xs">Loại giảm giá</Label>
                  <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200">
                    {viewVoucher.discountType === "percentage" ? "Phần trăm (%)" : "Số tiền cố định (VNĐ)"}
                  </Badge>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Giá trị giảm</Label>
                  <p className="font-semibold text-primary">
                    {viewVoucher.discountType === "percentage" 
                      ? `${viewVoucher.discountValue}%` 
                      : `${viewVoucher.discountValue?.toLocaleString()}đ`}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground text-xs">Đơn tối thiểu</Label>
                  <p className="text-sm">{viewVoucher.minOrderValue?.toLocaleString() ?? 0}đ</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Giảm tối đa</Label>
                  <p className="text-sm">{viewVoucher.maxDiscount?.toLocaleString() ?? "-"}đ</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground text-xs">Ngày bắt đầu</Label>
                  <p className="text-sm">{viewVoucher.startDate}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Ngày kết thúc</Label>
                  <p className="text-sm">{viewVoucher.endDate}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-muted-foreground text-xs">Giới hạn sử dụng</Label>
                  <p className="text-sm">{viewVoucher.usageLimit ?? 0} lượt</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Đã sử dụng</Label>
                  <p className="text-sm">{viewVoucher.usedCount ?? 0} lượt</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Độ ưu tiên</Label>
                  <p className="text-sm">{viewVoucher.priority}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground text-xs">Kích hoạt</Label>
                  <Badge variant="outline" className={viewVoucher.isActive ? "bg-green-100 text-green-700 border-green-200" : "bg-gray-100 text-gray-700 border-gray-200"}>
                    {viewVoucher.isActive ? "Có" : "Không"}
                  </Badge>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Trạng thái</Label>
                  <Badge variant="outline" className={viewVoucher.status === "active" ? "bg-green-100 text-green-700 border-green-200" : "bg-gray-100 text-gray-700 border-gray-200"}>
                    {viewVoucher.status === "active" ? "Hoạt động" : "Không hoạt động"}
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Voucher Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa khuyến mãi</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin khuyến mãi bên dưới.
            </DialogDescription>
          </DialogHeader>
          {editFormData && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-code">Mã khuyến mãi</Label>
                  <Input
                    id="edit-code"
                    value={editFormData.code}
                    onChange={(e) => setEditFormData({ ...editFormData, code: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-name">
                    Tên khuyến mãi <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="edit-name"
                    value={editFormData.name}
                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Mô tả</Label>
                <Textarea
                  id="edit-description"
                  value={editFormData.description}
                  onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-discount-type">Loại giảm giá</Label>
                  <Select
                    value={editFormData.discountType}
                    onValueChange={(value: "percentage" | "fixed") => setEditFormData({ ...editFormData, discountType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Phần trăm (%)</SelectItem>
                      <SelectItem value="fixed">Số tiền cố định (VNĐ)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-discount-value">
                    Giá trị giảm {editFormData.discountType === "percentage" ? "(%)" : "(VNĐ)"}
                  </Label>
                  <Input
                    id="edit-discount-value"
                    type="number"
                    min="0"
                    value={editFormData.discountValue}
                    onChange={(e) => setEditFormData({ ...editFormData, discountValue: Number(e.target.value) })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-min-order">Đơn tối thiểu (VNĐ)</Label>
                  <Input
                    id="edit-min-order"
                    type="number"
                    min="0"
                    value={editFormData.minOrderValue}
                    onChange={(e) => setEditFormData({ ...editFormData, minOrderValue: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-max-discount">Giảm tối đa (VNĐ)</Label>
                  <Input
                    id="edit-max-discount"
                    type="number"
                    min="0"
                    value={editFormData.maxDiscount || ""}
                    onChange={(e) => setEditFormData({ ...editFormData, maxDiscount: e.target.value ? Number(e.target.value) : undefined })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-start-date">Ngày bắt đầu</Label>
                  <Input
                    id="edit-start-date"
                    type="date"
                    value={editFormData.startDate}
                    onChange={(e) => setEditFormData({ ...editFormData, startDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-end-date">Ngày kết thúc</Label>
                  <Input
                    id="edit-end-date"
                    type="date"
                    value={editFormData.endDate}
                    onChange={(e) => setEditFormData({ ...editFormData, endDate: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-usage-limit">Giới hạn sử dụng</Label>
                  <Input
                    id="edit-usage-limit"
                    type="number"
                    min="0"
                    value={editFormData.usageLimit}
                    onChange={(e) => setEditFormData({ ...editFormData, usageLimit: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-priority">Độ ưu tiên</Label>
                  <Input
                    id="edit-priority"
                    type="number"
                    min="0"
                    value={editFormData.priority}
                    onChange={(e) => setEditFormData({ ...editFormData, priority: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-status">Trạng thái</Label>
                  <Select
                    value={editFormData.status}
                    onValueChange={(value: "active" | "inactive") => setEditFormData({ ...editFormData, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Hoạt động</SelectItem>
                      <SelectItem value="inactive">Không hoạt động</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <Label htmlFor="edit-is-active" className="text-sm">Kích hoạt khuyến mãi</Label>
                <Switch
                  id="edit-is-active"
                  checked={editFormData.isActive}
                  onCheckedChange={(checked) => setEditFormData({ ...editFormData, isActive: checked })}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Hủy
            </Button>
            <Button
              type="button"
              className="bg-primary hover:bg-primary/90"
              onClick={handleUpdateVoucher}
            >
              Lưu thay đổi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa khuyến mãi</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa khuyến mãi "{voucherToDelete?.name}"? 
              Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90"
              onClick={handleConfirmDelete}
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default Vouchers;
