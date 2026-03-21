import { apiRequest } from "@/lib/http";
import envConfig from "@/schemas/config.schema";
import { TMenuProductResponse } from "@/schemas/menu-product.schema";
import { BaseResponse } from "@/types/response.type";
import { API_SUFFIX } from "./util.api";

const getMenuProducts = async (params?: any) =>
  await apiRequest.ecommerceCoffee.get<BaseResponse<TMenuProductResponse>>(
    `${API_SUFFIX.MENU_API}`,
    { params: params }
  );

const getPublicMenuProducts = async ( params?: any) =>
  await apiRequest.ecommerceCoffee.get<BaseResponse<TMenuProductResponse>>(
    `${API_SUFFIX.MENU_API}/public/${envConfig.BRAND_CODE}`,
    {
      params: {
        ...params
      }
    }
  );

export const menuProductApi = {
  getMenuProducts,
  getPublicMenuProducts,
};