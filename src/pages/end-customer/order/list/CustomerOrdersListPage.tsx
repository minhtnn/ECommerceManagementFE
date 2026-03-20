import { Badge } from "@/components/ui/badge";
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
import { useOrder } from "@/hooks/use-order";
import { EndCustomerAccountLayout } from "@/layouts/EndCustomerAccountLayout";
import { cn, formatPrice } from "@/lib/utils";
import { PATH_END_CUSTOMER, PATH_GUEST } from "@/routes/path";
import {
  EOrderStatus,
  getOrderStatusConfig,
} from "@/types/enums/order-status.enum";
import {
  EPaymentStatus,
  getPaymentStatusConfig,
} from "@/types/enums/payment-status.enum";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Eye, Loader2, Package, Search, ShoppingBag } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { OrderCard } from "./components/OrderCard";

// Helper functions (same as before)

const EndCustomerOrdersListPage = () => {
  const navigate = useNavigate();
  const { getCustomerOrders } = useOrder();
  // Filters
  const [searchKeyword, setSearchKeyword] = useState("");
  const [orderStatus, setOrderStatus] = useState<EOrderStatus | undefined>();
  const [paymentStatus, setPaymentStatus] = useState<
    EPaymentStatus | undefined
  >();

  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchKeyword);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchKeyword]);

  // Infinite query
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = getCustomerOrders({
    pageSize: 20,
    searchKeyword: debouncedSearch,
    orderStatus,
    paymentStatus,
  });

  // Flatten all pages
  const allOrders =
    data?.pages?.flatMap((page) => page?.data?.data?.items || []) || [];
  // Infinite scroll observer
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

    console.log(allOrders);
    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <EndCustomerAccountLayout breadcrumbs={[{ label: "Đơn hàng của bạn" }]}>
      {/* Header */}
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
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Tìm theo mã đơn hàng..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Order Status Filter */}
            <Select
              value={orderStatus?.toString() || "all"}
              onValueChange={(value) =>
                setOrderStatus(value === "all" ? undefined : Number(value))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Trạng thái đơn hàng" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả đơn hàng</SelectItem>
                <SelectItem value={EOrderStatus.WaitingPayment.toString()}>
                  Chờ thanh toán
                </SelectItem>
                <SelectItem value={EOrderStatus.Pending.toString()}>
                  Chờ xác nhận
                </SelectItem>
                <SelectItem value={EOrderStatus.Processing.toString()}>
                  Đang xử lý
                </SelectItem>
                <SelectItem value={EOrderStatus.Shipped.toString()}>
                  Đang giao hàng
                </SelectItem>
                <SelectItem value={EOrderStatus.Delivered.toString()}>
                  Đã giao hàng
                </SelectItem>
                <SelectItem value={EOrderStatus.Cancelled.toString()}>
                  Đã hủy
                </SelectItem>
              </SelectContent>
            </Select>

            {/* Payment Status Filter */}
            <Select
              value={paymentStatus?.toString() || "all"}
              onValueChange={(value) =>
                setPaymentStatus(value === "all" ? undefined : Number(value))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Trạng thái thanh toán" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả thanh toán</SelectItem>
                <SelectItem value={EPaymentStatus.Pending.toString()}>
                  Chờ thanh toán
                </SelectItem>
                <SelectItem value={EPaymentStatus.Processing.toString()}>
                  Đang xử lý
                </SelectItem>
                <SelectItem value={EPaymentStatus.Completed.toString()}>
                  Thành công
                </SelectItem>
                <SelectItem value={EPaymentStatus.Failed.toString()}>
                  Thất bại
                </SelectItem>
                <SelectItem value={EPaymentStatus.Expired.toString()}>
                  Hết hạn
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
        <div className="space-y-4">
          {allOrders.map((order) => {
            return <OrderCard order={order} />;
          })}

          {/* Loading more indicator */}
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
