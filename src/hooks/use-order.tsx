import { orderApi } from "@/apis/order.api";
import {
  TCreateOrderRequest,
  TUpdateOrderRequest,
} from "@/schemas/order.schema";
import { EOrderStatus } from "@/types/enums/order-status.enum";
import { EPaymentStatus } from "@/types/enums/payment-status.enum";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

interface UseBrandOrderParams {
  page?: number;
  size?: number;
  sortBy?: string;
  isAsc?: boolean;
  searchKeyword?: string;
  orderStatus?: EOrderStatus;
  paymentStatus?: EPaymentStatus;
  fromDate?: Date;
  toDate?: Date;
  allowFetch?: boolean;
}

interface UseCustomerOrderParams {
  pageSize?: number;
  searchKeyword?: string;
  orderStatus?: EOrderStatus;
  paymentStatus?: EPaymentStatus;
}

export const useOrder = () => {
  const queryClient = useQueryClient();

  const getBrandOrders = (params: UseBrandOrderParams = {}) => {
    return useQuery({
      queryKey: ["brand-orders", params],
      queryFn: () => orderApi.getBrandOrders(params),
    });
  };

  const getCustomerOrders = (params: UseCustomerOrderParams = {}) => {
    return useInfiniteQuery({
      queryKey: ["customer-orders", params],
      queryFn: ({ pageParam }) =>
        orderApi.getCustomerOrders({
          pageSize: params.pageSize || 20,
          cursor: pageParam,
          searchKeyword: params.searchKeyword,
          orderStatus: params.orderStatus,
          paymentStatus: params.paymentStatus,
        }),
      initialPageParam: undefined as string | undefined,
      getNextPageParam: (lastPage) => {
        const data = lastPage?.data?.data;
        return data?.hasMore ? data.nextCursor : undefined;
      },
      staleTime: 2 * 60 * 1000,
    });
  };

  const createOrder = () => {
    return useMutation({
      mutationFn: (data: TCreateOrderRequest) => orderApi.createOrder(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["end-customer-cart"] });
        queryClient.invalidateQueries({ queryKey: ["customer-orders"] });
      },
      onError: (error: any) => {
        const errorMessage =
          error?.response?.data?.message || "Không thể tạo đơn hàng";
        toast.error(errorMessage);
      },
    });
  };

  const getBrandOrderById = (orderId: string) => {
    return useQuery({
      queryKey: ["brand-order", orderId],
      queryFn: () => orderApi.getBrandOrderById(orderId),
      enabled: !!orderId,
      staleTime: 30 * 1000,
      retry: 1,
    });
  };

  const getCustomerOrderById = (orderId: string) => {
    return useQuery({
      queryKey: ["customer-order", orderId],
      queryFn: () => orderApi.getCustomerOrderById(orderId),
      enabled: !!orderId,
      staleTime: 30 * 1000,
      retry: 1,
    });
  };

  const updateOrder = () => {
    return useMutation({
      mutationFn: ({ id, data }: { id: string; data: TUpdateOrderRequest }) =>
        orderApi.updateOrder(id, data),
      onSuccess: (response, variables) => {
        toast.success("Cập nhật đơn hàng thành công!");

        // Invalidate specific order queries
        queryClient.invalidateQueries({
          queryKey: ["customer-order", variables.id],
        });
        queryClient.invalidateQueries({
          queryKey: ["brand-order", variables.id],
        });
        
        // Invalidate list queries
        queryClient.invalidateQueries({ 
          queryKey: ["customer-orders"],
          exact: false
        });
        queryClient.invalidateQueries({ 
          queryKey: ["brand-orders"],
          exact: false
        });
      },
      onError: (error: any) => {
        const errorMessage =
          error?.response?.data?.message ||
          error?.message ||
          "Không thể cập nhật đơn hàng";
        toast.error(errorMessage);
      },
    });
  };

  const getPaymentLink = () => {
  return useMutation({
    mutationFn: (orderId: string) => orderApi.getPaymentLink(orderId),
    onSuccess: (response) => {
      const data = response.data.data;
      if (data.paymentUrl) {
        // Redirect to payment gateway
        window.location.href = data.paymentUrl;
      }
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Không thể lấy link thanh toán";
      toast.error(errorMessage);
    },
  });
};

  return {
    getBrandOrders,
    getCustomerOrders,
    createOrder,
    getBrandOrderById,
    getCustomerOrderById,
    updateOrder,
    getPaymentLink,
  };
};