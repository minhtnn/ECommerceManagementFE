import { apiRequest } from "@/lib/http";
import { TBrandDetailResponse, TBrandListResponse } from "@/schemas/brand.schema";
import { BaseResponse, PaginationResponse } from "@/types/response.type";
import { API_SUFFIX } from "./util.api";

const getBrands = async (params?: any) =>
    await apiRequest.ecommerceCoffee.get<BaseResponse<PaginationResponse<TBrandListResponse>>>(`${API_SUFFIX.BRAND_API}`, { params: params });

const getBrandById = async (id: string, timeZone: string) =>
    await apiRequest.ecommerceCoffee.get<BaseResponse<TBrandDetailResponse>>(`${API_SUFFIX.BRAND_API}/${id}?timeZone=${timeZone}`);

const getBrandDetails = async (timeZone: string) =>
    await apiRequest.ecommerceCoffee.get<BaseResponse<TBrandDetailResponse>>(`${API_SUFFIX.BRAND_API}/details?timeZone=${timeZone}`);

const createBrand = async (data: FormData) =>
    await apiRequest.ecommerceCoffee.post<BaseResponse<string>>(
        `${API_SUFFIX.BRAND_API}`,
        data
    );
const updateBrand = async (id: string, data: FormData) =>
    await apiRequest.ecommerceCoffee.patch<BaseResponse<string>>(
        `${API_SUFFIX.BRAND_API}/${id}`,
        data
    );

export const brandApi = {
    getBrands,
    getBrandById,
    getBrandDetails,
    createBrand,
    updateBrand,
};