import { DataTable } from "@/components/table/data-table";
import { usePayment } from "@/hooks/use-payment";
import { useQueryParams } from "@/hooks/use-query-params";
import { handleApiError } from "@/lib/error";
import { columns } from "./columns/BrandPaymentMethodColumn";
import { PageLoader } from "@/components/LoadingScreen";

const BrandPaymentMethodTable = () => {
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
    defaultSortBy: "displayOrder",
    defaultFilter: [
      { id: "name", value: "" },
      { id: "code", value: null },
      { id: "status", value: null },
    ],
  });

  const { getBrandPaymentMethods } = usePayment();

  const nameFilter = String(filter.find((f) => f.id === "name")?.value ?? "");
  const codeFilter =
    (filter.find((f) => f.id === "code")?.value as string) || null;
  const statusFilter = (filter.find((f) => f.id === "status")?.value as boolean | null) || null;

  const { data, isLoading, isError, error } = getBrandPaymentMethods({
    page: currentPage,
    size: pageSize,
    sortBy,
    isAsc,
    name: nameFilter,
    code: codeFilter,
    status: statusFilter,
  });

  if (isError && error) {
    handleApiError(error);
  }
  if(isLoading){
    return <PageLoader/>
  }

  const searchValues = filter.map((f) => ({
    ...f,
    searchPlaceholder:
      f.id === "name"
        ? "Tìm kiếm theo tên phương thức"
        : f.id === "code"
          ? "Tìm kiếm theo mã phương thức"
          : "",
    isSelect: f.id === "status",
    options:
      f.id === "status"
        ? [
            { label: "Tất cả", value: null },
            { label: "Hoạt động", value: "true" },
            { label: "Không hoạt động", value: "false" },
          ]
        : undefined,
  }));

  const sortValue = {
    id: sortBy,
    desc: !isAsc,
  };

  const brandPaymentMethods = data.data.data;
  const totalItems = data.data.data.total || 0;
  return (
    <DataTable
      columns={columns}
      data={brandPaymentMethods.items || []}
      totalItems={totalItems}
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
export default BrandPaymentMethodTable;