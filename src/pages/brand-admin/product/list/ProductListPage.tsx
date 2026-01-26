import { Button } from "@/components/ui/button";
import { PATH_BRAND_DASHBOARD } from "@/routes/path";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ProductTable from "./components/ProductTable";

const ProductListPage = () => {
  const navigate = useNavigate();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Quản lý sản phẩm</h1>
        <Button
          className="bg-primary hover:bg-primary/90"
          onClick={() => navigate(PATH_BRAND_DASHBOARD.product.create)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Thêm sản phẩm mới
        </Button>
      </div>
      <ProductTable />
    </div>
  );
};

export default ProductListPage;
