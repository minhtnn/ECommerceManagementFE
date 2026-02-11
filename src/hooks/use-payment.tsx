import { paymentApi } from "@/apis/payment.api";
import envConfig from "@/schemas/config.schema";
import { TCancelPaymentRequest } from "@/schemas/payment-method.schema";
import { EPaymentMethodStatus } from "@/types/enums/payment-method-status.enum";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { toast } from "sonner";

interface UsePaymentMethodParams {
  page?: number;
  size?: number;
  sortBy?: string;
  isAsc?: boolean;
  code?: string;
  name?: string;
  status?: EPaymentMethodStatus;
}

interface UseBrandPaymentMethodParams {
  page?: number;
  size?: number;
  sortBy?: string;
  isAsc?: boolean;
  code?: string;
  name?: string;
  status?: boolean;
}

export const usePayment = () => {
  const queryClient = useQueryClient();
  const getPaymentMethods = (params: UsePaymentMethodParams = {}) => {
    const {
      page = params.page || 1,
      size = params.size || 10,
      sortBy = params.sortBy || "createdDate",
      isAsc = params.isAsc || true,
      code = params.code || null,
      name = params.name || null,
      status = params.status || null,
    } = params;
    return useQuery({
      queryKey: [
        "paymentMethods",
        { page, size, sortBy, isAsc, code, name, status },
      ],

      queryFn: async () =>
        await paymentApi.getPaymentMethods({
          page: page,
          size: size,
          sortBy: sortBy,
          isAsc: isAsc,
          code: code,
          name: name,
          status: status,
        }),
      placeholderData: keepPreviousData,
      staleTime: 5 * 1000,
    });
  };
  const getPaymentMethodById = (id: string) => {
    return useSuspenseQuery({
      queryKey: ["paymentMethod", id],
      queryFn: async () => await paymentApi.getPaymentMethodById(id),
      staleTime: 5 * 1000,
    });
  };
  const createPaymentMethod = () =>
    useMutation({
      mutationFn: (data: FormData) => paymentApi.createPaymentMethod(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["paymentMethods"] });
      },
    });
  const updatePaymentMethod = (id: string) =>
    useMutation({
      mutationFn: (data: FormData) => paymentApi.updatePaymentMethod(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["paymentMethods"] });
        queryClient.invalidateQueries({ queryKey: ["paymentMethod", id] });
      },
    });
  //#endregion

  // #region Brand payment method hooks
  const getBrandPaymentMethods = (params: UseBrandPaymentMethodParams = {}) => {
    const {
      page = params.page || 1,
      size = params.size || 10,
      sortBy = params.sortBy || "createdDate",
      isAsc = params.isAsc || true,
      code = params.code || null,
      name = params.name || null,
      status = params.status || null,
    } = params;
    return useQuery({
      queryKey: [
        "brandPaymentMethods",
        { page, size, sortBy, isAsc, code, name, status },
      ],

      queryFn: async () =>
        await paymentApi.getBrandPaymentMethods({
          page: page,
          size: size,
          sortBy: sortBy,
          isAsc: isAsc,
          code: code,
          name: name,
          status: status,
        }),
      placeholderData: keepPreviousData,
      staleTime: 5 * 1000,
      retry: false,
    });
  };
  const getBrandPaymentMethodById = (id: string) => {
    return useSuspenseQuery({
      queryKey: ["brandPaymentMethods", id],
      queryFn: async () => await paymentApi.getBrandPaymentMethodById(id),
      staleTime: 5 * 1000,
    });
  };

  const createBrandPaymentMethod = () =>
    useMutation({
      mutationFn: (data: FormData) => paymentApi.createBrandPaymentMethod(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["brandPaymentMethods"] });
      },
    });
  const updateBrandPaymentMethod = (id: string) =>
    useMutation({
      mutationFn: (data: FormData) =>
        paymentApi.updateBrandPaymentMethod(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["brandPaymentMethods"] });
        queryClient.invalidateQueries({
          queryKey: ["brandPaymentMethods", id],
        });
      },
    });
  const getBrandPublicPaymentMethods = () => {
    return useQuery({
      queryKey: ["brand-public-payment-methods", envConfig.BRAND_CODE],
      queryFn: () =>
        paymentApi.getBrandPublicPaymentMethods({
          brandCode: envConfig.BRAND_CODE,
        }),
      staleTime: 5 * 60 * 1000,
      retry: 1,
    });
  };

  // ⭐ Get payment status - NOT a query, just return the function
  const getPaymentStatus = async (orderId: string) => {
    return await paymentApi.getPaymentStatus(orderId);
  };

  // Cancel payment
  const cancelPayment = () => {
    return useMutation({
      mutationFn: ({
        orderId,
        data,
      }: {
        orderId: string;
        data?: TCancelPaymentRequest;
      }) => paymentApi.cancelPayment(orderId, data),
      onSuccess: () => {
        toast.success("Đã hủy thanh toán");
      },
      onError: (error: any) => {
        toast.error(
          error?.response?.data?.message || "Không thể hủy thanh toán",
        );
      },
    });
  };

  return {
    getPaymentMethods,
    getPaymentMethodById,
    createPaymentMethod,
    updatePaymentMethod,

    getBrandPaymentMethods,
    getBrandPaymentMethodById,
    createBrandPaymentMethod,
    updateBrandPaymentMethod,

    getBrandPublicPaymentMethods,
    getPaymentStatus,
    cancelPayment,
  };
};
