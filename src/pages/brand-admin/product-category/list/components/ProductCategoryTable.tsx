import { DataTable } from "@/components/table/data-table";
import { useProductCategory } from "@/hooks/use-product-category";
import { useQueryParams } from "@/hooks/use-query-params";
import { handleApiError } from "@/lib/error";
import { columns } from "./product-category-table/ProductCategoryColumn";
import { EProductStatus } from "@/types/enums/product-status.enum";

const ProductCategoryTable = () => {
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
      { id: "isLeafOnly", value: null },
      { id: "status", value: null },
    ],
  });

  const { getSuspendProductCategories } = useProductCategory();

  const nameFilter = String(filter.find((f) => f.id === "name")?.value ?? "");
  const codeFilter = String(filter.find((f) => f.id === "code")?.value ?? "");

  const isLeafOnlyFilter = filter.find((f) => f.id === "isLeafOnly")?.value;
  const isLeafOnlyValue =
    isLeafOnlyFilter === "" || isLeafOnlyFilter === null
      ? null
      : isLeafOnlyFilter === "true";

  const statusFilter = filter.find((f) => f.id === "status")?.value;
  const statusValue =
    statusFilter === "" || statusFilter === null ? null : Number(statusFilter);

  const { data, isLoading, isError, error } = getSuspendProductCategories({
    page: currentPage,
    size: pageSize,
    sortBy,
    isAsc,
    code: codeFilter,
    name: nameFilter,
    isLeafOnly: isLeafOnlyValue,
    status: statusValue,
  });

  if (isError && error) {
    handleApiError(error);
  }

  const searchValues = filter.map((f) => ({
    ...f,
    searchPlaceholder:
      f.id === "name"
        ? "Tìm kiếm theo tên danh mục"
        : f.id === "code"
          ? "Tìm kiếm theo mã danh mục"
          : f.id === "isLeafOnly"
            ? "Lọc theo loại"
            : f.id === "status"
              ? "Trạng thái"
              : "",
    isSelect: f.id === "isLeafOnly" || f.id === "status",
    options:
      f.id === "isLeafOnly"
        ? [
            { label: "Tất cả", value: null },
            { label: "Có thể gán sản phẩm", value: "true" },
            { label: "Không thể gán sản phẩm", value: "false" },
          ]
        : f.id === "status"
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

  const items = data.data.data.items || [];
  const totalItems = data.data.data.total || 0;
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

export default ProductCategoryTable;
