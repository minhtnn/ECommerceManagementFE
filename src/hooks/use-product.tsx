import { productApi } from "@/apis/product.api";
import envConfig from "@/schemas/config.schema";
import { EProductStatus } from "@/types/enums/product-status.enum";
import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery
} from "@tanstack/react-query";

interface UseProductParams {
  page?: number;
  size?: number;
  sortBy?: string;
  isAsc?: boolean;
  code?: string;
  name?: string;
  status?: EProductStatus;
}

export const useProduct = () => {
  const queryClient = useQueryClient();
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

  const getProductById = (id: string) => {
    return useSuspenseQuery({
      queryKey: ["product", id],
      queryFn: () => productApi.getProductById(id),
    });
  };

  const getPublicProductById = (id: string) => {
    return useQuery({
      queryKey: ["productPublic", id],
      queryFn: async () =>
        productApi.getPublicProductById(envConfig.BRAND_CODE, id),
      enabled: !!id,
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
    getProductById,
    getPublicProductById,
    createProduct,
    updateProduct
  };
};
