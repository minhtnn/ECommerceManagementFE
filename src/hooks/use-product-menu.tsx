import { menuProductApi } from "@/apis/menu-product.api";
import envConfig from "@/schemas/config.schema";
import {
  useInfiniteQuery,
  useSuspenseQuery,
  keepPreviousData,
} from "@tanstack/react-query";

interface UseProductMenuParams {
  categoryId?: string;
  pageSize?: number;
}

export const useProductMenu = () => {
  const getProductMenu = (params: UseProductMenuParams = {}) => {
    const { categoryId } = params;
    return useSuspenseQuery({
      queryKey: ["product-menu", categoryId],
      queryFn: async () => menuProductApi.getMenuProducts({ categoryId }),
      ...keepPreviousData,
    });
  };

  const getPublicProductMenu = (params: UseProductMenuParams = {}) => {
    const { categoryId, pageSize = 20 } = params;

    return useInfiniteQuery({
      queryKey: ["public-product-menu", categoryId, pageSize],
      queryFn: async ({ pageParam }) => {
        const apiParams: any = { pageSize };

        if (categoryId) {
          apiParams.categoryId = categoryId;
        }

        if (pageParam) {
          apiParams.cursor = pageParam;
        }

        return menuProductApi.getPublicMenuProducts(
          envConfig.BRAND_CODE,
          apiParams,
        );
      },
      initialPageParam: undefined as string | undefined,
      getNextPageParam: (lastPage) => {
        const products = lastPage?.data?.data?.products;
        return products?.hasMore ? products.nextCursor : undefined;
      },
      staleTime: 2 * 60 * 1000, // 2 minutes
    });
  };

  return {
    getProductMenu,
    getPublicProductMenu,
  };
};
