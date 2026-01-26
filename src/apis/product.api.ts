import { apiRequest } from "@/lib/http";
import { TProductDetail, TProductList } from "@/schemas/product.schema";
import { BaseResponse, PaginationResponse } from "@/types/response.type";
import { API_SUFFIX } from "./util.api";

const getProducts = async (params?: any) =>
    await apiRequest.ecommerceCoffee.get<BaseResponse<PaginationResponse<TProductList>>>(`${API_SUFFIX.PRODUCT_API}`, { params: params });
const getProductById = async (id: string) =>
    await apiRequest.ecommerceCoffee.get<BaseResponse<TProductDetail>>(`${API_SUFFIX.PRODUCT_API}/${id}`);
const getPublicProductById = async (brandCode: string, id: string) =>
    await apiRequest.ecommerceCoffee.get<BaseResponse<TProductDetail>>(`${API_SUFFIX.PRODUCT_API}/public/${brandCode}/${id}`);
const createProduct = async (data: FormData) =>
    await apiRequest.ecommerceCoffee.post<BaseResponse<TProductDetail>>(
        `${API_SUFFIX.PRODUCT_API}`,
        data
    );
const updateProduct = async (id: string, data: FormData) =>
    await apiRequest.ecommerceCoffee.patch<BaseResponse<TProductDetail>>(
        `${API_SUFFIX.PRODUCT_API}/${id}`,
        data
    );

export const productApi = {
    getProducts,
    getProductById,
    getPublicProductById,
    createProduct,
    updateProduct,
};