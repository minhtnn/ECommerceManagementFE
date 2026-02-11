// hooks/use-home-menu.ts
import { menuProductApi } from "@/apis/menu-product.api";
import envConfig from "@/schemas/config.schema";
import { useSuspenseQuery } from "@tanstack/react-query";

export const useHomeMenu = () => {
  const getHomeMenuData = () => {
    return useSuspenseQuery({
      queryKey: ["home-menu-data"],
      queryFn: async () => {
        // Lấy toàn bộ menu không filter category
        return menuProductApi.getPublicMenuProducts(
          envConfig.BRAND_CODE,
          {}
        );
      },
    //   placeholderData: keepPreviousData,
    });
  };

  return {
    getHomeMenuData,
  };
};