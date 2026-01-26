import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, Search, Copy, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCategories, Category } from "@/contexts/CategoriesContext";

const Categories = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { categories, updateCategory, deleteCategory } = useCategories();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryType, setCategoryType] = useState("all");

  // Edit dialog state
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [editFormData, setEditFormData] = useState({
    code: "",
    name: "",
    type: "parent" as Category["type"],
    order: 1,
    status: "active" as Category["status"],
  });

  // Delete dialog state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  const filteredCategories = categories.filter((cat) => {
    const matchesSearch = cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = categoryType === "all" || cat.type === categoryType;
    return matchesSearch && matchesType;
  });

  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category);
    setEditFormData({
      code: category.code,
      name: category.name,
      type: category.type,
      order: category.order,
      status: category.status,
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateCategory = () => {
    if (!selectedCategory) return;

    if (!editFormData.name || !editFormData.code) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin",
        variant: "destructive",
      });
      return;
    }

    updateCategory(selectedCategory.id, editFormData);

    setIsEditDialogOpen(false);
    setSelectedCategory(null);
    toast({
      title: "Thành công",
      description: "Đã cập nhật danh mục",
    });
  };

  const handleDeleteClick = (category: Category) => {
    setCategoryToDelete(category);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!categoryToDelete) return;

    deleteCategory(categoryToDelete.id);
    setIsDeleteDialogOpen(false);
    setCategoryToDelete(null);
    toast({
      title: "Đã xóa",
      description: "Danh mục đã được xóa thành công",
    });
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Đã sao chép",
      description: "Mã danh mục đã được sao chép",
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Quản lý danh mục</h1>
          <Button 
            className="bg-primary hover:bg-primary/90"
            onClick={() => navigate("/admin/categories/create")}
          >
            <Plus className="w-4 h-4 mr-2" />
            Tạo danh mục mới
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm theo tên danh mục"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Loại danh mục</span>
            <Select value={categoryType} onValueChange={setCategoryType}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Tất cả" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="parent">Danh mục cha</SelectItem>
                <SelectItem value="child">Danh mục con</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-background rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">Mã danh mục</TableHead>
                <TableHead className="font-semibold">Tên danh mục</TableHead>
                <TableHead className="font-semibold">Loại danh mục</TableHead>
                <TableHead className="font-semibold text-center">Thứ tự</TableHead>
                <TableHead className="font-semibold">Trạng thái</TableHead>
                <TableHead className="font-semibold text-center">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-orange-100 text-orange-700 border-orange-200 font-mono text-xs">
                        {category.code}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => handleCopyCode(category.code)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        category.type === "parent"
                          ? "bg-blue-100 text-blue-700 border-blue-200"
                          : "bg-green-100 text-green-700 border-green-200"
                      }
                    >
                      {category.type === "parent" ? "Danh mục cha" : "Danh mục con"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">{category.order}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        category.status === "active"
                          ? "bg-green-100 text-green-700 border-green-200"
                          : "bg-gray-100 text-gray-700 border-gray-200"
                      }
                    >
                      {category.status === "active" ? "Hoạt động" : "Tạm dừng"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-background">
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={() => handleEditCategory(category)}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="cursor-pointer text-destructive"
                          onClick={() => handleDeleteClick(category)}
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

      {/* Edit Category Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa danh mục</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-code">Mã danh mục</Label>
              <Input
                id="edit-code"
                value={editFormData.code}
                onChange={(e) => setEditFormData((prev) => ({ ...prev, code: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-name">Tên danh mục</Label>
              <Input
                id="edit-name"
                value={editFormData.name}
                onChange={(e) => setEditFormData((prev) => ({ ...prev, name: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label>Loại danh mục</Label>
              <Select
                value={editFormData.type}
                onValueChange={(value) => setEditFormData((prev) => ({ ...prev, type: value as Category["type"] }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="parent">Danh mục cha</SelectItem>
                  <SelectItem value="child">Danh mục con</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-order">Thứ tự</Label>
              <Input
                id="edit-order"
                type="number"
                min="1"
                value={editFormData.order}
                onChange={(e) => setEditFormData((prev) => ({ ...prev, order: parseInt(e.target.value) || 1 }))}
              />
            </div>

            <div className="space-y-2">
              <Label>Trạng thái</Label>
              <Select
                value={editFormData.status}
                onValueChange={(value) => setEditFormData((prev) => ({ ...prev, status: value as Category["status"] }))}
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

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Hủy
              </Button>
              <Button onClick={handleUpdateCategory}>Lưu thay đổi</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Xác nhận xóa</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa danh mục "{categoryToDelete?.name}"? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default Categories;