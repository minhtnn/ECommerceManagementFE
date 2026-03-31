import { customerApi } from "@/apis/customer.api";
import {
  TCreateCustomerAddress,
  TCreateCustomerConsultant,
  TUpdateCustomerAddress,
} from "@/schemas/customer.schema";
import { ECustomerStatus } from "@/types/enums/customer-status";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";

interface UseCustomerParams {
  page?: number;
  size?: number;
  sortBy?: string;
  isAsc?: boolean;
  name?: string;
  status?: ECustomerStatus;
}

export const useCustomer = () => {
  const queryClient = useQueryClient();
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
      staleTime: 5 * 1000,
    });
  };
  const getCustomerAddresses = (params) => {
    return useQuery({
      queryKey: ["customerAddresses"],
      queryFn: async () => await customerApi.getCustomerAddresses(),
      staleTime: 5 * 1000,
    });
  };
  const getCustomerAddressById = (id: string, timeZone: string) => {
    return useSuspenseQuery({
      queryKey: ["customerAddresses", id],
      queryFn: async () =>
        await customerApi.getCustomerAddressById(id, timeZone),
      staleTime: 5 * 1000,
    });
  };

  const createCustomerAddress = () =>
    useMutation({
      mutationFn: (data: TCreateCustomerAddress) =>
        customerApi.createCustomerAddress(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["customerAddresses"] });
      },
    });

  const updateCustomerAddress = () =>
    useMutation({
      mutationFn: ({
        id,
        data,
      }: {
        id: string;
        data: TUpdateCustomerAddress;
      }) => customerApi.updateCustomerAddress(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["customerAddresses"] });
        queryClient.invalidateQueries({ queryKey: ["customerAddress"] });
      },
    });

  const createCustomerConsultant = () =>
    useMutation({
      mutationFn: (data: TCreateCustomerConsultant) =>
        customerApi.createCustomerConsultant(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["customerConsultant"] });
      },
    });

  return {
    getCustomers,
    getCustomerAddresses,
    getCustomerAddressById,
    createCustomerAddress,
    updateCustomerAddress,
    createCustomerConsultant,
  };
};
