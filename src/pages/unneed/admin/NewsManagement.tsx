import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Plus, Search, Eye, Edit, Trash2, ImageIcon, Upload, X, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface NewsArticle {
  id: string;
  title: string;
  content: string;
  image?: string;
  publishDate: string;
  endDate: string;
  status: "active" | "inactive" | "scheduled";
}

const mockNews: NewsArticle[] = [
  {
    id: "1",
    title: "Khám phá hương vị bánh bao truyền thống",
    content: "Bánh bao Thọ Phát với công thức gia truyền từ năm 1987, mang đến hương vị đậm đà, thơm ngon cho từng chiếc bánh. Với nguyên liệu tươi ngon được chọn lọc kỹ càng, chúng tôi cam kết mang đến cho bạn những chiếc bánh bao chất lượng nhất.",
    image: "/placeholder.svg",
    publishDate: "2025-12-20",
    endDate: "2025-12-31",
    status: "active",
  },
  {
    id: "2",
    title: "Chương trình khuyến mãi Giáng sinh 2025",
    content: "Mừng Giáng sinh, Thọ Phát giảm giá 20% tất cả sản phẩm. Chương trình áp dụng từ 18/12 đến 25/12/2025. Nhanh tay đặt hàng để nhận ưu đãi hấp dẫn!",
    image: "/placeholder.svg",
    publishDate: "2025-12-18",
    endDate: "2025-12-25",
    status: "active",
  },
  {
    id: "3",
    title: "Ra mắt sản phẩm bánh bao nhân mới",
    content: "Thọ Phát tự hào giới thiệu bánh bao nhân trứng muối tan chảy - sự kết hợp hoàn hảo giữa vỏ bánh mềm mịn và nhân trứng muối béo ngậy.",
    publishDate: "2025-12-28",
    endDate: "2026-01-15",
    status: "scheduled",
  },
  {
    id: "4",
    title: "Tin tức cũ đã hết hạn",
    content: "Đây là tin tức đã hết hạn hiển thị.",
    image: "/placeholder.svg",
    publishDate: "2025-11-01",
    endDate: "2025-11-30",
    status: "inactive",
  },
];

const statusConfig = {
  active: { label: "Đang hiển thị", className: "bg-green-100 text-green-700 border-green-200" },
  inactive: { label: "Ngừng hiển thị", className: "bg-gray-100 text-gray-700 border-gray-200" },
  scheduled: { label: "Lên lịch", className: "bg-blue-100 text-blue-700 border-blue-200" },
};

const NewsManagement = () => {
  const { toast } = useToast();
  const [news, setNews] = useState<NewsArticle[]>(mockNews);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [editImagePreview, setEditImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    publishDate: "",
    endDate: "",
    status: "active" as NewsArticle["status"],
  });
  const [editFormData, setEditFormData] = useState({
    title: "",
    content: "",
    publishDate: "",
    endDate: "",
    status: "active" as NewsArticle["status"],
  });

  const filteredNews = news.filter((article) => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || article.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
  };

  const handleCreateNews = () => {
    if (!formData.title || !formData.content || !formData.publishDate || !formData.endDate) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin bắt buộc",
        variant: "destructive",
      });
      return;
    }

    const newArticle: NewsArticle = {
      id: Date.now().toString(),
      title: formData.title,
      content: formData.content,
      image: imagePreview || undefined,
      publishDate: formData.publishDate,
      endDate: formData.endDate,
      status: formData.status,
    };

    setNews((prev) => [newArticle, ...prev]);
    setIsCreateDialogOpen(false);
    setFormData({ title: "", content: "", publishDate: "", endDate: "", status: "active" });
    setImagePreview(null);

    toast({
      title: "Thành công",
      description: "Đã tạo bài viết mới thành công",
    });
  };

  const handleViewNews = (article: NewsArticle) => {
    setSelectedArticle(article);
    setIsViewDialogOpen(true);
  };

  const handleEditNews = (article: NewsArticle) => {
    setSelectedArticle(article);
    setEditFormData({
      title: article.title,
      content: article.content,
      publishDate: article.publishDate,
      endDate: article.endDate,
      status: article.status,
    });
    setEditImagePreview(article.image || null);
    setIsEditDialogOpen(true);
  };

  const handleEditImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveEditImage = () => {
    setEditImagePreview(null);
  };

  const handleUpdateNews = () => {
    if (!selectedArticle) return;

    if (!editFormData.title || !editFormData.content || !editFormData.publishDate || !editFormData.endDate) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin bắt buộc",
        variant: "destructive",
      });
      return;
    }

    setNews((prev) =>
      prev.map((article) =>
        article.id === selectedArticle.id
          ? {
              ...article,
              title: editFormData.title,
              content: editFormData.content,
              image: editImagePreview || undefined,
              publishDate: editFormData.publishDate,
              endDate: editFormData.endDate,
              status: editFormData.status,
            }
          : article
      )
    );

    setIsEditDialogOpen(false);
    setSelectedArticle(null);

    toast({
      title: "Thành công",
      description: "Đã cập nhật bài viết thành công",
    });
  };

  const handleDeleteNews = (id: string) => {
    setNews((prev) => prev.filter((article) => article.id !== id));
    toast({
      title: "Đã xóa",
      description: "Bài viết đã được xóa thành công",
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Quản lý tin tức</h1>
          <Button
            className="bg-primary hover:bg-primary/90"
            onClick={() => setIsCreateDialogOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Tạo bài viết mới
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm theo tiêu đề bài viết"
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
              <SelectItem value="active">Đang hiển thị</SelectItem>
              <SelectItem value="inactive">Ngừng hiển thị</SelectItem>
              <SelectItem value="scheduled">Lên lịch</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="bg-background rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold w-24">Ảnh</TableHead>
                <TableHead className="font-semibold">Tiêu đề</TableHead>
                <TableHead className="font-semibold">Ngày bắt đầu</TableHead>
                <TableHead className="font-semibold">Ngày kết thúc</TableHead>
                <TableHead className="font-semibold">Trạng thái</TableHead>
                <TableHead className="font-semibold text-center">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredNews.map((article) => (
                <TableRow key={article.id}>
                  <TableCell>
                    <div className="w-20 h-14 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                      {article.image ? (
                        <img
                          src={article.image}
                          alt={article.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ImageIcon className="w-6 h-6 text-muted-foreground" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium line-clamp-2">{article.title}</p>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{article.publishDate}</TableCell>
                  <TableCell className="text-muted-foreground">{article.endDate}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={statusConfig[article.status].className}>
                      {statusConfig[article.status].label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleViewNews(article)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleEditNews(article)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => handleDeleteNews(article.id)}
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

      {/* Create News Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Tạo bài viết mới</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Image Upload */}
            <div className="space-y-2">
              <Label>Ảnh hiển thị trang chủ</Label>
              {imagePreview ? (
                <div className="relative w-full h-48 rounded-lg overflow-hidden border">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8"
                    onClick={handleRemoveImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-10 h-10 mb-3 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Nhấn để tải ảnh lên
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      PNG, JPG, WEBP (tối đa 5MB)
                    </p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>
              )}
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">
                Tiêu đề <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                placeholder="Nhập tiêu đề bài viết"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              />
            </div>

            {/* Content */}
            <div className="space-y-2">
              <Label htmlFor="content">
                Nội dung chi tiết <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="content"
                placeholder="Nhập nội dung chi tiết của bài viết..."
                value={formData.content}
                onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
                className="min-h-[200px] resize-y"
              />
              <p className="text-xs text-muted-foreground">
                Nội dung sẽ được hiển thị khi người dùng xem chi tiết bài viết
              </p>
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="publishDate">
                  Ngày bắt đầu <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="publishDate"
                    type="date"
                    className="pl-10"
                    value={formData.publishDate}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, publishDate: e.target.value }))
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">
                  Ngày kết thúc <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="endDate"
                    type="date"
                    className="pl-10"
                    value={formData.endDate}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, endDate: e.target.value }))
                    }
                  />
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label>Trạng thái</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, status: value as NewsArticle["status"] }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Đang hiển thị</SelectItem>
                  <SelectItem value="inactive">Ngừng hiển thị</SelectItem>
                  <SelectItem value="scheduled">Lên lịch</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Hủy
              </Button>
              <Button onClick={handleCreateNews}>Tạo bài viết</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View News Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chi tiết bài viết</DialogTitle>
          </DialogHeader>

          {selectedArticle && (
            <div className="space-y-6">
              {/* Image */}
              {selectedArticle.image && (
                <div className="w-full h-48 rounded-lg overflow-hidden bg-muted">
                  <img
                    src={selectedArticle.image}
                    alt={selectedArticle.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Title */}
              <div>
                <Label className="text-muted-foreground">Tiêu đề</Label>
                <p className="font-semibold text-lg">{selectedArticle.title}</p>
              </div>

              {/* Content */}
              <div>
                <Label className="text-muted-foreground">Nội dung</Label>
                <p className="mt-1 text-foreground whitespace-pre-wrap">{selectedArticle.content}</p>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Ngày bắt đầu</Label>
                  <p className="font-medium">{selectedArticle.publishDate}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Ngày kết thúc</Label>
                  <p className="font-medium">{selectedArticle.endDate}</p>
                </div>
              </div>

              {/* Status */}
              <div>
                <Label className="text-muted-foreground">Trạng thái</Label>
                <div className="mt-1">
                  <Badge variant="outline" className={statusConfig[selectedArticle.status].className}>
                    {statusConfig[selectedArticle.status].label}
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit News Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa bài viết</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Image Upload */}
            <div className="space-y-2">
              <Label>Ảnh hiển thị trang chủ</Label>
              {editImagePreview ? (
                <div className="relative w-full h-48 rounded-lg overflow-hidden border">
                  <img
                    src={editImagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8"
                    onClick={handleRemoveEditImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-10 h-10 mb-3 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Nhấn để tải ảnh lên
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      PNG, JPG, WEBP (tối đa 5MB)
                    </p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleEditImageUpload}
                  />
                </label>
              )}
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="edit-title">
                Tiêu đề <span className="text-destructive">*</span>
              </Label>
              <Input
                id="edit-title"
                placeholder="Nhập tiêu đề bài viết"
                value={editFormData.title}
                onChange={(e) => setEditFormData((prev) => ({ ...prev, title: e.target.value }))}
              />
            </div>

            {/* Content */}
            <div className="space-y-2">
              <Label htmlFor="edit-content">
                Nội dung chi tiết <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="edit-content"
                placeholder="Nhập nội dung chi tiết của bài viết..."
                value={editFormData.content}
                onChange={(e) => setEditFormData((prev) => ({ ...prev, content: e.target.value }))}
                className="min-h-[200px] resize-y"
              />
              <p className="text-xs text-muted-foreground">
                Nội dung sẽ được hiển thị khi người dùng xem chi tiết bài viết
              </p>
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-publishDate">
                  Ngày bắt đầu <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="edit-publishDate"
                    type="date"
                    className="pl-10"
                    value={editFormData.publishDate}
                    onChange={(e) =>
                      setEditFormData((prev) => ({ ...prev, publishDate: e.target.value }))
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-endDate">
                  Ngày kết thúc <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="edit-endDate"
                    type="date"
                    className="pl-10"
                    value={editFormData.endDate}
                    onChange={(e) =>
                      setEditFormData((prev) => ({ ...prev, endDate: e.target.value }))
                    }
                  />
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label>Trạng thái</Label>
              <Select
                value={editFormData.status}
                onValueChange={(value) =>
                  setEditFormData((prev) => ({ ...prev, status: value as NewsArticle["status"] }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Đang hiển thị</SelectItem>
                  <SelectItem value="inactive">Ngừng hiển thị</SelectItem>
                  <SelectItem value="scheduled">Lên lịch</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Hủy
              </Button>
              <Button onClick={handleUpdateNews}>Lưu thay đổi</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default NewsManagement;
