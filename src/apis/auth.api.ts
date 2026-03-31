import { apiRequest } from "@/lib/http";
import { TAccountDetailResponse, TAuthResponse, TChangePasswordRequest, TForgotPasswordRequest, TForgotPasswordResponse, TResetPasswordRequest, TValidateResetTokenRequest } from "@/schemas/auth.schema";
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

const endCustomerGoogleLoginAndRegister = async (params?: any) => {
    return apiRequest.ecommerceCoffee.post<BaseResponse<TAuthResponse>>(
        `${API_SUFFIX.AUTH_API}/customer/google/login-and-register`,
        { brandCode: envConfig.BRAND_CODE, ...params }
    );
}
const endCustomerNormalRegister = async (data: FormData) => {
    return apiRequest.ecommerceCoffee.post<BaseResponse<string>>(
        `${API_SUFFIX.AUTH_API}/customer-normal-register`,
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
const refresh = async (params?: any) => {
    return apiRequest.ecommerceCoffee.post<BaseResponse<TAuthResponse>>(
        `${API_SUFFIX.AUTH_API}/refresh`, params
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

const updateAccount = async (data: FormData) => {
    data.append("brandCode", envConfig.BRAND_CODE);
    return apiRequest.ecommerceCoffee.post<BaseResponse<string>>(
        `${API_SUFFIX.AUTH_API}/update-information`,
        data
    );
};

const forgotPassword = async (data: TForgotPasswordRequest) => {
    return apiRequest.ecommerceCoffee.post<BaseResponse<TForgotPasswordResponse>>(
        `${API_SUFFIX.AUTH_API}/forgot-password`,
        {
            email: data.email,
            brandCode: envConfig.BRAND_CODE,
        }
    );
};

const validateResetToken = async (data: TValidateResetTokenRequest) => {
    return apiRequest.ecommerceCoffee.post<BaseResponse<void>>(
        `${API_SUFFIX.AUTH_API}/validate-reset-token`,
        {
            email: data.email,
            token: data.token,
            brandCode: envConfig.BRAND_CODE,
        }
    );
};

const resetPassword = async (data: TResetPasswordRequest) => {
    return apiRequest.ecommerceCoffee.post<BaseResponse<void>>(
        `${API_SUFFIX.AUTH_API}/reset-password`,
        {
            email: data.email,
            token: data.token,
            newPassword: data.newPassword,
            confirmNewPassword: data.confirmNewPassword,
            brandCode: envConfig.BRAND_CODE,
        }
    );
};

export const authApi = {
    getAccountDetail,
    login,
    endCustomerGoogleLoginAndRegister,
    endCustomerNormalRegister,
    verifyEmail,
    resendOTPVerifyEmail,
    refresh,
    logout,
    logoutAllDevices,
    changePassword,
    updateAccount,
    forgotPassword,
    validateResetToken,
    resetPassword,
}

