import { apiRequest } from "@/lib/http";
import { TAccountDetailResponse, TAuthResponse } from "@/schemas/auth.schema";
import { BaseResponse } from "@/types/response.type";
import { API_SUFFIX } from "./util.api";


export const authApi = {
    getAccountDetail: async (params?: any) => {
        return apiRequest.ecommerceCoffee.get<BaseResponse<TAccountDetailResponse>>(
            `${API_SUFFIX.AUTH_API}/account-detail`, params
        );
    },
    login: async (params?: any) => {
        return apiRequest.ecommerceCoffee.post<BaseResponse<TAuthResponse>>(
            `${API_SUFFIX.AUTH_API}/login`,
            params
        );
    },
    endCustomerRegister: async (data: FormData) => {
        return apiRequest.ecommerceCoffee.post<BaseResponse<string>>(
            `${API_SUFFIX.AUTH_API}/customer-register`,
            data
        );
    },
    verifyEmail: async (params?: any) => {
        return apiRequest.ecommerceCoffee.post<BaseResponse<TAuthResponse>>(
            `${API_SUFFIX.AUTH_API}/customer-verify-email`,
            params
        );
    },
    resendOTPVerifyEmail: async (params?: any) => {
        return apiRequest.ecommerceCoffee.post<BaseResponse<void>>(
            `${API_SUFFIX.AUTH_API}/resend-customer-verify-otp-email`,
            params
        );
    },
    refresh: async () => {
        return apiRequest.ecommerceCoffee.post<BaseResponse<TAuthResponse>>(
            `${API_SUFFIX.AUTH_API}/refresh`, {}
        );
    },
    logout: async () => {
        return apiRequest.ecommerceCoffee.post<BaseResponse<void>>(
            `${API_SUFFIX.AUTH_API}/logout`,
            {}
        );
    },
    logoutAllDevices: async () => {
        return apiRequest.ecommerceCoffee.post<BaseResponse<void>>(
            `${API_SUFFIX.AUTH_API}/logout-all-devices`,
            {}
        );
    },
}

