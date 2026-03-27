import { apiRequest } from "@/lib/http";
import { TPostDetail, TPostList, TPublicPostDetail, TPublicPostList } from "@/schemas/post.schema";
import { BaseResponse, PaginationResponse } from "@/types/response.type";
import { API_SUFFIX } from "./util.api";
import envConfig from "@/schemas/config.schema";

const getPosts = async (params?: any) =>
    await apiRequest.ecommerceCoffee.get<BaseResponse<PaginationResponse<TPostList>>>(
        `${API_SUFFIX.POST_API}`, { params }
    );

const getPostById = async (id: string, timeZone: string) =>
    await apiRequest.ecommerceCoffee.get<BaseResponse<TPostDetail>>(
        `${API_SUFFIX.POST_API}/${id}?timeZone=${timeZone}`
    );

const createPost = async (data: FormData) =>
    await apiRequest.ecommerceCoffee.post<BaseResponse<string>>(
        `${API_SUFFIX.POST_API}`, data
    );

const updatePost = async (id: string, data: FormData) =>
    await apiRequest.ecommerceCoffee.patch<BaseResponse<string>>(
        `${API_SUFFIX.POST_API}/${id}`, data
    );

const getPublicPosts = async (params?: any) =>
    await apiRequest.ecommerceCoffee.get<BaseResponse<PaginationResponse<TPublicPostList>>>(
        `${API_SUFFIX.POST_API}/public/${envConfig.BRAND_CODE}`,
        { params }
    );

const getPublicPostById = async (brandCode: string, id: string, timeZone: string) =>
    await apiRequest.ecommerceCoffee.get<BaseResponse<TPublicPostDetail>>(
        `${API_SUFFIX.POST_API}/public/${brandCode}/${id}?timeZone=${timeZone}`
    );

export const postApi = {
    getPosts,
    getPostById,
    createPost,
    updatePost,
    getPublicPosts,
    getPublicPostById,
};