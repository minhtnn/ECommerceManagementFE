import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, ImageIcon } from "lucide-react";

interface BrandInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  brandCode: string;
  logo?: string;
}

const BrandSettings = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [brandInfo, setBrandInfo] = useState<BrandInfo>({
    name: "Thọ Phát",
    email: "thophat@gmail.com",
    phone: "0914155344",
    address: "78-80 Nguyễn Tri Phương, P.7, Q.5, TP. HCM.",
    brandCode: "THOPHAT",
  });

  const handleSave = () => {
    setIsEditing(false);
    // Save logic here
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Thương hiệu của tôi</h1>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Logo Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Ảnh đại diện</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="w-48 h-48 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full flex items-center justify-center border-4 border-primary/20">
                {brandInfo.logo ? (
                  <img
                    src={brandInfo.logo}
                    alt="Brand logo"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <div className="text-center">
                    <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-primary-foreground font-bold text-2xl">TP</span>
                    </div>
                    <p className="text-sm text-primary font-semibold">Since 1987</p>
                  </div>
                )}
              </div>
              {isEditing && (
                <Button variant="outline" className="mt-4">
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Thay đổi ảnh
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Info Section */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Thông tin cơ bản</CardTitle>
              {!isEditing ? (
                <Button
                  variant="outline"
                  className="text-primary border-primary hover:bg-primary hover:text-primary-foreground"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Chỉnh sửa
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Hủy
                  </Button>
                  <Button onClick={handleSave}>Lưu</Button>
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Tên thương hiệu</Label>
                <Input
                  value={brandInfo.name}
                  onChange={(e) => setBrandInfo({ ...brandInfo, name: e.target.value })}
                  disabled={!isEditing}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={brandInfo.email}
                    onChange={(e) => setBrandInfo({ ...brandInfo, email: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Điện thoại</Label>
                  <Input
                    type="tel"
                    value={brandInfo.phone}
                    onChange={(e) => setBrandInfo({ ...brandInfo, phone: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Địa chỉ</Label>
                  <Input
                    value={brandInfo.address}
                    onChange={(e) => setBrandInfo({ ...brandInfo, address: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Mã Thương Hiệu</Label>
                  <Input
                    value={brandInfo.brandCode}
                    onChange={(e) => setBrandInfo({ ...brandInfo, brandCode: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default BrandSettings;
