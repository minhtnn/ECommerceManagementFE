import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, Upload } from "lucide-react";
import { toast } from "sonner";
import { useCategories } from "@/contexts/CategoriesContext";

const CategoryCreate = () => {
  const navigate = useNavigate();
  const { addCategory, categories } = useCategories();
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    description: "",
    type: "parent" as "parent" | "child",
    order: 0,
    status: true,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.code || !formData.name) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }

    // Generate new ID
    const newId = String(Math.max(...categories.map(c => parseInt(c.id)), 0) + 1);

    addCategory({
      id: newId,
      code: formData.code,
      name: formData.name,
      description: formData.description,
      type: formData.type,
      order: formData.order,
      status: formData.status ? "active" : "inactive",
      image: imagePreview || undefined,
    });

    toast.success("Tạo danh mục thành công!");
    navigate("/admin/categories");
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Back button */}
        <Button
          variant="default"
          size="sm"
          onClick={() => navigate("/admin/categories")}
          className="gap-1 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <ChevronLeft className="h-4 w-4" />
          Quay lại trang trước
        </Button>

        {/* Title */}
        <h1 className="text-2xl font-bold">Tạo danh mục mới</h1>

        {/* Form */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left side - Image upload */}
          <div className="bg-background rounded-lg border p-6">
            <div className="flex flex-col items-center justify-center min-h-[300px] border-2 border-dashed border-muted-foreground/25 rounded-lg p-8">
              {imagePreview ? (
                <div className="relative w-full max-w-[300px]">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-auto rounded-lg"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-4 w-full"
                    onClick={() => setImagePreview(null)}
                  >
                    Xóa ảnh
                  </Button>
                </div>
              ) : (
                <>
                  <Upload className="h-10 w-10 text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground mb-4">Chưa chọn hình ảnh</p>
                  <label htmlFor="image-upload">
                    <Button type="button" variant="outline" asChild>
                      <span>
                        <Upload className="h-4 w-4 mr-2" />
                        Tải lên
                      </span>
                    </Button>
                  </label>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </>
              )}
            </div>
          </div>

          {/* Right side - Category info */}
          <div className="bg-background rounded-lg border p-6 space-y-6">
            {/* Header with status toggle */}
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Thông tin danh mục</h2>
              <div className="flex items-center gap-2">
                <Label htmlFor="status" className="text-sm text-muted-foreground">
                  Trạng thái
                </Label>
                <Switch
                  id="status"
                  checked={formData.status}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, status: checked })
                  }
                />
              </div>
            </div>

            {/* Category code */}
            <div className="space-y-2">
              <Label htmlFor="code">
                Mã danh mục <span className="text-destructive">*</span>
              </Label>
              <Input
                id="code"
                placeholder="Nhập mã danh mục"
                value={formData.code}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value })
                }
              />
            </div>

            {/* Category name */}
            <div className="space-y-2">
              <Label htmlFor="name">
                Tên danh mục <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                placeholder="Nhập tên danh mục"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Mô tả</Label>
              <Textarea
                id="description"
                placeholder="Mô tả danh mục"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
              />
            </div>

            {/* Category type and order */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>
                  Loại danh mục <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: "parent" | "child") =>
                    setFormData({ ...formData, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn loại danh mục" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="parent">Danh mục cha</SelectItem>
                    <SelectItem value="child">Danh mục con</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="order">
                  Thứ tự hiển thị <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="order"
                  type="number"
                  min="0"
                  value={formData.order}
                  onChange={(e) =>
                    setFormData({ ...formData, order: parseInt(e.target.value) || 0 })
                  }
                />
              </div>
            </div>

            {/* Submit button */}
            <div className="flex justify-end pt-4">
              <Button type="submit" className="bg-primary hover:bg-primary/90">
                Lưu danh mục
              </Button>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default CategoryCreate;