import { apiRequest } from "@/lib/http";
import { BaseResponse, PaginationResponse } from "@/types/response.type";
import { API_SUFFIX } from "./util.api";
import { TCustomerListResponse } from "@/schemas/customer.schema";

const getCustomers = async (params?: any) =>
    await apiRequest.ecommerceCoffee.get<BaseResponse<PaginationResponse<TCustomerListResponse>>>(`${API_SUFFIX.CUSTOMER_API}`, { params: params });

// const getCustomerById = async (id: string) =>
//     await apiRequest.ecommerceCoffee.get<BaseResponse<TCustomerDetailResponse>>(`${API_SUFFIX.Customer_API}/${id}`);

// const getCustomerDetails = async () =>
//     await apiRequest.ecommerceCoffee.get<BaseResponse<TCustomerDetailResponse>>(`${API_SUFFIX.Customer_API}/details`);

// const updateCustomer = async (id: string, data: FormData) =>
//     await apiRequest.ecommerceCoffee.patch<BaseResponse<string>>(
//         `${API_SUFFIX.Customer_API}/${id}`,
//         data
//     );

export const customerApi = {
    getCustomers,
    // getCustomerById,
    // getCustomerDetails,
    // updateCustomer,
};