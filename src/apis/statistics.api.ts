import { apiRequest } from "@/lib/http";
import { TGetAllProductsStaticByBrandResponse, TGetAllPromotionRulesStaticByBrandResponse } from "@/schemas/statistic.schema";
import { BaseResponse, PaginationResponse } from "@/types/response.type";
import { API_SUFFIX } from "./util.api";

const getAllPromotionRulesStaticByBrand = async (params?: any) =>
    await apiRequest.ecommerceCoffee.get<BaseResponse<PaginationResponse<TGetAllPromotionRulesStaticByBrandResponse>>>
        (`${API_SUFFIX.STATISTIC_API}/promotion-rules`, { params: params });

const getAllProductsStaticByBrand = async (params?: any) =>
    await apiRequest.ecommerceCoffee.get<BaseResponse<PaginationResponse<TGetAllProductsStaticByBrandResponse>>>
        (`${API_SUFFIX.STATISTIC_API}/products`, { params: params });

export const statisticApi = {
    getAllPromotionRulesStaticByBrand,
    getAllProductsStaticByBrand,
};