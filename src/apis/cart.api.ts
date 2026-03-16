import { apiRequest } from "@/lib/http";
import { BaseResponse } from "@/types/response.type";
import { API_SUFFIX } from "./util.api";
import {
  TGetCustomerCartResponse,
  TCreateEndCustomerCartRequest,
  TUpdateEndCustomerCartRequest,
} from "@/schemas/cart.schema";

const getEndCustomerCart = async () =>
  await apiRequest.ecommerceCoffee.get<BaseResponse<TGetCustomerCartResponse>>(
    `${API_SUFFIX.END_CUSTOMER_CART_API}`
  );

const createEndCustomerCart = async (data: TCreateEndCustomerCartRequest) =>
  await apiRequest.ecommerceCoffee.post<BaseResponse<TGetCustomerCartResponse>>(
    `${API_SUFFIX.END_CUSTOMER_CART_API}`,
    data
  );

const updateEndCustomerCart = async (data: TUpdateEndCustomerCartRequest) =>
  await apiRequest.ecommerceCoffee.put<BaseResponse<TGetCustomerCartResponse>>(
    `${API_SUFFIX.END_CUSTOMER_CART_API}`,
    data
  );

export const endCustomerCartApi = {
  getEndCustomerCart,
  createEndCustomerCart,
  updateEndCustomerCart,
};