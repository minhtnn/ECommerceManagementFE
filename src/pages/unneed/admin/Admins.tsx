import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Search, MoreHorizontal, Edit, Trash2, Shield, ShieldCheck, Eye, EyeOff } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

interface Admin {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "admin" | "customer";
  status: "active" | "inactive";
  createdAt: string;
}

const mockAdmins: Admin[] = [
  { 
    id: "1", 
    name: "Nguyễn Văn Admin", 
    email: "admin@thophat.com", 
    phone: "0914155344",
    role: "admin", 
    status: "active",
    createdAt: "2024-01-15"
  },
  { 
    id: "2", 
    name: "Trần Quốc An", 
    email: "tranquocan33210@gmail.com", 
    phone: "0843789091312",
    role: "customer", 
    status: "active",
    createdAt: "2024-03-20"
  },
  { 
    id: "3", 
    name: "Lê Văn Khách", 
    email: "customer@example.com", 
    phone: "0987654321",
    role: "customer", 
    status: "active",
    createdAt: "2024-05-10"
  },
];

const roleLabels: Record<string, { label: string; className: string }> = {
  admin: { label: "Admin", className: "bg-purple-100 text-purple-700 border-purple-200" },
  customer: { label: "Khách hàng", className: "bg-blue-100 text-blue-700 border-blue-200" },
};

const Admins = () => {
  const { toast } = useToast();
  const [admins, setAdmins] = useState<Admin[]>(mockAdmins);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showEditPassword, setShowEditPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "admin" as Admin["role"],
    status: "active" as Admin["status"],
  });

  const [editFormData, setEditFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "admin" as Admin["role"],
    status: "active" as Admin["status"],
  });

  const filteredAdmins = admins.filter((admin) => {
    const matchesSearch = 
      admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.phone.includes(searchTerm);
    const matchesRole = roleFilter === "all" || admin.role === roleFilter;
    const matchesStatus = statusFilter === "all" || admin.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const resetCreateForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "admin",
      status: "active",
    });
    setShowPassword(false);
  };

  const handleCreateAdmin = () => {
    if (!formData.name || !formData.email || !formData.password) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin bắt buộc",
        variant: "destructive",
      });
      return;
    }

    // Check if email already exists
    if (admins.some((admin) => admin.email.toLowerCase() === formData.email.toLowerCase())) {
      toast({
        title: "Lỗi",
        description: "Email này đã được sử dụng",
        variant: "destructive",
      });
      return;
    }

    const newAdmin: Admin = {
      id: Date.now().toString(),
      name: formData.name,
      email: formData.email,
      phone: "",
      role: formData.role,
      status: formData.status,
      createdAt: new Date().toISOString().split("T")[0],
    };

    setAdmins((prev) => [newAdmin, ...prev]);
    setIsCreateDialogOpen(false);
    resetCreateForm();

    toast({
      title: "Thành công",
      description: "Đã tạo tài khoản Admin mới",
    });
  };

  const handleEditAdmin = (admin: Admin) => {
    setSelectedAdmin(admin);
    setEditFormData({
      name: admin.name,
      email: admin.email,
      password: "",
      role: admin.role,
      status: admin.status,
    });
    setShowEditPassword(false);
    setIsEditDialogOpen(true);
  };

  const handleUpdateAdmin = () => {
    if (!selectedAdmin) return;

    if (!editFormData.name || !editFormData.email) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin bắt buộc",
        variant: "destructive",
      });
      return;
    }

    // Check if email already exists (excluding current admin)
    if (
      admins.some(
        (admin) =>
          admin.id !== selectedAdmin.id &&
          admin.email.toLowerCase() === editFormData.email.toLowerCase()
      )
    ) {
      toast({
        title: "Lỗi",
        description: "Email này đã được sử dụng",
        variant: "destructive",
      });
      return;
    }

    setAdmins((prev) =>
      prev.map((admin) =>
        admin.id === selectedAdmin.id
          ? {
              ...admin,
              name: editFormData.name,
              email: editFormData.email,
              role: editFormData.role,
              status: editFormData.status,
            }
          : admin
      )
    );

    setIsEditDialogOpen(false);
    setSelectedAdmin(null);

    toast({
      title: "Thành công",
      description: "Đã cập nhật thông tin Admin",
    });
  };

  const handleDeleteAdmin = (id: string) => {
    setAdmins((prev) => prev.filter((admin) => admin.id !== id));
    toast({
      title: "Đã xóa",
      description: "Tài khoản Admin đã được xóa",
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Quản lý tài khoản Admin</h1>
          <Button
            className="bg-primary hover:bg-primary/90"
            onClick={() => {
              resetCreateForm();
              setIsCreateDialogOpen(true);
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Thêm Admin mới
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm theo tên, email hoặc số điện thoại"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Vai trò</span>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Tất cả" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="customer">Khách hàng</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Trạng thái</span>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Tất cả" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="active">Hoạt động</SelectItem>
                <SelectItem value="inactive">Tạm dừng</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-background rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">STT</TableHead>
                <TableHead className="font-semibold">Họ và tên</TableHead>
                <TableHead className="font-semibold">Email</TableHead>
                <TableHead className="font-semibold">Số điện thoại</TableHead>
                <TableHead className="font-semibold">Vai trò</TableHead>
                <TableHead className="font-semibold">Trạng thái</TableHead>
                <TableHead className="font-semibold text-center">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAdmins.map((admin, index) => (
                <TableRow key={admin.id}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        {admin.role === "admin" ? (
                          <ShieldCheck className="w-4 h-4 text-primary" />
                        ) : (
                          <Shield className="w-4 h-4 text-primary" />
                        )}
                      </div>
                      <span className="font-medium">{admin.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{admin.email}</TableCell>
                  <TableCell className="text-muted-foreground">{admin.phone || "-"}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={roleLabels[admin.role].className}
                    >
                      {roleLabels[admin.role].label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        admin.status === "active"
                          ? "bg-green-100 text-green-700 border-green-200"
                          : "bg-gray-100 text-gray-700 border-gray-200"
                      }
                    >
                      {admin.status === "active" ? "Hoạt động" : "Tạm dừng"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={() => handleEditAdmin(admin)}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="cursor-pointer text-destructive"
                          onClick={() => handleDeleteAdmin(admin.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Xóa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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

      {/* Create Admin Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Thêm Admin mới</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">
                Họ và tên <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                placeholder="Nhập họ và tên"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">
                Email (tên đăng nhập) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">
                Mật khẩu <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Nhập mật khẩu"
                  value={formData.password}
                  onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            {/* Role */}
            <div className="space-y-2">
              <Label>Vai trò</Label>
              <Select
                value={formData.role}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, role: value as Admin["role"] }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="customer">Khách hàng</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label>Trạng thái</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, status: value as Admin["status"] }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Hoạt động</SelectItem>
                  <SelectItem value="inactive">Tạm dừng</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Hủy
              </Button>
              <Button onClick={handleCreateAdmin}>Tạo tài khoản</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Admin Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa Admin</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="edit-name">
                Họ và tên <span className="text-destructive">*</span>
              </Label>
              <Input
                id="edit-name"
                placeholder="Nhập họ và tên"
                value={editFormData.name}
                onChange={(e) => setEditFormData((prev) => ({ ...prev, name: e.target.value }))}
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="edit-email">
                Email (tên đăng nhập) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="edit-email"
                type="email"
                placeholder="admin@example.com"
                value={editFormData.email}
                onChange={(e) => setEditFormData((prev) => ({ ...prev, email: e.target.value }))}
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="edit-password">Mật khẩu mới (để trống nếu không đổi)</Label>
              <div className="relative">
                <Input
                  id="edit-password"
                  type={showEditPassword ? "text" : "password"}
                  placeholder="Nhập mật khẩu mới"
                  value={editFormData.password}
                  onChange={(e) =>
                    setEditFormData((prev) => ({ ...prev, password: e.target.value }))
                  }
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowEditPassword(!showEditPassword)}
                >
                  {showEditPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            {/* Role */}
            <div className="space-y-2">
              <Label>Vai trò</Label>
              <Select
                value={editFormData.role}
                onValueChange={(value) =>
                  setEditFormData((prev) => ({ ...prev, role: value as Admin["role"] }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="customer">Khách hàng</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label>Trạng thái</Label>
              <Select
                value={editFormData.status}
                onValueChange={(value) =>
                  setEditFormData((prev) => ({ ...prev, status: value as Admin["status"] }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Hoạt động</SelectItem>
                  <SelectItem value="inactive">Tạm dừng</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Hủy
              </Button>
              <Button onClick={handleUpdateAdmin}>Lưu thay đổi</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default Admins;
