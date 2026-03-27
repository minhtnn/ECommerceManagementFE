import { productApi } from "@/apis/product.api";
import envConfig from "@/schemas/config.schema";
import { EProductStatus } from "@/types/enums/product-status.enum";
import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";

interface UseProductParams {
  page?: number;
  size?: number;
  sortBy?: string;
  isAsc?: boolean;
  code?: string;
  name?: string;
  status?: EProductStatus;
  allowFetch?: boolean;
}

export const useProduct = () => {
  const queryClient = useQueryClient();
  const getSuspendProducts = (params: UseProductParams = {}) => {
    const {
      page = params.page || 1,
      size = params.size || 10,
      sortBy = params.sortBy || "createdDate",
      isAsc = params.isAsc || true,
      code = params.code,
      name = params.name,
      status = params.status,
    } = params;
    return useSuspenseQuery({
      queryKey: [
        "products",
        {
          page,
          size,
          sortBy,
          isAsc,
        },
      ],
      queryFn: () =>
        productApi.getProducts({
          page: page,
          size: size,
          sortBy: sortBy,
          isAsc: isAsc,
        }),
    });
  };

  const getProducts = (params: UseProductParams = {}) => {
    const {
      page = params.page || 1,
      size = params.size || 10,
      sortBy = params.sortBy || "createdDate",
      isAsc = params.isAsc || true,
      code = params.code,
      name = params.name,
      status = params.status,
    } = params;
    return useQuery({
      queryKey: [
        "products",
        {
          page,
          size,
          sortBy,
          isAsc,
        },
      ],
      queryFn: () =>
        productApi.getProducts({
          page: page,
          size: size,
          sortBy: sortBy,
          isAsc: isAsc,
        }),
      enabled: params.allowFetch ?? true,
    });
  };

  const getProductById = (id: string, timeZone: string) => {
    return useSuspenseQuery({
      queryKey: ["product", id],
      queryFn: () => productApi.getProductById(id, timeZone),
    });
  };

  const getPublicProductById = (id: string, timeZone: string) => {
    return useQuery({
      queryKey: ["productPublic", id],
      queryFn: async () => productApi.getPublicProductById(id, timeZone),
      enabled: !!id,
      staleTime: 0,
    });
  };

  const createProduct = () =>
    useMutation({
      mutationFn: (data: FormData) => productApi.createProduct(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["products"] });
      },
    });

  const updateProduct = () =>
    useMutation({
      mutationFn: ({ id, data }: { id: string; data: FormData }) =>
        productApi.updateProduct(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["products"] });
        queryClient.invalidateQueries({ queryKey: ["product"] });
      },
    });

  return {
    getProducts,
    getSuspendProducts,
    getProductById,
    getPublicProductById,
    createProduct,
    updateProduct,
  };
};
