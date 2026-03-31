import { apiRequest } from "@/lib/http";
import {
    TPromotionRuleDetail,
    TPromotionRuleList,
    TCreatePromotionRule,
    TUpdatePromotionRule,
    TApplicablePromotionRuleList,
} from "@/schemas/promotion-rule.schema";
import { BaseResponse, PaginationResponse } from "@/types/response.type";
import { API_SUFFIX } from "./util.api";

export interface GetPromotionRulesParams {
    page?: number;
    size?: number;
    sortBy?: string;
    isAsc?: boolean;
    code?: string;
    name?: string;
    status?: number;
    timeZone?: string;
}

const getPromotionRules = async (params?: GetPromotionRulesParams) =>
    await apiRequest.ecommerceCoffee.get<BaseResponse<PaginationResponse<TPromotionRuleList>>>(
        `${API_SUFFIX.PROMOTION_RULE_API}`,
        { params }
    );

const getPromotionRuleById = async (id: string, timeZone: string) =>
    await apiRequest.ecommerceCoffee.get<BaseResponse<TPromotionRuleDetail>>(
        `${API_SUFFIX.PROMOTION_RULE_API}/${id}?timeZone=${timeZone}`
    );

const getApplicablePromotionRules = async (brandCode: string) =>
    await apiRequest.ecommerceCoffee.get<BaseResponse<TApplicablePromotionRuleList[]>>(
        `${API_SUFFIX.PROMOTION_RULE_API}/${brandCode}/applicable`
    );

const createPromotionRule = async (data: TCreatePromotionRule) =>
    await apiRequest.ecommerceCoffee.post<BaseResponse<string>>(
        `${API_SUFFIX.PROMOTION_RULE_API}`,
        data
    );

const updatePromotionRule = async (id: string, data: TUpdatePromotionRule) =>
    await apiRequest.ecommerceCoffee.patch<BaseResponse<string>>(
        `${API_SUFFIX.PROMOTION_RULE_API}/${id}`,
        data
    );



export const promotionRuleApi = {
    getPromotionRules,
    getPromotionRuleById,
    createPromotionRule,
    updatePromotionRule,
    getApplicablePromotionRules,
};