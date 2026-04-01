import { statisticApi } from "@/apis/statistics.api";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface UseStatisticParams {
  page?: number;
  size?: number;
  sortBy?: string;
  isAsc?: boolean;
}

export const useStatistic = () => {
  const getAllProductsStaticByBrand = (params: UseStatisticParams = {}) => {
    const {
      page = params.page || 1,
      size = params.size || 10,
      sortBy = params.sortBy || "createdDate",
      isAsc = params.isAsc || true,
    } = params;
    return useQuery({
      queryKey: ["products-sale-statistic", params],
      queryFn: () => statisticApi.getAllProductsStaticByBrand(params),
    });
  };

  const getAllPromotionRulesStaticByBrand = (
    params: UseStatisticParams = {},
  ) => {
    const {
      page = params.page || 1,
      size = params.size || 10,
      sortBy = params.sortBy || "createdDate",
      isAsc = params.isAsc || true,
    } = params;
    return useQuery({
      queryKey: ["promotion-rules-sale-statistic", params],
      queryFn: () => statisticApi.getAllPromotionRulesStaticByBrand(params),
    });
  };
  return {
    getAllProductsStaticByBrand,
    getAllPromotionRulesStaticByBrand,
  };
};
