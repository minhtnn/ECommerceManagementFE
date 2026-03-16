import { useProduct } from "@/hooks/use-product";
import { useQueryParams } from "@/hooks/use-query-params";
import { handleApiError } from "@/lib/error";
import { columns } from "./product-table/ProductColumn";
import { DataTable } from "@/components/table/data-table";
import { EProductStatus } from "@/types/enums/product-status.enum";

const ProductTable = () => {
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
    defaultSortBy: "name",
    defaultFilter: [
      { id: "name", value: "" },
      { id: "code", value: null },
      { id: "status", value: null },
    ],
  });

  const { getSuspendProducts } = useProduct();

  const nameFilter = String(filter.find((f) => f.id === "name")?.value ?? "");
  const codeFilter =
    (filter.find((f) => f.id === "code")?.value as string) || null;
  const statusFilter = filter.find((f) => f.id === "status")?.value;
  const statusValue =
    statusFilter === "" || statusFilter === null ? null : Number(statusFilter);

  const { data, isLoading, isError, error } = getSuspendProducts({
    page: currentPage,
    size: pageSize,
    sortBy,
    isAsc,
    code: codeFilter,
    name: nameFilter,
    status: statusValue
  });

  if (isError && error) {
    handleApiError(error);
  }

  const items = data.data.data.items ?? [];
  const totalItems = data.data.data.total ?? 0;

  const searchValues = filter.map((f) => ({
    ...f,
    searchPlaceholder:
      f.id === "name"
        ? "Tìm kiếm theo tên thương hiệu"
        : f.id === "code"
          ? "Tìm kiếm theo mã thương hiệu"
          : "",
    isSelect: f.id === "status",
    options:
      f.id === "status"
        ? [
            { label: "Tất cả", value: null },
            { label: "Hoạt động", value: EProductStatus.Active.toString() },
            {
              label: "Không hoạt động",
              value: EProductStatus.Inactive.toString(),
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
      data={items}
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

export default ProductTable;
