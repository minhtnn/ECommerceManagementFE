import EndCustomerTable from "./components/CustomerTable";

const EndCustomerListPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Quản lý khách hàng</h1>
      </div>
      <EndCustomerTable />
    </div>
  );
};

export default EndCustomerListPage;
