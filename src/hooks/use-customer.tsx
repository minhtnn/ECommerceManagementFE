import { customerApi } from "@/apis/customer.api";
import { ECustomerStatus } from "@/types/enums/customer-status";
import { keepPreviousData, useQuery, useSuspenseQuery } from "@tanstack/react-query";

interface UseCustomerParams {
  page?: number;
  size?: number;
  sortBy?: string;
  isAsc?: boolean;
  name?: string;
  status?: ECustomerStatus;
}

export const useCustomer = () => {
  // const queryClient = useQueryClient();
  const getCustomers = (params: UseCustomerParams = {}) => {
    const {
      page = params.page || 1,
      size = params.size || 10,
      sortBy = params.sortBy || "createdDate",
      isAsc = params.isAsc || true,
      name = params.name || null,
      status = params.status || null,
    } = params;
    return useSuspenseQuery({
      queryKey: [
        "customers",
        {
          page,
          size,
          sortBy,
          isAsc,
          name,
          status,
        },
      ],
      queryFn: () =>
        customerApi.getCustomers({
          page: page,
          size: size,
          sortBy: sortBy,
          isAsc: isAsc,
          name: name,
          status: status,
        }),
      // placeholderData: keepPreviousData,
      staleTime: 5 * 1000,
    });
  };
  return {
    getCustomers,
  };
};
