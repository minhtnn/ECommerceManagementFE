import { apiRequest } from "@/lib/http";
import { BaseResponse, PaginationResponse } from "@/types/response.type";
import { API_SUFFIX } from "./util.api";
import { TBrandPaymentMethodDetailResponse, TBrandPaymentMethodListResponse, TPaymentMethodDetailResponse, TPaymentMethodListResponse } from "@/schemas/payment-method.schema";

//#region System payment method APIs
const getPaymentMethods = async (params?: any) =>
    await apiRequest.ecommerceCoffee.get<BaseResponse<PaginationResponse<TPaymentMethodListResponse>>>(`${API_SUFFIX.PAYMENT_METHOD_API}`, { params: params });

const getPaymentMethodById = async (id: string) =>
    await apiRequest.ecommerceCoffee.get<BaseResponse<TPaymentMethodDetailResponse>>(`${API_SUFFIX.PAYMENT_METHOD_API}/${id}`);

const createPaymentMethod = async (data: FormData) =>
    await apiRequest.ecommerceCoffee.post<BaseResponse<string>>(
        `${API_SUFFIX.PAYMENT_METHOD_API}`,
        data
    );

const updatePaymentMethod = async (id: string, data: FormData) =>
    await apiRequest.ecommerceCoffee.patch<BaseResponse<string>>(
        `${API_SUFFIX.PAYMENT_METHOD_API}/${id}`,
        data
    );
//#endregion


const getBrandPaymentMethods = async (params?: any) =>
    await apiRequest.ecommerceCoffee.get<BaseResponse<PaginationResponse<TBrandPaymentMethodListResponse>>>(`${API_SUFFIX.PAYMENT_METHOD_API}/brand`, { params: params });

const getBrandPaymentMethodById = async (id: string) =>
    await apiRequest.ecommerceCoffee.get<BaseResponse<TBrandPaymentMethodDetailResponse>>(`${API_SUFFIX.PAYMENT_METHOD_API}/brand/${id}`);
const createBrandPaymentMethod = async (data: FormData) =>
    await apiRequest.ecommerceCoffee.post<BaseResponse<string>>(
        `${API_SUFFIX.PAYMENT_METHOD_API}/brand`,
        data
    );

const updateBrandPaymentMethod = async (id: string, data: FormData) =>
    await apiRequest.ecommerceCoffee.patch<BaseResponse<string>>(
        `${API_SUFFIX.PAYMENT_METHOD_API}/brand/${id}`,
        data
    );

export const paymentApi = {
    getPaymentMethods,
    getPaymentMethodById,
    createPaymentMethod,
    updatePaymentMethod,

    getBrandPaymentMethods,
    getBrandPaymentMethodById,
    createBrandPaymentMethod,
    updateBrandPaymentMethod
};