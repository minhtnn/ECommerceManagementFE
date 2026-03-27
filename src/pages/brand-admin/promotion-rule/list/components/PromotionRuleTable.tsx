import { DataTable } from "@/components/table/data-table";
import { usePromotionRule } from "@/hooks/use-promotion-rule";
import { useQueryParams } from "@/hooks/use-query-params";
import { handleApiError } from "@/lib/error";
import { EPromotionStatus } from "@/types/enums/promotion-status.enum";
import { columns } from "./promotion-rule-table/PromotionRuleColumn";

const PromotionRuleTable = () => {
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
    defaultSortBy: "createdDate",
    defaultFilter: [
      { id: "name", value: "" },
      { id: "code", value: null },
      { id: "status", value: null },
    ],
  });

  const { getPromotionRules } = usePromotionRule();

  const nameFilter = String(filter.find((f) => f.id === "name")?.value ?? "");
  const codeFilter =
    (filter.find((f) => f.id === "code")?.value as string) || null;
  const statusFilter = filter.find((f) => f.id === "status")?.value;
  const statusValue =
    statusFilter === "" || statusFilter === null ? null : Number(statusFilter);

  const { data, isLoading, isError, error } = getPromotionRules({
    page: currentPage,
    size: pageSize,
    sortBy,
    isAsc,
    code: codeFilter ?? undefined,
    name: nameFilter,
    status: statusValue ?? undefined,
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });

  if (isError && error) {
    handleApiError(error);
  }

  const items = data?.data?.data?.items ?? [];
  const totalItems = data?.data?.data?.total ?? 0;

  const searchValues = filter.map((f) => ({
    ...f,
    searchPlaceholder:
      f.id === "name"
        ? "Tìm kiếm theo tên khuyến mãi"
        : f.id === "code"
          ? "Tìm kiếm theo mã khuyến mãi"
          : "",
    isSelect: f.id === "status",
    options:
      f.id === "status"
        ? [
            { label: "Tất cả", value: null },
            { label: "Nháp", value: EPromotionStatus.Draft.toString() },
            { label: "Đang chờ", value: EPromotionStatus.Pending.toString() },
            {
              label: "Đang hoạt động",
              value: EPromotionStatus.Active.toString(),
            },
            { label: "Đã tắt", value: EPromotionStatus.Inactive.toString() },
            { label: "Hết hạn", value: EPromotionStatus.Expired.toString() },
          ]
        : undefined,
  }));

  const sortValue = { id: sortBy, desc: !isAsc };

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
      onSortChange={(newSort) => setSort(newSort[0].id, !newSort[0].desc)}
    />
  );
};

export default PromotionRuleTable;
