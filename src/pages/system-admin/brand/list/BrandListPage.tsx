import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import BrandTable from "./components/BrandTable";
import { useNavigate } from "react-router-dom";
import { PATH_SYSTEM_ADMIN_DASHBOARD } from "@/routes/path";

const BrandListPage = () => {
  const navigate = useNavigate();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Quản lý thương hiệu</h1>
        <Button
          className="bg-primary hover:bg-primary/90"
          onClick={() => navigate(PATH_SYSTEM_ADMIN_DASHBOARD.brand.create)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Thêm thương hiệu mới
        </Button>
      </div>
      <BrandTable />
    </div>
  );
};

export default BrandListPage;
