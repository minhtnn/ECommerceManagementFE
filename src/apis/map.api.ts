import { apiRequest } from "@/lib/http"
import { TOpenApiProvinceDetailResponse, TOpenApiProvinceListResponse, TOpenApiWardDetailResponse, TOpenApiWardListResponse } from "@/schemas/map.schema"
import { MAP_API_SUFFIX } from "./util.api";

// const getCountries = async (params?: any) =>
//     await apiRequest.mapApiUrl.get<T>

const getProvinces = async (params?: any) =>
    await apiRequest.mapApiUrl.get<TOpenApiProvinceListResponse[]>(`${MAP_API_SUFFIX.PROVINCE_API}`, { params: params });

const getProvinceDetail = async (code: number, params?: any) =>
    await apiRequest.mapApiUrl.get<TOpenApiProvinceDetailResponse>(`${MAP_API_SUFFIX.PROVINCE_API}/${code}`, { params: params });

const getWards = async (params?: any) =>
    await apiRequest.mapApiUrl.get<TOpenApiWardListResponse[]>(`${MAP_API_SUFFIX.WARD_API}`, { params: params });

const getWardDetail = async (code: number, params?: any) =>
    await apiRequest.mapApiUrl.get<TOpenApiWardDetailResponse>(`${MAP_API_SUFFIX.WARD_API}/${code}`, { params: params });
export const mapApi = {
    getProvinces,
    getProvinceDetail,
    getWards,
    getWardDetail
}