import { apiRequest } from "@/lib/http";
import { TPostDetail, TPostList, TPublicPostDetail, TPublicPostItem } from "@/schemas/post.schema";
import { BaseResponse, InfiniteScrollResponse, PaginationResponse } from "@/types/response.type";
import { API_SUFFIX } from "./util.api";

const getPosts = async (params?: any) =>
    await apiRequest.ecommerceCoffee.get<BaseResponse<PaginationResponse<TPostList>>>(
        `${API_SUFFIX.POST_API}`, { params }
    );

const getPostById = async (id: string) =>
    await apiRequest.ecommerceCoffee.get<BaseResponse<TPostDetail>>(
        `${API_SUFFIX.POST_API}/${id}`
    );

const createPost = async (data: FormData) =>
    await apiRequest.ecommerceCoffee.post<BaseResponse<string>>(
        `${API_SUFFIX.POST_API}`, data
    );

const updatePost = async (id: string, data: FormData) =>
    await apiRequest.ecommerceCoffee.patch<BaseResponse<string>>(
        `${API_SUFFIX.POST_API}/${id}`, data
    );

const getPublicPosts = async (brandCode: string, pageSize: number, cursor?: string | null) =>
    await apiRequest.ecommerceCoffee.get<BaseResponse<InfiniteScrollResponse<TPublicPostItem>>>(
        `${API_SUFFIX.POST_API}/public/${brandCode}`,
        { params: { pageSize, cursor: cursor ?? undefined } }
    );

const getPublicPostById = async (brandCode: string, id: string) =>
    await apiRequest.ecommerceCoffee.get<BaseResponse<TPublicPostDetail>>(
        `${API_SUFFIX.POST_API}/public/${brandCode}/${id}`
    );

export const postApi = {
    getPosts,
    getPostById,
    createPost,
    updatePost,
    getPublicPosts,
    getPublicPostById,
};