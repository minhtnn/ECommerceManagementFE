  import { DataTable } from "@/components/table/data-table";
import { useProductCategory } from "@/hooks/use-product-category";
import { useQueryParams } from "@/hooks/use-query-params";
import { handleApiError } from "@/lib/error";
import { columns } from "./product-category-table/ProductCategoryColumn";

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
      ],
    });

    const { getProductCategories } = useProductCategory();

    const nameFilter = String(filter.find((f) => f.id === "name")?.value ?? "");
    const codeFilter =
      (filter.find((f) => f.id === "code")?.value as string) || null;

    const { data, isLoading, isError, error } = getProductCategories({
      page: currentPage,
      size: pageSize,
      sortBy,
      isAsc,
    });

    if (isError && error) {
      handleApiError(error);
    }

    const searchValues = filter.map((f) => ({
      ...f,
      searchPlaceholder:
        f.id === "name"
          ? "Tìm kiếm theo tên thương hiệu"
          : f.id === "code"
          ? "Tìm kiếm theo mã thương hiệu"
          : "",
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
