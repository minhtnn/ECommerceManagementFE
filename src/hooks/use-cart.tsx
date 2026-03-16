import { endCustomerCartApi } from "@/apis/cart.api";
import {
  TCreateEndCustomerCartRequest,
  TUpdateEndCustomerCartRequest
} from "@/schemas/cart.schema";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

export const useCart = () => {
  const queryClient = useQueryClient();

  const getEndCustomerCart = ({
    isAllowFetch = true,
  }: { isAllowFetch?: boolean } = {}) => {
    return useQuery({
      queryKey: ["end-customer-cart"],
      queryFn: () => endCustomerCartApi.getEndCustomerCart(),
      placeholderData: keepPreviousData,
      staleTime: 5 * 1000,
      retry: false,
      enabled: isAllowFetch,
    });
  };

  const createEndCustomerCart = () => {
    return useMutation({
      mutationFn: (data: TCreateEndCustomerCartRequest) =>
        endCustomerCartApi.createEndCustomerCart(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["end-customer-cart"] });
        toast.success("Tạo giỏ hàng thành công!");
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || "Không thể tạo giỏ hàng");
      },
    });
  };

  const updateEndCustomerCart = () => {
    return useMutation({
      mutationFn: (data: TUpdateEndCustomerCartRequest) =>
        endCustomerCartApi.updateEndCustomerCart(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["end-customer-cart"] });
      },
      onError: (error: any) => {
        toast.error(
          error?.response?.data?.message || "Không thể cập nhật giỏ hàng",
        );
      },
    });
  };

  return {
    getEndCustomerCart,
    createEndCustomerCart,
    updateEndCustomerCart,
  };
};
