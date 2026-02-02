import { DataTable } from "@/components/table/data-table";
import { useQueryParams } from "@/hooks/use-query-params";
import { handleApiError } from "@/lib/error";
import { columns } from "./customer-table/CustomerColumn";
import { ECustomerStatus } from "@/types/enums/customer-status";
import { useCustomer } from "@/hooks/use-customer";

const EndCustomerTable = () => {
  const {
    currentPage,
    pageSize,
    sortBy,
    isAsc,
    setSort,
    setPage,
    setPageSize,
    filter,
    setFilter,
  } = useQueryParams({
    defaultSortBy: "fullName",
    defaultFilter: [
      { id: "fullName", value: null },
      { id: "status", value: null },
    ],
  });

  const { getCustomers } = useCustomer();

  const nameFilter = String(filter.find((f) => f.id === "fullName")?.value ?? "");
  const statusFilter = filter.find((f) => f.id === "status")?.value;
  const statusValue =
    statusFilter === "" || statusFilter === null ? null : Number(statusFilter);

  const { data, isLoading, isError, error } = getCustomers({
    page: currentPage,
    size: pageSize,
    sortBy,
    isAsc,
    name: nameFilter,
    status: statusValue,
  });

  if (isError && error) {
    handleApiError(error);
  }
  var customers = data?.data?.data;

  const searchValues = filter.map((f) => ({
    ...f,
    searchPlaceholder: f.id === "fullName" ? "Tìm kiếm theo tên khách hàng" : "",
    isSelect: f.id === "status",
    options:
      f.id === "status"
        ? [
            { label: "Tất cả", value: null },
            { label: "Hoạt động", value: ECustomerStatus.Active.toString() },
            {
              label: "Không hoạt động",
              value: ECustomerStatus.Inactive.toString(),
            },
            {
              label: "Đang chờ xác minh email ",
              value: ECustomerStatus.EmailVerifyPending.toString(),
            },
          ]
        : undefined,
  }));

  const sortValue = {
    id: sortBy,
    desc: !isAsc,
  };

  return (
    <DataTable
      columns={columns}
      data={customers?.items || []}
      totalItems={customers.total || 0}
      currentPage={currentPage}
      pageSize={pageSize}
      onPageChange={setPage}
      onPageSizeChange={setPageSize}
      isLoading={isLoading}
      onSearchChange={setFilter}
      searchValues={searchValues}
      sortValues={[sortValue]}
      onSortChange={(newSort) => {
        setSort(newSort[0].id, !newSort[0].desc);
      }}
    />
  );
};

export default EndCustomerTable;
