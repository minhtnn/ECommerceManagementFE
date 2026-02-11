import { BrandOrderListTable } from "./components/BrandOrderListTable";

const BrandOrderListPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Danh sách đơn hàng</h1>
      </div>
      <BrandOrderListTable />
    </div>
  );
};

export default BrandOrderListPage;
