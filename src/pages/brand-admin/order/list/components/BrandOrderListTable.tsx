import { DataTable } from "@/components/table/data-table";
import { useOrder } from "@/hooks/use-order";
import { useQueryParams } from "@/hooks/use-query-params";
import { handleApiError } from "@/lib/error";
import { EOrderStatus } from "@/types/enums/order-status.enum";
import { EPaymentStatus } from "@/types/enums/payment-status.enum";
import { columns } from "./columns/columns";

export const BrandOrderListTable = () => {
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
      { id: "searchKeyword", value: "" },
      { id: "orderStatus", value: "" },
      { id: "paymentStatus", value: "" },
      { id: "fromDate", value: null },
      { id: "toDate", value: null },
    ],
  });

  const { getBrandOrders } = useOrder();

  // Lấy giá trị filter
  const searchKeywordFilter = String(
    filter.find((f) => f.id === "searchKeyword")?.value ?? "",
  );

  const orderStatusFilter = filter.find((f) => f.id === "orderStatus")?.value;
  const orderStatusValue =
    orderStatusFilter === "" || orderStatusFilter === null
      ? undefined
      : (Number(orderStatusFilter) as EOrderStatus);

  const paymentStatusFilter = filter.find(
    (f) => f.id === "paymentStatus",
  )?.value;
  const paymentStatusValue =
    paymentStatusFilter === "" || paymentStatusFilter === null
      ? undefined
      : (Number(paymentStatusFilter) as EPaymentStatus);

  const fromDateFilter = filter.find((f) => f.id === "fromDate")?.value;
  const fromDateValue = fromDateFilter ? new Date(fromDateFilter as string) : undefined;

  const toDateFilter = filter.find((f) => f.id === "toDate")?.value;
  const toDateValue = toDateFilter ? new Date(toDateFilter as string) : undefined;

  const { data, isLoading, isError, error } = getBrandOrders({
    page: currentPage,
    size: pageSize,
    sortBy,
    isAsc,
    searchKeyword: searchKeywordFilter,
    orderStatus: orderStatusValue,
    paymentStatus: paymentStatusValue,
    fromDate: fromDateValue,
    toDate: toDateValue,
  });

  if (isError && error) {
    handleApiError(error);
  }

  const searchValues = filter.map((f) => ({
    ...f,
    searchPlaceholder:
      f.id === "searchKeyword"
        ? "Tìm kiếm theo mã đơn hàng"
        : f.id === "orderStatus"
          ? "Trạng thái đơn hàng"
          : f.id === "paymentStatus"
            ? "Trạng thái thanh toán"
            : f.id === "fromDate"
              ? "Từ ngày"
              : f.id === "toDate"
                ? "Đến ngày"
                : "",
    isSelect: f.id === "orderStatus" || f.id === "paymentStatus",
    isStartDate: f.id === "fromDate",
    isEndDate: f.id === "toDate",
    options:
      f.id === "orderStatus"
        ? [
            { label: "Tất cả", value: null },
            {
              label: "Chờ thanh toán",
              value: EOrderStatus.WaitingPayment.toString(),
            },
            { 
              label: "Chờ xác nhận", 
              value: EOrderStatus.Pending.toString() 
            },
            {
              label: "Đang xử lý",
              value: EOrderStatus.Processing.toString(),
            },
            {
              label: "Đang giao hàng",
              value: EOrderStatus.Shipped.toString(),
            },
            { 
              label: "Đã giao hàng", 
              value: EOrderStatus.Delivered.toString() 
            },
            { 
              label: "Đã hủy", 
              value: EOrderStatus.Cancelled.toString() 
            },
          ]
        : f.id === "paymentStatus"
          ? [
              { label: "Tất cả", value: null },
              {
                label: "Chờ thanh toán",
                value: EPaymentStatus.Pending.toString(),
              },
              {
                label: "Đang xử lý",
                value: EPaymentStatus.Processing.toString(),
              },
              {
                label: "Thanh toán thành công",
                value: EPaymentStatus.Completed.toString(),
              },
              {
                label: "Thanh toán thất bại",
                value: EPaymentStatus.Failed.toString(),
              },
              {
                label: "Hết hạn thanh toán",
                value: EPaymentStatus.Expired.toString(),
              },
            ]
          : undefined,
  }));

  const sortValue = {
    id: sortBy,
    desc: !isAsc,
  };

  const items = data?.data?.data?.items || [];
  const totalItems = data?.data?.data?.total || 0;

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