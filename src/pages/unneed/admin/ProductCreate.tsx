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
import { ChevronLeft, Upload, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { useProducts } from "@/contexts/ProductsContext";
import { useCategories } from "@/contexts/CategoriesContext";

const ProductCreate = () => {
  const navigate = useNavigate();
  const { addProduct, products } = useProducts();
  const { getActiveCategories } = useCategories();
  const activeCategories = getActiveCategories();
  
  const [formData, setFormData] = useState({
    code: "",
    sku: "",
    name: "",
    price: 0,
    originalPrice: undefined as number | undefined,
    description: "",
    notes: "",
    categoryId: "",
    order: 0,
    stock: 0,
    unit: "cái",
    hasVariants: false,
    isFeatured: false,
    isOnSale: false,
  });
  const [images, setImages] = useState<string[]>([]);
  const [productOptions, setProductOptions] = useState<string[]>([]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        if (file.size > 5 * 1024 * 1024) {
          toast.error("File không được vượt quá 5MB");
          return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
          setImages((prev) => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.code || !formData.name || !formData.categoryId) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }

    // Generate new ID
    const newId = String(Math.max(...products.map(p => parseInt(p.id)), 0) + 1);

    addProduct({
      id: newId,
      code: formData.code,
      name: formData.name,
      description: formData.description,
      categoryId: formData.categoryId,
      price: formData.price,
      originalPrice: formData.originalPrice,
      stock: formData.stock,
      unit: formData.unit,
      image: images[0],
      images: images,
      hasVariants: formData.hasVariants,
      isFeatured: formData.isFeatured,
      isOnSale: formData.isOnSale,
      status: "active",
      order: formData.order,
    });

    toast.success("Tạo sản phẩm thành công!");
    navigate("/admin/products");
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Back button */}
        <Button
          variant="default"
          size="sm"
          onClick={() => navigate("/admin/products")}
          className="gap-1 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <ChevronLeft className="h-4 w-4" />
          Quay lại trang trước
        </Button>

        {/* Title */}
        <h1 className="text-2xl font-bold">Tạo sản phẩm mới</h1>

        {/* Form */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left side - Basic info (2 cols) */}
          <div className="lg:col-span-2 bg-background rounded-lg border p-6 space-y-6">
            {/* Header with variants toggle */}
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Thông tin cơ bản</h2>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Label htmlFor="isFeatured" className="text-sm text-muted-foreground">
                    Nổi bật
                  </Label>
                  <Switch
                    id="isFeatured"
                    checked={formData.isFeatured}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, isFeatured: checked })
                    }
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="isOnSale" className="text-sm text-muted-foreground">
                    Giảm giá
                  </Label>
                  <Switch
                    id="isOnSale"
                    checked={formData.isOnSale}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, isOnSale: checked })
                    }
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="hasVariants" className="text-sm text-muted-foreground">
                    Có biến thể
                  </Label>
                  <Switch
                    id="hasVariants"
                    checked={formData.hasVariants}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, hasVariants: checked })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Product code and SKU */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="code">
                  Mã sản phẩm <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="code"
                  placeholder="Nhập mã sản phẩm"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sku">
                  Mã SKU
                </Label>
                <Input
                  id="sku"
                  placeholder="Nhập mã SKU sản phẩm"
                  value={formData.sku}
                  onChange={(e) =>
                    setFormData({ ...formData, sku: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Product name */}
            <div className="space-y-2">
              <Label htmlFor="name">
                Tên Sản Phẩm <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                placeholder="Nhập tên sản phẩm"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            {/* Price and Original Price */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">
                  Giá bán <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: parseInt(e.target.value) || 0 })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="originalPrice">
                  Giá gốc (nếu có giảm giá)
                </Label>
                <Input
                  id="originalPrice"
                  type="number"
                  min="0"
                  value={formData.originalPrice || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, originalPrice: e.target.value ? parseInt(e.target.value) : undefined })
                  }
                />
              </div>
            </div>

            {/* Stock and Unit */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="stock">
                  Tồn kho
                </Label>
                <Input
                  id="stock"
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={(e) =>
                    setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unit">
                  Đơn vị
                </Label>
                <Input
                  id="unit"
                  placeholder="cái, kg, hộp..."
                  value={formData.unit}
                  onChange={(e) =>
                    setFormData({ ...formData, unit: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Description and Notes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="description">
                  Mô Tả <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="description"
                  placeholder="Nhập mô tả sản phẩm"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Ghi chú</Label>
                <Textarea
                  id="notes"
                  placeholder="Nhập ghi chú cho sản phẩm"
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  rows={4}
                />
              </div>
            </div>

            {/* Category and Order */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>
                  Danh mục <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.categoryId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, categoryId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn danh mục" />
                  </SelectTrigger>
                  <SelectContent>
                    {activeCategories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="order">
                  Thứ tự hiển thị
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
          </div>

          {/* Right side - Images and Options (1 col) */}
          <div className="space-y-6">
            {/* Product Images */}
            <div className="bg-background rounded-lg border p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Ảnh Sản Phẩm</h2>
                <label htmlFor="image-upload">
                  <Button type="button" variant="outline" size="sm" asChild>
                    <span>
                      <Upload className="h-4 w-4 mr-2" />
                      Tải lên ảnh
                    </span>
                  </Button>
                </label>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/jpeg,image/png,image/gif"
                  multiple
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </div>

              {images.length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                  {images.map((img, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={img}
                        alt={`Product ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center min-h-[150px] border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
                  <Upload className="h-8 w-8 text-muted-foreground/50 mb-2" />
                  <p className="text-sm text-muted-foreground text-center">
                    Kéo thả thêm ảnh hoặc click để chọn
                  </p>
                  <p className="text-xs text-muted-foreground/70 text-center mt-1">
                    Hỗ trợ: JPG, PNG, GIF (tối đa 5MB mỗi file)
                  </p>
                </div>
              )}
            </div>

            {/* Product Options */}
            <div className="bg-background rounded-lg border p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Tùy chọn sản phẩm</h2>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => toast.info("Tính năng đang phát triển")}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Thêm
                </Button>
              </div>

              {productOptions.length > 0 ? (
                <div className="space-y-2">
                  {productOptions.map((option, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-muted rounded"
                    >
                      <span className="text-sm">{option}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() =>
                          setProductOptions((prev) =>
                            prev.filter((_, i) => i !== index)
                          )
                        }
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Chưa có tùy chọn sản phẩm nào được thêm.
                </p>
              )}
            </div>

            {/* Submit button */}
            <div className="flex justify-end">
              <Button type="submit" className="bg-primary hover:bg-primary/90 px-8">
                Tạo
              </Button>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default ProductCreate;