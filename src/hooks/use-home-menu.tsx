import { menuProductApi } from "@/apis/menu-product.api";
import envConfig from "@/schemas/config.schema";
import { useSuspenseQuery } from "@tanstack/react-query";

export const useHomeMenu = () => {
  const getHomeMenuData = () => {
    return useSuspenseQuery({
      queryKey: ["home-menu-data"],
      queryFn: async () => {
        return menuProductApi.getPublicMenuProducts(
          envConfig.BRAND_CODE,
          {}
        );
      },
    });
  };

  return {
    getHomeMenuData,
  };
};