import { Button } from "@/components/ui/button";
import { PATH_BRAND_DASHBOARD } from "@/routes/path";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ProductCategoryTable from "./components/ProductCategoryTable";

const ProductCategoryListPage = () => {
  const navigate = useNavigate();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Quản lý danh mục</h1>
        <Button
          className="bg-primary hover:bg-primary/90"
          onClick={() => navigate(PATH_BRAND_DASHBOARD.productCategory.create)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Thêm danh mục mới
        </Button>
      </div>
      <ProductCategoryTable />
    </div>
  );
};

export default ProductCategoryListPage;
