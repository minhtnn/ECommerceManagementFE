import { menuProductApi } from "@/apis/menu-product.api";
import envConfig from "@/schemas/config.schema";
import { keepPreviousData, useSuspenseQuery } from "@tanstack/react-query";

interface UseProductMenuParams {
  categoryId?: string;
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
    const { categoryId } = params;
    return useSuspenseQuery({
      queryKey: ["public-product-menu", categoryId],
      queryFn: async () => {
        const apiParams = categoryId ? { categoryId } : {};

        return menuProductApi.getPublicMenuProducts(
          envConfig.BRAND_CODE,
          apiParams
        );
      },
      ...keepPreviousData,
    });
  };

  return {
    getProductMenu,
    getPublicProductMenu,
  };
};
