import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useQueryParams } from "@/hooks/use-query-params";
import { EndCustomerAccountLayout } from "@/layouts/EndCustomerAccountLayout";
import { PATH_GUEST } from "@/routes/path";
import {
  EOrderStatus,
  getOrderStatusConfig,
} from "@/types/enums/order-status.enum";
import {
  EPaymentStatus,
  getPaymentStatusConfig,
} from "@/types/enums/payment-status.enum";
import { Loader2, Package, Search, ShoppingBag } from "lucide-react";
import { useDebounce } from "use-debounce"
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { OrderCard } from "./components/OrderCard";
import { useOrder } from "@/hooks/use-order";

const EndCustomerOrdersListPage = () => {
  const navigate = useNavigate();
  const { getCustomerOrders } = useOrder();
  const { pageSize, sortBy, isAsc, filter, setFilter } = useQueryParams({
    defaultSortBy: "createdDate",
    defaultIsAsc: false,
    defaultChosenValue: null,
    defaultFilter: [
      { id: "orderStatus", value: null },
      { id: "paymentStatus", value: null },
      { id: "searchKeyword", value: null },
    ],
  });

  // Đọc filter values từ URL
  const searchKeyword = String(
    filter.find((f) => f.id === "searchKeyword")?.value ?? "",
  );
  const orderStatusRaw = filter.find((f) => f.id === "orderStatus")?.value;
  const paymentStatusRaw = filter.find((f) => f.id === "paymentStatus")?.value;

  const orderStatusValue =
    orderStatusRaw === "" || orderStatusRaw === null
      ? null
      : Number(orderStatusRaw);
  const paymentStatusValue =
    paymentStatusRaw === "" || paymentStatusRaw === null
      ? null
      : Number(paymentStatusRaw);

  const [debouncedSearch] = useDebounce(searchKeyword, 400);

  const {
    data,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = getCustomerOrders({
    size: pageSize,
    sortBy,
    isAsc,
    searchKeyword: debouncedSearch,
    orderStatus: orderStatusValue,
    paymentStatus: paymentStatusValue,
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
  });

  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );
    const currentTarget = observerTarget.current;
    if (currentTarget) observer.observe(currentTarget);
    return () => {
      if (currentTarget) observer.unobserve(currentTarget);
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const allOrders =
    data?.pages?.flatMap((page) => page?.data?.data?.items ?? []) ?? [];

  // Helpers để update filter lên URL
  const handleSearchChange = (value: string) => {
    setFilter(
      filter.map((f) => (f.id === "searchKeyword" ? { ...f, value } : f)),
    );
  };

  const handleOrderStatusChange = (value: string) => {
    setFilter(
      filter.map((f) =>
        f.id === "orderStatus"
          ? { ...f, value: value === "all" ? null : value }
          : f,
      ),
    );
  };

  const handlePaymentStatusChange = (value: string) => {
    setFilter(
      filter.map((f) =>
        f.id === "paymentStatus"
          ? { ...f, value: value === "all" ? null : value }
          : f,
      ),
    );
  };

  return (
    <EndCustomerAccountLayout breadcrumbs={[{ label: "Đơn hàng của bạn" }]}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <ShoppingBag className="w-7 h-7" />
          Đơn hàng của bạn
        </h1>
        <p className="text-muted-foreground mt-1">
          Quản lý và theo dõi đơn hàng của bạn
        </p>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardDescription>Tìm kiếm và lọc đơn hàng</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Tìm theo mã đơn hàng..."
                value={searchKeyword}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select
              value={orderStatusValue?.toString() ?? "all"}
              onValueChange={handleOrderStatusChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Trạng thái đơn hàng" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả đơn hàng</SelectItem>
                <SelectItem value={EOrderStatus.WaitingPayment.toString()}>
                  {getOrderStatusConfig(EOrderStatus.WaitingPayment).label}
                </SelectItem>
                <SelectItem value={EOrderStatus.Pending.toString()}>
                  {getOrderStatusConfig(EOrderStatus.Pending).label}
                </SelectItem>
                <SelectItem value={EOrderStatus.Processing.toString()}>
                  {getOrderStatusConfig(EOrderStatus.Processing).label}
                </SelectItem>
                <SelectItem value={EOrderStatus.Shipped.toString()}>
                  {getOrderStatusConfig(EOrderStatus.Shipped).label}
                </SelectItem>
                <SelectItem value={EOrderStatus.Delivered.toString()}>
                  {getOrderStatusConfig(EOrderStatus.Delivered).label}
                </SelectItem>
                <SelectItem value={EOrderStatus.Cancelled.toString()}>
                  {getOrderStatusConfig(EOrderStatus.Cancelled).label}
                </SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={paymentStatusValue?.toString() ?? "all"}
              onValueChange={handlePaymentStatusChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Trạng thái thanh toán" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả thanh toán</SelectItem>
                <SelectItem value={EPaymentStatus.Pending.toString()}>
                  {getPaymentStatusConfig(EPaymentStatus.Pending).label}
                </SelectItem>
                <SelectItem value={EPaymentStatus.Processing.toString()}>
                  {getPaymentStatusConfig(EPaymentStatus.Processing).label}
                </SelectItem>
                <SelectItem value={EPaymentStatus.Completed.toString()}>
                  {getPaymentStatusConfig(EPaymentStatus.Completed).label}
                </SelectItem>
                <SelectItem value={EPaymentStatus.Failed.toString()}>
                  {getPaymentStatusConfig(EPaymentStatus.Failed).label}
                </SelectItem>
                <SelectItem value={EPaymentStatus.Expired.toString()}>
                  {getPaymentStatusConfig(EPaymentStatus.Expired).label}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-24 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : isError ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Có lỗi xảy ra</h3>
            <p className="text-muted-foreground">
              Không thể tải danh sách đơn hàng
            </p>
          </CardContent>
        </Card>
      ) : allOrders.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Chưa có đơn hàng nào</h3>
            <p className="text-muted-foreground mb-4">
              Bạn chưa có đơn hàng nào. Hãy bắt đầu mua sắm!
            </p>
            <Button onClick={() => navigate(PATH_GUEST.products.root)}>
              Khám phá sản phẩm
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4 relative">
          {/* Overlay khi refetch */}
          {isFetching && !isFetchingNextPage && (
            <div className="absolute inset-0 bg-background/60 backdrop-blur-sm z-10 flex items-start justify-center pt-16 rounded-lg">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          )}

          {allOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}

          <div ref={observerTarget} className="py-4">
            {isFetchingNextPage && (
              <div className="flex justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            )}
            {!hasNextPage && allOrders.length > 0 && (
              <p className="text-center text-muted-foreground text-sm">
                Đã hiển thị tất cả đơn hàng
              </p>
            )}
          </div>
        </div>
      )}
    </EndCustomerAccountLayout>
  );
};

export default EndCustomerOrdersListPage;
