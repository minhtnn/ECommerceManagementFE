    import { apiRequest } from "@/lib/http";
    import { TCreateProductCategory, TProductCategoryDetail, TProductCategoryList, TUpdateProductCategory } from "@/schemas/product-category.schema";
    import { BaseResponse, PaginationResponse } from "@/types/response.type";
    import { API_SUFFIX } from "./util.api";

    const getProductCategories = async (params?: any) =>
        await apiRequest.ecommerceCoffee.get<BaseResponse<PaginationResponse<TProductCategoryList>>>(`${API_SUFFIX.PRODUCT_CATEGORY_API}`, { params: params });
    const getProductCategoryById = async (id: string) =>
        await apiRequest.ecommerceCoffee.get<BaseResponse<TProductCategoryDetail>>(`${API_SUFFIX.PRODUCT_CATEGORY_API}/${id}`);
    const createProductCategory = async (data: FormData) =>
        await apiRequest.ecommerceCoffee.post<BaseResponse<TProductCategoryDetail>>(`${API_SUFFIX.PRODUCT_CATEGORY_API}`, data);
    const updateProductCategory = async (id: string, data: FormData) =>
        await apiRequest.ecommerceCoffee.patch<BaseResponse<TProductCategoryDetail>>(`${API_SUFFIX.PRODUCT_CATEGORY_API}/${id}`, data);

    export const productCategoryApi = {
        getProductCategories,
        getProductCategoryById,
        createProductCategory,
        updateProductCategory,
    };