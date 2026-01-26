import { handleApiError } from "@/lib/error";
import { useQueryParams } from "@/hooks/use-query-params";
import { DataTable } from "@/components/table/data-table";
import { useBrand } from "@/hooks/use-brand";
import { TBrandListResponse } from "@/schemas/brand.schema";
import { columns } from "./brand-table/BrandColumn";
import { EBrandStatus } from "@/types/enums/brand-status.enum";
import { PageLoader } from "@/components/LoadingScreen";

const BrandTable = () => {
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
      { id: "code", value: null },
      { id: "name", value: null },
      { id: "status", value: null },
    ],
  });

  const { getBrands } = useBrand();

  const codeFilter = String(filter.find((f) => f.id === "code")?.value ?? "");
  const nameFilter = String(filter.find((f) => f.id === "name")?.value ?? "");
  const statusFilter = filter.find((f) => f.id === "status")?.value;
  const statusValue =
    statusFilter === "" || statusFilter === null ? null : Number(statusFilter);

  const { data, isLoading, isError, error } = getBrands({
    page: currentPage,
    size: pageSize,
    sortBy,
    isAsc,
    code: codeFilter,
    name: nameFilter,
    status: statusValue,
  });

  if (isLoading) return <PageLoader />;

  if (isError && error) {
    handleApiError(error);
  }

  const brands = data?.data?.data;

  const searchValues = filter.map((f) => ({
    ...f,
    searchPlaceholder:
      f.id === "code"
        ? "Tìm kiếm theo mã thương hiệu"
        : f.id === "name"
        ? "Tìm kiếm theo tên thương hiệu"
        : f.id === "status"
        ? "Trạng thái"
        : "",
    isSelect: f.id === "status",
    options:
      f.id === "status"
        ? [
            { label: "Tất cả", value: null },
            { label: "Hoạt động", value: EBrandStatus.Active.toString() },
            { label: "Không hoạt động", value: EBrandStatus.Inactive.toString() },
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
      data={brands.items || []}
      totalItems={brands.total}
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

export default BrandTable;
