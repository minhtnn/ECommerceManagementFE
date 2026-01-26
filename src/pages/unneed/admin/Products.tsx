import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  DialogFooter,
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Plus, Search, Copy, Eye, ImageIcon, Pencil, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useProducts, Product } from "@/contexts/ProductsContext";
import { useCategories } from "@/contexts/CategoriesContext";

const Products = () => {
  const navigate = useNavigate();
  const { products, updateProduct, deleteProduct } = useProducts();
  const { categories, getActiveCategories } = useCategories();
  const [searchName, setSearchName] = useState("");
  const [searchCode, setSearchCode] = useState("");
  
  // View dialog state
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [viewProduct, setViewProduct] = useState<Product | null>(null);
  
  // Edit dialog state
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<Product | null>(null);
  
  // Delete dialog state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const activeCategories = getActiveCategories();

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.name || "Không xác định";
  };

  const filteredProducts = products.filter((product) => {
    const matchesName = product.name.toLowerCase().includes(searchName.toLowerCase());
    const matchesCode = product.code.toLowerCase().includes(searchCode.toLowerCase());
    return matchesName && matchesCode;
  });

  const handleViewClick = (product: Product) => {
    setViewProduct(product);
    setIsViewDialogOpen(true);
  };

  const handleEditClick = (product: Product) => {
    setEditFormData({ ...product });
    setIsEditDialogOpen(true);
  };

  const handleUpdateProduct = () => {
    if (!editFormData) return;
    updateProduct(editFormData.id, editFormData);
    setIsEditDialogOpen(false);
    setEditFormData(null);
    toast({ title: "Thành công", description: "Đã cập nhật sản phẩm" });
  };

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!productToDelete) return;
    deleteProduct(productToDelete.id);
    setIsDeleteDialogOpen(false);
    setProductToDelete(null);
    toast({ title: "Thành công", description: "Đã xóa sản phẩm" });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Quản lý sản phẩm</h1>
          <Button 
            className="bg-primary hover:bg-primary/90"
            onClick={() => navigate("/admin/products/create")}
          >
            <Plus className="w-4 h-4 mr-2" />
            Tạo sản phẩm mới
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm theo tên sản phẩm"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm theo mã sản phẩm"
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-background rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold w-20">Ảnh</TableHead>
                <TableHead className="font-semibold">Mã sản phẩm</TableHead>
                <TableHead className="font-semibold">Tên sản phẩm</TableHead>
                <TableHead className="font-semibold">Danh mục</TableHead>
                <TableHead className="font-semibold">Trạng Thái</TableHead>
                <TableHead className="font-semibold text-center">Thao Tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                      {product.image ? (
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <ImageIcon className="w-6 h-6 text-muted-foreground" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-orange-100 text-orange-700 border-orange-200 font-mono text-xs">
                        {product.code}
                      </Badge>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200">
                      {getCategoryName(product.categoryId)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={product.status === "active" ? "bg-green-100 text-green-700 border-green-200" : "bg-gray-100 text-gray-700 border-gray-200"}
                    >
                      {product.status === "active" ? "Hoạt động" : "Không hoạt động"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleViewClick(product)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEditClick(product)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDeleteClick(product)}>
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

        {/* View Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Chi tiết sản phẩm</DialogTitle>
            </DialogHeader>
            {viewProduct && (
              <div className="space-y-6">
                <div className="flex justify-center">
                  <div className="w-32 h-32 bg-muted rounded-lg flex items-center justify-center">
                    {viewProduct.image ? (
                      <img src={viewProduct.image} alt={viewProduct.name} className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <ImageIcon className="w-12 h-12 text-muted-foreground" />
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground text-xs">Mã sản phẩm</Label>
                    <p className="font-mono text-sm">{viewProduct.code}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-xs">Tên sản phẩm</Label>
                    <p className="font-medium">{viewProduct.name}</p>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-muted-foreground text-xs">Mô tả</Label>
                    <p className="text-sm">{viewProduct.description}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-xs">Danh mục</Label>
                    <p className="text-sm">{getCategoryName(viewProduct.categoryId)}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-xs">Đơn vị</Label>
                    <p className="text-sm">{viewProduct.unit}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-xs">Giá bán</Label>
                    <p className="font-semibold text-primary">{viewProduct.price?.toLocaleString() ?? 0}đ</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-xs">Giá gốc</Label>
                    <p className="text-sm line-through text-muted-foreground">{viewProduct.originalPrice?.toLocaleString() ?? "-"}đ</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-xs">Tồn kho</Label>
                    <p className="text-sm">{viewProduct.stock ?? 0} {viewProduct.unit ?? ""}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-xs">Biến thể</Label>
                    <p className="text-sm">{viewProduct.hasVariants ? "Có biến thể" : "Không biến thể"}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-xs">Sản phẩm nổi bật</Label>
                    <Badge variant="outline" className={viewProduct.isFeatured ? "bg-blue-100 text-blue-700 border-blue-200" : "bg-gray-100 text-gray-700 border-gray-200"}>
                      {viewProduct.isFeatured ? "Có" : "Không"}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-xs">Đang giảm giá</Label>
                    <Badge variant="outline" className={viewProduct.isOnSale ? "bg-red-100 text-red-700 border-red-200" : "bg-gray-100 text-gray-700 border-gray-200"}>
                      {viewProduct.isOnSale ? "Có" : "Không"}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-xs">Trạng thái</Label>
                    <Badge variant="outline" className={viewProduct.status === "active" ? "bg-green-100 text-green-700 border-green-200" : "bg-gray-100 text-gray-700 border-gray-200"}>
                      {viewProduct.status === "active" ? "Hoạt động" : "Không hoạt động"}
                    </Badge>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Chỉnh sửa sản phẩm</DialogTitle>
            </DialogHeader>
            {editFormData && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-code">Mã sản phẩm</Label>
                    <Input
                      id="edit-code"
                      value={editFormData.code}
                      onChange={(e) => setEditFormData({ ...editFormData, code: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-name">Tên sản phẩm</Label>
                    <Input
                      id="edit-name"
                      value={editFormData.name}
                      onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="edit-description">Mô tả</Label>
                  <Textarea
                    id="edit-description"
                    value={editFormData.description}
                    onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-category">Danh mục</Label>
                    <Select
                      value={editFormData.categoryId}
                      onValueChange={(value) => setEditFormData({ ...editFormData, categoryId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {activeCategories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="edit-unit">Đơn vị</Label>
                    <Input
                      id="edit-unit"
                      value={editFormData.unit}
                      onChange={(e) => setEditFormData({ ...editFormData, unit: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-price">Giá bán (VNĐ)</Label>
                    <Input
                      id="edit-price"
                      type="number"
                      value={editFormData.price}
                      onChange={(e) => setEditFormData({ ...editFormData, price: Number(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-original-price">Giá gốc (VNĐ)</Label>
                    <Input
                      id="edit-original-price"
                      type="number"
                      value={editFormData.originalPrice || ""}
                      onChange={(e) => setEditFormData({ ...editFormData, originalPrice: e.target.value ? Number(e.target.value) : undefined })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-stock">Tồn kho</Label>
                    <Input
                      id="edit-stock"
                      type="number"
                      value={editFormData.stock}
                      onChange={(e) => setEditFormData({ ...editFormData, stock: Number(e.target.value) })}
                    />
                  </div>
                  <div>
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
                <div className="grid grid-cols-3 gap-4 pt-2">
                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <Label htmlFor="edit-variants" className="text-sm">Có biến thể</Label>
                    <Switch
                      id="edit-variants"
                      checked={editFormData.hasVariants}
                      onCheckedChange={(checked) => setEditFormData({ ...editFormData, hasVariants: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <Label htmlFor="edit-featured" className="text-sm">Nổi bật</Label>
                    <Switch
                      id="edit-featured"
                      checked={editFormData.isFeatured}
                      onCheckedChange={(checked) => setEditFormData({ ...editFormData, isFeatured: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <Label htmlFor="edit-sale" className="text-sm">Giảm giá</Label>
                    <Switch
                      id="edit-sale"
                      checked={editFormData.isOnSale}
                      onCheckedChange={(checked) => setEditFormData({ ...editFormData, isOnSale: checked })}
                    />
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Hủy</Button>
              <Button onClick={handleUpdateProduct}>Lưu thay đổi</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Xác nhận xóa sản phẩm</AlertDialogTitle>
              <AlertDialogDescription>
                Bạn có chắc chắn muốn xóa sản phẩm "{productToDelete?.name}"? Hành động này không thể hoàn tác.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Hủy</AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Xóa
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
};

export default Products;