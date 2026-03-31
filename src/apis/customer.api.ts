import { apiRequest } from "@/lib/http";
import { BaseResponse, PaginationResponse } from "@/types/response.type";
import { API_SUFFIX } from "./util.api";
import { TCreateCustomerAddress, TCreateCustomerConsultant, TCustomerAddressDetailResponse, TCustomerAddressListResponse, TCustomerListResponse, TUpdateCustomerAddress } from "@/schemas/customer.schema";
import envConfig from "@/schemas/config.schema";

const getCustomers = async (params?: any) =>
    await apiRequest.ecommerceCoffee.get<BaseResponse<PaginationResponse<TCustomerListResponse>>>(`${API_SUFFIX.CUSTOMER_API}`, { params: params });

const getCustomerAddresses = async (params?: any) =>
    await apiRequest.ecommerceCoffee.get<BaseResponse<TCustomerAddressListResponse[]>>(`${API_SUFFIX.CUSTOMER_API}/addresses`, { params: params });

const getCustomerAddressById = async (id: string, timeZone: string) =>
    await apiRequest.ecommerceCoffee.get<BaseResponse<TCustomerAddressDetailResponse>>(`${API_SUFFIX.CUSTOMER_API}/addresses/${id}?timeZone=${timeZone}`);

const createCustomerAddress = async (data: TCreateCustomerAddress) =>
    await apiRequest.ecommerceCoffee.post<BaseResponse<string>>(
        `${API_SUFFIX.CUSTOMER_API}/addresses`,
        data
    );

const updateCustomerAddress = async (id: string, data: TUpdateCustomerAddress) =>
    await apiRequest.ecommerceCoffee.patch<BaseResponse<string>>(
        `${API_SUFFIX.CUSTOMER_API}/addresses/${id}`,
        data
    );

const createCustomerConsultant = async (data: TCreateCustomerConsultant) =>
    await apiRequest.ecommerceCoffee.post<BaseResponse<string>>(
        `${API_SUFFIX.CUSTOMER_API}/consultant/email`,
        {...data, brandCode: envConfig.BRAND_CODE}
    );

export const customerApi = {
    getCustomers,
    getCustomerAddresses,
    getCustomerAddressById,
    createCustomerAddress,
    updateCustomerAddress,
    createCustomerConsultant,
};