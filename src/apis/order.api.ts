import { apiRequest } from "@/lib/http";
import { TBrandOrderByIdResponse, TBrandOrdersResponse, TCreateOrderRequest, TCreateOrderResponse, TCustomerOrderByIdResponse, TCustomerOrdersResponse, TGetPaymentLinkResponse, TUpdateOrderRequest } from "@/schemas/order.schema";
import { BaseResponse, PaginationResponse } from "@/types/response.type";
import { API_SUFFIX } from "./util.api";

const getBrandOrders = async (params?: any) =>
    await apiRequest.ecommerceCoffee.get<BaseResponse<PaginationResponse<TBrandOrdersResponse>>>(`${API_SUFFIX.ORDER_API}/brand`, { params: params });


const getInfiniteCustomerOrders = async (params?: any) =>
    await apiRequest.ecommerceCoffee.get<BaseResponse<PaginationResponse<TCustomerOrdersResponse>>
    >(`${API_SUFFIX.ORDER_API}/customer`, { params: params });

const getBrandOrderById = async (id: string) =>
    await apiRequest.ecommerceCoffee.get<BaseResponse<TBrandOrderByIdResponse>>(
        `${API_SUFFIX.ORDER_API}/${id}`
    );

const getCustomerOrderById = async (id: string) =>
    await apiRequest.ecommerceCoffee.get<BaseResponse<TCustomerOrderByIdResponse>>(
        `${API_SUFFIX.ORDER_API}/${id}`
    );

const createOrder = async (data: TCreateOrderRequest) =>
    await apiRequest.ecommerceCoffee.post<BaseResponse<TCreateOrderResponse>>(
        `${API_SUFFIX.ORDER_API}`,
        data
    );

const updateOrder = async (id: string, data: TUpdateOrderRequest) =>
    await apiRequest.ecommerceCoffee.patch<BaseResponse<string>>(
        `${API_SUFFIX.ORDER_API}/${id}`, data
    );

const getPaymentLink = async (orderId: string) =>
    await apiRequest.ecommerceCoffee.get<BaseResponse<TGetPaymentLinkResponse>>(
        `${API_SUFFIX.ORDER_API}/${orderId}/payment-link`
    );
export const orderApi = {
    getBrandOrders,
    getInfiniteCustomerOrders,
    getBrandOrderById,
    getCustomerOrderById,

    createOrder,
    updateOrder,
    getPaymentLink,
};