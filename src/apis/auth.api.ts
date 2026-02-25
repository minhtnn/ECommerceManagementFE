import { apiRequest } from "@/lib/http";
import { TAccountDetailResponse, TAuthResponse, TChangePasswordRequest } from "@/schemas/auth.schema";
import { BaseResponse } from "@/types/response.type";
import { API_SUFFIX } from "./util.api";
import envConfig from "@/schemas/config.schema";

const getAccountDetail = async (params?: any) => {
    return apiRequest.ecommerceCoffee.get<BaseResponse<TAccountDetailResponse>>(
        `${API_SUFFIX.AUTH_API}/account-detail`, params
    );
}
const login = async (params?: any) => {
    return apiRequest.ecommerceCoffee.post<BaseResponse<TAuthResponse>>(
        `${API_SUFFIX.AUTH_API}/login`,
        { brandCode: envConfig.BRAND_CODE, ...params }
    );
}
const endCustomerRegister = async (data: FormData) => {
    return apiRequest.ecommerceCoffee.post<BaseResponse<string>>(
        `${API_SUFFIX.AUTH_API}/customer-register`,
        data
    );
}
const verifyEmail = async (params?: any) => {
    return apiRequest.ecommerceCoffee.post<BaseResponse<TAuthResponse>>(
        `${API_SUFFIX.AUTH_API}/customer-verify-email`,
        { brandCode: envConfig.BRAND_CODE, ...params }
    );
}
const resendOTPVerifyEmail = async (params?: any) => {
    return apiRequest.ecommerceCoffee.post<BaseResponse<void>>(
        `${API_SUFFIX.AUTH_API}/resend-customer-verify-otp-email`,
        { brandCode: envConfig.BRAND_CODE, ...params }
    );
}
const refresh = async () => {
    return apiRequest.ecommerceCoffee.post<BaseResponse<TAuthResponse>>(
        `${API_SUFFIX.AUTH_API}/refresh`, {}
    );
}
const logout = async () => {
    return apiRequest.ecommerceCoffee.post<BaseResponse<void>>(
        `${API_SUFFIX.AUTH_API}/logout`,
        {}
    );
}
const logoutAllDevices = async () => {
    return apiRequest.ecommerceCoffee.post<BaseResponse<void>>(
        `${API_SUFFIX.AUTH_API}/logout-all-devices`,
        {}
    );
}
const changePassword = async (data: TChangePasswordRequest) => {
    return apiRequest.ecommerceCoffee.post<BaseResponse<void>>(
        `${API_SUFFIX.AUTH_API}/change-password`,
        { brandCode: envConfig.BRAND_CODE, ...data }
    );
}

export const authApi = {
    getAccountDetail,
    login,
    endCustomerRegister,
    verifyEmail,
    resendOTPVerifyEmail,
    refresh,
    logout,
    logoutAllDevices,
    changePassword
}

