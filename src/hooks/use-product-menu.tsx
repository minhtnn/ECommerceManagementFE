import { menuProductApi } from "@/apis/menu-product.api";
import envConfig from "@/schemas/config.schema";
import { useInfiniteQuery } from "@tanstack/react-query";

interface UsePublicProductMenuParams {
  page?: number;
  size?: number;
  categoryId?: string;
  productsSortBy?: string;
  productsIsAsc?: boolean;
  productName?: string;
}

export const useProductMenu = () => {
  const getPublicProductMenu = (
    params: Omit<UsePublicProductMenuParams, "page"> = {},
  ) => {
    return useInfiniteQuery({
      queryKey: ["public-product-menu", params],
      queryFn: ({ pageParam }) =>
        menuProductApi.getPublicMenuProducts({
          ...params,
          page: pageParam,
        }),
      initialPageParam: 1,
      getNextPageParam: (lastPage) => {
        const pagination = lastPage.data?.data?.products;
        if (!pagination) return undefined;
        const { page, totalPages } = pagination;
        return page < totalPages ? page + 1 : undefined;
      },
      staleTime: 2 * 60 * 1000,
    });
  };

  return {
    getPublicProductMenu,
  };
};
