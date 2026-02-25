
import { authApi } from "@/apis/auth.api";
import store from "@/redux/store";
import { logout, updateAccessToken } from "@/redux/user/user-slice";
import { PATH_AUTH } from "@/routes/path";
import envConfig from "@/schemas/config.schema";
import axios, { AxiosError, InternalAxiosRequestConfig, type AxiosInstance } from "axios";

const parseParams = (params: any) => {
    const keys = Object.keys(params);
    let options = "";

    keys.forEach((key) => {
        const isParamTypeObject = typeof params[key] === "object";
        const isParamTypeArray = isParamTypeObject && Array.isArray(params[key]) && params[key].length >= 0;

        if (!isParamTypeObject) {
            options += `${key}=${params[key]}&`;
        }

        if (isParamTypeObject && isParamTypeArray) {
            params[key].forEach((element: any) => {
                options += `${key}=${element}&`;
            });
        }
    });

    return options ? options.slice(0, -1) : options;
};

// Queue cho các requests đang chờ refresh
let isRefreshing = false;
let failedQueue: Array<{
    resolve: (value?: any) => void;
    reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

const request = (apiUrl: string, withAuth: boolean = true): AxiosInstance => {
    const axiosInstance = axios.create({
        baseURL: apiUrl,
        withCredentials: withAuth,
        headers: {
            "Content-Type": "application/json;charset=UTF-8",
        },
    });

    axiosInstance.interceptors.request.use((config) => {
        if (withAuth) {
            const state = store.getState();
            const accessToken = state.user.accessToken;

            if (accessToken &&
                !config.url?.includes('/refresh') &&
                !config.url?.includes('/login')) {
                config.headers.Authorization = `Bearer ${accessToken}`;
            }
        }


        if (config.method === "put" || config.method === "post" || config.method === "patch") {
            if (config.data instanceof FormData) {
                config.headers["Content-Type"] = "multipart/form-data";
            } else {
                config.headers["Content-Type"] = "application/json;charset=UTF-8";
            }
        }

        return config;
    });

    if (withAuth) {
        axiosInstance.interceptors.response.use(
            (response) => response,
            async (error: AxiosError) => {
                const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

                if (originalRequest.url?.includes('/login') || originalRequest.url?.includes('/refresh')) {
                    return Promise.reject(error);
                }

                // ✅ CHỈ REFRESH KHI NHẬN 401 (ACCESS TOKEN HẾT HẠN)
                if (error.response?.status === 401 && !originalRequest._retry) {
                    if (isRefreshing) {
                        return new Promise((resolve, reject) => {
                            failedQueue.push({ resolve, reject });
                        })
                            .then((token) => {
                                originalRequest.headers.Authorization = `Bearer ${token}`;
                                return axiosInstance(originalRequest);
                            })
                            .catch((err) => Promise.reject(err));
                    }

                    originalRequest._retry = true;
                    isRefreshing = true;

                    try {
                        const response = await authApi.refresh();

                        if (response.data.status !== 200) {
                            throw new Error(response.data.message || 'Refresh failed');
                        }

                        const newAccessToken = response.data.data.accessToken;
                        const userData = response.data.data;

                        // CẬP NHẬT REDUX
                        store.dispatch(updateAccessToken(newAccessToken));

                        // CẬP NHẬT LOCALSTORAGE
                        const currentUserInfo = localStorage.getItem("userInfo");
                        if (currentUserInfo) {
                            const userInfo = JSON.parse(currentUserInfo);
                            userInfo.accessToken = newAccessToken;
                            localStorage.setItem("userInfo", JSON.stringify(userInfo));
                        } else {
                            localStorage.setItem("userInfo", JSON.stringify(userData));
                        }

                        processQueue(null, newAccessToken);

                        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                        return axiosInstance(originalRequest);

                    } catch (refreshError: any) {
                        processQueue(refreshError, null);

                        // CLEAR ALL
                        localStorage.removeItem("userInfo");
                        store.dispatch(logout());

                        if (!window.location.pathname.includes('/login')) {
                            window.location.href = PATH_AUTH.login;
                        }

                        return Promise.reject(refreshError);
                    } finally {
                        isRefreshing = false;
                    }
                }

                return Promise.reject(error);
            }
        );
    }
    return axiosInstance;
};

const ecommerceCoffee = request(envConfig.ECOMERCE_COFFEE_API_URL);
const mapApiUrl = request(envConfig.VITE_ECOMERCE_COFFEE_MAP_API_URL, false);

export const apiRequest = {
    ecommerceCoffee,
    mapApiUrl
};
