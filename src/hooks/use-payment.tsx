import { paymentApi } from "@/apis/payment.api";
import { EPaymentMethodStatus } from "@/types/enums/payment-method-status.enum";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";

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
  //#region System payment method hooks
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
      retry: false
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
      mutationFn: (data: FormData) => paymentApi.updateBrandPaymentMethod(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["brandPaymentMethods"] });
        queryClient.invalidateQueries({ queryKey: ["brandPaymentMethods", id] });
      },
    });
  // #endregion
  return {
    getPaymentMethods,
    getPaymentMethodById,
    createPaymentMethod,
    updatePaymentMethod,

    getBrandPaymentMethods,
    getBrandPaymentMethodById,
    createBrandPaymentMethod,
    updateBrandPaymentMethod,
  };
};
