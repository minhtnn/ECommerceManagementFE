import { Button } from "@/components/ui/button";
import { PATH_SYSTEM_ADMIN_DASHBOARD } from "@/routes/path";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PaymentMethodTable } from "./components/PaymentMethodTable";

const PaymentMethodsListPage = () => {
  const navigate = useNavigate();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Quản lý phương thức thanh toán</h1>
        <Button
          className="bg-primary hover:bg-primary/90"
          onClick={() => navigate(PATH_SYSTEM_ADMIN_DASHBOARD.paymentMethod.create)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Thêm phương thức thanh toán mới
        </Button>
      </div>
      <PaymentMethodTable />
    </div>
  );
}

export default PaymentMethodsListPage;